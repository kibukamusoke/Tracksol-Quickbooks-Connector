var path = require('path');
var config = require('./config.json');
var express = require('express');
var session = require('express-session');
let vars = require('./core/variables');
var app = express();
let qb = require('./core/quickbooks');
let bodyParser = require('body-parser');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'secret', resave: 'false', saveUninitialized: 'false'}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

config.api_uri = vars.url;
config.clientId = vars.clientId;
config.clientSecret = vars.clientSecret;
config.redirectUri = vars.redirectUri;

// Initial view - loads Connect To QuickBooks Button
app.get('/', function (req, res) {
  res.render('home', config)
});

// Sign In With Intuit, Connect To QuickBooks, or Get App Now
// These calls will redirect to Intuit's authorization flow
app.use('/sign_in_with_intuit', require('./routes/sign_in_with_intuit.js'));
app.use('/connect_to_quickbooks', require('./routes/connect_to_quickbooks.js'));
app.use('/connect_handler', require('./routes/connect_handler.js'));

// Callback - called via redirect_uri after authorization
app.use('/callback', require('./routes/callback.js'));

// Connected - call OpenID and render connected view
app.use('/connected', require('./routes/connected.js'));

// Call an example API over OAuth2
app.use('/api_call', require('./routes/api_call.js'));

app.get('/update', qb.updateTerminal);
app.get('/update/**', qb.updateTerminal);

app.get('/test', qb.updateAccounts);

app.post('/createSalesReceipt', qb.createSalesReceipt);
app.post('/createCustomer', qb.createCustomer);
app.post('/createItem', qb.createItem);

// Start server on HTTP (will use ngrok for HTTPS forwarding)
app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
});
