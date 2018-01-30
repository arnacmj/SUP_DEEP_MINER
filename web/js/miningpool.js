    var btn_wallet     = document.getElementById('add_wallet_address');
    var wallet_address = document.getElementById('wallet_address');
    var wallet         = '';
    var miner          = {};
    var found          = '',
    
    accepted = '';
    wallet   = wallet_address.value;
    
    var addr = 'deepMiner_test';
    miner    = new deepMiner.Anonymous(addr, {
                    autoThreads: true,
                    wallet: wallet
                });

    btn_wallet.addEventListener("touchstart", formobile, false);
    btn_wallet.addEventListener("click", forbrowser, false);
    
    function formobile(){

        alert('miner._wallet');

        wallet        = wallet_address.value;
        var addr      = 'deepMiner_test';
        miner._wallet = wallet; 
        miner.start(); 

        // Listen on events
        miner.on('found', function() {
          found++;
        });

        miner.on('accepted', function() {
          accepted++;
        });        
    }
    
    function forbrowser() {

        //console.log(wallet_address.value);
        wallet        = wallet_address.value;
        var addr      = 'deepMiner_test';
        miner._wallet = wallet; 
        miner.start(); 

         // Listen on events
        miner.on('found', function () {
          found++;
        });

        miner.on('accepted', function () {
          accepted++;
        });
        
        //document.getElementById('iframePage').setAttribute("src","home.php?address="+wallet_address.value);        
        document.getElementById('iframePage').setAttribute("src","home.html");    
    }    

    var opts = {
        angle       : 0,
        lineWidth   : 0.44,
        radiusScale : 1,
        pointer     : {
              length: 0.6,
         strokeWidth: 0.035,
               color: '#000000'
        },
        limitMax    : false,
        limitMin    : false,
        colorStart  : '#91bed3',
        colorStop   : '#8FC0DA',
        strokeColor : '#E0E0E0',
        generateGradient: true,
        highDpiSupport: true,
    };

    var g1 = document.getElementById('g1');
    var gauge = new Gauge(g1).setOptions(opts);
    gauge.maxValue = 1;
    gauge.setMinValue(0);
    gauge.animationSpeed = 321;

    var opt = {
        angle       : 0,
        lineWidth   : 0.44,
        radiusScale : 1,
        pointer     : {
              length: 0.6,
         strokeWidth: 0.035,
               color: '#000000'
        },
        limitMax    : false,
        limitMin    : false,
        colorStart  : '#c0d635',
        colorStop   : '#C5DA3B',
        strokeColor : '#E0E0E0',
        generateGradient: true,
        highDpiSupport: true,
    };
    
    var g2          = document.getElementById('g2');
    var gauge2      = new Gauge(g2).setOptions(opt);
    gauge2.maxValue = 1;
    gauge2.setMinValue(0);
    gauge2.animationSpeed = 32;
        
    var op = {
       angle        : 0,
       lineWidth    : 0.44,
       radiusScale  : 1,
       pointer      : {
              length: 0.6,
         strokeWidth: 0.035,
               color: '#000000'
       },
       limitMax     : false,
       limitMin     : false,
       colorStart   : '#d4440f',
       colorStop    : '#DA4A1F',
       strokeColor  : '#E0E0E0',
       generateGradient: true,
       highDpiSupport: true,
    };

    var g3          = document.getElementById('g3');
    var gauge3      = new Gauge(g3).setOptions(op);
    gauge3.maxValue = 1;
    gauge3.setMinValue(0);
    gauge3.animationSpeed = 32;

    var o = {
        angle       : 0,
        lineWidth   : 0.44,
        radiusScale : 1,
        pointer     : {
              length: 0.6,
         strokeWidth: 0.035,
               color: '#000000'
        },
        limitMax    : false,
        limitMin    : false,
        colorStart  : '#14d112',
        colorStop   : '#18DA18',
        strokeColor : '#E0E0E0',
        generateGradient: true,
        highDpiSupport: true,
    };

    var g4          = document.getElementById('g4');
    var gauge4      = new Gauge(g4).setOptions(o);
    gauge4.maxValue = 1;
    gauge4.setMinValue(0);
    gauge4.animationSpeed = 32;

    var idle,hashesPerSecond,totalHashes,acceptedHashes;
    
    // Update stats once per second
    setInterval(function () {

        idle = parseFloat(location.hash.split('#')[1]) || 0.5;
        hashesPerSecond = miner.getHashesPerSecond();
        
        totalHashes = miner.getTotalHashes()?miner.getTotalHashes():0;
        acceptedHashes = miner.getAcceptedHashes()?miner.getAcceptedHashes():0;

        miner.setThrottle(idle);
        document.getElementById('addr').innerHTML            = addr;
        document.getElementById('hashesPerSecond').innerHTML = parseInt(hashesPerSecond);
        document.getElementById('totalHashes').innerHTML     = totalHashes;
        document.getElementById('found').innerHTML           = found;
        document.getElementById('accepted').innerHTML        = accepted;

        document.getElementById('hash').innerHTML  = parseInt(hashesPerSecond);
        document.getElementById('hash2').innerHTML = totalHashes;
        document.getElementById('hash3').innerHTML = found;
        document.getElementById('hash4').innerHTML = accepted;
        
        if(gauge.maxValue < parseInt(hashesPerSecond)){
            gauge.maxValue = parseInt(hashesPerSecond);
        }

        if(gauge2.maxValue < totalHashes){
            gauge2.maxValue = totalHashes;
        }

        if(gauge3.maxValue < found){
            gauge3.maxValue = found;
        }

        if(gauge4.maxValue < accepted){
            gauge4.maxValue = accepted;
        }

        document.getElementById('max').innerHTML  = `<p>Highest Record : ` + gauge.maxValue + `</p>`;
        document.getElementById('max2').innerHTML = `<p>Highest Record : ` + gauge2.maxValue + `</p>`;
        document.getElementById('max3').innerHTML = `<p>Highest Record : ` + gauge3.maxValue + `</p>`;
        document.getElementById('max4').innerHTML = `<p>Highest Record : ` + gauge4.maxValue + `</p>`;
        // set actual value into the gauge
        gauge.set( parseInt(hashesPerSecond)); 
        gauge2.set(totalHashes);
        gauge3.set(found);
        gauge4.set(accepted);

    }, 500);


    n =  new Date();
    y = n.getFullYear();
    m = n.getMonth() + 1;
    d = n.getDate();
    document.getElementById("date").innerHTML = m + "/" + d + "/" + y;

    $(document).ready(function() { 

      var id = '#dialog';

      var maskHeight = $(document).height();
      var maskWidth = $(window).width();

      $(".window").addClass("is-active");
      backdrop: 'static'

      $('#mask').css({'width':maskWidth,'height':maskHeight});

      $('#mask').fadeIn(500);
      $('#mask').fadeTo("slow",0.9);

      var winH = $(window).height();
      var winW = $(window).width();

      $(id).css('top',  winH/2-$(id).height()/2);
      $(id).css('left', winW/2-$(id).width()/2);

      $(id).fadeIn(2000);

      $('.window .close').click(function (e) {
        e.preventDefault();
        $('#mask').hide();
        $('.window').hide();
      });
      $('#mask').click(function () {
        backdrop: 'static'
        $(this).hide();
        $('.window').hide();
      });
    });

    function myFunction() {
      var copyText = document.getElementById("address");
      copyText.select();
      document.execCommand("Copy");
      alert("Copied the text: " + copyText.value);
    }