const fs = require('fs');
const path = require('path');

const fixtures = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures.json'), 'utf8'));

// Helper to get company IDs
const compA = Object.keys(fixtures.companies).find(id => fixtures.companies[id].code === 'A');
const compB = Object.keys(fixtures.companies).find(id => fixtures.companies[id].code === 'B');

module.exports = {
  fixtures,
  compA,
  compB,
  usersA: fixtures.companies[compA].users,
  usersB: fixtures.companies[compB].users,
  entitiesA: fixtures.companies[compA].entities,
  entitiesB: fixtures.companies[compB].entities,
};
