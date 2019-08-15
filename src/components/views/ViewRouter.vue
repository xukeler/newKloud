<template>
 <div id="all-views">
   <!--<div style="position: fixed; background: white; width: 100%; z-index: 2">
      <header-bar :currentViewId="currentView" :isTeacher="isTeacher" :isSchool="isSchool"></header-bar>
   </div>
   <div>
      <div style="height: 50px"></div>
      <router-view ref="viewComponent" :key="$route.fullPath"></router-view>
   </div>-->
   <header-bar ref="headerBar" :currentViewId="currentView" :showCourse="showCourse" :showSchool="showSchool" style="/*position: sticky; top: 0; z-index: 911;*/" v-if="isShowHeader"></header-bar>
   <router-view ref="viewComponent" :key="$route.fullPath" v-if="isShow"></router-view>
   <!--<chat-floating-window></chat-floating-window>-->
 </div>
</template>

<style>
  #all-views {
    min-width: 800px;
    position: relative;
  }
</style>

<script>
  import HeaderBar from './HeaderBar.vue';
  //import ChatFloatingWindow from '../chat/ChatFloatingWindow'
  import auth from '../../authenticator';

  export default {
    components: {
      HeaderBar, //ChatFloatingWindow
    },
    provide(){
      return{
        reload:this.reload,
        reloadHeader:this.reloadHeader,
      }
    },
    data: function () {
      return {
        isShowHeader:true,
        isShow:true,
        currentView: 'schedule',
        showCourse: true, //auth.isTeacher(),
        showSchool: true //auth.showSchool(),
      }
    },
    mounted: function () {
      let name = this.$router.currentRoute.name;
      if (name.includes('-')) {
        name = name.substring(0, name.indexOf('-'));
      }
      this.currentView = name.toLowerCase();

      this.$on("viewChanged", function (view) {
        this.currentView = view;
      });
    },
    beforeCreate: function() {
      if (IsKlassroom()) {
        this.$router.push({name: 'klassroom'});
      }else if(IsKloudSync()){
        this.$router.push({name: 'kloudsync'});
      }else if(IsProjectOne()){
        this.$router.push({name: 'projectone'});
      }
    },
    beforeMount:function () {
      if (!auth.getChosenSchoolId())
        auth.setChosenSchoolId(auth.getCustomerID());
    },
    methods: {
      reload(){
        this.isShow=false;
        this.$nextTick(function(){
          this.isShow=true;
        })
      } ,
     reloadHeader(){
        this.isShowHeader=false;
        this.$nextTick(function(){
          this.isShowHeader=true;
        })
      },
      startSearch(search) {
        let startSearchFunc = this.$refs.viewComponent.startSearch;
        if (startSearchFunc)
          startSearchFunc(search);
      },
      endSearch() {
        let endSearchFunc = this.$refs.viewComponent.endSearch;
        if (endSearchFunc)
          endSearchFunc();
      },
      teacherApplied: function () {
        this.showCourse = true;
      },
      teacherCanceled: function () {
        this.showCourse = false;
      },
      schoolApplied: function (type) {
        this.showSchool = true;
      },
      schoolCanceled: function () {
        this.showSchool = false;
      }
    }
  }
</script>
