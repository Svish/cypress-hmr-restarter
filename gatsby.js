const LOG_TAG = '[cypress-hmr-restarter]';

Cypress.on('window:load', (win) => {
  if (!Cypress.config('isInteractive')) {
    return;
  }

  const delay = Cypress.config('hmrRestartDelay') || 1500;
  const baseUrl = Cypress.config('baseUrl');

  if (baseUrl == null || baseUrl === '') {
    throw new Error(
      `${LOG_TAG} You must define a \`baseUrl\` in your Cypress configuration to use this plugin.`
    );
  }

  const source = new EventSource(`${baseUrl}/__webpack_hmr`);
  let timeout;

  source.onopen = () => console.debug(LOG_TAG, 'Connected to HMR event source');
  source.addEventListener('message', function (e) {
    const { action } = JSON.parse(e.data);
    switch (action) {
      case 'built':
        console.debug(LOG_TAG, `Restarting due to HMR in ${delay}ms...`);
        clickStop(win);
        clearTimeout(timeout);
        timeout = setTimeout(() => clickRestart(win), delay);
        break;
    }
  });
});

const click = (win, btnClass, log) => {
  const btn = win.top.document.querySelector(`.reporter .${btnClass}`);
  if (btn) {
    btn.click();
    console.debug(LOG_TAG, log);
  }
};
const clickStop = (win) => click(win, 'stop', 'Stopped running tests.');
const clickRestart = (win) => click(win, 'restart', 'Restarted.');
