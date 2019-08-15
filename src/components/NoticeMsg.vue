<template>
  <div id="noticemsg">
    <Modal title="课程正在进行中，是否加入？"
           v-model="startLessonDlg"
           okText="加入"
           cancelText="取消"
           :closable="false"
           @on-ok="lessonOK"
           @on-cancel="lessonCancel"
           :mask-closable="false"
           width="600">
      <media-setting preid="notice" ref="mediasetting"></media-setting>
    </Modal>
  </div>
</template>
<style lang="scss">
  $images-root: "../../static/images/"; .noticemsg-ctl-btn {
    display: inline-block;
    background-color: #8c98ae;
    height: 32px;
    width: 32px;
    margin: 3px;
    border-radius: 50%;
    line-height: 32px;
    font-size: 32px;
    text-align: center;
    padding: 7px;
    color: #fff;
    box-sizing: content-box !important;
  }

  .noticemsg-ctl-btn.disable {
    filter: grayscale(100%);
    background-color: #bdbdbd;
    opacity: 0.5;
  }
  .noticemsg-ctl-icon {
    background-repeat: no-repeat;
    display: inline-block;
    width: 32px;
    height: 32px;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    text-align: center;
    vertical-align: middle;
    background-size: 32px 32px;
    margin-top: -2px;
    box-sizing: content-box !important;
  }

  .noticemsg-ctl-icon-mic {
    background-image: url($images-root + "microphone.png");
  }

  .noticemsg-ctl-icon-camera {
    background-image: url($images-root + "camera.png");
  }
