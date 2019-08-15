<template>
  <div :id="preid+'-mediasettingteacher'" style="text-align:left;">
    <table style="width:100%;">
      <tr>
        <td style="text-align:center;">
          <div style="text-align:center; padding:0px 0px 10px; display:inline-block; display:none;">{{$t("Setting.Audiotoolselection")}}: </div>
          <div style="text-align:center;display:none;">
            <span>
              <a class="mediasettingteacher-ctl-btn" style="background-color:cornflowerblue;" :id="preid+'mediasettingteacher-ctl-toggle-system'" @click="ChangeAudioLine('system');">
                <span class="mediasettingteacher-ctl-icon mediasettingteacher-ctl-icon-system"></span>
              </a>
            </span>
            <span style=" padding-left:30px;"></span>
            <span>
              <a class="mediasettingteacher-ctl-btn disable" style="background-color:cornflowerblue;" :id="preid+'mediasettingteacher-ctl-toggle-kloudcall'" @click="ChangeAudioLine('kloudcall');"><span class="mediasettingteacher-ctl-icon mediasettingteacher-ctl-icon-kloudcall"></span></a>
            </span>
            <span style=" padding-left:30px;"></span>
            <span>
              <a class="mediasettingteacher-ctl-btn disable" style="background-color:cornflowerblue;" :id="preid+'mediasettingteacher-ctl-toggle-othertools'" @click="ChangeAudioLine('othertools');"><span class="mediasettingteacher-ctl-icon mediasettingteacher-ctl-icon-othertools"></span></a>
            </span>
          </div>
          <div style="display:inline-block; text-align:left;">
            <!--<Select v-model="lineID" style="width:220px; height:30px;" :disabled="lineDisabled" @on-change="onLineChange">
    <Option v-for="item in lineList" :value="item.value" :key="item.value">{{ item.text }}</Option>
  </Select>-->
            <Tabs @on-click="onLineChange" v-model ="lineID">
              <TabPane :label="$t('Setting.Systemaudio')" name="0" :disabled="lineDisabled"></TabPane>
              <TabPane :label="$t('Setting.KloudCall')" name="2" :disabled="lineDisabled"></TabPane>
              <TabPane :label="$t('Setting.OtherTools')" name="4" :disabled="lineDisabled"></TabPane>
            </Tabs>
          </div>
        </td>
      </tr>
      <tr><td>
  <div style="padding:10px 0px 30px; text-align:center; font-size:14px;display:none;">
    <Icon type="information-circled" style="color:cornflowerblue; margin-right:5px;"></Icon><span style="color:cornflowerblue;">{{lineText}}</span>:{{lineTip}}
  </div>
