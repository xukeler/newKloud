<template>
  <div class="course-publish-class">

    <div class="v-2">
      <div v-show="currentStep === 0">
        <section style="line-height: 2em; padding: 2em;">
          <h3 style="color:#2b85e4; padding-bottom: 0.5em;">Would you like to publish your course on Peertime.com?</h3>
          <p>High-quality teaching material is the foundation and accelerator of your education business. At Peertime, tutors can not only optimize their current materials to a higher level, but also adapt great materials provided by others. The better materials you have, the higher rank you will be in Peertime system. Plus, you will earn more when your course is purchased by others!</p>
        </section>
        <div style="text-align: center;">
          <Button type="primary" size="large" @click="handleApply">Submit for publish</Button>
        </div>
      </div>

      <div v-show="currentStep === 1" style="font-size: 24px; line-height: 2em; padding: 1em;">
        <div style="text-align: center">
          <p><Icon type="checkmark-circled" size="96" color="#2d8cf0"></Icon></p>
          <p>Your course will be reviewed soon. You can check status under Publish section.</p>
          <p>Thank you for your patience in advance!</p>
        </div>

        <div style="margin-top: 2em; text-align: right; padding-right: 10em;">
          <Button type="primary" size="large" @click="handleFinish">Finish</Button>
        </div>
      </div>

      <div v-show="currentStep > 1">
        <table class="result-table">
          <tr>
            <th>Submission</th>
            <th>Start Review</th>
            <th>Status</th>
            <th>Comment</th>
          </tr>
          <tr>
            <td>{{createDate}}</td>
            <td>{{reviewDate}}</td>
            <td style="padding: 0.5em 1em;"><Tag color="blue">REVIEWING</Tag></td>
            <td>{{comment}}</td>
          </tr>
        </table>
      </div>
    </div>

  </div>
</template>

<style lang="scss">
  .course-publish-class {
    $images-root: "../../../static/images/";

    $sample-file-width: 90px;
    $sample-file-height: 90px;

    padding-top: 1em;

    .sample-file-list{
      margin: 0.5em;
      padding: 1em;
      border: 2px solid #dddee1;
      border-radius: 0.5em;

      min-height: 250px;

      .sample-file{
        display: inline-block;
        height: 150px;
        width: 150px;
        //line-height: $sample-file-height * 1.5;
        text-align: center;
        //border: 1px solid transparent;
        //border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        margin: 4px;
        //box-shadow: 0 1px 1px rgba(0,0,0,.2);
      }
      .sample-file-thumbnail{
        display: inline-block;
        width: $sample-file-width;
        height: $sample-file-height;
      }
      .file {
        background-image: url($images-root + 'file.svg');
        background-size: $sample-file-width $sample-file-height;
      }
      .upload-file {
        background-image: url($images-root + 'upload-file.svg');
        background-size: $sample-file-width $sample-file-height;
      }
      .sample-file-cover{
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        line-height: 75px;
        background: rgba(0,0,0,.6);
        text-align: center;
      }
      .sample-file:hover .sample-file-cover{
        display: block;
      }
      .sample-file-cover i{
        color: #fff;
        font-size: 30px;
        cursor: pointer;
        margin: 0 16px;
      }
    }

    .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
      padding-left: 1.5em;

      .ivu-icon {
        margin-right: 1em;
      }
    }

    .section-header {
      font-size: larger;
      font-weight: bolder;
      line-height: 2em;

      i {
        vertical-align: text-top;
        margin-right: 5px;
      }
    }

    .section-content {
      padding: 1em;
      margin-bottom: 1em;
    }

    .result-table{
      width: 90%;
      margin: 2em auto;
      border-spacing: 0;

      th, td {
        border: 1px solid white;
      }

      th {
        background-color: #5cadff;
        color: white;
        line-height: 2em;
        padding: 0 1em;
        text-align: center;
        font-weight: bolder;
      }

      td {
        background-color: #f8f8f9;
        color: #1c2438;
        line-height: 2em;
        padding: 0 1em;
        text-align: center;
      }

      td:not(:last-of-type){
        width: 15%;
        max-width: 120px;
      }
    }
  }
</style>

<script>
  import auth from '../../authenticator';
  import LectureList from './LectureList'

  export default {
    components: {
      LectureList
    },
    props: {
      isSchool: {
        type: Boolean,
        default: false
      },
      courseId: Number
    },
    data() {
      return {
        loading: false,
        currentStep: 0,
        createDate: (new Date()).toLocaleDateString(),
        reviewDate: (new Date()).toLocaleDateString(),
        comment: 'Too early to say.'
      };
    },
    methods: {
      initialize() {
      },
      readData() {

      },
      saveData() {

      },
      handleApply: function () {
        this.currentStep++;
      },
      handleFinish: function () {
        this.currentStep++;
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
      _postData(url, data, before, success, error) {
        if (before && typeof before === 'function') {
          before();
        }

        this.loading = true;
        this.$Loading.start();

        let self = this;
        $.ajax({
          type: 'POST',
          url: url,
          contentType: 'application/json; charset=utf-8',
          dataType: 'text',
          data: JSON.stringify(data),
          beforeSend: function (request) {
            request.setRequestHeader("UserToken", auth.getUserToken());
          },
          success: function (resultString) {
            let result = JSON.parse(resultString);
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
      _deleteData(url, before, success, error) {
        if (before && typeof before === 'function') {
          before();
        }

        this.loading = true;
        this.$Loading.start();

        let self = this;
        $.ajax({
          type: 'DELETE',
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
      }
    }
  }
</script>
