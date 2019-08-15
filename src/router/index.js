import Vue from 'vue'
import Router from 'vue-router'
import LiveLesson from '@/components/livelesson/livelesson'
import PreviewLesson from '@/components/livelesson/PreviewLesson'
import SyncRoom from '@/components/livelesson/SyncRoom'
import PreviewLecture from '@/components/livelesson/PreviewLecture'
import PreviewDocument from '@/components/livelesson/PreviewDocument'
import PlayLesson from '@/components/livelesson/PlayLesson'
import ViewRouter from '@/components/views/viewrouter'
import SyncView from '@/components/livelesson/SyncView'
import LessonView from '@/components/livelesson/LessonView'
import CoursesView from '@/components/views/CoursesView'
import ActivityView from '@/components/views/ActivityView'
import ScheduleView from '@/components/views/ScheduleView'
import CourseList from '@/components/courses/CourseList'
import CourseItem from '@/components/courses/CourseItem'
import CreateCourse from '@/components/courses/CreateCourse'
import CreateLesson from '@/components/courses/CreateLesson'
import CreateMeeting from '@/components/courses/ScheduleMeeting'
import StudentsView from '@/components/views/StudentsView'
import TeachersView from '@/components/views/TeachersView'
import ProfileView from '@/components/views/ProfileView'
import SchoolListView from '@/components/views/SchoolListView'
import SchoolItemView from '@/components/school/SchoolItemView'
import SchoolContacts from '@/components/school/SchoolContacts'
import SchoolFiles from '@/components/school/SchoolFiles'
import SchoolProfile from '@/components/school/SchoolProfile'
import SchoolActiveCourses from '@/components/school/ActiveCourses'
import SchoolFinishedCourses from '@/components/school/FinishedCourses'
import SchoolCourseTemplates from '@/components/school/CourseTemplates'
import UserProfile from '@/components/views/UserProfile'
import Login from '@/components/Login'
import Register from '@/components/Register'
import ForgetPassworld from '@/components/ForgetPassworld'
import Join from '@/components/Join'
import MyFavorite from '@/components/user/Favorite'
import UserSetting from '@/components/user/Setting'
import Preview from '@/components/views/Preview'
import Meeting from '@/components/Meeting'

// for klassroom
import KlassroomView from '@/components/klassroom/MainView'
import KlassroomCourses from '@/components/klassroom/CoursesView'
import KlassroomHomework from '@/components/klassroom/Homework'
import KlassroomStudents from '@/components/klassroom/StudentsView'
import KlassroomTeachers from '@/components/klassroom/TeachersView'
import KlassroomCustomers from '@/components/klassroom/CustomersView'
import KlassroomSetting from '@/components/klassroom/SettingView'
import KlassroomProfile from '@/components/klassroom/ProfileView'
import KlassroomCreateCourse from '@/components/klassroom/CreateCourse'
import KlassroomCourseItem from '@/components/klassroom/CourseItem'
import KlassroomCreateLesson from '@/components/klassroom/CreateLesson'
import KlassroomSchoolProfile from '@/components/klassroom/SchoolProfile'
import KlassroomSchoolSettings from '@/components/klassroom/SchoolSettings'

//for kloudsync
import KloudSyncView from '@/components/kloudsync/MainView'
import KloudSyncDocuments from '@/components/kloudsync/Documents'
import KloudSyncChat from '@/components/kloudsync/Chat'
import KloudSyncContact from '@/components/kloudsync/Contact'
import KloudSyncMeeting from '@/components/kloudsync/Meeting'
import KloudSyncTopic from '@/components/kloudsync/Topic'
import KloudSyncRoom from '@/components/kloudsync/Room.vue'
import KloudSyncScheduleMeeting from '@/components/kloudsync/ScheduleMeeting'
import KloudsyncProfile from '@/components/kloudsync/ProfileView'
import KloudsyncHelp from '@/components/kloudsync/Help'
import KloudsyncSettings from '@/components/kloudsync/Settings'
import KloudsyncSettingsProfile from '@/components/kloudsync/SettingsProfile'
import KloudsyncSettingsPayment from '@/components/kloudsync/SettingsPayment'
import KloudsyncSettingsRole from '@/components/kloudsync/SettingsRole'
import KloudsyncSettingsAdmin from '@/components/kloudsync/SettingsAdmin'
import KloudsyncSettingsContact from '@/components/kloudsync/SettingsContact'
import KloudsyncSettingsTopicType from '@/components/kloudsync/SettingsTopicType'
import KloudsyncSettingsTopicCompany from '@/components/kloudsync/SettingsTopicCompany'
import KloudsyncInvitationNotice from '@/components/kloudsync/KloudsyncInvitationNotice'
import KloudsyncCreateCompany from '@/components/kloudsync/KloudsyncCreateCompany'

