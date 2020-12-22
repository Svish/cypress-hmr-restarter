const LOG_TAG = '[cypress-hmr-restarter]';

Cypress.on('window:load', (win) => {
  if (!Cypress.config('isInteractive')) {
    return;
  }

  const delay = Cypress.config('hmrRestartDelay') || 1500;
  const url = getUrl();

  const source = new EventSource(url);
  let timeout;

  source.onopen = () => console.debug(LOG_TAG, 'Connected to HMR event source');
  source.addEventListener('message', function (e) {
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
    switch (event.action) {
      case 'built':
        console.debug(LOG_TAG, `Restarting due to HMR in ${delay}ms...`);
        clickStop(win);
        clearTimeout(timeout);
        timeout = setTimeout(() => clickRestart(win), delay);
        break;
    }
  });
});

function getUrl() {
  const url = Cypress.config('hmrUrl');
  if (url) {
    return url;
  }

  const baseUrl = Cypress.config('baseUrl');
  if (baseUrl) {
    return baseUrl + '/__webpack_hmr';
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
