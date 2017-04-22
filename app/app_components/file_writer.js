const path = require('path');
const fs = require('fs');
const config = require(path.join(__dirname, 'app_config'));

const PATHMAP = {
  'settings_data.json': `./${config.paths.app_data}`
}

// Keep track of files currently being written
let currentFileWrites = [];

function init(fileInfo) {
  // Do not write file if file is in use
  if (!currentFileWrites.includes(fileInfo.fileName)) {
    currentFileWrites.push(fileInfo.fileName);
    console.info(`[File Write] Ok to write ${fileInfo.fileName}`);
    return startWrite(fileInfo)
      .then((fileName)=> {
        return writeComplete(fileName);
      })
      .catch((e)=> {
        console.error(`[File Writer] Error writing file ${fileInfo.fileName}`);
        return Promise.reject(e);
      });
  } else {
    console.warn(`[File Write] File ${fileInfo.fileName} is in use. Waiting...`);
    setTimeout(()=> init(fileInfo), 500);
  }
}

function writeComplete(fileName) {
  if (currentFileWrites.includes(fileName)) {
      console.info(`[File Write] ${fileName} written successfully!`);
      currentFileWrites.splice(currentFileWrites.indexOf(fileName), 1);
  } else {
    console.warn(`[File Write] FileWriter received 'complete' event on file that wasn't added to 'currentFileWrites'`);
  }
  return Promise.resolve(fileName);
}

function writeData(fileName, data) {
  return init({
    fileName: fileName,
    data: data
  });
}

function startWrite(fileInfo) {
  return new Promise((resolve, reject)=> {
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
    fs.writeFile(path.resolve(`${PATHMAP[fileInfo.fileName]}/${fileInfo.fileName}`), fileData, err => {
      if (err) {
        console.error(err);
        return;
      }
      resolve(fileInfo.fileName);
    });
  });
}

module.exports = {
  writeData
}