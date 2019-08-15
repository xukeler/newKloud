<template>
  <div class="kloadsync-header-part">
    <div class="primary-header">
      <div class="left-logo">
        <div class="peertime-logo">KloudSync</div>
        <!-- <div class="help-part" @click="goHelp" title="help">Help</div> -->
      </div>
      <div class="main-router">
        <div class="clickable" :class="{'current': currentView === 'documents'}" @click="goDocumets" title="documents">
          {{$t("KloudSyncHead.Documents")}}
          <div class="bottom-line"></div>
        </div>
        <!--<div class="clickable" :class="{'current': currentView === 'activity'}" @click="goActivity" title="activity">
          Activity
          <div class="bottom-line"></div>
        </div>-->
        <div class="clickable" :class="{'current': currentView === 'chat'}" @click="goChat" title="chat">
          {{$t("KloudSyncHead.Chat")}}
          <div class="bottom-line"></div>
        </div>
        <div class="clickable" :class="{'current': currentView === 'contact'}" @click="goContact" title="contact">
          {{$t("KloudSyncHead.Contact")}}
          <div class="bottom-line"></div>
        </div>
        <div class="clickable" :class="{'current': currentView === 'meeting'}" @click="goMeeting" title="meeting">
          {{$t("KloudSyncHead.Meeting")}}
          <div class="bottom-line"></div>
        </div>
        <div class="clickable" :class="{'current': currentView === 'topic'}" @click="goTopic" title="topic">
          {{$t("KloudSyncHead.SyncRoom")}}
          <div class="bottom-line"></div>
        </div>
        <!-- <div class="clickable" :class="{'current': currentView === 'syncroom'}" @click="goSyncRoom" title="SyncRoom">
          SyncRoom
          <div class="bottom-line"></div>
        </div> -->
      </div>
      <user-info></user-info>
    </div>
    <div>
    </div>
  </div>
</template>

<style lang="scss">
$primary-header-height: 68px;
$images-root: "../../../static/images/";

.kloadsync-header-part {
  .primary-header {
    height: $primary-header-height;
    max-height: $primary-header-height;
    background-color: white;
    width: 100%;
    text-align: left;
    position: relative;
    border-bottom: 1px solid #dddee1;
    display: flex;
    align-items: center;
    justify-content: space-between;

    div,
    span {
      display: inline-block;
    }

    ul {
      margin-bottom: 0;
    }

    .left-logo {
      position: relative;
      padding-left: 32px;
      .peertime-logo {
        font-size: 25px;
      }

      .help-part {
        font-size: 18px;
        color: #2b85e4;
        margin-left: 32px;
        padding-left: 18px;
        border-left: 1px solid #dddee1;
        cursor: pointer;
      }
    }

    .main-router {
      .clickable {
        cursor: pointer;
        font-size: 18px;
        padding: 0 1em;
      }

      .bottom-line {
        height: 4px;
        width: 120%;
        display: block;
        margin-left: -10%;
        margin-top: -4px;
        border-radius: 1px;
      }

      .current {
        color: #2b85e4;

        .bottom-line {
          background-color: white;
        }
      }
    }
  }

}
</style>

<script>
import UserInfo from "../user/UserInfoKloudSync.vue";
import auth from "../../authenticator";

export default {
  components: {
    UserInfo
  },
  data() {
    return {
      loading: false,
      currentView: "documents",
    };
  },
  mounted() {
    this._setCurrentView();
  },
  computed: {
  },
  watch: {
    $route(to, from) {
      this.$nextTick(() => {
        this._setCurrentView();
      });
    }
  },
  methods: {
    goHelp() {
      this.$router.push({ name: "kloudsync-help" });
    },
    goDocumets() {
      this.$router.push({ name: "kloudsync-documents" });
    },
    goChat() {
      this.$router.push({ name: "kloudsync-chat" });
    },
    goContact() {
      this.$router.push({ name: "kloudsync-contact" });
    },
    goMeeting() {
      this.$router.push({ name: "kloudsync-meeting" });
    },
    goTopic() {
      this.$router.push({ name: "kloudsync-topic" });
    },
    goSyncRoom() {
      this.$router.push({ name: "kloudsync-syncroom" });
    },
    _setCurrentView() {
      let name = this.$route.name;

      switch (name) {
        case "kloudsync-documents":
          this.currentView = "documents";
          break;

        case "kloudsync-chat":
          this.currentView = "chat";
          break;

        case "kloudsync-contact":
          this.currentView = "contact";
          break;

        case "kloudsync-meeting":
          this.currentView = "meeting";
          break;

        case "kloudsync-topic":
          this.currentView = "topic";
          break;
        case "kloudsync-syncroom":
          this.currentView = "syncroom";
          break;

        default:
          this.currentView = "other";
          break;
      }
    },
    _getData(url, before, success, error) {
      if (before && typeof before === "function") {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    },
    _postData(url, data, before, success, error) {
      if (before && typeof before === "function") {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        data: JSON.stringify(data),
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(resultString) {
          let result = JSON.parse(resultString);
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    }
  }
};
</script>
