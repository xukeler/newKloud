<template>
  <div class="forProject-contact-flexviews">
    <!-- <div class="panel-gutter"></div> -->
    <div class="panel-catalog">
      <div class="contact-search-one">
        <Input v-model="searchContact" icon="ios-search" placeholder="Search Users..." style="width: 100%" @on-keyup="searchUsers"/>
      </div>
      <div class="contact-type">
        <Row>
          <Col span="12">
            <span @click="selectContactType(1)" style="cursor: pointer;" :class="{selectColor:currentType=='Company contact'}">
              <p><Icon type="android-contacts" :title="$t('KloudSyncAccountContact.AccountContact')" size="26"></Icon></p>
              <p>{{$t('KloudSyncAccountContact.AccountContact')}}</p>
            </span>
          </Col>
          <Col span="12">
            <span @click="selectContactType(2)" :class="{selectColor:currentType=='My contact'}" style="cursor: pointer;">
              <p><Icon type="android-person" title="My Contact" size="26"></Icon></p>
              <p>{{$t('KloudSyncAccountContact.MyContact')}}</p>
            </span>
          </Col>
        </Row>
      </div>
      <!-- <div class="contact-team-tree" v-show="currentType=='Company contact'">
        <Tree :data="teamSpaceData" :render="teamSpaceRender" :empty-text="$t('KloudSyncAccountContact.NoTeamSpace')"></Tree>
      </div> -->
      <div class="currentType-contact-list" v-show="currentType=='Company contact'">
        <div class="add-currentType-contact">
          <Dropdown @on-click="switchHandleInvite">
            <Icon type="plus-circled" size="24" color="rgb(37,176,56)" :title="$t('KloudSyncAccountContact.AddAccountContact')"></Icon>
            <DropdownMenu slot="list" style="width: 160px;">
                <DropdownItem name="Select from contacts">{{$t('KloudSyncAccountContact.SelectFromContacts')}}</DropdownItem>
                <DropdownItem name="Invite New">{{$t('KloudSyncAccountContact.InviteNew')}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
         </div>
        <Collapse v-model="contactOpen">
          <Panel name="contact">
            <span style="font-weight:bold">{{$t('KloudSyncAccountContact.Contact')}}</span>
            <div slot="content" style="max-height:calc(100vh - 280px);overflow:auto;">
              <div class="contact-list-item" v-for="(contactItem,index) in accountContactList" :key="index" v-show="index < 10 || showAllContacts">
                <div class="contact-list-item-child" :class="{bgColor:chooseBgclolor==contactItem.UserID}" @mousedown="selectAccountContact(contactItem)">
                  <p style="max-width: 320px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                    <span class="contact-head"><Avatar style="width:26px;height:26px;margin-right:8px;" :src="contactItem.AvatarUrl==''?'/static/images/user.svg':contactItem.AvatarUrl" /></span>
                    <span>{{contactItem.UserName}}</span>
                    <span style="float:right;margin-right:3em;cursor:pointer" v-if="contactItem.EnableChat==1"><Icon type="ios-chatbubble-outline" size="24"></Icon></span>
                  </p>
                </div>
              </div>
              <div class="contact-list-item" v-show="!showAllContacts && accountContactList.length > 10">
                <div class="contact-list-item-child">
                  <a href="javascript:void(null);" @click="showAllContacts = true;">{{$t('KloudSyncAccountContact.SHOWALL')}}</a>
                </div>
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
      <div class="currentType-contact-list" v-show="currentType=='My contact'">
        <p class="team-number">{{$t('KloudSyncAccountContact.MyContact')}}(<span>{{myContactsLength}}</span>)
          <span style="float:right;cursor:pointer" :title="$t('KloudSyncAccountContact.AddMyContact')" @click="addMyFriend">
            <Icon type="plus-circled" size="24" color="rgb(37,176,56)"></Icon>
          </span>
        </p>
        <div style="max-height:calc(100vh - 280px);overflow:auto;">
          <div class="contact-list-item" v-for="(contactItem,index) in friendList" :key="index">
            <div  class="contact-list-head">{{contactItem.Index}}</div>
            <div  class="contact-list-item-child" :class="{bgColor:chooseBgclolor==itemChild.RongCloudUserID}" v-for="(itemChild,itemChildIndex) in contactItem.Users" :key="itemChildIndex" @mousedown="chooseContact(itemChild.UserID,itemChild.RongCloudUserID,itemChild.Name,itemChild.AvatarUrl)">
              <p style="max-width: 320px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                <span class="contact-head"><Avatar style="width:26px;height:26px;margin-right:8px;" :src="itemChild.AvatarUrl==''?'/static/images/user.svg':itemChild.AvatarUrl" /></span>
                <span>{{itemChild.Name}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel-content">
      <div class="contact-person-info" v-show="showPersonDetail">
        <div class="contact-head">
          <div class="contact-head-left">
            <p style="font-size:24px;white-space: nowrap;overflow-x: hidden;text-overflow: ellipsis;">{{selectPerson.detailContactName?selectPerson.detailContactName:'Please select a contact person'}}</p>

            <!-- <p class="contact-introduced">
              Introduced by Tieren Zhou on June 1 2018.
            </p> -->
          </div>
          <div class="contact-head-right">
            <img :src="selectPerson.avatarUrl==''?'../../../static/images/user.svg':selectPerson.avatarUrl" width="60" height="60" style="border-radius: 50%"/>
          </div>
        </div>
        <div class="contact-content" v-show="teamSpaceList.length!=0">
          <!--暂时隐藏-->
          <!-- <div class="contact-header">
            {{$t('KloudSyncAccountContact.MemberOfSpaces')}}
          </div> -->
          <div class="contact-team-list">
            <div v-for="team in teamSpaceList" class="contact-team-item" :key="team.ItemID">
              <div class="team-item">
                <Icon type="ios-people" size="32" style="margin-right:8px;"></Icon>
                <span>{{team.Name}}</span>                
              </div>
              <div v-for="space in team.SpaceList" class="space-item" :key="space.ItemID">
                <Icon type="ios-checkmark" size="32" style="margin-right:8px;"></Icon>
                {{space.Name}}
              </div>
            </div>
          </div>
        </div>
        <div class="contact-footer">
            <Button type="text" @click="sendMessege()">
              <p><span class="contact-footer-circle"></span></p>
              <p>{{$t('KloudSyncAccountContact.Messeage')}}</p>
            </Button>

            <!--暂时隐藏-->
            <!-- <Button style="margin-left:30px;">
              <p><span class="contact-footer-meeting"></span></p>
              {{$t('KloudSyncAccountContact.Meeting')}}
            </Button> -->
          </div>
      </div>

      <!--暂时隐藏tema 和 space-->
      <!-- <div class="contact-team-space-info" v-show="!showPersonDetail">
        <div class="contact-head">
          <div class="contact-head-left">
            <p style="font-size:24px;white-space: nowrap;overflow-x: hidden;text-overflow: ellipsis;">{{selectTeam.name}}</p>

            <p class="contact-statistics">
              {{$t('KloudSyncAccountContact.Documents')}} {{selectTeam.detail.AttachmentCount}}
              <span style="margin-left:3em;"></span>
              Syncs: 1205
            </p>
          </div>
          <div class="contact-head-right">
            <img src="/static/preview/images/group-default.svg" width="60" height="60" style="border-radius: 50%"/>
          </div>
        </div>
        <div class="contact-content" >
          <div class="member-item" style="cursor: pointer; color:#2d8cf0; margin-bottom: 0.5em;">
            <span style="width:32px;"><Icon type="ios-plus" size="32"></Icon></span>
            <Dropdown placement="right-start" @on-click="handleAddMemberAction">
              <span style="padding: 0 10px;">Invite new</span>
              <DropdownMenu slot="list">
                <DropdownItem name="search">Search Team Member</DropdownItem>
                <DropdownItem name="invite">Invite New</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          <div class="member-list">
            <div class="member-item" v-for="item in memberList" :key="item.MemberID">
              <span class="member-avatar"><Avatar :src="item.MemberAvatar == '' ? '/static/images/user.svg' : item.MemberAvatar" /></span>
              <span style="margin-left: 10px;">{{item.MemberName}}</span>
              <Dropdown class="member-action" placement="bottom-end" @on-click="handleMemberAction($event, item)">
                <span>
                  <Icon size="16" type="more"></Icon>
                </span>
                <DropdownMenu slot="list">
                  <DropdownItem name="chat">Send Chat Request</DropdownItem>
                  <DropdownItem name="admin">Set as Space Admin</DropdownItem>
                  <DropdownItem name="remove">Remove from Space</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

        </div>
        <div class="contact-footer">
            <Button type="text">
              <p><span class="contact-footer-circle"></span></p>
              <p>{{$t('KloudSyncAccountContact.Messeage')}}</p>
            </Button>
            <Button style="margin-left:30px;">
              <p><span class="contact-footer-meeting"></span></p>
              <p>{{$t('KloudSyncAccountContact.Meeting')}}</p>
            </Button>
          </div>
      </div> -->

      <div>
        <Modal v-model="modalSearch" :mask-closable="false" :title="$t('KloudSyncAccountContact.SearchContact')" width="600">
          <Input v-model="searchKey" icon="ios-search" :placeholder="$t('AddContact.PlaceholderEnterPhoneNumberOrName')" @on-enter="handleSearch" @on-click="handleSearch"/>
          <div style="height:1em;"></div>
          <Table ref="search" size="small" :no-data-text="$t('AddContact.NoContractFound')" :stripe="true" :highlight-row="true"
                :data="searchData" :columns="searchColumn" :loading="loading" height="400">
          </Table>
          
          <div slot="footer">
            <Button v-if="addCompanyContact" type="primary" :loading="loading" @click="addCompanyContactOk">{{$t('Base.OK')}}</Button>
            <Button v-else type="primary" :loading="loading" @click="handleSearchOK">{{$t('Base.OK')}}</Button>
            <Button @click="handleSearchCancel">{{$t('Base.Cancel')}}</Button>
          </div>
        </Modal>

        <Modal v-model="modalInvite" :mask-closable="false" :title="$t('KloudSyncAccountContact.InviteNewTeamMember')">
          <table class="forProject-invite-table">
            <tr>
              <td>{{$t('KloudSyncAccountContact.Phone')}} </td>
              <td><Input v-model="invitePhone" placeholder="Phone Number"/></td>
              <td></td>
            </tr>
            <tr>
              <td>{{$t('KloudSyncAccountContact.Email')}} </td>
              <td><Input v-model="inviteEmail" :placeholder="$t('KloudSyncAccountContact.EmailAddress')"/></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td><Checkbox v-model="inviteInternal">{{$t('KloudSyncAccountContact.SetTeamMember')}}</Checkbox></td>
              <td></td>
            </tr>
          </table>
          <div slot="footer">
            <Button type="primary" :loading="loading" @click="handleInviteOK">{{$t('Base.OK')}}</Button>
            <Button @click="handleInviteCancel">{{$t('Base.Cancel')}}</Button>
          </div>
        </Modal>
        <Modal v-model="modalInviteNew" :mask-closable="false" :title="$t('KloudSyncAccountContact.InviteNewContact')" width="600">
          <table class="forProject-invite-table">
            <tr>
              <td><span style="color:red;">*</span>{{$t('KloudSyncAccountContact.Phone')}} </td>
              <td>
                <Button style="width:25%;float:left" @click="handleSelectCountry"><span class="flag-icon" :class="inviteAccountContact.phoneCountryFlag" style="margin-right: 0.5em;"></span>{{inviteAccountContact.phoneCountry}}</Button>
                <Input  style="width:75%;" v-model="inviteAccountContact.phone" :placeholder="$t('KloudSyncAccountContact.PhoneNumber')"/>
              </td>
              <td></td>
            </tr>
            <tr style="height:42px">
              <td></td>
              <td><Checkbox v-model="addToMyFriendFlag">{{$t('KloudSyncDocLeftPart.RequestToBeMyContact')}}</Checkbox></td>
              <td></td>
            </tr>
            <!-- <tr>
              <td>{{$t('KloudSyncAccountContact.Email')}} </td>
              <td><Input v-model="inviteAccountContact.email" :placeholder="$t('KloudSyncAccountContact.EmailAddress')"/></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td><Checkbox v-model="inviteAccountContact.requestToChat">{{$t('KloudSyncAccountContact.RequestToChat')}}</Checkbox></td>
              <td></td>
            </tr> -->
            <tr style="height:20px"></tr>
          </table>
          <div slot="footer">
            <div>
              <Button type="primary" :loading="loading" @click="handleInviteNewOK">{{$t('KloudSyncDocLeftPart.InviteNow')}}</Button>
              <Button style="float:left" @click="handleInviteNewCancel">{{$t('Base.Cancel')}}</Button>
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
        <Modal v-model="selectCountry.modal" :title="$t('Register.PleaseSelectCountry')" :mask-closable="false" :width="600" style="z-index: 4000; position: absolute;" class-name="register-select-country-modal">
          <p style="font-weight:700">{{$t("Common.CommonCountries")}}</p>
          <div style="text-align:left;">
          <span style="display:inline-block;" v-for="(item,index) in commonCountrieData" :key="index" @mousedown="selcetCommonCountrie(item)">
            <Tag type="border">
              <span class="flag-icon" :class="item.flag" style="font-size: larger; margin-right: 0.5em;"></span><span style="color: #1c2438; font-weight: bold;">{{item.name}} ({{item.dial_code}})</span>
            </Tag>
          </span>
          </div>
          <Input v-model="selectCountry.searchText" :placeholder="$t('Register.PlaceholderSearchCountry')" :icon='selectCountry.searchIcon' @on-change="handleSelectCountrySearch" @on-click="handleSelectCountrySearchCancel" style="width: 50%; margin: 15px 0px 1em;"></Input>
          <p style="font-weight:700">{{$t("Common.AllCountries")}}</p>
          <Table size="small" :stripe="true" :highlight-row="true" :height="360" :no-data-text="$t('Register.CannotFindAnyCountry')" @on-current-change="handleSelectCountryCurrentChange"
                  :data="selectCountry.tableData" :columns="selectCountry.tableColumns" :loading="loading">
          </Table>
          <div slot="footer">
            <span style="float: left;">{{$t('Register.YouSelected')}} <span class="flag-icon" :class="selectCountry.current.flag" style="font-size: larger; margin-right: 0.5em;"></span><span style="color: #1c2438; font-weight: bold;">{{selectCountry.current.name}} ({{selectCountry.current.dial_code}})</span></span>
            <Button type="primary" :loading="loading" @click="handleSelectCountryOK">{{$t('Base.OK')}}</Button>
            <Button @click="handleSelectCountryCancel">{{$t('Base.Cancel')}}</Button>
          </div>
        </Modal>
        <add-chat-friend-modal ref="addChatFriendModal"></add-chat-friend-modal>
      </div>
    </div>
    <!-- <div class="panel-gutter"></div> -->
  </div>
</template>

<style lang="scss">
  .forProject-contact-flexviews {
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
    min-height: 200px;
    width: 100%;
    align-items: stretch;
    min-height: calc(100% - 68px);

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
      // box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      // border-radius: 3px;
      // padding: 3px;
      border-right: 1px solid #dddee1;
      position: relative;
      text-align: left;
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
      // box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      // border-radius: 3px;
      //padding: 3px;
      text-align: left;
    }

    .panel-detail {
      -webkit-box-flex: 0;
      -moz-box-flex: 0;
      box-flex: 0;
      -webkit-flex: 0 0 400px;
      -moz-flex: 0 0 400px;
      -ms-flex: 0 0 400px;
      flex: 0 0 400px;

      margin-left: 15px;

      background-color: #ffffff;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      border-radius: 3px;
      padding: 3px;
      position: relative;
    }

    .contact-search-one{
      padding: 16px 32px;
    }
    .contact-type{
      .selectColor{
        color:#1389ff;
      }
      text-align: center;
      padding: 16px 0px;
      span{
        display: inline-block;
      }
    }
    .contact-team-tree {
      span{
        display: inline-block;
      }
      padding: 16px 28px;

      .team-space-tree-item {
        display: inline-block;
        width: 100%;
        vertical-align: middle;
        padding: 4px;
        cursor: pointer;
      }

      .ivu-tree ul {
        font-size: 14px;
      }

      .tree-item-selected {
        background-color: #e3eaf2;
      }
    }

    .currentType-contact-list {
      position: relative;
      user-select: none;
      span{
        display:inline-block;
      }
      .add-currentType-contact{
        cursor: pointer;
        position: absolute;
        right:32px;
        top:1em;
        .ivu-dropdown-item{
          font-weight: 600;
        }
      }
      .team-number{
        padding:16px 49px;
        font-size:13px;
        font-weight: 600; 
      }
      .ivu-collapse {
        background-color: transparent;
        border-radius: 0;
        border-width: 0;
      }
      .ivu-collapse-header {
        width: 120px;
        .ivu-icon {
          margin-right: .5em;
        }
      }
      .ivu-collapse-content{
        padding: 0px;
      }
      .ivu-collapse-item{
        padding:5px 0px;
      }

      .ivu-collapse-content > .ivu-collapse-content-box {
        padding: 0;
      }

      .contact-invite-new{
        padding: 5px 0px 5px 49px;
      }
      .contact-list-item{
         .contact-list-head{
           padding: 8px 0px 8px 49px;
         }
         .contact-list-item-child{
           padding: 10px 0px 10px 44px;
           cursor: pointer;
         }
         .bgColor {
          background-color: #e3eaf2;
        }
      }
    }

    .contact-person-info{      
      padding: 100px 15% 0px 15%;

      .contact-head{
        width: 100%;
        height: 100px;
        .contact-head-left{
          float:left;
          width: 70%;

          .contact-introduced {
            color: #80848f;
            margin-top: 2em;
          }
        }
        .contact-head-right{
          float:right;
          width: 30%;
        }
      }

      .contact-content {
        border-top: 1px solid #dfdfdf;
        border-bottom: 1px solid #dfdfdf;
        padding: 20px;
     
        .contact-header {
          padding: 12px 0;
          color: #80848f;
        }

        .contact-team-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: flex-start;

          .contact-team-item {
            width: 360px;
            padding: 10px 0;

            .team-item, .space-item {
              display: flex;
              align-items: center;
              padding: 5px;
            }

            .team-item {
              font-weight: bold;
            }

            .space-item {
              padding-left: 2em;
            }
          }
        }
      }

      .contact-footer{
        text-align: center;
        margin-top: 50px;
        width: 100%;

        span{
          display: inline-block;
        }
        .contact-footer-circle{
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #2693ff;
        }
        .contact-footer-meeting{
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #ffa980;
        }
      }
    }
    .contact-team-space-info{
      padding: 100px 15% 0px 15%;

      .contact-head{
        width: 100%;
        height: 100px;
        position: relative;
        
        .contact-head-left{
          float:left;
          width: 70%;

          .contact-statistics {
            color: #80848f;
            position:absolute;
            left: 8px;
            bottom: 8px;
          }
        }

        .contact-head-right{
          float:right;
          width: 30%;
        }
      }

      .contact-content{
        border-top: 1px solid #dfdfdf;
        border-bottom: 1px solid #dfdfdf;
        padding: 20px;

        .member-item {
          display: flex;
          align-items:center;
          justify-content:flex-start;
          padding: 8px;
          font-size: 14px;
          margin-right: 3em;

          .member-action {
            opacity: 0;
            margin: 0 3em 0 1.5em;
          }
        }

        .member-item:hover .member-action {
          opacity: 1;
        }

        .member-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-items: flex-start;
        }
      }

      .contact-footer{
        height: 100px;
        text-align: center;
        margin-top: 50px;
        width: 100%;
        span{
          display: inline-block;
        }
        .contact-footer-circle{
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #2693ff;
        }
        .contact-footer-meeting{
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #ffa980;
        }
      }
    }
  }
  .forProject-invite-table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;

    td {
      padding: 5px;
    }
    td:first-of-type {
      text-align: right;
      width: 20%;
    }
    td:last-of-type {
      text-align: right;
      width: 15%;
    }
  }
  .register-select-country-modal{
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal{
      top: 0;
    }

    .ivu-table th {
      background-color: #495060;
      color: white;
    }

    .ivu-table-row-highlight td, .ivu-table-stripe .ivu-table-body tr.ivu-table-row-highlight:nth-child(2n) td {
      background-color: #dddee1;
    }
  }
