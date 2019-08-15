<template>
    <div>
      <Modal :title="$t('ManageTags.ManageTag')"
            v-model="showAddTagsflag"
            okText="Ok"
            cancelText="Cancel"
            @on-cancel="closeManageTag"
            :mask-closable="false" width="600"
            :transfer="true"
            style="z-index: 1000; position: absolute;">
            <div style="width:100%;font-size: 15px;">
              <span style="display: inline-block;float:left;">{{numberOfTags}}</span>
              <span style="display: inline-block;float:right" @click.stop="addTags()">
                <Button type="ghost" icon="plus-round">{{$t('ManageTags.AddTag')}}</Button>
              </span>
            </div>
            <div style="width:100%;height:20px;clear:both"></div>
            <div class="addTag-content" v-show="tagsListLength">
                <Row v-for="(item,tagIndex) in tagsList" :key="tagIndex" class="addTag-content-row" @click.native="inputChangeInfo(item.TagID)">
                  <Col span="2" style="padding-left:20px;">
                    <div class="tags-item" :style="{backgroundColor:colorSelectNumber(item.ColorID)}">
                      <div class="left-triangle" :style="{borderRightColor:colorSelectNumber(item.ColorID)}"></div>
                    </div>
                  </Col>
                  <Col span="13" class="input-info">
                    <input class="edit-input"  v-focus="changeInput==item.TagID" v-if="changeInput==item.TagID" :value="item.TagName" style="width: 100%;" @blur.stop="saveEditTag(item,$event)"/>
                    <div v-else style="float:left;width: 100%;">{{item.TagName}}</div>
                  </Col>
                  <Col span="7" class="tag-color-space">
                    <div class="tag-color">
                      <span class="color-item" v-for="(colorItem,index) in colorList" @click.stop="selectTagColor(item,colorItem.id)" :key="index">
                          <i :style="{background:colorItem.color}"></i>
                      </span>
                    </div>
                  </Col>
                  <Col span="2" class="delete-tag">
                      <div style="padding-left:5px;"><Icon @click.stop="deleteTagModal(item)" type="trash-a" size="16" style="color:red"></Icon></div>
                  </Col>
                </Row>
            </div>
            <div class="noData" v-show="!tagsListLength">{{$t('ManageTags.NoData')}}</div>
            <div slot="footer" style="display:none">
            </div>
      </Modal>
      <Modal
        v-model="showDeleteTagFlag"
        :title="$t('ManageTags.DeleteTag')"
        okText="Ok"
        cancelText="Cancel"
        :styles="{top: '200px'}"
        :mask-closable="false" width="500"
        :transfer="true"
        style="z-index: 1005; position: absolute;">
         <div class="deleteTag-content">
          <p style="width:200px;padding-left:50px;">
            <span class="tags-item" :style="{backgroundColor:colorSelectNumber(TagItem.ColorID)}">
              <div class="left-triangle" :style="{borderRightColor:colorSelectNumber(TagItem.ColorID)}"></div>
            </span>
            <span style="margin-left:10px;font-size: 12px;">{{TagItem.TagName}}</span>
          </p>
          <p style="margin-top:10px;font-size: 14px;font-weight:100;">{{$t('ManageTags.DeleteTagContent')}}</p>
          <p style="margin-top:30px;width:200px"><Button @click="replaceTag" type="ghost" long>{{$t('ManageTags.ReplaceWithOtherTag')}}</Button></p>
          <p style="margin-top:10px;width:200px;"><Button @click="deleteNow" type="primary" long>{{$t('ManageTags.DeleteNow')}}</Button></p>
        </div>
         <div slot="footer" style="display:none">
         </div>
     </Modal>
     <Modal
        v-model="showRplaceTagFlag"
        :title="$t('ManageTags.ReplaceWithTags')"
        :okText="$t('Base.OK')"
        @on-ok="RplaceTagOk"
        :cancelText="$t('Base.Cancel')"
        :styles="{top: '210px'}"
        :mask-closable="false" width="500"
        :transfer="true"
        style="z-index: 1010; position: absolute;"
        >
        <div class="replaceTag-content">
          <div class="replaceTag-content-for" v-for="(item,index) in tagsList" :key="index" @click="replacecheckTagBox(item)">
            <div class="tags-item" :style="{backgroundColor:colorSelectNumber(item.ColorID)}">
              <div class="left-triangle" :style="{borderRightColor:colorSelectNumber(item.ColorID)}"></div>
              <span>{{ item.TagName }}</span>
            </div>
            <div class="selected-this-tag" v-show="replaceTagItem.TagID==item.TagID">
              <Icon type="ios-checkmark-empty" style="color:rgba(45,140,240,.9)" size="24"></Icon>
            </div>
          </div>
        </div>
         <div slot="close" style="display:none">
         </div>
     </Modal>
    </div>
