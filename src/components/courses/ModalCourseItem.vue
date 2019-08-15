<template>
  <div class="klassroom-course-moal-view-body">
    <div class="course-item">
      <div class="header">
        {{courseBase.title}}&nbsp;
        <div style="float:right;">
          <Button v-if="isCreating" type="primary" @click="handleSave" style="font-size:14px" :disabled="!courseBase.title" :loading="loading">{{$t('CreateCourse.Submit')}}</Button>
          <Button v-else type="primary" @click="handleSave" style="font-size:14px" :disabled="!courseBase.title" :loading="loading">{{$t('Base.Save')}}</Button>
          <Button v-if="isCreating" @click="handleCancel" style="font-size:14px;">{{$t('Base.Cancel')}}</Button>
          <Button v-else @click="handleCancel" style="font-size:14px;">{{$t('Base.Cancel')}}</Button>

          <!-- <div v-if="!isCreating" style="display: inline-block; margin-left: 1.5em; margin-right: 0.5em;">
            <Dropdown placement="bottom-end" @on-click="handleMoreAction">
              <a href="javascript:void(null);">
                <Icon type="more" size="24"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="copy" disabled><Icon type="ios-copy-outline" size="16"></Icon><span style="margin-left: 1em;">{{$t('CourseItem.Copy')}}</span></DropdownItem>
                <DropdownItem name="print" disabled><Icon type="ios-printer-outline" size="16"></Icon><span style="margin-left: 1em;">{{$t('CourseItem.Print')}}</span></DropdownItem>
                <DropdownItem name="delete" :disabled="!canDelete"><Icon type="ios-trash-outline" size="16"></Icon><span style="margin-left: 1em;">{{$t('Common.Delete')}}</span></DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div> -->
        </div>
      </div>
      <div class="flex-content">
        <div class="fixed-left">
          <Menu class="course-menu" theme="light" ref="chooseMenu" :active-name="chooseMenu" @on-select="menuSelected">
            <MenuItem name="property">
              <table>
                <tr>
                  <td>
                    <Icon type="information-circled" size="18"></Icon>
                  </td>
                  <td>
                    {{$t("CourseItem.CourseProperty")}}
                  </td>
                  <td>
                    <Icon type="chevron-right" size="16"></Icon>
                  </td>
                </tr>
              </table>
            </MenuItem>
            <MenuItem name="description">
              <table>
                <tr>
                  <td>
                    <Icon type="document-text" size="18"></Icon>
                  </td>
                  <td>
                    {{$t("CourseItem.Description")}}
                  </td>
                  <td>
                    <Icon type="chevron-right" size="16"></Icon>
                  </td>
                </tr>
              </table>
            </MenuItem>
            <MenuItem name="lectures" v-show="!isCreating">
              <table>
                <tr>
                  <td>
                    <Icon type="bookmark" size="18"></Icon>
                  </td>
                  <td>
                    {{$t("CourseItem.Lectures")}}
                  </td>
                  <td>
                    <Icon type="chevron-right" size="16"></Icon>
                  </td>
                </tr>
              </table>
            </MenuItem>
            <MenuItem name="samplevideos" v-show="!isCreating && isTemplate">
              <table>
                <tr>
                  <td>
                    <Icon type="ios-videocam" size="18"></Icon>
                  </td>
                  <td>
                    {{$t("CourseItem.RecordedSamples")}}
                  </td>
                  <td>
                    <Icon type="chevron-right" size="16"></Icon>
                  </td>
                </tr>
              </table>
            </MenuItem>
            <MenuItem name="assignments" v-show="!isCreating">
              <table>
                <tr>
                  <td>
                    <Icon type="clipboard" size="18"></Icon>
                  </td>
                  <td>
                    {{$t("CourseItem.Assignments")}}
                  </td>
                  <td>
                    <Icon type="chevron-right" size="16"></Icon>
                  </td>
                </tr>
              </table>
            </MenuItem>
            <MenuItem name="lessons" v-show="!isCreating && !isTemplate">
              <table>
                <tr>
                  <td>
                    <Icon type="calendar" size="18"></Icon>
                  </td>
                  <td>
                    {{$t("CourseItem.ScheduleLessons")}} 
                  </td>
                  <td>
                    <Icon type="chevron-right" size="16"></Icon>
                  </td>
                </tr>
              </table>
            </MenuItem>
            <MenuItem name="people" v-show="!isCreating && !isTemplate">
              <table>
                <tr>
                  <td>
                    <Icon type="ios-people" size="18"></Icon>
                  </td>
                  <td>
                    {{$t("CourseItem.People")}} 
                  </td>
                  <td>
                    <Icon type="chevron-right" size="16"></Icon>
                  </td>
                </tr>
              </table>
            </MenuItem>
            <MenuItem name="preview" v-show="!isCreating && isTemplate">
              <table>
                <tr>
                  <td>
                    <Icon type="ios-world" size="18"></Icon>
                  </td>
                  <td>
                    {{$t("CourseItem.Preview")}} 
                  </td>
                  <td>
                    <Icon type="chevron-right" size="16"></Icon>
                  </td>
                </tr>
              </table>
            </MenuItem>
            <!-- 没有上传平台，先隐藏掉 -->
            <!-- <MenuItem name="publish" v-show="!isCreating && isTemplate">
              <table>
                <tr>
                  <td>
                    <Icon type="earth" size="18"></Icon>
                  </td>
                  <td>
                    Publish
                  </td>
                  <td>
                    <Icon type="chevron-right" size="16"></Icon>
                  </td>
                </tr>
              </table>
            </MenuItem> -->
          </Menu>
        </div>
        <div class="flex-right">
          <div style="padding-left: 18px; ">
            <div v-show="currentMenu === 'property'">
              <course-property ref="property" :course-id="courseId" :is-school="isSchool" :school-id="schoolId" :folder-id="folderId" :course-base="courseBase"></course-property>
            </div>
            <div v-show="currentMenu === 'description'">
              <textarea id="courseDesc"  v-model="courseBase.description" style="height:600px;" :placeholder="$t('CourseItem.someDescriptionCourse')"></textarea>
            </div>
            <div v-show="currentMenu === 'lectures'">
              <lecture-list ref="lectureList" :course-id="courseId" :school-id="schoolId"></lecture-list>
            </div>
            <div v-show="currentMenu === 'samplevideos'">
              <sample-video-list ref="sampleVideoList" :course-id="courseId" :is-school="isSchool" :school-id="schoolId"></sample-video-list>
            </div>
            <div v-show="currentMenu === 'assignments' && !showItemView">
              <assignment-list ref="assignmentList" :course-id="courseId" :isModalCourse="true"></assignment-list>
            </div>
            <div v-show="currentMenu === 'lessons'">
              <lesson-list ref="lessonList" :course-id="courseId"></lesson-list>
            </div>
            <div v-show="currentMenu === 'people'">
              <course-people ref="people" :course-id="courseId" :is-school="isSchool" :school-id="schoolId"></course-people>
            </div>
            <div v-show="currentMenu === 'preview'">
              <course-preview ref="preview" :course-id="courseId"></course-preview>
            </div>
            <!-- <div v-show="currentMenu === 'publish'">
              <course-publish ref="publish" :course-id="courseId" :is-school="isSchool"></course-publish>
            </div> -->

            <div v-show="currentMenu === 'assignments' && showItemView">
              <assignment-item ref="assignmentItem" :course-id="courseId" @on-save-remove="afterItemSaveOrRemove"></assignment-item>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$images-root: "../../../static/images/";
