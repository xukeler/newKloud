<template>
  <section class="sum-wrap">
    <div class="sum-box">
      <div class="list-header-title">
        <span class="iconfont iconxingzhuang"></span>
        <p>{{title}}</p>
      </div>
      <div class="summary-container-all">
        <div class="owner">Owner:</div>
        <div class="content">
          <p class="section">{{description}}</p>
          <p class="hint-message">Time Estimate changed from “3 days 12 hours” to “4 days 10 hours”</p>
        </div>
      </div>
      <div class="self-data-status">
        <div class="self-title-box">Approval status</div>
        <table cellspacing="0" cellpadding="0" border="0" width="100%" class="sum-table-one">
          <thead>
            <tr>
              <th width="20%" style="padding-left:6px">Owner</th>
              <th width="20%">Status</th>
              <th width="30%">Date</th>
              <th width="30%">Note</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="tableData.length<=0">
              <td
                colspan="5"
                style="width:100%;text-align:center;padding:10px 0;color:#ccc;"
              >{{$t('Common.NoData')}}</td>
            </tr>
            <tr v-for="(item,index) in tableData" :key="index">
              <td style="padding-left:8px">{{item.owner}}</td>
              <td :style="{color:item.style}">{{item.status}}</td>
              <td>{{item.date}}</td>
              <td style="padding-right:6px">{{item.note}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="act-hint-message">This requirement requires your approval</div>
      <!-- <div class="act-hint-message" style="color:#F4713A;margin-bottom:16px">This requirement not ready for approval yet</div> -->
      <!-- <div class="unready-message" >
        You can use <span>Sync</span> and <span>Chat function </span>  to make suggestions to this requirement.
      </div>-->
      <div class="act-btn-box">
        <div class="approve-btn" @click="showMask(2)">
          <div class="hover-message">Approval Request A new change is added</div>
          <p>
            <span class="iconfont iconapprove"></span>Approve
          </p>
        </div>
        <div class="reject-btn" @click="showMask(1)">
          <p>
            <span class="iconfont iconreject"></span>Reject
          </p>
        </div>
      </div>
      <div class="act-end-message" v-if="0">
        <div class="icon">
          <span class="iconfont iconapprove" style="font-szie:16px;"></span>
        </div>
        <div class="text">
          <p class="state">You Apprpve at 1029/08/06</p>
          <p class="suggest">同意，请安排实现</p>
        </div>
        <div class="reset">
          <div class="reset-btn">reset</div>
        </div>
      </div>
    </div>
    <Modal v-model="visible" class="hidden">
      <div class="approve-box">
        <div class="approve-show-icon">
          <span class="iconfont iconapprove" style="color:#0DC392;"></span>
          <p style="color:#0DC392">确认评审通过</p>
        </div>
        <div class="approve-title">是否确认该文档评审通过</div>
        <Input
          class="textarea-style-approve"
          v-model="textareaVal"
          :rows="3"
          type="textarea"
          :placeholder="$t('TopicHomePage.PleaseInput')"
        />
        <div style="display:flex" class="act-btn">
          <div style="width:50%;text-align:right;padding-right:20px">
            <Button
              style="background-color:#0DC392;border-color:#0DC392"
              class="approve-btn-ok"
              @click="approveOK"
            >{{$t("Base.OK")}}</Button>
          </div>
          <div style="width:50%;padding-left:20px">
            <Button
              class="approve-btn-cancel"
              type="primary"
              @click="closeMask"
            >{{$t("Base.Cancel")}}</Button>
          </div>
        </div>
      </div>
    </Modal>
    <Modal v-model="visible1" class="hidden">
      <div class="approve-box">
        <div class="approve-show-icon">
            <span
              class="iconfont iconreject"
              style="color:#ED6358;"
            ></span>
          <p>确认评审不通过</p>
        </div>
        <div class="approve-title">是否确认该文档评审不通过</div>
        <Input
          class="textarea-style-reject"
          v-model="textareaVal"
          :rows="3"
          type="textarea"
          :placeholder="$t('TopicHomePage.PleaseInput')"
        />
        <div style="display:flex" class="act-btn">
          <div style="width:50%;text-align:right;padding-right:20px">
            <Button class="reject-btn-ok" @click="rejectOK">{{$t("Base.OK")}}</Button>
          </div>
          <div style="width:50%;padding-left:20px">
            <Button
              class="reject-btn-cancel"
              type="primary"
              @click="closeMask"
            >{{$t("Base.Cancel")}}</Button>
          </div>
        </div>
      </div>
    </Modal>
    <Modal v-model="visible2" class="hidden">
      <div class="approve-box">
        <div class="approve-show-icon" style="text-align:center">
            <span
              class="iconfont iconquanxian" style="color:#F4713A"
            ></span>
        </div>
        <p
          style="width:44%;font-size:13px;margin:14px auto 50px;color:#F4713A;"
        >{{$t('TopicHomePage.NoPower')}}</p>
      </div>
      <div class="act-btn" style="text-align:center">
        <Button
          type="primary"
          class="approve-btn-ok"
          style="background-color:#F4713A;border-color:#F4713A"
          @click="closeMask"
        >{{$t("Base.OK")}}</Button>
      </div>
    </Modal>
  </section>
</template>

<script>
import webapi from "../../webapi/webapi";
export default {
  data() {
    return {
      approve: 0,
      reject: 0,
      pending: 0,
      tableData: [],
      title: "",
      description: "",
      num: "",
      status: "",
      visible: false,
      visible1: false,
      visible2: true,
      textareaVal: ""
    };
  },
  mounted() {},
  methods: {
    getData(data) {
      // this.$refs.approve.checkState(data);
      this.status = data.UserApproveStatus;
      this.$parent.showHtmlAll = false;
      this.$parent.showHtml = true;
      let syncRoomID = this.$route.params.id;
      this.title = data.title || "";
      (this.description = data.description || ""),
        webapi.ReqChangeApprovalEventList(syncRoomID, data.itemId).then(res => {
          console.log(res);
          if (res.RetData) {
            let _data = res.RetData.ApprovalList;
            let arr = [];
            _data.forEach(item => {
              let _file = this.processData(item);
              arr.push(_file);
            });
            this.tableData = arr;
          }
        });
    },
    processData(list) {
      let _icon = "";
      let _style = "";
      if (list.Status == -1) {
        _icon = "iconPending_fuzhi";
        _style = "#CACACA";
      } else if (list.Status == -2) {
        _icon = "iconxuanzhong";
        _style = "#0DC392";
      } else {
        _icon = "iconReject";
        _style = "#ED6358";
      }
      let obj = {
        owner: list.OwnerName,
        title: list.Title,
        date: list.DateLastModified,
        status: list.StatusName,
        icon: _icon,
        style: _style,
        note: list.Description
      };
      return obj;
    },
    showMask(a) {
      if (this.status == 0) {
        this.visible2 = true;
      } else {
        if (a == 1) {
          this.visible1 = true;
        } else if (a == 2) {
          this.visible = true;
        }
      }
    },
    approveOK() {
      this.visible = false;
      requestState(-2);
    },
    rejectOK() {
      this.visible1 = false;
      requestState(-3);
    },
    closeMask() {
      this.visible = false;
      this.visible1 = false;
      this.visible2 = false;
      this.textareaVal = "";
    },
    requestState(num) {
      let _phone = this.phone;
      if (this.phone.length > 11) {
        _phone = this.phone.substr(3, 14);
      }
      let params = {
        Phone: _phone,
        syncRoomID: this.syncRoomId,
        ChangeItems: [
          {
            LinkedIssueID: this.itemId || "",
            LastChangeNo: 0,
            ApprovalStatusID: num,
            ChangeDescription: base64encode(this.textareaVal)
          }
        ]
      };
      webapi.approveItem(params).then(res => {
        console.log(res);
        if (res.RetData == 200 && this.$parent.topicInfo) {
          this.$parent.$refs.topicInfo.getDocumentList(1);
        }
      });
    }
  }
};
</script>

<style lang="scss" >
$approve: #0dc392;
$main: #4288f0;
$reject: #ed6358;
.sum-box {
  padding: 10px 35px;
  background: #fff;
  width: 100%;
  height: 100%;
  overflow: auto;
  .list-header-title {
    position: relative;
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
}
.summary-container-all {
  margin-bottom: 46px;
  .content {
    background: rgba(246, 246, 246, 1);
    border-radius: 8px;
    padding: 20px 28px 28px 12px;
    .section {
      font-size: 13px;
      color: #767676;
      margin-bottom: 16px;
    }
    .hint-message {
      font-size: 13px;
      color: $main;
    }
  }
  .owner {
    color: $main;
    font-size: 14px;
    margin: 46px auto 16px;
  }
}
.self-data-status {
  .self-title-box {
    color: $main;
    font-size: 14px;
  }
}
.act-hint-message {
  color: $main;
  font-size: 14px;
  margin: 46px 0 26px 0;
  padding-left: 12px;
}
.act-btn-box {
  display: flex;
  .approve-btn,
  .reject-btn {
    position: relative;
    width: 146px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 10px 20px;
    cursor: pointer;
    .iconfont {
      margin-right: 16px;
      font-size: 27px;
      vertical-align: middle;
    }
    p {
      font-size: 16px;
      line-height: 40px;
    }
    .hover-message {
      padding: 12px;
      background-color: $approve;
      border-radius: 8px;
      position: absolute;
      top: 80px;
      left: 0;
      min-width: 320px;
      color: white;
      display: none;
    }
    .hover-message:before {
      content: "";
      display: block;
      width: 10px;
      height: 10px;
      transform: rotate(45deg);
      background-color: $approve;
      position: absolute;
      top: -5px;
      left: 30px;
    }
  }
  .approve-btn:hover .hover-message {
    display: block;
  }
  .approve-btn {
    margin-right: 53px;
    color: $approve;
  }
  .reject-btn {
    color: $reject;
  }
}
.act-end-message {
  display: flex;
  padding: 0 12px;
  .icon {
    margin-right: 16px;
    .iconfont {
      font-size: 18px;
    }
  }
  .text {
    margin-right: 100px;
    .state {
      font-size: 13px;
      color: #888;
      line-height: 30px;
    }
    .suggest {
      font-size: 11px;
      color: #898989;
      background-color: #f6f6f6;
      padding: 6px 12px;
    }
  }
  .reset {
    .reset-btn {
      color: #4288f0;
      font-size: 10px;
      width: 60px;
      height: 26px;
      line-height: 26px;
      box-shadow: 0px 2px 4px 0px rgba(66, 136, 240, 0.27);
      border-radius: 8px;
      cursor: pointer;
      text-align: center;
    }
  }
}
.unready-message {
  padding-left: 12px;
  font-size: 13px;
  color: #888;
  span {
    color: $main;
  }
}
@media screen and (max-width: 1400px) {
  .sum-wrap {
    width: 100% !important;
  }
  .close {
    right: 16px !important;
  }
}
.sum-table-one {
  border-spacing: 0 10px;
  border-radius: 8px;
  thead {
    tr {
      th {
        font-size: 14px;
        color: #333333;
        text-align: left;
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
      border-radius: 2px;
      td {
        font-size: 13px;
        color: #767676;
        text-align: left;
        padding: 10px 0;
      }
    }
  }
}
.hidden {
  .ivu-modal{
    width: 400px !important;
  }
  .ivu-modal-footer {
    display: none;
  }
  .approve-box {
    .textarea-style-reject textarea:hover {
      border-color: $reject;
    }
    .textarea-style-reject textarea:focus {
      border-color: $reject;
      box-shadow: none;
    }
    textarea {
      background: #F0F0F0;
      border: none;
    }
    .textarea-style-approve textarea:hover {
      border-color: $approve;
    }
    .textarea-style-approve textarea:focus {
      border-color: $approve;
      box-shadow: none;
    }
    .approve-show-icon {
      text-align: center;
      margin-top: 40px;
      span {
        font-size: 32px;
      }
      p {
        color: $reject;
        margin: 18px 0 8px 0;
        font-size: 14px;
      }
    }
    .approve-title {
      text-align: center;
      color: #949494;
      font-size: 11px;
      margin-bottom: 18px;
    }
  }
  .act-btn {
    margin: 26px 0 10px 0;
    .approve-btn-cancel:hover {
      border-color: $approve;
      color: $approve;
    }
    .approve-btn-ok {
      color: white;
      transition: all 0.5s;
    }
    .approve-btn-ok:hover,
    .reject-btn-ok:hover,
    .reject-btn-cancel:hover,
    .approve-btn-cancel:hover {
      transform: scale(1.05);
    }
    .reject-btn-ok {
      background-color: $reject;
      border-color: $reject;
      color: white;
      transition: all 0.5s;
    }
    .reject-btn-cancel,
    .approve-btn-cancel {
      border-color: #c9c9c9;
      background-color: #fff;
      color: #c9c9c9;
      box-sizing: border-box;
      transition: all 0.5s;
    }
    .reject-btn-cancel:hover {
      border-color: $reject;
      color: $reject;
    }
    button {
      width: 102px;
      height: 30px;
      border-radius: 8px;
      padding: 0 !important;
    }
  }
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
</style>