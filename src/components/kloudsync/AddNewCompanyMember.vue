<template>
  <div class="kloudsync-add-new-company-member">
    <div class="header">
      <div class="one-badge"><Icon type="checkmark" size="12" color="#2d8cf0"></Icon></div>
      <hr color="#dddee1" size="1px" style="width:120px;margin:0px 5px;">
      <div class="two-badge">2</div>
    </div>
    <div class="describe">
      企业，first team, first space创建成功，邀请您的团队成员加入吧。
      邀请选项如果设为admin，可以将被邀请的团队成员设置为企业的admin用户，admin用户可以管理企业所有的team和space。
    </div>
    <div class="invite-new-phohe">
      <table class="invite-table">
        <tr v-show="memberListLength>0" v-for="item in memberList" :key="item.index">
          <td><span style="color:red;">*</span>{{$t('Common.Phone')}}: </td>
          <td>
            <div style="width:inherit">
              <phone-area-code :createNewCompany="true" @getAreaCode="getAreaCode($event,item.index)"></phone-area-code>
              <div style="float:left;width:calc(100% - 91px);">
                <Input v-model="item.phone" :placeholder="$t('KloudSyncDocLeftPart.PlaceholderPhoneNumber')" @on-change="changeInput(item.phone,item.index)"/>
              </div>
            </div>
          </td>
          <td>
            <Dropdown placement="bottom" class="more-action" @on-click="handSelectMemberType($event,item.index)">
              <span style="padding:5px;cursor: pointer;color:#bdc5b8">{{item.memberType}} <Icon size="14" type="chevron-down" color="#bdc5b8"></Icon></span>
              <DropdownMenu slot="list">
                <DropdownItem name="member">Invite as Member</DropdownItem>
                <DropdownItem name="admin">Invite as admin</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </td>
        </tr>
        <tr style="height:42px">
          <td></td>
          <td><Button icon="plus-round" @click="addNewPhone">Add more</Button></td>
          <td></td>
        </tr>
      </table>
    </div>
  </div>
</template>
<style lang="scss">
.kloudsync-add-new-company-member{
  .header{
    display:flex;
    align-items:center;
    justify-content:center;
    .two-badge{
      text-align: center;
      background: #2d8cf0 !important;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      line-height: 24px;
      color: white;
      font-size: 12px;
    }
    .one-badge{
      text-align: center;
      background: #dddee1 !important;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      line-height: 24px;
      color: white;
      font-size: 12px;
    }
  }
  .describe{
    padding: 20px 50px 0px;
  }
  .invite-new-phohe{
    padding: 20px 10px 0px;
    height: 300px;
    overflow-y: auto;
  }
  .invite-table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;

    td {
      padding:6px 2px 6px;
    }
    td:first-of-type {
      text-align: left;
    }
    tr td:nth-child(2){
      text-align: left;
    }
    td:last-of-type {
      text-align: right;
      width: 15%;
    }
  }
}
</style>
<script>
  export default {
    data: function ()
    {
      return {
        memberList:[
          {index:0,PhoneAreaCode:"+86",phone:"",memberType:'admin'},
          {index:1,PhoneAreaCode:"+86",phone:"",memberType:'admin'},
          {index:2,PhoneAreaCode:"+86",phone:"",memberType:'admin'}
        ],
        index:2,
      }
    },
    props:{
      newSchoolId:{
        type: Number,
        default: -1
      },
      fistSpaceID:{
        type: Number,
        default: -1
      },
    },
    mounted: function (){
      this.emitMember();
    },
    computed:{
      memberListLength(){
        return this.memberList.length;
      }
    },
    methods: {
      getAreaCode(val,index){
        // console.warn(val);
        // console.warn(index);
        if(val){
          this.$nextTick(()=>{
            this.memberList.splice(index,1,{index:this.memberList[index].index,PhoneAreaCode:val,phone:this.memberList[index].phone,memberType:this.memberList[index].memberType});
            this.$nextTick(()=>{
              this.emitMember();
            })
          })
        }
        // console.warn(this.memberList);
      },
      emitMember(){
        let inviteMember=[];
        for(let item of this.memberList){
          if(item.phone){
            if(item.memberType==="admin"){
              inviteMember.push({"CompanyID":this.newSchoolId, "Mobile":item.PhoneAreaCode+item.phone,"InviteTo":this.fistSpaceID,"InviteToType": 5})
            }else{
              inviteMember.push({"CompanyID":this.newSchoolId, "Mobile":item.PhoneAreaCode+item.phone,"InviteTo":this.fistSpaceID,"InviteToType": 0})
            }
          }
        }
        this.$emit("getInviteNumber",inviteMember);
      },
      addNewPhone(){
        this.index++;
        this.memberList.push({index:this.index,PhoneAreaCode:"+86",phone:"",memberType:'admin'});
      },
      changeInput(phone,index){
        this.memberList.splice(index,1,{index:this.memberList[index].index,PhoneAreaCode:this.memberList[index].PhoneAreaCode,phone:phone,memberType:this.memberList[index].memberType});
        this.$nextTick(()=>{
          this.emitMember();
        })
        
      },
      handSelectMemberType(name,index){
        this.memberList.splice(index,1,{index:this.memberList[index].index,PhoneAreaCode:this.memberList[index].PhoneAreaCode,phone:this.memberList[index].phone,memberType:name});
        this.$nextTick(()=>{
          this.emitMember();
        })
        switch (name) {
          case 'member':
            break;
          case 'admin':
            break;
          default:
            break;
        }
      },
    },
  }
</script>
