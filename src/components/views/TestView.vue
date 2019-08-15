<template>
  <div id="historyView">
    <div class="paneGutter"></div>
    <div class="panelDetail">
      <Input style='width:500px;' v-model="apimethod"></Input> <Button @click='getData'>Get</Button>

      <div>
        {{resultData}}
      </div>
    </div>
    <div class="paneGutter"></div>
  </div>
</template>

<style lang="scss">
  #historyView{
    background-color: transparent;
    display: -webkit-box;
    display: -moz-box;
    display: box;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    min-height: 1px;
    padding-top: 20px;
    min-width: 785px;
    min-height: 200px;
    width: 100%;

    .paneGutter {
      -webkit-box-flex: 1;
      -moz-box-flex: 1;
      box-flex: 1;
      -webkit-flex: 1 0 20px;
      -moz-flex: 1 0 20px;
      -ms-flex: 1 0 20px;
      flex: 1 0 20px;
    }

    .panelDetail {
      -webkit-box-flex: 5500;
      -moz-box-flex: 5500;
      box-flex: 5500;
      -webkit-flex: 5500 1 500px;
      -moz-flex: 5500 1 500px;
      -ms-flex: 5500 1 500px;
      flex: 5500 1 500px;
      max-width: 1500px;
      min-width: 500px;

      background-color: #FFFFFF;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      border-radius: 3px;
    }
  }
</style>

<script>
  import auth from '../../authenticator';

  export default {
    data: function () {
      return {
        loading: false,
        apimethod: 'data/CourseList',
        resultData: ''
      };
    },
    methods: {
      getData() {
        let self = this;
        
        let url = GetAPIUrl() + this.apimethod;
        this._getData(url, null, (result) => {
          self.resultData = JSON.stringify(result);
        }, null);
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
    }
  }
</script>
