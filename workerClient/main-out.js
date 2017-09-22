/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 19);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = isWidget;

function isWidget(w) {
    return w && w.type === "Widget";
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = "2";

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(1);

module.exports = isVirtualNode;

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version;
}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = isThunk;

function isThunk(t) {
    return t && t.type === "Thunk";
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = isHook;

function isHook(hook) {
  return hook && (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") || typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"));
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(1);

module.exports = isVirtualText;

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version;
}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

var nativeIsArray = Array.isArray;
var toString = Object.prototype.toString;

module.exports = nativeIsArray || isArray;

function isArray(obj) {
    return toString.call(obj) === "[object Array]";
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(1);

VirtualPatch.NONE = 0;
VirtualPatch.VTEXT = 1;
VirtualPatch.VNODE = 2;
VirtualPatch.WIDGET = 3;
VirtualPatch.PROPS = 4;
VirtualPatch.ORDER = 5;
VirtualPatch.INSERT = 6;
VirtualPatch.REMOVE = 7;
VirtualPatch.THUNK = 8;

module.exports = VirtualPatch;

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type);
    this.vNode = vNode;
    this.patch = patch;
}

VirtualPatch.prototype.version = version;
VirtualPatch.prototype.type = "VirtualPatch";

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(1);
var isVNode = __webpack_require__(2);
var isWidget = __webpack_require__(0);
var isThunk = __webpack_require__(3);
var isVHook = __webpack_require__(4);

module.exports = VirtualNode;

var noProperties = {};
var noChildren = [];

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName;
    this.properties = properties || noProperties;
    this.children = children || noChildren;
    this.key = key != null ? String(key) : undefined;
    this.namespace = typeof namespace === "string" ? namespace : null;

    var count = children && children.length || 0;
    var descendants = 0;
    var hasWidgets = false;
    var hasThunks = false;
    var descendantHooks = false;
    var hooks;

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName];
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {};
                }

                hooks[propName] = property;
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i];
        if (isVNode(child)) {
            descendants += child.count || 0;

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true;
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true;
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true;
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true;
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants;
    this.hasWidgets = hasWidgets;
    this.hasThunks = hasThunks;
    this.hooks = hooks;
    this.descendantHooks = descendantHooks;
}

VirtualNode.prototype.version = version;
VirtualNode.prototype.type = "VirtualNode";

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(1);

module.exports = VirtualText;

function VirtualText(text) {
    this.text = String(text);
}

VirtualText.prototype.version = version;
VirtualText.prototype.type = "VirtualText";

/***/ }),
/* 11 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var isVNode = __webpack_require__(2);
var isVText = __webpack_require__(5);
var isWidget = __webpack_require__(0);
var isThunk = __webpack_require__(3);

module.exports = handleThunk;

function handleThunk(a, b) {
    var renderedA = a;
    var renderedB = b;

    if (isThunk(b)) {
        renderedB = renderThunk(b, a);
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null);
    }

    return {
        a: renderedA,
        b: renderedB
    };
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode;

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous);
    }

    if (!(isVNode(renderedThunk) || isVText(renderedThunk) || isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk;
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var topLevel = typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : {};
var minDoc = __webpack_require__(33);

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(14);

var applyProperties = __webpack_require__(16);

var isVNode = __webpack_require__(2);
var isVText = __webpack_require__(5);
var isWidget = __webpack_require__(0);
var handleThunk = __webpack_require__(12);

module.exports = createElement;

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document;
    var warn = opts ? opts.warn : null;

    vnode = handleThunk(vnode).a;

    if (isWidget(vnode)) {
        return vnode.init();
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text);
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode);
        }
        return null;
    }

    var node = vnode.namespace === null ? doc.createElement(vnode.tagName) : doc.createElementNS(vnode.namespace, vnode.tagName);

    var props = vnode.properties;
    applyProperties(node, props);

    var children = vnode.children;

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts);
        if (childNode) {
            node.appendChild(childNode);
        }
    }

    return node;
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13);
var isHook = __webpack_require__(4);

module.exports = applyProperties;

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName];

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous);
            if (propValue.hook) {
                propValue.hook(node, propName, previous ? previous[propName] : undefined);
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue;
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName];

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName);
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = "";
                }
            } else if (typeof previousValue === "string") {
                node[propName] = "";
            } else {
                node[propName] = null;
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue);
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined;

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName];

            if (attrValue === undefined) {
                node.removeAttribute(attrName);
            } else {
                node.setAttribute(attrName, attrValue);
            }
        }

        return;
    }

    if (previousValue && isObject(previousValue) && getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue;
        return;
    }

    if (!isObject(node[propName])) {
        node[propName] = {};
    }

    var replacer = propName === "style" ? "" : undefined;

    for (var k in propValue) {
        var value = propValue[k];
        node[propName][k] = value === undefined ? replacer : value;
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value);
    } else if (value.__proto__) {
        return value.__proto__;
    } else if (value.constructor) {
        return value.constructor.prototype;
    }
}

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = {
  VirtualTree: 1,
  VirtualPatch: 2,
  VirtualNode: 3,
  SoftSetHook: 4
};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

//Magic value to map keys with a value of undefined to in JSON form since JSON
//won't preserve those.  This is necessary because in patches, the removal of 
//a property is represented by the property name mapped to undefined
module.exports = "____UnDeFiNeD____";

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

/** @jsx h */
const h = __webpack_require__(20);
const patch = __webpack_require__(31);
const createElement = __webpack_require__(37);

