<template>
  <div class="forProject-kloudsync-topic-meetings" :style="{'height':inSyncRoomMeeting?'500px':'calc(100vh - 275px)','width':inSyncRoomMeeting?'400px':'100%'}">
    <div style="padding: 24px;">
      <!-- <div class="topic-action-header">
        Meetings

        <div class="topic-meeting-search">
          <Icon type="search" size="24"></Icon>
        </div>
      </div> -->
      
      <div class="sync-room-meeting-host">
        <Poptip placement="bottom" trigger="click" style="width:80%">
          <div slot="content">
              <div style="padding: 10px 0px;width: 160px;text-align: left;font-size: 13px;font-weight: 600;">
                  <div @click="startSyncRoomMeetingNow" style="padding: 5px 0px;cursor: pointer;width:100%">{{$t('TopicHomePage.StartMeeting')}}</div>
                  <div style="padding: 5px 0px;cursor: pointer;width:100%" @click="handleScheduleMeeting">{{$t('TopicHomePage.ScheduleMeeting')}}</div>
              </div>
          </div>
          <Button type="ghost" size="large" style="width:100%">{{$t('TopicHomePage.Hostmeeting')}}</Button>
        </Poptip>
        <!-- <Poptip placement="bottom-end" trigger="click" style="width:47%">
          <div slot="title">Join a Meeting</div>
          <div slot="content">
              <p style="font-weight:600">To connect to an online meeting ,enter the meeting room </p>
              <p style="font-weight:600">ID provided by the organizer.</p>
              <p style="margin-top:15px;margin-bottom:10px;">
                <Input v-model="joinLessonID" @on-keyup.enter="joinMeeting" placeholder="Meeting room ID" style="width: 245px"></Input>
                <Button type="success" size="large" style="margin-left:15px;" @click="joinMeeting">JOIN</Button>
              </p>
          </div>
          <Button type="ghost" size="large" style="width:100%">Join meeting</Button>
        </Poptip> -->
      </div>
    </div>
    <div class="sync-room-meeting-tab">
      <Tabs v-model="currentGroup" @on-click='handleGroupChange' style="width:100%">
        <TabPane :label="$t('TopicHomePage.Upcoming')" name="upcoming"></TabPane>
        <!-- <TabPane label="Past due" name="pastdue"></TabPane> -->
        <TabPane :label="$t('TopicHomePage.Finished')" name="finished"></TabPane>
      </Tabs>
    </div>
    <div :style="{'height':inSyncRoomMeeting?'360px':'calc(100vh - 415px)','overflow-y': 'auto'}">
      <div class="meeting-list">
        <div class="meeting-item" v-for="item in meetingList" :key="item.id">
          <div class="meeting-item-line1" @click="handleStartMeeting(item)">
            <div class="meeting-date">
              <p>{{item.startDate}}</p>
              <p>{{item.startMonth}}</p>
            </div>
            <div class="meeting-title" style="word-break:break-all;">
              {{item.title}}
            </div>
          </div>
          <div class="meeting-item-line2">
            <!-- <div>
              <p>Start</p>
              <p>{{item.startTime}}</p>
            </div>
            <div>
              <p>Duration</p>
              <p>{{item.duration}} min</p>
            </div>
            <div>
              <p>Attendee</p>
              <p>{{item.attendee}}</p>
            </div> -->
            <div style="padding:10px 0px;flex:1 1 200px;color:#999999">
              <div>{{item.startTime}}</div>
              <div>-</div>
              <div>{{item.endTime}}</div>
              <div style="padding:0px 3px">|</div>
              <div>{{item.attendee}}</div>
              <div>{{$t('TopicHomePage.AttendeesPeople')}}</div>
            </div>
            <div class="more-action">
              <!-- <div class="meeting-item-start">
                <span style="color:red" v-if="item.countDown!=false && currentGroup != 'pastdue'">{{item.countDown}}</span>
                <span @click="handleStartMeeting(item)" v-if="item.countDown!=false && currentGroup != 'pastdue'">START</span>
              </div> -->
              <Dropdown placement="bottom-end" style="float:right" @on-click="handleSyncRoomMeetinAction($event,item)">
                <span style="cursor: pointer;">
                  <Icon size="20" type="more"></Icon>
                </span>
                <DropdownMenu slot="list">
                  <DropdownItem name="Start">
                    <span style="display:inline-block" v-if="currentGroup == 'finished'">
                      <Icon type="log-in" size="15"></Icon>
                      <span style="display:inline-block;margin-left:5px;">{{$t('TopicHomePage.View')}}</span>
                    </span>
                    <span style="display:inline-block" v-else>
                      <Icon type="log-in" size="15" color="#2b85e4"></Icon>
                      <span style="display:inline-block;margin-left:5px;color:#2b85e4">{{$t('TopicHomePage.Start')}}</span>
                    </span>
                  </DropdownItem>
                  <DropdownItem name="invite">
                    <Icon type="ios-plus-outline" size="16"></Icon>
                    <span style="display:inline-block;margin-left:5px">{{$t('TopicHomePage.InviteAttendee')}}</span>
                  </DropdownItem>
                  <DropdownItem name="edit">
                    <Icon type="ios-compose-outline" size="16"></Icon>
                    <span style="display:inline-block;margin-left:5px">{{$t('TopicHomePage.Edit')}}</span>
                  </DropdownItem>
                  <DropdownItem name="delete">
                    <Icon type="ios-trash-outline" size="16"></Icon>
                    <span style="display:inline-block;margin-left:5px">{{$t('TopicHomePage.Delete')}}</span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
      <div class="past-due" @click="handPastDueList" v-show="currentGroup == 'upcoming'">
        <span style="flex:1 1 200px;font-size: 14px;font-weight: 600;">{{$t('TopicHomePage.ShowMeetings')}}</span>
        <span>
          <span v-if="!openPastDueList"><Icon type="chevron-down"></Icon></span>
          <span v-else><Icon type="chevron-up"></Icon></span>
        </span>
      </div>
      <div class="meeting-list" v-show="currentGroup == 'upcoming' && openPastDueList">
        <div class="meeting-item" v-for="item in pastDueMeetingList" :key="item.id">
          <div class="meeting-item-line1" @click="handleStartMeeting(item)">
            <div class="meeting-date">
              <p>{{item.startDate}}</p>
              <p>{{item.startMonth}}</p>
            </div>
            <div class="meeting-title" style="word-break:break-all;">
              {{item.title}}
            </div>
          </div>
          <div class="meeting-item-line2">
            <!-- <div>
              <p>Start</p>
              <p>{{item.startTime}}</p>
            </div>
            <div>
              <p>Duration</p>
              <p>{{item.duration}} min</p>
            </div>
            <div>
              <p>Attendee</p>
              <p>{{item.attendee}}</p>
            </div> -->
            <div style="padding:10px 0px;flex:1 1 200px;color:#999999">
              <div>{{item.startTime}}</div>
              <div>-</div>
              <div>{{item.endTime}}</div>
              <div style="padding:0px 3px">|</div>
              <div>{{item.attendee}}</div>
              <div>{{$t('TopicHomePage.AttendeesPeople')}}</div>
            </div>
            <div v-if="currentGroup != 'finished'" class="more-action">
              <!-- <div class="meeting-item-start">
                <span style="color:red" v-if="item.countDown!=false && currentGroup != 'pastdue'">{{item.countDown}}</span>
                <span @click="handleStartMeeting(item)" v-if="item.countDown!=false && currentGroup != 'pastdue'">START</span>
              </div> -->
              <Dropdown placement="bottom-end" style="float:right" @on-click="handleSyncRoomMeetinAction($event,item)">
                <span style="cursor: pointer;">
                  <Icon size="20" type="more"></Icon>
                </span>
                <DropdownMenu slot="list">
                  <DropdownItem name="Start">
                    <Icon type="log-in" size="15"></Icon>
                    <span style="display:inline-block;margin-left:5px;">{{$t('TopicHomePage.View')}}</span>
                  </DropdownItem>
                  <DropdownItem name="delete">
                      <Icon type="ios-trash-outline" size="16"></Icon>
                      <span style="display:inline-block;margin-left:5px">{{$t('TopicHomePage.Delete')}}</span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
    <kloudsync-meeting-info ref="meetingInfo"></kloudsync-meeting-info>

    <Modal v-model="modalScheduleMeeting" :mask-closable="false" :width="640" title="Schedule a meeting">
      <div class="forProject-schedule-topic-meeting">
        <div class="schedule-meeting-part">
          <p><b>Date: </b></p>
          <p><input id="kloudsync-schedule-date" style="width:280px" /></p>
        </div>
        <div class="schedule-meeting-part">
          <p>
            <span style="width:280px; margin-right:40px;display:inline-block;"><b>From: </b></span> 
            <span style="width:280px;display:inline-block;"><b >To: </b> </span></p>
          <p>
            <input id="kloudsync-schedule-syncMT-start" style="width:280px; margin-right:40px"/>
            <input id="kloudsync-schedule-syncMT-end" style="width:280px;"/>
          </p>
        </div>
        <div class="schedule-meeting-part">
          <p><b>Duration: </b></p>
          <p><Input v-model="scheduleDuration" :placeholder="$t('ScheduleMeeting.Duration')" style="width: 280px" disabled /></p>
        </div>
        <div class="schedule-meeting-part">
          <p><b>Title: </b></p>
          <p><Input v-model="scheduleTitle" :placeholder="$t('ScheduleMeeting.EnterTheMeetingTitle')" style="width: 600px" /></p>
        </div>
        <div class="schedule-meeting-part">
          <Button type="ghost" shape="circle" icon="plus-round" @click="handleScheduleInvite">{{$t('ScheduleMeeting.InviteContact')}}</Button>
        </div>
        <div class="schedule-meeting-part schedule-meeting-contacts">
          <span v-for="(item, index) in scheduleContacts" :key="index" class="schedule-meeting-contact-item">
            <Avatar :src="item.avatar==''?'../../../static/images/user.svg':item.avatar"></Avatar>
            <span class="schedule-meeting-contact-name" >{{item.name}}</span>
          </span>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="loading" @click="handleScheduleMeetingOK">{{$t('Base.OK')}}</Button>
        <Button @click="handleScheduleMeetingCancel">{{$t('Base.Cancel')}}</Button>
      </div>
    </Modal>

    <Modal v-model="modalInvite" :mask-closable="false" :title="$t('ScheduleMeeting.SelectContact')" :width="600">
      <Table :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true" :loading="loading"
              :data="inviteTableData" :columns="inviteTableColumn" @on-selection-change="selectContacts" :height="600">
      </Table>
      <div slot="footer" style="display:none"></div>
      <div slot="close">
        <Button type="primary" :loading="loading" @click="handleInviteOK">{{$t('Base.OK')}}</Button>
        <Button @click="handleInviteCancel">{{$t('Base.Cancel')}}</Button>
      </div>
    </Modal>
  </div>  
