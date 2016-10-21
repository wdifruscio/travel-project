var myApp = {};
myApp.selectedRegion = ""; //this is onclick string to store value of region
//arrays to store filtered down cities
myApp.activitiesCities = [];
myApp.endCities = [];

//vars for some functions
var $results = $('#results');
var $showActivites = $('.section___activity');
var $loader = $('.loader');

//scroll down and fadeIn fnct
function mapClick(){
    myApp.findCityList();
    $showActivites.fadeIn();
        setTimeout(function(){
            window.location.href='#section___activity';
        },50);
};


//label onclick funct
$('label').on('click',function(){
    $(this).toggleClass('blue');
});

//form submit
$('form').on('submit',function(e){
    e.preventDefault();
    $results.css('opacity', '1');
    $results.css('height', 'auto');
    myApp.findCityWithactivities(myApp.activitiesCities);
});

//user lands on page
//user is prompted to click on a region he would like to visit
//when he clicks on this region, it will filter for all cities available in that specific region.
function worldMap(){ //vector map begin
        $('#map').vectorMap({
      	map: 'continents_mill',
        focusOn:{
            scale:1.1,
            x:-1.2,
            y:-2,
        },
      	backgroundColor:"transparent",
      	zoomOnScroll: false,
        zoomButtons : false,  
        zoomAnimate:false,
        regionsSelectable: true, 
        regionsSelectableOne:true,
      	regionStyle: {
		  initial: {
		    fill: '#a4def9',
		    "fill-opacity": 1,
		    stroke: 'none',
		    "stroke-width": 0,
		    "stroke-opacity": 1
		  },
		  hover: {
		    "fill-opacity": 0.8,
		    cursor: 'pointer'
		  },
		  selected: {
		    fill: 'white'
		  }
      	},
        onRegionClick: function (event, code) {
        var map = $('#map').vectorMap('get', 'mapObject');
        myApp.selectedRegion = map.getRegionName(code);
        console.log(myApp.selectedRegion);
        mapClick();
        }
      });
}; // vector map end
//find city function
myApp.findCityList = function(){
    $.ajax({
        url: "https://nomadlist.com/api/v2/list/cities",
        dataType: "json"
    }).then(function(res){
        $loader.hide();
        $('form').fadeIn();
        $('form').css('display','flex');
        $("#form___title").fadeIn();   
        var cityList = res.result;
        myApp.findCityInRegion(cityList);
        // console.log(cityList);
    });
};//find city list end
// filter for specifc region within city list
myApp.findCityInRegion = function(arr){
    var listOfSelectedCities = arr.filter(function(citiesInRegion){
        return citiesInRegion.info.region.name === myApp.selectedRegion;        
    });
    console.log(listOfSelectedCities);
    myApp.activitiesCities.push(listOfSelectedCities);
};
//cities will be filtered further based on tag selections
//user will be prompted on what their interests are from a list
myApp.findCityWithactivities = function(listOfSelectedCities){
    //get bool for activities
    var $hiking = $("#hiking").is(":checked");
    var $history = $("#history").is(":checked");
    var $outdoors = $("#outdoors").is(":checked");
    var $streetfood = $("#streetfood").is(":checked");
    var $cycling = $("#cycling").is(":checked");
    var $beach = $("#beach").is(":checked");
    var $temples = $("#temples").is(":checked");
    var $spa = $("#spa").is(":checked");
    var $backpacker = $("#backpacker").is(":checked");
    
  var activityFilteredCities = myApp.activitiesCities.filter(function(citiesWithactivities){
      for(var i = 0; i < citiesWithactivities.length; i++){

          if (citiesWithactivities[i].tags.includes('history') && $history) { 
             myApp.endCities.push(citiesWithactivities[i]);
        }
          if (citiesWithactivities[i].tags.includes('outdoors') && $outdoors) { 
             myApp.endCities.push(citiesWithactivities[i]);
        }
          if (citiesWithactivities[i].tags.includes('streetfood') && $streetfood) { 
             myApp.endCities.push(citiesWithactivities[i]);
        }
          if (citiesWithactivities[i].tags.includes('cycling') && $cycling) { 
             myApp.endCities.push(citiesWithactivities[i]);
        }
          if (citiesWithactivities[i].tags.includes('beach') && $beach) { 
             myApp.endCities.push(citiesWithactivities[i]);
        }
          if (citiesWithactivities[i].tags.includes('temples') && $temples) { 
             myApp.endCities.push(citiesWithactivities[i]);
        }
          if (citiesWithactivities[i].tags.includes('spa') && $spa ) { 
             myApp.endCities.push(citiesWithactivities[i]);
        }            
          if (citiesWithactivities[i].tags.includes('backpacker') && $backpacker) { 
             myApp.endCities.push(citiesWithactivities[i]);
        }
          if(!$backpacker && !$history &&!$outdoors &&!$hiking && !$streetfood && !$cycling && !$beach && !$spa && !$temples && !$backpacker){
              myApp.endCities.push(citiesWithactivities[i]);
          }                               
    }
    return myApp.endCities;
  });
  var lastFilter = _.uniq(myApp.endCities);
  myApp.displayCities(lastFilter);
};

