<template>
  <div class="pt-header">
    <div>
      <div class="left-logo">
        <div class="peertime-logo"></div>
        <div class="vrtical-line"></div>
      </div>
      <div class="school-oneoption" v-if="chooseAllSchool===0" @mousedown="showAdminList($event)">{{schoolOption}}</div>
      <div class="school-option" v-else-if="chooseAllSchool===1" @mousedown="showAdminList($event)" ref="schoolOptionSelect">
        <Dropdown placement="bottom-start" @on-click="userClick" trigger="click">
          <div class="school-manyoption" @click="rotateIcon">
             <div style="float:left;"><p style="overflow: hidden; max-width:200px;text-overflow: ellipsis;white-space: nowrap;">{{defaultShcool}}</p></div>
             <div style="float:left;margin-left:5px;"><Icon :class="{rotateUp:showSelectFlag,rotateDown:!showSelectFlag}" type="arrow-down-b"></Icon></div>
             <div style="clear: both;"></div>
          </div>
          <DropdownMenu slot="list" style="border-bottom: 1px solid #c0c0c0;">
            <div class="ivu-dropdown-menu" style="width:100%" @click="getFocus">
              <input ref="searchSchool" class="search" type="text" placeholder="Searching..." v-model="searchKey" @keydown="showClearText" @keyup="searchSchoolKey"/>
              <div class="searchIcon" @mousedown="searchSchoolKey"><Icon type="ios-search-strong" size="16" style="color:black"></Icon></div>
              <div class="clearInput" v-show="showClearInput" @click="clearInputText($event)"><Icon type="android-cancel" size="16" style="color:#D2D2D0"></Icon></div>
            </div>
          </DropdownMenu>
          <DropdownMenu slot="list" class="select-school" style="max-width:300px;overflow-x:hidden">
            <DropdownItem :name="item.name+'-'+item.id" v-for="item in schoolList" :key="item.id" :value="item.id" style="padding:0px">
              <div style="width:100%;height:100%;padding:7px 16px;font-weight:100;font-size:13px;" @mousemove="deleteIconShow(item.id)" @mouseout="hideDeleteIcon()">
                <span style="display: inline-block;float:left;">{{ item.name }}</span>
                <!--删除学校功能-->
                <!-- <span style="display: inline-block;float:right;" v-show="deleteFlag==item.id"  @click.stop="deleteSchool(item.id)"><Icon type="close-round" size="12" color='#ed3f14'></Icon></span> -->
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <!-- <div class="school-profile" @click="goSchoolProfile" title="school profile">
        <Icon type="ios-information-outline" size="20"></Icon>
      </div> -->
      <Modal title="Super administrator"
           v-model="showAdmin"
           okText="Ok"
           cancelText="Cancel"
           :mask-closable="false" width="600"
           :transfer="true"
           :scrollable="true"
           style="z-index: 2000; position: absolute;"
           >
            <!-- <p style="text-align:left;font-size:13px;font-weight:700;color:#1c2438;margin-bottom:5px;">School list</p> -->
            <Tabs v-model="currentTab" @on-click="tabOnClick">
              <TabPane label="School list" name="school">
              </TabPane>
              <!--未实现的对管理员的管理和设置成员为管理员的操作-->
              <!-- <TabPane label="Administrator list" name="administratorList">
              </TabPane>
              <TabPane label="Add administrator" name="setAdministrator">
              </TabPane> -->
            </Tabs>
           <div class="superAdminList" v-show="currentTab=='school'">
              <div class="ivu-dropdown-menu" style="width:100%" @click="adminGetFocus">
                <input ref="adminSearchSchool" class="search" type="text" placeholder="Search for school names" v-model="adminSearchKey" @keydown="adminShowClearText" @keyup="adminSearchSchoolKey"/>
                <div class="searchIcon" @mousedown="adminSearchSchoolKey"><Icon type="ios-search-strong" size="16" style="color:black"></Icon></div>
                <div class="clearInput" v-show="adminShowClearInput" @click="adminClearInputText($event)"><Icon type="android-cancel" size="16" style="color:#D2D2D0"></Icon></div>
              </div>
              <Table  no-data-text="No school right now" :stripe="true" :highlight-row="true"
                  :data="allShcoolList" :columns="allShcoolColumn" :height="520" @on-row-click="tableRowClick" class="adminTable">
              </Table>
           </div>
           <!-- <div class="superAdminList" v-show="currentTab=='setAdministrator'">
             <div class="ivu-dropdown-menu" style="width:100%" @click="adminGetFocus">
                <input  ref="setAdministrator" class="search" type="text" placeholder="Search phone number or user name ..."/>
                <div class="searchIcon"><Icon type="ios-search-strong" size="16" style="color:black"></Icon></div>
                <div class="clearInput" v-show="adminShowClearInput" @click="adminClearInputText($event)"><Icon type="android-cancel" size="16" style="color:#D2D2D0"></Icon></div>
              </div>
              <Table  no-data-text="No Contract found" :stripe="true" :highlight-row="true"
                :data="searchData" :columns="searchColumn"  :height="520">
              </Table>
           </div> -->
           <!-- <div class="superAdminList" v-show="currentTab=='administratorList'">
             <div class="ivu-dropdown-menu" style="width:100%" @click="adminGetFocus">
                <input  ref="administratorList" class="search" type="text" placeholder="Search phone number or user name ..."/>
                <div class="searchIcon"><Icon type="ios-search-strong" size="16" style="color:black"></Icon></div>
                <div class="clearInput" v-show="adminShowClearInput" @click="adminClearInputText($event)"><Icon type="android-cancel" size="16" style="color:#D2D2D0"></Icon></div>
              </div>
              <Table  no-data-text="No administrator found" :stripe="true" :highlight-row="true"
                  :height="520" :columns="administratorColumn">
              </Table>
           </div> -->
           <!-- <div slot="footer" v-show="currentTab=='administratorList'||currentTab=='setAdministrator'">
             <Button type="primary">{{ActiveText}}</Button>
           </div> -->
    </Modal>
    </div>
    <div class="main-router">
      <Dropdown placement="bottom-start" @on-click="chooseSchedule">
        <Button type="text" :class="{'current': currentViewId === 'schedule'}" @click="goSchedule">
          {{$t("Base.Schedule")}}
          <div class="bottom-line"></div>
        </Button>
          <DropdownMenu slot="list" class="selectSchedule">
            <DropdownItem name="showMySchoolSchedule">{{$t("HeaderBar.ShowMyCurrentSchoolSchedule")}}<Icon size="10" style="color:green;margin-left:15px;" type="checkmark" v-show="showMy==='showMySchoolSchedule'"></Icon></DropdownItem>
            <DropdownItem name="showAllSchoolSchedule">{{$t("HeaderBar.ShowAllSchoolSchedule")}}<Icon size="10" style="color:green;margin-left:15px;" type="checkmark" v-show="showMy==='showAllSchoolSchedule'" class="checkOut"></Icon></DropdownItem>
          </DropdownMenu>
      </Dropdown>
      <Dropdown placement="bottom-start" @on-click="chooseActivity">
        <Button type="text" :class="{'current': currentViewId === 'activity'}" @click="goActivity">
          {{$t("Base.Activity")}}
          <div class="bottom-line"></div>
        </Button>
          <DropdownMenu slot="list" class="selectSchedule">
            <DropdownItem name="showMySchoolActivity">{{$t("HeaderBar.ShowMyCurrentSchoolActivity")}}<Icon size="10" style="color:green;margin-left:15px;" type="checkmark" v-show="showMyActivity==='showMySchoolActivity'"></Icon></DropdownItem>
            <DropdownItem name="showAllSchoolActivity">{{$t("HeaderBar.ShowAllSchoolActivity")}}<Icon size="10" style="color:green;margin-left:15px;" type="checkmark" v-show="showMyActivity==='showAllSchoolActivity'" class="checkOut"></Icon></DropdownItem>
          </DropdownMenu>
      </Dropdown>

      <Button type="text" :class="{'current': currentViewId === 'courses'}" @click="goCourses">
        {{$t("Base.Courses")}}
        <div class="bottom-line"></div>
      </Button>
      <Button type="text" :class="{'current': currentViewId === 'students'}" @click="goStudents">
        {{$t("Base.Students")}}
        <div class="bottom-line"></div>
      </Button>
      <Button type="text" :class="{'current': currentViewId === 'teachers'}" @click="goTeachers">
        {{$t("Base.Teachers")}}
        <div class="bottom-line"></div>
      </Button>

    </div>
    <user-info ref="userInfos"></user-info>
  </div>
