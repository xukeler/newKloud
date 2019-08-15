<template>
    <div id="lessonview" class="lessonview">
        <div class="syncviewplaybtn" id="syncviewplaybtn" style="" @click="onClickLayer($event);">            
             <Button v-show="!isLoading" @click.stop="playShareSync($event)" type="ghost" shape="circle" style="width: 100px;height: 100px;border-radius: 50px;background-color: #eee;">
                 <Icon size="60" type="play" style="margin-left:10px;"></Icon>
             </Button>
              <Spin v-show="isLoading" fix style="opacity:1;">
                  <Icon type="load-c" size=18 class="loadingsync"></Icon>
            </Spin>
        </div>
        <div id="syncviewHolderOuter" class="syncviewHolderOuter">
            <div id="main" class="maincontainer"></div>
            <div id="liveplayvideo"  class="maincontainer" style="display:none; background-color:black; overflow:hidden;">
                <video-player ref="livevideoplayer"></video-player>
            </div>
             <div id="liveToolbarWrap" class="liveToolbar" style="">
            <section id="liveToolbar">
                <section class="liveToolbar-zoom">
                    <span id="livePageNumber" class="toolbar-label"></span>
                    <span
                        id="livePageCount"
                        class="toolbar-label"
                        style="margin-right:0px"
                    ></span>
                    <span class="icon icon-zoomin" id="liveButtonZoomIn" :title="$t('Live.ZoomIn')" style="padding:0px 8px 8px;"></span>
                    <select
                        id="liveSelectScale"
                        title="Zoom"
                        style="background-color:transparent; border:0px; font-size: 12px; color:#333;-webkit-appearance:none;-moz-appearance:none;"
                    >
                        <option id="liveCustomScaleOption" title value="custom" disabled="disabled" hidden ></option>
                        <option value="0.25">25%</option>
                        <option value="0.5">50%</option>
                        <option value="0.75">75%</option>
                        <option value="1" selected="selected">100%</option>
                        <option value="1.25">125%</option>
                        <option value="1.5">150%</option>
                        <option value="2">200%</option>
                        <option value="3">300%</option>
                        <option value="4">400%</option>
                    </select>
                    <span class="icon icon-zoomout" style="padding:0px 8px 8px;" id="liveButtonZoomOut" :title="$t('Live.ZoomOut')" ></span>
                    <span id="liveButtonSizeMode" class="liveButtonSizeModeWidth"></span>
                    <span
                        class="icon icon-left"
                        id="liveButtonPrevious"
                        style="display:none;"
                        :title="$t('Live.PreviousPage')"
                    ></span>
                    <span></span>
                    <span
                        class="icon icon-right"
                        id="liveButtonNext"
                        style="display:none;"
                        :title="$t('Live.NextPage')"
                    ></span>
                </section>
            </section>
        </div>
        <div id="livePanelTopCtlWrap" class="livePanelTopCtl-wrap attendee-view attendee-view-open" style="display:none;">
            <section id="livePanelTopCtl" style="display: flex;justify-content: center;">
                <Poptip
                    @on-popper-show="disableThinkToolTip=true;onThinkListPop(true);"
                    @on-popper-hide="disableThinkToolTip=false;onThinkListPop(false);"
                    placement="top-end"
                    v-model="showSyncPoptip"
                >
                <div class="livePanelTopCtlbtn" style="">
                    <span class="icon icon-file"></span>
                </div>
                    <div id="liveMoreAction" style="" slot="content">
                        <div id="liveThink" style="width:350px;">                           
                            <div style="max-height:500px;overflow:auto;">
                                <div v-if="thinkList.length==0" style="padding:10px 0px 5px;text-align:center;">
                                    <div><Icon type="ios-information-outline" size="48"></Icon></div>
                                    <div> 0 file</div>
                                    
                                </div>
                                <div class="liveThinkitem" @click="onClickPlaySync($event,item.id);" :key="item.id" :id="'liveThinkitem'+item.id" v-for="item in this.thinkList">
                                     <div><img src="/static/images/file.svg" class="live-file-thumbnail" style="width: 30px;"></div>
                                    <div class="liveThinkitemtitle">{{item.title}}</div>   
                                </div>
                            </div>
                        </div>
                    </div>
                </Poptip>                        
            </section>
        </div>
        <ad-view ref="adview" :IsShow="showAdView"></ad-view>
        <sync-player ref="syncplayer" @onPlayBaseAction="onPlayBaseAction" :CanControl="canControlPlayer" :SingleMode="true" @onPlaySyncEnd="onPlaySyncEnd"
        @onRecordSyncStart="onRecordSyncStart" @onRecordSyncEnd="onRecordSyncEnd" @onPreLoadAudioEnd="onPreLoadAudioEnd" @onPlaySyncStart="onPlaySyncStart" @onPlaySyncPause="onPlaySyncPause"
        @onPlaySyncGo="onPlaySyncGo" @onPlaySyncTo="onPlaySyncTo"
        ></sync-player>
        </div>
    </div>
</template>
<style lang="scss">
.ivu-notice {
  z-index: 10001;
}
svg {
  touch-action: none;
}
$images-root: "../../../static/images/";

.hideModalFooter {
}
.hideModalFooter .ivu-modal-footer {
  display: none;
}
.hideModalHead {
}

