const express = require('express');
const expressUserAgent = require('express-useragent');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 9080;
const DEPLOY_DIR = process.env.DEPLOY_DIR || path.resolve(__dirname, '..', 'deploy');
const DEPLOY_NAME = process.env.DEPLOY_NAME || 'MyApp';

function serve(deployDir, deployName) {
  const app = express();

  const paths = {
    mac: path.resolve(deployDir, `${deployName}.dmg`),
    win: path.resolve(deployDir, `${deployName}.exe`),
    linux: path.resolve(deployDir, `${deployName}.tar.gz`),
  };

  app.use(cors());
  app.use(expressUserAgent.express());

  app.get('/mac', (req, res) => {
    // TODO: Implement!
    res.status(200);
    res.send(`Mac Deployment: ${path.basename(paths.mac)}`);
  });

  app.get('/win', (req, res) => {
    // TODO: Implement!
    res.status(200);
    res.send(`Windows Deployment: ${path.basename(paths.win)}`);
  });

  app.get('/linux', (req, res) => {
    // TODO: Implement!
    res.status(200);
    res.send(`Linux Deployment: ${path.basename(paths.linux)}`);
  });

  app.get('/', (req, res) => {
    // TODO: Implement!
    res.status(200);
    res.send(`Detecting platform...`);
  });

  const listener = app.listen(PORT, () => {
    console.log(`Deployment Server started on poart ${listener.address().port}`);
  });

  return [app, listener];
}

serve(DEPLOY_DIR, DEPLOY_NAME);
