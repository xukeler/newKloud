<template>
  <div class="klassroom-create-lesson">
    <div class="header">
      {{$t('AddLesson.NewLesson')}}
    </div>
    <div class="content">
      <div class="lesson-base-info">
        <table class="lesson-content">
          <tr>
            <td>
              Select a class
            </td>
            <td>
              <Poptip class="school-folder-tree-poptip" placement="bottom-start" width="500" style="width:100%;" v-model="showClassTree">
                <Button type="ghost" style="text-align: left; width:100%;">{{currentClassName}}</Button>
                <Tree slot="content" :data="classTreeData" :render="classTreeRender"></Tree>
              </Poptip>
            </td>
            <td>
            </td>
          </tr>
          <tr v-show="currentClassId > 0">
            <td>
              Select a course
            </td>
            <td>
              <Select v-model="lessonCourse" ref="selectCourse" style="width: 100%" placeholder="Please select a course" @on-change="onCourseChanged(lessonCourse)">
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
          <li>{{$t('AddLesson.Teacher')}}: {{ lessonTeachers }}</li>
          <li>{{$t('AddLesson.School')}}: {{ lessonSchool }}</li>
        </ul>
      </div>
      <div class="lesson-lesson" v-show="lessonCourse > 0">
        <course-lessons ref="courseLessons" :course-id="lessonCourse" :course-type="lessonType" :lesson-amount="lessonAmount"></course-lessons>
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

