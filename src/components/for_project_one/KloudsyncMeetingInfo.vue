<template>
  <div class="lesson-info">
    <Modal v-model="modalEdit" :mask-closable="false" :title="$t('kloudsyncMeetinInfo.EditLessonProperty')">
      <div class="lesson-info" v-show="currentTab!='finished'">
        <div style="font-size: 20px; font-weight: bold; line-height: 1.5em;">
          {{courseName}}
        </div>
        <div style="font-size: 16px; line-height: 2em;">
          {{$t('kloudsyncMeetinInfo.Teacher')}}: {{teacherName}}
        </div>
        <!-- <div style="font-size: 13px; line-height: 2em; margin-bottom: 14px;">
          {{$t('kloudsyncMeetinInfo.Total')}}: {{lessonCount}} {{$t('kloudsyncMeetinInfo.LessonsFinished')}}<a ref="javascript:void(null);" @click="toggleShowAllLessons" style="float: right;">{{showAllLessonsText}}</a>
        </div> -->

        <div v-if="showAllLessons">
          <Collapse v-model="lessonCollapse">
            <Panel v-for="lessonItem in allLessons" :name="'lesson' + lessonItem.id" :key="lessonItem.id">
              <!-- {{$t("kloudsyncMeetinInfo.Meeting")}} {{ lessonItem.index }} -->
              <div slot="content">
                <meeting-item-info :lesson-id="lessonItem.id" :lesson-info="lessonItem" :all-lectures="allLectures" :show-header="false"></meeting-item-info>
              </div>
            </Panel>
          </Collapse>
        </div>
        <div v-else>
          <meeting-item-info ref='current' :lesson-id="currentLesson.id" :lesson-info="currentLesson" :all-lectures="allLectures" :show-header="true"></meeting-item-info>
        </div>
      </div>
      <div class="lesson-info" v-show="currentTab=='finished'">
        <div class="Meeting-item">
          <p class="title">Meeting name</p>
          <p>{{currentLesson.title}}</p>
        </div>

        <div class="Meeting-item" style="margin-top:30px;">
          <p class="title">Time & Duration</p>
          <p>{{startDate}}<span> / </span>{{duration}}</p>
        </div>

        <p class="Meeting-item"  style="margin-top:30px;font-weight: bold;">Attendee</p>
        <div class="attendee">
          <div v-for="(item,index) in memberList" :key="index" class="member-item">
            <span><Avatar :src="item.AvatarUrl == '' ? '/static/images/user.svg' : item.AvatarUrl"/></span>
            <span style="margin-left: 2px;">{{item.MemberName}}</span>
          </div>
        </div>

        <p class="Meeting-item" style="margin-top:30px;"><Button type="ghost" @click="handleInvite">Select who can view</Button></p>
        <div class="attendee who-can-view">
          <div v-for="(item,index) in viewList" :key="index" class="member-item">
            <span><Avatar :src="item.AvatarUrl == '' ? '/static/images/user.svg' : item.AvatarUrl"/></span>
            <span style="margin-left: 2px;">{{item.MemberName}}</span>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button style="min-width: 72px;" type="primary" :loading="loading" @click="handleOK">{{$t("Base.OK")}}</Button>
        <Button style="" @click="handleCancel">{{$t("Base.Cancel")}}</Button>
      </div>
    </Modal>
    <Modal v-model="modalInvite" :mask-closable="false" :title="$t('ScheduleMeeting.SelectContact')" :width="600" style="z-index: 4000; position: absolute;">
      <Table ref="whoCanViewSelctions" :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true" :loading="loading"
              :data="inviteTableData" :columns="inviteTableColumn" :height="600">
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
  .lesson-info {
    text-align: left;
    font-size: 13px;

    .ivu-collapse-content {
      padding: 0;
    }

    .ivu-collapse-content > .ivu-collapse-content-box {
      padding: 0;
    }

    .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
      padding-left: 1.5em;

      .ivu-icon {
        margin-right: 1em;
      }
    }
    .Meeting-item{
      margin-left:15px;
      font-size: 14px;
      .title{
        font-weight: bold;
      }
    }
    .attendee{
      display: flex;
      flex-direction:row;
      flex-wrap:wrap;
      justify-content:flex-start;
      margin: 10px;
      .member-item{
        text-align: left;
        padding: 5px 10px 5px 5px;
        width: 110px;
        align-items:center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>

<script>
  import auth from '../../authenticator';
  import friends from '../../friends';
  import MeetingItemInfo from './KloudsyncMeetingItemInfo.vue';

  export default{
    components: {
      MeetingItemInfo
    },
    props: ["currentTab"],
    data: function () {
      return {
        loading: true,
        lessonId: 0,
        callbackSave: null,
        courseId: 0,
        courseName: "",
        lessonName: "",
        lessonCount: 10,
        teacherName: "",
        // teacherAvatar: "",
        currentLesson: {title: '', date: new Date(), start: new Date(), end: new Date(), lectures: []},
        allLessons: [],
        allLectures: [],
        modalEdit: false,
        showAllLessons: false,
        lessonCollapse: '',
        memberList:[],
        viewList:[],
        modalInvite: false,
        inviteTableData: [],
        inviteTableColumn: [
         {
            type: "selection",
            width: 60,
            align: 'center'
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
        alreadyExistContacts:[],
      };
    },
    computed: {
      schoolId() {
        return auth.getChosenSchoolId();
      },
      showAllLessonsText: function () {
        if (this.showAllLessons) {
          return this.$t('kloudsyncMeetinInfo.HideOtherLessons');
        }
        else {
          return this.$t('kloudsyncMeetinInfo.ScheduleAllLessons');
        }
      },
      startDate(){
        if (this.currentLesson.start) {
          return this.currentLesson.start.toLocaleString(); 
        }
        else {
          return "NA";
        }
      },
      duration(){
        if(this.currentLesson.start && this.currentLesson.end){
          let start = this.currentLesson.start
          let end = this.currentLesson.end;
          let distancetime = end.getTime()-start.getTime();
          let hour = Math.round((distancetime/1000/60/60) * 100) / 100;
          if(distancetime<=0){
            return 0+"h";
          }else{
            return hour+"h"
          }
        }
        else {
          return "NA";
        }
      }
    },
    mounted: function () {
    },
    methods: {
      handleInviteOK(){
        let selections = this.$refs.whoCanViewSelctions.getSelection();
        let list = [];
        selections.forEach(item => {
          if (!item._disabled) {
            list.push({MemberID: item.id, Role: 11, Joined: 0});
          }
        });

        if (list.length == 0) {
          this.modalInvite = false;
          return;
        }

        let self = this;
        let url = GetAPIUrl() + "LessonMember/AddLessonMember";
        let data = {
          LessonID: this.lessonId,
          MemberList: list
        }

        this._postData(url, data, null, (result) => {
          self._readLesson();
          self.modalInvite = false;
        }, null);
      },
      handleInviteCancel(){
        this.modalInvite = false;
      },
      handleInvite() {
        this.modalInvite = true;
        let self = this;

        let url = GetAPIUrl() + "SchoolContact/List";
        url += "?schoolID=" + this.schoolId;
        url += "&roleType=" + "0,1,2,3,4,5,6,7,8,9";
        url += "&searchText=";
        url += "&pageIndex=-1"

        this._getData(url, null,
          data => {
            self.initializeUsers(data);
          },
          null
        );
      },
      initializeUsers(data){
        let list = [];
        for (let i = 0, count = data.length; i < count; i++) {
          let user = data[i];
          let existed = this.alreadyExistContacts.indexOf(user.UserID) >= 0;
          let item = {
            id: user.UserID,
            avatar: user.AvatarUrl ? user.AvatarUrl : "../../../static/images/user.svg",
            name: user.UserName,
            phone: user.Phone,
            email: user.Email,
            grade: user.Grade,
            parent: user.Parent,
            detail: user,
            _checked: existed,
            _disabled: existed,
          };
          list.push(item);
        }
        this.inviteTableData = list;
      },
      showEdit: function (id, callback) {
        this.lessonId = id;
        this.callbackSave = callback;
        this.showAllLessons = false;
        this._readLesson();
        this.modalEdit = true;
      },
      _readLesson: function () {
        let self = this;

        let url = GetAPIUrl() + "Lesson/GetLessonItem?lessonID=" + this.lessonId;
        this._getData(url, null, function (result) {
          let lesson = result;
          
          self.courseId = lesson.CourseID;
          self.courseName = lesson.CourseName;
          self.lessonName = lesson.Title;
          self.lessonCount = lesson.TotalLessonCount;
          
          self.alreadyExistContacts=[];
          self.memberList = [];
          self.viewList = []
          for(let item of lesson.MemberInfoList) {
            if (item.Role > 10) {
              self.viewList.push(item);
            }
            else {
              self.memberList.push(item);
            }
          }
          for(let item of lesson.MemberInfoList){
            self.alreadyExistContacts.push(item.MemberID)
          }

          let start, end;
          if (lesson.StartDate && lesson.EndDate) {
            start = new Date(parseInt(lesson.StartDate));
            end = new Date(parseInt(lesson.EndDate));
          }
          else if (self.currentTab != 'finished'){
            let date = new Date();
            let tick = Math.round(date.getTime() / (1000 * 60 * 60) + 1) * (1000 * 60 * 60);
            start = new Date(tick);;
            end = new Date(tick + 1000 * 60 * 60);
          }

          self.currentLesson = {
            id: lesson.LessonID,
            title: lesson.Title,
            date: start,
            start: start,
            end: end,
            LessonMembers:lesson.MemberInfoList,
            // teacher: lesson.TeacherID,
            // student: lesson.StudentID,
            lectures: lesson.LectureIDs.split(',').map(Number),
            dirty: false,
            index: lesson.Index,
            count: lesson.TotalLessonCount,
          };

          self.allLessons = [];
          let teacherNameList="";
          for(let item of lesson.MemberInfoList){
            if(item.Role==2){
              teacherNameList+=item.MemberName+",";
            }
          }
          teacherNameList=teacherNameList.substring(0,teacherNameList.length-1);
          self.teacherName=teacherNameList;
          // self._readTeacher(lesson.TeacherID);
          self._readLectures(lesson.CourseID);

          self.$nextTick(() =>{
            self.$refs.current.refresh();
          });
        }, null);
      },
      // _readTeacher: function (teacherId) {
      //   let self = this;
      //   let url = GetAPIUrl() + "User/UserListBasicInfo?userIds=" + teacherId;
      //   this._getData(url, null, function (result) {
      //     let user = result[0];
      //     self.teacherName = user.UserName;
      //     // self.teacherAvatar = user.AvatarUrl;
      //   }, null);
      // },
      _readLectures: function (courseId) {
        let self = this;
        let url = GetAPIUrl() + "Lecture/List?courseID=" + courseId;
        this._getData(url, null, function (data) {
          let lectures = [];
          for (let i = 0; i < data.length; i++) {
            let lecture = {
              index: self.$t("Common.Lecture") + (i + 1),
              id: data[i].LectureID,
              name: data[i].Title,
              status: "Ready"
            };

            lectures.push(lecture);
          }
          self.allLectures = lectures;

        }, null);
      },
      _readAllLessons: function () {
        if (this.allLessons.length > 0 || !this.courseId)
          return;

        let self = this;
        let url = GetAPIUrl() + "Lesson/LessonList?courseID=" + this.courseId;
        this._getData(url, null, function (data) {
          let lessons = [];

          for (let i = 0; i < data.length; i++) {
            if (data[i].LessonID.toString() === self.lessonId.toString()) {
              lessons.push(self.currentLesson);
            }
            else {
              let start = new Date(parseInt(data[i].StartDate));
              let end = new Date(parseInt(data[i].EndDate));

              let lesson = {
                id: data[i].LessonID,
                title: data[i].Title,
                date: start,
                start: start,
                end: end,
                // teacher: data[i].TeacherID,
                // student: data[i].StudentID,
                LessonMembers:data[i].MemberInfoList,
                lectures: data[i].LectureIDs.split(',').map(Number),
                dirty: false
              };

              lessons.push(lesson);
            }
          }

          lessons.sort(function (a, b) {
            if (a.start < b.start) {
              return -1;
            }
            if (a.start > b.start) {
              return 1;
            }
            return 0;
          });

          let count = lessons.length;
          for (let i = 0; i < count; i++) {
            lessons[i].index = i + 1;
            lessons[i].count = count;
          }

          self.lessonCount = count;
          self.allLessons = lessons;
          self.$nextTick(() => {
            self.lessonCollapse = 'lesson' + self.lessonId;
          });

        }, null);

      },
      toggleShowAllLessons: function () {
        this.showAllLessons = !this.showAllLessons;

        if (this.showAllLessons)
          this._readAllLessons();
      },
      //起始时间能大于结束时间
      CompareDate(t1,t2){
        if(t2 < t1){
           alert(this.$t('Common.AlertCompareTime'));
           return true;
        }
        return false;
      },
      handleOK: function () {
        let data = [];

        if (this.allLessons.length === 0) {
          let lesson = this.currentLesson;
          if (lesson.dirty) {
            let date = lesson.date.getDatePart();
            let start = date + lesson.start.getTimePart();
            let end = date + lesson.end.getTimePart();
            if(this.CompareDate(start,end)){
              return;
            }
            let lessonData = {
              "LessonID": lesson.id,
              "Title": lesson.title,
              "Description": '',
              // "TeacherID": lesson.teacher,
              // "StudentID": lesson.student,
              "LessonMembers":lesson.LessonMembers,
              "CourseID": this.courseId,
              "LectureIDs": lesson.lectures.toString(),
              "StartDate": start,
              "EndDate": end
            };

            data.push(lessonData);
          }
        }
        else {
          for (let i = 0; i < this.allLessons.length; i++) {
            let lesson = this.allLessons[i];
            if (lesson.dirty || lesson.id < 0) {
              let date = lesson.date.getDatePart();
              let start = date + lesson.start.getTimePart();
              let end = date + lesson.end.getTimePart();
              if(this.CompareDate(start,end)){
                return;
              }
              let lessonData = {
                "LessonID": lesson.id,
                "Title": lesson.title,
                "Description": '',
                // "TeacherID": lesson.teacher,
                // "StudentID": lesson.student,
                "LessonMembers":lesson.LessonMembers,
                "CourseID": this.courseId,
                "LectureIDs": lesson.lectures.toString(),
                "StartDate": start,
                "EndDate": end,
              };

              data.push(lessonData);
            }
          }
        }

        let self = this;
        let url = GetAPIUrl() + "Lesson/CreateOrUpdateLessons";
        this._postData(url, data, null, function (result) {
          if (self.callbackSave && typeof self.callbackSave === 'function') {
            self.callbackSave(result);
          }
          self.modalEdit = false;
        }, null);
      },
      handleCancel: function () {
        this.modalEdit = false;
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
              self.$Message.error(result.ErrorMessage);
              console.log(result);
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            if (error && typeof error === 'function') {
              error();
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error(xhr.status + ': ' + xhr.statusText);
            console.log(xhr);
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
              self.$Message.error(result.ErrorMessage);
              console.log(result);
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            if (error && typeof error === 'function') {
              error();
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error(xhr.status + ': ' + xhr.statusText);
            console.log(xhr);
          }
        });
      }
    }
  }
</script>