.hideModalHead .ivu-modal-header {
  display: none;
}
.lessonview {
  position: relative;
  user-select: none;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .loadingsync{
        animation: ani-demo-spin 1s linear infinite;
    }

    .liveButtonSizeModeWidth{
      background-image: url($images-root+"icon-fitWidth.svg");
      background-position:center;
      background-repeat:no-repeat;
      background-size:16px 16px;
      width:16px;
      height:16px;
      position: relative;
      top: 2px;
      display: inline-block;
      margin-left: 5px;
      cursor: pointer;
  }
  .liveButtonSizeModeHeight{
      background-image: url($images-root+"icon-fitHeight.svg");
      background-position:center;
      background-repeat:no-repeat;
      background-size:16px 16px;
      width:16px;
      height:16px;
      position: relative;
      top: 2px;
      display: inline-block;
      margin-left: 5px;
      cursor: pointer;
  }

  .syncviewplaybtn
  {
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-align:center;
    vertical-align: middle;
    background: #333333;
    opacity: 0.4;
    z-index: 2;
    position:absolute;
    display:flex;
    justify-content:center;
    align-items:center;
  }
  .syncviewHolderOuter {
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-align: left;
  }
  .livePanelTopCtl-wrap {
      position: fixed;
      right: 20px;
      bottom: 35px;
      z-index: 21;
      font-size: 0;
      height: 50px;
      width: 40px;
      padding-top: 6px;
      box-sizing: border-box;
  }
  .livePanelTopCtlbtn {
      display: block;
      height: 43px;
      width: 43px;
      line-height: 43px;
      text-align: center;
      cursor: pointer;
      border-radius: 100%;
      background: #2e3d49;
      position: relative;
  }
  .livePanelTopCtlbtn.selected {
      background-color: #1db1e9;
      color: white;
  }
  .livePanelTopCtlbtn .icon {
      font-size: 22px;
      color: #fff;
  }
  .liveThinkSelectMore {        
        color: #2db7f5;
        padding: 15px 0px;
        clear: both;
        text-align:center;
    }
    .liveThinkSelectMore span {
        cursor: pointer;
    }
    .liveThinkSelectCreate {
        border-top: 1px solid #ccc;
        padding: 15px 0px 5px;
    }
    .liveThinkitem {
        // border-bottom: 1px solid #f9f7f7;
        height: 40px;
        display: flex;
        margin: 5px 0px;
        align-items: center;
        cursor: pointer;
    }
    .liveThinkitem:hover{
        background-color: #ddd;
    }
    .liveThinkitemleft {
        float: left;
        width: 320px;
    }
    .liveThinkitemright {
        float: right;
        width: 30px;
        text-align: right;
        padding: 10px 10px 0px 0px;
    }
    .liveThinkitemtitle {
        text-align: left;
        padding: 5px 0px 5px;
        font-weight: bold;
        font-size: 14px;
    }
    .liveThinkitemdetail {
        text-align: left;
        height:24px;
    }
    .liveThinkitemusername {
        padding: 0px 5px;
    }
    .liveThinkitemtime {
        padding: 0px 5px;
        color: #ccc;
    }
  
  .live-main-panel {
    float: left;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
  .icon-converting {
    animation: spin 1s linear infinite;
  }

  @keyframes likewater {
    from {
      width: 0;
      height: 0;
      left: 0px;
      top: 0px;
      opacity: 1;
    }

    to {
      left: -50px;
      top: -50px;
      width: 100px;
      height: 100px;
      opacity: 0;
    }
  }
  .liveMouseShowAnimation {
    animation: likewater 500ms ease-out backwards;
  }
  .live-pdf-action {
    display: block;
    height: 36px;
    width: 36px;
    line-height: 36px;
    text-align: center;
    color: #4a4a4a;
    box-sizing: content-box !important;
  }
  .live-pdf-action > span.icon {
    font-size: 22px;
  }

  .live-pdf-action-active,
  .live-pdf-action:hover {
    background-color: #f5f5f5;
  }
  .previewPanelOperation {
    display: block;
    position: fixed;
    z-index: 1000;
    top: 0px;
    right: 1px;
    font: 400 12px Arial, Helvetica, sans-serif;
    box-sizing: content-box !important;
    background: #fff;
    box-shadow: 0px 0 4px rgba(0, 0, 0, 0.2);
    vertical-align: top;
  }
  #main {
    height: 100%;
    width: 100%;
    overflow: auto;
    position: relative;
  }
  .maincontainer {
    height: 100%;
    overflow: auto;
    display: inline-block;
    text-align: center;
  }

  .maincontainer div:focus {
    outline: none;
  }
#main::-webkit-scrollbar-track-piece {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #fff;
    width: 9px;
    height: 9px;
  }

  #main::-webkit-scrollbar {
    visibility: hidden;
    width: 9px;
    height: 9px;
    background-color: #fff;
  }

  #main:hover::-webkit-scrollbar {
    visibility: visible;
  }

  #main::-webkit-scrollbar-thumb {
    border-radius: 9px;
    height: 9px;
    width: 9px;
    background-color: #c2c2c2;
  }

