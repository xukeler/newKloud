<template>
  <Poptip ref="filterPoptip" style="position:absolute; top: 6px; left: 574px;">
    <Button style="padding: 1px 8px;"><i style="font-size:20px;" class="icon icon-filter"></i></Button>

    <div class="schedule-filter-content" slot="content">
      <div class="header-part">
        <Button type="text" @click="handleClear" style="color:#2b85e4">Clear All</Button>
        <Button type="primary" @click="handleOK">OK</Button>
      </div>

      <div>
        <table class="schedule-filter-table">
          <tr>
            <td>
              Teacher:
            </td>
            <td>
              <Select v-model="selectedTeacher" style="width:200px" clearable filterable>
                <Option v-for="item in allTeachers" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </td>
          </tr>
          <tr>
            <td>
              Class:
            </td>
            <td>
              <Select v-model="selectedFolder" style="width:200px" clearable filterable>
                <Option v-for="item in allFolders" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </td>
          </tr>
          <tr>
            <td>
              Course:
            </td>
            <td>
              <Select v-model="selectedCourse" style="width:200px" clearable filterable>
                <Option v-for="item in allCourses" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </Poptip>
</template>

<style lang="scss">
.schedule-filter-content {
  text-align: left;

  .header-part {
    padding: 0.5em 1em 0.5em 0;
    display: flex;
    justify-content: space-between;
  }

  .schedule-filter-table {    
    td {
      padding: 0.5em 1em;
    }

    td:first-of-type {
      text-align: right;
      width: 100px;
    }
  }

  .ivu-select-dropdown {
    max-height: 400px;
  }
}
</style>

<script>
import auth from "../../authenticator";

export default {
  data() {
    return {
      loading: false,
      selectedTeacher: 0,
      allTeachers: [],
      selectedFolder: 0,
      allFolders: [],
      selectedCourse: 0,
      allCourses: []
    }
  },
  computed: {
    schoolId() {
      return auth.getCustomerID();
    }
  },
  mounted() {
    this.readTeachers();
  },
  methods: {
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
    handleClear() {
      this.selectedTeacher = 0;
      this.selectedFolder = 0;
      this.setRequestHeader = 0;
    },
    handleOK() {
      this.$refs.filterPoptip.ok();
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
