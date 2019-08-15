<template>
  <div id="twilioview" style="display:none;" class="twilioview">
    <div id="twilioview-list" style="right:420px;top:30px;" class="listview">
      <div class="twilioview-listview-header" id="twilioview-listview-header">
        <span class="listview-title"></span>
        <div class="listview-panel-actions">
          <a class="listview-panel-action" id="listview-ctl-close" style="float:right;" @click.stop="closeVideoView()"><span class="k-icon k-i-close"></span></a>
          
        </div>
      </div>
      <div :id="'div_'+item.peerId" class='listcontainer' style='height:90px;' v-for="item in listVideo">
        <div :id="'mediavideoctl-'+item.peerId" class="media-video-ctl">
        <span v-show="item.isSelf" title="Video is enable" :class="item.enableVideo?'media-icon-webcam-enable-small':'media-icon-webcam-disable-small'" @click.stop="VideoToggle($event)"></span>
        <span v-show="item.isSelf" title="Audio is enable" :class="item.enableAudio?'media-icon-mic-enable-small':'media-icon-mic-disable-small'" @click.stop="AudioToggle($event)"></span>
        </div>
        <div :id="'username_'+item.peerId" class="username">{{item.username}}</div>
          <video :id="'video_'+item.peerId" class="listvideo" autoplay></video>
        </div>
      </div>
    <div id="twilioview-full" style="display:none;" class="fullview">
      <div :id="'div_'+item.peerId" class='fullcontainer' :style="'width:'+item.width+'px;height:'+item.height+'px;'" v-for="item in fullVideo">
        <div :id="'mediavideoctl-'+item.peerId" class="media-video-ctl">
          <span v-show="item.isSelf" title="Video is enable" :class="item.enableVideo?'media-icon-webcam-enable':'media-icon-webcam-disable'" @click.stop="VideoToggle($event)"></span>
          <span v-show="item.isSelf" title="Audio is enable" :class="item.enableAudio?'media-icon-mic-enable':'media-icon-mic-disable'" @click.stop="AudioToggle($event)"></span>
          <span title="Max" class="media-icon-tomaxview" @click.stop="ToOneBigView($event)"></span>
        </div>
        <div :id="'username_'+item.peerId" class="username">{{item.username}}</div>
        <video :id="'video_'+item.peerId" class="fullvideo" autoplay></video>
      </div>
    </div>
    <div id="twilioview-onebig" style="display:none;" class="onebigview">
      <div style="position:absolute;top:5px; right:5px;width: 120px; z-index:3;">
        <div :id="'div_'+item.peerId" class='listcontainer' style='height:90px;' v-for="item in onebigVideo">
          <div :id="'mediavideoctl-'+item.peerId" class="media-video-ctl">
            <span v-show="item.isSelf" title="Video is enable" :class="item.enableVideo?'media-icon-webcam-enable-small':'media-icon-webcam-disable-small'" @click.stop="VideoToggle($event)"></span>
            <span v-show="item.isSelf" title="Audio is enable" :class="item.enableAudio?'media-icon-mic-enable-small':'media-icon-mic-disable-small'" @click.stop="AudioToggle($event)"></span>
            <span  title="Max" class="media-icon-tomaxview-small" @click.stop="ToOneBigView($event)"></span>
          </div>
          <div :id="'username_'+item.peerId" class="username">{{item.username}}</div>
          <video :id="'video_'+item.peerId" class="listvideo" autoplay></video>
        </div>
      </div>
      <div :id="'div_'+bigitem.peerId" class='onebigviewcontainer' :style="'width:'+bigitem.width+'px;height:'+bigitem.height+'px;'" v-for="bigitem in onebigUserVideo">
        <div :id="'mediavideoctl-'+bigitem.peerId" class="media-video-ctl">
          <span v-show="bigitem.isSelf" title="Video is enable" :class="bigitem.enableVideo?'media-icon-webcam-enable':'media-icon-webcam-disable'" @click.stop="VideoToggle($event)"></span>
          <span v-show="bigitem.isSelf" title="Audio is enable" :class="bigitem.enableAudio?'media-icon-mic-enable':'media-icon-mic-disable'" @click.stop="AudioToggle($event)"></span>
          <span title="Min" class="media-icon-tominview" @click.stop="fullVideoView();"></span>
        </div>
        <div :id="'username_'+bigitem.peerId" class="username">{{bigitem.username}}</div>
        <video :id="'video_'+bigitem.peerId" class="fullvideo" autoplay></video>
      </div>
    </div>
    <div id="twilioview-screen" style="display:none;" class="screenview">
      <div :id="'div_'+item.peerId" class='fullcontainer' :style="'width:'+item.width+'px;height:'+item.height+'px;'" v-for="item in screenVideo">
        <video :id="'video_'+item.peerId" class="fullvideo" autoplay></video>
      </div>
    </div>
    </div>
