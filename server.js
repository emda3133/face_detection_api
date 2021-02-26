const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');  // to connect to front-end
const knex = require('knex');  // to connect to back-end: database!

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'emilydaykin',
    password : '',
    database : 'smart-brain'
  }
});

/*
/ ------------ Plan what API Server will look like: ------------ /
/ --> res = this is working
/signin --> POST = success/fail (posting user info)
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user (since it's an update, user already exists)
*/

// --------- See all user info in the console --------- //
// console.log(db.select('*').from('users').then(data => {
//   console.log(data);
// }));


const app = express();

app.use(bodyParser.json())  // so that `req.body.email` can be understood
app.use(cors())  // to connect to front-end

// this allows you to NOT have to pass (req, res) into each of the route functions below!!!
app.get('/', (req, res) => {
  res.send(database.users);
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


app.listen(process.env.PORT || 3000, ()=> {
  console.log('app is running on port `${process.env.PORT}`');
})

// *********************** BCRYPT *********************** //
// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });
//
// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });
// ****************************************************** //
