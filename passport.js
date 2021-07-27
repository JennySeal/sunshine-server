const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("./db/index");


passport.use(new LocalStrategy({
  username: 'email',
  password: 'password',
  passReqToCallback: true,
  session: false
},
  async function(req, username, password, callback) {
  let response;  
  try {  
  response = await db.login(username);
  const customerDetails = response[0];
  if (!customerDetails) {
    return callback(null, false, {message: 'No user by that email'})
  }
 await bcrypt.compare(password, customerDetails.saltyhash, ((error, res) => {
      if (res) {
          const user = {customer_id: customerDetails.customer_id, email: customerDetails.email, first_name: customerDetails.first_name, surname: customerDetails.surname, address_line1: customerDetails.address_line1, address_line2: customerDetails.address_line2, town: customerDetails.town, county: customerDetails.county, postcode: customerDetails.postcode}
          return callback(null, user);
            } else {
          return callback(null, false)
            }
  }))} catch (error) {
    return callback(error)
  }
      
  }))          


passport.serializeUser((user, callback) => {
  return callback(null, user);
});
