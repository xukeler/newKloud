<template>
  <div id="tencentview" style="display:none;" class="tencentview">
    <div id="tencentview-list" style="right:420px;top:30px;" class="listview">
      <div class="listview-header" id="listview-header">
        <span class="listview-title"></span>
        <div class="listview-panel-actions">
          <a class="listview-panel-action" id="listview-ctl-close" style="float:right;" @click.stop="closeVideoView()"><span class="k-icon k-i-close"></span></a>
          
        </div>
      </div>
      <div :id="'div_'+item.peerId" class='listcontainer' style='height:90px;' v-for="item in listVideo">
        <div :id="'mediavideoctl-'+item.peerId" class="media-video-ctl">
        <span v-show="item.isSelf" :title="item.enableVideo?'Video is enable':'Video is disable'" :class="item.enableVideo?'media-icon-webcam-enable-small':'media-icon-webcam-disable-small'" @click.stop="VideoToggle($event)"></span>
        <span v-show="item.isSelf" :title="item.enableAudio?'Audio is enable':'Audio is disable'" :class="item.enableAudio?'media-icon-mic-enable-small':'media-icon-mic-disable-small'" @click.stop="AudioToggle($event)"></span>
        </div>
        <div :id="'username_'+item.peerId" class="username">{{item.username}}</div>
          <video :id="'video_'+item.peerId" class="listvideo" autoplay></video>
        </div>
      </div>
    <div id="tencentview-full" style="display:none;" class="fullview">
      <div :id="'div_'+item.peerId" class='fullcontainer' :style="'width:'+item.width+'px;height:'+item.height+'px;'" v-for="item in fullVideo">
        <div :id="'mediavideoctl-'+item.peerId" class="media-video-ctl">
          <span v-show="item.isSelf" :title="item.enableVideo?'Video is enable':'Video is disable'" :class="item.enableVideo?'media-icon-webcam-enable':'media-icon-webcam-disable'" @click.stop="VideoToggle($event)"></span>
          <span v-show="item.isSelf" :title="item.enableAudio?'Audio is enable':'Audio is disable'" :class="item.enableAudio?'media-icon-mic-enable':'media-icon-mic-disable'" @click.stop="AudioToggle($event)"></span>
          <span title="Max" class="media-icon-tomaxview" @click.stop="ToOneBigView($event)"></span>
        </div>
        <div :id="'username_'+item.peerId" class="username">{{item.username}}</div>
        <video :id="'video_'+item.peerId" class="fullvideo" autoplay></video>
      </div>
    </div>
    <div id="tencentview-onebig" style="display:none;" class="onebigview">
      <div style="position:absolute;top:5px; right:5px;width: 120px; z-index:3;">
        <div :id="'div_'+item.peerId" class='listcontainer' style='height:90px;' v-for="item in onebigVideo">
          <div :id="'mediavideoctl-'+item.peerId" class="media-video-ctl">
            <span v-show="item.isSelf" :title="item.enableVideo?'Video is enable':'Video is disable'" :class="item.enableVideo?'media-icon-webcam-enable-small':'media-icon-webcam-disable-small'" @click.stop="VideoToggle($event)"></span>
            <span v-show="item.isSelf" :title="item.enableAudio?'Audio is enable':'Audio is disable'" :class="item.enableAudio?'media-icon-mic-enable-small':'media-icon-mic-disable-small'" @click.stop="AudioToggle($event)"></span>
            <span  title="Max" class="media-icon-tomaxview-small" @click.stop="ToOneBigView($event)"></span>
          </div>
          <div :id="'username_'+item.peerId" class="username">{{item.username}}</div>
          <video :id="'video_'+item.peerId" class="listvideo" autoplay></video>
        </div>
      </div>
      <div :id="'div_'+bigitem.peerId" class='onebigviewcontainer' :style="'width:'+bigitem.width+'px;height:'+bigitem.height+'px;'" v-for="bigitem in onebigUserVideo">
        <div :id="'mediavideoctl-'+bigitem.peerId" class="media-video-ctl">
          <span v-show="bigitem.isSelf" :title="bigitem.enableVideo?'Video is enable':'Video is disable'" :class="bigitem.enableVideo?'media-icon-webcam-enable':'media-icon-webcam-disable'" @click.stop="VideoToggle($event)"></span>
          <span v-show="bigitem.isSelf" :title="bigitem.enableAudio?'Audio is enable':'Audio is disable'" :class="bigitem.enableAudio?'media-icon-mic-enable':'media-icon-mic-disable'" @click.stop="AudioToggle($event)"></span>
          <span title="Min" class="media-icon-tominview" @click.stop="fullVideoView();"></span>
        </div>
        <div :id="'username_'+bigitem.peerId" class="username">{{bigitem.username}}</div>
        <video :id="'video_'+bigitem.peerId" class="fullvideo" autoplay></video>
      </div>
    </div>
    <div id="tencentview-screen" style="display:none;" class="screenview">
      <div :id="'div_'+item.peerId" class='fullcontainer' :style="'width:'+item.width+'px;height:'+item.height+'px;'" v-for="item in screenVideo">
        <video :id="'video_'+item.peerId" class="fullvideo" autoplay></video>
      </div>
    </div>
    <div id="tencentview-audiolist" style="left:-100px;top:-100px; height:0px; height:0px; overflow:hidden; position: absolute;">
      <div :id="'div_audio_'+item.peerId" v-for="item in listAudio">
        <video :id="'audio_'+item.peerId"  autoplay></video>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  $header-height: 50px;
  $images-root: "../../../static/images/";
  .tencentview{
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
  .listview-header {
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
  import webapi from '../../webapi/webapi.js';
  var RTC = null;
  var RTCScreen = null;
  var userMap = null;
  var prePoz = 420;
  var preTop = 30;
  var remoteStreamList = [];
  var isShareScreen = false;
  var screenStream = null;

  export default {
    data: function () {
      return {
        videoMode: 0,
        userID: 0,
        userName: "",
        userRole: 0,
        meetingID:0,
        localStream: null,
        myPeerID: "",
        preMaxUser:"",
        listVideo: [],
        listAudio:[],
        fullVideo: [],
        onebigVideo: [],
        onebigUserVideo: [],
        screenVideo: [],
        cameraList: [],
        micList: [],
        speakerList: [],
        enableAudio: true,
        enableVideo: true,
        userSig: "eJxNkE1vgkAURf9KM9s2zQx0AE26INQYJsCgohI3BGGsT-kKTBVo*t*LhDTdnpt378n7RoGzeY2TpPwqZCS7SqA5wuhlxJCKQsIJRD1AQXb9IWRs-VF2br9qdqGXJVd6Pu63GgO354HEh9DN7d6lvGs3R6XN*IXNpq64qiCNYhmpdfpvokmv0RgNjLxhTAjRiT6Foq2gFlF8kqOBivHfGXwOwF1sLdsqSsq2QXDhe*JvEu6aqpBLW4F93md2blorKU3hLB2MTViYd*bt-Ju-9Lq24jKoNHJfZ*c1MQwM9Ah3iz-HUGZ6KfH7NCYhf3yFUFXRqDGbGRO-ibqBskDzJ6RgQonyEBwUf34BRYBobg__",
        privateMapKey: "eJxNkN1ugkAUhF*l4bZNZRFQTLxA-KlUQNkVgRsCsuoKLitgBZq*e9Hapufym2RmznxyaAFfQ8ZIHIRl0M1jbsDx3MsP3m6zCy2Dsmb4HyYxpiXZEZy3EAOn8V1dt8dZbTSrwnHNdJtIh2izlnViNBYqed81TvPGkKy6gpFQpdZRVx5eRZwE9-TWCog8DwDogd5DxBUjOQ7CXXmP6vL8b4WC7FtgTFbaXKOK1vHWcDHavHcXmgM7odaDCJ7WrBBE3bkStNzZejXlqUpG-txlNfV606yWYzqfYv-8bLJZmCNRpoVFbaQtrmCfrBp1OHyEleR0ex9IXUGW*orSf-BLgfPosmslVVVFH003OGUeTBi0Z4qEXGZvge*hU3UMGyfz0tgxE8ZavnTeVtdNejCjdSoj5Cyxe0DeURejiXKGxxTFqp522otBGSaW2NqPO*r9-kp94LwgGeUGT5zAAwkIt3Xafb6*AfVGkNc_"
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
        

        //webapi.getTencentSig(JSON.stringify(userinfo), meetingid).then((tencent) =>
        //{
        //  this.userSig = tencent.UserSig;
        //  this.privateMapKey = tencent.RoomSig;
        //});
        //RTC = new WebRTCAPI({
        //  "userId": $("#userid").val(),
        //  "userSig": $("#userSig").val(),
        //  "sdkAppId": 1400111717,
        //  "accountType": 30998,
        //  audio: true,
        //  video: $("#enableVideo").prop("checked")
        //}, function ()
        //{
        //  console.log("init success");
        //  InitEvent();

        //}, function (error)
        //{
        //  console.error(error)
        //});
      },
      JoinMedia(meetingid, userid, username, role, enableVideo, enableAudio, callback)
      {
        $("#tencentview").show();
        this.startDrag();
        this.userID = userid;
        this.userName = username;
        this.userRole = role;
        this.meetingID = meetingid ;
        if (typeof enableVideo == "undefined") enableVideo = true;
        if (typeof enableAudio == "undefined") enableAudio = true;
        this.enableAudio = enableAudio;
        this.enableVideo = enableVideo;


        var setting = this.getMideaSetting();
        var userinfo = String.format("{0}_{1}_{2}", userid, role,0);
        webapi.getTencentSig(userinfo, meetingid).then((tencent) =>
        {
          this.userSig = tencent.UserSig;
          this.privateMapKey = tencent.RoomSig;
          console.log("userinfo:" + userinfo + ",enableAudio:" + enableAudio + ",enableVideo:" + enableVideo);
          var getMediaSetting = {
            "userId": userinfo,//JSON.stringify(userinfo),
            "userSig": this.userSig,
            "sdkAppId": 1400111717,
            "accountType": 30998,
            audio: enableAudio,
            video: enableVideo
          };
          if (!setting.hasvideo)
          {
            getMediaSetting.video = false;
          }
          RTC = new WebRTCAPI(getMediaSetting, () =>
          {
            console.log("Init WebRTCAPI Success");
            this.SubscribeEvents();
            
            RTC.createRoom({
              roomid: meetingid,
              privateMapKey: this.privateMapKey,
              role: "user"
            }, () =>
            {
              if (enableVideo == false)
              {
                console.log("closeVideo");
                RTC.closeVideo();
              }
              console.log("create room success:" + meetingid);
              }, (ex) =>
              {
                console.log("create room error");
              });

          }, (error) =>
            {
              console.error(error)
            });

          if (setting.micpid != "")
          {
            RTC.getAudioDevices((devices) =>
            {
              for (var device of devices)
              {
                if (device.deviceId == setting.micpid)
                {
                  RTC.chooseAudioDevice(device);
                }
              }
            });
          }
          if (setting.hasvideo && setting.camerid != "")
          {
            RTC.getVideoDevices((devices) =>
            {
              for (var device of devices)
              {
                if (device.deviceId == setting.micpid)
                {
                  RTC.chooseVideoDevice(device);
                }
              }
            });
          }
        });

      },
      GetUserData(str)
      {
        var arr = str.split("_");
        return { UID: parseInt(arr[0]), UserRole: parseInt(arr[1]), Share: parseInt(arr[2]), UserName:"" };
      },
      SubscribeEvents()
      {
        console.log("SubscribeEvents");
        RTC.on("onLocalStreamAdd", (data)=>
        {
          console.log("onLocalStreamAdd");
          console.log(data);
          if (isShareScreen == true)
          {
            return;
          }
          if (data && data.stream)
          {
            //document.querySelector("#localVideo").srcObject = data.stream;
            //var html = '<video id="' + data.stream.id + '" muted autoplay playsinline></video>';
            //$("#videolist").append(html);
            //$("#" + data.stream.id)[0].srcObject = data.stream;
            this.DisplayTencentStream({ UID: this.userID, UserName: this.userName, UserRole: this.userRole, Share: 0 }, data.videoId, data.stream, true);
          }
        });

        RTC.on("onRemoteStreamUpdate", (data) =>
        {
          console.log("onRemoteStreamUpdate");
          console.log(data);
          if (data && data.stream)
          {
            console.debug(data.userId + 'enter this room with unique videoId ' + data.videoId);
            this.DisplayTencentStream(this.GetUserData(data.userId), data.videoId, data.stream, false, data.type);
            //document.querySelector("#remoteVideo").srcObject = data.stream;
            //if ($("#" + data.stream.id).length == 0)
            //{
            //  var html = '<video id="' + data.stream.id + '" autoplay playsinline></video>';
            //  $("#videolist").append(html);
            //}
            //$("#" + data.stream.id)[0].srcObject = data.stream;
          }
        });

        RTC.on('onRemoteStreamRemove', (data) =>
        {
          console.log(data.userId + ' leave this room with unique videoId ' + data.videoId);
          this.RemoveStream(data.videoId, this.GetUserData(data.userId));
          //this.removeStreamFromList(data.videoId);
          //this.RemoveStream(data.videoId);
          //$("#" + data.videoId).remove();
        });

        RTC.on('onWebSocketClose', (data) =>
        {
          console.log("onWebSocketClose");
        });

        RTC.on('onRelayTimeout', (data) =>
        {
          console.log("onRelayTimeout");
        });

        RTC.on('onKickout', (data) =>
        {
          console.log("onKickout");
        });

        //sl.on('peerJoined', (peerId, peerInfo)=>
        //{
        //  //console.log(peerInfo.userData);
        //  userMap.set(peerId, peerInfo.userData);
        //  if (this.userID == peerInfo.userData.UID)
        //  {
        //    this.myPeerID = peerId;
        //    //if (this.localStream != null)
        //    //{
        //    //  this.DisplayTencentStream(peerId, this.localStream, true);
        //    //}
        //  }

        //});
        //// Peer has Audio/Video stream to add
        //sl.on('addPeerStream', (peerId, stream)=>
        //{
        //});
        //// User's Audio/Video stream has been successfully added
        //sl.on('mediaAccessSuccess', (stream)=>
        //{
        //});
        //// A Peer has left the room
        //sl.on('peerLeft', (peerId)=>
        //{          
        //  this.RemoveStream(peerId);
        //  userMap.remove(peerId);

        //});

        //sl.on('incomingStream', (peerId, stream, isSelf)=>
        //{
        //  this.DisplayTencentStream(peerId, stream, isSelf);
        //});
      },
      DisplayTencentStream(userData, peerId, stream, isSelf, type="video")
      {
        //console.log("DisplayTencentStream:" + peerId);
        //$("#div_" + peerId).remove();
        //var userData = userMap.get(peerId);
        this.addToRemoteStreamList(userData, peerId, stream, isSelf, type);

        var usename = "";
        //console.log("Share:" + userData.Share);
        if (userData && typeof (userData.Share) != "undefined" && userData.Share == 1)
        {
          if (userData.UID != this.userID)
          {
            this.ShowScreenStream(peerId, stream);
          }
          return;
        }
        if (userData && userData.UserName)
        {
          usename = userData.UserName;
        }
        if (userData && userData.UID==this.userID)
        {
          isSelf = true;
        }
        if (type == "audio")
        {
          let audioinfo = {
            peerId: peerId,
            isSelf: isSelf,
            isMuted: isSelf,
            username: usename,
            enableAudio: isSelf && this.enableAudio,
            enableVideo: isSelf && this.enableVideo
          };
          this.listAudio.push(audioinfo);
          var delayload = () =>
          {
            setTimeout(() =>
            {
              if (gid("audio_" + peerId))
              {
                this.attachMediaStream(gid("audio_" + peerId), stream);

                this.setStreamSpeaker("audio_" + peerId);
                if (isSelf)
                {
                  if (gid("audio_" + peerId))
                  {
                    gid("audio_" + peerId).muted = true;
                  }
                  else
                  {
                    setTimeout(() =>
                    {
                      gid("audio_" + peerId).muted = true;
                    }, 3000);
                    setTimeout(() =>
                    {
                      gid("audio_" + peerId).muted = true;
                    }, 10000);
                  }
                }
              }
              else
              {
                delayload();
              }
            }, 500);
          };
          delayload();
        }
        else
        {
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
            $('#tencentview-full').width(size[2] + "px").height(size[3] + "px");
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
                this.attachMediaStream(gid("video_" + peerId), stream);

                //this.setStreamSpeaker("video_" + peerId);
                //if (isSelf)
                //{
                //  if (gid("video_" + peerId))
                //  {
                //    gid("video_" + peerId).muted = true;
                //  }
                //  else
                //  {
                //    setTimeout(() =>
                //    {
                //      gid("video_" + peerId).muted = true;
                //    }, 3000);
                //    setTimeout(() =>
                //    {
                //      gid("video_" + peerId).muted = true;
                //    }, 10000);
                //  }
                //}
              }
              else
              {
                delayload();
              }
            }, 500);
          };
          delayload();
        }
      },
      addToRemoteStreamList(userData,id, stream, isSelf,type)
      {
        if (stream)
        {
          var nindex=this.findStreamIndex(id);
          if(nindex==-1)
          {
            remoteStreamList.push({
              id: id,
              stream: stream,
              userData: userData,
              isSelf: isSelf,
              type: type
            });
          }
          else{
              remoteStreamList[nindex]={
              id: id,
              stream: stream,
              userData: userData,
              isSelf: isSelf,
              type: type
            }
          }
        }
      },
      findStreamIndex(id)
      {
        var index, tmp;
        var result = false;
        for (index = remoteStreamList.length - 1; index >= 0; index--)
        {
          var tmp = remoteStreamList[index];
          if (tmp.id === id)
          {
            return index;
          }
        }
        return -1;
      },
      removeStreamFromList(id)
      {
        var index, tmp;
        var result = false;
        for (index = remoteStreamList.length - 1; index >= 0; index--)
        {
          var tmp = remoteStreamList[index];
          if (tmp.id === id)
          {
            var toRemove = remoteStreamList.splice(index, 1);
            if (toRemove.length === 1)
            {
              result = true;
            }
          }
        }
        for (let i = 0, j = this.listAudio.length; i < j; i++)
        {
          if (this.listAudio[i].id + "" == id + "")
          {
            this.listAudio.splice(i, 1);
            break;
          }
        }
        return result;
      },
      getStreamInfoFromList(id)
      {
        for (var index = remoteStreamList.length - 1; index >= 0; index--)
        {
          if (remoteStreamList[index].id+"" == id+"")
          {
            return remoteStreamList[index];
          }
        }
        return null;
      },
      ShowScreenStream(peerId, stream)
      {
        console.log("ShowScreenStream");
        $("#tencentview-screen").show();
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
              this.attachMediaStream(gid("video_" + peerId), stream);
              gid("video_" + peerId).muted = true;
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
        this.attachMediaStream(peerVideo, stream);
        document.getElementById('tencentview-screen').appendChild(peerVideo);
        var size = this.getMaxSize4FullScreen();
        $('#tencentview-screen').width(size[0] + "px").height(size[1] + "px");
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
        if (userData && userData.UID == this.userID)
        {
          isSelf = true;
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
        $('#tencentview-onebig').width(size[0] + "px").height(size[1] + "px");
        var userData = userMap.get(peerId);
        if (userData && userData.UID)
        {
          this.$parent.NoticeMeeting(2, userData.UID + "");
        }
        var delayload = () =>
        {
          setTimeout(() =>
          {
            if (gid("video_" + peerId))
            {
              this.attachMediaStream(gid("video_" + peerId), stream);
              this.setStreamSpeaker("video_" + peerId);
              if (isSelf)
              {
                if (gid("video_" + peerId))
                {
                  gid("video_" + peerId).muted = true;
                }
                else
                {
                  setTimeout(() =>
                  {
                    gid("video_" + peerId).muted = true;
                  }, 3000);
                  setTimeout(() =>
                  {
                    gid("video_" + peerId).muted = true;
                  }, 10000);
                }
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
        var videoitem = $("#tencentview-screen").find("video").parent();
        videoitem.css({ "width": size[0] + "px", "height": size[1] + "px" });
      },
      RemoveStream(peerId, userData)
      {
        //console.log("RemoveStream:"+peerId);
        if (userData && typeof (userData.Share) != "undefined" && userData.Share == 1)
        {
          $(window).unbind("resize", this.ShareScreenSizeChange);
          $("#tencentview-screen").hide();
        }
        this.removeStreamFromList(peerId);
        if (this.videoMode == 0)
        {
          for (let i = 0, j = this.listVideo.length; i < j; i++)
          {
            if (this.listVideo[i].peerId + "" == peerId + "")
            {
              this.listVideo.splice(i, 1);
              break;
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
              break;
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
              break;
            }
          }
        }

        //$("#" + peerId + "_video").remove();
      },
      ClearStream()
      {
        //console.log("ClearStream");

        //$("#tencentview-list").find("div.fullcontainer,div.listcontainer").remove();
        $("#tencentview-list").hide();

        //$("#tencentview-onebig").find("div.onebigviewcontainer,div.listcontainer").remove();
        $("#tencentview-onebig").hide();

        $("#tencentview-full,#tencentview-screen").hide();//.empty()

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
        console.log("leave");
        $("#tencentview").hide();
        this.StopShareScreen();
        return new Promise((resolve, reject)=>
        {
          if (RTC)
          {
            RTC.quit(() =>
            {
              resolve(true);
            }, () =>
              {
                resolve(false);
              });
          }
          else
          {
            resolve(true);
          }
        });
      },
      Reset()
      {
        console.log("Reset");

        this.localStream = null;
        this.videoMode = 0;
        this.listVideo = [];
        this.fullVideo = [];
        this.onebigVideo = [];
        this.onebigUserVideo = [];
        this.screenVideo = [];

        userMap = null;

        
        this.Init();
      },
      StartShareScreen()
      {
        //var userinfo = { UserName: this.userName, UID: this.userID, UserRole: this.userRole, Share: 1 };
        var userinfo = String.format("{0}_{1}_{2}", this.userID, this.userRole, 1);
        webapi.getTencentSig(userinfo, this.meetingID).then((tencent) =>
        {
          //this.userSig = tencent.UserSig;
          //this.privateMapKey = tencent.RoomSig;

          var getMediaSetting = {
            "userId": userinfo,
            "userSig": tencent.UserSig,
            "sdkAppId": 1400111717,
            "accountType": 30998,
            closeLocalMedia: true
          };
          RTCScreen = new WebRTCAPI(getMediaSetting, () =>
          {
            console.log("Init StartShareScreen Success");

            RTCScreen.createRoom({
              roomid: this.meetingID,
              privateMapKey: tencent.RoomSig,
              role: "1080"
            }, () =>
              {

                console.log("create room success");
                RTCScreen.getLocalStream(
                  {
                    screen: true,
                    screenSources: 'screen,window,tab',
                    attributes: {
                      width: window.screen.width,
                      height: window.screen.height,
                      frameRate: 5
                    }
                  }, (info) =>
                  {
                    console.log("startRTC");
                    screenStream = info.stream;
                    RTCScreen.startRTC({ role: '1080', stream: screenStream }, function (info)
                    {
                      isShareScreen = true;
                        console.debug('推流成功');
                      }, function (error)
                      {
                        console.error('推流失败', error)
                      });

                  }, (error) =>
                  {
                    console.error(error)
                  });
              

              }, (ex) =>
              {
                console.log("create room error");
              }
            );


          }, (error) =>
            {
              console.error(error)
            }
          );
        });
      },
      StopShareScreen()
      {
        if (RTCScreen == null)
        {
          return;
        }
        //RTCScreen.stopRTC({}, () =>
        //{
          if (screenStream)
          {
            try
            {
              screenStream.getTracks().forEach(track => track.stop());
            }
            catch (ex) { }
          }
          RTCScreen.quit(() =>
          {
            console.log("Quit success");
            RTCScreen = null;
          }, () =>
            {
            console.log("Quit error");
            RTCScreen = null;
            });

        //});       
        isShareScreen = false;

        //var data = { UserName: this.UserName, UID: this.userID, UserRole: this.userRole, Share: 0 };
        //sl.setUserData(data);
      },
      setStreamSpeaker(id)
      {
        var speaker = this.getSpeakerSetting();
        if (speaker && speaker != "")
        {
          if (document.getElementById(id))
          {
            document.getElementById(id).setSinkId(speaker);
          }
          else
          {
            setTimeout(() =>
            {
              this.setStreamSpeaker(id);
            }, 2000);
          }
        }
      },
      getSpeakerSetting()
      {
        var speaker = localStorage.getItem('DefaultSpeaker');
        if (speaker && speaker != "")
        {
          if (!IsExistInArr(this.speakerList, speaker))
          {
            speaker = "";
          }
          return speaker;
        }
        else
        {
          return "";
        }
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
      attachMediaStream(vobj, stream)
      {
        vobj.srcObject = stream;
      },
      showAllStream()
      {
        var streams = this.getStreams();
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
            this.DisplayTencentStream(streams[peerId].userData, streams[peerId].id,streams[peerId].stream, streams[peerId].isSelf);
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
          if (userData && userData.UID && userData.Share == 0 && userData.UID+""==this.preMaxUser+"")
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
        $("#tencentview-list,#tencentview-full,#tencentview-onebig,#tencentview-screen").hide();
        $("#tencentview-list").show();
        this.showAllStream();
      },
      fullVideoView()
      {
        //console.log("fullVideoView");
        this.videoMode = 1;
        this.ClearStream();
        $("#tencentview-list,#tencentview-full,#tencentview-onebig,#tencentview-screen").hide();
        $("#tencentview-full").show();
        this.showAllStream();
      },
      showVideoView()
      {
        this.minFullScreen();
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
        $("#tencentview-list,#tencentview-full,#tencentview-onebig,#tencentview-screen").hide();
        $("#tencentview-onebig").show();
        this.showAllStream();
      },
      getStreamCount()
      {
        var result = 0;
        for (var i = 0, j = remoteStreamList.length; i < j; i++)
        {
          if (remoteStreamList[i].type == "video")
          {
            result++;
          }
        }
        return result;
      },
      getStreams()
      {
        var result = new Array();
        for (var i = 0, j = remoteStreamList.length; i < j; i++)
        {
          if (remoteStreamList[i].type == "video")
          {
            result.push(remoteStreamList[i]);
          }
        }
        return result;
      },
      ToOneBigView(evt)
      {
        var tar = evt.currentTarget;
        var peerId = $(tar).parent().attr("id").replace("mediavideoctl-", "");
        var userData = userMap.get(peerId);
        if (userData && userData.UID)
        {
          //console.log("ToOneBigView:" + userData.UID +","+ peerId);
          this.fullVideoBigOneView(userData.UID+"");
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
        //if (peerId == this.myPeerID)
        {
          if (this.enableVideo)
          {
            $(tar).attr("class", $(tar).attr("class").replace("-enable", "-disable"));
            $(tar).attr("title", "Video is disable");
          }
          else
          {
            $(tar).attr("class", $(tar).attr("class").replace("-disable", "-enable"));
            $(tar).attr("title", "Video is enable");
          }
          this.enableVideo = !this.enableVideo;

          if (this.enableVideo)
          {
            RTC.openVideo();
          }
          else
          {
            RTC.closeVideo();
          }

        }
      },
      AudioToggle(evt)
      {
        var tar = evt.currentTarget;
        var peerId = $(tar).parent().attr("id").replace("mediavideoctl-", "");
        //if (peerId == this.myPeerID)
        {
          if (this.enableAudio)
          {
            $(tar).attr("class", $(tar).attr("class").replace("-enable", "-disable"));
            $(tar).attr("title", "Aduio is disable");

          }
          else
          {
            $(tar).attr("class", $(tar).attr("class").replace("-disable", "-enable"));
            $(tar).attr("title", "Aduio is enable");
          }
          this.enableAudio = !this.enableAudio;
          if (this.enableAudio)
          {
            RTC.openAudio();
          }
          else
          {
            RTC.closeAudio();
          }

        }

      },
      ToggleLoaclAudio()
      {

      },
      ToggleLoaclVideo()
      {
      },
      closeVideoView()
      {
        $("#tencentview-list").hide();
        this.$parent.OnCloseVideoView();
      },
      hideUserVideo() { },
      Up2Student(userid)
      { },
      Switch2Agora()
      {

      },
      Switch2KloudCall() { },
      DisableAllAudio() { },
      EnableAllAudio() { },
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
        if ($("#listview-header").is(":visible"))
        {
          Drag.init($("#listview-header")[0], $("#tencentview-list")[0], null, null, -10, null, true);

          $("#tencentview-list")[0].onDragEnd = function ()
          {
            prePoz = $("#tencentview-list").css("right");
            preTop = $("#tencentview-list").css("top");
          }
          $("#listview-header").css('cursor', 'move');
        }
      },
      endDrag()
      {
        Drag.cancel($("#listview-header")[0]);

        $("#listview-header").css('cursor', 'pointer');
      }
    }
  }
</script>
