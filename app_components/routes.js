const config = require(path.join(__dirname, 'app_config'));
const render = require(path.join(__dirname, `render`));

// Keep track of last page that user was on (for cancel/go back commands)
let history = [];

// Regular Links
const routes = {
  index() {
    return goTo('index');
  },
  parts() {
    return goTo('parts');
  },
  settings() {
    return goTo('settings');
  },
  customers() {
    return goTo('customers');
  },
  login() {
    return goTo('login');
  },
  goBack() {
    return goBack();
  },
  cancel() {
    return goBack();
  },
  noRoute(action) {
    noRoute(action);
  }
}

function noRoute(action) {
  console.warn(`[Missing Route] ${action}`);
  Notifier.emit('show-notification', {
    icon: "report_problem",
    title: "Page Not Found",
    message: `The page you tried to navigate to wasn't found or there was an error rendering it.
      Please notify the app developers of this issue.`
  });
}

function goTo(templateName) {
  // Don't re-render the same template
  if (history[history.length - 1] !== templateName) {
    return render(templateName)
      .then(html => {
        Visualizer.emit('render-complete', html);
        addToHistory(templateName);
      })
      .catch(error => {
        console.warn(`[Render Error] ${error}`);
      });
  } else {
    return new Promise((resolve, reject) => {
      reject(`[Info] Already on ${templateName}`);
    });
  }
}

function goBack() {
  return goTo(history[length - 1] || history[0]);
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