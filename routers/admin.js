const express = require('express');
const Router = require('express-promise-router');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Promise = require('bluebird');
const sharp = require('sharp');
const cineplexes = require('../models/cineplex');
const cinemas = require('../models/cinema');
const films = require('../models/film');
const showtime = require('../models/showtime');
const upload = multer({ dest: 'public/uploads/' });
const User = require('../models/user.js');
Promise.promisifyAll(fs);

const router = new Router();	

router.get('/', (req,res) => {
  if (!req.currentUser)
    res.redirect('/');
  else if(!req.Role)
  	res.redirect('/');
  else{
	 res.render('admin/index',{admin: req.name})
	}
});


//Phim
router.get('/film', async (req,res) => {
  Film = await films.findAll();
    console.log(Film);
  	res.render('admin/film/index',{Film});
});

router.get('/film/create', (req,res) => {
	res.render('admin/film/create');
});

router.post('/film/create',upload.single('uploadFile'), async (req,res) => {
	console.log(req.body);
	const {path} = req.file;
	const raw = await fs.readFileAsync(path);


  // Resize image
  const content = await sharp(path)
    .resize(600, 600, { fit: 'inside' })
    .jpeg({ quality: 80 })
    .toBuffer();

  const {title,primiereDate,time,trailer} = req.body;
  await films.create({
      Name: title,
      publicDate: primiereDate,
      time: time,
      posterURL: path.replace(/\\/gi,'/').replace('public',''),
      trailer: trailer,
      hotRate: 0
   })
	res.redirect('create');
});

router.post('/film/delete/:id',async (req,res) => {
  if (films.findByPk(req.params.id)) {
    films.destroy({
      where: {
        id : req.params.id
      }
    });
  }
  res.redirect('/admin/film');
});



// Cụm rạp
router.get('/cineplex', async (req,res) => {
	const cines = await cineplexes.findAll();
	res.render('admin/cineplex/index',{cines});
})
router.get('/cineplex/create', (req,res) => {
	res.render('admin/cineplex/create');
});

 router.post('/cineplex/create', async (req,res) => {
  console.log(req.body);
  const {Name, address } = req.body;
  const cines = await cineplexes.findOne({
    where: { Name },
  });
  if (cines) {
    throw Error('Cineplex existing');
  }
  await cineplexes.create({
      Name: Name,
      address: address,
   })
  	res.redirect('create');
});


router.post('/cineplex/delete/:id',async (req,res) => {
  if (cineplexes.findByPk(req.params.id)) {
    cineplexes.destroy({
      where: {
        id : req.params.id
      }
    });
  }
  res.redirect('/cineplex');
});



//Rạp
router.get('/cinema', async (req,res) => {
	const Cinema = await cinemas.findAll();
	const cineplex = await cineplexes.findAll();
	res.render('admin/cinema/index',{Cinema, cineplex});
});

router.get('/cinema/create', async (req,res) => {
	const Cineplex  = await cineplexes.findAll();
	res.render('admin/cinema/create',{Cineplex });
});

router.post('/cinema/create',async (req,res) => {
  console.log(req.body);
  const {Name, cineplex,Type,horizon,vertical } = req.body;
  const cine = await cinemas.findOne({
    where: { Name },
  });
  if (cine) {
    throw Error('Cinema existing');
  }
  await cinemas.create({
      Name: Name,
      Type: Type,
      horizon: horizon,
      vertical: vertical,
      CineplexId: cineplex,
   })
  	res.redirect('/admin/cinema/create');
});

router.post('/cinema/delete/:id',async (req,res) => {
	if (cinemas.findByPk(req.params.id)) {
		cinemas.destroy({
			where: {
				id : req.params.id
			}
		});
	}
	res.redirect('/admin/cinema');
});


//Xuất chiếu
router.get('/showtime', async (req,res) => {
  const Showtime = await showtime.findAll();
  const film = await films.findAll();
  const cinema = await cinemas.findAll();
	res.render('admin/showtime/index',{Showtime,film,cinema});
});

router.get('/showtime/create', async (req,res) => {
  const Films = await films.findAll();
  const Cinema = await cinemas.findAll();
	res.render('admin/showtime/create',{Films,Cinema});
});


router.post('/showtime/create', async (req,res) => {
  const{film,cinema,begin,end,price} = req.body;
  const show = await showtime.findOne({
    where: { FilmId: film, CinemaId: cinema, timeStart: begin },
  });
  if(show){
    throw Error('Showtime existing');
  }

  const Film = await films.findByPk(film);
  var rate = Film.hotRate + 1;
  Film.update({
    hotRate: rate
  });

  await showtime.create({
    timeStart: begin,
    timeEnd: end,
    price: price,
    CinemaId: cinema,
    FilmId: film
  })
  res.redirect('create');
});

router.post('/showtime/delete/:id',async (req,res) => {
  if (showtime.findByPk(req.params.id)) {
    showtime.destroy({
      where: {
        id : req.params.id
      }
    });
  }
  res.redirect('/admin/showtime');
});

router.get('/register', async (req,res) => {
  res.render('admin/register')
});


router.post('/register', async (req,res) => {
  const {fullname, email, phone, password } = req.body;
  const user = await User.findOne({
      where: { email },
    });
    if (user) {
      throw Error('Email existed');
      res.redirect('/register');
    }
    else{
      await User.create({
        displayName: fullname,
        email: email,
        password: password,
        phoneNumber: phone,
        Role: true
      })
      res.redirect('/admin/register');
    }  
});

router.get('/users', async (req,res) => {
  const users = await User.findAll();
  res.render('admin/users', {users});
});

router.post('/users/delete/:id',async (req,res) => {
  if (User.findByPk(req.params.id)) {
    User.destroy({
      where: {
        id : req.params.id
      }
    });
  }
  res.redirect('/admin/users');
});

module.exports = router;