//display cities function
myApp.displayCities = function(finalArray){
    finalArray.forEach(function(individualCity,i){

        var leisureScoreNumber = individualCity.scores.leisure * 250;
        var nightlifeScoreNumber = individualCity.scores.nightlife * 250;
        var safetyScoreNumber = individualCity.scores.safety * 250;
    
        var $results = $("#results");
        var $cityContainer = $('<figure>');

        var $cityHeader = $('<div>').css(
            "background-image", "linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),url(https://nomadlist.com" +individualCity.media.image['250']+")"
        );

        var $cityName = $("<h3>").text(individualCity.info.city.name);
        var $countryName = $("<h4>").text(individualCity.info.country.name);
        var $leisureLabel = $('<p>').text("Leisure Rating");
        var $leisureScore = $('<div class="progress ' + ((leisureScoreNumber < 75) ? 'red ' : 'green ')+((leisureScoreNumber < 175 && leisureScoreNumber > 75) ? 'yellow ' : 'green ') + '">').width(leisureScoreNumber);
        var $nightlifeLabel = $('<p>').text("Nightlife Rating");
        var $nightlifeScore = $('<div class="progress ' + ((nightlifeScoreNumber < 75) ? 'red ' : 'green ')+((nightlifeScoreNumber < 175 && nightlifeScoreNumber > 75) ? 'yellow ' : 'green ') + '">').width(nightlifeScoreNumber);
        var $safetyLabel = $('<p>').text("Safety Rating");
        var $safetyScore = $('<div class="progress ' + ((safetyScoreNumber < 75) ? 'red ' : 'green ')+((safetyScoreNumber < 175 && safetyScoreNumber > 75) ? 'yellow ' : 'green ') + '">').width(safetyScoreNumber);
        var $airbnbScore = $('<p>').text("Airbnb average one night stay: $" + individualCity.cost.airbnb_median.USD);
        var $imageAnchor = $('<a href="http://www.facebook.com">').text("click here for some photos");


        $cityHeader.append($cityName,$countryName);
        $cityContainer.append($cityHeader,$leisureLabel,$leisureScore,$nightlifeLabel,$nightlifeScore,$safetyLabel,$safetyScore,$airbnbScore,$imageAnchor);
        $results.flickity('append',$cityContainer);
    });
}

//cities will appear below map where users will be taken too
//cities will display some data about cities
//users can click a city to pull pictures of their favorite activities in those countries/and or other pictures

myApp.init = function(){
    $('header').vide('videos/bgvid');
    worldMap();
}; //init end

$(document).ready(function(){ //doc rdy
    myApp.init();     
}); //doc rdy end

//smooth scroll
$(function() {
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});