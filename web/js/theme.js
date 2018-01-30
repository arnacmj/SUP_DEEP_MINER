//FUNCTION TO DETECT MOBILE
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};


// SIDEBAR TOGGLE LEFT
if(isMobile.any()) {

	$("#wrapper").addClass("active");      

    $("ul.sidebar-nav li").click(function(){

        $("#wrapper").addClass("active");    

    });
        
} else {

	$("#wrapper").removeClass("active"); 

}


$("#menu-toggle").click(function(e) {

    e.preventDefault();
    $("#wrapper").toggleClass("active");

});


// TOGGLE MENU [WEBSITES]
$("#toggleMenu").click(function(e) {

	$("#toggleMenuChild").toggle('slow', 'swing');

});

/* NAVIGATION SLIDER RIGHT */
$("#stickyOpen").click(function(e) {
 
    var toggle  = $('.toggle');

    if (toggle.hasClass('visible')) {

		toggle.animate({
			"right": "-1000px"
		}, 	"slow").removeClass('visible');

    } else {

		toggle.animate({
			"right": "0px"
		},  "slow").addClass('visible');

    }

});


