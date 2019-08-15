<template>
  <div id="schoolView">
    <div class="paneGutter"></div>
    <div class="panelDetail">
      <div class="school-view-tabs">
        <Tabs @on-click="tabOnClick" v-model="currentTab">
          <TabPane name="contacts" label="Contact" v-if="showContact"></TabPane>
          <TabPane name="courses" label="Courses" v-if="showCourse"></TabPane>
          <TabPane name="files" label="Files"></TabPane>
        </Tabs>
      </div>
      <div>
        <router-view :key="$route.fullPath"></router-view>
      </div>
    </div>
    <div class="paneGutter"></div>
  </div>
</template>

<style lang="scss">
  #schoolView{
    background-color: transparent;
    display: -webkit-box;
    display: -moz-box;
    display: box;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    min-height: 1px;
    padding-top: 20px;
    min-width: 785px;
    min-height: 200px;
    width: 100%;

    .paneGutter {
      -webkit-box-flex: 1;
      -moz-box-flex: 1;
      box-flex: 1;
      -webkit-flex: 1 0 20px;
      -moz-flex: 1 0 20px;
      -ms-flex: 1 0 20px;
      flex: 1 0 20px;
    }

    .panelCatalog {
      -webkit-box-flex: 0;
      -moz-box-flex: 0;
      box-flex: 0;
      -webkit-flex: 0 0 250px;
      -moz-flex: 0 0 250px;
      -ms-flex: 0 0 250px;
      flex: 0 0 250px;
      -webkit-box-pack: start;
      -moz-box-pack: start;
      box-pack: start;
      -webkit-justify-content: flex-start;
      -moz-justify-content: flex-start;
      -ms-justify-content: flex-start;
      -o-justify-content: flex-start;
      justify-content: flex-start;
      -ms-flex-pack: start;
      margin-right: 15px;
    }

    .panelDetail {
      -webkit-box-flex: 5500;
      -moz-box-flex: 5500;
      box-flex: 5500;
      -webkit-flex: 5500 1 500px;
      -moz-flex: 5500 1 500px;
      -ms-flex: 5500 1 500px;
      flex: 5500 1 500px;
      max-width: 1500px;
      min-width: 800px;

      background-color: #FFFFFF;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      border-radius: 3px;

      padding: 28px;
    }

    .school-view-tabs{
      .ivu-tabs-nav-container {
        font-size: 20px;
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
    data: function () {
      return {
        currentTab: 'contacts',
        showContact: auth.canViewContact(),
        showCourse: auth.canViewCourse()
      };
    },
    mounted: function () {
      this.$on("viewChanged", function (view) {
        this.currentTab = view;

        this.$parent.$emit("viewChanged", "school");
      });

      this.$parent.$emit("viewChanged", "school");

      let name = this.$router.currentRoute.name;
      let redirect = false;
      if (name.includes('contacts') && !this.showContact) {
        name = 'school-courses';
        redirect = true;
      }
      if (name.includes('courses') && !this.showCourse) {
        name = 'school-files';
        redirect = true;
      }
      if (redirect) {
        this.$router.push({name: name});
        return;
      }

      if (name.includes('contacts')) {
        this.currentTab = 'contacts';
      }
      else if (name.includes('courses')) {
        this.currentTab = 'courses';
      }
      else {
        this.currentTab = 'files';
      }
    },
    methods: {
      tabOnClick(name) {
        switch (name) {
          default:
          case 'contacts':
            this.$router.push({name: 'school-contacts'});
            break;

          case 'courses':
            this.$router.push({name: 'school-courses'});
            break;

          case 'files':
            this.$router.push({name: 'school-files'});
            break;
        }
      }
    }
  }
</script>
