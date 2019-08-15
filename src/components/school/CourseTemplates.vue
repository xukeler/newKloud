<template>
  <div class="school-course-template">
    <div v-if="isSchool">
      <Collapse v-model="courseCollapseSchool" style="margin-bottom: 1.5em;">
        <Panel name="school">
          School Course Template
          <div style="float: right; line-height:36px; font-weight:bold;" @click="handleClickCheckbox">
            <Checkbox v-model="showSchoolRetired">Show Retired Courses</Checkbox>
          </div>
          <div slot="content">
            <course-list-generic ref="listSchool" :list-type="1" :template-type="3" :show-page="false" :is-school="isSchool" :school-id="schoolId"></course-list-generic>
          </div>
        </Panel>
      </Collapse>

      <Collapse v-model="courseCollapseSystem" style="margin-bottom: 1.5em;">
        <Panel name="system">
          System Course Template (Subscribed from platform for teaching purpose)
          <div style="float: right; line-height:36px; font-weight:bold;" @click="handleClickCheckbox">
            <Checkbox v-model="showSystemRetired">Show Retired Courses</Checkbox>
          </div>
          <div slot="content">
            <course-list-system ref="listSystem" :is-school="isSchool" :school-id="schoolId"></course-list-system>
          </div>
        </Panel>
      </Collapse>
    </div>
    <div v-else>
      <Collapse v-model="courseCollapseTemplate" style="margin-bottom: 1.5em;">
        <Panel name="template">
          My Course Templates
          <div style="float: right; line-height:36px; font-weight:bold;" @click="handleClickCheckbox">
            <Checkbox v-model="showTemplateRetired">Show Retired Courses</Checkbox>
          </div>
          <div slot="content">
            <course-list-generic ref="listTemplate" :list-type="1" :template-type="2" :show-page="false" :is-school="isSchool" :school-id="schoolId"></course-list-generic>
          </div>
        </Panel>
      </Collapse>

      <Collapse v-model="courseCollapseSystem" style="margin-bottom: 1.5em;">
        <Panel name="system">
          System Course Template (Subscribed from platform for teaching purpose)
          <div style="float: right; line-height:36px; font-weight:bold;" @click="handleClickCheckbox">
            <Checkbox v-model="showSystemRetired">Show Retired Courses</Checkbox>
          </div>
          <div slot="content">
            <course-list-system ref="listSystem" :is-school="isSchool" :school-id="schoolId"></course-list-system>
          </div>
        </Panel>
      </Collapse>

      <Collapse v-model="courseCollapseSchool" v-show="withSchool" style="margin-bottom: 1.5em;">
        <Panel name="school">
          Course templates from my associated schools (Courses from my associated schools that I can teach)
          <div style="float: right; line-height:36px; font-weight:bold;" @click="handleClickCheckbox">
            <Checkbox v-model="showSchoolRetired">Show Retired Courses</Checkbox>
          </div>
          <div slot="content">
            <course-list-generic ref="listSchool" :list-type="1" :template-type="3" :show-page="false" :is-school="isSchool" :school-id="schoolId"></course-list-generic>
          </div>
        </Panel>
      </Collapse>
    </div>
  </div>
</template>

<style lang="scss">
.school-course-template {
  text-align: left;
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
  import auth from '../../authenticator';
  import CourseListGeneric from '../courses/CourseListGeneric.vue'
  import CourseListSystem from '../courses/CourseListSystem.vue'

  export default {
    components: {
      CourseListGeneric, CourseListSystem
    },
    data: function () {
      return {
        isSchool: false,
        schoolId: -1,
        withSchool: true,
        courseCollapseSystem: 'system',
        courseCollapseSchool: 'school',
        courseCollapseTemplate: 'template',
        showSystemRetired: false,
        showSchoolRetired: false,
        showTemplateRetired: false,
      };
    },
    mounted: function () {
      this.$parent.$emit("viewChanged", 'school');

      this.schoolId = parseInt(this.$route.params.schoolId);
      this.isSchool = this.schoolId != auth.getCustomerID();

      this.$nextTick(() => {
        this.$refs.listSystem.initialize();
        this.$refs.listSchool.initialize();
        if (!this.isSchool) {
          this.$refs.listTemplate.initialize();
        }
      });
    },
    methods: {
      handleClickCheckbox(e) {
        e.stopPropagation();
      }
    }
  }
</script>
