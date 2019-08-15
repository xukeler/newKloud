<template>
  <div id="app">
    <notice-msg ref="noticemsg"></notice-msg>
    <!-- <keep-alive :include="['kloudsync']"> -->
      <router-view ></router-view>
    <!-- </keep-alive> -->

    <div v-if="showChat2">
       <chat-floating-window :show-chat="showChat" ></chat-floating-window>
    </div>   
  </div>
</template>

<script>
import ChatFloatingWindow from './components/chat/ChatFloatingWindow.vue'

export default {
  name: 'app',
  components: {
    ChatFloatingWindow
  },
  provide() {//避免kloudsync和pt中公共部分找不到父组件中提供的reload的方法所引起报的错。
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      showChat: false,
      showChat2:false, //手机不加载
    }
  },
  mounted: function () {
    this.$Loading.config({
      color: '#f90',
      height: 4
    });

    this.setShowChat();
  },
  updated () {
    this.setShowChat();
  },
  methods: {
    setShowChat() {
      let name = this.$router.currentRoute.name;
      let phoneFlag = name!=="document"&& name!=="attachment" && name!=="sync"&& name!=="play" && name!=="meeting" //手机不加载的模块
      if(phoneFlag){
        this.showChat2 = true;
        this.$nextTick(()=>{
          if(IsProjectOne()|| IsKloudSync()){
            this.showChat = name === 'live' || name === 'docview'
          }else{
            this.showChat = name !== 'login' && name !== 'register' && name !== 'join' && name !=='forgetPassworld'
            // && name!="kloudsync-invitation-notice"
            // && name!="kloudsync-documents" && name!="kloudsync-chat" && name!="kloudsync-contact" && name!="kloudsync-meeting" && name!="kloudsync-schedule-meeting" && name!="kloudsync-topic"
            // && name!="kloudsync-profile" && name!="kloudsync-help" && name!=="record" && name!="syncroom";
          }
        })
      }else{
        this.showChat2 = false;
      }
    },
    reload(){

    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

html, body{
  height: 100%;
  width: 100%;
  background-color: #F5F5F5;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-width: 320px;
  text-align: center;
  height: 100%;

  font-family: 'Helvetica Neue', 'Avenir', Helvetica, Arial, sans-serif;
  color: #495060;
  font-size: 14px;
  background-color: transparent;
}

.ivu-input[disabled], fieldset[disabled] .ivu-input{
  color: #495060;
}

.ivu-tooltip-popper[x-placement^=top] .ivu-tooltip-arrow {
  border-top-color: #2E3D49;
}
.ivu-tooltip-inner{ background-color: #2E3D49;}
.ivu-tooltip-popper{ z-index: 10002;}

.pad-l-10{ padding-left: 10px;}

ul, ol {
  margin-bottom: 0 !important;
}
.ivu-input-icon {
  cursor: pointer;
}
.ivu-notice{
  margin-left: 24px;
}

</style>
