<template>
  <div id="main-view" v-if="isKlassroom">
    <header-part v-if="isShowBusinessHeader"></header-part>

    <div v-if="flexView && isShowBusinessContent" class="flexviews" :class="showSecondaryHeader ? 'flexviews-twoheader' : 'flexviews-oneheader'">
      <div class="panel-gutter"></div>
      <div class="panel-catalog" v-if="needCatalog" v-show="showCatalog">
        <catalog-part></catalog-part>

        <!-- <div class="close-button" @click="showCatalog = false">
          <Icon type="close-round" size="16" title="close"></Icon>
        </div> -->
      </div>
      <div class="panel-content">
        <router-view ref="routerViewComponent" :key="$route.fullPath"></router-view>
      </div>
      <!-- <div class="panel-detail" v-if="needDetail" v-show="showDetail">
        <detail-part ref="detail"></detail-part>

        <div class="close-button" @click="showDetail = false">
          <Icon type="close-round" size="16" title="close"></Icon>
        </div>
      </div> -->
      <div class="panel-gutter"></div>
    </div>

    <div v-else>
      <router-view ref="routerViewComponent" :key="$route.fullPath" v-if="isShowBusinessContent"></router-view>
    </div>
  </div>
</template>

<style lang="scss">
#main-view {
  min-width: 1000px;
  position: relative;
  background-color: #f5f5f5;
  color: #515a6e;
  height: 100%;
  width: 100%;

  .flexviews {
    background-color: transparent;
    display: -webkit-box;
    display: -moz-box;
    display: box;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    padding-top: 15px;
    padding-bottom: 15px;
    min-height: 200px;
    width: 100%;
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

    .panel-catalog {
      -webkit-box-flex: 0;
      -moz-box-flex: 0;
      box-flex: 0;
      -webkit-flex: 0 0 400px;
      -moz-flex: 0 0 400px;
      -ms-flex: 0 0 400px;
      flex: 0 0 400px;
      -webkit-box-pack: start;
      -moz-box-pack: start;
      box-pack: start;
      -webkit-justify-content: flex-start;
      -moz-justify-content: flex-start;
      -ms-justify-content: flex-start;
      -o-justify-content: flex-start;
      justify-content: flex-start;
      -ms-flex-pack: start;

      margin-right: 15px;

      background-color: #ffffff;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      border-radius: 3px;
      padding: 3px;
      position: relative;
    }

    .panel-content {
      -webkit-box-flex: 5500;
      -moz-box-flex: 5500;
      box-flex: 5500;
      -webkit-flex: 5500 1 500px;
      -moz-flex: 5500 1 500px;
      -ms-flex: 5500 1 500px;
      flex: 5500 1 500px;
      max-width: 1500px;
      min-width: 500px;

      background-color: #ffffff;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      border-radius: 3px;
      padding: 3px;
    }

    .panel-detail {
      -webkit-box-flex: 0;
      -moz-box-flex: 0;
      box-flex: 0;
      -webkit-flex: 0 0 400px;
      -moz-flex: 0 0 400px;
      -ms-flex: 0 0 400px;
      flex: 0 0 400px;

      margin-left: 15px;

      background-color: #ffffff;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      border-radius: 3px;
      padding: 3px;
      position: relative;
    }

    .close-button {
      cursor: pointer;
      position: absolute;
      z-index: 1;
      right: 10px;
      top: 8px;
    }
  }

  .flexviews-oneheader {
    min-height: calc(100% - 50px);
  }
  .flexviews-twoheader {
    min-height: calc(100% - 90px);    
  }

  .ivu-table th {
    background-color: #495060;
    color: white;
  }

  .ivu-table-row-highlight td {
    background-color: #dddee1;
  }
}
</style>

<script>
import auth from "../../authenticator";
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import HeaderPart from "./HeaderPart";
import CatalogPart from "./CatalogPart";
import DetailPart from "./DetailPart";

export default {
  components: {
    HeaderPart,
    CatalogPart,
    DetailPart
  },
  data() {
    return {
      oneHeader: false,
      flexView: true,
      needCatalog: true,
      showCatalog: true,
      needDetail: false,
      showDetail: false,

      isKlassroom:false,
      isShowBusinessHeader: true,
      isShowBusinessContent:true,
    };
  },
  watch: {
    $route(to, from) {
      this.$nextTick(() => {
        this.resetLayout();
      });
    }
  },
  provide(){
    return{
      reload:this.reload,
      reloadHeader:this.reloadHeader,
    }
  },
  beforeCreate: function() {
    //获取记住的机构选择   FieldID：10001代表机构，10002代表Team
    auth.getKLoudsyncMemorizeOrganization(10001).then((res)=>{
      this.reloadBussinessMainview();
    });
    if (!IsKlassroom()) {
      this.$router.push({name: 'schedule'});
    }
  },
  created() {
    this.reloadKlassroomSettings();
  },
  mounted() {
    this.resetLayout();
  },
  computed: {
    ...mapState(["Klassroom", "KlassroomSettings"]),
    
    showSecondaryHeader() {
      let name = this.$route.name;
      return (name == "klassroom-courses" || name == "klassroom-students") && (this.KlassroomSettings.termCount > 0 || this.KlassroomSettings.cohortCount > 0);
    },
  },
  methods: {
    ...mapActions(["getKlassroom", "getKlassroomSettings"]),
    //获取上次已选机构，所需要的在dom加载前，获取已选信息再加载。
    reloadBussinessMainview(){
      this.isKlassroom=false;
      this.$nextTick(function(){
        this.isKlassroom=true;
      })
    },
    resetLayout() {
      let name = this.$route.name;

      this.flexView = name !== "klassroom-schedule";

      this.needCatalog =
        name === "klassroom-courses" ||
        name === "klassroom-students" ||
        name === "klassroom-teachers" ||
        name === "klassroom-customers";

      // this.needDetail =
      //   name === "klassroom-students" || name === "klassroom-teachers";

      this.needDetail = false;
      this.showDetail = false;
    },
    showContactDetail(id) {
      // this.showDetail = true;
      // this.$refs.detail.showContactDetail(id);
    },
    reloadKlassroomSettings() {
      let token = auth.getUserToken();
      let schoolId = auth.getChosenSchoolId();
      this.getKlassroom({token: token, schoolId: schoolId});
      this.getKlassroomSettings({token: token, schoolId: schoolId});
    },
    reload() {
      // this.isShowBusinessContent=false;
      // this.$nextTick(function(){
      //   this.isShowBusinessContent=true;
      // });
      this.Klassroom.currentFolder = -1;
      this.Klassroom.currentCohort = 0;
      this.Klassroom.currentTerm = {id:-1, year:-1};
      this.reloadKlassroomSettings();
      this.reloadBussinessMainview();
    },
    reloadHeader() {
      this.isShowBusinessHeader = false;
      this.$nextTick(function() {
        this.isShowBusinessHeader = true;
      });
    }
  }
};
</script>
