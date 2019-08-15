<template>
  <div class="kloudsync-settings-payment">
    <div class="panel-header">
      Payment setting

      <div class="panel-header-right">
        <Icon style="vertical-align: middle; margin-right: 0.25em;" type="ios-search" color="#80848f" size="24"></Icon>

        <div class="header-search-wrap">
          <Input v-model="searchPayment" placeholder="Search ..."/>
        </div>
        <Button type="success" icon="plus-round" @click="addCreditCard">Add new card</Button>
      </div>
    </div>
    <div class="panel-content-cover">
      <div class="setting-content">
        <Table :no-data-text="$t('Common.NoData')" size="large" stripe highlight-row
           :data="cardsData" :columns="cardsColumn">
        </Table>
      </div>
    </div>

    <Modal v-model="modalCard" :mask-closable="false"
           :title="$t('AccountInfo.CreditCard')" :ok-text="$t('Base.OK')" :cancel-text="$t('Base.Cancel')"
           @on-ok="modalCardOK">
      <Form :model="editingCard" label-position="right" :label-width="150">
        <FormItem :label="$t('AccountInfo.CardNumber')">
          <Input v-model="editingCard.number" style="width: 250px"></Input>
        </FormItem>
        <FormItem :label="$t('AccountInfo.Expires')">
          <Select v-model="editingCard.expiresMonth" style="width: 60px;" :placeholder="$t('AccountInfo.Month')">
            <Option v-for="month in months" :value="month" :key="month">{{month}}</Option>
          </Select>
          /
          <Select v-model="editingCard.expiresYear" style="width: 80px;" :placeholder="$t('AccountInfo.Year')">
            <Option v-for="year in years" :value="year" :key="year">{{year}}</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('AccountInfo.NameOnCard')">
          <Input v-model="editingCard.owner" style="width: 250px"></Input>
        </FormItem>
        <FormItem :label="$t('AccountInfo.AddressLine1')">
          <Input v-model="editingCard.billingStreet1" style="width: 250px"></Input>
        </FormItem>
        <FormItem :label="$t('AccountInfo.AddressLine2')">
          <Input v-model="editingCard.billingStreet2" style="width: 250px"></Input>
        </FormItem>
        <FormItem :label="$t('AccountInfo.City')">
          <Input v-model="editingCard.billingCity" style="width: 250px"></Input>
        </FormItem>
        <FormItem :label="$t('AccountInfo.State')">
          <Select v-model="editingCard.billingState" style="width: 250px;" filterable :placeholder="$t('AccountInfo.State')">
            <Option v-for="state in states" :value="state.value" :label="state.value" :key="state.value"><span>{{state.value}}</span><span style="float:right;color:#bbbec4">{{state.name}}</span></Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('AccountInfo.ZIP')">
          <Input v-model="editingCard.billingZip" style="width: 250px"></Input>
        </FormItem>
        <FormItem :label="$t('AccountInfo.Country')">
          <Select v-model="editingCard.billingCountry" style="width: 250px;" :placeholder="$t('AccountInfo.Country')">
            <Option v-for="country in countries" :value="country" :key="country">{{country}}</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('AccountInfo.PhoneNumber')">
          <Input v-model="editingCard.billingPhone" style="width: 250px"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<style lang="scss">
.kloudsync-settings-payment {
  height: 100%;
  width: 100%;

  .panel-header {
    width: 100%;
    text-align: left;
    padding: 0 20px;
    height: 65px;
    line-height: 65px;
    position: relative;
    border-bottom: 1px solid #dddee1;
    font-size: 16px;
    font-weight: bold;

    .panel-header-right {
      float: right;
      font-size: 14px;
      font-weight: normal;

      .header-search-wrap {
        display: inline-block;
        width: 200px;
        vertical-align: middle;
        margin-right: 1em;

        .ivu-input {
          border-color: transparent;
        }
      }
    }
  }

  .panel-content-cover {
    padding:24px; 
    background-color: #FBFBFD; 
    min-height: calc(100% - 65px); 
    height: calc(100% - 65px);
    width:100%;
  }

  .setting-content {
    width: 100%;
    height: 100%;
    background: #fff;
    border: 1px solid #dddee1;
    border-radius: 3px;

    .kloudsync-card-expand {
      .ivu-icon-ios-arrow-right:before {
        content: "\F123";  // chevron-down
      }

      .ivu-table-cell-expand-expanded {
        transform: rotate(0);

        .ivu-icon-ios-arrow-right:before {
          content: "\F126"; // chevron-up
        }
      }
    }

    .ivu-table-wrapper {
      border: none;
    }

    .table-action-icon {
      opacity: 0;
      cursor: pointer;
      margin-right: 1em;
    }

    tr:hover .table-action-icon, .ivu-table-row-highlight .table-action-icon {
      opacity: 1;
    }

    .ivu-table th {
      //background-color: #495060;
      //color: white;
      //text-align: center;
      background-color: white;
      color: #80848f;
      border-bottom: 1px solid #dddee1;
    }
  }
}
</style>

