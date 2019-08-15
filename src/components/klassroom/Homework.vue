<template>
  <div class="klassroom-homework">
    <div class="homework-left">
      <div class="course">
        <div class="course-header">
          {{$t('Homework.SelectAcourse')}}
        </div>
        <div class="course-switch-item">
          <Poptip ref="poptipCourse" placement="bottom-start">
            <div class="switch-space" :title="$t('Homework.PleaseSelectAcourse')" :class="isTeacherRole?'switch-teacher-spaces':'switch-student-spaces'">
              <div style="float:left"><Icon type="arrow-swap" size="18" v-show="isTeacherRole"></Icon></div>
              <div style="float:right" v-show="!isTeacherRole"><Icon type="arrow-swap" size="18"></Icon></div>
              <div class="current-Course-title" :style="{marginLeft:isTeacherRole?'10px':'0px'}" v-show="!isShowCurrentCourseDefaultTitle">{{currentCourse.title}}</div>
              <div class="current-Course-title" :style="{marginLeft:isTeacherRole?'10px':'0px'}" v-show="isShowCurrentCourseDefaultTitle">{{$t('Homework.PleaseSelectAcourse')}}</div>
            </div>
            <div slot="title" style="min-height: 32px">
              <b style="line-height:32px">{{$t('Homework.Courses')}}</b>
            </div>
            <div slot="content">
              <div style="margin: 0.5em;">
                <Input v-model="courseSearch" icon="ios-search" :placeholder="$t('Homework.Search')" style="width: 200px" @on-change="handleSearchCourse" @on-enter="handleSearchCourse" @on-click="handleSearchCourse"/>
              </div>

              <div class="course-list" :class="teamListClass" style="max-height: 50vh;overflow-y: auto;">
                <div v-for="item in courseList" :key="item.CourseID" class="course-item" :class="item.CourseID == currentCourse.id ? 'current-item' : ''" @click="handleSelectCourse(item)">
                  <div class="course-name">
                    <span style="margin-left: 10px;">{{item.Title}}</span>
                  </div>

                  <div class="course-info">
                    <div>{{item.StudentCount}} {{$t('Homework.Students')}}</div>
                    <div>{{item.TeacherCount}} {{$t('Homework.Teachers')}}</div>
                  </div>
                </div>
              </div>
            </div>        
          </Poptip>
          <div style="float:right;margin-right:-20px;margin-top:-10px" v-show="isTeacherRole">
            <Dropdown @on-click="handCourseAction($event)">
              <span style="cursor: pointer;padding:10px 20px">
                <Icon size="20" type="android-more-vertical"></Icon>
              </span>
              <DropdownMenu slot="list">
                <DropdownItem name="set">
                  {{$t('Homework.CourseSetting')}}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div style=" font-size: 14px;color: #bdc5b8;clear:both;">
            <span>5年级4班</span>
            <span style="padding:0px 3px;">|</span>
            <span style="margin-left:3px;">03/05 - 12/08</span>
          </div>
        </div>
      </div>
      <div class="homework">
        <div class="homework-title">
          <span style="color: #bdc5b8;">{{$t('Homework.SelectAhomework')}}</span>
        </div>
        <div class="homework-header">
          <Input v-model="searchHomework" icon="ios-search-strong" :placeholder="$t('Homework.Search')" style="width: 100%" @on-change="handleSearchHomework" @on-enter="handleSearchHomework" @on-click="handleSearchHomework" />
        </div>
        <div class="homework-content">
          <div v-for="item in homewrokList" :key="item.AssignmentID" class="homework-item" :class="{'homework-current' : item.AssignmentID === currentHomework.AssignmentID}" @click="handleSelectHomework(item)">
            <span class="homework-item-left">
              <span><Icon type="ios-checkmark" size="30"></Icon></span>
              <span class="current-team-title">{{item.Title}}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="homework-right">
      <div class="header">
        <p v-if="currentHomework.AssignmentID<0" style="font-size: 18px;font-weight: bold;overflow: hidden; max-width:400px;text-overflow: ellipsis;white-space: nowrap;">
          {{$t('Homework.PleaseSelectAhomework')}}
        </p>
        <p style="font-size: 18px;font-weight: bold;overflow: hidden; max-width:400px;text-overflow: ellipsis;white-space: nowrap;">
          {{currentHomework.Title}}
        </p>
        <div class="description-info">
          <div style="flex:1 1 200px;color:#bdc5b8">
            <span>布置时间：</span>
            <span style="margin-left:5px">周五 05-19</span>
            <span style="margin-left:10px">提交截止时间：</span>
            <span style="margin-left:5px">周一 06-19</span>
          </div>
          <div style="flex:0 0 150px;font-size:16px;" v-if="isTeacherRole">
            <span>{{$t('Homework.Submitted')}}</span>
            <span style="color:red;margin-left:5px;">15</span>
            <span>/</span>
            <span>30</span>
          </div>
        </div>
      </div>
      <div class="table-list">
        <Table :no-data-text="$t('Common.NoData')" :loading="loading"
            :data="tableData" :columns="tableColumn">
        </Table>
      </div>
    </div>
    <Modal v-model="showCourseModal" class="klassroom-course-moal-view" width="90%" :mask-closable="false" style="z-index:10; position: absolute;">
      <div slot="header" style="display:none"></div>
      <div slot="footer" style="display:none"></div>
      <div slot="close" style="display:none"></div>
      <modal-course-item ref="modalCourseItem"  :homeworkCourseId="currentCourse.id" v-if="showCourseModal"></modal-course-item>
    </Modal>
  </div>
