<template>
  <div class="create-lesson">
    <div class="header">
      {{$t('AddLesson.NewLesson')}}
    </div>
    <div class="content">
      <div class="lesson-type">
        <div class="type-label">{{$t('AddLesson.SelectlessonType')}}</div>
        <div class="type-buttons">
          <Button :type="lessonType === 0 ? 'info' : 'dashed'" size="large" @click="onclickPrivate" style="margin:0px 20px 20px 0px">
            <span :class="lessonType === 0 ? 'type-image private-white' : 'type-image private-gray'"></span>
            {{$t('CreateCourse.OneOnOne')}}
            <Icon type="checkmark-circled" color="red" size="20" v-show="lessonType === 0"></Icon>
          </Button>
          <Button :type="lessonType === 2 ? 'info' : 'dashed'" size="large" @click="onclickSeminar" style="margin:0px 20px 20px 0px">
            <span :class="lessonType === 2 ? 'type-image seminar-white' : 'type-image seminar-gray'"></span>
            {{$t('CreateCourse.OneToMany')}}
            <Icon type="checkmark-circled" color="red" size="20" v-show="lessonType === 2"></Icon>
          </Button>
          <Button :type="lessonType === 1 ? 'info' : 'dashed'" size="large" @click="onclickPublic" style="margin:0px 20px 20px 0px">
            <span :class="lessonType === 1 ? 'type-image public-white' : 'type-image public-gray'"></span>
            {{$t('AddLesson.PubliLesson')}}
            <Icon type="checkmark-circled" color="red" size="20" v-show="lessonType === 1"></Icon>
          </Button>
          <!-- <Button :type="lessonType === 3? 'info' : 'dashed'" size="large" @click="onclickMaster" style="margin:0px 0px 20px 0px">
            <span :class="lessonType ===3 ? 'type-image master-white' : 'type-image master-gray'"></span>
            {{$t('AddLesson.MasterLesson')}}
            <Icon type="checkmark-circled" color="red" size="20" v-show="lessonType === 3"></Icon>
          </Button> -->
        </div>
      </div>
      <div class="lesson-base-info">
        <table class="lesson-content">
          <tr v-show="lessonType === 0">
            <td>
              {{$t('AddLesson.Student')}}
            </td>
            <td>
              <Select v-model="lessonStudent" style="width: 100%" :placeholder="$t('AddLesson.PlaceholderPleaseSelectStudent')" @on-change="onStudentChanged" filterable>
                <Option v-for="student in allStudents" :value="student.id" :key="student.id">{{ student.name }}</Option>
              </Select>
            </td>
            <td>
            </td>
          </tr>
          <tr v-show="lessonType === 2">
            <td>
              {{$t('AddLesson.Students')}}
            </td>
            <td>
              <Select v-model="lessonStudents" style="width: 100%" :placeholder="$t('AddLesson.PlaceholderPleaseSelectStudents')" @on-change="onStudentsChanged" filterable multiple>
                <Option v-for="student in allStudents" :value="student.id" :key="student.id">{{ student.name }}</Option>
              </Select>
            </td>
            <td>
            </td>
          </tr>
          <tr v-show="lessonType === 1 || lessonStudent > 0 || lessonStudents.length > 0||lessonType === 3">
            <td>
              {{$t('AddLesson.SelectCourseThatStudentPurchased')}}
            </td>
            <td>
              <Select v-model="lessonCourse" ref="selectCourse" style="width: 100%" :placeholder="$t('CreateCourse.PlaceholderSelectTemplate')" @on-change="onCourseChanged(lessonCourse)">
                <Option v-for="course in allCourses" :value="course.CourseID" :key="course.CourseID">{{ course.Title }}</Option>
              </Select>
            </td>
            <td>
            </td>
          </tr>
        </table>
      </div>
      <div class="course-info" v-if="lessonCourse > 0">
        <ul class="course-info-box">
          <li>{{$t('AddLesson.DatePurchased')}}: 10/10/2017</li>
          <li>{{$t('CreateCourse.Price')}}: ${{ lessonCourseInfo.lessonCost }}</li>
          <li>{{$t('AddLesson.ZeroOf')}} {{ lessonCourseInfo.lessonCount }} {{$t('AddLesson.LessonsFinished')}}</li>
          <li>{{$t('AddLesson.AdditionalStudents')}}: {{ lessonCourseInfo.groupEnable ? $t('AddLesson.Enable'): $t('AddLesson.Disabled') }}</li>
          <li>{{$t('AddLesson.LiveLessonBroadcast')}}: {{ lessonCourseInfo.audienceEnable ? $t('AddLesson.Enable'): $t('AddLesson.Disabled') }}</li>
          <li>{{$t('AddLesson.Teacher')}}: {{ lessonCourseInfo.teacher }}</li>
          <li>{{$t('AddLesson.School')}}: {{ lessonCourseInfo.school }}</li>
        </ul>
      </div>
      <div class="course-create" v-else-if="lessonCourse < 0">
        <div class="course-create-box">
          <table class="course-content">
            <tr>
              <td>
                {{$t('CreateCourse.CourseTemplate')}}
              </td>
              <td>
                <Select v-model="createCourse.template" style="width: 100%" :placeholder="$t('CreateCourse.PlaceholderSelectTemplate')" @on-change="onTemplateChanged" filterable>
                  <Option v-for="template in allTemplates" :value="template.CourseID" :key="template.CourseID">{{ template.Title }}</Option>
                </Select>
              </td>
              <td>
              </td>
            </tr>
            <tr v-show="isSchool && createCourse.template > 0">
              <td>
                {{$t('AddLesson.Teacher')}}
              </td>
              <td>
                <Select v-model="createCourse.teacher" style="width: 100%" :placeholder="$t('CreateCourse.PlaceholderPleaseSelectTeacher')" filterable>
                  <Option v-for="teacher in allTeachers" :value="teacher.id" :key="teacher.id">{{ teacher.name }}</Option>
                </Select>
              </td>
              <td>
              </td>
            </tr>

            <tr>
              <td colspan="3"></td>
            </tr>
            <tr v-show="createCourse.template > 0">
              <td>
                {{$t('CreateCourse.EstinatedLessons')}}
              </td>
              <td>
                <Input :value="createCourse.authorLessonCount" disabled placeholder="" style="width: 100%;"></Input>
              </td>
              <td>
              </td>
            </tr>
            <tr v-show="createCourse.template > 0">
              <td>
                {{$t('CreateCourse.AuthorSuggestedLesson')}}
              </td>
              <td>
                <Input :value="createCourse.authorLessonCost" disabled placeholder="" style="width: 100%"></Input>
              </td>
              <td>
              </td>
            </tr>
            <tr v-show="createCourse.template > 0">
              <td>
                {{$t('CreateCourse.AuthorSuggestedTotal')}}
              </td>
              <td>
                <Input :value="createCourse.authorCost" placeholder="$" disabled style="width: 100%;"></Input>
              </td>
              <td>
              </td>
            </tr>

            <tr>
              <td colspan="3"></td>
            </tr>
            <tr v-show="createCourse.template > 0">
              <td>
                {{$t('CreateCourse.NoOfLessons')}}
              </td>
              <td>
                <Input v-model="createCourse.lessonCount" placeholder="" style="width: 100%"></Input>
              </td>
              <td>
              </td>
            </tr>
            <tr v-show="createCourse.template > 0">
              <td>
                {{$t('CreateCourse.CostperLesson')}}
              </td>
              <td>
                <Input v-model="createCourse.lessonCost" placeholder="" style="width: 100%"></Input>
              </td>
              <td>
              </td>
            </tr>
            <tr v-show="createCourse.template > 0">
              <td style="color: red;">
                {{$t('CreateCourse.Total')}}
              </td>
              <td>
                <Input :value="createCourse.costTotal" placeholder="$" disabled style="width: 100%;"></Input>
              </td>
              <td>
              </td>
            </tr>

            <tr>
              <td></td>
              <td style="text-align: right;">
                <Button type="primary" shape="circle" @click="handleCreateCourse" :disabled="createCourse.template <= 0" :loading="creatingCourse">{{$t('AddLesson.CreateCourse')}}</Button>
              </td>
              <td></td>
            </tr>
          </table>
        </div>
      </div>
      <div class="lesson-group" v-show="false && lessonCourse > 0">
        <div class="group-enable">
          <Checkbox v-if="lessonType === 0" v-model="lessonCourseInfo.groupEnable" disabled size="large">{{$t('AddLesson.EnableAdditionalStudents')}}</Checkbox>
          <span v-else style="font-weight: bold">{{$t('AddLesson.Students')}}</span>
        </div>
        <div v-show="lessonCourseInfo.groupEnable || lessonType === 1">
          <table class="lesson-content">
            <tr>
              <td>
                {{$t('AddLesson.NoOfSeats')}}
              </td>
              <td>
                <Input v-model="lessonCourseInfo.studentCount" disabled placeholder="" style="width: 100%"></Input>
              </td>
              <td>
              </td>
            </tr>
            <tr v-show="lessonType === 0">
              <td>
                {{$t('CreateCourse.Price')}}
              </td>
              <td>
                <Input v-model="lessonCourseInfo.studentCost" disabled placeholder="" style="width: 100%"></Input>
              </td>
              <td>
              </td>
            </tr>
          </table>

          <course-students :headerLabel="lessonType === 0 ?$t('AddLesson.AdditionalStudents'): ''"></course-students>
        </div>
      </div>
      <div class="lesson-attendee" v-show="false && lessonCourse > 0">
        <div class="attendee-enable">
          <Checkbox v-if="lessonType === 0" v-model="lessonCourseInfo.audienceEnable" disabled size="large">{{$t('CreateCourse.EnableLessonTime')}}</Checkbox>
          <span v-else style="font-weight: bold">{{$t('CreateCourse.Audience')}}</span>
        </div>
        <div v-show="lessonCourseInfo.audienceEnable || lessonType === 1">
          <table class="lesson-content">
            <tr>
              <td>
                {{$t('CreateCourse.Price')}}
              </td>
              <td>
                <Input v-model="lessonCourseInfo.audienceCost" disabled placeholder="" style="width: 100%"></Input>
              </td>
              <td>
              </td>
            </tr>
          </table>

          <course-audience :headerLabel="lessonType === 0 ? $t('CreateCourse.Audience') : ''"></course-audience>
        </div>
      </div>
      <div class="lesson-lesson" v-show="lessonCourse > 0">
        <div class="lesson-header">
          <span style="font-weight: bold">{{$t('CreateCourse.ScheduleLessons')}}</span>
          <Button type="text" style="float: right; color: #0061BB">{{$t('AddLesson.ShowCompletedLessons')}}</Button>
        </div>
        <lesson-list ref="lessonList" :course-id="lessonCourse" :course-type="lessonType"></lesson-list>
      </div>
    </div>
    <div class="footer">
      <Button shape="circle" size="large" type="primary" @click="onSubmit" :disabled="lessonCourse <= 0" :loading="loading">{{$t('CreateCourse.Submit')}}</Button>
      <Button shape="circle" size="large" style="margin-left:100px;" @click="onCancel">{{$t('Base.Cancel')}}</Button>
    </div>
  </div>
