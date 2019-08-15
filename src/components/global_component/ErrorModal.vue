<template>
  <div class="error-modal">
    <Modal v-model="errorModal" :title="errorTitle" :closable="true" :mask-closable="false"  width="400" style="z-index:900;position: absolute;">
      <div style="padding-bottom:20px;font-size:13px;">
        <div style="text-align:center;">
          <p><span class="icon icon-alert" style="font-size:56px;color:red;"></span></p>
          <p style="color:red;font-size:14px;">{{errorContent}}</p>
        </div>
      </div>
      <div slot="footer" style="height:35px;text-align:center;">
        <Button type="primary" @click="errorModal=false">{{$t('Base.OK')}}</Button>
      </div>
    </Modal>
  </div>
</template>
<style lang="scss">
</style>
<script>
  export default {
    data: function ()
    {
      return {
        errorModal:false,
      }
    },
    props:{
      errorTitle:{
        type: String,
        default: ""
      },
      errorContent:{
        type: String,
        default: ""
      },
    },
    mounted: function ()
    {
    },
    computed:
    {
    },
    methods: {
      initial(){
        this.errorModal = true;
      }
    },
  }
</script>