.klassroom-course-moal-view-body {
  width: 100%;
  height: 100%;
  padding: 1em 1.5em;
  
  .course-item {
    text-align: left;

    .header {
      font-size: 24px;
      color: #1c2438;
      border-bottom: 1px solid #dddee1;
      padding-bottom: 10px;
      margin-bottom: 10px;
      vertical-align: middle;

      $tag-height: 28px;
      $tag-half-height: 14px;

      .tag {
        margin: 0;
        padding: 0;
        display: inline;

        span {
          height: $tag-height;
          line-height: $tag-height;
          display: inline-block;
          position: relative;
          font-size: 12px;

          margin-left: 20px;
          padding: 0 10px 0 12px;
          background: #2d8cf0;
          color: #fff;
          text-decoration: none;
          border-bottom-right-radius: 4px;
          border-top-right-radius: 4px;
        }

        span:before {
          content: "";
          float: left;
          position: absolute;
          top: 0;
          left: -$tag-half-height;
          width: 0;
          height: 0;
          border-color: transparent #2d8cf0 transparent transparent;
          border-style: solid;
          border-width: $tag-half-height $tag-half-height $tag-half-height 0;
        }

        span:after {
          content: "";
          position: absolute;
          top: $tag-half-height - 3px;
          left: 0;
          float: left;
          width: 6px;
          height: 6px;
          border-radius: 3px;
          background: #fff;
        }
      }
    }

    .course-menu {
      height: 100%;
      min-height: 300px;
    }

    .flex-content {
      display: flex;
      width: 100%;

      .fixed-left {
        flex: 0 0 240px;
      }

      .flex-right {
        flex: 200 200 500px;
        min-width: 500px;
        max-height: calc(90vh - 90px);
        overflow: auto;
      }
    }

    table {
      width: 100%;
      border-spacing: 0;
      border-collapse: collapse;
    }

    .ivu-menu-vertical .ivu-menu-item {
      padding: 6px 12px 6px 0;

      td:first-of-type {
        width: 28px;
        text-align: center;
      }
      td:last-of-type {
        width: 20px;
        text-align: center;
      }
    }

    #courseTitle {
      width: 100%;
      padding: 0.2em;
      border-radius: 0.2em;
      border: 1px solid transparent;
      color: darkblue;
      font-size: large;
    }

    #courseTitle:read-write:hover,
    #courseTitle:read-write:focus {
      border: 1px solid #80848f;
    }

    #courseDesc {
      width: 100%;
      height: 600px;
    }

    iframe {
      position: static;
    }
  }
}
</style>

