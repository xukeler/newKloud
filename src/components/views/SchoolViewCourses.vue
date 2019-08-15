<template>
  <div id="schoolViewCourses">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<style lang="scss">
#schoolViewCourses {

}
</style>

<script>
  export default {
    data: function () {
      return {
      };
    },
    mounted: function () {
      this.$on("viewChanged", function (view) {
        this.$parent.$emit("viewChanged", 'courses');
      });

      this.$parent.$emit("viewChanged", 'courses');
    }
  }
</script>
