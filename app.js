//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {

    userInfo: null,

    NLPAppkey:'GgItq8oGlltU4TyljaUBK6ct',

    NLPAppSecret:'0BOyt5qHHSg5TxUQkRd8GPevkemkMzPk ',

		NLPUrl:'https://aip.baidubce.com/rpc/2.0/unit/service/chat?access_token=',

		NLPCusid: '',

		SESSION_ID:'',//回话session_id

		BOT_ID:'',//技能ID

		SERVICE_ID:'S23360',//机器人ID

  },



  NLIRequest: function (corpus, arg) { // corpus是要发送的对话；arg是回调方法
		
    var that = this;

    // appkey

    var appkey = that.globalData.NLPAppkey;

    // appsecret

    var appSecret = that.globalData.NLPAppSecret;

    var api = "https://aip.baidubce.com/rpc/2.0/unit/bot/chat";

    var timestamp = new Date().getTime();

    // MD5签名

    //    var sign = md5.md5(appSecret + "api=" + api + "appkey=" + appkey + "timestamp=" + //timestamp + appSecret);

    var rqJson = {

			"version": "2.0",

			"service_id": "S23360",
	
			"log_id": "log_id",

			"skill_ids": [],

			"session_id": that.globalData.SESSION_ID,

			"request": {

				"user_id": "user_id",

				"query": corpus,
			},

			"dialog_state": {

				"contexts": {

					"SYS_REMEMBERED_SKILLS": [that.globalData.BOT_ID]

				}

			}

    };
		
    var rq = JSON.stringify(rqJson);

    

    // cusid是用来实现上下文的，可以自己随意定义内容，要够长够随机

		var cusid = timestamp;

    // console.log("[Console log]:NLIRequest(),URL:" + nliUrl);

		wx.request({//用于获取TOKEN

			url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + that.globalData.NLPAppkey + '&client_secret=' + that.globalData.NLPAppSecret,

			header: { 'content-type': 'application/x-www-form-urlencoded' },

			method: 'POST',

			success: function (res) {

				var resData = res.data;

				//组合URL

				var nliUrl = that.globalData.NLPUrl + resData.access_token;

				wx.request({//请求AI机器人API接口

					url: nliUrl,

					data: rq,

					header: { 'content-type': 'application/x-www-form-urlencoded' },

					method: 'POST',

					success: function (res) {
						
						var resData = res.data;

						// console.log("[Console log]:NLIRequest() success...");

						// console.log("[Console log]:Result:");

						var newsession = resData.result.session_id;

						//机器人多伦对话的技能ID

						that.globalData.BOT_ID = resData.result.response_list[0].origin

						//机器人多伦对话的SESSION_ID

						that.globalData.SESSION_ID = newsession;

						var nli = JSON.stringify(resData);

						// 回调函数，解析数据

						typeof arg.success == "function" && arg.success(nli);

					},

					fail: function (res) {

						console.log("[Console log]:NLIRequest() failed...");

						console.error("[Console log]:Error Message:" + res.errMsg);

						// typeof arg.fail == "function" && arg.fail();

					},

					complete: function () {

						// console.log("[Console log]:NLIRequest() complete...");

						// typeof arg.complete == "function" && arg.complete();

					}

				})
			},
			fail: function (res) {

				console.log("[Console log]:NLIRequest() failed...");

				console.error("[Console log]:Error Message:" + res.errMsg);

				// typeof arg.fail == "function" && arg.fail();

			},
		})
  },
})