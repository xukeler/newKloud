<template>
  <div class="live-lesson-info">
    <div class="lesson-info">
      <div class="information" style="position: relative;">
        <div class="title">{{ courseName }}</div>
        <span class="subtitle"> -- {{ lessonName }}</span>

        <div style="position: absolute; right:20px; top: 8px;">
          <Dropdown placement="bottom-end" @on-click="handleMoreAction">
            <a href="javascript:void(null);">
              <Icon type="more" size="20"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="edit"><Icon type="edit" size="16"></Icon><span style="margin-left: 1em;">Edit</span></DropdownItem>
              <DropdownItem name="copy" disabled><Icon type="ios-copy-outline" size="16"></Icon><span style="margin-left: 1em;">Copy</span></DropdownItem>
              <DropdownItem name="print" disabled><Icon type="ios-printer-outline" size="16"></Icon><span style="margin-left: 1em;">Print</span></DropdownItem>
              <DropdownItem name="delete"><Icon type="ios-trash-outline" size="16"></Icon><span style="margin-left: 1em;">Delete</span></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div class="information">
        <table>
          <tr>
            <td><img :src="teacherAvatar" class="avatar"/></td>
            <td>{{ teacherName }}</td>
          </tr>
        </table>
      </div>
      <div class="information">{{ dateString }}</div>
      <div class="information">{{ timeString }}</div>
    </div>

    <Modal
      v-model="modalEdit"
      title="Edit Lesson Property"
      ok-text="OK"
      cancel-text="Cancel"
      @on-ok="okEdit"
      @on-cancel="cancelEdit">

      <div class="live-lesson-info">
        <div style="font-size: 20px; font-weight: bold; line-height: 1.5em;">
          {{courseName}}
        </div>
        <div style="font-size: 16px; line-height: 2em;">
          Teacher: {{teacherName}}
        </div>
        <div style="font-size: 13px; line-height: 2em; margin-bottom: 14px;">
          Total: {{lessonCount}} Lessons (0 lessons finished) <a ref="javascript:null;" @click="toggleShowAllLessons" style="float: right;">{{showAllLessonsText}}</a>
        </div>

        <div v-show="!showAllLessons">
          <lesson-item-info :lesson="currentLesson" :allLectures="allLectures" :showHeader="true"></lesson-item-info>
        </div>

        <div v-show="showAllLessons">
          <Collapse v-model="lessonCollapse">
            <Panel v-for="lessonItem in allLessons" :name="'lesson' + lessonItem.id" :key="lessonItem.id">
              Lesson {{ lessonItem.index }}
              <div slot="content">
                <lesson-item-info :lesson="lessonItem" :allLectures="allLectures" :showHeader="false"></lesson-item-info>
              </div>
            </Panel>
          </Collapse>
        </div>
      </div>

      <div slot="footer" style="text-align: center">
        <Button style="margin-right:50px; min-width: 72px;" @click="cancelEdit">Cancel</Button>
        <Button style="min-width: 72px;" type="primary" @click="okEdit">OK</Button>
      </div>
    </Modal>
  </div>
</template>

