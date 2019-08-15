<template>
<div class="kloudsync-schedule-meeting">
  <div class="kloudsyncPaneGutter"></div>
  <div class="kloudsyncCreateMeeting">
      <div class="header">{{$t('ScheduleMeeting.NewMeeting')}}</div>
      <div class="content">
          <Row :gutter="16">
              <Col span="8"><input id="kloudsync-schedule-slecte-date" style="width:100%" /></Col>
              <Col span="8"><input id="kloudsync-schedule-start-time" style="width:100%" /></Col>
              <Col span="8"><input id="schedule-end-time" style="width:100%" /></Col>
          </Row>
          <Row style="margin-top:20px;">
              <Col span="24"><Input v-model="duration" :placeholder="$t('ScheduleMeeting.Duration')" style="width: 100%" disabled></Input></Col>
          </Row>
          <Row style="margin-top:20px;">
              <Col span="24"><Input v-model="meetingTitle" :placeholder="$t('ScheduleMeeting.EnterTheMeetingTitle')" style="width: 100%"></Input></Col>
          </Row>
          <div class="invite-part">
              <Button type="ghost" shape="circle" icon="plus-round" @click="handleInvite">{{$t('ScheduleMeeting.InviteContact')}}</Button>
          </div>
          <div class="seleted-contact-space">
            <span v-for="(item,index) in selectedContactsOk" :key="index" class="person-space">
              <span style="float:left"><Avatar :src="item.AvatarUrl==''?'../../../static/images/user.svg':item.AvatarUrl"></Avatar></span>
              <span style="float:left" class="person-name" >{{item.MemberName}}</span>
            </span>
          </div>
      </div>
      <div class="footer">
      <Button shape="circle" size="large" type="primary" @click="createScheduleMeeting" :loading="loading">{{$t('CreateCourse.Submit')}}</Button>
      <Button shape="circle" size="large" style="margin-left:100px;" @click="cancelkloudsyncCreateMeeting">{{$t('Base.Cancel')}}</Button>
      </div>
      <Modal v-model="modalInvite" :mask-closable="false" :title="$t('ScheduleMeeting.SelectContact')" :width="600">
        <Input v-model="searchContact " placeholder="Search contact..." style="width:260px;margin-bottom:12px" icon="ios-search" @on-enter="handleSearch" @on-click="handleSearch"></Input>
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
  <div class="kloudsyncPaneGutter"></div>
</div>
   
    
</template>
<style lang="scss">
.kloudsync-schedule-meeting{
  background-color: transparent;
  display: -webkit-box;
  display: -moz-box;
  display: box;
  display: -moz-flex;
  display: -ms-flexbox;
  display: flex;
  padding-top: 20px;
  min-width: 785px;
  min-height: 200px;
  width: 100%;
  .kloudsyncPaneGutter{
  -webkit-box-flex: 1;
  box-flex: 1;
  -moz-flex: 1 0 20px;
  -ms-flex: 1 0 20px;
  flex: 1 0 20px;
}
.kloudsyncCreateMeeting {
  -webkit-box-flex: 5500;
  box-flex: 5500;
  -moz-flex: 5500 1 500px;
  -ms-flex: 5500 1 500px;
  flex: 5500 1 500px;
  max-width: 1500px;
  min-width: 500px;
  background-color: #ffffff;
  -webkit-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 3px;
  padding: 28px;
  .header {
    font-size: 24px;
    text-align: left;
    color: #1c2438;
    border-bottom: 1px solid #dddee1;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .content {
    text-align: left;
    padding: 40px 15% 100px 15%;
    .invite-part {
      margin-top: 50px;
    }
    .seleted-contact-space{
      margin-top: 10px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      $height:60px;
      span{
        display:inline-block;
      }
      .person-space{
        height: $height;
        width: 180px;
        line-height: $height;
        .person-name{
          margin-left: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width:100px;
          white-space: nowrap;
        }
      }
    }
  }
  .footer {
    border-top: 1px dashed #dddee1;
    padding-top: 10px;
    margin-top: 10px;
    padding-bottom: 40px;
  }
}
}

