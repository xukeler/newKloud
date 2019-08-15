<template>
    <div class="upload-file-tag-filter">
      <div class="select-tag-input" ref="dropdownSelected">
        <Dropdown :trigger="dropdownType" style="width:100%;">
          <div class="input-space">
            <span v-show="!seletedTagArray" class="input-placeholder">{{$t('UploadFileSelectTags.AddTags')}}</span>
            <div id="uploadChooseContent" class="choose-content" v-show="seletedTagArray" >
              <div :style="{backgroundColor:colorSelectNumber(item.ColorID)}" class="tags-item" style="margin-left:15px;" v-for="(item,itemIndex) in selectedModel" :key="itemIndex">
                <div class="left-triangle" :style="{borderRightColor:colorSelectNumber(item.ColorID)}"></div>
                <p>{{item.TagName}}</p>
              </div>
            </div>
            <div class="arrow-down-icon">
              <span class="tagEllipsis" v-show="tagEllipsisFlag">...</span>
            </div>
          </div>
          <DropdownMenu slot="list">
            <ul class="dropdown">
              <li>
                <span>{{$t('UploadFileSelectTags.Tags')}}({{tagsLength}})</span>
                <span style="float:right;padding:2px;text-decoration:underline" @mousedown.stop="manageTags()"><a>{{$t('UploadFileSelectTags.Manage')}}</a></span>
              </li>
              <div class="dropdown-content">
                <li v-for="(item,index) in tagsList" :key="index" @click="checkTagBox(item,$event)">
                  <div class="tags-item" :style="{backgroundColor:colorSelectNumber(item.ColorID)}">
                    <div class="left-triangle" :style="{borderRightColor:colorSelectNumber(item.ColorID)}"></div>
                    <p>{{ item.TagName }}</p>
                  </div>
                  <div class="selected-this-tag">
                    <Icon type="ios-checkmark-empty" style="color:rgba(45,140,240,.9)" size="24"></Icon>
                  </div>
                </li>
              </div>
            </ul>
          </DropdownMenu>
        </Dropdown>
      </div>
      <manage-tags :showAddTagsflagParent="showAddTagsflag" ref="manageTagInit"></manage-tags>
    </div>
</template>

