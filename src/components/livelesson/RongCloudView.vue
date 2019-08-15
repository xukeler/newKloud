<template>
  <div id="rongcloudview" class="rongcloudview">
    <div id="rongcloudview-list" style="width:300px; overflow:auto;">
      <div id="rongcloudview-messages" style="width:100%;height:100%; text-align:left;">
        <div class="rongcloudview-message" v-for="msg in messageList">
          <div style="float:left; width:40px; padding-left:5px;">
            <img class="rongcloudview-avatar" :src="msg.AvatarUrl">
          </div>
          <div style="padding-left:44px;">
            <div class="rongcloudview-name" :class="msg.UserNameCss">{{msg.UserName}}</div>
            <div class="rongcloudview-content"><pre>{{msg.Content}}</pre></div>
          </div>
        </div>
      </div>
    </div>
    <div id="rongcloudview-input" style="height:90px; border-top:solid 1px #ccc; padding-top:5px; bottom:0px; position:absolute;width:300px;">
      <div>
        <div style="float:left;">
          <Button-group>
            <i-button icon="happy-outline" @click="showEmojiList();"></i-button>
            <!--<i-button icon="document"></i-button>
            <i-button icon="gear-a"></i-button>-->
            <i-button icon="ios-trash-outline" @click="clearMessages();"></i-button>
          </Button-group>
        </div>
        <div style="float:right; height:30px;">
          <i-button type="success" @click="Send();">Send</i-button>
        </div>
      </div>
      <div style="height:50px; padding-top:5px; clear:both;">
        <textarea v-model="sendTxt" @keydown.enter="Enter($event);"  wrap="soft" autocomplete="off"  spellcheck="false" class="ivu-input" placeholder="please input ..." rows="2" style="width:100%; height:45px;"></textarea>
      </div>
    </div>
    <div v-show="showemojiList" id="rongcloudview-emoji" style="position:absolute;bottom:90px; right:0px; width:300px; border:solid 1px #000000; background-color:#ccc; padding:5px 2px 5px;">
      <span class="emoji" v-for="emoji in emojiList" :title="getEmojiTitle(emoji)" @click="insertEmoji($event);">{{emoji.emoji}}</span>
    </div>
  </div>
</template>
<style scoped lang="scss">
  $header-height: 50px; $images-root: "../../../static/images/";

  .rongcloudview {
    width: 100%;
    height: 100%;
    padding: 0px;
    margin: 0px;
    .emoji
    {
      padding:0px;
      margin:0px;
      width:21px;
      height:19px;
      cursor:pointer;
      display:inline-block;
    }
  .rongcloudview-message {
    width: 100%;
    clear: both;
    margin-bottom: 10px;

  .rongcloudview-name
  {
    margin-bottom: 5px;
  }

  .rongcloudview-name.teacher {
    color: red;
  }

  .rongcloudview-name.student {
    color: green;
  }

  .rongcloudview-name.auditor {
    color: black;
  }
  .rongcloudview-name.me {
    color:blue;
  }

  .rongcloudview-content {
  }
  }

  .rongcloudview-face {
    width: 30px;
  }
  

  .rongcloudview-avatar {
    width: 35px;
    border: 0px;
  }
  }


