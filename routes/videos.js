const express = require('express');
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const getVideos = () => {
  const videos = fs.readFileSync('./data/videos.json');
  return JSON.parse(videos);
}

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
  })
  .post((req, res) => {
    // Create obj of video Database
    let formattedVideos = getVideos()
      .map(video => {
        return {
          "channel": video.channel,
          "comments": video.comments,
          "description": video.description,
          "duration": video.duration,
          "id": video.id,
          "image": video.image,
          "likes": video.likes,
          "timestamp": video.timestamp,
          "title": video.title,
          "video": video.video,
          "views": video.views
        }
      })

    // Deconstruct POST req from client
    const { title, channel, image, video, description } = req.body;

    // Create timestamp for client POST req
    const timestamp = Date.now();

    // Create obj for client POST req
    const newVid = {
      "channel": channel,
      "comments": [],
      "description": description,
      "duration": '0:00',
      "id": uuidv4(),
      "image": image,
      "likes": '0',
      "timestamp": timestamp,
      "title": title,
      "video": video,
      "views": 0
    }

    // add new POST Obj to current database Obj
    formattedVideos.push(newVid);
    // console.log(formattedVideos);
    saveVideos(formattedVideos);

    res.status(200).json(newVid);
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

router.put('/:videoId/likes', (req, res) => {

  // Create obj of video Database
  let formattedVideos = getVideos()
    .map(video => {
      return {
        "channel": video.channel,
        "comments": video.comments,
        "description": video.description,
        "duration": video.duration,
        "id": video.id,
        "image": video.image,
        "likes": video.likes,
        "timestamp": video.timestamp,
        "title": video.title,
        "video": video.video,
        "views": video.views
      }
    })

  // Deconstruct POST req from client
  const { videoId } = req.params;
  const { liked } = req.body;

  const likedVid = formattedVideos.find((vid) => vid.id === videoId);
  const likedIndex = formattedVideos.findIndex(vid => vid.id === videoId);

  liked === false ? likedVid.likes++ : likedVid.likes--;

  formattedVideos.splice(likedIndex, 1, likedVid);

  saveVideos(formattedVideos);

  const resp = [!liked, likedVid]
  res.status(200).json(resp);
})

router.post('/:videoId/comments', (req, res) => {

  // Create obj of video Database
  let formattedVideos = getVideos()
    .map(video => {
      return {
        "channel": video.channel,
        "comments": video.comments,
        "description": video.description,
        "duration": video.duration,
        "id": video.id,
        "image": video.image,
        "likes": video.likes,
        "timestamp": video.timestamp,
        "title": video.title,
        "video": video.video,
        "views": video.views
      }
    })

  // Deconstruct POST req from client
  const { id, name, comment } = req.body;

  // Create timestamp for client POST req
  const timestamp = Date.now();

  // create newComment obj
  const newComment = {
    'comment': comment,
    'id': uuidv4(),
    'likes': 0,
    'name': name,
    'timestamp': timestamp
  };

  // create vidObj from going through databaseObj & matching req Id
  const vidObj = formattedVideos.find(vid => vid.id === id);

  // push new comment to vidObj
  vidObj.comments.push(newComment);

  const likedIndex = formattedVideos.findIndex(vid => vid.id === id)
  formattedVideos.splice(likedIndex, 1, vidObj)

  // save new database JSON
  saveVideos(formattedVideos);

  // send client vidObj w/ new comment
  res.status(200).json(vidObj);
});

router.delete('/:videoId/comments/:commentId', (req, res) => {
  // Create obj of video Database
  let formattedVideos = getVideos()
    .map(video => {
      return {
        "channel": video.channel,
        "comments": video.comments,
        "description": video.description,
        "duration": video.duration,
        "id": video.id,
        "image": video.image,
        "likes": video.likes,
        "timestamp": video.timestamp,
        "title": video.title,
        "video": video.video,
        "views": video.views
      }
    });

  // Deconstruct POST req from client
  const { videoId, commentId } = req.params;

  // create vidObj from going through databaseObj & matching param videoId
  const vidObj = formattedVideos.find(vid => vid.id === videoId);

  // create newComments obj by filtering all comments not matching comment Id param
  const newComments = vidObj.comments.filter(comment => comment.id !== commentId);

  // replace old comments with new comments
  vidObj.comments = newComments;

  const likedIndex = formattedVideos.findIndex(vid => vid.id === videoId)
  formattedVideos.splice(likedIndex, 1, vidObj)

  // save new database JSON
  saveVideos(formattedVideos);

  // send client vidObj w/ new comment
  res.status(200).json(vidObj);
})

module.exports = router;