<template>
  <div class="home-teahcer-work-carddetail">
    <div class="carddetail-item">
      <Row type="flex" justify="center" align="middle" v-for="(item,index) in homeworkCardDetail" :key="index">
        <Col span="8">
          <div @click="handleOpenFile(item)" style="padding-right:20px;">
            <span class="icon icon-document" style="font-size:24px;"></span>
            <span style="margin-left:5px;">{{item.Title}}</span>
          </div>
        </Col>
        <Col span="8" style="padding-left:3em">
          <span class="icon icon-yinxiang" style="font-size:16px;"></span>
          <span>3</span>
        </Col>
        <Col span="4" style="padding-left:4.8em">
          <span>{{item.Points}}</span>
        </Col>
        <Col span="4">
          <Dropdown style="float:right" trigger="hover" placement="top" @on-click="handleHomeworkAction($event,item)">
            <span style="cursor: pointer;padding:0px 20px">
              <Icon size="20" type="android-more-vertical"></Icon>
            </span>
            <DropdownMenu slot="list">
              <DropdownItem name="editHomework">
                重新批改
              </DropdownItem>
              <DropdownItem name="Original">
                查看原始作业
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>
      <!-- <Row type="flex" justify="center" align="middle">
        <Col span="8">
          <span class="icon icon-document" style="font-size:24px;"></span>
          <span style="margin-left:5px;">1.2节阅读练习</span>
        </Col>
        <Col span="8" style="padding-left:3em">
          <span style="width:1em"></span>
        </Col>
        <Col span="4" style="padding-left:4.8em">
          <span style="color:#2d8cf0;font-size:13px;font-weight:bold;padding-right:10px;cursor:pointer;">立即批改></span>
        </Col>
        <Col span="4">
          <Dropdown style="float:right" trigger="hover" placement="top">
            <span style="cursor: pointer;padding:0px 20px">
              <Icon size="20" type="android-more-vertical"></Icon>
            </span>
            <DropdownMenu slot="list">
              <DropdownItem name="viewHomework">
                查看学生作业
              </DropdownItem>
              <DropdownItem name="Original">
                查看作业布置
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row> -->
    </div>
  </div>
</template>
<style lang="scss">
.home-teahcer-work-carddetail{
  span{
    display: inline-block;
  }
}
</style>
<script>
import auth from "../../authenticator";
import webapi from "../../webapi/webapi.js";
  export default {
    props: {
      homeworkCardDetail: Array,
    },
    methods: {
      handleHomeworkAction(name,params){
        switch (name) {
          case 'editHomework':
            this.handleOpenFile(params);
            break;
          case 'Original':
            this.handleOpenFile(params);
            break;
          default:
            break;
        }
      },
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
            auth.setIsShowGrading('Homework-SyncRoom');
        });

      },
    }
  };
</script>
