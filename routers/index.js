const express = require('express');
const Router = require('express-promise-router');
const path = require('path');
const fs = require('fs');
const dialog = require('dialog');
const film = require('../models/film');
const User = require('../models/user.js');
const sequelize = require('sequelize');
const Promise = require('bluebird');
Promise.promisifyAll(fs);


const router = new Router();

router.get('/',async function(req,res){
	var Films = await film.findAll();
  var NewFilms = await film.findAll({
    order: [['publicDate','DESC'],],
    limit: 5,
  });
  var HotFilms = await film.findAll({
    order: [['hotRate','DESC'],],
    limit: 5,
  });
	if (!req.Role) {
		if(!req.currentUser)
			res.render('default/index',{Films,NewFilms,HotFilms});
		else
			res.render('default/index', {user: req.currentUser,name : req.name,Films,NewFilms,HotFilms});
	}
	else{
		res.render('admin/index',{ admin : req.name });
	}
});


router.get('/index',async function(req,res){
    res.render('index',{ name : req.name});
});

router.get('/login',async (req,res)=> {
    res.render('default/login');
});

router.get('/register', async (req,res) => {
    res.render('default/register');
});

router.get('/infomation', async (req,res) =>{
  if(!req.currentUser)
    res.redirect('/');
  else
    res.render('default/infomation',{user: req.currentUser});
});

router.post('/infomation/newPassword', async (req,res) => {
  console.log(req.body);
  const { passwordOld, passwordNew, passwordConfig} = req.body;
  if (passwordNew != passwordConfig) {
    dialog.warn('Xác nhận mật khẩu sai !',ok => { console.log('Wrong password confirmation')});
  }
  else{
    const user = await User.findOne({where: {id : req.currentUser.id}});
    if(!user.correctPassword(passwordOld)){
      dialog.warn('Mật khẩu sai !',ok => { console.log('Wrong password')});
    }
    else{
      user.update({
        password: passwordNew
      });
      dialog.warn('Cập nhật mật khẩu thành công !',ok => { console.log('Password change success')});
    }
  }
  res.redirect('/infomation');
})

router.post('/login', async function(req,res){
	console.log(req.body);
  const { email, password } = req.body;
  const user = await User.findOne({
    where: { email },
  });
  if (!user) {
    throw Error('Cant find email');
  }
  if (!user.correctPassword(password)) {
    throw Error('Wrong password');
  }
  req.session.userId = user.id;
  console.log("login success");
  if(user.Role)
    res.redirect('/admin');
  else
    res.redirect('/');
});

router.post('/register', async function(req, res) {
  const {fullname, email, phone, password,passwordConfig } = req.body;
  if(password != passwordConfig)
  {
    dialog.warn('Xác nhận mật khẩu sai !',ok => { console.log('Wrong password confirmation')});
    res.redirect('/register');
  }
  else{
    const user = await User.findOne({
      where: { email },
    });
    if (user) {
      dialog.warn('Email đã tồn tại !',ok => { console.log('Existed email')});
      res.redirect('/register');
    }
    else{
      await User.create({
        displayName: fullname,
        email: email,
        password: password,
        phoneNumber: phone,
        Role: false
      })
      res.redirect('/');
    }
  }  
});

router.post('/infomation/newPhoneNumber', async function(req, res) {
  const { newPhoneNumberg} = req.body;
  const user = await User.findOne({where: {id : req.currentUser.id}});
    user.update({
      phoneNumber: newPhoneNumberg
    });
    dialog.warn('Cập nhật số điện thoại thành công !',ok => { console.log('Phone number change success')});
  res.redirect('/infomation');
});

router.get('/logout', async (req,res) => {
  res.locals.currentUser = null;
  res.locals.Role = false;
  res.locals.name =null;
  delete req.session.userId;
  res.redirect('/');
});


module.exports = router;