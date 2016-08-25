// The file for the current environment will overwrite this one during build
// Different environments can be found in config/environment.{dev|prod}.ts
// The build system defaults to the dev environment

export const environment = {
  production: false,
  websocket: 'localhost:1880/ws',
  ipcam: {
    url: 'http://localhost:81',
    auth: { user: 'login', password: 'password' }
  }
};
