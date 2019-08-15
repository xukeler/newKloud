  //var ws = new WebSocket(“ws://echo.websocket.org”);
  //ws.onopen = function () { ws.send(“Test!”); };
  //ws.onmessage = function (evt) { loger.log(evt.data); ws.close(); };
  //ws.onclose = function (evt) { loger.log(“WebSocketClosed!”); };
  //ws.onerror = function (evt) { loger.log(“WebSocketError!”); };
//var pako = require('pako');
//var Base64 = require('js-base64').Base64;
import loger from '../common/log.js';
var MyStorage = sessionStorage;
export default {
  stat: {},
  _ws: null,
  _sessionid: "",
  _timeout: 5000,
  _logincallback: null,
  _afterlogincallback: null,
  _joinmeetingcallback: null,
  _synccallback: null,
  _receivecallback: null,
  _hellowcallback: null,
  _leavecallback: null,
  _opencallback: null,
  _sendmessagecallback: null,
  _makepresentercallback: null,
  _kickoutcallback: null,
  _endmeetingcallback: null,
  _invitecallback: null,
  _uploadfilecallback: null,
  _up2studentcallback: null,
  _startlessoncallback: null,
  _onlinecallback: null,
  _offlinecallback: null,
  _kloudcallcallback: null,
  _needreconnect: true,
  _heartbeattimer: null,
  _tosendlist:[],
  _sendtimer: null,
  _islogin: true,
  _isloging: false,
  _isopen: false,
  _lastHellowEnd: true,
  _lastConnectTime: null,
  _lastHeartBeatTime: null,
  _lastJoinMeetingTime: null,
  _changeNumber: 0,
  _meetingID: 0,
  _currentDocumentId: null,
  _currentMode: null,
  _currentPageNumber: null,
  _currentPresenter: null,
  _currentStatus: null,
  _currentMaxVideoUserId: null,
  _msgBuf: new JsMap(),
  _lastReceiveTime: new Date(),
  _isPresenter: false,
  _currentStatus: 0,
  _currentLine: 0,
  _currentModeID: 0,
  _currentPageID: 0,
  _currentDocID: 0,
  onDocumentIDChange: null,
  onModeChange: null,
  onUserListChange: null,
  onPageNumberChange: null,
  onPresenterChange: null,
  onCurrentStatusChange: null,
  onMaxVideoUserIDChange: null,
  onErrorMessage: null,
  onSocketClose: null,
  onSocketOpen: null,
  onHeartBeat:null,
  onKickMeeting: null,
  onActivityDetected: null,
  onCreateKloudCallError: null,
  onKloudCallEnd: null,
  onOtherLogin: null,
  onMasterLessonStart: null,
  onAudioSyncAck: null,
  onStartRecordAudioCallBack: null,
  onStartRecordLessonCallBack:null,
  init(callback, needlogin)
  {
      
    this._sessionid = MyStorage.getItem('UserToken');
    this.log("web socket init!" + this.getwebsocketurl());
    this._lastConnectTime = new Date();
    try
    {
      this._ws = new WebSocket(this.getwebsocketurl());
    }
    catch (exp)
    {

    }
    if (callback) this._opencallback = callback;
    this._ws.onopen = () =>
    {
      this._lastConnectTime = null;
      this.log("web socket opened");
      this._isopen = true;

      if (needlogin && this._islogin == false)
      {
        needlogin = false;
        var name = MyStorage.getItem('UserData.Name');
        this.login(name);
      }
      if (this._opencallback)
      {
        if (this._islogin)
        {
          this._opencallback();
        }
        else
        {
          setTimeout(() =>
          {
            if (this._opencallback) this._opencallback();
          }, this._timeout + this._timeout * 2 / 3);
        }
      }
      if (this.onSocketOpen) this.onSocketOpen();
            
    };
    this._ws.onerror = (evt) =>
    {
      //this.log("WebSocketError!");
      this._isopen = false;
      //this._islogin = false;
      //if (this._needreconnect) {
      //    setTimeout(() => { this.reconnect() }, this._timeout);
      //}
    };
    this._ws.onclose = (evt) =>
    {
      //console.log(evt)
      this.log("WebSocketClosed!");
      this._isopen = false;
      //this._msgBuf.clear();
      if (this.onSocketClose) this.onSocketClose();
      //this._islogin = false;
      //if (this._needreconnect) {
      //    setTimeout(() => { this.reconnect() }, this._timeout);
      //}
    };
    this.onreceive();
    if (this._heartbeattimer) clearTimeout(this._heartbeattimer);
    this._heartbeattimer = setInterval(() => { this.heartbeat() }, this._timeout);

    if (this._sendtimer) clearTimeout(this._sendtimer);
    this._sendtimer = setInterval(() => { this.sendqueue(); }, 20);
    

    //this.ws.onmessage = function (evt) {
    //    var d = utf8to16(base64decode(evt.data));
    //    loger.log("onmessage:" + d)

    //};
  },
  isopen()
  {
    return this._isopen;
  },
  login(userName, callback)
  {
    //var send = new Object();
    //send.action = "LOGIN";
    //send.sessionId = this._sessionid;
    //send.userName = userName;
    //var msg = JSON.stringify(send);
    ////var msg = String.format("0@action|sessionId|userName|\n1@LOGIN|{0}|{1}|", this._sessionid, userName);
    //this.log(msg);
    //this._isloging = true;

    this._logincallback = (d) =>
    {
      if (d.retCode == "-1401")
      {
        this._needreconnect = false;
        //this._islogin = false;
        this.logout();
        if (this._kickoutcallback)
        {
          this._kickoutcallback();
        }
        return;
      }
      //this._isloging = false;
      //this._islogin = true;
      if (callback) callback(d);
      if (this._afterlogincallback) this._afterlogincallback(d);
    };
    //this.send(base64encode(utf16to8(msg)));
    //this.send(msg);

  },
  ///Role: student: 1, teacher: 2, auditor: 3
  joinmeeting(meetingId, meetingPassword, role, isInstant, callback, lessonId = 0, mode = 0)
  {
    var send = new Object();
    send.action = "JOIN_MEETING";
    send.sessionId = this._sessionid;
    send.meetingId = meetingId;
    send.meetingPassword = meetingPassword;
    //send.clientVersion = "v20140605.0";
    send.role = role;
    send.isInstantMeeting = isInstant;
    send.lessonId = lessonId;
    send.mode = mode;//1:sync room 0:ohter

    var msg = JSON.stringify(send);
    //var msg = String.format("0@action|sessionId|meetingId|meetingPassword|clientVersion|role|isInstantMeeting|\n1@JOIN_MEETING|{0}|{1}|{2}|v20140605.0|{3}|{4}|", this._sessionid, meetingId, meetingPassword, role, isInstant);
    //this.log(msg);
    this._joinmeetingcallback = callback;
    //this.send(base64encode(utf16to8(msg)));
    this._lastJoinMeetingTime = new Date();
    this.send(msg);
  },
  sendmessage(userlist, data)
  {
    var send = new Object();
    send.action = "SEND_MESSAGE";
    send.sessionId = this._sessionid;
    send.type = userlist == "" ? 0 : 1;
    send.userList = userlist;
    send.data = data;
    var msg = JSON.stringify(send);
    //var msg = String.format("0@action|sessionId|type|userList|data|\n1@SEND_MESSAGE|{0}|{1}|{2}|{3}|", this._sessionid, userlist == "" ? 0 : 1, userlist, data);
    //this.log(msg);
    //this.send(base64encode(utf16to8(msg)));
    this.send(msg);
  },
  leavemeeting(callback)
  {
    var send = new Object();
    send.action = "LEAVE_MEETING";
    send.sessionId = this._sessionid;
    var msg = JSON.stringify(send);

    //var msg = String.format("0@action|sessionId|\n1@LEAVE_MEETING|{0}|", this._sessionid);
    //this.log(msg);
    this._leavecallback = callback;
    //this.send(base64encode(utf16to8(msg)));
    this.send(msg);
  },
  endmeeting(callback)
  {
    var send = new Object();
    send.action = "END_MEETING";
    send.sessionId = this._sessionid;
    var msg = JSON.stringify(send);
    //var msg = String.format("0@action|sessionId|\n1@END_MEETING|{0}|", this._sessionid);
    //this.log(msg);
    if (callback)
    {
      this._endmeetingcallback = callback;
    }
    //this.send(base64encode(utf16to8(msg)));
    this.send(msg);
  },
  makepresenter(meetingId, psessionid, callback)
  {
    var send = new Object();
    send.action = "MAKE_PRESENTER";
    send.sessionId = this._sessionid;
    send.meetingId = meetingId;
    send.newPresenterSessionId = psessionid;
    var msg = JSON.stringify(send);
    //var msg = String.format("0@action|sessionId|meetingId|newPresenterSessionId|\n1@MAKE_PRESENTER|{0}|{1}|{2}|", this._sessionid, meetingId, psessionid);
    //this.log(msg);
    this._makepresentercallback = callback;
    //this.send(base64encode(utf16to8(msg)));
    this.send(msg);
  },
  inviteuser(meetingId, users)
  {
    var send = new Object();
    send.action = "INVITE_TO_MEETING";
    send.sessionId = this._sessionid;
    send.meetingId = meetingId;
    send.userIds = users;
    var msg = JSON.stringify(send);
    //var msg = String.format("0@action|sessionId|meetingId|userIds|\n1@INVITE_TO_MEETING|{0}|{1}|{2}|", this._sessionid, meetingId, users);
    //this.log(msg);
    //this.send(base64encode(utf16to8(msg)));
    this.send(msg);
  },
  uptostudent(meetingId, puid, callback)
  {
    var send = new Object();
    send.action = "PROMOTE_TO_STUDENT";
    send.sessionId = this._sessionid;
    send.meetingId = meetingId;
    send.userId = puid;
    var msg = JSON.stringify(send);
    //var msg = String.format("0@action|sessionId|meetingId|userId|\n1@PROMOTE_TO_STUDENT|{0}|{1}|{2}|", this._sessionid, meetingId, puid);
    //this.log(msg);
    //this._makepresentercallback = callback;
    //this.send(base64encode(utf16to8(msg)));
    this.send(msg);
  },
  setmeetingstat(meetingId, stat, lessonid)
  {
    var send = new Object();
    send.action = "MEETING_STATUS";
    send.sessionId = this._sessionid;
    send.meetingId = meetingId;
    send.status = stat;
    send.lessonId = lessonid;
    this._currentStatus = stat;
    var msg = JSON.stringify(send);
    //var msg = String.format("0@action|sessionId|meetingId|status|lessonId|\n1@MEETING_STATUS|{0}|{1}|{2}|{3}|", this._sessionid, meetingId, stat, lessonid);
    //this.log(msg);
    //this.send(base64encode(utf16to8(msg)));
    this.send(msg);
  },
  setremovenotice(meetingIds)
  {
    var send = new Object();
    send.action = "REMOVE_JOIN_MEETING_NOTICE";
    send.sessionId = this._sessionid;
    send.meetingIds = meetingIds;
    var msg = JSON.stringify(send);
    //var msg = String.format("0@action|sessionId|meetingIds|\n1@REMOVE_JOIN_MEETING_NOTICE|{0}|{1}|", this._sessionid, meetingIds);
    //this.log(msg);
    //this.send(base64encode(utf16to8(msg)));
    this.send(msg);
  },
  updatemeetingstatus(meetingIds)
  {
    var send = new Object();
    send.action = "UPDATE_TO_JOIN_MEETING_READ_STATUS";
    send.sessionId = this._sessionid;
    send.meetingIds = meetingIds;
    var msg = JSON.stringify(send);
    //var msg = String.format("0@action|sessionId|meetingIds|\n1@UPDATE_TO_JOIN_MEETING_READ_STATUS|{0}|{1}|", this._sessionid, meetingIds);
    //this.log(msg);
    //this.send(base64encode(utf16to8(msg)));
    this.send(msg);
  },
  updatemeetingdocid(docid,pagenumber=0)
  {
    var send = new Object();
    send.action = "UPDATE_CURRENT_ITEM_ID";
    send.sessionId = this._sessionid;
    send.documentId = docid;
    send.itemId = docid;
    send.pageNumber = pagenumber;
    var msg = JSON.stringify(send);
    //var msg = String.format("0@action|sessionId|meetingIds|\n1@UPDATE_TO_JOIN_MEETING_READ_STATUS|{0}|{1}|", this._sessionid, meetingIds);
    //this.log(msg);
    //this.send(base64encode(utf16to8(msg)));
    this.send(msg);
  },
  updatemeetingatmid(docid)
  {
    var send = new Object();
    send.action = "UPDATE_CURRENT_ATTACHMENT_ID";
    send.sessionId = this._sessionid;
    send.documentId = docid;
    var msg = JSON.stringify(send);
    //var msg = String.format("0@action|sessionId|meetingIds|\n1@UPDATE_TO_JOIN_MEETING_READ_STATUS|{0}|{1}|", this._sessionid, meetingIds);
    //this.log(msg);
    //this.send(base64encode(utf16to8(msg)));
    this.send(msg);
  },
  updateprepareinfo(lectureid, lessonid = 0)//type: 1 -- lecture; 2 -- lesson
  {
    var send = new Object();
    send.action = "UPDATE_PREPARE_LESSON_INFO";
    send.sessionId = this._sessionid;
    //send.meetingId = meetingid;
    //send.type = type;
    if (lessonid > 0)
    {
      send.type = 2;
      send.lectureId = 0;
      send.lessonId = lessonid;
    }
    else
    {
      send.type = 1;
      send.lectureId = lectureid;
      send.lessonId = 0;
    }
      

    var msg = JSON.stringify(send);
    //this.log(msg);
    this.send(msg);
  },
  createconference(phone)
  {
    var send = new Object();
    send.action = "CREATE_KLOUD_CALL_CONFERENCE";
    send.sessionId = this._sessionid;
    send.phoneNumber = phone;
    var msg = JSON.stringify(send);
    //this.log(msg);
    this.send(msg);
  },
  endconference()
  {
    var send = new Object();
    send.action = "END_KLOUD_CALL_CONFERENCE";
    send.sessionId = this._sessionid;
    var msg = JSON.stringify(send);
    //this.log(msg);
    this.send(msg);
  },
  callme(phone)
  {
    var send = new Object();
    send.action = "CALL_ME";
    send.sessionId = this._sessionid;
    send.phoneNumber = phone;
    var msg = JSON.stringify(send);
    //this.log(msg);
    this.send(msg);
  },
  speaking()
  {
    var send = new Object();
    send.action = "MEMBER_SPEAKING";
    send.sessionId = this._sessionid;
    var msg = JSON.stringify(send);
    //this.log(msg);
    this.send(msg);
  },
  audiosync(stat, itemid, time = 0, callback = null,count=0)
  {
    var send = new Object();
    send.action = "AUDIO_SYNC";
    send.sessionId = this._sessionid;
    send.status = stat; //status --- 1:start; 0:end
    send.soundtrackId = itemid;
    send.duration = time;
    send.actionCount = count;
    this.onAudioSyncAck = (d) =>
    {
      if (callback) callback(d);
    }
    var msg = JSON.stringify(send);
    //this.log(msg);
    this.send(msg);
  },
  startRecordLesson(lessonid,callback)
  {
    var send = new Object();
    send.action = "START_ROCORD_LESSON";
    send.sessionId = this._sessionid;
    send.lessonId = lessonid; 
    this.onStartRecordLessonCallBack = (d) =>
    {
      if (callback) callback(d);
    }
    var msg = JSON.stringify(send);
    //this.log(msg);
    this.send(msg);
  },
  endRecordLesson(lessonid,callback)
  {
    var send = new Object();
    send.action = "END_ROCORD_LESSON";
    send.sessionId = this._sessionid;
    send.lessonId = lessonid; 
    this.onEndRecordLessonCallBack = (d) =>
    {
      if (callback) callback(d);
    }
    var msg = JSON.stringify(send);
    //this.log(msg);
    this.send(msg);
  },
  startRecordAudio(callback)
  {
    var send = new Object();
    send.action = "START_RECORD_AUDIO";
    send.sessionId = this._sessionid;
    this.onStartRecordAudioCallBack = (d) =>
    {
      if (callback) callback(d);
    }
    var msg = JSON.stringify(send);
    //this.log(msg);;
    this.send(msg);
  },
  endRecordAudio(audioid,callback)
  {
    var send = new Object();
    send.action = "END_RECORD_AUDIO";
    send.sessionId = this._sessionid;
    send.audioId = audioid;
    this.onEndRecordAudioCallBack = (d) =>
    {
      if (callback) callback(d);
    }
    var msg = JSON.stringify(send);
    //this.log(msg);;
    this.send(msg);
  },
  syncRecordTime(time)
  {
    var send = new Object();
    send.action = "SYNC_LESSON_TIME";
    send.sessionId = this._sessionid;
    send.time = time;
  
    var msg = JSON.stringify(send);
    //this.log(msg);;
    this.send(msg);
  },
  agorastat(agoraStatus,microphoneStatus,cameraStatus)
  {
    var send = new Object();
    send.action = "AGORA_STATUS_CHANGE";
    send.sessionId = this._sessionid;
    send.agoraStatus = agoraStatus; //status --- 1:error; 0:ok
    send.microphoneStatus = microphoneStatus;
    send.cameraStatus = cameraStatus;
    var msg = JSON.stringify(send);//agoraStatus
    //this.log(msg);;
    this.send(msg);
  },
  startrecordlesson()
  {
    // var send = new Object();
    // send.action = "RECORDING_READY";
    // send.sessionId = this._sessionid;
    // //send.meetingId = meetingid;
    // var msg = JSON.stringify(send);
    // //this.log(msg);;
    // this.send(msg);
  },
  setleavemeetingcallback(callback)
  {
    this._leavecallback = callback;
  },
  setopencallback(callback)
  {
    this._opencallback = callback;
  },
  setsendmessagecallback(callback)
  {
    this._sendmessagecallback = callback;
  },
  setmakepresentercallback(callback)
  {
    this._makepresentercallback = callback;
  },
  setkickoutcallback(callback)
  {
    this._kickoutcallback = callback;
  },
  setlogincallback(callback)
  {
    this._logincallback = callback;
  },
  setendmeetingcallback(callback)
  {
    this._endmeetingcallback = callback;
  },
  setinvitecallback(callback)
  {
    this._invitecallback = callback;
  },
  setuploadfilecallback(callback)
  {
    this._uploadfilecallback = callback;
  },
  setup2studentcallback(callback)
  {
    this._up2studentcallback = callback;
  },
  setstartlessoncallback(callback)
  {
    this._startlessoncallback = callback;
  },
  setafterlogincallback(callback)
  {
    this._afterlogincallback = callback;
  },
  setofflinecallback(callback)
  {
    this._offlinecallback = callback;
  },
  setonlinecallback(callback)
  {
    this._onlinecallback = callback;
  },
  setkloudcallcallback(callback)
  {
    this._kloudcallcallback = callback;
  },
  setreconnect(reconnect)
  {
    this._needreconnect = reconnect;
  },
  setmeetingid(meetingid)
  {
    this._meetingID = meetingid;
  },
  sendsyncactions(data, attachmentid, callback)
  {
    //this.log(data);
    var send = new Object();
    send.action = "ACT_FRAME";
    send.sessionId = this._sessionid;
    send.retCode = 1;
    send.data = base64encode(utf16to8(data));
    send.itemId = attachmentid;
    send.sequenceNumber = 0;
    //send.ideaType = "document";
    var msg = JSON.stringify(send);
    //var msg = String.format("0@action|sessionId|retCode|data|itemId|sequenceNumber|ideaType|\n1@ACT_FRAME|{0}|1|{1}|{2}|0|document|", this._sessionid, base64encode(utf16to8(data)), attachmentid);
    //this.log(msg);;
    this._synccallback = callback;
    //this.send(base64encode(utf16to8(msg)));
    this.send(msg);
  },
  receivesyncaction(callback)
  {
    this._receivecallback = callback;
  },
  heartbeat()
  {
    if (this._lastHeartBeatTime && (new Date() - this._lastHeartBeatTime) < 4500)
    {
      return;
    }
    this._lastHeartBeatTime = new Date();
    if (this._lastReceiveTime && (new Date() - this._lastReceiveTime) > 30000)
    {
      //this.log("Long time can't connect to server!Exist meeting!");
      //if (this.onKickMeeting) this.onKickMeeting("Can't connect to server! Please join again.");
    }
    if ((this._isopen == false && this._needreconnect) || (this._lastReceiveTime && this._needreconnect && (new Date() - this._lastReceiveTime) > 14000))
    {
      this.reconnect();
      return;
    }
    if (this._sessionid == null || this._sessionid == "")
    {
      this._sessionid = MyStorage.getItem('UserToken');
    }
    if (this._sessionid == null || this._sessionid == "")
    {
      //this._heartbeattimer = setTimeout(() => { this.heartbeat(); }, this._timeout);
    }
    else
    {
      if (!this._needreconnect)
      {
        //this._heartbeattimer = setTimeout(() => { this.heartbeat(); }, this._timeout);
        return;
      }
      //readyState 0:connecting 1:connected 2: closing 3 closed

      var send = new Object();
      send.action = "HELLO";
      send.sessionId = this._sessionid;
      send.changeNumber = this._changeNumber == null ? 0 : this._changeNumber;
      send.meetingId = typeof (this._meetingID) == "undefined" ? "0" : this._meetingID + "";
      if (this._isPresenter && send.meetingId != "" && send.meetingId != "0")
      {
        send.status = this._currentStatus;
        send.currentLine = this._currentLine;
        send.currentMode = this._currentModeID;
        send.currentPageNumber = this._currentPageID;
        send.currentItemId = this._currentDocID;
      }
      var msg = JSON.stringify(send);
      //var msg = String.format("0@action|sessionId|\n1@HELLO|{0}|", this._sessionid);
      //this.log(msg);;
      this._hellowcallback = (d) =>
      {
        if (this.onHeartBeat) this.onHeartBeat();
        //this._lastHellowEnd = true;
        if (d.retCode == "-1401")
        {
          if (this._kickoutcallback)
          {
            this._kickoutcallback();
          }
          this._needreconnect = false;
          this._islogin = false;
          this.logout();
          return;
        }
        else if (d.retCode == "-1002")
        {
          if (this.onKickMeeting) this.onKickMeeting("");
        }
        else if (d.retCode == "-1005")
        {
          //d.meetingId
          //this.log("To join room:" + d.meetingId + "?");
          //if (window.confirm("You dropped out of class last time. Do you want to rejoin?"))
          //{
          //  location.href = "/live/" + d.meetingId;
          //}
          //else
          //{
          //  this.endmeeting();
          //}
          if (this._lastJoinMeetingTime && (new Date() - this._lastJoinMeetingTime) < 5000)
          {
            this._lastJoinMeetingTime = null;
            return;
          }
          if (location.href.toLocaleLowerCase().indexOf("/live/") == -1)
          {
            this._meetingID = 0;
            this.leavemeeting();
          }
          return;
        }
        else if (parseInt(d.retCode) < 0)
        {
          return;
        }
        if (MyStorage.getItem('UserData.UserID') == null || MyStorage.getItem('UserToken') == null)
        {
          if (this._kickoutcallback)
          {
            this._kickoutcallback();
          }
          this._needreconnect = false;
          this._islogin = false;
          this.logout();
          return;
        }
        if (d.data && d.data != "")
        {
          var obj = JSON.parse(utf8to16(base64decode(d.data)));
          var userid = MyStorage.getItem('UserData.UserID').replace("-", "");
          var isPresenter = false;
          if (obj.currentPresenter && obj.currentPresenter != "" && obj.currentPresenter + "" == userid)
          {
            isPresenter = true;
          }
          //this.log("currentPresenter:"+obj.currentPresenter + "=" + userid);
          if (obj.meetingOver == false)
          {
            if (isPresenter == false)
            {
              if (obj.currentItemId && obj.currentItemId != "")
              {
                //if (obj.currentItemId != this.currentItemId)
                {
                  if (this.onDocumentIDChange) this.onDocumentIDChange(obj.currentItemId, obj.currentPageNumber);
                }
                this._currentDocumentId = obj.currentItemId;
              }
              if (obj.currentMaxVideoUserId && obj.currentMaxVideoUserId != "")
              {
                //if (obj.currentMaxVideoUserId != this._currentMaxVideoUserId)
                {
                  if (this.onMaxVideoUserIDChange) this.onMaxVideoUserIDChange(obj.currentMaxVideoUserId);
                }
                this._currentMaxVideoUserId = obj.currentMaxVideoUserId;
              }
              if (obj.currentMode && obj.currentMode != "")
              {
                //if (obj.currentMode != this._currentMode)
                {
                  if (this.onModeChange) this.onModeChange(obj.currentMode);
                }
                this._currentMode = obj.currentMode;
              }
              if (obj.currentPageNumber && obj.currentPageNumber != "")
              {
                //if (obj.currentPageNumber != this._currentPageNumber)
                {
                  if (this.onPageNumberChange) this.onPageNumberChange(obj.currentPageNumber,obj.currentItemId);
                }
                this._currentPageNumber = obj.currentPageNumber;
              }
              if (obj.currentPresenter && obj.currentPresenter != "")
              {
                //if (obj.currentPresenter != this._currentPresenter)
                {
                  if (this.onPresenterChange) this.onPresenterChange(obj.currentPresenter);
                }
                this._currentPresenter = obj.currentPresenter;
              }
              if (obj.currentStatus && obj.currentStatus != "")
              {
                //if (obj.currentPresenter != this._currentPresenter)
                {
                  if (this.onCurrentStatusChange) this.onCurrentStatusChange(obj.currentStatus);
                }
                this._currentStatus = obj.currentStatus;
              }
                
            }
            if (obj.changeLogs && obj.changeLogs.length > 0)
            {
              for (var changelog of obj.changeLogs)
              {
                if (changelog.action == "JOIN_MEETING" && this._changeNumber == 0)
                {
                  continue;
                }
                if (changelog.action == "JOIN_MEETING" || changelog.action == "LEAVE_MEETING")
                {
                  if (this.onUserListChange)
                  {
                    if (changelog.usersList)
                    {
                      this.onUserListChange(changelog.usersList);
                    }
                    else if (changelog.retData && changelog.retData.usersList)
                    {
                      this.onUserListChange(changelog.retData.usersList);
                    }
                  }
                }
                // else if(changelog.action=="SEND_MESSAGE")
                // {
                //   var log = JSON.parse(utf8to16(base64decode(changelog.data)));
                //   if (log.actionType && (log.actionType == 8 || log.actionType == 9 || log.actionType == 16))
                //   {
                //     console.log("break:"+JSON.stringify(log));
                //     continue;  
                //   }
                //   else
                //   {
                //     this.doreceiveaction(changelog);
                //   }
                // }
                else
                {
                  this.doreceiveaction(changelog);
                }
              }
            }
          }
          else
          {
            if (location.href.toLowerCase().indexOf("/live/") > -1)
            {
              if (this.onKickMeeting) this.onKickMeeting("");
            }
          }
          if (obj.maxChangeNumber && obj.maxChangeNumber > 0)
          {
            this._changeNumber = obj.maxChangeNumber;
          }
        }
        else
        {
          if (location.href.toLowerCase().indexOf("/live/") > -1)
          {
            this.reset4existmeeting();
            if (this.onKickMeeting) this.onKickMeeting("");
          }
        }
        //this._heartbeattimer = setTimeout(() => { this.heartbeat(); }, this._timeout);
      };


      //this._lastHellowEnd = false;
      this.send(msg);

    }

  },
  send(txt)
  {
    this._tosendlist.push(txt);
    return;
    //txt = base64encode(utf16to8(txt));
    if (this._ws.readyState == 0)
    {
      //setTimeout(() =>
      //{
      //  this._ws.send(txt);
      //}, this._timeout / 2);
    }
    else if (this._ws.readyState == 2 || this._ws.readyState == 3)
    {
      //if (this._needreconnect==true)
      //{
      //  this.reconnect();
      //}
    }
    else
    {
      this._ws.send(txt);
      //this.sendEx(txt);
    }
  },
  sendqueue()
  {     
    if (this._ws && this._ws.readyState == 1&&this._tosendlist.length>0)
    {
      //console.log(this._ws.bufferedAmount);
      var toshend = this._tosendlist.shift();
      if (toshend)
      {
        this._ws.send(toshend);
        this.log("Send:"+toshend);
      }
    }
  },
  sendEx(tosend)
  {
    //loger.log(tosend.length);
    //var binaryString = pako.deflate(tosend, { to: 'string' });
    //var txt =pako.inflate(binaryString, { to: 'string' });
    //loger.log(binaryString.length);
    //loger.log(txt.length);
    //var txt = pako.gzip(tosend, { to: 'string' });
    //txt = base64encode(utf16to8(txt));
    //txt = Base64.encode(txt);
    //loger.log("ToSend:" + txt);
    //var msg = utf8to16(base64decode(txt));
    //var data = pako.ungzip(msg, { to: 'string' });
    //loger.log("ToSenddata:" + data);
    var txt = tosend;
    var buf = 30000;//30000
    if (txt.length > buf)
    {
      var total = Math.ceil(txt.length / buf);
      var guid = GUID();
      for (var i = 1; i <= total; i++)
      {
        try
        {
          var msg = guid + ":" + total + ":" + i + "#" + txt.substr((i - 1) * buf, buf);
          //loger.log("send:"+msg);
          this._ws.send(msg);
        }
        catch (ex) { }
      }
    }
    else
    {
      try
      {
        //loger.log("send:" + txt);
        this._ws.send(GUID() + ":1:1#" + txt);
      }
      catch (ex) { }
    }
  },
  onreceive()
  {
    this._ws.onmessage = (evt) =>
    {
      this._isopen = true;
      this._lastReceiveTime = new Date();
      var data = evt.data;
      this.onmessage(data);
      return;
      //this.log("OnMessage:" + data);
      var arr = data.split("#");
      var arg = arr[0].split(":");
      if (arr.length == 1)
      {
        this.onmessage(data);
      }
      else if (arg[1] == arg[2] && arg[1] == "1")
      {
        this.onmessage(arr[1]);
      }
      else
      {
        if (arg[2] == "1")
        {
          this._msgBuf.set(arg[0], [arr[1]]);
        }
        else if (arg[1] == arg[2])
        {
          var old = this._msgBuf.get(arg[0]);
          old.push(arr[1]);
          this.onmessage(old.join(""));
          this._msgBuf.remove(arg[0]);
          old = null;
        }
        else
        {
          var old = this._msgBuf.get(arg[0]);
          old.push(arr[1]);
          this._msgBuf.set(arg[0], old);
            
        }
      }
       
    };
  },
  str2utf8(str)
  {
    var encoder = new TextEncoder('utf8');
    return encoder.encode(str);
  },
  onmessage(data)
  {
    //msg = Base64.decode(msg);
    //var data = pako.ungzip(msg, { to: 'string' });
    var d = utf8to16(base64decode(data));
    this.log("Receive:" + d);
    var obj = this.parseaction(d);
    if (!obj)
    {
      return;
    }
    this.doreceiveaction(obj);
  },
  doreceiveaction(obj)
  {
    var callback = null;
    if (obj.changeNumber && obj.changeNumber > 0)
    {
      this._changeNumber = obj.changeNumber;
    }

    switch (obj.action)
    {
      case "LOGIN":
        callback = this._logincallback;
        break;
      case "JOIN_MEETING":
        callback = this._joinmeetingcallback;
        //this._changeNumber = obj.changeNumber;
        break;
      case "ACT_FRAME":
        callback = this._synccallback;
        break;
      case "BROADCAST_FRAME":
        callback = this._receivecallback;
        break;
      case "HELLO":
        callback = this._hellowcallback;
        break;
      case "LEAVE_MEETING":
        callback = this._leavecallback;
        //this._changeNumber = obj.changeNumber;
        break;
      case "SEND_MESSAGE":
        callback = this._sendmessagecallback;
        break;
      case "MAKE_PRESENTER":
        callback = this._makepresentercallback;
        break;
      case "KICKOUT":
        callback = this._kickoutcallback;
        break;
      case "END_MEETING":
        callback = this._endmeetingcallback;
        //this._changeNumber = obj.changeNumber;
        break;
      case "INVITE_TO_MEETING":
        callback = this._invitecallback;
        break;
      case "ATTACHMENT_UPLOADED":
        callback = this._uploadfilecallback;
        break;
      case "PROMOTE_TO_STUDENT":
        callback = this._up2studentcallback;
        break;
      case "MEETING_STATUS":
        callback = this._startlessoncallback;
        break;
      case "UPDATE_CHANGE_NUMBER":
          
        break;
      case "OFFLINE_MODE":
        callback = this._offlinecallback;
        break;
      case "ONLINE_MODE":
        callback = this._onlinecallback;
        break;
      case "KLOUD_CALL_STARTED":
        callback = this._kloudcallcallback;
        break;
      case "CREATE_KLOUD_CALL_CONFERENCE":
        callback = this.onCreateKloudCallError;
        break;
      case "END_KLOUD_CALL_CONFERENCE":
        callback = this.onKloudCallEnd;
        break;
      case "NO_ACTIVITY_DETECTED":
        callback = this.onActivityDetected;
        break;
      case "MASTER_LESSON_START":
        callback = this.onMasterLessonStart;
        break;
      case "USER_JOIN_MEETING_ON_OTHER_DEVICE":
        callback = this.onOtherLogin;
        break;
      case "AUDIO_SYNC_ACK":
        callback = this.onAudioSyncAck;
        break;
      default:
        break;
    }
    if (callback)
    {
      callback(obj);
    }
  },
  reconnect()
  {
    this.log("websocket reconnect");
      
    //if (this.onErrorMessage) this.onErrorMessage("The network connection is unstable and is being reconnected!");
    //loger.error("The network connection is unstable and is being reconnected!");
    if (this._ws==null)
    {
      this.log("init in reconnect");
      this.init(null, false);
      return;
    }
    var onopenfun = this._ws.onopen;
    var onerrorfun = this._ws.onerror;
    var onclosefun = this._ws.onclose;
    var onmessagefun = this._ws.onmessage;
    var closefun = () =>
    { 
      this._isopen = false;
      //this._msgBuf.clear();
      if (this.onSocketClose) this.onSocketClose();

      this._lastConnectTime = new Date();
      try
      {        
        this._ws = null; 
        this._ws = new WebSocket(this.getwebsocketurl());
      }
      catch (exp)
      {

      }
      this._ws.onopen = onopenfun;
      this._ws.onerror = onerrorfun;
      this._ws.onclose = onclosefun;
      this._ws.onmessage = onmessagefun;
    };
    this._ws.onclose = (evt) =>
    { 
      this.log("onclose in reconnect");    
      closefun();

    };
    
    if (this._isopen)
    {
      this._ws.close();
      this._ws = null; 
    }
    else
    {
      closefun();
    }

  },
  log(log)
  {
    loger.log(new Date().toLocaleTimeString() + " " + log);
  },
  logout()
  {
    this._needreconnect = false;
    this._islogin = false;
    if (this._ws != null)
    {
      //this._ws.onclose();
      this._ws.close();
    }
  },
  reset4existmeeting()
  {
    this.onSocketOpen = null;
    this.onSocketClose = null;
    this.onKickMeeting = null;
    this._joinmeetingcallback = null;
    this._changeNumber = 0;
  },
  reset()
  {    
    this._joinmeetingcallback = null;
    this._endmeetingcallback = null;
    this._kickoutcallback = null;
    this.onDocumentIDChange = null;
    this.onModeChange = null;
    this.onUserListChange = null;
    this.onPageNumberChange = null;
    this.onPresenterChange = null;
    this.onCurrentStatusChange = null;
    this.onMaxVideoUserIDChange = null;
    this.onErrorMessage = null;
    this.onSocketClose = null;
    this.onSocketOpen = null;
    this.onHeartBeat = null;
    this.onKickMeeting = null;
    this.onActivityDetected = null;
    this.onCreateKloudCallError = null;
    this.onKloudCallEnd = null;
    this.onOtherLogin = null;
    this.onMasterLessonStart = null;
    this.onAudioSyncAck = null;

    this._meetingID = 0;
  },
  getwebsocketurl()
  {
    let bs = window.sessionStorage.getItem('BTabSocketSessionID');
    if (!bs)
    {
      bs = GUID();
      sessionStorage.setItem('BTabSocketSessionID', bs);
    }
    return GetWebSocketUrl() + "/" + this._sessionid + "/0/" + bs;
  },
  parseaction(txt)
  {
    try
    {
      var obj = JSON.parse(txt);
      return obj;
    }
    catch (ex)
    {
      return {};
    }
    //var result = new Array();
    //result.push(obj);
    //return result;  
  },
  parseactionEx(txt)
  {
    var arr = txt.split("\n");
    var result = new Array();

    for (var i = 0; i < arr.length;)
    {
      if (arr[i][0] == "0" && arr[i + 1][0] == "1")
      {
        var def = arr[i].substr(2);
        var val = arr[i + 1].substr(2);
        var defarr = def.split("|");
        var valarr = val.split("|");
        var action = new Object();
        action.time = 0;
        for (var j = 0; j < defarr.length; j++)
        {
          switch (defarr[j])
          {
            case "action":
              action.action = valarr[j];
              break;
            case "sessionId":
              action.sessionId = valarr[j];
              break;
            case "userName":
              action.userName = valarr[j];
              break;
            case "meetingId":
              action.meetingId = valarr[j];
              break;
            case "userId":
              action.userId = valarr[j];
              break;
            case "userIds":
              action.userIds = valarr[j];
              break;
            case "retCode":
              action.retCode = parseInt(valarr[j]);
              break;
            case "usersList":
              action.usersList = valarr[j];
              break;
            case "phoneInfo":
              action.phoneInfo = valarr[j];
              break;
            case "sequenceNumber":
              action.sequenceNumber = valarr[j];
              break;
            case "data":
              action.data = valarr[j];
              break;
            case "toJoinMeeting":
              action.toJoinMeeting = valarr[j];
              break;
            case "presenterId":
              action.presenterId = valarr[j];
              break;
            case "presenterSessionId":
              action.presenterSessionId = valarr[j];
              break;
            case "lastActiveMeetingId":
              action.lastActiveMeetingId = valarr[j];
              break;
            case "status":
              action.status = parseInt(valarr[j]);
              break;
            case "CurrentDocumentPage":
              action.CurrentDocumentPage = valarr[j];
              break;
            default:
              break;
          }
        }
        result.push(action);

        i = i + 2
      }
      else
      {
        i++;
      }
    }
    return result;
  },
  end()
  {
    if (this._heartbeattimer) clearTimeout(this._heartbeattimer);
    if (this._sendtimer) clearTimeout(this._sendtimer);
    
    this._needreconnect = false;
    //this._ws.onclose();
    this._ws.close();
  }
}
