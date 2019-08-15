<template>
  <div class="classes-list">
    <Table no-data-text="No Data" :stripe="true" :highlight-row="true" :loading="loading"
           :data="tableData" :columns="tableColumn"
           @on-sort-change="tableSortChange" @on-row-click="tableRowClick">
    </Table>

    <div style="margin: 16px 0; overflow: hidden;  text-align: left;">
      <Select v-model="pageSize" style="width:150px;" @on-change="pageSizeChange">
        <Option :value="10">10 / Page</Option>
        <Option :value="25">25 / Page</Option>
        <Option :value="50">50 / Page</Option>
        <Option :value="100">100 / Page</Option>
      </Select>

      <div style="float: right; display: flex; align-items: center;">
        <div style="display: inline-block; margin-right: 1em;">{{dataTotal}} Total Course</div>
        <div style="display: inline-block">
          <Page :total="dataTotal" :current="pageIndex" :page-size="pageSize" @on-change="pageIndexChange"></Page>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .classes-list {

    .ivu-table-wrapper {
      border-left: 0;
    }
    .ivu-table::after {
      width: 0;
    }

    .course-list-action {
      opacity: 0;
    }
    .ivu-table-row-hover .course-list-action {
      opacity: 1;
    }

    .table-action-icon {
      opacity: 0;
      cursor: pointer;
      margin-right: 1em;
    }

    tr:hover .table-action-icon, .ivu-table-row-highlight .table-action-icon {
      opacity: 1;
    }
  }
</style>

