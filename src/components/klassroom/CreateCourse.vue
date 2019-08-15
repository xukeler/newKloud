<template>
  <div class="klassroom-create-course">
    <div class="header">
      {{$t('CreateCourse.NewCourse')}}
    </div>
    <div class="content">
      <div class="course-group">
        <course-teachers @select-TeachersData="getTeachersData" :is-school="isSchool" :school-id="schoolId" :is-creating="true"></course-teachers>
        <div style="height:1em;"></div>
        <course-classes @select-ClassesData="getClassesData" :is-school="isSchool" :school-id="schoolId" :term-year="currentTerm.year" :is-creating="true"></course-classes>
      </div>
      <div class="course-base-info">
        <table class="course-content">
          <tr v-show="KlassroomSettings.cohortCount > 0">
            <td>Student Body (Cohort)</td>
            <td>
              <Select v-model="courseCohort" style="width:100%" placeholder="Please Select a Cohort">
                <Option v-for="item in allCohorts" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              {{$t('CreateCourse.CourseTemplate')}}
            </td>
            <td>
              <Select v-model="courseTemplate" style="width: 100%" :placeholder="$t('CreateCourse.PlaceholderSelectTemplate')" @on-change="onTemplateChanged" filterable>
                <Option v-for="template in allTemplates" :value="template.CourseID" :key="template.CourseID">{{ template.Title }}</Option>
              </Select>
            </td>
            <td>
            </td>
          </tr>
        </table>
      </div>
      <div class="course-lesson" v-show="courseTemplate > 0">
        <div class="lesson-header">
          <span style="font-weight: bold">{{$t('CreateCourse.ScheduleLessons')}}</span>
        </div>
        <course-lessons ref="courseLessons" :is-creating="true" :course-id="courseTemplate" :course-type="courseType" :lesson-amount="1"></course-lessons>
      </div>
    </div>
    <div class="footer">
      <Button shape="circle" size="large" type="primary" @click="onSubmit" :disabled="!courseTemplate" :loading="loading">{{$t('CreateCourse.Submit')}}</Button>
      <Button shape="circle" size="large" style="margin-left:100px;" @click="onCancel">{{$t('Base.Cancel')}}</Button>
    </div>
  </div>
</template>

<style lang="scss">
  $images-root: "../../../static/images/";

  .klassroom-create-course {
    padding: 2em;

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
      padding: 10px 10%;

      $padding: 10px 0;
      $border: 1px dashed #dddee1;

      .course-type {
        padding: $padding;

        .type-label {
          color: #0061BB;
          font-size: 18px;
          padding-bottom: 10px;
        }

        .type-buttons {
          padding-bottom: 10px;

          button {
            font-size: 16px;
            padding-left: 56px;
            padding-right: 1em;
            line-height: 1.6em;
            position: relative;
          }

          $image-size: 24px 24px;
          .type-image {
            display: inline-block;
            width: 24px;
            height: 24px;
            margin-right: 1em;
            position: absolute;
            left: 16px;
            top: 8px;
          }

          .private-white {
            background-image: url($images-root + 'course-private-white.svg');
            background-size: $image-size;
          }
          .private-gray {
            background-image: url($images-root + 'course-private-gray.svg');
            background-size: $image-size;
          }
          .seminar-white {
            background-image: url($images-root + 'course-seminar-white.svg');
            background-size: $image-size;
          }
          .seminar-gray {
            background-image: url($images-root + 'course-seminar-gray.svg');
            background-size: $image-size;
          }
          .public-white {
            background-image: url($images-root + 'course-public-white.svg');
            background-size: $image-size;
          }
          .public-gray {
            background-image: url($images-root + 'course-public-gray.svg');
            background-size: $image-size;
          }
          .master-white {
            background-image: url($images-root + 'course-master-white.svg');
            background-size: $image-size;
          }
          .master-gray {
            background-image: url($images-root + 'course-master-gray.svg');
            background-size: $image-size;
          }
          i {
            position: absolute;
            top: -6px;
            right: -6px;
          }
        }
      }

      .course-content {
        width: 100%;

        td:first-of-type {
          width: 25%;
          height: 3em;
          text-align: right;
          padding-right: 2em;
        }
        td:last-of-type {
          width: 25%;
        }
      }

      .course-base-info {
        border-top: $border;
        padding: $padding;
      }

      .course-download {
        //border-bottom: $border;
        //padding: $padding;
        padding-bottom: 10px;
      }

      .course-group {
        //border-top: $border;
        padding: $padding;
        .type-label {
          color: #0061BB;
          font-size: 16px;
          padding-bottom: 10px;
        }
      }

      .course-attendee {
        border-top: $border;
        padding: $padding;
      }

      .course-lesson {
        border-top: $border;
        padding: $padding;
      }
    }

    .footer {
      border-top: 1px dashed #dddee1;
      padding-top: 10px;
      margin-top: 10px;
      padding-bottom: 40px;
    }
  }
</style>

