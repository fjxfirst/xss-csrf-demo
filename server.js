//当用户登录后，返回一个标识 cookie
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

let userList = [{username: 'fjx', password: 'fjx'}, {username: 'zs', password: 'zs'}];
let SESSION_ID = 'connect.sid';
let session = {};
app.post('/api/login', function(req, res) {
    let {username, password} = req.body;
    console.log(username);
    console.log(password);
    let user = userList.find(user => (user.username === username) && (user.password === password));
    if(user) {
        let cardId = Math.random() + Date.now();
        session[cardId] = {user};
        res.cookie(SESSION_ID, cardId);
        res.json({code: 0});
    } else {
        res.json({code: 1, error: '用户不存在'});
    }
});
// 反射型 http://localhost:3000/welcome?type=<script>alert(1)</script>
app.get('/welcome', function(req, res) {
    res.send(`${req.query.type}`);
});
let comments = [{username: 'fjx', content: '哈哈哈'}, {username: 'zs', content: '5555'}];
app.get('/api/list', function(req, res) {
    res.json({code: 0, comments});
});
app.post('/api/addcomment', function(req, res) {
    let r = session[req.cookies[SESSION_ID]] || {};
    let user = r.user;
    if(user) {
        console.log(user);
        comments.push({username: user.username, content: req.body.content});
        res.json({code:0});
    }else{
        res.json({code:1,error:'用户未登录'})
    }
});
app.listen(3000);
