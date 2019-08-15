<template>
  <div class="kloudsync-settings-topic-company">
    <div class="panel-header">
      Customer company list

      <div class="panel-header-right">
        <Icon style="vertical-align: middle; margin-right: 0.25em;" type="ios-search" color="#80848f" size="24"></Icon>

        <div class="header-search-wrap">
          <Input v-model="searchCompany" placeholder="Search ..."/>
        </div>
        <Button type="success" icon="plus-round" @click="handleAddCompany">Create new company</Button>
      </div>
    </div>
    <div class="panel-content-cover">
      <div class="setting-content">
        <Table :columns="companyColumns" :data="companyData" :loading="loading" no-data-text="No Company yet." size="large" stripe highlight-row></Table>
      </div>
    </div>

    <Modal v-model="modalCompanyDialog" :mask-closable="false" :title="companyDialog.Title" width="640">
      <div>
        <div style="padding: 8px 24px">
          <b>Name: </b>
          <Input v-model="companyDialog.Name" placeholder="Enter Company Name"/>
        </div>
        <div style="padding: 8px 24px">
          <b>Web Site: </b>
          <Input v-model="companyDialog.Link" placeholder="Enter Company Web Site"/>
        </div>
        <div style="padding: 8px 24px">
          <b>Note: </b>
          <Input type="textarea" :autosize='{minRows:"3",maxRows:"6"}' v-model="companyDialog.Note" placeholder="Enter Company Note" />
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="loading" @click="handleCompanyDialogOK">{{$t('Base.OK')}}</Button>
        <Button @click="handleCompanyDialogCancel">{{$t('Base.Cancel')}}</Button>
      </div>
    </Modal>

    <Modal v-model="modalContactDialog" :mask-closable="false" :title="contactDialogTitle">
      <div class="kloudsync-admin-company-contacts">
        <div class="member-list-action">
          <Input v-model="contactSearch" icon="ios-search" placeholder="Search" style="width:300px;" />
          <Button style="float:right" @click="handleAddContact">Add new contact</Button>
        </div>

        <div class="member-item" v-for="item in contactList" :key="item.ContactID">
          <span class="member-avatar"><Avatar :src="item.AvatarUrl == '' ? '/static/images/user.svg' : item.AvatarUrl" /></span>
          <span style="margin-left: 10px;">{{item.ContactName}}</span>
          <div class="panel-gutter"></div>
          <Dropdown class="member-action" placement="bottom" @on-click="handleMemberAction($event, item)">
            <span>
              <Icon size="16" type="more"></Icon>
            </span>
            <DropdownMenu slot="list">
              <DropdownItem name="remove">Remove</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div slot="footer" style="text-align: center;">
        <Button type="primary" style="width: 100px;" @click="modalContactDialog = false">{{$t('Base.OK')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<style lang="scss">
.kloudsync-settings-topic-company {
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
.kloudsync-add-company-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  td {
    padding: 5px;
  }
  td:first-of-type {
    text-align: right;
    width: 20%;
  }
  td:last-of-type {
    text-align: right;
    width: 15%;
  }
}

.kloudsync-admin-company-contacts {
  .member-list-action {
    padding: 16px 8px;
  }

  .member-item {
    display: flex;
    align-items:center;
    justify-content:flex-start;
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 3px;

    .panel-gutter {
      box-flex: 1;
      flex: 1 1 15px;
    }

    .member-action {
      opacity: 0;
      cursor: pointer;
    }
  }

  .member-item:hover {
    background: #e9eaec;
    .member-action {
      opacity: 1;
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
      searchCompany: '',
      companyColumns: [
        {
          title: 'COMPANY NAME',
          key: 'name',
          align: 'center',
        },
        {
          title: 'WEB ADDRESS',
          key: 'link',
          align: 'center',
          render: (h, params) => {
            return h("a", {
                attrs: {
                  title: 'go to "' + params.row.link + '"',
                  href: params.row.link,
                  target:'_blank'
                }
              },
              params.row.link
            );
          }
        },
        {
          title: 'CONTACTS',
          key: 'contacts',
          align: 'center',
          width: 120,
           render: (h, params) => {
            return h("a", {
                on: {
                  click: () => {
                    this.handleContactComany(params);
                  }
                },
                style: {fontWeight: 'bold'}
              },
              params.row.contacts
            );
          }
        },
        {
          title: 'CREATE DATE',
          key: 'data',
          align: 'center',
          width: 200
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
                  this.handleEditComany(params);
                }
              }
              },[h('Icon', {props: {type: 'ios-compose-outline', size: '18'}}),h("span",{style:'display:inline-block;margin-left:5px'},"Edit")]),
              h("div",{props:{name:"edit"},style:{padding:'3px 20px',textAlign:'left'},
              on:{
                click: () => {
                  this.handleContactComany(params);
                }
              }
              },[h('Icon', {props: {type: 'ios-personadd-outline', size: '18'}}),h("span",{style:'display:inline-block;margin-left:5px'},"Add contacts")]),
              h("div",{props:{name:"delete"},style:{padding:'3px 20px',textAlign:'left'},
              on:{
                click: () => {
                  this.handleDeleteCompnay(params);
                }
              }},[h('Icon', {props: {type: 'ios-trash-outline', size: '18'}}),h("span",{style:'display:inline-block;margin-left:5px'},"Delete")])
            ])]);
          }
        }
      ],
      companyData: [],
      modalCompanyDialog: false,
      companyDialog: {Id: -1, Name:"", Note:"", Link:""},
      modalContactDialog: false,
      contactDialogTitle: "contacts",
      contactCompanyId: -1,
      contactSearch: '',
      contactList:[]
    }
  },
  computed: {
    schoolId() {
      return auth.getChosenSchoolId();
    },
  },
  mounted() {
    this.loadCompanyList();
  },
  methods: {
    loadCompanyList() {
      let self = this;
      let url = GetAPIUrl() + "PTCompany/List?companyID=" + this.schoolId;

      this._getData(url, null, (result) => {
        let list = [];
        result.forEach(data => {
          let item = {
            id: data.PTCompanyID,
            name: data.CompanyName,
            link: data.WebSite,
            note: data.CompanyNote,
            contacts: data.ContactCount
          };
          list.push(item);
        });

        self.companyData = list;
      }, null);
    },
    handleCompanyDialogOK(){
      let url = GetAPIUrl() + (this.companyDialog.Id > 0 ? "PTCompany/UpdatePTCompany" : "PTCompany/CreatePTCompany");
      let data = {
        CompanyID: this.companyDialog.Id,
        AccountCompanyID: this.schoolId,
        CompanyName: this.companyDialog.Name,
        CompanyNote: this.companyDialog.Note,
        WebSite: this.companyDialog.Link
      };
      this._postData(url, data, null, (result) => {
        this.modalCompanyDialog = false;
        this.loadCompanyList();
      }, null);
    },
    handleCompanyDialogCancel(){
      this.modalCompanyDialog = false;
    },
    handleAddCompany() {
      this.companyDialog= { Title: "Add Company", Id: -1, Name: "", Note: "", Link: "" };
      this.modalCompanyDialog = true;
    },
    handleEditComany(params) {
      let data = params.row;
      this.companyDialog= { Title: "Edit Company", Id: data.id, Name: data.name, Note: data.note, Link: data.link };
      this.modalCompanyDialog = true;
    },
    handleContactComany(params) {
      this.contactList = [];
      this.contactDialogTitle = params.row.name + " contacts (" + params.row.contacts + ")";
      this.contactCompanyId = params.row.id;
      this.modalContactDialog = true;

      let self = this;
      let url = GetAPIUrl() + "PTCompanyContact/List?ptCompanyID=" + params.row.id;
      
      this._getData(url, null, (result) => {
        self.contactList = result;
      }, null);
    },
    handleDeleteCompnay(params) {

    },
    handleAddContact() {

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
    }
  }
}
</script>
