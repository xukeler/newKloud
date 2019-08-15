<template>
  <div class="kloudsync-settings-contact">
    <div class="panel-header">
      Contact list

      <div class="panel-header-right">
        <Icon style="vertical-align: middle; margin-right: 0.25em;" type="ios-search" color="#80848f" size="24"></Icon>

        <div class="header-search-wrap">
          <Input v-model="searchContact" placeholder="Search ..." @on-enter="handleSearchContact" />
        </div>
        <Button type="success" icon="plus-round" @click="handleAddContact">Add new contact</Button>
      </div>
    </div>
    <div class="panel-content-cover">
      <div class="setting-content">
        <Table :columns="contactColumns" :data="contactData" :loading="loading" no-data-text="No Contact Invited." size="large" stripe highlight-row></Table>

        <div style="margin: 16px; overflow: hidden;  text-align: left;">
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
      </div>
    </div>

    <div>
      <Modal v-model="modalSearch" :mask-closable="false" title="Search Team Member" :width="600" style="z-index: 2000; position: absolute;">
        <Input v-model="searchKey" icon="ios-search" :placeholder="$t('AddContact.PlaceholderEnterPhoneNumberOrName')" @on-enter="handleSearch" @on-click="handleSearch"/>
        <div style="height:1em;"></div>
        <Table ref="search" size="small" :no-data-text="$t('AddContact.NoContractFound')" :stripe="true" :highlight-row="true"
              :data="searchData" :columns="searchColumn" :loading="loading" height="400">
        </Table>
        
        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleSearchOK">{{$t('Base.OK')}}</Button>
          <Button @click="handleSearchCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<style lang="scss">
.kloudsync-settings-contact {
  height: 100%;
  width: 100%;

  .panel-header {
    width: 100%;
    text-align: left;
    padding: 0 20px;
    height: 65px;
    line-height: 65px;
    position: relative;
    border-bottom: 1px solid #dddee1;
    font-size: 16px;
    font-weight: bold;

    .panel-header-right {
      float: right;
      font-size: 14px;
      font-weight: normal;

      .header-search-wrap {
        display: inline-block;
        width: 200px;
        vertical-align: middle;
        margin-right: 1em;

        .ivu-input {
          border-color: transparent;
        }
      }
    }
  }

  .panel-content-cover {
    padding:24px; 
    background-color: #FBFBFD; 
    min-height: calc(100% - 65px); 
    height: calc(100% - 65px);
    width:100%;
  }

  .setting-content {
    width: 100%;
    height: 100%;
    background: #fff;
    border: 1px solid #dddee1;
    border-radius: 3px;

    .ivu-table-wrapper {
      border: none;
    }

    .table-action-icon {
      opacity: 0;
      cursor: pointer;
      margin-right: 1em;
    }

    tr:hover .table-action-icon, .ivu-table-row-highlight .table-action-icon {
      opacity: 1;
    }

    .ivu-table th {
      // background-color: #495060;
      // color: white;
      background-color: white;
      color: #80848f;
      border-bottom: 1px solid #dddee1;
      text-align: center;
    }
  }
}
</style>

<script>
import auth from "../../authenticator";

