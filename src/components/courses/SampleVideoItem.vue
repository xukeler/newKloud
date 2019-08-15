<template>
  <div class="sample-video-item">
    <table class="course-detail">
      <tr>
        <td>{{$t('CourseProperty.Title')}}: </td>
        <td><Input v-model="editingSampleVideo.title" :placeholder="$t('CourseProperty.Title')"></Input></td>
        <td></td>
      </tr>
      <tr>
        <td>{{$t('CourseItem.Description')}}: </td>
        <td><Input v-model="editingSampleVideo.desc" type="textarea" :autosize="{minRows: 3}" :placeholder="$t('SampleVideoList.SomeDescriptionSample')"></Input></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>{{$t('Common.Type')}}:</td>
        <td>
          <RadioGroup v-model="editingSampleVideo.type" style="width: 100%; padding: 0.5em;">
              <Radio label="0" size="large">{{$t('SampleVideoList.PeertimeRecordedLesson')}}</Radio>
              <Radio label="1" size="large">{{$t('SampleVideoList.ExternalVideoURL')}}</Radio>
          </RadioGroup>
        </td>
        <td></td>
      </tr>
      <tr v-show="editingSampleVideo.type === '0'">
        <td>{{$t("SampleVideoList.LessonInfo")}}:</td>
        <td>
          <div class="lesson-info">
            <p>{{$t('Common.Student')}}: <span>{{sampleLesson.studentName}}</span></p>
            <p>{{$t('SampleVideoList.Course')}}: <span>{{sampleLesson.courseTitle}}</span></p>
            <p>{{$t('Common.Lesson')}}: <span>{{sampleLesson.lessonTitle}}</span></p>
            <p>{{$t('Common.Date')}}: <span>{{sampleLesson.date}}</span></p>
          </div>
        </td>
        <td></td>
      </tr>
      <tr v-show="editingSampleVideo.type === '0'">
        <td></td>
        <td>
          <Button style="margin-right: 2em;" @click="handleSelectSample">{{$t('Common.Select')}}</Button>
          <Button @click="handleRecordSample">{{$t('Common.Record')}}</Button>
        </td>
        <td></td>
      </tr>
      <tr v-show="editingSampleVideo.type === '1'">
        <td>{{$t('SampleVideoList.GlobalUserURL')}}</td>
        <td><Input v-model="editingSampleVideo.link1"></Input></td>
        <td></td>
      </tr>
      <tr v-show="editingSampleVideo.type === '1'">
        <td>{{$t('SampleVideoList.ChinaUserURL')}}</td>
        <td><Input v-model="editingSampleVideo.link2"></Input></td>
        <td></td>
      </tr>
      <tr v-show="editingSampleVideo.type === '1'">
        <td></td>
        <td style="color: #80848f">{{$t('SampleVideoList.YouTubeNotSupportedInChina')}}</td>
        <td></td>
      </tr>

    </table>

    <div>
      <Modal v-model="modalSelectSample" :transfer="false" :mask-closable="false" title="Select a sample" :width="600">
        <div class="sample-video-item">
          <table class="course-detail">
            <tr>
              <td>{{$t('Common.Student')}}: </td>
              <td>
                <Select v-model="selectSample.student" style="width: 100%" :placeholder="$t('SampleVideoList.PlaceholderPleaseSelectAStudent')" @on-change="handleSelectStudentChanged">
                  <Option v-for="student in selectStudentList" :value="student.id" :key="student.id">{{ student.name }}</Option>
                </Select>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>{{$t('SampleVideoList.Course')}}: </td>
              <td>
                <Select v-model="selectSample.course" style="width: 100%" :placeholder="$t('SampleVideoList.PlaceholderPleaseSelectACourse')" @on-change="handleSelectCourseChanged">
                  <Option v-for="course in selectCourseList" :value="course.id" :key="course.id">{{ course.title }}</Option>
                </Select>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>{{$t('Common.Lesson')}}: </td>
              <td>
                <Select v-model="selectSample.lesson" style="width: 100%" :placeholder="$t('SampleVideoList.PlaceholderPleaseSelectALesson')">
                  <Option v-for="lesson in selectLessonList" :value="lesson.id" :key="lesson.id">{{ lesson.title }}</Option>
                </Select>
              </td>
              <td></td>
            </tr>
          </table>
        </div>

        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleSelectSampleOK">{{$t('Base.OK')}}</Button>
          <Button @click="handleSelectSampleCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalRecordSample" :transfer="false" :mask-closable="false" :title="$t('SampleVideoList.RecordAsample')" :width="600">
        <div class="sample-video-item">
          <table class="course-detail">
            <tr>
              <td>{{$t('SampleVideoList.Course')}}: </td>
              <td>
                <Select v-model="recordSample.course" disabled style="width: 100%" :placeholder="$t('SampleVideoList.PlaceholderPleaseSelectACourse')" @on-change="handleRecordCourseChanged">
                  <Option v-for="course in recordCourseList" :value="course.id" :key="course.id">{{ course.title }}</Option>
                </Select>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>{{$t('Common.Lecture')}}: </td>
              <td>
                <Select v-model="recordSample.lecture" style="width: 100%" :placeholder="$t('SampleVideoList.PlaceholderPleaseSelectLecture')">
                  <Option v-for="lecture in recordLectureList" :value="lecture.id" :key="lecture.id">{{ lecture.title }}</Option>
                </Select>
              </td>
              <td></td>
            </tr>
          </table>
        </div>

        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleRecordSampleOK">{{$t('SampleVideoList.OKRecordNow')}}</Button>
          <Button @click="handleRecordSampleCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<style lang="scss">
  .sample-video-item {
    .course-detail {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;

      td:first-of-type {
        text-align: right;
        width: 25%;
        padding: 10px 20px;
        vertical-align: top;
      }

      td:nth-of-type(2) {
        text-align: left;
        padding: 5px;
      }
      td:last-of-type {
        width: 15%;
      }

      textarea {
        width: 100%;
        resize: none;
      }
    }

    .lesson-info {
      border: 1px solid #dddee1;
      border-radius: 3px;
      padding: 0.2em 1em;
      line-height: 2em;
      color: #80848f;

      span {
        color: #495060;
      }
    }
  }