</template>

<style lang="scss">
.forProject-kloudsync-topic-meetings {
  .past-due{
    display:flex; 
    padding: 1.25em 32px;
    justify-content:center;
    span{
      display: inline-block;
    }
    border-bottom: 1px solid #dddee1;
    cursor: pointer;
  }
  .sync-room-meeting-host{
    display:flex; 
    justify-content:center;
  }
  .sync-room-meeting-tab{
     display:flex; 
     justify-content:center;
     .ivu-tabs-nav-scroll{
       display:flex; 
       justify-content:center;
     }
  }
  .ivu-poptip-content{
    background-color: #ffffff;
    .ivu-poptip-inner{
      width: 100%;
      background-color: rgb(246,249,253);
      background-clip: padding-box;
      border-radius: 4px;
      -webkit-box-shadow: 0 1px 6px rgba(0,0,0,.2);
      box-shadow: 0 1px 6px rgba(0,0,0,.2);
      white-space: nowrap;
    }
    .ivu-poptip-arrow:after {
      content: " ";
      top: 1px;
      margin-left: -5px;
      border-top-width: 0;
      border-bottom-width: 10px;
      border-bottom-color: rgb(246,249,253);
    }
  }
  .host-meeting-left{
    position: relative;
    margin: 20px;
    padding-right: 40px;
    border-right: 1px solid #b8b8b8;
    display: inline-block;
  }
  .host-meeting-right{
    display: inline-block;
    margin: 20px;
    padding-right: 40px;
  }
  .ivu-poptip-rel{
    display: inline-block;
    position: relative;
    width: 100%;
  }
  .topic-meeting-search {
    float: right;
    cursor: pointer;
  }

  .ivu-tabs-bar {
    padding: 0 24px;
  }

  .meeting-item {
    padding: 0.5em 24px;
    border-bottom: 1px solid #dddee1;

    .meeting-item-line1, .meeting-item-line2, .meeting-item-line3  {
      padding: 0.75em 0;
      display:flex;
      align-items: center;

      div {
        display: inline-block;
      }
    }

    .meeting-item-line1 {
      border-bottom: 1px solid #dddee1;
      font-weight: bold;
      cursor: pointer;

      .meeting-date {
        text-align: center;
        padding: 0.5em 1em;
        margin-right: 1em;
        background: #dddee1;
      }
    }

    .meeting-item-line2 {
      padding: 0.75em 0.5em;
      display: flex;
      // justify-content: space-between;
      // div {
      //   text-align: center;

      //   p:first-of-type {
      //     color:#80848f;
      //   }
      // }
      .ivu-dropdown-item{
        padding:4px 16px;
      }
    }

    .meeting-item-line3 {
      border-top: 1px solid #dddee1;
      justify-content: space-between;

      .meeting-item-start {
        color: #2b85e4;
        font-weight: bold;
        cursor: pointer;
        span{
          display: inline-block;
        }
      }
      .ivu-dropdown-item{
        padding:0px;
      }
    }
  }
}

