// Dependencies and Modules
const express = require("express"),
      bodyParser = require("body-parser"),
      session = require("express-session"),
      flash = require("express-flash"),
      flashNotification = require("express-flash-notification")
      exphbs = require('express-handlebars'),
      pg = require("pg"),
      Pool = pg.Pool,
      greetingPool = require("./public/greeting");

// init modules, env , port
let app = express(),
    PORT = process.env.PORT || 3013;

// customize the greeted people route
// Design for mobile Make ajustments to texts and colors

// SSL connection
let useSSL = false;
let local 	= process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local){
	useSSL = true
}

// connect to db
const connectionString = process.env.DATABASE_URL || 'postgresql://trinesh:Trinesh1997@@localhost:5432/Greetings';
const pool = new Pool ({
  connectionString,
  ssl: useSSL
})
// pool init
const GreetingUsers = greetingPool(pool);

// middle ware use
app.use(bodyParser.urlencoded( {extended: false} ));
app.use(bodyParser.json());
app.use(express.static('public'));

app.set("view engine", "handlebars");
app.engine('handlebars', exphbs({defaultLayout: 'main'}))

app.use(session({
  secret: 'this is a string used for session in http',
  resave: false,
  saveUninitialized: true
}))

app.use(flash());   

// Keep count on screen
app.get('/', async function(req, res, next){
    let count = await GreetingUsers.counts();
    res.render("home", {count});
  });


app.post('/greetings', async function(req, res){
  // console.log(req.body);
  let count = await GreetingUsers.counts();
  let name = req.body.theUsers;
  let language = req.body.LanguageType;

  if (name == "" || name === undefined) {
    // 'errorOne' is the key
    req.flash('errorOne', 'Please enter name below');
  }

  if (language === undefined || language === "") {
    req.flash('errorTwo', "Please choose language")
  }
  let returnsValues = await GreetingUsers.user_names_lang(language, name);
  

  res.render("home", {returnsValues, count});
  
});

app.get("/reset", async function(req, res, next){
  let reset = await GreetingUsers.reset();
  
  res.redirect("/")
})


app.get('/greeted', async function(req, res, next){
  let count = await GreetingUsers.counts();
  let users = await pool.query('select * from users');
  let names = users.rows;

  res.render("greetedPeople", {names, count})
})


app.get('/greeted/:user_name', async function(req, res){
  let name = req.params.user_name;

  let count = await GreetingUsers.getCounts(name);
  let names = await GreetingUsers.checkNames();  
  let message = `${name} has been greeted ${count}`;


  res.render("singleGreet", {names, message});
});


app.listen(PORT, function(){
  console.log('App starting on port', PORT)
})