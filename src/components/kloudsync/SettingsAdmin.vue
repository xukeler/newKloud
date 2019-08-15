<template>
  <div class="kloudsync-settings-admin">
    <div class="panel-header">
      Admin user list

      <div class="panel-header-right">
        <!-- <Icon style="vertical-align: middle; margin-right: 0.25em;" type="ios-search" color="#80848f" size="24"></Icon> -->

        <div class="header-search-wrap">
          <Input v-model="searchAdmin" placeholder="Search ..." icon="ios-search" @on-enter="handleSearchAdmin" @on-click="handleSearchAdmin"/>
        </div>
        <Button :disabled="!isCompanyOwnerOrAdmin" type="success" icon="plus-round" @click="handleAddAdmin">Add admin user</Button>
      </div>
    </div>
    <div class="panel-content-cover">
      <div class="setting-content">
        <Table :columns="adminColumns" :data="adminData" :loading="loading" no-data-text="No Admin Assigned." size="large" stripe highlight-row></Table>

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
      <Modal v-model="modalAddAdmin" :mask-closable="false" title="Add Admin" :width="800">
        <div style="padding:10px 0px">
          <Input v-model="searchContact" placeholder="Enter phone number or user name ..." icon="ios-search" @on-enter="handleSearchContact" @on-click="handleSearchContact"/>
        </div>

        <Table height="550" :columns="contactColumns" :data="contactData" :loading="loading"  @on-selection-change="contactSelectionChanged" no-data-text="No Contact Invited." stripe highlight-row></Table>

        <div style="margin: 16px 0; overflow: hidden;  text-align: left;">
          <Select v-model="contactPageSize" style="width:150px;" @on-change="contactPageSizeChange">
            <Option :value="10">{{$t('Common.Page10')}}</Option>
            <Option :value="25">{{$t('Common.Page25')}}</Option>
            <Option :value="50">{{$t('Common.Page50')}}</Option>
            <Option :value="100">{{$t('Common.Page100')}}</Option>
          </Select>

          <div style="float: right; display: flex; align-items: center;">
            <div style="display: inline-block; margin-right: 1em;">{{contactDataTotal}} {{$t('Common.TotalPeople')}}</div>
            <div style="display: inline-block">
              <Page :total="contactDataTotal" :current="contactPageIndex" :page-size="contactPageSize" @on-change="contactPageIndexChange"></Page>
            </div>
          </div>
        </div>
        
        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleAddAdminOK">{{$t('Base.OK')}}</Button>
          <Button @click="handleAddAdminCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<style lang="scss">
