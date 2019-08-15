<template>
  <div class="forgetPassworld-page">
    <div class="forgetPassworld-background"></div>

    <div class="forgetPassworld-content">
      <div>
        <div class="go-back-login">{{$t('ForgetPassworld.ReturnTo')}}<a href="javascript:void(null)" @click="back()">{{$t('Register.SignIn')}}</a></div>
        <div class="forgetPassworld-form" v-show="!resetSuccess">
          <div class="header">
            {{$t('ForgetPassworld.ForgetPassword')}}
          </div>
          <Form ref="verificationPassworld" :model="forgetPassworld" :rules="forgetPassworldRule" label-position="right" :label-width="0" style="width: 350px; margin: auto; padding: 3em 0;">
            <FormItem prop="phoneNumber" :error="forgetPassworld.phoneError">
              <Input v-model="forgetPassworld.phoneNumber" size="large" :placeholder="$t('Register.CellPhoneNumber')">
                <Button slot="prepend" @click="handleSelectCountry"><span class="flag-icon" :class="forgetPassworld.phoneCountryFlag" style="margin-right: 0.5em;"></span>{{forgetPassworld.phoneCountry}}</Button>
              </Input>
            </FormItem>
            <FormItem prop="code" :error="forgetPassworld.codeError">
              <Input v-model="forgetPassworld.code" style="width: 150px" size="large" :placeholder="$t('Register.VerificationCode')"></Input> <Button style="margin-left: 1em;" type="primary" size="large" :disabled="sendWaiting" @click="handleSendCode">{{sendText}}</Button>
            </FormItem>
            <div style="height:20px;width:100%"></div>
            <FormItem>
              <Button type="primary" size="large" long @click="handleForgetOk">{{$t('Base.OK')}}</Button>
            </FormItem>
          </Form>
        </div>
        <div class="forgetPassworld-form" v-show="resetSuccess">
          <div class="header">
             {{$t('ForgetPassworld.ResetPassworld')}}
          </div>
          <Form ref="resetPassworldForm" :model="resetMyPassworld" :rules="resetMyPassworldRule" label-position="right" :label-width="0" style="width: 350px; margin: auto; padding: 3em 0;">
              <FormItem prop="passwd" :error="resetMyPassworld.errorText1">
                  <Input v-model="resetMyPassworld.passwd" size="large" type="password" icon="eye-disabled" :placeholder="$t('ForgetPassworld.ResetNewPassworld')"></Input>
              </FormItem>
              <FormItem prop="passwdCheck" :error="resetMyPassworld.errorText2">
                  <Input type="password" size="large" v-model="resetMyPassworld.passwdCheck" icon="eye-disabled" :placeholder="$t('ForgetPassworld.ResetConfirmPassworld')"></Input>
              </FormItem>
              <div style="height:20px;width:100%"></div>
              <FormItem>
                  <Button type="primary" size="large" long @click="resetOk">{{$t('ForgetPassworld.ResetPassworld')}}</Button>
              </FormItem>
          </Form>
        </div>
        <div>
          <Modal v-model="selectCountry.modal" :title="$t('Register.PleaseSelectCountry')" :mask-closable="false" :width="600" class-name="forgetPassworld-select-country-modal">
            <p style="font-weight:700">{{$t("Common.CommonCountries")}}</p>
            <div style="text-align:left;">
            <span style="display:inline-block;" v-for="(item,index) in commonCountrieData" :key="index" @mousedown="selcetCommonCountrie(item)">
              <Tag type="border">
                <span class="flag-icon" :class="item.flag" style="font-size: larger; margin-right: 0.5em;"></span><span style="color: #1c2438; font-weight: bold;">{{item.name}} ({{item.dial_code}})</span>
              </Tag>
            </span>
            </div>
            <Input v-model="selectCountry.searchText" :placeholder="$t('Register.PlaceholderSearchCountry')" :icon='selectCountry.searchIcon' @on-change="handleSelectCountrySearch" @on-click="handleSelectCountrySearchCancel" style="width: 50%; margin: 15px 0px 1em;"></Input>
            <p style="font-weight:700">{{$t("Common.AllCountries")}}</p>
            <Table size="small" :stripe="true" :highlight-row="true" :height="360" :no-data-text="$t('Register.CannotFindAnyCountry')" @on-current-change="handleSelectCountryCurrentChange"
                   :data="selectCountry.tableData" :columns="selectCountry.tableColumns" :loading="loading">
            </Table>
            <div slot="footer">
              <span style="float: left;">{{$t('Register.YouSelected')}} <span class="flag-icon" :class="selectCountry.current.flag" style="font-size: larger; margin-right: 0.5em;"></span><span style="color: #1c2438; font-weight: bold;">{{selectCountry.current.name}} ({{selectCountry.current.dial_code}})</span></span>
              <Button type="primary" :loading="loading" @click="handleSelectCountryOK">{{$t('Base.OK')}}</Button>
              <Button @click="handleSelectCountryCancel">{{$t('Base.Cancel')}}</Button>
            </div>
          </Modal>
        </div>
      </div>

      <div style="clear:both; position:absolute; bottom:5px; text-align:center;"><a href="http://www.miitbeian.gov.cn" target="_blank">沪ICP备17051877号</a></div>
    </div>
  </div>
