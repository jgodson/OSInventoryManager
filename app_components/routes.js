const config = require(path.join(__dirname, 'app_config'));
const render = require(path.join(__dirname, `render`));

// Keep track of last page that user was on (for cancel/go back commands)
let history = [];

const routes = {
  index() {
    handleNavRoute('index');
  },
  settings() {
    handleNavRoute('settings');
  },
  customers() {
    handleNavRoute('customers');
  },
  cancel() {
    handleGoBack();
  },
  noRoute(action) {
    handleNoRoute(action);
  }
}

function handleNoRoute(action) {
  console.warn(`[Missing Route] ${action}`);
}

function handleNavRoute(templateName, add = true) {
  if (add) {
    addToHistory(templateName);
  }
  render(templateName)
      .then(html => visualizer.emit('rendercomplete', html));
}

function handleGoBack() {
  console.log('history', history);
  handleNavRoute(history[length - 1] || history[0], false);
}

function addToHistory(templateName) {
  console.log('addToHistory', templateName);
  if ( history.length < 2 ) {
    history.push(templateName);
  } else {
    history.shift();
    history.push(templateName)
  }
    console.log(history);
}

module.exports = routes;