let rp = require('request-promise');
let QuickBooks = require('node-quickbooks');
let vars = require('./variables');
let fs = require('fs');


module.exports = {



    getProducts: (req, res) => {
        fs.readFile(__dirname + '/../config.json', (err, config) => {
            if (err) {
                res.status(200).send('1|0|1|1||Quickbooks not signed in|failed||0|1|3|1|');
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

            qbo.findItems({
                fetchAll: true
            }, function (e, items) {
                if (e) throw e;
                // build file::

                console.log(console.log(items.QueryResponse.Item[0]));
                let itemsStr = 'T=6\nI=1\nR=1\nL=CAT.TXT\nM=1\nD=\n';
                items.QueryResponse.Item.forEach((item, index) => {
                   itemsStr += (index+1) + '|' + item.Id + '|' + item.Id + '||' + item.Name + '|' + item.UnitPrice + '|' + item.UnitPrice + '|1|' + item.Name + '|' + item.UnitPrice + '|11|1|2|\n';
                });
                itemsStr = 'B=' + itemsStr.length + '\n' + itemsStr;
                //console.log(itemsStr);
                res.status(200).send(itemsStr);
            });
        });

    }


};