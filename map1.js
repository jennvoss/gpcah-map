
(function($, L){
    var that = this;
    var map;
    var geojson;
    var $info;

    var GEOCoder = countyDataMap_GEOCoder();
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

    var getColor = function(d) {
        return '#FFEDA0';
    };

    var style = function(feature) {
        return {
            weight: 1,
            color: '#FFF',
            dashArray: '',
            opacity: 1,
            fillOpacity: 0.7,
            fillColor: getColor(feature.properties.density)
        };
    };

    var stateBoxStyle = function(feature) {
        return {
            weight: 0,
            opacity: 0,
            color: 'white',
            dashArray: '',
            fillOpacity: 0,
            fillColor: '#000000'
        };
    };

    var highlightCounty = function (feature, layer) {

      layer.setStyle({
        weight: 4,
        color: '#FFF',
        dashArray: '',
        fillOpacity: 0.7
      });

//      if (!L.Browser.ie && !L.Browser.opera && typeof(layer.bringToFront) === 'function') {
//        layer.bringToFront();
//      }

      updateInfo(feature.properties);
    };

    var resetCounty = function (feature, layer) {

      layer.setStyle({
        weight: 1,
        color: '#FFF',
        dashArray: '',
        fillOpacity: 0.7
      });

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
        $info.html('<h4>'+props.name+'</h4>');
      }
      else
      {
        $info.html( '<h4>hover over county</h4>');
      }
    };

    var initMap = function() {
      $info = $('#countyInfo');
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