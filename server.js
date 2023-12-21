import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt-nodejs';
import knex from 'knex';

import register from './controllers/register.js';
import signin from './controllers/signin.js';
import profile from './controllers/profile.js';
import image from './controllers/image.js';

const db = knex({
    client: 'pg',
    connection: {
      
    }
  });

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send('success'); })
app.post('/signin', signin.handleSignin(db, bcrypt))   // signin.handleSignin(db, bcrypt)(req, res)
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleAPICall(req, res) })


app.listen(3000, ()=> {
    console.log("app is running on port 3000");
});

/*
/ --> res = this is working
/signin --> POST = success/fail  (if we're not creating a new user why are we doing POST? Anytime we're sending a password we don't wanna send it as a query string, we wanna send it inside of the body ideally over HTTPS so that it's hidden from man-in-the-middle attacks and it's secure)
/register --> POST = user  (gonna return the new user object created)
/profile/:userId --> GET = user  (profile with an optional parameter of 'userId')
/image --> PUT = user  (updated user)(to update count in user)
*/