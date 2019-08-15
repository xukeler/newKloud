<template>
  <div class="join-page">
    <div class="join-background"></div>

    <div class="join-content">
      <div>
        <div class="go-back-login"></div>

        <div class="join-meeting">
          <div class="header">
            {{$t("Join.JoinMeeting")}}
          </div>

          <div style="width: 320px; margin: auto; padding: 2em 0;">
            <div>
              <p>
                <Input size="large" title="Meeting ID" type="text" :placeholder="$t('Join.PlaceholderMeetingid')" v-model="meetingId" @on-enter="join()"></Input>
              </p>
              <p>
                <Input size="large" title="User Name" type="text" :placeholder="$t('Join.PlaceholderUserName')" v-model="credentials.username" autofocus @on-enter="join()"></Input>
              </p>
              <p style="display:none;">
                <Input size="large" type="password" :placeholder="$t('Join.PlaceholderYourPassword')" v-model="credentials.password" @on-enter="join()"></Input>
              </p>
              <p class="login-error">
                {{ error }}
              </p>
              <p>
                <Button size="large" type="primary" @click="join()" long>{{$t("Join.JoinMeeting")}}</Button>
              </p>
              <p>
                {{$t("Join.NotHaveAccount")}} <a href="javascript:void(null)" @click="signup()">{{$t("Register.SignUp")}}</a> {{$t("Join.Now")}}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style="clear:both; position:absolute; bottom:5px; text-align:center;"><a href="http://www.miitbeian.gov.cn" target="_blank">沪ICP备17051877号</a></div>
    </div>
  </div>
</template>

<style lang="scss">
  .join-page {
    .join-background {
      background-image: url("../../static/images/classroom.jpg");
      background-size: cover;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.5;
      z-index: 0;
    }

    .join-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      .go-back-login {
        text-align: right;
        margin-bottom: 1em;
        font-size: 14px;
      }

      .join-meeting {
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

        p {
          padding: 0.5em;
        }
      }
    }
  }
</style>

<script>
  import auth from '../authenticator'
  import webapi from '../webapi/webapi.js';

  export default {
    data() {
      return {
        loading: false,
        meetingId: "",
        credentials: {
          username: '',
          password: ''
        },
        error: ''
      }
    },
    mounted: function () {
      let meetingId = this.$route.params.id;//.meetingId;
      if (meetingId === 'null') {
        meetingId = ''
      }

      this.meetingId = meetingId;
      if (this.meetingId && auth.checkAuth())
      {
        this.$router.push({ name: 'live', params: { id: + this.meetingId } });
        //location.href = "/live/" + this.meetingId;
      }
      else
      {
        this.credentials.username = this.getAnonymousName();
      }
    },
    methods: {
      getAnonymousName()
      {
        let uid = window.sessionStorage.getItem('AnonymousID');
        if (!uid)
        {
          uid = GUID();
          sessionStorage.setItem('AnonymousID', uid);
          return "";
        }
        else
        {
          return webapi.getInstantAccount(uid);
        }
      },
      signup() {
        this.$router.push({name: 'register', query: {meeting: this.meetingId}});
      },
      join() {
        if (!Browser.isChrome() && !Browser.isFirefox() && !Browser.isOpera()) {
          this.error = this.$t("Login.BrowserWarnning");
          return;
        }
        if (!this.meetingId) {
          this.error = this.$t("Join.ErrorEnterMeetingId");
          return;
        }
        if (Trim(this.credentials.username) == "")
        {
          this.error = this.$t("Join.ErrorEnterUserName");
          return;
        }
        if (!webapi.isMeetingIDExist(this.meetingId))
        {
          this.error = this.$t("Join.ErrorMeetingIdExist");
          return;
        }
        let uid = window.sessionStorage.getItem('AnonymousID');

        webapi.createInstantAccout(uid, Trim(this.credentials.username)).then(res =>
        {
          auth.clear();
          this.$cookie.set('UserToken', res.UserToken, 1);          
          auth.user.authenticated = true;
          auth.saveLoginInfo(res.RetData);
          this.$parent.$refs.noticemsg.init();
          this.$router.push({ name: 'live', params: { id:  this.meetingId } });

        });
        //let credentials = {
        //  username: this.credentials.username,
        //  password: this.credentials.password
        //};

        //this.loading = true;
        //auth.login(this, credentials, {name: 'live', params: {id: this.meetingId}}, result => {
        //  this.loading = false;
        //  if (result) {
        //    this.$parent.$refs.noticemsg.init();
        //  }
        //});
      }
    }
  }
</script>
