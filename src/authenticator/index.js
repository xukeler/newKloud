import router from '../router/index';
import friends from '../friends';
import cn from '../lang/cn.js';
import en from '../lang/en.js';

const LOGIN_URL = GetAPIUrl() + 'Login?';
const REGISTER_URL = GetAPIUrl() + 'User/Register4Web';
var MyStorage = sessionStorage;
export default {
  // User object will let us check authentication status
  user: {
    authenticated: false
  },  
  // Send a request to the login URL and save the returned JWT
  login(context, credentials, redirect, callback) {

    let url = LOGIN_URL + "login=" + encodeURIComponent(credentials.username) + "&password=" + encodeURIComponent(base64encode(credentials.password)) + "&encryptOption=1";
    url += "&DeviceType=1&DeviceName=" + encodeURIComponent(base64encode($.browser.name + " " + $.browser.version));
    context.$http.get(url).then(response => {
      if (response.ok) {
        let result = response.body;
        if (parseInt(result.RetCode) === 0) {
          let data = result.RetData;
          this.saveLoginInfo(data);
          context.$cookie.set('UserToken', data.UserToken, 1);
          this.user.authenticated = true;

          // Redirect to a specified route
          if (callback)
            callback(true);
 
          if (redirect) {
            this.loadCompanies(data.UserToken).then((res)=>{
              if (res && IsKloudSync()){
                if (res.InvitationList.length != 0){
                  redirect = { name: "kloudsync-invitation-notice" };
                } else if (res.InvitationList.length == 0 && !res.HaveComany){
                  redirect = { name: "kloudsync-create-company" };
                }
              }
              router.push(redirect);
            })
          }
        }
        else {
          if (callback)
            callback(false);

          context.error = result.ErrorMessage;
          console.log(result);
        }
      }
      else {
        if (callback)
          callback(false);

        context.error = statusText;
        console.log(response);
      }
    }, error => {
      if (callback)
        callback(false);

      context.error = error;
      console.log(error);
    });
  },
  
  loadCompanies(UserToken) {
    return new Promise((resolve, reject) => {
      let url = GetAPIUrl() + 'Invite/CompanyInvitations';
      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function (request) {
          request.setRequestHeader("UserToken",UserToken);
        },
        success: function (data) {
          if (data.RetCode === 0 && data.RetData) {
            resolve(data.RetData);
          }else{
            resolve(null);
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          console.log(xhr);
          resolve(null);
        }
      });
    });
  },
  loginWithToken(token,callback)
  {
    var url = GetAPIUrl() + "User/LoginAccount";
    var result = false;
    $.ajax({
      type: 'GET',
      async: false,
      url: url,
      beforeSend: (request)=>
      {
        request.setRequestHeader("UserToken", token);
      },
      success: (data)=>
      {
        if (data.RetCode == 0)
        {
          this.saveLoginInfo(data.RetData);
          //context.$cookie.set('UserToken', token, 1);
          this.user.authenticated = true;          
          result = true;
          if (callback) callback(true);
        }
        else
        {
          //this.logout(context);
          if (callback) callback(false);
          result = false;
        }
      },
      error: (xhr, ajaxOptions, thrownError)=>
      {
        console.log(xhr);
        if (callback) callback(false);
        result = false;
      }
    });
    return result;
  },
  loginWithEncryptUserid(encryptUserID,callback)
  {
    var url = GetAPIUrl() + "Login/LoginWithEncryptUserID?encryptUserID="+encodeURIComponent(encryptUserID)+"&DeviceType=1&DeviceName=" + encodeURIComponent(base64encode($.browser.name + " " + $.browser.version));;
    var result = false;
    $.ajax({
      type: 'GET',
      async: false,
      url: url,
      success: (data)=>
      {
        if (data.RetCode == 0)
        {
          this.saveLoginInfo(data.RetData);
          this.user.authenticated = true;          
          result = true;
          if (callback) callback(true);
        }
        else
        {
          if (callback) callback(false);
          result = false;
        }
      },
      error: (xhr, ajaxOptions, thrownError)=>
      {
        console.log(xhr);
        if (callback) callback(false);
        result = false;
      }
    });
    return result;
  },

  saveLoginInfo(data)
  {
    MyStorage.setItem('UserToken', data.UserToken);
    MyStorage.setItem('UserData.UserID', data.UserID);
    MyStorage.setItem('UserData.Name', data.Name);
    MyStorage.setItem('UserData.Mobile', data.Mobile);
    MyStorage.setItem('UserData.Type', data.Type);
    MyStorage.setItem('UserData.ExpirationDate', data.ExpirationDate);
    MyStorage.setItem('UserData.ClassRoomID', data.ClassRoomID);
    MyStorage.setItem('UserData.Role', data.Role);
    MyStorage.setItem('UserData.CustomerID', data.CustomerID);
    MyStorage.setItem('UserData.SchoolID', data.SchoolID);
    MyStorage.setItem('UserData.SchoolType', data.SchoolCategory1);

    MyStorage.setItem("chosenSchoolId", data.CustomerID) ;
    MyStorage.setItem("UserData.IsAdmin", data.IsAdmin);
    
    if (data.EncryptUserID)
    {
      localStorage.setItem("UserData.MyID",data.EncryptUserID);  
    }

    let names = data.Name.split(" ");
    let initial = '';
    for (let i = 0; i < names.length; i++)
    {
      if (names[i].length > 0)
        initial += names[i].charAt(0).toUpperCase();
    }
    MyStorage.setItem('UserData.InitialName', initial);
  },
  //记住信息 FieldID：10001代表记住的登陆信息
  MemorizeOrganization(FieldID1, schoolID, teamId, schoolName, teamName,SpaceID,SpaceName) {
    let self = this;
    return new Promise((resolve, reject) => {
      let url = GetAPIUrl() + 'User/AddOrUpdateUserPreference';
      let PreferenceTextInfo = {
        "SchoolID": schoolID,
        "TeamID": teamId,
        "SchoolName": schoolName,
        "TeamName": teamName,
        "SpaceID": SpaceID,
        "SpaceName":SpaceName
      };
      PreferenceTextInfo = JSON.stringify(PreferenceTextInfo);
      let data = {
        FieldID: FieldID1,
        PreferenceText: PreferenceTextInfo,
        PreferenceValue: -1,
        PreferenceMemo: ""
      };
      let sessionid = self.getUserToken();
      $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        beforeSend: function (request) {
          request.setRequestHeader("UserToken", sessionid);
        },
        success: function (data) {
          MyStorage.setItem("chosenSchoolId", parseInt(schoolID));
          MyStorage.setItem("KloudsyncOrganizationName", schoolName);
          let teamParam = {
            "teamId": teamId,
            "teamName": teamName
          };

          let spaceParam = {
            "spaceID": SpaceID,
            "spaceName": SpaceName
          }
          MyStorage.setItem("KloudsyncTeamparam", JSON.stringify(teamParam));
          MyStorage.setItem("KloudsyncSpaceparam", JSON.stringify(spaceParam));
          resolve(data);
        }
      });
    });
  },
  //获取已经记住的信息 FieldID：10001代表记住的登陆信息
  getKLoudsyncMemorizeOrganization(FieldID){
      return new Promise((resolve,reject)=>{
        var sessionid = this.getUserToken();
        var url = GetAPIUrl() + "User/GetUserPreference?fieldID=" + FieldID;
        $.ajax({
          type: "GET",
          url: url,
          beforeSend: function (request) {
            request.setRequestHeader("UserToken", sessionid);
          },
          success: function (data) {
            if (data.RetCode === 0 && data.RetData) {
              let result;
              try {
                result = JSON.parse(data.RetData.PreferenceText);
              } catch (error) {
                console.log('error：' + error);
              }
              if(result){
                MyStorage.setItem("chosenSchoolId", parseInt(result.SchoolID));
                MyStorage.setItem("KloudsyncOrganizationName", result.SchoolName);

                let teamParam = {
                  "teamId": result.TeamID,
                  "teamName": result.TeamName
                };

                let spaceParam = {
                  "spaceID": result.SpaceID,
                  "spaceName": result.SpaceName
                }
                MyStorage.setItem("KloudsyncTeamparam", JSON.stringify(teamParam));
                MyStorage.setItem("KloudsyncSpaceparam", JSON.stringify(spaceParam));
              }
            } else {
              let CustomerID = MyStorage.getItem('UserData.CustomerID');
              MyStorage.setItem("chosenSchoolId", CustomerID);
            }
            resolve(data.RetData);
          },
          error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
            resolve(null);
          }
        });

      })
  },
  //获取kloudsync记住的机构名称
  getKloudsyncOrganizationName(){
    return MyStorage.getItem("KloudsyncOrganizationName")
  },
  getKloudsyncTeamparam(){
    return JSON.parse(MyStorage.getItem("KloudsyncTeamparam"));
  },
  getKloudsyncSpaceparam() {
    return JSON.parse(MyStorage.getItem("KloudsyncSpaceparam"));
  },
  register(context, credentials, redirect, callback) {
    let url = REGISTER_URL;
    context.$http.post(url, credentials).then(response => {
      if (response.ok) {
        let result = response.body;
        if (parseInt(result.RetCode) === 0) {
          let data = result.RetData;

          MyStorage.setItem('UserToken', data.UserToken);
          MyStorage.setItem('UserData.UserID', data.UserID);
          MyStorage.setItem('UserData.Name', data.Name);
          MyStorage.setItem('UserData.Mobile', data.Mobile);
          MyStorage.setItem('UserData.Type', data.Type);
          MyStorage.setItem('UserData.ExpirationDate', data.ExpirationDate);
          MyStorage.setItem('UserData.ClassRoomID', data.ClassRoomID);
          MyStorage.setItem('UserData.Role', data.Role);
          MyStorage.setItem('UserData.CustomerID', data.CustomerID);
          MyStorage.setItem('UserData.SchoolID', data.SchoolID);

          MyStorage.setItem("chosenSchoolId", data.CustomerID) ;

          let names = data.Name.split(" ");
          let initial = '';
          for (let i = 0; i < names.length; i++) {
            if (names[i].length > 0)
              initial += names[i].charAt(0).toUpperCase();
          }
          MyStorage.setItem('UserData.InitialName', initial);

          context.$cookie.set('UserToken', data.UserToken, 1);

          this.user.authenticated = true;

          // Redirect to a specified route
          if (callback)
            callback(true);

          if (redirect && !IsKloudSync()) {
            router.push(redirect);
          }
        }
        else {
          if (callback)
            callback(false);

          context.handleServerError(result);
          console.log(result);
        }
      }
      else {
        if (callback)
          callback(false);

        context.handleSystemError(response);
        console.log(response);
      }
    }, error => {
      if (callback)
        callback(false);

      context.handleSystemError(error);
      console.log(error);
    });
  },

  // To log out, we just need to remove the token
  logout(context) {
    this.clear();
    context.$cookie.delete('UserToken');
    this.user.authenticated = false;

    friends.clear();
  },
  clear() {
    //not need remove setting
    MyStorage.removeItem('UserToken');
    MyStorage.removeItem('UserData.UserID');
    MyStorage.removeItem('UserData.Name');
    MyStorage.removeItem('UserData.Mobile');
    MyStorage.removeItem('UserData.Type');
    MyStorage.removeItem('UserData.ExpirationDate');
    MyStorage.removeItem('UserData.ClassRoomID');
    MyStorage.removeItem('UserData.Role');
    MyStorage.removeItem('UserData.CustomerID');
    MyStorage.removeItem('UserData.InitialName');
    MyStorage.removeItem('UserData.SchoolID');

    MyStorage.removeItem("chosenSchoolId");
    MyStorage.removeItem("UserData.IsAdmin");

    MyStorage.removeItem("KloudsyncOrganizationName");

    localStorage.removeItem("UserData.MyID");
  },
  checkAuth() {
    let jwt = MyStorage.getItem('UserToken');
    if (jwt) {
      this.user.authenticated = true
    }
    else {
      this.user.authenticated = false
    }

    return this.user.authenticated;
  },

  getUserToken() {
    return MyStorage.getItem('UserToken');
  },

  getUserInitial() {
    return MyStorage.getItem('UserData.InitialName');
  },

  getUserID() {
    return MyStorage.getItem('UserData.UserID');
  },
  getUserIDEx() {
    return MyStorage.getItem('UserData.UserID').replace("-", "");
  },

  getUserName() {
    return MyStorage.getItem('UserData.Name');
  },
  setUserName(name) {
    MyStorage.setItem('UserData.Name', name);
    let initial = '';
    for (let i = 0; i < name.length; i++) {
      if (name[i].length > 0)
        initial += name[i].charAt(0).toUpperCase();
    }
    MyStorage.setItem('UserData.InitialName', initial);
  },

  getMobile() {
    return MyStorage.getItem('UserData.Mobile');
  },
  getClassroomID()
  {
    return MyStorage.getItem('UserData.ClassRoomID').toUpperCase();
  },
  setClassroomID(classroom) {
    MyStorage.setItem('UserData.ClassRoomID', classroom.toUpperCase());
  },

  getRole() {
    return MyStorage.getItem('UserData.Role');
  },
  setRole(role) {
    MyStorage.setItem('UserData.Role', role);
  },
  getCustomerID() {
    return MyStorage.getItem('UserData.CustomerID');
  },
  getSchoolID()
  {
    return this.getChosenSchoolId();
    return MyStorage.getItem('UserData.SchoolID');
  },

  SchoolRole: {
    Unknown: 0,
    Prospects: 1,
    Students: 2,
    Parents: 3,
    IndependentTeachers: 4,
    OfficeTeacher: 5,
    OfficeStaff: 6,
    Admin: 7,
    Owner: 8,
    Teachers: '4,5,6,7,8',//'4,5',
    Employees: '5,6,7,8'
  },
  getSchoolRoleName(role) {
    var LanguageFlg = localStorage.getItem("Language") && localStorage.getItem("Language") == "cn" ? true : false;
    var LanguageObj;
    if (LanguageFlg){
      LanguageObj = cn;
    }else{
      LanguageObj = en;
    }
      switch (role) {
        case 1:
          return LanguageObj.authJs.Prospect;
        case 2:
          return LanguageObj.authJs.Student;
        case 3:
          return LanguageObj.authJs.Parent;
        case 4:
          return LanguageObj.authJs.Teacher;
        case 5:
          return LanguageObj.authJs.Teacher;
        case 6:
          return LanguageObj.authJs.OfficeStaff;
        case 7:
          return LanguageObj.authJs.Administrator;
        case 8:
          return LanguageObj.authJs.Owner;

        default:
          return LanguageObj.authJs.Unknown;
    }
  },
  Privilege: {
    NoAccess: 0,
    View: 1,
    EditView: 2,
    CreateEditView: 3,
    DeleteCreateEditView: 4
  },
  getPrivilegeName(privilege) {
    var LanguageFlg = localStorage.getItem("Language") && localStorage.getItem("Language") == "cn" ? true : false;
    var LanguageObj;
    if (LanguageFlg) {
      LanguageObj = cn;
    } else {
      LanguageObj = en;
    }
    switch (privilege) {
      default:
      case 0:
        return LanguageObj.AddContact.NoAccess;
      case 1:
        return LanguageObj.AddContact.ViewOnly;
      case 2:
        return LanguageObj.AddContact.EditView;
      case 3:
        return LanguageObj.AddContact.CreateEditView;
      case 4:
        return LanguageObj.AddContact.DeleteCreateEditView;
    }
  },

  canViewContact(privilege) {
    return privilege >= this.Privilege.View;
  },
  canEditContact(privilege) {
    return privilege >= this.Privilege.EditView;
  },
  canCreateContact(privilege) {
    return privilege >= this.Privilege.CreateEditView;
  },
  canDeleteContact(privilege) {
    return privilege >= this.Privilege.DeleteCreateEditView;
  },

  canViewCourse(privilege) {
    return privilege >= this.Privilege.View;
  },
  canEditCourse(privilege) {
    return privilege >= this.Privilege.EditView;
  },
  canCreateCourse(privilege) {
    return privilege >= this.Privilege.CreateEditView;
  },
  canDeleteCourse(privilege) {
    return privilege >= this.Privilege.DeleteCreateEditView;
  },

  getSchoolType() {
    return parseInt(MyStorage.getItem("UserData.SchoolType"));
  },
  setSchoolType(type) {
    MyStorage.setItem("UserData.SchoolType", type) ;
  },

  setChosenSchoolId(id){
    MyStorage.setItem("chosenSchoolId", id) ;
  },
  getChosenSchoolId(){
    if (IsKlassroom()) {
      return parseInt(MyStorage.getItem("chosenSchoolId"));
    }
    else if (IsKloudSync()) {
      // return 3255; //临时默认Peertime Founder's Group的学校。3255
      parseInt(MyStorage.getItem("chosenSchoolId"))
    }
    return parseInt(MyStorage.getItem("chosenSchoolId"));
  },
  getAdminFlag(){
    return MyStorage.getItem('UserData.IsAdmin');
  },
  isTeacher() {
    if (this.getRole() === '1')
      return true;

    return false;
  },
  setMeetingCurrentTab(currentTab){
    MyStorage.setItem("meetingCurrentTab", currentTab);
  },
  getMeetingCurrentTab(){
    return MyStorage.getItem("meetingCurrentTab");
  },
  setIsShowGrading(val){
    MyStorage.setItem("Homework.SyncRoom", val);
  },
  getIsShowGrading(){
    return MyStorage.getItem("Homework.SyncRoom");
  },
  setRememberCourse(val){
    localStorage.setItem("business.course", val);
  },
  getRememberCourse(){
    return localStorage.getItem("business.course");
  }
}
