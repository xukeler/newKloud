<template>
  <div id="kloudsync-file-list">
    <div class="kloudsync-part-header">
      <div class="part-action-button">
        <!--<Button type="primary" icon="plus-round" @click="showUploadModal">Add</Button>-->
        <select-tags ref="selecetTaglist" @filterSelectTags="getFilterSelectTags" :teamId="teamId"></select-tags>
        <Input v-model="searchFile " placeholder="Search file..." class="search-file" icon="ios-search" @on-enter="handleSearch" @on-click="handleSearch"></Input>
        <div style="float:right;display: inline-block;margin-top:3px;">
          <Button type="primary" @click="handMultipleDeleteFile">{{$t('Base.Delete')}}</Button>
          <Button type="primary" @click="handleMovetoFile(null)">{{$t('KloudSyncDocuments.Move')}}</Button>
        </div>
        <upload-file-with-tag ref="uploadFileWithTag" :showUploadModalFlag="showUpModal" :schoolId="schoolId" :folderId="folderId" :spaceID="spaceID" :team-id="teamId" :canUpload="canUpload"></upload-file-with-tag>
        <div style="clear:both"></div>
      </div>
      <upload-file preid="live" ref="uploadfile"></upload-file>
    </div>
    <Table
      size="small"
      :no-data-text="$t('Common.NoData')"
      :stripe="true"
      :highlight-row="true"
      :data="filesData"
      :columns="filesColumn"
      :loading="loading"
      ref="doclist"
    ></Table>
    <div style="margin: 16px 0; overflow: hidden;  text-align: left;">
      <Select v-model="pageSize" style="width:150px;" @on-change="pageSizeChange">
        <Option :value="15">{{$t('Common.Page15')}}</Option>
        <Option :value="25">{{$t('Common.Page25')}}</Option>
        <Option :value="50">{{$t('Common.Page50')}}</Option>
        <Option :value="100">{{$t('Common.Page100')}}</Option>
      </Select>

      <div style="float: right; display: flex; align-items: center;">
        <div
          style="display: inline-block; margin-right: 1em;"
        >{{dataTotal}} {{$t("Files.TotalFiles")}}</div>
        <div style="display: inline-block">
          <Page
            :total="dataTotal"
            :current="pageIndex"
            :page-size="pageSize"
            @on-change="pageIndexChange"
          ></Page>
        </div>
      </div>
    </div>
    <Modal v-model="modalEditFile" :mask-closable="false" :title="$t('Files.EditFile')" width="500" style="z-index: 900; position: absolute;">
      <Form :model="editingFile" label-position="right" :label-width="120">
        <FormItem :label="$t('Files.EditTitle')">
          <Input v-model="editingFile.title" :placeholder="$t('KloudSyncDocuments.Name')" style="width: 300px"></Input>
        </FormItem>
        <FormItem :label="$t('EditFileWithTag.Tag')">
          <Edit-file-select-tags ref="EditFileSelectTags" @editSelectTags="getEditSelectTags" :editTagList="editingFile.tagList" :teamId="teamId"></Edit-file-select-tags>
        </FormItem>
        <FormItem :label="$t('Files.EditFileName')">
          <span>{{editingFile.file}}</span>
        </FormItem>
        <FormItem :label="$t('Files.UploadDate')">
          <span>{{editingFile.date}}</span>
        </FormItem>
      </Form>
      <div slot="close" style="display:none"></div>
      <div slot="footer">
        <Button type="primary" :loading="loading" @click="handleEditFileOK">{{$t('Base.OK')}}</Button>
        <Button @click="handleEditFileCancel">{{$t('Base.Cancel')}}</Button>
      </div>
    </Modal>
    <Modal v-model="moveFile.moveFileModal" :mask-closable="false" title="Move Document" width="500" style="z-index: 900; position: absolute;">
      <div style="width:100%">
        <p style="font-size:14px;font-weight:550">{{$t('KloudSyncDocuments.Current')}}</p>
        <p style="font-size:12px;margin-top:5px;color:#aeaeae"><span>{{teamNameOrspaceName.teamName}}</span> / <span>{{teamNameOrspaceName.spaceName}}</span></p>
      </div>
      <div style="width:100%;margin-top:30px;">
        <p style="font-size:14px;font-weight:550">{{$t('KloudSyncDocuments.SelectTeam')}}</p>
        <p style="margin-top:5px;">
          <Select v-model="moveFile.selecetTeamId" style="width:100%" @on-change="teamChange">
            <Option v-for="item in teamList" :value="item.ItemID" :key="item.ItemID">{{ item.Name }}</Option>
          </Select>
        </p>
      </div>
      <div style="width:100%;margin-top:30px;">
        <p style="font-size:14px;font-weight:550">{{$t('KloudSyncDocuments.SelectSpace')}}</p>
        <p style="margin-top:5px;">
          <Select v-model="moveFile.selecetSpaceId" style="width:100%">
            <Option v-for="item in spacelist" :value="item.ItemID" :key="item.ItemID">{{ item.Name }}</Option>
          </Select>
        </p>
      </div>
      <div slot="close" style="display:none"></div>
      <div slot="footer">
        <Button type="primary" :loading="loading" @click="handMoveOk">{{$t('Base.OK')}}</Button>
        <Button @click="handMoveCancel">{{$t('Base.Cancel')}}</Button>
      </div>
    </Modal>
    <Modal v-model="modalShareFile" class="kloudsync-file-share">
      <div slot="close" style="display:none"></div>
      <div slot="header" style="display:none"></div>
      <div slot="footer" style="display:none"></div>
      <div class="kloudsync-file-share-body">
        <div class="file-share-item" @click="handleShareCopy">
          <div class="file-share-icon" style="background: #2facf7">
            <img src="/static/images/file-share-link.svg" width="32" height="32" alt="">
          </div>
          <p style="margin-top: 16px;">{{$t('KloudSyncDocuments.CopyLink')}}</p>
        </div>
        <div class="file-share-item" @click="handleShareWechat">
          <div class="file-share-icon" style="background: #01d105">
            <img src="/static/images/file-share-wechat.svg" width="32" height="32" alt="">
          </div>
          <p style="margin-top: 16px;">{{$t('KloudSyncDocuments.Wechat')}}</p>
        </div>
        <div class="file-share-item" @click="handleShareMoment">
          <div class="file-share-icon" style="background: #7049ff">
            <img src="/static/images/file-share-moment.svg" width="32" height="32" alt="">
          </div>
          <p style="margin-top: 16px;">{{$t('KloudSyncDocuments.Moment')}}</p>
        </div>
        <div class="file-share-item" @click="handleShareContact">
          <div class="file-share-icon" style="background: #f5545b">
            <Icon type="android-people" size="32" color="#ffffff"></Icon>
          </div>
          <p style="margin-top: 16px;">{{$t('KloudSyncDocuments.Contact')}}</p>
        </div>
      </div>
    </Modal>
    <Modal v-model="modalViewFile" class="kloudsync-file-view" width="90%" :mask-closable="false" :title="modalViewFileTitle">
      <div slot="footer" style="display:none"></div>
      <div class="kloudsync-file-view-body">
        <iframe style="width:100%; height:100%;" frameborder="0" width="100%" height="100%" :src="modalViewFileUrl"></iframe>
      </div>
    </Modal>
    <Modal v-model="modalEditFileSync" :mask-closable="false" :title="$t('Files.EditFile')" width="500" style="z-index: 900; position: absolute;">
      <div class="kloudsync-docfiles-modal-file-sync">
        <div class="header">
          <Avatar :src="fileInfo.avatarUrl"></Avatar>
          <span style="font-weight: bold;color: #1c2438;margin-left:5px;">{{fileInfo.userName}}</span>
          <span style="margin-left:15px">{{fileInfo.date}}</span>
          <span style="margin-left:15px">{{fileInfo.duration}}</span>
        </div>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="table-info-space">
          <tr>
            <td>{{$t('KloudSyncDocuments.FileTitle')}}</td>
            <td>{{fileInfo.fileTitle}}</td>
          </tr>
          <tr>
            <td>{{$t('KloudSyncDocuments.SyncSubtitle')}}</td>
            <td><Input v-model="fileInfo.syncTitle" :placeholder="$t('KloudSyncDocuments.EnterSyncTitle')" style="width: 100%"></Input></td>
          </tr>
        </table>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="loading" @click="handleEditFileSyncOK">{{$t('Base.OK')}}</Button>
        <Button @click="handleEditFileSyncCancel">{{$t('Base.Cancel')}}</Button>
      </div>
    </Modal>
    <share-doc-modal></share-doc-modal>
    <error-modal ref="gErrorModal" :errorTitle="$t('Common.errorTitle')" :errorContent="$t('Common.errorContent')"></error-modal>
  </div>