//for ProjectOne
import ProjectOneView from '@/components/for_project_one/MainView'
import ProjectOneDocuments from '@/components/for_project_one/Documents'
import ProjectOneChat from '@/components/for_project_one/Chat'
import ProjectOneContact from '@/components/for_project_one/Contact'
import ProjectOneMeeting from '@/components/for_project_one/Meeting'
import ProjectOneTopic from '@/components/for_project_one/Topic'
import ProjectOneRoom from '@/components/for_project_one/Room.vue'
import ProjectOneScheduleMeeting from '@/components/for_project_one/ScheduleMeeting'
import ProjectOneProfile from '@/components/for_project_one/ProfileView'
import ProjectOneHelp from '@/components/for_project_one/Help'

import auth from "../authenticator";

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: ViewRouter,
      children: [
        { name: '', path: '', redirect: 'schedule', meta: { needlogin: true } },
        { name: 'schedule', path: 'schedule', component: ScheduleView, meta: { needlogin: true } },
        { name: 'activity', path: 'activity', component: ActivityView, meta: { needlogin: true } },
        { name: 'profile', path: 'profile', component: UserProfile, meta: { needlogin: true } },
        {
          //name: 'courses',
          path: 'courses',
          component: CoursesView,
          children: [
            { name: 'courses', path: '', component: CourseList, meta: { needlogin: true } },
            { name: 'create-course', path: 'create', component: CreateCourse, meta: { needlogin: true } },
            { name: 'create-lesson', path: 'lesson/create', component: CreateLesson, meta: { needlogin: true } },
            { name: 'course-item', path: ':courseId', component: CourseItem, meta: { needlogin: true } },
            { name: 'schedule-meeting', path: 'meeting/create', component: CreateMeeting, meta: { needlogin: true } }
          ]
        },
        { name: 'students', path: 'students', component: StudentsView, meta: { needlogin: true } },
        { name: 'teachers', path: 'teachers', component: TeachersView, meta: { needlogin: true } },
        { name: 'schoolprofile', path: 'schoolprofile', component: ProfileView, meta: { needlogin: true } },
        {
          name: 'school',
          path: 'school',
          component: SchoolListView,
          children: [
            {
              name: 'school-item',
              path: ':schoolId',
              component: SchoolItemView,
              children: [
                { name: 'school-contacts', path: 'contact', component: SchoolContacts, meta: { needlogin: true } },
                { name: 'school-files', path: 'file', component: SchoolFiles, meta: { needlogin: true } },
                { name: 'school-profile', path: 'profile', component: SchoolProfile, meta: { needlogin: true } },
                //{name: 'school-course', path: 'course', redirect: {name: 'school-course-active'}},
                { name: 'school-course-active', path: 'course/active', component: SchoolActiveCourses, meta: { needlogin: true } },
                { name: 'school-course-finished', path: 'course/finished', component: SchoolFinishedCourses, meta: { needlogin: true } },
                { name: 'school-course-template', path: 'course/template', component: SchoolCourseTemplates, meta: { needlogin: true } },
                { name: 'school-course-create', path: 'course/create', component: CreateCourse, meta: { needlogin: true } },
                { name: 'school-course-item', path: 'course/:courseId', component: CourseItem, props: { isSchool: true }, meta: { needlogin: true } }
              ]
            }
          ]
        },
      ]
    },
    {
      name: 'klassroom',
      path: '/klassroom',
      component: KlassroomView,
      redirect: '/klassroom/courses',
      children: [
        { name: 'klassroom-schedule', path: 'schedule', component: ScheduleView, meta: { needlogin: true } },
        { name: 'klassroom-activity', path: 'activity', component: ActivityView, meta: { needlogin: true } },
        { name: 'klassroom-courses', path: 'courses', component: KlassroomCourses, meta: { needlogin: true } },
        { name: 'klassroom-homework', path: 'homework', component: KlassroomHomework, meta: { needlogin: true } },
        { name: 'klassroom-students', path: 'students', component: KlassroomStudents, meta: { needlogin: true } },
        { name: 'klassroom-teachers', path: 'teachers', component: KlassroomTeachers, meta: { needlogin: true } },
        { name: 'klassroom-customers', path: 'customers', component: KlassroomCustomers, meta: { needlogin: true } },
        { name: 'klassroom-setting', path: 'setting', component: KlassroomSetting, meta: { needlogin: true } },
        { name: 'klassroom-profile', path: 'profile', component: KlassroomProfile, meta: { needlogin: true } },
        { name: 'klassroom-create-course', path: 'courses/create', component: KlassroomCreateCourse, meta: { needlogin: true } },
        { name: 'klassroom-create-lesson', path: 'lesson/create', component: KlassroomCreateLesson, meta: { needlogin: true } },
        { name: 'klassroom-course-item', path: 'courses/:courseId', component: KlassroomCourseItem, meta: { needlogin: true } },
        { name: 'klassroom-school-profile', path: 'school/profile', component: KlassroomSchoolProfile, meta: { needlogin: true } },
        { name: 'klassroom-school-setting', path: 'school/setting', component: KlassroomSchoolSettings, meta: { needlogin: true } },
      ]
    },
    {
      name: 'kloudsync',
      path: '/kloudsync',
      component: KloudSyncView,
      redirect: '/kloudsync/documents',
      children: [
        { name: 'kloudsync-profile', path: 'profile', component: KloudsyncProfile, meta: { needlogin: true } },
        { name: 'kloudsync-documents', path: 'documents', component: KloudSyncDocuments, meta: { needlogin: true } },
        { name: 'kloudsync-chat', path: 'chat', component: KloudSyncChat, meta: { needlogin: true } },
        { name: 'kloudsync-contact', path: 'contact', component: KloudSyncContact, meta: { needlogin: true } },
        { name: 'kloudsync-meeting', path: 'meeting', component: KloudSyncMeeting, meta: { needlogin: true } },
        { name: 'kloudsync-topic', path: 'syncroom', component: KloudSyncTopic, meta: { needlogin: true } },
        { name: 'kloudsync-syncroom', path: 'syncroom', component: KloudSyncRoom, meta: { needlogin: true } },
        { name: 'kloudsync-schedule-meeting', path: 'schedule-meeting', component: KloudSyncScheduleMeeting, meta: { needlogin: true } },
        { name: 'kloudsync-help', path: 'help', component: KloudsyncHelp, meta: { needlogin: true } },
        { name: 'kloudsync-settings', path: 'settings', component: KloudsyncSettings, meta: { needlogin: true },
          children: [
            { name: 'kloudsync-settings-profile', path: 'profile', component: KloudsyncSettingsProfile, meta: { needlogin: true } },
            { name: 'kloudsync-settings-payment', path: 'payment', component: KloudsyncSettingsPayment, meta: { needlogin: true } },
            { name: 'kloudsync-settings-role', path: 'role', component: KloudsyncSettingsRole, meta: { needlogin: true } },
            { name: 'kloudsync-settings-admin', path: 'admin', component: KloudsyncSettingsAdmin, meta: { needlogin: true } },
            { name: 'kloudsync-settings-contact', path: 'contact', component: KloudsyncSettingsContact, meta: { needlogin: true } },
            { name: 'kloudsync-settings-topic-type', path: 'topic-type', component: KloudsyncSettingsTopicType, meta: { needlogin: true } },
            { name: 'kloudsync-settings-topic-company', path: 'topic-company', component: KloudsyncSettingsTopicCompany, meta: { needlogin: true } },
          ]
        }
      ]
    },
    {
      name: 'projectone',
      path: '/projectone',
      component: ProjectOneView,
      redirect: '/projectone/documents',
      children: [
        { name: 'projectone-profile', path: 'profile', component: ProjectOneProfile, meta: { needlogin: true } },
        { name: 'projectone-documents', path: 'documents', component: ProjectOneDocuments, meta: { needlogin: true } },
        { name: 'projectone-chat', path: 'chat', component: ProjectOneChat, meta: { needlogin: true } },
        { name: 'projectone-contact', path: 'contact', component: ProjectOneContact, meta: { needlogin: true } },
        { name: 'projectone-meeting', path: 'meeting', component: ProjectOneMeeting, meta: { needlogin: true } },
        { name: 'projectone-topic', path: 'syncroom', component: ProjectOneTopic, meta: { needlogin: true } },
        { name: 'projectone-syncroom', path: 'syncroom', component: ProjectOneRoom, meta: { needlogin: true } },
        { name: 'projectone-schedule-meeting', path: 'schedule-meeting', component: ProjectOneScheduleMeeting, meta: { needlogin: true } },
        { name: 'projectone-help', path: 'help', component: ProjectOneHelp, meta: { needlogin: true } },
      ]
    },
    { name: 'liveex', path: '/live', component: LiveLesson, meta: { needlogin: true } },
    { name: 'live', path: '/live/:id', component: LiveLesson, meta: { needlogin: true } },
    { name: 'syncmeeting', path: '/syncmeeting/:id', component: LiveLesson },
    { name: 'play', path: '/play', component: PlayLesson, meta: { needlogin: true } },
    { name: 'sync', path: '/sync/:shareid', component: SyncView },
    { name: 'meeting', path: '/meeting/:shareid', component: LessonView },
    { name: 'attachment', path: '/attachment/:id', component: PreviewDocument },
    { name: 'document', path: '/document/:id', component: PreviewDocument },
    { name: 'doc', path: '/doc/:id/:type?', component: PreviewLesson, meta: { needlogin: true } },
    { name: 'view', path: '/view/:id/:type?', component: PreviewLesson, meta: { needlogin: true } },
    { name: 'docview', path: '/docview/:id/:type?', component: PreviewLesson, meta: { needlogin: true } },
    { name: 'atm', path: '/atm/:id/:type?', component: PreviewLesson, meta: { needlogin: true } },
    { name: 'myroom', path: '/myroom/:id/:type?', component: PreviewLesson, meta: { needlogin: true } },
    { name: 'syncroom', path: '/syncroom/:id/:type?', component: SyncRoom, meta: { needlogin: true } },
    { name: 'lecture', path: '/lecture/:id&parentid=:courseID', component: PreviewLecture, meta: { needlogin: true } },
    { name: 'favorite', path: '/user/favorite', component: MyFavorite, meta: { needlogin: true } },
    { name: 'setting', path: '/user/setting', component: UserSetting, meta: { needlogin: true } },
    { name: 'login', path: '/login', component: Login },
    { name: 'kloudsync-invitation-notice', path: '/invitation-notice', component: KloudsyncInvitationNotice, meta: { needlogin: true } },
    { name: 'kloudsync-create-company', path: '/create-company', component: KloudsyncCreateCompany, meta: { needlogin: true } },
    { name: 'register', path: '/register', component: Register },
    { name: 'forgetPassworld', path: '/forgetPassworld', component: ForgetPassworld },
    { name: 'join', path: '/join/:id', component: Join },
    { name: 'preview', path: '/preview/:courseId', component: Preview, meta: { needlogin: true } },
    { name: 'start', path: '/start', component: Meeting, meta: { needlogin: true } },
    { path: '*', redirect: '/' }
  ]
})
router.beforeEach((to, from, next) => {
  if (from.name == "live") {
    if (window.CheckQuit) {
      if (!window.CheckQuit()) {
        next(false);
        return;
      }
    }
  }
  $("#baidutongji").remove();
  window._hmt = [];

  if (!to.meta.needlogin || to.meta.needlogin == false) {
    next();
    return;
  }

  if (auth.checkAuth()) {
    next();
  }
  else {
    var token = to.query.token;
    if (token && token != "") {
      //console.log("token:" + token);
      auth.loginWithToken(token);
      if (auth.checkAuth()) {
        next();
        return;
      }
    }
    let myid = localStorage.getItem('UserData.MyID');
    if (myid && myid != "") {
      auth.loginWithEncryptUserid(myid);
      if (auth.checkAuth()) {
        next();
        return;
      }
    }
    next({ path: '/login', query: { ReturnUrl: to.fullPath } });
  }
});
router.afterEach((to, from) => {
  LoadBaiduTongji();
});

export default router;
