<template>
  <div class="course-people" v-if="showThis">
    <course-teachers :is-school="isSchool" :school-id="schoolId" :course-id="courseId"></course-teachers>
    <div style="height:1em;"></div>
    <div v-if="isKlassroom">
      <course-classes :is-school="isSchool" :school-id="schoolId" :term-year="termYear" :course-id="courseId"></course-classes>
    </div>
    <div v-else>
      <course-students :is-school="isSchool" :school-id="schoolId" :course-id="courseId"></course-students>
    </div>
  </div>
</template>

<style lang="scss">
.course-people {
  padding: 20px 10px;
}
</style>

<script>
import CourseTeachers from './CourseTeachers.vue';
import CourseStudents from './CourseStudents.vue';
import CourseClasses from './CourseClasses.vue';

export default {
  components: {
    CourseTeachers, CourseStudents, CourseClasses
  },
  props: {
    isSchool: {
      type: Boolean,
      default: false
    },
    schoolId: {
      type: Number,
      default: -1,
    },
    termYear: {
      type: Number,
      default: -1,
    },
    courseId: Number,
  },
  data() {
    return {
      showThis:false,
    };
  },
  computed: {
    isKlassroom() {
      return IsKlassroom();
    },
  },
  methods: {
    initialize(){
      this.showThis = false;
      this.$nextTick(()=>{
        this.showThis = true;
      })
    }
  },
}
</script>