<style lang="scss">
  .live-lesson-info {

    .lesson-info {
      text-align: left;
      font-size: 13px;

      .information {
        padding: 2px 16px 2px 16px;
      }

      .avatar {
        width: 40px;
        height: 40px;
        border: gray solid 1px;
        border-radius: 50%;
        margin-right: 16px;
      }

      .title {
        font-size: 16px;
        font-weight: bold;
        padding-right: 24px;
      }

      .subtitle {
        font-size: 14px;
        font-weight: bold;
        font-style: italic;
        text-align: right;
        margin-left: 2em;
      }

      .edit {
        margin-left: 2em;
        float: right;
      }
    }

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
  import friends from '../../friends';
  import LessonItemInfo from './LessonItemInfo.vue';

  export default{
    components: {
      LessonItemInfo
    },
    data: function () {
      return {
        courseId: "",
        courseName: "",
        lessonName: "",
        lessonCount: 10,
        teacherAvatar: "",
        teacherName: "",
        dateString: "",
        timeString: "",
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
          return 'Hide other lessons';
        }
        else {
          return 'Schedule all lessons';
        }
      }
    },
    props:['lessonId'],
    watch: {
      lessonId: function (val) {
        if (parseInt(val) > 0)
          this.readData();
      }
    },
    mounted: function () {
      if (this.lessonId) {
        this.readData();
      }
    },
    methods: {
      readData: function () {
        if (parseInt(this.lessonId) > 0)
          this._readLesson();
      },
      _readLesson: function () {
        let self = this;

        let url = GetAPIUrl() + "Lesson/LessonItem?lessonID=" + this.lessonId;
        $.ajax({
          type: 'Get',
          url: url,
          beforeSend: function (request) {
            request.setRequestHeader("UserToken", auth.getUserToken());
          },
          success: function (data) {
            if (data.RetCode === 0) {
              let lesson = data.RetData;
              console.log(lesson);

              self.courseId = lesson.CourseID;
              self.courseName = lesson.CourseName;
              self.lessonName = lesson.Title;
              self.lessonCount = lesson.TotalLessonCount;

              let start, end;
              if (lesson.StartDate && lesson.EndDate) {
                start = new Date(parseInt(lesson.StartDate));
                end = new Date(parseInt(lesson.EndDate));
                self.dateString = start.toDateString();
                self.timeString = start.toLocaleTimeString() + " - " + end.toLocaleTimeString();
              }
              else {
                let date = new Date();
                let tick = Math.round(date.getTime() / (1000 * 60 * 60) + 1) * (1000 * 60 * 60);
                date = new Date(tick);
                self.dateString = date.toDateString();
                self.timeString = date.toLocaleTimeString() + " - ";
                start = date;
                date = new Date(tick + 1000 * 60 * 60);
                self.timeString += date.toLocaleTimeString();
                end = date;
              }

              self.currentLesson = {
                id: lesson.LessonID,
                title: lesson.Title,
                date: start,
                start: start,
                end: end,
                teacher: lesson.TeacherID,
                student: lesson.StudentID,
                lectures: lesson.LectureIDs.split(',').map(Number),
                dirty: false,
                index: lesson.Index,
                count: lesson.TotalLessonCount
              };

              self.allLessons = [];
              self._readTeacher(lesson.TeacherID);
              self._readLectures(lesson.CourseID);
            }
            else { // error
              console.log(data);
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
          }
        });
      },
      _readTeacher: function (teacherId) {
        let self = this;
        let url = GetAPIUrl() + "User/UserListBasicInfo?userIds=" + teacherId;
        $.ajax({
          type: 'GET',
          url: url,
          beforeSend: function (request) {
            request.setRequestHeader("UserToken", auth.getUserToken());
          },
          success: function (data) {
            if (data.RetCode === 0) {
              let user = data.RetData[0];
              self.teacherName = user.UserName;
              self.teacherAvatar = user.AvatarUrl;
            }
            else {
              console.log(data);
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
          }
        });
      },
      _readLectures: function (courseId) {
        let self = this;
        let url = GetAPIUrl() + "Lecture/List?courseID=" + courseId;
        $.ajax({
          type: 'GET',
          url: url,
          beforeSend: function (request) {
            request.setRequestHeader("UserToken", auth.getUserToken());
          },
          success: function (result) {
            if (result.RetCode === 0) {
              let data = result.RetData;
              let lectures = [];
              for (let i = 0; i < data.length; i++) {
                let lecture = {
                  index: "Lecture " + (i + 1),
                  id: data[i].LectureID,
                  name: data[i].Title,
                  status: "Ready"
                };

                lectures.push(lecture);
              }
              self.allLectures = lectures;
            }
            else {
              console.log(result);
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
          }
        });

      },
      _readAllLessons: function () {
        if (this.allLessons.length > 0 || !this.courseId)
          return;

        let self = this;
        let url = GetAPIUrl() + "Lesson/LessonList?courseID=" + this.courseId;
        $.ajax({
          type: 'GET',
          url: url,
          beforeSend: function (request) {
            request.setRequestHeader("UserToken", auth.getUserToken());
          },
          success: function (result) {
            if (result.RetCode === 0) {
              let data = result.RetData;
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
                    teacher: data[i].TeacherID,
                    student: data[i].StudentID,
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
            }
            else {
              console.log(result);
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
          }
        });
      },
      handleMoreAction: function (name) {
        switch (name) {
          case 'edit':
            this.handleEdit();
            break;

          case 'delete':
            this.handleDelete();
            break;
        }
      },
      handleEdit: function () {
        this.modalEdit = true;
      },
      handleDelete: function () {
        let self = this;
        this.$Modal.confirm({
          title: "Delete Lesson",
          content: "Do you want to remove this lesson?",
          okText: "Delete",
          cancelText: "Cancel",
          onOk: () => {
            let url = GetAPIUrl() + "Lesson/Delete?lessonID=" + self.lessonId;
            $.ajax({
              type: 'DELETE',
              url: url,
              beforeSend: function (request) {
                request.setRequestHeader("UserToken", auth.getUserToken());
              },
              success: function (result) {
                if (result.RetCode === 0) {
                  self.$router.push({name: 'schedule'});
                }
                else { // error
                  console.log(result);
                }
              },
              error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
              }
            });
          }
        });
      },
      toggleShowAllLessons: function () {
        this.showAllLessons = !this.showAllLessons;

        if (this.showAllLessons)
          this._readAllLessons();
      },
      //起始时间能大于结束时间
      CompareDate(t1,t2){
        if(t2 < t1){
           this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t('Common.AlertCompareTime'), top: 24,duration: 4, left:true });
           return true;
        }
        return false;
      },
      okEdit: function () {
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
              "TeacherID": lesson.teacher,
              "StudentID": lesson.student,
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
                "CourseID": this.courseId,
                "LectureIDs": lesson.lectures.toString(),
                "StartDate": start,
                "EndDate": end,
                //Role对应的枚举：Student = 1, Teacher = 2;
                "LessonMembers":[
                {
                  "MemberID": lesson.student,
                  "Role": 1
                },{
                  "MemberID": lesson.teacher,
                  "Role": 2
                }]
              };
       
              data.push(lessonData);
            }
          }
        }

        let self = this;
        let url = GetAPIUrl() + "Lesson/CreateOrUpdateLessons";
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
              self.lessonName = self.currentLesson.title;
              self.dateString = self.currentLesson.date.toDateString();
              self.timeString = self.currentLesson.start.toLocaleTimeString() + " - " + self.currentLesson.end.toLocaleTimeString();
              self.modalEdit = false;
            }
            else { // error
              self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true})
              console.log(result);
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true})
            console.log(xhr);
          }
        });
      },
      cancelEdit: function () {
        this.modalEdit = false;
      }
    }
  }
</script>