export default {
  data() {
    return {
      loading: false,
      searchContact: '',
      dataTotal: 0,
      pageSize: 10,
      pageIndex: 1,
      sortKey: 0,
      sortOrder: 1,
      roleType: '0,1,2,3,4,5,6,7,8,9',
      contactData: [],
      contactColumns: [
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
          title: 'USER',
          key: 'name',
        },
        {
          title: 'JOB ROLE',
          key: 'role',
        },
        {
          title: 'CONTACT',
          key: 'contact',
          render: (h, params) => {
            return h(
              "div", {style: {lineHeight: '2em'}}, [
                h("p", params.row.email),
                h("p", params.row.phone)
              ]
            );
          }
        },
        {
          title: 'INVITED BY',
          key: 'invited',
        },
        {
          title: " ",
          key: "action",
          width: 80,
          align:"left",
          render: (h, params) => {
            return h("Dropdown",{props:{trigger:"hover", placement: 'bottom-end'},class: 'table-action-icon'},
            [h('Icon', {props: {type: 'more', size: '16', color: 'black'}}),h('DropdownMenu',{slot:"list"},
            [ h("div",{props:{name:"edit"},style:{padding:'3px 20px',textAlign:'left'},
              on:{
                click: () => {
                  this.handleEditContact(params);
                }
              }
              },[h('Icon', {props: {type: 'ios-compose-outline', size: '18'}}),h("span",{style:'display:inline-block;margin-left:5px'},"Edit")]),              
              h("div",{props:{name:"delete"},style:{padding:'3px 20px',textAlign:'left'},
              on:{
                click: () => {
                  this.handleDeleteContact(params);
                }
              }},[h('Icon', {props: {type: 'ios-trash-outline', size: '18'}}),h("span",{style:'display:inline-block;margin-left:5px'},"Delete")])
            ])]);
          }
        }
      ],
      
      modalSearch: false,
      searchKey: '',
      searchData: [],
      searchColumn: [
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
          sortable: false
        }
      ],
    }
  },
  computed: {
    schoolId() {
      return auth.getChosenSchoolId();
    },
  },
  mounted() {
    this.readDataWithTotal();
  },
  methods: {
    refresh() {
      this.readDataWithTotal();
    },
    readDataWithTotal() {
      let self = this;

      let url = GetAPIUrl() + "SchoolContact/Count";
      url += "?schoolID=" + this.schoolId;
      url += "&roleType=" + this.roleType;
      url += "&searchText=" + this.searchContact;

      this._getData(url, null,
        data => {
          self.dataTotal = parseInt(data);
          self.calculatePage();
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
      url += "&searchText=" + this.searchContact;
      url += "&pageIndex=" + (this.pageIndex - 1);
      url += "&pageSize=" + this.pageSize;

      this._getData(url, null,
        data => {
          self._initializeData(data);
        },
        null
      );
    },
    _initializeData(data) {
      let list = [];
      for (let i = 0, count = data.length; i < count; i++) {
        let user = data[i];
        let item = {
          id: user.UserID,
          avatar: user.AvatarUrl ? user.AvatarUrl : "../../../static/images/user.svg",
          name: user.UserName,
          //gender: this._genderLabel(user.Gender),
          phone: user.Phone,
          email: user.Email,
          //role: auth.getSchoolRoleName(user.Role),
          grade: user.Grade,
          parent: user.Parent,
          detail: user
        };

        list.push(item);
      }

      this.contactData = list;
    },
    pageIndexChange(page) {
      this.pageIndex = page;
      this.readData();
    },
    pageSizeChange(data) {
      this.calculatePage();
      this.readData();
    },
    calculatePage() {
      let pageCount = Math.ceil(this.dataTotal / this.pageSize);
      if (this.pageIndex > pageCount) {
        this.pageIndex = pageCount;
      }
    },
    handleSearchContact() {
      this.refresh();
    },
    handleAddContact() {
      this.searchKey = '';
      this.searchData = [];
      this.modalSearch = true;
    },
    handleEditContact(params) {

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

          self._deleteData(url, null,
            result => {
              self.refresh();
            }, null);
        }
      });
    },
    handleSearch() {
      if (!this.searchKey) {
        this.searchData = [];
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "User/SearchContact?searchText=" + encodeURIComponent(base64encode(utf16to8(trimStr(this.searchKey))));
      this._getData(url, null, (data) => {
        self.searchData = self._initializeUsers(data);
      }, null);
    },
    _initializeUsers(data) {
      let list = [];
      for (let i = 0, count = data.length; i < count; i++) {
        let user = data[i];
        let item = {
          id: user.UserID,
          avatar: user.AvatarUrl?user.AvatarUrl:"../../../static/images/user.svg",
          name: user.Name?user.Name:user.UserName,
          gender: user.Sex === 2 ? this.$t('CourseTeachers.Female') : this.$t('CourseTeachers.Male'),
          phone: user.Phone,
          email: user.Email,
          detail: user
        };

        list.push(item);
      }
      return list;
    },
    handleSearchOK() {
      let selected = this.$refs.search.getSelection();
      if (selected.length === 0) {
        this.modalSearch = false;
        return;
      }

      let memberList = "";
      for (let i = 0; i < selected.length; i++) {
        memberList += selected[i].id + ",";
      }

      let roleId = auth.SchoolRole.OfficeStaff;
      let self = this;
      let url = GetAPIUrl() + "SchoolContact/AddContactList?schoolID=" + this.schoolId + "&roleID=" + roleId + "&userIDs=" + memberList;

      this._postData(url, {}, null, (result) => {
          self.modalSearch = false;
          self.refresh();
      }, null);
    },
    handleSearchCancel() {
      this.modalSearch = false;
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
            // self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          // self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
          console.log(xhr);

          if (error && typeof error === "function") {
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
            self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
            console.log(result);

            if (error && typeof error === 'function') {
              error(result);
            }
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
          console.log(xhr);

          if (error && typeof error === 'function') {
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
            self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    }
  }
}
</script>

