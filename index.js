const DELAY = 1500;
const LOG_TAG = '[cypress-hmr-restarter]';

const clickRestart = win => {
  const btn = win.top.document.querySelector('.restart');
  btn && btn.click();
};

Cypress.on('window:load', win => {
  if (!Cypress.config('isInteractive')) {
    return;
  }

  const host = Cypress.config('baseUrl').replace(/https?/, 'wss');
  const socket = new WebSocket(`${host}/sockjs-node`);

  socket.onopen = () => console.debug(LOG_TAG, 'Connected to HMR socket');
  socket.onclose = () => console.debug(LOG_TAG, 'Disconnected from HMR socket');
  socket.onmessage = e => {
    const { type } = JSON.parse(e.data);
    switch (type) {
      case 'invalid':
        console.debug(LOG_TAG, `Restarting due to HMR in ${DELAY}ms...`);
        // TODO: Debounce this somehow?
        setTimeout(() => clickRestart(win), DELAY);
        break;
    }
  };
});
