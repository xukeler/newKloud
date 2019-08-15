<template>
  <div id="controlsetting" style="text-align:left;">
    <div>
      <Row type="flex" justify="center" align="middle" style="margin:5px 2px;">
        <Col span="7" style="height:30px; line-height:30px; vertical-align:middle; text-align: right">
        <div>{{$t("Setting.Camera")}}:</div>
        </Col>
        <Col span="17">
        <Select v-model="selectCamera" @on-change="onCameraChange" style="width:100%; height:30px;">
          <Option v-for="item in cameraList" :value="item.value" :key="item.value">{{ item.text }}</Option>
        </Select>
        </Col>
      </Row>
      <Row type="flex" justify="center" align="middle" style="margin:5px 2px;display:none;">
        <Col span="7" style="height:30px; line-height:30px; vertical-align:middle; text-align: right">
        <div>{{$t("Setting.Camera2")}}:</div>
        </Col>
        <Col span="17">
        <Select v-model="selectSecondCamera" style="width:100%; height:30px;">
          <Option v-for="item in cameraSecondList" :value="item.value" :key="item.value">{{ item.text }}</Option>
        </Select>
        </Col>
      </Row>
      <Row type="flex" justify="center" align="middle" style="margin:5px 2px;">
        <Col span="7" style="height:30px; line-height:30px; vertical-align:middle;  text-align: right" justify="center" align="middle">
        <div>{{$t("Setting.Microphone")}}:</div>
        </Col>
        <Col span="17">
        <Select v-model="selectMic" style="width:100%; height:30px;" @on-change="onMicChange">
          <Option v-for="item in micList" :value="item.value" :key="item.value">{{ item.text }}</Option>
        </Select>
        </Col>
      </Row>
      <Row type="flex" justify="center" align="middle" style="margin:0px;">
        <Col span="7" style="height:10px; line-height:10px; vertical-align:middle;" justify="center" align="middle">
        <div></div>
        </Col>
        <Col span="17">
        <div style="width:200px; height:10px; background-color:red; margin:0px 0px 10px 8px;border:1px solid #dddee1; background-color:#d8d8d8;">
          <div id="testMicPersent" style="height:100%;padding:0px; margin:0px; width:0%; background-color:chartreuse;"></div>
        </div>
        </Col>
      </Row>
      <Row type="flex" justify="center" align="middle" style="margin:5px 2px;">
        <Col span="7" style="height:30px; line-height:30px; vertical-align:middle; text-align: right" justify="center" align="middle">
        <div>{{$t("Setting.Speaker")}}:</div>
        </Col>
        <Col span="17">
        <Select v-model="selectSpeaker" style="width:100%; height:30px;" @on-change="onSpeakerChange">
          <Option v-for="item in speakerList" :value="item.value" :key="item.value">{{ item.text }}</Option>
        </Select>
        </Col>
      </Row>
      <Row type="flex" justify="center" align="middle" style="margin:0px;">
        <Col span="7" style="height:10px; line-height:10px; vertical-align:middle;" justify="center" align="middle">
        <div id="testSpeakerContainer"></div>
        </Col>
        <Col span="17">
        <div style="width:160px; height:10px; background-color:red; margin:0px 0px 2px 8px;border:1px solid #dddee1; background-color:#d8d8d8; display:none;">
          <div id="testSpeakerPercentage" style="height:100%;padding:0px; margin:0px; width:0%; background-color:chartreuse;"></div>
        </div>
        <div @click="testSound" id="testSpeakerBtn" stat="0" style="cursor:pointer; color:blue;padding-left: 8px;">{{$t("Setting.TestSound")}}</div>
        </Col>
      </Row>
      <Row type="flex" justify="center" align="middle" style="margin:5px 2px;" v-show="showChangeLine">
        <Col span="7" style="height:30px; line-height:30px; vertical-align:middle; text-align: right" justify="center" align="middle">
        <div style="line-height:14px;white-space:pre-wrap;">{{$t("Setting.ScreenShareRes")}}:</div>
        </Col>
        <Col span="17">
        <Select v-model="selectResolution" style="width:100%; height:30px;">
          <Option v-for="item in resolutionList" :value="item" :key="item">{{ item }}</Option>
        </Select>
        </Col>
      </Row>
      <Row type="flex" justify="center" align="middle" style="margin:5px 2px;" v-show="showChangeLine">
        <Col span="7" style="height:30px; line-height:30px; vertical-align:middle; text-align: right" justify="center" align="middle">
        <div>{{$t("Setting.Audiotool")}}：</div>
        </Col>
        <Col span="17">
        <Input v-model="lineText" disabled>
        <Button slot="append" icon="ios-arrow-right" @click="clickChangeLine()"></Button>
        </Input>
        </Col>
      </Row>
    </div>
    <div style="padding:10px 0px 0px 0; text-align: center"><a href="/static/PTScreenSharePlugIn.HTML" target="_blank">{{$t("Setting.Howtoplugin")}}</a></div>
    <div style=" width:100%; text-align:center; padding-top:20px;">
      <Button type="primary" shape="circle" icon="checkmark-round" @click="saveUserSetting">{{$t("Setting.Apply")}}</Button>
      <Button type="primary" shape="circle" icon="ios-refresh-empty" @click="refreshUserSetting">{{$t("Setting.Refresh")}}</Button>
    </div>
    <Modal title="Audio tool selection"
           v-model="lineSettingDlg"
           :closable="false"
           @on-ok="lienSettingOK"
           class-name="hideModalFooter hideModalHead"
           :mask-closable="false"
           width="600" style="z-index:40000;position: absolute;">
      <div style="text-align:center;font-size:18px; font-weight:bold; margin-bottom:20px;">{{$t("Setting.Audiotoolselection")}}</div>
      <div id="controlsetting-lines">
        <div id="controlsetting-line0" class="controlsetting-selectline selected" @click="selectLine(0);">
          <div class="controlsetting-top">
            <div class="controlsetting-title">{{$t("Setting.Systemaudio")}}</div>
            <div class="controlsetting-des">{{$t("Setting.TipsbasedInternet")}}</div>
          </div>
          <div class="controlsetting-bot"><Icon type="checkmark" class="controlsetting-checkmark" size="24"></Icon></div>
        </div>
        <div id="controlsetting-line2" class="controlsetting-selectline" @click="selectLine(2);">
          <div class="controlsetting-top">
            <div class="controlsetting-title">{{$t("Setting.KloudCall")}}</div>
            <div class="controlsetting-des">{{$t("Setting.TipsKloudcall")}}</div>
          </div>
          <div class="controlsetting-bot"><Icon type="checkmark" class="controlsetting-checkmark" size="24"></Icon></div>
        </div>
        <div id="controlsetting-line4" class="controlsetting-selectline" @click="selectLine(4);">
          <div class="controlsetting-top">
            <div class="controlsetting-title">{{$t("Setting.ThirdpartyAudio")}}</div>
            <div class="controlsetting-des">{{$t("Setting.Tipsskype")}}</div>
          </div>
          <div class="controlsetting-bot"><Icon type="checkmark" class="controlsetting-checkmark" size="24"></Icon></div>
        </div>
      </div>
      <div style="clear:both;"></div>
      <div style="margin-top:20px; color:red; text-align:center;">{{$t("Setting.Theselectionattendees")}}</div>
      <div style="text-align:center;padding:20px 0px 10px;"> <Button type="primary" style="width:40%;" @click="lienSettingOK">{{$t("Base.OK")}}</Button></div>
    </Modal>

  </div>  
