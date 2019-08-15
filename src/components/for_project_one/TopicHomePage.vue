<template>
  <div class="forProject-home-page">
    <div class="forProject-home-page-info-header" v-show="!inList">
      <div class="forProject-home-page-title-space">
        <span class="sync-room-type">
          <span class="icon icon-type" style="color :rgb(47,194,175);font-size:23px;line-height: 1;margin-right:3px;"></span>
          <span v-show="currentTopic.type == 1">{{$t('TopicHomePage.SalesforceIntegration')}}</span>
          <span v-show="currentTopic.type == 2">{{$t('TopicHomePage.Support')}}</span>
          <span v-show="currentTopic.type == 3">{{$t('TopicHomePage.CustomerLeads')}}</span>
        </span>
        <Dropdown style="float:right; font-weight:normal;text-align:left;" placement="bottom-end" @on-click="handleTopicAction">
          <Icon type="more" size="24" style="cursor: pointer;"></Icon>
          <DropdownMenu slot="list">
            <DropdownItem name="property">{{$t('TopicHomePage.Property')}}</DropdownItem>
            <DropdownItem name="share">{{$t('TopicHomePage.CopyUrl')}}</DropdownItem>
            <DropdownItem name="move" v-if="inList">{{$t('TopicHomePage.Move')}}</DropdownItem>
            <DropdownItem name="close">{{$t('TopicHomePage.Close')}}</DropdownItem>
            <DropdownItem name="quit">{{$t('TopicHomePage.QuitSyncRoom')}}</DropdownItem>
            <DropdownItem name="delete">{{$t('TopicHomePage.Delete')}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <p class="sync-room-title">{{currentTopic.name}}</p>
      </div>
    </div>
    <div class="forProject-home-page-content" :style="{'height':inList?'calc(100vh - 275px)':'calc(100vh - 102px);'}">
      <div class="messeage-space">
        <div class="header">
          <div style="flex:1 1 120px;" v-show="false">
            <span style="font-size: 15px;font-weight: bold;max-width: 90%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
              {{$t('TopicHomePage.NoAmessageAvaliable')}}
            </span>
          </div>
          <div style="flex:1 1 120px;">
            <span style="font-size: 15px;font-weight: bold;max-width: 90%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
              Message from James
            </span>
          </div>
          <div v-show="isSyncRoomOwnner">
            <a @click="setProperty" href="javascript:void(null);">{{$t('TopicHomePage.Setup')}}</a>
          </div>
        </div>
        <div style="margin-top:5px;">
          	Nothing is impossible to a willing mind; A man who has a settled purpose will surely succeed; A willful man always has way; Everything comes to him who wants;
        </div>
        <div class="header" style="margin-top:20px;">
          <div style="flex:1 1 120px;display: flex;flex-wrap: wrap;">
            <a style="font-size: 13px;font-weight: bold;max-width: 95%;" href="javascript:void(null);">
              Sign the contrack within 2 days,we'll get there >
            </a>
          </div>
          <div style="cursor:pointer">
            <img src="/static/preview/images/sign.svg" width="50" height="50" style="border-radius: 50%"/>
          </div>
        </div>
      </div>
      <div class="sync-space" v-show="currentTopic.type == 1">
        <div class="header">
          <div style="flex:1 1 120px;">
            <span style="color:#bdc5b8;">
              {{$t('TopicHomePage.LatestSyncs')}}
            </span>
          </div>
          <div v-show="isSyncRoomOwnner">
            <a @click="setSyncs" href="javascript:void(null);">{{$t('TopicHomePage.Setup')}}</a>
          </div>
        </div>
        <div class="sync-space-content">
          <span v-show="false" style="font-size: 15px;font-weight: bold;max-width: 90%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
            {{$t('TopicHomePage.NoSyncsAvaliable')}}
          </span>
          <div class="sync-item" >
            <p style="font-size: 15px;font-weight: bold;max-width: 90%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
              Documentation of reports mainly records various types of data.
            </p>
            <p style="color:#bdc5b8;">
              Duration: 20 Minutes
            </p>
            <p style="color:#bdc5b8;">
              Documents:abc sample.doc
            </p>
            <div class="header" style="align-items:center;padding:15px 0px;">
              <div style="flex:1 1 120px;align-items:center;display:flex;">
                <Avatar src='/static/images/user.svg' />
                <span style="margin-left:5px;font-size: 13px;font-weight: bold;max-width: 50%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                  Francis Jones
                </span>
              </div>
              <div>
                <span style="color:#bdc5b8;">08:35 2019-04-25</span>
              </div>
            </div>
            <p style="margin-bottom:15px;"> <a href="javascript:void(null);">{{$t('TopicHomePage.ViewAll')}}</a></p>
          </div>
        </div>
      </div>
      <div class="activity-space" v-show="currentTopic.type == 1">
        <div class="header">
          <div style="flex:1 1 120px;">
            <span style="color:#bdc5b8;">
              {{$t('TopicHomePage.LatestActivitys')}}
            </span>
          </div>
          <div>
            <a href="javascript:void(null);">{{$t('TopicHomePage.ViewAll')}}</a>
          </div>
        </div>
        <div class="activity-space-content">
          <span v-show="false" style="font-size: 15px;font-weight: bold;max-width: 90%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
            {{$t('TopicHomePage.NoActivityAvaliable')}}
          </span>
          <div class="activity-item header">
            <div style="flex:0 0 50px">
               <span class="icon icon-file2" style="font-size:26px;line-height: 1;margin-right:3px;"></span>
            </div>
            <div style="font-size: 13px;">
              <span style="font-weight: bold;">
                Terry John 
              </span>
              <span style="color:#bdc5b8;margin-left:2px;">
                Create the SyncRoom 
              </span>
              <span style="margin-left:2px;color:#2b85e4">
                Product of PeerTime beta release
              </span>
              <p style="color:#bdc5b8;">2019-04-18 13:25</p>
            </div>
          </div>
        </div>
      </div>
      <div class="suport-tickets" v-show="currentTopic.type == 2">
        <div class="header">
          <div style="flex:1 1 120px;">
            <span style="color:#bdc5b8;">
              {{$t('TopicHomePage.LatestSupportTickets')}}
            </span>
          </div>
          <div v-show="isSyncRoomOwnner">
            <a href="javascript:void(null);">{{$t('TopicHomePage.Setup')}}</a>
          </div>
        </div>
        <div class="ticket-item">
          <div style="flex:1 1 120px;flex:1 1 120px;font-size: 15px;font-weight: bold;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;margin-right:30px;">
              Tickets 123
          </div>
          <div style="color:#bdc5b8;">
            Current owner james
          </div>
        </div>
        <div class="ticket-item">
          <div style="flex:1 1 120px;flex:1 1 120px;font-size: 15px;font-weight: bold;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;margin-right:30px;">
              Tickets 456
          </div>
          <div style="color:#bdc5b8;">
              Current owner james
          </div>
        </div>
        <div class="ticket-item">
          <div style="flex:1 1 120px;flex:1 1 120px;font-size: 15px;font-weight: bold;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;margin-right:30px;">
              Tickets 789
          </div>
          <div>
            <span style="color:#bdc5b8;">
              Current owner james
            </span>
          </div>
        </div>
      </div>
      <div class="contact-space" v-show="currentTopic.type != 3">
        <div class="dropdown-head">
          <div style="flex:1 1 120px;font-size: 15px;font-weight: bold;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;margin-right:30px;">
              {{memberListLength}}<span style="margin-left:3px;">{{$t('TopicHomePage.aContacts')}}</span>
          </div>
          <div style="padding:5px;cursor:pointer" @click="showDropdownMember=!showDropdownMember">
            <Icon type="chevron-down" size="18" v-show="!showDropdownMember"></Icon>
            <Icon type="chevron-up" size="18" v-show="showDropdownMember"></Icon>
          </div>
        </div>
        <div class="dropdown-content" v-show="showDropdownMember">
          <div class="user-item" v-for="item in memberFullList" :key="item.MemberID">
            <span><Avatar :src="item.MemberAvatar == '' ? '/static/images/user.svg' : item.MemberAvatar" /></span>
            <span style="margin-left: 10px;">{{item.MemberName}}</span>
          </div>
        </div>
      </div>
      <div class="customer-leads-contact-space" v-show="currentTopic.type == 3">
        <div class="header" style="margin-top:10px;">
          <div style="flex:1 1 120px;">
            <span style="color:#bdc5b8;">
              {{$t('TopicHomePage.Contacts')}}
            </span>
          </div>
        </div>
        <div style="margin-top:10px;font-size: 15px;font-weight: bold;">
          <span style="color:green;cursor:pointer" @click="handleNewContactsModal">123 new contacts,</span>
          <span>325 total</span>
        </div>
        <div class="header" style="margin-top:10px;">
          <div style="flex:1 1 120px;">
            <span style="color:#bdc5b8;">
              {{$t('TopicHomePage.NewContacts')}}
            </span>
          </div>
          <div>
            <a href="javascript:void(null);">{{$t('TopicHomePage.ViewAll')}}</a>
          </div>
        </div>
        <div style="overflow:auto;margin:10px 0px;max-height:200px;">
          <div class="isShowMoreActionIcon" style="padding: 6px;font-size: 14px;flex-direction: row;align-items: center;justify-content: flex-start;display:flex;" v-for="item in newContacts" :key="item.id">
            <span style="flex:1 1 120px">
              <span><Avatar :src="item.avatar == '' ? '/static/images/user.svg' : item.avatar" /></span>
              <span style="margin-left: 10px;">{{item.name}}</span>
            </span>
            <Dropdown style="float:right; font-weight:normal" placement="bottom-end" class="moreActionIcon">
              <span style="padding:5px;display:inline-block;cursor:pointer">
                <Icon type="more" size="18"></Icon>
              </span>
              <DropdownMenu slot="list">
                <DropdownItem name="delete">{{$t('TopicHomePage.Delete')}}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
           
          </div>
        </div>
      </div>
      <div class="doc-and-meeting-Space">
        <div class="header">
          <div style="flex:1 1 120px;">
            <span style="color:#bdc5b8;">
              {{$t('TopicHomePage.DocumentsAndMeetings')}}
            </span>
          </div>
          <div v-show="isSyncRoomOwnner">
            <a @click="setDocsAndMeetings" href="javascript:void(null);">{{$t('TopicHomePage.Setup')}}</a>
          </div>
        </div>
        <div class="doc-and-meeting-item">
          <div style="height:10px;width:100%"></div>
          <div v-show="haveDocsOrMeetings">
            <span style="font-size: 15px;font-weight: bold;max-width: 90%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
              {{$t('TopicHomePage.NoDouumentsAndMeetingsAvaliable')}}
            </span>
          </div>
          <div class="document-item" v-for="item in fileList" :key="item.id" :style="{backgroundImage:'url('+item.coverUrl+')'}" style="color:white;background-size: 100% 100%;min-height: 150px;">
            <div style="width:100%;height:100%;position:absolute;;background-color:rgba(255,255,255,0);top:0px;left:0px;z-index:10;cursor: pointer;" @click="changeFile(item)">
              <!-- <div class="document-item-left">
                <span style="display:inline-block;cursor: pointer;" @click="changeFile(item)">
                  <span class="icon icon-document" style="color:white;font-size:24px;line-height: 1;margin-right:3px;"></span>
                </span>
              </div> -->
              <div class="document-item-right" style="margin: 50px 15px 10px 15px;padding-right:0px;">
                <div class="document-title">
                  <span style="padding-top:3px; font-weight:bold;font-size:15px;color:white;max-width: 70%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;color:white">{{item.title}}</span>
                </div>
                <div class="document-bottom">
                  <div style="flex:1 1 120px;display:flex;flex-direction: row;justify-content:flex-start;align-items: center;">
                    <span style="margin-right:6px;"><Avatar src="/static/images/user.svg" /></span>
                    <span style="font-size: 12px;font-weight: bold;max-width: 50%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;color:white">Francis Jones</span>
                  </div>
                  <div v-if="item.syncs!=0" style="cursor: pointer;">
                    <span style="margin-right:3px;display:inline-block;color:white">
                      <span class="icon icon-yinxiang" style="font-size:20px;color:white"></span>
                      {{$t('TopicHomePage.Syncs')}}
                    </span>
                    <span style="font-weight:bold;display:inline-block;color:white">
                      {{item.syncs}}
                    </span>
                  </div>
                </div>
              </div>
              <div class="document-item-syncs" v-if="docSyncShow==item.id">
                <div class="doc-sync-item" v-for="syncItem in syncsList" :key="syncItem.id">
                  <p style="margin-bottom:5px;font-weight: bold;font-size: 14px;" @click="playSync(syncItem)">{{syncItem.title}}</p>
                  <div class="doc-sync-item-content">
                    <span @click="playSync(syncItem)" style="word-break:break-all;flex:1 1 200px">
                      <Avatar :src="syncItem.avatarUrl"></Avatar>
                      <span style="margin-left:5px;overflow: hidden; width:80px;text-overflow: ellipsis;white-space: nowrap;margin-bottom: -5px;">{{syncItem.detail.UserName}}</span>
                      <span style="margin-left:15px">{{syncItem.date}}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div style="width:100%;height:100%;position:absolute;background: linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.5), rgba(0,0,0,0)); top:0px;left:0px;z-index:1;"></div>
          </div>
          <div class="meeting-item  document-item" v-for="(item,index) in meetingList" :key="index" @click="handleStartMeeting(item)" style="cursor: pointer;">
            <div class="document-item-left"  >
              <span style="display:inline-block;cursor: pointer;">
                <span class="icon icon-meeting" style="color:red;font-size:26px;line-height: 1;margin-right:3px;"></span>
              </span>
            </div>
            <div class="document-item-right">
              <div class="document-title">
                <span style="padding-top:3px; font-weight:bold;flex:1 1 120px;word-break:normal;font-size:15px;">{{item.title}}</span>
              </div>
              <div style="margin-top:10px;cursor: pointer;">
                <span style="padding:3px;background: #edeeef;border-radius:5px;">
                  <span style="font-weight: bold">{{item.startDate}}</span>
                  <span style="margin-left:3px;font-weight: bold">{{item.startMonth}}</span>
                </span>
                <span style="padding:3px;background: #edeeef;margin-left:50px;border-radius:5px;">
                  <span>{{item.startTime}}</span>
                  <span style="padding:0px 3px">-</span>
                  <span>{{item.endTime}}</span>
                </span>
              </div>
              <div class="document-bottom">
                <div style="flex:1 1 120px;display:flex;flex-direction: row;justify-content:flex-start;align-items: center;">
                  <span style="margin-right:6px;"><Avatar src="/static/images/user.svg" /></span>
                  <span style="font-size: 12px;font-weight: bold;max-width: 90%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;color:#bdc5b8;">Francis Jones</span>
                </div>
                <div style="display:flex;flex-direction: row;justify-content:flex-start;align-items: center;">
                  <span style="margin-right:3px;font-weight:bold;display:inline-block;cursor: pointer;">
                    {{item.attendee}} {{$t('TopicHomePage.Attendees')}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <Modal v-model="modalMerge" :mask-closable="false" title="Delete SyncRoom">
        <div class="kloudsync-merge-topic">
          <h4>Before you delete the syncRoom, you need to merge the syncRoom to current one.</h4>
          <p>&nbsp;</p>
          <p>Current</p>
          <p class="current-topic">{{currentTeam.name}} / {{currentTopic.name}}</p>
          <p>&nbsp;</p>
          <p>Select Team</p>
          <Select v-model="mergeTeam" placeholder="Please select a team">
            <Option v-for="item in teamFullList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
          <p>&nbsp;</p>
          <p>Select SyncRoom</p>
          <Select v-model="mergeTopic" placeholder="Please select a syncRoom">
            <Option v-for="item in topicFullList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </div>
        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleDeleteTopicOK">{{$t('Base.OK')}}</Button>
          <Button @click="modalMerge = false;">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>
      <Modal v-model="SyncRoomProperty" :mask-closable="false" title="SyncRoom property" width="800">
        <div slot="header">
          <p>SyncRoom property</p>
          <p style="margin-top:2px;color:#bdc5b8;font-size:12px;">Setup the SyncRoom name,type and message</p>
        </div>
        <div class="forProject-sync-room-property-modal-content">
          <div style="display:flex;align-items: center;justify-content: flex-start;border-bottom:1px solid #dddee1;padding-bottom:30px;">
            <div style="display:flex;align-items: center;justify-content: flex-start;width:47%">
              <div class="leftName">Name:</div>
              <Input v-model="catalogName" placeholder="Name"/>
            </div>
            <div style="display:flex;align-items: center;justify-content: flex-start;margin-left:6%;width:47%">
              <div class="leftName">Type:</div>
              <Select v-model="catalogTopicType" placeholder="Type">
                <Option :value="1">Customer Service</Option>
                <Option :value="2">Customer Requirement Discussion</Option>
                <Option :value="3">Customer Leads</Option>
              </Select>
            </div>
          </div>
          <div style="display:flex;align-items: center;justify-content: flex-start;margin-top:15px;font-weight: bold;color: #1c2438;">
            <div style="flex:1 1 200px">
              <Checkbox v-model="showMessage">Show message</Checkbox>
            </div>
            <div style="cursor:pointer">
              <Icon type="clock" size="16" style="margin-right:2px"></Icon>
               History
            </div>
          </div>
          <div style="display:flex;align-items: center;justify-content: flex-start;margin-top:15px;">
            <div class="leftName">Title:</div>
            <Input placeholder="Title"/>
          </div>
          <div style="display:flex;align-items: flex-start;justify-content: flex-start;margin-top:15px;">
            <div class="leftName">Content:</div>
            <Input v-model="catalogNote" placeholder="Content" type="textarea" :rows="4" :autosize="{minRows: 4}"/>
          </div>
        </div>
        <div slot="close" style="display:none"></div>
        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handlePropertySave">Save</Button>
          <Button  @click="handlePropertyCancel">Cancel</Button>
        </div>
      </Modal>
      <Modal v-model="moveSyncRoom.moveSyncRoomModal" :mask-closable="false" title="Move SyncRoom" width="500" style="z-index: 1000; position: absolute;">
        <div style="width:100%;padding:20px 0px 20px 0px;">
          <p style="font-size:14px;font-weight:550">Select Team</p>
          <p style="margin-top:5px;">
            <Select v-model="seleceTeamId" style="width:100%">
              <Option v-for="item in teamList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </p>
        </div>
        <div style="width:100%;padding:20px 0px 20px 0px;">
          <p style="font-size:14px;font-weight:550">Select Space</p>
          <p style="margin-top:5px;">
            <Select v-model="moveSyncRoom.selecetSpaceId" style="width:100%">
              <Option v-for="item in sapceList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </p>
        </div>
        <div slot="close" style="display:none"></div>
        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handMoveOk">{{$t('Base.OK')}}</Button>
          <Button @click="handMoveCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>
      <Modal v-model="modalViewFile" class="forProject-file-view" width="90%" :mask-closable="false" :title="modalViewFileTitle">
        <div slot="footer" style="display:none"></div>
        <div class="forProject-file-view-body">
          <iframe style="width:100%; height:100%;" frameborder="0" width="100%" height="100%" :src="modalViewFileUrl"></iframe>
        </div>
      </Modal>
      <Modal v-model="modalSelectSyncs" width="825" :mask-closable="false">
        <div slot="header">
          <p style="font-size:14px;">SyncRoom Latest Syncs<sup style="color:red;margin-left:10px">2 Syncs limited</sup></p>
          <p style="font-size:12px;color:#bdc5b8;font-weight:100;">
            Select the Syncs show at the homepage,two syncs limited.If you choosed none,will show the latest two default.
          </p>
        </div>
        <div slot="close" style="display:none">
        </div>
        <div class="forProject-modal-selcet-sync-content">
          <div class="sync-item" @click="selcetSyncItem('111')">
            <p style="font-size: 15px;font-weight: bold;max-width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
              Documentation of reports mainly records various types of data.
            </p>
            <p style="color:#bdc5b8;">
              Duration: 20 Minutes
            </p>
            <p style="color:#bdc5b8;">
              Documents:abc sample.doc
            </p>
            <div class="user-info">
              <div style="flex:1 1 120px;align-items:center;display:flex;">
                <Avatar src='/static/images/user.svg' />
                <span style="margin-left:5px;font-size: 13px;font-weight: bold;max-width: 50%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                  Francis Jones
                </span>
              </div>
              <div style="color:#bdc5b8;">
                08:35 2019-04-25
              </div>
            </div>
            <div class="checked" :style="{border:!syncList.includes('111')?'1px solid black':''}">
              <Icon type="checkmark-circled" style="color:rgb(47, 194, 175);" v-show="syncList.includes('111')" size="20"></Icon>
            </div>
          </div>
          <div class="sync-item" @click="selcetSyncItem('222')">
            <p style="font-size: 15px;font-weight: bold;max-width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
              Documentation of reports mainly records various types of data.
            </p>
            <p style="color:#bdc5b8;">
              Duration: 20 Minutes
            </p>
            <p style="color:#bdc5b8;">
              Documents:abc sample.doc
            </p>
            <div class="user-info">
              <div style="flex:1 1 120px;align-items:center;display:flex;">
                <Avatar src='/static/images/user.svg' />
                <span style="margin-left:5px;font-size: 13px;font-weight: bold;max-width: 50%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                  Francis Jones
                </span>
              </div>
              <div style="color:#bdc5b8;">
                08:35 2019-04-25
              </div>
            </div>
            <div class="checked" :style="{border:!syncList.includes('222')?'1px solid black':''}">
              <Icon type="checkmark-circled" style="color:rgb(47, 194, 175);" v-show="syncList.includes('222')" size="20"></Icon>
            </div>
          </div>
          <div class="sync-item" @click="selcetSyncItem('333')">
            <p style="font-size: 15px;font-weight: bold;max-width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
              Documentation of reports mainly records various types of data.
            </p>
            <p style="color:#bdc5b8;">
              Duration: 20 Minutes
            </p>
            <p style="color:#bdc5b8;">
              Documents:abc sample.doc
            </p>
            <div class="user-info">
              <div style="flex:1 1 120px;align-items:center;display:flex;">
                <Avatar src='/static/images/user.svg' />
                <span style="margin-left:5px;font-size: 13px;font-weight: bold;max-width: 50%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                  Francis Jones
                </span>
              </div>
              <div style="color:#bdc5b8;">
                08:35 2019-04-25
              </div>
            </div>
            <div class="checked" :style="{border:!syncList.includes('333')?'1px solid black':''}">
              <Icon type="checkmark-circled" style="color:rgb(47, 194, 175);" v-show="syncList.includes('333')" size="20"></Icon>
            </div>
          </div>
        </div>
        <div slot="footer">
          <Button @click="selectSycnCancel">{{$t('Base.Cancel')}}</Button>
          <Button type="primary" @click="selectSycnOk">{{$t('Base.OK')}}</Button>
        </div>
      </Modal>
      <Modal v-model="modalSelectDocAndMeeting" width="825" :mask-closable="false">
        <div slot="header">
          <p style="font-size:14px;">Documents and meetings<sup style="color:red;margin-left:10px">10 documents and meetings limited</sup></p>
          <p style="font-size:12px;color:#bdc5b8;font-weight:100;">
            Select the documents and meetings show at the homepage,two syncs limited.If you choosed none,will show the latest ten default.
          </p>
        </div>
        <div slot="close" style="display:none">
        </div>
        <div class="forProject-modal-selcet-docAndMeeting-content">
          <div class="docAndMeeting-item" @click="selcetDocsAndMeetingsItem('111')">
            <div>
              <div style="float:left;margin-right:10px;">
                <span class="icon icon-document" style="font-size:24px;line-height: 1;"></span>
              </div>
              <div class="doc-tile">
                Documentation of reports mainly records various types of data.
              </div>
              <div style="clear:both"></div>
            </div>
            <div class="user-info">
              <div style="flex:1 1 120px;align-items:center;display:flex;">
                <Avatar src='/static/images/user.svg' />
                <span style="margin-left:5px;font-size: 13px;font-weight: bold;max-width: 50%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                  Francis Jones
                </span>
              </div>
              <div style="color:#bdc5b8;">
                08:35 2019-04-25
              </div>
            </div>
            <div class="checked" :style="{border:!docsAAndMeetingsList.includes('111')?'1px solid black':''}">
              <Icon type="checkmark-circled" style="color:rgb(47, 194, 175);" v-show="docsAAndMeetingsList.includes('111')" size="20"></Icon>
            </div>
          </div>
          <div class="docAndMeeting-item" @click="selcetDocsAndMeetingsItem('222')">
            <div>
              <div style="float:left;margin-right:10px;">
                <span class="icon icon-meeting" style="font-size:24px;line-height: 1;color:red"></span>
              </div>
              <div class="meeting-title">
                Documentation of reports mainly records various types of data.
              </div>
              <div style="clear:both"></div>
            </div>
            <div style="margin-top:15px;">
              <div style="padding:3px;background: #edeeef;border-radius:5px;float:left">
                <span style="font-weight: bold">12</span>
                <span style="margin-left:3px;font-weight: bold">JAN</span>
              </div>
              <div style="padding:3px;background: #edeeef;margin-left:50px;border-radius:5px;float:right;">
                <span>09:00</span>
                <span style="padding:0px 3px">-</span>
                <span>12:00</span>
              </div>
              <div style="clear:both"></div>
            </div>
            <div class="user-info">
              <div style="flex:1 1 120px;align-items:center;display:flex;">
                <Avatar src='/static/images/user.svg' />
                <span style="margin-left:5px;font-size: 13px;font-weight: bold;max-width: 50%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                  Francis Jones
                </span>
              </div>
              <div style="color:#bdc5b8;">
                08:35 2019-04-25
              </div>
            </div>
            <div class="checked" :style="{border:!docsAAndMeetingsList.includes('222')?'1px solid black':''}">
              <Icon type="checkmark-circled" style="color:rgb(47, 194, 175);" v-show="docsAAndMeetingsList.includes('222')" size="20"></Icon>
            </div>
          </div>
        </div>
        <div slot="footer">
          <Button @click="selectDocsAndMeetingsCancel">{{$t('Base.Cancel')}}</Button>
          <Button type="primary" @click="selectDocsAndMeetingsOk">{{$t('Base.OK')}}</Button>
        </div>
      </Modal>

      <Modal v-model="customerLeadsNewContactsModal" :mask-closable="false" title="All contacts(325)" :width="600">
        <Tabs value="NewContacts" :animated="false">
          <TabPane label="New contacts" name="NewContacts">
            <div style="height:50vh;overflow:auto;padding:5px 20px 5px 20px">
              <div style="padding: 6px;font-size: 14px;" v-for="item in newContacts" :key="item.id">
                <span class="member-avatar"><Avatar :src="item.avatar == '' ? '/static/images/user.svg' : item.avatar" /></span>
                <span style="margin-left: 10px;">{{item.name}}</span>
              </div>
            </div>
          </TabPane>
          <TabPane label="All contacts" name="AllContacts">
            <div style="height:50vh;overflow:auto;padding:5px 20px 5px 20px">
            </div>
          </TabPane>
        </Tabs>
        <div slot="footer" style="display:none">
        </div>
      </Modal>
    </div>
  </div>
</template>

<style lang="scss">
.forProject-home-page {
  text-align: left;
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 200px;
  .forProject-home-page-info-header {
    width: 100%;
    padding: 2em 24px 1em 24px;
    .forProject-home-page-title-space {
      width: 100%;
      .sync-room-type {
        font-size: 15px;
        max-width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .sync-room-title {
        font-size: 18px;
        max-width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    span {
      display: inline-block;
    }
  }
  .forProject-home-page-content{
    width: 100%;
    height: calc(100vh - 102px);
    overflow: auto;
    span{
      display: inline-block;
    }

    .header{
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
    }
    .messeage-space{
      margin: 20px 20px 20px 24px;
      border: 1px solid #dddee1;
      padding: 15px 10px 15px 20px;
      border-radius: 5px;
    }
    .sync-space{
      min-height: 120px;
      margin: 40px 30px 20px 24px;
      border-bottom: 1px solid #dddee1;
      .sync-space-content{
        margin-top: 20px;
      }
    }
    .activity-space{
      min-height: 120px;
      margin: 40px 30px 20px 24px;
      border-bottom: 1px solid #dddee1;
      .activity-space-content{
        margin-top: 20px;
      }
    }
    .contact-space{
      border-top: 1px solid #dddee1;
      border-bottom: 1px solid #dddee1;
      margin: 40px 30px 20px 24px;
      padding: 10px 0px;
      .dropdown-head{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
      }
      .dropdown-content{
        max-height: 200px;
        overflow-y: auto;
        .user-item{
          padding: 6px; 
          font-size: 14px;
        }
      }
    }
    .customer-leads-contact-space{
      min-height: 120px;
      margin: 40px 30px 20px 24px;
      border-top: 1px solid #dddee1;
      border-bottom: 1px solid #dddee1;
    }
    .suport-tickets{
      margin: 40px 30px 20px 24px;
      .ticket-item{
        border-bottom: 1px solid #dddee1;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        height:50px ;
      }
    }
    .doc-and-meeting-Space{
      margin: 20px 20px 20px 24px;
      .doc-and-meeting-item{
        .document-item {
          border: 1px solid #dddee1;
          padding: 15px 10px 15px 20px;
          border-radius: 5px;
          display:flex;
          flex-direction: row;
          flex-wrap:wrap;
          margin-top: 15px ;
          position: relative;
          .document-item-left{
            flex:0 0 40px;
          }
          .document-item-right{
            flex:1 1 200px;
            padding-right: 15px;
            .document-title {
              cursor: pointer;
            }

            .document-bottom {
              margin-top: 20px;
              display:flex;
              flex-direction: row;
              justify-content:flex-start;
              span {
                display:inline-block;
                color:#80848f;
              }
            }
          }
          .document-item-syncs{
            width: 100%;
            margin-top: 20px;
            .doc-sync-item{
              padding:5px 10px 5px 5px;
              border-bottom:1px solid #ddd;
              cursor: pointer;
              background-color: rgb(246,249,253);
              span{
                display: inline-block;
              }
              .doc-sync-item-content{
                display:flex;
                flex-direction: row;
                align-items: center;
              }
            }
          }
        }
      }
    }
  }
  .topic-property {
    padding: 20px;

    .topic-property-table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      text-align: left;

      td {
        padding: 5px;
        line-height: 32px;
      }

      td:first-of-type {
        //text-align: right;
        font-weight: bold;
        width: 80px;
      }

      .check-mark {
        display: inline-block;
        width: 24px;
        text-align: left;
      }
    }

    .topic-property-detail {
      .topic-property-label {
        padding: 1em 0 0.5em 0;
        font-weight: bold;
        color: #1c2438;
      }
      .customer-list {
        .member-item {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 5px;
          font-size: 14px;

          .panel-topic {
            box-flex: 1;
            flex: 1 1 15px;
          }

          .member-action {
            opacity: 0;
            cursor: pointer;
          }
        }
      }
    }
  }
  .moreActionIcon{
    opacity: 0;
  }
  .isShowMoreActionIcon:hover{
    .moreActionIcon{
      opacity: 1;
    }
  }
  .topic-action {
    text-align: center;
    padding: 24px 16px;
  }
}
.forProject-file-view{
  .forProject-file-view-body
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
.forProject-sync-room-property-modal-content {
  width: 100%;
  padding: 0em 3.5em 1em 3.5em;
  .leftName{
    font-weight: bold;
    color: #1c2438;
    flex: 0 0 60px;
  }
}
.forProject-modal-selcet-sync-content{
  display: flex;
  flex-wrap:wrap;
  flex-direction: row;
  justify-content: flex-start;
  max-height: 380px;
  overflow-y: auto;
  align-content:flex-start;
  .sync-item{
    margin: 15px;
    width: 350px;
    padding: 24px;
    height:160px;
    border: 1px solid #dddee1;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    span{
      display: inline-block;
    }
    .user-info{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items:center;
      margin-top: 20px;
    }
    .checked{
      position: absolute;
      right:10px;
      top: 10px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
    }
  }
}
.forProject-modal-selcet-docAndMeeting-content{
  display: flex;
  flex-wrap:wrap;
  flex-direction: row;
  justify-content: flex-start;
  max-height: 380px;
  overflow-y: auto;
  align-content:flex-start;
  .docAndMeeting-item{
    margin: 15px;
    width: 350px;
    padding: 24px;
    height:190px;
    border: 1px solid #dddee1;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    .doc-tile{
      float:left;
      font-size: 15px;
      font-weight: bold;
      max-width:calc(100% - 35px);
      word-break:normal;
      overflow: hidden;
      text-overflow: ellipsis;
      height:65px;
    }
    .meeting-title{
      float:left;
      font-size: 15px;
      font-weight: bold;
      max-width:calc(100% - 35px);
      word-break:normal;
      overflow: hidden;
      text-overflow: ellipsis;
      height:42px;
    }
    span{
      display: inline-block;
    }
    .user-info{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items:center;
      position: absolute;
      left: 24px;
      bottom: 20px;
      width: calc(100% - 48px);
    }
    .checked{
      position: absolute;
      right:10px;
      top: 10px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
    }
  }
}
</style>

<script>
import auth from "../../authenticator";
import friends from "../../friends";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: false,
      catalogId: 0,
      catalogType: 0,
      catalogTypeName: "Team",
      catalogTopicType: 1,
      catalogName: "Team Name",
      catalogNote: "",
      catalogMemberType: 0,
      modalMerge: false,
      mergeTeam: 0,
      mergeTopic: 0,
      teamFullList: [],
      topicFullList: [],
      SyncRoomProperty: false,

      moveSyncRoom:{
        moveSyncRoomModal:false,
        selecetSpaceId:-1,
      },
      moveToSyncRoomId:-1,
      seleceTeamId:-1,
      teamList:[],
      sapceList:[],
      
      memberFullList:[],

      showMessage :true,

      newContacts:[],

      fileList:[],

      modalViewFile:false,
      modalViewFileTitle:'',
      modalViewFileUrl:'',

      syncsList:[],
      docSyncShow:-1,

      meetingList:[],
      standardMonth: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],

      showDropdownMember:false,

      modalSelectSyncs:false,
      syncList:[],

      modalSelectDocAndMeeting:false,
      docsAAndMeetingsList:[],

      customerLeadsNewContactsModal:false,
    };
  },
  props: {
    inList: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    ...mapState(["kloudsyncTopic"]),

    schoolId() {
      return auth.getChosenSchoolId();
    },
    topicTypeName() {
      switch (this.catalogTopicType) {
        case 1:
          return "Customer Service";
        case 2:
          return "Customer Requirement Discussion";
        case 3:
          return "Customer Leads";

        default:
          return "Unknown";
      }
    },
    currentTeam() {
      return this.kloudsyncTopic.currentTeam;
    },
    currentTopic() {
      return this.kloudsyncTopic.currentTopic;
    },
    currentSyncRoomId(){
      if (this.inList) {
        return this.currentTopic.id;
      }
      else {
        return this.$route.params.id;
      }
    },
    memberListLength(){
      return this.memberFullList.length;
    },
    isSyncRoomOwnner(){
      // if(this.currentTopic.memberType && this.currentTopic.memberType ==2){//判断是不是syncroom ownner
        return true;
      // }
      return false;
    },
    haveDocsOrMeetings(){
      if(this.fileList.length ==0 && this.meetingList.length==0){
        return true;
      }
      return false;
    }
  },
  watch: {
    mergeTeam(from, to) {
      this.$nextTick(() => {
        this._loadTopicList();
      });
    },
    seleceTeamId(from, to) {
      this.$nextTick(() => {
        this._loadMoveSpaceList();
      });
    },
    modalViewFile(val){
      if(val==false){
        this.modalViewFileUrl = "";
      }
    },
  },
  mounted() {
    this.initialize();
  },
  methods: {
    handleNewContactsModal(){
      this.customerLeadsNewContactsModal=true;
    },
    selcetSyncItem(item){
      if(this.syncList.includes(item)){
        this.syncList.forEach((forItem,index)=>{
          if(forItem == item){
            this.syncList.splice(index,1);
            return;
          }
        })
      }else{
        this.syncList.push(item);
      }
    },
    setSyncs(){
      this.modalSelectSyncs = true;
    },
    selectSycnCancel(){
      this.modalSelectSyncs = false;
    },
    selectSycnOk(){
      this.selectSycnCancel();
    },
    
    selcetDocsAndMeetingsItem(item){
      if(this.docsAAndMeetingsList.includes(item)){
        this.docsAAndMeetingsList.forEach((forItem,index)=>{
          if(forItem == item){
            this.docsAAndMeetingsList.splice(index,1);
            return;
          }
        })
      }else{
        this.docsAAndMeetingsList.push(item);
      }
    },
    setDocsAndMeetings(){
     this.modalSelectDocAndMeeting = true;
    },
    selectDocsAndMeetingsCancel(){
      this.modalSelectDocAndMeeting = false;
    },
    selectDocsAndMeetingsOk(){
      this.selectDocsAndMeetingsCancel();
    },

    setProperty(){
      this.handleTopicProperty(this.currentSyncRoomId);
    },
    initialize(){
      if (!this.inList){
        this._resetSyncRoomProperty(this.currentSyncRoomId).then((res)=>{
          if(res==0){
            return;
          }
          this.loadTopicMembers();
          this.loadFileList();
          this.loadMeetingList();
          //加载customer leads 数据
          if(this.currentTopic.type == 3){
            this.loadNewContacts();
          }

        });
      }else{
        this.loadTopicMembers();
        this.loadFileList();
        this.loadMeetingList();
         //加载customer leads 数据
        if(this.currentTopic.type == 3){
          this.loadNewContacts();
        }
      }
    },
    loadMeetingList() {
      //参数type Active = 1,  Expired = 2,    Finished = 3
      let type = 1 ;
      this.meetingList = [];
      let url = GetAPIUrl() + "SyncRoom/SyncRoomMeeting?syncRoomID="+this.currentSyncRoomId+"&type="+type;
      let self = this;

      this._getData(url, null, result => {
        let list = [];

        for (let i = 0; i < result.length; i++) {
          if(i>1){
            break;
          }
          let data = result[i];

          let startDate = 0;
          let startMonth = 0;
          let startTime = '';
          let endTime = '';
          let duration = 0;
          if (data.PlanedStartDate) {
            let start = new Date(parseInt(data.PlanedStartDate));
            startDate = start.getDate();
            startMonth = start.getMonth();
            startTime = start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            if (data.PlanedEndDate) {
              let end = new Date(parseInt(data.PlanedEndDate));
              duration = end.getTime() - start.getTime();
              endTime = end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            }
          }

          let item = {
            id: data.LessonID,
            title: data.Title,
            course: data.LessonType != 5 ? data.CourseName : self.$t("Activity.Meeting"),
            startDate: startDate,
            startMonth: self._formatMonth(startMonth),
            startTime: startTime,
            endTime: endTime,
            duration: self._formatDuration(duration),
            attendee: data.TeacherCount + data.StudentCount,
            teachers: data.TeacherNames,
            students: data.StudentNames,
            start:data.PlanedStartDate,
          };
          item.countDown=this.countDown(item);

          list.push(item);
        }
        self.meetingList = list;
      }, null);
    },
    _formatMonth(month) {
      return this.standardMonth[month];
    },
    _formatDuration(duration) {
      return Math.round(duration / (1000 * 60));
    },
    countDown(item){
      let localTime=new Date().getTime();
      let startTime=new Date(parseInt(item.start)).getTime();
      let distancetime=startTime-localTime;
      var sec = Math.floor(distancetime/1000%60);
      var min = Math.floor(distancetime/1000/60%60);
      var hour = Math.floor(distancetime/1000/60/60%24);
      
      if(sec<10){
          sec = "0"+ sec;
      }
      if(min<10){
          min = "0"+ min;
      }
      if(hour<10){
          hour = "0"+ hour;
      }

      if(hour==0 && min<=30 && distancetime>0){
        return hour + ":" +min + ":" +sec ;
      }else if(distancetime<=0){
        return "00:00:00"
      }else{
        return false;
      }
    },
    loadFileList(){
      let self = this;
      let url = GetAPIUrl() + "TopicAttachment/";
      url += "List?topicID=" + this.currentSyncRoomId + "&type=0" + "&searchText=";
      this.fileList = [];
      this._getData(url, () => {
          self.fileList = [];
        },data => {
          self.fileList = [];
          self.dataTotal = data.length;
          let list = data;
          for (let i = 0; i < list.length; i++) {
            if(i<=1){
              let attachment = list[i];
              let file = self._attachment2File(attachment);
              self.fileList.push(file);
            }else{
              break;
            }
          }
        },
        null
      );
    },
    _attachment2File(attachment) {
      let date = new Date(parseInt(attachment.CreatedDate));

      //获取文档封面
      let src;
      let str=attachment.AttachmentUrl;
      let index=str.lastIndexOf("/");
      let cstr=str.substring(index + 1, str .length);
      let index2=cstr.lastIndexOf(".");
      let str2=cstr.substring(0,index2);
      let index3=str2.lastIndexOf("_");
      let str3=str2.substring(index3+1,str2.length);
      str=str.substring(0,index+1)+cstr.replace(eval("/"+str3+"/g"),'1_2K');
      src=str;

      return {
        id: attachment.ItemID,
        title: attachment.Title,
        tagList:attachment.TagList,
        coverUrl:src,
        file: attachment.Title,
        date: date.Format("yyyy-MM-dd hh:mm:ss"),
        syncs: attachment.SyncCount,
        download: attachment.SourceFileUrl,
        detail: attachment
      };
    },
    changeFile(item){
      if (this.inList || this.currentTopic.type == 2) {
        if(item.detail.FileType==5 || item.detail.FileType==4)
        {
            this.$Message.error("Can't view this file!");
            return;
        }
        var url=location.origin.toLowerCase();
        url+="/document/"+item.detail.ItemID+"?t="+Math.random();
        this.modalViewFile=true;
        this.modalViewFileUrl=url;
        this.modalViewFileTitle=item.detail.Title;
        return;
      }else{
        this.$parent.displayAttachment(item.detail.AttachmentID,item.detail.Title,item.detail.AttachmentUrl,item.detail.ItemID);
      }
    },
    openSyncList(item){
      if(item.id == this.docSyncShow){
        this.docSyncShow = -1;
        return;
      }
      this.docSyncShow = item.id;
      this.syncsList=[];
      let url=GetAPIUrl()+"Soundtrack/List?attachmentID="+item.detail.AttachmentID+"&isPublic=0" //isPublic:0 获取所有的音响
      let self=this;
      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            self.syncsList=self._synclist(result.RetData,item);
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
    playSync(item){
      if (this.inList) {
        let id= item.id;
        let url = location.origin.toLowerCase();
        url+="/sync/"+id;
        this.modalViewFile=true;
        this.modalViewFileUrl=url;
        this.modalViewFileTitle=item.docDetail.Title;
        return;
      }else{
        this.$parent.playThinkAction(item.id);
      }
    },
    handleStartMeeting(meeting) {
      let lessonId = meeting.id;
      this.changeLessonID(lessonId);
      this.$router.push({ name: "live", params: { id: lessonId } });
    },
    _initializeUsers2(data) {
      let list = [];
      for (let i = 0, count = data.length; i < count; i++) {
        let user = data[i];
        let item = {
          id: user.UserID,
          avatar: user.AvatarUrl?user.AvatarUrl:"../../../static/images/user.svg",
          name: user.Name?user.Name:user.UserName,
          gender: user.Sex === 2 ? this.$t('CourseTeachers.Female') : this.$t('CourseTeachers.Male'),
          phone: user.Phone,
          email: user.Email,
          detail: user,
        };

        list.push(item);
      }
      return list;
    },
    loadNewContacts(){
      friends.getFriends(friends => {
        this.newContacts = this._initializeUsers2(friends);
      });
    },
    loadTopicMembers() {
      let self = this;

      let url = GetAPIUrl() + "Topic/MemberList?TeamTopicID=" + this.currentSyncRoomId;
      this._getData(url, null, data => {
        let olist = [];
        let mlist = [];
        let clist = [];
        let alist = [];

        data.forEach(item => {
          if (item.MemberType < 10) {
            mlist.push(item);    //包括自己的syncroom member,ownner：MemberType为2
          }
          else {
            if (self.currentTopic.type == 1) { // Customer Service
              if (item.MemberType == 10) {
                clist.push(item);
              }
              else {
                alist.push(item);
              }
            }
            else {
              clist.push(item);
            }
          }
        });
        this.memberFullList = mlist;
        // this.customerFullList = clist;
        // this.associatesFullList = alist;
      }, null);
    },
    handMoveOk(){
      if(this.seleceTeamId <= 0){
        this.$Message.info({content: "Please select a team",duration: 3});
        return;
      }
      if(this.moveSyncRoom.selecetSpaceId <=0){
        this.$Message.info({content: "Please select a space",duration: 3});
        return;
      }
      let url=GetAPIUrl()+"SyncRoom/SwitchSpace?syncRoomID="+this.moveToSyncRoomId+"&spaceID="+this.moveSyncRoom.selecetSpaceId;
      this._postData(url,null,null,
        result => {
          this.handMoveCancel();
          this.$Message.info({content: "SyncRoom Move Successfully",duration: 3});
        },
        null
      );
    },
    handMoveCancel(){
      this.seleceTeamId = -1;
      this.moveSyncRoom={moveSyncRoomModal:false,selecetSpaceId:-1}
    },
    loadMoveTeamList() {
      let self = this;
      let url = GetAPIUrl() + "TeamSpace/List?type=1";
      url += "&companyID=" + self.schoolId;

      self._getData(url, null, data => {
        let list = [];
        for(let i = 0; i < data.length; i++) {
          let item = {
            id: data[i].ItemID,
            name: data[i].Name,
            createdDate: data[i].CreatedDate,
            memberType: data[i].MemberType,
            members: data[i].MemberCount,
            documents: data[i].AttachmentCount,
          };
          list.push(item);
        }
        self.teamList = list;
      }, null);
    },
    _loadMoveSpaceList(){
      if (!this.seleceTeamId) {
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "TeamSpace/List?type=2";
      url += "&companyID=" + this.schoolId;
      url += "&parentID=" + this.seleceTeamId;

      this.sapceList=[];

      this._getData(url, null, data => {
        let list = [];
        for(let i = 0; i < data.length; i++) {
          let item = {
            id: data[i].ItemID,
            name: data[i].Name,
            createdDate: data[i].CreatedDate,
            memberType: data[i].MemberType,
          };
          list.push(item);
        }

        self.sapceList = list;
      }, null);
    },
    refreshSyncRoomFileList() {
      this.$refs.topicFiles.refreshFileList();
    },
    handlePropertySave() {
      if (this.catalogName == "") {
        this.$Message.info({
          content: this.catalogTypeName + " name cannot be empty!",
          duration: 3
        });
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "Topic/UpdateTeamTopic";
      let data = {
        ID: this.catalogId,
        Name: this.catalogName,
        TopicType: this.catalogTopicType,
        Note: this.catalogNote
      };

      this._postData(
        url,
        data,
        null,
        result => {
          self.$Message.info({
            content: self.catalogTypeName + " change has been saved!"
          });
          if (self.catalogType === 1) {
            self.kloudsyncTopic.currentTeam.name = self.catalogName;
            self.kloudsyncTopic.currentTeam.note = self.catalogNote;
          } else {
            self.kloudsyncTopic.currentTopic.name = self.catalogName;
            self.kloudsyncTopic.currentTopic.note = self.catalogNote;
            self.kloudsyncTopic.currentTopic.type = self.catalogTopicType;
          }

          if(self.inList){
              self.$parent.loadTopicList();
          }else{
             self._resetSyncRoomProperty(self.currentSyncRoomId);
          }

          self.handlePropertyCancel();
        },
        null
      );
    },
    handlePropertyCancel() {
      this.SyncRoomProperty = false;
    },
    _resetSyncRoomProperty(id) {
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
              let data = result.RetData;
              self.kloudsyncTopic.currentTopic = {
                id: data.ItemID,
                name: data.Name,
                note: data.Note,
                type: data.TopicType,
                typeName: self._topicTypeName(data.TopicType),
                createdDate: data.createdDate,
                memberType: data.MemberType
              };
              self.catalogTypeName = "SyncRoom";
              self.catalogId = self.currentTopic.id;
              self.catalogType = 2; // Topic
              self.catalogName = self.currentTopic.name;
              self.catalogTopicType = self.currentTopic.type;
              self.catalogNote = self.currentTopic.note;
              self.catalogMemberType = self.currentTopic.memberType;

              resolve(data);
            }
            resolve(0);
          }
        });
      });
    },
    _topicTypeName(type) {
      switch (type) {
        case 1:
          return "Customer Service";
        case 2:
          return "Customer Requirement Discussion";
        case 3:
          return "Customer Leads";

        default:
          return "Unknown";
      }
    },
    handleTopicAction(name) {
      let catalogTypeName = this.catalogTypeName;
      let catalogName = this.catalogName;
      switch (name) {
        case "close":
          this.handleCloseTopic(
            this.currentSyncRoomId,
            catalogTypeName,
            catalogName
          );
          break;

        case "share":
          this.copySyncRoomLink(this.currentSyncRoomId);
          break;
        case "move":
          this.moveSyncroom(this.currentSyncRoomId);
          break;
        case "quit":
          this.handleQuitTopic(
            this.currentSyncRoomId,
            catalogTypeName,
            catalogName
          );
          break;

        case "property":
          this.handleTopicProperty(this.currentSyncRoomId);
          break;

        case "delete":
          if (this.catalogType === 2) {
            // Topic
            this.handleDeleteTopic(
              this.currentSyncRoomId,
              catalogTypeName,
              catalogName
            );
          } else if (this.catalogType === 1) {
            // Team
            this.handleDeleteTeam();
          }
          break;
      }
    },
    moveSyncroom(id) {
      this.seleceTeamId = -1;
      this.moveSyncRoom={moveSyncRoomModal:true,selecetSpaceId:-1}
      this.moveToSyncRoomId = id;
      this.loadMoveTeamList();
    },
    copySyncRoomLink(syncRoomID) {
      let id = syncRoomID;
      var url = location.origin.toLowerCase();
      url += "/syncroom/" + id;
      navigator.clipboard.writeText(url).then(
        () => {
          this.$Message.info({
            content: this.$t("Live.CopySyncUrlSuccess"),
            duration: 3
          });
        },
        () => {
          this.$Message.error({
            content: this.$t("Live.CopySyncUrlFailed" + "\n\n" + url),
            duration: 3
          });
        }
      );
    },
    handleTopicProperty(id) {
      this.SyncRoomProperty = true;
      this._resetSyncRoomProperty(id);
    },
    handleCloseTopic(syncRoomId, catalogTypeName, catalogName) {
      let self = this;
      let content =
        "Close " + catalogTypeName + ' "' + catalogName + '". Sure?';
      this.$Modal.confirm({
        title: "Close Topic " + catalogTypeName,
        content: content,
        okText: "OK",
        cancelText: "Cancel",
        onOk: () => {}
      });
    },
    handleQuitTopic(syncRoomId, catalogTypeName, catalogName) {
      let self = this;
      let content =
        "Quit from " + catalogTypeName + ' "' + catalogName + '". Sure?';
      this.$Modal.confirm({
        title: "Quit from " + catalogTypeName,
        content: content,
        okText: "OK",
        cancelText: "Cancel",
        onOk: () => {}
      });
    },
    handleDeleteTeam() {
      let self = this;
      let url = GetAPIUrl() + "Topic/BeforeDeleteTeam?teamID=" + this.catalogId;
      this._getData(
        url,
        null,
        data => {
          if (parseInt(data) > 0) {
            self.$Modal.warning({
              title: "Delete " + self.catalogTypeName,
              content:
                self.catalogTypeName +
                ' "' +
                self.catalogName +
                '" has some topics, Please delete them first!',
              okText: "OK",
              cancelText: "Cancel"
            });
          } else {
            let content =
              self.catalogTypeName +
              ' "' +
              self.catalogName +
              '" will be deleted. Sure?';
            self.$Modal.confirm({
              title: "Delete " + self.catalogTypeName,
              content: content,
              okText: "OK",
              cancelText: "Cancel",
              onOk: () => {
                self._deleteTeam();
              }
            });
          }
        },
        null
      );
    },
    _deleteTeam() {
      let self = this;
      let url = GetAPIUrl() + "Topic/DeleteTeam?teamID=" + this.catalogId;
      this._deleteData(
        url,
        null,
        data => {
          self.$Message.info({
            content:
              self.catalogTypeName +
              '"' +
              self.catalogName +
              '" has been deleted!'
          });
          // self.$parent.refresh();
        },
        null
      );
    },
    handleDeleteTopic(syncRoomID, catalogTypeName, catalogName) {
      let self = this;
      let content =
        catalogTypeName + ' "' + catalogName + '" will be deleted. Sure?';
      self.$Modal.confirm({
        title: "Delete " + catalogTypeName,
        content: content,
        okText: "OK",
        cancelText: "Cancel",
        onOk: () => {
          self._deleteTopic(syncRoomID, catalogTypeName, catalogName);
        }
      });
      // let self = this;
      // let url = GetAPIUrl() + "Topic/BeforeDeleteTopic?topicID=" + syncRoomID;
      // this._getData(url, null, (data) => {
      //   if (parseInt(data) > 0) {
      //     self._mergeTopic();
      //   }
      //   else {
      //     let content = catalogTypeName + ' "' + catalogName + '" will be deleted. Sure?';
      //     self.$Modal.confirm({
      //       title: 'Delete ' + catalogTypeName,
      //       content: content,
      //       okText: 'OK',
      //       cancelText: 'Cancel',
      //       onOk: () => {
      //         self.mergeTopic = 9999;
      //         self._deleteTopic(syncRoomID,catalogTypeName,catalogName);
      //       },
      //     });
      //   }
      // }, null);
    },
    _mergeTopic() {
      this.modalMerge = true;
      this._loadTeamList();
    },
    handleDeleteTopicOK() {
      if (!this.mergeTopic || this.mergeTopic <= 0) {
        this.$Message.info({
          content: "Please select a SyncRoom to merge.",
          duration: 3
        });
        return;
      }

      this._deleteTopic(
        this.currentSyncRoomId,
        this.catalogTypeName,
        this.catalogName
      );
    },
    _loadTeamList() {
      let self = this;
      let url = GetAPIUrl() + "Topic/List?type=1";
      url += "&companyID=" + this.schoolId;

      this._getData(
        url,
        null,
        data => {
          let list = [];
          for (let i = 0; i < data.length; i++) {
            let item = {
              id: data[i].ItemID,
              name: data[i].Name,
              createdDate: data[i].CreatedDate
            };
            list.push(item);
          }

          self.teamFullList = list;
          self.$nextTick(() => {
            self.mergeTeam = self.currentTeam.id;
          });
        },
        null
      );
    },
    _loadTopicList() {
      if (!this.mergeTeam || this.mergeTeam <= 0) {
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "SyncRoom/List?";
      url += "companyID=" + this.schoolId;
      url += "&teamID=" + this.mergeTeam;

      this.mergeTopic = 0;

      this._getData(
        url,
        null,
        data => {
          let list = [];
          for (let i = 0; i < data.length; i++) {
            let item = {
              id: data[i].ItemID,
              name: data[i].Name,
              createdDate: data[i].CreatedDate
            };

            if (item.id != this.currentTopic.id) {
              list.push(item);
            }
          }

          self.topicFullList = list;
        },
        null
      );
    },
    _deleteTopic(syncRoomID, catalogTypeName, catalogName) {
      let self = this;
      let url = GetAPIUrl() + "Topic/DeleteTopic?topicID=" + syncRoomID;
      this._deleteData(
        url,
        null,
        data => {
          self.modalMerge = false;
          self.$Message.info({
            content: catalogTypeName + '"' + catalogName + '" has been deleted!'
          });
          self.$router.push({ name: "projectone-topic" });
        },
        null
      );
    },
    _getData(url, before, success, error) {
      if (before && typeof before === "function") {
        before();
      }

      this.loading = true;
      this.$Loading.start();

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
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
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
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
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

      this.loading = true;
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
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ": " + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === "function") {
            error();
          }
        }
      });
    },
    ...mapMutations(['changeLessonID'])
  }
};
</script>
