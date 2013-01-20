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

  var selectCounty = {
    fillOpacity: 1,
    fillColor: '#215D80'
  };

  var highlightCounty = {
    fillOpacity: 0.8,
    fillColor: '#215D80'
  };

  var hoverCounty = {
        weight: 4
  };

  var leaveCounty = {
    weight: 1
  };


  var colors =  ['#FFC77F', '#FDB96F', '#FCBA51', '#FAB247', '#F9913E', '#F78931', '#F67124', '#F46817', '#F64B06', '#F54002'];
  var colorKey = ['0% - 10%', '10% - 20%', '20% - 30%', '30% - %40', '40% - 50%', '50% - 60%', '60% - 70%', '70% - 80%', '80% - 90%', '90% - 100%'];

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
    "selectCounty":selectCounty,
    "hoverCounty":hoverCounty,
    "leaveCounty":leaveCounty,
    "coloredCounty": coloredCounty,
    "colors": colors,
    "colorKey":colorKey
  };
};
})(jQuery);