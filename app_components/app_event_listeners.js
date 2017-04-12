const path = require('path');
const config = require(path.join(__dirname, '../app_components/app_config'));
const handlers = require(path.join(__dirname, `../${config.paths.components_folder}/app_event_handlers`));
const Visualizer = require(path.join(__dirname, `../${config.paths.components_folder}/Visualizer`));
const Notifier = require(path.join(__dirname, `../${config.paths.components_folder}/Notifier`));

// Document Element Selectors that are used frequently
const appRoot = document.querySelector('#app-root');
const notificationList = document.querySelector('#notification-list');

// TODO: prepend the current time to the log here and log to a file instead

let logs = [];

// Overwrite console.log, error, info and warn to log to file as well
let realConsole = {
  log: console.log,
  error: console.error,
  info: console.info,
  warn: console.warn
};

// console.info = function() {
//   logs.push(arguments[0]);
//   return realConsole.info.apply(console, arguments);
// }

// console.error = function() {
//   logs.push(arguments[0]);
//   return realConsole.error.apply(console, arguments);
// }

// console.log = function() {
//   logs.push(arguments[0]);
//   return realConsole.log.apply(console, arguments);
// }

// console.warn = function() {
//   logs.push(arguments[0]);
//   return realConsole.warn.apply(console, arguments);
// }

// Keep track of the delay after page loads to allow for animations
let delay = undefined;

// Shows rendered html on the page
Visualizer.on('render-complete', (html)=> {
  appRoot.classList.remove('delay', 'delay-done');
  appRoot.innerHTML = html;

  // Init Material Design Elements
  $.material.init();

  // Adding a class after a short delay allows animations since we replace HTML
  delayForAnimations();
  
  // Fire unload Event
  documentEvent('unload');

  // Run any page specific scripts
  $('.page-script').each((index, script)=> {
    eval(script.text);
  });

  // Fire load Event
  documentEvent('load');
});

Notifier.on('show-notification', (details)=> {
  /*
    Notification Schema = {
      id: (number) - generated 
      type: (string)(optional) - "warning" or "success"
      timeout: (number)(optional) - milliseconds to display for - default: from settings_data
      allow_hide: (bool)(optional) - default: true (settings_data can override)
      icon: (string)(optional) - default: "info" (material-icons only)
      title: (string) - default: "Notification Title"
      message: (string) - default: "Notification Message"
    }
  */
  handlers.notification.show(details);
});

Notifier.on('rendered-notification', (html, id)=> {
  $(notificationList).append(html);
  let _this = $(notificationList).find(`[data-id="${id}"]`);
  setTimeout(()=> _this.addClass('shown'), 100);
  let notificationTimeout = _this.attr('data-timeout');
  // If it doesn't timeout, it has to be closed by user
  if (notificationTimeout) {
    setTimeout(()=> {
      Notifier.emit('hide-notification', id);
    }, notificationTimeout);
  }
});

Notifier.on('hide-notification', (id)=> {
  let hiding = $(notificationList).find(`[data-id="${id}"]`);
  hiding.removeClass('shown');
  setTimeout(()=> {
    hiding.remove();
  }, 300);
});

$(document).on('click', '.notification-close', function(evt) {
  let id = $(this).closest('.notification').attr('data-id');
  Notifier.emit('hide-notification', id);
});

$(document).on('click', 'a[href]:not(a[href="#"])', function(evt) {
  evt.preventDefault();
  handlers.navigateTo(evt);
});

// Handle form submissions
$(document).on('submit', 'form', function(evt) {
  evt.preventDefault();
  let $form = $(this).closest('form');
  let action = $form.attr('action');
  let data = formToJSON($form.serializeArray());
  handlers.formSubmit(action, data);

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

function delayForAnimations() {
  appRoot.classList.add('delay');
  if (delay) {
    // Reset delay timer
    clearTimeout(delay);
    delay = setTimeout(()=> {
      appRoot.classList.add('delay-done');
      delay = undefined;
    }, 100);
  } else {
    delay = setTimeout(()=> {
      appRoot.classList.add('delay-done');
      delay = undefined;
    }, 100);
  }
}

function documentEvent(name) {
  document.dispatchEvent(new Event(name));
}