</template>
<style scoped lang="scss">
  $header-height: 50px;
  $images-root: "../../../static/images/";
  .twilioview{
    display:none;

    .username
  {
    position: absolute;
    left: 0px;
    top: 0px;
    font-size:12px;
    color:white;
  }
    .listview
  {
    position: absolute;
    width: 120px;
    z-index: 10002;
  }
  .listcontainer {
    width: 120px;
    height: 90px;
    border: 0px;
    padding: 0px;
    position:relative;
  }
    .listcontainer:hover .media-video-ctl {
      visibility: visible;
    }
  .listvideo {
    width: 120px;
    height: 90px;
    border: 0px;
    margin: 0px;
    padding: 0px;
    background-color:black;
  }
  .fullview {
    display:none;
    position:absolute;
    top:0px;
    left:0px;
    text-align:left;
    padding:0px;
    margin:0px;
  }
  .fullvideo {
    width: 100%;
    height: 100%;
    background-color: black;
  }
  .fullcontainer {
    border: 0px;
    padding: 0px;
    float: left;
    position:relative;
  }

    .fullcontainer:hover .media-video-ctl {
      visibility: visible;
    }
  .onebigview {
    top: 0px;
    left: 0px;
    position: relative;
  }
  .onebigviewcontainer {
    border: 0px;
    padding: 0px;
    float: left;
    position: relative;
  }

    .onebigviewcontainer:hover > .media-video-ctl {
      visibility: visible;
    }
  .onebigvideo {
    width: 120px;
    height: 90px;
    background-color: black;
  }
  .screenview {
    position: absolute;
    top: 0px;
    left: 0px;
    text-align: left;
    padding: 0px;
    margin: 0px;
  }
  .twilioview-listview-header {
    /*position: absolute;*/
    /*border-color: #ccc;*/
    border-radius: 4px 4px 0 0;
    /*background-color: #f5f5f5;*/
    color: #333;
    width: 100%;
    height: 26px;
    /*border-bottom-style: solid;
    border-bottom-width: 1px;*/
    padding: 0 0;
    font-size: 1.2em;
    white-space: nowrap;
    min-height: 16px;
    cursor: move;
    background-color: #fff;
    border: solid 1px #ccc;
    /*background: linear-gradient(to right, #0780AB, #4DDFCD);*/
  }
  .listview-title {
    position: absolute;
    left: .44em;
    right: .44em;
    overflow: hidden;
    cursor: default;
    text-overflow: ellipsis;
    padding-top: 5px;
    text-align: left;
    cursor: move;
  }
  .listview-panel-actions {
    position: absolute;
    top: 0;
    left: 0.3em;
    width: 100%;
    padding-right: 5px;
  }

  .listview-panel-action {
    display: inline-block;
    width: 24px;
    height: 24px;
    padding: 2px;
    text-decoration: none;
    opacity: .7;
    color: #333;
    border-color: transparent;
    border-radius: 4px;
  }

  }

 
