const config = require(path.join(__dirname, 'app_config'));
const render = require(path.join(__dirname, `render`));

const FORWARDS = {
  customers: require(path.join(__dirname, './routes/customers'))
}

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
  customers(action) {
    return forward('customers', action);
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

function forward(primary, secondary) {
  // Split into secondary [0] and attribute [1] (id, etc)
  secondary = secondary.split('/');
  let forwardTo = FORWARDS[primary];
  if (forwardTo) {
    if (typeof forwardTo[secondary[0]] === 'string') {
      return goTo(forwardTo[secondary[0]]);
    } else if (typeof forwardTo[secondary[0]] === 'function') {
      // Call function with attribute
      return forwardTo[secondary[0]](secondary[1])
        .then((details)=> {
          return goTo(`${primary}_${secondary[0]}`, details);
        });
    } else {
      return Promise.reject('noroute');
    }
  } else {
    return Promise.reject('noroute');
  }
}

function goTo(templateName, attributes) {
  // Don't re-render the same template
  if (history[history.length - 1] !== templateName) {
    return render(templateName, attributes)
      .then((html)=> {
        Visualizer.emit('render-complete', html);
        addToHistory(templateName);
      })
      .catch((error)=> {
        return Promise.reject(`[Render Error] ${error}`);
      });
  } else {
    return Promise.reject(`[Info] Already on ${templateName}`);
  }
}

function goBack() {
  let backTo = history[length - 1] || history[0];
  backTo = backTo.split('_');
  return routes[backTo[0]](backTo[1]);
}

function addToHistory(templateName) {
  if (history.length < 2) {
    history.push(templateName);
  } else {
    history.shift();
    history.push(templateName)
  }
}

module.exports = routes;