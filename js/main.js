var myApp = {};
myApp.selectedRegion = ""; //this is onclick string to store value of region
//arrays to store filtered down cities
myApp.activitiesCities = [];
myApp.endCities = [];

//vars for some functions
var $results = $('#results');
var $showActivites = $('.section___activity');
var $loaderOne= $('#loaderOne');
var $loderTwo= $('#loaderTwo');
var activitySection = document.getElementById('section___activity');

//scroll down and fadeIn fnct for map
function mapClick(){
    myApp.findCityList();
    $showActivites.fadeIn();
        setTimeout(function(){
            $('.map___section').fadeOut();
            
        },50);
};
function submitClick() {
    $results.fadeIn();
    $('.section___results').show();
};
//label onclick funct
$('label').on('click',function(){
    $(this).toggleClass('teal');
});
//form submit function
$('form').on('submit',function(e){
    e.preventDefault();
    submitClick();
    myApp.findCityWithactivities(myApp.activitiesCities);
    window.scrollTo(0,document.body.scrollHeight); 
});
//user lands on page
//user is prompted to click on a region he would like to visit
//when he clicks on this region, it will filter for all cities available in that specific region.
//below map initialize function will start the function mapClick which initializes the program
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
        panOnDrag: false,        
      	regionStyle: {
		  initial: {
		    fill: '#a4def9',
		    "fill-opacity": 1,
		    stroke: 'none',
		    "stroke-width": 0,
		    "stroke-opacity": 1
		  },
		  hover: {
		    "fill-opacity": 0.6,
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
        $loaderOne.hide();
        $('form').fadeIn();
        $("#form___title").fadeIn();
        activitySection.scrollIntoView();
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
    var $surfing = $("#surfing").is(":checked");
    var $cycling = $("#cycling").is(":checked");
    var $beach = $("#beach").is(":checked");
    var $temples = $("#temples").is(":checked");
    var $spa = $("#spa").is(":checked");
    var $golf = $("#golf").is(":checked");
    
  var activityFilteredCities = myApp.activitiesCities.filter(function(citiesWithactivities){
      for(var i = 0; i < citiesWithactivities.length; i++){

          if (citiesWithactivities[i].tags.includes('history') && $history) { 
             myApp.endCities.push(citiesWithactivities[i]);
        }
          if (citiesWithactivities[i].tags.includes('outdoors') && $outdoors) { 
             myApp.endCities.push(citiesWithactivities[i]);
        }
          if (citiesWithactivities[i].tags.includes('surfing') && $surfing) { 
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
          if (citiesWithactivities[i].tags.includes('hiking') && $hiking) { 
             myApp.endCities.push(citiesWithactivities[i]);
        }

          if (citiesWithactivities[i].tags.includes('golf') && $golf) { 
             myApp.endCities.push(citiesWithactivities[i]);
        }

          if(!$history &&!$outdoors &&!$hiking && !$surfing && !$cycling && !$beach && !$spa && !$temples && !$golf){
              myApp.endCities.push(citiesWithactivities[i]);
          }                               
    }
    return myApp.endCities;
  });
  var lastFilter = _.uniq(myApp.endCities);
  myApp.displayCities(lastFilter);
};
//display cities function
//cities will appear below map where users will be taken too
//cities will display some data about cities
myApp.displayCities = function(finalArray){
    finalArray.forEach(function(individualCity,i){

        var leisureScoreNumber = individualCity.scores.leisure * 250;
        var nightlifeScoreNumber = individualCity.scores.nightlife * 250;
        var safetyScoreNumber = individualCity.scores.safety * 250;
    
        var $results = $("#results");
        var $cityContainer = $('<figure class="figure___city">');

        var $cityHeader = $('<div class="cityHeader">').css(
            "background-image", "linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),url(https://nomadlist.com" +individualCity.media.image['250']+")"
        );

        var $cityName = $("<h3 class='city___name'>").text(individualCity.info.city.name);
        var $countryName = $("<h4 class='country___name'>").text(individualCity.info.country.name);
        var $leisureLabel = $('<p class="paragraph___top">').text("Leisure Rating");
        var $leisureScore = $('<div class="progress ' + ((leisureScoreNumber < 75) ? 'red ' : 'green ')+((leisureScoreNumber < 175 && leisureScoreNumber > 75) ? 'yellow ' : 'green ') + '">').width(leisureScoreNumber);
        var $nightlifeLabel = $('<p>').text("Nightlife Rating");
        var $nightlifeScore = $('<div class="progress ' + ((nightlifeScoreNumber < 75) ? 'red ' : 'green ')+((nightlifeScoreNumber < 175 && nightlifeScoreNumber > 75) ? 'yellow ' : 'green ') + '">').width(nightlifeScoreNumber);
        var $safetyLabel = $('<p>').text("Safety Rating");
        var $safetyScore = $('<div class="progress ' + ((safetyScoreNumber < 75) ? 'red ' : 'green ')+((safetyScoreNumber < 175 && safetyScoreNumber > 75) ? 'yellow ' : 'green ') + '">').width(safetyScoreNumber);
        var $airbnbScore = $('<p>').text("Airbnb average one night stay: $" + individualCity.cost.airbnb_median.USD);
        var $imageAnchor = $('<a href="" class="view___pix swipebox">').text("Photos");
        var $airBnbAnchor = $('<a href="https://www.airbnb.ca/s/' + individualCity.info.city.name + '" target="_blank">').text("Air Bnb");


        $cityHeader.append($cityName,$countryName);
        $cityContainer.append($cityHeader,$leisureLabel,$leisureScore,$nightlifeLabel,$nightlifeScore,$safetyLabel,$safetyScore,$airbnbScore,$imageAnchor,$airBnbAnchor);
        $results.flickity({
            "pageDots": false,
            "initialIndex": 5,
            "contain":true,
        });
        $results.flickity('append',$cityContainer);
        var resultScrollId = document.getElementById('results');
        resultScrollId.scrollIntoView();
    });
}

//users can click a city to pull pictures of their favorite activities in those countries/and or other pictures
$('.section___results').on('click',".view___pix", function(e){
    e.preventDefault(); 
    var cityQuery = $(this).siblings('.cityHeader').children('.city___name').text();
    var countryQuery = $(this).siblings('.cityHeader').children('.country___name').text();
    console.log(countryQuery);
    myApp.getPhotos(cityQuery);    
});
myApp.getPhotos = function(myQuery) {
    $.ajax({
        url: 'https://pixabay.com/api/',
        dataType : "JSON",
        data: {
        key: '3551643-fa4c0e3a2956d8c2df20a82df',
            category: 'travel',
            image_type: 'photo',
            q: myQuery,
        }
    }).then(function(photoRes){
        $('#loaderTwo').hide();
        console.log(photoRes);
        myApp.displayPhotos(photoRes);
    });
}
myApp.displayPhotos = function(countryPhotos) {
    var thesePics = countryPhotos.hits;
    if (thesePics.length > 0){
        var gallery = thesePics.map(item => ({href: item.webformatURL}));
        $.swipebox(gallery);
    }
    else{
        alert("No pictures found, sorry!");
    }
};  
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
myApp.init = function(){
    $('header').vide('videos/bgvid');
    worldMap();
    console.log('init');
}; //init end
$(document).ready(function(){ //doc rdy
    myApp.init();     
}); //doc rdy end

//smooth scroll








