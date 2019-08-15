<template>
    <div id="lessonplayer" class="lessonplayer" >
        <div id="lessonplayerWrap" class="lessonplayerWrap" style="right:50%;text-align:center;display:none;"
        >
            <div class="lessonplayerCtl-wrap">
                <span
                    style="padding:5px;font-size:18px;padding-right: 10px;margin-right: 10px;border-right: solid 1px #ccc;width: 90px;display: inline-block;"
                >
                    {{syncAndPlayText}}
                    <audio id="lessonplayersyncaudio" autoplay style="width:0px;height:0px;"></audio>
                </span>
                <span title="Stop" style="padding:5px; cursor:pointer;" @click="stopSyncAudio">
                    <Icon type="stop" size="20"></Icon>
                </span>
                <span
                    title="Pause"
                    id="lessonplayerCtl-Pause"
                    style="padding:5px;cursor:pointer;"
                    @click="pauseSyncAudio"
                >
                    <Icon type="pause" size="20"></Icon>
                </span>
                <span
                    title="Play"
                    id="lessonplayerCtl-Play"
                    style="padding:5px;cursor:pointer;display:none;"
                    @click="goSyncAudio"
                >
                    <Icon type="play" size="20"></Icon>
                </span>
                <span
                    title="Recording Voice"
                    id="lessonplayerCtl-Mic"
                    style="padding:5px;cursor:pointer;display:none;"
                >
                    <Icon type="mic-a" size="20"></Icon>
                </span>
                <span style="padding:5px;font-size:18px;">{{playAudioCurrentTime}}</span>
            </div>
        </div>
        <div id="lessonplayerControls" class="lessonplaycontrols" style="display:none;" :style="widthStyle">
            <div id="lessonplaycontrols-play"  @click="onLessonPlayerPlay" style="width:50px;padding-left:25px;display:none;cursor:pointer;"><Icon size="22" type="play"></Icon></div>
            <div id="lessonplaycontrols-pause" @click="onLessonPlayerPause" style="width:50px;padding-left:25px;cursor:pointer;"><Icon size="22" type="pause"></Icon></div>
            <div id="lessonplaycontrols-stop" @click="onLessonPlayerStop" style="width:25px;cursor:pointer;"><Icon size="22" type="stop"></Icon></div>
            <div style="width:calc(100% - 175px);padding:0px 5px 0px 10px;">
                <div style="margin-top:-2px;">
                 <Slider v-model="currentPlayTime" @on-change="onPlayTimeChange" @on-input="onPlayTimeChanging" @on-drag="onPlayTimeDrag" :max="totalTime" show-tip="never"></Slider>
                </div>
            </div>
            <div style="width:100px;font-size:16px;line-height:32px;text-align:left;">{{playAudioCurrentTime}}/{{getShowTotalTime}}</div>
        </div>
        <div id="lessonplayeraudio" style="width:0px; height:0px;position:absolute;left:-1000px;"></div>
        <div id="lessonplayervoice" style="width:0px; height:0px;position:absolute;left:-1000px;" ></div>
        <upload-file preid="lessonplayer" ref="uploadfile"></upload-file>
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
                <Button @click="uploadSyncRecordAudioOK" type="primary" style="width:110px;margin-righ:15px;">{{$t("Base.OK")}}</Button>
                <Button @click="uploadingSync=false;" type="ghost" style="width:110px;margin-left:15px;">{{$t("Base.Cancel")}}</Button>
            </div>
        </Modal>
        <Modal title="UploadProcess"
           v-model="uploadRecord.showUploadRecordProcess"
           :closable="false"
           class-name="hideModalFooter hideModalHead"
           :mask-closable="false"
           width="500" style="z-index:50000;position: absolute;">
        <div style="font-size:16px; font-weight:bold;text-align:center;">Uploading</div>
        <div style="font-size:16px; margin-top:20px;text-align:center;">
            <Icon type="ios-videocam"></Icon>
            <span style="padding-left:5px;">{{uploadRecord.uploadFileName}}</span>
        </div>
        <div style="height:160px; padding-top:20px; text-align:center;">
            <i-circle :percent="uploadRecord.uploadPercent">
            <Icon v-if="uploadRecord.uploadPercent == 100" type="ios-checkmark-empty" size="60" style="color:#5cb85c"></Icon>
            <span v-else style="font-size:24px">{{ uploadRecord.uploadPercent }}%</span>
            </i-circle>
        </div>
        </Modal>
    </div>
