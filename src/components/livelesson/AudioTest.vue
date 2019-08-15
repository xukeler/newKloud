<template>
  <div class="audio-test">
    <table>
      <tr>
        <td>
          <Icon type="android-microphone" size="24"></Icon>
        </td>
        <td>
          <div>Microphone</div>
          <div><Progress :percent="microphonePercent" :status="microphoneStatus" hide-info></Progress></div>
          <div><Select v-model="microphone"></Select></div>
        </td>
      </tr>
      <tr>
        <td>
          <Icon type="android-volume-up" size="24"></Icon>
        </td>
        <td>
          <div>Speakers</div>
          <div><Progress hide-info></Progress></div>
          <div><Select v-model="speaker"></Select></div>
          <div><a>Test your sound</a></div>
        </td>
      </tr>
    </table>
  </div>
</template>

<style lang="scss">
.audio-test {
  text-align: left;

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 10px 0;
  }

  td {
    padding-bottom: 2em;
    vertical-align: top;
  }

  td:first-of-type {
    width: 40px;
  }
}
</style>

<script>
  var Context = null; 

  function createAudioMeter(audioContext,clipLevel,averaging,clipLag) {
    let processor = audioContext.createScriptProcessor(512);
    processor.onaudioprocess = volumeAudioProcess;
    processor.clipping = false;
    processor.lastClip = 0;
    processor.volume = 0;
    processor.clipLevel = clipLevel || 0.98;
    processor.averaging = averaging || 0.95;
    processor.clipLag = clipLag || 750;

    // this will have no effect, since we don't copy the input to the output,
    // but works around a current Chrome bug.
    processor.connect(audioContext.destination);

    processor.checkClipping =
      function () {
        if (!this.clipping)
          return false;
        if ((this.lastClip + this.clipLag) < window.performance.now())
          this.clipping = false;
        return this.clipping;
      };

    processor.shutdown =
      function () {
        this.disconnect();
        this.onaudioprocess = null;
      };

    return processor;
  }
  function volumeAudioProcess(event) {
    let buf = event.inputBuffer.getChannelData(0);
    let bufLength = buf.length;
    let sum = 0;
    let x;

    // Do a root-mean-square on the samples: sum up the squares...
    for (let i = 0; i < bufLength; i++) {
      x = buf[i];
      if (Math.abs(x) >= this.clipLevel) {
        this.clipping = true;
        this.lastClip = window.performance.now();
      }
      sum += x * x;
    }

    // ... then take the square root of the sum.
    let rms = Math.sqrt(sum / bufLength);

    // Now smooth this out with the averaging factor applied
    // to the previous sample - take the max here because we
    // want "fast attack, slow release."
    this.volume = Math.max(rms, this.volume * this.averaging);
  }

  function createMicrophoneMeter(refreshCallBack) {
    let audioContext = null;
    let mediaStreamSource = null;
    let audioMeter = null;

    let callbackLoop = function (time) {
      let error = audioMeter.checkClipping();

      // draw a bar based on the current volume
      let percent = audioMeter.volume * 100 * 1.4;

      if (refreshCallBack)
        refreshCallBack(percent, error);

      // set up the next visual callback
      window.requestAnimationFrame(callbackLoop);
    };

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();

    try {
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      navigator.getUserMedia({
        "audio": {
          "mandatory": {
            "googEchoCancellation": "false",
            "googAutoGainControl": "false",
            "googNoiseSuppression": "false",
            "googHighpassFilter": "false"
          },
          "optional": []
        },
      }, function (stream) {
        mediaStreamSource = audioContext.createMediaStreamSource(stream);

        audioMeter = createAudioMeter(audioContext);
        mediaStreamSource.connect(audioMeter);

        callbackLoop();
      }, function (error) {
        Context.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: 'Stream generation failed. ' + error, top: 24,duration: 4, left:true });
        console.log(error);
      });
    }
    catch (e) {
      Context.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: 'getUserMedia threw exception :' + e, top: 24,duration: 4, left:true });
    }

    this.disconnect = function () {
      audioMeter.shutdown();
    }
  }

  export default {
    data: function () {
      return {
        microphoneMeter: null,
        microphonePercent: 0,
        microphoneStatus: 'normal',
        microphone: 0,
        speaker: 0
      };
    },
    created() {
      Context = this;
    },
    mounted: function () {
    },
    methods: {
      start() {
        this.microphoneMeter = createMicrophoneMeter(this.refreshProgress);
      },
      stop() {
        if (this.microphoneMeter)
          this.microphoneMeter.disconnect();
      },
      refreshProgress(percent, error) {
        if (error)
          this.microphoneStatus = "wrong";
        else
          this.microphoneStatus = "normal";

        // draw a bar based on the current volume
        this.microphonePercent = percent;
      }
    }
  }
</script>
