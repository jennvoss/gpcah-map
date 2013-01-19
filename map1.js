
(function($, L){
    var that = this;
    var map;
    var geojson;
    var $info;

    var stateBoxData =
    {"type":"FeatureCollection","features":[
      {"type":"Feature","id":"42","properties":{"name":"Pennsylvania"},"geometry":{"type":"Polygon","coordinates":[
        [
          [-80.518598, 42.269079],
          [-80.518598, 39.722302],
          [-74.69661, 39.722302],
          [-74.69661, 42.269079]
        ]
      ]}}
    ]};

    var countyData = countyHungerDataMap_CountyGEOData;
//    {"type":"FeatureCollection","features":[
//      {"type":"Feature","id":"42","properties":{"name":"Pennsylvania","density":284.3},"geometry":{"type":"Polygon","coordinates":[
//        [
//          [-79.76278,42.252649],
//          [-79.76278,42.000709],
//          [-75.35932,42.000709],
//          [-75.249781,41.863786],
//          [-75.173104,41.869263],
//          [-75.052611,41.754247],
//          [-75.074519,41.60637],
//          [-74.89378,41.436584],
//          [-74.740426,41.431108],
//          [-74.69661,41.359907],
//          [-74.828057,41.288707],
//          [-74.882826,41.179168],
//          [-75.134765,40.971045],
//          [-75.052611,40.866983],
//          [-75.205966,40.691721],
//          [-75.195012,40.576705],
//          [-75.069042,40.543843],
//          [-75.058088,40.417874],
//          [-74.773287,40.215227],
//          [-74.82258,40.127596],
//          [-75.129289,39.963288],
//          [-75.145719,39.88661],
//          [-75.414089,39.804456],
//          [-75.616736,39.831841],
//          [-75.786521,39.722302],
//          [-79.477979,39.722302],
//          [-80.518598,39.722302],
//          [-80.518598,40.636951],
//          [-80.518598,41.978802],
//          [-80.518598,41.978802],
//          [-80.332382,42.033571],
//          [-79.76278,42.269079],
//          [-79.76278,42.252649]
//        ]
//      ]}}
//    ]};


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