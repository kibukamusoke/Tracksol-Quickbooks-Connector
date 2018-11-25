
module.exports = {
    url: process.env.QUICKBOOKS_URL || 'https://sandbox-quickbooks.api.intuit.com/v3/company/',
    redirectUri: process.env.QUICKBOOKS_REDIRECT_URI || 'http://localhost:3000/callback',
    environment: process.env.QUICKBOOKS_ENVIRONMENT || 'sandbox', // production
    clientId: process.env.QUICKBOOKS_CLIENT_ID || 'Q0a9esO31bgJaTWVYCuQ4Wj8sj3F4RluYaHeb2mX4wMxHWifJb',
    clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET || 'rxSuia0wKcLX6yXTv4uRGfN1X6FNOy1TvGZfLpDb',
    sandbox: (process.env.QUICKBOOKS_SANDBOX || 'true') === 'true'
};