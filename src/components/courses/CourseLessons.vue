<template>
  <div class="course-lessons">
    <div v-if="isKlassroom">
      <recurring-lesson ref="recurringLesson" :is-creating="isCreating" :course-id="courseId" :course-type="courseType"></recurring-lesson>
    </div>
    <div v-else>
      <lesson-list ref="lessonList" :is-creating="isCreating" :course-id="courseId" :course-type="courseType"></lesson-list>
    </div>
  </div>
</template>

<style lang="scss">
.course-lessons {
  padding: 0;
}
</style>

<script>
import LessonList from './LessonList.vue';
import RecurringLesson from './RecurringLesson.vue';

export default {
  components:{
    LessonList, RecurringLesson
  },
  props: {
    courseType: {
      type: Number,
      default: 0
    },
    courseId: {
      type: Number,
      default: 0
    },
    isCreating: {
      type: Boolean,
      default: false
    },
    lessonAmount: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
    };
  },
  computed: {
    isKlassroom() {
      return IsKlassroom();
    },
  },
  mounted() {
  },
  methods: {
    clear() {
      if (this.isKlassroom)
        this.$refs.recurringLesson.clear();
      else 
        this.$refs.lessonList.clear();
    },
    initialize() {
      if (this.isKlassroom)
        this.$refs.recurringLesson.initialize();
      else
        this.$refs.lessonList.initialize();
    },
    refresh() {
      if (this.isKlassroom)
        this.$refs.recurringLesson.refresh();
      else 
        this.$refs.lessonList.refresh();
    },
    checkData() {
      let result = true;

      if (this.isKlassroom)
        result = this.$refs.recurringLesson.checkData();
      else
        result = this.$refs.lessonList.checkData();
      
      return result;
    },
    saveData(newCourseId, lectureRelation, memberData, callback) {
      if (this.isKlassroom) {
        this.$refs.recurringLesson.saveData(newCourseId, lectureRelation, memberData, callback);
      }
      else {
        this.$refs.lessonList.saveData(newCourseId, lectureRelation, memberData, callback);
      }
    },
  },
}
</script>

