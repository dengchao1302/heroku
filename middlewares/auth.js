const User = require('../models/user');

const auth = function (req, res, next) {
  res.locals.currentUser = null;
  res.locals.Role = false;
  res.locals.name =null;
  const { userId } = req.session;
  if (!userId) {
    next();
  } else {
    User.findOne({
      where: {
        id: userId,
      }
    }).then(function(user) {
      if (!user) {
        delete req.session.userId;
        next();
      } else {
        req.currentUser = user;
        res.locals.currentUser = user; 

        req.Role = user.Role;
        res.locals.currentUser = user.Role;     

        req.name = user.displayName;
        res.locals.name = user.displayName;      
        
        next();
      }
    }).catch(next);
  }  
}

module.exports = auth;