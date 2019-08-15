<template>
  <div id="playView" class="playview">
    <div>PlayLesson</div>
    <div id="playExit" @click="PlayBackHistory" title="Back"><Icon type="android-arrow-back" size="28"></Icon></div>
    <div id="playTime" class="playtime">
      <div style="width:50px; line-height:40px;  vertical-align:middle; z-index:20001; position:absolute;left:0px;">
        <span id="playControl" @click="playRecord"><Icon type="play" title="Play" size="18"></Icon></span>
      </div>
      <div style="padding-left:50px; width:100%; position:absolute; right:0; height:40px; line-height:40px;">
        <Slider v-model="recordTotalTime" :max="561" :tip-format="hideFormat" @on-change="onPlayTimeChange"></Slider>
      </div>
      
    </div>
  </div>
</template>
<style lang="scss">
  $images-root: "../../../static/images/"; svg {
    touch-action: none;
  }
  .playview {
    .playtime
    {
      width:99%;
      bottom:40px;
      position:absolute;
      left:2px;
      z-index:20000;
    }
  #playControl {
    cursor:pointer;
  }
  #playExit {
    position:absolute;
    right:2px;
    top:2px;
    width:30px;
    height:30px;
    cursor:pointer;
  }
  }
</style>
<script>
export default {
    data: function ()
    {
      return {
        recordTotalTime:0
      }
    },
    components: {

    },
    mounted: function ()
    {

    },
    watch: {

    },
    methods: {
      hideFormat()
      {
        return null;
      },
      onPlayTimeChange()
      {
        console.log(this.recordTotalTime);
      },
      playRecord()
      {
        console.log("playRecord");
        if ($("#playControl").find("I").hasClass("ivu-icon-play"))//pause
        {
          $("#playControl").html('<i class="ivu-icon ivu-icon-pause" style="font-size: 18px;" title="Pause"></i>');
        }
        else
        {
          $("#playControl").html('<i class="ivu-icon ivu-icon-play" style="font-size: 18px;" title="Play"></i>');
        }
      },
      PlayBackHistory()
      {
        this.$router.go(-1);
      }
    }
  }
</script>