<script>
  import auth from '../../authenticator';
  import friends from '../../friends';

  export default {
    props: {
      onContactSelected: Function,
      listType: String,
      schoolId: {
        type: Number,
        default: -1
      }
    },
    data () {
      return {
        loading: false,
        canDelete: auth.canDeleteContact(),
        dataTotal: 0,
        pageSize: 10,
        pageIndex: 1,
        sortKey: 0,
        sortOrder: 1,
        tableData: [],
        tableColumn: [
          {
            title: ' ',
            key: '',
            sortable: false,
            width: 80,
          },
          {
            title: 'Classname',
            key: 'classname',
            sortable: true,
          },
          {
            title: 'Numbers',
            key: 'numbers',
            sortable: false,
          },
          {
            title: 'Courses',
            key: 'courses',
            sortable: false
          },
          {
            title: 'Year',
            key: 'year',
            sortable: false
          },
          {
            title: 'Department',
            key: 'department',
            sortable: false
          },
          {
            title: ' ',
            key: 'action',
            width: 50,
            render: (h, params) => {
              if (this.canDelete) {
                return h('div', [
                  h('span', {
                      class: 'table-action-icon', attrs: {title: 'Delete'}, on: {
                        click: () => {
                          this.handleDeleteContact(params);
                        }
                      }
                    },
                    [h('Icon', {props: {type: 'close-round', size: '16', color: '#ed3f14'}})])
                ]);
              }
              else {
                return h('div');
              }
            }
          }
        ]
      };
    },
    computed: {
      roleType() {
        switch (this.listType) {
          default:
            return auth.SchoolRole.Unknown;
            
          case 'prospect':
            return auth.SchoolRole.Prospects;

          case 'teacher':
            return auth.SchoolRole.IndependentTeachers;

          case 'student':
            return auth.SchoolRole.Students;

          case 'parent':
            return auth.SchoolRole.Parents;

          case 'employee':
            return auth.SchoolRole.Employees;
        }
      }
    },
    mounted() {
      if (this.listType === 'student') {
        this.tableColumn.splice(3, 0, {
          title: 'Grade',
          key: 'grade'
        });

        this.tableColumn.splice(4, 0, {
          title: 'Parent(s)',
          key: 'parent'
        });
      }
      else if (this.listType === 'employee') {
        this.tableColumn.splice(2, 0, {
          title: 'Role',
          key: 'role',
          sortable: true
        });
      }
    },
    methods: {
      initialize() {
        if (this.tableData.length === 0)
          this.readDataWithTotal();
      },
      refresh() {
        this.readDataWithTotal();
      },
      readDataWithTotal() {
        let self = this;

        let url = GetAPIUrl() + "SchoolContact/Count?schoolID=" + this.schoolId + "&roleType=" + this.roleType;

        this._getData(url, null, (data) => {
          self.dataTotal = parseInt(data);
          self.readData();
        }, null);
      },
      readData() {
        let self = this;

        let url = GetAPIUrl() + "SchoolContact/List?schoolID=" + this.schoolId + "&roleType=" + this.roleType + "&pageIndex=" + (this.pageIndex - 1) + "&pageSize=" + this.pageSize;;
        this._getData(url, null, (data) => {
          self.initializeData(data);
        }, null);
      },
      initializeData(data) {
        let list = [];
        for (let i = 0, count = data.length; i < count; i++){
          let user = data[i];
          let item = {
            id: user.UserID,
            avatar: user.AvatarUrl,
            name: user.UserName,
            gender: this._genderLabel(user.Gender),
            phone: user.Phone,
            email: user.Email,
            role: auth.getSchoolRoleName(user.Role),
            grade: user.Grade,
            parent: user.Parents,
            detail: user
          };

          list.push(item);
        }

        this.tableData = list;
      },
      _genderLabel(gender) {
        switch (gender) {
          case 1:
            return 'Male';
          case 2:
            return 'Female';
          default:
            return 'Other';
        }
      },
      tableSortChange(params) {
        switch (params.key) {
        }

        if (params.order === 'asc')
          this.sortOrder = 0;
        else
          this.sortOrder = 1;
      },
      tableRowClick(row) {
        if (this.onContactSelected) {
          this.onContactSelected(row.id);
        }
      },
      handleDeleteContact(params) {
        let self = this;

        this.$Modal.confirm({
          title: "Delete contact",
          content: "Are you sure you want to delete this contact?",
          okText: "Delete",
          cancelText: "Cancel",
          onOk: () => {
            let id = params.row.id;
            let url = GetAPIUrl() + "SchoolContact/DeleteContact?schoolID=" + this.schoolId + "&contactID=" + id;

            self._deleteData(url, null, (result) => {
              self.refresh();
            }, null);
          }
        });
      },
      pageIndexChange (page) {
        this.pageIndex = page;
        this.readData();
      },
      pageSizeChange (data) {
        this.pageIndex = 1;
        this.readData();
      },
      _getData(url, before, success, error) {
        if (before && typeof before === 'function') {
          before();
        }

        this.loading = true;
        this.$Loading.start();

        let self = this;
        $.ajax({
          type: 'GET',
          url: url,
          beforeSend: function (request) {
            request.setRequestHeader("UserToken", auth.getUserToken());
          },
          success: function (result) {
            if (result.RetCode === 0) {
              self.loading = false;
              self.$Loading.finish();

              if (success && typeof success === 'function') {
                success(result.RetData);
              }
            }
            else { // error
              self.loading = false;
              self.$Loading.error();
              self.$Message.error(result.ErrorMessage);
              console.log(result);

              if (error && typeof error === 'function') {
                error(result);
              }
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(xhr.status + ': ' + xhr.statusText);
            console.log(xhr);

            if (error && typeof error === 'function') {
              error();
            }
          }
        });
      },
      _deleteData(url, before, success, error) {
        if (before && typeof before === 'function') {
          before();
        }

        this.loading = true;
        this.$Loading.start();

        let self = this;
        $.ajax({
          type: 'DELETE',
          url: url,
          beforeSend: function (request) {
            request.setRequestHeader("UserToken", auth.getUserToken());
          },
          success: function (result) {
            if (result.RetCode === 0) {
              self.loading = false;
              self.$Loading.finish();

              if (success && typeof success === 'function') {
                success(result.RetData);
              }
            }
            else { // error
              self.loading = false;
              self.$Loading.error();
              self.$Message.error(result.ErrorMessage);
              console.log(result);

              if (error && typeof error === 'function') {
                error(result);
              }
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(xhr.status + ': ' + xhr.statusText);
            console.log(xhr);

            if (error && typeof error === 'function') {
              error();
            }
          }
        });
      },
    }
  }
</script>