const fromJson = __webpack_require__(38).fromJson;
const applyPatch = __webpack_require__(49);

const worker = new Worker('worker-out.js');

const elems = new Map();

worker.onmessage = function (e) {
  if (e.data.create !== undefined) {
    console.log("creating " + e.data.create);
    let elem = createElement(fromJson(e.data));
    if (elems.has(e.data.create)) {
      elems.get(e.data.create).appendChild(elem);
    } else {
      document.getElementById(e.data.create).appendChild(elem);
    }
    elems.set(e.data.id, elem);
  } else if (e.data.update !== undefined) {
    console.log("updating");
    applyPatch(elems.get(e.data.id), e.data);
  } else if (e.data.remove !== undefined) {
    console.log("removing");
    try {
      let node = elems.get(e.data.remove);
      node.parentNode.removeChild(node);
      node.remove();
    } catch (e) {}
  }
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var h = __webpack_require__(21);

module.exports = h;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArray = __webpack_require__(6);

var VNode = __webpack_require__(9);
var VText = __webpack_require__(10);
var isVNode = __webpack_require__(2);
var isVText = __webpack_require__(5);
var isWidget = __webpack_require__(0);
var isHook = __webpack_require__(4);
var isVThunk = __webpack_require__(3);

var parseTag = __webpack_require__(22);
var softSetHook = __webpack_require__(7);
var evHook = __webpack_require__(24);

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' && !namespace && props.hasOwnProperty('value') && props.value !== undefined && !isHook(props.value)) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }

    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' + 'Expected a VNode / Vthunk / VWidget / string but:\n' + 'got:\n' + errorString(data.foreignObject) + '.\n' + 'The parent vnode is:\n' + errorString(data.parentVnode);
    '\n' + 'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var split = __webpack_require__(23);

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !props.hasOwnProperty('id');

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

/***/ }),
/* 23 */
/***/ (function(module, exports) {

/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = function split(undef) {

  var nativeSplit = String.prototype.split,
      compliantExecNpcg = /()??/.exec("")[1] === undef,

  // NPCG: nonparticipating capturing group
  self;

  self = function (str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
        flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + ( // Proposed for ES6
    separator.sticky ? "y" : ""),

    // Firefox 3+
    lastLastIndex = 0,

    // Make `global` and avoid `lastIndex` issues by working with a copy
    separator = new RegExp(separator.source, flags + "g"),
        separator2,
        match,
        lastIndex,
        lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function () {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
}();

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var EvStore = __webpack_require__(25);

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var OneVersionConstraint = __webpack_require__(26);

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Individual = __webpack_require__(27);

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' + moduleName + '.\n' + 'You already have version ' + versionValue + ' installed.\n' + 'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

/*global window, global*/

var root = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var patch = __webpack_require__(32);

module.exports = patch;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(14);
var isArray = __webpack_require__(6);

var render = __webpack_require__(15);
var domIndex = __webpack_require__(34);
var patchOp = __webpack_require__(35);
module.exports = patch;

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {};
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch ? renderOptions.patch : patchRecursive;
    renderOptions.render = renderOptions.render || render;

    return renderOptions.patch(rootNode, patches, renderOptions);
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches);

    if (indices.length === 0) {
        return rootNode;
    }

    var index = domIndex(rootNode, patches.a, indices);
    var ownerDocument = rootNode.ownerDocument;

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument;
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i];
        rootNode = applyPatch(rootNode, index[nodeIndex], patches[nodeIndex], renderOptions);
    }

    return rootNode;
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode;
    }

    var newNode;

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions);

            if (domNode === rootNode) {
                rootNode = newNode;
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions);

        if (domNode === rootNode) {
            rootNode = newNode;
        }
    }

    return rootNode;
}

