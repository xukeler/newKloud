<template>
    <div id="syncplayer" class="syncplayer" >
        <div id="syncPlayerWrap" class="syncPlayerWrap" style="right:50%;text-align:center;display:none;"
        >
            <div class="syncPlayerCtl-wrap">
                <span
                    style="padding:5px;font-size:18px;padding-right: 10px;margin-right: 10px;border-right: solid 1px #ccc;width: 90px;display: inline-block;"
                >
                    {{syncAndPlayText}}
                    <audio id="syncplayersyncaudio" autoplay style="width:0px;height:0px;"></audio>
                </span>
                <span title="Stop" style="padding:5px; cursor:pointer;" @click="stopSyncAudio">
                    <Icon type="stop" size="20"></Icon>
                </span>
                <span
                    title="Pause"
                    id="syncPlayerCtl-Pause"
                    style="padding:5px;cursor:pointer;"
                    @click="pauseSyncAudio"
                >
                    <Icon type="pause" size="20"></Icon>
                </span>
                <span
                    title="Play"
                    id="syncPlayerCtl-Play"
                    style="padding:5px;cursor:pointer;display:none;"
                    @click="goSyncAudio"
                >
                    <Icon type="play" size="20"></Icon>
                </span>
                <span
                    title="Recording Voice"
                    id="syncPlayerCtl-Mic"
                    style="padding:5px;cursor:pointer;display:none;"
                >
                    <Icon type="mic-a" size="20"></Icon>
                </span>
                <span style="padding:5px;font-size:18px;">{{playAudioCurrentTime}}</span>
            </div>
        </div>
        <div id="syncPlayerControls" class="syncplaycontrols" style="display:none;" :style="widthStyle">
            <div id="syncplaycontrols-play"  @click="onSyncplayerPlay" style="width:50px;padding-left:25px;display:none;cursor:pointer;"><Icon size="22" type="play"></Icon></div>
            <div id="syncplaycontrols-pause" @click="onSyncplayerPause" style="width:50px;padding-left:25px;cursor:pointer;"><Icon size="22" type="pause"></Icon></div>
            <div id="syncplaycontrols-loading"  style="width:50px;padding-left:25px;display:none;cursor:wait;"><Icon size="22" type="load-d"></Icon></div>
            <div id="syncplaycontrols-stop" @click="onSyncplayerStop" style="width:25px;cursor:pointer;"><Icon size="22" type="stop"></Icon></div>
            <div style="width:calc(100% - 175px);padding:0px 5px 0px 10px;">
                <div style="margin-top:-2px;">
                 <Slider v-model="currentPlayTime" @on-change="onPlayTimeChange" @on-input="onPlayTimeChanging" @on-drag="onPlayTimeDrag" :max="totalTime" show-tip="never"></Slider>
                </div>
            </div>
            <div style="width:100px;font-size:16px;line-height:32px;text-align:left;">{{playAudioCurrentTime}}/{{getShowTotalTime}}</div>
        </div>
        <div id="syncplayeraudio" style="width:0px; height:0px;position:absolute;left:-1000px;"></div>
        <div id="syncplayervoice" style="width:0px; height:0px;position:absolute;left:-1000px;" ></div>
        <upload-file preid="syncplayer" ref="uploadfile"></upload-file>
        <Modal
            v-model="thinkCreate"
            width="450"
            :closable="true"
            class-name="hideModalFooter hideModalHead"
            :mask-closable="false"
            style="z-index:39000;position: absolute;"
        >
            <div style="color:#2db7f5;font-size:18px;font-weight:bold;">
                <span v-if="thinkInfo.CreateEditStat==0">{{$t("Live.CreateThink")}}</span><span v-else>{{$t("Live.EditThink")}}</span>
                <span v-show="thinkInfo.CreateEditStat!=0" style="float:right;font-size:12px; padding-right:20px;color:#000;font-weight:normal;">{{$t("Live.SyncStatus")}}:
                <span v-show="thinkInfo.SyncStatus==1" style="color:#2db7f5;">{{$t("Live.Synced")}}</span><span v-show="thinkInfo.SyncStatus!=1" style="color:#2db7f5;">{{$t("Live.NotSynced")}}</span>
                <span v-show="thinkInfo.SyncStatus==1" style="color:#2db7f5;">{{$t("Live.At")}} {{thinkInfo.SyncDate}}</span>
                </span>
            </div>
            <div style="border-bottom: 1px solid #ccc;padding:5px 0px 15px 0px;">
                <Input v-model="thinkInfo.Title" :placeholder="$t('Live.InputThinkName')" style="width: 418px;"></Input>
            </div>
            <div style="border-bottom: 0px solid #ccc;padding:15px 0px 5px 0px;">
                <div>
                    <span>{{$t("Live.EnableBackgroundAudio")}}</span>
                </div>
                <div v-show="thinkInfo.BackGroundItemID==0">
                    <div @click="thinkSelectBackGround" style="padding:2px 0px 5px 20px;color:#2db7f5;cursor:pointer;display:inline-block;">+{{$t("Live.SelectanAudio")}}</div>
                    <span style="display:none;">{{thinkInfo.BackGroundTitle}}</span>
                </div>
                <div v-show="thinkInfo.BackGroundItemID!=0" style="clear:both;padding-left:20px;">
                    <div>{{$t("Live.Audio")}}: {{thinkInfo.BackGroundTitle}}</div>
                    <div>{{$t("Live.Time")}}: {{thinkInfo.BackGroundTime}}</div>
                    <span @click="thinkDeleteBackGround" style="float:right;cursor:pointer; padding-right:10px;margin-top:-35px;"><Icon size="20" type="trash-a"></Icon></span>
                </div>
            </div>
            <div style="border-bottom: 1px solid #ccc;padding:15px 0px 15px 0px;">
                <div>
                    <div style="float:left;font-weight:bold;">
                        <span>{{$t("Live.EnableVoice")}}</span>                      
                    </div>
                    <div style="float:right;width:300px;border-bottom: 1px solid #ccc;height:10px;"></div>
                </div>
                <div style="padding:2px 0px 5px 0px;clear:both; height:90px;">
                    <div style="padding-left:20px;" v-show="!thinkInfo.EnableSelectVoice">
                        <div style="color:#2db7f5;" v-show="!thinkInfo.EnableRecord && !thinkInfo.EnableSelectVoice">
                            <span @click="thinkEnableRecordChange($event)" style="cursor:pointer;"><Icon type="ios-mic" size="16"></Icon>&nbsp;{{$t("Live.EnableRecordNewVoice")}}</span>
                        </div>
                        <div v-show="thinkInfo.EnableRecord">
                             <Checkbox v-model="thinkInfo.EnableRecord"></Checkbox>{{$t("Live.RecordingNewVoice")}}
                        </div>
                        <div v-show="thinkInfo.RecordTitle!=''" style="padding-left:20px;">
                            <div>{{$t("Live.From")}}: {{thinkInfo.RecordTitle}}</div>
                            <div>{{$t("Live.Duration")}}: {{thinkInfo.RecordTime}}</div>
                            <div style="color:#2db7f5;cursor:pointer;" @click="thinkRecordNewVoice()"><Icon type="ios-mic" size="18"></Icon>&nbsp;&nbsp;{{$t("Live.RecordNewVoice")}}</div>
                        </div>
                    </div>
                    <div style="padding-left:20px;" v-show="!thinkInfo.EnableRecord">
                        <div v-show="!thinkInfo.EnableSelectVoice">
                            <div  @click="thinkSelectVoice" style="padding:2px 0px 5px 0px;color:#2db7f5;cursor:pointer;inline-block;">+{{$t("Live.SelectVoiceFile")}}</div>
                        </div>
                        <div v-show="thinkInfo.SelectVoiceItemID!=0" style="padding-left:20px;">
                            <div>{{$t("Live.Audio")}}: {{thinkInfo.SelectVoiceTitle}}</div>
                            <div>{{$t("Live.Time")}}: {{thinkInfo.SelectVoiceTime}}</div>
                            <span @click="thinkDeleteSelectVoice" style="float:right;cursor:pointer; padding-right:10px;margin-top:-35px;"><Icon size="20" type="trash-a"></Icon></span>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div v-show="thinkInfo.CreateEditStat==0">
            <div v-show="false" style="text-align:center; padding:15px 0px 5px;">
                <Button @click="thinkSave" type="success">{{$t("Base.Save")}}</Button>
                <Button @click="thinkCancel" type="ghost">{{$t("Base.Cancel")}}</Button>
            </div>
            <div v-show="true" style="text-align:center; padding:15px 0px 5px;">
                <Button @click="thinkSync" :disabled="thinkBtnDisable" type="info" style="width:110px;margin-right:5px;">{{thinkBtnText}}</Button>
                <Button @click="thinkCancel" type="ghost" style="width:110px;margin-left:5px;">{{$t("Base.Cancel")}}</Button>
            </div>
            </div>
            <div v-show="thinkInfo.CreateEditStat!=0" style="text-align:center; padding:15px 0px 5px;">
                <span><Button @click="thinkSync" type="info" style="width:140px;">{{$t("Live.RecordSync")}}</Button></span>
                <span style="padding:5px 0px 5px;"><Button @click="thinkSave" type="success" style="width:140px;">{{$t("Live.SaveChangeOnly")}}</Button></span>
            </div>
        </Modal>
        <Modal
            v-model="selectVideo"
            title="Select Video"
            width="800"
            :closable="false"
            :mask-closable="false"
            @on-ok="selectVideoOK"
            @on-cancel="selectVideoCancel"
            style="z-index:40000;position: absolute;"
            class-name="hideModalFooter"
        >
            <div slot="header" style=" height:30px;">
                <span style="font-size:16px; font-weight:bold;">{{selectMediaTitle}}</span>
                <span style="float:right;">
                    <Button type="primary" @click="selectVideoOK">{{$t("Base.OK")}}</Button>
                    <Button type="text" @click="selectVideoCancel">{{$t("Base.Cancel")}}</Button>
                </span>
            </div>
            <div>
                <div>
                    <Tabs v-model="selectMediaTab" @on-click="onSelectMediaTabChange">
                        <TabPane :disabled="!selectVideo_showvideo" label="视频" name="video" icon="ios-videocam"></TabPane>
                        <TabPane :disabled="!selectVideo_showaudio" label="音频" name="audio" icon="music-note"></TabPane>
                    </Tabs>
                </div>
                <table style="width:100%;margin-bottom:10px;">
                    <tr>
                        <td style="width:205px;">
                            <Input
                                v-model="selectVideoKey"
                                :placeholder="$t('Live.SearchVideo')"
                                style="width: 200px;"
                            ></Input>
                        </td>
                        <td style="width:80px;">
                            <Button
                                type="primary"
                                icon="ios-search"
                                @click="onVideoSearch"
                            >{{$t("Base.Search")}}</Button>
                        </td>
                        <td style="width:120px; padding-left:5px;">
                            <div
                                style="background-color:#2d8cf0; border-color:#2d8cf0; border-radius:4px; width:100px; color:white; "
                            >
                                <label
                                    style="height:100%;width:100%; display:inline-block;cursor:pointer;"
                                >
                                    <input
                                        id="uploadVideo2SaveFileInput"
                                        type="file"
                                        @change="uploadVideo2SaveFileInputChange(this);"
                                        accept="audio/wav, audio/mp4a-latm, audio/aac, audio/3gpp, audio/mpeg, video/mp4"
                                        style="width:0px; position:relative;left:-20000px;"
                                    >
                                    <span
                                        style="position:absolute;display:inline-block;height:32px;line-height:32px;padding-left:5px; padding-top:3px;"
                                    >
                                        <Icon
                                            type="ios-cloud-upload-outline"
                                            style="color:white;"
                                            size="26"
                                        ></Icon>
                                        <!--<img class="live-file-thumbnail" src="/static/images/uploadfile.svg" style="width:32px;">-->
                                    </span>
                                    <span
                                        style="width:85px; text-align:right;height:32px;line-height:32px;display:inline-block;"
                                    >{{$t("Base.Upload")}}</span>
                                </label>
                            </div>
                        </td>
                        <td style="text-align:right;">
                            <Page :total="selectVideoItemTotal" @on-change="onVideoPageChange"></Page>
                        </td>
                    </tr>
                </table>
            </div>
            <Row style="background:rgba(0,153,229,.7); height:30px;" type="flex" align="middle">
                <Col span="2">&nbsp;</Col>
                <Col span="14">{{$t("Base.Name")}}</Col>
                <Col span="4">{{$t("Live.TotalTime")}}</Col>
                <Col span="4">{{$t("Live.FileSize")}}</Col>
            </Row>
            <div style="height:300px; overflow:auto;">
                <div id="favList" class="favList" v-for="item in videoList">
                    <Row style="height:26px;" type="flex" align="middle">
                        <Col span="2">
                            <input
                                type="checkbox"
                                :id="'videoList_'+item.id"
                                :value="item.id"
                                @click="onVideoItemClick"
                            >
                        </Col>
                        <Col span="14">{{item.name}}</Col>
                        <Col span="4">{{item.time}}</Col>
                        <Col span="4">{{item.size}}</Col>
                    </Row>
                </div>
            </div>
            <div slot="footer" style="display:none;"></div>
        </Modal>
        <Modal
            v-model="uploadingSync"
            width="360"
            :closable="false"
            class-name="hideModalFooter hideModalHead"
            :mask-closable="false"
        >
            <div>Sync Title</div>
            <div><Input v-model="thinkInfo.Title" :placeholder="$t('Live.InputThinkName')" style="width: 330px;"></Input></div>
            <div
                style="text-align:center;height:130px;line-height:130px; font-size:20px;padding:5px 0px;"
            >
             <i-circle :percent="uploadingSyncPercent">
                <icon v-if="uploadingSyncPercent >= 100" type="ios-checkmark-empty" size="60" style="color:#5cb85c"></icon>
                <div v-else style="font-size:20px">{{ uploadingSyncPercent }}% <div>{{$t("Common.Uploading")}}...</div></div>            
            </i-circle>            
            </div>
            <div style="padding:10px 0px; border-top:1px solid #dddee1;border-bottom:1px solid #dddee1;">
                <span>Public</span>
                <span style="float:right;">
                    <i-switch v-model="thinkInfo.IsPublic" ></i-switch>
                    </span>
            </div>
            <div style="text-align:center;padding:10px 0px 0px;">
                <Button @click="uploadSyncRecordAudioOK" :disabled="uploadingSyncPercent!=100" type="primary" style="width:110px;margin-righ:15px;">{{$t("Base.OK")}}</Button>
                <Button @click="uploadingSync=false;" type="ghost" style="width:110px;margin-left:15px;">{{$t("Base.Hide")}}</Button>
            </div>
        </Modal>
    </div>
