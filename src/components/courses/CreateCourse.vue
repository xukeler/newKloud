<template>
  <div class="create-course">
    <div class="header">
      {{$t('CreateCourse.NewCourse')}}
    </div>
    <div class="content">
      <div class="course-type">
        <div class="type-label">{{$t('CreateCourse.SelectCourseType')}}</div>
        <div class="type-buttons">
          <Button :type="courseType === 0 ? 'info' : 'dashed'" size="large" @click="onclickPrivate" style="margin:0px 20px 20px 0px">
            <span :class="courseType === 0 ? 'type-image private-white' : 'type-image private-gray'"></span>
            {{$t('CreateCourse.OneOnOne')}}
            <Icon type="checkmark-circled" color="red" size="20" v-show="courseType === 0"></Icon>
          </Button>
          <Button :type="courseType === 2 ? 'info' : 'dashed'" size="large" @click="onclickSeminar" style="margin:0px 20px 20px 0px">
            <span :class="courseType === 2 ? 'type-image seminar-white' : 'type-image seminar-gray'"></span>
            {{$t('CreateCourse.OneToMany')}}
            <Icon type="checkmark-circled" color="red" size="20" v-show="courseType === 2"></Icon>
          </Button>
          <Button :type="courseType === 1 ? 'info' : 'dashed'" size="large" @click="onclickPublic" style="margin:0px 20px 20px 0px">
            <span :class="courseType === 1 ? 'type-image public-white' : 'type-image public-gray'"></span>
            {{$t('CreateCourse.PubliCourse')}}
            <Icon type="checkmark-circled" color="red" size="20" v-show="courseType === 1"></Icon>
          </Button>
          <!-- <Button :type="courseType === 3? 'info' : 'dashed'" size="large" @click="onclickMaster" style="margin:0px 0px 20px 0px">
            <span :class="courseType ===3 ? 'type-image master-white' : 'type-image master-gray'"></span>
            {{$t('CreateCourse.MasterCourse')}}
            <Icon type="checkmark-circled" color="red" size="20" v-show="courseType === 3"></Icon>
          </Button> -->
        </div>
      </div>
      <div class="course-group" v-show="courseType === 1 || courseType === 2">
        <course-teachers @select-TeachersData="getTeachersData" :is-school="isSchool" :school-id="schoolId" :is-creating="true"></course-teachers>
        <div style="height:1em;"></div>
        <course-students @select-studentsData="getStudentsData" :is-school="isSchool" :school-id="schoolId" :is-creating="true"></course-students>
      </div>
      <div class="course-group" v-show="courseType === 3">
        <div class="type-label">{{$t('CreateCourse.SelectPartners')}}</div>
        <course-partners @select-partnersData="getPartnersData" :is-school="isSchool" :school-id="schoolId" :is-creating="true"></course-partners>
      </div>
      <div class="course-base-info">
        <table class="course-content">
          <tr v-show="courseType === 0">
            <td>
              {{$t('CreateCourse.Student')}}
            </td>
            <td>
              <Select v-model="courseStudent" style="width: 100%" :placeholder="$t('CreateCourse.PlaceholderPleaseSelectStudent')" filterable>
                <Option v-for="student in allStudents" :value="student.id" :key="student.id">{{ student.name }}</Option>
              </Select>
            </td>
            <td>
            </td>
          </tr>
          <tr v-show="courseType === 1 || courseType === 2 || courseType === 3 || courseStudent > 0">
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
          <tr v-show="courseType === 0 && courseTemplate > 0">
            <td>
              {{$t('CreateCourse.Teacher')}}
            </td>
            <td>
              <Select v-model="courseTeacher" style="width: 100%" :placeholder="$t('CreateCourse.PlaceholderPleaseSelectTeacher')" filterable>
                <Option v-for="teacher in allTeachers" :value="teacher.id" :key="teacher.id">{{ teacher.name }}</Option>
              </Select>
            </td>
            <td>
            </td>
          </tr>
          <tr>
            <td colspan="3"></td>
          </tr>
          <tr v-show="courseTemplate > 0">
            <td>
              {{$t('CreateCourse.EstinatedLessons')}}
            </td>
            <td>
              <Input :value="authorLessonCount" disabled placeholder="" style="width: 100%;"/>
            </td>
            <td></td>
          </tr>
          <tr v-show="courseTemplate > 0">
            <td>
              {{$t('CreateCourse.AuthorSuggestedLesson')}}
            </td>
            <td>
              <Input :value="authorLessonCost" disabled placeholder="" style="width: 100%"/>
            </td>
            <td></td>
          </tr>
          <tr v-show="courseTemplate > 0">
            <td>
              {{$t('CreateCourse.AuthorSuggestedTotal')}}
            </td>
            <td>
              <Input :value="authorCost" placeholder="$" disabled style="width: 100%;"/>
            </td>
            <td></td>
          </tr>
          <tr>
            <td colspan="3"></td>
          </tr>
          <tr v-show="courseTemplate > 0">
            <td>
              {{$t('CreateCourse.NoOfLessons')}}
            </td>
            <td>
              <Input v-model="courseLessonCount" placeholder="" style="width: 100%"/>
            </td>
            <td>
            </td>
          </tr>
          <tr v-show="courseTemplate > 0">
            <td>
              {{$t('CreateCourse.CostperLesson')}}
            </td>
            <td>
              <Input v-model="courseLessonCost" placeholder="" style="width: 100%"/>
            </td>
            <td>
            </td>
          </tr>
          <tr v-show="courseTemplate > 0">
            <td style="color: red;">
              {{$t('CreateCourse.Total')}}
            </td>
            <td>
              <Input :value="courseTotal" placeholder="$" disabled style="width: 100%;"/>
            </td>
            <td>
            </td>
          </tr>
        </table>
      </div>
      <div class="course-download" v-show="courseTemplate > 0">
        <div class="download-enable">
          <Checkbox v-model="courseDownloadEnable" size="large">{{$t('CreateCourse.AllowStuSelfLearning')}}</Checkbox>
        </div>
        <div v-show="courseDownloadEnable">
          <table class="course-content">
            <tr>
              <td>
                {{$t('CreateCourse.Price')}}
              </td>
              <td>
                <Input v-model="courseDownloadCost" placeholder="" style="width: 100%"/>
              </td>
              <td>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="course-attendee" v-show="courseTemplate > 0">
        <div class="attendee-enable">
          <Checkbox v-if="courseType !== 1" v-model="courseAudienceEnable" size="large">{{$t('CreateCourse.EnableLessonTime')}}</Checkbox>
          <span v-else style="font-weight: bold">{{$t('CreateCourse.Audience')}}</span>
        </div>
        <div v-show="courseAudienceEnable || courseType === 1">
          <table class="course-content">
            <tr>
              <td>
                {{$t('CreateCourse.Price')}}
              </td>
              <td>
                <Input v-model="courseAudienceCost" placeholder="" style="width: 100%"/>
              </td>
              <td>
              </td>
            </tr>
          </table>

          <course-audience :headerLabel="courseType === 0 ? $t('CreateCourse.Audience') : ''"></course-audience>
        </div>
      </div>
      <div class="course-lesson" v-show="courseTemplate > 0">
        <div class="lesson-header">
          <span style="font-weight: bold">{{$t('CreateCourse.ScheduleLessons')}}</span>
        </div>
        <lesson-list ref="lessonList" :courseId="courseTemplate" :is-creating="true" :courseType="courseType"></lesson-list>
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

  .create-course {
    padding: 0 1em;

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
        border-top: $border;
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
  import LessonList from './LessonList.vue';
  import CourseStudents from './CourseStudents.vue';
  import CourseTeachers from './CourseTeachers.vue';
  import CoursePartners from './CoursePartners.vue';
  import CourseAudience from './CourseAudience.vue';
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';

  export default {
    components:{
      LessonList, CourseStudents, CourseAudience,CourseTeachers,CoursePartners
    },
    data() {
      return {
        loading: false,
        courseType: 0,
        courseTitle: "",
        courseStudent: 0,
        courseTemplate: 0,
        courseTemplateType: 0,
        courseTeacher: 0,
        courseLessonCount: 0,
        courseLessonCost: 0,
        courseDiscount: 0,
        courseDownloadEnable: false,
        courseDownloadCost: 0,
        courseGroupEnable: false,
        courseStudentCount: 0,
        courseStudentCost: 0,
        courseAudienceEnable: false,
        courseAudienceCost: 0,
        authorId: 0,
        authorLessonCount: 0,
        authorLessonCost: 0,
        authorCost: 0,
        allStudents: [],
        allTemplates: [],
        allTeachers: [],
        selectStudentsData: [],
        selectTeachersData: [],
        selectPartnersData: [],
        courseCohort: -1,
        courseTerm: -1,
        allCohorts: [],
        allTerms: [],
      };
    },
    computed: {
      ...mapState(["Klassroom", "KlassroomSettings"]),

      schoolId() {
        return auth.getChosenSchoolId();
      },
      folderId() {
        return -1;
      },
      isSchool() {
        return this.schoolId != auth.getCustomerID();
      },
      courseTotal () {
        return this.courseLessonCount * this.courseLessonCost;
      },
      teacherId() {
        return this.isSchool ? -1 : auth.getUserID();
      }
    },
    watch: {
      courseCohort(to, from) {
        this.$nextTick(() => {this.readTemplates()});
      },
      // courseTerm(to, from) {
      //   this.$nextTick(() => {this.readTemplates()});
      // },
    },
    mounted() {
      this.$nextTick(() => {
        this.$parent.$emit("viewChanged", "courses"); //"create-course"
      });

      this.courseStudent = parseInt(this.$route.query.student);
      this.courseType = parseInt(this.$route.query.type);
      
      this.readStudents();
      this.readTeachers();
      this.readTemplates();
    },
    methods: {
      getPartnersData(val){
        if(val){
          let result=val;
          let arryHelp=[];
          for(let i=0;i<result.length;i++){
            arryHelp.push({"MemberID":result[i].MemberID, "Role":result[i].Role})
          }
          this.selectPartnersData=arryHelp;
        }
      },
      getTeachersData(val){
        if(val){
          let result=val;
          let arryHelp=[];
          for(let i=0;i<result.length;i++){
            arryHelp.push({"MemberID":result[i].MemberID, "Role":result[i].Role})
          }
          this.selectTeachersData=arryHelp;
        }
      },
      getStudentsData(val){
        if(val){
          let result=val;
          let arryHelp=[];
          for(let i=0;i<result.length;i++){
            arryHelp.push({"MemberID":result[i].MemberID, "Role":result[i].Role})
          }
          this.selectStudentsData=arryHelp;
        }
      },
      readStudents: function () {
        let self = this;
        // if (this.isSchool) {
        let url = GetAPIUrl() + "SchoolContact/List?schoolID=" + this.schoolId + "&roleType=" + auth.SchoolRole.Students + "&pageIndex=-1";
        this._getData(url, null, (data) => {
          self.allStudents = self.initializeUsers1(data);
        }, null);
        // }
        // else {
        //   friends.getFriends(function (users) {
        //     self.allStudents = self.initializeUsers2(users);
        //   });
        // }
      },
      readTeachers: function () {
        let self = this;
        // if (this.isSchool) {
        let url = GetAPIUrl() + "SchoolContact/List?schoolID=" + this.schoolId + "&roleType=" + auth.SchoolRole.Teachers + "&pageIndex=-1";
        this._getData(url, null, (data) => {
          let role=auth.getRole();
          if(!self.isSchool && role=="1"){
            data.unshift({"UserID":auth.getUserID(),"UserName":auth.getUserName()});
          }
          self.allTeachers = self.initializeUsers1(data);
        }, null);
        // }
        // else {
        //   friends.getFriends(function (users) {
        //     self.allTeachers = self.initializeUsers2(users);
        //   });
        // }
      },
      initializeUsers1(data) {
        let list = [];
        for (let i = 0, count = data.length; i < count; i++) {
          let user = data[i];
          let item = {
            id: user.UserID,
            avatar: user.AvatarUrl,
            name: user.UserName,
            gender: user.Sex === 2 ? 'Female' : 'Male',
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
            gender: user.Sex === 2 ? 'Female' : 'Male',
            phone: user.Phone,
            email: user.Email,
            detail: user
          };

          list.push(item);
        }
        return list;
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
        url += "&sortBy=0";
        url += "&order=1";
        url += "&pageIndex=-1";
        url += "&pageSize=100";
        this._getData(url, null, (data) => {
          self.allTemplates = data;
        }, null);
      },
      onclickPrivate() {
        this.courseType = 0;
      },
      onclickPublic() {
        this.courseType = 1;
      },
      onclickMaster(){
        this.courseType = 3;
      },
      onclickSeminar() {
        this.courseType = 2;
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
          this.courseLessonCount = template.LessonCount;
          this.courseLessonCost = template.LessonCost;
          this.courseDiscount = template.Discount;

          this.authorId = template.AuthorID;
          this.authorLessonCount = template.AuthorLessonCount;
          this.authorLessonCost = template.AuthorLessonCost;
          this.authorCost = template.AuthorCost;
        }

        this.$nextTick(function () {
          this.$refs.lessonList.clear();
          this.$refs.lessonList.refresh();
        });
      },
      onCancel() {
        this.goBackList();
      },
      onSubmit() {
        this.getStudentsData();
        this.getTeachersData();
        if (this.courseTemplate === 0) {
          alert(this.$t('CreateCourse.AlertPleaseSelectTemplate'));
          return;
        }

        if (!this.$refs.lessonList.checkData())
          return;
        let url;
        if(this.courseType == 3) {
          url = GetAPIUrl() + "Course/CreateMasterCourse";
        } else {
          url = GetAPIUrl() + "Course/CreateCourse";
        }

        let school = this.isSchool ? this.schoolId : parseInt(auth.getCustomerID());
        let teacher =this.courseTeacher;
        let student = 0;
        let totalData;
        switch (this.courseType) {
          case 0: // private
            student = this.courseStudent;
            if(!this.courseTeacher){
              alert(this.$t('CreateCourse.AlertPleaseSelectTeacher'));
            return;
            }
            if(student==0){
              totalData = [{"MemberID":teacher,"Role":2}]
            }else{
              totalData = [{"MemberID":student,"Role":1},{"MemberID":teacher,"Role":2}]
            }
            break;
          case 3: // Master
              totalData = this.selectPartnersData;
              if(totalData.length==0){
                alert(this.$t('CreateCourse.AlertPleaseSelectLeastOneTeacher'));
                return;
              }
            break;
          default:
              totalData = this.selectStudentsData.concat(this.selectTeachersData);
              if(totalData.length==0){
                alert(this.$t('CreateCourse.AlertPleaseSelectLeastOneTeacher'));
                return;
              }
            break;
        }
        let data={};
        if(this.courseType==3){
          data = {
            "CourseMembers":totalData,
            "IsTemplate": 0,
            "Title": this.courseTitle,
            "TemplateID": this.courseTemplate,
            "TemplateType": this.courseTemplateType,
            "SubSchoolTeachers": [{"SchoolID":school,"TeacherID":auth.getUserID()}],//测试调用
            "SchoolID": school,
            "FolderID": this.folderId,
            "Type": this.courseType,
            "LessonCount": parseInt(this.courseLessonCount),
            "LessonCost": parseFloat(this.courseLessonCost),
            "Discount": parseFloat(this.courseDiscount),
            "Cost": this.courseTotal,
            "EnableSelfLearning": this.courseDownloadEnable ? 1 : 0,
            "SelfLearningPrice": parseFloat(this.courseDownloadCost),
            "EnableAdditionalStudent":this.courseGroupEnable ? 1 : 0,
            "AdditionalStudentSeat": parseInt(this.courseStudentCount),
            "AdditionalStudentPrice": parseFloat(this.courseStudentCost),
            "EnableBroadcast": this.courseAudienceEnable ? 1 : 0,
            "LiveBroadcastPrice": parseFloat(this.courseAudienceCost),
            "AuthorLessonCount": this.authorLessonCount,
            "AuthorLessonCost": this.authorLessonCost,
            "AuthorCost": this.authorCost,
          };
        }else{
          data = {
            "CourseMembers":totalData,
            "IsTemplate": 0,
            "Title": this.courseTitle,
            "TemplateID": this.courseTemplate,
            "TemplateType": this.courseTemplateType,
            // "TeacherID": teacher,
            // "StudentID": student,
            "SchoolID": school,
            "FolderID": this.folderId,
            "Type": this.courseType,
            "LessonCount": parseInt(this.courseLessonCount),
            "LessonCost": parseFloat(this.courseLessonCost),
            "Discount": parseFloat(this.courseDiscount),
            "Cost": this.courseTotal,
            "EnableSelfLearning": this.courseDownloadEnable ? 1 : 0,
            "SelfLearningPrice": parseFloat(this.courseDownloadCost),
            "EnableAdditionalStudent":this.courseGroupEnable ? 1 : 0,
            "AdditionalStudentSeat": parseInt(this.courseStudentCount),
            "AdditionalStudentPrice": parseFloat(this.courseStudentCost),
            "EnableBroadcast": this.courseAudienceEnable ? 1 : 0,
            "LiveBroadcastPrice": parseFloat(this.courseAudienceCost),
            "AuthorLessonCount": this.authorLessonCount,
            "AuthorLessonCost": this.authorLessonCost,
            "AuthorCost": this.authorCost,
            "CohortID": this.courseCohort,
            "SemesterID": this.courseTerm,
          };
        }

        let self = this;

        this.changeCreateCourseFlag("before");
        this._postData(url, data, null, (result) => {
          let data = result;
          let courseId = data.Course.CourseID;
          let lectureRelation = data.LectureRelation;
          self.$refs.lessonList.saveData(courseId, lectureRelation,totalData ,self.goBackList);
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
