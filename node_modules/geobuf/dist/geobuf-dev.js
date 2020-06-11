(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.geobuf = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = decode;

var keys, values, lengths, dim, e;

var geometryTypes = [
    'Point', 'MultiPoint', 'LineString', 'MultiLineString',
    'Polygon', 'MultiPolygon', 'GeometryCollection'];

function decode(pbf) {
    dim = 2;
    e = Math.pow(10, 6);
    lengths = null;

    keys = [];
    values = [];
    var obj = pbf.readFields(readDataField, {});
    keys = null;

    return obj;
}

function readDataField(tag, obj, pbf) {
    if (tag === 1) keys.push(pbf.readString());
    else if (tag === 2) dim = pbf.readVarint();
    else if (tag === 3) e = Math.pow(10, pbf.readVarint());

    else if (tag === 4) readFeatureCollection(pbf, obj);
    else if (tag === 5) readFeature(pbf, obj);
    else if (tag === 6) readGeometry(pbf, obj);
}

function readFeatureCollection(pbf, obj) {
    obj.type = 'FeatureCollection';
    obj.features = [];
    return pbf.readMessage(readFeatureCollectionField, obj);
}

function readFeature(pbf, feature) {
    feature.type = 'Feature';
    var f = pbf.readMessage(readFeatureField, feature);
    if (!f.hasOwnProperty('geometry')) f.geometry = null;
    return f;
}

function readGeometry(pbf, geom) {
    return pbf.readMessage(readGeometryField, geom);
}

function readFeatureCollectionField(tag, obj, pbf) {
    if (tag === 1) obj.features.push(readFeature(pbf, {}));

    else if (tag === 13) values.push(readValue(pbf));
    else if (tag === 15) readProps(pbf, obj);
}

function readFeatureField(tag, feature, pbf) {
    if (tag === 1) feature.geometry = readGeometry(pbf, {});

    else if (tag === 11) feature.id = pbf.readString();
    else if (tag === 12) feature.id = pbf.readSVarint();

    else if (tag === 13) values.push(readValue(pbf));
    else if (tag === 14) feature.properties = readProps(pbf, {});
    else if (tag === 15) readProps(pbf, feature);
}

function readGeometryField(tag, geom, pbf) {
    if (tag === 1) geom.type = geometryTypes[pbf.readVarint()];

    else if (tag === 2) lengths = pbf.readPackedVarint();
    else if (tag === 3) readCoords(geom, pbf, geom.type);
    else if (tag === 4) {
        geom.geometries = geom.geometries || [];
        geom.geometries.push(readGeometry(pbf, {}));
    }
    else if (tag === 13) values.push(readValue(pbf));
    else if (tag === 15) readProps(pbf, geom);
}

function readCoords(geom, pbf, type) {
    if (type === 'Point') geom.coordinates = readPoint(pbf);
    else if (type === 'MultiPoint') geom.coordinates = readLine(pbf, true);
    else if (type === 'LineString') geom.coordinates = readLine(pbf);
    else if (type === 'MultiLineString') geom.coordinates = readMultiLine(pbf);
    else if (type === 'Polygon') geom.coordinates = readMultiLine(pbf, true);
    else if (type === 'MultiPolygon') geom.coordinates = readMultiPolygon(pbf);
}

function readValue(pbf) {
    var end = pbf.readVarint() + pbf.pos,
        value = null;

    while (pbf.pos < end) {
        var val = pbf.readVarint(),
            tag = val >> 3;

        if (tag === 1) value = pbf.readString();
        else if (tag === 2) value = pbf.readDouble();
        else if (tag === 3) value = pbf.readVarint();
        else if (tag === 4) value = -pbf.readVarint();
        else if (tag === 5) value = pbf.readBoolean();
        else if (tag === 6) value = JSON.parse(pbf.readString());
    }
    return value;
}

function readProps(pbf, props) {
    var end = pbf.readVarint() + pbf.pos;
    while (pbf.pos < end) props[keys[pbf.readVarint()]] = values[pbf.readVarint()];
    values = [];
    return props;
}

function readPoint(pbf) {
    var end = pbf.readVarint() + pbf.pos,
        coords = [];
    while (pbf.pos < end) coords.push(pbf.readSVarint() / e);
    return coords;
}

function readLinePart(pbf, end, len, closed) {
    var i = 0,
        coords = [],
        p, d;

    var prevP = [];
    for (d = 0; d < dim; d++) prevP[d] = 0;

    while (len ? i < len : pbf.pos < end) {
        p = [];
        for (d = 0; d < dim; d++) {
            prevP[d] += pbf.readSVarint();
            p[d] = prevP[d] / e;
        }
        coords.push(p);
        i++;
    }
    if (closed) coords.push(coords[0]);

    return coords;
}

function readLine(pbf) {
    return readLinePart(pbf, pbf.readVarint() + pbf.pos);
}

function readMultiLine(pbf, closed) {
    var end = pbf.readVarint() + pbf.pos;
    if (!lengths) return [readLinePart(pbf, end, null, closed)];

    var coords = [];
    for (var i = 0; i < lengths.length; i++) coords.push(readLinePart(pbf, end, lengths[i], closed));
    lengths = null;
    return coords;
}

function readMultiPolygon(pbf) {
    var end = pbf.readVarint() + pbf.pos;
    if (!lengths) return [[readLinePart(pbf, end, null, true)]];

    var coords = [];
    var j = 1;
    for (var i = 0; i < lengths[0]; i++) {
        var rings = [];
        for (var k = 0; k < lengths[j]; k++) rings.push(readLinePart(pbf, end, lengths[j + 1 + k], true));
        j += lengths[j] + 1;
        coords.push(rings);
    }
    lengths = null;
    return coords;
}

},{}],2:[function(require,module,exports){
'use strict';

module.exports = encode;

var keys, keysNum, keysArr, dim, e,
    maxPrecision = 1e6;

var geometryTypes = {
    'Point': 0,
    'MultiPoint': 1,
    'LineString': 2,
    'MultiLineString': 3,
    'Polygon': 4,
    'MultiPolygon': 5,
    'GeometryCollection': 6
};

function encode(obj, pbf) {
    keys = {};
    keysArr = [];
    keysNum = 0;
    dim = 0;
    e = 1;

    analyze(obj);

    e = Math.min(e, maxPrecision);
    var precision = Math.ceil(Math.log(e) / Math.LN10);

    for (var i = 0; i < keysArr.length; i++) pbf.writeStringField(1, keysArr[i]);
    if (dim !== 2) pbf.writeVarintField(2, dim);
    if (precision !== 6) pbf.writeVarintField(3, precision);

    if (obj.type === 'FeatureCollection') pbf.writeMessage(4, writeFeatureCollection, obj);
    else if (obj.type === 'Feature') pbf.writeMessage(5, writeFeature, obj);
    else pbf.writeMessage(6, writeGeometry, obj);

    keys = null;

    return pbf.finish();
}

function analyze(obj) {
    var i, key;

    if (obj.type === 'FeatureCollection') {
        for (i = 0; i < obj.features.length; i++) analyze(obj.features[i]);

    } else if (obj.type === 'Feature') {
        if (obj.geometry !== null) analyze(obj.geometry);
        for (key in obj.properties) saveKey(key);

    } else if (obj.type === 'Point') analyzePoint(obj.coordinates);
    else if (obj.type === 'MultiPoint') analyzePoints(obj.coordinates);
    else if (obj.type === 'GeometryCollection') {
        for (i = 0; i < obj.geometries.length; i++) analyze(obj.geometries[i]);
    }
    else if (obj.type === 'LineString') analyzePoints(obj.coordinates);
    else if (obj.type === 'Polygon' || obj.type === 'MultiLineString') analyzeMultiLine(obj.coordinates);
    else if (obj.type === 'MultiPolygon') {
        for (i = 0; i < obj.coordinates.length; i++) analyzeMultiLine(obj.coordinates[i]);
    }

    for (key in obj) {
        if (!isSpecialKey(key, obj.type)) saveKey(key);
    }
}

function analyzeMultiLine(coords) {
    for (var i = 0; i < coords.length; i++) analyzePoints(coords[i]);
}

function analyzePoints(coords) {
    for (var i = 0; i < coords.length; i++) analyzePoint(coords[i]);
}

function analyzePoint(point) {
    dim = Math.max(dim, point.length);

    // find max precision
    for (var i = 0; i < point.length; i++) {
        while (Math.round(point[i] * e) / e !== point[i] && e < maxPrecision) e *= 10;
    }
}

function saveKey(key) {
    if (keys[key] === undefined) {
        keysArr.push(key);
        keys[key] = keysNum++;
    }
}

function writeFeatureCollection(obj, pbf) {
    for (var i = 0; i < obj.features.length; i++) {
        pbf.writeMessage(1, writeFeature, obj.features[i]);
    }
    writeProps(obj, pbf, true);
}

function writeFeature(feature, pbf) {
    if (feature.geometry !== null) pbf.writeMessage(1, writeGeometry, feature.geometry);

    if (feature.id !== undefined) {
        if (typeof feature.id === 'number' && feature.id % 1 === 0) pbf.writeSVarintField(12, feature.id);
        else pbf.writeStringField(11, feature.id);
    }

    if (feature.properties) writeProps(feature.properties, pbf);
    writeProps(feature, pbf, true);
}

function writeGeometry(geom, pbf) {
    pbf.writeVarintField(1, geometryTypes[geom.type]);

    var coords = geom.coordinates;

    if (geom.type === 'Point') writePoint(coords, pbf);
    else if (geom.type === 'MultiPoint') writeLine(coords, pbf, true);
    else if (geom.type === 'LineString') writeLine(coords, pbf);
    else if (geom.type === 'MultiLineString') writeMultiLine(coords, pbf);
    else if (geom.type === 'Polygon') writeMultiLine(coords, pbf, true);
    else if (geom.type === 'MultiPolygon') writeMultiPolygon(coords, pbf);
    else if (geom.type === 'GeometryCollection') {
        for (var i = 0; i < geom.geometries.length; i++) pbf.writeMessage(4, writeGeometry, geom.geometries[i]);
    }

    writeProps(geom, pbf, true);
}

function writeProps(props, pbf, isCustom) {
    var indexes = [],
        valueIndex = 0;

    for (var key in props) {
        if (isCustom && isSpecialKey(key, props.type)) {
            continue;
        }
        pbf.writeMessage(13, writeValue, props[key]);
        indexes.push(keys[key]);
        indexes.push(valueIndex++);
    }
    pbf.writePackedVarint(isCustom ? 15 : 14, indexes);
}

function writeValue(value, pbf) {
    if (value === null) return;

    var type = typeof value;

    if (type === 'string') pbf.writeStringField(1, value);
    else if (type === 'boolean') pbf.writeBooleanField(5, value);
    else if (type === 'object') pbf.writeStringField(6, JSON.stringify(value));
    else if (type === 'number') {
        if (value % 1 !== 0) pbf.writeDoubleField(2, value);
        else if (value >= 0) pbf.writeVarintField(3, value);
        else pbf.writeVarintField(4, -value);
    }
}

function writePoint(point, pbf) {
    var coords = [];
    for (var i = 0; i < dim; i++) coords.push(Math.round(point[i] * e));
    pbf.writePackedSVarint(3, coords);
}

function writeLine(line, pbf) {
    var coords = [];
    populateLine(coords, line);
    pbf.writePackedSVarint(3, coords);
}

function writeMultiLine(lines, pbf, closed) {
    var len = lines.length,
        i;
    if (len !== 1) {
        var lengths = [];
        for (i = 0; i < len; i++) lengths.push(lines[i].length - (closed ? 1 : 0));
        pbf.writePackedVarint(2, lengths);
        // TODO faster with custom writeMessage?
    }
    var coords = [];
    for (i = 0; i < len; i++) populateLine(coords, lines[i], closed);
    pbf.writePackedSVarint(3, coords);
}

function writeMultiPolygon(polygons, pbf) {
    var len = polygons.length,
        i, j;
    if (len !== 1 || polygons[0].length !== 1) {
        var lengths = [len];
        for (i = 0; i < len; i++) {
            lengths.push(polygons[i].length);
            for (j = 0; j < polygons[i].length; j++) lengths.push(polygons[i][j].length - 1);
        }
        pbf.writePackedVarint(2, lengths);
    }

    var coords = [];
    for (i = 0; i < len; i++) {
        for (j = 0; j < polygons[i].length; j++) populateLine(coords, polygons[i][j], true);
    }
    pbf.writePackedSVarint(3, coords);
}

function populateLine(coords, line, closed) {
    var i, j,
        len = line.length - (closed ? 1 : 0),
        sum = new Array(dim);
    for (j = 0; j < dim; j++) sum[j] = 0;
    for (i = 0; i < len; i++) {
        for (j = 0; j < dim; j++) {
            var n = Math.round(line[i][j] * e) - sum[j];
            coords.push(n);
            sum[j] += n;
        }
    }
}

function isSpecialKey(key, type) {
    if (key === 'type') return true;
    else if (type === 'FeatureCollection') {
        if (key === 'features') return true;
    } else if (type === 'Feature') {
        if (key === 'id' || key === 'properties' || key === 'geometry') return true;
    } else if (type === 'GeometryCollection') {
        if (key === 'geometries') return true;
    } else if (key === 'coordinates') return true;
    return false;
}

},{}],3:[function(require,module,exports){
'use strict';

exports.encode = require('./encode');
exports.decode = require('./decode');

},{"./decode":1,"./encode":2}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZWNvZGUuanMiLCJlbmNvZGUuanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVjb2RlO1xuXG52YXIga2V5cywgdmFsdWVzLCBsZW5ndGhzLCBkaW0sIGU7XG5cbnZhciBnZW9tZXRyeVR5cGVzID0gW1xuICAgICdQb2ludCcsICdNdWx0aVBvaW50JywgJ0xpbmVTdHJpbmcnLCAnTXVsdGlMaW5lU3RyaW5nJyxcbiAgICAnUG9seWdvbicsICdNdWx0aVBvbHlnb24nLCAnR2VvbWV0cnlDb2xsZWN0aW9uJ107XG5cbmZ1bmN0aW9uIGRlY29kZShwYmYpIHtcbiAgICBkaW0gPSAyO1xuICAgIGUgPSBNYXRoLnBvdygxMCwgNik7XG4gICAgbGVuZ3RocyA9IG51bGw7XG5cbiAgICBrZXlzID0gW107XG4gICAgdmFsdWVzID0gW107XG4gICAgdmFyIG9iaiA9IHBiZi5yZWFkRmllbGRzKHJlYWREYXRhRmllbGQsIHt9KTtcbiAgICBrZXlzID0gbnVsbDtcblxuICAgIHJldHVybiBvYmo7XG59XG5cbmZ1bmN0aW9uIHJlYWREYXRhRmllbGQodGFnLCBvYmosIHBiZikge1xuICAgIGlmICh0YWcgPT09IDEpIGtleXMucHVzaChwYmYucmVhZFN0cmluZygpKTtcbiAgICBlbHNlIGlmICh0YWcgPT09IDIpIGRpbSA9IHBiZi5yZWFkVmFyaW50KCk7XG4gICAgZWxzZSBpZiAodGFnID09PSAzKSBlID0gTWF0aC5wb3coMTAsIHBiZi5yZWFkVmFyaW50KCkpO1xuXG4gICAgZWxzZSBpZiAodGFnID09PSA0KSByZWFkRmVhdHVyZUNvbGxlY3Rpb24ocGJmLCBvYmopO1xuICAgIGVsc2UgaWYgKHRhZyA9PT0gNSkgcmVhZEZlYXR1cmUocGJmLCBvYmopO1xuICAgIGVsc2UgaWYgKHRhZyA9PT0gNikgcmVhZEdlb21ldHJ5KHBiZiwgb2JqKTtcbn1cblxuZnVuY3Rpb24gcmVhZEZlYXR1cmVDb2xsZWN0aW9uKHBiZiwgb2JqKSB7XG4gICAgb2JqLnR5cGUgPSAnRmVhdHVyZUNvbGxlY3Rpb24nO1xuICAgIG9iai5mZWF0dXJlcyA9IFtdO1xuICAgIHJldHVybiBwYmYucmVhZE1lc3NhZ2UocmVhZEZlYXR1cmVDb2xsZWN0aW9uRmllbGQsIG9iaik7XG59XG5cbmZ1bmN0aW9uIHJlYWRGZWF0dXJlKHBiZiwgZmVhdHVyZSkge1xuICAgIGZlYXR1cmUudHlwZSA9ICdGZWF0dXJlJztcbiAgICB2YXIgZiA9IHBiZi5yZWFkTWVzc2FnZShyZWFkRmVhdHVyZUZpZWxkLCBmZWF0dXJlKTtcbiAgICBpZiAoIWYuaGFzT3duUHJvcGVydHkoJ2dlb21ldHJ5JykpIGYuZ2VvbWV0cnkgPSBudWxsO1xuICAgIHJldHVybiBmO1xufVxuXG5mdW5jdGlvbiByZWFkR2VvbWV0cnkocGJmLCBnZW9tKSB7XG4gICAgcmV0dXJuIHBiZi5yZWFkTWVzc2FnZShyZWFkR2VvbWV0cnlGaWVsZCwgZ2VvbSk7XG59XG5cbmZ1bmN0aW9uIHJlYWRGZWF0dXJlQ29sbGVjdGlvbkZpZWxkKHRhZywgb2JqLCBwYmYpIHtcbiAgICBpZiAodGFnID09PSAxKSBvYmouZmVhdHVyZXMucHVzaChyZWFkRmVhdHVyZShwYmYsIHt9KSk7XG5cbiAgICBlbHNlIGlmICh0YWcgPT09IDEzKSB2YWx1ZXMucHVzaChyZWFkVmFsdWUocGJmKSk7XG4gICAgZWxzZSBpZiAodGFnID09PSAxNSkgcmVhZFByb3BzKHBiZiwgb2JqKTtcbn1cblxuZnVuY3Rpb24gcmVhZEZlYXR1cmVGaWVsZCh0YWcsIGZlYXR1cmUsIHBiZikge1xuICAgIGlmICh0YWcgPT09IDEpIGZlYXR1cmUuZ2VvbWV0cnkgPSByZWFkR2VvbWV0cnkocGJmLCB7fSk7XG5cbiAgICBlbHNlIGlmICh0YWcgPT09IDExKSBmZWF0dXJlLmlkID0gcGJmLnJlYWRTdHJpbmcoKTtcbiAgICBlbHNlIGlmICh0YWcgPT09IDEyKSBmZWF0dXJlLmlkID0gcGJmLnJlYWRTVmFyaW50KCk7XG5cbiAgICBlbHNlIGlmICh0YWcgPT09IDEzKSB2YWx1ZXMucHVzaChyZWFkVmFsdWUocGJmKSk7XG4gICAgZWxzZSBpZiAodGFnID09PSAxNCkgZmVhdHVyZS5wcm9wZXJ0aWVzID0gcmVhZFByb3BzKHBiZiwge30pO1xuICAgIGVsc2UgaWYgKHRhZyA9PT0gMTUpIHJlYWRQcm9wcyhwYmYsIGZlYXR1cmUpO1xufVxuXG5mdW5jdGlvbiByZWFkR2VvbWV0cnlGaWVsZCh0YWcsIGdlb20sIHBiZikge1xuICAgIGlmICh0YWcgPT09IDEpIGdlb20udHlwZSA9IGdlb21ldHJ5VHlwZXNbcGJmLnJlYWRWYXJpbnQoKV07XG5cbiAgICBlbHNlIGlmICh0YWcgPT09IDIpIGxlbmd0aHMgPSBwYmYucmVhZFBhY2tlZFZhcmludCgpO1xuICAgIGVsc2UgaWYgKHRhZyA9PT0gMykgcmVhZENvb3JkcyhnZW9tLCBwYmYsIGdlb20udHlwZSk7XG4gICAgZWxzZSBpZiAodGFnID09PSA0KSB7XG4gICAgICAgIGdlb20uZ2VvbWV0cmllcyA9IGdlb20uZ2VvbWV0cmllcyB8fCBbXTtcbiAgICAgICAgZ2VvbS5nZW9tZXRyaWVzLnB1c2gocmVhZEdlb21ldHJ5KHBiZiwge30pKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGFnID09PSAxMykgdmFsdWVzLnB1c2gocmVhZFZhbHVlKHBiZikpO1xuICAgIGVsc2UgaWYgKHRhZyA9PT0gMTUpIHJlYWRQcm9wcyhwYmYsIGdlb20pO1xufVxuXG5mdW5jdGlvbiByZWFkQ29vcmRzKGdlb20sIHBiZiwgdHlwZSkge1xuICAgIGlmICh0eXBlID09PSAnUG9pbnQnKSBnZW9tLmNvb3JkaW5hdGVzID0gcmVhZFBvaW50KHBiZik7XG4gICAgZWxzZSBpZiAodHlwZSA9PT0gJ011bHRpUG9pbnQnKSBnZW9tLmNvb3JkaW5hdGVzID0gcmVhZExpbmUocGJmLCB0cnVlKTtcbiAgICBlbHNlIGlmICh0eXBlID09PSAnTGluZVN0cmluZycpIGdlb20uY29vcmRpbmF0ZXMgPSByZWFkTGluZShwYmYpO1xuICAgIGVsc2UgaWYgKHR5cGUgPT09ICdNdWx0aUxpbmVTdHJpbmcnKSBnZW9tLmNvb3JkaW5hdGVzID0gcmVhZE11bHRpTGluZShwYmYpO1xuICAgIGVsc2UgaWYgKHR5cGUgPT09ICdQb2x5Z29uJykgZ2VvbS5jb29yZGluYXRlcyA9IHJlYWRNdWx0aUxpbmUocGJmLCB0cnVlKTtcbiAgICBlbHNlIGlmICh0eXBlID09PSAnTXVsdGlQb2x5Z29uJykgZ2VvbS5jb29yZGluYXRlcyA9IHJlYWRNdWx0aVBvbHlnb24ocGJmKTtcbn1cblxuZnVuY3Rpb24gcmVhZFZhbHVlKHBiZikge1xuICAgIHZhciBlbmQgPSBwYmYucmVhZFZhcmludCgpICsgcGJmLnBvcyxcbiAgICAgICAgdmFsdWUgPSBudWxsO1xuXG4gICAgd2hpbGUgKHBiZi5wb3MgPCBlbmQpIHtcbiAgICAgICAgdmFyIHZhbCA9IHBiZi5yZWFkVmFyaW50KCksXG4gICAgICAgICAgICB0YWcgPSB2YWwgPj4gMztcblxuICAgICAgICBpZiAodGFnID09PSAxKSB2YWx1ZSA9IHBiZi5yZWFkU3RyaW5nKCk7XG4gICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMikgdmFsdWUgPSBwYmYucmVhZERvdWJsZSgpO1xuICAgICAgICBlbHNlIGlmICh0YWcgPT09IDMpIHZhbHVlID0gcGJmLnJlYWRWYXJpbnQoKTtcbiAgICAgICAgZWxzZSBpZiAodGFnID09PSA0KSB2YWx1ZSA9IC1wYmYucmVhZFZhcmludCgpO1xuICAgICAgICBlbHNlIGlmICh0YWcgPT09IDUpIHZhbHVlID0gcGJmLnJlYWRCb29sZWFuKCk7XG4gICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gNikgdmFsdWUgPSBKU09OLnBhcnNlKHBiZi5yZWFkU3RyaW5nKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIHJlYWRQcm9wcyhwYmYsIHByb3BzKSB7XG4gICAgdmFyIGVuZCA9IHBiZi5yZWFkVmFyaW50KCkgKyBwYmYucG9zO1xuICAgIHdoaWxlIChwYmYucG9zIDwgZW5kKSBwcm9wc1trZXlzW3BiZi5yZWFkVmFyaW50KCldXSA9IHZhbHVlc1twYmYucmVhZFZhcmludCgpXTtcbiAgICB2YWx1ZXMgPSBbXTtcbiAgICByZXR1cm4gcHJvcHM7XG59XG5cbmZ1bmN0aW9uIHJlYWRQb2ludChwYmYpIHtcbiAgICB2YXIgZW5kID0gcGJmLnJlYWRWYXJpbnQoKSArIHBiZi5wb3MsXG4gICAgICAgIGNvb3JkcyA9IFtdO1xuICAgIHdoaWxlIChwYmYucG9zIDwgZW5kKSBjb29yZHMucHVzaChwYmYucmVhZFNWYXJpbnQoKSAvIGUpO1xuICAgIHJldHVybiBjb29yZHM7XG59XG5cbmZ1bmN0aW9uIHJlYWRMaW5lUGFydChwYmYsIGVuZCwgbGVuLCBjbG9zZWQpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGNvb3JkcyA9IFtdLFxuICAgICAgICBwLCBkO1xuXG4gICAgdmFyIHByZXZQID0gW107XG4gICAgZm9yIChkID0gMDsgZCA8IGRpbTsgZCsrKSBwcmV2UFtkXSA9IDA7XG5cbiAgICB3aGlsZSAobGVuID8gaSA8IGxlbiA6IHBiZi5wb3MgPCBlbmQpIHtcbiAgICAgICAgcCA9IFtdO1xuICAgICAgICBmb3IgKGQgPSAwOyBkIDwgZGltOyBkKyspIHtcbiAgICAgICAgICAgIHByZXZQW2RdICs9IHBiZi5yZWFkU1ZhcmludCgpO1xuICAgICAgICAgICAgcFtkXSA9IHByZXZQW2RdIC8gZTtcbiAgICAgICAgfVxuICAgICAgICBjb29yZHMucHVzaChwKTtcbiAgICAgICAgaSsrO1xuICAgIH1cbiAgICBpZiAoY2xvc2VkKSBjb29yZHMucHVzaChjb29yZHNbMF0pO1xuXG4gICAgcmV0dXJuIGNvb3Jkcztcbn1cblxuZnVuY3Rpb24gcmVhZExpbmUocGJmKSB7XG4gICAgcmV0dXJuIHJlYWRMaW5lUGFydChwYmYsIHBiZi5yZWFkVmFyaW50KCkgKyBwYmYucG9zKTtcbn1cblxuZnVuY3Rpb24gcmVhZE11bHRpTGluZShwYmYsIGNsb3NlZCkge1xuICAgIHZhciBlbmQgPSBwYmYucmVhZFZhcmludCgpICsgcGJmLnBvcztcbiAgICBpZiAoIWxlbmd0aHMpIHJldHVybiBbcmVhZExpbmVQYXJ0KHBiZiwgZW5kLCBudWxsLCBjbG9zZWQpXTtcblxuICAgIHZhciBjb29yZHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aHMubGVuZ3RoOyBpKyspIGNvb3Jkcy5wdXNoKHJlYWRMaW5lUGFydChwYmYsIGVuZCwgbGVuZ3Roc1tpXSwgY2xvc2VkKSk7XG4gICAgbGVuZ3RocyA9IG51bGw7XG4gICAgcmV0dXJuIGNvb3Jkcztcbn1cblxuZnVuY3Rpb24gcmVhZE11bHRpUG9seWdvbihwYmYpIHtcbiAgICB2YXIgZW5kID0gcGJmLnJlYWRWYXJpbnQoKSArIHBiZi5wb3M7XG4gICAgaWYgKCFsZW5ndGhzKSByZXR1cm4gW1tyZWFkTGluZVBhcnQocGJmLCBlbmQsIG51bGwsIHRydWUpXV07XG5cbiAgICB2YXIgY29vcmRzID0gW107XG4gICAgdmFyIGogPSAxO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3Roc1swXTsgaSsrKSB7XG4gICAgICAgIHZhciByaW5ncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IGxlbmd0aHNbal07IGsrKykgcmluZ3MucHVzaChyZWFkTGluZVBhcnQocGJmLCBlbmQsIGxlbmd0aHNbaiArIDEgKyBrXSwgdHJ1ZSkpO1xuICAgICAgICBqICs9IGxlbmd0aHNbal0gKyAxO1xuICAgICAgICBjb29yZHMucHVzaChyaW5ncyk7XG4gICAgfVxuICAgIGxlbmd0aHMgPSBudWxsO1xuICAgIHJldHVybiBjb29yZHM7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZW5jb2RlO1xuXG52YXIga2V5cywga2V5c051bSwga2V5c0FyciwgZGltLCBlLFxuICAgIG1heFByZWNpc2lvbiA9IDFlNjtcblxudmFyIGdlb21ldHJ5VHlwZXMgPSB7XG4gICAgJ1BvaW50JzogMCxcbiAgICAnTXVsdGlQb2ludCc6IDEsXG4gICAgJ0xpbmVTdHJpbmcnOiAyLFxuICAgICdNdWx0aUxpbmVTdHJpbmcnOiAzLFxuICAgICdQb2x5Z29uJzogNCxcbiAgICAnTXVsdGlQb2x5Z29uJzogNSxcbiAgICAnR2VvbWV0cnlDb2xsZWN0aW9uJzogNlxufTtcblxuZnVuY3Rpb24gZW5jb2RlKG9iaiwgcGJmKSB7XG4gICAga2V5cyA9IHt9O1xuICAgIGtleXNBcnIgPSBbXTtcbiAgICBrZXlzTnVtID0gMDtcbiAgICBkaW0gPSAwO1xuICAgIGUgPSAxO1xuXG4gICAgYW5hbHl6ZShvYmopO1xuXG4gICAgZSA9IE1hdGgubWluKGUsIG1heFByZWNpc2lvbik7XG4gICAgdmFyIHByZWNpc2lvbiA9IE1hdGguY2VpbChNYXRoLmxvZyhlKSAvIE1hdGguTE4xMCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXNBcnIubGVuZ3RoOyBpKyspIHBiZi53cml0ZVN0cmluZ0ZpZWxkKDEsIGtleXNBcnJbaV0pO1xuICAgIGlmIChkaW0gIT09IDIpIHBiZi53cml0ZVZhcmludEZpZWxkKDIsIGRpbSk7XG4gICAgaWYgKHByZWNpc2lvbiAhPT0gNikgcGJmLndyaXRlVmFyaW50RmllbGQoMywgcHJlY2lzaW9uKTtcblxuICAgIGlmIChvYmoudHlwZSA9PT0gJ0ZlYXR1cmVDb2xsZWN0aW9uJykgcGJmLndyaXRlTWVzc2FnZSg0LCB3cml0ZUZlYXR1cmVDb2xsZWN0aW9uLCBvYmopO1xuICAgIGVsc2UgaWYgKG9iai50eXBlID09PSAnRmVhdHVyZScpIHBiZi53cml0ZU1lc3NhZ2UoNSwgd3JpdGVGZWF0dXJlLCBvYmopO1xuICAgIGVsc2UgcGJmLndyaXRlTWVzc2FnZSg2LCB3cml0ZUdlb21ldHJ5LCBvYmopO1xuXG4gICAga2V5cyA9IG51bGw7XG5cbiAgICByZXR1cm4gcGJmLmZpbmlzaCgpO1xufVxuXG5mdW5jdGlvbiBhbmFseXplKG9iaikge1xuICAgIHZhciBpLCBrZXk7XG5cbiAgICBpZiAob2JqLnR5cGUgPT09ICdGZWF0dXJlQ29sbGVjdGlvbicpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG9iai5mZWF0dXJlcy5sZW5ndGg7IGkrKykgYW5hbHl6ZShvYmouZmVhdHVyZXNbaV0pO1xuXG4gICAgfSBlbHNlIGlmIChvYmoudHlwZSA9PT0gJ0ZlYXR1cmUnKSB7XG4gICAgICAgIGlmIChvYmouZ2VvbWV0cnkgIT09IG51bGwpIGFuYWx5emUob2JqLmdlb21ldHJ5KTtcbiAgICAgICAgZm9yIChrZXkgaW4gb2JqLnByb3BlcnRpZXMpIHNhdmVLZXkoa2V5KTtcblxuICAgIH0gZWxzZSBpZiAob2JqLnR5cGUgPT09ICdQb2ludCcpIGFuYWx5emVQb2ludChvYmouY29vcmRpbmF0ZXMpO1xuICAgIGVsc2UgaWYgKG9iai50eXBlID09PSAnTXVsdGlQb2ludCcpIGFuYWx5emVQb2ludHMob2JqLmNvb3JkaW5hdGVzKTtcbiAgICBlbHNlIGlmIChvYmoudHlwZSA9PT0gJ0dlb21ldHJ5Q29sbGVjdGlvbicpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG9iai5nZW9tZXRyaWVzLmxlbmd0aDsgaSsrKSBhbmFseXplKG9iai5nZW9tZXRyaWVzW2ldKTtcbiAgICB9XG4gICAgZWxzZSBpZiAob2JqLnR5cGUgPT09ICdMaW5lU3RyaW5nJykgYW5hbHl6ZVBvaW50cyhvYmouY29vcmRpbmF0ZXMpO1xuICAgIGVsc2UgaWYgKG9iai50eXBlID09PSAnUG9seWdvbicgfHwgb2JqLnR5cGUgPT09ICdNdWx0aUxpbmVTdHJpbmcnKSBhbmFseXplTXVsdGlMaW5lKG9iai5jb29yZGluYXRlcyk7XG4gICAgZWxzZSBpZiAob2JqLnR5cGUgPT09ICdNdWx0aVBvbHlnb24nKSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBvYmouY29vcmRpbmF0ZXMubGVuZ3RoOyBpKyspIGFuYWx5emVNdWx0aUxpbmUob2JqLmNvb3JkaW5hdGVzW2ldKTtcbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKCFpc1NwZWNpYWxLZXkoa2V5LCBvYmoudHlwZSkpIHNhdmVLZXkoa2V5KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFuYWx5emVNdWx0aUxpbmUoY29vcmRzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKyspIGFuYWx5emVQb2ludHMoY29vcmRzW2ldKTtcbn1cblxuZnVuY3Rpb24gYW5hbHl6ZVBvaW50cyhjb29yZHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb3Jkcy5sZW5ndGg7IGkrKykgYW5hbHl6ZVBvaW50KGNvb3Jkc1tpXSk7XG59XG5cbmZ1bmN0aW9uIGFuYWx5emVQb2ludChwb2ludCkge1xuICAgIGRpbSA9IE1hdGgubWF4KGRpbSwgcG9pbnQubGVuZ3RoKTtcblxuICAgIC8vIGZpbmQgbWF4IHByZWNpc2lvblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgd2hpbGUgKE1hdGgucm91bmQocG9pbnRbaV0gKiBlKSAvIGUgIT09IHBvaW50W2ldICYmIGUgPCBtYXhQcmVjaXNpb24pIGUgKj0gMTA7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzYXZlS2V5KGtleSkge1xuICAgIGlmIChrZXlzW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBrZXlzQXJyLnB1c2goa2V5KTtcbiAgICAgICAga2V5c1trZXldID0ga2V5c051bSsrO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gd3JpdGVGZWF0dXJlQ29sbGVjdGlvbihvYmosIHBiZikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqLmZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHBiZi53cml0ZU1lc3NhZ2UoMSwgd3JpdGVGZWF0dXJlLCBvYmouZmVhdHVyZXNbaV0pO1xuICAgIH1cbiAgICB3cml0ZVByb3BzKG9iaiwgcGJmLCB0cnVlKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVGZWF0dXJlKGZlYXR1cmUsIHBiZikge1xuICAgIGlmIChmZWF0dXJlLmdlb21ldHJ5ICE9PSBudWxsKSBwYmYud3JpdGVNZXNzYWdlKDEsIHdyaXRlR2VvbWV0cnksIGZlYXR1cmUuZ2VvbWV0cnkpO1xuXG4gICAgaWYgKGZlYXR1cmUuaWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGZlYXR1cmUuaWQgPT09ICdudW1iZXInICYmIGZlYXR1cmUuaWQgJSAxID09PSAwKSBwYmYud3JpdGVTVmFyaW50RmllbGQoMTIsIGZlYXR1cmUuaWQpO1xuICAgICAgICBlbHNlIHBiZi53cml0ZVN0cmluZ0ZpZWxkKDExLCBmZWF0dXJlLmlkKTtcbiAgICB9XG5cbiAgICBpZiAoZmVhdHVyZS5wcm9wZXJ0aWVzKSB3cml0ZVByb3BzKGZlYXR1cmUucHJvcGVydGllcywgcGJmKTtcbiAgICB3cml0ZVByb3BzKGZlYXR1cmUsIHBiZiwgdHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlR2VvbWV0cnkoZ2VvbSwgcGJmKSB7XG4gICAgcGJmLndyaXRlVmFyaW50RmllbGQoMSwgZ2VvbWV0cnlUeXBlc1tnZW9tLnR5cGVdKTtcblxuICAgIHZhciBjb29yZHMgPSBnZW9tLmNvb3JkaW5hdGVzO1xuXG4gICAgaWYgKGdlb20udHlwZSA9PT0gJ1BvaW50Jykgd3JpdGVQb2ludChjb29yZHMsIHBiZik7XG4gICAgZWxzZSBpZiAoZ2VvbS50eXBlID09PSAnTXVsdGlQb2ludCcpIHdyaXRlTGluZShjb29yZHMsIHBiZiwgdHJ1ZSk7XG4gICAgZWxzZSBpZiAoZ2VvbS50eXBlID09PSAnTGluZVN0cmluZycpIHdyaXRlTGluZShjb29yZHMsIHBiZik7XG4gICAgZWxzZSBpZiAoZ2VvbS50eXBlID09PSAnTXVsdGlMaW5lU3RyaW5nJykgd3JpdGVNdWx0aUxpbmUoY29vcmRzLCBwYmYpO1xuICAgIGVsc2UgaWYgKGdlb20udHlwZSA9PT0gJ1BvbHlnb24nKSB3cml0ZU11bHRpTGluZShjb29yZHMsIHBiZiwgdHJ1ZSk7XG4gICAgZWxzZSBpZiAoZ2VvbS50eXBlID09PSAnTXVsdGlQb2x5Z29uJykgd3JpdGVNdWx0aVBvbHlnb24oY29vcmRzLCBwYmYpO1xuICAgIGVsc2UgaWYgKGdlb20udHlwZSA9PT0gJ0dlb21ldHJ5Q29sbGVjdGlvbicpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBnZW9tLmdlb21ldHJpZXMubGVuZ3RoOyBpKyspIHBiZi53cml0ZU1lc3NhZ2UoNCwgd3JpdGVHZW9tZXRyeSwgZ2VvbS5nZW9tZXRyaWVzW2ldKTtcbiAgICB9XG5cbiAgICB3cml0ZVByb3BzKGdlb20sIHBiZiwgdHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlUHJvcHMocHJvcHMsIHBiZiwgaXNDdXN0b20pIHtcbiAgICB2YXIgaW5kZXhlcyA9IFtdLFxuICAgICAgICB2YWx1ZUluZGV4ID0gMDtcblxuICAgIGZvciAodmFyIGtleSBpbiBwcm9wcykge1xuICAgICAgICBpZiAoaXNDdXN0b20gJiYgaXNTcGVjaWFsS2V5KGtleSwgcHJvcHMudHlwZSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHBiZi53cml0ZU1lc3NhZ2UoMTMsIHdyaXRlVmFsdWUsIHByb3BzW2tleV0pO1xuICAgICAgICBpbmRleGVzLnB1c2goa2V5c1trZXldKTtcbiAgICAgICAgaW5kZXhlcy5wdXNoKHZhbHVlSW5kZXgrKyk7XG4gICAgfVxuICAgIHBiZi53cml0ZVBhY2tlZFZhcmludChpc0N1c3RvbSA/IDE1IDogMTQsIGluZGV4ZXMpO1xufVxuXG5mdW5jdGlvbiB3cml0ZVZhbHVlKHZhbHVlLCBwYmYpIHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHJldHVybjtcblxuICAgIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuXG4gICAgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSBwYmYud3JpdGVTdHJpbmdGaWVsZCgxLCB2YWx1ZSk7XG4gICAgZWxzZSBpZiAodHlwZSA9PT0gJ2Jvb2xlYW4nKSBwYmYud3JpdGVCb29sZWFuRmllbGQoNSwgdmFsdWUpO1xuICAgIGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKSBwYmYud3JpdGVTdHJpbmdGaWVsZCg2LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xuICAgIGVsc2UgaWYgKHR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGlmICh2YWx1ZSAlIDEgIT09IDApIHBiZi53cml0ZURvdWJsZUZpZWxkKDIsIHZhbHVlKTtcbiAgICAgICAgZWxzZSBpZiAodmFsdWUgPj0gMCkgcGJmLndyaXRlVmFyaW50RmllbGQoMywgdmFsdWUpO1xuICAgICAgICBlbHNlIHBiZi53cml0ZVZhcmludEZpZWxkKDQsIC12YWx1ZSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB3cml0ZVBvaW50KHBvaW50LCBwYmYpIHtcbiAgICB2YXIgY29vcmRzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaW07IGkrKykgY29vcmRzLnB1c2goTWF0aC5yb3VuZChwb2ludFtpXSAqIGUpKTtcbiAgICBwYmYud3JpdGVQYWNrZWRTVmFyaW50KDMsIGNvb3Jkcyk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlTGluZShsaW5lLCBwYmYpIHtcbiAgICB2YXIgY29vcmRzID0gW107XG4gICAgcG9wdWxhdGVMaW5lKGNvb3JkcywgbGluZSk7XG4gICAgcGJmLndyaXRlUGFja2VkU1ZhcmludCgzLCBjb29yZHMpO1xufVxuXG5mdW5jdGlvbiB3cml0ZU11bHRpTGluZShsaW5lcywgcGJmLCBjbG9zZWQpIHtcbiAgICB2YXIgbGVuID0gbGluZXMubGVuZ3RoLFxuICAgICAgICBpO1xuICAgIGlmIChsZW4gIT09IDEpIHtcbiAgICAgICAgdmFyIGxlbmd0aHMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSBsZW5ndGhzLnB1c2gobGluZXNbaV0ubGVuZ3RoIC0gKGNsb3NlZCA/IDEgOiAwKSk7XG4gICAgICAgIHBiZi53cml0ZVBhY2tlZFZhcmludCgyLCBsZW5ndGhzKTtcbiAgICAgICAgLy8gVE9ETyBmYXN0ZXIgd2l0aCBjdXN0b20gd3JpdGVNZXNzYWdlP1xuICAgIH1cbiAgICB2YXIgY29vcmRzID0gW107XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSBwb3B1bGF0ZUxpbmUoY29vcmRzLCBsaW5lc1tpXSwgY2xvc2VkKTtcbiAgICBwYmYud3JpdGVQYWNrZWRTVmFyaW50KDMsIGNvb3Jkcyk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlTXVsdGlQb2x5Z29uKHBvbHlnb25zLCBwYmYpIHtcbiAgICB2YXIgbGVuID0gcG9seWdvbnMubGVuZ3RoLFxuICAgICAgICBpLCBqO1xuICAgIGlmIChsZW4gIT09IDEgfHwgcG9seWdvbnNbMF0ubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgIHZhciBsZW5ndGhzID0gW2xlbl07XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGVuZ3Rocy5wdXNoKHBvbHlnb25zW2ldLmxlbmd0aCk7XG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgcG9seWdvbnNbaV0ubGVuZ3RoOyBqKyspIGxlbmd0aHMucHVzaChwb2x5Z29uc1tpXVtqXS5sZW5ndGggLSAxKTtcbiAgICAgICAgfVxuICAgICAgICBwYmYud3JpdGVQYWNrZWRWYXJpbnQoMiwgbGVuZ3Rocyk7XG4gICAgfVxuXG4gICAgdmFyIGNvb3JkcyA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgcG9seWdvbnNbaV0ubGVuZ3RoOyBqKyspIHBvcHVsYXRlTGluZShjb29yZHMsIHBvbHlnb25zW2ldW2pdLCB0cnVlKTtcbiAgICB9XG4gICAgcGJmLndyaXRlUGFja2VkU1ZhcmludCgzLCBjb29yZHMpO1xufVxuXG5mdW5jdGlvbiBwb3B1bGF0ZUxpbmUoY29vcmRzLCBsaW5lLCBjbG9zZWQpIHtcbiAgICB2YXIgaSwgaixcbiAgICAgICAgbGVuID0gbGluZS5sZW5ndGggLSAoY2xvc2VkID8gMSA6IDApLFxuICAgICAgICBzdW0gPSBuZXcgQXJyYXkoZGltKTtcbiAgICBmb3IgKGogPSAwOyBqIDwgZGltOyBqKyspIHN1bVtqXSA9IDA7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBkaW07IGorKykge1xuICAgICAgICAgICAgdmFyIG4gPSBNYXRoLnJvdW5kKGxpbmVbaV1bal0gKiBlKSAtIHN1bVtqXTtcbiAgICAgICAgICAgIGNvb3Jkcy5wdXNoKG4pO1xuICAgICAgICAgICAgc3VtW2pdICs9IG47XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzU3BlY2lhbEtleShrZXksIHR5cGUpIHtcbiAgICBpZiAoa2V5ID09PSAndHlwZScpIHJldHVybiB0cnVlO1xuICAgIGVsc2UgaWYgKHR5cGUgPT09ICdGZWF0dXJlQ29sbGVjdGlvbicpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ2ZlYXR1cmVzJykgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnRmVhdHVyZScpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ2lkJyB8fCBrZXkgPT09ICdwcm9wZXJ0aWVzJyB8fCBrZXkgPT09ICdnZW9tZXRyeScpIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ0dlb21ldHJ5Q29sbGVjdGlvbicpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ2dlb21ldHJpZXMnKSByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2Nvb3JkaW5hdGVzJykgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLmVuY29kZSA9IHJlcXVpcmUoJy4vZW5jb2RlJyk7XG5leHBvcnRzLmRlY29kZSA9IHJlcXVpcmUoJy4vZGVjb2RlJyk7XG4iXX0=