</template>
<style scoped lang="scss">
  $header-height: 50px; $images-root: "../../../static/images/";
  /**************************************************/
  .controlsetting-selectline {
    float: left;
    width: 162px;
    height: 200px;
    margin: 10px;
    padding:0px;
    border: solid 2px #9a9a9a;
    border-radius: 8px 8px;
    cursor:pointer;
    box-sizing:content-box;
  }
  .controlsetting-selectline:hover {
    background-color: #f5f5f5;
  }
  .controlsetting-selectline.selected {
    border: solid 2px #4b8ee7;
  }
    .controlsetting-selectline.selected .controlsetting-bot {
      background-color: #4b8ee7;
    }
    .controlsetting-selectline.selected .controlsetting-checkmark {
      visibility:visible;
    }
  .controlsetting-checkmark {
    color: white;
    padding-top:7px;
    visibility:hidden;
  }
  .controlsetting-top {
    height: 155px;
    width: 100%;
    padding: 0px;
    border: 0px;
    margin: 0px;
    box-sizing: border-box;
  }
  .controlsetting-bot {
    height: 40px;
    width: 100%;
    padding: 0px;
    margin: 0px;
    border: 0px;
    box-sizing: border-box;
    text-align:center;
  }
  .controlsetting-title
  {
    text-align:center;
    font-weight:bold;
    margin-top:5px;
  }
  .controlsetting-des
  {
    margin-top:20px;
  }
