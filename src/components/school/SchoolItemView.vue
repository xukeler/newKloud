<template>
  <div class="school-view">
    <div class="school-view-tabs">
      <Tabs @on-click="tabOnClick" v-model="currentTab">
        <TabPane name="contacts" label="Contact"></TabPane>
        <TabPane name="activecourses" label="On-going Courses"></TabPane>
        <TabPane name="finishedcourses" label="Finished Courses"></TabPane>
        <TabPane name="templatecourses" label="Course Templates"></TabPane>
        <TabPane name="files" label="Files"></TabPane>
        <TabPane name="profile" label="Profile"></TabPane>
      </Tabs>
    </div>

    <div>
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<style lang="scss">
.school-view {
  .school-view-tabs{
    margin-bottom: 1em;
    .ivu-tabs-nav-container {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .ivu-table th {
    background-color: #495060;
    color: white;
  }
}
</style>

<script>
  import auth from '../../authenticator';
  
  export default {
    data () {
      return {
        schoolId: -1,
        currentTab: 'contacts',
      };
    },
    mounted() {
      this.schoolId = parseInt(this.$route.params.schoolId);

      switch (this.$route.name) {
        case "school-contacts":
          this.currentTab = "contacts";
          break;
        
        case "school-files":
          this.currentTab = "files";
          break;
        
        case "school-profile":
          this.currentTab = "profile";
          break;

        case "school-course-active":
          this.currentTab = "activecourses";
          break;

        case "school-course-finished":
          this.currentTab = "finishedcourses";
          break;

        case "school-course-template":
          this.currentTab = "templatecourses";
          break;

        case "school-course-create":
        case "school-course-item":
          let current = localStorage.getItem('SchoolCurrentTab');
          if (!current)
            current = 'activecourses';
          
          this.currentTab = current;
          break;

        case "school-item":
        default:
          let tab = localStorage.getItem('SchoolCurrentTab');
          if (!tab)
            tab = 'contacts';
          
          this.currentTab = tab;

          this.$nextTick(() => {
            this.gotoTab(this.currentTab);
          });
          break;
      }
    },
    methods: {
      tabOnClick(name) {
        this.currentTab = name;
        this.gotoTab(name);
      },
      gotoTab(name) {
        localStorage.setItem('SchoolCurrentTab', name);

        switch(name) {
          case "contacts":
            this.gotoContacts();
            break;

          case "files":
            this.gotoFiles();
            break;

          case "profile":
            this.gotoProfile();
            break;

          case "activecourses":
            this.gotoCourseActive();
            break;

          case "finishedcourses":
            this.gotoCourseFinished();
            break;

          case "templatecourses":
            this.gotoCourseTemplate();
            break;
        }
      },
      gotoContacts() {
        this.$router.push({name: 'school-contacts'});
      },
      gotoFiles() {
        this.$router.push({name: 'school-files'});
      },
      gotoProfile() {
        this.$router.push({name: 'school-profile'});
      },
      gotoCourseActive() {
        this.$router.push({name: 'school-course-active'});
      },
      gotoCourseFinished() {
        this.$router.push({name: 'school-course-finished'});
      },
      gotoCourseTemplate() {
        this.$router.push({name: 'school-course-template'});
      }
    }
  }
</script>



