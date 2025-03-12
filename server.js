const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./db'); // Import the connectDB function from db.js
const User = require('./models/User');
const City = require('./models/City');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const axios = require('axios');
const cors = require('cors');
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

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

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send SMS alert
const sendSMSAlert = (to, message) => {
  twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: to
  });
};

// Function to send email alert
const sendEmailAlert = (to, subject, message) => {
  const msg = {
    to: to,
    from: process.env.SENDGRID_EMAIL,
    subject: subject,
    text: message,
  };
  sgMail.send(msg);
};

// Define the getWeatherData function
async function getWeatherData(city) {
    const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        throw error;
    }
}

// Routes
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).send('User registered');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).send(info.message);
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.send('Logged in');
    });
  })(req, res, next);
});

app.post('/cities', async (req, res) => {
  try {
    if (!req.isAuthenticated()) return res.status(401).send('Not authenticated');

    const { city } = req.body;
    const newCity = new City({ name: city, userId: req.user.id });
    await newCity.save();
    res.status(201).send('City saved');
  } catch (error) {
    console.error('Error saving city:', error);
    res.status(500).send('Error saving city');
  }
});

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{ role: 'system', content: 'You are a helpful weather assistant.' },
                 { role: 'user', content: userMessage }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ response: 'Sorry, something went wrong.' });
  }
});

// Example route to send alerts
app.post('/send-alert', (req, res) => {
  const { type, to, message } = req.body;
  if (type === 'sms') {
    sendSMSAlert(to, message);
  } else if (type === 'email') {
    sendEmailAlert(to, 'Weather Alert', message);
  }
  res.send('Alert sent');
});

// Example route to send emergency alerts
app.post('/send-emergency-alert', (req, res) => {
  const { to, message } = req.body;
  sendSMSAlert(to, message);
  res.send('Emergency alert sent');
});

// Example route to fetch weather data for map
app.get('/api/weather-data', async (req, res) => {
  const city = req.query.city || 'New York';
  try {
    const weatherData = await getWeatherData(city);
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

// Example route to save user preferences
app.post('/api/save-preferences', async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    await User.findByIdAndUpdate(userId, { preferences });
    res.send('Preferences saved');
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).send('Error saving preferences');
  }
});

// Example route to fetch user preferences
app.get('/api/preferences/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    res.json(user.preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).send('Error fetching preferences');
  }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
