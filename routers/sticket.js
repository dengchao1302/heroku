const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const films = require('../models/film');
const showtime = require('../models/showtime');
const cinemas = require('../models/cinema');


router.get('/:filmid/:showid',async function(req,res){
    res.render('default/sticket/index',{film: req.params.filmid, show: req.params.showid});
});

router.post('/:filmid/:showid',async function(req,res){
	console.log(req.body);
	res.redirect('/');
});
module.exports = router;