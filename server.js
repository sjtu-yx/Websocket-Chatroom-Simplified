//导入相关模块
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const path = require('path'); 
//记录所有已经登陆过的用户
const users = []
//启动了服务器
server.listen(8080, () => {
    console.log('服务器启动成功')
})

//挂载静态资源
app.use(require('express').static(path.join(__dirname,'public')))
app.get('/', function(req, res) {
  res.redirect('/index.html')
})

io.on('connection', function(socket) {
    socket.on('login',data => {

        let user = users.find(item => item == data.username)
        if(user){
            //用户存在，不能登录
            socket.emit('loginErr',{msg: '用户已存在，登录失败'})
        } else {
            //登录成功
            users.push(data)
            socket.emit('loginSuccess',data)
        }
        io.emit('userIn',data)
        io.emit('userList',users)
        socket.username = data.username
        socket.portrait = data.portrait
    })

    //用户离开聊天室,把用户删除
    socket.on('disconnect',() => {
        //把当前用户信息从user中删除
        let idx = users.findIndex(item => item.username == socket.username)
        users.splice(idx, 1)
        io.emit('userLeave',{
            username:socket.username,
            portrait: socket.portrait
        })
        io.emit('userList',users)
    })
    
    //监听聊天的消息,广播给所有人
    socket.on('sendMessage', data => {
        io.emit('receiveMessage', data)
    })

    //接受图片的信息,广播到聊天框
    socket.on('sendImage', data => {
        io.emit('receiveImage', data)
    })
})

