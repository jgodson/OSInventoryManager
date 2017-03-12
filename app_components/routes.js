const config = require(path.join(__dirname, 'app_config'));
const render = require(path.join(__dirname, `render`));
const file = require(path.join(__dirname, 'file_ops'));

// Keep track of last page that user was on (for cancel/go back commands)
let history = [];

// Regular Links
const routes = {
  index() {
    handleNavRoute('index');
  },
  parts() {
    handleNavRoute('parts');
  },
  settings() {
    handleNavRoute('settings');
  },
  customers() {
    handleNavRoute('customers');
  },
  goBack() {
    handleGoBack();
  },
  cancel() {
    handleGoBack();
  },
  noRoute(action) {
    handleNoRoute(action);
  }
}

// Form Submissions
routes.forms = {
  settings_save(formData) {
    handleSettingsSave(formData);
  }
}

function handleNoRoute(action) {
  console.warn(`[Missing Route] ${action}`);
}

function handleNavRoute(templateName) {
  if (history[history.length] !== templateName) {
    addToHistory(templateName);
    render(templateName)
        .then(html => visualizer.emit('rendercomplete', html));
  }
}

function handleSettingsSave(formData) {
  file.writeSettings(formData);
}

function handleGoBack() {
  handleNavRoute(history[length - 1] || history[0]);
}

function addToHistory(templateName) {
  if ( history.length < 2 ) {
    history.push(templateName);
  } else {
    history.shift();
    history.push(templateName)
  }
}

module.exports = routes;