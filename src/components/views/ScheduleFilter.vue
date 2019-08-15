<template>
  <Modal id="schedule-filter-modal" v-model="modalFilter" width="400" :styles="{top: '96px', left: '380px', position:'absolute'}">
    <Tabs value="teachers" :animated="false">
      <TabPane label="Teachers" name="teachers">
        <Input style="margin: 0.5em 0;" v-model="searchText" icon="search" placeholder="Search"></Input>
        <div class="user-item" v-for="item in allTeachers" :key="item.id">
          <Avatar :src="item.avatar" />
          <span class="user-name">{{item.name}}</span>
        </div>
      </TabPane>
      <TabPane label="Students" name="students">
        <Input style="margin: 0.5em 0;" v-model="searchText" icon="search" placeholder="Search"></Input>
        <div class="user-item" v-for="item in allStudents" :key="item.id">
          <Avatar :src="item.avatar" />
          <span class="user-name">{{item.name}}</span>
        </div>
      </TabPane>
    </Tabs>

    <div slot="close">
    </div>
    <div slot="footer">
      <Button style="min-width: 72px;" type="primary" @click="modalFilter = false">OK</Button>
      <Button style="min-width: 72px;" @click="modalFilter = false">Cancel</Button>
    </div>
  </Modal>
</template>

<style lang="scss">
#schedule-filter-modal {
  .ivu-modal-mask {
    background-color: transparent;
  }
  .ivu-modal-content {
    //background-color: #f5f5f5;
    border: 1px solid #dcdee2;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .user-item {
    padding: 0.25em 0;

    .user-name {
      font-size: 14px;
      padding-left: 0.5em;
      vertical-align: middle;
    }
  }
}
</style>

<script>
import auth from "../../authenticator";

export default {
  data() {
    return {
      loading: false,
      modalFilter: false,
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
    show() {
      this.modalFilter = true;
    },
    hide() {
      this.modalFilter = false;
    },
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
