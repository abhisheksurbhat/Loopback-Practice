'use-strict';

// require('cls-hooked');
const jwt = require('jsonwebtoken');
// const LoopBackContext = require('loopback-context');
let secret = 'TOPSECRET';

module.exports = function (Offerings) {
  Offerings.cardDetails = (req, cb) => {
    const APP_TOKEN = req.headers["x-access-token"];
    console.log(APP_TOKEN);
    jwt.verify(APP_TOKEN, secret, (err, decodedObj) => {
      if (err) {
        cb(err, null);
      } else {
        var userName = decodedObj.username;
        Offerings.app.dataSources.dbService.findOffers((err, response, context) => {
          if (err) {
            let err = Error();
            err.statusCode = 500;
            err.message = 'Unable to fetch offerings';
            cb(err, null);
          };
          if (response instanceof Array) {
            let offerToShow = response.filter(
              offer => offer.username === userName);
            if (offerToShow.length > 0) {
              cb(null, offerToShow);
            } else {
              let err = Error();
              err.message = 'No offerings found';
              err.statusCode = 404;
              cb(err, null);
            }
          }
        });
      }
    });
  };
  Offerings.advisory = (token, cb) => {
    //Token Verification left. Will do in a bit
    Offerings.app.dataSources.dbService.findAdvisory((err, response, context) => {
      if (err) {
        let err = Error();
        err.statusCode = 500;
        err.message = 'Unable to fetch offerings';
        cb(err, null);
      };
      cb(null, response);
    });
  };
  Offerings.remoteMethod('cardDetails', {
    accepts: [
      {
        arg: 'req',
        type: 'object',
        'http': {
          source: 'req'
        }
      }
    ],
    returns: {
      arg: 'response',
      type: 'object',
    },
  });
  Offerings.remoteMethod('advisory', {
    accepts: {
      arg: 'token',
      type: 'string',
    },
    returns: {
      arg: 'response',
      type: 'object',
    },
  });
  // Offerings.beforeRemote('cardDetails', function (ctx, unused, next) {
  //   ctx.req.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJpYXQiOjE1NDgyMzMwOTQsImV4cCI6MTU0ODMxOTQ5NH0.9RzrfxnUYwR7gDw0KxrugNXWyw__WTScIaCaWqVP-ts';
  //   next();
  // });
}