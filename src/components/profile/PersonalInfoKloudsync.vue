<template>
  <div id="Kloudsync-user-profile-personal">
    <div class="personal-header">
      <div class="personal-avatar">
        <Upload :action="avatar.action"
                :headers="avatar.headers"
                :show-upload-list="false"
                :default-file-list="avatar.list"
                :before-upload="handleChangeAvatarBeforeUpload"
                :on-progress="handleChangeAvatarProgress"
                :on-success="handleChangeAvatarSuccess"
                :on-error="handleChangeAvatarError"
                accept="image/jpeg,image/png">
          <img :src="avatar.file"><div class="personal-avatar-cover">{{$t("PersonalInfo.ClickToChange")}}</div>
        </Upload>
      </div>
      <!-- <div class="personal-desc">
        <Input v-model="user.desc" type="textarea" :autosize="{minRows: 5}" :placeholder="$t('PersonalInfo.DescribeYourself')"></Input>
      </div> -->
    </div>
    <div style="text-align:center;font-size:14px;font-weight:bold;margin-top:-25px;">{{fullName}}</div>

    <div>
      <table class="personal-detail">
        <!-- <tr>
          <td>{{$t("PersonalInfo.UserID")}}</td>
          <td><Input v-model="user.userName" disabled style="width: 50%"></Input></td>
          <td></td>
        </tr> -->
        <tr style="font-weight:bold;font-size:14px;height:50px">
          <td>
            {{$t("PersonalInfo.BasicInformation")}}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>{{$t("PersonalInfo.Name")}}</td>
          <td>
            <Input v-model="user.firstName" :placeholder="$t('PersonalInfo.FirstName')" style="width: 32%"></Input>
            <Input v-model="user.middleName" :placeholder="$t('PersonalInfo.MiddleName')" style="width: 32%"></Input>
            <Input v-show="!isLanguageCN" v-model="user.lastName" :placeholder="$t('PersonalInfo.LastName')" style="width: 32%"></Input>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>{{$t("PersonalInfo.Email")}}</td>
          <td><Input v-model="user.email" :placeholder="$t('PersonalInfo.EnterEmail')"></Input></td>
          <td></td>
        </tr>
        <tr valign="top">
          <td>{{$t('TeacherInfo.Biography')}}</td>
          <td><Input v-model="user.desc" type="textarea" :autosize="{minRows: 5,maxRows:8}" :placeholder="$t('PersonalInfo.DescribeYourself')"></Input></td>
          <td></td>
        </tr>
        <tr style="height:30px"></tr>
        <tr style="font-weight:bold;font-size:14px;height:50px">
          <td>
            {{$t("PersonalInfo.AccountSecurity")}}
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>{{$t("PersonalInfo.PrimaryPhone")}}</td>
          <td><Input v-model="user.phone1" disabled style="width: 50%" :placeholder="$t('PersonalInfo.EnterPrimaryPhoneNumber')"></Input><Button type="text" style="color: darkblue;" @click="handleChangePhone1">{{$t("PersonalInfo.Change")}}</Button></td>
          <td></td>
        </tr>
        <tr>
          <td>{{$t("PersonalInfo.SecondaryPhone")}}</td>
          <td><Input v-model="user.phone2" disabled style="width: 50%" :placeholder="$t('PersonalInfo.EnterSecondaryPhoneNumber')"></Input><Button type="text" style="color: darkblue;" @click="handleChangePhone2">{{$t("PersonalInfo.Change")}}</Button></td>
          <td></td>
        </tr>        
        <tr>
          <td>{{$t("PersonalInfo.Password")}}</td>
          <td><Input v-model="user.password" type="password" disabled style="width: 50%"></Input><Button type="text" style="color: darkblue;" @click="handleChangePassword">{{$t("PersonalInfo.Change")}}</Button></td>
          <td></td>
        </tr>
        <!-- <tr>
          <td>{{$t("PersonalInfo.Language")}} </td>
          <td><Input v-model="user.language" :placeholder="$t('PersonalInfo.EnterLanguage')"></Input></td>
          <td></td>
        </tr> -->
        <tr v-show="!kloudSyncFlag">
          <td>{{$t("PersonalInfo.AreaOfInterests")}}</td>
          <td>
            <Select v-model="user.interest" multiple filterable :placeholder="$t('PersonalInfo.SelectAreaOfInterests')">
              <Option value="english">{{$t("PersonalInfo.English")}}</Option>
              <Option value="math">{{$t("PersonalInfo.Math")}}</Option>
              <Option value="chemistry">{{$t("PersonalInfo.Chemistry")}}</Option>
              <Option value="biology">{{$t("PersonalInfo.Biology")}}</Option>
            </Select>
          </td>
          <td></td>
        </tr>
      </table>
    </div>

    <div>
      <Modal v-model="modalChangeUserName" :mask-closable="false" :title="$t('PersonalInfo.ChangeYourUserIDTitle')">
        <Form ref="formChangeUserName" :model="changeUserName" :rules="changeUserNameRule" label-position="right" :label-width="150">
          <FormItem :label="$t('PersonalInfo.CurrentUserID')">
            <Input v-model="changeUserName.userName0" disabled style="width: 250px"></Input>
          </FormItem>
          <FormItem :label="$t('PersonalInfo.NewUserID')" prop="userName1" :error="changeUserName.userName1Error" :required="true">
            <Input v-model="changeUserName.userName1" style="width: 250px"></Input>
          </FormItem>
          <FormItem :label="$t('PersonalInfo.Password')" :error="changeUserName.passwordError">
            <Input v-model="changeUserName.password" type="password" style="width: 250px"></Input>
          </FormItem>
        </Form>

        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleChangeUserNameOK">{{$t("PersonalInfo.Change")}}</Button>
          <Button @click="handleChangeUserNameCancel">{{$t("Base.Cancel")}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalChangePassword" :mask-closable="false" :title="$t('PersonalInfo.ChangeYourPassword')">
        <Form ref="formChangePassword" :model="changePassword" :rules="changePasswordRule" label-position="right" :label-width="150">
          <FormItem :label="$t('PersonalInfo.CurrentPassword')" :error="changePassword.password0Error">
            <Input v-model="changePassword.password0" type="password" style="width: 250px"></Input>
          </FormItem>
          <FormItem :label="$t('PersonalInfo.NewPassword')" prop="password1">
            <Input v-model="changePassword.password1" type="password" style="width: 250px"></Input>
          </FormItem>
          <FormItem :label="$t('PersonalInfo.ConfirmPassword')" prop="password2">
            <Input v-model="changePassword.password2" type="password" style="width: 250px"></Input>
          </FormItem>
        </Form>

        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleChangePasswordOK">{{$t("PersonalInfo.Change")}}</Button>
          <Button @click="handleChangePasswordCancel">{{$t("Base.Cancel")}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalChangePhone" :mask-closable="false" :title="$t('PersonalInfo.ChangeYourPhoneNumber')">
        <Form ref="formChangePhone" :model="changePhone" label-position="right" :label-width="150">
          <FormItem :label="$t('PersonalInfo.CurrentPhoneNumber')">
            <Input v-model="changePhone.phone0" disabled style="width: 250px"></Input>
          </FormItem>
          <FormItem :label="$t('PersonalInfo.NewPhoneNumber')">
            <Input v-model="changePhone.phone1" style="width: 250px"></Input>
          </FormItem>
          <FormItem label="">
            <RadioGroup v-model="changePhone.type">
              <Radio label="text">
                <span>{{$t("PersonalInfo.TextMessage")}}</span>
              </Radio>
              <Radio label="voice">
                <span>{{$t("PersonalInfo.VoiceCall")}}</span>
              </Radio>
            </RadioGroup>

            <Button type="primary" @click="handleChangePhoneCode">{{$t("PersonalInfo.SendCode")}}</Button>
          </FormItem>
          <FormItem :label="$t('PersonalInfo.VerificationCode')" :error="changePhone.codeError">
            <Input v-model="changePhone.code" style="width: 100px"></Input>
          </FormItem>
        </Form>

        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleChangePhoneOK">{{$t("PersonalInfo.Change")}}</Button>
          <Button @click="handleChangePhoneCancel">{{$t("Base.Cancel")}}</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<style lang="scss">
#Kloudsync-user-profile-personal {

  .personal-header {
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
  }

  .personal-avatar {
    background: white;
    //display: inline-block;
    width: 100px;
    text-align: center;
    height: 100px;
    position: relative;

    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 1px solid #495060;
    }

    .personal-avatar-cover {
      position: absolute;
      left: 0;
      top: 0;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: rgba(0, 0, 0, .5);
      display: none;
      color: white;
      line-height: 100px;
      text-align: center;
      cursor: pointer;
    }
  }
  .personal-avatar:hover .personal-avatar-cover {
    display: block;
  }

  .personal-desc {
    padding-left: 120px;

    input {
      font-size: larger;
      font-weight: bolder;
      border: 1px solid transparent;
    }

    input:read-write:hover, input:read-write:focus {
      border: 1px solid #80848f;
    }

    textarea {
      resize: none;
      border: 1px solid transparent;
      overflow: hidden;
    }

    textarea:read-write:hover, textarea:read-write:focus{
      border: 1px solid #80848f;
    }
  }

  .personal-detail {
    margin: auto;
    border-collapse: collapse;
    border-spacing: 0;

    td:first-of-type {
      text-align: right;
      width: 25%;
    }

    td:nth-of-type(2) {
      padding: 5px 20px;
      text-align: left;
    }
    td:last-of-type {
      width: 25%;
    }
  }
  .teacher-apply, .school-apply {
    border-top: 1px dashed #dddee1;
    padding-top: 10px;
    margin-top: 10px;
  }
}
</style>