function patchIndices(patches) {
    var indices = [];

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key));
        }
    }

    return indices;
}

/***/ }),
/* 33 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 34 */
/***/ (function(module, exports) {

// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {};

module.exports = domIndex;

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {};
    } else {
        indices.sort(ascending);
        return recurse(rootNode, tree, indices, nodes, 0);
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {};

    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode;
        }

        var vChildren = tree.children;

        if (vChildren) {

            var childNodes = rootNode.childNodes;

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1;

                var vChild = vChildren[i] || noChild;
                var nextIndex = rootIndex + (vChild.count || 0);

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex);
                }

                rootIndex = nextIndex;
            }
        }
    }

    return nodes;
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false;
    }

    var minIndex = 0;
    var maxIndex = indices.length - 1;
    var currentIndex;
    var currentItem;

    while (minIndex <= maxIndex) {
        currentIndex = (maxIndex + minIndex) / 2 >> 0;
        currentItem = indices[currentIndex];

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right;
        } else if (currentItem < left) {
            minIndex = currentIndex + 1;
        } else if (currentItem > right) {
            maxIndex = currentIndex - 1;
        } else {
            return true;
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1;
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var applyProperties = __webpack_require__(16);

var isWidget = __webpack_require__(0);
var VPatch = __webpack_require__(8);

var updateWidget = __webpack_require__(36);

module.exports = applyPatch;

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type;
    var vNode = vpatch.vNode;
    var patch = vpatch.patch;

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode);
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions);
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions);
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions);
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions);
        case VPatch.ORDER:
            reorderChildren(domNode, patch);
            return domNode;
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties);
            return domNode;
        case VPatch.THUNK:
            return replaceRoot(domNode, renderOptions.patch(domNode, patch, renderOptions));
        default:
            return domNode;
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode;

    if (parentNode) {
        parentNode.removeChild(domNode);
    }

    destroyWidget(domNode, vNode);

    return null;
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions);

    if (parentNode) {
        parentNode.appendChild(newNode);
    }

    return parentNode;
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode;

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text);
        newNode = domNode;
    } else {
        var parentNode = domNode.parentNode;
        newNode = renderOptions.render(vText, renderOptions);

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode);
        }
    }

    return newNode;
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget);
    var newNode;

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode;
    } else {
        newNode = renderOptions.render(widget, renderOptions);
    }

    var parentNode = domNode.parentNode;

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode);
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode);
    }

    return newNode;
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode;
    var newNode = renderOptions.render(vNode, renderOptions);

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode);
    }

    return newNode;
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode);
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes;
    var keyMap = {};
    var node;
    var remove;
    var insert;

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i];
        node = childNodes[remove.from];
        if (remove.key) {
            keyMap[remove.key] = node;
        }
        domNode.removeChild(node);
    }

    var length = childNodes.length;
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j];
        node = keyMap[insert.key];
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to]);
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot);
    }

    return newRoot;
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var isWidget = __webpack_require__(0);

module.exports = updateWidget;

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id;
        } else {
            return a.init === b.init;
        }
    }

    return false;
}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var createElement = __webpack_require__(15);

module.exports = createElement;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  fromJson: __webpack_require__(39),
  toJson: __webpack_require__(40)
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var types = __webpack_require__(17);
var undefinedConst = __webpack_require__(18);
var VirtualNode = __webpack_require__(9);
var VirtualText = __webpack_require__(10);
var VirtualPatch = __webpack_require__(8);
var SoftSetHook = __webpack_require__(7);

