<template>
  <div class="forProject-topic-info">
    <div class="sync-room-info-header">
      <div class="sync-room-title-space">
        <span class="sync-room-type">
          <span class="icon icon-type" style="color :rgb(47,194,175);font-size:23px;line-height: 1;margin-right:3px;"></span>
          <span v-show="currentTopic.type == 1">{{$t('TopicHomePage.SalesforceIntegration')}}</span>
          <span v-show="currentTopic.type == 2">{{$t('TopicHomePage.Support')}}</span>
          <span v-show="currentTopic.type == 3">{{$t('TopicHomePage.CustomerLeads')}}</span>
        </span>
        <Dropdown style="float:right; font-weight:normal;text-align:left;" placement="bottom-end" @on-click="handleTopicAction">
          <Icon type="more" size="24" style="cursor: pointer;"></Icon>
          <DropdownMenu slot="list">
            <DropdownItem name="property">{{$t('TopicHomePage.Property')}}</DropdownItem>
            <DropdownItem name="share">{{$t('TopicHomePage.CopyUrl')}}</DropdownItem>
            <DropdownItem name="move" v-if="inList">{{$t('TopicHomePage.Move')}}</DropdownItem>
            <DropdownItem name="close">{{$t('TopicHomePage.Close')}}</DropdownItem>
            <DropdownItem name="quit">{{$t('TopicHomePage.QuitSyncRoom')}}</DropdownItem>
            <DropdownItem name="delete">{{$t('TopicHomePage.Delete')}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <p class="sync-room-title">{{currentTopic.name}}</p>
      </div>
      <Input icon="ios-search" :placeholder="$t('TopicHomePage.SearchAll')" style="width: 100%;margin-top:0.5em" />
    </div>
    <div class="topic-action-list">
      <div class="topic-action-item" title="Home page" :class="{'current-action': currentAction == 8}">
        <div class="topic-action-icon" @click="handleAction(8)">
          <span class="icon icon-syncroom" style="font-size:23px;line-height: 1;"></span>
        </div>
      </div>
      <div class="topic-action-item" title="Chat" :class="{'current-action': currentAction == 7}">
        <div class="topic-action-icon" @click="handleAction(7)">
          <Icon type="chatbox" size="24" ></Icon>
        </div>
      </div>
      <div class="topic-action-item" title="Documents" :class="{'current-action': currentAction == 2}">
        <div class="topic-action-icon" @click="handleAction(2)">
          <Icon type="android-attach" size="24"></Icon>
        </div>
      </div>
      <!-- <div class="topic-action-item" title="Story & Task" :class="{'current-action': currentAction == 3}">
        <div class="topic-action-icon" @click="handleAction(3)">
          <Icon type="android-clipboard" size="24"></Icon>
        </div>
      </div> -->
      <div class="topic-action-item" title="Members" :class="{'current-action': currentAction == 4}">
        <div class="topic-action-icon" @click="handleAction(4)">
          <Icon type="android-person" size="24"></Icon>
        </div>
      </div>
      <div class="topic-action-item"  title="Meetings" :class="{'current-action': currentAction == 5}">
        <div class="topic-action-icon" @click="handleAction(5)">
          <Icon type="android-calendar" size="24"></Icon>
        </div>
      </div>
      <!-- <div class="topic-action-item" title="Property" :class="{'current-action': currentAction == 1}">
        <div class="topic-action-icon" @click="handleAction(1)">
          <Icon type="compose" size="24"></Icon>
        </div>
      </div> -->
      <!-- <div class="topic-action-item" title="Syncs" :class="{'current-action': currentAction == 6}">
        <div class="topic-action-icon" @click="handleAction(6)">
          <Icon type="ios-musical-note" size="24"></Icon>
        </div>
      </div> -->
      <!-- <div class="topic-action-item">
        <div class="topic-action-icon" title="Close" @click="handleAction(0)">
          <Icon type="android-close" size="24"></Icon>
        </div>
      </div> -->
    </div>
    <div class="topic-action-content">
      <!-- <div v-show="currentAction == 1" class="topic-property">
        <div class="topic-action-header">
          Property

          <Dropdown style="float:right; font-weight:normal" placement="bottom-end" @on-click="handleTopicAction">
            <Icon type="more" size="24" style="cursor: pointer;"></Icon>
            <DropdownMenu slot="list">
              <DropdownItem name="close">Close topic</DropdownItem>
              <DropdownItem name="quit">Quit topic</DropdownItem>
              <DropdownItem name="delete">Delete topic</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div class="topic-property-detail">
          <div class="topic-property-label">Name: </div>
          <div>
            <Input v-model="catalogName" placeholder="Name"/>
          </div>

          <div class="topic-property-label">Type: </div>
          <div>
            <Select v-model="catalogTopicType" placeholder="Type">
              <Option :value="1">Customer Service</Option>
              <Option :value="2">Customer Requirement Discussion</Option>
              <Option :value="3">Customer Leads</Option>
            </Select>
          </div>

          <div class="topic-property-label">Note: </div>
          <div>
            <Input v-model="catalogNote" placeholder="Note" type="textarea" :rows="4" :autosize="{minRows: 4}"/>
          </div>

          <div class="topic-action-footer">
            <Button shape="circle" style="width:25%;" type="primary" @click="handlePropertySave">Save</Button>
            <Button shape="circle" style="width:25%;margin-left:5%;" @click="handlePropertyCancel">Cancel</Button>
          </div>
          
          <div class="topic-property-label">CUSTOMERS: </div>
          <div class="customer-list">
            <div style="font-weight:bold; padding: 5px" v-show="companyCustomer">
              {{companyCustomer}}
            </div>
            <div class="member-item" v-for="item in customerList" :key="item.MemberID">
              <span class="member-avatar"><Avatar :src="item.MemberAvatar == '' ? '/static/images/user.svg' : item.MemberAvatar" /></span>
              <span style="margin-left: 10px;">{{item.MemberName}}</span>
              <div class="panel-topic"></div>
            </div>

            <div style="font-weight:bold; padding: 5px" v-show="companyCustomer && associatesList.length > 0">
              CUSTOMER ASSOCIATES
            </div>
            <div class="member-item" v-for="item in associatesList" :key="item.MemberID">
              <span class="member-avatar"><Avatar :src="item.MemberAvatar == '' ? '/static/images/user.svg' : item.MemberAvatar" /></span>
              <span style="margin-left: 10px;">{{item.MemberName}}</span>
              <div class="panel-topic"></div>
            </div>
          </div>
        </div>
      </div> -->

      <div v-show="currentAction == 2">
        <topic-files ref="topicFiles" :catalog-id="catalogId" :catalog-name="catalogName" :catalog-type-name="catalogTypeName" :can-upload="catalogType == 2"></topic-files>
      </div>

      <div v-show="currentAction == 3">
        <topic-tasks ref="topicTasks" :catalog-id="catalogId" :catalog-name="catalogName" :catalog-type-name="catalogTypeName"></topic-tasks>
      </div>

      <div v-show="currentAction == 4">
        <topic-members ref="topicMembers" :catalog-id="catalogId" :catalog-name="catalogName" :catalog-type-name="catalogTypeName" :catalog-topic-type="catalogTopicType" :catalog-member-type="catalogMemberType"></topic-members>
      </div>

      <div v-show="currentAction == 5">
        <topic-meetings  ref="topicMeetings" :catalog-id="catalogId" :catalog-name="catalogName" :catalog-type-name="catalogTypeName"></topic-meetings>
      </div>

      <div v-show="currentAction == 6">
        <topic-syncs ref="topicSyncs" :catalog-id="catalogId" :catalog-name="catalogName" :catalog-type-name="catalogTypeName"></topic-syncs>
      </div>
      <div v-show="currentAction == 7">
        <topic-chat ref="topicChat"></topic-chat>
      </div>
      <div v-show="currentAction == 8">
        <topic-home-page ref="topicHomePage" :in-list="inList"></topic-home-page>
      </div>
    </div>
    <div>
      <Modal v-model="modalMerge" :mask-closable="false" title="Delete SyncRoom">
        <div class="kloudsync-merge-topic">
          <h4>Before you delete the syncRoom, you need to merge the syncRoom to current one.</h4>
          <p>&nbsp;</p>
          <p>Current</p>
          <p class="current-topic">{{currentTeam.name}} / {{currentTopic.name}}</p>
          <p>&nbsp;</p>
          <p>Select Team</p>
          <Select v-model="mergeTeam" placeholder="Please select a team">
            <Option v-for="item in teamFullList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
          <p>&nbsp;</p>
          <p>Select SyncRoom</p>
          <Select v-model="mergeTopic" placeholder="Please select a syncRoom">
            <Option v-for="item in topicFullList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </div>
        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleDeleteTopicOK">{{$t('Base.OK')}}</Button>
          <Button @click="modalMerge = false;">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>
      <Modal v-model="SyncRoomProperty" :mask-closable="false" title="SyncRoom property" width="500">
        <div class="forProject-sync-room-property-modal-content">
          <div class="syncroom-property-label">Name: </div>
          <div>
            <Input v-model="catalogName" placeholder="Name"/>
          </div>

          <div class="syncroom-property-label">Type: </div>
          <div>
            <Select v-model="catalogTopicType" placeholder="Type">
              <Option :value="1">Customer Service</Option>
              <Option :value="2">Customer Requirement Discussion</Option>
              <Option :value="3">Customer Leads</Option>
            </Select>
          </div>
          
          <div class="syncroom-property-label">Note: </div>
          <div>
            <Input v-model="catalogNote" placeholder="Note" type="textarea" :rows="4" :autosize="{minRows: 4}"/>
          </div>
        </div>
        <div slot="close" style="display:none"></div>
        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handlePropertySave">Save</Button>
          <Button  @click="handlePropertyCancel">Cancel</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<style lang="scss">
.forProject-topic-info {
  text-align: left;
  display: flex;
  flex-wrap:wrap;
  flex: 1 1 200px;
  .sync-room-info-header{
    width: 100%;
    padding: 2em 24px 1em 24px;
    .sync-room-title-space{
      width: 100%;
      .sync-room-type {
        font-size: 15px;
        max-width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .sync-room-title{
        font-size: 18px;
        font-weight: bold;
        max-width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    span{
      display: inline-block;
    }
  }
  .topic-action-content {
    justify-content: flex-start;
    width: 100%;
  }

  .topic-action-list {
    // flex: 0 0 64px;
    // border-left: 1px solid #dddee1;
    display: flex;
    flex-direction: row;
    // height: 100%;
    height: 66px;
    width: 100%;
    //padding-bottom: 8px;
    border-bottom: 1px solid #dddee1;
    justify-content: center;

    .topic-action-item {
      color:#80848f;
      width:25%;

      .topic-action-icon {
        height: 4em;
        padding: 1.2em;
        text-align: center;
        cursor: pointer;
      }
    }

    .topic-action-item.current-action {
      color: #2b85e4;
    }
  }

  .topic-action-header {
    font-weight: bold;
    font-size: larger;
    //color: #1c2438;
    padding-bottom: 1em;
  }

  .topic-action-footer {
    margin: 20px -10px;
    padding-top: 20px;
    border-top: 1px solid #dddee1;
    text-align: center;
  }

  .topic-property {
    padding: 20px;

    .topic-property-table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      text-align: left;

      td {
        padding: 5px;
        line-height: 32px;
      }

      td:first-of-type {
        //text-align: right;
        font-weight: bold;
        width: 80px;
      }

      .check-mark {
        display: inline-block;
        width: 24px;
        text-align: left;
      }
    }

    .topic-property-detail {
      .topic-property-label {
        padding: 1em 0 0.5em 0;
        font-weight: bold;
        color:#1c2438;
      }
      .customer-list{
        .member-item {
          display: flex;
          align-items:center;
          justify-content:flex-start;
          padding: 5px;
          font-size: 14px;

          .panel-topic {
            box-flex: 1;
            flex: 1 1 15px;
          }

          .member-action {
            opacity: 0;
            cursor: pointer;
          }
        }
      }
    }
  }

  .topic-action {
    text-align: center;
    padding: 24px 16px;
  }
}
.forProject-sync-room-property-modal-content{
  width: 100%;
  padding: 0em 4em 1em 4em;
  .syncroom-property-label{
    padding: 1em 0 0.5em 0;
    font-weight: bold;
    color:#1c2438;
  }
}
</style>

<script>
import auth from "../../authenticator";
import friends from "../../friends";
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import TopicSyncs from "./TopicSyncs"
import TopicFiles from "./TopicFiles"
import TopicTasks from "./TopicTasks"
import TopicMembers from "./TopicMembers";
import TopicMeetings from "./TopicMeetings"
import TopicChat from "./TopicChat.vue";
import TopicHomePage from "./TopicHomePage.vue";

export default {
  components: {
    TopicSyncs,
    TopicFiles,
    TopicTasks,
    TopicMembers,
    TopicMeetings,
    TopicChat,
    TopicHomePage
  },
  props: {
    isShown: {
      type: Boolean,
      default: false,
    },
    inList: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      loading: false,
      currentAction: 8,
      catalogId: 0,
      catalogType: 0,
      catalogTypeName: "Team",
      catalogTopicType: 1,
      catalogName: "Team Name",
      catalogNote: "",
      catalogMemberType: 0,
      modalMerge: false,
      mergeTeam: 0,
      mergeTopic: 0,
      teamFullList: [],
      topicFullList: [],
      companyCustomer: '',
      customerList: [],
      associatesList: [],
      SyncRoomProperty:false,
    };
  },
  computed: {
    ...mapState(['kloudsyncTopic']),

    schoolId() {
      return auth.getChosenSchoolId();
    },
    topicTypeName() {
      switch (this.catalogTopicType) {
        case 1:
          return "Customer Service";
        case 2:
          return "Customer Requirement Discussion";
        case 3:
          return "Customer Leads";
        
        default:
          return "Unknown";
      }
    },
    currentTeam() {
      return this.kloudsyncTopic.currentTeam;
    },
    currentTopic() {
      return this.kloudsyncTopic.currentTopic;
    },
    currentSyncRoomId(){
      if (this.inList) {
        return this.currentTopic.id;
      }
      else {
        return this.$route.params.id;
      }
    }
  },
  watch: {
    mergeTeam(from, to) {
      this.$nextTick(() => {
        this._loadTopicList();
      });
    },
    // currentTopic: {
    //   handler: function(from, to) {
    //     this._resetCatalog();
    //   },
    //   deep: true
    // },
    // isShown(from, to) {
    //   this._resetCatalog();
    // }
  },
  mounted() {
    if (sessionStorage.getItem("Kloudsync.Topic.Action")) {
      this.currentAction = parseInt(sessionStorage.getItem("Kloudsync.Topic.Action"));
    }
    this._resetCatalog();
  },
  methods: {
    initialize() {
      // this.loadTopicMembers();
      // this.loadTopicCustomer();
      this.$nextTick(() => {
        this._resetCatalog();
      });
    },
    loadTopicMembers() {
      let self = this;
      let url = GetAPIUrl() + "Topic/MemberList?TeamTopicID=" + this.catalogId;

      this._getData(url, null, data => {
        let clist = [];
        let alist = [];
        data.forEach(item => {
          if (item.MemberType == 10) {
            clist.push(item);
          }
          else if (item.MemberType == 11) {
            alist.push(item);
          }
        });
        self.customerList = clist;
        self.associatesList = alist;
      }, null);
    },
    loadTopicCustomer() {
      let self = this;
      let url = GetAPIUrl() + "Topic/GetCustomerCompnay?TeamTopicID=" + this.catalogId;
      this._getData(url, null, data => {
        if (data){
          self.companyCustomer = data.CompanyName;
          // let company = {
          //   id: data.PTCompanyID,
          //   name: data.CompanyName,
          //   link: data.WebSite,
          //   note: data.CompanyNote,
          //   contacts: data.ContactList.length
          // };
        }
        else {
          self.companyCustomer = '';
        }
      }, null);
    },
    handleAction(action) {
      if (action == 0) {
        // this.$parent.closeDetail();
        return;
      }else if(action == 1){
        this.initialize();
      }

      this.currentAction = action;
      sessionStorage.setItem("Kloudsync.Topic.Action", this.currentAction);
      this._reloadData();
    },
    _resetCatalog() {
      let self = this;

      if (this.inList) {
        this.catalogTypeName = "SyncRoom";
        this.catalogId = this.currentTopic.id;
        this.catalogType = 2; // Topic
        this.catalogName = this.currentTopic.name;
        this.catalogTopicType = this.currentTopic.type;
        this.catalogNote = this.currentTopic.note;
        this.catalogMemberType = this.currentTopic.memberType;
        this.$nextTick(() => {
          this._reloadData();
        });
      }
      else {
        this.$nextTick(() => {
          this._resetSyncRoomProperty(self.currentSyncRoomId).then((data)=>{
            self.$refs.topicFiles.initialize();//进入syncRoom时获取第一个文档时作为这个syncroom的封面,
            self._reloadData();
          });
        });
      }
    },
    refreshSyncRoomFileList(){
      this.$refs.topicFiles.refreshFileList();
    },
    _reloadData() {
      // if (!this.isShown) {
      //   return;
      // }
      //初始化清空定时
      // this.$refs.topicMeetings.clearIntervalTime();
      
      switch (this.currentAction) {
        case 1:
          this.loadTopicMembers();
          this.loadTopicCustomer();
          break;

        case 2:
          this.$refs.topicFiles.readData();
          break;

        case 3:
          this.$refs.topicTasks.initialize();
          break;
          
        case 4:
          this.$refs.topicMembers.initialize();
          break;

        case 5:
          this.$refs.topicMeetings.initialize();
          break; 

        case 6:
          this.$refs.topicSyncs.initialize();
          break;
        case 7:
          this.$refs.topicChat.initialize();
          break;
        case 8:
          this.$refs.topicHomePage.initialize();
          break;
      }
    },
    handleTypeChange(name) {
      this.catalogTopicType = parseInt(name);
    },
    handlePropertySave() {
      if(this.catalogName == ""){
        this.$Message.info({content: this.catalogTypeName + " name cannot be empty!", duration: 3});
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "Topic/UpdateTeamTopic";
      let data = {
        ID: this.catalogId,
        Name: this.catalogName,
        TopicType: this.catalogTopicType,
        Note: this.catalogNote,
      };

      this._postData(url, data, null,
        result => {
          self.$Message.info({content: self.catalogTypeName + " change has been saved!"});
          if (self.catalogType === 1) {
            self.kloudsyncTopic.currentTeam.name = self.catalogName;
            self.kloudsyncTopic.currentTeam.note = self.catalogNote;
          }
          else {
            self.kloudsyncTopic.currentTopic.name = self.catalogName;
            self.kloudsyncTopic.currentTopic.note = self.catalogNote;
            self.kloudsyncTopic.currentTopic.type = self.catalogTopicType;
          }
          if(self.inList){
              self.$parent.loadTopicList();
          }else{
             self._resetSyncRoomProperty(self.currentSyncRoomId);
          }
          
          self.handlePropertyCancel();
        }, null);
    },
    handlePropertyCancel() {
      this.SyncRoomProperty=false;
    },
    _resetSyncRoomProperty(id){
      let self=this;
      return new Promise((resolve, reject)=>{
        let url =GetAPIUrl() + "Topic/Item?itemID="+parseInt(id);
        $.ajax({
          type: "GET",
          url: url,
          beforeSend: function(request) {
            request.setRequestHeader("UserToken", auth.getUserToken());
          },
          success: function(result) {
            if (result.RetCode === 0) {
              let data = result.RetData;
              self.kloudsyncTopic.currentTopic = {
                id: data.ItemID,
                name: data.Name,
                note: data.Note,
                type: data.TopicType,
                typeName: self._topicTypeName(data.TopicType),
                createdDate: data.createdDate,
                memberType: data.MemberType
              };
              self.catalogTypeName = "SyncRoom";
              self.catalogId = self.currentTopic.id;
              self.catalogType = 2; // Topic
              self.catalogName = self.currentTopic.name;
              self.catalogTopicType = self.currentTopic.type;
              self.catalogNote = self.currentTopic.note;
              self.catalogMemberType = self.currentTopic.memberType;

              resolve(data);
            }
          },
        });
      })
    },
    _topicTypeName(type) {
      switch (type) {
        case 1:
          return "Customer Service";
        case 2:
          return "Customer Requirement Discussion";
        case 3:
          return "Customer Leads";
        
        default:
          return "Unknown";
      }
    },
    handleTopicAction(name) {
      let catalogTypeName = this.catalogTypeName;
      let catalogName = this.catalogName;
      switch (name) {
        case 'close':          
          this.handleCloseTopic(this.currentSyncRoomId, catalogTypeName, catalogName);
          break;

        case 'share':
          this.copySyncRoomLink(this.currentSyncRoomId);
          break;
       case 'move':
          this.moveSyncroom(this.currentSyncRoomId);
          break;
        case 'quit':
          this.handleQuitTopic(this.currentSyncRoomId, catalogTypeName, catalogName);
          break;

        case 'property':
          // this.handleTopicProperty(this.currentSyncRoomId);
          this.$refs.topicHomePage.handleTopicProperty(this.currentSyncRoomId);
          break;

        case 'delete':
          if (this.catalogType === 2) {
            // Topic
            this.handleDeleteTopic(this.currentSyncRoomId, catalogTypeName, catalogName);
          }
          else if (this.catalogType === 1) {
            // Team
            this.handleDeleteTeam();
          }
          break;
      }
    },
    moveSyncroom(){
      this.$parent.handMoveModal(this.currentSyncRoomId);
    },
    copySyncRoomLink(syncRoomID){
      let id=syncRoomID;
      var url=location.origin.toLowerCase();
      url+="/syncroom/"+id;
      navigator.clipboard.writeText(url).then(()=>{
          this.$Message.info({content: this.$t("Live.CopySyncUrlSuccess"), duration: 3});
      },()=>{
          this.$Message.error({content: this.$t("Live.CopySyncUrlFailed"+"\n\n"+url), duration: 3});
      });
    },
    handleTopicProperty(id){
      this.SyncRoomProperty = true;
      this._resetSyncRoomProperty(id);
    },
    handleCloseTopic(syncRoomId, catalogTypeName, catalogName) {
      let self = this;
      let content = "Close " + catalogTypeName + ' "' + catalogName + '". Sure?';
      this.$Modal.confirm({
        title: 'Close Topic ' + catalogTypeName,
        content: content,
        okText: 'OK',
        cancelText: 'Cancel',
        onOk: () => {
          
        }
      });
    },
    handleQuitTopic(syncRoomId, catalogTypeName, catalogName) {
      let self = this;
      let content = "Quit from " + catalogTypeName + ' "' + catalogName + '". Sure?';
      this.$Modal.confirm({
        title: 'Quit from ' + catalogTypeName,
        content: content,
        okText: 'OK',
        cancelText: 'Cancel',
        onOk: () => {

        }
      });
    },
    handleDeleteTeam() {
      let self = this;
      let url = GetAPIUrl() + "Topic/BeforeDeleteTeam?teamID=" + this.catalogId;
      this._getData(url, null, (data) => {
        if (parseInt(data) > 0) {
          self.$Modal.warning({
            title: 'Delete ' + self.catalogTypeName,
            content: self.catalogTypeName + ' "' + self.catalogName + '" has some topics, Please delete them first!',
            okText: 'OK',
            cancelText: 'Cancel'
          });
        }
        else {
          let content = self.catalogTypeName + ' "' + self.catalogName + '" will be deleted. Sure?';
          self.$Modal.confirm({
            title: 'Delete ' + self.catalogTypeName,
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
      let url = GetAPIUrl() + "Topic/DeleteTeam?teamID=" + this.catalogId;
      this._deleteData(url, null, (data) => {
        self.$Message.info({content: self.catalogTypeName + '"' + self.catalogName + '" has been deleted!'});
        // self.$parent.refresh();
      }, null);
    },
    handleDeleteTopic(syncRoomID,catalogTypeName,catalogName) {
      let self = this;
      let content = catalogTypeName + ' "' + catalogName + '" will be deleted. Sure?';
      self.$Modal.confirm({
        title: 'Delete ' + catalogTypeName,
        content: content,
        okText: 'OK',
        cancelText: 'Cancel',
        onOk: () => {
          self._deleteTopic(syncRoomID, catalogTypeName, catalogName);
        },
      });
      // let self = this;
      // let url = GetAPIUrl() + "Topic/BeforeDeleteTopic?topicID=" + syncRoomID;
      // this._getData(url, null, (data) => {
      //   if (parseInt(data) > 0) {
      //     self._mergeTopic();
      //   }
      //   else {
      //     let content = catalogTypeName + ' "' + catalogName + '" will be deleted. Sure?';
      //     self.$Modal.confirm({
      //       title: 'Delete ' + catalogTypeName,
      //       content: content,
      //       okText: 'OK',
      //       cancelText: 'Cancel',
      //       onOk: () => {
      //         self.mergeTopic = 9999;
      //         self._deleteTopic(syncRoomID,catalogTypeName,catalogName);
      //       },
      //     });
      //   }
      // }, null);
    },
    _mergeTopic() {
      this.modalMerge = true;
      this._loadTeamList();
    },
    handleDeleteTopicOK() {
      if(!this.mergeTopic || this.mergeTopic <= 0){
        this.$Message.info({content: "Please select a SyncRoom to merge.", duration: 3});
        return;
      }

      this._deleteTopic(this.currentSyncRoomId, this.catalogTypeName, this.catalogName);
    },
    _loadTeamList() {
      let self = this;
      let url = GetAPIUrl() + "Topic/List?type=1";
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
    _loadTopicList() {
      if (!this.mergeTeam || this.mergeTeam <= 0) {
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "SyncRoom/List?";
      url += "companyID=" + this.schoolId;
      url += "&teamID=" + this.mergeTeam;

      this.mergeTopic = 0;

      this._getData(url, null, data => {
        let list = [];
        for(let i = 0; i < data.length; i++) {
          let item = {
            id: data[i].ItemID,
            name: data[i].Name,
            createdDate: data[i].CreatedDate,
          };

          if (item.id != this.currentTopic.id) {
            list.push(item);
          }
        }

        self.topicFullList = list;
      }, null);
    },
    _deleteTopic(syncRoomID,catalogTypeName,catalogName) {
      let self = this;
      let url = GetAPIUrl() + "Topic/DeleteTopic?topicID=" + syncRoomID;
      this._deleteData(url, null, (data) => {
        self.modalMerge = false;
        self.$Message.info({content: catalogTypeName + '"' + catalogName + '" has been deleted!'});
        // self.$parent.refresh();
        if(self.inList){
          self.$parent.loadTopicList();
          self.$parent.closeDetail();
        }else{
          self.$router.push({name:"projectone-topic"});
        }
      }, null);
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