</template>
<style lang="scss">
    $images-root: "../../../static/images/";
    .lessonplayer {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 21;
        display:none;

        .lessonplayerWrap
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
        .lessonplayerCtl-wrap {
            text-align: center;
            display: inline-block;
            border: solid 1px #ccc;
            padding: 5px;
            border-radius: 10px;
            background-color: white;
        }
        .lessonplaycontrols
        {
            text-align: center;
            display: flex;
            bottom: 0px;
            position: fixed;
            width: 100%;
            height: 40px;
            align-items:center;
        }
        .lessonplaycontrols >div
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
            autoRecordInfo:{IsRecord:false,Recorder:null,SoundIds:[],AttachmentID:0,RecordID:"",LastRecordStat:false,StartTime:null,PauseTime:null,Time:null,Timer:null,AudioID:0},
            uploadRecord:{showUploadRecordProcess:false,uploadPercent:0,uploadFileName:""},
            currentPlayTime: 0,
            totalTime: 0,
            isPlaying: false,
            isPlayingBeforeDrag: -1,
            isNotTrigEvent: false,
            isChangeTimeEnd: true,
            videoPlayTimer: null,
            speakerList: [],
            preLoadAudioUrl:"",
            PreLoadVoiceUrl:""
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
                alert("no file");
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
                alert("no file");
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
            $("#lessonplayeraudio").empty();           
            this.preLoadAudioUrl=url;
            var html ='<audio id="lessonplayeraudioele" preload="load" src="' +url +'" ></audio>';            
            $("#lessonplayeraudio").append(html);
            this.$emit("onPreLoadAudioEnd",url);
        },
        async preLoadAudio(url)
        {
            if(this.preLoadAudioUrl==url) return;
            $("#lessonplayeraudio").empty(); 
            this.downloadAudio(url,(data)=>{
                var windowURL = window.URL || window.webkitURL;               
                var src=windowURL.createObjectURL(data);
                this.preLoadAudioUrl=url;
                // console.log(windowURL);
                // console.log(data);
                // console.log(src);
                var html ='<audio id="lessonplayeraudioele" preload="load" src="' +src +'" ></audio>';            
                $("#lessonplayeraudio").append(html);
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
            var audio = $("#lessonplayeraudio").find(">audio");
            if (audio.length > 0 && this.preLoadAudioUrl!="") {
                audio[0].currentTime=0;
                audio[0].play();
            }
        },
        playAudio(url, onEnd, onPlay, isloop = true) {
            //lessonplayeraudio
            
            if (url != "")
            {
                if($("#lessonplayeraudio").find("audio").length==0 ||this.preLoadAudioUrl!=url)
                {
                    $("#lessonplayeraudio").empty();
                    var html ='<audio id="lessonplayeraudioele" preload="load" src="' +url +'"  ' +(isloop ? ' loop="loop"' : "") +"></audio>";
                    $("#lessonplayeraudio").append(html);
                    $("#lessonplayeraudio").find("audio")[0].play();
                }
                else
                {
                     var audio = $("#lessonplayeraudio").find(">audio")[0];
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
                //     var eaudio = $("#lessonplayeraudio").find("audio")[0];
                //     if (eaudio && eaudio.setSinkId) {
                //         eaudio.setSinkId(speaker);
                //     }
                // }
                var eaudio = $("#lessonplayeraudio").find("audio")[0];
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
            var audio = $("#lessonplayeraudio").find(">audio");
            if (audio.length > 0) {
                audio[0].pause();
            }
            if (this.playSyncInfo.NeedPaly == 0) {
                AutoPlayDocument(false, 5);
            }
        },
        goplayAudio() {
            var audio = $("#lessonplayeraudio").find(">audio");
            if (audio.length > 0) {
                audio[0].play();
            }
            
            if (this.playSyncInfo.NeedPaly == 0) {
                AutoPlayDocument(true, 5);
            }
        },
        preLoadVoiceSync(url)
        {
            if(this.PreLoadVoiceUrl==url) return;
            $("#lessonplayervoice").empty();           
            this.PreLoadVoiceUrl=url;
            var html ='<audio id="lessonplayervoiceele" preload="load" src="' +url +'" ></audio>';            
            $("#lessonplayervoice").append(html);
            this.$emit("onPreLoadVoiceEnd",url);
        },
        preLoadVoice(url)
        {
            if(this.PreLoadVoiceUrl==url) return;
            $("#lessonplayervoice").empty(); 
            this.downloadAudio(url,(data)=>{
                var windowURL = window.URL || window.webkitURL;
                var src=windowURL.createObjectURL(data);
                this.PreLoadVoiceUrl=url;
                var html ='<audio id="lessonplayervoiceele" preload="load" src="' +src +'" ></audio>';            
                $("#lessonplayervoice").append(html);
                this.$emit("onPreLoadVoiceEnd",url);
            }); 
        },
        playPreloadVoice(){
            var audio = $("#lessonplayervoice").find(">audio");
            if (audio.length > 0 && this.PreLoadVoiceUrl!="") {
                audio[0].currentTime=0;
                audio[0].play();
            }
        },
        playVoice(url, onEnd,isloop = false) {
            //lessonplayervoice            
            if (url != "") 
            {
                if($("#lessonplayervoice").find("audio").length==0 || $("#lessonplayervoice").find("audio").attr("src")!=url)
                {
                    $("#lessonplayervoice").empty();
                    var html ='<audio src="' + url + '" '+ (isloop ? ' loop="loop"' : "") +'></audio>';
                    $("#lessonplayervoice").append(html);
                    $("#lessonplayervoice").find("audio")[0].play();
                }
                else
                {
                     var audio = $("#lessonplayervoice").find(">audio")[0];
                     if(audio.paused)
                     {
                         audio.play();
                     }
                }
                
                var speaker = localStorage.getItem("DefaultSpeaker");
                if (speaker && speaker != "") {
                    var eaudio = $("#lessonplayervoice").find("audio")[0];
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
            var audio = $("#lessonplayervoice").find(">audio");
            if (audio.length > 0) {
                audio[0].pause();
            }
        },
        goplayVoice() {
            var audio = $("#lessonplayervoice").find(">audio");
            if (audio.length > 0) {
                audio[0].play();
            }
        },
        stopVoice() {
            var audio = $("#lessonplayervoice").find(">audio");
            if (audio.length > 0) {
                audio[0].pause();
            }
            //$("#lessonplayervoice").empty();
        },
        stopAudio4Think() {
            //loger.log("stopAudio()");
            //this.selectAudioUrl = "";
            var audio = $("#lessonplayeraudio").find(">audio");
            if (audio.length > 0) {
                audio[0].pause();
            }
            //$("#lessonplayeraudio").empty();           
        },
        makeVioceAudioSameTime(time = 0, canSetTime=true) {
            var voice = $("#lessonplayervoice").find(">audio");
            var audio = $("#lessonplayeraudio").find(">audio");
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
            var audio = $("#lessonplayeraudio").find(">audio");
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
            //lessonplayeraudio
            $("#lessonplayeraudio").empty();
            if (url != "") {
                var html ='<audio src="' +url +'" autoplay="autoplay" ' +(isloop ? ' loop="loop"' : "") +"></audio>";
                $("#lessonplayeraudio").append(html);
            }
            if (url != "") {
                var speaker = localStorage.getItem("DefaultSpeaker");
                if (speaker && speaker != "") {
                    var eaudio = $("#lessonplayeraudio").find("audio")[0];
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
            
            $("#lessonplayer,#lessonplayerWrap").show();
            this.ChangeStyle4Sync(true);
            this.lastSycnAudioItemID = id;
            this.syncAudioStat = 1;
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
            
            //console.log("K:"+this.syncTimeAxis.Time+","+$("#lessonplayeraudio").find(">audio")[0].currentTime);
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
                var audio = $("#lessonplayeraudio").find(">audio");
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
                this.playThinkPageAction(this.playSyncInfo.ID,this.syncTimeAxis.Time);
                // console.log("Total:"+this.playSyncInfo.Total);
                // console.log("Time:"+this.syncTimeAxis.Time);
                // console.log("this.totalTime:"+this.totalTime);
                
                if(this.playSyncInfo.Total>0 && this.playSyncInfo.Total<this.syncTimeAxis.Time)
                {
                    this.stopSyncAudio(null,true,true);
                    this.$Notice.success({
                        title: "Play end!",
                        desc: "",
                        duration: 2,
                        bottom: 60,
                        left: true
                    });
                }
            }
        },
        pauseSyncAudio(evt,power=false) {
            //console.log("pauseSyncAudio");
            if (!this.CanControl && !power) return;
            this.syncAndPlayText = "Paused";
            if (this.playSyncInfo.Play == true) {                
                this.playSyncInfo.Stat = 2;
                this.NoticePlayThink(this.playSyncInfo.ID,2);
                this.setMedia4PlayThink(false);
                this.$emit("onPlaySyncPause");
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
            $("#lessonplayerCtl-Pause").hide();
            $("#lessonplayerCtl-Play").show();
        },
        goSyncAudio(evt,power=false) {
            //console.log("goSyncAudio");
            if (!this.CanControl&& !power) return;
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
                this.$emit("onPlaySyncGo",new Date()-this.syncTimeAxis.StartTime);
            }
            else{
                this.$emit("onRecordSyncGo",new Date()-this.syncTimeAxis.StartTime);
            }
            this.syncTimeAxis.Timer=setInterval(()=>{
                this.onThinking();
            },this.playSyncInfo.Play == true?500:1000);
            this.goplayVoice();
            this.goplayAudio();
            $("#lessonplayerCtl-Pause").show();
            $("#lessonplayerCtl-Play").hide();
        },
        stopSyncAudio(evt,power=false,playend=false) {
            if (!this.CanControl && !power) return;
            if (this.playSyncInfo.Play == true) {
                this.NoticePlayThink(this.playSyncInfo.ID,0);
                this.playSyncInfo.Stat = 0;
                this.stopSyncAction();
                this.stopAudio4Think();
                this.stopVoice();                
                this.setMedia4PlayThink(false);
                this.autoRecord("Enable");
                $("#lessonplayer,#lessonplayerControls,#lessonplayerWrap").hide();
                this.$emit("onPlaySyncEnd",playend);
                

            } else {
                this.syncAudioStat = 0;

                //this.syncRecorder.stop();//lessonplayersyncaudio
                //this.syncRecorder.play(gid('lessonplayersyncaudio'));
                //this.syncRecorder.getData(base64 =>
                //{
                //  console.log(base64);
                //});

                websocket.audiosync(0, this.lastSycnAudioItemID,new Date()-this.syncTimeAxis.StartTime);
                this.ChangeStyle4Sync(false);
                this.stopAudio4Think();
                this.stopVoice();
                if (this.syncRecorder) {
                    this.uploadingSync = true;
                    this.syncRecorder.stop();
                    var nDuration=this.syncRecorder.getCurrentTime();
                    this.syncRecorder.getBlobData(data => {
                        this.uploadSyncRecordAudio(data,util.FormatMediaTime(Math.round(nDuration/1000),1));
                        this.syncRecorder.clear();
                        this.syncRecorder.close();
                        this.syncRecorder=null;
                    });
                }
                this.$emit("onRecordSyncEnd",playend);
                $("#lessonplayer,#lessonplayerControls,#lessonplayerWrap").hide();
            }
             if(this.syncTimeAxis.Timer)
            {
                clearTimeout(this.syncTimeAxis.Timer);
                this.syncTimeAxis.Timer=null;
            }
            this.playAudioCurrentTime = "0:00";
        },
        onLessonPlayerPlay(evt){
            $("#lessonplaycontrols-play").hide();
            $("#lessonplaycontrols-pause").show();
            this.goSyncAudio(evt);
        },
        onLessonPlayerPause(evt){            
            $("#lessonplaycontrols-pause").hide();
            $("#lessonplaycontrols-play").show();
            this.pauseSyncAudio(evt);
        },
        onLessonPlayerStop(evt){
            this.stopSyncAudio(evt);
        },
        onPlayTimeChange(val)
        {
            //console.log("onPlayTimeChange:"+val);
            this.clearLocalAction();
            this.NoticePlayThink(this.playSyncInfo.ID,5,val);
            this.$emit("onPlaySyncTo",val,this.playSyncInfo.Stat == 2);
            // var videoele = $("#videoplayerele")[0];
            // videoele.currentTime = val;   
            this.playSyncInfo.EndTime=0;
            this.currentPlayTime=val; 
            this.playAudioCurrentTime = util.FormatMediaTime(Math.round(val/ 1000));        

            if (this.isPlayingBeforeDrag==1)
            {
                this.goSyncAudio();
                this.syncTimeAxis.StartTime.setMilliseconds(new Date().getMilliseconds()-val);
                this.makeVioceAudioSameTime(val/1000);
            }
            else
            {
                this.makeVioceAudioSameTime(val/1000);
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

            console.log("onPlayTimeDrag:"+val);
            
            //console.log("onPlayTimeDrag:"+val);
            this.playAudioCurrentTime = util.FormatMediaTime(Math.round(val/ 1000));
            if (this.playSyncInfo.Stat != 2)
            {
                this.pauseSyncAudio();
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
        uploadSyncRecordAudio(data,duration) {

            var servername=GUID()+".wav";
            var name=this.thinkInfo.PathInfo.Path+"/"+servername;
            //console.log(name);
            this.$refs.uploadfile.UploadCloud(data,name,async (guid,bucketInfo)=>{
                this.uploadingSyncPercent=100;
                var obj = new Object();
                obj.LessonID =0;
                obj.DocItemID =this.thinkOnAttachmentID;
                //obj.AudioItemID =this.lastSycnAudioItemID;
                obj.BucketInfo=bucketInfo;
                obj.Duration =duration;
                obj.FileName =servername;
                obj.FileID  =this.thinkInfo.PathInfo.FileID;
                obj.SoundtrackID =this.lastSycnAudioItemID;
                webapi.UploadSoundtrackNewFile(obj);
                
            },()=>{},(process,guid)=>{
                //console.log("process:",process,this.uploadingSyncPercent);
                this.uploadingSyncPercent=Math.max(1,process);
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
                    this.$Message.error({
                        content: 'Upload Sync Error!',
                        duration: 0,
                        closable:true
                    });
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
        playThinkAction(id) {
            
            $("#lessonplaycontrols-play").hide();
            $("#lessonplaycontrols-pause").show();
            this.currentPlayTime=0;
            $("#lessonplayer,#lessonplayerControls").show();

            //d.FileType ItemID  AttachmentUrl
            this.playSyncInfo = {Play: true,NeedPaly: -1,StartTime: 0,EndTime: 0,ToPlayList: [],Url: url,Stat: 1,ID:id,Total:0};

            this.syncAndPlayText = "Playing";
            $("#lessonplayerCtl-Pause").show();
            $("#lessonplayerCtl-Play").hide();
           
            this.NoticePlayThink(id, 1);
            var lastPlayingTime = new Date();
            webapi.GetSoundtrack(id).then(res => {
                    this.totalTime=res.Duration;
                    if (res.NewAudioInfo && res.NewAudioInfo.AttachmentUrl) {
                        $("#livePanelSyncCtl-Mic").show();
                        util.ConvertToNewUrl(res.NewAudioInfo.AttachmentUrl,(newurl,success)=>{
                            this.playAudio(newurl,()=>{
                                //on end
                                //this.stopSyncAudio(null);
                                // this.$Notice.success({
                                //     title: res.Title + " play end!",
                                //     desc: "",
                                //     duration: 2,
                                //     bottom: 60,
                                //     left: true
                                // });

                            },(time)=>{
                                //on playing
                                
                            },false);
                        });
                    } else {
                        $("#livePanelSyncCtl-Mic").hide();
                        if(res.SelectedAudioInfo && res.EnableSelectVoice==1)
                        {
                            util.ConvertToNewUrl(res.SelectedAudioInfo.AttachmentUrl,(newurl,success)=>{
                                this.playAudio(newurl,()=>{
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
                            });
                        }
                    }
                    if(res.BackgroudMusicInfo && res.EnableBackgroud==1)
                    {
                        util.ConvertToNewUrl(res.BackgroudMusicInfo.AttachmentUrl,(newurl,success)=>{
                            this.playVoice(newurl, () => {
                            //play voice end
                            },true);
                            setTimeout(()=>{
                                this.setplayVoiceVolume(0.3);
                            },1500);
                        });
                    }
                    this.syncTimeAxis.Timer=setInterval(()=>{
                        this.onThinking();
                    },500);
                    this.playSyncInfo.Total=res.Duration;
                    this.syncTimeAxis.StartTime = new Date();
                    this.syncTimeAxis.PauseTime = null;
                    this.syncTimeAxis.DiffTime = 0;
                    this.syncTimeAxis.Time = 0;
                    this.syncRecorder=null;
                    this.$emit("onPlaySyncStart", "");
                    this.NoticePlayThink(id,1);
                    this.setMedia4PlayThink(true);

                });
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
            if(time<1000)
            {
                time=0;
            }
            if (this.playSyncInfo.NeedPaly == 0) {
                return;
            }
            if (this.playSyncInfo.EndTime - time < 500) {
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
                            AutoPlayDocument(true, 5);
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
        playLocalAction(time) {
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
        uploadAutoRecordAudio(data,attachmentid,soundid,afterupload,lessonid,recordid,duration="",merge=false) {
            //console.log("uploadAutoRecordAudio");
            var servername=GUID()+".wav";
            var name=this.autoRecordInfo.PathInfo.Path+"/"+servername;
            //console.log(name);
            this.$refs.uploadfile.UploadCloud(data,name,async (guid,bucketInfo)=>{
                //console.log("upload wav:"+soundid);
                if(merge)
                {
                    this.uploadRecord.uploadPercent=100;
                }
                var obj = new Object();
                obj.LessonID =lessonid;
                obj.DocItemID =attachmentid;
                //obj.AudioItemID =this.lastSycnAudioItemID;
                obj.BucketInfo =bucketInfo;
                obj.Duration =duration;
                obj.FileName =servername;
                obj.FileID  =this.autoRecordInfo.PathInfo.FileID;
                obj.SoundtrackID =soundid;
                webapi.UploadSoundtrackNewFile(obj).then(()=>{                    
                    if(merge)
                    {
                        //console.log("MergeSoundtrack",lessonid,recordid,MeetingID);
                        webapi.MergeSoundtrack(lessonid,recordid,MeetingID);
                        this.uploadRecord.showUploadRecordProcess=false;
                    }
                    if(afterupload)afterupload();
                });
                
            },()=>{},(process,guid)=>{
                //console.log("process:"+process);
                if(merge)
                {
                    //uploadRecord:{showUploadRecordProcess:false,uploadPercent:0,uploadFileName:""}
                    if(process==-1)
                    {
                        this.uploadRecord.showUploadRecordProcess=true;
                    }
                    else
                    {
                        this.uploadRecord.uploadPercent=process;
                    }
                }
            });
        },
        async autoRecord(action,lessonid,callback,afterupload){
            //autoRecordInfo:{IsRecord:false,Recorder:null,SoundIds:[],AttachmentID:0}       

            if (this.isLessonStart == false || this.isLessonFinished==true) {
                if(callback)callback();
                if(afterupload)afterupload();
                return;
            }
            //console.log("autoRecord:"+action);
            if(action=="Start" || action=="Enable")
            {
                if(!this.showUploadFile)
                {
                    //console.log(10217);
                    return;
                }                
                if(this.autoRecordInfo.IsRecord==true)
                {
                    return;
                }
                
                if(this.autoRecordInfo.IsRecord==false && this.autoRecordInfo.Recorder!=null)
                {
                    this.autoRecordInfo.IsRecord=true;
                    this.autoRecordInfo.Recorder.start();
                    whiteboard.TriggerPageChange();
                    return;
                }
                this.autoRecordInfo.IsRecord=true;
                websocket.startRecordLesson(lessonid, (d)=>{
                    this.autoRecordInfo.AudioID=d.data.audioId;
                    this.autoRecordInfo.Recorder= this.getMediaView().StartRecord();
                    this.syncRecordTime(d.data.time);
                    //record document
                    whiteboard.TriggerPageChange();
                    whiteboard.TriggerViewChange();
                });

                
            }
            else if(action=="End" || action=="Merge")
            {
                if(this.autoRecordInfo.Recorder!=null)
                {
                    if(this.autoRecordInfo.IsRecord==true)
                    {
                        this.autoRecordInfo.IsRecord=false;
                        this.autoRecordInfo.Recorder.stop();
                    }
                    websocket.endRecordAudio(this.autoRecordInfo.AudioID);
                    websocket.endRecordLesson(lessonid);                    
                    this.autoRecordInfo.Recorder.getBlobData(data => {
                            this.autoRecordInfo.Recorder.clear();
                            this.autoRecordInfo.Recorder=null;
                            try
                            {
                                this.getMediaView().StopRecord(); 
                            }
                            catch(ex){}
                            this.uploadAutoRecordAudio(data,this.autoRecordInfo.AttachmentID,this.autoRecordInfo.SoundIds[this.autoRecordInfo.SoundIds.length-1],()=>
                                {
                                    if(afterupload)afterupload();
                                },lessonid,this.autoRecordInfo.RecordID,util.FormatMediaTime(Math.round(nDuration/1000),1),action=="Merge");
                            if(callback)callback();
                        });
                    this.autoRecordInfo.IsRecord=false;
                    return;
                }
                else
                {
                    if(afterupload)afterupload();
                }
                this.autoRecordInfo.IsRecord=false;
                if(callback)callback();
                
            }
        },
        syncRecordTime(startime){
            
            this.autoRecordInfo.StartTime.setMilliseconds(new Date().getMilliseconds()-startime);
            this.autoRecordInfo.Timer = setInterval(()=>{
                this.autoRecordInfo.Time=new Date()-this.autoRecordInfo.StartTime;
                websocket.syncRecordTime(this.autoRecordInfo.Time);
            },5000);
            
        },
        PlayActionByTxt(data)
        {
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
                    closable:true
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
