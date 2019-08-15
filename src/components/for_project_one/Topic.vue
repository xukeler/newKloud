<template>
  <div class="forProject-topic">
    <div class="topic-flexviews">
      <!-- <div class="panel-gutter"></div> -->
      <div class="panel-catalog">
        <topic-left-part ref="leftPart"  @get-team-list="getTeamList"></topic-left-part>
      </div>
      <div class="panel-content">
        <div class="topic-header">
          <span class="topic-name">{{catalog.name}}</span>
          <span class="topic-time">Start: {{catalog.created}}</span>
          <span class="new-sync-room" v-show="currentTeam.id > 0"><Button type="success" icon="plus-round" style="color: white;" @click="newSyncRoomModal">New SyncRoom</Button></span>
          <!-- <div class="topic-more" v-show="!showDetail && currentTopic.id > 0" @click="showTopicInfo"><Icon type="more" size="24"></Icon></div> -->
        </div>
        <!--<div class="topic-cover" v-show="showDetail" @click="showDetail = false">
          <div class="topic-info" @click="handleTopicInfoClick">
            <topic-info ref="topicInfo"></topic-info>
          </div>
        </div>-->
        <div class="topic-sync-room-table">
          <div class="table-space">
            <p class="sync-room-title">SyncRoom</p>
            <div ref="syncRoomTable">
              <Table :no-data-text="$t('Common.NoData')" :stripe="true"
                :highlight-row="true" style="width:100%"
                :data="topicData" :columns="topicColumn" :loading="loading" 
                @on-row-click="tableRowClick">
              </Table>
            </div>
            <div style="margin: 16px 0; overflow: hidden;  text-align: left;width:100%;">
              <Select v-model="pageSize" style="width:150px;" @on-change="pageSizeChange">
                <!-- <Option :value="5">5/Page</Option> -->
                <Option :value="15">{{$t('Common.Page15')}}</Option>
                <Option :value="25">{{$t('Common.Page25')}}</Option>
                <Option :value="50">{{$t('Common.Page50')}}</Option>
                <Option :value="100">{{$t('Common.Page100')}}</Option>
              </Select>

              <div style="float: right; display: flex; align-items: center;">
                <div
                  style="display: inline-block; margin-right: 1em;"
                >{{dataTotal}} {{$t("Files.TotalFiles")}}</div>
                <div style="display: inline-block">
                  <Page
                    :total="dataTotal"
                    :current="pageIndex"
                    :page-size="pageSize"
                    @on-change="pageIndexChange"
                  ></Page>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="panel-detail" v-show="showDetail" ref="topicSpace">
          <topic-info ref="topicInfo" :is-shown="showDetail" :inList="true"></topic-info>
        </div>
      </div>
      <!-- <div class="panel-gutter"></div> -->
    </div>

    <Modal v-model="moveSyncRoom.moveSyncRoomModal" :mask-closable="false" title="Move SyncRoom" width="500" style="z-index: 1000; position: absolute;">
      <div style="width:100%;padding:20px 0px 20px 0px;">
        <p style="font-size:14px;font-weight:550">Select Team</p>
        <p style="margin-top:5px;">
          <Select v-model="seleceTeamId" style="width:100%">
            <Option v-for="item in teamList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </p>
      </div>
      <div style="width:100%;padding:20px 0px 20px 0px;">
        <p style="font-size:14px;font-weight:550">Select Space</p>
        <p style="margin-top:5px;">
          <Select v-model="moveSyncRoom.selecetSpaceId" style="width:100%">
            <Option v-for="item in sapceList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </p>
      </div>
      <div slot="close" style="display:none"></div>
      <div slot="footer">
        <Button type="primary" :loading="loading" @click="handMoveOk">{{$t('Base.OK')}}</Button>
        <Button @click="handMoveCancel">{{$t('Base.Cancel')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<style lang="scss">
.forProject-topic {
  width: 100%;
  height: calc(100% - 68px);

  .table-action-icon {
    opacity: 0;
    cursor: pointer;
    margin-right: 1em;
  }

  tr:hover .table-action-icon,
  .ivu-table-row-highlight .table-action-icon {
    opacity: 1;
  }

  .ivu-table th {
    background-color: #495060;
    color: white;
  }

  .ivu-table-row-highlight td,
  .ivu-table-stripe
  .ivu-table-body
  tr.ivu-table-row-highlight:nth-child(2n)
    td {
    background-color: #dddee1;
  }

  .topic-flexviews {
    background-color: transparent;
    display: -webkit-box;
    display: -moz-box;
    display: box;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    //padding-top: 15px;
    //padding-bottom: 15px;
    width: 100%;
    align-items: stretch;
    min-height: 100%;

    .panel-gutter {
      -webkit-box-flex: 1;
      -moz-box-flex: 1;
      box-flex: 1;
      -webkit-flex: 1 0 15px;
      -moz-flex: 1 0 15px;
      -ms-flex: 1 0 15px;
      flex: 1 0 15px;
    }

    .panel-catalog {
      box-flex: 0;
      flex: 0 0 270px;
      box-pack: start;
      justify-content: flex-start;
      //margin-right: 15px;
      background-color: #ffffff;
      //box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      //border-radius: 3px;
      border-right: 1px solid #dddee1;
      position: relative;
    }

    .panel-content {
      -webkit-box-flex: 5500;
      -moz-box-flex: 5500;
      box-flex: 5500;
      -webkit-flex: 5500 1 500px;
      -moz-flex: 5500 1 500px;
      -ms-flex: 5500 1 500px;
      flex: 5500 1 500px;
      background-color: #ffffff;
      position: relative;
      overflow-x: hidden;

      .topic-sync-room-table{
        padding: 24px;
        background-color: #FBFBFD;
        height: calc(100vh - 145px);
        overflow-y: auto;
        width: 100%;
        display: flex;
        -webkit-box-align: stretch;
        -ms-flex-align: stretch;
        align-items: stretch;        
        position: relative;

        .table-space{
          padding: 24px;
          background-color: rgb(255, 255, 255);
          width: 100%;
          .sync-room-title{
            text-align: left;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 24px;
          }
          td{
            cursor: pointer;
          }
          .ivu-table-header tr th:last-child{
            .ivu-table-cell{
              padding-left: 0px;
              padding-right: 0px;
            }
          }
          .ivu-table-body tr td:last-child{
            .ivu-table-cell{
              padding-left: 0px;
              padding-right: 0px;
            }
          }
        }

        .table-action-icon {
          opacity: 0;
          cursor: pointer;
        }

        tr:hover .table-action-icon,
        .ivu-table-row-highlight .table-action-icon {
          opacity: 1;
        }
      }
      .panel-detail {
        position: absolute;
        right: 0px;
        top:0px;
        height: 100%;
        z-index: 10;
        width: 400px;
        border-left: 1px solid #dddee1;

        background-color: #ffffff;
      }
    }
  }

  .panel-content {
    position: relative;

    .topic-header{
      width: 100%;
      text-align: left;
      padding: 20px;
      position: relative;
      border-bottom: 1px solid #dddee1;

      span{
        font-size: 13px;
        display: inline-block;
        color: #bdc5b8;
      }
      .topic-name{
        font-weight: bold;
        font-size: 16px;
        color:black;
      }
      .topic-time{
        margin-left: 10px;
      }
      .new-sync-room{
        float:right;
        margin-right: 2em;
        span{
          color:white;
        }
      }
      .topic-more {
        position:absolute;
        right: 40px;
        bottom: -8px;
        height: 40px;
        width: 40px;
        border-radius: 50%;
        z-index: 1;
        padding: 8px;
        text-align: center;
        border: 1px solid #dddee1;
        //border: 2px solid rgba(0, 0, 0, 0.2);
        background-color: white;
        cursor: pointer;
      }
    }
  }
}
</style>

<script>
import TopicLeftPart from "./TopicLeftPart.vue";
import TopicInfo from "./TopicInfo.vue";
import auth from "../../authenticator";
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
var Mystorage=sessionStorage;

export default {
  components: {
    TopicLeftPart,
    TopicInfo,
  },
  data() {
    return {     
      selectedHeader: 1, 
      catalog: {type: -1, id: -1, name: 'No team selected', created: new Date()},
      showDetail: false,
      topicData: [],
      topicColumn: [
        {
          title: "Name",
          key: "name",
          align:"left",
          sortable: true,
          minWidth:200,
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: ($event) => {
                    event.stopPropagation();
                    this.handleSyncRoom(params.row.id);
                  }
                },
              },
              params.row.name
            );
          }
        },
        {
          title: this.$t('Activity.Host'),
          key: "host",
          align:"left",
        },
        {
          title: "Type",
          key: 'typeName',
          align:"left",
        },
        {
          title: "Created Date",
          key: 'createdDate',
          sortable: true,
          align:"left",
        },
        {
          title: "Members",
          key: 'members',
          sortable: true,
          align:"left",
        },
        {
          title: "Documents",
          key: "documents",
          align:"left",
        },
        {
          title: "Meetings",
          key: "meetings",
          align:"left",
        },
        {
          title: " ",
          key: "action",
          width: 80,
          align:"center",
          renderHeader:(h,params)=>{
            return h("span",{domProps:{title:this.$t('KloudSyncDocLeftPart.MoreAction')},style:{display:'inline-block',width:"80px",cursor:'pointer'}},[
                h('Icon', {props: {type: 'help-buoy', size: '16',color:"white"}}),
              ]
            )
          },
          render: (h, params) => {
            return h("Dropdown",
              {props:{trigger:"hover",placement:"bottom-end"},class:'table-action-icon',
                on:{
                  "on-click": ($event) => {
                    event.stopPropagation();
                    this.handleTopicAction($event,params);
                  }
                }
              },
                  [h("span",{style:{display:"inline-block",width:"80px"},
                    on:{
                      "click": ($event) => {
                        event.stopPropagation();
                      }
                    }
                  },[
                    h("span",{style:{display:"inline-block",width:"80px"}},[h('Icon', {props: {type: 'more', size: '16', color: 'black'}})]),
                  ]),
                  h('DropdownMenu',{slot:"list"},[
                    h("DropdownItem",{props:{name:'open'},},"Open"),
                    h("DropdownItem",{props:{name:'property'},},"Edit"),
                    h("DropdownItem",{props:{name:'move'},},"Move"),
                    h("DropdownItem",{props:{name:'close'},},"Close"),
                    h("DropdownItem",{props:{name:'quit'},},"Quit SyncRoom"),
                    h("DropdownItem",{props:{name:'delete'},},"Delete"),
                    h("DropdownItem",{props:{name:'share'},},"Copy Url"),
                  ]
              )]);
          }
        }
      ],
      dataTotal: 0,
      pageSize: 15,
      pageIndex: 1,
      loading: false,
      moveSyncRoom:{
        moveSyncRoomModal:false,
        selecetSpaceId:-1,
      },
      moveToSyncRoomId:-1,
      seleceTeamId:-1,

      teamList:[],
      sapceList:[],
    };
  },
  computed: {
    ...mapState(['kloudsyncTopic']),
    schoolId() {
      return auth.getChosenSchoolId();
    },
    currentTeam() {
      return this.kloudsyncTopic.currentTeam;
    },
    currentSpace() {
      return this.kloudsyncTopic.currentSpace;
    },
    currentTopic() {
      return this.kloudsyncTopic.currentTopic;
    },
  },
  watch: {
    currentTeam: {
      handler: function(from, to) {
        this._resetCatalog();
      },
      deep: true
    },
    currentSpace: {
      handler: function(from, to) {
        this._resetCatalog();
      },
      deep: true
    },
    seleceTeamId(from, to) {
      this.$nextTick(() => {
        this._loadMoveSpaceList();
      });
    }
  },
  created () {
    document.body.addEventListener("mousedown",this.hideTopicInfo)
  },
  mounted () {
    //记住info侧边栏的打开或者关闭状态
    if(Mystorage.getItem("Kloudsync.Topic.ShowDetail") && Mystorage.getItem("Kloudsync.Topic.ShowDetail")=='true'){
      this.showDetail = true;
    }else{
      this.showDetail = false;
    }
  },
  beforeDestroy() {
    document.body.removeEventListener('mousedown',this.hideTopicInfo)
  },
  methods: {
    hideTopicInfo(envent){
      //除了侧滑栏内部
      if(!this.$refs.topicSpace.contains(envent.target) && 
         !this.$refs.syncRoomTable.contains(envent.target) && 
         !$(envent.target).is(".ivu-modal-wrap *") && 
         $(envent.target).attr("class") != "ivu-modal-wrap"){
        this.showDetail=false;
      }
    },
    getTeamList(val){
      if(val){
        this.teamList = val;
      }
    },
        
    _loadMoveSpaceList(){
      if (!this.seleceTeamId || this.currentTeam.id <= 0) {
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "TeamSpace/List?type=2";
      url += "&companyID=" + this.schoolId;
      url += "&parentID=" + this.seleceTeamId;

      this.sapceList=[];

      this._getData(url, null, data => {
        let list = [];
        for(let i = 0; i < data.length; i++) {
          let item = {
            id: data[i].ItemID,
            name: data[i].Name,
            createdDate: data[i].CreatedDate,
            memberType: data[i].MemberType,
          };
          list.push(item);
        }

        self.sapceList = list;
      }, null);
    },
    handleSyncRoom(syncRoomID){
      this.$nextTick(()=>{
        this.$router.push({ name: "syncroom", params: { id:  syncRoomID} });
      })
    },
    handleTopicAction(name,param) {
      switch (name) {
        case 'open':
          this.handleSyncRoom(param.row.id)
          break;
        case 'close':
          this.$refs.topicInfo.handleCloseTopic(param.row.id, param.row.type, param.row.name);
          break;
        case 'move':
          this.handMoveModal(param.row.id)
          break;

        case 'share':
          this.$refs.topicInfo.copySyncRoomLink(param.row.id);
          break;

        case 'quit':
          this.$refs.topicInfo.handleQuitTopic(param.row.id, param.row.type, param.row.name);
          break;
        case 'property':
          this.$refs.topicInfo.handleTopicProperty(param.row.id);
          break;
        case 'delete':
          if (this.$refs.topicInfo.catalogType === 2) {
            // Topic
            this.$refs.topicInfo.handleDeleteTopic(param.row.id, param.row.type, param.row.name);
          }
          else if (this.$refs.topicInfo.catalogType === 1) {
            // Team
            this.$refs.topicInfo.handleDeleteTeam();
          }
          break;
      }
    },
    handMoveOk(){
      if(this.seleceTeamId <= 0){
        this.$Message.info({content: "Please select a team",duration: 3});
        return;
      }
      if(this.moveSyncRoom.selecetSpaceId <=0){
        this.$Message.info({content: "Please select a space",duration: 3});
        return;
      }
      let url=GetAPIUrl()+"SyncRoom/SwitchSpace?syncRoomID="+this.moveToSyncRoomId+"&spaceID="+this.moveSyncRoom.selecetSpaceId;
      this._postData(url,null,null,
        result => {
          this.$Message.info({content: "SyncRoom Move Successfully",duration: 3});
          this.handMoveCancel();
          this.loadTopicList();
        },
        null
      );
    },
    handMoveCancel(){
      this.seleceTeamId = -1;
      this.moveSyncRoom={moveSyncRoomModal:false,selecetSpaceId:-1}
    },
    handMoveModal(id){
      this.seleceTeamId = -1;
      this.moveSyncRoom={moveSyncRoomModal:true,selecetSpaceId:-1}
      this.moveToSyncRoomId = id;
    },
    closeDetail(){
      this.showDetail = false;
    },
    tableRowClick(item){
      if (item) {
        if (this.currentTopic && this.currentTopic.id == item.id) {
          this.showDetail = !this.showDetail;
        }
        else {
          this.kloudsyncTopic.currentTopic = item;
          this.showDetail = true;
        }

        if (this.showDetail) {
          this.$nextTick(()=>{
            this.$refs.topicInfo.initialize();
          })
        }

        // this.$nextTick(()=>{
        //   this.$router.push({ name: "syncroom", params: { id: item.id } });
        // })
      }
    },
    loadTopicList() {
      if (!this.catalog || this.catalog.id <= 0) {
        this.topicData = [];
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "SyncRoom/List?";
      url += "companyID=" + this.schoolId;

      if(this.currentSpace.id == 0){
        url += "&teamID=" + this.currentTeam.id;
      }else{
        url += "&spaceID=" + this.currentSpace.id;
      }
      
      url += "&pageIndex=" + (this.pageIndex - 1);
      url += "&pageSize=" + this.pageSize;

      this._getData(url, null, data => {
        self._initializeTopics(data);
      }, null);
    },
    _initializeTopics(data) {
      this.dataTotal = data.Total;

      let list = [];
      for (let i = 0, count = data.RoomList.length; i < count; i++) {
        let syncRoom = data.RoomList[i];
        let item = {
          id: syncRoom.ItemID,
          name: syncRoom.Name,
          host: syncRoom.CreatedByName,
          type: syncRoom.TopicType,
          typeName:this._topicTypeName(syncRoom.TopicType),
          createdDate: new Date(parseInt(syncRoom.CreatedDate)).Format("yyyy-MM-dd hh:mm:ss"),
          members: syncRoom.MemberCount,
          documents:syncRoom.DocumentCount,
          meetings:syncRoom.MeetingCount,
          memberType: syncRoom.MemberType,
          detail: syncRoom
        };

        list.push(item);
      }
      this.topicData = list;
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
    newSyncRoomModal(){
      this.$refs.leftPart.handleAddTopic();
    },
    changeTeamOrspace(){
      this.reset();
      this.loadTopicList();
    },
    reset() {
      this.pageIndex = 1;
    },
    pageIndexChange(page) {
      this.pageIndex = page;
      this.loadTopicList();
    },
    pageSizeChange(data) {
      this.pageIndex = 1;
      this.loadTopicList();
    },
    refresh() {
      this.$refs.leftPart.loadTeamList();
    },
    showTopicInfo(){
      this.showDetail = true;
      Mystorage.setItem("Kloudsync.Topic.ShowDetail", "true");
    },
    closeDetail() {
      this.$nextTick(()=>{
        this.showDetail = false;
        Mystorage.setItem("Kloudsync.Topic.ShowDetail", "false");
      })
    },
    _resetCatalog() {
      if (this.currentSpace && this.currentSpace.id > 0) {
        this.catalog = {
          type: 3,  // Team = 1; Space = 3; Topic = 2;
          id: this.currentSpace.id,
          name: this.currentSpace.name,
          created: new Date(parseInt(this.currentSpace.createdDate)).toString()
        };
      }
      else if (this.currentTeam && this.currentTeam.id > 0) {
        this.catalog = {
          type: 1,  // Team = 1; Space = 3; Topic = 2;
          id: this.currentTeam.id,
          name: this.currentTeam.name,
          created: new Date(parseInt(this.currentTeam.createdDate)).toString()
        };
      }
      else {
        this.catalog = {
          type: -1,
          id: -1,
          name: 'Please select a team or a space',
          created: new Date().toString()
        };
      }
    },
    handleClickHeader(header) {
      this.selectedHeader = header;
    },
    handleTopicInfoClick(e) {
      e.stopPropagation();
    },
    _getData(url, before, success, error) {
      this.loading = true;
      this.$Loading.start();

      if (before && typeof before === "function") {
        before();
      }

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
  }
}
</script>