<script>
  import auth from '../../authenticator';

  export default {
    data() {
      const validateUserName1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t("PersonalInfo.PleaseEnterNewUserID")));
        }
        else {
          callback();
        }
      };
      const validatePassword1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t("PersonalInfo.PleaseEnterNewPassword")));
        }
        else {
          callback();
        }
      };
      const validatePassword2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t("PersonalInfo.PleaseEnterNewPassword")));
        }
        else if (value !== this.changePassword.password1) {
          callback(new Error(this.$t("PersonalInfo.PasswordsNotMatch")));
        }
        else {
          callback();
        }
      };

      return {
        initialized: false,
        loading: false,
        avatar: {
          action: GetAPIUrl() + 'Avatar',
          headers: {"UserToken": auth.getUserToken()},
          file: '',
          list: []
        },
        user: {
          id: 0,
          desc: '',
          userName: '',
          password: '',
          nickname: '',
          firstName: '',
          middleName: '',
          lastName: '',
          phone1: '',
          phone2: '',
          email: '',
          language: '',
          interest: []
        },
        modalChangeUserName: false,
        changeUserName: {
          userName0: '',
          userName1: '',
          password: '',
          userName1Error: '',
          passwordError: ''
        },
        changeUserNameRule: {
          userName1: [
            { validator: validateUserName1, trigger: 'blur' }
          ]
        },
        modalChangePassword: false,
        changePassword: {
          password0: '',
          password1: '',
          password2: '',
          password0Error: ''
        },
        changePasswordRule: {
          password1: [
            { validator: validatePassword1, trigger: 'blur' }
          ],
          password2: [
            { validator: validatePassword2, trigger: 'blur' }
          ]
        },
        modalChangePhone: false,
        changePhone: {
          index: 0,
          phone0: '',
          phone1: '',
          type: 'text',
          code: '',
          codeError: ''
        }
      };
    },
    inject:[
      'reloadHeader'
    ],
    computed: {
      fullName() {
        return this.user.firstName + ' ' + this.user.middleName + ' ' + this.user.lastName;
      },
      kloudSyncFlag(){
        return IsKloudSync();
      },
      isLanguageCN(){
        if(this.$i18n.locale==="cn"){
          return true;
        }
        return false;
      }
    },
    mounted() {
    },
    methods: {
      initialize() {
        if (!this.initialized)
          this.readData();
      },
      readData() {
        let self = this;

        let url = GetAPIUrl() + "User/UserProfile";
        this._getData(url, null, (user) => {
          if (user) {
            self.user = {
              id: user.UserID,
              avatar: user.AvatarUrl,
              desc: user.Description,
              userName: user.LoginName,
              password: 'a-strong-password',
              nickname: user.Nickname,
              firstName: user.FirstName,
              middleName: user.MiddleName,
              lastName: user.LastName,
              phone1: user.PrimaryPhone,
              phone2: user.SecondaryPhone,
              email: user.Email,
              language: '',
              interest: []
            };

            self.avatar.file = user.AvatarUrl;
            
            self.initialized = true;
          }
        });
      },
      saveData(callback) {
        if(this.isLanguageCN){
          this.user.lastName=""
        }
        let data = {
          "UserID": this.user.id,
          "Nickname": this.user.nickname,
          "FirstName": this.user.firstName,
          "MiddleName": this.user.middleName,
          "LastName": this.user.lastName,
          "Description": this.user.desc,
          "PrimaryPhone": this.user.phone1,
          "SecondaryPhone": this.user.phone2,
          "Email": this.user.email
        };

        let names = [];
        if (this.user.firstName)
          names.push(this.user.firstName);
        if (this.user.middleName)
          names.push(this.user.middleName);
        if (this.user.lastName)
          names.push(this.user.lastName);

        name = names.join(' ');
        if (name === '')
          name = this.user.userName;

        let url = GetAPIUrl() + "User/UpdateUserProfile";
        let self = this;

        this._postData(url, data, null, (data) => {
          auth.setUserName(name);
          self.reloadHeader();
          self.$Message.success(self.$t("PersonalInfo.PersonalChangeSaved"));
          if (callback)
            callback(true);
        }, (error) => {
          if (callback)
            callback(false);
        });
      },
      handleChangeAvatarBeforeUpload(file) {
        this.loading = true;
        this.$Loading.start();
      },
      handleChangeAvatarProgress() {

      },
      handleChangeAvatarSuccess(result, file) {
        this.loading = false;
        if (result.RetCode === 0) {
          this.avatar.file = result.RetData;
          this.$Loading.finish();
        }
        else {
          this.$Loading.error();
          this.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
        }
      },
      handleChangeAvatarError(error, file, fileList) {
        this.loading = false;
        this.$Loading.error();
        this.$Message.error({content: error.status + ': ' + error.statusText,duration: 0,closable: true})
      },
      handleChangeUserName() {
        this.changeUserName.userName0 = this.user.userName;
        this.changeUserName.userName1 = '';
        this.changeUserName.password = '';
        this.changeUserName.userName1Error = '';
        this.changeUserName.passwordError = '';
        this.modalChangeUserName = true;
      },
      handleChangeUserNameOK() {
        let self = this;

        this.$refs.formChangeUserName.validate((valid) => {
          if (valid) {
            let url = GetAPIUrl() + "User/ChangeLoginName?loginName=" + encodeURIComponent(self.changeUserName.userName1) + "&password=" + encodeURIComponent(self.changeUserName.password) + "&encryptOption=0";

            self._postData(url, {}, null, (result) => {
              self.user.userName = self.changeUserName.userName1;
              self.modalChangeUserName = false;
            }, (error) => {
              if (error) {
                if (error.RetCode < -10000) {
                  self.changeUserName.passwordError = error.ErrorMessage;
                }
                else {
                  self.changeUserName.userName1Error = error.ErrorMessage;
                }
              }
            });
          }
        });
      },
      handleChangeUserNameCancel() {
        this.modalChangeUserName = false;
      },
      handleChangePassword() {
        this.changePassword.password0 = '';
        this.changePassword.password1 = '';
        this.changePassword.password2 = '';
        this.changePassword.password0Error = '';
        this.modalChangePassword = true;
      },
      handleChangePasswordOK() {
        let self = this;

        this.$refs.formChangePassword.validate((valid) => {
          if (valid) {

          }
        });
      },
      handleChangePasswordCancel() {
        this.modalChangePassword = false;
      },
      handleChangePhone1() {
        this.changePhone.index = 1;
        this.changePhone.phone0 = this.user.phone1;
        this.changePhone.phone1 = '';
        this.changePhone.type = 'text';
        this.changePhone.code = '';
        this.modalChangePhone = true;
      },
      handleChangePhone2() {
        this.changePhone.index = 2;
        this.changePhone.phone0 = this.user.phone2;
        this.changePhone.phone1 = '';
        this.changePhone.type = 'text';
        this.changePhone.code = '';
        this.modalChangePhone = true;
      },
      handleChangePhoneCode() {

      },
      handleChangePhoneOK() {
        let self = this;

        /*this.$refs.formChangePhone.validate((valid) => {
          if (valid) {
          }
        });*/

        let url = '';
        if (this.changePhone.index === 1) {
          url = GetAPIUrl() + "User/ChangePrimaryPhone?phoneNumber=" + this.changePhone.phone1;
        }
        else {
          url = GetAPIUrl() + "User/ChangeSecondaryPhone?phoneNumber=" + this.changePhone.phone1;
        }

        self._postData(url, {}, null, (result) => {
          if (self.changePhone.index === 1) {
            self.user.phone1 = self.changePhone.phone1;
          }
          else {
            self.user.phone2 = self.changePhone.phone1;
          }
          self.modalChangePhone = false;
        }, (error) => {
          if (error) {
            self.changePhone.codeError = result.ErrorMessage;
          }
        });
      },
      handleChangePhoneCancel() {
        this.modalChangePhone = false;
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
              self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
              console.log(result);
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            if (error && typeof error === 'function') {
              error();
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
            console.log(xhr);
          }
        });
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
            request.setRequestHeader("UserToken", auth.getUserToken());
          },
          success: function (resultString) {
            let result = JSON.parse(resultString);
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
              self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
              console.log(result);
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            if (error && typeof error === 'function') {
              error();
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
            console.log(xhr);
          }
        });
      },
      _deleteData(url, before, success, error) {
        if (before && typeof before === 'function') {
          before();
        }

        this.loading = true;
        this.$Loading.start();

        let self = this;
        $.ajax({
          type: 'DELETE',
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
              self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
              console.log(result);
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            if (error && typeof error === 'function') {
              error();
            }

            self.loading = false;
            self.$Loading.error();
            self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
            console.log(xhr);
          }
        });
      }
    }
  }
</script>
