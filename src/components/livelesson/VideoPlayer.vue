<template>
  <div id="videoplayer" class="videoplayer">
    <video id="videoplayerele" class="videoplayerele" oncontextmenu="return false;" @playing="videoOnPlaying" @play="videoOnPlay()" @pause="videoOnPause()" controls2="controls2" :src="src" autoplay2="autoplay2"></video>
    <div id="videoplayertoolbar" class="videoplayertoolbar">
      <div class="videoplayerslider">
        <Slider v-model="currentPlayTime" @on-change="onPlayTimeChange" @on-input="onPlayTimeChanging" :max="totalTime" :disabled="!canControl" show-tip="never"></Slider>
        </div>
      <div class="videoplayertool2">
        <span style="padding:4px 10px 0px; cursor:pointer;" v-show="!isPlaying" @click="onScreenToolClick"><Icon type="ios-play-outline" style="color:white;" size="22"></Icon></span>
        <span style="padding:4px 10px 0px;cursor:pointer;" v-show="isPlaying" @click="onScreenToolClick"><Icon type="ios-pause-outline" style="color:white;" size="22"></Icon></span>
        <span style="color: white;padding: 0px;display: inline-block;margin-top: -2px;font-size: 12px;vertical-align: text-top;">{{getShowCurrentTime}}/{{getShowTotalTime}}</span>
        <span id="videoplayertool-fullscreen" style="float:right; padding:0px 5px 0px 20px; cursor:pointer;" @click="fullScreen"><Icon type="arrow-expand" style="color:white;" size="26"></Icon></span>
        <span style="width:100px;float:right;" class="videoplayervolslider"><Slider v-model="vol" :max="100" @on-change="onVolChange" :tip-format="onVolTip"></Slider></span>
        <span style="float:right; padding:4px 5px 0px 5px;"><Icon type="volume-high" style="color:white;" size="18"></Icon></span>
      </div>
    </div>
    <div class="videoplayerscreentool" @click="onScreenToolClick" v-show="canControl && !isPlaying">
      <Icon v-show="!isPlaying" type="play" style="color:white;" size="40"></Icon>
      <Icon v-show="isPlaying" type="pause" style="color:white;margin-right:5px;" size="40"></Icon>
    </div>
    <div class="videoplayerclose" @click="onCloseClick" v-show="isShowClose && canControl">
      <Icon type="close" style="color:white;" size="30"></Icon>
    </div>
    <div class="videoplayerscreeninfo" v-show="getShowPauseInfo"><Icon type="load-a" size="20" style="margin-right:10px;"></Icon><span style="font-size:20px;">Presenter had paused the video play</span></div>
  </div>
</template>
<style lang="scss">
  $images-root: "../../../static/images/";
  .videoplayer {
    width: 100%;
    height: 100%;
    position: relative;

  .videoplayerele
  {
    height: 99%;
    width: 100%;
    background-color:black;
  }
  .videoplayertoolbar {
    width: 100%;
    height: 40px;
    bottom: 0px;
    background-color: black;
    position: absolute;
    padding: 0px 5px;
    margin: 0px;
    visibility:hidden;
  }
  .videoplayertool2 {
    width: 100%;
    padding:0px;
    margin:0px;
    text-align:left;
  }
  .videoplayerscreentool {
    width: 100px;
    height: 100px;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -50px;
    background-color: #808080;
    border-radius: 50%;
    position: absolute;
    text-align: center;
    vertical-align: middle;
    line-height: 100px;
    padding: 10px 0px 0px 5px;
    cursor:pointer;
    display:none;
  }
  .videoplayerclose {
    width: 50px;
    height: 50px;
    top: 5px;
    right:5px;
    background-color: #808080;
    border-radius: 50%;
    position: absolute;
    text-align: center;
    vertical-align: middle;
    line-height: 50px;
    padding: 8px 0px 0px 2px;
    cursor: pointer;
    display: none;
  }
  .videoplayerscreeninfo {
    width: 400px;
    height: 50px;
    top: 50%;
    left: 50%;
    margin-left: -200px;
    margin-top: -25px;
    background-color: #808080;
    border-radius: 25px;
    position: absolute;
    text-align: center;
    vertical-align: middle;
    line-height: 50px;
    padding: 0px;
    cursor: pointer;
    color:white;
  }
  .videoplayerslider {
    padding: 0px;
    margin: 0px;
  }
    .videoplayerslider .ivu-slider-wrap {
      margin:5px 0px;
    }
  .videoplayervolslider
  {

  }
    .videoplayervolslider .ivu-slider-wrap {
      margin:10px 0px 5px 0px;
    }
  }
  .videoplayer:hover .videoplayertoolbar {
    visibility: visible;
  }
  .videoplayer:hover .videoplayerscreentool {
    display:inline-block;
  }
  .videoplayer:hover .videoplayerclose {
    display: inline-block;
  }