</style>
<script>
  import websocket from '../websocket/socket.js';
  import util from "../common/util.js";
  import authenticator from '../authenticator';
  import MediaSetting from './user/MediaSetting.vue';
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';

  export default {
    name: "NoticeMsg",
    data: function ()
    {
      return {
        obj: websocket,
        startLessonDlg: false,
        lessonTitle: "",
        lessonTeacher: "",
        messageInfo: null,
        noticeList: []
      };
    },
    _switchFileCalback: null,
    _kickoutCalback: null,
    _endMeetingCalback: null,
    _testmsg:"",
    mounted: function ()
    {
      var sessionid = authenticator.getUserToken();
      if (sessionid)
      {
        this.init();
      }

    },
    components: {
      MediaSetting,
    },
    computed:
    {
      ...mapGetters(['getInviteLesson'])
    },
    methods: {
      getsocket() {
        return websocket;
      },
      init()
      {
        let self = this;

        websocket.setreconnect(true);

        websocket.setkickoutcallback(() =>
        {          
          websocket.logout();
          setTimeout(() =>
          {
            let name = self.$route.name;
            let skip = name === 'login' || name === 'join' || name === 'register' || name === 'forgetPassworld';
            
            if (!skip)
            {
              var url = location.pathname+location.search;
              this.$router.push({ path: '/login', query: { ReturnUrl: url } });
              //this.$router.push('/login');
              if (this._kickoutCalback)
              {
                this._kickoutCalback();
              }
              //alert("You have been logged out because there is newer login activity from another device using the same account.");
            }
          }, 500);

        });

        websocket.setsendmessagecallback((d) =>
        {
          var str = utf8to16(base64decode(d.data));
          var obj = JSON.parse(str);
          if (obj.actionType == 1 || obj.actionType == 3)//start lesson
          {
            this.messageInfo = obj;
            if(obj.fromP1 && obj.fromP1==1)
            {
              if(obj.title)
              {
                util.MoveTitle(obj.title + " add to KloudSync success!","/static/images/kloudsync-red.png");
              }
              this.$router.push({ name: "docview", params: { id: obj.itemId } });
            }
            this.showNotice();
            //this.startLessonDlg = true;
            //this.$refs.mediasetting.init();

            
            var arrNotice = this.getInviteLesson;
            var index = this.findMeetingID(arrNotice, obj.meetingID + "");
            if (index == -1)
            {
              arrNotice.push(obj.meetingID + "&0");
            }
            else
            {
              arrNotice[index] = obj.meetingID + "&0";
            }
            this.changeInviteLesson(arrNotice);
            
          }
          else if (obj.actionType == 8)//switch file
          {
            this.changeAttachment(obj);
            //if (this._switchFileCalback) this._switchFileCalback(obj);
          }
          else if (obj.actionType == 9)//switch video
          {
            this.changeMsgVideoMode(obj.videoMode + "," + (obj.currentSessionID ? obj.currentSessionID : 0)+","+Math.random());
          }
          else if (obj.actionType == 10)//
          {
            this.showNotice();
            //this.startLessonDlg = true;
            //this.$refs.mediasetting.init();
            this.messageInfo = obj;
          }
          else if (obj.actionType == 11)//
          {
            this.changeLessonID(obj.incidentID);
          }
          else if (obj.actionType == 12)//screen resolution
          {
            this.changeScreenRes(obj.width + "," + obj.height);
          }
          else if (obj.actionType == 13)//hand
          {

          }
          else if (obj.actionType == 14)//audio
          {
            this.changeAudioMuteStat(obj.stat);
          }
          else if (obj.actionType == 15)//video
          {
            this.changeVideoMuteStat(obj.stat);
          }
          else if (obj.actionType == 16)//line id
          {
            this.changeAudioServerLineID(obj.lineId);
          }
          else if (obj.actionType == 17)//prepare
          {
            this.changePrepareMode(obj.prepareMode);
          }
          else if (obj.actionType == 18)//resolution
          {
            this.changeShareRes(obj.resolution);
          }
          else if (obj.actionType == 19)//play video info
          {
            //this.changePlayVideoInfo({ stat: obj.stat, time: obj.time, vid: obj.vid});
            this.changePlayVideoInfo(obj);
          }
          else if (obj.actionType == 21)//Hide or show camera bar
          {
            this.changeCameraBarStat(obj.isHide);
          }
          else if (obj.actionType == 23)//play audio
          {
            this.changeAutoPlayAudioInfo(obj);
          }
          else if (obj.actionType == 24)//lessonid change
          {
              this.changeTeacherLessonID(obj.lessonId);
          }
          else if (obj.actionType == 25)//size mode
          {
              this.changeSizeMode(obj.sizeMode);
          }
          else if (obj.actionType == 26)//remove attachment
          {
              this.changeRemoveItemID(obj.attachmentId);
          }
        });

        websocket.setendmeetingcallback((d) =>
        {
          if (this._endMeetingCalback)
          {
            this._endMeetingCalback(d);
          }
          var arrNotice = this.getInviteLesson;
          var index = this.findMeetingID(arrNotice, d.meetingId + "");
          if (index > -1)
          {
            arrNotice.splice(index, 1);
            this.changeInviteLesson(arrNotice);
          }
        });

        websocket.setafterlogincallback((d) =>
        {
          if (d.toJoinMeeting && 　d.toJoinMeeting != "")
          {
            //var arrNotice = this.getInviteLesson;
            var arrNotice = d.toJoinMeeting.split(",");
            this.changeInviteLesson(arrNotice);
          }

        });
        websocket.setkloudcallcallback((d) =>
        {
          if (d.retCode != 1)
          {
            return;
          }
          this.changeKloudCallStat(new Date().getTime());
        });

        websocket.init(() =>
        {
          var sessionid = authenticator.getUserToken();
          var name = authenticator.getUserName();

          authenticator.checkAuth();
          if (sessionid && authenticator.user.authenticated)
          {
            websocket.login(name);
          }

        }, true);

        websocket.onErrorMessage = (msg) =>
        {
          this.$Message.error(
            {
              content: msg,
              duration: 0,
              closable: true
            });
        };
        
      },
      findMeetingID(arr, str)
      {
          var j = arr.length;
          if (j == 0) return -1;
          for (var i = 0; i < j; i++)
          {
            if (arr[i].indexOf(str+"&")==0) return i;
          }
          return -1;
      },
      ToggleLoaclAudio()
      {
        var tar = $("#noticemsg-ctl-toggle-audio");
        if ($(tar).hasClass("disable"))
        {
          this.changeEnableAudio(true);
          $(tar).removeClass("disable");
        }
        else
        {
          $(tar).addClass("disable");
          this.changeEnableAudio(false);
        }
      },
      ToggleLoaclVideo()
      {
        var tar = $("#noticemsg-ctl-toggle-video");
        if ($(tar).hasClass("disable"))
        {
          $(tar).removeClass("disable");
          this.changeEnableVideo(true);
        }
        else
        {
          $(tar).addClass("disable");
          this.changeEnableVideo(false);
        }
      },
      setVideoAudioValue()
      {
        var tar = $("#noticemsg-ctl-toggle-audio");
        if ($(tar).hasClass("disable"))
        {
          this.changeEnableAudio(false);
        }
        else
        {
          this.changeEnableAudio(true);
        }

        var tar = $("#noticemsg-ctl-toggle-video");
        if ($(tar).hasClass("disable"))
        {
          this.changeEnableVideo(false);
        }
        else
        {
          this.changeEnableVideo(true);
        }
      },
      showNotice()
      {        
        var Notification = window.Notification || window.mozNotification || window.webkitNotification;
        if (Notification)
        {
          Notification.requestPermission((status)=>
          {
             if ("granted" != status)
            {
              this.startLessonDlg = true;
              this.$refs.mediasetting.init();
              return;
             }
             else
            {
              var tag = "pt-" + Math.random();
              var notify = new Notification(
                IsKloudSync()?"KloudSync":"PeerTime",
                {
                  dir: 'auto',
                  //lang: 'zh-CN',
                  tag: tag,
                  icon: IsKloudSync()? '/static/images/kloudsync.png':'/static/images/peertimeiocn.png',
                  body: this.messageInfo.title ? this.messageInfo.title:"课程正在进行中，是否加入？"
                }
              );
              notify.onclick = ()=>
              {
                window.focus();
                notify.close();
                this.lessonOK();
              },
                notify.onerror = () =>
              {
                console.log("notify.onerror");
              };
              notify.onshow = () =>
              {
                //setTimeout(function ()
                //{
                //  notify.close();
                //}, 2000)
              };
              notify.onclose = () =>
              {
                console.log("notify.onclose");
              };
            }
          });
        }
        else
        {
          this.startLessonDlg = true;
          this.$refs.mediasetting.init();
        }
      },
      closeNotice()
      {
        if (this.startLessonDlg == true)
        {
          this.startLessonDlg = false;
          this.$refs.mediasetting.saveUserSetting();
          this.$refs.mediasetting.end();
        }
      },
      lessonOK()
      {
        
        //this.setVideoAudioValue();
        this.closeNotice();

        this.changeLessonID(0);
        if (location.href.toLowerCase().indexOf("/live/" + this.messageInfo.meetingID) == -1 || this.$router.currentRoute.name!="live")
        {
          //console.log(this.messageInfo);
          if(this.messageInfo.fromP1 && this.messageInfo.fromP1==1)
          {
              //this.$router.push({ name: "myroom", params: { id: this.messageInfo.meetingID } });
          }
          else if (this.messageInfo.actionType == 10)
          {
            //this.$router.push({ name: 'live', params: { incidentid: this.messageInfo.meetingID, type: 1 } });
            //this.$router.go('/live/' + this.messageInfo.meetingID);
            //if (location.href.toLowerCase().indexOf("/live/") == -1)
            {
              this.$router.push('/live/' + this.messageInfo.meetingID);
            }
            //else
            //{
            //  window.location.href = '/live/' + this.messageInfo.meetingID;
            //}

          }
          else
          {

            //if (location.href.toLowerCase().indexOf("/live/") == -1)
            {
              this.$router.push('/live/' + this.messageInfo.meetingID);
            }
            //else
            //{
            //  window.location.href = '/live/' + this.messageInfo.meetingID;
            //}
          }

          //setTimeout(() =>
          //{
          //  this.changLessonState(1);
          //}, 500);
        }
        else
        {
          this.changLessonState(1);
        }
      },
      lessonCancel()
      {
        this.startLessonDlg = false;
        this.$refs.mediasetting.end();
      },
      onSwitchFile(callback)
      {
        this._switchFileCalback = callback;
      },
      onKickOut(callback)
      {
        this._kickoutCalback = callback;
      },
      onEndMeeting(callback)
      {
        this._endMeetingCalback = callback;
      },
      logout()
      {
        websocket.logout();
      },
      ...mapMutations(['changeAttachment', 'changeMsgVideoMode', 'changLessonState', 'changeInviteLesson', 'changeLessonID', 'changeEnableVideo', 'changeEnableAudio', 'changeScreenRes', 'changePrepareMode', 'changeAudioServerLineID', 'changeKloudCallStat', 'changeShareRes', 'changePlayVideoInfo', 'changeAudioMuteStat', 'changeVideoMuteStat','changeCameraBarStat','changeAutoPlayAudioInfo','changeTeacherLessonID','changeSizeMode','changeRemoveItemID'])
    }
  }
</script>
