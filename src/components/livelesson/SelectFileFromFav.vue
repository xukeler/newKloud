<template>
    <div id="ctl-seletfilefromfav">
       <Modal
        v-model="selectFav"
        title="Select document to join current course"
        width="800"
        :closable="false"
        :mask-closable="false"
        @on-ok="selectFavOK"
        @on-cancel="selectFavCancel"
        style="z-index:40000;position: absolute;"
        class-name="hideModalFooter"
    >
        <div slot="header" style=" height:30px;">
            <span
                style="font-size:16px; font-weight:bold;"
            >{{$t("Live.SelectDocumentToCourse")}}</span>
            <span style="float:right;">
                <Button type="primary" @click="selectFavOK">{{$t("Base.OK")}}</Button>
                <Button type="text" @click="selectFavCancel">{{$t("Base.Cancel")}}</Button>
            </span>
        </div>
         <table style="width:100%;margin-bottom:10px;">
            <tr>
                <td style="width:205px;">
                    <Input
                        v-model="searchKey"
                        :placeholder="$t('Base.Search')"
                        style="width: 200px;"
                    ></Input>
                </td>
                <td style="width:80px;">
                    <Button
                        type="primary"
                        icon="ios-search"
                        @click="onSearch"
                    >{{$t("Base.Search")}}</Button>
                </td>
                <td>
                    <div style="text-align:right; padding:0px 0px 5px;margin-top:0px;"><Page :total="total" :page-size="15" size="small" @on-change="onChangePageIndex"></Page></div>
                </td>
            </tr>
        </table>
        
        <Row style="background:rgba(0,153,229,.7); height:30px;" type="flex" align="middle">
            <Col span="2">&nbsp;</Col>
            <Col span="9">{{$t("Base.Title")}}</Col>
            <Col span="9">{{$t("Base.Name")}}</Col>
            <Col span="4">{{$t("Base.Date")}}</Col>
        </Row>
        <div id="favList" style="height:300px; overflow:auto;">
            <div class="favList" v-for="item in favList">
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
        <div slot="footer" style="display:none;"></div>
    </Modal>
    </div>
</template>
<style lang="scss">

</style>

<script>
import auth from "../../authenticator";
import webapi from "../../webapi/webapi.js";
import loger from "../../common/log.js";
import util from "../../common/util.js";
export default {
  components: {

  },
  data() {
    return {     
        favList:[],
        selectedFav: [],
        selectFav:false,
        total:0,
        currentPage:1,
        lastType:0,
        searchKey:"",
    };
  },
  computed: {
   
  },
  watch: {
    
  },
  mounted () {
      
  },
  methods: {
    ShowFiles(type = 1) {
        //console.log("ShowFiles:"+type+","+this.currentPage);
        this.searchKey="";
        this.lastType=type;
        this.selectedFav=[];
        this.selectFav = true;        
        //this.currentPage=1;
        this.showFilesByPage(type,this.currentPage-1,()=>{
            this.$nextTick(() => {
                this.selectedFav = [];
                $("#favList").find("INPUT[type=checkbox]:checked").prop("checked", false);
            });
        });        
    },
    showFilesByPage(type=1,page=-1,callback){
        this.favList = [];
        webapi.getMyFavorite(type, -1,page,15,this.searchKey).then(d => {
            if(d)
            {
                this.total=d.TotalCount;
                for (let item of d.DocumentList) {
                    if (item.Status != 0) {
                        continue;
                    }
                    this.favList.push(this.favList2ShowList(item));
                }          
            }
            else{
                this.$Message.error({
                    content: 'Error! please try again!',
                    duration: 0,
                    closable: true
                })
            }
            if(callback)callback(); 
        });
    },
    onSearch(){
        this.showFilesByPage(this.lastType,0);
    },
    getFavName(id) {
        for (var fav of this.favList) {
            if (fav.id == id) {
                return fav.filename;
            }
        }
        return "";
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
        //loger.log(this.selectedFav.join(","));
    },
    selectFavOK(){
        if (this.selectedFav.length < 1) {
            return;
        }
        this.selectFav=false;
        var arrName= new Array();
        for(var id of this.selectedFav)
        {
            arrName.push(this.getFavName(id));
        }
        this.$emit("onOK",this.selectedFav,arrName);
    },
    selectFavCancel(){
        this.selectFav=false;
    },
    onChangePageIndex(page){
        //onsole.log("page:"+page);
        this.currentPage=page;
        this.showFilesByPage(this.lastType,page-1);
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
    _lineItem2EventFile(lineItem, selected) {
        let atmid = lineItem.AttachmentID + "";
        let id =
            atmid.lastIndexOf("-") > -1
                ? atmid.substr(atmid.lastIndexOf("-") + 1)
                : atmid;
        let url = lineItem.AttachmentUrl;
        let name = lineItem.Title; //url.substr(url.lastIndexOf('/') + 1);
        if (!name) name = url.substr(url.lastIndexOf("/") + 1);
        name = name.replace(/\+/g, " ");
        if (name.indexOf("5815bb8e-af84-47e9-9eac-344c4c81c8fd") > -1) {
            name = "Default Blank Page";
        }
        let eventFile = {
            id: lineItem.ItemID,
            atmid: atmid,
            name: name,
            url: url,
            status: "finished",
            detail: lineItem,
            eventid: lineItem.EventID,
            eventname: lineItem.EventName,
            blankpagenumber: lineItem.BlankPageNumber,
            isselected: selected,
            ready: true,
            count:lineItem.SyncCount,
            process: 0
        };

        return eventFile;
    },
  }
}
</script>


