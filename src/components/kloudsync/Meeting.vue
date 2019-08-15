<template>
  <div id="kloadsyncHistoryView">
    <div class="paneGutter"></div>
    <div class="panelDetail">
      <div class="history-view-tabs">
        <Tabs v-model="currentTab" @on-click="tabOnClick">
          <TabPane name="active" :label="$t('Activity.Active')"></TabPane>
          <TabPane name="expired" :label="$t('Activity.Expired')"></TabPane>
          <TabPane name="finished" :label="$t('Activity.Finished')"></TabPane>
        </Tabs>
        <div class="kloadsync-newMeeting">
          <Dropdown @on-click="handleMeeting">
            <Button type="text" size="large" shape="circle" icon="plus-round">New Metting</Button>
            <DropdownMenu slot="list">
                <DropdownItem name="Schedule metting">Schedule metting</DropdownItem>
                <DropdownItem name="Start metting">Start a meeting now</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div>
        <div style="text-align:left;padding:10px 0px;">
          <Input v-model="searchMeeting " placeholder="Search meeting..." style="width:260px;" icon="ios-search" @on-enter="handleSearch" @on-click="handleSearch"></Input>
        </div>
        <div v-show="currentTab === 'active'">
          <Table size="small" :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true" :loading="loading"
                 :data="tableDataActive" :columns="tableColumnActive"
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
              <div style="display: inline-block; margin-right: 1em;">{{dataTotal}} Total Meetings</div>
              <div style="display: inline-block">
                <Page :total="dataTotal" :current="pageIndex" :page-size="pageSize" @on-change="pageIndexChange"></Page>
              </div>
            </div>
          </div>
        </div>

        <div v-show="currentTab === 'expired'">
          <Table size="small" :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true" :loading="loading"
                 :data="tableDataExpired" :columns="tableColumnExpired"
                 @on-sort-change="tableSortChange" @on-row-click="tableRowClick">
          </Table>
          <div style="margin: 16px 0; overflow: hidden;  text-align: left;">
            <Select v-model="pageSize_e" style="width:150px;" @on-change="pageSizeChange_e">
              <Option :value="10">{{$t('Common.Page10')}}</Option>
              <Option :value="25">{{$t('Common.Page25')}}</Option>
              <Option :value="50">{{$t('Common.Page50')}}</Option>
              <Option :value="100">{{$t('Common.Page100')}}</Option>
            </Select>

            <div style="float: right; display: flex; align-items: center;">
              <div style="display: inline-block; margin-right: 1em;">{{dataTotal_e}} Total Meetings</div>
              <div style="display: inline-block">
                <Page :total="dataTotal_e" :current="pageIndex_e" :page-size="pageSize_e" @on-change="pageIndexChange_e"></Page>
              </div>
            </div>
          </div>
        </div>

        <div v-show="currentTab === 'finished'">
          <Table size="small" :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true" :loading="loading"
                 :data="tableDataFinished" :columns="tableColumnFinished"
                 @on-sort-change="tableSortChange" @on-row-click="tableRowClick">
          </Table>
          <div style="margin: 16px 0; overflow: hidden;  text-align: left;">
            <Select v-model="pageSize_f" style="width:150px;" @on-change="pageSizeChange_f">
              <Option :value="10">{{$t('Common.Page10')}}</Option>
              <Option :value="25">{{$t('Common.Page25')}}</Option>
              <Option :value="50">{{$t('Common.Page50')}}</Option>
              <Option :value="100">{{$t('Common.Page100')}}</Option>
            </Select>

            <div style="float: right; display: flex; align-items: center;">
              <div style="display: inline-block; margin-right: 1em;">{{dataTotal_f}} Total Meetings</div>
              <div style="display: inline-block">
                <Page :total="dataTotal_f" :current="pageIndex_f" :page-size="pageSize_f" @on-change="pageIndexChange_f"></Page>
              </div>
            </div>
          </div>
        </div>

        <div>
          <kloudsync-meeting-info ref="meetingInfo" :currentTab="currentTab"></kloudsync-meeting-info>
        </div>
      </div>
    </div>
    <div class="paneGutter"></div>
  </div>
