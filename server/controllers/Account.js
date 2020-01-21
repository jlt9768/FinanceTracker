const models = require('../models');


// Set up nodemailer account requirements
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'financetracker.jlt@gmail.com',
    pass: process.env.GMAIL_PASS,
  },
});


const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const changePassPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Checks to see if all fields came in the request
// Then check to make sure the user is the account owner
// If so generate a new password and update the users password
const changePass = (req, res) => {
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;

  if (!username || !password || !newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    return Account.AccountModel.generateHash(newPass, (salt, hash) => {
      const accountData = {
        salt,
        password: hash,
      };
      return Account.AccountModel.updatePass(username, accountData, (err2) => {
        if (err2) {
          console.dir(err2);
        }
        return res.json({ redirect: '/finance' });
      });
    });
  });
};

// Allow the user to recover their account given they know the username
// First checks if an account exists given the entered name
// Then generate a new random password for the user
// Update the user's pass and send an email with their new recovery password
const recoverAcc = (req, res) => {
  const username = `${req.body.username}`;

  if (!username) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.recover(username, (err, doc) => {
    if (err || !doc) {
      return res.status(404).json({ error: 'No account with that username' });
    }

    // Line to create semi random passwords with letters and numbers
    // Obtained from: https://gist.github.com/gordonbrander/2230317
    const newPass = Math.random().toString(36).substr(2, 8);

    return Account.AccountModel.generateHash(newPass, (salt, hash) => {
      const accountData = {
        salt,
        password: hash,
      };
      return Account.AccountModel.updatePass(username, accountData, (err2) => {
        if (err2) {
          console.dir(err2);
        }

        const mailOptions = {
          from: 'financetracker.jlt@gmail.com',
          to: doc.email,
          subject: 'Password recovery',
          html: '<p> A password recovery has been initiated on your account.' +
            `Your recovery password is <b>${newPass}<b>. <br></br> <br></br> <b>Make sure ` +
            'once you log back in to change your password to something you will remember!</b></p>',
        };
        transporter.sendMail(mailOptions, (err3, info) => {
          if (err3) {
            console.log(err3);
          } else {
            console.log(info);
          }
        });


        return res.json({ redirect: '/' });
      });
    });
  });
};


// Login controller
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  };

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/groups' });
  });
};

// Signup controller
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.email = `${req.body.email}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.email || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      premium: false,
      email: req.body.email,
    };

    const newAccount = new Account.AccountModel(accountData);
    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);

      const mailOptions = {
        from: 'financetracker.jlt@gmail.com',
        to: req.body.email,
        subject: 'Welcome to Finance Tracker!',
        html: `<p> Thank you ${req.body.username} for joining!` +
          'You can use this app to track all of your finances.</p>',
      };
      transporter.sendMail(mailOptions, (err2, info) => {
        if (err2) {
          console.log(err2);
        } else {
          console.log(info);
        }
      });

      return res.json({ redirect: '/groups' });
    });
    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

// Check the premium status of the current user
const getPremium = (request, response) => {
  const req = request;
  const res = response;

  const premium = {
    premium: req.session.account.premium,
  };
  res.json(premium);
};

// Upgrade the user to premium
const upgrade = (request, res) => {
  const req = request;
  return Account.AccountModel.upgrade(req.session.account.username, (err) => {
    if (err) {
      console.dir(err);
    }
    req.session.account.premium = true;
    return res.json({ redirect: '/finance' });
  });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.changePass = changePass;
module.exports.changePassPage = changePassPage;
module.exports.getPremium = getPremium;
module.exports.upgrade = upgrade;
module.exports.recoverAcc = recoverAcc;
