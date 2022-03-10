const express = require('express');
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const getVideos = () => {
  const videos = fs.readFileSync('./data/videos.json');
  return JSON.parse(videos);
}

// UPDATE TO CHANGE COMMENT
const saveVideos = (videos) => {
  fs.writeFileSync('./data/videos.json', JSON.stringify(videos))
}

router.route('/')
  .get((_req, res) => {
    let formattedVideos = getVideos()
      .map(video => {
        return {
          "id": video.id,
          "channel": video.channel,
          "image": video.image,
          "title": video.title
        }
      })

    res.status(200).json(formattedVideos)
  });

router.get('/:videoId', (req, res) => {
  const individualVideo = getVideos().find(video => video.id === req.params.videoId);

  if (!individualVideo) {
    res.status(404).json({
      message: "Team not found"
    })
    return;
  }

  res.status(200).json(individualVideo)
})


// app.post("/videos", (req, res) => {

// });

module.exports = router;