<template>
  <div id="linkEmployee" class="link-employee-class">
    <Table :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true" :loading="loading"
           :data="tableData" :columns="tableColumn" @on-selection-change="handleSelectionChanged">
    </Table>
  </div>
</template>

<style lang="scss">
  .link-employee-class {

    .ivu-table th {
      background-color: #495060;
      color: white;
    }

    .ivu-table-row-highlight td, .ivu-table-stripe .ivu-table-body tr.ivu-table-row-highlight:nth-child(2n) td {
      background-color: #aad5ff;
      //color: white;
    }
  }
</style>

<script>
  import auth from '../../authenticator';

  export default {
    props: {
      contactId: Number,
      schoolId: Number
    },
    data() {
      return {
        initialized: false,
        loading: false,
        tableData: [],
        tableColumn: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: ' ',
            key: 'avatar',
            sortable: false,
            width: 80,
            render: (h, params) => {
              return h('Avatar', {
                props: {
                  size: 'large',
                  src: params.row.avatar
                }
              });
            }
          },
          {
            title: this.$t("Common.Name"),
            key: 'name',
            sortable: true,
          },
          {
            title: this.$t("Common.Phone"),
            key: 'phone',
            sortable: true
          }
        ],
        selection: []
      };
    },
    methods: {
      initialize() {
        this.readSelection();
      },
      refresh() {
        this.readSelection();
      },
      readSelection() {
        let self = this;

        let url = GetAPIUrl() + "SchoolContact/GetLinkedEmployee?schoolID=" + this.schoolId + "&userID=" + this.contactId;
        this._getData(url, null, (data) => {
          self.selection = data.split(',').map(Number);
          self.readEmployee();
        }, null);
      },
      readEmployee() {
        let self = this;

        let url = GetAPIUrl() + "SchoolContact/List?schoolID=" + this.schoolId + "&roleType=" + auth.SchoolRole.Employees + "&pageIndex=-1";
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
            gender: user.Gender,
            phone: user.Phone,
            email: user.Email,
            role: auth.getSchoolRoleName(user.Role),
            _checked: this.selection.includes(user.UserID),
            detail: user
          };

          list.push(item);
        }

        this.tableData = list;
      },
      saveData(successCallback, errorCallback) {
        let employees = this.selection.join(',');

        let url = GetAPIUrl() + "SchoolContact/SetLinkedEmployee?schoolID=" + this.schoolId + "&userID=" +  + this.contactId + "&employees=" + employees;
        this._postData(url, {}, null, (result) => {
          if (successCallback && typeof successCallback === 'function')
            successCallback();
        }, (error) => {
          if (errorCallback && typeof errorCallback === 'function')
            errorCallback();
        });
      },
      handleSelectionChanged(selection) {
        this.selection = [];
        for(let i = 0; i < selection.length; i++) {
          this.selection.push(selection[i].id);
        }
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
      _postData(url, data, before, success, error) {
        if (before && typeof before === 'function') {
          before();
        }

        this.loading = true;
        this.$Loading.start();

        let self = this;
        $.ajax({
          type: 'POST',
          url: url,
          contentType: 'application/json; charset=utf-8',
          dataType: 'text',
          data: JSON.stringify(data),
          beforeSend: function (request) {
            request.setRequestHeader("UserToken", auth.getUserToken());
          },
          success: function (resultString) {
            let result = JSON.parse(resultString);
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
      }
    }
  }
</script>
