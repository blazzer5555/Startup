const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

const client = new MongoClient(url);
const db = client.db('TheTreasureOfMountWind');
const usersCollection = db.collection('users');
const gamesCollection = db.collection('games');

(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connected to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  users.push(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  return users.find((user) => user[field] === value);
}

function updateUserToken(user) {
  user.token = uuid.v4();
  return user.token;
}

function removeUserToken(user) {
  delete user.token;
}

function addNewGame(game) {
  allGames.push(game);
}

function getGames() {
  return allGames.map(({ gameName, maxPlayers, privacyLevel, host }) => ({
    gameName,
    maxPlayers,
    privacyLevel,
    host,
  }));
}

function getHostedGames(email) {
  return allGames.filter((game) => game.host === email);
}

function findGame(gameName) {
  return allGames.find((game) => game.gameName === gameName);
}

module.exports = {
  addNewGame,
  createUser,
  findGame,
  findUser,
  getGames,
  getHostedGames,
  removeUserToken,
  updateUserToken,
};