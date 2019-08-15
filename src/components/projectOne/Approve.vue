<template>
  <div class="approve-main">
      <div class="selected-box">
        <div class="approve-hint" v-show="!resetFlag">
          <span style>This requirement requires your approval</span>
        </div>
        <div class="approve-btn" v-show="!resetFlag">
          <div class="approve-left" @click="showApproveMask">
            <span class="iconfont iconApproval"></span>
            <span class="text" style="color:#10981D">Approve</span>
          </div>
          <div class="approve-right" @click="rejectMaskShow">
            <span class="iconfont iconReject"></span>
            <span class="text">Reject</span>
          </div>
        </div>
        <span class="approve-hint-message" v-show="!resetFlag">
          Approval Request
          <span>A new change is added</span>
        </span>
        <div class="approve-reset" v-if="resetFlag">
          <div class="title-box">
            <div class="icon">
              <span :class="'iconfont '+icon" :style="{color:style}"></span>
            </div>
            <p class="title">
              You
              <span :style="{color:style}">{{message}}</span> at 2019/08/05 14:20:04
            </p>
            <!-- <div class="reset-btn">
              reset
            </div>-->
          </div>
          <div class="content-box">同意，请安排实现</div>
        </div>
        <div class="unReady" v-if="0">
          <p class="title">This requirement is not ready for approval yet</p>
          <p class="section">
            You can use
            <span>Sync</span> and
            <span>Chat function</span> to make suggestions to this requirement.
          </p>
        </div>
    </div>
    <Modal v-model="visible" class="hidden">
      <div class="approve-box">
        <div class="approve-show-icon">
          <div class="icon-box" style="box-shadow:0px 2px 3px 0px rgba(16,152,29,0.28);">
            <span
              class="iconfont iconxuanzhong"
              style="color:#10981D;position:absolute;top:-21px;left:0px;"
            ></span>
          </div>
          <p style="color:#10981D">确认评审通过</p>
        </div>
        <div class="approve-title">是否确认该文档评审通过</div>
        <Input
          class="textarea-style-approve"
          v-model="textareaVal"
          :rows="4"
          type="textarea"
          :placeholder="$t('TopicHomePage.PleaseInput')"
        />
        <div style="display:flex" class="act-btn">
          <div style="width:50%;text-align:right;padding-right:20px">
            <Button
              style="background-color:#10981D;border-color:#10981D"
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
          <div class="icon-box" style="box-shadow:0px 2px 3px 0px rgba(250,59,83,0.28);">
            <span
              class="iconfont iconReject"
              style="color:#FA3B53;position:absolute;top:-21px;left:0px;"
            ></span>
          </div>
          <p>确认评审不通过</p>
        </div>
        <div class="approve-title">是否确认该文档评审不通过</div>
        <Input
          class="textarea-style-reject"
          v-model="textareaVal"
          :rows="4"
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
          <div
            class="icon-box"
            style="background-color:#F4713A;box-shadow:0px 2px 3px 0px rgba(250,59,83,0.28);"
          >
            <span
              class="iconfont iconquanxian"
              style="position:absolute;top:11px;left:23px;font-size:38px;color:white;"
            ></span>
          </div>
        </div>
        <p
          style="width:55%;font-size:20px;margin:14px auto 50px;text-align:jusitify;color:#C9C9C9;"
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
  </div>
</template>
<script>
import webapi from "../../webapi/webapi";
import decode from "../../common/whiteboard";
import colorPicker from "iview";
import "../../../static/iconfont.css";
export default {
  data() {
    return {
      visible: false,
      visible1: false,
      visible2: false,
      textareaVal: "",
      syncRoomId: "",
      resetFlag: false,
      phone: "",
      status: "",
      message: "",
      style: "",
      icon: ""
    };
  },
  mounted() {
    this.syncRoomId = this.$route.params.id || "";
    this.phone = sessionStorage.getItem("UserData.Mobile") || "";
  },
  methods: {
    checkState(data) {
      let status=data.UserApproveStatus;
      this.status = status;
      this.message = data.UserApproveStatusName;
      this.itemId=data.itemId;
      if(status==0||status==-1){
        this.resetFlag=false;
      }else if(status==-2){
        this.resetFlag=true;
        this.icon = "iconxuanzhong";
        this.style = "#10981D";
      }else if(status==-3){
        this.resetFlag=true;
        this.icon = "iconReject";
        this.style = "#FA3B53";
      }
    },
    rejectMaskShow() {
      if (this.status == -1) {
        this.visible1 = true;
      } else if (this.status == 0) {
        this.visible2 = true;
      }
    },
    rejectOK() {
      this.visible1 = false;
      this.requestState(-3);
    },
    resetClick() {
      this.resetFlag = false;
      if (this.status == 0) {
        this.visible2 = true;
      } else if (this.status != -1) {
        this.visible = true;
        this.requestState(-1);
      }
    },
    closeMask() {
      this.visible = false;
      this.visible1 = false;
      this.visible2 = false;
      this.textareaVal = "";
    },
    showApproveMask() {
      if (this.status == -1) {
        this.visible = true;
      } else if (this.status == 0) {
        this.visible2 = true;
      }
    },
    approveOK() {
      this.visible = false;
      this.resetFlag = true;
      this.requestState(-2);
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
        if (res.RetData == 200&&this.$parent.updateData) {
          this.$parent.updateData();
        }
      });
    },
  }
};
</script>

