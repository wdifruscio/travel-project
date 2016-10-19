var myApp = {};
myApp.selectedRegion = ""; //this is onclick string to store value of region
myApp.activitesCities = [];
myApp.endCities = [];

//activity booleans


//=============//
//==SELECTION==//
//=============//
//user lands on page
//user is prompted to click on a region he would like to visit
//when he clicks on this region, it will filter for all cities available in that specific region.
//init fnct
function worldMap(){
        $('#map').vectorMap({
      	map: 'continents_mill',
      	backgroundColor:"white",
      	zoomOnScroll: false,
      	regionStyle: {
		  initial: {
		    fill: 'green',
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
		    fill: '#fdc300'
		  }
      	},
        onRegionClick: function (event, code) {
        var map = $('#map').vectorMap('get', 'mapObject');
        myApp.selectedRegion = map.getRegionName(code);
        console.log(myApp.selectedRegion);
        myApp.findCityList();
        }
      });//vector map end
};
myApp.findCityList = function(){
    $.ajax({
        url: "https://nomadlist.com/api/v2/list/cities",
        dataType: "json"
    }).then(function(res){
        var cityList = res.result;
        myApp.findCityInRegion(cityList);
        // console.log(cityList);
    });
};//find city list end
// filter for specifc city within city list
myApp.findCityInRegion = function(arr){
    var listOfSelectedCities = arr.filter(function(citiesInRegion){
        return citiesInRegion.info.region.name === myApp.selectedRegion;        
    });    
    console.log(listOfSelectedCities);
    myApp.activitesCities.push(listOfSelectedCities);

};
//user will be prompted on what their interests are from a list
$('form').on('submit',function(e){
    e.preventDefault();
    myApp.findCityWithActivites(myApp.activitesCities);       
});
//cities will be filtered further based on tag selections
//cities will appear below map where users will be taken too
//cities will display some data about cities
//users can click a city to pull pictures of their favorite activites in those countries/and or other pictures
//



myApp.findCityWithActivites = function(filteredCities){

    var $hiking = $("#hiking").is(":checked");
    var $history = $("#history").is(":checked");
    var $nightlife = $("#nightlife").is(":checked");
    var $streetfood = $("#streetfood").is(":checked");
    var $cycling = $("#cycling").is(":checked");
    var $beach = $("#beach").is(":checked");
    var $temples = $("#temples").is(":checked");
    var $spa = $("#spa").is(":checked");
    var $backpacker = $("#backpacker").is(":checked");
    
  var activityFilteredCities = filteredCities.filter(function(citiesWithActivites){
      for(var i = 0; i < citiesWithActivites.length; i++){
          if (citiesWithActivites[i].tags.includes('hiking')&& $hiking) {
              myApp.endCities.push(citiesWithActivites[i]);
        }
          if (citiesWithActivites[i].tags.includes('history') && $history) { 
             myApp.endCities.push(citiesWithActivites[i]);
        }
          if (citiesWithActivites[i].tags.includes('nightlife') && $nightlife) { 
             myApp.endCities.push(citiesWithActivites[i]);
        }
          if (citiesWithActivites[i].tags.includes('streetfood') && $streetfood) { 
             myApp.endCities.push(citiesWithActivites[i]);
        }
          if (citiesWithActivites[i].tags.includes('cycling') && $cycling) { 
             myApp.endCities.push(citiesWithActivites[i]);
        }
          if (citiesWithActivites[i].tags.includes('beach') && $beach) { 
             myApp.endCities.push(citiesWithActivites[i]);
        }
          if (citiesWithActivites[i].tags.includes('temples') && $temples) { 
             myApp.endCities.push(citiesWithActivites[i]);
        }
          if (citiesWithActivites[i].tags.includes('spa') && $spa ) { 
             myApp.endCities.push(citiesWithActivites[i]);
        }            
          if (citiesWithActivites[i].tags.includes('backpacker') && $backpacker) { 
             myApp.endCities.push(citiesWithActivites[i]);
        }                               
    }
    return myApp.endCities;
  });
  console.log(myApp.endCities);
  myApp.displayCities(myApp.endCities);
};

myApp.displayCities = function(finalArray){
    finalArray.forEach(function(individualCity){
    
        // for (var i = 0; i < finalArray.length; i++){
        var $cityContainer = $('<figure>');
        var $cityName = $("<h3>").text(individualCity.info.city.name);
        var $countryName = $("<h4>").text(individualCity.info.country.name);
        // var $lesiureScore = $('<p>')
        
        $cityContainer.append($cityName,$countryName);
        console.log($cityContainer);
        $("#results").append($cityContainer);
        });
    // }
}





myApp.init = function(){
    worldMap();    
}; //init end

$(document).ready(function(){ //doc rdy
    myApp.init();     
}); //doc rdy end

