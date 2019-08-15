<template>
  <section class="sum-wrap">
    <div class="sum-box">
      <div class="list-header-title">
        <span class="iconfont iconxingzhuang"></span>
        <p>Approval request summary</p>
      </div>
      <table cellspacing="0" cellpadding="0" border="0" width="100%" class="sum-table">
        <thead>
          <tr>
            <th width="30%" style="text-align:left;padding-left:12px">Requirement</th>
            <th width="20%" style="text-align:left">Date</th>
            <th width="12.5%">Approved</th>
            <th width="12.5%">Rejected</th>
            <th width="12.5%">Pending</th>
            <th width="12.5%">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="tableData.length<=0">
            <td
              colspan="6"
              style="width:100%;text-align:center;padding:10px 0;color:#ccc;"
            >{{$t('Common.NoData')}}</td>
          </tr>
          <tr v-for="(item,index) in tableData" :key="index">
            <td style="text-align:left;padding-left:12px">{{item.title}}</td>
            <td style="text-align:left">{{item.date}}</td>
            <td>{{item.approve}}</td>
            <td>{{item.pending}}</td>
            <td>{{item.reject}}</td>
            <td style="cursor:pointer" >
              <Poptip placement="bottom-end" width="600" trigger="hover">
                <span  :style="{color:item.style}">{{item.statusName}}</span>
                <div class="poptip" slot="content">
                  <table cellspacing="0" cellpadding="0" border="0" width="100%">
                    <thead>
                      <tr>
                        <th style="padding-left:6px;">Owner</th>
                        <th style="text-align:center">Status</th>
                        <th>Date</th>
                        <th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item1,index1) in item.hoverList" :key="index1">
                        <td style="padding-left:6px;">{{item1.OwnerName}}</td>
                        <td style="text-align:center">
                          <span class="sum-green">{{item1.StatusName}}</span>
                        </td>
                        <td>{{item1.DateLastModified}}</td>
                        <td>02/05/2019 20:00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Poptip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import webapi from '../../webapi/webapi';
export default {
  data() {
    return {
      totalCount:"",
      approve:0,
      reject:0,
      pending:0,
      tableData:[]
    };
  },
  methods: {
    getData(state,arr){
        this.$parent.showHtml=false;
        this.$parent.showHtmlAll=true;
        this.setState(state)
        let stateArr=state.split(",");
        let _array=[];
        if(this.tableData.length<=0){
            arr.forEach(async (item)=>{
              let _data=await this.processData(item);
              _array.push(_data)
          })
          this.tableData=_array;
          console.log(this.tableData)
        }   
    },
    async processData(list){
      let syncRoomID=this.$route.params.id||"";
      let _result=await webapi.ReqChangeApprovalEventList(syncRoomID,list.itemId);
      let _hoverList=_result.RetData.ApprovalList;
      let _approve=0;
      let _reject=0;
      let _pending=0;
      _hoverList.forEach((item)=>{
        if(item.Status==-1){
          _pending+=1;
        }else if(item.Status==-2){
          _approve+=1;
        }else if(item.Status==-3){
          _reject+=1;
        }
      })
      let _icon="";
      let _style="";
      if(list.ApproveStatus==-1){
        _icon="iconPending_fuzhi";
        _style="#C5C5C5"
      }else if(list.ApproveStatus==-2){
        _icon="iconxuanzhong";
        _style="#0DC392"
      }else{
         _icon="iconReject";
        _style="#ED6358"
      }
      let obj={
        title:list.title,
        approve:_approve,
        reject:_reject,
        pending:_pending,
        date:list.date,
        status:list.ApproveStatus,
        icon:_icon,
        style:_style,
        hoverList:_hoverList,
        statusName:list.ApproveStatusName,
      }
      return obj
    },
    setState(arr){
      let _arr=arr.split(",");
      this.pending=_arr[0];
      this.approve=_arr[1];
      this.reject=_arr[2]
    },
  }
};
</script>

<style lang="scss" >
$approve: #0dc392;
$main: #4288f0;
$reject: #ed6358;
 .list-header-title {
    position: relative;
    margin-bottom: 30px;
    .iconfont {
      position: absolute;
      left: -24px;
      top: -2px;
      color: $main;
    }
    p {
      color: $main;
      font-size: 14px;
    }
  }
@media screen and (max-width: 1400px) {
  .sum-wrap {
    width: 90% !important;
  }
  .close {
    right: 16px !important;
  }
}
.data-state {
  display: flex;
  margin: 70px auto;
  .state-number {
    text-align: left;
  }
  .state-box {
    width: calc(33% - 13.33px);
    text-align: center;
    display: flex;
    margin-right: 20px;
    text-align: center;
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    padding: 14px 28px;
    .icon-box {
      .iconfont {
        font-size: 32px;
        margin-right: 20px;
      }
    }
    .content-box {
      .state-number {
        font-size: 14px;
        color: #373737;
      }
      .state-tip {
        font-size: 10px;
        color: #949494;
      }
    }
    .pending-icon:after,
    .pending-icon:before {
      content: "";
      display: inline-block;
      height: 12px;
      width: 3px;
      border-radius: 4px;
      background-color: #fff;
      position: absolute;
    }
    .pending-icon:after {
      top: 12px;
      left: 46%;
      transform: translateY(-50%);
    }
    .pending-icon:before {
      right: -1px;
      top: 50%;
      width: 12px;
      height: 3px;
      border-radius: 4px;
      transform: translateX(-50%);
    }
    .ivu-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      line-height: 32px;
      text-align: center;
      color: white;
      margin-right: 8px;
      vertical-align: middle;
      position: relative;
    }
  }
}
.sum-table {
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  thead {
    tr {
      th {
        font-size: 14px;
        color: $main;
        text-align: center;
        padding: 10px 0;
        font-weight: normal;
      }
    }
  }
  tbody {
    tr:nth-child(2n) {
      background: #fdfeff;
    }
    tr:nth-child(2n + 1) {
      background: #f5faff;
    }
    tr {
      td {
        font-size: 13px;
        color: #383838;
        text-align: center;
        padding: 22px 0;
      }
    }
  }
}
.ivu-poptip-body {
  background-color: #f6f9fe;
  border-radius: 8px;
  .poptip {
    table {
      border-spacing: 0 10px;
      thead {
        tr {
          th {
            font-size: 12px;
            color: #383838;
            text-align: left;
          }
        }
      }
      tbody {
        tr {
          box-shadow: 0px 1px 5px 0px rgba(66, 136, 240, 0.11);
          border-radius: 2px;
          border-radius: 2px;
          td {
            padding: 10px 0;
            text-align: left;
            background-color: #fff;
            color: #949494;
          }
        }
      }
    }
  }
}
.ivu-poptip-arrow:after {
  border-bottom-color: #f6f9fe !important;
}

.clearfix {
  *zoom: 1;
}
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.sum-wrap {
  position: relative;
  margin: 0 auto;
  width: calc(100% - 238px);
  height: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fbfbfd;
  padding: 30px;
}
.sum-box {
  padding:10px 35px;
  background: #fff;
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>