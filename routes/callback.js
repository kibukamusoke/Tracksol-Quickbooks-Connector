var tools = require('../tools/tools.js');
var jwt = require('../tools/jwt.js');
var express = require('express');
var router = express.Router();
var vars = require('../core/variables');
let fs = require('fs');

/** /callback **/
router.get('/', function (req, res) {
  // Verify anti-forgery
  if(!tools.verifyAntiForgery(req.session, req.query.state)) {
    return res.send('Error - invalid anti-forgery CSRF response!')
  }


  // Exchange auth code for access token
  tools.intuitAuth.code.getToken(req.originalUrl).then(function (token) {
    // Store token - this would be where tokens would need to be
    // persisted (in a SQL DB, for example).
      console.log(req.session);
      console.log(token);
    tools.saveToken(req.session, token);
    fs.readFile(__dirname + '/../config.json', (err, data) => {
      if (err) throw err;
      let config = JSON.parse(data);
      config.oauthToken = token.accessToken;
      config.oauthTokenSecret = req.session.secret;
      config.clientId = vars.clientId;
      config.clientSecret = vars.clientSecret;
      config.realmId = req.query.realmId;
      config.refreshToken = token.refreshToken;
      config.sandbox = (process.env.QUICKBOOKS_SANDBOX || 'true') === 'true';
      fs.writeFileSync(__dirname + '/../config.json', JSON.stringify(config));

    });

    req.session.realmId = req.query.realmId;

    var errorFn = function(e) {
      console.log('Invalid JWT token!');
      console.log(e)
      res.redirect('/')
    };

    if(token.data.id_token) {
      try {
        // We should decode and validate the ID token
        jwt.validate(token.data.id_token, function() {
          // Callback function - redirect to /connected
          res.redirect('connected')
        }, errorFn)
      } catch (e) {
        errorFn(e)
      }
    } else {
      // Redirect to /connected
      res.redirect('connected')
    }
  }, function (err) {
    console.log(err)
    res.send(err)
  })
})

module.exports = router
