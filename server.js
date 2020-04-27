const express = require('express');
const app = express();
const path = require('path');
const dist_dir = 'dist/chain-hunter';

const forceSSL = function() {
    return function (req, res, next) {
        if(req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(
                ['https://', req.get('Host'), req.url].join('')
            );
        }
        next();
    }
}

app.use(forceSSL());
app.get('*.*', express.static(dist_dir, { maxAge: '1yr' }));

app.get('/*', function(req, res) {
    res.sendFile('/', { root: dist_dir });
});

app.listen(process.env.PORT || 8080);