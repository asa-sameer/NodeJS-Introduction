const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MS = require('express-mongoose-store')(session, mongoose);
const multer = require('multer');
const fileUpload = require('express-fileupload');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();



app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authLogin = require('./routes/auth');

const fsmulter = multer.diskStorage(
  {
    destination: (req,file,cb) =>
    {
      cb(null,file.name);
    },
    filename: (req,file,cb) =>{
      cb(null,new Date().toISOString()+ Math.floor(Math.random())+'_'+file.originalname);
    }
  });

  //const ffmulter = 

  //const upload = multer({storage:fsmulter ,fileFilter : ffmulter});

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'hiddendata',
  resave: false,
  saveUninitialized: false,
  store: new MS ({ttl: 60000000})
}));

app.use((req, res, next) => {
  if(!req.session.user)
  {
      req.session.isLogin = false;
      return next();
  }
  
  
      User.findById(req.session.user._id)
        .then(user => {
          req.user = user;
          next();
        })
        .catch(err => console.log(err));

});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authLogin);


app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://asameer:XYFGio1X68rtcrsO@cluster0-oqlyk.mongodb.net/orders'
  )
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
