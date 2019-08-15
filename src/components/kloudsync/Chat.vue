<template>
<div class="chat-flexviews">
  <!-- <div class="panel-gutter"></div> -->
  <div class="panel-catalog">
    <div class="left-part" v-show="showContactList">
        <div class="dragArea"></div>
        <div class="card">
          <div class="chat-search-place">
            <!-- <Input v-model="searchKey" icon="ios-search" :placeholder="$t('ChatFloating.PlaceHolderSearching')" class="search" @on-keyup="searchAllList($event)"/> -->
            <input class="search" type="text" :placeholder="$t('ChatFloating.PlaceHolderSearching')" v-model="searchKey" @keyup="searchAllList($event)" @keydown="showClearText"/>
            <div class="searchIcon" @click="searchAllList($event)"><Icon type="ios-search-strong" size="18"></Icon></div>
            <div class="clearInput" v-show="showClearInput" @click="clearInputText($event)"><Icon type="android-cancel" size="16" style="color:#D2D2D0"></Icon></div>
            <div @click="addNewGroupModel" class="add-Group" style="display:inline-block;" :title="$t('ChatFloating.CreateDiscussionGroup')"><Icon type="ios-plus-outline" size="20"></Icon></div>
          </div>
        </div>
        <div class="recent-chat" v-show="currentMenu === 'recentChat'&&!showSearch">
          <ul>
            <li class="recent-friend" :class="{ bgColor:changeCourseBg == ('Classroom-'+lessonID)}" v-if="mettingClassRoom" @click="chooseCouser('Classroom-'+lessonID,'Current classroom')">
              <div class="recent-friend-head"><img src="/static/preview/images/group-default.svg" width="30" height="30" style="border-radius: 50%"/></div>
              <div class="recent-friend-name">
                <div style="font-size: 13px;font-weight: bold;overflow: hidden; max-width:300px;text-overflow: ellipsis;white-space: nowrap;text-align: left;">{{$t('ChatFloating.CurrentClassroom')}}</div>
                <div style="margin-top: 3px;color:#33333370;overflow: hidden; max-width:300px;text-overflow: ellipsis;white-space: nowrap;text-align: left;">{{$t('ChatFloating.PleaseChat')}}</div>
              </div>
              <div class="private-messageCount" v-for="UnreadMessegeID in UnreadMessegeIDList" v-if="UnreadMessegeID.unReadId==('Classroom-'+lessonID) && UnreadMessegeID.unreadCounts!=0">
                <span>{{UnreadMessegeID.unreadCounts}}</span>
              </div>
            </li>
            <li class="recent-friend" :class="{ bgColor:changeRed == rencentPerson.RongCloudUserID || changeCourseBg== rencentPerson.RongCloudUserID}" v-for="rencentPerson in recentlist" :key="rencentPerson.RongCloudUserID" @mousedown="chooseRecent(rencentPerson.ptUserID?rencentPerson.ptUserID:0,rencentPerson.RongCloudUserID,rencentPerson.UserName,rencentPerson.flag)">
              <div class="recent-friend-head"><img :src="rencentPerson.AvatarUrl" width="30" height="30" style="border-radius: 50%"/></div>
              <div class="recent-friend-name">
                <div style="font-size: 13px;font-weight: bold;overflow: hidden; max-width:300px;text-overflow: ellipsis;white-space: nowrap;text-align: left;">{{rencentPerson.UserName}}</div>
                <div style="margin-top: 3px;color:#33333370;overflow: hidden; max-width:300px;text-overflow: ellipsis;white-space: nowrap;text-align: left;">{{rencentPerson.Content}}</div>
              </div>
              <div class="delete_rencent">
                <Icon type="close-round" size="14" style="color:red" @click="delete_oneRencent(rencentPerson.RongCloudUserID,$event)"></Icon>
              </div>
              <div class="private-messageCount" v-for="UnreadMessegeID in UnreadMessegeIDList" v-if="UnreadMessegeID.unReadId==rencentPerson.RongCloudUserID && UnreadMessegeID.unreadCounts!=0">
                <span>{{UnreadMessegeID.unreadCounts}}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="recent-chat" v-show="currentMenu === 'recentChat' && showSearch"> 
          <ul>
            <li class="recent-friend" :class="{ bgColor:changeRed == rencentPerson.RongCloudUserID || changeCourseBg== rencentPerson.RongCloudUserID}" v-for="rencentPerson in searchRecentlist" :key="rencentPerson.RongCloudUserID" @mousedown="chooseRecent(rencentPerson.ptUserID?rencentPerson.ptUserID:0,rencentPerson.RongCloudUserID,rencentPerson.UserName,rencentPerson.flag)">
              <div class="recent-friend-head"><img :src="rencentPerson.AvatarUrl" width="30" height="30" style="border-radius: 50%"/></div>
              <div class="recent-friend-name">
                <div style="font-size: 13px;font-weight: bold;overflow: hidden; max-width:300px;text-overflow: ellipsis;white-space: nowrap;text-align: left;">{{rencentPerson.UserName}}</div>
                <div style="margin-top: 3px;color:#33333370;overflow: hidden; max-width:300px;text-overflow: ellipsis;white-space: nowrap;text-align: left;">{{rencentPerson.Content}}</div>
              </div>
              <div class="private-messageCount" v-for="UnreadMessegeID in UnreadMessegeIDList" v-if="UnreadMessegeID.unReadId==rencentPerson.RongCloudUserID && UnreadMessegeID.unreadCounts!=0">
                <span>{{UnreadMessegeID.unreadCounts}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
  </div>
  <div class="panel-content">
    <div class="right-part">
      <div v-show="showDropdown" class="chat-groupName-down">
            <div class="groupName-item-top"></div>
            <div class="groupName-item" v-for="detailPerson in detailCouserList">
              <div class="groupName-item-head"><Avatar :src="detailPerson.AvatarUrl==''?'../../../static/images/user.svg':detailPerson.AvatarUrl"></Avatar></div>
              <div class="groupName-item-name">{{detailPerson.Name}}</div>
            </div>
      </div>
      <div class="toolbar-header-part">
          <span class="chat-groupName">{{groupName}}
          </span>
          <span :title="$t('ChatFloating.GroupMembers')" v-show="showGroup" @click="showDropdownItem($event)"  style="margin-left:5px;cursor: pointer;">
            <Icon  type="chevron-down" size="11" v-show="!showDropdown"></Icon>
            <Icon  type="chevron-up" size="11" v-show="showDropdown"></Icon>
          </span>
          <span style="margin-left:20px;"></span>
      </div>
      <div class="kloudsync-content-part" id="kloudsync-content-part" v-show="showContent">
          <div class="message" ref="messageWrapper">
            <ul>
              <li  ref="messageList" v-for="item in messageList">
                <p class="time">
                  <span>{{timestampFormat(item.Time)}}</span>
                </p>
                <p class="time friendApply" v-if="item.ObjectName && item.ObjectName == 'UB:FriendMsg'">
                  <span>{{item.Content}}</span>
                </p>
                <p :class="{userName:!item.IsMy}" v-if="flag=='GROUP'&&!item.IsMy">
                  <span>{{item.UserName}}</span>
                </p>
                <div class="main" :class="{self:item.IsMy}" v-if="!item.ObjectName">
                    <Avatar class="avatar" :src="item.AvatarUrl"></Avatar>
                    <span class="loading-msg" v-if="item.loadingFlag==false">
                      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                    </span>
                  <div class="text messageRecord">
                    <p class="line" v-if="item.shareDocUrl !== undefined" @click="goToshareLive(item.shareDocUrl)" style="width:200px;cursor: pointer;position: relative;">
                        <Row>
                          <Col span="24">
                            <Row>
                              <Col span="24" style="font-size: 13px;font-weight:600;">{{item.Content}}</Col>
                            </Row>
                            <div style="width:100%;height:10px;"></div>
                            <Row>
                              <Col span="6">
                                <Avatar :src="item.shareDocAvatarUrl" style="border: 1px solid #ccc;"></Avatar>
                              </Col>
                              <Col span="18">
                                <Row><Col span="24"><p style="overflow: hidden; max-width:85px;text-overflow: ellipsis;white-space: nowrap;">{{item.shareDocUsername}}</p></Col></Row>
                                <div style="width:100%;height:5px;"></div>
                                <Row><Col span="24"><span style="display:inline-block;">{{item.shareDocTime}}</span></Col></Row>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <span style="display:block;position: absolute;bottom:0px;right:0px;">
                              <span v-if="item.shareDocThumbnailUrl!==''" style="display:block"><img :src="item.shareDocThumbnailUrl" width="60" height="60" alt=""/></span>
                              <span v-else style="display:block;margin-bottom:-8px"><Icon type="folder" size="50"></Icon></span>
                        </span>
                    </p>
                    <p class="line" v-else>
                      <span v-html="item.Content"></span>
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
      </div>
      <div class="footer-part" v-if="showContent" @click.stop="getFocus">
          <!-- 启动录音时相应的提示 -->
          <div class="recording" v-show="nowIsRecord">
            <div class="recording-left">
              <i class="recording-left-icon"></i>
              <span class="recording-left-span">{{recordTime.toFixed(2)}}s</span>
            </div>
            <div class="record-progress">
              <div class="record-progress record-progress2"></div>
            </div>
            <div class="recording-right">
              <!-- <a href="javascript:;" @click="cancelAudioMsgSend">取消</a>
              <a href="javascript:;" @click="sendAudioMsg">发送</a> -->
            </div>
            <div class="recording-overline"></div>
          </div>
          <div @click="showEmojiList($event)" :title="$t('ChatFloating.Emoji')" style="float:left;margin-left:12px;padding:10px 0px;cursor: pointer;"><img src="/static/preview/images/icon-face.svg" width="14" height="14" alt=""></div>
          <div style="float:left;margin-left:12px;padding:10px 0px;position: relative;cursor: pointer;overflow: hidden;" :title="$t('ChatFloating.Attachment')">
            <img src="/static/preview/images/icon-attach.svg" width="14" height="14" alt="">
            <div class="chat-upload">
              <input id="kloudsyncChatUpload"  type="file" @change="uploadInputChange(this);"  accept="video/mp4,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/pdf, application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
            </div>
          </div>
          <!--收藏按钮-->
          <div style="float:left;margin-left:12px;padding:10px 0px;cursor: pointer;" :title="$t('ChatFloating.Collection')">
            <Icon @click.stop="showCollection" type="heart" size="16"></Icon>
          </div>
          <!-- 录音按钮 -->
          <div style="float:left;margin-left:12px;padding:10px 0px;cursor: pointer;" @mousedown="startRecord" @mouseup="sendAudioMsg" :title="$t('ChatFloating.Recording')">
            <img :src="startAudioImg" alt="" width="14" height="14">
          </div>
          <div style="clear: both;"></div>
          <div ref="kloudsyncEmolist" v-show="showemojiList" style="position:absolute;bottom:122px; left:5px;width:260px;background-color:#ccc;padding:5px 2px;border: 0.5px solid #888888;text-align: left;">
            <div style="display: inline-block;cursor: pointer;width:20px;height:20px;text-align: center;font-size: 18px;" class="emoji" v-for="emoji in emojiList" :title="getEmojiTitle(emoji)" @mousedown="insertEmoji($event);" v-bind:key="emoji.emoji">{{emoji.emoji}}</div>
          </div>
          <textarea ref="sendMessages" v-model="sendMessage" type="text" :placeholder="$t('ChatFloating.PlaceHolderPleaseInput')" @keydown="enter($event)"></textarea>
          <div @click="Send($event)" style="float:right;margin-right:20px;margin-top:0px;cursor: pointer;">
            <Button size="small">
              <!-- <img src="/static/preview/images/icon-send.svg" width="14" height="14" alt=""> -->
                {{$t('ChatFloating.Send')}}</Button>
                <audio class="go-play" autoplay>播放</audio>
          </div>
      </div>
      <div class="personalInfo" v-show="!showContent && Connected === 'CONNECTED'">
          <div class="welcome-text">{{$t('ChatFloating.Welcome')}}, {{currentUser}}</div>
          <div class="personal-head">
            <img v-if="myHead==''" src="../../../static/images/user.svg" width="100" height="100" alt="" style="border-radius: 50%;"/>
            <img v-else :src="myHead" width="100" height="100" alt="" style="border-radius: 50%;"/>
          </div>
          <div>{{$t('ChatFloating.SearchToChat')}}</div>
      </div>
      <div class="connet-sever-loading-back-ground" v-show="Connected != 'CONNECTED'">
        <Spin fix>
          <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
          <div style="white-space: nowrap;">Connecting the chat server...</div>
        </Spin>
      </div>
    </div>
  </div>
  <!-- <div class="panel-gutter"></div> -->
  <Modal :title="$t('ChatFloating.AlertAddParticipantsTitle')"
    v-model="addNewGroup"
    okText="Ok"
    cancelText="Cancel"
    :closable="false"
    :mask-closable="false" width="400"
    :transfer="true"
    style="z-index: 4000; position: absolute;">
    <div class="group-content" id="kloudsync-user-checked">
      <ul v-for="users in friendList " :key="users.Index">
      <li style="padding:0px 16px;">{{users.Index}}</li>
      <li class="friend" v-for="friend in users.Users" :key="friend.RongCloudUserID">
        <div class="kloudsync-user-checked"><input type="checkbox" name="friendId" :id="friend.RongCloudUserID" :friendName="friend.Name"/></div>
        <div class="friend-head">
            <Avatar v-if="friend.AvatarUrl==''" src="../../../static/images/user.svg"></Avatar>
            <Avatar v-else  :src="friend.AvatarUrl"></Avatar>
        </div>
        <div class="user-name">{{friend.Name}}</div>
        <div style="clear: both;"></div>
        </li>
      </ul>
    </div>
    <div slot="footer">
      <Button @click="addGroupCancel">{{$t('Base.Cancel')}}</Button>
      <Button type="primary" @click="addGroupOK">{{$t('Base.OK')}}</Button>
    </div>
  </Modal>
  <Modal
    v-model="selectFromCollection"
    :title="$t('ChatFloating.SelectFromCollections')"
    :okText="$t('Base.OK')"
    :cancelText="$t('Base.Cancel')"
    :styles="{top: '210px'}"
    :mask-closable="false" width="600"
    :transfer="true"
    style="z-index: 4000; position: absolute;">
    <div class="collectionContent">
      <Table size="small" :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true"
        :data="filesData" :columns="filesColumn">
      </Table>
    </div>
    <div slot="footer" style="display:none">
    </div>
  </Modal>
  <audio id="kloudsyncPeerChatAudio"  autoplay></audio>
</div>
</template>

<style lang="scss">
.chat-flexviews{
  background-color: transparent;
  display: -webkit-box;
  display: -moz-box;
  display: box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flexbox;
  display: flex;
  // padding-top: 15px;
  // padding-bottom: 15px;
  // min-height: 200px;
  width: 100%;
  height: calc(100% - 68px);
  align-items: stretch;
  .panel-gutter {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    box-flex: 1;
    -webkit-flex: 1 0 15px;
    -moz-flex: 1 0 15px;
    -ms-flex: 1 0 15px;
    flex: 1 0 15px;
  }

  .panel-catalog {
    -webkit-box-flex: 0;
    -moz-box-flex: 0;
    box-flex: 0;
    -webkit-flex: 0 0 400px;
    -moz-flex: 0 0 400px;
    -ms-flex: 0 0 400px;
    flex: 0 0 400px;
    -webkit-box-pack: start;
    -moz-box-pack: start;
    box-pack: start;
    -webkit-justify-content: flex-start;
    -moz-justify-content: flex-start;
    -ms-justify-content: flex-start;
    -o-justify-content: flex-start;
    justify-content: flex-start;
    -ms-flex-pack: start;
    //margin-right: 15px;
    background-color: #ffffff;
    //box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    //border-radius: 3px;
    border-right: 1px solid #dddee1;
    position: relative;
    .left-part {
      width: 100%;
      height: 100%;
      // background-color: #ebebeb;
      .dragArea {
        padding: 6px 12px;
      }
      .card {
        padding: 0px 10px;
        // border-bottom: solid 1px #24272C;
        .chat-search-place {
          width: 100%;
          position: relative;
          // margin-top: 10px;
          .search {
            padding: 0 20px 0px 20px;
            width: 90%;
            font-size: 12px;
            color: #000000;
            line-height: 30px;
            border-radius: 4px;
            background-color: #ffffff;
            outline: none;
            height: 32px;
            border: 1px solid #dddee1;
          }
          .searchIcon {
            position: absolute;
            left: 24px;
            top: 0.5em;
            cursor: pointer;
          }
          .clearInput {
            position: absolute;
            right: 24px;
            top: 0.5em;
            cursor: pointer;
          }
          .add-Group {
            position: absolute;
            cursor: pointer;
            top: 0.5em;
            right:-4px;
          }
        }
        .head-footer-bar {
          margin-top: 10px;
          padding: 10px 0px;
          text-align: center;
          position: relative;
          height: 32px;
          .messegeNumber {
            font-size: 8px;
            color: white;
            position: absolute;
            background-color: red;
            width: 18px;
            height: 18px;
            left: 35%;
            top: -6px;
            border-radius: 50%;
            text-align: center;
            line-height: 18px;
          }
        }
        .avatar,
        .name {
          vertical-align: middle;
        }
        .avatar {
          border-radius: 2px;
        }
        .name {
          display: inline-block;
          margin: 0 0 0 15px;
          font-size: 16px;
        }
      }
      .recent-chat {
        padding-top: 10px;
        overflow: auto;
        height: calc(100% - 55px);
        &::-webkit-scrollbar {
          width: 10px;
          background: transparent;
          display: none;
        }
        &::-webkit-scrollbar-thumb {
          display: block;
          width: 10px;
          margin: 0 auto;
          border-radius: 10px;
          background: transparent;
          display: none;
        }
        &:hover {
          &::-webkit-scrollbar {
            width: 10px;
            background: #ebebeb;
            display: block;
          }
          &::-webkit-scrollbar-thumb {
            display: block;
            width: 10px;
            margin: 0 auto;
            border-radius: 10px;
            background: #c0c0c0;
          }
        }
        ul {
          cursor: pointer;
          list-style-type: none;
        }
        .recent-friend {
          padding: 5px 0px 5px 10px;
          height: 60px;
          position: relative;
          .recent-friend-head {
            padding: 5px;
            float: left;
          }
          .recent-friend-name {
            float: left;
            padding: 5px 0px 0px 5px;
          }
          .delete_rencent{
            float:right;
            padding: 15px 20px 0px 0px;
            display: none;
          }
          &:hover{
            .delete_rencent{
              display: block;
              float:right;
              padding: 15px 20px 0px 0px;
            }
          }
          .private-messageCount {
            font-size: 12px;
            color: white;
            position: absolute;
            background-color: red;
            width: 16px;
            height: 16px;
            left: 4px;
            top: 4px;
            border-radius: 50%;
            text-align: center;
            line-height: 16px;
          }
        }
        .bgColor {
          background-color: #dddddd;
          .delete_rencent{
            display: block;
            float:right;
            padding: 15px 20px 0px 0px;
          }
        }
      }
      .search-course-list {
        padding-top: 10px;
        ul {
          list-style-type: none;
        }
        .course {
          cursor: pointer;
          padding: 2px 0px 2px 15px;
          height: 50px;
          position: relative;
          .course-head {
            padding: 5px;
            float: left;
          }
          .course-name {
            float: left;
            padding: 5px 0px 0px 0px;
          }
        }
        .bgColor {
          background-color: #dddddd;
        }
      }
      .course-list {
        .addNewGroup {
          width: 100%;
          height: 30px;
          .addNewGroup-button {
            cursor: pointer;
            padding: 5px 10px 5px 10px;
            float: right;
            margin-right: 12px;
            border-radius: 10px;
            background-color: white;
            border: 1px solid #dddee1;
          }
        }
        .course-list-people {
          width: 100%;
          height: 100%;
          overflow: auto;
          ul {
            list-style-type: none;
          }
          .course {
            cursor: pointer;
            padding: 2px 0px 2px 15px;
            height: 50px;
            position: relative;
            .course-head {
              padding: 5px;
              float: left;
            }
            .course-name {
              float: left;
              padding: 5px 0px 0px 0px;
            }
          }
          .bgColor {
            background-color: #dddddd;
          }
        }
      }
      .search-friend-list {
        padding-top: 10px;
        &::-webkit-scrollbar {
          width: 10px;
          background: transparent;
          display: none;
        }
        &::-webkit-scrollbar-thumb {
          display: block;
          width: 10px;
          margin: 0 auto;
          border-radius: 10px;
          background: transparent;
          display: none;
        }
        &:hover {
          &::-webkit-scrollbar {
            width: 10px;
            background: #ebebeb;
            display: block;
          }
          &::-webkit-scrollbar-thumb {
            display: block;
            width: 10px;
            margin: 0 auto;
            border-radius: 10px;
            background: #c0c0c0;
          }
        }
        ul {
          cursor: pointer;
          list-style-type: none;
        }
        .bgColor {
          background-color: #dddddd;
        }
        .search-friend {
          cursor: pointer;
          padding: 5px 0px 5px 5px;
          height: 60px;
          position: relative;
          .search-friend-head {
            padding: 5px;
            float: left;
          }
          .search-friend-name {
            float: left;
            padding: 5px 0px 0px 5px;
          }
        }
      }
      .friend-list {
        padding-top: 10px;
        &::-webkit-scrollbar {
          width: 10px;
          background: transparent;
          display: none;
        }
        &::-webkit-scrollbar-thumb {
          display: block;
          width: 10px;
          margin: 0 auto;
          border-radius: 10px;
          background: transparent;
          display: none;
        }
        &:hover {
          &::-webkit-scrollbar {
            width: 10px;
            background: #ebebeb;
            display: block;
          }
          &::-webkit-scrollbar-thumb {
            display: block;
            width: 10px;
            margin: 0 auto;
            border-radius: 10px;
            background: #c0c0c0;
          }
        }
        ul {
          list-style-type: none;
        }

        .friend {
          cursor: pointer;
          padding: 8px 0px 8px 20px;
          position: relative;
          .friend-head {
            float: left;
          }
          .user-name {
            float: left;
            padding-left: 0.8em;
            padding-top: 9px;
            overflow: hidden;
            max-width: 300px;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .private-messageCount {
            font-size: 12px;
            color: white;
            position: absolute;
            background-color: red;
            width: 16px;
            height: 16px;
            left: 12px;
            top: 8px;
            border-radius: 50%;
            text-align: center;
            line-height: 16px;
          }
        }
        .bgColor {
          background-color: #dddddd;
        }
      }
    }
  }
  .panel-content {
    -webkit-box-flex: 5500;
    -moz-box-flex: 5500;
    box-flex: 5500;
    -webkit-flex: 5500 1 500px;
    -moz-flex: 5500 1 500px;
    -ms-flex: 5500 1 500px;
    flex: 5500 1 500px;
    //max-width: 1500px;
    min-width: 500px;

    background-color: #ffffff;
    //box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    //border-radius: 3px;

    .right-part {
      width: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
      height: 100%;
      .chat-groupName-down {
        position: absolute;
        top: 51px;
        left: 0px;
        width: 100%;
        height: 200px;
        background-color: #ffffff;
        overflow: auto;
        box-shadow: 0px 5px 5px #888888;
        z-index: 99;
        text-align: left;
        .groupName-item-top {
          width: 100%;
          height: 10px;
        }
        .groupName-item {
          display: inline-block;
          text-align: center;
          height: 60px;
          padding: 4px 10px;
          .groupName-item-head {
            height: 40px;
          }
          .groupName-item-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 60px;
            height: 20px;
          }
        }
      }
      .toolbar-header-part {
        flex: 0 0 50px;
        padding-top:15px;
        border-bottom: 1px solid #8b8b8b;
        flex-direction: column;
        vertical-align: middle;
        justify-content:center;
        align-items: center;
        span {
          display: inline-block;
        }
        .chat-groupName {
          max-width: calc(100% - 150px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 13px;
          font-weight: bold;
        }
        .rotatePic {
          transform: rotate(180deg);
          -ms-transform: rotate(180deg); /* IE 9 */
          -moz-transform: rotate(180deg); /* Firefox */
          -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
          -o-transform: rotate(180deg); /* Opera */
        }
      }
      .footer-part {
        position: absolute;
        bottom: 10px;
        left: 0px;
        width: 100%;
        background-color: #ffffff;
        border-top: 1px solid #e1e1e1;
        // background-color: #c0c0c0;
        vertical-align: middle;
        .recording {
          display: flex;
          position: absolute;
          top: -25px;
          width: 100%;
          height: 25px;
          background-color: rgb(223, 230, 236);
          .recording-left {
            z-index: 22;
            width: 15%;
            min-width: 70px;
            .recording-left-icon {
              float: left;
              width: 12px;
              background: red;
              border-radius: 50%;
              height: 12px;
              margin-top: 6px;
              margin-left: 6px;
              animation: recording 2s 30;
              -webkit-animation: recording 2s 30;
              -o-animation: recording 2s 30;
            }
            .recording-left-span {
              float: right;
              text-align: center;
              height: 100%;
              margin-right: 10px;
              line-height: 25px;
            }
            @-webkit-keyframes recording {
              0% {
                background: red;
              }
              25% {
                background: yellow;
              }
              50% {
                background: blue;
              }
              75% {
                background: green;
              }
              100% {
                background: red;
              }
            }
            @-o-keyframes recording {
              0% {
                background: red;
              }
              25% {
                background: yellow;
              }
              50% {
                background: blue;
              }
              75% {
                background: green;
              }
              100% {
                background: red;
              }
            }
            @keyframes recording {
              0% {
                background: red;
              }
              25% {
                background: yellow;
              }
              50% {
                background: blue;
              }
              75% {
                background: green;
              }
              100% {
                background: red;
              }
            }
          }
          .record-progress {
            content: "";
            height: 25px;
            width: 100%;
            z-index: 10;
            /*background-color: rgb(190,232,248);
            opacity: .5;
            border-radius: 60px;
            -webkit-transition: width 60s 0s ease-out,background-color 0s 0s ease-out;
            -o-transition: width 60s 0s ease-out,background-color 0s 0s ease-out;
            transition: width 60s 0s ease-out,background-color 0s 0s ease-out;
            .record-progress2{
              z-index: 10;
              width: 0%;
              height: 100%;
              content: "";
              opacity: .5;
              border-radius: 60px;
              background-color: red;
              animation:record 60s;
              -webkit-animation:record 60s;
              -o-animation:record 60s;
            }*/
          }
          .recording-right {
            min-width: 80px;
            width: 20%;
            z-index: 22;
            a {
              float: right;
              width: 30px;
              height: 100%;
              margin-right: 10px;
              line-height: 25px;
              text-decoration: none;
              text-align: center;
            }
          }
          .recording-overline {
            position: absolute;
            z-index: 20;
            height: 100%;
            width: 0%;
            opacity: 0.5;
            background-color: rgb(190, 232, 248);
            animation: record 60s;
            -webkit-animation: record 60s;
            -o-animation: record 60s;
          }
          @keyframes record {
            0% {
              width: 0%;
            }
            50% {
              width: 50%;
            }
            100% {
              width: 100%;
            }
          }
          @-webkit-keyframes record {
            0% {
              width: 0%;
            }
            50% {
              width: 50%;
            }
            100% {
              width: 100%;
            }
          }
          @-o-keyframes record {
            0% {
              width: 0%;
            }
            50% {
              width: 50%;
            }
            100% {
              width: 100%;
            }
          }
        }
        textarea {
          padding: 0px 10px;
          width: calc(100% - 20px);
          font-size: 13px;
          color: #000000;
          height: 50px;
          border-radius: 4px;
          // background-color: #c0c0c0;
          outline: none;
          border: none;
          resize: none;
          &::-webkit-scrollbar {
            width: 10px;
            background: transparent;
          }
          &::-webkit-scrollbar-thumb {
            display: block;
            width: 10px;
            margin: 0 auto;
            border-radius: 10px;
            background: transparent;
          }
          &:hover {
            &::-webkit-scrollbar {
              width: 10px;
              background: #ebebeb;
              display: block;
            }
            &::-webkit-scrollbar-thumb {
              display: block;
              width: 10px;
              margin: 0 auto;
              border-radius: 10px;
              background: #c0c0c0;
            }
          }
        }
        .chat-upload {
          cursor: pointer;
          position: absolute;
          width: 20px;
          height: 20px;
          left: 0px;
          top: 0px;
          #kloudsyncChatUpload {
            width: 20px;
            height: 20px;
            opacity: 0;
            filter: alpha(opacity=0);
            cursor: pointer;
            font-size: 0;
            outline: none;
          }
        }
      }
      .connet-sever-loading-back-ground{
        position: absolute;
        left: 0px;
        top:51px;
        display: flex;
        width: 100%;
        height: calc(100% - 51px);
        flex-direction: column;
        justify-content: center;
        align-items: center;
        align-content: center;
        background-color: rgba(55,55,55,.6);
        .demo-spin-icon-load{
          animation: ani-demo-spin 1s linear infinite;
        }
        @keyframes ani-demo-spin {
          from { transform: rotate(0deg);}
          50%  { transform: rotate(180deg);}
          to   { transform: rotate(360deg);}
        }
      }
      .personalInfo {
        display: flex;
        flex: 1 1 300px;
        max-height: calc(100% - 150px);
        flex-direction: column;
        justify-content: center;
        align-items: center;
        align-content: center;
        .welcome-text {
          font-weight: bold;
          font-size: 14px;
        }
        .personal-head {
          padding: 30px;
        }
      }
      .kloudsync-content-part {
        position: relative;
        max-height: calc(100% - 180px);
        overflow: auto;
        width: 100%;
        &::-webkit-scrollbar {
          width: 10px;
          background: transparent;
        }
        &::-webkit-scrollbar-thumb {
          display: block;
          width: 10px;
          margin: 0 auto;
          border-radius: 10px;
          background: transparent;
        }
        &:hover {
          &::-webkit-scrollbar {
            width: 10px;
            background: #ffffff;
          }
          &::-webkit-scrollbar-thumb {
            display: block;
            width: 10px;
            margin: 0 auto;
            border-radius: 10px;
            background: #c0c0c0;
          }
        }

        .message {
          padding: 20px 15px;
          overflow: hidden;
          li {
            margin-bottom: 15px;
            list-style-type: none;
          }
          .userName {
            margin: 0px 0px 3px 0px;
            text-align: left;
            > span {
              display: inline-block;
              font-size: 12px;
              padding: 0px 0px 0px 42px;
              color: #007eae;
              font-weight: bold;
            }
          }
          .time {
            margin: 7px 0;
            text-align: center;
            > span {
              display: inline-block;
              padding: 0 18px;
              font-size: 12px;
              color: #fff;
              border-radius: 2px;
              background-color: #dcdcdc;
            }
          }
          .friendApply{
            span{
              background-color: rgb(160,233,242);
              color:black;
              border-radius: 5px;
            }
             
          }
          .avatar {
            float: left;
            margin: 0 10px 0 0;
            border-radius: 50%;
          }
          .text {
            display: inline-block;
            position: relative;
            padding: 5px 10px;
            font-size: 12px;
            text-align: left;
            word-break: break-all;
            background-color: #d2d2d2;
            border-radius: 4px;
            color: #000000;
            .line {
              margin: 4px 0;
              padding: 0;
            }

            &:before {
              content: " ";
              position: absolute;
              top: 9px;
              right: 100%;
              border: 6px solid transparent;
              border-right-color: #d2d2d2;
            }
          }
          .main{
            text-align: left;
          }
          .self {
            text-align: right;
            .loading-msg {
              display: inline-block;
              margin: 0 5px 0 0;
              .demo-spin-icon-load {
                animation: ani-demo-spin 1s linear infinite;
              }
              @keyframes ani-demo-spin {
                from {
                  transform: rotate(0deg);
                }
                50% {
                  transform: rotate(180deg);
                }
                to {
                  transform: rotate(360deg);
                }
              }
            }
            .avatar {
              float: right;
              margin: 0 0 0 10px;
              border-radius: 50%;
            }
            .text {
              // max-width: 180px;
              background-color: #007eae;
              color: white;
              &:before {
                right: inherit;
                left: 100%;
                border-right-color: transparent;
                border-left-color: #007eae;
              }
            }
          }
        }
      }
    }
  }
}
</style>

<script>
import auth from "../../authenticator";
import friends from "../../friends";
import webapi from "../../webapi/webapi.js";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import recordAudio from "../chat/recordAudio.js";
import speakBotContent from "../chat/speakBotContent.js";
import util from "../../common/util.js";
var Base64 = require("js-base64").Base64;
var MyStorage = sessionStorage;
export default {
  data() {
    return {
      sharePeople:{ptUserId:'',RongCloudUserID:'',peopleName:''},
      shareTitle:"",
      shareTime:'',
      liveShareFile:{attachmentId:'',attachmentName:'',docUrl:""},
      shareAvatarUrl:'',
      liveLessonShareSelect:false,
      shareDocModal:false,
      selectFromCollection:false,
      nowIsRecord: false,
      recorder: null, //获取录音设备
      kloudsyncPeerChatAudio: null,
      botName: "PeerBot", //机器人名称
      botHeadImg: "/static/preview/images/PeerBot.png", //机器人头像
      startAudioImg: require("../../assets/images/startaudio.png"), //录音图标
      showSearch: false,
      flag: "", //群组或单人聊天的标志
      addNewGroup: false,
      showContent: false,
      showGroup: false,
      showDropdown: false,
      isRotate: true,
      groupName: "",
      RongCloudUserID: -1,
      shareToUserId:-1,
      changeRed: -1,
      changeCourseBg: -1,
      currentMenu: "recentChat",
      searchKey: "",
      isMy: true,
      myHead: "",
      userID: 0,
      messageList: [],
      showemojiList: false,
      emojiList: [],
      dragX: 0,
      dragY: 0,
      clickX: 0,
      clickY: 0,
      sendMessage: "",
      currentUser: auth.getUserName(),
      showContactList: true,
      recentlist: [],
      searchRecentlist: [],
      friendList: [],
      searchflist: [],
      couserList: [],
      seachCouserList: [],
      detailCouserList: [],
      privateMessageCount: "",
      UnreadMessegeIDList: [],
      totalUnreadCount: 0,
      showClearInput: false,
      mettingClassRoom: false,
      recordTime: 0,
      speakTime: "",
      playAudioMessage: [],
      filesData: [],
      filesColumn: [
        {
          title: this.$t("Files.Title"),
          key: 'title'
        },
        {
          title: this.$t("Files.FileName"),
          key: 'file',
          // render: (h, params) => {
          //   return h('a', {attrs: { title: 'download "' + params.row.file + '"', href: params.row.download, download: 'download',target:'_blank'}}, params.row.file);
          // }
        },
        {
          title: this.$t("Files.Date"),
          key: 'date',
          width: 150
        },
        {
          title: " ",
          key: "action",
          width: 70,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  class: "table-action-icon",
                  attrs: { title:this.$t('ChatFloating.Share')  },
                  on: {
                    click: () => {
                      this.handShareClick(params.row);
                    }
                  }
                },
                [
                  h("Icon", {
                    props: { type: "android-share", size: "16", color: "#19be6b" }
                  })
                ]
              ),
            ]);
          }
        }
      ],
    };
  },
  watch: {
    createCourseFlag(newval) {
      if (newval) {
        this.$nextTick(function() {
          this.getMyGroups();
        });
      }
    },
    shareDoc: {
        deep: true,
        handler: function (newVal){
          let obj=newVal;
          if(obj.attachmentId!=""){
            this.$nextTick(function(){
              this.reconnectInit().then((res)=>{
                this.liveLessonShareSelect=true;
                this.liveShareFile.attachmentId=obj.attachmentId;
                this.liveShareFile.attachmentName=obj.attachmentName;
                
                //获取自动分享封面
                let str=obj.attachmentUrl;
                let index=str.lastIndexOf("/");
                let cstr=str.substring(index + 1, str .length);
                let index2=cstr.lastIndexOf(".");
                let str2=cstr.substring(0,index2);
                let index3=str2.lastIndexOf("_");
                let str3=str2.substring(index3+1,str2.length);
                str=str.substring(0,index+1)+cstr.replace(eval("/"+str3+"/g"),'1_2K');
                this.liveShareFile.docUrl=str;
              });
            });
          }
      }
    }
  },
  created() {
    this.init();
    recordAudio();
    document.body.addEventListener("click",this.hideEmo);
  },
  computed: {
    ...mapState(["lessonID", "classRoomRouteName", "createCourseFlag","Connected","shareDoc"])
  },
  mounted() {
    this.kloudsyncPeerChatAudio = document.getElementById("kloudsyncPeerChatAudio");
    let self = this;
    
    this.watchVlue();
    this.reconnectInit().then((res)=>{
      if(res === 0){
        return;
      }else{
        this.getRonYunTalkList().then((res)=>{
          if(res===0){
            return;
          }
          self.$nextTick(()=>{
            self.contactToChat();
            self.liveShareToChat();
          })
        });
      }
    });
    this.currentUser = auth.getUserName();
    friends.getFriendsSortList((friends)=> {
      let result = friends;
      this.friendList = result;
    });
    this.readData();
    this.updatedMessage();
    this.getMyGroups();

    //监听网络状态，重连融云
    window.ononline=()=>{
      setTimeout(() => {
        self.reconnectInit();
      }, 3000);
    }
    window.onoffline=()=>{
      self.changeConnected("");
    }

  },
  beforeDestroy () {
    document.body.removeEventListener("click",this.hideEmo);
  },
  methods: {
    // 利用融云获取会话列表
    getRonYunTalkList(){
      return new Promise((resolve,reject)=>{
        let self = this;
        this.recentlist = [];
        RongIMClient.getInstance().getConversationList({
          onSuccess: function(list) {
            resolve(list);
            if(list.length==0){
              return;
            }
            let sendUserIdList = [];
            for(let item of list){
              if(item.conversationType == 1){
                let recentgMsg = {};
                switch (item.objectName) {
                  case 'RC:TxtMsg':
                    recentgMsg = {
                      Time: item.sentTime,
                      RongCloudUserID: item.targetId,
                      AvatarUrl: "",
                      UserName:  "",
                      Content: RongIMLib.RongIMEmoji.symbolToEmoji(item.latestMessage.content.content),
                      flag: "PRIVATE",
                    };
                    break;
                  case 'RC:ImgMsg':
                    recentgMsg = {
                      Time: item.sentTime,
                      RongCloudUserID: item.targetId,
                      AvatarUrl: "",
                      UserName: "",
                      Content: self.$t('ChatFloating.picture'),
                      flag: "PRIVATE",
                    };
                    break;
                  case 'UB:UBShareDocMessageType':
                    recentgMsg = {
                      Time: item.sentTime,
                      RongCloudUserID: item.targetId,
                      AvatarUrl: "",
                      UserName: "",
                      Content: self.$t('ChatFloating.ShareDocumentMessage'),
                      flag: "PRIVATE",
                    };
                    break;
                  case 'UB:FriendMsg':
                    recentgMsg = {
                      Time: item.sentTime,
                      RongCloudUserID: item.targetId,
                      AvatarUrl: "",
                      UserName: "",
                      Content: self.$t('ChatFloating.AddFriendApply'),
                      flag: "PRIVATE",
                    };
                    break;
                  default:
                    break;
                }
                self.recentlist.push(recentgMsg);
                sendUserIdList.push(item.targetId);
              }else if(item.conversationType == 3){
                let recentgMsg = {};
                switch (item.objectName) {
                  case 'RC:TxtMsg':
                    recentgMsg = {
                      Time: item.sentTime,
                      RongCloudUserID: item.targetId,
                      AvatarUrl: "/static/preview/images/group-default.svg",
                      UserName: "",
                      Content: RongIMLib.RongIMEmoji.symbolToEmoji(item.latestMessage.content.content),
                      flag: "GROUP",
                    };
                    break;
                  case 'RC:ImgMsg':
                    recentgMsg = {
                      Time: item.sentTime,
                      RongCloudUserID: item.targetId,
                      AvatarUrl: "/static/preview/images/group-default.svg",
                      UserName: "",
                      Content: self.$t('ChatFloating.picture'),
                      flag: "GROUP",
                    };
                    break;
                  case 'UB:UBShareDocMessageType':
                    recentgMsg = {
                      Time: item.sentTime,
                      RongCloudUserID: item.targetId,
                      AvatarUrl: "/static/preview/images/group-default.svg",
                      UserName: "",
                      Content: self.$t('ChatFloating.ShareDocumentMessage'),
                      flag: "GROUP",
                    };
                    break;
                  default:
                    break;
                }
                self.recentlist.push(recentgMsg);
              }
            }
            webapi.getUserInfoByRongID(sendUserIdList).then(info => {
              if (info == null) {
                return;
              }
              for(let p of info){
                let person = p;
                let id = person.RongCloudID
                for(let m of self.recentlist){
                  if(m.RongCloudUserID == id){
                    m.AvatarUrl =  person.AvatarUrl?person.AvatarUrl:"../../../static/images/user.svg";
                    m.UserName =   person.UserName;
                  }
                }
              }
            });
            //syncroom的融云list
            webapi.getMyRongYunGroupList().then(list=>{
              if (list == null) {
                return;
              }
              for(let group of list){
                for(let m of self.recentlist){
                  if(m.RongCloudUserID == ("Classroom-"+group.GroupID)){
                    m.UserName = group.GroupName;
                  }
                }
              }
            });
            
            //peertime里面群组的list
            let url = GetAPIUrl() + "ChatGroup/GetMyGroups?type=0";
            self._getData(url, null, function(result) {
              for(let group of result){
                for(let m of self.recentlist){
                  if(m.RongCloudUserID == (group.GroupID)){
                    m.UserName = group.GroupName;
                  }
                }
              }
            })
            self.sortRentList();
              // list => 会话列表集合
          }
          ,
          onError: function(error) {
              // do something
              resolve(0);
          }
        }, null);
      })
    },

    // 利用融云获取syncroom聊天记录。
    showHistoryMessage2(RongCloudUserID,flag){
      return new Promise((resolve,reject)=>{
        util.LoadJsFiles(["../../../static/RongcloudJs/RongIMLib-2.4.0.js","../../../static/RongcloudJs/RongEmoji-2.2.7.js"])
        .then(() => {
          let messageList =[];
          let conversationType;
          if (flag == "GROUP") {
            conversationType = RongIMLib.ConversationType.GROUP;
          } else if (flag == "PRIVATE") {
            conversationType = RongIMLib.ConversationType.PRIVATE;
          }
          let targetId = RongCloudUserID + ""; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id
          let timestrap = 0; // 默认传 null，若从头开始获取历史消息，请赋值为 0, timestrap = 0;
          let count = 20; // 每次获取的历史消息条数，范围 0-20 条，可以多次获取
          RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
              onSuccess: function(list, hasMsg) {
                // console.warn(list);
                let myRongCloudID = MyStorage.getItem("RongCloudID");
                let sendUserIdList = [];
                let mMist = [];
                for(let item of list){
                  var msg = {};
                  switch (item.objectName) {
                    case 'RC:TxtMsg':
                      msg = {
                        IsMy: myRongCloudID == item.senderUserId,
                        Time: item.sentTime,
                        AvatarUrl:"",
                        UserName:"",
                        ID:"",
                        SenderUserId: item.senderUserId,
                        Content: RongIMLib.RongIMEmoji.symbolToEmoji(item.content.content).replace(/\n/g,"<br/>"),
                      };
                      break;
                    case 'RC:ImgMsg':
                      msg = {
                        IsMy: myRongCloudID == item.senderUserId,
                        Time: item.sentTime,
                        AvatarUrl:"",
                        UserName:"",
                        ID:"",
                        SenderUserId: item.senderUserId,
                        Content: "<img src='data:image/png;base64," +item.content.content +"' width='100' height='" +this.height * (this.width / 100) +"'/>",
                      };
                      break;
                    case 'UB:UBShareDocMessageType':
                      msg = {
                          IsMy: myRongCloudID == item.senderUserId,
                          Time: item.sentTime,
                          AvatarUrl:"",
                          UserName:"",
                          ID:"",
                          SenderUserId: item.senderUserId,
                          Content: RongIMLib.RongIMEmoji.symbolToEmoji(item.content.shareDocTitle),
                        };
                      msg.shareDocUrl = item.content.shareDocUrl;
                      msg.shareDocThumbnailUrl = item.content.shareDocThumbnailUrl;
                      msg.shareDocAvatarUrl = item.content.shareDocAvatarUrl;
                      msg.shareDocUsername = item.content.shareDocUsername;
                      msg.shareDocTime = item.content.shareDocTime;
                      msg.attachmentID = item.content.attachmentID;
                      break;
                    case 'UB:FriendMsg':
                      msg = {
                        IsMy: myRongCloudID == item.senderUserId,
                        Time: item.sentTime,
                        AvatarUrl:"",
                        UserName:"",
                        ID:"",
                        SenderUserId: item.senderUserId,
                        Content: item.content.message.content.messageContent,
                        ObjectName:'UB:FriendMsg',
                      };
                      break;
                    default:
                      break;
                  }
                  mMist.push(msg);
                  sendUserIdList.push(item.senderUserId);
                }
                webapi.getUserInfoByRongID(sendUserIdList).then(info => {
                  if (info == null) {
                    return;
                  }
                  for(let p of info){
                    let person = p;
                    let id = person.RongCloudID
                    for(let m of mMist){
                      if(m.SenderUserId == id){
                        m.AvatarUrl =  person.AvatarUrl?person.AvatarUrl:"../../../static/images/user.svg";
                        m.UserName =   person.UserName;
                        m.ID = person.UserID;
                      }
                    }
                  }
                  resolve(mMist);
                });
                
                // list => Message 数组。
                // hasMsg => 是否还有历史消息可以获取。
              },
              onError: function(error) {
                  console.log('GetHistoryMessages, errorcode:' + error);
                  resolve(0)
              }
          });
        });

      })
    },
    chooseActiveChat(e) {
      this.searchKey="";
      this.currentMenu = "recentChat";
      this.searchAllList(e);
    },
    chooseActiveContact(e) {
      this.searchKey="";
      this.currentMenu = "friendList";
      this.searchAllList(e);
    },
    chooseActiveCourse(e) {
      this.searchKey="";
      this.currentMenu = "courseList";
      this.searchAllList(e);
    },
    hideEmo(e){
      if(this.$refs.kloudsyncEmolist){
        if(!this.$refs.kloudsyncEmolist.contains(e.target)){
            this.showemojiList = false;
        }
      }
    },
    contactToChat(){
      let person=this.$route.params.contactPerson;
      let userId;
      let rongCloudUserID;
      let name;
      if(typeof(person)!="undefined" && person.type=='contact'){
        userId=person.userId;
        rongCloudUserID=person.rongCloudUserID;
        name=person.name;
        this.chooseFriend(userId,rongCloudUserID,name);
      }
    },
    liveShareToChat(){
      let person=this.$route.params.shareDocToPerson;
      let shareTitle;
      let href;
      let shareDocThumbnailUrl;
      let shareDocAvatarUrl;
      let shareDocUsername;
      let shareDocTime;
      let attachmentID;
      let userId;
      let rongCloudUserID;
      let name;
      if(typeof(person)!="undefined" && person.type=='shareDocModal'){
        shareTitle=person.shareTitle;
        href=person.href;
        shareDocThumbnailUrl=person.shareDocThumbnailUrl;
        shareDocAvatarUrl=person.shareDocAvatarUrl;
        shareDocUsername=person.shareDocUsername;
        shareDocTime=person.shareDocTime;
        attachmentID=person.attachmentID;
        userId=person.toUserId;
        rongCloudUserID=person.toRongCloudUserID;
        name=person.toUserName;
        this.chooseFriend(userId,rongCloudUserID,name);
        this.SendShareDocMessage(shareTitle,href,shareDocThumbnailUrl,shareDocAvatarUrl,shareDocUsername,shareDocTime,attachmentID);
        let shareFile={attachmentId:"",attachmentName:"",attachmentUrl:""};
        this.changeKloudsyncShareDoc(shareFile);
      }
    },
    goToshareLive(url){
      // let routeName=this.$router.currentRoute.name;
      // let id=url.split("attachment")[1].split("/")[1];
      // if(routeName == "live" || routeName=="view"){
      //   this.$Message.warning({content:this.$t("ChatFloating.AlertClassroomChangeContent"),duration: 3});
      // }else{
      //   this.$router.push({ path:'/attachment/'+ id});
      // }
      let id=url.split("attachment")[1].split("/")[1];
      let routeData = this.$router.resolve({
         path:'/attachment/'+ id,
      });
      window.open(routeData.href, '_blank');
    },
    formatShareTime(){
      let date=new Date();
      return date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDate();
    },
    handShareClick(row){
      // this.shareDocModal=true;
      webapi.GetShareDocumentKey(row.detail.AttachmentID,this.shareToUserId,row.title).then((result)=>{
        this.selectFromCollection=false;
        let href=window.location.href.split("//")[0]+window.location.href.split("//")[1].split("/")[0];
        let shareDocThumbnailUrl="";//自定义上传图片的缩略图Url
        let shareDocAvatarUrl=this.myHead;//分享人头像
        let shareDocUsername=this.currentUser;//分享人的姓名
        let shareDocTime=this.formatShareTime();//分享时间
        let attachmentID=row.detail.AttachmentID;//文档的attachmentID
        this.SendShareDocMessage(row.title,href+"/attachment/"+attachmentID,shareDocThumbnailUrl,shareDocAvatarUrl,shareDocUsername,shareDocTime,attachmentID);
      });
    },
    reconnectInit(){
      return new Promise((resolve,reject)=>{
        setTimeout(() => {
          if(this.Connected!="CONNECTED"){
            setTimeout(() => {
              this.initWebapi().then(userId=>{
              if(userId!=0){
                  resolve("suceess");
                }else{
                  resolve(0)
                }
              });
            }, 500);
          }else{
            resolve("suceess");
          }
        }, 500);
      })
    },
    //自定义消息发送
    SendShareDocMessage(docTtitle,docUrl,ThumbnailUrl,AvatarUrl,Username,Time,attachmentId){
      var myDate = new Date();
      let msg = {
        IsMy: true,
        Time: myDate.getTime(),
        ID: auth.getUserID(),
        AvatarUrl: this.myHead,
        UserName: this.currentUser,
        Content: docTtitle,
        loadingFlag: true,
        shareDocUrl:docUrl,
        shareDocThumbnailUrl:ThumbnailUrl,
        shareDocAvatarUrl:AvatarUrl,
        shareDocUsername:Username,
        shareDocTime:Time,
        attachmentID:attachmentId
      };
      var messageContent = new RongIMClient.RegisterMessage.ShareDocMessage({shareDocTitle:docTtitle,shareDocUrl:docUrl,shareDocThumbnailUrl:ThumbnailUrl,shareDocAvatarUrl:AvatarUrl,shareDocUsername:Username,shareDocTime:Time,attachmentID:attachmentId});
      let conversationtype;
      let targetId = this.RongCloudUserID + ""; // 目标 Id，根据不同的 ConversationType，可能是用户 Id、群组 Id
      if (this.flag == "PRIVATE") {
        this.sendMessage = "";
        msg.loadingFlag = false;
        if (this.messageList.length < 20) {
          this.messageList.push(msg);
        } else {
          this.messageList.shift();
          this.messageList.push(msg);
        }
        this.updatedMessage();
        conversationtype = RongIMLib.ConversationType.PRIVATE; //单聊。
        RongIMClient.getInstance().sendMessage(conversationtype,targetId,messageContent, {
            onSuccess: message => {
              this.messageList.pop();
              msg.loadingFlag = true;
              this.messageList.push(msg);
              this.updatedMessage();
              this.saveRecentList(targetId,this.$t('ChatFloating.ShareDocumentMessage'));
              //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
            },
            onError: (errorCode, message) => {
              var info = "";
              switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                  info = "超时";
                  this.changeConnected("");
                  this.reconnectToRonYun();
                  break;
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                  info = "未知错误";
                  break;
                case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                  info = "在黑名单中，无法向对方发送消息";
                  break;
                case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                  info = "不在讨论组中";
                  break;
                case RongIMLib.ErrorCode.NOT_IN_GROUP:
                  info = "不在群组中";
                  break;
                case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                  info = "不在聊天室中";
                  break;
                default:
                  info = x;
                  break;
              }
              console.log("发送失败:" + info);
            }
          }
        );
      } else if (this.flag == "GROUP") {
        this.sendMessage = "";
        msg.loadingFlag = false;
        if (this.messageList.length < 20) {
          this.messageList.push(msg);
        } else {
          this.messageList.shift();
          this.messageList.push(msg);
        }
        this.updatedMessage();
        conversationtype = RongIMLib.ConversationType.GROUP; //群聊。
        RongIMClient.getInstance().sendMessage(conversationtype,targetId,messageContent,{
            onSuccess: message => {
              this.messageList.pop();
              msg.loadingFlag = true;
              this.messageList.push(msg);
              this.updatedMessage();
              // if (targetId.indexOf("Classroom-") == -1) {
                this.saveRecentList(targetId,this.$t('ChatFloating.ShareDocumentMessage'));
              // }
              //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
            },
            onError: (errorCode, message) => {
              var info = "";
              switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                  info = "超时";
                  this.changeConnected("");
                  this.reconnectToRonYun();
                  break;
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                  info = "未知错误";
                  break;
                case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                  info = "在黑名单中，无法向对方发送消息";
                  break;
                case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                  info = "不在讨论组中";
                  break;
                case RongIMLib.ErrorCode.NOT_IN_GROUP:
                  info = "不在群组中";
                  break;
                case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                  info = "不在聊天室中";
                  break;
                default:
                  info = x;
                  break;
              }
              console.log("发送失败:" + info);
            }
          }
        );
      } 
    },
    _attachment2File: function (attachment) {
      let date = new Date(parseInt(attachment.CreatedDate));
      return {
        id: attachment.ItemID,
        title: attachment.Title,
        file: attachment.Title,
        date: date.Format("yyyy-MM-dd hh:mm:ss"),
        download: attachment.SourceFileUrl,
        detail: attachment
      };
    },
    readMyFilesData(){
      let self = this;
      let url = GetAPIUrl() + "FavoriteAttachment/MyFavoriteAttachments?type=0&schoolID=-1";
      this._getData(url, () => {
        self.filesData = [];
      }, (data) => {
        let list = data.DocumentList;
        for(let i = 0; i < list.length; i++) {
          let attachment = list[i];
          let file = self._attachment2File(attachment);
          self.filesData.push(file);
        }
      });
    },
    showCollection(){
      this.selectFromCollection=true;
      this.readMyFilesData();
    },
    delete_oneRencent(id,e){

      let arrayHelp=this.recentlist;

      for(let i=0;i<arrayHelp.length;i++){
        if(id==arrayHelp[i].RongCloudUserID){

          //融云删除会话
          var conversationType;
          if (arrayHelp[i].flag == "GROUP") {
            conversationType = RongIMLib.ConversationType.GROUP;
          } else if (arrayHelp[i].flag == "PRIVATE") {
            conversationType = RongIMLib.ConversationType.PRIVATE;
          }
          var targetId = id+"";
          let self = this;
          RongIMClient.getInstance().removeConversation(conversationType, targetId, {
              onSuccess: function(bool) {
                  // 删除会话成功
                arrayHelp.splice(i,1);
                self.recentlist = arrayHelp;
                self.$Message.info({content:self.$t('ChatFloating.DeleteSuccess'),duration: 3});
              },
              onError: function(error){
                  // error => 删除会话的错误码
              }
          });

          break;
        }
      }
      e.stopPropagation();
    },
    //点击录音按钮开始录音
    startRecord() {
      clearInterval(this.speakTime);
      HZRecorder.get(
        function(rec) {
          if(rec==false){
            return;
          }
          this.nowIsRecord = true;
          this.recorder = rec;
          this.recorder.start();
          this.speakTime = setInterval(() => {
            if (parseFloat(this.recordTime) < 60) {
                this.recordTime = parseFloat(this.recordTime + 0.01);
              } else {
                clearInterval(this.speakTime);
                this.recordTime = 60;
              }
            }, 10);
            $(".record-progress").css("width", "100%");
        }.bind(this)
      );
    },
    //播放当前录制的音频
    playRecording() {
      this.recorder.play(this.kloudsyncPeerChatAudio);
    },
    //取消录音
    cancelAudioMsgSend() {
      clearInterval(this.speakTime);
      this.recordTime = 0;
      this.nowIsRecord = false;
    },
    //发送录音消息
    sendAudioMsg() {
      HZRecorder.get(res=>{
        if(res==false){
          return;
        }
        clearInterval(this.speakTime);
        this.recordTime = 0;
        this.nowIsRecord = false;
        //请求后台的语音转文字接口
        this.getAfterApiTra();
      })
      // this.recorder.play(this.kloudsyncPeerChatAudio); 播放当前录音
    },
    goToTheRoom(msg) {
      //判断是否是进入房间的消息
      var joinRoomReg = /进入\d+房间/g;
      if (joinRoomReg.test(msg)) {
        //获取房间号
        var roomNum = /\d+/.exec(msg);
        //进入房间
        this.$router.push({ name: "live", params: { id: roomNum } });
        return true;
      } else {
        return false;
      }
    },
    //请求后台语音转文字的接口
    getAfterApiTra(params) {
      // $.ajax({
      // type: "post",
      // url: "http://192.168.22.109/XunfWebAPI/api/Voice/VoiceContent",
      // data: { "": "UklGRiRAAABXQVZ/3UA" },
      // success: function (data, status) {}
      // });

      console.log(this.recorder.getBlob());
      this.recorder.upload(
        "",
        function(res) {
          this.sendMessage = res;
          // let msg = {
          //   IsMy: true,
          //   Time: new Date().getTime(),
          //   ID: auth.getUserID(),
          //   AvatarUrl: this.myHead,
          //   UserName: this.currentUser,
          //   Content: res
          // };
          // this.messageList.push(msg);
          // this.sendMsgToBot(res);
        }.bind(this)
      );
    },
    zeroize(num) {
      return (String(num).length == 1 ? "0" : "") + num;
    },
    timestampFormat(timestamp) {
      var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
      var timestampDiff = curTimestamp - parseInt(timestamp / 1000); // 参数时间戳与当前时间戳相差秒数
      var curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
      var tmDate = new Date(parseInt(timestamp / 1000) * 1000); // 参数时间戳转换成的日期对象
      var Y = tmDate.getFullYear(),
        m = tmDate.getMonth() + 1,
        d = tmDate.getDate();
      var H = tmDate.getHours(),
        i = tmDate.getMinutes(),
        s = tmDate.getSeconds();

      if (timestampDiff < 3600 && H > 12) {
        // 一小时前之内
        return "下午" + this.zeroize(H) + ":" + this.zeroize(i);
      } else if (timestampDiff < 3600 && H <= 12) {
        return "上午" + this.zeroize(H) + ":" + this.zeroize(i);
      } else if (
        curDate.getFullYear() == Y &&
        curDate.getMonth() + 1 == m &&
        curDate.getDate() == d &&
        H > 12
      ) {
        return "今天下午" + this.zeroize(H) + ":" + this.zeroize(i);
      } else if (
        curDate.getFullYear() == Y &&
        curDate.getMonth() + 1 == m &&
        curDate.getDate() == d &&
        H <= 12
      ) {
        return "今天上午" + this.zeroize(H) + ":" + this.zeroize(i);
      } else {
        var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
        if (
          newDate.getFullYear() == Y &&
          newDate.getMonth() + 1 == m &&
          newDate.getDate() == d &&
          H > 12
        ) {
          return "昨天下午" + this.zeroize(H) + ":" + this.zeroize(i);
        } else if (
          newDate.getFullYear() == Y &&
          newDate.getMonth() + 1 == m &&
          newDate.getDate() == d &&
          H <= 12
        ) {
          return "昨天上午" + this.zeroize(H) + ":" + this.zeroize(i);
        } else if (curDate.getFullYear() == Y) {
          return (
            this.zeroize(m) +
            "月" +
            this.zeroize(d) +
            "日 " +
            this.zeroize(H) +
            ":" +
            this.zeroize(i)
          );
        } else {
          return (
            Y +
            "年" +
            this.zeroize(m) +
            "月" +
            this.zeroize(d) +
            "日 " +
            this.zeroize(H) +
            ":" +
            this.zeroize(i)
          );
        }
      }
    },
    clearInputText(e) {
      this.searchKey = "";
      this.showClearInput = false;
      this.searchAllList(e);
    },
    showClearText() {
      this.showClearInput = true;
    },
    getTotalUnreadCount() {
      let self = this;
      var conversationTypes = [
        RongIMLib.ConversationType.PRIVATE,
        RongIMLib.ConversationType.GROUP
      ];
      RongIMClient.getInstance().getConversationUnreadCount(conversationTypes, {
        onSuccess: function(count) {
          // count => 多个会话的总未读数
          let counts = count;
          self.totalUnreadCount = counts;
        },
        onError: function(error) {
          // error => 获取多个会话未读数错误码。
        }
      });
      return self.totalUnreadCount;
    },
    searchAllList(e) {
      let searchStr = this.searchKey;
      let searchStr1 = searchStr.toUpperCase();
      if (searchStr == "") {
        this.showSearch = false;
        this.showClearInput = false;
        return;
      } else {
        this.showSearch = true;
      }
      //朋友列表搜索
      let arrylist = this.friendList;
      let array = [];
      for (let i = 0; i < arrylist.length; i++) {
        for (let j = 0; j < arrylist[i].Users.length; j++) {
          let fname1 = arrylist[i].Users[j].Name.toUpperCase();
          if (fname1.indexOf(searchStr1) != -1) {
            array.push(arrylist[i].Users[j]);
          }
        }
      }
      this.searchflist = array;

      //最近聊天搜索列表
      let recentArray = this.recentlist;
      let rArray = [];
      for (let z = 0; z < recentArray.length; z++) {
        let rname1 = recentArray[z].UserName.toUpperCase();
        if (rname1.indexOf(searchStr1) != -1) {
          rArray.push(recentArray[z]);
        }
      }
      this.searchRecentlist = rArray;

      //群组列表搜索
      let groupArray = this.couserList;
      let gArray = [];
      for (let k = 0; k < groupArray.length; k++) {
        let gname1 = groupArray[k].GroupName.toUpperCase();
        if (gname1.indexOf(searchStr1) != -1) {
          gArray.push(groupArray[k]);
        }
      }
      this.seachCouserList = gArray;
      e.stopPropagation();
    },
    //换账号登陆时，清空上次用户操作信息并返回所有默认值
    watchVlue() {
      this.sharePeople.ptUserId="";
      this.sharePeople.RongCloudUserID="";
      this.sharePeople.peopleName="";
      this.shareAvatarUrl="",
      this.showSearch = false;
      this.flag = "";
      this.addNewGroup = false;
      this.showContent = false;
      this.showGroup = false;
      this.showDropdown = false;
      this.isRotate = true;
      this.groupName = "";
      this.RongCloudUserID = -1;
      this.shareToUserId=-1;
      this.changeRed = -1;
      this.changeCourseBg = -1;
      this.currentMenu = "recentChat";
      this.searchKey = "";
      this.isMy = true;
      this.myHead = "";
      this.userID = 0;
      this.messageList = [];
      this.showemojiList = false;
      this.emojiList = [];
      this.dragX = 0;
      this.dragY = 0;
      this.clickX = 0;
      this.clickY = 0;
      this.sendMessage = "";
      this.currentUser = auth.getUserName();
      this.showContactList = true;
      this.recentlist = [];
      this.searchRecentlist = [];
      this.friendList = [];
      this.searchflist = [];
      this.couserList = [];
      this.seachCouserList = [];
      this.detailCouserList = [];
      this.privateMessageCount = "";
      this.UnreadMessegeIDList = [];
      this.totalUnreadCount = 0;
      this.showClearInput = false;
      this.mettingClassRoom = false;
      $("#chat-window").parent().css({ top: 100, left: "35%" });
      $("#chat-floating-window").css({left: "auto",top: "auto",right: "24px",bottom: "19px"});
      this.selectFromCollection=false;
    },
    getGroupDetail() {
      let self = this;
      let url = "";
      let currentRongCloudUserID = self.RongCloudUserID +"";
      if(currentRongCloudUserID.indexOf("Classroom-") >= 0){
        url = GetAPIUrl() +"ChatGroup/SyncRoomGroupDetail?groupID=" + self.RongCloudUserID.split("-")[1];
      }else{
        url = GetAPIUrl() +"ChatGroup/GetGroupDetail?GroupID=" + self.RongCloudUserID;
      }
      self._getData(url, null, function(result) {
        let couserDetailList = result.GroupMembers;
        self.detailCouserList = couserDetailList;
      });
    },
    addGroupOK() {
      let myRongCloudID = MyStorage.getItem("RongCloudID");
      let str = auth.getUserName() + ",";
      let userIDs = myRongCloudID + ",";
      let arry = new Array();
      arry.push(myRongCloudID);
      $("#kloudsync-user-checked").find("input[name='friendId']:checkbox").each(function() {
          let isChecked = $(this).prop("checked");
          if (isChecked == true) {
            let id = $(this).attr("id") + "";
            str += $(this).attr("friendName") + ",";
            userIDs += id + ",";
            arry.push(id);
          }
        });
      str = str.substring(0, str.length - 1);
      userIDs = userIDs.substring(0, userIDs.length - 1);
      let url = GetAPIUrl() + "ChatGroup/CreateGroup";
      let data = {
        UserIDs: userIDs,
        GroupName: str
      };
      if (arry.length > 2) {
        this._postData(url,data,null,result => {
            this.addNewGroup = false;
            $("#kloudsync-user-checked").find("input[name='friendId']:checkbox").each(function() {
                $(this).prop("checked", false);
              });
            this.getMyGroups();
            this.saveRecentGroup(result.GroupID, "Successful creation");
            this.changeCourseBg = result.GroupID;
          }, null);
      }else if(arry.length == 2){
        this.addNewGroup = false;
        $("#kloudsync-user-checked").find("input[name='friendId']:checkbox").each(function() {
            $(this).prop("checked", false);
        });
        this.saveRecentPrivate(arry[1], "");
        this.changeRed = arry[1];
      }
    },
    getMyGroups() {
      let self = this;
      let url = GetAPIUrl() + "ChatGroup/GetMyGroups?type=2"; //0拿所有，1是普通，2是course创建的
      self._getData(url, null, function(result) {
        let couserList = result;
        self.couserList = couserList.reverse();
      });
    },
    addGroupCancel() {
      this.addNewGroup = false;
      $("#kloudsync-user-checked").find("input[name='friendId']:checkbox").each(function() {
          $(this).prop("checked", false);
      });
    },
    addNewGroupModel() {
      if(this.Connected != 'CONNECTED'){
        this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: "Not connected to chat sever, please wait patiently", top: 24,duration: 4, left:true });
        return
      }

      if (this.currentMenu === "recentChat") {
        this.addNewGroup = true;
      }else{
        this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t('ChatFloating.AlertPleaseSelectDiscussionGroup'), top: 24,duration: 4, left:true });
      }
    },
    updatedMessage() {
      this.$nextTick(function() {
        var div = document.getElementById("kloudsync-content-part");
        if(div){
          div.scrollTop = div.scrollHeight;
        }
      });
    },
    showDropdownItem(e) {
      if (this.showDropdown == false) {
        this.showDropdown = true;
      } else {
        this.showDropdown = false;
      }
      // e.stopPropagation();
    },
    chooseRecent(ptUserId,rid, rName, flag) {
      let rflag = flag;
      let rcid = rid;
      let rcName = rName;
      if (rflag == "PRIVATE") {
        this.chooseFriend(ptUserId,rcid, rcName);
      } else if (rflag == "GROUP") {
        this.chooseCouser(rcid, rcName);
      }
    },
    chooseFriend(ptUserId,id, groupName) {
      this.flag = "PRIVATE";
      this.changeCourseBg = -1;
      this.groupName = groupName;
      this.changeRed = id;
      this.messageList = [];
      this.RongCloudUserID = id;
      this.shareToUserId = ptUserId;//私人共享文件

      let self = this;
      setTimeout(() => {
        this.showHistoryMessage2(self.RongCloudUserID,'PRIVATE').then((res)=>{
          if(res==0){
            return;
          }
          self.messageList = res;
          self.updatedMessage();
        });
      }, 200);
      
      this.clearPrivateMessageCount(id);
      this.showContent = true;
      this.showGroup = false;
      this.showDropdown = false;
    },
    chooseBot(name) {
      this.flag = "Bot";
      this.changeRed = -1;
      this.changeCourseBg = name;
      this.groupName = name;
      this.messageList = [];
      this.showContent = true;
      this.showGroup = false;
      this.showDropdown = false;
      this.RongCloudUserID = -2;
      this.shareToUserId=-1;
    },
    chooseCouser(couserId, couserName) {
      this.flag = "GROUP";
      this.changeRed = -1;
      this.groupName = couserName;
      this.changeCourseBg = couserId;
      this.messageList = [];
      this.RongCloudUserID = couserId;
      this.shareToUserId = 0;//所有人都能点击共享的文件

      let self = this;
      setTimeout(()=>{
        this.showHistoryMessage2(self.RongCloudUserID,'GROUP').then((res)=>{
          if(res==0){
            return;
          }
          self.messageList = res;
          self.updatedMessage();
        });
      },200)

      this.clearPrivateMessageCount(couserId);
      this.showContent = true;
      this.showGroup = true;
      this.getGroupDetail();
    },
    enter(ev) {
      if (ev.keyCode == 13 && !ev.ctrlKey) {
        ev.returnValue = false;
        this.Send(ev);
        ev.preventDefault();
      } else if (ev.ctrlKey && ev.keyCode == 13) {
        let ctrlEnter = "\n";
        this.sendMessage += ctrlEnter;
        this.$refs.sendMessages.focus();
      }
      ev.stopPropagation();
    },
    init() {
      util.LoadJsFiles(["../../../static/RongcloudJs/RongIMLib-2.4.0.js","../../../static/RongcloudJs/RongEmoji-2.2.7.js"]).then(()=>{
         this.InitClient();
         this.InitEmoji();
      })
    },
    sortRentList() {
      this.recentlist.sort(function(a, b) {
        var value1 = a["Time"];
        var value2 = b["Time"];
        return value2 - value1;
      });
    },
    saveRecentPrivate(targetId, content){
      let sendUserId = targetId;
      let contents = content;
      let self = this;
       webapi.getUserInfoByRongID([sendUserId]).then(info => {
          if (info != null) {
            let recentMsg = {
              Time: Date.parse(new Date()),
              RongCloudUserID: sendUserId,
              AvatarUrl:
              info[0].AvatarUrl == ""? "../../../static/images/user.svg": info[0].AvatarUrl,
              UserName: info[0].UserName,
              Content: contents,
              flag: "PRIVATE",
              ptUserID:info[0].UserID
            };
            let rencentArray = self.recentlist;
            if (rencentArray.length > 0) {
              for (let i = 0; i < rencentArray.length; i++) {
                if (rencentArray[i].RongCloudUserID == sendUserId) {
                  //替换已有
                  rencentArray.splice(i, 1, recentMsg);
                } else {
                  rencentArray.push(recentMsg);
                }
              }
              //去重
              let arrayHelp = [];
              for (let j = 0; j < rencentArray.length; j++) {
                if (arrayHelp.indexOf(rencentArray[j]) == -1) {
                  arrayHelp.push(rencentArray[j]);
                }
              }
              self.recentlist = arrayHelp;
            } else {
              self.recentlist.push(recentMsg);
            }
            self.sortRentList();
          }
        });
    },
    saveRecentGroup(targetId, content){
      let sendUserId = targetId;
      let contents = content;
      let self = this;
      let url = GetAPIUrl() + "ChatGroup/GetMyGroups?type=0";
      self._getData(url, null, function(result) {
          let couserList = result;
          let groupList = couserList.reverse();
          let groupName;
          for (let k = 0; k < groupList.length; k++) {
            if (sendUserId == groupList[k].GroupID) {
              groupName = groupList[k].GroupName;
            }
          }
          let recentgMsg = {
            Time: Date.parse(new Date()),
            RongCloudUserID: sendUserId,
            AvatarUrl: "/static/preview/images/group-default.svg",
            UserName: groupName,
            Content: contents,
            flag: "GROUP",
          };
          let rencentArray = self.recentlist;
          if (rencentArray.length > 0) {
            for (let i = 0; i < rencentArray.length; i++) {
              if (rencentArray[i].RongCloudUserID == sendUserId) {
                //替换已有
                rencentArray.splice(i, 1, recentgMsg);
              } else {
                rencentArray.push(recentgMsg);
              }
            }
            //去重
            let arrayHelp = [];
            for (let j = 0; j < rencentArray.length; j++) {
              if (arrayHelp.indexOf(rencentArray[j]) == -1) {
                arrayHelp.push(rencentArray[j]);
              }
            }
            self.recentlist = arrayHelp;
          } else {
            self.recentlist.push(recentgMsg);
          }
          self.sortRentList();
        });

    },
    saveRecentList(targetId, content) {
      let self=this;
      if (self.flag == "PRIVATE") {
        self.saveRecentPrivate(targetId, content);
      } else if (self.flag == "GROUP") {
        self.saveRecentGroup(targetId, content);
      }
    },
    //判断输入字符串是否为空或者全部都是空格
    isNull(str) {
      if (str && !/^\s+$/.test(str)) {
        return false;
      } else {
        return true;
      }
    },
    Send(e) {
      var myDate = new Date();
      let msg = {
        IsMy: true,
        Time: myDate.getTime(),
        ID: auth.getUserID(),
        AvatarUrl: this.myHead,
        UserName: this.currentUser,
        Content: this.sendMessage,
        loadingFlag: true
      };
      if (this.isNull(msg.Content) || this.RongCloudUserID == -1) {
        return;
      }
      let myRongCloudID = MyStorage.getItem("RongCloudID");
      let messageContent = new RongIMLib.TextMessage({
        content: this.sendMessage,
        extra: myRongCloudID
      });
      let conversationtype;
      let targetId = this.RongCloudUserID + ""; // 目标 Id，根据不同的 ConversationType，可能是用户 Id、群组 Id
      if (this.flag == "PRIVATE") {
        this.sendMessage = "";
        msg.loadingFlag = false;
        if (this.messageList.length < 20) {
          this.messageList.push(msg);
        } else {
          this.messageList.shift();
          this.messageList.push(msg);
        }
        this.updatedMessage();
        this.replaceBr();
        conversationtype = RongIMLib.ConversationType.PRIVATE; //单聊。
        RongIMClient.getInstance().sendMessage(conversationtype,targetId,messageContent,{
            onSuccess: message => {
              this.messageList.pop();
              msg.loadingFlag = true;
              this.messageList.push(msg);
              this.updatedMessage();
              this.saveRecentList(targetId, message.content.content);
              this.replaceBr();
              //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
            },
            onError: (errorCode, message) => {
              var info = "";
              switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                  info = "超时";
                  this.changeConnected("");
                  this.reconnectToRonYun();
                  break;
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                  info = "未知错误";
                  break;
                case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                  info = "在黑名单中，无法向对方发送消息";
                  break;
                case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                  info = "不在讨论组中";
                  break;
                case RongIMLib.ErrorCode.NOT_IN_GROUP:
                  info = "不在群组中";
                  break;
                case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                  info = "不在聊天室中";
                  break;
                default:
                  info = x;
                  break;
              }
              console.log("发送失败:" + info);
            }
          }
        );
      } else if (this.flag == "GROUP") {
        this.sendMessage = "";
        msg.loadingFlag = false;
        if (this.messageList.length < 20) {
          this.messageList.push(msg);
        } else {
          this.messageList.shift();
          this.messageList.push(msg);
        }
        this.updatedMessage();
        this.replaceBr();
        conversationtype = RongIMLib.ConversationType.GROUP; //群聊。
        RongIMClient.getInstance().sendMessage(conversationtype, targetId,messageContent,{
            onSuccess: message => {
              this.messageList.pop();
              msg.loadingFlag = true;
              this.messageList.push(msg);
              this.updatedMessage();
              // if (targetId.indexOf("Classroom-") == -1) {
                this.saveRecentList(targetId, message.content.content);
              // }
              this.replaceBr();
              //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
            },
            onError: (errorCode, message) => {
              var info = "";
              switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                  info = "超时";
                  this.changeConnected("");
                  this.reconnectToRonYun();
                  break;
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                  info = "未知错误";
                  break;
                case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                  info = "在黑名单中，无法向对方发送消息";
                  break;
                case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                  info = "不在讨论组中";
                  break;
                case RongIMLib.ErrorCode.NOT_IN_GROUP:
                  info = "不在群组中";
                  break;
                case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                  info = "不在聊天室中";
                  break;
                default:
                  info = x;
                  break;
              }
              console.log("发送失败:" + info);
            }
          }
        );
      } else if (this.flag == "Bot") {
        let nowmsg = this.sendMessage;
        //判断是否要进入房间
        if (this.goToTheRoom(nowmsg)) {
          return;
        }
        //发送内容  uniqueLee
        this.messageList.push(msg);
        this.updatedMessage();
        this.sendMessage = "";
        this.sendMsgToBot(nowmsg);
        return;
      }

      e.stopPropagation();
    },
    replayMsgToUser(id) {
      var num = parseInt(id.split("|")[1]) + 1;
      $.ajax({
        url:"https://directline.botframework.com/v3/directline/conversations/3qprO91tUkgFRAZTdb6rPj/activities",
        type: "get",
        beforeSend: function(xhr) {
          xhr.setRequestHeader(
            "Authorization",
            "Bearer AtI_QF93Lyo.cwA.2Dg.bOhGvdCxY1Fo_kOs6ronW0cBuutC6ummvuje8QHfbr4"
          );
        },
        headers: {
          "Content-Type": "application/json",
          Authorization:"Bearea AtI_QF93Lyo.dAA.SgB1ADkAdwBDAEoAawBXAFAAOAB0AEMAYgAwADQAZgBGAGUAOQA0ADYASgA.yAsDtLVJ1AE.JSc2fryuhp8.hgfhZwYS-vMP1tnl5piTCNuf2aDpUTxXQGt2qW-9-eo"
        },
        success: res => {
          console.log(res.activities, "返回的消息");
          if (res.activities[res.activities.length - 1].id == id) {
            window.setTimeout(() => {
              this.replayMsgToUser(id);
            }, 2000);

            return;
          }
          //清空上次存放的回复消息列表
          this.playAudioMessage = [];
          for (let [i, v] of res.activities.entries()) {
            if (v.replyToId == id) {
              let str="";
              if(typeof(v.attachments)!= "undefined" && v.attachments.length!=0){
                str+="<br/>";
                for(let item of v.attachments[0].content.buttons){
                  str+='<p style="margin-top:10px"><button class="botName-'+item.value+'" style="width:150px;height:18px;cursor: pointer;">'+item.value+'</button></p>';
                }
              }
      
              let replayMsg = v.text+str;
              var myDate = new Date();
              let msg = {
                IsMy: false,
                Time: myDate.getTime(),
                ID: auth.getUserID(),
                AvatarUrl: this.botHeadImg,
                UserName: this.botName,
                Content: replayMsg
              };
              this.playAudioMessage.push(replayMsg);
              this.messageList.push(msg);
            }
          }
          this.updatedMessage();
          //处理语音的逻辑
          this.nowIndex = 0;
          // this.playReplayMsg();//注释机器人回复播放语音

          //客服机器人三个按钮的id绑定对应事件
          this.$nextTick(()=>{
            $(".botName-xiaoyu").on('click',()=> {
                this.sendMsgToBot("xiaoyu");
            })
            $(".botName-hurrry").on('click',()=> {
                this.sendMsgToBot("hurrry");
            })
            $(".botName-jiawei").on('click',()=> {
                this.sendMsgToBot("jiawei");
            })
          })
        }
      });
    },
    //播放回复的语音列表 调用后台接口
    playReplayMsg() {
      var str = this.playAudioMessage[this.nowIndex];
      str = Base64.encode(str);
      console.log(str);
      var audio = new Audio("https://testapi.peertime.cn/BotService/api/Voice/Get?Text=" +encodeURIComponent(str));
      audio.play();
      this.nowIndex++;
      if (this.nowIndex < this.playAudioMessage.length) {
        audio.onended = this.playReplayMsg;
      }
      // $.ajax({
      //   url:"https://test.peertime.cn/BotService/api/Voice/ContentToVoice/"+this.playAudioMessage[this.nowIndex],
      //   type:"get",
      //   // data:this.playAudioMessage[this.nowIndex],
      //   success:function(res){
      //     this.nowIndex++;
      //     var
      //     if(this.nowIndex<this.playAudioMessage.length){
      //       audio.ended=playReplayMsg;
      //     }
      //   }
      // });
    },
    sendMsgToBot(sendMsg) {
      var sendObj = {
        type: "message",
        from: {
          id: "user1"
        },
        text: sendMsg
      };
      $.ajax({
        url: "https://directline.botframework.com/v3/directline/conversations/3qprO91tUkgFRAZTdb6rPj/activities",
        type: "post",
        contentType: "application/json; charset=utf-8",
        beforeSend: function(xhr) {
          xhr.setRequestHeader(
            "Authorization",
            "Bearer AtI_QF93Lyo.cwA.2Dg.bOhGvdCxY1Fo_kOs6ronW0cBuutC6ummvuje8QHfbr4"
          );
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearea AtI_QF93Lyo.dAA.SgB1ADkAdwBDAEoAawBXAFAAOAB0AEMAYgAwADQAZgBGAGUAOQA0ADYASgA.yAsDtLVJ1AE.JSc2fryuhp8.hgfhZwYS-vMP1tnl5piTCNuf2aDpUTxXQGt2qW-9-eo"
        },
        data: JSON.stringify(sendObj),
        success: res => {
          this.replayMsgToUser(res.id);
        }
      });
    },
    insertEmoji(evt) {
      var tar = evt.currentTarget;
      this.sendMessage = this.sendMessage + $(tar).html();
      this.showemojiList = false;
      this.$refs.sendMessages.focus();
      evt.preventDefault();
    },
    getFocus() {
      if(this.$refs.sendMessages){
        this.$refs.sendMessages.focus();
      }
    },
    getEmojiTitle(emoji) {
      return emoji.symbol.replace("[", "").replace("]", "");
    },
    showEmojiList(e) {
      if (this.showemojiList == true) {
        this.showemojiList = false;
        return;
      }
      if (this.emojiList.length == 0) {
        var list = RongIMLib.RongIMEmoji.list;
        this.emojiList = list;
      }
      this.showemojiList = true;
      e.stopPropagation();
    },
    //注册自定义消息
    registerMessageObj(){
      var messageName = "ShareDocMessage"; // 消息名称。
      var objectName = "UB:UBShareDocMessageType"; // 消息内置名称，请按照此格式命名。
      var isCounted = true; // 消息计数
      var isPersited = true; // 消息保存
      var mesasgeTag = new RongIMLib.MessageTag(isCounted,isPersited);// 消息是否保存是否计数，true true 计数且保存，false false 不计数不保存
      var prototypes = ["shareDocTitle","shareDocUrl","shareDocThumbnailUrl","shareDocAvatarUrl","shareDocUsername","shareDocTime","attachmentID"]; // 消息类中的属性名。
      RongIMClient.registerMessageType(messageName,objectName,mesasgeTag,prototypes);
    },
    InitClient() {
      RongIMLib.RongIMClient.init(GetRongCloudAppKey(),null,{
        protobuf:'../../../static/RongcloudJs/protobuf-2.3.4.min.js'
      });
      this.registerMessageObj();
      RongIMClient.setConnectionStatusListener({
        onChanged: status => {
          switch (status) {
            case RongIMLib.ConnectionStatus.CONNECTED:
              console.log("链接成功");
              this.changeConnected("CONNECTED");
              break;
            case RongIMLib.ConnectionStatus.CONNECTING:
              console.log("正在链接");
              this.changeConnected("");
              break;
            case RongIMLib.ConnectionStatus.DISCONNECTED:
              console.log("断开连接");
              this.changeConnected("");
              break;
            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
              console.log("其他设备登录");
              this.$Notice.warning({title:this.$t("ChatFloating.NotificationTitle"),desc: this.$t("ChatFloating.OtherDeviceLogin"),duration: 3,bottom: 60,left: true});
              this.changeConnected("");
              break;
            case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
              console.log("域名不正确");
              this.changeConnected("");
              break;
            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
              console.log("网络不可用");
              this.changeConnected("");
              this.reconnectToRonYun();
              break;
          }
        }
      });

      // 消息监听器
      RongIMClient.setOnReceiveMessageListener({
        // 接收到的消息
        onReceived: message => {
          //console.log(message);
          // 判断消息类型
          switch (message.messageType) {
            case RongIMClient.MessageType.TextMessage:
              this.onReceiveMessage(message);
              // this.messageList.push(message.content.extra);
              // message.content.content => 消息内容
              break;
            case RongIMClient.MessageType.VoiceMessage:
              // 对声音进行预加载
              // message.content.content 格式为 AMR 格式的 base64 码
              break;
            case RongIMClient.MessageType.ImageMessage:
              // message.content.content => 图片缩略图 base64。
              // message.content.imageUri => 原图 URL。
              this.onReceiveMessage(message);
              break;
            case RongIMClient.MessageType.DiscussionNotificationMessage:
              // message.content.extension => 讨论组中的人员。
              break;
            case RongIMClient.MessageType.LocationMessage:
              // message.content.latiude => 纬度。
              // message.content.longitude => 经度。
              // message.content.content => 位置图片 base64。
              break;
            case RongIMClient.MessageType.RichContentMessage:
              // message.content.content => 文本消息内容。
              // message.content.imageUri => 图片 base64。
              // message.content.url => 原图 URL。
              break;
            case RongIMClient.MessageType.InformationNotificationMessage:
              // do something...
              break;
            case RongIMClient.MessageType.ContactNotificationMessage:
              // do something...
              break;
            case RongIMClient.MessageType.ProfileNotificationMessage:
              // do something...
              break;
            case RongIMClient.MessageType.CommandNotificationMessage:
              // do something...
              break;
            case RongIMClient.MessageType.CommandMessage:
              // do something...
              break;
            case RongIMClient.MessageType.UnknownMessage:
              // do something...
              this.onReceiveMessage(message);
              break;
            case RongIMClient.MessageType.ShareDocMessage:
              // do something...
              this.onReceiveMessage(message);
              break;  
            default:
            // do something...
          }
        }
      });
    },
    initWebapi() {
      let self = this;
      return new Promise((resolve,reject)=>{
        util.LoadJsFiles(["../../../static/RongcloudJs/RongIMLib-2.4.0.js","../../../static/RongcloudJs/RongEmoji-2.2.7.js"]).then(()=>{
         webapi.getRongCloudUserToken().then(obj => {
          let objUserToken;
          if (obj != null) {
            MyStorage.setItem("RongCloudID", obj.RongCloudUserID);
            objUserToken = obj.UserToken;
          } else {
            return;
          }
          RongIMClient.connect(objUserToken, {
            onSuccess: userId => {
              if (userId == "undefined") {
                window.location.reload();
              }
              resolve(userId);
              console.warn("Connect successfully." + userId);
            },
            onTokenIncorrect: () => {
              console.warn("token无效");
              resolve(0);
            },
            onError: errorCode => {
              var info = "";
              switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                  info = "超时";
                  self.changeConnected("");
                  self.reconnectToRonYun();
                  break;
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                  info = "未知错误";
                  break;
                case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                  info = "不可接受的协议版本";
                  break;
                case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                  info = "appkey不正确";
                  break;
                case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                  info = "服务器不可用";
                  break;
              }
              console.error("ErrorCode:" + errorCode);
              resolve(0);
            }
          });
          });
        })
      })
    },
    reconnectToRonYun(){
      var callback = {
        onSuccess: userId => {
          console.log("Reconnect successfully." + userId);
        },
        onTokenIncorrect: () => {
          console.log("token无效");
        },
        onError: errorCode => {
          console.log(errorcode);
        }
      };
      var config = {
        // 默认 false, true 启用自动重连，启用则为必选参数
        auto: true,
        // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
        url: "cdn.ronghub.com/RongIMLib-2.4.0.min.js",
        // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
        rate: [100, 1000, 3000, 6000, 10000]
      };
      RongIMClient.reconnect(callback, config);
    },
    clearPrivateMessageCount(sendUserId) {
      var targetId = sendUserId + "";
      let clearArry = this.UnreadMessegeIDList;
      for (let i = 0; i < clearArry.length; i++) {
        if (clearArry[i].unReadId == targetId) {
          clearArry.splice(i, 1);
        }
      }
      this.UnreadMessegeIDList = clearArry;
      var conversationType;
      if (this.flag == "GROUP") {
        conversationType = RongIMLib.ConversationType.GROUP;
      } else if (this.flag == "PRIVATE") {
        conversationType = RongIMLib.ConversationType.PRIVATE;
      }
      let self = this;
      RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
        onSuccess: function(result) {
          // 清除未读消息成功。
          if (result) {
            self.getTotalUnreadCount();
          }
        },
        onError: function(error) {
          // error => 清除未读消息数错误码。
        }
      });
    },
    onReceiveMessage(message) {
      let sendUserId;
      let conversationType;
      let messageInnerContent;
      let messageInnerShareDocUrl;
      let shareDocThumbnailUrl;
      let shareDocAvatarUrl;
      let shareDocUsername;
      let shareDocTime;
      let attachmentID;
      // console.log("图",message);
      if(message.messageType=="ImageMessage"){
         messageInnerContent="<img src='data:image/png;base64," + message.content.content + "' width='100' height='"+this.height*(this.width/100)+"'/>"
      }else if(message.messageType=="TextMessage"){
         messageInnerContent=message.content.content;
      }else if(message.messageType=="UnknownMessage"){
        messageInnerContent=message.content.message.content.messageContent;
      }else if(message.messageType=="ShareDocMessage"){
         messageInnerContent=message.content.shareDocTitle;
         messageInnerShareDocUrl=message.content.shareDocUrl;
         shareDocThumbnailUrl=message.content.shareDocThumbnailUrl;
         shareDocAvatarUrl=message.content.shareDocAvatarUrl;
         shareDocUsername=message.content.shareDocUsername;
         shareDocTime=message.content.shareDocTime;
         attachmentID=message.content.attachmentID;
      }
      // 二人单聊会话类型，枚举值为 1 。
      if (message.conversationType == 1) {
        sendUserId = message.senderUserId;
        conversationType = RongIMLib.ConversationType.PRIVATE;
        if (sendUserId != this.RongCloudUserID) {
          this.getTotalUnreadCount();
          let self = this;
          RongIMLib.RongIMClient.getInstance().getUnreadCount(conversationType,sendUserId,{
              onSuccess: function(count) {
                // count => 指定会话的总未读数
                let counts = count;
                let unReadIdObj = {
                  unReadId: sendUserId,
                  unreadCounts: counts
                };
                let unreadArray = self.UnreadMessegeIDList;
                if (unreadArray.length > 0) {
                  for (let i = 0; i < unreadArray.length; i++) {
                    if (unreadArray[i].unReadId == sendUserId) {
                      //替换已有
                      unreadArray.splice(i, 1, unReadIdObj);
                    } else {
                      unreadArray.push(unReadIdObj);
                    }
                  }
                  //去重
                  let arrayHelp = [];
                  for (let j = 0; j < unreadArray.length; j++) {
                    if (arrayHelp.indexOf(unreadArray[j]) == -1) {
                      arrayHelp.push(unreadArray[j]);
                    }
                  }
                  self.UnreadMessegeIDList = arrayHelp;
                } else {
                  self.UnreadMessegeIDList.push(unReadIdObj);
                }
              },
              onError: function() {
                // error => 获取指定会话未读数错误码。
              }
            }
          );
        } else {
          let self = this;
          RongIMClient.getInstance().clearUnreadCount(conversationType,sendUserId,{
              onSuccess: function() {
                // 清除未读消息成功。
                self.getTotalUnreadCount();
                RongIMLib.RongIMClient.getInstance().getUnreadCount(
                  conversationType,
                  sendUserId,
                  {
                    onSuccess: function(count) {
                      // count => 指定会话的总未读数
                      let counts = count;
                      let unReadIdObj = {
                        unReadId: sendUserId,
                        unreadCounts: counts
                      };
                      let unreadArray = self.UnreadMessegeIDList;
                      if (unreadArray.length > 0) {
                        for (let i = 0; i < unreadArray.length; i++) {
                          if (unreadArray[i].unReadId == sendUserId) {
                            //替换已有
                            unreadArray.splice(i, 1, unReadIdObj);
                          } else {
                            unreadArray.push(unReadIdObj);
                          }
                        }
                        //去重
                        let arrayHelp = [];
                        for (let j = 0; j < unreadArray.length; j++) {
                          if (arrayHelp.indexOf(unreadArray[j]) == -1) {
                            arrayHelp.push(unreadArray[j]);
                          }
                        }
                        self.UnreadMessegeIDList = arrayHelp;
                      } else {
                        self.UnreadMessegeIDList.push(unReadIdObj);
                      }
                    },
                    onError: function() {
                      // error => 获取指定会话未读数错误码。
                    }
                  }
                );
              },
              onError: function(error) {
                // error => 清除未读消息数错误码。
              }
            }
          );
        }
        webapi.getUserInfoByRongID([sendUserId]).then(info => {
          if (info == null) {
            return;
          }
          var myDate = new Date();
          let chatObjectmsg = {
            IsMy: false,
            Time: message.sentTime,
            ID: info[0].UserID,
            AvatarUrl:info[0].AvatarUrl == ""? "../../../static/images/user.svg" : info[0].AvatarUrl,
            UserName: info[0].UserName,
            Content: RongIMLib.RongIMEmoji.symbolToEmoji(messageInnerContent),
          };
          //分享文件,收到的消息字段
          if(message.messageType=="ShareDocMessage"){
            chatObjectmsg.shareDocUrl=messageInnerShareDocUrl;
            chatObjectmsg.shareDocThumbnailUrl=shareDocThumbnailUrl;
            chatObjectmsg.shareDocAvatarUrl=shareDocAvatarUrl;
            chatObjectmsg.shareDocUsername=shareDocUsername;
            chatObjectmsg.shareDocTime=shareDocTime;
            chatObjectmsg.attachmentID=attachmentID;
          }else if(message.messageType=="UnknownMessage"){
            chatObjectmsg.ObjectName = 'UB:FriendMsg';
          }

          //如果发送方是当前选中的人
          if(sendUserId == this.RongCloudUserID){
            this.messageList.push(chatObjectmsg)
          }
          this.updatedMessage();
        });
        if(message.messageType=="ImageMessage"){
          this.saveRecentPrivate(sendUserId,this.$t('ChatFloating.picture'));
        }else if(message.messageType=="TextMessage"){
          this.saveRecentPrivate(sendUserId,RongIMLib.RongIMEmoji.symbolToEmoji(messageInnerContent));
        }
        // else if(message.messageType=="UnknownMessage"){
        //   this.saveRecentPrivate(sendUserId,'[Friends Application]');
        // }
        else if(message.messageType=="ShareDocMessage"){
          this.saveRecentPrivate(sendUserId,this.$t('ChatFloating.ShareDocumentMessage'));
        }
        this.replaceBr();
      } else if (message.conversationType == 3) {
        //RongIMLib.ConversationType.GROUP : 群组会话类型，枚举值为 3
        let groupId = message.targetId;
        sendUserId = message.senderUserId;
        conversationType = RongIMLib.ConversationType.GROUP;
        if (groupId != this.RongCloudUserID) {
          this.getTotalUnreadCount();
          let self = this;
          RongIMLib.RongIMClient.getInstance().getUnreadCount(conversationType, groupId,{
              onSuccess: function(count) {
                // count => 指定会话的总未读数
                let counts = count;
                let unReadIdObj = { unReadId: groupId, unreadCounts: counts };
                let unreadArray = self.UnreadMessegeIDList;
                if (unreadArray.length > 0) {
                  for (let i = 0; i < unreadArray.length; i++) {
                    if (unreadArray[i].unReadId == groupId) {
                      //替换已有
                      unreadArray.splice(i, 1, unReadIdObj);
                    } else {
                      unreadArray.push(unReadIdObj);
                    }
                  }
                  //去重
                  let arrayHelp = [];
                  for (let j = 0; j < unreadArray.length; j++) {
                    if (arrayHelp.indexOf(unreadArray[j]) == -1) {
                      arrayHelp.push(unreadArray[j]);
                    }
                  }
                  self.UnreadMessegeIDList = arrayHelp;
                } else {
                  self.UnreadMessegeIDList.push(unReadIdObj);
                }
              },
              onError: function() {
                // error => 获取指定会话未读数错误码。
              }
            }
          );
        } else {
          let self = this;
          RongIMClient.getInstance().clearUnreadCount(conversationType,groupId,{
              onSuccess: function() {
                // 清除未读消息成功。
                self.getTotalUnreadCount();
                RongIMLib.RongIMClient.getInstance().getUnreadCount(
                  conversationType,
                  groupId,
                  {
                    onSuccess: function(count) {
                      // count => 指定会话的总未读数
                      let counts = count;
                      let unReadIdObj = {
                        unReadId: groupId,
                        unreadCounts: counts
                      };
                      let unreadArray = self.UnreadMessegeIDList;
                      if (unreadArray.length > 0) {
                        for (let i = 0; i < unreadArray.length; i++) {
                          if (unreadArray[i].unReadId == groupId) {
                            //替换已有
                            unreadArray.splice(i, 1, unReadIdObj);
                          } else {
                            unreadArray.push(unReadIdObj);
                          }
                        }
                        //去重
                        let arrayHelp = [];
                        for (let j = 0; j < unreadArray.length; j++) {
                          if (arrayHelp.indexOf(unreadArray[j]) == -1) {
                            arrayHelp.push(unreadArray[j]);
                          }
                        }
                        self.UnreadMessegeIDList = arrayHelp;
                      } else {
                        self.UnreadMessegeIDList.push(unReadIdObj);
                      }
                    },
                    onError: function() {
                      // error => 获取指定会话未读数错误码。
                    }
                  }
                );
              },
              onError: function(error) {
                // error => 清除未读消息数错误码。
              }
            }
          );
        }
        webapi.getUserInfoByRongID([sendUserId]).then(info => {
            if (info == null) {
              return;
            }
            var myDate = new Date();
            let groupchatObjectmsg = {
              IsMy: false,
              Time: message.sentTime,
              ID: info[0].UserID,
              AvatarUrl:info[0].AvatarUrl == ""? "../../../static/images/user.svg": info[0].AvatarUrl,
              UserName: info[0].UserName,
              Content: RongIMLib.RongIMEmoji.symbolToEmoji(messageInnerContent)
            };
            //分享文件,收到的消息字段
            if(message.messageType=="ShareDocMessage"){
              groupchatObjectmsg.shareDocUrl=messageInnerShareDocUrl;
              groupchatObjectmsg.shareDocThumbnailUrl=shareDocThumbnailUrl;
              groupchatObjectmsg.shareDocAvatarUrl=shareDocAvatarUrl;
              groupchatObjectmsg.shareDocUsername=shareDocUsername;
              groupchatObjectmsg.shareDocTime=shareDocTime;
              groupchatObjectmsg.attachmentID=attachmentID;
            }
            //如果发送方是当前选中的人
            if(groupId == this.RongCloudUserID){
              this.messageList.push(groupchatObjectmsg);
            }
            this.updatedMessage();
          });
        // if (groupId.indexOf("Classroom-") == -1) {
          if(message.messageType=="ImageMessage"){
            this.saveRecentGroup(groupId,this.$t('ChatFloating.picture'));
          }else if(message.messageType=="TextMessage"){
            this.saveRecentGroup(groupId,RongIMLib.RongIMEmoji.symbolToEmoji(messageInnerContent));
          }else if(message.messageType=="ShareDocMessage"){
            this.saveRecentGroup(sendUserId,this.$t('ChatFloating.ShareDocumentMessage'));
          }
        // }
         if (groupId.indexOf("Classroom-") != -1 && this.lessonID == 0) {
          this.clearPrivateMessageCount(groupId);
        } else if (groupId.indexOf("Classroom-") != -1 && groupId != "Classroom-" + this.lessonID) {
          this.clearPrivateMessageCount(groupId);
        }
        this.replaceBr();
      }
    },
    replaceBr() {
      let messageListArray = this.messageList;
      for (let i = 0; i < messageListArray.length; i++) {
        messageListArray[i].Content = messageListArray[i].Content.replace(/\n/g,"<br/>");
      }
      this.messageList = messageListArray;
    },
    InitEmoji() {
      var config = {
        size: 24, // 大小, 默认 24, 建议18 - 58
        url: "//f2e.cn.ronghub.com/sdk/emoji-48.png", // Emoji 背景图片
        lang: "zh", // Emoji 对应名称语言, 默认 zh
        // 扩展表情
        extension: {
          dataSource: {
            u1F914: {
              en: "thinking face", // 英文名称
              zh: "思考", // 中文名称
              tag: "🤔", // 原生 Emoji
              position: "0 0" // 所在背景图位置坐标
            }
          },
          // 新增 Emoji 背景图 url
          url: "//cdn.ronghub.com/thinking-face.png"
        }
      };
      RongIMLib.RongIMEmoji.init();
    },
    handleFloatingMouseDown(e) {
      this.clickX = e.screenX;
      this.clickY = e.screenY;
      e.stopPropagation();
    },
    handleFloatingMouseUp(e) {
      if (
        Math.abs(e.screenX - this.clickX) <= 2 &&
        Math.abs(e.screenY - this.clickY) <= 2
      )
        this.handleFloatingClick();
    },
    handleFloatingClick() {
      //当前设备未连接，则连接
      if(this.Connected!="CONNECTED"){
        this.initWebapi();
      }
      $("#chat-window").data("kendoWindow").open();
    },
    //生成缩略图
    render(src,callback) {
        // 创建一个 Image 对象
      var image = new Image();
        // 绑定 load 事件处理器，加载完成后执行
      image.src = src;
      image.onload = function() {
          // 获取 canvas DOM 对象
          var canvas = document.createElement("canvas");
          // 如果高度超标
          if (image.width >=120 && image.width) {
              // 宽度等比例缩放 *=
              image.height *= 120 / image.width;
              image.width = 120;
          }
          var ctx = canvas.getContext("2d");
          // canvas清屏
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // 重置canvas宽高
          canvas.width = image.width;
          canvas.height = image.height;
          // 将图像绘制到canvas上
          ctx.drawImage(image, 0, 0, image.width, image.height);
          // !!! 注意，image 没有加入到 dom之中
          // document.getElementById('img').src = canvas.toDataURL("image/jpeg");
          var url=canvas.toDataURL("image/jpeg",0.9);//缩略图的url
          callback ? callback(url) : '';
      };
    },
    uploadInputChange() {
      let self = this;
      var inputFile = document.getElementById("kloudsyncChatUpload").files[0];
      if (inputFile) {
        if (!/image\/\w+/.test(inputFile.type)||inputFile.size>92160) {
          this.$Notice.open({title: this.$t('ChatFloating.NotificationTitle'),desc: this.$t('ChatFloating.AlertPleaseSendImageSiseInfo'), top: 24,duration: 4, left:true });
          return false;
        }else if (self.RongCloudUserID == -1) {
          return;
        }
        var reader = new FileReader();
        reader.onload = function() {
          var dataURL = this.result;
          document.getElementById("kloudsyncChatUpload").value = "";
          self.render(dataURL,function(result){
              let url=result;
              var base64Str = url.split(",")[1]; //base64 格式缩略图
              var myDate = new Date();
              let msg = {
                IsMy: true,
                Time: myDate.getTime(),
                ID: auth.getUserID(),
                AvatarUrl: self.myHead,
                UserName: self.currentUser,
                Content: "<img src='" + dataURL + "' width='100' height='"+dataURL.height*(dataURL.width/100)+"'/>",
                loadingFlag: false
              };
              self.sendMessage = "";
              if (self.messageList.length < 20) {
                self.messageList.push(msg);
              } else {
                self.messageList.shift();
                self.messageList.push(msg);
              }
              self.updatedMessage();
              let targetId = self.RongCloudUserID + ""; //目标id
              var imageUri = dataURL; // 上传到自己服务器的 URL。
              var ImageMsg = new RongIMLib.ImageMessage({content: base64Str,imageUri: imageUri});
              var conversationtype; // 单聊,其他会话选择相应的消息类型即可。
              if (self.flag == "PRIVATE") {
                conversationtype = RongIMLib.ConversationType.PRIVATE; //私聊
                RongIMClient.getInstance().sendMessage(conversationtype,targetId,ImageMsg,{
                    onSuccess: function(message) {
                      self.messageList.pop();
                      msg.loadingFlag = true;
                      self.messageList.push(msg);
                      self.updatedMessage();
                      self.saveRecentList(targetId,self.$t('ChatFloating.picture'));
                      //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
                    },
                    onError: function(errorCode, message) {
                      var info = "";
                      switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                          info = "超时";
                          self.changeConnected("");
                          self.reconnectToRonYun();
                          break;
                        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                          info = "未知错误";
                          break;
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                          info = "在黑名单中，无法向对方发送消息";
                          break;
                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                          info = "不在讨论组中";
                          break;
                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                          info = "不在群组中";
                          break;
                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                          info = "不在聊天室中";
                          break;
                        default:
                          info = x;
                          break;
                      }
                      console.log("发送失败:" + info);
                    }
                  }
                );
              } else if (self.flag == "GROUP") {
                conversationtype = RongIMLib.ConversationType.GROUP; //群聊
                RongIMClient.getInstance().sendMessage(conversationtype,targetId,ImageMsg,{
                    onSuccess: function(message) {
                      self.messageList.pop();
                      msg.loadingFlag = true;
                      self.messageList.push(msg);
                      self.updatedMessage();
                      // if (targetId.indexOf("Classroom-") == -1) {
                        self.saveRecentList(targetId,self.$t('ChatFloating.picture'));
                      // }
                      //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
                    },
                    onError: function(errorCode, message) {
                      var info = "";
                      switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                          info = "超时";
                          self.changeConnected("");
                          self.reconnectToRonYun();
                          break;
                        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                          info = "未知错误";
                          break;
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                          info = "在黑名单中，无法向对方发送消息";
                          break;
                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                          info = "不在讨论组中";
                          break;
                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                          info = "不在群组中";
                          break;
                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                          info = "不在聊天室中";
                          break;
                        default:
                          info = x;
                          break;
                      }
                      console.log("发送失败:" + info);
                    }
                  }
                );
              }
          });
        };
        reader.readAsDataURL(inputFile);
      }
    },
    readData() {
      let self = this;
      let url = GetAPIUrl() + "User/UserProfile";
      this._getData(url, null, user => {
        if (user) {
          if (user.AvatarUrl != "" && user.AvatarUrl != null) {
            this.myHead = user.AvatarUrl;
          }
        }
        if (user.AvatarUrl == "" || user.AvatarUrl == null) {
          this.myHead = "../../../static/images/user.svg";
        }
      });
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
      this.loading = true;
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
    ...mapMutations(['changeConnected',"changeShareDoc","changeKloudsyncShareDoc"])
  }
};
</script>

