<template>
  <div class="kloadsync-catalog-info">
    <div class="type-name">{{typeName}} Property</div>
    <div class="catalog-name">
      <div class="catalog-icon"><Icon type="ios-people" size="60"></Icon></div>
      <div style="padding-left: 70px;">
        <div style="margin-bottom: 0.5em;">
          {{typeName}} Name
          <Dropdown style="float:right" placement="bottom-end" @on-click="handleCatalogAction">
            <span>
              <Icon size="16" type="more"></Icon>
            </span>
            <DropdownMenu slot="list">
              <DropdownItem name="delete" :disabled="!isOwnerAdmin">Delete {{typeName}}</DropdownItem>
              <DropdownItem name="quit" :disabled="isOwnerAdmin">Quit {{typeName}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <Input v-model="catalogName" placeholder="Name" />
      </div>      
    </div>
    <div class="catalog-members">
      <div class="member-item" style="cursor: pointer; color:#2d8cf0">
        <Dropdown placement="bottom" @on-click="handleAddMemberAction">
          <div style="display:flex;align-items:center;justify-content: center;">
            <Icon type="ios-plus" size="32"></Icon>
            <span style="margin-left: 10px;">Invite new</span>
          </div>
          <DropdownMenu slot="list">
            <DropdownItem name="search">Search Team Member</DropdownItem>
            <DropdownItem name="invite">Invite New</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div class="member-item" v-for="item in memberList" :key="item.MemberID">
        <span class="member-avatar"><Avatar :src="item.MemberAvatar == '' ? '/static/images/user.svg' : item.MemberAvatar" /></span>
        <span style="margin-left: 10px;">{{item.MemberName}}</span>
        <span style="margin-left: 10px; color: #80848f; font-size: smaller;" v-show="item.MemberType == 2">(Owner)</span>
        <span style="margin-left: 10px; color: #80848f; font-size: smaller;" v-show="item.MemberType == 1">(Admin)</span>
        <div class="panel-space"></div>
        <Dropdown class="member-action" placement="bottom-end" @on-click="handleMemberAction($event, item)">
          <span>
            <Icon size="16" type="more"></Icon>
          </span>
          <DropdownMenu slot="list">
            <DropdownItem name="chat">Send Chat Request</DropdownItem>
            <DropdownItem name="admin" :disabled="item.MemberType == 1 || item.MemberType == 2 || !isOwnerAdmin">Set as Space Admin</DropdownItem>
            <DropdownItem name="remove" :disabled="item.MemberType == 2 || !isOwnerAdmin">Remove from Space</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="catalog-action">
      <Button shape="circle" type="primary" @click="handleSave">Save</Button>
      <Button shape="circle" style="margin-left:3em;" @click="handleCancel">Cancel</Button>
    </div>

    <div>
      <Modal v-model="modalSearch" :mask-closable="false" title="Search Team Member" :width="600">
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

      <Modal v-model="modalInvite" :mask-closable="false" title="Invite New Team Member">
        <table class="kloudsync-invite-table">
          <tr>
            <td>Phone: </td>
            <td><Input v-model="invitePhone" placeholder="Phone Number"/></td>
            <td></td>
          </tr>
          <tr>
            <td>Email: </td>
            <td><Input v-model="inviteEmail" placeholder="Email Address"/></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td><Checkbox v-model="inviteInternal">Set as "internal team member"</Checkbox></td>
            <td></td>
          </tr>
        </table>
        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleInviteOK">{{$t('Base.OK')}}</Button>
          <Button @click="handleInviteCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalMerge" :mask-closable="false" title="Delete Space">
        <div class="kloudsync-merge-space">
          <h4>Before you delete the space, you need to merge the space to current one.</h4>
          <p>&nbsp;</p>
          <p>Current</p>
          <p class="current-space">{{currentTeam.name}} / {{currentSpace.name}}</p>
          <p>&nbsp;</p>
          <p>Select Team</p>
          <Select v-model="mergeTeam" placeholder="Please select a team">
            <Option v-for="item in teamFullList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
          <p>&nbsp;</p>
          <p>Select Space</p>
          <Select v-model="mergeSpace" placeholder="Please select a space">
            <Option v-for="item in spaceFullList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </div>
        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleDeleteSpaceOK">{{$t('Base.OK')}}</Button>
          <Button @click="modalMerge = false;">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<style lang="scss">
.kloadsync-catalog-info {
  text-align: left;

  .type-name {
    font-size: 16px;
    font-weight: bold;
  }

  .catalog-name {
    padding: 24px 16px;
    border-bottom: 2px solid #dddee1;

    .catalog-icon {
      float: left;
    }
  }

  .catalog-members {
    padding: 20px 10px;
    border-bottom: 2px solid #dddee1;

    .member-item {
      display: flex;
      align-items:center;
      justify-content:flex-start;
      padding: 5px;
      font-size: 14px;

      .panel-space {
        -webkit-box-flex: 1;
        -moz-box-flex: 1;
        box-flex: 1;
        -webkit-flex: 1 1 15px;
        -moz-flex: 1 1 15px;
        -ms-flex: 1 1 15px;
        flex: 1 1 15px;
      }

      .member-action {
        opacity: 0;
      }
    }

    .member-item:hover .member-action {
      opacity: 1;
    }
  }

  .catalog-action {
    text-align: center;
    padding: 24px 16px;
  }
}

.kloudsync-invite-table {
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

.kloudsync-merge-space {
  padding: 1em 2em;

  h4 {
    color: #ed3f14;
  }

  p {
    line-height: 2em;
    font-weight: bold;
  }
  .current-space {
    font-weight: normal;
    color: #80848f;
  }
}
</style>

<script>
import auth from "../../authenticator";
import friends from "../../friends";

export default {
  data() {
    return {
      loading: false,
      currentTeam: [],
      currentSpace: [],
      catalogId: 0,
      catalogType: 0,
      typeName: "Team",
      catalogName: "Team Name",
      catalogMemberType: 0,
      memberList: [],
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
      modalInvite: false,
      invitePhone: '',
      inviteEmail: '',
      inviteInternal: true,
      modalMerge: false,
      mergeTeam: 0,
      mergeSpace: 0,
      teamFullList: [],
      spaceFullList: [],
    };
  },
  computed: {
    schoolId() {
      return auth.getChosenSchoolId();
    },
    isOwner() {
      return this.catalogMemberType == 2;
    },
    isOwnerAdmin() {
      return this.catalogMemberType == 1 || this.catalogMemberType == 2;
    },
  },
  watch: {
    mergeTeam(from, to) {
      this.$nextTick(() => {
        this._loadSpaceList();
      });
    }
  },
  mounted() {
  },
  methods: {
    setCatalog(team, space) {
      this.currentTeam = team;
      this.currentSpace = space;

      if (space && space.id > 0) {
        this.typeName = "Space";
        this.catalogId = space.id;
        this.catalogType = 2; // Space
        this.catalogName = space.name;
        this.catalogMemberType = space.memberType;
      }
      else {
        this.typeName = "Team"
        this.catalogId = team.id;
        this.catalogType = 1; // Team
        this.catalogName = team.name;
        this.catalogMemberType = team.memberType;
      }

      // this.loadCatalogMembers();
    },
    loadCatalogMembers() {
      let self = this;
      let url = GetAPIUrl() + "TeamSpace/MemberList?TeamSpaceID=" + this.catalogId;

      this._getData(url, null, data => {
        this.memberList = data;        
      }, null);
    },
    handleCatalogAction(name) {
      switch (name) {
        case 'delete':
          if (this.catalogType === 1) {
            // Team
            this.handleDeleteTeam();
          }
          else if (this.catalogType === 2) {
            // Space
            this.handleDeleteSpace();
          }
          break;

        case 'quit':
          this.handleQuitTeam();
          break;
      }
    },
    handleDeleteTeam() {
      let self = this;
      let url = GetAPIUrl() + "TeamSpace/BeforeDeleteTeam?teamID=" + this.catalogId;
      this._getData(url, null, (data) => {
        if (parseInt(data) > 0) {
          self.$Modal.warning({
            title: 'Delete ' + self.typeName,
            content: self.typeName + ' "' + self.catalogName + '" has some spaces, Please delete them first!',
            okText: 'OK',
            cancelText: 'Cancel'
          });
        }
        else {
          let content = self.typeName + ' "' + self.catalogName + '" will be deleted. Sure?';
          self.$Modal.confirm({
            title: 'Delete ' + self.typeName,
            content: content,
            okText: 'OK',
            cancelText: 'Cancel',
            onOk: () => {
              self._deleteTeam();
            },
          });
        }
      }, null);
    },
    _deleteTeam() {
      let self = this;
      let url = GetAPIUrl() + "TeamSpace/DeleteTeam?teamID=" + this.catalogId;
      this._deleteData(url, null, (data) => {
        self.$Message.info({content: self.typeName + '"' + self.catalogName + '" has been deleted!'});
        self.$parent.refresh();
      }, null);
    },
    handleDeleteSpace() {
      let self = this;
      let url = GetAPIUrl() + "TeamSpace/BeforeDeleteSpace?spaceID=" + this.catalogId;
      this._getData(url, null, (data) => {
        if (parseInt(data) > 0) {
          self._mergeSpace();
        }
        else {
          let content = self.typeName + ' "' + self.catalogName + '" will be deleted. Sure?';
          self.$Modal.confirm({
            title: 'Delete ' + self.typeName,
            content: content,
            okText: 'OK',
            cancelText: 'Cancel',
            onOk: () => {
              self.mergeSpace = 9999;
              self._deleteSpace();
            },
          });
        }
      }, null);
    },
    _mergeSpace() {
      this.modalMerge = true;
      this._loadTeamList();
    },
    handleDeleteSpaceOK() {
      if(!this.mergeSpace || this.mergeSpace <= 0){
        this.$Message.info({content: "Please select a space to merge.", duration: 3});
        return;
      }

      this._deleteSpace();
    },
    _loadTeamList() {
      let self = this;
      let url = GetAPIUrl() + "TeamSpace/List?type=1";
      url += "&companyID=" + this.schoolId;

      this._getData(url, null, data => {
        let list = [];
        for(let i = 0; i < data.length; i++) {
          let item = {
            id: data[i].ItemID,
            name: data[i].Name,
            createdDate: data[i].CreatedDate,
          };
          list.push(item);
        }

        self.teamFullList = list;
        self.$nextTick(() => {
          self.mergeTeam = self.currentTeam.id;
        });
      }, null);
    },
    _loadSpaceList() {
      if (!this.mergeTeam || this.mergeTeam <= 0) {
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "TeamSpace/List?type=2";
      url += "&companyID=" + this.schoolId;
      url += "&parentID=" + this.mergeTeam;

      this.mergeSpace = 0;

      this._getData(url, null, data => {
        let list = [];
        for(let i = 0; i < data.length; i++) {
          let item = {
            id: data[i].ItemID,
            name: data[i].Name,
            createdDate: data[i].CreatedDate,
          };

          if (item.id != this.currentSpace.id) {
            list.push(item);
          }
        }

        self.spaceFullList = list;
      }, null);
    },
    _deleteSpace() {
      if (!this.mergeSpace || this.mergeSpace <= 0) {
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "TeamSpace/DeleteSpace?spaceID=" + this.catalogId + "&mergeSpaceID=" + this.mergeSpace;
      this._deleteData(url, null, (data) => {
        self.modalMerge = false;
        self.$Message.info({content: self.typeName + '"' + self.catalogName + '" has been deleted!'});
        self.$parent.refresh();
      }, null);
    },
    handleQuitTeam() {
      let self = this;
      let content = "Quit from " + this.typeName + ' "' + this.catalogName + '". Sure?';
      this.$Modal.confirm({
        title: 'Quit from ' + this.typeName,
        content: content,
        okText: 'OK',
        cancelText: 'Cancel',
        onOk: () => {
          let url = GetAPIUrl() + "TeamSpace/RemoveMember?ItemID=" + self.catalogId + "&MemberID=" + auth.getUserID();
          self._deleteData(url, null, (result) => {
            content = "You just quit from " + self.catalogName + ".";
            self.$Message.info({content: content, duration: 3});
            self.$parent.refresh();
          }, null);
        }
      });
    },
    handleAddMemberAction(name) {
      switch (name) {
        case 'search':
          this.searchKey = '';
          this.modalSearch = true;
          break;

        case 'invite':
          this.modalInvite = true;
          break;
      }
    },
    handleSave() {
      if(this.newTeamName==""){
        this.$Message.info({content: this.typeName + " name cannot be empty!", duration: 3});
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "TeamSpace/UpdateTeamSpace";
      let data = {
        ID: this.catalogId,
        Name: this.catalogName,
        Note: this.catalogName,
      };

      this._postData(url, data, null,
        result => {
          self.$Message.info({content: self.typeName + " change has been saved!"});
          self.$emit('on-changed', {id: self.catalogId, name: self.catalogName});
        }, null);
    },
    handleCancel() {
      if (this.currentSpace && this.currentSpace.id > 0) {
        this.typeName = "Space";
        this.catalogId = this.currentSpace.id;
        this.catalogType = 2; // Space
        this.catalogName = this.currentSpace.name;
      }
      else {
        this.typeName = "Team"
        this.catalogId = this.currentTeam.id;
        this.catalogType = 1; // Team
        this.catalogName = this.currentTeam.name;
      }
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

      let self = this;
      let url = GetAPIUrl() + "TeamSpace/AddMember?CompanyID=" + this.schoolId + "&TeamSpaceID=" + this.catalogId + "&MemberList=" + memberList;
      let data = {};

      this._postData(url, data, null, (result) => {
        self.loadCatalogMembers();
        self.modalSearch = false;
      }, null);
    },
    handleSearchCancel() {
      this.modalSearch = false;
    },
    handleInviteOK() {
      let self = this;
      let url = GetAPIUrl() + "TeamSpace/InviteUser?itemID=" + this.catalogId + "&mobile=" + this.invitePhone + "&email=" + this.inviteEmail;
      let data = {};

      this._postData(url, data, null, (result) => {
        self.$Message.info({content: "The invitation has been sent.", duration: 3});
        self.modalInvite = false;
      }, null);
    },
    handleInviteCancel() {
      this.modalInvite = false;
    },
    handleMemberAction(name, member) {
      switch (name) {
        case 'chat':
          this.handleChatMember(member);
          break;

        case 'admin':
          this.handleSetAdmin(member);
          break;

        case 'remove':
          this.handleRemoveTeam(member);
          break;
      }
    },
    handleChatMember(member) {

    },
    handleSetAdmin(member) {
      let self = this;
      let content = "This will set " + member.MemberName + " as " + this.catalogName + " admin.";
      this.$Modal.confirm({
        title: 'Set as team admin',
        content: content,
        okText: 'OK',
        cancelText: 'Cancel',
        onOk: () => {
          let url = GetAPIUrl() + "TeamSpace/ChangeMemberType?ItemID=" + self.catalogId + "&MemberID=" + member.MemberID + "&MemberType=1";
          self._postData(url, {}, null, (result) => {
            member.MemberType = 1;
            content = member.MemberName + " has been set as " + self.catalogName + " admin.";
            this.$Message.info({content: content, duration: 3});
          }, null);
        }
      });
    },
    handleRemoveTeam(member) {
      let self = this;
      let content = "This will remove " + member.MemberName + " from " + this.catalogName + ".";
      this.$Modal.confirm({
        title: 'Remove from team',
        content: content,
        okText: 'OK',
        cancelText: 'Cancel',
        onOk: () => {
          let url = GetAPIUrl() + "TeamSpace/RemoveMember?ItemID=" + self.catalogId + "&MemberID=" + member.MemberID;
          self._deleteData(url, null, (result) => {
            self.loadCatalogMembers();
            content = member.MemberName + " has been removed from " + self.catalogName + ".";
            this.$Message.info({content: content, duration: 3});
          }, null);
        }
      });
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
