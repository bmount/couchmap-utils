var po = org.polymaps;

var map = po.map()
  .container(document.body.appendChild(po.svg("svg")))
  .center({lat: 37.76, lon: -122.44})
  .zoom(4)
  .add(po.interact())
  .add(po.hash());

map.add(po.geoJson()
  .url("../tgs/_spatial/_list/geojson/geoms?bbox={G}")
  .id("your_id_here")
  .tile(true)
  .on("load", load))

map.add(po.compass()
  .pan("none"));

function load(e) {
  for (var i = 0; i < e.features.length; i++) {
    var feature = e.features[i];
    feature.element.setAttribute("id", feature.data.properties);
  }
}
