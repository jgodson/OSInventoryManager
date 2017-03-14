const path = require('path');
const config = require(path.join(__dirname, '../app_components/app_config'));
const handlers = require(`../${config.paths.components_folder}/app_event_handlers`);
const remote = require('electron').remote;
const appRoot = document.querySelector('#app-root');
const EventEmitter = require('events').EventEmitter;
const visualizer = new EventEmitter();
const fileWriter = require(`../${config.paths.components_folder}/fileWriter`);

// TODO: put the console overwrites in it's own file
// Also I can prepend the current time to the log here

let logs = [];

// Overwrite console.log, error, infom and warn to log to file as well
let realConsole = {
  log: console.log,
  error: console.error,
  info: console.info,
  warn: console.warn
};

console.info = function() {
  logs.push(arguments[0]);
  return realConsole.info.apply(console, arguments);
}

console.error = function() {
  logs.push(arguments[0]);
  return realConsole.error.apply(console, arguments);
}

console.log = function() {
  logs.push(arguments[0]);
  return realConsole.log.apply(console, arguments);
}

console.warn = function() {
  logs.push(arguments[0]);
  return realConsole.warn.apply(console, arguments);
}

// Keep track of files currently being written
let currentFileWrites = [];

// Keep track of the delay after page loads to allow for animations
let delay = undefined;

// Shows rendered html on the page
visualizer.on('rendercomplete', (html)=> {
  appRoot.innerHTML = html;
  // Init Material Design Elements
  $.material.init();
  // Adding a class after a short delay allows animations since we replace HTML
  appRoot.classList.add('delay');
  if (delay) {
    // Reset delay timer
    clearTimeout(delay);
    delay = setTimeout( ()=> {
      appRoot.classList.add('delay-done');
      delay = undefined;
    }, 100);
  } else {
    delay = setTimeout( ()=> {
      appRoot.classList.add('delay-done');
      delay = undefined;
    }, 100);
  }
});

fileWriter.on('startCheck', (fileInfo)=> {
  // Do not write file if file is in use
  if (!currentFileWrites.includes(fileInfo.fileName)) {
    currentFileWrites.push(fileInfo.fileName);
    console.info(`[File Write] Ok to write ${fileInfo.fileName}`);
    fileWriter.emit('startOk', fileInfo);
  } else {
    console.warn(`[File Write] File ${fileInfo.fileName} is in use.`);
    fileWriter.emit('startWait', fileInfo);
  }
});

fileWriter.on('complete', (fileName)=> {
  if (currentFileWrites.includes(fileName)) {
      console.info(`[File Write] ${fileName} written successfully!`);
      currentFileWrites.splice(currentFileWrites.indexOf(fileName), 1);
  } else {
    console.warn(`[File Write] fileWriter received 'complete' event on file that wasn't added to 'currentFileWrites'`);
  }

  // Have to reload window for file changes to take effect
  remote.getCurrentWindow().reload();
});

$(document).on('click', 'a[href]:not(a[href="#"])', function(evt) {
  appRoot.classList.remove('delay', 'delay-done');
  evt.preventDefault();
  handlers.navigation(evt);
});

// Handle form submissions
$(document).on('submit', 'form', function(evt) {
  evt.preventDefault();
  appRoot.classList.remove('delay', 'delay-done');
  let $form = $(this).closest('form');
  let action = $form.attr('action');
  let data = formToJSON($form.serializeArray());
  handlers.form(action, data);

  // Converts form data in an array to JSON
  function formToJSON(data) {
    let formObj = {};
    data.forEach((formInput)=> {
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

// Allow non standard elements to submit forms
$(document).on('click', '[type="submit"]:not(input, button)', function() {
  $(this).closest('form').trigger('submit');
});

// Toggle Checkboxes and set value attribute
$(document).on('click', '.checkbox', function() {
  let checkbox = this.querySelector('input');
  if (checkbox.value === "true") {
    checkbox.value = "false";
    checkbox.checked = false;
  } else {
    checkbox.value = "true";
    checkbox.checked = true;
  }
});