<template>
  <div class="course-list">
    <Tabs @on-click="tabOnClick" v-model="currentTab">
      <TabPane :label="$t('CourseList.OngoingCourses')" name="active"></TabPane>
      <TabPane :label="$t('CourseList.FinishedCourses')" name="finished" v-if="showFinished"></TabPane>
      <TabPane :label="$t('CourseList.CourseTemplates')" name="template"></TabPane>
      <TabPane :label="$t('CourseList.SystemCourseTemplateManagement')" name="sysTemplate" v-if="isSuperAdmin=='true'"></TabPane>
      <TabPane :label="$t('CourseList.SchoolFiles')" name="files"></TabPane>
    </Tabs>

    <div style="margin-top:1em;">
      <div v-show="currentTab === 'active'">
        <course-list-generic ref="listActive" :list-type="2" :is-school="isSchool" :school-id="schoolId" :is-klassroom="isKlassroom" :folder-id="folderId" :cohort-id="cohortId" :term-id="termId"></course-list-generic>
      </div>
      <div v-show="currentTab === 'finished'">
        <course-list-generic ref="listFinished" :list-type="3" :show-action="false" :is-school="isSchool" :school-id="schoolId" :is-klassroom="isKlassroom" :folder-id="folderId" :cohort-id="cohortId" :term-id="termId"></course-list-generic>
      </div>
      <div v-show="currentTab === 'template'">
        <div v-if="isSchool">
          <Collapse v-model="courseCollapseSchool" style="margin-bottom: 1.5em;">
            <Panel name="school">
              {{$t('CourseList.SchoolCourseTemplate')}}
              <div style="float: right; line-height:36px; font-weight:bold;" @click="handleClickCheckbox">
                <Checkbox v-model="showSchoolRetired">{{$t('CourseList.ShowRetiredCourses')}}</Checkbox>
              </div>
              <div slot="content">
                <course-list-generic ref="listSchool" :list-type="1" :template-type="3" :show-page="true" :is-school="isSchool" :school-id="schoolId" :is-klassroom="isKlassroom" :folder-id="folderId" :cohort-id="cohortId" :term-id="termId"></course-list-generic>
              </div>
            </Panel>
          </Collapse>

          <Collapse v-model="courseCollapseSystem" style="margin-bottom: 1.5em;">
            <Panel name="system">
              {{$t('CourseList.SystemCourseTemplate')}}
              <div style="float: right; line-height:36px; font-weight:bold;" @click="handleClickCheckbox">
                <Checkbox v-model="showSystemRetired">{{$t('CourseList.ShowRetiredCourses')}}</Checkbox>
              </div>
              <div slot="content">
                <course-list-system ref="listSystem" :is-school="isSchool" :school-id="schoolId" :is-klassroom="isKlassroom" :folder-id="folderId"></course-list-system>
              </div>
            </Panel>
          </Collapse>
        </div>
        <div v-else>
          <Collapse v-model="courseCollapseTemplate" style="margin-bottom: 1.5em;">
            <Panel name="template">
              {{$t('CourseList.MyCourseTemplates')}}
              <div style="float: right; line-height:36px; font-weight:bold;" @click="handleClickCheckbox">
                <Checkbox v-model="showTemplateRetired">{{$t('CourseList.ShowRetiredCourses')}}</Checkbox>
              </div>
              <div slot="content">
                <course-list-generic ref="listTemplate" :list-type="1" :template-type="2" :show-page="true" :is-school="isSchool" :school-id="schoolId" :is-klassroom="isKlassroom" :folder-id="folderId"></course-list-generic>
              </div>
            </Panel>
          </Collapse>

          <Collapse v-model="courseCollapseSystem" style="margin-bottom: 1.5em;">
            <Panel name="system">
              {{$t('CourseList.SystemCourseTemplate')}}
              <div style="float: right; line-height:36px; font-weight:bold;" @click="handleClickCheckbox">
                <Checkbox v-model="showSystemRetired">{{$t('CourseList.ShowRetiredCourses')}}</Checkbox>
              </div>
              <div slot="content">
                <course-list-system ref="listSystem" :is-school="isSchool" :school-id="schoolId" :is-klassroom="isKlassroom" :folder-id="folderId"></course-list-system>
              </div>
            </Panel>
          </Collapse>

          <Collapse v-model="courseCollapseSchool" v-show="withSchool" style="margin-bottom: 1.5em;">
            <Panel name="school">
              {{$t('CourseList.CourseTemplatesFromMyAssociatedSchools')}}
              <div style="float: right; line-height:36px; font-weight:bold;" @click="handleClickCheckbox">
                <Checkbox v-model="showSchoolRetired">{{$t('CourseList.ShowRetiredCourses')}}</Checkbox>
              </div>
              <div slot="content">
                <course-list-generic ref="listSchool" :list-type="1" :template-type="3" :show-page="true" :show-action="isSchool" :is-school="isSchool" :school-id="schoolId" :is-klassroom="isKlassroom" :folder-id="folderId"></course-list-generic>
              </div>
            </Panel>
          </Collapse>
        </div>
      </div>
      <div v-show="currentTab === 'sysTemplate' && isSuperAdmin==='true'">
        <system-course-template ref="systemTemplate" :is-school="isSchool" :school-id="schoolId" :is-klassroom="isKlassroom" :folder-id="folderId"></system-course-template>
      </div>
      <div v-show="currentTab === 'files'">
        <file-list ref="listFiles" :school-id="schoolId" :folder-id="folderId"></file-list>
        <!--<div v-if="isSchool">
          <Collapse v-model="fileCollapseSchool" style="margin-bottom: 1.5em;">
            <Panel name="school">
              School Files
              <div slot="content" style="padding-top:1em;">
                <file-list ref="listSchoolFiles" :school-id="schoolId"></file-list>
              </div>
            </Panel>
          </Collapse>

          <Collapse v-model="fileCollapsePersonal" style="margin-bottom: 1.5em;">
            <Panel name="personal">
              Personal Files
              <div slot="content" style="padding-top:1em;">
                <file-list ref="listFiles" :school-id="customerId"></file-list>
              </div>
            </Panel>
          </Collapse>
        </div>
        <div v-else>
          <file-list ref="listFiles" :school-id="customerId"></file-list>
        </div>-->
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.course-list {
  text-align: left;

  .header {
    font-size: 28px;
    text-align: left;
    color: #1c2438;
    border-bottom: 1px solid #dddee1;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .ivu-tabs-nav-container {
    font-size: 16px;
    font-weight: bold;
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
import auth from "../../authenticator";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import CourseListGeneric from "./CourseListGeneric.vue";
import CourseListSystem from "./CourseListSystem.vue";
import SystemCourseTemplate from "./SystemCourseTemplate.vue";
import FileList from "./FileList.vue";

export default {
  components: {
    CourseListGeneric,
    CourseListSystem,
    SystemCourseTemplate,
    FileList
  },
  data() {
    return {
      isSuperAdmin:auth.getAdminFlag(),
      withSchool: true,
      currentTab: "active",
      courseCollapseSystem: "system",
      courseCollapseSchool: "school",
      courseCollapseTemplate: "template",
      showSystemRetired: false,
      showSchoolRetired: false,
      showTemplateRetired: false,
      fileCollapseSchool: "school",
      fileCollapsePersonal: "personal"
    };
  },
  computed: {
    ...mapState(["Klassroom"]),

    schoolId() {
      return auth.getChosenSchoolId();
    },
    customerId() {
      return parseInt(auth.getCustomerID());
    },
    isSchool() {
      return this.isKlassroom || this.schoolId != auth.getCustomerID();
    },
    isKlassroom() {
      return IsKlassroom();
    },
    folderId() {
      return this.Klassroom.currentFolder;
    },
    cohortId() {
      return this.Klassroom.currentCohort;
    },
    termId() {
      return this.Klassroom.currentTerm.id;
    },
    showFinished() {
      return !this.isKlassroom;
    }
  },
  watch: {
    folderId(to, from) {
      this.$nextTick(() => {
        this.refresh();
      });
    },
    cohortId(to, from) {
      this.$nextTick(() => {
        this.refresh();
      });
    },
    termId(to, from) {
      this.$nextTick(() => {
        this.refresh();
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$parent.$emit("viewChanged", "courses");
    });

    let tab = localStorage.getItem("CourseListCurrentTab");
    if (!tab) tab = "active";
    this.currentTab = tab;

    this.initializeTab(this.currentTab);
  },
  methods: {
    initializeTab(name) {
      switch (name) {
        default:
        case "active":
          this.$refs.listActive.initialize();
          break;

        case "finished":
          this.$refs.listFinished.initialize();
          break;

        case "template":
          this.$refs.listSystem.initialize();
          this.$refs.listSchool.initialize();
          if (!this.isSchool) {
            this.$refs.listTemplate.initialize();
          }
          break;
        case "sysTemplate":
          this.$refs.systemTemplate.initialize();
          break;
        case "files":
          this.$refs.listFiles.initialize();
          // if (this.isSchool)
          //   this.$refs.listSchoolFiles.initialize();
          break;
      }

      localStorage.setItem("CourseListCurrentTab", name);
    },
    refresh() {
        this.$refs.listActive.reset();
        this.$refs.listFinished.reset();
        this.$refs.listSchool.reset();
        this.$refs.listSystem.reset();
        this.$refs.listFiles.reset();

        this.initializeTab(this.currentTab);
    },
    tabOnClick(name) {
      this.initializeTab(name);
    },
    handleClickCheckbox(e) {
      e.stopPropagation();
    }
  }
};
</script>
