var myApp = {};
myApp.selectedRegion = "";


//get list of cities



//=============//
//==SELECTION==//
//=============//
//user lands on page
//user is prompted to click on a region he would like to visit
//when he clicks on this region, it will filter for all cities available in that specific region.
//user will be prompted on what their interests are from a list
//cities will be filtered further based on tag selections
//cities will appear below map where users will be taken too
//cities will display some data about cities
//users can click a city to pull pictures of their favorite activites in those countries/and or other pictures
//

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
    var listOfSelectedCities = arr.filter(function(individualCity){
        return individualCity.info.region.name === myApp.selectedRegion;        
    });    
    console.log(listOfSelectedCities);
};
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
myApp.init = function(){
    worldMap();    
}; //init end

$(document).ready(function(){ //doc rdy
    
    myApp.init();     
    // $('#map').on('click',function(){
    //     myApp.init();
    // });
}); //doc rdy end

