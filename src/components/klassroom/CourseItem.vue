<template>
  <div class="klassroom-course-item">
    <course-item></course-item>
  </div>
</template>

<style lang="scss">
.klassroom-course-item {
  padding: 1em 1.5em;
}
</style>

<script>
import CourseItem from '../courses/CourseItem.vue'

export default {
  components: {
    CourseItem
  }
}
</script>