<style lang="scss" >
.approve-main {
    .selected-box {
      font-size: 12px;
      .approve-hint {
        margin: 20px 0 0 0;
        color: #fa3b53;
        span {
          color: #ec3a1f;
          background-color: #fbece9;
          padding: 3px 14px;
          border-radius: 8px;
          display: inline-block;
        }
      }
      .approve-btn {
        display: flex;
        margin-top: 8px;
        div {
          cursor: pointer;
          width: 50%;
          text-align: center;
          .iconfont {
            transition: all 0.4s;
          }
        }
        div:hover .text {
          text-decoration: underline;
        }
        div:hover .iconfont {
          transform: scale(1.05);
        }
        .iconfont {
          font-size: 46px;
          vertical-align: middle;
        }
        .approve-left {
          .text {
            font-weight: bold;
            color: #10981d;
            margin-left: 10px;
          }
          .iconfont {
            color: #10981d;
          }
        }
        .approve-right {
          .text {
            color: #fa3b53;
            font-weight: bold;
            margin-left: 10px;
          }
          .iconfont {
            color: #fa3b53;
          }
        }
      }
      .approve-hint-message {
        color: #10981d;
        padding: 3px 14px;
        background: rgba(241, 254, 242, 1);
        border-radius: 8px;
        display: inline-block;
        margin-top: 10px;
        span {
          color: #747474;
        }
      }
      .approve-reset {
        margin-top: 20px;
        .title-box {
          display: flex;
          position: relative;
          .icon {
            .iconfont {
              font-size: 26px;
            }
          }
          .title {
            line-height: 39px;
            width: 76%;
            padding-left: 14px;
            color: #898989;
          }
          .reset-btn {
            margin-top: 6px;
            color: #4288f0;
            font-size: 10px;
            width: 60px;
            height: 26px;
            box-shadow: 0px 2px 4px 0px rgba(66, 136, 240, 0.27);
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
          }
          .content-box {
            padding: 10px 0 0 40px;
            font-size: 10px;
            color: #898989;
          }
        }
      }
      .content-box {
        padding-left: 40px;
        font-size: 12px;
        color: #898989;
      }
      .unReady {
        margin-top: 20px;
        padding: 0 14px;
        .title {
          color: #f4713a;
          font-size: 12px;
        }
        .section {
          padding: 8px 0;
          color: #373737;
          font-size: 12px;
          span {
            color: #4288f0;
          }
        }
      }
    }
}
.hidden {
  .ivu-modal-footer {
    display: none;
  }
  .approve-box {
    .textarea-style-reject textarea:hover {
      border-color: #fa3b53;
    }
    .textarea-style-reject textarea:focus {
      border-color: #fa3b53;
      box-shadow: none;
    }
    textarea {
      background: rgba(240, 240, 240, 1);
    }
    .textarea-style-approve textarea:hover {
      border-color: #10981d;
    }
    .textarea-style-approve textarea:focus {
      border-color: #10981d;
      box-shadow: none;
    }
    .approve-show-icon {
      text-align: center;
      margin-top: 20px;
      .icon-box {
        width: 84px;
        height: 84px;
        border-radius: 50%;
        overflow: hidden;
        margin: 0 auto;
        position: relative;
        background-color: white;
        span {
          font-size: 84px;
        }
      }
      p {
        color: #fa3b53;
        margin: 24px 0 12px 0;
        font-size: 20px;
      }
    }
    .approve-title {
      text-align: center;
      color: #949494;
      font-size: 14px;
      margin-bottom: 24px;
    }
  }
  .act-btn {
    margin: 26px 0 30px 0;
    .approve-btn-cancel:hover {
      border-color: #10981d;
      color: #10981d;
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
      background-color: #fa3b53;
      border-color: #fa3b53;
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
      border-color: #fa3b53;
      color: #fa3b53;
    }
    button {
      width: 140px;
      height: 40px;
      border-radius: 8px;
      padding: 0 !important;
    }
  }
}
</style>