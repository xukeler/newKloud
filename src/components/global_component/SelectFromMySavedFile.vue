<template>
  <div class="select-from-my-saved-file">
    <Input v-model="searchFile " placeholder="Search file..." style="width:260px;margin-bottom:12px" icon="ios-search" @on-enter="handleSearch" @on-click="handleSearch"></Input>
    <Row style="background:rgba(0,153,229,.7); height:30px;" type="flex" align="middle">
        <Col span="2">&nbsp;</Col>
        <Col span="9">{{$t("Base.Title")}}</Col>
        <Col span="9">{{$t("Base.Name")}}</Col>
        <Col span="4">{{$t("Base.Date")}}</Col>
    </Row>
    <div :id="inPutId" style="height:300px; overflow:auto;">
        <div class="favList" v-for="(item,index) in favList" :key="index">
            <Row style="min-height:26px;" type="flex" align="middle">
                <Col span="2">
                    <input
                        type="checkbox"
                        :value="item.id"
                        @click="onSelectedFavClick($event);"
                    >
                </Col>
                <Col span="9">{{item.title}}</Col>
                <Col span="9">{{item.filename}}</Col>
                <Col span="4">{{item.date}}</Col>
            </Row>
        </div>
    </div>
    <div style="margin: 16px 0; overflow: hidden;  text-align: left;">
      <Select v-model="pageSize" style="width:150px;" @on-change="pageSizeChange" size="small">
        <Option :value="10">{{$t('Common.Page10')}}</Option>
        <Option :value="25">{{$t('Common.Page25')}}</Option>
        <Option :value="50">{{$t('Common.Page50')}}</Option>
        <Option :value="100">{{$t('Common.Page100')}}</Option>
      </Select>

      <div style="float: right; display: flex; align-items: center;">
        <div style="display: inline-block; margin-right: 1em;">{{dataTotal}} {{$t("Files.TotalFiles")}}</div>
        <div style="display: inline-block">
          <Page
            :total="dataTotal"
            :current="pageIndex"
            :page-size="pageSize"
            @on-change="pageIndexChange" size="small"
          ></Page>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .select-from-my-saved-file{}
</style>
<script>
import webapi from "../../webapi/webapi.js";

  export default {
    data: function ()
    {
      return {
        selectedFav:[],
        favList:[],
        dataTotal: 0,
        pageSize: 10,
        pageIndex: 1,
        searchFile:'',
      };
    },
    props:{
      inPutId:{
        type:String,
        default:"favList"
      }
    },
    mounted: function (){
      this.$emit("getSelectFileList",this.selectedFav);
    },
    methods: {
      pageIndexChange(page) {
        this.pageIndex = page;
        this.initialFileList();
      },
      pageSizeChange(data) {
        this.pageIndex = 1;
        this.initialFileList();
      },
      handleSearch(){
        this.pageIndex = 1;
        this.initialFileList();
      },
      reset(){
        this.searchFile = "";
        this.pageIndex = 1;
      },
      initialFileList(){
        webapi.getMyFavorite(1, -1,this.pageIndex-1,this.pageSize,this.searchFile).then(d => {
            this.favList = [];
            this.dataTotal = d.TotalCount;
            for (let item of d.DocumentList) {
                if (item.Status != 0) {
                    continue;
                }
                this.favList.push(this.favList2ShowList(item));
            }
            this.$nextTick(() => {
                this.selectedFav = [];
                $("#"+this.inPutId).find("INPUT[type=checkbox]:checked").prop("checked", false);
            });
        });
      },
      favList2ShowList(item) {
        var ct = new Date();
        ct.setTime(item.CreatedDate);
        let showCT = ct.Format("yyyy-MM-dd hh:mm:ss");
        return {
            id: item.ItemID,
            atid: item.AttachmentID,
            title: item.Title,
            filename: item.Title,
            date: showCT,
            checked: false
        };
      },
      onSelectedFavClick(evt) {
        var tar = evt.currentTarget;
        if (tar.checked) {
            this.selectedFav.push($(tar).val());
        } else {
            var nindex = FindStrInArr(this.selectedFav, $(tar).val());
            if (nindex > -1) {
                this.selectedFav.splice(nindex, 1);
            }
        }
        this.$emit("getSelectFileList",this.selectedFav);
      },
    },
  }
</script>