.liveToolbar {
        position: fixed;
        // display:none;
        bottom: 35px;
        left: 15px;
        height: 34px;
        width: 216px;
        text-align: left;
        padding-top: 2px;
        z-index: 101;
        .toolbar-button,
        .toolbar-dropdown {
            vertical-align: top;
            border: 0 none;
            background-color: #8c98ae;
            width: 32px;
            height: 25px;
            padding: 2px 6px 0;
            margin: 3px 2px 4px 0;
            color: hsla(0, 0%, 100%, 0.8);
            font-size: 12px;
            line-height: 14px;
            font: message-box;
            outline: none;
            transition-property: background-color, border-color, box-shadow;
            transition-duration: 150ms;
            transition-timing-function: ease;
        }

        .toolbar-button:hover,
        .toolbar-button:focus,
        .toolbar-dropdown {
            background-color: hsla(0, 0%, 0%, 0.12);
            background-image: linear-gradient(
                hsla(0, 0%, 100%, 0.05),
                hsla(0, 0%, 100%, 0)
            );
            background-clip: padding-box;
            border: 1px solid white;
            //hsla(0,0%,0%,.35);
            /*border-top-color: rgba(0, 0, 0, 0.35);
      border-right-color: rgba(0, 0, 0, 0.35);
      border-bottom-color: rgba(0, 0, 0, 0.35);
      border-left-color: rgba(0, 0, 0, 0.35);
      border-color: hsla(0,0%,0%,.32) hsla(0,0%,0%,.38) hsla(0,0%,0%,.42);*/
            box-shadow: 0 1px 0 hsla(0, 0%, 100%, 0.05) inset,
                0 0 1px hsla(0, 0%, 100%, 0.15) inset,
                0 1px 0 hsla(0, 0%, 100%, 0.05);
        }

        .toolbar-button > span {
            display: inline-block;
            width: 0;
            height: 0;
            overflow: hidden;
        }

        .toolbar-button[disabled] {
            opacity: 0.5;
        }
        .toolbar-button.page-down::before {
            content: url($images-root+"toolbarButton-pageRight.png");
        }

        .toolbar-button.page-up::before {
            content: url($images-root+"toolbarButton-pageLeft.png");
        }

        .toolbar-button.presentation-mode::before {
            content: url($images-root+"toolbarButton-presentationMode.png");
        }

        .toolbar-button.presentation-min-mode::before {
            content: url($images-root+"toolbarButton-presentationMinMode.png");
        }

        .toolbar-button.zoom-out::before {
            content: url($images-root+"toolbarButton-zoomOut.png");
        }

        .toolbar-button.zoom-in::before {
            content: url($images-root+"toolbarButton-zoomIn.png");
        }

        .toolbar-label {
            display: inline-block;
            //vertical-align: middle;
            font-size: 12px;
            text-align: left;
            padding-left: 4px;
            color: #333;
            -webkit-user-select: none;
            -moz-user-select: none;
            cursor: default;
        }
        #liveButtonNext {
            position: fixed;
            top: 50%;
            right: 56px;
            font-size: 36px;
            width: 45px;
            height: 45px;
            margin-top: -22px;
            text-align: center;
            background: rgba(255, 255, 255, 0.5);
            line-height: 45px;
            border-radius: 100%;
        }
        #liveButtonNext.sidebar-open {
            right: 356px;
        }

        #liveButtonPrevious {
            position: fixed;
            top: 50%;
            left: 16px;
            font-size: 36px;
            width: 45px;
            height: 45px;
            margin-top: -22px;
            text-align: center;
            background: rgba(255, 255, 255, 0.5);
            line-height: 45px;
            border-radius: 100%;
        }

        .toolbar-field {
            padding: 2px 0px 2px 0px;
            border-radius: 2px;
            background-color: #8c98ae;
            background-clip: padding-box;
            border: 0px solid white;
            box-shadow: 0 1px 0 hsla(0, 0%, 0%, 0.05) inset,
                0 1px 0 hsla(0, 0%, 100%, 0.05);
            color: hsl(0, 0%, 95%);
            font-size: 12px;
            line-height: 14px;
            outline-style: none;
            transition-property: background-color, border-color, box-shadow;
            transition-duration: 150ms;
            transition-timing-function: ease;
            text-align: right;
        }

        .toolbar-field:hover {
            background-color: #8c98ae;
        }

        .toolbar-field.page-number {
            -moz-appearance: textfield;
            min-width: 16px;
            text-align: right;
            width: 34px;
            vertical-align: top;
        }

        .toolbar-dropdown {
            display: inline-block;
            width: 120px;
            max-width: 120px;
            min-width: 120px;
            padding: 0;
            overflow: hidden;
            background: url($images-root+"toolbarButton-menuArrows.png")
                no-repeat;
            background-position-x: 0%;
            background-position-y: 0%;
            background-position: 95%;
        }

        .toolbar-dropdown > select {
            min-width: 140px;
            font-size: 12px;
            color: hsl(0, 0%, 95%);
            margin: 0;
            padding: 3px 2px 2px;
            border: none;
            background-color: #8c98ae;
        }

        .toolbar-dropdown > select > option {
            background-color: #8c98ae;
        }
    }
    .liveToolbar-zoom,
    .liveToolbar-pagination {
        font-size: 0;
        background: rgba(255, 255, 255, 0.5);
        height: 32px;
        line-height: 32px;
        border-radius: 16px;
        padding: 0 14px;
        display: inline-block;
        vertical-align: middle;
    }
    .liveToolbar-zoom .icon{
      cursor: pointer;
    }
    .hover-hide #liveToolbar {
        display: none !important;
    }
    .liveToolbar.hover-hide:hover #liveToolbar {
        display: block !important;
    }
    #liveSelectScale {
        display: inline-block;
        //vertical-align: middle;
    }

    .liveToolbar-pagination {
        padding: 0 10px;
    }
    .liveToolbar ul li:nth-child(1):hover,
    .liveToolbar ul li:nth-child(3):hover,
    .liveToolbar ul li:nth-child(5):hover,
    .liveToolbar ul li:nth-child(7):hover {
        background: rgba(255, 255, 255, 0.1);
    }
    .liveToolbar ul li {
        float: left;
        list-style: none;
        height: 32px;
        line-height: 32px;
        vertical-align: middle;
        padding: 0px 2px;
    }

}
</style>
<script>
import auth from "../../authenticator";
//import whiteboard from "../../common/whiteboard.js";
import webapi from "../../webapi/webapi.js";
import loger from "../../common/log.js";
import util from "../../common/util.js";

//import  whiteboard from "../../common/whiteboard.js";
import WhiteBoardTool from "../../common/whiteboard.js";
import '../../common/whiteboard.css';

import SyncPlayer from "./SyncPlayer.vue";
import VideoPlayer from "./VideoPlayer.vue";
import AdView from "./AdView.vue";


var whiteboard = new WhiteBoardTool();
//var docview = new ImageDocumentView();
var PageNumber = 1;
var ToPageNumber = 1;
var IsRecord = false;
var Context = null;
var PDFCOUNT = 0;
var CurrentScale=1;
var websocket = null;
var IsChangePageByClick=false;

function GetSocket(context) {
    return context.$parent.$refs.noticemsg.obj;
    //return context.$parent.$children[0]._data.obj;
}

