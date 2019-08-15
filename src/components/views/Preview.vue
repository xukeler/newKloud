<template>
  <div id="preview">
    <course-preview ref="preview" :course-id="courseId"></course-preview>
  </div>
</template>

<style lang="scss">
  #preview {

  }
</style>

<script>
  import CoursePreview from '../courses/CoursePreview';

  export default {
    components: {
      CoursePreview
    },
    data() {
      return {
        courseId: 0
      };
    },
    mounted() {
      this.courseId = parseInt(this.$route.params.courseId);

      this.$nextTick(()=>{
        this.$refs.preview.initialize();
      });
    }
  }
</script>
