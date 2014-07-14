var lon = 14.38976; //14.38976,50.105084
var lat = 50.105084; //
var zoom = 16.5;
var attribution_text = 'Data, imagery and map information provided by <a href="http://www.mapquest.com/">MapQuest</a>, <a href="http://mapicons.nicolasmollet.com">Maps Icons Collection</a>, <a href="http://www.openstreetmap.org/">Open Street Map</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>.';

var map, select;

function init(){
    var options = {
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        controls: [new OpenLayers.Control.Navigation(),
                   new OpenLayers.Control.PanZoomBar()
        ]
    };
    map = new OpenLayers.Map('map', options);
    var arrayOSM = ["http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg",
                    "http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg",
                    "http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg",
                    "http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg"];
    var baseOSM = new OpenLayers.Layer.OSM("MapQuest-OSM Tiles", arrayOSM, {'attribution': attribution_text});
    var mapnik = new OpenLayers.Layer.OSM("OpenStreetMap (Mapnik)");
    var gmap = new OpenLayers.Layer.Google("Google", {sphericalMercator:true});
    var poi = new OpenLayers.Layer.Vector("Points of Interest", {
        projection: map.displayProjection,
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "static/flock.kml",
            format: new OpenLayers.Format.KML({
                extractStyles: true,
                extractAttributes: true
            })
        })
    });

    map.addLayers([baseOSM, /*mapnik, gmap, */poi]);

    select = new OpenLayers.Control.SelectFeature(poi);
    
    poi.events.on({
        "featureselected": onFeatureSelect,
        "featureunselected": onFeatureUnselect
    });

    map.addControl(select);
    select.activate();   

    map.addControl(new OpenLayers.Control.Attribution());
    map.addControl(new OpenLayers.Control.LayerSwitcher());

    var point = new OpenLayers.LonLat(lon, lat);
    point.transform(map.displayProjection, map.getProjectionObject());
    map.setCenter(point);
    map.zoomTo(zoom);
}
function onPopupClose(evt) {
    select.unselectAll();
}
function onFeatureSelect(event) {
    var feature = event.feature;
    var selectedFeature = feature;
    var popup = new OpenLayers.Popup.FramedCloud("chicken", 
        feature.geometry.getBounds().getCenterLonLat(),
        new OpenLayers.Size(100,100),
        "<h2>"+feature.attributes.name + "</h2>" + feature.attributes.description,
        null, true, onPopupClose
    );
    feature.popup = popup;
    map.addPopup(popup);
}
function onFeatureUnselect(event) {
    var feature = event.feature;
    if(feature.popup) {
        map.removePopup(feature.popup);
        feature.popup.destroy();
        delete feature.popup;
    }
}
