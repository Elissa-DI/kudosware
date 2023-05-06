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
    
    const { fname, lname, email, password, number, github, linkedin } = req.body;
     try {
          const user = await User.create({fname,lname,email,password,number,github,linkedin})
          const token = createToken(user._id);
          res.cookie('jwt',token, {httpOnly:true, maxAge:maxAge * 1000})
          res.status(201).json({user: user._id})
      
     } catch (err) {
          const errors = handleErrors(err)
          res.status(400).json({errors})          
     }
     
}

module.exports.login_post = async (req,res) => {
     const { email, password } = req.body

      try {
        const user = await User.login(email,password);
        
        const token = createToken(user._id);
        res.cookie('jwt',token, {httpOnly:true, maxAge:maxAge * 1000})
        
        res.status(200).json({ user: user._id})
      }  catch (err) {

          const errors = handleErrors(err)
     
       res.status(400).json({errors});
      }
 
}


module.exports.logout_get = (req,res) => {
      res.cookie('jwt','', {maxAge:1});
      res.redirect('/');
}

module.exports.resume_post = (req, res) => {
     // const resume = req.body;
     res.redirect('/resume');
}