<style lang="scss">
  .upload-file-tag-filter{
    display: inline-block;
    font-size: 13px;
    color: #1c2438;
    font-weight: bold;
    .ivu-select-dropdown{
      width: 260px;
      left:0px !important;
    }
    .select-tag-input:hover{
        border: 1px solid #53a9ff;
    }
    .select-tag-input{
      position: relative;
      display: inline-block;
      width: 468px;
      height: 32px;
      border: 1px solid #ddd;
      border-radius: 5px;
      vertical-align: middle;
      color: #495060;
      font-size: 14px;
      line-height: normal;
      .arrow-down-icon{
        position: absolute;
        right:-5px;
        top: 10px;
        .tagEllipsis{
          font-size: 20px;
          font-weight: bold;
          position: absolute;
          right:15px;
          top: -10px;
        }
      }
      .input-space{
        display: flex;
        align-items:center;
        position: relative;
        font-size: 12px;
        padding-right:30px;
        height: 30px;
        cursor: pointer;
        .choose-content{
          display: flex;
          align-items:center;
          max-width: 430px;
          height: 30px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        span{
          display:inline-block;
        }
        .input-placeholder{
           display:inline-block;
           opacity: 0.4;
           margin-left:8px
        }
      }
      .dropdown{
        width: 260px;
        .dropdown-content{
          width: 258px;
          max-height: 172px;
          overflow: auto;
          background-color: #fff;
          .selected-this-tag{
            float:right;
            display: none;
          }
        }
        li{
            margin: 0;
            line-height: normal;
            padding: 7px 16px 7px 20px;
            clear: both;
            color: #495060;
            font-size: 12px!important;
            white-space: nowrap;
            list-style: none;
            cursor: pointer;
            -webkit-transition: all .2s ease-in-out;
            transition: all .2s ease-in-out;
        }
      }
    }
    .tags-item{
      display: inline-block;
      position: relative;
      padding: 0px 5px;
      height: 18px;
      line-height: 18px;
      font-size: 12px;
      text-align: left;
      word-break: break-all;
      background-color: #ff0000;
      border-radius: 0px 4px 4px 0px;
      color: #ffffff;
      .left-triangle {
        content: "";
        position: absolute;
        top: 0px;
        right: 100%;
        border-top: 9px solid transparent;
        border-bottom: 9px solid transparent;
        border-right:9px solid #ff0000;
      }
    }
  }
</style>

<script>
import auth from "../../authenticator";
import ManageTags from './ManageTags.vue';
export default {
  components: {
    ManageTags
  },
  data() {
    return {
      dropdownType:'click',
      showAddTagsflag:false,
      tagEllipsisFlag:false,
      selectedModel:[],
      tagsLength:0,
      tagsList: [],
    }
  },
  computed: {
    seletedTagArray(){
      if(this.selectedModel.length==0){
        return false;
      }
      return true;
    },
  },
  mounted() {
  },
  methods: {
    uploadFileWithTag(){
      this.selectedModel=[];
      $("div.selected-this-tag").css("display","none");//隐藏所有勾选
      this.tagEllipsisFlag = false;
      this.$emit("uploadSelectTags",this.selectedModel);
    },
    //颜色枚举
    colorSelectNumber(id){
      switch (id) {
        case 1:
          return '#d93651';
        case 2:
          return '#ff9f1b';
        case 3:
          return '#ffd500';
        case 4:
          return '#8acc47';
        case 5:
          return '#47cc8a';  
        case 6:
          return '#30bfbf';  
        case 7:
          return '#00aaff';  
        case 8:
          return '#8f7ee6';  
        case 9:
          return '#98aab3';  
        default:
          return;
      }
    },
    initial() {
      this.dropdownType='click';
      this.refreshTagList();
    },
    refreshTagList(){
      let url=GetAPIUrl()+"Tag/List";
      let self = this;
      this._getData(url,null,(result)=>{
        self.tagsList=result;
        self.tagsLength=self.tagsList.length;
        
        self.$nextTick(()=>{
         self.afterManageDeletOrReplace();
        })
      },null)
    },
    afterManageDeletOrReplace(){
      let self = this;

      if(self.selectedModel.length == 0){
        return;
      }
      
      self.selectedModel.forEach((item,index)=>{
        let flag = false;
        let replaceItem = {};
        for(let i of self.tagsList){
          if(item.TagID == i.TagID){
            flag = true;
            replaceItem = i;
          }
        }
        if(flag == false){
          self.selectedModel.splice(index,1);
        }else{
          self.selectedModel.splice(index,1,replaceItem);
        }
      });

      self.$nextTick(()=>{
         self.tagEllipsisFlag = self.isShowtagEllipsis();
         self.$emit("uploadSelectTags",self.selectedModel);
      })
    },
    manageTags(){
      this.showAddTagsflag=true;
      this.dropdownType="custom";
      this.$nextTick(()=>{
        this.$refs.manageTagInit.initial();
      })
    },
    //是否显示省略号
    isShowtagEllipsis(){
      let width=parseInt($("#uploadChooseContent").css("width"));
      if(width>=430){
        return true;
      }
      return false;
    },
    checkTagBox(item,event){
      //切换勾选
      let taget=event.currentTarget;
      if($(taget).children(".selected-this-tag").css("display")=="none"){
        $(taget).children(".selected-this-tag").css("display","block");
        this.selectedModel.push(item);
      }else{
        $(taget).children(".selected-this-tag").css("display","none");
        for(let i=0;i<this.selectedModel.length;i++){
          if(this.selectedModel[i].TagID==item.TagID){
            this.selectedModel.splice(i,1);
            break;
          }
        }
      }
      this.$nextTick(()=>{
         this.tagEllipsisFlag=this.isShowtagEllipsis();
         this.$emit("uploadSelectTags",this.selectedModel);
      })
    },
    _getData(url, before, success, error) {
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
            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            if (error && typeof error === "function") {
              error(result);
            }
            console.log(result);
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          if (error && typeof error === "function") {
            error();
          }
          console.log(xhr);
        }
      });
    },
    _postData(url, data, before, success, error) {
      if (before && typeof before === "function") {
        before();
      }
      this.$Loading.start();
      let self = this;
      $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        data: JSON.stringify(data),
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(resultString) {
          let result = JSON.parse(resultString);
          if (result.RetCode === 0) {
            self.$Loading.finish();
            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
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
  },
};
</script>
