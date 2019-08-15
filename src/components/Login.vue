<template>
  <div class="login-page">
    <div v-if="showcheckbrowser" class="login-checkbrowser">{{$t("Login.BrowserWarnning")}}</div>
    <div class="login-content">
      <div class="header">
        {{$t("Login.SignIn")}}
      </div>

      <div style="width: 320px; margin: 2em auto;">
        <h3>{{ isKloudSync?$t("Login.LoginToKloudSyc"):$t("Login.LoginToKlassroom") }}</h3>
        <div>
          <p>
            <Input size="large" :placeholder="$t('Login.YourUserName')" v-model="credentials.username" autofocus></Input>
          </p>
          <p>
            <Input size="large" type="password" :placeholder="$t('Login.YourPsd')"  v-model="credentials.password" @on-enter="login()"></Input>
          </p>
          <p>
            <Select v-model="selectLanguage" style="width:306px; text-align:left;" @on-change="changeLanguage">
              <Option value="en">English</Option>
              <Option value="cn">中文版</Option>
            </Select>
          </p>
          <p class="login-error">
            {{ error }}
          </p>
          <p>
            <Button size="large" type="primary" @click="login()" long :loading="loading">{{ $t("Login.Login") }}</Button>
          </p>
          <p>
            <span style="display: inline-block;float:left"><a href="javascript:void(null)" @click="register()">{{ $t("Login.SignUp") }}</a> <span>{{$t("Login.or")}}</span> <a href="javascript:void(null)" @click="join()">{{ $t("Login.JoinMeeting") }}</a></span>
            <span style="display: inline-block;float:right"><a @click="forgetPassworld()">{{ $t("Login.ForgetPassword") }}</a></span>
          </p>
        </div>
      </div>
    </div>
    <div style="clear:both; position:absolute; bottom:5px; text-align:center;"><a href="http://www.beian.miit.gov.cn" target="_blank">沪ICP备17051877号</a></div>
  </div>
</template>

<style scoped lang="scss">
  .login-page {
    background-image: url("../../static/images/classroom.jpg");
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .login-content {
      width: 600px;
      min-height: 300px;
      border-radius: 4px;
      background-color: rgba(255, 255, 255, 0.5);

      .header {
        height: 76px;
        line-height: 76px;
        font-size: 24px;
        text-align: center;
        font-weight: normal;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        background: #495060;
        color: #ffffff;
      }

      .login-error {
        color: #ed3f14;
      }

      h3, p {
        padding: 0.5em;
      }
    }
  .login-checkbrowser {
    clear: both;
    position: absolute;
    top: 25px;
    text-align: center;
    color: red;
    font-size: 30px;
    font-weight: bold;
  }
  }
</style>

<script>
  import authenticator from '../authenticator'
  import friends from '../friends'
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';

  export default {
    data() {
      return {
        loading: false,
        credentials: {
          username: '',
          password: ''
        },
        error: '',
        showcheckbrowser: false,
        selectLanguage:"en",
        isKloudSync:false
      }
    },
    computed: {
      ...mapState(["Klassroom"]),
    },
    created()
    {
      this.selectLanguage = localStorage.getItem("Language") || "en";
    },
    mounted: function ()
    {
      this.isKloudSync=IsKloudSync();
      friends.clear();
      this.$parent.$refs.noticemsg.logout();
      this.showcheckbrowser = !Browser.isChrome() && !Browser.isFirefox() && !Browser.isOpera();
    },
    methods: {
      login: function ()
      {
        //this.$i18n.locale = "cn";
        //alert(this.$t('Login.BrowserWarnning'));
        if (!Browser.isChrome() && !Browser.isFirefox() && !Browser.isOpera()) {
          this.$Message.warning({content:this.$t('Login.BrowserWarnning'),duration:3});
          return;
        }
        let credentials = {
          username: this.credentials.username,
          password: this.credentials.password
        };

        this.loading = true;
        let redirect = "/";
        if (this.$route.query.ReturnUrl)
        {
          redirect = this.$route.query.ReturnUrl;
        }
        authenticator.login(this, credentials, redirect, result => {
          this.loading = false;
          if (result) {
            this.Klassroom.type = authenticator.getSchoolType();
            this.$parent.$refs.noticemsg.init();
          }
        });
      },
      register: function () {
        this.$router.push({name: 'register'});
      },
      forgetPassworld(){
        this.$router.push({name:'forgetPassworld'});
      },
      join: function () {
        this.$router.push({name: 'join', params: { meetingId: 'null' }});
      },
      changeLanguage()
      {
        //alert(this.selectLanguage);
        this.$i18n.locale = this.selectLanguage;
        localStorage.setItem("Language", this.selectLanguage);

        //重新加载kendo.scheduler.js文件
        var head = $("head").remove("script[role='scheduler']");
        var oscript = document.createElement('script');
        oscript.id = "script";
        $("#script").attr({ role: 'scheduler', src: '/static/kendoui/kendo.scheduler.js?v=201810011501', type: 'text/javascript' }).appendTo(head);       
          }
        }
  }
</script>
