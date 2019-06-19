const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./models/db');
const auths = require('./middlewares/auth');

// Create app
const port = process.env.PORT || 3000;
const app = express();

//Set view
app.set('view engine', 'ejs');
app.set('views', './views');

// Add middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

//Check if logined
app.use(auths);
//req.currentUser represent userID, !req.currentUser if not logged in



//static file
app.use(express.static('public'));
app.use('/static', express.static('public'));
app.use(express.static(__dirname + '/image'));


//Routes
app.use('/',require('./routers/index'));
app.use('/index',require('./routers/index'));
app.use('/films',require('./routers/films'));
app.use('/admin',require('./routers/admin'));
app.use('/single', require('./routers/single'));
app.use('/showtime', require('./routers/showtime'));
app.use('/sticket', require('./routers/sticket'));


//Database connect
db.sync().then(function () {
	app.listen(port);
	console.log(`Server is listening on port ${port}`);
}).catch(function(err){
	console.log(err);
	process.exit(1);
});