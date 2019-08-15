<template>
  <div>
    <Modal v-model="modalAddMyFriends" :mask-closable="false" title="添加好友" style="z-index: 4000; position: absolute;">
      <div class="add-my-friends">
        <div v-show="!showSearchResult">
          <Input v-model="searchAddFriends" icon="ios-search" style="width: 100%" placeholder="请输入手机号来添加好友"/>
        </div>
        <div class="search-button-space" v-show="showSearchButton && !showSearchResult" @click="handSearchFriend">
          <div class="search-icon">
            <Icon type="search" size="20" color="#ffffff"></Icon>
          </div>
          <div class="text">
            搜索:
          </div>
          <div class="text" style="color:19be6b">
            {{searchAddFriends}}
          </div>
        </div>
        <div v-show="showSearchResult">
          <div class="person">
            <span style="flex:1 1 120px">
              <span><Avatar :src="searchResultPerson.AvatarUrl == '' ? '/static/images/user.svg' : searchResultPerson.AvatarUrl" /></span>
              <span style="margin-left: 10px;">{{searchResultPerson.Name}}</span>
            </span>
          </div>
        </div>
      </div>
      <div slot="footer" v-show="showSearchResult">
        <Button type="primary" @click="showSearchResult=false">{{$t('Common.Back')}}</Button>
        <Button type="primary" @click="addFriendOk" v-show="!searchResultPerson.IsFriend">添加</Button>
        <Button disabled v-show="searchResultPerson.IsFriend">已添加</Button>
      </div>
    </Modal>
  </div>
</template>
<style lang="scss" scoped>
.add-my-friends{
  .search-button-space{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap:wrap;
    border: 1px solid #dddee1;
    margin-top: 15px;
    border-radius: 5px;
    cursor: pointer;
    height: 36px;
    .search-icon{
      margin-left: 7px;
      width: 25px;
      height: 25px;
      text-align: center;
      line-height: 31px;
      border-radius: 5px;
      background-color: #19be6b;
    }
    .text{
      font-size: 13px;
      font-weight: bold;
      margin-left: 8px;
    }
  }
  .search-button-space:hover{
    background-color: #dddee1;
  }
  .person{
    padding: 6px;
    font-size: 14px;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    display:flex;
  }
}
</style>
<script>
import auth from "../../authenticator";
export default {
  data(){
    return {
      loading:false,
      modalAddMyFriends:false,
      searchAddFriends:'',

      showSearchResult:false,
      searchResultPerson:{
        AvatarUrl:'',
        Name:'',
      },
    }
  },
  computed: {
    showSearchButton(){
      if(this.searchAddFriends){
        return true;
      }
      return false;
    }
  },
  methods: {
    handInviteNewFriends(){
      this.searchAddFriends = "";
      this.modalAddMyFriends = true;
    },
    handSearchFriend(){
      if(!this.searchAddFriends){
        this.$Message.warning({
            content: '电话号码不能为空',
            duration: 3,
        });
        return;
      }

      let self = this;
      let url=GetAPIUrl()+"Friend/SearchFriend?Phone=" + this.searchAddFriends;
      this._getData(url, null, data => {
        if(data.length == 0){
          self.$Message.warning({
              content: '用户不存在或输入号码有误',
              duration: 3,
          });
          return;
        }
        self.showSearchResult = true;
        self.searchResultPerson = data[0];
      }, null);
    },
    addFriendOk(){
      let self = this;
      let url=GetAPIUrl()+"Friend/ApplyFriend";
      let data = {
        "TargetID":self.searchResultPerson.RongCloudUserID,
        "UserID":auth.getUserID(),
      }
      this._postData(url, data, null, (result) => {
        self.showSearchResult = false;
        self.modalAddMyFriends = false;
        self.$Message.info({
          content: '已发送好友申请,您需要等待对方好友接受，才能与好友对话',
          duration: 3,
        });
      }, null);
    },
    _getData(url, before, success, error) {
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
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.$Loading.error();
          self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
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
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === 'function') {
              success(result.RetData);
            }
          }
          else { // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === 'function') {
              error(result);
            }
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ': ' + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === 'function') {
            error();
          }
        }
      });
    },
  }
};
</script>



