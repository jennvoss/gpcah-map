
(function($, L){
    var that = this;
    var map;
    var geojson;
    var $info = $('#county-info'),
		$county_name = $('.county-name', $info);
		
    var GEOCoder = countyDataMap_GEOCoder();
    var GEOStyles = countyDataMap_GEOStyles();
    var stateBoxData = GEOCoder.getStateBoxData();
    var countyData = GEOCoder.getCountyData();


    var curry = function (fn, _scope) {

      var scope = _scope || window;

      var args = [];

      for (var i = 2, len = arguments.length; i < len; ++i) {

        args.push(arguments[i]);

      }

      return function() {

        fn.apply(scope, args);

      };

    };

    var getColorDefiningValue = function(feature){
      return feature.properties.density;
    };

    var style = function(feature) {
        return GEOStyles.coloredCounty(getColorDefiningValue(feature));
    };

    var stateBoxStyle = function(feature) {
        return GEOStyles.stateBox;
    };

    var highlightCounty = function (feature, layer) {

      layer.setStyle(GEOStyles.highlightCounty);

//      if (!L.Browser.ie && !L.Browser.opera && typeof(layer.bringToFront) === 'function') {
//        layer.bringToFront();
//      }

      updateInfo(feature.properties);
    };

    var resetCounty = function (feature, layer) {

      layer.setStyle(GEOStyles.coloredCounty(getColorDefiningValue(feature)));

      updateInfo();
    };

    var zoomToFeature = function (feature, layer) {
      map.fitBounds(layer.getBounds());
    };

    var zoomToCounty = function (county) {
      zoomToFeature({},county.target);
    };

    var onEachCounty = function (feature, layer) {
      layer.on({
        mouseover: curry(highlightCounty,that,feature,layer),
        mouseout: curry(resetCounty,that,feature,layer),
        click: zoomToCounty
      });
    };


    var updateInfo = function (props) {
      if(props)
      {
        $county_name.html(props.county_name);
      }
    };

    var initMap = function() {
      updateInfo();

      map = L.map('map').setView([0, 0],0);//setView([41, -77.5], 7);
      L.tileLayer('http://{s}.tile.cloudmade.com/{apiKey}/{styleId}/256/{z}/{x}/{y}.png', {
        apiKey: '8fb64cb6c89b4d9893ae71d18bd9a496',
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://cloudmade.com">CloudMade</a><br />Implementation &copy; <a href="http://sqlity.net">sqlity.net</a> ',
        maxZoom: 18,
        styleId: 22677
      }).addTo(map);

      geojson = L.geoJson(stateBoxData, {
        style: stateBoxStyle,
        onEachFeature: zoomToFeature
      }).addTo(map);

      geojson = L.geoJson(countyData, {
        style: style,
        onEachFeature: onEachCounty
      }).addTo(map);

    };

    var init = function(){
      initMap();
    }

    $(document).ready(init);
  })(jQuery, L);