function AfterChangePage(pageid) {
  //Context.CheckPageObject(ToPageNumber);
}
function ShowPdfInfo() {
    console.log("ShowPdfInfo:" + PageNumber);
    //$("#pdfinfo").find(">span").html(PageNumber + "/" + PDFCOUNT);
    // $("#livePageNumber").text(GetShowNumber(PageNumber));
    // if (PageNumber > PDFCOUNT + NewPageList.length) {
    //     $("#livePageCount").text("");
    // } else {
    //     $("#livePageCount").text(" / " + (PDFCOUNT + NewPageList.length));
    // }
    // if (websocket && ToPageNumber > 0) {
    //     websocket._currentPageID = ToPageNumber;
    // }
}
function updateToolbar() {
    if (document.getElementById("liveSelectScale")) {
        var options = document.getElementById("liveSelectScale").options;
        var predefinedValueFound = false;
        for (var i = 0, ii = options.length; i < ii; i++) {
            var option = options[i];
            if (option.value != CurrentScale) {
                option.selected = false;
                continue;
            }
            option.selected = true;
            predefinedValueFound = true;
        }

        if (!predefinedValueFound) {
            var customScale = Math.round(CurrentScale * 10000) / 100;
            var customScaleOption = document.getElementById(
                "liveCustomScaleOption"
            );
            customScaleOption.textContent = customScale + "%";
            customScaleOption.selected = true;
        }
    }
    var mh=$("#main").height();
    var ch=$("#pageContainer"+PageNumber).height();
    if(ch<mh)
    {
      $("#pageContainer"+PageNumber).css("top",(mh-ch)/2+"px");
      $("#pageContainer"+PageNumber).find("div.boardhead").css("top",(mh-ch)/2+"px");
      
    }
    else{
      $("#pageContainer"+PageNumber).css("top","");
      $("#pageContainer"+PageNumber).find("div.boardhead").css("top","");
    }
}
function LiveBodyResize()
{
  updateToolbar();
}
function CheckZoom()
{
    whiteboard.OnZoomChange(1);
    return;
    var oldinfo=whiteboard.GetPageInfo();
    
    
    for(var info of oldinfo)
    {
        whiteboard.Play(info);
    }
}

function ShowPdfInfo() {
    $("#livePageNumber").text(PageNumber);
    $("#livePageCount").text(" / " + (PDFCOUNT));
    if (websocket && PageNumber > 0) {
        websocket._currentPageID = PageNumber;
    }
}
function LiveDocPreviousPage()
{
    if($("#syncviewplaybtn").is(":visible"))
    {
        $("#syncviewplaybtn").hide();
    }
    IsChangePageByClick=true;
    whiteboard.PreviewPage((issuccess,pagenumber)=>{
      if(!issuccess && pagenumber==-1)
      {
          console.log("PreviewPage error");      
          Context.showDiffAttachment(-1);
      }
      else
      {
          // PageNumber=pagenumber;
          // ShowPdfInfo();
          // CurrentScale=1;
          // updateToolbar();
      }
  });
}
function LiveDocNextPage()
 {
     if($("#syncviewplaybtn").is(":visible"))
    {
        $("#syncviewplaybtn").hide();
    }
    IsChangePageByClick=true;
    whiteboard.NextPage((issuccess,pagenumber)=>{
      if(!issuccess && pagenumber==-1)
      {
          //change document
          console.log("NextPage error");      
          Context.showDiffAttachment(1);   
      }
      else
      {
          // PageNumber=pagenumber;
          // ShowPdfInfo();
          // CurrentScale=1;
          // updateToolbar();
      }
  });
 }
function LiveDocZoomIn()
{
    var oldinfo=whiteboard.GetPageInfo();
    //console.log(oldinfo)
    whiteboard.Clear();
    whiteboard.ZoomIn((scale)=>{
        CurrentScale=scale;
        updateToolbar();
        for(var info of oldinfo)
        {
            whiteboard.Play(info);
        }
    });
}
function LiveDocZoomOut()
{
    var oldinfo=whiteboard.GetPageInfo();
    //console.log(oldinfo)
    whiteboard.Clear();
    whiteboard.ZoomOut((scale)=>{
        CurrentScale=scale;
        updateToolbar();
        for(var info of oldinfo)
        {
            whiteboard.Play(info);
        }
    });
 }
function InitPage()
{
    whiteboard.SetCanEdit(true);
    whiteboard.OnToolReset(function(res) {
      console.log("OnToolReset:"+res);
      //_activeButton("#liveActionCursor");
    });
    whiteboard.OnReceviceData(function(res) {
        if(websocket && websocket.isopen())
        {
            var t = Context.$refs.syncplayer.getAudioCurrentTime();
            if (t >= 0) {
                res.time = t;
            }            
            websocket.sendsyncactions(JSON.stringify(res), Context.attachmentID, function(d) {
                //loger.log("sendsyncactions->data:" + d.data);
            });
        }
      //console.log("SetReceviceData:"+ JSON.stringify(res));
      if(res.type==34)
      {
          //whiteboard.Play(res);
      }
    });
    //whiteboard.Init($("#svg1"), $("#main"), $("#pageContainer1"), 1);
    var showLoadingTimer=null;
    whiteboard.OnDownload((pagenumber,process)=>{
        //console.log(PageNumber+":"+pagenumber+"->"+process);
        if(PageNumber!=pagenumber)
        {
            return;
        }
        if(showLoadingTimer)
        {
            clearTimeout(showLoadingTimer);
            showLoadingTimer=null;
        }
        if(process==0)
        {
            showLoadingTimer = setTimeout(()=>{
                util.ShowDownload(true);
                Context.autoPausePlay();
            },2000);
        }
        else if(process==100)
        {
            // setTimeout(()=>{
            //     Context.autoGoPlay();
            //     util.ShowDownload(false);
            // },5000);
            Context.autoGoPlay();
            util.ShowDownload(false);            
            Context.$Message.destroy();
            if(PageNumber==1)
            {
                Context.PreLoadSyncAudio();
            }
            whiteboard.PreLoadPage(PageNumber+1);
            whiteboard.PreLoadPage(PageNumber-1);
        }
        else//-1:error
        {
            util.ShowDownload(false);
        }
        

    });
    whiteboard.OnError(res=>{
        //{Code:11,Data:obj}
        console.info("Error=>"+JSON.stringify(res));
        if(res.Code==100)
        {
            Context.$Message.error({content: '文件下载不成功。',duration: 0,closable: true})
        }
    });

    whiteboard.OnPageChange((pagenumber,type)=>{
      //console.log("OnPageChange:"+pagenumber+","+type);
      PageNumber=pagenumber;
      ShowPdfInfo();
      CurrentScale=1;      
      Context.ShowSyncObject(pagenumber,IsChangePageByClick);
      IsChangePageByClick=false
      updateToolbar();
    });
    whiteboard.OnSelectVideo((id,afterSelectVideo)=>{
      console.log("On video select:"+id);
      afterSelectVideo(id,{});
    });
    whiteboard.OnVideoPlay(id=>{
      //console.log("OnVideoPlay:"+id);
      Context.playVideoTag(id);
    });

    var bodyScroolTimer = null;
    var bodyResizeTimer = null;
    $(window).bind("resize", function() {
        LiveBodyResize();
        if (bodyResizeTimer) {
            clearTimeout(bodyResizeTimer);
        }
        bodyResizeTimer = setTimeout(() => {
            CheckZoom();
        }, 200);
    });

     $("#main").bind("scroll", () => {
        //loger.log("scrool:" + $(document).scrollTop());
        if (bodyScroolTimer) {
            clearTimeout(bodyScroolTimer);
        }
        bodyScroolTimer = setTimeout(() => {
            //Record_view();
        }, 200);
    });
}
  