</style>

<script>
import auth from "../../authenticator";
import friends from "../../friends";
import util from "../../common/util.js";
import TeamSpaceTreeItem from "./TeamSpaceTreeItem";

export default {
  data () {
    return {
      loading: false,
      searchContact:'',
      teamSpaceData: [],
      contactOpen:"contact",
      friendList:[],
      allfriendList:[],
      chooseBgclolor:-1,
      selectTeam:{
        id: -1,
        name:this.$t('KloudSyncAccountContact.PleaseSelectContact'),
        detail: {}
      },
      selectPerson:{
        avatarUrl:'',
        ptuserId:-1,
        detailContactName:'',
        senToRongCloudUserID:-1,
      },
      showPersonDetail:true,
      teamSpaceList: [],
      memberList: [],
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
      currentType:'Company contact',
      modalInviteNew:false,
      inviteAccountContact:{
        requestToChat:true,
        phone:'',
        email:'',
        phoneCountryFlag: 'flag-icon-cn',//'flag-icon-us'
        phoneCountry: '+86' //'+1',
      },
      accountContactList:[],
      showAllContacts: false,
      allAccountContactList:[],
      countryData: [],
      selectCountry: {
        modal: false,
        current: {
          name: 'China', //'United States',
          dial_code: '+86',//'+1',
          flag: 'flag-icon-cn', //'flag-icon-us'
        },
        searchText: '',
        searchIcon: 'search',
        tableData: [],
        tableColumns: [
          {
            title: this.$t('Register.CountryName'),
            key: 'name',
            render: (h, params) => {
              return h('div', [
                h('span', {class: 'flag-icon ' + params.row.flag, style: {marginRight: '1em', fontSize: 'larger' }}),
                h('strong', params.row.name)
              ]);
            }
          },
          {
            title: this.$t('Register.Code'),
            width: 150,
            key: 'dial_code'
          }
        ],
      },
      addCompanyContact:false,

      addToMyFriendFlag:true,
      sendResult:false,
      isSendSuccess:true,
      invitenNewErrorRetMsg:'',

      commonCountrieData:[{name: 'China',dial_code: '+86',flag: 'flag-icon-cn'},
        {name: 'United States',dial_code: '+1',flag: 'flag-icon-us'},
        {name: 'Japan',dial_code: '+81',flag: 'flag-icon-jp'},
        {name: 'Germany',dial_code: '+49',flag: 'flag-icon-de'},
        {name: 'United Kingdom',dial_code: '+44',flag: 'flag-icon-gb'},
      ],
    }
  },
  computed: {
    schoolId() {
      return auth.getChosenSchoolId();
    },
    myContactsLength(){
      return this.friendList.length;
    },
    seleTeamName(){
      return this.$t('KloudSyncAccountContact.PleaseSelectContact');
    },
    cellphone(){
      return this.inviteAccountContact.phoneCountry+this.inviteAccountContact.phone
    },
    typeText(){
      if(this.isSendSuccess){
        return this.$t("KloudSyncDocLeftPart.SendSMSSuccess");
      }
      return this.$t("KloudSyncDocLeftPart.Tips")
    }
  },
  watch: {
    seleTeamName(){
      this.selectTeam.name = this.$t('KloudSyncAccountContact.PleaseSelectContact');
    }
  },
  mounted() {
    this.loadTeamSpaceList();
    this.loadAccountContact();
  },
  methods: {
    handleSendResultOk(){
      this.sendResult = false;
      this.modalInviteNew = false;
    },
    addMyFriend(){
      this.$refs.addChatFriendModal.handInviteNewFriends();
    },
    switchHandleInvite(name){
      switch (name) {
        case "Select from contacts":
          this.inviteFromSearch();
          break;
        case "Invite New":
          this.showInviteNew();
          break
        default:
          break;
      }
    },
    inviteFromSearch(){
      this.searchKey = '';
      this.modalSearch = true;
      this.searchData = [];
      this.addCompanyContact = true;
    },
    addCompanyContactOk(){
      let selected = this.$refs.search.getSelection();
      if (selected.length === 0) {
        this.modalSearch = false;
        return;
      }

      let memberList = "";
      for (let i = 0; i < selected.length; i++) {
        memberList += selected[i].id + ",";
      }

      let self = this;

      let roleId = auth.SchoolRole.OfficeStaff;
      let url = GetAPIUrl() + "SchoolContact/AddContactList?schoolID=" + this.schoolId + "&roleID=" + roleId + "&userIDs=" + memberList;

      this._postData(url, {}, null, (result) => {
        self.loadAccountContact();
        self.modalSearch = false;
      }, null);
    },
    searchUsers(){
      let searchStr=this.searchContact;
      switch (this.currentType) {
        case 'Company contact':
          this.searchCompanyContact(searchStr);
          break;
        case 'My contact':
          this.searchMycontact(searchStr);
          break;
        default:
          break;
      }
    },
    searchMycontact(searchStr){
      let searchResult=[];
      if(!searchStr){
        this.friendList=this.allfriendList;
        return;
      }

      searchStr = new RegExp(searchStr, 'i');//搜索不区分大小写。
      for(let item of this.allfriendList){
        let users=item.Users;
        for(let user of users){
          if(user.Name.search(searchStr)>=0){
            searchResult.push(item);
          }
        }
      }
      this.friendList=searchResult;
    },
    searchCompanyContact(searchStr){
      if(!searchStr){
        this.accountContactList=this.allAccountContactList;
        return;
      }

      searchStr=new RegExp(searchStr,'i')
      this.accountContactList=this.allAccountContactList.filter(item=>{
        return item.UserName.search(searchStr)>=0;
      })
    },
    getCountryData() {
      let result = this.countryData.filter((item) => {
        if (this.selectCountry.searchText) {
          let name = item.name ? item.name.toLowerCase() : '';
          let number = item.dial_code ? item.dial_code.toLowerCase() : '';
          let code = item.code ? item.code.toLowerCase() : '';
          let search = this.selectCountry.searchText.toLowerCase();
          return name.includes(search) || number.includes(search) || code.includes(search);
        }
        else {
          return true;
        }
      });

      for (let i = 0; i < result.length; i++) {
        result[i]._highlight = result[i].dial_code === this.selectCountry.current.dial_code;
      }

      return result;
    },
    handleSelectCountry() {
        this.selectCountry.modal = true;

        if (this.inviteAccountContact.phoneCountry === '+86' && !this.selectCountry.searchText) {
          this.$nextTick(() => {
            $('.ivu-table-body').scrollTop(1500);
          });
        }
    },
    handleSelectCountryCurrentChange(currentRow) {
      this.selectCountry.current.name = currentRow.name;
      this.selectCountry.current.dial_code = currentRow.dial_code;
      this.selectCountry.current.flag = currentRow.flag;
    },
    selcetCommonCountrie(item){
        this.selectCountry.current.name = item.name;
        this.selectCountry.current.dial_code = item.dial_code;
        this.selectCountry.current.flag = item.flag;
      },
    handleSelectCountrySearch() {
      this.selectCountry.tableData = this.getCountryData();

      this.selectCountry.searchIcon = this.selectCountry.searchText ? 'close-round' : 'search';
    },
    handleSelectCountrySearchCancel() {
      this.selectCountry.searchText = '';
      this.handleSelectCountrySearch();
    },
    handleSelectCountryOK() {
      this.inviteAccountContact.phoneCountryFlag = this.selectCountry.current.flag;
      this.inviteAccountContact.phoneCountry = this.selectCountry.current.dial_code.replace(" ", "");
      this.selectCountry.modal = false;
    },
    handleSelectCountryCancel() {
      this.selectCountry.modal = false;
    },
    handleSelectCountry() {
      this.selectCountry.modal = true;

      if (this.inviteAccountContact.phoneCountry === '+86' && !this.selectCountry.searchText) {
        this.$nextTick(() => {
          $('.ivu-table-body').scrollTop(1500);
        });
      }
    },
    loadAccountContact(){
      let url=GetAPIUrl()+"SchoolContact/List?schoolID=" + this.schoolId + "&roleType=0,1,2,3,4,5,6,7,8,9&pageIndex=-1";
      let self=this;
      this._getData(url, null, data => {
        self.accountContactList = data;
        self.allAccountContactList = data;
      }, null);
    },
    handleInviteNewOK(){
      if(!this.inviteAccountContact.phone){
        this.$Message.warning({content:this.$t("KloudSyncDocLeftPart.MobilePhoneNumberCannotBeEmpty"),duration: 3});
        return;
      }
      let self = this;
      // let url = GetAPIUrl() + "SchoolContact/InviteToCompany";
      // let toChat;

      // if(this.inviteAccountContact.requestToChat){
      //   toChat=1;//允许聊天
      // }else{
      //   toChat=0;//不允许聊天
      // }

      // let data = {
      //   CompanyID:this.schoolId,
      //   PhoneNumber:this.inviteAccountContact.phoneCountry+this.inviteAccountContact.phone,
      //   RequestToChat:toChat,
      // };

      // this._postData(url, data, null, (result) => {
      //   self.$Message.info({content: "The invitation has been sent.", duration: 3});
      //   self.handleInviteNewCancel();
      //   self.loadAccountContact();
      // }, null);
      let url = GetAPIUrl() + "Invite/InviteNewToCompany";
      let data = {
        CompanyID:this.schoolId,
        InviteTo:this.schoolId,
        Mobile:this.inviteAccountContact.phoneCountry+this.inviteAccountContact.phone,
        InviteToType:0,//company
        RequestAddFriend:this.addToMyFriendFlag?1:0
      };
      this._postData(url, data, null, (result) => {
        // self.$Message.info({content: self.$t('KloudSyncDocLeftPart.AlertInvitatioHasSent'), duration: 3});
        self.sendResult = true;
        switch (result) {
          case -10003:
            self.isSendSuccess = false;
            self.invitenNewErrorRetMsg = this.$t("KloudSyncDocLeftPart.YourHaveInvitedTheUser",{phone:this.cellphone});
            break;
          case -10004:
            self.isSendSuccess = false;
            self.invitenNewErrorRetMsg = this.$t("KloudSyncDocLeftPart.InviteeAlreadyMemberOfTheCompany");
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
    handleInviteNewCancel(){
      this.modalInviteNew=false;
      this.inviteAccountContact={
        requestToChat:true,
        phone:'',
        email:'',
        phoneCountryFlag: 'flag-icon-cn',//'flag-icon-us'
        phoneCountry: '+86' //'+1',
      }
    },
    showInviteNew(){
      this.modalInviteNew=true;
      this.inviteAccountContact={
        requestToChat:true,
        phone:'',
        email:'',
        phoneCountryFlag: 'flag-icon-cn',//'flag-icon-us'
        phoneCountry: '+86' //'+1',
      }
      util.LoadCssFiles(["/static/country-flags/css/flag-icon.min.css"]).then(()=>{
        util.LoadJsFiles(["/static/country-phone-code.js?v=201810011501"]).then(()=>{
          this.countryData = JSON.parse(JSON.stringify(countryPhoneCodeList));
          this.countryData.forEach((item) => {
            item.flag = "flag-icon-" + item.code.toLowerCase();
          });
          this.countryData.sort((a, b) => {
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {
              return -1;
            }
            else if (x > y) {
              return 1;
            }
            else {
              return 0;
            }
          });

          this.selectCountry.tableData = this.getCountryData();
        });
      });
    },
    selectContactType(type){
      switch (type) {
        case 1:
          this.selectAccountType();
          break;
        case 2:
          this.selectMyContactType();
          break;
        default:
          break;
      }
    },
    selectAccountContact(item){
      this.chooseBgclolor=item.UserID;
      // this.selectPerson.senToRongCloudUserID=rongCloudUserID;
      this.selectPerson.ptuserId=item.UserID;
      this.selectPerson.detailContactName=item.UserName;
      this.selectPerson.avatarUrl=item.AvatarUrl;
      this.showPersonDetail=true;

      this.loadContactTeamSpaceList(item.UserID);
    },
    selectAccountType(){
      this.currentType="Company contact";
      this.chooseBgclolor=-1;
      this.searchUsers();
    },
    selectMyContactType(){
      this.currentType="My contact";
      this.chooseBgclolor=-1;
      friends.getFriendsSortList((friends)=> {
        let result = friends;
        this.friendList = result;
        this.allfriendList=result;
        this.searchUsers();
      });
    },
    getFirstIndex(str){
      let name=str.replace(/\s/g,"");
      if(name!=""){
        name=name.substring(0,1).toUpperCase();
        return name;
      }else{
        return "";
      }
    },
    loadTeamSpaceList(){
      let self = this;
      let url = GetAPIUrl() + "TeamSpace/TeamAndSpaceList?companyID="+this.schoolId;

      this._getData(url, null, data => {
        let root = {type: 0, id: -1, name: 'Teams', expand: false, children: []};
        for (let i = 0; i < data.length; i++) {
          let teamdata = data[i];
          let spacelist = [];
          for (let j = 0; j < teamdata.SpaceList.length; j++) {
            let spacedata = teamdata.SpaceList[j];
            let space = {
              type: spacedata.Type,
              id: spacedata.ItemID,
              name: spacedata.Name,
              selected: spacedata.ItemID == self.selectTeam.id,
              detail: spacedata,
            };
            spacelist.push(space);
          }
          let team = {
            type: teamdata.Type,
            id: teamdata.ItemID,
            name: teamdata.Name,
            selected: teamdata.ItemID == self.selectTeam.id,
            detail: teamdata,
            children: spacelist
          };

          root.children.push(team);
        }

        self.teamSpaceData = [root];
      }, null);
    },
    teamSpaceRender(h, { root, node, data }) {
      return h(TeamSpaceTreeItem, {
        props: { data: data },
        on: {
          selected: item => {
            this.chooseATeam(data);
          }
        }
      });
    },
    chooseContact:function(userId,rongCloudUserID,name,avatar) {
      this.chooseBgclolor=rongCloudUserID;
      this.selectPerson.senToRongCloudUserID=rongCloudUserID;
      this.selectPerson.ptuserId=userId;
      this.selectPerson.detailContactName=name;
      this.selectPerson.avatarUrl=avatar;
      this.showPersonDetail=true;

      this.loadContactTeamSpaceList(userId);
    },
    loadContactTeamSpaceList(id) {
      let self = this;
      let url = GetAPIUrl() + "TeamSpace/TeamAndSpaceList?companyID=" + this.schoolId + "&contactID=" + id;

      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if(result.RetCode === 0) {
           self.teamSpaceList= result.RetData;
          }
        }
      });
    },
    chooseATeam(team){
      this.showPersonDetail=false;
      this.selectTeam.id = team.id;
      this.selectTeam.name = team.name;
      this.selectTeam.detail = team.detail;

      this.loadTeamSpaceMembers();
    },
    loadTeamSpaceMembers() {
      let self = this;
      let url = GetAPIUrl() + "TeamSpace/MemberList?TeamSpaceID=" + this.selectTeam.id;

      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if(result.RetCode === 0) {
           self.memberList = result.RetData;
          }
        }
      });
    },
    handleAddMemberAction(name) {
      switch (name) {
        case 'search':
          this.searchKey = '';
          this.modalSearch = true;
          this.searchData = [];
          this.addCompanyContact = false;
          break;

        case 'invite':
          this.modalInvite = true;
          break;
      }
    },
    handleSearch() {
        if (!this.searchKey) {
          this.searchData = [];
          return;
        }

        let self = this;
        let url = GetAPIUrl() + "User/SearchContact?searchText=" + encodeURIComponent(base64encode(utf16to8(trimStr(this.searchKey))));
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
      let selected = this.$refs.search.getSelection();
      if (selected.length === 0) {
        this.modalSearch = false;
        return;
      }

      let memberList = "";
      for (let i = 0; i < selected.length; i++) {
        memberList += selected[i].id + ",";
      }

      let self = this;
      let url = GetAPIUrl() + "TeamSpace/AddMember?CompanyID=" + this.schoolId + "&TeamSpaceID=" + this.selectTeam.id + "&MemberList=" + memberList;
      let data = {};

      this._postData(url, data, null, (result) => {
        self.loadTeamSpaceMembers();
        self.modalSearch = false;
      }, null);
    },
    handleSearchCancel() {
      this.modalSearch = false;
    },
    handleInviteOK() {
      let self = this;
      let url = GetAPIUrl() + "TeamSpace/InviteUser?itemID=" + this.selectTeam.id + "&mobile=" + this.invitePhone + "&email=" + this.inviteEmail;
      let data = {};

      this._postData(url, data, null, (result) => {
        self.$Message.info({content: "The invitation has been sent.", duration: 3});
        self.modalInvite = false;
      }, null);
    },
    handleInviteCancel() {
      this.modalInvite = false;
    },
    handleMemberAction(name, member) {
      switch (name) {
        case 'chat':
          this.handleChatMember(member);
          break;

        case 'admin':
          this.handleSetAdmin(member);
          break;

        case 'remove':
          this.handleRemoveTeam(member);
          break;
      }
    },
    handleChatMember(member) {

    },
    handleSetAdmin(member) {
      let content = "This will set " + member.MemberName + " as " + this.catalogName + " admin.";
      this.$Modal.confirm({
        title: 'Set as team admin',
        content: content,
        okText: 'OK',
        cancelText: 'Cancel'
      });
    },
    handleRemoveTeam(member) {
      let content = "This will remove " + member.MemberName + " from " + this.catalogName + ".";
      this.$Modal.confirm({
        title: 'Remove from team',
        content: content,
        okText: 'OK',
        cancelText: 'Cancel'
      });
    },
    sendMessege(){
      this.$router.push({ name: routerPrefix()+"chat",params:{contactPerson:{rongCloudUserID:this.selectPerson.senToRongCloudUserID,userId:this.selectPerson.ptuserId,name:this.selectPerson.detailContactName,type:'contact'}}});
    },
    _getData(url, before, success, error) {
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
            self.$Loading.finish();

            if (success && typeof success === "function") {
              success(result.RetData);
            }
          } else {
            // error
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === "function") {
              error(result);
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
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
            self.$Loading.error();
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
      if (before && typeof before === 'function') {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: 'DELETE',
        url: url,
        beforeSend: function (request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function (result) {
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === 'function') {
              success(result.RetData);
            }
          }
          else { // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);

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
    }

  },
}
</script>