</template>

<style lang="scss">
  $images-root: "../../../static/images/";

  .create-lesson {
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

      .lesson-type {
        padding: $padding;

        .type-label {
          color: #0061BB;
          font-size: 16px;
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

      .lesson-content {
        width: 100%;

        td:first-of-type {
          width: 300px;
          height: 3em;
          text-align: right;
          padding-right: 2em;
        }
        td:last-of-type {
          width: 20%;
        }
      }

      .lesson-base-info {
        border-top: $border;
        padding: $padding;
      }

      .lesson-download {
        //border-bottom: $border;
        //padding: $padding;
        padding-bottom: 10px;
      }

      .lesson-group {
        border-top: $border;
        padding: $padding;
      }

      .lesson-attendee {
        border-top: $border;
        padding: $padding;
      }

      .lesson-lesson {
        border-top: $border;
        padding: $padding;
      }

      .course-info {
        padding: 0 25% 1em;

        .course-info-box{
          border: 1px solid #dddee1;
          border-radius: 5px;
          background: #f5f5f5;
          padding: 10px;
          list-style-type: none;
        }
      }

      .course-create {
        padding: 0 10% 1em;

        .course-create-box{
          border: 1px solid #dddee1;
          border-radius: 5px;
          background: #f5f5f5;
          padding: 10px;

          .course-content {
            width: 100%;

            td:first-of-type {
              width: 35%;
              height: 3em;
              text-align: right;
              padding-right: 2em;
            }
            td:last-of-type {
              width: 15%;
            }
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
</style>

<script>
  import auth from '../../authenticator';
  import friends from '../../friends';
  import LessonList from './LessonList.vue';
  import CourseStudents from './CourseStudents.vue';
  import CourseAudience from './CourseAudience.vue';

  export default {
    components:{
      LessonList, CourseStudents, CourseAudience
    },
    data() {
      return {
        loading: false,
        lessonType: 0,
        lessonStudent: 0,
        lessonStudents: [],
        lessonCourse: 0,
        lessonTeacher: [],
        lessonCourseInfo: {
          groupEnable: false,
          studentCount: 0,
          studentCost: 0,
          audienceEnable: false,
          audienceCost: 0,
          lessonCount: 0,
          lessonCost: 0,
          teacher: '',
          school: ''
        },
        allStudents: [],
        allCourses: [],
        createCourse: {
          template: 0,
          templateType: 0,
          title: '',
          lessonCount: 0,
          lessonCost: 0,
          lessonSubTotal: 0,
          discount: 0,
          costTotal: 0,
          downloadEnable: false,
          downloadCost: 0,
          groupEnable: false,
          studentCount: 0,
          studentCost: 0,
          audienceEnable: false,
          audienceCost: 0,
          authorId: 0,
          authorLessonCount: 0,
          authorLessonCost: 0,
          authorCost: 0,
        },
        creatingCourse: false,
        allTemplates: [],
        allTeachers: []
      };
    },
    computed: {
      schoolId() {
        return auth.getChosenSchoolId();;
      },
      isSchool() {
        return this.schoolId != auth.getCustomerID();
      },
      teacherId() {
        return this.isSchool ? -1 : auth.getUserID();
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.$parent.$emit("viewChanged", "schedule"); //"create-course"
      });

      this.readStudents();
    },
    watch: {
      createCourse: {
        handler (val) {
          val.costTotal = val.lessonCount * val.lessonCost;
        },
        deep: true
      },
      allCourses:{
        handler (val) {
          this.allCourses=val;
        },
        deep: true//深度观察
      }
    },
    methods: {
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
      readCourses: function (selectedCourse) {
        let self = this;

        this.lessonCourseInfo = {
          groupEnable: false,
          studentCount: 0,
          studentCost: 0,
          audienceEnable: false,
          audienceCost: 0,
          lessonCount: 0,
          lessonCost: 0,
          teacher: '',
          school: ''
        };

        if (this.lessonType === 0 && !this.lessonStudent) {
          this.allCourses = [];
          this.$refs.lessonList.clear();
          return;
        }

        let filter = '&courseType=' + this.lessonType;
        if (this.lessonType === 0)
          filter += "&StudentID=" + this.lessonStudent;

        if (this.isSchool)
          filter += '&SchoolID=' + this.schoolId;
        else
          filter += '&TeacherID=' + this.teacherId;

        let url = GetAPIUrl() + "Course/List?listType=2" + filter;
        url += "&sortBy=0";
        url += "&order=1";
        url += "&pageIndex=-1";
        url += "&pageSize=100";

        self.$refs.selectCourse.setQuery('');
        self.lessonCourse = 0;
        this._getData(url, null, (data) => {
          let courses = data;
          if (self.lessonType === 0) {
            let course = {
              CourseID: -1,
              Title: self.$t("AddLesson.PurchaseNewCourse"),
            };
            courses.splice(0, 0, course);
          }
          self.allCourses = courses;
          self.$nextTick(() => {
            if (selectedCourse) {
              self.lessonCourse = selectedCourse;
              self.onCourseChanged(selectedCourse);
            }
          });
        }, null);
      },
      readTemplates: function () {
        let self = this;

        self.$Loading.start();
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
        this.lessonType = 0;
        this.readCourses();
      },
      onclickPublic() {
        this.lessonType = 1;
        this.readCourses();
      },
      onclickSeminar() {
        this.lessonType = 2;
        this.readCourses();
      },
      onclickMaster(){
        this.lessonType = 3;
        this.readCourses();
      },
      onStudentChanged() {
        this.$nextTick(function () {
          this.readCourses();
        });
      },
      onStudentsChanged() {
        this.$nextTick(function () {
          this.readCourses();
        });
      },
      onCourseChanged(courseId) {
        if(courseId){
          if (parseInt(courseId) <= 0) {
              if (this.allTemplates.length === 0) {
                this.readTemplates();
                this.readTeachers();
              }
              return;
          }
          let course = null;
          for (let i = 0; i < this.allCourses.length; i++) {
            if (this.allCourses[i].CourseID === courseId) {
              course = this.allCourses[i];
              break;
            }
          }
          //获取course的老师信息
          let url=GetAPIUrl()+"Course/Item?courseID="+courseId;
          let self=this;
          this._getData(url, null, (data) => {
            let memberInfoListArry=data.MemberInfoList;
            let strNames="";
            let arryHelp=[];
            for(let item of memberInfoListArry){
              if(item.Role==2){
                arryHelp.push({"MemberID":item.MemberID,"Role":2})
                strNames+=item.MemberName+","
              }
            }
            strNames=strNames.substring(0,strNames.length-1);
            self.lessonTeacher = arryHelp;
            self.lessonCourseInfo.teacher=strNames;
          }, null);
          if (course) {
            this.lessonCourseInfo.groupEnable = course.EnableAdditionalStudent === 1;
            this.lessonCourseInfo.studentCount = course.AdditionalStudentSeat;
            this.lessonCourseInfo.studentCost = course.AdditionalStudentPrice;
            this.lessonCourseInfo.audienceEnable = course.EnableBroadcast === 1;
            this.lessonCourseInfo.audienceCost = course.LiveBroadcastPrice;
            this.lessonCourseInfo.lessonCount = course.LessonCount;
            this.lessonCourseInfo.lessonCost = course.LessonCost;
            this.lessonCourseInfo.school = course.SchoolName;
          }
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
        if (!this.$refs.lessonList.checkData())
          return;
        let totalData=[];
        if(this.lessonType===0){
          totalData=[{"MemberID":this.lessonStudent,"Role":1}].concat(this.lessonTeacher)
        }else if(this.lessonType===2){
          for(let i=0;i<this.lessonStudents.length;i++){
            totalData.push({"MemberID":this.lessonStudents[i],"Role":1});
          }
          totalData=totalData.concat(this.lessonTeacher);
        }else{
          totalData=this.lessonTeacher;
        }
        this.$refs.lessonList.saveData(-1, [], totalData, this.goBackList);
      },
      goBackList(){
        this.$router.back();//this.$router.push({name: 'schedule'});
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
          this.createCourse.title = template.Title;
          this.createCourse.courseTemplateType = template.TemplateType;
          this.createCourse.lessonCount = template.LessonCount;
          this.createCourse.lessonCost = template.LessonCost;
          this.createCourse.discount = template.Discount;

          this.createCourse.authorId = template.AuthorID;
          this.createCourse.authorLessonCount = template.AuthorLessonCount;
          this.createCourse.authorLessonCost = template.AuthorLessonCost;
          this.createCourse.authorCost = template.AuthorCost;
        }
      },
      handleCreateCourse: function () {
        if (this.createCourse.template === 0) {
          alert(this.$t('CreateCourse.AlertPleaseSelectTemplate'));
          return;
        }

        let url = GetAPIUrl() + "Course/CreateCourse";
        let totalData=[{"MemberID":this.isSchool ? this.createCourse.teacher : this.teacherId, "Role":2}];
        if(this.lessonStudent){
          totalData.push({"MemberID": this.lessonStudent, "Role":1})
        }
        //Role枚举：Student = 1,Teacher = 2
        let data = {
          "CourseMembers":totalData,
          "IsTemplate": 0,
          "Title": this.createCourse.title,
          "TemplateID": this.createCourse.template,
          "TemplateType": this.createCourse.courseTemplateType,
          // "TeacherID": this.isSchool ? this.createCourse.teacher : this.teacherId,
          // "StudentID": this.lessonStudent ? this.lessonStudent : 0,
          "SchoolID": this.isSchool ? this.schoolId : 0,
          "Type": this.lessonType,
          "LessonCount": parseInt(this.createCourse.lessonCount),
          "LessonCost": parseFloat(this.createCourse.lessonCost),
          "Discount": parseFloat(this.createCourse.discount),
          "Cost": parseFloat(this.createCourse.costTotal),
          "EnableSelfLearning": this.createCourse.downloadEnable ? 1 : 0,
          "SelfLearningPrice": parseFloat(this.createCourse.downloadCost),
          "EnableAdditionalStudent":this.createCourse.groupEnable ? 1 : 0,
          "AdditionalStudentSeat": parseInt(this.createCourse.studentCount),
          "AdditionalStudentPrice": parseFloat(this.createCourse.studentCost),
          "EnableBroadcast": this.createCourse.audienceEnable ? 1 : 0,
          "LiveBroadcastPrice": parseFloat(this.createCourse.audienceCost),
          "AuthorLessonCount": this.createCourse.authorLessonCount,
          "AuthorLessonCost": this.createCourse.authorLessonCost,
          "AuthorCost": this.createCourse.authorCost,
        };

        let self = this;

        this._postData(url, data, () => {
          self.creatingCourse = true;
        }, (result) => {
          self.creatingCourse = false;
          self.$Message.success(self.$t('AddLesson.AlertCourseHasCreated'));

          self.readCourses(result.Course.CourseID);
        }, (error) => {
          self.creatingCourse = false;
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
    }
  }
</script>
