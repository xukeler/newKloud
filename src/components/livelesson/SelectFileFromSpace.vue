<template>
    <div id="ctl-seletfilefromspace">
       <Modal
        v-model="selectSpace"
        title="Select document"
        width="800"
        :closable="false"
        :mask-closable="false"
        @on-ok="selectSpaceOK"
        @on-cancel="selectSpaceCancel"
        style="z-index:40000;position: absolute;"
        class-name="hideModalFooter"
    >
        <div slot="header" style=" height:30px;">
            <span
                style="font-size:16px; font-weight:bold;"
            >{{$t("Live.UploadFromSpace")}}</span>
            <span style="float:right;">
                <Button type="primary" @click="selectSpaceOK">{{$t("Base.OK")}}</Button>
                <Button type="text" @click="selectSpaceCancel">{{$t("Base.Cancel")}}</Button>
            </span>
        </div>
        <div style="padding: 0px 0px 10px;">
                <Select v-model="selectSpace_Team" style="width:160px" placeholder="请选择团队" @on-change="onSelectSpace_TeamChange($event);">
                <Option v-for="item in selectSpace_TeamList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
            <Select v-model="selectSpace_Space" style="width:160px" placeholder="请选择空间" @on-change="onSelectSpace_SpaceChange($event);">
                <Option v-for="item in selectSpace_SpaceList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
            <span>
                 <Input v-model="searchKey" :placeholder="$t('Base.Search')" style="width: 100px;"></Input>
            </span>
            <span>
                 <Button type="primary" icon="ios-search" @click="onSearch" >{{$t("Base.Search")}}</Button>
            </span>
            <div style="float:right; padding:0px 0px 5px;display:inline-block;"><Page :total="total" :current="currentPage" :page-size="15" size="small" @on-change="onChangePageIndex"></Page></div>
        </div>
        <div style="clear:both;"></div>
        <Row style="background:rgba(0,153,229,.7); height:30px;" type="flex" align="middle">
            <Col span="2">&nbsp;</Col>
            <Col span="9">{{$t("Base.Title")}}</Col>
            <Col span="9">{{$t("Base.Name")}}</Col>
            <Col span="4">{{$t("Base.Date")}}</Col>
        </Row>
        <div id="spaceAttachmentList" style="height:300px; overflow:auto;">
            <div class="favList" :key="item.id" v-for="item in spaceAttachmentList">
                <Row style="min-height:26px;" type="flex" align="middle">
                    <Col span="2">
                        <input
                            type="checkbox"
                            :value="item.id"
                            @click="onSelectedSpaceAttachmentClick($event);"
                        >
                    </Col>
                    <Col span="9">{{item.title}}</Col>
                    <Col span="9">{{item.filename}}</Col>
                    <Col span="4">{{item.date}}</Col>
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
import webapi from "../../webapi/webapi.js";
import loger from "../../common/log.js";
import util from "../../common/util.js";
export default {
  components: {

  },
  data() {
    return {     
        selectSpace:false,
        spaceAttachmentList:[],
        selectedSpaceAttachment: [],
        selectSpace_Space:null,
        selectSpace_Team:null,
        selectSpace_SpaceList:[],
        selectSpace_TeamList:[],
        total:1,
        currentPage:1,
        lastSpace:0,
        searchKey:"",
    };
  },
  computed: {
   
  },
  watch: {
    
  },
  mounted () {
    
  },
  methods: {
    ShowSpaceFiles(){
      this.searchKey="";
      this.selectedSpaceAttachment=[];
      this.selectSpace=true;
      this.currentPage=1;
      this.initSelectSpaceAttachment(); 
    },
    onSelectedSpaceAttachmentClick(evt){
        //selectedSpaceAttachment
        var tar = evt.currentTarget;
        if (tar.checked) {
            this.selectedSpaceAttachment.push($(tar).val());
        } else {
            var nindex = FindStrInArr(this.selectedSpaceAttachment, $(tar).val());
            if (nindex > -1) {
                this.selectedSpaceAttachment.splice(nindex, 1);
            }
        }
    },
    initSelectSpaceAttachment(){
        this.selectSpace_TeamList=[];
        webapi.GetSpaceTeamList(auth.getSchoolID()).then(res=>{
            
            for(var team of res)
            {
                let teamitem={id:team.ItemID,name:team.Name};
                this.selectSpace_TeamList.push(teamitem);
            }
            webapi.getUserSettingFromServer([2001,2002]).then(res=>{
                if(!res) return;
                var defaultTeam="";
                var defaultSpace="";
                for (var set of res)
                {
                        if (set.SettingID == 2001)
                        {
                            defaultTeam=set.Text;
                        }
                        else if (set.SettingID == 2002)
                        {
                            defaultSpace=set.Text;
                        }
                }
                if(defaultTeam!="")
                {
                    var hasDefaultTeam=false;                        
                    for(var team of this.selectSpace_TeamList)
                    {
                        if(team.id+""==defaultTeam+"")
                        {
                            this.selectSpace_Team=team.id;
                            hasDefaultTeam=true;
                            break;
                        }
                    }
                    if(hasDefaultTeam)
                    {
                        this.onSelectSpace_TeamChange(defaultTeam,()=>{
                            if(defaultSpace!="")
                            {
                                for(var space of this.selectSpace_SpaceList)
                                {
                                    if(space.id+""==defaultSpace+"")
                                    {
                                        this.selectSpace_Space=space.id;
                                        this.onSelectSpace_SpaceChange(space.id);
                                        break;
                                    }
                                }
                            }
                        })
                    }
                }
            });
        });
    },
    onSelectSpace_TeamChange(val,callback){
        this.selectSpace_SpaceList=[];
        this.selectSpace_Space=null;
        webapi.GetSpaceList(auth.getSchoolID(),val).then(res=>{
           if(res)
           {
              for(var team of res)
              {
                  let teamitem={id:team.ItemID,name:team.Name};
                  this.selectSpace_SpaceList.push(teamitem);
              }
           }
            if(callback) callback();
            else
            {
                var set = new Array();
                var team = new Object();
                team.SettingID = 2001;
                team.Text = val;
                set.push(team);
                webapi.setUserSettingToServer(set)
            }
        });
    },
    onSelectSpace_SpaceChange(val,callback){
        this.spaceAttachmentList=[];
        if(!val) return;
        this.lastSpace=val;
        this.showSpaceAttments(val,0,()=>{
            if(callback) callback();
            else
            {
                var set = new Array();
                var team = new Object();
                team.SettingID = 2002;
                team.Text = val;
                set.push(team);
                webapi.setUserSettingToServer(set)
            }
        });
    },
    onSearch(){
        if(this.lastSpace)
        {
          this.showSpaceAttments(this.lastSpace,0);
        }
    },
    showSpaceAttments(space,page=0,callback){
      this.spaceAttachmentList=[];
      webapi.GetSpaceAttachmentList(space,page,15,this.searchKey).then(res=>{
          if(res)
          {
            this.total=res.TotalCount;
            for(var item of res.DocumentList)
            {
                var ct = new Date();
                ct.setTime(item.CreatedDate);
                let showCT = ct.Format("yyyy-MM-dd hh:mm:ss");
                let obj= {
                    id: item.ItemID,
                    atid: item.AttachmentID,
                    title: item.Title,
                    filename: item.Title,
                    date: showCT,
                    checked: false
                };
                this.spaceAttachmentList.push(obj);
            }
          }
          if(callback) callback();
      });
    },
    onChangePageIndex(page){
        console.log("page:"+page);
        if(this.lastSpace)
        {
          this.showSpaceAttments(this.lastSpace,page-1);
        }
    },
    selectSpaceOK(){
        if (this.selectedSpaceAttachment.length < 1) {
            return;
        }
        this.selectSpace=false;
        this.$emit("onOK",this.selectedSpaceAttachment);
    },
    selectSpaceCancel(){
        this.selectSpace = false;
    },
  }
}
</script>


