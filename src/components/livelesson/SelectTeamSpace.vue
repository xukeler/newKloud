<template>
    <div id="ctl-seletteamspace" class="ctl-seletteamspace">
        <div style="padding:0px 10px 10px;">
            <div style="display:inline-block;">
                <Icon size="16" style="color:#2d8cf0;" type="person-stalker"></Icon>
                <span style="font-size:16px;font-weight:bold;padding-left:5px;cursor:pointer;color:#2d8cf0;" @click="showSelectTeams">{{shareTo.teamName}}</span>
            </div>
            <div style="display:inline-block;font-weight:bold;font-size:16px;padding:0px 10px;">
                &gt;
            </div>
            <div style="display:inline-block;">
                <Icon type="xbox" size="16" style="color:#2d8cf0;"></Icon>
                <span style="font-size:16px;font-weight:bold;padding-left:5px;cursor:pointer;color:#2d8cf0;"  @click="showSelectSpaces">{{shareTo.spaceName}}</span>
            </div>
            <div style="display:inline-block;float:right;color:#2d8cf0;cursor:pointer;display:none;" @click="switchTeam">
                <Icon size="16" type="arrow-swap"></Icon><span style="font-size:16px;padding-left:10px;">Switch team</span>
            </div>
        </div>
        <div class="team-list" id="div_selectteam" style="display:none;min-height:160px;">
            <div v-for="item in shareTo.selectTeamList" :key="item.id" class="team-item" :class="item.class" @click="handleSelectTeam(item)">
            <div class="team-name">
                <span><Icon type="ios-people" size="24"></Icon></span>
                <span style="margin-left: 10px;">{{item.name}}</span>
            </div>

            <div class="team-info">
                <div>{{item.members}} Members</div>
                <div>{{item.documents}} Documents</div>
            </div>
            </div>
        </div>
        <div id="div_selectspace" style="display:none;min-height:160px;">
            <div v-for="item in shareTo.selectSpaceList" @click="handleSelectSpace(item)" :id="'room_'+item.id" :key="item.id" class="roomlist_item">
                <div :style="'background-color:'+item.color"  class="roomlist_title_container">
                    <span style="color:white;font-size:22px;">{{item.title}}</span>
                </div>
                <div class="roomlist_name_container">
                    <span class="roomlist_name">{{ item.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.team-list {
    display: flex;
    align-items:stretch;
    justify-content:flex-start;
    flex-wrap: wrap;
    min-width: 250px;

    .team-item {
    width: 210px;
    //height: 150px;
    margin: 5px;
    padding: 5px;
    border: 2px solid #dddee1;
    border-radius: 5px;
    cursor: pointer;
    white-space: normal;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .team-name {
        display: flex;
        align-items:center;
        justify-content:flex-start;
        padding: 5px;
        font-size: 14px;
    }

    .team-info {
        margin-top: 20px;
        color: #80848f;
        padding: 5px;
    }
    }
    
    .current-item {
    border-color: #2d8cf0;
    }
    .topic-current {
      background-color: #dddee1;
    }
}
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
    };
  },
  computed: {
   
  },
  watch: {
    
  },
  mounted () {
    
  },
  methods: {
    showSelectTeams(){
        if($("#div_selectteam").is(":visible"))
        {
            if(this.shareTo.shareToNewSyncRoom)
            {
                $("#div_shareToNewSyncRoom").show();
            }
            else
            {
                $("#div_roomlist").show();
            }
            $("#div_selectteam").hide();
        }
        else
        {
            $("#div_selectspace").hide();
            if(this.shareTo.shareToNewSyncRoom)
            {
                $("#div_shareToNewSyncRoom").hide();
            }
            else
            {
                $("#div_roomlist").hide();
            }
            
            $("#div_selectteam").show();
            this.initSelectTeamList();
        }
    },
    showSelectSpaces(){
        if($("#div_selectspace").is(":visible"))
        {
            if(this.shareTo.shareToNewSyncRoom)
            {
                $("#div_shareToNewSyncRoom").show();
            }
            else
            {
                $("#div_roomlist").show();
            }
            $("#div_selectspace").hide();
        }
        else
        {            
            $("#div_selectteam").hide();
            if(this.shareTo.shareToNewSyncRoom)
            {
                $("#div_shareToNewSyncRoom").hide();
            }
            else
            {
                $("#div_roomlist").hide();
            }
            $("#div_selectspace").show();
            this.initSelectSpaceList((len)=>{
                if(len==0)
                {
                    this.$Message.error({content: '当前团队没有空间!',duration: 0,closable: true});
                    setTimeout(()=>{
                        this.showSelectSpaces();
                    },1000);
                }
            });
        }
    },
    initSelectTeamList() 
    {
      this.filterTeamKey= "";
      this.switchteam = true;
      this.shareTo.selectTeamList=[];
        webapi.GetSpaceTeamList(auth.getSchoolID()).then(res=>{
        
            for(var team of res)
            {
                let teamitem={id:team.ItemID,name:team.Name,class:"",members:team.MemberCount,documents:team.DocumentCount};
                if(this.shareTo.teamID==team.ItemID)
                {
                    teamitem.class="current-item";
                }
                this.shareTo.selectTeamList.push(teamitem);
            }
        });
    },
    initSelectSpaceList(callback) 
    {
      this.shareTo.selectSpaceList=[];
        webapi.GetSpaceList(auth.getSchoolID(),this.shareTo.teamID).then(res=>{
            if(res)
            {
                for(var team of res)
                {
                    let teamitem={id:team.ItemID,name:team.Name,title:this.getShortName(team.Name),color:this.randomColor()};
                    if(this.shareTo.teamID==team.ItemID)
                    {
                        teamitem.class="current-item";
                    }
                    this.shareTo.selectSpaceList.push(teamitem);
                }
                if(callback)callback(res.length);
            }
            else
            {
                if(callback)callback(0);
            }
        });
    },
    handleSelectTeam(selteam){
        //console.log(selteam);
        this.shareTo.teamID=selteam.id;
        this.shareTo.teamName=selteam.name;
        this.shareTo.spaceID=0;
        this.shareTo.spaceName="请选择空间";
        if(this.shareTo.shareToNewSyncRoom)
        {
            $("#div_shareToNewSyncRoom").show();
        }
        else
        {
            $("#div_roomlist").show();
        }
        $("#div_selectteam").hide();
        //this.initSyncRoomList();
        this.showSelectSpaces();

        // var set = new Array();
        // var team = new Object();
        // team.SettingID = 2003;
        // team.Text = selteam.id;
        // set.push(team);
        // webapi.setUserSettingToServer(set);
    },
    handleSelectSpace(selspace){
        this.shareTo.spaceID=selspace.id;
        this.shareTo.spaceName=selspace.name;
        if(this.shareTo.shareToNewSyncRoom)
        {
            $("#div_shareToNewSyncRoom").show();
        }
        else
        {
            $("#div_roomlist").show();
        }
        $("#div_selectspace").hide();
        this.initSyncRoomList();

        // var set = new Array();
        // var team = new Object();
        // team.SettingID = 2002;
        // team.Text = selspace.id;
        // set.push(team);
        // webapi.setUserSettingToServer(set);
    },
    onOK() {
        
        this.$emit("onOK");
    },
    onCancel() {
    },
  }
}
</script>


