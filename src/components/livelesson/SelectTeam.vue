<template>
    <div id="ctl-seletteam" class="ctl-seletteam">
         <Modal
            v-model="switchteam"
            title="Switch team"
            width="790"
            :closable="false"
            :mask-closable="false"
            @on-ok="onOK"
            @on-cancel="onCancel"
            style="z-index:40010;position: absolute; "
            class-name="hideModalFooter"
        >
            <div slot="header" style=" height:32px;">
                <span style="font-size:16px; font-weight:bold;line-height:32px;">Switch team</span>
                <span style="float:right;">
                    <Input v-model="filterTeamKey" placeholder="Search..." style="width: 150px;" icon="search"></Input>
                    <Button type="text" @click="onCancel">{{$t("Base.Cancel")}}</Button>
                </span>
            </div>            
            <div class="team-list">
                <div v-for="item in filterTeams" :key="item.id" class="team-item" :class="item.class" @click="handleSelectTeam(item)">
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
            <div slot="footer" style="display:none;"></div>
        </Modal>
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
        switchteam:false,
        selectedTeamID:0,
        selectedTeamName:"",
        filterTeamKey:"",
        teamList:[],
        currentTeam:null,
    };
  },
  computed: {
    filterTeams: function() {
        if (this.filterTeamKey == "") {
            return this.teamList;
        }
        return this.teamList.filter(item => {
            return (
                item.name.toLowerCase().indexOf(this.filterTeamKey.toLowerCase()) > -1
            );
        });
    }
  },
  watch: {
    
  },
  mounted () {
    
  },
  methods: {
    showSwitchTeam() 
    {
      this.filterTeamKey= "";
      this.switchteam = true;
      this.teamList=[];
        webapi.GetSyncRoomTeamList(auth.getSchoolID()).then(res=>{
        
            for(var team of res)
            {
                let teamitem={id:team.ItemID,name:team.Name,class:"",members:team.MemberCount,documents:team.DocumentCount};
                this.teamList.push(teamitem);
            }
            webapi.getUserSettingFromServer([2003]).then(res=>{
                if(!res) return;
                var defaultTeam="";
                for (var set of res)
                {
                        if (set.SettingID == 2003)
                        {
                            defaultTeam=set.Text;
                        }
                }
                if(defaultTeam!="")
                {                    
                    for(var team of this.teamList)
                    {
                        if(team.id+""==defaultTeam+"")
                        {
                            team.class="current-item";
                            break;
                        }
                    }
                }
            });
        });
    },
    handleSelectTeam(selteam){
        this.currentTeam = selteam;
        var set = new Array();
        var team = new Object();
        team.SettingID = 2003;
        team.Text = selteam.id;
        set.push(team);
        webapi.setUserSettingToServer(set);
        this.onOK();
    },
    onOK() {
        
        this.$emit("onOK",this.currentTeam.id,this.currentTeam.name);
        this.switchteam = false;
    },
    onCancel() {
        this.switchteam = false;
    },
  }
}
</script>


