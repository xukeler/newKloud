<template>
  <div>
    <Row>
      <Col span="12">
        <p><b>{{$t("AccountInfo.NameOnCard")}}</b></p>
        <p>{{cardDetail.owner}}</p>
      </Col>
      <Col span="12">
        <p><b>{{$t("AccountInfo.BillingAddress")}}</b></p>
        <p>{{cardDetail.billingName}}</p>
        <p>{{cardDetail.billingStreet1}} {{cardDetail.billingStreet2}}</p>
        <p>{{cardDetail.billingCity}} {{cardDetail.billingState}} {{cardDetail.billingZip}}</p>
        <p>{{cardDetail.billingCountry}}</p>
        <p>{{cardDetail.billingPhone}}</p>
      </Col>
    </Row>

    <div style="text-align: right">
      <Button type="primary" @click="handleEdit">{{$t("Common.Edit")}}</Button>
      <Button type="error" @click="handleDelete">{{$t("Common.Delete")}}</Button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      index: Number,
      cardDetail: Object,
      parentControl: Object
    },
    methods: {
      handleEdit() {
        if (this.parentControl)
          this.parentControl.editCreditCard(this.index, this.cardDetail)
      },
      handleDelete() {
        if (this.parentControl)
          this.parentControl.deleteCreditCard(this.index, this.cardDetail)
      }
    }
  };
</script>
