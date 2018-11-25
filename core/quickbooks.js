let rp = require('request-promise');
let QuickBooks = require('node-quickbooks');
let vars = require('./variables');
let fs = require('fs');
let Promise = require('bluebird');


module.exports = {


    getCustomers: (prevString = '') => {
        return new Promise((resolve, reject) => {

            let resString = 'T=7\nI=1\nR=1\nL=CUSTOMER.TXT\nM=1\nD=\n';
            fs.readFile(__dirname + '/../config.json', (err, config) => {
                if (err) {
                    console.log(err);
                    resString = 'B=' + resString.length + '\n' + resString;
                    resolve(prevString + resString);
                    return;
                }

                config = JSON.parse(config);
                let qbo = new QuickBooks(
                    config.clientId,
                    config.clientSecret,
                    config.oauthToken,
                    config.oauthTokenSecret,
                    config.realmId,
                    config.sandbox, // use the sandbox?
                    false, // enable debugging?
                    null,
                    '2.0',
                    config.refreshToken
                );

                qbo.findCustomers({
                    fetchAll: true
                }, function (e, customers) {
                    if (e) throw e;
                    // build file::

                    console.log(console.log(customers.QueryResponse.Customer[0]));
                    customers.QueryResponse.Customer.forEach((customer, index) => {
                        resString += customer.Id + '|' + customer.Id + '|' + encodeURI(customer.FullyQualifiedName) + '|' + customer.Id + '|' + (customer.PrimaryPhone ? customer.PrimaryPhone.FreeFormNumber : '') + '|' + (customer.ShipAddr && customer.ShipAddr.Line1 ? encodeURI(customer.ShipAddr.Line1) : '') + (customer.ShipAddr && customer.ShipAddr.City ? '%0A' + encodeURI(customer.ShipAddr.City) : '') + (customer.ShipAddr && customer.ShipAddr.PostalCode ? '%0A' + customer.ShipAddr.PostalCode: '') + (customer.ShipAddr && customer.ShipAddr.CountrySubDivisionCode ? ' ' + customer.ShipAddr.CountrySubDivisionCode : '') + '|\n';
                    });
                    resString = 'B=' + resString.length + '\n' + resString;
                    resolve(prevString + resString);
                });
            });
        });

    },

    getProducts: (prevString = '') => {
        return new Promise((resolve, reject) => {
            let itemsStr = 'T=6\nI=1\nR=1\nL=CAT.TXT\nM=1\nD=\n';
            fs.readFile(__dirname + '/../config.json', (err, config) => {
                if (err) {
                    console.log(err);
                    resString = 'B=' + resString.length + '\n' + resString;
                    resolve(prevString + resString);
                    return;
                }
                config = JSON.parse(config);
                let qbo = new QuickBooks(
                    config.clientId,
                    config.clientSecret,
                    config.oauthToken,
                    config.oauthTokenSecret,
                    config.realmId,
                    config.sandbox, // use the sandbox?
                    true, // enable debugging?
                    null,
                    '2.0',
                    config.refreshToken
                );

                qbo.findItems({
                    fetchAll: true
                }, function (e, items) {
                    if (e) throw e;
                    // build file::
                    console.log(console.log(items.QueryResponse.Item[0]));
                    items.QueryResponse.Item.forEach((item, index) => {
                        itemsStr += (index+1) + '|' + item.Id + '|' + item.Id + '||' + encodeURI(item.Name) + '|' + item.UnitPrice + '|' + item.UnitPrice + '|1|' + encodeURI(item.Name) + '|' + item.UnitPrice + '|11|1|2|\n';
                    });
                    itemsStr = 'B=' + itemsStr.length + '\n' + itemsStr;
                    resolve(prevString + itemsStr);
                });
            });
        });
    },

    createInvoice: (req, res) => {

    },


    updateTerminal: (req, res) => {
        module.exports.getProducts()
            .then(str => module.exports.getCustomers(str))
            .then(str => res.status(200).send(str));


    },


};