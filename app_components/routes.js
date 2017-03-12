const config = require(path.join(__dirname, 'app_config'));
const render = require(path.join(__dirname, `render`));

// Keep track of last page that user was on (for cancel/go back commands)
let history = [];

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
  customers(params) {
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
    console.log(history);
}

module.exports = routes;