<template>
  <div>
    <div v-if='isSchool'>
      <school-info-school-profile ref="SchoolInfoSchoolProfile" :school-id="schoolId"></school-info-school-profile>
    </div>
    <div v-else>
      <teacher-info ref="TeacherInfo"></teacher-info>
    </div>
  </div>
</template>

<style lang="sass">

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
    this.$parent.$emit("viewChanged", 'school');

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
