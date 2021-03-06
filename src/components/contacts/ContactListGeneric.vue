<template>
  <div class="contact-list-generic">
    <Table :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true" :loading="loading"
           :data="tableData" :columns="tableColumn"
           @on-sort-change="tableSortChange" @on-row-click="tableRowClick">
    </Table>

    <div style="margin: 16px 0; overflow: hidden;  text-align: left;">
      <Select v-model="pageSize" style="width:150px;" @on-change="pageSizeChange">
        <Option :value="10">{{$t('Common.Page10')}}</Option>
        <Option :value="25">{{$t('Common.Page25')}}</Option>
        <Option :value="50">{{$t('Common.Page50')}}</Option>
        <Option :value="100">{{$t('Common.Page100')}}</Option>
      </Select>

      <div style="float: right; display: flex; align-items: center;">
        <div style="display: inline-block; margin-right: 1em;">{{dataTotal}} {{$t('Common.TotalPeople')}}</div>
        <div style="display: inline-block">
          <Page :total="dataTotal" :current="pageIndex" :page-size="pageSize" @on-change="pageIndexChange"></Page>
        </div>
      </div>
    </div>

    <Modal v-model="modalEditContact" :mask-closable="false" :title="$t('ContactDetail.ContactInformation')" :width="600">
      <edit-contact ref="editContact" :contactId="editingContactId" :school-id="schoolId"></edit-contact>

      <div slot="footer">
        <Button type="primary" :loading="loading" @click="handleEditContactOK">{{$t('Base.OK')}}</Button>
        <Button @click="handleEditContactCancel">{{$t('Base.Cancel')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<style lang="scss">
.contact-list-generic {
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
  tr{
    cursor: pointer;
  }
  tr:hover .table-action-icon,
  .ivu-table-row-highlight .table-action-icon {
    opacity: 1;
  }
}
</style>

<script>
import auth from "../../authenticator";
import friends from "../../friends";
import EditContact from './EditContact';

export default {
  components: {
    EditContact,
  },
  props: {
    onContactSelected: Function,
    hideDetailPanel: Function,
    listType: String,
    schoolId: {
      type: Number,
      default: -1
    },
    folderId: {
      type: Number,
      default: -1
    },
  },
  data() {
    return {
      loading: false,
      canEdit: IsKlassroom(),
      canDelete: true, //auth.canDeleteContact(),
      dataTotal: 0,
      pageSize: 10,
      pageIndex: 1,
      sortKey: 0,
      sortOrder: 1,
      tableData: [],
      tableColumn: [
        {
          title: " ",
          key: "avatar",
          sortable: false,
          width: 80,
          render: (h, params) => {
            return h("Avatar", {
              props: {
                size: "large",
                src: params.row.avatar
              }
            });
          }
        },
        {
          title: this.$t("Common.Name"),
          key: "name",
          sortable: true
        },
        {
          title: this.$t("Common.Gender"),
          key: "gender",
          sortable: false
        },
        {
          title: this.$t("Common.Phone"),
          key: "phone",
          sortable: false
        },
        {
          title: this.$t("Common.Email"),
          key: "email",
          sortable: false
        },
        {
          title: " ",
          key: "action",
          width: 100,
          render: (h, params) => {
            if (this.canEdit || this.canDelete) {
              let iconArray = [];
              if (this.canEdit) {
                iconArray.push(
                  h(
                    "span",
                    {
                      class: "table-action-icon",
                      attrs: { title: "Edit" },
                      on: {
                        click: () => {
                          this.handleEditContact(params);
                        }
                      }
                    },
                    [
                      h("Icon", {
                        props: {
                          type: "edit",
                          size: "16",
                          color: "#2d8cf0"
                        }
                      })
                    ]
                  )
                );
              }
              if (this.canDelete) {
                iconArray.push(
                  h(
                    "span",
                    {
                      class: "table-action-icon",
                      attrs: { title: this.$t("Common.Delete") },
                      on: {
                        click: () => {
                          this.handleDeleteContact(params);
                        }
                      }
                    },
                    [
                      h("Icon", {
                        props: {
                          type: "close-round",
                          size: "16",
                          color: "#ed3f14"
                        }
                      })
                    ]
                  )
                );
              }
              return h("div", iconArray);
            } else {
              return h("div");
            }
          }
        }
      ],
      modalEditContact: false,
      editingContactId: 0,
    };
  },
  computed: {
    roleType() {
      switch (this.listType) {
        default:
          return auth.SchoolRole.Unknown;

        case "prospect":
          return auth.SchoolRole.Prospects;

        case "independent-teacher":
          return auth.SchoolRole.IndependentTeachers;

        case "student":
          return auth.SchoolRole.Students;

        case "parent":
          return auth.SchoolRole.Parents;

        case "employee":
          return auth.SchoolRole.Employees;

        case "teacher":
          return auth.SchoolRole.Teachers;
      }
    }
  },
  mounted() {
    if (this.listType === "student") {
      this.tableColumn.splice(3, 0, {
        title: this.$t("Common.Grade"),
        key: "grade"
      });

      this.tableColumn.splice(4, 0, {
        title: this.$t("Common.Parents"),
        key: "parent"
      });
    } else if (this.listType === "employee") {
      this.tableColumn.splice(2, 0, {
        title: this.$t("Common.Role"),
        key: "role",
        sortable: true
      });
    }
  },
  methods: {
    //删除后更新页码
    afterDelUpdatedIndex(){
      let total=this.dataTotal;
      let pageSize=this.pageSize;
      let maxInt=Math.ceil(total/pageSize);
      if(maxInt<this.pageIndex && maxInt!=0){
        this.pageIndex=maxInt;
      }
    },
    initialize() {
      if (this.tableData.length === 0) this.readDataWithTotal();
    },
    reset() {
      this.pageIndex = 1;
    },
    refresh() {
      this.readDataWithTotal();
    },
    readDataWithTotal() {
      let self = this;

      let url = GetAPIUrl() + "SchoolContact/Count";
      url += "?schoolID=" + this.schoolId;
      url += "&roleType=" + this.roleType;
      url += "&folderID=" + this.folderId;

      this._getData(
        url,
        null,
        data => {
          self.dataTotal = parseInt(data);
          self.afterDelUpdatedIndex();
          self.readData();
        },
        null
      );
    },
    readData() {
      let self = this;

      let url = GetAPIUrl() + "SchoolContact/List";
      url += "?schoolID=" + this.schoolId;
      url += "&roleType=" + this.roleType;
      url += "&folderID=" + this.folderId;
      url += "&pageIndex=" + (this.pageIndex - 1);
      url += "&pageSize=" + this.pageSize;

      this._getData(
        url,
        null,
        data => {
          self.initializeData(data);
        },
        null
      );
    },
    initializeData(data) {
      let list = [];
      for (let i = 0, count = data.length; i < count; i++) {
        let user = data[i];
        let item = {
          id: user.UserID,
          avatar: user.AvatarUrl
            ? user.AvatarUrl
            : "../../../static/images/user.svg",
          name: user.UserName,
          gender: this._genderLabel(user.Gender),
          phone: user.Phone,
          email: user.Email,
          role: auth.getSchoolRoleName(user.Role),
          grade: user.Grade,
          parent: user.Parent,
          detail: user
        };

        list.push(item);
      }

      this.tableData = list;
    },
    _genderLabel(gender) {
      switch (gender) {
        case 1:
          return this.$t('CourseTeachers.Male');
        case 2:
          return this.$t('CourseTeachers.Female');
        default:
          return this.$t('CourseTeachers.Other');
      }
    },
    tableSortChange(params) {
      switch (params.key) {
      }

      if (params.order === "asc") this.sortOrder = 0;
      else this.sortOrder = 1;
    },
    tableRowClick(row) {
      if (this.onContactSelected) {
        this.onContactSelected(row.id);
      }
    },
    handleEditContact(params) {
      this.editingContactId = params.row.id;
      this.modalEditContact = true;
      this.$nextTick(() => {
        this.$refs.editContact.refresh();
      });
    },
    handleEditContactOK() {
        this.loading = true;
        this.$refs.editContact.saveData(() => {
          this.loading = false;
          this.modalEditContact = false;
          this.refresh();
        }, () => {
          this.loading = false;
        });
    },
    handleEditContactCancel() {
      this.modalEditContact = false;
    },
    handleDeleteContact(params) {
      let self = this;

      this.$Modal.confirm({
        title: self.$t("ContactListGeneric.DeletecontactTitle"),
        content: self.$t("ContactListGeneric.DeletecontactContent"),
        okText: self.$t("Common.Delete"),
        cancelText: self.$t("Base.Cancel"),
        onOk: () => {
          let id = params.row.id;
          let url = GetAPIUrl() + "SchoolContact/DeleteContact";
          url += "?schoolID=" + this.schoolId;
          url += "&contactID=" + id;

          self._deleteData(
            url,
            null,
            result => {
              self.refresh();
              if (self.hideDetailPanel) {
                  self.hideDetailPanel();
                }
            },
            null
          );
        }
      });
    },
    pageIndexChange(page) {
      this.pageIndex = page;
      this.readData();
    },
    pageSizeChange(data) {
      this.pageIndex = 1;
      this.readData();
    },
    _getData(url, before, success, error) {
      if (before && typeof before === "function") {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.loading = false;
            self.$Loading.error();
            // self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          // self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    },
    _deleteData(url, before, success, error) {
      if (before && typeof before === "function") {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: "DELETE",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    }
  }
};
</script>
