const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// sets port
const PORT = process.env.PORT || 9000;

// MIDDLEWARE
// needed to access req.body
app.use(express.json());
// access to 'public' folder on the server
app.use(express.static('public'));
// allows cross origin resource sharing
app.use(cors());
app.use(helmet());

// Routes
const videoRoutes = require('./routes/videos-routes.js');
app.use('/videos', videoRoutes);

// listen
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`server is running on port ${PORT}`);
})