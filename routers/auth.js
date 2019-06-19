const express = require('express');
const Router =  require('express-promise-router');
const User = require('../models/user');

const router = new Router();

router.get('/',async (req,res)=> {
    res.render('auth/login');
});

router.get('/login',async (req,res)=> {
    res.render('auth/login');
});

router.get('/signup', async (req,res) => {
    res.render('auth/signup');
});

router.post('/login', async function(req,res){
  const { email, pass } = req.body;
  const user = await User.findOne({
    where: { email },
  });
  if (!user) {
    throw Error('Cant find email');
  }
  if (!user.correctPassword(pass)) {
    throw Error('Wrong password');
  }
  req.session.userId = user.id;
  console.log("login success");
  if(user.Role)
    res.redirect('/admin');
  else
    res.redirect('/');
});

router.post('/signup', async function(req, res) {
  const {name, phone, email, pass } = req.body;
  const user = await User.findOne({
    where: { email },
  });
  if (user) {
    throw Error('Username existing');
  }
  await User.create({
    displayName: name,
    email: email,
    password: pass,
    phoneNumber: phone,
    Role: false
  })
  
  res.redirect('/');
});


module.exports = router;