</template>

<style scoped lang="scss">
$header-height: 50px; // 76px;
$images-root: "../../../static/images/";

.superAdminList{
  .adminTable{
    cursor: pointer;
  }
  .ivu-dropdown-menu {
    position: relative;
    margin-bottom: 10px;
    .search {
      padding: 0 25px 0 20px;
      width: 100%;
      font-size: 12px;
      color: #000000;
      line-height: 30px;
      border-radius: 4px;
      border: 1px solid #dddee1;
      background-color: #ffffff;
      outline: none;
    }
    .searchIcon {
      position: absolute;
      left: 0.4em;
      top: 0.6em;
      cursor: pointer;
    }
    .clearInput {
      position: absolute;
      right: 10px;
      top: 0.8em;
      cursor: pointer;
    }
    .add-Group {
      background-color: white;
      margin-left: 5px;
      padding: 6px;
      border-radius: 5px;
    }
  }
}
.pt-header {
  height: $header-height;
  max-height: $header-height;
  background-color: #007eae; //#0061BB;
  color: white;
  width: 100%;
  text-align: left;
  vertical-align: middle;
  position: relative;
  box-shadow: 0 2px 4px rgba(3, 63, 115, 0.3);
  //z-index: 10001;

  div,
  span {
    display: inline-block;
  }
  
  .left-logo {
    position: relative;
    float: left;
    height: $header-height;

    .peertime-logo {
      background-image: url($images-root+"logo.svg");
      background-size: 118px 20px;
      background-repeat: no-repeat;
      background-position: center;
      width: 118px;
      height: $header-height;
      margin-left: 24px;
    }
    .vrtical-line {
      height: 20px;
      width: 20px;
      border-right: 2px solid white;
      margin-bottom: 11px;
    }
  }
  .school-oneoption {
    margin-left: 20px;
    color: #4ae9d6;
    font-size: 18px;
    margin-top: 16px;
    cursor: pointer;
  }
  .school-option {
    margin-left: 20px;
    color: #4ae9d6;
    font-size: 18px;
    margin-top: 8px;
    .ivu-dropdown-menu {
      position: relative;
      // margin-top: 10px;
      .search {
        padding: 0 20px 0px 20px;
        width: 90%;
        font-size: 12px;
        color: #000000;
        line-height: 30px;
        border-radius: 4px;
        border: solid 1px #ffffff;
        background-color: #ffffff;
        outline: none;
      }
      .searchIcon {
        position: absolute;
        left: 0.4em;
        top: 0.1em;
        cursor: pointer;
      }
      .clearInput {
        position: absolute;
        right: 30px;
        top: 0.1em;
        cursor: pointer;
      }
      .add-Group {
        background-color: white;
        margin-left: 5px;
        padding: 6px;
        border-radius: 5px;
      }
    }
    .school-manyoption {
      height: 28px;
      margin-top: 8px;
      cursor: pointer;
      .rotateUp{
        font-size: 12px;
        color: #ffffff;
        -webkit-transition: all .2s ease-in-out;
        transition: all .2s ease-in-out;
        transform: rotate(180deg);
      }
      .rotateDown{
        font-size: 12px;
        color: #ffffff;
        -webkit-transition: all .2s ease-in-out;
        transition: all .2s ease-in-out;
      }
    }
    .select-school {
      max-height: 200px;
      overflow: auto;
      font-size: 12px;
      color: #495060;
    }
  }

  .school-profile {
    margin-left: 1em;
    cursor: pointer;
  }

  .main-router {
    padding: 9px 0 0 30px;
    position: absolute;
    width: 600px;
    left: 50%;
    margin-left: -240px;
    button {
      color: white;
      font-size: 18px;
      padding-bottom: 4px;
      border-radius: 0;
    }

    .bottom-line {
      height: 4px;
      width: 120%;
      display: block;
      margin-left: -10%;
      margin-top: 3px;
      border-radius: 1px;
    }

    .current .bottom-line {
      background-color: #4ae9d6;
    }
  }

  .back-button {
    padding-top: 6px;
  }

  .middle-info {
    font-size: 20px;
    font-weight: bold;
    line-height: $header-height;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .search-panel {
    float: right;
    padding: 10px;
    margin-right: 1em;
  }
}
</style>

<script>
import authenticator from "../../authenticator";
import UserInfo from "../user/UserInfo.vue";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
  name: "HeaderBar",
  data: function() {
    return {
      showSelectFlag:false,
      deleteFlag:-1,
      administratorColumn:[
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: ' ',
          key: 'avatar',
          sortable: false,
          width: 80,
          render: (h, params) => {
            return h('Avatar', {
              props: {
                size: 'large',
                src: params.row.avatar
              }
            });
          }
        },
        {
          title: 'Name',
          key: 'name',
          sortable: true,
        },
        {
          title: 'Phone',
          key: 'phone',
          sortable: false
        }
      ],
      searchData: [],
      searchColumn: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: ' ',
          key: 'avatar',
          sortable: false,
          width: 80,
          render: (h, params) => {
            return h('Avatar', {
              props: {
                size: 'large',
                src: params.row.avatar
              }
            });
          }
        },
        {
          title: 'Name',
          key: 'name',
          sortable: true,
        },
        {
          title: 'Phone',
          key: 'phone',
          sortable: false
        }
      ],
      currentTab: "school",
      adminFlag:authenticator.getAdminFlag(),
      allList:[],
      allShcoolList:[],
      allShcoolColumn:[
        {
          title: 'Name',
          key: 'name',
          sortable: true,
          align:'center'
        },
        {
          title: 'Owner',
          key: 'owner',
          sortable: true,
          align:'center'
        },
        {
          title: 'My school',
          key: 'ismine',
          align:'center'
        },
      ],
      showAdmin:false,
      adminSearchKey:"",
      adminShowClearInput:false,
      searchKey: "",
      showClearInput: false,
      showMyActivity: "showAllSchoolActivity",
      showMy: "showAllSchoolSchedule",
      defaultShcool: "",
      chooseAllSchool: 0,
      schoolOption: "",
      userName: authenticator.getUserName(),
      showSearch: false,
      searchText: "",
      schoolId: -1,
      schoolList: [] //[{id:1, name: 'My school (me as an independent tutor)'}, {id:3134, name: '131 Sample School'}],
    };
  },
  inject: ["reload"],
  props: ["currentViewId", "showCourse", "showSchool"],
  components: {
    UserInfo
  },
  updated() {
    if (this.currentViewId == "school") {
      this.$router.push({ name: "school" });
    } else {
      return;
    }
  },
  computed:{
    ActiveText(){
      switch (this.currentTab) {
        case 'setAdministrator':
          return "Ok";
        case 'administratorList':
          return "Delete"; 
        default:
         return;
      }
    },
  },
  created() {
    document.body.addEventListener("click",this.rotateHeadbarSchoolIcon);
  },
  beforeDestroy () {
    document.body.removeEventListener("click",this.rotateHeadbarSchoolIcon);
  },
  mounted: function() {
    this.initialize();
  },
  methods: {
    rotateHeadbarSchoolIcon(e){
      if(this.$refs.schoolOptionSelect){
        if(!this.$refs.schoolOptionSelect.contains(e.target)){
            this.showSelectFlag=false;
        }
      }
    },
    hideDeleteIcon(){
      this.deleteFlag=-1;
    },
    deleteIconShow(id){
      //是My School的情况下，不可删除
      if(id!=authenticator.getCustomerID()){
        this.deleteFlag=id;
      }
    },
    deleteSchool(id){
      let self = this;
      this.$Modal.confirm({
        title: "Delete School",
        content: "Are you sure you want to delete this shcool(The function is not yet perfect)?",
        okText: "Delete",
        cancelText: "Cancel",
        onOk: () => {
          window.event.stopPropagation();
          // let url = GetAPIUrl() + "SchoolContact/DeleteContact?schoolID=" + this.schoolId + "&contactID=" + id;

          // self._deleteData(url, null, (result) => {
          //   self.initialize();
          // }, null);
        },
        onCancel:()=>{
          window.event.stopPropagation();
        }
      });
    },
    tabOnClick(name){
      this.currentTab=name;
    },
    tableRowClick(row) {
      this.defaultShcool = row.name;
      this.schoolId = row.id;
      authenticator.setChosenSchoolId(this.schoolId);
      this.reload();
      this.showAdmin=false;
    },
    //Super administrator弹出框
    showAdminList(e){
      if(this.adminFlag!=null){
        if(this.adminFlag=="true"){
          this.showAdmin=true;
          this.initialAdminlist();
          e.stopPropagation();
        }
      }
    },
    initialAdminlist(){
      this.allShcoolList=[];
      let arrayList=this.schoolList;
      for(let item of arrayList){
        let school = {
          id: item.id,
          owner: item.OwnerName,
          name: item.name,
          ismine:authenticator.getUserID()==item.OwnerID?"Yes":"No"
        };
        this.allShcoolList.push(school);
      }
    },
    //搜索学校方法
    searchSchoolKey() {
      let searchStr = this.searchKey.toUpperCase();
      if (searchStr == "") {
        this.showClearInput = false;
      }
      let list = this.allList;
      let array = [];
      let name;
      for (let i = 0; i < list.length; i++) {
        name = list[i].name.toUpperCase();
        if (name.indexOf(searchStr) != -1) {
          array.push(list[i]);
        }
      }
      this.schoolList = array;
    },
    adminSearchSchoolKey(){
      let searchStr = this.adminSearchKey.toUpperCase();
      if (searchStr == "") {
        this.adminShowClearInput = false;
      }
      let list = this.allList;
      let array = [];
      let name;
      for (let i = 0; i < list.length; i++) {
        name = list[i].name.toUpperCase();
        if (name.indexOf(searchStr) != -1) {
          array.push(list[i]);
        }
      }
      this.schoolList = array;
      this.initialAdminlist();
    },
    getFocus() {
      this.$refs.searchSchool.focus();
    },
    adminGetFocus(){
      switch (name) {
        case 'school':
        this.$refs.adminSearchSchool.focus();
          break;
        case 'setAdministrator':
        this.$refs.setAdministrator.focus();
          break;
        case 'administratorList':
        this.$refs.administratorList.focus();
          break;
        default:
          break;
      }
    },
    clearInputText(e) {
      this.searchKey = "";
      this.showClearInput = false;
      this.schoolList=this.allList;
    },
    showClearText() {
      this.showClearInput = true;
    },
    adminClearInputText(e){
      this.adminSearchKey = "";
      this.adminShowClearInput = false;
      this.schoolList=this.allList;
      this.initialAdminlist();
    },
    adminShowClearText(){
      this.adminShowClearInput = true;
    },
    chooseActivity(name) {
      if (name === "showMySchoolActivity") {
        this.showMyActivity = "showMySchoolActivity";
        this.changeShowActivityType("showMySchoolActivity");
      } else if (name === "showAllSchoolActivity") {
        this.showMyActivity = "showAllSchoolActivity";
        this.changeShowActivityType("showAllSchoolActivity");
      }
      this.reload();
    },
    chooseSchedule(name) {
      if (name === "showMySchoolSchedule") {
        this.showMy = "showMySchoolSchedule";
        this.changeShowScheduleType("showMySchoolSchedule");
      } else if (name === "showAllSchoolSchedule") {
        this.showMy = "showAllSchoolSchedule";
        this.changeShowScheduleType("showAllSchoolSchedule");
      }
      this.reload();
    },
    userClick(name) {
      this.defaultShcool = name.split("-")[0];
      this.schoolId = name.split("-")[1];
      authenticator.setChosenSchoolId(this.schoolId);
      this.reload();
      /*if(this.currentViewId=="school"){
               this.goSchool();
            }*/
    },
    initialize() {
      let self = this;
      let url = GetAPIUrl() + "School/UserSchoolList?userID=" + authenticator.getUserID();
      let currentSchool = authenticator.getChosenSchoolId();

      this._getData(
        url,
        null,
        data => {
          let list = [];
          if (data.length == 1) {
            self.chooseAllSchool = 0;
            self.schoolOption = "My school";
          } else if (data.length > 1) {
            self.chooseAllSchool = 1;
            self.defaultShcool = "My school";
          }
          for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let school = {
              id: item.SchoolID,
              name: item.SchoolName,
              type1: item.Category1,
              type2: item.Category2,
              role: item.Role,
              contactPrivilege: item.ContactPrivilege,
              coursePrivilege: item.CoursePrivilege,
              isMine:false,
              OwnerName: item.OwnerName,
              OwnerID: item.OwnerID
            };

            if (school.id == authenticator.getCustomerID()) {
              school.name = "My school";
              school.isMine = true;
              list.splice(0, 0, school);
            } else {
              if (school.id == currentSchool) {
                self.defaultShcool = school.name;
                self.schoolId = school.id;
              }
              list.push(school);
            }
          }
          
          self.setSchoolList(list);
        },
        null
      );
    },
    _getData(url, before, success, error) {
      if (before && typeof before === "function") {
        before();
      }

      this.$Loading.start();

      let self = this;
      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", authenticator.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.$Loading.error();
            // self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.$Loading.error();
          // self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    },
    _deleteData(url, before, success, error) {
        if (before && typeof before === 'function') {
          before();
        }

        this.loading = true;
        this.$Loading.start();

        let self = this;
        $.ajax({
          type: 'DELETE',
          url: url,
          beforeSend: function (request) {
            request.setRequestHeader("UserToken", auth.getUserToken());
          },
          success: function (result) {
            if (result.RetCode === 0) {
              self.loading = false;
              self.$Loading.finish();

              if (success && typeof success === 'function') {
                success(result.RetData);
              }
            }
            else { // error
              self.loading = false;
              self.$Loading.error();
              self.$Message.error(result.ErrorMessage);
              console.log(result);

              if (error && typeof error === 'function') {
                error(result);
              }
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(xhr.status + ': ' + xhr.statusText);
            console.log(xhr);

            if (error && typeof error === 'function') {
              error();
            }
          }
      });
    },
    setSchoolList(list) {
      this.schoolList = list;
      this.allList=list;
    },
    goSchedule() {
      this.endSearch();
      this.$router.push({ name: "schedule" });
    },
    goActivity() {
      this.endSearch();
      this.$router.push({ name: "activity" });
    },
    goCourses() {
      this.endSearch();
      this.$router.push({ name: "courses" });
    },
    goContacts() {
      this.endSearch();
      this.$router.push({ name: "contacts" });
    },
    goStudents() {
      this.endSearch();
      this.$router.push({ name: "students" });
    },
    goTeachers() {
      this.endSearch();
      this.$router.push({ name: "teachers" });
    },
    goProfile() {
      this.endSearch();
      this.$router.push({ name: "profile" });
    },
    goSchool() {
      this.endSearch();
      this.$router.push({ name: "school" });
    },
    // goSchoolProfile() {
    //   this.endSearch();
    //   this.$router.push({name: 'schoolprofile'});
    // },
    logout() {
      authenticator.logout(this);
      this.$parent.$parent.$refs.noticemsg.logout();
      this.$router.push({ name: "login" });
    },
    goSearch() {
      this.showSearch = true;
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
    },
    startSearch() {
      this.$nextTick(() => {
        this.$parent.startSearch(this.searchText);
      });
    },
    endSearch() {
      this.showSearch = false;
      this.searchText = "";
      this.$parent.endSearch();
    },
    rotateIcon(){
      this.showSelectFlag=!this.showSelectFlag
    },
    ...mapMutations(["changeShowActivityType","changeShowScheduleType"])
  },
  beforeCreate: function() {
    authenticator.checkAuth();
    if (!authenticator.user.authenticated) this.$router.push({ name: "login" });
  },
  route: {
    canActivate() {
      return auth.user.authenticated;
    }
  }
};
</script>