</style>

<script>
  import auth from '../../authenticator';
  import friends from '../../friends';

  export default {
    data() {
      return {
        initialized: false,
        loading: false,
        sampleVideoId: 0,
        isCreating: false,
        editingSampleVideo: {title: '', desc: '', type: '0', lesson: 0, link1: '', link2: ''},
        sampleLesson: {lessonId: 0, lessonTitle: '', courseId: 0, courseTitle: '', studentId: 0, studentName: '', date: ''},
        modalSelectSample: false,
        selectSample: {student: 0, course: 0, lesson: 0},
        selectStudentList: [],
        selectCourseList: [],
        selectLessonList: [],
        modalRecordSample: false,
        recordSample: {course: 0, lecture: 0},
        recordCourseList: [],
        recordLectureList: [],
      };
    },
    props:{
      courseId: {
        required: true
      },
      isSchool: {
        type: Boolean,
        default: false
      },
      schoolId: {
        type: Number,
        default: -1
      }
    },
    computed: {
      teacherId() {
        return this.isSchool ? -1 : auth.getUserID();
      }
    },
    methods: {
      readData(id) {
        this.sampleVideoId = id;
        this.isCreating = id < 0;

        this.sampleLesson = {lessonId: 0, lessonTitle: '', courseId: 0, courseTitle: '', studentId: 0, studentName: '', date: ''};

        if (this.isCreating) {
          this.editingSampleVideo = {
            id: this.sampleVideoId,
            title: "",
            desc: "",
            type: "0",
            lesson: 0,
            link1: "",
            link2: "",
            detail: null
          };
        }
        else {
          let self = this;

          let url = GetAPIUrl() + "SampleVideo/Item?sampleVideoID=" + this.sampleVideoId;
          this._getData(url, null, (result) => {
            let sampleVideo = result;

            self.editingSampleVideo = {
              id: sampleVideo.SampleVideoID,
              title: sampleVideo.Title,
              desc: sampleVideo.Description,
              type: sampleVideo.TypeID.toString(),
              lesson: sampleVideo.LessonID,
              link1: sampleVideo.Link1,
              link2: sampleVideo.Link2,
              detail: sampleVideo
            };

            if (self.editingSampleVideo.lesson) {
              self.readLesson(self.editingSampleVideo.lesson)
            }
          }, null);
        }
      },
      saveData() {
        let title = this.editingSampleVideo.title;
        if (!title) {
          this.$Modal.warning({
            title: this.$t("Common.Warning"),
            content: this.$t("CourseItem.ErrorTitleCannotEmpty")
          });
          return;
        }

        let url = "";
        if (this.isCreating) {
          url = GetAPIUrl() + "SampleVideo/CreateSampleVideo";
        }
        else {
          url = GetAPIUrl() + "SampleVideo/UpdateSampleVideo";
        }

        let data = {
          "CourseID": this.courseId,
          "SampleVideoID": this.sampleVideoId,
          "Title": this.editingSampleVideo.title,
          "Description": this.editingSampleVideo.desc,
          "TypeID": this.editingSampleVideo.type,
          "Link1": this.editingSampleVideo.link1,
          "Link2": this.editingSampleVideo.link2,
          "LessonID": this.sampleLesson.lessonId,
        };

        let self = this;
        self._postData(url, data, null, (result) => {
          self.afterSaveOrRemove('save');
        }, null);
      },
      removeData() {
        if (this.isCreating) {
          this.afterSaveOrRemove('remove');
        }
        else {
          let self = this;

          this.$Modal.confirm({
            title: self.$t("Files.RemoveRecordedSampleTitle"),
            content: self.$t("Files.RemoveRecordedSampleContent"),
            okText: self.$t("Common.Delete"),
            cancelText: self.$t("Base.Cancel"),
            onOk: () => {
              let url = GetAPIUrl() + "SampleVideo/Delete?sampleVideoID=" + self.sampleVideoId;
              self._deleteData(url, null, (result) => {
                self.afterSaveOrRemove('remove');
              }, null);
            }
          });
        }
      },
      afterSaveOrRemove(method) {
        this.$emit('on-save-remove', method);
      },
      handleSelectSample() {
        this.modalSelectSample = true;
        this.readStudents();
      },
      readStudents () {
        let self = this;
        if (this.isSchool) {
          let url = GetAPIUrl() + "SchoolContact/List?schoolID=" + this.schoolId + "&roleType=" + auth.SchoolRole.Students + "&pageIndex=-1";
          this._getData(url, null, (data) => {
            self.selectStudentList = self.initializeUsers1(data);

            self.$nextTick(() => {
              if (self.sampleLesson.studentId > 0) {
                self.selectSample.student = self.sampleLesson.studentId;
              }
            });
          }, null);
        }
        else {
          friends.getFriends(function (users) {
            self.selectStudentList = self.initializeUsers2(users);

            if (self.sampleLesson.studentId > 0) {
              self.selectSample.student = self.sampleLesson.studentId;
            }
          });
        }
      },
      initializeUsers1(data) {
        let list = [];
        for (let i = 0, count = data.length; i < count; i++) {
          let user = data[i];
          let item = {
            id: user.UserID,
            avatar: user.AvatarUrl,
            name: user.UserName,
            phone: user.Phone,
            email: user.Email,
            detail: user
          };

          list.push(item);
        }
        return list;
      },
      initializeUsers2(data) {
        let list = [];
        for (let i = 0, count = data.length; i < count; i++) {
          let user = data[i];
          let item = {
            id: user.UserID,
            avatar: user.AvatarUrl,
            name: user.Name,
            phone: user.Phone,
            email: user.Email,
            detail: user
          };

          list.push(item);
        }
        return list;
      },
      handleSelectStudentChanged() {
        this.readCourses10();
      },
      readCourses10 () {
        this.selectCourseList = [];
        this.selectLessonList = [];

        if (!this.selectSample.student) {
          return;
        }

        let self = this;

        let filter = "&templateID=" + this.courseId + "&StudentID=" + this.selectSample.student;

        if (this.isSchool)
          filter += '&SchoolID=' + this.schoolId;
        else
          filter += '&TeacherID=' + this.teacherId;

        let url = GetAPIUrl() + "Course/List?listType=10" + filter; // Active and Finished
        url += "&sortBy=0";
        url += "&order=1";
        url += "&pageIndex=-1";
        url += "&pageSize=100";

        this._getData(url, null, (data) => {
          for(let i = 0; i < data.length; i++) {
            let course = {
              id: data[i].CourseID,
              title: data[i].Title,
            };

            self.selectCourseList.push(course);
          }

          self.$nextTick(() => {
            if (self.selectSample.student === self.sampleLesson.studentId && self.sampleLesson.courseId > 0) {
              self.selectSample.course = self.sampleLesson.courseId;
            }
          });
        }, null);
      },
      handleSelectCourseChanged() {
        this.readLessons();
      },
      readLessons() {
        this.selectLessonList = [];

        if (!this.selectSample.course) {
          return;
        }

        let self = this;
        let url = GetAPIUrl() + "Lesson/LessonList?courseID=" + this.selectSample.course;
        this._getData(url, null, (data) => {
          for (let i = 0; i < data.length; i++) {
            let start = new Date(parseInt(data[i].StartDate));
            let end = new Date(parseInt(data[i].EndDate));

            let lesson = {
              id: data[i].LessonID,
              title: data[i].Title,
              date: start,
              start: start,
              end: end,
              lectures: data[i].LectureIDs.split(',').map(Number)
            };

            self.selectLessonList.push(lesson);
          }

          self.$nextTick(() => {
            if (self.selectSample.course === self.sampleLesson.courseId && self.sampleLesson.lessonId > 0) {
              self.selectSample.lesson = self.sampleLesson.lessonId;
            }
          });
        }, null);
      },
      readLesson(id) {
        let self = this;
        let url = GetAPIUrl() + "Lesson/LessonItem?lessonID=" + id;

        this._getData(url, null, (data) => {
          self.sampleLesson = {
            lessonId: data.LessonID,
            lessonTitle: data.Title,
            courseId: data.CourseID,
            courseTitle: data.CourseName,
            studentId: data.StudentID,
            studentName: data.StudentName,
            date: data.StartDate ? (new Date(parseInt(data.StartDate))).toLocaleString() : ''
          }
        }, null);
      },
      handleSelectSampleOK() {
        if (!this.selectSample.lesson) {
          this.$Modal.warning({
            title: this.$t("Common.Warning"),
            content: this.$t("SampleVideoList.PlaceholderPleaseSelectALesson")
          });
          return;
        }

        this.readLesson(this.selectSample.lesson);

        this.modalSelectSample = false;
      },
      handleSelectSampleCancel() {
        this.modalSelectSample = false;
      },
      handleRecordSample() {
        this.modalRecordSample = true;
        this.readCourses1();
      },
      readCourses1 () {
        let self = this;
        this.recordCourseList = [];

        let url = GetAPIUrl() + "Course/List?listType=1";
        if (this.isSchool) {
          url += '&SchoolID=' + this.schoolId;
        }
        else {
          url += '&TeacherID=' + this.teacherId;
        }
        url += "&sortBy=0";
        url += "&order=1";
        url += "&pageIndex=-1";
        url += "&pageSize=100";

        this._getData(url, null, (data) => {
          let courses = data;

          for(let i = 0; i < courses.length; i++) {
            let course = {
              id: courses[i].CourseID,
              title: courses[i].Title,
            };

            self.recordCourseList.push(course);

            self.$nextTick(() => {
              self.recordSample.course = self.courseId;
            });
          }
        }, null);
      },
      handleRecordCourseChanged() {
        this.readLectures();
      },
      readLectures() {
        this.recordLectureList = [];

        if (!this.recordSample.course) {
          return;
        }

        let self = this;
        let url = GetAPIUrl() + "Lecture/List?courseID=" + this.recordSample.course;

        this._getData(url, null, (data) => {
          for (let i = 0; i < data.length; i++) {
            let lecture = {
              id: data[i].LectureID,
              title: data[i].Title
            };

            self.recordLectureList.push(lecture);
          }

        }, null);
      },
      handleRecordSampleOK(){
        this.modalRecordSample = false;
      },
      handleRecordSampleCancel() {
        this.modalRecordSample = false;
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
