
(function($, L){
    var that = this;
    var map;
    var geojson;
    var $county_info = $('#county-info ul');
    var $county_template = $("li:first",$county_info);
		
    var GEOCoder = countyDataMap_GEOCoder();
    var GEOStyles = countyDataMap_GEOStyles();
    var stateBoxData = GEOCoder.getStateBoxData();
    var countyFields = GEOCoder.getCountyFields();
    var countyData = GEOCoder.getCountyData();

    var selectedCounty = false;


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
      return feature.properties.food_ins_rate/100;
    };

    var style = function(feature) {
        return GEOStyles.coloredCounty(getColorDefiningValue(feature));
    };

    var stateBoxStyle = function(feature) {
        return GEOStyles.stateBox;
    };

    var mouseoverCounty = function (feature, layer) {

      layer.setStyle(GEOStyles.hoverCounty);

      if(!selectedCounty){
        highlightCounty(feature, layer);
      }

    };

    var mouseoutCounty = function (feature, layer) {

      layer.setStyle(GEOStyles.leaveCounty);

      if(!selectedCounty){
        lowlightCounty(feature, layer);
      }

    };

    var zoomToFeature = function (feature, layer) {
      map.fitBounds(layer.getBounds());
    };

  var highlightCounty = function(feature, layer){
    updateInfo(feature.properties);
    layer.setStyle(GEOStyles.highlightCounty);
  }

  var lowlightCounty = function(feature, layer){
    updateInfo();
    layer.setStyle(GEOStyles.coloredCounty(getColorDefiningValue(feature)));
  }

  var selectCounty = function (feature, layer) {
    if(selectedCounty){
      var oldFeature = selectedCounty.feature;
      unselectCounty(oldFeature, selectedCounty.layer);
      if(feature.name == oldFeature.name){
        return;
      }
    }
    selectedCounty = {"feature":feature, "layer":layer};
    highlightCounty(feature, layer);
  };

  var unselectCounty = function (feature, layer) {
    lowlightCounty(feature, layer);
    selectedCounty = false;
  };

    var onEachCounty = function (feature, layer) {
      layer.on({
        mouseover: curry(mouseoverCounty,that,feature,layer),
        mouseout: curry(mouseoutCounty,that,feature,layer),
        click: curry(selectCounty,that,feature,layer)
      });
    };

    var addValueHTML = function(props, field){
      $template = $county_template.clone();
      $template.addClass(field.name);
      $template.addClass(field.class);
      $(".demographic-data-label",$template).text(field.description);
      $(".demographic-data-value",$template).text(props[field.name]);
      $county_info.append($template);
    };

    var updateInfo = function (props) {
      if(props)
      {
        $county_info.html("");
        var idx = 0;
        for(idx = 0; idx<countyFields.length; idx++ ){
          addValueHTML(props, countyFields[idx]);
        }
      }else{
        $county_info.html("");
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