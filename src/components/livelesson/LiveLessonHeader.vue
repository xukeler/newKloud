<template>
  <div id="liveHead" class="live-header" v-bind:class="{'in-practice': inPractice, 'in-lesson': inLesson}">
    <div class="left-logo">
      <span style="display:none;" class="peertime-logo"></span>
      <span style="line-height:20px; font-size:20px;">{{TopTitle}}</span>
    </div>
    <div class="main-router" style="display:none;">
      <Button type="text" :class="{'current': currentViewId === 'schedule'}" @click="goSchedule">Schedule</Button>
      <Button type="text" :class="{'current': currentViewId === 'history'}" @click="goHistory">Lessons</Button>
      <Button type="text" :class="{'current': currentViewId === 'courses'}" @click="goCourse">Course</Button>
    </div>
    <div class="middle-router" v-if="isLessonStart">
      <div style="display:none; line-height:50px; vertical-align:middle; padding-top:10px;">
        <span class="live-head-shareclass selected" @click="shareClass()"></span>
        <span class="live-head-sharescreen" @click="shareScreen()" v-if="showSharescreen"></span>
      </div>
      <span>{{statusTitle}}</span>
      <!--<span id="headerCurrentRouterIcon"></span>-->
    </div>
    <user-info></user-info>
    <div class="right-tools">
      <!--<button id="headerButtonClose" class="k-button button-highlight" @click="clickCloseLesson()">
        {{getCloseBtnTitle}}
      </button>-->
      <span id="headerButtonClose" @click="clickCloseLesson()">
        <img  src="../../../static/images/icon-quit.svg" alt="">
      </span>
    </div>
    <div class="middle-classRoom" style="display:none;">5888</div>
    <div class="right-tools liveLessonHeaderBtn" v-if="isShowCtlBtn">
      <button id="headerButtonPractice"  v-show="false && currentStatus === STATUS_EDIT" @click="clickPractice()">
        Prepare
      </button>
      <button id="headerButtonExitPractice" v-show="currentStatus === STATUS_PRACTICE" @click="clickExitPractice()">
        Exit Prepare
      </button>
      <button id="headerButtonStart"  v-show="currentStatus === STATUS_EDIT" @click="clickStartLesson()">
        <Icon type="play"></Icon>
        Start
      </button>
      <button id="headerButtonEnd" v-show="false" @click="clickEndLesson()">
        End Lesson
      </button>
    </div>

  </div>
</template>