</template>

<style lang="scss">
.replaceTag-content{
  width: 100%;
  max-height: 230px;
  overflow: auto;
  background-color: #fff;
  .selected-this-tag{
    float:right;
  }
  .replaceTag-content-for{
      margin: 0;
      line-height: normal;
      padding: 7px 16px 7px 20px;
      clear: both;
      font-size: 12px!important;
      white-space: nowrap;
      list-style: none;
      cursor: pointer;
  }
  .tags-item{
    position: relative;
    display: inline-block;
    padding: 0px 9px;
    height: 18px;
    line-height: 18px;
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

  .deleteTag-content{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      align-content: center;
      width: 100%;
      height: 200px;
      .ivu-modal-header-inner{
        font-size: 16px;
        font-weight: 100;
      }
      .tags-item{
        position: relative;
        padding: 2px 9px;
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
  .ivu-modal-header-inner{
    font-size: 16px;
    font-weight: 100;
  }
  .noData{
    opacity: 0.5;
    font-size: 14px;
    font-weight:100;
    width: 100%;
    height: 400px;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
  }
  .addTag-content{
    width: 100%;
    height: 405px;
    overflow: auto;
    .addTag-content-row{
      cursor: pointer;
      height: 50px;
      line-height: 50px;
      font-size: 13px;
      border-top: 1px solid #ebf0f2;
      &:hover{
        .tag-color-space{
          .tag-color {
            visibility: visible;
          }
        }
        .delete-tag{
            visibility: visible;
        }
      }
      .delete-tag{
          visibility: hidden;
      }
      .tag-color-space{
        text-align: right;
        .tag-color {
             visibility: hidden;
            .color-item {
                display: inline-block;
                padding: 0 4px;
                cursor: pointer;
                i {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    transition: .3s;
                    display: inline-block;
                }
                &:hover {
                    i {
                        transform: scale(2);
                        margin-left: 5px;
                        margin-right: 10px;
                    }
                }
                &.red {
                    background: #d93651;
                }
                &.orange {
                    background: #ff9f1b;
                }
                &.yellow {
                    background: #ffd500;
                }
                &.light-green {
                    background: #8acc47;
                }
                &.green {
                    background: #47cc8a;
                }
                &.dark-green {
                    background: #30bfbf;
                }
                &.blue {
                    background: #00aaff;
                }
                &.purple {
                    background: #8f7ee6;
                }
                &.gray {
                    background: #98aab3;
                }
            }
        }
      }
      .input-info{
        text-align: left;
      }
      .edit-input{
        width: 100%;
        height: 30px;
        line-height: 1.5;
        padding: 4px 5px;
        font-size: 12px;
        border: 1px solid #ddd;
        border-radius: 5px;
        color: #657180;
        cursor: text;
        transition: border .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out;
        &:focus {
            border: 1px solid #5cadff;
            //box-shadow: 0 0 1px #56a9fc !important;
            outline: none;
            border-radius: 5px;
        }
      }
      .tags-item{
        float:left;
        margin-top: 16px;
        position: relative;
        width: 18px;
        height: 18px;
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
  }
</style>

<script>
import auth from "../../authenticator";
var colorList = [{"id":1,"color":'#d93651'},{"id":2,"color":'#ff9f1b'},{"id":3,"color":'#ffd500'},{"id":4,"color":'#8acc47'},{"id":5,"color":'#47cc8a'},{"id":6,"color":'#30bfbf'},{"id":7,"color":'#00aaff'},{"id":8,"color":'#8f7ee6'},{"id":9,"color":'#98aab3'}];
export default {
  props: ["showAddTagsflagParent"],
  data() {
    return {
      replaceTagItem:{
        TagID: -1,
        TagName: '',
        ColorID: ''
      },
      TagItem:{
        TagID: -1,
        TagName: '',
        ColorID: ''
      },
      colorList:colorList,
      changeInput:-1,
      showAddTagsflag:false,
      showRplaceTagFlag:false,
      showDeleteTagFlag:false,
      tagsList: [],
    }
  },
  computed: {
    numberOfTags(){
      return this.tagsList.length+this.$t('ManageTags.Tags');
    },
    tagsListLength(){
      if(this.tagsList.length==0){
        return false;
      }
      return true;
    }
  },
  methods: {
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
      this.showAddTagsflag=this.showAddTagsflagParent;
      this.refreshTagList();
    },
    refreshTagList(){
      let url=GetAPIUrl()+"Tag/List";
      this._getData(url,null,(result)=>{
        this.tagsList=result;
      },null)
    },
    manageTags(){
      this.showAddTagsflag=true;
    },
    inputChangeInfo(id){
      this.changeInput=id;
    },
    removeEmptyTags(){
      for(let i=0;i<this.tagsList.length;i++){
        if(this.tagsList[i].TagID==-1){
          this.tagsList.splice(i,1);
          break;
        }
      }
    },
    addTags(){
      this.changeInput=-1;
      this.removeEmptyTags();
      setTimeout(()=>{
        this.tagsList.push({
            TagID:-1,//新建
            TagName: "",
            ColorID: 6
        });
      },10)
    },
    //点击切换颜色
    selectTagColor(item,colorId){
      for(let i=0;i<this.tagsList.length;i++){
        if(this.tagsList[i].TagID==item.TagID){
          this.tagsList[i]["ColorID"]=colorId;
          break;
        }
      }

      //更新tag颜色
      let url=GetAPIUrl()+"Tag/UpdateTag";
      let data={
        TagID:item.TagID,
        TagName:item.TagName,
        ColorID:item.ColorID
      };
      if(item.TagID!=-1){
        this._postData(url,data,null,(result)=>{
          this.changeInput=-1;
          this.refreshTagList();
        },null)
      }
    },
    //编辑保存tag
    saveEditTag(item,e){
      var target=e.currentTarget;
      var val=$(target).val();
      if(val==""){
        this.$Message.warning({content:this.$t('ManageTags.TagNameCannotBeEmpty'),duration: 3});
        $(target).val(item.TagName);
        this.refreshTagList();
        return;
      }
      let url;
      let data={
        TagName:val,
        ColorID:item.ColorID
      };
      if(item.TagID==-1){//创建tag
        url=GetAPIUrl()+"Tag/CreateTag";
        this._postData(url,data,null,(result)=>{
          this.changeInput=-1;
          this.refreshTagList();
        },null)
      }else{//更新tag
        data.TagID=item.TagID;
        url=GetAPIUrl()+"Tag/UpdateTag";
        this._postData(url,data,null,(result)=>{
          this.changeInput=-1;
          this.refreshTagList();
        },null)
      }
    },
    //删除单条tag弹出框
    deleteTagModal(item){
      if(item.TagName==""){
        this.removeEmptyTags();
      }else{
        this.showDeleteTagFlag=true;
        this.TagItem.TagID=item.TagID;
        this.TagItem.TagName=item.TagName;
        this.TagItem.ColorID=item.ColorID;
      }
    },
    deleteNow(){
      let url=GetAPIUrl()+"Tag/Delete?tagID="+this.TagItem.TagID;
      this._deleteData(url,null,(result)=>{
        for(let i=0;i<this.tagsList.length;i++){
          if(this.tagsList[i].TagName==this.TagItem.TagName){
            this.tagsList.splice(i,1);
            this.showDeleteTagFlag=false;
            break;
          }
        }
        this.$Message.info(this.$t('ManageTags.SuccessDeleteContent'))
        this.refreshTagList();
      },null);
    },
    replaceTag(){
      this.showRplaceTagFlag=true;
      this.showDeleteTagFlag=false;
    },
    closeManageTag(){
      this.removeEmptyTags();
      this.$nextTick(()=>{
        this.$parent.initial();
      })
    },
    replacecheckTagBox(item){
      this.replaceTagItem.TagID=item.TagID;
      this.replaceTagItem.TagName=item.TagName;
      this.replaceTagItem.ColorID=item.ColorID;
    },
    RplaceTagOk(){
      let data={
        TagID:this.TagItem.TagID,
        TagName:this.replaceTagItem.TagName,
        ColorID:this.replaceTagItem.ColorID
      };
      let url=GetAPIUrl()+"Tag/UpdateTag";
      this._postData(url,data,null,(result)=>{
        this.changeInput=-1;
        this.refreshTagList();
        this.$Message.info(this.$t('ManageTags.SuccessReplaceContent'))
      },null)
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
    _deleteData(url, before, success, error) {
      if (before && typeof before === "function") {
        before();
      }

      this.$Loading.start();

      let self = this;
      $.ajax({
        type: "DELETE",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
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
    }
  },
  directives:{
      "focus":{
          inserted(el,binding){
              if(binding.value){
                  el.focus();
              }
          }
      }
  },
};
</script>
