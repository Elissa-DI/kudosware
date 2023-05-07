const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const authRoutes = require('./routes/authroutes')
const path = require('path')
// const upload = multer({ dest: 'uploads/' })
const cookieParser = require ('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')
const app = express();
const User = require('./model/user')
const morgan = require('morgan')

// middleware
app.use(morgan('dev'))
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://127.0.0.1:27017/kudos';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000,console.log("connect to db 💪😂\nlistening on port 3000...")))
  .catch((err) => console.log(err));

  const upload = multer({dest:'./uploads'})

// routes

app.post('/resume', upload.single('resume'), async(req, res) => {
  try {
    console.log(req.file);
    const { filename } = req.file;
    let { email} = req.body
    const user = await User.findOneAndUpdate({email }, { resume: filename }, { new: true });
    res.redirect('/');
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Error uploading the resume.');
  }
})
   

app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/resume', (req, res) => res.render('resume'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes)