.forProject-schedule-topic-meeting {
  .schedule-meeting-part {
    margin-bottom: 1.5em;
    p: {
      line-height: 1.8em;
    }
  }

  .schedule-meeting-contacts {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;

    .schedule-meeting-contact-item{
      height: 60px;
      width: 180px;
      line-height: 60px;
      margin-right: 1em;

      .schedule-meeting-contact-name{
        margin-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100px;
        white-space: nowrap;
      }
    }
  }
}
</style>

<script>
import auth from "../../authenticator";
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import KloudsyncMeetingInfo from "./KloudsyncMeetingInfo.vue";
import friends from '../../friends';
import util from "../../common/util.js";

var MyStorage = sessionStorage;

export default {
  data() {
    return {
      loading: false,
      currentGroup: 'upcoming',
      meetingList: [],
      standardMonth: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      joinLessonID:'',
      userName: auth.getUserName(),
      modalInvite: false,
      inviteLessonId: 0,
      inviteTableData: [],
      inviteTableColumn: [
        {
          title: " ",
          key: "_checked",
          sortable: false,
          type: "selection",
          width: 60
        },
        {
          title: this.$t("Common.Avatar"),
          key: "avatar",
          sortable: false,
          width: 80,
          align: "center",
          renderHeader: (h, params) => {
            return h("span",this.$t("Common.Avatar"));
          },
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
          sortable: true,
          align: "center",
          renderHeader: (h, params) => {
            return h("span",this.$t("Common.Name"));
          },
        },
        {
          title: this.$t("Common.Phone"),
          key: "phone",
          sortable: false,
          align: "center",
          renderHeader: (h, params) => {
            return h("span",this.$t("Common.Phone"));
          },
        },
        {
          title: this.$t("Common.Email"),
          key: "email",
          sortable: false,
          align: "center",
          renderHeader: (h, params) => {
            return h("span",this.$t("Common.Email"));
          },
        }
      ],
      selectedContacts:[],
      timer:null,
      modalScheduleMeeting: false,
      scheduleDate: new Date(),
      scheduleStart: new Date(),
      scheduleEnd: new Date(),
      scheduleTitle: '',
      scheduleContacts: [],
      scheduleInvite: false,
      openPastDueList:false,
      pastDueMeetingList:[],
    }
  },
  components:{
    KloudsyncMeetingInfo
  },
  computed: {
    ...mapState(['kloudsyncTopic']),

    schoolId() {
      return auth.getChosenSchoolId();
    },
    currentTopic() {
      return this.kloudsyncTopic.currentTopic;
    },
    scheduleDuration(){
      if(this.scheduleDate && this.scheduleStart && this.scheduleEnd){
        let date = this.scheduleDate.getDatePart();
        let start = date + this.scheduleStart.getTimePart();
        let end = date + this.scheduleEnd.getTimePart();
        let duration = new Date(parseInt(end)).getTime() - new Date(parseInt(start)).getTime();
        let hour = Math.round((duration/1000/60/60) * 100) / 100;
        if (hour <= 0) {
          return 0 + "h";
        }
        else {
          return hour + "h"
        }
      }
    },
    inSyncRoomMeeting(){
      if(this.$parent.inList){
        return false
      }
      return true;
    },
    currentSyncRoomId(){
      if (this.inSyncRoomMeeting) {
        return this.$route.params.id;
      }
      else {
        return this.currentTopic.id;
      }
    },
  },
  watch: {
  },
  mounted() {
    let self = this;
    this.$nextTick(() => {
      util.LoadKendoFiles().then(()=>{
        $("#kloudsync-schedule-date").kendoDatePicker({
          value: new Date(),
          change: function() {
            self.scheduleDate = this.value();
          }
        });
        $("#kloudsync-schedule-syncMT-start").kendoTimePicker({
          value: new Date(),
          change: function() {
            self.scheduleStart = this.value();
          }
        });
        $("#kloudsync-schedule-syncMT-end").kendoTimePicker({
          value: new Date(),
          change: function() {
            self.scheduleEnd = this.value();
          }
        });
      });
    });
  },
  beforeDestroy() {
    // 在这个生命周期中清除定时器
    // clearInterval(this.timer);
    // this.timer=null;
  },
  methods: {
    handleSyncRoomMeetinAction(name,item){
      switch (name) {
        case 'Start':
          this.handleStartMeeting(item);
          break;

        case 'invite':
          this.handInvite(item);
          break;

        case 'edit':
          this.handEdit(item);
          break;
          
        case 'delete':
          this.handDelete(item);
          break;
        default:
          break;
      }
    },
    clearIntervalTime(){
      clearInterval(this.timer);
      this.timer=null;
    },
    countDown(item){
      let localTime=new Date().getTime();
      let startTime=new Date(parseInt(item.start)).getTime();
      let distancetime=startTime-localTime;
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

      if(hour==0 && min<=30 && distancetime>0){
        return hour + ":" +min + ":" +sec ;
      }else if(distancetime<=0){
        return "00:00:00"
      }else{
        return false;
      }
    },
    handleInviteCancel(){
      this.modalInvite = false;
    },
    handleInviteOK(){
      if (this.scheduleInvite) {
        this.scheduleContacts = this.selectedContacts;
        this.modalInvite = false;
      }
      else {
        let self = this;
        let url= GetAPIUrl()+"LessonMember/AddLessonMember";
        let data = {
          LessonID: this.inviteLessonId,
          MemberList: this.selectedContacts,
        };
        this._postData(url, data, null, (result)=>{
          self.modalInvite = false;
          self.initialize();
        }, null);
      }
    },
    selectContacts(params) {
      if (this.scheduleInvite) {
        this.selectedContacts = params;
      }
      else {
        let MemberList=[];
        for (let i = 0; i < params.length; i++) {
            MemberList.push({"MemberID": params[i].id, "Role": 1});//role=1安排会议的参与者,role=2是会议的所有者
        }
        this.selectedContacts = MemberList;
      }
    },
    initializeUsers(data){
      let self = this;
      let currentUserId = auth.getUserID();
      let list = [];
      for (let i = 0, count = data.length; i < count; i++) {
        let user = data[i];
        let checked = false;
        let disabled = false;
        if (self.scheduleInvite) {
          checked = self.scheduleContacts.findIndex(contact => {
            return contact.id == user.MemberID;
          }) >= 0;
          disabled = user.MemberID == currentUserId;
        }
        else {
          checked = self.selectedContacts.findIndex(contact => {
            return contact.MemberID == user.MemberID;
          }) >= 0;
          disabled = checked;
        }

        let item = {
            id: user.MemberID,
            avatar: user.MemberAvatar?user.MemberAvatar:"../../../static/images/user.svg",
            name: user.MemberName,
            phone: user.Phone,
            email: user.Email,
            detail: user,
            _checked: checked,
            _disabled: disabled
            // _checked:this.selectedArray.includes(user.UserID)
        };
        list.push(item);
      }
      return list;
    },
    handInvite(params){
      this.scheduleInvite = !params;
      let self= this;

      if (this.scheduleInvite) {
        let url = GetAPIUrl() + "Topic/MemberList?TeamTopicID=" + this.currentSyncRoomId;

        this._getData(url, null, data => {
          self.inviteTableData = self.initializeUsers(data);
        }, null);
      }
      else {
        this.inviteLessonId = params.id;
        let url = GetAPIUrl() + "LessonMember/List?lessonID=" + this.inviteLessonId;

        this._getData(url, null, data => {
          self.selectedContacts = data;
          let url2 = GetAPIUrl() + "Topic/MemberList?TeamTopicID=" + self.currentSyncRoomId;

          self._getData(url2, null, data => {
            self.inviteTableData = self.initializeUsers(data);
          }, null);
        }, null);
      }

      this.modalInvite = true;
    },
    handEdit(params){
      this.$refs.meetingInfo.showEdit(params.id, this.initialize);
    },
    handDelete(params){
      let self = this;
      this.$Modal.confirm({
        title: self.$t("Activity.ModalDeleteTitle"),
        content: self.$t("Activity.ModalDeleteContent"),
        okText: self.$t("Base.Delete"),
        cancelText: self.$t("Base.Cancel"),
        onOk: () => {
          let id = params.id;
          let url = GetAPIUrl() + "Lesson/Delete?lessonID=" + id;
          $.ajax({
            type: "DELETE",
            url: url,
            beforeSend: function(request) {
              request.setRequestHeader("UserToken", auth.getUserToken());
            },
            success: function(result) {
              if (result.RetCode === 0) {
                self.initialize();
              } else {
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
    handleStartMeeting(meeting) {
      let lessonId = meeting.id;
      this.changeLessonID(lessonId);
      this.$router.push({ name: "live", params: { id: lessonId } });
    },
    startSyncRoomMeetingNow(){
      let self = this;
      this.scheduleInstanceMeeting().then((meetingID)=>{
        if(meetingID==0){
          return;
        }
        let lesson={id:meetingID};
        self.handleStartMeeting(lesson);
      })
    },
    scheduleInstanceMeeting(){
      return new Promise((resolve,reject)=>{
        var sessionid = MyStorage.getItem('UserToken');

        let contacts = [{"MemberID": auth.getUserID(), "Role": 2}];   
        let data = {
          MemberList: contacts,
          CompanyID: this.schoolId,
          SyncRoomID: this.currentSyncRoomId
        }
        let url= GetAPIUrl() + "SyncRoom/CreateMeetingFromSyncRoom";
        $.ajax({
          type: 'POST',
          url: url,
          contentType: 'application/json; charset=utf-8',
          dataType: 'text',
          data: JSON.stringify(data),
          beforeSend: function (request)
          {
            request.setRequestHeader("UserToken", sessionid);
          },
          success: function (resultData)
          {
            let result = JSON.parse(resultData);
            if (result.RetCode===0)
            {
              resolve(parseInt(result.RetData))
            }
            else
            {
              resolve(0);
            }
          },
          error: function (xhr, ajaxOptions, thrownError)
          {
            resolve(0);
          }
        });
      })
    },
    handleScheduleMeeting(){
      //this.$router.push({name:'kloudsync-schedule-meeting',params:{topicId:this.currentSyncRoomId}});
      let date = new Date();
      let tick = Math.round(date.getTime() / (1000 * 60 * 60) + 1) * (1000 * 60 * 60);
      let start = new Date(tick);
      let end = new Date(tick + 1000 * 60 * 60);

      let picker = $("#kloudsync-schedule-date").data("kendoDatePicker");
      picker.value(date);

      picker = $("#kloudsync-schedule-syncMT-start").data("kendoTimePicker");
      picker.value(start);

      picker = $("#kloudsync-schedule-syncMT-end").data("kendoTimePicker");
      picker.value(end);

      this.scheduleDate = date;
      this.scheduleStart = start;
      this.scheduleEnd = end;
      this.scheduleTitle = auth.getUserName() + " - " + date.toLocaleDateString();
      this.scheduleContacts = [];

      this.modalScheduleMeeting = true;
    },
    handleScheduleInvite() {
      this.handInvite();
    },
    handleScheduleMeetingOK() {
      let date = this.scheduleDate.getDatePart();
      let start = date + this.scheduleStart.getTimePart();
      let end = date + this.scheduleEnd.getTimePart();
   
      if (end < start) {
        alert(this.$t('Common.AlertCompareTime'));
        return;
      }
      else if(start < new Date().getTime()){
        alert(this.$t('Common.AlertEndCompareLocalTime'));
        return;
      }else if(this.scheduleTitle == ""){
        alert('The title of the meeting cannot be empty');
      }
      
      // let lessontype = 5;//5代表是安排的会议
      let contacts = [{"MemberID": auth.getUserID(), "Role": 2}];   
      this.scheduleContacts.forEach(item => {
        contacts.push({"MemberID": item.id, "Role": 1});//role=1安排会议的参与者,role=2是会议的所有者
      });

      let data = {
        Title: this.scheduleTitle,
        // LessonType: lessontype,
        StartDate: start,
        EndDate: end,
        MemberList: contacts,
        CompanyID: this.schoolId,
        SyncRoomID: this.currentSyncRoomId
      }

      let self = this;
      let url= GetAPIUrl() + "SyncRoom/CreateMeetingFromSyncRoom";
      this._postData(url, data, null, (result) => {
        self.modalScheduleMeeting = false;
        self.initialize();
      }, null);
    },
    handleScheduleMeetingCancel() {
      this.modalScheduleMeeting = false;
    },
    getSocket(){
      return this.$root.$children[0].$refs.noticemsg.obj;
    },
    joinMeeting(){
      this.joinLessonID = Trim(this.joinLessonID);
      this.checkClassRoomExist("-"+this.joinLessonID).then((res) =>
      {
        if (res == 0)
        {
          this.$Message.error(
            {
              content: 'KlassRoom 不存在!',
              duration: 3
            });
        }
        else
        {
          this.showNoticeInfo = false;
          this.changeLessonID(0);
          if(!this.getSocket().isopen())
          {
            this.$Message.error(
              {
                content: 'Connecting to Klassroom Server is unsuccessful.   Please contact your system admin!',
                duration: 0,
                closable: true
              });
            return;
          }
          this.$router.push({ name: 'live', params: { id: this.joinLessonID } });
          return;
        }
      });
    },
    checkClassRoomExist(id){
      return new Promise(function (resolve, reject)
      {
        var sessionid = MyStorage.getItem('UserToken');
        var url = GetAPIUrl() + "Lesson/CheckClassRoomExist?classroomID=" + id;
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
    initialize() {
      this.$nextTick(()=>{
        this.loadData();
        if(this.openPastDueList){
          this.loadPastdueData();
        }
      })
    },
    handleGroupChange() {
      this.loadData();
      if(this.openPastDueList){
        this.loadPastdueData();
      }
    },
    handPastDueList(){
      this.openPastDueList = !this.openPastDueList;
      if(this.openPastDueList){
        this.loadPastdueData();
      }
    },
    loadPastdueData(){
      //参数type Active = 1,  Expired = 2,    Finished = 3
      let type = 2;
      this.pastDueMeetingList = [];
      let url = GetAPIUrl() + "SyncRoom/SyncRoomMeeting?syncRoomID="+this.currentSyncRoomId+"&type="+type;
      let self = this;

      this._getData(url, null, result => {
        let list = [];

        for (let i = 0; i < result.length; i++) {
          let data = result[i];

          let startDate = 0;
          let startMonth = 0;
          let startTime = '';
          let endTime = '';
          let duration = 0;
          if (data.PlanedStartDate) {
            let start = new Date(parseInt(data.PlanedStartDate));
            startDate = start.getDate();
            startMonth = start.getMonth();
            startTime = start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            if (data.PlanedEndDate) {
              let end = new Date(parseInt(data.PlanedEndDate));
              duration = end.getTime() - start.getTime();
              endTime = end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            }
          }

          let item = {
            id: data.LessonID,
            title: data.Title,
            course: data.LessonType != 5 ? data.CourseName : self.$t("Activity.Meeting"),
            startDate: startDate,
            startMonth: self._formatMonth(startMonth),
            startTime: startTime,
            endTime: endTime,
            duration: self._formatDuration(duration),
            attendee: data.TeacherCount + data.StudentCount,
            teachers: data.TeacherNames,
            students: data.StudentNames,
            start:data.PlanedStartDate,
          };
          item.countDown=this.countDown(item);

          list.push(item);
        }
        self.pastDueMeetingList = list;
      }, null);

    },
    loadData() {
      //参数type Active = 1,  Expired = 2,    Finished = 3
      let type;
      switch (this.currentGroup) {
        case 'upcoming':
          type=1;
          break;
        // case 'pastdue':
        //   type=2
        //   break;
        case 'finished':
          type=3
          break;
      }
      this.meetingList = [];
      let url = GetAPIUrl() + "SyncRoom/SyncRoomMeeting?syncRoomID="+this.currentSyncRoomId+"&type="+type;
      let self = this;

      this._getData(url, null, result => {
        let list = [];

        for (let i = 0; i < result.length; i++) {
          let data = result[i];

          let startDate = 0;
          let startMonth = 0;
          let startTime = '';
          let endTime = '';
          let duration = 0;
          if (data.PlanedStartDate) {
            let start = new Date(parseInt(data.PlanedStartDate));
            startDate = start.getDate();
            startMonth = start.getMonth();
            startTime = start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            if (data.PlanedEndDate) {
              let end = new Date(parseInt(data.PlanedEndDate));
              duration = end.getTime() - start.getTime();
              endTime = end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            }
          }

          let item = {
            id: data.LessonID,
            title: data.Title,
            course: data.LessonType != 5 ? data.CourseName : self.$t("Activity.Meeting"),
            startDate: startDate,
            startMonth: self._formatMonth(startMonth),
            startTime: startTime,
            endTime: endTime,
            duration: self._formatDuration(duration),
            attendee: data.TeacherCount + data.StudentCount,
            teachers: data.TeacherNames,
            students: data.StudentNames,
            start:data.PlanedStartDate,
          };
          item.countDown=this.countDown(item);

          list.push(item);
        }
        self.meetingList = list;
        ////距离会议30分钟倒计时的功能
        // if(this.currentGroup=="upcoming"){
        //   if(!this.timer){
        //     this.timer=setInterval(()=>{
        //       let array=[];
        //       self.meetingList.forEach((item,index) => {
        //         this.$set(self.meetingList[index],'countDown',this.countDown(item));
        //       });
        //     },1000)
        //   }
        // }else{
        //   clearInterval(this.timer);
        //   this.timer=null;
        // }
      }, null);
    },
    _formatMonth(month) {
      return this.standardMonth[month];
    },
    _formatDuration(duration) {
      return Math.round(duration / (1000 * 60));
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
    },
    ...mapMutations(['changeLessonID'])
  }
}
</script>
