<template>
  <div id="invitation-notice" v-show="state=='companies' || (state=='people' && people.length!=0)">
    <div id="header">
      <div id="logo" >
        <img src="../../../static/images/kloudsyncLogo.png" />
        <p>KloudSync</p>
      </div>
      <p id="welcome"> {{welcome}} </p>
      <div id="message">
        <hr />
        <p> {{message}} </p>
        <hr />
      </div>
    </div>
    <div id="companies" v-if="state=='companies'">
      <div class="card" v-for="(company, index) of companies" :key="index" @click="checkCompany(company)">
        <div class="content">
          <div class="company">
            <Avatar class="avatar" shape="square" :icon="company.CompanyLogoUrl ? '' : 'android-people'" size="large" :src="company.CompanyLogoUrl"/>
            <p class="name"> {{ company.CompanyName }} </p>
          </div>
          <p class="invitation">
            {{$t('KloudSyncInvitationNotice.Invitation')}}
          </p>
        </div>

        <div class="check">
          {{$t('KloudSyncInvitationNotice.InviteJoin')}}
          <Icon :type="companiesSelected.indexOf(company) > -1 ? 'ios-checkmark': 'ios-circle-outline'" :color="companiesSelected.indexOf(company) > -1 ? '#19be6b': ''" size=20></Icon>
        </div>
      </div>
    </div>
    <div id="people" v-if="state=='people'">
      <div class='item' v-for="(person, index) in people" :key="index" @click="checkPerson(person)">
        <div class='person'>
          <Avatar class="avatar" :icon="person.AvatarUrl ? '' : 'person'" :src="person.AvatarUrl ? person.AvatarUrl: ''"/>
          <p>{{ person.UserName }}</p>
        </div>
        <Icon :type="peopleSelected.indexOf(person.RongCloudID) > -1 ? 'ios-checkmark': 'ios-circle-outline'" :color="peopleSelected.indexOf(person.RongCloudID) > -1 ? '#19be6b': ''" size=20></Icon>
      </div>

    </div>
    <div id="footer">
      <Button type="ghost" shape="circle" @click="skipStep()"><p class="button">{{ $t('KloudSyncInvitationNotice.Skip') }}</p></Button>
      <Button type="primary" shape="circle" @click="nextStep()"><p class="button" >{{ $t('KloudSyncInvitationNotice.Next') }}</p></Button>
    </div>
  </div>
</template>

<script>
import auth from "../../authenticator";
import kloudsyncIndex from "../../common/kloudsync/index.js";

