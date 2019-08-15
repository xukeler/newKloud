<template>
    <div id="ctl-seletfriends">
         <Modal
            v-model="inviteuser"
            title="$t('Live.InviteUser')"
            width="600"
            :closable="false"
            :mask-closable="false"
            @on-ok="inviteuserOK"
            @on-cancel="inviteuserCancel"
            style="z-index:40000;position: absolute; "
            class-name="hideModalFooter"
        >
            <div slot="header" style=" height:30px;">
                <span style="font-size:16px; font-weight:bold;">{{$t("Live.InviteUser")}}</span>
                <span style="float:right;">
                    <Button type="primary" @click="inviteuserOK">{{$t("Base.OK")}}</Button>
                    <Button type="text" @click="inviteuserCancel">{{$t("Base.Cancel")}}</Button>
                </span>
            </div>
            <Input
                v-model="filterFriendKey"
                :placeholder="$t('Live.SearchFriend')"
                style="width: 300px; margin-bottom:15px;"
            ></Input>
            <Row style="background:rgba(0,153,229,.7); height:30px;" type="flex" align="middle">
                <Col span="2">&nbsp;</Col>
                <Col span="6">{{$t("Base.Face")}}</Col>
                <Col span="16">{{$t("Base.Name")}}</Col>
            </Row>
            <div style="height:300px; overflow:auto;">
                <div id="friendsList" class="favList" v-for="item in filterFriends">
                    <Row style="height:50px;" type="flex" align="middle">
                        <Col span="2">
                            <input type="checkbox" :value="item.id" v-model="selectedFriends">
                        </Col>
                        <Col span="6">
                            <Avatar shape="square" :src="item.face"/>
                        </Col>
                        <Col span="16">{{item.name}}</Col>
                    </Row>
                </div>
            </div>
            <div slot="footer" style="display:none;"></div>
        </Modal>
    </div>
</template>
<style lang="scss">

</style>

<script>
import auth from "../../authenticator";
import friends from "../../friends/index.js";
import webapi from "../../webapi/webapi.js";
import loger from "../../common/log.js";
import util from "../../common/util.js";
export default {
  components: {

  },
  data() {
    return {     
        inviteuser:false,
        friendList: [],
        selectedFriends: [],
        filterFriendKey: "",
    };
  },
  computed: {
   filterFriends: function() {
        if (this.filterFriendKey == "") {
            return this.friendList;
        }
        return this.friendList.filter(item => {
            return (
                item.name.toLowerCase().indexOf(this.filterFriendKey.toLowerCase()) > -1
            );
        });
    }
  },
  watch: {
    
  },
  mounted () {
    
  },
  methods: {
    showInviteUser(showSchool=false) 
    {
        this.filterFriendKey = "";
        this.friendList=[];
        this.selectedFriends = [];

        // if (this.friendList.length > 0) {
        //     this.selectedFriends = [];
        //     this.inviteuser = true;
        //     return;
        // }
        if(showSchool)
        {
            webapi.getSchoolContact(auth.getSchoolID()).then(f => {
                    for (let user of f.RetData) {
                    let showuser = {
                        name: user.UserName,
                        id: user.UserID,
                        face:user.AvatarUrl == ""? "/static/images/defaultface.png": user.AvatarUrl
                        };
                    this.friendList.push(showuser);
                }
                this.inviteuser = true;
            });
        }
        else
        {
            friends.getFriends(f => {
                for (let user of f) {
                    let showuser = {
                        name: user.Name,
                        id: user.UserID,
                        face:user.AvatarUrl == ""? "/static/images/defaultface.png": user.AvatarUrl
                        };
                    this.friendList.push(showuser);
                }
                this.inviteuser = true;
            });
        }
    },
    inviteuserOK() {
        if (this.selectedFriends.length < 1) {
            return;
        }
        this.$emit("onOK",this.selectedFriends);
        this.inviteuser = false;
    },
    inviteuserCancel() {
        this.inviteuser = false;
    },
  }
}
</script>


