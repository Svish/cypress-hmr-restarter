const LOG_TAG = '[cypress-hmr-restarter]';

Cypress.on('window:load', (win) => {
  if (!Cypress.config('isInteractive')) {
    return;
  }

  const delay = Cypress.config('hmrRestartDelay') || 1500;
  const url = getUrl();

  const socket = new WebSocket(url);
  let timeout;

  socket.onopen = () => console.debug(LOG_TAG, 'Connected to HMR socket');
  socket.onclose = () => console.debug(LOG_TAG, 'Disconnected from HMR socket');
  socket.onmessage = (e) => {
    let event;

    try {
      event = JSON.parse(e.data);
    } catch (err) {
      console.debug(
        LOG_TAG,
        `Failed to parse event data.`,
        `\nError:`,
        err.message,
        `\nData:`,
        e.data
      );
      return;
    }

    switch (event.type) {
      case 'invalid':
        console.debug(LOG_TAG, `Restarting due to HMR in ${delay}ms...`);
        clickStop(win);
        clearTimeout(timeout);
        timeout = setTimeout(() => clickRestart(win), delay);
        break;
    }
  };
});

function getUrl() {
  const url = Cypress.config('hmrUrl');
  if (url) {
    return url;
  }

  const baseUrl = Cypress.config('baseUrl');
  if (baseUrl) {
    return baseUrl.replace(/^http(s?)/, 'ws$1') + '/sockjs-node';
  }

  throw new Error(
    `${LOG_TAG} Need endpoint to connect to. Add either \`baseUrl\` or \`hmrUrl\` to \`cypress.json\`.`
  );
}

function clickStop(win) {
  click(win, 'stop', 'Stopped running tests.');
}

function clickRestart(win) {
  click(win, 'restart', 'Restarted.');
}

function click(win, btnClass, log) {
  const btn = win.top.document.querySelector(`.reporter .${btnClass}`);
  if (btn) {
    btn.click();
    console.debug(LOG_TAG, log);
  }
}