</style>
<script>

  export default {
    data: function ()
    {
      return {
        cameraList: [],
        cameraSecondList: [],
        micList: [],
        speakerList:[],
        resolutionList: ["720P","1080P"],
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
        lineText: this.$t("Setting.Systemaudio"),//"System audio",
        lineSettingDlg: false,
        role: "1",
        selectLineID:0
      }
    },
    props: [],
    components: {

    },
    mounted: function ()
    {
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
      init(userrole=1)
      {
        this.role = userrole+"";
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
          this.testMic();
        });
      },
      reset()
      {
        this.cameraList = [];
        this.cameraSecondList = [];
        this.micList = [];
        this.speakerList = [];
      },
      clickChangeLine()
      {
        console.log("clickChangeLine");
        this.lineSettingDlg = true;
        //alert("clickChangeLine");
      },
      lienSettingOK()
      {
        this.lineSettingDlg = false;
        if (this.$parent && this.$parent.AfterSelectAudioTool)
        {
          this.$parent.AfterSelectAudioTool(this.selectLineID);
        }
      },
      selectLine(line)
      {
        $("div.controlsetting-selectline").removeClass("selected");
        $("#controlsetting-line" + line).addClass("selected");
        this.selectLineID = line;
        if (line == 0)
        {
          this.lineText = this.$t("Setting.Systemaudio");//"System audio";
        }
        else if (line == 2)
        {
          this.lineText = this.$t("Setting.KloudCall");//"KloudCall";
        }
        else if (line == 4)
        {
          this.lineText = this.$t("Setting.Noaudio");//"No audio";
        }
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
            this.selectResolution = "1080P";
          }
          if (speaker && speaker != "")
          {
            this.selectSpeaker = speaker;
          }
        };
        this.getUserSettingFromServer([1001, 1002, 1003, 1004, 1005]).then((setting) =>
        {
          for (var set of setting)
          {
            if (set.SettingID == 1001 && set.Text!="")
            {
              mic = set.Text;
              localStorage.setItem('DefaultMic', mic);
            }
            else if (set.SettingID == 1002 && set.Text != "")
            {
              speaker = set.Text;
              localStorage.setItem('DefaultSpeaker', speaker);
            }
            else if (set.SettingID == 1003 && set.Text != "")
            {
              camera = set.Text;
              localStorage.setItem('DefaultCamera', camera);
            }
            else if (set.SettingID == 1004 && set.Text != "")
            {
              cameraSecond = set.Text;
              localStorage.setItem('DefaultSecondCamera', cameraSecond);
            }
            else if (set.SettingID == 1005 && set.Text != "")
            {
              resolution = set.Text;
              localStorage.setItem('DefaultResolution', resolution);
            }
          }
          setValue();
        });
      },
      saveUserSetting()
      {
        localStorage.setItem('DefaultMic', this.selectMic);
        localStorage.setItem('DefaultCamera', this.selectCamera);
        localStorage.setItem('DefaultSecondCamera', this.selectSecondCamera);
        localStorage.setItem('DefaultResolution', this.selectResolution);
        localStorage.setItem('DefaultSpeaker', this.selectSpeaker);
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
        if (this.selectCamera != "")
        {
          var speakerSet = new Object();
          speakerSet.SettingID = 1003;
          speakerSet.Text = this.selectCamera;
          set.push(speakerSet);
        }
        if (this.selectSecondCamera != "")
        {
          var speakerSet = new Object();
          speakerSet.SettingID = 1004;
          speakerSet.Text = this.selectSecondCamera;
          set.push(speakerSet);
        }
        if (this.selectResolution != "")
        {
          var speakerSet = new Object();
          speakerSet.SettingID = 1005;
          speakerSet.Text = this.selectResolution;
          set.push(speakerSet);
        }
        this.setUserSettingToServer(set).then((result) =>
        {
          this.$Message.success(
            {
              content: this.$t("Setting.SaveSettingSucc"),
              duration: 3
            });          
          this.$emit("afterSaveControlSetting",this.selectResolution);
        });

      },
      onSpeakerChange()
      {
        //if ($("#testSpeakerBtn").attr("stat") == "0")
        //{
        //  return;
        //}
        //setTimeout(() =>
        //{
        //  ChangeSpeaker(this.selectSpeaker);
        //}, 1);
        var speaker = this.selectSpeaker;
        if (document.getElementById("testspeakeraudio"))
        {
          this.stopShowSoundWav();

          //setTimeout(() =>
          //{
            //document.getElementById("testspeakeraudio").setSinkId(speaker);
          //},100);
            this.showSoundWav(speaker);
        }
        this.$emit("onSpeakerChange",this.selectSpeaker);
      },
      testSound()
      {
        if ($("#testSpeakerBtn").attr("stat") == "0")//play
        {
          $("#testSpeakerBtn").attr("stat", "1").html(this.$t("Setting.Stop"));
          $("#testSpeakerPercentage").parent().show();
          this.showSoundWav(this.selectSpeaker);
        }
        else//stop
        {
          $("#testSpeakerBtn").attr("stat", "0").html(this.$t("Setting.TestSound"));
          document.getElementById("testspeakeraudio").pause();
          $("#testSpeakerPercentage").css({ "width": "0%" });
          this.stopShowSoundWav();
          $("#testSpeakerPercentage").parent().hide();
        }
      },
      showSoundWav(speakerID)
      {
        this.stopShowSoundWav();

        $("#testspeakeraudio").remove();
        var html = '<audio id="testspeakeraudio" src="static/test.m4a" autoplay loop></audio>';
        $("#testSpeakerContainer").append(html);
        document.getElementById("testspeakeraudio").play();
        document.getElementById("testspeakeraudio").setSinkId(speakerID);
        var per = 40;
        this.timeSpeaker = setInterval(() =>
        {
          per += 10;
          if (per >= 90)
          {
            per = 30;
          }
          $("#testSpeakerPercentage").css({ "width": per+"%" });
        }, 50);


        return;
        this.audioSpeaker = new (window.AudioContext || window.webkitAudioContext)();
        this.speakerSource = this.audioSpeaker.createMediaElementSource(document.getElementById("testspeakeraudio"));
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
      onMicChange()
      {
        //alert(this.selectMic);
        try
        {
          this.testMic();
        }
        catch (ex){}
        this.$emit("onMicChange",this.selectMic);
      },
      onCameraChange(){
        this.$emit("onCameraChange",this.selectCamera);
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
          }, 300);

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
        $("#testMicPersent").css({ "width": percentage + "%" });
        if (barHeight/ 256>=0.15)
        {
          this.$emit("onSpeaking",barHeight / 256);
        }
        // if (barHeight/ 256>=0.15 && this.$parent && this.$parent.$parent &&this.$parent.$parent.OnSpeaking)
        // {
        //   this.$parent.$parent.OnSpeaking(barHeight / 256);
        // }
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
        $("#testSpeakerPercentage").css({ "width": percentage + "%" });
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
        if (document.getElementById("testspeakeraudio"))
        {
          document.getElementById("testspeakeraudio").pause();
        }
        if (this.timeMic)
        {
          clearTimeout(this.timeMic);
        }
        this.stopShowSoundWav();
      }
    },
    computed: {
      showChangeLine()
      {
        return this.role == "2";
      }
    }
  }
</script>