</td></tr>
    </table>
    <table style="width:100%;">
      <tr>
        <td style="width:49%;">
          <div :id="preid+'-mediasettingteacher-selectmedia'">
            <Row type="flex" justify="center" align="middle" style="margin:5px;">
              <Col span="6" style="height:30px; line-height:30px; vertical-align:middle;" justify="center" align="middle">
              <div style="width:36px;height:36px;border-radius: 50%; border:solid 1px #333;"><Icon type="ios-mic-outline" size="30" style=" margin-top:3px;"></Icon></div>
              </Col>
              <Col span="18">
              <Select v-model="selectMic" style="width:180px; height:30px;" :disabled="micDisabled" @on-change="onMicChange">
                <Option v-for="item in micList" :value="item.value" :key="item.value">{{ item.text }}</Option>
              </Select>
              </Col>
            </Row>
            <Row type="flex" justify="center" align="middle" style="margin:0px;">
              <Col span="6" style="height:10px; line-height:10px; vertical-align:middle;" justify="center" align="middle">
              <div></div>
              </Col>
              <Col span="18">
              <div style="width:180px; height:10px; background-color:red; margin:0px 0px 10px 5px;border:1px solid #dddee1; background-color:#d8d8d8;">
                <div :id="preid+'testMediaMicPersent'" style="height:100%;padding:0px; margin:0px; width:0%; background-color:chartreuse;"></div>
              </div>
              </Col>
            </Row>
            <Row type="flex" justify="center" align="middle" style="margin:5px;">
              <Col span="6" style="height:30px; line-height:30px; vertical-align:middle;" justify="center" align="middle">
              <div>
                <div style="width:36px;height:36px;border-radius: 50%; border:solid 1px #333;">
                  <Icon type="volume-medium" size="30" style=" margin-top:3px;"></Icon>
                </div>
              </div>
              </Col>
              <Col span="18">
              <Select v-model="selectSpeaker" style="width:180px; height:30px;" :disabled="speakerDisabled" @on-change="onSpeakerChange">
                <Option v-for="item in speakerList" :value="item.value" :key="item.value">{{ item.text }}</Option>
              </Select>
              </Col>
            </Row>
            <Row type="flex" justify="center" align="middle" style="margin:0px;">
              <Col span="6" style="height:10px; line-height:10px; vertical-align:middle;" justify="center" align="middle">
              <div :id="preid+'testMediaSpeakerContainer'"></div>
              </Col>
              <Col span="18">
              <div style="width:180px; height:10px; background-color:red; margin:0px 0px 2px 3px;border:1px solid #dddee1; background-color:#d8d8d8; display:none;">
                <div :id="preid+'testMediaSpeakerPercentage'" style="height:100%;padding:0px; margin:0px; width:0%; background-color:chartreuse;"></div>
              </div>
              <div @click="testMediaSound" :id="preid+'testMediaSpeakerBtn'" stat="0" style="cursor:pointer; color:blue;">{{$t("Setting.TestSound")}}</div>
              </Col>
            </Row>
          </div>          
        </td>
        <td style=" border-left:solid 1px #e9eaec;"></td>
        <td style="width:49%;">
          <div style="text-align:center; padding:0px 0px 10px;">{{$t("Setting.AudioAndWebcamOption")}}</div>
          <div style="padding:5px;text-align:center;">
            <Tooltip :content="$t('Setting.TurnMicrophone')" placement="bottom">
              <a class="mediasettingteacher-ctl-btn" :id="preid+'mediasettingteacher-ctl-toggle-audio'" :disabled="audioDisabled" @click="ToggleLoaclAudio();"><span class="mediasettingteacher-ctl-icon mediasettingteacher-ctl-icon-mic"></span></a>
            </Tooltip>
            <span style=" padding-left:60px;"></span>
            <Tooltip :content="$t('Setting.TurnCamera')" placement="bottom">
              <a class="mediasettingteacher-ctl-btn disable" :id="preid+'mediasettingteacher-ctl-toggle-video'" @click="ToggleLoaclVideo();"><span class="mediasettingteacher-ctl-icon mediasettingteacher-ctl-icon-camera"></span></a>
            </Tooltip>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
