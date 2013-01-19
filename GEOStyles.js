var countyDataMap_GEOStyles = (function($){
return function() {
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

  var colors =  ['#FFC77F', '#FDB96F', '#FCBA51', '#FAB247', '#F9913E', '#F78931', '#F67124', '#F46817', '#F64B06', '#F54002'];

  var getColor = function(d) {
    var idx = Math.round((colors.length-1)*d);
    return colors[idx];
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
})(jQuery);