<template>
  <Poptip ref="filterPoptip" style="position:absolute; top: 6px; left: 574px;">
    <Button style="padding: 1px 8px;"><i style="font-size:20px;" class="icon icon-filter"></i></Button>

    <div class="schedule-filter-content" slot="content">
      <Tabs value="teachers" :animated="false">
        <TabPane label="Teachers" name="teachers">
          <Input style="margin: 0.5em 0;" v-model="searchText" icon="search" placeholder="Search"/>
          <div class="user-item" v-for="item in allTeachers" :key="item.id">
            <Avatar :src="item.avatar" />
            <span class="user-name">{{item.name}}</span>
          </div>
        </TabPane>
        <TabPane label="Students" name="students">
          <Input style="margin: 0.5em 0;" v-model="searchText" icon="search" placeholder="Search"/>
          <div class="user-item" v-for="item in allStudents" :key="item.id">
            <Avatar :src="item.avatar" />
            <span class="user-name">{{item.name}}</span>
          </div>
        </TabPane>
      </Tabs>

      <div class="footer-part">
        <Button type="primary" @click="handleOK">OK</Button>
        <Button @click="handleCancel">Cancel</Button>
      </div>
    </div>
  </Poptip>
</template>

<style lang="scss">
.schedule-filter-content {
  text-align: left;

  .user-item {
    padding: 0.25em 0;

    .user-name {
      font-size: 14px;
      padding-left: 0.5em;
      vertical-align: middle;
    }
  }

  .footer-part {
    margin-top: 1em;
    padding-top: 1em;
    border-top: 1px solid #dcdee2;
    text-align: right;
  }
}
</style>

<script>
import auth from "../../authenticator";

export default {
  data() {
    return {
      loading: false,
      searchText: '',
      allStudents: [],
      allTeachers: [],
      allCustomers: []
    }
  },
  computed: {
    schoolId() {
      return auth.getCustomerID();
    }
  },
  mounted() {
    this.readStudents();
    this.readTeachers();
  },
  methods: {
    readStudents() {
      let self = this;
      let url = GetAPIUrl() + "SchoolContact/List?schoolID=" + this.schoolId + "&roleType=" + auth.SchoolRole.Students + "&pageIndex=-1";
      this._getData(url, null, (data) => {
        self.allStudents = self.initializeUsers(data);
      }, null);
    },
    readTeachers() {
      let self = this;
      let url = GetAPIUrl() + "SchoolContact/List?schoolID=" + this.schoolId + "&roleType=" + auth.SchoolRole.Teachers + "&pageIndex=-1";
      this._getData(url, null, (data) => {
        self.allTeachers = self.initializeUsers(data);
      }, null);
    },
    initializeUsers(data) {
      let list = [];
      for (let i = 0, count = data.length; i < count; i++) {
        let user = data[i];
        let item = {
          id: user.UserID,
          avatar: user.AvatarUrl,
          name: user.UserName,
          gender: user.Sex === 2 ? 'Female' : 'Male',
          phone: user.Phone,
          email: user.Email,
          detail: user
        };

        list.push(item);
      }
      return list;
    },
    handleOK() {
      this.$refs.filterPoptip.ok();
    },
    handleCancel() {
      this.$refs.filterPoptip.cancel();
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
            if (success && typeof success === 'function') {
              success(result.RetData);
            }

            self.loading = false;
            self.$Loading.finish();
          }
          else { // error
            if (error && typeof error === 'function') {
              error(result);
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          if (error && typeof error === 'function') {
            error();
          }

          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ': ' + xhr.statusText);
          console.log(xhr);
        }
      });
    },
  }
}
</script>
