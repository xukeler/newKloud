<template>
  <div class="user-profile-school-info">
    <div class="info-part">
      <div class="part-header">{{schoolType}} {{$t("SchoolInfoSchoolProfile.Information")}}</div>

      <table class="info-detail">
        <tr>
          <td>{{$t("SchoolInfoSchoolProfile.Organization")}}: </td>
          <td>
            <Select v-model="school.type0" :placeholder="$t('SchoolInfoSchoolProfile.PlaceholderPleaseSelectorganizationType')">
              <Option v-for="item in schoolType0" :value="item.id" :label="item.name" :key="item.id">{{item.name}}</Option>
            </Select>
          </td>
        </tr>
        <tr v-show="showSchoolType">
          <td>{{schoolType}} {{$t("SchoolInfoSchoolProfile.Type")}}: </td>
          <td>
            <Select v-model="school.type1" :placeholder="$t('SchoolInfoSchoolProfile.PlaceholderPleaseSelectType')">
              <Option v-for="item in schoolType1" :value="item.id" :label="item.name" :key="item.id">{{item.name}}</Option>
            </Select>
          </td>
        </tr>
        <tr>
          <td>{{schoolType}} {{$t("SchoolInfoSchoolProfile.Name")}}: </td>
          <td><Input v-model="school.name" :placeholder="$t('SchoolInfoSchoolProfile.PlaceholderPleaseEnterName')"/></td>
        </tr>
        <tr v-if="!isCreating">
          <td>{{$t("SchoolInfoSchoolProfile.BusinessOwner")}}: </td>
          <td>
            <div style="min-height: 32px; padding: 5px; line-height: 1.5em">
              <span v-for="user in ownerList" :key="user.id" style="margin-right: 1em;">{{user.name}}; </span>
            </div>
            <!--<Select v-model="school.owner" placeholder="Please select a business owner" disabled>
              <Option :value="currentUser.id">{{currentUser.name}}</Option>
              <Option v-for="user in userList" :value="user.id" :key="user.id">{{user.name}}</Option>
            </Select>-->
          </td>
        </tr>
        <tr v-if="!isCreating">
          <td>{{$t("SchoolInfoSchoolProfile.AccountAdmin")}}: </td>
          <td>
            <div style="min-height: 32px; padding: 5px; line-height: 1.5em">
              <span v-for="user in adminList" :key="user.id" style="margin-right: 1em;">{{user.name}}; </span>
            </div>
            <!--<Select v-model="school.admin" placeholder="Please select a account admin" disabled>
              <Option :value="currentUser.id">{{currentUser.name}}</Option>
              <Option v-for="user in userList" :value="user.id" :key="user.id">{{user.name}}</Option>
            </Select>-->
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style lang="scss">
  .user-profile-school-info {
    font-size: 14px;

    .part-header {
      font-size: larger;
      font-weight: bold;
      margin-bottom: 0.2em;
      color: #1c2438;
    }

    .info-detail {
      width: auto;

      td:first-of-type {
        padding-left: 2em;
        text-align: right;
      }

      td:nth-of-type(2) {
        padding: 5px 20px;
        text-align: left;
        width: 300px;
      }
    }

    .ivu-select-dropdown {
      max-height: 400px;
    }
  }
</style>

