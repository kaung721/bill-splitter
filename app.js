require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const hbs = require('hbs');
const methodOverride = require('method-override');
const flash = require('connect-flash');

const { connectDB } = require('./config/database');
const passportConfig = require('./config/passport');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const roommatesRouter = require('./routes/roommates.js');
const billsRouter = require('./routes/bills');
const itemsRouter = require('./routes/items');
const summaryRouter = require('./routes/summary');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');

const app = express();

// connect DB
connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// register partials
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// register helpers
hbs.registerHelper('formatCents', function(cents) {
  return (cents / 100).toFixed(2);
});
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

// middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// sessions with Mongo store
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  ttl: 14 * 24 * 60 * 60 // 14 days
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard-cat',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    secure: process.env.NODE_ENV === 'production'
  }
}));

// flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});


// passport
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// expose user to views
app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  next();
});

// routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/roommates', roommatesRouter);
app.use('/bills', billsRouter);
app.use('/items', itemsRouter);
app.use('/summary', summaryRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);

// 404
app.use((req, res) => {
  res.status(404).render('index', { error: 'Page not found' });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.render('index', { error: 'Server error' });
});

module.exports = app;