</template>

<style lang="scss">
#kloudsync-file-list {
  .ivu-table-header tr th:last-child{
    .ivu-table-cell{
      padding-left: 0px;
      padding-right: 0px;
    }
  }
  .ivu-table-body tr td:last-child{
    .ivu-table-cell{
      padding-left: 0px;
      padding-right: 0px;
    }
  }
  .ivu-poptip-popper{
    position: absolute;
    z-index: 500;
  }
  .kloudsync-part-header {
    font-size: 24px;
    color: #1c2438;
    margin-bottom: 16px;
    vertical-align: middle;
    text-align: left;
  }
  .part-action-button {
    position: relative;
    .ivu-btn-text {
      padding: 3px;
    }
    #liveUploadVideoInput {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 136.5px;
      height: 32px;
      opacity: 0;
    }
    .search-file{
      width: 260px;
      margin-top: 5px;
    }
  }
  .table-action-icon {
    opacity: 0;
    cursor: pointer;
    margin-right: 1em;
  }

  tr:hover .table-action-icon,
  .ivu-table-row-highlight .table-action-icon {
    opacity: 1;
  }

  .ivu-table th {
    background-color: #495060;
    color: white;
  }

  .ivu-table-row-highlight td,
  .ivu-table-stripe
    .ivu-table-body
    tr.ivu-table-row-highlight:nth-child(2n)
    td {
    background-color: #dddee1;
  }
  .tags-item{
    display: inline-block;
    position: relative;
    padding: 0px 5px;
    height: 18px;
    margin-top: 3px;
    line-height: 18px;
    font-size: 13px;
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

.kloudsync-file-share {
  .kloudsync-file-share-body {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: stretch;
    text-align: center;
    padding: 20px 0;

    .file-share-item {
      width: 20%;
      display: inline-block;
      cursor: pointer;
    }

    .file-share-icon {
      width: 56px;
      height: 56px;
      display: inline-block;
      padding: 12px;
      border-radius: 50%;
    }
  }

  .ivu-modal{
    top: calc(50% - 80px);
  }

  .ivu-modal-header, .ivu-modal-close, .ivu-modal-footer {
    display: none;
  }
}
.kloudsync-file-view
{
  .kloudsync-file-view-body
  {
    width: 100%;
    height: 100%;
  }
  .ivu-modal
  {
    height: 90%;
    top:5%;
  }
  .ivu-modal-content
  {
    height: 100%;
  }
  .ivu-modal-header
  {
    border-bottom: 0px;
    padding: 10px 16px 0px 16px;
  }
  .ivu-modal-body
  {
    padding: 6px 6px 6px 6px;
    height: calc(100% - 30px);
  }
  .ivu-modal-footer {
    display: none;
  }
}
.kloudsync-docfiles-modal-file-sync{
  padding: 20px;
  font-size: 14px;
  .header{
    text-align: left;
    color:#80848f;
    padding-bottom: 10px;
  }
  .table-info-space tr td:nth-child(1){
    text-align: right;
    width: 30%;
    padding-right: 10px;
    height: 50px;
    font-weight: bold;
    color: #1c2438;
  }
  .table-info-space tr td:nth-child(2){
    text-align: left;
    width: 70%;
  }
}
</style>

<script>
import auth from "../../authenticator";
import UploadFile from "../livelesson/UploadFile";
import SelectTags from "../kloudsync/SelectTags";
import EditFileSelectTags from "../kloudsync/EditFileSelectTags";
import UploadFileWithTag from "../kloudsync/UploadFileWithTag";
import webapi from "../../webapi/webapi.js";
import util from "../../common/util.js";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import ShareDocModal from "./ShareDocModal.vue";

export default {
  components: {
    UploadFile,
    SelectTags,
    UploadFileWithTag,
    EditFileSelectTags,
    ShareDocModal,
  },
  props: {
    schoolId: {
      type: Number,
      required: true
    },
    folderId: {
      type: Number,
      default: -1
    },
    canUpload:{
      type:Boolean,
      default: false,
    },
    spaceID:{
      type: Number,
      default: 0
    },
    teamId:{
      type: Number,
      default: -1
    },
    teamNameOrspaceName:{
      teamName:{
        type:String,
        default: "",
      },
      spaceName:{
        type:String,
        default: "",
      },
    }
  },
  data() {
    return {
      filterSelectTagsIDStr:"",
      selectEditTagsIDStr:'',
      showUpModal:false,
      filesId: 0,
      loading: false,
      dataTotal: 0,
      pageSize: 15,
      pageIndex: 1,
      uploadAction: GetAPIUrl(),
      uploadHeaders: {},
      fileUploading: false,
      uploadPercentage: 0,
      // uploadTimer: null,
      filesData: [],
      filesColumn: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: this.$t("Files.Title"),
          key: "title",
          minWidth:140,
          sortable: true,
          align:"left",
          renderHeader: (h, params) => {
            return h("span",this.$t("Files.Title"));
          }
        },
        {
          title: this.$t("Files.FileName"),
          key: "file",
          maxWidth:300,
          minWidth:140,
          align:"left",
          sortable: true,
          renderHeader: (h, params) => {
            return h("span",this.$t("Files.FileName"));
          },
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.handleOpenFile(params);
                  }
                },
                // attrs: {
                //   title: 'download "' + params.row.file + '"',
                //   href: params.row.download,
                //   download: "download",
                //   target:'_blank'
                // }
              },
              params.row.file
            );
          }
        },
        {
          title: this.$t("Files.Date"),
          key: "date",
          sortable: true,
          maxWidth:260,
          minWidth:100,
          align:"left",
          renderHeader: (h, params) => {
            return h("span",this.$t("Files.Date"));
          },
        },
        {
          title: this.$t("Files.Sync"),
          key: 'syncs',
          maxWidth:200,
          minWidth:110,
          sortable: true,
          align:"left",
          renderHeader:(h,params)=>{
            return h("span",{style:{display:'inline-block'}},[
                h('span',{
                  class:'icon icon-yinxiang',
                  style:{
                    marginRight: '3px',
                    color:"rgba(50,175,163)"
                  }
                }),
                h('span',this.$t("Files.Sync"))
              ]
            )
          },
          render:(h,params)=>{
            if(params.row.syncs==0){
              return h('a',params.row.syncs)
            }else{
              return  h('Poptip',{props:{trigger:'click',placement:"bottom"},
                on:{
                  'on-popper-show':()=>{
                    this.openSyncList(params);
                  }
                }
              },
              [
                h('a',{style:{paddingRight:'50px'}},params.row.syncs),
                h('div',{slot:"content",style:{maxHeight:"50vh",overflow:"auto"}},
                  this.syncsList.map(item=>{
                    return h('div',{style:{padding:"5px 15px 5px 5px",borderBottom:'1px solid #ddd',cursor: "pointer"}},[
                      h('p',{style:{marginBottom:"5px",fontWeight: "bold",fontSize: "14px"},
                        on:{
                            "click":()=>{
                              this.playSync(item)
                            }
                        }
                      },item.title),
                      h('p',[
                        h('span',{style:{display:'inline-block'},
                          on:{
                            "click":()=>{
                              this.playSync(item)
                            }
                          }
                        },[
                          h('Avatar',{props:{src:item.avatarUrl}}),
                          h('span',{style:{marginLeft:"5px",display:'inline-block',width: '80px',whiteSpace: 'nowrap',overflow: 'hidden',textOverflow: 'ellipsis',marginBottom:'-5px'}},item.detail.UserName),
                          h('span',{style:{marginLeft:"15px",display:'inline-block'}},item.date),
                          h('span',{style:{marginLeft:"30px",display:'inline-block'}},item.duration),
                        ]),
                        h("Dropdown",{props:{placement:"bottom"},
                          on:{
                            "on-click":($event)=>{
                              event.stopPropagation();
                              this.handleSyncs($event,item)
                            }
                        }
                        },[
                          h('span',{style:{display:'inline-block',cursor: "pointer",marginTop:"7px",marginLeft:"30px",marginBottom:'-7px'}},[h('Icon', {props: {type: 'more', size: '16', color: 'black'}})]),
                          h('DropdownMenu',{slot:"list"},[
                            h("DropdownItem",{props: {name:'play'}},[
                              h("span",{style:{color:'#2b85e4'}},this.$t('KloudSyncDocuments.Play'))
                            ]),
                            h("DropdownItem",{props: {name:'share'}},[
                              h("span",this.$t('KloudSyncDocuments.Share'))
                            ]),
                            h("DropdownItem",{props: {name:'copy-share-link'}},[
                              h("span",this.$t('KloudSyncDocuments.CopyShareLink'))
                            ]),
                            h("DropdownItem",{props: {name:'edit-name'}},[
                              h("span",this.$t('KloudSyncDocuments.EditName'))
                            ]),
                            h("DropdownItem",{props: {name:'delete'}},[
                              h("span",this.$t('KloudSyncDocuments.Delete'))
                            ])
                          ])
                        ])
                      ]),
                    ])
                  })
                )
              ])
            }
          }
        },
        {
          title: this.$t('Files.Tag'),
          key: "tagList",
          maxWidth: 500,
          minWidth:120,
          align:"left",
          renderHeader: (h, params) => {
            return h("span",this.$t('Files.Tag'));
          },
          render:(h,params)=>{
            if(params.row.tagList.length==0){
              return;
            }else{
              let tagArrayList=params.row.tagList;
              let left="0px";
              return h("div",tagArrayList.map((item,index)=>{
                if(index!=0){
                  left="15px";
                }
                return  h("div",{class:"tags-item",style:{backgroundColor:this.colorSelectNumber(item.ColorID),marginLeft:left}},
                        [h("div",{class:'left-triangle',style:{borderRightColor:this.colorSelectNumber(item.ColorID)}}),h("span",{style:'display:inline-block;'},item.TagName),
                        ])}));
            }
          }
        },
        {
          title: " ",
          key: "action",
          width: 80,
          minWidth:40,
          align:"center",
          renderHeader:(h,params)=>{
            return h("span",{domProps:{title:this.$t('KloudSyncDocLeftPart.MoreAction')},style:{display:'inline-block',width:"80px",cursor:'pointer'}},[
                h('Icon', {props: {type: 'help-buoy', size: '16',color:"white"}}),
              ]
            )
          },
          render: (h, params) => {
            return h("Dropdown",{props:{trigger:"hover"},class: 'table-action-icon'},
            [h("span",{style:{display:"inline-block",width:"80px"}},[h('Icon', {props: {type: 'more', size: '16', color: 'black'}})]),h('DropdownMenu',{slot:"list"},
            [h("div",{props:{name:"open"},style:{padding:'3px 0px 3px 20px',textAlign:'left'},
            on:{
              click: () => {
                this.handleOpenFile(params);
              }
            }},[h('Icon', {props: {type: 'eye', size: '16'}}),h("span",{style:'display:inline-block;margin-left:5px'},this.$t('KloudSyncDocuments.Open'))]),

              h("div",{props:{name:"view"},style:{padding:'3px 0px 3px 20px',textAlign:'left'},
              on:{
                click: () => {
                  this.handleViewFile(params);
                }
              }
              },[h('Icon', {props: {type: 'android-open', size: '16'}}),h("span",{style:'display:inline-block;margin-left:5px'},this.$t('KloudSyncDocuments.View'))]),

              h("div",{props:{name:"move"},style:{padding:'3px 0px 3px 20px',textAlign:'left'},
              on:{
                click: () => {
                  this.handleMovetoFile(params);
                }
              }
              },[h('Icon', {props: {type: 'android-exit', size: '16'}}),h("span",{style:'display:inline-block;margin-left:5px'},this.$t('KloudSyncDocuments.Move'))]),

            h("div",{props:{name:"share"},style:{padding:'3px 0px 3px 20px',textAlign:'left'},
            on:{
              click: () => {
                this.handleShareFile(params);
              }
            }},[h('Icon', {props: {type: 'android-share-alt', size: '16'}}),h("span",{style:'display:inline-block;margin-left:5px'},this.$t('KloudSyncDocuments.Share'))]),

              h("div",{props:{name:"edit"},style:{padding:'3px 0px 3px 20px',textAlign:'left'},
              on:{
                click: () => {
                  this.handleEditFile(params);
                }
              }
              },[h('Icon', {props: {type: 'ios-compose-outline', size: '18'}}),h("span",{style:'display:inline-block;margin-left:5px'},this.$t('KloudSyncDocuments.Edit'))]),

              h("div",{props:{name:"Download"},style:{padding:'3px 0px 3px 20px',textAlign:'left'},
              on:{
                click: () => {
                  this.handleDownloadFile(params);
                }
              }},[h('Icon', {props: {type: 'arrow-down-c', size: '18'}}),h("span",{style:'display:inline-block;margin-left:5px'},this.$t('Files.Download'))]),

              h("div",{props:{name:"delete"},style:{padding:'3px 0px 3px 20px',textAlign:'left'},
              on:{
                click: () => {
                  this.handleDeleteFile(params);
                }
              }},[h('Icon', {props: {type: 'ios-trash-outline', size: '18'}}),h("span",{style:'display:inline-block;margin-left:5px'},this.$t('KloudSyncDocuments.Delete'))]),

              ]
            )]);
          }
        }
      ],
      modalEditFile: false,
      editingFile: { title: "", file: "", date: "" ,tagList:[]},
      moveFile:{
        moveFileModal:false,
        selecetSpaceId:0,
        selecetTeamId:-1,
        fileId:0,
      },
      spacelist:[],
      teamList:[],
      modalShareFile: false,
      modalViewFile:false,
      modalViewFileUrl:"",
      modalViewFileTitle:"",
      shareFileDetail: null,
      syncsList:[],
      modalEditFileSync:false,
      fileInfo:{
        fileTitle:"",
        syncTitle:"",
        avatarUrl:"",
        date:"",
        duration:"",
        userName:"",
        soundtrackID:-1,
      },
      searchFile:'',
    };
  },
  watch: {
    modalViewFile(val){
      if(val==false){
        this.modalViewFileUrl = "";
      }
    },
  },
  mounted() {},
  methods: {
    handleSyncs(name,item){
      switch (name) {
        case "play":
          this.playSync(item);
          break;
        case "share":
          this.shareSync(item);
          break;
        case "copy-share-link":
          this.shareUrl(item);
          break;
        case "edit-name":
          this.showEditFileSyncModal(item);
          break;
        case "delete":
          this.delSync(item);
          break;
        default:
          break;
      }
    },
    playSync(item){
      let id= item.id;
      let url = location.origin.toLowerCase();
      url+="/sync/"+id;
      this.modalViewFile=true;
      this.modalViewFileUrl=url;
      this.modalViewFileTitle=item.docDetail.Title;
    },
    shareSync(item){
      let shareFile={attachmentId:item.docDetail.AttachmentID,attachmentName:item.docDetail.Title,attachmentUrl:item.docDetail.AttachmentUrl};
      this.changeKloudsyncShareDoc(shareFile);
    },
    shareUrl(item){
      let id=item.id;
      var url=location.origin.toLowerCase();
      url+="/sync/"+id;
        navigator.clipboard.writeText(url).then(()=>{
            this.$Message.info({content: this.$t("Live.CopySyncUrlSuccess"), duration: 3});
      },()=>{
          this.$Message.error({content: this.$t("Live.CopySyncUrlFailed"+"\n\n"+url), duration: 0,closable: true});
      });
    },
    delSync(item){
      this.$Modal.confirm({
        render: (h) => {
            return h('div', {
                style: {
                        "font-size": '16px'
                    }
                },this.$t('KloudSyncDocuments.AreYouSureDeleteIt'))
        },
        onOk:()=>{
            webapi.DelSoundtrack(item.id).then((res)=>{
                for(var i=0,j=this.syncsList.length;i<j;i++)
                {
                    if(this.syncsList[i].id==item.id)
                    {
                        this.syncsList.splice(i, 1);
                        break;
                    }
                }
            });
        }
      });
    },
    showEditFileSyncModal(item){
      this.modalEditFileSync=true;
      this.fileInfo.fileTitle=item.fileTitle;
      this.fileInfo.syncTitle=item.title;
      this.fileInfo.avatarUrl=item.avatarUrl;
      this.fileInfo.date=item.date;
      this.fileInfo.duration=item.duration;
      this.fileInfo.userName=item.detail.UserName;
      this.fileInfo.soundtrackID=item.id;
    },
    handleEditFileSyncOK(){
      let url=GetAPIUrl()+"Soundtrack/UpdateTitleAndVisibility";
      let data={
        SoundtrackID:this.fileInfo.soundtrackID,
        Title:this.fileInfo.syncTitle,
        IsPublic:1   //1为公开的音响
      };
      let self=this; 
      $.ajax({
          type: "POST",
          url: url,
          data:data,
          beforeSend: function(request) {
            request.setRequestHeader("UserToken", auth.getUserToken());
          },
          success: function(result) {
            if (result.RetCode === 0) {
              for(let item of self.syncsList){
                if(self.fileInfo.soundtrackID==item.id){
                  self.$set(item,'title',self.fileInfo.syncTitle)
                  break;
                }
              }
              self.handleEditFileSyncCancel();
            }
          },
        });
    },
    handleEditFileSyncCancel(){
      this.modalEditFileSync=false;
      this.fileInfo.fileTitle="";
      this.fileInfo.syncTitle="";
      this.fileInfo.avatarUrl="";
      this.fileInfo.date="";
      this.fileInfo.duration="";
      this.fileInfo.userName="";
      this.fileInfo.soundtrackID=-1;
    },
    openSyncList(params){
      this.syncsList=[];
      let url=GetAPIUrl()+"Soundtrack/List?attachmentID="+params.row.detail.AttachmentID+"&isPublic=0" //isPublic:0 获取所有的音响
      let self=this;
      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            self.syncsList=self._synclist(result.RetData,params.row);
          }
        },
      });
    },
    _synclist: function(list,fileDetail) {
      let syncsList=[];
      for(let attachment of list){
        let date = new Date(parseInt(attachment.CreatedDate));
        let item={
          id: attachment.SoundtrackID,
          userId:attachment.UserID,
          avatarUrl:attachment.AvatarUrl!=""?attachment.AvatarUrl:"../../../static/images/user.svg",
          title: attachment.Title,
          date: date.Format("yyyy-MM-dd hh:mm:ss"),
          duration: attachment.Duration,
          detail: attachment,
          fileTitle:fileDetail.title,
          docDetail:fileDetail.detail
        }
        syncsList.push(item);
      }
      return syncsList;
    },
    handleShareFile(params){
      this.modalShareFile = true;
      this.shareFileDetail = params.row.detail;
    },
    handleShareCopy() {
      this.modalShareFile = false;
      var url=location.origin.toLowerCase();
      url+="/document/"+this.shareFileDetail.ItemID;
      navigator.clipboard.writeText(url).then(()=>{
        this.$Message.info({content: this.$t("Live.CopySyncUrlSuccess"), duration: 3});
      },()=>{
        this.$Message.error({content: this.$t("Live.CopySyncUrlFailed"), duration: 0,closable: true});
      });
    },
    handleShareWechat() {
      this.modalShareFile = false;
    },
    handleShareMoment() {
      this.modalShareFile = false;
    },
    handleShareContact() {
      this.modalShareFile = false;
    },
    handMoveCancel(){
      this.moveFile={moveFileModal:false,selecetSpaceId:0,selecetTeamId:-1,fileId:0}
    },
    handMoveOk(){
      if(this.moveFile.selecetTeamId===-1){
        this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t('KloudSyncDocuments.PleaseSelectTeam'), top: 24,duration: 4, left:true });
        return;
      }else if(this.moveFile.selecetSpaceId===0){
        this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t('KloudSyncDocuments.PleaseSelectASpace'), top: 24,duration: 4, left:true });
        return;
      }
      
      let selectIdStr = "";
      if(!this.moveFile.fileId){//支持多选
        let selection = this.$refs.doclist.getSelection();
        let selectIdArray = [];
        for (let i = 0; i < selection.length; i++) {
          selectIdArray.push(selection[i].id)
        }
        selectIdStr = selectIdArray.join(",");
      }else{//表格action单选
        selectIdStr = this.moveFile.fileId;
      }
      

      let url=GetAPIUrl()+"SpaceAttachment/SwitchSpace?itemIDs="+selectIdStr+"&spaceID="+this.moveFile.selecetSpaceId;
      this._postData(url,null,null,
        result => {
          this.$Message.info({content: this.$t('KloudSyncDocuments.FileMoveSuccessfully'),duration: 3});
          this.moveFile={moveFileModal:false,selecetSpaceId:0,selecetTeamId:-1,fileId:0};
          this.refresh();
        },
        null
      );
    },
    handleMovetoFile(params){
      let fileID;
      if(params){
        fileID = params.row.id;
      }else{//多选move
        fileID = 0;
        let selection = this.$refs.doclist.getSelection();
        let selectIdArray = [];

        if(selection.length ==0){
          this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t('KloudSyncDocuments.PleaseSelectDoc'), top: 24,duration: 4, left:true });
          return;
        }
      }
      this.moveFile={moveFileModal:true,selecetSpaceId:0,selecetTeamId:-1,fileId:fileID};
      this.initialTeamData();
    },
    initialTeamData(){
      let self = this;
      let url = GetAPIUrl() + "TeamSpace/List?type=1";//type为1 代表team 2 代表space
      url += "&companyID=" + this.schoolId;
      this._getData(url, null, data => {
        this.teamList=data;
      })
    },
    teamChange(){
      this.$set(this.moveFile,"selecetSpaceId",0);
      this.initialSpaceData();
    },
    initialSpaceData(){
      if(this.moveFile.selecetTeamId && this.moveFile.selecetTeamId!=-1){
        let url = GetAPIUrl() + "TeamSpace/List?type=2";//type为1 代表team 2 代表space
        url += "&companyID=" + this.schoolId;
        url += "&parentID=" + this.moveFile.selecetTeamId;
        this._getData(url, null, data => {
         this.spacelist=data;
        }, null);
      }
    },
    updateFileTag(fileId){
      let self=this;
      //上传title和tag type -- 附件类型：FavoriteAttachment = 1, LessonAttachment = 2, CourseAttachment = 3, SpaceAttachment = 4, TopicAttachment = 5
      self.uploadType=4;
      let url=GetAPIUrl() + "AttachmentTag/UpdateTags?itemID="+fileId+"&tagIDs="+self.selectEditTagsIDStr+"&type="+self.uploadType;
      self._postData(url, null, null, (result)=>{
        this.$nextTick(()=>{
          self.$refs.EditFileSelectTags.editFileWithTag();
          self.refresh();
        })
      }, null);
    },
    getEditSelectTags(val){
      let str="";
      if(val){
        for(let item of val){
          str+=item.TagID+",";
        }
        this.selectEditTagsIDStr=str.substring(0,str.length-1);
      }
    },
    getFilterSelectTags(val){
      let str2="";
      if(val){
        for(let item of val){
          str2+=item.TagID+",";
        }
        this.filterSelectTagsIDStr=str2.substring(0,str2.length-1);
      }
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
    showUploadModal(){
      this.showUpModal=true;
      this.$nextTick(()=>{
        this.$refs.uploadFileWithTag.initial();
        this.$refs.uploadFileWithTag.initialSpaceData();
      })
    },
    handleEditFileCancel() {
      this.modalEditFile = false;
      this.$nextTick(()=>{
        this.$refs.EditFileSelectTags.editFileWithTag();
      })
    },
    handleViewFile(params){
      //console.log("handleOpenFile:"+params);
      if(params.row.detail.FileType==5 || params.row.detail.FileType==4)
      {
          this.$Message.error({content: this.$t('KloudSyncDocuments.CantView'),duration: 0,closable: true});
          return;
      }
      var url=location.origin.toLowerCase();
      url+="/document/"+params.row.detail.ItemID+"?t="+Math.random();
      this.modalViewFile=true;
      this.modalViewFileUrl=url;
      this.modalViewFileTitle=params.row.detail.Title;
      //this.$router.push({ name: "document", params: { id: params.row.detail.ItemID } });
      //return;
    },
    handleOpenFile(params) {
      //console.log(params.row.detail);
      if(params.row.detail.FileType==5 || params.row.detail.FileType==4)
      {
          this.$Message.error({content: this.$t('KloudSyncDocuments.CantView'),duration: 0,closable: true});
          return;
      }
      // this.$router.push({ name: "view", params: { id: params.row.detail.ItemID,type:2 } });
      // return;      
      // this.$router.push({ name: "docview", params: { id: params.row.detail.ItemID } });
      // return;
      
      webapi.AddTempLessonWithOriginalDoc(params.row.detail.AttachmentID,params.row.detail.Title).then(res=>{
          //res.RetData
          this.$router.push({ name: "docview", params: { id: res.RetData.ItemID } });
      });

    },
    pageIndexChange(page) {
      this.pageIndex = page;
      this.readData();
    },
    pageSizeChange(data) {
      this.pageIndex = 1;
      this.readData();
    },
    //切换team和space时
    initialize() {
      this.$refs.selecetTaglist.clearChooseTag();
      this.reset();
      this.$nextTick(()=>{
        this.readData();
      })
    },
    reset() {
      this.pageIndex = 1;
      this.filterSelectTagsIDStr = "";
      this.searchFile = "";
    },
    //编辑、删除时调用
    refresh() {
      this.readData();
    },
    //切换筛选条件时调用
    selectedRefresh(){
      this.pageIndex = 1;
      this.readData();
    },
    handleSearch(){
      this.pageIndex = 1;
      this.readData();
    },
    readData() {
      let self = this;
      let url;
      
      if(this.canUpload && this.spaceID!=-2){//space获取列表,this.spaceID=-2是Unassigned space数据;canUpload是否是space的标志
        url = GetAPIUrl() + "SpaceAttachment/List?spaceID="+this.spaceID+"&type=0";
      }else if(!this.canUpload && this.spaceID!=-2){//team获取文件列表,space获取列表,this.spaceID=-2是Unassigned space数据;canUpload是否是space的标志
        url = GetAPIUrl() + "SpaceAttachment/TeamDocumentList?companyID="+this.schoolId+"&teamID="+ this.teamId+"&type=0"//type 1普通  2 Video 0是全部
      }else{//Unassigned space数据
        url = GetAPIUrl() + "SpaceAttachment/UnAssignedDocumentList?companyID="+this.schoolId+"&type=0"//type 1普通  2 Video 0是全部
      }

      if(this.filterSelectTagsIDStr.length!=0){
        url += "&tagIDs=" + this.filterSelectTagsIDStr;
      }
      url += "&pageIndex=" + (this.pageIndex - 1);
      url += "&pageSize=" + this.pageSize;

      if(this.searchFile){
        url += "&searchText="+encodeURIComponent(base64encode(utf16to8(trimStr(this.searchFile))));
      }
      
      this._getData(url,() => {
          self.filesData = [];
        },data => {
          self.filesData=[];
          self.dataTotal = data.TotalCount;
          let list = data.DocumentList;
          for (let i = 0; i < list.length; i++) {
            let attachment = list[i];
            let file = self._attachment2File(attachment);
            self.filesData.push(file);
          }
        },
        null
      );
    },
    handleEditFile(params) {
      this.editingFile.title = params.row.title;
      this.editingFile.file = params.row.title;
      this.editingFile.date = params.row.date;
      this.editingFile.tagList = params.row.tagList;
      
      this.filesId = params.row.id;
      this.modalEditFile = true;
      
      this.$nextTick(()=>{
        this.$refs.EditFileSelectTags.initEditSelectTags();
      })
    },
    handleEditFileOK() {
      let self = this;
      let editTitle = encodeURIComponent(
        base64encode(utf16to8(this.editingFile.title))
      );
      if (this.filesId != 0) {
        let url = GetAPIUrl() + "SpaceAttachment/RenameAttachment";
        url += "?itemID=" + this.filesId
        url += "&title=" + editTitle;
        this._postData(url,{},() => {self.loading = false;},
          result => {
            self.modalEditFile = false;
            self.updateFileTag(self.filesId);
          },
          null
        );
      }
    },
    handleMoveFile(params) {
      let self = this;

      this.$Modal.confirm({
        title: "Copy",
        content: "Do you want to copy this file to your personal files?",
        okText: "Copy",
        cancelText: "Cancel",
        onOk: () => {
          let url = GetAPIUrl() + "FavoriteAttachment/CopyAttachmentsBetweenTeacherAndSchool";
          url += "?attachmentIDs=" + params.row.id;

          self._postData(
            url,
            {},
            () => {
              self.loading = false;
            },
            result => {
              self.$Message.success({content: "File copied.",duration: 3});
            },
            null
          );
        }
      });
    },
    handMultipleDeleteFile(){
      let self = this;
      let selection = this.$refs.doclist.getSelection();
      let selectIdArray = [];

      if(selection.length ==0){
        this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t('KloudSyncDocuments.PleaseSelectDoc'), top: 24,duration: 4, left:true });
        return;
      }

      for (let i = 0; i < selection.length; i++) {
        selectIdArray.push(selection[i].id)
      }
      let selectIdStr = selectIdArray.join(",");

      this.$Modal.confirm({
        title: self.$t('KloudSyncDocuments.ModalDeleteDocument'),
        content: self.$t('KloudSyncDocuments.ModalDeleteDocumentContent'),
        okText: self.$t("Common.Delete"),
        cancelText: self.$t("Base.Cancel"),
        onOk: () => {
          let url = GetAPIUrl() + "SpaceAttachment/RemoveDocument?";
          url += "itemIDs=" + selectIdStr;

          self._deleteData(url, null, data => {
            for(let i=0; i<self.filesData.length;i++){
              let flag = false;
              let currentItem = self.filesData[i].id;
              for(let j=0;j<selectIdArray.length;j++){
                if(selectIdArray[j]==currentItem){
                  flag = true;
                  break;
                }
              }
              if(flag){
                self.filesData.splice(i,1);
                i=-1;
              }
            }
            self.dataTotal =  self.dataTotal-selectIdArray.length;

            
            if(self.filesData.length == 0){//当前页数据被删光
              self.pageIndex = self.pageIndex -1;
              self.dataTotal =  self.dataTotal-selectIdArray.length;
              if(self.pageIndex==0){
                self.pageIndex = 1;
                self.refresh();
                return;
              }
              self.refresh();
            }
          });
        }
      });
    },
    handleDeleteFile(params) {
      let self = this;

      this.$Modal.confirm({
        title: self.$t('KloudSyncDocuments.ModalDeleteDocument'),
        content: self.$t('KloudSyncDocuments.ModalDeleteDocumentContent'),
        okText: self.$t("Common.Delete"),
        cancelText: self.$t("Base.Cancel"),
        onOk: () => {
          let url = GetAPIUrl() + "SpaceAttachment/RemoveDocument?";
          url += "itemIDs=" + params.row.id;

          self._deleteData(url, null, data => {
            self.filesData.splice(params.index, 1);
            self.dataTotal =  self.dataTotal-1;
            if(self.filesData.length == 0){
              self.pageIndex = self.pageIndex -1;
              if(self.pageIndex==0){
                self.pageIndex = 1;
                self.refresh();
                return;
              }
              self.refresh();
            }
          });
        }
      });
    },
    async handleDownloadFile(params){
      let result = await util.getSourceFileUrl(params.row.detail.SourceFileUrl);
      if(result){
        window.open(result, '_blank');
      }else{
        this.$refs.gErrorModal.initial();
      }
    },
    _attachment2File: function(attachment) {
      let date = new Date(parseInt(attachment.CreatedDate));

      return {
        id: attachment.ItemID,
        title: attachment.Title,
        tagList:attachment.TagList,
        file: attachment.Title,
        date: date.Format("yyyy-MM-dd hh:mm:ss"),
        syncs: attachment.SyncCount,
        download: attachment.SourceFileUrl,
        detail: attachment
      };
    },
    _getData(url, before, success, error) {
      this.loading = true;
      this.$Loading.start();

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
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    },
    _postData(url, data, before, success, error) {
      this.loading = true;
      this.$Loading.start();

      if (before && typeof before === "function") {
        before();
      }

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
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    },
    _deleteData(url, before, success, error) {
      this.loading = true;
      this.$Loading.start();

      if (before && typeof before === "function") {
        before();
      }

      let self = this;
      $.ajax({
        type: "DELETE",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    },
    ...mapMutations([ "changeKloudsyncShareDoc",])
  }
};
</script>