<script>
  import auth from '../../authenticator';
  import friends from '../../friends';

  export default {
    props: {
      school: Object,
      schoolId: Number,
      isCreating: Boolean
    },
    data() {
      return {
        currentUser: {
          id: parseInt(auth.getUserID()),
          name: auth.getUserName()
        },
        userList: [],
        schoolType0: [
          {id: 0, name: "Tutoring School"},
          {id: 1, name: "School & University & College"},
          {id: 2, name: "Company"},
          {id: 3, name: "Government & organization"},
          {id: 4, name: "Other"}
        ],
        ownerList: [],
        adminList: []
      };
    },
    computed: {
      schoolType1() {
        switch (this.school.type0) {
          case 1:
            return [
              {id: 1, name: "Kindergarten"},
              {id: 2, name: "Elementary school"},
              {id: 3, name: "Middle / Junior school only"},
              {id: 4, name: "High school only"},
              {id: 5, name: "Middle / Junior and High school"},
              {id: 6, name: "University or College"},
              {id: 7, name: "After-school"},
              {id: 8, name: "Summer school"},
              {id: 9, name: "Secondary education"},
              {id: 10, name: "Alternative education"},
              {id: 11, name: "Art schools"},
              {id: 0, name: "Others"}
            ];

          case 2:
            return [
              {id: 1, name: "Agricultural"},
              {id: 2, name: "Auto/Aviation/Transport"},
              {id: 3, name: "Business Svc/Financial"},
              {id: 4, name: "Communications/Utility"},
              {id: 5, name: "Computers/Internet/Tech"},
              {id: 6, name: "Construction/Building"},
              {id: 7, name: "Education"},
              {id: 8, name: "Government/Public Svc"},
              {id: 9, name: "Manufacturing"},
              {id: 10, name: "Media/Marketing"},
              {id: 11, name: "Medical/Dental/Science"},
              {id: 12, name: "Retail"},
              {id: 13, name: "Textiles/Clothing"},
              {id: 0, name: "Others"}
            ];

          case 3:
            return [
              {id: 1, name: "Church"},
              {id: 2, name: "Government"},
              {id: 3, name: "NPO"},
              {id: 0, name: "Other"}
            ];

          case 0:
          case 4:
          default:
            return [];
        }
      },
      schoolType() {
        switch (this.school.type0) {
          case 0:
          case 1:
            return this.$t("SchoolInfoSchoolProfile.School");
          case 2:
            return this.$t("SchoolInfoSchoolProfile.Company");
          case 3:
            return this.$t("SchoolInfoSchoolProfile.Organization");
          default:
            return this.$t("SchoolInfoSchoolProfile.Business");
        }
      },
      showSchoolType() {
        switch (this.school.type0) {
          case 1:
          case 2:
          case 3:
            return true;
          default:
            return false;
        }
      }
    },
    mounted() {
      let self = this;

      friends.getFriends(function (users) {
        let list = [];
        for (let i = 0, count = users.length; i < count; i++){
          let user = users[i];
          let item = {
            id: user.UserID,
            name: user.Name
          };

          list.push(item);
        }

        self.userList = list;
      });
    },
    methods: {
      readData() {
        if (this.isCreating)
          return;

        this.$nextTick(() => {
          this.getAdminList();
          this.getOwnerList();
        });
      },
      getAdminList() {
        let self = this;

        let url = GetAPIUrl() + "SchoolContact/List?schoolID=" + this.schoolId + "&roleType=" + auth.SchoolRole.Admin + "&pageIndex=-1";
        this._getData(url, null, (data) => {
          self.adminList = self.initializeData(data);
        }, null);
      },
      getOwnerList() {
        let self = this;

        let url = GetAPIUrl() + "SchoolContact/List?schoolID=" + this.schoolId + "&roleType=" + auth.SchoolRole.Owner + "&pageIndex=-1";
        this._getData(url, null, (data) => {
          self.ownerList = self.initializeData(data);
        }, null);
      },
      initializeData(data) {
        let list = [];
        for (let i = 0, count = data.length; i < count; i++){
          let user = data[i];
          let item = {
            id: user.UserID,
            avatar: user.AvatarUrl,
            name: user.UserName,
            gender: user.Sex === 2 ? this.$t('CourseTeachers.Female') : this.$t('CourseTeachers.Male'),
            phone: user.Phone,
            email: user.Email,
            role: auth.getSchoolRoleName(user.Role),
            detail: user
          };

          list.push(item);
        }

        return list;
      },
      _getData(url, before, success, error) {
        if (before && typeof before === 'function') {
          before();
        }

        this.loading = true;
        this.$Loading.start();

        let self = this;
        $.ajax({
          type: 'GET',
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
              self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
              console.log(result);

              if (error && typeof error === 'function') {
                error(result);
              }
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            self.loading = false;
            self.$Loading.error();
            self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
            console.log(xhr);

            if (error && typeof error === 'function') {
              error();
            }
          }
        });
      },
    }
  }
</script>