.kloudsync-settings-admin {
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
          // border-color: transparent;
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
import kloudsyncIndex from "../../common/kloudsync/index.js";

export default {
  data() {
    return {
      loading: false,
      searchAdmin: '',
      dataTotal: 0,
      pageSize: 10,
      pageIndex: 1,
      sortKey: 0,
      sortOrder: 1,
      roleType: '7,8',
      adminData: [],
      adminColumns: [
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
          title: 'STATUS',
          key: 'status',
        },
        {
          title: 'LAST LOGIN',
          key: 'lastLogin',
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
                  this.handleEditAdmin(params);
                }
              }
              },[h('Icon', {props: {type: 'ios-compose-outline', size: '18'}}),h("span",{style:'display:inline-block;margin-left:5px'},"Edit")]),              
              h("div",{props:{name:"delete"},style:{padding:'3px 20px',textAlign:'left'},
              on:{
                click: () => {
                  this.handleDeleteAdmin(params);
                }
              }},[h('Icon', {props: {type: 'ios-trash-outline', size: '18'}}),h("span",{style:'display:inline-block;margin-left:5px'},"Delete")])
            ])]);
          }
        }
      ],
      
      modalAddAdmin: false,
      searchContact: '',
      contactSelected: [],
      contactCurrentSelected: [],      
      contactData: [],
      contactColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
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
      ],
      contactDataTotal: 0,
      contactPageSize: 10,
      contactPageIndex: 1,
      contactSortKey: 0,
      contactSortOrder: 1,
      contactRoleType: '0,1,2,3,4,5,6,7,8,9',

      currentCompanyMemberType:'',
    }
  },
  computed: {
    schoolId() {
      return auth.getChosenSchoolId();
    },
    isCompanyOwnerOrAdmin(){
      return this.currentCompanyMemberType == 7 || this.currentCompanyMemberType == 8;
    },
  },
  mounted() {
    this.refresh();
    kloudsyncIndex.getCompanyRole(this.schoolId).then((res)=>{
      this.currentCompanyMemberType = res;
    });
  },
  methods: {
    handleSearchContact(){
      this.contactPageIndex = 1;
      this.readContactDataWithTotal();
    },
    refresh() {
      this.readDataWithTotal();
    },
    readDataWithTotal() {
      let self = this;

      let url = GetAPIUrl() + "SchoolContact/Count";
      url += "?schoolID=" + this.schoolId;
      url += "&roleType=" + this.roleType;
      url += "&searchText=" + this.searchAdmin;

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
      url += "&searchText=" + this.searchAdmin;
      url += "&pageIndex=" + (this.pageIndex - 1);
      url += "&pageSize=" + this.pageSize;

      this._getData(url, null,
        data => {
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

          self.adminData = list;
        },
        null
      );
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
    handleSearchAdmin() {
      this.refresh();
    },
    handleAddAdmin() {
      this.contactPageIndex = 1;
      this.contactDataTotal = 0;
      this.contactSelected = [];
      this.contactCurrentSelected = [];
      this.modalAddAdmin = true;
      this.readContactDataWithTotal();
    }, 
    readContactDataWithTotal() {
      let self = this;

      let url = GetAPIUrl() + "SchoolContact/Count";
      url += "?schoolID=" + this.schoolId;
      url += "&roleType=" + this.contactRoleType;
      url += "&searchText=" + encodeURIComponent(base64encode(utf16to8(trimStr(this.searchContact))));

      this._getData(url, null,
        data => {
          self.contactDataTotal = parseInt(data);
          self.readContactData();
        },
        null
      );
    },
    readContactData() {
      this.mergeSelection();

      let self = this;

      let url = GetAPIUrl() + "SchoolContact/List";
      url += "?schoolID=" + this.schoolId;
      url += "&roleType=" + this.contactRoleType;
      url += "&searchText=" + encodeURIComponent(base64encode(utf16to8(trimStr(this.searchContact))));
      url += "&pageIndex=" + (this.contactPageIndex - 1);
      url += "&pageSize=" + this.contactPageSize;

      this._getData(url, null,
        data => {
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
              detail: user,
              _checked: user.Role == 7 || user.Role == 8 || self.contactSelected.indexOf(user.UserID) >= 0,
              _disabled: user.Role == 7 || user.Role == 8
            };

            list.push(item);
          }
          self.contactData = list;
        },
        null
      );
    },
    contactSelectionChanged(selection) {
      this.contactCurrentSelected = [];
      for(let i = 0; i < selection.length; i++) {
        if (!selection[i]._disabled) {
          this.contactCurrentSelected.push(selection[i].id);
        }
      }
    },
    mergeSelection() {
      this.contactData.forEach(item => {
        let index = this.contactSelected.indexOf(item.id);
        if (index >= 0) {
          this.contactSelected.splice(index, 1);
        }
      });
      this.contactCurrentSelected.forEach(id => {
        let index = this.contactSelected.indexOf(id);
        if (index < 0) {
          this.contactSelected.push(id);
        }     
      });
      this.contactCurrentSelected = [];
    },
    contactPageIndexChange(page) {
      this.contactPageIndex = page;
      this.readContactData();
    },
    contactPageSizeChange(data) {
      this.calculateContactPage();
      this.readContactData();
    },
    calculateContactPage() {
      let pageCount = Math.ceil(this.contactDataTotal / this.contactPageSize);
      if (this.contactPageIndex > pageCount) {
        this.contactPageIndex = pageCount;
      }
    },
    handleAddAdminOK() {
      this.mergeSelection();
      if (this.contactSelected.length == 0) {
        this.modalAddAdmin = false;
        return
      }

      let self = this;

      let url = GetAPIUrl() + "SchoolContact/ChangeContactRole";
      url += "?schoolId=" + this.schoolId;
      url += "&roleId=7"; // 7 is admin
      url += "&userId=" + this.contactSelected.join();

      this._postData(url, {}, null,
        result => {
          this.modalAddAdmin = false;
          self.refresh();
        },
        null
      );
    },
    handleAddAdminCancel() {
      this.modalAddAdmin = false;
    },
    handleEditAdmin(params) {

    },
    handleDeleteAdmin(params) {

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
          // self.$Message.error(xhr.status + ": " + xhr.statusText);
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
          self.$Message.error(xhr.status + ": " + xhr.statusText);
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