function arrayFromJson(json, ctx) {
  var len = json.length;
  var i = -1;
  var res = new Array(len);
  while (++i < len) {
    res[i] = fromJson(json[i], ctx);
  }
  return res;
}

function plainObjectFromJson(json, ctx) {
  var res = {};
  /* jshint -W089 */
  /* this is fine; these objects are always plain */
  for (var key in json) {
    var val = json[key];
    if (val === undefinedConst) {
      val = undefined;
    }
    res[key] = typeof val !== 'undefined' ? fromJson(val, ctx) : val;
  }
  return res;
}

function virtualNodeFromJson(json, ctx) {
  return new VirtualNode(json.tn, json.p ? plainObjectFromJson(json.p, ctx) : {}, // patch
  json.c ? arrayFromJson(json.c, ctx) : [], // children
  json.k, // key
  json.n); // namespace
}

function virtualTextFromJson(json, ctx) {
  return new VirtualText(json.x);
}

function virtualPatchFromJson(json, ctx) {
  var vNode = null;
  if (typeof json.v === 'string' && json.v.indexOf('i:') === 0) {
    var idx = parseInt(json.v.substr(2));
    vNode = ctx.dftIndexArray[idx]; //look up this index from the dft index
  } else {
    vNode = json.v ? fromJson(json.v, ctx) : null; // virtualNode;
  }

  return new VirtualPatch(json.pt, // patchType
  vNode, json.p && fromJson(json.p, ctx) // patch
  );
}

function softSetHookFromJson(json, ctx) {
  return new SoftSetHook(json.value);
}

function objectFromJson(json, ctx) {
  switch (json.t) {// type
    case types.VirtualPatch:
      return virtualPatchFromJson(json, ctx);
    case types.VirtualNode:
      return virtualNodeFromJson(json, ctx);
    case types.VirtualTree:
      return virtualTextFromJson(json, ctx);
    case types.SoftSetHook:
      return softSetHookFromJson(json, ctx);
  }
  return plainObjectFromJson(json, ctx);
}

function fromJson(json, ctx) {
  var type = typeof json;

  switch (type) {
    case 'string':
    case 'boolean':
    case 'number':
      return json;
  }

  // type === 'object'

  if (Array.isArray(json)) {
    return arrayFromJson(json, ctx);
  }

  if (!json) {
    // null
    return null;
  }

  if (json && json['a'] && json['a'].tn && ctx == null) {
    ctx = { diffRoot: virtualNodeFromJson(json['a']) };
    ctx.dftIndexArray = indexRoot(ctx.diffRoot);
  }

  return objectFromJson(json, ctx);
}

function indexRoot(root) {
  var idxArray = [];
  indexNode(idxArray, root, 0);
  return idxArray;
}

function indexNode(idxArray, node, idx) {
  idxArray[idx] = node;
  if (node.children) {
    node.children.forEach(function (childNode) {
      idx = indexNode(idxArray, childNode, ++idx);
    });
  }
  return idx;
}

module.exports = fromJson;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var types = __webpack_require__(17);
var undefinedConst = __webpack_require__(18);

var SoftSetHook = __webpack_require__(7);

function arrayToJson(arr, ctx) {
  var len = arr.length;
  var i = -1;
  var res = new Array(len);
  while (++i < len) {
    res[i] = toJson(arr[i], ctx);
  }
  return res;
}

function plainObjectToJson(obj, ctx) {
  var res = {};
  var trackPatchIndex = false;
  var childCtx = ctx;
  if (obj && obj['a'] && obj['a'].tagName) {
    childCtx = cloneObj({}, ctx); //clone ctx
    trackPatchIndex = true;
  }
  //childCtx['patchHashIndex'] = null;

  /* jshint -W089 */
  /* this is fine; these objects are always plain */
  for (var key in obj) {
    var val = obj[key];
    if (trackPatchIndex) {
      childCtx['patchHashIndex'] = parseInt(key);
    }
    res[key] = typeof val !== 'undefined' ? toJson(val, childCtx) : undefinedConst;
  }
  return res;
}

