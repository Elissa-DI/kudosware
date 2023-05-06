const {isEmail } = require("validator")
const bcrypt = require('bcrypt')

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
     fname: {
          type:String,
          required: [true,"provide your first name"]
     },
     lname: {
          type:String,
          required: [true,"provide your last name"]
     },
     email: {
          type:String,
          required:[true,"Enter your email"],
          unique: true,
          lowercase:true,
          validate: [isEmail, "Please enter a valid email"]

     },
     password: {
          type:String,
          required: [true,"provide a password"],
          minlength: [6,"Minimum passowrd lenght is 6 character"]
     },
     number: {
          type:Number,
          required: [true,"provide your Phone Number"]
     },
     github: {
          type:String,
          unique: true,
          required: [true,"provide your github link"]
     },
     linkedin: {
          type:String,
          unique: true,
          required: [true,"provide your linkedin link"]
     },
     resume: {
       type: String,
     //   required: [true, 'Upload your resume'],
     }
})

userSchema.post('save', function(doc,next) {
     console.log('new user was created and saved ', doc)
     next()
})

userSchema.pre('save',async function (next) {
     const salt =await bcrypt.genSalt()
     this.password = await bcrypt.hash(this.password,salt)
  console.log('user is  about to be created',this)
  next();

})

userSchema.statics.login = async function (email,password) {
     const user = await this.findOne({email})
     if (user) {
      const auth = await bcrypt.compare(password,user.password)  
      if (auth) {
          
          return user;
         
      }
      throw Error('incorrect email or password')
     }
          throw Error('incorrect email or password')
     
}

const User = mongoose.model('user',userSchema)

module.exports = User;