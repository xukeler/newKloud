<template>
    <div v-show="IsShow" id="ad" class="previewdocument_ad">
        <!-- <div class="previewdocument_aditem" @click="onAdClick($event,247);">
            <div class="previewdocument_aditemtop">
                <img class="previewdocument_adimg" src="https://kloudsync.peertime.cn/static/ad/1.png" />
                <span class="previewdocument_adview"><img src="https://kloudsync.peertime.cn/static/ad/view.png" /></span>
                <span class="previewdocument_adhot"><img src="https://kloudsync.peertime.cn/static/ad/hot.png" />1.2万</span>
            </div>
            <div>
                <span class="previewdocument_adtext">TechExcel给您拜年了!</span>
                <span class="previewdocument_adsync"><img src="https://kloudsync.peertime.cn/static/ad/sync.png" /></span>
            </div>
        </div> -->
        <div class="previewdocument_aditem" @click="onAdClick($event,257);">
            <div class="previewdocument_aditemtop"><img class="previewdocument_adimg" src="https://kloudsync.peertime.cn/static/ad/2.png" />
            <span class="previewdocument_adview"><img src="https://kloudsync.peertime.cn/static/ad/view.png" /></span>
            <span class="previewdocument_adhot"><img src="https://kloudsync.peertime.cn/static/ad/hot.png" />1.5万</span></div>
            <div>
                <span class="previewdocument_adtext">Kloud Sync的专利是怎么发明的</span>
                <span class="previewdocument_adsync"><img src="https://kloudsync.peertime.cn/static/ad/sync.png" /></span>
            </div>
        </div>
        <div class="previewdocument_aditem" @click="onAdClick($event,255);">
            <div class="previewdocument_aditemtop"><img class="previewdocument_adimg" src="https://kloudsync.peertime.cn/static/ad/3.png" />
            <span class="previewdocument_adview"><img src="https://kloudsync.peertime.cn/static/ad/view.png" /></span>
            <span class="previewdocument_adhot"><img src="https://kloudsync.peertime.cn/static/ad/hot.png" />0.8万</span></div>
            <div>
                <span class="previewdocument_adtext">提高团队生产效率</span>
                <span class="previewdocument_adsync"><img src="https://kloudsync.peertime.cn/static/ad/sync.png" /></span>
            </div>
        </div>
        <!-- <div class="previewdocument_aditem" @click="onAdClick($event,258);">
            <div class="previewdocument_aditemtop"><img class="previewdocument_adimg" src="https://kloudsync.peertime.cn/static/ad/4.png" />
            <span class="previewdocument_adview"><img src="https://kloudsync.peertime.cn/static/ad/view.png" /></span>
            <span class="previewdocument_adhot"><img src="https://kloudsync.peertime.cn/static/ad/hot.png" />2.2万</span></div>
            <div>
                <span class="previewdocument_adtext">PeerTime祝您新年快乐!</span>
                <span class="previewdocument_adsync"><img src="https://kloudsync.peertime.cn/static/ad/sync.png" /></span>
            </div>
        </div> -->
        <div class="previewdocument_aditem" @click="onAdClick($event,253);">
            <div class="previewdocument_aditemtop"><img class="previewdocument_adimg" src="https://kloudsync.peertime.cn/static/ad/5.png" />
            <span class="previewdocument_adview"><img src="https://kloudsync.peertime.cn/static/ad/view.png" /></span>
            <span class="previewdocument_adhot"><img src="https://kloudsync.peertime.cn/static/ad/hot.png" />1.3万</span></div>
            <div>
                <span class="previewdocument_adtext">PeerTime教育解决方案</span>
                <span class="previewdocument_adsync"><img src="https://kloudsync.peertime.cn/static/ad/sync.png" /></span>
            </div>
        </div>
        <div class="previewdocument_aditem" @click="onAdClick($event,254);">
            <div class="previewdocument_aditemtop"><img class="previewdocument_adimg" src="https://kloudsync.peertime.cn/static/ad/6.png" />
            <span class="previewdocument_adview"><img src="https://kloudsync.peertime.cn/static/ad/view.png" /></span>
            <span class="previewdocument_adhot"><img src="https://kloudsync.peertime.cn/static/ad/hot.png" />0.9万</span></div>
            <div>
                <span class="previewdocument_adtext">Project One项目管理</span>
                <span class="previewdocument_adsync"><img src="https://kloudsync.peertime.cn/static/ad/sync.png" /></span>
            </div>
        </div>
    </div>   
</template>
<style lang="scss">

  @media screen and (min-width: 500px) 
  {
    .previewdocument_ad
    {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content:center;
        align-content:center;
        overflow: auto;
        padding: 0px 150px 0px 150px;
    }
    .previewdocument_aditem
    {
        width: 49%;
        padding:5px 20px;      
    }
    .previewdocument_aditemtop
    {
        position: relative;
    }
    .previewdocument_adimg
    {
        width: 100%;
        border:0;
    }
    .previewdocument_adtext
    {
        font-size: 12px;
    }
    .previewdocument_adview
    {
        position: absolute;
        bottom: 15px;
        right:15px;
        cursor: pointer;
        width:50px;
        display: none;
    }
    .previewdocument_adview img {
        width:100%;
    }
    .previewdocument_adhot
    {
        position: absolute;
        top: 15px;
        right:15px;
        cursor: pointer;
        color:red;
        display: none;
    }
    .previewdocument_adhot img{
        margin-right: 5px;
    }
    .previewdocument_adsync
    {
        display: none;
    }
    .previewdocument_adsync img
    {
        
    }
  }
  @media screen and (max-width: 500px) 
  {
    .previewdocument_ad
    {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content:center;
        align-content:center;
        overflow: auto;
    }
    .previewdocument_aditem
    {
        width: 32.5%;
        padding:2px 5px;      
    }
    .previewdocument_aditemtop
    {
        position: relative;
    }
    .previewdocument_adimg
    {
        width: 100%;
        border:0;
    }
    .previewdocument_adtext
    {
        font-size: 10px;
    }
    .previewdocument_adview
    {
        position: absolute;
        bottom: 5px;
        right:5px;
        cursor: pointer;
        width:30px;
        display: none;
    }
    .previewdocument_adview img {
        width:100%;
    }
    .previewdocument_adhot
    {
        position: absolute;
        top: 5px;
        right:5px;
        cursor: pointer;
        color:red;
        display: none;
    }
    .previewdocument_adhot img{
        margin-right: 1px;
    }
    .previewdocument_adsync
    {
        display: none;
    }
    .previewdocument_adsync img
    {
        width: 10px;
    }
  }
  
</style>
<script>

export default {
  data: function() {
    return {
        
    };
  },
  props: ["IsShow"],
  components:{
      
  },
  mounted: function() {
    
    
  },
  beforeDestroy: function() {
     
  },
  methods: {
      onAdClick(evt,id){
        //console.log("onAdClick",id);
        //id=614;
        //this.$router.push({ name: "sync", params: { id: id } });
        //location.href="/document/"+id;
        location.replace("/document/"+id);
    },
  },
  watch: {}
};
</script>