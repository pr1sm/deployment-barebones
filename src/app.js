const express = require('express');
const expressUserAgent = require('express-useragent');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 9080;
const DEPLOY_DIR = process.env.DEPLOY_DIR || path.resolve(__dirname, '..', 'deploy');
const DEPLOY_NAME = process.env.DEPLOY_NAME || 'MyApp';

function attachDownloadRoute(app, route, filePath) {
  app.get(route, (req, res) => {
    if (filePath) {
      res.status(200);
      res.download(filePath);
    } else {
      res.status(403);
      res.send('This platform is unsupported at this time!');
    }
  });
}

function serve(deployDir, deployName) {
  const app = express();

  const paths = {};
  [{ key: 'mac', ext: 'dmg' }, { key: 'win', ext: 'exe' }, { key: 'linux', ext: 'tar.gz' }].forEach(
    ({ key, ext }) => {
      try {
        paths[key] = path.resolve(deployDir, `${deployName}.${ext}`);
        if (!fs.existsSync(paths[key])) {
          // throw an error so we catch it and set the key to undefined
          throw new Error('File does not exist');
        }
      } catch (err) {
        paths[key] = undefined;
      }
    },
  );

  app.use(cors());
  app.use(expressUserAgent.express());

  // Attach the direct download links
  attachDownloadRoute(app, '/mac', paths.mac);
  attachDownloadRoute(app, '/win', paths.win);
  attachDownloadRoute(app, '/linux', paths.linux);

  // Create the platform detector handler
  app.get('/', (req, res) => {
    // Get the useragent's platform
    const {
      useragent: { platform },
    } = req;

    // Set the right file path ()
    let filePath = null;
    switch (platform) {
      case 'Microsoft Windows': {
        filePath = paths.win;
        break;
      }
      case 'Apple Mac': {
        filePath = paths.mac;
        break;
      }
      case 'Linux': {
        filePath = paths.linux;
        break;
      }
      default: {
        break;
      }
    }

    if (filePath) {
      res.status(200);
      res.download(filePath);
    } else {
      res.status(404);
      res.send(
        `Your current platform (${platform}) is unsupported at this time! Please contact devs about adding support`,
      );
    }
  });

  app.use(express.static('dist'));

  const listener = app.listen(PORT, () => {
    console.log(`Deployment Server started on port ${listener.address().port}`);
  });

  return [app, listener];
}

serve(DEPLOY_DIR, DEPLOY_NAME);
