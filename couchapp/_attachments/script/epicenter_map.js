var po = org.polymaps;

function setup () {
var map = po.map()
  .container(document.body.appendChild(po.svg("svg")))
  .center({lat: 37.781489, lon: -122.398982}) //  37.7455, lon: h ? h.split('/')[2] : -122.42203}
  .zoomRange([17, 17]) // 37.781489;-122.398982
  .zoom(17)
  .add(po.interact())
  .add(po.hash());

map.add(po.image().url(po.url("http://tile.stamen.com/watercolor/{Z}/{X}/{Y}.jpg")))

map.add(po.geoJson().url("json_features/xmarks.json").on("load", xMarks))

function xMarks (f) {
  for (var i = 0; i < f.features.length; i++) {
    feat = f.features[i]
    feat.element.setAttribute("fill", "green")
    feat.element.setAttribute("stroke", "#000")
    feat.element.setAttribute("opacity", .5)
  }
}

/*
 * Something you could use with GeoCouch
map.add(po.geoJson()
  .url("../tgs/_spatial/_list/geojson/geomsFull?bbox={G}")
  .tile(true)
  .on("load", load))
*/


    function blockUv (pts) {
      var st = (pts[0][0] <= pts[1][0])? [0,1]: [1,0],
        bl = [pts[st[0]], pts[st[1]]],
        blr = [pts[st[1]], pts[st[0]]],
        dx = bl[0][0] - bl[1][0],
        dy = 1.2*(bl[0][1] - bl[1][1]), // TODO properly project
        l = Math.pow(Math.pow(dx, 2) + Math.pow(dy, 2), .5),
        horizontal = (Math.abs(dx) > Math.abs(dy))? true: false,
        angle = Math.atan(dy/dx) * 180 / Math.PI * (-1)
        if (1) { // Add labels on opposite ends if big street seg
        //if (l < .0012) { // Add labels on opposite ends if big street seg
          blr = false
        }
       if (l < .0008) {
        return false;
       } 
      return [angle, bl, blr, horizontal]
    }

    function tileStreetLabels () {
      // https://gist.github.com/900050
      map.add(streetLabels("json_features/osm_epicenter_streets.json"));

      // Custom layer implementation.
      function streetLabels(url) {

        // Create the tiler, for organizing our points into tile boundaries.
        var tiler = d3.geo.tiler()
            .zoom(17)
            .location(function(d) { return d.value; });

        // Create the base layer object, using our tile factory.
        var layer = po.layer(load);

        // Load the data. When the data comes back, reload.
        //var sameIntersection = false
        var sameIntersection = {}
        d3.json(url, function(json) {
          var rv = {}
          for (var k = 0; k < json.features.length; k++) {
            var corners = blockUv(json.features[k].geometry.coordinates)
            if (!corners) continue;
            var streetName = json.features[k].properties.properties.nm,
                xRule = (streetName.length > 18)? 200: 40, // shamelelssly trying to make demo work ;)
                stid = 'stid-'+Math.floor(Math.random()*16777215).toString(16),
                angVal = corners[0]
            rv[stid] = [corners[1][0][0], corners[1][0][1],
              streetName, angVal, xRule]; 
              if (corners[2]) {
                if (!(corners[3])) {
                  angVal += 180
                } else {
                  xRule -= 200
                }
                rv[stid+'-reverse'] = [corners[2][0][0], corners[2][0][1],
                streetName, angVal, xRule];
                console.log('reversed')
                console.log([rv[stid+'-reverse'], corners])
              }
          }
          tiler.points(d3.entries(rv))
          sameIntersection = {}
          layer.reload();
        });

        // Custom tile implementation.
        function load(tile, projection) {
          projection = projection(tile).locationPoint;

          // Add an svg:g for each street.
          var g = d3.select(tile.element = po.svg("g")).selectAll("g")
              .data(tiler.tile(tile.column, tile.row, tile.zoom))
            .enter().append("svg:g")
              .attr("transform", transform);

          // Add a circle. Not using atm
          g.append("svg:circle")
              .style("fill", "none")
              //.style("fill", d3.hsl(Math.random() * 360, 1, .5))
              .attr("r", 4.5);

          // label. color like house: "#f5f0d0" like lot bg: "#f5f0d0"
          g.append("svg:text")
              .attr("x", function (d) { return d.value[4] })
              //.attr("y", 15)
              .attr("dy", ".12em")
              .attr("font-family", "Lato, sans-serif")
              .attr("font-size", "13")
              .attr("fill", "#111111")
              .attr("transform", function (d) { return "rotate("+ d.value[3] +")"} )
              .text(function(d) { var ang = d.value[3]; if (typeof ang != 'undefined') return d.value[2]; });

          function transform(d) {
            d = projection({lon: d.value[0], lat: d.value[1]});
            return "translate(" + d.x + "," + d.y + ")";
          }
        }

        return layer;
      }
    }

function whichPatch (evt) {
  var outPatches = document.querySelectorAll(".patch"),
      showable = document.querySelector("#"+evt.target.id.replace("p-", "svg-")),
      thanks = document.querySelector("#infoThankYou h1")
  for (var i = 0; i < outPatches.length; i++) {
    outPatches[i].setAttribute("opacity", 0)
  }
  showable.setAttribute("opacity", .5)
  thanks.textContent = JSON.parse(showable.getAttribute("dataStash")).Name
  console.log(showable)
  console.log("doinit")
}

function thankYouForChoosing () {
  var thank = document.querySelector("#infoThankYou")
  thank.textContent = ""
  var you = document.createElement("h1"),
      youp = document.createElement("h1")
    you.textContent = "X marks the spot!"
    you.appendChild(youp)
    thank.appendChild(you)
}


uninitializedGeoJson = true;

  thankYouForChoosing()
  tileStreetLabels()
}
window.addEventListener("DOMContentLoaded", setup)
