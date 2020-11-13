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

  const url = baseUrl.replace(/https?/, 'wss');
  const socket = new WebSocket(`${url}/sockjs-node`);
  let timeout;

  socket.onopen = () => console.debug(LOG_TAG, 'Connected to HMR socket');
  socket.onclose = () => console.debug(LOG_TAG, 'Disconnected from HMR socket');
  socket.onmessage = (e) => {
    const { type } = JSON.parse(e.data);
    switch (type) {
      case 'invalid':
        console.debug(LOG_TAG, `Restarting due to HMR in ${delay}ms...`);
        clickStop(win);
        clearTimeout(timeout);
        timeout = setTimeout(() => clickRestart(win), delay);
        break;
    }
  };
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