<script>
let sampleCreditCards = [
  {cardInfo: 'Visa ending in 1234', expiresMonth: 12, expiresYear: 2020, expiresDate: '12/2020', owner: 'Wolfgang A. Mozart',
    billingName: 'Wolfgang Amadeus Mozart', billingStreet1: '3675 Mt. Diablo Blvd.', billingStreet2: 'Ste 330', billingCity: 'Lafayette', billingState: 'CA', billingZip: '94549', billingCountry: 'United States', billingPhone: '9258713900'},
  {cardInfo: 'MasterCard ending in 5678', expiresMonth: 12, expiresYear: 2022, expiresDate: '12/2022', owner: 'Wolfgang A. Mozart',
    billingName: 'Wolfgang Amadeus Mozart', billingStreet1: '3675 Mt. Diablo Blvd.', billingStreet2: 'Ste 330', billingCity: 'Lafayette', billingState: 'CA', billingZip: '94549', billingCountry: 'United States', billingPhone: '9258713900'}
];

import CreditCardRow from '../profile/CreditCardRow';
import util from "../../common/util.js";

export default {
  data() {
    return {
      searchPayment: '',
      cardsData: sampleCreditCards,
      cardsColumn: [
        {
          type: 'expand',
          width: 50,
          className: 'kloudsync-card-expand',
          render: (h, params) => {
            return h(CreditCardRow, {
              props: {
                index: params.index,
                cardDetail: params.row,
                parentControl: this
              }
            })
          }
        },
        {
          title: this.$t("AccountInfo.CreditCard").toUpperCase(),
          key: 'cardInfo'
        },
        {
          title: this.$t("AccountInfo.Expires").toUpperCase(),
          key: 'expiresDate'
        }
      ],
      modalCard: false,
      months: [],
      years: [],
      states: null,
      countries: [],
      editingCard: {
        creating: false,
        index: -1,
        owner: '',
        number: '',
        expiresMonth: 1,
        expiresYear: 2020,
        billingName: '',
        billingStreet1: '',
        billingStreet2: '',
        billingCity: '',
        billingState: '',
        billingZip: '',
        billingCountry: 'United States',
        billingPhone: ''
      }
    }
  },
  mounted() {
    util.LoadJsFiles(["/static/us_states.js?v=201810011501"]).then(()=>{
      this.states=us_states;        
    });
    for (let i = 1; i <= 12; i++) {
      this.months.push(i);
    }
    for (let i = 0; i < 10; i++) {
      this.years.push(2018 + i);
    }
    this.countries.push('United States');      
  },
  methods: {
    addCreditCard() {
      let today = new Date();

      this.editingCard.creating = true;
      this.editingCard.index = -1;
      this.editingCard.owner = '';
      this.editingCard.number = '';
      this.editingCard.expiresMonth = today.getMonth() + 1;
      this.editingCard.expiresYear = today.getFullYear();
      this.editingCard.billingName = '';
      this.editingCard.billingStreet1 = '';
      this.editingCard.billingStreet2 = '';
      this.editingCard.billingCity = '';
      this.editingCard.billingState = '';
      this.editingCard.billingZip = '';
      this.editingCard.billingCountry = 'United States';
      this.editingCard.billingPhone = '';

      this.modalCard = true;
    },
    editCreditCard(index, card) {
      this.editingCard.creating = false;
      this.editingCard.index = index;
      this.editingCard.owner = card.owner;
      this.editingCard.number = card.number;
      this.editingCard.expiresMonth = card.expiresMonth;
      this.editingCard.expiresYear = card.expiresYear;
      this.editingCard.billingName = card.billingName;
      this.editingCard.billingStreet1 = card.billingStreet1;
      this.editingCard.billingStreet2 = card.billingStreet2;
      this.editingCard.billingCity = card.billingCity;
      this.editingCard.billingState = card.billingState;
      this.editingCard.billingZip = card.billingZip;
      this.editingCard.billingCountry = card.billingCountry;
      this.editingCard.billingPhone = card.billingPhone;

      this.modalCard = true;
    },
    deleteCreditCard(index, card) {
      this.$Modal.confirm({
        title: this.$t("AccountInfo.DeleteCardTitle"),
        content: this.$t("AccountInfo.DeleteCardContent"),
        okText: this.$t("Common.Delete"),
        cancelText: this.$t("Base.Cancel"),
        onOk: () => {
          this.cardsData.splice(index, 1);
        }
      });
    },
    modalCardOK() {
      let card = {
        cardInfo: this.editingCard.number,
        expiresMonth: this.editingCard.expiresMonth,
        expiresYear: this.editingCard.expiresYear,
        expiresDate: this.editingCard.expiresMonth + '/' + this.editingCard.expiresYear,
        owner: this.editingCard.owner,
        billingName: this.editingCard.owner,
        billingStreet1: this.editingCard.billingStreet1,
        billingStreet2: this.editingCard.billingStreet2,
        billingCity: this.editingCard.billingCity,
        billingState: this.editingCard.billingState,
        billingZip: this.editingCard.billingZip,
        billingCountry: this.editingCard.billingCountry,
        billingPhone: this.editingCard.billingPhone
      };

      if (this.editingCard.creating) {
        this.cardsData.push(card);
      }
      else {
        this.cardsData.splice(index, 1, card);
      }

      this.modalCard = false;
    }
  }
}
</script>

