# A really simple way to make SVG maps

Example: [Kelsovian planet earth svg map](http://bv.iriscouch.com/natural110m/_design/tgs/index.html)

This is a little toolkit for maximal relaxation in the production of svg maps, using CouchDB and Polymaps. Basic idea is to get Polymaps' incremental loading and panning together with GeoCouch's incremental indexer and bounding box implemenation.

The only potentially non-obvious thing in here is the addition of a Polymaps/ModestMaps substitution variable compatible with GeoCouch's `bbox` parameter. This means Polymaps will treat your couch very much like a tile map service, and will load the right things at the right time in a smooth way. 

A goal will be to write or generate a number of list functions with names like `level_1` and `level_2`, taking into acount whatever is important about the geography of interest, and then using zoom levels and the `{Z}` substitution variable for a real tile-map like experience. Also might enable some stuff that is often tricky: like a choropleth or isarithm at lower zoom levels that pans down to per-geometry details at higher ones.

# Non-gory details

First link is [Nathaniel Kelso's](http://www.naturalearthdata.com/) [110m Resolution Natural Earth](http://bv.iriscouch.com/natural110m/_design/tgs/index.html) on a [free Couch](http://iriscouch.com).

If you wanted the above example on your laptop, you could download CouchDB [from here](http://www.couchbase.com/downloads/couchbase-single-server/community), then open your browser to `localhost:5984/_utils`, click 'Create Database', name it 'easy', click 'replicator', choose "from remote" -> `http://bv.iriscouch.com/natural110m` "to local" -> `easy`, then open your browser to `localhost:5984/easy/_design/tgs/index.html`.

General context for this app is that it is inspired by, and copied from, Max Ogden, Volker Mische, and Benjamin Erb. Idea is to be between vmx/geocouch-utils and maxogden/geocouch-utils, see those repos for really crack js in barer and more end-user-ready form, respectively.

# Background on couchapps, CouchDB:

This is a [CouchApp](http://couchapp.org/page/index) providing spatial functions and a set of helper scripts for [GeoCouch](https://github.com/vmx/couchdb).

## CouchApp

The folder `couchapp/` is a CouchApp that provides useful spatial functions.

### Quick install (without cloning this repo)

* If you don't already have one, make a database on your couch: <code>curl -X PUT http://YOURCOUCH/DBNAME</code>
* Replicate the geocouch utils from my public couch to your database: <code>curl -X POST -H 'Content-type: application/json' http://YOURCOUCH/\_replicate -d '{"source":"http://vmx.iriscouch.com/apps","target":"http://YOURCOUCH/DBNAME", "doc\_ids":["_design/gc-utils"]}'</code>

### In-depth install

If you don't have a database, you'll have to create a new database to store your data. You can do this from http://YOURCOUCH/_utils or with <code>curl</code>:

<code>curl -X PUT http://YOURCOUCH/DBNAME</code>

When you store geo data in GeoCouch, the geometry is stored in the `geometry` property, all
other properties in the `properties` property:

    // add a document with a valid geometry into your database
    $ curl -X PUT http://localhost:5984/DBNAME/myfeature -d '{"type":"Feature", "color":"orange" ,"geometry":{"type":"Point","coordinates":[11.395,48.949444]}}'
    {"ok":true,"id":"myfeature","rev":"1-2eeb1e5eee6c8e7507b671aa7d5b0654"}

You can either replicate the couchapp from my public couch at [http://vmx.iriscouch.com/apps/_design/gc-utils](http://vmx.iriscouch.com/apps/_design/gc-utils) (quickest option) or, if you want to hack on the source code first, you'll need to install the [CouchApp command line utility](http://couchapp.org/page/installing) and check out this repo.

If you want to hack on the code (aka build it yourself), once you have the couchapp utility working, <code>git clone</code> this repo and go into this folder and execute <code>couchapp init</code>. To upload these utils into your couch just run <code>couchapp push http://YOURCOUCH/DATABASENAME</code>. Otherwise see the Quick install section above.

This relies on [https://github.com/maxogden/geojson-js-utils](https://github.com/maxogden/geojson-js-utils) Make sure you also clone the submodules.  This can be done simply with these git commands:
     git submodule init
     git submodule update


When you push these utils into your couch it will enhance your database with the magical geo sprinkles contained in this repo and teach your database how to do awesome things with geo data. At this point you can use the following commands:


### Document Structure used in this CouchApp

The document structure is used consistently within all views and examples, assuming that location information is provided in `doc.geometry` containing a GeoJSON struct.
If your document structure differs, don't forget to adapt the (spatial) indexes.

Example:

	{
	   "_id": "c0c048ad2770bb836a10f164cc0a3fc0",
	   "_rev": "1-e2d2130da93ca435965d6d3efca22380",
	   "geometry": {
	       "type": "Point",
	       "coordinates": [
	           48.417,
	           9.983
	       ]
	   },
	   "etc" : "..."
	}

### [Spatial Indexes](https://github.com/couchbase/geocouch)

#### geoms.js

A spatial function that additionally emits the original GeoJSON value and the ID of the document.

Example:

	$ curl 'http://localhost:5984/gc-utils/_design/gc-utils/_spatial/geoms?bbox=80,88,90,90'
	{
	    "update_seq": 3,
            "rows": [
                {
                    "bbox": [
                        87.286559625063092,
                        89.333551788702607,
                        87.286559625063092,
                        89.333551788702607
                    ],
                    "geometry": {
                        "coordinates": [
                            87.286559625063092,
                            89.333551788702607
                        ],
                        "type": "Point"
                    },
                    "id": "c41ca5a5a455fcec882c5c15090013ed",
                    "value": "c41ca5a5a455fcec882c5c15090013ed"
                },
                {
                    "bbox": [
                        89.836807711981237,
                        89.573606480378658,
                        89.836807711981237,
                        89.573606480378658
                    ],
                    "geometry": {
                        "coordinates": [
                            89.836807711981237,
                            89.573606480378658
                        ],
                        "type": "Point"
                    },
                    "id": "c41ca5a5a455fcec882c5c1509000d92",
                    "value": "c41ca5a5a455fcec882c5c1509000d92"
                }
            ]
        }

#### geomsFull.js

A spatial function that emits both GeoJSON and the full document (as value).

Example:

	$ curl 'http://localhost:5984/gc-utils/_design/gc-utils/_spatial/geomsFull?bbox=80,88,90,90'
        {
            "update_seq": 3,
            "rows": [
                {
                    "bbox": [
                        87.286559625063092,
                        89.333551788702607,
                        87.286559625063092,
                        89.333551788702607
                    ],
                    "geometry": {
                        "coordinates": [
                            87.286559625063092,
                            89.333551788702607
                        ],
                        "type": "Point"
                    },
                    "id": "c41ca5a5a455fcec882c5c15090013ed",
                    "value": {
                        "_id": "c41ca5a5a455fcec882c5c15090013ed",
                        "_rev": "1-8fe2437f80b8770e85274e981651555b",
                        "geometry": {
                            "coordinates": [
                                87.286559625063092,
                                89.333551788702607
                            ],
                            "type": "Point"
                        }
                    }
                }
            ]
        }

#### geomsOnly.js

A spatial function that only emits GeoJSON and no additional value.

Example:

	$ curl 'http://localhost:5984/gc-utils/_design/gc-utils/_spatial/geomsOnly?bbox=80,88,90,90'
        {
            "update_seq": 3,
            "rows": [
                {
                    "bbox": [
                        87.286559625063092,
                        89.333551788702607,
                        87.286559625063092,
                        89.333551788702607
                    ],
                    "geometry": {
                        "coordinates": [
                            87.286559625063092,
                            89.333551788702607
                        ],
                        "type": "Point"
                    },
                    "id": "c41ca5a5a455fcec882c5c15090013ed",
                    "value": null
                }
            ]
        }

#### geomsProps.js

A spatial function that emits the geometry plus the value of the
properties field of the document (or null if not defined).

Example:

	$ curl 'http://localhost:5984/gc-utils/_design/gc-utils/_spatial/geomsProps?bbox=80,88,90,90'
        {
            "update_seq": 3,
            "rows": [
                {
                    "bbox": [
                        87.286559625063092,
                        89.333551788702607,
                        87.286559625063092,
                        89.333551788702607
                    ],
                    "geometry": {
                        "coordinates": [
                            87.286559625063092,
                            89.333551788702607
                        ],
                        "type": "Point"
                    },
                    "id": "c41ca5a5a455fcec882c5c15090013ed",
                    "value": {
                        "some": "value"
                    }
                }
            ]
        }


### [Views](http://guide.couchdb.org/draft/views.html)

#### all

A simple map function that returns all documents. It's like _all_docs, but you can use it as a regular view.

### [List Functions](http://guide.couchdb.org/draft/transforming.html)

#### kml.js

This list functions generates a simple KML feed

Examples:

Open a tool capable of handling KML feeds and import your query link: `http://localhost:5984/gc-utils/_design/gc-utils/_spatial/_list/kml/geoms?bbox=0,0,45,45`

#### geojson.js

This function outputs a GeoJSON FeatureCollection (compatible with
OpenLayers). JSONP is supported as well (`callback` must be given as
request parameter).

Examples:

    $ curl -X PUT -d '{"type":"Feature", "color":"orange" ,"geometry":{"type":"Point","coordinates":[11.395,48.949444]}}' 'http://localhost:5984/gc-utils/myfeature'
	{
	   "ok":true,
	   "id":"myfeature",
	   "rev":"1-2eeb1e5eee6c8e7507b671aa7d5b0654"
	}


	$curl -X GET 'http://localhost:5984/gc-utils/_design/gc-utils/_spatial/_list/geojson/geoms?bbox=80,88,90,90'
	{
	   "type":"FeatureCollection",
	   "features":[
	      {
	         "type":"Feature",
	         "geometry":{
	            "type":"Point",
	            "coordinates":[
	               81.0876957164146,
	               89.14168435614556
	            ]
	         },
	         "properties":{
	            "id":"c0c048ad2770bb836a10f164cc08a3e5"
	         }
	      }
	   ]
	}

#### radius.js

This will take the centroid of the bbox parameter and a supplied radius parameter in meters and filter the rectangularly shaped bounding box result set by circular radius.

**WARNING** This only works with on points, not lines or polygons yet

Example:

	$ curl -X GET http://localhost:5984/gc-utils/_design/gc-utils/_spatial/_list/radius/geoms?bbox=-122.677,45.523,-122.675,45.524&radius=50
	{
	   "type":"FeatureCollection",
	   "features":[
	      {
		 "type":"Feature",
		 "geometry":{
		    "coordinates":[
		       -122.676375038274,
		       45.5233877497394
		    ],
		    "type":"Point"
		 },
		 "properties":{
		    "id":"b7f31f5062745b6ca1c1adfc0c2351a1"
		 }
	      }
	   ]
	}

#### proximity-clustering.js

This groups points into clusters based on proximity. You can supply a threshold (distance in km) which detrimines how much area each cluster covers.

Some code inspiration from Marker Clusterer - found here: [http://code.google.com/p/gmaps-utility-library/](http://code.google.com/p/gmaps-utility-library/)

WARNING This only works with on points, not lines or polygons (not sure how that would be useful yet)

Example:
    $ curl -X GET 'http://localhost:5984/mydb/_design/gc-utils/_spatial/_list/cluster/geoms?bbox=-122.677,45.523,-122.675,45.524&threshold=50'
    {"rows": [{
        "center": {
            "type": "Point",
            "coordinates": [
                41.35646666666667,
                1.6144666666666663
            ]
        },
        "points": [{
            "id": "20132885373657090",
            "geo": {
                "type": "Point",
                "coordinates": [
                    41.3401,
                    1.3596
                ]
            }
        },
        {
            "id": "20138805986066430",
            "geo": {
                "type": "Point",
                "coordinates": [
                    41.3493,
                    1.3631
                 ]
             }
        }],
        "size": 2
    }]}


## Helper Scripts

In the folder `misc` you can find helpful scripts or snippets for GeoCouch.

### geocouch-filler-js

This node.js script can be handy for generating test data. It creates random documents within given value ranges. The script expects the following parameters:

 * The URI of the database to fill
 * A bounding box of the area to fill (as bbox JSON array)
 * The number of documents to generate

Example call:

	node geocouch-filler.js http://localhost:5984/gc-utils [-180,-90,180,90] 1000

This will create 1.000 documents with random locations spread over the whole world.


## License

Licensed under the MIT License.

