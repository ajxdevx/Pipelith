'use strict';

const { contextBridge, ipcRenderer } = require('electron');

// A narrow, typed surface exposed to the renderer. Everything goes through
// ipcRenderer.invoke (request/response) or ipcRenderer.send + a single event
// subscription for WebSocket traffic.
contextBridge.exposeInMainWorld('pipelith', {
  isDesktop: true,

  version: () => ipcRenderer.invoke('pipelith:version'),

  http: (payload) => ipcRenderer.invoke('pipelith:http', payload),
  cancelHttp: (requestId) => ipcRenderer.invoke('pipelith:http-cancel', requestId),

  oauthToken: (payload) => ipcRenderer.invoke('pipelith:oauth-token', payload),

  githubStatus: () => ipcRenderer.invoke('pipelith:github-status'),
  githubDeviceCode: () => ipcRenderer.invoke('pipelith:github-device-code'),
  githubDeviceToken: (deviceCode) => ipcRenderer.invoke('pipelith:github-device-token', deviceCode),

  wsConnect: (payload) => ipcRenderer.send('pipelith:ws-connect', payload),
  wsSend: (id, data) => ipcRenderer.send('pipelith:ws-send', { id, data }),
  wsClose: (id) => ipcRenderer.send('pipelith:ws-close', id),
  onWsEvent: (cb) => {
    const listener = (_event, data) => cb(data);
    ipcRenderer.on('pipelith:ws-event', listener);
    return () => ipcRenderer.removeListener('pipelith:ws-event', listener);
  },
});
