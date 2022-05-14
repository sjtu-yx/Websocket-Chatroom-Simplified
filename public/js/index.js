
//连接socket.io服务器
let socket = io('http://localhost:8080')
let username, portrait
//头像边框
$('.portrait-list img').on('click',function() {
    $(this)
    .addClass('portrait-border')
    .siblings()
    .removeClass('portrait-border')
})
//登录
$('.login-btn').on('click',() => {
  username = $('.user-name').val().trim()
  if(!username) {
      return alert('您没有输入用户名哦！！')
  }
  portrait = $('.portrait-border').attr('src')
  socket.emit('login', {
      username: username,
      portrait: portrait
  })
})
//如果登录失败
socket.on('loginErr', data => {
  alert('用户已存在，登录失败！！')
})
//登录成功
socket.on('loginSuccess', data => {
  $('.login').fadeOut()
  $('#main').fadeIn()
  $('.user-own img').attr('src', data.portrait)
  $('.user-own h4').text(data.username)
})

//用户进入聊天室，发送系统广播
socket.on('userIn',data => {
  $('.chat-content').append(`<div class="chat-state">"${data.username}"加入了群聊</div>`)
    scrollIntoView()      
})

// 监听用户列表消息
socket.on('userList',data => {
    $('.user-list span').html('')
    data.forEach( item => {
      $('.user-list span').append(`
      <div class="user-member">
        <img src="${item.portrait}" alt="">
        <h4>${item.username}</h4>
      </div>`)
    })
    $('.user-list span div').addClass('pointer')
})

//监听用户离开的消息,进行广播
socket.on('userLeave',data => {
  $('.chat-content').append(`
  <div class="chat-state">"${data.username}"离开了群聊</div>
  `)
    scrollIntoView()
})   

$('.send-btn').on('click',() => {
    let content = $('.send-message').html()
    $('.send-message').html('')
    if(!content) return alert('请输入内容!!')

    //发送给服务器
    socket.emit('sendMessage',{
        msg: content,
        username: username,
        portrait: portrait
    })
})

//监听聊天的消息,把接收到的消息展示在聊天窗口
socket.on('receiveMessage', data => {
  //自己发的消息
    if(data.username == username) {
      $('.chat-content').append(`
      <div class="chat-own">
          <div class="name">${data.username}</div>
          <div class="message">${data.msg}</div>
      </div>
      `)
    } else {
        //别人的消息
        $('.chat-content').append(`
        <div class="chat-member">
          <div class="name">${data.username}</div>
          <div class="message">${data.msg}</div>
        </div>
        `)
    }

    scrollIntoView()
})
//保持聊天框保持始终在最底下
function scrollIntoView() {
    $('.chat-content').children(':last').get(0).scrollIntoView(false)
}

//发送文档功能
$('#file').on('change', () => {
  let file = this.files[0]
  let fr = new FileReader()
  fr.readAsDataURL(file)
  fr.onload = function() {
    socket.emit('sendImage',{
      username: username,
      portrait: portrait,
      img: fr.result
    })
  }
})

//监听图片的聊天信息
socket.on('receiveImage', data => {
  if(data.username == username) {
      //自己的消息
      $('.chat-content').append(`
      <div class="chat-own">
        <div class="name">${data.username}</div>
        <div class="message">${data.img}</div>
      </div>
      `)
  } else {
      //别人的消息
      $('.box-bd').append(`
      <div class="chat-member">
        <div class="name">${data.username}</div>
        <div class="message">${data.img}</div>
      </div>
      `)
  }

  //等待图片加载完成
  $('.chat-content img :last').on('load',function() {
      scrollIntoView()
  })

})

//显示表情
$('.face').on('click', () => {
  $('.send-message').emoji({
    button:'.face',
    showTab:true,
    animation: 'slide',
    position: 'topRight',
    icons: [{
      name: "贴吧表情",
      path: "lib/jquery-emoji/img/tieba/",
      maxNum: 50,
      file: ".jpg",
      placeholder: ":{alias}:",
      alias: {
          1: "hehe",
          2: "haha",
          3: "tushe",
          4: "a",
          5: "ku",
          6: "lu",
          7: "kaixin",
          8: "han",
          9: "lei",
          10: "heixian",
          11: "bishi",
          12: "bugaoxing",
          13: "zhenbang",
          14: "qian",
          15: "yiwen",
          16: "yinxian",
          17: "tu",
          18: "yi",
          19: "weiqu",
          20: "huaxin",
          21: "hu",
          22: "xiaonian",
          23: "neng",
          24: "taikaixin",
          25: "huaji",
          26: "mianqiang",
          27: "kuanghan",
          28: "guai",
          29: "shuijiao",
          30: "jinku",
          31: "shengqi",
          32: "jinya",
          33: "pen",
          34: "aixin",
          35: "xinsui",
          36: "meigui",
          37: "liwu",
          38: "caihong",
          39: "xxyl",
          40: "taiyang",
          41: "qianbi",
          42: "dnegpao",
          43: "chabei",
          44: "dangao",
          45: "yinyue",
          46: "haha2",
          47: "shenli",
          48: "damuzhi",
          49: "ruo",
          50: "OK"
      },
      title: {
          1: "呵呵",
          2: "哈哈",
          3: "吐舌",
          4: "啊",
          5: "酷",
          6: "怒",
          7: "开心",
          8: "汗",
          9: "泪",
          10: "黑线",
          11: "鄙视",
          12: "不高兴",
          13: "真棒",
          14: "钱",
          15: "疑问",
          16: "阴脸",
          17: "吐",
          18: "咦",
          19: "委屈",
          20: "花心",
          21: "呼~",
          22: "笑脸",
          23: "冷",
          24: "太开心",
          25: "滑稽",
          26: "勉强",
          27: "狂汗",
          28: "乖",
          29: "睡觉",
          30: "惊哭",
          31: "生气",
          32: "惊讶",
          33: "喷",
          34: "爱心",
          35: "心碎",
          36: "玫瑰",
          37: "礼物",
          38: "彩虹",
          39: "星星月亮",
          40: "太阳",
          41: "钱币",
          42: "灯泡",
          43: "茶杯",
          44: "蛋糕",
          45: "音乐",
          46: "haha",
          47: "胜利",
          48: "大拇指",
          49: "弱",
          50: "OK"
      }
  }, {
      name: "QQ高清",
      path: "lib/jquery-emoji/img/qq/",
      maxNum: 91,
      excludeNums: [41, 45, 54],
      file: ".gif",
      placeholder: "#qq_{alias}#"
  }, {
      name: "emoji高清",
      path: "lib/jquery-emoji/img/emoji/",
      maxNum: 84,
      file: ".png",
      placeholder: "#emoji_{alias}#"
  }]

  })
})
