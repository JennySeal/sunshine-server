const express = require('express')
const cors = require('cors');
const stripe = require('./config/stripe');


const app = express()
const path = require('path');
const db = require('./db/index')
const passport = require('passport')
require('./passport');
const CORS_WHITELIST = require('./config/frontend')
const corsOptions = {
  origin: (origin, callback) => 
  (CORS_WHITELIST.indexOf(origin) !== -1 || !origin) ? callback(null, true) : callback(new Error(`Not allowed by Cors: origin is ${origin} and callback is ${callback}`))
}

const postStripeCharge = res => (stripeError, stripeRes) => {
  if (stripeError) {
    res.status(500).send({error: stripeError})
  } else {
    res.status(200).send({success: stripeRes})
  }
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(passport.initialize())
app.use(passport.session())

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')))
}


app.get('/', (request, response) => {
  response.json({ info: `I really miss Miss Moneypenny` })
})


app.get('/products', db.getProducts);
app.get('/products/:id', db.getProduct);
app.get('/orderhistory/:id', db.getOrderHistory);
app.post('/users', db.addUser);
app.post('/login', passport.authenticate('local',  {failureRedirect: '/'}), ((req, res) => {
  res.status(201).json(req.user)
}))
  
app.get('/logout', ((req, res) => {
  req.logout();
  res.status(200).redirect('/');
}))

app.post('/order', db.addOrder);
app.post('/orderlines', db.addOrderLines);
app.put('/updateStock', db.updateStock);

app.post('/takepayment', (req, res) => {
  stripe.charges.create(req.body, postStripeCharge(res));
})


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'))
});


module.exports = app;