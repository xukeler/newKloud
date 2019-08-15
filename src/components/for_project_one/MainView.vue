<template>
  <div id="forProject-main-view" v-if="isProjectOne">
    <header-part v-if="isShowKloudsyncHeader"></header-part>
    <!-- <keep-alive :include="showcacheComponentList" v-if="isShowKloudsyncContent"> -->
      <router-view ref="kloudsyncRouterViewComponent" :key="$route.fullPath" v-if="isShowKloudsyncContent"></router-view>
    <!-- </keep-alive> -->
  </div>
</template>

<style lang="scss">
#forProject-main-view {
  min-width: 1000px;
  position: relative;
  background-color: #f5f5f5;
  color: #515a6e;
  height: 100%;
  width: 100%;
}
</style>

<script>
import auth from "../../authenticator";
import HeaderPart from "./HeaderPart";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import util from "../../common/util.js";
export default {
  name:'kloudsync',
  components: {
    HeaderPart
  },
  provide() {
    return {
      reload: this.reload,
      reloadHeader: this.reloadHeader,
    };
  },
  data() {
    return {
      isShowKloudsyncHeader: true,
      isShowKloudsyncContent:true,
      isProjectOne:false,
    };
  },
  beforeCreate: function() {
    //获取记住的机构选择   FieldID：10001代表机构，10002代表Team
    auth.getKLoudsyncMemorizeOrganization(10001).then((res)=>{
      this.reloadKloudSyncMainview();
    });
    if (!IsProjectOne()) {
      this.$router.push({ name: "schedule" });
    }
  },
  created() {
  },
  computed: {
    ...mapState(["Connected","showcacheComponentList"])
  },
  mounted() {},
  methods: {
    //获取上次已选机构，所需要的在dom加载前，获取已选信息再加载。
    reloadKloudSyncMainview(){
      this.isProjectOne=false;
      this.$nextTick(function(){
        this.isProjectOne=true;
      })
    },
    reloadHeader() {
      this.isShowKloudsyncHeader = false;
      this.$nextTick(function() {
        this.isShowKloudsyncHeader = true;
      });
    },
    reload(){
      this.isShowKloudsyncContent=false;
      this.$nextTick(function(){
        this.isShowKloudsyncContent=true;
      })
    } ,
  },
  
};
</script>
