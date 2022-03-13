const { v4: uuidv4 } = require('uuid');
const vidModel = require('../models/videos-model')

// function to create a video obj
const createVid = (vid) => {
  return ({
    "channel": vid.channel,
    "comments": vid.comments,
    "description": vid.description,
    "duration": vid.duration,
    "id": vid.id,
    "image": vid.image,
    "likes": vid.likes,
    "timestamp": vid.timestamp,
    "title": vid.title,
    "video": vid.video,
    "views": vid.views
  })
}


exports.getAllVids = (_req, res) => {

  // create modified array of essential info to send to client
  const vidArr = vidModel.getVideos()
    .map(vid => {
      return {
        "id": vid.id,
        "channel": vid.channel,
        "image": vid.image,
        "title": vid.title
      }
    })
  console.log('GET "/" success');
  console.log('CLIENT_RES: vidArr');
  res.status(200).json(vidArr)
};

exports.addVid = (req, res) => {
  // Create obj of video Database
  const vidArr = vidModel.getVideos()
    .map(vid => createVid(vid))

  // Deconstruct POST req from client
  const { title, channel, image, video, description } = req.body;

  // verification of data
  if (!title && !channel && !image && !video && !description) {
    console.log('CLIENT_ERROR: Empty req.body');
    console.log('CLIENT_RES: no Entry recieved');
    return res.status(204).json({ message: "No entry recieved" });
  } else if (!title || !channel || !image || !video || !description) {
    console.log('CLIENT_ERROR: Partial req.body');
    console.log('CLIENT_RES: Incomplete Entry recieved');
    return res.status(206).json({ message: "Incomplete entry recieved" });
  }

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
    "likes": 0,
    "timestamp": timestamp,
    "title": title,
    "video": video,
    "views": 0
  }

  // add new POST Obj to current database Obj
  vidArr.push(newVid);
  vidModel.saveVideos(vidArr);

  console.log('POST "/" success');
  console.log('CLIENT_RES: newVid');
  res.status(201).json(newVid);
};

exports.getVid = (req, res) => {
  // find video by matching id with req params & set it to const value
  const vidObj = vidModel.getVideos()
    .find(vid => vid.id === req.params.videoId);

  // if no video, return 404 error
  if (!vidObj) {
    console.log('CLIENT_ERROR: Video not found');
    console.log('CLIENT_RES: Video not found');
    return res.status(404).json({ message: "Video not found" });
  }

  //send vidObj as response
  console.log('GET "/:videoId" success');
  console.log('CLIENT_RES: vidObj');
  res.status(200).json(vidObj);
};

exports.toggleLike = (req, res) => {

  // Create obj of video Database
  const vidArr = vidModel.getVideos()
    .map(vid => createVid(vid))

  // Deconstruct POST req from client
  const { videoId } = req.params;
  const { liked } = req.body;

  // create likedVid obj by finding vid id
  const likedVid = vidArr.find((vid) => vid.id === videoId);

  // if no video, return 404 error
  if (!likedVid) {
    console.log('CLIENT_ERROR: Video not found');
    console.log('CLIENT_RES: Video not found');
    res.status(404).json({ message: "Video not found" });
    return;
  }

  // find index value of likedVid
  const likedIndex = vidArr.findIndex(vid => vid.id === videoId);

  // if the video is previously liked, reduce like by 1 and vice versa 
  liked === false ? likedVid.likes++ : likedVid.likes--;

  //remove previous video value and replace it with new video
  vidArr.splice(likedIndex, 1, likedVid);
  vidModel.saveVideos(vidArr);

  //create response file & send response
  console.log('PUT "/:videoId/likes" success');
  console.log('CLIENT_RES: respObj');
  const resp = [!liked, likedVid];
  res.status(202).json(resp);
};

exports.addComment = (req, res) => {

  // Create obj of video Database
  const vidArr = vidModel.getVideos()
    .map(vid => createVid(vid))

  // Deconstruct POST req from client
  const { id, name, comment } = req.body;

  // create vidObj from going through databaseObj & matching req Id
  const vidObj = vidArr.find(vid => vid.id === id);

  // verification of data
  if (!vidObj) {
    console.log('CLIENT_ERROR: Video not found');
    console.log('CLIENT_RES: Video not found');
    return res.status(404).json({ message: "Video not found" });
  } else if (!name && !id && !comment) {
    console.log('CLIENT_ERROR: Empty req.body');
    console.log('CLIENT_RES: no Entry recieved');
    return res.status(204).json({ message: "Missing entry" });
  } else if (!name || !id || !comment) {
    console.log('CLIENT_ERROR: Partial req.body');
    console.log('CLIENT_RES: Incomplete recieved');
    return res.status(206).json({ message: "Incomplete entry" });
  }

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

  // push new comment to vidObj
  vidObj.comments.push(newComment);

  // find index of video commented and replace old vidObj with new vidObj
  const vidIndex = vidArr.findIndex(vid => vid.id === id)
  vidArr.splice(vidIndex, 1, vidObj)

  // save new database JSON
  vidModel.saveVideos(vidArr);

  // send client vidObj w/ new comment
  console.log('POST "/:videoId/comments" success');
  console.log('CLIENT_RES: vidObj');
  res.status(201).json(vidObj);
}

exports.deleteComment = (req, res) => {

  // Create obj of video Database
  const vidArr = vidModel.getVideos()
    .map(vid => createVid(vid));

  // Deconstruct POST req from client
  const { videoId, commentId } = req.params;

  // create vidObj from going through databaseObj & matching param videoId
  const vidObj = vidArr.find(vid => vid.id === videoId);

  // if no vidObj, return 404 error
  if (!vidObj) {
    console.log('CLIENT_ERROR: Video not found');
    console.log('CLIENT_RES: Video not found');
    return res.status(404).json({ message: "Video not found" });
  }

  // create newComments obj by filtering all comments not matching comment Id param
  const commentsArr = vidObj.comments.filter(comment => comment.id !== commentId);

  // replace old comments with new comments
  vidObj.comments = commentsArr;

  // find index of commented vid and replace old vidObj with modified vidObj
  const vidIndex = vidArr.findIndex(vid => vid.id === videoId);
  vidArr.splice(vidIndex, 1, vidObj);

  // save new database JSON
  vidModel.saveVideos(vidArr);

  // send client vidObj w/ new comment
  console.log('DELETE "/:videoId/comments/:commentId" success');
  console.log('CLIENT_RES: vidObj');
  res.status(200).json(vidObj);
};