const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const authCookieName = "token";
const express = require('express');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    req.authenticatedUser = user;
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// Can use "apiRouter.use('/connect', verifyAuth);" to call verifyAuth for all/connect routes.

let apiRouter = express.Router();
let users = [];
let allGames = [];

app.use(cookieParser());
app.use(express.json());
app.use(`/api`, apiRouter);
app.use(express.static('public'));

apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);

    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (!user) {
    res.clearCookie(authCookieName);
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }

  delete user.token;
  res.clearCookie(authCookieName);
  res.status(204).end();
});

apiRouter.post('/connect/game', verifyAuth, async (req, res) => {
    const { gameName, maxPlayers, privacyLevel, passcode } = req.body;
    const game = {
      gameName,
      maxPlayers,
      privacyLevel,
      passcode,
      host: req.authenticatedUser.email,
    };
    allGames.push(game);
    res.status(201).send({ msg: 'Ok' });
});

apiRouter.get('/connect/games', verifyAuth, async (req, res) => {
    res.send([
        {
            id: 'n29mowb3',
            name: 'Lol Lmao',
            hostUsername: 'Dimingus',
            currentPlayers: 2,
            maxPlayers: 10,
            privacyLevel: 'Public',
        },
        {
            id: '01pvnb61',
            name: 'Just hop on iN',
            hostUsername: 'Silencce',
            currentPlayers: 1,
            maxPlayers: 4,
            privacyLevel: 'Public',
        },
        {
            id: 'l172vsjd',
            name: 'Sir Thieves',
            hostUsername: 'Aavalos',
            currentPlayers: 5,
            maxPlayers: 5,
            privacyLevel: 'Private',
        },
    ]);
});

apiRouter.get('/connect/hosted', verifyAuth, async (req, res) => {
    res.send([
        {
            id: '51vxphbq',
            name: 'Your game',
            maxPlayers: 1,
            privacyLevel: 'Private',
            passcode: '12345',
        },
    ]);
});

app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

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

  return users.find((u) => u[field] === value);
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}