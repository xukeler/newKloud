<template>
  <div class="lesson-list">
    <lesson-item v-for="lessonItem in lessonList" :lesson-id="lessonItem.id" :lesson-info="lessonItem" :all-lectures="allLectures" :key="lessonItem.id" style="margin-bottom: 10px;" @on-delete="deleteLesson"></lesson-item>
    <Button type="text" size="large" @click="addLesson"><Icon type="plus-round"></Icon> {{$t('AddLesson.AddLesson')}}</Button>
  </div>
</template>

<style lang="scss">
  .lesson-list {
    padding: 10px;
  }
</style>

<script>
  import auth from '../../authenticator';
  import LessonItem from './LessonItem.vue';

  export default {
    components: {
      LessonItem
    },
    props: {
      courseType:{
        type: Number,
        default: 0
      },
      courseId: {
        type: Number,
        default: 0
      },
      isCreating: {
        type: Boolean,
        default: false
      },
    },
    data () {
      return {
        loading: false,
        lessonList: [],
        allLectures: []
      };
    },
    methods: {
      clear() {
        this.clearData();
      },
      initialize() {
        this.readData();
      },
      refresh() {
        this.readData();
      },
      clearData(){
        this.loaded = false;
        this.lessonList = [];
        this.allLectures = [];
      },
      readData() {
        this._readLectureList();
      },
      _readLectureList(){
        if (!this.courseId) {
          return;
        }

        let self = this;
        let url = GetAPIUrl() + "Lecture/List?courseID=" + this.courseId;
        this._getData(url, null, (data) => {
          let lectures = [];
          for (let i = 0; i < data.length; i++) {
            let lecture = {
              index: self.$t('Common.Lecture') + (i + 1),
              id: data[i].LectureID,
              name: data[i].Title,
              status: self.$t('AddLesson.Ready')
            };

            lectures.push(lecture);
          }
          self.allLectures = lectures;
          self._readLessonList();
        }, null);
      },
      _readLessonList() {
        if (this.isCreating)
          return;

        if (this.loaded)
          return;

        let self = this;
        let url = GetAPIUrl() + "Lesson/LessonList?courseID=" + this.courseId;
        this._getData(url, null, (data) => {
          let lessons = [];
          for (let i = 0; i < data.length; i++) {
            let start = new Date(parseInt(data[i].StartDate));
            let end = new Date(parseInt(data[i].EndDate));

            let lesson = {
              id: data[i].LessonID,
              title: data[i].Title,
              date: start,
              start: start,
              end: end,
              lectures: data[i].LectureIDs.split(',').map(Number),
              error: '',
              dirty: false
            };

            lessons.push(lesson);
          }

          lessons.sort(function(a, b) {
            if (a.title < b.title) {
              return -1;
            }
            if (a.title > b.title) {
              return 1;
            }
            return 0;
          });

          self.lessonList = lessons;
          self.$nextTick(() => {
            for (let i = 0; i < self.lessonList.length; i++) {
              self.lessonList[i].dirty = false;
            }
          })
        }, null);
      },
      checkData() {
        let result = true;
        for (let i = 0; i < this.lessonList.length; i++) {
          let lesson = this.lessonList[i];
          let startTime = new Date(Date.parse('2000-01-01 ' + lesson.start));
          let endTime = new Date(Date.parse('2000-01-01 ' + lesson.end));

          if (startTime && typeof (startTime) === "object" && endTime && typeof (endTime) === "object")
          {
            let start = startTime.getTimePart();
            let end = endTime.getTimePart();

            if (start > end)
            {
              lesson.error = this.$t('AddLesson.EndShouldLaterThanStart');
              result = false;
            }
          }
          /*if (lesson.lectures.length === 0 || (lesson.lectures.length === 1 && lesson.lectures[0] === 0)) {
            lesson.error = 'Please select some Lectures.';
            result = false;
          }*/
        }

        return result;
      },
      //起始时间能大于结束时间
      CompareDate(t1,t2){
        if(t2 < t1){
           alert(this.$t('Common.AlertCompareTime'));
           return true;
        }
        return false;
      },
      saveData(newCourseId, lectureRelation, memberData, callback) {
        if (this.lessonList.length < 1) {
          if (callback) {
            callback();
          }
          return;
        }
        let course = this.courseId;
        if (newCourseId > 0)
          course = newCourseId;

        if (lectureRelation.length > 0) {
          let lectures = {};
          for (let i = 0; i < lectureRelation.length; i++) {
            let res = lectureRelation[i].split(',');
            lectures["L" + res[0]] = parseInt(res[1]);
          }

          for (let i = 0; i < this.lessonList.length; i++) {
            let lesson = this.lessonList[i];
            let newlectures = [];
            for (let j = 0; j < lesson.lectures.length; j++) {

              newlectures.push(lectures["L" + lesson.lectures[j]]);
            }
            lesson.lectures = newlectures;
          }
        }

        let data = [];
        let schoolId=auth.getChosenSchoolId();
        for (let i = 0; i < this.lessonList.length; i++)
        {
          let lessonInfo = this.lessonList[i];
          if (lessonInfo.id > 0 && !lessonInfo.dirty) {
            continue;
          }

          let date = lessonInfo.date.getDatePart();
          let start = date + lessonInfo.start.getTimePart();
          let end = date + lessonInfo.end.getTimePart();
          
          if(this.CompareDate(start,end)){
            return;
          }

          let  lessonData= {
            "LessonType":this.courseType,
            "LessonID": lessonInfo.id,
            "Title": lessonInfo.title,
            "Description": '',
            // "StudentID": student,
            // "TeacherID": teacher,
            "CourseID": course,
            "LectureIDs": lessonInfo.lectures.toString(),
            "StartDate": start,
            "EndDate": end,
            "SchoolID": schoolId,
            //Role对应的枚举：Student = 1, Teacher = 2;
            "LessonMembers": memberData
          };

          data.push(lessonData);

        }
        let masterLessons;
        if(this.courseType==3){
            masterLessons={"CourseID":course,"Lessons":data};
        }

        let self = this;
        let url;
        if(this.courseType==3){
          url = GetAPIUrl() + "Lesson/CreateMasterLessons";
          this._postData(url,masterLessons, null, (result) => { 
            self._readLessonList();
            if (callback && typeof callback === 'function') {
              callback();
            }
          }, null);
        }else{
          url = GetAPIUrl() + "Lesson/CreateOrUpdateLessons";
          this._postData(url, data, null, (result) => {  
            self._readLessonList();
            if (callback && typeof callback === 'function') {
              callback();
            }
          }, null);
        }
      },
      addLesson() {
        let start, end;

        if (this.$route.query.start) {
          start = new Date(parseInt(this.$route.query.start));
          end = new Date(parseInt(this.$route.query.end));
        }
        else {
          let date = new Date();
          let tick = Math.round(date.getTime() / (1000 * 60 * 60) + 1) * (1000 * 60 * 60);
          start = new Date(tick);
          end = new Date(tick + 1000 * 60 * 60);
        }

        let id = this.lessonList.length + 1;
        let lesson = {
          id: -id,
          title: this.$t('Common.Lesson') + id,
          date: start,
          start: start,
          end: end,
          lectures: [],
          error: '',
          dirty: false
        };

        this.lessonList.push(lesson);

        this.$nextTick(() => {
          $(document).scrollTop($(document).height());
        });
      },
      deleteLesson(lesson) {
        let self = this;
        this.$Modal.confirm({
          title: self.$t('Activity.ModalDeleteTitle'),
          content: self.$t('Activity.ModalDeleteTitle')+":" + lesson.title + "?",
          okText: self.$t("Common.Delete"),
          cancelText: self.$t("Base.Cancel"),
          onOk: () => {
            if (lesson.id <= 0) {
              self._deleteLessonFromList(lesson);
            }
            else {
              let url = GetAPIUrl() + "Lesson/Delete?lessonID=" + lesson.id;
              self._deleteData(url, null, (result) => {
                self._deleteLessonFromList(lesson);
              }, null);
            }
          }
        });
      },
      _deleteLessonFromList(lesson) {
        let index = this.lessonList.indexOf(lesson);
        this.lessonList.splice(index, 1);
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