<script>
import auth from "../../authenticator";
import CourseProperty from "./CourseProperty";
import LectureList from "./LectureList";
import SampleVideoList from "./SampleVideoList";
import AssignmentList from "./AssignmentList";
import AssignmentItem from "./AssignmentItem";
import LessonList from "./LessonList";
import CoursePreview from "./CoursePreview";
import CoursePublish from "./CoursePublish";
import CoursePeople from "./CoursePeople";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import util from "../../common/util.js";

export default {
  components: {
    CourseProperty,
    LectureList,
    SampleVideoList,
    AssignmentList,
    AssignmentItem,
    LessonList,
    CoursePreview,
    CoursePublish,
    CoursePeople
  },
  props:{
    homeworkCourseId:{
      type:Number,
      default:-1,
    }
  },
  data() {
    return {
      loading: false,
      schoolId: 0,
      folderId: -1,
      isSchool: false,
      courseId: 0,
      isCreating: false,
      isTemplate: false,
      templateType: 2, // 1: System, 2: Personal, 3: School
      courseBase: {
        title: "",
        description: ""
      },
      courseDetail: {},
      currentMenu: "assignments",
      showItemView: false,

      chooseMenu: 'assignments',
    };
  },
  computed: {
    ...mapState(["Klassroom"]),

    canDelete() {
      return true;
    },
    isKlassroom() {
      return IsKlassroom();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$parent.$parent.$emit("viewChanged", "businessModalCourses"); //"course-item"
    });
    util.LoadKendoFiles().then(() => {
      $("#courseDesc").kendoEditor({
        resizable: {
          content: true,
          //toolbar: true,
          min: 600
        },
        tools: [
          "formatting",
          "cleanFormatting",
          "fontName",
          "fontSize",
          "foreColor",
          "backColor",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "justifyLeft",
          "justifyCenter",
          "justifyRight",
          "justifyFull",
          "insertUnorderedList",
          "insertOrderedList",
          "indent",
          "outdent",
          "createLink",
          "unlink",
          "insertImage",
          "insertFile",
          "subscript",
          "superscript",
          "tableWizard",
          "createTable",
          "addRowAbove",
          "addRowBelow",
          "addColumnLeft",
          "addColumnRight",
          "deleteRow",
          "deleteColumn",
          "viewHtml"
        ]
      });
    });
  },
  methods: {
    initialize() {
      this.schoolId = auth.getChosenSchoolId();
      this.isSchool = auth.getCustomerID() != this.schoolId;

      this.folderId = IsKlassroom() ? this.Klassroom.currentFolder : -1;

      this.courseId = parseInt(this.homeworkCourseId);
      //this.isCreating = this.courseId < 0;
      this.isCreating = true;
      this.isTemplate = false;
      this.templateType = Math.abs(this.courseId);

      let self = this;
      self.chooseMenu = 'assignments';
      this.$nextTick(()=>{
        self.$refs.property.readData(course => {
          self.courseDetail = course;
          self.isCreating = self.courseId <= 0;
          self.isTemplate = course.IsTemplate;
        });
        self.$refs.lessonList.clear();
        
        self.menuSelected(self.chooseMenu);
      })
    },
    handleSave() {
      if (this.showItemView) {
        this.handleItemSave();
        return;
      }

      if (!this.courseBase.title) {
        alert(this.$t("CourseItem.ErrorTitleCannotEmpty"));
        return;
      }

      let self = this;
      this.$refs.property.saveData(id => {
        if (self.isCreating) {
          if (self.isSchool) {
            self.$router.push({
              name: routerPrefix() + "course-item",
              params: { courseId: id }
            });
          } else {
            self.$router.push({
              name: routerPrefix() + "course-item",
              params: { courseId: id }
            });
          }
        } else {
          self.$Message.success(
            self.$t("CourseItem.ErrorCourseInfoChangeSaved")
          );
        }
      });

      if (!this.isCreating && !this.isTemplate) {
        if (!this.$refs.lessonList.checkData()) return;

        let members = [];
        for (let i = 0; i < this.courseDetail.MemberInfoList.length; i++) {
          let member = this.courseDetail.MemberInfoList[i];
          members.push({ MemberID: member.MemberID, Role: member.Role });
        }

        this.$refs.lessonList.saveData(-1, [], members, function() {
          self.$Message.success(
            self.$t("CourseItem.ErrorCourseScheduledLessonChangeSaved")
          );
        });
      }
    },
    handleCancel() {
      if (this.showItemView) {
        this.showItemView = false;
      } else {
        this.$parent.$parent.showCourseModal  = false;
        // this.goBackList();
      }
    },
    handleRemove() {
      if (this.isCreating) {
        this.goBackList();
      } else {
        let self = this;

        this.$Modal.confirm({
          title: self.$t("CourseItem.AlertDeleteCourseTitle"),
          content: self.$t("CourseItem.AlertDeleteCourseContent"),
          okText: self.$t("Common.Delete"),
          cancelText: self.$t("Base.Cancel"),
          onOk: () => {
            let url = GetAPIUrl() + "Course/Delete?courseID=" + self.courseId;
            self._deleteData(
              url,
              null,
              result => {
                self.goBackList();
              },
              null
            );
          }
        });
      }
    },
    handleMoreAction(name) {
      switch (name) {
        case "delete":
          this.handleRemove();
          break;
      }
    },
    goBackList() {
      this.$router.push({ name: routerPrefix() + "courses" });
      //this.$router.back();
    },
    menuSelected(name) {
      this.currentMenu = name;
      this.showItemView = false;

      switch (name) {
        case "property":
          break;

        case "description":
          break;

        case "lectures":
          this.$refs.lectureList.initialize();
          break;

        case "samplevideos":
          this.$refs.sampleVideoList.initialize();
          break;

        case "assignments":
          this.$refs.assignmentList.initialize();
          break;

        case "lessons":
          this.$refs.lessonList.initialize();
          break;

        case "people":
          this.$refs.people.initialize();
          break;

        case "preview":
          this.$refs.preview.initialize();
          break;

        case "publish":
          this.$refs.publish.initialize();
          break;
      }
    },
    goAddItem() {
      this.showItemView = true;
      this.$refs.assignmentItem.readData(-1);
    },
    goEditItem(id) {
      this.showItemView = true;
      this.$refs.assignmentItem.readData(id);
    },
    handleItemSave() {
      this.$refs.assignmentItem.saveData();
    },
    afterItemSaveOrRemove() {
      this.showItemView = false;
      this.$refs.assignmentList.refresh();
    },
    _getData(url, before, success, error) {
      if (before && typeof before === "function") {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            if (success && typeof success === "function") {
              success(result.RetData);
            }

            self.loading = false;
            self.$Loading.finish();
          } else {
            // error
            if (error && typeof error === "function") {
              error(result);
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          if (error && typeof error === "function") {
            error();
          }

          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);
        }
      });
    },
    _postData(url, data, before, success, error) {
      if (before && typeof before === "function") {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        data: JSON.stringify(data),
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(resultString) {
          let result = JSON.parse(resultString);
          if (result.RetCode === 0) {
            if (success && typeof success === "function") {
              success(result.RetData);
            }

            self.loading = false;
            self.$Loading.finish();
          } else {
            // error
            if (error && typeof error === "function") {
              error(result);
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          if (error && typeof error === "function") {
            error();
          }

          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);
        }
      });
    },
    _deleteData(url, before, success, error) {
      if (before && typeof before === "function") {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: "DELETE",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            if (success && typeof success === "function") {
              success(result.RetData);
            }

            self.loading = false;
            self.$Loading.finish();
          } else {
            // error
            if (error && typeof error === "function") {
              error(result);
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          if (error && typeof error === "function") {
            error();
          }

          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);
        }
      });
    }
  }
};
</script>
