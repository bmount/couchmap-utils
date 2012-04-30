var po = org.polymaps;

function setup () {
var map = po.map()
  .container(document.body.appendChild(po.svg("svg")))
  .center({lat: 37.781489, lon: -122.398982}) //  37.7455, lon: h ? h.split('/')[2] : -122.42203}
  .zoomRange([1, 18]) // 37.781489;-122.398982
  .zoom(16)
  .add(po.interact())
  .add(po.hash());

map.add(po.image().url(po.url("http://tile.stamen.com/watercolor/{Z}/{X}/{Y}.jpg")))

map.add(po.geoJson().url("dogpouch_clean.json").on("load", load))

/*
 * Something you could use with GeoCouch
map.add(po.geoJson()
  .url("../tgs/_spatial/_list/geojson/geomsFull?bbox={G}")
  .tile(true)
  .on("load", load))
*/


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
    you.textContent = "thank you for choosing dogpouch"
    you.appendChild(youp)
    thank.appendChild(you)
}

map.add(po.compass()
  .pan("none"));

uninitializedGeoJson = true;

function load(f) {
  var box = document.querySelector("#infobox")
  box.textContent = "[Papaya Whip]"
  for (var i = 0; i < f.features.length; i++) {
    var colorId = Math.floor(Math.random()*16777215).toString(16),
      ptinterest = document.createElement("p")
    ptinterest.setAttribute("id", "p-"+colorId)
    ptinterest.addEventListener("mouseover", whichPatch)
    ptinterest.addEventListener("touchstart", whichPatch)
    var feat = f.features[i],
      props = feat.data.properties
    ptinterest.innerHTML = props.Name;
    box.appendChild(ptinterest)
    console.log(feat)
    console.log(feat)
    feat.element.setAttribute("stroke", '#CCCCCC')
    feat.element.setAttribute("fill", '#'+colorId)
    feat.element.setAttribute("opacity", .3)
    feat.element.setAttribute("class", "patch")
    feat.element.setAttribute("id", "svg-"+colorId)
    console.log(feat.element.getAttribute("id"))
    feat.element.setAttribute("dataStash", JSON.stringify(props))

    //feature.element.setAttribute("id", feature.data.properties);
  }
  thankYouForChoosing()
}
}
window.addEventListener("DOMContentLoaded", setup)