</template>

<style lang="scss">
.klassroom-course-moal-view {
  .ivu-modal {
    height: 90%;
    top: 5%;
  }
  .ivu-modal-content {
    height: 100%;
  }
  .ivu-modal-header {
    border-bottom: 0px;
    padding: 10px 16px 0px 16px;
  }
  .ivu-modal-body {
    padding: 6px 6px 6px 6px;
    height: calc(100% - 30px);
  }
  .ivu-modal-footer {
    display: none;
  }
}
.klassroom-homework {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: stretch;

  .homework-left{
    flex: 1 0 400px;
    box-flex: 1;
    border-right: 1px solid #dddee1;

    .course{
      text-align: left;
      padding: 0px 30px;
      span{
        display: inline-block;
      }
      .course-header{
        font-size: 14px;
        color: #bdc5b8;
        padding: 20px 0px 10px 0px;
      }
      .course-switch-item{
        padding: 10px 0px;
        .switch-space{
          cursor: pointer;
          height: 22px;
          .current-Course-title{
            cursor: pointer;
            overflow: hidden; 
            max-width:270px;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height:18px;
            float:left;
            font-size: 16px;
          }
        }
        .switch-student-spaces{
          width:24em;
        }
        .course-list {
          display: flex;
          align-items:stretch;
          justify-content:flex-start;
          flex-wrap: wrap;
          min-width: 250px;

          .course-item {
            width: 240px;
            //height: 150px;
            margin: 5px;
            padding: 5px;
            border: 2px solid #dddee1;
            border-radius: 5px;
            cursor: pointer;
            white-space: normal;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .course-name {
              display: flex;
              align-items:center;
              justify-content:flex-start;
              padding: 5px;
              font-size: 14px;
            }

            .course-info {
              margin-top: 20px;
              color: #80848f;
              padding: 5px;
            }
          }
          
          .current-item {
            border-color: #2d8cf0;
          }
        }
        .one-item {
          width: 250px;
        }

        .two-items {
          width: 500px;
        }

        .three-items {
          width: 750px;
          .course-item{
            width:calc((100% - 30px)/3);
          }
        }
      }
    }
    .homework{
      text-align: left;
      margin-top: 1em;
      span{
        display: inline-block;
      }
      .homework-title{
        display: flex;
        flex-direction: row;
        justify-content:flex-start;
        align-items: center;
        padding: 0 30px;
        span{
          display: inline-block;
        }
        padding-bottom: 20px;
      }
      .homework-header{
        font-size: 13px;
        color: #bdc5b8;
        padding: 0 30px;
      }
      .homework-content{
        padding: 20px 0px;
      }

      .homework-item {
        display: flex;
        align-items:center;
        justify-content:flex-start;
        padding: 5px 30px;
        font-size: 14px;
        cursor: pointer;
        border-width: 1px 4px 1px 0px;
        border-style: solid;
        border-color: transparent;

        .homework-item-left{
          display:inline-block;
          flex:1 1 200px;
          align-items:center;
          display: flex;

          .current-team-title{
            padding-left: 10px;
            cursor: pointer;
            overflow: hidden; 
            max-width:300px;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .homework-current {
        background: #f6f9fd;
        border-color: #5cadff #2d8cf0;
      }
    }
  }
  .homework-right{
    flex: 5500 1 400px;
    box-flex: 5500;
    min-width: 400px;
    .header{
      width: 100%;
      text-align: left;
      padding: 20px;
      position: relative;
      border-bottom: 1px solid #dddee1;
      .description-info{
        display: flex;
        flex-direction: row;
        justify-content:flex-start;
        align-items: center;
        flex-wrap:wrap;
      }
    }
    .table-list{
      width: 100%;
      padding: 20px;
      .ivu-table-wrapper {
        border-left: 0;
      }
      .ivu-table::after {
        width: 0;
      }

      td {
        cursor: pointer;
      }
    }
  }
}
</style>

<script>
import auth from "../../authenticator";
import TeacherCardDetail from './TeacherCardDetail';
import StudentSubmitHomework from './StudentSubmitHomework';
import ModalCourseItem from '../courses/ModalCourseItem';
import webapi from "../../webapi/webapi.js";
var MyStorage = localStorage;

export default {
  data(){
    return {
      loading: false,
      courseFullList:[],
      courseList:[],
      teamListClass: "one-item",
      currentCourse:{
        id:-1,
        title:''
      },

      listType: 2,// 1: template, 2: active, 3: finished
      courseType:-1,// -1: all, 0: private, 1: public (for active or finished list)
      templateType:-1,// 1:  system, 2: personal, 3: school (for template list) {
      folderId: -1,
      cohortId: -1,
      termId: -1,
      courseSearch:'',
      
      homewrokList:[],
      homewrokFullList:[],
      searchHomework:'',
      currentHomework:{AssignmentID:-1},

      tableData:[],

      showCourseModal:false,
    }
  },
  components: {
    TeacherCardDetail,
    ModalCourseItem
  },
  computed: {
    schoolId() {
      return auth.getChosenSchoolId();
    },
    isTeacherRole(){
      return auth.isTeacher();
    },
    tableColumn(){
      return this.tableList();
    },
    isShowCurrentCourseDefaultTitle(){
      return this.courseList.length<=0;
    }
  },
  mounted() {
    this.loadCourseList();
  },
  methods: {
    handCourseAction(name){
      switch (name) {
        case 'set':
          this.showCourseModalFN();
          break;
        default:
          break;
      }

    },
    showCourseModalFN(){
      if(parseInt(this.currentCourse.id)<0){
        this.$Message.warning({content:'Please select a Course',duration:3});
        return;
      }
      this.showCourseModal = false;
      this.$nextTick(()=>{
        this.showCourseModal = true;
        let self = this;
        this.$nextTick(()=>{
          self.$refs.modalCourseItem.initialize();
        })
      })
    },
    loadCourseList(){
      let self = this;
      let url = GetAPIUrl() + "Course/List";
      url+="?listType="+this.listType;
      url+="&courseType="+this.courseType;
      url+="&templateType="+this.templateType;
      url+="&SchoolID="+this.schoolId;
      url+="&FolderID="+this.folderId;
      url+="&cohortID="+this.cohortId;
      url+="&semesterID="+this.termId;
      url+="&pageIndex=-1&pageSize=-1&sortBy=0&order=1";
      $.ajax({
        type: 'Get',
        url: url,
        beforeSend: function (request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function (data) {
          if (data.RetCode === 0) {
            self.courseFullList = data.RetData;
            self.courseList = data.RetData;

            switch (self.courseFullList.length) {
              case 0:
              case 1: 
                self.teamListClass = "one-item";
                break;
              case 2: 
                self.teamListClass = "two-items";
                break;      
              case 3: 
              default:
                self.teamListClass = "three-items";
                break;
            }

            if(self.courseFullList.length>=1){
              if(auth.getRememberCourse()){
                let courseId = auth.getRememberCourse();
                for(let item of  self.courseFullList){
                  if(courseId == item.CourseID){
                    self.handleSelectCourse(item);
                    return;
                  }
                }
                self.handleSelectCourse(self.courseFullList[0]);
              }else{
                self.handleSelectCourse(self.courseFullList[0]);
              }
            }
          }
          else { // error
            console.log(data);
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          console.log(xhr);
        }
      });
    },
    handleSelectCourse(item){
      this.currentCourse = {id:item.CourseID,title:item.Title};
      if(this.$refs.poptipCourse){
        this.$refs.poptipCourse.ok();
      }
      this.loadHomeworkList();
      //切换course,指控homework信息
      this.currentHomework = {AssignmentID:-1},
      this.tableData = [];
      auth.setRememberCourse(item.CourseID);
    },
    handleSearchCourse() {
      if (this.courseSearch) {
        let search = new RegExp(this.courseSearch, 'i');
        this.courseList = this.courseFullList.filter(item => {
          return item.Title.search(search) >= 0;
        });
      }
      else {
        this.courseList = this.courseFullList;
      }
    },
    handleSelectHomework(item){
      this.currentHomework = item;
      MyStorage.setItem("business.assignment",this.currentHomework.AssignmentID);
      if(this.isTeacherRole){
        this.loadTeacherExercisesList();////加载教师端习题列表
      }else{
        this.loadStudentExercisesList();//加载学生端习题列表
      }
      
    },
    loadStudentExercisesList(){
      let self = this;
      let url = GetAPIUrl() + "Homework/UserAssignmentData?assignmentID="+this.currentHomework.AssignmentID;
      this.tableData = [];
      $.ajax({
        type: 'Get',
        url: url,
        beforeSend: function (request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function (data) {
          if (data.RetCode === 0) {
            let exercisesList = data.RetData;
            self.tableData=self._exercisesStudentList(exercisesList);
          }
          else { // error
            console.log(data);
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          console.log(xhr);
        }
      });
    },
    loadTeacherExercisesList(){
      let self = this;
      let url = GetAPIUrl() + "Homework/AllAssignmentData?assignmentID="+this.currentHomework.AssignmentID;
      this.tableData = [];
      $.ajax({
        type: 'Get',
        url: url,
        beforeSend: function (request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function (data) {
          if (data.RetCode === 0) {
            let exercisesList = data.RetData;
            self.tableData=self._exercisesTeacherList(exercisesList);
          }
          else { // error
            console.log(data);
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          console.log(xhr);
        }
      });
    },
    _exercisesTeacherList(exercisesList) {
      let list = [];
      for(let item of exercisesList){
        let homeworkFiles = item.HomeworkFiles;
        let userInfo =  item.UserInfo;
        let teacherItem = {
          avatarUrl: userInfo.AvatarUrl?userInfo.AvatarUrl:'../../../static/images/user.svg',
          status: userInfo.Status==0?"批改":"未批改",
          points: "得分："+ 100,
          detail: item,
          _expanded:true,
          homeworks :homeworkFiles,
        };
        list.push(teacherItem);
      }
      return list;
    },
    _exercisesStudentList(exercisesList) {
      let list = [];
      for(let item of exercisesList){
        let homeworkItem = {
          homework: item.Title,
          status: item.Status==0?"批改":"未批改",
          reply:  item.Reply,
          points: "得分："+item.Points,
          detail: item,
        };
        list.push(homeworkItem);
      }
      return list;
    },
    handleSearchHomework() {
      if (this.searchHomework) {
        let search = new RegExp(this.searchHomework, 'i');
        this.homewrokList = this.homewrokFullList.filter(item => {
          return item.Title.search(search) >= 0;
        });
      }
      else {
        this.homewrokList = this.homewrokFullList;
      }
    },
    loadHomeworkList(){
      let self = this;
      let url = GetAPIUrl() + "Assignment/List?courseID="+this.currentCourse.id;
      $.ajax({
        type: 'Get',
        url: url,
        beforeSend: function (request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function (data) {
          if (data.RetCode === 0) {
            self.homewrokList = data.RetData;
            self.homewrokFullList = data.RetData;
            
            if(self.homewrokFullList.length>=1){
              if(MyStorage.getItem('business.assignment')){
                let rememberAssignmentID = MyStorage.getItem('business.assignment');
                for(let item of self.homewrokFullList){
                  if(item.AssignmentID == rememberAssignmentID){
                    self.handleSelectHomework(item);
                    return;
                  }
                }
                self.handleSelectHomework(self.homewrokFullList[0]);
              }else{
                self.handleSelectHomework(self.homewrokFullList[0]);
              }
            }
          }
          else { // error
            console.log(data);
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          console.log(xhr);
        }
      });
    },
    tableList() {
      const expend = {
        type: 'expand',
        width: 50,
        render: (h, params) => {
          return h(TeacherCardDetail, {
            props: {
              homeworkCardDetail: params.row.homeworks,
            }
          })
        }
      };
      const students = {
        title: this.$t("Common.Student"),
        key: "student",
        sortable: true,
        render: (h, params) => {
          return h("div",[
            h('Avatar', {
              props: {
                size: 'large',
                src: params.row.avatarUrl
              }
            }),
            h("span",{
              style:{marginLeft:"5px",display:'inline-block'}

            },params.row.detail.UserInfo.UserName)
          ])
        }
      };
      const homework = {
        title: this.$t("Common.Homework"),
        key: "homework",
        sortable: true,
        render: (h, params) => {
          return h("div",{
            on:{
              'click':()=>{
                this.handleOpenFile(params);
              }
            }
          },[
            h("span",{
              style:{display:'inline-block'}
            },params.row.homework)
          ])
        }
      };
      const status = {
        title: this.$t("Common.Status"),
        key: "status",
        sortable: true
      };
      const reply = {
        title: this.$t('Homework.Replay'),
        key: "reply",
        render: (h, params) => {
          return h("div",[
            h('span',{
              class:'icon icon-yinxiang',
            }),
            h("span",{
              style:{marginLeft:"5px",display:'inline-block'}
            },3)
          ])
        }
      };
      const points = {
        title: this.$t("AssignmentList.Points"),
        key: "points",
        render: (h, params) => {
          return h("div",params.row.points)
        }
      };
      const studentMoreAction = {
        title: " ",
        key: "action",
        width: 80,
        render: (h, params) => {
          if(params.row.status=='批改'){
            return h("Dropdown",
            {
              props:{trigger:"hover",placement:"bottom"},
                on:{
                  "on-click": ($event) => {
                    this.handleHomeworkAction($event,params)
                  }
                }
            },
            [
              h("span",{style:{cursor: 'pointer',padding:'0px 20px'}},[h('Icon', {props: {type: 'android-more-vertical', size: '20', color: 'black'}})]),
              h('DropdownMenu',{slot:"list"},[
                h("DropdownItem",{props:{name:'submit'},style:{
                  padding:'0px 0px'
                }},[
                  h(StudentSubmitHomework, {
                    props: {
                      homework: params.row,
                    }
                  })
                ],"提交作业",),
                h("DropdownItem",{props:{name:'viewHomework'},},"查看批改"),
                h("DropdownItem",{props:{name:'Original'},},"查看作业布置"),
                h("DropdownItem",{props:{name:'delete'},},"删除作业"),
              ])
            ])
          }else{
            return h("Dropdown",
            {
              props:{trigger:"hover",placement:"bottom"},
                on:{
                  "on-click": ($event) => {
                    this.handleHomeworkAction($event,params)
                  }
                }
            },
            [
              h("span",{style:{cursor: 'pointer',padding:'0px 20px'}},[h('Icon', {props: {type: 'android-more-vertical', size: '20', color: 'black'}})]),
              h('DropdownMenu',{slot:"list"},[
                h("DropdownItem",{props:{name:'submit'},style:{
                  padding:'0px 0px'
                }},[
                  h(StudentSubmitHomework, {
                    props: {
                      homework: params.row,
                    }
                  })
                ],"提交作业",),
                h("DropdownItem",{props:{name:'Original'},},"查看作业布置"),
                h("DropdownItem",{props:{name:'delete'},},"删除作业"),
              ])
            ])
          }
        },
      }
      let list = [];
      
      if(this.isTeacherRole){
        list.push(expend);
        list.push(students);
        list.push(status);
        list.push(points);
      }else{
        list.push(homework);
        list.push(status);
        list.push(reply);
        list.push(points);
        list.push(studentMoreAction);
      }
      return list;
    },
    handleHomeworkAction(name,params){
      switch (name) {
        case 'viewHomework':
          this.handleOpenFile(params);
          break;
        case 'Original':
          this.handleOpenFile(params);
          break;
       case 'delete':
          
          break;

        default:
          break;
      }
    },
    handleOpenFile(params) {
      //console.log(params.row.detail);
      if(params.row.detail.FileType==5 || params.row.detail.FileType==4)
      {
          this.$Message.error("Can't view this file!");
          return;
      }
      // this.$router.push({ name: "view", params: { id: params.row.detail.ItemID,type:2 } });
      // return;      
      // this.$router.push({ name: "docview", params: { id: params.row.detail.ItemID } });
      // return;
      
      webapi.AddTempLesson(params.row.detail.AttachmentID,params.row.detail.Title).then(res=>{
          //res.RetData
          this.$router.push({ name: "docview", params: { id: res.RetData.ItemID } });
      });

    },
  },
}
</script>
