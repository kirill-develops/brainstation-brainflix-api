const express = require('express');
const app = express();
const cors = require('cors')

// middleware
// needed to access req.body
app.use(express.json());
// access to 'public' folder on the server
app.use(express.static('public'));
// allows cross origin resource sharing
app.use(cors());

// Routes
const videosRoutes = require('./routes/videos');
app.use('/videos', videosRoutes);

// listen
app.listen(8080, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("server is running on port 8080");
})