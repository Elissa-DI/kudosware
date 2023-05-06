const User  = require('../model/user')
const jwt = require('jsonwebtoken')

const handleErrors = (err) => {
     console.log(err.message, err.code)
     let error = {email:"",password:""}

     if(err.message === 'incorrect email') {
          error.email = 'that email is not registered'
     }

     if(err.message === 'incorrect password') {
          error.email = 'that password is incorrect'
     }

if(err.code === 11000) {
     error.email = "that email  is already registered"
     return error
}



     if(err.message.includes("user validation failed")){
          Object.values(err.errors).forEach(({properties}) => {
               console.log(properties)
               error[properties.path] = properties.message
          });
     }

     return error;
}
const maxAge = 3 * 24 * 60 *60
const createToken = (id) => {
     return jwt.sign({id}, 'secret',{expiresIn:maxAge})
}


module.exports.signup_get = (req,res) => {
     res.render('signup')
}

module.exports.login_get = (req,res) => {
     res.render('login')
}

module.exports.resume_get = (req, res) => {
     res.render('resume');
}

module.exports.signup_post= async (req, res) => {
    
 