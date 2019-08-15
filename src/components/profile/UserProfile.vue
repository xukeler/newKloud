<template>
  <div class="user-profile">
    <div class="profile-header-part">
      {{$t("UserProfile.MyProfile")}}
      <div style="float:right;">
        <Button type="primary" :loading="saving" @click="handleSave">{{$t("Common.Save")}}</Button>
        <Button @click="handleCancel">{{$t("Base.Cancel")}}</Button>
      </div>
    </div>
    <div class="profile-flex-part">
      <div class="profile-menu-part">
        <Menu class="profile-menu" theme="light" :active-name="currentMenu" style="height: 100%; min-height: 480px;" @on-select="menuSelected">
          <MenuItem name="personal">
            <table>
              <tr>
                <td>
                  <Icon type="android-person" size="18"></Icon>
                </td>
                <td>
                  {{$t("UserProfile.PersonalInformation")}}
                </td>
                <td>
                  <Icon type="chevron-right" size="16"></Icon>
                </td>
              </tr>
            </table>
          </MenuItem>
          <MenuItem name="account">
            <table>
              <tr>
                <td>
                  <Icon type="information-circled" size="18"></Icon>
                </td>
                <td>
                  {{$t("UserProfile.MyAccount")}}
                </td>
                <td>
                  <Icon type="chevron-right" size="16"></Icon>
                </td>
              </tr>
            </table>
          </MenuItem>
          <MenuItem name="classroom">
            <table>
              <tr>
                <td>
                  <Icon type="ios-people" size="18"></Icon>
                </td>
                <td>
                  {{isKloudSync?$t("UserProfile.MyMeetingroom"):$t("UserProfile.MyKlassroom")}}
                </td>
                <td>
                  <Icon type="chevron-right" size="16"></Icon>
                </td>
              </tr>
            </table>
          </MenuItem>
          <MenuItem name="teacher" v-show="isTeacher && !isKloudSync">
            <table>
              <tr>
                <td>
                  <Icon type="ios-mic" size="18"></Icon>
                </td>
                <td>
                  {{$t("UserProfile.TeacherProfile")}}
                </td>
                <td>
                  <Icon type="chevron-right" size="16"></Icon>
                </td>
              </tr>
            </table>
          </MenuItem>
          <MenuItem name="school" v-show="adminSchool">
            <table>
              <tr>
                <td>
                  <Icon type="android-home" size="18"></Icon>
                </td>
                <td>
                  {{$t("UserProfile.MySchool")}}
                </td>
                <td>
                  <Icon type="chevron-right" size="16"></Icon>
                </td>
              </tr>
            </table>
          </MenuItem>
          <MenuItem name="files">
            <table>
              <tr>
                <td>
                  <Icon type="ios-filing" size="18"></Icon>
                </td>
                <td>
                  {{$t("UserProfile.MyFiles")}}
                </td>
                <td>
                  <Icon type="chevron-right" size="16"></Icon>
                </td>
              </tr>
            </table>
          </MenuItem>
          <MenuItem name="syncrooms">
            <table>
              <tr>
                <td>
                  <Icon type="ios-bookmarks" size="18"></Icon>
                </td>
                <td>
                  My Sync Rooms
                </td>
                <td>
                  <Icon type="chevron-right" size="16"></Icon>
                </td>
              </tr>
            </table>
          </MenuItem>
        </Menu>
      </div>
      <div class="profile-content-part">
        <div v-show="currentMenu === 'personal'">
          <personal-info ref="personalInfo"></personal-info>
        </div>
        <div v-show="currentMenu === 'teacher'">
          <teacher-info ref="teacherInfo"></teacher-info>
        </div>
        <div v-show="currentMenu === 'school'">
          <school-info ref="schoolInfo"></school-info>
        </div>
        <div v-show="currentMenu === 'account'">
          <account-info></account-info>
        </div>
        <div v-show="currentMenu === 'classroom'">
          <classroom-info :show-teacher-apply="!isTeacher" :show-school-apply="!showSchool"></classroom-info>
        </div>
        <div v-show="currentMenu === 'files'">
          <files-info ref="filesInfo"></files-info>
        </div>
        <div v-show="currentMenu === 'syncrooms'">
          <sync-rooms ref="syncRooms"></sync-rooms>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.user-profile {
  padding: 28px;
  text-align: left;

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

    .profile-menu-part {
      flex: 0 0 250px;
      padding: 10px;

      table {
        width: 100%;
        border-spacing: 0;
        border-collapse: collapse;
      }
    }

    .profile-content-part {
      flex: 1 1 500px;
      padding: 10px;
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
import PersonalInfo from "./PersonalInfo";
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
    menuSelected: function(name) {
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
      this.menuSelected("teacher");
      this.$parent.teacherApplied();
    },
    teacherCanceled: function() {
      this.isTeacher = false;
      auth.setRole(0);
      this.menuSelected("personal");
      this.$parent.teacherCanceled();
    },
    schoolApplied: function(id, type) {
      //this.adminSchool = true;
      //auth.setSchool(id, type, auth.SchoolRole.Owner, auth.Privilege.DeleteCreateEditView, auth.Privilege.DeleteCreateEditView);
      //this.menuSelected('school');
      //this.$parent.schoolApplied(type);
    },
    schoolCanceled: function() {
      //this.adminSchool = false;
      //auth.setSchool(0, 0, 0, 0, 0);
      //this.menuSelected('personal');
      //this.$parent.schoolCanceled();
    },
    ...mapMutations(["changeCurrentMenuType"])
  },
  computed: {
    ...mapState(["currentMenuType"])
  }
};
</script>
