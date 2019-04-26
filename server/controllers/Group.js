const models = require('../models');

const Group = models.Group;

// Render the group page of the session user
const groupPage = (req, res) => {
  Group.GroupModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('group', { csrfToken: req.csrfToken(), groups: docs });
  });
};

// Create a new Group based on the data that was submitted
const makeGroup = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: ' A group requires a name' });
  }

  const groupData = {
    owner: req.session.account._id,
    name: req.body.name,
  };

  return Group.GroupModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    let found = false;
    docs.forEach((element) => {
      if (groupData.name === element.name) {
        found = true;
      }
    });
    if (found) {
      return res.status(400).json({ error: 'Group already exists' });
    }
    const newGroup = new Group.GroupModel(groupData);

    const groupPromise = newGroup.save();

    groupPromise.then(() => res.json({ redirect: '/finance' }));

    groupPromise.catch((err2) => {
      console.log(err2);
      if (err2.code === 11000) {
        return res.status(400).json({ error: 'Group already exists' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
    return groupPromise;
  });
};

// Get all groups of the user
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

const setGroup = (request, response) => {
  const req = request;
  const res = response;


  req.session.account.group = req.body.name;

  return res.json({ redirect: '/finance' });
};

module.exports.setGroup = setGroup;
module.exports.groupPage = groupPage;
module.exports.getGroups = getGroups;
module.exports.make = makeGroup;
