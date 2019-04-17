const models = require('../models');

const Group = models.Group;

// Render the finance page of the session user
const groupPage = (req, res) => {
  Group.GroupModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('group', { csrfToken: req.csrfToken(), groups: docs });
  });
};

// Create a new Finance based on the data that was submitted
const makeGroup = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: ' A group requires a name' });
  }

  const groupData = {
    owner: req.session.account._id,
    name: req.body.name,
  };

  const newGroup = new Group.GroupModel(groupData);

  const groupPromise = newGroup.save();

  groupPromise.then(() => res.json({ redirect: '/finance' }));

  groupPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Group already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });
  return groupPromise;
};

// Get all finances of the user
const getGroups = (request, response) => {
  const req = request;
  const res = response;

  return Group.GroupModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.json({ groups: docs });
  });
};

module.exports.groupPage = groupPage;
module.exports.getGroups = getGroups;
module.exports.make = makeGroup;