</template>

<style lang="scss">
  .forgetPassworld-page {
    .forgetPassworld-background {
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

    .forgetPassworld-content {
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
        text-align: center;
        margin-bottom: 1em;
        font-size: 14px;
      }

      .forgetPassworld-form {
        width: 600px;
        min-height: 300px;
        background: white;
        border-radius: 4px;
        text-align: left;
      }

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

      .ivu-slider-wrap {
        height: 32px;
        margin: 0;
        background-color: #bbbec4;
      }

      .ivu-slider-bar {
        height: 32px;
        border-radius: 0;
      }

      .ivu-slider-button {
        width: 16px;
        height: 40px;
        border: 2px solid #2d8cf0;
        border-radius: 4px;
        background-color: #5cadff;
        transition: all .2s linear;
      }

      .ivu-slider-button-dragging, .ivu-slider-button:hover {
        -ms-transform: scale(1.0);
        transform: scale(1.0);
      }
    }
  }

  .forgetPassworld-select-country-modal{
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal{
      top: 0;
    }

    .ivu-table th {
      background-color: #495060;
      color: white;
    }

    .ivu-table-row-highlight td, .ivu-table-stripe .ivu-table-body tr.ivu-table-row-highlight:nth-child(2n) td {
      background-color: #dddee1;
    }
  }
</style>

