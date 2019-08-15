<template>
  <div class="course-audience">
    <div class="header-part">
      <span class="header-label"> {{ headerLabel }} </span>
      <Button type="text" size="large" icon="plus-round">{{$t('CourseTeachers.Invite')}}</Button>
    </div>

    <div class="context-part">
      <div class="audience-item" v-for="(audience, $index) in allAudience" v-if="$index < 3">
        <Avatar size="large" :src="audience.AvatarUrl"></Avatar>
        <span class="audience-name">{{audience.Name}}</span>
        <span class="audience-status">{{$t('CourseAudience.Free')}}</span>
      </div>
    </div>

    <div class="footer-part">
      {{$t('CourseAudience.Paid')}}: 2, {{$t('CourseAudience.Free')}}: 3, {{$t('CourseAudience.Invited')}}: 5
    </div>
  </div>
</template>

<style lang="scss">
  .course-audience {
    button {
      color: #0061BB;
      padding:0;
    }

    .header-part {
      .header-label {
        font-weight: bold;
      }

      button {
        float: right;
      }
    }

    .context-part {
      padding: 10px;
      background-color: #eeeeee;
      margin-top: 5px;

      .audience-item {
        display: inline-block;
        position: relative;
        margin: 0 10px;

        .audience-name {
          position: relative;
          top: -1em;
          color: #0061BB;
        }

        .audience-status {
          position: absolute;
          top: 20px;
          left: 46px;
        }
      }
    }

    .footer-part {
      padding: 5px;
      background-color: #eeeeee;
      margin-top: 5px;
      font-weight: bold;
      text-align: center;
    }
  }
</style>

<script>
  import friends from '../../friends';

  export default {
    props: ["headerLabel"],
    data() {
      return {
        allAudience: []
      };
    },
    mounted() {
      this.readAudience();
    },
    methods: {
      readAudience: function () {
        let self = this;
        friends.getFriends(function (users) {
          self.allAudience = users;
        });
      }
    }
  }
</script>
