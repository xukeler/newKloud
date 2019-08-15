<template>
  <div class="homework-grading">
    <Poptip v-model="visible" placement="bottom-end">
      <Button type="success" shape="circle" size="large">Grading</Button>
      <div slot="title">
        <span style="color:red;font-size:18px;">
          满分100分
        </span>
      </div>
      <div slot="content">
          <div>
            <Input v-model="grading" placeholder="请输入分数" style="width: 300px"></Input>
          </div>
          <div style="display:flex;justify-content:center;margin-top:30px;">
            <Button type="primary" @click="submitGrading">{{$t('Base.OK')}}</Button>
            <Button style="margin-left:20px;" @click="close">{{$t('Base.Cancel')}}</Button>
          </div>
      </div>
    </Poptip>
  </div>
</template>
<style lang="scss">
.homework-grading{
  span{
    display: inline-block;
  }
}
</style>
<script>
  export default {
    data(){
      return{
        visible: false,
        grading:'',
      }
    },
    methods: {
      close(){
        this.visible = false;
      },
      submitGrading(){
        if(!this.grading){
          this.$Message.warning({content:'请输入分数',duration:3});
          return;
        }

        if(!isNaN(Number(this.grading))){
          let grading = Number(this.grading);
          if(grading<0 || grading>100){
            this.$Message.warning({content:'请输入有效的分数',duration:3});
            return;
          }
        }else{
          this.$Message.warning({content:'请输入有效的分数',duration:3});
          return;
        }
      }
    }
  };
</script>
