// pages/contact/contact.js
const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;

/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';

  msgList = [{
    speaker: 'server',
    contentType: 'text',
    content: '我是供暖小助手，您有什么想了解的可以问我哦！'
  },
  
  ]
  that.setData({
    msgList,
    inputVal
  })
}

/**
 * 计算msg总高度
 */
// function calScrollHeight(that, keyHeight) {
//   var query = wx.createSelectorQuery();
//   query.select('.scrollMsg').boundingClientRect(function(rect) {
//   }).exec();
// }

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    initData(this);
    this.setData({
      cusHeadIcon: app.globalData.userInfo.avatarUrl,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 获取聚焦
   */
  focus: function (e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })

  },

  /**
   * 发送点击监听
   */
  sendClick: function (e) {
    msgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: e.detail.value
    })
    var num = msgList.length -1;
    var data = msgList[num]['content']
    inputVal = '';
    this.setData({
      msgList,
      inputVal
      
    });
    if(data){
      this.sendRequest(data);
    }
		
  },
  
  // 发送网络请求

  sendRequest(corpus) {
    var that = this;
    app.NLIRequest(corpus, {

      'success': function (res) {
        
        if (res.status == "error") {

          wx.showToast({

            title: '返回数据有误！',

          })

          return;

        }
				var nlires = JSON.parse(res);
				
				//ai返回的回答内容
				var nliArray = nlires.result.response_list[0].action_list[0].say;;
				console.log(nliArray);
				//去掉html标签
				var data = nliArray.replace(/<[^>]+>/g, "");
				msgList.push({
					speaker: 'server',
					contentType: 'text',
					content: data
				})
				//渲染页面
				that.setData({
					msgList,
					inputVal
				})
				
      },

      'fail': function (res) {

        wx.showToast({
					
          title: '请求失败！',

        })

        return;

      }

    });

  },

  /**
   * 退回上一页
   */
  toBackClick: function () {
    wx.navigateBack({})
  }

})