function virtualNodeToJson(obj, ctx) {
  var res = {
    // type
    t: types.VirtualNode,
    tn: obj.tagName
  };
  if (Object.keys(obj.properties).length) {
    res.p = plainObjectToJson(obj.properties, ctx);
  }
  if (obj.children.length) {
    res.c = arrayToJson(obj.children, ctx);
  }
  if (obj.key) {
    res.k = obj.key;
  }
  if (obj.namespace) {
    res.n = obj.namespace;
  }
  return res;
}

function virtualTextToJson(obj, ctx) {
  return {
    // type
    t: types.VirtualTree,
    // text
    x: obj.text
  };
}

function virtualPatchToJson(obj, ctx) {
  var res = {
    // type
    t: types.VirtualPatch,
    // patch type
    pt: obj.type
  };

  if (obj.vNode) {
    if (ctx && ctx.patchHashIndex != null) {
      //if the context contains the index (from the key in the hash) for this
      //patch, use it as a string key for this value so we can just reference
      //that point in the root tree instead of serializing same content over
      //again
      res.v = "i:" + ctx.patchHashIndex;
    } else {
      res.v = toJson(obj.vNode, ctx);
    }
  }

  if (obj.patch) {
    res.p = toJson(obj.patch, ctx);
  }

  return res;
}

function softSetHookToJson(obj, ctx) {
  return {
    // type
    t: types.SoftSetHook,
    value: obj.value
  };
}

function objectToJson(obj, ctx) {
  if ('patch' in obj && typeof obj.type === 'number') {
    return virtualPatchToJson(obj, ctx);
  }
  if (obj.type === 'VirtualNode') {
    return virtualNodeToJson(obj, ctx);
  }
  if (obj.type === 'VirtualText') {
    return virtualTextToJson(obj, ctx);
  }
  if (obj instanceof SoftSetHook) {
    return softSetHookToJson(obj, ctx);
  }

  // plain object
  return plainObjectToJson(obj, ctx);
}

function toJson(obj, ctx) {

  var type = typeof obj;

  switch (type) {
    case 'string':
    case 'boolean':
    case 'number':
      return obj;
  }

  // type === 'object'
  if (Array.isArray(obj)) {
    return arrayToJson(obj, ctx || {});
  }

  if (!obj) {
    // null
    return null;
  }

  //If we enter with a null context and we've got an object with an 'a'
  //property with an object with tag name then it's likely we have a
  //patchset object and the a is the original root of the diff tree
  if (obj && obj['a'] && obj['a'].tagName && !ctx) {
    ctx = { diffRoot: obj['a'] };
  } else if (ctx == null) {
    ctx = {};
  }

  return objectToJson(obj, ctx);
}

//PhantomJS doesn't support Object.assigns, so just implement a clone
//method here.
function cloneObj(a, b) {
  Object.keys(b).forEach(function (k) {
    a[k] = b[k];
  });
  return a;
}

module.exports = toJson;

/***/ }),
/* 41 */,
/* 42 */,
/* 43 */
/***/ (function(module, exports) {

// original this was is-vpatch.js

module.exports = {
  NONE: 0,
  VTEXT: 1,
  VNODE: 2,
  WIDGET: 3,
  PROPS: 4,
  ORDER: 5,
  INSERT: 6,
  REMOVE: 7,
  THUNK: 8
};

/***/ }),
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(54);
var isSoftSetHook = __webpack_require__(55);

module.exports = applyProperties;

function applyProperties(node, props, previous) {
  for (var propName in props) {
    var propValue = props[propName];

    if (propValue === undefined) {
      removeProperty(node, propName, previous);
    } else if (isSoftSetHook(propValue)) {
      removeProperty(node, propName, propValue, previous);
      node[propName] = propValue.value;
    } else {
      if (isObject(propValue)) {
        patchObject(node, props, previous, propName, propValue);
      } else {
        node[propName] = propValue;
      }
    }
  }
}

function removeProperty(node, propName, previous) {
  if (!previous) {
    return;
  }
  var previousValue = previous[propName];

  if (propName === "attributes") {
    for (var attrName in previousValue) {
      node.removeAttribute(attrName);
    }
  } else if (propName === "style") {
    for (var i in previousValue) {
      node.style[i] = "";
    }
  } else if (typeof previousValue === "string") {
    node[propName] = "";
  } else {
    node[propName] = null;
  }
}

