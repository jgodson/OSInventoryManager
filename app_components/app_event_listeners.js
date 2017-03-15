const path = require('path');
const config = require(path.join(__dirname, '../app_components/app_config'));
const handlers = require(`../${config.paths.components_folder}/app_event_handlers`);
const remote = require('electron').remote;
const EventEmitter = require('events').EventEmitter;
const Visualizer = require(path.join(__dirname, `../${config.paths.components_folder}/Visualizer`));
const FileWriter = require(path.join(__dirname, `../${config.paths.components_folder}/FileWriter`));
const Notifier = require(path.join(__dirname, `../${config.paths.components_folder}/Notifier`));

// Document Element Selectors that are used frequently
const appRoot = document.querySelector('#app-root');
const notificationList = document.querySelector('#notification-list');

// TODO: Because this file is called in index.html everything is available globally.
// Need to move things into their own file that shouldn't be available like that

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
Visualizer.on('rendercomplete', (html)=> {
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

FileWriter.on('startCheck', (fileInfo)=> {
  // Do not write file if file is in use
  if (!currentFileWrites.includes(fileInfo.fileName)) {
    currentFileWrites.push(fileInfo.fileName);
    console.info(`[File Write] Ok to write ${fileInfo.fileName}`);
    FileWriter.emit('startOk', fileInfo);
  } else {
    console.warn(`[File Write] File ${fileInfo.fileName} is in use.`);
    FileWriter.emit('startWait', fileInfo);
  }
});

FileWriter.on('complete', (fileName)=> {
  if (currentFileWrites.includes(fileName)) {
      console.info(`[File Write] ${fileName} written successfully!`);
      currentFileWrites.splice(currentFileWrites.indexOf(fileName), 1);
  } else {
    console.warn(`[File Write] FileWriter received 'complete' event on file that wasn't added to 'currentFileWrites'`);
  }

  // Have to reload window for file changes to take effect
  remote.getCurrentWindow().reload();
});

Notifier.on('showNotification', (details)=> {
  /*
    Notification Schema = {
      id: (number) generated 
      timeout: (number) default: settings_data
      allow_hide: (bool) default: true (settings_data can override)
      icon_name: (string) default: "info" (material-icons only)
      title: (string) default: "Notification Title"
      message: (string) default: "Notification Message"
    }
  */
  handlers.notification.show(details);
});

Notifier.on('renderedNotification', (html, id)=> {
  $(notificationList).append(html);
  let _this = $(notificationList).find(`[data-id="${id}"]`);
  setTimeout(()=> _this.addClass('shown'), 100);
  let notificationTimeout = _this.attr('data-timeout');
  // If it doesn't timeout, it has to be closed by user
  if (notificationTimeout) {
    setTimeout(()=> {
      Notifier.emit('hideNotification', id);
    }, notificationTimeout);
  }
});

Notifier.on('hideNotification', (id)=> {
  let hiding = $(notificationList).find(`[data-id="${id}"]`);
  hiding.removeClass('shown');
  setTimeout(()=> {
    hiding.remove();
  }, 300);
});

$(document).on('click', '.notification-close', function(evt) {
  let id = $(this).closest('.notification').attr('data-id');
  Notifier.emit('hideNotification', id);
});

$(document).on('click', 'a[href]:not(a[href="#"])', function(evt) {
  evt.preventDefault();
  appRoot.classList.remove('delay', 'delay-done');
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