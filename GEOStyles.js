var countyDataMap_GEOStyles = function() {
  var stateBox = {
    weight: 0,
    opacity: 0,
    color: 'white',
    dashArray: '',
    fillOpacity: 0,
    fillColor: '#000000'
  };

  var county = {
    weight: 1,
    color: '#FFF',
    dashArray: '',
    opacity: 1,
    fillOpacity: 0.7,
    fillColor: '#FFEDA0'
  };

  var highlightCounty = {
        weight: 4,
        color: '#FFF',
        dashArray: '',
        fillOpacity: 1,
        fillColor: '#FF00A0'
  };

  var getColor = function(d) {
    return '#FFEDA0';
  };
  
  var coloredCounty = function(percentage, fnGetColor) {
    var copyOfCounty = county;
    if(typeof(fnGetColor) === "function"){
      copyOfCounty.fillColor = fnGetColor(percentage);
    }else{
      copyOfCounty.fillColor = getColor(percentage);
    }
    return copyOfCounty;
  };

  return {
    "stateBox": stateBox,
    "county":county,
    "highlightCounty":highlightCounty,
    "coloredCounty": coloredCounty
  };
};