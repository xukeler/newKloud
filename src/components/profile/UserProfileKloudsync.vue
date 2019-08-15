<template>
  <div class="kloudsync-user-profile">
    <!-- <div class="profile-header-part">
      {{$t("UserProfile.MyProfile")}}
      <div style="float:right;">
        <Button type="primary" :loading="saving" @click="handleSave">{{$t("Common.Save")}}</Button>
        <Button @click="handleCancel">{{$t("Base.Cancel")}}</Button>
      </div>
    </div> -->
    <div class="profile-flex-part">
      <div class="profile-menu-part">
        <div class="profile-menu">
          <div class="header-part">{{$t("UserProfile.MyProfile")}}</div>
          <div class="menu-item" :class="{'menu-current': currentMenu == 'personal'}" @click="handleMenu('personal')">{{$t("UserProfile.PersonalInformation")}}</div>
          <div class="menu-item" :class="{'menu-current': currentMenu == 'classroom'}" @click="handleMenu('classroom')">{{isKloudSync?$t("UserProfile.MyMeetingroom"):$t("UserProfile.MyKlassroom")}}</div>
          <div class="menu-item" :class="{'menu-current': currentMenu == 'files'}" @click="handleMenu('files')">{{$t("UserProfile.MyFiles")}}</div>
        </div>
      </div>
      <div class="profile-content-part">
        <div class="head-part">
          {{menuInfo}}
          <div class="header-right">
            <Button type="primary" :loading="saving" @click="handleSave">{{$t("Common.Save")}}</Button>
            <Button @click="handleCancel" style="margin-left:10px;">{{$t("Base.Cancel")}}</Button>
          </div>
        </div>
        <div v-show="currentMenu === 'personal'" class="menu-content">
          <div class="white-space">
            <personal-info ref="personalInfo"></personal-info>
          </div>
        </div>
        <!-- <div v-show="currentMenu === 'teacher'" class="menu-content">
          <teacher-info ref="teacherInfo"></teacher-info>
        </div>
        <div v-show="currentMenu === 'school'" class="menu-content">
          <school-info ref="schoolInfo"></school-info>
        </div>
        <div v-show="currentMenu === 'account'" class="menu-content">
          <account-info></account-info>
        </div> -->
        <div v-show="currentMenu === 'classroom'" class="menu-content">
          <div class="white-space">
            <classroom-info :show-teacher-apply="!isTeacher" :show-school-apply="!showSchool"></classroom-info>
          </div>
        </div>
        <div v-show="currentMenu === 'files'" class="menu-content">
          <div class="white-space">
            <files-info ref="filesInfo"></files-info>
          </div>
        </div>
        <!-- <div v-show="currentMenu === 'syncrooms'" class="menu-content">
          <sync-rooms ref="syncRooms"></sync-rooms>
        </div> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.kloudsync-user-profile {
  text-align: left;
  height: 100%;
  overflow-x: hidden;

  .profile-header-part {
    font-size: 24px;
    color: #1c2438;
    border-bottom: 1px solid #dddee1;
    padding-bottom: 10px;
    margin-bottom: 10px;
    vertical-align: middle;
  }

  .profile-flex-part {
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    min-width: 750px;
    height: 100%;

    .profile-menu-part {
      box-flex: 0;
      flex: 0 0 300px;
      box-pack: start;
      justify-content: flex-start;
      background-color: #ffffff;
      border-right: 1px solid #dddee1;
      position: relative;
      .profile-menu {
        padding: 18px 0;
        text-align: left;
        font-weight: bolder;
        font-size: 14px;

        .header-part {
          color:#bdc5b8;
          padding: 24px 24px 12px;
        }

        .menu-item {
          color: #1c2438;
          padding: 12px 24px;
          border-width: 1px 0px 1px 4px;
          border-style: solid;
          border-color: transparent;
          cursor: pointer;
        }
        .menu-item.menu-current {
          background: #f6f9fd;
          border-color: #5cadff #2d8cf0;
        }
      }
    }

    .profile-content-part {
      flex: 1 1 500px;
      .head-part{
        width: 100%;
        text-align: left;
        padding: 0 20px;
        height: 65px;
        line-height: 65px;
        position: relative;
        border-bottom: 1px solid #dddee1;
        font-size: 16px;
        font-weight: bold;
        .header-right{
          float: right;
          font-size: 14px;
          font-weight: normal;
        }
      }
      .menu-content{
        padding: 24px;
        background-color: #FBFBFD;
        min-height: calc(100% - 65px);
        height: calc(100% - 65px);
        width: 100%;
        table {
          width: 100%;
          border-spacing: 0;
          border-collapse: collapse;
        }
        .white-space{
          background-color:#ffffff;
          height:100%;
          width: 100%;
          padding:24px;
          overflow-y: auto;
          overflow-x: hidden;
        }
      }
    }
  }

  .ivu-menu-vertical .ivu-menu-item {
    padding: 6px 12px 6px 0;

    td:first-of-type {
      width: 28px;
      text-align: center;
    }
    td:last-of-type {
      width: 20px;
      text-align: center;
    }
  }

  .ivu-table th {
    background-color: #495060;
    color: white;
  }

  .ivu-table-row-highlight td,
  .ivu-table-stripe
    .ivu-table-body
    tr.ivu-table-row-highlight:nth-child(2n)
    td {
    background-color: #dddee1;
  }
}
</style>

