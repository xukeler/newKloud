import auth from '../../authenticator';
import axios from '../axios.js';

export default {
  getAjax(url) {
    return new Promise((resolve, reject) => {
      axios.get(url).then(res => {
        resolve(res.data);
      }).catch(err => {
        console.log(err);
        resolve(null);
      });
    });
  },
  postAjax(url, obj) {
    return new Promise((resolve, reject) => {
      axios.post(url, obj).then(res => {
        resolve(res.data);
      }).catch(err => {
        resolve(null);
      });
    });
  },
  delAjax(url) {
    return new Promise((resolve, reject) => {
      axios.delete(url).then(res => {
        resolve(res.data);
      }).catch(err => {
        console.log(err);
        resolve(null);
      });
    });
  },
  async getCompanyRole(schoolId) {
    let url = GetAPIUrl() + "SchoolContact/Item?schoolID=" + schoolId +"&userID=" + auth.getUserID();
    var result = await this.getAjax(url);
    if (!result.RetData || result == "" || !result.RetData.Role) {
      return 0;
    } else {
      return result.RetData.Role;
    } 
  },
  async loadCompanies() {
    let url = GetAPIUrl() + 'Invite/CompanyInvitations';
    var result = await this.getAjax(url);
    if (!result.RetData || result == "") {
      return "";
    } else {
      return result.RetData;
    }
  },

}
