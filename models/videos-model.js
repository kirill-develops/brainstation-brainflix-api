const fs = require("fs");

const filePath = './data/videos.json';

// function to get videos from JSON file
exports.getVideos = () => {
  const vidArr = fs.readFileSync(filePath);
  return JSON.parse(vidArr);
};

// function to save video arr to JSON file
exports.saveVideos = (vidArr) => {
  fs.writeFileSync(filePath, JSON.stringify(vidArr))
};