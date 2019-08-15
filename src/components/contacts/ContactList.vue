<template>
  <div class="contact-list">
    <div class="header" v-show="showHeader">
      Contacts

      <div class="action-buttons">

      </div>
    </div>

    <Tabs @on-click="tabOnClick" v-model="currentTab">
      <TabPane label="Prospects" name="prospect" v-if="isTutoring && isSchool">
      </TabPane>

      <TabPane :label="labelTeacher" name="teacher" v-if="isSchool">
      </TabPane>

      <TabPane label="Students" name="student">
      </TabPane>

      <TabPane label="Parents" name="parent" v-if="isTutoring">
      </TabPane>

      <TabPane :label="labelEmployee" name="employee" v-if="isSchool">
      </TabPane>

      <add-contact :type="currentTab" :onContactAdded="handleContactAdded" slot="extra" v-if="canCreate" :school-id="schoolId"></add-contact>
    </Tabs>

    <div>
      <div v-show="currentTab === 'prospect' && isTutoring && isSchool">
        <contact-list-generic list-type="prospect" ref="listProspect" :school-id="schoolId" :on-contact-selected="showContactDetail"></contact-list-generic>
      </div>
      <div v-show="currentTab === 'teacher' && isSchool">
        <contact-list-generic list-type="independent-teacher" ref="listTeacher" :school-id="schoolId" :on-contact-selected="showContactDetail"></contact-list-generic>
      </div>
      <div v-show="currentTab === 'student'">
        <contact-list-generic list-type="student" ref="listStudent" :school-id="schoolId" :on-contact-selected="showContactDetail"></contact-list-generic>
      </div>
      <div v-show="currentTab === 'parent' && isTutoring">
        <contact-list-generic list-type="parent" ref="listParent" :school-id="schoolId" :on-contact-selected="showContactDetail"></contact-list-generic>
      </div>
      <div v-show="currentTab === 'employee' && isSchool">
        <contact-list-generic list-type="employee" ref="listEmployee" :school-id="schoolId" :on-contact-selected="showContactDetail"></contact-list-generic>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .contact-list {
    //padding: 28px;
    text-align: left;

    .header {
      font-size: 28px;
      text-align: left;
      color: #1c2438;
      border-bottom: 1px solid #dddee1;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }

    .action-buttons {
      float: right;
    }

    .ivu-tabs-bar {
      border-bottom: 1px solid transparent;
    }

    .ivu-collapse {
      //background-color: transparent;
      //border: 1px solid transparent;
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
  import auth from '../../authenticator';
  import AddContact from './AddContact';
  import ContactListGeneric from  './ContactListGeneric';

  export default {
    components: {
      AddContact,
      ContactListGeneric
    },
    props: {
      showHeader: {
        type: Boolean,
        default: true
      },
      schoolId: Number
    },
    data() {
      return {
        currentTab: "teacher",
        canCreate: true, //auth.canCreateContact(),
        isTutoring: true, //auth.getSchoolType() === 0
      }
    },
    computed: {
      labelTeacher() {
        return this.isTutoring ? 'Independent Teachers' : 'Teachers';
      },
      labelEmployee() {
        return this.isTutoring ? 'Employee' : 'Office Staff';
      },
      isSchool() {
        return this.schoolId != auth.getCustomerID();
      }
    },
    mounted() {
      let tab = localStorage.getItem('ContactListCurrentTab');
      if (!tab)
        tab = 'teacher';
      else if (!this.isTutoring && (tab === 'prospect' || tab === 'parent'))
        tab = 'teacher';

      this.currentTab = tab;

      this.$nextTick(() => {
        this.initializeTab(this.currentTab);
      });
    },
    methods: {
      refresh(type) {
        let tab = this.currentTab;
        if (type)
          tab = type;

        switch (tab) {
          case "prospect":
            this.$refs.listProspect.refresh();
            break;

          default:
          case "teacher":
            this.$refs.listTeacher.refresh();
            break;

          case "student":
            this.$refs.listStudent.refresh();
            break;

          case "parent":
            this.$refs.listParent.refresh();
            break;

          case "employee":
            this.$refs.listEmployee.refresh();
            break;
        }
      },
      initializeTab(name) {
        switch (name) {
          case "prospect":
            this.$refs.listProspect.initialize();
            break;

          default:
          case "teacher":
            this.$refs.listTeacher.initialize();
            break;

          case "student":
            this.$refs.listStudent.initialize();
            break;

          case "parent":
            this.$refs.listParent.initialize();
            break;

          case "employee":
            this.$refs.listEmployee.initialize();
            break;
        }

        this.currentTab = name;
        localStorage.setItem('ContactListCurrentTab', name);
      },
      tabOnClick(name) {
        this.$parent.hideDetailPanel();
        this.initializeTab(name);
      },
      showContactDetail(id) {
        this.$parent.showDetailPanel(id);
      },
      handleContactAdded(type) {
        this.refresh(type);
      }
    }
  }
</script>
