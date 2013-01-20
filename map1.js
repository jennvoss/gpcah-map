
(function($, L){
    var that = this;
    var attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,'+
                      ' Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>'+
                      '<br />Implementation and &copy; <a href="http://sqlity.net">sqlity.net</a>,&nbsp;&nbsp;'+
                      '<a href="http://www.jennifervoss.com/">Jennifer Voss</a>,&nbsp;&nbsp;'+
                      '<a href="http://media-phi.com/" alt="Implimented in part by &Phi;" title="Media-&Phi;">&Phi;</a>';
    var map;
    var geojson;
    var $county_info = $('#county-info ul');
    var $county_template = $county_info.children(".demographic-data");
    var $key_template = $county_info.children(".demographic-key");

    var GEOCoder = countyDataMap_GEOCoder();
    var GEOStyles = countyDataMap_GEOStyles();
    var stateBoxData = GEOCoder.getStateBoxData();
    var countyColorKeys = GEOCoder.getColorKeys();
    var countyColorKeyIdx = 0;
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
      return feature.properties[countyColorKeys[countyColorKeyIdx]]/100;
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
        hoverHighlightCounty(feature, layer);
      }

    };

    var mouseoutCounty = function (feature, layer) {

      layer.setStyle(GEOStyles.leaveCounty);

      if(!selectedCounty){
        hoverLowlightCounty(feature, layer);
      }

    };

    var zoomToFeature = function (feature, layer) {
      map.fitBounds(layer.getBounds());
    };

  var hoverHighlightCounty = function(feature, layer){
    updateInfo(feature.properties);
    layer.setStyle(GEOStyles.highlightCounty);
  }

  var hoverLowlightCounty = function(feature, layer){
    updateInfo();
    layer.setStyle(GEOStyles.coloredCounty(getColorDefiningValue(feature)));
  }

  var highlightCounty = function(feature, layer){
    updateInfo(feature.properties);
    layer.setStyle(GEOStyles.selectCounty);
  }

  var lowlightCounty = function(feature, layer){
    updateInfo();
    layer.setStyle(GEOStyles.coloredCounty(getColorDefiningValue(feature)));
  }

  var selectCounty = function (feature, layer) {
    if(selectedCounty){
      var oldFeature = selectedCounty.feature;
      var oldLayer = selectedCounty.layer;
      unselectCounty(oldFeature, oldLayer);
      if(feature.name == oldFeature.name){
        hoverHighlightCounty(feature,layer);
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
      var $template = $county_template.clone();
      $template.addClass(field.name);
      $template.addClass(field.class);
      $(".demographic-data-label",$template).text(field.description);
      $(".demographic-data-value",$template).text(props[field.name]);
      $county_info.append($template);
    };

    var updateInfo_county = function(props){
      $county_info.html("");
      var idx = 0;
      for(idx = 0; idx<countyFields.length; idx++ ){
        addValueHTML(props, countyFields[idx]);
      }
    };

    var addKeyHTML = function(value, key){
      var $template = $key_template.clone();
      var $key = $template.children(".demographic-key-label");
      $key.html("&nbsp;");
      $key.css("background-color",value);
      $(".demographic-key-value",$template).text(key);
      $county_info.append($template);
    };

    var addKeyTextHTML = function(label, text, className){
      var $template = $key_template.clone();
      $template.addClass(className);
      $template.children(".demographic-key-label").text(label);
      $template.children(".demographic-key-value").text(text);
      $county_info.append($template);
    };

    var getColorKeyDescription = function(){
      var idx = 0;
      for(idx = 0; idx<countyFields.length; idx++){
        if(countyFields[idx].name == countyColorKeys[countyColorKeyIdx]){
          return countyFields[idx].description;
        }
      }
      return "nix";
    };

    var updateInfo_key = function(){
      $county_info.html("");
      addKeyTextHTML("Legend",getColorKeyDescription(),'header')
      var idx = 0;
      for(idx = 0; idx<GEOStyles.colors.length; idx++ ){
        addKeyHTML(GEOStyles.colors[idx],GEOStyles.colorKey[idx]);
      }
      addKeyTextHTML("","Hover over a county for more information.","footer");
    };

    var updateInfo = function (props) {
      if(props)
      {
        updateInfo_county(props);
      }else{
        updateInfo_key();
      }
    };

    var setMapBehavior = function(map){
      map.dragging.disable();
      map.touchZoom.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
    };

    var initMap = function() {
      updateInfo();

      map = L.map('map').setView([0, 0],0);//setView([41, -77.5], 7);
      L.tileLayer('http://{s}.tile.cloudmade.com/{apiKey}/{styleId}/256/{z}/{x}/{y}.png', {
        apiKey: '8fb64cb6c89b4d9893ae71d18bd9a496',
        attribution: attribution,
        maxZoom: 7,
        minZoom: 7,
        styleId: 22677
      }).addTo(map);

      geojson = L.geoJson(stateBoxData, {
        style: stateBoxStyle,
        onEachFeature: zoomToFeature
      }).addTo(map);

      setMapBehavior(map);

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