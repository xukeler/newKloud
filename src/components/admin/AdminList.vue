<template>
  <div class="admin-list">
    <div class="header">
      {{headerText}}
    </div>

    <Tabs @on-click="tabOnClick" :value="currentTab">
      <TabPane label="Roles / Privileges" name="role-privilege">
        <role-list :on-role-selected="showAdminDetail"></role-list>
      </TabPane>

      <TabPane label="Account Profile" name="profile">
        <div style="height: 1.6em; background-color: #495060; margin: 10px;">

        </div>
        <table style="line-height: 1.6em; border-collapse: separate; border-spacing: 10px 0;">
          <tr>
            <td>Business Owner:</td>
            <td>Shawn Persico</td>
          </tr>
          <tr>
            <td>System Admin:</td>
            <td>Jonathon W.</td>
          </tr>
          <tr>
            <td colspan="2" style="height: 1.6em;"></td>
          </tr>
          <tr>
            <td colspan="2" style="text-decoration: underline;">License Information</td>
          </tr>
          <tr>
            <td>License Type:</td>
            <td>Enterprise</td>
          </tr>
          <tr>
            <td>Total Licenses:</td>
            <td>20 Students</td>
          </tr>
        </table>
      </TabPane>

    </Tabs>
  </div>
</template>

<style lang="scss">
  .admin-list {
    padding: 28px;
    text-align: left;

    .header {
      font-size: 28px;
      text-align: left;
      color: #1c2438;
      border-bottom: 1px solid #dddee1;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }

    .action-buttons {
      float: right;
    }

    .ivu-tabs-bar {
      border-bottom: 1px solid transparent;
    }

    .ivu-collapse {
      //background-color: transparent;
      //border: 1px solid transparent;
    }

    .ivu-collapse-content {
      padding: 0;
    }

    .ivu-collapse-content > .ivu-collapse-content-box {
      padding: 0;
    }

    .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
      padding-left: 1.5em;

      .ivu-icon {
        margin-right: 1em;
      }
    }
  }
</style>

<script>
  import RoleList from './RoleList';

  export default {
    components: {
      RoleList
    },
    data () {
      return {
        currentTab: "role-privilege",
      }
    },
    computed: {
      headerText() {
        switch (this.currentTab) {
          default:
          case 'role-privilege':
            return 'Account Managements Settings';

          case 'profile':
            return 'Account Profile Settings';
        }
      }
    },
    mounted () {
      let tab = localStorage.getItem('AdminListCurrentTab');
      if (!tab)
        tab = 'role-privilege';
      this.currentTab = tab;

      this.initializeTab(this.currentTab);
    },
    methods: {
      initializeTab(name) {
        switch (name) {
          default:
          case "role-privilege":
            break;

          case "profile":
            break;
        }

        this.currentTab = name;
        localStorage.setItem('AdminListCurrentTab', name);
      },
      tabOnClick(name) {
        this.$parent.hideDetailPanel();
        this.initializeTab(name);
      },
      showAdminDetail(id) {
        this.$parent.showDetailPanel(id);
      }
    }
  }
</script>
