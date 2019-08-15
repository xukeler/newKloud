<template>
  <div class="kloudsync-profile-flexviews">
    <!-- <div class="panel-gutter"></div> -->
    <div class="panel-content">
      <user-profile></user-profile>
    </div>
    <!-- <div class="panel-gutter"></div> -->
  </div>
</template>

<style lang="scss">
.kloudsync-profile-flexviews{
  background-color: transparent;
  display: flex;
  // padding-top: 15px;
  // padding-bottom: 15px;
  width: 100%;
  height: calc(100% - 68px);
  align-items: stretch;

  .panel-gutter {
    flex: 1 0 15px;
  }
  .panel-content {
    flex: 5500 1 750px;
    //max-width: 1500px;
    min-width: 750px;
    height: 100%;

    background-color: #ffffff;
    // box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    // border-radius: 3px;
  }
}
</style>

<script>
import UserProfile from "../profile/UserProfileKloudsync.vue";

export default {
  components: {
    UserProfile
  },
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>
