const User = require('../models/user');

exports.getLogin = (req, res, next) => {
        res.render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          isAuthenticated: req.session.isLogin,
          isAdmin: req.session.admin
        });
  };

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password =  req.body.password;
  User.findOne({email:email, password: password})
    .then(user => {
      console.log(user);
      if(user)
      { 
        req.session.admin = user.admin;
        req.session.isLogin = true;
        req.session.user = user;
        req.session.save(err => {
          console.log(err);
          res.redirect('/');
        });
      } else
      res.redirect('/login');
    })
    .catch(err => console.log(err));
};


exports.getLogout = (req, res, next) => {
  req.session.isLogin = false;
  req.session.user =null;
  req.session.save();
  req.session.destroy((err) =>
  {
    if(err)
       console.log(err);
    else
      res.redirect('/');
  });
  
};


exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLogin,
    isAdmin: req.session.admin
  });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPass = req.body.confirmPassword;
  User.findOne({email : email})
  .then(user => {
    if(user){
      return res.redirect('/signup');
    }
    const usernew = new User({
      name: name,
      email : email,
      password : password,
      cart:{items: [] }
    });
    return usernew.save();
  }).then(
    result => res.redirect('/login')
  )
  .catch
  (err => console.log(err) 
   );
};