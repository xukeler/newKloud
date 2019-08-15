export default
  {
    _isShowLog: false,
    _isGetSetting:false,
    log(msg)
    {
      if (this.isShow())
      {
        if (arguments.length == 1)
        {
          console.log(msg);
        }
        else
        {
          console.log(this.getmsg(arguments));
        }
      }
    },
    warn(msg)
    {
      if (this.isShow())
      {
        console.warn(this.getmsg(arguments));
      }
    },
    error(msg)
    {
      if (this.isShow())
      {
        console.error(this.getmsg(arguments));
      }
    },
    info(msg)
    {
      if (this.isShow())
      {
        console.info(this.getmsg(arguments));
      }
    },
    clear()
    {
       console.clear();
    },
    getmsg(args)
    {
      if (args.length == 1)
      {
        return args[0];
      }
      var txt = "";
      for (var i = 0; i < args.length; i++)
      {
        if (i > 0)
        {
          txt+=","
        }
        txt += args[i];
      }
      return new Date().toLocaleTimeString()+" "+ txt;
    },
    isShow()
    {
      //return false;
      let enabelog = localStorage.getItem('EnableLog');
      if (enabelog && enabelog == "1")
      {
        return true;
      }
      return false;
      if (this._isGetSetting)
      {
        return this._isShowLog;
      }
      else
      {
        this.getSetting();
        return false;
      }
    },
    getSetting()
    {
      this._isGetSetting = true;
      //this._isShowLog = true;
      //return;
      var url = "https://pv.sohu.com/cityjson?ie=utf-8";
      $.ajax({
        type: 'GET',
        url: url,
        timeout: 3000,
        dataType: "jsonp",
        jsonpCallback: "showData",
        success: (data)=>
        {
            this._isGetSetting = true;
            if (returnCitySN && returnCitySN.cip) {
                this._isShowLog = returnCitySN.cip == "101.231.103.198"|| returnCitySN.cip == "61.148.17.246";
            }
            else {
                this._isShowLog = false;
            }
          
        },
        error: (xhr, ajaxOptions, thrownError)=>
        {
            this._isGetSetting = true;
            if (returnCitySN && returnCitySN.cip) {
                this._isShowLog = returnCitySN.cip == "101.231.103.198" || returnCitySN.cip == "61.148.17.246";
            }
            else {
                this._isShowLog = false;
            }
          
        }
      });
    }
  }
