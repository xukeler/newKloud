<template>
  <div class="kloudsync-settings-profile">
    <div class="panel-header">
      {{$t('KloudSyncSettingsProfile.AccountInfo')}}

      <div class="panel-header-right">
        <Button @click="handleCancel">{{$t('Base.Cancel')}}</Button>
        <Button type="success" @click="handleSave">{{$t('Base.Save')}}</Button>
      </div>
    </div>
    <div class="panel-content-cover">
      <div class="setting-content">
        <div class="profile-frame">
          <div>
            <Upload ref="uploadCreateCompany"
            :headers="uploadCompanyFileHeaders" 
            type="drag" 
            :show-upload-list="false"
            :before-upload="handleChangeLogoBeforeUpload"
            :on-progress="handleChangeLogoProgress"
            :on-success="handleChangeLogoSuccess"
            :on-error="handleChangeLogoError"
            :action="uploadCreateCompanyUrl"
            accept="image/jpg,image/jpeg,image/png" 
            :format="['jpg','jpeg','png']"
            style="margin:0 auto;">
              <div class="logo" v-show="!companyLogo">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>{{$t('KloudSyncSettingsProfile.UploadCompanyLogo')}}</p>
              </div>
              <div class="logo" v-show="companyLogo">
                <img :src="companyLogo">
                <div class="logo-cover">
                  <p><Icon type="ios-cloud-upload" size="52" style="color: #ffffff"></Icon></p>
                  <p>{{$t('KloudSyncSettingsProfile.ChangeCompanyLogo')}}</p>
                </div>
              </div>
            </Upload>
          </div>
          <div style="margin-top: 1em;">
            <p class="label-part">{{$t('KloudSyncSettingsProfile.ACCOUNTNAME')}}</p>
            <p><Input v-model="schoolName" /></p>
          </div>
          <div style="margin-top: 1em;">
            <p class="label-part">{{$t('KloudSyncSettingsProfile.ACCOUNTADDRESS')}}</p>
            <p><Input v-model="schoolSite" /></p>
          </div>
          <div style="margin-top: 1em;">
            <p class="label-part">{{$t('KloudSyncSettingsProfile.ACCOUNTEMAILADDRESS')}}</p>
            <p><Input v-model="schoolEmailDomain" /></p>
          </div>
          <div style="margin-top: 1em;">
            <p class="label-part">
              <Checkbox v-model="setSysAccount" style="font-size:14px;" @on-change="changeSys">{{$t('KloudSyncSettingsProfile.SetAsSystemAccount')}}</Checkbox>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.kloudsync-settings-profile {
  height: 100%;
  width: 100%;

  .panel-header {
    width: 100%;
    text-align: left;
    padding: 0 20px;
    height: 65px;
    line-height: 65px;
    position: relative;
    border-bottom: 1px solid #dddee1;
    font-size: 16px;
    font-weight: bold;

    .panel-header-right {
      float: right;
      font-size: 14px;
      font-weight: normal;

      .header-search-wrap {
        display: inline-block;
        width: 200px;
        vertical-align: middle;
        margin-right: 1em;

        .ivu-input {
          border-color: transparent;
        }
      }
    }
  }

  .panel-content-cover {
    padding:24px; 
    background-color: #FBFBFD; 
    min-height: calc(100% - 65px); 
    height: calc(100% - 65px);
    width:100%;
  }

  .setting-content {
    width: 100%;
    height: 100%;
    background: #fff;
    border: 1px solid #dddee1;
    border-radius: 3px;

    .profile-frame {
      width: 500px;
      margin: 48px auto 0;
      text-align: left; 

      .logo{
        margin: 20px 10px;
        position: relative;
        img{
          width: 150px;
        }
      }
      .logo-cover{
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content:center;
        align-items:center;
        align-content: center;
        flex-direction: column;
        z-index: 10;
        color: white;
        background-color: rgba(0, 0, 0, 0);
        opacity: 0;
      }
      .ivu-upload-drag{
        border: 1px solid transparent;
      }
      .ivu-upload-drag:hover{
        .logo-cover{
          background-color: rgba(0, 0, 0, 0.3);
          opacity: 0.7;
        }
      }
      .label-part {
        color: #80848f;
        line-height: 2em;
      }
    }
  }
}
</style>

<script>
import auth from "../../authenticator";

export default {
  data() {
    return {
      loading: '',
      schoolName: '',
      schoolSite: '',
      schoolEmailDomain: '',
      setSysAccount:false,

      uploadCompanyFileHeaders:{"UserToken": auth.getUserToken()},
      uploadCompanyFile :null,
      companyLogo:'',
    }
  },
  computed: {
    schoolId() {
      return auth.getChosenSchoolId();
    },
    uploadCreateCompanyUrl(){
      return GetAPIUrl() + 'School/UploadCompanyAvatar?companyID='+this.schoolId;
    }
  },
  mounted() {
    this.readData();
    this.getCompanyLogo();
  },
  methods: {
    getCompanyLogo(){
      let url = GetAPIUrl() + 'School/GetCompanyAvatar?companyID='+this.schoolId;
      let self = this;
      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function (request) {
          request.setRequestHeader("UserToken",auth.getUserToken());
        },
        success: function (data) {
          if (data.RetCode === 0 && data.RetData) {
            self.companyLogo = data.RetData;
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          console.log(xhr);
        }
      });
    },
    handleChangeLogoBeforeUpload(file) {
        this.$Loading.start();
    },
    handleChangeLogoProgress() {

    },
    handleChangeLogoSuccess(result, file) {
      if (result.RetCode === 0) {
        this.companyLogo = result.RetData;
        this.$Loading.finish();
      }
      else {
        this.$Loading.error();
        this.$Message.error({content: result.ErrorMessage,duration: 0,closable: true})
      }
    },
    handleChangeLogoError(error, file, fileList) {
      this.$Loading.error();
      this.$Message.error({content: error.status + ': ' + error.statusText,duration: 0,closable: true})
    },
    changeSys(val){
      if(val){
        this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t('KloudSyncSettingsProfile.SystemAccountcannotDesignatedAgain'), top: 24,duration: 4, left:true });
        this.$nextTick(()=>{
          this.setSysAccount=false;
        })
      }
    },
    readData() {
      let self = this;

      let url = GetAPIUrl() + "School/SchoolInfo?schoolID=" + this.schoolId;
      this._getData(url, null, (result) => {
        self.schoolName = result.SchoolName;
      }, null);
    },
    handleSave() {

      // let self = this;
      // let url = GetAPIUrl()+"";
      // let data = {
      //   schoolName:this.schoolName,
      //      schoolSite:this.schoolSite,
      //   schoolEmailDomain:this.schoolEmailDomain,
      //   setSysAccount:this.setSysAccount
      // }
      // this._postData(url,data,null,(result)=>{

      // },null)
    },
    handleCancel() {

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
              error(result);
            }
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
          console.log(xhr);

          if (error && typeof error === 'function') {
            error();
          }
        }
      });
    }
  }
}
</script>