</template>
<style lang="scss">
    $images-root: "../../../static/images/";
    .syncplayer {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 21;
        display:none;

        .syncPlayerWrap
        {
            position: fixed;
            left: 52%;
            bottom: 20px;
            z-index: 21;
            font-size: 0;
            height: 50px;
            width: 440px;
            padding-top: 6px;
            margin-left: -243px;
            box-sizing: border-box;
        }
        .syncPlayerCtl-wrap {
            text-align: center;
            display: inline-block;
            border: solid 1px #ccc;
            padding: 5px;
            border-radius: 10px;
            background-color: white;
        }
        .syncplaycontrols
        {
            text-align: center;
            display: flex;
            bottom: 0px;
            position: fixed;
            width: 100%;
            height: 40px;
            align-items:center;
        }
        .syncplaycontrols >div
        {
            display: inline-block;
            padding:0px;
            margin: 0px;
            border:0px;
            vertical-align: middle;
            line-height: 40px;
            height: 40px;
        }
    }
</style>
<script>
import auth from '../../authenticator';
import webapi from "../../webapi/webapi.js";
import loger from "../../common/log.js";
import audioRecorder from "../../common/audioRecorder.js";
import util from "../../common/util.js";

import UploadFile from "./UploadFile.vue";

//var pako = require('pako');

var websocket =null;

var AutoPlayTimer=null;
function AutoPlayDocument(play, sec) {
    if (play) {
        AutoPlayTimer = setInterval(function() {
            console.log("AutoPlayDocument:NextPage:"+play);
            //NextPage();
        }, sec * 1000);
    } else {
        if (AutoPlayTimer) {
            clearTimeout(AutoPlayTimer);
            AutoPlayTimer = null;
        }
    }
}

