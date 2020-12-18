require('newrelic');
const express = require('express');
const path = require('path');
const router = require('./router');

const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');
const app = express();

app.use('/', express.static('public'));

// Loader.io verification
app.get('/loaderio-0d42b9b6193f3171643aff22c8aa776d.txt', (req, res) => {
  res.send('loaderio-0d42b9b6193f3171643aff22c8aa776d');
});

app.use('/:id', express.static(PUBLIC_DIR));

// Handling asset requests for webpack bundles by passing off requests to the bundles router
app.use('/:id/bundles', router.bundles);
// Handling AJAX requests to the API by passing off requests to the api router
app.use('/api', router.api);

module.exports = app;
