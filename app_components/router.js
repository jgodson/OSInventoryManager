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
  customers(params) {
    return forward('customers', params);
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
  let request = secondary.length > 1 ? `${primary}_${secondary[0]}_${secondary[1]}` : `${primary}_${secondary[0]}`;
  if (history[history.length - 1] !== request) {
    let forwardTo = FORWARDS[primary];
    if (forwardTo) {
      if (typeof forwardTo[secondary[0]] === 'string') {
        addToHistory(request);
        return goTo(forwardTo[secondary[0]], undefined, true);
      } else if (typeof forwardTo[secondary[0]] === 'function') {
        // Call function with attribute
        return forwardTo[secondary[0]](secondary[1])
          .then((details)=> {
            addToHistory(request);
            return goTo(`${primary}_${secondary[0]}`, details, true);
          });
      } else {
        return Promise.reject('noroute');
      }
    } else {
      return Promise.reject('noroute');
    }
  } else {
    return Promise.reject(`[Info] Already at ${request.replace(/_/g, '/')}`);
  }
}

function goTo(templateName, attributes, ignoreHistory) {
  // Don't re-render the same template
  if (ignoreHistory || history[history.length - 1] !== templateName) {
    return render(templateName, attributes)
      .then((html)=> {
        Visualizer.emit('render-complete', html);

        // If not already added, add to history and return name of route
        if (!ignoreHistory) {
          addToHistory(templateName);
          return templateName.replace(/_/g, '/');
        }
        return history[history.length - 1].replace(/_/g, '/');
      })
      .catch((error)=> {
        return Promise.reject(`[Render Error] ${error}`);
      });
  } else {
    return Promise.reject(`[Info] Already on ${templateName.replace(/_/g, '/')}`);
  }
}

function goBack() {
  let backTo = history[length - 1] || history[0] || 'index';
  backTo = backTo.split('_');
  let params = backTo.length > 2 ? `${backTo[1]}/${backTo[2]}` : backTo[1];
  return routes[backTo[0]](params);
}

function addToHistory(request) {
  if (history.length < 2) {
      history.push(request);
  } else {
    history.shift();
    history.push(request)
  }
}

module.exports = routes;