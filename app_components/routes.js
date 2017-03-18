const config = require(path.join(__dirname, 'app_config'));
const render = require(path.join(__dirname, `render`));
const file = require(path.join(__dirname, 'file_ops'));

// Keep track of last page that user was on (for cancel/go back commands)
let history = [];

// Regular Links
const routes = {
  index() {
    return handleNavRoute('index');
  },
  parts() {
    return handleNavRoute('parts');
  },
  settings() {
    return handleNavRoute('settings');
  },
  customers() {
    return handleNavRoute('customers');
  },
  goBack() {
    return handleGoBackRoute();
  },
  cancel() {
    return handleGoBackRoute();
  },
  noRoute(action) {
    handleNoRoute(action);
  }
}

// Form Submissions
routes.forms = {
  settings_save(formData) {
    handleSettingsSaveRoute(formData);
  }
}

function handleNoRoute(action) {
  console.warn(`[Missing Route] ${action}`);
  Notifier.emit('show-notification', {
    icon: "report_problem",
    title: "Page Not Found",
    message: `The page you tried to navigate to wasn't found or there was an error rendering it.
      Please notify the app developers of this issue.`
  });
}

function handleNoPermissions(action, user) {
  console.warn(`[Access Denied] User ${user} does not have permission to go do ${action}`);
}

function handleNavRoute(templateName) {
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

function handleSettingsSaveRoute(formData) {
  // Name of settings data file
  const fileName = 'settings_data.json';
  file.writeData(fileName, formData);
}

function handleGoBackRoute() {
  return handleNavRoute(history[length - 1] || history[0]);
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