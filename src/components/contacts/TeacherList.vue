<template>
  <div class="teacher-list">
    <Tabs @on-click="tabOnClick" v-model="currentTab">
      <TabPane :label="$t('TeachersView.Faculty')" name="employee">
      </TabPane>

      <TabPane :label="$t('TeachersView.TeacherFromOtherSchool')" name="teacher">
      </TabPane>
      <TabPane :label="$t('TeachersView.Schoolprofile')" name="profile">
      </TabPane>
      <add-contact :type="currentTab" :onContactAdded="handleContactAdded" slot="extra" :school-id="schoolId"></add-contact>
    </Tabs>

    <div style="margin-top:1em;">
      <div v-show="currentTab === 'employee'">
        <contact-list-generic list-type="employee" ref="listEmployee" :school-id="schoolId" :on-contact-selected="showContactDetail" :hide-detail-panel="hideDetailPanel"></contact-list-generic>
      </div>
      <div v-show="currentTab === 'teacher'">
        <contact-list-generic list-type="independent-teacher" ref="listTeacher" :school-id="schoolId" :on-contact-selected="showContactDetail" :hide-detail-panel="hideDetailPanel"></contact-list-generic>
      </div>
      <div v-show="currentTab === 'profile'">
        <school-profile ref="schoolProfile"></school-profile>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .teacher-list {
    //padding: 28px;
    text-align: left;

    .ivu-tabs-nav-container {
      font-size: 16px;
      font-weight: bold;
    }
  }
</style>

<script>
  import auth from '../../authenticator';
  import AddContact from './AddContact';
  import ContactListGeneric from  './ContactListGeneric';
  import SchoolProfile from '../school/SchoolProfile'

  export default {
    components: {
      AddContact,
      ContactListGeneric,
      SchoolProfile
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
        currentTab: "employee",
      }
    },
    mounted() {
      let tab = localStorage.getItem('TeacherListCurrentTab');
      if (!tab)
        tab = 'employee';

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
          default:
          case "employee":
            this.$refs.listEmployee.refresh();
            break;

          case "teacher":
            this.$refs.listTeacher.refresh();
            break;
        }
      },
      initializeTab(name) {
        switch (name) {
          default:
          case "employee":
            this.$refs.listEmployee.initialize();
            break;

          case "teacher":
            this.$refs.listTeacher.initialize();
            break;
          case "profile":
            break; 
        }

        this.currentTab = name;
        localStorage.setItem('ContactListCurrentTab', name);
      },
      tabOnClick(name) {
        this.$parent.hideDetailPanel();
        this.initializeTab(name);
      },
      hideDetailPanel(){
        this.$parent.hideDetailPanel();
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
