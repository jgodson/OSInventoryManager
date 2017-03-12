const fs = require('fs');
const path = require('path');
const config = require(path.join(__dirname, 'app_config'));
const fileWriter = require(path.join(__dirname, 'fileWriter'));

const FILEMAP = {
  'settings_data.json': `./${config.paths.config_folder}`
}

fileWriter.on('startOk', info => {
  handleStartWrite(info);
});

fileWriter.on('startWait', info => {
  console.log("startWait");
});

function writeSettings(data) {
  console.log(data);
  // Name of settings data file
  const fileName = 'settings_data.json';

  fileWriter.emit('startCheck', {
    fileName: fileName,
    data: data
  });
}

function handleStartWrite(info) {
  console.log(path.resolve(`${FILEMAP[info.fileName]}/${info.fileName}`));
  fs.writeFile(`${FILEMAP[info.fileName]}/${info.fileName}`, JSON.stringify(info.data), err => {
    if (err) {
      console.error(err);
      return;
    }
    fileWriter.emit('complete', info.fileName);
  });
}

module.exports = {
  writeSettings
}