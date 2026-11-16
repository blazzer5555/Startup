const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const authCookieName = "token";
const express = require('express');
const app = express();
const {
  addNewGame,
  createUser,
  findGame,
  findUser,
  getGames,
  getHostedGames,
  removeUserToken,
  updateUserToken,
} = require('./database');

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

let apiRouter = express.Router();

app.use(cookieParser());
app.use(express.json());
app.use(`/api`, apiRouter);
app.use(express.static('public'));

apiRouter.get('/scenery', async (_req, res) => {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    res.status(503).send({ msg: 'The scenery image service is not configured.' });
    return;
  }

  const unsplashUrl = new URL('https://api.unsplash.com/photos/random');
  unsplashUrl.searchParams.set('query', 'forest mountain scenery');
  unsplashUrl.searchParams.set('orientation', 'landscape');

  const response = await fetch(unsplashUrl, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      'Accept-Version': 'v1',
    },
  });

  if (!response.ok) {
    res.status(502).send({ msg: 'Unable to load a scenery image from Unsplash.' });
    return;
  }

  const photo = await response.json();
  if (!photo.urls?.regular || !photo.user?.name || !photo.user?.links?.html || !photo.links?.html) {
    res.status(502).send({ msg: 'Unsplash returned incomplete photo information.' });
    return;
  }

  const photographerUrl = new URL(photo.user.links.html);
  photographerUrl.searchParams.set('utm_source', 'mount_wind');
  photographerUrl.searchParams.set('utm_medium', 'referral');
  const photoPageUrl = new URL(photo.links.html);
  photoPageUrl.searchParams.set('utm_source', 'mount_wind');
  photoPageUrl.searchParams.set('utm_medium', 'referral');

  res.send({
    imageUrl: photo.urls.regular,
    photographerName: photo.user.name,
    photographerUrl: photographerUrl.toString(),
    photoPageUrl: photoPageUrl.toString(),
  });
});

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
      const token = updateUserToken(user);
      setAuthCookie(res, token);
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

  removeUserToken(user);
  res.clearCookie(authCookieName);
  res.status(204).end();
});

apiRouter.post('/connect/host', verifyAuth, async (req, res) => {
    const { gameName, maxPlayers, privacyLevel, passcode } = req.body;
    const game = {
      gameName,
      maxPlayers,
      privacyLevel,
      passcode,
      host: req.authenticatedUser.email,
    };
    addNewGame(game);
    res.status(201).send({ msg: 'Ok' });
});

apiRouter.get('/connect/games', verifyAuth, async (req, res) => {
    res.status(200).send(getGames());
});

apiRouter.get('/connect/hosted', verifyAuth, async (req, res) => {
    res.status(200).send(getHostedGames(req.authenticatedUser.email));
});

apiRouter.put('/connect/join', verifyAuth, async (req, res) => {
    const { gameName, passcode } = req.body;
    const game = findGame(gameName);
    if (!game) {
        res.status(404).send({ msg: 'Game not found' });
        return;
    }
    if (game.privacyLevel === 'private' && game.passcode !== passcode) {
        res.status(401).send({ msg: 'Invalid passcode' });
        return;
    }
    res.status(200).send({ msg: 'Ok' });
});

apiRouter.put('/connect/resume', verifyAuth, async (req, res) => {
    const { gameName } = req.body;
    const game = findGame(gameName);
    if (!game) {
        res.status(404).send({ msg: 'Game not found' });
        return;
    }
    if (game.host !== req.authenticatedUser.email) {
        res.status(403).send({ msg: 'You are not the host of this game.' });
        return;
    }
    res.status(200).send({ msg: 'Ok' });
});

app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}