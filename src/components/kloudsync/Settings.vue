<template>
  <div class="kloudsync-admin-settings">
    <div class="admin-flexviews">
      <div class="panel-menu">
        <div class="admin-menu">
          <div class="header-part">COMMON SETUP</div>
          <div class="menu-item" :class="{'menu-current': currentMenu == 'profile'}" @click="handleMenu('profile')">Account info</div>
          <div class="menu-item" :class="{'menu-current': currentMenu == 'payment'}" @click="handleMenu('payment')">Payment setting</div>
          <div class="menu-item" :class="{'menu-current': currentMenu == 'role'}" @click="handleMenu('role')">Job role setting</div>
          <div class="menu-item" :class="{'menu-current': currentMenu == 'admin'}" @click="handleMenu('admin')">Admin user list</div>
          <div class="menu-item" :class="{'menu-current': currentMenu == 'contact'}" @click="handleMenu('contact')">Contact list</div>

          <!-- <div class="header-part">TOPIC SETUP</div>
          <div class="menu-item" :class="{'menu-current': currentMenu == 'topic-type'}" @click="handleMenu('topic-type')">Topic type setting</div>
          <div class="menu-item" :class="{'menu-current': currentMenu == 'topic-company'}" @click="handleMenu('topic-company')">Customer company list</div> -->
        </div>
      </div>

      <div class="panel-content">
        <router-view :key="$route.fullPath"></router-view>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.kloudsync-admin-settings {
  width: 100%;
  height: calc(100% - 68px);

  .admin-flexviews {
    background-color: transparent;
    display: box;
    display: flex;
    width: 100%;
    align-items: stretch;
    min-height: 100%;

    .panel-menu {
      box-flex: 0;
      flex: 0 0 300px;
      box-pack: start;
      justify-content: flex-start;
      background-color: #ffffff;
      border-right: 1px solid #dddee1;
      position: relative;
    }

    .panel-content {
      box-flex: 5500;
      flex: 5500 1 500px;
      min-width: 500px;
      background-color: #ffffff;
      position: relative;
    }

    .panel-detail {
      box-flex: 0;
      flex: 0 0 500px;
      border-left: 1px solid #dddee1;

      background-color: #ffffff;
      position: relative;
    }
  }

  .admin-menu {
    padding: 18px 0;
    text-align: left;
    font-weight: bolder;
    font-size: 14px;

    .header-part {
      color: #80848f;
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

  .admin-content-box {
    height: 100%;
  }
}
</style>

<script>
export default {
  data() {
    return {
      routerPrefix: 'kloudsync-settings-',
      currentMenu: 'profile'
    }
  },
  mounted() {
    this._setCurrentMenu()
  },  
  methods: {
    _setCurrentMenu() {
      let index = this.routerPrefix.length;
      let name = this.$route.name.substr(index);
      if (name) {
        this.currentMenu = name;
      }
      else {
        let menu = sessionStorage.getItem("Kloudsync.Settings.Menu");
        if (menu && menu != 'undefined')
          this.currentMenu = menu;
        this.$router.push({ name: this.routerPrefix + this.currentMenu });
      }
    },
    handleMenu(menu) {
      sessionStorage.setItem("Kloudsync.Settings.Menu", menu);
      let routerName = this.routerPrefix + menu; 
      this.$router.push({ name: routerName });
    },
  }
}
</script>
