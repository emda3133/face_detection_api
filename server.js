const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');  // to connect to front-end
const knex = require('knex');  // to connect to back-end: database!

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const db = knex({
  client: 'pg',
  connection: {
    // host : 'postgresql-transparent-67147',  // 127.0.0.1 (localhost before)
    // user : 'emilydaykin',
    // password : '',
    // database : 'smart-brain'
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
});


const app = express();

app.use(bodyParser.json())  // so that `req.body.email` can be understood
app.use(cors())  // to connect to front-end

// this allows you to NOT have to pass (req, res) into each of the route functions below!!!
app.get('/', (req, res) => {
  res.send('It is working!!~');
})

// app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})  // since app.get('/') was defined above... this becomes:
app.post('/signin', signin.handleSignin(db, bcrypt))                            // ... much cleaner/shorter! It THEN runs (req, res)

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt)  // dependency injection (pass the args here)
})

app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db)
})

app.put('/image', (req, res) => {
  image.handleImage(req, res, db)
})

app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res)  // so that the 'authorisation: <API KEY>' doesn't display in front end Network console for user to see
})

const PORT = process.env.PORT || 3005;  // Heroku has its own port! (run first if exists, if not run 3005)

app.listen(PORT, ()=> {
  console.log(`app is running on port ${PORT}`);
})
