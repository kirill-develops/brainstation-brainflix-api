const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videos-controller');

router.route('/')
  .get(videoController.getAllVids)
  .post(videoController.addVid);

router.get('/:videoId', videoController.getVid);

router.put('/:videoId/likes', videoController.toggleLike);

router.post('/:videoId/comments', videoController.addComment);

router.delete('/:videoId/comments/:commentId', videoController.deleteComment);

module.exports = router;