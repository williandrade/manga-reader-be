import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import jwt from 'jsonwebtoken';
import HomeRoute from './routes/home';
import MangaRoute from './routes/manga';

const SECRET_KEY = 'w1b231312ce3b98e4asc12f6a9d867dkxcoc0c6835164';

const user = {
  id: 1,
  username: 'api',
  password: 'my-password',
};

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
passport.use(
  new BearerStrategy((token, done) => {
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
      if (decoded.id === user.id) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(null, false);
    }
  })
);

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === user.username && password === user.password) {
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.send({ token });
  } else {
    res.status(401).send({ error: 'Invalid username or password' });
  }
});

app.get('/', (req, res) => {
  res.send('Nothing to see here :P');
});

app.use('/home', HomeRoute);
app.use('/manga', MangaRoute);

// app.get('/protected', passport.authenticate('bearer', { session: false }), (req, res) => {
//   res.send('You have accessed a protected route!');
// });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
