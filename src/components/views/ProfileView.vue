<template>
  <div id="coursesView">
    <div class="paneGutter"></div>
    <div class="panelDetail">
      <div v-if='isSchool'>
        <school-info-school-profile ref="SchoolInfoSchoolProfile" :school-id="schoolId"></school-info-school-profile>
      </div>
      <div v-else>
        <teacher-info ref="TeacherInfo"></teacher-info>
      </div>
    </div>
    <div class="paneGutter"></div>
  </div>
</template>

<style lang="scss">
#coursesView{
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
    min-width: 500px;

    background-color: #FFFFFF;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    border-radius: 3px;
    padding: 28px;
  }

  .ivu-table th {
    background-color: #495060;
    color: white;
  }
}
</style>

<script>
import auth from '../../authenticator';
import SchoolInfoSchoolProfile from '../profile/SchoolInfoSchoolProfile'
import TeacherInfo from '../profile/TeacherInfo'

export default {
  components: {
    SchoolInfoSchoolProfile, TeacherInfo
  },
  data() {
      return {
        isSchool: true,
        schoolId: -1
      };
  },
  mounted() {
    this.$parent.$emit("viewChanged", 'schoolprofile');

    this.schoolId = auth.getChosenSchoolId();
    this.isSchool = this.schoolId != auth.getCustomerID();

    this.$nextTick(() => {
      if (this.isSchool)
        this.$refs.SchoolInfoSchoolProfile.initialize();
      else 
        this.$refs.TeacherInfo.initialize();
    });
  }
}
</script>
