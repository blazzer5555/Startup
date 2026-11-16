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

async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username,
    password: passwordHash,
    token: uuid.v4(),
  };
  await usersCollection.insertOne(user);
  return user;
}

async function findUser(field, value) {
  if (!value) return null;
  return usersCollection.findOne({ [field]: value });
}

async function updateUserToken(user) {
  const token = uuid.v4();
  const result = await usersCollection.updateOne(
    { _id: user._id, token: { $exists: false } },
    { $set: { token } }
  );
  return result.matchedCount === 1 ? token : null;
}

async function removeUserToken(user) {
  await usersCollection.updateOne(
    { _id: user._id, token: user.token },
    { $unset: { token: '' } }
  );
}

async function addNewGame(game) {
  await gamesCollection.insertOne(game);
}

async function getGames() {
  return gamesCollection.find().toArray();
}

function getHostedGames(username) {
  return allGames.filter((game) => game.host === username);
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