<script>
  import auth from '../../authenticator';
  import friends from '../../friends';
  import CourseTeachers from '../courses/CourseTeachers.vue';
  import CourseClasses from '../courses/CourseClasses.vue';
  import CourseLessons from '../courses/CourseLessons.vue';
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';

  export default {
    components:{
      CourseTeachers, CourseClasses, CourseLessons
    },
    data() {
      return {
        loading: false,
        courseType: 1,
        courseTitle: "",
        courseTemplate: 0,
        courseTemplateType: 0,
        allTemplates: [],
        selectTeachersData: [],
        selectClassesData: [],
        courseCohort: -1,
        allCohorts: [],
        allTerms: [],
      };
    },
    computed: {
      ...mapState(["Klassroom", "KlassroomSettings"]),

      isKlassroom() {
        return IsKlassroom();
      },
      schoolId() {
        return auth.getChosenSchoolId();
      },
      folderId() {
        return this.Klassroom.currentFolder;
      },
      currentTerm() {
        return this.Klassroom.currentTerm;
      },
      isSchool() {
        return true;
      },
    },
    watch: {
      courseCohort(to, from) {
        this.$nextTick(() => {this.readTemplates()});
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.$parent.$emit("viewChanged", "courses"); //"create-course"
      });

      this.readTemplates();
      this.readCohorts();
    },
    methods: {
      getTeachersData(data){
        if(data) {
          let list = [];
          for(let i = 0; i < data.length; i++) {
            list.push({"MemberID": data[i].MemberID, "Role": data[i].Role})
          }
          this.selectTeachersData = list;
        }
      },
      getClassesData(data){
        if(data) {
          let list = [];
          for(let i = 0; i < data.length; i++) {
            list.push({"MemberID": data[i].MemberID, "Role": data[i].Role})
          }
          this.selectClassesData = list;
        }
      },
      readTemplates: function () {
        let self = this;

        let url = GetAPIUrl() + "Course/List?listType=1";
        if (this.isSchool) {
          url += '&SchoolID=' + this.schoolId;
        }
        else {
          url += '&TeacherID=' + this.teacherId;
        }
        if (this.isKlassroom) {
          //url += "&folderID=" + this.Klassroom.currentFolder;

          if (this.KlassroomSettings.cohortCount > 0)
            url += "&cohortID=" + this.courseCohort;
          // if (this.KlassroomSettings.termCount > 0)
          //   url += "&semesterID=" + this.currentTerm.id;
        }
        url += "&sortBy=0";
        url += "&order=1";
        url += "&pageIndex=-1";
        url += "&pageSize=100";
        this._getData(url, null, (data) => {
          self.allTemplates = data;
        }, null);
      },
      readCohorts() {
        let list = [];
        list.push({ id: 1, name: this.KlassroomSettings.cohort1 });
        list.push({ id: 2, name: this.KlassroomSettings.cohort2 });
        if (this.KlassroomSettings.cohortCount > 2)
          list.push({ id: 3, name: this.KlassroomSettings.cohort3 });
        if (this.KlassroomSettings.cohortCount > 3)
          list.push({ id: 4, name: this.KlassroomSettings.cohort4 });
        if (this.KlassroomSettings.cohortCount > 4)
          list.push({ id: 5, name: this.KlassroomSettings.cohort5 });

        this.allCohorts = list;
        this.courseCohort = this.Klassroom.currentCohort;
      },
      onTemplateChanged(current) {
        let template = null;
        for (let i = 0; i < this.allTemplates.length; i++) {
          if (this.allTemplates[i].CourseID === current) {
            template = this.allTemplates[i];
            break;
          }
        }

        if (template) {
          this.courseTitle = template.Title;
          this.courseTemplateType = template.TemplateType;
        }

        this.$nextTick(() => {
          this.$refs.courseLessons.clear();
          this.$refs.courseLessons.refresh();
        });
      },
      handleRecurring() {
        this.isRecurring = true;
      },
      handleNonRecurring() {
        this.isRecurring = false;
      },
      onCancel() {
        this.goBackList();
      },
      onSubmit() {
        if (this.courseTemplate === 0) {
          alert(this.$t('CreateCourse.AlertPleaseSelectTemplate'));
          return;
        }

        if (!this.$refs.courseLessons.checkData())
          return;

        let courseMembers = this.selectTeachersData.concat(this.selectClassesData);

        let url = GetAPIUrl() + "Course/CreateCourse";

        let school = this.schoolId
        let data = {
          "CourseMembers": courseMembers,
          "IsTemplate": 0,
          "Title": this.courseTitle,
          "TemplateID": this.courseTemplate,
          "TemplateType": this.courseTemplateType,
          // "TeacherID": teacher,
          // "StudentID": student,
          "SchoolID": school,
          "FolderID": this.folderId,
          "Type": this.courseType,
          "LessonCount": 0,
          "LessonCost": 0,
          "Discount": 0,
          "Cost": 0,
          "EnableSelfLearning": 0,
          "SelfLearningPrice": 0,
          "EnableAdditionalStudent": 0,
          "AdditionalStudentSeat":  0,
          "AdditionalStudentPrice": 0,
          "EnableBroadcast": 0,
          "LiveBroadcastPrice": 0,
          "AuthorLessonCount": 0,
          "AuthorLessonCost": 0,
          "AuthorCost": 0,
          "CohortID": this.courseCohort,
          "SemesterID": this.currentTerm.id,
        };

        let self = this;

        this.changeCreateCourseFlag("before");
        this._postData(url, data, null, (result) => {
          let data = result;
          let courseId = data.Course.CourseID;
          let lectureRelation = data.LectureRelation;
          self.$refs.courseLessons.saveData(courseId, lectureRelation, courseMembers, self.goBackList);
          self.changeCreateCourseFlag("after");
        }, null);
      },
      goBackList(){
        this.$router.back(); //this.$router.push({name: 'courses'});
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
      },

      ...mapMutations(['changeCreateCourseFlag'])
    }
  }
</script>
