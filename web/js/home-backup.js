currentPage = {
        destroy: function(){
            $('#networkLastBlockFound,#poolLastBlockFound,#yourLastShare,#marketLastUpdated').timeago('dispose');
            if (xhrAddressPoll) xhrAddressPoll.abort();
            if (addressTimeout) clearTimeout(addressTimeout);
            clearInterval(intervalMarketPolling);
            for (var marketPoll in xhrMarketGets){
                xhrMarketGets[marketPoll].abort();
            }
            if (xhrGetPayments) xhrGetPayments.abort();
        },
        update: function(){
            window.localStorage.setItem('sup', lastStats.config.symbol);
            $('#networkLastBlockFound').timeago('update', new Date(lastStats.network.timestamp * 1000).toISOString());
            x = jQuery.extend({}, lastStats);
            updateText('networkHashrate', getReadableHashRateString(lastStats.network.difficulty / 120) + '/sec');
            updateText('networkDifficulty', lastStats.network.difficulty.toString());
            updateText('blockchainHeight', lastStats.network.height.toString());
            updateText('networkLastReward', getReadableCoins(lastStats.network.reward, 4));
            updateText('lastHash', lastStats.network.hash.substr(0, 13) + '...').setAttribute('href',
                blockchainExplorer + lastStats.network.hash
            );

            updateText('poolHashrate', getReadableHashRateString(lastStats.pool.hashrate) + '/sec');

            if (lastStats.pool.lastBlockFound){
                var d = new Date(parseInt(lastStats.pool.lastBlockFound)).toISOString();
                $('#poolLastBlockFound').timeago('update', d);
            }
            else
                $('#poolLastBlockFound').removeAttr('title').data('ts', '').update('Never');

            //updateText('poolRoundHashes', lastStats.pool.roundHashes.toString());
            updateText('poolMiners', lastStats.pool.miners.toString());


            var totalFee = lastStats.config.fee;
            if (lastStats.config.doDonations){
                totalFee += lastStats.config.donation;
                totalFee += lastStats.config.coreDonation;
                var feeText = [];
                if (lastStats.config.donation > 0) feeText.push(lastStats.config.donation + '% to pool dev');
                if (lastStats.config.coreDonation > 0) feeText.push(lastStats.config.coreDonation + '% to core devs');
                updateText('poolDonations', feeText.join(', '));
            }
            else{
                updateText('poolDonations', '');
            }

            updateText('poolFee', totalFee + '%');


            updateText('blockSolvedTime', getReadableTime(lastStats.network.difficulty / lastStats.pool.hashrate));
            updateText('calcHashSymbol', lastStats.config.symbol);

            calcEstimateProfit();
        }
    };

    $('#networkLastBlockFound,#poolLastBlockFound,#yourLastShare,#marketLastUpdated').timeago();

    function getReadableTime(seconds){

        var units = [ [60, 'second'], [60, 'minute'], [24, 'hour'],
            [7, 'day'], [4, 'week'], [12, 'month'], [1, 'year'] ];

        function formatAmounts(amount, unit){
            var rounded = Math.round(amount);
            return '' + rounded + ' ' + unit + (rounded > 1 ? 's' : '');
        }

        var amount = seconds;
        for (var i = 0; i < units.length; i++){
            if (amount < units[i][0])
                return formatAmounts(amount, units[i][1]);
            amount = amount / units[i][0];
        }
        return formatAmounts(amount,  units[units.length - 1][1]);
    }

    function getReadableHashRateString(hashrate){
        var i = 0;
        var byteUnits = [' H', ' KH', ' MH', ' GH', ' TH', ' PH' ];
        while (hashrate > 1000){
            hashrate = hashrate / 1000;
            i++;
        }
        return hashrate.toFixed(2) + byteUnits[i];
    }


    // Market data polling
    var intervalMarketPolling = setInterval(updateMarkets, 300000); //poll market data every 5 minutes
    var xhrMarketGets = {};

    updateMarkets();

    function updateMarkets(){

        var completedFetches = 0;
        var marketsData = [];

        for (var i = 0; i < cryptonatorWidget.length; i++){
            (function(i){
                cryptonatorWidget[i] = cryptonatorWidget[i].replace('{symbol}', window.localStorage.getItem('sup').toLowerCase());
                if (i == 0) {
                    xhrMarketGets[cryptonatorWidget[i]] = $.get('https://www.southxchange.com/api/price/' + cryptonatorWidget[i], function(data){
                        if(data.error) {
                            return;
                        }
                        $('.marketRate').show();

                        marketsData[i] = data;
                        //completedFetches++;
                        //if (completedFetches !== cryptonatorWidget.length) return;

                        var $marketHeader = $('#marketHeader');
                        $('.marketTicker').remove();
                        for (var f = marketsData.length - 1; f >= 0 ; f--){
                            var price = parseFloat(marketsData[f].Last);

                            if (price > 1) price = Math.round(price * 100) / 100;
                            else price = marketsData[f].Last;
                            price = price.toFixed(8);

                           $marketHeader.after('<div class="marketTicker">SUP: <span>' + price + ' BTC</span></div>');
                        }
                    }, 'json');
                } else if (i == 1) {
                    xhrMarketGets[cryptonatorWidget[i]] = $.get('https://stocks.exchange/api2/ticker', function(data){
                        if(data.error) {
                            return;
                        }
                        $('.marketRate2').show();

                        var $marketHeader = $('#marketHeader2');
                        $('.marketTicker2').remove();
                        for(var h in data) {
                            var name = data[h].market_name;
                            if (name == 'SUP_BTC') {
                                var price = parseFloat(data[h].last).toFixed(8);
                                $marketHeader.after('<div class="marketTicker2">SUP: <span>' + price + ' BTC</span></div>');
                                $('#marketLastUpdated2').timeago('update', new Date(data[h].updated_time * 1000).toISOString());
                                break;
                            }
                        }
                    }, 'json');
                }
            })(i);
        }
    }


    //Hash Profitability Calculator
    $('#calcHashRate').keyup(calcEstimateProfit).change(calcEstimateProfit);

    $('#calcHashUnits > li > a').click(function(e){
        e.preventDefault();
        $('#calcHashUnit').text($(this).text()).data('mul', $(this).data('mul'));
        calcEstimateProfit();
    });

    function calcEstimateProfit(){
        try {
            var rateUnit = Math.pow(1000,parseInt($('#calcHashUnit').data('mul')));
            var inp2 = parseFloat($('#calcHashRate').val()) * rateUnit;
            var resl = ( lastStats.network.reward / coinUnits) / ((lastStats.network.difficulty / inp2) / 86400  );
            if (!isNaN(resl)) {
                updateText('calcHashAmount', (Math.round(resl * 100) / 100).toString());
                return;
            }
        }
        catch(e){ }
        updateText('calcHashAmount', '');
    }

    /* Stats by mining address lookup */
    function getPaymentCells(payment){
        return '<td>' + formatDate(payment.time) + '</td>' +
                '<td>' + formatPaymentLink(payment.hash) + '</td>' +
                '<td>' + getReadableCoins(payment.amount, 4, true) + '</td>' +
                '<td>' + payment.mixin + '</td>';
    }

    var xhrAddressPoll;
    var addressTimeout;

    function setUpStats(){
        var address = $('#yourStatsInput').val().trim();
        if (!address){
            $('#yourStatsInput').focus();
            return;
        }

        $('#addressError').hide();
        $('.yourStats').hide();
        $('#payments_rows').empty();

        //$('#lookUp > span:first-child').hide();
        $('#lookUp > span:last-child').show();
 
       
        if (xhrAddressPoll) xhrAddressPoll.abort();
        if (addressTimeout) clearTimeout(addressTimeout);

        function fetchAddressStats(longpoll){
            
            xhrAddressPoll = $.ajax({
                url: api + '/stats_address',
                data: {
                    address: address,
                    longpoll: longpoll
                },
                dataType: 'json',
                cache: 'false',
                success: function(data){
                    $('#lookUp > span:last-child').hide();
                    $('#lookUp > span:first-child').show();

                    if (!data.stats){
                        $('.yourStats').hide();
                        $('#addressError').text(data.error).show();

                        if (addressTimeout) clearTimeout(addressTimeout);
                        addressTimeout = setTimeout(function(){
                            fetchAddressStats(false);
                        }, 2000);

                        return;
                    }


                    $('#addressError').hide();
                    updateText('yourAddressDisplay', address);

                    if (data.stats.lastShare)
                        $('#yourLastShare').timeago('update', new Date(parseInt(data.stats.lastShare) * 1000).toISOString());
                    else
                        updateText('yourLastShare', 'Never');

                    updateText('yourHashrateHolder', (data.stats.hashrate || '0 H') + '/sec');
                    updateText('yourHashes', (data.stats.hashes || 0).toString());
                    updateText('yourPaid', getReadableCoins(data.stats.paid));
                    updateText('yourPendingBalance', getReadableCoins(data.stats.balance));

                    renderPayments(data.payments);

                    $('.yourStats').show();

                    docCookies.setItem('mining_address', address, Infinity);

                    fetchAddressStats(true);

                },
                error: function(e){
                    if (e.statusText === 'abort') return;
                    $('#lookUp').html(lookupBtnHtml);
                    $('#addressError').text('Connection error').show();

                    if (addressTimeout) clearTimeout(addressTimeout);
                    addressTimeout = setTimeout(function(){
                        fetchAddressStats(false);
                    }, 2000);
                }
            });
        }
        fetchAddressStats(false);
    }

    $('#lookUp').click(setUpStats);

    var address = docCookies.getItem('mining_address');

    if (address){
        $('#yourStatsInput').val(address);
        $('#lookUp').click();
    }

    $('#yourStatsInput').keyup(function(e){
        if(e.keyCode === 13)
            $('#lookUp').click();
    });

    var xhrGetPayments;
    $('#loadMorePayments').click(function(){
        if (xhrGetPayments) xhrGetPayments.abort();
        xhrGetPayments = $.ajax({
            url: api + '/get_payments',
            data: {
                time: $('#payments_rows').children().last().data('time'),
                address: address
            },
            dataType: 'json',
            cache: 'false',
            success: function(data){
                renderPayments(data);
            }
        });
    });