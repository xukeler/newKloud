<template>
  <div id="syncroom" class="syncroom">
    <div id="previewHolderOuter" class="previewHolderOuter2">
      <div v-if="syncRoomType == 2">
        <topic-chat ref="inTopicChatMeeting"></topic-chat>
        <div style="width:100%;height:5px;border-top:1px solid #e1e1e1;"></div>
      </div>
      <div id="main" class="maincontainer" v-show="!showHtmlAll&&!showHtml&&syncRoomType != 2"></div>
      <OneCollectData v-show="showHtml" ref="collectdata"></OneCollectData>
      <AllCollectData v-show="showHtmlAll" ref="collectdataAll"></AllCollectData>
      <div
        id="liveplayvideo"
        class="maincontainer"
        style="display:none; background-color:black; overflow:hidden;"
      >
        <video-player
          ref="livevideoplayer"
          @videoOnClose="videoOnClose"
          @videoOnPause="videoOnPause"
          @videoOnPlaying="videoOnPlaying"
          @videoOnPlay="videoOnPlay"
        ></video-player>
      </div>
      <div id="liveToolbarWrap" class="liveToolbar" v-show="syncRoomType != 2">
        <section id="liveToolbar">
          <section class="liveToolbar-zoom">
            <span id="livePageNumber" class="toolbar-label"></span>
            <span id="livePageCount" class="toolbar-label" style="margin-right:14px"></span>
            <span
              class="icon icon-zoomin"
              id="liveButtonZoomIn"
              :title="$t('Live.ZoomIn')"
              style="position: relative;top: -4px;"
            ></span>
            <select
              id="liveSelectScale"
              title="Zoom"
              style="background-color:transparent; border:0px; font-size: 12px; color:#333;-webkit-appearance:none;-moz-appearance:none;"
            >
              <option id="liveCustomScaleOption" title value="custom" disabled="disabled" hidden></option>
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
            <span
              class="icon icon-zoomout"
              id="liveButtonZoomOut"
              :title="$t('Live.ZoomOut')"
              style="position: relative;top: -4px;"
            ></span>
            <span id="liveButtonSizeMode" class="liveButtonSizeModeWidth"></span>
            <span class="icon icon-left" id="liveButtonPrevious" :title="$t('Live.PreviousPage')"></span>
            <span></span>
            <span class="icon icon-right" id="liveButtonNext" :title="$t('Live.NextPage')"></span>
          </section>
        </section>
      </div>
      <div
        v-show="headTitleShow"
        id="liveLessonStat"
        @dblclick="dblClickTip($event);"
        style="position:absolute; left:0px; top:0px; z-index:114; margin:3px 0px 0px 3px;"
      >
        <span
          :style="'background-color:'+headTitleColor+';'"
          style="border-radius: 100%;padding: 2px;display:inline-block;width:20px; height:20px;text-align:center;line-height:15px;vertical-align:middle;"
        >
          <Icon type="calendar" size="12" style="color:white;"></Icon>
        </span>
        <span :style="'color:'+headTitleColor+';'" style="font-weight:bold;">{{headTitle}}</span>
        <span>{{headLessonTitle}}</span>
      </div>
      <div id="livePanelTopCtlWrap" class="livePanelTopCtl-wrap attendee-view attendee-view-open">
        <section id="livePanelTopCtl" style="display: flex;justify-content: center;">
          <Poptip
            @on-popper-show="disableAttenToolTip=true;showAttendees();"
            @on-popper-hide="disableAttenToolTip=false"
          >
            <Tooltip
              id="liveAttendeesTip"
              :content="$t('Live.Attendees')+'('+orderedUsers.length+')'"
              class="pad-l-10"
              placement="top"
              transfer
              :disabled="disableAttenToolTip"
              style="display:none;"
            >
              <div class="livePanelTopCtlbtn">
                <span class="icon icon-attendee"></span>
              </div>
            </Tooltip>
            <div class="meeting-userlist" id="liveUserList" slot="content">
              <div class="meeting-user" :id="'user-'+item.userid" v-for="item in orderedUsers">
                <ul class="meeting-userul">
                  <li class="meeting-user-face" :class="item.faceclass">
                    <img :src="item.faceurl" />
                  </li>
                  <li class="meeting-user-name" :class="item.nameclass">{{item.name}}</li>
                </ul>
              </div>
            </div>
          </Poptip>
          <Poptip
            v-model="showFileList"
            @on-popper-show="disableFileToolTip=true"
            @on-popper-hide="disableFileToolTip=false"
            placement="top"
          >
            <Tooltip
              id="liveFilesTip"
              :content="$t('Live.Files')+'('+editingEventFiles.length+')'"
              placement="top"
              transfer
              :disabled="disableFileToolTip"
              style="display:none;"
            >
              <div class="livePanelTopCtlbtn" style="margin-left: 10px;">
                <span class="icon icon-file"></span>
              </div>
            </Tooltip>
            <div id="liveFileList" class="livefilelist" slot="content">
              <div
                class="liveFileUploadStyle"
                style="text-align: center;height: 84px;background: #F8FDFF; padding-top: 2px;"
                v-if="false"
                @dragend="onVideoDragLeave"
                @dragleave="onVideoDragLeave"
                @dragover.prevent="onVideoDragOver"
                @drop.prevent="onFileDrop"
              >
                <label style="height:100%;width:100%; display:inline-block;">
                  <input
                    id="liveUploadFileInput"
                    type="file"
                    @change="uploadFileInputChange(this);"
                    accept="image/jpeg, image/png, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    style="width:0px; position:relative;left:-2000px;"
                  />
                  <img
                    class="live-file-thumbnail"
                    src="/static/images/uploadfile.svg"
                    style="width:30px;"
                  />
                  <div>{{$t("Live.ClickToUpload")}}</div>
                  <div>
                    <input type="checkbox" id="liveUploadFile2Fav" />
                    <label
                      for="liveUploadFile2Fav"
                      style="line-height:24px;"
                    >{{$t("Live.UploadTomyfiles")}}</label>
                  </div>
                </label>
              </div>
              <Button
                type="primary"
                class="livefromfavorite"
                v-if="true || getIsShowUploadFile"
                @click="AddFromFav(1);"
                :style="isKloudSync?'left:16px':'left:106px'"
              >{{$t("Live.ViewFromFiles")}}</Button>
              <Button
                type="primary"
                class="livefromcamera"
                v-if="isKloudSync"
                @click="AddFromCamera();"
              >{{$t("Live.ViewFromSpace")}}</Button>
              <Progress v-show="fileUploading" :percent="uploadPercentage" hide-info></Progress>
              <div class="liveFileWrap" style="overflow:auto; padding-top:2px; height:355px;">
                <div
                  class="live-file"
                  :class="{selected:item.isselected,converting:!item.ready}"
                  v-for="item in editingEventFiles"
                  :ready="item.ready?1:0"
                  :id="'eventfile-'+item.id"
                  :atmid="item.atmid"
                  @click="switchFile($event,false);"
                  @dblclick="switchFile($event,true);"
                >
                  <img
                    class="live-file-thumbnail"
                    src="/static/images/file.svg"
                    style="width: 30px;"
                  />
                  <div class="live-file-cover">
                    <Icon
                      type="ios-cloud-upload-outline"
                      style="display:none;"
                      title="Upload new version"
                      @click.native="handleUpdateEventFile(item)"
                    ></Icon>
                    <Icon
                      type="ios-cloud-download-outline"
                      style="display:none;"
                      title="Download"
                      @click.native="handleDownloadEventFile(item)"
                    ></Icon>
                  </div>
                  <div
                    :title="item.name"
                    style="width:260px;padding:3px; position:relative;height:26px;"
                  >
                    <span
                      :style="'width:'+(item.ready?'260px':'160px')"
                      style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis; display:block; position:absolute;z-index:2;"
                    >{{item.name}}</span>
                    <div
                      v-show="!item.ready"
                      style="width:100%; height:100%; position:absolute;top:0px;left:0px;background-color:#e1f3e1;"
                    >
                      <div
                        style="background-color:green;opacity:0.3;height:100%;"
                        :style="'width:'+item.process+'%'"
                      ></div>
                      <div
                        style="position: absolute;right: 0px;top: 0px;padding:5px 3px 0px 0px;"
                      >{{item.status}}&nbsp;{{item.process}}%</div>
                    </div>
                  </div>
                  <div class="live-file-item-sync" @click.stop>
                    <span
                      class="icon icon-eye"
                      title="View"
                      @click="fileListSyncClick($event,item.id)"
                    ></span>
                    <span @click="fileListSyncClick($event,item.id)">{{item.count}}</span>
                  </div>
                  <div class="live-file-item-more" @click.stop>
                    <Dropdown
                      trigger="hover"
                      placement="bottom-end"
                      @on-click="fileListMenuClick($event,item.id)"
                    >
                      <span>
                        <Icon
                          type="android-more-vertical"
                          size="20"
                          style="cursor:pointer;padding:0px 2px 0px 8px;"
                        ></Icon>
                      </span>
                      <DropdownMenu slot="list">
                        <DropdownItem name="delete">
                          <Icon type="close-round"></Icon>
                          &nbsp;{{$t("Base.Delete")}}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>
          </Poptip>
          <Poptip
            @on-popper-show="disableThinkToolTip=true;onThinkShow();"
            @on-popper-hide="disableThinkToolTip=false;"
            placement="top"
            v-show="true"
          >
            <Tooltip
              :content="$t('Live.Think')"
              placement="top"
              transfer
              :disabled="disableThinkToolTip"
            >
              <div class="livePanelTopCtlbtn" style="margin-left: 10px;">
                <span class="icon icon-yinxiang"></span>
              </div>
            </Tooltip>
            <div id="liveMoreAction" style slot="content">
              <div id="liveThink" style="width:350px;">
                <div
                  style="color:#2db7f5; text-align:left; font-size:18px; border-bottom:1px solid #ccc;width:350px; overflow:hidden;text-overflow: ellipsis;"
                >{{attachmentName}}</div>
                <div style="max-height:500px;overflow:auto;">
                  <div v-if="thinkList.length==0" style="padding:10px 0px 5px;text-align:center;">
                    <div>
                      <Icon type="ios-information-outline" size="48"></Icon>
                    </div>
                    <div>0 sync selected</div>
                  </div>
                  <div
                    class="liveThinkitem"
                    :key="item.id"
                    :id="'liveThinkitem'+item.id"
                    v-for="item in this.thinkList"
                  >
                    <Dropdown
                      trigger="click"
                      placement="bottom-end"
                      style="margin-left: 0px;text-align:left;"
                      @on-click="thinkMenuClick($event,item.id)"
                    >
                      <div class="liveThinkitemleft">
                        <div class="liveThinkitemtitle">{{item.title}}</div>
                        <div class="liveThinkitemdetail">
                          <Avatar :src="item.face" size="small" />
                          <span class="liveThinkitemusername">{{item.user}}</span>
                          <span
                            class="liveThinkitemtime"
                          >{{item.time}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.date}}</span>
                        </div>
                      </div>
                      <DropdownMenu slot="list">
                        <DropdownItem name="play">
                          <Icon type="play"></Icon>
                          &nbsp;&nbsp;{{$t("Base.Play")}}
                        </DropdownItem>
                        <DropdownItem name="share" v-show="!thinkShareMode">
                          <Icon type="android-share-alt"></Icon>
                          &nbsp;&nbsp;{{$t("Base.Share")}}
                        </DropdownItem>
                        <DropdownItem name="link" v-show="!thinkShareMode">
                          <Icon type="link"></Icon>
                          &nbsp;&nbsp;{{$t("Base.ShareLink")}}
                        </DropdownItem>
                        <DropdownItem name="edit" v-show="thinkMode && !thinkShareMode">
                          <Icon type="edit"></Icon>
                          &nbsp;&nbsp;{{$t("Base.Edit")}}
                        </DropdownItem>
                        <DropdownItem name="delete" v-show="thinkMode && !thinkShareMode">
                          <Icon type="ios-trash-outline"></Icon>
                          &nbsp;&nbsp;{{$t("Base.Delete")}}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <div class="liveThinkitemright" style="display:none;">
                      <Dropdown
                        trigger="click"
                        style="margin-left: 0px;text-align:left;"
                        @on-click="thinkMenuClick($event,item.id)"
                      >
                        <Icon
                          type="android-more-vertical"
                          size="20"
                          style="cursor:pointer;padding:0px 10px;"
                        ></Icon>
                        <DropdownMenu slot="list">
                          <DropdownItem name="play">
                            <Icon type="play"></Icon>
                            &nbsp;&nbsp;{{$t("Base.Play")}}
                          </DropdownItem>
                          <DropdownItem name="share" v-show="!thinkShareMode">
                            <Icon type="android-share-alt"></Icon>
                            &nbsp;&nbsp;{{$t("Base.Share")}}
                          </DropdownItem>
                          <DropdownItem name="edit" v-show="thinkMode && !thinkShareMode">
                            <Icon type="edit"></Icon>
                            &nbsp;&nbsp;{{$t("Base.Edit")}}
                          </DropdownItem>
                          <DropdownItem name="delete" v-show="thinkMode && !thinkShareMode">
                            <Icon type="ios-trash-outline"></Icon>
                            &nbsp;&nbsp;{{$t("Base.Delete")}}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
                <div class="liveThinkSelectMore" v-show="true">
                  <span
                    style="cursor:pointer;"
                    @click="selectMoreThinkClick"
                  >+{{$t("Live.SelectMoreThink")}}({{thinkListCount}})</span>
                </div>
                <div class="liveThinkSelectCreate" v-show="true">
                  <Button
                    @click="thinkOnCreate"
                    type="info"
                    size="large"
                    icon="mic-a"
                    style="color: white;padding: 8px 25px;border-radius: 20px;"
                  >{{$t("Live.CreateNewThink")}}</Button>
                </div>
              </div>
            </div>
          </Poptip>
          <Poptip
            placement="top"
            @on-popper-show="disableMoreToolTip=true"
            @on-popper-hide="disableMoreToolTip=false"
          >
            <Tooltip
              placement="top"
              transfer
              :content="$t('Live.MoreAction')"
              :disabled="disableMoreToolTip"
            >
              <div class="livePanelTopCtlbtn" style="margin-left:10px;display:none;">
                <span class="icon icon-more"></span>
              </div>
            </Tooltip>
            <div id="previewLessonMoreActions" slot="content">
              <div
                style="padding:5px;font-size:14px; line-height:22px;cursor:pointer;"
                @click="thinkOnStartMeeeting($event)"
              >
                <Icon type="ios-people" size="16"></Icon>
                <span>{{$t('Live.StartMeeting')}}</span>
              </div>
              <div
                style="padding:5px;font-size:14px; line-height:22px;cursor:pointer;"
                @click="thinkOnInviteUser($event)"
              >
                <Icon type="person-add" size="16"></Icon>
                <span>{{$t('Live.InviteUser')}}...</span>
              </div>
              <div
                style="padding:5px;font-size:14px; line-height:22px;cursor:pointer;"
                @click="ShareCurrentDoc($event)"
              >
                <Icon type="android-share" size="16"></Icon>
                <span>{{$t('Live.ShareDoc')}}</span>
              </div>
              <div
                style="padding:5px;font-size:14px; line-height:22px;cursor:pointer;"
                @click="ShareToSyncRoom($event)"
              >
                <Icon type="share" size="16"></Icon>
                <span>{{$t('Live.ShareToSyncRoom')}}...</span>
              </div>
            </div>
          </Poptip>
          <div v-if="syncRoomType != 2 ">
            <Poptip
              placement="top"
              @on-popper-show="disableChatToolTip=true"
              @on-popper-hide="disableChatToolTip=false"
            >
              <Tooltip
                placement="top"
                transfer
                :content="$t('KloudSyncHead.Chat')"
                :disabled="disableChatToolTip"
              >
                <div class="livePanelTopCtlbtn" style="margin-left:10px;">
                  <span class="icon icon-chat"></span>
                </div>
              </Tooltip>
              <div slot="content">
                <topic-modal-chat ref="syncRoomModalChat"></topic-modal-chat>
              </div>
            </Poptip>
          </div>
          <Poptip
            placement="top"
            @on-popper-show="disableMeetingToolTip=true"
            @on-popper-hide="disableMeetingToolTip=false"
          >
            <Tooltip
              placement="top"
              transfer
              :content="$t('KloudSyncHead.Meeting')"
              :disabled="disableMeetingToolTip"
            >
              <div class="livePanelTopCtlbtn" style="margin-left:10px;">
                <span class="icon icon-meeting"></span>
              </div>
            </Tooltip>
            <div slot="content">
              <topic-meetings ref="topicModalMeetings"></topic-meetings>
            </div>
          </Poptip>
          <div
            style="height: 31px;width: 10px;border-right: 1px solid rgb(189, 197, 184);;margin-top:6px;"
          ></div>
          <Tooltip :content="$t('Base.Exit')" placement="top" transfer>
            <a
              class="livePanelTopCtlbtn"
              id="liveActionEnd"
              @click="clickClose(true);"
              style="margin-left: 10px;background:red"
            >
              <span class="icon icon-quit1" style="color:white;"></span>
            </a>
          </Tooltip>
        </section>
      </div>
      <div id="previewlessonrightbutton" class="previewlessonrightbutton">
        <Button
          @click="thinkOnStartMeeeting($event)"
          type="info"
          size="large"
          icon="ios-people"
          style="color: white;padding: 8px 20px;border-radius: 20px;background-color:#34AA44;border-color:#34AA44;"
        >{{$t("Live.StartMeeting")}}</Button>
      </div>
    </div>
    <div id="previewPanelOperation" class="previewPanelOperation2" v-show="syncRoomType != 2">
      <a class="live-pdf-action" id="liveActionMinPanelMeeting">
        <span class="icon icon-rightarrow"></span>
      </a>
      <a class="live-pdf-action live-pdf-action-active" id="liveActionCursor" title="选择工具(S)">
        <span class="icon icon-mouse"></span>
      </a>
      <a class="live-pdf-action" id="liveActionPencil" title="铅笔(P)">
        <span class="icon icon-pencil"></span>
      </a>
      <a class="live-pdf-action" id="liveActionLine" title="直线(L)">
        <span class="icon icon-Line"></span>
      </a>
      <a class="live-pdf-action" id="liveActionHighlighter" title="画刷(B)">
        <span class="icon icon-mark"></span>
      </a>
      <a class="live-pdf-action" id="liveActionText" title="文本(T)">
        <span class="icon icon-text"></span>
      </a>
      <a class="live-pdf-action" id="liveActionNote" title="备注(N)">
        <span class="icon icon-tips"></span>
      </a>
      <!--<a class="live-pdf-action" id="liveActionDraw"><span class="icon icon-tipdraw"></span></a>-->
      <a class="live-pdf-action" id="liveActionBoard" title="白板(W)">
        <span class="icon icon-board"></span>
      </a>
      <a class="live-pdf-action" id="liveActionVideo" title="视频(V)">
        <span class="icon icon-insertVideo"></span>
      </a>
      <!--<a class="live-pdf-action" id="liveActionAddPage"><span class="icon icon-addpage"></span></a>-->
      <a class="live-pdf-action" id="liveActionClear" title="删除(Del)">
        <span class="icon icon-clearall"></span>
      </a>
      <a class="live-pdf-action disable" id="liveActionUndo" title="撤销(U)">
        <span class="icon icon-undo"></span>
      </a>
      <a class="live-pdf-action disable" id="liveActionRedo" title="恢复(R)">
        <span class="icon icon-redo"></span>
      </a>
      <a
        class="live-pdf-action"
        id="liveActionListVideo"
        style="display:none;"
        @click.stop="ShareMeeting"
      >
        <span class="icon icon-webcamhorizontal"></span>
      </a>
      <a
        class="live-pdf-action"
        id="liveActionOneBigVideo"
        style="display:none;"
        @click.stop="ShareOneBigMeeting"
      >
        <span class="icon icon-webcamvertical"></span>
      </a>
      <a
        class="live-pdf-action"
        id="liveActionCamera"
        style="display:none;"
        @click.stop="OnClickShowVideoView()"
      >
        <span class="live-icon live-icon-camera"></span>
      </a>
      <a class="live-pdf-action" id="liveActionPlay2" style="display:none;">
        <span class="icon icon-next"></span>
      </a>
      <a class="live-pdf-action" id="liveActionMin" title="全屏(F)">
        <span class="icon icon-full-size"></span>
      </a>
      <!-- <a class="live-pdf-action" id="liveActionEnd" title="退出" @click="clickClose(true);">
        <span class="icon icon-quit1" style="color:red;"></span>
      </a>-->
      <!--<a class="live-pdf-action" id="liveActionPicture"><span class="live-icon live-icon-picture"></span></a>-->
    </div>
    <div class="sync-room-info" id="syncRoomInfo">
      <topic-home-page ref="topicInfo"></topic-home-page>
    </div>
    <sync-player
      ref="syncplayer"
      @onPlayBaseAction="onPlayBaseAction"
      :CanControl="canControlPlayer"
      :SingleMode="true"
      @onPlaySyncEnd="onPlaySyncEnd"
      @onRecordSyncStart="onRecordSyncStart"
      @onRecordSyncEnd="onRecordSyncEnd"
      @onPlaySyncStart="onPlaySyncStart"
      @onPlaySyncPause="onPlaySyncPause"
      @onPlaySyncGo="onPlaySyncGo"
      @onPlaySyncTo="onPlaySyncTo"
    ></sync-player>
    <select-friends ref="selectfriends" @onOK="onSelectFriendsOK"></select-friends>
    <select-file-from-fav ref="selectfilefromfav" @onOK="selectFavOK"></select-file-from-fav>
    <select-file-from-space ref="selectfilefromspace" @onOK="selectSpaceOK"></select-file-from-space>
    <Modal v-model="checkExist.show" width="400" :mask-closable="false" :closable="false">
      <div style="text-align: center;padding: 30px 0px;font-size: 16px;">
        <p>{{$t("Live.AreYouExit")}}</p>
      </div>
      <div slot="footer">
        <Button
          type="success"
          icon="checkmark"
          v-show="checkExist.needSave"
          @click="saveAndExitLesson();"
        >{{$t("Live.SaveandExit")}}</Button>
        <Button
          type="primary"
          icon="android-exit"
          v-show="!checkExist.needSave"
          @click="exitLesson();"
        >{{$t("Base.Exit")}}</Button>
        <Button icon="close" @click="checkExist.show=false;">{{$t("Base.Cancel")}}</Button>
      </div>
    </Modal>
    <Modal
      v-model="shareToSyncRoom"
      title="Share To SyncRoom"
      width="500"
      :closable="true"
      :mask-closable="false"
      style="z-index:40000;position: absolute; "
      class-name="hideModalFooter"
    >
      <div style="font-size:14px;text-align:left;">
        <div style="font-weight:bold;">
          <Radio
            v-model="shareToExistSyncRoom"
            @on-change="radExistRoomOnChange"
          >Share to an exist SyncRoom</Radio>
        </div>
        <div style="display:none;" id="div_shareToExistSyncRoom">
          <div style="padding:20px;">
            <span>Team</span>
            <span>
              <Select v-model="ExistSyncRoom_team" style="width:150px">
                <Option
                  v-for="item in teamList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </span>
            <span>SyncRoom</span>
            <span>
              <Select v-model="ExistSyncRoom_room" style="width:150px">
                <Option
                  v-for="item in syncroomList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </span>
          </div>
          <div style="text-align:center;">
            <Button @click="OnShareToExistSyncRoom" type="success" style="width:150px;">OK</Button>
          </div>
        </div>
      </div>
      <div style="text-align:left;margin-top:20px;">
        <div style="font-weight:bold;">
          <Radio
            v-model="shareToNewSyncRoom"
            @on-change="radNewRoomOnChange"
          >Create a new SyncRoom and share to</Radio>
        </div>
        <div style="padding-left:20px;" id="div_shareToNewSyncRoom">
          <div style="padding:5px;">
            <span style="width:100px;display:inline-block;text-align:right;padding-right:5px;">Team</span>
            <span>
              <Select v-model="NewSyncRoom_team" style="width:300px">
                <Option
                  v-for="item in teamList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </span>
          </div>
          <div style="padding:5px;">
            <span style="width:100px;display:inline-block;text-align:right;padding-right:5px;">Name</span>
            <span>
              <Input
                v-model="syncroomname"
                placeholder="Input SyncRoom name..."
                style="width: 300px"
              ></Input>
            </span>
          </div>
          <div style="padding:5px;">
            <span
              style="width:100px;display:inline-block;text-align:right;padding-right:5px;"
            >Contacts</span>
            <span>
              <Input v-model="syncroomcontact" placeholder="Input ..." style="width: 300px"></Input>
            </span>
          </div>
          <div style="padding:5px;"></div>
          <div></div>
          <div style="text-align:center;">
            <Button
              @click="OnShareToNewSyncRoom"
              type="success"
              style="width:200px;"
            >Create new SyncRoom & Share</Button>
          </div>
        </div>
      </div>
      <div slot="footer" style="display:none;"></div>
    </Modal>
    <Modal
      v-model="selectMoreThink.Show"
      title="Select 音想"
      width="800"
      :closable="false"
      :mask-closable="false"
      style="z-index:40001;position: absolute;"
      class-name="hideModalFooter"
    >
      <div slot="header" style=" height:30px;">
        <span style="font-size:16px; font-weight:bold;">Select 音想</span>
        <span style="float:right;">
          <Button type="primary" @click="selectMoreThinkOK">{{$t("Base.OK")}}</Button>
          <Button type="text" @click="selectMoreThinkCancel">{{$t("Base.Cancel")}}</Button>
        </span>
      </div>
      <Row style="background:rgba(0,153,229,.7); height:30px;" type="flex" align="middle">
        <Col span="2">&nbsp;</Col>
        <Col span="9">{{$t("Base.Title")}}</Col>
        <Col span="9">{{$t("Base.Name")}}</Col>
        <Col span="4">{{$t("Base.Date")}}</Col>
      </Row>
      <div id="favList" style="height:300px; overflow:auto;">
        <div class="favList" v-for="item in selectMoreThink.List">
          <Row style="height:26px;" type="flex" align="middle">
            <Col span="2">
              <input type="checkbox" :value="item.id" @click="onSelectedMoreThinkClick($event);" />
            </Col>
            <Col span="9">{{item.title}}</Col>
            <Col span="9">{{item.user}}</Col>
            <Col span="4">{{item.time}}</Col>
          </Row>
        </div>
      </div>
      <div slot="footer" style="display:none;"></div>
    </Modal>
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
.syncroom {
  position: relative;
  user-select: none;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .sync-room-info {
    position: fixed;
    right: 0px;
    top: 0px;
    height: 100%;
    z-index: 1000;
    width: 400px;
    border-left: 1px solid #dddee1;

    background-color: #ffffff;
  }
  .previewHolderOuter2 {
    width: calc(100% - 438px);
    height: 100%;
    overflow: hidden;
    text-align: left;
  }
  .previewHolderOuter {
    width: calc(100% - 38px);
    height: 100%;
    overflow: hidden;
    text-align: left;
  }
  .previewlessonrightbutton {
    position: fixed;
    right: 80px;
    bottom: 19px;
    z-index: 21;
    width: 146px;
    box-sizing: border-box;
    display: none;
  }
  .meeting-userlist {
    height: 80%;
    overflow: auto;
    box-sizing: border-box;
    max-height: 500px;
    width: 250px;
  }

  .meeting-user {
    width: 100%;
    height: 30px;
    margin-bottom: 10px;
    padding: 0 14px;
  }

  .meeting-user.offline {
    filter: grayscale(100%);
    color: #ccc;
  }

  .meeting-userul {
    list-style: none;
    height: 100%;
  }
  .meeting-userul > li {
    line-height: 30px;
  }

  .meeting-user li {
    float: left;
    height: 100%;
    // line-height: 30px;
    vertical-align: middle;
  }
  .meeting-user-menu {
    visibility: hidden;
  }
  .meeting-user:hover .meeting-user-menu {
    visibility: visible;
  }

  .meeting-user-face {
    width: 30px;
    border-radius: 50%;
    overflow: hidden;
  }

  .meeting-user-face img {
    width: 100%;
    height: 100%;
  }

  .meeting-user-name {
    padding: 0px 0px 0px 10px;
    width: 160px;
    text-align: left;
    overflow: hidden;
  }

  .meeting-user-name.teacher {
    color: red;
  }

  .meeting-user-name.student {
    color: green;
  }

  .meeting-user-name.auditor {
    color: black;
  }

  .teach {
    border: 2px solid blue;
  }
  .liveFileUploadStyle {
    display: block;
    height: 86px;
    width: 330px;
    position: absolute;
    bottom: 58px;
    left: 16px;
    overflow: hidden;
    opacity: 0.7;
    border: 1px dashed #dddee1;
  }
  .liveFileUploadStyle:hover {
    border: 1px dashed #68abf1;
  }
  .liveVideoUploadStyle {
    display: block;
    height: 86px;
    width: 270px;
    position: absolute;
    bottom: 60px;
    left: 52px;
    overflow: hidden;
    opacity: 0.7;
    border: 1px dashed #dddee1;
    cursor: pointer;
  }
  .liveVideoUploadStyle:hover {
    border: 1px dashed #68abf1;
  }
  .livefilelist {
    box-sizing: border-box;
    height: 100%;
    overflow: auto;
    //position: relative;
    width: 330px;
    height: 400px;
  }

  .livefilelist ul {
    list-style: none;
    padding: 0px;
    float: left;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  .livefilelist ul li {
    float: left;
    width: 100%;
    height: 30px;
    line-height: 30px;
    vertical-align: middle;
    align-items: center;
    justify-content: flex-start;
    display: -webkit-flex;
    cursor: pointer;
    padding: 0px 0px 0px 5px;
    box-sizing: border-box;
  }

  .livefilelist ul li:hover {
    background-color: #c7cedb;
  }

  $live-file-width: 40px;
  $live-file-height: 40px;
  .live-file-list {
    padding: 0;
    margin: 0;
  }

  .live-file {
    display: inline-block;
    height: 40px;
    width: calc(100% - 6px);
    text-align: left;
    overflow: hidden;
    //position: relative;
    margin: 0 3px 6px;
    align-items: center;
    justify-content: left;
    display: -webkit-flex;
    cursor: pointer;
    padding: 4px 1px;
    border-radius: 3px;
    overflow: hidden;
  }

  .live-file.selected,
  .live-file.selected:hover {
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
  }

  .live-file:hover {
    background: #d3d3d3;
  }
  .live-file.converting {
  }
  .live-file.converting:hover {
    background-color: #fff;
    box-shadow: 0 0 0;
  }

  .live-file-thumbnail {
    display: inline-block;
    width: $live-file-width;
  }

  .live-file-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    line-height: 40px;
    text-align: center;
    width: 80px;
  }

  .live-file:hover .live-file-cover {
    //display: inline-block;
  }
  .live-file.converting:hover .live-file-cover {
    display: none;
  }

  .live-file-cover i {
    color: #000;
    font-size: 30px;
    cursor: pointer;
    margin: 0 6px;
  }

  .live-file-cover .icon {
    color: #000;
    font-size: 16px;
    cursor: pointer;
    display: inline-block;
    line-height: 40px;
  }

  .live-file-covernoaccess {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    line-height: 60px;
    background: rgba(0, 0, 0, 0.6);
    text-align: center;
    width: 28%;
  }

  .live-file:hover .live-file-covernoaccess {
    display: none;
  }
  .live-file-item-more {
    width: 25px;
    display: none;
    text-align: center;
  }
  .live-file:hover .live-file-item-more {
    display: inline-block;
  }
  .live-file.converting:hover .live-file-item-more {
    display: none;
  }
  .live-file-item-sync {
    display: none;
  }
  .live-file:hover .live-file-item-sync {
    //display: inline-block;
  }
  .live-file.converting:hover .live-file-item-sync {
    display: none;
  }

  .livefromfavorite {
    width: 145px;
    position: absolute;
    bottom: 15px;
    left: 16px;
    background: #445f73;
    border-color: #445f73;
  }

  .livefromfavorite:hover {
  }
  .livefromcamera {
    width: 165px;
    position: absolute;
    bottom: 15px;
    left: 181px;
    background: #445f73;
    border-color: #445f73;
    padding: 6px 3px;
  }
  .livePanelTopCtl-wrap {
    position: fixed;
    left: 50%;
    bottom: 20px;
    z-index: 21;
    font-size: 0;
    height: 50px;
    width: 440px;
    padding-top: 6px;
    margin-left: -243px;
    box-sizing: border-box;
  }
  .liveButtonSizeModeWidth {
    background-image: url($images-root+"icon-fitWidth.svg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 16px 16px;
    width: 16px;
    height: 16px;
    position: relative;
    top: 4px;
    display: inline-block;
    margin-left: 5px;
    cursor: pointer;
  }
  .liveButtonSizeModeHeight {
    background-image: url($images-root+"icon-fitHeight.svg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 16px 16px;
    width: 16px;
    height: 16px;
    position: relative;
    top: 4px;
    display: inline-block;
    margin-left: 5px;
    cursor: pointer;
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
    text-align: center;
  }
  .liveThinkSelectMore span {
    cursor: pointer;
  }
  .liveThinkSelectCreate {
    border-top: 1px solid #ccc;
    padding: 15px 0px 5px;
    text-align: center;
  }
  .liveThinkitem {
    border-bottom: 1px solid #f9f7f7;
    height: 60px;
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
    height: 24px;
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
    background-color: #dadada;
  }
  .live-pdf-action.disable {
    color: #d8d5d5;
    //   display:none !important;
  }
  .live-pdf-action.disable:hover {
    background-color: #ffffff;
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
  .previewPanelOperation2 {
    display: block;
    position: fixed;
    z-index: 1000;
    top: 0px;
    right: 401px;
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
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
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
        0 0 1px hsla(0, 0%, 100%, 0.15) inset, 0 1px 0 hsla(0, 0%, 100%, 0.05);
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
      right: 456px;
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
      background: url($images-root+"toolbarButton-menuArrows.png") no-repeat;
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
  .liveToolbar-zoom .icon {
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
import "../../common/whiteboard.css";

import SyncPlayer from "./SyncPlayer.vue";
import VideoPlayer from "./VideoPlayer.vue";
import SelectFriends from "./SelectFriends.vue";
import TopicHomePage from "../kloudsync/TopicHomePage.vue";
import TopicChat from "../kloudsync/TopicChat.vue";
import TopicModalChat from "../kloudsync/TopicModalChat.vue";
import TopicMeetings from "../kloudsync/TopicMeetings.vue";
import SelectFileFromFav from "./SelectFileFromFav.vue";
import SelectFileFromSpace from "./SelectFileFromSpace.vue";
import OneCollectData from '../projectOne/OneCollectData';
import AllCollectData from '../projectOne/AllCollectData'

import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

var whiteboard = new WhiteBoardTool();
//var docview = new ImageDocumentView();
var PageNumber = 1;
var ToPageNumber = 1;
var IsRecord = false;
var Context = null;
var PDFCOUNT = 0;
var CurrentScale = 1;
var websocket = null;
var IsInlineWihteBoardShow = false;
var IsDocEidt = false;
var LastRouterPath = "/";

function GetSocket(context) {
  return context.$parent.$refs.noticemsg.obj;
  //return context.$parent.$children[0]._data.obj;
}

function AfterChangePage(pageid) {
  //Context.ShowSyncObject(ToPageNumber);
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
      var customScaleOption = document.getElementById("liveCustomScaleOption");
      customScaleOption.textContent = customScale + "%";
      customScaleOption.selected = true;
    }
  }
  return;
  var mh = $("#main").height();
  var ch = $("#pageContainer" + PageNumber).height();
  if (ch < mh) {
    $("#pageContainer" + PageNumber).css("top", (mh - ch) / 2 + "px");
    $("#pageContainer" + PageNumber)
      .find("div.boardhead")
      .css("top", (mh - ch) / 2 + "px");
  } else {
    $("#pageContainer" + PageNumber).css("top", "");
    $("#pageContainer" + PageNumber)
      .find("div.boardhead")
      .css("top", "");
  }
}
function getViewWidth() {
  var result = document.body.clientWidth - 10;
  if ($("#syncRoomInfo").is(":visible")) {
    result -= $("#syncRoomInfo").width();
  }
  if (document.body.scrollHeight > document.body.clientHeight) {
    result += 17;
  }
  return result;
}
function getViewHeight() {
  return Math.max(document.body.clientHeight - 2, 100);
}
function LiveBodyResize() {
  //console.log("LiveBodyResize");
  updateToolbar();
  //$("#main").css({ width: getViewWidth()+10, height: getViewHeight()-4 });
  $("#liveplayvideo").css({width: getViewWidth(), height: getViewHeight() });
}
function CheckZoom() {
  var oldinfo = whiteboard.GetPageInfo();
  whiteboard.Clear();
  whiteboard.ZoomTo(CurrentScale, scale => {
    CurrentScale = scale;
    updateToolbar();
    for (var info of oldinfo) {
      whiteboard.Play(info);
    }
  });
  return;
  var oldinfo = whiteboard.GetPageInfo();
  console.log(oldinfo);
  for (var info of oldinfo) {
    whiteboard.Play(info);
  }
}
function Record_view() {}
function ShowPdfInfo() {
  $("#livePageNumber").text(PageNumber);
  $("#livePageCount").text(" / " + PDFCOUNT);
  if (websocket && PageNumber > 0) {
    websocket._currentPageID = PageNumber;
  }
}
function LiveDocPreviousPage() {
  whiteboard.PreviewPage((issuccess, pagenumber) => {
    if (!issuccess && pagenumber == -1) {
      //change document
      console.log("PreviewPage error");
    } else {
      // PageNumber=pagenumber;
      // ShowPdfInfo();
      // CurrentScale=1;
      // updateToolbar();
    }
  });
}
function LiveDocNextPage() {
  whiteboard.NextPage((issuccess, pagenumber) => {
    if (!issuccess && pagenumber == -1) {
      //change document
      console.log("NextPage error");
    } else {
      // PageNumber=pagenumber;
      // ShowPdfInfo();
      // CurrentScale=1;
      // updateToolbar();
    }
  });
}

function LiveDocZoomIn() {
  var oldinfo = whiteboard.GetPageInfo();
  //console.log(oldinfo)
  whiteboard.Clear();
  whiteboard.ZoomIn(scale => {
    CurrentScale = scale;
    updateToolbar();
    for (var info of oldinfo) {
      whiteboard.Play(info);
    }
  });
}
function LiveDocZoomOut() {
  var oldinfo = whiteboard.GetPageInfo();
  //console.log(oldinfo)
  whiteboard.Clear();
  whiteboard.ZoomOut(scale => {
    CurrentScale = scale;
    updateToolbar();
    for (var info of oldinfo) {
      whiteboard.Play(info);
    }
  });
}
function CheckDocEdit(data) {
  if (IsDocEidt || !data.type) return;
  if (
    data.type == 21 ||
    data.type == 24 ||
    data.type == 25 ||
    data.type == 26 ||
    data.type == 27 ||
    data.type == 28 ||
    data.type == 33 ||
    data.type == 101 ||
    data.type == 102 ||
    data.type == 103
  ) {
    IsDocEidt = true;
  }
}
function InitPage() {
  //whiteboard.SetSizeMode(1);
  whiteboard.SetCanEdit(true);
  whiteboard.SetRecord(true);
  whiteboard.OnToolReset(function(res) {
    //console.log("OnToolReset:"+res);
    if (res == "") {
      _activeButton("#liveActionCursor");
    } else if (res == "ToolPen") {
      _activeButton("#liveActionPencil");
    } else if (res == "ToolBrush") {
      _activeButton("#liveActionHighlighter");
    } else if (res == "ToolLine") {
      _activeButton("#liveActionLine");
    } else if (res == "ToolText") {
      _activeButton("#liveActionText");
    } else if (res == "ToolNote") {
      _activeButton("#liveActionNote");
    } else if (res == "ToolBoard") {
      _activeButton("#liveActionBoard");
    } else if (res == "ToolVideo") {
      _activeButton("#liveActionVideo");
    }
  });
  whiteboard.OnReceviceData(function(res) {
    CheckDocEdit(res);
    if (websocket) {
      if (
        Context.$refs.syncplayer &&
        typeof Context.$refs.syncplayer.getAudioCurrentTime == "function"
      ) {
        var t = Context.$refs.syncplayer.getAudioCurrentTime();
        if (t >= 0) {
          res.time = t;
        }
      }
      websocket.sendsyncactions(
        JSON.stringify(res),
        Context.attachmentID,
        function(d) {
          //loger.log("sendsyncactions->data:" + d.data);
        }
      );
    }

    if (res.type != 34 && res.type != 35) {
      //console.log("OnReceviceData:"+ JSON.stringify(res));
      //whiteboard.Play(res);
    }
  });
  //whiteboard.Init($("#svg1"), $("#main"), $("#pageContainer1"), 1);

  whiteboard.OnPageChange((pagenumber, type) => {
    console.log("OnPageChange:" + pagenumber + ",Type:" + type);
    PageNumber = pagenumber;
    ShowPdfInfo();
    CurrentScale = 1;
    updateToolbar();
    Context.ShowSyncObject(pagenumber, type != 1);
  });
  whiteboard.OnSelectVideo((id, afterSelectVideo) => {
    Context.$refs.syncplayer.selectVideoShow(d => {
      afterSelectVideo(id, d);
    });
  });
  whiteboard.OnVideoPlay(id => {
    console.log("OnVideoPlay:" + id);
    Context.playVideoTag(id);
  });
  whiteboard.OnBoardDisplayChange(isshow => {
    //console.log("OnBoardDisplayChange:"+isshow);
    IsInlineWihteBoardShow = isshow;
    Context.ChangeDrawTool4WhiteBoardDiplayChange(isshow);
  });
  whiteboard.OnUndoRedoStatChange((undostat, redostat) => {
    //console.log("OnUndoRedoStatChange:"+undostat+","+redostat);
    if (undostat == 0) {
      if (!$("#liveActionUndo").hasClass("disable"))
        $("#liveActionUndo").addClass("disable");
    } else {
      $("#liveActionUndo").removeClass("disable");
    }
    if (redostat == 0) {
      if (!$("#liveActionRedo").hasClass("disable"))
        $("#liveActionRedo").addClass("disable");
    } else {
      $("#liveActionRedo").removeClass("disable");
    }
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
      Record_view();
    }, 200);
  });
}
function _activeButton(button) {
  $(".live-pdf-action-active").removeClass("live-pdf-action-active");
  $(button).addClass("live-pdf-action-active");
}
function switchPresentationModeIcon(isfull) {
  LiveBodyResize();
}
function initializeControlWindow(vuethis) {
  var vueThis = vuethis;
  var startPosition, rightMax;

  $("#liveActionCursor").click(function(e) {
    _activeButton("#liveActionCursor");
    whiteboard.SetDrawTool("");
    return false;
  });
  $("#liveActionPencil").click(function(e) {
    //console.log(typeof(svgboard));
    //console.log(typeof(whiteboard.whiteboard));
    //console.log(typeof(whiteboard.whiteboard.gettest));
    //var a=svgboard.gettest();
    //console.log(a);

    if ($("#liveActionPencil").hasClass("live-pdf-action-active")) {
      //   ShowWBSetting("pen");
      //   setTimeout(function(){
      //     whiteboard.Play({"type":34,"show":1,"sleep":20,"bd":0,"delay":1,"poz":[[333,179],[335,181],[337,197],[346,230]],"page":0,"VW":1882,"ST":0,"SL":0});
      //   },500);
      //   setTimeout(function(){
      //     whiteboard.Play({"type":34,"show":1,"sleep":20,"bd":0,"delay":1,"poz":[[355,281],[355,338]],"page":0,"VW":1882,"ST":0,"SL":0});
      //   },1000);
      //   setTimeout(function(){
      //     whiteboard.Play({"type":34,"show":1,"sleep":20,"bd":0,"delay":1,"poz":[[358,406],[371,471]],"page":0,"VW":1882,"ST":0,"SL":0});
      //   },1500);
      //   setTimeout(function(){
      //     whiteboard.Play({"type":34,"show":1,"sleep":20,"bd":0,"delay":1,"poz":[[391,528]],"page":0,"VW":1882,"ST":0,"SL":0});
      //   },2000);
      //   return;
      //whiteboard.TriggerPageChange();

      whiteboard.ShowSetting(true);
      return;
    }

    whiteboard.SetDrawTool("ToolPen");
    //docview.ShowDocument("test url");
    _activeButton("#liveActionPencil");
    //DrawLine(false);
    //whiteboard.SetDrawTool("DrawLine");
    return false;
  });
  $("#liveActionHighlighter").click(function(e) {
    // whiteboard.Play({"type":35,"poz":[915,228],"bd":0,"page":0,"VW":1574,"ST":0,"SL":0});
    // return;
    if ($("#liveActionHighlighter").hasClass("live-pdf-action-active")) {
      whiteboard.ShowSetting(true);
      return;
    }
    _activeButton("#liveActionHighlighter");
    whiteboard.SetDrawTool("ToolBrush");
    return false;
  });
  $("#liveActionLine").click(function(e) {
    if ($("#liveActionLine").hasClass("live-pdf-action-active")) {
      whiteboard.ShowSetting(true);
      return;
    }
    _activeButton("#liveActionLine");
    whiteboard.SetDrawTool("ToolLine");
    return false;
  });
  $("#liveActionText").click(function(e) {
    if (whiteboard.ShowSelectToolSetting("ToolText")) {
      _cancelBubble(e);
      _cancelDefault(e);
      return false;
    }
    if ($("#liveActionText").hasClass("live-pdf-action-active")) {
      whiteboard.ShowSetting(true);
      _cancelBubble(e);
      _cancelDefault(e);
      return false;
    }
    _activeButton("#liveActionText");
    whiteboard.SetDrawTool("ToolText");
    return false;
  });
  $("#liveActionNote").click(function(e) {
    if (whiteboard.ShowSelectToolSetting("ToolNote")) {
      _cancelBubble(e);
      _cancelDefault(e);
      return false;
    }
    if ($("#liveActionNote").hasClass("live-pdf-action-active")) {
      whiteboard.ShowSetting(true);
      _cancelBubble(e);
      _cancelDefault(e);
      return false;
    }
    _activeButton("#liveActionNote");
    whiteboard.SetDrawTool("ToolNote");
    return false;
  });
  $("#liveActionDraw").click(function(e) {
    _activeButton("#liveActionDraw");
    //DrawInlineBoard();
    return false;
  });
  $("#liveActionBoard").click(function(e) {
    _activeButton("#liveActionBoard");
    whiteboard.SetDrawTool("ToolBoard");
    //DrawWhiteBoard();
    return false;
  });
  $("#liveActionVideo").click(function(e) {
    _activeButton("#liveActionVideo");
    whiteboard.SetDrawTool("ToolVideo");
    //DrawVideo();
    return false;
  });
  $("#liveActionAddPage").click(function(e) {
    _activeButton("#liveActionAddPage");
    DrawAddPage();
    return false;
  });
  $("#liveActionClear").click(function(e) {
    //Context.onMasterLessonStart({ lessonId:111});
    //return false;
    _activeButton("#liveActionClear");
    //ClearPath();
    whiteboard.SetDrawTool("ToolClear");
    return false;
  });
  $("#liveActionUndo").click(function(e) {
    //alert("todo!");
    whiteboard.Undo();
    return false;
  });
  $("#liveActionRedo").click(function(e) {
    //alert("todo!");
    whiteboard.Redo();
    return false;
  });
  $("#liveActionPlay").click(function(e) {
    //Context.onMasterLessonStart({ lessonId:111});
    //return false;
    _activeButton("#liveActionPlay");
    var span = $("#liveActionPlay").find(">span");
    if (span.hasClass("icon-next")) {
      span.removeClass("icon-next").addClass("icon-quit");
      //AutoPlayDocument(true);
      Context.showAutoPlayDlg = true;
      //Context.selectAudioName = "";
    } else {
      span.removeClass("icon-quit").addClass("icon-next");
      AutoPlayDocument(false);
      Context.showAutoPlayDlg = false;
      Context.stopAudio();
      Context.NoticePlayAudio("", 0);
    }

    return false;
  });

  $("#btnSaveNote").click(function(e) {
    SaveNote(e);
    return false;
  });
  $("#btnCancelNote").click(function(e) {
    CancelNote(e);
    return false;
  });
  $("#liveActionTools").click(function(e) {
    if ($("#liveActionToolsdiv").is(":visible")) {
      $("#liveActionToolsdiv").hide();
      return;
    }
    if (!$("#livePanelMeeting").is(":visible")) {
      taggleMinControlWindow(true);
    }
    var h = $("#livePanelOperation").height() - 144; //396 280
    $("#liveActionToolsdiv")
      .css({ top: h })
      .show();
    $("#liveActionToolscontain")
      .focus()
      .bind("blur", () => {
        setTimeout(() => {
          $("#liveActionToolsdiv").hide();
        }, 100);
      });
    return false;
  });
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
    if ($("#liveButtonSizeMode").hasClass("liveButtonSizeModeWidth")) {
      $("#liveButtonSizeMode")
        .removeClass("liveButtonSizeModeWidth")
        .addClass("liveButtonSizeModeHeight");
      whiteboard.SetSizeMode(1);
    } else {
      $("#liveButtonSizeMode")
        .removeClass("liveButtonSizeModeHeight")
        .addClass("liveButtonSizeModeWidth");
      whiteboard.SetSizeMode(0);
    }
    whiteboard.RefreshDocument(() => {
      whiteboard.TriggerViewChange();
      CurrentScale = 1;
      updateToolbar();
    });
  });
  $("#liveActionMin,#liveActionMin2").click(function(e) {
    _cancelBubble(e);
    var doc = document;
    var el = document.body; //document.getElementById(cid);
    var isInFullScreen =
      (doc.fullScreenElement && doc.fullScreenElement !== null) ||
      (doc.msFullscreenElement && doc.msFullscreenElement !== null) ||
      (doc.mozFullScreen || doc.webkitIsFullScreen);
    if (isInFullScreen) {
      var requestMethod =
        doc.cancelFullScreen ||
        doc.webkitCancelFullScreen ||
        doc.mozCancelFullScreen ||
        doc.exitFullscreen ||
        doc.msExitFullscreen;
      if (requestMethod) {
        requestMethod.call(doc);
        switchPresentationModeIcon(false);
      }
    } else {
      var requestMethod =
        el.requestFullScreen ||
        el.webkitRequestFullScreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullscreen;
      if (requestMethod) {
        requestMethod.call(el);
        switchPresentationModeIcon(true);
      }
    }
    var fullScreenStatusChange = function() {
      var isInFullScreen =
        (document.fullScreenElement && document.fullScreenElement !== null) ||
        (document.msFullscreenElement &&
          document.msFullscreenElement !== null) ||
        (document.mozFullScreen || document.webkitIsFullScreen);
      if (isInFullScreen) {
        switchPresentationModeIcon(true);
      } else {
        switchPresentationModeIcon(false);
      }
    };
    $(document)
      .unbind(
        "fullscreenchange MSFullscreenChange mozfullscreenchange webkitfullscreenchange"
      )
      .bind(
        "fullscreenchange MSFullscreenChange mozfullscreenchange webkitfullscreenchange",
        fullScreenStatusChange
      );
  });

  $("#liveActionMinPanelMeeting").click(function(e) {
    if ($("#syncRoomInfo").css("display") == "none") {
      $("#previewHolderOuter")
        .removeClass("previewHolderOuter")
        .addClass("previewHolderOuter2");
      $("#previewPanelOperation")
        .removeClass("previewPanelOperation")
        .addClass("previewPanelOperation2");
      $("#liveButtonNext").css("right", "456px");
      $("#syncRoomInfo").css("display", "block");
      $("#liveActionMinPanelMeeting span")
        .removeClass("icon-leftarrow")
        .addClass("icon-rightarrow");
      // $("#livePanelTopCtlWrap").hide();
    } else {
      $("#previewHolderOuter")
        .removeClass("previewHolderOuter2")
        .addClass("previewHolderOuter");
      $("#previewPanelOperation")
        .removeClass("previewPanelOperation2")
        .addClass("previewPanelOperation");
      $("#liveButtonNext").css("right", "56px");
      $("#syncRoomInfo").css("display", "none");
      $("#liveActionMinPanelMeeting span")
        .removeClass("icon-rightarrow")
        .addClass("icon-leftarrow");
      // $("#livePanelTopCtlWrap").show();
    }
    LiveBodyResize();
    CheckZoom();
  });
}

