
export default {
    getUserMedia: navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia,
    AudioRecorder(stream, config)//{sampleBits:"采样数位 8, 16",sampleRate:"采样率(1/8 48000)",deviceId:"mic deviceId"}
    {
        config = config || {};
        
        var context = new AudioContext();
        var audioInput = context.createMediaStreamSource(stream);
        var recorder = context.createScriptProcessor(16384, 1, 1);//256, 512, 1024, 2048, 4096, 8192, 16384

        config.sampleBits = config.sampleBits || 8;         //采样数位 8, 16
        config.sampleRate = config.sampleRate || (1 / 4);////采样率(1/8 48000)
        var inputsampleRate = context.sampleRate ? context.sampleRate : 48000;
        var outsampleRate = config.sampleRate * inputsampleRate;

        var audioData = {
            size: 0          //录音文件长度
            , buffer: []     //录音缓存
            , inputSampleRate: inputsampleRate    //输入采样率
            , inputSampleBits: 8       //输入采样数位 8, 16
            , outputSampleRate: outsampleRate    //输出采样率
            , oututSampleBits: config.sampleBits       //输出采样数位 8, 16
            , input: function (data)
            {
                this.buffer.push(new Float32Array(data));
                this.size += data.length;
            }
            , compress: function ()
            {
                var data = new Float32Array(this.size);
                var offset = 0;
                for (var i = 0; i < this.buffer.length; i++)
                {
                    data.set(this.buffer[i], offset);
                    offset += this.buffer[i].length;
                }

                var compression = parseInt(this.inputSampleRate / this.outputSampleRate);
                var length = data.length / compression;
                var result = new Float32Array(length);
                var index = 0, j = 0;
                while (index < length)
                {
                    result[index] = data[j];
                    j += compression;
                    index++;
                }
                return result;
            }
            , encodeWAV: function ()
            {
                var sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);
                var sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
                var bytes = this.compress();
                var dataLength = bytes.length * (sampleBits / 8);
                var buffer = new ArrayBuffer(44 + dataLength);
                var data = new DataView(buffer);


                var channelCount = 1;
                var offset = 0;


                var writeString = function (str)
                {
                    for (var i = 0; i < str.length; i++)
                    {
                        data.setUint8(offset + i, str.charCodeAt(i));
                    }
                }

                // 资源交换文件标识符 
                writeString('RIFF'); offset += 4;
                // 下个地址开始到文件尾总字节数,即文件大小-8 
                data.setUint32(offset, 36 + dataLength, true); offset += 4;
                // WAV文件标志
                writeString('WAVE'); offset += 4;
                // 波形格式标志 
                writeString('fmt '); offset += 4;
                // 过滤字节,一般为 0x10 = 16 
                data.setUint32(offset, 16, true); offset += 4;
                // 格式类别 (PCM形式采样数据) 
                data.setUint16(offset, 1, true); offset += 2;
                // 通道数 
                data.setUint16(offset, channelCount, true); offset += 2;
                // 采样率,每秒样本数,表示每个通道的播放速度 
                data.setUint32(offset, sampleRate, true); offset += 4;
                // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8 
                data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true); offset += 4;
                // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8 
                data.setUint16(offset, channelCount * (sampleBits / 8), true); offset += 2;
                // 每样本数据位数 
                data.setUint16(offset, sampleBits, true); offset += 2;
                // 数据标识符 
                writeString('data'); offset += 4;
                // 采样数据总数,即数据总大小-44 
                data.setUint32(offset, dataLength, true); offset += 4;
                // 写入采样数据 
                if (sampleBits === 8)
                {
                    for (var i = 0; i < bytes.length; i++ , offset++)
                    {
                        var s = Math.max(-1, Math.min(1, bytes[i]));
                        var val = s < 0 ? s * 0x8000 : s * 0x7FFF;
                        val = parseInt(255 / (65535 / (val + 32768)));
                        data.setInt8(offset, val, true);
                    }
                } else
                {
                    for (var i = 0; i < bytes.length; i++ , offset += 2)
                    {
                        var s = Math.max(-1, Math.min(1, bytes[i]));
                        data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                    }
                }
                return new Blob([data], { type: 'audio/wav' });
            }
        };

        //开始录音
        this.start = function ()
        {
            audioInput.connect(recorder);
            recorder.connect(context.destination);
        }
        //停止
        this.stop = function ()
        {
            //console.log("stop recoder");
            if (recorder)
            {
                recorder.disconnect();
            }
        }
        this.replaceStream = function (stream)
        {
            this.stop();
            audioInput.disconnect(recorder);

            audioInput = context.createMediaStreamSource(stream);
            recorder = context.createScriptProcessor(16384, 1, 1);

            audioInput.connect(recorder);
            recorder.connect(context.destination);
            
            recorder.onaudioprocess = function (e)
            {
                audioData.input(e.inputBuffer.getChannelData(0));
            }

        }
        this.clear = function ()
        {
            //console.log("clear recoder");
            audioData.size = 0;
            audioData.buffer = [];
        }
        this.close = function (stopstream=true)
        {            
            //console.log("close recoder");
            if (stopstream && stream && stream.getTracks)
            {
                try
                {
                    stream.getTracks().forEach(track => track.stop());
                }
                catch (ex) { }
            }
            context.close();
            audioInput.disconnect();
            recorder.onaudioprocess = null;
            recorder.disconnect();
            audioData = null;
            recorder = null;
            context = null;
            audioInput = null;
        }
        this.getCurrentTime = function ()
        {
            return Math.round(context.currentTime*1000);
        }
        this.getBlob = function ()
        {
            this.stop();
            return audioData.encodeWAV();
        }
        this.play = function (audio)
        {
            var windowURL = window.URL || window.webkitURL
            audio.src = windowURL.createObjectURL(this.getBlob());
        }

        this.getBlobData= function (callback)
        {
            callback(this.getBlob());
        }

        this.getData = function (callback)
        {
            this.blobToDataURL(this.getBlob(), (dataUrl) =>
            {
                callback(dataUrl);
            });
        }
        this.blobToDataURL = function (blob, callback)
        {
            var a = new FileReader();
            a.onload = function (e) { callback(e.target.result); }
            a.readAsDataURL(blob);
        }
        //音频采集
        recorder.onaudioprocess = function (e)
        {
            audioData.input(e.inputBuffer.getChannelData(0));
        }
        //console.log("new recoder");
    },
    throwError(message)
    {
        alert(message);
        throw new function () { this.toString = function () { return message; } }
    },
    canRecording: (this.getUserMedia != null),
    getRecorder(callback, config)
    {
        if (callback)
        {
            if (this.getUserMedia)
            {
                var setting = null;
                if (config.deviceId && config.deviceId != "")
                {
                    setting = {
                        audio: { deviceId: config.deviceId, channelCount: 1, sampleSize: 8, sampleRate: config.sampleRate }
                    };
                }
                else
                {
                    setting = {
                        audio: { channelCount: 1, sampleSize: 8, sampleRate: config.sampleRate }
                    };
                }
                // navigator.getUserMedia({audio: true}, function () { console.log("getUserMedia success") }, function ()
                // { 
                //     console.log("getUserMedia error");
                // });
                
                navigator.getUserMedia(setting, (stream) =>
                {
                    var rec = new this.AudioRecorder(stream, config);
                    callback(rec);
                }
                    , (error) =>
                    {
                        switch (error.code || error.name)
                        {
                            case 'PERMISSION_DENIED':
                            case 'PermissionDeniedError':
                                this.throwError('用户拒绝提供信息。');
                                break;
                            case 'NOT_SUPPORTED_ERROR':
                            case 'NotSupportedError':
                                this.throwError('浏览器不支持硬件设备。');
                                break;
                            case 'MANDATORY_UNSATISFIED_ERROR':
                            case 'MandatoryUnsatisfiedError':
                                this.throwError('无法发现指定的硬件设备。');
                                break;
                            default:
                                this.throwError('无法打开麦克风。异常信息:' + (error.code || error.name));
                                break;
                        }
                    });
            } else
            {
                this.throwErr('当前浏览器不支持录音功能。'); return;
            }
        }
    }

}
