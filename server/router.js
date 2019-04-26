const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getPremium', mid.requiresSecure, mid.requiresLogin, controllers.Account.getPremium);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getFinances', mid.requiresLogin, controllers.Finance.getFinances);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/finance', mid.requiresLogin, mid.requiresGroup, controllers.Finance.financePage);
  app.post('/finance', mid.requiresLogin, controllers.Finance.make);
  app.post('/upgrade', mid.requiresLogin, controllers.Account.upgrade);
  app.post('/changePass', mid.requiresSecure, mid.requiresLogin,
          controllers.Account.changePass);
  app.post('/recover', controllers.Account.recoverAcc);

  app.get('/groups', mid.requiresSecure, mid.requiresLogin, controllers.Group.groupPage);
  app.post('/groups', mid.requiresSecure, mid.requiresLogin, controllers.Group.make);
  app.get('/getGroups', mid.requiresSecure, mid.requiresLogin, controllers.Group.getGroups);
  app.post('/setGroup', mid.requiresSecure, mid.requiresLogin, controllers.Group.setGroup);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