<style scoped lang="scss">
  $header-height: 50px;
  $images-root: "../../../static/images/";
  .mediasettingteacher-ctl-btn {
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

  .mediasettingteacher-ctl-btn.disable {
    filter: grayscale(100%);
    background-color: #bdbdbd;
    opacity: 0.5;
  }

  .mediasettingteacher-ctl-icon {
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

  .mediasettingteacher-ctl-icon-mic {
    background-image: url($images-root + "microphone.png");
  }

  .mediasettingteacher-ctl-icon-camera {
    background-image: url($images-root + "camera.png");
  }
  .mediasettingteacher-ctl-icon-system {
    background-image: url($images-root + "systemaudio.png");
    background-size: 26px 26px;
    background-position: center center;
  }
  .mediasettingteacher-ctl-icon-kloudcall {
    background-image: url($images-root + "kloudcall.png");
    background-size: 32px 32px;
  }
  .mediasettingteacher-ctl-icon-othertools {
    background-image: url($images-root + "otheraudio.png");
    background-size: 32px 32px;
  }
</style>
<script>
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
  import webapi from '../../webapi/webapi.js';
  export default {
    data: function ()
    {
      return {
        cameraList: [],
        cameraSecondList: [],
        micList: [],
        speakerList:[],
        resolutionList: ["240P", "360P", "480P", "720P"],
        selectCamera: "",
        selectSecondCamera: "",
        selectMic: "",
        selectResolution: "",
        selectSpeaker: "",
        testMicStreem: null,
        audioCtx: null,
        audioSpeaker: null,
        speakerSource:null,
        timeMic: null,
        timeSpeaker: null,
        micDisabled: false,
        speakerDisabled: false,
        lineDisabled: false,
        audioDisabled:false,
        selectLine:0,
        lineList: [{ value: 0, text: "System audio" }, { value: 2, text: "Kloud Call" }, { value: 4, text: "Other Tools"}],
        lineID: "0",
        lineText: this.$t("Setting.Systemaudio"),//"System audio",
        lineTip:this.$t("Setting.TipsbasedInternet")
      }
    },
    props: ["preid"],
    components: {

    },
    mounted: function ()
    {
      //console.log("preid:" + this.preid);
      //this.init();
    },
    beforeDestroy: function ()
    {
      //console.log("destroyed");
      this.end();
    },
    destroyed: function ()
    {
    },
    watch: {
      selectCamera(val)
      {
        var selIndex = -1;
        var tmp = this.cameraList.concat();
        for (var i = 0, j = tmp.length; i < j; i++)
        {
          if (tmp[i].value == val)
          {
            selIndex = i;
          }
        }
        if (selIndex != -1)
        {
          tmp.splice(selIndex, 1);
        }
        this.cameraSecondList = tmp;
      }
    },
    methods: {
      init(lastLineID=-1)
      {
        //console.log("media setting init");
        this.reset();
        navigator.mediaDevices.enumerateDevices().then((devices) =>
        {
          devices.forEach((device) =>
          {
            var option = new Object();
            option.value = device.deviceId;
            if (device.kind === 'audioinput')
            {
              option.text = device.label || 'microphone ' + i;
              if ("communications" == device.deviceId)
              {

              }
              else
              {
                this.micList.push(option);
              }
            } else if (device.kind === 'videoinput')
            {
              option.text = device.label || 'camera ' + i;
              this.cameraList.push(option);
            }
            else if (device.kind == "audiooutput")
            {
              var option = new Object();
              option.value = device.deviceId;
              option.text = device.label;
              this.speakerList.push(option);
            }
            else
            {
              //console.log('Some other kind of source/device: ', device);
            }
          });
          for (var i = 0, j = this.cameraList.length; i < j; i++)
          {
            this.cameraSecondList.push(this.cameraList[i]);
          }
          this.getUserSetting();
          //alert(lastLineID);
          if (lastLineID >= 0)
          {
            this.lineID = lastLineID+"";
            this.lineDisabled = true;
            this.setLine("");
          }
          this.onMicChange();
        });
      },
      setLine(type)
      {
        //var selmedia = $("#" + this.preid + "-mediasettingteacher-selectmedia");
        if (type == "system" || this.lineID=="0")
        {
          //this.lineID = 0;
          //selmedia.show();
          this.micDisabled = false;
          this.speakerDisabled = false;
          this.audioDisabled = false;
          this.ToggleLoaclAudio(1);
          this.lineText = this.$t("Setting.Systemaudio");//"System audio";
          this.lineTip = this.$t("Setting.BasedonInternet");
        }
        else if (type == "kloudcall" || this.lineID == "2")
        {
          //this.lineID = 2;
          this.micDisabled = true;
          this.speakerDisabled = true;
          this.audioDisabled = true;
          this.ToggleLoaclAudio(0);
          //selmedia.hide();
          this.lineText = this.$t("Setting.KloudCall");//"Kloud Call";
          this.lineTip = this.$t("Setting.UseKloudcallAccount");
        }
        else
        {
          //this.lineID = 4;
          //selmedia.hide();
          this.micDisabled = true;
          this.speakerDisabled = true;
          this.audioDisabled = true;
          this.ToggleLoaclAudio(0);
          this.lineText = this.$t("Setting.OtherTools");//"Other Tools";
          this.lineTip = this.$t("Setting.SkypeWechatEtc");
        }
        this.saveToServer(this.lineID);
      },
      saveToServer(lineid)
      {
        return;
        var set = new Array();
        var lineSet = new Object();
        lineSet.SettingID = 1101;
        lineSet.Text = lineid;
        set.push(lineSet);
        webapi.setUserSettingToServer(set).then((result) =>
        {
        });
      },
      getLineID()
      {
        return parseInt(this.lineID);
      },
      ChangeAudioLine(type)
      {
        var tar = $("#" + this.preid + "mediasettingteacher-ctl-toggle-" + type);
        if ($(tar).hasClass("disable"))
        {
          $(tar).parent().parent().find("a.mediasettingteacher-ctl-btn").addClass("disable");
          $(tar).removeClass("disable");
          this.setLine(type);
        }
      },
      ToggleLoaclAudio(enable=-1)
      {
        var tar = $("#"+this.preid+"mediasettingteacher-ctl-toggle-audio");
        if (($(tar).hasClass("disable") && enable==-1) || enable==1)
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
      ToggleLoaclVideo(enable=-1)
      {
        var tar = $("#" + this.preid +"mediasettingteacher-ctl-toggle-video");
        if (($(tar).hasClass("disable") && enable==-1) || enable==1)
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
        var tar = $("#" + this.preid + "mediasettingteacher-ctl-toggle-audio");
        if ($(tar).hasClass("disable"))
        {
          this.changeEnableAudio(false);
        }
        else
        {
          this.changeEnableAudio(true);
        }

        var tar = $("#" + this.preid + "mediasettingteacher-ctl-toggle-video");
        if ($(tar).hasClass("disable"))
        {
          this.changeEnableVideo(false);
        }
        else
        {
          this.changeEnableVideo(true);
        }
      },
      reset()
      {
        this.cameraList = [];
        this.cameraSecondList = [];
        this.micList = [];
        this.speakerList = [];
      },
      refreshUserSetting()
      {
        location.reload();
        //return;
        //this.init();
        //this.saveUserSetting();
      },
      getUserSetting()
      {
        var mic = localStorage.getItem('DefaultMic');
        var camera = localStorage.getItem('DefaultCamera');
        var cameraSecond = localStorage.getItem('DefaultSecondCamera');
        var resolution = localStorage.getItem('DefaultResolution');
        var speaker = localStorage.getItem('DefaultSpeaker');
        var setValue = () =>
        {
          if (mic && mic != "")
          {
            this.selectMic = mic;
          }
          if (camera && camera != "")
          {
            this.selectCamera = camera;
          }
          if (cameraSecond && cameraSecond != "")
          {
            this.selectSecondCamera = cameraSecond;
          }
          if (resolution && resolution != "")
          {
            this.selectResolution = resolution;
          }
          else
          {
            this.selectResolution = "240P";
          }
          if (speaker && speaker != "")
          {
            this.selectSpeaker = speaker;
          }
        };

        if (mic == null || mic == "" || speaker == null || speaker == "")
        {
          this.getUserSettingFromServer([1001, 1002]).then((setting) =>
          {
            for (var set of setting)
            {
              if (set.SettingID == 1001)
              {
                mic = set.Text;
                localStorage.setItem('DefaultMic', mic);
              }
              else if (set.SettingID == 1002)
              {
                speaker = set.Text;
                localStorage.setItem('DefaultSpeaker', speaker);
              }
            }
            setValue();
          });
        }
        else
        {
          setValue();
        }
        

      },
      saveUserSetting()
      {
        if (this.selectMic != "")
        {
          localStorage.setItem('DefaultMic', this.selectMic);
        }
        //localStorage.setItem('DefaultCamera', this.selectCamera);
        //localStorage.setItem('DefaultSecondCamera', this.selectSecondCamera);
        //localStorage.setItem('DefaultResolution', this.selectResolution);
        if (this.selectSpeaker != "")
        {
          localStorage.setItem('DefaultSpeaker', this.selectSpeaker);
        }

        var set = new Array();
        if (this.selectMic != "")
        {
          var micSet = new Object();
          micSet.SettingID = 1001;
          micSet.Text = this.selectMic;
          set.push(micSet);
        }
        if (this.selectSpeaker != "")
        {
          var speakerSet = new Object();
          speakerSet.SettingID = 1002;
          speakerSet.Text = this.selectSpeaker;
          set.push(speakerSet);
        }
        this.setVideoAudioValue();
        this.setUserSettingToServer(set);
      },
      onSpeakerChange()
      {
        //if ($("#testMediaSpeakerBtn").attr("stat") == "0")
        //{
        //  return;
        //}
        //setTimeout(() =>
        //{
        //  ChangeSpeaker(this.selectSpeaker);
        //}, 1);
        var speaker = this.selectSpeaker;
        if (document.getElementById(this.preid +"testmedia"))
        {
          this.stopShowSoundWav();

          //setTimeout(() =>
          //{
            //document.getElementById("testmedia").setSinkId(speaker);
          //},100);
            this.showSoundWav(speaker);
        }
      },
      testMediaSound()
      {
        //alert($("#testMediaSpeakerBtn").html());
        if ($("#" + this.preid +"testMediaSpeakerBtn").attr("stat") == "0")//play
        {
          $("#" + this.preid + "testMediaSpeakerBtn").attr("stat", "1").html(this.$t("Setting.Stop"));
          $("#" + this.preid +"testMediaSpeakerPercentage").parent().show();
          this.showSoundWav(this.selectSpeaker);
        }
        else//stop
        {
          $("#" + this.preid +"testMediaSpeakerBtn").attr("stat", "0").html(this.$t("Setting.TestSound"));
          document.getElementById(this.preid +"testmedia").pause();
          $("#" + this.preid +"testMediaSpeakerPercentage").css({ "width": "0%" });
          this.stopShowSoundWav();
          $("#" + this.preid +"testMediaSpeakerPercentage").parent().hide();
        }
      },
      showSoundWav(speakerID)
      {
        //console.log("showSoundWav");
        this.stopShowSoundWav();

        $("#" + this.preid +"testmedia").remove();
        var html = '<audio id="' + this.preid+'testmedia" src="static/test.m4a" autoplay loop></audio>';
        $("#" + this.preid +"testMediaSpeakerContainer").append(html);
        document.getElementById(this.preid +"testmedia").play();
        document.getElementById(this.preid +"testmedia").setSinkId(speakerID);
        var per = 40;
        this.timeSpeaker = setInterval(() =>
        {
          per += 10;
          if (per >= 90)
          {
            per = 30;
          }
          $("#" + this.preid +"testMediaSpeakerPercentage").css({ "width": per+"%" });
        }, 50);


        return;
        this.audioSpeaker = new (window.AudioContext || window.webkitAudioContext)();
        this.speakerSource = this.audioSpeaker.createMediaElementSource(document.getElementById(this.preid +"testmedia"));
        //var gainNode = this.audioSpeaker.createGain();
        //source.connect(gainNode);
        //gainNode.connect(this.audioSpeaker.destination);
        var analyser = this.audioSpeaker.createAnalyser();
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        analyser.smoothingTimeConstant = 0.85;
        this.speakerSource.connect(analyser);
        this.timeSpeaker=setInterval(() =>
        {
          this.drawSpeaker(analyser);
        }, 50);
      },
      stopShowSoundWav()
      {
        if (this.timeSpeaker)
        {
          clearTimeout(this.timeSpeaker);
        }

        if (this.audioSpeaker && this.audioSpeaker.state != "closed")
        {
          this.audioSpeaker.close();
        }
        if (this.speakerSource)
        {
          this.speakerSource.disconnect();
        }

      },
      onLineChange()
      {
        this.setLine("");
      },
      onMicChange()
      {
        //alert(this.selectMic);
        try
        {
          this.testMic();
        }
        catch (ex){}
      },
      testMic()
      {
        if (this.testMicStreem)
        {
          this.testMicStreem.getTracks().forEach(function (track)
          {
            track.stop();
          });
        }
        if (this.audioCtx)
        {
          this.audioCtx.close();
        }
        if (this.timeMic)
        {
          clearTimeout(this.timeMic);
        }
        var constraints = {
          audio: { deviceId: { exact: this.selectMic == "" ? "default" : this.selectMic }}
        };
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        navigator.getUserMedia(constraints, (stream)=>
        {
          this.testMicStreem = stream;
          var source = this.audioCtx.createMediaStreamSource(stream);
          //var gainNode = this.audioCtx.createGain();
          //source.connect(gainNode);
          //gainNode.connect(this.audioCtx.destination);
          var analyser = this.audioCtx.createAnalyser();
          analyser.minDecibels = -90;
          analyser.maxDecibels = -10;
          analyser.smoothingTimeConstant = 0.85;
          source.connect(analyser);
          this.timeMic=setInterval(()=>
          {
            this.drawMic(analyser);
          }, 150);

        },function (err)
          {
          console.log('getUserMedia error: ' + err);
          }
        );
      },
      drawMic(analyser)
      {
        analyser.fftSize = 256;
        var bufferLengthAlt = analyser.frequencyBinCount;
        var dataArrayAlt = new Uint8Array(bufferLengthAlt);
        analyser.getByteFrequencyData(dataArrayAlt);

        var barHeight = 0;
        for (var i = 0; i < bufferLengthAlt; i++)
        {
          barHeight = Math.max(barHeight,dataArrayAlt[i]);
          //barHeight = dataArrayAlt[i];
          //showbar(i, barHeight, 600, 'mic')
        }
        var percentage = (barHeight * 100 / 256).toFixed(2);
        //console.log(barHeight);
        $("#" + this.preid +"testMediaMicPersent").css({ "width": percentage+"%"});
      },
      drawSpeaker(analyser)
      {
        analyser.fftSize = 256;
        var bufferLengthAlt = analyser.frequencyBinCount;
        var dataArrayAlt = new Uint8Array(bufferLengthAlt);
        analyser.getByteFrequencyData(dataArrayAlt);

        var barHeight = 0;
        for (var i = 0; i < bufferLengthAlt; i++)
        {
          barHeight = Math.max(barHeight, dataArrayAlt[i]);
          //barHeight = dataArrayAlt[i];
          //showbar(i, barHeight, 600, 'mic')
        }
        var percentage = (barHeight * 100 / 256).toFixed(2);
        //console.log(barHeight);
        $("#" + this.preid +"testMediaSpeakerPercentage").css({ "width": percentage + "%" });
      },
      end()
      {
        if (this.testMicStreem)
        {
          this.testMicStreem.getTracks().forEach(function (track)
          {
            track.stop();
          });
        }
        if (this.audioCtx && this.audioCtx.state != "closed")
        {
          this.audioCtx.close();
        }
        if (document.getElementById(this.preid +"testmedia"))
        {
          document.getElementById(this.preid +"testmedia").pause();
        }
        if (this.timeMic)
        {
          clearTimeout(this.timeMic);
        }
        this.stopShowSoundWav();
      },
      getUserSettingFromServer(ids)
      {
        return new Promise(function (resolve, reject)
        {
          var sessionid = sessionStorage.getItem('UserToken');
          var url = GetAPIUrl() + "User/UserSettings?settingIDs=" + ids.join(",");
          $.ajax({
            type: 'GET',
            url: url,
            beforeSend: function (request)
            {
              request.setRequestHeader("UserToken", sessionid);
            },
            success: function (data)
            {
              if (data.RetData == "")
              {
                resolve(null);
              }
              else
              {
                resolve(data.RetData);
              }
            },
            error: function (xhr, ajaxOptions, thrownError)
            {
              console.log(xhr);
              resolve(null);
            }
          });
        });
      },
      setUserSettingToServer(setting)
      {
        return new Promise(function (resolve, reject)
        {
          var sessionid = sessionStorage.getItem('UserToken');
          var url = GetAPIUrl() + "User/CreateOrUpdateUserSetting";
          $.ajax({
            type: 'POST',
            url: url,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(setting),
            dataType: "json",
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
              resolve(null);
            }
          });
        });
      },
      ...mapMutations(['changeEnableVideo', 'changeEnableAudio'])
    }
  }
</script>
