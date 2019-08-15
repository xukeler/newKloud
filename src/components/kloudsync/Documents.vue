<template>
<div class="documents-flexviews">
  <!-- <div class="panel-gutter"></div> -->
  <doc-left-part ref="leftPart" @on-select="handleCatalogSelect"></doc-left-part>
  <div class="panel-content">
    <div class="space">
      <!--<span>{{catalog.type}}</span>
      <br>-->
      <span class="space-name">{{catalog.name}}</span>
      <span class="space-time">{{$t('KloudSyncDocuments.FoundedIn')}}{{catalog.created}}</span>
      <Button style="float:right; margin-right: 2em;" type="primary" icon="plus-round" @click="showUploadModal"><span style="color:white;">{{$t('KloudSyncDocuments.NewDocument')}}</span></Button>
      <!-- <div class="space-more" @click="showDetail = true"><Icon type="more" size="24"></Icon></div> -->
    </div>
    <div class="space-file-cover">
      <div style="padding:24px; background-color: #ffffff; width:100%">
        <file-list :can-upload="uploadFlag" :school-id="schoolId" :team-id="teamId" :spaceID="spaceID" :teamNameOrspaceName="teamNameOrspaceName" ref="kloudSyncFileList" ></file-list>
      </div>
    </div>
    <div class="catalog-cover" v-show="showDetail" @click="showDetail = false">
      <div class="catalog-info" @click="handleCatalogInfoClick">
        <div class="close-button" @click="showDetail = false">
          <Icon type="close-round" size="16" title="close"></Icon>
        </div>
        <catalog-info ref="catalogInfo" @on-changed="handleCatalogChanged"></catalog-info>
      </div>
    </div>
  </div>
  <!-- <div class="panel-gutter"></div> -->
</div>
</template>

<style lang="scss">
.documents-flexviews{
  background-color: transparent;
  display: -webkit-box;
  display: -moz-box;
  display: box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flexbox;
  display: flex;
  //padding-top: 15px;
  //padding-bottom: 15px;
  min-height: 200px;
  width: 100%;
  min-height: calc(100% - 68px);
  align-items: stretch;

  .panel-gutter {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    box-flex: 1;
    -webkit-flex: 1 0 15px;
    -moz-flex: 1 0 15px;
    -ms-flex: 1 0 15px;
    flex: 1 0 15px;
  }

  .panel-content {
    -webkit-box-flex: 5500;
    -moz-box-flex: 5500;
    box-flex: 5500;
    -webkit-flex: 5500 1 500px;
    -moz-flex: 5500 1 500px;
    -ms-flex: 5500 1 500px;
    flex: 5500 1 500px;
    //max-width: 1500px;
    min-width: 500px;

    background-color: white;
    //box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    //border-radius: 3px;
    position: relative;
    
    .space{
      width: 100%;
      text-align: left;
      padding: 20px;
      position: relative;
      border-bottom: 1px solid #dddee1;

      span{
        font-size: 13px;
        display: inline-block;
        color: #bdc5b8;
      }
      .space-name{
        font-weight: bold;
        font-size: 16px;
        color:black;
      }
      .space-time{
        margin-left: 10px;
      }

      .space-more {
        position:absolute;
        right: 40px;
        bottom: -8px;
        height: 40px;
        width: 40px;
        border-radius: 50%;
        z-index: 1;
        padding: 8px;
        text-align: center;
        border: 1px solid #dddee1;
        background-color: white;
        cursor: pointer;
      }
    }

    .space-file-cover {
      padding:24px; 
      background-color: #FBFBFD; 
      //min-height: 200px;
      min-height: calc(100% - 65px); 
      width:100%;
      display: flex;
      align-items: stretch;
    }

    .catalog-cover {
      position: absolute;
      z-index: 9;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: transparent;

      .catalog-info {
        position: absolute;
        z-index: 10;
        right: 0;
        top: 0;
        width:400px;
        height: 100%;
        border-left: 2px solid #dddee1;
        background: white;
        padding: 24px;

        .close-button {
          cursor: pointer;
          position: absolute;
          z-index: 1;
          right: 16px;
          top: 16px;
        }
      }
    }
  }
}
</style>

<script>
import auth from "../../authenticator";
import FileList from "../kloudsync/FileList.vue";
import DocLeftPart from "./DocLeftPart.vue";
import CatalogInfo from "./CatalogInfo.vue";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
  name:'kloudsync-documents',
  components:{
    FileList,
    DocLeftPart,
    CatalogInfo
  },
  data() {
    return {
      spaceID:0,
      catalog: {type: 'Unknown', name: '', created: new Date()},
      currentTeam: null,
      currentSpace: null,
      uploadFlag:false,
      showDetail: false,
      teamNameOrspaceName:{
        teamName:"",
        spaceName:"",
      },
    };
  },
  activated () {
  },
  deactivated() {
  },
  // beforeRouteEnter (to, from, next) {
  //   next(vm=>{
  //      vm.changeShowcacheComponentList(['kloudsync-documents']);
  //   });
  // },
  // beforeRouteLeave(to, from, next){
  //   if(to && to.name && to.name==="docview"){
  //     this.changeShowcacheComponentList(['kloudsync-documents']);
  //   }else{
  //     this.changeShowcacheComponentList([]);
  //   }
  //   next();
  // },
  computed: {
    schoolId() {
      return auth.getChosenSchoolId();
    },
    teamId(){
      return this.currentTeam==null?-1:this.currentTeam.id;
    }
  },
  mounted() {
  },
  methods: {
    refresh() {
      this.$refs.leftPart.loadTeamList();
    },
    refreshFilegList(){
      this.$nextTick(()=>{
        if(this.$refs.kloudSyncFileList){
          this.$refs.kloudSyncFileList.initialize();
        }
      })
    },
    handleCatalogSelect(params) {
      this.currentTeam = params.team;
      this.currentSpace = params.space;
      this.uploadFlag = params.canUpload;
      this.spaceID = params.space.id;

      this.teamNameOrspaceName.teamName=params.team.name;
      this.teamNameOrspaceName.spaceName=params.space.name;
 
      this._resetCatalog();   
      this.$refs.catalogInfo.setCatalog(this.currentTeam, this.currentSpace);   
    },
    _resetCatalog() {
      if (this.currentSpace && this.currentSpace.id > 0) {
        this.catalog = {
          type: 'Space',
          name: this.currentSpace.name,
          created: new Date(parseInt(this.currentSpace.createdDate)).toString()
        };
      }
      else if (this.currentTeam){
        this.catalog = {
          type: 'Team',
          name: this.currentTeam.name,
          created: new Date(parseInt(this.currentTeam.createdDate)).toString()
        };
      }
      else {
        this.catalog = {
          type: 'Unknown',
          name: '',
          created: new Date().toString()
        };
      }
    },
    handleCatalogInfoClick(e) {
      e.stopPropagation();
    },
    handleCatalogChanged(arg) {
      this.catalog.name = arg.name;
      this.$refs.leftPart.updateCurrentName(arg.id, arg.name);
    },
    showUploadModal() {
      this.$refs.kloudSyncFileList.showUploadModal();
    },
    ...mapMutations(["changeShowcacheComponentList"])
  }
}
</script>