</style>
<script>
  import authenticator from '../../authenticator';
  import webapi from '../../webapi/webapi.js';
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
  var RongCloudContext = null;
  export default {
    data: function () {
      return {
        rongCloudGroupName: "",
        isInit: false,
        sendTxt: "",
        userID: 0,
        RongCloudID:0,
        emojiList: [],
        messageList: [],
        userInfoCache:[],
        showemojiList:false
      }
    },
    components: {
    },
    mounted: function ()
    {
      $("#rongcloudview-list").height(document.body.clientHeight - 158);
      $(window).bind("resize", function ()
      {
        $("#rongcloudview-list").height(document.body.clientHeight - 158);

        //console.log("rongcloudview:" + $("#rongcloudview").height());
        //console.log("liveChat:" + $("#liveChat").height());
        //console.log("body:" + document.body.clientHeight);

      });
      RongCloudContext = this;
    },
    computed: {
      formatMsg(s)
      {
        
      }
    },
    methods: {
      Init(gname,uid)
      {
        return;
        // this.rongCloudGroupName = gname;
        // this.userID = uid;

        // if (this.isInit==true)
        // {
        //   return;
        // }
        // this.isInit = true;
        // this.InitClient();
        // this.InitEmoji();
      },
      InitClient()
      {
        RongIMLib.RongIMClient.init(GetRongCloudAppKey());

        RongIMClient.setConnectionStatusListener({
          onChanged: (status)=>
          {
            switch (status)
            {
              case RongIMLib.ConnectionStatus.CONNECTED:
                //console.log('链接成功');
                break;
              case RongIMLib.ConnectionStatus.CONNECTING:
                //console.log('正在链接');
                break;
              case RongIMLib.ConnectionStatus.DISCONNECTED:
                console.log('断开连接');
                break;
              case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                console.log('其他设备登录');
                break;
              case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                console.log('域名不正确');
                break;
              case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                console.log('网络不可用');
                break;
            }
          }
        });

        // 消息监听器
        RongIMClient.setOnReceiveMessageListener({
          // 接收到的消息
          onReceived: (message)=>
          {
            //console.log(message);

            // 判断消息类型
            switch (message.messageType)
            {
              case RongIMClient.MessageType.TextMessage:
                this.OnReceiveMessage(message);
                // message.content.content => 消息内容
                break;
              case RongIMClient.MessageType.VoiceMessage:
                // 对声音进行预加载                
                // message.content.content 格式为 AMR 格式的 base64 码
                break;
              case RongIMClient.MessageType.ImageMessage:
                // message.content.content => 图片缩略图 base64。
                // message.content.imageUri => 原图 URL。
                break;
              case RongIMClient.MessageType.DiscussionNotificationMessage:
                // message.content.extension => 讨论组中的人员。
                break;
              case RongIMClient.MessageType.LocationMessage:
                // message.content.latiude => 纬度。
                // message.content.longitude => 经度。
                // message.content.content => 位置图片 base64。
                break;
              case RongIMClient.MessageType.RichContentMessage:
                // message.content.content => 文本消息内容。
                // message.content.imageUri => 图片 base64。
                // message.content.url => 原图 URL。
                break;
              case RongIMClient.MessageType.InformationNotificationMessage:
                // do something...
                break;
              case RongIMClient.MessageType.ContactNotificationMessage:
                // do something...
                break;
              case RongIMClient.MessageType.ProfileNotificationMessage:
                // do something...
                break;
              case RongIMClient.MessageType.CommandNotificationMessage:
                // do something...
                break;
              case RongIMClient.MessageType.CommandMessage:
                // do something...
                break;
              case RongIMClient.MessageType.UnknownMessage:
                // do something...
                break;
              default:
              // do something...
            }
          }
        });

        webapi.getRongCloudUserToken().then((obj) =>
        {
          //console.log("UserToken:" + obj.UserToken);
          this.RongCloudID = obj.RongCloudUserID;
          RongIMClient.connect(obj.UserToken, {
            onSuccess: (userId) =>
            {
              //console.log("Connect successfully." + userId);

              var callback = {
                onSuccess: (userId) =>
                {
                  console.log("Reconnect successfully." + userId);
                },
                onTokenIncorrect: () =>
                {
                  console.log('token无效');
                },
                onError: (errorCode) =>
                {
                  console.log(errorcode);
                }
              };
              var config = {
                // 默认 false, true 启用自动重连，启用则为必选参数
                auto: true,
                // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
                url: 'https://cdn.ronghub.com/RongIMLib-2.2.6.min.js',
                // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
                rate: [100, 1000, 3000, 6000, 10000]
              };
              RongIMClient.reconnect(callback, config);

            },
            onTokenIncorrect: ()=>
            {
              console.log('token无效');
            },
            onError: (errorCode) =>
            {
              var info = '';
              switch (errorCode)
              {
                case RongIMLib.ErrorCode.TIMEOUT:
                  info = '超时';
                  break;
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                  info = '未知错误';
                  break;
                case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                  info = '不可接受的协议版本';
                  break;
                case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                  info = 'appkey不正确';
                  break;
                case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                  info = '服务器不可用';
                  break;
              }
              console.error("ErrorCode:"+errorCode);
            }
          });
         
        });

      },
      InitEmoji()
      {
        var config = {
          size: 24, // 大小, 默认 24, 建议18 - 58
          url: "//f2e.cn.ronghub.com/sdk/emoji-48.png", // Emoji 背景图片
          lang: "zh", // Emoji 对应名称语言, 默认 zh
          // 扩展表情
          extension: {
            dataSource: {
              u1F914: {
                en: "thinking face", // 英文名称
                zh: "思考", // 中文名称
                tag: "🤔", // 原生 Emoji
                position: "0 0" // 所在背景图位置坐标
              }
            },
            // 新增 Emoji 背景图 url
            url: "//cdn.ronghub.com/thinking-face.png"
          }
        };
        RongIMLib.RongIMEmoji.init();
        /*
        //Emoji 转名称
        var message = "😀😁测试 Emoji";
        // 将 message 中的原生 Emoji 转化为对应名称
        RongIMLib.RongIMEmoji.emojiToSymbol(message);
        // => "[笑嘻嘻][露齿而笑]测试 Emoji"

        //名称转 Emoji
        var message = "[笑嘻嘻][露齿而笑]测试 Emoji";
        // 将 message 中的 Emoji 对应名称转化为原生 Emoji
        RongIMLib.RongIMEmoji.symbolToEmoji(message);
        // => "😀😁测试 Emoji"

        //Emoji 转 HTML
        var message = "\uf600测试 Emoji";
        // 将 message 中的原生 Emoji (包含 Unicode ) 转化为 HTML
        RongIMLib.RongIMEmoji.emojiToHTML(message);
        // => "<span class='rong-emoji-content' name='[笑嘻嘻]'>😀</span>测试 Emoji"

        //名称转 HTML
        var message = "[露齿而笑]测试 Emoji";
        // 将 message 中的 Emoji 对应名称转化为 HTML
        RongIMLib.RongIMEmoji.symbolToHTML(message);
        // => "<span class='rong-emoji-content' name='[露齿而笑]'>😁</span>测试 Emoji"
        */
      },
      End()
      {
        this.rongCloudGroupName = "";
        this.messageList = [];
        this.sendTxt = "";
      },
      Enter(evt)
      {
        if (evt.ctrlKey == true)
        {
          this.sendTxt = this.sendTxt + "\r\n";
        }
        else
        {
          this.Send();
        }
      },
      Send()
      {       
        if (Trim(this.sendTxt) == "") return;
        var msg = new RongIMLib.TextMessage({ content: RongIMLib.RongIMEmoji.symbolToEmoji(this.sendTxt), extra: this.userID });
        var conversationtype = RongIMLib.ConversationType.GROUP; // 单聊,其他会话选择相应的消息类型即可。
        //console.log("rongCloudGroupName:"+this.rongCloudGroupName);
        //var targetId = "9472";
        var targetId = RongCloudContext.rongCloudGroupName; // 目标 Id
        RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
          onSuccess: (message)=>
          {
            this.OnReceiveMessage({ messageId: 0, senderUserId: this.RongCloudID, targetId: RongCloudContext.rongCloudGroupName, content: { content: RongIMLib.RongIMEmoji.symbolToEmoji(this.sendTxt)}});
            this.sendTxt = "";
            //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
            //console.log("Send successfully");
          },
          onError: (errorCode, message)=>
          {
            var info = '';
            switch (errorCode)
            {
              case RongIMLib.ErrorCode.TIMEOUT:
                info = '超时';
                break;
              case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                info = '未知错误';
                break;
              case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                info = '在黑名单中，无法向对方发送消息';
                break;
              case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                info = '不在讨论组中';
                break;
              case RongIMLib.ErrorCode.NOT_IN_GROUP:
                info = '不在群组中';
                break;
              case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                info = '不在聊天室中';
                break;
              default:
                info = x;
                break;
            }
            console.log('发送失败:' + info);
          }
        }
        );
      },
      OnReceiveMessage(message)
      {
        //var html = RongIMLib.RongIMEmoji.emojiToHTML(message.content.content)+"<br />";
        //$("#rongcloudview-messages").append(html);
        //gid("rongcloudview-messages").scrollTop = gid("rongcloudview-messages").scrollHeight;
        if (message.targetId != RongCloudContext.rongCloudGroupName)
        {
          console.log("Check targetId:" + message.targetId + ",rongCloudGroupName:" + RongCloudContext.rongCloudGroupName);
          return;
        }
        this.showMessage(message);
        //this.showMessage(message).then((success) =>
        //{
        //  if (!success) return;
        //  //$("#rongcloudview-messages").append(html);
        //  //console.log(gid("rongcloudview-messages").scrollTop);
        //  //gid("rongcloudview-messages").scrollTop = gid("rongcloudview-messages").scrollHeight;
        //  //console.log(gid("rongcloudview-messages").scrollTop);

        //  var scrollHeight = $('#rongcloudview-list').prop("scrollHeight");
        //  $('#rongcloudview-list').scrollTop(scrollHeight, 200);
        //});

      },
      clearMessages()
      {
        //$("#rongcloudview-messages").empty();
        this.messageList = [];
      },
      showEmojiList()
      {
        if (this.showemojiList == true)
        {
          this.showemojiList = false;
          return;
        }
        if (this.emojiList.length == 0)
        {
          var list = RongIMLib.RongIMEmoji.list;
          this.emojiList = list;
        }

        this.showemojiList = true;
      },
      getEmojiTitle(emoji)
      {
        return emoji.symbol.replace("[", "").replace("]", "");
      },
      insertEmoji(evt)
      {
        var tar = evt.currentTarget;
        //this.sendTxt = this.sendTxt+"["+$(tar).attr("title")+"]";
        this.sendTxt = this.sendTxt + $(tar).html();
        this.showemojiList = false;

        this.OnReceiveMessage({ content: { content: this.sendTxt}});
      },
      sendTxtChange()
      {
        console.log("onchane");
      },
      showMessage(message)
      {
        this.getUserInfo(message.senderUserId).then((userinfo) =>
        {
          if (userinfo == null)
          {
            console.log("get userinfo error");
            return;
          }
          var msg = {
            ID: message.messageId,
            AvatarUrl: userinfo.AvatarUrl == "" ? "/static/images/defaultface.png" : userinfo.AvatarUrl,
            UserName: userinfo.UserName,
            UserNameCss: this.getRoleClass(userinfo.RoleInLesson, message.senderUserId),
            Content: RongIMLib.RongIMEmoji.symbolToEmoji(message.content.content)
          };
          RongCloudContext.messageList.push(msg);

          var scrollHeight = $('#rongcloudview-list').prop("scrollHeight");
          $('#rongcloudview-list').scrollTop(scrollHeight, 200);
        });
      },
      getRoleClass(role,senderId)
      {
        if (senderId == this.RongCloudID)
        {
          return "me";
        }
        switch (role + "")
        {
          case "1":
            return "student";
            break;
          case "2":
            return "teacher";
            break;
          case "3":
            return "auditor";
            break;
          default:
            return "auditor";
            break;
        }
      },
      getUserInfo(rid,uid)
      {
        return new Promise((resolve, reject) =>
        {
          for (var cache of this.userInfoCache)
          {
            if (cache.RongCloudID + "" == rid + "")
            {
              resolve(cache);
              return;
            }
          }
          webapi.getUserInfoByRongID([rid]).then((info) =>
          {
            if (info == null)
            {
              resolve(null);
              return;
            }
            for (var u of info)
            {
              if (u.RongCloudID + "" == rid + "")
              {
                this.userInfoCache.push(u);
                resolve(u);
              }
            }
            resolve(null);
          });
        });
      }
    }
  }
</script>