export default {
  data: function() {
    return {
      //
      showHtml:false,
      showHtmlAll:true,
      //
      canControlPlayer: true,
      showFileList: false,
      disableFileToolTip: false,
      disableThinkToolTip: false,
      disableMoreToolTip: false,
      disableChatToolTip: false,
      disableMeetingToolTip: false,
      disableAttenToolTip: false,
      orderedUsers: [],
      editingEventFiles: [],
      attachmentName: "",
      attachmentUrl: "",
      attachmentID: 0,
      attachmentItemID: 0,
      thinkShareMode: false,
      thinkMode: false,
      thinkCreate: false,
      thinkShow: true,
      thinkShowSyncBtn: false,
      thinkCurrentID: 0,
      thinkInfo: {
        ID: 0,
        Title: "",
        EnableBackGround: false,
        EnableSelectVoice: false,
        EnableRecord: false,
        BackGroundItemID: 0,
        BackGroundTitle: "",
        BackGroundTime: "",
        SelectVoiceItemID: 0,
        SelectVoiceTitle: "",
        SelectVoiceTime: "",
        RecordVoiceItemID: 0,
        SyncStatus: 0,
        SyncDate: "",
        CreateEditStat: 0,
        RecordTitle: "",
        RecordTime: "",
        EnableVoice: false,
        IsPublic: false
      },
      thinkList: [],
      thinkListCount: 0,
      isPause: false,
      isPlay: false,
      showPageLine: true,
      headTitle: "",
      headLessonTitle: "",
      headTitleShow: false,
      headTitleColor: "#1D6DE2",
      checkExist: { show: false, isTeacher: false, needSave: true },
      selectMoreThink: { Show: false, List: [], Selected: [] },
      fileUploading: false,
      uploadPercentage: 0,
      uploadTimer: null,
      showUploadFile: false,
      isKloudSync: false,
      shareToSyncRoom: false,
      shareToExistSyncRoom: false,
      shareToNewSyncRoom: true,
      teamList: [],
      syncroomList: [],
      syncroomname: "",
      syncroomcontact: "",
      ExistSyncRoom_team: null,
      ExistSyncRoom_room: null,
      NewSyncRoom_team: null,

      syncRoomType: -1
    };
  },
  props: {},
  components: {
    //
    OneCollectData,
    AllCollectData,
    //
    SyncPlayer,
    VideoPlayer,
    SelectFriends,
    TopicHomePage,
    TopicChat,
    TopicModalChat,
    TopicMeetings,
    SelectFileFromFav,
    SelectFileFromSpace
  },
  computed: {
    ...mapState(["kloudsyncTopic"])
  },
  mounted: function() {
    this.fileBegin();
  },
  beforeDestroy: function() {
    //console.log("beforeDestroy");
    if (websocket) {
      websocket.endmeeting();
      websocket.reset();
    }
    $(document)
      .children()
      .unbind("keydown", this.onKeyDown4Preview);
    IsDocEidt = false;
    window.onbeforeunload = null;
    window.onunload = null;
  },
  beforeRouteEnter(to, from, next) {
    //console.log(from);
    if (from && from.path) {
      LastRouterPath = from.path;
    }
    next();
  },
  methods: {
    hidden(){
      this.showHtml=false;
      this.showHtmlAll=false;
    },
    hideApprove(){
      this.$refs.topicInfo.hideApprove();
    },
    fileBegin(){
      this.isKloudSync = IsKloudSync();
      Context = this;
      InitPage();
      this.Init();
      $(document).children().bind("keydown", this.onKeyDown4Preview);
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };
      window.onunload = () => {
        if (websocket) websocket.logout();
      };
      this.initOfSyncRoomType();
    },
    initOfSyncRoomType() {
      let self = this;
      this.$refs.topicModalMeetings.initialize();
      this.getSyncRoomProperty(this.$route.params.id).then(data => {
        self.syncRoomType = data.TopicType;
        if (self.syncRoomType == 2) {
          self.$nextTick(() => {
            if (self.$refs.inTopicChatMeeting) {
              self.$refs.inTopicChatMeeting.initialize();
              $("#livePanelTopCtlWrap").css("bottom", "0px");
              $("#previewHolderOuter").css({
                width: "calc(100% - 401px)",
                "background-color": "white"
              });
            }
          });
        } else {
          self.$nextTick(() => {
            if (self.$refs.syncRoomModalChat) {
              self.$refs.syncRoomModalChat.initialize();
            }
          });
        }
      });
    },
    getSyncRoomProperty(id) {
      let self = this;
      return new Promise((resolve, reject) => {
        let url = GetAPIUrl() + "Topic/Item?itemID=" + parseInt(id);
        $.ajax({
          type: "GET",
          url: url,
          beforeSend: function(request) {
            request.setRequestHeader("UserToken", auth.getUserToken());
          },
          success: function(result) {
            if (result.RetCode === 0) {
              resolve(result.RetData);
            }
          }
        });
      });
    },
    Init() {
      //var url="https://peertime-test.oss-cn-shanghai.aliyuncs.com/P49/Attachment/D22127/3cddb7e9-c859-4703-8221-ff749ab2bcfd_<3>.jpg";
      //ShowPDF(url,1);
      //console.log(this.getItemID()+","+this.getLessonID());

      websocket = GetSocket(this);

      window.onunload = () => {
        if (websocket) {
          websocket.endmeeting();
          websocket.logout();
        }
      };

      if (this.getTypeID() == "0") {
        //my file
        webapi.getFavoriteAttachmentDetail(this.getItemID()).then(res => {
          this.attachmentName = res.Title;
          this.attachmentID = res.AttachmentID;
          this.attachmentUrl = res.AttachmentUrl;
          this.ShowPDF(res.AttachmentUrl, 1);
          // whiteboard.ShowDocument($("#main"),res.AttachmentUrl,1,(issuccess, pdfcount)=>{
          //     PDFCOUNT=pdfcount;
          //     ShowPdfInfo();
          // });
          this.joinMeeting();
        });
        this.thinkMode = true;
      } else if (this.getTypeID() == "1") {
        //lesson
        this.joinMeeting();
      } else if (this.getTypeID() == "2") {
        //kloud sync file
        //$("#liveFilesTip").show();

        webapi.getAttachmentDetailByItemID(this.getItemID()).then(res => {
          this.showfiles(res);
          this.setSelectFile(this.getItemID());
          this.attachmentName = res.Title;
          this.attachmentID = res.AttachmentID;
          this.attachmentUrl = res.AttachmentUrl;
          this.ShowPDF(res.AttachmentUrl, 1);
          // whiteboard.ShowDocument($("#main"),res.AttachmentUrl,1,(issuccess, pdfcount)=>{
          //     PDFCOUNT=pdfcount;
          //     ShowPdfInfo();
          // });
          this.joinMeeting();
        });
        this.thinkMode = true;
      } else if (this.getTypeID() == "3") {
        //attachment
        $("#liveFilesTip").show();
        webapi.getAttachmentDetail(this.getItemID()).then(res => {
          if (!res) return;
          this.showfiles(res);
          this.setSelectFile(res.ItemID);
          this.attachmentName = res.Title;
          this.attachmentID = res.AttachmentID;
          this.attachmentUrl = res.AttachmentUrl;
          this.ShowPDF(res.AttachmentUrl, 1);
          // whiteboard.ShowDocument($("#main"),res.AttachmentUrl,1,(issuccess, pdfcount)=>{
          //     PDFCOUNT=pdfcount;
          //     ShowPdfInfo();
          // });
          this.joinMeeting();
        });
        this.thinkMode = true;
      } else if (this.getTypeID() == "4") {
        //temp lesson
        $("#liveAttendeesTip,#liveFilesTip").show();
        webapi.ReqChangeItemList(this.getItemID()).then(data => {
          this.showfiles(data.RetData);
          this.showAttendees();
          if (data.RetData && data.RetData.length > 0) {
            var res = data.RetData[0];
            this.attachmentName = res.Title;
            this.attachmentID = res.AttachmentID;
            this.attachmentUrl = res.AttachmentUrl;
            this.attachmentItemID=res.ItemID;

            if(res.Status==0)
            {
              this.ShowPDF(res.AttachmentUrl, 1);
            }
            // whiteboard.ShowDocument($("#main"),res.AttachmentUrl,1,(issuccess, pdfcount)=>{
            //     PDFCOUNT=pdfcount;
            //     ShowPdfInfo();

            // });
            this.joinMeeting();
            this.$nextTick(() => {
              this.setSelectFile(res.ItemID);
            });
          }
        });
        //this.joinMeeting();
        this.thinkMode = true;
      }

      // this.headTitle="SyncRoom: ";
      // this.headLessonTitle=this.attachmentName;
      // this.headTitleColor="#34AA44";
      // this.headTitleShow=true;
      // setTimeout(()=>{
      //     this.dblClickTip();
      // },3000);

      initializeControlWindow(this);
    },
    CheckPageObject(pageid) {
      webapi
        .getAttachmentOrSyncPageObject(pageid, this.attachmentID)
        .then(infoarr => {
          if (infoarr == null) return;
          for (var txt of infoarr) {
            this.onPlayBaseAction(txt);
          }
        });
    },
    showAttachment(attachmentid) {
      //console.log("showAttachment:"+attachmentid);
      websocket._currentDocID = attachmentid;
      websocket._currentPageID = PageNumber;

      var eventinfo = null;
      for (var file of this.editingEventFiles) {
        if (file.id == attachmentid) {
          eventinfo = file;
        }
      }
      if (eventinfo == null) return;

      this.setSelectFile(eventinfo.id);
      //console.log(eventinfo);
      this.attachmentName = eventinfo.title;
      this.attachmentID = eventinfo.atmid;
      this.attachmentUrl = eventinfo.url;
      this.attachmentItemID=eventinfo.id;
      websocket.updatemeetingdocid(eventinfo.id);
      this.sendSwitchFileMsg(this.attachmentID,this.attachmentItemID,eventinfo.url,PageNumber);
      PageNumber = websocket._currentPageID;
      ToPageNumber = websocket._currentPageID;
      this.ShowPDF(eventinfo.url, PageNumber, () => {
        this.ShowSyncObject(PageNumber, false);
      });
      // whiteboard.ShowDocument($("#main"),eventinfo.url,PageNumber,(issuccess, pdfcount)=>{
      //     PDFCOUNT=pdfcount;
      //     ShowPdfInfo();
      //     this.ShowSyncObject(PageNumber,false);

      // });
    },
    showSyncRoomTitle(title) {
      this.headTitle = "SyncRoom: ";
      this.headLessonTitle = title;
      this.headTitleColor = "#34AA44";
      this.headTitleShow = true;
      setTimeout(() => {
        this.dblClickTip();
      }, 3000);
    },
     displayAttachment(attachmentid, title, url, itemid = 0) {
      PageNumber = 1;
      websocket._currentDocID = attachmentid;
      websocket._currentPageID = PageNumber;

      //console.log(eventinfo);
      this.attachmentName = title;
      this.attachmentID = attachmentid;
      this.attachmentUrl = url;
      websocket.updatemeetingdocid(this.getAttachmentItemID(this.attachmentID));
      PageNumber = websocket._currentPageID;
      ToPageNumber = websocket._currentPageID;
      this.ShowPDF(url, PageNumber, () => {
        this.ShowSyncObject(PageNumber, false);
      });
      // whiteboard.ShowDocument($("#main"),url,PageNumber,(issuccess, pdfcount)=>{
      //     PDFCOUNT=pdfcount;
      //     ShowPdfInfo();
      //     this.ShowSyncObject(PageNumber,false);

      // });
    },
    refreshAttachmentsList(callback) {
      this.editingEventFiles = [];
      webapi.getSyncRoomAttachmentList(this.getItemID()).then(data => {
        this.showfiles(data.RetData);
        if (callback) callback();
      });
    },
    ShowSyncObject(pageid, checkSyncTimeByPage = true) {
      //console.log("ShowSyncObject:"+pageid);
      if (!this.showPageLine && checkSyncTimeByPage == true) {
        this.showPageLine = true;
        return;
      }
      if (!this.isPause && !this.isPlay) {
        //show lesson line
        webapi
          .getPageObject(
            this.getItemID(),
            this.getAttachmentItemID(this.attachmentID),
            pageid,
            0
          )
          .then(infoarr => {
            if (infoarr == null) return;
            for (var txt of infoarr) {
              this.onPlayBaseAction(txt);
            }
          });
      } else if (this.isPause) {
        //play sync then pause
        webapi
          .getAttachmentOrSyncPageObject(pageid, 0, this.thinkCurrentID, 1)
          .then(infoarr => {
            if (infoarr == null) return;
            for (var txt of infoarr) {
              this.onPlayBaseAction(txt);
            }
          });
        if (checkSyncTimeByPage) {
          webapi.GetSyncTimeByPage(this.thinkCurrentID, pageid).then(res => {
            this.$refs.syncplayer.GoToTime(res);
          });
        }
      } //play sync
      else {
        if (checkSyncTimeByPage) {
          webapi.GetSyncTimeByPage(this.thinkCurrentID, pageid).then(res => {
            this.$refs.syncplayer.GoToTime(res);
          });
        }
        webapi
          .getAttachmentOrSyncPageObject(pageid, 0, this.thinkCurrentID)
          .then(infoarr => {
            if (infoarr == null) return;
            for (var txt of infoarr) {
              this.onPlayBaseAction(txt);
            }
          });
      }
    },
    joinMeeting() {
      //console.log("joinMeeting:");

      var meetingid = this.getItemID() + "," + auth.getUserID();

      var joinmeetingfun = () => {
        websocket.joinmeeting(
          meetingid,
          "",
          2,
          0,
          jd => {
            //console.log(jd);
            websocket.setmeetingid(meetingid);
            websocket.updatemeetingdocid(this.getAttachmentItemID(this.attachmentID));
            this.sendSwitchFileMsg(this.attachmentID,this.attachmentItemID,this.attachmentUrl,PageNumber);
            websocket.onKickMeeting = () => {};
            websocket.setuploadfilecallback(d => {
              setTimeout(() => {
                webapi.getSyncRoomAttachmentList(this.getItemID(), info => {
                  PageNumber = 1;
                  this.showfiles(info.RetData);
                  if (d.createBy + "" == auth.getUserID() + "") {
                    this.showAttachment(d.itemId);
                    var uploadFileName = this.getAttachmentName(d.itemId);
                    if (d.isFromP1 && d.isFromP1 == "1") {
                      util.MoveTitle(
                        uploadFileName + " add to KloudSync success!",
                        "/static/images/kloudsync-red.png"
                      );
                      Notification.requestPermission(status => {
                        if ("granted" == status) {
                          var tag = "pt-" + Math.random();
                          var notify = new Notification("KloudSync", {
                            dir: "auto",
                            //lang: 'zh-CN',
                            tag: tag,
                            icon: "/static/images/kloudsync.png",
                            body: uploadFileName + " add to KloudSync success!"
                          });
                          notify.onclick = () => {
                            window.focus();
                            notify.close();
                          };
                        }
                      });
                    }
                  }
                });
              }, 100);
            });
          },
          this.getItemID(),
          1
        );
      };

      if (websocket.isopen()) {
        joinmeetingfun();
      } else {
        websocket.setopencallback(() => {
          joinmeetingfun();
        });
      }
    },
    sendSwitchFileMsg(attachmentid,itemid,url,pagenumber){

        var meetingid=this.getItemID()+","+auth.getUserID();

        var senddata = new Object();
        senddata.roleType = "1";
        senddata.actionType = "8";
        senddata.meetingID = meetingid;
        senddata.incidentID = meetingid;
        senddata.eventID = 0;
        senddata.eventName = "";
        senddata.itemId = itemid;
        senddata.attachmentUrl = url;
        senddata.blankPageNumber = "";
        senddata.pageNumber=pagenumber;
        senddata.isH5 = false;

        websocket.sendmessage("",base64encode(utf16to8(JSON.stringify(senddata))));
    },
    onKeyDown4Preview(evt) {
      //console.log("onKeyDown4Preview:"+evt.keyCode);
      if (
        evt.originalEvent.target.nodeName == "TEXTAREA" ||
        evt.originalEvent.target.nodeName == "INPUT"
      ) {
        return true;
      }
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
          gid("main").scrollTop = Math.min(
            gid("main").scrollHeight - gid("main").clientHeight,
            gid("main").scrollTop + 200
          );
        }
      } else if (evt.keyCode == 38) {
        //up
        // if(gid("main").scrollTop==0)
        // {
        //     LiveDocPreviousPage();
        // }
        // else
        {
          gid("main").scrollTop = Math.max(0, gid("main").scrollTop - 200);
        }
      } else if (evt.keyCode == 39) {
        //->
        if (
          gid("main").scrollLeft ==
          gid("main").scrollWidth - gid("main").clientWidth
        ) {
          LiveDocNextPage();
        } else {
          gid("main").scrollLeft = Math.min(
            gid("main").scrollWidth - gid("main").clientWidth,
            gid("main").scrollLeft + 200
          );
        }
      } else if (evt.keyCode == 37) {
        //<-
        if (gid("main").scrollLeft == 0) {
          LiveDocPreviousPage();
        } else {
          gid("main").scrollLeft = Math.max(0, gid("main").scrollLeft - 200);
        }
      } else if (evt.keyCode == 46) {
        //delete
        whiteboard.SetDrawTool("ToolClear");
      } else if (evt.keyCode == 83) {
        //s
        whiteboard.SetDrawTool("");
        _activeButton("#liveActionCursor");
      } else if (evt.keyCode == 80) {
        //p
        whiteboard.SetDrawTool("ToolPen");
        _activeButton("#liveActionPencil");
      } else if (evt.keyCode == 76) {
        //L
        whiteboard.SetDrawTool("ToolLine");
        _activeButton("#liveActionLine");
      } else if (evt.keyCode == 84) {
        //T
        whiteboard.SetDrawTool("ToolText");
        _activeButton("#liveActionText");
      } else if (evt.keyCode == 66) {
        //B
        whiteboard.SetDrawTool("ToolBrush");
        _activeButton("#liveActionHighlighter");
      } else if (evt.keyCode == 78) {
        //N
        whiteboard.SetDrawTool("ToolNote");
        _activeButton("#liveActionNote");
      } else if (evt.keyCode == 86) {
        //V
        whiteboard.SetDrawTool("ToolVideo");
        _activeButton("#liveActionVideo");
      } else if (evt.keyCode == 87) {
        //W
        whiteboard.SetDrawTool("ToolBoard");
        _activeButton("#liveActionBoard");
      } else if (evt.keyCode == 85) {
        //U
        whiteboard.Undo();
      } else if (evt.keyCode == 82) {
        //R
        whiteboard.Redo();
      } else if (evt.keyCode == 70) {
        //F
        $("#liveActionMin").click();
      } else if (evt.keyCode == 90) {
        //Z
        whiteboard.SwitchLastTool();
      }
      return true;
    },
    getItemID() {
      if (this.$route.params.id) return this.$route.params.id;
      else return this.$route.query.id;
    },
    getLessonID() {
      if (this.$route.params.type && this.$route.params.type == "1") {
        return this.$route.params.id;
      }
      return 0;
    },
    getTypeID() {
      if (this.$route.params.type) {
        return this.$route.params.type;
      }
      let name = this.$router.currentRoute.name;
      if (name == "view") {
        return "0";
      } else if (name == "doc" || name == "docview") {
        return "2";
      } else if (name == "atm") {
        return "3";
      } else if (name == "syncroom") {
        return "4";
      }
      return "0";
    },
    onThinkShow() {
      this.thinkList = [];
      webapi
        .GetLessonSoundtrackList(this.getItemID(), this.attachmentID)
        .then(list => {
          if (!list) return;
          for (var item of list) {
            var showitem = new Object();
            showitem.id = item.SoundtrackID;
            showitem.title = item.Title;
            showitem.user = item.UserName; //item.Title;
            if (!item.Duration) {
              showitem.time = "";
            } else {
              showitem.time = `(${item.Duration})`;
            }

            showitem.face = item.AvatarUrl;
            this.thinkList.push(showitem);
          }
        });
      webapi.GetSoundtrackListCount(this.attachmentID).then(res => {
        this.thinkListCount = res;
      });

      //    webapi.GetSoundtrackList(this.attachmentID).then(list=>{
      //       if(!list) return;
      //       for(var item of list)
      //       {
      //           var showitem=new Object();
      //           showitem.id=item.SoundtrackID;
      //           showitem.title=item.Title;
      //           showitem.user=item.UserName;//item.Title;
      //           if(!item.Duration)
      //           {
      //               showitem.time="";
      //           }
      //           else{
      //               showitem.time=`(${item.Duration})`;
      //           }
      //           var ct = new Date();
      //           ct.setTime(item.CreatedDate);
      //           let showCT = ct.Format("yyyy-MM-dd hh:mm:ss");
      //           showitem.date=showCT;

      //           showitem.face=item.AvatarUrl;
      //           this.thinkList.push(showitem);
      //       }
      //   });
    },
    thinkOnCreate() {
      //whiteboard.SetRecord(true);
      this.$refs.syncplayer.SetWebSocket(websocket);
      this.$refs.syncplayer.CreateSync(
        this.attachmentID,
        this.getItemID(),
        this.getAttachmentItemID(this.attachmentID)
      );
    },
    thinkMenuClick(name, id) {
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
        let shareFile = {
          attachmentId: this.attachmentID,
          attachmentName: this.attachmentName,
          attachmentUrl: this.attachmentUrl
        };
        this.changeShareDoc(shareFile);

        //   webapi.GetShareDocumentKey(this.attachmentID,0,this.attachmentName).then(res=>{
        //       var url=location.origin.toLowerCase();
        //       url+="/sync/"+res;
        //       navigator.clipboard.writeText(url);
        //       alert("Share Url has been copied to clipboard!");
        //   });
      } else if (name == "link") {
        var url = location.origin.toLowerCase();
        url += "/sync/" + id;
        navigator.clipboard.writeText(url).then(
          () => {
            this.$Message.success({content: this.$t("Live.CopySyncUrlSuccess"), duration: 3});
          },
          () => {
            this.$Message.error({content: this.$t("Live.CopySyncUrlFailed") + "\n\n" + url,duration: 0,closable: true})
          }
        );
      } else if (name == "edit") {
        //to do
        //{ID:0,Title:"",EnableBackGround:false,EnableSelectVoice:false,EnableRecord:false,BackGroundItemID:0,BackGroundTitle:"",BackGroundTime:"",SelectVoiceItemID:0,SelectVoiceTitle:"",SelectVoiceTime:"",RecordVoiceItemID:0,
        //SyncStatus:0,SyncDate:""}
        this.$refs.syncplayer.EditSync(id, this.attachmentID);
      } else if (name == "delete") {
        this.$Modal.confirm({
          render: h => {
            return h(
              "div",
              {
                style: {
                  "font-size": "16px"
                }
              },
              "Are you sure you want to delete it?"
            );
          },
          onOk: () => {
            //alert("OK")
            //to do
            webapi.DelSoundtrack(id).then(res => {
              for (var i = 0, j = this.thinkList.length; i < j; i++) {
                if (this.thinkList[i].id == id) {
                  this.thinkList.splice(i, 1);
                  break;
                }
              }
            });
          }
        });
      }
    },
    selectMoreThinkClick(evt) {
      this.selectMoreThink.Show = true;
      this.initMoreThink();
    },
    initMoreThink() {
      this.selectMoreThink.List = [];
      webapi.GetSoundtrackList(this.attachmentID).then(list => {
        if (!list || list.length < 1) return;
        for (var item of list) {
          var showitem = new Object();
          showitem.id = item.SoundtrackID;
          showitem.title = item.Title;
          showitem.user = item.UserName; //item.Title;
          showitem.time = item.Duration; //title=item.Title;
          this.selectMoreThink.List.push(showitem);
        }
      });
    },
    onSelectedMoreThinkClick(evt) {
      var tar = evt.currentTarget;
      if (tar.checked) {
        this.selectMoreThink.Selected.push($(tar).val());
      } else {
        var nindex = FindStrInArr(this.selectMoreThink.Selected, $(tar).val());
        if (nindex > -1) {
          this.selectMoreThink.Selected.splice(nindex, 1);
        }
      }
    },
    selectMoreThinkOK() {
      if (this.selectMoreThink.Selected.length < 1) {
        return;
      }
      webapi
        .AddSoundtrack2Lesson(this.getItemID(), this.selectMoreThink.Selected)
        .then(res => {
          this.selectMoreThink = { Show: false, List: [], Selected: [] };
        });
    },
    selectMoreThinkCancel() {
      this.selectMoreThink.Show = false;
    },
    playThinkAction(id) {
      this.thinkCurrentID = id;
      //whiteboard.SetRecord(true);
      this.ChangeStyle4Sync(true);
      //$("#main").find(">div.pageContainer[id!='pageContainer" +GetFixedPageNumber(PageNumber) + "']").remove();
      whiteboard.Clear(); // ClearPath();
      this.ShowSyncObject(PageNumber, false);
      this.$refs.syncplayer.SetWebSocket(websocket);
      this.$refs.syncplayer.playThinkAction(id);
    },
    onPlayBaseAction(data) {
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      if (data.actionType && data.actionType == 19) {
        this.onVideoPlayInfoChange(data);
      } else {
        whiteboard.Play(data);
      }
    },
    onRecordSyncStart() {
      whiteboard.TriggerPageChange();
      whiteboard.TriggerViewChange();
      this.ChangeStyle4Sync(true);
    },
    onRecordSyncEnd() {
      this.ChangeStyle4Sync(false);
      //whiteboard.SetRecord(false);
      whiteboard.Clear();
      $("#main")
        .find(">div.pageContainer[id!='pageContainer" + PageNumber + "']")
        .remove();
      this.ShowSyncObject(PageNumber, false);
    },
    onPlaySyncStart() {
      this.ChangeStyle4Sync(true);
      this.isPause = false;
      this.isPlay = true;
    },
    onPlaySyncGo(time) {
      //console.log("onPlaySyncGo:"+time);
      //$("#livePanelTopCtlWrap").hide();
      this.isPause = false;
      whiteboard.Clear();
      this.ShowSyncObject(PageNumber, false);
      webapi.GetSyncPageActionsByTime(this.thinkCurrentID, time).then(res => {
        for (var action of res.Actions) {
          this.onPlayBaseAction(utf8to16(base64decode(action.Data)));
        }
      });
    },
    onPlaySyncPause() {
      //console.log("onPlaySyncPause");
      //$("#livePanelTopCtlWrap").show();
      this.ChangeStyle4Sync(false);
      this.isPause = true;
      this.ShowSyncObject(PageNumber, false);
    },
    onPlaySyncTo(time, pause) {
      //console.log("onPlaySyncTo:"+time+",isPause:"+pause);
      webapi.GetSyncPageActionsByTime(this.thinkCurrentID, time).then(res => {
        if (res.PageNumber != PageNumber) {
          this.showPageLine = false;
          whiteboard.ToPage(res.PageNumber, (issuccess, pageno) => {
            if (pause) {
              this.ShowSyncObject(pageno, false);
            } else {
              for (var action of res.Actions) {
                this.onPlayBaseAction(utf8to16(base64decode(action.Data)));
              }
            }
          });
        }
      });
    },
    onPlaySyncEnd() {
      this.isPause = false;
      this.isPlay = false;
      this.ChangeStyle4Sync(false);
      whiteboard.Clear();
      this.ShowSyncObject(PageNumber, false);
      //whiteboard.SetRecord(false);
    },
    ChangeStyle4Sync(isplay) {
      if (isplay) {
        $("#livePanelTopCtlWrap").hide();
      } else {
        $("#livePanelTopCtlWrap").show();
      }
    },
    ChangeDrawTool4WhiteBoardDiplayChange(isShow) {
      if (isShow) {
        $(
          "#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionAddPage,#liveActionPlay,#liveActionUndo,#liveActionRedo"
        ).hide();
      } else {
        $(
          "#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionAddPage,#liveActionPlay,#liveActionUndo,#liveActionRedo"
        ).show();
      }
    },
    thinkOnStartMeeeting(evt) {
      // webapi.AddStartMeetingLesson(this.attachmentID,this.attachmentName).then(res=>{
      //     //res.RetData
      //     sessionStorage.setItem("ViewDocAutoStartMeeting","1");
      //     this.$router.push({ name: "live", params: { id: res.RetData } });
      // });

      webapi.UpgradeToNormalLesson(this.getItemID()).then(res => {
        sessionStorage.setItem("ViewDocAutoStartMeeting", "1");
        this.$router.push({ name: "live", params: { id: this.getItemID() } });
        //this.$router.push({ name: "syncmeeting", params: { id: this.getItemID() } });
      });
    },
    thinkOnInviteUser(evt) {
      this.$refs.selectfriends.showInviteUser(true);
    },
    ShareCurrentDoc(evt) {
      var url = location.href;
      navigator.clipboard.writeText(url).then(
        () => {
          this.$Message.success({
            content: this.$t("Live.CopySyncUrlSuccess"),
            duration: 3
          });
        },
        () => {
          this.$Message.error({
            content: this.$t("Live.CopySyncUrlFailed" + "\n\n" + url),
            duration: 0,
            closable: true
          });
        }
      );
    },
    ShareToSyncRoom(evt) {
      this.shareToSyncRoom = true;
    },
    onSelectFriendsOK(arr) {
      //alert(arr.join(","));
      var obj = new Object();
      obj.LessonID = this.getItemID();
      obj.MemberList = new Array();
      for (var userid of arr) {
        var user = new Object();
        user.Role = 3;
        user.MemberID = userid;
        obj.MemberList.push(user);
      }
      webapi.InviteToSyncRoom(obj).then(res => {
        this.$Message.success("Invite success!");
      });
    },
    getVideoPlayer() {
      return this.$refs.livevideoplayer;
    },
    onVideoPlayInfoChange(obj) {
      if (obj.stat == 2) {
        this.getVideoPlayer().Pause();
        $("#liveplayvideo").hide();
      } else if (obj.type == 0) {
        this.getVideoPlayer().Pause();
      } else if (obj.type == 1) {
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

          if (this.isPlay) {
            this.getVideoPlayer().setShowClose(false);
            this.getVideoPlayer().setCanControl(false);
          } else {
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
    NoticePlayVideoInfo(stat, time, vid, url = "", type = 0, save = 1) {
      if (!websocket) return;
      var senddata = new Object();
      senddata.actionType = 19; //play video info
      senddata.stat = stat; //1: play 0:pause 2:close
      senddata.time = time; //current seconds
      senddata.vid = vid; //video id
      senddata.url = url; //video url
      senddata.type = type; //video type 0: video in list 1: video in file
      if (save == 1) {
        var t = this.$refs.syncplayer.getAudioCurrentTime();
        if (t >= 0) {
          senddata.savetime = t;
          senddata.save = 1;
        }
      }
      websocket.sendmessage(
        "",
        base64encode(utf16to8(JSON.stringify(senddata)))
      );
    },
    playVideoTag(attachmentid) {
      webapi.getFavoriteAttachmentDetail(attachmentid).then(d => {
        if (d.FileType == 5) {
          return;
        }
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

        this.getVideoPlayer().setShowClose(true);
        this.getVideoPlayer().setVideoType(1);
        util.ConvertToNewUrl(d.AttachmentUrl, newurl => {
          this.getVideoPlayer().ShowVideo({ id: d.AttachmentID, url: newurl });
        });
      });
    },
    videoOnPlay(ctime, vid, url, type) {
      //console.log("videoOnPlay:"+ctime);
      this.NoticePlayVideoInfo(1, ctime, vid, url, type);
    },
    videoOnPause(ctime, vid, url, type, isFinish) {
      //console.log("videoOnPause:"+ctime);
      if (isFinish) {
        $("#liveplayvideo").hide();
        this.NoticePlayVideoInfo(2, 0, 0, "", 1);
      } else {
        this.NoticePlayVideoInfo(0, ctime, vid, url, type);
      }
    },
    videoOnPlaying(ctime, vid, url, type) {
      //console.log("videoOnPlaying:"+ctime);
      this.NoticePlayVideoInfo(1, ctime, vid, url, type, 0);
    },
    videoOnClose() {
      console.log("videoOnClose");
      this.NoticePlayVideoInfo(2, 0, 0, "", 1);
      $("#liveplayvideo").hide();
    },
    dblClickTip() {
      //$("#liveLessonStat").fadeOut("slow");
      $("#liveLessonStat").animate(
        {
          left: "-500px",
          opacity: 0
        },
        1000,
        function() {
          $("#liveLessonStat").hide();
        }
      );
    },
    clickClose() {
      // this.$router.push("/");
      //this.$router.go(-1);
      //console.log("IsDocEidt:"+IsDocEidt);
      if (IsDocEidt) {
        this.checkExist.needSave = true;
        this.checkExist.show = true;
      } else {
        this.checkExist.needSave = false;
        //this.$router.go(-1);
        //this.$router.push("/");
        //this.$router.push(LastRouterPath);
        this.exitLesson();
      }
    },
    saveAndExitLesson() {
      //this.$router.go(-1);
      //this.$router.push("/");
      //this.$router.push(LastRouterPath);
      this.exitLesson();
    },
    exitLesson() {
      //this.$router.go(-1);
      //this.$router.push("/");
      if (
        LastRouterPath.toLowerCase().indexOf("login") > -1 ||
        LastRouterPath.toLowerCase().indexOf("live") > -1 ||
        LastRouterPath.toLowerCase().indexOf("docview") > -1 ||
        LastRouterPath.toLowerCase().indexOf("join") > -1
      ) {
        this.$router.push("/");
      } else {
        this.$router.push(LastRouterPath);
      }
    },
    showfiles(event) {
      if (this.getTypeID() == "4") {
        //temp lesson
        for (let i = 0; i < event.length; i++) {
          let lineItem = event[i];
          if (lineItem.Status != 0) {
            continue;
          }
          if (lineItem.AttachmentID && lineItem.AttachmentUrl) {
            let eventFile = this._lineItem2EventFile(lineItem, false);
            if (!this.isFileExist(eventFile.id)) {
              this.editingEventFiles.push(eventFile);
            } else {
              this.setFileToReady(eventFile.atmid, lineItem.AttachmentUrl);
            }
          }
        }
      } else if (this.getTypeID() == "2") {
        //attachment id
        let eventFile = {
          id: event.ItemID,
          atmid: event.AttachmentID,
          name: event.Title,
          url: event.AttachmentUrl,
          status: "finished",
          detail: event,
          eventid: 0,
          eventname: "",
          blankpagenumber: "",
          isselected: false,
          ready: true,
          count: 0,
          process: 0
        };
        if (!this.isFileExist(eventFile.id)) {
          this.editingEventFiles.push(eventFile);
        }
      }
    },
    showAttendees() {
      this.orderedUsers = [];
      if (this.getTypeID() == "4") {
        //temp lesson
        webapi.getTopicMember(this.getItemID()).then(res => {
          for (var user of res) {
            let obj = {
              userid: user.MemberID,
              name: user.MemberName,
              role: user.MemberType,
              faceurl:
                user.MemberAvatar == ""
                  ? "/static/images/defaultface.png"
                  : user.MemberAvatar,
              isoffline: false,
              order: 1,
              showtel: false,
              ispresenter: user.MemberType == 2,
              faceclass: "",
              nameclass: user.MemberType == 2 ? "teacher" : "student"
            };
            this.orderedUsers.push(obj);
          }
        });
      } else if (this.getTypeID() == "2") {
      }
    },
    isFileExist(itemid) {
      for (var file of this.editingEventFiles) {
        if (file.id == itemid) {
          return true;
        }
      }
      return false;
    },
    isFileExistInList(name) {
      for (var file of this.editingEventFiles) {
        if (file.name == name) {
          return true;
        }
      }
      return false;
    },
    getAttachmentName(itemid) {
      for (var file of this.editingEventFiles) {
        if (file.id == itemid) {
          return file.name;
        }
      }
      return "";
    },
    getAttachmentItemID(attachmentID) {
      for (var file of this.editingEventFiles) {
        if (file.atmid == attachmentID) {
          return file.id;
        }
      }
      return 0;
    },
    setFileToReady(attachmentid, url) {
      for (var file of this.editingEventFiles) {
        if (file.atmid == attachmentid) {
          file.ready = true;
          file.url = url;
        }
      }
    },
    setSelectFile(attachmentid) {
      for (var file of this.editingEventFiles) {
        if (file.id == attachmentid) {
          file.isselected = true;
        } else {
          file.isselected = false;
        }
      }
    },
    AddFromFav(type = 1) {
      this.$refs.selectfilefromfav.ShowFiles(type);
      return;
      webapi.getMyFavorite(type, -1).then(d => {
        this.favList = [];
        for (let item of d.DocumentList) {
          if (item.Status != 0) {
            continue;
          }
          this.favList.push(this.favList2ShowList(item));
        }
        this.$nextTick(() => {
          this.selectedFav = [];
          $("#favList")
            .find("INPUT[type=checkbox]:checked")
            .prop("checked", false);
        });
        this.selectFav = true;
      });
    },
    AddFromCamera(type, evt) {
      if (type == 1 || !IsKloudSync()) {
        this.showTakePhoto = true;
      } else {
        this.$refs.selectfilefromspace.ShowSpaceFiles();
        // this.selectSpace=true;
        // this.initSelectSpaceAttachment();
      }
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
        count: lineItem.SyncCount,
        process: 0
      };

      return eventFile;
    },
    async selectFavOK(selectedFav) {
      //loger.log(this.selectedFav.join(","));
      if (selectedFav.length < 1) {
        return;
      }
      let isFileExist = false;
      for (var favid of selectedFav) {
        var addName = this.$refs.selectfilefromfav.getFavName(favid);
        if (this.isFileExistInList(addName)) {
          isFileExist = true;
          break;
        }
      }
      if (isFileExist) {
        if (!window.confirm(this.$t("Live.FileExistInList"))) {
          return;
        }
      }
      if (this.getTypeID() == "4") {
        //temp lesson
        webapi.addFav2Topic(this.getItemID(), selectedFav).then(res => {
          this.showfiles(res);
          if (res.length > 0) {
            this.showAttachment(res[res.length - 1].ItemID);
          }
          this.$refs.topicInfo.refreshSyncRoomFileList();
          $("#favList")
            .find("INPUT[type=checkbox]:checked")
            .prop("checked", false);
        });
        this.selectFav = false;
      } else if (this.getTypeID() == "2") {
        //item id
        this.selectFav = false;
        for (var i = 0, j = selectedFav.length; i < j; i++) {
          //console.log(this.selectedFav);
          var res = await webapi.getAttachmentDetailByItemID(selectedFav[i]);
          //console.log(res);
          this.showfiles(res);
          if (i == j - 1) {
            //console.log(3100);
            this.setSelectFile(selectedFav[i]);
            this.attachmentName = res.SourceFileName;
            this.attachmentID = res.AttachmentID;
            this.attachmentUrl = res.AttachmentUrl;
            this.ShowPDF(res.AttachmentUrl, 1);
            // whiteboard.ShowDocument($("#main"),res.AttachmentUrl,1,(issuccess, pdfcount)=>{
            //     PDFCOUNT=pdfcount;
            //     ShowPdfInfo();
            // });
          }
        }
      }
    },
    ShowPDF(url, pagenumber, callback) {//展示文件
      util.ConvertToNewUrl(url, (newurl, success) => {
        whiteboard.ShowDocument(
          $("#main"),
          newurl,
          pagenumber,
          (issuccess, pdfcount) => {
            PDFCOUNT = pdfcount;
            ShowPdfInfo();
            if (callback) callback();
          }
        );
      });
    },
    async selectSpaceOK(selectedSpaceAttachment) {
      if (selectedSpaceAttachment.length < 1) {
        return;
      }
      if (this.getTypeID() == "4") {
        //temp lesson
        webapi
          .addSpace2Topic(this.getItemID(), selectedSpaceAttachment)
          .then(res => {
            this.showfiles(res);
            if (res.length > 0) {
              this.showAttachment(res[res.length - 1].ItemID);
            }
            this.$refs.topicInfo.refreshSyncRoomFileList();
            $("#spaceAttachmentList")
              .find("INPUT[type=checkbox]:checked")
              .prop("checked", false);
          });
        this.selectSpace = false;
      } else if (this.getTypeID() == "2") {
        //item id
        this.selectSpace = false;
        for (var i = 0, j = selectedSpaceAttachment.length; i < j; i++) {
          //console.log(this.selectedFav);
          var res = await webapi.getAttachmentDetailByItemID(
            selectedSpaceAttachment[i]
          );
          //console.log(res);
          this.showfiles(res);
          if (i == j - 1) {
            //console.log(3100);
            this.setSelectFile(selectedSpaceAttachment[i]);
            this.attachmentName = res.SourceFileName;
            this.attachmentID = res.AttachmentID;
            this.attachmentUrl = res.AttachmentUrl;
            this.ShowPDF(res.AttachmentUrl, 1);
            // whiteboard.ShowDocument($("#main"),res.AttachmentUrl,1,(issuccess, pdfcount)=>{
            //     PDFCOUNT=pdfcount;
            //     ShowPdfInfo();
            // });
          }
        }
      }
    },
    fileListMenuClick(name, itemid) {
      if (name == "savetofiles") {
        var title = this.getAttachmentName(itemid);
        var atmid = this.getAttachmentAttachmentID(itemid);
        webapi.SaveAsFavorite(atmid, title).then(res => {
          if (res.RetCode == 0) {
            this.$Message.success("Add to my saved file success!");
          } else {
            this.$Message.error({content: res.ErrorMessage,duration: 0,closable: true})
          }
        });
      } else if (name == "delete") {
        if (this.getTypeID() == "4") {
          //temp lesson
          webapi.removeTopicAttachment(itemid).then(res => {
            this.$Message.success("Delete it success!");
            var atmid = this.getAttachmentAttachmentID(itemid);
            this.removeFileFromList(atmid);
            this.$refs.topicInfo.refreshSyncRoomFileList();
            if (atmid + "" == this.attachmentID + "") {
              if (this.editingEventFiles.length > 0) {
                this.showAttachment(this.editingEventFiles[0].id);
              }
            }
          });
        } else {
          this.$Message.success("Delete it success!");
          var atmid = this.getAttachmentAttachmentID(itemid);
          this.removeFileFromList(atmid);
        }
      }
    },
    getAttachmentAttachmentID(itemid) {
      for (var file of this.editingEventFiles) {
        if (file.id == itemid) {
          return file.atmid;
        }
      }
      return "";
    },
    removeFileFromList(attachmentid) {
      var nIndex = -1;
      for (var i = 0; i < this.editingEventFiles.length; i++) {
        if (this.editingEventFiles[i].atmid == attachmentid) {
          nIndex = i;
        }
      }
      if (nIndex > -1) {
        this.editingEventFiles.splice(nIndex, 1);
      }
    },
    switchFile(evt, isRightClick) {
      var tar = evt.currentTarget;
      var itemid = $(tar)
        .attr("id")
        .replace("eventfile-", "");
      PageNumber = 1;
      this.showAttachment(itemid);
      //this.$router.push({ name: "docview", params: { id: itemid } });
    },
    radExistRoomOnChange() {
      //console.log(this.shareToExistSyncRoom);
      if (this.shareToExistSyncRoom) {
        this.shareToNewSyncRoom = false;
        $("#div_shareToExistSyncRoom").show();
        $("#div_shareToNewSyncRoom").hide();
      }
    },
    radNewRoomOnChange() {
      //console.log(this.shareToNewSyncRoom);
      if (this.shareToNewSyncRoom) {
        this.shareToExistSyncRoom = false;
        $("#div_shareToExistSyncRoom").hide();
        $("#div_shareToNewSyncRoom").show();
      }
    },
    OnShareToNewSyncRoom() {
      this.shareToSyncRoom = false;
    },
    OnShareToExistSyncRoom() {
      this.shareToSyncRoom = false;
    },
    uploadFileInputChange() {},
    onFileDrop(evt) {},
    onVideoDrop(evt) {},
    onVideoDragOver(evt) {},
    onVideoDragLeave(evt) {},
    ...mapMutations(["changeShareDoc"])
  },
  watch: {
    $route(to, from) {
      // console.log("watch route to:" + to + ",from:" + from);
      // console.log(from);
      // console.log(to);
      this.showAttachment(to.params.id);
    }
  }
};
</script>