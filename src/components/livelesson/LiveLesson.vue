<template>
    <div id="liveView">
        <live-lesson-header :Role="role" :TopTitle="headTitle+getSelectAttachmentName" ref="liveLessonHead"></live-lesson-header>
        <div id="live-lesson" class="live-lesson">
            <div id="live-welcomepage" class="live-welcomepage" style="display:none; ">
                <div class="live-welcomepage-container">
                    <div class="live-welcomepage-content-image">
                        <span v-if="isKloudSync" style="font-size: 30px;font-weight: bold;">KloudSync</span>
                        <span v-else>
                            <img width="236px" height="40px" src="/static/images/logo-peertime.svg">
                        </span>
                    </div>
                    <div class="live-welcomepage-content-welcome">{{welcomePageInfo.Title}} {{welcomePageInfo.Status}}</div>
                    <div class="live-welcomepage-content-nofile">{{welcomePageInfo.YouCan}}</div>
                    <div class="live-welcomepage-btnscontainer">
                        <div class="live-welcomepage-btns" id="live-welcomepage-createblankpage"> <Button @click="onWelCreateBlankPage" type="ghost" icon="document" style="font-size:16px;">{{$t("Live.CreateBlankPage")}}</Button></div>
                        <div class="live-welcomepage-btns" id="live-welcomepage-inviteattendee"> <Button @click="onWelInviteAttendee" type="ghost" icon="ios-people-outline" style="font-size:16px;">{{$t("Live.InviteAttendee")}}</Button></div>
                        <div class="live-welcomepage-btns" id="live-welcomepage-sharedocument"> <Button @click="onWelShareDocument" type="ghost" icon="document-text" style="font-size:16px;">{{$t("Live.ShareDocument")}}</Button></div>
                        <div class="live-welcomepage-btns" id="live-welcomepage-sharescreen"> <Button @click="onWelShareScreen" type="ghost" icon="ios-monitor-outline" style="font-size:16px;">{{$t("Live.ShareScreen")}}</Button></div>
                    </div>
                </div>
            </div>
            <div id="liveHolderOuter" style="position:relative;text-align:left;">
                <div
                    id="live2Mouse"
                    style="position:absolute; left:0px; top:0px; z-index:112; margin:-8px 0px 0px -3px;opacity:0.6;display:none;"
                >
                    <Icon type="mouse" size="20" style="color:red;"></Icon>
                </div>
                <div
                    id="live2MouseClick"
                    style="position:absolute; left: 0px; top: 0px;z-index:113;"
                >
                    <div id="liveMouseContainer" class="liveMouseContainer"></div>
                </div>
                <div id="liveRecordTip" style="position:absolute; left:0px; top:0px; z-index:114; margin:3px 0px 0px 3px;display:none;cursor:pointer;" title="Recording">
                    <Icon type="disc" size="20" style="color:red;"></Icon>
                </div>
                <div v-show="headTitleShow && isLessonStart" id="liveLessonStat" @dblclick="dblClickTip($event);" style="position:fixed; left:0px; top:0px; z-index:114; margin:3px 0px 0px 3px;">
                    <span :style="'background-color:'+headTitleColor+';'" style="border-radius: 100%;padding: 2px;display:inline-block;width:20px; height:20px;text-align:center;line-height:15px;vertical-align:middle;">
                        <Icon type="calendar" size="12" style="color:white;"></Icon></span>
                    <span :style="'color:'+headTitleColor+';'" style="font-weight:bold;">{{headTitle}}</span><span>{{headLessonTitle}}</span>
                </div>
                <div
                    id="livePdfProgress" title="Downloading file" style="position:absolute; left:5px; top:5px;color:red;display:none; z-index:99999;font-size:16px;"
                >{{downloadProcessPercent}}%</div>
                <div id="main" class="maincontainer" style="position:relative;"></div>
                <div id="screenshare" class="maincontainer" style="display:none;"></div>
                <div
                    id="liveplayvideo"
                    class="maincontainer"
                    style="display:none; background-color:black; overflow:hidden;"
                >
                    <video-player ref="livevideoplayer" @videoOnPlay="videoOnPlay" @videoOnPlaying="videoOnPlaying" @videoOnPause="videoOnPause" @videoOnClose="videoOnClose"></video-player>
                    <!--<video style="height:99%; width:100%;" @play="videoOnPlay()" @pause="videoOnPause()" oncontextmenu="return false;"></video>-->
                </div>
                <div
                    id="liveplayaudio"
                    style="width:0px; height:0px;position:absolute;left:-1000px;"
                ></div>
                <div
                    id="liveplayvoice"
                    style="width:0px; height:0px;position:absolute;left:-1000px;"
                ></div>
                <div id="liveToolbarWrap" class="liveToolbar">
                    <section id="liveToolbar">
                        <section class="liveToolbar-zoom">
                            <span id="livePageNumber" class="toolbar-label"></span>
                            <span
                                id="livePageCount"
                                class="toolbar-label"
                                style="margin-right:14px"
                            ></span>
                            <span
                                class="icon icon-zoomin"
                                id="liveButtonZoomIn"
                                :title="$t('Live.ZoomIn')"
                            ></span>
                            <select
                                id="liveSelectScale"
                                title="Zoom"
                                style="background-color:transparent; border:0px; font-size: 12px; color:#333;"
                            >
                                <option
                                    id="liveCustomScaleOption"
                                    title
                                    value="custom"
                                    disabled="disabled"
                                    hidden
                                ></option>
                                <option title value="0.5">50%</option>
                                <option title value="0.75">75%</option>
                                <option title value="1" selected="selected">100%</option>
                                <option title value="1.25">125%</option>
                                <option title value="1.5">150%</option>
                                <option title value="2">200%</option>
                                <option title value="3">300%</option>
                                <option title value="4">400%</option>
                            </select>
                            <span
                                class="icon icon-zoomout"
                                id="liveButtonZoomOut"
                                :title="$t('Live.ZoomOut')"
                            ></span>
                            <span id="liveButtonSizeMode" class="liveButtonSizeModeWidth"></span>
                            <span
                                class="icon icon-left"
                                id="liveButtonPrevious"
                                :title="$t('Live.PreviousPage')"
                            ></span>
                            <span></span>
                            <span
                                class="icon icon-right sidebar-open"
                                id="liveButtonNext"
                                :title="$t('Live.NextPage')"
                            ></span>
                        </section>
                    </section>
                </div>

                <div
                    id="livePanelTopCtlWrap"
                    class="livePanelTopCtl-wrap attendee-view attendee-view-open"
                >
                    <section id="livePanelTopCtl" style="display: flex;justify-content: center;">
                        <div v-show="false" id="liveRecordLessonCtl" title="Record" class="liveRecordLessonCtl" @click="liveRecordLessonClick($event);" ><img src="/static/images/autorecord_start.svg" />
                        </div>
                        <Tooltip
                            id="liveShareDocumentTip"
                            :content="$t('Live.LiveDoc')"
                            placement="top"
                            transfer
                        >
                            <div class="livePanelTopCtlbtn livemode selected">
                                <span
                                    class="icon icon-live-doc"
                                    id="liveShareDocument"
                                    @click="ShareDocument(false)"
                                ></span>
                            </div>
                        </Tooltip>
                        <Tooltip
                            id="liveShareScreenTip"
                            :content="$t('Live.ShareScreen')"
                            placement="top"
                            transfer
                        >
                            <div class="livePanelTopCtlbtn livemode right-border">
                                <span
                                    class="icon icon-screen"
                                    id="liveShareScreen"
                                    @click="ShareScreen"
                                ></span>
                            </div>
                        </Tooltip>
                        <Poptip
                            @on-popper-show="disableAttenToolTip=true"
                            @on-popper-hide="disableAttenToolTip=false;onAttendeesPopHide();"
                        >
                            <Tooltip
                                id="liveAttendeesTip"
                                :content="$t('Live.Attendees')+'('+orderedUsers.length+')'"
                                class="pad-l-10"
                                placement="top"
                                transfer
                                :disabled="disableAttenToolTip"
                            >
                                <div class="livePanelTopCtlbtn">
                                    <span class="icon icon-attendee"></span>
                                </div>
                            </Tooltip>
                            <div slot="content">
                                <div id="liveAttendeesContainer" style="width:250px;">
                                    <div style="text-align: left;padding-top: 10px;height: 60px;">
                                        <Button style="font-size:13px;" type="primary" @click="showInviteUser" shape="circle" icon="person-add">{{$t("Live.InviteUser")}}</Button>
                                        <Button style="float:right;font-size:14px;" @click="ShowAudienceList" type="info" shape="circle" icon="ios-people">Audience({{audienceCount}})</Button>
                                    </div>
                                    <div class="meeting-userlist" id="liveUserList" >
                                        <div
                                            class="meeting-user"
                                            :class="{offline:item.isoffline}"
                                            :id="'user-'+item.userid"
                                            :key="item.userid"
                                            :role="item.role"
                                            :ispresenter="item.ispresenter"
                                            :sid="item.sid"
                                            v-for="item in orderedUsers"
                                        >
                                            <ul class="meeting-userul">
                                                <li class="meeting-user-face" :class="item.faceclass">
                                                    <img :src="item.faceurl">
                                                </li>
                                                <li
                                                    class="meeting-user-name"
                                                    :class="item.nameclass"
                                                >{{item.name}}</li>
                                                <li v-show="item.showtel">
                                                    <Icon
                                                        type="ios-telephone"
                                                        size="16"
                                                        style="cursor:pointer; color:green;padding:8px 0px 0px;"
                                                        @click.native="ClickUserPhone(item.userid);"
                                                    ></Icon>
                                                </li>
                                                <li class="meeting-user-menu" style="">
                                                    <Dropdown trigger="hover" style="text-align:left;" placement="right" @on-visible-change="userListMenuVisibleChange($event,item.userid)" @on-click="userListMenuClick($event,item.userid)">
                                                        <span>
                                                            <Icon type="android-more-vertical" size="20" style="cursor:pointer;padding:5px 2px 0px 8px;" ></Icon>
                                                        </span>
                                                        <DropdownMenu slot="list" style="text:left;width:160px;">
                                                            <DropdownItem name="makepresenter" :id="'makepresenter'+item.userid" style="float:none;">
                                                                <Icon type="person"></Icon>&nbsp;{{$t("Live.MakePresenter")}}
                                                            </DropdownItem>
                                                            <DropdownItem name="promotestudent" :id="'promotestudent'+item.userid" style="float:none;">
                                                                <Icon type="ios-body-outline"></Icon>&nbsp;{{$t("Live.PromoteStudent")}}
                                                            </DropdownItem>
                                                            <DropdownItem name="inviteuser" :id="'inviteuser'+item.userid" style="float:none;">
                                                                <Icon type="ios-personadd"></Icon>&nbsp;{{$t("Live.InviteUser")}}
                                                            </DropdownItem>
                                                            <DropdownItem name="invitelink" :id="'invitelink'+item.userid" style="float:none;">
                                                                <Icon type="link"></Icon>&nbsp;{{$t("Live.InviteLink")}}
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div id="liveAudienceContainer" style="display:none;width:250px;overflow:auto;">
                                    <div style="text-align:center;font-size:18px;border-bottom:solid 1px #ccc;margin-bottom:10px;">
                                        <span style="float:left;cursor:pointer;" @click="HideAudienceList"><Icon type="chevron-left"></Icon></span>
                                        Audience({{audienceCount}})                                    
                                    </div>
                                    <div
                                        class="meeting-user"
                                        :class="{offline:item.isoffline}"
                                        :id="'user-'+item.userid"
                                        :key="item.userid"
                                        v-for="item in audienceList"
                                    >
                                        <ul class="meeting-userul">
                                            <li class="meeting-user-face audience">
                                                <img :src="item.faceurl">
                                            </li>
                                            <li
                                                class="meeting-user-name"
                                                :class="item.nameclass"
                                            >{{item.name}}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Poptip>
                        <Poptip
                            v-model="showFileList"
                            @on-popper-show="disableFileToolTip=true"
                            @on-popper-hide="disableFileToolTip=false"
                            placement="top-end"
                            id="liveShowFileListPopup"
                        >
                            <Tooltip
                                :content="$t('Live.Files')+'('+editingEventFiles.length+')'"
                                placement="top"
                                id="liveShowFileListTip"
                                transfer
                                :disabled="disableFileToolTip"
                            >
                                <div class="livePanelTopCtlbtn" id="liveShowFileListBtn">
                                    <span class="icon icon-file"></span>
                                </div>
                            </Tooltip>
                            <div id="liveFileList" class="livefilelist" slot="content">
                                <Upload
                                    v-if="false"
                                    ref="liveFileUpload"
                                    type="drag"
                                    :action="uploadAction"
                                    :headers="uploadHeaders"
                                    :show-upload-list="false"
                                    :default-file-list="editingEventFiles"
                                    :before-upload="handleEventFileBeforeUpload"
                                    :on-progress="handleEventFileProgress"
                                    :on-success="handleEventFileSuccess"
                                    :on-error="handleEventFileError"
                                    class="liveFileUploadStyle"
                                    accept="image/jpeg, image/png, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                >
                                    <div
                                        style="text-align: center;height: 84px;background: #F8FDFF; padding-top: 9px;"
                                    >
                                        <img
                                            class="live-file-thumbnail"
                                            src="/static/images/uploadfile.svg"
                                            style="width:30px;"
                                        >
                                        <p>{{$t("Live.ClickToUpload")}}</p>
                                    </div>
                                </Upload>
                                <div
                                    class="liveFileUploadStyle"
                                    style="text-align: center;height: 84px;background: #F8FDFF; padding-top: 2px;"
                                    v-if="true || getIsShowUploadFile"
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
                                        >
                                        <img
                                            class="live-file-thumbnail"
                                            src="/static/images/uploadfile.svg"
                                            style="width:30px;"
                                        >
                                        <div>{{$t("Live.ClickToUpload")}}</div>
                                        <div>
                                            <input type="checkbox" id="liveUploadFile2Fav">
                                            <label
                                                for="liveUploadFile2Fav"
                                                style="line-height:24px;"
                                            >{{$t("Live.UploadTomyfiles")}}</label>
                                        </div>
                                        <div style="position: absolute;top: 2px;right: 5px;cursor:pointer;" @click.stop="AddFromCamera(1,$event);"><Icon size="22" type="camera"></Icon></div>
                                    </label>
                                </div>
                                <Button
                                    type="primary"
                                    class="livefromfavorite"
                                    v-if="true || getIsShowUploadFile"
                                    @click="AddFromFav(1);"
                                >{{$t("Live.UploadFromFiles")}}</Button>
                                <Button
                                    type="primary"
                                    class="livefromcamera"
                                    v-if="true || getIsShowUploadFile"
                                    @click="AddFromCamera(0,$event);"
                                >{{IsKloudSync?$t("Live.UploadFromSpace"):$t('AddLesson.SelectLectures')}}</Button>
                                <Button type="primary" class="livefromblankpage" @click="onWelCreateBlankPage();">{{$t("Live.UploadBlankPage")}}</Button>
                                <Progress
                                    v-show="fileUploading"
                                    :percent="uploadPercentage"
                                    hide-info
                                ></Progress>
                                <div
                                    class="liveFileWrap"
                                    style="overflow:auto; padding-top:2px; height:265px;"
                                >
                                    <div
                                        class="live-file"
                                        :class="{selected:item.isselected,converting:!item.ready}"
                                        v-for="item in editingEventFiles"
                                        :ready="item.ready?1:0"
                                        :id="'eventfile-'+item.id"
                                        :key="item.id"
                                        :atmid="item.atmid"
                                        @click="switchFile($event,false);"
                                        @dblclick="switchFile($event,true);"
                                    >
                                        <!--<img class="live-file-thumbnail" :src="item.url">-->
                                        <img
                                            class="live-file-thumbnail"
                                            src="/static/images/file.svg"
                                            style="width: 30px;"
                                        >
                                        <div :class="getFileMenuCss">                                                                                       
                                            <!--<span class="icon icon-filesdelete" title="Delete" @click.stop="handleRemoveEventFile(item)"></span>-->
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
                                        <div class="live-file-item-sync" @click.stop="">
                                            <span class="icon icon-eye" title="View" @click="fileListSyncClick($event,item.id)"></span>
                                            <span @click="fileListSyncClick($event,item.id)">{{item.count}}</span>
                                        </div>
                                        <div class="live-file-item-more" @click.stop="">
                                             <Dropdown trigger="hover" placement="bottom-end" @on-click="fileListMenuClick($event,item.id)">
                                                <span>
                                                    <Icon type="android-more-vertical" size="20" style="cursor:pointer;padding:0px 2px 0px 8px;" ></Icon>
                                                </span>
                                                <DropdownMenu slot="list" >
                                                    <DropdownItem name="savetofiles">
                                                        <Icon type="plus-round"></Icon>&nbsp;Add to my saved files
                                                    </DropdownItem>
                                                    <DropdownItem name="delete">
                                                        <Icon type="close-round"></Icon>&nbsp;{{$t("Base.Delete")}}
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
                                <div class="livePanelTopCtlbtn" style="">
                                    <span class="icon icon-yinxiang"></span>
                                </div>
                            </Tooltip>
                            <div id="liveMoreAction" style="" slot="content">
                                <div id="liveThink" style="width:350px;">
                                    <div
                                        style="color:#2db7f5; text-align:left; font-size:18px; border-bottom:1px solid #ccc;"
                                    >{{getSelectAttachmentName}}</div>
                                    <div style="max-height:500px;overflow:auto;">
                                        <div v-if="thinkList.length==0" style="padding:10px 0px 5px;text-align:center;">
                                            <div><Icon type="ios-information-outline" size="48"></Icon></div>
                                            <div> 0 sync selected</div>
                                           
                                        </div>
                                        <div class="liveThinkitem" :key="item.id" :id="'liveThinkitem'+item.id" v-for="item in this.thinkList">
                                            <Dropdown trigger="click" placement="bottom-end" style="margin-left: 0px;text-align:left;" @on-click="thinkMenuClick($event,item.id)"
                                                >
                                            <div class="liveThinkitemleft">
                                                <div class="liveThinkitemtitle">{{item.title}}</div>
                                                <div class="liveThinkitemdetail">
                                                    <Avatar :src="item.face" size="small" />
                                                    <span class="liveThinkitemusername">{{item.user}}</span>
                                                    <span class="liveThinkitemtime">{{item.time}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.date}}</span>
                                                </div>
                                            </div>
                                            <DropdownMenu slot="list" >
                                                        <DropdownItem name="play">
                                                            <Icon type="play"></Icon>&nbsp;&nbsp;{{$t("Base.Play")}}
                                                        </DropdownItem>
                                                        <DropdownItem name="share" v-show="!thinkShareMode">
                                                            <Icon type="android-share-alt"></Icon>&nbsp;&nbsp;{{$t("Base.Share")}}
                                                        </DropdownItem>
                                                        <DropdownItem name="link" v-show="!thinkShareMode">
                                                            <Icon type="link"></Icon>&nbsp;&nbsp;{{$t("Base.ShareLink")}}
                                                        </DropdownItem>
                                                        <DropdownItem name="edit" v-show="thinkMode && !thinkShareMode">
                                                            <Icon type="edit"></Icon>&nbsp;&nbsp;{{$t("Base.Edit")}}
                                                        </DropdownItem>
                                                        <DropdownItem name="delete" v-show="thinkMode && !thinkShareMode">
                                                            <Icon type="ios-trash-outline"></Icon>&nbsp;&nbsp;{{$t("Base.Delete")}}
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
                                                            <Icon type="play"></Icon>&nbsp;&nbsp;{{$t("Base.Play")}}
                                                        </DropdownItem>
                                                        <DropdownItem name="share" v-show="!thinkShareMode">
                                                            <Icon type="android-share-alt"></Icon>&nbsp;&nbsp;{{$t("Base.Share")}}
                                                        </DropdownItem>
                                                        <DropdownItem name="edit" v-show="thinkMode && !thinkShareMode">
                                                            <Icon type="edit"></Icon>&nbsp;&nbsp;{{$t("Base.Edit")}}
                                                        </DropdownItem>
                                                        <DropdownItem name="delete" v-show="thinkMode && !thinkShareMode">
                                                            <Icon type="ios-trash-outline"></Icon>&nbsp;&nbsp;{{$t("Base.Delete")}}
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="liveThinkSelectMore" v-show="thinkMode==false && thinkShareMode==false">
                                        <span style="cursor:pointer;" @click="selectMoreThinkClick">+{{$t("Live.SelectMoreThink")}}({{thinkListCount}})</span>
                                    </div>
                                    <div class="liveThinkSelectCreate" v-show="thinkMode && thinkShareMode==false">
                                        <Button
                                            @click="thinkOnStartMeeeting($event)"
                                            type="info"
                                            size="large"
                                            icon="ios-people"
                                            style="color: white;padding: 8px 20px;border-radius: 20px;margin-right:30px;"
                                        >{{$t("Live.StartMeeting")}}</Button>
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
                            @on-popper-show="disableThinkToolTip=true;onMoreActionShow();"
                            @on-popper-hide="disableThinkToolTip=false;onThinkHide();"
                            placement="top"
                            v-show="showUploadFile && !thinkMode"
                        >
                            <Tooltip
                                :content="isLessonFinished?$t('Live.LiveDocRecord'):$t('Live.MoreAction')"
                                placement="top"
                                transfer
                                :disabled="disableThinkToolTip"
                            >
                                <div class="livePanelTopCtlbtn" style="">
                                    <span class="icon" :class="isLessonFinished?'icon-play':'icon-more'" style="padding-left:3px;"></span>
                                </div>
                            </Tooltip>
                            <div id="liveMoreAction" style="" slot="content">
                                <div id="liveMoreControls" style="text-align:left;">
                                    <div style="padding:10px;font-size:16px; line-height:22px;border-bottom:1px solid #d3d3d3;cursor:pointer;" @click="ShowRecordLessonView($event)">
                                        <span class="icon icon-live-record" style="font-size:22px;"></span>
                                        <span>{{$t('Live.LiveDocRecord')}}</span>
                                    </div>
                                    <div v-show="showUploadFile && !thinkMode&& !thinkShareMode" class="liveMoreAction-MuteAll" @click="MuteAllAudio(true);">
                                        <span class="icon icon-mute" style="color:red;font-size:22px;"></span>
                                        <span>{{$t('Live.MuteAll')}}</span>
                                    </div>
                                    <div v-show="showUploadFile && !thinkMode&& !thinkShareMode" class="liveMoreAction-UnmuteAll"  @click="MuteAllAudio(false);">
                                        <span class="icon icon-unmute" style="color:#468ee1;font-size:22px;"></span>
                                        <span>{{$t('Live.UnmuteAll')}}</span>
                                    </div>
                                </div>
                                <div id="liveRecordLesson" style="display:none;width:250px;max-height:500px;">
                                    <div v-if="this.recordLessonList.length==0">Preparing for the recording lesson...</div>
                                    <div class="liveRecordLesson" :key="item.id" :id="'liveRecordLesson'+item.id" v-for="item in this.recordLessonList">
                                        <div style="display:flex;" @click="recordLessonClick($event,item.id)">
                                        <span> <img
                                            class="live-file-thumbnail"
                                            src="/static/images/video.svg"
                                            style="width: 30px;"
                                        ></span>
                                        <span>{{item.title}}</span>
                                        <span style="padding:4px 0px 0px 60px;"><Icon size="22" title="分享" type="android-share-alt" @click.stop="recordLessonShareClick($event,item.id)"></Icon></span>
                                        </div>
                                    </div>
                                </div>                                
                            </div>
                        </Poptip>
                        <Poptip
                            id="liveSettingTip"
                            @on-popper-show="disableSettingToolTip=true"
                            @on-popper-hide="disableSettingToolTip=false"
                            placement="top"
                        >
                            <Tooltip
                                :content="$t('Live.Setting')"
                                placement="top"
                                transfer
                                :disabled="disableSettingToolTip"
                            >
                                <div class="livePanelTopCtlbtn">
                                    <span class="icon icon-setting"></span>
                                </div>
                            </Tooltip>
                            <div id="liveSetting" style="width:300px;" slot="content">
                                <control-setting ref="controlsetting" @onCameraChange="onCameraChange" @onMicChange="onMicChange" @onSpeaking="OnSpeaking" @onSpeakerChange="onSpeakerChange" @afterSaveControlSetting="AfterSaveControlSetting"></control-setting>
                            </div>
                        </Poptip>
                        <Tooltip
                                :content="$t('Base.Exit')"
                                placement="top"
                                transfer
                            >
                                <div v-show="isLessonFinished" class="livePanelTopCtlbtn" style="background:#000;" @click="clickClose(false);">
                                    <span class="icon icon-close"></span>
                                </div>
                            </Tooltip>
                        
                    </section>
                </div>
            </div>
            <div id="liveControlWindow" :class="(isLessonStart || thinkMode)? 'liveControlWindowStart':''">
                <div id="livePanelOperation" class="live-main-panel">
                    <div class="live-action-head" style="display: none;"></div>
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
                    <p class="live-action-tool-wrap">
                        <a class="live-pdf-action" title="启用/禁用 摄像头">
                            <span
                                class="icon"
                                :class="getWebCamStyle"
                                @click="ToggleLoaclVideoEx($event);"
                            ></span>
                        </a>
                        <a class="live-pdf-action" title="启用/禁用 麦克风">
                            <span
                                class="icon"
                                :class="getMicStyle"
                                @click="ToggleLoaclAudioEx($event);"
                            ></span>
                        </a>
                    </p>
                    <a class="live-pdf-action" id="liveActionPlay2" style="display:none;">
                        <span class="icon icon-next"></span>
                    </a>
                    <a class="live-pdf-action" id="liveActionMin" title="全屏(F)">
                        <span class="icon icon-full-size"></span>
                    </a>
                    <a class="live-pdf-action" id="liveActionEnd" title="退出" @click="clickClose(true);">
                        <span class="icon icon-quit1" style="color:red;"></span>
                    </a>
                    <!--<a class="live-pdf-action" id="liveActionPicture"><span class="live-icon live-icon-picture"></span></a>-->
                </div>
                <div
                    id="liveActionToolsdiv"
                    style="position:absolute; left:28px; top:280px; float:left; width:56px; z-index:11;display:none;"
                >
                    <div
                        style="width:0;height:0;border: 10px solid transparent;border-right-color: #2f3d4a; float:left; margin-top:30px;"
                    ></div>
                    <div id="liveActionToolscontain" class="liveActionToolscontain" tabindex="1005">
                        <a class="live-pdf-action-white" @click="switchTab($event);">
                            <span class="icon icon-webcam" id="livetab-webcam"></span>
                        </a>
                        <a class="live-pdf-action-white" @click="switchTab($event);">
                            <span class="icon icon-attendee" id="livetab-users"></span>
                        </a>
                        <a class="live-pdf-action-white" @click="switchTab($event);">
                            <span class="icon icon-file" id="livetab-files"></span>
                        </a>
                        <a class="live-pdf-action-white" @click="switchTab($event);">
                            <span class="icon icon-chat" id="livetab-chat"></span>
                        </a>
                        <a class="live-pdf-action-white" @click="switchTab($event);">
                            <span class="icon icon-video" id="livetab-records"></span>
                        </a>
                        <a class="live-pdf-action-white" @click="switchTab($event);">
                            <span class="icon icon-setting" id="livetab-setting"></span>
                        </a>
                    </div>
                </div>
                <div id="livePanelMeeting" class="live-main-panel">
                    <div class="meeting-header">
                        <span class="meeting-title"></span>
                        <div class="meeting-panel-actions">
                            <!--<a class="meeting-panel-action" id="liveMinPanelMeeting"><span class="k-icon k-i-minimize"></span></a>-->
                            <a
                                class="meeting-panel-action"
                                @click="clickClose()"
                                style="display:none;"
                            >
                                <span class="k-icon k-i-close"></span>
                            </a>
                        </div>
                    </div>
                    <div
                        id="livePrepareInfo"
                        v-show="isShowPrepareInfo"
                        style="text-align:left; float:left;height:30px; line-height:30px;width:255px; position:absolute; right:0px;"
                    >
                        <span style="color:green;">{{$t("Base.Preparing")}}</span>
                        <span
                            style="color:blue; cursor:pointer;"
                            @click.stop="prepareChangeLecture"
                        >({{welcomeMessagePrepareName}})</span>
                    </div>
                    <div id="livectlheadbar" style="width:230px;display:none;">
                        <span
                            id="liveheadteachname"
                            v-show="isShowClassRoomName"
                            style="text-align:left; float:left;height:30px; line-height:30px;width:230px; margin-top:-25px;"
                        >{{welcomeMessageTeacherName}} Klassroom{{getAudioToolText}}</span>
                        <span :class="isLessonStart?'':'hide'" style="float:right;">
                            <a id="liveActionEnd2" @click="clickClose(true)">
                                <span class="icon icon-quit"></span>
                            </a>
                        </span>
                        <span style="float:right;">
                            <a id="liveActionMin2">
                                <span class="icon icon-fullscreen"></span>
                            </a>
                        </span>
                    </div>
                    <lesson-info :lessonId="eventId" v-if="showLessonInfo"></lesson-info>
                    <div id="liveControl" class="livecontrol" style="display:none;">
                        <a
                            class="live-ctl-btn"
                            id="live-ctl-toggle-audio"
                            @click="ToggleLoaclAudio();"
                            v-if="isLessonStart"
                        >
                            <span class="live-ctl-icon live-ctl-icon-mic"></span>
                        </a>
                        <span style="padding-left:20px;"></span>
                        <a
                            class="live-ctl-btn"
                            id="live-ctl-toggle-video"
                            @click="ToggleLoaclVideo();"
                            v-if="isLessonStart"
                        >
                            <span class="live-ctl-icon live-ctl-icon-camera"></span>
                        </a>
                        <span style="padding-left:20px;"></span>
                        <a
                            class="live-ctl-btn"
                            id="live-ctl-switch-camera"
                            @click="SwitchCamera($event);"
                            v-if="isLessonStart"
                        >
                            <span class="live-ctl-icon live-ctl-icon-switchcamera"></span>
                        </a>
                    </div>
                    <div class="liveControlWrap" style="display:none;">
                        <div id="liveShareControl" class="liveShareControl">
                            <a
                                id="liveShareDocument3"
                                class="live-share-btn"
                                @click="ShareDocument(false)"
                            >
                                <span class="icon icon-file"></span>
                            </a>
                            <h3>File</h3>
                            <a id="liveShareScreen3" class="live-share-btn" @click="ShareScreen">
                                <span class="icon icon-screen"></span>
                            </a>
                            <h3>Screen</h3>
                            <a id="liveShareMeeting3" class="live-share-btn" @click="ShareMeeting">
                                <span class="icon icon-webcam"></span>
                            </a>
                            <h3>Webcam</h3>
                        </div>
                        <div id="liveTab" class="livetab">
                            <ul>
                                <li title="Users" class="livetab-active">
                                    <span class="icon icon-attendee" @click="closeTab();"></span>
                                    <span
                                        class="icon icon-attendee"
                                        id="livetab-users2"
                                        @click="switchTab($event);"
                                    ></span>
                                </li>
                                <li title="Files">
                                    <span class="icon icon-files" @click="closeTab();"></span>
                                    <span
                                        class="icon icon-files"
                                        id="livetab-files2"
                                        @click="switchTab($event);"
                                    ></span>
                                </li>
                                <li title="Chat">
                                    <span class="icon icon-chat" @click="closeTab();"></span>
                                    <span
                                        class="icon icon-chat"
                                        id="livetab-chat2"
                                        @click="switchTab($event);"
                                    ></span>
                                </li>
                                <li title="Record">
                                    <span class="icon icon-record" @click="closeTab();"></span>
                                    <span
                                        class="icon icon-record"
                                        id="livetab-records2"
                                        @click="switchTab($event);"
                                    ></span>
                                </li>
                                <li title="Setting">
                                    <span class="icon icon-setting" @click="closeTab();"></span>
                                    <span
                                        class="icon icon-setting"
                                        id="livetab-setting2"
                                        @click="switchTab($event);"
                                    ></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="liveControlTabWrap">
                        <!--<div id="liveFileList" class="livefilelist" :style="tabHeightStyle">-->
                        <div id="liveChat" style="width:100%; height:100%; display:none;">
                            <h3 style="margin-bottom:3px;">Chat</h3>
                            <rong-cloud-view ref="chatview"></rong-cloud-view>
                        </div>

                        <div id="liveRecords" style="text-align:left; display:none;" slot="content">
                            <h3>Live Records</h3>
                            <Progress
                                v-show="videoUploading"
                                :percent="uploadVideoPercentage"
                                hide-info
                            ></Progress>
                            <div style="padding:0px 25px 5px 15px;">
                                <span style="font-weight:bold;">Public Files</span>
                                <span style="float:right; cursor:pointer;">
                                    <i
                                        class="ivu-icon ivu-icon-chevron-up"
                                        @click="toggleVideoList($event);"
                                    ></i>
                                </span>
                            </div>
                            <div id="liveVideoList" style="padding:0px; margin:0px;">
                                <div
                                    style="padding:5px 0px;margin:0px 10px 6px;"
                                    class="live-file"
                                    :class="{selected:item.isselected}"
                                    v-for="item in videoFileList"
                                    :id="'videofile-'+item.id"
                                    @click="switchVideo($event);"
                                    @dblclick="switchVideo($event);"
                                >
                                    <span
                                        style="cursor:pointer; padding:0px 0px 0px 5px;"
                                        @click="PlayRecord"
                                    >
                                        <Icon type="ios-videocam" title="Play" size="20"></Icon>
                                    </span>
                                    <span>&nbsp;{{item.title}}</span>
                                </div>
                            </div>
                            <div
                                id="liveUploadVideoContainer"
                                class="liveVideoUploadStyle"
                                style="text-align: center;height: 84px;background: #F8FDFF; padding-top: 9px;"
                                v-if="true ||getIsShowUploadFile"
                                @dragend="onVideoDragLeave"
                                @dragleave="onVideoDragLeave"
                                @dragover.prevent="onVideoDragOver"
                                @drop.prevent="onVideoDrop"
                            >
                                <label style="height:100%;width:100%; display:inline-block;">
                                    <input
                                        id="liveUploadVideoInput"
                                        type="file"
                                        @change="uploadVideoInputChange(this);"
                                        accept="video/mp4"
                                        style="width:0px; position:relative;left:-200px;"
                                    >
                                    <img
                                        class="live-file-thumbnail"
                                        src="/static/images/uploadfile.svg"
                                        style="width:50px;"
                                    >
                                    <p>Click or drag file here to upload.</p>
                                </label>
                            </div>
                            <Button
                                type="primary"
                                class="livefromfavorite"
                                style="left:52px;bottom:12px;"
                                v-if="true ||getIsShowUploadFile"
                                @click="AddFromFav(2);"
                            >Upload from saved files.</Button>
                        </div>
                        <div id="liveWebcams" style="width:100%;height:100%; margin-top:-25px;">
                            <div id="liveMediaContainer" style="width:100%; height:100%;">

                                <!-- <div :id="'mediauser-'+item.userid" :key="item.userid" :role="item.role" class="media-main-panel big" v-for="item in orderedUsers">
                                    <div class="videoface" :style="{'background-image':'url('+item.faceurl+')'}"></div>
                                    <div class="media-video-bot">                                        
                                        <div :id="'mediavideoctl-'+item.userid" class="media-video-ctl">                                            
                                            <span title="Video is disable" class="media-icon-webcam-disable-small"></span>
                                            <span title="Audio is enable" class="media-icon-mic-enable-small"></span>
                                        </div>
                                    </div>
                                    <div class="media-video-name">{{item.name}}</div>
                                    <div :id="'mediavideotomax-'+item.userid" style="" class="media-video-tomax">
                                        <span class="media-icon-ctl-tomax">
                                            <span class="icon icon-full-size"></span>
                                        </span>
                                    </div>
                                    <div class="media-user" :id="'mediauserview'+item.userid" showvideo="1">
                                        <div :id="'mediauserplay'+item.userid" class="local-partner-video video-item" data-stream-id="225016498" style="width:100%; height:100%;top:0px; right:0px;">
                                            
                                        </div>
                                    </div>
                                </div> -->

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                id="editnote"
                style="display:none; position:absolute; left:10px; top:10px; float:left; z-index:201;"
            >
                <div
                    class="editnotemenu"
                    style="background-color:black;border-radius:5px; color:white; height:24px;"
                >
                    <ul>
                        <li id="editnote_delete">{{$t("Base.Delete")}}</li>
                        <li id="editnote_edit">{{$t("Base.Edit")}}</li>
                        <!--<li id="editnote_color">Color</li>
                        <li id="editnote_fontsize">Font Size</li>-->
                    </ul>
                </div>
                <div style="padding:8px 0px 0px 20px; text-align:left;">
                    <span
                        style="width:0;height:0;border-left: 5px solid transparent;border-right: 5px solid transparent;border-top: 10px solid black;"
                    ></span>
                </div>
            </div>
            <div
                id="editinlineboard"
                style="display:none; position:absolute; left:10px; top:10px; float:left; z-index:201;"
            >
                <div
                    class="editnotemenu"
                    style="background-color:black;border-radius:5px; color:white; height:24px;"
                >
                    <ul>
                        <li id="editinlineboard_delete">{{$t("Base.Delete")}}</li>
                        <li id="editinlineboard_draw">{{$t("Base.Draw")}}</li>
                        <!--<li id="editnote_color">Color</li>
                        <li id="editnote_fontsize">Font Size</li>-->
                    </ul>
                </div>
                <div style="padding:8px 0px 0px 20px; text-align:left;">
                    <span
                        style="width:0;height:0;border-left: 5px solid transparent;border-right: 5px solid transparent;border-top: 10px solid black;"
                    ></span>
                </div>
            </div>
            <div
                id="editboardmenu"
                style="display:none; position:absolute; left:10px; top:10px; float:left;"
            >
                <div
                    class="editnotemenu"
                    style="background-color:black;border-radius:5px; color:white; height:24px;"
                >
                    <ul>
                        <li id="editboard_delete">{{$t("Base.Delete")}}</li>
                        <li id="editboard_clear">{{$t("Base.Clear")}}</li>
                        <!--<li id="editboard_setting">Setting</li>-->
                        <li id="editboard_draw">{{$t("Base.Draw")}}</li>
                    </ul>
                </div>
                <div style="padding:8px 0px 0px 20px;text-align:left;">
                    <span
                        style="width:0;height:0;border-left: 5px solid transparent;border-right: 5px solid transparent;border-top: 10px solid black;"
                    ></span>
                </div>
            </div>
            <div
                id="editnotetext"
                tabindex="51"
                style="display:none; position:absolute; z-index:20000; left:0px; top:0px; width:500px; height:400px; padding:2px; background-color:white; border:solid 1px #000;"
            >
                <div style="width:100%; height:100%;">
                    <div style="height:40px; width:100%; text-align:left;">
                        <span
                            class="live-btn live-btn-default"
                            id="btnCancelNote"
                        >{{$t("Base.Cancel")}}</span>
                        <span
                            style=" float:right;"
                            class="live-btn live-btn-default"
                            id="btnSaveNote"
                        >{{$t("Base.Save")}}</span>
                    </div>
                    <div style="width:100%;">
                        <textarea
                            style="width:100%; height:360px;resize:none;overflow-y:auto;font-family: 'Consolas';"
                            rows="10"
                            id="editnote_content"
                        ></textarea>
                    </div>
                </div>
            </div>
            <ul id="userlistmenu" style="display:none; width:220px;">
                <li id="menu-makepresenter">{{$t("Live.MakePresenter")}}</li>
                <li id="menu-uptostudent">{{$t("Live.PromoteStudent")}}</li>
                <li id="menu-inviteuser">{{$t("Live.InviteUser")}}</li>
                <li id="menu-invitelink">{{$t("Live.InviteLink")}}</li>
            </ul>
            <ul id="filelistmenu" style="display:none; width:120px;">
                <li id="menu-viewfile">{{$t("Base.View")}}</li>
                <li id="menu-delfile">{{$t("Base.Delete")}}</li>
            </ul>
            <div
                id="livePrepareTip"
                v-show="isPrepare"
                style="position:absolute; left:5px; top:5px;color:red;"
            >{{$t("Live.PreparingLesson")}}</div>
            <media-view ref="media"></media-view>
            <!--<tencent-view ref="tencent"></tencent-view>-->
            <upload-file preid="live" ref="uploadfile"></upload-file>
            <sync-player ref="syncplayer" :CanControl="showUploadFile" :SingleMode="false" :Width="syncPlayerWidth" @onPlayBaseAction="onPlayBaseAction"  @onPlaySyncEnd="onPlaySyncEnd"
             @onRecordSyncStart="onRecordSyncStart" @onRecordSyncEnd="onRecordSyncEnd" @onPlaySyncStart="onPlaySyncStart"
             @onPlaySyncPause="onPlaySyncPause" @onPlaySyncGo="onPlaySyncGo" @onPlaySyncTo="onPlaySyncTo"></sync-player>
            <div
                v-if="showDownload"
                style="height:160px; margin-top:-80px; margin-left:-200px;text-align:center;z-index:50000; position:absolute; left:50%; top:50%;"
            >
                <i-circle :percent="downloadPercent">
                    <Icon
                        v-if="downloadPercent == 100"
                        type="ios-checkmark-empty"
                        size="60"
                        style="color:#5cb85c"
                    ></Icon>
                    <span v-else style="font-size:24px">{{ downloadPercent }}%</span>
                </i-circle>
            </div>
            <!--<twilio-view ref="twilio"></twilio-view>-->
        </div>
        <div id="liveViewplaybtn" class="liveViewplaybtn" style="display:none;" @click="onClickLayer($event);">            
             <Button  @click.stop="playFinishLesson($event)" type="ghost" shape="circle" style="width: 100px;height: 100px;border-radius: 50px;background-color: #eee;">
                 <Icon size="60" type="play" style="margin-left:10px;"></Icon>
             </Button>
        </div>
        <select-file-from-fav ref="selectfilefromfav" @onOK="selectFavOK"></select-file-from-fav>
        <select-file-from-space ref="selectfilefromspace" @onOK="selectSpaceOK"></select-file-from-space>
        <select-lectures ref="selectLectures" @onOK="selectLectureOK"></select-lectures>
        <Modal
            v-model="selectVideo"
            title="Select Video"
            width="800"
            :closable="false"
            :mask-closable="false"
            @on-ok="selectVideoOK"
            @on-cancel="selectVideoCancel"
            style="z-index:40000;position: absolute;"
            class-name="hideModalFooter"
        >
            <div slot="header" style=" height:30px;">
                <span style="font-size:16px; font-weight:bold;">{{selectMediaTitle}}</span>
                <span style="float:right;">
                    <Button type="primary" @click="selectVideoOK">{{$t("Base.OK")}}</Button>
                    <Button type="text" @click="selectVideoCancel">{{$t("Base.Cancel")}}</Button>
                </span>
            </div>
            <div>
                <div>
                    <Tabs v-model="selectMediaTab" @on-click="onSelectMediaTabChange">
                        <TabPane :disabled="!selectVideo_showvideo" label="视频" name="video" icon="ios-videocam"></TabPane>
                        <TabPane :disabled="!selectVideo_showaudio" label="音频" name="audio" icon="music-note"></TabPane>
                    </Tabs>
                </div>
                <table style="width:100%;margin-bottom:10px;">
                    <tr>
                        <td style="width:205px;">
                            <Input
                                v-model="selectVideoKey"
                                :placeholder="$t('Live.SearchVideo')"
                                style="width: 200px;"
                            ></Input>
                        </td>
                        <td style="width:80px;">
                            <Button
                                type="primary"
                                icon="ios-search"
                                @click="onVideoSearch"
                            >{{$t("Base.Search")}}</Button>
                        </td>
                        <td style="width:120px; padding-left:5px;">
                            <div
                                style="background-color:#2d8cf0; border-color:#2d8cf0; border-radius:4px; width:100px; color:white; "
                            >
                                <label
                                    style="height:100%;width:100%; display:inline-block;cursor:pointer;"
                                >
                                    <input
                                        id="uploadVideo2SaveFileInput"
                                        type="file"
                                        @change="uploadVideo2SaveFileInputChange(this);"
                                        accept="audio/wav, audio/mp4a-latm, audio/aac, audio/3gpp, audio/mpeg, video/mp4"
                                        style="width:0px; position:relative;left:-20000px;"
                                    >
                                    <span
                                        style="position:absolute;display:inline-block;height:32px;line-height:32px;padding-left:5px; padding-top:3px;"
                                    >
                                        <Icon
                                            type="ios-cloud-upload-outline"
                                            style="color:white;"
                                            size="26"
                                        ></Icon>
                                        <!--<img class="live-file-thumbnail" src="/static/images/uploadfile.svg" style="width:32px;">-->
                                    </span>
                                    <span
                                        style="width:85px; text-align:right;height:32px;line-height:32px;display:inline-block;"
                                    >{{$t("Base.Upload")}}</span>
                                </label>
                            </div>
                        </td>
                        <td style="text-align:right;">
                            <Page :total="selectVideoItemTotal" @on-change="onVideoPageChange"></Page>
                        </td>
                    </tr>
                </table>
            </div>
            <Row style="background:rgba(0,153,229,.7); height:30px;" type="flex" align="middle">
                <Col span="2">&nbsp;</Col>
                <Col span="14">{{$t("Base.Name")}}</Col>
                <Col span="4">{{$t("Live.TotalTime")}}</Col>
                <Col span="4">{{$t("Live.FileSize")}}</Col>
            </Row>
            <div style="height:300px; overflow:auto;">
                <div id="favList" class="favList" v-for="item in videoList">
                    <Row style="height:26px;" type="flex" align="middle">
                        <Col span="2">
                            <input
                                type="checkbox"
                                :id="'videoList_'+item.id"
                                :value="item.id"
                                @click="onVideoItemClick"
                            >
                        </Col>
                        <Col span="14">{{item.name}}</Col>
                        <Col span="4">{{item.time}}</Col>
                        <Col span="4">{{item.size}}</Col>
                    </Row>
                </div>
            </div>
            <div slot="footer" style="display:none;"></div>
        </Modal>
        <Modal
            v-model="inviteuser"
            title="$t('Live.InviteUser')"
            width="600"
            :closable="false"
            :mask-closable="false"
            @on-ok="inviteuserOK"
            @on-cancel="inviteuserCancel"
            style="z-index:40000;position: absolute; "
            class-name="hideModalFooter"
        >
            <div slot="header" style=" height:30px;">
                <span style="font-size:16px; font-weight:bold;">{{$t("Live.InviteUser")}}</span>
                <span style="float:right;">
                    <Button type="primary" @click="inviteuserOK">{{$t("Base.OK")}}</Button>
                    <Button type="text" @click="inviteuserCancel">{{$t("Base.Cancel")}}</Button>
                </span>
            </div>
            <Input
                v-model="filterFriendKey"
                :placeholder="$t('Live.SearchFriend')"
                style="width: 300px; margin-bottom:15px;"
            ></Input>
             <div style="float:right;"><Button @click="invitelinkCopy">{{$t("Live.CopyShareLink")}}</Button></div>
            <Row style="background:rgba(0,153,229,.7); height:30px;" type="flex" align="middle">
                <Col span="2">&nbsp;</Col>
                <Col span="6">{{$t("Base.Face")}}</Col>
                <Col span="16">{{$t("Base.Name")}}</Col>
            </Row>
            <div style="height:300px; overflow:auto;">
                <div id="friendsList" class="favList" v-for="item in filterFriends">
                    <Row style="height:50px;" type="flex" align="middle">
                        <Col span="2">
                            <input type="checkbox" :value="item.id" v-model="selectedFriends">
                        </Col>
                        <Col span="6">
                            <Avatar shape="square" :src="item.face"/>
                        </Col>
                        <Col span="16">{{item.name}}</Col>
                    </Row>
                </div>
            </div>
            <div slot="footer" style="display:none;"></div>
        </Modal>
        <Modal
            v-model="invitelink"
            title="Invite User"
            width="400"
            :closable="true"
            :mask-closable="false"
            style="z-index:40000;position: absolute; "
            class-name="hideModalFooter"
        >
            <div style="font-size:14px;">
                <div style="font-weight:bold;">{{$t("Live.ShareLink")}}</div>
                <div>
                    <input
                        id="liveInvitelink"
                        type="text"
                        :value="invitelinkUrl"
                        style="width:360px; border:0px;"
                    >
                </div>
                <div>
                    <p style="font-weight:bold; margin-top:20px;">Or share these steps:</p>
                    <p>1.Go to PeerTime.cn</p>
                    <p>
                        2.Enter meetingID:
                        <span style="font-weight:bold;">{{invitelinkId}}</span>
                    </p>
                </div>
            </div>
            <div style="text-align:center;margin-top:20px;">
                <Button
                    type="primary"
                    shape="circle"
                    icon="ios-copy"
                    style="margin-right:30px;width:130px;"
                    @click="invitelinkCopy"
                >Copy Link</Button>
                <a
                    :href="'mailto:?subject=Please%20join%20my%20peertime%20room%20'+invitelinkId+'&body='+invitelinkUrl"
                    style="margin-left: 30px;width: 130px;border: 1px solid #2d8cf0;padding: 8px 20px;background-color: #2d8cf0;color: white;border-radius: 32px;"
                >
                    <Icon type="ios-email" size="14"></Icon>&nbsp;Email Invitation
                </a>
            </div>
            <div slot="footer" style="display:none;"></div>
        </Modal>
        <Modal
            v-model="welcomeMessage"
            class-name="hideModalFooter"
            @on-cancel="CloseWelcomeMessage"
            :mask-closable="false"
            width="500"
            style="z-index:40000;position: absolute; "
        >
            <div
                style="text-align:left; font-size:20px;"
            >{{ $t("Live.Welcometo") }} {{welcomeMessageTeacherName}} {{ isKloudSync? $t("Base.Meetingroom") : $t("Base.Klassroom")}}</div>
            <div
                style="font-size:14px; padding-bottom:10px;"
            >{{isKloudSync? $t("Base.MeetingroomID") : $t("Base.KlassroomID")}}:{{welcomeMessageKlassRoomID}}</div>
            <div
                v-show="welcomeMessageTeacherBtn"
                style="border-top:solid 1px #ccc; padding:10px 0px;color:cornflowerblue; display:none;"
            >
                <Button
                    id="btnWelMsgStartMeeting"
                    type="primary"
                    size="large"
                    @click="WelMsgStartMeeting"
                >{{$t("Live.StartMeeting")}}</Button>
                <Button
                    id="btnWelMsgStartLesson"
                    type="primary"
                    size="large"
                    v-show="!isKloudSync"
                    @click="WelMsgStartLesson"
                >{{$t("Live.NewLesson")}}</Button>
                <Dropdown style placement="bottom-start" trigger="click">
                    <Button id="btnWelMsgPrepare" type="primary" size="large" v-show="!isKloudSync">Prepare
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <DropdownMenu v-show="showWelMsgPrepareMenu" slot="list">
                        <DropdownItem
                            @click.native="prepareCourseTemp"
                            name="temp"
                        >{{$t("Live.PrepareCourseTemplate")}}</DropdownItem>
                        <DropdownItem
                            @click.native="prepareLesson"
                            name="lesson"
                        >{{$t("Live.PrepareActiveLesson")}}</DropdownItem>
                        <!--<DropdownItem @click.native="prepareFile" name="file">Prepare a saved file</DropdownItem>-->
                    </DropdownMenu>
                </Dropdown>
                <span style="float:right; padding-right:80px;display:none;">
                    <Tooltip content="Turn On/Off Microphone" placement="bottom">
                        <a
                            class="welmsg-ctl-btn"
                            @click="SwitchLoaclAudio($event);"
                            style="width:20px; height:20px;"
                        >
                            <span
                                class="welmsg-ctl-icon welmsg-ctl-icon-mic"
                                style="width:20px; height:20px;background-size:20px 20px;margin-top:-12px;"
                            ></span>
                        </a>
                    </Tooltip>
                    <span style=" padding-left:20px;"></span>
                    <Tooltip content="Turn On/Off Camera" placement="bottom">
                        <a
                            class="welmsg-ctl-btn disable"
                            @click="SwitchLoaclVideo($event);"
                            style="width:20px; height:20px;"
                        >
                            <span
                                class="welmsg-ctl-icon welmsg-ctl-icon-camera"
                                style="width:20px; height:20px;background-size:20px 20px;margin-top:-12px;"
                            ></span>
                        </a>
                    </Tooltip>
                </span>
                <div v-show="welcomeMessageCourse" style="clear:both;">
                    <Row
                        type="flex"
                        justify="center"
                        align="middle"
                        style="margin:5px; padding-top:10px;"
                    >
                        <Col
                            span="4"
                            style="height:30px; line-height:30px; vertical-align:middle;"
                            justify="center"
                            align="middle"
                        >
                            <div>Course：</div>
                        </Col>
                        <Col span="20">
                            <Select
                                v-model="selectCourse"
                                style="width:280px; height:30px;"
                                @on-change="onCourseChange"
                            >
                                <Option
                                    v-for="item in courseList"
                                    :value="item.value"
                                    :key="item.value"
                                >{{ item.text }}</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center" align="middle" style="margin:5px;">
                        <Col
                            span="4"
                            style="height:30px; line-height:30px; vertical-align:middle;"
                            justify="center"
                            align="middle"
                        >
                            <div>Lecture：</div>
                        </Col>
                        <Col span="20">
                            <Select v-model="selectLecture" style="width:280px; height:30px;">
                                <Option
                                    v-for="item in lectureList"
                                    :value="item.value"
                                    :key="item.value"
                                >{{ item.text }}</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row
                        type="flex"
                        justify="center"
                        align="middle"
                        style="margin:5px; padding-top:10px;"
                    >
                        <Col
                            span="4"
                            style="height:30px; line-height:30px; vertical-align:middle;"
                            justify="center"
                            align="middle"
                        ></Col>
                        <Col span="20">
                            <Button type="primary" @click="WelMsgCreateLesson">{{$t("Base.OK")}}</Button>
                            <Button
                                type="text"
                                @click="WelMsgCancelCreateLesson"
                            >{{$t("Base.Cancel")}}</Button>
                        </Col>
                    </Row>
                </div>
                <div v-show="welcomeMessagePrepareTemp" style="clear:both;">
                    <select-course-temp ref="selectCourseTemp"></select-course-temp>
                </div>
                <div v-show="welcomeMessagePrepareLesson" style="clear:both;">
                    <Row
                        type="flex"
                        justify="center"
                        align="middle"
                        style="margin:5px; padding-top:10px;"
                    >
                        <Col
                            span="4"
                            style="height:30px; line-height:30px; vertical-align:middle;"
                            justify="center"
                            align="middle"
                        >
                            <div>Student：</div>
                        </Col>
                        <Col span="20">
                            <Select
                                v-model="selectStudent"
                                style="width:280px; height:30px;"
                                @on-change="onStudentChange"
                            >
                                <Option
                                    v-for="item in studentList"
                                    :value="item.value"
                                    :key="item.value"
                                >{{ item.text }}</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row
                        type="flex"
                        justify="center"
                        align="middle"
                        style="margin:5px; padding-top:10px;"
                    >
                        <Col
                            span="4"
                            style="height:30px; line-height:30px; vertical-align:middle;"
                            justify="center"
                            align="middle"
                        >
                            <div>Course：</div>
                        </Col>
                        <Col span="20">
                            <Select
                                v-model="selectCourse"
                                style="width:280px; height:30px;"
                                @on-change="onCourseChange"
                            >
                                <Option
                                    v-for="item in courseList"
                                    :value="item.value"
                                    :key="item.value"
                                >{{ item.text }}</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center" align="middle" style="margin:5px;">
                        <Col
                            span="4"
                            style="height:30px; line-height:30px; vertical-align:middle;"
                            justify="center"
                            align="middle"
                        >
                            <div>Lecture：</div>
                        </Col>
                        <Col span="20">
                            <Select v-model="selectLecture" style="width:280px; height:30px;">
                                <Option
                                    v-for="item in lectureList"
                                    :value="item.value"
                                    :key="item.value"
                                >{{ item.text }}</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row
                        type="flex"
                        justify="center"
                        align="middle"
                        style="margin:5px; padding-top:10px;"
                    >
                        <Col
                            span="4"
                            style="height:30px; line-height:30px; vertical-align:middle;"
                            justify="center"
                            align="middle"
                        ></Col>
                        <Col span="20">
                            <Button type="primary" @click="prepareLessonOk">{{$t("Base.OK")}}</Button>
                            <Button type="text" @click="cancelPrepareLesson">{{$t("Base.Cancel")}}</Button>
                        </Col>
                    </Row>
                </div>
                <div v-show="welcomeMessagePrepareFile" style="clear:both;">
                    <select-prepare-file></select-prepare-file>
                </div>
            </div>
            <div
                v-show="welcomeMessageStudentBtn"
                style="border-top:solid 1px #ccc; padding:10px 0px;"
            >
                <div id="WelMsgWaitJoin" style="color:red;">{{welcomeMessageWarnning}}</div>
                <Button
                    id="BtnWelMsgJoinStudent"
                    type="primary"
                    size="large"
                    @click="WelMsgJoinStudent"
                    disabled
                >{{$t("Base.Join")}}</Button>
                <Button
                    id="BtnWelMsgJoinAuditor"
                    v-if="false"
                    type="primary"
                    size="large"
                    @click="WelMsgJoinAuditor"
                    disabled
                >Join as Audience</Button>
                <span style="float:right; padding-right:80px;display:none;">
                    <Tooltip content="Turn On/Off Microphone" placement="bottom">
                        <a
                            class="welmsg-ctl-btn"
                            @click="SwitchLoaclAudio($event);"
                            style="width:20px; height:20px;"
                        >
                            <span
                                class="welmsg-ctl-icon welmsg-ctl-icon-mic"
                                style="width:20px; height:20px;background-size:20px 20px;margin-top:-12px;"
                            ></span>
                        </a>
                    </Tooltip>
                    <span style=" padding-left:20px;"></span>
                    <Tooltip content="Turn On/Off Camera" placement="bottom">
                        <a
                            class="welmsg-ctl-btn disable"
                            @click="SwitchLoaclVideo($event);"
                            style="width:20px; height:20px;"
                        >
                            <span
                                class="welmsg-ctl-icon welmsg-ctl-icon-camera"
                                style="width:20px; height:20px;background-size:20px 20px;margin-top:-12px;"
                            ></span>
                        </a>
                    </Tooltip>
                </span>
            </div>
            <div
                style="padding:10px 0px 3px 0px; border-bottom:solid 1px #ccc;"
                v-if="welcomeMessageList.length>0"
            >{{$t("Live.UpcomingLessons")}}</div>
            <div class="live-upcominglist">
                <div class="live-upcomingitem" v-for="item in welcomeMessageList">
                    <ul>
                        <li style="width:330px;">
                            {{item.time}}
                            <span style="color:red;">&nbsp;{{item.lefttime}}</span>
                            <br>
                            {{item.title}}
                        </li>
                        <li style="width:70px;">
                            <Button @click.native="WelMsgViewLesson(item)">{{$t("Base.View")}}</Button>
                        </li>
                        <li v-show="welcomeMessageTeacherBtn" style="width:60px;">
                            <Button @click.native="WelMsgViewLesson(item)">{{$t("Base.Start")}}</Button>
                        </li>
                    </ul>
                </div>
            </div>
            <div slot="footer" style="display:none;">
                <Button>Close</Button>
            </div>
        </Modal>
        <Modal
            title="标准课程正在进行中，是否加入？"
            v-model="mediaSettingDlg"
            :closable="true"
            @on-cancel="clickClose"
            class-name="hideModalFooter hideModalHead"
            :mask-closable="false"
            width="600"
            style="z-index:40000;position: absolute;"
        >
            <!--<media-setting preid="live" ref="mediasetting"></media-setting>-->
            <component preid="live" ref="mediasetting" v-bind:is="toshowmediasetting"></component>
            <div style="text-align:center;padding:20px 0px 10px;">
                <Button
                    type="success"
                    icon="checkmark"
                    style="width:40%;"
                    @click="mediaSettingOK"
                >{{$t("Live.IamReady")}}</Button>
            </div>
        </Modal>
        <Modal
            title="KloudCall Notifiation"
            v-model="kloudcallNotifiation"
            :closable="false"
            class-name="hideModalFooter hideModalHead"
            :mask-closable="false"
            width="400"
            style="z-index:40000;position: absolute;"
        >
            <div style="font-size:16px; margin-bottom:20px;">{{$t("Live.YourhosttoKloudcall")}}</div>
            <div style="font-size:18px;">
                {{$t("Live.YourNumber")}}
                <Input
                    v-model="kloudCallNumber"
                    id="KoundCallStudentNumber"
                    class="KoundCallNumber"
                ></Input>
            </div>
            <div style="text-align:center;padding:20px 0px 10px;">
                <Button
                    type="primary"
                    style="width:100px; margin-right:50px;"
                    @click="KloudCallNow"
                >{{$t("Live.CallMeNow")}}</Button>
                <Button
                    type="primary"
                    style="width:100px;margin-left:50px;"
                    @click="KloudCallLater"
                >{{$t("Live.CallMeLater")}}</Button>
            </div>
        </Modal>
        <Modal
            title="Notifiation"
            v-model="kloudcallNotifiationTeacher"
            :closable="false"
            class-name="hideModalFooter hideModalHead"
            :mask-closable="false"
            width="400"
            style="z-index:40000;position: absolute;"
        >
            <div style="font-size:22px; font-weight:bold;">{{$t("Live.Notification")}}</div>
            <div style="font-size:16px; margin-bottom:20px;">{{$t("Live.YouhavetoKloudcall")}}</div>
            <div style="font-size:18px;">
                {{$t("Live.YourNumber")}}
                <Input
                    v-model="kloudCallNumberTeacher"
                    id="KoundCallTeacherNumber"
                    class="KoundCallNumber"
                ></Input>
            </div>
            <div style="text-align:center;padding:20px 0px 10px;">
                <Button
                    type="primary"
                    style="width:100px; margin-right:50px;"
                    @click="KloudCallTeacherOK"
                >{{$t("Base.OK")}}</Button>
                <Button
                    type="primary"
                    style="width:100px;margin-left:50px;"
                    @click="KloudCallTeacherCancel"
                >{{$t("Base.Cancel")}}</Button>
            </div>
        </Modal>
        <Modal
            title="AutoClose"
            v-model="showAutoCloseDlg"
            :closable="false"
            class-name="hideModalFooter hideModalHead"
            :mask-closable="false"
            width="400"
            style="z-index:40000;position: absolute;"
        >
            <div style="font-size:20px; font-weight:bold;text-align:center;">{{$t("Live.CloseIn")}}</div>
            <div
                style="font-size:50px; margin-top:20px;text-align:center; font-weight:bold;  color:blue;"
            >{{autoCloseSecond}}</div>
            <div style="font-size:16px;text-align:center;">Second</div>
            <div style="text-align:center;padding:20px 0px 10px;">
                <Button
                    type="ghost"
                    size="large"
                    style="width:30%; margin-right:50px;"
                    @click="Keep4AutoClose"
                >{{$t("Live.Keepit")}}</Button>
                <Button
                    type="ghost"
                    size="large"
                    style="width:30%;margin-left:50px;"
                    @click="clickClose(false,false)"
                >{{$t("Live.Closenow")}}</Button>
            </div>
        </Modal>
        <Modal v-model="checkExist.show" width="400" :mask-closable="false" :closable="false">
            <div style="text-align: center;padding: 30px 0px;font-size: 16px;">
                <p>{{$t("Live.AreYouExit")}}</p>
            </div>
            <div slot="footer">
                <Button
                    type="success"
                    icon="checkmark"
                    v-show="checkExist.isTeacher && checkExist.needSave"
                    @click="saveAndExitLesson();"
                >{{$t("Live.SaveandExit")}}</Button>
                <Button
                    type="primary"
                    icon="android-exit"
                    @click="exitLesson();"
                >{{$t("Base.Exit")}}</Button>
                <Button icon="close" @click="checkExist.show=false;exitMySelf=false;">{{$t("Base.Cancel")}}</Button>
            </div>
        </Modal>
        <Modal
            v-model="showAutoPlayDlg"
            :title="$t('Live.AutoPlayTip')"
            :ok-text="$t('Base.Start')"
            :cancel-text="$t('Base.Cancel')"
            @on-ok="StartAutoPlay"
            @on-cancel="showAutoPlayDlg=false"
            width="400"
            style="z-index:39000;position: absolute;"
        >
            <div style="font-size:16px;text-align:center;margin:10px 0px;">
                {{$t("Live.Every")}}
                <InputNumber
                    :max="300"
                    :min="0.5"
                    :step="0.5"
                    v-model="autoplaySeconds"
                    style="width:80px; margin:0px 5px;"
                ></InputNumber>
                {{$t("Live.Second")}}
            </div>
            <div style="text-align:center;margin:10px 0px;">
                <Button
                    type="primary"
                    icon="music-note"
                    @click="selectAudioShow"
                >{{$t("Live.SelectMixAudio")}}</Button>
                <div>{{selectAudioName}}</div>
            </div>
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
                <span
                    style="font-size:16px; font-weight:bold;"
                >Select 音想</span>
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
                            <input
                                type="checkbox"
                                :value="item.id"
                                @click="onSelectedMoreThinkClick($event);"
                            >
                        </Col>
                        <Col span="9">{{item.title}}</Col>
                        <Col span="9">{{item.user}}</Col>
                        <Col span="4">{{item.time}}</Col>
                    </Row>
                </div>
            </div>
            <div slot="footer" style="display:none;"></div>
        </Modal>
        <Modal title="UploadProcess"
           v-model="uploadRecord.showUploadRecordProcess"
           :closable="false"
           class-name="hideModalFooter hideModalHead"
           :mask-closable="false"
           width="500" style="z-index:50000;position: absolute;">
            <div style="font-size:16px; font-weight:bold;text-align:center;">Uploading</div>
            <div style="font-size:16px; margin-top:20px;text-align:center;">
                <Icon type="ios-videocam"></Icon>
                <span style="padding-left:5px;">{{uploadRecord.uploadFileName}}</span>
            </div>
            <div style="height:160px; padding-top:20px; text-align:center;">
                <i-circle :percent="uploadRecord.uploadPercent">
                <Icon v-if="uploadRecord.uploadPercent == 100" type="ios-checkmark-empty" size="60" style="color:#5cb85c"></Icon>
                <span v-else style="font-size:24px">{{ uploadRecord.uploadPercent }}%</span>
                </i-circle>
            </div>
        </Modal>
        <Modal title="Join as audience"
           v-model="showRoomFullTip"
           :closable="true"
           class-name="hideModalFooter"
           :mask-closable="false"
           width="500" style="z-index:50000;position: absolute;">
        <div style="text-align:center;margin-top:15px;"><span class="icon icon-alert" style="font-size:56px;color:#0b65fc;"></span></div>
         <div style="text-align:center;margin-top:0px;color:#0b65fc;font-size:16px;">Join as audience</div>
        <div style="text-align:left;padding:20px;font-size:14px;">
           The maximum number of panelists has been reached.  You will be joining as a listen-only attendee.
        </div>
        <div style="height:60px; padding:20px; text-align:center;">
            <Button style="width:150px;" type="success" @click="showRoomFullTip=false">OK</Button>
        </div>
        </Modal>
        <take-photo
            :show="showTakePhoto"
            :LessonID="getMeetingID()"
            @onTakePhotoFinish="onTakePhotoFinish"
        ></take-photo>
        <share-doc-modal></share-doc-modal>
    </div>
</template>
<style lang="scss">
.ivu-notice {
    z-index: 10001;
}
.live-welcomepage {  
   width: calc(100% - 100px);
   height: 100%;
   text-align: center;
   vertical-align:middle;
   display: inline-block;

    .live-welcomepage-container
    {
        width: 500px;
        height: 300px;
        display: inline-block;
        margin: 150px 100px 0px 0px;
    }
    .live-welcomepage-content-image {
        text-align: center;
        padding-bottom: 30px;
    }
    .live-welcomepage-content-welcome {
        font-size: 16px;
        color: #000000;
    }
    .live-welcomepage-content-nofile {
        margin: 5px 0px 10px;
        font-size: 14px;
        color: #000000;
    }
    .live-welcomepage-btnscontainer
    {
        font-size: 18px;
        text-align: left;
    }
    .live-welcomepage-btns
    {
        display: inline-block;
        width:200px;
        height: 60px;
    }
    .live-welcomepage-btns button
    {
        width: 195px;
    }
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
.KoundCallNumber {
    width: 240px;
}
.KoundCallNumber input {
    color: red !important;
    font-size: 16px;
}
.welmsg-ctl-btn {
    display: inline-block;
    background-color: #8c98ae;
    height: 32px;
    width: 32px;
    margin: 3px;
    border-radius: 50%;
    line-height: 32px;
    font-size: 32px;
    text-align: center;
    padding: 7px;
    color: #fff;
    box-sizing: content-box !important;
}

.welmsg-ctl-btn.disable {
    filter: grayscale(100%);
    background-color: #bdbdbd;
    opacity: 0.5;
}

.welmsg-ctl-icon {
    background-repeat: no-repeat;
    display: inline-block;
    width: 32px;
    height: 32px;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    text-align: center;
    vertical-align: middle;
    background-size: 32px 32px;
    margin-top: -2px;
    box-sizing: content-box !important;
}

.welmsg-ctl-icon-mic {
    background-image: url($images-root+"microphone.png");
}

.welmsg-ctl-icon-camera {
    background-image: url($images-root+"camera.png");
}
.liveViewplaybtn
  {
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-align:center;
    vertical-align: middle;
    background: #333333;
    opacity: 0.4;
    z-index: 9999;
    position:fixed;
    top: 0px;
    left:0px;
    display:flex;
    justify-content:center;
    align-items:center;
  }
.live-lesson {
    text-align: center;
    position: relative;
    user-select: none;

    .hide{
        display: none !important;
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
        border-bottom: 1px solid #f9f7f7;
        height: 60px;
    }
    .liveThinkitemleft {
        float: left;
        width: 320px;
        overflow: hidden;
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
    .liveMouseContainer {
        display: block;
        position: absolute;
        width: 0;
        height: 0;
        left: 0px;
        top: 0px;
        opacity: 1;
        background: rgba(255, 0, 0, 0.8);
        border-radius: 50%;
    }
    .liveMouseShowAnimation {
        animation: likewater 500ms ease-out backwards;
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
            vertical-align: middle;
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
    .hover-hide #liveToolbar {
        display: none !important;
    }
    .liveToolbar.hover-hide:hover #liveToolbar {
        display: block !important;
    }
    #liveSelectScale {
        display: inline-block;
        vertical-align: middle;
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
    #liveHolderOuter {
        overflow: auto;
        background: #fff;
        overflow: visible;
        /*background-color: #404040;
    background-image: url($images-root + "texture.png");*/
    }
    #liveHolder {
        position: relative;
        margin-top: 8px;
    }

    #liveCanvas {
        border: 1px solid navy;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        /*left: 8px;*/
        top: 0;
    }

    #liveSvg {
        border: 1px solid transparent;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        /*left: 8px;*/
        top: 0;
    }
    #liveControlWindow {
        display: block;
        position: fixed;
        z-index: 20;
        top: 50px;
        height: calc(100% - 50px);
        background: transparent;
        right: 0px;
        font: 400 12px Arial, Helvetica, sans-serif;
        box-sizing: content-box !important;
    }

    #liveControlWindow.liveControlWindowStart {
        top: 0px;
        height: 100%;
    }
    .liveRecordLesson
    {
        padding:5px; 
        position:relative;
        text-align:left;
        cursor:pointer;
    }
    .liveRecordLesson span {
        line-height:30px;
        height:30px;
    }
    .liveRecordLesson:hover {
        background: #d3d3d3;
    }
    .liveRecordLessonCtl
    {
        margin-right:10px;
        cursor:pointer;
    }
    .liveRecordLessonCtl.disable{
        opacity: 0.3;
    }
    .liveRecordLessonCtl.enable{
        opacity: 1;
    }
    .liveRecordLessonCtl.hide{
        display: none;
    }
    .liveMoreAction-MuteAll
    {
        padding:10px;font-size:16px; line-height:22px;border-bottom:1px solid #d3d3d3;cursor:pointer;
    }
    .liveMoreAction-MuteAll.hide
    {
        display: none;
    }
    .liveMoreAction-UnmuteAll
    {
        padding:10px;font-size:16px; line-height:22px;cursor:pointer;
    }
    .liveMoreAction-UnmuteAll.hide
    {
        display: none;
    }
    

    /** {
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
  }*/

    #livePanelOperation {
        width: 36px;
        position: relative;
        background: #fff;
        box-shadow: 0px 0 4px rgba(0, 0, 0, 0.2);
        vertical-align: top;
    }

    #livePanelMeeting {
        height: 100%;
    }
    .liveShareControl {
        padding: 0px 0px 10px;
    }
    .livePanelTopCtl-wrap {
        position: fixed;
        left: 50%;
        bottom: 20px;
        z-index: 121;
        font-size: 0;
        height: 50px;
        width: 440px;
        padding-top: 6px;
        margin-left: -243px;
        box-sizing: border-box;
    }
    .livePanelTopCtl-wrap.attendee-view {
        right: 66px;
        left: auto;
        text-align: right;
    }
    .livePanelTopCtl-wrap.attendee-view-open {
        right: 366px;
    }
    .livePanelTopCtl-wrap.attendee-view .livePanelTopCtlbtn.selected {
        background: #8bd5f1;
    }
    .livePanelTopCtl-wrap.attendee-view .livemode {
        background: #dedede;
    }
    .livePanelSyncCtl-wrap {
        text-align: center;
        display: inline-block;
        border: solid 1px #ccc;
        padding: 5px;
        border-radius: 10px;
        background-color: white;
    }

    .hover-hide #livePanelTopCtl {
        display: none;
    }
    .hover-hide.livePanelTopCtl-wrap:hover #livePanelTopCtl {
        display: block;
    }
    #livePanelTopCtl .ivu-tooltip {
        margin-right: 10px;
    }
    #liveShareControl > h3 {
        color: #fff;
        font-weight: normal;
        font-size: 11px;
        margin-top: 4px;
    }
    .live-share-btn {
        display: block;
        margin: 25px auto 0 auto;
        background-color: rgba(255, 255, 255, 0.25);
        height: 44px;
        width: 44px;
        border-radius: 50%;
        line-height: 44px;
        text-align: center;
        color: rgba(255, 255, 255, 0.4);
        box-sizing: content-box !important;
    }
    .live-share-btn > .icon {
        font-size: 28px;
    }

    .live-share-btn.selected {
        background: linear-gradient(-135deg, #21d4fd, #8a30e2);
        color: #fff;
    }
    .live-share-btn.show {
        background-color: #fff;
        color: #4a90e2;
    }
    .live-share-icon {
        background-repeat: no-repeat;
        display: inline-block;
        width: 24px;
        height: 24px;
        overflow: hidden;
        font-size: 0;
        line-height: 0;
        text-align: center;
        vertical-align: middle;
        background-size: 24px 24px;
        margin-top: -8px;
        box-sizing: content-box !important;
    }
    .live-share-document {
        background-image: url($images-root+"icon-share-document.png");
    }
    .live-share-screen {
        background-image: url($images-root+"icon-share-screen.png");
    }
    .live-share-camera {
        background-image: url($images-root+"icon-online-meeting.png");
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
    .livemode {
        background: #9b9b9b;
    }
    .right-border:after {
        content: "";
        width: 1px;
        height: 26px;
        background: #d3d3d3;
        position: absolute;
        right: -10px;
        top: 8px;
    }
    .left-border:before {
        content: "";
        width: 1px;
        height: 26px;
        background: #d3d3d3;
        position: absolute;
        left: -10px;
        top: 8px;
    }
    .livePanelTopCtlbtn.selected {
        background-color: #1db1e9;
        color: white;
    }
    .livePanelTopCtlbtn .icon {
        font-size: 22px;
        color: #fff;
    }
    .live-main-panel {
        float: left;
    }
    .liveActionToolscontain {
        background-color: #2f3d4a;
        border-radius: 5px;
        color: white;
        width: 36px;
        height: 216px;
        overflow: hidden;
        float: left;
    }
    .liveActionToolscontain:focus {
        outline: none;
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

    .live-pdf-action-active
    {
        background-color: #dadada;
    }
    .live-pdf-action:hover {
        background-color: #dadada;
        display:block !important;
    }
    .live-pdf-action-active {
        color: #4a90e2;
    }
    .live-pdf-action.disable{
      color: #d8d5d5;
    //   display:none !important;
    //   position: fixed;
    //   left:-1000px;
  } 
  .live-pdf-action.disable:hover{
      background-color: #ffffff;
  }
    .live-pdf-action-white {
        display: block;
        height: 36px;
        width: 36px;
        line-height: 36px;
        text-align: center;
        color: #d9e1e6;
        box-sizing: content-box !important;
    }
    .live-pdf-action-white > span.icon {
        font-size: 22px;
    }

    .live-pdf-action-white-active,
    .live-pdf-action-white:hover {
        background-color: #445868;
    }

    .live-pdf-action-white-active {
        color: #4a90e2;
    }
    .meeting-header {
        /*position: absolute;*/
        /*border-color: #ccc;
      border-radius: 4px 4px 0 0;*/
        color: #333;
        width: 260px;
        display: none;
        /*height: 1.3em;*/
        /*border-bottom-style: solid;
      border-bottom-width: 1px;
      background-color: #f5f5f5;*/
        padding: 0.4em 0 0 0;
        font-size: 1.2em;
        white-space: nowrap;
        /*min-height: 16px;*/
    }

    .meeting-title {
        position: absolute;
        left: 0.44em;
        right: 0.44em;
        overflow: hidden;
        cursor: default;
        text-overflow: ellipsis;
    }

    .meeting-panel-actions {
        position: absolute;
        top: 0;
        right: 0.3em;
        padding-top: 0.3em;
    }

    .meeting-panel-action {
        display: inline-block;
        width: 16px;
        height: 16px;
        padding: 2px;
        text-decoration: none;
        opacity: 0.7;
        color: #333;
        border-color: transparent;
        border-radius: 4px;
        box-sizing: content-box !important;
    }

    .meeting-panel-action:hover {
        border: 1px solid #aeaeae;
        color: #333;
        background: #ebebeb;
        padding: 1px;
    }

    .meeting-panel-action .k-icon {
        vertical-align: top;
    }

    $image-size: 16px;
    .live-icon {
        background-repeat: no-repeat;
        display: inline-block;
        width: 16px;
        height: 16px;
        overflow: hidden;
        font-size: 0;
        line-height: 0;
        text-align: center;
        vertical-align: middle;
        background-size: 16px 16px;
        box-sizing: content-box !important;
    }

    .live-icon-left-arrow {
        background-image: url($images-root+"action-left-arrow.svg");
    }

    .live-icon-right-arrow {
        background-image: url($images-root+"action-right-arrow.svg");
    }

    .live-icon-cursor {
        background-image: url($images-root+"action-cursor.svg");
    }

    .live-icon-pencil {
        background-image: url($images-root+"action-pencil.svg");
    }

    .live-icon-highlighter {
        background-image: url($images-root+"action-highlighter.svg");
    }

    .live-icon-line {
        background-image: url($images-root+"action-line.svg");
    }

    .live-icon-rectangle {
        background-image: url($images-root+"action-rectangle.svg");
    }

    .live-icon-text {
        background-image: url($images-root+"action-text.svg");
    }

    .live-icon-picture {
        background-image: url($images-root+"action-picture.svg");
    }

    .live-icon-min {
        background-image: url($images-root+"action-min.svg");
    }
    .live-icon-endmeeting {
        width: 28px;
        height: 28px;
        margin: -6px 0px 0px -6px;
        background-color: #fff;
        background-image: url($images-root+"icon-endmeeting.png");
        background-size: 28px 28px;
    }
    #liveActionCamera {
        border-top: 1px solid #ccc;
        padding-top: 3px;
        margin-top: 7px;
    }
    .live-icon-camera {
        background-image: url($images-root+"camera.svg");
        width: 20px;
        height: 20px;
        background-size: 20px 20px;
    }
    .live-icon-listvideo {
        background-image: url($images-root+"iocn-listvideo.png");
    }
    .live-icon-onebigvideo {
        background-image: url($images-root+"iocn-onebigvideo.png");
    }
    .live-icon-note {
        background-image: url($images-root+"action-note.svg");
        background-size: 26px 26px;
        background-position: center center;
        width: 18px;
        height: 18px;
    }

    .live-icon-board {
        background-image: url($images-root+"action-board.svg");
        background-size: 26px 26px;
        background-position: center center;
        width: 18px;
        height: 18px;
    }

    .live-icon-clear {
        background-image: url($images-root+"action-clear.svg");
        background-size: 26px 26px;
        background-position: center center;
        width: 18px;
        height: 18px;
    }
    .live-icon-addpage {
        background-image: url($images-root+"action-addpage.svg");
        background-size: 26px 26px;
        background-position: center center;
        width: 18px;
        height: 18px;
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
    .maincontainer::-webkit-scrollbar-track-piece {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: #fff;
        width: 9px;
        height: 9px;
    }

    .maincontainer::-webkit-scrollbar {
        visibility: hidden;
        width: 9px;
        height: 9px;
        background-color: #fff;
    }

    .maincontainer:hover::-webkit-scrollbar {
        visibility: visible;
    }

    .maincontainer::-webkit-scrollbar-thumb {
        border-radius: 9px;
        height: 9px;
        width: 9px;
        background-color: #c2c2c2;
    }

    .maincontainer::-webkit-scrollbar-thumb:hover {
        background: #909090;
    }

    .live-btn {
        -moz-user-select: none;
        background-image: none;
        border: 1px solid transparent;
        border-radius: 4px;
        cursor: pointer;
        display: inline-block;
        font-size: 14px;
        font-weight: 400;
        line-height: 1.42857;
        margin-bottom: 0;
        padding: 6px 12px;
        text-align: center;
        vertical-align: middle;
        white-space: nowrap;
    }

    .live-btn-default {
        background-color: #fff;
        border-color: #ccc;
        color: #333;
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
    .meeting-userul>li {
        line-height: 30px;
    }

    .meeting-user li {
        float: left;
        height: 100%;
        // line-height: 30px;
        vertical-align: middle;
    }
    .meeting-user-menu{
        visibility: hidden;
    }
    .meeting-user:hover .meeting-user-menu
    {
        visibility:visible;
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
        color:#2db7f5;
    }

    .teach {
        border: 2px solid blue;
    }

    .livecontrol {
        height: 55px;
        width: 100%;
    }

    .live-ctl-btn {
        display: inline-block;
        background-color: #8c98ae;
        height: 32px;
        width: 32px;
        margin: 3px;
        border-radius: 50%;
        line-height: 32px;
        font-size: 32px;
        text-align: center;
        padding: 7px;
        color: #fff;
        box-sizing: content-box !important;
    }

    .live-ctl-btn.disable {
        filter: grayscale(100%);
        background-color: #bdbdbd;
        opacity: 0.5;
    }

    .live-ctl-btn.select {
        background-color: #44bbb4;
        opacity: 0.5;
    }

    .live-ctl-icon {
        background-repeat: no-repeat;
        display: inline-block;
        width: 32px;
        height: 32px;
        overflow: hidden;
        font-size: 0;
        line-height: 0;
        text-align: center;
        vertical-align: middle;
        background-size: 32px 32px;
        margin-top: -2px;
        box-sizing: content-box !important;
    }

    .live-ctl-icon-mic {
        background-image: url($images-root+"microphone.png");
    }

    .live-ctl-icon-camera {
        background-image: url($images-root+"camera.png");
    }

    .live-ctl-icon-switchcamera {
        background-image: url($images-root+"switchcamera.png");
    }

    .livetab {
        margin-top: 17px;
    }
    .livetab ul li:first-child {
        position: relative;
    }
    .livetab ul {
        padding-top: 16px;
        position: relative;
    }
    .livetab ul:before {
        content: "";
        opacity: 0.3;
        height: 1px;
        background: #f2f2f2;
        font-size: 0;
        width: 72%;
        position: absolute;
        top: 0;
        left: 14%;
    }

    .livetab ul li.livetab-active:first-child:before,
    .livetab ul li.livetab-active:first-child:hover::before {
        display: none;
    }

    .livetab ul li > span.icon {
        font-size: 28px;
        width: 100%;
    }

    .livetab-active {
        background-color: #f2f2f2;
        color: #4a4a4a;
    }
    .livetab-active > span.icon,
    .livetab ul li:hover > span.icon {
        color: #4a4a4a;
        background-color: #f2f2f2;
    }

    .livetab ul li > span.icon-close {
        display: none;
        font-size: 16px;
        width: 24px;
        line-height: 24px;
        color: #fff;
        height: 24px;
        border-radius: 100%;
        overflow: hidden;
    }

    .livetab-active > span.icon,
    .livetab ul li > span.icon:first-child {
        display: none;
    }

    .livetab ul li.livetab-active > span.icon:first-child {
        display: inline-block;
        width: 100%;
        background: #f2f2f2;
    }

    .livetab ul li > span.icon-close:hover,
    .livetab-active > span.icon-close,
    .livetab ul li:hover > span.icon-close {
        color: #fff !important;
    }

    .livetab ul {
        list-style: none;
    }

    .livetab ul li {
        height: 50px;
        line-height: 50px;
        color: rgba(255, 255, 255, 0.7);
        vertical-align: middle;
        align-items: center;
        justify-content: center;
        display: -webkit-flex;
        cursor: pointer;
    }

    .livetab ul li:hover {
        color: #4a4a4a;
        background-color: #f2f2f2;
    }

    .livetab-users {
        background-image: url($images-root+"users.svg");
        background-size: 16px 16px;
        height: 16px;
        width: 16px;
        display: inline-block;
    }

    .livetab-files {
        background-image: url($images-root+"files.png");
        background-size: 16px 16px;
        height: 16px;
        width: 16px;
        display: inline-block;
    }

    .livetab-message {
        background-image: url($images-root+"message.svg");
        background-size: 16px 16px;
        height: 16px;
        width: 16px;
        display: inline-block;
    }

    .livetab-setting {
        background-image: url($images-root+"setting.svg");
        background-size: 16px 16px;
        height: 16px;
        width: 16px;
        display: inline-block;
    }

    .livefilelist {
        box-sizing: border-box;
        height: 100%;
        overflow: auto;
        //position: relative;
        width: 350px;
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
    .live-file-item-more
    {
        width:25px; display:none;text-align:center;
    }
    .live-file:hover .live-file-item-more {
        display: inline-block;
    }
    .live-file.converting:hover .live-file-item-more {
        display: none;
    }
    .live-file-item-sync
    {
        display: none;
    }
    .live-file:hover .live-file-item-sync {
        //display: inline-block;
    }
    .live-file.converting:hover .live-file-item-sync {
        display: none;
    }

    .livefromfavorite {
        width: 115px;
        position: absolute;
        bottom: 15px;
        left: 16px;
        background: #445f73;
        border-color: #445f73;
    }

    .livefromfavorite:hover {
    }
    .livefromblankpage
    {
        width: 105px;
        position: absolute;
        bottom: 15px;
        right: 16px;
        background: #445f73;
        border-color: #445f73;
    }
    .livefromcamera {
        width: 105px;
        position: absolute;
        bottom: 15px;
        left: 141px;
        background: #445f73;
        border-color: #445f73;
        padding:6px 3px;
    }
    .DC1 {
        top: 0px;
        left: 0px;
        height: 100%;
        width: 100%;
        opacity: 1;
    }

    .DC0 {
        top: 0px;
        left: 0px;
        height: 100%;
        width: 100%;
        opacity: 0;
    }

    .contentHolder {
        top: 100px;
        left: 150px;
    }

    .live-ppt-container {
        left: 0px;
        top: 0px;
        overflow: hidden;
        -moz-transform-origin: 0 0;
        -o-transform-origin: 0 0;
        -webkit-transform-origin: 0 0;
        -ms-transform-origin: 0 0;
        position: relative;
        box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
    }

    .live-ppt-container canvas {
        top: 0px;
        left: 0px;
        position: absolute;
    }

    .live-ppt-container div,
    iframe {
        position: absolute;
    }

    .live-ppt-container pre {
        position: absolute;
        margin: 0px;
        letter-spacing: -0.04px;
        -ms-transform-origin: 0 0;
        -webkit-transform-origin: 0 0;
        -moz-transform-origin: 0 0;
        -o-transform-origin: 0 0;
    }

    .live-ppt-container img {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0px;
        top: 0px;
    }
    .liveButtonSizeModeWidth{
      background-image: url($images-root+"icon-fitWidth.svg");
      background-position:center;
      background-repeat:no-repeat;
      background-size:16px 16px;
      width:16px;
      height:16px;
      position: relative;
      top: 8px;
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
      top: 8px;
      display: inline-block;
      margin-left: 5px;
      cursor: pointer;
  }
}

.live-upcominglist {
    padding-top: 10px;
}
.live-upcomingitem {
    display: inline-block;
}
.live-upcomingitem ul {
    padding: 0px;
    list-style: none;
}
.live-upcomingitem ul li {
    float: left;
}
#livectlheadbar {
    position: absolute;
    right: 10px;
    top: 25px;
    z-index: 2;
}
#livectlheadbar span.icon {
    font-size: 32px;
    display: inline-block;
}
#livectlheadbar span.icon-fullscreen,
#liveActionMin .icon-fullscreen {
    color: #2e3d49;
}
#livectlheadbar span.icon-quit,
#liveActionEnd .icon-quit {
    color: #d0021b;
}

#liveActionPencil {
    background-image: url(../../../static/images/toolsmore.svg);
    background-repeat: no-repeat;
    background-position: 86% 86%;
}
#liveActionTools {
    background-image: url(../../../static/images/toolsmore.svg);
    background-repeat: no-repeat;
    background-position: 86% 86%;
}
.live-action-tool-wrap {
    padding: 7px 0;
    margin: 7px 0;
    position: relative;
}
.live-action-tool-wrap:before {
    top: 0;
}
.live-action-tool-wrap:after {
    bottom: 0;
}
.live-action-tool-wrap:before,
.live-action-tool-wrap:after {
    content: "";
    background: #d3d3d3;
    width: 26px;
    height: 1px;
    position: absolute;
    left: 5px;
}
.live-pdf-action .icon-icon-video-enable,
.live-pdf-action .icon-icon-mic-enable {
    color: #4a90e2;
}
.live-action-tool-wrap #liveActionTools {
    background: url(../../../static/images/bg-live-action.svg) no-repeat 88%
        center;
}
#liveheadteachname {
}
.liveControlWrap {
    width: 56px;
    background: #2e3d49;
    height: 100%;
    float: left;
}

.liveControlTabWrap {
    width: 300px;
    background: #f4f5f7;
    padding: 25px 0 12px;
    height: 100%;
    float: left;
}

#liveActionEnd .icon-quit,
#liveActionMin .icon-fullscreen {
    font-size: 30px;
}

.liveControlTabWrap h3 {
    text-align: left;
    font-size: 22px;
    font-weight: normal;
    margin-bottom: 18px;
    padding: 0 18px 14px;
    border-bottom: 1px solid #ccc;
}

.liveToolbar .icon {
    font-size: 18px;
    color: #333;
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
}

.liveToolbar .icon-prev,
.liveToolbar .icon-next {
    font-size: 14px;
    margin: 0 10px;
}

.liveFileUploadStyle {
    display: block;
    height: 86px;
    width: 350px;
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
.hide {
    display: none;
}
.show {
    display: inline-block;
}

.live-lesson .live-share-btn {
    width: 40px;
    height: 40px;
    line-height: 40px;
}
.live-lesson .livetab ul li > span.icon {
    font-size: 26px;
}
</style>
<script>
//import websocket from '../../websocket';
import MediaView from "./MediaView.vue";
import RongCloudView from "./RongCloudView.vue";
import VideoPlayer from "./VideoPlayer.vue";
import SyncPlayer from "./SyncPlayer.vue";
import UploadFile from "./UploadFile.vue";
import TakePhoto from "./TakePhoto.vue";
//import TencentView from './TencentView.vue';
import LiveLessonHeader from "./LiveLessonHeader.vue";
import SelectCourseTemp from "./SelectCourseTemp.vue";
import SelectPrepareFile from "./SelectPrepareFile.vue";
import ControlSetting from "../user/ControlSetting.vue";
import LessonInfo from "./LessonInfo.vue";
import MediaSetting from "../user/MediaSetting.vue";
import MediaSettingTeacher from "../user/MediaSettingTeacher.vue";
import SelectFileFromFav from "./SelectFileFromFav.vue";
import SelectFileFromSpace from "./SelectFileFromSpace.vue";
import SelectLectures from "./SelectLectures.vue";
import auth from "../../authenticator";
import friends from "../../friends/index.js";
import webapi from "../../webapi/webapi.js";
import loger from "../../common/log.js";
import util from "../../common/util.js";
import audioRecorder from "../../common/audioRecorder.js";
import _ from "lodash";

import ShareDocModal from "../kloudsync/ShareDocModal.vue";
import WhiteBoardTool from "../../common/whiteboard.js";
import '../../common/whiteboard.css';

//import Vue from 'vue';
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

var whiteboard = new WhiteBoardTool();
var websocket = null;
var EVENTSTART = "mousedown",EVENTMOVE = "mousemove", EVENTEND = "mouseup", EVENTCLICK = "click";
var ISPC = 0;
var PDFCOUNT=0;
var DEFAULT_SCALE = 1.0,DEFAULT_SCALE_DELTA = 1.1, MIN_SCALE = 0.25, MAX_SCALE = 5.0,CurrentScale = 1;
var PageNumber = 1;
var ToPageNumber = 1;
var IsRecord = false;
var IsPlay = false;
var RecordAction = null;
var RecordTime = null;
var PalyTimer = null;
var DrawTarget = null;
var IsLoadingPage = false;
var IsShowLog = false;
var SyncFun = null;
var UserListInfo = null;
var MeetingID = "";
var IsJoinSocketMeeting = false;
var AttachmentID = "";
var PresenterUserID = "";
var BoardTimer = null;
var LineTimer = null;
var Context = null;
var Role = 3;
var CanGotoNext = true;
var LastChangeTime = new Date();
var JoinMeetingTimer = null;
var loadPageTimer = null;
var ToLoadList = new Array();
var NewPageList = [];
var PDFPageObject = new JsMap();
var LoadedPageMap = new JsMap();
var closeTabStatus = false;
var LastVideoTagID = "";
var LastToolFun = null;
var LastMouseTime = new Date();
var MouseHistory = new Array();
var MouseTimer = null;
var SendMousePozTimer = null;
var LastClickTime = new Date();
var HideClickTime = new Date();
var IsMouseShow = false;
var AutoPlayTimer = null;
var IsPPT=false;
var IsInlineWihteBoardShow=false;
var IsDocEidt=false;
var LastRouterPath="/";
var IsChangePageByClick=false;

function InitWhiteBoard()
{
    whiteboard.OnToolReset(function(res) {
      //console.log("OnToolReset:"+res);
      if(res=="")
      {
          _activeButton("#liveActionCursor");
      }
      else if(res=="ToolPen")
      {
          _activeButton("#liveActionPencil");
      }
      else if(res=="ToolBrush")
      {
          _activeButton("#liveActionHighlighter");
      }
      else if(res=="ToolLine")
      {
          _activeButton("#liveActionLine");
      }
      else if(res=="ToolText")
      {
          _activeButton("#liveActionText");
      }
      else if(res=="ToolNote")
      {
          _activeButton("#liveActionNote");
      }
      else if(res=="ToolBoard")
      {
          _activeButton("#liveActionBoard");
      }
      else if(res=="ToolVideo")
      {
          _activeButton("#liveActionVideo");
      }
    });

    whiteboard.OnReceviceData(function(res) {
        // if(res.type!=34 && res.type!=35)
        // {
        //     console.log("OnReceviceData:"+ JSON.stringify(res));
        // }
        CheckDocEdit(res);
       if (!Context.showUploadFile) {
            return;
        }       
        var t = Context.getAudioCurrentTime();
        if (t >= 0) {
            res.time = t;
        }
        try {
            if (SyncFun) SyncFun(JSON.stringify(res));
        } catch (ex) {}
    });
    var lastLineErrorDate=null;
    var lastDownloadErrorDate=null;
    //var lastImageErrorDate=null;
    whiteboard.OnError(res=>{
        //{Code:11,Data:obj}
        console.info("Error=>"+JSON.stringify(res));
        //console.log(res);
        if(res.Code==1 || res.Code==3 || res.Code==5)
        {
            if(Context.preShareMode != 10)
            {
                return;
            }
            if(lastLineErrorDate && (new Date() - lastLineErrorDate) < 6000)
            {
                return;
            }
            lastLineErrorDate=new Date();
            Context.$Message.error({content:'网络慢，文档下载中。',duration: 5});
        }
        else if(res.Code==4)
        {
            if(lastDownloadErrorDate && (new Date() - lastDownloadErrorDate) < 6000)
            {
                return;
            }
            lastDownloadErrorDate=new Date();
            Context.$Message.error({content:'网络慢,文件下载不成功。',duration: 5});
        }
        else if(res.Code==100)
        {
            // if(lastImageErrorDate && (new Date() - lastImageErrorDate) < 8000)
            // {
            //     return;
            // }
            // lastImageErrorDate=new Date();
            Context.$Message.destroy();
            Context.$Message.error({content:'网络慢,文件下载不成功。',duration: 5});
        }
    });

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
                Context.checkTeampFilePath();
            },2000);
        }
        else if(process==100)
        {
            Context.$Message.destroy();
            util.ShowDownload(false);
        }
        else
        {
            util.ShowDownload(false);
        }
       

    });
   
    whiteboard.OnPageChange((pagenumber,type)=>{
      //console.log("OnPageChange:"+pagenumber);
      PageNumber=pagenumber;
      ToPageNumber=pagenumber;
      ShowPdfInfo();
      AfterChangePage(pagenumber);
      Context.ShowSyncObject(pagenumber,IsChangePageByClick);
      IsChangePageByClick=false;
      CurrentScale=1;
      updateToolbar();
      if(PageNumber==1)
      {
          if($("#liveButtonPrevious").hasClass("icon-left"))
          {
            $("#liveButtonPrevious").removeClass("icon-left").addClass("icon-left-end");
          }
      }
      else
      {          
          if($("#liveButtonPrevious").hasClass("icon-left-end"))
          {
            $("#liveButtonPrevious").removeClass("icon-left-end").addClass("icon-left");
          }
      }
      if(PageNumber==PDFCOUNT)
      {          
          if($("#liveButtonNext").hasClass("icon-right"))
          {
            $("#liveButtonNext").removeClass("icon-right").addClass("icon-right-end");
          }
      }
      else
      {
          if($("#liveButtonNext").hasClass("icon-right-end"))
          {
            $("#liveButtonNext").removeClass("icon-right-end").addClass("icon-right");
          }
      }
    });
    whiteboard.OnSelectVideo((id,afterSelectVideo)=>{
        console.log("OnSelectVideo");
      Context.$refs.syncplayer.selectVideoShow((d)=>{
          console.log("afterSelectVideo");
          afterSelectVideo(id,d);
      });
      
    });
    whiteboard.OnVideoPlay(id=>{
      console.log("OnVideoPlay:"+id);
      Context.playVideoTag(id);

    });
    whiteboard.OnBoardDisplayChange((isshow)=>{
        //console.log("OnBoardDisplayChange:"+isshow);
        IsInlineWihteBoardShow=isshow;
        Context.ChangeDrawTool4WhiteBoardDiplayChange(isshow);
    });
    whiteboard.OnUndoRedoStatChange((undostat,redostat)=>{
        //console.log("OnUndoRedoStatChange:"+undostat+","+redostat);
        if(undostat==0)
        {
            if(!$("#liveActionUndo").hasClass("disable"))
                $("#liveActionUndo").addClass("disable");
        }
        else
        {
            $("#liveActionUndo").removeClass("disable");
        }
        if(redostat==0)
        {
            if(!$("#liveActionRedo").hasClass("disable"))
                $("#liveActionRedo").addClass("disable");
        }
        else
        {
            $("#liveActionRedo").removeClass("disable");
        }
    });
}
function CheckDocEdit(data)
{
    if(IsDocEidt || !data.type) return;
    if(data.type==21 || data.type==24|| data.type==25|| data.type==26|| data.type==27|| data.type==28|| data.type==33|| data.type==101|| data.type==102|| data.type==103)
    {
        IsDocEidt=true;
    }
}
function ShowPDF(Url, pageNum, callback,itemid=0) {
    ToPointer();
    whiteboard.ShowDocument($("#main"),Url,pageNum,(issuccess, pdfcount)=>{
        PDFCOUNT=pdfcount;
        if (AfterLoadPDF) AfterLoadPDF(pageNum);
        if (callback) callback(true);
        AfterChangePage(pageNum);        
    },itemid);
}
function ShowPDFPage(pageNum, callback, ishide, needScale) {
    //console.log("ShowPDFPage(todo):"+pageNum);
    // ShowImagePageEx(
    //     pageNum,
    //     function(issuccess) {
    //         if (callback) callback(issuccess);
    //     },
    //     ishide,
    //     GetPdfPageUrl(PDFURL, pageNum),
    //     needScale
    // );
    whiteboard.PreLoadPage(pageNum,(isscucess,pageNo)=>{
        var index = FindStrInArr(ToLoadList,pageNo);
        if(index>-1) ToLoadList.splice(index,1);
    });

}
function ZoomIn() {
    var oldinfo=whiteboard.GetPageInfo();
    whiteboard.Clear();
    whiteboard.ZoomIn((scale)=>{
        CurrentScale=scale;
        updateToolbar();
        for(var info of oldinfo)
        {
            whiteboard.Play(info,true);
        }
    });
    return false;
}
function ZoomOut() {
    var oldinfo=whiteboard.GetPageInfo();
    whiteboard.Clear();
    whiteboard.ZoomOut((scale)=>{
        CurrentScale=scale;
        updateToolbar();
        for(var info of oldinfo)
        {
            whiteboard.Play(info,true);
        }
    });
    return false;
}
function ZoomTo(scale) {
    var oldinfo=whiteboard.GetPageInfo();
    whiteboard.Clear();
    whiteboard.ZoomTo(scale,(s)=>{
        CurrentScale=s;
        updateToolbar();
        for(var info of oldinfo)
        {
            whiteboard.Play(info,true);
        }
    });
    return false;
}
function MainTouch() {}
function UnbindMainTouch() {
    if (DrawTarget != null) {
        DrawTarget.unbind();
    }
}
function GetPdfCount (Url)
{
    var re = Url.match(/\<\d+\>/ig);
    if (!re || re.length == 0)
    {
        return 1;
    }
    return parseInt(re[0].replace(/\<|\>/ig, ""));
}
function _drawGetSvg(pageno) {
    pageno = pageno || PageNumber;
    if (!IsPPT) {
        if (document.getElementById("svg" + pageno)) {
            return document.getElementById("svg" + pageno);
        }
        return $(document.body)
            .find("div.pageContainer:visible")
            .find("svg")[0];
    } else {
        var svg = $("#s" + pageno + "s0").find(">svg");
        if (svg.length == 0) {
            $("#s" + pageno + "s0").append(
                "<svg id='svg" +
                    pageno +
                    "' width='100%' style='position:absolute;top:0px;left:0px;' height='100%' version='1.1' xmlns='http://www.w3.org/2000/svg' xlink='http://www.w3.org/1999/xlink'></svg>"
            );
            svg = $("#s" + pageno + "s0").find(">svg");
            return svg[0];
        } else {
            return svg[0];
        }
    }
}

function ShowPdfInfo() {
    //loger.log("ShowPdfInfo:" + PageNumber);
    //$("#pdfinfo").find(">span").html(PageNumber + "/" + PDFCOUNT);
    $("#livePageNumber").text(GetShowNumber(PageNumber));
    if (PageNumber > PDFCOUNT + NewPageList.length) {
        $("#livePageCount").text("");
    } else {
        $("#livePageCount").text(" / " + (PDFCOUNT + NewPageList.length));
    }
    if (websocket) {
        websocket._currentPageID = ToPageNumber;
    }
}
function ShowPdfInfoEx() {
    loger.log("ShowPdfInfoEx:" + ToPageNumber);
    //$("#pdfinfo").find(">span").html(PageNumber + "/" + PDFCOUNT);
    $("#livePageNumber").text(GetShowNumber(ToPageNumber));
    if (ToPageNumber > PDFCOUNT + NewPageList.length) {
        $("#livePageCount").text("");
    } else {
        $("#livePageCount").text(" / " + (PDFCOUNT + NewPageList.length));
    }
    if (websocket) {
        websocket._currentPageID = ToPageNumber;
    }
}
function GetShowNumber(pageid) {
    var result = 0;
    for (var id of NewPageList) {
        if (id <= pageid) {
            result++;
        }
    }
    return Math.floor(pageid) + result;
}
function AddBlankPage2Array(id) {
    if (!IsExistInArr(NewPageList, id)) {
        NewPageList.push(id);
    }
}
function Record() {
  
    IsRecord = true;
    whiteboard.SetRecord(true);
}
function StopRecord() {
    if (BoardTimer) {
        clearTimeout(BoardTimer);
        BoardTimer = null;
    }
    if (LineTimer) {
        clearTimeout(LineTimer);
        LineTimer = null;
    }
    if (IsRecord) {
        CloseTools();
        IsRecord = false;
        whiteboard.SetRecord(false);
    } else if (IsPlay) {
        IsPlay = false;
        clearTimeout(PalyTimer);
    }
}
function RecordHandle(obj) {
    //loger.log(JSON.stringify(obj));
    if (!Context.showUploadFile) {
        return;
    }
    if (ISPC == 1) {
        obj.time = new Date() - RecordTime;
        RecordAction.push(obj);
        loger.log(JSON.stringify(obj));
        return;
    }
    //debugger;
    var t = Context.getAudioCurrentTime();
    if (t >= 0) {
        obj.time = t;
    }
    try {
        // if(obj.type==21)
        // {
        //     console.log(JSON.stringify(obj));
        // }
        if (SyncFun) SyncFun(JSON.stringify(obj));
    } catch (ex) {}
}
function getContainerWidth() {
    if (GetPageContainer(PageNumber).length == 0) {
        return $("#main").width();
    } else {
        return GetPageContainer(PageNumber).width();
    }
}
function getContainerHeight() {
    if (GetPageContainer(PageNumber).length == 0) {
        return $("#main").height();
    } else {
        return GetPageContainer(PageNumber).height();
    }
}
function getViewWidth() {
    //console.log(document.body.clientWidth,$(document.body).width(),$("#liveControlWindow").width());
    var result = document.body.clientWidth - 10;
    if($("#liveControlWindow").is(":visible"))
    {
        result-=$("#liveControlWindow").width();
    }
    if(document.body.scrollHeight>document.body.clientHeight)
    {
        result+=17;
    }
    return result;
}
function getViewHeight() {
    var diff = 0;
    if ($("#liveHead").is(":visible")) {
        diff = $("#liveHead").outerHeight();
    }
    return Math.max(document.body.clientHeight - diff - 2, 100);
}

function PlayRecordAction(svg, a) 
{

}
function GetPageContainer(pageid) {
    if (IsPPT) {
        return $("#s" + pageid + "s0");
        //return $("#main");
    } else {
        var id = "#pageContainer" + pageid;
        id = id.replace(".", "\\.");
        return $(id);
    }
}
function GetFixedPageNumber(pageid) {
    return (pageid + "").replace(".", "\\.");
}

function AutoPlayDocument(play, sec) {
    if (play) {
        AutoPlayTimer = setInterval(function() {
            console.log("AutoPlayDocument:NextPage:"+play);
            NextPage();
        }, sec * 1000);
    } else {
        if (AutoPlayTimer) {
            clearTimeout(AutoPlayTimer);
            AutoPlayTimer = null;
        }
    }
}
function ToPointer(isClickBtn) {
    if (isClickBtn) {
        CanGotoNext = true;
    }
    LastToolFun = null;
    CloseTools();
    ClearTools();
    ResetTools($("#liveActionCursor"));
    UnbindMainTouch();
    MainTouch();
    if (BoardTimer) {
        clearTimeout(BoardTimer);
        BoardTimer = null;
    }
    if (LineTimer) {
        clearTimeout(LineTimer);
        LineTimer = null;
    }
}
function AfterChangePage(pageno) {
    //return;
    //loger.log("AfterChangePage:" + pageno);
    pageno = Math.floor(pageno);
    PreLoadPageFile(pageno);
}
function PreLoadPageFile(pageno) {
    if (PDFCOUNT <= 1) {
        return;
    }
    ToLoadList=[];
    for (var i = pageno - 1; i <= pageno + 1; i++) {
        if (i > 0 && pageno!=i && i <= PDFCOUNT) {
            if (!IsExistInArr(ToLoadList, i)) {
                ToLoadList.push(i);
            }
        }
    }
    for (var j = 0; j < ToLoadList.length; j++) {
        if (!ToLoadList[j] || ToLoadList[j] > PDFCOUNT || ToLoadList[j] < 1) {
            continue;
        }
        if (GetPageContainer(ToLoadList[j]).length == 0) {
            ShowPDFPage(ToLoadList[j], function() {}, true, false);
        }
    }
}

function ClearPath() {
   whiteboard.Clear();
}
function ClearTools() {
   
}
function ResetTools(cur) {
    $("#liveActionPencil").removeClass("live-pdf-action-active");
    $("#liveActionLine").removeClass("live-pdf-action-active");
    $("#liveActionHighlighter").removeClass("live-pdf-action-active");
    $("#liveActionNote").removeClass("live-pdf-action-active");
    $("#liveActionDraw").removeClass("live-pdf-action-active");
    $("#liveActionBoard").removeClass("live-pdf-action-active");
    $("#liveActionVideo").removeClass("live-pdf-action-active");
    $("#liveActionClear").removeClass("live-pdf-action-active");
    $("#liveActionUndo").removeClass("live-pdf-action-active");
    $("#liveActionRedo").removeClass("live-pdf-action-active");
    $("#liveActionText").removeClass("live-pdf-action-active");
    $("#liveActionCursor").removeClass("live-pdf-action-active");
    $("#liveActionPlay").removeClass("live-pdf-action-active");

    if (cur) {
        setTimeout(function() {
            cur.addClass("live-pdf-action-active");
        }, 100);
    }
}
function ShowMsg(msg) {
    $("#msg")
        .find("span")
        .html(msg);
    $("#msg")
        .css({ left: "-500px" })
        .show();
    $("#msg")
        .animate({ left: "15px", opacity: 1 }, 500)
        .delay(1200)
        .animate({ left: "-500px", opacity: 1 }, 500);
}
function CloseTools() {
    //$('#maintools').panel('close');
}
function AfterLoadPDF() {
    ShowPdfInfo();
    //Record_view();
    //alert("pdf loaded");
}
function ShowLog() {
    IsShowLog = !IsShowLog;
    if (IsShowLog) {
        setTimeout(function() {
            $("#div_btn_log").addClass("live-pdf-action-active");
        }, 500);
    } else {
        setTimeout(function() {
            $("#div_btn_log").removeClass("live-pdf-action-active");
        }, 500);
    }
    CloseTools();
}
function CheckZoom() {

    DrawTarget = null;
    var oldinfo=whiteboard.GetPageInfo();
    whiteboard.Clear();
    whiteboard.ZoomTo(CurrentScale,(scale)=>{
        CurrentScale=scale;
        updateToolbar();
        for(var info of oldinfo)
        {
            //console.log(JSON.stringify(info));
            whiteboard.Play(info);
        }
    });
}
function log(log) {
    loger.log(log);
}

function PlayActionByTxt(txt, attchid) {
    //var actions = ParseAction(txt);
    //loger.log(txt);
    //debugger;
    if (IsShowLog) {
        ShowMsg(txt);
    }
    var a = JSON.parse(txt);

    if(a.actionType && a.actionType==8)
    {
        Context.onAttachmentChangeFromOther(a);
        return;
    }

    
    if (a.type && a.type == 2) {
        //PlayRecordAction(null, a);
        whiteboard.Play(a,true);
        return;
    }
    var pageid = PageNumber;
    if (a.page) {
        pageid = a.page;
    }
    var svg = _drawGetSvg(pageid);
    if (!svg) {
        var atmid = AttachmentID;
        window.setTimeoutEx(RePlayAction, 1000, a, 1, atmid); //teacher change page too faster, student no svg to draw line. so delay draw
        return;
    }
    //PlayAction(svg, actions[0]);
    if (a.page && PageNumber != a.page && a.page != 0) {
        //Play_ChangePage(svg, a);
        //setTimeout(() =>
        //{
        //  PlayRecordAction(svg, a);
        //}, 1000);
    } else {
        //PlayRecordAction(svg, a);
        whiteboard.Play(a,true);
    }
    //PlayRecordAction(svg, a);
}
function RePlayAction(a, count, atmid) {
    if (AttachmentID != atmid) {
        return;
    }
    var pageid = PageNumber;
    if (a.page && a.page != 0) {
        pageid = a.page;
    }

    var svg = _drawGetSvg(pageid);
    if (!svg) {
        if (count > 3) {
            return;
        }
        window.setTimeoutEx(RePlayAction, 2000, a, count + 1, atmid);
        return;
    } else {
        //PlayRecordAction(svg, a);
        whiteboard.Play(a,true);
    }
}
//page logic V

function ParseUserListEx(list) {
    var result = new Array();
    if (!list || list == null) {
        return result;
    }
    for (var i = 0; i < list.length; i++) {
        var obj = new Object();
        obj.userId = list[i].userId;
        obj.userName = list[i].userName;
        obj.rongyunId = list[i].rongCloudId;
        obj.face =
            list[i].avatarUrl == ""
                ? "/static/images/defaultface.png"
                : list[i].avatarUrl;
        obj.sessionId = list[i].sessionId;
        obj.role = list[i].role;
        obj.ispresenter = list[i].presenter == 1;
        obj.isoffline = list[i].isOnline == 0;
        obj.showtel = false;
        result.push(obj);
    }
    return result;
}
function ParseUserList(txt) {
    var result = new Array();
    if (!txt || txt == "") {
        return result;
    }
    var arr = txt.split(";");
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == "") {
            continue;
        }
        var list = arr[i].split(",");
        var obj = new Object();
        obj.userId = list[0];
        obj.userName = list[1];
        obj.rongyunId = list[2];
        obj.face = list[3] == "" ? "/static/images/defaultface.png" : list[3];
        obj.sessionId = list[4];
        obj.role = list[5];
        obj.ispresenter = list[6] == "true";
        obj.isoffline = list[7] == "0";
        obj.showtel = false;
        result.push(obj);
    }
    return result;
}
function GetUserRole(userid, userlist) {
    for (var i = 0; i < userlist.length; i++) {
        if (userid == userlist[i].userId) {
            return userlist[i].role;
        }
    }
    return 3;
}
function ShowUserList(userlist, needdelete = false) {
    //var existuser = new Array();
    var html = "";
    var addeduser = new Array();
    //var userlist = sortUserInfo(userlist);
    for (var user of userlist) {
        addeduser.push(user.userId);
        if (
            user.ispresenter &&
            user.userId == auth.getUserIDEx() &&
            Context.showUploadFile == false
        ) {
            AfterMakePresenter({ presenterId: user.userId });
        }
        if (IsUserExist(user.userId)) {
            //$("#user-" + user.userId).attr("sid", user.sessionId).removeClass("offline");
            UpdateUser4List(user);
            continue;
            //DelUserFromList(user.userId);
        }
        //html += String.format('<div class="meeting-user" id="user-{2}" role="{4}" ispresenter="{5}" sid="{6}"><ul><li class="meeting-user-face {3}"><img src="{0}" /></li><li class="meeting-user-name {7}">{1}</li><li></li></ul></div>',
        //  user.face, user.userName, user.userId, user.role == "2" ? "teach" : "", user.role, user.role == "2" ? "1" : "0", user.sessionId, GetRoleClass(user.role));
        var role = user.role;
        // if (role == "3") {
        //     role = "1";
        // }
        var userinfo = {
            userid: user.userId,
            name: user.userName,
            role: user.role,
            faceurl: user.face,
            sid: user.sessionId,
            isoffline: user.isoffline,
            order: GetUserOrder(role),
            showtel: false,
            ispresenter: user.ispresenter,
            faceclass: user.ispresenter ? "teach" : "",
            nameclass: GetRoleClass(role)
        };
        Context.userList.push(userinfo);
        if (user.isoffline == false) {
            Context.CheckVideoAfterOnline(parseInt(user.userId));
        }
    }

    for (let j = Context.userList.length - 1; j >= 0; j--) {
        if (!IsExistInArr(addeduser, Context.userList[j].userid)) {
            Context.userList.splice(j, 1);
        }
    }

    Context.userList.sort(sortUserList);

    //for (var userid of existuser)
    //{
    //  if (!IsExistInArr(addeduser, userid))
    //  {
    //    $("#user-" + userid).remove();
    //  }
    //}
}
function GetRoleClass(role) {
    switch (role + "") {
        case "1":
            return "student";
            break;
        case "2":
            return "teacher";
            break;
        case "3":
            return "auditor";
            break;
        default:
            return "auditor";
            break;
    }
}
function GetUserOrder(role) {
    switch (role + "") {
        case "1": //student
            return 2;
            break;
        case "2": //teacher
            return 1;
            break;
        case "3":
            return 3;
            break;
        default:
            return 3;
            break;
    }
}
function Add2UserList(ids, callback) {
    if (ids == "") {
        if (callback) callback();
        return;
    }
    
    var arr = ids.split(",");
    webapi.getUsersInfo(arr, Context.getMeetingID()).then(userlist => {
        //var html = "";
        if(userlist && userlist.length>1)IsDocEidt=true;
        for (var user of userlist) {
            if (IsUserExist(user.UserID)) {
                continue;
            }
            //html += String.format('<div class="meeting-user offline" id="user-{2}" role="{4}" ispresenter="{5}" sid="{6}"><ul><li class="meeting-user-face {3}"><img src="{0}" /></li><li class="meeting-user-name {7}">{1}</li><li></li></ul></div>',
            //  user.AvatarUrl, user.UserName, user.UserID, user.RoleInLesson == "2" ? "teach" : "", user.RoleInLesson, user.RoleInLesson == "2" ? "1" : "0", "0", GetRoleClass(user.RoleInLesson));
            var role = user.RoleInLesson; //1:student 2:teacher 3:aut
            // if (role + "" == "3") {
            //     role = "1";
            // }
            var userinfo = {
                userid: user.UserID,
                name: user.UserName,
                role: user.RoleInLesson,
                faceurl:
                    user.AvatarUrl == ""
                        ? "/static/images/defaultface.png"
                        : user.AvatarUrl,
                sid: 0,
                isoffline: true,
                showtel: false,
                order: GetUserOrder(role),
                ispresenter: role == "2",
                faceclass: role == "2" ? "teach" : "",
                nameclass: GetRoleClass(role)
            };
            if (role + "" == "2") {
                Context.userList = Context.userList.concat([userinfo]);
            } else {
                Context.userList.push(userinfo);
            }
        }
        if (callback) callback();
    });
}
function DelUserFromList(userid) {
    //$("#user-" + userid).remove();
    for (let i = 0, j = Context.userList.length; i < j; i++) {
        if (Context.userList[i].userid + "" == userid + "") {
            Context.userList.splice(i, 1);
            return;
        }
    }
}
function LevalMeeting(obj) {
    if (obj.retData) {
        obj = obj.retData;
    }
    DelUserFromList(obj.userId);
    UpdateUserList(obj.usersList);
    Context.audienceCount=obj.audienceCount;
}
function UpdateUser4List(user) {
    for (let i = 0, j = Context.userList.length; i < j; i++) {
        if (Context.userList[i].userid + "" == user.userId + "") {
            if (
                Context.userList[i].isoffline == false &&
                user.isoffline == true
            ) {
                Context.HideVideoAfterOffline(parseInt(user.userId));
            } else if (
                Context.userList[i].isoffline == true &&
                user.isoffline == false
            ) {
                Context.CheckVideoAfterOnline(parseInt(user.userId));
            }
            Context.userList[i].isoffline = user.isoffline;
            Context.userList[i].sid = user.sessionId;
            Context.userList[i].ispresenter = user.ispresenter;
            Context.userList[i].faceclass = user.ispresenter ? "teach" : "";
            if (user.ispresenter && user.userId + "" == auth.getUserIDEx()) {
                Record();
            }
            return;
        }
    }
}
function UpdateUserPhoneInList(uid, isshow) {
    for (let i = 0, j = Context.userList.length; i < j; i++) {
        if (Context.userList[i].userid + "" == uid + "") {
            Context.userList[i].showtel = isshow;
            return;
        }
    }
}
function IsUserExist(userid) {
    for (let i = 0, j = Context.userList.length; i < j; i++) {
        if (Context.userList[i].userid + "" == userid + "") {
            return true;
        }
    }
    return false;
}
function GetMeetingCount() {
    var result = 0;
    for (let i = 0, j = Context.userList.length; i < j; i++) {
        if (
            Context.userList[i].role + "" == "1" ||
            Context.userList[i].role + "" == "2"
        ) {
            result++;
        }
    }
    return result;
}
function GetUserFromList(userid) {
    for (var user of Context.userList) {
        if (user.userid + "" == userid + "") {
            return user;
        }
    }
    return null;
}
function sortUserList(a, b) {
    if (a.role + "" == "2") {
        return -2;
    } else if (a.userid + "" == auth.getUserIDEx()) {
        return -1;
    } else if (a.role + "" == "1" && b.role + "" == "1") {
        return 0;
    } else if (a.role != b.role) {
        return 1;
    }
}
function sortUserInfo(arr) {
    var result = new Array();
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].role + "" == "2") {
            //teacher
            result.push(arr[i]);
        }
    }
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].role + "" == "1") {
            //student
            result.push(arr[i]);
        }
    }
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].role + "" != "2" && arr[i].role + "" != "1") {
            //other
            result.push(arr[i]);
        }
    }
    return result;
}
function UpdateUserList(txt, needdelete = false) {
    
    var userlist = null;
    if (typeof txt == "string") {
        userlist = ParseUserList(txt);
    } else {
        userlist = ParseUserListEx(txt);
    }
    if(userlist && userlist.length>1)IsDocEidt=true;
    ShowUserList(userlist, needdelete);
}
function InitMenu() {
    return;
    var userid = auth.getUserIDEx();
    var selectuser = null;
    util.LoadKendoFiles().then(()=>{
        var menu = $("#userlistmenu")
            .kendoContextMenu({
                target: "#liveUserList",
                animation: {
                    open: { effects: "fadeIn" },
                    duration: 500
                },
                open: function(e) {
                    //debugger;
                    //e.event.target
                    var tar = $(e.event.target).parents("div:first");
                    selectuser = tar;
                    if (
                        !tar.hasClass("meeting-user") ||
                        tar.hasClass("offline") ||
                        tar.attr("ispresenter") == "true" ||
                        tar.attr("sid") == "0" ||
                        (Context.showUploadFile == false &&
                            (tar.attr("role") == "3" || Role == 3 || Role == 1))
                    ) {
                        $("#menu-makepresenter", e.item).hide();
                    } else {
                        $("#menu-makepresenter", e.item).show();
                    }
                    if (
                        tar.attr("ispresenter") != "true" &&
                        tar.attr("sid") == auth.getUserToken()
                    ) {
                        $("#menu-makepresenter", e.item).show();
                    }

                    if (
                        tar.attr("role") == "3" &&
                        !tar.hasClass("offline") &&
                        Role == 2
                    ) {
                        $("#menu-uptostudent", e.item).show();
                    } else {
                        $("#menu-uptostudent", e.item).hide();
                    }
                    if (
                        tar.attr("id") == "user-" + userid &&
                        tar.find("li.meeting-user-name").hasClass("auditor")
                    ) {
                        $("#menu-uptostudent", e.item).show();
                    }
                },
                select: function(e) {
                    var menuid = $(e.item).attr("id");
                    if ("menu-makepresenter" == menuid) {
                        MakePresenter(
                            selectuser.attr("id").replace("user-", ""),
                            selectuser.attr("sid")
                        );
                    } else if ("menu-uptostudent" == menuid) {
                        if (GetMeetingCount() >= 7) {
                            alert("Too many student!");
                            return;
                        }
                        UptoStudent(
                            selectuser.attr("id").replace("user-", ""),
                            selectuser.attr("sid")
                        );
                    } else if ("menu-inviteuser" == menuid) {
                        Context.showInviteUser();
                    } else if ("menu-invitelink" == menuid) {
                        Context.showInviteLink();
                    }
                }
            })
            .data("kendoMenu");
    });
    //var selectfile = null;
    //var filemenu = $("#filelistmenu").kendoContextMenu({
    //  target: "#liveFileList",
    //  animation: {
    //    open: { effects: "fadeIn" },
    //    duration: 500
    //  },
    //  open: function (e)
    //  {
    //    var tar = $(e.event.target).parents("div.live-file:first");
    //    selectfile = tar;

    //  },
    //  select: function (e)
    //  {
    //    var menuid = $(e.item).attr("id");
    //    if ("menu-viewfile" == menuid)
    //    {
    //      alert(selectfile.attr("atmid"));
    //    }
    //    else if ("menu-delfile" == menuid)
    //    {

    //    }
    //  }
    //}).data("kendoMenu");
}
function MakePresenter(pid, psessionid) {
    //Context.StopShareScreen();
    websocket.makepresenter(MeetingID, psessionid, AfterMakePresenter);
}
function UptoStudent(pid, psessionid) {
    websocket.uptostudent(MeetingID, pid, function() {});
}
function MakeStudent(d) {
    if (d.retCode != "1") {
        return;
    }
    var userid = auth.getUserIDEx();
    for (let i = 0, j = Context.userList.length; i < j; i++) {
        if (Context.userList[i].userid + "" == d.userId + "") {
            Context.userList[i].role = "1";
            Context.userList[i].order = 2;
            Context.userList[i].nameclass = GetRoleClass(1);
        }
    }
    if (d.meetingId == MeetingID + "" && d.userId == userid) {
        Context.showMedioCtl = true;
        Context.getMediaView().Up2Student(userid);
    }
}
function AfterMakePresenter(d,showNotice=true) {
    //loger.log("AfterMakePresenter"+d);
    PresenterUserID = d.presenterId;
    var sessionid = auth.getUserToken();
    var userid = auth.getUserIDEx();
    if (d.presenterId == userid) {
        //&& d.presenterSessionId == sessionid
        Context.ShareDocument(true);
        Context.showUploadFile = true;
        Record();
        //Record_view();
        Context.$refs.liveLessonHead.isLessonStart = true;
        Context.ChangeStyle4Presenter(true);        
    } else {
        Context.showUploadFile = false;
        Context.$refs.liveLessonHead.isLessonStart = false;
        Context.ChangeStyle4Presenter(false);
        Context.getMediaView().StopShareScreen();
        StopRecord();
    }
    if(showNotice)
    {
        var pname = "";
        for (let i = 0, j = Context.userList.length; i < j; i++) {
            if (Context.userList[i].userid + "" == d.presenterId + "") {
                Context.userList[i].faceclass = "teach";
                Context.userList[i].ispresenter = true;
                pname = Context.userList[i].name;
            } else {
                Context.userList[i].faceclass = "";
                Context.userList[i].ispresenter = false;
            }
        }
        pname += " is the presenter now.";
        if (d.presenterId == userid) {
            pname = "You are the presenter now.";
        }
        Context.$Notice.success({
            title: pname,
            desc: "",
            duration: 2,
            bottom: 60,
            left: true
        });
    }

    /*
    $("#liveUserList").find("div.meeting-user").each(function (i)
    {
      if ($(this).attr("id") == "user-" + d.presenterId)
      {
        $(this).find("li.meeting-user-face").addClass("teach");
        $(this).attr("ispresenter","true");
      }
      else
      {
        $(this).find("li.meeting-user-face").removeClass("teach");
        $(this).attr("ispresenter", "false");
      }

    }); */
}
function StartMeeting(context, info) {
    var meetingid = info.RetData.LessonID;
    var role = info.RetData.RoleInLesson;
    var studentid = info.RetData.StudentID;
    var teachid = info.RetData.TeacherID;
    var attachmentid = 0;
    var showitem = context.getShowAttachment(info.RetData.AttachmentList);
    if (showitem != null) {
        attachmentid = showitem.ItemID;
    }
    if (role == 3) {
        role = 1;
    }
    if (attachmentid != 0) {
        AttachmentID = attachmentid;
    }
    StartMeetingEx(context, meetingid, role, teachid, studentid,info.RetData.StatusID==2);
}
function StartMeetingEx(context, meetingid, role, teachid, studentid,isfinish=false) {
    //loger.log("StartMeetingEx:" + meetingid + ",role:" + role);
    //var meetingid = localStorage.getItem('Live-IncidentID');
    var sessionid = auth.getUserToken();
    var userid = auth.getUserIDEx();
    var name = auth.getUserName();
    var isJoinMeeting = false;
    context.roomIsFull=false;
    if(role==1 && !isfinish)
    {
        
        var existnumber=webapi.getMeetingRoomJoinRole(meetingid);
        //console.log("getMeetingRoomUserCount:"+meetingid+","+existnumber.data);
        if(existnumber.data==3)
        {
            role=3;
            Role=3;
            context.role=3;
            context.roomIsFull=true;
            // context.$Notice.warning({
            //     title:"The maximum number of panelists has been reached.  You will be joining as a listen-only attendee.",
            //     desc: "",
            //     duration: 4,
            //     bottom: 20,
            //     left: true
            // });
        }
    }

    var afteropen = function() {
        //websocket.login(name, function (d)
        //{
        //loger.log("login->userId:" + d.userId);
        websocket.setleavemeetingcallback(ld => {
            //UpdateUserList(ld.usersList);
            //DelUserFromList(ld.userId);
            LevalMeeting(ld);
            Context.getMediaView().hideUserVideo(ld.userId);
        });
        websocket.setinvitecallback(d => {
            Add2UserList(d.userIds);
        });
        websocket.setup2studentcallback(d => {
            MakeStudent(d);
        });
        websocket.setuploadfilecallback(d => {
            setTimeout(() => {
                if (d.isVideo + "" == "1") {
                    Context.showVideos(true);
                } else {
                    webapi.getmeetinginfo(Context.getMeetingID(), info => {
                        PageNumber=1;
                        Context.showfiles(info.RetData);                        
                        var uploadFileName = Context.getAttachmentName(
                            d.itemId
                        );
                        
                        if(d.isFromP1 && d.isFromP1=="1" && d.createBy + "" == auth.getUserID() + "")
                        {
                            util.MoveTitle(uploadFileName + " add to KloudSync success!","/static/images/kloudsync-red.png");
                            Notification.requestPermission((status)=>
                            {
                                if ("granted" == status)
                                {
                                    var tag = "pt-" + Math.random();
                                    var notify = new Notification(
                                        "KloudSync",
                                        {
                                        dir: 'auto',
                                        //lang: 'zh-CN',
                                        tag: tag,
                                        icon: '/static/images/kloudsync.png',
                                        body: uploadFileName + " add to KloudSync success!"
                                        }
                                    );
                                    notify.onclick = ()=>
                                    {
                                        window.focus();
                                        notify.close();
                                    }
                                   
                                }
                            });
                        }
                        // if (uploadFileName != "") {
                        //     Context.$Notice.success({
                        //         title: uploadFileName + " uploaded",
                        //         desc: "",
                        //         duration: 4,
                        //         bottom: 60,
                        //         left: true
                        //     });
                        // }
                        if (
                            Context.showUploadFile &&
                            d.createBy + "" == auth.getUserID() + ""
                        ) {
                            Context.showAttachment(d.itemId);
                        }
                        Context.autoRecord("End",()=>{
                            Context.autoRecord("Enable");
                        });
                    });
                }
            }, 100);
        });

        //});
    };
    websocket.setopencallback(afteropen);
    var joinmeetingfun = () => {
        //console.log(meetingid+(isfinish?"-"+userid:""));
        websocket.joinmeeting(
            meetingid+(isfinish?","+userid:""),
            "",
            role,
            Context.getIsInstantMeeting(),
            jd => {
                loger.warn(
                    "频道号:" + MeetingID,
                    ",本人用户ID:" +
                        auth.getUserID() +
                        ",用户名:" +
                        auth.getUserName()
                );
                //loger.log("joinmeeting->usersList:" + jd.usersList);
                //var userlist = ParseUserList(d.usersList);
                //var userrole = GetUserRole(d.userId, userlist);
                //ShowUserList(userlist);
                if (JoinMeetingTimer) {
                    clearTimeout(JoinMeetingTimer);
                }
                if (jd.retCode + "" == "-1") {
                    setTimeout(() => {
                        joinmeetingfun();
                    }, 1000);
                    return;
                }
                if (jd.retData) {
                    jd = jd.retData;
                }
               
                //Context.joinMeetingLessonStatus = jd.status;
                websocket.setmeetingid(meetingid+(isfinish?","+userid:""));
                IsJoinSocketMeeting = true;

                if (studentid + "" == userid) {
                    if (isJoinMeeting) {
                        UpdateUserList(jd.usersList);
                    } else {
                        Add2UserList(teachid + "", () => {
                            UpdateUserList(jd.usersList);
                        });
                    }
                } else if (teachid + "" == userid) {
                    UpdateUserList(jd.usersList);
                    //Add2UserList(studentid + "");
                    //if (Context.getIsInstantMeeting())
                    //{
                    //  Context.NoticeKlassromm(MeetingID, Context.getMeetingID());
                    //}
                } else {
                    UpdateUserList(jd.usersList);
                }
                Context.audienceCount=jd.audienceCount;

                if(isfinish)
                {
                    Context.isLessonStart=true;
                    //Context.showUploadFile=true;
                    AfterMakePresenter({presenterId:userid},false);
                    Context.SetButton4Finished(true);
                }
                if (typeof jd.CurrentDocumentPage != "undefined") {
                    Context.JumpToFile(jd.CurrentDocumentPage, () => {
                        if (
                            jd.zoomInfo &&
                            jd.zoomInfo != "" &&
                            jd.zoomInfo != "null"
                        ) {
                            //PlayActionByTxt(jd.zoomInfo.replace(/'/ig, "\""));
                            PlayActionByTxt(JSON.stringify(jd.zoomInfo));
                        }
                    });
                } else {
                    if (
                        jd.zoomInfo &&
                        jd.zoomInfo != "" &&
                        jd.zoomInfo != "null"
                    ) {
                        //PlayActionByTxt(jd.zoomInfo.replace(/'/ig, "\""));
                        PlayActionByTxt(JSON.stringify(jd.zoomInfo));
                    }
                }
                if (typeof jd.currentMode != "undefined") {
                    websocket._currentModeID = jd.currentMode;
                    Context.ViewModeChange(jd.currentMode);
                    if (jd.videoInfo) {
                        if (jd.currentMode + "" == "4") {
                            Context.onVideoPlayInfoChange(jd.videoInfo);
                        } else {
                            if (jd.videoInfo.stat != 2) {
                                Context.onVideoPlayInfoChange(jd.videoInfo);
                            }
                        }
                    }
                }
                if (typeof jd.sizeMode != "undefined") {
                    Context.onSizeModeChangeFromOther(jd.sizeMode);
                }
                if (typeof jd.currentResolution != "undefined") {
                    Context.SetScreenRes(jd.currentResolution);
                }
                if (typeof jd.hideCamera != "undefined" && jd.hideCamera==1) {
                    Context.showCameraBar(false);
                }
                if (typeof jd.currentLine != "undefined") {
                    websocket._currentLine = jd.currentLine;
                    Context.serverLineID = jd.currentLine;
                }
                if (typeof jd.recordingId != "undefined") {
                    Context.autoRecordInfo.RecordID=jd.recordingId;
                }
                if (jd.prepareMode == 1) {
                    console.log("prepareMode");
                    Context.welcomeMessageWarnning = Context.$t(
                        "Live.YourHostPrepare"
                    ); //"Your host is preparing for lessons, please join the lesson at a later time";
                } else {
                    Context.welcomeMessageWarnning = Context.$t(
                        "Live.PleaseWaitforYourHost"
                    ); //"Please wait for your host to start a session";
                }                
                if (isJoinMeeting) {
                    return;
                }

                isJoinMeeting = true;

                Context.showGlobalBlockMsg("", false);

                if (Context.getIsInstantMeeting() == 1) {
                    var classRoomID = auth.getClassroomID();
                    if (classRoomID == MeetingID) {
                        //teacher
                        if (jd.status == 1) {
                            Context.WelMsgStartExistLesson(jd.currentLine);
                        } else {
                            Context.welcomeMessage = true;
                        }
                    }
                } else {
                    if (jd.prepareMode == 1|| jd.status==0) {
                        if (role == 2) {
                        } else {

                            //Context.showGlobalBlockMsg(Context.welcomeMessageWarnning, true);

                            // Context.$Modal.warning({
                            //     render: h => {
                            //         return h(
                            //             "div",
                            //             Context.welcomeMessageWarnning
                            //         );
                            //     },
                            //     onOk: () => {
                            //         Context.clickClose(false);
                            //     }
                            // });
                            if(isfinish==false)
                            {
                                Context.welcomeMessage = true;
                                Context.welcomeMessageStudentBtn = true;
                            }

                        }
                    }
                }
                Context.SetWelComePageInfo(jd.status,role);                

                if (jd.status == 1 || Context.teacherInLessonID>0) {
                    $("#BtnWelMsgJoinStudent,#BtnWelMsgJoinAuditor").attr(
                        "disabled",
                        false
                    );
                    $("#WelMsgWaitJoin").hide();
                } else {
                    $("#BtnWelMsgJoinStudent,#BtnWelMsgJoinAuditor").attr(
                        "disabled",
                        true
                    );
                    $("#WelMsgWaitJoin").show();
                }
                if (
                    jd.status == 1 &&
                    !Context.getIsInstantMeeting() &&
                    jd.prepareMode != 1
                ) {
                    Context.StartMedia();
                }
                if (typeof jd.playAudioData != "undefined") {
                    Context.playAudioData(jd.playAudioData);
                }
                if (role == 2) {
                    //loger.log("teach");
                    Record();
                } else {
                    StopRecord();
                    //loger.log("student");
                }

                SyncFun = function(data) {
                    //console.log("SyncFun");
                    if (!Context.showUploadFile) {
                        return;
                    }
                    //console.log("websocket.sendsyncactions:"+data);
                    websocket.sendsyncactions(data, AttachmentID, function(d) {
                        //loger.log("sendsyncactions->data:" + d.data);
                    });
                };

                websocket.receivesyncaction(function(d) {
                    var action = utf8to16(base64decode(d.data));
                    //loger.log("receivesyncaction->action:" + action);
                    PlayActionByTxt(action);
                });
            }
        );

        JoinMeetingTimer = setTimeout(() => {
            if (IsJoinSocketMeeting == false) {
                joinmeetingfun();
            }
        }, 5000);
    };
    joinmeetingfun();
    //websocket.setendmeetingcallback(() =>
    //{
    //  context.clickClose();
    //});
    context.$parent.$refs.noticemsg.onEndMeeting((d) => {        
        if((d.meetingId+"").toLowerCase()==(meetingid+"").toLowerCase())
        {
            var warning=context.isInstantMeeting(meetingid+"")?"会议已被主持人关闭!":"课堂已被主持人关闭!";
            context.$Notice.warning({
                title:warning,
                desc: "",
                duration: 4,
                bottom: 20,
                left: true
            });
            context.clickClose();
        }
    });

    websocket.setstartlessoncallback(info => {
        //if (role == 2 || info.meetingId != meetingid + "")
        //{
        //  return;
        //}
        if (Context.welcomeMessage == true) {
            if (info.status == 1) {
                $("#BtnWelMsgJoinStudent,#BtnWelMsgJoinAuditor").attr(
                    "disabled",
                    false
                );
                $("#WelMsgWaitJoin").hide();
            } else {
                $("#BtnWelMsgJoinStudent,#BtnWelMsgJoinAuditor").attr(
                    "disabled",
                    true
                );
                $("#WelMsgWaitJoin").show();
            }
            return;
        }
        if (info.status == 1) {
            context.StartMedia();
        } else if (info.status == 0) {
            context.EndMdeia();
        }
    });

    afteropen();
    InitMenu();
    if (role == 2) {
    } else {
        websocket.setmakepresentercallback(AfterMakePresenter);
    }

    websocket.setofflinecallback(info => {
        if (info.retData) {
            info = info.retData;
        }
        UpdateUserList(info.usersList);
    });
    websocket.setonlinecallback(info => {
        if (info.retData) {
            info = info.retData;
        }
        UpdateUserList(info.usersList);
    });
    websocket.onUserListChange = list => {
        UpdateUserList(list, true);
    };
    websocket.onDocumentIDChange = (docID, pageNum) => {
        //alert("onDocumentIDChange" + docID);
        context.onDocumentIDChange(docID, pageNum);
    };
    websocket.onModeChange = mode => {
        //alert("onModeChange" + mode);
        context.onModeChange(mode);
    };
    websocket.onPageNumberChange = (pageNumber,itemid) => {
        //alert("onPageNumberChange" + pageNumber);
        context.onPageNumberChange(pageNumber,itemid);
    };
    websocket.onPresenterChange = preUserID => {
        //alert("onPresenterChange" + preUserID);
        context.onPresenterChange(preUserID);
    };
    websocket.onCurrentStatusChange = stat => {
        if (Context.welcomeMessage == true) {
            if (stat == 1) {
                $("#BtnWelMsgJoinStudent,#BtnWelMsgJoinAuditor").attr(
                    "disabled",
                    false
                );
                $("#WelMsgWaitJoin").hide();
            } else {
                $("#BtnWelMsgJoinStudent,#BtnWelMsgJoinAuditor").attr(
                    "disabled",
                    true
                );
                $("#WelMsgWaitJoin").show();
            }
        }
    };
    websocket.onMaxVideoUserIDChange = maxUserID => {
        //alert("onMaxVideoUserIDChange" + maxUserID);
        context.onMaxVideoUserIDChange(maxUserID);
    };
    websocket.onCreateKloudCallError = d => {
        //d.retCode
        if (d.retCode == -2002) {
            //UserNotExist
            context.$Message.error({
                content:
                    'You need a KloudCall account to initate this action. Please go to KloudCall <a href="https://kloud.com/" target="_blank">website</a> to get your account!',
                duration: 5
            });
        } else if (d.retCode == -2301) {
            //InsuficientBalance
            context.$Message.error({
                content: "Insuficient Balance!",
                duration: 5
            });
        } else if (d.retCode == -2403) {
            //already in conference
            context.$Message.error({
                content: "You are already in conference!",
                duration: 5
            });
        } else if (d.retCode == -1) {
            context.$Message.error({
                content: d.errorMsg ? d.errorMsg : "Unknow Error!",
                duration: 5
            });
        }
    };
    websocket.onKloudCallEnd = d => {
        //context.AfterSelectAudioTool(0, false);
    };
    websocket.onOtherLogin = () => {
        if (location.href.toLowerCase().indexOf("/live") > -1) {

            context.clickClose(false,true);
            context.$Notice.error({
                title: "",
                desc: context.$t("Live.OtherDeviceLogin"),
                duration: 20,
                bottom: 20,
                left: true
            });
        }
    };
    websocket.onKickMeeting = msg => {
        if (location.href.toLowerCase().indexOf("/live") > -1) {
            context.clickClose();
            if (msg != "") {
                context.$Message.error({
                    content: msg,
                    closable: true,
                    duration: 0
                });
            }
            else
            {
                context.$Message.error({
                    content: context.$t("Live.NetError"),
                    closable: true,
                    duration: 0
                });
            }
        }
    };
    websocket.onSocketOpen = () => {
        //Context.CheckReconnect();
        util.ShowBadNetwork(false);
    };
    websocket.onSocketClose = () => {
        util.ShowBadNetwork(true,Context.showUploadFile);
        //Context.getMediaView().Leave().then(() =>
        //{
        //});
    };
    websocket.onHeartBeat = () => {
        util.ShowBadNetwork(false);
    };
    websocket.onActivityDetected = d => {
        Context.ShowAutoClose(d.countDown);
    };
    websocket.onMasterLessonStart = d => {
        Context.onMasterLessonStart(d);
    };
    context.$parent.$refs.noticemsg.onKickOut(() => {
        //loger.log("onKickOut");
        if (Role == 2) {
            websocket.endmeeting(() => {
                websocket.setopencallback(null);
            });
        } else {
            websocket.leavemeeting(() => {
                websocket.setopencallback(null);
            });
        }
        try {
            context.getMediaView().Leave();
        } catch (ex) {}

        //context.$router.push({ path: '/login' });
        //context.$router.push('/login');
        window.location.href = "/login";
    });
}

function GetSocket(context) {
    return context.$parent.$refs.noticemsg.obj;
    //return context.$parent.$children[0]._data.obj;
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

    //$("#livePageNumber").val(PageNumber);
    //ShowPdfInfo();

    //$("#liveButtonPrevious").prop('disabled', PageNumber <= 1);
    //$("#liveButtonNext").prop('disabled', PageNumber >= PDFCOUNT);
    $("#liveButtonZoomOut").prop("disabled", CurrentScale <= MIN_SCALE);
    $("#liveButtonZoomIn").prop("disabled", CurrentScale >= MAX_SCALE);
}
function switchPresentationModeIcon(isfull) {
    if (isfull) {
        $("#liveButtonPresentationMode")
            .removeClass("presentation-mode")
            .addClass("presentation-min-mode");
        //$("#liveHead").hide();
        if (!$("#main").is(":visible")) {
            $("#video-container").css({ top: "32px" });
        }
        Context.getMediaView().ViewSizeChange();
    } else {
        $("#liveButtonPresentationMode")
            .removeClass("presentation-min-mode")
            .addClass("presentation-mode");
        //$("#liveHead").show();
        if (!$("#main").is(":visible")) {
            $("#video-container").css({ top: "82px" });
        }
        Context.getMediaView().ViewSizeChange();
    }
}
function LiveDocPreviousPage() {
    if (Context.showUploadFile) {
        IsChangePageByClick=true;
        whiteboard.PreviewPage((issuccess,pagenumber)=>{
            Context.checkTeampFilePathAndLoad();
            if(!issuccess && pagenumber==-1)
            {
                //change document
                //console.log("PreviewPage error");
                Context.autoChangeFile(-1);
            }
            else
            {
                // PageNumber=pagenumber;
                // ShowPdfInfo();
                // CurrentScale=1;
                updateToolbar();
            }
        });
    }
}
function LiveDocNextPage() {
    if (Context.showUploadFile) {
        IsChangePageByClick=true;
        whiteboard.NextPage((issuccess,pagenumber)=>{
            Context.checkTeampFilePathAndLoad();
            if(!issuccess && pagenumber==-1)
            {
                //change document
                //console.log("NextPage error");
                Context.autoChangeFile(1);
            }
            else
            {
                // PageNumber=pagenumber;
                // ShowPdfInfo();
                // CurrentScale=1;
                updateToolbar();
            }
        });
    }
}
function LiveDocZoomOut() {
    ZoomOut();
    updateToolbar();
}
function LiveDocZoomIn() {
    ZoomIn();
    updateToolbar();
}
function initializeToolbar(vuethis) {
    var vueThis = vuethis;

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

    $("#liveSelectScale").change(function(e) {
        _cancelBubble(e);
        var scale = e.target.value;
        if (scale === "custom") {
            return;
        }

        ZoomTo(scale);
    });

    $("#liveActionMin,#liveActionMin2").click(function(e) {
        _cancelBubble(e);
        var cid = "live-lesson";
        if (!$("#main").is(":visible")) {
            cid = "mediaview";
        }
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
                (document.fullScreenElement &&
                    document.fullScreenElement !== null) ||
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
}
function taggleMinControlWindow(show) {
    //loger.log("taggleMinControlWindow",show);
    if (!show) {
        $("#livePanelMeeting").hide();
        //$("#liveActionMin,#liveActionEnd").show();
        $("#liveActionMinPanelMeeting span").removeClass("icon-rightarrow").addClass("icon-leftarrow");
        $("#liveButtonNext").removeClass("sidebar-open");
        $("#livePanelTopCtlWrap").removeClass("attendee-view-open");
    } else {
        $("#livePanelMeeting").show();
        if (!closeTabStatus) {
            //$("#liveActionMin,#liveActionEnd").hide();
        }
        $("#liveActionMinPanelMeeting span").removeClass("icon-leftarrow").addClass("icon-rightarrow");

        $("#liveButtonNext").addClass("sidebar-open");
        $("#livePanelTopCtlWrap").addClass("attendee-view-open");
    }    
    Context.syncPlayerWidth=getViewWidth()+"px";
    setTimeout(function(){
        whiteboard.RefreshDocument(()=>{
            whiteboard.TriggerViewChange();
        });
    },300);
}
function _activeButton(button) {
    $(".live-pdf-action-active").removeClass("live-pdf-action-active");
    $(button).addClass("live-pdf-action-active");
}
function initializeControlWindow(vuethis) {
    var vueThis = vuethis;

    var startPosition, rightMax;
    util.LoadKendoFiles().then(()=>{
        $("#liveControlWindow").kendoDraggable({
            filter: ".meeting-header,.live-action-head",
            dragstart: function(e) {
                var position = kendo.getOffset($("#liveControlWindow"), "position");
                rightMax =
                    $("#liveControlWindow")
                        .parent()
                        .width() - $("#liveControlWindow").width();

                startPosition = {
                    left: e.x.client - position.left,
                    top: e.y.client - position.top
                };
            },
            drag: function(e) {
                var newTop = e.y.client - startPosition.top,
                    newLeft = e.x.client - startPosition.left,
                    newRight = Math.min(Math.max(rightMax - newLeft, 0), rightMax),
                    coordinates = {
                        right: Math.max(0, newRight),
                        top: Math.max(0, newTop)
                    };

                $("#liveControlWindow").css(coordinates);
            }
        });
    });

    $("#liveMinPanelMeeting").click(function(e) {
        taggleMinControlWindow();
    });
    $("#liveActionMinPanelMeeting").click(function(e) {
        var ispanelShow = $("#livePanelMeeting").is(":visible");
        if (
            Context.showUploadFile &&
            !$("#livePanelMeeting").is(":visible") &&
            (Context.preShareMode == 30 || Context.preShareMode == 31)
        ) {
            Context.ShareDocument();
        }        
        if (Context.showUploadFile) {
            Context.NoticeHidecamera(ispanelShow);
        }
        taggleMinControlWindow(!ispanelShow);
        LiveBodyResize();
        CheckZoom();       
        
    });

    $("#liveActionCursor").click(function(e) {
        _activeButton("#liveActionCursor");
        whiteboard.SetDrawTool("");
        return false;
    });
    $("#liveActionPencil").click(function(e) {
        if ($("#liveActionPencil").hasClass("live-pdf-action-active")) {
            whiteboard.ShowSetting(true);
            return;
        }
        _activeButton("#liveActionPencil");
        whiteboard.SetDrawTool("ToolPen");
        return false;
    });
    $("#liveActionHighlighter").click(function(e) {
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
        if(whiteboard.ShowSelectToolSetting("ToolText"))
        {
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
        if(whiteboard.ShowSelectToolSetting("ToolNote"))
        {
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
        DrawInlineBoard();
        return false;
    });
    $("#liveActionBoard").click(function(e) {
        _activeButton("#liveActionBoard");
        whiteboard.SetDrawTool("ToolBoard");
        return false;
    });
    $("#liveActionVideo").click(function(e) {
        _activeButton("#liveActionVideo");
        whiteboard.SetDrawTool("ToolVideo");
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
        whiteboard.SetDrawTool("ToolClear");
        return false;
    });
     $("#liveActionUndo").click(function(e) {
        whiteboard.Undo();
        return false;
    });
     $("#liveActionRedo").click(function(e) {
        whiteboard.Redo();
        return false;
    });   
    $("#liveButtonSizeMode").click(function(e) {
        if($("#liveButtonSizeMode").hasClass("liveButtonSizeModeWidth"))
        {
            $("#liveButtonSizeMode").removeClass("liveButtonSizeModeWidth").addClass("liveButtonSizeModeHeight");
            whiteboard.SetSizeMode(1); 
            Context.NoticeSizeMode(1);      
        }
        else
        {
            $("#liveButtonSizeMode").removeClass("liveButtonSizeModeHeight").addClass("liveButtonSizeModeWidth");
            whiteboard.SetSizeMode(0);
            Context.NoticeSizeMode(0);
        }
        whiteboard.RefreshDocument(()=>{
            //whiteboard.TriggerViewChange();
            CurrentScale=1;
            updateToolbar();
        });
    });
}
function LiveBodyResize() {
    //console.log("LiveBodyResize"+getViewWidth());
    
    $("#main").css({ width: getViewWidth()+10, height: getViewHeight()-4 });
    $("#liveplayvideo").css({ width: getViewWidth(), height: getViewHeight() });
}
export default {
    data: function() {
        return {
            meetingInfo: null,
            attachmentUrl: "",
            attachmentID: "",
            eventId: -1,
            isCreating: false,
            uploadHeaders: {},
            editingEvent: { title: "" },
            editingEventFiles: [],
            uploadAction: GetAPIUrl(),
            uploadVideoAction: GetAPIUrl(),
            fileUploading: false,
            uploadPercentage: 0,
            uploadTimer: null,
            showUploadFile: false,
            showMedioCtl: true,
            isLessonStart: false,
            joinMeetingLessonStatus: "0",           
            userList: [],
            inviteuser: false,
            invitelink: false,
            invitelinkId: "",
            invitelinkUrl: "",
            friendList: [],
            selectedFriends: [],
            filterFriendKey: "",
            role: 3,
            roomIsFull:false,
            welcomeMessage: false,
            welcomeMessageTeacherBtn: false,
            welcomeMessageStudentBtn: false,
            welcomeMessageTeacherName: "My",
            welcomeMessagePrepareName: "",
            welcomeMessageKlassRoomID: "",
            welcomeMessageList: [],
            welcomeMessageCourse: false,
            welcomeMessagePrepareTemp: false,
            welcomeMessagePrepareLesson: false,
            welcomeMessagePrepareFile: false,
            welcomeMessagePrepareNewCourseName: "",
            welcomeMessagePrepareNewLectureName: "",
            welcomeMessageWarnning:
                "Please wait for your host to start a session",
            showWelMsgPrepareMenu: true,
            showAutoCloseDlg: false,
            autoCloseSecond: 120,
            autoCloseTimer: null,
            isPrepare: false,
            prepareTempValue: "My Course",
            prepareTempCourseList: [],
            prepareLectureID: 0,
            selectCourse: null,
            selectLecture: null,
            selectStudent: null,
            studentList: [],
            courseList: [],
            lectureList: [],
            preShareMode: 10,
            preMaxUserID: "0",
            preSizeMode:0,
            mediaSettingDlg: false,
            mediaSettingCallback: null,
            kloudcallNotifiation: false,
            kloudcallNotifiationTeacher: false,
            kloudCallNumber: "",
            kloudCallNumberTeacher: "",
            serverLineID: 0,
            agoraErrorTime: [],
            toshowmediasetting: "MediaSetting",
            speakingTimer: null,
            lastVol: 0,
            getIsShowUploadVideo: true,
            uploadVideoTimer: null,
            videoUploading: false,
            videoPlayTimer: null,
            uploadVideoPercentage: 0,
            videoFileList: [],
            videoList: [],
            lastAudioDisabled: -1,
            selectVideo: false,
            selectVideoCallBack:null,
            selectVideoKey: "",
            selectVideoPageIndex: 0,
            selectVideoItemTotal: 100,
            selectedVideo: "",
            downloadPercent: 0,
            showDownload: false,
            disableFileToolTip: false,
            disableAttenToolTip: false,
            disableSettingToolTip: false,
            disableThinkToolTip: false,
            showTakePhoto: false,
            showFileList: false,
            updateProcessTimer: null,
            isUploadingFile:false,
            downloadProcessTimer: null,
            downloadProcessPercent:0,
            checkExist: { show: false, isTeacher: false ,needSave:true},
            showAutoPlayDlg: false,
            autoplaySeconds: 3,
            selectMediaTitle: this.$t("Live.SelectVideo"),
            selectAudioUrl: "",
            selectAudioName: "",
            selectMediaTab: "video",
            lastSycnAudioItemID: 0,
            syncAudioStat: 0,
            syncTimeAxis: {Timer:null,StartTime:null,PauseTime:null,DiffTime:0,Time:0},
            syncAndPlayText: "",
            syncRecorder: null,
            uploadingSync: false,
            uploadingSyncPercent: 0,
            playAudioTimer: null,
            playAudioCurrentTime: "0:00",
            playSyncInfo: {
                Play: false,
                NeedPaly: -1,
                StartTime: 0,
                EndTime: 0,
                ToPlayList: [],
                Url: "",
                Stat: 0,
                ID:0,
                Total:0,
                LastSendTime:null
            }, 
            thinkShareMode:false,           
            thinkMode:false,
            thinkShow:  true,
            thinkShowSyncBtn: false,
            thinkCurrentID:0,
            thinkInfo:{ID:0,Title:"",EnableBackGround:false,EnableSelectVoice:false,EnableRecord:false,BackGroundItemID:0,BackGroundTitle:"",BackGroundTime:"",SelectVoiceItemID:0,SelectVoiceTitle:"",SelectVoiceTime:"",RecordVoiceItemID:0,
            SyncStatus:0,SyncDate:"",CreateEditStat:0,RecordTitle:"",RecordTime:"",EnableVoice:false,IsPublic:false},
            thinkList: [],
            thinkListCount: 0,
            selectMoreThink:{Show:false,List:[],Selected:[]},
            selectVideo_showvideo:true,
            selectVideo_showaudio:true,
            teacherInLessonID:0,
            autoRecordInfo:{IsRecord:false,Recorder:null,SoundIds:[],AttachmentID:0,RecordID:"",LastRecordStat:false,PathInfo:null},
            recordLessonList:[],
            headTitle:"",
            headLessonTitle:"",
            headTitleShow:false,
            headTitleColor:"#1D6DE2",
            isLessonFinished:false,
            welcomePageInfo:{Title:"MEETING",Stat:"IN PROGRESS",YouCan:"As Host, you can"},
            exitMySelf:false,            
            isPause:false,
            isPlay:false,
            isPlayLesson:false,
            showPageLine:true,
            syncPlayerWidth:"80%",
            isKloudSync:false,
            uploadRecord:{showUploadRecordProcess:false,uploadPercent:0,uploadFileName:""},
            showRoomFullTip:false,
            audienceCount:0,
            audienceList:[],
            teampFilePath:"",
        };
    },
    _lastSwitchTime: null,
    components: {
        MediaView,
        //TwilioView,
        //TencentView,
        RongCloudView,
        VideoPlayer,
        SyncPlayer,
        UploadFile,
        TakePhoto,
        LiveLessonHeader,
        LessonInfo,
        ControlSetting,
        MediaSetting,
        MediaSettingTeacher,
        SelectCourseTemp,
        SelectPrepareFile,
        ShareDocModal,
        SelectFileFromFav,
        SelectFileFromSpace,
        SelectLectures,
    },
    mounted: function() {
        this.isKloudSync=IsKloudSync();
        Context = this;
        let currentRouteName = this.$router.currentRoute.name;
        this.changeClassRoomRoute(currentRouteName);
        InitWhiteBoard();
        this.Init();
    },
    beforeDestroy: function() {
        //this.clickClose();
        this.showGlobalBlockMsg("", false);
        if (this.speakingTimer) {
            clearTimeout(this.speakingTimer);
            this.speakingTimer = null;
        }
        $(document)
            .children()
            .unbind("keydown");
        // $(document).unbind("mousemove", Record_mouse);
        // $(document).unbind("mouseout", Record_mouseout);
        // $(document).unbind("click", Record_click);
        window.onbeforeunload = null;
        util.ShowBadNetwork(false);
        util.ShowDownload(false);
        whiteboard.Reset();
        this.$Modal.remove();
    },
    created: function() {
        websocket = GetSocket(this);
        if (!auth.checkAuth() && this.$route.query.token && this.$route.query.token != "") {
            auth.loginWithToken(this.$route.query.token);
        }
        if (!auth.checkAuth()) {
            this.showGlobalBlockMsg("", false);
            var url = "/live/" + this.getIDFromUrl();
            this.$router.push({ path: "/login", query: { ReturnUrl: url } });
            return;
        }
         if(this.getIsShareMode())
        {
            this.toshowmediasetting = "MediaSetting";
        }
        else if (this.getIsInstantMeeting() == 1) {
            var classRoomID = auth.getClassroomID();
            if (classRoomID == this.getIDFromUrl()) {
                //teacher
                this.toshowmediasetting = "MediaSettingTeacher";
            } else {
                this.toshowmediasetting = "MediaSetting";
            }
        } else {
            webapi.getmeetinginfo(this.getIDFromUrl(), info => {
                if (info && info.RetData && info.RetData.RoleInLesson == 2) {
                    this.toshowmediasetting = "MediaSettingTeacher";
                } else {
                    this.toshowmediasetting = "MediaSetting";
                }
            });
        }
    },
    beforeRouteEnter(to, from, next){
        //console.log(from);
        if(from && from.path)
        {
            LastRouterPath=from.path;
        }
        next();
    },
    methods: {
        Init() {
            //$("#live-welcomepage").height(document.body.clientHeight - 50);
            this.reset();
            //setTimeout(() =>
            //{
            //  this.ShowAutoClose();
            //}, 5000);

            //PDFJS.disableRange = true;
            //PDFJS.disableStream = true;
            var bodyScroolTimer = null;
            var bodyResizeTimer = null;
            //$("div.liveFileWrap").height(document.body.clientHeight - 228);
            $(window).bind("resize", function() {
                LiveBodyResize();
                //$("div.liveFileWrap").height(document.body.clientHeight - 228);
                if (bodyResizeTimer) {
                    clearTimeout(bodyResizeTimer);
                }
                bodyResizeTimer = setTimeout(() => {
                    CheckZoom();
                    $("#liveplayvideo").css({width: $("#main").width(),height: $("#main").height()});
                }, 200);
            });
            $(document)
                .children()
                .bind("keydown", function(evt) {
                    loger.log(evt);
                    if(evt.originalEvent.target.nodeName=="TEXTAREA" ||evt.originalEvent.target.nodeName=="INPUT")
                    {
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
                    else if (evt.keyCode == 46)//delete
                    {
                        whiteboard.SetDrawTool("ToolClear");
                    }
                    else if (evt.keyCode == 83)//s
                    {
                        whiteboard.SetDrawTool("");
                        _activeButton("#liveActionCursor");
                    }
                    else if (evt.keyCode == 80)//p
                    {
                        whiteboard.SetDrawTool("ToolPen");
                        _activeButton("#liveActionPencil");
                    }
                    else if (evt.keyCode == 76)//L
                    {
                        whiteboard.SetDrawTool("ToolLine");
                        _activeButton("#liveActionLine");
                    }
                    else if (evt.keyCode == 84)//T
                    {
                        whiteboard.SetDrawTool("ToolText");
                        _activeButton("#liveActionText");
                    }
                    else if (evt.keyCode == 66)//B
                    {
                        whiteboard.SetDrawTool("ToolBrush");
                        _activeButton("#liveActionHighlighter");
                    }
                    else if (evt.keyCode == 78)//N
                    {
                        whiteboard.SetDrawTool("ToolNote");
                        _activeButton("#liveActionNote");
                    }
                    else if (evt.keyCode == 86)//V
                    {
                        whiteboard.SetDrawTool("ToolVideo");
                        _activeButton("#liveActionVideo");
                    }
                    else if (evt.keyCode == 87)//W
                    {
                        whiteboard.SetDrawTool("ToolBoard");
                        _activeButton("#liveActionBoard");
                    }
                    else if (evt.keyCode == 85)//U
                    {
                        whiteboard.Undo();
                    }
                    else if (evt.keyCode == 82)//R
                    {
                        whiteboard.Redo();
                    }
                    else if (evt.keyCode == 70)//F
                    {
                        $("#liveActionMin").click();
                    }
                    else if (evt.keyCode == 90)//Z
                    {
                        whiteboard.SwitchLastTool();
                    }
                    return true;
                });

            // $(document).bind("mousemove", Record_mouse);
            // $(document).bind("mouseout", Record_mouseout);
            // $(document).bind("click", Record_click);

            // $("#main").bind("scroll", () => {
            //     //loger.log("scrool:" + $(document).scrollTop());
            //     if (bodyScroolTimer) {
            //         clearTimeout(bodyScroolTimer);
            //     }
            //     bodyScroolTimer = setTimeout(() => {
            //         //Record_view();
            //     }, 200);
            // });
            //window.onerror = (sMsg, sUrl, sLine) =>
            //{
            //  var errorHtml = "Error: " + sMsg + "<br>";
            //  errorHtml += "Line: " + sLine + "<br>";
            //  errorHtml += "URL: " + sUrl + "<br>";
            //  loger.error(errorHtml);
            //};
            window.onAgoraError = (e, t, i) => {
                //alert("onAgoraError");
                //loger.log("onAgoraError");
                //loger.log(e);
                //loger.log(t);
                //loger.log(i);
                if (
                    i &&
                    i.type &&
                    i.reason &&
                    i.type == "close" &&
                    i.reason == "server connection timeout"
                ) {
                    this.AgoraError();
                }
            };

            LiveBodyResize();
            this.syncPlayerWidth=getViewWidth()+"px";
            window.onbeforeunload = () => {
                return "Are you sure you want to exit?";
            };
            window.CheckQuit=()=>{
                if(this.exitMySelf==true)
                {
                    return true;
                }
                this.clickClose(true,false,true);
                return false;
            };
            window.onunload = () => { 
                this.existLessonAll(true);
                if(websocket) websocket.logout();
             };

            //$(window).bind("beforeunload hashchange", (evt)=>{
            //  alert("close");
            //});
            initializeToolbar(this);
            initializeControlWindow(this);

            var meetingid = this.getIDFromUrl(); //this.$route.params.meetingId;
            var userid = this.GetUserID();
            var name = auth.getUserName();
            MeetingID = meetingid;

            this.eventId = this.getMeetingID();
            
            this.StartLesson();

            if (!this.showUploadFile) {
                $("#liveToolbarWrap,#livePanelTopCtlWrap").addClass(
                    "attendee-view"
                );
            }

            //if (this.getIsInstantMeeting() == 1)
            //{
            //  webapi.getClassRoomLessonID(MeetingID).then(lessonID =>
            //  {
            //    if (lessonID > 0)
            //    {
            //      this.changeLessonID(lessonID);
            //    }
            //    this.StartLesson();
            //  });
            //}
            //else
            //{
            //  this.StartLesson();
            //}

            //this._self.$children[0].test();
            //this.$parent.$refs.noticemsg.onSwitchFile(fileinfo =>
            //{
            //  let aid = fileinfo.attachmentID.substr(fileinfo.attachmentID.lastIndexOf('-') + 1);
            //  $("#liveFileList").find(">div.selected").removeClass("selected");
            //  $("#eventfile-" + aid).addClass("selected");
            //  this.reset();
            //  ShowPDF(fileinfo.attachmentUrl, PageNumber);
            //});
        },
        StartLesson() {
            //log("StartLesson"+this.getMeetingID());

            
            
            Context.showGlobalBlockMsg(this.$t("Live.ConnectingToServer"));

            var classRoomID = auth.getClassroomID();

            if(this.getIsShareMode())
            {
                this.thinkShareMode=true;
                let newlessonid=webapi.GetSharedTempLessonID(this.$route.query.share);
                if(newlessonid==null || newlessonid<1)
                {
                    alert("You have no privilege to view this share url!");
                    this.changeClassRoomRoute("");
                    this.$router.push({ path: "/schedule" });
                    return;
                }
                this.changeLessonID(newlessonid);
            }


            if (this.getIsInstantMeeting() == 1) {
                //
                //this.changeEnableAudio(true);
                //this.changeEnableVideo(false);

                if (classRoomID == MeetingID) {
                    //teacher
                    this.welcomeMessageTeacherBtn = true;
                } else {
                    this.welcomeMessage = true;
                    this.welcomeMessageStudentBtn = true;
                    webapi.getClassRoomLessonID(MeetingID).then(lessonid => {
                        if (lessonid > 0) {
                            this.changeLessonID(lessonid);
                            //$("#BtnWelMsgJoinStudent,#BtnWelMsgJoinAuditor").attr("disabled", false);
                            //$("#WelMsgWaitJoin").hide();
                        }
                    });
                }
                this.ShowUpComingLesson();
                this.InitTeachName();
            }

            if (
                this.getIsInstantMeeting() == 1 &&
                this.getMeetingID() == MeetingID
            ) {
                //not start
                this.reset();
                this.showUploadFile = false;
                if (classRoomID == MeetingID) {
                    //teacher
                    Role = 2;
                    this.showMedioCtl = true;
                    this.showUploadFile = true;
                } else {
                    Role = 1; //3
                    this.showMedioCtl = false;
                    this.showUploadFile = false;
                }
                $("#liveShareDocument").addClass(this.getDefaultSelectStyle);
                this.ChangeStyle4Presenter(this.showUploadFile);
                this.role = Role;

                this.attachmentUrl = "";
                this.getMediaView().setShowCtl(Role == 2);
                webapi.getClassRoomTeacherID(MeetingID).then(teacherid => {
                    StartMeetingEx(this, MeetingID, Role, teacherid, 0);
                });

                return;
            }

            //console.log("this.getMeetingID():"+this.getMeetingID())
            webapi.getmeetinginfo(this.getMeetingID(), info => {
                //this.changeEnableAudio(true);
                //this.changeEnableVideo(true);
                this.reset();
                this.isPrepare = false;
                this.meetingInfo = info;
                this.InitTeachName();
                //this.getCharView().Init("Classroom-" + this.getMeetingID(),this.GetUserID());

                Role = info.RetData.RoleInLesson;
                if (Role == 3) {
                    Role = 1;
                }
                this.role = Role;
                if (Role != 1 && Role != 2) {
                    this.showMedioCtl = false;
                } else {
                    this.showMedioCtl = true;
                }
                this.getMediaView().setShowCtl(Role == 2);
                if(info.RetData.StatusID==2)
                {
                    this.isLessonFinished=true;
                    this.showUploadFile = true;
                    this.showMedioCtl = true;
                    Role=2;
                    this.role = 2;
                }
                var showitem = this.getShowAttachment(
                    info.RetData.AttachmentList
                );
                if (showitem == null) {
                    //alert("No file to show!");
                    // this.$Message.error({
                    //     content: this.$t("Live.NoFile2Show"),
                    //     duration: 3
                    // });
                    if(!this.isLessonFinished)
                    {
                        this.SetStyle4WelcomePage(true);
                    }
                } else {
                    AttachmentID = showitem.ItemID;
                    if (false) {
                        // (showitem.AttachmentH5Url != "")
                        //ShowPPT("https://192.168.22.137:4433/ppt/data/", PageNumber);
                        ShowPPT(showitem.AttachmentH5Url, PageNumber);
                        this.attachmentUrl = showitem.AttachmentH5Url;
                    } else {
                        websocket._currentDocID = showitem.ItemID;
                        websocket._currentPageID = PageNumber;
                        this.ShowPDFEx(
                            showitem.AttachmentUrl,
                            PageNumber,
                            isscucess => {
                                if (isscucess == false) {
                                    //this.$Message.error(
                                    //  {
                                    //    content: 'Load file failed!',
                                    //    duration: 3
                                    //  });
                                    GetPageContainer(PageNumber).hide();
                                }
                                ShowPdfInfo();
                            },
                            showitem.AttachmentID
                        );
                        websocket.updatemeetingatmid(showitem.AttachmentID);
                        //ShowPDF("https://192.168.22.137:8081/static/Test_<2>.pdf", PageNumber);
                        this.attachmentUrl = showitem.AttachmentUrl;
                    }
                    //$("#livePageNumber").val(PageNumber);
                    ShowPdfInfo();
                }
                
                StartMeeting(this, info);
                //this.StartMedia();
                this.showfiles(info.RetData);
                this.showVideos();
                this.showUploadFile = Role == 2;
                $("#liveShareDocument").addClass(this.getDefaultSelectStyle);
                this.ChangeStyle4Presenter(this.showUploadFile);
                this.headLessonTitle=info.RetData.Title;
                if (info.RetData.IsTemp == 1) 
                {
                    this.thinkMode=true;
                    this.SetButton4ViewLesson(true);
                    this.headTitle="Saved file: ";
                } 
                else if(this.getIsInstantMeeting() != 1)
                {
                    this.headTitleShow=true;
                    setTimeout(()=>{this.dblClickTip();},8000);
                    this.SetButton4PreViewLesson(true);                    
                    if(info.RetData.StatusID==2)//NotStarted = 0,        InProgress = 1,        Complete = 2
                    {
                        this.headTitle="Finished Meeting: ";
                        this.headTitleColor="#1D6DE2";
                        //this.ChangeDrawTool4WhiteBoardDiplayChange(true);
                        $("#liveControlWindow").hide();
                        LiveBodyResize();
                    }
                    else{
                        this.headTitle="Schedule Meeting: ";
                        this.headTitleColor="#34AA44";
                    }
                    
                }

                if (showitem != null) {
                    this.setSelectFile(showitem.ItemID);
                }

                var needstart = sessionStorage.getItem("ViewDocAutoStartMeeting");
                if(needstart && needstart=="1")
                {
                    this.StartLesson4Head();
                    sessionStorage.removeItem("ViewDocAutoStartMeeting");
                }
            });
        },
        async ShowAudienceList(){
            var height=$("#liveAttendeesContainer").height();
            $("#liveAttendeesContainer").hide();
            $("#liveAudienceContainer").show().height(height);
            this.audienceList=[];
            var list = await webapi.getMeetingAudienceList(MeetingID);
            if(!list) return;
            this.audienceCount=list.length;
            for(var user of list)
            {
                var audience={
                    userid:user.userId,
                    name:user.userName,
                    faceurl:user.avatarUrl== ""? "/static/images/defaultface.png": user.avatarUrl,
                    isoffline:user.isOnline==0,
                    nameclass:"auditor"
                };
                this.audienceList.push(audience);
            }

        },
        HideAudienceList(){
            $("#liveAudienceContainer").hide();
            $("#liveAttendeesContainer").show();
        },
        onAttendeesPopHide(){            
            $("#liveAudienceContainer").hide();
            $("#liveAttendeesContainer").show();
        },
        InitTeachName() {
            if (this.getIsInstantMeeting() == 1) {
                webapi.getClassRoomTeacherID(MeetingID).then(teacherid => {
                    if (teacherid == this.GetUserID()) {
                        this.welcomeMessageTeacherName = this.$t("Live.My");
                    } else {
                        webapi
                            .getUserListBasicInfo([teacherid])
                            .then(userinfo => {
                                //log(userinfo[0].UserName);
                                if (userinfo && userinfo.length > 0) {
                                    this.welcomeMessageTeacherName =
                                        userinfo[0].UserName;
                                } else {
                                    this.welcomeMessageTeacherName = "";
                                }
                            });
                    }
                });
            } else {
                if (
                    this.meetingInfo.RetData == null ||
                    !this.meetingInfo.RetData.TeacherID
                ) {
                    return;
                }
                var teacherid = this.meetingInfo.RetData.TeacherID;
                if (teacherid == this.GetUserID()) {
                    this.welcomeMessageTeacherName = this.$t("Live.My");
                } else {
                    webapi.getUserListBasicInfo([teacherid]).then(userinfo => {
                        //log(userinfo[0].UserName);
                        if (userinfo.length > 0) {
                            this.welcomeMessageTeacherName =
                                userinfo[0].UserName;
                        } else {
                            this.welcomeMessageTeacherName = "";
                        }
                    });
                }
            }
        },
        ToggleLoaclAudio() {
            var tar = $("#live-ctl-toggle-audio"); //evt.currentTarget;
            if ($(tar).hasClass("disable")) {
                $(tar).removeClass("disable");
                try {
                    this.getMediaView().ToggleLoaclAudio(true);
                } catch (ex) {}
            } else {
                $(tar).addClass("disable");
                try {
                    this.getMediaView().ToggleLoaclAudio(false);
                } catch (ex) {}
            }
        },
        ToggleLoaclVideo() {
            var tar = $("#live-ctl-toggle-video"); // evt.currentTarget;
            if ($(tar).hasClass("disable")) {
                $(tar).removeClass("disable");
                try {
                    this.getMediaView().ToggleLoaclVideo(true);
                } catch (ex) {}
            } else {
                $(tar).addClass("disable");
                try {
                    this.getMediaView().ToggleLoaclVideo(false);
                } catch (ex) {}
            }
        },
        ToggleLoaclAudioEx(evt) {
            //this.getEnableAudio ? "icon-icon-mic-enable" : "icon-icon-mic-disable";
            var tar = evt.currentTarget;
            if (!this.getEnableAudio) {
                if(this.getIsInstantMeeting() || this.showUploadFile)
                {
                    $(tar).removeClass("icon-icon-mic-disable");
                    $(tar).addClass("icon-icon-mic-enable");
                    this.changeEnableAudio(true);
                }
                else
                {
                    this.getMediaView().CheckOpenLocalAudio();
                }
                //try
                //{
                //  this.getMediaView().ToggleLoaclAudio(true);
                //}
                //catch (ex) { }
            } else {
                $(tar).removeClass("icon-icon-mic-enable");
                $(tar).addClass("icon-icon-mic-disable");
                this.changeEnableAudio(false);
                //try
                //{
                //  this.getMediaView().ToggleLoaclAudio(false);
                //}
                //catch (ex) { }
            }
        },
        ToggleLoaclVideoEx(evt) {
            //this.getEnableVideo ? "icon-icon-video-enable" : "icon-icon-video-disable";
            var tar = evt.currentTarget;
            if (!this.getEnableVideo) {
                $(tar).removeClass("icon-icon-video-disable");
                $(tar).addClass("icon-icon-video-enable");
                this.changeEnableVideo(true);
                //try
                //{
                //  this.getMediaView().ToggleLoaclVideo(true);
                //}
                //catch (ex) { }
            } else {
                $(tar).removeClass("icon-icon-video-enable");
                $(tar).addClass("icon-icon-video-disable");
                this.changeEnableVideo(false);
                //try
                //{
                //  this.getMediaView().ToggleLoaclVideo(false);
                //}
                //catch (ex) { }
            }
        },
        SwitchLoaclAudio(evt) {
            var tar = evt.currentTarget;
            if ($(tar).hasClass("disable")) {
                $(tar).removeClass("disable");
                this.changeEnableAudio(true);
            } else {
                $(tar).addClass("disable");
                this.changeEnableAudio(false);
            }
        },
        SwitchLoaclVideo(evt) {
            var tar = evt.currentTarget;
            if ($(tar).hasClass("disable")) {
                $(tar).removeClass("disable");
                this.changeEnableVideo(true);
            } else {
                $(tar).addClass("disable");
                this.changeEnableVideo(false);
            }
        },
        SwitchCamera(evt) {
            var camera = localStorage.getItem("DefaultCamera");
            var cameraSecond = localStorage.getItem("DefaultSecondCamera");
            if (
                camera == null ||
                camera == "" ||
                cameraSecond == null ||
                cameraSecond == "" ||
                camera == cameraSecond
            ) {
                this.$Message.error("没有设置主次摄像头!");
                return;
            }

            var tar = evt.currentTarget;
            if ($(tar).hasClass("select")) {
                $(tar).removeClass("select");
                localStorage.setItem("UseSecondCamera", "0");
            } else {
                $(tar).addClass("select");
                localStorage.setItem("UseSecondCamera", "1");
            }
            this.getMediaView()
                .Leave()
                .then(() => {
                    var userid = auth.getUserIDEx();
                    var name = auth.getUserName();
                    this.getMediaView().JoinMedia(
                        MeetingID,
                        userid,
                        name,
                        Role
                    );
                });
        },
        StartMedia(joinid) {
            if (this.isLessonStart == true) {
                return;
            }

            this.isLessonStart = true;
            $("#liveHead").hide();
            //$("#mediaview").show();
            //taggleMinControlWindow(false);
            LiveBodyResize();

            if (this.playSyncInfo.Play == true && this.playSyncInfo.Stat == 1) {
                return;
            }

            if (this.serverLineID == 0) {
                var userid = auth.getUserIDEx();
                var name = auth.getUserName();
                this.getMediaView().JoinMedia(
                    joinid?joinid:MeetingID,
                    userid,
                    name,
                    Role,
                    this.getEnableVideo,
                    this.getEnableAudio,
                    () => {}
                );
            } else if (this.serverLineID == 2) {
                //this.KloudCallStart();
                //if (Role == 2)
                //{

                //}
                //else
                {
                    UpdateUserPhoneInList(this.GetUserID(), true);
                    this.kloudcallNotifiation = true;
                    this.kloudCallNumber = auth.getMobile();
                }
                var userid = auth.getUserIDEx();
                var name = auth.getUserName();

                this.getMediaView().JoinMedia(
                    MeetingID,
                    userid,
                    name,
                    Role,
                    this.getEnableVideo,
                    false,
                    () => {
                        this.Switch2KloudCall();
                    }
                );

                if (Role == 2) {
                    this.$refs.controlsetting.selectLine(this.serverLineID);
                }
            } else if (this.serverLineID == 4) {
                var userid = auth.getUserIDEx();
                var name = auth.getUserName();

                this.getMediaView().JoinMedia(
                    MeetingID,
                    userid,
                    name,
                    Role,
                    this.getEnableVideo,
                    false,
                    () => {
                        this.Switch2KloudCall();
                    }
                );

                if (Role == 2) {
                    this.$refs.controlsetting.selectLine(this.serverLineID);
                }
            }

            if (Role == 2) {
                websocket.setmeetingstat(MeetingID, 1, this.getMeetingID());
                this.SendInviteUser();
                if(!this.getIsInstantMeeting())
                {
                    this.NoticeLessonIDChange(this.GetLessonID());
                }                
                this.autoRecord("Enable");
            }
        },
        AgoraError() {
            if (this.agoraErrorTime.length > 3) {
                if (!this.CheckAgoraError()) {
                    this.agoraErrorTime.push(new Date());
                    return;
                }
                if (
                    this.getMediaView().getAllStreamCount() !=
                    this.GetUserOnlineCount()
                ) {
                    loger.log("Agora reconnect!");
                    this.agoraErrorTime = [];
                    this.getMediaView()
                        .Leave()
                        .then(() => {
                            var userid = auth.getUserIDEx();
                            var name = auth.getUserName();
                            this.getMediaView().JoinMedia(
                                MeetingID,
                                userid,
                                name,
                                Role,
                                this.getEnableVideo,
                                this.getEnableAudio
                            );
                        });
                }
            } else {
                this.agoraErrorTime.push(new Date());
            }
        },
        CheckAgoraError() {
            var count = 0;
            for (var i = this.agoraErrorTime.length - 1; i >= 0; i--) {
                if (new Date() - this.agoraErrorTime[i] < 30000) {
                    count++;
                } else {
                    this.agoraErrorTime.splice(i);
                }
            }
            return count >= 3;
        },
        CheckReconnect() {
            if (this.isLessonStart == false) {
                return;
            }
            if (this.serverLineID != 0) {
                return;
            }
            var userid = auth.getUserIDEx();
            var name = auth.getUserName();
            this.getMediaView().JoinMedia(
                MeetingID,
                userid,
                name,
                Role,
                this.getEnableVideo,
                this.getEnableAudio,
                () => {}
            );
        },
        CheckVideoAfterOnline(uid) {
            //if (this.isLessonStart == false)
            //{
            //  return;
            //}
            //this.getMediaView().checkHaveVideo2Show(uid);
        },
        HideVideoAfterOffline(uid) {
            //this.getMediaView().hideUserVideo(uid);
        },
        IsUserInOnlineList(uid) {
            for (let i = 0, j = this.userList.length; i < j; i++) {
                if (
                    this.userList[i].userid + "" == uid + "" &&
                    this.userList[i].isoffline == false
                ) {
                    return true;
                }
            }
            return false;
        },
        getUserInfo(uid) {
            for (let i = 0, j = this.userList.length; i < j; i++) {
                if (
                    this.userList[i].userid + "" == uid + "" &&
                    this.userList[i].isoffline == false
                ) {
                    return { Name: this.userList[i].name };
                }
            }
            return null;
        },
        GetUserOnlineCount() {
            var result = 0;
            for (let i = 0, j = this.userList.length; i < j; i++) {
                if (this.userList[i].isoffline == false) {
                    result++;
                }
            }
            return result;
        },
        StartLesson4Head() {
            this.mediaSettingDlg = true;
            this.$refs.mediasetting.init();
            this.mediaSettingCallback = () => {
                this.StartMedia();
                this.SetButton4PreViewLesson(false);
                this.SetWelComePageInfo(1,this.role);
            };
        },
        CheckPageObject(pageid,checkSyncTimeByPage=false) {
            if (pageid == 0) return;
            var lessonid = this.GetLessonID();
            var fileid = this.GetFileID();
            var key = lessonid + "##" + fileid + "##" + pageid;
            //loger.log("CheckPageObject:" + key);
            //var old = PDFPageObject.get(key);
            //if (old)
            //{

            //}
            //else//get from api server
            {
                if (this.isPrepare == true && this.prepareLectureID != 0) {
                    webapi.getLecturePageObject(
                            this.prepareLectureID,
                            fileid,
                            pageid
                        ).then(infoarr => {
                            if (infoarr == null) return;
                            for (var txt of infoarr) {
                                this.onPlayBaseAction(txt);
                            }
                        });
                } else {
                    webapi.getPageObject(lessonid, fileid, pageid,this.isPlayLesson && this.isPause==false?0:1)
                        .then(infoarr => {
                            if (infoarr == null) return;
                            //PDFPageObject.set(key, infoarr);
                            for (var txt of infoarr) {
                                //loger.log(txt);
                                this.onPlayBaseAction(txt);
                            }
                        });
                    if(checkSyncTimeByPage)
                    {
                        webapi.getRecordLessonPageActionStartTime(this.thinkCurrentID,this.getAttachmentAttachmentID(fileid),pageid).then(res=>{
                            if(res<0) return;
                            this.$refs.syncplayer.GoToTime(res);
                        });
                    }
                }
            }
        },
        ShowSyncObject(pageid,checkSyncTimeByPage=false) {
            //console.log("ShowSyncObject:"+pageid+","+checkSyncTimeByPage);
            if(!this.showPageLine && checkSyncTimeByPage==true)
            {
                this.showPageLine=true;
                return;
            }
            if(this.isPlayLesson==true)
            {
                this.CheckPageObject(pageid,checkSyncTimeByPage);
            }
            else if(!this.isPause && !this.isPlay)
            {
                this.CheckPageObject(pageid);
            }
            else if(this.isPause)
            {
                webapi.getAttachmentOrSyncPageObject(pageid,0,this.thinkCurrentID,1).then(infoarr => 
                {
                    if (infoarr == null) return;
                    for (var txt of infoarr) 
                    {
                        this.onPlayBaseAction(txt);
                    }
                });
                if(checkSyncTimeByPage)
                {
                    webapi.GetSyncTimeByPage(this.thinkCurrentID,pageid).then(res=>{
                        this.$refs.syncplayer.GoToTime(res);
                    });
                }

            }
            else
            {
                whiteboard.Clear();
                if(this.isPlay && checkSyncTimeByPage)
                {
                    webapi.GetSyncTimeByPage(this.thinkCurrentID,pageid).then(res=>{
                        this.$refs.syncplayer.GoToTime(res);
                        webapi.GetSyncPageActionsByTime(this.thinkCurrentID,res,pageid).then(resbytime => 
                        {
                            if (resbytime == null) return;
                            for (var action of resbytime.Actions)
                            {
                                this.onPlayBaseAction(utf8to16(base64decode(action.Data)));
                            }
                        });
                    });
                }
                else if(this.isPlay)
                {
                    var time=0;
                    if(this.$refs.syncplayer)
                    {
                        time=this.$refs.syncplayer.GetCurrentPlayTime();
                    }
                    webapi.GetSyncPageActionsByTime(this.thinkCurrentID,time,pageid).then(res => 
                    {
                        if (res == null) return;
                        for (var action of res.Actions)
                        {
                            this.onPlayBaseAction(utf8to16(base64decode(action.Data)));
                        }
                    });
                }
                webapi.getAttachmentOrSyncPageObject(pageid,0,this.thinkCurrentID).then(infoarr => 
                {
                    if (infoarr == null) return;
                    for (var txt of infoarr) 
                    {
                        this.onPlayBaseAction(txt);
                    }
                });
                
            }

        },
        GetLessonID() {
            var lessonid=this.getMeetingID();
            if(this.isInstantMeeting(lessonid+""))
            {
                return 0;
            }
            return lessonid;
        },
        GetFileID() {
            return AttachmentID;
        },
        GetItemID() {},
        EndMdeia() {
            if (this.isLessonStart == false) {
                return;
            }
            this.isLessonStart = false;
            //$("#mediaview").hide();
            $("#liveHead").show();
            try {
                this.getMediaView().Leave();
            } catch (exp) {}

            if (Role == 2) {
                websocket.setmeetingstat(MeetingID, 0, this.getMeetingID());
            }
        },
        showGlobalBlockMsg(msg, show = true) {
            util.ShowGlobalBlockMsg(msg,show);
        },
        getMediaView() {
            //if (this.getIsInstantMeeting())
            //{
            return this.$refs.media;
            //return this.$refs.tencent;
            //}
            //else
            //{
            //  return this.$refs.twilio;
            //}
        },
        getCharView() {
            return this.$refs.chatview;
        },
        OnCloseVideoView() {
            $("#liveActionCamera").show();
        },
        OnClickShowVideoView() {
            $("#liveActionCamera").hide();
            this.getMediaView().setVideDisplay(false);
            this.getMediaView().showVideoView();
            this.getMediaView().minFullScreen();
        },
        OnShowVideoView() {
            $("#liveActionCamera").hide();
            this.getMediaView().showVideoView();
        },
        SendInviteUser() {
            if (
                !this.meetingInfo ||
                !this.meetingInfo.RetData.User ||
                !this.showUploadFile
            ) {
                return;
            }
            var userid = auth.getUserIDEx();
            var senddata = new Object();
            senddata.roleType = "1";
            senddata.actionType = this.getIsInstantMeeting() ? "10" : "1";

            senddata.targetID = ""; //this.meetingInfo.RetData.User.ID;
            senddata.meetingID = MeetingID.toUpperCase();
            senddata.incidentID = MeetingID.toUpperCase();
            senddata.sourceID = this.meetingInfo
                ? this.meetingInfo.RetData.TeacherID
                : "";
            if (this.isPDFUrl(this.attachmentUrl)) {
                senddata.isH5 = false;
                senddata.attachmentUrl = this.attachmentUrl;
            } else {
                senddata.isH5 = true;
                senddata.attachmentUrl = this.attachmentUrl;
            }
            senddata.blankPageNumber = this.getSelectFileBlankPageNumber();
            //senddata.attachmentID = this.getSelectFileAttachmentID();
            senddata.itemId = this.getSelectFileAttachmentID();
            websocket.sendmessage(
                this.meetingInfo.RetData.User.ID,
                base64encode(utf16to8(JSON.stringify(senddata)))
            );
        },
        NoticeKlassromm(roomid, lessonid) {
            var userid = auth.getUserIDEx();
            var senddata = new Object();
            senddata.roleType = "1";
            senddata.actionType = "11";
            senddata.targetID = "";
            senddata.meetingID = roomid;
            senddata.incidentID = lessonid;
            senddata.sourceID = userid;
            senddata.isH5 = false;
            senddata.attachmentUrl = "";
            senddata.blankPageNumber = "";
            senddata.itemId = "";
            websocket.sendmessage(
                "",
                base64encode(utf16to8(JSON.stringify(senddata)))
            );
        },
        AddFromFav(type = 1) {
            this.$refs.selectfilefromfav.ShowFiles(type);            
        },
        AddFromCamera(type,evt) {
            if(type==1)
            {
                this.showTakePhoto = true;
            }else if(type==0 && !IsKloudSync()){
                this.$refs.selectLectures.ShowLectures(this.GetLessonID());
            }else
            {
                this.$refs.selectfilefromspace.ShowSpaceFiles();             
            }
            _cancelBubble(evt);
            _cancelDefault(evt);
        },
        onTakePhotoFinish(arg) {
            this.showTakePhoto = false;
            loger.log("onTakePhotoFinish:" + arg);
        },
        CheckedFav(val) {},
        JumpToFile(arg, callback) {
            log("JumpToFile:" + arg);
            if (!arg || arg == "") return;
            var arr = (arg + "").split("-");
            if (arr.length != 2) return;
            var atmid = parseInt(arr[0]);
            var pageid = parseFloat(arr[1]);
            if (isNaN(atmid) || isNaN(pageid)) return;
            if (atmid == 0 && Role == 2 && AttachmentID != "") {
                websocket.updatemeetingdocid(AttachmentID);
            }
            if (atmid == 0 || pageid == 0) return;
            var selAtmID = this.getSelectFileAttachmentID();
            var selFileID = this.getFileIDFromAttachmentID(selAtmID);
            if($("#live-welcomepage").is(":visible"))
            {
                this.SetStyle4WelcomePage(false);
            }
            if (atmid != 0) {
                AttachmentID = atmid;
            }
            if (selFileID == atmid) {
                if (pageid != PageNumber) {
                    if (pageid % 1 == 0) {
                        // ChangePageNum(pageid, function() {
                        //     if (callback) callback();
                        // });
                        whiteboard.ToPage(pageid,function() {
                            if (callback) callback();
                        });
                    } else {
                        ShowBlankPage(pageid);
                        if (callback) callback();
                    }
                }
            } else {
                webapi.getLessonAttachmentDetail(atmid).then(info => {
                    if (info == null) return;

                    this.setSelectFile(info.ItemID);
                    this.reset();

                    if (this.isPDFUrl(info.AttachmentUrl)) {
                        this.attachmentUrl = info.AttachmentUrl;
                        websocket._currentDocID = info.ItemID;
                        websocket._currentPageID = pageid;
                        this.ShowPDFEx(
                            info.AttachmentUrl,
                            pageid,
                            isscucess => {
                                updateToolbar();
                                if (isscucess == false) {
                                    //this.$Message.error(
                                    //  {
                                    //    content: 'Load file failed!',
                                    //    duration: 3
                                    //  });
                                    GetPageContainer(pageid).hide();
                                }
                                ShowPdfInfo();
                                if (callback) callback();
                            },
                            info.AttachmentID
                        );
                    } else {
                        this.attachmentUrl = info.AttachmentH5Url;
                        ShowPPT(info.AttachmentH5Url, pageid, function() {
                            updateToolbar();
                            if (callback) callback();
                        });
                    }
                });
            }
        },
        SetScreenRes(arg) {
            this.changeScreenRes(arg);
        },        
        selectFavOK(selectedFav) {
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
                } else if (this.isVideoExistInList(addName)) {
                    isFileExist = true;
                    break;
                }
            }
            if (isFileExist) {
                if (!window.confirm(this.$t("Live.FileExistInList"))) {
                    return;
                }
            }
            this.addFav2Meeting(this.GetLessonID(), selectedFav).then(
                () => {
                    $("#favList")
                        .find("INPUT[type=checkbox]:checked")
                        .prop("checked", false);
                }
            );
        },
        selectSpaceOK(selectedSpaceAttachment){
            if (selectedSpaceAttachment.length < 1) {
                return;
            }

            webapi.UploadFromSpace(this.GetLessonID(), selectedSpaceAttachment).then(
                () => {
                    $("#spaceAttachmentList").find("INPUT[type=checkbox]:checked").prop("checked", false);
                }
            );
            this.selectSpace = false;
        },
        selectLectureOK(selectedLectures){
            if (selectedLectures.length < 1) {
                return;
            }

            let courseId = "";
            if(this.meetingInfo.RetData && this.meetingInfo.RetData.CourseID){
                courseId = this.meetingInfo.RetData.CourseID
            }else{
                return;
            }

            webapi.UploadFromSelectLectures(this.GetLessonID(),courseId,selectedLectures).then(
                () => {
                    $("#lectureList").find("INPUT[type=checkbox]:checked").prop("checked", false);
                    this.showLessonFile(this.GetLessonID());
                }
            );
        },
        onVideoItemClick(evt) {
            var tar = evt.currentTarget;
            if (tar.checked) {
                if (this.selectedVideo != "") {
                    $("#videoList_" + this.selectedVideo).prop(
                        "checked",
                        false
                    );
                }
                this.selectedVideo = $(tar).val();
            } else {
                this.selectedVideo = "";
            }
        },
        onVideoSearch() {
            //if (this.selectVideoKey == "") return;
            this.selectVideoPageIndex = 0;
            if (this.selectMediaTab == "video")
            {
                webapi.getVideoList(
                    this.selectVideoPageIndex,
                    -1,
                    this.selectVideoKey
                )
                .then(d => {
                    this.videoList = [];
                    this.selectVideoItemTotal = d.Count;
                    for (let item of d.List) {
                        this.videoList.push(this.videoList2ShowList(item));
                    }
                });
            }
            else{
                webapi.getAudioList(
                    this.selectVideoPageIndex,
                    -1,
                    this.selectVideoKey
                )
                .then(d => {
                    this.videoList = [];
                    this.selectVideoItemTotal = d.Count;
                    for (let item of d.List) {
                        this.videoList.push(this.videoList2ShowList(item));
                    }
                });
            }
        },
        onVideoPageChange(pageno) {
            //alert("onVideoPageChange:" + pageno);
            this.selectVideoPageIndex = pageno - 1;
            webapi
                .getVideoList(this.selectVideoPageIndex,-1,this.selectVideoKey)
                .then(d => {
                    this.videoList = [];
                    //this.selectVideoItemTotal = d.Count;
                    for (let item of d.List) {
                        this.videoList.push(this.videoList2ShowList(item));
                    }
                });
        },
        selectVideoShow() {

            this.selectVideo = true;
            this.selectVideoCallBack=null;
            this.selectMediaTab = "video";
            this.selectVideo_showvideo=true;
            this.selectVideo_showaudio=false;

            //console.log(this.selectMediaTab);
            if (this.selectMediaTab == "video") {
                this.selectMediaTitle = this.$t("Live.SelectVideo");
                webapi.getVideoList(0, -1).then(d => {
                    this.videoList = [];
                    this.selectVideoItemTotal = d.Count;
                    for (let item of d.List) {
                        this.videoList.push(this.videoList2ShowList(item));
                    }
                });
            } else {
                this.selectMediaTitle = this.$t("Live.SelectAudio");
                webapi.getAudioList(-1, -1).then(d => {
                    this.videoList = [];
                    this.selectVideoItemTotal = d.Count;
                    for (let item of d.List) {
                        this.videoList.push(this.videoList2ShowList(item));
                    }
                });
            }
        },
        selectAudioShow() {
            this.selectVideo = true;
            this.selectMediaTitle = this.$t("Live.SelectAudio");
            this.selectVideoCallBack=null;
            this.selectMediaTab = "audio";
            this.selectVideo_showvideo=false;
            this.selectVideo_showaudio=true;
            webapi.getAudioList(-1, -1).then(d => {
                this.videoList = [];
                this.selectVideoItemTotal = d.Count;
                for (let item of d.List) {
                    this.videoList.push(this.videoList2ShowList(item));
                }
            });
        },
        selectVideoOK() {
            if (this.selectedVideo == "") {
                this.selectAudioUrl = "";
                this.selectAudioName = "";
                return;
            }
            webapi.getFavoriteAttachmentDetail(this.selectedVideo).then(d => {
                if(this.selectVideoCallBack!=null)
                {
                    this.selectVideoCallBack(d);
                }
                else if (this.showAutoPlayDlg == true) {
                    this.selectAudioUrl = d.AttachmentUrl;
                    this.selectAudioName = d.Title;
                } else {
                    //this.selectAudioUrl = "";
                    $("#videoList_" + this.selectedVideo).prop(
                        "checked",
                        false
                    );
                    this.selectedVideo = "";
                    VideoTagAfterSelect(d);
                }
                this.selectVideo = false;
            });
        },
        selectVideoCancel() {
            this.selectVideo = false;
            VideoTagAfterSelect(null);
        },
        showInviteUser() {
            this.filterFriendKey = "";
            if (this.friendList.length > 0) {
                this.selectedFriends = [];
                this.inviteuser = true;
                return;
            }

            friends.getFriends(f => {
                for (let user of f) {
                    let showuser = {
                        name: user.Name,
                        id: user.UserID,
                        face:
                            user.AvatarUrl == ""
                                ? "/static/images/defaultface.png"
                                : user.AvatarUrl
                    };
                    this.friendList.push(showuser);
                }
                this.inviteuser = true;
            });
        },
        showInviteLink() {
            this.invitelink = true;
            this.invitelinkUrl = location.href
                .toLowerCase()
                .replace("/live/", "/join/");
            this.invitelinkId = (MeetingID + "").replace("-", "");
        },
        invitelinkCopy() {
            //liveInvitelink
            if (navigator.clipboard && navigator.clipboard.writeText) {
                var url=this.invitelinkUrl;
                if(!url || url=="")
                {
                    url=location.href.toLowerCase().replace("/live/", "/join/");
                }
                navigator.clipboard.writeText(url).then(()=>{
                    this.$Message.error(this.$t("Live.CopyLinkSuccess"));
                },()=>{
                    this.$Message.error("Copy failed!\n\n"+url);
                });
            } else {
                gid("liveInvitelink").select();
                document.execCommand("Copy");
                this.$Message.error(this.$t("Live.CopyLinkSuccess"));
            }
            
        },
        invitelinkEmail() {
            this.invitelink = false;
        },
        inviteuserOK() {
            if (this.selectedFriends.length < 1) {
                return;
            }
            //alert(this.selectedFriends.join(","));
            //debugger;
            var userid = auth.getUserIDEx();
            websocket.inviteuser(MeetingID, this.selectedFriends.join(","));
            Add2UserList(this.selectedFriends.join(","));
            var arr = new Array();
            for (let friendid of this.selectedFriends) {
                if (friendid + "" == this.meetingInfo.RetData.StudentID + "") {
                    var senddataStudent = new Object();
                    senddataStudent.roleType = "1";
                    senddataStudent.actionType = this.getIsInstantMeeting()
                        ? "10"
                        : "1";
                    senddataStudent.attachmentUrl = this.attachmentUrl;
                    senddataStudent.targetID = this.meetingInfo.RetData.StudentID; //学生
                    senddataStudent.meetingID = MeetingID.toUpperCase();
                    senddataStudent.incidentID = this.getMeetingID();
                    senddataStudent.sourceID = this.meetingInfo.RetData.TeacherID; //老师
                    senddataStudent.blankPageNumber = this.getSelectFileBlankPageNumber();
                    //senddataStudent.attachmentID = this.getSelectFileAttachmentID();
                    senddataStudent.itemID = this.getSelectFileAttachmentID();
                    websocket.sendmessage(
                        friendid,
                        base64encode(utf16to8(JSON.stringify(senddataStudent)))
                    );
                } else {
                    arr.push(friendid);
                }
            }

            var senddata = new Object();
            senddata.roleType = "3";
            senddata.actionType = this.getIsInstantMeeting() ? "10" : "1";
            senddata.attachmentUrl = this.attachmentUrl;
            senddata.targetID = this.meetingInfo.RetData.StudentID;
            senddata.meetingID = MeetingID.toUpperCase();
            senddata.incidentID = this.getMeetingID();
            senddata.sourceID = this.meetingInfo.RetData.TeacherID;
            senddata.blankPageNumber = this.getSelectFileBlankPageNumber();
            //senddata.attachmentID = this.getSelectFileAttachmentID();
            senddata.itemId = this.getSelectFileAttachmentID();
            websocket.sendmessage(
                arr.join(","),
                base64encode(utf16to8(JSON.stringify(senddata)))
            );
            this.inviteuser = false;
        },
        inviteuserCancel() {
            this.inviteuser = false;
        },
        saveAndExitLesson() {
            webapi.SaveInstantLesson(this.GetLessonID()).then(()=>{
                this.existLessonAll(false,true);
            });            
        },
        exitLesson() {
            this.existLessonAll();
        },
        existLessonAll(isKick=false,needsave=false) {
            //console.log("existLessonAll");
            this.checkExist.show = false;
            //$("#videoPlayerMask").remove();
            // if(Role == 2)
            // {
            //     var lessonid=this.GetLessonID();
            //     this.autoRecord("End",()=>{
            //     },()=>{
            //         webapi.MergeSoundtrack(lessonid,this.autoRecordInfo.RecordID);
            //     })
                
            // }
            // else
            // {
            //     this.autoRecord("End");
            // }
            
            if (this.autoCloseTimer) {
                clearTimeout(this.autoCloseTimer);
                this.autoCloseTimer = null;
            }
            if (AutoPlayTimer) {
                clearTimeout(AutoPlayTimer);
                AutoPlayTimer = null;
            }
            if (this.speakingTimer) {
                clearTimeout(this.speakingTimer);
                this.speakingTimer = null;
            }
            if (this.playAudioTimer) {
                clearTimeout(this.playAudioTimer);
                this.playAudioTimer = null;
            }
            if (this.updateProcessTimer) {
                clearTimeout(this.updateProcessTimer);
                this.updateProcessTimer = null;
            }
            if (this.syncAudioStat == 1) {
                websocket.audiosync(0, this.lastSycnAudioItemID);
                this.lastSycnAudioItemID = 0;
                this.syncAudioStat = 0;
            }
            if (this.serverLineID == 2) {
                this.KloudCallEnd();
            }
            if(this.syncTimeAxis.Timer)
            {
                clearTimeout(this.syncTimeAxis.Timer);
                this.syncTimeAxis.Timer = null;
            }
            
            this.showGlobalBlockMsg("", false);
            if (this.isPrepare) {
                this.NoticePrepare(0);
            }
            try {
                this.getMediaView().Leave();
            } catch (exp) {}
            try {
                //this.getCharView().End();
            } catch (exp) {}

            try {
                this.$refs.controlsetting.end();
            } catch (exp) {}
            try {
                this.$refs.mediasetting.end();
            } catch (exp) {}

            try {
                this.$refs.uploadfile.onCancel();
            } catch (exp) {}
            try {
                websocket.setmeetingid(0);
                websocket.setopencallback(null);
                websocket.onKickMeeting=null;
                if (Role == 2 && isKick==false) {
                    websocket.endmeeting(() => {});
                } else {
                    websocket.leavemeeting(() => {});
                }
            } catch (exp) {}

            var afterMerge=()=>{
                try {
                    websocket.reset4existmeeting();
                } catch (exp) {}
                websocket._currentStatus = 0;
                websocket._currentLine = 0;
                websocket._currentModeID = 0;
                websocket._currentPageID = 0;
                websocket._currentDocID = 0;
                $("#main").empty();
                AttachmentID="";
                this.reset();
                this.resetData();
                this.resetVuex4ExistRoom(null);
                window.CheckQuit=null;
                //this.$router.push("/");
                
                //this.$router.go(-1);
                if(LastRouterPath.toLowerCase().indexOf("syncroom")>-1 
                || LastRouterPath.toLowerCase().indexOf("login")>-1
                || LastRouterPath.toLowerCase().indexOf("docview")>-1
                || LastRouterPath.toLowerCase().indexOf("join")>-1)
                {
                    this.$router.push("/");
                }
                else
                {
                    this.$router.push(LastRouterPath);
                }  
            };
            if(needsave || !this.isInstantMeeting(MeetingID + ""))
            {
                this.autoRecord("Merge",()=>{
                },()=>{                
                    afterMerge();
                });  
            }
            else
            {
                afterMerge();
            }                         
        },
        clickClose(showconfirm = false,isKick=false,isback=false) {
            //console.log("clickClose:"+isKick);
            if(!isback)
            {
                this.exitMySelf=true;
            }
            
            //console.log("clickClose:"+location.href);
            // if (location.href.toLowerCase().indexOf("/live") == -1) {
            //     return;
            // }
            if (showconfirm &&Role == 2 &&this.isInstantMeeting(MeetingID + "")) 
            {
                this.checkExist.isTeacher = true;
            } else if (showconfirm) {
                this.checkExist.isTeacher = false;
            } else {
                this.existLessonAll(isKick);
            }
            if(!IsDocEidt)this.checkExist.needSave = false;
            else this.checkExist.needSave = true;
            this.checkExist.show = true;
        },
        GetUserID() {
            var userid = auth.getUserIDEx();
            return userid;
        },
        CloseWelcomeMessage() {
            if (this.isLessonStart == true) 
            {
                this.welcomeMessage = false;
            } else {
                this.clickClose();
            }
        },
        ShowUpComingLesson() {
            var showID = MeetingID + "";
            if (showID.indexOf("-") == 0) {
                showID = showID.substr(1);
            }
            this.welcomeMessageKlassRoomID = showID;
            this.welcomeMessageList = [];

            webapi.getClassRoomTeacherID(MeetingID).then(teacherid => {
                if (teacherid == this.GetUserID()) {
                    this.welcomeMessageTeacherName = this.$t("Live.My");
                } else {
                    webapi.getUserListBasicInfo([teacherid]).then(userinfo => {
                        //log(userinfo[0].UserName);
                        this.welcomeMessageTeacherName = userinfo[0].UserName;
                    });
                }
                webapi.getUpcomingLessonList(teacherid).then(info => {
                    //loger.log(info);
                    if(!info)return;
                    for (var item of info) {
                        if (item.LessonID == 0) {
                            continue;
                        }
                        var start = new Date(parseInt(item.StartDate));
                        var diff = start - new Date();
                        var lefttim =
                            this.$t("Live.Startingin") +
                            (diff / 1000 / 60).toFixed(0) +
                            this.$t("Live.Minutes");
                        if (item.IsOnGoing == 1) {
                            lefttim = this.$t("Live.InProgress");
                            this.teacherInLessonID=item.LessonID;
                            
                            $("#BtnWelMsgJoinStudent,#BtnWelMsgJoinAuditor").attr("disabled",false);
                            $("#WelMsgWaitJoin").hide();
                            return;
                        }
                        let lesson = {
                            title: item.Title,
                            id: item.LessonID,
                            classroomid: item.ClassroomID,
                            isongoing: item.IsOnGoing,
                            inclassroom: item.IsInClassroom,
                            time:
                                start.toDateString() +
                                " " +
                                start.toLocaleTimeString(),
                            lefttime: lefttim
                        };
                        this.welcomeMessageList.push(lesson);
                    }
                });
            });
        },
        WelMsgViewLesson(item) {
            this.welcomeMessage = false;
            if (
                item.classroomid != "" &&
                item.isongoing == 1 &&
                item.inclassroom == 1
            ) {
                this.WelMsgJoinStudent();
                return;
            }

            websocket.leavemeeting(() => {
                websocket.setopencallback(null);
            });

            this.reset();

            //this.$router.push({ name: 'live', params: { incidentid: item.id } });
            this.$router.push("/live/" + item.id);
            //this.$router.replace('/live/' + item.id);
            //this.mounted();
            // setTimeout(() =>
            // {
            //   //this.$router.go({ path: '/live', query: { incidentid: item.id } });
            //   this.$router.go('/live/' + item.id);
            // }, 20);
        },
        WelMsgStartMeeting() {
            this.welcomeMessage = false;
            this.showUploadFile = true;
            this.mediaSettingDlg = true;
            this.$refs.mediasetting.init();
            this.mediaSettingCallback = () => {
                this.$refs.liveLessonHead.ToStartLessonStat();
                var classRoomID = auth.getClassroomID();
                webapi.getClassRoomLessonID(classRoomID).then(lessonid => {
                    if (lessonid < 1) {
                        webapi
                            .addInstantLesson(classRoomID,0)
                            .then(newLessonid => {
                                if (newLessonid > 0) {
                                    this.changeLessonID(newLessonid);
                                    this.WelMsgTeachStart(newLessonid);
                                }
                            });
                    } else {
                        this.changeLessonID(lessonid);
                        this.WelMsgTeachStart(lessonid);
                    }
                });
            };
        },
        WelMsgStartExistLesson(lineid) {
            var classRoomID = auth.getClassroomID();
            webapi.getClassRoomLessonID(classRoomID).then(lessonid => {
                if (lessonid < 1) {
                } else {
                    this.welcomeMessage = false;
                    this.showUploadFile = true;
                    this.mediaSettingDlg = true;
                    this.$refs.mediasetting.init(lineid);
                    this.mediaSettingCallback = () => {
                        this.changeLessonID(lessonid);
                        this.WelMsgTeachStart(lessonid);
                    };
                }
            });
        },
        WelMsgStartLesson() {
            this.welcomeMessageCourse = true;
            $(
                "#btnWelMsgStartMeeting,#btnWelMsgStartLesson,#btnWelMsgPrepare"
            ).prop("disabled", "true");
            webapi.getCourseList().then(info => {
                this.courseList = [];
                for (var course of info) {
                    var obj = new Object();
                    obj.text = course.Title;
                    obj.value = course.CourseID;
                    this.courseList.push(obj);
                }
            });
        },
        WelMsgCreateLesson() {
            if (this.selectCourse == null || this.selectCourse == "") {
                this.$Message.error(this.$t("Live.PleaseSelectCourse"));
                //this.$Message.error(
                //  {
                //    content: 'Please select Course!',
                //    top:150,
                //    duration: 3
                //  });
                return;
            }
            if (this.selectLecture == null || this.selectLecture == "") {
                this.$Message.error(this.$t("Live.PleaseSelectLecture"));
                //this.$Message.error(
                //  {
                //    content: 'Please select Lecture!',
                //    duration: 3
                //  });
                return;
            }
            this.welcomeMessage = false;
            this.mediaSettingDlg = true;
            this.$refs.mediasetting.init();
            this.mediaSettingCallback = () => {
                var now = new Date();
                var enddate = new Date();
                enddate.setHours(enddate.getHours() + 2);
                let start = now.getDatePart() + now.getTimePart();
                let end = enddate.getDatePart() + enddate.getTimePart();

                var lesson = new Object();
                lesson.LessonID = 0;
                lesson.Title =
                    "New Lesson " + now.Format("yyyy-MM-dd hh:mm:ss");
                lesson.Description = "";
                lesson.CourseID = this.selectCourse;
                lesson.LectureIDs = this.selectLecture;
                lesson.StartDate = start;
                lesson.EndDate = end;
                //lesson.StudentID = -1;
                lesson.ClassroomID = MeetingID;
                lesson.SchoolID = 0;
                lesson.LessonType = 2;

                lesson.LessonMembers = [
                    {
                        MemberID: parseInt(auth.getUserID()),
                        Role: 2
                    }
                ];

                webapi.createLessonEx(lesson).then(lessonid => {
                    this.welcomeMessageCourse = false;
                    //this.WelMsgViewLesson({ id: lessonid});
                    this.changeLessonID(lessonid);
                    this.WelMsgTeachStart(lessonid);
                });
            };
        },
        WelMsgCancelCreateLesson() {
            this.welcomeMessageCourse = false;
            $(
                "#btnWelMsgStartMeeting,#btnWelMsgStartLesson,#btnWelMsgPrepare"
            ).removeAttr("disabled");
        },
        WelMsgTeachStart(lessonid) {
            //this.changeEnableAudio(true);
            //this.changeEnableVideo(true);
            //this.getCharView().Init("Classroom-" + lessonid, this.GetUserID());
            this.isPrepare = false;
            if (this.showUploadFile) {
                this.NoticeKlassromm(MeetingID.toUpperCase(), lessonid);
            }
            this.showLessonFile();
            this.showVideos();
            this.StartMedia();
        },
        WelMsgJoinStudent() {
            if(this.teacherInLessonID>0 && this.getIsInstantMeeting())
            {
                this.WelMsgJoinToTeacherLesson(this.teacherInLessonID);
                return;
            }
            this.WelMsgJoinAuditor((isjoinSuccess) => {
                if(isjoinSuccess)
                {
                    UptoStudent(this.GetUserID(), "");
                }
            });
        },
        WelMsgJoinAuditor(callback) {
            this.welcomeMessage = false;
            if(this.roomIsFull)
            {                
                this.showRoomFullTip=true;
            }

            var tempLineID = this.getAudioServerLineID;
            if (tempLineID != -1) {
                this.serverLineID = tempLineID;
            }

            if (this.serverLineID == 2) {
                //kloudcall
                this.StartMedia();
                if (callback && typeof callback == "function")
                {
                    callback(true);
                }
            } else {
                var afterSetting=() => {
                    var mid = this.getLessonID;
                    //loger.log(mid);
                    if (mid == 0) {
                        webapi
                            .getClassRoomLessonID(MeetingID)
                            .then(lessonid => {
                                //this.getCharView().Init("Classroom-" + lessonid, this.GetUserID());
                                this.changeLessonID(lessonid);
                                var selAtmID = AttachmentID;
                                if (this.editingEventFiles.length < 1) {
                                    this.showLessonFile();
                                }
                                this.showVideos();
                                this.StartMedia();
                                if (callback && typeof callback == "function")
                                    callback(true);
                            });
                    } else {
                        //this.getCharView().Init("Classroom-" + mid, this.GetUserID());
                        var selAtmID = AttachmentID;
                        if (this.editingEventFiles.length < 1) {
                            this.showLessonFile();
                        }
                        this.showVideos();
                        this.StartMedia();
                        if (callback && typeof callback == "function")
                            callback(true);
                    }
                };
                if(this.roomIsFull)
                {
                    afterSetting();
                }
                else
                {
                    this.mediaSettingDlg = true;
                    this.$refs.mediasetting.init();
                    this.mediaSettingCallback = afterSetting;
                }
            }
        },
        WelMsgJoinToTeacherLesson(lessonid){
            websocket.setmeetingid(0);
            websocket.leavemeeting(() => {
                this.reset();
                this.resetData();
                var meetingid = this.getIDFromUrl();
                this.mediaSettingDlg = true;
                this.$refs.mediasetting.init();
                this.mediaSettingCallback = () => {
                    //MeetingID=lessonid;
                    this.changeLessonID(lessonid);
                    webapi.getClassRoomTeacherID(meetingid).then(teacherid => {     
            
                        this.StartMedia(lessonid);
                        this.showLessonFile();
                        StartMeetingEx(this, lessonid, 1, teacherid, auth.getUserIDEx());

                        websocket.setmeetingid(lessonid);
                    });
                };
            });
            

        },
        prepareCourseTemp() {
            $(
                "#btnWelMsgStartMeeting,#btnWelMsgStartLesson,#btnWelMsgPrepare"
            ).prop("disabled", "true");
            this.welcomeMessagePrepareTemp = true;
            this.showWelMsgPrepareMenu = false;
            this.$refs.selectCourseTemp.init();
        },
        prepareLesson() {
            $(
                "#btnWelMsgStartMeeting,#btnWelMsgStartLesson,#btnWelMsgPrepare"
            ).prop("disabled", "true");
            this.welcomeMessagePrepareLesson = true;
            this.showWelMsgPrepareMenu = false;

            friends.getFriends(f => {
                for (let user of f) {
                    var obj = new Object();
                    obj.text = user.Name;
                    obj.value = user.UserID;
                    this.studentList.push(obj);
                }
            });
        },
        prepareFile() {
            $(
                "#btnWelMsgStartMeeting,#btnWelMsgStartLesson,#btnWelMsgPrepare"
            ).prop("disabled", "true");
            this.welcomeMessagePrepareFile = true;
            this.showWelMsgPrepareMenu = false;
        },
        onCoursePrepareTempChange() {},
        onStudentChange() {
            webapi
                .getStudentCourseList(this.GetUserID(), this.selectStudent)
                .then(info => {
                    this.courseList = [];
                    for (var course of info) {
                        var obj = new Object();
                        obj.text = course.Title;
                        obj.value = course.CourseID;
                        this.courseList.push(obj);
                    }
                });
        },
        prepareTempOk(id) {
            this.welcomeMessage = false;
            this.showUploadFile = true;

            var callback = () => {
                this.isPrepare = true;
                this.$refs.liveLessonHead.ToStartLessonStat();
                this.showLecutreFile(id);
                this.prepareLectureID = id;
                this.StartMedia();
                websocket.updateprepareinfo(id);
                this.NoticePrepare(1);
            };
            if (this.isLessonStart == true) {
                callback();
            } else {
                this.mediaSettingDlg = true;
                this.$refs.mediasetting.init();
                this.mediaSettingCallback = callback;
            }
        },
        cancelPrepareTemp() {
            if (this.isLessonStart == true) {
                this.welcomeMessage = false;
            } else {
                this.welcomeMessagePrepareTemp = false;
                this.showWelMsgPrepareMenu = true;
                $(
                    "#btnWelMsgStartMeeting,#btnWelMsgStartLesson,#btnWelMsgPrepare"
                ).removeAttr("disabled");
            }
        },
        prepareLessonOk() {
            //alert("TO DO...");
            if (this.selectCourse == null || this.selectCourse == "") {
                this.$Message.error(this.$t("Live.PleaseSelectCourse"));
                return;
            }
            if (this.selectLecture == null || this.selectLecture == "") {
                this.$Message.error(this.$t("Live.PleaseSelectLecture"));
                return;
            }

            this.welcomeMessage = false;
            this.mediaSettingDlg = true;
            this.showUploadFile = true;
            this.$refs.mediasetting.init();
            this.mediaSettingCallback = () => {
                this.isPrepare = true;
                this.$refs.liveLessonHead.ToStartLessonStat();
                this.showLecutreFile(this.selectLecture);
                this.prepareLectureID = this.selectLecture;
                this.StartMedia();
                websocket.updateprepareinfo(this.selectLecture);
                this.NoticePrepare(1);
            };
        },
        prepareLesson4Head() {
            this.mediaSettingDlg = true;
            this.showUploadFile = true;
            this.$refs.mediasetting.init();
            this.mediaSettingCallback = () => {
                this.isPrepare = true;
                this.$refs.liveLessonHead.ToStartLessonStat();
                this.prepareLectureID = 0;
                this.StartMedia();
                this.SetButton4PreViewLesson(false);
                websocket.updateprepareinfo(0, MeetingID);
            };
        },
        cancelPrepareLesson() {
            this.welcomeMessagePrepareLesson = false;
            this.showWelMsgPrepareMenu = true;
            $(
                "#btnWelMsgStartMeeting,#btnWelMsgStartLesson,#btnWelMsgPrepare"
            ).removeAttr("disabled");
        },
        cancelPrepareFile() {
            this.welcomeMessagePrepareFile = false;
            this.showWelMsgPrepareMenu = true;
            $(
                "#btnWelMsgStartMeeting,#btnWelMsgStartLesson,#btnWelMsgPrepare"
            ).removeAttr("disabled");
        },
        prepareFileOk(lessonid) {
            this.welcomeMessage = false;
            this.mediaSettingDlg = true;
            this.showUploadFile = true;
            this.$refs.mediasetting.init();
            this.mediaSettingCallback = () => {
                this.isPrepare = true;
                this.$refs.liveLessonHead.ToStartLessonStat();
                this.prepareLectureID = 0;
                this.StartMedia();
                this.showLessonFile(lessonid);
                websocket.updateprepareinfo(0, lessonid);
                this.NoticePrepare(1);
            };
        },
        newCourseTemp() {
            //alert("newCourseTemp");
            $("#welcomeMessagePrepareTemp_selectLecture").hide();
            $("#welcomeMessagePrepareTemp_newLecture").show();
        },
        cancelNewCourseTemp() {
            $("#welcomeMessagePrepareTemp_selectLecture").show();
            $("#welcomeMessagePrepareTemp_newLecture").hide();
        },
        prepareChangeLecture() {
            //alert("prepareChangeLecture");
            this.welcomeMessage = true;
            this.prepareCourseTemp();
        },
        changePrepareStatus(mode) {
            if (mode == 1) {
                this.welcomeMessageWarnning = this.$t("Live.YourHostPrepare");
            } else {
                this.welcomeMessageWarnning = this.$t(
                    "Live.PleaseWaitforYourHost"
                );
            }
        },
        mediaSettingOK() {
            this.$refs.mediasetting.saveUserSetting();
            try {
                this.$refs.mediasetting.end();
            } catch (exp) {}
            this.$refs.controlsetting.init(Role);
            this.mediaSettingDlg = false;
            if (Role == 2) {
                var selLineID = this.$refs.mediasetting.getLineID();
                this.AfterSelectAudioTool(selLineID, false);
                this.NoticeServerID(selLineID);
            }
            if (this.mediaSettingCallback) this.mediaSettingCallback();
        },
        onCourseChange() {
            if (this.selectCourse == null || this.selectCourse == "") return;

            webapi.getLectureList(this.selectCourse).then(info => {
                this.lectureList = [];
                for (var lecture of info) {
                    var obj = new Object();
                    obj.text = lecture.Title;
                    obj.value = lecture.LectureID;
                    this.lectureList.push(obj);
                }
            });
        },
        AfterSaveControlSetting(res) {
            //this.getMediaView().ResetSpeaker();
            console.log("AfterSaveControlSetting");
            if (res != "") {
                this.NoticeScreenShareRes(res);
                this.getMediaView().ShareScreenResChange(res);
            }
            this.getMediaView()
                .Leave()
                .then(() => {
                    var userid = auth.getUserIDEx();
                    var name = auth.getUserName();
                    this.getMediaView().JoinMedia(
                        MeetingID,
                        userid,
                        name,
                        Role,
                        this.getEnableVideo,
                        this.getEnableAudio
                    );
                });
        },
        OnSpeaking(vol) {
            //console.log("OnSpeaking");
            this.lastVol = Math.max(vol, this.lastVol);
            if (this.speakingTimer == null) {
                this.speakingTimer = setInterval(() => {
                    if (this.lastVol >= 0.15) {
                        websocket.speaking();
                    }
                    this.lastVol = 0;
                }, 30000);
            }
        },
        onCameraChange(id)
        {
            //console.log(id);
            if(!Browser.isChrome()) return;
            this.getMediaView().SwitchDevice("video",id,()=>{
                 this.$Message.success({content:"切换摄像头成功!",duration: 3});
            },()=>{
                this.$Message.error({content:"切换摄像头失败!",duration: 3});
            });
        },
        onMicChange(id)
        {
            //console.log(id);
            if(!Browser.isChrome()) return;
            this.getMediaView().SwitchDevice("audio",id,()=>{
                 this.$Message.success({content:"切换麦克风成功!",duration: 3});
            },()=>{
                this.$Message.error({content:"切换麦克风失败!",duration: 3});
            });
        },
        onSpeakerChange(id){
            //console.log(id);
            if(!Browser.isChrome()) return;
            this.getMediaView().ResetSpeaker(id);
        },
        AfterSelectAudioTool(lineid, needNotice = true) {
            //this.kloudcallNotifiation = true;
            //this.kloudCallNumber = localStorage.getItem('UserData.Mobile');
            //alert(lineid);
            //if (lineid == this.serverLineID)
            //{
            //  return;
            //}
            //if (needNotice)
            //{
            //  this.NoticeServerID(lineid);
            //}
            if (needNotice == true) {
                websocket._currentLine = lineid;
            }

            if (this.isLessonStart == false) {
                this.serverLineID = lineid;
                return;
            }
            if (lineid == 0) {
                //sytem
                //this.lineText = "System audio";
                if (Role == 2) {
                    this.KloudCallEnd();
                }

                if (Role == 2 && needNotice) {
                    this.NoticeServerID(lineid);
                }

                var userid = auth.getUserIDEx();
                var name = auth.getUserName();
                this.Switch2Agora();
                //this.getMediaView().JoinMedia(MeetingID, userid, name, Role, this.getEnableVideo, this.getEnableAudio);
            } else if (lineid == 2) {
                //kloud call
                //this.lineText = "KloudCall";
                if (Role == 2) {
                    //this.kloudcallNotifiationTeacher = true;
                    UpdateUserPhoneInList(this.GetUserID(), true);
                    this.kloudCallNumber = auth.getMobile();
                    this.kloudCallNumberTeacher = auth.getMobile();
                    this.NoticeServerID(2);
                    this.KloudCallStart();
                } else {
                    //this.getMediaView().Leave().then(() =>
                    //{
                    //});
                    this.Switch2KloudCall();
                }
                //this.getMediaView().Leave().then(() =>
                //{
                //  if (Role == 2)
                //  {
                //    this.KloudCallStart();
                //  }
                //});
            } else if (lineid == 4) {
                // third part
                //this.lineText = "No audio";
                if (Role == 2) {
                    //this.kloudcallNotifiationTeacher = true;
                    this.NoticeServerID(4);
                    this.Switch2KloudCall();
                } else {
                    //this.getMediaView().Leave().then(() =>
                    //{
                    //});
                    this.Switch2KloudCall();
                }
            }
            this.serverLineID = lineid;
        },
        Switch2KloudCall() {
            loger.log("Switch2KloudCall");
            if (Role == 2 && this.preShareMode == 30) {
                this.ShareDocument(true);
            }
            this.getMediaView().Switch2KloudCall();
        },
        Switch2Agora() {
            loger.log("Switch2Agora");
            this.getMediaView().Switch2Agora();
            UpdateUserPhoneInList(this.GetUserID(), false);
        },
        KloudCallEndAgora() {
            //this.getMediaView().Leave().then(() =>
            //{
            //});
            this.Switch2KloudCall();
        },
        KloudCallStudent() {
            //this.getMediaView().Leave().then(() =>
            //{
            //});
            this.kloudcallNotifiation = true;
            UpdateUserPhoneInList(this.GetUserID(), true);
            this.kloudCallNumber = auth.getMobile();
        },
        KloudCallStart() {
            var userid = auth.getUserIDEx();
            var userids = new Array();
            for (var user of this.userList) {
                userids.push(user.userid);
            }
            webapi.getUserListBasicInfo(userids).then(list => {
                var phonelist = new Array();
                var myphone = "";
                for (var info of list) {
                    if (userid == info.UserID) {
                        myphone = info.Phone;
                    } else {
                        phonelist.push(info.Phone);
                    }
                }
                //var data = new Object();
                //data.Moderator = this.kloudCallNumberTeacher; //myphone;
                //data.Participants = phonelist.join(",");
                //webapi.createConferenceCall(data).then(res =>
                //{
                //  //loger.log(res);
                //});

                websocket.createconference(this.kloudCallNumberTeacher);
            });
        },
        KloudCallEnd() {
            websocket.endconference();
        },
        KloudCallTeacherOK() {
            if (!CheckPhoneNum(this.kloudCallNumberTeacher)) {
                this.$Message.error({
                    content: this.$t("Live.PhoneNumberIncorrect"),
                    duration: 0,
                    closable:true
                });
                $("#KoundCallTeacherNumber")
                    .find("input")
                    .focus();
                //alert("The phone number is incorrect!");
                return;
            }
            this.kloudcallNotifiationTeacher = false;
            //this.getMediaView().Leave().then(() =>
            //{
            //    this.NoticeServerID(2);
            //    this.KloudCallStart();
            //});
            this.NoticeServerID(2);
            this.KloudCallStart();
        },
        KloudCallTeacherCancel() {
            this.kloudcallNotifiationTeacher = false;
            this.serverLineID = 0;
            this.$refs.controlsetting.selectLine(0);
        },
        KloudCallNow() {
            if (!CheckPhoneNum(this.kloudCallNumber)) {
                this.$Message.error({
                    content: this.$t("Live.PhoneNumberIncorrect"),
                    duration: 0,
                    closable:true
                });
                $("#KoundCallStudentNumber")
                    .find("input")
                    .focus();
                //alert("The phone number is incorrect!");
                return;
            }
            this.kloudcallNotifiation = false;
            websocket.callme(this.kloudCallNumber);
        },
        KloudCallLater() {
            this.kloudcallNotifiation = false;
            //UpdateUserPhoneInList(this.GetUserID(), true);
        },
        ClickUserPhone(uid) {
            //alert("ClickUserPhone" + uid);
            this.kloudcallNotifiation = true;
            //UpdateUserPhoneInList(this.GetUserID(), false);
        },
        PlayRecord() {
            //this.$router.push('/play');
            this.$router.push({
                name: "play",
                query: { id: "b7f3cb1f-282c-4f6e-b5ec-549de69c21df" }
            });
        },
        StopShareScreen() {
            this.getMediaView().StopShareScreen();
        },
        ShareDocument(powerChange = false) {
            if(Role==3)
            {
                this.$Message.error({content:this.$t("Live.NoPermission"),duration:0,closable:true});
                return;
            }
            if (!this.showUploadFile && powerChange == false) {
                this.$Modal.confirm({
                    render: h => {
                        return h("Div", {domProps: {innerHTML: this.$t("Live.ShareDocumentMakePresenter")}});
                    },
                    onOk: () => {
                        MakePresenter(auth.getUserID(), auth.getUserToken());
                        setTimeout(() => {this.ShareDocument(true);}, 1000);
                    }
                });
                return;
            }

            if (this.preShareMode == 10 && ($("#main").is(":visible") ||$("#live-welcomepage").is(":visible")) ) {
                return;
            }
            //if (this._lastSwitchTime && !powerChange && (new Date() - this._lastSwitchTime) < 1000)
            //{
            //  alert("Please wait while page is loading!");
            //  return;
            //}
            //this._lastSwitchTime = new Date();

            //if (this.showUploadFile)
            {
                $("#livePanelTopCtl").find("div.livePanelTopCtlbtn").filter(".selected").removeClass("selected");
                $("#liveShareDocument").parent().addClass("selected");
            }
            //else
            //{
            //  $("#liveShareControl").find("a.show").removeClass("show");
            //  $("#liveShareDocument").addClass("show");
            //}

            this.SwitchLiveActionBtn(10);

            if (this.preShareMode >= 30) {
                this.getMediaView().minFullScreen();
            }
            Record();
            //if (this.preShareMode >= 30)
            {
                this.NoticeMeeting(0, "0", powerChange);
            }
            this.getMediaView().StopShareScreen();
            this.preShareMode = 10;
            this.autoRecord("Enable");
        },
        ShareScreen(showconfirm = true) {
            if(Role==3)
            {
                this.$Message.error({content:this.$t("Live.NoPermission"),duration:0,closable:true});
                return;
            }
            if (!this.showUploadFile) {
                this.$Modal.confirm({
                    render: h => {
                        return h("Div", {
                            domProps: {
                                innerHTML: this.$t(
                                    "Live.ShareScreenMakePresenter"
                                )
                            }
                        });
                    },
                    onOk: () => {
                        //alert("ok");
                        MakePresenter(auth.getUserID(), auth.getUserToken());
                        setTimeout(() => {
                            this.getMediaView().StartShareScreen();
                        }, 1000);
                    }
                });
                return;
            }
            if (
                this._lastSwitchTime &&
                new Date() - this._lastSwitchTime < 2000
            ) {
                //alert("Please wait while page is loading!");
                return;
            }
            this._lastSwitchTime = new Date();
            this.getMediaView().StartShareScreen();
        },
        ShareScreenEx() {
            $("#livePanelTopCtl").find("div.livePanelTopCtlbtn").filter(".selected").removeClass("selected");
            $("#liveShareScreen").parent().addClass("selected");
            this.SwitchLiveActionBtn(20);

            if (this.preShareMode >= 30) {
                this.getMediaView().minFullScreen();
            }
            if(this.getAttachmentCount()==0)
            {
                this.onWelCreateBlankPage();
            }

            //StopRecord();
            //if (this.preShareMode >= 30)
            {
                this.NoticeMeeting(3);
            }
            this.preShareMode = 20;
            this.autoRecord("Enable");
        },
        ShareMeeting() {
            if (!this.showUploadFile) return;
            //if (this.serverLineID == 2) return;
            //alert("ToDo...");
            //return;
            if (this.preShareMode == 30) {
                return;
            }
            taggleMinControlWindow(false);
            //if (this._lastSwitchTime && (new Date() - this._lastSwitchTime) < 1000)
            //{
            //  //alert("Please wait while page is loading!");
            //  return;
            //}
            //this._lastSwitchTime = new Date();
            this.OnShowVideoView();
            //$("#liveShareControl").find("a.selected").removeClass("selected");
            $("#livePanelTopCtl").find("div.livePanelTopCtlbtn").filter(".selected").removeClass("selected");
            //$("#liveShareMeeting").addClass("selected");
            this.SwitchLiveActionBtn(30);
            $("#liveActionOneBigVideo").removeClass("live-pdf-action-active");
            $("#liveActionListVideo").addClass("live-pdf-action-active");

            this.StopShareScreen();
            this.getMediaView().fullVideoView();
            this.preShareMode = 30;
            this.NoticeMeeting(1);
            this.autoRecord("Disable");
        },
        ShareOneBigMeeting(showuser = "0") {
            if (!this.showUploadFile)
            {
                this.$Message.error({content:this.$t("Live.PresenterWarnning"),duration:0,closable:true});
                return;
            }
            if (this.preShareMode == 31) {
                return;
            }
            taggleMinControlWindow(false);
            //if (this._lastSwitchTime && (new Date() - this._lastSwitchTime) < 1000)
            //{
            //  //alert("Please wait while page is loading!");
            //  return;
            //}
            //this._lastSwitchTime = new Date();
            $("#livePanelTopCtl").find("div.livePanelTopCtlbtn").filter(".selected").removeClass("selected");

            $("#liveActionListVideo").removeClass("live-pdf-action-active");
            $("#liveActionOneBigVideo").addClass("live-pdf-action-active");
            this.SwitchLiveActionBtn(31);
            this.getMediaView().fullVideoBigOneView(showuser);
            this.preMaxUserID = showuser;
            this.preShareMode = 31;
            this.autoRecord("Disable");
            //this.NoticeMeeting(2);
        },
        ShareVideo() {
            //loger.log("ShareVideo");
            this.NoticeMeeting(4);
            this.ViewModeChange(4, "0", true);
            this.preShareMode = 40;
            this.autoRecord("Disable");
        },
        VideoModeBack() {
            var isvisible = $("#livePanelMeeting").is(":visible");
            if (
                this.showUploadFile &&
                !isvisible &&
                (Context.preShareMode == 30 || Context.preShareMode == 31)
            ) {
                Context.ShareDocument();
            }
            taggleMinControlWindow(!isvisible);
            LiveBodyResize();
            CheckZoom();
        },
        ViewModeChange(mode, showuser = "0", powerChange = false) {
            if (this.showUploadFile == true && !powerChange) {
                return;
            }
            loger.log("ViewModeChange:" + mode);
            //$("#liveShareControl").find("a.show").removeClass("show");
            $("#livePanelTopCtl").find("div.livePanelTopCtlbtn").filter(".selected").removeClass("selected");
            if (mode + "" == "0") {
                //share doc
                if (this.preShareMode >= 30 && this.preShareMode < 40) {
                    this.getMediaView().minFullScreen();
                }

                //$("#liveShareDocument").addClass("show");
                $("#liveShareDocument")
                    .parent()
                    .addClass("selected");
                this.SwitchLiveActionBtn(10);
                websocket._currentModeID = 0;
                this.preShareMode = 10;
            } else if (mode + "" == "1") {
                //video list
                taggleMinControlWindow(false);
                this.OnShowVideoView();
                this.getMediaView().fullVideoView();

                //$("#liveShareMeeting").addClass("show");
                this.SwitchLiveActionBtn(30);
                websocket._currentModeID = 1;
                this.preShareMode = 30;
            } else if (mode + "" == "2") {
                //video one big
                this.OnShowVideoView();
                this.getMediaView().fullVideoBigOneView(showuser);

                this.preMaxUserID = showuser;
                //$("#liveShareMeeting").addClass("show");
                this.SwitchLiveActionBtn(31);
                websocket._currentModeID = 2;
                this.preShareMode = 31;
            } else if (mode + "" == "3") {
                //share screen
                if (this.preShareMode >= 30 && this.preShareMode < 40) {
                    this.getMediaView().minFullScreen();
                }

                //$("#liveShareScreen").addClass("show");
                $("#liveShareScreen")
                    .parent()
                    .addClass("selected");
                this.SwitchLiveActionBtn(20);
                websocket._currentModeID = 3;
                this.preShareMode = 20;
            } else if (mode + "" == "4") {
                //share video
                if (this.preShareMode >= 30 && this.preShareMode < 40) {
                    this.getMediaView().minFullScreen();
                }

                //$("#liveShareDocument").addClass("show");
                this.SwitchLiveActionBtn(40);
                websocket._currentModeID = 4;
                this.preShareMode = 40;
            }
        },
        NoticeMeeting(mode, userid = "0", powerChange = false) {
            if (!this.showUploadFile && !powerChange) return;
            var senddata = new Object();
            senddata.videoMode = mode + ""; //0: file 1:meeting 2: one beig meeting 3: share screen 4 play video
            senddata.actionType = 9;
            senddata.currentSessionID = userid;
            websocket.sendmessage(
                "",
                base64encode(utf16to8(JSON.stringify(senddata)))
            );
            websocket._currentModeID = mode;
        },
        NoticeScreen() {
            var senddata = new Object();
            senddata.actionType = 12; //screen resolution
            senddata.width = window.screen.width;
            senddata.height = window.screen.height;
            websocket.sendmessage(
                "",
                base64encode(utf16to8(JSON.stringify(senddata)))
            );
        },
        NoticeHand(userId, stat) {
            var senddata = new Object();
            senddata.actionType = 13;
            senddata.stat = stat; //1:up 0:down
            senddata.userId = userId;
            websocket.sendmessage(
                "",
                base64encode(utf16to8(JSON.stringify(senddata)))
            );
        },
        NoticeAudio(userId, stat) {
            var senddata = new Object();
            senddata.actionType = 14; //audio
            senddata.stat = stat; //1:open 0:close
            senddata.userId = userId;
            websocket.sendmessage(userId,base64encode(utf16to8(JSON.stringify(senddata))));
        },
        NoticeVideo(userId, stat) {
            var senddata = new Object();
            senddata.actionType = 15; //video
            senddata.stat = stat; //1:open 0:close
            senddata.userId = userId;
            websocket.sendmessage(
                userId,
                base64encode(utf16to8(JSON.stringify(senddata)))
            );
        },
        NoticeServerID(id) {
            var senddata = new Object();
            senddata.actionType = 16; //line id
            senddata.lineId = id; //0 agora 1 temasys        2 kloudcall        3 twilio 4 other
            websocket.sendmessage(
                "",
                base64encode(utf16to8(JSON.stringify(senddata)))
            );
        },
        NoticePrepare(mode) {
            var senddata = new Object();
            senddata.actionType = 17; //prepare
            senddata.prepareMode = mode; //1: preparing 0:no
            websocket.sendmessage(
                "",
                base64encode(utf16to8(JSON.stringify(senddata)))
            );
        },
        NoticeScreenShareRes(res) {
            var senddata = new Object();
            senddata.actionType = 18; //ScreenShare Resolution
            senddata.resolution = res; //1: preparing 0:no
            websocket.sendmessage(
                "",
                base64encode(utf16to8(JSON.stringify(senddata)))
            );
        },
        NoticePlayVideoInfo(stat, time, vid, url = "", type = 0,save=1) {
            if (!websocket) return;
            var senddata = new Object();
            senddata.actionType = 19; //play video info
            senddata.stat = stat; //1: play 0:pause 2:close
            senddata.time = time; //current seconds
            senddata.vid = vid; //video id
            senddata.url = url; //video url
            senddata.type = type; //video type 0: video in list 1: video in file
            senddata.save=save;
            if(save==1)
            {
                var t = this.getAudioCurrentTime();
                if (t >= 0) {
                    senddata.savetime = t;
                }
            }
            websocket.sendmessage(
                "",
                base64encode(utf16to8(JSON.stringify(senddata)))
            );
        },
        NoticeToMasterLesson(lessonid) {
            if (!websocket) return;
            var senddata = new Object();
            senddata.actionType = 20; //To Master Lesson
            senddata.lessonId = lessonid; //lessonid
            websocket.sendmessage(
                "",
                base64encode(utf16to8(JSON.stringify(senddata)))
            );
        },
        NoticeHidecamera(bHide) {
            if (!websocket) return;
            var senddata = new Object();
            senddata.actionType = 21; //Hide or show camera bar
            senddata.isHide = bHide ? 1 : 0; //1:hide camera bar 0:show camera bar
            websocket.sendmessage(
                "",
                base64encode(utf16to8(JSON.stringify(senddata)))
            );
            if(bHide)
            {
                this.getMediaView().ToggleLoaclVideo(false);
            }
            else
            {
                if(this.getEnableVideo)
                {
                    this.getMediaView().ToggleLoaclVideo(true);
                }
            }
        },
        NoticePlayAudio(url, stat, favId = 0, time = 0) {
            if (!websocket) return;
            if (!this.showUploadFile) return;
            if (!this.playSyncInfo.Play) return;
            var senddata = new Object();
            senddata.actionType = 23; //play audio
            senddata.url = url;
            senddata.favId = favId;
            if (stat == 4) {
                senddata.time = time;
            }
            senddata.stat = stat; //0 :stop 1:play 2:pause 3:resume 4:playing
            websocket.sendmessage(
                "",
                base64encode(utf16to8(JSON.stringify(senddata)))
            );
        },
        NoticePlayThink(id,stat, time = 0) {
            if (!websocket) return;
            if (!this.showUploadFile) return;
            if (!this.playSyncInfo.Play) return;
            var senddata = new Object();
            senddata.actionType = 23; //play soundtrack
            senddata.soundtrackId = id;//soundtrackID
            if (stat == 4) {
                senddata.time = time;
            }
            senddata.stat = stat; //0 :stop 1:play 2:pause 3:resume 4:playing
            websocket.sendmessage("",base64encode(utf16to8(JSON.stringify(senddata))));
        },
        NoticeLessonIDChange(lessonid) {
            if (!websocket) return;
            if (!this.showUploadFile) return;
            var senddata = new Object();
            senddata.actionType = 24; //lessonid change
            senddata.lessonId = lessonid;//soundtrackID
            websocket.sendmessage("",base64encode(utf16to8(JSON.stringify(senddata))));
        },
        NoticeMuteAllAudio(stat) {
            if (!websocket) return;
            if (!this.showUploadFile) return;
            var senddata = new Object();
            senddata.actionType = 14; //audio
            senddata.stat = stat; //1:open 0:close
            senddata.userId = 0;
            websocket.sendmessage("",base64encode(utf16to8(JSON.stringify(senddata))));
        },
        NoticeSizeMode(sizeMode) {
            if (!websocket) return;
            if (!this.showUploadFile) return;
            this.preSizeMode=sizeMode;
            var senddata = new Object();
            senddata.actionType = 25;
            senddata.sizeMode = sizeMode; //0:width 1:height
            senddata.userId = 0;
            websocket.sendmessage("",base64encode(utf16to8(JSON.stringify(senddata))));
        },
        NoticeRemoveFile(id) {
            if (!websocket) return;
            if (!this.showUploadFile) return;
            var senddata = new Object();
            senddata.actionType = 26;
            senddata.attachmentId = id; 
            websocket.sendmessage("",base64encode(utf16to8(JSON.stringify(senddata))));
        },
        ChangeDrawTool4WhiteBoardDiplayChange(isShow){
            //console.log("ChangeDrawTool4WhiteBoardDiplayChange:"+isShow);
            if (this.showUploadFile) {
                if (isShow) {
                    $(
                        "#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionUndo,#liveActionRedo,#liveActionAddPage,#liveActionPlay"
                    ).hide();
                } else {
                    $(
                        "#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionUndo,#liveActionRedo,#liveActionAddPage,#liveActionPlay"
                    ).show();
                }
            } else {
                $(
                    "#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionUndo,#liveActionRedo,#liveActionAddPage,#liveActionPlay"
                ).hide();
            }
        },
        SwitchLiveActionBtn(mode) {
            //console.log("SwitchLiveActionBtn:"+mode);

            if (mode == 10) {//share doc
                if (this.showUploadFile) {
                    if (this.isWhiteBoardShow() || this.isLessonFinished==true) {
                        $("#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionUndo,#liveActionRedo,#liveActionAddPage,#liveActionPlay"
                        ).hide();
                    } else {
                        $("#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionUndo,#liveActionRedo,#liveActionAddPage,#liveActionPlay"
                        ).show();
                    }
                } else {
                    $("#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionUndo,#liveActionRedo,#liveActionAddPage,#liveActionPlay"
                    ).hide();
                }
                //taggleMinControlWindow(true);
                $("#liveToolbar,#liveToolbarWrap,#main").show();
                $("#liveActionListVideo,#liveActionOneBigVideo,#liveplayvideo").hide();
                if(this.getVideoPlayer()) this.getVideoPlayer().onCloseClick(true);
                if(this.getAttachmentCount()==0)
                {
                    this.SetStyle4WelcomePage(true);
                }
                else
                {
                    this.SetStyle4WelcomePage(false);
                }
                
            } else if (mode == 20) {//share screen
                GetPageContainer(PageNumber).find("div.liveMouse").hide();
                if (this.showUploadFile) {
                    $(
                        "#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionUndo,#liveActionRedo,#liveActionAddPage,#liveActionPlay"
                    ).show();
                    $("#main,#liveToolbar,#liveToolbarWrap").show();
                } else {
                    $(
                        "#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionUndo,#liveActionRedo,#liveActionAddPage,#liveActionPlay"
                    ).hide();
                    $("#main,#liveToolbar,#liveToolbarWrap").hide();
                }
                $(
                    "#liveActionListVideo,#liveActionOneBigVideo,#liveplayvideo"
                ).hide();
                $("#live-welcomepage").hide();
                this.getVideoPlayer().onCloseClick(true);
            } else if (mode == 30 || mode == 31) {//video meeting
                GetPageContainer(PageNumber).find("div.liveMouse").hide();
                $(
                    "#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionUndo,#liveActionRedo,#liveActionAddPage,#liveActionPlay"
                ).hide();
                $("#liveActionListVideo,#liveActionOneBigVideo").show();
                $("#main,#liveToolbar,#liveToolbarWrap,#liveplayvideo").hide();
                $("#live-welcomepage").hide();
                this.getVideoPlayer().onCloseClick(true);
            } else if (mode == 40) {//play video
                GetPageContainer(PageNumber).find("div.liveMouse").hide();
                if (this.showUploadFile) {
                    $(
                        "#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionUndo,#liveActionRedo,#liveActionAddPage,#liveActionPlay"
                    ).hide();
                    $("#main,#liveToolbar,#liveToolbarWrap").hide();
                    $("#liveplayvideo")
                        .find(">video")
                        .attr("controls", "controls");
                } else {
                    $(
                        "#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionUndo,#liveActionRedo,#liveActionAddPage,#liveActionPlay"
                    ).hide();
                    $("#main,#liveToolbar,#liveToolbarWrap").hide();
                    //$("#liveplayvideo").find(">video").removeAttr("controls");
                }
                this.getVideoPlayer().setCanControl(this.showUploadFile);
                $("#liveActionListVideo,#liveActionOneBigVideo").hide();
                $("#liveplayvideo").show();
                $("#liveplayvideo").css({
                    width: getViewWidth(),
                    height: getViewHeight()
                });
            }
            ToPointer();
        },
        ChangeStyle4Presenter(isPresenter) {
            whiteboard.SetCanEdit(isPresenter);
            if (isPresenter) {
                $("#liveToolbarWrap,#livePanelTopCtlWrap").removeClass("attendee-view");
                $("#liveShareControl").find("a.show").addClass("selected").removeClass("show");
                if (this.isWhiteBoardShow() || $("#live-welcomepage").is(":visible")) {
                    $("#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionUndo,#liveActionRedo,#liveActionAddPage,#liveActionPlay").hide();
                } else {
                    $("#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionUndo,#liveActionRedo,#liveActionAddPage,#liveActionPlay").show();
                    //$("#main,#liveToolbar").show();
                }
                this.autoRecord("Enable");
            } else {
                if (!$("#liveToolbarWrap").hasClass("attendee-view")) {
                    $("#liveToolbarWrap").addClass("attendee-view");
                }
                if (!$("#livePanelTopCtlWrap").hasClass("attendee-view")) {
                    $("#livePanelTopCtlWrap").addClass("attendee-view");
                }

                $("#liveShareControl").find("a.selected").addClass("show").removeClass("selected");
                $("#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionUndo,#liveActionRedo,#liveActionAddPage,#liveActionPlay").hide();
                //$("#main,#liveToolbar").hide();
                this.autoRecord("End");
            }
            GetPageContainer(PageNumber).find("div.liveMouse").hide();
            this.SwitchLiveActionBtn(this.preShareMode);
            this.getMediaView().setShowCtl(isPresenter || this.role == 2);
            websocket._isPresenter = isPresenter;
        },
        SetButton4PreViewLesson(isPreview) {
            if (isPreview) {
                $("#liveShareDocumentTip,#liveShareScreenTip").hide();
                taggleMinControlWindow(false);
                LiveBodyResize();
                CheckZoom();
            } else {
                $("#liveShareDocumentTip,#liveShareScreenTip").show();
                taggleMinControlWindow(true);
                LiveBodyResize();
                CheckZoom();
            }
        },
        SetButton4ViewLesson(isView) {
            if (isView) {
                //this.isLessonStart = true;
                //this.SetButton4ViewLesson=true;
                //this.thinkShow=true;
                $("#liveShareDocumentTip,#liveShareScreenTip,#liveHead,#liveSettingTip,#liveAttendeesTip").hide();
                $("div.liveFileUploadStyle,button.livefromcamera").hide();
                taggleMinControlWindow(false);
                LiveBodyResize();
                CheckZoom();
            } else {
                //this.SetButton4ViewLesson=false;
                //this.thinkShow=false;
                $("#liveShareDocumentTip,#liveShareScreenTip,#liveHead,#liveSettingTip,#liveAttendeesTip").show();
                $("div.liveFileUploadStyle,button.livefromcamera").show();
                taggleMinControlWindow(true);
                LiveBodyResize();
                CheckZoom();
            }
        },
        SetButton4Finished(isFinish)
        {
            if(isFinish)
            {
                this.$refs.liveLessonHead.ToStartLessonStat();
                $("#liveShareDocumentTip,#liveShareScreenTip,#liveHead,#liveSettingTip,#liveAttendeesTip").hide();
                $("div.liveFileUploadStyle,button.livefromcamera").hide();
                $("#liveActionMinPanelMeeting,P.live-action-tool-wrap").hide();
                $("#liveRecordLessonCtl").addClass("hide");
                $("div.liveMoreAction-MuteAll,div.liveMoreAction-UnmuteAll").addClass("hide");
                taggleMinControlWindow(false);
                LiveBodyResize();
                CheckZoom();
                this.ShowFinishedPlayButton();
            }
            else
            {
                $("#liveShareDocumentTip,#liveShareScreenTip,#liveHead,#liveSettingTip,#liveAttendeesTip").show();
                $("div.liveFileUploadStyle,button.livefromcamera").show();
                $("#liveActionMinPanelMeeting,P.live-action-tool-wrap").show();
                $("#liveRecordLessonCtl").removeClass("hide");
                $("div.liveMoreAction-MuteAll,div.liveMoreAction-UnmuteAll").removeClass("hide");
                taggleMinControlWindow(true);
                LiveBodyResize();
                CheckZoom();
            }
        },
        onClickLayer(evt){
            $("#liveViewplaybtn").hide();
        },
        playFinishLesson(evt){
            $("#liveViewplaybtn").hide();
            this.playThinkAction(this.recordLessonList[0].id,true);
        },
        ShowFinishedPlayButton(){
            //console.log("ShowFinishedPlayButton");
            this.initRecordLessonList((count)=>{
                //console.log("initRecordLessonList:"+count)
                if(count>0)
                {
                    $("#liveViewplaybtn").show();
                }
            });
        },
        SetStyle4WelcomePage(isShow){
            //console.log("SetStyle4WelcomePage:"+isShow);
            if(isShow && !this.isLessonFinished)
            {
                $("#live-welcomepage").show();
                $("#liveToolbarWrap,#main").addClass("hide");
                $("#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionUndo,#liveActionRedo,#liveActionAddPage,#liveActionPlay"
                ).hide();
            }
            else
            {
                $("#live-welcomepage").hide();
                $("#main,#liveToolbarWrap").removeClass("hide");
                if (this.showUploadFile)
                {
                    $("#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionUndo,#liveActionRedo,#liveActionAddPage,#liveActionPlay"
                    ).show();
                }
            }

        },
        SetWelComePageInfo(status,role)
        {
            //console.log("SetWelComePageInfo",status,role);
            if(status==1)
            {
                this.welcomePageInfo.Status=this.$t("Live.WelcomePageInfo_Status_InProgress");//"IN PROGRESS";
                if (this.getIsInstantMeeting() == 1) {
                    this.welcomePageInfo.Title=this.$t("Live.WelcomePageInfo_Title_Meeting");//"MEETING";
                    if (role == 2) {
                        this.welcomePageInfo.YouCan=this.$t("Live.WelcomePageInfo_YouCan");//"As host, you can";
                    }
                    else
                    {
                        this.welcomePageInfo.YouCan=this.$t("Live.WelcomePageInfo_Wait");//"Please waiting for host share document or screen";
                    }
                }
                else
                {
                    this.welcomePageInfo.Title=this.$t("Live.WelcomePageInfo_Title_Lesson");//"LESSON";
                    if (role == 2) {
                        this.welcomePageInfo.YouCan=this.$t("Live.WelcomePageInfo_YouCan");//"As host, you can";
                        if(this.getAttachmentCount()==0)
                        {
                            this.SetStyle4WelcomePage(true);
                            $("#live-welcomepage-createblankpage").hide();
                            $("#live-welcomepage-inviteattendee,#live-welcomepage-sharedocument,#live-welcomepage-sharescreen").show();
                        }
                        
                    }
                    else
                    {
                        this.welcomePageInfo.YouCan=this.$t("Live.WelcomePageInfo_Wait");//"Please waiting for host share document or screen";
                        if(this.getAttachmentCount()==0)
                        {
                            this.SetStyle4WelcomePage(true);
                            $("#live-welcomepage-createblankpage,#live-welcomepage-sharescreen").hide();
                            $("#live-welcomepage-inviteattendee,#live-welcomepage-sharedocument").show();
                        }
                    }
                }
            }
            else
            {
                this.welcomePageInfo.Status=this.$t("Live.WelcomePageInfo_Status_NotStart");//"NOT START";
                if (this.getIsInstantMeeting() == 1) {
                    this.welcomePageInfo.Title=this.$t("Live.WelcomePageInfo_Title_Meeting");//"MEETING";
                    if (role == 2) {
                        this.welcomePageInfo.YouCan=this.$t("Live.WelcomePageInfo_YouCan");//"As host, you can";
                        this.welcomePageInfo.Status=this.$t("Live.WelcomePageInfo_Status_InProgress");//"IN PROGRESS";
                    }
                    else
                    {
                        this.welcomePageInfo.YouCan=this.$t("Live.WelcomePageInfo_Wait");//"Please waiting for host share document or screen";
                    }
                }
                else
                {
                    this.welcomePageInfo.Title=this.$t("Live.WelcomePageInfo_Title_Lesson");//"LESSON";
                    if (role == 2) {
                        this.welcomePageInfo.YouCan=this.$t("Live.WelcomePageInfo_YouCan");//"As host, you can";
                        if(this.getAttachmentCount()==0)
                        {
                            this.SetStyle4WelcomePage(true);
                            $("#live-welcomepage-createblankpage,#live-welcomepage-sharescreen").hide();
                            $("#live-welcomepage-inviteattendee,#live-welcomepage-sharedocument").show();
                            
                        }
                        
                    }
                    else
                    {
                        this.welcomePageInfo.YouCan=this.$t("Live.WelcomePageInfo_Wait");//"Please waiting for host share document or screen";
                        if(this.getAttachmentCount()==0)
                        {
                            this.SetStyle4WelcomePage(true);
                            $("#live-welcomepage-createblankpage,#live-welcomepage-sharescreen").hide();
                            $("#live-welcomepage-inviteattendee,#live-welcomepage-sharedocument").show();
                        }
                    }
                }
            }
        },
        onWelCreateBlankPage(){
            if($("#live-welcomepage").is(":visible"))
            {
                $("#live-welcomepage-createblankpage").find(">BUTTON").attr("disabled",true);
            }
            webapi.addBlankPage(this.GetLessonID()).then(res=>{
                //console.log(res);
                this.$Message.success('Create blank page success!');
                $("#live-welcomepage-createblankpage").find(">BUTTON").attr("disabled",false);
            });
        },
        onWelInviteAttendee()
        {
            this.showInviteUser();
        },
        onWelShareDocument(){
            this.showFileList=true;            
        },
        onWelShareScreen(){
            this.ShareScreen();
        },
        ChangeStyle4Sync(isstart) {
            if (isstart) {
                $("#livePanelTopCtlWrap").hide();
                $("#liveSyncCtlWrap").show();
            } else {
                $("#livePanelTopCtlWrap").show();
                $("#liveSyncCtlWrap").hide();
            }
        },
        ShowAutoClose(seconds = 120) {
            this.autoCloseSecond = seconds;
            this.showAutoCloseDlg = true;
            if (this.autoCloseTimer) {
                clearTimeout(this.autoCloseTimer);
                this.autoCloseTimer = null;
            }
            this.autoCloseTimer = setInterval(() => {
                this.autoCloseSecond--;
                if (this.autoCloseSecond == 0) {
                    this.showAutoCloseDlg = false;
                    clearTimeout(this.autoCloseTimer);
                    this.autoCloseTimer = null;
                    this.clickClose();
                }
            }, 1000);
        },
        Keep4AutoClose() {
            this.showAutoCloseDlg = false;
            if (this.autoCloseTimer) {
                clearTimeout(this.autoCloseTimer);
                this.autoCloseTimer = null;
            }
        },
        StartAutoPlay() {
            AutoPlayDocument(true, this.autoplaySeconds);
            //if (this.selectAudioUrl != "")
            {
                this.NoticePlayThink(this.playSyncInfo.ID, 1);
                this.playAudio(this.selectAudioUrl);
            }
        },
        onDocumentIDChange(docID, pageNum = 1) {
            
            if (this.showUploadFile || this.playSyncInfo.Play == true) {
                return;
            }
            
            if (AttachmentID == docID || docID == "") {
                return;
            }
            this.setSelectFile(docID);
            loger.log("onDocumentIDChange:" + docID + ",pageNum=" + pageNum);
            //AttachmentID = docID;
            var fileid = this.getFileIDFromAttachmentID(docID);
            webapi.getLessonAttachmentDetail(fileid).then(info => {
                if (info == null) return;
                this.reset();
                this.setSelectFile(info.ItemID);

                //AttachmentID = docID;
                ShowPdfInfo();
                if (this.isPDFUrl(info.AttachmentUrl)) {
                    this.attachmentUrl = info.AttachmentUrl;
                    this.ShowPDFEx(
                        info.AttachmentUrl,
                        pageNum,
                        isscucess => {
                            AttachmentID = docID;
                            updateToolbar();
                            if (isscucess == false) {
                                //this.$Message.error(
                                //  {
                                //    content: 'Load file failed!',
                                //    duration: 3
                                //  });
                                GetPageContainer(pageNum).hide();
                            }
                            ShowPdfInfo();
                        },
                        info.AttachmentID
                    );
                } else {
                    this.attachmentUrl = info.AttachmentH5Url;
                    ShowPPT(info.AttachmentH5Url, pageNum, function() {
                        updateToolbar();
                    });
                }
            });
        },
        onModeChange(mode) {
            //loger.log("onModeChange:" + mode);
            var cMode = this.getPreMode(mode);
            if (cMode == this.preShareMode) {
                return;
            }

            this.ViewModeChange(mode, this.preMaxUserID);
        },
        onPageNumberChange(pageNumber,itemid) {
            if (this.showUploadFile || this.playSyncInfo.Play == true ||this.preShareMode != 10) {
                return;
            }
            pageNumber = parseFloat(pageNumber);
            if (
                itemid==0 ||
                pageNumber == 0 ||
                (pageNumber == PageNumber &&
                    GetPageContainer(pageNumber).length > 0 &&
                    GetPageContainer(pageNumber).is(":visible"))
            ) {
                return;
            }
            // if (PDFDownLoadUrl != "") {
            //     return;
            // }
            loger.log("onPageNumberChange:" + pageNumber);

            //Play_ChangePage(null, { page: pageNumber });
            whiteboard.Play({type:2,page:pageNumber});
        },
        onPresenterChange(preUserID) {
            if (
                preUserID == "" ||
                preUserID + "" == "0" ||
                PresenterUserID == preUserID
            ) {
                return;
            }
            loger.log("onPresenterChange:" + preUserID);
            PresenterUserID = preUserID;
            AfterMakePresenter({ presenterId: preUserID });
        },
        onMaxVideoUserIDChange(maxUserID) {
            if (
                maxUserID == "" ||
                maxUserID == "0" ||
                maxUserID == this.preMaxUserID
            ) {
                return;
            }
            loger.log("onMaxVideoUserIDChange:" + maxUserID);
            this.preMaxUserID = maxUserID;
            this.getMediaView().setMaxVideoUserId(maxUserID);
        },
        onMasterLessonStart(d) {
            this.$Modal.confirm({
                title: "Master Lesson Started",
                content: "<p>Do you want to join it?</p>",
                styles: "z-index:9999;",
                loading: true,
                onOk: () => {
                    this.NoticeToMasterLesson(d.lessonId);
                },
                onCancel: () => {
                    //
                }
            });
        },
        isWhiteBoardShow() {
            //return IsInlineWihteBoardShow;
            var result = false;
            if (GetPageContainer(PageNumber).find("div.boardcontainer:visible").length > 0) {
                result = true;
            }
            return result;
        },
        getPreMode(mode) {
            switch (mode + "") {
                case "0":
                    return 10;
                    break;
                case "1":
                    return 30;
                    break;
                case "2":
                    return 31;
                    break;
                case "3":
                    return 20;
                    break;
                default:
                    return 10;
                    break;
            }
        },
        switchTab(evt) {
            var tar = $(evt.currentTarget).find(">span");
            $("#liveActionToolsdiv").hide();
            //var tabContentWrap = $('.liveControlTabWrap');
            //$(tar).parent().parent().find('li').removeClass("livetab-active");
            //$(tar).parent().addClass("livetab-active");
            //tabContentWrap.show();
            closeTabStatus = false;
            //$('#livectlheadbar').show();
            //$('#liveActionMin,#liveActionEnd').hide();
            //liveUserList
            //icon icon-webcam
            var toshowcss = $(tar).attr("class");
            $("#liveActionTools >span").attr("class", toshowcss + "1");

            if ($(tar).attr("id") == "livetab-webcam") {
                $("#liveWebcams").show();
            } else {
                $("#liveWebcams").hide();
            }
            if ($(tar).attr("id") == "livetab-users") {
                $("#liveUserList").show();
            } else {
                $("#liveUserList").hide();
            }
            if ($(tar).attr("id") == "livetab-files") {
                $("#liveFileList").show();
            } else {
                $("#liveFileList").hide();
            }
            if ($(tar).attr("id") == "livetab-setting") {
                $("#liveSetting").show();
            } else {
                $("#liveSetting").hide();
            }
            if ($(tar).attr("id") == "livetab-records") {
                $("#liveRecords").show();
            } else {
                $("#liveRecords").hide();
            }
            if ($(tar).attr("id") == "livetab-chat") {
                $("#liveChat").show();
            } else {
                $("#liveChat").hide();
            }
            LiveBodyResize();
            CheckZoom();
        },
        closeTab() {
            closeTabStatus = true;
            $(".liveControlTabWrap,#livectlheadbar").hide();
            //$('#liveActionMin , #liveActionEnd').show();
            $("#liveTab")
                .find("li")
                .removeClass("livetab-active");
            LiveBodyResize();
            CheckZoom();
        },
        switchFile(evt, isRightClick) {
            //loger.log("switchFile:" + isRightClick);            
            if (!this.showUploadFile) 
            {
                this.$Message.error({content:this.$t("Live.PresenterWarnning"),duration:0,closable:true});
                return;
            }

            if (
                !isRightClick &&
                this._lastSwitchTime &&
                new Date() - this._lastSwitchTime < 500
            ) {
                ////alert("Please wait while file is loading!");
                return;
            }
            this._lastSwitchTime = new Date();
            var tar = evt.currentTarget;
            if ($(tar).attr("ready") == "0") return;
            var itemid = $(tar).attr("id").replace("eventfile-", "");
            if (!isRightClick && $(tar).hasClass("selected") && itemid==AttachmentID) {
                return;
            }
            //ToPointer();
            
            PageNumber=1;
            this.showAttachment(itemid);
            
            this.showFileList = false;

            this.autoRecord("End",()=>{
                this.autoRecord("Enable");
            })
        },
        fileListMenuClick(name, itemid) {
            //console.log("fileListMenuClick:"+name+itemid);
            if(Role!=2)
            {
                this.$Message.error({content:this.$t("Live.NoPermission"),duration:0,closable:true});
                return;
            }
            if(name=="savetofiles")
            {
                var title=this.getAttachmentName(itemid);
                var atmid=this.getAttachmentAttachmentID(itemid);
                webapi.SaveAsFavorite(atmid,title).then(res=>{
                    if(res.RetCode==0)
                    {
                        this.$Message.success('Add to my saved file success!');
                    }
                    else
                    {
                         this.$Message.error({content:res.ErrorMessage,duration:0,closable:true});
                    }
                });
            }
            else if(name=="delete")
            {
                webapi.RemoveAttachmentsFromLesson(itemid).then(res=>{
                    this.$Message.success('Delete it success!');
                    var atmid=this.getAttachmentAttachmentID(itemid);
                    this.removeFileFromList(atmid);
                    this.NoticeRemoveFile(atmid);
                });
            }
        },
        userListMenuClick(name, userid) {
            var selectuser=$("#user-"+userid);
            if(name=="makepresenter")
            {
                if(Role==3)
                {
                    this.$Message.error({content:this.$t("Live.NoPermission"),duration:0,closable:true});
                    return;
                }
                MakePresenter(selectuser.attr("id").replace("user-", ""),selectuser.attr("sid"));
            }
            else if(name=="promotestudent")
            {
                if (GetMeetingCount() >= 7) {
                    this.$Message.error({content:"Too many student!",duration:0,closable:true});
                    return;
                }
                UptoStudent(
                    selectuser.attr("id").replace("user-", ""),
                    selectuser.attr("sid")
                );
            }
            else if(name=="inviteuser")
            {
                this.showInviteUser();
            }
            else if(name=="invitelink")
            {
                this.showInviteLink();
            }
        },
        userListMenuVisibleChange(visible,userid){
            //console.log("userListMenuVisibleChange:"+visible);
            if(visible)
            {
                var tar=$("#user-"+userid);
                if (!tar.hasClass("meeting-user") ||tar.hasClass("offline") ||tar.attr("ispresenter") == "true" ||tar.attr("sid") == "0" ||(this.showUploadFile == false &&(tar.attr("role") == "3" || Role == 3 || Role == 1))
                ) {
                    $("#makepresenter"+userid).hide();
                } else {
                    $("#makepresenter"+userid).show();
                }
                if (tar.attr("ispresenter") != "true" &&tar.attr("sid") == auth.getUserToken() && (Role == 2||Role == 1))
                {
                    $("#makepresenter"+userid).show();
                }

                if (tar.attr("role") == "3" &&!tar.hasClass("offline") && Role == 2)
                {
                    //$("#promotestudent"+userid).show();
                    $("#promotestudent"+userid).hide();
                    $("#makepresenter"+userid).hide();
                } 
                else 
                {
                    $("#promotestudent"+userid).hide();
                }
                if (
                    tar.attr("id") == "user-" + userid &&
                    tar.find("li.meeting-user-name").hasClass("auditor")
                ) {
                    //$("#promotestudent"+userid).show();
                }
            }
        },
        fileListSyncClick(evt, id) {
            console.log("fileListSyncClick:"+evt+id);
        },
        showAttachment(attachmentid,callback) 
        {
            //attachmentid=>itemid
            websocket._currentDocID = attachmentid;
            websocket._currentPageID = PageNumber;

            var eventinfo = null;
            for (var file of this.editingEventFiles) {
                if (file.id == attachmentid) {
                    eventinfo = file;
                }
            }
            if (eventinfo == null) return;
            //$(tar).parent().find(">div.selected").removeClass("selected");
            //$(tar).addClass("selected");
            if($("#live-welcomepage").is(":visible"))
            {
                this.SetStyle4WelcomePage(false);
            }
            if(IsInlineWihteBoardShow)
            {
                IsInlineWihteBoardShow=false;
                Context.ChangeDrawTool4WhiteBoardDiplayChange(false);
                GetPageContainer(PageNumber).find("div.boardcontainer").hide();
            }
            this.setSelectFile(attachmentid);
            if (this.showUploadFile) {
                var senddata = new Object();
                senddata.roleType = "1";
                senddata.actionType = "8";
                senddata.meetingID = (MeetingID+"").toUpperCase();
                senddata.incidentID = MeetingID;
                senddata.eventID = eventinfo.eventid;
                senddata.eventName = eventinfo.eventname;
                //senddata.attachmentID = attachmentid;
                senddata.itemId = attachmentid;
                senddata.attachmentUrl = eventinfo.url;
                senddata.blankPageNumber = eventinfo.blankpagenumber;
                senddata.pageNumber=PageNumber;
                if (this.isPDFUrl(eventinfo.url)) {
                    senddata.isH5 = false;
                } else {
                    senddata.isH5 = true;
                }

                websocket.sendmessage(
                    "",
                    base64encode(utf16to8(JSON.stringify(senddata)))
                );
                websocket.updatemeetingatmid(eventinfo.atmid);
            }
            
            this.reset();
            PageNumber=websocket._currentPageID;
            ToPageNumber=websocket._currentPageID;
            //$("#livePageNumber").val(PageNumber);

            this.attachmentUrl = eventinfo.url;

            //AttachmentID = attachmentid;
            this.ShowPDFEx(
                eventinfo.url,
                PageNumber,
                isscucess => {
                    AttachmentID = attachmentid;
                    updateToolbar();
                    Record();
                    if (isscucess == false) {
                        GetPageContainer(PageNumber).hide();
                    }
                    ShowPdfInfo();
                    if(callback)callback();
                },
                eventinfo.atmid
            );


            return;

            var showpdf=()=>{
                if (this.isPDFUrl(eventinfo.url)) {
                    this.ShowPDFEx(
                        eventinfo.url,
                        PageNumber,
                        isscucess => {
                            updateToolbar();
                            Record();
                            if (isscucess == false) {
                                GetPageContainer(PageNumber).hide();
                            }
                            ShowPdfInfo();
                            if(callback)callback();
                        },
                        eventinfo.atmid
                    );
                } else {
                    ShowPPT(eventinfo.url, PageNumber, function() {
                        updateToolbar();
                        Record();
                    });
                }
            };

            if(false)//(eventinfo.newstatus==1)
            {
                showpdf();
            }
            else
            {
                util.QueryDownloading(eventinfo.newpath,(isSuccess)=>{
                    if(!isSuccess)
                    {
                         this.$Notice.error({
                            title:"Download file error!",
                            desc: "",
                            duration: 4,
                            bottom: 60,
                            left: true
                        });
                        return;
                    }
                    this.setFileNewStatUrl(attachmentid,1,util.GetSignedUrl(eventinfo.newpath+""+eventinfo.fname));
                    showpdf();
                });               
            }
        },
        ShowPDFEx(Url, pageNum, callback,itemid=0)
        {
            //https://peertime-test.oss-cn-shanghai.aliyuncs.com/P49/Attachment/D24472/55ef5553-c671-4737-9043-eb82ceca3e32_1_4K.jpg 404 (Not Found)
            //https://s3-us-west-1.amazonaws.com/txlivedoc1b2/P49/Attachment/D24488/ee404de3-1666-4bfb-ad86-adf1bda7ab8c_1.jpg
            //debugger;
            ShowPDF(Url, pageNum, callback,itemid);
            this.teampFilePath="";
            util.ConvertToNewUrl(Url,(newurl,success,istemporary)=>{
                if(!success)
                {
                    this.$Notice.error({
                        title:"Download file error!",
                        desc: "",
                        duration: 4,
                        bottom: 60,
                        left: true
                    });
                    //ShowPDF(Url, pageNum, callback,itemid);
                }
                else
                {
                    if(istemporary)
                    {
                        this.teampFilePath=Url;
                    }
                    //ShowPDF(newurl, pageNum, callback,itemid);  
                    whiteboard.SetDoumentUrl(pageNum,newurl,itemid);

                }
            });         
        },
        async checkTeampFilePathAndLoad(){
            let self = this;
            let pageN = PageNumber;
            if(this.teampFilePath=="") return;
            console.log("checkTeampFilePath");
            util.ConvertToNewUrl(self.teampFilePath,async(newurl,success,istemporary)=>{   
                if(self.teampFilePath=="") return;
                if(!istemporary)
                {
                    self.teampFilePath="";
                    whiteboard.SetDoumentUrl(pageN,newurl);
                }
            },false);
        },
        async checkTeampFilePath(){
            if(this.teampFilePath=="") return;
            console.log("checkTeampFilePath");
            util.ConvertToNewUrl(this.teampFilePath,async(newurl,success,istemporary)=>{          
                if(this.teampFilePath=="") return;  
                if(!istemporary)
                {
                    this.teampFilePath="";
                    whiteboard.SetDoumentUrl(PageNumber,newurl);
                }
            },false);
        },
        isPDFUrl(url) {
            return true;
            if (!url) return false;
            return (
                url.toLowerCase().indexOf(".pdf") > 0 ||
                url.toLowerCase().indexOf(".jpg") > 0
            );
        },
        setSelectFile(itemid) {
            //console.log("setSelectFile:"+itemid);
            for (var file of this.editingEventFiles) {
                if (file.id == itemid) {
                    file.isselected = true;
                } else {
                    file.isselected = false;
                }
            }
        },
        setFileNewStatUrl(itemid,newstat,url) {
            for (var file of this.editingEventFiles) {
                if (file.id == itemid) {
                    file.newstatus = newstat;
                    if(url) file.url = url;
                } 
            }
        },
        getAttachmentName(itemid) {
            for (var file of this.editingEventFiles) {
                if (file.id == itemid) {
                    return file.name;
                }
            }
            return "";
        },
        getAttachmentCount() {
            return this.editingEventFiles.length;
        },
        getAttachmentAttachmentID(itemid) {
            for (var file of this.editingEventFiles) {
                if (file.id == itemid) {
                    return file.atmid;
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
        getSelectFile() {
            for (var file of this.editingEventFiles) {
                if (file.isselected == true) {
                    return file;
                }
            }
            return null;
        },
        setSelectVideo(attachmentid) {
            for (var file of this.videoFileList) {
                if (file.id == attachmentid) {
                    file.isselected = true;
                } else {
                    file.isselected = false;
                }
            }
        },
        getSelectVideo() {
            for (var file of this.videoFileList) {
                if (file.isselected == true) {
                    return file;
                }
            }
            return null;
        },
        getSelectFileBlankPageNumber() {
            var selectfile = this.getSelectFile();
            if (selectfile == null) {
                return "";
            }
            return selectfile.blankpagenumber;
        },
        getSelectFileAttachmentID() {
            var selectfile = this.getSelectFile();
            if (selectfile == null) {
                return "";
            }
            return selectfile.id;
        },
        reset() {
            PageNumber = 1;
            ToPageNumber = 1;
            CurrentScale = 1;
            //IsRecord = false;
            IsJoinSocketMeeting = false;
            IsInlineWihteBoardShow=false;
            //AttachmentID = "";
            //$("#main").empty();
            this.serverLineID = 0;
        },
        resetData() {
            this.meetingInfo = null;
            this.attachmentUrl = "";
            this.attachmentID = "";
            this.eventId = -1;
            this.isCreating = false;
            this.uploadHeaders = {};
            this.editingEvent = { title: "" };
            this.editingEventFiles = [];
            this.uploadAction = GetAPIUrl();
            this.uploadVideoAction = GetAPIUrl();
            this.fileUploading = false;
            this.uploadPercentage = 0;
            this.uploadTimer = null;
            this.isUploadingFile=false;
            this.showUploadFile = false;
            this.showMedioCtl = true;
            this.isLessonStart = false;
            this.joinMeetingLessonStatus = "0";            
            this.userList = [];
            this.inviteuser = false;
            this.friendList = [];
            this.selectedFriends = [];
            this.filterFriendKey = "";
            this.role = 3;
            this.welcomeMessage = false;
            this.welcomeMessageTeacherBtn = false;
            this.welcomeMessageStudentBtn = false;
            this.welcomeMessageTeacherName = "My";
            this.welcomeMessagePrepareName = "";
            this.welcomeMessageKlassRoomID = "";
            this.welcomeMessageList = [];
            this.welcomeMessageCourse = false;
            this.welcomeMessagePrepareTemp = false;
            this.welcomeMessagePrepareLesson = false;
            this.welcomeMessagePrepareFile = false;
            this.welcomeMessagePrepareNewCourseName = "";
            this.welcomeMessagePrepareNewLectureName = "";
            this.welcomeMessageWarnning =
                "Please wait for your host to start a session";
            this.showWelMsgPrepareMenu = true;
            this.showAutoCloseDlg = false;
            this.autoCloseSecond = 120;
            this.autoCloseTimer = null;
            this.isPrepare = false;
            this.prepareTempValue = "My Course";
            this.prepareTempCourseList = [];
            this.prepareLectureID = 0;
            this.selectCourse = null;
            this.selectLecture = null;
            this.selectStudent = null;
            this.studentList = [];
            this.courseList = [];
            this.lectureList = [];
            this.preShareMode = 10;
            this.preMaxUserID = "0";
            this.mediaSettingDlg = false;
            this.mediaSettingCallback = null;
            this.kloudcallNotifiation = false;
            this.kloudcallNotifiationTeacher = false;
            this.kloudCallNumber = "";
            this.kloudCallNumberTeacher = "";
            this.serverLineID = 0;
            this.agoraErrorTime = [];
            this.toshowmediasetting = "MediaSetting";
            this.speakingTimer = null;
            this.lastVol = 0;
            this.getIsShowUploadVideo = true;
            this.uploadVideoTimer = null;
            this.videoUploading = false;
            this.videoPlayTimer = null;
            this.uploadVideoPercentage = 0;
            this.videoFileList = [];
            this.videoList = [];
            this.lastAudioDisabled = -1;
            this.selectVideo = false;
            this.selectVideoKey = "";
            this.selectVideoPageIndex = 0;
            this.selectVideoItemTotal = 100;
            this.selectedVideo = "";
            this.downloadPercent = 0;
            this.showDownload = false;
            this.thinkShow= false;
            this.thinkShowSyncBtn= false;
            this.thinkInfo={ID:0,Title:"",EnableBackGround:false,EnableSelectVoice:false,EnableRecord:false,BackGroundItemID:0,BackGroundTitle:"",BackGroundTime:"",SelectVoiceItemID:0,SelectVoiceTitle:"",SelectVoiceTime:"",RecordVoiceItemID:0,
            SyncStatus:0,SyncDate:"",CreateEditStat:0,RecordTitle:"",RecordTime:"",EnableVoice:false,EnableVoice:false};
            this.thinkList= [];
            this.thinkShareMode=false;
            this.thinkMode=false;
            this.teacherInLessonID=0;
            this.checkExist={ show: false, isTeacher: false ,needSave:true};
        },
        getShowAttachment(items) {
            if (AttachmentID != "") {
                for (var item of items) {
                    if (AttachmentID + "" == item.ItemID + "") {
                        return item;
                    }
                }
            }
            for (var item of items) {
                if (item.Status == 0 && item.AttachmentUrl != "") {
                    return item;
                }
            }
            return null;
        },
        showfiles(event) {
            // console.log("showfiles:");
            // console.log(event);
            let blankpageindex=1;
            for (let i = 0; i < event.AttachmentList.length; i++) {
                let lineItem = event.AttachmentList[i];
                if (lineItem.Status != 0) {
                    continue;
                }
                if (lineItem.AttachmentID && lineItem.AttachmentUrl) {
                    let eventFile = this._lineItem2EventFile(lineItem, false,blankpageindex);
                    if(lineItem.FileID==-1)
                    {
                        blankpageindex++;
                    }
                    if (!this.isFileExist(eventFile.id)) {
                        this.editingEventFiles.push(eventFile);
                    } else {
                        this.setFileToReady(
                            eventFile.atmid,
                            lineItem.AttachmentUrl
                        );
                    }
                }
            }
            if(this.editingEventFiles.length>0)
            {
                this.SetStyle4WelcomePage(false);
            }

            this.setUploadUrl();
            //$("#liveFileList").find(">div.live-file").addClass("selected");
        },
        showVideos(isupdate = false) {
            //loger.log("showVideos");
            if (isupdate) {
                webapi.getRoomVideoList(this.GetLessonID(), obj => {
                    if (obj == null) return;
                    for (var item of obj) {
                        var isexist = false;
                        for (var exitem of this.videoFileList) {
                            if (exitem.id == item.AttachmentID) {
                                isexist = true;
                                break;
                            }
                        }
                        if (isexist) {
                            continue;
                        }
                        let videoinfo = {
                            title: item.FileName,
                            url: item.AttachmentUrl,
                            id: item.AttachmentID,
                            stat: item.Status,
                            isselected: false
                        };
                        this.videoFileList.push(videoinfo);
                    }
                });
            } else {
                this.videoFileList = [];
                webapi.getRoomVideoList(this.GetLessonID(), obj => {
                    if (obj == null) return;
                    for (var item of obj) {
                        let videoinfo = {
                            title: item.FileName,
                            url: item.AttachmentUrl,
                            id: item.AttachmentID,
                            stat: item.Status,
                            isselected: false
                        };
                        this.videoFileList.push(videoinfo);
                    }
                    //loger.log(this.videoFileList);
                });
            }
        },
        switchVideo(evt) {
            if (!this.showUploadFile) 
            {
                this.$Message.error({content:this.$t("Live.PresenterWarnning"),duration:0,closable:true});
                return;
            }
            var tar = evt.currentTarget;
            //alert(tar.id);
            //if ($(tar).hasClass("selected"))
            //{
            //  return;
            //}
            ToPointer();
            var attachmentid = $(tar)
                .attr("id")
                .replace("videofile-", "");
            this.setSelectVideo(attachmentid);
            this.ShareVideo(attachmentid);

            var videoitem = this.getSelectVideo();
            if (videoitem != null) {
                this.showVideo(videoitem);
            }
        },
        playVideoTag(attachmentid) {
            webapi.getFavoriteAttachmentDetail(attachmentid).then(d => {
                //console.log(d);//d.FileType ItemID  AttachmentUrl
                //this.getMediaView().StartAudioMixing("https://www.peertime.cn/peertime/TezCadeySeve.mp3");
                //return;
                if (d.FileType == 5) {
                    this.playSyncAction(d.AttachmentUrl, d.ItemID);
                    return;
                }
                //alert(d.AttachmentUrl);
                $("#liveplayvideo")
                    .css({
                        width: getViewWidth(),
                        height: getViewHeight(),
                        "z-index": 10002,
                        position: "absolute",
                        top: "0px",
                        left: "0px"
                    })
                    .show();
                //var html = '<div id="videoPlayerMask" style="z-index:10001; position:absolute;top:0px; left:0px; width:100%;height:100%; background-color:#ccc; opacity:0.3;"></div>';
                //$(document.body).append(html);
                //this.showVideo({ id: d.AttachmentID, url: "https://peertime-test.oss-cn-shanghai.aliyuncs.com/P49/Attachment/D15900/222_baofeng.mp4" });
                util.ConvertToNewUrl(d.AttachmentUrl,(newurl)=>{
                    this.showVideo({ id: d.AttachmentID, url: newurl });
                    this.getVideoPlayer().setShowClose(this.showUploadFile);
                    this.getVideoPlayer().setCanControl(this.showUploadFile);
                    this.getVideoPlayer().setVideoType(1);
                });
                
            });
        },
        playThinkAction(id,isLesson=false) {
            if(!id)
            {
                console.error("Error:10145");
                return;
            }
            this.thinkCurrentID=id;
            this.isPlayLesson=isLesson;
            whiteboard.SetRecord(true);
            this.ChangeStyle4Sync(true);
            whiteboard.Clear();// ClearPath();
            
            this.$refs.syncplayer.SetWebSocket(websocket);
            this.$refs.syncplayer.playThinkAction(id);
        },
        getAudioCurrentTime() {
            if(this.autoRecordInfo.IsRecord==true && this.autoRecordInfo.Recorder!=null)
            {
                return this.autoRecordInfo.Recorder.getCurrentTime();
            }
            if(this.$refs.syncplayer)           
                return this.$refs.syncplayer.getAudioCurrentTime();
            else
                return -1;
        },
        playAudioData(base64) {
            if (this.showUploadFile) return;
            if (base64 == "") return;
            var obj = JSON.parse(utf8to16(base64decode(base64)));
            if (obj.stat == 1) {
                //play
                this.playSyncFromTeacher(obj);
                taggleMinControlWindow(false);
            } else if (obj.stat == 2) {
                //pause
                var newobj = util.Clone(obj);
                newobj.stat = 1;
                this.playSyncFromTeacher(newobj);
                setTimeout(()=>{
                    this.playSyncFromTeacher(obj);
                },1500);
                
            } else if (obj.stat == 3) {
                //resume
                var newobj = util.Clone(obj);
                newobj.stat = 1;
                this.playSyncFromTeacher(newobj);
            } else if (obj.stat == 0) {
                //stop
                this.playSyncFromTeacher(obj);
            } else if (obj.stat == 4) {
                //playing
                var newobj = util.Clone(obj);
                newobj.stat = 1;
                this.playSyncFromTeacher(newobj);
                setTimeout(()=>{
                    obj.time+=1500;
                    this.playSyncFromTeacher(obj);
                },1500);
                taggleMinControlWindow(false);
            }
        },
        playSyncFromTeacher(obj) {
            this.$refs.syncplayer.playSyncFromTeacher(obj);
        },
        onPlayBaseAction(data){
            if (typeof (data) == "string")
            {
                data = JSON.parse(data);
            }
            if(data.actionType && data.actionType==19){
                this.onVideoPlayInfoChange(data);
            }
            else  if(data.actionType && data.actionType==8){
                //console.log(data);
                this.onAttachmentChangeFromOther({attachmentUrl:data.attachmentUrl,itemId:data.itemId,pageNumber:data.pageNumber});
            }
            else{
                whiteboard.Play(data);
            }
            
        },        
        onRecordSyncStart()
        {
            this.ChangeStyle4Sync(true);
        },
        onRecordSyncEnd(){
            this.ChangeStyle4Sync(false);
            whiteboard.SetRecord(this.showUploadFile);
        },
        onPlaySyncStart(){
            this.ChangeStyle4Sync(true);
            this.ChangeDrawTool4WhiteBoardDiplayChange(true);
            whiteboard.SetCanEdit(false);
            this.isPause=false;
            this.isPlay=true;
            $("#livePanelTopCtlWrap").hide();
        },
        onPlaySyncGo(time){
            //console.log("onPlaySyncGo:"+time);
            this.isPause=false;
            //whiteboard.Clear();
            //this.ShowSyncObject(PageNumber,false);
            // webapi.GetSyncPageActionsByTime(this.thinkCurrentID,time).then(res=>{           
            //     for (var action of res.Actions) 
            //     {
            //         this.onPlayBaseAction(utf8to16(base64decode(action.Data)));
            //     }
            // });
        },
        onPlaySyncPause(){
            //console.log("onPlaySyncPause");
            //this.isPause=true;
            //this.ShowSyncObject(PageNumber,false);
        },
        onPlaySyncTo(time,pause){
            //console.log("onPlaySyncTo:"+time+",isPause:"+pause);
            if(this.isPlayLesson)
            {
                webapi.getRecordLessonPageActions(this.thinkCurrentID,time).then(res=>{
           
                    if(res.AttachmentID!=this.getAttachmentAttachmentID(AttachmentID))
                    {
                        PageNumber=res.PageNumber;
                        this.showAttachment(this.getAttachmentItemID(res.AttachmentID),()=>{
                            for (var action of res.Actions) 
                            {
                                this.onPlayBaseAction(utf8to16(base64decode(action.Data)));
                            }
                        });
                    }
                    else if(res.PageNumber!=PageNumber)
                    {
                        this.showPageLine=false;
                        whiteboard.ToPage(res.PageNumber,(issuccess,pageno)=>{
                            whiteboard.Clear();
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
                                webapi.getAttachmentOrSyncPageObject(res.PageNumber,0,this.thinkCurrentID).then(infoarr => 
                                {
                                    if (infoarr == null) return;
                                    for (var txt of infoarr) 
                                    {
                                        this.onPlayBaseAction(txt);
                                    }
                                });
                            }
                        });
                    }
                    else
                    {
                        whiteboard.Clear();
                        for (var action of res.Actions) 
                        {
                            this.onPlayBaseAction(utf8to16(base64decode(action.Data)));
                        }
                        webapi.getAttachmentOrSyncPageObject(res.PageNumber,0,this.thinkCurrentID).then(infoarr => 
                        {
                            if (infoarr == null) return;
                            for (var txt of infoarr) 
                            {
                                this.onPlayBaseAction(txt);
                            }
                        });
                    }
                });
            }   
            else
            {
                webapi.GetSyncPageActionsByTime(this.thinkCurrentID,time).then(res=>{
                
                    if(res.PageNumber!=PageNumber)
                    {
                        this.showPageLine=false;
                        whiteboard.ToPage(res.PageNumber,(issuccess,pageno)=>{
                            whiteboard.Clear();
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
                                webapi.getAttachmentOrSyncPageObject(res.PageNumber,0,this.thinkCurrentID).then(infoarr => 
                                {
                                    if (infoarr == null) return;
                                    for (var txt of infoarr) 
                                    {
                                        this.onPlayBaseAction(txt);
                                    }
                                });
                            }
                        });
                    }
                    else
                    {
                        whiteboard.Clear();
                        for (var action of res.Actions) 
                        {
                            this.onPlayBaseAction(utf8to16(base64decode(action.Data)));
                        }
                        webapi.getAttachmentOrSyncPageObject(res.PageNumber,0,this.thinkCurrentID).then(infoarr => 
                        {
                            if (infoarr == null) return;
                            for (var txt of infoarr) 
                            {
                                this.onPlayBaseAction(txt);
                            }
                        });

                    }
                });
            }
        },
        onPlaySyncEnd(){
            this.isPause=false;
            this.isPlay=false;
            this.isPlayLesson=false;
            this.ChangeStyle4Sync(false);
            this.ChangeDrawTool4WhiteBoardDiplayChange(false);
            whiteboard.SetCanEdit(this.showUploadFile);
            $("#livePanelTopCtlWrap").show();
            whiteboard.ClearAll();
            whiteboard.SetRecord(this.showUploadFile);
            this.ShowSyncObject(PageNumber,false);
        },
        ShowThinkView(){
            $("#liveMoreControls").hide();
            $("#liveThink").show();
            var pop=$("#liveMoreAction").parent().parent().parent().parent().parent();
            var top=parseInt(pop.css("top").replace("px"));
            var left=parseInt(pop.css("left").replace("px"));
            pop.css({"top":(top-$("#liveThink").height()+130)+"px","left":(left-120)+"px"});
        },
        ShowRecordLessonView(){
            $("#liveMoreControls").hide();
            $("#liveRecordLesson").show();
            var pop=$("#liveMoreAction").parent().parent().parent().parent().parent();
            var top=parseInt(pop.css("top").replace("px"));
            var left=parseInt(pop.css("left").replace("px"));
            pop.css({"top":(top-$("#liveRecordLesson").height()+130)+"px","left":(left-120)+"px"});
            this.initRecordLessonList();
        },
        liveRecordLessonClick(evt){
            //console.log(evt);
            if($("#liveRecordLessonCtl").hasClass("disable"))
            {
                return;
            }
            var img=$("#liveRecordLessonCtl").find("IMG");
            if(img.attr("src").indexOf("autorecord_start.svg")>-1)
            {
                this.autoRecord("Start");
            }
            else
            {                
                this.autoRecord("Pause");
            }
        },
        onThinkHide(){
            
            //$("#liveThink").hide();
            if(this.isLessonFinished)
            {
                $("#liveRecordLesson").show();
                 $("#liveMoreControls").hide();
            }
            else
            {
                $("#liveRecordLesson").hide();
                $("#liveMoreControls").show();
            }
        },
        onMoreActionShow(){
            if(this.isLessonFinished)
            {
                this.initRecordLessonList();
                 $("#liveRecordLesson").show();
                 $("#liveMoreControls").hide();
            }
            else
            {
                $("#liveRecordLesson").hide();
                $("#liveMoreControls").show();
            }
        },
        onThinkShow(){
            this.thinkInit();
            // if(this.thinkMode || this.thinkShareMode)
            // {
            //     this.ShowThinkView();
            // }
        },
        thinkInit() {
            this.thinkList=[];
            var selectfile=this.getSelectFile();
            if(selectfile==null)
            {
                return;
            }
            if(this.thinkMode && !this.getIsShareMode())
            {
                webapi.GetSoundtrackList(selectfile.atmid).then(list=>{
                    if(!list) return;
                    for(var item of list)
                    {
                        var showitem=new Object();
                        showitem.id=item.SoundtrackID;
                        showitem.title=item.Title;
                        showitem.user=item.UserName;//item.Title;
                        if(!item.Duration)
                        {
                            showitem.time="";
                        }
                        else{
                            showitem.time=`(${item.Duration})`;
                        }
                        var ct = new Date();
                        ct.setTime(item.CreatedDate);
                        let showCT = ct.Format("yyyy-MM-dd hh:mm:ss");
                        showitem.date=showCT;
                        
                        showitem.face=item.AvatarUrl;
                        this.thinkList.push(showitem);
                    }
                });                
            }
            else//in lesson mode
            {
                webapi.GetLessonSoundtrackList(this.GetLessonID(),selectfile.atmid).then(list=>{
                    if(!list) return;
                    for(var item of list)
                    {
                        var showitem=new Object();
                        showitem.id=item.SoundtrackID;
                        showitem.title=item.Title;
                        showitem.user=item.UserName;//item.Title;
                        if(!item.Duration)
                        {
                            showitem.time="";
                        }
                        else{
                            showitem.time=`(${item.Duration})`;
                        }
                        
                        showitem.face=item.AvatarUrl;
                        this.thinkList.push(showitem);
                    }
                });
                webapi.GetSoundtrackListCount(selectfile.atmid).then(res=>{
                   this.thinkListCount=res;
                    
                });
            }
        },
        initRecordLessonList(callback){
            this.recordLessonList=[];
             webapi.GetLessonSoundtrackList(this.GetLessonID(),0).then(list=>{
                    if(!list) 
                    {
                        if(callback) callback(0);
                        return;
                    }
                    for(var item of list)
                    {
                        var showitem=new Object();
                        showitem.id=item.SoundtrackID;
                        showitem.title=item.Title;
                        showitem.user=item.UserName;//item.Title;
                        if(!item.Duration)
                        {
                            showitem.time="";
                        }
                        else{
                            showitem.time=`(${item.Duration})`;
                        }
                        
                        showitem.face=item.AvatarUrl;
                        this.recordLessonList.push(showitem);
                    }
                    if(callback) callback(this.recordLessonList.length);
                });
        },
        recordLessonClick(evt,id){
            this.playThinkAction(id,true);
        },
        recordLessonShareClick(evt,id){
            var url=location.origin.toLowerCase();
            url+="/meeting/"+id;
             navigator.clipboard.writeText(url).then(()=>{
                 this.$Message.info({content: this.$t("Live.CopySyncUrlSuccess"), duration: 3});
            },()=>{
                 this.$Message.error({content:this.$t("Live.CopySyncUrlFailed")+"\n\n"+url,duration:0,closable:true});
            });
        },
        thinkOnCreate(evt){
            var selectfile=this.getSelectFile();
            if(selectfile==null)
            {
                this.$Message.error({content:"no file",duration:0,closable:true});
                return;
            }
            whiteboard.SetRecord(true);
            this.$refs.syncplayer.SetWebSocket(websocket);
            this.$refs.syncplayer.CreateSync(parseInt(selectfile.atmid));

        },
        thinkOnStartMeeeting(evt){
            webapi.UpgradeToNormalLesson(this.GetLessonID()).then(res=>{
                this.SetButton4ViewLesson(false);
                this.thinkMode=false;
                this.StartLesson4Head();
            });
            
        },             
        thinkMenuClick(name, id) {
            //alert(name + "," + id);
            if (name == "play") {
                if(!this.showUploadFile)
                {
                    this.$Message.error({content:this.$t("Live.PresenterWarnning"),duration:0,closable:true});
                    return;
                }
                //to do
                this.playThinkAction(id);
            } else if (name == "share") {
                //to do
                //navigator.clipboard.writeText(this.invitelinkUrl);
                var selectfile=this.getSelectFile();
                if(selectfile==null)
                {
                    return;
                }
                let shareFile={attachmentId:selectfile.atmid,attachmentName:selectfile.name,attachmentUrl:selectfile.detail.AttachmentUrl};

                //分享文档
                if(!IsKloudSync()){
                    this.changeShareDoc(shareFile);
                }else{
                    this.changeKloudsyncShareDoc(shareFile);
                }
                // webapi.GetShareDocumentKey(selectfile.atmid,0,selectfile.name).then(res=>{
                //     var url=location.href.toLowerCase();
                //     url=url.substr(0,url.indexOf("?"));
                //     url+="?share="+res;
                //     navigator.clipboard.writeText(url);
                //     alert("Share Url has been copied to clipboard!");
                // });               
            } else if (name == "link") {
           var url=location.origin.toLowerCase();
            url+="/sync/"+id;
             navigator.clipboard.writeText(url).then(()=>{
                 this.$Message.info({content: this.$t("Live.CopySyncUrlSuccess"), duration: 3});
            },()=>{
                this.$Message.error({content:this.$t("Live.CopySyncUrlFailed")+"\n\n"+url,duration:0,closable:true});
            });
            }
            else if (name == "edit") {
                if(!this.showUploadFile)
                {
                    this.$Message.error({content:this.$t("Live.PresenterWarnning"),duration:0,closable:true});
                    return;
                }
                var selectfile=this.getSelectFile();
                this.$refs.syncplayer.EditSync(id,parseInt(selectfile.atmid));
            }else if (name == "delete") {
                if(!this.showUploadFile)
                {
                     this.$Message.error({content:this.$t("Live.PresenterWarnning"),duration:0,closable:true});
                    return;
                }                
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
        selectMoreThinkOK(){
            if (this.selectMoreThink.Selected.length < 1) {
                return;
            }
            webapi.AddSoundtrack2Lesson(this.GetLessonID(),this.selectMoreThink.Selected).then(res=>{
                this.selectMoreThink={Show:false,List:[],Selected:[]};
            });
            
        },
        selectMoreThinkCancel(){
            this.selectMoreThink.Show=false;
        },
        selectMoreThinkClick(evt){
            this.selectMoreThink.Show=true;
            this.initMoreThink();
        },
        initMoreThink(){
            this.selectMoreThink.List=[];
            var selectfile=this.getSelectFile();
            if(selectfile==null)
            {
                return;
            }
            webapi.GetSoundtrackList(selectfile.atmid).then(list=>{
                if(!list || list.length<1) return;
                for(var item of list)
                {
                    var showitem=new Object();
                    showitem.id=item.SoundtrackID;
                    showitem.title=item.Title;
                    showitem.user=item.UserName;//item.Title;
                    showitem.time=item.Duration;//title=item.Title;
                    this.selectMoreThink.List.push(showitem);
                }
            });
        },
        onSelectedMoreThinkClick(evt){
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
        uploadAutoRecordAudio(data,attachmentid,fileid,soundid,afterupload,lessonid,recordid,syncDuration,duration="",merge=false) {
            //console.log("uploadAutoRecordAudio");
            var servername=GUID()+".wav";
            var name=this.autoRecordInfo.PathInfo.Path+"/"+servername;
            //console.log(name);
            this.$refs.uploadfile.UploadCloud(data,name,async (guid,bucketInfo)=>{
                //console.log("upload wav:"+soundid);
                if(merge)
                {
                    this.uploadRecord.uploadPercent=100;
                }
                var obj = new Object();
                obj.LessonID =lessonid;
                obj.DocItemID =attachmentid;
                //obj.AudioItemID =this.lastSycnAudioItemID;
                obj.BucketInfo =bucketInfo;
                obj.Duration =duration;
                obj.SyncDuration=syncDuration;
                obj.FileName =servername;
                obj.FileID  =fileid;
                obj.SoundtrackID =soundid;
                webapi.UploadSoundtrackNewFile(obj).then(()=>{                    
                    if(merge)
                    {
                        //console.log("MergeSoundtrack",lessonid,recordid,MeetingID);
                        webapi.MergeSoundtrack(lessonid,recordid,MeetingID);
                        this.uploadRecord.showUploadRecordProcess=false;
                    }
                    if(afterupload)afterupload();
                });
                webapi.notifyUploaded({Documents:[{Key:name,Bucket:bucketInfo}]});
                
            },()=>{},(process,guid)=>{
                //console.log("process:"+process);
                if(merge)
                {
                    //uploadRecord:{showUploadRecordProcess:false,uploadPercent:0,uploadFileName:""}
                    if(process==-1)
                    {
                        this.uploadRecord.showUploadRecordProcess=true;
                    }
                    else
                    {
                        this.uploadRecord.uploadPercent=process;
                    }
                }
            });

            return;
            var xhr = new XMLHttpRequest();
            xhr.onload = event => {
                var issuccess = false;
                try {
                    var res = JSON.parse(xhr.responseText);
                    if (res && res.RetCode == 0) {
                        issuccess = true;
                        webapi.UpdateSoundAudioAttachmentID(soundid,res.RetData.AttachmentID).then(res=>{
                            //console.log("MergeSoundtrack");
                            webapi.MergeSoundtrack(lessonid,recordid,MeetingID);
                            if(afterupload)afterupload();
                        });                        
                    }
                } catch (ex) {}
                xhr.onload = null;
                xhr = null;
                
            };
            var title =auth.getUserName() +" " +new Date().Format("yyyy-MM-dd hh:mm:ss") +".wav";
            var url =GetAPIUrl() +"EventAttachment/UploadRecordedVoice4Web?Title=" +encodeURIComponent(base64encode(utf16to8(title))) +"&Description=RecordVoice";
            url += "&LessonID=" + lessonid;
            url += "&DocItemID=" + attachmentid;
            url += "&AudioItemID=" + soundid;

            var formdata = new FormData();
            formdata.append("file", data);
            xhr.open("POST", url, true);
            xhr.setRequestHeader("UserToken", auth.getUserToken());
            xhr.send(formdata);
        },
        async autoRecord(action,callback,afterupload){
            //autoRecordInfo:{IsRecord:false,Recorder:null,SoundIds:[],AttachmentID:0}       

            if (this.isLessonStart == false || this.isLessonFinished==true) {
                if(callback)callback();
                if(afterupload)afterupload();
                return;
            }
            //console.log("autoRecord:"+action);
            if(action=="Start" || action=="Enable")
            {
                if(!this.showUploadFile)
                {
                    //console.log(10217);
                    return;
                }
                var selectfile=this.getSelectFile();
                if(selectfile==null)
                {
                    //console.log(10222);
                    return;
                }

                if(action=="Enable")
                {
                    $("#liveRecordLessonCtl").removeClass("disable");
                    // if(this.autoRecordInfo.LastRecordStat==false)
                    // {
                    //     return;
                    // }
                }
                this.autoRecordInfo.LastRecordStat=true;
                if(this.autoRecordInfo.IsRecord==true)
                {
                    //console.log(10236);
                    return;
                }
                
                if(this.autoRecordInfo.IsRecord==false && this.autoRecordInfo.Recorder!=null)
                {
                    //$("#liveRecordLessonCtl").show();//#liveRecordTip,
                    var img=$("#liveRecordLessonCtl").find("IMG");
                    img.attr("title","Recording");
                    img.attr("src",img.attr("src").replace("autorecord_start.svg","autorecord_pause.svg"));
                    this.autoRecordInfo.IsRecord=true;
                    this.autoRecordInfo.Recorder.start();
                    whiteboard.TriggerPageChange();
                    return;
                }
                
                //$("#liveRecordLessonCtl").show();//#liveRecordTip,
                var img=$("#liveRecordLessonCtl").find("IMG");
                img.attr("title","Recording");
                img.attr("src",img.attr("src").replace("autorecord_start.svg","autorecord_pause.svg"));
                //console.log(selectfile);
                 var info = new Object();
                info.AttachmentID=parseInt(selectfile.atmid);
                info.Title=auth.getUserName()+" - " + (new Date()).Format("yyyy-MM-dd hh:mm:ss");
                info.EnableBackgroud=0;
                info.EnableSelectVoice=0;
                info.EnableRecordNewVoice=1;
                info.Type=1;
                info.LessonID=0;
                info.ItemID=0;
                info.RecordingID=this.autoRecordInfo.RecordID;

                var res = await webapi.CreateSoundtrack(info);
                if(!res.RetData || !res.RetData.SoundtrackID)
                {

                    return;
                }
                var trackid=res.RetData.SoundtrackID;
                websocket.audiosync(1, trackid);
                this.autoRecordInfo.PathInfo=res.RetData.PathInfo;

                this.autoRecordInfo.IsRecord=true;
                this.autoRecordInfo.AttachmentID=info.AttachmentID;
                this.autoRecordInfo.SoundIds.push(trackid);
                this.autoRecordInfo.Recorder= this.getMediaView().StartRecord();
                
                //Record_changepage();
                //Record_view();
                whiteboard.TriggerPageChange();
                whiteboard.TriggerViewChange();
            }
            else if(action=="Pause" || action=="Disable")
            {
                if(action=="Disable")
                {
                    this.autoRecordInfo.LastRecordStat=this.autoRecordInfo.IsRecord;
                }
                if(this.autoRecordInfo.IsRecord==true && this.autoRecordInfo.Recorder!=null)
                {
                    this.autoRecordInfo.Recorder.stop();
                }
                this.autoRecordInfo.IsRecord=false;
                //$("#liveRecordTip").hide();
                if(action=="Disable")
                {
                    $("#liveRecordLessonCtl").addClass("disable");
                    $("#liveRecordLessonCtl").find("IMG").attr("title","disable");
                }
                else
                {
                    var img=$("#liveRecordLessonCtl").find("IMG");
                    img.attr("title","Paused");
                    img.attr("src",img.attr("src").replace("autorecord_pause.svg","autorecord_start.svg"));
                }
            }
            else if(action=="Resume")
            {
                if(this.autoRecordInfo.IsRecord==true && this.autoRecordInfo.Recorder!=null)
                {
                    this.autoRecordInfo.Recorder.start();
                }
                this.autoRecordInfo.IsRecord=true;
            }
            else if(action=="End" || action=="Merge")
            {
                this.autoRecordInfo.LastRecordStat=this.autoRecordInfo.IsRecord;
                if(this.autoRecordInfo.Recorder!=null)
                {
                    if(this.autoRecordInfo.IsRecord==true)
                    {
                        this.autoRecordInfo.IsRecord=false;
                        this.autoRecordInfo.Recorder.stop();
                    }
                    //websocket.audiosync(0, this.autoRecordInfo.SoundIds[this.autoRecordInfo.SoundIds.length-1],this.autoRecordInfo.Recorder.getCurrentTime());
                    var lessonid=this.GetLessonID();
                    var nDuration=this.autoRecordInfo.Recorder.getCurrentTime();
                    var fileid=this.autoRecordInfo.PathInfo.FileID;
                    this.autoRecordInfo.Recorder.getBlobData(data => {
                            this.autoRecordInfo.Recorder.clear();
                            this.autoRecordInfo.Recorder=null;
                            try
                            {
                            this.getMediaView().StopRecord(); 
                            }
                            catch(ex){}
                            
                            this.uploadAutoRecordAudio(data,this.autoRecordInfo.AttachmentID,fileid,this.autoRecordInfo.SoundIds[this.autoRecordInfo.SoundIds.length-1],()=>
                                {
                                    if(afterupload)afterupload();
                                },lessonid,this.autoRecordInfo.RecordID,nDuration,util.FormatMediaTime(Math.round(nDuration/1000),1),action=="Merge");
                            if(callback)callback();
                        });
                    this.autoRecordInfo.IsRecord=false;
                    var img=$("#liveRecordLessonCtl").find("IMG");
                    img.attr("src",img.attr("src").replace("autorecord_pause.svg","autorecord_start.svg"));
                    return;
                }
                else
                {
                    if(afterupload)afterupload();
                }
                this.autoRecordInfo.IsRecord=false;
                //$("#liveRecordLessonCtl").hide();//#liveRecordTip,
                var img=$("#liveRecordLessonCtl").find("IMG");
                img.attr("src",img.attr("src").replace("autorecord_pause.svg","autorecord_start.svg"));
                if(callback)callback();
                
            }
        },
        onSelectMediaTabChange(name) {
            //alert(name);
            $("#videoList_" + this.selectedVideo).prop("checked", false);
            this.selectedVideo = "";
            if (name == "video") {
                this.selectMediaTitle = this.$t("Live.SelectVideo");
                webapi.getVideoList(0, -1).then(d => {
                    this.videoList = [];
                    this.selectVideoItemTotal = d.Count;
                    for (let item of d.List) {
                        this.videoList.push(this.videoList2ShowList(item));
                    }
                });
            } else {
                this.selectMediaTitle = this.$t("Live.SelectAudio");
                webapi.getAudioList(-1, -1).then(d => {
                    this.videoList = [];
                    this.selectVideoItemTotal = d.Count;
                    for (let item of d.List) {
                        this.videoList.push(this.videoList2ShowList(item));
                    }
                });
            }
        },
        showVideo(videoitem) {
            this.getVideoPlayer().ShowVideo(videoitem);
            this.getVideoPlayer().setCanControl(this.showUploadFile);
            this.getVideoPlayer().setShowClose(false);
            this.getVideoPlayer().setVideoType(0);
            return;
            if (videoitem == null) {
                return;
            }
            var videoele = $("#liveplayvideo").find(">video");
            videoele.attr("src", videoitem.url);
            videoele.attr("autoplay", "autoplay");
            if (this.showUploadFile) {
                videoele.attr("controls", "controls");
            } else {
                videoele.removeAttr("controls");
            }
        },
        getVideoPlayer() {
            return this.$refs.livevideoplayer;
        },
        videoOnClose() {
            //$("#videoPlayerMask").remove();
            $("#liveplayvideo").hide();
            if (!this.showUploadFile) return;
            this.NoticePlayVideoInfo(2, 0, 0, "", 1);
            this.ChangeDrawTool4WhiteBoardDiplayChange(false);
            this.$refs.syncplayer.afterPlayVideo();
        },
        videoOnPlay(ctime, vid, url, type) {
            //loger.log("videoOnPlay");
            if (!this.showUploadFile) return;
            //var vid = this.getSelectVideo().id;
            this.NoticePlayVideoInfo(1, ctime, vid, url, type);
            this.ChangeDrawTool4WhiteBoardDiplayChange(true);
            this.$refs.syncplayer.beforePlayVideo();
        },
        videoOnPlaying(ctime, vid, url, type) {
            //var vid = this.getSelectVideo().id;
            if (!this.showUploadFile) return;
            //loger.log("videoOnPlaying");
            this.NoticePlayVideoInfo(1, ctime, vid, url, type,0);
            this.disableAudioForPlayVideo(1);
        },
        videoOnPause(ctime, vid, url, type, isFinish) {
            //loger.log("videoOnPause");
            if (!this.showUploadFile) return;
            //var vid = this.getSelectVideo().id;
            if (isFinish) {
                $("#liveplayvideo").hide();
                this.NoticePlayVideoInfo(2, 0, 0, "", 1);
                //loger.log(this.preShareMode);
                if (this.preShareMode != 10) {
                    this.ShareDocument(true);
                }
            } else {
                this.NoticePlayVideoInfo(0, ctime, vid, url, type);
            }
            this.disableAudioForPlayVideo(0);
        },
        disableAudioForPlayVideo(disable) {
            if (this.lastAudioDisabled == disable) return;
            this.lastAudioDisabled = disable;
            if (disable == 1) {
                this.getMediaView().DisableAllAudio();
            } else {
                if (this.serverLineID == 0) {
                    this.getMediaView().EnableAllAudio();
                }
            }
        },
        uploadVideo2SaveFileInputChange() {
            //loger.log("uploadVideo2SaveFileInputChange");
            var input = $("#uploadVideo2SaveFileInput")[0];
            //alert(input.files.length);
            if (input.files.length == 0) {
                return;
            }
            var file = input.files[0];
            var filename = file.name;
            util.GetMD5(file).then(md5 => {
                webapi
                    .UploadFile2FavWithHash(
                        auth.getChosenSchoolId(),
                        -1,
                        filename,
                        md5
                    )
                    .then(resp => {
                        if (resp.RetCode == 0) {
                            //ok
                            this.onVideoSearch();
                            $("#uploadVideo2SaveFileInput").val("");
                        } else if (resp.RetCode == -6002) {
                            //此哈希值对应的文件不存在，请直接上传
                            var url =
                                GetAPIUrl() +
                                "FavoriteAttachment/AddNewFavoriteMultipart?Description=&Hash=" +
                                md5;
                            this.$refs.uploadfile.Upload(
                                file,
                                url,
                                () => {
                                    this.onVideoSearch();
                                    $("#uploadVideo2SaveFileInput").val("");
                                },
                                () => {
                                    $("#uploadVideo2SaveFileInput").val("");
                                    //oncancel
                                }
                            );
                        } else if (resp.RetCode == -6003) {
                            //文件列表中已经存在文件名和哈希值均相同的文件，请不要重复上传
                            this.$Message.error({
                                content: this.$t("Live.FileAlreadyinList"),
                                duration: 0,
                                closable:true
                            });
                            
                            $("#uploadVideo2SaveFileInput").val("");
                        } else {
                            $("#uploadVideo2SaveFileInput").val("");
                        }
                    });
            });
            return;
        },
        uploadVideoInputChange() {
            var input = $("#liveUploadVideoInput")[0];
            //alert(input.files.length);
            if (input.files.length == 0) {
                return;
            }
            if (this.isVideoExistInList(input.files[0].name)) {
                if (
                    !window.confirm(
                        "This file already in list, do you want to continue add it!"
                    )
                ) {
                    return;
                }
            }
            var accept = [".mp4"];
            var ext = input.files[0].name.substr(
                input.files[0].name.lastIndexOf(".")
            );
            ext = ext.toLowerCase();
            if (!IsExistInArr(accept, ext)) {
                this.$Message.error({content:"This file not support!",duration:0,closable:true});
                return;
            }

            this.$refs.uploadfile.Upload(
                input.files[0],
                this.uploadAction
                    .replace("UploadFile?", "UploadFileMultipart?")
                    .replace("&FileName=", ""),
                () => {
                    //on success
                    $("#liveUploadVideoInput").val("");
                },
                () => {
                    $("#liveUploadVideoInput").val("");
                    //oncancel
                }
            );
        },
        uploadFileInputChange() {
            //this.showFileList = false;
            var input = $("#liveUploadFileInput")[0];
            if (input.files.length == 0) {
                return;
            }
            this.uploadFile2LessonEx(input.files[0], $("#liveUploadFileInput"));

            return;
            var filename = input.files[0].name;
            //alert(input.files.length);
            if (this.$refs.uploadfile.IsUploading()) {
                this.$Message.error({content:this.$t("Live.WaitForFileUploading"),duration:0,closable:true});
                $("#liveUploadFileInput").val("");
                return;
            }
            //if (this.isFileExistInList(filename))
            //{
            //  if (!window.confirm("This file already in list, do you want to continue add it!"))
            //  {
            //    return;
            //  }
            //}
            if (input.files[0].size >= 1024 * 1024 * 100) {
                this.$Message.error({content:this.$t("Live.FileTooBig"),duration:0,closable:true});
                return;
            }
            var accept = [
                ".jpg",
                ".jpeg",
                ".jpe",
                ".png",
                ".doc",
                ".docx",
                ".xls",
                ".xlsx",
                ".ppt",
                ".pptx",
                ".pdf"
            ];
            var ext = filename.substr(filename.lastIndexOf("."));
            ext = ext.toLowerCase();
            if (!IsExistInArr(accept, ext)) {
                this.$Message.error({content:this.$t("Live.FileNotSupport"),duration:0,closable:true});
                return;
            }
            util.GetMD5(input.files[0]).then(md5 => {
                webapi
                    .UploadFileWithHash(this.GetLessonID(), filename, md5)
                    .then(resp => {
                        if (resp.RetCode == 0) {
                            //ok
                            $("#liveUploadFileInput").val("");
                        } else if (resp.RetCode == -6002) {
                            //此哈希值对应的文件不存在，请直接上传
                            var title = encodeURIComponent(
                                base64encode(utf16to8(filename))
                            );
                            var url =
                                GetAPIUrl() +
                                "EventAttachment/UploadFileMultiPart?LessonID=" +
                                this.GetLessonID() +
                                "&Title=" +title +
                                "&Description=&Hash=" +md5 +
                                "&IsAddToFavorite=" +
                                ($("#liveUploadFile2Fav").prop("checked")? 1: 0);
                            this.$refs.uploadfile.Upload(
                                input.files[0],
                                url,
                                (res, guid) => {
                                    //on success
                                    $("#liveUploadFileInput").val("");
                                    var lineItem = res.RetData;
                                    for (var file of this.editingEventFiles) {
                                        if (file.id == guid) {
                                            file.id = lineItem.ItemID;
                                            file.atmid =
                                                lineItem.AttachmentID + "";
                                            file.url = lineItem.AttachmentUrl;
                                            file.status = this.$t(
                                                "Live.Converting"
                                            );
                                            file.detail = lineItem;
                                            file.eventid =
                                                lineItem.AttachmentID;
                                            file.eventname = "";
                                            file.process = 0;
                                        }
                                    }
                                    this.updateProcessTimer = setInterval(
                                        () => {
                                            loger.log("convertTimer");
                                            Context.updateProcess(
                                                lineItem.AttachmentID
                                            );
                                        },
                                        2000
                                    );
                                    //loger.log(res);
                                    //let eventFile =this._lineItem2EventFile(res.RetData, false)
                                    //if (!this.isFileExist(eventFile.atmid))
                                    //{
                                    //  eventFile.ready = false;
                                    //  this.editingEventFiles.push(eventFile);
                                    //}
                                },
                                () => {
                                    //oncancel
                                    $("#liveUploadFileInput").val("");
                                },
                                (process, guid) => {
                                    //onProcess
                                    if (
                                        process == -1 &&
                                        !this.isFileExist(guid)
                                    ) {
                                        let eventFile = {
                                            id: guid,
                                            atmid: guid,
                                            name: filename,
                                            url: "",
                                            status: this.$t("Live.Uploading"),
                                            detail: null,
                                            eventid: 0,
                                            eventname: filename,
                                            blankpagenumber: "",
                                            isselected: false,
                                            ready: false,
                                            process: process
                                        };

                                        this.editingEventFiles.push(eventFile);
                                    } else {
                                        for (var file of this
                                            .editingEventFiles) {
                                            if (file.id == guid) {
                                                file.process = process;
                                            }
                                        }
                                    }
                                }
                            );
                        } else if (resp.RetCode == -6003) {
                            //文件列表中已经存在文件名和哈希值均相同的文件，请不要重复上传
                            this.$Message.error({
                                content: this.$t("Live.FileAlreadyinList"),
                                duration: 0,
                                closable:true
                            });
                            $("#liveUploadFileInput").val("");
                        } else {
                            $("#liveUploadFileInput").val("");
                        }
                    });
            });
        },
        updateProcess(guid) {
            webapi.getAttachmentConvertingPercentage([guid]).then(res => {
                //[{AttachmentID: 21808, Status: 0, Percentage: 0}]
                loger.log(res);
                for (var i = 0; i < res.length; i++) {
                    for (var file of this.editingEventFiles) {
                        if (file.atmid + "" == res[i].AttachmentID + "") {
                            if (file.ready == true) {
                                clearTimeout(this.updateProcessTimer);
                                this.updateProcessTimer = null;
                                return false;
                            }
                            //10: 转换中 0:转换成功 其他:转换失败
                            if (res[i].Status == 10) {
                                file.process = res[i].Percentage;
                                if (file.process == 100) {
                                    clearTimeout(this.updateProcessTimer);
                                    this.updateProcessTimer = null;
                                    return false;
                                }
                                return true;
                            } else if (res[i].Status == 0) {
                                clearTimeout(this.updateProcessTimer);
                                this.updateProcessTimer = null;
                                return false;
                            } else {
                                clearTimeout(this.updateProcessTimer);
                                this.updateProcessTimer = null;
                                this.removeFileFromList(file.atmid);

                                this.$Notice.error({
                                    title:
                                        file.name +
                                        this.$t("Live.ConvertError"),
                                    desc: "",
                                    duration: 4,
                                    bottom: 60,
                                    left: true
                                });

                                return false;
                            }
                        }
                    }
                }
                clearTimeout(this.updateProcessTimer);
                this.updateProcessTimer = null;
                return false;
            });
            return false;
            for (var file of this.editingEventFiles) {
                if (file.id == guid) {
                    if (file.ready == true) {
                        clearTimeout(this.updateProcessTimer);
                        this.updateProcessTimer = null;
                        return false;
                    }
                    if (file.process < 80) {
                        //file.process = file.process + 1;
                        file.process += Math.round((85 - file.process) * 0.05);
                        return true;
                    } else {
                        clearTimeout(this.updateProcessTimer);
                        this.updateProcessTimer = null;
                        return false;
                    }
                }
            }
            return false;
        },
        updateProcessEx:async function(guid,token) {
            var res = await webapi.queryConvertPercentage(token);
            //console.log(res);
            for (var file of this.editingEventFiles)
            {
                if (file.atmid + "" ==guid + "") {
                    if (file.ready == true) {
                        clearInterval(this.updateProcessTimer);
                        this.updateProcessTimer = null;
                        return {Code:100};
                    }
                    if(!res)
                    {
                        return {Code:file.process};
                    }
                    else if (res.Success == true) {
                        //file.process = Math.round(res.result.progress*100);
                        if(res.Data.CurrentStatus==0)//0: Preparing, 1: Converting, 2: wait to send, 3: Failed 4:send  5:done
                        {
                            //file.process+=1;
                            file.process=res.Data.FinishPercent;//Math.min(file.process+1,10);
                            return {Code:file.process};
                        }
                        else if(res.Data.CurrentStatus==1)
                        {
                            file.process=res.Data.FinishPercent;//Math.min(Math.floor(res.Data.FinishPercent/2),49);
                            return {Code:file.process};
                        }  
                        else if(res.Data.CurrentStatus==2)
                        {
                            file.process=res.Data.FinishPercent;
                            return {Code:file.process};
                        }                      
                        else if(res.Data.CurrentStatus==3)
                        {
                            clearInterval(this.updateProcessTimer);
                            this.updateProcessTimer = null;
                            this.removeFileFromList(guid);

                            this.$Notice.error({
                                title:this.$t("Live.ConvertError"),
                                desc: file.name,
                                duration: 4,
                                bottom: 60,
                                left: true
                            });

                            return {Code:-1};
                        }
                        else if(res.Data.CurrentStatus==4)
                        {
                            // if(res.Data.FinishPercent == 100)
                            // {
                            //     clearTimeout(this.updateProcessTimer);
                            //     this.updateProcessTimer = null;
                            //     file.process=100;
                            //     return {Code:100};
                            // }
                            // else
                            {
                                file.process= Math.min(99,res.Data.FinishPercent);//Math.max(51,50+Math.floor(res.Data.FinishPercent/2));
                                return {Code:file.process};
                            }
                        }
                        else if (res.Data.CurrentStatus==5) {
                            clearInterval(this.updateProcessTimer);
                            this.updateProcessTimer = null;
                            file.process=100;
                            return {Code:100,Data:res.Data.Result};
                        }
                        
                    }else 
                    {
                        // if(file.process>=50)
                        // {
                        //     return {Code:100};
                        // }

                        clearTimeout(this.updateProcessTimer);
                        this.updateProcessTimer = null;
                        this.removeFileFromList(guid);

                        this.$Notice.error({
                            title:file.name +this.$t("Live.ConvertError"),
                            desc: "",
                            duration: 4,
                            bottom: 60,
                            left: true
                        });

                        return {Code:-1};
                    }
                }
            }
            clearInterval(this.updateProcessTimer);
            this.updateProcessTimer = null;
            return {Code:-1};
        },
        updateProcessOss:async function(guid,token) {
            var res = await webapi.queryConvertPercentage(token);
            loger.log(res);
            for (var file of this.editingEventFiles)
            {
                if (file.atmid + "" ==guid + "") {
                    if (file.ready == true) {
                        clearTimeout(this.updateProcessTimer);
                        this.updateProcessTimer = null;
                        return 100;
                    }
                    // {"code":"10000","msg":"","result":{"progress":0.02,"status":"Converting"}}   
                    if (res.code == 10000) {
                        file.process = Math.round(res.result.progress*100);
                        if (file.process == 100) {
                            clearTimeout(this.updateProcessTimer);
                            this.updateProcessTimer = null;
                            return 100;
                        }
                        return file.process;
                    }else {
                        clearTimeout(this.updateProcessTimer);
                        this.updateProcessTimer = null;
                        this.removeFileFromList(guid);

                        this.$Notice.error({
                            title:file.name +this.$t("Live.ConvertError"),
                            desc: "",
                            duration: 4,
                            bottom: 60,
                            left: true
                        });

                        return -1;
                    }
                }
            }
            clearTimeout(this.updateProcessTimer);
            this.updateProcessTimer = null;
            return -1;
        },
        getCovertType(filename){
            var accept = [".doc",".docx",".xls",".xlsx",".ppt",".pptx",".pdf"];
            var ext = filename.substr(filename.lastIndexOf("."));
            ext = ext.toLowerCase();
            if (IsExistInArr(accept, ext)) {
                return ext.substr(1);
            }
            else
            {
                return "";
            }
        },
        uploadFile2Lesson(file, clearinput) {
            var filename = file.name;

            if (this.$refs.uploadfile.IsUploading()) {
                this.$Message.error({content:this.$t("Live.WaitForFileUploading"),duration:0,closable:true});
                if (clearinput) clearinput.val("");
                return;
            }
            if (file.size >= 1024 * 1024 * 100) {
                this.$Message.error({content:this.$t("Live.FileTooBig"),duration:0,closable:true});
                return;
            }
            var accept = [
                ".jpg",
                ".jpeg",
                ".jpe",
                ".png",
                ".doc",
                ".docx",
                ".xls",
                ".xlsx",
                ".ppt",
                ".pptx",
                ".pdf"
            ];
            var ext = filename.substr(filename.lastIndexOf("."));
            ext = ext.toLowerCase();
            if (!IsExistInArr(accept, ext)) {
                this.$Message.error({content:this.$t("Live.FileNotSupport"),duration:0,closable:true});
                return;
            }
            util.GetMD5(file).then(md5 => {
                webapi
                    .UploadFileWithHash(this.GetLessonID(), filename, md5)
                    .then(resp => {
                        if (resp.RetCode == 0) {
                            //ok
                            if (clearinput) clearinput.val("");
                        } else if (resp.RetCode == -6002) {
                            //此哈希值对应的文件不存在，请直接上传
                            var url =
                                GetAPIUrl() +
                                "EventAttachment/UploadFileMultiPart?LessonID=" +
                                this.GetLessonID() +
                                "&Description=&Hash=" +
                                md5 +
                                "&IsAddToFavorite=" +
                                ($("#liveUploadFile2Fav").prop("checked")
                                    ? 1
                                    : 0);
                            this.$refs.uploadfile.Upload(
                                file,
                                url,
                                (res, guid) => {
                                    //on success
                                    if (clearinput) clearinput.val("");
                                    var lineItem = res.RetData;
                                    for (var file of this.editingEventFiles) {
                                        if (file.id == guid) {
                                            file.id = lineItem.ItemID;
                                            file.atmid =
                                                lineItem.AttachmentID + "";
                                            file.url = lineItem.AttachmentUrl;
                                            file.status = this.$t(
                                                "Live.Converting"
                                            );
                                            file.detail = lineItem;
                                            file.eventid =
                                                lineItem.AttachmentID;
                                            file.eventname = "";
                                            file.process = 0;
                                        }
                                    }
                                    this.updateProcessTimer = setInterval(
                                        () => {
                                            loger.log("convertTimer");
                                            Context.updateProcess(
                                                lineItem.AttachmentID
                                            );
                                        },
                                        2000
                                    );
                                    //loger.log(res);
                                    //let eventFile =this._lineItem2EventFile(res.RetData, false)
                                    //if (!this.isFileExist(eventFile.atmid))
                                    //{
                                    //  eventFile.ready = false;
                                    //  this.editingEventFiles.push(eventFile);
                                    //}
                                },
                                () => {
                                    //oncancel
                                    if (clearinput) clearinput.val("");
                                },
                                (process, guid) => {
                                    //onProcess
                                    if (
                                        process == -1 &&
                                        !this.isFileExist(guid)
                                    ) {
                                        let eventFile = {
                                            id: guid,
                                            atmid: guid,
                                            name: filename,
                                            url: "",
                                            status: this.$t("Live.Uploading"),
                                            detail: null,
                                            eventid: 0,
                                            eventname: filename,
                                            blankpagenumber: "",
                                            isselected: false,
                                            ready: false,
                                            process: process
                                        };

                                        this.editingEventFiles.push(eventFile);
                                    } else {
                                        for (var file of this
                                            .editingEventFiles) {
                                            if (file.id == guid) {
                                                file.process = process;
                                            }
                                        }
                                    }
                                }
                            );
                        } else if (resp.RetCode == -6003) {
                            //文件列表中已经存在文件名和哈希值均相同的文件，请不要重复上传
                            this.$Message.error({
                                content: this.$t("Live.FileAlreadyinList"),
                                duration: 0,
                                closable:true
                            });
                            if (clearinput) clearinput.val("");
                        } else {
                            if (clearinput) clearinput.val("");
                        }
                    });
            });
        },
        async uploadFile2LessonEx(file, clearinput) {
            var filename = file.name;
            var self=this;
            if (this.$refs.uploadfile.IsUploading() || self.isUploadingFile==true) {
                this.$Message.error({content:this.$t("Live.WaitForFileUploading"),duration:0,closable:true});
                if (clearinput) clearinput.val("");
                return;
            }
            if (file.size >= 1024 * 1024 * 200) {
                this.$Message.error({content:this.$t("Live.FileTooBig"),duration:0,closable:true});
                return;
            }
            
            var accept = [".jpg",".jpeg",".jpe",".png",".doc",".docx",".xls",".xlsx",".ppt",".pptx",".pdf"];
            var ext = filename.substr(filename.lastIndexOf("."));
            ext = ext.toLowerCase();
            if (!IsExistInArr(accept, ext)) {
                this.$Message.error({content:this.$t("Live.FileNotSupport"),duration:0,closable:true});
                return;
            }            
            self.isUploadingFile=true;
            var md5 = await util.GetMD5(file);
            var filesize=file.size;
            var isaddfile=false;
            var resp = await webapi.UploadFileWithHash(this.GetLessonID(), filename, md5);                   
            if (resp.RetCode == 0) {
                //ok
                self.isUploadingFile=false;
                if (clearinput) clearinput.val("");
            } else if (resp.RetCode == -6002) {
                //此哈希值对应的文件不存在，请直接上传
                //console.log(11171);
                
                var url =GetAPIUrl() +
                    "EventAttachment/UploadFileMultiPart?LessonID=" +this.GetLessonID() +"&Description=&Hash=" +md5 +
                    "&IsAddToFavorite=" +($("#liveUploadFile2Fav").prop("checked")? 1: 0);
                var name="tempupload/"+util.GetMD5String(auth.getUserIDEx()+"_"+filename+"_"+new Date().toString());
                
                this.$refs.uploadfile.UploadCloud(file,name,async (guid,convertParam)=>{
                    //on success
                    if (clearinput) clearinput.val("");
                    var type=util.GetCovertType(filename);
                    if(type=="")
                    {
                        console.log("not convert:");
                        self.isUploadingFile=false;
                    }
                    else
                    {
                        await webapi.startConverting({Key:name,DocumentType:type,Bucket:convertParam,TargetFolderKey:resp.RetData.Path});
                        for (var file of this.editingEventFiles) {
                            if (file.id == guid) {                                           
                                file.status = this.$t("Live.Converting");
                                file.eventname = "";
                                file.process = 0;
                            }
                        }
                        var newfile= new Object();
                        util.setIntervalEx(async() =>{
                            //loger.log("convertTimer");
                            var result = await this.updateProcessEx(guid,{Key:name,Bucket:convertParam});
                                //console.log(result);
                            if(result.Code ==-1)
                            {
                                clearInterval(self.updateProcessTimer);
                                self.updateProcessTimer = null;
                                self.isUploadingFile=false;
                                return false;
                            }
                            else if(result.Code==100)
                            {                      
                                self.isUploadingFile=false;            
                                if(isaddfile==true)
                                {
                                    return false;
                                }
                                isaddfile=true;
                                clearInterval(self.updateProcessTimer);
                                self.updateProcessTimer = null;
                                

                                newfile.LessonID=this.GetLessonID();
                                newfile.Title =filename;
                                newfile.Hash =md5;
                                newfile.IsAddToFavorite =$("#liveUploadFile2Fav").prop("checked")? 1: 0;
                                newfile.SchoolID =auth.getSchoolID();
                                //newfile.FolderKey =result.FolderKey;                                        
                                //newfile.Bucket =convertParam;
                                newfile.SourceKey=name;
                                newfile.FileID=resp.RetData.FileID;
                                newfile.PageCount =result.Data.Count;
                                newfile.FileName=result.Data.FileName;
                                newfile.FileSize=filesize;
                                
                                var newfileresult =await webapi.UploadNewFile(newfile);
                                //this.setFileToReady();
                                //console.log(newfileresult);
                                for (var file of this.editingEventFiles) {
                                    if (file.id == guid) {
                                        file.process = 0;
                                        file.ready=true;
                                        file.id=newfileresult.ItemID;
                                        file.atmid=newfileresult.AttachmentID;
                                        file.newstatus=0;
                                        file.newpath=newfileresult.NewPath+"/";
                                        if(newfileresult.FileName.indexOf(".")>-1)
                                        {
                                            file.fname=newfileresult.FileName.substr(0,newfileresult.FileName.indexOf("."))+"_<"+newfileresult.PageCount+">.jpg";
                                        }
                                        else
                                        {
                                            file.fname=newfileresult.FileName+"_<"+newfileresult.PageCount+">.jpg";
                                        }
                                    }
                                }
                                return false;
                            }
                            return true;

                        },2000);
                    }
                },()=>{
                    //on cancel
                    self.isUploadingFile=false;
                    if (clearinput) clearinput.val("");
                },(process,guid)=>{
                    //onProcess
                    if (process == -1 &&!this.isFileExist(guid)) {
                            let eventFile = {
                                id: guid,
                                atmid: guid,
                                name: filename,
                                url: "",
                                status: this.$t("Live.Uploading"),
                                detail: null,
                                eventid: 0,
                                eventname: filename,
                                blankpagenumber: "",
                                isselected: false,
                                ready: false,
                                process: 0
                            };
                            this.editingEventFiles.push(eventFile);
                        } else {
                            for (var file of this.editingEventFiles) {
                                if (file.id == guid) {
                                    file.process = process;
                                }
                            }
                        }
                },()=>{
                    //on error
                    self.isUploadingFile=false;
                    if (clearinput) clearinput.val("");
                    self.$Message.error({
                        content: "网络慢.文档上传不成功!",
                        duration: 0,
                        closable:true
                        });
                });

                return;
                this.$refs.uploadfile.Upload(file,url,(res, guid) => 
                    {
                        //on success
                        if (clearinput) clearinput.val("");
                        var lineItem = res.RetData;
                        for (var file of this.editingEventFiles) {
                            if (file.id == guid) {
                                file.id = lineItem.ItemID;
                                file.atmid =
                                    lineItem.AttachmentID + "";
                                file.url = lineItem.AttachmentUrl;
                                file.status = this.$t(
                                    "Live.Converting"
                                );
                                file.detail = lineItem;
                                file.eventid =
                                    lineItem.AttachmentID;
                                file.eventname = "";
                                file.process = 0;
                            }
                        }
                        this.updateProcessTimer = setInterval(
                            () => 
                            {
                                loger.log("convertTimer");
                                Context.updateProcess(
                                    lineItem.AttachmentID
                                );
                            },
                            2000
                        );
                    },() => {
                        //oncancel
                        if (clearinput) clearinput.val("");
                    },(process, guid) => 
                    {
                        //onProcess
                        if (
                            process == -1 &&
                            !this.isFileExist(guid)
                        ) {
                            let eventFile = {
                                id: guid,
                                atmid: guid,
                                name: filename,
                                url: "",
                                status: this.$t("Live.Uploading"),
                                detail: null,
                                eventid: 0,
                                eventname: filename,
                                blankpagenumber: "",
                                isselected: false,
                                ready: false,
                                process: process
                            };

                            this.editingEventFiles.push(eventFile);
                        } else {
                            for (var file of this
                                .editingEventFiles) {
                                if (file.id == guid) {
                                    file.process = process;
                                }
                            }
                        }
                    }
                );

            } else if (resp.RetCode == -6003) {
                //文件列表中已经存在文件名和哈希值均相同的文件，请不要重复上传
                self.isUploadingFile=false;
                this.$Message.error({
                    content: this.$t("Live.FileAlreadyinList"),
                    duration: 0,
                    closable:true
                });
                if (clearinput) clearinput.val("");
            } else {
                self.isUploadingFile=false;
                if (clearinput) clearinput.val("");
            }
            
        },
        isFileExistInList(name) {
            for (var file of this.editingEventFiles) {
                if (file.name == name) {
                    return true;
                }
            }
            return false;
        },
        isVideoExistInList(name) {
            for (var file of this.videoFileList) {
                if (file.name == name) {
                    return true;
                }
            }
            return false;
        },
        onVideoDragLeave(evt) {
            //loger.log("onVideoDragLeave");
            var tar = evt.currentTarget;
            $(tar).css({ border: "1px dashed #dddee1" });
        },
        onVideoDragOver(evt) {
            //loger.log("onVideoDragOver");
            var tar = evt.currentTarget;
            $(tar).css({ border: "1px dashed #68abf1" });
        },
        onVideoDrop(evt) {
            //loger.log("onVideoDrop");
            var tar = evt.currentTarget;
            $(tar).css({ border: "1px dashed #dddee1" });
            var files = evt.dataTransfer.files;
            //loger.log("file:" + files.length);
            if (files.length == 0) {
                return;
            }
            var accept = [".mp4"];
            var ext = files[0].name.substr(files[0].name.lastIndexOf("."));
            ext = ext.toLowerCase();
            if (!IsExistInArr(accept, ext)) {
                this.$Message.error({content:this.$t("Live.FileNotSupport"),duration:0,closable:true});
                return;
            }
            this.$refs.uploadfile.Upload(
                files[0],
                this.uploadAction
                    .replace("UploadFile?", "UploadFileMultipart?")
                    .replace("&FileName=", ""),
                () => {
                    //on success
                },
                () => {
                    //oncancel
                }
            );
        },
        onFileDrop(evt) {
            //loger.log("onVideoDrop");
            var tar = evt.currentTarget;
            $(tar).css({ border: "1px dashed #dddee1" });
            var files = evt.dataTransfer.files;
            if (files.length == 0) {
                return;
            }
            this.uploadFile2LessonEx(files[0], null);
            return;

            var filename = files[0].name;
            //loger.log("file:" + files.length);

            if (this.$refs.uploadfile.IsUploading()) {
                this.$Message.error("There is another file isuploading, please wait!");
                return;
            }
            if (this.isFileExistInList(filename)) {
                if (
                    !window.confirm(
                        "This file already in list, do you want to continue add it!"
                    )
                ) {
                    return;
                }
            }
            if (files[0].size >= 1024 * 1024 * 100) {
                this.$Message.error("The upload file  size is too large(Max size:100M)!");
                return;
            }
            var accept = [
                ".jpg",
                ".jpeg",
                ".jpe",
                ".png",
                ".doc",
                ".docx",
                ".xls",
                ".xlsx",
                ".ppt",
                ".pptx",
                ".pdf"
            ];
            var ext = files[0].name.substr(files[0].name.lastIndexOf("."));
            ext = ext.toLowerCase();
            if (!IsExistInArr(accept, ext)) {
                this.$Message.error("This file not support!");
                return;
            }
            this.$refs.uploadfile.Upload(
                files[0],
                this.uploadAction
                    .replace("UploadFile?", "UploadFileMultipart?")
                    .replace("&FileName=", "") +
                    "&IsAddToFavorite=" +
                    ($("#liveUploadFile2Fav").prop("checked") ? 1 : 0),
                (res, guid) => {
                    //on success
                    var lineItem = res.RetData;
                    for (var file of this.editingEventFiles) {
                        if (file.id == guid) {
                            file.id = lineItem.ItemID;
                            file.atmid = lineItem.ItemID;
                            file.url = lineItem.AttachmentUrl;
                            file.status = "Converting";
                            file.detail = lineItem;
                            file.eventid = lineItem.AttachmentID;
                            file.eventname = "";
                            file.process = 0;
                        }
                    }
                    this.updateProcessTimer = setInterval(() => {
                        loger.log("convertTimer");
                        Context.updateProcess(lineItem.AttachmentID);
                    }, 2000);
                },
                () => {
                    //oncancel
                },
                (process, guid) => {
                    //onProcess
                    if (process == -1 && !this.isFileExist(guid)) {
                        let eventFile = {
                            id: guid,
                            atmid: guid,
                            name: filename,
                            url: "",
                            status: "Uploading",
                            detail: null,
                            eventid: 0,
                            eventname: filename,
                            blankpagenumber: "",
                            isselected: false,
                            ready: false,
                            process: process
                        };

                        this.editingEventFiles.push(eventFile);
                    } else {
                        for (var file of this.editingEventFiles) {
                            if (file.id == guid) {
                                file.process = process;
                            }
                        }
                    }
                }
            );
        },
        toggleVideoList(evt) {
            var tar = evt.currentTarget;
            if ($(tar).hasClass("ivu-icon-chevron-up")) {
                //hide
                $(tar)
                    .removeClass("ivu-icon-chevron-up")
                    .addClass("ivu-icon-chevron-down");
                $("#liveVideoList").slideUp("normal");
            } else {
                $(tar)
                    .removeClass("ivu-icon-chevron-down")
                    .addClass("ivu-icon-chevron-up");
                $("#liveVideoList").slideDown("normal");
            }
        },
        onVideoPlayInfoChange(obj) {
            //loger.log("onVideoPlayInfoChange:" + JSON.stringify(obj));
            //debugger;
            this.disableAudioForPlayVideo(obj.stat == 1 ? 1 : 0);
            if (obj.stat == 2) {
                //$("#videoPlayerMask").remove();
                this.getVideoPlayer().Pause();
                $("#liveplayvideo").hide();
                return;
            }
            if (obj.type == 1) {
                if (!$("#liveplayvideo").is(":visible")) {
                    $("#liveplayvideo").css({width: getViewWidth(),height: getViewHeight(),"z-index": 10002,position: "absolute",top: "0px",left: "0px"}).show();
                    //var html = '<div id="videoPlayerMask" style="z-index:10001; position:absolute;top:0px; left:0px; width:100%;height:100%; background-color:#ccc; opacity:0.3;"></div>';
                    //$(document.body).append(html);
                    //this.showVideo({ id: obj.vid, url: obj.url });
                    console.log("12256:"+this.showUploadFile);
                    if(this.isPlayLesson || this.isPlay)
                    {
                        this.getVideoPlayer().setShowClose(this.showUploadFile);
                        this.getVideoPlayer().setCanControl(this.showUploadFile);
                    }
                    else
                    {
                        this.getVideoPlayer().setShowClose(this.showUploadFile);
                        this.getVideoPlayer().setCanControl(this.showUploadFile);
                    }
                    this.getVideoPlayer().setVideoType(1);
                    this.getVideoPlayer().ShowVideo({ id: obj.vid, url: obj.url });
                    this.$refs.syncplayer.beforePlayVideo();

                }
                else
                {
                    this.getVideoPlayer().onVideoPlayInfoChange(obj, {url: obj.url});
                }
            }

            var videoitem = this.getSelectVideo();
            if (videoitem == null) {
                this.setSelectVideo(obj.vid);
                videoitem = this.getSelectVideo();
            } else {
                if (obj.vid != videoitem.id) {
                    this.setSelectVideo(obj.vid);
                    videoitem = this.getSelectVideo();
                }
            }
            if (videoitem != null) {
                this.getVideoPlayer().onVideoPlayInfoChange(obj, videoitem);
            } else {
                if (obj.url) {
                    this.getVideoPlayer().onVideoPlayInfoChange(obj, {url: obj.url});
                } else {
                    this.getVideoPlayer().onVideoPlayInfoChange(obj, {url: this.getVideoPlayer().getUrl()});
                }
            }
        },
        showLessonFile(lessonid = 0) {
            if (lessonid == 0) {
                lessonid = this.getMeetingID();
            }
            webapi.getmeetinginfo(lessonid, info => {
                this.meetingInfo = info;
                this.showfiles(info.RetData);
                var showitem = this.getShowAttachment(
                    info.RetData.AttachmentList
                );
                if (showitem != null) {
                    if (false) {
                        //(showitem.AttachmentH5Url != "")
                        ShowPPT(showitem.AttachmentH5Url, PageNumber);
                        this.attachmentUrl = showitem.AttachmentH5Url;
                    } else {
                        websocket._currentPageID = PageNumber;
                        websocket._currentDocID = showitem.ItemID;
                        this.ShowPDFEx(
                            showitem.AttachmentUrl,
                            PageNumber,
                            isscucess => {
                                if (isscucess == false) {
                                    //this.$Message.error(
                                    //  {
                                    //    content: 'Load file failed!',
                                    //    duration: 3
                                    //  });
                                    GetPageContainer(PageNumber).hide();
                                }
                                ShowPdfInfo();
                            },
                            showitem.AttachmentID
                        );
                        this.attachmentUrl = showitem.AttachmentUrl;
                    }
                    this.setSelectFile(showitem.ItemID);
                    AttachmentID = showitem.ItemID;
                    if (Role == 2 && AttachmentID != "") {
                        websocket.updatemeetingdocid(AttachmentID);
                    }
                    ShowPdfInfo();
                }
                else
                {
                    this.SetStyle4WelcomePage(true);
                }
            });
        },
        showLecutreFile(id) {
            webapi.getLectureInfo(id).then(info => {
                this.showLectureFileList(info.Attachments);
                this.welcomeMessagePrepareName = this.getDisplayName(
                    info.Title
                );
                if (info.Attachments != null && info.Attachments.length > 0) {
                    var showitem = info.Attachments[0];
                    if (false) {
                        //(showitem.AttachmentH5Url!=null && showitem.AttachmentH5Url != "")
                        ShowPPT(showitem.AttachmentH5Url, PageNumber);
                        this.attachmentUrl = showitem.AttachmentH5Url;
                    } else {
                        websocket._currentPageID = PageNumber;
                        websocket._currentDocID = showitem.ItemID;
                        this.ShowPDFEx(
                            showitem.AttachmentUrl,
                            PageNumber,
                            isscucess => {
                                if (isscucess == false) {
                                    //this.$Message.error(
                                    //  {
                                    //    content: 'Load file failed!',
                                    //    duration: 3
                                    //  });
                                    GetPageContainer(PageNumber).hide();
                                }
                                ShowPdfInfo();
                            },
                            showitem.AttachmentID
                        );
                        this.attachmentUrl = showitem.AttachmentUrl;
                    }
                    this.setSelectFile(showitem.ItemID);
                    AttachmentID = showitem.ItemID;
                    websocket.updatemeetingdocid(AttachmentID);
                    ShowPdfInfo();
                }
            });
        },
        getDisplayName(name) {
            if (!name) {
                return "";
            }
            if (name.length > 25) {
                return name.substr(0, 25) + "...";
            }
            return name;
        },
        showLectureFileList(list) {
            this.editingEventFiles = [];
            if (list != null && list.length > 0) {
                var index = 0;
                for (var file of list) {
                    let eventFile = this._lineItem2EventFile(file, index == 0);
                    if (!this.isFileExist(eventFile.id)) {
                        this.editingEventFiles.push(eventFile);
                    }
                    index++;
                }
            }
        },
        autoChangeFile(diff) {
            if (
                this._lastSwitchTime &&
                new Date() - this._lastSwitchTime < 500
            ) {
                ////alert("Please wait while file is loading!");
                return;
            }
            this._lastSwitchTime = new Date();

            

            if (this.editingEventFiles.length < 2) {
                return false;
            }
            if(this.isPlayLesson==true)
            {
                this.showDiffAttachment(diff);
                return;
            }
            var item = this.getAutoChangeFile(diff);
            //console.log(item);
            if (item != null) {
                if(diff==-1)
                {
                    var tourl="";
                    if(item.detail)
                    {
                        tourl=item.detail.AttachmentUrl;
                    }
                    else if(item.url)
                    {
                        tourl=item.url;
                    }
                    if(tourl=="")
                    {
                        PageNumber=1;
                        ToPageNumber=1;
                    }
                    else
                    {
                        PageNumber = GetPdfCount(tourl);
                        ToPageNumber=PageNumber;
                    }
                }
                else
                {
                    PageNumber=1;
                }
                //console.log(PageNumber);
                this.showAttachment(item.id);
                return true;
            }
            return false;
        },
        showDiffAttachment(diff){
            var time=0;
            if(this.$refs.syncplayer)
            {
                time=this.$refs.syncplayer.GetCurrentPlayTime();
            }
            var atmid=this.getAttachmentAttachmentID(AttachmentID);
            webapi.getRecordLessonSwitchDocumentInfo(this.thinkCurrentID,atmid,time,diff==1?2:1).then(res=>{
                console.log(res);
                if(res.AttachmentID!=0 && res.AttachmentID!=atmid)
                {
                    PageNumber=res.PageNumber;
                    this.showAttachment(this.getAttachmentItemID(res.AttachmentID));
                    this.$refs.syncplayer.GoToTime(res.Time);
                }

            });
        },
        getAutoChangeFile(diff) {
            var index = 0;
            var selectedindex = 0;
            for (var file of this.editingEventFiles) {
                if (file.isselected == true) {
                    selectedindex = index;
                }
                index++;
            }
            var result = selectedindex + diff;
            if (result < 0) {
                result = this.editingEventFiles.length - 1;
                //return "";
            } else if (result >= this.editingEventFiles.length) {
                result = 0;
                //return "";
            }
            index = 0;
            for (var file of this.editingEventFiles) {
                if (index == result) {
                    return file;
                }
                index++;
            }
            return null;
        },
        switchActionBtn(isfullvideo) {
            if (isfullvideo) {
                $(
                    "#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionUndo,#liveActionRedo,#liveActionAddPage,#liveActionPlay"
                ).hide();
                //$("#liveActionMin").show();
            } else {
                //$("#liveActionMin").hide();
                $(
                    "#liveActionCursor,#liveActionPencil,#liveActionLine,#liveActionHighlighter,#liveActionText,#liveActionNote,#liveActionDraw,#liveActionVideo,#liveActionBoard,#liveActionClear,#liveActionUndo,#liveActionRedo,#liveActionAddPage,#liveActionPlay"
                ).show();
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
        removeFileFromList(attachmentid) {
            var nIndex = -1;
            var isBlankPage=false;
            var blankPageIndex=0;
            var isDeleteShow=false;
            for (var i = 0; i < this.editingEventFiles.length; i++) {
                if(this.editingEventFiles[i].fileid==-1)
                {
                    blankPageIndex++;
                }
                if (this.editingEventFiles[i].atmid == attachmentid) {
                    nIndex = i;
                    if(this.editingEventFiles[i].fileid==-1)
                    {
                        isBlankPage=true;
                    }
                    if(this.editingEventFiles[i].isselected==true)
                    {
                        isDeleteShow=true;
                    }
                    break;
                }
            }
            if (nIndex > -1) {                
                this.editingEventFiles.splice(nIndex, 1);
                if(isBlankPage)
                {
                    for (var i = nIndex; i < this.editingEventFiles.length; i++) 
                    {
                        if(this.editingEventFiles[i].fileid==-1)
                        {
                            this.editingEventFiles[i].name="Default Blank Page " +blankPageIndex;
                            blankPageIndex++;
                        }
                    }
                }
                if(isDeleteShow)
                {
                    if(this.editingEventFiles.length>0)
                    {
                        if (this.showUploadFile)
                        {
                            this.showAttachment(this.editingEventFiles[0].id);
                        }
                    }
                    else
                    {
                        this.SetStyle4WelcomePage(true);
                    }
                }
            }
        },
        setFileToReady(attachmentid, url) {
            for (var file of this.editingEventFiles) {
                if (file.atmid == attachmentid) {
                    file.ready = true;
                    if(url) file.url = url;
                }
            }
        },
        _lineItem2EventFile(lineItem, selected,blankpageindex=1) {
            let atmid = lineItem.AttachmentID + "";
            let id =
                atmid.lastIndexOf("-") > -1
                    ? atmid.substr(atmid.lastIndexOf("-") + 1)
                    : atmid;
            let url = lineItem.AttachmentUrl;
            let name = lineItem.Title; //url.substr(url.lastIndexOf('/') + 1);
            if (!name) name = url.substr(url.lastIndexOf("/") + 1);
            name = name.replace(/\+/g, " ");
            if (lineItem.FileID== -1) {
                name = "Default Blank Page " +blankpageindex;
            }
            var filename="";
            if(lineItem.FileType==4 || lineItem.FileType==5)
            {
                filename=lineItem.FileName;
            }
            else
            {
                if(lineItem.FileName.indexOf(".")>-1)
                {
                    filename=lineItem.FileName.substr(0,lineItem.FileName.indexOf("."))+"_<"+lineItem.PageCount+">.jpg";
                }
                else
                {
                    filename=lineItem.FileName+"_<"+lineItem.PageCount+">.jpg";
                }
            }
            let eventFile = {
                id: lineItem.ItemID,
                atmid: atmid,
                name: name,
                url: url,
                status: "finished",
                detail: lineItem,
                eventid: lineItem.EventID,
                fileid: lineItem.FileID,
                eventname: lineItem.EventName,
                blankpagenumber: lineItem.BlankPageNumber,
                isselected: selected,
                ready: true,
                count:lineItem.SyncCount,
                process: 0,
                newstatus:lineItem.NewStatus?lineItem.NewStatus:1,
                newpath:lineItem.NewPath?lineItem.NewPath+"/":"",
                fname:filename
            };

            return eventFile;
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
        videoList2ShowList(item) {
            return {
                id: item.ItemID,
                name: item.Title,
                time: item.VideoDuration,
                size: item.VideoSize
            };
        },
        getFileIDFromAttachmentID(attid) {
            if (!attid || attid == "") return 0;
            var arr = (attid + "").split("-");
            var fileid = 0;
            if (arr.length != 2) {
                fileid = parseInt(attid);
            } else {
                fileid = parseInt(arr[1]);
            }
            if (isNaN(fileid)) return 0;
            return fileid;
        },
        getMeetingID() {
            var mid = this.getLessonID;            
            if (mid != 0 && mid != -1) {
                return mid;
            }
            return MeetingID;
        },
        getIsInstantMeeting() {
            //var mid = this.getMeetingID();
            //return mid != MeetingID?1:0;
            //var t = this.$route.query.type;
            //if (t)
            //{
            //  return t == "1" ? 1 : 0;
            //}
            var t = this.getIDFromUrl(); //this.$route.params.meetingId;
            if (t) {
                //return (t + "").indexOf("-") == 0 ? 1 : 0;
                return (/^(?=[0-9]*[a-zA-Z])[a-zA-Z0-9]{3,12}$/ig).test(t)?1:0;
            }
            return 0;
        },
        isInstantMeeting(id){
            return (/^(?=[0-9]*[a-zA-Z])[a-zA-Z0-9]{3,12}$/ig).test(id);
        },
        getIDFromUrl(){
            if(this.$route.params.id)
                return (this.$route.params.id+"").toUpperCase();
            else
            return (this.$route.query.id+"").toUpperCase();
        },
        getIsShareMode() {
            var t = this.$route.query.share;
            if (t && t.length>10) {
                return true;
            }
            return false;
        },
        addFav2Meeting(meetingid, attachmentids) {
            return new Promise(function(resolve, reject) {
                var sessionid = auth.getUserToken();
                var url =
                    GetAPIUrl() +
                    "EventAttachment/UploadFromFavorite?lessonID=" +
                    meetingid +
                    "&itemIDs=" +
                    attachmentids.join(",");
                $.ajax({
                    type: "POST",
                    url: url,
                    beforeSend: function(request) {
                        request.setRequestHeader("UserToken", sessionid);
                    },
                    success: function(data) {
                        resolve(data.RetData);
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        loger.log(xhr);
                        resolve(null);
                    }
                });
            });
        },
        updateFileBlankPageNumber(pageid) {
            var selectfile = this.getSelectFile();
            if (selectfile == null) {
                return;
            }
            if (
                selectfile.blankpagenumber &&
                selectfile.blankpagenumber != ""
            ) {
                selectfile.blankpagenumber += "," + pageid;
            } else {
                selectfile.blankpagenumber = pageid + "";
            }
        },
        addBlankPage(pageid) {
            var attachmentID = 0;
            var selectfile = this.getSelectFile();
            if (selectfile == null) {
                return;
            }
            var arr = selectfile.atmid.split("-");
            if (arr.length == 2) {
                attachmentID = arr[1];
            } else {
                attachmentID = selectfile.id;
            }
            return new Promise(function(resolve, reject) {
                var sessionid = auth.getUserToken();
                var url =
                    GetAPIUrl() +
                    "EventAttachment/AddBlankPage?attachmentID=" +
                    attachmentID +
                    "&pageNumber=" +
                    pageid;
                $.ajax({
                    type: "POST",
                    url: url,
                    beforeSend: function(request) {
                        request.setRequestHeader("UserToken", sessionid);
                    },
                    success: function(data) {
                        resolve(true);
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        loger.log(xhr);
                        resolve(false);
                    }
                });
            });
        },
        setUploadUrl() {
            let uploadurl =
                GetAPIUrl() +
                "EventAttachment/UploadFile?ViewType=1&ProjectID=211&CustomerID=-1&EventID=0&Title=Attachment&Description=Attachment";
            uploadurl += "&IncidentID=" + this.getMeetingID();
            uploadurl += "&FileName=";
            this.uploadAction = uploadurl;
            this.uploadHeaders = { UserToken: auth.getUserToken() };
        },
        showCameraBar(show){
            taggleMinControlWindow(show);
            LiveBodyResize();
            CheckZoom();
            if(show)//show
            {
                if(this.getEnableVideo)
                {
                    this.getMediaView().ToggleLoaclVideo(true);
                }
            }
            else
            {
                this.getMediaView().ToggleLoaclVideo(false);
            }
        },
        MuteAllAudio(mute){
            console.log("MuteAllAudio:"+mute);
            if (!this.showUploadFile) 
            {
                this.$Message.error(this.$t("Live.PresenterWarnning"));
                return;
            }            
            this.NoticeMuteAllAudio(mute?0:1);////1:open 0:close
        },
        ChangeLocalAudio(enable,canOpenAudio){
            console.log("ChangeLocalAudio:"+enable+","+canOpenAudio);
            if (this.showUploadFile)
            {
                this.changeEnableAudio(enable);
            }
            else
            {                
                if(canOpenAudio || this.getIsInstantMeeting())
                {
                    this.changeEnableAudio(enable);
                }
            }
        },
        onAttachmentChangeFromOther(fileinfo){
            if (!fileinfo.attachmentUrl || this.attachmentUrl == fileinfo.attachmentUrl) {
                return;
            }
            if($("#live-welcomepage").is(":visible"))
            {
                this.SetStyle4WelcomePage(false);
            }
            //var fileid = this.getFileIDFromAttachmentID(fileinfo.attachmentID);
            //webapi.getLessonAttachmentDetail(fileinfo.itemId).then(info => {
                AttachmentID = fileinfo.itemId + "";
                var newPageNumber=fileinfo.pageNumber?fileinfo.pageNumber:1;
                this.setSelectFile(fileinfo.itemId);
                this.reset();
                //$("#livePageNumber").val(PageNumber);
                PageNumber=newPageNumber;
                ToPageNumber=newPageNumber;

                ShowPdfInfo();
                this.showAttachment(fileinfo.itemId);
            //});
        },
        onSizeModeChangeFromOther(mode){
            if(this.preSizeMode==mode)
            {
                return;
            }
            this.preSizeMode=mode;
            if(mode==1)
            {
                $("#liveButtonSizeMode").removeClass("liveButtonSizeModeWidth").addClass("liveButtonSizeModeHeight");
            }
            else
            {
                $("#liveButtonSizeMode").removeClass("liveButtonSizeModeHeight").addClass("liveButtonSizeModeWidth");
            }
            whiteboard.SetSizeMode(mode);
            whiteboard.RefreshDocument(()=>{
                //whiteboard.TriggerViewChange();
                CurrentScale=1;
                updateToolbar();
            });
        },
        dblClickTip(){
            //$("#liveLessonStat").fadeOut("slow");
            $("#liveLessonStat").animate({ 
                left: "-500px",
                opacity:0
            }, 1000,function(){
                $("#liveLessonStat").hide();
            });

        },
        ...mapMutations([
            "changeLessonID",
            "changeEnableVideo",
            "changeEnableAudio",
            "changeScreenRes",
            "resetVuex4ExistRoom",
            "changeclassRoomId",
            "changeClassRoomRoute",
            "changeShareDoc",
            "changeKloudsyncShareDoc"
        ])
    },
    computed: {
        getUserStyle(user){
            return function(user){
                return "";
            }
        },
        getAudioToolText() {
            if (this.role != 2) return "";
            if (this.serverLineID == 0) {
                return this.$t("Live.AudioSystemaudio");
            } else if (this.serverLineID == 2) {
                return this.$t("Live.AudioKloudCall");
            } else if (this.serverLineID == 4) {
                return this.$t("Live.AudioNoaudio");
            }
        },
        getAttachmentInfo() {
            return this.showAttachmentInfo;
        },
        getSelectAttachmentName(){
            var file=this.getSelectFile();
            var result="";
            if(file) result = file.name;
            if(result.length>30) result=result.substr(0,30)+"...";
            return result;
        },
        orderedUsers: function() {
            return _.orderBy(this.userList, ["order"], ["asc"]);
        },
        getFileMenuCss: function() {
            if (this.showUploadFile) {
                return "live-file-cover";
            } else {
                return "live-file-covernoaccess";
            }
        },
        showLessonInfo: function() {
            return false;
            if (this.getIsInstantMeeting()) {
                return false;
            }
            return !this.isLessonStart;
        },
        getDefaultSelectStyle() {
            if (this.showUploadFile) return "selected";
            else return "show";
        },
        getWebCamStyle() {
            return this.getEnableVideo
                ? "icon-icon-video-enable "
                : "icon-icon-video-disable";
        },
        getMicStyle() {
            return this.getEnableAudio
                ? "icon-icon-mic-enable "
                : "icon-icon-mic-disable";
        },
        tabHeightStyle: function() {
            if (this.isLessonStart) {
                return "height:509px;";
            } else {
                return "height:399px;";
            }
        },
        filterFriends: function() {
            if (this.filterFriendKey == "") {
                return this.friendList;
            }
            return this.friendList.filter(item => {
                return (
                    item.name
                        .toLowerCase()
                        .indexOf(this.filterFriendKey.toLowerCase()) > -1
                );
            });
        },
        getControlWindowTop: function() {
            return this.isLessonStart ? 0 : 50;
        },
        isShowClassRoomName() {
            return this.getIsInstantMeeting() == 1 && this.isPrepare == false;
        },
        isShowPrepareInfo() {
            return this.isPrepare;
        },
        getIsShowUploadFile() {
            if (this.isPrepare) {
                return false;
            }
            return this.showUploadFile;
        },
        thinkBtnText()
        {
            if(this.thinkInfo.EnableRecord==true)
            {
                return this.$t("Live.RecordSync");
            }
            else if(this.thinkInfo.EnableRecord==false && this.thinkInfo.EnableSelectVoice==false && this.thinkInfo.EnableBackGround==false)
            {
                return this.$t("Live.RecordStart");
            }
            else
            {
                return this.$t("Live.RecordOnlySync");
            }
        },
        thinkBtnDisable()
        {
            if(this.thinkInfo.EnableRecord==false && this.thinkInfo.EnableSelectVoice==false && this.thinkInfo.EnableBackGround==false)
            {
                return true;
            }
            return false;
        },
        getHeaderTitle(){
            return "";//this.headTitle+this.getSelectAttachmentName();
        },
        IsKloudSync() {
            return VERSIONTYPE === 2;
        },
        ...mapState([
            "showAttachmentInfo",
            "videoMode",
            "msgVideMode",
            "shareMode",
            "lessonState",
            "lessonID",
            "prepareMode",
            "audioServerLineID",
            "kloudCallStat",
            "shareRes",
            "playVideoInfo",
            "audioMuteStat",
            "videoMuteStat",
            "cameraBarStat",
            "autoPlayAudioInfo",
            "teacherLessonID",
            "sizeMode",
            "removeItemID"
        ]),
        ...mapGetters([
            "getLessonID",
            "getEnableVideo",
            "getEnableAudio",
            "getAudioServerLineID"
        ])
    },
    watch: {
        //getAttachmentID(url)
        //{
        //  //alert("showAttachmentID change " + url);
        //  this.reset();
        //  ShowPDF(url, PageNumber);
        //},
        showAttachmentInfo(fileinfo) {
            //alert("showAttachmentID change :" + fileinfo.attachmentID);
            //let aid = fileinfo.attachmentID.substr(fileinfo.attachmentID.lastIndexOf('-') + 1);
            //$("#liveFileList").find(">div.selected").removeClass("selected");
            //$("#eventfile-" + aid).addClass("selected");

            this.onAttachmentChangeFromOther(fileinfo);
        },
        prepareMode(mode) {
            this.changePrepareStatus(mode);
        },
        kloudCallStat(stamp) {
            //if (Role != 2)
            {
                this.KloudCallEndAgora();
                this.KloudCallStudent();
            }
        },
        audioServerLineID(lineid) {
            this.AfterSelectAudioTool(lineid, false);
        },
        videoMode(mode) {
            if (mode == 1) {
                //max
                this.switchActionBtn(true);
            } //min
            else {
                this.switchActionBtn(false);
            }
            if (this.showUploadFile == false) {
                return;
            }

            var senddata = new Object();
            senddata.videoMode = mode + "";
            senddata.actionType = 9;
            websocket.sendmessage(
                "",
                base64encode(utf16to8(JSON.stringify(senddata)))
            );
        },
        msgVideMode(mode) {
            loger.log("msgVideMode change:" + mode);
            var arr = mode.split(",");
            var videoMode = "0",
                showUser = "0";
            if (arr.length >= 0) {
                videoMode = arr[0];
            }
            if (arr.length >= 1) {
                showUser = arr[1];
            }
            this.ViewModeChange(videoMode, showUser, true);
        },
        shareMode(mode) {
            //alert(mode);
            if (mode % 10 == 1) {
                this.getMediaView().StartShareScreen();
                //StopRecord();
            } else {
                this.getMediaView().StopShareScreen();
                Record();
            }
        },
        shareRes(res) {
            this.getMediaView().ShareScreenResChange(res);
        },
        sizeMode(mode){
            this.onSizeModeChangeFromOther(mode);
        },
        playVideoInfo(obj) {
            this.onVideoPlayInfoChange(obj);
        },
        lessonState(state) {
            if (this.getIsInstantMeeting()) {
                return;
            }
            if (state == 0) {
                this.EndMdeia();
            } else if (state == 1) {
                this.StartMedia();
            }
        },
        teacherLessonID(lessonid)
        {
            //
            this.teacherInLessonID=lessonid;
            $("#BtnWelMsgJoinStudent,#BtnWelMsgJoinAuditor").attr("disabled",false);
            $("#WelMsgWaitJoin").hide();
        },
        audioMuteStat(stat) {
            if (stat + "" == "-1") return;
            this.$Notice.success({
                title: this.$t("Live.PresenterDisabledmicrophone"),
                desc: "",
                duration: 2,
                bottom: 60,
                left: true
            });
            this.changeEnableAudio(stat + "" == "1");
            this.getMediaView().ToggleLoaclAudio(stat + "" == "1",true);
        },
        videoMuteStat(stat) {
            if (stat + "" == "-1") return;
            this.$Notice.success({
                title: this.$t("Live.PresenterDisabledCamera"),
                desc: "",
                duration: 2,
                bottom: 60,
                left: true
            });
            this.getMediaView().ToggleLoaclVideo(stat + "" == "1");
        },
        lessonID(id) {
            if (id < 1) {
                return;
            }
            //this.getCharView().Init("Classroom-" + id,this.GetUserID());
            //log("lessonID change:" +id);
            this.eventId = id;
            this.setUploadUrl();
            //this.welcomeMessageStudentBtn = true;
            //$("#BtnWelMsgJoinStudent,#BtnWelMsgJoinAuditor").attr("disabled", false);
            //$("#WelMsgWaitJoin").hide();
            //this.showLessonFile();
            //this.StartLesson();
        },
        cameraBarStat(stat) {
            if (!this.showUploadFile) {
                this.showCameraBar(stat == 0);
            }
        },
        autoPlayAudioInfo(obj) {
            this.playSyncFromTeacher(obj);
        },
        removeItemID(atmid){
            this.removeFileFromList(atmid);
        },
        $route(to, from) {
            //loger.log("watch route to:" + to + ",from:" + from);
            //this.resetData();
            //this.Init();
            // if(to.name=="login"){
            //     this.$router.push("/");
            // }
            // window.onbeforeunload = null;
            // this.$router.go(0);
        }
    }
};
</script>