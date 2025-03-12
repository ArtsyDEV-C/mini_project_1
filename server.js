const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./db');
const User = require('./models/User');
const City = require('./models/City');
const methodOverride = require('method-override');
const axios = require('axios');
const cors = require('cors');
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');
const MongoStore = require('connect-mongo');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// Serve static files
app.use(express.static('public'));

// Twilio setup
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// SendGrid setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send SMS Alert
const sendSMSAlert = async (to, message) => {
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};

// Send Email Alert
const sendEmailAlert = async (to, subject, message) => {
  try {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_EMAIL,
      subject,
      text: message
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Weather API Proxy
app.get('/api/weather/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching weather data');
  }
});

// User Registration
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Registration failed');
  }
});

// User Login
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.send('Logged in successfully');
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful weather assistant.' },
        { role: 'user', content: userMessage }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error processing chat request');
  }
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});