const fs = require('fs');
const path = require('path');
const config = require(path.join(__dirname, 'app_config'));
const fileWriter = require(path.join(__dirname, 'fileWriter'));

const FILEMAP = {
  'settings_data.json': `./${config.paths.app_data}`
}

fileWriter.on('startOk', fileInfo => {
  handleStartWrite(fileInfo);
});

fileWriter.on('startWait', fileInfo => {
  // TODO, try again after a certain amount of time?
  console.log("startWait");
});

function writeData(fileName, data) {
  fileWriter.emit('startCheck', {
    fileName: fileName,
    data: data
  });
}

function handleStartWrite(fileInfo) {
  // Get the file extension
  const fileExt = fileInfo.fileName.split('.')[1];

  // Do specific things to the data depending on file type
  let fileData = undefined;
  switch (fileExt) {
    case 'json':
      fileData = JSON.stringify(fileInfo.data);
      break;
    default:
      fileData = fileInfo.data;
      break;
  }

  // Write the file
  fs.writeFile(path.resolve(`${FILEMAP[fileInfo.fileName]}/${fileInfo.fileName}`), fileData, err => {
    if (err) {
      console.error(err);
      return;
    }
    fileWriter.emit('complete', fileInfo.fileName);
  });
}

module.exports = {
  writeData
}