</template>

<style lang="scss">
#kloadsyncHistoryView {
  background-color: transparent;
  display: -webkit-box;
  display: -moz-box;
  display: box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flexbox;
  display: flex;
  min-height: 1px;
  padding-top: 20px;
  min-width: 785px;
  min-height: 200px;
  width: 100%;

  .paneGutter {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    box-flex: 1;
    -webkit-flex: 1 0 20px;
    -moz-flex: 1 0 20px;
    -ms-flex: 1 0 20px;
    flex: 1 0 20px;
  }

  .panelDetail {
    -webkit-box-flex: 5500;
    -moz-box-flex: 5500;
    box-flex: 5500;
    -webkit-flex: 5500 1 500px;
    -moz-flex: 5500 1 500px;
    -ms-flex: 5500 1 500px;
    flex: 5500 1 500px;
    max-width: 1500px;
    min-width: 500px;

    background-color: #ffffff;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    border-radius: 3px;

    padding: 28px;
  }

  .history-view-tabs {
    position: relative;
    .ivu-tabs-nav-container {
      font-size: 20px;
      font-weight: bold;
    }
    .kloadsync-newMeeting{
      position: absolute;
      right:0px;
      top:10px;
    }
  }

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

  .ivu-table-row-highlight td {
    background-color: #dddee1;
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
</style>

<script>
import auth from "../../authenticator";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import KloudsyncMeetingInfo from "./KloudsyncMeetingInfo.vue";

export default {
  name:'kloudsync-meeting',
  components: {
    KloudsyncMeetingInfo
  },
  data: function() {
    return {
      currentTab: "active",
      loading: false,
      dataTotal: 0,
      pageSize: 10,
      pageIndex: 1,
      dataTotal_f: 0,
      pageSize_f: 10,
      pageIndex_f: 1,
      dataTotal_e: 0,
      pageSize_e: 10,
      pageIndex_e: 1,
      sortKey: 0,
      sortOrder: 1,
      tableDataActive: [],
      tableColumnActive: [
        {
          title: this.$t('Activity.Name'),
          key: "name",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.Name"));
          },
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.handleViewActivity(params);
                  }
                },
              },
              params.row.name
            );
          }
        },
        {
          title: this.$t('Activity.Meeting'),
          key: "course",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.Meeting"));
          },
        },
        {
          title: this.$t('Activity.Start'),
          key: "start",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.Start"));
          },
        },
        {
          title:this.$t('Activity.End'),
          key: "end",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.End"));
          },
        },
        {
          title: this.$t('Activity.Duration'),
          key: "duration",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.Duration"));
          },
        },
        {
          title: this.$t('Activity.Host'),
          key: "host",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.Host"));
          },
        },
        {
          title: this.$t('Activity.Attendees'),
          key: "attendees",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.Attendees"));
          },
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
            return h("Dropdown",{props:{trigger:"hover"},class: 'table-action-icon'},
            [h("span",{style:{display:"inline-block",width:"80px"}},[h('Icon', {props: {type: 'more', size: '16', color: 'black'}})]),h('DropdownMenu',{slot:"list"},
            [
              h("div",{props:{name:"view"},style:{padding:'3px 0px 3px 20px',textAlign:'left'},
              on:{
                click: () => {
                  this.handleViewActivity(params);
                }
              }
              },[h('Icon', {props: {type: 'eye', size: '16'}}),h("span",{style:'display:inline-block;margin-left:5px'},"View")]),
              h("div",{props:{name:"share"},style:{padding:'3px 0px 3px 20px',textAlign:'left'},
              on:{
                click: () => {
                  this.handleEditActivity(params);
                }
              }},[h('Icon', {props: {type: 'ios-compose-outline', size: '18'}}),h("span",{style:'display:inline-block;margin-left:5px'},"Edit")]),
              h("div",{props:{name:"delete"},style:{padding:'3px 0px 3px 20px',textAlign:'left'},
                on:{
                  click: () => {
                    this.handleDeleteActivity(params);
                  }
                }},[h('Icon', {props: {type: 'ios-trash-outline', size: '18'}}),h("span",{style:'display:inline-block;margin-left:5px'},"Delete")])]
            )]);
          }
        }
      ],
      tableDataFinished: [],
      tableColumnFinished: [
        {
          title: this.$t('Activity.Name'),
          key: "name",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.Name"));
          },
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.handleViewActivity(params);
                  }
                },
              },
              params.row.name
            );
          }
        },
        {
          title:this.$t('Activity.Meeting'),
          key: "course",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.Meeting"));
          },
        },
        {
          title: this.$t('Activity.Start'),
          key: "start",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.Start"));
          },
        },
        {
          title: this.$t('Activity.End'),
          key: "end",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.End"));
          },
        },
        {
          title: this.$t('Activity.Duration'),
          key: "duration",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.Duration"));
          },
        },
        {
          title:this.$t('Activity.Host'),
          key: "host",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.Host"));
          },
        },
        {
          title:this.$t('Activity.Attendees'),
          key: "attendees",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.Attendees"));
          },
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
            return h("Dropdown",{props:{trigger:"hover"},class: 'table-action-icon'},
            [h("span",{style:{display:"inline-block",width:"80px"}},[h('Icon', {props: {type: 'more', size: '16', color: 'black'}})]),h('DropdownMenu',{slot:"list"},
            [
              h("div",{props:{name:"view"},style:{padding:'3px 0px 3px 20px',textAlign:'left'},
              on:{
                click: () => {
                  this.handleViewActivity(params);
                }
              }
              },[h('Icon', {props: {type: 'eye', size: '16'}}),h("span",{style:'display:inline-block;margin-left:5px'},"View")]),
              h("div",{props:{name:"view"},style:{padding:'3px 0px 3px 20px',textAlign:'left'},
              on:{
                click: () => {
                  this.handleEditActivity(params);
                }
              }
              },[h('Icon', {props: {type: 'ios-compose-outline', size: '16'}}),h("span",{style:'display:inline-block;margin-left:5px'},"Property")]),
              h('Poptip',{props:{trigger:'click',placement:"left-start"},},[
                h("div",{props:{name:"share"},style:{padding:'3px 0px 3px 20px',textAlign:'left',marginLeft:'-30px'},
                  on:{
                    click: () => {
                      this.handleShareFMeeting(params);
                    }
                }},[h('Icon', {props: {type: 'android-share-alt', size: '16'}}),h("span",{style:'display:inline-block;margin-left:5px'},"Share")]),
                h('div',{slot:"content",style:{maxHeight:"30vh",overflow:"auto"}},
                  this.syncsList.map(item=>{
                    return h('div',{style:{padding:"5px 15px 5px 5px",borderBottom:'1px solid #ddd',cursor: "pointer"}},[
                      h('p',{style:{marginBottom:"5px",fontWeight: "bold",fontSize: "14px"},},item.Title),
                      h('p',[
                        h('span',{style:{display:'inline-block'},},[
                          h('Avatar',{props:{src:item.AvatarUrl}}),
                          h('span',{style:{marginLeft:"5px",display:'inline-block',width: '80px',whiteSpace: 'nowrap',overflow: 'hidden',textOverflow: 'ellipsis',marginBottom:'-5px'}},item.UserName),
                          h('span',{style:{marginLeft:"30px",display:'inline-block'}},item.Duration),
                          h('span',{style:{display:'inline-block',cursor: "pointer",marginTop:"7px",marginLeft:"70px",marginBottom:'-7px',color:'#2facf7'},
                            on:{
                              click: () => {
                                this.handleShareFMeetingLink(item);
                              }
                            }
                          },[h('span',{style:{marginRight:'5px',display:'inline-block'}},
                            [h('Icon', {props: {type: 'android-share-alt', size: '16', color: '#2facf7'},style:{marginRight:'5px'}}),'Copy Link'])]),
                        ]),
                      ])
                    ])
                  })
                )
              ]),
              h("div",{props:{name:"delete"},style:{padding:'3px 0px 3px 20px',textAlign:'left'},
                on:{
                  click: () => {
                    this.handleDeleteActivity(params);
                  }
                }},[h('Icon', {props: {type: 'ios-trash-outline', size: '18'}}),h("span",{style:'display:inline-block;margin-left:5px'},"Delete")])]
            )]);
          }
        }
      ],
      tableDataExpired: [],
      tableColumnExpired:[
        {
          title: this.$t('Activity.Name'),
          key: "name",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.Name"));
          },
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.handleViewActivity(params);
                  }
                },
              },
              params.row.name
            );
          }
        },
        {
          title:this.$t('Activity.Meeting'),
          key: "course",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.Meeting"));
          },
        },
        {
          title: this.$t('Activity.Start'),
          key: "start",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.Start"));
          },
        },
        {
          title: this.$t('Activity.End'),
          key: "end",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.End"));
          },
        },
        {
          title: this.$t('Activity.Duration'),
          key: "duration",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.Duration"));
          },
        },
        {
          title:this.$t('Activity.Host'),
          key: "host",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Activity.Host"));
          },
        },
        {
          title:this.$t('Activity.Attendees'),
          key: "attendees",
          sortable: true,renderHeader: (h, params) => {
            return h("span",this.$t("Activity.Attendees"));
          },
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
            return h("Dropdown",{props:{trigger:"hover"},class: 'table-action-icon'},
            [h("span",{style:{display:"inline-block",width:"80px"}},[h('Icon', {props: {type: 'more', size: '16', color: 'black'}})]),h('DropdownMenu',{slot:"list"},
            [
              h("div",{props:{name:"view"},style:{padding:'3px 0px 3px 20px',textAlign:'left'},
              on:{
                click: () => {
                  this.handleViewActivity(params);
                }
              }
              },[h('Icon', {props: {type: 'eye', size: '16'}}),h("span",{style:'display:inline-block;margin-left:5px'},"View")]),
              h("div",{props:{name:"delete"},style:{padding:'3px 0px 3px 20px',textAlign:'left'},
                on:{
                  click: () => {
                    this.handleDeleteActivity(params);
                  }
                }},[h('Icon', {props: {type: 'ios-trash-outline', size: '18'}}),h("span",{style:'display:inline-block;margin-left:5px'},"Delete")])]
            )]);
          }
        }
      ],
      syncsList:[],
      searchMeeting:'',
    };
  },
  mounted: function() {
    this.$parent.$emit("viewChanged", "activity");
    
    //获取记住的currentTab
    if(auth.getMeetingCurrentTab()){
      this.currentTab=auth.getMeetingCurrentTab();
      this.$nextTick(()=>{
        this.getotalData();
      })
    }else{
      this.getotalData();
    }
  },
  methods: {
    handleShareFMeetingLink(item){
      var url=location.origin.toLowerCase();
      url+="/meeting/"+item.SoundtrackID;
        navigator.clipboard.writeText(url).then(()=>{
            this.$Message.info({content: this.$t("Live.CopySyncUrlSuccess"), duration: 3});
      },()=>{
          this.$Message.error({content: this.$t("Live.CopySyncUrlFailed"+"\n\n"+url), duration: 3});
      });
    },
    handleShareFMeeting(params){
      this.syncsList=[];
      let url=GetAPIUrl()+"LessonSoundtrack/List?attachmentID=0&lessonID="+params.row.id;
      let self=this;
      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            self.syncsList = result.RetData;
            if(self.syncsList.length==0){
              self.$Message.info({content: 'No Sharable Resources', duration: 3});
            }
          }
        },
      });
    },
    handleMeeting(name){
      switch (name) {
        case "Schedule metting":
          this.kloudsyncNewMeeting();
          break;
        case "Start metting":
          this.enterKlassroom();
          break;
        default:
          break;
      }
    },
    enterKlassroom(){
      var classRoomID = auth.getClassroomID();
      if (classRoomID == "0" || classRoomID == "")
      {
        this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: "No ClassRoomID, Please set your ClassRoomID first!", top: 24,duration: 4, left:true });
        return;
      }
      this.changeLessonID(0);
      if (!this.getSocket().isopen())
      {
        this.$Message.error(
          {
            content: 'Connecting to Klassroom Server is unsuccessful.   Please contact your system admin!',
            duration: 0,
            closable: true
          });
        return;
      }
      this.$router.push({ name: 'live', params: { id: classRoomID } });
      return;

    },
    getClassRoomLessonID(id){
      return new Promise(function (resolve, reject)
      {
        var sessionid = MyStorage.getItem('UserToken');
        var url = GetAPIUrl() + "Lesson/GetClassRoomLessonID?classroomID=" + id;
        $.ajax({
          type: 'GET',
          url: url,
          beforeSend: function (request)
          {
            request.setRequestHeader("UserToken", sessionid);
          },
          success: function (data)
          {
            if (data.RetData == "")
            {
              resolve(0);
            }
            else
            {
              resolve(parseInt(data.RetData));
            }
          },
          error: function (xhr, ajaxOptions, thrownError)
          {
            console.log(xhr);
            resolve(0);
          }
        });
      });
    },
    getSocket(){
      return this.$root.$children[0].$refs.noticemsg.obj;
    },
    addInstantLesson(id)
    {
      return new Promise(function (resolve, reject)
      {
        var sessionid = MyStorage.getItem('UserToken');
        var url = GetAPIUrl() + "Lesson/AddInstantLesson?classroomID=" + id;
        $.ajax({
          type: 'POST',
          url: url,
          beforeSend: function (request)
          {
            request.setRequestHeader("UserToken", sessionid);
          },
          success: function (data)
          {
            if (data.RetData == "")
            {
              resolve(0);
            }
            else
            {
              resolve(parseInt(data.RetData));
            }
          },
          error: function (xhr, ajaxOptions, thrownError)
          {
            console.log(xhr);
            resolve(0);
          }
        });
      });
    },
    kloudsyncNewMeeting(){
      this.$router.push({name:'kloudsync-schedule-meeting'});
    },
    tabOnClick(name){
      this.searchMeeting = "";
      switch (name) {
        case 'active':
          this.getotalData();
          auth.setMeetingCurrentTab("active");
          break;
        case 'expired':
          this.getotalData();
          auth.setMeetingCurrentTab("expired");
          break;
        case 'finished':
          this.getotalData();
          auth.setMeetingCurrentTab("finished");
          break;
        default:
          break;
      }
    },
    handleSearch(){
      this.pageIndex = 1;
      this.pageIndex_e = 1;
      this.pageIndex_f = 1;
      this.getotalData();
    },
    getotalData(){
      let self = this;
      let schoolId = auth.getChosenSchoolId();
      let url = GetAPIUrl() + "Lesson/List?roleID=3&isPublish=1";

      if(this.searchMeeting){
        url += "&keyword="+encodeURIComponent(base64encode(utf16to8(trimStr(this.searchMeeting))));
      }

      //参数type Active = 1,  Expired = 2,    Finished = 3
      switch (this.currentTab) {
        case 'active':
          url+="&type="+1
          break;
        case 'expired':
          url+="&type="+2
          break;
        case 'finished':
          url+="&type="+3
          break;
        default:
          break;
      }

      this.$Loading.start();
      this.loading = true;
      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            self.$Loading.finish();
            self.loading = false;

            switch (self.currentTab) {
              case 'active':
                self.dataTotal=result.RetData.length;
                self.afterDelUpdatedIndex();
                break;
              case 'expired':
                self.dataTotal_e=result.RetData.length;
                self.afterDelUpdatedExpiredIndex();
                break;
              case 'finished':
                self.dataTotal_f=result.RetData.length;
                self.afterDelUpdatedFinshIndex();
                break;
              default:
                break;
            }

            self.getLessonData();

          } else {
            // self.$Message.error(result.ErrorMessage);
            self.$Loading.error();
            self.loading = false;
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          console.log(xhr);
          self.$Loading.error();
          self.loading = false;
        }
      });
    },
    pageIndexChange (page) {
      this.pageIndex = page;
      this.getLessonData();
    },
    pageSizeChange (data) {
      this.pageIndex = 1;
      this.getLessonData();
    },
    pageIndexChange_e (page) {
      this.pageIndex_e = page;
      this.getLessonData();
    },
    pageSizeChange_e (data) {
      this.pageIndex_e = 1;
      this.getLessonData();
    },
    pageIndexChange_f (page) {
      this.pageIndex_f = page;
      this.getLessonData();
    },
    pageSizeChange_f (data) {
      this.pageIndex_f = 1;
      this.getLessonData();
    },
    getLessonData() {
      let self = this;
      let schoolId = auth.getChosenSchoolId();
      let url = GetAPIUrl() + "Lesson/List?roleID=3&isPublish=1";

      if(this.searchMeeting){
        url += "&keyword="+encodeURIComponent(base64encode(utf16to8(trimStr(this.searchMeeting))));
      }
      
      
      //参数type Active = 1,  Expired = 2,    Finished = 3
      switch (this.currentTab) {
        case 'active':
          url+="&pageIndex="+(this.pageIndex-1)+"&pageSize="+this.pageSize+"&type="+1
          break;
        case 'expired':
          url+="&pageIndex="+(this.pageIndex_e-1)+"&pageSize="+this.pageSize_e+"&type="+2
          break;
        case 'finished':
          url+="&pageIndex="+(this.pageIndex_f-1)+"&pageSize="+this.pageSize_f+"&type="+3
          break;
        default:
          break;
      }

      this.$Loading.start();
      this.loading = true;
      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            self.$Loading.finish();
            self.loading = false;

            let list = [];
            
            for (let i = 0; i < result.RetData.length; i++) {
              let data = result.RetData[i];
              let start ;
              let end ;
              if(self.currentTab=="finished"){
                start = data.ActualStartDate ? new Date(parseInt(data.ActualStartDate)) : null;
                end = data.ActualEndDate ? new Date(parseInt(data.ActualEndDate)) : null;
              }else{
                start = data.PlanedStartDate ? new Date(parseInt(data.PlanedStartDate)) : null;
                end = data.PlanedEndDate ? new Date(parseInt(data.PlanedEndDate)) : null;
              }
              
              let durations="";
              if(self.currentTab=="finished"){
                if(data.ActualStartDate &&  data.ActualEndDate){

                    let distancetime=end.getTime()-start.getTime();
                    var sec = Math.floor(distancetime/1000%60);
                    var min = Math.floor(distancetime/1000/60%60);
                    var hour = Math.floor(distancetime/1000/60/60%24);
                    
                    if(sec<10){
                        sec = "0"+ sec;
                    }
                    if(min<10){
                        min = "0"+ min;
                    }
                    if(hour<10){
                        hour = "0"+ hour;
                    }

                    durations= hour + ":" +min + ":" +sec ;
                }

              }else{
                if(data.PlanedStartDate &&  data.PlanedEndDate){

                    let distancetime=end.getTime()-start.getTime();
                    var sec = Math.floor(distancetime/1000%60);
                    var min = Math.floor(distancetime/1000/60%60);
                    var hour = Math.floor(distancetime/1000/60/60%24);
                    
                    if(sec<10){
                        sec = "0"+ sec;
                    }
                    if(min<10){
                        min = "0"+ min;
                    }
                    if(hour<10){
                        hour = "0"+ hour;
                    }

                    durations= hour + ":" +min + ":" +sec ;
                }

              }
              
              let item = {
                id: data.LessonID,
                name: data.Title,
                course: data.LessonType!=5?data.CourseName:self.$t("Activity.Meeting"),
                host: data.TeacherNames,
                attendees: data.StudentNames,
                start: start ? start.toLocaleString() : "",
                end: end ? end.toLocaleString() : "",
                duration:durations
              };

              list.push(item);
            }

            switch (self.currentTab) {
              case 'active':
                self.tableDataActive = list;
                break;
              case 'expired':
                self.tableDataExpired = list;
                break;
              case 'finished':
                self.tableDataFinished = list;
                break;
              default:
                break;
            }

          } else {
            // self.$Message.error(result.ErrorMessage);
            self.$Loading.error();
            self.loading = false;
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          console.log(xhr);
          self.$Loading.error();
          self.loading = false;
        }
      });
    },
    tableSortChange(params) {},
    tableRowClick(row) {},
    handleViewActivity(params) {
      this.changeLessonID(0);
      let id = params.row.id;
      this.$router.push({ name: "live", params: { id: id } });
    },
    handleEditActivity(params) {
      this.$refs.meetingInfo.showEdit(params.row.id, this.handleRefresh);
    },
    handleRefresh() {
      this.getLessonData();
    },
    //删除后更新页码
    afterDelUpdatedIndex(){
      let total=this.dataTotal;
      let pageSize=this.pageSize;
      let maxInt=Math.ceil(total/pageSize);
      if(maxInt<this.pageIndex && maxInt!=0){
        this.pageIndex=maxInt;
      }
    },
    afterDelUpdatedExpiredIndex(){
      let total=this.dataTotal_e;
      let pageSize=this.pageSize_e;
      let maxInt=Math.ceil(total/pageSize);
      if(maxInt<this.pageIndex_e && maxInt!=0){
        this.pageIndex_e=maxInt;
      }
    },
    afterDelUpdatedFinshIndex(){
      let total=this.dataTotal_f;
      let pageSize=this.pageSize_f;
      let maxInt=Math.ceil(total/pageSize);
      if(maxInt<this.pageIndex_f && maxInt!=0){
        this.pageIndex_f=maxInt;
      }
    },
    handleDeleteActivity(params) {
      let self = this;

      this.$Modal.confirm({
        title: self.$t("Activity.ModalDeleteTitle"),
        content: self.$t("Activity.ModalDeleteContent"),
        okText: self.$t("Base.Delete"),
        cancelText: self.$t("Base.Cancel"),
        onOk: () => {
          let id = params.row.id;
          let url = GetAPIUrl() + "Lesson/Delete?lessonID=" + id;
          $.ajax({
            type: "DELETE",
            url: url,
            beforeSend: function(request) {
              request.setRequestHeader("UserToken", auth.getUserToken());
            },
            success: function(result) {
              if (result.RetCode === 0) {

                switch (self.currentTab) {
                  case 'active':
                    self.tableDataActive.splice(params.index, 1);
                    break;
                  case 'expired':
                    self.tableDataExpired.splice(params.index, 1);
                    break;
                  case 'finished':
                    self.tableDataFinished.splice(params.index, 1);
                    break;
                  default:
                    break;
                }

                self.getotalData();

              } else {
                // error
                console.log(result);
              }
            },
            error: function(xhr, ajaxOptions, thrownError) {
              console.log(xhr);
            }
          });
        }
      });
    },
    ...mapMutations(["changeLessonID"])
  }
};
</script>
