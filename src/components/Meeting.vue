<template>
  <div>
  </div>
</template>

<style lang="scss">

</style>

<script>
import auth from '../authenticator'

export default {
  data() {
    return {};
  },
  mounted() {
    let user = this.$route.query.user;
    let file = this.$route.query.file;

    if (auth.checkAuth()) {
      this.meetingId = auth.getClassroomID();
      if (this.meetingId) {
        this.$router.push({name: 'live', params: {id:  this.meetingId}});
      }
    }
  }
}
</script>