</style>
<script>
export default {
    data: function ()
    {
      return {
        currentPlayTime: 0,
        totalTime: 0,
        isPlaying: false,
        isPlayingBeforeDrag: -1,
        isNotTrigEvent: false,
        isChangeTimeEnd: true,
        isShowClose:true,
        canControl:true,
        vol: 100,
        videoPlayTimer: null,
        vid: 0,
        type:0,
        src:""
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
      videoOnPlay()
      {
        //if (!this.canControl) return;
        
        var videoele = $("#videoplayerele")[0];
        if(isNaN(videoele.duration))
        {
            setTimeout(()=>{
              this.totalTime = Math.round(videoele.duration);
            },3000);
        }
        else
        {
          this.totalTime = Math.round(videoele.duration);
        }
        
        if (this.canControl)
        {
          // if (videoele && this.$parent.videoOnPlay)
          // {
          //   this.$parent.videoOnPlay(videoele.currentTime,this.vid,this.src,this.type);
          // }
          this.$emit("videoOnPlay", videoele.currentTime,this.vid,this.src,this.type);
        }
        if (this.videoPlayTimer)
        {
          clearTimeout(this.videoPlayTimer);
        }
        //return;
        var lastSendTime = new Date();
        this.videoPlayTimer = setInterval(() =>
        {
          if (this.isPlayingBeforeDrag != -1)
          {
            return;
          }
          this.isNotTrigEvent = true;
          this.currentPlayTime = Math.round(videoele.currentTime);

          setTimeout(() =>
          {
            this.isNotTrigEvent = false;
          }, 100);
          if (this.canControl)
          {
            if (new Date() - lastSendTime >= 5000)
            {
              lastSendTime = new Date();
              // if (this.$parent.videoOnPlaying)
              // {
              //   this.$parent.videoOnPlaying(videoele.currentTime, this.vid, this.src, this.type);
              // }
              this.$emit("videoOnPlaying",videoele.currentTime, this.vid, this.src, this.type);
            }
          }
          
          
        }, 1000);
      },
      videoOnPlaying()
      {
        //console.log("videoOnPlaying");
      },
      videoOnPause()
      {
        console.log("videoOnPause");
        if (this.videoPlayTimer)
        {
          clearTimeout(this.videoPlayTimer);
        }
        if (!this.canControl) return;
        var videoele = $("#videoplayerele")[0];
        // if (videoele && this.$parent.videoOnPause)
        // {
        //   var isFinish = Math.abs(this.totalTime-videoele.currentTime)<0.5;
        //   this.$parent.videoOnPause(videoele.currentTime, this.vid, this.src, this.type, isFinish);
        // }
        var isFinish = Math.abs(this.totalTime-videoele.currentTime)<0.5;
        this.$emit("videoOnPause",videoele.currentTime, this.vid, this.src, this.type, isFinish);
        if(isFinish)
        {
          this.$emit("videoOnClose");
        }
        
      },
      onVideoPlayInfoChange(obj, videoitem)
      {
        //console.log("onVideoPlayInfoChange:");
        //console.log(obj);
        //console.log(videoitem);
        //debugger
        var videoele = $("#videoplayerele")[0];
        if (videoitem.url == this.src)
        {
          var diff = Math.abs(obj.time - videoele.currentTime);

          if (videoele.paused)
          {
            if (obj.stat == 1)
            {
              if (diff > 1)
              {
                videoele.currentTime = obj.time;
              }
              videoele.play();
              this.isPlaying = true;
            }
            else
            {
              videoele.currentTime = obj.time;
            }
          }
          else
          {
            if (obj.stat == 0)
            {
              videoele.pause();
              this.isPlaying = false;
              videoele.currentTime = obj.time;
            }
            else
            {
              if (diff > 1)
              {
                videoele.currentTime = obj.time;
              }
            }
          }
        }
        else
        {
          this.src = videoitem.url;
          videoele.currentTime = obj.time;
          if (obj.stat == 1)
          {
            //videoele.play();
            $(videoele).attr("autoplay", "autoplay");
            this.isPlaying = true;
          }
          else
          {
            //videoele.pause();
            $(videoele).removeAttr("autoplay");
            this.isPlaying = false;
          }
        }

      },
      PreLoadVideo(url){
        this.src=url;
      },
      ShowVideo(videoitem)
      {
        if (videoitem == null)
        {
          return;
        }
        //console.log("ShowVideo:"+videoitem.url);
        var videoele = $("#videoplayerele");
        if(videoele.length<1) return;
        videoele.attr("src", videoitem.url);
        videoele.attr("autoplay", "autoplay");
        this.isPlaying = true;
        this.vid = videoitem.id;
        this.src = videoitem.url;
      },
      Play()
      {
        var videoele = $("#videoplayerele")[0];
        if (videoele && videoele.paused)
        {
          videoele.play();
        }
      },
      Pause()
      {
        var videoele = $("#videoplayerele")[0];
        if (videoele && !videoele.paused)
        {
          videoele.pause();
        }
      },
      Paused()
      {
        var videoele = $("#videoplayerele")[0];
        if (videoele && !videoele.paused)
        {
          return false;
        }
        return true;
      },
      fullScreen()
      {
        //console.log("fullScreen");
        var doc = document;
        var el = document.getElementById("videoplayer");
        var isInFullScreen = (doc.fullScreenElement && doc.fullScreenElement !== null) || (doc.msFullscreenElement && doc.msFullscreenElement !== null) || (doc.mozFullScreen || doc.webkitIsFullScreen);
        if (isInFullScreen)
        {
          var requestMethod = doc.cancelFullScreen || doc.webkitCancelFullScreen || doc.mozCancelFullScreen || doc.exitFullscreen || doc.msExitFullscreen;
          if (requestMethod)
          {
            requestMethod.call(doc);
            $("#videoplayertool-fullscreen").find(">I").removeClass("ivu-icon-arrow-shrink").addClass("ivu-icon-arrow-expand");
          }
        } else
        {
          var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
          if (requestMethod)
          {
            requestMethod.call(el);
            $("#videoplayertool-fullscreen").find(">I").removeClass("ivu-icon-arrow-expand").addClass("ivu-icon-arrow-shrink");
          }
        }
      },
      setShowClose(b)
      {
        //console.log("setShowClose:"+b);
        this.isShowClose = b;
      },
      setCanControl(b)
      {
        //console.log("setCanControl:"+b);
        this.canControl = b;
      },
      setVideoType(b)
      {
        this.type = b;
      },
      getUrl()
      {
        return this.src;
      },
      getVideoType()
      {
        return this.type;
      },
      onVolChange()
      {
        //console.log("onVolChange:" + this.vol);
        $("#videoplayerele")[0].volume = this.vol / 100;
      },
      onPlayTimeChange(val)
      {
        //console.log("onPlayTimeChange");
        var videoele = $("#videoplayerele")[0];
        videoele.currentTime = val;
        if (this.isPlayingBeforeDrag==1)
        {
          videoele.play();
        }
        this.isPlayingBeforeDrag = -1;
        this.isChangeTimeEnd = true;
        setTimeout(() =>
        {
          this.isChangeTimeEnd = false;
        }, 100);
      },
      onPlayTimeChanging(val)
      {
        if (this.isNotTrigEvent == true || this.isChangeTimeEnd==true)
        {
          return;
        }
        //console.log("onPlayTimeChanging");
        var videoele = $("#videoplayerele")[0];
        if (!videoele.paused)
        {
          videoele.pause();
          if (this.isPlayingBeforeDrag == -1) this.isPlayingBeforeDrag = 1;
        }
        else
        {
          if (this.isPlayingBeforeDrag == -1) this.isPlayingBeforeDrag = 0;
        }
        videoele.currentTime = val;
      },
      onVolTip(val)
      {
        return val + "%";
      },
      onCloseClick(power=false)
      {
        if (!this.canControl && power==false) return;
        if(!$("#liveplayvideo").is(":visible")) return;
        $("#liveplayvideo").hide();
        var videoele = $("#videoplayerele")[0];
        if (this.isPlaying)
        {
          if (videoele && !videoele.paused)
          {
            videoele.pause();
          }
          this.isPlaying = !this.isPlaying;
        }        
        //if (this.$parent.videoOnClose)
        {
          setTimeout(() =>
          {
            //this.$parent.videoOnClose();
            this.$emit("videoOnClose");
          }, 100);
          
        }
      },
      onScreenToolClick()
      {
        if (!this.canControl) return;
        this.isPlaying = !this.isPlaying;
        var videoele = $("#videoplayerele")[0];
        if (this.isPlaying)
        {
          if (videoele.paused)
          {
            videoele.play();
          }
        }
        else
        {
          if (!videoele.paused)
          {
            videoele.pause();
          }
        }
      }
    },
    computed: {
      getShowTotalTime()
      {
        if(isNaN(this.totalTime)) return "0";
        var hour = Math.floor(this.totalTime / 3600);
        var min = Math.floor((this.totalTime % 3600) / 60);
        var sec = Math.round(this.totalTime % 60);
        if (hour > 0)
        {
          return hour + ":" + min + ":" + (sec < 10 ? "0" + sec : sec + "");
        }
        else
        {
          return min + ":" + (sec < 10 ? "0" + sec : sec+"");
        }
      },
      getShowCurrentTime()
      {
        if(isNaN(this.currentPlayTime)) return "0";
        var hour = Math.floor(this.currentPlayTime / 3600);
        var min = Math.floor((this.currentPlayTime % 3600) / 60);
        var sec = Math.round(this.currentPlayTime % 60);
        if (hour > 0)
        {
          return hour + ":" + min + ":" + (sec < 10 ? "0" + sec : sec + "");
        }
        else
        {
          return min + ":" + (sec < 10 ? "0" + sec : sec + "");
        }
      },
      getShowPauseInfo()
      {
        return !this.isPlaying && !this.canControl;
      }
    }
  }
</script>