function initializeControlWindow(vuethis) {
    $("#liveButtonPrevious").click(function(e) {
        LiveDocPreviousPage();
        
        _cancelDefault(e);
        _cancelBubble(e);
        return false;
    });
    $("#liveButtonNext").click(function(e) {
        LiveDocNextPage();
        _cancelDefault(e);
        _cancelBubble(e);
        return false;
    });
    $("#liveButtonZoomOut").click(function(e) {
        LiveDocZoomOut();
       
        _cancelDefault(e);
        _cancelBubble(e);
        return false;
    });
    $("#liveButtonZoomIn").click(function(e) {
        LiveDocZoomIn();
        
        _cancelDefault(e);
        _cancelBubble(e);
        return false;
    });

    $("#liveButtonSizeMode").click(function(e) {
        if($("#liveButtonSizeMode").hasClass("liveButtonSizeModeWidth"))
        {
            $("#liveButtonSizeMode").removeClass("liveButtonSizeModeWidth").addClass("liveButtonSizeModeHeight");
            whiteboard.SetSizeMode(1);
        }
        else
        {
            $("#liveButtonSizeMode").removeClass("liveButtonSizeModeHeight").addClass("liveButtonSizeModeWidth");
            whiteboard.SetSizeMode(0);
        }
        whiteboard.RefreshDocument(()=>{
            whiteboard.TriggerViewChange();
            CurrentScale=1;
            updateToolbar();
        });
    });
}