</style>
<script>
  import authenticator from '../../authenticator'
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
  const Video = Twilio.Video;

  var sl = null;
  var slScreen = null;
  var userMap = null;
  var prePoz = 420;
  var preTop = 30;
  var ROOM = null;
  var previewTracks = null;

  export default {
    data: function () {
      return {
        videoMode: 0,
        userID: 0,
        userName: "",
        userRole: 0,
        meetingID:"",
        localStream: null,
        myPeerID: "",
        preMaxUser:"",
        listVideo: [],
        fullVideo: [],
        onebigVideo: [],
        onebigUserVideo: [],
        screenVideo: [],
        cameraList: [],
        micList: [],
        speakerList: [],
        enableAudio: true,
        enableVideo: true
      }
    },
    components: {
    },
    mounted: function ()
    {
      this.Init();
      this.getDevices();
    },
    computed: {
      ...mapGetters(['getLessonID', 'getScreenRes'])
    },
    methods: {
      Init()
      {
        userMap = new JsMap();
      },
      JoinMedia(meetingid, userid, username, role, enableVideo, enableAudio, callback)
      {
        $("#twilioview").show();
        this.startDrag();
        this.userID = userid;
        this.userName = username;
        this.userRole = role;
        this.meetingID = meetingid + "";
        if (typeof enableVideo == "undefined") enableVideo = true;
        if (typeof enableAudio == "undefined") enableAudio = true;
        this.enableAudio = enableAudio;
        this.enableVideo = enableVideo;


        this.SubscribeEvents();
        var setting = this.getMideaSetting();
        var getMediaSetting = { name: this.meetingID, audio: true, video: { width: 160 } };

        //if (setting.micpid != "")
        //{
        //  getMediaSetting.audio = {
        //    sourceId: setting.micpid
        //  };
        //}
        //if (setting.hasvideo)
        //{
        //  if (setting.camerid != "")
        //  {
        //    getMediaSetting.video =
        //      {
        //        resolution: sl.VIDEO_RESOLUTION.QVGA,
        //        frameRate: 5,
        //        sourceId: setting.camerid
        //      };
        //  }
        //  else
        //  {
        //    getMediaSetting.video =
        //      {
        //        resolution: sl.VIDEO_RESOLUTION.QVGA,
        //        frameRate: 5
        //      };
        //  }

        //}
        this.getToken(0).then(token =>
        {

        //var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2RjMDJjZDg1OTA3OWMyZjdkNDlmNzY2NGM5MGFhZWYyLTE1MjE0Mjc0ODUiLCJpc3MiOiJTS2RjMDJjZDg1OTA3OWMyZjdkNDlmNzY2NGM5MGFhZWYyIiwic3ViIjoiQUM3OGJmZGI5YjJlZWVjOTRhMmFlOWM3YWI1ODZlMTJjZSIsImV4cCI6MTUyMTQzMTA4NSwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiMTM3IiwidmlkZW8iOnt9fX0.MUGfVRPozDXOPhnSv4r4jk60rk1NlZ5ZhW7gC4hskuM";

          Video.connect(token, {
            name: this.meetingID,
            audio: true,
            video: { width: 160 }
          }).then(room =>
          {
            ROOM = room;
            console.log('Connected to Room "%s"', room.name);

            room.participants.forEach(this.participantConnected);
            room.on('participantConnected', this.participantConnected);

            room.on('participantDisconnected', this.participantDisconnected);
            room.once('disconnected', error => room.participants.forEach(this.participantDisconnected));

            this.ShowMe();
          });
        });
      },
      participantConnected(participant)
      {
        console.log('Participant "%s" "%s" connected', participant.identity, participant.trackName);
        const div = document.createElement('div');
        div.id = participant.sid;
        div.title = participant.identity;

        participant.on('trackAdded', track => this.trackAdded(div, track));
        participant.tracks.forEach(track => this.trackAdded(div, track));
        participant.on('trackRemoved', this.trackRemoved);

        document.getElementById("twilioview-list").appendChild(div);
      },
      participantDisconnected(participant)
      {
        console.log('Participant "%s" disconnected', participant.identity);

        participant.tracks.forEach(this.trackRemoved);
        document.getElementById(participant.sid).remove();
      },
      trackAdded(div, track)
      {
        div.appendChild(track.attach());
      },
      trackRemoved(track)
      {
        track.detach().forEach(element => element.remove());
      },
      ShowMe()
      {
        var localTracksPromise = previewTracks
          ? Promise.resolve(previewTracks)
          : Twilio.Video.createLocalTracks();

        localTracksPromise.then((tracks)=>
        {
          window.previewTracks = previewTracks = tracks;
          var previewContainer = document.getElementById('twilioview-list');
          this.attachTracks(tracks, previewContainer);

        }, function (error)
          {
            console.error('Unable to access local media', error);
          });
      },
      attachTracks(tracks, container)
      {
        tracks.forEach(function (track)
        {
          container.appendChild(track.attach());
        });
      },
      SubscribeEvents()
      {
      
      },
      DisplayStream(peerId, stream, isSelf)
      {
        //console.log("DisplayStream:" + peerId);
        //$("#div_" + peerId).remove();
        var userData = userMap.get(peerId);
        var usename = "";
        //console.log("IsShareScreen:" + userData.IsShareScreen);
        if (userData && typeof (userData.IsShareScreen)!="undefined" && userData.IsShareScreen == true)
        {
          if (userData.UserID != this.userID)
          {
            this.ShowScreenStream(peerId, stream);
          }
          return;
        }
        if (userData && userData.UserName)
        {
          usename = userData.UserName;
        }
        if (userData && userData.UserID==this.userID)
        {
          isSelf = true;
        }
        let videoinfo = {
          peerId: peerId,
          isSelf: isSelf,
          isMuted: isSelf,
          username: usename,
          enableAudio: isSelf && this.enableAudio,
          enableVideo: isSelf && this.enableVideo
        };
        if (this.videoMode == 0)
        {
          this.listVideo.push(videoinfo);
        }
        else if (this.videoMode == 1)
        {
          var size = this.getMaxSize4FullScreenList();
          videoinfo.width = size[0];
          videoinfo.height = size[1];
          this.fullVideo.push(videoinfo);
          $('#twilioview-full').width(size[2] + "px").height(size[3] + "px");
        }
        else
        {
          //console.log("onebigVideo ++");
          this.onebigVideo.push(videoinfo);
        }
        var delayload = () =>
        {
          setTimeout(() =>
          {
            if (gid("video_" + peerId))
            {
              attachMediaStream(gid("video_" + peerId), stream);
              if (isSelf)
              {
                gid("video_" + peerId).muted = true;
              }
            }
            else
            {
              delayload();
            }
          }, 500);
        };
        delayload();
        return;

        var peerVideo = document.createElement('video');
        peerVideo.id = peerId + '_video';
        peerVideo.autoplay = 'autoplay';
        

        if (isSelf)
        {
          peerVideo.muted = 'muted';
        }
        attachMediaStream(peerVideo, stream);

        if (this.videoMode == 0)
        {
          peerVideo.className = "listvideo";
          var html = "<div id='div_" + peerId + "' class='listcontainer' style='height:90px;'>";
          html += '<div id="mediavideoctl-' + peerId + '" class="media-video-ctl" ><span title="Video is enable" class="media-icon-webcam-enable-small"></span><span title="Audio is enable" class="media-icon-mic-enable-small"></span></div>';
          html += "</div>";
          $('#twilioview-list').append(html);
          document.getElementById('div_' + peerId).appendChild(peerVideo);
          $(peerVideo).width("120px");
        }
        else if (this.videoMode == 1)
        {
          peerVideo.className = "fullvideo";
          var size = this.getMaxSize4FullScreenList();
          var html = "<div id='div_" + peerId + "' class='fullcontainer' style='width:" + size[0] + "px;height:" + size[1] + "px; float:left;'>";
          html += '<div id="mediavideoctl-' + peerId + '" class="media-video-ctl" ><span title="Video is enable" class="media-icon-webcam-enable"></span><span title="Audio is enable" class="media-icon-mic-enable"></span></div>';
          html += "</div>";
          $('#twilioview-full').append(html);
          document.getElementById('div_' + peerId).appendChild(peerVideo);
          $('#twilioview-full').width(size[2] + "px").height(size[3] + "px");
          $(peerVideo).width(size[0]+"px");
        }
        else
        {
          peerVideo.className = "onebigvideo";
          document.getElementById('twilioview-onebig').appendChild(peerVideo);
        }
        
      },
      ShowScreenStream(peerId, stream)
      {
        $("#twilioview-screen").show();
        var isSelf = false;
        var res = this.getScreenRes;
        var arr = res.split(",");
        if (arr.length != 2)
        {
          arr = [16,9];
        }
        var size = this.getMaxSize4ShareScreen(parseInt(arr[0]), parseInt(arr[1]));
        let videoinfo = {
          peerId: peerId,
          isSelf: isSelf,
          isMuted: isSelf
        };
        videoinfo.width = size[0];
        videoinfo.height = size[1];
        this.screenVideo.push(videoinfo);


        var delayload = () =>
        {
          setTimeout(() =>
          {
            if (gid("video_" + peerId))
            {
              attachMediaStream(gid("video_" + peerId), stream);
            }
            else
            {
              delayload();
            }
          }, 500);
        };
        delayload();
        $(window).bind("resize", this.ShareScreenSizeChange);
        return;

        var peerVideo = document.createElement('video');
        peerVideo.id = peerId + '_video';
        peerVideo.autoplay = 'autoplay';
        attachMediaStream(peerVideo, stream);
        document.getElementById('twilioview-screen').appendChild(peerVideo);
        var size = this.getMaxSize4FullScreen();
        $('#twilioview-screen').width(size[0] + "px").height(size[1] + "px");
        $(peerVideo).width(size[0] + "px");
      },
      ShowBigUserStream(peerId, stream, isSelf)
      {
        //console.log("ShowBigUserStream:" + peerId);

        //var isSelf = false;
        var userData = userMap.get(peerId);
        var usename = "";
        if (userData && userData.UserName)
        {
          usename = userData.UserName;
        }
        var size = this.getMaxSize4FullScreen();
        let videoinfo = {
          peerId: peerId,
          isSelf: isSelf,
          isMuted: isSelf,
          username: usename,
          enableAudio: isSelf && this.enableAudio,
          enableVideo: isSelf && this.enableVideo,
          width: size[0],
          height: size[1]
        };
        //videoinfo.width = size[0];
        //videoinfo.height = size[1];
        //console.log(videoinfo);
        this.onebigUserVideo.push(videoinfo);


        //console.log(this.onebigUserVideo.length);
        $('#twilioview-onebig').width(size[0] + "px").height(size[1] + "px");
        var userData = userMap.get(peerId);
        if (userData && userData.UserID)
        {
          this.$parent.NoticeMeeting(2, userData.UserID + "");
        }
        var delayload = () =>
        {
          setTimeout(() =>
          {
            if (gid("video_" + peerId))
            {
              attachMediaStream(gid("video_" + peerId), stream);
            }
            else
            {
              delayload();
            }
          }, 500);
        };
        delayload();
        return;
      },
      ShareScreenSizeChange(e)
      {        
        var res = this.getScreenRes;
        var arr = res.split(",");
        if (arr.length != 2)
        {
          arr = [16, 9];
        }
        var size = this.getMaxSize4ShareScreen(parseInt(arr[0]), parseInt(arr[1]));
        //console.log("ShareScreenSizeChange:"+size.join(","));
        var videoitem = $("#twilioview-screen").find("video").parent();
        videoitem.css({ "width": size[0] + "px", "height": size[1] + "px" });
      },
      RemoveStream(peerId)
      {
        //console.log("RemoveStream:"+peerId);
        var userData = userMap.get(peerId);
        if (userData && typeof (userData.IsShareScreen) != "undefined" && userData.IsShareScreen == true)
        {
          $(window).unbind("resize", this.ShareScreenSizeChange);
          $("#twilioview-screen").hide();
        }
        if (this.videoMode == 0)
        {
          for (let i = 0, j = this.listVideo.length; i < j; i++)
          {
            if (this.listVideo[i].peerId + "" == peerId + "")
            {
              this.listVideo.splice(i, 1);
              return;
            }
          }
        }
        else if (this.videoMode == 1)
        {
          for (let i = 0, j = this.fullVideo.length; i < j; i++)
          {
            if (this.fullVideo[i].peerId + "" == peerId + "")
            {
              this.fullVideo.splice(i, 1);
              return;
            }
          }
        }
        else
        {
          for (let i = 0, j = this.onebigVideo.length; i < j; i++)
          {
            if (this.onebigVideo[i].peerId + "" == peerId + "")
            {
              this.onebigVideo.splice(i, 1);
              return;
            }
          }
        }

        //$("#" + peerId + "_video").remove();
      },
      ClearStream()
      {
        //console.log("ClearStream");

        //$("#twilioview-list").find("div.fullcontainer,div.listcontainer").remove();
        $("#twilioview-list").hide();

        //$("#twilioview-onebig").find("div.onebigviewcontainer,div.listcontainer").remove();
        $("#twilioview-onebig").hide();

        $("#twilioview-full,#twilioview-screen").hide();//.empty()

        this.listVideo = [];
        this.fullVideo = [];
        this.onebigVideo = [];
        this.onebigUserVideo = [];
        this.screenVideo = [];


        //this.listVideo.splice(0, this.listVideo.length);
        //this.fullVideo.splice(0, this.fullVideo.length);
        //this.onebigVideo.splice(0, this.onebigVideo.length);
        //this.onebigUserVideo.splice(0, this.onebigUserVideo.length);
        //this.screenVideo.splice(0, this.screenVideo.length);
      },
      Leave()
      {
        //console.log("leave");
        $("#twilioview").hide();
        
        return new Promise((resolve, reject)=>
        {
          ROOM.disconnect();
          this.Reset();
          resolve(true);
          //var userPeerInfo = sl.getPeerInfo();
          //if (userPeerInfo && userPeerInfo.room && userPeerInfo.room != "" && userPeerInfo.room.length<32)
          //{
          //  console.log("leave room:"+userPeerInfo.room);
          //  sl.leaveRoom(true, () =>
          //  {
          //    this.Reset();
          //    resolve(true);
          //  });
          //}
          //else
          //{
          //  this.Reset();
          //  resolve(true);
          //}
        });
      },
      Reset()
      {
        this.localStream = null;
        this.videoMode = 0;
        this.listVideo = [];
        this.fullVideo = [];
        this.onebigVideo = [];
        this.onebigUserVideo = [];
        this.screenVideo = [];

        sl = null;
        userMap = null;

        
        this.Init();
      },
      StartShareScreen()
      {
        var data = { UserName: this.userName, UserID: this.userID, UserRole: this.userRole, IsShareScreen: true };
        slScreen = new Skylink();

        slScreen.init(SKYLINK_APPID, (initErr, initSuccess) =>
        {
          if (initErr)
          {
            setTimeout(() => { this.StartShareScreen(); }, 1000)
          }
          slScreen.setUserData(data);
          slScreen.joinRoom(this.meetingID, function (error, success)
          {
            if (error) return;

            slScreen.shareScreen(false, function (sSError, sSSuccess)
            {
              if (sSError) return;
            });
          });
        });      },
      StopShareScreen()
      {
        if (slScreen == null)
        {
          return;
        }
        slScreen.stopScreen();
        try
        {
          slScreen.leaveRoom(true, () =>
          {
          });
        }
        catch (ex) { }

        slScreen = null;

        //var data = { UserName: this.UserName, UserID: this.userID, UserRole: this.userRole, IsShareScreen: false };
        //sl.setUserData(data);
      },
      getMideaSetting()
      {
        var camerid = "";
        var micpid = "";
        var res = "";
        var enablevideo = true;
        var enableaudio = true;
        var mic = localStorage.getItem('DefaultMic');
        var camera = localStorage.getItem('DefaultCamera');
        var cameraSecond = localStorage.getItem('DefaultSecondCamera');
        var useSecond = localStorage.getItem('UseSecondCamera');
        var resl = localStorage.getItem('DefaultResolution');
        if (mic && mic != null && mic != "" && mic != "default")
        {
          micpid = mic;
        }
        if (!IsExistInArr(this.micList, micpid))
        {
          micpid = "";
        }
        if (this.enableAudio==false || this.micList.length < 1)
        {
          enableaudio = false;
        }
        if (camera && camera != null && camera != "" && camera != "default")
        {
          camerid = camera;
        }
        if (!IsExistInArr(this.cameraList, camerid))
        {
          camerid = "";
        }
        if (cameraSecond && cameraSecond != null && cameraSecond != "" && camerid != "" && useSecond != null && useSecond == "1")
        {
          camerid = cameraSecond;
        }
        if (!IsExistInArr(this.cameraList, camerid))
        {
          camerid = "";
        }
        if (this.enableVideo==false || this.cameraList.length < 1)
        {
          enablevideo = false;
        }
        if (resl && resl != "")
        {
          res = resl.toLowerCase();
        }
        return { camerid: camerid, enablevideo: enablevideo, micpid: micpid, enableaudio: enableaudio, resolution: res, hasaudio: this.micList.length > 0, hasvideo: this.cameraList.length>0};
      },
      getDevices()
      {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)
        {
          navigator.mediaDevices.enumerateDevices().then((devices) =>
          {
            devices.forEach((device) =>
            {
              if (device.kind == "audiooutput")
              {
                this.speakerList.push(device.deviceId);
              }
              else if (device.kind === 'audioinput')
              {
                this.micList.push(device.deviceId);
              } else if (device.kind === 'videoinput')
              {
                this.cameraList.push(device.deviceId);
              }
            });
          });
        }
      },
      showAllStream()
      {
        var streams = sl.getPeersStream();
        var oneBigPeerID = "";
        if (this.videoMode == 2)
        {
          oneBigPeerID = this.getOneBigUserPeerID(streams);
        }
        //console.log("showAllStream oneBigPeerID:" + oneBigPeerID);
        //if (oneBigPeerID != "")
        //{
        //  this.ShowBigUserStream(oneBigPeerID, streams[oneBigPeerID].stream, streams[oneBigPeerID].isSelf);
        //}
        for (var peerId in streams)
        {
          if (streams[peerId].stream == null)
          {
            continue;
          }
          if (this.videoMode == 2 && oneBigPeerID == peerId)
          {
            this.ShowBigUserStream(peerId, streams[peerId].stream, streams[peerId].isSelf);
          }
          else
          {
            this.DisplayStream(peerId, streams[peerId].stream, streams[peerId].isSelf);
          }
        }
      },
      getOneBigUserPeerID(streams)
      {
        var firstPeerId = "";
        for (var peerId in streams)
        {
          if (streams[peerId].stream == null)
          {
            continue;
          }
          if (firstPeerId == "")
          {
            firstPeerId = peerId;
          }
          var userData = userMap.get(peerId);
          if (userData && userData.UserID && userData.IsShareScreen==false && userData.UserID+""==this.preMaxUser+"")
          {
            return peerId;
          }
          
        }
        return firstPeerId;
      },
      minFullScreen()
      {
        //console.log("minFullScreen");
        this.videoMode = 0;
        this.ClearStream();
        $("#twilioview-list,#twilioview-full,#twilioview-onebig,#twilioview-screen").hide();
        $("#twilioview-list").show();
        this.showAllStream();
      },
      fullVideoView()
      {
        //console.log("fullVideoView");
        this.videoMode = 1;
        this.ClearStream();
        $("#twilioview-list,#twilioview-full,#twilioview-onebig,#twilioview-screen").hide();
        $("#twilioview-full").show();
        this.showAllStream();
      },
      showVideoView()
      {
        this.fullVideoView();
      },
      fullVideoBigOneView(showuser)
      {
        if (showuser && showuser != "0")
        {
          this.preMaxUser = showuser;
        }
        //console.log("fullVideoBigOneView");
        this.videoMode = 2;
        this.ClearStream();
        $("#twilioview-list,#twilioview-full,#twilioview-onebig,#twilioview-screen").hide();
        $("#twilioview-onebig").show();
        this.showAllStream();
      },
      getStreamCount()
      {
        var streams = sl.getPeersStream();
        var result = 0;
        for (var peerId in streams)
        {
          if (streams[peerId].stream == null)
          {
            continue;
          }

          result++;
        }
        return result;
      },
      ToOneBigView(evt)
      {
        var tar = evt.currentTarget;
        var peerId = $(tar).parent().attr("id").replace("mediavideoctl-", "");
        var userData = userMap.get(peerId);
        if (userData && userData.UserID)
        {
          //console.log("ToOneBigView:" + userData.UserID +","+ peerId);
          this.fullVideoBigOneView(userData.UserID+"");
        }
        else
        {
          this.fullVideoBigOneView();
        }
      },
      VideoToggle(evt)
      {
        var tar = evt.currentTarget;
        var peerId = $(tar).parent().attr("id").replace("mediavideoctl-", "");
        if (peerId == this.myPeerID)
        {
          if (this.enableVideo)
          {
            $(tar).attr("class", $(tar).attr("class").replace("-enable", "-disable"));
            
          }
          else
          {
            $(tar).attr("class", $(tar).attr("class").replace("-disable", "-enable"));
          }
          this.enableVideo = !this.enableVideo;

          sl.muteStream({
            audioMuted: !this.enableAudio,
            videoMuted: !this.enableVideo
          });

        }
        else
        {

        }
      },
      AudioToggle(evt)
      {
        var tar = evt.currentTarget;
        var peerId = $(tar).parent().attr("id").replace("mediavideoctl-", "");
        if (peerId == this.myPeerID)
        {
          if (this.enableAudio)
          {
            $(tar).attr("class", $(tar).attr("class").replace("-enable", "-disable"));

          }
          else
          {
            $(tar).attr("class", $(tar).attr("class").replace("-disable", "-enable"));
          }
          this.enableAudio = !this.enableAudio;
          sl.muteStream({
            audioMuted: !this.enableAudio,
            videoMuted: !this.enableVideo
          });

        }
        else
        {

        }

      },
      ToggleLoaclAudio()
      {

      },
      ToggleLoaclVideo()
      {
      },
      setShowCtl(isshow)
      { },
      closeVideoView()
      {

      },
      getMaxSize4FullScreen()
      {
        var w = document.documentElement.clientWidth - 0;
        var h = document.documentElement.clientHeight - 0;
        if (w * 0.75 > h)
        {
          return [h * 4 / 3, h];
        }
        else
        {
          return [w, w * 0.75];
        }
      },
      getMaxSize4FullScreenList()
      {
        var count = this.getStreamCount();
        var w = document.documentElement.clientWidth - 0;
        var h = document.documentElement.clientHeight - 0;
        if (count == 1)
        {
          if (w * 0.75 > h)
          {
            return [h * 4 / 3, h, h * 4 / 3, h];
          }
          else
          {
            return [w, w * 0.75, w, w * 0.75];
          }
        }
        else if (count == 2)
        {
          if (h * 4 / 3 * 2 > w)
          {
            return [w / 2, w * 0.75 / 2, w, w * 0.75 / 2];
          }
          else
          {
            return [h * 4 / 3, h, h * 4 / 3 * 2, h];
          }
        }
        else if (count == 3 || count == 4)
        {
          if (w * 0.75 > h)
          {
            return [h * 4 / 3 / 2, h / 2, h * 4 / 3, h];
          }
          else
          {
            return [w / 2, w * 0.75 / 2, w, w * 0.75];
          }
        }
        else if (count == 5 || count == 6)
        {
          if (h * 2 < w)
          {
            return [h * 2 / 3, h / 2, h * 2, h];
          }
          else
          {
            return [w / 3, w / 4, w, w / 2];
          }
        }
        else
        {
          return [200, 150, 800];
        }
      },
      getMaxSize4ShareScreen(wid, hei)
      {
        var w = document.documentElement.clientWidth - 0;
        var h = document.documentElement.clientHeight - 0;
        if (w * hei / wid > h)
        {
          return [h * wid / hei, h];
        }
        else
        {
          return [w, w * hei / wid];
        }
      },
      startDrag()
      {
        if ($("#twilioview-listview-header").is(":visible"))
        {
          Drag.init($("#twilioview-listview-header")[0], $("#twilioview-list")[0], null, null, -10, null, true);

          $("#twilioview-list")[0].onDragEnd = function ()
          {
            prePoz = $("#twilioview-list").css("right");
            preTop = $("#twilioview-list").css("top");
          }
          $("#twilioview-listview-header").css('cursor', 'move');
        }
      },
      endDrag()
      {
        Drag.cancel($("#twilioview-listview-header")[0]);

        $("#twilioview-listview-header").css('cursor', 'pointer');
      },
      getToken(isShareScreen)
      {
        var data = { UserName: this.userName, UserID: this.userID, UserRole: this.userRole, IsShareScreen: isShareScreen };
        var identity = base64encode(JSON.stringify(data));

        return new Promise(function (resolve, reject)
        {
          var sessionid = localStorage.getItem('UserToken');
          var url = GetAPIUrl() + "Twilio/AccessToken?identity=" + identity;
          $.ajax({
            type: 'GET',
            url: url,
            beforeSend: function (request)
            {
              request.setRequestHeader("UserToken", sessionid);
            },
            success: function (data)
            {
              resolve(data.RetData);
            },
            error: function (xhr, ajaxOptions, thrownError)
            {
              console.log(xhr);
              resolve("");
            }
          });
        });
      }
    }
  }
</script>
