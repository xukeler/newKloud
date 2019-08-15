import auth from '../authenticator';

export default {
  sortFriends:{
    loaded: false,
    list: []
  },
  friends: {
    loaded: false,
    list:[]
  },
  getFriendsSortList(callback) {
    if (this.sortFriends.loaded) {
      if (callback)
        callback(this.sortFriends.list);
      return;
    }

    let self = this;

    let url = GetAPIUrl() + "Friend/SortedFriendList";
    $.ajax({
      type: 'Get',
      url: url,
      beforeSend: function (request) {
        request.setRequestHeader("UserToken", auth.getUserToken());
      },
      success: function (result) {
        if (result.RetCode === 0) {
          //console.log(JSON.stringify(result.RetData));
          self.sortFriends.loaded = true;
          self.sortFriends.list = result.RetData;
          if (callback)
            callback(self.sortFriends.list);
        }
        else { // error
          // console.log(data);
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr);
      }
    });
  },
  getFriends(callback) {
    if (this.friends.loaded) {
      if (callback)
        callback(this.friends.list);
      return;
    }

    let self = this;

    let url = GetAPIUrl() + "Friend/FriendList";
    $.ajax({
      type: 'Get',
      url: url,
      beforeSend: function (request) {
        request.setRequestHeader("UserToken", auth.getUserToken());
      },
      success: function (result) {
        if (result.RetCode === 0) {
          //console.log(JSON.stringify(result.RetData));

          self.friends.loaded = true;
          self.friends.list = result.RetData;
          self.friends.list.sort(function (a, b) {
            if (a.Name < b.Name) {
              return -1;
            }
            if (a.Name > b.Name) {
              return 1;
            }
            return 0;
          });

          if (callback)
            callback(self.friends.list);
        }
        else { // error
          console.log(data);
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr);
      }
    });
  },
  clear() {
    this.friends.loaded = false;
    this.friends.list = [];
    this.sortFriends.loaded = false;
    this.sortFriends.list = [];
  },
  getFriend(id) {
    let friend = null;

    if (this.friends.loaded) {
      for (let i = 0; i < this.friends.list.length; i++) {
        if (this.friends.list[i].UserID === id) {
          friend = this.friends.list[i];
          break;
        }
      }
    }

    return friend;
  }
}