export default {
  data: function() {
    return {
        canControlPlayer:true,
        showFileList: false,
        disableFileToolTip: false,
        disableThinkToolTip: false,
        editingEventFiles: [],
        attachmentName:"",
        attachmentID:0,
        lessonID:0,
        thinkShareMode:false,           
        thinkCreate: false,
        thinkShow:  true,
        thinkShowSyncBtn: false,
        thinkList: [],
        thinkListCount: 0,
        thinkCurrentID:0,
        thinkInfo:null,
        showAdView:false,
        isLoading:false,
        isPause:false,
        isPlay:false,
        showSyncPoptip:false,
        showPageLine:true
    };
  },
  props: {},
  components:{
      SyncPlayer,
      AdView,
      VideoPlayer
  },
  mounted: function() {
    this.Init();
    InitPage();
    $(document).children().bind("keydown", this.onKeyDown4SyncView);
    if(!IsPC())
    {
        $("#liveToolbarWrap").css({bottom:"65px"});
        $("#syncPlayerControls").css({bottom:"25px"});
        $("#livePanelTopCtlWrap").css({bottom:"60px"});
    }
  },
  beforeDestroy: function() {
      //console.log("beforeDestroy");
      if(websocket && websocket.isopen())
      {
          websocket.endmeeting();
          websocket.setmeetingid(0);
      }
      $(document).children().unbind("keydown", this.onKeyDown4SyncView);
      util.ShowDownload(false);
  },
  methods: {
    Init() {
        websocket = GetSocket(this);
        window.onunload = () => { 
            if(websocket && websocket.isopen())
            {
                websocket.endmeeting();
                websocket.logout();
            } 
        };

        if(this.getItemID()>0)
        {
            this.thinkCurrentID=this.getItemID();
             webapi.GetSoundtrack(this.getItemID()).then(res => {
                if(res==null) return;
                this.thinkInfo=res;
                this.isLoading=true;
                //this.PreLoadSyncAudio(res);
                this.attachmentName=res.Title;

                // this.attachmentID=res.DocInfo.AttachmentID;
                // whiteboard.ShowDocument($("#main"),res.DocInfo.AttachmentUrl,1,(issuccess, pdfcount)=>{
                //     PDFCOUNT=pdfcount;
                //     ShowPdfInfo();
                //     document.title=res.Title;
                // });
                document.title=res.Title;
                

                webapi.getRecordLessonInfo(this.thinkCurrentID).then(data=>{
                    
                    this.lessonID=data.LessonID;
                    webapi.getAttachmentDetail(data.AttachmentID).then(resAttachment=>
                    {
                        if(!resAttachment) return;
                        this.attachmentName=resAttachment.Title;
                        this.attachmentID=resAttachment.AttachmentID;
                        this.attachmentUrl=resAttachment.AttachmentUrl;
                        util.ConvertToNewUrl(resAttachment.AttachmentUrl,(newurl,success)=>{
                            whiteboard.ShowDocument($("#main"),newurl,1,(issuccess, pdfcount)=>{
                                PDFCOUNT=pdfcount;
                                ShowPdfInfo();
                            });
                        });
                    });
                    this.onThinkShow();

                });;

             });
        }

        Context = this;
        initializeControlWindow(this);
        this.joinMeeting();
    },    
    async PreLoadSyncAudio(res)
    {
        res=res || this.thinkInfo;
        if(!res) return;
        var isload =await this.$refs.syncplayer.preLoadThinkInfo(res.SoundtrackID);
        if(isload) return;
       if (res.NewAudioInfo && res.NewAudioInfo.AttachmentUrl) {
            var newurl = await util.ConvertToNewUrl(res.NewAudioInfo.AttachmentUrl);
            this.$refs.syncplayer.preLoadAudioSync(newurl);
            
            
        }
        else if(res.SelectedAudioInfo && res.SelectedAudioInfo.AttachmentUrl)
        {
            var newurl = await util.ConvertToNewUrl(res.SelectedAudioInfo.AttachmentUrl);
            this.$refs.syncplayer.preLoadAudioSync(newurl);
            
        }
        if(res.BackgroudMusicInfo && res.BackgroudMusicInfo.AttachmentUrl)
        {
            var newurl = await util.ConvertToNewUrl(res.BackgroudMusicInfo.AttachmentUrl);
            this.$refs.syncplayer.preLoadVoiceSync(newurl);
            
        }
    },
    onKeyDown4SyncView(evt){
        //console.log("onKeyDown4SyncView:"+evt.keyCode);
        if (evt.ctrlKey == true && evt.keyCode == 39) {
            //->|| evt.keyCode == 40
            LiveDocNextPage();
        } else if (evt.ctrlKey == true && evt.keyCode == 37) {
            //<-|| evt.keyCode == 38
            LiveDocPreviousPage();
        } else if (evt.keyCode == 187) {
            //+
            LiveDocZoomIn();
        } else if (evt.keyCode == 189) {
            //-
            LiveDocZoomOut();
        } else if (evt.keyCode == 40) {
            //down
            // if(gid("main").scrollTop==gid("main").scrollHeight-gid("main").clientHeight)
            // {
            //     LiveDocNextPage();
            // }
            // else
            {
                gid("main").scrollTop = Math.min(gid("main").scrollHeight-gid("main").clientHeight,gid("main").scrollTop +200);
            }
        } else if (evt.keyCode == 38) {
            //up
            // if(gid("main").scrollTop==0)
            // {
            //     LiveDocPreviousPage();
            // }
            // else
            {
                gid("main").scrollTop = Math.max(0,gid("main").scrollTop -200);          
            }              
        }
        else if (evt.keyCode == 39) {
            //->
            if(gid("main").scrollLeft==gid("main").scrollWidth-gid("main").clientWidth)
            {
                LiveDocNextPage();
            }
            else
            {
                gid("main").scrollLeft = Math.min(gid("main").scrollWidth-gid("main").clientWidth,gid("main").scrollLeft +200);
            }
        } else if (evt.keyCode == 37) {
            //<-
            if(gid("main").scrollLeft==0)
            {
                LiveDocPreviousPage();
            }
            else
            {
                gid("main").scrollLeft = Math.max(0,gid("main").scrollLeft -200);   
            }                     
        }
        return true;
    },
    onPreLoadAudioEnd(url)
    {
        //console.log("onPreLoadAudioEnd:"+url);
        this.isLoading=false;
    },
    joinMeeting(){
        //console.log("joinMeeting:");

        var meetingid="";
        if(this.getItemID()>0)
        {
            meetingid=this.getItemID()+","+auth.getUserID();
        }
        else
        {
            meetingid=this.getLessonID()+","+auth.getUserID();
        }

        var joinmeetingfun=()=>
        {
             websocket.joinmeeting(meetingid,"",2,0,jd => {
                //console.log(jd);
                websocket.setmeetingid(meetingid);
            });

        }

        if(websocket.isopen())
        {
           joinmeetingfun();
        }
        else
        {
            websocket.setopencallback(()=>{
               joinmeetingfun();
            });
        }        
    },
    CheckPageObject(pageid) {
        webapi.getAttachmentOrSyncPageObject(pageid,this.attachmentID)
            .then(infoarr => 
            {
                if (infoarr == null) return;
                for (var txt of infoarr) 
                {
                    this.onPlayBaseAction(txt);
                }
            });

    },
    ShowSyncObject(pageid,checkSyncTimeByPage=false) {
        //console.log("ShowSyncObject:"+pageid,checkSyncTimeByPage,this.showPageLine);
        //console.log("showPageLine:"+this.showPageLine);
        if(!this.showPageLine && checkSyncTimeByPage==true)
        {
            this.showPageLine=true;
            return;
        }
        if(this.isPause)
        {
            whiteboard.Clear();
            webapi.getPageObject(this.lessonID, this.getAttachmentItemID(this.attachmentID), pageid,this.isPause==false?0:1).then(infoarr => 
            {
                if (infoarr == null) return;
                for (var txt of infoarr) 
                {
                    this.onPlayBaseAction(txt);
                }
            });
            if(checkSyncTimeByPage)
            {
                webapi.getRecordLessonPageActionStartTime(this.thinkCurrentID,this.attachmentID,pageid).then(res=>{
                    this.$refs.syncplayer.GoToTime(res);
                });
            }

        }
        else
        {
            webapi.getPageObject(this.lessonID, this.getAttachmentItemID(this.attachmentID), pageid,this.isPlay==true && this.isPause==false?0:1).then(infoarr => 
            {
                if (infoarr == null) return;
                for (var txt of infoarr) 
                {
                    this.onPlayBaseAction(txt);
                }
            });
            if(this.isPlay && checkSyncTimeByPage)
            {
                webapi.getRecordLessonPageActionStartTime(this.thinkCurrentID,this.attachmentID,pageid).then(res=>{
                    this.$refs.syncplayer.GoToTime(res);
                });
            }
        }

    },
    getItemID()
    {
        return this.$route.params.shareid;
        if(this.$route.params.type && this.$route.params.type=="1")
        {
        return 0;
        }
        else if(this.$route.params.id)
        return this.$route.params.id;
        else
        return this.$route.query.id;
    },
    getLessonID()
    {
      if(this.$route.params.type && this.$route.params.type=="1")
      {
        return this.$route.params.id;;
      }
      return 0;
    },
    onThinkListPop(isshow){
        if($("#syncviewplaybtn").is(":visible"))
        {
            $("#syncviewplaybtn").hide();
        }
    },
    onThinkShow(){
       this.thinkList=[];
        //  if(this.thinkInfo)
        //  {
        //     this.thinkList.push({id:this.thinkInfo.SoundtrackID,title:this.thinkInfo.Title,user:this.thinkInfo.UserName,time: "("+util.FormatMediaTime(this.thinkInfo.Duration/1000,1)+")",face:this.thinkInfo.AvatarUrl});
        //  }
        webapi.getRecordAttachmentList(this.lessonID,this.getItemID(),(res)=>{
            if(!res) return;
            var event=res.RetData;
            for (let i = 0; i < event.length; i++) {
                let lineItem = event[i];
                if (lineItem.Status != 0) {
                    continue;
                }
                if (lineItem.AttachmentID && lineItem.AttachmentUrl) {
                    var showitem=new Object();
                    showitem.id=lineItem.AttachmentID;
                    showitem.itemid=lineItem.ItemID;
                    showitem.attachmentUrl=lineItem.AttachmentUrl;
                    showitem.title=lineItem.Title;
                    var ct = new Date();
                    ct.setTime(lineItem.CreatedDate);
                    let showCT = ct.Format("yyyy-MM-dd hh:mm:ss");
                    showitem.date=showCT;
                    this.thinkList.push(showitem);
                }
            }
        });   
    },
    thinkOnCreate(){
        //whiteboard.SetRecord(true);
        this.$refs.syncplayer.SetWebSocket(websocket);
        this.$refs.syncplayer.CreateSync(this.attachmentID);
    },
    thinkMenuClick(name, id) 
    {
        //alert(name + "," + id);
      if (name == "play") {
          this.playThinkAction(id);
      } else if (name == "share") {
          //to do
          //navigator.clipboard.writeText(this.invitelinkUrl);
        //   var selectfile=this.getSelectFile();
        //   if(selectfile==null)
        //   {
        //       return;
        //   }
        //   let shareFile={attachmentId:selectfile.atmid,attachmentName:selectfile.name,shareFile:selectfile};
        //   this.changeShareDoc(shareFile);
          webapi.GetShareDocumentKey(this.attachmentID,0,this.attachmentName).then(res=>{
              var url=location.origin.toLowerCase();
              url+="/sync/"+res;
              navigator.clipboard.writeText(url);
              alert("Share Url has been copied to clipboard!");
          });               

      } else if (name == "edit") {
          
          //to do
          //{ID:0,Title:"",EnableBackGround:false,EnableSelectVoice:false,EnableRecord:false,BackGroundItemID:0,BackGroundTitle:"",BackGroundTime:"",SelectVoiceItemID:0,SelectVoiceTitle:"",SelectVoiceTime:"",RecordVoiceItemID:0,
          //SyncStatus:0,SyncDate:""}
          this.$refs.syncplayer.EditSync(id,this.attachmentID);
      }else if (name == "delete") {
                    
            this.$Modal.confirm({
              render: (h) => {
                  return h('div', {
                      style: {
                              "font-size": '16px'
                          }
                      },"Are you sure you want to delete it?")
              },
              onOk:()=>{
                  //alert("OK")
                  //to do
                  webapi.DelSoundtrack(id).then((res)=>{
                      for(var i=0,j=this.thinkList.length;i<j;i++)
                      {
                          if(this.thinkList[i].id==id)
                          {
                              this.thinkList.splice(i, 1);
                              break;
                          }
                      }
                  });
              }
          });
      }
    },
    selectMoreThinkClick(evt){
      
    },
    onClickPlaySync(evt,id)
    {
        this.showAttachment(id,0,1);
    },
    getAttachmentItemID(attachmentID){
        for (var file of this.thinkList) {
            if ( file.id==attachmentID) {
                return file.itemid;
            }
        }
        return 0;
    },
    showAttachment(attachmentid=0,itemid=0,pageid=-1,callback)
    {
        //console.log("showAttachment:"+attachmentid);
        if(pageid==-1)
        {
            pageid=PageNumber;
        }
        var eventinfo = null;
        for (var file of this.thinkList) {
            if ((attachmentid==0 && file.itemid == itemid) || (itemid==0 && file.id==attachmentid)) {
                eventinfo = file;
            }
        }
        if (eventinfo == null) return;
        
        this.attachmentName=eventinfo.title;
        this.attachmentID=eventinfo.id;
        this.attachmentUrl=eventinfo.attachmentUrl;
        util.ConvertToNewUrl(eventinfo.attachmentUrl,(newurl,success)=>{
            whiteboard.ShowDocument($("#main"),newurl,pageid,(issuccess, pdfcount)=>{
                PDFCOUNT=pdfcount;
                ShowPdfInfo();
                this.ShowSyncObject(pageid,false);
                if(callback)callback();

            });
        });
        
    },
    showDiffAttachment(diff){
        var time=0;
        if(this.$refs.syncplayer)
        {
            time=this.$refs.syncplayer.GetCurrentPlayTime();
        }
        webapi.getRecordLessonSwitchDocumentInfo(this.getItemID(),this.attachmentID,time,diff==1?2:1).then(res=>{
            //console.log(res);
            if(res.AttachmentID!=0 && res.AttachmentID!=this.attachmentID)
            {
                this.showAttachment(res.AttachmentID,0,res.PageNumber);
                this.$refs.syncplayer.GoToTime(res.Time);
            }

        });
    },
    playShareSync(evt){        
        $("#syncviewplaybtn").hide();        
        this.$refs.syncplayer.playPreloadAudio();
        this.$refs.syncplayer.playPreloadVoice();
        this.playThinkAction(this.getItemID());
    },
    playThinkAction(id) {
        //this.showAdView=false;
        $("#main").show();
        //whiteboard.SetRecord(true);
        //console.log("playThinkAction");
        //this.ChangeStyle4Sync(true);
        //$("#main").find(">div.pageContainer[id!='pageContainer" +GetFixedPageNumber(PageNumber) + "']").remove();
        //whiteboard.Clear();// ClearPath();
        
        this.$refs.syncplayer.SetWebSocket(websocket);
        this.$refs.syncplayer.playThinkAction(id);
    },
    onPlayBaseAction(data){
       
       //console.log(data);
        if (typeof (data) == "string")
        {
            data = JSON.parse(data);
        }
        // if(data.page && data.page!=PageNumber)
        // {
        //     console.log(data);
        //     //whiteboard.Play({type:2,page:data.page});
        //     return;
        // }
        // {"roleType":"1","actionType":"8","meetingID":"35024","incidentID":"35024","itemId":"23299","attachmentUrl":"https://peertime-test.oss-cn-shanghai.aliyuncs.com/P49/Attachment/D22287/ad1d3ca2-d74e-4a7b-9183-f813b0345d6d_<5>.jpg"
        // ,"blankPageNumber":"","pageNumber":1,"isH5":false}

        if(data.actionType && data.actionType==19){
            this.onVideoPlayInfoChange(data);
        }
        else if(data.actionType && data.actionType==8)
        {
            //console.log(data);
            this.showAttachment(0,data.itemId,data.pageNumber);            
        }
        else
        {
            whiteboard.Play(data);
        }
    },
    onVideoPlayInfoChange(obj) {
        if (obj.stat == 2) {
            this.getVideoPlayer().Pause();
            $("#liveplayvideo").hide();
        }
        else if (obj.type == 0) {
            this.getVideoPlayer().Pause();
        }
        else if (obj.type == 1) {
            if (!$("#liveplayvideo").is(":visible")) {
                $("#liveplayvideo")
                    .css({
                        width: $("#main").width(),
                        height: $("#main").height(),
                        "z-index": 10002,
                        position: "absolute",
                        top: "0px",
                        left: "0px"
                    })
                    .show();

                if(this.isPlay)
                {
                    this.getVideoPlayer().setShowClose(false);
                    this.getVideoPlayer().setCanControl(false);
                }
                else
                {
                    this.getVideoPlayer().setShowClose(true);
                }
                this.getVideoPlayer().setVideoType(1);
                this.getVideoPlayer().ShowVideo({ id: obj.vid, url: obj.url });
            }
            this.getVideoPlayer().onVideoPlayInfoChange(obj, {
                url: obj.url
            });
            return;
        }       
    },
    playVideoTag(attachmentid) {
        webapi.getFavoriteAttachmentDetail(attachmentid).then(d => {
            if (d.FileType == 5) {                
                return;
            }
            $("#liveplayvideo").css({
                width: $("#main").width(),
                height: $("#main").height(),
                "z-index": 10002,
                position: "absolute",
                top: "0px",
                left: "0px"
            }).show();

            this.getVideoPlayer().setShowClose(true);
            this.getVideoPlayer().setVideoType(1);
            this.getVideoPlayer().ShowVideo({ id: d.AttachmentID, url: d.AttachmentUrl });
        });
    },
    getVideoPlayer() {
        return this.$refs.livevideoplayer;
    },
    onRecordSyncStart()
    {
        console.log("onRecordSyncStart");
        this.ChangeStyle4Sync(true);
    },
    onRecordSyncEnd(){
        console.log("onRecordSyncEnd");
        this.ChangeStyle4Sync(false);
        //whiteboard.SetRecord(false);
    },
    onPlaySyncStart(){
        //console.log("onPlaySyncStart");
        this.ChangeStyle4Sync(true);
        //$("#livePanelTopCtlWrap").hide();
        this.isPause=false;
        this.isPlay=true;
    },
    onPlaySyncGo(time){
        //console.log("onPlaySyncGo:"+time);
        //$("#livePanelTopCtlWrap").hide();
        this.isPause=false;
        this.ChangeStyle4Sync(true);
        // whiteboard.Clear();
        // this.ShowSyncObject(PageNumber,false);
        // webapi.GetSyncPageActionsByTime(this.thinkCurrentID,time).then(res=>{           
        //    for (var action of res.Actions) 
        //     {
        //         this.onPlayBaseAction(utf8to16(base64decode(action.Data)));
        //     }
        // });
    },
    onPlaySyncPause(){
        //console.log("onPlaySyncPause");
        //$("#livePanelTopCtlWrap").show();
        this.ChangeStyle4Sync(false);
        //this.isPause=true;
        //this.ShowSyncObject(PageNumber,false);
    },
    onPlaySyncTo(time,pause){
        console.log("onPlaySyncTo:"+time+",isPause:"+pause);
        webapi.getRecordLessonPageActions(this.thinkCurrentID,time).then(res=>{
           
           if(res.AttachmentID!=this.attachmentID)
           {
               this.showAttachment(res.AttachmentID,0,parseInt(res.PageNumber),()=>{
                   for (var action of res.Actions) 
                    {
                        this.onPlayBaseAction(utf8to16(base64decode(action.Data)));
                    }
               });
           }
           else if(res.PageNumber!=PageNumber)
           {
               //this.showPageLine=false;
                whiteboard.ToPage(res.PageNumber,(issuccess,pageno)=>{
                    if(pause)
                    {
                        this.ShowSyncObject(pageno,false);
                    }
                    else
                    {
                        for (var action of res.Actions) 
                        {
                            this.onPlayBaseAction(utf8to16(base64decode(action.Data)));
                        }
                    }
                });
           }
           else
           {
               for (var action of res.Actions) 
                {
                    this.onPlayBaseAction(utf8to16(base64decode(action.Data)));
                }
           }
        });
    },
    onPlaySyncEnd(isplayEnd){
        //console.log("onPlaySyncEnd");
        //$("#livePanelTopCtlWrap").show();
        this.isPause=false;
        this.isPlay=false;        
        if(isplayEnd)
        {
            // this.showAdView=true;
            // $("#main").hide();
            // document.title="More from KloudSync Team";
            this.ChangeStyle4Sync(false);
        }
        else{
            this.ChangeStyle4Sync(false);
        }
        whiteboard.Clear();
        //whiteboard.SetRecord(false);
        this.ShowSyncObject(PageNumber,false);
        //$("#syncviewplaybtn").show();
    },
    autoPausePlay(){
        if(!this.isPlay) return;
        this.$refs.syncplayer.autoPause();
    },
    autoGoPlay(){
        if(!this.isPlay) return;
        this.$refs.syncplayer.autoPlay();
    },
    onClickLayer(evt){
        //console.log("onClickLayer");
        this.ChangeStyle4Sync(false);
        //$("#livePanelTopCtlWrap").show();
    },
    ChangeStyle4Sync(isplay){
        //console.log("ChangeStyle4Sync:"+isplay);
        if(isplay)
        {
            $("#livePanelTopCtlWrap,#liveButtonPrevious,#liveButtonNext").hide();//
            //$("#syncviewplaybtn").show();
        }
        else{
            //$("#syncviewplaybtn").hide();
             $("#livePanelTopCtlWrap,#liveButtonPrevious,#liveButtonNext").show();//livePanelTopCtlWrap
        }
    },
    clickClose()
    {

    }
  },
  watch: {
      $route(to, from) {
        this.$router.go(0);
    }
  }
};
</script>