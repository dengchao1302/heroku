const express = require('express');
const router = express.Router();


router.get('/',async (req,res)=> {
    res.render('films/movie_is_playing');
});

router.get('/movie_is_playing',async (req,res)=> {
    res.render('films/movie_is_playing');
});

router.get('/movies_coming_soon', async (req,res) => {
    res.render('films/movies_coming_soon');
})

router.get('/single', async (req,res) => {
    res.render('films/single');
})

module.exports = router;