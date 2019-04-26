const models = require('../models');

const Finance = models.Finance;

// Render the finance page of the session user
const financePage = (req, res) => {
  Finance.FinanceModel.findByOwner(req.session.account._id,
    req.session.account.group, (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occured' });
      }
      return res.render('app', { csrfToken: req.csrfToken(), finances: docs });
    });
};

// Create a new Finance based on the data that was submitted
const makeFinance = (req, res) => {
  if (!req.body.date || !req.body.item || !req.body.type || !req.body.amount) {
    return res.status(400).json({ error: ' All fields are required' });
  }

  const financeData = {
    date: req.body.date,
    item: req.body.item,
    owner: req.session.account._id,
    type: req.body.type,
    amount: req.body.amount,
    group: req.session.account.group,
  };

  const newFinance = new Finance.FinanceModel(financeData);

  const financePromise = newFinance.save();

  financePromise.then(() => res.json({ redirect: '/finance' }));

  financePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Finance already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });
  return financePromise;
};

// Get all finances of the user
const getFinances = (request, response) => {
  const req = request;
  const res = response;

  return Finance.FinanceModel.findByOwner(req.session.account._id,
    req.session.account.group, (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occured' });
      }
      return res.json({ finances: docs });
    });
};

module.exports.financePage = financePage;
module.exports.getFinances = getFinances;
module.exports.make = makeFinance;
