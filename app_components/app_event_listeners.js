const path = require('path');
const config = require(path.join(__dirname, '../app_components/app_config'));
const handlers = require(`../${config.paths.components_folder}/app_event_handlers`);
const remote = require('electron').remote;
const appRoot = document.querySelector('#app-root');
const EventEmitter = require('events').EventEmitter;
const visualizer = new EventEmitter();
const fileWriter = require(`../${config.paths.components_folder}/fileWriter`);

let currentFileWrites= [];

// Shows rendered html on the page
visualizer.on('rendercomplete', html => {
  appRoot.innerHTML = html;
});

fileWriter.on('startCheck', info => {
  // Do not write file if file is in use
  if (!currentFileWrites.includes(info.fileName)) {
    currentFileWrites.push(info.fileName);
    fileWriter.emit('startOk', info);
  } else {
    fileWriter.emit('startWait', info);
  }
});

fileWriter.on('complete', fileName => {
  if (currentFileWrites.includes(fileName)) {
      console.log(`${fileName} written successfully`);
      currentFileWrites.splice(currentFileWrites.indexOf(fileName), 1);
  } else {
    console.error(`fileWriter received 'complete' event on file that never sent 'startCheck' event`);
  }

  // Have to reload window for file changes to take effect
  remote.getCurrentWindow().reload();
});

$(document).on('click', 'a[href]:not(a[href="#"])', function(evt) {
  evt.preventDefault();
  handlers.navigation(evt);
});

$(document).on('click', '[type="submit"]', function(evt) {
  evt.preventDefault();
  let $form = $(this).closest('form');
  let action = $form.attr('action');
  let data = formToJSON($form.serializeArray());
  handlers.form(action, data);

  function formToJSON(data) {
    let formObj = {};
    data.forEach((formInput) => {
      formInput.name = formInput.name.split('-');
      let namespace = formInput.name[0];
      let name = formInput.name[1];
      if (typeof formObj[namespace] === 'object') {
        formObj[namespace][name] = formInput.value;
      } else {
        formObj[namespace] = {};
        formObj[namespace][name] = formInput.value;
      }
    });
    return formObj;
  }
});