function patchObject(node, props, previous, propName, propValue) {
  var previousValue = previous ? previous[propName] : undefined;

  // Set attributes
  if (propName === "attributes") {
    for (var attrName in propValue) {
      var attrValue = propValue[attrName];

      if (attrValue === undefined) {
        node.removeAttribute(attrName);
      } else {
        node.setAttribute(attrName, attrValue);
      }
    }

    return;
  }

  if (previousValue && isObject(previousValue) && getPrototype(previousValue) !== getPrototype(propValue)) {
    node[propName] = propValue;
    return;
  }

  if (!isObject(node[propName])) {
    node[propName] = {};
  }

  var replacer = propName === "style" ? "" : undefined;

  for (var k in propValue) {
    var value = propValue[k];
    node[propName][k] = value === undefined ? replacer : value;
  }
}

function getPrototype(value) {
  // getPrototypeOf shim for older browsers
  /* istanbul ignore else */
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value);
  } else {
    return value.__proto__ || value.constructor.prototype;
  }
}

/***/ }),
/* 48 */
/***/ (function(module, exports) {

// copied from vdom-as-json/types.js

module.exports = {
  VirtualTree: 1,
  VirtualPatch: 2,
  VirtualNode: 3,
  SoftSetHook: 4
};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(50);

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var patchRecursive = __webpack_require__(51);

function patch(rootNode, patches) {
  return patchRecursive(rootNode, patches);
}

module.exports = patch;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var domIndex = __webpack_require__(52);
var patchOp = __webpack_require__(53);

function patchRecursive(rootNode, patches) {
  var indices = patchIndices(patches);

  if (indices.length === 0) {
    return rootNode;
  }

  var index = domIndex(rootNode, patches.a, indices);

  for (var i = 0; i < indices.length; i++) {
    var nodeIndex = indices[i];
    rootNode = applyPatch(rootNode, index[nodeIndex], patches[nodeIndex]);
  }

  return rootNode;
}

function applyPatch(rootNode, domNode, patchList) {
  if (!domNode) {
    return rootNode;
  }

  var newNode;

  for (var i = 0; i < patchList.length; i++) {
    newNode = patchOp(patchList[i], domNode, patchRecursive);

    if (domNode === rootNode) {
      rootNode = newNode;
    }
  }

  return rootNode;
}

function patchIndices(patches) {
  var indices = [];

  for (var key in patches) {
    if (key !== "a") {
      indices.push(Number(key));
    }
  }

  return indices;
}

module.exports = patchRecursive;

/***/ }),
/* 52 */
/***/ (function(module, exports) {

// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {};

module.exports = domIndex;

function domIndex(rootNode, tree, indices, nodes) {
  if (!indices || indices.length === 0) {
    return {};
  } else {
    indices.sort(ascending);
    return recurse(rootNode, tree, indices, nodes, 0);
  }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
  nodes = nodes || {};

  if (rootNode) {
    if (indexInRange(indices, rootIndex, rootIndex)) {
      nodes[rootIndex] = rootNode;
    }

    var treeChildren = tree[0];

    if (treeChildren) {

      var childNodes = rootNode.childNodes;

      for (var i = 0; i < treeChildren.length; i++) {
        rootIndex += 1;

        var vChild = treeChildren[i] || noChild;
        var nextIndex = rootIndex + (vChild[1] || 0);

        // skip recursion down the tree if there are no nodes down here
        if (indexInRange(indices, rootIndex, nextIndex)) {
          recurse(childNodes[i], vChild, indices, nodes, rootIndex);
        }

        rootIndex = nextIndex;
      }
    }
  }

  return nodes;
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
  if (indices.length === 0) {
    return false;
  }

  var minIndex = 0;
  var maxIndex = indices.length - 1;
  var currentIndex;
  var currentItem;

  while (minIndex <= maxIndex) {
    currentIndex = (maxIndex + minIndex) / 2 >> 0;
    currentItem = indices[currentIndex];

    if (minIndex === maxIndex) {
      return currentItem >= left && currentItem <= right;
    } else if (currentItem < left) {
      minIndex = currentIndex + 1;
    } else if (currentItem > right) {
      maxIndex = currentIndex - 1;
    } else {
      return true;
    }
  }

  return false;
}

function ascending(a, b) {
  return a > b ? 1 : -1;
}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var applyProperties = __webpack_require__(47);
var patchTypes = __webpack_require__(43);
var render = __webpack_require__(56);

module.exports = applyPatch;

function applyPatch(vpatch, domNode, patchRecursive) {
  var type = vpatch[0];
  var patch = vpatch[1];
  var vNode = vpatch[2];

  switch (type) {
    case patchTypes.REMOVE:
      return removeNode(domNode);
    case patchTypes.INSERT:
      return insertNode(domNode, patch);
    case patchTypes.VTEXT:
      return stringPatch(domNode, patch);
    case patchTypes.VNODE:
      return vNodePatch(domNode, patch);
    case patchTypes.ORDER:
      reorderChildren(domNode, patch);
      return domNode;
    case patchTypes.PROPS:
      applyProperties(domNode, patch, vNode.p); // 'p' === 'properties'
      return domNode;
    case patchTypes.THUNK:
      return replaceRoot(domNode, patchRecursive(domNode, patch));
    default:
      return domNode;
  }
}

function removeNode(domNode) {
  var parentNode = domNode.parentNode;

  if (parentNode) {
    parentNode.removeChild(domNode);
  }

  return null;
}

function insertNode(parentNode, vNode) {
  var newNode = render(vNode);

  if (parentNode) {
    parentNode.appendChild(newNode);
  }

  return parentNode;
}

function stringPatch(domNode, vText) {
  var newNode;

  if (domNode.nodeType === 3) {
    domNode.replaceData(0, domNode.length, vText.x); // 'x' means 'text'
    newNode = domNode;
  } else {
    var parentNode = domNode.parentNode;
    newNode = render(vText);

    if (parentNode && newNode !== domNode) {
      parentNode.replaceChild(newNode, domNode);
    }
  }

  return newNode;
}

function vNodePatch(domNode, vNode) {
  var parentNode = domNode.parentNode;
  var newNode = render(vNode);

  if (parentNode && newNode !== domNode) {
    parentNode.replaceChild(newNode, domNode);
  }

  return newNode;
}

function reorderChildren(domNode, moves) {
  var childNodes = domNode.childNodes;
  var keyMap = {};
  var node;
  var remove;
  var insert;

  for (var i = 0; i < moves.removes.length; i++) {
    remove = moves.removes[i];
    node = childNodes[remove.from];
    if (remove.key) {
      keyMap[remove.key] = node;
    }
    domNode.removeChild(node);
  }

  var length = childNodes.length;
  for (var j = 0; j < moves.inserts.length; j++) {
    insert = moves.inserts[j];
    node = keyMap[insert.key];
    // this is the weirdest bug i've ever seen in webkit
    domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to]);
  }
}

