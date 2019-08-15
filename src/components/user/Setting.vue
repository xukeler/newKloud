<template>
  <div id="mysetting">
    <div class="fav-header" id="liveHead">
      <div class="left-logo">
        <span class="peertime-logo"></span>
      </div>
      <div class="main-router">
        <Button type="text" :class="{'current': currentViewId === 'schedule'}" @click="goSchedule">Schedule</Button>
        <Button type="text" :class="{'current': currentViewId === 'history'}" @click="goHistory">Lessons</Button>
        <Button type="text" :class="{'current': currentViewId === 'courses'}" @click="goCourse">Course</Button>
      </div>
      <user-info></user-info>
    </div>
    <div style="text-align:left; width:400px;">
     <control-setting></control-setting>
    </div>
    <div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  $header-height: 50px;
  $images-root: "../../../static/images/"; 
  .header {
    height: $header-height;
    max-height: $header-height;
    background-color: #0D62C6;
    //#091e37;
    color: white;
    width: 100%;
    div, span

  {
    display: inline-block;
  }

  .left-logo {
    position: relative;
    float: left;
    height: $header-height;
    .peertime

  {
    font-family: Chalkduster, Magneto;
    font-size: 36px;
    font-weight: bold;
    vertical-align: top;
    padding-left: 10px;
  }

  }

  .middle-router {
    font-size: 24px;
    font-weight: bold;
    line-height: $header-height;
    position: relative;
    #headerCurrentRouterIcon

  {
    background-repeat: no-repeat;
    display: inline-block;
    width: 24px;
    height: 24px;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    text-align: center;
    vertical-align: middle;
    background-image: url($images-root + "thumbnails.svg");
  }

  }
  }
  .fav-header {
    height: $header-height;
    max-height: $header-height;
    background-color: #0061BB;
    background: linear-gradient(to right, #0780AB, #46BDB5);
    color: white;
    width: 100%;
    text-align: left;
    vertical-align: middle;
    position: relative;
    div, span

  {
    display: inline-block;
  }

  .left-logo {
    position: relative;
    float: left;
    height: $header-height;
    .peertime-logo

  {
    background-image: url($images-root + 'peertime_white.png');
    background-size: 138px 24px;
    background-repeat: no-repeat;
    background-position: center;
    width: 138px;
    height: $header-height;
    margin-left: 24px;
  }

  }

  .main-router {
    padding: 9px 0 0 30px;
    button

  {
    color: white;
    font-size: 18px;
    padding-bottom: 4px;
    border-radius: 0;
    border-bottom: 3px solid transparent;
  }

  button.current {
    border-bottom: 3px solid lightgrey;
  }

  }
  }
</style>
<script>
  import authenticator from '../../authenticator'
  import UserInfo from '../user/UserInfo.vue';
  import ControlSetting from '../user/ControlSetting.vue';

  export default {
    data: function ()
    {
      return {
        favList: [],
        selectedFav: []
      }
    },
    props: ["currentViewId"],
    components: {
      UserInfo,
      ControlSetting
    },
    mounted: function ()
    {

    },
    watch: {
      
    },
    methods: {
      goSchedule()
      {
        this.$router.push({ name: 'schedule' });
      },
      goCourse()
      {
        this.$router.push({ name: 'courses' });
      },
      goHistory()
      {
        this.$router.push({ name: 'history' });
      }
    }
  }
</script>
