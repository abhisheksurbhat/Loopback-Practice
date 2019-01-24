module.exports = function(app) {
  var ds = app.loopback.createDataSource({
    connector: require('loopback-connector-rest'),
    debug: false,
    baseURL: 'http://localhost:5000/',
  });

  let User = ds.createModel('User', {
    'name': 'dbService',
    'baseURL': 'http://localhost:5000/users',
    'crud': true,
    'connector': 'rest',
  });

  User.find(function(err, user) {
    console.log(user);
  });
};