export default {
  data () {
    return {
      state: 'companies',
      companies: [],
      people: [],
      companiesSelected: [],
      currentCompanyIndex: -1,
      peopleSelected: [],
      message: this.$t('KloudSyncInvitationNotice.CompaniesMessage'),
    }
  },
  props:{
    isRegister:{
      type:Boolean,
      default:false,
    }
  },
  computed: {
    welcome () {
      if (this.state == 'companies') {
        return this.$t('KloudSyncInvitationNotice.CompaniesWelcome');
      } else if (this.state == 'people') {
        return this.$t('KloudSyncInvitationNotice.PeopleWelcome');
      } else {
        return '';
      }
    },
    // message () {
    //   if (this.state == 'companies') {
    //     return 'WOW, Someone has invited you, click to join now';
    //   } else if (this.state == 'people') {
    //     return 'Hi, '+ this.companiesSelected[this.currentCompanyIndex].companyName +'公司有以下的用户要成为你的个人好友，请确认他们的好友请求吧'
    //   } else {
    //     return ''
    //   }
    // },
    // currentCompanyPeople () {
    //   var currentCompanyID = this.companiesSelected[this.currentCompanyIndex]
    //   return this.people.filter(p => p.CompanyID == currentCompanyID);
    // }
  },
  watch: {
    currentCompanyIndex(val){
      if (this.state == 'companies') {
        this.message = this.$t('KloudSyncInvitationNotice.CompaniesMessage')
      } else if (this.state == 'people') {
        this.message = this.$t('KloudSyncInvitationNotice.PeopleMessage', {CompanyName: this.companiesSelected[val].CompanyName})
      } else {
        this.message = "";
      }
    }
  },
  mounted() {
    this.initial();
  },
  methods: {
    _getData(url, before, success, error) {
      this.loading = true;
      this.$Loading.start();

      if (before && typeof before === "function") {
        before();
      }

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
      this.loading = true;
      this.$Loading.start();

      if (before && typeof before === "function") {
        before();
      }

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
    },
    initial () {
      // this.companies = [
      //   {"CompanyID":3713,"CompanyName":"PeerTime Found's school","CompanyLogoUrl":"../../../static/images/kloudsync.png"},
      //   {"CompanyID":3714,"CompanyName":"Company A","CompanyLogoUrl":""},
      //   {"CompanyID":3715,"CompanyName":"Company B","CompanyLogoUrl":"../../../static/images/kloudsync.png"},
      //   {"CompanyID":3716,"CompanyName":"Company C","CompanyLogoUrl":""}
      // ];
      // return;
      let self = this;
      kloudsyncIndex.loadCompanies().then((res)=>{
        if (res){
          self.companies = res.InvitationList;
          if (!res.HaveComany && self.companies.length == 0){
            self.$router.push({ name: "kloudsync-create-company" });
          }else if(self.companies.length == 0 && res.HaveComany){
            self.$router.push({name: 'kloudsync-documents'});
          }
        }
      })
    },
    loadPeople () {
      // this.people = [
      //     {AvatarUrl: null, UserName: 'Alice', RongCloudID: 3716},
      //     {AvatarUrl: null, UserName: 'Bob', RongCloudID: 3711},
      //     {AvatarUrl: '../../../static/images/kloudsync.png', UserName: 'Chris', RongCloudID: 3712},
      //     {AvatarUrl: '../../../static/images/kloudsync.png', UserName: 'David', RongCloudID: 3713},
      //     {AvatarUrl: null, UserName: 'Emily', RongCloudID: 3714},
      //     {AvatarUrl: null, UserName: 'F', RongCloudID: 3718},
      //     {AvatarUrl: '../../../static/images/kloudsync.png', UserName: 'G', RongCloudID: 3719},
      //     {AvatarUrl: '../../../static/images/kloudsync.png', UserName: 'H', RongCloudID: 3715}
      // ];
      // return;
      this.peopleSelected = [];
      this.people = [];
      return new Promise((resolve, reject) => {
        let url = GetAPIUrl() + 'Invite/FriendRequest?companyID='+ this.companiesSelected[this.currentCompanyIndex].CompanyID;
        this._getData(url, null, data => {
          if (data) {
            resolve(data);
            this.people = data;
            if(this.people.length==0){
              this.nextStep ();
            }
          }else{
            resolve(null);
          }
        }, null);
      });
    },
    joinCompaniesSelected () {
      // return;
      let url = GetAPIUrl() + 'Invite/AcceptInvitations';
      let array = [];
      for(let item of this.companiesSelected){
        array.push(item.CompanyID);
      }
      let data = {"CompanyList": array};
      this._postData(url, data, null, (result)=>{
        this.currentCompanyIndex = 0;
        this.loadPeople();
      }, null);
    },
    checkCompany (company) {
      var index = this.companiesSelected.indexOf(company)
      if (index > -1) {
        this.companiesSelected.splice(index, 1);
      }
      else {
        this.companiesSelected.push(company);
      }
    },
    checkPerson(person){
      var index = this.peopleSelected.indexOf(person.RongCloudID)
      if (index > -1) {
        this.peopleSelected.splice(index, 1);
      }
      else {
        this.peopleSelected.push(person.RongCloudID);
      }
    },
    acceptCompanyFrindList() {
      return new Promise((resolve, reject) => {
        if(this.peopleSelected.length<=0){
          resolve(1);
          return;
        }
        let data = {"RongCloudIDList": this.peopleSelected}
        let url = GetAPIUrl() + 'Invite/AcceptFriendRequest';
        this._postData(url, data, null,(result)=>{
          resolve(1);
      }, null);
      });
    },
    skipStep () {
      let self = this;
      kloudsyncIndex.loadCompanies().then((res)=>{
        if (res){
          if (!res.HaveComany){
            self.$router.push({ name: "kloudsync-create-company" });
            return;
          }
        }
        if (self.state == 'companies') {
          self.$router.push({name: 'kloudsync-documents'});
          // TODO: to the create page
        } else if (self.state == 'people') {
          self.$router.push({name: 'kloudsync-documents'});
        }
      })
    },
    nextStep () {
      if (this.state == 'companies') {
        if (this.companiesSelected.length > 0) {
          this.joinCompaniesSelected();
          this.state = 'people';
        }
        else {
          alert(this.$t('KloudSyncInvitationNotice.AtLeastOne'));
        }
      } else if (this.state == 'people') {
        // TODO: add peopleSelected
        if (this.currentCompanyIndex < this.companiesSelected.length - 1) {
          this.acceptCompanyFrindList().then((result)=>{
            this.currentCompanyIndex += 1;
            this.loadPeople();
          });
        }
        else {
          this.acceptCompanyFrindList().then((result)=>{
            this.$router.push({name: 'kloudsync-documents'});
          });
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#invitation-notice {
  height: 100%;
  background-color: #f8f8f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  #header {
    margin: 50px 0 30px 0;
    width: 600px;
    height: 140px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    #logo {
      img {
        width: 40px;
        height: 40px;
      }
      p {
        font-weight: 450;
      }
    }
    #welcome {
      font-weight: 700;
    }
    #message {
      align-self: stretch;
      display: flex;
      align-items: center;
      justify-content: stretch;
      hr {
        flex: 1 1 auto;
        display: block;
        height: 1px;
        border: 0;
        border-top: 1px solid #e9eaec;
        margin: 1em 0;
        padding: 0;
      }
      p {
        flex: 0 0 auto;
        margin-left: 20px;
        margin-right: 20px;
        font-size: 12px;
      }
    }
  }
  #companies {
    width: 840px;
    display: flex;
    flex-wrap: wrap;
    .card {
      width: 260px;
      margin: 10px;
      padding: 20px;
      border-radius: 6px;
      background-color: white;
      box-shadow: 0 0 3px #cccccc;
      cursor: pointer;
      .content {
        padding-bottom: 10px;
        border-bottom: 1px solid #e9eaec;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        .company {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .avatar {
            margin-top: 5px;
            margin-bottom: 5px;
            width: 40px;
            height: 40px;
          }
          .name {
            text-align: left;
            margin-top: 5px;
            font-weight: 600;
          }
        }
        .invitation {
          font-weight: 600;
          color: #2d8cf0;
        }
      }
      .check {
        padding-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
      }
    }
    .card:hover {
      box-shadow: 0 0 6px #cccccc;
    }
  }
  #people {
    width:480px;
    display: flex;
    flex-wrap: wrap;
    justify-content:space-between;
    align-items:center;
    .person {
      margin: 10px;
      padding: 5px;
      display: flex;
      align-items: center;
      p {
        margin-left: 10px;
      }
    }
    .item {
      width: 180px;
      display: flex;
      align-items: center;
      justify-content:space-between;
      cursor: pointer;
    }
  }
  #footer {
    margin: 40px 0 30px 0;
    width: 300px;
    display: flex;
    justify-content: space-between;
    .button {
      width: 80px;
    }
  }
}
</style>
