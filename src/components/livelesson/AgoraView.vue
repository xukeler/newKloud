<template>
    <div id="mediaview" style="display:none;">
        <div id="div_device" class="panel panel-default" style="display:none">
            <div class="select">
                <label for="audioSource">Audio source:</label>
                <select id="audioSource"></select>
            </div>
            <div class="select">
                <label for="videoSource">Video source:</label>
                <select id="videoSource"></select>
            </div>
        </div>
        <div
            id="media_wrapper"
            style="position:fixed; top:10px; right:420px;z-index:10002; width:0px; height:0px; "
        >
            <div class="room-name-title" id="room-name-meeting"></div>
            <div class="main-container">
                <div id="video-container-parent">
                    <div
                        id="video-container"
                        class="video-container"
                        style="position:relative;width:120px;right:120px;"
                    >
                        <div class="media-header" id="media-header2" style="display:none;">
                            <span class="media-title"></span>
                            <div class="media-panel-actions" id="media-panel-actions">
                                <a
                                    class="media-panel-action"
                                    id="media-ctl-minimize"
                                    style="display:none;"
                                    @click.stop="toggleVideo()"
                                >
                                    <span class="media-icon-minimize"></span>
                                </a>
                                <a
                                    class="media-panel-action"
                                    id="media-ctl-column"
                                    style="display:none;"
                                    @click.stop="minVideoView()"
                                >
                                    <span class="media-icon-column"></span>
                                </a>
                                <a
                                    class="media-panel-action"
                                    id="media-ctl-columnbig"
                                    style="display:none;"
                                    @click.stop="maxVideoView()"
                                >
                                    <span class="media-icon-columnbig"></span>
                                </a>
                                <a
                                    class="media-panel-action"
                                    id="media-ctl-fullscreen"
                                    style="display:none;"
                                    @click.stop="fullVideoView()"
                                >
                                    <span class="media-icon-fullscreen"></span>
                                </a>
                                <a
                                    class="media-panel-action"
                                    id="media-ctl-column-bigone"
                                    style="display:none;"
                                    @click.stop="fullVideoBigOneView()"
                                >
                                    <span class="media-icon-column-bigone"></span>
                                </a>
                                <a
                                    class="media-panel-action"
                                    id="media-ctl-column-list"
                                    style="display:none;"
                                    @click.stop="fullVideoListView()"
                                >
                                    <span class="media-icon-column-list"></span>
                                </a>
                                <a
                                    class="media-panel-action"
                                    id="media-ctl-minscreen"
                                    style="display:none;"
                                    @click.stop="minFullScreen()"
                                >
                                    <span class="media-icon-minscreen"></span>
                                </a>
                                <a
                                    class="media-panel-action"
                                    style="display:none;"
                                    @click.stop="maxVideoView()"
                                >
                                    <span class="k-icon k-i-maximize"></span>
                                </a>
                                <a class="media-panel-action" style="display:none;">
                                    <span
                                        class="k-icon media-disablevideo"
                                        title="Enable/disable Video"
                                    ></span>
                                </a>
                                <a
                                    class="meeting-panel-action"
                                    id="media-ctl-close"
                                    style="float:right;"
                                    @click.stop="closeVideoView()"
                                >
                                    <span class="k-icon k-i-close"></span>
                                </a>
                            </div>
                        </div>
                        <div
                            id="video-container-multiple"
                            style="position:relative;top:26px; float:right; width:100%;"
                        ></div>
                        <div
                            id="mediamaxview"
                            style="display:none; position:absolute; top:0px; height:0px; height:600px; width:720px;left:0px;"
                        >
                            <div
                                style="right:5px; top:5px; display:block;cursor:pointer; position:absolute; display:none;"
                                @click.stop="minVideoView()"
                            >
                                <Icon type="ios-close" size="36" color="white"></Icon>
                            </div>
                            <div
                                id="mediamaxuser"
                                class="mediamaxuser"
                                style="width:100%; height:100%;position:absolute; left:0px; top:0px;"
                            ></div>
                            <div
                                id="mediamaxlist"
                                class="mediamaxlist"
                                style="position:absolute; right:0px; top:0px; width:122px;"
                            ></div>
                        </div>
                        <div class="toolbar" style="display:none;">
                            <!--<ul>
                <li>
                  <a class="switch-audio-button" href="#"><img src="images/btn_voice@2x.png" alt="Voice"></a>
                </li>
                <li>
                  <a class="mute-button" href="#"><img src="images/btn_mute@2x.png" alt="Mute"></a>
                </li>
                <li style="display: none">
                  <a class="fullscreen-button" style="display: none" href="#"><img style="display: none" src="images/btn_maximize@2x.png" alt="Fullscreen"></a>
                </li>
                <li style="display: none">
                  <a class="expension-button" style="display: none" href="#"><img style="display: none" src="images/btn_expansion.png" alt="Switch"></a>
                </li>
                <li>
                  <a class="end-call-button" href="#"><img src="images/btn_endcall@2x.png" alt="End"></a>
                </li>
                            </ul>-->
                        </div>
                    </div>
                </div>
                <div class="video-side-bar" style="display:none;">
                    <div class="video-operation-bar">
                        <span class="video-operation-btn list-switch-audio-btn"></span>
                        <span class="video-operation-btn list-hang-up-btn"></span>
                        <span class="video-operation-btn list-close-btn"></span>
                    </div>
                </div>
                <div class="info"></div>
            </div>
            <!--
        <div class="room-info" style="z-index: 2;">
            <a href="#" class="btn btn-info" data-toggle="modal" data-target="#roomInfoModal"><span class="fa fa-info"></span></button>
        </div>
            -->
        </div>
        <div
            id="roomInfoModal"
            class="modal fade"
            tabindex="-1"
            role="dialog"
            style="display:none;"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                        <p>No remote stream yet&hellip;, :(</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
    </div>
</template>
<style lang="scss">
$images-root: "../../../static/";
.media-main-panel {
    display: inline-block;
    border-color: #ccc;
    /*box-shadow: 1px 1px 7px 1px rgba(128, 128, 128, .3);*/
    /*border-radius: 4px;*/
    border-style: solid;
    border-width: 0px;
    background-color: #4a4a4a;
    box-sizing: content-box;
    float:left;
    position:relative;
    margin:3px 0px;
    border-radius:10px;
    overflow: hidden;
}
.media-main-panel:hover .media-user-ctl {
    visibility: visible;
}
.media-main-panel:hover .media-video-ctl {
    visibility: visible;
}
.media-main-panel:hover .media-video-tomax {
    visibility: visible;
}
.media-main-panel:hover .media-video-leftop {
    visibility: visible;
}
.media-main-panel.small {
    height: 74px;
    width: 99px;
}
.media-main-panel.big {
    height: 224px;
    width: 299px;
}
.video-item {
}
.video-item video {
    left: 0px;
}
.mediamaxuser {
}
.mediamaxuser:hover .media-icon-ctl-back {
    visibility: visible;
}
.mediamaxlist {
}
.mediamaxlist:hover .media-icon-ctl-back {
    visibility: visible;
}
.media-user-ctl {
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 2;
    color: white;
    cursor: pointer;
    width: 32px;
    visibility: hidden;
}
.media-video-ctl {
    position: absolute;
    bottom: 0px;
    right:5px;
    z-index: 20;
    color: white;
    cursor: pointer;
    visibility: hidden;
    padding: 0px;
    margin: 0px;
    vertical-align: bottom;
}
.media-video-name
{
    position: absolute;
    bottom: 2px;
    left: 5px;
    z-index: 21;
    color: white;
    cursor: pointer;
    padding: 0px;
    margin: 0px;
    vertical-align: bottom;
    width: 70%;
    text-align:left;
    height:18px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.media-video-bot {
    position: absolute;
    bottom: 0px;
    left: 0px;
    z-index: 20;
    color: white;
    cursor: pointer;
    padding: 0px;
    margin: 0px;
    vertical-align: bottom;
    width: 100%;
    background-color:#252525;
    text-align:right;
    height:25px;
    
    opacity:0.7;
    // background: -moz-linear-gradient(left,#000000 0%, #ff0000 100%);
}
.media-video-bot.error
{
    background: -webkit-linear-gradient(left,#000000 0%,#ff0000 100%);
}
.media-video-ctl span {
    margin: 0px 3px;
}
.media-video-tomax {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 2;
    color: black;
    cursor: pointer;
    visibility: hidden;
    padding: 0px;
    margin: 0px;
    vertical-align: bottom;
}

.media-video-tomax span {
    margin: 5px 3px;
}
.media-video-leftop {
    position: absolute;
    top: 80px;
    left: 2px;
    z-index: 2;
    color: black;
    cursor: pointer;
    visibility: hidden;
    padding: 0px;
    margin: 0px;
    vertical-align: bottom;
    width: 40px;
}

.media-video-leftop span {
    margin: 0px;
}
.media-video-back {
    position: absolute;
    top: 30px;
    left: 2px;
    z-index: 2;
    color: black;
    cursor: pointer;
    visibility: hidden;
    padding: 0px;
    margin: 0px;
    vertical-align: bottom;
    width: 40px;
}
.media-header {
    position: absolute;
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
.media-title {
    position: absolute;
    left: 0.44em;
    right: 0.44em;
    overflow: hidden;
    cursor: default;
    text-overflow: ellipsis;
    padding-top: 5px;
    text-align: left;
    cursor: move;
}

.media-panel-actions {
    position: absolute;
    top: 0;
    left: 0.3em;
    width: 100%;
    padding-right: 5px;
}

.media-panel-action {
    display: inline-block;
    width: 24px;
    height: 24px;
    padding: 2px;
    text-decoration: none;
    opacity: 0.7;
    color: #333;
    border-color: transparent;
    border-radius: 4px;
}
.media-user {
    width: 100%;
    height: 100%;
    // background-color: black;
}
.videoface {
    width: 45%;
    height: 60%;
    position: absolute;
    left: 27.5%;
    top: 12%;
    z-index: 2;
    border-radius:50%;
    background-size:cover;
}
.media-user video {
    left: 0px;
    z-index: 1;
}
.mediamaxlist video {
    z-index: 11;
}
.mediamaxlist .videoface {
    z-index: 12;
}

.media-disablevideo {
    width: 24px;
    height: 24px;
    background-position: -322px -228px;
    background-image: url($images-root+"KendoUI/styles/Bootstrap/sprite_2x.png");
}
.media-icon-column {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-top: 3px;
    background-image: url($images-root+"images/icon-column-layout.png");
}
.media-icon-columnbig {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-top: 3px;
    background-image: url($images-root+"images/icon-column-big.png");
}
.media-icon-fullscreen {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-top: 3px;
    background-image: url($images-root+"images/icon-fullscreen.png");
}
.media-icon-minimize {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-top: 3px;
    background-image: url($images-root+"images/icon-minimize.png");
}
.media-icon-column-bigone {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-top: 3px;
    background-image: url($images-root+"images/icon-column-bigone.png");
}
.media-icon-column-list {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-top: 3px;
    background-image: url($images-root+"images/icon-column-list.png");
}
.media-icon-minscreen {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-top: 3px;
    background-image: url($images-root+"images/icon-minscreen.png");
}
.media-icon-tomaxview {
    background-image: url($images-root+"images/icon-tomaxview.png");
    background-size: 22px 22px;
    background-position: center center;
    background-repeat: no-repeat;
    width: 40px;
    height: 40px;
    background-color: #47aebb;
    display: inline-block;
    border-radius: 50%;
}
.media-icon-tomaxview-small {
    background-image: url($images-root+"images/icon-tomaxview.png");
    background-size: 12px 12px;
    background-position: center center;
    background-repeat: no-repeat;
    width: 20px;
    height: 20px;
    background-color: #47aebb;
    display: inline-block;
    border-radius: 50%;
}
.media-icon-tominview {
    background-image: url($images-root+"images/icon-tominview.png");
    background-size: 22px 22px;
    background-position: center center;
    background-repeat: no-repeat;
    width: 40px;
    height: 40px;
    background-color: #47aebb;
    display: inline-block;
    border-radius: 50%;
}
.media-icon-tominview-small {
    background-image: url($images-root+"images/icon-tominview.png");
    background-size: 12px 12px;
    background-position: center center;
    background-repeat: no-repeat;
    width: 20px;
    height: 20px;
    background-color: #47aebb;
    display: inline-block;
    border-radius: 50%;
}
.media-icon-webcam-enable {
    background-image: url($images-root+"images/icon-video-enable.svg");
    background-size: 26px 26px;
    background-position: center center;
    background-repeat: no-repeat;
    width: 40px;
    height: 40px;
    background-color: #47aebb;
    display: inline-block;
    border-radius: 50%;
}
.media-icon-webcam-enable-small {
    background-image: url($images-root+"images/icon-video-enable.svg");
    background-size: 16px 16px;
    background-position: center center;
    background-repeat: no-repeat;
    width: 20px;
    height: 20px;
    background-color: #47aebb;
    display: inline-block;
    border-radius: 50%;
}
.media-icon-webcam-disable {
    background-image: url($images-root+"images/icon-video-disable.svg");
    background-size: 26px 26px;
    background-position: center center;
    background-repeat: no-repeat;
    width: 40px;
    height: 40px;
    background-color: #b0b0af;
    display: inline-block;
    border-radius: 50%;
}
.media-icon-webcam-disable-small {
    background-image: url($images-root+"images/icon-video-disable.svg");
    background-size: 16px 16px;
    background-position: center center;
    background-repeat: no-repeat;
    width: 20px;
    height: 20px;
    background-color: #b0b0af;
    display: inline-block;
    border-radius: 50%;
}
.media-icon-mic-enable {
    background-image: url($images-root+"images/icon-mic-enable.svg");
    background-size: 26px 26px;
    background-position: center center;
    background-repeat: no-repeat;
    width: 40px;
    height: 40px;
    background-color: #47aebb;
    display: inline-block;
    border-radius: 50%;
}

.media-icon-mic-enable-small {
    background-image: url($images-root+"images/icon-mic-enable.svg");
    background-size: 16px 16px;
    background-position: center center;
    background-repeat: no-repeat;
    width: 20px;
    height: 20px;
    background-color: #47aebb;
    display: inline-block;
    border-radius: 50%;
}

.media-icon-mic-disable {
    background-image: url($images-root+"images/icon-mic-disable.svg");
    background-size: 26px 26px;
    background-position: center center;
    background-repeat: no-repeat;
    width: 40px;
    height: 40px;
    background-color: #b0b0af;
    display: inline-block;
    border-radius: 50%;
}

.media-icon-mic-disable-small {
    background-image: url($images-root+"images/icon-mic-disable.svg");
    background-size: 16px 16px;
    background-position: center center;
    background-repeat: no-repeat;
    width: 20px;
    height: 20px;
    background-color: #b0b0af;
    display: inline-block;
    border-radius: 50%;
}
.media-icon-ctl-tomax {
    width: 20px;
    height: 20px;
    background-color: #2665e8;
    display: inline-block;
    border-radius: 50%;
    padding: 3px 0px 2px 0px;
}
.media-icon-ctl-tomax span {
    font-size: 14px;
}
.media-icon-ctl-back {
    width: 40px;
    height: 40px;
    background-color: #47aebb;
    display: inline-block;
    border-radius: 50%;
    padding: 3px 0px 2px 0px;
}

.media-icon-ctl-back span {
    font-size: 24px;
}
</style>
<script>
//import AgoraRTC from 'AgoraRTCSDK-1.12.0.js';
//import 'AgoraRTCSDK-1.12.0.js'
//import vendor from 'vendor-bundle.js';
//require("vendor-bundle.js");
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import authenticator from "../../authenticator";
import webapi from "../../webapi/webapi.js";
import loger from "../../common/log.js";
import audioRecorder from "../../common/audioRecorder.js";
import util from "../../common/util.js";

var client = null;
var screenclient = null;
var localStream = null;
var screenStream = null;
var remoteStreamList = [];
var isMixed = false;
var resolution = "480p";
var maxFrameRate = 15;
var channel = "0";
var disableAudio = false;
var disableVideo = false;
var disableAllAudio = false;
var disableAudioList = [];
var hideLocalStream = false;
var enableLocalVideo = true;
var fullscreenEnabled = false;
var showCtl = false;
var muteAudioList = [];
var muteVideoList = [];
var uid;
var urole;
var lastLocalStreamId;
var uname;
var preMaxUser = "";
var mediaMode = 0;
var mediaFullMode = 0;
var prePoz = null,
    preTop = null;
var isFullScreen = false;
var isShareScreen = false;
var preOneBigViewUser = null;
var screenSizeTimer = null;
var screenPreSize = "";
var isHideVideo = false;
var screenRes = "1080P";
var isGetScreenRes = false;
var LastChangeTime = null;
var LastError="";
export default {
    name: "MediaView",
    data: function() {
        return {
            cameraList: [],
            micList: [],
            speakerList: [],
            enableAudio: true,
            enableVideo: true,
            isJoin: false,
            canOpenAudio: true,
            recorder: null
        };
    },
    mounted: function() {
        this.startDrag();
        //AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.ERROR);//NONE ERROR WARN  INFO  DEBUG

        //chrome.runtime.sendMessage('fkgcojnnmobopcalolbdilkeljcnniin',{getVersion:true},function(res){alert(res.version)})
    },
    beforeDestroy: function() {
        isGetScreenRes = false;
        this.Leave();
        this.recorder = null;
    },
    computed: {
        ...mapState({
            VXenableVideo: "enableVideo",
            VXenableAudio: "enableAudio"
        }),
        ...mapGetters([
            "getLessonID",
            "getScreenRes",
            "getEnableVideo",
            "getEnableAudio"
        ])
    },
    watch: {
        VXenableVideo(stat) {
            this.ToggleLoaclVideo(stat);
        },
        VXenableAudio(stat) {
            this.ToggleLoaclAudio(stat);
        }
    },
    methods: {
        log(txt) {
            loger.log(txt);
        },
        StartRecord() {
            this.recorder = new audioRecorder.AudioRecorder(
                this.getAudioStream(),
                {}
            );
            this.recorder.start();
            return this.recorder;
        },
        StopRecord() {
            if (this.recorder) {
                this.recorder.stop();
            }
            this.recorder = null;
        },
        RecordAll() {
            return;
            console.log("RecordAll");

            this.recorder = new audioRecorder.AudioRecorder(
                this.getAudioStream(),
                {}
            );
            this.recorder.start();
            setTimeout(() => {
                console.log("start play");
                this.recorder.stop();
                this.recorder.play(gid("liveSyncAudio"));
            }, 20000);
            return;

            // Record 10s of mixed audio as an example
            // var options = {
            // audioBitsPerSecond : 128000,
            // videoBitsPerSecond : 2500000,//bitsPerSecond
            // mimeType : 'video/mp4'
            // }
            var options = {
                audioBitsPerSecond: 48000 / 8,
                mimeType: "audio/webm" //
            };
            //const recorder = new MediaRecorder(dest.stream,options);
            const recorder = new MediaRecorder(dest.stream, options);
            //recorder.stream=dest.stream;
            recorder.start();
            recorder.ondataavailable = e => {
                console.log("Got data", e.data);
                var windowURL = window.URL || window.webkitURL;
                var audio = gid("liveSyncAudio");
                audio.src = windowURL.createObjectURL(e.data);
                audio.play();
                var a = new FileReader();
                a.onload = function(e) {
                    console.log(e.target.result);
                };
                a.readAsDataURL(e.data);
            };
            recorder.onstop = () => console.log("stopped");
            // setInterval(()=>{
            //     console.log(ac.currentTime);
            // },1000);
            setTimeout(() => {
                recorder.stop();
            }, 20000);
        },
        getAudioTracks() {
            var audioTracks = new Array();
            if (localStream != null) {
                var track = localStream.getAudioTrack();
                if (track) audioTracks.push(track);
            }
            for (var i = 0; i < remoteStreamList.length; i++) {
                audioTracks.push(remoteStreamList[i].stream.getAudioTrack());
            }
            return audioTracks;
        },
        getAudioStream() {
            var audioTracks = this.getAudioTracks();
            //console.log("getAudioStream:"+audioTracks.length);
            const ac = new AudioContext();
            const sources = audioTracks.map(t =>
                ac.createMediaStreamSource(new MediaStream([t]))
            );
            const dest = ac.createMediaStreamDestination();
            sources.forEach(s => s.connect(dest));
            return dest.stream;
        },
        getRecordCurrentTime() {
            if (this.recorder == null) {
                return 0;
            } else {
                return this.recorder.getCurrentTime();
            }
        },
        getRecordData(callback) {
            if (this.recorder == null) {
                callback(null);
            } else {
                this.recorder.getData(callback);
            }
        },
        clearRecordData() {
            if (this.recorder != null) {
                this.recorder.clear();
            }
        },
        async JoinMedia(meetingid,userid,username,role,openVideo,openAudio,callback,retry = 0) 
        {
            meetingid = (meetingid + "").toUpperCase();
            await util.LoadJsFiles(["https://cdn.jsdelivr.net/npm/agora-rtc-sdk@2.6.1/AgoraRTCSDK.min.js"]);
            //await util.LoadJsFiles(["/static/AgoraRTCSDK-2.6.1.js"]);
            

            AgoraRTC.Logger.enableLogUpload();
            AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.ERROR); //NONE ERROR WARN  INFO  DEBUG
            if (retry > 5) {
                this.$Notice.error({
                    title: "Join meeting failed!",
                    desc: LastError+"! Please refresh browser to try again!",
                    duration: 0,
                    bottom: 20,
                    left: true
                });
                loger.log("JoinMedia error too many times:" + retry);
                return;
            }

            $("#liveMediaContainer,#mediaview").show();
            if (typeof openVideo == "undefined") openVideo = true;
            if (typeof openAudio == "undefined") openAudio = true;
            this.enableAudio = openAudio;
            this.enableVideo = openVideo;
            console.log("JoinMedia meetingid:" +meetingid +",userid:" +userid +",role:" +role +",openVideo:" +openVideo +",openAudio:" +openAudio);

            await this.LeaveChannel(client);
            this.reset();
            channel = meetingid;
            client = AgoraRTC.createClient({mode: "live",codec: "vp8"}); //createClient({ mode: 'interop' });
            uid = userid;
            uname = username;
            urole = role;
            await this.getDevices();
            client.init(AGORA_APPID,() => {
                    client.join(null,"" + channel,parseInt(userid),async(serveruid) => {
                            //console.log("serveruid:"+serveruid);
                            this.isJoin = true;
                            if (role == 1 || role == 2) 
                            {    
                                var initresult=  {Code:100};
                                var trycount=0;
                                while(initresult.Code>1 && trycount<=5)
                                {
                                    await this.sleep(trycount*500+2000);
                                    initresult=  await this.initLocalStreamEx(parseInt(userid),openVideo,openAudio);
                                    //console.log(initresult);
                                    trycount++;
                                }
                                if(initresult.Code==1)
                                {
                                    this.$Notice.warning({
                                        title: "没有可用的设备(麦克风,摄像头)!",
                                        desc: "请检查摄像头麦克风权限以及是否被其他设备占用,然后再刷新浏览器重试!",
                                        duration: 0,
                                        bottom: 20,
                                        left: true
                                    });
                                    await this.LeaveChannel(client);
                                    this.clearAllStream();
                                    $("#mediamaxuser").empty();
                                    $("#mediamaxlist").empty();
                                    if (callback) callback();
                                    return;
                                }
                                else if(initresult.Code>1)
                                {
                                    this.$Notice.error({
                                        title: "Join failed!",
                                        desc:  initresult.Msg+"! Can't connect to Kloud Sync meeting server!",
                                        duration: 0,
                                        bottom: 20,
                                        left: true
                                    });
                                    await this.LeaveChannel(client);
                                    this.clearAllStream();
                                    $("#mediamaxuser").empty();
                                    $("#mediamaxlist").empty();
                                    if (callback) callback();
                                    return;
                                }
                                else
                                {                                   
                                    if (this.recorder != null) {
                                            this.recorder.replaceStream(this.getAudioStream());
                                        }
                                        if (disableAllAudio == true) {
                                            this.DisableAllAudio();
                                        }
                                        if (callback) callback();
                                }                                      


                                if (localStream != null) {
                                    lastLocalStreamId = localStream.getId();
                                }
                            }
                        },
                        err => {
                            this.log("client join channel failed: " + err);
                            setTimeout(() => {
                                this.JoinMedia(
                                    meetingid,
                                    userid,
                                    username,
                                    role,
                                    openVideo,
                                    openAudio,
                                    callback,
                                    retry + 1
                                );
                            }, 2000);
                        }
                    );
                },
                err => {
                    LastError=err.msg;
                    loger.log("client init failed: " + err);
                    setTimeout(() => {
                        this.JoinMedia(
                            meetingid,
                            userid,
                            username,
                            role,
                            openVideo,
                            openAudio,
                            callback,
                            retry + 1
                        );
                    }, 2000);
                }
            );
            this.subscribeStreamEvents();
        },
        Up2Student(userid) {
            //console.log("Up2Student");
            return;
            if(localStream)
            {
                return;
            }
            if(this.isJoin)
            {
                this.initLocalStreamEx(userid,this.enableVideo,this.enableAudio);
            }
            else
            {
                setTimeout(()=>{
                    this.Up2Student(userid);
                },3000);
            }
           
        },
        StartShareScreen() {
            if (LastChangeTime && new Date() - LastChangeTime < 3000) {
                return;
            }
            LastChangeTime = new Date();
            this.isInstallPlugIn().then(isinstall => {
                if (isinstall) {
                    this.getShareScreenRes().then(() => {
                        this.LeaveChannel(screenclient).then(succ => {
                            screenclient = null;
                            screenclient = AgoraRTC.createClient({mode: "live",codec: "vp8"});
                            screenclient.init(AGORA_APPID,() => {
                                    screenclient.join(
                                        null,
                                        "" + channel,
                                        1000000000 + parseInt(uid),
                                        sid => {
                                            if (Browser.isChrome()) {
                                                if(jQuery.browser.version>=72)
                                                {
                                                    screenStream = AgoraRTC.createStream(
                                                        {
                                                            streamID:1000000000 +parseInt(uid),
                                                            audio: false,
                                                            cameraId: "",
                                                            microphoneId: "",
                                                            video: false,
                                                            screen: true
                                                        }
                                                    );
                                                }
                                                else
                                                {
                                                    screenStream = AgoraRTC.createStream(
                                                        {
                                                            streamID:
                                                                1000000000 +
                                                                parseInt(uid),
                                                            audio: false,
                                                            cameraId: "",
                                                            microphoneId: "",
                                                            video: false,
                                                            screen: true,
                                                            extensionId: AGORA_EXTENSIONID
                                                        }
                                                    );
                                                }
                                            } else if (Browser.isFirefox()) {
                                                screenStream = AgoraRTC.createStream(
                                                    {
                                                        streamID:
                                                            1000000000 +
                                                            parseInt(uid),
                                                        audio: false,
                                                        cameraId: "",
                                                        microphoneId: "",
                                                        video: false,
                                                        screen: true,
                                                        mediaSource: "screen"
                                                    }
                                                );
                                            }
                                            var userScreenRes = "1080p_1";
                                            var resl = screenRes; // localStorage.getItem('DefaultResolution');
                                            if (resl && resl != "") {
                                                if (resl == "720P") {
                                                    userScreenRes = "720p_1";
                                                } else if (resl == "1080P") {
                                                    userScreenRes = "1080p_1";
                                                } else {
                                                    userScreenRes = "720p_1";
                                                }
                                            }
                                            //loger.log("ScreenShare:" + userScreenRes);
                                            //screenStream.setVideoProfile("120P");
                                            screenStream.setScreenProfile(
                                                userScreenRes
                                            ); //480p_1  //4K
                                            //screenStream.setScreenProfile('720p_1');
                                            // let maxVideoBW = window.localStorage.getItem(
                                            //     "Agora-maxVideoBW"
                                            // );
                                            // if (!maxVideoBW) {
                                            //     maxVideoBW = 1000;
                                            //     window.localStorage.setItem("Agora-maxVideoBW",maxVideoBW);
                                            // } else {
                                            //     maxVideoBW = parseInt(maxVideoBW);
                                            // }

                                            // let minVideoBW = window.localStorage.getItem("Agora-minVideoBW");
                                            // if (!minVideoBW) {
                                            //     minVideoBW = 100;
                                            //     window.localStorage.setItem("Agora-minVideoBW",minVideoBW);
                                            // } else {
                                            //     minVideoBW = parseInt(minVideoBW);
                                            // }

                                            // loger.log("maxVideoBW:" +maxVideoBW +",minVideoBW:" +minVideoBW);
                                            // screenStream.screenAttributes.minVideoBW = Math.max(100,minVideoBW);
                                            // screenStream.screenAttributes.maxVideoBW =Math.max(1000,maxVideoBW);

                                            screenStream.init(
                                                () => {
                                                    //loger.log("screenStream init success.");
                                                    isShareScreen = true;

                                                    screenclient.on(
                                                        "stream-published",
                                                        evt => {
                                                            //loger.log("local stream published:" + evt.stream.getId());
                                                            //loger.log(evt);
                                                            if (
                                                                1000000000 +
                                                                    parseInt(
                                                                        uid
                                                                    ) ==
                                                                parseInt(
                                                                    evt.stream.getId()
                                                                )
                                                            ) {
                                                                //loger.log("NoticeScreen");
                                                                this.$parent.NoticeScreen();
                                                                this.$parent.ShareScreenEx();
                                                            }
                                                        }
                                                    );
                                                    screenclient.on(
                                                        "lliveStreamingStopped",
                                                        evt => {
                                                            loger.log(
                                                                "lliveStreamingStopped"
                                                            );
                                                        }
                                                    );

                                                    screenclient.publish(
                                                        screenStream,
                                                        err => {
                                                            //loger.log("Timestamp: " + Date.now());
                                                            loger.log(
                                                                "Publish screenStream error: " +
                                                                    err
                                                            );
                                                            this.$Message.error(
                                                                {
                                                                    content:
                                                                        "Share Screen failed, please try again.",
                                                                    duration: 0,closable: true
                                                                }
                                                            );
                                                        }
                                                    );
                                                    screenclient.on(
                                                        "stream-published"
                                                    );
                                                    screenStream.on(
                                                        "stopScreenSharing",
                                                        () => {
                                                            //loger.log("stopScreenSharing");
                                                            this.$parent.ShareDocument();
                                                        }
                                                    );
                                                },
                                                err => {
                                                    loger.log(
                                                        "screenStream init failed.",
                                                        err
                                                    );
                                                    //to do cancel share screen
                                                }
                                            );
                                        },
                                        err => {
                                            this.log(
                                                "screenclient join channel failed: " +
                                                    err
                                            );
                                        }
                                    );
                                },
                                err => {
                                    this.log("screenclient init failed " + err);
                                }
                            );
                        });
                    });
                } else {
                    if (
                        window.confirm(
                            "You need install extensions to share screen, Do you want to install it now?"
                        )
                    ) {
                        window.open(AGORA_EXTENSIONURL);
                    }
                }
            });
        },
        StopShareScreen() {
            if (!isShareScreen) {
                return;
            }
            if (screenSizeTimer) {
                clearTimeout(screenSizeTimer);
                screenSizeTimer = null;
            }
            $("#screenshare").hide();
            $(window).unbind("resize", this.ShareScreenSizeChange);
            //$("#main").show();
            if (screenclient != null && screenStream != null) {
                screenclient.unpublish(screenStream, function(err) {
                    loger.log(
                        "Unpublish screenStream failed with error: ",
                        err
                    );
                });
            }
            if (screenStream != null) {
                //try
                //{
                //  screenStream.stream.getTracks().forEach(track => track.stop());
                //}
                //catch (ex) { }
                if (screenStream.isPlaying()) {
                    try {
                        screenStream.stop();
                    } catch (ex) {}
                }
                try {
                    screenStream.close();
                } catch (ex) {}
                screenStream = null;
            }
            if (screenclient != null) {
                this.LeaveChannel(screenclient).then(succ => {
                    screenclient = null;
                });
            }

            isShareScreen = false;
        },
        ShareScreenResChange(res) {
            screenRes = res;
            if (!isShareScreen) {
                return;
            }
        },
        ShareScreenSizeChange(e) {
            var videoitem = $("#screenshare").find("video");
            if (videoitem.length == 0) {
                if (screenSizeTimer) {
                    clearTimeout(screenSizeTimer);
                    screenSizeTimer = null;
                }
                return;
            }
            //var res = this.getScreenRes;
            var res = videoitem[0].videoWidth + "," + videoitem[0].videoHeight;
            if (!e && screenPreSize == res) {
                return;
            }
            screenPreSize = res;
            //loger.log("ShareScreenSizeChange:" + res);
            var arr = res.split(",");
            var size = null;
            if (arr.length == 2) {
                size = this.getMaxSize4ShareScreen(
                    parseInt(arr[0]),
                    parseInt(arr[1])
                );
            } else {
                size = this.getMaxSize4ShareScreen(
                    videoitem.width(),
                    videoitem.height()
                );
            }
            $("#screenshare").css({
                width: size[0] + "px",
                height: size[1] + "px"
            });
            $("#screenshare")
                .find(">div")
                .css({ width: size[0] + "px", height: size[1] + "px" });
            $("#screenshare")
                .find("div.video-item")
                .css({ width: size[0] + "px", height: size[1] + "px" });
            $("#screenshare")
                .find("video")
                .css({
                    width: size[0] + "px",
                    height: size[1] + "px",
                    top: "0px",
                    left: "0px"
                });
        },
        Leave() {
            loger.log("Leave");
            $("#mediaview").hide();
            $("#liveMediaContainer")
                .empty()
                .hide();
            this.StopShareScreen();
            this.isJoin = false;

            if (client != null && localStream != null) {
                try {
                    client.unpublish(localStream, function(err) {
                        loger.log(
                            "Unpublish localStream failed with error: ",
                            err
                        );
                    });
                } catch (ex) {}
            }

            if (localStream != null) {
                //try
                //{
                //  localStream.stream.getTracks().forEach(track => track.stop());
                //}
                //catch (ex) { }
                if (localStream.isPlaying()) {
                    try {
                        localStream.stop();
                    } catch (ex) {}
                }
                localStream.close();
                localStream = null;
            }
            for (
                var index = 0, length = remoteStreamList.length;
                index < length;
                index += 1
            ) {
                //try
                //{
                //  remoteStreamList[index].stream.getTracks().forEach(track => track.stop());
                //}
                //catch (ex) { }
                if (remoteStreamList[index].stream.isPlaying()) {
                    try {
                        remoteStreamList[index].stream.stop();
                    } catch (ex) {}
                }
            }
            return new Promise((resolve, reject) => {
                this.LeaveChannel(client).then(succ => {
                    this.reset();
                    resolve(true);
                });
            });
        },
        LeaveChannel(c) {
            return new Promise((resolve, reject) => {
                if (c != null) {
                    c.leave(
                        () => {
                            c = null;
                            resolve(true);
                        },
                        () => {
                            resolve(false);
                        }
                    );
                } else {
                    resolve(false);
                }
            });
        },
        ToggleLoaclVideo(enable) {
            //console.log("ToggleLoaclVideo:" + enable);
            if (localStream == null) {
                return;
            }
            if (!enable) {
                localStream.disableVideo();
            } else {
                localStream.enableVideo();
            }
            this.changeVideoMuteStat(-1);
            this.setVideoCtlStat(uid, enable);
        },
        ToggleLoaclAudio(enable, changeByTeacher = false) {
            if (changeByTeacher) {
                this.canOpenAudio = enable;
            }
            if (localStream == null) {
                return;
            }
            if (!enable) {
                localStream.disableAudio();
            } else {
                localStream.enableAudio();
            }
            this.changeAudioMuteStat(-1);
            this.setAudioCtlStat(uid, enable);
        },
        CheckOpenLocalAudio() {
            if (this.canOpenAudio) {
                this.changeEnableAudio(true);
            }
        },
        StartAudioMixing(url, callback) {
            localStream.startAudioMixing(
                {
                    cycle: 1,
                    loop: false,
                    playTime: 0,
                    replace: false,
                    filePath: url
                },
                err => {
                    if (err == null) {
                        loger.log("startAudioMixing success");
                    } else {
                        loger.log(err);
                    }
                }
            );
        },
        getShareScreenRes() {
            return new Promise((resolve, reject) => {
                if (isGetScreenRes == true) {
                    resolve(screenRes);
                    return;
                }

                webapi.getRoomTeacherSetting(channel, 1005).then(
                    res => {
                        isGetScreenRes = true;
                        if (res && res.Text) {
                            screenRes = res.Text;
                        } else if (res == "") {
                            screenRes = "1080P";
                        }
                        resolve(screenRes);
                    },
                    () => {
                        resolve(screenRes);
                    }
                );
            });
        },
        reset() {
            //loger.log("MediaView reset");
            client = null;
            screenclient = null;
            localStream = null;
            screenStream = null;
            remoteStreamList = [];
            muteAudioList = [];
            muteVideoList = [];
            isMixed = false;
            channel = "0";
            disableAudio = false;
            disableVideo = true;
            disableAllAudio = false;
            disableAudioList = [];
            enableLocalVideo = true;
            hideLocalStream = false;
            fullscreenEnabled = false;
            resolution = "480p";
            this.isJoin = false;
        },
        startDrag() {
            return;
            Drag.init(
                $("#media-header")[0],
                $("#video-container")[0],
                null,
                null,
                -10,
                null,
                true
            );
            $("#video-container")[0].onDragEnd = function() {
                prePoz = $("#video-container").css("right");
                preTop = $("#video-container").css("top");
            };
            $("#media-header").css("cursor", "move");
        },
        endDrag() {
            return;
            Drag.cancel($("#media-header")[0]);
            $("#media-header").css("cursor", "pointer");
        },
        getMideaSetting() {
            var camerid = "";
            var micpid = "";
            var res = "";
            var enablevideo = true;
            var enableaudio = true;
            var mic = localStorage.getItem("DefaultMic");
            var camera = localStorage.getItem("DefaultCamera");
            var cameraSecond = localStorage.getItem("DefaultSecondCamera");
            var useSecond = localStorage.getItem("UseSecondCamera");
            var resl = localStorage.getItem("DefaultResolution");
            if (mic && mic != null && mic != "") {
                micpid = mic;
            }
            if (!IsExistInArr(this.micList, micpid)) {
                micpid = "";
            }
            if (this.micList.length < 1) {
                enableaudio = false;
            }
            if (camera && camera != null && camera != "") {
                camerid = camera;
            }
            if (!IsExistInArr(this.cameraList, camerid)) {
                camerid = "";
            }
            if (
                cameraSecond &&
                cameraSecond != null &&
                cameraSecond != "" &&
                camerid != "" &&
                useSecond != null &&
                useSecond == "1"
            ) {
                camerid = cameraSecond;
            }
            if (!IsExistInArr(this.cameraList, camerid)) {
                camerid = "";
            }
            if (this.cameraList.length < 1) {
                enablevideo = false;
            }
            if (resl && resl != "") {
                res = resl.toLowerCase();
            }
            res = resolution;
            return {
                camerid: camerid,
                enablevideo: enablevideo,
                micpid: micpid,
                enableaudio: enableaudio,
                resolution: res
            };
        },
        initLocalStream(id, callback, openVideo, openAudio) {
            var setting = this.getMideaSetting();
            var videoProfile = this.generateVideoProfile(
                setting.resolution,
                maxFrameRate
            );
            if (localStream) {
                // local stream exist already
                try {
                    client.unpublish(localStream, function(err) {
                        loger.log("Unpublish failed with error: ", err);
                    });
                } catch (exp) {}
                localStream.close();
            }
            if (!setting.enableaudio && !setting.enablevideo) {
                if (callback) callback("NoInit");
                return null;
            }

            //this.log("Init Media, mic:" + setting.micpid + ",speaker:" + this.getSpeakerSetting() + ",cameraId:" + setting.camerid);

            localStream = AgoraRTC.createStream({
                streamID: id,
                audio: setting.enableaudio,
                cameraId: setting.camerid,
                microphoneId: setting.micpid,
                video: setting.enablevideo,
                screen: false
            });

            //localStream.setVideoResolution(resolution);
            //localStream.setVideoFrameRate([maxFrameRate, maxFrameRate]);
            //localStream.setVideoBitRate([maxBitRate, maxBitRate]);
            //loger.log("VideoProfile: " + videoProfile);
            // client.setLowStreamParameter({
            //   width: 120,
            //   height: 90,
            //   framerate: 1,
            //   bitrate: 50,
            // });

            // client.enableDualStream(function ()
            // {
            //   //loger.log('Enable dual stream success!')
            // }, function (err)
            //   {
            //   loger.log(err);
            //   });

            localStream.setVideoProfile("480P");
            //localStream.setVideoProfile("1080p_2");

            //localStream.setVideoProfile('720p_3');
            localStream.init(
                () => {
                    //loger.log("Get UserMedia successfully");
                    //loger.log(localStream);

                    if (!this.enableAudio) {
                        localStream.disableAudio();
                    }
                    if (!this.enableVideo) {
                        localStream.disableVideo();
                    }
                    this.setAudioCtlStat(id, this.enableAudio);
                    this.setVideoCtlStat(id, this.enableVideo);

                    var size = this.calculateVideoSize();
                    var ptop = 0;
                    if (mediaFullMode == 0) {
                        $("div[id^='agora-local']").remove();
                        $("#mediauserview" + localStream.getId()).remove();
                        ptop +=
                            $("#video-container-multiple").find(
                                ">div.media-main-panel"
                            ).length * 180;
                        this.getUsersInfo([id]).then(userinfo => {
                            this.createUserContainer(
                                localStream.getId(),
                                this.getUserName(new Array(), id),
                                ptop,
                                enableLocalVideo,
                                0,
                                "liveMediaContainer",
                                this.getUserInfo(userinfo, localStream.getId())
                            );
                            //loger.log("Show local stream");
                            this.displayStream(
                                "agora-local",
                                localStream,
                                size.width,
                                size.height,
                                "local-partner-video",
                                "mediauserview" + localStream.getId()
                            );
                        });
                    } else {
                        this.showOneStream(localStream);
                    }

                    client.publish(localStream, err => {
                        //loger.log("Timestamp: " + Date.now());
                        LastError=err.msg;
                        loger.log("Publish local stream error: " + err);
                        localStream.close();
                        if (callback) callback("PublishError");
                        //localStream = null;
                        //this.initLocalStream(id, callback, openVideo, openAudio);
                    });
                    client.on("stream-published");

                    if (callback) callback();
                },
                err => {
                    LastError=err.msg;
                    if (callback) callback("InitError");
                    loger.log("Local stream init failed.", err);
                }
            );
            return localStream;
        },
        initLocalStreamEx(id, openVideo, openAudio) {
            //console.log("initLocalStreamEx:"+id);
            return new Promise((resolve, reject) => {
                var setting = this.getMideaSetting();
                var videoProfile = this.generateVideoProfile(
                    setting.resolution,
                    maxFrameRate
                );
                if (localStream) {
                    try {
                        client.unpublish(localStream, function(err) {
                            //console.log(err)
                        });
                    } catch (exp) {
                        //console.log(exp)
                    }
                    localStream.close();
                }
                if (!setting.enableaudio && !setting.enablevideo) {
                    //if (callback) callback("NoInit");
                    resolve({Code:1,Msg:"没有可用的摄像头和麦克风"});
                    return null;
                }
                //console.log("createStream,cameraId:"+setting.camerid+",microphoneId:"+setting.micpid);
                localStream = AgoraRTC.createStream({
                    streamID: id,
                    audio: setting.enableaudio,
                    cameraId: setting.camerid,
                    microphoneId: setting.micpid,
                    video: setting.enablevideo,
                    screen: false
                });

                //localStream.setVideoResolution(resolution);          
                localStream.setVideoProfile("480P");
                //localStream.setVideoProfile("1080p_2");
                //localStream.setVideoProfile('720p_3');
                localStream.init(() => {
                        if (!this.enableAudio) {
                            localStream.disableAudio();
                        }
                        if (!this.enableVideo) {
                            localStream.disableVideo();
                        }
                        this.setAudioCtlStat(id, this.enableAudio);
                        this.setVideoCtlStat(id, this.enableVideo);

                        

                        client.on("stream-published", (evt)=> {
                            //console.log("stream-published");
                            // var size = this.calculateVideoSize();
                            // var ptop = 0;
                            // if (mediaFullMode == 0) {
                            //     $("div[id^='agora-local']").remove();
                            //     $("#mediauserview" + localStream.getId()).remove();
                            //     ptop +=$("#video-container-multiple").find(">div.media-main-panel").length * 180;
                            //     this.getUsersInfo([id]).then(userinfo => {
                            //         this.createUserContainer(
                            //             localStream.getId(),
                            //             this.getUserName(new Array(), id),
                            //             ptop,
                            //             enableLocalVideo,
                            //             0,
                            //             "liveMediaContainer",
                            //             this.getUserInfo(userinfo, localStream.getId())
                            //         );
                            //         //loger.log("Show local stream");
                            //         this.displayStream(
                            //             "agora-local",
                            //             localStream,
                            //             size.width,
                            //             size.height,
                            //             "local-partner-video",
                            //             "mediauserview" + localStream.getId()
                            //         );
                            //     });
                            // } else {
                            //     this.showOneStream(localStream);
                            // }

                            resolve({Code:0,Msg:"OK",Data:localStream});
                        });
                        //console.log("client.publish");
                        client.publish(localStream, err => {
                            LastError=err.msg;
                            loger.log("Publish local stream error: " + err);
                            localStream.close();
                            //if (callback) callback("PublishError");
                            console.log(err);
                            resolve({Code:2,Msg:err.msg});
                        });
                        

                        //if (callback) callback();
                        //resolve({Code:0,Msg:"OK",Data:localStream});
                    },
                    err => {
                        LastError=err.msg;
                        //if (callback) callback("InitError");
                        console.log(err);
                        resolve({Code:3,Msg:err.msg});
                    }
                );
                //return localStream;
                
            });
        },
        sleep(time)
        {
             return new Promise((resolve, reject) => {
                 setTimeout(()=>{resolve(true)},time);
             });
        },
        toResolution(res = "720p", callback) {
            if (localStream) {
                // local stream exist already
                try {
                    client.unpublish(localStream, function(err) {
                        loger.log("Unpublish failed with error: ", err);
                    });
                } catch (exp) {}
                localStream.close();
            }
            var setting = this.getMideaSetting();
            var videoProfile = this.generateVideoProfile(res, maxFrameRate);
            localStream = AgoraRTC.createStream({
                streamID: uid,
                audio: setting.enableaudio,
                cameraId: setting.camerid,
                microphoneId: setting.micpid,
                video: setting.enablevideo,
                screen: false
            });
            loger.log("VideoProfile: " + videoProfile);
            localStream.setVideoProfile(videoProfile);

            localStream.init(
                () => {
                    if (!this.enableAudio) {
                        localStream.disableAudio();
                    }
                    if (!this.enableVideo) {
                        localStream.disableVideo();
                    }
                    var size = this.calculateVideoSize();
                    var ptop = 0;
                    {
                        $("div[id^='agora-local']").remove();
                        $("#mediauserview" + localStream.getId()).remove();
                        ptop +=
                            $("#video-container-multiple").find(
                                ">div.media-main-panel"
                            ).length * 180;
                        this.getUsersInfo([uid]).then(userinfo => {
                            this.createUserContainer(
                                localStream.getId(),
                                this.getUserName(new Array(), uid),
                                ptop,
                                enableLocalVideo,
                                0,
                                "liveMediaContainer",
                                this.getUserInfo(userinfo, localStream.getId())
                            );
                            this.displayStream(
                                "agora-local",
                                localStream,
                                size.width,
                                size.height,
                                "local-partner-video",
                                "mediauserview" + localStream.getId()
                            );
                        });
                    }

                    client.publish(localStream, err => {
                        loger.log("Publish local stream error: " + err);
                        localStream.close();
                        if (callback) callback("PublishError");
                        //localStream = null;
                        //this.initLocalStream(id, callback, openVideo, openAudio);
                    });
                    client.on("stream-published");
                    if (callback) callback();
                },
                err => {
                    loger.log("Local stream init failed.", err);
                }
            );
        },
        removeStream(tagId, streamId) {
            var streamDiv = $("#" + tagId + streamId);
            if (streamDiv && streamDiv.length > 0) {
                streamDiv.remove();
            }
        },
        removeOneStream(streamid) {
            //loger.log("removeOneStream");
            if (
                localStream &&
                streamid == localStream.getId() &&
                localStream.isPlaying()
            ) {
                localStream.stop();
            }
            var index, tmp;
            var result = false;
            for (index = remoteStreamList.length - 1; index >= 0; index--) {
                var tmp = remoteStreamList[index];
                if (tmp.id === streamid) {
                    var toRemove = remoteStreamList.splice(index, 1);
                    if (toRemove.length === 1) {
                        //delete toRemove[1];
                        //try
                        //{
                        //  toRemove[0].stream.getTracks().forEach(track => track.stop());
                        //}
                        //catch (ex) { }
                        if (toRemove[0].stream.isPlaying()) {
                            toRemove[0].stream.stop();
                        }
                        result = true;
                    }
                }
            }
            $("#mediauser-" + streamid).remove();

            //var uid = streamid + "";
            //if (!this.canShowVideo(uid))
            //{
            //  $("#mediauser-" + streamid).remove();
            //}
            //else
            //{
            //  var userlist = new Array();
            //  userlist.push(uid);
            //  this.getUsersInfo(userlist).then((userinfo) =>
            //  {
            //    var orderedInfo = this.sortUserInfo(userinfo);
            //    var html = '<div style="position:absolute;top:0px; left:0px;z-index:2;color:white;">' + this.getUserName(orderedInfo, uid) + '</div>';
            //    $("#mediauser-" + uid).css({ "background-color":"black"}).html(html);
            //  });
            //}
        },
        stopStream(streamid) {
            if (streamid == localStream.getId() && localStream.isPlaying()) {
                localStream.stop();
            }
            var index, tmp;
            for (index = remoteStreamList.length - 1; index >= 0; index--) {
                var tmp = remoteStreamList[index];
                if (tmp.id + "" === streamid + "") {
                    //try
                    //{
                    //  remoteStreamList[index].stream.getTracks().forEach(track => track.stop());
                    //}
                    //catch (ex) { }
                    try {
                        if (remoteStreamList[index].stream.isPlaying()) {
                            remoteStreamList[index].stream.stop();
                        }
                    } catch (ex) {}
                }
            }
        },
        getStream(streamid) {
            if (streamid == localStream.getId()) {
                return localStream;
            }
            var index, tmp;
            for (index = remoteStreamList.length - 1; index >= 0; index--) {
                var tmp = remoteStreamList[index];
                if (tmp.id + "" === streamid + "") {
                    return remoteStreamList[index].stream;
                }
            }
            return null;
        },
        getStreamCount() {
            var arr = new Array();
            if (localStream != null) {
                arr.push(localStream.getId() + "");
            }
            var index, tmp;
            for (index = remoteStreamList.length - 1; index >= 0; index--) {
                var tmp = remoteStreamList[index];
                if (!IsExistInArr(arr, tmp.id + "")) {
                    arr.push(tmp.id + "");
                }
            }
            return arr.length;
        },
        playStreamOnMaxUser(stream) {
            if (stream == null) return;
            var userlist = new Array();
            userlist.push(stream.getId());
            this.getUsersInfo(userlist).then(userinfo => {
                var orderedInfo = this.sortUserInfo(userinfo);
                var size = this.calculateVideoSize(false);

                let html =
                    '<div id="mediavideoback" class="media-video-back"><span class="media-icon-ctl-back"><span class="icon icon-back"></span></span></div>';
                $("#mediavideoback").remove();
                $("#mediamaxuser").append(html);
                $("#mediavideoback").bind("click", this.backToLesson);
                if (stream.isPlaying()) stream.stop();
                this.createUserContainer4Max(
                    stream.getId(),
                    this.getUserName(orderedInfo, stream.getId()),
                    this.getUserVideoIndex(orderedInfo, stream.getId()) * 180,
                    stream.video,
                    0,
                    "mediamaxuser",
                    false,
                    false,
                    this.getUserInfo(orderedInfo, stream.getId())
                );
                stream.play("mediauserview" + stream.getId(),  {fit: "contain"});
                this.setStreamSpeaker(stream.getId());
                if (stream.getId() == uid + "") {
                    $("#video" + uid).attr(
                        "style",
                        "width: 100%; height: 100%; position: absolute; object-fit: cover;"
                    );
                    this.setAudioCtlStat(
                        stream.getId(),
                        stream.hasAudio() && this.getAudioStat(stream.getId())
                    );
                    this.setVideoCtlStat(
                        stream.getId(),
                        stream.hasVideo() && this.getVideoStat(stream.getId())
                    );
                } else {
                    this.setAudioCtlStat(
                        stream.getId(),
                        stream.hasAudio() && this.getAudioStat(stream.getId())
                    );
                    this.setVideoCtlStat(
                        stream.getId(),
                        stream.hasVideo() && this.getVideoStat(stream.getId())
                    );
                }
                var cMaxUserid = stream.getId();
                var maxSize = this.getMaxSize4FullScreen();

                preMaxUser = cMaxUserid;
                $("#mediamaxview").css({
                    width: maxSize[0] + "px",
                    height: maxSize[1] + "px"
                });
                $("#mediauser-" + cMaxUserid).css({
                    width: maxSize[0] + "px",
                    height: maxSize[1] + "px"
                });
                $("#mediauserview" + cMaxUserid).css({
                    width: maxSize[0] + "px",
                    height: maxSize[1] + "px"
                });
                $("#mediauser-" + cMaxUserid)
                    .find("div.video-item")
                    .css({
                        width: maxSize[0] + "px",
                        height: maxSize[1] + "px"
                    });
            });
        },
        playStreamOnMaxList(stream) {
            if (stream == null) return;
            var userlist = new Array();
            userlist.push(stream.getId());
            this.getUsersInfo(userlist).then(userinfo => {
                var orderedInfo = this.sortUserInfo(userinfo);
                var size = [120, 90]; //this.calculateVideoSize(false);
                this.createUserContainer4Max(
                    stream.getId(),
                    this.getUserName(orderedInfo, stream.getId()),
                    this.getUserVideoIndex(orderedInfo, stream.getId()) * 180,
                    stream.video,
                    0,
                    "mediamaxlist",
                    true,
                    true,
                    this.getUserInfo(orderedInfo, stream.getId())
                );
                stream.play("mediauserview" + stream.getId(),  {fit: "contain"});
                this.setStreamSpeaker(stream.getId());
                if (stream.getId() == uid + "") {
                    $("#video" + uid).attr(
                        "style",
                        "width: 100%; height: 100%; position: absolute; object-fit: cover;"
                    );
                    this.setAudioCtlStat(
                        stream.getId(),
                        stream.hasAudio() && this.getAudioStat(stream.getId())
                    );
                    this.setVideoCtlStat(
                        stream.getId(),
                        stream.hasVideo() && this.getVideoStat(stream.getId())
                    );
                } else {
                    this.setAudioCtlStat(
                        stream.getId(),
                        stream.hasAudio() && this.getAudioStat(stream.getId())
                    );
                    this.setVideoCtlStat(
                        stream.getId(),
                        stream.hasVideo() && this.getVideoStat(stream.getId())
                    );
                }
            });
        },
        displayStream(tagId, stream, width, height, className, parentNodeId) {
            //console.log("displayStream:"+tagId)
            // cleanup, if network connection interrupted, user cannot receive any events.
            // after reconnecting, the same node id is reused,
            // so remove html node with same id if exist.
            //alert(stream.video);
            this.removeElementIfExist(tagId, stream.getId());

            var $container;
            if (parentNodeId) {
                $container = $("#" + parentNodeId);
            } else {
                $container = $("#video-container-multiple");
            }

            // mixed mode
            if (this.isMixed) {
                width = 192;
                height = 120;
                className = "video-item";
            } else {
                className += " video-item";
            }
            if (stream.video == false) {
                height = 0;
            }
            var styleStr = "width:100%; height:100%;";

            if (className.indexOf("local-partner-video") > -1) {
                var videoWidth = ($("#video-container").height() * 4) / 3;
                var right = (1200 - videoWidth) / 2 + 12;

                styleStr += "top:0px; right:0px;";
            }
            $container.append(
                '<div id="' +
                    tagId +
                    stream.getId() +
                    '" class="' +
                    className +
                    '" data-stream-id="' +
                    stream.getId() +
                    '" style="' +
                    styleStr +
                    '"></div>'
            );

            // $("#" + tagId + stream.getId()).css();
            stream.play(tagId + stream.getId(),  {fit: "contain"});
            this.setStreamSpeaker(stream.getId());

            //$("#" + tagId + stream.getId()).attr("style", styleStr);
            //setTimeout(() =>
            //{
            //  $("#video" + stream.getId()).css({ "left": "0px;" });
            //}, 1000);
            //$("#volume_" + stream.getId()).attr("src","static/images/sound.png");
            if (stream.getId() != uid + "") {
                this.setAudioCtlStat(
                    stream.getId(),
                    stream.hasAudio() && this.getAudioStat(stream.getId())
                );
                this.setVideoCtlStat(
                    stream.getId(),
                    stream.hasVideo() && this.getVideoStat(stream.getId())
                );
            } else {
                this.setAudioCtlStat(
                    stream.getId(),
                    stream.hasAudio() && this.getAudioStat(stream.getId())
                );
                this.setVideoCtlStat(
                    stream.getId(),
                    stream.hasVideo() && this.getVideoStat(stream.getId())
                );
                $("#video" + uid).attr(
                    "style",
                    "width: 100%; height: 100%; position: absolute; object-fit: cover;left:0px;"
                );
            }

            if (stream.video == false) {
                //player_225016495
                //alert($("#player_" + stream.getId()).parent().attr("id"));
                //$("#player_" + stream.getId()).parent().height(30);
                //$("#mediauser-" + stream.getId()).height(0);
            }

            if (stream.videoEnabled == false) {
                //alert("videoEnabled==false");
                stream.disableVideo();
            }
        },
        showStreamOnPeerLeave(streamId) {
            var sid = parseInt(streamId);
            if (sid > 1500000000) {
                //android tv not show
                return;
            }
            var removed = this.removeStreamFromList(Number(streamId));
            if (this.recorder != null) {
                this.recorder.replaceStream(this.getAudioStream());
            }
            if (!removed) {
                $("#mediauser-" + streamId).remove();
                if (mediaFullMode == 0) {
                    this.orderUserMideaSize();
                }
                //loger.log("showStreamOnPeerLeave remove error");
                return;
            }
            if (sid > 1000000000) {
                $("#screenshare").hide();
                //$("#main").show();
                return;
            }
            this.removeOneStream(Number(streamId));
            if (mediaFullMode == 0) {
                this.orderUserMideaSize();
            }
            //this.showAllStream();

            // workaround to remove bottom bar
            $("div[id^='bar_']").remove();
        },
        showStreamOnPeerAdded(stream) {
            var sid = parseInt(stream.getId());
            //225016495
            if (sid > 1500000000) {
                //android tv not show
                return;
            }
            this.addToRemoteStreamList(stream, true, true);
            if (this.recorder != null) {
                this.recorder.replaceStream(this.getAudioStream());
            }
            // if (sid < 1000000000)
            // {
            //   client.setStreamFallbackOption(stream, 2);//设置音视频流回退策略 0: 关闭回退策略，弱网时不对音视频流作回退处理。 1: 弱网时允许自动订阅视频小流。2: 弱网时允许自动订阅视频小流或只订阅音频流。
            // }

            if (!this.checkShareScreen(stream)) {
                if (this.canShowVideo(parseInt(stream.getId()))) {
                    this.showOneStream(stream);
                }
            }
            if (disableAllAudio == true) {
                this.DisableAllAudio();
            }
            //this.showAllStream();

            // workaround to remove bottom bar
            $("div[id^='bar_']").remove();
        },
        checkShareScreen(stream) {
            var sid = parseInt(stream.getId());
            if (sid > 1000000000 && isShareScreen == true) {
                if (sid - 1000000000 + "" == uid + "") {
                    //now show mine screeen
                    return true;
                }
            }
            if (sid > 1000000000) {
                this.showScreenShare(stream);
                return true;
            } else {
                return false;
            }
        },
        showAllStream() {
            //console.log("showAllStream");
            var userlist = new Array();
            if (localStream != null) {
                userlist.push(localStream.getId());
            }
            for (var i = 0; i < remoteStreamList.length; i++) {
                userlist.push(remoteStreamList[i].id);
            }
            this.getUsersInfo(userlist).then(userinfo => {
                var orderedInfo = this.sortUserInfo(userinfo);
                var size = this.calculateVideoSize(false);
                this.clearAllStream();
                var ptop = 0;
                if (localStream != null) {
                    this.createUserContainer(
                        localStream.getId(),
                        this.getUserName(orderedInfo, localStream.getId()),
                        this.getUserVideoIndex(
                            orderedInfo,
                            localStream.getId()
                        ) * 180,
                        enableLocalVideo,
                        0,
                        "liveMediaContainer",
                        this.getUserInfo(orderedInfo, localStream.getId())
                    );
                    this.displayStream(
                        "agora-local",
                        localStream,
                        size.width,
                        size.height,
                        "local-partner-video",
                        "mediauserview" + localStream.getId()
                    );
                }

                for (var i = 0; i < remoteStreamList.length; i++) {
                    if (this.checkShareScreen(remoteStreamList[i].stream)) {
                        continue;
                    }
                    this.createUserContainer(
                        remoteStreamList[i].stream.getId(),
                        this.getUserName(
                            orderedInfo,
                            remoteStreamList[i].stream.getId()
                        ),
                        this.getUserVideoIndex(
                            orderedInfo,
                            remoteStreamList[i].stream.getId()
                        ) * 180,
                        remoteStreamList[i].stream.video,
                        0,
                        "liveMediaContainer",
                        this.getUserInfo(
                            orderedInfo,
                            remoteStreamList[i].stream.getId()
                        )
                    );
                    this.displayStream(
                        "agora-remote",
                        remoteStreamList[i].stream,
                        size.width,
                        size.height,
                        "remote-partner-video-multiple",
                        "mediauserview" + remoteStreamList[i].stream.getId()
                    );
                }
            });
        },
        showAllStream4Max(size) {
            //console.log("showAllStream4Max");
            var userlist = new Array();
            for (var i = 0; i < remoteStreamList.length; i++) {
                userlist.push(remoteStreamList[i].id);
            }
            if (localStream != null) {
                userlist.push(localStream.getId());
            }
            loger.log("remoteStreamList.length:" + remoteStreamList.length);
            this.getUsersInfo(userlist).then(userinfo => {
                var orderedInfo = this.sortUserInfo(userinfo);
                //var size = [120, 90]; //this.calculateVideoSize(false);
                var ptop = 0;
                var isLocalStreamShow = false;
                var firstStream = null;
                firstStream = this.getFirstStream();
                if (firstStream == null) {
                    firstStream = localStream;
                    isLocalStreamShow = true;
                } else {
                    if (localStream.getId() == firstStream.getId()) {
                        isLocalStreamShow = true;
                    }
                }
                if (firstStream && firstStream != null) {
                    this.$parent.NoticeMeeting(2, firstStream.getId() + "");
                } else if (localStream != null) {
                    this.$parent.NoticeMeeting(2, localStream.getId() + "");
                }
                if (
                    firstStream &&
                    firstStream != null &&
                    !this.checkShareScreen(firstStream)
                ) {
                    this.playStreamOnMaxUser(firstStream);
                    if (false) {
                        let html =
                            '<div id="mediavideoback" class="media-video-back"><span class="media-icon-ctl-back"><span class="icon icon-back"></span></span></div>';
                        $("#mediavideoback").remove();
                        $("#mediamaxuser").append(html);
                        $("#mediavideoback").bind("click", this.backToLesson);
                        this.createUserContainer4Max(
                            firstStream.getId(),
                            this.getUserName(orderedInfo, firstStream.getId()),
                            this.getUserVideoIndex(
                                orderedInfo,
                                firstStream.getId()
                            ) * 180,
                            firstStream.video,
                            0,
                            "mediamaxuser",
                            false,
                            false,
                            this.getUserInfo(orderedInfo, firstStream.getId())
                        );
                        //this.displayStream('agora-local', firstStream, size.width, size.height, 'local-partner-video', 'mediauserview' + firstStream.getId());
                        firstStream.play(
                            "mediauserview" + firstStream.getId(),
                             {fit: "contain"}
                        );
                        this.setStreamSpeaker(firstStream.getId());
                        if (firstStream.getId() == uid + "") {
                            $("#video" + uid).attr(
                                "style",
                                "width: 100%; height: 100%; position: absolute; object-fit: cover;"
                            );
                        }

                        var cMaxUserid = firstStream.getId();
                        var maxSize = size; //this.getMaxSize();
                        preMaxUser = cMaxUserid;
                        $("#mediamaxview").css({
                            width: maxSize[0] + "px",
                            height: maxSize[1] + "px"
                        });
                        $("#mediauser-" + cMaxUserid).css({
                            width: maxSize[0] + "px",
                            height: maxSize[1] + "px"
                        });
                        $("#mediauserview" + cMaxUserid).css({
                            width: maxSize[0] + "px",
                            height: maxSize[1] + "px"
                        });
                        $("#mediauser-" + cMaxUserid)
                            .find("div.video-item")
                            .css({
                                width: maxSize[0] + "px",
                                height: maxSize[1] + "px"
                            });
                    }
                }
                if (localStream != null && !isLocalStreamShow) {
                    this.createUserContainer4Max(
                        localStream.getId(),
                        this.getUserName(orderedInfo, localStream.getId()),
                        this.getUserVideoIndex(
                            orderedInfo,
                            localStream.getId()
                        ) * 180,
                        localStream.video,
                        0,
                        "mediamaxlist",
                        true,
                        true,
                        this.getUserInfo(orderedInfo, localStream.getId())
                    );
                    //this.displayStream('agora-local', localStream, size.width, size.height, 'local-partner-video', 'mediauserview' + localStream.getId());
                    localStream.play(
                        "mediauserview" + localStream.getId(),
                         {fit: "contain"}
                    );
                    this.setStreamSpeaker(localStream.getId());
                    if (localStream.getId() == uid + "") {
                        $("#video" + uid).attr(
                            "style",
                            "width: 100%; height: 100%; position: absolute; object-fit: cover;"
                        );
                    }
                    this.setAudioCtlStat(
                        localStream.getId(),
                        localStream.hasAudio() &&
                            this.getAudioStat(localStream.getId())
                    );
                    this.setVideoCtlStat(
                        localStream.getId(),
                        localStream.hasVideo() &&
                            this.getVideoStat(localStream.getId())
                    );
                }

                for (var i = 0; i < remoteStreamList.length; i++) {
                    if (this.checkShareScreen(remoteStreamList[i].stream)) {
                        continue;
                    }
                    if (
                        $("#mediauser-" + remoteStreamList[i].stream.getId())
                            .length > 0
                    ) {
                        continue;
                    }

                    this.createUserContainer4Max(
                        remoteStreamList[i].stream.getId(),
                        this.getUserName(
                            orderedInfo,
                            remoteStreamList[i].stream.getId()
                        ),
                        this.getUserVideoIndex(
                            orderedInfo,
                            remoteStreamList[i].stream.getId()
                        ) * 180,
                        remoteStreamList[i].stream.video,
                        0,
                        "mediamaxlist",
                        true,
                        true,
                        this.getUserInfo(
                            orderedInfo,
                            remoteStreamList[i].stream.getId()
                        )
                    );
                    //this.displayStream("agora-remote", remoteStreamList[i].stream, size.width, size.height, "remote-partner-video-multiple", 'mediauserview' + remoteStreamList[i].stream.getId());
                    remoteStreamList[i].stream.play(
                        "mediauserview" + remoteStreamList[i].stream.getId(),
                         {fit: "contain"}
                    );
                    this.setStreamSpeaker(remoteStreamList[i].stream.getId());
                    if (remoteStreamList[i].stream.getId() == uid + "") {
                        $("#video" + uid).attr(
                            "style",
                            "width: 100%; height: 100%; position: absolute; object-fit: cover;"
                        );
                    }
                    this.setAudioCtlStat(
                        remoteStreamList[i].stream.getId(),
                        remoteStreamList[i].stream.hasAudio() &&
                            this.getAudioStat(
                                remoteStreamList[i].stream.getId()
                            )
                    );
                    this.setVideoCtlStat(
                        remoteStreamList[i].stream.getId(),
                        remoteStreamList[i].stream.hasVideo() &&
                            this.getVideoStat(
                                remoteStreamList[i].stream.getId()
                            )
                    );
                }
            });
        },
        showAllStream4FullScreen(size) {
            //console.log("showAllStream4FullScreen");
            var userlist = new Array();
            for (var i = 0; i < remoteStreamList.length; i++) {
                userlist.push(remoteStreamList[i].id);
            }
            if (localStream != null) {
                userlist.push(localStream.getId());
            }
            this.getUsersInfo(userlist).then(userinfo => {
                var orderedInfo = this.sortUserInfo(userinfo);
                var ptop = 0;
                $("#mediamaxview").css({
                    width: size[2] + "px",
                    height: size[3] + "px"
                });
                $("#mediamaxlist")
                    .attr("style", "")
                    .css({ width: size[2] + "px", height: size[3] + "px" });
                $("#media-header").width(size[2]);
                let html =
                    '<div id="mediavideoback" class="media-video-back"><span class="media-icon-ctl-back"><span class="icon icon-back"></span></span></div>';
                $("#mediavideoback").remove();
                $("#mediamaxlist").append(html);
                $("#mediavideoback").bind("click", this.backToLesson);
                if (localStream != null) {
                    if (localStream.isPlaying()) localStream.stop();
                    this.createUserContainer4Max(
                        localStream.getId(),
                        this.getUserName(orderedInfo, localStream.getId()),
                        this.getUserVideoIndex(
                            orderedInfo,
                            localStream.getId()
                        ) * 180,
                        localStream.video,
                        0,
                        "mediamaxlist",
                        false,
                        true,
                        this.getUserInfo(orderedInfo, localStream.getId())
                    );
                    //this.displayStream('agora-local', localStream, size.width, size.height, 'local-partner-video', 'mediauserview' + localStream.getId());
                    localStream.play(
                        "mediauserview" + localStream.getId(),
                         {fit: "contain"}
                    );
                    this.setStreamSpeaker(localStream.getId());
                    if (localStream.getId() == uid + "") {
                        $("#video" + uid).attr(
                            "style",
                            "width: 100%; height: 100%; position: absolute; object-fit: cover;"
                        );
                    }

                    this.setAudioCtlStat(
                        localStream.getId(),
                        localStream.hasAudio() &&
                            this.getAudioStat(localStream.getId())
                    );
                    this.setVideoCtlStat(
                        localStream.getId(),
                        localStream.hasVideo() &&
                            this.getVideoStat(localStream.getId())
                    );
                    $("#video" + localStream.getId()).css({ left: "0px;" });
                    this.setVideoSize(localStream.getId(), size);
                }

                for (var i = 0; i < remoteStreamList.length; i++) {
                    if (this.checkShareScreen(remoteStreamList[i].stream)) {
                        continue;
                    }
                    if (
                        $("#mediauser-" + remoteStreamList[i].stream.getId())
                            .length > 0
                    ) {
                        continue;
                    }
                    this.createUserContainer4Max(
                        remoteStreamList[i].stream.getId(),
                        this.getUserName(
                            orderedInfo,
                            remoteStreamList[i].stream.getId()
                        ),
                        this.getUserVideoIndex(
                            orderedInfo,
                            remoteStreamList[i].stream.getId()
                        ) * 180,
                        remoteStreamList[i].stream.video,
                        0,
                        "mediamaxlist",
                        false,
                        true,
                        this.getUserInfo(
                            orderedInfo,
                            remoteStreamList[i].stream.getId()
                        )
                    );
                    //this.displayStream("agora-remote", remoteStreamList[i].stream, size.width, size.height, "remote-partner-video-multiple", 'mediauserview' + remoteStreamList[i].stream.getId());
                    remoteStreamList[i].stream.play(
                        "mediauserview" + remoteStreamList[i].stream.getId(),
                         {fit: "contain"}
                    );
                    this.setStreamSpeaker(remoteStreamList[i].stream.getId());
                    if (remoteStreamList[i].stream.getId() == uid + "") {
                        $("#video" + uid).attr(
                            "style",
                            "width: 100%; height: 100%; position: absolute; object-fit: cover;"
                        );
                    }
                    this.setAudioCtlStat(
                        remoteStreamList[i].stream.getId(),
                        remoteStreamList[i].stream.hasAudio() &&
                            this.getAudioStat(
                                remoteStreamList[i].stream.getId()
                            )
                    );
                    this.setVideoCtlStat(
                        remoteStreamList[i].stream.getId(),
                        remoteStreamList[i].stream.hasVideo() &&
                            this.getVideoStat(
                                remoteStreamList[i].stream.getId()
                            )
                    );
                    $("#video" + remoteStreamList[i].stream.getId()).css({
                        left: "0px;"
                    });
                    this.setVideoSize(remoteStreamList[i].stream.getId(), size);
                }
            });
        },
        backToLesson(evt) {
            //alert("backToLesson");
            this.$parent.VideoModeBack();
        },
        getFirstStream() {
            if (preOneBigViewUser == null) {
                return null;
            }
            if (localStream.getId() == preOneBigViewUser) {
                return localStream;
            }
            for (var i = 0; i < remoteStreamList.length; i++) {
                if (remoteStreamList[i].stream.getId() == preOneBigViewUser) {
                    return remoteStreamList[i].stream;
                }
            }
            if (remoteStreamList.length > 0) {
                return remoteStreamList[0].stream;
            }
            return null;
        },
        setVideoSize(id, size) {
            $("#mediauser-" + id).css({
                width: size[0] + "px",
                height: size[1] + "px"
            });
            $("#mediauserview" + id).css({
                width: size[0] + "px",
                height: size[1] + "px"
            });
            $("#mediauser-" + id)
                .find("div.video-item")
                .css({ width: size[0] + "px", height: size[1] + "px" });
        },
        showOneStream(stm) {
            if (stm == null) {
                return;
            }
            var userlist = new Array();
            userlist.push(stm.getId());
            this.getUsersInfo(userlist).then(userinfo => {
                var orderedInfo = this.sortUserInfo(userinfo);
                var size = this.calculateVideoSize(false);
                var ptop = 0;
                //console.log("hasVideo"+stm.hasVideo());

                if (mediaFullMode == 2) {
                    //max list
                    //loger.log("max list")
                    this.fullVideoListView();
                } else if (mediaFullMode == 1) {
                    //max one big
                    //loger.log("max one big" + preOneBigViewUser)
                    //preOneBigViewUser

                    if (
                        preOneBigViewUser &&
                        preOneBigViewUser != "" &&
                        preOneBigViewUser == stm.getId()
                    ) {
                        this.playStreamOnMaxUser(stm);
                    } else {
                        this.playStreamOnMaxList(stm);
                    }
                } else if (mediaFullMode == 0) {
                    //show doc share screen
                    //loger.log("show doc share screen")
                    this.createUserContainer(
                        stm.getId(),
                        this.getUserName(orderedInfo, stm.getId()),
                        this.getUserVideoIndex(orderedInfo, stm.getId()) * 180,
                        stm.video,
                        0,
                        "liveMediaContainer",
                        this.getUserInfo(orderedInfo, stm.getId())
                    );
                    this.displayStream(
                        "agora-remote",
                        stm,
                        size.width,
                        size.height,
                        "remote-partner-video-multiple",
                        "mediauserview" + stm.getId()
                    );
                } else if (mediaMode == 1 || mediaMode == 2) {
                    //loger.log("playStreamOnMaxList")
                    this.playStreamOnMaxList(stm);
                }
            });
        },
        showScreenShare(stm) {
            var s = stm.screenAttributes;
            var res = this.getScreenRes;
            //stm.getStats(function (stats)
            //{
            //  loger.log("showScreenShare:" + stats.videoReceivedResolutionWidth + "," + stats.videoReceivedResolutionHeight);
            //});
            //$("#main").hide();
            $("#live-welcomepage").hide();
            $("#screenshare").show();
            $("#screenshare").html("");
            //console.log("showScreenShare:"+stm.getId());
            var html ="<div id='screenshare_" +stm.getId() +"' style='float:left;width:100%;height:100%;'></div>";
            $("#screenshare").append(html);
            stm.play("screenshare_" + stm.getId(), {fit: "contain"});
           
            var videoitem = $("#screenshare_" + stm.getId()).find("video");
            if (videoitem.length > 0) {
                videoitem.parent().css("background-color", "");
                res = videoitem[0].videoWidth + "," + videoitem[0].videoHeight;
            }
            var arr = res.split(",");
            var size = null;
            if (arr.length == 2 && arr[0] != "0" && arr[0] != "0") {
                size = this.getMaxSize4ShareScreen(
                    parseInt(arr[0]),
                    parseInt(arr[1])
                );
            } else {
                size = this.getMaxSize4ShareScreen(s.width, s.height);
            }
            loger.log("screenshare:" + size[0] + "," + size[1]);
            $("#screenshare").css({
                width: size[0] + "px",
                height: size[1] + "px"
            });
            //$("#screenshare_" + stm.getId()).css({ "width": size[0] + "px", "height": size[1] + "px" });
            $("#screenshare")
                .find("div.video-item")
                .css({ width: size[0] + "px", height: size[1] + "px" });
            $("#screenshare")
                .find("video")
                .css({
                    width: size[0] + "px",
                    height: size[1] + "px",
                    top: "0px",
                    left: "0px"
                });
            $(window).bind("resize", this.ShareScreenSizeChange);
            screenSizeTimer = setInterval(() => {
                this.ShareScreenSizeChange();
            }, 1000);
        },
        sortUserInfo(arr) {
            var result = new Array();
            if (!arr) {
                return result;
            }
            var userList = this.$parent.userList;
            for (var u of userList) {
                for (var user of arr) {
                    if (user.UserID + "" == u.userid + "") {
                        //teacher
                        result.push(user);
                        break;
                    }
                }
            }
            return result;
            for (var user of arr) {
                if (user.RoleInLesson == 2) {
                    //teacher
                    result.push(user);
                }
            }
            for (var user of arr) {
                if (user.RoleInLesson == 1) {
                    //student
                    result.push(user);
                }
            }
            for (var user of arr) {
                if (user.RoleInLesson != 1 && user.RoleInLesson != 2) {
                    //other
                    result.push(user);
                }
            }
            return result;
        },
        getUserVideoIndex(arr, userid) {
            var userindex = 0;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].UserID + "" == userid) {
                    return i;
                }
            }
            return $("#liveMediaContainer").find(">div.media-main-panel")
                .length;
        },
        getUserName(arr, userid) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].UserID + "" == userid) {
                    //return arr[i].UserName + " (" + this.getRoleName(arr[i].RoleInLesson) + ")";
                    return arr[i].UserName;
                }
            }
            if (userid == uid) {
                var name = authenticator.getUserName();
                if (name) return name;
                else return "自己";
            }
            return "";
        },
        getUserInfo(arr, userid) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].UserID + "" == userid) {
                    //return arr[i].UserName + " (" + this.getRoleName(arr[i].RoleInLesson) + ")";
                    return arr[i];
                }
            }
            if (userid == uid) {
                return { UserID: uid, RoleInLesson: urole, UserName: uname };
            }
        },
        getRoleName(role) {
            switch (role) {
                case 1:
                    return "学生";
                case 2:
                    return "老师";
                case 3:
                    return "旁听生";
                default:
                    return "旁听生";
            }
        },
        stopLocalAndRemoteStreams() {
            try {
                if (localStream && localStream.isPlaying()) {
                    localStream.stop();
                }
                var index, length;
                for (
                    index = 0, length = remoteStreamList.length;
                    index < length;
                    index += 1
                ) {
                    if (remoteStreamList[index].stream.isPlaying()) {
                        remoteStreamList[index].stream.stop();
                    }
                }
            } catch (ex) {}
        },
        clearAllStream() {
            this.stopLocalAndRemoteStreams();
            $("#liveMediaContainer").empty();
            $("#liveMediaContainer")
                .find(">div.media-main-panel")
                .remove();
        },
        addToRemoteStreamList(stream, videoEnabled, audioEnabled) {
            if (stream) {
                remoteStreamList.push({
                    id: stream.getId(),
                    stream: stream,
                    videoEnabled: videoEnabled,
                    audioEnabled: audioEnabled
                });
            }
        },
        removeStreamFromList(id) {
            var index, tmp;
            var result = false;
            for (index = remoteStreamList.length - 1; index >= 0; index--) {
                var tmp = remoteStreamList[index];
                if (tmp.id === id) {
                    var toRemove = remoteStreamList.splice(index, 1);
                    if (toRemove.length === 1) {
                        //delete toRemove[1];
                        //loger.log("stream stopping..." + toRemove[0].stream.getId());
                        if (toRemove[0].stream.isPlaying()) {
                            toRemove[0].stream.stop();
                        }
                        result = true;
                    }
                }
            }
            var nindex = FindStrInArr(muteVideoList, id);
            if (nindex > -1) {
                muteVideoList.splice(nindex, 1);
            }
            nindex = FindStrInArr(muteAudioList, id);
            if (nindex > -1) {
                muteAudioList.splice(nindex, 1);
            }
            return result;
        },
        getUserStreamFromList(id) {
            for (var index = remoteStreamList.length - 1; index >= 0; index--) {
                if (remoteStreamList[index].stream.getId() + "" == id + "") {
                    return remoteStreamList[index].stream;
                }
            }
            return null;
        },
        getAllStreamCount() {
            return remoteStreamList.length + 1;
        },
        setStreamVideo(id, enable) {
            if (localStream != null && id + "" == localStream.getId() + "") {
                if (enable) {
                    //localStream.enableVideo();
                    $("#video" + id).css({ opacity: 1 });
                } else {
                    //localStream.disableVideo();
                    $("#video" + id).css({ opacity: 0 });
                }
                this.changeEnableVideo(enable);
            } else {
                this.$parent.NoticeVideo(id, enable ? 1 : 0);
                return;
                var index, tmp;
                for (index = 0; index < remoteStreamList.length; index += 1) {
                    tmp = remoteStreamList[index];
                    if (tmp.id + "" === id + "") {
                        if (enable) {
                            remoteStreamList[index].stream.enableVideo();
                        } else {
                            remoteStreamList[index].stream.disableVideo();
                        }
                    }
                }
            }
        },
        setStreamAudio(id, enable) {
            if (id + "" == uid + "") {
                if (enable) {
                    this.$parent.ChangeLocalAudio(enable, this.canOpenAudio);
                } else {
                    if (localStream != null) {
                        if (enable) {
                            //localStream.enableAudio();
                        } else {
                            //localStream.disableAudio();
                        }
                        this.changeEnableAudio(enable);
                    }
                }
            } else {
                this.$parent.NoticeAudio(id, enable ? 1 : 0);
                return;
                var index, tmp;
                for (index = 0; index < remoteStreamList.length; index += 1) {
                    tmp = remoteStreamList[index];
                    if (tmp.id + "" === id + "") {
                        if (enable) {
                            remoteStreamList[index].stream.enableAudio();
                        } else {
                            remoteStreamList[index].stream.disableAudio();
                        }
                    }
                }
            }
        },
        setStreamSpeaker(id) {
            var speaker = this.getSpeakerSetting();
            if (speaker && speaker != "") {
                if (document.getElementById("audio" + id)) {
                    document.getElementById("audio" + id).setSinkId(speaker);
                } else {
                    setTimeout(() => {
                        this.setStreamSpeaker(id);
                    }, 2000);
                }
            }
        },
        getSpeakerSetting() {
            var speaker = localStorage.getItem("DefaultSpeaker");
            if (speaker && speaker != "") {
                if (!IsExistInArr(this.speakerList, speaker)) {
                    speaker = "";
                }
                return speaker;
            } else {
                return "";
            }
        },
        ResetSpeaker() {
            var speaker = this.getSpeakerSetting();
            if (speaker && speaker != "") {
                $("#media_wrapper")
                    .find("audio")
                    .each(function(i) {
                        //$(this)[0].setSinkId(speaker);
                        document
                            .getElementById($(this).attr("id"))
                            .setSinkId(speaker);
                    });
            }
        },
        subscribeStreamEvents() {
            client.on("stream-added", evt => {
                var stream = evt.stream;
                //loger.log("New stream added: " + stream.getId());
                //loger.log("Timestamp: " + Date.now());
                //loger.log("Subscribe ", stream);
                client.subscribe(stream, function(err) {
                    loger.log("Subscribe stream failed", err);

                    client.subscribe(stream, function(err) {
                        loger.log("Subscribe stream failed2", err);
                    });
                });
            });
            client.on("stream-published", evt => {
                //loger.log("local stream published:" + evt.stream.getId());
            });
            client.on("peer-leave", evt => {
                //loger.log("peer-leave: " + evt.uid);
                //loger.log("Timestamp: " + Date.now());
                //loger.log(evt);
                ///this.showStreamOnPeerLeave(evt.uid);
                //updateRoomInfo();
            });

            client.on("stream-subscribed", evt => {
                var stream = evt.stream;
                //loger.log("stream-subscribed:" + stream.getId());
                //loger.log("Timestamp: " + Date.now());
                //loger.log("Subscribe remote stream successfully: " + stream.getId());
                //loger.log(evt);
                ///this.showStreamOnPeerAdded(stream);
                //updateRoomInfo();
            });

            client.on("stream-removed", evt => {
                var stream = evt.stream;
                //loger.log("stream-removed: " + evt.stream.getId());
                //loger.log("Timestamp: " + Date.now());
                //loger.log(evt);
                ///this.showStreamOnPeerLeave(evt.stream.getId());
                //updateRoomInfo();
            });

            client.on("stream-reconnect-start", evt => {
                //var stream = evt.stream;
                loger.log("stream-reconnect-start: " + evt.stream.getId());
                //loger.log("Timestamp: " + Date.now());
                //loger.log(evt);
            });
            client.on("disconnect", evt => {
                //var stream = evt.stream;
                loger.log("disconnect: " + evt.stream.getId());
                //loger.log("Timestamp: " + Date.now());
                //loger.log(evt);
            });
            client.on("reconnect", evt => {
                //var stream = evt.stream;
                loger.log("reconnect: ");
                //loger.log("Timestamp: " + Date.now());
                //loger.log(evt);
            });
            client.on("connected", evt => {
                //var stream = evt.stream;
                loger.log("connected: ");                
                //loger.log("Timestamp: " + Date.now());
                //loger.log(evt);
            });
            client.on("mute-audio", evt => {
               // var uid = evt.uid;
                //loger.log("mute audio:" + uid);
                //this.setAudioCtlStat(uid, false);
            });
            client.on("unmute-audio", evt => {
                //var uid = evt.uid;
                //loger.log("unmute audio:" + uid);
                //this.setAudioCtlStat(uid, true);
            });
            client.on("mute-video", evt => {
                //var uid = evt.uid;
                //$("#video" + uid).hide();
                //loger.log("mute video:" + uid);
                //this.setVideoCtlStat(uid, false);
                //alert("mute video:" + uid);
            });

            client.on("unmute-video", evt => {
                //var uid = evt.uid;
                //$("#video" + uid).show();
                //loger.log("unmute video:" + uid);
                //this.setVideoCtlStat(uid, true);
            });

            client.on("active-speaker", evt => {
                var uid = evt.uid;
                //loger.log("active-speaker:" + uid);
            });
            client.on("liveStreamingFailed", evt => {
                loger.log("liveStreamingFailed:" + evt);
            });
            client.on("error", err => {
                // if ("SOCKET_DISCONNECTED" == err.reason) {
                //     this.$Notice.error({
                //         title: "掉线了,您的网络不稳定了!",
                //         desc: "",
                //         duration: 3,
                //         bottom: 60,
                //         left: true
                //     });
                // }
                loger.log("error:", err.reason);
            });
        },
        getAudioStat(id) {
            var nindex = FindStrInArr(muteAudioList, id);
            if (nindex == -1) {
                return true;
            } else {
                return false;
            }
        },
        getVideoStat(id) {
            var nindex = FindStrInArr(muteVideoList, id);
            if (nindex == -1) {
                return true;
            } else {
                return false;
            }
        },
        setAudioCtlStat(id, enable) {
            //console.log("setAudioCtlStat:" + id + "->" + enable);
            if (enable) {
                var nindex = FindStrInArr(muteAudioList, id);
                if (nindex > -1) {
                    muteAudioList.splice(nindex, 1);
                }
                $("#mediavideoctl-" + id)
                    .find("span.media-icon-mic-disable-small")
                    .removeClass("media-icon-mic-disable-small")
                    .addClass("media-icon-mic-enable-small");
                $("#mediavideoctl-" + id)
                    .find("span.media-icon-mic-disable")
                    .removeClass("media-icon-mic-disable")
                    .addClass("media-icon-mic-enable");
            } else {
                var nindex = FindStrInArr(muteAudioList, id);
                if (nindex == -1) {
                    muteAudioList.push(id);
                }
                $("#mediavideoctl-" + id)
                    .find("span.media-icon-mic-enable-small")
                    .removeClass("media-icon-mic-enable-small")
                    .addClass("media-icon-mic-disable-small");
                $("#mediavideoctl-" + id)
                    .find("span.media-icon-mic-enable")
                    .removeClass("media-icon-mic-enable")
                    .addClass("media-icon-mic-disable");
            }
        },
        setVideoCtlStat(id, enable) {
            //console.log("setVideoCtlStat:"+id+"->"+enable);
            if (enable) {
                var nindex = FindStrInArr(muteVideoList, id);
                if (nindex > -1) {
                    muteVideoList.splice(nindex, 1);
                }
                $("#mediavideoctl-" + id)
                    .find("span.media-icon-webcam-disable-small")
                    .removeClass("media-icon-webcam-disable-small")
                    .addClass("media-icon-webcam-enable-small");
                $("#mediavideoctl-" + id)
                    .find("span.media-icon-webcam-disable")
                    .removeClass("media-icon-webcam-disable")
                    .addClass("media-icon-webcam-enable");
                $("#mediauser-" + id)
                    .find("div.videoface")
                    .hide();
                $("#video" + id).css({ opacity: 1 });
            } else {
                var nindex = FindStrInArr(muteVideoList, id);
                if (nindex == -1) {
                    muteVideoList.push(id);
                }
                $("#mediavideoctl-" + id)
                    .find("span.media-icon-webcam-enable-small")
                    .removeClass("media-icon-webcam-enable-small")
                    .addClass("media-icon-webcam-disable-small");
                $("#mediavideoctl-" + id)
                    .find("span.media-icon-webcam-enable")
                    .removeClass("media-icon-webcam-enable")
                    .addClass("media-icon-webcam-disable");
                $("#mediauser-" + id)
                    .find("div.videoface")
                    .show();
                $("#video" + id).css({ opacity: 0 });
            }
        },
        addPlaceholderDiv(parentNodeId, width, height) {
            var placehoder = $("#placeholder-div");
            if (placehoder.length === 0 && !isMixed) {
                $("#" + parentNodeId).append(
                    "<div id='placeholder-div' style='width:" +
                        width +
                        "px;height:" +
                        height +
                        "px' class='col-sm-6 remote-partner-video-multiple'></div>"
                );
            }
        },
        createAudioContainer() {
            var container = $("#audio-container");
            if (container && container.length > 0) {
                return;
            }
            $("#liveMediaContainer").append(
                "<div id='audio-container' style='display: none;'></div>"
            );
        },
        removeElementIfExist(tagId, uid) {
            $("#" + tagId + uid).remove();
        },
        addNewRows(parentNodeId) {
            var row1 = $("#video-row1"),
                row2 = $("#video-row2");
            if (row1 && row1.length === 0) {
                $("#" + parentNodeId).append(
                    "<div id='video-row1' class='row'></div>"
                );
            }

            if (row2 && row2.length === 0) {
                $("#" + parentNodeId).append(
                    "<div id='video-row2' class='row'></div>"
                );
            }
        },
        orderUserMideaSize() {
            var list = $("#liveMediaContainer").find(">div.media-main-panel");
            var count = list.length;
            var maxHeight = document.body.clientHeight;
            var maxBig = Math.floor(maxHeight / 225); //75
            var showBig = 0;
            var canshow = function(n) {
                if (n >= maxBig) return true;
                return (
                    (maxBig - n) * 225 +
                        Math.ceil((count - maxBig + n) / 3) * 75 <=
                    maxHeight
                );
            };
            if (count <= maxBig) {
                showBig = count;
            } else {
                var i = 0;
                while (!canshow(i)) {
                    i++;
                }
                showBig = maxBig - i;
            }
            list.each(function(i) {
                if (i < showBig)
                    $(this)
                        .removeClass("big")
                        .removeClass("small")
                        .addClass("big");
                else
                    $(this)
                        .removeClass("big")
                        .removeClass("small")
                        .addClass("small");
            });
        },
        createUserContainer(
            id,
            username,
            ptop,
            hasvideo,
            right = 0,
            pid = "liveMediaContainer",
            userinfo = null
        ) {
            $("#mediauser-" + id).remove();
            var role = 3;
            if (userinfo != null) {
                role = userinfo.RoleInLesson;
            }
            var sizestyle = "big";
            if (
                $("#liveMediaContainer").find(">div.media-main-panel").length >=
                4
            ) {
                sizestyle = "small";
            }

            this.getAllStreamCount();
            var html =
                '<div id="mediauser-' +
                id +
                '" role=' +
                role +
                ' class="media-main-panel ' +
                sizestyle +
                '" style="float:left;position:relative;">';
            var face = "/static/images/defaultface.png";
            if (userinfo && userinfo.AvatarUrl && userinfo.AvatarUrl != "") {
                face = userinfo.AvatarUrl;
                html +=
                    '<div class="videoface" style="display:none;"><img src="' +
                    face +
                    '" style="width:100%;height:100%;" /></div>';
            }

            html +=
                '<div style="position:absolute;top:0px; left:0px;z-index:2;background-color:black;color:white;">' +
                username +
                "</div>";

            var ctlStyle = "";
            if (id == uid) {
                ctlStyle = "";
            } else if (showCtl) {
                ctlStyle = "";
            } else {
                ctlStyle = " style='display:none' ";
            }

            html +=
                '<div id="mediavideoctl-' +
                id +
                '" class="media-video-ctl" ' +
                ctlStyle +
                ">";
            if (id == uid && !this.VXenableVideo) {
                html +=
                    '<span title="Video is disable" class="media-icon-webcam-disable-small"></span>';
            } else {
                html +=
                    '<span title="Video is enable" class="media-icon-webcam-enable-small"></span>';
            }
            if (id == uid && !this.VXenableAudio) {
                html +=
                    '<span title= "Audio is disable" class="media-icon-mic-disable-small" ></span></div > ';
            } else {
                html +=
                    '<span title= "Audio is enable" class="media-icon-mic-enable-small" ></span></div > ';
            }
            html +=
                '<div id="mediavideotomax-' +
                id +
                '" style="' +
                (showCtl ? "" : "display:none") +
                '" class="media-video-tomax"><span class="media-icon-ctl-tomax"><span class="icon icon-full-size"></span></span></div>';
            html +=
                '     <div class="media-user" id="mediauserview' +
                id +
                '" showvideo="' +
                (hasvideo ? "1" : "0") +
                '">\
              </div>\
              </div >';

            $("#mediauser-" + id).remove();
            if (userinfo != null && userinfo.RoleInLesson == 2) {
                $("#" + pid).prepend(html);
            } else if (userinfo != null && userinfo.UserID == uid) {
                var first = $("#" + pid)
                    .find(">div.media-main-panel")
                    .first();
                if (first.attr("role") == "2") {
                    first.after(html);
                } else {
                    $("#" + pid).prepend(html);
                }
            } else {
                $("#" + pid).append(html);
            }
            this.orderUserMideaSize();

            //$("#media_wrapper").append(html);
            $("#mediauserctl-" + id).bind("click", evt => {
                var tar = $(evt.originalEvent.target);
                var userid = tar.attr("id").replace("mediauserctl-", "");
                if (tar.html() == "+") {
                    if (preMaxUser != "") {
                        $("#mediauserctl-" + preMaxUser).html("+");
                        $("#mediauser-" + preMaxUser).css({
                            position: "relative",
                            width: "120px",
                            height: "90px",
                            "z-index": "1",
                            left: "",
                            top: ""
                        });
                        $("#mediauser-" + preMaxUser)
                            .find("div.video-item")
                            .css({ width: "1200px", height: "90px" });
                    }
                    preMaxUser = userid;
                    tar.html("-");
                    var left = -$(document.body).width() + 180 + 310 + 60;
                    if (
                        document.documentElement.clientHeight <
                        document.documentElement.offsetHeight
                    ) {
                        left += 20;
                    }
                    $("#mediauser-" + userid).css({
                        position: "fixed",
                        width: "1000px",
                        height: "750px",
                        "z-index": "3",
                        left: "0px",
                        top: -$(document).scrollTop() + 82 + "px"
                    });
                    $("#mediauser-" + userid)
                        .find("div.video-item")
                        .css({ width: "1000px", height: "750px" });

                    $(document)
                        .unbind("scroll")
                        .bind("scroll", function() {
                            $("#mediauser-" + userid).css({
                                top: -$(document).scrollTop() + 82 + "px"
                            });
                        });
                    //$("#mediauser-" + userid).find("div.video-item").css({ "width": "800px", "height": "600px" });
                    //$("#mediauser-" + userid).find("div.video-item").css({ "width": "800px", "height": "600px" });
                } else {
                    $(document).unbind("scroll");
                    preMaxUser = "";
                    tar.html("+");
                    $("#mediauser-" + userid).css({
                        position: "relative",
                        width: "120px",
                        height: "90px",
                        "z-index": "1",
                        left: "",
                        top: ""
                    });
                    $("#mediauser-" + userid)
                        .find("div.video-item")
                        .css({ width: "120px", height: "90px" });
                }
                return false;
            });

            $("#mediavideoctl-" + id)
                .find(">SPAN")
                .bind("click", evt => {
                    var tar = $(evt.originalEvent.target);
                    var userid = tar
                        .parent()
                        .attr("id")
                        .replace("mediavideoctl-", "");
                    if (tar.hasClass("media-icon-webcam-enable-small")) {
                        //disable video
                        tar.removeClass(
                            "media-icon-webcam-enable-small"
                        ).addClass("media-icon-webcam-disable-small");
                        tar.attr("title", "Video is disable");
                        this.setStreamVideo(userid, false);
                    } else if (tar.hasClass("media-icon-mic-enable-small")) {
                        //disable video
                        tar.removeClass("media-icon-mic-enable-small").addClass(
                            "media-icon-mic-disable-small"
                        );
                        tar.attr("title", "Audio is disable");
                        this.setStreamAudio(userid, false);
                    } else if (tar.hasClass("media-icon-mic-disable-small")) {
                        //enable audio
                        // if (userid != uid)
                        // {
                        //   return false;
                        // }
                        //tar.removeClass("media-icon-mic-disable-small").addClass("media-icon-mic-enable-small");
                        //tar.attr("title", "Audio is enable");
                        this.setStreamAudio(userid, true);
                    } else {
                        if (userid != uid) {
                            return false;
                        }
                        tar.removeClass(
                            "media-icon-webcam-disable-small"
                        ).addClass("media-icon-webcam-enable-small");
                        tar.attr("title", "Video is enable");
                        this.setStreamVideo(userid, true);
                    }
                    return false;
                });
            $("#mediauser-" + id).bind("click", evt => {
                this.$parent.ShareMeeting();
                return false;
            });
            $("#mediavideotomax-" + id).bind("click", evt => {
                this.$parent.ShareOneBigMeeting(id);
                return false;
            });

            return;
            Drag.init(
                $("#mediauser-" + id).find(">div.media-header")[0],
                $("#mediauser-" + id)[0],
                -5000,
                null,
                -5000,
                null,
                true
            );
            $("#mediauser-" + id)
                .find("span.media-disablevideo")
                .bind("click", evt => {
                    var tar = $(evt.originalEvent.target)
                        .parent()
                        .parent()
                        .parent()
                        .parent();
                    var userid = tar.attr("id").replace("mediauser-", "");
                    var uservideo = $("#mediauserview" + userid);
                    if (uservideo.attr("showvideo") == "-1") {
                        this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: "No video to show!", top: 24,duration: 4, left:true });
                    } else if (uservideo.attr("showvideo") == "1") {
                        if (userid == localStream.getId()) {
                            enableLocalVideo = false;
                        }
                        uservideo.attr("showvideo", "0");
                        uservideo.find(">div").hide();
                        this.setStreamVideo(userid, false);
                    } else {
                        if (userid == localStream.getId()) {
                            enableLocalVideo = true;
                        }
                        uservideo.attr("showvideo", "1");
                        uservideo.find(">div").show();
                        this.setStreamVideo(userid, true);
                    }
                });
        },
        createUserContainer4Max(
            id,
            username,
            ptop,
            hasvideo,
            right = 0,
            pid = "liveMediaContainer",
            showctl = true,
            showmax = false,
            userinfo = null
        ) {
            $("#mediauser-" + id).remove();
            var html =
                '<div id="mediauser-' +
                id +
                '" class="media-main-panel" style="float:' +
                (showctl ? "left" : "left") +
                ";position:relative;" +
                (showctl ? "width:120px;height:90px;" : "") +
                '">';
            var face = "/static/images/defaultface.png";
            if (userinfo && userinfo.AvatarUrl && userinfo.AvatarUrl != "") {
                face = userinfo.AvatarUrl;
                html +=
                    '<div class="videoface" style="display:none;"><img src="' +
                    face +
                    '" style="width:100%;height:100%;" /></div>';
            }
            html +=
                '<div style="position:absolute;top:0px; left:0px;z-index:2;background-color:black;color:white;">' +
                username +
                "</div>";
            if (false) {
                //(showctl)
                html +=
                    '      <div id="mediauserctl-' +
                    id +
                    '" class="media-user-ctl" title="Max/Min">' +
                    (showctl
                        ? '<i class="ivu-icon ivu-icon-arrow-expand" style="font-size: 32px;"></i>'
                        : '<i class="ivu-icon ivu-icon-arrow-shrink" style="font-size: 32px;"></i>') +
                    "</div>";
            }
            //else
            {
                var ctlStyle = "";
                if (id == uid) {
                    ctlStyle = "";
                } else if (showCtl) {
                    ctlStyle = "";
                } else {
                    ctlStyle = " style='display:none' ";
                }
                html +=
                    '<div id="mediavideoctl-' +
                    id +
                    '" class="' +
                    (pid == "mediamaxuser"
                        ? "media-video-leftop"
                        : "media-video-ctl") +
                    '" ' +
                    ctlStyle +
                    ">";
                if (id == uid && !this.VXenableVideo) {
                    html +=
                        '<span title="Video is disable" class="' +
                        (showctl
                            ? "media-icon-webcam-disable-small"
                            : "media-icon-webcam-disable") +
                        '"></span>';
                } else {
                    html +=
                        '<span title="Video is enable" class="' +
                        (showctl
                            ? "media-icon-webcam-enable-small"
                            : "media-icon-webcam-enable") +
                        '"></span>';
                }
                if (id == uid && !this.VXenableAudio) {
                    html +=
                        '<span title="Audio is disable" class="' +
                        (showctl
                            ? "media-icon-mic-disable-small"
                            : "media-icon-mic-disable") +
                        '"></span>';
                } else {
                    html +=
                        '<span title="Audio is enable" class="' +
                        (showctl
                            ? "media-icon-mic-enable-small"
                            : "media-icon-mic-enable") +
                        '"></span>';
                }
            }
            if (showmax) {
                html +=
                    '<span title="Max" class="' +
                    (showctl
                        ? "media-icon-tomaxview-small"
                        : "media-icon-tomaxview") +
                    '"></span>';
            } else {
                html +=
                    '<span title="Min" class="' +
                    (showctl
                        ? "media-icon-tominview"
                        : "media-icon-tominview") +
                    '"></span>';
            }
            html +=
                '</div><div class="media-user" id="mediauserview' +
                id +
                '" showvideo="' +
                (hasvideo ? "1" : "0") +
                '" style="' +
                (showctl ? "width:120px;height:90px;" : "") +
                '">\
              </div>\
              </div >';
            $("#" + pid).append(html);

            $("#mediauser-" + id).bind("click", evt => {
                //var tar = $(evt.originalEvent.target);
                var userid = id; // tar.parent().attr("id").replace("mediauserctl-", "");
                //alert("to max:" + userid);
                if (
                    "mediamaxuser" !=
                    $("#mediauser-" + id)
                        .parent()
                        .attr("id")
                ) {
                    if (showctl) {
                        if (preMaxUser != "") {
                            this.stopStream(preMaxUser);
                            this.playStreamOnMaxList(
                                this.getStream(preMaxUser)
                            );
                        }
                        this.$parent.NoticeMeeting(2, userid);
                        preMaxUser = userid;
                        this.stopStream(preMaxUser);
                        this.playStreamOnMaxUser(this.getStream(preMaxUser));
                    } else {
                        preOneBigViewUser = userid;
                        this.$parent.ShareOneBigMeeting(userid);
                    }
                }
                //this.$parent.ShareMeeting();
                return false;
                //loger.log("click:" + userid)
                //if (tar.hasClass("ivu-icon-arrow-expand"))
                {
                    if (preMaxUser != "") {
                        this.stopStream(preMaxUser);
                        this.playStreamOnMaxList(this.getStream(preMaxUser));
                    }
                    preMaxUser = userid;
                    this.stopStream(preMaxUser);
                    this.playStreamOnMaxUser(this.getStream(preMaxUser));
                }
                //else
                //{
                //  this.minVideoView();
                //  //this.stopStream(userid);
                //  //this.playStreamOnMaxList(this.getStream(preMaxUser));
                //  preMaxUser = "";
                //}
            });

            $("#mediavideoctl-" + id)
                .find(">SPAN")
                .bind("click", evt => {
                    var tar = $(evt.originalEvent.target);
                    var userid = tar
                        .parent()
                        .attr("id")
                        .replace("mediavideoctl-", "");
                    if (
                        tar.hasClass("media-icon-webcam-enable") ||
                        tar.hasClass("media-icon-webcam-enable-small")
                    ) {
                        //disable video
                        if (tar.hasClass("media-icon-webcam-enable")) {
                            tar.removeClass(
                                "media-icon-webcam-enable"
                            ).addClass("media-icon-webcam-disable");
                        }
                        if (tar.hasClass("media-icon-webcam-enable-small")) {
                            tar.removeClass(
                                "media-icon-webcam-enable-small"
                            ).addClass("media-icon-webcam-disable-small");
                        }
                        tar.attr("title", "Video is disable");
                        this.setStreamVideo(userid, false);
                    } else if (
                        tar.hasClass("media-icon-mic-enable") ||
                        tar.hasClass("media-icon-mic-enable-small")
                    ) {
                        //disable audio
                        if (tar.hasClass("media-icon-mic-enable")) {
                            tar.removeClass("media-icon-mic-enable").addClass(
                                "media-icon-mic-disable"
                            );
                        }
                        if (tar.hasClass("media-icon-mic-enable-small")) {
                            tar.removeClass(
                                "media-icon-mic-enable-small"
                            ).addClass("media-icon-mic-disable-small");
                        }
                        tar.attr("title", "Audio is disable");
                        this.setStreamAudio(userid, false);
                    } else if (
                        tar.hasClass("media-icon-mic-disable") ||
                        tar.hasClass("media-icon-mic-disable-small")
                    ) {
                        //enable audio
                        // if (userid != uid)
                        // {
                        //   return false;
                        // }
                        // if (tar.hasClass("media-icon-mic-disable"))
                        // {
                        //   tar.removeClass("media-icon-mic-disable").addClass("media-icon-mic-enable");
                        // }
                        // if (tar.hasClass("media-icon-mic-disable-small"))
                        // {
                        //   tar.removeClass("media-icon-mic-disable-small").addClass("media-icon-mic-enable-small");
                        // }
                        // tar.attr("title", "Audio is enable");
                        this.setStreamAudio(userid, true);
                    } else if (
                        tar.hasClass("media-icon-tomaxview") ||
                        tar.hasClass("media-icon-tomaxview-small")
                    ) {
                        //max one
                        if (showctl) {
                            if (preMaxUser != "") {
                                this.stopStream(preMaxUser);
                                this.playStreamOnMaxList(
                                    this.getStream(preMaxUser)
                                );
                            }
                            this.$parent.NoticeMeeting(2, userid);
                            preMaxUser = userid;
                            this.stopStream(preMaxUser);
                            this.playStreamOnMaxUser(
                                this.getStream(preMaxUser)
                            );
                        } else {
                            preOneBigViewUser = userid;
                            this.$parent.ShareOneBigMeeting(userid);
                        }
                    } else if (
                        tar.hasClass("media-icon-tominview") ||
                        tar.hasClass("media-icon-tominview-small")
                    ) {
                        //max one
                        preOneBigViewUser = null;
                        this.$parent.ShareMeeting();
                    } //enable video
                    else {
                        if (userid != uid) {
                            return false;
                        }
                        if (tar.hasClass("media-icon-webcam-disable")) {
                            tar.removeClass(
                                "media-icon-webcam-disable"
                            ).addClass("media-icon-webcam-enable");
                        }
                        if (tar.hasClass("media-icon-webcam-disable-small")) {
                            tar.removeClass(
                                "media-icon-webcam-disable-small"
                            ).addClass("media-icon-webcam-enable-small");
                        }
                        tar.attr("title", "Video is enable");
                        this.setStreamVideo(userid, true);
                    }
                    return false;
                });
        },
        calculateVideoSize(multiple) {
            //var cResolution = this.getResolutionArray(resolution);
            // return {
            //   width: cResolution[0],
            //   height: cResolution[1]
            //};

            return {
                width: 120,
                height: 90
            };
            var viewportWidth = $(window).width(),
                viewportHeight = $(window).height(),
                curResolution = this.getResolutionArray(this.resolution),
                width,
                height,
                newWidth,
                newHeight,
                ratioWindow,
                ratioVideo;

            if (multiple) {
                width = viewportWidth / 2 - 50;
                height = viewportHeight / 2 - 40;
            } else {
                width = viewportWidth - 100;
                height = viewportHeight - 80;
            }
            ratioWindow = width / height;
            ratioVideo = curResolution[0] / curResolution[1];
            if (ratioVideo > ratioWindow) {
                // calculate by width
                newWidth = width;
                newHeight = (width * curResolution[1]) / curResolution[0];
            } else {
                // calculate by height
                newHeight = height;
                newWidth = (height * curResolution[0]) / curResolution[1];
            }

            newWidth = Math.max(newWidth, 120);
            newHeight = Math.max(newHeight, 90);
            return {
                width: newWidth,
                height: newHeight
            };
        },
        getResolutionArray(reso) {
            switch (reso) {
                case "120p":
                    return [160, 120];
                case "240p":
                    return [320, 240];
                case "360p":
                    return [640, 360];
                case "480p":
                    return [848, 480];
                case "720p":
                    return [1280, 720];
                case "1080p":
                    return [1920, 1080];
                default:
                    return [1280, 720];
            }
        },
        generateVideoProfile(resolution, frameRate) {
            var result = "240P";
            switch (resolution) {
                case "120p":
                    result = "120P";
                    break;
                case "240p":
                    result = "240P";
                    break;
                case "360p":
                    if (frameRate === 15) {
                        result = "360P";
                    } else {
                        result = "360P_4";
                    }
                    break;
                case "480p":
                    if (frameRate === 15) {
                        result = "480P_8";
                    } else {
                        result = "480P_9";
                    }
                    break;
                case "720p":
                    if (frameRate === 15) {
                        result = "720P";
                    } else {
                        result = "720P_3";
                    }
                    break;
                case "1080p":
                    if (frameRate === 15) {
                        result = "1080P";
                    } else {
                        result = "1080P_3";
                    }
                    break;
                default:
                    // 720p, 30
                    // Do nothing
                    break;
            }
            return result;
        },
        async getDevices() {
            //console.log("getDevices");
            if (this.micList.length > 0 && this.speakerList.length > 0) return;

            // AgoraRTC.getDevices(devices => {
            //     //var audioSelect = gid("audioSource");
            //     //var videoSelect = gid("videoSource");
            //     for (var i = 0; i !== devices.length; ++i) {
            //         var device = devices[i];
            //         //var option = document.createElement('option');
            //         //option.value = device.deviceId;
            //         if (device.kind === "audioinput") {
            //             //option.text = device.label || 'microphone ' + i;
            //             //audioSelect.appendChild(option);
            //             this.micList.push(device.deviceId);
            //         } else if (device.kind === "videoinput") {
            //             //option.text = device.label || 'camera ' + i;
            //             //videoSelect.appendChild(option);
            //             this.cameraList.push(device.deviceId);
            //         } else {
            //             //loger.log('Some other kind of source/device: ', device);
            //         }
            //     }
            //     console.log("getDevices end");
            // });

            if (navigator.mediaDevices &&navigator.mediaDevices.enumerateDevices) 
            {
                var devices = await navigator.mediaDevices.enumerateDevices();
                devices.forEach(device => {
                    if (device.kind == "audiooutput") {
                        this.speakerList.push(device.deviceId);
                    }
                    else if (device.kind === "audioinput") {
                    //option.text = device.label || 'microphone ' + i;
                    //audioSelect.appendChild(option);
                    this.micList.push(device.deviceId);
                    } else if (device.kind === "videoinput") {
                        //option.text = device.label || 'camera ' + i;
                        //videoSelect.appendChild(option);
                        this.cameraList.push(device.deviceId);
                    }
                });
                //console.log("getDevices end");
                
            }
        },
        getUsersInfo(userlist) {
            var cid = this.getChannelID();
            return new Promise(function(resolve, reject) {
                var sessionid = sessionStorage.getItem("UserToken");
                var url =
                    GetAPIUrl() +
                    "User/UserRoleAndInfo?serviceID=" +
                    cid +
                    "&userIds=" +
                    userlist.join(",");
                $.ajax({
                    type: "GET",
                    url: url,
                    beforeSend: function(request) {
                        request.setRequestHeader("UserToken", sessionid);
                    },
                    success: function(data) {
                        resolve(data.RetData);
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        loger.log(xhr);
                        resolve(null);
                    }
                });
            });
        },
        isInstallPlugIn() {
            return new Promise(function(resolve, reject) {
                if (navigator.userAgent.indexOf("Electron") > -1) {
                    resolve(true);
                    return;
                }
                try {
                    if (Browser.isChrome()) {
                        if(jQuery.browser.version>=72)
                        {
                            resolve(true);
                            return;
                        }
                        chrome.runtime.sendMessage(
                            AGORA_EXTENSIONID,
                            { getVersion: true },
                            function(res) {
                                if (res && res.version) {
                                    resolve(true);
                                } else {
                                    resolve(false);
                                }
                            }
                        );
                    } else if (Browser.isFirefox()) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } catch (ex) {
                    resolve(false);
                }
            });
        },
        getChannelID() {
            var mid = this.getLessonID;
            if (mid != 0) {
                return mid;
            }
            return channel;
        },
        toggleVideo() {
            //if (mediaMode == 0)
            //{
            //  $("#video-container-multiple").toggle();
            //}
            //else if (mediaMode == 1)
            //{
            //  if ($("#mediamaxview").is(":visible"))
            //  {
            //    $("#media-header").width(120);
            //  }
            //  else
            //  {
            //    $("#media-header").width(480);
            //  }
            //  $("#mediamaxview").toggle();
            //}
        },
        switchCtlIcon(isFullScreen) {
            return;
            if (isFullScreen) {
                $(
                    "#media-ctl-minimize,#media-ctl-column,#media-ctl-columnbig,#media-ctl-fullscreen"
                ).hide();
                $(
                    "#media-ctl-column-bigone,#media-ctl-column-list,#media-ctl-minscreen"
                ).show();
            } else {
                $(
                    "#media-ctl-column-bigone,#media-ctl-column-list,#media-ctl-minscreen"
                ).hide();
                $(
                    "#media-ctl-minimize,#media-ctl-column,#media-ctl-columnbig,#media-ctl-fullscreen"
                ).show();
            }
        },
        fullVideoBigOneView(showuser) {
            loger.log("fullVideoBigOneView");
            if (showuser && showuser != "0") {
                preOneBigViewUser = showuser;
            }
            this.switchCtlIcon(true);
            mediaFullMode = 1;
            //prePoz = $("#video-container").css("right");
            //preTop = $("#video-container").css("top");
            this.clearAllStream();
            $("#mediamaxuser").empty();
            $("#mediamaxlist").empty();
            var size = this.getMaxSize4FullScreen();
            $("#video-container-multiple").hide();
            $("#media_wrapper").css({ "z-index": "2" });
            $("#mediamaxview").show();
            //$("#media-header").width(size[0]);
            $("#media-header").hide();
            var diffH = $("#liveHead").is(":visible") ? 50 : 0 + 32;
            diffH = 0;
            //$("#mediamaxview").css({"top":"0px"});
            $("#video-container").css({
                position: "fixed",
                top: diffH + "px",
                left: "0px"
            });
            $("#mediamaxlist").attr(
                "style",
                "position:absolute; right:0px; top:0px; width:122px;"
            );
            $(document)
                .unbind("scroll")
                .bind("scroll", function() {
                    $("#video-container").css({
                        top: -$(document).scrollTop() + diffH + "px"
                    });
                });
            //$("#main,#liveToolbarLeft,#liveToolbarMiddle").hide();

            this.showAllStream4Max(size);
        },
        fullVideoListView() {
            this.switchCtlIcon(true);
            mediaFullMode = 2;
            //prePoz = $("#video-container").css("right");
            //preTop = $("#video-container").css("top");
            this.clearAllStream();
            $("#mediamaxuser").empty();
            $("#mediamaxlist").empty();
            var size = this.getMaxSize4FullScreenList();
            $("#video-container-multiple").hide();
            $("#mediamaxview").show();
            //$("#media-header").width(size[0]);
            $("#media-header").hide();
            var diffH = $("#liveHead").is(":visible") ? 50 : 0 + 32;
            diffH = 0;
            $("#video-container").css({
                position: "fixed",
                top: diffH + "px",
                left: "0px"
            });

            $(document)
                .unbind("scroll")
                .bind("scroll", function() {
                    $("#video-container").css({
                        top: -$(document).scrollTop() + diffH + "px"
                    });
                });
            //$("#main,#liveToolbarLeft,#liveToolbarMiddle").hide();
            this.showAllStream4FullScreen(size);
        },
        minFullScreen() {
            if (isHideVideo == true) {
                this.closeVideoView();
                return;
            }

            isFullScreen = false;
            $(document).unbind("scroll");
            mediaFullMode = 0;
            $("#media-header").show();
            $("#mediamaxlist").attr(
                "style",
                "position:absolute; right:0px; top:0px; width:122px;"
            );
            $("#video-container").attr(
                "style",
                "position: relative; top: 0px; right: 0px;"
            );
            //$("#video-container").css({ "position": "relative","left":null});
            if (prePoz != null) {
                $("#video-container").css({ right: prePoz });
            } else if ($("#video-container").css("right") == "0px") {
                $("#video-container").css({ right: "314px" });
            }
            if (preTop != null) {
                $("#video-container").css({ top: preTop });
            }
            $("#media_wrapper").css({ "z-index": "10002", width: "120px" });
            $("#video-container").css({ width: "120px" });
            //if (mediaMode == 1)
            //{
            //  this.maxVideoView();
            //}
            //else if (mediaMode == 0)
            {
                //this.toResolution(resolution, () =>
                //{
                //  this.minVideoView();
                //  this.startDrag();
                //});
                this.minVideoView();
                this.startDrag();
            }
            //this.changeVideoMode(0);
        },
        switchFullView() {
            if (isFullScreen) {
                this.minFullScreen();
            } else {
                this.fullVideoView();
            }
        },
        fullVideoView() {
            isFullScreen = true;
            preOneBigViewUser = null;
            //prePoz = $("#video-container").css("right");
            //preTop = $("#video-container").css("top");
            $("#media_wrapper").css({ "z-index": "2" });
            //this.toResolution("720p", () =>
            //{
            //  this.fullVideoListView();
            //});
            this.fullVideoListView();

            //this.changeVideoMode(1);
            this.endDrag();
        },
        maxVideoView() {
            loger.log("maxVideoView:" + remoteStreamList.length);
            mediaMode = 1;
            isFullScreen = false;
            this.switchCtlIcon(false);
            this.clearAllStream();
            $("#video-container-multiple").hide();
            $("#mediamaxview").show();
            $("#media-header").width(480);
            if (prePoz != null) {
                $("#video-container").css({ right: prePoz });
            } else if ($("#video-container").css("right") == "0px") {
                $("#video-container").css({ right: "314px" });
            }
            if (preTop != null) {
                $("#video-container").css({ top: preTop });
            }
            //$("#main,#liveToolbarLeft,#liveToolbarMiddle").show();
            //$("#live-lesson,#liveHead,#media_wrapper").hide();
            //$("#media_wrapper,#main,#liveToolbarLeft,#liveToolbarMiddle").hide();

            this.showAllStream4Max([480, 360]);
        },
        minVideoView() {
            mediaMode = 0;
            isFullScreen = false;
            this.switchCtlIcon(false);
            $("#mediamaxview").hide();
            $("#video-container-multiple").show();
            //$("#main,#liveToolbarLeft,#liveToolbarMiddle").show();
            $("#media-header").width(120);
            $("#video-container").css({ left: null });
            if (prePoz != null) {
                $("#video-container").css({ right: prePoz });
            } else {
                $("#video-container").css({ right: "0px" });
            }
            if (preTop != null) {
                $("#video-container").css({ top: preTop });
            }
            //$("#media_wrapper,#main,#liveToolbarLeft,#liveToolbarMiddle").show();
            //$("#live-lesson,#liveHead,#media_wrapper").show();
            this.clearAllStream();
            $("#mediamaxuser").empty();
            $("#mediamaxlist").empty();
            this.showAllStream();
        },
        closeVideoView() {
            $("#mediaview").hide();
            this.$parent.OnCloseVideoView();
            isHideVideo = true;
        },
        setMaxVideoUserId(maxid) {
            preOneBigViewUser = maxid;
        },
        setVideDisplay(isHide) {
            isHideVideo = isHide;
        },
        showVideoView() {
            $("#mediaview").show();
        },
        showBlackVideo(uid) {
            var userlist = new Array();
            userlist.push(uid);
            this.getUsersInfo(userlist).then(userinfo => {
                var orderedInfo = this.sortUserInfo(userinfo);
                var size = this.calculateVideoSize(false);
                var ptop = 0;

                if (isFullScreen && mediaFullMode == 2) {
                    //max list
                    var size = this.getMaxSize4FullScreenList();
                    var html =
                        '<div id="mediauser-225016498" class="media-main-panel" style="float:right;position:relative;background-color:black;width:' +
                        size[0] +
                        "px;height:" +
                        size[1] +
                        'px;"><div style="position:absolute;top:0px; left:0px;z-index:2;background-color:black;color:white;">' +
                        this.getUserName(orderedInfo, uid) +
                        "</div></div>";
                    $("#mediamaxlist").append(html);
                } else if (isFullScreen && mediaFullMode == 1) {
                    //max one big
                    var html =
                        '<div id="mediauser-225016498" class="media-main-panel" style="float:right;position:relative;background-color:black;"><div style="position:absolute;top:0px; left:0px;z-index:2;background-color:black;color:white;">' +
                        this.getUserName(orderedInfo, uid) +
                        "</div></div>";
                    $("#mediamaxlist").append(html);
                } //small list
                else {
                    var html =
                        '<div id="mediauser-' +
                        uid +
                        '" class="media-main-panel" style="float:right;position:relative;background-color:black;"><div style="position:absolute;top:0px; left:0px;z-index:2;background-color:black;color:white;">' +
                        this.getUserName(orderedInfo, uid) +
                        "</div></div>";
                    $("#liveMediaContainer").append(html);
                }
            });
        },
        canShowVideo(uid) {
            return true;

            //if (uid > 1000000000)
            //{
            //  return true;
            //}
            //return this.$parent.IsUserInOnlineList(uid);
        },
        checkNeedShowBlack(uid) {
            if (!this.canShowVideo(uid)) {
                return;
            }
            this.showBlackVideo(uid);
        },
        checkHaveVideo2Show(uid) {
            //video225016498
            if (uid > 1000000000) {
                return;
            }
            if ($("#mediauser-" + uid).length == 0) {
                var stm = this.getUserStreamFromList(uid);
                if (stm != null) {
                    this.showOneStream(stm);
                } else {
                    this.showBlackVideo(uid);
                }
            }
        },
        setShowCtl(isshow) {
            showCtl = isshow;
            //loger.log("setShowCtl:" + isshow);
            for (var i = 0; i < remoteStreamList.length; i++) {
                if (isshow) {
                    $("#mediavideoctl-" + remoteStreamList[i].id).show();
                    $("#mediavideotomax-" + remoteStreamList[i].id).show();
                } else {
                    $("#mediavideoctl-" + remoteStreamList[i].id).hide();
                    $("#mediavideotomax-" + remoteStreamList[i].id).hide();
                }
            }
        },
        hideUserVideo(uid) {
            if (uid > 1000000000) {
                return;
            }
            if ($("#mediauser-" + uid).length > 0) {
                var stm = this.getUserStreamFromList(uid);
                $("#mediauser-" + uid).remove();
            }
        },
        Switch2KloudCall() {
            //$("#video-container-multiple").empty();
            if (localStream) {
                localStream.disableAudio();
                //localStream.disableVideo();
            }
            //this.clearAllStream();
            //$("#mediamaxlist").empty();
            //$("#mediamaxuser").empty();
            //$("#mediaview").hide();
        },
        Switch2Agora() {
            //$("#mediaview").show();
            if (localStream && this.enableAudio) {
                localStream.enableAudio();
            }
            //if (localStream && this.enableVideo)
            //{
            //  localStream.enableVideo();
            //}
            //this.minFullScreen();
        },
        DisableAllAudio() {
            disableAllAudio = true;
            if (localStream) {
                localStream.disableAudio();
            }
            for (var index = 0; index < remoteStreamList.length; index += 1) {
                if (
                    typeof remoteStreamList[index].stream.audioEnabled ==
                        "boolean" &&
                    remoteStreamList[index].stream.audioEnabled == true
                ) {
                    disableAudioList.push(remoteStreamList[index].id);
                    remoteStreamList[index].stream.disableAudio();
                }
            }
        },
        EnableAllAudio() {
            disableAllAudio = false;
            if (localStream && this.VXenableAudio) {
                localStream.enableAudio();
            }
            for (var index = 0; index < remoteStreamList.length; index += 1) {
                if (
                    IsExistInArr(disableAudioList, remoteStreamList[index].id)
                ) {
                    remoteStreamList[index].stream.enableAudio();
                }
            }
            disableAudioList = [];
        },
        ViewSizeChange() {
            this.orderUserMideaSize();
        },
        getViewWidth() {
            return document.body.clientWidth - $("#liveControlWindow").width();
        },
        getViewHeight() {
            var diff = 0;
            if ($("#liveHead").is(":visible")) {
                diff = $("#liveHead").outerHeight();
            }
            return Math.max(document.body.clientHeight - diff, 100);
        },
        getMaxSize() {
            if (mediaMode == 2) {
                return [1000, 750];
            }
            return [480, 360];
            var w = $(document.body).width() - 0;
            var h = $(document.body).height() - 0;
            if (w * 0.75 > h) {
                return [(h * 4) / 3, h];
            } else {
                return [w, w * 0.75];
            }
        },
        getMaxSize4FullScreen() {
            var w = this.getViewWidth(); // document.documentElement.clientWidth - 0;
            var h = this.getViewHeight(); // document.documentElement.clientHeight - 0;
            if (w * 0.75 > h) {
                return [(h * 4) / 3, h];
            } else {
                return [w, w * 0.75];
            }
        },
        getMaxSize4FullScreenList() {
            var count = this.getStreamCount();
            var w = this.getViewWidth(); // document.documentElement.clientWidth - 0;
            var h = this.getViewHeight(); // document.documentElement.clientHeight - 0;
            if (count == 1) {
                if (w * 0.75 > h) {
                    return [(h * 4) / 3, h, (h * 4) / 3, h];
                } else {
                    return [w, w * 0.75, w, w * 0.75];
                }
            } else if (count == 2) {
                if (((h * 4) / 3) * 2 > w) {
                    return [w / 2, (w * 0.75) / 2, w, (w * 0.75) / 2];
                } else {
                    return [(h * 4) / 3, h, ((h * 4) / 3) * 2, h];
                }
            } else if (count == 3 || count == 4) {
                if (w * 0.75 > h) {
                    return [(h * 4) / 3 / 2, h / 2, (h * 4) / 3, h];
                } else {
                    return [w / 2, (w * 0.75) / 2, w, w * 0.75];
                }
            } else if (count == 5 || count == 6) {
                if (h * 2 < w) {
                    return [(h * 2) / 3, h / 2, h * 2, h];
                } else {
                    return [w / 3, w / 4, w, w / 2];
                }
            } else if (count > 6 && count <= 16) {
                if (w * 0.75 > h) {
                    return [(h * 4) / 3 / 4, h / 4, (h * 4) / 3, h];
                } else {
                    return [w / 4, (w * 0.75) / 4, w, w * 0.75];
                }
            } else {
                return [w / 5, (w / 5 / 4) * 3, w];
            }
        },
        getMaxSize4ShareScreen(wid, hei) {
            if (wid == 0 || hei == 0) {
                wid = 16;
                hei = 9;
            }
            var w = document.documentElement.clientWidth - 36;
            var h = document.documentElement.clientHeight - 0;
            if ((w * hei) / wid > h) {
                return [(h * wid) / hei, h];
            } else {
                return [w, (w * hei) / wid];
            }
        },
        ...mapMutations([
            "changeVideoMode",
            "changeAudioMuteStat",
            "changeVideoMuteStat",
            "changeEnableVideo",
            "changeEnableAudio"
        ])
    }
};
</script>
