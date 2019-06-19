const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const films = require('../models/film');
const showtime = require('../models/showtime');
const cinemas = require('../models/cinema');


router.get('/:id',async function(req,res){
	const Film = await films.findByPk(req.params.id);
	const Showtime = await showtime.findAll({
		where: {FilmId: req.params.id}
	});
	const Cinema = await cinemas.findAll();
    res.render('default/showtime/index',{Film,Showtime,Cinema});
})
module.exports = router;