export default {
    data: function ()
    {
      return {
           lastSycnAudioItemID: 0,
            selectVideo: false,
            selectVideoCallBack:null,
            selectVideoKey: "",
            selectVideoPageIndex: 0,
            selectVideoItemTotal: 100,
            selectMediaTitle: this.$t("Live.SelectVideo"),
            selectAudioUrl: "",
            selectAudioName: "",
            selectMediaTab: "video",
            selectVideo_showvideo:true,
            selectVideo_showaudio:true,
            videoList: [],
            syncAudioStat: 0,
            syncAudioPlay:false,
            syncTimeAxis: {Timer:null,StartTime:null,PauseTime:null,DiffTime:0,Time:0},
            syncAndPlayText: "",
            syncRecorder: null,
            uploadingSync: false,
            uploadingSyncPercent: 0,
            playAudioTimer: null,
            playAudioCurrentTime: "0:00",
            playSyncInfo: {Play: false,NeedPaly: -1,StartTime: 0,EndTime: 0,ToPlayList: [],Url: "",Stat: 0,ID:0,Total:0,LastSendTime:null}, 
            thinkOnAttachmentID:0,
            thinkOnLessonID:0,
            thinkOnItemID:0,
            thinkShareMode:false,           
            thinkMode:false,
            thinkCreate: false,
            thinkShow:  true,
            thinkShowSyncBtn: false,
            thinkInfo:{ID:0,Title:"",EnableBackGround:false,EnableSelectVoice:false,EnableRecord:false,BackGroundItemID:0,BackGroundTitle:"",BackGroundTime:"",SelectVoiceItemID:0,SelectVoiceTitle:"",SelectVoiceTime:"",RecordVoiceItemID:0,
            SyncStatus:0,SyncDate:"",CreateEditStat:0,RecordTitle:"",RecordTime:"",EnableVoice:false,IsPublic:true,PathInfo:null},
            autoRecordInfo:{IsRecord:false,Recorder:null,SoundIds:[],AttachmentID:0,RecordID:"",LastRecordStat:false},
            currentPlayTime: 0,
            totalTime: 0,
            isPlaying: false,
            isPlayingBeforeDrag: -1,
            isNotTrigEvent: false,
            isChangeTimeEnd: true,
            videoPlayTimer: null,
            speakerList: [],
            preLoadAudioUrl:"",
            preLoadVoiceUrl:"",
            preLoadThink:null,
            autoPausePlayer:false,
            autoPause4Video:false
      }
    },
    components: {
        UploadFile
    },
    props:["CanControl","SingleMode","Width"],
    mounted: function ()
    {

    },
    watch: {

    },
    methods: {
        CreateSync(atmid,lessonid=0,itemid=0)
        {
            this.thinkOnAttachmentID=atmid;
            this.thinkOnLessonID=lessonid;
            this.thinkOnItemID=itemid;
            this.thinkInfo={ID:0,Title:"",EnableBackGround:false,EnableSelectVoice:false,EnableRecord:false,BackGroundItemID:0,BackGroundTitle:"",BackGroundTime:"",SelectVoiceItemID:0,SelectVoiceTitle:"",SelectVoiceTime:"",RecordVoiceItemID:0,
            SyncStatus:0,SyncDate:"",CreateEditStat:0,RecordTitle:"",RecordTime:"",EnableVoice:false,IsPublic:true};
            this.thinkInfo.Title="";//auth.getUserName()+" - " + (new Date()).Format("yyyy-MM-dd hh:mm:ss");
            this.thinkInfo.EnableRecord=true;
            this.thinkShowSyncBtn = false;
            this.thinkCreate=true;
        },
        EditSync(id,atmid)
        {
            this.thinkOnAttachmentID=atmid;
             webapi.GetSoundtrack(id).then(res=>{
              this.thinkCreate=true;
              this.thinkInfo.CreateEditStat=1;
              this.thinkInfo.ID=res.SoundtrackID;
              this.thinkInfo.Title=res.Title;
              this.thinkInfo.EnableBackGround=res.EnableBackgroud==1;
              this.thinkInfo.EnableSelectVoice=res.EnableSelectVoice==1;
              this.thinkInfo.EnableRecord=res.EnableRecordNewVoice==1;
              this.thinkInfo.EnableVoice=this.thinkInfo.EnableSelectVoice||this.thinkInfo.EnableRecord;
              this.thinkInfo.BackGroundItemID=res.BackgroudMusicAttachmentID;
              this.thinkInfo.SelectVoiceItemID=res.SelectedAudioAttachmentID;
              this.thinkInfo.RecordVoiceItemID=res.NewAudioAttachmentID;
              this.thinkInfo.SyncStatus=res.SyncStatus;
              if(res.SyncDate)
              {
                  var ct = new Date();
                  ct.setTime(res.SyncDate);
                  let showCT = ct.Format("yyyy-MM-dd hh:mm:ss");
                  this.thinkInfo.SyncDate=showCT;
              }
              this.thinkInfo.BackGroundTitle=res.BackgroudMusicTitle;
              this.thinkInfo.SelectVoiceTitle=res.SelectedAudioTitle;
              if(res.BackgroudMusicInfo)
              {
                  this.thinkInfo.BackGroundTime=res.BackgroudMusicInfo.VideoDuration;
              }
              if(res.SelectedAudioInfo)
              {
                  this.thinkInfo.SelectVoiceTime=res.SelectedAudioInfo.VideoDuration;
              }
              if(res.NewAudioInfo)
              {
                  this.thinkInfo.RecordTitle=res.UserName;
                  this.thinkInfo.RecordTime=res.NewAudioInfo.VideoDuration;
              }

          });
        },
        GoToTime(time){
            //console.log("GoToTime:"+time);
            //debugger;
            if(this.syncTimeAxis.StartTime==null) return;
            this.playAudioCurrentTime = util.FormatMediaTime(Math.round(time/ 1000));
            this.currentPlayTime=time;
            var diff=0;
            if(this.syncTimeAxis.PauseTime)
            {
                diff =time-(this.syncTimeAxis.PauseTime-this.syncTimeAxis.StartTime);    
            }
            else
            {
                diff =time-(new Date()-this.syncTimeAxis.StartTime);
            }
            //console.log(diff);
            this.makeVioceAudioSameTime(time/1000,false);
            if(this.syncTimeAxis.PauseTime)
            {
                this.syncTimeAxis.PauseTime.setMilliseconds(this.syncTimeAxis.PauseTime.getMilliseconds()+diff);
            }
            else
            {
                this.syncTimeAxis.StartTime.setMilliseconds(this.syncTimeAxis.StartTime.getMilliseconds()-diff);
            }

            this.clearLocalAction();
            //  console.log(this.syncTimeAxis.StartTime);
            //  console.log(this.syncTimeAxis.PauseTime);
        },
        GetCurrentPlayTime(){
            if(this.syncTimeAxis.StartTime==null) return 0;
            // console.log(this.syncTimeAxis.StartTime);
            // console.log(this.syncTimeAxis.PauseTime);
            var diff=0;
            if(this.syncTimeAxis.PauseTime)
            {
                diff =this.syncTimeAxis.PauseTime-this.syncTimeAxis.StartTime;    
            }
            else
            {
                diff =new Date()-this.syncTimeAxis.StartTime;
            }
            return diff;
        },
        IsUploading(){
            if(uploadingSync && uploadingSyncPercent<100){
                return true;
            }
            return false;
        },
        thinkSelectBackGround(evt){
            this.selectAudioShow();
            this.selectVideoCallBack=(d)=>{
                //alert(d.Title);
                this.thinkInfo.BackGroundItemID=d.AttachmentID;
                this.thinkInfo.BackGroundTitle=`${d.Title}`;
                this.thinkInfo.BackGroundTime=d.VideoDuration;
                this.thinkInfo.EnableBackGround=true;
            };

        },
        thinkDeleteBackGround(){
            this.thinkInfo.BackGroundItemID=0;
            this.thinkInfo.BackGroundTitle="";
            this.thinkInfo.BackGroundTime="";
            this.thinkInfo.EnableBackGround=false;
        },
        thinkDeleteSelectVoice(){
            this.thinkInfo.EnableSelectVoice=false;
            this.thinkInfo.SelectVoiceItemID=0;
            this.thinkInfo.SelectVoiceTitle="";
            this.thinkInfo.SelectVoiceTime="";
            this.thinkInfo.EnableRecord=false;
            this.thinkInfo.RecordTitle="";
            this.thinkInfo.RecordTime="";
        },
        thinkSave(evt) {            
            if(this.thinkOnAttachmentID==0)
            {
                this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: "no file", top: 24,duration: 4, left:true });
                return;
            }
            // if(this.thinkInfo.Title=="")
            // {
            //     alert("Title can't empty!");
            //     return;
            // }            
            //console.log(selectfile.atmid); 
            //thinkInfo:{ID:0,Title:"",EnableBackGround:false,EnableSelectVoice:false,EnableRecord:false,BackGroundItemID:0,BackGroundTitle:"",SelectVoiceItemID:0,SelectVoiceTitle:""},

            var info = new Object();
            info.AttachmentID=parseInt(this.thinkOnAttachmentID);
            info.Title=this.thinkInfo.Title;
            info.EnableBackgroud=this.thinkInfo.EnableBackGround?1:0;
            info.EnableSelectVoice=this.thinkInfo.EnableSelectVoice?1:0;
            info.EnableRecordNewVoice=this.thinkInfo.EnableRecord?1:0;
            info.SelectedAudioAttachmentID=this.thinkInfo.SelectVoiceItemID;
            info.BackgroudMusicAttachmentID=this.thinkInfo.BackGroundItemID;
            info.SelectedAudioTitle=this.thinkInfo.SelectVoiceTitle;
            info.BackgroudMusicTitle=this.thinkInfo.BackGroundTitle;
            info.IsPublic=this.thinkInfo.IsPublic?1:0;
            if(this.thinkInfo.ID==0)
            {
                webapi.CreateSoundtrack(info).then(res=>{
                    this.thinkShowSyncBtn = true;
                    this.thinkInfo.ID=res.RetData.SoundtrackID;
                    this.thinkInfo.PathInfo=res.RetData.PathInfo;//{FileID: 25389, Path: "P49/Attachment/D25389"}
                });
            }
            else{
                info.SoundtrackID=this.thinkInfo.ID;
                webapi.EditSoundtrack(info).then(res=>{
                    this.thinkCreate = false;
                    this.thinkInfo.PathInfo=res.RetData;//{FileID: 25389, Path: "P49/Attachment/D25389"}
                });
            }
            //to do
        },
        thinkSaveOnly(callback) {            
            if(this.thinkOnAttachmentID==0)
            {
                this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: "no file", top: 24,duration: 4, left:true });
                return;
            }
            // if(this.thinkInfo.Title=="")
            // {
            //     if(callback)callback(false);
            //     return;
            // }            
            var info = new Object();
            info.AttachmentID=parseInt(this.thinkOnAttachmentID);
            info.Title=this.thinkInfo.Title;
            info.EnableBackgroud=this.thinkInfo.EnableBackGround?1:0;
            info.EnableSelectVoice=this.thinkInfo.EnableSelectVoice?1:0;
            info.EnableRecordNewVoice=this.thinkInfo.EnableRecord?1:0;
            info.SelectedAudioAttachmentID=this.thinkInfo.SelectVoiceItemID;
            info.BackgroudMusicAttachmentID=this.thinkInfo.BackGroundItemID;
            info.SelectedAudioTitle=this.thinkInfo.SelectVoiceTitle;
            info.BackgroudMusicTitle=this.thinkInfo.BackGroundTitle;
            info.Type=0;
            info.IsPublic=this.thinkInfo.IsPublic?1:0;
            info.LessonID=this.thinkOnLessonID;
            info.ItemID=this.thinkOnItemID;
            if(this.thinkInfo.ID==0)
            {
                webapi.CreateSoundtrack(info).then(res=>{
                    this.thinkInfo.ID=res.RetData.SoundtrackID;
                    this.thinkInfo.PathInfo=res.RetData.PathInfo;//{FileID: 25389, Path: "P49/Attachment/D25389"}
                    // if(this.thinkOnLessonID!=0)
                    // {
                    //     webapi.AddSoundtrack2Lesson(this.thinkOnLessonID,[this.thinkInfo.ID]);
                    // }
                    if(callback)callback(true);
                });
            }
            else{
                info.SoundtrackID=this.thinkInfo.ID;
                webapi.EditSoundtrack(info).then(res=>{
                    this.thinkInfo.PathInfo=res.RetData;//{FileID: 25389, Path: "P49/Attachment/D25389"}
                    if(callback)callback(true);
                });
            }
        },
        thinkCancel(evt){
            this.thinkCreate=false;
            this.thinkShowSyncBtn=false;
            this.thinkInfo={ID:0,Title:"",EnableBackGround:false,EnableSelectVoice:false,EnableRecord:false,BackGroundItemID:0,BackGroundTitle:"",BackGroundTime:"",SelectVoiceItemID:0,SelectVoiceTitle:"",SelectVoiceTime:"",RecordVoiceItemID:0,
            SyncStatus:0,SyncDate:"",CreateEditStat:0,RecordTitle:"",RecordTime:"",EnableVoice:false};
        },
        thinkSelectVoice(evt){
            // if(this.thinkInfo.EnableVoice==false)
            // {
            //     return;
            // }
            this.selectAudioShow();
            this.selectVideoCallBack=(d)=>{
                //alert(d.ItemID);
                
                this.thinkInfo.EnableSelectVoice=true;
                this.thinkInfo.SelectVoiceItemID=d.AttachmentID;
                this.thinkInfo.SelectVoiceTitle=`${d.Title}`;
                this.thinkInfo.SelectVoiceTime=d.VideoDuration;
                this.thinkInfo.EnableRecord=false;
                this.thinkInfo.RecordTitle="";
                this.thinkInfo.RecordTime="";
            };
        },
        selectAudioShow() {
            this.selectVideo = true;
            this.selectMediaTitle = this.$t("Live.SelectAudio");
            this.selectVideoCallBack=null;
            this.selectMediaTab = "audio";
            this.selectVideo_showvideo=false;
            this.selectVideo_showaudio=true;
            webapi.getAudioList(-1, -1).then(d => {
                this.videoList = [];
                this.selectVideoItemTotal = d.Count;
                for (let item of d.List) {
                    this.videoList.push(this.videoList2ShowList(item));
                }
            });
        },
        selectVideoShow(callback) {
            this.selectVideo = true;
            this.selectVideoCallBack=null;
            this.selectMediaTab = "video";
            this.selectVideo_showvideo=true;
            this.selectVideo_showaudio=false;

            //console.log(this.selectMediaTab);
            if (this.selectMediaTab == "video") {
                this.selectMediaTitle = this.$t("Live.SelectVideo");
                webapi.getVideoList(0, -1).then(d => {
                    this.videoList = [];
                    this.selectVideoItemTotal = d.Count;
                    for (let item of d.List) {
                        this.videoList.push(this.videoList2ShowList(item));
                    }
                });
            } else {
                this.selectMediaTitle = this.$t("Live.SelectAudio");
                webapi.getAudioList(-1, -1).then(d => {
                    this.videoList = [];
                    this.selectVideoItemTotal = d.Count;
                    for (let item of d.List) {
                        this.videoList.push(this.videoList2ShowList(item));
                    }
                });
            }
            this.selectVideoCallBack=callback;
        },
        videoList2ShowList(item) {
            return {
                id: item.ItemID,
                name: item.Title,
                time: item.VideoDuration,
                size: item.VideoSize
            };
        },
        selectVideoOK() {
            if (this.selectedVideo == "") {
                this.selectAudioUrl = "";
                this.selectAudioName = "";
                return;
            }
            webapi.getFavoriteAttachmentDetail(this.selectedVideo).then(d => {
                if(this.selectVideoCallBack!=null)
                {
                    this.selectVideoCallBack(d);
                }
                else if (this.showAutoPlayDlg == true) {
                    this.selectAudioUrl = d.AttachmentUrl;
                    this.selectAudioName = d.Title;
                } else {
                    //this.selectAudioUrl = "";
                    $("#videoList_" + this.selectedVideo).prop(
                        "checked",
                        false
                    );
                    this.selectedVideo = "";
                    //VideoTagAfterSelect(d);
                }
                this.selectVideo = false;
            });
        },
        selectVideoCancel() {
            this.selectVideo = false;
            //VideoTagAfterSelect(null);
        },
        thinkEnableRecordChange(isselect){
            //if(this.thinkInfo.EnableVoice==true)
            {
                this.thinkInfo.EnableRecord=true;
                this.thinkInfo.EnableSelectVoice=false;
                this.thinkInfo.SelectVoiceItemID=0;
                this.thinkInfo.SelectVoiceTitle="";
                this.thinkInfo.SelectVoiceTime="";
            }
        },
        onSelectMediaTabChange(name) {
            //alert(name);
            $("#videoList_" + this.selectedVideo).prop("checked", false);
            this.selectedVideo = "";
            if (name == "video") {
                this.selectMediaTitle = this.$t("Live.SelectVideo");
                webapi.getVideoList(0, -1).then(d => {
                    this.videoList = [];
                    this.selectVideoItemTotal = d.Count;
                    for (let item of d.List) {
                        this.videoList.push(this.videoList2ShowList(item));
                    }
                });
            } else {
                this.selectMediaTitle = this.$t("Live.SelectAudio");
                webapi.getAudioList(-1, -1).then(d => {
                    this.videoList = [];
                    this.selectVideoItemTotal = d.Count;
                    for (let item of d.List) {
                        this.videoList.push(this.videoList2ShowList(item));
                    }
                });
            }
        },
        onVideoSearch() {
            //if (this.selectVideoKey == "") return;
            this.selectVideoPageIndex = 0;
            if (this.selectMediaTab == "video")
            {
                webapi.getVideoList(
                    this.selectVideoPageIndex,
                    -1,
                    this.selectVideoKey
                )
                .then(d => {
                    this.videoList = [];
                    this.selectVideoItemTotal = d.Count;
                    for (let item of d.List) {
                        this.videoList.push(this.videoList2ShowList(item));
                    }
                });
            }
            else{
                webapi.getAudioList(
                    this.selectVideoPageIndex,
                    -1,
                    this.selectVideoKey
                )
                .then(d => {
                    this.videoList = [];
                    this.selectVideoItemTotal = d.Count;
                    for (let item of d.List) {
                        this.videoList.push(this.videoList2ShowList(item));
                    }
                });
            }
        },
        onVideoPageChange(pageno) {
            //alert("onVideoPageChange:" + pageno);
            this.selectVideoPageIndex = pageno - 1;
            webapi.getVideoList(this.selectVideoPageIndex,-1, this.selectVideoKey)
                .then(d => {
                    this.videoList = [];
                    //this.selectVideoItemTotal = d.Count;
                    for (let item of d.List) {
                        this.videoList.push(this.videoList2ShowList(item));
                    }
                });
        },
        onVideoItemClick(evt) {
            var tar = evt.currentTarget;
            if (tar.checked) {
                if (this.selectedVideo != "") {
                    $("#videoList_" + this.selectedVideo).prop("checked",false);
                }
                this.selectedVideo = $(tar).val();
            } else {
                this.selectedVideo = "";
            }
        },
        thinkSync(evt) {
            this.thinkCreate = false;
            this.thinkShowSyncBtn = false;
            this.thinkSaveOnly(()=>{
                this.startSyncThink(this.thinkInfo.ID,this.thinkInfo.EnableRecord?1:0);
            });
            
        }, 
        SetWebSocket(ws){
            websocket=ws;
        },
        preLoadAudioSync(url){
            if(this.preLoadAudioUrl==url) return;
            $("#syncplayeraudio").empty();           
            this.preLoadAudioUrl=url;
            var html ='<audio id="syncplayeraudioele" preload="load" src="' +url +'" ></audio>';            
            $("#syncplayeraudio").append(html);
            $("#syncplayeraudioele").bind("error",(err)=>{
                this.$emit("onError",{Code:1,Data:err,Url:url});
            })
            this.$emit("onPreLoadAudioEnd",url);
        },
        async preLoadAudio(url)
        {
            if(this.preLoadAudioUrl==url) return;
            $("#syncplayeraudio").empty(); 
            this.downloadAudio(url,(data)=>{
                var windowURL = window.URL || window.webkitURL;               
                var src=windowURL.createObjectURL(data);
                this.preLoadAudioUrl=url;
                // console.log(windowURL);
                // console.log(data);
                // console.log(src);
                var html ='<audio id="syncplayeraudioele" preload="load" src="' +src +'" ></audio>';            
                $("#syncplayeraudio").append(html);
                this.$emit("onPreLoadAudioEnd",url);
            });            
        },
        downloadAudio(url,callback){
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true); 
            xhr.responseType = "blob";
            xhr.onload = function () {
                if (this.status === 200) {
                    callback(this.response);
                }
            };
            xhr.send();            
        },
        downloadAudioSync(url){
             var result=null;
            $.ajax({
                type: "GET",
                async: false,
                dataType:"blob",
                url: url,
                mimeType:"application/octet-stream",
                success: (data)=>
                {             
                    console.log(typeof(data));
                    console.log(data);      
                    result=this.char2buf(data);
                },
                error: function (xhr, ajaxOptions, thrownError)
                {
                    result=null;
                }
            });
            
            // var xhr = new XMLHttpRequest();
            // xhr.open('GET', url, true); 
            // xhr.responseType = "blob";
            // xhr.onload = function () {
            //     if (this.status === 200) {
            //         var blob = this.response;
            //         result=blob;
            //     }
            // };
            // xhr.send();
            return result;
        },
        char2buf(str){
            var out = new ArrayBuffer(str.length*2);
            var u16a= new Uint16Array(out);
            var strs = str.split("");
            for(var i =0 ; i<strs.length;i++){
                u16a[i]=strs[i].charCodeAt();
            }
            return out;
        },
        playPreloadAudio(){
            //console.log(this.preLoadAudioUrl);
            var audio = $("#syncplayeraudio").find(">audio");
            if (audio.length > 0 && this.preLoadAudioUrl!="") {
                audio[0].currentTime=0;
                audio[0].play();
            }
        },
        playAudio(url, onEnd, onPlay, isloop = true) {
            //syncplayeraudio
            
            if (url != "")
            {
                if($("#syncplayeraudio").find("audio").length==0 ||this.preLoadAudioUrl!=url)
                {
                    $("#syncplayeraudio").empty();
                    var html ='<audio id="syncplayeraudioele" preload="load" src="' +url +'"  ' +(isloop ? ' loop="loop"' : "") +"></audio>";
                    $("#syncplayeraudio").append(html);
                    $("#syncplayeraudio").find("audio")[0].play();
                }
                else
                {
                     var audio = $("#syncplayeraudio").find(">audio")[0];
                     if(audio.paused)
                     {
                         audio.currentTime=0;
                         audio.play();
                     }
                     else
                     {
                         audio.currentTime=0;
                     }
                }
                
            }
            if (url != "") {
                // var speaker = localStorage.getItem("DefaultSpeaker");
                // if (speaker && speaker != "") {
                //     var eaudio = $("#syncplayeraudio").find("audio")[0];
                //     if (eaudio && eaudio.setSinkId) {
                //         eaudio.setSinkId(speaker);
                //     }
                // }
                var eaudio = $("#syncplayeraudio").find("audio")[0];
                if (eaudio && eaudio.setSinkId) {
                    this.applySpeakerSetting(eaudio);
                }
                $(eaudio).bind("ended", () => {
                    //loger.log("audio ended");
                    if (this.playAudioTimer) {
                        clearTimeout(this.playAudioTimer);
                        this.playAudioTimer = null;
                    }
                    if (onEnd) onEnd();
                });
                if (this.playAudioTimer) {
                    clearTimeout(this.playAudioTimer);
                    this.playAudioTimer = null;
                }
                if (onPlay) {
                    $(eaudio).bind("play", () => {
                        //loger.log("audio play");
                        onPlay(0);
                        this.playAudioTimer = setInterval(() => {
                            if (!eaudio.paused) {
                                onPlay(Math.round(eaudio.currentTime * 1000));
                            }
                        }, 500);
                    });
                }
            }
        },
        async applySpeakerSetting(eaudio){
            var speaker =await this.getSpeakerSetting();
            if (speaker && speaker != "" && speaker !="default") {
                eaudio.setSinkId(speaker);
            }
        },
        async getSpeakerSetting()
        {
            if(this.speakerList.length<1)
            {
                await this.getSpeakerList();
            }
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
        async getSpeakerList(){
            if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)
            {
                navigator.mediaDevices.enumerateDevices().then((devices)=>
                {
                    devices.forEach((device)=>
                    {
                        if (device.kind == "audiooutput")
                        {
                            this.speakerList.push(device.deviceId);
                        }
                    });
                    return true;
                });
            }
            else
            {
                return false;
            }
        },
        pauseAudio() {
            var audio = $("#syncplayeraudio").find(">audio");
            if (audio.length > 0) {
                audio[0].pause();
            }
            if (this.playSyncInfo.NeedPaly == 0) {
                AutoPlayDocument(false, 5);
            }
        },
        goplayAudio() {
            var audio = $("#syncplayeraudio").find(">audio");
            if (audio.length > 0) {
                audio[0].play();
            }
            
            if (this.playSyncInfo.NeedPaly == 0) {
                AutoPlayDocument(true, 5);
            }
        },
        preLoadVoiceSync(url)
        {
            if(this.preLoadVoiceUrl==url) return;
            $("#syncplayervoice").empty();           
            this.preLoadVoiceUrl=url;
            var html ='<audio id="syncplayervoiceele" preload="load" src="' +url +'" ></audio>';            
            $("#syncplayervoice").append(html);
            this.$emit("onPreLoadVoiceEnd",url);
        },
        preLoadVoice(url)
        {
            if(this.preLoadVoiceUrl==url) return;
            $("#syncplayervoice").empty(); 
            this.downloadAudio(url,(data)=>{
                var windowURL = window.URL || window.webkitURL;
                var src=windowURL.createObjectURL(data);
                this.preLoadVoiceUrl=url;
                var html ='<audio id="syncplayervoiceele" preload="load" src="' +src +'" ></audio>';            
                $("#syncplayervoice").append(html);
                this.$emit("onPreLoadVoiceEnd",url);
            }); 
        },
        playPreloadVoice(){
            var audio = $("#syncplayervoice").find(">audio");
            if (audio.length > 0 && this.preLoadVoiceUrl!="") {
                audio[0].currentTime=0;
                audio[0].play();
            }
        },
        playVoice(url, onEnd,isloop = false) {
            //syncplayervoice            
            if (url != "") 
            {
                if($("#syncplayervoice").find("audio").length==0 || $("#syncplayervoice").find("audio").attr("src")!=url)
                {
                    $("#syncplayervoice").empty();
                    var html ='<audio src="' + url + '" '+ (isloop ? ' loop="loop"' : "") +'></audio>';
                    $("#syncplayervoice").append(html);
                    $("#syncplayervoice").find("audio")[0].play();
                }
                else
                {
                     var audio = $("#syncplayervoice").find(">audio")[0];
                     if(audio.paused)
                     {
                         audio.play();
                     }
                }
                
                var speaker = localStorage.getItem("DefaultSpeaker");
                if (speaker && speaker != "") {
                    var eaudio = $("#syncplayervoice").find("audio")[0];
                    if (eaudio && eaudio.setSinkId) {
                        eaudio.setSinkId(speaker);
                    }
                }
                $(eaudio).bind("ended", () => {
                    if (onEnd) onEnd();
                });
            }
        },
        pauseVoice() {
            var audio = $("#syncplayervoice").find(">audio");
            if (audio.length > 0) {
                audio[0].pause();
            }
        },
        goplayVoice() {
            var audio = $("#syncplayervoice").find(">audio");
            if (audio.length > 0) {
                audio[0].play();
            }
        },
        stopVoice() {
            var audio = $("#syncplayervoice").find(">audio");
            if (audio.length > 0) {
                audio[0].pause();
            }
            //$("#syncplayervoice").empty();
        },
        stopAudio4Think() {
            //loger.log("stopAudio()");
            //this.selectAudioUrl = "";
            var audio = $("#syncplayeraudio").find(">audio");
            if (audio.length > 0) {
                audio[0].pause();
            }
            //$("#syncplayeraudio").empty();           
        },
        makeVioceAudioSameTime(time = 0, canSetTime=true) {
            var voice = $("#syncplayervoice").find(">audio");
            var audio = $("#syncplayeraudio").find(">audio");
            if (time == 0) {
                if (voice.length > 0) {
                    voice[0].currentTime = 0;
                }
                if (audio.length > 0) {
                    audio[0].currentTime = 0;
                }
            } 
            else 
            {
                if (voice.length > 0 && audio.length > 0) {
                    if (Math.abs(time - audio[0].currentTime) > 1) {
                        voice[0].currentTime = time;
                        audio[0].currentTime = time;
                    }
                } else {
                    if (voice.length > 0 && Math.abs(time - voice[0].currentTime) > 1) {
                        voice[0].currentTime = time;
                    }
                    if (audio.length > 0 && Math.abs(time - audio[0].currentTime) > 1) {
                        audio[0].currentTime = time;
                    }
                }
            }
            if (this.playSyncInfo.Play==true)//this.showUploadFile && 
            { 
                let diff =new Date()-this.syncTimeAxis.StartTime-time*1000;
                if(canSetTime && (diff>1000 || diff<-1000))
                {
                    this.syncTimeAxis.StartTime.setMilliseconds(this.syncTimeAxis.StartTime.getMilliseconds()+diff);//getMilliseconds    setMilliseconds
                }                
            }
        },
        setplayAudioVolume(vol = 0.5) {
            var audio = $("#syncplayeraudio").find(">audio");
            if (audio.length > 0) {
                audio[0].volume = vol;
            }
        },
        setMedia4PlayThink(isplay){
            // if(this.thinkMode) return;
            // if(isplay)
            // {
            //     this.getMediaView().Leave();
            //     taggleMinControlWindow(false);
            //     LiveBodyResize();
            //     CheckZoom();
            // }
            // else
            // {
            //     var userid = auth.getUserIDEx();
            //     var name = auth.getUserName();
            //     taggleMinControlWindow(true);
            //     LiveBodyResize();
            //     CheckZoom();
            //     if(this.isLessonStart)
            //     {
            //         this.getMediaView().JoinMedia(
            //             MeetingID,
            //             userid,
            //             name,
            //             Role,
            //             this.getEnableVideo,
            //             this.getEnableAudio,
            //             () => {}
            //         );
            //     }
            // }
        },
        NoticePlayThink(id,stat, time = 0) {
            if (!websocket) return;
            if (!this.CanControl) return;
            if(this.SingleMode) return;
            if (!this.playSyncInfo.Play) return;
            var senddata = new Object();
            senddata.actionType = 23; //play soundtrack
            senddata.soundtrackId = id;//soundtrackID
            if (stat == 4 || stat == 5) {
                senddata.time = time;
            }
            senddata.stat = stat; //0 :stop 1:play 2:pause 3:resume 4:playing 5:goto
            websocket.sendmessage("",base64encode(utf16to8(JSON.stringify(senddata))));
        },
        playAudio4Think(url, onEnd, onPlay, isloop = true) 
        {
            //syncplayeraudio
            $("#syncplayeraudio").empty();
            if (url != "") {
                var html ='<audio src="' +url +'" autoplay="autoplay" ' +(isloop ? ' loop="loop"' : "") +"></audio>";
                $("#syncplayeraudio").append(html);
            }
            if (url != "") {
                var speaker = localStorage.getItem("DefaultSpeaker");
                if (speaker && speaker != "") {
                    var eaudio = $("#syncplayeraudio").find("audio")[0];
                    if (eaudio && eaudio.setSinkId) {
                        eaudio.setSinkId(speaker);
                    }
                }
                $(eaudio).bind("ended", () => {
                    //loger.log("audio ended");
                    if (this.playAudioTimer) {
                        clearTimeout(this.playAudioTimer);
                        this.playAudioTimer = null;
                    }
                    if (onEnd) onEnd();
                });
                if (this.playAudioTimer) {
                    clearTimeout(this.playAudioTimer);
                    this.playAudioTimer = null;
                }
                if (onPlay) {
                    $(eaudio).bind("play", () => {
                        //loger.log("audio play");
                        onPlay(0);
                        this.playAudioTimer = setInterval(() => {
                            if (!eaudio.paused) {
                                onPlay(Math.round(eaudio.currentTime * 1000));
                            }
                        }, 500);
                    });
                }
            }
        },
        startSyncThink(id, isrecoreding) {
            //alert(id + "," + isrecoreding);
            
            $("#syncplayer,#syncPlayerWrap").show();
            $("#syncplayeraudio").empty();
            this.ChangeStyle4Sync(true);
            this.lastSycnAudioItemID = id;
            this.syncAudioStat = 1;
            this.syncAudioPlay=true;
            this.syncAndPlayText = "Syncing";
            $("#livePanelSyncCtl-Pause").show();
            $("#livePanelSyncCtl-Play").hide();
            if (isrecoreding == 1) {
                $("#livePanelSyncCtl-Mic").show();
            } else {
                $("#livePanelSyncCtl-Mic").hide();
            }
            webapi.GetSoundtrack(id).then(d => {
                websocket.audiosync(1, id);
                if (isrecoreding == 1) {
                    var micDeviceId = "";
                    var mic = localStorage.getItem('DefaultMic');
                    if (mic && mic != null && mic != "")
                    {
                        micDeviceId = mic;
                    }
                    audioRecorder.getRecorder(
                        rec => {
                            this.syncRecorder = rec;                            
                            this.syncRecorder.start();
                        },
                        {
                            deviceId: micDeviceId,
                            sampleBits: 8,
                            sampleRate: 1 / 4
                        }
                    );
                } else {
                    this.syncRecorder = null;
                }
                if(d.BackgroudMusicInfo)
                {
                    this.playAudio4Think(d.BackgroudMusicInfo.AttachmentUrl,() => {
                            
                        }, currentTime => {
                            if (currentTime == 0) {
                               
                            }                        
                        },
                        true
                    );
                    if (isrecoreding == 1) {
                        this.setplayAudioVolume(0.8);
                    }
                }
                if(d.SelectedAudioInfo)
                {
                    this.playVoice(d.SelectedAudioInfo.AttachmentUrl,()=>{},false);
                }
                this.syncTimeAxis.Timer=setInterval(()=>{
                   this.onThinking();
                },1000);
                this.syncTimeAxis.StartTime = new Date();
                this.syncTimeAxis.PauseTime = null;
                this.syncTimeAxis.DiffTime = 0;
                this.syncTimeAxis.Time = 0;
                this.$emit("onRecordSyncStart", "");
                //Record_changepage();
                //Record_view();
                
            });
        },
        onThinking(){
            this.syncTimeAxis.Time=new Date()-this.syncTimeAxis.StartTime;
            //console.log("onThinking:"+this.syncTimeAxis.Time);
            this.playAudioCurrentTime = util.FormatMediaTime(Math.round( this.syncTimeAxis.Time/ 1000));
            this.isNotTrigEvent = true;
            this.currentPlayTime=this.syncTimeAxis.Time;
            setTimeout(() =>
            {
                this.isNotTrigEvent = false;
            }, 100);
            
            //console.log("K:"+this.syncTimeAxis.Time+","+$("#syncplayeraudio").find(">audio")[0].currentTime);
            if(this.syncTimeAxis.Time<1400)
            {
                if(this.syncRecorder!=null)
                {
                    var recordTime= this.syncRecorder.getCurrentTime();                    
                    this.makeVioceAudioSameTime(recordTime/1000);
                    this.syncTimeAxis.StartTime.setMilliseconds(this.syncTimeAxis.StartTime.getMilliseconds()-recordTime+this.syncTimeAxis.Time);
                }
                else
                {
                    //this.makeVioceAudioSameTime(this.syncTimeAxis.Time/1000);
                }
                
            }
            if (this.playSyncInfo.Play == true) 
            {
                if(!this.playSyncInfo.LastSendTime)
                {
                    this.playSyncInfo.LastSendTime = new Date();
                }
                else if(new Date() - this.playSyncInfo.LastSendTime > 3000)
                {
                    this.playSyncInfo.LastSendTime = new Date();
                    this.NoticePlayThink(this.playSyncInfo.ID,4,this.syncTimeAxis.Time);
                }
                var audio = $("#syncplayeraudio").find(">audio");
                if (audio.length > 0) {
                   if(Math.abs(audio[0].currentTime*1000-this.syncTimeAxis.Time)>300 && audio[0].duration-audio[0].currentTime>0.3)
                   {
                       //audio[0].currentTime=this.syncTimeAxis.Time/1000;
                       //console.log(Math.abs(audio[0].currentTime*1000-this.syncTimeAxis.Time));
                       this.syncTimeAxis.StartTime.setMilliseconds(this.syncTimeAxis.StartTime.getMilliseconds()-audio[0].currentTime*1000+this.syncTimeAxis.Time);
                       this.syncTimeAxis.Time=new Date()-this.syncTimeAxis.StartTime;
                   }
                }
                 //console.log(Math.abs(audio[0].currentTime*1000-this.syncTimeAxis.Time));
                 //console.log("A:"+this.syncTimeAxis.Time+","+audio[0].currentTime+","+audio[0].paused);
                //console.log("Time:"+this.syncTimeAxis.Time);
                this.playThinkPageAction(this.playSyncInfo.ID,this.syncTimeAxis.Time);
                // console.log("Total:"+this.playSyncInfo.Total);
                
                // console.log("this.totalTime:"+this.totalTime);
                
                if(this.playSyncInfo.Total>0 && this.playSyncInfo.Total<this.syncTimeAxis.Time)
                {
                    this.stopSyncAudio(null,true,true);
                    this.$Notice.success({
                        title: this.$t("Live.PlayEnd"),
                        desc: "",
                        duration: 2,
                        bottom: 60,
                        left: true
                    });
                }
            }
        },
        pauseSyncAudio(evt,power=false,iswait=false) {
            //console.log("pauseSyncAudio");
            if (!this.CanControl && !power) return;
            this.syncAndPlayText = "Paused";
            if (this.playSyncInfo.Play == true) {                
                this.playSyncInfo.Stat = 2;
                this.NoticePlayThink(this.playSyncInfo.ID,2);
                this.setMedia4PlayThink(false);
                if(!iswait)
                {
                    this.$emit("onPlaySyncPause");
                }
            } else {
                this.syncAudioStat = 0;
               
                if (this.syncRecorder) {
                    this.syncRecorder.stop();
                }
                this.$emit("onRecordSyncPause");
            }
            if(this.syncTimeAxis.Timer)
            {
                clearTimeout(this.syncTimeAxis.Timer);
                this.syncTimeAxis.Timer=null;                    
            }
            this.syncTimeAxis.PauseTime = new Date();
            this.pauseAudio();
            this.pauseVoice();
            $("#syncPlayerCtl-Pause").hide();
            $("#syncPlayerCtl-Play").show();
        },
        goSyncAudio(evt,power=false,iswait=false) {
            //console.log("goSyncAudio");
            
            if (!this.CanControl&& !power) return;

            if (this.playSyncInfo.Play == true) {
                if(this.playSyncInfo.Stat==0) return;
            }

            if (this.playSyncInfo.Play == true) {
                this.syncAndPlayText = "Playing";
                this.playSyncInfo.Stat = 1;
                this.NoticePlayThink(this.playSyncInfo.ID,3);
                this.setMedia4PlayThink(false);
                
            } else {
                this.syncAndPlayText = "Syncing";
                this.syncAudioStat = 1;
                if (this.syncRecorder) {
                    this.syncRecorder.start();
                }
                //this.$emit("onRecordSyncGo");
                //Record_changepage();
                
            }
            this.syncTimeAxis.DiffTime =new Date()-this.syncTimeAxis.PauseTime;                
            this.syncTimeAxis.StartTime.setMilliseconds(this.syncTimeAxis.StartTime.getMilliseconds()+this.syncTimeAxis.DiffTime);//getMilliseconds    setMilliseconds
            
            this.syncTimeAxis.PauseTime=null;
            if (this.playSyncInfo.Play == true) {
                if(!iswait)
                {
                    this.$emit("onPlaySyncGo",new Date()-this.syncTimeAxis.StartTime);
                }
            }
            else{
                this.$emit("onRecordSyncGo",new Date()-this.syncTimeAxis.StartTime);
            }
            this.syncTimeAxis.Timer=setInterval(()=>{
                this.onThinking();
            },this.playSyncInfo.Play == true?500:1000);
            this.goplayVoice();
            this.goplayAudio();
            $("#syncPlayerCtl-Pause").show();
            $("#syncPlayerCtl-Play").hide();
        },
        async stopSyncAudio(evt,power=false,playend=false) {
            if (!this.CanControl && !power) return;
            if (this.playSyncInfo.Play == true) {
                this.NoticePlayThink(this.playSyncInfo.ID,0);
                this.playSyncInfo.Stat = 0;
                this.stopSyncAction();
                this.stopAudio4Think();
                this.stopVoice();                
                this.setMedia4PlayThink(false);
                this.autoRecord("Enable");
                $("#syncplayer,#syncPlayerControls,#syncPlayerWrap").hide();
                this.$emit("onPlaySyncEnd",playend);
                

            } else {
                this.syncAudioStat = 0;
                this.syncAudioPlay=false;

                
                // var actionList =[];
                // if(this.$parent.getActionList)
                // {
                //     actionList = this.$parent.getActionList();
                // }
                // var syncEndResut = await this.noticeSyncEnd(this.lastSycnAudioItemID,new Date()-this.syncTimeAxis.StartTime,actionList.length);
                // if(syncEndResut==1)
                // {

                // }
                // else if(syncEndResut==0)
                // {
                //     //var postResult =await webapi.();
                // }

                // if(websocket) websocket.audiosync(0, this.lastSycnAudioItemID,new Date()-this.syncTimeAxis.StartTime,res=>{
                //     var strList=JSON.stringify(actionList);
                //     var ziplist=pako.gzip(strList,{to:'string'});



                // },actionList.length);

                
                
                
                // console.log(strList.length);
                // var ziplist=pako.gzip(strList,{to:'string'});
                // console.log(typeof(ziplist));
                // //console.log(ziplist);
                // console.log(ziplist.length);
                // var name="temp/"+GUID();
                // var blob = new Blob([ziplist], {type: "text/plain"});
                // this.$refs.uploadfile.UploadCloud(blob,name,async(guid,bucketInfo)=>{                    
                    
                // },()=>{
                //     //onCancel
                // },(process,guid)=>{
                //     console.log("process:",process);                    
                // },(retrycount)=>{
                //     //onError                    
                // });
                // return;

                this.ChangeStyle4Sync(false);
                this.stopAudio4Think();
                this.stopVoice();
                if (this.syncRecorder) {
                    this.uploadingSyncPercent=0;
                    this.uploadingSync = true;
                    this.syncRecorder.stop();
                    var nDuration=this.syncRecorder.getCurrentTime();
                    this.syncRecorder.getBlobData(data => {
                        this.uploadSyncRecordAudio(data,util.FormatMediaTime(Math.round(nDuration/1000),1),nDuration);
                        this.syncRecorder.clear();
                        this.syncRecorder.close();
                        this.syncRecorder=null;
                    });
                }
                this.$emit("onRecordSyncEnd",playend);
                $("#syncplayer,#syncPlayerControls,#syncPlayerWrap").hide();
            }
             if(this.syncTimeAxis.Timer)
            {
                clearTimeout(this.syncTimeAxis.Timer);
                this.syncTimeAxis.Timer=null;
            }
            this.playAudioCurrentTime = "0:00";
        },
        noticeSyncEnd(itemid,time,count){
            return new Promise((resolve, reject) =>
            {
                if(websocket) 
                {
                    websocket.audiosync(0, itemid,time,res=>{
                        resolve(1);

                    },count);
                    setTimeout(()=>{
                        resolve(0);
                    },10000);
                }
                else
                {
                    resolve(-1);
                }
            });
        },
        autoPause(){
            if(!this.playSyncInfo.Play) return;
            if(this.autoPausePlayer) return;
            if(this.playSyncInfo.Stat == 2) return;
            this.autoPausePlayer=true;
            this.pauseSyncAudio(null,true,true);
            $("#syncplaycontrols-pause").hide();
            $("#syncplaycontrols-loading").show();
            this.$emit("onPlaySyncAutoPause",true);
        },
        autoPlay(){
            if(!this.playSyncInfo.Play) return;
            if(!this.autoPausePlayer) return;
            this.$emit("onPlaySyncAutoPause",false);
            this.autoPausePlayer=false;
            $("#syncplaycontrols-loading").hide();
            $("#syncplaycontrols-pause").show();
            if(this.playSyncInfo.Stat == 1) return;
            this.goSyncAudio(null,true,true);
        },
        beforePlayVideo(){
            //console.log("beforePlayVideo");
            if(!this.syncAudioPlay && !this.playSyncInfo.Play) return;
            if(!$("#syncplayer").is(":visible")) return;
            if(this.autoPause4Video) return;
            this.autoPause4Video=true;
            $("#syncplayer").hide();
            this.pauseSyncAudio(null,true,true);

        },
        afterPlayVideo(){
            //console.log("afterPlayVideo");
            if(!this.syncAudioPlay && !this.playSyncInfo.Play) return;
            if(!this.autoPause4Video) return;
            this.autoPause4Video=false;
            $("#syncplayer").show();
            this.goSyncAudio(null,true,true);

        },
        onSyncplayerPlay(evt){
            $("#syncplaycontrols-play").hide();
            $("#syncplaycontrols-pause").show();
            this.goSyncAudio(evt);
        },
        onSyncplayerPause(evt){            
            $("#syncplaycontrols-pause").hide();
            $("#syncplaycontrols-play").show();
            this.pauseSyncAudio(evt);
        },
        onSyncplayerStop(evt){
            this.stopSyncAudio(evt);
        },
        async onPlayTimeChange(val)
        {
            //console.log("onPlayTimeChange:"+val);
            this.clearLocalAction();
            this.NoticePlayThink(this.playSyncInfo.ID,5,val);
            
            // var videoele = $("#videoplayerele")[0];
            // videoele.currentTime = val;   
            this.playSyncInfo.EndTime=0;
            this.currentPlayTime=val; 
            this.playAudioCurrentTime = util.FormatMediaTime(Math.round(val/ 1000));        

            if (this.isPlayingBeforeDrag==1)
            {
                //console.log(1546);
                //this.goSyncAudio();
                this.syncTimeAxis.StartTime.setMilliseconds(new Date().getMilliseconds()-val);
                this.playSyncInfo.StartTime=val;
                this.makeVioceAudioSameTime(val/1000);
                //$("#syncplaycontrols-pause").hide();
                //$("#syncplaycontrols-loading").show();
                //this.pauseSyncAudio(null,true,true);
                await this.proLoadThinkPageAction(this.playSyncInfo.ID);
                //this.goSyncAudio(null,true,true);
                //$("#syncplaycontrols-loading").hide();
                //$("#syncplaycontrols-pause").show();
                this.autoPlay();
                

            }
            else
            {
                //console.log(1572);
                this.syncTimeAxis.StartTime.setMilliseconds(new Date().getMilliseconds()-val);
                this.playSyncInfo.StartTime=val;
                this.makeVioceAudioSameTime(val/1000);
                var isplay=this.playSyncInfo.Stat==1;
                if(isplay)
                {
                    $("#syncplaycontrols-pause").hide();
                    this.pauseSyncAudio(null,true,true);
                }
                else
                {
                    $("#syncplaycontrols-play").hide();
                }
                
                $("#syncplaycontrols-loading").show();
                await this.proLoadThinkPageAction(this.playSyncInfo.ID);
                $("#syncplaycontrols-loading").hide();
                if(isplay)
                {
                    this.goSyncAudio(null,true,true);
                    $("#syncplaycontrols-pause").show();
                }
                else{
                    $("#syncplaycontrols-play").show();
                }
            }
            this.$emit("onPlaySyncTo",val, this.autoPausePlayer?false:this.playSyncInfo.Stat == 2);

            this.isPlayingBeforeDrag = -1;
            this.isChangeTimeEnd = true;
            setTimeout(() =>
            {
                this.isChangeTimeEnd = false;
            }, 100);
        },
        onPlayTimeChanging(val)
        {
            //console.log("onPlayTimeChanging:"+val);
            return;
            if (this.isNotTrigEvent == true || this.isChangeTimeEnd==true)
            {
                return;
            }
            //console.log("onPlayTimeChanging:"+val);
  
            if (!this.playSyncInfo.Stat != 2)
            {
                this.pauseSyncAudio();
                if (this.isPlayingBeforeDrag == -1) this.isPlayingBeforeDrag = 1;
            }
            else
            {
                if (this.isPlayingBeforeDrag == -1) this.isPlayingBeforeDrag = 0;
            }
            //videoele.currentTime = val;
            this.currentPlayTime=val;
            //this.syncTimeAxis.StartTime.setMilliseconds(new Date().getMilliseconds()-val);
            //this.makeVioceAudioSameTime(val/1000);
        },
        onPlayTimeDrag(val){

            //console.log("onPlayTimeDrag:"+val);
            
            //console.log("onPlayTimeDrag:"+val);
            this.playAudioCurrentTime = util.FormatMediaTime(Math.round(val/ 1000));
            if (this.playSyncInfo.Stat != 2)
            {
                //this.pauseSyncAudio();
                this.autoPause();
                if (this.isPlayingBeforeDrag == -1) this.isPlayingBeforeDrag = 1;
            }
            else
            {
                if (this.isPlayingBeforeDrag == -1) this.isPlayingBeforeDrag = 0;
            }
        },
        getAudioCurrentTime() {
            
            //for auto record
             if(this.autoRecordInfo.IsRecord==true && this.autoRecordInfo.Recorder!=null)
             {
                 return this.autoRecordInfo.Recorder.getCurrentTime();
             }
            //currentTime   duration
            if (this.syncAudioStat == 0) {
                return -1;
            }
            
            if(this.syncAudioStat == 1 && this.syncTimeAxis.StartTime)
            {
                return new Date()-this.syncTimeAxis.StartTime;
            }
            return -1;
        },
        uploadSyncRecordAudio(data,duration,syncDuration) {

            var servername=GUID()+".wav";
            var name=this.thinkInfo.PathInfo.Path+"/"+servername;
            var self=this;
            var isShowErrorConfirm=false;
            //console.log(name);
            this.$refs.uploadfile.UploadCloud(data,name,async(guid,bucketInfo)=>{
                this.uploadingSyncPercent=100;
                var obj = new Object();
                obj.LessonID =0;
                obj.DocItemID =this.thinkOnAttachmentID;
                //obj.AudioItemID =this.lastSycnAudioItemID;
                obj.BucketInfo=bucketInfo;
                obj.ActionBucketInfo=null;
                obj.Duration =duration;
                obj.SyncDuration=syncDuration;
                obj.FileName =servername;
                obj.FileID  =this.thinkInfo.PathInfo.FileID;
                obj.SoundtrackID =this.lastSycnAudioItemID;
                webapi.UploadSoundtrackNewFile(obj);
                webapi.notifyUploaded({Documents:[{Key:name,Bucket:bucketInfo}]});
                
            },()=>{
                //onCancel
            },(process,guid)=>{
                //console.log("process:",process,this.uploadingSyncPercent);
                this.uploadingSyncPercent= Math.min(Math.max(1,process),99);
            },(retrycount)=>{
                //onError
                if(isShowErrorConfirm) return;
                isShowErrorConfirm=true;
                self.$Modal.confirm({
                    zIndex:99999,
                    render: h => {
                        return h("Div", {domProps: {innerHTML: "网络慢.文档上传很慢,继续重新上传吗?"}});
                    },
                    onOk: () => {
                        isShowErrorConfirm=false;
                        self.uploadSyncRecordAudio(data,duration);
                    }
                });
            });

            return;
            var xhr = new XMLHttpRequest();
            xhr.onload = event => {
                var issuccess = false;
                try {
                    var res = JSON.parse(xhr.responseText);
                    if (res && res.RetCode == 0) {
                        issuccess = true;
                        webapi.UpdateSoundAudioAttachmentID(this.lastSycnAudioItemID,res.RetData.AttachmentID);                        
                    }
                } catch (ex) {}
                xhr.onload = null;
                xhr = null;
                //this.uploadingSync = false;
                if(issuccess)
                {
                    this.uploadingSyncPercent=100;
                }
                else
                {
                    this.$Message.error({content: 'Upload Sync Error!',duration: 0,closable: true})
                }
            };
            var title = auth.getUserName() +" " +new Date().Format("yyyy-MM-dd hh:mm:ss") +".wav";
            var url =GetAPIUrl() +"EventAttachment/UploadRecordedVoice4Web?Title=" +encodeURIComponent(base64encode(utf16to8(title))) +"&Description=RecordVoice";
            url += "&LessonID=" + 0;
            url += "&DocItemID=" + this.thinkOnAttachmentID;
            url += "&AudioItemID=" + this.lastSycnAudioItemID;

            var formdata = new FormData();
            formdata.append("file", data);
            xhr.open("POST", url, true);
            xhr.setRequestHeader("UserToken", auth.getUserToken());
            xhr.send(formdata);
            var uploadTimer= setInterval(()=>{
                
                if(this.uploadingSyncPercent>=90)
                {
                    clearTimeout(uploadTimer);
                }
                else
                {
                    this.uploadingSyncPercent+=10;
                }
            },200);
        },
        uploadSyncRecordAudioOK(){
            this.uploadingSync = false;
            var obj = new Object();
            obj.SoundtrackID=this.thinkInfo.ID;
            obj.Title=this.thinkInfo.Title;
            obj.IsPublic=this.thinkInfo.IsPublic?1:0;
            webapi.UpdateTitleAndVisibility(obj);

        },
        playSyncFromTeacher(obj) {
            if (obj.stat == 1) {
                //play
                //this.playAudio(obj.url);
                this.playThinkAction(obj.soundtrackId);
                this.playSyncInfo.Stat = 1;
            } else if (obj.stat == 2) {
                //pause
               this.pauseSyncAudio(null,true);
            } else if (obj.stat == 3) {
                //resume
                this.goSyncAudio(null,true);
            } else if (obj.stat == 0) {
                //stop
                this.stopSyncAudio(null,true);
            } else if (obj.stat == 4) {
                //playing
                this.makeVioceAudioSameTime(obj.time / 1000);
            }
            else if (obj.stat == 5) {
                this.GoToTime(obj.time);
            }
        },
        async preLoadThinkInfo(id){
            if(this.preLoadThink!=null && this.preLoadThink.SoundtrackID==id && this.playSyncInfo.StartTime==0)
            {
                return true;
            }
            this.preLoadThink = await webapi.GetSoundtrack(id);
            this.clearLocalAction();
            await this.proLoadThinkPageAction(id); 
            return false;
        },
        async playThinkAction(id) {
            
            $("#syncplaycontrols-play").hide();
            $("#syncplaycontrols-pause").show();
            this.currentPlayTime=0;
            $("#syncplayer,#syncPlayerControls").show();

            //d.FileType ItemID  AttachmentUrl

            var isload=false;
            if(this.preLoadThink!=null && this.preLoadThink.SoundtrackID==id)
            {
                isload =  true;
            }

            

            this.syncAndPlayText = "Playing";
            $("#syncPlayerCtl-Pause").show();
            $("#syncPlayerCtl-Play").hide();
           
            this.NoticePlayThink(id, 1);
            var lastPlayingTime = new Date();
            var res =null;
            if(isload)
            {
                this.playSyncInfo.Play=true;//{Play: true,NeedPaly: -1,StartTime: 0,EndTime: 0,ToPlayList: [],Url: "",Stat: 1,ID:id,Total:0};
                this.playSyncInfo.NeedPaly=-1;
                this.playSyncInfo.Stat=1;
                this.playSyncInfo.ID=id;
                this.playSyncInfo.Total=0;                
                res=this.preLoadThink;
            }
            else
            {
                this.playSyncInfo = {Play: true,NeedPaly: -1,StartTime: 0,EndTime: 0,ToPlayList: [],Url: "",Stat: 1,ID:id,Total:0};
                this.clearLocalAction();
                res = await webapi.GetSoundtrack(id);
            }
            

            this.totalTime=res.Duration;
            var newAudioUrl="";
            var selectedAudioUrl="";
            var backgroudMusicUrl="";
            if(!isload)
            {
                if (res.NewAudioInfo && res.NewAudioInfo.AttachmentUrl) {
                    $("#livePanelSyncCtl-Mic").show();
                    newAudioUrl = await util.ConvertToNewUrl(res.NewAudioInfo.AttachmentUrl);                        
                    
                } else {
                    $("#livePanelSyncCtl-Mic").hide();
                    if(res.SelectedAudioInfo && res.EnableSelectVoice==1)
                    {
                        selectedAudioUrl = await util.ConvertToNewUrl(res.SelectedAudioInfo.AttachmentUrl);                           
                    }
                }
                if(res.BackgroudMusicInfo && res.EnableBackgroud==1)
                {
                    backgroudMusicUrl = await util.ConvertToNewUrl(res.BackgroudMusicInfo.AttachmentUrl);                       
                }   
            }                 
            this.playSyncInfo.Total=res.Duration;                    
            this.syncTimeAxis.PauseTime = null;
            this.syncTimeAxis.DiffTime = 0;
            this.syncTimeAxis.Time = 0;
            this.syncRecorder=null;
            if(!isload)
            {
                await this.proLoadThinkPageAction(id); 
            }
            this.$emit("onPlaySyncStart", "");
            this.NoticePlayThink(id,1);
            this.setMedia4PlayThink(true);
            this.syncTimeAxis.StartTime = new Date();
            
            if(selectedAudioUrl!="")
            {
                this.playAudio(selectedAudioUrl,()=>{
                        //on end
                        //this.stopSyncAudio(null);
                        // Context.$Notice.success({
                        //     title: res.Title + " play end!",
                        //     desc: "",
                        //     duration: 4,
                        //     bottom: 60,
                        //     left: true
                        // });
                    },(time)=>{
                        //on playing
                        this.setplayAudioVolume(0.3);
                    },false);
            }
            if(backgroudMusicUrl!="")
            {
                    this.playVoice(backgroudMusicUrl, () => {
                    //play voice end
                },true);
                setTimeout(()=>{
                    this.setplayVoiceVolume(0.3);
                },1500);
            }
            if(newAudioUrl!="")
            {
                this.playAudio(newAudioUrl,()=>{

                },(time)=>{
                    //on playing
                    
                },false);
            }  
            this.syncTimeAxis.Timer=setInterval(()=>{
                this.onThinking();
            },500);
            this.onThinking();             
             
            this.autoRecord("Disable");
            
        },
        ChangeStyle4Sync(isstart) {
            if (isstart) {
                // $("#livePanelTopCtlWrap").hide();
                // $("#liveSyncCtlWrap").show();
                
            } else {
                // $("#livePanelTopCtlWrap").show();
                // $("#liveSyncCtlWrap").hide();                
            }
        },
        stopSyncAction() {

            AutoPlayDocument(false, 5);

            this.playSyncInfo = {
                Play: false,
                NeedPaly: -1,
                StartTime: 0,
                EndTime: 0,
                ToPlayList: [],
                Url: "",
                Stat: 0
            };
            //this.ChangeStyle4Sync(false);
        },
        playThinkPageAction(id, time) {
            //loger.log("playSyncPageAction", lessonid, itemid, audioid, time);
            if(time<500)
            {
                time=0;
            }
            if (this.playSyncInfo.NeedPaly == 0) {
                return;
            }
            if (this.playSyncInfo.EndTime - time < 8000) {
                var isfirst = false;
                var dtstart = null;
                if (this.playSyncInfo.EndTime == 0) {
                    isfirst = true;
                    dtstart = new Date();
                    this.playSyncInfo.StartTime = time;
                } else {
                    this.playLocalAction(time);
                    this.playSyncInfo.StartTime = this.playSyncInfo.EndTime;
                }
                
                this.playSyncInfo.EndTime = this.playSyncInfo.StartTime + 20000;
                webapi.GetSoundtrackActions(id,this.playSyncInfo.StartTime,this.playSyncInfo.EndTime)
                    .then(res => {
                        if (res.Synced == 1) {
                            this.playSyncInfo.NeedPaly = 1;

                        } else if (res.Synced == 0) {
                            this.playSyncInfo.NeedPaly = 0;
                            //AutoPlayDocument(true, 5);
                            if(time==0)
                            {
                                this.$Message.error({content:'该音想无动作!',duration: 5});
                            }
                        }
                        for (var a of res.SoundtackActions) {
                            this.playSyncInfo.ToPlayList.push({
                                time: a.Time,
                                data: utf8to16(base64decode(a.Data))
                            });
                        }
                        if (isfirst == true) {
                            this.playLocalAction(time + (new Date() - dtstart));
                        }
                    });
            } else {
                this.playLocalAction(time);
            }
        },
        async proLoadThinkPageAction(id)
        {
            this.playSyncInfo.EndTime = this.playSyncInfo.StartTime + 20000;
            var res = await webapi.GetSoundtrackActions(id,this.playSyncInfo.StartTime,this.playSyncInfo.EndTime);
            if (res.Synced == 1) {
                this.playSyncInfo.NeedPaly = 1;
            } else if (res.Synced == 0) {
                this.playSyncInfo.NeedPaly = 0;
                //AutoPlayDocument(true, 5);
            }
            for (var a of res.SoundtackActions) {
                this.playSyncInfo.ToPlayList.push({
                    time: a.Time,
                    data: utf8to16(base64decode(a.Data))
                });
            }
            return true;
        },
        playLocalAction(time) {
            //console.log("playLocalAction:"+time);
            for (var i = 0, j = this.playSyncInfo.ToPlayList.length;i < j;i++) {
                if (this.playSyncInfo.ToPlayList[i].time - time<=-600) {
                    this.playSyncInfo.ToPlayList.splice(i, 1);
                    i--;
                    j--;
                }
                else if (this.playSyncInfo.ToPlayList[i].time - time<=0 && this.playSyncInfo.ToPlayList[i].time - time>-600) {
                    this.PlayActionByTxt(this.playSyncInfo.ToPlayList[i].data);
                    this.playSyncInfo.ToPlayList.splice(i, 1);
                    i--;
                    j--;
                } else if (this.playSyncInfo.ToPlayList[i].time - time <= 500) {
                    setTimeoutEx(
                        this.PlayActionByTxt,
                        this.playSyncInfo.ToPlayList[i].time - time,
                        this.playSyncInfo.ToPlayList[i].data
                    );
                    this.playSyncInfo.ToPlayList.splice(i, 1);
                    i--;
                    j--;
                } else {
                    //play this later
                }
            }
        },
        clearLocalAction(){
            this.playSyncInfo.ToPlayList=[];
            this.playSyncInfo.StartTime=0;
            this.playSyncInfo.EndTime=0;

        },
        async autoRecord(action,callback,afterupload){
            //autoRecordInfo:{IsRecord:false,Recorder:null,SoundIds:[],AttachmentID:0}       
            return;
            if (this.isLessonStart == false) {                
                return;
            }
            console.log("autoRecord:"+action);
            if(action=="Start" || action=="Enable")
            {
                if(!this.showUploadFile)
                {
                    return;
                }
                if(action=="Enable")
                {
                    $("#liveRecordLessonCtl").removeClass("disable");
                    if(this.autoRecordInfo.LastRecordStat==false)
                    {
                        return;
                    }
                }
                this.autoRecordInfo.LastRecordStat=true;
                if(this.autoRecordInfo.IsRecord==true)
                {
                    return;
                }
                
                if(this.autoRecordInfo.IsRecord==false && this.autoRecordInfo.Recorder!=null)
                {
                    //$("#liveRecordLessonCtl").show();//#liveRecordTip,
                    var img=$("#liveRecordLessonCtl").find("IMG");
                    img.attr("title","Recording");
                    img.attr("src",img.attr("src").replace("autorecord_start.svg","autorecord_pause.svg"));
                    this.autoRecordInfo.IsRecord=true;
                    this.autoRecordInfo.Recorder.start();
                    //Record_changepage();
                    return
                }
                var selectfile=this.getSelectFile();
                if(selectfile==null)
                {
                    return;
                }
                //$("#liveRecordLessonCtl").show();//#liveRecordTip,
                var img=$("#liveRecordLessonCtl").find("IMG");
                img.attr("title","Recording");
                img.attr("src",img.attr("src").replace("autorecord_start.svg","autorecord_pause.svg"));
                //console.log(selectfile);
                 var info = new Object();
                info.AttachmentID=parseInt(selectfile.atmid);
                info.Title=auth.getUserName()+" - " + (new Date()).Format("yyyy-MM-dd hh:mm:ss");
                info.EnableBackgroud=0;
                info.EnableSelectVoice=0;
                info.EnableRecordNewVoice=1;
                info.Type=1;
                info.RecordingID=this.autoRecordInfo.RecordID;

                var res = await webapi.CreateSoundtrack(info);
                var trackid=res.RetData.SoundtrackID;
                websocket.audiosync(1, trackid);

                this.autoRecordInfo.IsRecord=true;
                this.autoRecordInfo.AttachmentID=info.AttachmentID;
                this.autoRecordInfo.SoundIds.push(trackid);
                this.autoRecordInfo.Recorder= this.getMediaView().StartRecord();
                
                //Record_changepage();
                //Record_view();
            }
            else if(action=="Pause" || action=="Disable")
            {
                if(action=="Disable")
                {
                    this.autoRecordInfo.LastRecordStat=this.autoRecordInfo.IsRecord;
                }
                if(this.autoRecordInfo.IsRecord==true && this.autoRecordInfo.Recorder!=null)
                {
                    this.autoRecordInfo.Recorder.stop();
                }
                this.autoRecordInfo.IsRecord=false;
                //$("#liveRecordTip").hide();
                if(action=="Disable")
                {
                    $("#liveRecordLessonCtl").addClass("disable");
                    $("#liveRecordLessonCtl").find("IMG").attr("title","disable");
                }
                else
                {
                    var img=$("#liveRecordLessonCtl").find("IMG");
                    img.attr("title","Paused");
                    img.attr("src",img.attr("src").replace("autorecord_pause.svg","autorecord_start.svg"));
                }
            }
            else if(action=="Resume")
            {
                if(this.autoRecordInfo.IsRecord==true && this.autoRecordInfo.Recorder!=null)
                {
                    this.autoRecordInfo.Recorder.start();
                }
                this.autoRecordInfo.IsRecord=true;
            }
            else if(action=="End")
            {
                this.autoRecordInfo.LastRecordStat=this.autoRecordInfo.IsRecord;
                if(this.autoRecordInfo.Recorder!=null)
                {
                    if(this.autoRecordInfo.IsRecord==true)
                    {
                        this.autoRecordInfo.IsRecord=false;
                        this.autoRecordInfo.Recorder.stop();
                    }
                    websocket.audiosync(0, this.autoRecordInfo.SoundIds[this.autoRecordInfo.SoundIds.length-1],this.autoRecordInfo.Recorder.getCurrentTime());
                    var lessonid=this.GetLessonID();
                    this.autoRecordInfo.Recorder.getData(data => {
                            this.autoRecordInfo.Recorder.clear();
                            this.autoRecordInfo.Recorder=null;
                            try
                            {
                            this.getMediaView().StopRecord(); 
                            }
                            catch(ex){}
                            this.uploadAutoRecordAudio(data,this.autoRecordInfo.AttachmentID,this.autoRecordInfo.SoundIds[this.autoRecordInfo.SoundIds.length-1],()=>{
                                if(afterupload)afterupload();
                            },lessonid,this.autoRecordInfo.RecordID);
                            if(callback)callback();
                        });
                    this.autoRecordInfo.IsRecord=false;
                    var img=$("#liveRecordLessonCtl").find("IMG");
                    img.attr("src",img.attr("src").replace("autorecord_pause.svg","autorecord_start.svg"));
                    return;
                }
                this.autoRecordInfo.IsRecord=false;
                //$("#liveRecordLessonCtl").hide();//#liveRecordTip,
                var img=$("#liveRecordLessonCtl").find("IMG");
                img.attr("src",img.attr("src").replace("autorecord_pause.svg","autorecord_start.svg"));
                if(callback)callback();
                
            }
        },
        PlayActionByTxt(data)
        {
            if(this.playSyncInfo.Stat != 1) return;
            this.$emit("onPlayBaseAction", data);
        },
        async uploadVideo2SaveFileInputChange() {
            //loger.log("uploadVideo2SaveFileInputChange");
            var input = $("#uploadVideo2SaveFileInput")[0];
            //alert(input.files.length);
            if (input.files.length == 0) {
                return;
            }
            var file = input.files[0];
            var filename = file.name;
            var md5= await util.GetMD5(file);
            var resp = await webapi.UploadFile2FavWithHash(-1,-1,filename,md5);
            
            if (resp.RetCode == 0) {
                //ok
                this.onVideoSearch();
                $("#uploadVideo2SaveFileInput").val("");
            } else if (resp.RetCode == -6002) {
                //此哈希值对应的文件不存在，请直接上传
                var ext = filename.substr(filename.lastIndexOf(".")).toLowerCase();     
                var servername=GUID()+""+ext;
                var name=resp.RetData.Path+"/"+servername;


                var url =GetAPIUrl() +"FavoriteAttachment/AddNewFavoriteMultipart?Description=&Hash=" +md5;
                this.$refs.uploadfile.UploadCloud(file,name,async(guid,convertParam) => {
                        
                        $("#uploadVideo2SaveFileInput").val("");
                        await this.uploadNewFile(filename,servername,resp.RetData.FileID,1,md5);
                        this.onVideoSearch();

                    },
                    () => {
                        $("#uploadVideo2SaveFileInput").val("");
                        //oncancel
                    }
                );
            } else if (resp.RetCode == -6003) {
                //文件列表中已经存在文件名和哈希值均相同的文件，请不要重复上传
                this.$Message.error({
                    content: this.$t("Live.FileAlreadyinList"),
                    duration: 0,
                    closable: true
                });
                $("#uploadVideo2SaveFileInput").val("");
            } else {
                $("#uploadVideo2SaveFileInput").val("");
            }
            
            
        },
        async uploadNewFile(filename,servername,fileid,pagecount,md5){
            var newfile= new Object();
            newfile.Title =filename;
            newfile.SchoolID =-1;
            newfile.Description =filename;
            newfile.Hash =md5;
            newfile.FileID=fileid;
            newfile.PageCount =pagecount;
            newfile.FileName=servername.substr(0,servername.lastIndexOf("."));
            var newfileresult =await webapi.UploadFavNewFile(newfile);
            return newfileresult;
        },     
     
    },
    computed: {
        thinkBtnText()
        {
            if(this.thinkInfo.EnableRecord==true)
            {
                return this.$t("Live.RecordSync");
            }
            else if(this.thinkInfo.EnableRecord==false && this.thinkInfo.EnableSelectVoice==false && this.thinkInfo.EnableBackGround==false)
            {
                return this.$t("Live.RecordStart");
            }
            else
            {
                return this.$t("Live.RecordOnlySync");
            }
        },
        thinkBtnDisable()
        {
            if(this.thinkInfo.EnableRecord==false && this.thinkInfo.EnableSelectVoice==false && this.thinkInfo.EnableBackGround==false)
            {
                return true;
            }
            return false;
        },
        getShowTotalTime()
        {
            var hour = Math.floor(this.totalTime/1000 / 3600);
            var min = Math.floor((this.totalTime/1000 % 3600) / 60);
            var sec = Math.round(this.totalTime/1000 % 60);
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
        widthStyle(){
            if(this.Width && this.Width!="")
            {
                return "width:"+this.Width;
            }
            return "";
        }
    }
  }
</script>
