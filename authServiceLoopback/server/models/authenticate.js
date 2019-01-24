'use strict';

const jwt = require('jsonwebtoken');
const secret = 'TOPSECRET';

module.exports = function(Authenticate) {
  Authenticate.validateUser = (username, password, cb) => {
    if (username && password) {
      Authenticate.app.dataSources.dbService.find((err, response, context) => {
        if (err) {
          let err = Error();
          err.statusCode = 400;
          err.message = 'User data not available';
          cb(err, null);
        }
        let users = response;
        if (users instanceof Array) {
          let userData = users.filter(user => user.username == username
            && user.password == password);
          if (userData.length > 0) {
            let token = jwt.sign({username: username}, secret,
               {expiresIn: 86400});
            cb(null, {'authenticated': true, 'token': token});
          } else {
            let err = Error();
            err.statusCode = 401;
            err.message = 'Unauthorized: Bad username or password';
            cb(err, null);
          }
        }
      });
    } else {
      cb(null, 'Please provide username or password');
    }
  };
  Authenticate.remoteMethod('validateUser', {
    accepts: [{
      arg: 'username',
      type: 'string',
    },
    {
      arg: 'password',
      type: 'string',
    },
    ],
    returns: {
      arg: 'response',
      type: 'object',
    },
  });
};