<script>
  import authenticator from '../authenticator'
  import util from "../common/util.js";

  export default {
    data() {
      const validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('Register.ErrorPhoneNumber')));
        }
        else {
          callback();
        }
      };
      const validateCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('Register.ErrorVerificationCode')));
        }
        else{
          callback();
        }
      };
      const validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('Register.ErrorPleaseEnterPassword')));
        }else if (value.length < 6 || value.length > 20) {
          callback(new Error(this.$t('Register.Errorcharacters')));
        }
      };
      return {
        resetMyPassworldRule:{
          passwd: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          passwdCheck: [
            { validator: validatePassword, trigger: 'blur' }
          ],
        },
        resetMyPassworld:{
          passwd:'',
          passwdCheck:'',
          accessCode:'',
          errorText1:'',
          errorText2:''
        },
        resetSuccess:false,
        loading: false,
        countryData: [],
        selectCountry: {
          modal: false,
          current: {
            name: 'United States', //'China',
            dial_code: '+1',//'+86',
            flag: 'flag-icon-us', //'flag-icon-cn'
          },
          searchText: '',
          searchIcon: 'search',
          tableData: [],
          tableColumns: [
            {
              title: this.$t('Register.CountryName'),
              key: 'name',
              render: (h, params) => {
                return h('div', [
                  h('span', {class: 'flag-icon ' + params.row.flag, style: {marginRight: '1em', fontSize: 'larger' }}),
                  h('strong', params.row.name)
                ]);
              }
            },
            {
              title: this.$t('Register.Code'),
              width: 150,
              key: 'dial_code'
            }
          ],
        },
        sendText: this.$t('Register.SendCode'),
        sendWaiting: false,
        sendTimer: null,
        forgetPassworld: {
          phoneCountryFlag: 'flag-icon-us',
          phoneCountry: '+1',
          phoneNumber: '',
          code: '',
          phoneError: '',
          codeError: '',
        },
        forgetPassworldRule: {
          phoneNumber: [
            { validator: validatePhone, trigger: 'blur' }
          ],
          code: [
            { validator: validateCode, trigger: 'blur' }
          ],
        },
        commonCountrieData:[{name: 'China',dial_code: '+86',flag: 'flag-icon-cn'},
         {name: 'United States',dial_code: '+1',flag: 'flag-icon-us'},
         {name: 'Japan',dial_code: '+81',flag: 'flag-icon-jp'},
         {name: 'Germany',dial_code: '+49',flag: 'flag-icon-de'},
         {name: 'United Kingdom',dial_code: '+44',flag: 'flag-icon-gb'},
        ],
      }
    },
    mounted: function () {
      this.$parent.$refs.noticemsg.logout();
      util.LoadCssFiles(["/static/country-flags/css/flag-icon.min.css"]).then(()=>{
        util.LoadJsFiles(["/static/country-phone-code.js?v=201810011501"]).then(()=>{
          this.countryData = JSON.parse(JSON.stringify(countryPhoneCodeList));
          this.countryData.forEach((item) => {
            item.flag = "flag-icon-" + item.code.toLowerCase();
          });
          this.countryData.sort((a, b) => {
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {
              return -1;
            }
            else if (x > y) {
              return 1;
            }
            else {
              return 0;
            }
          });

          this.selectCountry.tableData = this.getCountryData();
        });
      });
     
    },
    methods: {
      back(){
        this.$router.push({name: 'login'});
      },
      getCountryData() {
        let result = this.countryData.filter((item) => {
          if (this.selectCountry.searchText) {
            let name = item.name ? item.name.toLowerCase() : '';
            let number = item.dial_code ? item.dial_code.toLowerCase() : '';
            let code = item.code ? item.code.toLowerCase() : '';
            let search = this.selectCountry.searchText.toLowerCase();
            return name.includes(search) || number.includes(search) || code.includes(search);
          }
          else {
            return true;
          }
        });

        for (let i = 0; i < result.length; i++) {
          result[i]._highlight = result[i].dial_code === this.selectCountry.current.dial_code;
        }

        return result;
      },
      handleSelectCountry() {
        this.selectCountry.modal = true;

        if (this.forgetPassworld.phoneCountry === '+86' && !this.selectCountry.searchText) {
          this.$nextTick(() => {
            $('.ivu-table-body').scrollTop(1500);
          });
        }
      },
      handleSelectCountryCurrentChange(currentRow) {
        this.selectCountry.current.name = currentRow.name;
        this.selectCountry.current.dial_code = currentRow.dial_code;
        this.selectCountry.current.flag = currentRow.flag;
      },
      selcetCommonCountrie(item){
        this.selectCountry.current.name = item.name;
        this.selectCountry.current.dial_code = item.dial_code;
        this.selectCountry.current.flag = item.flag;
      },
      handleSelectCountrySearch() {
        this.selectCountry.tableData = this.getCountryData();

        this.selectCountry.searchIcon = this.selectCountry.searchText ? 'close-round' : 'search';
      },
      handleSelectCountrySearchCancel() {
        this.selectCountry.searchText = '';
        this.handleSelectCountrySearch();
      },
      handleSelectCountryOK() {
        this.forgetPassworld.phoneCountryFlag = this.selectCountry.current.flag;
        this.forgetPassworld.phoneCountry = this.selectCountry.current.dial_code.replace(" ", "");
        this.selectCountry.modal = false;
      },
      handleSelectCountryCancel() {
        this.selectCountry.modal = false;
      },
      handleSendCode() {
        if (!this.forgetPassworld.phoneNumber) {
          this.forgetPassworld.phoneError = this.$t('Register.ErrorPhoneNumber');
          return;
        }

        let self = this;
        let url = GetAPIUrl() + "CheckCode/Send?type=2&mobile=" + encodeURIComponent(self.forgetPassworld.phoneCountry + self.forgetPassworld.phoneNumber);//Register = 1, ResetPwd = 2
        url+="&productID="+(IsKloudSync()?1:2);//1 : KloudSync 2：PeerTime

        self._postData(url, {}, null, (result) => {
          self.sendWaiting = true;
          self.sendText = self.$t('Register.SixtySEC');

          let now = new Date();
          let start = now.getTime();

          self.sendTimer = setInterval(()=>{
            now = new Date();
            let seconds = Math.floor(60 - (now.getTime() - start) / 1000);
            self.sendWaiting = seconds >= 0;
            self.sendText = seconds >= 0 ? seconds + self.$t('Register.Seconds') : self.$t('Register.ResendCode');

            if (seconds < 0) {
              clearInterval(self.sendTimer);
              self.sendTimer = null;
            }
          }, 100);
        }, (error) => {
          if (error) {
            self.forgetPassworld.codeError = error.ErrorMessage;
          }
        });
      },
      handleForgetOk() {
        let self = this;
        let phone = self.forgetPassworld.phoneCountry + self.forgetPassworld.phoneNumber;
        this.$refs.verificationPassworld.validate((valid) => {
          if (valid) {
            let url = GetAPIUrl() + "User/Verify4ResetPwd?mobile=" + encodeURIComponent(phone) + "&checkCode=" + encodeURIComponent(base64encode(self.forgetPassworld.code));
            self._postData(url, {}, null, (result) => {
              clearInterval(self.sendTimer);
              self.resetSuccess=true;
              self.resetMyPassworld.accessCode=result.AccessCode;
              self.$parent.$refs.noticemsg.init();
            }, (error) => {
              self.forgetPassworld.codeError = error;
            });
          }
        });
      },
      resetOk(){
        if(this.resetMyPassworld.passwd==""){
          this.resetMyPassworld.errorText1=this.$t('Register.ErrorPleaseEnterPassword');
          return;
        }else if(this.resetMyPassworld.passwdCheck==""){
          this.resetMyPassworld.errorText2=this.$t('Register.ErrorPleaseEnterPassword');
          return;
        }else if(this.resetMyPassworld.passwdCheck!==this.resetMyPassworld.passwd){
          this.resetMyPassworld.errorText1=this.$t('ForgetPassworld.ThepasswordDifference');
          this.resetMyPassworld.errorText2=this.$t('ForgetPassworld.ThepasswordDifference');
          return;
        }
        let data={
          'Mobile': this.forgetPassworld.phoneCountry + this.forgetPassworld.phoneNumber,
          'Password': base64encode(this.resetMyPassworld.passwdCheck),
          'AccessCode':this.resetMyPassworld.accessCode
        }
        let url = GetAPIUrl() + "User/ResetPwd";
        this._postData(url, data, null, (result) => {
          this.$Message.success({content:this.$t('ForgetPassworld.PasswordResetSuccessful'),duration:3});
          this.$router.push({name: 'login'});
        },()=>{});  
      },
      _postData(url, data, before, success, error) {
        if (before && typeof before === 'function') {
          before();
        }

        this.loading = true;
        this.$Loading.start();

        let self = this;
        $.ajax({
          type: 'POST',
          url: url,
          contentType: 'application/json; charset=utf-8',
          dataType: 'text',
          data: JSON.stringify(data),
          beforeSend: function (request) {
            request.setRequestHeader("UserToken", authenticator.getUserToken());
          },
          success: function (resultString) {
            let result = JSON.parse(resultString);
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
                error(result.ErrorMessage);
              }
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            self.loading = false;
            self.$Loading.error();
            self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
            console.log(xhr);

            if (error && typeof error === 'function') {
              error(xhr.status + ': ' + xhr.statusText);
            }
          }
        });
      },
    }
  }
</script>
