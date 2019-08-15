<template>
<div class="forProject-sync-room-left-part">
  <div class="team">
    <div class="team-header">
      {{$t('KloudSyncDocLeftPart.CurrentTeam')}}
    </div>
    <div class="team-content">
      <div class="current-team">
        <span class="team-item-left">
          <Poptip ref="poptipTeam" placement="bottom-start">
            <span style="cursor: pointer;" :title="$t('KloudSyncDocLeftPart.PleaseSelTeam')"><Icon type="arrow-swap" size="20"></Icon></span>
            <span class="current-team-title" :title="$t('KloudSyncDocLeftPart.PleaseSelTeam')">{{kloudsyncTopic.currentTeam.name}}</span>
            <div slot="title" style="min-height: 32px;display:flex;align-items:center">
              <div style="flex:1 1 120px;min-width:120px">
                <b style="line-height:32px">{{$t('KloudSyncDocLeftPart.Teams')}}</b>
              </div>
              <Checkbox v-if="isCompanyOwnerOrAdmin" style="margin-right:10px;" v-model="showAllTeam" @on-change="handTeamList">Show all teams</Checkbox>
              <Button :disabled="!isCompanyOwnerOrAdmin" shape="circle" style="float:right" @click="handleAddTeam">{{$t('KloudSyncDocLeftPart.AddNewTeam')}}</Button>
            </div>
            <div slot="content" >
              <div style="margin: 0.5em;">
                <Input v-model="teamSearch" icon="ios-search" :placeholder="$t('KloudSyncDocLeftPart.PlaceholderSearchTeams')" style="width: 200px" @on-change="handleSearchTeam" @on-enter="handleSearchTeam" @on-click="handleSearchTeam"/>
              </div>

              <div class="team-list" id="doc-team-content" :class="teamListClass" style="max-height: 50vh;overflow-y: auto;">
                <div v-for="item in teamList" :key="item.id" class="team-item" :class="item.id == kloudsyncTopic.currentTeam.id ? 'current-item' : ''" @click="handleSelectTeam(item)">
                  <div class="team-name">
                    <span><Icon type="ios-people" size="24"></Icon></span>
                    <span style="margin-left: 10px;">{{item.name}}</span>
                  </div>

                  <div class="team-info">
                    <div>{{item.members}} {{$t('KloudSyncDocLeftPart.Members')}}</div>
                    <div>{{item.documents}} {{$t('KloudSyncDocLeftPart.Documents')}}</div>
                  </div>
                </div>
              </div>
            </div>
          </Poptip>
        </span>
        <Dropdown  @on-click="handleDocTeamAction($event)">
          <span style="cursor: pointer;padding:10px 20px">
            <Icon size="20" type="android-more-vertical"></Icon>
          </span>
          <DropdownMenu slot="list">
            <DropdownItem name="edit">
              {{$t('KloudSyncDocLeftPart.Edit')}}
            </DropdownItem>
            <DropdownItem name="team member">
              {{$t('KloudSyncDocLeftPart.TeamMember')}}
            </DropdownItem>
            <DropdownItem name="quit" :disabled="!isTeamOwnerAdmin">
              {{$t('KloudSyncDocLeftPart.Quit')}}
            </DropdownItem>
            <DropdownItem name="delete" :disabled="isTeamOwnerAdmin">
              {{$t('KloudSyncDocLeftPart.Delete')}}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Modal v-model="modalAddTeam" :mask-closable="false" :title="$t('KloudSyncDocLeftPart.CreateNewTeam')">
        <div style="padding: 1em 3em;">
          <p style="margin-bottom:0.5em;">{{$t('KloudSyncDocLeftPart.TeamName')}}:</p>
          <Input v-model="newTeamName" :placeholder="$t('KloudSyncDocLeftPart.PlaceholderTeamName')" />
        </div>
        <div style="padding: 1em 3em;">
          <Checkbox v-model="isCreateSyncRoomTeam">{{$t('KloudSyncDocLeftPart.EnableSyncRoom')}}</Checkbox>
        </div>
        <div slot="footer">
          <Button style="min-width: 72px;" type="primary" @click="handleAddTeamOK">{{$t('Base.OK')}}</Button>
          <Button style="" @click="handleAddTeamCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>
    </div>
  </div>

  <div class="space">
    <div class="space-title">
      <span style="flex:1 1 200px;color: #bdc5b8;">{{$t('KloudSyncDocLeftPart.SpaceOfCurrentTeam')}}</span>
      <!-- <span v-if="isTeamOwnerAdmin" style="padding:15px;cursor:pointer;" :title="$t('KloudSyncDocLeftPart.CreataNewSpace')" @click="handleAddSpace" v-show="currentTeam && currentTeam.id > 0">
        <Icon type="ios-plus-outline" size="20"></Icon>
      </span> -->
      <Dropdown class="space-action" @on-click="handFilter($event)" style="padding:15px;cursor:pointer;" v-if="isTeamOwnerAdmin">
        <span class="icon icon-filter" style="font-size:20px;"></span>
        <DropdownMenu slot="list">
          <DropdownItem name="show all" :style="{color:showSpaceType==='show all'?'rgb(45, 140, 240)':'black'}">
            Show all spaces
            <Icon size="10" style="color:rgb(45, 140, 240);;margin-left:15px;" type="checkmark" v-show="showSpaceType==='show all'"></Icon>
          </DropdownItem>
          <DropdownItem name="show my" :style="{color:showSpaceType==='show my'?'rgb(45, 140, 240)':'black'}">
            Show my spaces only
            <Icon size="10" style="color:rgb(45, 140, 240);;margin-left:15px;" type="checkmark" v-show="showSpaceType==='show my'"></Icon>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div class="space-header">
      <Input v-model="spaceSearch" icon="ios-search-strong" :placeholder="$t('KloudSyncDocLeftPart.PlaceholderSearchSpaces')" style="width: 100%" @on-change="handleSearchSpace" @on-enter="handleSearchSpace" @on-click="handleSearchSpace" />
    </div>
    <div class="space-content">
      <div class="space-item" style="color:#2d8cf0;" @click="handleSelectSpace(null)" :class="{'space-current': currentSpace.id <= 0}">
        <span><Icon type="xbox" size="30"></Icon></span>
        <span style="margin-left: 10px;">{{$t('KloudSyncDocLeftPart.AllSpaces')}}</span>
      </div>
      <div v-if="isTeamOwnerAdmin" class="space-item" style="color:#2d8cf0;" @click="handleAddSpace" v-show="currentTeam && currentTeam.id > 0">
        <span><Icon type="ios-plus" size="30"></Icon></span>
        <span style="margin-left: 10px;">{{$t('KloudSyncDocLeftPart.CreataNewSpace')}}</span>
      </div>
      <div v-for="item in spaceList" :key="item.id" class="space-item" :class="{'space-current' : item.id === currentSpace.id}">
        <span class="space-item-left" @click="handleSelectSpace(item)">
          <span><Icon type="ios-checkmark" size="30"></Icon></span>
          <span class="current-team-title">{{item.name}}</span>
        </span>

        <Dropdown class="space-action" @on-click="handleDocSpaceAction($event,item)" v-show="item.id === currentSpace.id">
          <Icon size="20" type="android-more-vertical"></Icon>
          <DropdownMenu slot="list">
            <DropdownItem name="edit">
              {{$t('KloudSyncDocLeftPart.Edit')}}
            </DropdownItem>
            <DropdownItem name="space member">
              {{$t('KloudSyncDocLeftPart.SpaceMember')}}
            </DropdownItem>
            <DropdownItem name="quit" :disabled="isSpaceOwnerAdmin">
              {{$t('KloudSyncDocLeftPart.Quit')}}
            </DropdownItem>
            <DropdownItem name="delete" :disabled="!isSpaceOwnerAdmin">
              {{$t('KloudSyncDocLeftPart.Delete')}}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>

    <Modal v-model="modalAddSpace" :mask-closable="false" :title="$t('KloudSyncDocLeftPart.CreataNewSpace')" style="z-index: 2000; position: absolute;">
      <div style="padding: 1em 3em;">
        <p style="margin-bottom:0.5em;">{{$t('KloudSyncDocLeftPart.SpaceName')}}:</p>
        <Input v-model="newSpaceName" :placeholder="$t('KloudSyncDocLeftPart.PlaceholderSpaceName')" />
      </div>
      <div style="padding: 1em 3em;">
        <Checkbox v-model="createlinkSyncRoomTeam" style="float:left;font-size:13px;font-weight:bold">{{$t('KloudSyncDocLeftPart.EnableSyncRoom')}}</Checkbox>
      </div>
      <div slot="footer">
        <Button style="min-width: 72px;" type="primary" @click="handleAddSpaceOK">{{$t('Base.OK')}}</Button>
        <Button style="" @click="handleAddSpaceCancel">{{$t('Base.Cancel')}}</Button>
      </div>
    </Modal>
  </div>

  <Modal v-model="spaceOrteamProperty" :mask-closable="false" :title="spaceOrteamPropertyTitle" width="600">
    <div class="forProject-doc-space-or-team-modal-property">
      <div class="item-header">
        <Row>
          <Col span="4"><Icon type="ios-people" size="60"></Icon></Col>
          <Col span="20">
            <p style="color: #bdc5b8;">{{typeName}}</p>
            <Input v-model="spaceOrTeamName" :placeholder="$t('KloudSyncDocLeftPart.PlaceholderName')" style="margin-top:10px;"/>
          </Col>
        </Row>
      </div>
    </div>
    <div slot="footer">
      <Checkbox v-model="linkSyncRoomTeam" style="float:left;font-size:13px;font-weight:bold">{{$t('KloudSyncDocLeftPart.EnableSyncRoom')}}</Checkbox>
      <Button style="min-width: 72px;" type="primary" @click="handEditPropertyOk">{{$t('Base.Save')}}</Button>
      <Button style="min-width: 72px;" @click="handEditPropertyCancel">{{$t('Base.Cancel')}}</Button>
    </div>
  </Modal>

  <Modal v-model="teamOrSpaceMember" :mask-closable="false" :title="typeMember" :width="600">
    <div class="forProject-doc-space-or-team-modal-property">
      <div class="item-middle-title">
        <div style="width:100%">
          <Input :placeholder="$t('KloudSyncDocLeftPart.PlaceholderSearchMemebers')" v-model="searchMemberKey" icon="ios-search-strong" @on-change="handleSearchMembers" @on-enter="handleSearchMembers" @on-click="handleSearchMembers"/>
        </div>
      </div>
      <div style="display:flex;align-items:center;padding:20px 0px;">
        <b style="color:black;">{{TeamOrSpaceText}}{{$t('KloudSyncDocLeftPart.OwnerAndAdmin')}}</b>
        <hr color="#dddee1" size="1px" style="flex:1 1 150px;margin:0px 5px;">
        <div style="color: #2b85e4;cursor: pointer;">
          <Dropdown placement="bottom" @on-click="handleAddMemberAdminAction">
            <div style="display:flex;align-items:center;justify-content: center;" v-if="!isTeam && isSpaceOwnerAdmin">
              <span style="display:inline-block">{{$t('KloudSyncDocLeftPart.AddSpaceAdmin')}}</span>
              <Icon style="padding-left: 5px;" type="ios-plus-outline" size="20"></Icon>
            </div>
            <div style="display:flex;align-items:center;justify-content: center;" v-if="isTeam && isTeamOwnerAdmin">
              <span style="display:inline-block">{{$t('KloudSyncDocLeftPart.AddTeamAdmin')}}</span>
              <Icon style="padding-left: 5px;" type="ios-plus-outline" size="20"></Icon>
            </div>
            <DropdownMenu slot="list">
              <DropdownItem name="search">{{typeSearchMember}}</DropdownItem>
              <DropdownItem name="invite">Invite new admin</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div class="item-members item-members-adminOrOwner" v-show="temAdminOrOwnerist.length!=0">
        <div v-for="(item,index) in temAdminOrOwnerist" :key="index" class="member-item">
          <div style="float:left;">
            <Avatar :src="item.MemberAvatar == '' ? '/static/images/user.svg' : item.MemberAvatar"/>
          </div>
          <div style="float:left;margin-left: 2px;">
            <p style="max-width:100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.MemberName}}</p>
            <p v-show="item.MemberType===2" style="color:rgb(189, 197, 184);">{{TeamOrSpaceText}}{{$t('KloudSyncDocLeftPart.TeamOrSpaceOwner')}}</p>
            <p v-show="item.MemberType===1" style="color:rgb(189, 197, 184);">{{TeamOrSpaceText}}{{$t('KloudSyncDocLeftPart.TeamOrSpaceAdmin')}}</p>
          </div>
          <Dropdown placement="bottom" class="more-action" @on-click="handTeamOrSpaceMemberAction($event,item)" v-if="(isTeam && isTeamOwnerAdmin) || (!isTeam && isSpaceOwnerAdmin)">
            <span style="padding:5px;"><Icon size="16" type="more"></Icon></span>
            <DropdownMenu slot="list">
              <DropdownItem name="search">{{$t('KloudSyncDocLeftPart.SendChatRequest')}}</DropdownItem>
              <!-- <DropdownItem name="invite">{{$t('KloudSyncDocLeftPart.SetAsSuperUser')}}</DropdownItem> -->
              <DropdownItem name="remove">{{$t('KloudSyncDocLeftPart.Remove')}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div style="display:flex;align-items:center;padding:20px 0px;">
        <b style="color:black;">{{typeMember}}</b>
        <hr color="#dddee1" size="1px" style="flex:1 1 150px;margin:0px 5px;">
        <div style="color: #2b85e4;cursor: pointer;">
          <Dropdown placement="bottom" @on-click="handleAddMemberAction">
            <div style="display:flex;align-items:center;justify-content: center;" v-if="!isTeam && isSpaceOwnerAdmin">
              <span style="display:inline-block">{{$t('KloudSyncDocLeftPart.InviteNew')}}</span>
              <Icon style="padding-left: 5px;" type="ios-plus-outline" size="20"></Icon>
            </div>
            <DropdownMenu slot="list">
              <DropdownItem name="search">{{typeSearchMember}}</DropdownItem>
              <DropdownItem name="invite">{{$t('KloudSyncDocLeftPart.InviteNew')}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div class="item-members" v-show="memberList.length!=0">
        <div v-for="(item,index) in memberList" :key="index" class="member-item">
          <div style="flex:1 1 120px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
            <Avatar :src="item.MemberAvatar == '' ? '/static/images/user.svg' : item.MemberAvatar"/>
            <span style="margin-left: 2px;">{{item.MemberName}}</span>
          </div>
          <Dropdown placement="bottom" class="more-action" @on-click="handTeamOrSpaceMemberAction($event,item)" v-if="(isTeam && isTeamOwnerAdmin) || (!isTeam && isSpaceOwnerAdmin)">
            <span style="padding:5px;"><Icon size="16" type="more"></Icon></span>
            <DropdownMenu slot="list">
              <DropdownItem name="search">{{$t('KloudSyncDocLeftPart.SendChatRequest')}}</DropdownItem>
              <DropdownItem name="invite">{{$t('KloudSyncDocLeftPart.SetAsSuperUser')}}</DropdownItem>
              <DropdownItem name="remove">{{$t('KloudSyncDocLeftPart.Remove')}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
    <div slot="footer" style="display:none;">
    </div>
  </Modal>

  <Modal v-model="modalSearch" :mask-closable="false" :title="typeSearchMember" :width="600">
    <div style="display:flex;align-items:center;padding:20px 0px">
      <div style="flex:1 1 200px;">从公司联系人和个人联系人中添加成员</div>
      <div style="display:flex;align-items:center;cursor:pointer;color: rgb(43, 133, 228);" @click="modalInvite = true">
        <span style="display:inline-block">{{$t('KloudSyncDocLeftPart.InviteNew')}}</span>
        <Icon style="padding-left: 5px;" type="ios-plus-outline" size="20"></Icon>
      </div>
    </div>
    <Input v-model="searchKey" icon="ios-search" :placeholder="$t('AddContact.PlaceholderEnterPhoneNumberOrName')" @on-enter="handleSearch" @on-click="handleSearch"/>
    <div style="height:1em;"></div>
    <Table ref="searchMember" size="small" :no-data-text="$t('AddContact.NoContractFound')" :stripe="true" :highlight-row="true"
          :data="searchData" :columns="searchColumn" :loading="loading" height="420">
    </Table>

    <div slot="footer">
      <Button type="primary" :loading="loading" @click="handleSearchOK">{{$t('Base.OK')}}</Button>
      <Button @click="handleSearchCancel">{{$t('Base.Cancel')}}</Button>
    </div>
  </Modal>

  <Modal v-model="modalInvite" :mask-closable="false" :title="typeInviteMember">
    <table class="kloudsync-invite-table">
      <tr>
        <td><span style="color:red;">*</span>{{$t('Common.Phone')}}: </td>
        <td>
          <div style="width:inherit">
            <phone-area-code ref="phoneAreaCode" @getAreaCode="getAreaCode"></phone-area-code>
            <div style="float:left;width:calc(100% - 91px);">
              <Input v-model="invitePhone" :placeholder="$t('KloudSyncDocLeftPart.PlaceholderPhoneNumber')"/>
            </div>
          </div>
        </td>
        <td></td>
      </tr>
      <tr style="height:42px">
        <td></td>
        <td><Checkbox v-model="addToMyFriendFlag">{{$t('KloudSyncDocLeftPart.RequestToBeMyContact')}}</Checkbox></td>
        <td></td>
      </tr>
      <!-- <tr>
        <td>{{$t('Common.Email')}}: </td>
        <td><Input v-model="inviteEmail" :placeholder="$t('KloudSyncDocLeftPart.PlaceholderEmailAddress')"/></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td><Checkbox v-model="inviteInternal">{{typeInternalMember}}</Checkbox></td>
        <td></td>
      </tr> -->
      <tr style="height:20px"></tr>
    </table>
    <div slot="footer">
      <div>
        <Button type="primary" :loading="loading" @click="handleInviteOK">{{$t('KloudSyncDocLeftPart.InviteNow')}}</Button>
        <Button style="float:left" @click="handleInviteCancel">{{$t('Base.Cancel')}}</Button>
      </div>
    </div>
  </Modal>
  <Modal v-model="sendResult" :title="typeText" :closable="false" :mask-closable="false"  width="400" style="z-index:40000;position: absolute;">
    <div style="padding-bottom:20px;font-size:13px;">
      <div style="text-align:center;" v-show="!isSendSuccess">
        <p><span class="icon icon-alert" style="font-size:56px;color:red;"></span></p>
        <p style="color:red;font-size:14px;">{{$t('KloudSyncDocLeftPart.RepeatedInvitations')}}</p>
      </div>
      <div style="text-align:center;" v-show="isSendSuccess">
        <p><Icon type="ios-checkmark" size="56" color="#19be6b"></Icon></p>
        <p style="margin-top:8px;color:#19be6b;;font-size:14px;">{{$t('KloudSyncDocLeftPart.SendSMSSuccess')}}</p>
      </div>
      <div style="color:black;margin-top:10px;text-align:center;" v-show="!isSendSuccess">{{invitenNewErrorRetMsg}}</div>
      <div style="color:black;margin-top:10px;text-align:center;" v-show="isSendSuccess">{{$t('KloudSyncDocLeftPart.YourInvitationHadSent',{phone:cellphone})}}</div>
    </div>
    <div slot="footer" style="height:35px;text-align:center;">
      <Button type="primary" @click="handleSendResultOk">{{$t('Base.OK')}}</Button>
    </div>
  </Modal>

  <Modal v-model="modalMerge" :mask-closable="false" :title="$t('KloudSyncDocLeftPart.DeleteSpace')">
    <div class="kloudsync-merge-space">
      <h4>{{$t('KloudSyncDocLeftPart.BeforeDeleteSpaceMergeInfo')}}</h4>
      <p>&nbsp;</p>
      <p>{{$t('KloudSyncDocLeftPart.Current')}}</p>
      <p class="current-space">{{kloudsyncTopic.currentTeam.name}} / {{kloudsyncTopic.currentSpace.name}}</p>
      <p>&nbsp;</p>
      <p>{{$t('KloudSyncDocLeftPart.SelectTeam')}}</p>
      <Select v-model="mergeTeam" :placeholder="$t('KloudSyncDocLeftPart.PleaseSelectTeam')">
        <Option v-for="item in teamMergeFullList" :value="item.id" :key="item.id">{{item.name}}</Option>
      </Select>
      <p>&nbsp;</p>
      <p>{{$t('KloudSyncDocLeftPart.SelectSpace')}}</p>
      <Select v-model="mergeSpace" :placeholder="$t('KloudSyncDocLeftPart.PleaseSelectSpace')">
        <Option v-for="item in spaceMergeFullList" :value="item.id" :key="item.id">{{item.name}}</Option>
      </Select>
    </div>
    <div slot="footer">
      <Button type="primary" :loading="loading" @click="handleDeleteSpaceOK">{{$t('Base.OK')}}</Button>
      <Button @click="modalMerge = false;">{{$t('Base.Cancel')}}</Button>
    </div>
  </Modal>
  <Modal v-model="modalAddTopic" :mask-closable="false" :title="$t('KloudSyncDocLeftPart.CreateNewSyncRoom')" width="700">
    <Row>
      <Col span="24">
        <div style="padding: 1em 3em;">
          <span style="cursor:pointer;" :title="$t('KloudSyncDocLeftPart.PlesSwitchTeam')" @click="pleasechooseTeam">
            <Icon size="16" style="color:#2d8cf0;" type="person-stalker"></Icon>
            <span style="font-size:16px;font-weight:bold;padding-left:5px;color:#2d8cf0;">{{addSyncRoomCurrentTeamName}}</span>
          </span>
          <span style="display:inline-block;font-weight:bold;font-size:16px;padding:0px 10px;">&gt;</span>
          <span style="cursor:pointer;" :title="$t('KloudSyncDocLeftPart.PlesSwitchSpace')" @click="pleasechooseSpace">
            <Icon type="xbox" size="16" style="color:#2d8cf0;"></Icon>
            <span style="font-size:16px;font-weight:bold;padding-left:5px;color:#2d8cf0;">{{addSyncRoomCurrentSpaceName}}</span>
          </span>
        </div>
      </Col>
    </Row>
    <Row v-show="!openTeam && !openSpace">
      <Col span="12">
        <div style="padding: 1em 3em;">
          <p style="margin-bottom:0.5em;">{{$t('KloudSyncDocLeftPart.SyncRoomName')}}:</p>
          <Input v-model="newTopicName" :placeholder="$t('KloudSyncDocLeftPart.SyncRoomName')" />
        </div>
        <div style="padding: 1em 3em;">
          <p style="margin-bottom:0.5em;">{{$t('KloudSyncDocLeftPart.SyncRoomType')}}:</p>
          <Select v-model="newTopicType">
            <Option :value="1">{{$t('KloudSyncDocLeftPart.CustomerService')}}</Option>
            <Option :value="2">{{$t('KloudSyncDocLeftPart.CustomerRequirementDiscussion')}}</Option>
            <Option :value="3">{{$t('KloudSyncDocLeftPart.CustomerLeads')}}</Option>
          </Select>
        </div>
      </Col>
      <Col span="12" style="border-left:1px solid #dddee1;">
        <div style="padding: 1em 3em;">
          <p style="margin-bottom:0.5em;">{{$t('KloudSyncDocLeftPart.SyncRoomMembers')}}:</p>
          <Select multiple v-model="newTopicTeam" :placeholder="$t('KloudSyncDocLeftPart.SelectSyncRoomMembers')" filterable>
            <Option v-for="item in teamMemberList" :value="item.id+'-'+item.role" :key="item.id">{{ item.name }}</Option>
          </Select>
        </div>
        <div v-show="newTopicType == 1">
          <div style="padding: 1em 0em 1em 3em">
            <p style="margin-bottom:0.5em;">
              <span style="margin-right: 20px;display:inline-block">
                <span v-show="isCompany">{{$t('KloudSyncDocLeftPart.CompanyCustomers')}}:</span>
                <span v-show="!isCompany">{{$t('KloudSyncDocLeftPart.IndividualCustomers')}}:</span>
              </span>
              <Checkbox v-model="isCompany" style="font-size: 14px;font-weight: bold;" @on-change="isCompanyOnChange">{{$t('KloudSyncDocLeftPart.CustomerIsCompany')}}</Checkbox>
            </p>

            <div v-show="isCompany" style="margin-bottom:0.5em;display:flex;flex-direction: row;align-items:center">
              <Select  style="flex:1 1 100px;margin-right:5px" v-model="newTopicCompany" :placeholder="$t('KloudSyncDocLeftPart.SelectCompany')" @on-change="handleChangeCompany">
                <Option v-for="item in companyList" :value="item.PTCompanyID" :key="item.PTCompanyID">{{ item.CompanyName }}</Option>
              </Select>
              <Button type="ghost" shape="circle" icon="plus-round" size="small" @click="createCompany"></Button>
            </div>

            <div style="display:flex;flex-direction: row;align-items:center">
              <Select style="flex:1 1 100px;margin-right:5px;" multiple v-model="newTopicCompanyContacts" :placeholder="$t('KloudSyncDocLeftPart.SelectContacts')">
                <Option v-for="item in companyContactList" :value="item.ContactID" :key="item.ContactID">{{ item.ContactName }}</Option>
              </Select>
              <Button type="ghost" shape="circle" icon="plus-round" size="small" @click="handleAddCompanyMember"></Button>
            </div>
          </div>
          <div style="padding: 1em 3em;">
            <p style="margin-bottom:0.5em;">{{$t('KloudSyncDocLeftPart.CustomerAssocistedContacts')}}:</p>
            <Select v-model="newTopicCustomerAssociated" :placeholder="$t('KloudSyncDocLeftPart.SelectCustomerAssociated')"></Select>
          </div>
        </div>
        <div v-show="newTopicType != 1">
          <div style="padding: 1em 3em;">
            <p style="margin-bottom:0.5em;">{{$t('KloudSyncDocLeftPart.CustomerContacts')}}:</p>
            <Select v-model="newTopicCustomer" :placeholder="$t('KloudSyncDocLeftPart.SelectCustomerContacts')"></Select>
          </div>
        </div>
      </Col>
    </Row>
    <div class="forProject-add-syncroom-modal" v-show="openTeam && !openSpace">
      <div class="team-item" v-for="item in modalTeamList" :key="item.id" @click="addSyncRoomSwitchTeam(item)">
        <div class="team-item-header" :style="{backgroundColor:item.bgColor}">
          <p>{{item.shortTitle}}</p>
        </div>
        <div class="team-name">
          {{item.name}}
        </div>
      </div>
    </div>
    <div class="forProject-add-syncroom-modal" v-show="!openTeam && openSpace">
      <div class="team-item" @click="handleAddSpace()" v-if="isTeamOwnerAdmin">
        <div class="team-item-header" style="background-color: rgb(150, 0, 202);">
           <Icon type="home" size="40" style="color:white;"></Icon>
        </div>
        <div class="team-name" style="color:rgb(150, 0, 202)">
          {{$t('KloudSyncDocLeftPart.CreateNew')}}
        </div>
      </div>
      <div class="team-item" v-for="item in addSyncModalSpaceList" :key="item.id" @click="addSyncRoomSwitchSpace(item)">
        <div class="team-item-header" :style="{backgroundColor:item.bgColor}">
          <p>{{item.shortTitle}}</p>
        </div>
        <div class="team-name">
          {{item.name}}
        </div>
      </div>
    </div>
    <div slot="footer" v-show="!openTeam && !openSpace">
      <Button style="min-width: 72px;" type="primary" @click="handleAddTopicOK">{{$t('Base.OK')}}</Button>
      <Button style="" @click="handleAddTopicCancel">{{$t('Base.Cancel')}}</Button>
    </div>
  </Modal>
  <Modal v-model="modalCustomerCompany" :mask-closable="false" :title="$t('KloudSyncDocLeftPart.CustomerCompany')" style="z-index: 2000; position: absolute;">
    <div>
      <div style="padding: 8px 24px">
        <b>{{$t('KloudSyncDocLeftPart.Name')}}: </b>
        <Input v-model="customerCompany.Name" :placeholder="$t('KloudSyncDocLeftPart.EnterCompanyName')"/>
      </div>
      <div style="padding: 8px 24px">
        <b>{{$t('KloudSyncDocLeftPart.WebSite')}}: </b>
        <Input v-model="customerCompany.WebSite" :placeholder="$t('KloudSyncDocLeftPart.EnterCompanyWebSite')"/>
      </div>
      <div style="padding: 8px 24px">
        <b>{{$t('KloudSyncDocLeftPart.Note')}}: </b>
        <Input v-model="customerCompany.Note" :placeholder="$t('KloudSyncDocLeftPart.EnterCompanyNote')" type="textarea" :autosize='{minRows:"4",maxRows:"6"}' />
      </div>
    </div>
    <div slot="footer">
      <Button type="primary" :loading="loading" @click="handleCustomerCompanyOK">{{$t('Base.OK')}}</Button>
      <Button @click="handleCustomerCompanyCancel">{{$t('Base.Cancel')}}</Button>
    </div>
  </Modal>
  <Modal v-model="modalAddCompanyContact" :mask-closable="false" :title="$t('KloudSyncDocLeftPart.AddCompanyContact')" :width="600" style="z-index: 2000; position: absolute;">
    <Input v-model="searchContact " placeholder="Search contact..." style="width:260px;margin-bottom:12px" icon="ios-search" @on-enter="handleSearchAddCustomerContact" @on-click="handleSearchAddCustomerContact"></Input>
    <Table ref="companyContactOfFriend" :no-data-text="$t('Common.NoData')" :stripe="true" :highlight-row="true" :loading="loading"
            :data="inviteTableData" :columns="inviteTableColumn" :height="600">
    </Table>
    <div slot="footer" style="display:none"></div>
    <div slot="close">
      <Button type="primary" :loading="loading" @click="handleAddCompanyContactOK">{{$t('Base.OK')}}</Button>
      <Button @click="handleAddCompanyContactCancel">{{$t('Base.Cancel')}}</Button>
    </div>
  </Modal>
</div>
</template>

<style lang="scss">
.forProject-add-syncroom-modal{
  padding: 1em 3em;
  display:flex;
  flex-direction: row;
  .team-item{
    display:flex;
    justify-content:center;
    align-items: center;
    align-content:center;
    border: solid 1px #999;
    min-height: 160px;
    width: 160px;
    border-radius: 5px;
    flex-direction: column;
    cursor: pointer;
    margin: 5px;
    .team-item-header{
      width: 60px;
      height: 60px;
      color:white;
      background-color: red;
      border-radius: 6px;
      font-size: 22px;
      text-align: center;
      line-height: 60px;
    }
    .team-name{
      margin-top: 15px;
      text-align: center;
      max-width: 140px;
      max-height: 55px;
      overflow: hidden;
    }
  }
}
.forProject-doc-space-or-team-modal-property{
  padding: 10px 30px;
  .item-middle-title{
    span{
      display: inline-block;
    }
  }
  .item-members{
    display: flex;
    flex-direction:row;
    flex-wrap:wrap;
    justify-content:flex-start;
    max-height: 200px;
    overflow: auto;
    .member-item{
      display: flex;
      text-align: left;
      padding: 5px 10px 5px 5px;
      align-items:center;
      flex-direction: row;
      width: 160px;
      .more-action{
        display: none;
      }
    }
    .member-item:hover {
      .more-action{
        display: block;
        cursor: pointer;
      }
    }
    

  }
}
.forProject-sync-room-left-part {
  -webkit-box-flex: 0;
  -moz-box-flex: 0;
  box-flex: 0;
  -webkit-flex: 0 0 270px;
  -moz-flex: 0 0 270px;
  -ms-flex: 0 0 270px;
  flex: 0 0 270px;
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
  //padding: 15px;
  position: relative;

  .team{
    text-align: left;
    span{
      display: inline-block;
    }
    .team-header{
      font-size: 14px;
      color: #bdc5b8;
      padding: 20px 30px 0;
    }
    .team-content {
      padding: 0px;
    }

    .current-team {
      padding: 10px 10px 10px 30px;
      display: flex;
      align-items:center;
      justify-content:flex-start;
      flex-direction: row;

      .team-item-left{
        display:inline-block;
        flex:1 1 200px;
        align-items:center;
        display: flex;
        .current-team-title{
          padding-left: 10px;
          cursor: pointer;
          overflow: hidden;
          max-width:160px;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height:18px
        }
      }

      span{
        display: inline-block;
      }
      .team-list {
        display: flex;
        align-items:stretch;
        justify-content:flex-start;
        flex-wrap: wrap;
        min-width: 250px;

        .team-item {
          width: 240px;
          //height: 150px;
          margin: 5px;
          padding: 5px;
          border: 2px solid #dddee1;
          border-radius: 5px;
          cursor: pointer;
          white-space: normal;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .team-name {
            display: flex;
            align-items:center;
            justify-content:flex-start;
            padding: 5px;
            font-size: 14px;
          }

          .team-info {
            margin-top: 20px;
            color: #80848f;
            padding: 5px;
          }
        }

        .current-item {
          border-color: #2d8cf0;
        }
      }

      .one-item {
        width: 250px;
      }

      .two-items {
        width: 500px;
      }

      .three-items {
        width: 750px;
        .team-item{
          width:calc((100% - 30px)/3);
        }
      }
    }

    .team-selected {
      background-color: #dddee1;
      border-radius: 5px;
    }
  }

  .space{
    text-align: left;
    margin-top: 1em;
    span{
      display: inline-block;
    }
    .space-title{
      padding: 0 10px 0px 30px;
      display: flex;
      flex-direction: row;
      justify-content:flex-start;
      align-items: center;
      span{
        display: inline-block;
      }
    }
    .space-header{
      font-size: 13px;
      color: #bdc5b8;
      padding: 0 30px;
    }
    .space-content{
      padding: 20px 0px;
    }

    .space-item {
      display: flex;
      align-items:center;
      justify-content:flex-start;
      padding: 5px 10px 5px 30px;
      font-size: 14px;
      cursor: pointer;
      border-width: 1px 0px 1px 4px;
      border-style: solid;
      border-color: transparent;

      .space-item-left{
        display:inline-block;
        flex:1 1 200px;
        align-items:center;
        display: flex;

        .current-team-title{
          padding-left: 10px;
          cursor: pointer;
          overflow: hidden;
          max-width:155px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .space-action {
        opacity: 0;
        cursor: pointer;
        padding: 5px 20px;
      }
    }

    .space-current {
      background: #f6f9fd;
      border-color: #5cadff #2d8cf0;
    }

    .space-item:hover .space-action,
    .space-current .space-action {
      opacity: 1;
    }
  }
}
</style>

<script>
import auth from "../../authenticator";
import webapi from "../../webapi/webapi.js";
import friends from "../../friends";
import kloudsyncIndex from "../../common/kloudsync/index.js";
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      loading: false,
      spaceSearch:'',
      teamSearch: '',
      teamFullList: [],
      teamList: [],
      teamListClass: "one-item",
      spaceFullList: [],
      spaceList: [],
      modalAddTeam: false,
      newTeamName: '',
      modalAddSpace: false,
      newSpaceName: '',
      isCreateSyncRoomTeam: true,
      teamparam:{},
      spaceparam:{},
      spaceOrteamProperty:false,
      teamOrSpaceMember:false,
      spaceOrTeamName:'',
      linkSyncRoomTeam:true,
      memberList:[],
      temAdminOrOwnerist:[],
      allMemberList:[],
      allTeamOrAdminMemberList:[],
      typeMember:'',
      typeSearchMember:'',
      typeInviteMember:'',
      typeInternalMember:'',
      typeName:"",
      teamOrSpace:'',
      spaceOrteamPropertyTitle:'',
      searchMemberKey:'',

      modalSearch: false,
      searchKey: '',
      searchData: [],
      searchColumn: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: ' ',
          key: 'avatar',
          sortable: false,
          width: 80,
          render: (h, params) => {
            return h('Avatar', {
              props: {
                size: 'large',
                src: params.row.avatar
              }
            });
          }
        },
        {
          title: this.$t("Common.Name"),
          key: 'name',
          sortable: true,
        },
        {
          title: this.$t("Common.Phone"),
          key: 'phone',
          sortable: false
        }
      ],

      modalInvite: false,
      invitePhone: '',
      inviteEmail: '',
      inviteInternal: true,
      modalMerge: false,
      mergeTeam: 0,
      mergeSpace: 0,
      spaceMergeFullList: [],
      teamMergeFullList : [],
      createlinkSyncRoomTeam:true,

      modalAddTopic: false,
      newTopicName: '',
      newTopicType: 1,
      newTopicTeam: [],
      newTopicCompany: 0,
      newTopicCompanyContacts: [],
      newTopicCustomerAssociated: '',
      newTopicCustomer: '',
      isCompany:true,
      teamMemberList: [],
      companyList:[],
      companyContactList:[],

      addSyncRoomCurrentTeamName:'',
      addSyncRoomCurrentSpaceName:'',
      addSyncRoomCurrentTeamID:0,
      addSyncRoomCurrentTeamSpaceID:0,
      modalTeamList:[],
      openTeam:false,
      openSpace:false,
      addSyncModalSpaceList:[],

      modalCustomerCompany:false,
      customerCompany:{Id: -1, Name:"", Note:"", WebSite: ""},

      modalAddCompanyContact:false,
      companyContactIDList:[],//反选已经添加过的members
      inviteTableData:[],
      inviteTableColumn: [
        {
          title: " ",
          key: "_checked",
          sortable: false,
          type: "selection",
          width: 60
        },
        {
          title: this.$t("Common.Avatar"),
          key: "avatar",
          sortable: false,
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("Avatar", {
              props: {
                size: "large",
                src: params.row.avatar
              }
            });
          }
        },
        {
          title: this.$t("Common.Name"),
          key: "name",
          sortable: true,
          align: "center"
        },
        {
          title: this.$t("Common.Phone"),
          key: "phone",
          sortable: false,
          align: "center"
        },
        {
          title: this.$t("Common.Email"),
          key: "email",
          sortable: false,
          align: "center"
        }
      ],
      allInviteTableData:[],
      searchContact:'',

      addToMyFriendFlag:true,
      areacode:"",
      sendResult:false,
      isSendSuccess:true,
      invitenNewErrorRetMsg:'',

      currentCompanyMemberType:'',
      showAllTeam:false,
      showSpaceType:'show my',
      isAdminMemberAction:false,
    };
  },
  computed: {
    ...mapState(['kloudsyncTopic']),
    schoolId() {
      return auth.getChosenSchoolId();
    },
    isCompanyOwnerOrAdmin(){
      return this.currentCompanyMemberType == 7 || this.currentCompanyMemberType == 8;
    },
    currentTeam() {
      return this.kloudsyncTopic.currentTeam;
    },
    currentSpace() {
      return this.kloudsyncTopic.currentSpace;
    },
    currentTopic() {
      return this.kloudsyncTopic.currentTopic;
    },
    schoolName(){
      return auth.getKloudsyncOrganizationName();
    },
    isTeamOwnerAdmin() {
      return this.kloudsyncTopic.currentTeam.memberType == 1 || this.kloudsyncTopic.currentTeam.memberType == 2 || this.isCompanyOwnerOrAdmin;
    },
    isSpaceOwnerAdmin(){
      return this.kloudsyncTopic.currentSpace.memberType == 1 || this.kloudsyncTopic.currentSpace.memberType == 2 || this.isCompanyOwnerOrAdmin;
    },
    catalogId(){
      if(this.teamOrSpace == "team"){
        return this.kloudsyncTopic.currentTeam.id;
      }else{
        return this.kloudsyncTopic.currentSpace.id
      }
    },
    catalogName(){
      if(this.teamOrSpace == "team"){
        return this.kloudsyncTopic.currentTeam.name;
      }else{
        return this.kloudsyncTopic.currentSpace.name;
      }
    },
    isTeam(){
      if(this.teamOrSpace == "team"){
        return true;
      }else{
        return false;
      }
    },
    TeamOrSpaceText(){
      if(this.teamOrSpace == "team"){
        return this.$t('KloudSyncDocLeftPart.TypeTeamTitle');
      }else{
        return this.$t('KloudSyncDocLeftPart.TypeSpaceTitle');
      }
    },
    cellphone(){
      return (this.areacode+this.invitePhone)
    },
    typeText(){
      if(this.isSendSuccess){
        return this.$t("KloudSyncDocLeftPart.SendSMSSuccess");
      }
      return this.$t("KloudSyncDocLeftPart.Tips")
    },
  },
  watch: {
    mergeTeam(from, to) {
      this.$nextTick(() => {
        this._loadMergeSpaceList();
      });
    },
    modalInvite(val){
      if(val){
        this.$refs.phoneAreaCode.initialAreaCode();
        this.invitePhone = "";
      }
    }
  },
  mounted() {
    //获取记住的机构选择   FieldID：10001代表机构，10002代表Team
    auth.getKLoudsyncMemorizeOrganization(10001).then((res)=>{
      this.teamparam = auth.getKloudsyncTeamparam();
      this.spaceparam = auth.getKloudsyncSpaceparam();
      this.loadTeamList();
      kloudsyncIndex.getCompanyRole(this.schoolId).then((res)=>{
        this.currentCompanyMemberType = res;
      });
    });
  },
  methods: {
    handleSearchAddCustomerContact() {
      if (this.searchContact) {
        let search = new RegExp(this.searchContact, 'i');
        this.inviteTableData = this.allInviteTableData.filter(item => {
          return (item.name.search(search) >= 0 || item.phone.search(search) >= 0)
        });
      }
      else {
        this.inviteTableData = this.allInviteTableData;
      }
    },
    handTeamOrSpaceMemberAction(name,item){
      switch (name) {
        case 'search':
          break;

        case 'invite':
          this.setTeamOrSpaceAdmin(item);
          break;
          
        case 'remove':
          break;
        default:
          break;
      }
    },
    setTeamOrSpaceAdmin(item){
      let self = this;
      let type = "";

      if(this.isTeam){
        type = 'team';
      }else{
        type = 'space';
      }

      let content = "Set up as " + type + self.$t('KloudSyncDocLeftPart.Sure');
      this.$Modal.confirm({
        title: "Set up as "+type+"admin",
        content: content,
        okText: this.$t('Base.OK'),
        cancelText: this.$t('Base.Cancel'),
        onOk: () => {
          let url = GetAPIUrl() + "TeamSpace/ChangeMemberType?ItemID="+self.catalogId+"&MemberID="+item.MemberID+"&memberType="+1;//设置admin,Member = 0,Admin = 1,Owner = 2,CompanyAdmin = 3
          let data = {}
          self._postData(url, data, null,
          result => {
            self.loadTeamOrSpaceMembers();
            content = 'Successfully set up as ' + type + " admin.";
            self.$Message.info({content: content, duration: 3});
          }, null);
        }
      });
    },
    handTeamList(){
      this.loadTeamList();
    },
    handFilter(name){
      this.showSpaceType = name;
      switch (name) {
        case 'show my':
          this.loadSpaceList('my');
          break;

        case 'show all':
          this.loadSpaceList('show all');
          break;
        default:
          break;
      }
    },
    handleSendResultOk(){
      this.sendResult = false;
      this.modalInvite = false;
    },
    getAreaCode(val){
      this.areacode = val;
    },
    handleSearchMembers(){
      if (this.searchMemberKey) {
        let search = new RegExp(this.searchMemberKey, 'i');
        this.memberList = this.allMemberList.filter(item => {
          return item.MemberName.search(search) >= 0;
        });
        this.temAdminOrOwnerist = this.allTeamOrAdminMemberList.filter(item => {
          return item.MemberName.search(search) >= 0;
        });
      }
      else {
        this.temAdminOrOwnerist = this.allTeamOrAdminMemberList;
        this.memberList = this.allMemberList;
      }
    },
    handleAddMemberAdminAction(name){
      this.isAdminMemberAction = true;
      switch (name) {
        case 'search':
          this.searchKey = '';
          this.modalSearch = true;
          this.loadDefaultContactList();
          break;

        case 'invite':
          this.modalInvite = true;
          break;
      }
    },
    handleAddMemberAction(name) {
      this.isAdminMemberAction = false;
      switch (name) {
        case 'search':
          this.searchKey = '';
          this.modalSearch = true;
          this.loadDefaultContactList();
          break;

        case 'invite':
          this.modalInvite = true;
          break;
      }
    },
    loadDefaultContactList(){
      this.handleSearch();
    },
    handleSearch() {
      let self = this;
      let url = GetAPIUrl() + "TeamSpace/SearchContact?companyID="+this.schoolId;
      url+="&spaceID="+this.catalogId;
      url+="&keyword="+encodeURIComponent(base64encode(utf16to8(trimStr(this.searchKey))));
      this._getData(url, null, (data) => {
        self.searchData = self._initializeUsers(data);
      }, null);
    },
    _initializeUsers(data) {
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
          detail: user
        };

        list.push(item);
      }
      return list;
    },
    handleSearchOK() {
      let selected = this.$refs.searchMember.getSelection();
      if (selected.length === 0) {
        this.modalSearch = false;
        return;
      }

      let memberList = "";
      for (let i = 0; i < selected.length; i++) {
        memberList += selected[i].id + ",";
      }
      memberList = memberList.substring(0,memberList.length-1);

      let self = this;
      let userList = memberList.split(",");
      // let url = GetAPIUrl() + "TeamSpace/AddMember?CompanyID=" + this.schoolId + "&TeamSpaceID=" + this.catalogId + "&MemberList=" + memberList;
      let url ;
      if(!this.isTeam && !this.isAdminMemberAction){
       url = GetAPIUrl() + "Invite/InviteCompanyMemberToSpace";
      }else if(this.isTeam && this.isAdminMemberAction){
       url = GetAPIUrl() + "Invite/InviteCompanyMemberAsTeamAdmin";
      }else if(!this.isTeam && this.isAdminMemberAction){
       url = GetAPIUrl() + "Invite/InviteCompanyMemberAsSpaceAdmin";
        return;
      }

      let data = {
        InviteTo:this.catalogId,
        UserIDList:userList
      };

      this._postData(url, data, null, (result) => {
        self.loadTeamOrSpaceMembers();
        self.handleSearchCancel();
      }, null);
    },
    handleSearchCancel() {
      this.modalSearch = false;
      this.searchData = [];
    },
    handleInviteOK() {
      if(!this.invitePhone){
        this.$Message.warning({content:this.$t("KloudSyncDocLeftPart.MobilePhoneNumberCannotBeEmpty"),duration: 3});
        return;
      }

      let self = this;

      let inviteToType = "";
      if(this.isTeam && this.isAdminMemberAction){
        inviteToType = 3;
      }else if(!this.isTeam && this.isAdminMemberAction){
        inviteToType = 4;
      }else{
        inviteToType = 1;
      }

      // let url = GetAPIUrl() + "TeamSpace/InviteUser?itemID=" + this.catalogId + "&mobile=" +(this.areacode+this.invitePhone)  + "&email=" + this.inviteEmail;
      let url = GetAPIUrl() + "Invite/InviteNewToCompany";
      let data = {
        CompanyID:this.schoolId,
        InviteTo:this.catalogId,
        Mobile:this.areacode+this.invitePhone,
        InviteToType:inviteToType,//InviteTo的枚举 Company = 0, Space = 1,  SyncRoom = 2；TeamAdmin = 3;
        RequestAddFriend:this.addToMyFriendFlag?1:0 //RequestAddFriend：1是申请加好友，0是不申请
      };
      this._postData(url, data, null, (result) => {
        // self.$Message.info({content: self.$t('KloudSyncDocLeftPart.AlertInvitatioHasSent'), duration: 3});
        if(result!=-10004){
          self.sendResult = true;
        }
        switch (result) {
          case -10003:
            self.isSendSuccess = false;
            self.invitenNewErrorRetMsg = this.$t("KloudSyncDocLeftPart.YourHaveInvitedTheUser",{phone:this.cellphone});
            break;
          case -10004:
            self.isSendSuccess = false;
            // self.invitenNewErrorRetMsg = "The invitee is already a member of the company.";
            self.handleSendResultOk();
            self.loadTeamOrSpaceMembers();
            break;
          case -10005:
            self.isSendSuccess = false;
            self.invitenNewErrorRetMsg = this.$t("KloudSyncDocLeftPart.cantInviteYourself");
            break;
          default:
            self.isSendSuccess = true;
            break;
        }
      }, null);
    },
    handleInviteCancel() {
      this.modalInvite = false;
    },
    _loadMergeTeamList() {
      let self = this;
      let url = GetAPIUrl() + "TeamSpace/List?type=1";
      url += "&companyID=" + this.schoolId;

      this._getData(url, null, data => {
        let list = [];
        for(let i = 0; i < data.length; i++) {
          let item = {
            id: data[i].ItemID,
            name: data[i].Name,
            createdDate: data[i].CreatedDate,
          };
          list.push(item);
        }

        self.teamMergeFullList = list;
        self.$nextTick(() => {
          self.mergeTeam = self.kloudsyncTopic.currentTeam.id;
        });
      }, null);
    },
    _loadMergeSpaceList() {
      if (!this.mergeTeam || this.mergeTeam <= 0) {
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "TeamSpace/List?type=2";
      url += "&companyID=" + this.schoolId;
      url += "&parentID=" + this.mergeTeam;

      this.mergeSpace = 0;

      this._getData(url, null, data => {
        let list = [];
        for(let i = 0; i < data.length; i++) {
          let item = {
            id: data[i].ItemID,
            name: data[i].Name,
            createdDate: data[i].CreatedDate,
          };

          if (item.id != this.kloudsyncTopic.currentSpace.id) {
            list.push(item);
          }
        }

        self.spaceMergeFullList = list;
      }, null);
    },
    handleDeleteSpaceOK() {
      if(!this.mergeSpace || this.mergeSpace <= 0){
        this.$Message.info({content: this.$t('KloudSyncDocLeftPart.AlertPleaseSelectSpaceToMerge'), duration: 3});
        return;
      }

      this._deleteSpace();
    },
    _mergeSpace() {
      this.modalMerge = true;
      this._loadMergeTeamList();
    },
    _deleteSpace() {
      if (!this.mergeSpace || this.mergeSpace <= 0) {
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "TeamSpace/DeleteSpace?spaceID=" + this.catalogId + "&mergeSpaceID=" + this.mergeSpace;
      this._deleteData(url, null, (data) => {
        self.modalMerge = false;
        self.$Message.info({content: self.typeName + '"' + self.catalogName + '"'+ self.$t('KloudSyncDocLeftPart.AlertHasBeenDeleted')});
        self.loadSpaceList();
      }, null);
    },

    handEditPropertyOk(){
      if(this.spaceOrTeamName==""){
        this.$Message.info({content: this.typeName + this.$t('KloudSyncDocLeftPart.AlertNameCannotBeEmpty'), duration: 3});
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "TeamSpace/UpdateTeamSpace";
      let data = {
        ID: this.catalogId,
        Name: this.spaceOrTeamName,
        Note: this.spaceOrTeamName,
      };

      this._postData(url, data, null,
      result => {
        self.$Message.info({content: self.typeName + self.$t('KloudSyncDocLeftPart.AlertChangeSaved')});
        self.handEditPropertyCancel();
        if(self.isTeam){
          self.kloudsyncTopic.currentTeam.name = self.spaceOrTeamName;
        }else{
          self.kloudsyncTopic.currentSpace.name = self.spaceOrTeamName;
          self.loadSpaceList();
        }
      }, null);
    },
    handEditPropertyCancel(){
      this.spaceOrteamProperty = false;
    },
    handleDocSpaceAction(name,item){
      this.teamOrSpace = "space";
      this.spaceOrteamPropertyTitle = this.$t('KloudSyncDocLeftPart.EditSpaceProperty');
      switch (name) {
        case 'edit':
          this.showSpaceOrTeamPropertyModal(this.teamOrSpace);
          break;

        case 'quit':
          this.handleQuitTeamOrSpace(this.teamOrSpace);
          break;

        case 'space member':
          this.showTeamOrSpaceMemberModal(this.teamOrSpace);
          break;
          
        case 'delete':
          this.handleDeleteSpace(this.teamOrSpace);
          break;
        default:
          break;
      }
    },
    handleDocTeamAction(name){
      this.spaceOrteamPropertyTitle = this.$t('KloudSyncDocLeftPart.EditTeamProperty');
      this.teamOrSpace = "team";
      switch (name) {
        case 'edit':
          this.showSpaceOrTeamPropertyModal(this.teamOrSpace);
          break;

        case 'quit':
          this.handleQuitTeamOrSpace(this.teamOrSpace);
          break;

        case 'team member':
          this.showTeamOrSpaceMemberModal(this.teamOrSpace);
          break;
          
        case 'delete':
          this.handleDeleteTeam(this.teamOrSpace);
          break;
        default:
          break;
      }
    },
    handleDeleteSpace(str) {
      let self = this;
      let id = '';
      let type = '';
      let currentName = "";

      if(str=="team"){
        id = this.kloudsyncTopic.currentTeam.id;
        currentName = this.kloudsyncTopic.currentTeam.name;
        type = this.$t('KloudSyncDocLeftPart.TypeTeamTitle')
      }else{
        id = this.kloudsyncTopic.currentSpace.id;
        currentName = this.kloudsyncTopic.currentSpace.name;
        type = this.$t('KloudSyncDocLeftPart.TypeSpaceTitle')
      }

      let url = GetAPIUrl() + "TeamSpace/BeforeDeleteSpace?spaceID=" + id;
      this._getData(url, null, (data) => {
        if (parseInt(data) > 0) {
          self._mergeSpace();
        }
        else {
          let content = type + ' "' + currentName + '"'+self.$t('KloudSyncDocLeftPart.Delete');
          self.$Modal.confirm({
            title: self.$t('Common.Delete') + type,
            content: content,
            okText: self.$t('Base.OK'),
            cancelText: self.$t('Base.Cancel'),
            onOk: () => {
              self.mergeSpace = 9999;
              self._deleteSpace();
            },
          });
        }
      }, null);
    },
    showTeamOrSpaceMemberModal(str){
      this.teamOrSpaceMember = true;

      if(str=="team"){
        this.typeMember =  this.$t('KloudSyncDocLeftPart.TeamMember');
        this.typeSearchMember = this.$t('KloudSyncDocLeftPart.SearchTeamMember');
        this.typeInviteMember = this.$t('KloudSyncDocLeftPart.InviteNewTeamMember');
        this.typeInternalMember = this.$t('KloudSyncDocLeftPart.SetAsInternalTeamMember');
        this.typeName = this.$t('KloudSyncDocLeftPart.TeamName');
      }else{
        this.typeMember = this.$t('KloudSyncDocLeftPart.SpaceMember');
        this.typeSearchMember = this.$t('KloudSyncDocLeftPart.SearchSpaceMember');
        this.typeInviteMember = this.$t('KloudSyncDocLeftPart.InviteNewSpaceMember');
        this.typeInternalMember = this.$t('KloudSyncDocLeftPart.SetAsInternalSpaceMember');
        this.typeName = this.$t('KloudSyncDocLeftPart.SpaceName');
      }

      this.loadTeamOrSpaceMembers();
    },
    showSpaceOrTeamPropertyModal(str){
      this.spaceOrteamProperty = true;
      if(str=="team"){
        this.spaceOrTeamName = this.currentTeam.name;
      }else{
        this.spaceOrTeamName = this.currentSpace.name;
      }
    },
    loadTeamOrSpaceMembers() {
      let self = this;
      let id = '';

      if(this.isTeam){
        id = this.kloudsyncTopic.currentTeam.id;
      }else{
        id = this.kloudsyncTopic.currentSpace.id;
      }
      
      let url = GetAPIUrl() + "TeamSpace/MemberList?TeamSpaceID=" + id;
      
      this.allMemberList = [];
      this.allTeamOrAdminMemberList = [];
      this.temAdminOrOwnerist = [];
      this.memberList = [];
      this._getData(url, null, data => {
        //加载admin
        for(let item of data){
          if(item.MemberType===2){
            this.allTeamOrAdminMemberList.unshift(item);
          }else if(item.MemberType===1){
            this.allTeamOrAdminMemberList.push(item);
          }else{
            this.allMemberList.push(item);
          }
        }
        this.temAdminOrOwnerist = this.allTeamOrAdminMemberList;
        this.memberList = this.allMemberList;
      }, null);
    },
    handleQuitTeamOrSpace(str) {
      let self = this;
      let id = '';
      let type = '';
      let currentName = "";

      if(str=="team"){
        id = this.kloudsyncTopic.currentTeam.id;
        currentName = this.kloudsyncTopic.currentTeam.name;
        type = self.$t('KloudSyncDocLeftPart.TypeTeamTitle');
      }else{
        id = this.kloudsyncTopic.currentSpace.id;
        currentName= this.kloudsyncTopic.currentSpace.name;
         type = self.$t('KloudSyncDocLeftPart.TypeSpaceTitle');
      }

      let content = self.$t('KloudSyncDocLeftPart.QuitFrom') + type + ' "' + currentName + '"'+ self.$t('KloudSyncDocLeftPart.Sure');
      this.$Modal.confirm({
        title: self.$t('KloudSyncDocLeftPart.QuitFrom') + type,
        content: content,
        okText: this.$t('Base.OK'),
        cancelText: this.$t('Base.Cancel'),
        onOk: () => {
          let url = GetAPIUrl() + "TeamSpace/RemoveMember?ItemID=" +id + "&MemberID=" + auth.getUserID();
          self._deleteData(url, null, (result) => {
            content = self.$t('KloudSyncDocLeftPart.YouJustQuitFrom') + currentName + ".";
            self.$Message.info({content: content, duration: 3});
          }, null);
        }
      });
    },
    handleDeleteTeam(str) {
      let self = this;
      let id = '';
      let type = '';
      let currentName = "";

      if(str=="team"){
        id = this.kloudsyncTopic.currentTeam.id;
        currentName = this.kloudsyncTopic.currentTeam.name;
        type = self.$t('KloudSyncDocLeftPart.TypeTeamTitle');
      }else{
        id = this.kloudsyncTopic.currentSpace.id;
        currentName = this.kloudsyncTopic.currentSpace.name;
        type = self.$t('KloudSyncDocLeftPart.TypeSpaceTitle');
      }

      let url = GetAPIUrl() + "TeamSpace/BeforeDeleteTeam?teamID=" + id;
      this._getData(url, null, (data) => {
        if (parseInt(data) > 0) {
          self.$Modal.confirm({
            title: self.$t('Common.Delete') + type,
            content: type + ' "' + currentName + '" '+self.$t('KloudSyncDocLeftPart.AlertDeleteTeamWarning'),
            okText: self.$t('Base.OK'),
            cancelText: self.$t('Base.Cancel')
          });
        }
        else {
          let content = type + ' "' + currentName + '" '+self.$t('KloudSyncDocLeftPart.AlertDeleteSure');
          self.$Modal.confirm({
            title: self.$t('Common.Delete') + type,
            content: content,
            okText: self.$t('Base.OK'),
            cancelText: self.$t('Base.Cancel'),
            onOk: () => {
              self._deleteTeam(id,type,currentName);
            },
          });
        }
      }, null);
    },
    _deleteTeam(id,type,currentName) {
      let self = this;
      let url = GetAPIUrl() + "TeamSpace/DeleteTeam?teamID=" + id;
      this._deleteData(url, null, (data) => {
        self.$Message.info({content: type + '"' + currentName + '"'+ self.$t('KloudSyncDocLeftPart.AlertHasBeenDeleted')});
        self.loadTeamList();
      }, null);
    },
    getSelectedTeam(){
      let self = this;
      if(self.teamparam && parseInt(self.teamparam.teamId)!=-1){//当只保存机构的时候，会传一个teamId值为-1，故此加限定条件。
        for(let item of self.teamList){
          if(parseInt(self.teamparam.teamId)==parseInt(item.id)){
            self.kloudsyncTopic.currentTeam = item;
            self.$nextTick(()=>{
              self.loadTeamselect(item).then((res)=>{
                if(res && res.length>0){
                  if(self.spaceparam && self.spaceparam.spaceID){
                    for(let spaceItem of res){
                      if(spaceItem.id == parseInt(self.spaceparam.spaceID)){
                        self.handleSelectSpace(spaceItem);
                        break;
                      }
                    }
                  }else{
                    self.$parent.loadTopicList();
                    self.$parent.closeDetail();
                  }
                }else{
                  self.$parent.loadTopicList();
                  self.$parent.closeDetail();
                }
              });
            })

            break;
          }
        }
      }else{
        self.handleSelectSpace(null);
        self.loadSpaceList();
      }
    },
    loadTeamList() {
      let self = this;
      let url = GetAPIUrl() + "TeamSpace/List?type=1";
      url += "&companyID=" + self.schoolId;

      if(this.showAllTeam){
        url += "&showAll=" + 1;
      }

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

        self.teamFullList = list;
        switch (self.teamFullList.length) {
          case 0:
          case 1:
            self.teamListClass = "one-item";
            break;
          case 2:
            self.teamListClass = "two-items";
            break;
          case 3:
          default:
            self.teamListClass = "three-items";
            break;
        }

        if (self.teamFullList.length > 0)
          self.kloudsyncTopic.currentTeam = self.teamFullList[0];
        else
          self.kloudsyncTopic.currentTeam = {id: 0, name: this.$t('KloudSyncDocLeftPart.NoTeam')};

        self.teamList = self.teamFullList;

        self.getSelectedTeam();//记住选择的team
        self.$emit("get-team-list", self.teamFullList);
        self.teamSearch = '';
      }, null);
    },
    loadSpaceList(type) {
      return new Promise((resolve,reject)=>{
        if (!this.kloudsyncTopic.currentTeam || this.kloudsyncTopic.currentTeam.id <= 0) {
          return;
        }

        let self = this;
        let url = GetAPIUrl() + "TeamSpace/List?type=2";
        url += "&companyID=" + this.schoolId;
        url += "&parentID=" + this.kloudsyncTopic.currentTeam.id;
        if(type){
          if(type==="show all"){
            url += "&showAll=" + 1;
          }
        }
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

          self.spaceFullList = list;

          self.spaceList = self.spaceFullList;
          self.spaceSearch = '';
          resolve(self.spaceFullList);
        }, null);
      });
    },
    async loadTeamselect(team){
      this.kloudsyncTopic.currentTeam = team;
      var spaceList= await this.loadSpaceList();
      return new Promise((resolve,reject)=>{
        this.kloudsyncTopic.currentSpace = {id: 0};
        resolve(spaceList);
      })


    },
    handleSelectTeam(team) {
      this.kloudsyncTopic.currentTeam = team;
      if(this.$refs.poptipTeam){
        this.$refs.poptipTeam.ok();
      }
      this.loadSpaceList();

      this.kloudsyncTopic.currentSpace = {id: 0};

      this.$nextTick(()=>{
        this.$parent.changeTeamOrspace();
        this.$parent.closeDetail();
      })

      //记住选择的team
      auth.MemorizeOrganization(10001,this.schoolId,this.kloudsyncTopic.currentTeam.id,this.schoolName,this.kloudsyncTopic.currentTeam.name,null,null);
    },
    handleSelectSpace(space) {
      let flag;
      if (space){
        this.kloudsyncTopic.currentSpace = space;
        flag=true;//spaece上传的标志
        //记住选择的space
        auth.MemorizeOrganization(10001,this.schoolId,this.kloudsyncTopic.currentTeam.id,this.schoolName,this.kloudsyncTopic.currentTeam.name,this.kloudsyncTopic.currentSpace.id,this.kloudsyncTopic.currentSpace.name);
      }else{
        flag=false;//team上传的标志
        this.kloudsyncTopic.currentSpace = {id: 0};
        //记住选择的space
        auth.MemorizeOrganization(10001,this.schoolId,this.kloudsyncTopic.currentTeam.id,this.schoolName,this.kloudsyncTopic.currentTeam.name,null,null);
      }
      this.$nextTick(()=>{
        this.$parent.changeTeamOrspace();
        this.$parent.closeDetail();
      })
    },
    handleSearchTeam() {
      if (this.teamSearch) {
        let search = new RegExp(this.teamSearch, 'i');
        this.teamList = this.teamFullList.filter(item => {
          return item.name.search(search) >= 0;
        });
      }
      else {
        this.teamList = this.teamFullList;
      }
    },
    handleSearchSpace() {
      if (this.spaceSearch) {
        let search = new RegExp(this.spaceSearch, 'i');
        this.spaceList = this.spaceFullList.filter(item => {
          return item.name.search(search) >= 0;
        });
      }
      else {
        this.spaceList = this.spaceFullList;
      }
    },
    handleAddTeam() {
      this.$refs.poptipTeam.ok();
      this.newTeamName = '';
      this.modalAddTeam = true;
    },
    handleAddTeamOK() {
      if(this.newTeamName==""){
        this.$Message.info({content:this.$t('KloudSyncDocLeftPart.AlertTeamNameCannotBeEmpty'),duration: 3});
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "TeamSpace/CreateTeamSpace";
      let data = {
        CompanyID: this.schoolId,
        Type: 1, //Team=1 space=2;
        Name: this.newTeamName,
        ParentID: 0,
        CreateTopicTeam: this.isCreateSyncRoomTeam,
      };

      this._postData(url, data, null,
        result => {
          self.modalAddTeam = false;
          self.$nextTick(() => {
            self.loadTeamList();
          })
        }, null);
    },
    handleAddTeamCancel() {
      this.modalAddTeam = false;
    },
    handleAddSpace() {
      this.modalAddSpace = true;
      this.newSpaceName = "";
      this.createlinkSyncRoomTeam = true;
    },
    handleAddSpaceOK() {
      if(this.newSpaceName==""){
        this.$Message.info({content:this.$t('KloudSyncDocLeftPart.AlertSpaceNameCannotBeEmpty'),duration: 3});
        return;
      }

      let TeamId = "";
      if(this.modalAddTopic && this.addSyncRoomCurrentTeamID>0){
        TeamId = this.addSyncRoomCurrentTeamID;//在创建syncroom时 添加space
      }else{
        TeamId = this.kloudsyncTopic.currentTeam.id;

      }

      let self = this;
      let url = GetAPIUrl() + "TeamSpace/CreateTeamSpace";
      let data = {
        CompanyID: this.schoolId,
        Type: 2,//Team=1 space=2;
        Name: this.newSpaceName,
        ParentID: TeamId,
      };

      this._postData(url, data, null,
        result => {
          self.modalAddSpace = false;
          self.$nextTick(() => {
            //创建syncroom时 添加space成功回调
            if(self.modalAddTopic && self.addSyncRoomCurrentTeamID>0){
              self.loadAddSyncRoomModalSpaceList();
              if(self.addSyncRoomCurrentTeamID == self.kloudsyncTopic.currentTeam.id){
                self.loadSpaceList();
              }
            }else{
              self.loadSpaceList().then((list)=>{
                //创建并选中新创建space
                if(list && list.length>0){
                  for(let item of list){
                    if(item.id == result){
                      self.handleSelectSpace(item);
                      break;
                    }
                  }
                }
              });
            }
          })
        }, null);
    },
    handleAddSpaceCancel() {
      this.modalAddSpace = false;
    },
    updateCurrentName(id, name) {
      if (this.kloudsyncTopic.currentTeam.id === id) {
        this.kloudsyncTopic.currentTeam.name = name;
      }
      else if (this.kloudsyncTopic.currentSpace.id === id) {
        this.kloudsyncTopic.currentSpace.name = name;
      }
    },

    //new syncroom
    createCompany(){
      this.customerCompany = {Id: -1, Name:"", Note:"", WebSite:""};
      this.modalCustomerCompany = true;
    },
    handleCustomerCompanyOK(){
      let self = this;
      let url = GetAPIUrl() + "PTCompany/CreatePTCompany";
      let data = {
        CompanyID: this.customerCompany.Id,
        AccountCompanyID: this.schoolId,
        CompanyName: this.customerCompany.Name,
        CompanyNote: this.customerCompany.Note,
        WebSite: this.customerCompany.WebSite
      };
      this._postData(url, data, null, (result) => {
        self.modalCustomerCompany = false;
        self.loadCompanyList();
      }, null);
    },
    handleCustomerCompanyCancel(){
      this.modalCustomerCompany = false;
    },
    handleAddCompanyMember() {
      this.searchContact = "";
      this.modalAddCompanyContact=true;
      this.companyContactIDList=[];

      let self=this;

      for(let item of this.companyContactList){
        this.companyContactIDList.push(item.ContactID);
      }
      friends.getFriends(function(friends) {
         self.allInviteTableData = self._initializeUsers2(friends);
         self.inviteTableData = self.allInviteTableData;
      });
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
          _checked:this.companyContactIDList.includes(user.UserID)
        };

        list.push(item);
      }
      return list;
    },
    handleAddCompanyContactOK(){
      let selected=this.$refs.companyContactOfFriend.getSelection();

      if (selected.length === 0) {
        this.modalAddCompanyContact = false;
        return;
      }
      if(this.newTopicCompany===0){//没有选择company的提示
        this.$Message.warning({content: $t('KloudSyncDocLeftPart.PleaseSelectCompany'), duration: 5});
        return;
      }

      let memberList="";
      selected.forEach(element => {
        memberList+=element.id+",";
      });
      memberList=memberList.substring(0,memberList.length-1);
      let data={};
      let url=GetAPIUrl() + "PTCompanyContact/AddContacts?ptCompanyID="+this.newTopicCompany+"&contactIDs="+memberList;

      this._postData(url, data, null, (result) => {
        this.modalAddCompanyContact=false;
        this.loadCompanyContact();
      }, null);
    },
    handleAddCompanyContactCancel(){
      this.modalAddCompanyContact=false;
    },



    pleasechooseTeam(){
      this.openTeam = true;
      this.openSpace = false;

      this.modalTeamList = [];
      for(let item of this.teamFullList){
        let team = {id:item.id,shortTitle:this.getShortName(item.name),name:item.name,bgColor:this.randomColor()};
        this.modalTeamList.push(team);
      }
    },
    loadAddSyncRoomModalSpaceList() {
      if (this.addSyncRoomCurrentTeamID <= 0) {
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "TeamSpace/List?type=2";
      url += "&companyID=" + this.schoolId;
      url += "&parentID=" + this.addSyncRoomCurrentTeamID;

      this.addSyncModalSpaceList = [];
      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            let data = result.RetData;
            let list = [];
            for(let i = 0; i < data.length; i++) {
              let space = {id:data[i].ItemID,shortTitle:self.getShortName(data[i].Name),name:data[i].Name,bgColor:self.randomColor()};
              list.push(space);
            }
            self.addSyncModalSpaceList = list;
          }
        },
      });
    },
    pleasechooseSpace(){
      this.openTeam = false;
      this.openSpace = true;
      this.loadAddSyncRoomModalSpaceList();
    },
    handleAddTopic() {
      this.newTopicName = '';
      this.modalAddTopic = true;

      this.openTeam = false,
      this.openSpace = false,

      this.isCompany = true;
      this.companyContactList = [];
      this.newTopicCompany = 0;
      this.newTopicCompanyContacts = [];

      this.loadTeamMemberList();
      this.loadCompanyList();
      this.loadModalAddSyncRoomDefault();
    },
    loadModalAddSyncRoomDefault(){
      this.addSyncRoomCurrentTeamName = this.kloudsyncTopic.currentTeam.id<=0? this.$t("KloudSyncDocLeftPart.PlesSwitchTeam"):this.kloudsyncTopic.currentTeam.name;
      this.addSyncRoomCurrentSpaceName = this.kloudsyncTopic.currentSpace.id<=0? this.$t("KloudSyncDocLeftPart.PlesSwitchSpace"):this.kloudsyncTopic.currentSpace.name;
      this.addSyncRoomCurrentTeamID = this.kloudsyncTopic.currentTeam.id<=0? 0:this.kloudsyncTopic.currentTeam.id;
      this.addSyncRoomCurrentTeamSpaceID = this.kloudsyncTopic.currentSpace.id<=0?0:this.kloudsyncTopic.currentSpace.id;
    },
    randomColor() {
        var arr = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        var chars = '';
        for(var i = 0; i < 6; i ++) {
            chars += arr[Math.round(Math.random() * 100 % 15)]
        }
        return '#' + chars;
    },
    getShortName(name){
        var arr=name.split(" ");
        for(var i=0,j=arr.length;i<j;i++)
        {
            if(arr[i]=="")
            {
                arr.splice(i,1);
                i--;
                j--;
            }
        }
        if(arr.length>1)
        {
            return (arr[0].substr(0,1)+arr[1].substr(0,1)).toUpperCase();
        }
        else
        {
            return name.substr(0,2).toUpperCase();
        }
    },
    addSyncRoomSwitchTeam(item){

      this.addSyncRoomCurrentTeamID = item.id;
      this.addSyncRoomCurrentTeamName = item.name;
      this.addSyncRoomCurrentSpaceName = this.$t("KloudSyncDocLeftPart.PlesSwitchSpace");
      this.addSyncRoomCurrentTeamSpaceID = 0;

      this.openSpace = true;
      this.openTeam = false;

      this.loadAddSyncRoomModalSpaceList();
    },
    addSyncRoomSwitchSpace(item){
      this.addSyncRoomCurrentTeamSpaceID = item.id;
      this.addSyncRoomCurrentSpaceName = item.name;

      this.openSpace = false;
      this.openTeam = false;
    },

    loadTeamMemberList() {
      let self = this;
      webapi.getSchoolContactAndMyFriends(this.schoolId).then((res)=>{
        self.teamMemberList = res;
      });

      /*let url = GetAPIUrl() + "TeamSpace/MemberList?TeamSpaceID=" + this.kloudsyncTopic.currentTeam.id;
      this._getData(url, null, data => {
        let list = [];

        data.forEach(item => {
          if (item.MemberType < 10) {
            list.push(item);
          }
        });

        self.teamMemberList = list;
      }, null);*/
    },
    loadCompanyList() {
      let self = this;
      let url = GetAPIUrl() + "PTCompany/List?companyID="+this.schoolId;//加载company列表

      this._getData(url, null, (result) => {
        self.companyList=result;
      }, null);
    },
    handleChangeCompany(current){
      this.newTopicCompanyContacts=[];
      this.loadCompanyContact();
    },
    loadCompanyContact(){
      this.companyContactList=[];
      if(this.newTopicCompany && this.newTopicCompany!=0){
        let url = GetAPIUrl() + "PTCompanyContact/List?ptCompanyID="+this.newTopicCompany;//加载company下的contact列表
        this._getData(url, null, (result) => {
          this.companyContactList=result;
        }, null);
      }
    },
    isCompanyOnChange(state){
      this.companyContactList = [];
      this.newTopicCompany = 0;
      this.newTopicCompanyContacts = [];
    },
    handleAddTopicOK() {
      if(this.addSyncRoomCurrentTeamID<=0){
        this.$Message.info({content:$t('KloudSyncDocLeftPart.TeamCannotBeEmpty'),duration: 3});
        return;
      }

      if(this.addSyncRoomCurrentTeamSpaceID<=0){
        this.$Message.info({content:$t('KloudSyncDocLeftPart.SpaceCannotBeEmpty'),duration: 3});
        return;
      }

      if(this.newTopicName==""){
        this.$Message.info({content:$t('KloudSyncDocLeftPart.SyncRoomNameCannotBeEmpty'),duration: 3});
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "SyncRoom/CreateSyncRoom";
      let data = {
        CompanyID: this.schoolId,
        Title: this.newTopicName,
        Type: this.newTopicType,
        // TeamID: this.kloudsyncTopic.currentTeam.id,
        SpaceID: this.addSyncRoomCurrentTeamSpaceID,
        MemberList:[{"MemberID": auth.getUserID(), "Role":2}]
      };

      if (this.newTopicTeam.length != 0) {
        for (let item of this.newTopicTeam){
          if(item.split("-")[0]!=auth.getUserID()){
            let member = {"MemberID":item.split("-")[0],"Role":item.split("-")[1]};
            data.MemberList.push(member);
          }
        }
      }

      // if(this.newTopicCompany && this.newTopicCompany != 0){
      //   data.PTCompanyID = this.newTopicCompany;

      //   if(this.newTopicCompanyContacts.length != 0){
      //     data.CustomerList = this.newTopicCompanyContacts.join(",");
      //   }
      // }

      this._postData(url, data, null,
        result => {
          self.modalAddTopic = false;
          self.newTopicTeam = [];
          self.$nextTick(() => {
            self.$parent.loadTopicList();
          })
        }, null);
    },
    handleAddTopicCancel() {
      this.modalAddTopic = false;
      this.newTopicTeam = [];
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
      if (before && typeof before === 'function') {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: 'POST',
        url: url,
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        data: JSON.stringify(data),
        beforeSend: function (request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function (resultString) {
          let result = JSON.parse(resultString);
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === 'function') {
              success(result.RetData);
            }
          }else { // error
            success(result.RetCode);
            self.loading = false;
            self.$Loading.finish();
            // self.$Loading.error();
            // self.$Message.error(result.ErrorMessage);
            // console.log(result);

            if (error && typeof error === 'function') {
              error(result);
            }
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ': ' + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === 'function') {
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
    }

  }
}
</script>
