// API SUP BTC VALUE IN VARIOUS EXCHANGES
// NEW ADDRESS BUTTON POPUP MODAL -> WALLET GENERATR
$("#walletGenerator").load("wallet-generator.html");

// SOUTHXCHANGE API
$.get("https://www.southxchange.com/api/price/SUP/BTC", function(data, status) { 
    var data = (data.Last*1).toFixed(8);
    //console.log(data);                           
    $('#southXchangeBTC').text(data);
});             

// STOCKSEXCHANGE API
$.get("https://stocks.exchange/api2/prices", function(data, status) {
    
    var market_info;
    data.map(val => {
        if(val.market_name == 'SUP_BTC'){
            market_info = val;
        }
    });

    //console.log(market_info);
    var a       = market_info.server_time;
    var minuteA = Math.floor(a / 60) % 60;
    a -= minuteA * 60;

    $('#stocksExchangeBTC').text(market_info.sell);
    $('#stocksExchangeUpdateTime').text(minuteA);
});                           

//BTC-ALPHA API
$.get("https://btc-alpha.com/api/v1/exchanges/?format=json&ordering=-pair&pair=SUP_BTC&price=", function(data, status) {   
    $('#btcAlphaBTC').text(data[0].price);
});  

