'use strict';

// using npmjs dotenv package
require('dotenv').config();

var request = require('request');
var prompt = require('prompt-sync')();

console.log("This program will list a stock's details for a given date within the past 5 months");

var stockName = "";
var continueReading = true;
while (continueReading) {
    stockName = prompt("Enter a stock symbol: ");
    continueReading = readStock(stockName);
}

console.log("Program has exited successfully");

function isCharNumber(c) {    // check if given char is number
    return c >= '0' && c <= '9';
}

function readStock(stockName) {

    var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + stockName + '&apikey=' + process.env.KEY;
    var stockDate = "";
    stockDate = prompt("Enter a date MM/DD/YYYY: ");
    if (stockDate.length != 10 || !isCharNumber(stockDate[0]) || !isCharNumber(stockDate[1]) || stockDate[2] != '/' ||     // make sure the date is formatted correctly
        !isCharNumber(stockDate[3]) || !isCharNumber(stockDate[4]) || stockDate[5] != '/' || !isCharNumber(stockDate[6]) ||
        !isCharNumber(stockDate[7]) || !isCharNumber(stockDate[8]) || !isCharNumber(stockDate[9])) {
        console.log("Incorrect date format");
    }
    else {
        request.get({ url: url, json: true, headers: { 'User-Agent': 'request' } }, (err, res, data) => {   // read stock data from API and make sure no errors occur
            if (err) {
                console.log('Error:', err);
            }
            else if (res.statusCode !== 200) {
                console.log('Status:', res.statusCode);
            }
            else {
                var stockData = data['Time Series (Daily)'][stockDate.substring(6, 10)
                    + '-' + stockDate.substring(0, 2) + '-' +
                    stockDate.substring(3, 5)];
                if (stockData == undefined) {
                    console.log("Date out of range");
                }
                else {
                    console.log(stockData);
                    console.log('\n');
                    var read = prompt("Continue reading stock data? Y/N: ");
                    if (read.toLowerCase().replace(/\s/g, '') == "n") {
                        return false;
                    }
                    else if (read.toLowerCase().replace(/\s/g, '') != "y" || read.toLowerCase().replace(/\s/g, '') != "n") {
                        var incorrectFormat = true;
                        while (incorrectFormat) {
                            console.log("Incorrect answer format, expected Y or N");
                            read = prompt("Continue reading stock data? Y/N: ");
                            if (read.toLowerCase().replace(/\s/g, '') == "n") {
                                return false;
                            }
                            else if (read.toLowerCase().replace(/\s/g, '') == "y") {
                                incorrectFormat = false;
                            }
                        }
                    }
                }
            }
        });
    }
    return true;
}