.klassroom-create-lesson {
  padding: 2em 3em;

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
      //border-top: $border;
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

    .school-folder-tree-poptip {
      .ivu-poptip-rel {
        width: 100%;
      }

      .ivu-tree ul li {
        margin: 0;
      }

      .class-node {
        display: inline-block;
        //width: 100%;
        line-height: 1em;
        padding: 6px 5px 2px 2px;
      }

      .class-node-selected {
        background-color: #d5e8fc;
        border-radius: 2px;
      }

      .ivu-tree-title {
        vertical-align: top;
        padding: 4px;
        margin-top:-2px;
      }

      .icon {
        font-size: 24px;
        vertical-align: middle;
      }
      .color-blue {
        color: #4a90e2;
      }
      .color-light-blue {
        color: #45c3d1;
      }
      .color-brown {
        color: #d18c45;
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
import CourseLessons from '../courses/CourseLessons';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';

export default {
  components:{
    CourseLessons
  },
  data() {
    return {
      loading: false,
      lessonType: 1, // Public
      currentClassId: 0,
      currentClassName: 'Please select a class',
      showClassTree: false,
      lessonAmount: 0,
      classTreeData: [],
      allCourses: [],
      lessonCourse: 0,
      lessonSchool: '',
      lessonTeachers: '',
      lessonMembers: [],
    };
  },
  computed: {
    ...mapState(["Klassroom"]),

    schoolId() {
      return auth.getChosenSchoolId();;
    },
    termYear() {
      return this.Klassroom.currentTerm.year;
    },
    termId() {
      return this.Klassroom.currentTerm.id;
    },
  },
  mounted() {
    //this.readCourses();
    this.readClasses();
  },
  watch: {
    allCourses:{
      handler (val) {
        this.allCourses = val;
      },
      deep: true//深度观察
    }
  },
  methods: {
    readStudents() {
      let self = this;
      let url = GetAPIUrl() + "SchoolContact/List?schoolID=" + this.schoolId + "&roleType=" + auth.SchoolRole.Students + "&pageIndex=-1";
      this._getData(url, null, (data) => {
        self.allStudents = self.initializeUsers1(data);
      }, null);
    },
    readTeachers() {
      let self = this;
      let url = GetAPIUrl() + "SchoolContact/List?schoolID=" + this.schoolId + "&roleType=" + auth.SchoolRole.Teachers + "&pageIndex=-1";
      this._getData(url, null, (data) => {
        self.allTeachers = self.initializeUsers1(data);
      }, null);
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
    readClasses() {
      let self = this;

      let url = GetAPIUrl() + "BusinessHierarchy/GetFolderTree";
      url += "?customerId=" + this.schoolId;
      url += "&termYear=" + this.termYear;

      this._getData(url, null, data => {
        self.classTreeData = self._readFolderData(data, null);
      }, null);
    },
    _readFolderData(data, parentItem) {
      let list = [];
      data.forEach(folder => {
        let item = {
          id: folder.FolderID,
          parent: parentItem, //folder.ParentFolderID,
          title: folder.FolderName,
          type: folder.FolderType,
          children: [],
          expand: true,
        };

        item.children = this._readFolderData(folder.Children, item);

        list.push(item);
      });

      return list;
    },
    classTreeRender(h, { root, node, data }) {
      return h('span', {class: 'class-node ' + (data.id == this.currentClassId ? "class-node-selected" : ""), on: {click: () => { this.onClassChanged(data) }}},
        [h('i', {class: 'icon ' + this._typeIconClass(data.type)}),
          h('span', {class:'ivu-tree-title'}, data.title)]);
    },
    _typeIconClass(type) {
      switch (type) {
        case 0: // School
          return "";
        case 1: // Campus
          return "icon-campus color-blue";
        case 2: // College
          return "icon-colledge color-light-blue";
        case 3: // Department
          return "icon-deparment color-brown";
        case 4: // Specialty
          return "icon-organization color-blue";
        case 11: // Grade
          return "icon-organization color-brown";
        case 12: // Class
          return "icon-organization color-light-blue";
        default:
          return "";
      }
    },
    onClassChanged(selected) {
      if (selected.type !== 12) {
        this.$Message.warning('Please select a class.');
      }
      else {
        this.currentClassId = selected.id;
        this.currentClassName = selected.title;
        this.showClassTree = false;

        this.readCourses();
      }
    },
    readCourses(selectedCourse) {
      let self = this;

      let url = GetAPIUrl() + "Course/List?listType=2";
      url += '&courseType=' + this.lessonType;
      url += '&schoolID=' + this.schoolId;
      url += '&semesterID=' + this.termId;
      url += '&classID=' + this.currentClassId;
      url += "&sortBy=0";
      url += "&order=1";
      url += "&pageIndex=-1";
      url += "&pageSize=100";

      self.$refs.selectCourse.setQuery('');
      self.lessonCourse = 0;
      this._getData(url, null, (data) => {
        let courses = data;
        self.allCourses = courses;
        self.$nextTick(() => {
          if (selectedCourse) {
            self.lessonCourse = selectedCourse;
            self.onCourseChanged(selectedCourse);
          }
        });
      }, null);
    },
    onCourseChanged(courseId) {
      if(courseId) {
        let course = null;
        for (let i = 0; i < this.allCourses.length; i++) {
          if (this.allCourses[i].CourseID === courseId) {
            course = this.allCourses[i];
            break;
          }
        }

        let self = this;
        let url = GetAPIUrl()+"CourseMember/List?courseID=" + courseId;
        this._getData (url, null, (data) => {
          self.lessonMembers = data;
          let strNames = "";
          for (let item of self.lessonMembers) {
            if (item.Role == 2) {
              strNames += item.MemberName + ","
            }
          }
          self.lessonTeachers = strNames;
        }, null);

        if (course) {
          this.lessonAmount = course.LessonAmount;
          this.lessonSchool = course.SchoolName;
        }
      }

      this.$nextTick(function () {
        this.$refs.courseLessons.clear();
        this.$refs.courseLessons.refresh();
      });
    },
    onCancel() {
      this.goBackList();
    },
    onSubmit() {
      if (!this.$refs.courseLessons.checkData())
        return;

      this.$refs.courseLessons.saveData(-1, [], this.lessonMembers, this.goBackList);
    },
    goBackList(){
      this.$router.back();//this.$router.push({name: 'schedule'});
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
