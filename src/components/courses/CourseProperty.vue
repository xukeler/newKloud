<template>
  <div class="course-property">
    <div v-if="!isKlassroom" >
      <div v-show="!isTemplate" class="course-type">
        <div class="type-label">{{$t('CourseProperty.CourseType')}}</div>
        <div class="type-buttons">
          <Button v-if="courseInfo.type === 0" type="info" size="large" style="margin-right: 60px">
            <span class="type-image private-white"></span>
            {{$t('CreateCourse.OneOnOne')}}
            <Icon type="checkmark-circled" color="red" size="20"></Icon>
          </Button>
          <Button v-else-if="courseInfo.type === 2" type="info" size="large">
            <span class="type-image seminar-white"></span>
            {{$t('CreateCourse.OneToMany')}}
            <Icon type="checkmark-circled" color="red" size="20"></Icon>
          </Button>
          <Button v-else-if="courseInfo.type === 1" type="info" size="large">
            <span class="type-image public-white"></span>
            {{$t('CreateCourse.PubliCourse')}}
            <Icon type="checkmark-circled" color="red" size="20"></Icon>
          </Button>
          <Button v-else-if="courseInfo.type === 3" type="info" size="large">
            <span class="type-image master-white"></span>
            {{$t('CreateCourse.MasterCourse')}}
            <Icon type="checkmark-circled" color="red" size="20"></Icon>
          </Button>
          <Button v-else-if="courseInfo.type === 4" type="info" size="large">
            <span class="type-image sub-white"></span>
            {{$t('CourseProperty.SubCourse')}}
            <Icon type="checkmark-circled" color="red" size="20"></Icon>
          </Button>
        </div>
      </div>
      <div class="course-group" v-show="!isCreating && isTemplate && courseInfo.templateType === 3"> <!-- School Template Share -->
        <course-teachers :is-school="isSchool" :school-id="schoolId" :course-id="courseId" header-label="Teachers who can use this template:"></course-teachers>
      </div>
      <div class="course-separator" v-show="!isTemplate"></div>
      <div class="course-group" v-show="isCreating && (courseInfo.type === 1 || courseInfo.type === 2)">
        <course-teachers :is-school="isSchool" :school-id="schoolId" :course-id="courseId"></course-teachers>
        <div style="height:1em;"></div>
        <course-students :is-school="isSchool" :school-id="schoolId" :course-id="courseId"></course-students>
      </div>
      <div class="course-group" v-show="courseInfo.type === 3 || courseInfo.type === 4">
        <course-partners :is-school="isSchool" :school-id="schoolId" :course-id="courseId"></course-partners>
      </div>
      <div class="course-separator" v-show="courseInfo.type === 1 || courseInfo.type === 2"></div>
    </div>
    <div class="course-base-info">
      <table class="course-content">
        <tr>
          <td>
            {{$t('CourseProperty.Title')}}
          </td>
          <td>
            <Input v-model="courseBase.title" placeholder="" style="width: 100%"/>
          </td>
          <td><span style="color:red;padding-left: 1em;">{{$t('Common.Required')}}</span></td>
        </tr>
        <tr v-show="!isTemplate && courseInfo.type === 0">
          <td>
            {{$t('CreateCourse.Teacher')}}
          </td>
          <td>
            <Input :value="courseInfo.teacher" disabled placeholder="" style="width: 100%"/>
          </td>
          <td></td>
        </tr>
        <tr v-show="!isTemplate && courseInfo.type === 0">
          <td>
            {{$t('CreateCourse.Student')}}
          </td>
          <td>
            <Input :value="courseInfo.student" disabled placeholder="" style="width: 100%"/>
          </td>
          <td></td>
        </tr>
        <tr>
          <td colspan="3"></td>
        </tr>

        <tr v-show="isOwn">
          <td>
            {{$t('CreateCourse.EstinatedLessons')}}
          </td>
          <td>
            <Input v-model="courseInfo.lessonCount" placeholder="" style="width: 100%;"/>
          </td>
          <td></td>
        </tr>
        <tr v-show="isOwn && !isKlassroom">
          <td>
            {{$t('CourseProperty.PricePerLesson')}}
          </td>
          <td>
            <Input v-model="courseInfo.lessonCost" placeholder="" style="width: 100%"/>
          </td>
          <td></td>
        </tr>
        <tr v-show="isOwn && !isKlassroom">
          <td>
            {{$t('CreateCourse.Total')}}
          </td>
          <td>
            <Input :value="costTotal" placeholder="$" disabled style="width: 100%;"/>
          </td>
          <td></td>
        </tr>

        <tr v-show="!isOwn">
          <td>
            {{$t('CreateCourse.EstinatedLessons')}}
          </td>
          <td>
            <Input :value="courseInfo.authorLessonCount" disabled placeholder="" style="width: 100%;"/>
          </td>
          <td></td>
        </tr>
        <tr v-show="!isOwn && !isKlassroom">
          <td>
            {{$t('CreateCourse.AuthorSuggestedLesson')}}
          </td>
          <td>
            <Input :value="courseInfo.authorLessonCost" disabled placeholder="" style="width: 100%"/>
          </td>
          <td></td>
        </tr>
        <tr v-show="!isOwn && !isKlassroom">
          <td>
            {{$t('CreateCourse.AuthorSuggestedTotal')}}
          </td>
          <td>
            <Input :value="courseInfo.authorCost" placeholder="$" disabled style="width: 100%;"/>
          </td>
          <td></td>
        </tr>

        <tr v-show="!isOwn">
          <td colspan="3"></td>
        </tr>

        <tr v-show="!isOwn">
          <td>
            {{$t('CourseProperty.YourDefaultNoOfLessons')}}
          </td>
          <td>
            <Input v-model="courseInfo.lessonCount" placeholder="" style="width: 100%;"/>
          </td>
          <td></td>
        </tr>
        <tr v-show="!isOwn && !isKlassroom">
          <td>
            {{$t('CourseProperty.YourPricePerLesson')}}
          </td>
          <td>
            <Input v-model="courseInfo.lessonCost" placeholder="" style="width: 100%"/>
          </td>
          <td></td>
        </tr>
        <tr v-show="!isOwn && !isKlassroom">
          <td>
            {{$t('CourseProperty.YourTotal')}}
          </td>
          <td>
            <Input :value="costTotal" placeholder="$" disabled style="width: 100%;"/>
          </td>
          <td></td>
        </tr>

        <tr>
          <td colspan="3"></td>
        </tr>
        <tr v-show="isTemplate && !isKlassroom">
          <td>
            {{$t('CourseProperty.Level')}}
          </td>
          <td>
            <Input v-model="courseInfo.level" :placeholder="$t('CourseProperty.PlaceholderSomethingLikeHighSchool')" style="width: 100%"/>
          </td>
          <td></td>
        </tr>
        <tr v-show="isTemplate && !isKlassroom">
          <td>
            {{$t('CourseProperty.Language')}}
          </td>
          <td>
            <Input v-model="courseInfo.language" :placeholder="$t('CourseProperty.PlaceholderLanguage')" style="width: 100%"/>
          </td>
          <td></td>
        </tr>
      </table>
    </div>
    <div v-show="isTemplate === 0 && !isKlassroom">
      <div class="course-download">
        <div class="download-enable">
          <Checkbox v-model="courseInfo.downloadEnable" size="large">{{$t('CreateCourse.AllowStuSelfLearning')}}</Checkbox>
        </div>
        <div v-show="courseInfo.downloadEnable">
          <table class="course-content">
            <tr>
              <td>
                {{$t('CreateCourse.Price')}}
              </td>
              <td>
                <Input v-model="courseInfo.downloadCost" placeholder="" style="width: 100%"/>
              </td>
              <td>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="course-separator"></div>
      <div class="course-attendee">
        <div class="attendee-enable">
          <Checkbox v-if="courseInfo.type !== 1" v-model="courseInfo.audienceEnable" size="large">{{$t('CreateCourse.EnableLessonTime')}}</Checkbox>
          <span v-else style="font-weight: bold">{{$t('CreateCourse.Audience')}}</span>
        </div>
        <div v-show="courseInfo.audienceEnable || courseInfo.type === 1">
          <table class="course-content">
            <tr>
              <td>
                {{$t('CreateCourse.Price')}}
              </td>
              <td>
                <Input v-model="courseInfo.audienceCost" placeholder="" style="width: 100%"/>
              </td>
              <td>
              </td>
            </tr>
          </table>

          <course-audience :headerLabel="courseInfo.type === 0 ? $t('CreateCourse.Audience') : ''"></course-audience>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  $images-root: "../../../static/images/";

  .course-property {
    padding: 10px;
    padding-top: 0;

    $padding: 10px 0;
    $border: 1px dashed #dddee1;

    .course-separator {
      border-top: $border;
    }

    .course-type {
      padding: $padding;

      .type-label {
        color: #0061BB;
        font-size: 16px;
        padding-bottom: 10px;
      }

      .type-buttons {
        padding-bottom: 10px;

        button {
          font-size: 20px;
          padding-left: 75px;
          padding-right: 1.5em;
          line-height: 1.6em;
          position: relative;
        }

        .type-image {
          display: inline-block;
          width: 28px;
          height: 28px;
          margin-right: 1em;
          position: absolute;
          left: 30px;
          top: 8px;
        }

        .private-white {
          background-image: url($images-root + 'course-private-white.svg');
          background-size: 28px 28px;
        }
        .private-gray {
          background-image: url($images-root + 'course-private-gray.svg');
          background-size: 28px 28px;
        }
        .seminar-white {
          background-image: url($images-root + 'course-seminar-white.svg');
          background-size: 28px 28px;
        }
        .seminar-gray {
          background-image: url($images-root + 'course-seminar-gray.svg');
          background-size: 28px 28px;
        }
        .public-white {
          background-image: url($images-root + 'course-public-white.svg');
          background-size: 28px 28px;
        }
        .public-gray {
          background-image: url($images-root + 'course-public-gray.svg');
          background-size: 28px 28px;
        }
        .master-white {
          background-image: url($images-root + 'course-master-white.svg');
          background-size: 28px 28px;
        }
        .master-gray {
          background-image: url($images-root + 'course-master-gray.svg');
          background-size: 28px 28px;
        }
        .sub-white {
          background-image: url($images-root + 'course-sub-white.svg');
          background-size: 28px 28px;
        }
        .sub-gray {
          background-image: url($images-root + 'course-sub-gray.svg');
          background-size: 28px 28px;
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
      padding: $padding;
    }

    .course-download {
      padding-bottom: 10px;
    }

    .course-group {
      padding: $padding;
    }

    .course-attendee {
      padding: $padding;
    }
  }
</style>

<script>
  import auth from '../../authenticator';
  import CourseStudents from './CourseStudents.vue';
  import CourseTeachers from './CourseTeachers.vue';
  import CoursePartners from './CoursePartners.vue';
  import CourseAudience from './CourseAudience.vue';

  export default {
    components: {
      CourseStudents, CourseAudience, CourseTeachers,CoursePartners
    },
    props: {
      isSchool: {
        type: Boolean,
        default: false
      },
      schoolId: {
        type: Number,
        default: -1,
      },
      folderId: {
        type: Number,
        default: -1,
      },
      courseId: Number,
      value: String,
      courseBase: Object
    },
    data() {
      return {
        initialized: false,
        loading: false,
        isTemplate: true,
        courseInfo: {id: -1, title: "", desc: "", lessonCount: 0, lessonCost: 0, discount: 0},
      };
    },
    computed: {
      isKlassroom() {
        return IsKlassroom();
      },
      isCreating() {
        return this.courseId < 0;
      },
      isOwn() {
        if (this.isCreating) {
          if (this.isTemplate) {
            return true;
          }
        }
        else {
          if (this.isTemplate) {
            return this.courseInfo.templateType === 2 || this.courseInfo.authorId === auth.getUserID();
          }
          /*else {
            return this.courseInfo.templateType === 2 || this.courseInfo.authorId === auth.getUserID();
          }*/
        }
        return false;
      },
      templateType() { // 1: System, 2: Personal, 3: School
        return Math.abs(this.courseId);
      },
      costTotal() {
        return this.courseInfo.lessonCount * this.courseInfo.lessonCost ;
      }
    },
    methods: {
      readData (callback) {
        let self = this;
        if (this.isCreating) {
          this.courseBase.title = '';
          this.courseBase.description = '';

          this.courseInfo = {
            id: -1,
            title: '',
            type: 0,
            templateType: 1,
            desc: '',
            schoolId: this.schoolId,
            school: "",
            folderId: this.folderId,
            // teacherId: auth.getUserID(),
            teacher: "",
            totalData:[{"MemberID":auth.getUserID(), "Role":2}],
            // studentId: 0,
            student: "",
            lessonCount: 0,
            lessonCost: 0,
            discount: 0,
            level: '',
            language: '',
            downloadEnable: false,
            downloadCost: 0,
            groupEnable: false,
            studentCount: 0,
            studentCost: 0,
            audienceEnable: false,
            audienceCost: 0,
            authorId: auth.getUserID(),
            authorLessonCount: 0,
            authorLessonCost: 0,
            authorCost: 0,
            lessonAmount: this.isKlassroom ? 1 : 0,
          };
        }
        else {
          let url = GetAPIUrl() + "Course/Item?courseID=" + this.courseId;
          this._getData(url, null, (data) => {
            let course = data;

            if (course) {
              let teacherName="";
              let studentName="";
              if(course.TypeID=== 0){
                for(let i=0;i<course.MemberInfoList.length;i++){
                  if(course.MemberInfoList[i].Role==1){
                    studentName=course.MemberInfoList[i].MemberName;
                  }else if(course.MemberInfoList[i].Role==2){
                    teacherName=course.MemberInfoList[i].MemberName;
                  }
                }
              }
              self.courseBase.title = course.Title;
              self.courseBase.description = course.Description;

              let arryhelp=[];
              let MemberInfoListArry=course.MemberInfoList;
              for(let item of MemberInfoListArry){
                  arryhelp.push({"MemberID":item.MemberID,"Role":item.Role});
              }
              self.courseInfo = {
                detail: course,
                id: course.CourseID,
                title: course.Title,
                type: course.TypeID,
                templateType: course.TemplateType,
                desc: course.Description,
                schoolId: course.SchoolID,
                school: course.SchoolName,
                folderId: -1,
                totalData:arryhelp,
                // teacherId: course.TeacherID,
                teacher: teacherName,
                // studentId: course.StudentID,
                student: studentName,
                lessonCount: course.LessonCount,
                lessonCost: course.LessonCost,
                discount: course.Discount,
                level: course.Level,
                language: course.Language,
                downloadEnable: course.EnableSelfLearning === 1,
                downloadCost: course.SelfLearningPrice,
                groupEnable: course.EnableAdditionalStudent === 1,
                studentCount: course.AdditionalStudentSeat,
                studentCost: course.AdditionalStudentPrice,
                audienceEnable: course.EnableBroadcast === 1,
                audienceCost: course.LiveBroadcastPrice,
                authorId: course.AuthorID,
                authorLessonCount: course.AuthorLessonCount,
                authorLessonCost: course.AuthorLessonCost,
                authorCost: course.AuthorCost,
                lessonAmount: course.LessonAmount,
              };

              self.isTemplate = course.IsTemplate;

              let editor = $("#courseDesc").data("kendoEditor");
              if (editor)
                editor.value(self.courseInfo.desc);
                
              if (callback && typeof callback === 'function')
                callback(course)
            }

          }, null);
        }
      },
      saveData (callback) {
        if (!this.courseBase.title) {
          alert(this.$t("CourseItem.ErrorTitleCannotEmpty"));
          return;
        }

        let editor = $("#courseDesc").data("kendoEditor");
        let desc = editor.value();

        let url = "";

        if (this.isCreating)
          url = GetAPIUrl() + "Course/CreateCourse";
        else
          url = GetAPIUrl() + "Course/UpdateCourse";
        //Role枚举：Student = 1,Teacher = 2
        let data = {
          "CourseMembers":this.courseInfo.totalData,
          "CourseID": this.courseId,
          "Title": this.courseBase.title,
          "Type": this.courseInfo.type,
          "Description": desc,
          "SchoolID": this.courseInfo.schoolId,
          "FolderID": this.courseInfo.folderId,
          // "TeacherID": this.courseInfo.teacherId,
          // "StudentID": this.courseInfo.studentId,
          "IsTemplate": this.isTemplate ? 1 : 0,
          "TemplateType": this.templateType,
          "LessonCount": this.courseInfo.lessonCount,
          "LessonCost": this.courseInfo.lessonCost,
          "Discount": this.courseInfo.discount,
          "Cost": this.costTotal,
          "Level": this.courseInfo.level,
          "Language": this.courseInfo.language,
          "EnableSelfLearning": this.courseInfo.downloadEnable ? 1 : 0,
          "SelfLearningPrice": this.courseInfo.downloadCost,
          "EnableAdditionalStudent":this.courseInfo.groupEnable ? 1 : 0,
          "AdditionalStudentSeat": this.courseInfo.studentCount,
          "AdditionalStudentPrice": this.courseInfo.studentCost,
          "EnableBroadcast": this.courseInfo.audienceEnable ? 1 : 0,
          "LiveBroadcastPrice": this.courseInfo.audienceCost,
          "AuthorLessonCount": this.isOwn ? this.courseInfo.lessonCount : this.courseInfo.authorLessonCount,
          "AuthorLessonCost": this.isOwn ? this.courseInfo.lessonCost : this.courseInfo.authorLessonCost,
          "AuthorCost": this.isOwn ? this.costTotal : this.courseInfo.authorCost,
        };

        if (this.isCreating && this.isTemplate && this.templateType === 1) {
          data.CourseMembers=[];
          data.SchoolID = 0;
          data.TeacherID = 0;
        }

        let self = this;

        this._postData(url, data, null, (result) => {
          if (callback && typeof callback === 'function') {
            let id = self.courseId;
            if (self.isCreating)
              id = result.Course.CourseID;

            callback(id);
          }
        }, null);
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
