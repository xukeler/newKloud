<template>
  <div class="user-profile-wrapper">
    <div class="panel-gutter"></div>
    <div class="panel-detail">
      <user-profile></user-profile>
    </div>
    <div class="panel-gutter"></div>
  </div>
</template>

<style lang="scss">
.user-profile-wrapper {
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
  min-height: 200px;
  width: 100%;

  .panel-gutter {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    box-flex: 1;
    -webkit-flex: 1 0 20px;
    -moz-flex: 1 0 20px;
    -ms-flex: 1 0 20px;
    flex: 1 0 20px;
  }

  .panel-detail {
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
  }
}
</style>

<script>
import UserProfile from "../profile/UserProfile.vue";

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
