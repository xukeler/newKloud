<template>
  <div id="user-profile-account">
    <div class="credit-card-part">
      <div class="part-header">{{$t("AccountInfo.CreditCardInformation")}}
        <div class="part-action-button">
          <Button type="text" icon="plus-round" @click="handleAddCreditCard">{{$t("AccountInfo.AddNewCard")}}</Button>
        </div>
      </div>

      <credit-card-list ref="creditCardList" :cardsData="creditCards"></credit-card-list>
    </div>

    <div>

    </div>
  </div>
</template>

<style lang="scss">
  #user-profile-account {

    .part-header {
      font-size: larger;
      font-weight: bold;
      margin-bottom: 0.2em;
      color: #1c2438;
    }

    .part-action-button {
      float: right;
      .ivu-btn-text {
        padding: 3px;
      }
    }

    .credit-card-part {
      margin-bottom: 1.5em;
    }
  }
</style>

<script>
  import CreditCardList from './CreditCardList';

  export default {
    components: { CreditCardList },
    data() {
      return {
        school: {
          name: 'Mozart in the jungle',
          type: '0',
          owner: '0',
          admin: '0'
        },
        creditCards: [
          {cardInfo: 'Visa ending in 1234', expiresMonth: 12, expiresYear: 2020, expiresDate: '12/2020', owner: 'Wolfgang A. Mozart',
            billingName: 'Wolfgang Amadeus Mozart', billingStreet1: '3675 Mt. Diablo Blvd.', billingStreet2: 'Ste 330', billingCity: 'Lafayette', billingState: 'CA', billingZip: '94549', billingCountry: 'United States', billingPhone: '9258713900'},
          {cardInfo: 'MasterCard ending in 5678', expiresMonth: 12, expiresYear: 2022, expiresDate: '12/2022', owner: 'Wolfgang A. Mozart',
            billingName: 'Wolfgang Amadeus Mozart', billingStreet1: '3675 Mt. Diablo Blvd.', billingStreet2: 'Ste 330', billingCity: 'Lafayette', billingState: 'CA', billingZip: '94549', billingCountry: 'United States', billingPhone: '9258713900'}
        ],
      }
    },
    methods: {
      initialize() {

      },
      readData() {

      },
      saveData() {

      },
      handleAddCreditCard() {
        this.$refs.creditCardList.addCreditCard();
      }
    }
  }
</script>
