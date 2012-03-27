var po = org.polymaps;

var map = po.map()
  .container(document.body.appendChild(po.svg("svg")))
  .center({lat: 37.7455, lon: -122.42203}) //  37.7455, lon: h ? h.split('/')[2] : -122.42203}
  .zoomRange([20])
  .zoom(20)
  .add(po.interact())
  .add(po.hash());

map.add(po.image().url(po.url("/sesf/tile-{Z}-{X}-{Y}/tile-{Z}-{X}-{Y}.png")));



map.add(po.geoJson()
  .url("../tgs/_spatial/_list/geojson/geoms?bbox={G}")
  .tile(true)
  .on("load", load))

map.add(po.compass()
  .pan("none"));

function load(f) {
  for (var i = 0; i < f.features.length; i++) {
    var feat = f.features[i],
      props = feat.data.properties
    feat.element.setAttribute("stroke", "green")
    feat.element.setAttribute("fill", "none")

    //feature.element.setAttribute("id", feature.data.properties);
  }
}
