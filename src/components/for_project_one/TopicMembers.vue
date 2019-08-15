<template>
  <div class='forProject-topic-members'>

    <!-- <div class="topic-action-header">
    </div> -->

    <div class="member-search">
      <Input v-model="memberSearch" icon="ios-search" :placeholder="$t('TopicHomePage.Allmembers')" @on-change="handleMemberSearch" />
    </div>

    <div class="member-list">
      <div class="member-item" v-for="item in ownerList" :key="item.MemberID">
        <span class="member-avatar"><Avatar :src="item.MemberAvatar == '' ? '/static/images/user.svg' : item.MemberAvatar" /></span>
        <div style="margin-left: 10px;">
          <p>{{item.MemberName}}</p>
          <p style="color:#bbbec4">{{$t('TopicHomePage.SyncRoomOwner')}}</p>
        </div>
        <div class="panel-topic"></div>
        <Dropdown class="member-action" placement="bottom-end" @on-click="handleMemberAction($event, item)">
          <span>
            <Icon size="16" type="more"></Icon>
          </span>
          <DropdownMenu slot="list">
            <DropdownItem name="chat">{{$t('TopicHomePage.SendChatRequest')}}</DropdownItem>
            <!-- <DropdownItem name="admin" :disabled="item.MemberType == 1">Set as Topic Admin</DropdownItem>
            <DropdownItem name="remove">Remove from Topic</DropdownItem> -->
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>

    <div class="member-list">
      <div class="member-list-header">
        {{$t('TopicHomePage.SYNCROOMMEMBER')}}
        <Dropdown class="topic-member-add" placement="bottom-end" @on-click="handleAddMemberAction">
          <Icon type="ios-plus-outline" size="24"></Icon>
          <DropdownMenu slot="list">
            <DropdownItem name="invite">{{$t('TopicHomePage.InviteNew')}}</DropdownItem>
            <DropdownItem name="search">{{$t('TopicHomePage.InvitefromContacts')}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div class="member-item" v-for="item in memberList" :key="item.MemberID">
        <span class="member-avatar"><Avatar :src="item.MemberAvatar == '' ? '/static/images/user.svg' : item.MemberAvatar" /></span>
        <span style="margin-left: 10px;">{{item.MemberName}}</span>
        <div class="panel-topic"></div>
        <Dropdown class="member-action" placement="bottom-end" @on-click="handleMemberAction($event, item)">
          <span>
            <Icon size="16" type="more"></Icon>
          </span>
          <DropdownMenu slot="list">
            <DropdownItem name="chat">{{$t('TopicHomePage.SendChatRequest')}}</DropdownItem>
            <DropdownItem name="admin" :disabled="item.MemberType == 1 || !isOwnerAdmin">{{$t('TopicHomePage.SetAsSyncRoomAdmin')}}</DropdownItem>
            <DropdownItem name="remove" :disabled="!isOwnerAdmin">{{$t('TopicHomePage.RemovefromSyncRoom')}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>

    <!-- Topic Type is "Customer Service" -->
    <!--catalogTopicType：1-Customer Service、2-Customer Requirement Discussion、3-Customer Leads-->
    <div v-if="catalogTopicType == 1" class="member-list">
      <div class="member-list-header">
        {{$t('TopicHomePage.CUSTOMERS')}}
        <div style="cursor: pointer;float: right;display: inline-block" @mousedown.stop="handleAddCompanyCustomer">
          <Icon type="ios-plus-outline" size="24"></Icon>
        </div>
      </div>

      <div v-show="!hasCompany" class="member-item" v-for="item in customerList" :key="item.MemberID">
        <span class="member-avatar"><Avatar :src="item.MemberAvatar == '' ? '/static/images/user.svg' : item.MemberAvatar" /></span>
        <span style="margin-left: 10px;">{{item.MemberName}}</span>
        <div class="panel-topic"></div>
        <Dropdown class="member-action" placement="bottom-end" @on-click="handleMemberAction($event, item)">
          <span>
            <Icon size="16" type="more"></Icon>
          </span>
          <DropdownMenu slot="list">
            <DropdownItem name="chat">{{$t('TopicHomePage.SendChatRequest')}}</DropdownItem>
            <!-- <DropdownItem name="admin">Set as Topic Admin</DropdownItem> -->
            <DropdownItem name="remove" :disabled="!isOwnerAdmin">{{$t('TopicHomePage.RemovefromSyncRoom')}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div v-show="hasCompany">
        <div style="font-weight:bold; padding: 5px">
          {{companyCustomer.name}}
          <span style="float:right;cursor: pointer;" @click="editCompany"><Icon size="16" type="more"></Icon></span>
        </div>

        <div class="member-item" v-for="item in customerList" :key="item.MemberID">
          <span class="member-avatar"><Avatar :src="item.MemberAvatar == '' ? '/static/images/user.svg' : item.MemberAvatar" /></span>
          <span style="margin-left: 10px;">{{item.MemberName}}</span>
          <div class="panel-topic"></div>
          <Dropdown class="member-action" placement="bottom-end" @on-click="handleMemberAction($event, item)">
            <span>
              <Icon size="16" type="more"></Icon>
            </span>
            <DropdownMenu slot="list">
              <DropdownItem name="chat">{{$t('TopicHomePage.SendChatRequest')}}</DropdownItem>
              <!-- <DropdownItem name="admin">Set as Topic Admin</DropdownItem> -->
              <DropdownItem name="remove" :disabled="!isOwnerAdmin">{{$t('TopicHomePage.RemovefromSyncRoom')}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div v-show="hasAssociates">
        <div style="font-weight:bold; padding: 5px">
          {{$t('TopicHomePage.CustomerAssociates')}}
          <Dropdown class="topic-member-add" placement="bottom-end" @on-click="handleAddAssociatesAction">
            <Icon size="16" type="more"></Icon>
            <DropdownMenu slot="list">
              <DropdownItem name="invite">{{$t('TopicHomePage.InviteNew')}}</DropdownItem>
              <DropdownItem name="search">{{$t('TopicHomePage.InvitefromContacts')}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div class="member-item" v-for="item in associatesList" :key="item.MemberID">
          <span class="member-avatar"><Avatar :src="item.MemberAvatar == '' ? '/static/images/user.svg' : item.MemberAvatar" /></span>
          <span style="margin-left: 10px;">{{item.MemberName}}</span>
          <div class="panel-topic"></div>
          <Dropdown class="member-action" placement="bottom-end" @on-click="handleMemberAction($event, item)">
            <span>
              <Icon size="16" type="more"></Icon>
            </span>
            <DropdownMenu slot="list">
              <DropdownItem name="chat">{{$t('TopicHomePage.SendChatRequest')}}</DropdownItem>
              <!-- <DropdownItem name="admin">Set as Topic Admin</DropdownItem> -->
              <DropdownItem name="remove" :disabled="!isOwnerAdmin">{{$t('TopicHomePage.RemovefromSyncRoom')}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>

    <!-- Topic Type is NOT "Customer Service" -->
    <!-- <div v-else class="member-list">
      <div class="member-list-header">
        CUSTOMERS

        <span class="topic-member-add" @click="handleAddIndividualCustomer"><Icon type="ios-plus-outline" size="24"></Icon></span>
      </div>

      <div class="member-item" v-for="item in customerList" :key="item.MemberID">
        <span class="member-avatar"><Avatar :src="item.MemberAvatar == '' ? '/static/images/user.svg' : item.MemberAvatar" /></span>
        <span style="margin-left: 10px;">{{item.MemberName}}</span>
        <div class="panel-topic"></div>
        <Dropdown class="member-action" placement="bottom-end" @on-click="handleMemberAction($event, item)">
          <span>
            <Icon size="16" type="more"></Icon>
          </span>
          <DropdownMenu slot="list">
            <DropdownItem name="chat">Send Chat Request</DropdownItem>
            <DropdownItem name="admin">Set as Topic Admin</DropdownItem>
            <DropdownItem name="remove" :disabled="!isOwnerAdmin">Remove from Topic</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div> -->
    <!-- Topic Type is"Customer Leads" -->
    <div v-if="catalogTopicType == 3" class="member-list">
      <div class="member-list-header">
        CONTACTS
      </div>
      <div class="member-item">
        <span style="display: inline-block;cursor: pointer;" @click="handleContactsModal">
          <span style="color:green">123 new contacts,</span>
          <span>325 total</span>
        </span>
      </div>
    </div>

    <div>
      <Modal v-model="customerLeads" :mask-closable="false" title="All contacts(325)" :width="600">
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
              <!-- <div style="padding: 6px;font-size: 14px;" v-for="item in newContacts" :key="item.id">
                <span class="member-avatar"><Avatar :src="item.avatar == '' ? '/static/images/user.svg' : item.avatar" /></span>
                <span style="margin-left: 10px;">{{item.name}}</span>
              </div> -->
            </div>
          </TabPane>
        </Tabs>
        <div slot="footer" style="display:none">
        </div>
      </Modal>
      <Modal v-model="modalSearch" :mask-closable="false" title="Search Team Member" :width="600" style="z-index: 2000; position: absolute;">
        <Input v-model="searchKey" icon="ios-search" :placeholder="$t('AddContact.PlaceholderEnterPhoneNumberOrName')" @on-enter="handleSearch" @on-click="handleSearch"/>
        <div style="height:1em;"></div>
        <Table ref="search" size="small" :no-data-text="$t('AddContact.NoContractFound')" :stripe="true" :highlight-row="true"
              :data="searchData" :columns="searchColumn" :loading="loading" height="400">
        </Table>

        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleSearchOK">{{$t('Base.OK')}}</Button>
          <Button @click="handleSearchCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalInvite" :mask-closable="false" title="Invite SyncRoom Member">
        <table class="forProject-invite-table">
          <tr>
            <td><span style="color:red;">*</span>{{$t('TopicHomePage.Phone')}} </td>
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
            <td>{{$t('TopicHomePage.Email')}} </td>
            <td><Input v-model="inviteEmail" placeholder="Email Address"/></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td><Checkbox v-model="inviteInternal">{{$t('TopicHomePage.SetTeamMember')}}</Checkbox></td>
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

      <Modal v-model="modalIndicidual" :mask-closable="false" :title="$t('TopicHomePage.AddCustomer')">
        <table class="forProject-invite-table">
          <tr>
            <td>{{$t('TopicHomePage.Contact')}}: </td>
            <td>
              <Select v-model="individualContact" multiple placeholder="Select Contact">
                <Option v-for="item in individualContactList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </td>
            <td style="text-align: left;">
              <!-- <Button type="ghost" shape="circle" icon="plus-round" size="small" @click="handleAddMember"></Button> -->
            </td>
          </tr>
        </table>
        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleIndicidualOK">{{$t('Base.OK')}}</Button>
          <Button @click="handleIndicidualCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalCompany" :mask-closable="false" :title="$t('TopicHomePage.AddCustomer')" style="z-index: 1500; position: absolute;">
        <p style="margin-bottom:0.5em;">
          <span v-show="isCompany">{{$t('TopicHomePage.CompanyCustomers')}}</span>
          <span v-show="!isCompany">{{$t('TopicHomePage.IndividualCustomers')}}</span>
        </p>
        <p style="margin-top:10px;padding-bottom: 10px;margin-bottom:20px;border-bottom: 1px solid #d6d6d675;">
          <Checkbox v-model="isCompany" style="font-size: 14px;font-weight: bold;" @on-change="selCompanyOrIndivdual">{{$t('TopicHomePage.CustomerIsCompany')}}</Checkbox>
        </p>
        <table class="forProject-invite-table">
          <tr v-show="isCompany">
            <td>{{$t('TopicHomePage.Company')}}: </td>
            <td>
              <Select v-model="companyID" placeholder="Select Company" @on-change="handChangeCompany">
                <Option v-for="item in companyList" :value="item.PTCompanyID" :key="item.PTCompanyID">{{ item.CompanyName }}</Option>
              </Select>
            </td>
            <td style="text-align: left;"><Button type="ghost" shape="circle" icon="plus-round" size="small" @click="createCompany"></Button></td>
          </tr>
          <tr v-if="isCompany">
            <td>{{$t('TopicHomePage.Contact')}}: </td>
            <td>
              <Select multiple v-model="companyContacts" placeholder="Select Contact" >
                <Option v-for="item in companyContactList" :value="item.ContactID" :key="item.ContactID">{{ item.ContactName }}</Option>
              </Select>
            </td>
            <td style="text-align: left;"><Button type="ghost" shape="circle" icon="plus-round" size="small" @click="handleAddCompanyMember"></Button></td>
          </tr>
          <tr v-else>
            <td>{{$t('TopicHomePage.Contact')}}: </td>
            <td>
              <Select v-model="individualContact" multiple placeholder="Select Contact">
                <Option v-for="item in individualContactList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </td>
            <td style="text-align: left;"></td>
          </tr>
        </table>
        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleCompanyOrIndicidualOK">{{$t('Base.OK')}}</Button>
          <Button @click="handleCompanyCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalCustomerCompany" :mask-closable="false" title="Customer Company" style="z-index: 2000; position: absolute;">
        <div>
          <div style="padding: 8px 24px">
            <b>{{$t('TopicHomePage.Name')}} </b>
            <Input v-model="customerCompany.Name" placeholder="Enter Company Name"/>
          </div>
          <div style="padding: 8px 24px">
            <b>{{$t('TopicHomePage.WebSite')}} </b>
            <Input v-model="customerCompany.WebSite" placeholder="Enter Company Web Site"/>
          </div>
          <div style="padding: 8px 24px">
            <b>{{$t('TopicHomePage.Note')}} </b>
            <Input v-model="customerCompany.Note" placeholder="Enter Company Note" type="textarea" :autosize='{minRows:"4",maxRows:"6"}' />
          </div>
        </div>
        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleCustomerCompanyOK">{{$t('Base.OK')}}</Button>
          <Button @click="handleCustomerCompanyCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalChangeCompany" :mask-closable="false" :title="$t('TopicHomePage.AddCustomer')" style="z-index: 99; position: absolute;">
        <div class="forProject-change-company-modal">
          <p style="margin-bottom:0.5em;">
            <span v-show="isChangeCompany">{{$t('TopicHomePage.CompanyCustomers')}}</span>
            <!-- <span v-show="!isChangeCompany">INDIVIDUAL CUSTOMERS</span> -->
          </p>
          <p style="margin-top:10px;padding-bottom: 10px;margin-bottom:20px;border-bottom: 1px soli d #d6d6d675;">
            <Checkbox v-model="isChangeCompany" disabled style="font-size: 14px;font-weight: bold;">{{$t('TopicHomePage.CustomerIsCompany')}}</Checkbox>
          </p>
          <div class="change-company-space">
            <span style="font-size: 14px;font-weight: bold;">{{companyCustomer.name}}</span>
            <span @click="changeCompany" style="float:right;cursor: pointer;"><Icon size="24" type="ios-compose-outline"></Icon></span>
          </div>
          <div class="company-customer">
            <div class="member-item" v-for="item in customerList" :key="item.MemberID">
              <span><Avatar :src="item.MemberAvatar == '' ? '/static/images/user.svg' : item.MemberAvatar"/></span>
              <span style="margin-left: 2px;">{{item.MemberName}}</span>
            </div>
          </div>
          <div class="customer-associates">
            <p>{{$t('TopicHomePage.CustomerAssociates')}}</p>
            <p style="margin-top:10px;">
              <Button style="width:120px;" @click="handleInviteMember">{{$t('TopicHomePage.InviteNew')}}</Button>
              <Button style="margin-left:30px;width:120px;" @click="handleAddAssociates">{{$t('Common.Select')}}</Button>
            </p>
          </div>
        </div>
        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleChangeCompanyOK">{{$t('Base.OK')}}</Button>
          <Button @click="handleChangeCompanyCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalCompanyInfo" :title="$t('TopicHomePage.CompanyInfo')">
        <div class="forProject-topic-contact-company">
          <div class="company-name">
            {{companyCustomer.name}}
          </div>
          <div class="company-link">
            <Icon type="ios-world-outline" size="20"></Icon>
            <a>{{companyCustomer.link}}</a>
          </div>
          <div class="comany-contacts">
            <div class="label-part">{{$t('TopicHomePage.CompanyContact')}}</div>
            <div>
              <b>{{companyCustomer.contacts}}</b>
              <a style="margin-left:1em;">{{$t('TopicHomePage.ViewAll')}}</a>
            </div>
          </div>
          <div class="comany-notes">
            <div class="label-part">{{$t('TopicHomePage.CompanyNotes')}}</div>
            <div>{{companyCustomer.note}}</div>
          </div>
        </div>

        <div slot="footer" style="text-align:center">
          <Button type="primary" @click="modalCompanyInfo = false">{{$t('Base.OK')}}</Button>
        </div>
      </Modal>

      <Modal v-model="modalAddCompanyContact" :mask-closable="false" :title="$t('TopicHomePage.AddCompanyContacts')" :width="600" style="z-index: 2000; position: absolute;">
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
  </div>
</template>

<style lang="scss">
.forProject-topic-members {
  .topic-action-header{
    padding: 10px 24px;
    display: flex;
  }
  .topic-member-add {
    float: right;
    cursor: pointer;
  }

  .member-search {
    padding: 12px 24px;
    border-top: 1px solid #dddee1;

    .ivu-input {
      border-width: 0px;
    }
  }

  .member-list {
    border-top: 1px solid #dddee1;
    padding: 12px 24px;

    .member-list-header {
      padding: 12px 0;
      color: #80848f;
      font-weight: bold;
    }

  }

  .member-item {
    display: flex;
    align-items:center;
    justify-content:flex-start;
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

  .member-item:hover .member-action {
    opacity: 1;
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

.forProject-merge-topic {
  padding: 1em 2em;

  h4 {
    color: #ed3f14;
  }

  p {
    line-height: 2em;
    font-weight: bold;
  }
  .current-topic {
    font-weight: normal;
    color: #80848f;
  }
}

.forProject-topic-contact-company {
  .company-name {
    color: #1c2438;
    font-size: 16px;
    font-weight: bold;
    line-height: 2em;
  }
  .company-link {
    font-size: 14px;
    padding: 10px 0;
  }

  .comany-contacts, .comany-notes {
    padding: 10px 0;
    .label-part {
      padding: 10px 0;
      color: #80848f;
    }
  }
}
.forProject-change-company-modal{
  span{
    display: inline-block;
  }
  .company-customer{
    display: flex;
    flex-direction:row;
    flex-wrap:wrap;
    justify-content:flex-start;
    margin-top: 20px;
    border: 1px solid #d6d6d675;
    border-radius: 5px;
    padding: 5px;
    .member-item{
      text-align: left;
      padding: 5px 10px 5px 5px;
      width: 110px;
      align-items:center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .customer-associates{
    padding-top:30px;
  }
}
</style>

<script>
/* Member Type:
  Member = 0,
  Admin = 1,
  Owner = 2,
  Customer = 10,
  Associates = 11
  */

import auth from "../../authenticator";
import friends from "../../friends";
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';

export default {
  props:["catalogId", "catalogTypeName", "catalogName", "catalogTopicType", "catalogMemberType"],
  data() {
    return {
      loading: false,
      memberSearch: '',
      ownerFullList: [],
      ownerList: [],
      memberFullList: [],
      memberList: [],
      companyCustomer: {id: 0, name: ''},
      customerFullList: [],
      customerList: [],
      associatesFullList: [],
      associatesList: [],

      modalSearch: false,
      searchMemberType: 0,
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

      modalIndicidual: false,
      individualContact: [],
      individualContactList: [],

      modalCompany: false,
      isCompany:true,
      companyID: 0,
      companyList:[],
      companyContactList:[],
      companyContactIDList:[],//反选已经添加过的members
      companyContacts: [],

      modalChangeCompany:false,
      isChangeCompany:true,

      modalCustomerCompany:false,
      customerCompany:{Id: -1, Name:"", Note:"", WebSite: ""},

      modalCompanyInfo: false,

      modalAddCompanyContact:false,
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
      customerLeads:false,
      newContacts:[],

      addToMyFriendFlag:true,
      areacode:"",
      sendResult:false,
      isSendSuccess:true,
      invitenNewErrorRetMsg:'',
    };
  },
  computed: {
    ...mapState(['kloudsyncTopic']),

    schoolId() {
      return auth.getChosenSchoolId();
    },
    isOwnerAdmin() {
      return this.catalogMemberType == 1 || this.catalogMemberType == 2;
    },
    currentTeam() {
      return this.kloudsyncTopic.currentTeam;
    },
    currentTopic() {
      return this.kloudsyncTopic.currentTopic;
    },
    hasCompany(){
      return this.companyCustomer && this.companyCustomer.id > 0;
    },
    hasAssociates() {
      return this.hasCompany && this.associatesList.length > 0;
    },
    cellphone(){
      return (this.areacode+this.invitePhone)
    },
    typeText(){
      if(this.isSendSuccess){
        return this.$t("KloudSyncDocLeftPart.SendSMSSuccess");
      }
      return this.$t("KloudSyncDocLeftPart.Tips")
    }
  },
  watch: {
    modalInvite(val){
      if(val){
        this.$refs.phoneAreaCode.initialAreaCode();
      }
    }
  },
  mounted() {
  },
  methods: {
    handleSendResultOk(){
      this.sendResult = false;
      this.modalInvite = false;
    },
    getAreaCode(val){
      this.areacode = val;
    },
    initialize() {
      this.loadTopicMembers();
    },
    loadTopicMembers() {
      let self = this;

      let url = GetAPIUrl() + "Topic/MemberList?TeamTopicID=" + this.catalogId;
      this._getData(url, null, data => {
        let olist = [];
        let mlist = [];
        let clist = [];
        let alist = [];

        data.forEach(item => {
          if (item.MemberType < 10) {
            if (item.MemberType == 2) { // Topic Owner
              olist.push(item);
            }
            else {
              mlist.push(item);
            }
          }
          else {
            if (self.catalogTopicType == 1) { // Customer Service
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

        this.ownerFullList = olist;
        this.memberFullList = mlist;
        this.customerFullList = clist;
        this.associatesFullList = alist;

        this.memberSearch = '';

        this.ownerList = olist;
        this.memberList = mlist;
        this.customerList = clist;
        this.associatesList = alist;
      }, null);

      if (this.catalogTopicType == 1) {
        self.loadCompanyCustomer();
      }
    },
    loadCompanyCustomer() {
      let self = this;
      let url = GetAPIUrl() + "Topic/GetCustomerCompnay?TeamTopicID=" + this.catalogId;
      this._getData(url, null, data => {
        if(data){
          let company = {
            id: data.PTCompanyID,
            name: data.CompanyName,
            link: data.WebSite,
            note: data.CompanyNote,
            contacts: data.ContactList.length
          };
          self.companyCustomer = company;
        }
        else{
          self.companyCustomer.id = 0;
          self.companyCustomer.name = '';
        }
      }, null);
    },
    handleMemberSearch() {
      if (this.memberSearch) {
        let search = new RegExp(this.memberSearch, 'i');
        this.ownerList = this.ownerFullList.filter(item => {
          return item.MemberName.search(search) >= 0;
        });
        this.memberList = this.memberFullList.filter(item => {
          return item.MemberName.search(search) >= 0;
        });
        this.customerList = this.customerFullList.filter(item => {
          return item.MemberName.search(search) >= 0;
        });
        this.associatesList = this.associatesFullList.filter(item => {
          return item.MemberName.search(search) >= 0;
        });
      }
      else {
        this.ownerList = this.ownerFullList;
        this.memberList = this.memberFullList;
        this.customerList = this.customerFullList;
        this.associatesList = this.associatesFullList;
      }
    },
    handleQuitTeam() {
      let content = this.$t('TopicHomePage.QuitMsgContent', {Type: this.catalogTypeName, Cat: this.catalogName});
      this.$Modal.confirm({
        title: this.$t('TopicHomePage.QuitModalTitle', {Type: this.catalogTypeName}),
        content: content,
        okText: this.$t('Base.OK'),
        cancelText: this.$t('Base.Cancel')
      });
    },
    handleAddMemberAction(name) {
      switch (name) {
        case 'search':
          this.handleAddMember();
          break;

        case 'invite':
          this.handleInviteMember();
          break;
      }
    },
    handleAddMember() {
      this.searchKey = '';
      this.searchMemberType = 0;
      this.searchData = [];
      this.modalSearch = true;
      // this.loadAccountContact();
    },
    handleInviteMember() {
      this.modalInvite = true;
    },
    loadAccountContact(){
      let url=GetAPIUrl()+"SchoolContact/List?schoolID=" + this.schoolId + "&roleType=0,1,2,3,4,5,6,7,8,9&pageIndex=-1";
      let self=this;
      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function(request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function(result) {
          if (result.RetCode === 0) {
            self.searchData = self._initializeUsers(result.RetData);
          }
        },
      });
    },
    handleSearch() {
      if (!this.searchKey) {
        this.searchData = [];
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "SyncRoom/SearchContact?companyID="+this.schoolId;
      url+="&syncroomID="+this.catalogId;
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
      let selected = this.$refs.search.getSelection();
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
      // let url = GetAPIUrl() + "Topic/AddMember?CompanyID=" + this.schoolId + "&TeamTopicID=" + this.catalogId + "&MemberType=" + this.searchMemberType + "&MemberList=" + memberList;
      let url = GetAPIUrl() + "Invite/InviteCompanyMemberToSyncRoom";
      let data = {
        InviteTo:this.catalogId,
        UserIDList:userList
      };

      this._postData(url, data, null, (result) => {
        self.loadTopicMembers();
        self.modalSearch = false;
      }, null);
    },
    handleSearchCancel() {
      this.modalSearch = false;
    },
    handleInviteOK() {
      if(!this.invitePhone){
        this.$Message.warning({content:this.$t("KloudSyncDocLeftPart.MobilePhoneNumberCannotBeEmpty"),duration: 3});
        return;
      }

      let self = this;
      // let url = GetAPIUrl() + "Topic/InviteUser?itemID=" + this.catalogId + "&mobile=" + (this.areacode+this.invitePhone) + "&email=" + this.inviteEmail;
      let url = GetAPIUrl() + "Invite/InviteNewToCompany";
      let data = {
        CompanyID:this.schoolId,
        InviteTo:this.catalogId,
        Mobile:this.areacode+this.invitePhone,
        InviteToType:2,//syncroom
        RequestAddFriend:this.addToMyFriendFlag?1:0
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
            self.loadTopicMembers();
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
      let self = this;
      let content = this.$t('TopicHomePage.SetAdminContent', {Member: member.MemberName, Catalog: this.catalogName});
      this.$Modal.confirm({
        title: this.$t('TopicHomePage.SetAdminTitle'),
        content: content,
        okText: this.$t('Base.OK'),
        cancelText: this.$t('Base.Cancel'),
        onOk: () => {
          let url = GetAPIUrl() + "Topic/ChangeMemberType?TopicID=" + self.catalogId + "&MemberID=" + member.MemberID + "&MemberType=1";
          self._postData(url, {}, null, (result) => {
            member.MemberType = 1;
            content = member.MemberName + " has been set as " + self.catalogName + " admin.";
            this.$Message.info({content: content, duration: 3});
          }, null);
        }
      });
    },
    handleRemoveTeam(member) {
      let self = this;
      let content = "This will remove " + member.MemberName + " from " + this.catalogName + ".";
      this.$Modal.confirm({
        title: 'Remove from team',
        content: content,
        okText: 'OK',
        cancelText: 'Cancel',
        onOk: () => {
          let url = GetAPIUrl() + "Topic/RemoveMember?TopicID=" + self.catalogId + "&MemberID=" + member.MemberID;
          self._deleteData(url, null, (result) => {
            self.loadTopicMembers();
            content = member.MemberName + " has been removed from " + self.catalogName + ".";
            this.$Message.info({content: content, duration: 3});
          }, null);
        }
      });
    },
    handleAddIndividualCustomer() {
      this.individualContact = [];
      this.customerList.forEach(item => {
        this.individualContact.push(item.MemberID);
      });
      friends.getFriends(friends => {
         this.individualContactList = this._initializeUsers2(friends);
      });
      this.modalIndicidual = true;
    },
    handleIndicidualOK() {
      if (this.individualContact.length == 0) {
        this.modalIndicidual = false;
        return;
      }

      let self = this;
      let memberList = this.individualContact.join(',');
      let url = GetAPIUrl() + "Topic/AddMember?CompanyID=" + this.schoolId + "&TeamTopicID=" + this.catalogId + "&MemberType=10" + "&MemberList=" + memberList;
      let data = {};

      this._postData(url, data, null, (result) => {
        self.loadTopicMembers();
        self.modalIndicidual = false;
      }, null);
    },
    handleIndicidualCancel() {
      this.modalIndicidual = false;
    },
    handleAddCompanyCustomer() {
      //当前CUSTOMERS有没有company数据
      if(!this.hasCompany){
        this.companyID = 0;
        this.companyContacts = [];
        this.loadCompanyList();
        this.modalCompany = true;
      }
      else{
        this.modalChangeCompany = true;
      }
    },
    changeCompany(){
      this.companyID = this.companyCustomer.id;
      this.companyContacts = [];
      this.customerList.forEach(item => {
        this.companyContacts.push(item.MemberID);
      });
      this.loadCompanyList();
      this.loadCompanyContact();
      this.modalCompany = true;
    },
    handleCompanyOrIndicidualOK() {
      let self = this;
      let memberList;
      let url;
      //如果is a company
      if(this.isCompany){
        if(this.companyID === 0){//没有选择company的提示
          this.$Message.warning({content: 'Please select company', duration: 5});
          return;
        }

        if(this.companyContacts.length === 0){
          this.$Message.warning({content: 'Please select company contacts', duration: 5});
          return;
        }
        memberList = this.companyContacts.join(',');
        url = GetAPIUrl() + "Topic/BindPTCompany?topicID="+this.catalogId+"&ptCompanyID="+this.companyID+"&CompanyID="+this.schoolId+"&MemberType=10" + "&MemberList=" + memberList;

      }else{
        if(this.individualContact.length == 0) {
          this.$Message.warning({content: 'Please select contacts', duration: 5});
          return;
        }
        memberList = this.individualContact.join(',');
        url = GetAPIUrl() + "Topic/AddMember?CompanyID=" + this.schoolId + "&TeamTopicID=" + this.catalogId + "&MemberType=10" + "&MemberList=" + memberList;
      }

      let data = {};

      this._postData(url, data, null, (result) => {
        self.loadTopicMembers();
        self.modalCompany = false;
      }, null);
    },
    handleCompanyCancel() {
      this.modalCompany = false;
    },
    handleAddAssociatesAction(name) {
      switch (name) {
        case 'search':
          this.handleAddAssociates();
          break;

        case 'invite':
          this.handleInviteMember();
          break;
      }
    },
    handleAddAssociates() {
      this.searchKey = '';
      this.searchMemberType = 11;
      this.searchData = [];
      this.modalSearch = true;
    },
    handleChangeCompanyOK(){
      this.modalChangeCompany=false;
    },
    handleChangeCompanyCancel(){
      this.modalChangeCompany=false;
    },
    createCompany(){
      this.customerCompany = {Id: -1, Name:"", Note:"", WebSite:""};
      this.modalCustomerCompany = true;
    },
    editCompany() {
      if (this.isOwnerAdmin) {
        let company = this.companyCustomer;
        this.customerCompany = {Id: company.id, Name: company.name, Note: company.note, WebSite: company.link};
        this.modalCustomerCompany = true;
      }
      else {
        this.modalCompanyInfo = true;
      }
    },
    handleCustomerCompanyOK(){
      let self = this;
      let url = GetAPIUrl() + (this.customerCompany.Id > 0 ? "PTCompany/UpdatePTCompany" : "PTCompany/CreatePTCompany");
      let data = {
        CompanyID: this.customerCompany.Id,
        AccountCompanyID: this.schoolId,
        CompanyName: this.customerCompany.Name,
        CompanyNote: this.customerCompany.Note,
        WebSite: this.customerCompany.WebSite
      };
      this._postData(url, data, null, (result) => {
        self.modalCustomerCompany = false;
        if (self.customerCompany.Id > 0) {
          self.loadCompanyCustomer();
        }
        else {
          self.loadCompanyList();
        }
      }, null);
    },
    handleCustomerCompanyCancel(){
      this.modalCustomerCompany = false;
    },
    loadCompanyList(){
      let self = this;
      let url = GetAPIUrl() + "PTCompany/List?companyID="+this.schoolId;//加载company列表

      this._getData(url, null, (result) => {
        self.companyList=result;
      }, null);
    },
    handChangeCompany(current){
      this.companyContacts=[];
      this.loadCompanyContact();
    },
    loadCompanyContact(){
      this.companyContactList=[];
      if(this.companyID){
        let url = GetAPIUrl() + "PTCompanyContact/List?ptCompanyID="+this.companyID;//加载company下的contact列表
        this._getData(url, null, (result) => {
          this.companyContactList=result;
        }, null);
      }
    },
    selCompanyOrIndivdual(state){
      this.companyContactList=[];
      this.companyID=0;
      this.companyContacts=[];

      //加载Indivdual时的contacts
      if(!state){
        this.individualContact = [];
        this.customerList.forEach(item => {
          this.individualContact.push(item.MemberID);
        });
        friends.getFriends(friends => {
          this.individualContactList = this._initializeUsers2(friends);
        });
      }
    },
    handleAddCompanyMember() {
      this.modalAddCompanyContact=true;
      this.companyContactIDList=[];

      let self=this;

      for(let item of this.companyContactList){
        this.companyContactIDList.push(item.ContactID);
      }
      friends.getFriends(function(friends) {
         self.inviteTableData = self._initializeUsers2(friends);
      });
    },
    handleAddCompanyContactOK(){
      let selected=this.$refs.companyContactOfFriend.getSelection();

      if (selected.length === 0) {
        this.modalAddCompanyContact = false;
        return;
      }
      if(this.companyID===0){//没有选择company的提示
        this.$Message.warning({content: 'Please select company', duration: 5});
        return;
      }

      let memberList="";
      selected.forEach(element => {
        memberList+=element.id+",";
      });
      memberList=memberList.substring(0,memberList.length-1);
      let data={};
      let url=GetAPIUrl() + "PTCompanyContact/AddContacts?ptCompanyID="+this.companyID+"&contactIDs="+memberList;

      this._postData(url, data, null, (result) => {
        this.modalAddCompanyContact=false;
        this.loadCompanyContact();
      }, null);
    },
    handleAddCompanyContactCancel(){
      this.modalAddCompanyContact=false;
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
    handleContactsModal(){
      this.customerLeads=true;
      friends.getFriends(friends => {
        this.newContacts = this._initializeUsers2(friends);
      });
    },
    _getData(url, before, success, error) {
      if (before && typeof before === 'function') {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: 'GET',
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
  }
}
</script>
