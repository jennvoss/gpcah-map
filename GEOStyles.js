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
    fillOpacity: 0.7,
    fillColor: '#FF00A0'
  };

  var resetCounty = {
    fillOpacity: 0.7,
    fillColor: '#FFEDA0'
  };

  var hoverCounty = {
        weight: 4,
        color: '#FFF',
        dashArray: ''
  };

  var leaveCounty = {
    weight: 1,
    color: '#FFF',
    dashArray: ''
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
    "resetCounty":resetCounty,
    "hoverCounty":hoverCounty,
    "leaveCounty":leaveCounty,
    "coloredCounty": coloredCounty
  };
};
})(jQuery);