<script>
import auth from "../../authenticator";
import PersonalInfo from "./PersonalInfoKloudsync";
import TeacherInfo from "./TeacherInfo";
import SchoolInfo from "./SchoolInfo";
import AccountInfo from "./AccountInfo";
import ClassroomInfo from "./ClassroomInfo";
import FilesInfo from "./FilesInfo";
import SyncRooms from "./SyncRooms"
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
  components: {
    PersonalInfo,
    TeacherInfo,
    SchoolInfo,
    AccountInfo,
    ClassroomInfo,
    FilesInfo,
    SyncRooms
  },
  data() {
    return {
      userId: auth.getUserID(),
      currentMenu: "personal",
      isTeacher: auth.getRole() === "1", // || auth.withSchool(),
      showSchool: false, // auth.showSchool(),
      adminSchool: false, // auth.adminSchool(),
      saving: false,
      isKloudSync:false
    };
  },
  mounted() {
    this.isKloudSync=IsKloudSync();
    this.$nextTick(() => {
      this.$parent.$emit("viewChanged", "profile");
    });
    this.readData();
    if (this.currentMenuType) {
      this.currentMenu = this.currentMenuType;
    }
  },
  watch: {
    currentMenuType(val) {
      this.currentMenu = val;
    }
  },
  methods: {
    readData: function() {
      this.$refs.personalInfo.initialize();
    },
    handleSave: function() {
      let self = this;
      this.saving = true;

      this.$refs.personalInfo.saveData(result => {
        this.saving = false;

        if (this.adminSchool) {
          this.$refs.schoolInfo.saveData();
        }

        if (this.isTeacher) {
          this.$refs.teacherInfo.saveData();
        }
      });
    },
    handleCancel: function() {
      this.goBackList();
    },
    goBackList: function() {
      this.$router.push("/");
    },
    handleMenu: function(name) {
      this.currentMenu = name;
      this.changeCurrentMenuType(name);
      switch (name) {
        case "personal":
          this.$refs.personalInfo.initialize();
          break;

        case "teacher":
          this.$refs.teacherInfo.initialize();
          break;

        case "school":
          this.$refs.schoolInfo.initialize();
          break;

        case "account":
          break;

        case "classroom":
          break;

        case "files":
          this.$refs.filesInfo.initialize();
          break;

        case "favorites":
          break;

        case "help":
          break;

        case "syncrooms":
          this.$refs.syncRooms.initialize();
          break;
      }
    },
    teacherApplied: function() {
      this.isTeacher = true;
      auth.setRole(1);
      this.handleMenu("teacher");
      this.$parent.teacherApplied();
    },
    teacherCanceled: function() {
      this.isTeacher = false;
      auth.setRole(0);
      this.handleMenu("personal");
      this.$parent.teacherCanceled();
    },
    schoolApplied: function(id, type) {
      //this.adminSchool = true;
      //auth.setSchool(id, type, auth.SchoolRole.Owner, auth.Privilege.DeleteCreateEditView, auth.Privilege.DeleteCreateEditView);
      //this.handleMenu('school');
      //this.$parent.schoolApplied(type);
    },
    schoolCanceled: function() {
      //this.adminSchool = false;
      //auth.setSchool(0, 0, 0, 0, 0);
      //this.handleMenu('personal');
      //this.$parent.schoolCanceled();
    },
    ...mapMutations(["changeCurrentMenuType"])
  },
  computed: {
    menuInfo(){
      let info;
      switch (this.currentMenu) {
        case 'personal':
          info = this.$t("UserProfile.PersonalInformation");
          break;
        case 'classroom':
          info = this.$t("UserProfile.MyMeetingroom");
          break;
        case 'files':
          info = this.$t("UserProfile.MyFiles");
          break;
        default:
          break;
      }
      return info;
    },
    ...mapState(["currentMenuType"])
  }
};
</script>