function replaceRoot(oldRoot, newRoot) {
  if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
    oldRoot.parentNode.replaceChild(newRoot, oldRoot);
  }

  return newRoot;
}

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isObject(x) {
  return typeof x === "object" && x !== null;
};

/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = isSoftSetHook;

function isSoftSetHook(x) {
  return x && typeof x === 'object' && typeof x.value !== 'undefined';
}

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var applyProperties = __webpack_require__(47);
var isVText = __webpack_require__(57);
var isVNode = __webpack_require__(58);

module.exports = createElement;

function createElement(vnode) {
  var doc = document;

  if (isVText(vnode)) {
    return doc.createTextNode(vnode.x); // 'x' means 'text'
  } else if (!isVNode(vnode)) {
    return null;
  }

  var node = !vnode.n ? // 'n' === 'namespace'
  doc.createElement(vnode.tn) : // 'tn' === 'tagName'
  doc.createElementNS(vnode.n, vnode.tn);

  var props = vnode.p; // 'p' === 'properties'
  applyProperties(node, props);

  var children = vnode.c; // 'c' === 'children'

  if (children) {
    for (var i = 0; i < children.length; i++) {
      var childNode = createElement(children[i]);
      if (childNode) {
        node.appendChild(childNode);
      }
    }
  }

  return node;
}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = isVirtualText;

var types = __webpack_require__(48);

function isVirtualText(x) {
  return x && x.t === types.VirtualTree;
}

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = isVirtualNode;

var types = __webpack_require__(48);

function isVirtualNode(x) {
  return x && x.t === types.VirtualNode;
}

/***/ })
/******/ ]);