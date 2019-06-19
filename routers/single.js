const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const films = require('../models/film');

router.get('/:id',async function(req,res){
	const film = await films.findByPk(req.params.id);
	const Films = await films.findAll();
    res.render('default/single',{film,Films});
})

module.exports = router;