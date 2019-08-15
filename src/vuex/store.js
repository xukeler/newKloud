import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  meetingID: '',
  showAttachmentInfo: {},
  videoMode: null,
  msgVideMode: null,
  shareMode: 0,
  lessonState: 0,
  inviteLesson: [],
  lessonID: 0,
  enableVideo: false,
  enableAudio: true,
  joinRole: 1,
  screenRes: "",
  shareRes: "1080P",
  prepareMode: 0,
  audioServerLineID: -1,
  kloudCallStat: 0,
  playVideoInfo: null,
  currentMenuType: "",
  audioMuteStat: -1,
  videoMuteStat: -1,
  classRoomRouteName: "",
  createCourseFlag: "",
  cameraBarStat: -1,
  autoPlayAudioInfo: null,
  teacherLessonID: 0,
  sizeMode: 0,
  removeItemID:0,
  Klassroom: {
    name: "",
    type: 0,
    type1: 0,
    currentFolder: -1,
    currentCohort: 0,
    currentTerm: {id: -1, year: -1},
  },
  Connected: "",
  KlassroomSettings: {
    enableCampus: true,
    enableCollege: true,
    enableDepartment: true,
    enableSpecialty: true,
    termCount: 0,
    term1: 'Autumn',
    term2: 'Winter',
    term3: 'Spring',
    term4: 'Summer',
    term1Start: new Date(),
    term1End: new Date(),
    term2Start: new Date(),
    term2End: new Date(),
    term3Start: new Date(),
    term3End: new Date(),
    term4Start: new Date(),
    term4End: new Date(),
    cohortCount: 0,
    cohort1: "Undergraduate",
    cohort2: "Graduate",
    cohort3: "Postgraduate",
    cohort4: "Adult Education",
    cohort5: "Online",
  },
  AdminMode: false,
  shareDoc:{
    attachmentId:"",
    attachmentName:'',
    attachmentUrl:"",
  },
  kloudsyncShareDoc:{
    attachmentId: "",
    attachmentName: '',
    attachmentUrl: "",
  },
  kloudsyncTopic: {
    currentTeam: {id: 0, name: ''},
    currentSpace: {id: 0, name: ''},
    currentTopic: {id: 0, name: ''}
  },
  myMeetingRoomID:"",
  showActivityType:'showAllSchoolActivity',
  showScheduleType:'showAllSchoolSchedule',
  showcacheComponentList:[],
}
const getters = {
  getConected: state => {
    return state.Connected;
  },
  getAdminMode: state => {
    return state.AdminMode;
  },
  getCreateCourseFlag: state => {
    return state.createCourseFlag;
  },
  getclassRoomRoute: state => {
    return state.classRoomRouteName;
  },
  getcurrentMenuType: state => {
    return state.currentMenuType;
  },
  getInviteLesson: state => {
    return state.inviteLesson;
  },
  getLessonID: state => {
    return state.lessonID;
  },
  getShareMode: state => {
    return state.shareMode;
  },
  getEnableVideo: state => {
    return state.enableVideo;
  },
  getEnableAudio: state => {
    return state.enableAudio;
  },
  getJoinRole: state => {
    return state.joinRole;
  },
  getScreenRes: state => {
    return state.screenRes;
  },
  getShareRes: state => {
    return state.shareRes;
  },
  getAudioServerLineID: state => {
    return state.audioServerLineID;
  },
  getKlassroom: state => {
    return state.Klassroom;
  },
  shareDoc: state => {
    return state.shareDoc;
  },
  kloudsyncShareDoc:state=>{
    return state.kloudsyncShareDoc;
  },
  kloudsyncTopic: state => {
    return state.kloudsyncTopic;
  },
  getMyMeetingRoomID: state => {
    return state.myMeetingRoomID;
  },
  getShowActivityType: state => {
    return state.showActivityType;
  },
  getShowScheduleType: state => {
    return state.showScheduleType;
  },
  getShowcacheComponentList: state => {
    return state.showcacheComponentList;
  }
}
const mutations = {
  changeConnected(state, str) {
    state.Connected = str;
  },
  changeAdminMode(state, obj) {
    state.AdminMode = obj;
  },
  changeCreateCourseFlag(state, str) {
    state.createCourseFlag = str;
  },
  changeClassRoomRoute(state, str) {
    state.classRoomRouteName = str;
  },
  changeCurrentMenuType(state, str) {
    state.currentMenuType = str;
  },
  changeAttachment(state, obj) {
    state.showAttachmentInfo = obj;
  },
  changeVideoMode(state, obj) {
    state.videoMode = obj;
  },
  changeMsgVideoMode(state, obj) {
    state.msgVideMode = obj;
  },
  changShareMode(state, obj) {
    state.shareMode = obj;
  },
  changLessonState(state, obj) {
    state.lessonState = obj;
  },
  changeInviteLesson(state, obj) {
    state.inviteLesson = obj;
  },
  changeLessonID(state, obj) {
    state.lessonID = obj;
  },
  changeEnableVideo(state, obj) {
    state.enableVideo = obj;
  },
  changeEnableAudio(state, obj) {
    state.enableAudio = obj;
  },
  changeJoinRole(state, obj) {
    state.joinRole = obj;
  },
  changeScreenRes(state, obj) {
    state.screenRes = obj;
  },
  changeShareRes(state, obj) {
    state.shareRes = obj;
  },
  changePrepareMode(state, obj) {
    state.prepareMode = obj;
  },
  changeAudioServerLineID(state, obj) {
    state.audioServerLineID = obj;
  },
  changeKloudCallStat(state, obj) {
    state.kloudCallStat = obj;
  },
  changePlayVideoInfo(state, obj) {
    state.playVideoInfo = obj;
  },
  changeAudioMuteStat(state, obj) {
    state.audioMuteStat = obj;
  },
  changeVideoMuteStat(state, obj) {
    state.videoMuteStat = obj;
  },
  changeCameraBarStat(state, obj) {
    state.cameraBarStat = obj;
    },
    changeTeacherLessonID(state, obj) {
        state.teacherLessonID = obj;
      },
  resetVuex4ExistRoom(state, obj) {
    //state.meetingID = '';
    state.showAttachmentInfo = {};
    state.videoMode = null;
    state.msgVideMode = null;
    state.shareMode = 0;
    state.lessonState = 0;
    //state.inviteLesson = [];
    state.lessonID = 0;
    //state.enableVideo = false;
    //state.enableAudio = true;
    state.joinRole = 1;
    state.screenRes = "";
    state.shareRes = "1080P";
    state.prepareMode = 0;
    state.audioServerLineID = -1;
    state.kloudCallStat = 0;
    state.playVideoInfo = null;
    state.audioMuteStat = -1;
    state.videoMuteStat = -1;

    state.classRoomRouteName = "";
    state.cameraBarStat = -1;
    state.autoPlayAudioInfo = null;
    state.teacherLessonID = 0;
    state.shareDoc.attachmentId="";
    state.shareDoc.attachmentName = "";
    state.kloudsyncShareDoc.attachmentId = "";
    state.kloudsyncShareDoc.attachmentName = "";
    state.sizeMode = 0;
    state.removeItemID = 0;
  },
  changeKlassroom(state, obj) {
    state.Klassroom.name = obj.SchoolName;
    state.Klassroom.type = obj.Category1;
    state.Klassroom.type1 = obj.Category2;
  },
  changeShareDoc(state, params) {
    state.shareDoc.attachmentId = params.attachmentId;
    state.shareDoc.attachmentName = params.attachmentName;
    state.shareDoc.attachmentUrl = params.attachmentUrl;
  },
  changeKloudsyncShareDoc(state, params) {
    state.kloudsyncShareDoc.attachmentId = params.attachmentId;
    state.kloudsyncShareDoc.attachmentName = params.attachmentName;
    state.kloudsyncShareDoc.attachmentUrl = params.attachmentUrl;
  },
  changeAutoPlayAudioInfo(state, obj) {
    state.autoPlayAudioInfo = obj;
  },
  changeKlassroomSettings(state, list) {
    list.forEach(item => {
      switch (item.SettingID) {
        case 1001:
          state.KlassroomSettings.enableCampus = item.SettingValue > 0;
          break;
        case 1002:
          state.KlassroomSettings.enableCollege = item.SettingValue > 0;
          break;
        case 1003:
          state.KlassroomSettings.enableDepartment = item.SettingValue > 0;
          break;
        case 1004:
          state.KlassroomSettings.enableSpecialty = item.SettingValue > 0;
          break;
                                    
        case 2000:
          state.KlassroomSettings.termCount = item.SettingValue;
          break;
        case 2001:
          state.KlassroomSettings.term1 = item.SettingText;
          break;
        case 2002:
          state.KlassroomSettings.term2 = item.SettingText;
          break;
        case 2003:
          state.KlassroomSettings.term3 = item.SettingText;
          break;
        case 2004:
          state.KlassroomSettings.term4 = item.SettingText;
          break;

        case 2011:
          state.KlassroomSettings.term1Start = new Date(parseInt(item.SettingText));
          break;
        case 2012:
          state.KlassroomSettings.term2Start = new Date(parseInt(item.SettingText));
          break;
        case 2013:
          state.KlassroomSettings.term3Start = new Date(parseInt(item.SettingText));
          break;
        case 2014:
          state.KlassroomSettings.term4Start = new Date(parseInt(item.SettingText));
          break;

        case 2021:
          state.KlassroomSettings.term1End = new Date(parseInt(item.SettingText));
          break;
        case 2022:
          state.KlassroomSettings.term2End = new Date(parseInt(item.SettingText));
          break;
        case 2023:
          state.KlassroomSettings.term3End = new Date(parseInt(item.SettingText));
          break;
        case 2024:
          state.KlassroomSettings.term4End = new Date(parseInt(item.SettingText));
          break;
            
        case 3000:
          state.KlassroomSettings.cohortCount = item.SettingValue;
          break;
        case 3001:
          state.KlassroomSettings.cohort1 = item.SettingText;
          break;
        case 3002:
          state.KlassroomSettings.cohort2 = item.SettingText;
          break;
        case 3003:
          state.KlassroomSettings.cohort3 = item.SettingText;
          break;
        case 3004:
          state.KlassroomSettings.cohort4 = item.SettingText;
          break;
        case 3005:
          state.KlassroomSettings.cohort5 = item.SettingText;
          break;
      }
    });
  },
  changeKloudsyncTopic(state, params) {
    state.kloudsyncTopic.currentTeam = params.currentTeam;
    state.kloudsyncTopic.currentTopic = params.currentTopic;
  },
  changeMyMeetingRoomID(state, str) {
    state.myMeetingRoomID = str;
  },
  changeSizeMode(state, mode) {
    state.sizeMode = mode;
  },
  changeRemoveItemID(state, id) {
    state.removeItemID = id;
  },
  changeShowActivityType(state ,str) {
    state.showActivityType = str;
  },
  changeShowScheduleType(state, str) {
    state.showScheduleType = str;
  },
  changeShowcacheComponentList(state,obj) {
    state.showcacheComponentList = obj;
  }
}
const actions = {
  ShowAttments({commit}, params) {
  },
  getKlassroom({commit}, params) {
    return new Promise((resolve, reject) => {
      const url = GetAPIUrl() + "School/SimpleSchoolInfo?schoolID=" + params.schoolId;
      $.ajax({
        type: 'GET',
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", params.token);
        },
        success: function (result) {
          if (result.RetCode === 0) {
            commit("changeKlassroom", result.RetData);
            resolve();
          }
          else { // error
            console.log(result);
            reject(result);
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          console.log(xhr);
          reject(xhr);
        }
      });
    });
  },
  getKlassroomSettings({commit}, params) {
    return new Promise((resolve, reject) => {
      const url = GetAPIUrl() + "School/GetSettingList?SchoolID=" + params.schoolId;
      $.ajax({
        type: 'GET',
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", params.token);
        },
        success: function (result) {
          if (result.RetCode === 0) {
            commit("changeKlassroomSettings", result.RetData);
            resolve();
          }
          else { // error
            console.log(result);
            reject(result);
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          console.log(xhr);
          reject(xhr);
        }
      });
    });
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
