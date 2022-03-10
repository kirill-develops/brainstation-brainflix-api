const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));


app.listen(8080, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  app.get("/videos", (req, res) => {

  });

  app.get("/videos/:videoId", (req, res) => {

  });

  app.post("/videos", (req, res) => {

  });

  console.info("Server running on 8080...");
});