</style>

<script>
import auth from '../../authenticator';
import friends from '../../friends';
import util from "../../common/util.js";
export default {
  name:'kloudsync-schedule-meeting',
  data() {
    return {
      selectedContacts:[],
      selectedContactsOk:[],
      newContactList:[],
      selectedArray:[],
      meetingTime:{
        date:"",
        starTime:"",
        endTime:""
      },
      meetingTitle:'',
      modalInvite: false,
      loading: false,
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
          align: "center"
        },
        {
          title: this.$t("Common.Phone"),
          key: "phone",
          sortable: false,
          align: "center"
        },
        {
          title: this.$t("Common.Email"),
          key: "email",
          sortable: false,
          align: "center"
        }
      ],

      allInviteTableData:[],
      searchContact:'',
    };
  },
  computed: {
    schoolId(){
      return auth.getChosenSchoolId();
    },
    duration(){
      if(this.meetingTime.date && this.meetingTime.starTime && this.meetingTime.endTime){
        let date = this.meetingTime.date.getDatePart();
        let start = date + this.meetingTime.starTime.getTimePart();
        let end = date + this.meetingTime.endTime.getTimePart();
        let distancetime = new Date(parseInt(end)).getTime()-new Date(parseInt(start)).getTime();
        let hour = distancetime/1000/60/60;
        if(distancetime<=0){
          return 0+"h";
        }else{
          return hour+"h"
        }
      }
    }
  },
  mounted() {
    let self = this;
    let date = new Date();
    let tick = Math.round(date.getTime() / (1000 * 60 * 60) + 1) * (1000 * 60 * 60);
    let start = new Date(tick);
    let end = new Date(tick + 1000 * 60 * 60);
    self.meetingTime.date=start;
    self.meetingTime.starTime=start;
    self.meetingTime.endTime=end;
    self.$nextTick(() => {
      util.LoadKendoFiles().then(()=>{
        $("#kloudsync-schedule-slecte-date").kendoDatePicker({
          value: start,
          change: function() {
            self.meetingTime.date=this.value();
          }
        });
        $("#kloudsync-schedule-start-time").kendoTimePicker({
          value: start,
          change: function() {
            self.meetingTime.starTime=this.value();
          }
        });
        $("#schedule-end-time").kendoTimePicker({
          value: end,
          change: function() {
            self.meetingTime.endTime=this.value();
          }
        });
      });
    });
    self.getDefaultMeetingTitle();
  },
  methods:{
    handleSearch() {
      if (this.searchContact) {
        let search = new RegExp(this.searchContact, 'i');
        this.inviteTableData = this.allInviteTableData.filter(item => {
          return (item.name.search(search) >= 0 || item.phone.search(search) >= 0)
        });
      }
      else {
        this.inviteTableData = this.allInviteTableData;
      }
    },
    getDefaultMeetingTitle(){
        let date = new Date();
        let tick = Math.round(date.getTime() / (1000 * 60 * 60) + 1) * (1000 * 60 * 60);
        let start = new Date(tick);
        let end = new Date(tick + 1000 * 60 * 60); 
        let year = start.getFullYear();
        let month = (start.getMonth() + 1<10)?'0'+(date.getMonth() + 1):(date.getMonth() + 1);
        let day= start.getDate()<10?'0'+date.getDate():date.getDate();
        let hour1 = start.getHours()<10?'0'+ start.getHours(): start.getHours();
        let minute1 = start.getMinutes()<10?'0'+start.getMinutes():start.getMinutes();
        let hour2 = end.getHours()<10?'0'+end.getHours():end.getHours();
        let minute2 = end.getMinutes()<10?'0'+end.getMinutes():end.getMinutes();
        this.meetingTitle=auth.getUserName()+"-"+year+"/"+month+"/"+day+" "+hour1+":"+minute1+"-"+year+"/"+month+"/"+day+" "+hour2+":"+minute2;
    },
    handleInvite() {
        this.modalInvite = true;
        this.searchContact = "";
        let self= this;
        friends.getFriends(function (users) {
            self.readSelected();
            self.allInviteTableData = self.initializeUsers(users);
            self.inviteTableData = self.allInviteTableData;
        });
    },
    initializeUsers(data){
      let list = [];
      for (let i = 0, count = data.length; i < count; i++) {
        let user = data[i];
        let item = {
            id: user.UserID,
            avatar: user.AvatarUrl?user.AvatarUrl:"../../../static/images/user.svg",
            name: user.Name,
            phone: user.Phone,
            email: user.Email,
            detail: user,
            _checked:this.selectedArray.includes(user.UserID)
        };
        list.push(item);
      }
      return list;
    },
    selectContacts(params) {
      let MemberList=[];
      let newContactList=[];
      for(let i=0;i<params.length;i++){
          MemberList.push({"MemberID":params[i].id,"Role":1});//role=1安排会议的参与者,role=2是会议的所有者
          newContactList.push({"MemberID":params[i].id,"Role":1,"AvatarUrl":params[i].avatar,"MemberName":params[i].name,"Phone":params[i].phone,"Email":params[i].email});
      }
      this.selectedContacts=MemberList;
      this.newContactList=newContactList;
    },
    readSelected(){
      this.selectedArray=[];
      for(let item of this.selectedContactsOk){
        this.selectedArray.push(item.MemberID);
      }
    },
    handleInviteOK(){
        this.modalInvite = false;
        this.selectedContactsOk=this.newContactList;
    },
    createScheduleMeeting(){
      let date = this.meetingTime.date.getDatePart();
      let start = date + this.meetingTime.starTime.getTimePart();
      let end = date + this.meetingTime.endTime.getTimePart();

      let lessontype=5;//5代表是安排的会议
      let isIncludsMe=this.isContainMe();//判断选中的是否包含自己。
      if(isIncludsMe){
          this.selectedContacts.unshift({"MemberID":auth.getUserID(),"Role":2});//role=1安排会议的参与者,role=2是会议的所有者
      }
      let data={
        Title:this.meetingTitle,
        Description:'',
        LessonType:lessontype,
        StartDate:start,
        EndDate:end,
        LessonMembers:this.selectedContacts,
        SchoolID:this.schoolId
      }
      if(this.CompareDate(start,end)){
        return;
      }else if(start<new Date().getTime()){
        this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t('Common.AlertEndCompareLocalTime'), top: 24,duration: 4, left:true });
        return;
      }
      let url= GetAPIUrl()+"Lesson/AddScheduleMeetingLesson";
      if(this.$route.params.topicId){
        data.TopicID=this.$route.params.topicId;
      }
      this._postData(url,data,null,(result)=>{
        this.$Message.info({content:this.$t('ScheduleMeeting.MeetingArrangedSuccessfully'),duration: 3});
        this.$router.back(-1);
      },null);
    },
    //起始时间能大于结束时间
    CompareDate(t1,t2){
      if(t2 < t1){
          this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t('Common.AlertCompareTime'), top: 24,duration: 4, left:true });
          return true;
      }
      return false;
    },
    //不能同时添加自己两次以上
    isContainMe(){
      for(let ietm of this.selectedContacts){
        if(ietm.MemberID==auth.getUserID()){
          return false;
        }
      }
      return true;
    },
    handleInviteCancel(){
        this.modalInvite = false;
    },
    cancelkloudsyncCreateMeeting(){
        this.$router.back(-1);
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
                if (success && typeof success === 'function') {
                success(result.RetData);
                }

                self.loading = false;
                self.$Loading.finish();
            }
            else { // error
                if (error && typeof error === 'function') {
                error(result);
                }

                self.loading = false;
                self.$Loading.error();
                self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
                console.log(result);
            }
            },
            error: function (xhr, ajaxOptions, thrownError) {
            if (error && typeof error === 'function') {
                error();
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
            console.log(xhr);
            }
        });
    },
  }
};
</script>
