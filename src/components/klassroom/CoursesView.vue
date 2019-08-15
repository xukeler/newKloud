<template>
  <div class="klassroom-courses">
    <Tabs @on-click="tabOnClick" v-model="currentTab">
      <TabPane :label="$t('CourseList.OngoingCourses')" name="active"></TabPane>
      <TabPane :label="$t('CourseList.FinishedCourses')" name="finished" v-if="showFinished"></TabPane>
      <TabPane :label="$t('CourseList.CourseTemplates')" name="template"></TabPane>
      <TabPane :label="$t('CourseList.SystemCourseTemplateManagement')" name="sysTemplate" v-if="isSuperAdmin=='true'"></TabPane>
      <TabPane :label="$t('CourseList.SchoolFiles')" name="files"></TabPane>
    </Tabs>

    <div style="margin-top:1em;">
      <div v-show="currentTab === 'active'">
        <course-list-generic ref="listActive" :list-type="2" :is-school="isSchool" :is-klassroom="isKlassroom" :school-id="schoolId" :folder-id="folderId" :cohort-id="cohortId" :term-id="termId"></course-list-generic>
      </div>
      <div v-show="currentTab === 'finished'">
        <course-list-generic ref="listFinished" :list-type="3" :show-action="false" :is-school="isSchool" :is-klassroom="isKlassroom" :school-id="schoolId" :folder-id="folderId" :cohort-id="cohortId" :term-id="termId"></course-list-generic>
      </div>
      <div v-show="currentTab === 'template'">
        <Collapse v-model="courseCollapseSchool" style="margin-bottom: 1.5em;">
          <Panel name="school">
            {{$t('CourseList.SchoolCourseTemplate')}}
            <div style="float: right; line-height:36px; font-weight:bold;" @click="handleClickCheckbox">
              <Checkbox v-model="showSchoolRetired">{{$t('CourseList.ShowRetiredCourses')}}</Checkbox>
            </div>
            <div slot="content">
              <course-list-generic ref="listSchool" :list-type="1" :template-type="3" :is-school="isSchool" :is-klassroom="isKlassroom" :school-id="schoolId" :folder-id="folderId" :cohort-id="cohortId" :term-id="termId"></course-list-generic>
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
              <course-list-system ref="listSystem" :is-school="isSchool" :is-klassroom="isKlassroom" :school-id="schoolId" :folder-id="folderId"></course-list-system>
            </div>
          </Panel>
        </Collapse>
      </div>
      <div v-show="currentTab === 'sysTemplate' && isSuperAdmin==='true'">
        <system-course-template ref="systemTemplate" :is-school="isSchool" :is-klassroom="isKlassroom" :school-id="schoolId" :folder-id="folderId"></system-course-template>
      </div>
      <div v-show="currentTab === 'files'">
        <file-list ref="listFiles" :school-id="schoolId" :folder-id="folderId"></file-list>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.klassroom-courses {
  padding: 1em 1.5em;
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
import CourseListGeneric from "../courses/CourseListGeneric.vue";
import CourseListSystem from "../courses/CourseListSystem.vue";
import SystemCourseTemplate from "../courses/SystemCourseTemplate.vue";
import FileList from "../courses/FileList.vue";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
  components: {
    CourseListGeneric,
    CourseListSystem,
    SystemCourseTemplate,
    FileList
  },
  data() {
    return {
      isSchool: true,
      isSuperAdmin: auth.getAdminFlag(),
      currentTab: "active",
      courseCollapseSystem: "system",
      courseCollapseSchool: "school",
      showSystemRetired: false,
      showSchoolRetired: false,
    };
  },
  computed: {
    ...mapState(["Klassroom"]),

    schoolId() {
      return auth.getChosenSchoolId();
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
          break;
        case "sysTemplate":
          this.$refs.systemTemplate.initialize();
          break;
        case "files":
          this.$refs.listFiles.initialize();
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
