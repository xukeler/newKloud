<template>
  <div class="lesson-info">
    <Modal v-model="modalEdit" :mask-closable="false" :title="$t('LessonInfo.EditLessonProperty')">
      <div class="lesson-info">
        <div style="font-size: 20px; font-weight: bold; line-height: 1.5em;">
          {{courseName}}
        </div>
        <div style="font-size: 16px; line-height: 2em;">
          {{$t('LessonInfo.Teacher')}}: {{teacherName}}
        </div>
        <div style="font-size: 13px; line-height: 2em; margin-bottom: 14px;">
          {{$t('LessonInfo.Total')}}: {{lessonCount}} {{$t('LessonInfo.LessonsFinished')}}<a ref="javascript:void(null);" @click="toggleShowAllLessons" style="float: right;">{{showAllLessonsText}}</a>
        </div>

        <div v-if="showAllLessons">
          <Collapse v-model="lessonCollapse">
            <Panel v-for="lessonItem in allLessons" :name="'lesson' + lessonItem.id" :key="lessonItem.id">
              {{$t("Common.Lesson")}} {{ lessonItem.index }}
              <div slot="content">
                <lesson-item-info :lesson-id="lessonItem.id" :lesson-info="lessonItem" :all-lectures="allLectures" :show-header="false"></lesson-item-info>
              </div>
            </Panel>
          </Collapse>
        </div>
        <div v-else>
          <lesson-item-info ref='current' :lesson-id="currentLesson.id" :lesson-info="currentLesson" :all-lectures="allLectures" :show-header="true"></lesson-item-info>
        </div>
      </div>

      <div slot="footer">
        <Button style="min-width: 72px;" type="primary" :loading="loading" @click="handleOK">{{$t("Base.OK")}}</Button>
        <Button style="" @click="handleCancel">{{$t("Base.Cancel")}}</Button>
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
  }
</style>

<script>
  import auth from '../../authenticator';
  import LessonItemInfo from './LessonItemInfo.vue';

  export default{
    components: {
      LessonItemInfo
    },
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
        lessonCollapse: ''
      };
    },
    computed: {
      showAllLessonsText: function () {
        if (this.showAllLessons) {
          return this.$t('LessonInfo.HideOtherLessons');
        }
        else {
          return this.$t('LessonInfo.ScheduleAllLessons');
        }
      }
    },
    mounted: function () {
    },
    methods: {
      showEdit: function (id, callback) {
        this.lessonId = id;
        this.callbackSave = callback;
        this.showAllLessons = false;
        this._readLesson();
        this.modalEdit = true;
      },
      _readLesson: function () {
        let self = this;

        let url = GetAPIUrl() + "Lesson/LessonItem?lessonID=" + this.lessonId;
        this._getData(url, null, function (result) {
          let lesson = result;

          self.courseId = lesson.CourseID;
          self.courseName = lesson.CourseName;
          self.lessonName = lesson.Title;
          self.lessonCount = lesson.TotalLessonCount;

          let start, end;
          if (lesson.StartDate && lesson.EndDate) {
            start = new Date(parseInt(lesson.StartDate));
            end = new Date(parseInt(lesson.EndDate));
          }
          else {
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
            count: lesson.TotalLessonCount
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
