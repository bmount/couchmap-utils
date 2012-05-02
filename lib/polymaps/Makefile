JS_FILES = \
	src/start.js \
	src/ns.js \
	src/Id.js \
	src/Svg.js \
	src/Transform.js \
	src/Cache.js \
	src/Url.js \
	src/Dispatch.js \
	src/Queue.js \
	src/Map.js \
	src/Layer.js \
	src/Image.js \
	src/GeoJson.js \
	src/Dblclick.js \
	src/Drag.js \
	src/Wheel.js \
	src/Arrow.js \
	src/Hash.js \
	src/Touch.js \
	src/Interact.js \
	src/Compass.js \
	src/Grid.js \
	src/Stylist.js \
	src/end.js

JS_COMPILER = \
	java -jar lib/google-compiler/compiler-20100616.jar \
	--charset UTF-8

all: polymaps-cmu.min.js polymaps-cmu.js

%.min.js: %.js
	$(JS_COMPILER) < $^ > $@

polymaps-cmu.min.js: polymaps-cmu.js
	rm -f $@
	$(JS_COMPILER) < polymaps-cmu.js >> $@

polymaps-cmu.js: $(JS_FILES) Makefile
	rm -f $@
	cat $(JS_FILES) >> $@
	chmod a-w $@

clean:
	rm -rf polymaps-cmu.js polymaps-cmu.min.js
