<template>
  <div>
    <course-list-generic ref="listActive" :list-type="2" :is-school="isSchool" :school-id="schoolId"></course-list-generic>
  </div>
</template>

<style lang="scss">

</style>

<script>
  import auth from '../../authenticator';
  import CourseListGeneric from '../courses/CourseListGeneric.vue'

  export default {
    components: {
      CourseListGeneric
    },
    data: function () {
      return {
        schoolId: -1,
        isSchool: false
      };
    },
    mounted: function () {
      this.$parent.$emit("viewChanged", 'school');

      this.schoolId = parseInt(this.$route.params.schoolId);
      this.isSchool = this.schoolId != auth.getCustomerID();

      this.$nextTick(() => {
        this.$refs.listActive.initialize();
      });
    }
  }
</script>