<style scoped lang="scss">
  $header-height: 50px; // 76px;
  $images-root: "../../../static/images/";

  .header {
    height: $header-height;
    max-height: $header-height;
    background-color: #0061BB; //#091e37;
    color: white;
    width: 100%;

    div, span {
      display: inline-block;
    }
  .live-head-shareclass {
    background-image: url($images-root + "share-classroom.svg");
    background-size: 26px 26px;
    background-position: center center;
    background-repeat: no-repeat;
    width: 30px;
    height: 30px;
    background-color: #0061bb;
    display: inline-block;
    border-radius: 5px;
    cursor: pointer;
  }
    .live-head-shareclass.selected {
      background-color: #47aebb;
    }
  .live-head-sharescreen {
    background-image: url($images-root + "share-screen.svg");
    background-size: 26px 26px;
    background-position: center center;
    background-repeat: no-repeat;
    width: 30px;
    height: 30px;
    background-color: #0061bb;
    display: inline-block;
    border-radius: 5px;
    cursor: pointer;
  }
      .live-head-sharescreen.selected {
        background-color: #47aebb;
      }
    .left-logo{
      position: relative;
      float: left;
      height: $header-height;

      .peertime{
        font-family: Chalkduster, Magneto;
        font-size:36px;
        font-weight: bold;
        vertical-align: top;
        //padding-top: 10px;
        padding-left: 10px;
      }

      .peertime-logo{
        background-image: url($images-root + 'peertime_white.png');
        background-size: 138px 24px;
        background-repeat: no-repeat;
        background-position: center;
        width: 138px;
        height: $header-height;
        margin-left: 24px;
      }
    }

    .middle-router {
      font-size: 24px;
      font-weight: bold;
      line-height: $header-height;
      position: relative;


      #headerCurrentRouterIcon {
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

  .in-practice {
    background-color: #00184C;
  }

  .in-lesson {
    background-color: #3D3D3D;
  }

  .live-header {
    height: $header-height;
    max-height: $header-height;
    background-color: #007EAE;
    color: white;
    width: 100%;
    text-align: left;
    vertical-align: middle;
    position: relative;
    box-shadow: 0 2px 4px rgba(3,63,115,0.3);
    z-index: 11;
    div, span

  {
    display: inline-block;
  }
  .middle-classRoom{
    position: absolute;
    width:400px;
    height: $header-height;
    left:calc(50% - 200px);
    line-height: $header-height;
    text-align: center;
    font-size: 13px;
  }
  .right-tools {
    float: right;
    font-size: 24px;

    .k-button

  {
    font-size: 14px;
    font-weight: bold;
    padding: 2px 12px;
    background-color: transparent;
    color: white;
  }

  .button-highlight {
    background-color: #C63838;
  }

  }
  .middle-router {
    font-size: 24px;
    font-weight: bold;
    line-height: $header-height;
    position: absolute;
    left: 700px;

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
  .live-head-shareclass {
    background-image: url($images-root + "share-classroom.svg");
    background-size: 26px 26px;
    background-position: center center;
    background-repeat: no-repeat;
    width: 30px;
    height: 30px;
    background-color: #409aae;
    display: inline-block;
    border-radius: 5px;
    cursor: pointer;
  }

    .live-head-shareclass.selected {
      background-color: #47aebb;
    }

  .live-head-sharescreen {
    background-image: url($images-root + "share-screen.svg");
    background-size: 26px 26px;
    background-position: center center;
    background-repeat: no-repeat;
    width: 30px;
    height: 30px;
    background-color: #409aae;
    display: inline-block;
    border-radius: 5px;
    cursor: pointer;
  }

    .live-head-sharescreen.selected {
      background-color: #47aebb;
    }
  }
  .left-logo {
    position: relative;
    float: left;
    height: $header-height;
    .peertime-logo

  {
    background-image: url($images-root + 'logo.svg');
    background-size: 118px 20px;
    background-repeat: no-repeat;
    background-position: center;
    width: 118px;
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

  #headerButtonClose{ padding-top: 10px; cursor: pointer}
  .liveLessonHeaderBtn{ padding: 2px 12px 0 0;}
  .liveLessonHeaderBtn button{ background: #1DB1E9; cursor: pointer; border: none; color: #fff; font-size: 13px; line-height: 28px; padding: 0 30px; border-radius: 14px;}
  .liveLessonHeaderBtn button:hover{ background: #1DCEE9; }
</style>

<script>
  import authenticator from '../../authenticator'
  import UserInfo from '../user/UserInfo.vue';
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
  import util from "../../common/util.js";
  export default {
    _timer:null,
    data: function () {
      return {
        STATUS_EDIT: 0,
        STATUS_PRACTICE: 1,
        STATUS_LESSON: 2,
        STATUS_SCREEN: 3,
        userName: authenticator.getUserName(),
        currentStatus: 0,
        isLessonStart: false,
        showSharescreen:true
      }
    },
    props: ["currentViewId","Role","TopTitle"],
    computed:{
      statusTitle: function () {
        switch (this.currentStatus){
          default:
          case this.STATUS_EDIT:
            return "Edit Lesson";

          case this.STATUS_PRACTICE:
            return "Practice Lesson";

          case this.STATUS_LESSON:
            return "Share Lesson";
          case this.STATUS_SCREEN:
            return "Share Screen";
        }
      },
      inPractice: function () {
        return this.currentStatus === this.STATUS_PRACTICE;
      },
      inLesson: function () {
        return this.currentStatus === this.STATUS_LESSON;
      },
      isShowCtlBtn: function ()
      {
        return this.Role == 2;
      },
      getCloseBtnTitle()
      {
        if (this.Role == 2)
        {
          if (this.isLessonStart)
          {
            return "End Lesson";
          }
          else
          {
            return "Close";
          }
        }
        else
        {
          return "Leave";
        }
      },
      ...mapGetters(['getLessonID','getShareMode'])
    },
    components: {
      UserInfo
    },
    mounted: function ()
    {
      util.LoadKendoFiles().then(()=>{
        $("#menu").kendoMenu();
      });
    },
    methods: {
      clickPractice: function () {
        //this.currentStatus = this.STATUS_PRACTICE;
        this.isLessonStart = true;
        $("#liveHead").find("div.main-router").hide();
        this.$parent.prepareLesson4Head();
      },
      clickExitPractice: function () {
        this.currentStatus = this.STATUS_EDIT;
      },
      clickStartLesson: function ()
      {
        this.isLessonStart = true;
        this.currentStatus = this.STATUS_LESSON;
        $("#liveHead").find("div.main-router").hide();
        this.$parent.StartLesson4Head();
        //this.$parent.isLessonStart = true;

      },
      clickEndLesson: function ()
      {
        this.isLessonStart = false;
        this.currentStatus = this.STATUS_EDIT;
        $("#liveHead").find("div.main-router").show();
        this.$parent.EndMdeia();
        //this.$parent.isLessonStart = false;
      },
      clickCloseLesson()
      {
        this.clickEndLesson();
        this.$parent.clickClose(true);
        //this.$router.push('/');
      },
      ToStartLessonStat()
      {
        this.isLessonStart = true;
        this.currentStatus = this.STATUS_LESSON;
        $("#liveHead").find("div.main-router").hide();
      },
      UsermouseOver()
      {
        if (this._timer) clearTimeout(this._timer);
        $("#usersetmenu").show();
      },
      UsermouseOut()
      {
        this._timer=setTimeout(() =>
        {
          $("#usersetmenu").hide();
        },200);

      },
      tomyfavorite(){
        this.$router.push('/user/favorite');
      },
      tousesetting()
      {
        this.$router.push('/user/setting');
      },
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
      },
      logout()
      {
        authenticator.logout(this);
        this.$parent.$parent.$refs.noticemsg.logout();
        this.$router.push('/login');
      },
      shareClass()
      {
        this.currentStatus = this.STATUS_LESSON;
        $("span.live-head-shareclass").addClass("selected");
        $("span.live-head-sharescreen").removeClass("selected");
        this.changShareMode(0);
      },
      shareScreen()
      {
        if (!Browser.isChrome())
        {
          this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: "Current browser not support this function, Please use Chrome browser to share screen!", top: 24,duration: 4, left:true });
          return;
        }
        this.currentStatus = this.STATUS_SCREEN;
        $("span.live-head-shareclass").removeClass("selected");
        $("span.live-head-sharescreen").addClass("selected");
        var mode = this.getShareMode;
        if (mode % 10 == 1)
        {
          this.changShareMode(mode+10);
        }
        else
        {
          this.changShareMode(1);
        }

      },
      ...mapMutations(['changShareMode','changeLessonID'])
    }
  }
</script>
