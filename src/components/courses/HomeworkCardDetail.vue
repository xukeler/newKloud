<template>
  <div class="home-work-carddetail">
    <div class="carddetail-item" v-for="(item,index) in homeworkCardDetail.attachments" :key="index">
      <div class="item-left">
        <div @click="handleOpenFile(item)" style="padding-right:20px;">
          <span class="icon icon-document" style="font-size:24px;"></span>
          <span style="margin-left:5px;">{{item.Title}}</span>
        </div>
      </div>
      <div class="item-middle">
        <span style="font-weight:bold">Points</span>
        <span style="margin-left:15px;">100</span>
      </div>
      <div class="item-right">
        <Dropdown>
          <span style="cursor: pointer;padding:10px 20px">
            <Icon size="20" type="android-more-vertical"></Icon>
          </span>
          <DropdownMenu slot="list">
            <DropdownItem name="edit">
              Edit
            </DropdownItem>
            <DropdownItem name="delete">
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.home-work-carddetail{
  span{
    display: inline-block;
  }
  .carddetail-item{
    display: flex;
    justify-content:flex-start;
    align-items: center;
    flex-direction: row;
    .item-left{
      flex:1 1 300px;
      display: flex;
      justify-content:flex-start;
      align-items: center;
      flex-direction: row;
      text-align: left;
    }
    .item-middle{
      flex:0 0 120px;
      text-align: left;
    }
    .item-right{
      flex:0 0 60px;
      text-align: left;
    }
  }
}
</style>
<script>
import webapi from "../../webapi/webapi.js";
  export default {
    props: {
      homeworkCardDetail: Object,
    },
    methods: {
      handleOpenFile(params) {
        //console.log(params.row.detail);
        if(params.FileType==5 || params.FileType==4)
        {
            this.$Message.error("Can't view this file!");
            return;
        }
        // this.$router.push({ name: "view", params: { id: params.ItemID,type:2 } });
        // return;      
        // this.$router.push({ name: "docview", params: { id: params.ItemID } });
        // return;
        
        webapi.AddTempLesson(params.AttachmentID,params.Title).then(res=>{
            //res.RetData
            this.$router.push({ name: "docview", params: { id: res.RetData.ItemID } });
        });

      },
    }
  };
</script>
