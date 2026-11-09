var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod2) => function __require() {
  try {
    return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
  } catch (e) {
    throw mod2 = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));

// node_modules/jsqr/dist/jsQR.js
var require_jsQR = __commonJS({
  "node_modules/jsqr/dist/jsQR.js"(exports, module) {
    (function webpackUniversalModuleDefinition(root, factory) {
      if (typeof exports === "object" && typeof module === "object")
        module.exports = factory();
      else if (typeof define === "function" && define.amd)
        define([], factory);
      else if (typeof exports === "object")
        exports["jsQR"] = factory();
      else
        root["jsQR"] = factory();
    })(typeof self !== "undefined" ? self : exports, function() {
      return (
        /******/
        (function(modules) {
          var installedModules = {};
          function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) {
              return installedModules[moduleId].exports;
            }
            var module2 = installedModules[moduleId] = {
              /******/
              i: moduleId,
              /******/
              l: false,
              /******/
              exports: {}
              /******/
            };
            modules[moduleId].call(module2.exports, module2, module2.exports, __webpack_require__);
            module2.l = true;
            return module2.exports;
          }
          __webpack_require__.m = modules;
          __webpack_require__.c = installedModules;
          __webpack_require__.d = function(exports2, name, getter) {
            if (!__webpack_require__.o(exports2, name)) {
              Object.defineProperty(exports2, name, {
                /******/
                configurable: false,
                /******/
                enumerable: true,
                /******/
                get: getter
                /******/
              });
            }
          };
          __webpack_require__.n = function(module2) {
            var getter = module2 && module2.__esModule ? (
              /******/
              function getDefault() {
                return module2["default"];
              }
            ) : (
              /******/
              function getModuleExports() {
                return module2;
              }
            );
            __webpack_require__.d(getter, "a", getter);
            return getter;
          };
          __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
          };
          __webpack_require__.p = "";
          return __webpack_require__(__webpack_require__.s = 3);
        })([
          /* 0 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var BitMatrix = (
              /** @class */
              (function() {
                function BitMatrix2(data, width) {
                  this.width = width;
                  this.height = data.length / width;
                  this.data = data;
                }
                BitMatrix2.createEmpty = function(width, height) {
                  return new BitMatrix2(new Uint8ClampedArray(width * height), width);
                };
                BitMatrix2.prototype.get = function(x, y) {
                  if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
                    return false;
                  }
                  return !!this.data[y * this.width + x];
                };
                BitMatrix2.prototype.set = function(x, y, v) {
                  this.data[y * this.width + x] = v ? 1 : 0;
                };
                BitMatrix2.prototype.setRegion = function(left, top, width, height, v) {
                  for (var y = top; y < top + height; y++) {
                    for (var x = left; x < left + width; x++) {
                      this.set(x, y, !!v);
                    }
                  }
                };
                return BitMatrix2;
              })()
            );
            exports2.BitMatrix = BitMatrix;
          }),
          /* 1 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var GenericGFPoly_1 = __webpack_require__(2);
            function addOrSubtractGF(a, b) {
              return a ^ b;
            }
            exports2.addOrSubtractGF = addOrSubtractGF;
            var GenericGF = (
              /** @class */
              (function() {
                function GenericGF2(primitive, size, genBase) {
                  this.primitive = primitive;
                  this.size = size;
                  this.generatorBase = genBase;
                  this.expTable = new Array(this.size);
                  this.logTable = new Array(this.size);
                  var x = 1;
                  for (var i = 0; i < this.size; i++) {
                    this.expTable[i] = x;
                    x = x * 2;
                    if (x >= this.size) {
                      x = (x ^ this.primitive) & this.size - 1;
                    }
                  }
                  for (var i = 0; i < this.size - 1; i++) {
                    this.logTable[this.expTable[i]] = i;
                  }
                  this.zero = new GenericGFPoly_1.default(this, Uint8ClampedArray.from([0]));
                  this.one = new GenericGFPoly_1.default(this, Uint8ClampedArray.from([1]));
                }
                GenericGF2.prototype.multiply = function(a, b) {
                  if (a === 0 || b === 0) {
                    return 0;
                  }
                  return this.expTable[(this.logTable[a] + this.logTable[b]) % (this.size - 1)];
                };
                GenericGF2.prototype.inverse = function(a) {
                  if (a === 0) {
                    throw new Error("Can't invert 0");
                  }
                  return this.expTable[this.size - this.logTable[a] - 1];
                };
                GenericGF2.prototype.buildMonomial = function(degree, coefficient) {
                  if (degree < 0) {
                    throw new Error("Invalid monomial degree less than 0");
                  }
                  if (coefficient === 0) {
                    return this.zero;
                  }
                  var coefficients = new Uint8ClampedArray(degree + 1);
                  coefficients[0] = coefficient;
                  return new GenericGFPoly_1.default(this, coefficients);
                };
                GenericGF2.prototype.log = function(a) {
                  if (a === 0) {
                    throw new Error("Can't take log(0)");
                  }
                  return this.logTable[a];
                };
                GenericGF2.prototype.exp = function(a) {
                  return this.expTable[a];
                };
                return GenericGF2;
              })()
            );
            exports2.default = GenericGF;
          }),
          /* 2 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var GenericGF_1 = __webpack_require__(1);
            var GenericGFPoly = (
              /** @class */
              (function() {
                function GenericGFPoly2(field, coefficients) {
                  if (coefficients.length === 0) {
                    throw new Error("No coefficients.");
                  }
                  this.field = field;
                  var coefficientsLength = coefficients.length;
                  if (coefficientsLength > 1 && coefficients[0] === 0) {
                    var firstNonZero = 1;
                    while (firstNonZero < coefficientsLength && coefficients[firstNonZero] === 0) {
                      firstNonZero++;
                    }
                    if (firstNonZero === coefficientsLength) {
                      this.coefficients = field.zero.coefficients;
                    } else {
                      this.coefficients = new Uint8ClampedArray(coefficientsLength - firstNonZero);
                      for (var i = 0; i < this.coefficients.length; i++) {
                        this.coefficients[i] = coefficients[firstNonZero + i];
                      }
                    }
                  } else {
                    this.coefficients = coefficients;
                  }
                }
                GenericGFPoly2.prototype.degree = function() {
                  return this.coefficients.length - 1;
                };
                GenericGFPoly2.prototype.isZero = function() {
                  return this.coefficients[0] === 0;
                };
                GenericGFPoly2.prototype.getCoefficient = function(degree) {
                  return this.coefficients[this.coefficients.length - 1 - degree];
                };
                GenericGFPoly2.prototype.addOrSubtract = function(other) {
                  var _a;
                  if (this.isZero()) {
                    return other;
                  }
                  if (other.isZero()) {
                    return this;
                  }
                  var smallerCoefficients = this.coefficients;
                  var largerCoefficients = other.coefficients;
                  if (smallerCoefficients.length > largerCoefficients.length) {
                    _a = [largerCoefficients, smallerCoefficients], smallerCoefficients = _a[0], largerCoefficients = _a[1];
                  }
                  var sumDiff = new Uint8ClampedArray(largerCoefficients.length);
                  var lengthDiff = largerCoefficients.length - smallerCoefficients.length;
                  for (var i = 0; i < lengthDiff; i++) {
                    sumDiff[i] = largerCoefficients[i];
                  }
                  for (var i = lengthDiff; i < largerCoefficients.length; i++) {
                    sumDiff[i] = GenericGF_1.addOrSubtractGF(smallerCoefficients[i - lengthDiff], largerCoefficients[i]);
                  }
                  return new GenericGFPoly2(this.field, sumDiff);
                };
                GenericGFPoly2.prototype.multiply = function(scalar) {
                  if (scalar === 0) {
                    return this.field.zero;
                  }
                  if (scalar === 1) {
                    return this;
                  }
                  var size = this.coefficients.length;
                  var product = new Uint8ClampedArray(size);
                  for (var i = 0; i < size; i++) {
                    product[i] = this.field.multiply(this.coefficients[i], scalar);
                  }
                  return new GenericGFPoly2(this.field, product);
                };
                GenericGFPoly2.prototype.multiplyPoly = function(other) {
                  if (this.isZero() || other.isZero()) {
                    return this.field.zero;
                  }
                  var aCoefficients = this.coefficients;
                  var aLength = aCoefficients.length;
                  var bCoefficients = other.coefficients;
                  var bLength = bCoefficients.length;
                  var product = new Uint8ClampedArray(aLength + bLength - 1);
                  for (var i = 0; i < aLength; i++) {
                    var aCoeff = aCoefficients[i];
                    for (var j = 0; j < bLength; j++) {
                      product[i + j] = GenericGF_1.addOrSubtractGF(product[i + j], this.field.multiply(aCoeff, bCoefficients[j]));
                    }
                  }
                  return new GenericGFPoly2(this.field, product);
                };
                GenericGFPoly2.prototype.multiplyByMonomial = function(degree, coefficient) {
                  if (degree < 0) {
                    throw new Error("Invalid degree less than 0");
                  }
                  if (coefficient === 0) {
                    return this.field.zero;
                  }
                  var size = this.coefficients.length;
                  var product = new Uint8ClampedArray(size + degree);
                  for (var i = 0; i < size; i++) {
                    product[i] = this.field.multiply(this.coefficients[i], coefficient);
                  }
                  return new GenericGFPoly2(this.field, product);
                };
                GenericGFPoly2.prototype.evaluateAt = function(a) {
                  var result = 0;
                  if (a === 0) {
                    return this.getCoefficient(0);
                  }
                  var size = this.coefficients.length;
                  if (a === 1) {
                    this.coefficients.forEach(function(coefficient) {
                      result = GenericGF_1.addOrSubtractGF(result, coefficient);
                    });
                    return result;
                  }
                  result = this.coefficients[0];
                  for (var i = 1; i < size; i++) {
                    result = GenericGF_1.addOrSubtractGF(this.field.multiply(a, result), this.coefficients[i]);
                  }
                  return result;
                };
                return GenericGFPoly2;
              })()
            );
            exports2.default = GenericGFPoly;
          }),
          /* 3 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var binarizer_1 = __webpack_require__(4);
            var decoder_1 = __webpack_require__(5);
            var extractor_1 = __webpack_require__(11);
            var locator_1 = __webpack_require__(12);
            function scan(matrix) {
              var locations = locator_1.locate(matrix);
              if (!locations) {
                return null;
              }
              for (var _i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
                var location_1 = locations_1[_i];
                var extracted = extractor_1.extract(matrix, location_1);
                var decoded = decoder_1.decode(extracted.matrix);
                if (decoded) {
                  return {
                    binaryData: decoded.bytes,
                    data: decoded.text,
                    chunks: decoded.chunks,
                    version: decoded.version,
                    location: {
                      topRightCorner: extracted.mappingFunction(location_1.dimension, 0),
                      topLeftCorner: extracted.mappingFunction(0, 0),
                      bottomRightCorner: extracted.mappingFunction(location_1.dimension, location_1.dimension),
                      bottomLeftCorner: extracted.mappingFunction(0, location_1.dimension),
                      topRightFinderPattern: location_1.topRight,
                      topLeftFinderPattern: location_1.topLeft,
                      bottomLeftFinderPattern: location_1.bottomLeft,
                      bottomRightAlignmentPattern: location_1.alignmentPattern
                    }
                  };
                }
              }
              return null;
            }
            var defaultOptions = {
              inversionAttempts: "attemptBoth"
            };
            function jsQR(data, width, height, providedOptions) {
              if (providedOptions === void 0) {
                providedOptions = {};
              }
              var options = defaultOptions;
              Object.keys(options || {}).forEach(function(opt) {
                options[opt] = providedOptions[opt] || options[opt];
              });
              var shouldInvert = options.inversionAttempts === "attemptBoth" || options.inversionAttempts === "invertFirst";
              var tryInvertedFirst = options.inversionAttempts === "onlyInvert" || options.inversionAttempts === "invertFirst";
              var _a = binarizer_1.binarize(data, width, height, shouldInvert), binarized = _a.binarized, inverted = _a.inverted;
              var result = scan(tryInvertedFirst ? inverted : binarized);
              if (!result && (options.inversionAttempts === "attemptBoth" || options.inversionAttempts === "invertFirst")) {
                result = scan(tryInvertedFirst ? binarized : inverted);
              }
              return result;
            }
            jsQR.default = jsQR;
            exports2.default = jsQR;
          }),
          /* 4 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var BitMatrix_1 = __webpack_require__(0);
            var REGION_SIZE = 8;
            var MIN_DYNAMIC_RANGE = 24;
            function numBetween(value, min, max) {
              return value < min ? min : value > max ? max : value;
            }
            var Matrix = (
              /** @class */
              (function() {
                function Matrix2(width, height) {
                  this.width = width;
                  this.data = new Uint8ClampedArray(width * height);
                }
                Matrix2.prototype.get = function(x, y) {
                  return this.data[y * this.width + x];
                };
                Matrix2.prototype.set = function(x, y, value) {
                  this.data[y * this.width + x] = value;
                };
                return Matrix2;
              })()
            );
            function binarize(data, width, height, returnInverted) {
              if (data.length !== width * height * 4) {
                throw new Error("Malformed data passed to binarizer.");
              }
              var greyscalePixels = new Matrix(width, height);
              for (var x = 0; x < width; x++) {
                for (var y = 0; y < height; y++) {
                  var r = data[(y * width + x) * 4 + 0];
                  var g = data[(y * width + x) * 4 + 1];
                  var b = data[(y * width + x) * 4 + 2];
                  greyscalePixels.set(x, y, 0.2126 * r + 0.7152 * g + 0.0722 * b);
                }
              }
              var horizontalRegionCount = Math.ceil(width / REGION_SIZE);
              var verticalRegionCount = Math.ceil(height / REGION_SIZE);
              var blackPoints = new Matrix(horizontalRegionCount, verticalRegionCount);
              for (var verticalRegion = 0; verticalRegion < verticalRegionCount; verticalRegion++) {
                for (var hortizontalRegion = 0; hortizontalRegion < horizontalRegionCount; hortizontalRegion++) {
                  var sum = 0;
                  var min = Infinity;
                  var max = 0;
                  for (var y = 0; y < REGION_SIZE; y++) {
                    for (var x = 0; x < REGION_SIZE; x++) {
                      var pixelLumosity = greyscalePixels.get(hortizontalRegion * REGION_SIZE + x, verticalRegion * REGION_SIZE + y);
                      sum += pixelLumosity;
                      min = Math.min(min, pixelLumosity);
                      max = Math.max(max, pixelLumosity);
                    }
                  }
                  var average = sum / Math.pow(REGION_SIZE, 2);
                  if (max - min <= MIN_DYNAMIC_RANGE) {
                    average = min / 2;
                    if (verticalRegion > 0 && hortizontalRegion > 0) {
                      var averageNeighborBlackPoint = (blackPoints.get(hortizontalRegion, verticalRegion - 1) + 2 * blackPoints.get(hortizontalRegion - 1, verticalRegion) + blackPoints.get(hortizontalRegion - 1, verticalRegion - 1)) / 4;
                      if (min < averageNeighborBlackPoint) {
                        average = averageNeighborBlackPoint;
                      }
                    }
                  }
                  blackPoints.set(hortizontalRegion, verticalRegion, average);
                }
              }
              var binarized = BitMatrix_1.BitMatrix.createEmpty(width, height);
              var inverted = null;
              if (returnInverted) {
                inverted = BitMatrix_1.BitMatrix.createEmpty(width, height);
              }
              for (var verticalRegion = 0; verticalRegion < verticalRegionCount; verticalRegion++) {
                for (var hortizontalRegion = 0; hortizontalRegion < horizontalRegionCount; hortizontalRegion++) {
                  var left = numBetween(hortizontalRegion, 2, horizontalRegionCount - 3);
                  var top_1 = numBetween(verticalRegion, 2, verticalRegionCount - 3);
                  var sum = 0;
                  for (var xRegion = -2; xRegion <= 2; xRegion++) {
                    for (var yRegion = -2; yRegion <= 2; yRegion++) {
                      sum += blackPoints.get(left + xRegion, top_1 + yRegion);
                    }
                  }
                  var threshold = sum / 25;
                  for (var xRegion = 0; xRegion < REGION_SIZE; xRegion++) {
                    for (var yRegion = 0; yRegion < REGION_SIZE; yRegion++) {
                      var x = hortizontalRegion * REGION_SIZE + xRegion;
                      var y = verticalRegion * REGION_SIZE + yRegion;
                      var lum = greyscalePixels.get(x, y);
                      binarized.set(x, y, lum <= threshold);
                      if (returnInverted) {
                        inverted.set(x, y, !(lum <= threshold));
                      }
                    }
                  }
                }
              }
              if (returnInverted) {
                return { binarized, inverted };
              }
              return { binarized };
            }
            exports2.binarize = binarize;
          }),
          /* 5 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var BitMatrix_1 = __webpack_require__(0);
            var decodeData_1 = __webpack_require__(6);
            var reedsolomon_1 = __webpack_require__(9);
            var version_1 = __webpack_require__(10);
            function numBitsDiffering(x, y) {
              var z = x ^ y;
              var bitCount = 0;
              while (z) {
                bitCount++;
                z &= z - 1;
              }
              return bitCount;
            }
            function pushBit(bit, byte) {
              return byte << 1 | bit;
            }
            var FORMAT_INFO_TABLE = [
              { bits: 21522, formatInfo: { errorCorrectionLevel: 1, dataMask: 0 } },
              { bits: 20773, formatInfo: { errorCorrectionLevel: 1, dataMask: 1 } },
              { bits: 24188, formatInfo: { errorCorrectionLevel: 1, dataMask: 2 } },
              { bits: 23371, formatInfo: { errorCorrectionLevel: 1, dataMask: 3 } },
              { bits: 17913, formatInfo: { errorCorrectionLevel: 1, dataMask: 4 } },
              { bits: 16590, formatInfo: { errorCorrectionLevel: 1, dataMask: 5 } },
              { bits: 20375, formatInfo: { errorCorrectionLevel: 1, dataMask: 6 } },
              { bits: 19104, formatInfo: { errorCorrectionLevel: 1, dataMask: 7 } },
              { bits: 30660, formatInfo: { errorCorrectionLevel: 0, dataMask: 0 } },
              { bits: 29427, formatInfo: { errorCorrectionLevel: 0, dataMask: 1 } },
              { bits: 32170, formatInfo: { errorCorrectionLevel: 0, dataMask: 2 } },
              { bits: 30877, formatInfo: { errorCorrectionLevel: 0, dataMask: 3 } },
              { bits: 26159, formatInfo: { errorCorrectionLevel: 0, dataMask: 4 } },
              { bits: 25368, formatInfo: { errorCorrectionLevel: 0, dataMask: 5 } },
              { bits: 27713, formatInfo: { errorCorrectionLevel: 0, dataMask: 6 } },
              { bits: 26998, formatInfo: { errorCorrectionLevel: 0, dataMask: 7 } },
              { bits: 5769, formatInfo: { errorCorrectionLevel: 3, dataMask: 0 } },
              { bits: 5054, formatInfo: { errorCorrectionLevel: 3, dataMask: 1 } },
              { bits: 7399, formatInfo: { errorCorrectionLevel: 3, dataMask: 2 } },
              { bits: 6608, formatInfo: { errorCorrectionLevel: 3, dataMask: 3 } },
              { bits: 1890, formatInfo: { errorCorrectionLevel: 3, dataMask: 4 } },
              { bits: 597, formatInfo: { errorCorrectionLevel: 3, dataMask: 5 } },
              { bits: 3340, formatInfo: { errorCorrectionLevel: 3, dataMask: 6 } },
              { bits: 2107, formatInfo: { errorCorrectionLevel: 3, dataMask: 7 } },
              { bits: 13663, formatInfo: { errorCorrectionLevel: 2, dataMask: 0 } },
              { bits: 12392, formatInfo: { errorCorrectionLevel: 2, dataMask: 1 } },
              { bits: 16177, formatInfo: { errorCorrectionLevel: 2, dataMask: 2 } },
              { bits: 14854, formatInfo: { errorCorrectionLevel: 2, dataMask: 3 } },
              { bits: 9396, formatInfo: { errorCorrectionLevel: 2, dataMask: 4 } },
              { bits: 8579, formatInfo: { errorCorrectionLevel: 2, dataMask: 5 } },
              { bits: 11994, formatInfo: { errorCorrectionLevel: 2, dataMask: 6 } },
              { bits: 11245, formatInfo: { errorCorrectionLevel: 2, dataMask: 7 } }
            ];
            var DATA_MASKS = [
              function(p) {
                return (p.y + p.x) % 2 === 0;
              },
              function(p) {
                return p.y % 2 === 0;
              },
              function(p) {
                return p.x % 3 === 0;
              },
              function(p) {
                return (p.y + p.x) % 3 === 0;
              },
              function(p) {
                return (Math.floor(p.y / 2) + Math.floor(p.x / 3)) % 2 === 0;
              },
              function(p) {
                return p.x * p.y % 2 + p.x * p.y % 3 === 0;
              },
              function(p) {
                return (p.y * p.x % 2 + p.y * p.x % 3) % 2 === 0;
              },
              function(p) {
                return ((p.y + p.x) % 2 + p.y * p.x % 3) % 2 === 0;
              }
            ];
            function buildFunctionPatternMask(version) {
              var dimension = 17 + 4 * version.versionNumber;
              var matrix = BitMatrix_1.BitMatrix.createEmpty(dimension, dimension);
              matrix.setRegion(0, 0, 9, 9, true);
              matrix.setRegion(dimension - 8, 0, 8, 9, true);
              matrix.setRegion(0, dimension - 8, 9, 8, true);
              for (var _i = 0, _a = version.alignmentPatternCenters; _i < _a.length; _i++) {
                var x = _a[_i];
                for (var _b = 0, _c = version.alignmentPatternCenters; _b < _c.length; _b++) {
                  var y = _c[_b];
                  if (!(x === 6 && y === 6 || x === 6 && y === dimension - 7 || x === dimension - 7 && y === 6)) {
                    matrix.setRegion(x - 2, y - 2, 5, 5, true);
                  }
                }
              }
              matrix.setRegion(6, 9, 1, dimension - 17, true);
              matrix.setRegion(9, 6, dimension - 17, 1, true);
              if (version.versionNumber > 6) {
                matrix.setRegion(dimension - 11, 0, 3, 6, true);
                matrix.setRegion(0, dimension - 11, 6, 3, true);
              }
              return matrix;
            }
            function readCodewords(matrix, version, formatInfo) {
              var dataMask = DATA_MASKS[formatInfo.dataMask];
              var dimension = matrix.height;
              var functionPatternMask = buildFunctionPatternMask(version);
              var codewords = [];
              var currentByte = 0;
              var bitsRead = 0;
              var readingUp = true;
              for (var columnIndex = dimension - 1; columnIndex > 0; columnIndex -= 2) {
                if (columnIndex === 6) {
                  columnIndex--;
                }
                for (var i = 0; i < dimension; i++) {
                  var y = readingUp ? dimension - 1 - i : i;
                  for (var columnOffset = 0; columnOffset < 2; columnOffset++) {
                    var x = columnIndex - columnOffset;
                    if (!functionPatternMask.get(x, y)) {
                      bitsRead++;
                      var bit = matrix.get(x, y);
                      if (dataMask({ y, x })) {
                        bit = !bit;
                      }
                      currentByte = pushBit(bit, currentByte);
                      if (bitsRead === 8) {
                        codewords.push(currentByte);
                        bitsRead = 0;
                        currentByte = 0;
                      }
                    }
                  }
                }
                readingUp = !readingUp;
              }
              return codewords;
            }
            function readVersion(matrix) {
              var dimension = matrix.height;
              var provisionalVersion = Math.floor((dimension - 17) / 4);
              if (provisionalVersion <= 6) {
                return version_1.VERSIONS[provisionalVersion - 1];
              }
              var topRightVersionBits = 0;
              for (var y = 5; y >= 0; y--) {
                for (var x = dimension - 9; x >= dimension - 11; x--) {
                  topRightVersionBits = pushBit(matrix.get(x, y), topRightVersionBits);
                }
              }
              var bottomLeftVersionBits = 0;
              for (var x = 5; x >= 0; x--) {
                for (var y = dimension - 9; y >= dimension - 11; y--) {
                  bottomLeftVersionBits = pushBit(matrix.get(x, y), bottomLeftVersionBits);
                }
              }
              var bestDifference = Infinity;
              var bestVersion;
              for (var _i = 0, VERSIONS_1 = version_1.VERSIONS; _i < VERSIONS_1.length; _i++) {
                var version = VERSIONS_1[_i];
                if (version.infoBits === topRightVersionBits || version.infoBits === bottomLeftVersionBits) {
                  return version;
                }
                var difference = numBitsDiffering(topRightVersionBits, version.infoBits);
                if (difference < bestDifference) {
                  bestVersion = version;
                  bestDifference = difference;
                }
                difference = numBitsDiffering(bottomLeftVersionBits, version.infoBits);
                if (difference < bestDifference) {
                  bestVersion = version;
                  bestDifference = difference;
                }
              }
              if (bestDifference <= 3) {
                return bestVersion;
              }
            }
            function readFormatInformation(matrix) {
              var topLeftFormatInfoBits = 0;
              for (var x = 0; x <= 8; x++) {
                if (x !== 6) {
                  topLeftFormatInfoBits = pushBit(matrix.get(x, 8), topLeftFormatInfoBits);
                }
              }
              for (var y = 7; y >= 0; y--) {
                if (y !== 6) {
                  topLeftFormatInfoBits = pushBit(matrix.get(8, y), topLeftFormatInfoBits);
                }
              }
              var dimension = matrix.height;
              var topRightBottomRightFormatInfoBits = 0;
              for (var y = dimension - 1; y >= dimension - 7; y--) {
                topRightBottomRightFormatInfoBits = pushBit(matrix.get(8, y), topRightBottomRightFormatInfoBits);
              }
              for (var x = dimension - 8; x < dimension; x++) {
                topRightBottomRightFormatInfoBits = pushBit(matrix.get(x, 8), topRightBottomRightFormatInfoBits);
              }
              var bestDifference = Infinity;
              var bestFormatInfo = null;
              for (var _i = 0, FORMAT_INFO_TABLE_1 = FORMAT_INFO_TABLE; _i < FORMAT_INFO_TABLE_1.length; _i++) {
                var _a = FORMAT_INFO_TABLE_1[_i], bits = _a.bits, formatInfo = _a.formatInfo;
                if (bits === topLeftFormatInfoBits || bits === topRightBottomRightFormatInfoBits) {
                  return formatInfo;
                }
                var difference = numBitsDiffering(topLeftFormatInfoBits, bits);
                if (difference < bestDifference) {
                  bestFormatInfo = formatInfo;
                  bestDifference = difference;
                }
                if (topLeftFormatInfoBits !== topRightBottomRightFormatInfoBits) {
                  difference = numBitsDiffering(topRightBottomRightFormatInfoBits, bits);
                  if (difference < bestDifference) {
                    bestFormatInfo = formatInfo;
                    bestDifference = difference;
                  }
                }
              }
              if (bestDifference <= 3) {
                return bestFormatInfo;
              }
              return null;
            }
            function getDataBlocks(codewords, version, ecLevel) {
              var ecInfo = version.errorCorrectionLevels[ecLevel];
              var dataBlocks = [];
              var totalCodewords = 0;
              ecInfo.ecBlocks.forEach(function(block) {
                for (var i2 = 0; i2 < block.numBlocks; i2++) {
                  dataBlocks.push({ numDataCodewords: block.dataCodewordsPerBlock, codewords: [] });
                  totalCodewords += block.dataCodewordsPerBlock + ecInfo.ecCodewordsPerBlock;
                }
              });
              if (codewords.length < totalCodewords) {
                return null;
              }
              codewords = codewords.slice(0, totalCodewords);
              var shortBlockSize = ecInfo.ecBlocks[0].dataCodewordsPerBlock;
              for (var i = 0; i < shortBlockSize; i++) {
                for (var _i = 0, dataBlocks_1 = dataBlocks; _i < dataBlocks_1.length; _i++) {
                  var dataBlock = dataBlocks_1[_i];
                  dataBlock.codewords.push(codewords.shift());
                }
              }
              if (ecInfo.ecBlocks.length > 1) {
                var smallBlockCount = ecInfo.ecBlocks[0].numBlocks;
                var largeBlockCount = ecInfo.ecBlocks[1].numBlocks;
                for (var i = 0; i < largeBlockCount; i++) {
                  dataBlocks[smallBlockCount + i].codewords.push(codewords.shift());
                }
              }
              while (codewords.length > 0) {
                for (var _a = 0, dataBlocks_2 = dataBlocks; _a < dataBlocks_2.length; _a++) {
                  var dataBlock = dataBlocks_2[_a];
                  dataBlock.codewords.push(codewords.shift());
                }
              }
              return dataBlocks;
            }
            function decodeMatrix(matrix) {
              var version = readVersion(matrix);
              if (!version) {
                return null;
              }
              var formatInfo = readFormatInformation(matrix);
              if (!formatInfo) {
                return null;
              }
              var codewords = readCodewords(matrix, version, formatInfo);
              var dataBlocks = getDataBlocks(codewords, version, formatInfo.errorCorrectionLevel);
              if (!dataBlocks) {
                return null;
              }
              var totalBytes = dataBlocks.reduce(function(a, b) {
                return a + b.numDataCodewords;
              }, 0);
              var resultBytes = new Uint8ClampedArray(totalBytes);
              var resultIndex = 0;
              for (var _i = 0, dataBlocks_3 = dataBlocks; _i < dataBlocks_3.length; _i++) {
                var dataBlock = dataBlocks_3[_i];
                var correctedBytes = reedsolomon_1.decode(dataBlock.codewords, dataBlock.codewords.length - dataBlock.numDataCodewords);
                if (!correctedBytes) {
                  return null;
                }
                for (var i = 0; i < dataBlock.numDataCodewords; i++) {
                  resultBytes[resultIndex++] = correctedBytes[i];
                }
              }
              try {
                return decodeData_1.decode(resultBytes, version.versionNumber);
              } catch (_a) {
                return null;
              }
            }
            function decode(matrix) {
              if (matrix == null) {
                return null;
              }
              var result = decodeMatrix(matrix);
              if (result) {
                return result;
              }
              for (var x = 0; x < matrix.width; x++) {
                for (var y = x + 1; y < matrix.height; y++) {
                  if (matrix.get(x, y) !== matrix.get(y, x)) {
                    matrix.set(x, y, !matrix.get(x, y));
                    matrix.set(y, x, !matrix.get(y, x));
                  }
                }
              }
              return decodeMatrix(matrix);
            }
            exports2.decode = decode;
          }),
          /* 6 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var BitStream_1 = __webpack_require__(7);
            var shiftJISTable_1 = __webpack_require__(8);
            var Mode;
            (function(Mode2) {
              Mode2["Numeric"] = "numeric";
              Mode2["Alphanumeric"] = "alphanumeric";
              Mode2["Byte"] = "byte";
              Mode2["Kanji"] = "kanji";
              Mode2["ECI"] = "eci";
            })(Mode = exports2.Mode || (exports2.Mode = {}));
            var ModeByte;
            (function(ModeByte2) {
              ModeByte2[ModeByte2["Terminator"] = 0] = "Terminator";
              ModeByte2[ModeByte2["Numeric"] = 1] = "Numeric";
              ModeByte2[ModeByte2["Alphanumeric"] = 2] = "Alphanumeric";
              ModeByte2[ModeByte2["Byte"] = 4] = "Byte";
              ModeByte2[ModeByte2["Kanji"] = 8] = "Kanji";
              ModeByte2[ModeByte2["ECI"] = 7] = "ECI";
            })(ModeByte || (ModeByte = {}));
            function decodeNumeric(stream, size) {
              var bytes = [];
              var text = "";
              var characterCountSize = [10, 12, 14][size];
              var length = stream.readBits(characterCountSize);
              while (length >= 3) {
                var num2 = stream.readBits(10);
                if (num2 >= 1e3) {
                  throw new Error("Invalid numeric value above 999");
                }
                var a = Math.floor(num2 / 100);
                var b = Math.floor(num2 / 10) % 10;
                var c = num2 % 10;
                bytes.push(48 + a, 48 + b, 48 + c);
                text += a.toString() + b.toString() + c.toString();
                length -= 3;
              }
              if (length === 2) {
                var num2 = stream.readBits(7);
                if (num2 >= 100) {
                  throw new Error("Invalid numeric value above 99");
                }
                var a = Math.floor(num2 / 10);
                var b = num2 % 10;
                bytes.push(48 + a, 48 + b);
                text += a.toString() + b.toString();
              } else if (length === 1) {
                var num2 = stream.readBits(4);
                if (num2 >= 10) {
                  throw new Error("Invalid numeric value above 9");
                }
                bytes.push(48 + num2);
                text += num2.toString();
              }
              return { bytes, text };
            }
            var AlphanumericCharacterCodes = [
              "0",
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "A",
              "B",
              "C",
              "D",
              "E",
              "F",
              "G",
              "H",
              "I",
              "J",
              "K",
              "L",
              "M",
              "N",
              "O",
              "P",
              "Q",
              "R",
              "S",
              "T",
              "U",
              "V",
              "W",
              "X",
              "Y",
              "Z",
              " ",
              "$",
              "%",
              "*",
              "+",
              "-",
              ".",
              "/",
              ":"
            ];
            function decodeAlphanumeric(stream, size) {
              var bytes = [];
              var text = "";
              var characterCountSize = [9, 11, 13][size];
              var length = stream.readBits(characterCountSize);
              while (length >= 2) {
                var v = stream.readBits(11);
                var a = Math.floor(v / 45);
                var b = v % 45;
                bytes.push(AlphanumericCharacterCodes[a].charCodeAt(0), AlphanumericCharacterCodes[b].charCodeAt(0));
                text += AlphanumericCharacterCodes[a] + AlphanumericCharacterCodes[b];
                length -= 2;
              }
              if (length === 1) {
                var a = stream.readBits(6);
                bytes.push(AlphanumericCharacterCodes[a].charCodeAt(0));
                text += AlphanumericCharacterCodes[a];
              }
              return { bytes, text };
            }
            function decodeByte(stream, size) {
              var bytes = [];
              var text = "";
              var characterCountSize = [8, 16, 16][size];
              var length = stream.readBits(characterCountSize);
              for (var i = 0; i < length; i++) {
                var b = stream.readBits(8);
                bytes.push(b);
              }
              try {
                text += decodeURIComponent(bytes.map(function(b2) {
                  return "%" + ("0" + b2.toString(16)).substr(-2);
                }).join(""));
              } catch (_a) {
              }
              return { bytes, text };
            }
            function decodeKanji(stream, size) {
              var bytes = [];
              var text = "";
              var characterCountSize = [8, 10, 12][size];
              var length = stream.readBits(characterCountSize);
              for (var i = 0; i < length; i++) {
                var k = stream.readBits(13);
                var c = Math.floor(k / 192) << 8 | k % 192;
                if (c < 7936) {
                  c += 33088;
                } else {
                  c += 49472;
                }
                bytes.push(c >> 8, c & 255);
                text += String.fromCharCode(shiftJISTable_1.shiftJISTable[c]);
              }
              return { bytes, text };
            }
            function decode(data, version) {
              var _a, _b, _c, _d;
              var stream = new BitStream_1.BitStream(data);
              var size = version <= 9 ? 0 : version <= 26 ? 1 : 2;
              var result = {
                text: "",
                bytes: [],
                chunks: [],
                version
              };
              while (stream.available() >= 4) {
                var mode = stream.readBits(4);
                if (mode === ModeByte.Terminator) {
                  return result;
                } else if (mode === ModeByte.ECI) {
                  if (stream.readBits(1) === 0) {
                    result.chunks.push({
                      type: Mode.ECI,
                      assignmentNumber: stream.readBits(7)
                    });
                  } else if (stream.readBits(1) === 0) {
                    result.chunks.push({
                      type: Mode.ECI,
                      assignmentNumber: stream.readBits(14)
                    });
                  } else if (stream.readBits(1) === 0) {
                    result.chunks.push({
                      type: Mode.ECI,
                      assignmentNumber: stream.readBits(21)
                    });
                  } else {
                    result.chunks.push({
                      type: Mode.ECI,
                      assignmentNumber: -1
                    });
                  }
                } else if (mode === ModeByte.Numeric) {
                  var numericResult = decodeNumeric(stream, size);
                  result.text += numericResult.text;
                  (_a = result.bytes).push.apply(_a, numericResult.bytes);
                  result.chunks.push({
                    type: Mode.Numeric,
                    text: numericResult.text
                  });
                } else if (mode === ModeByte.Alphanumeric) {
                  var alphanumericResult = decodeAlphanumeric(stream, size);
                  result.text += alphanumericResult.text;
                  (_b = result.bytes).push.apply(_b, alphanumericResult.bytes);
                  result.chunks.push({
                    type: Mode.Alphanumeric,
                    text: alphanumericResult.text
                  });
                } else if (mode === ModeByte.Byte) {
                  var byteResult = decodeByte(stream, size);
                  result.text += byteResult.text;
                  (_c = result.bytes).push.apply(_c, byteResult.bytes);
                  result.chunks.push({
                    type: Mode.Byte,
                    bytes: byteResult.bytes,
                    text: byteResult.text
                  });
                } else if (mode === ModeByte.Kanji) {
                  var kanjiResult = decodeKanji(stream, size);
                  result.text += kanjiResult.text;
                  (_d = result.bytes).push.apply(_d, kanjiResult.bytes);
                  result.chunks.push({
                    type: Mode.Kanji,
                    bytes: kanjiResult.bytes,
                    text: kanjiResult.text
                  });
                }
              }
              if (stream.available() === 0 || stream.readBits(stream.available()) === 0) {
                return result;
              }
            }
            exports2.decode = decode;
          }),
          /* 7 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var BitStream = (
              /** @class */
              (function() {
                function BitStream2(bytes) {
                  this.byteOffset = 0;
                  this.bitOffset = 0;
                  this.bytes = bytes;
                }
                BitStream2.prototype.readBits = function(numBits) {
                  if (numBits < 1 || numBits > 32 || numBits > this.available()) {
                    throw new Error("Cannot read " + numBits.toString() + " bits");
                  }
                  var result = 0;
                  if (this.bitOffset > 0) {
                    var bitsLeft = 8 - this.bitOffset;
                    var toRead = numBits < bitsLeft ? numBits : bitsLeft;
                    var bitsToNotRead = bitsLeft - toRead;
                    var mask = 255 >> 8 - toRead << bitsToNotRead;
                    result = (this.bytes[this.byteOffset] & mask) >> bitsToNotRead;
                    numBits -= toRead;
                    this.bitOffset += toRead;
                    if (this.bitOffset === 8) {
                      this.bitOffset = 0;
                      this.byteOffset++;
                    }
                  }
                  if (numBits > 0) {
                    while (numBits >= 8) {
                      result = result << 8 | this.bytes[this.byteOffset] & 255;
                      this.byteOffset++;
                      numBits -= 8;
                    }
                    if (numBits > 0) {
                      var bitsToNotRead = 8 - numBits;
                      var mask = 255 >> bitsToNotRead << bitsToNotRead;
                      result = result << numBits | (this.bytes[this.byteOffset] & mask) >> bitsToNotRead;
                      this.bitOffset += numBits;
                    }
                  }
                  return result;
                };
                BitStream2.prototype.available = function() {
                  return 8 * (this.bytes.length - this.byteOffset) - this.bitOffset;
                };
                return BitStream2;
              })()
            );
            exports2.BitStream = BitStream;
          }),
          /* 8 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            exports2.shiftJISTable = {
              32: 32,
              33: 33,
              34: 34,
              35: 35,
              36: 36,
              37: 37,
              38: 38,
              39: 39,
              40: 40,
              41: 41,
              42: 42,
              43: 43,
              44: 44,
              45: 45,
              46: 46,
              47: 47,
              48: 48,
              49: 49,
              50: 50,
              51: 51,
              52: 52,
              53: 53,
              54: 54,
              55: 55,
              56: 56,
              57: 57,
              58: 58,
              59: 59,
              60: 60,
              61: 61,
              62: 62,
              63: 63,
              64: 64,
              65: 65,
              66: 66,
              67: 67,
              68: 68,
              69: 69,
              70: 70,
              71: 71,
              72: 72,
              73: 73,
              74: 74,
              75: 75,
              76: 76,
              77: 77,
              78: 78,
              79: 79,
              80: 80,
              81: 81,
              82: 82,
              83: 83,
              84: 84,
              85: 85,
              86: 86,
              87: 87,
              88: 88,
              89: 89,
              90: 90,
              91: 91,
              92: 165,
              93: 93,
              94: 94,
              95: 95,
              96: 96,
              97: 97,
              98: 98,
              99: 99,
              100: 100,
              101: 101,
              102: 102,
              103: 103,
              104: 104,
              105: 105,
              106: 106,
              107: 107,
              108: 108,
              109: 109,
              110: 110,
              111: 111,
              112: 112,
              113: 113,
              114: 114,
              115: 115,
              116: 116,
              117: 117,
              118: 118,
              119: 119,
              120: 120,
              121: 121,
              122: 122,
              123: 123,
              124: 124,
              125: 125,
              126: 8254,
              33088: 12288,
              33089: 12289,
              33090: 12290,
              33091: 65292,
              33092: 65294,
              33093: 12539,
              33094: 65306,
              33095: 65307,
              33096: 65311,
              33097: 65281,
              33098: 12443,
              33099: 12444,
              33100: 180,
              33101: 65344,
              33102: 168,
              33103: 65342,
              33104: 65507,
              33105: 65343,
              33106: 12541,
              33107: 12542,
              33108: 12445,
              33109: 12446,
              33110: 12291,
              33111: 20189,
              33112: 12293,
              33113: 12294,
              33114: 12295,
              33115: 12540,
              33116: 8213,
              33117: 8208,
              33118: 65295,
              33119: 92,
              33120: 12316,
              33121: 8214,
              33122: 65372,
              33123: 8230,
              33124: 8229,
              33125: 8216,
              33126: 8217,
              33127: 8220,
              33128: 8221,
              33129: 65288,
              33130: 65289,
              33131: 12308,
              33132: 12309,
              33133: 65339,
              33134: 65341,
              33135: 65371,
              33136: 65373,
              33137: 12296,
              33138: 12297,
              33139: 12298,
              33140: 12299,
              33141: 12300,
              33142: 12301,
              33143: 12302,
              33144: 12303,
              33145: 12304,
              33146: 12305,
              33147: 65291,
              33148: 8722,
              33149: 177,
              33150: 215,
              33152: 247,
              33153: 65309,
              33154: 8800,
              33155: 65308,
              33156: 65310,
              33157: 8806,
              33158: 8807,
              33159: 8734,
              33160: 8756,
              33161: 9794,
              33162: 9792,
              33163: 176,
              33164: 8242,
              33165: 8243,
              33166: 8451,
              33167: 65509,
              33168: 65284,
              33169: 162,
              33170: 163,
              33171: 65285,
              33172: 65283,
              33173: 65286,
              33174: 65290,
              33175: 65312,
              33176: 167,
              33177: 9734,
              33178: 9733,
              33179: 9675,
              33180: 9679,
              33181: 9678,
              33182: 9671,
              33183: 9670,
              33184: 9633,
              33185: 9632,
              33186: 9651,
              33187: 9650,
              33188: 9661,
              33189: 9660,
              33190: 8251,
              33191: 12306,
              33192: 8594,
              33193: 8592,
              33194: 8593,
              33195: 8595,
              33196: 12307,
              33208: 8712,
              33209: 8715,
              33210: 8838,
              33211: 8839,
              33212: 8834,
              33213: 8835,
              33214: 8746,
              33215: 8745,
              33224: 8743,
              33225: 8744,
              33226: 172,
              33227: 8658,
              33228: 8660,
              33229: 8704,
              33230: 8707,
              33242: 8736,
              33243: 8869,
              33244: 8978,
              33245: 8706,
              33246: 8711,
              33247: 8801,
              33248: 8786,
              33249: 8810,
              33250: 8811,
              33251: 8730,
              33252: 8765,
              33253: 8733,
              33254: 8757,
              33255: 8747,
              33256: 8748,
              33264: 8491,
              33265: 8240,
              33266: 9839,
              33267: 9837,
              33268: 9834,
              33269: 8224,
              33270: 8225,
              33271: 182,
              33276: 9711,
              33359: 65296,
              33360: 65297,
              33361: 65298,
              33362: 65299,
              33363: 65300,
              33364: 65301,
              33365: 65302,
              33366: 65303,
              33367: 65304,
              33368: 65305,
              33376: 65313,
              33377: 65314,
              33378: 65315,
              33379: 65316,
              33380: 65317,
              33381: 65318,
              33382: 65319,
              33383: 65320,
              33384: 65321,
              33385: 65322,
              33386: 65323,
              33387: 65324,
              33388: 65325,
              33389: 65326,
              33390: 65327,
              33391: 65328,
              33392: 65329,
              33393: 65330,
              33394: 65331,
              33395: 65332,
              33396: 65333,
              33397: 65334,
              33398: 65335,
              33399: 65336,
              33400: 65337,
              33401: 65338,
              33409: 65345,
              33410: 65346,
              33411: 65347,
              33412: 65348,
              33413: 65349,
              33414: 65350,
              33415: 65351,
              33416: 65352,
              33417: 65353,
              33418: 65354,
              33419: 65355,
              33420: 65356,
              33421: 65357,
              33422: 65358,
              33423: 65359,
              33424: 65360,
              33425: 65361,
              33426: 65362,
              33427: 65363,
              33428: 65364,
              33429: 65365,
              33430: 65366,
              33431: 65367,
              33432: 65368,
              33433: 65369,
              33434: 65370,
              33439: 12353,
              33440: 12354,
              33441: 12355,
              33442: 12356,
              33443: 12357,
              33444: 12358,
              33445: 12359,
              33446: 12360,
              33447: 12361,
              33448: 12362,
              33449: 12363,
              33450: 12364,
              33451: 12365,
              33452: 12366,
              33453: 12367,
              33454: 12368,
              33455: 12369,
              33456: 12370,
              33457: 12371,
              33458: 12372,
              33459: 12373,
              33460: 12374,
              33461: 12375,
              33462: 12376,
              33463: 12377,
              33464: 12378,
              33465: 12379,
              33466: 12380,
              33467: 12381,
              33468: 12382,
              33469: 12383,
              33470: 12384,
              33471: 12385,
              33472: 12386,
              33473: 12387,
              33474: 12388,
              33475: 12389,
              33476: 12390,
              33477: 12391,
              33478: 12392,
              33479: 12393,
              33480: 12394,
              33481: 12395,
              33482: 12396,
              33483: 12397,
              33484: 12398,
              33485: 12399,
              33486: 12400,
              33487: 12401,
              33488: 12402,
              33489: 12403,
              33490: 12404,
              33491: 12405,
              33492: 12406,
              33493: 12407,
              33494: 12408,
              33495: 12409,
              33496: 12410,
              33497: 12411,
              33498: 12412,
              33499: 12413,
              33500: 12414,
              33501: 12415,
              33502: 12416,
              33503: 12417,
              33504: 12418,
              33505: 12419,
              33506: 12420,
              33507: 12421,
              33508: 12422,
              33509: 12423,
              33510: 12424,
              33511: 12425,
              33512: 12426,
              33513: 12427,
              33514: 12428,
              33515: 12429,
              33516: 12430,
              33517: 12431,
              33518: 12432,
              33519: 12433,
              33520: 12434,
              33521: 12435,
              33600: 12449,
              33601: 12450,
              33602: 12451,
              33603: 12452,
              33604: 12453,
              33605: 12454,
              33606: 12455,
              33607: 12456,
              33608: 12457,
              33609: 12458,
              33610: 12459,
              33611: 12460,
              33612: 12461,
              33613: 12462,
              33614: 12463,
              33615: 12464,
              33616: 12465,
              33617: 12466,
              33618: 12467,
              33619: 12468,
              33620: 12469,
              33621: 12470,
              33622: 12471,
              33623: 12472,
              33624: 12473,
              33625: 12474,
              33626: 12475,
              33627: 12476,
              33628: 12477,
              33629: 12478,
              33630: 12479,
              33631: 12480,
              33632: 12481,
              33633: 12482,
              33634: 12483,
              33635: 12484,
              33636: 12485,
              33637: 12486,
              33638: 12487,
              33639: 12488,
              33640: 12489,
              33641: 12490,
              33642: 12491,
              33643: 12492,
              33644: 12493,
              33645: 12494,
              33646: 12495,
              33647: 12496,
              33648: 12497,
              33649: 12498,
              33650: 12499,
              33651: 12500,
              33652: 12501,
              33653: 12502,
              33654: 12503,
              33655: 12504,
              33656: 12505,
              33657: 12506,
              33658: 12507,
              33659: 12508,
              33660: 12509,
              33661: 12510,
              33662: 12511,
              33664: 12512,
              33665: 12513,
              33666: 12514,
              33667: 12515,
              33668: 12516,
              33669: 12517,
              33670: 12518,
              33671: 12519,
              33672: 12520,
              33673: 12521,
              33674: 12522,
              33675: 12523,
              33676: 12524,
              33677: 12525,
              33678: 12526,
              33679: 12527,
              33680: 12528,
              33681: 12529,
              33682: 12530,
              33683: 12531,
              33684: 12532,
              33685: 12533,
              33686: 12534,
              33695: 913,
              33696: 914,
              33697: 915,
              33698: 916,
              33699: 917,
              33700: 918,
              33701: 919,
              33702: 920,
              33703: 921,
              33704: 922,
              33705: 923,
              33706: 924,
              33707: 925,
              33708: 926,
              33709: 927,
              33710: 928,
              33711: 929,
              33712: 931,
              33713: 932,
              33714: 933,
              33715: 934,
              33716: 935,
              33717: 936,
              33718: 937,
              33727: 945,
              33728: 946,
              33729: 947,
              33730: 948,
              33731: 949,
              33732: 950,
              33733: 951,
              33734: 952,
              33735: 953,
              33736: 954,
              33737: 955,
              33738: 956,
              33739: 957,
              33740: 958,
              33741: 959,
              33742: 960,
              33743: 961,
              33744: 963,
              33745: 964,
              33746: 965,
              33747: 966,
              33748: 967,
              33749: 968,
              33750: 969,
              33856: 1040,
              33857: 1041,
              33858: 1042,
              33859: 1043,
              33860: 1044,
              33861: 1045,
              33862: 1025,
              33863: 1046,
              33864: 1047,
              33865: 1048,
              33866: 1049,
              33867: 1050,
              33868: 1051,
              33869: 1052,
              33870: 1053,
              33871: 1054,
              33872: 1055,
              33873: 1056,
              33874: 1057,
              33875: 1058,
              33876: 1059,
              33877: 1060,
              33878: 1061,
              33879: 1062,
              33880: 1063,
              33881: 1064,
              33882: 1065,
              33883: 1066,
              33884: 1067,
              33885: 1068,
              33886: 1069,
              33887: 1070,
              33888: 1071,
              33904: 1072,
              33905: 1073,
              33906: 1074,
              33907: 1075,
              33908: 1076,
              33909: 1077,
              33910: 1105,
              33911: 1078,
              33912: 1079,
              33913: 1080,
              33914: 1081,
              33915: 1082,
              33916: 1083,
              33917: 1084,
              33918: 1085,
              33920: 1086,
              33921: 1087,
              33922: 1088,
              33923: 1089,
              33924: 1090,
              33925: 1091,
              33926: 1092,
              33927: 1093,
              33928: 1094,
              33929: 1095,
              33930: 1096,
              33931: 1097,
              33932: 1098,
              33933: 1099,
              33934: 1100,
              33935: 1101,
              33936: 1102,
              33937: 1103,
              33951: 9472,
              33952: 9474,
              33953: 9484,
              33954: 9488,
              33955: 9496,
              33956: 9492,
              33957: 9500,
              33958: 9516,
              33959: 9508,
              33960: 9524,
              33961: 9532,
              33962: 9473,
              33963: 9475,
              33964: 9487,
              33965: 9491,
              33966: 9499,
              33967: 9495,
              33968: 9507,
              33969: 9523,
              33970: 9515,
              33971: 9531,
              33972: 9547,
              33973: 9504,
              33974: 9519,
              33975: 9512,
              33976: 9527,
              33977: 9535,
              33978: 9501,
              33979: 9520,
              33980: 9509,
              33981: 9528,
              33982: 9538,
              34975: 20124,
              34976: 21782,
              34977: 23043,
              34978: 38463,
              34979: 21696,
              34980: 24859,
              34981: 25384,
              34982: 23030,
              34983: 36898,
              34984: 33909,
              34985: 33564,
              34986: 31312,
              34987: 24746,
              34988: 25569,
              34989: 28197,
              34990: 26093,
              34991: 33894,
              34992: 33446,
              34993: 39925,
              34994: 26771,
              34995: 22311,
              34996: 26017,
              34997: 25201,
              34998: 23451,
              34999: 22992,
              35e3: 34427,
              35001: 39156,
              35002: 32098,
              35003: 32190,
              35004: 39822,
              35005: 25110,
              35006: 31903,
              35007: 34999,
              35008: 23433,
              35009: 24245,
              35010: 25353,
              35011: 26263,
              35012: 26696,
              35013: 38343,
              35014: 38797,
              35015: 26447,
              35016: 20197,
              35017: 20234,
              35018: 20301,
              35019: 20381,
              35020: 20553,
              35021: 22258,
              35022: 22839,
              35023: 22996,
              35024: 23041,
              35025: 23561,
              35026: 24799,
              35027: 24847,
              35028: 24944,
              35029: 26131,
              35030: 26885,
              35031: 28858,
              35032: 30031,
              35033: 30064,
              35034: 31227,
              35035: 32173,
              35036: 32239,
              35037: 32963,
              35038: 33806,
              35039: 34915,
              35040: 35586,
              35041: 36949,
              35042: 36986,
              35043: 21307,
              35044: 20117,
              35045: 20133,
              35046: 22495,
              35047: 32946,
              35048: 37057,
              35049: 30959,
              35050: 19968,
              35051: 22769,
              35052: 28322,
              35053: 36920,
              35054: 31282,
              35055: 33576,
              35056: 33419,
              35057: 39983,
              35058: 20801,
              35059: 21360,
              35060: 21693,
              35061: 21729,
              35062: 22240,
              35063: 23035,
              35064: 24341,
              35065: 39154,
              35066: 28139,
              35067: 32996,
              35068: 34093,
              35136: 38498,
              35137: 38512,
              35138: 38560,
              35139: 38907,
              35140: 21515,
              35141: 21491,
              35142: 23431,
              35143: 28879,
              35144: 32701,
              35145: 36802,
              35146: 38632,
              35147: 21359,
              35148: 40284,
              35149: 31418,
              35150: 19985,
              35151: 30867,
              35152: 33276,
              35153: 28198,
              35154: 22040,
              35155: 21764,
              35156: 27421,
              35157: 34074,
              35158: 39995,
              35159: 23013,
              35160: 21417,
              35161: 28006,
              35162: 29916,
              35163: 38287,
              35164: 22082,
              35165: 20113,
              35166: 36939,
              35167: 38642,
              35168: 33615,
              35169: 39180,
              35170: 21473,
              35171: 21942,
              35172: 23344,
              35173: 24433,
              35174: 26144,
              35175: 26355,
              35176: 26628,
              35177: 27704,
              35178: 27891,
              35179: 27945,
              35180: 29787,
              35181: 30408,
              35182: 31310,
              35183: 38964,
              35184: 33521,
              35185: 34907,
              35186: 35424,
              35187: 37613,
              35188: 28082,
              35189: 30123,
              35190: 30410,
              35191: 39365,
              35192: 24742,
              35193: 35585,
              35194: 36234,
              35195: 38322,
              35196: 27022,
              35197: 21421,
              35198: 20870,
              35200: 22290,
              35201: 22576,
              35202: 22852,
              35203: 23476,
              35204: 24310,
              35205: 24616,
              35206: 25513,
              35207: 25588,
              35208: 27839,
              35209: 28436,
              35210: 28814,
              35211: 28948,
              35212: 29017,
              35213: 29141,
              35214: 29503,
              35215: 32257,
              35216: 33398,
              35217: 33489,
              35218: 34199,
              35219: 36960,
              35220: 37467,
              35221: 40219,
              35222: 22633,
              35223: 26044,
              35224: 27738,
              35225: 29989,
              35226: 20985,
              35227: 22830,
              35228: 22885,
              35229: 24448,
              35230: 24540,
              35231: 25276,
              35232: 26106,
              35233: 27178,
              35234: 27431,
              35235: 27572,
              35236: 29579,
              35237: 32705,
              35238: 35158,
              35239: 40236,
              35240: 40206,
              35241: 40644,
              35242: 23713,
              35243: 27798,
              35244: 33659,
              35245: 20740,
              35246: 23627,
              35247: 25014,
              35248: 33222,
              35249: 26742,
              35250: 29281,
              35251: 20057,
              35252: 20474,
              35253: 21368,
              35254: 24681,
              35255: 28201,
              35256: 31311,
              35257: 38899,
              35258: 19979,
              35259: 21270,
              35260: 20206,
              35261: 20309,
              35262: 20285,
              35263: 20385,
              35264: 20339,
              35265: 21152,
              35266: 21487,
              35267: 22025,
              35268: 22799,
              35269: 23233,
              35270: 23478,
              35271: 23521,
              35272: 31185,
              35273: 26247,
              35274: 26524,
              35275: 26550,
              35276: 27468,
              35277: 27827,
              35278: 28779,
              35279: 29634,
              35280: 31117,
              35281: 31166,
              35282: 31292,
              35283: 31623,
              35284: 33457,
              35285: 33499,
              35286: 33540,
              35287: 33655,
              35288: 33775,
              35289: 33747,
              35290: 34662,
              35291: 35506,
              35292: 22057,
              35293: 36008,
              35294: 36838,
              35295: 36942,
              35296: 38686,
              35297: 34442,
              35298: 20420,
              35299: 23784,
              35300: 25105,
              35301: 29273,
              35302: 30011,
              35303: 33253,
              35304: 33469,
              35305: 34558,
              35306: 36032,
              35307: 38597,
              35308: 39187,
              35309: 39381,
              35310: 20171,
              35311: 20250,
              35312: 35299,
              35313: 22238,
              35314: 22602,
              35315: 22730,
              35316: 24315,
              35317: 24555,
              35318: 24618,
              35319: 24724,
              35320: 24674,
              35321: 25040,
              35322: 25106,
              35323: 25296,
              35324: 25913,
              35392: 39745,
              35393: 26214,
              35394: 26800,
              35395: 28023,
              35396: 28784,
              35397: 30028,
              35398: 30342,
              35399: 32117,
              35400: 33445,
              35401: 34809,
              35402: 38283,
              35403: 38542,
              35404: 35997,
              35405: 20977,
              35406: 21182,
              35407: 22806,
              35408: 21683,
              35409: 23475,
              35410: 23830,
              35411: 24936,
              35412: 27010,
              35413: 28079,
              35414: 30861,
              35415: 33995,
              35416: 34903,
              35417: 35442,
              35418: 37799,
              35419: 39608,
              35420: 28012,
              35421: 39336,
              35422: 34521,
              35423: 22435,
              35424: 26623,
              35425: 34510,
              35426: 37390,
              35427: 21123,
              35428: 22151,
              35429: 21508,
              35430: 24275,
              35431: 25313,
              35432: 25785,
              35433: 26684,
              35434: 26680,
              35435: 27579,
              35436: 29554,
              35437: 30906,
              35438: 31339,
              35439: 35226,
              35440: 35282,
              35441: 36203,
              35442: 36611,
              35443: 37101,
              35444: 38307,
              35445: 38548,
              35446: 38761,
              35447: 23398,
              35448: 23731,
              35449: 27005,
              35450: 38989,
              35451: 38990,
              35452: 25499,
              35453: 31520,
              35454: 27179,
              35456: 27263,
              35457: 26806,
              35458: 39949,
              35459: 28511,
              35460: 21106,
              35461: 21917,
              35462: 24688,
              35463: 25324,
              35464: 27963,
              35465: 28167,
              35466: 28369,
              35467: 33883,
              35468: 35088,
              35469: 36676,
              35470: 19988,
              35471: 39993,
              35472: 21494,
              35473: 26907,
              35474: 27194,
              35475: 38788,
              35476: 26666,
              35477: 20828,
              35478: 31427,
              35479: 33970,
              35480: 37340,
              35481: 37772,
              35482: 22107,
              35483: 40232,
              35484: 26658,
              35485: 33541,
              35486: 33841,
              35487: 31909,
              35488: 21e3,
              35489: 33477,
              35490: 29926,
              35491: 20094,
              35492: 20355,
              35493: 20896,
              35494: 23506,
              35495: 21002,
              35496: 21208,
              35497: 21223,
              35498: 24059,
              35499: 21914,
              35500: 22570,
              35501: 23014,
              35502: 23436,
              35503: 23448,
              35504: 23515,
              35505: 24178,
              35506: 24185,
              35507: 24739,
              35508: 24863,
              35509: 24931,
              35510: 25022,
              35511: 25563,
              35512: 25954,
              35513: 26577,
              35514: 26707,
              35515: 26874,
              35516: 27454,
              35517: 27475,
              35518: 27735,
              35519: 28450,
              35520: 28567,
              35521: 28485,
              35522: 29872,
              35523: 29976,
              35524: 30435,
              35525: 30475,
              35526: 31487,
              35527: 31649,
              35528: 31777,
              35529: 32233,
              35530: 32566,
              35531: 32752,
              35532: 32925,
              35533: 33382,
              35534: 33694,
              35535: 35251,
              35536: 35532,
              35537: 36011,
              35538: 36996,
              35539: 37969,
              35540: 38291,
              35541: 38289,
              35542: 38306,
              35543: 38501,
              35544: 38867,
              35545: 39208,
              35546: 33304,
              35547: 20024,
              35548: 21547,
              35549: 23736,
              35550: 24012,
              35551: 29609,
              35552: 30284,
              35553: 30524,
              35554: 23721,
              35555: 32747,
              35556: 36107,
              35557: 38593,
              35558: 38929,
              35559: 38996,
              35560: 39e3,
              35561: 20225,
              35562: 20238,
              35563: 21361,
              35564: 21916,
              35565: 22120,
              35566: 22522,
              35567: 22855,
              35568: 23305,
              35569: 23492,
              35570: 23696,
              35571: 24076,
              35572: 24190,
              35573: 24524,
              35574: 25582,
              35575: 26426,
              35576: 26071,
              35577: 26082,
              35578: 26399,
              35579: 26827,
              35580: 26820,
              35648: 27231,
              35649: 24112,
              35650: 27589,
              35651: 27671,
              35652: 27773,
              35653: 30079,
              35654: 31048,
              35655: 23395,
              35656: 31232,
              35657: 32e3,
              35658: 24509,
              35659: 35215,
              35660: 35352,
              35661: 36020,
              35662: 36215,
              35663: 36556,
              35664: 36637,
              35665: 39138,
              35666: 39438,
              35667: 39740,
              35668: 20096,
              35669: 20605,
              35670: 20736,
              35671: 22931,
              35672: 23452,
              35673: 25135,
              35674: 25216,
              35675: 25836,
              35676: 27450,
              35677: 29344,
              35678: 30097,
              35679: 31047,
              35680: 32681,
              35681: 34811,
              35682: 35516,
              35683: 35696,
              35684: 25516,
              35685: 33738,
              35686: 38816,
              35687: 21513,
              35688: 21507,
              35689: 21931,
              35690: 26708,
              35691: 27224,
              35692: 35440,
              35693: 30759,
              35694: 26485,
              35695: 40653,
              35696: 21364,
              35697: 23458,
              35698: 33050,
              35699: 34384,
              35700: 36870,
              35701: 19992,
              35702: 20037,
              35703: 20167,
              35704: 20241,
              35705: 21450,
              35706: 21560,
              35707: 23470,
              35708: 24339,
              35709: 24613,
              35710: 25937,
              35712: 26429,
              35713: 27714,
              35714: 27762,
              35715: 27875,
              35716: 28792,
              35717: 29699,
              35718: 31350,
              35719: 31406,
              35720: 31496,
              35721: 32026,
              35722: 31998,
              35723: 32102,
              35724: 26087,
              35725: 29275,
              35726: 21435,
              35727: 23621,
              35728: 24040,
              35729: 25298,
              35730: 25312,
              35731: 25369,
              35732: 28192,
              35733: 34394,
              35734: 35377,
              35735: 36317,
              35736: 37624,
              35737: 28417,
              35738: 31142,
              35739: 39770,
              35740: 20136,
              35741: 20139,
              35742: 20140,
              35743: 20379,
              35744: 20384,
              35745: 20689,
              35746: 20807,
              35747: 31478,
              35748: 20849,
              35749: 20982,
              35750: 21332,
              35751: 21281,
              35752: 21375,
              35753: 21483,
              35754: 21932,
              35755: 22659,
              35756: 23777,
              35757: 24375,
              35758: 24394,
              35759: 24623,
              35760: 24656,
              35761: 24685,
              35762: 25375,
              35763: 25945,
              35764: 27211,
              35765: 27841,
              35766: 29378,
              35767: 29421,
              35768: 30703,
              35769: 33016,
              35770: 33029,
              35771: 33288,
              35772: 34126,
              35773: 37111,
              35774: 37857,
              35775: 38911,
              35776: 39255,
              35777: 39514,
              35778: 20208,
              35779: 20957,
              35780: 23597,
              35781: 26241,
              35782: 26989,
              35783: 23616,
              35784: 26354,
              35785: 26997,
              35786: 29577,
              35787: 26704,
              35788: 31873,
              35789: 20677,
              35790: 21220,
              35791: 22343,
              35792: 24062,
              35793: 37670,
              35794: 26020,
              35795: 27427,
              35796: 27453,
              35797: 29748,
              35798: 31105,
              35799: 31165,
              35800: 31563,
              35801: 32202,
              35802: 33465,
              35803: 33740,
              35804: 34943,
              35805: 35167,
              35806: 35641,
              35807: 36817,
              35808: 37329,
              35809: 21535,
              35810: 37504,
              35811: 20061,
              35812: 20534,
              35813: 21477,
              35814: 21306,
              35815: 29399,
              35816: 29590,
              35817: 30697,
              35818: 33510,
              35819: 36527,
              35820: 39366,
              35821: 39368,
              35822: 39378,
              35823: 20855,
              35824: 24858,
              35825: 34398,
              35826: 21936,
              35827: 31354,
              35828: 20598,
              35829: 23507,
              35830: 36935,
              35831: 38533,
              35832: 20018,
              35833: 27355,
              35834: 37351,
              35835: 23633,
              35836: 23624,
              35904: 25496,
              35905: 31391,
              35906: 27795,
              35907: 38772,
              35908: 36705,
              35909: 31402,
              35910: 29066,
              35911: 38536,
              35912: 31874,
              35913: 26647,
              35914: 32368,
              35915: 26705,
              35916: 37740,
              35917: 21234,
              35918: 21531,
              35919: 34219,
              35920: 35347,
              35921: 32676,
              35922: 36557,
              35923: 37089,
              35924: 21350,
              35925: 34952,
              35926: 31041,
              35927: 20418,
              35928: 20670,
              35929: 21009,
              35930: 20804,
              35931: 21843,
              35932: 22317,
              35933: 29674,
              35934: 22411,
              35935: 22865,
              35936: 24418,
              35937: 24452,
              35938: 24693,
              35939: 24950,
              35940: 24935,
              35941: 25001,
              35942: 25522,
              35943: 25658,
              35944: 25964,
              35945: 26223,
              35946: 26690,
              35947: 28179,
              35948: 30054,
              35949: 31293,
              35950: 31995,
              35951: 32076,
              35952: 32153,
              35953: 32331,
              35954: 32619,
              35955: 33550,
              35956: 33610,
              35957: 34509,
              35958: 35336,
              35959: 35427,
              35960: 35686,
              35961: 36605,
              35962: 38938,
              35963: 40335,
              35964: 33464,
              35965: 36814,
              35966: 39912,
              35968: 21127,
              35969: 25119,
              35970: 25731,
              35971: 28608,
              35972: 38553,
              35973: 26689,
              35974: 20625,
              35975: 27424,
              35976: 27770,
              35977: 28500,
              35978: 31348,
              35979: 32080,
              35980: 34880,
              35981: 35363,
              35982: 26376,
              35983: 20214,
              35984: 20537,
              35985: 20518,
              35986: 20581,
              35987: 20860,
              35988: 21048,
              35989: 21091,
              35990: 21927,
              35991: 22287,
              35992: 22533,
              35993: 23244,
              35994: 24314,
              35995: 25010,
              35996: 25080,
              35997: 25331,
              35998: 25458,
              35999: 26908,
              36e3: 27177,
              36001: 29309,
              36002: 29356,
              36003: 29486,
              36004: 30740,
              36005: 30831,
              36006: 32121,
              36007: 30476,
              36008: 32937,
              36009: 35211,
              36010: 35609,
              36011: 36066,
              36012: 36562,
              36013: 36963,
              36014: 37749,
              36015: 38522,
              36016: 38997,
              36017: 39443,
              36018: 40568,
              36019: 20803,
              36020: 21407,
              36021: 21427,
              36022: 24187,
              36023: 24358,
              36024: 28187,
              36025: 28304,
              36026: 29572,
              36027: 29694,
              36028: 32067,
              36029: 33335,
              36030: 35328,
              36031: 35578,
              36032: 38480,
              36033: 20046,
              36034: 20491,
              36035: 21476,
              36036: 21628,
              36037: 22266,
              36038: 22993,
              36039: 23396,
              36040: 24049,
              36041: 24235,
              36042: 24359,
              36043: 25144,
              36044: 25925,
              36045: 26543,
              36046: 28246,
              36047: 29392,
              36048: 31946,
              36049: 34996,
              36050: 32929,
              36051: 32993,
              36052: 33776,
              36053: 34382,
              36054: 35463,
              36055: 36328,
              36056: 37431,
              36057: 38599,
              36058: 39015,
              36059: 40723,
              36060: 20116,
              36061: 20114,
              36062: 20237,
              36063: 21320,
              36064: 21577,
              36065: 21566,
              36066: 23087,
              36067: 24460,
              36068: 24481,
              36069: 24735,
              36070: 26791,
              36071: 27278,
              36072: 29786,
              36073: 30849,
              36074: 35486,
              36075: 35492,
              36076: 35703,
              36077: 37264,
              36078: 20062,
              36079: 39881,
              36080: 20132,
              36081: 20348,
              36082: 20399,
              36083: 20505,
              36084: 20502,
              36085: 20809,
              36086: 20844,
              36087: 21151,
              36088: 21177,
              36089: 21246,
              36090: 21402,
              36091: 21475,
              36092: 21521,
              36160: 21518,
              36161: 21897,
              36162: 22353,
              36163: 22434,
              36164: 22909,
              36165: 23380,
              36166: 23389,
              36167: 23439,
              36168: 24037,
              36169: 24039,
              36170: 24055,
              36171: 24184,
              36172: 24195,
              36173: 24218,
              36174: 24247,
              36175: 24344,
              36176: 24658,
              36177: 24908,
              36178: 25239,
              36179: 25304,
              36180: 25511,
              36181: 25915,
              36182: 26114,
              36183: 26179,
              36184: 26356,
              36185: 26477,
              36186: 26657,
              36187: 26775,
              36188: 27083,
              36189: 27743,
              36190: 27946,
              36191: 28009,
              36192: 28207,
              36193: 28317,
              36194: 30002,
              36195: 30343,
              36196: 30828,
              36197: 31295,
              36198: 31968,
              36199: 32005,
              36200: 32024,
              36201: 32094,
              36202: 32177,
              36203: 32789,
              36204: 32771,
              36205: 32943,
              36206: 32945,
              36207: 33108,
              36208: 33167,
              36209: 33322,
              36210: 33618,
              36211: 34892,
              36212: 34913,
              36213: 35611,
              36214: 36002,
              36215: 36092,
              36216: 37066,
              36217: 37237,
              36218: 37489,
              36219: 30783,
              36220: 37628,
              36221: 38308,
              36222: 38477,
              36224: 38917,
              36225: 39321,
              36226: 39640,
              36227: 40251,
              36228: 21083,
              36229: 21163,
              36230: 21495,
              36231: 21512,
              36232: 22741,
              36233: 25335,
              36234: 28640,
              36235: 35946,
              36236: 36703,
              36237: 40633,
              36238: 20811,
              36239: 21051,
              36240: 21578,
              36241: 22269,
              36242: 31296,
              36243: 37239,
              36244: 40288,
              36245: 40658,
              36246: 29508,
              36247: 28425,
              36248: 33136,
              36249: 29969,
              36250: 24573,
              36251: 24794,
              36252: 39592,
              36253: 29403,
              36254: 36796,
              36255: 27492,
              36256: 38915,
              36257: 20170,
              36258: 22256,
              36259: 22372,
              36260: 22718,
              36261: 23130,
              36262: 24680,
              36263: 25031,
              36264: 26127,
              36265: 26118,
              36266: 26681,
              36267: 26801,
              36268: 28151,
              36269: 30165,
              36270: 32058,
              36271: 33390,
              36272: 39746,
              36273: 20123,
              36274: 20304,
              36275: 21449,
              36276: 21766,
              36277: 23919,
              36278: 24038,
              36279: 24046,
              36280: 26619,
              36281: 27801,
              36282: 29811,
              36283: 30722,
              36284: 35408,
              36285: 37782,
              36286: 35039,
              36287: 22352,
              36288: 24231,
              36289: 25387,
              36290: 20661,
              36291: 20652,
              36292: 20877,
              36293: 26368,
              36294: 21705,
              36295: 22622,
              36296: 22971,
              36297: 23472,
              36298: 24425,
              36299: 25165,
              36300: 25505,
              36301: 26685,
              36302: 27507,
              36303: 28168,
              36304: 28797,
              36305: 37319,
              36306: 29312,
              36307: 30741,
              36308: 30758,
              36309: 31085,
              36310: 25998,
              36311: 32048,
              36312: 33756,
              36313: 35009,
              36314: 36617,
              36315: 38555,
              36316: 21092,
              36317: 22312,
              36318: 26448,
              36319: 32618,
              36320: 36001,
              36321: 20916,
              36322: 22338,
              36323: 38442,
              36324: 22586,
              36325: 27018,
              36326: 32948,
              36327: 21682,
              36328: 23822,
              36329: 22524,
              36330: 30869,
              36331: 40442,
              36332: 20316,
              36333: 21066,
              36334: 21643,
              36335: 25662,
              36336: 26152,
              36337: 26388,
              36338: 26613,
              36339: 31364,
              36340: 31574,
              36341: 32034,
              36342: 37679,
              36343: 26716,
              36344: 39853,
              36345: 31545,
              36346: 21273,
              36347: 20874,
              36348: 21047,
              36416: 23519,
              36417: 25334,
              36418: 25774,
              36419: 25830,
              36420: 26413,
              36421: 27578,
              36422: 34217,
              36423: 38609,
              36424: 30352,
              36425: 39894,
              36426: 25420,
              36427: 37638,
              36428: 39851,
              36429: 30399,
              36430: 26194,
              36431: 19977,
              36432: 20632,
              36433: 21442,
              36434: 23665,
              36435: 24808,
              36436: 25746,
              36437: 25955,
              36438: 26719,
              36439: 29158,
              36440: 29642,
              36441: 29987,
              36442: 31639,
              36443: 32386,
              36444: 34453,
              36445: 35715,
              36446: 36059,
              36447: 37240,
              36448: 39184,
              36449: 26028,
              36450: 26283,
              36451: 27531,
              36452: 20181,
              36453: 20180,
              36454: 20282,
              36455: 20351,
              36456: 21050,
              36457: 21496,
              36458: 21490,
              36459: 21987,
              36460: 22235,
              36461: 22763,
              36462: 22987,
              36463: 22985,
              36464: 23039,
              36465: 23376,
              36466: 23629,
              36467: 24066,
              36468: 24107,
              36469: 24535,
              36470: 24605,
              36471: 25351,
              36472: 25903,
              36473: 23388,
              36474: 26031,
              36475: 26045,
              36476: 26088,
              36477: 26525,
              36478: 27490,
              36480: 27515,
              36481: 27663,
              36482: 29509,
              36483: 31049,
              36484: 31169,
              36485: 31992,
              36486: 32025,
              36487: 32043,
              36488: 32930,
              36489: 33026,
              36490: 33267,
              36491: 35222,
              36492: 35422,
              36493: 35433,
              36494: 35430,
              36495: 35468,
              36496: 35566,
              36497: 36039,
              36498: 36060,
              36499: 38604,
              36500: 39164,
              36501: 27503,
              36502: 20107,
              36503: 20284,
              36504: 20365,
              36505: 20816,
              36506: 23383,
              36507: 23546,
              36508: 24904,
              36509: 25345,
              36510: 26178,
              36511: 27425,
              36512: 28363,
              36513: 27835,
              36514: 29246,
              36515: 29885,
              36516: 30164,
              36517: 30913,
              36518: 31034,
              36519: 32780,
              36520: 32819,
              36521: 33258,
              36522: 33940,
              36523: 36766,
              36524: 27728,
              36525: 40575,
              36526: 24335,
              36527: 35672,
              36528: 40235,
              36529: 31482,
              36530: 36600,
              36531: 23437,
              36532: 38635,
              36533: 19971,
              36534: 21489,
              36535: 22519,
              36536: 22833,
              36537: 23241,
              36538: 23460,
              36539: 24713,
              36540: 28287,
              36541: 28422,
              36542: 30142,
              36543: 36074,
              36544: 23455,
              36545: 34048,
              36546: 31712,
              36547: 20594,
              36548: 26612,
              36549: 33437,
              36550: 23649,
              36551: 34122,
              36552: 32286,
              36553: 33294,
              36554: 20889,
              36555: 23556,
              36556: 25448,
              36557: 36198,
              36558: 26012,
              36559: 29038,
              36560: 31038,
              36561: 32023,
              36562: 32773,
              36563: 35613,
              36564: 36554,
              36565: 36974,
              36566: 34503,
              36567: 37034,
              36568: 20511,
              36569: 21242,
              36570: 23610,
              36571: 26451,
              36572: 28796,
              36573: 29237,
              36574: 37196,
              36575: 37320,
              36576: 37675,
              36577: 33509,
              36578: 23490,
              36579: 24369,
              36580: 24825,
              36581: 20027,
              36582: 21462,
              36583: 23432,
              36584: 25163,
              36585: 26417,
              36586: 27530,
              36587: 29417,
              36588: 29664,
              36589: 31278,
              36590: 33131,
              36591: 36259,
              36592: 37202,
              36593: 39318,
              36594: 20754,
              36595: 21463,
              36596: 21610,
              36597: 23551,
              36598: 25480,
              36599: 27193,
              36600: 32172,
              36601: 38656,
              36602: 22234,
              36603: 21454,
              36604: 21608,
              36672: 23447,
              36673: 23601,
              36674: 24030,
              36675: 20462,
              36676: 24833,
              36677: 25342,
              36678: 27954,
              36679: 31168,
              36680: 31179,
              36681: 32066,
              36682: 32333,
              36683: 32722,
              36684: 33261,
              36685: 33311,
              36686: 33936,
              36687: 34886,
              36688: 35186,
              36689: 35728,
              36690: 36468,
              36691: 36655,
              36692: 36913,
              36693: 37195,
              36694: 37228,
              36695: 38598,
              36696: 37276,
              36697: 20160,
              36698: 20303,
              36699: 20805,
              36700: 21313,
              36701: 24467,
              36702: 25102,
              36703: 26580,
              36704: 27713,
              36705: 28171,
              36706: 29539,
              36707: 32294,
              36708: 37325,
              36709: 37507,
              36710: 21460,
              36711: 22809,
              36712: 23487,
              36713: 28113,
              36714: 31069,
              36715: 32302,
              36716: 31899,
              36717: 22654,
              36718: 29087,
              36719: 20986,
              36720: 34899,
              36721: 36848,
              36722: 20426,
              36723: 23803,
              36724: 26149,
              36725: 30636,
              36726: 31459,
              36727: 33308,
              36728: 39423,
              36729: 20934,
              36730: 24490,
              36731: 26092,
              36732: 26991,
              36733: 27529,
              36734: 28147,
              36736: 28310,
              36737: 28516,
              36738: 30462,
              36739: 32020,
              36740: 24033,
              36741: 36981,
              36742: 37255,
              36743: 38918,
              36744: 20966,
              36745: 21021,
              36746: 25152,
              36747: 26257,
              36748: 26329,
              36749: 28186,
              36750: 24246,
              36751: 32210,
              36752: 32626,
              36753: 26360,
              36754: 34223,
              36755: 34295,
              36756: 35576,
              36757: 21161,
              36758: 21465,
              36759: 22899,
              36760: 24207,
              36761: 24464,
              36762: 24661,
              36763: 37604,
              36764: 38500,
              36765: 20663,
              36766: 20767,
              36767: 21213,
              36768: 21280,
              36769: 21319,
              36770: 21484,
              36771: 21736,
              36772: 21830,
              36773: 21809,
              36774: 22039,
              36775: 22888,
              36776: 22974,
              36777: 23100,
              36778: 23477,
              36779: 23558,
              36780: 23567,
              36781: 23569,
              36782: 23578,
              36783: 24196,
              36784: 24202,
              36785: 24288,
              36786: 24432,
              36787: 25215,
              36788: 25220,
              36789: 25307,
              36790: 25484,
              36791: 25463,
              36792: 26119,
              36793: 26124,
              36794: 26157,
              36795: 26230,
              36796: 26494,
              36797: 26786,
              36798: 27167,
              36799: 27189,
              36800: 27836,
              36801: 28040,
              36802: 28169,
              36803: 28248,
              36804: 28988,
              36805: 28966,
              36806: 29031,
              36807: 30151,
              36808: 30465,
              36809: 30813,
              36810: 30977,
              36811: 31077,
              36812: 31216,
              36813: 31456,
              36814: 31505,
              36815: 31911,
              36816: 32057,
              36817: 32918,
              36818: 33750,
              36819: 33931,
              36820: 34121,
              36821: 34909,
              36822: 35059,
              36823: 35359,
              36824: 35388,
              36825: 35412,
              36826: 35443,
              36827: 35937,
              36828: 36062,
              36829: 37284,
              36830: 37478,
              36831: 37758,
              36832: 37912,
              36833: 38556,
              36834: 38808,
              36835: 19978,
              36836: 19976,
              36837: 19998,
              36838: 20055,
              36839: 20887,
              36840: 21104,
              36841: 22478,
              36842: 22580,
              36843: 22732,
              36844: 23330,
              36845: 24120,
              36846: 24773,
              36847: 25854,
              36848: 26465,
              36849: 26454,
              36850: 27972,
              36851: 29366,
              36852: 30067,
              36853: 31331,
              36854: 33976,
              36855: 35698,
              36856: 37304,
              36857: 37664,
              36858: 22065,
              36859: 22516,
              36860: 39166,
              36928: 25325,
              36929: 26893,
              36930: 27542,
              36931: 29165,
              36932: 32340,
              36933: 32887,
              36934: 33394,
              36935: 35302,
              36936: 39135,
              36937: 34645,
              36938: 36785,
              36939: 23611,
              36940: 20280,
              36941: 20449,
              36942: 20405,
              36943: 21767,
              36944: 23072,
              36945: 23517,
              36946: 23529,
              36947: 24515,
              36948: 24910,
              36949: 25391,
              36950: 26032,
              36951: 26187,
              36952: 26862,
              36953: 27035,
              36954: 28024,
              36955: 28145,
              36956: 30003,
              36957: 30137,
              36958: 30495,
              36959: 31070,
              36960: 31206,
              36961: 32051,
              36962: 33251,
              36963: 33455,
              36964: 34218,
              36965: 35242,
              36966: 35386,
              36967: 36523,
              36968: 36763,
              36969: 36914,
              36970: 37341,
              36971: 38663,
              36972: 20154,
              36973: 20161,
              36974: 20995,
              36975: 22645,
              36976: 22764,
              36977: 23563,
              36978: 29978,
              36979: 23613,
              36980: 33102,
              36981: 35338,
              36982: 36805,
              36983: 38499,
              36984: 38765,
              36985: 31525,
              36986: 35535,
              36987: 38920,
              36988: 37218,
              36989: 22259,
              36990: 21416,
              36992: 36887,
              36993: 21561,
              36994: 22402,
              36995: 24101,
              36996: 25512,
              36997: 27700,
              36998: 28810,
              36999: 30561,
              37e3: 31883,
              37001: 32736,
              37002: 34928,
              37003: 36930,
              37004: 37204,
              37005: 37648,
              37006: 37656,
              37007: 38543,
              37008: 29790,
              37009: 39620,
              37010: 23815,
              37011: 23913,
              37012: 25968,
              37013: 26530,
              37014: 36264,
              37015: 38619,
              37016: 25454,
              37017: 26441,
              37018: 26905,
              37019: 33733,
              37020: 38935,
              37021: 38592,
              37022: 35070,
              37023: 28548,
              37024: 25722,
              37025: 23544,
              37026: 19990,
              37027: 28716,
              37028: 30045,
              37029: 26159,
              37030: 20932,
              37031: 21046,
              37032: 21218,
              37033: 22995,
              37034: 24449,
              37035: 24615,
              37036: 25104,
              37037: 25919,
              37038: 25972,
              37039: 26143,
              37040: 26228,
              37041: 26866,
              37042: 26646,
              37043: 27491,
              37044: 28165,
              37045: 29298,
              37046: 29983,
              37047: 30427,
              37048: 31934,
              37049: 32854,
              37050: 22768,
              37051: 35069,
              37052: 35199,
              37053: 35488,
              37054: 35475,
              37055: 35531,
              37056: 36893,
              37057: 37266,
              37058: 38738,
              37059: 38745,
              37060: 25993,
              37061: 31246,
              37062: 33030,
              37063: 38587,
              37064: 24109,
              37065: 24796,
              37066: 25114,
              37067: 26021,
              37068: 26132,
              37069: 26512,
              37070: 30707,
              37071: 31309,
              37072: 31821,
              37073: 32318,
              37074: 33034,
              37075: 36012,
              37076: 36196,
              37077: 36321,
              37078: 36447,
              37079: 30889,
              37080: 20999,
              37081: 25305,
              37082: 25509,
              37083: 25666,
              37084: 25240,
              37085: 35373,
              37086: 31363,
              37087: 31680,
              37088: 35500,
              37089: 38634,
              37090: 32118,
              37091: 33292,
              37092: 34633,
              37093: 20185,
              37094: 20808,
              37095: 21315,
              37096: 21344,
              37097: 23459,
              37098: 23554,
              37099: 23574,
              37100: 24029,
              37101: 25126,
              37102: 25159,
              37103: 25776,
              37104: 26643,
              37105: 26676,
              37106: 27849,
              37107: 27973,
              37108: 27927,
              37109: 26579,
              37110: 28508,
              37111: 29006,
              37112: 29053,
              37113: 26059,
              37114: 31359,
              37115: 31661,
              37116: 32218,
              37184: 32330,
              37185: 32680,
              37186: 33146,
              37187: 33307,
              37188: 33337,
              37189: 34214,
              37190: 35438,
              37191: 36046,
              37192: 36341,
              37193: 36984,
              37194: 36983,
              37195: 37549,
              37196: 37521,
              37197: 38275,
              37198: 39854,
              37199: 21069,
              37200: 21892,
              37201: 28472,
              37202: 28982,
              37203: 20840,
              37204: 31109,
              37205: 32341,
              37206: 33203,
              37207: 31950,
              37208: 22092,
              37209: 22609,
              37210: 23720,
              37211: 25514,
              37212: 26366,
              37213: 26365,
              37214: 26970,
              37215: 29401,
              37216: 30095,
              37217: 30094,
              37218: 30990,
              37219: 31062,
              37220: 31199,
              37221: 31895,
              37222: 32032,
              37223: 32068,
              37224: 34311,
              37225: 35380,
              37226: 38459,
              37227: 36961,
              37228: 40736,
              37229: 20711,
              37230: 21109,
              37231: 21452,
              37232: 21474,
              37233: 20489,
              37234: 21930,
              37235: 22766,
              37236: 22863,
              37237: 29245,
              37238: 23435,
              37239: 23652,
              37240: 21277,
              37241: 24803,
              37242: 24819,
              37243: 25436,
              37244: 25475,
              37245: 25407,
              37246: 25531,
              37248: 25805,
              37249: 26089,
              37250: 26361,
              37251: 24035,
              37252: 27085,
              37253: 27133,
              37254: 28437,
              37255: 29157,
              37256: 20105,
              37257: 30185,
              37258: 30456,
              37259: 31379,
              37260: 31967,
              37261: 32207,
              37262: 32156,
              37263: 32865,
              37264: 33609,
              37265: 33624,
              37266: 33900,
              37267: 33980,
              37268: 34299,
              37269: 35013,
              37270: 36208,
              37271: 36865,
              37272: 36973,
              37273: 37783,
              37274: 38684,
              37275: 39442,
              37276: 20687,
              37277: 22679,
              37278: 24974,
              37279: 33235,
              37280: 34101,
              37281: 36104,
              37282: 36896,
              37283: 20419,
              37284: 20596,
              37285: 21063,
              37286: 21363,
              37287: 24687,
              37288: 25417,
              37289: 26463,
              37290: 28204,
              37291: 36275,
              37292: 36895,
              37293: 20439,
              37294: 23646,
              37295: 36042,
              37296: 26063,
              37297: 32154,
              37298: 21330,
              37299: 34966,
              37300: 20854,
              37301: 25539,
              37302: 23384,
              37303: 23403,
              37304: 23562,
              37305: 25613,
              37306: 26449,
              37307: 36956,
              37308: 20182,
              37309: 22810,
              37310: 22826,
              37311: 27760,
              37312: 35409,
              37313: 21822,
              37314: 22549,
              37315: 22949,
              37316: 24816,
              37317: 25171,
              37318: 26561,
              37319: 33333,
              37320: 26965,
              37321: 38464,
              37322: 39364,
              37323: 39464,
              37324: 20307,
              37325: 22534,
              37326: 23550,
              37327: 32784,
              37328: 23729,
              37329: 24111,
              37330: 24453,
              37331: 24608,
              37332: 24907,
              37333: 25140,
              37334: 26367,
              37335: 27888,
              37336: 28382,
              37337: 32974,
              37338: 33151,
              37339: 33492,
              37340: 34955,
              37341: 36024,
              37342: 36864,
              37343: 36910,
              37344: 38538,
              37345: 40667,
              37346: 39899,
              37347: 20195,
              37348: 21488,
              37349: 22823,
              37350: 31532,
              37351: 37261,
              37352: 38988,
              37353: 40441,
              37354: 28381,
              37355: 28711,
              37356: 21331,
              37357: 21828,
              37358: 23429,
              37359: 25176,
              37360: 25246,
              37361: 25299,
              37362: 27810,
              37363: 28655,
              37364: 29730,
              37365: 35351,
              37366: 37944,
              37367: 28609,
              37368: 35582,
              37369: 33592,
              37370: 20967,
              37371: 34552,
              37372: 21482,
              37440: 21481,
              37441: 20294,
              37442: 36948,
              37443: 36784,
              37444: 22890,
              37445: 33073,
              37446: 24061,
              37447: 31466,
              37448: 36799,
              37449: 26842,
              37450: 35895,
              37451: 29432,
              37452: 40008,
              37453: 27197,
              37454: 35504,
              37455: 20025,
              37456: 21336,
              37457: 22022,
              37458: 22374,
              37459: 25285,
              37460: 25506,
              37461: 26086,
              37462: 27470,
              37463: 28129,
              37464: 28251,
              37465: 28845,
              37466: 30701,
              37467: 31471,
              37468: 31658,
              37469: 32187,
              37470: 32829,
              37471: 32966,
              37472: 34507,
              37473: 35477,
              37474: 37723,
              37475: 22243,
              37476: 22727,
              37477: 24382,
              37478: 26029,
              37479: 26262,
              37480: 27264,
              37481: 27573,
              37482: 30007,
              37483: 35527,
              37484: 20516,
              37485: 30693,
              37486: 22320,
              37487: 24347,
              37488: 24677,
              37489: 26234,
              37490: 27744,
              37491: 30196,
              37492: 31258,
              37493: 32622,
              37494: 33268,
              37495: 34584,
              37496: 36933,
              37497: 39347,
              37498: 31689,
              37499: 30044,
              37500: 31481,
              37501: 31569,
              37502: 33988,
              37504: 36880,
              37505: 31209,
              37506: 31378,
              37507: 33590,
              37508: 23265,
              37509: 30528,
              37510: 20013,
              37511: 20210,
              37512: 23449,
              37513: 24544,
              37514: 25277,
              37515: 26172,
              37516: 26609,
              37517: 27880,
              37518: 34411,
              37519: 34935,
              37520: 35387,
              37521: 37198,
              37522: 37619,
              37523: 39376,
              37524: 27159,
              37525: 28710,
              37526: 29482,
              37527: 33511,
              37528: 33879,
              37529: 36015,
              37530: 19969,
              37531: 20806,
              37532: 20939,
              37533: 21899,
              37534: 23541,
              37535: 24086,
              37536: 24115,
              37537: 24193,
              37538: 24340,
              37539: 24373,
              37540: 24427,
              37541: 24500,
              37542: 25074,
              37543: 25361,
              37544: 26274,
              37545: 26397,
              37546: 28526,
              37547: 29266,
              37548: 30010,
              37549: 30522,
              37550: 32884,
              37551: 33081,
              37552: 33144,
              37553: 34678,
              37554: 35519,
              37555: 35548,
              37556: 36229,
              37557: 36339,
              37558: 37530,
              37559: 38263,
              37560: 38914,
              37561: 40165,
              37562: 21189,
              37563: 25431,
              37564: 30452,
              37565: 26389,
              37566: 27784,
              37567: 29645,
              37568: 36035,
              37569: 37806,
              37570: 38515,
              37571: 27941,
              37572: 22684,
              37573: 26894,
              37574: 27084,
              37575: 36861,
              37576: 37786,
              37577: 30171,
              37578: 36890,
              37579: 22618,
              37580: 26626,
              37581: 25524,
              37582: 27131,
              37583: 20291,
              37584: 28460,
              37585: 26584,
              37586: 36795,
              37587: 34086,
              37588: 32180,
              37589: 37716,
              37590: 26943,
              37591: 28528,
              37592: 22378,
              37593: 22775,
              37594: 23340,
              37595: 32044,
              37596: 29226,
              37597: 21514,
              37598: 37347,
              37599: 40372,
              37600: 20141,
              37601: 20302,
              37602: 20572,
              37603: 20597,
              37604: 21059,
              37605: 35998,
              37606: 21576,
              37607: 22564,
              37608: 23450,
              37609: 24093,
              37610: 24213,
              37611: 24237,
              37612: 24311,
              37613: 24351,
              37614: 24716,
              37615: 25269,
              37616: 25402,
              37617: 25552,
              37618: 26799,
              37619: 27712,
              37620: 30855,
              37621: 31118,
              37622: 31243,
              37623: 32224,
              37624: 33351,
              37625: 35330,
              37626: 35558,
              37627: 36420,
              37628: 36883,
              37696: 37048,
              37697: 37165,
              37698: 37336,
              37699: 40718,
              37700: 27877,
              37701: 25688,
              37702: 25826,
              37703: 25973,
              37704: 28404,
              37705: 30340,
              37706: 31515,
              37707: 36969,
              37708: 37841,
              37709: 28346,
              37710: 21746,
              37711: 24505,
              37712: 25764,
              37713: 36685,
              37714: 36845,
              37715: 37444,
              37716: 20856,
              37717: 22635,
              37718: 22825,
              37719: 23637,
              37720: 24215,
              37721: 28155,
              37722: 32399,
              37723: 29980,
              37724: 36028,
              37725: 36578,
              37726: 39003,
              37727: 28857,
              37728: 20253,
              37729: 27583,
              37730: 28593,
              37731: 3e4,
              37732: 38651,
              37733: 20814,
              37734: 21520,
              37735: 22581,
              37736: 22615,
              37737: 22956,
              37738: 23648,
              37739: 24466,
              37740: 26007,
              37741: 26460,
              37742: 28193,
              37743: 30331,
              37744: 33759,
              37745: 36077,
              37746: 36884,
              37747: 37117,
              37748: 37709,
              37749: 30757,
              37750: 30778,
              37751: 21162,
              37752: 24230,
              37753: 22303,
              37754: 22900,
              37755: 24594,
              37756: 20498,
              37757: 20826,
              37758: 20908,
              37760: 20941,
              37761: 20992,
              37762: 21776,
              37763: 22612,
              37764: 22616,
              37765: 22871,
              37766: 23445,
              37767: 23798,
              37768: 23947,
              37769: 24764,
              37770: 25237,
              37771: 25645,
              37772: 26481,
              37773: 26691,
              37774: 26812,
              37775: 26847,
              37776: 30423,
              37777: 28120,
              37778: 28271,
              37779: 28059,
              37780: 28783,
              37781: 29128,
              37782: 24403,
              37783: 30168,
              37784: 31095,
              37785: 31561,
              37786: 31572,
              37787: 31570,
              37788: 31958,
              37789: 32113,
              37790: 21040,
              37791: 33891,
              37792: 34153,
              37793: 34276,
              37794: 35342,
              37795: 35588,
              37796: 35910,
              37797: 36367,
              37798: 36867,
              37799: 36879,
              37800: 37913,
              37801: 38518,
              37802: 38957,
              37803: 39472,
              37804: 38360,
              37805: 20685,
              37806: 21205,
              37807: 21516,
              37808: 22530,
              37809: 23566,
              37810: 24999,
              37811: 25758,
              37812: 27934,
              37813: 30643,
              37814: 31461,
              37815: 33012,
              37816: 33796,
              37817: 36947,
              37818: 37509,
              37819: 23776,
              37820: 40199,
              37821: 21311,
              37822: 24471,
              37823: 24499,
              37824: 28060,
              37825: 29305,
              37826: 30563,
              37827: 31167,
              37828: 31716,
              37829: 27602,
              37830: 29420,
              37831: 35501,
              37832: 26627,
              37833: 27233,
              37834: 20984,
              37835: 31361,
              37836: 26932,
              37837: 23626,
              37838: 40182,
              37839: 33515,
              37840: 23493,
              37841: 37193,
              37842: 28702,
              37843: 22136,
              37844: 23663,
              37845: 24775,
              37846: 25958,
              37847: 27788,
              37848: 35930,
              37849: 36929,
              37850: 38931,
              37851: 21585,
              37852: 26311,
              37853: 37389,
              37854: 22856,
              37855: 37027,
              37856: 20869,
              37857: 20045,
              37858: 20970,
              37859: 34201,
              37860: 35598,
              37861: 28760,
              37862: 25466,
              37863: 37707,
              37864: 26978,
              37865: 39348,
              37866: 32260,
              37867: 30071,
              37868: 21335,
              37869: 26976,
              37870: 36575,
              37871: 38627,
              37872: 27741,
              37873: 20108,
              37874: 23612,
              37875: 24336,
              37876: 36841,
              37877: 21250,
              37878: 36049,
              37879: 32905,
              37880: 34425,
              37881: 24319,
              37882: 26085,
              37883: 20083,
              37884: 20837,
              37952: 22914,
              37953: 23615,
              37954: 38894,
              37955: 20219,
              37956: 22922,
              37957: 24525,
              37958: 35469,
              37959: 28641,
              37960: 31152,
              37961: 31074,
              37962: 23527,
              37963: 33905,
              37964: 29483,
              37965: 29105,
              37966: 24180,
              37967: 24565,
              37968: 25467,
              37969: 25754,
              37970: 29123,
              37971: 31896,
              37972: 20035,
              37973: 24316,
              37974: 20043,
              37975: 22492,
              37976: 22178,
              37977: 24745,
              37978: 28611,
              37979: 32013,
              37980: 33021,
              37981: 33075,
              37982: 33215,
              37983: 36786,
              37984: 35223,
              37985: 34468,
              37986: 24052,
              37987: 25226,
              37988: 25773,
              37989: 35207,
              37990: 26487,
              37991: 27874,
              37992: 27966,
              37993: 29750,
              37994: 30772,
              37995: 23110,
              37996: 32629,
              37997: 33453,
              37998: 39340,
              37999: 20467,
              38e3: 24259,
              38001: 25309,
              38002: 25490,
              38003: 25943,
              38004: 26479,
              38005: 30403,
              38006: 29260,
              38007: 32972,
              38008: 32954,
              38009: 36649,
              38010: 37197,
              38011: 20493,
              38012: 22521,
              38013: 23186,
              38014: 26757,
              38016: 26995,
              38017: 29028,
              38018: 29437,
              38019: 36023,
              38020: 22770,
              38021: 36064,
              38022: 38506,
              38023: 36889,
              38024: 34687,
              38025: 31204,
              38026: 30695,
              38027: 33833,
              38028: 20271,
              38029: 21093,
              38030: 21338,
              38031: 25293,
              38032: 26575,
              38033: 27850,
              38034: 30333,
              38035: 31636,
              38036: 31893,
              38037: 33334,
              38038: 34180,
              38039: 36843,
              38040: 26333,
              38041: 28448,
              38042: 29190,
              38043: 32283,
              38044: 33707,
              38045: 39361,
              38046: 40614,
              38047: 20989,
              38048: 31665,
              38049: 30834,
              38050: 31672,
              38051: 32903,
              38052: 31560,
              38053: 27368,
              38054: 24161,
              38055: 32908,
              38056: 30033,
              38057: 30048,
              38058: 20843,
              38059: 37474,
              38060: 28300,
              38061: 30330,
              38062: 37271,
              38063: 39658,
              38064: 20240,
              38065: 32624,
              38066: 25244,
              38067: 31567,
              38068: 38309,
              38069: 40169,
              38070: 22138,
              38071: 22617,
              38072: 34532,
              38073: 38588,
              38074: 20276,
              38075: 21028,
              38076: 21322,
              38077: 21453,
              38078: 21467,
              38079: 24070,
              38080: 25644,
              38081: 26001,
              38082: 26495,
              38083: 27710,
              38084: 27726,
              38085: 29256,
              38086: 29359,
              38087: 29677,
              38088: 30036,
              38089: 32321,
              38090: 33324,
              38091: 34281,
              38092: 36009,
              38093: 31684,
              38094: 37318,
              38095: 29033,
              38096: 38930,
              38097: 39151,
              38098: 25405,
              38099: 26217,
              38100: 30058,
              38101: 30436,
              38102: 30928,
              38103: 34115,
              38104: 34542,
              38105: 21290,
              38106: 21329,
              38107: 21542,
              38108: 22915,
              38109: 24199,
              38110: 24444,
              38111: 24754,
              38112: 25161,
              38113: 25209,
              38114: 25259,
              38115: 26e3,
              38116: 27604,
              38117: 27852,
              38118: 30130,
              38119: 30382,
              38120: 30865,
              38121: 31192,
              38122: 32203,
              38123: 32631,
              38124: 32933,
              38125: 34987,
              38126: 35513,
              38127: 36027,
              38128: 36991,
              38129: 38750,
              38130: 39131,
              38131: 27147,
              38132: 31800,
              38133: 20633,
              38134: 23614,
              38135: 24494,
              38136: 26503,
              38137: 27608,
              38138: 29749,
              38139: 30473,
              38140: 32654,
              38208: 40763,
              38209: 26570,
              38210: 31255,
              38211: 21305,
              38212: 30091,
              38213: 39661,
              38214: 24422,
              38215: 33181,
              38216: 33777,
              38217: 32920,
              38218: 24380,
              38219: 24517,
              38220: 30050,
              38221: 31558,
              38222: 36924,
              38223: 26727,
              38224: 23019,
              38225: 23195,
              38226: 32016,
              38227: 30334,
              38228: 35628,
              38229: 20469,
              38230: 24426,
              38231: 27161,
              38232: 27703,
              38233: 28418,
              38234: 29922,
              38235: 31080,
              38236: 34920,
              38237: 35413,
              38238: 35961,
              38239: 24287,
              38240: 25551,
              38241: 30149,
              38242: 31186,
              38243: 33495,
              38244: 37672,
              38245: 37618,
              38246: 33948,
              38247: 34541,
              38248: 39981,
              38249: 21697,
              38250: 24428,
              38251: 25996,
              38252: 27996,
              38253: 28693,
              38254: 36007,
              38255: 36051,
              38256: 38971,
              38257: 25935,
              38258: 29942,
              38259: 19981,
              38260: 20184,
              38261: 22496,
              38262: 22827,
              38263: 23142,
              38264: 23500,
              38265: 20904,
              38266: 24067,
              38267: 24220,
              38268: 24598,
              38269: 25206,
              38270: 25975,
              38272: 26023,
              38273: 26222,
              38274: 28014,
              38275: 29238,
              38276: 31526,
              38277: 33104,
              38278: 33178,
              38279: 33433,
              38280: 35676,
              38281: 36e3,
              38282: 36070,
              38283: 36212,
              38284: 38428,
              38285: 38468,
              38286: 20398,
              38287: 25771,
              38288: 27494,
              38289: 33310,
              38290: 33889,
              38291: 34154,
              38292: 37096,
              38293: 23553,
              38294: 26963,
              38295: 39080,
              38296: 33914,
              38297: 34135,
              38298: 20239,
              38299: 21103,
              38300: 24489,
              38301: 24133,
              38302: 26381,
              38303: 31119,
              38304: 33145,
              38305: 35079,
              38306: 35206,
              38307: 28149,
              38308: 24343,
              38309: 25173,
              38310: 27832,
              38311: 20175,
              38312: 29289,
              38313: 39826,
              38314: 20998,
              38315: 21563,
              38316: 22132,
              38317: 22707,
              38318: 24996,
              38319: 25198,
              38320: 28954,
              38321: 22894,
              38322: 31881,
              38323: 31966,
              38324: 32027,
              38325: 38640,
              38326: 25991,
              38327: 32862,
              38328: 19993,
              38329: 20341,
              38330: 20853,
              38331: 22592,
              38332: 24163,
              38333: 24179,
              38334: 24330,
              38335: 26564,
              38336: 20006,
              38337: 34109,
              38338: 38281,
              38339: 38491,
              38340: 31859,
              38341: 38913,
              38342: 20731,
              38343: 22721,
              38344: 30294,
              38345: 30887,
              38346: 21029,
              38347: 30629,
              38348: 34065,
              38349: 31622,
              38350: 20559,
              38351: 22793,
              38352: 29255,
              38353: 31687,
              38354: 32232,
              38355: 36794,
              38356: 36820,
              38357: 36941,
              38358: 20415,
              38359: 21193,
              38360: 23081,
              38361: 24321,
              38362: 38829,
              38363: 20445,
              38364: 33303,
              38365: 37610,
              38366: 22275,
              38367: 25429,
              38368: 27497,
              38369: 29995,
              38370: 35036,
              38371: 36628,
              38372: 31298,
              38373: 21215,
              38374: 22675,
              38375: 24917,
              38376: 25098,
              38377: 26286,
              38378: 27597,
              38379: 31807,
              38380: 33769,
              38381: 20515,
              38382: 20472,
              38383: 21253,
              38384: 21574,
              38385: 22577,
              38386: 22857,
              38387: 23453,
              38388: 23792,
              38389: 23791,
              38390: 23849,
              38391: 24214,
              38392: 25265,
              38393: 25447,
              38394: 25918,
              38395: 26041,
              38396: 26379,
              38464: 27861,
              38465: 27873,
              38466: 28921,
              38467: 30770,
              38468: 32299,
              38469: 32990,
              38470: 33459,
              38471: 33804,
              38472: 34028,
              38473: 34562,
              38474: 35090,
              38475: 35370,
              38476: 35914,
              38477: 37030,
              38478: 37586,
              38479: 39165,
              38480: 40179,
              38481: 40300,
              38482: 20047,
              38483: 20129,
              38484: 20621,
              38485: 21078,
              38486: 22346,
              38487: 22952,
              38488: 24125,
              38489: 24536,
              38490: 24537,
              38491: 25151,
              38492: 26292,
              38493: 26395,
              38494: 26576,
              38495: 26834,
              38496: 20882,
              38497: 32033,
              38498: 32938,
              38499: 33192,
              38500: 35584,
              38501: 35980,
              38502: 36031,
              38503: 37502,
              38504: 38450,
              38505: 21536,
              38506: 38956,
              38507: 21271,
              38508: 20693,
              38509: 21340,
              38510: 22696,
              38511: 25778,
              38512: 26420,
              38513: 29287,
              38514: 30566,
              38515: 31302,
              38516: 37350,
              38517: 21187,
              38518: 27809,
              38519: 27526,
              38520: 22528,
              38521: 24140,
              38522: 22868,
              38523: 26412,
              38524: 32763,
              38525: 20961,
              38526: 30406,
              38528: 25705,
              38529: 30952,
              38530: 39764,
              38531: 40635,
              38532: 22475,
              38533: 22969,
              38534: 26151,
              38535: 26522,
              38536: 27598,
              38537: 21737,
              38538: 27097,
              38539: 24149,
              38540: 33180,
              38541: 26517,
              38542: 39850,
              38543: 26622,
              38544: 40018,
              38545: 26717,
              38546: 20134,
              38547: 20451,
              38548: 21448,
              38549: 25273,
              38550: 26411,
              38551: 27819,
              38552: 36804,
              38553: 20397,
              38554: 32365,
              38555: 40639,
              38556: 19975,
              38557: 24930,
              38558: 28288,
              38559: 28459,
              38560: 34067,
              38561: 21619,
              38562: 26410,
              38563: 39749,
              38564: 24051,
              38565: 31637,
              38566: 23724,
              38567: 23494,
              38568: 34588,
              38569: 28234,
              38570: 34001,
              38571: 31252,
              38572: 33032,
              38573: 22937,
              38574: 31885,
              38575: 27665,
              38576: 30496,
              38577: 21209,
              38578: 22818,
              38579: 28961,
              38580: 29279,
              38581: 30683,
              38582: 38695,
              38583: 40289,
              38584: 26891,
              38585: 23167,
              38586: 23064,
              38587: 20901,
              38588: 21517,
              38589: 21629,
              38590: 26126,
              38591: 30431,
              38592: 36855,
              38593: 37528,
              38594: 40180,
              38595: 23018,
              38596: 29277,
              38597: 28357,
              38598: 20813,
              38599: 26825,
              38600: 32191,
              38601: 32236,
              38602: 38754,
              38603: 40634,
              38604: 25720,
              38605: 27169,
              38606: 33538,
              38607: 22916,
              38608: 23391,
              38609: 27611,
              38610: 29467,
              38611: 30450,
              38612: 32178,
              38613: 32791,
              38614: 33945,
              38615: 20786,
              38616: 26408,
              38617: 40665,
              38618: 30446,
              38619: 26466,
              38620: 21247,
              38621: 39173,
              38622: 23588,
              38623: 25147,
              38624: 31870,
              38625: 36016,
              38626: 21839,
              38627: 24758,
              38628: 32011,
              38629: 38272,
              38630: 21249,
              38631: 20063,
              38632: 20918,
              38633: 22812,
              38634: 29242,
              38635: 32822,
              38636: 37326,
              38637: 24357,
              38638: 30690,
              38639: 21380,
              38640: 24441,
              38641: 32004,
              38642: 34220,
              38643: 35379,
              38644: 36493,
              38645: 38742,
              38646: 26611,
              38647: 34222,
              38648: 37971,
              38649: 24841,
              38650: 24840,
              38651: 27833,
              38652: 30290,
              38720: 35565,
              38721: 36664,
              38722: 21807,
              38723: 20305,
              38724: 20778,
              38725: 21191,
              38726: 21451,
              38727: 23461,
              38728: 24189,
              38729: 24736,
              38730: 24962,
              38731: 25558,
              38732: 26377,
              38733: 26586,
              38734: 28263,
              38735: 28044,
              38736: 29494,
              38737: 29495,
              38738: 30001,
              38739: 31056,
              38740: 35029,
              38741: 35480,
              38742: 36938,
              38743: 37009,
              38744: 37109,
              38745: 38596,
              38746: 34701,
              38747: 22805,
              38748: 20104,
              38749: 20313,
              38750: 19982,
              38751: 35465,
              38752: 36671,
              38753: 38928,
              38754: 20653,
              38755: 24188,
              38756: 22934,
              38757: 23481,
              38758: 24248,
              38759: 25562,
              38760: 25594,
              38761: 25793,
              38762: 26332,
              38763: 26954,
              38764: 27096,
              38765: 27915,
              38766: 28342,
              38767: 29076,
              38768: 29992,
              38769: 31407,
              38770: 32650,
              38771: 32768,
              38772: 33865,
              38773: 33993,
              38774: 35201,
              38775: 35617,
              38776: 36362,
              38777: 36965,
              38778: 38525,
              38779: 39178,
              38780: 24958,
              38781: 25233,
              38782: 27442,
              38784: 27779,
              38785: 28020,
              38786: 32716,
              38787: 32764,
              38788: 28096,
              38789: 32645,
              38790: 34746,
              38791: 35064,
              38792: 26469,
              38793: 33713,
              38794: 38972,
              38795: 38647,
              38796: 27931,
              38797: 32097,
              38798: 33853,
              38799: 37226,
              38800: 20081,
              38801: 21365,
              38802: 23888,
              38803: 27396,
              38804: 28651,
              38805: 34253,
              38806: 34349,
              38807: 35239,
              38808: 21033,
              38809: 21519,
              38810: 23653,
              38811: 26446,
              38812: 26792,
              38813: 29702,
              38814: 29827,
              38815: 30178,
              38816: 35023,
              38817: 35041,
              38818: 37324,
              38819: 38626,
              38820: 38520,
              38821: 24459,
              38822: 29575,
              38823: 31435,
              38824: 33870,
              38825: 25504,
              38826: 30053,
              38827: 21129,
              38828: 27969,
              38829: 28316,
              38830: 29705,
              38831: 30041,
              38832: 30827,
              38833: 31890,
              38834: 38534,
              38835: 31452,
              38836: 40845,
              38837: 20406,
              38838: 24942,
              38839: 26053,
              38840: 34396,
              38841: 20102,
              38842: 20142,
              38843: 20698,
              38844: 20001,
              38845: 20940,
              38846: 23534,
              38847: 26009,
              38848: 26753,
              38849: 28092,
              38850: 29471,
              38851: 30274,
              38852: 30637,
              38853: 31260,
              38854: 31975,
              38855: 33391,
              38856: 35538,
              38857: 36988,
              38858: 37327,
              38859: 38517,
              38860: 38936,
              38861: 21147,
              38862: 32209,
              38863: 20523,
              38864: 21400,
              38865: 26519,
              38866: 28107,
              38867: 29136,
              38868: 29747,
              38869: 33256,
              38870: 36650,
              38871: 38563,
              38872: 40023,
              38873: 40607,
              38874: 29792,
              38875: 22593,
              38876: 28057,
              38877: 32047,
              38878: 39006,
              38879: 20196,
              38880: 20278,
              38881: 20363,
              38882: 20919,
              38883: 21169,
              38884: 23994,
              38885: 24604,
              38886: 29618,
              38887: 31036,
              38888: 33491,
              38889: 37428,
              38890: 38583,
              38891: 38646,
              38892: 38666,
              38893: 40599,
              38894: 40802,
              38895: 26278,
              38896: 27508,
              38897: 21015,
              38898: 21155,
              38899: 28872,
              38900: 35010,
              38901: 24265,
              38902: 24651,
              38903: 24976,
              38904: 28451,
              38905: 29001,
              38906: 31806,
              38907: 32244,
              38908: 32879,
              38976: 34030,
              38977: 36899,
              38978: 37676,
              38979: 21570,
              38980: 39791,
              38981: 27347,
              38982: 28809,
              38983: 36034,
              38984: 36335,
              38985: 38706,
              38986: 21172,
              38987: 23105,
              38988: 24266,
              38989: 24324,
              38990: 26391,
              38991: 27004,
              38992: 27028,
              38993: 28010,
              38994: 28431,
              38995: 29282,
              38996: 29436,
              38997: 31725,
              38998: 32769,
              38999: 32894,
              39e3: 34635,
              39001: 37070,
              39002: 20845,
              39003: 40595,
              39004: 31108,
              39005: 32907,
              39006: 37682,
              39007: 35542,
              39008: 20525,
              39009: 21644,
              39010: 35441,
              39011: 27498,
              39012: 36036,
              39013: 33031,
              39014: 24785,
              39015: 26528,
              39016: 40434,
              39017: 20121,
              39018: 20120,
              39019: 39952,
              39020: 35435,
              39021: 34241,
              39022: 34152,
              39023: 26880,
              39024: 28286,
              39025: 30871,
              39026: 33109,
              39071: 24332,
              39072: 19984,
              39073: 19989,
              39074: 20010,
              39075: 20017,
              39076: 20022,
              39077: 20028,
              39078: 20031,
              39079: 20034,
              39080: 20054,
              39081: 20056,
              39082: 20098,
              39083: 20101,
              39084: 35947,
              39085: 20106,
              39086: 33298,
              39087: 24333,
              39088: 20110,
              39089: 20126,
              39090: 20127,
              39091: 20128,
              39092: 20130,
              39093: 20144,
              39094: 20147,
              39095: 20150,
              39096: 20174,
              39097: 20173,
              39098: 20164,
              39099: 20166,
              39100: 20162,
              39101: 20183,
              39102: 20190,
              39103: 20205,
              39104: 20191,
              39105: 20215,
              39106: 20233,
              39107: 20314,
              39108: 20272,
              39109: 20315,
              39110: 20317,
              39111: 20311,
              39112: 20295,
              39113: 20342,
              39114: 20360,
              39115: 20367,
              39116: 20376,
              39117: 20347,
              39118: 20329,
              39119: 20336,
              39120: 20369,
              39121: 20335,
              39122: 20358,
              39123: 20374,
              39124: 20760,
              39125: 20436,
              39126: 20447,
              39127: 20430,
              39128: 20440,
              39129: 20443,
              39130: 20433,
              39131: 20442,
              39132: 20432,
              39133: 20452,
              39134: 20453,
              39135: 20506,
              39136: 20520,
              39137: 20500,
              39138: 20522,
              39139: 20517,
              39140: 20485,
              39141: 20252,
              39142: 20470,
              39143: 20513,
              39144: 20521,
              39145: 20524,
              39146: 20478,
              39147: 20463,
              39148: 20497,
              39149: 20486,
              39150: 20547,
              39151: 20551,
              39152: 26371,
              39153: 20565,
              39154: 20560,
              39155: 20552,
              39156: 20570,
              39157: 20566,
              39158: 20588,
              39159: 20600,
              39160: 20608,
              39161: 20634,
              39162: 20613,
              39163: 20660,
              39164: 20658,
              39232: 20681,
              39233: 20682,
              39234: 20659,
              39235: 20674,
              39236: 20694,
              39237: 20702,
              39238: 20709,
              39239: 20717,
              39240: 20707,
              39241: 20718,
              39242: 20729,
              39243: 20725,
              39244: 20745,
              39245: 20737,
              39246: 20738,
              39247: 20758,
              39248: 20757,
              39249: 20756,
              39250: 20762,
              39251: 20769,
              39252: 20794,
              39253: 20791,
              39254: 20796,
              39255: 20795,
              39256: 20799,
              39257: 20800,
              39258: 20818,
              39259: 20812,
              39260: 20820,
              39261: 20834,
              39262: 31480,
              39263: 20841,
              39264: 20842,
              39265: 20846,
              39266: 20864,
              39267: 20866,
              39268: 22232,
              39269: 20876,
              39270: 20873,
              39271: 20879,
              39272: 20881,
              39273: 20883,
              39274: 20885,
              39275: 20886,
              39276: 20900,
              39277: 20902,
              39278: 20898,
              39279: 20905,
              39280: 20906,
              39281: 20907,
              39282: 20915,
              39283: 20913,
              39284: 20914,
              39285: 20912,
              39286: 20917,
              39287: 20925,
              39288: 20933,
              39289: 20937,
              39290: 20955,
              39291: 20960,
              39292: 34389,
              39293: 20969,
              39294: 20973,
              39296: 20976,
              39297: 20981,
              39298: 20990,
              39299: 20996,
              39300: 21003,
              39301: 21012,
              39302: 21006,
              39303: 21031,
              39304: 21034,
              39305: 21038,
              39306: 21043,
              39307: 21049,
              39308: 21071,
              39309: 21060,
              39310: 21067,
              39311: 21068,
              39312: 21086,
              39313: 21076,
              39314: 21098,
              39315: 21108,
              39316: 21097,
              39317: 21107,
              39318: 21119,
              39319: 21117,
              39320: 21133,
              39321: 21140,
              39322: 21138,
              39323: 21105,
              39324: 21128,
              39325: 21137,
              39326: 36776,
              39327: 36775,
              39328: 21164,
              39329: 21165,
              39330: 21180,
              39331: 21173,
              39332: 21185,
              39333: 21197,
              39334: 21207,
              39335: 21214,
              39336: 21219,
              39337: 21222,
              39338: 39149,
              39339: 21216,
              39340: 21235,
              39341: 21237,
              39342: 21240,
              39343: 21241,
              39344: 21254,
              39345: 21256,
              39346: 30008,
              39347: 21261,
              39348: 21264,
              39349: 21263,
              39350: 21269,
              39351: 21274,
              39352: 21283,
              39353: 21295,
              39354: 21297,
              39355: 21299,
              39356: 21304,
              39357: 21312,
              39358: 21318,
              39359: 21317,
              39360: 19991,
              39361: 21321,
              39362: 21325,
              39363: 20950,
              39364: 21342,
              39365: 21353,
              39366: 21358,
              39367: 22808,
              39368: 21371,
              39369: 21367,
              39370: 21378,
              39371: 21398,
              39372: 21408,
              39373: 21414,
              39374: 21413,
              39375: 21422,
              39376: 21424,
              39377: 21430,
              39378: 21443,
              39379: 31762,
              39380: 38617,
              39381: 21471,
              39382: 26364,
              39383: 29166,
              39384: 21486,
              39385: 21480,
              39386: 21485,
              39387: 21498,
              39388: 21505,
              39389: 21565,
              39390: 21568,
              39391: 21548,
              39392: 21549,
              39393: 21564,
              39394: 21550,
              39395: 21558,
              39396: 21545,
              39397: 21533,
              39398: 21582,
              39399: 21647,
              39400: 21621,
              39401: 21646,
              39402: 21599,
              39403: 21617,
              39404: 21623,
              39405: 21616,
              39406: 21650,
              39407: 21627,
              39408: 21632,
              39409: 21622,
              39410: 21636,
              39411: 21648,
              39412: 21638,
              39413: 21703,
              39414: 21666,
              39415: 21688,
              39416: 21669,
              39417: 21676,
              39418: 21700,
              39419: 21704,
              39420: 21672,
              39488: 21675,
              39489: 21698,
              39490: 21668,
              39491: 21694,
              39492: 21692,
              39493: 21720,
              39494: 21733,
              39495: 21734,
              39496: 21775,
              39497: 21780,
              39498: 21757,
              39499: 21742,
              39500: 21741,
              39501: 21754,
              39502: 21730,
              39503: 21817,
              39504: 21824,
              39505: 21859,
              39506: 21836,
              39507: 21806,
              39508: 21852,
              39509: 21829,
              39510: 21846,
              39511: 21847,
              39512: 21816,
              39513: 21811,
              39514: 21853,
              39515: 21913,
              39516: 21888,
              39517: 21679,
              39518: 21898,
              39519: 21919,
              39520: 21883,
              39521: 21886,
              39522: 21912,
              39523: 21918,
              39524: 21934,
              39525: 21884,
              39526: 21891,
              39527: 21929,
              39528: 21895,
              39529: 21928,
              39530: 21978,
              39531: 21957,
              39532: 21983,
              39533: 21956,
              39534: 21980,
              39535: 21988,
              39536: 21972,
              39537: 22036,
              39538: 22007,
              39539: 22038,
              39540: 22014,
              39541: 22013,
              39542: 22043,
              39543: 22009,
              39544: 22094,
              39545: 22096,
              39546: 29151,
              39547: 22068,
              39548: 22070,
              39549: 22066,
              39550: 22072,
              39552: 22123,
              39553: 22116,
              39554: 22063,
              39555: 22124,
              39556: 22122,
              39557: 22150,
              39558: 22144,
              39559: 22154,
              39560: 22176,
              39561: 22164,
              39562: 22159,
              39563: 22181,
              39564: 22190,
              39565: 22198,
              39566: 22196,
              39567: 22210,
              39568: 22204,
              39569: 22209,
              39570: 22211,
              39571: 22208,
              39572: 22216,
              39573: 22222,
              39574: 22225,
              39575: 22227,
              39576: 22231,
              39577: 22254,
              39578: 22265,
              39579: 22272,
              39580: 22271,
              39581: 22276,
              39582: 22281,
              39583: 22280,
              39584: 22283,
              39585: 22285,
              39586: 22291,
              39587: 22296,
              39588: 22294,
              39589: 21959,
              39590: 22300,
              39591: 22310,
              39592: 22327,
              39593: 22328,
              39594: 22350,
              39595: 22331,
              39596: 22336,
              39597: 22351,
              39598: 22377,
              39599: 22464,
              39600: 22408,
              39601: 22369,
              39602: 22399,
              39603: 22409,
              39604: 22419,
              39605: 22432,
              39606: 22451,
              39607: 22436,
              39608: 22442,
              39609: 22448,
              39610: 22467,
              39611: 22470,
              39612: 22484,
              39613: 22482,
              39614: 22483,
              39615: 22538,
              39616: 22486,
              39617: 22499,
              39618: 22539,
              39619: 22553,
              39620: 22557,
              39621: 22642,
              39622: 22561,
              39623: 22626,
              39624: 22603,
              39625: 22640,
              39626: 27584,
              39627: 22610,
              39628: 22589,
              39629: 22649,
              39630: 22661,
              39631: 22713,
              39632: 22687,
              39633: 22699,
              39634: 22714,
              39635: 22750,
              39636: 22715,
              39637: 22712,
              39638: 22702,
              39639: 22725,
              39640: 22739,
              39641: 22737,
              39642: 22743,
              39643: 22745,
              39644: 22744,
              39645: 22757,
              39646: 22748,
              39647: 22756,
              39648: 22751,
              39649: 22767,
              39650: 22778,
              39651: 22777,
              39652: 22779,
              39653: 22780,
              39654: 22781,
              39655: 22786,
              39656: 22794,
              39657: 22800,
              39658: 22811,
              39659: 26790,
              39660: 22821,
              39661: 22828,
              39662: 22829,
              39663: 22834,
              39664: 22840,
              39665: 22846,
              39666: 31442,
              39667: 22869,
              39668: 22864,
              39669: 22862,
              39670: 22874,
              39671: 22872,
              39672: 22882,
              39673: 22880,
              39674: 22887,
              39675: 22892,
              39676: 22889,
              39744: 22904,
              39745: 22913,
              39746: 22941,
              39747: 20318,
              39748: 20395,
              39749: 22947,
              39750: 22962,
              39751: 22982,
              39752: 23016,
              39753: 23004,
              39754: 22925,
              39755: 23001,
              39756: 23002,
              39757: 23077,
              39758: 23071,
              39759: 23057,
              39760: 23068,
              39761: 23049,
              39762: 23066,
              39763: 23104,
              39764: 23148,
              39765: 23113,
              39766: 23093,
              39767: 23094,
              39768: 23138,
              39769: 23146,
              39770: 23194,
              39771: 23228,
              39772: 23230,
              39773: 23243,
              39774: 23234,
              39775: 23229,
              39776: 23267,
              39777: 23255,
              39778: 23270,
              39779: 23273,
              39780: 23254,
              39781: 23290,
              39782: 23291,
              39783: 23308,
              39784: 23307,
              39785: 23318,
              39786: 23346,
              39787: 23248,
              39788: 23338,
              39789: 23350,
              39790: 23358,
              39791: 23363,
              39792: 23365,
              39793: 23360,
              39794: 23377,
              39795: 23381,
              39796: 23386,
              39797: 23387,
              39798: 23397,
              39799: 23401,
              39800: 23408,
              39801: 23411,
              39802: 23413,
              39803: 23416,
              39804: 25992,
              39805: 23418,
              39806: 23424,
              39808: 23427,
              39809: 23462,
              39810: 23480,
              39811: 23491,
              39812: 23495,
              39813: 23497,
              39814: 23508,
              39815: 23504,
              39816: 23524,
              39817: 23526,
              39818: 23522,
              39819: 23518,
              39820: 23525,
              39821: 23531,
              39822: 23536,
              39823: 23542,
              39824: 23539,
              39825: 23557,
              39826: 23559,
              39827: 23560,
              39828: 23565,
              39829: 23571,
              39830: 23584,
              39831: 23586,
              39832: 23592,
              39833: 23608,
              39834: 23609,
              39835: 23617,
              39836: 23622,
              39837: 23630,
              39838: 23635,
              39839: 23632,
              39840: 23631,
              39841: 23409,
              39842: 23660,
              39843: 23662,
              39844: 20066,
              39845: 23670,
              39846: 23673,
              39847: 23692,
              39848: 23697,
              39849: 23700,
              39850: 22939,
              39851: 23723,
              39852: 23739,
              39853: 23734,
              39854: 23740,
              39855: 23735,
              39856: 23749,
              39857: 23742,
              39858: 23751,
              39859: 23769,
              39860: 23785,
              39861: 23805,
              39862: 23802,
              39863: 23789,
              39864: 23948,
              39865: 23786,
              39866: 23819,
              39867: 23829,
              39868: 23831,
              39869: 23900,
              39870: 23839,
              39871: 23835,
              39872: 23825,
              39873: 23828,
              39874: 23842,
              39875: 23834,
              39876: 23833,
              39877: 23832,
              39878: 23884,
              39879: 23890,
              39880: 23886,
              39881: 23883,
              39882: 23916,
              39883: 23923,
              39884: 23926,
              39885: 23943,
              39886: 23940,
              39887: 23938,
              39888: 23970,
              39889: 23965,
              39890: 23980,
              39891: 23982,
              39892: 23997,
              39893: 23952,
              39894: 23991,
              39895: 23996,
              39896: 24009,
              39897: 24013,
              39898: 24019,
              39899: 24018,
              39900: 24022,
              39901: 24027,
              39902: 24043,
              39903: 24050,
              39904: 24053,
              39905: 24075,
              39906: 24090,
              39907: 24089,
              39908: 24081,
              39909: 24091,
              39910: 24118,
              39911: 24119,
              39912: 24132,
              39913: 24131,
              39914: 24128,
              39915: 24142,
              39916: 24151,
              39917: 24148,
              39918: 24159,
              39919: 24162,
              39920: 24164,
              39921: 24135,
              39922: 24181,
              39923: 24182,
              39924: 24186,
              39925: 40636,
              39926: 24191,
              39927: 24224,
              39928: 24257,
              39929: 24258,
              39930: 24264,
              39931: 24272,
              39932: 24271,
              4e4: 24278,
              40001: 24291,
              40002: 24285,
              40003: 24282,
              40004: 24283,
              40005: 24290,
              40006: 24289,
              40007: 24296,
              40008: 24297,
              40009: 24300,
              40010: 24305,
              40011: 24307,
              40012: 24304,
              40013: 24308,
              40014: 24312,
              40015: 24318,
              40016: 24323,
              40017: 24329,
              40018: 24413,
              40019: 24412,
              40020: 24331,
              40021: 24337,
              40022: 24342,
              40023: 24361,
              40024: 24365,
              40025: 24376,
              40026: 24385,
              40027: 24392,
              40028: 24396,
              40029: 24398,
              40030: 24367,
              40031: 24401,
              40032: 24406,
              40033: 24407,
              40034: 24409,
              40035: 24417,
              40036: 24429,
              40037: 24435,
              40038: 24439,
              40039: 24451,
              40040: 24450,
              40041: 24447,
              40042: 24458,
              40043: 24456,
              40044: 24465,
              40045: 24455,
              40046: 24478,
              40047: 24473,
              40048: 24472,
              40049: 24480,
              40050: 24488,
              40051: 24493,
              40052: 24508,
              40053: 24534,
              40054: 24571,
              40055: 24548,
              40056: 24568,
              40057: 24561,
              40058: 24541,
              40059: 24755,
              40060: 24575,
              40061: 24609,
              40062: 24672,
              40064: 24601,
              40065: 24592,
              40066: 24617,
              40067: 24590,
              40068: 24625,
              40069: 24603,
              40070: 24597,
              40071: 24619,
              40072: 24614,
              40073: 24591,
              40074: 24634,
              40075: 24666,
              40076: 24641,
              40077: 24682,
              40078: 24695,
              40079: 24671,
              40080: 24650,
              40081: 24646,
              40082: 24653,
              40083: 24675,
              40084: 24643,
              40085: 24676,
              40086: 24642,
              40087: 24684,
              40088: 24683,
              40089: 24665,
              40090: 24705,
              40091: 24717,
              40092: 24807,
              40093: 24707,
              40094: 24730,
              40095: 24708,
              40096: 24731,
              40097: 24726,
              40098: 24727,
              40099: 24722,
              40100: 24743,
              40101: 24715,
              40102: 24801,
              40103: 24760,
              40104: 24800,
              40105: 24787,
              40106: 24756,
              40107: 24560,
              40108: 24765,
              40109: 24774,
              40110: 24757,
              40111: 24792,
              40112: 24909,
              40113: 24853,
              40114: 24838,
              40115: 24822,
              40116: 24823,
              40117: 24832,
              40118: 24820,
              40119: 24826,
              40120: 24835,
              40121: 24865,
              40122: 24827,
              40123: 24817,
              40124: 24845,
              40125: 24846,
              40126: 24903,
              40127: 24894,
              40128: 24872,
              40129: 24871,
              40130: 24906,
              40131: 24895,
              40132: 24892,
              40133: 24876,
              40134: 24884,
              40135: 24893,
              40136: 24898,
              40137: 24900,
              40138: 24947,
              40139: 24951,
              40140: 24920,
              40141: 24921,
              40142: 24922,
              40143: 24939,
              40144: 24948,
              40145: 24943,
              40146: 24933,
              40147: 24945,
              40148: 24927,
              40149: 24925,
              40150: 24915,
              40151: 24949,
              40152: 24985,
              40153: 24982,
              40154: 24967,
              40155: 25004,
              40156: 24980,
              40157: 24986,
              40158: 24970,
              40159: 24977,
              40160: 25003,
              40161: 25006,
              40162: 25036,
              40163: 25034,
              40164: 25033,
              40165: 25079,
              40166: 25032,
              40167: 25027,
              40168: 25030,
              40169: 25018,
              40170: 25035,
              40171: 32633,
              40172: 25037,
              40173: 25062,
              40174: 25059,
              40175: 25078,
              40176: 25082,
              40177: 25076,
              40178: 25087,
              40179: 25085,
              40180: 25084,
              40181: 25086,
              40182: 25088,
              40183: 25096,
              40184: 25097,
              40185: 25101,
              40186: 25100,
              40187: 25108,
              40188: 25115,
              40256: 25118,
              40257: 25121,
              40258: 25130,
              40259: 25134,
              40260: 25136,
              40261: 25138,
              40262: 25139,
              40263: 25153,
              40264: 25166,
              40265: 25182,
              40266: 25187,
              40267: 25179,
              40268: 25184,
              40269: 25192,
              40270: 25212,
              40271: 25218,
              40272: 25225,
              40273: 25214,
              40274: 25234,
              40275: 25235,
              40276: 25238,
              40277: 25300,
              40278: 25219,
              40279: 25236,
              40280: 25303,
              40281: 25297,
              40282: 25275,
              40283: 25295,
              40284: 25343,
              40285: 25286,
              40286: 25812,
              40287: 25288,
              40288: 25308,
              40289: 25292,
              40290: 25290,
              40291: 25282,
              40292: 25287,
              40293: 25243,
              40294: 25289,
              40295: 25356,
              40296: 25326,
              40297: 25329,
              40298: 25383,
              40299: 25346,
              40300: 25352,
              40301: 25327,
              40302: 25333,
              40303: 25424,
              40304: 25406,
              40305: 25421,
              40306: 25628,
              40307: 25423,
              40308: 25494,
              40309: 25486,
              40310: 25472,
              40311: 25515,
              40312: 25462,
              40313: 25507,
              40314: 25487,
              40315: 25481,
              40316: 25503,
              40317: 25525,
              40318: 25451,
              40320: 25449,
              40321: 25534,
              40322: 25577,
              40323: 25536,
              40324: 25542,
              40325: 25571,
              40326: 25545,
              40327: 25554,
              40328: 25590,
              40329: 25540,
              40330: 25622,
              40331: 25652,
              40332: 25606,
              40333: 25619,
              40334: 25638,
              40335: 25654,
              40336: 25885,
              40337: 25623,
              40338: 25640,
              40339: 25615,
              40340: 25703,
              40341: 25711,
              40342: 25718,
              40343: 25678,
              40344: 25898,
              40345: 25749,
              40346: 25747,
              40347: 25765,
              40348: 25769,
              40349: 25736,
              40350: 25788,
              40351: 25818,
              40352: 25810,
              40353: 25797,
              40354: 25799,
              40355: 25787,
              40356: 25816,
              40357: 25794,
              40358: 25841,
              40359: 25831,
              40360: 33289,
              40361: 25824,
              40362: 25825,
              40363: 25260,
              40364: 25827,
              40365: 25839,
              40366: 25900,
              40367: 25846,
              40368: 25844,
              40369: 25842,
              40370: 25850,
              40371: 25856,
              40372: 25853,
              40373: 25880,
              40374: 25884,
              40375: 25861,
              40376: 25892,
              40377: 25891,
              40378: 25899,
              40379: 25908,
              40380: 25909,
              40381: 25911,
              40382: 25910,
              40383: 25912,
              40384: 30027,
              40385: 25928,
              40386: 25942,
              40387: 25941,
              40388: 25933,
              40389: 25944,
              40390: 25950,
              40391: 25949,
              40392: 25970,
              40393: 25976,
              40394: 25986,
              40395: 25987,
              40396: 35722,
              40397: 26011,
              40398: 26015,
              40399: 26027,
              40400: 26039,
              40401: 26051,
              40402: 26054,
              40403: 26049,
              40404: 26052,
              40405: 26060,
              40406: 26066,
              40407: 26075,
              40408: 26073,
              40409: 26080,
              40410: 26081,
              40411: 26097,
              40412: 26482,
              40413: 26122,
              40414: 26115,
              40415: 26107,
              40416: 26483,
              40417: 26165,
              40418: 26166,
              40419: 26164,
              40420: 26140,
              40421: 26191,
              40422: 26180,
              40423: 26185,
              40424: 26177,
              40425: 26206,
              40426: 26205,
              40427: 26212,
              40428: 26215,
              40429: 26216,
              40430: 26207,
              40431: 26210,
              40432: 26224,
              40433: 26243,
              40434: 26248,
              40435: 26254,
              40436: 26249,
              40437: 26244,
              40438: 26264,
              40439: 26269,
              40440: 26305,
              40441: 26297,
              40442: 26313,
              40443: 26302,
              40444: 26300,
              40512: 26308,
              40513: 26296,
              40514: 26326,
              40515: 26330,
              40516: 26336,
              40517: 26175,
              40518: 26342,
              40519: 26345,
              40520: 26352,
              40521: 26357,
              40522: 26359,
              40523: 26383,
              40524: 26390,
              40525: 26398,
              40526: 26406,
              40527: 26407,
              40528: 38712,
              40529: 26414,
              40530: 26431,
              40531: 26422,
              40532: 26433,
              40533: 26424,
              40534: 26423,
              40535: 26438,
              40536: 26462,
              40537: 26464,
              40538: 26457,
              40539: 26467,
              40540: 26468,
              40541: 26505,
              40542: 26480,
              40543: 26537,
              40544: 26492,
              40545: 26474,
              40546: 26508,
              40547: 26507,
              40548: 26534,
              40549: 26529,
              40550: 26501,
              40551: 26551,
              40552: 26607,
              40553: 26548,
              40554: 26604,
              40555: 26547,
              40556: 26601,
              40557: 26552,
              40558: 26596,
              40559: 26590,
              40560: 26589,
              40561: 26594,
              40562: 26606,
              40563: 26553,
              40564: 26574,
              40565: 26566,
              40566: 26599,
              40567: 27292,
              40568: 26654,
              40569: 26694,
              40570: 26665,
              40571: 26688,
              40572: 26701,
              40573: 26674,
              40574: 26702,
              40576: 26803,
              40577: 26667,
              40578: 26713,
              40579: 26723,
              40580: 26743,
              40581: 26751,
              40582: 26783,
              40583: 26767,
              40584: 26797,
              40585: 26772,
              40586: 26781,
              40587: 26779,
              40588: 26755,
              40589: 27310,
              40590: 26809,
              40591: 26740,
              40592: 26805,
              40593: 26784,
              40594: 26810,
              40595: 26895,
              40596: 26765,
              40597: 26750,
              40598: 26881,
              40599: 26826,
              40600: 26888,
              40601: 26840,
              40602: 26914,
              40603: 26918,
              40604: 26849,
              40605: 26892,
              40606: 26829,
              40607: 26836,
              40608: 26855,
              40609: 26837,
              40610: 26934,
              40611: 26898,
              40612: 26884,
              40613: 26839,
              40614: 26851,
              40615: 26917,
              40616: 26873,
              40617: 26848,
              40618: 26863,
              40619: 26920,
              40620: 26922,
              40621: 26906,
              40622: 26915,
              40623: 26913,
              40624: 26822,
              40625: 27001,
              40626: 26999,
              40627: 26972,
              40628: 27e3,
              40629: 26987,
              40630: 26964,
              40631: 27006,
              40632: 26990,
              40633: 26937,
              40634: 26996,
              40635: 26941,
              40636: 26969,
              40637: 26928,
              40638: 26977,
              40639: 26974,
              40640: 26973,
              40641: 27009,
              40642: 26986,
              40643: 27058,
              40644: 27054,
              40645: 27088,
              40646: 27071,
              40647: 27073,
              40648: 27091,
              40649: 27070,
              40650: 27086,
              40651: 23528,
              40652: 27082,
              40653: 27101,
              40654: 27067,
              40655: 27075,
              40656: 27047,
              40657: 27182,
              40658: 27025,
              40659: 27040,
              40660: 27036,
              40661: 27029,
              40662: 27060,
              40663: 27102,
              40664: 27112,
              40665: 27138,
              40666: 27163,
              40667: 27135,
              40668: 27402,
              40669: 27129,
              40670: 27122,
              40671: 27111,
              40672: 27141,
              40673: 27057,
              40674: 27166,
              40675: 27117,
              40676: 27156,
              40677: 27115,
              40678: 27146,
              40679: 27154,
              40680: 27329,
              40681: 27171,
              40682: 27155,
              40683: 27204,
              40684: 27148,
              40685: 27250,
              40686: 27190,
              40687: 27256,
              40688: 27207,
              40689: 27234,
              40690: 27225,
              40691: 27238,
              40692: 27208,
              40693: 27192,
              40694: 27170,
              40695: 27280,
              40696: 27277,
              40697: 27296,
              40698: 27268,
              40699: 27298,
              40700: 27299,
              40768: 27287,
              40769: 34327,
              40770: 27323,
              40771: 27331,
              40772: 27330,
              40773: 27320,
              40774: 27315,
              40775: 27308,
              40776: 27358,
              40777: 27345,
              40778: 27359,
              40779: 27306,
              40780: 27354,
              40781: 27370,
              40782: 27387,
              40783: 27397,
              40784: 34326,
              40785: 27386,
              40786: 27410,
              40787: 27414,
              40788: 39729,
              40789: 27423,
              40790: 27448,
              40791: 27447,
              40792: 30428,
              40793: 27449,
              40794: 39150,
              40795: 27463,
              40796: 27459,
              40797: 27465,
              40798: 27472,
              40799: 27481,
              40800: 27476,
              40801: 27483,
              40802: 27487,
              40803: 27489,
              40804: 27512,
              40805: 27513,
              40806: 27519,
              40807: 27520,
              40808: 27524,
              40809: 27523,
              40810: 27533,
              40811: 27544,
              40812: 27541,
              40813: 27550,
              40814: 27556,
              40815: 27562,
              40816: 27563,
              40817: 27567,
              40818: 27570,
              40819: 27569,
              40820: 27571,
              40821: 27575,
              40822: 27580,
              40823: 27590,
              40824: 27595,
              40825: 27603,
              40826: 27615,
              40827: 27628,
              40828: 27627,
              40829: 27635,
              40830: 27631,
              40832: 40638,
              40833: 27656,
              40834: 27667,
              40835: 27668,
              40836: 27675,
              40837: 27684,
              40838: 27683,
              40839: 27742,
              40840: 27733,
              40841: 27746,
              40842: 27754,
              40843: 27778,
              40844: 27789,
              40845: 27802,
              40846: 27777,
              40847: 27803,
              40848: 27774,
              40849: 27752,
              40850: 27763,
              40851: 27794,
              40852: 27792,
              40853: 27844,
              40854: 27889,
              40855: 27859,
              40856: 27837,
              40857: 27863,
              40858: 27845,
              40859: 27869,
              40860: 27822,
              40861: 27825,
              40862: 27838,
              40863: 27834,
              40864: 27867,
              40865: 27887,
              40866: 27865,
              40867: 27882,
              40868: 27935,
              40869: 34893,
              40870: 27958,
              40871: 27947,
              40872: 27965,
              40873: 27960,
              40874: 27929,
              40875: 27957,
              40876: 27955,
              40877: 27922,
              40878: 27916,
              40879: 28003,
              40880: 28051,
              40881: 28004,
              40882: 27994,
              40883: 28025,
              40884: 27993,
              40885: 28046,
              40886: 28053,
              40887: 28644,
              40888: 28037,
              40889: 28153,
              40890: 28181,
              40891: 28170,
              40892: 28085,
              40893: 28103,
              40894: 28134,
              40895: 28088,
              40896: 28102,
              40897: 28140,
              40898: 28126,
              40899: 28108,
              40900: 28136,
              40901: 28114,
              40902: 28101,
              40903: 28154,
              40904: 28121,
              40905: 28132,
              40906: 28117,
              40907: 28138,
              40908: 28142,
              40909: 28205,
              40910: 28270,
              40911: 28206,
              40912: 28185,
              40913: 28274,
              40914: 28255,
              40915: 28222,
              40916: 28195,
              40917: 28267,
              40918: 28203,
              40919: 28278,
              40920: 28237,
              40921: 28191,
              40922: 28227,
              40923: 28218,
              40924: 28238,
              40925: 28196,
              40926: 28415,
              40927: 28189,
              40928: 28216,
              40929: 28290,
              40930: 28330,
              40931: 28312,
              40932: 28361,
              40933: 28343,
              40934: 28371,
              40935: 28349,
              40936: 28335,
              40937: 28356,
              40938: 28338,
              40939: 28372,
              40940: 28373,
              40941: 28303,
              40942: 28325,
              40943: 28354,
              40944: 28319,
              40945: 28481,
              40946: 28433,
              40947: 28748,
              40948: 28396,
              40949: 28408,
              40950: 28414,
              40951: 28479,
              40952: 28402,
              40953: 28465,
              40954: 28399,
              40955: 28466,
              40956: 28364,
              161: 65377,
              162: 65378,
              163: 65379,
              164: 65380,
              165: 65381,
              166: 65382,
              167: 65383,
              168: 65384,
              169: 65385,
              170: 65386,
              171: 65387,
              172: 65388,
              173: 65389,
              174: 65390,
              175: 65391,
              176: 65392,
              177: 65393,
              178: 65394,
              179: 65395,
              180: 65396,
              181: 65397,
              182: 65398,
              183: 65399,
              184: 65400,
              185: 65401,
              186: 65402,
              187: 65403,
              188: 65404,
              189: 65405,
              190: 65406,
              191: 65407,
              192: 65408,
              193: 65409,
              194: 65410,
              195: 65411,
              196: 65412,
              197: 65413,
              198: 65414,
              199: 65415,
              200: 65416,
              201: 65417,
              202: 65418,
              203: 65419,
              204: 65420,
              205: 65421,
              206: 65422,
              207: 65423,
              208: 65424,
              209: 65425,
              210: 65426,
              211: 65427,
              212: 65428,
              213: 65429,
              214: 65430,
              215: 65431,
              216: 65432,
              217: 65433,
              218: 65434,
              219: 65435,
              220: 65436,
              221: 65437,
              222: 65438,
              223: 65439,
              57408: 28478,
              57409: 28435,
              57410: 28407,
              57411: 28550,
              57412: 28538,
              57413: 28536,
              57414: 28545,
              57415: 28544,
              57416: 28527,
              57417: 28507,
              57418: 28659,
              57419: 28525,
              57420: 28546,
              57421: 28540,
              57422: 28504,
              57423: 28558,
              57424: 28561,
              57425: 28610,
              57426: 28518,
              57427: 28595,
              57428: 28579,
              57429: 28577,
              57430: 28580,
              57431: 28601,
              57432: 28614,
              57433: 28586,
              57434: 28639,
              57435: 28629,
              57436: 28652,
              57437: 28628,
              57438: 28632,
              57439: 28657,
              57440: 28654,
              57441: 28635,
              57442: 28681,
              57443: 28683,
              57444: 28666,
              57445: 28689,
              57446: 28673,
              57447: 28687,
              57448: 28670,
              57449: 28699,
              57450: 28698,
              57451: 28532,
              57452: 28701,
              57453: 28696,
              57454: 28703,
              57455: 28720,
              57456: 28734,
              57457: 28722,
              57458: 28753,
              57459: 28771,
              57460: 28825,
              57461: 28818,
              57462: 28847,
              57463: 28913,
              57464: 28844,
              57465: 28856,
              57466: 28851,
              57467: 28846,
              57468: 28895,
              57469: 28875,
              57470: 28893,
              57472: 28889,
              57473: 28937,
              57474: 28925,
              57475: 28956,
              57476: 28953,
              57477: 29029,
              57478: 29013,
              57479: 29064,
              57480: 29030,
              57481: 29026,
              57482: 29004,
              57483: 29014,
              57484: 29036,
              57485: 29071,
              57486: 29179,
              57487: 29060,
              57488: 29077,
              57489: 29096,
              57490: 29100,
              57491: 29143,
              57492: 29113,
              57493: 29118,
              57494: 29138,
              57495: 29129,
              57496: 29140,
              57497: 29134,
              57498: 29152,
              57499: 29164,
              57500: 29159,
              57501: 29173,
              57502: 29180,
              57503: 29177,
              57504: 29183,
              57505: 29197,
              57506: 29200,
              57507: 29211,
              57508: 29224,
              57509: 29229,
              57510: 29228,
              57511: 29232,
              57512: 29234,
              57513: 29243,
              57514: 29244,
              57515: 29247,
              57516: 29248,
              57517: 29254,
              57518: 29259,
              57519: 29272,
              57520: 29300,
              57521: 29310,
              57522: 29314,
              57523: 29313,
              57524: 29319,
              57525: 29330,
              57526: 29334,
              57527: 29346,
              57528: 29351,
              57529: 29369,
              57530: 29362,
              57531: 29379,
              57532: 29382,
              57533: 29380,
              57534: 29390,
              57535: 29394,
              57536: 29410,
              57537: 29408,
              57538: 29409,
              57539: 29433,
              57540: 29431,
              57541: 20495,
              57542: 29463,
              57543: 29450,
              57544: 29468,
              57545: 29462,
              57546: 29469,
              57547: 29492,
              57548: 29487,
              57549: 29481,
              57550: 29477,
              57551: 29502,
              57552: 29518,
              57553: 29519,
              57554: 40664,
              57555: 29527,
              57556: 29546,
              57557: 29544,
              57558: 29552,
              57559: 29560,
              57560: 29557,
              57561: 29563,
              57562: 29562,
              57563: 29640,
              57564: 29619,
              57565: 29646,
              57566: 29627,
              57567: 29632,
              57568: 29669,
              57569: 29678,
              57570: 29662,
              57571: 29858,
              57572: 29701,
              57573: 29807,
              57574: 29733,
              57575: 29688,
              57576: 29746,
              57577: 29754,
              57578: 29781,
              57579: 29759,
              57580: 29791,
              57581: 29785,
              57582: 29761,
              57583: 29788,
              57584: 29801,
              57585: 29808,
              57586: 29795,
              57587: 29802,
              57588: 29814,
              57589: 29822,
              57590: 29835,
              57591: 29854,
              57592: 29863,
              57593: 29898,
              57594: 29903,
              57595: 29908,
              57596: 29681,
              57664: 29920,
              57665: 29923,
              57666: 29927,
              57667: 29929,
              57668: 29934,
              57669: 29938,
              57670: 29936,
              57671: 29937,
              57672: 29944,
              57673: 29943,
              57674: 29956,
              57675: 29955,
              57676: 29957,
              57677: 29964,
              57678: 29966,
              57679: 29965,
              57680: 29973,
              57681: 29971,
              57682: 29982,
              57683: 29990,
              57684: 29996,
              57685: 30012,
              57686: 30020,
              57687: 30029,
              57688: 30026,
              57689: 30025,
              57690: 30043,
              57691: 30022,
              57692: 30042,
              57693: 30057,
              57694: 30052,
              57695: 30055,
              57696: 30059,
              57697: 30061,
              57698: 30072,
              57699: 30070,
              57700: 30086,
              57701: 30087,
              57702: 30068,
              57703: 30090,
              57704: 30089,
              57705: 30082,
              57706: 30100,
              57707: 30106,
              57708: 30109,
              57709: 30117,
              57710: 30115,
              57711: 30146,
              57712: 30131,
              57713: 30147,
              57714: 30133,
              57715: 30141,
              57716: 30136,
              57717: 30140,
              57718: 30129,
              57719: 30157,
              57720: 30154,
              57721: 30162,
              57722: 30169,
              57723: 30179,
              57724: 30174,
              57725: 30206,
              57726: 30207,
              57728: 30204,
              57729: 30209,
              57730: 30192,
              57731: 30202,
              57732: 30194,
              57733: 30195,
              57734: 30219,
              57735: 30221,
              57736: 30217,
              57737: 30239,
              57738: 30247,
              57739: 30240,
              57740: 30241,
              57741: 30242,
              57742: 30244,
              57743: 30260,
              57744: 30256,
              57745: 30267,
              57746: 30279,
              57747: 30280,
              57748: 30278,
              57749: 30300,
              57750: 30296,
              57751: 30305,
              57752: 30306,
              57753: 30312,
              57754: 30313,
              57755: 30314,
              57756: 30311,
              57757: 30316,
              57758: 30320,
              57759: 30322,
              57760: 30326,
              57761: 30328,
              57762: 30332,
              57763: 30336,
              57764: 30339,
              57765: 30344,
              57766: 30347,
              57767: 30350,
              57768: 30358,
              57769: 30355,
              57770: 30361,
              57771: 30362,
              57772: 30384,
              57773: 30388,
              57774: 30392,
              57775: 30393,
              57776: 30394,
              57777: 30402,
              57778: 30413,
              57779: 30422,
              57780: 30418,
              57781: 30430,
              57782: 30433,
              57783: 30437,
              57784: 30439,
              57785: 30442,
              57786: 34351,
              57787: 30459,
              57788: 30472,
              57789: 30471,
              57790: 30468,
              57791: 30505,
              57792: 30500,
              57793: 30494,
              57794: 30501,
              57795: 30502,
              57796: 30491,
              57797: 30519,
              57798: 30520,
              57799: 30535,
              57800: 30554,
              57801: 30568,
              57802: 30571,
              57803: 30555,
              57804: 30565,
              57805: 30591,
              57806: 30590,
              57807: 30585,
              57808: 30606,
              57809: 30603,
              57810: 30609,
              57811: 30624,
              57812: 30622,
              57813: 30640,
              57814: 30646,
              57815: 30649,
              57816: 30655,
              57817: 30652,
              57818: 30653,
              57819: 30651,
              57820: 30663,
              57821: 30669,
              57822: 30679,
              57823: 30682,
              57824: 30684,
              57825: 30691,
              57826: 30702,
              57827: 30716,
              57828: 30732,
              57829: 30738,
              57830: 31014,
              57831: 30752,
              57832: 31018,
              57833: 30789,
              57834: 30862,
              57835: 30836,
              57836: 30854,
              57837: 30844,
              57838: 30874,
              57839: 30860,
              57840: 30883,
              57841: 30901,
              57842: 30890,
              57843: 30895,
              57844: 30929,
              57845: 30918,
              57846: 30923,
              57847: 30932,
              57848: 30910,
              57849: 30908,
              57850: 30917,
              57851: 30922,
              57852: 30956,
              57920: 30951,
              57921: 30938,
              57922: 30973,
              57923: 30964,
              57924: 30983,
              57925: 30994,
              57926: 30993,
              57927: 31001,
              57928: 31020,
              57929: 31019,
              57930: 31040,
              57931: 31072,
              57932: 31063,
              57933: 31071,
              57934: 31066,
              57935: 31061,
              57936: 31059,
              57937: 31098,
              57938: 31103,
              57939: 31114,
              57940: 31133,
              57941: 31143,
              57942: 40779,
              57943: 31146,
              57944: 31150,
              57945: 31155,
              57946: 31161,
              57947: 31162,
              57948: 31177,
              57949: 31189,
              57950: 31207,
              57951: 31212,
              57952: 31201,
              57953: 31203,
              57954: 31240,
              57955: 31245,
              57956: 31256,
              57957: 31257,
              57958: 31264,
              57959: 31263,
              57960: 31104,
              57961: 31281,
              57962: 31291,
              57963: 31294,
              57964: 31287,
              57965: 31299,
              57966: 31319,
              57967: 31305,
              57968: 31329,
              57969: 31330,
              57970: 31337,
              57971: 40861,
              57972: 31344,
              57973: 31353,
              57974: 31357,
              57975: 31368,
              57976: 31383,
              57977: 31381,
              57978: 31384,
              57979: 31382,
              57980: 31401,
              57981: 31432,
              57982: 31408,
              57984: 31414,
              57985: 31429,
              57986: 31428,
              57987: 31423,
              57988: 36995,
              57989: 31431,
              57990: 31434,
              57991: 31437,
              57992: 31439,
              57993: 31445,
              57994: 31443,
              57995: 31449,
              57996: 31450,
              57997: 31453,
              57998: 31457,
              57999: 31458,
              58e3: 31462,
              58001: 31469,
              58002: 31472,
              58003: 31490,
              58004: 31503,
              58005: 31498,
              58006: 31494,
              58007: 31539,
              58008: 31512,
              58009: 31513,
              58010: 31518,
              58011: 31541,
              58012: 31528,
              58013: 31542,
              58014: 31568,
              58015: 31610,
              58016: 31492,
              58017: 31565,
              58018: 31499,
              58019: 31564,
              58020: 31557,
              58021: 31605,
              58022: 31589,
              58023: 31604,
              58024: 31591,
              58025: 31600,
              58026: 31601,
              58027: 31596,
              58028: 31598,
              58029: 31645,
              58030: 31640,
              58031: 31647,
              58032: 31629,
              58033: 31644,
              58034: 31642,
              58035: 31627,
              58036: 31634,
              58037: 31631,
              58038: 31581,
              58039: 31641,
              58040: 31691,
              58041: 31681,
              58042: 31692,
              58043: 31695,
              58044: 31668,
              58045: 31686,
              58046: 31709,
              58047: 31721,
              58048: 31761,
              58049: 31764,
              58050: 31718,
              58051: 31717,
              58052: 31840,
              58053: 31744,
              58054: 31751,
              58055: 31763,
              58056: 31731,
              58057: 31735,
              58058: 31767,
              58059: 31757,
              58060: 31734,
              58061: 31779,
              58062: 31783,
              58063: 31786,
              58064: 31775,
              58065: 31799,
              58066: 31787,
              58067: 31805,
              58068: 31820,
              58069: 31811,
              58070: 31828,
              58071: 31823,
              58072: 31808,
              58073: 31824,
              58074: 31832,
              58075: 31839,
              58076: 31844,
              58077: 31830,
              58078: 31845,
              58079: 31852,
              58080: 31861,
              58081: 31875,
              58082: 31888,
              58083: 31908,
              58084: 31917,
              58085: 31906,
              58086: 31915,
              58087: 31905,
              58088: 31912,
              58089: 31923,
              58090: 31922,
              58091: 31921,
              58092: 31918,
              58093: 31929,
              58094: 31933,
              58095: 31936,
              58096: 31941,
              58097: 31938,
              58098: 31960,
              58099: 31954,
              58100: 31964,
              58101: 31970,
              58102: 39739,
              58103: 31983,
              58104: 31986,
              58105: 31988,
              58106: 31990,
              58107: 31994,
              58108: 32006,
              58176: 32002,
              58177: 32028,
              58178: 32021,
              58179: 32010,
              58180: 32069,
              58181: 32075,
              58182: 32046,
              58183: 32050,
              58184: 32063,
              58185: 32053,
              58186: 32070,
              58187: 32115,
              58188: 32086,
              58189: 32078,
              58190: 32114,
              58191: 32104,
              58192: 32110,
              58193: 32079,
              58194: 32099,
              58195: 32147,
              58196: 32137,
              58197: 32091,
              58198: 32143,
              58199: 32125,
              58200: 32155,
              58201: 32186,
              58202: 32174,
              58203: 32163,
              58204: 32181,
              58205: 32199,
              58206: 32189,
              58207: 32171,
              58208: 32317,
              58209: 32162,
              58210: 32175,
              58211: 32220,
              58212: 32184,
              58213: 32159,
              58214: 32176,
              58215: 32216,
              58216: 32221,
              58217: 32228,
              58218: 32222,
              58219: 32251,
              58220: 32242,
              58221: 32225,
              58222: 32261,
              58223: 32266,
              58224: 32291,
              58225: 32289,
              58226: 32274,
              58227: 32305,
              58228: 32287,
              58229: 32265,
              58230: 32267,
              58231: 32290,
              58232: 32326,
              58233: 32358,
              58234: 32315,
              58235: 32309,
              58236: 32313,
              58237: 32323,
              58238: 32311,
              58240: 32306,
              58241: 32314,
              58242: 32359,
              58243: 32349,
              58244: 32342,
              58245: 32350,
              58246: 32345,
              58247: 32346,
              58248: 32377,
              58249: 32362,
              58250: 32361,
              58251: 32380,
              58252: 32379,
              58253: 32387,
              58254: 32213,
              58255: 32381,
              58256: 36782,
              58257: 32383,
              58258: 32392,
              58259: 32393,
              58260: 32396,
              58261: 32402,
              58262: 32400,
              58263: 32403,
              58264: 32404,
              58265: 32406,
              58266: 32398,
              58267: 32411,
              58268: 32412,
              58269: 32568,
              58270: 32570,
              58271: 32581,
              58272: 32588,
              58273: 32589,
              58274: 32590,
              58275: 32592,
              58276: 32593,
              58277: 32597,
              58278: 32596,
              58279: 32600,
              58280: 32607,
              58281: 32608,
              58282: 32616,
              58283: 32617,
              58284: 32615,
              58285: 32632,
              58286: 32642,
              58287: 32646,
              58288: 32643,
              58289: 32648,
              58290: 32647,
              58291: 32652,
              58292: 32660,
              58293: 32670,
              58294: 32669,
              58295: 32666,
              58296: 32675,
              58297: 32687,
              58298: 32690,
              58299: 32697,
              58300: 32686,
              58301: 32694,
              58302: 32696,
              58303: 35697,
              58304: 32709,
              58305: 32710,
              58306: 32714,
              58307: 32725,
              58308: 32724,
              58309: 32737,
              58310: 32742,
              58311: 32745,
              58312: 32755,
              58313: 32761,
              58314: 39132,
              58315: 32774,
              58316: 32772,
              58317: 32779,
              58318: 32786,
              58319: 32792,
              58320: 32793,
              58321: 32796,
              58322: 32801,
              58323: 32808,
              58324: 32831,
              58325: 32827,
              58326: 32842,
              58327: 32838,
              58328: 32850,
              58329: 32856,
              58330: 32858,
              58331: 32863,
              58332: 32866,
              58333: 32872,
              58334: 32883,
              58335: 32882,
              58336: 32880,
              58337: 32886,
              58338: 32889,
              58339: 32893,
              58340: 32895,
              58341: 32900,
              58342: 32902,
              58343: 32901,
              58344: 32923,
              58345: 32915,
              58346: 32922,
              58347: 32941,
              58348: 20880,
              58349: 32940,
              58350: 32987,
              58351: 32997,
              58352: 32985,
              58353: 32989,
              58354: 32964,
              58355: 32986,
              58356: 32982,
              58357: 33033,
              58358: 33007,
              58359: 33009,
              58360: 33051,
              58361: 33065,
              58362: 33059,
              58363: 33071,
              58364: 33099,
              58432: 38539,
              58433: 33094,
              58434: 33086,
              58435: 33107,
              58436: 33105,
              58437: 33020,
              58438: 33137,
              58439: 33134,
              58440: 33125,
              58441: 33126,
              58442: 33140,
              58443: 33155,
              58444: 33160,
              58445: 33162,
              58446: 33152,
              58447: 33154,
              58448: 33184,
              58449: 33173,
              58450: 33188,
              58451: 33187,
              58452: 33119,
              58453: 33171,
              58454: 33193,
              58455: 33200,
              58456: 33205,
              58457: 33214,
              58458: 33208,
              58459: 33213,
              58460: 33216,
              58461: 33218,
              58462: 33210,
              58463: 33225,
              58464: 33229,
              58465: 33233,
              58466: 33241,
              58467: 33240,
              58468: 33224,
              58469: 33242,
              58470: 33247,
              58471: 33248,
              58472: 33255,
              58473: 33274,
              58474: 33275,
              58475: 33278,
              58476: 33281,
              58477: 33282,
              58478: 33285,
              58479: 33287,
              58480: 33290,
              58481: 33293,
              58482: 33296,
              58483: 33302,
              58484: 33321,
              58485: 33323,
              58486: 33336,
              58487: 33331,
              58488: 33344,
              58489: 33369,
              58490: 33368,
              58491: 33373,
              58492: 33370,
              58493: 33375,
              58494: 33380,
              58496: 33378,
              58497: 33384,
              58498: 33386,
              58499: 33387,
              58500: 33326,
              58501: 33393,
              58502: 33399,
              58503: 33400,
              58504: 33406,
              58505: 33421,
              58506: 33426,
              58507: 33451,
              58508: 33439,
              58509: 33467,
              58510: 33452,
              58511: 33505,
              58512: 33507,
              58513: 33503,
              58514: 33490,
              58515: 33524,
              58516: 33523,
              58517: 33530,
              58518: 33683,
              58519: 33539,
              58520: 33531,
              58521: 33529,
              58522: 33502,
              58523: 33542,
              58524: 33500,
              58525: 33545,
              58526: 33497,
              58527: 33589,
              58528: 33588,
              58529: 33558,
              58530: 33586,
              58531: 33585,
              58532: 33600,
              58533: 33593,
              58534: 33616,
              58535: 33605,
              58536: 33583,
              58537: 33579,
              58538: 33559,
              58539: 33560,
              58540: 33669,
              58541: 33690,
              58542: 33706,
              58543: 33695,
              58544: 33698,
              58545: 33686,
              58546: 33571,
              58547: 33678,
              58548: 33671,
              58549: 33674,
              58550: 33660,
              58551: 33717,
              58552: 33651,
              58553: 33653,
              58554: 33696,
              58555: 33673,
              58556: 33704,
              58557: 33780,
              58558: 33811,
              58559: 33771,
              58560: 33742,
              58561: 33789,
              58562: 33795,
              58563: 33752,
              58564: 33803,
              58565: 33729,
              58566: 33783,
              58567: 33799,
              58568: 33760,
              58569: 33778,
              58570: 33805,
              58571: 33826,
              58572: 33824,
              58573: 33725,
              58574: 33848,
              58575: 34054,
              58576: 33787,
              58577: 33901,
              58578: 33834,
              58579: 33852,
              58580: 34138,
              58581: 33924,
              58582: 33911,
              58583: 33899,
              58584: 33965,
              58585: 33902,
              58586: 33922,
              58587: 33897,
              58588: 33862,
              58589: 33836,
              58590: 33903,
              58591: 33913,
              58592: 33845,
              58593: 33994,
              58594: 33890,
              58595: 33977,
              58596: 33983,
              58597: 33951,
              58598: 34009,
              58599: 33997,
              58600: 33979,
              58601: 34010,
              58602: 34e3,
              58603: 33985,
              58604: 33990,
              58605: 34006,
              58606: 33953,
              58607: 34081,
              58608: 34047,
              58609: 34036,
              58610: 34071,
              58611: 34072,
              58612: 34092,
              58613: 34079,
              58614: 34069,
              58615: 34068,
              58616: 34044,
              58617: 34112,
              58618: 34147,
              58619: 34136,
              58620: 34120,
              58688: 34113,
              58689: 34306,
              58690: 34123,
              58691: 34133,
              58692: 34176,
              58693: 34212,
              58694: 34184,
              58695: 34193,
              58696: 34186,
              58697: 34216,
              58698: 34157,
              58699: 34196,
              58700: 34203,
              58701: 34282,
              58702: 34183,
              58703: 34204,
              58704: 34167,
              58705: 34174,
              58706: 34192,
              58707: 34249,
              58708: 34234,
              58709: 34255,
              58710: 34233,
              58711: 34256,
              58712: 34261,
              58713: 34269,
              58714: 34277,
              58715: 34268,
              58716: 34297,
              58717: 34314,
              58718: 34323,
              58719: 34315,
              58720: 34302,
              58721: 34298,
              58722: 34310,
              58723: 34338,
              58724: 34330,
              58725: 34352,
              58726: 34367,
              58727: 34381,
              58728: 20053,
              58729: 34388,
              58730: 34399,
              58731: 34407,
              58732: 34417,
              58733: 34451,
              58734: 34467,
              58735: 34473,
              58736: 34474,
              58737: 34443,
              58738: 34444,
              58739: 34486,
              58740: 34479,
              58741: 34500,
              58742: 34502,
              58743: 34480,
              58744: 34505,
              58745: 34851,
              58746: 34475,
              58747: 34516,
              58748: 34526,
              58749: 34537,
              58750: 34540,
              58752: 34527,
              58753: 34523,
              58754: 34543,
              58755: 34578,
              58756: 34566,
              58757: 34568,
              58758: 34560,
              58759: 34563,
              58760: 34555,
              58761: 34577,
              58762: 34569,
              58763: 34573,
              58764: 34553,
              58765: 34570,
              58766: 34612,
              58767: 34623,
              58768: 34615,
              58769: 34619,
              58770: 34597,
              58771: 34601,
              58772: 34586,
              58773: 34656,
              58774: 34655,
              58775: 34680,
              58776: 34636,
              58777: 34638,
              58778: 34676,
              58779: 34647,
              58780: 34664,
              58781: 34670,
              58782: 34649,
              58783: 34643,
              58784: 34659,
              58785: 34666,
              58786: 34821,
              58787: 34722,
              58788: 34719,
              58789: 34690,
              58790: 34735,
              58791: 34763,
              58792: 34749,
              58793: 34752,
              58794: 34768,
              58795: 38614,
              58796: 34731,
              58797: 34756,
              58798: 34739,
              58799: 34759,
              58800: 34758,
              58801: 34747,
              58802: 34799,
              58803: 34802,
              58804: 34784,
              58805: 34831,
              58806: 34829,
              58807: 34814,
              58808: 34806,
              58809: 34807,
              58810: 34830,
              58811: 34770,
              58812: 34833,
              58813: 34838,
              58814: 34837,
              58815: 34850,
              58816: 34849,
              58817: 34865,
              58818: 34870,
              58819: 34873,
              58820: 34855,
              58821: 34875,
              58822: 34884,
              58823: 34882,
              58824: 34898,
              58825: 34905,
              58826: 34910,
              58827: 34914,
              58828: 34923,
              58829: 34945,
              58830: 34942,
              58831: 34974,
              58832: 34933,
              58833: 34941,
              58834: 34997,
              58835: 34930,
              58836: 34946,
              58837: 34967,
              58838: 34962,
              58839: 34990,
              58840: 34969,
              58841: 34978,
              58842: 34957,
              58843: 34980,
              58844: 34992,
              58845: 35007,
              58846: 34993,
              58847: 35011,
              58848: 35012,
              58849: 35028,
              58850: 35032,
              58851: 35033,
              58852: 35037,
              58853: 35065,
              58854: 35074,
              58855: 35068,
              58856: 35060,
              58857: 35048,
              58858: 35058,
              58859: 35076,
              58860: 35084,
              58861: 35082,
              58862: 35091,
              58863: 35139,
              58864: 35102,
              58865: 35109,
              58866: 35114,
              58867: 35115,
              58868: 35137,
              58869: 35140,
              58870: 35131,
              58871: 35126,
              58872: 35128,
              58873: 35148,
              58874: 35101,
              58875: 35168,
              58876: 35166,
              58944: 35174,
              58945: 35172,
              58946: 35181,
              58947: 35178,
              58948: 35183,
              58949: 35188,
              58950: 35191,
              58951: 35198,
              58952: 35203,
              58953: 35208,
              58954: 35210,
              58955: 35219,
              58956: 35224,
              58957: 35233,
              58958: 35241,
              58959: 35238,
              58960: 35244,
              58961: 35247,
              58962: 35250,
              58963: 35258,
              58964: 35261,
              58965: 35263,
              58966: 35264,
              58967: 35290,
              58968: 35292,
              58969: 35293,
              58970: 35303,
              58971: 35316,
              58972: 35320,
              58973: 35331,
              58974: 35350,
              58975: 35344,
              58976: 35340,
              58977: 35355,
              58978: 35357,
              58979: 35365,
              58980: 35382,
              58981: 35393,
              58982: 35419,
              58983: 35410,
              58984: 35398,
              58985: 35400,
              58986: 35452,
              58987: 35437,
              58988: 35436,
              58989: 35426,
              58990: 35461,
              58991: 35458,
              58992: 35460,
              58993: 35496,
              58994: 35489,
              58995: 35473,
              58996: 35493,
              58997: 35494,
              58998: 35482,
              58999: 35491,
              59e3: 35524,
              59001: 35533,
              59002: 35522,
              59003: 35546,
              59004: 35563,
              59005: 35571,
              59006: 35559,
              59008: 35556,
              59009: 35569,
              59010: 35604,
              59011: 35552,
              59012: 35554,
              59013: 35575,
              59014: 35550,
              59015: 35547,
              59016: 35596,
              59017: 35591,
              59018: 35610,
              59019: 35553,
              59020: 35606,
              59021: 35600,
              59022: 35607,
              59023: 35616,
              59024: 35635,
              59025: 38827,
              59026: 35622,
              59027: 35627,
              59028: 35646,
              59029: 35624,
              59030: 35649,
              59031: 35660,
              59032: 35663,
              59033: 35662,
              59034: 35657,
              59035: 35670,
              59036: 35675,
              59037: 35674,
              59038: 35691,
              59039: 35679,
              59040: 35692,
              59041: 35695,
              59042: 35700,
              59043: 35709,
              59044: 35712,
              59045: 35724,
              59046: 35726,
              59047: 35730,
              59048: 35731,
              59049: 35734,
              59050: 35737,
              59051: 35738,
              59052: 35898,
              59053: 35905,
              59054: 35903,
              59055: 35912,
              59056: 35916,
              59057: 35918,
              59058: 35920,
              59059: 35925,
              59060: 35938,
              59061: 35948,
              59062: 35960,
              59063: 35962,
              59064: 35970,
              59065: 35977,
              59066: 35973,
              59067: 35978,
              59068: 35981,
              59069: 35982,
              59070: 35988,
              59071: 35964,
              59072: 35992,
              59073: 25117,
              59074: 36013,
              59075: 36010,
              59076: 36029,
              59077: 36018,
              59078: 36019,
              59079: 36014,
              59080: 36022,
              59081: 36040,
              59082: 36033,
              59083: 36068,
              59084: 36067,
              59085: 36058,
              59086: 36093,
              59087: 36090,
              59088: 36091,
              59089: 36100,
              59090: 36101,
              59091: 36106,
              59092: 36103,
              59093: 36111,
              59094: 36109,
              59095: 36112,
              59096: 40782,
              59097: 36115,
              59098: 36045,
              59099: 36116,
              59100: 36118,
              59101: 36199,
              59102: 36205,
              59103: 36209,
              59104: 36211,
              59105: 36225,
              59106: 36249,
              59107: 36290,
              59108: 36286,
              59109: 36282,
              59110: 36303,
              59111: 36314,
              59112: 36310,
              59113: 36300,
              59114: 36315,
              59115: 36299,
              59116: 36330,
              59117: 36331,
              59118: 36319,
              59119: 36323,
              59120: 36348,
              59121: 36360,
              59122: 36361,
              59123: 36351,
              59124: 36381,
              59125: 36382,
              59126: 36368,
              59127: 36383,
              59128: 36418,
              59129: 36405,
              59130: 36400,
              59131: 36404,
              59132: 36426,
              59200: 36423,
              59201: 36425,
              59202: 36428,
              59203: 36432,
              59204: 36424,
              59205: 36441,
              59206: 36452,
              59207: 36448,
              59208: 36394,
              59209: 36451,
              59210: 36437,
              59211: 36470,
              59212: 36466,
              59213: 36476,
              59214: 36481,
              59215: 36487,
              59216: 36485,
              59217: 36484,
              59218: 36491,
              59219: 36490,
              59220: 36499,
              59221: 36497,
              59222: 36500,
              59223: 36505,
              59224: 36522,
              59225: 36513,
              59226: 36524,
              59227: 36528,
              59228: 36550,
              59229: 36529,
              59230: 36542,
              59231: 36549,
              59232: 36552,
              59233: 36555,
              59234: 36571,
              59235: 36579,
              59236: 36604,
              59237: 36603,
              59238: 36587,
              59239: 36606,
              59240: 36618,
              59241: 36613,
              59242: 36629,
              59243: 36626,
              59244: 36633,
              59245: 36627,
              59246: 36636,
              59247: 36639,
              59248: 36635,
              59249: 36620,
              59250: 36646,
              59251: 36659,
              59252: 36667,
              59253: 36665,
              59254: 36677,
              59255: 36674,
              59256: 36670,
              59257: 36684,
              59258: 36681,
              59259: 36678,
              59260: 36686,
              59261: 36695,
              59262: 36700,
              59264: 36706,
              59265: 36707,
              59266: 36708,
              59267: 36764,
              59268: 36767,
              59269: 36771,
              59270: 36781,
              59271: 36783,
              59272: 36791,
              59273: 36826,
              59274: 36837,
              59275: 36834,
              59276: 36842,
              59277: 36847,
              59278: 36999,
              59279: 36852,
              59280: 36869,
              59281: 36857,
              59282: 36858,
              59283: 36881,
              59284: 36885,
              59285: 36897,
              59286: 36877,
              59287: 36894,
              59288: 36886,
              59289: 36875,
              59290: 36903,
              59291: 36918,
              59292: 36917,
              59293: 36921,
              59294: 36856,
              59295: 36943,
              59296: 36944,
              59297: 36945,
              59298: 36946,
              59299: 36878,
              59300: 36937,
              59301: 36926,
              59302: 36950,
              59303: 36952,
              59304: 36958,
              59305: 36968,
              59306: 36975,
              59307: 36982,
              59308: 38568,
              59309: 36978,
              59310: 36994,
              59311: 36989,
              59312: 36993,
              59313: 36992,
              59314: 37002,
              59315: 37001,
              59316: 37007,
              59317: 37032,
              59318: 37039,
              59319: 37041,
              59320: 37045,
              59321: 37090,
              59322: 37092,
              59323: 25160,
              59324: 37083,
              59325: 37122,
              59326: 37138,
              59327: 37145,
              59328: 37170,
              59329: 37168,
              59330: 37194,
              59331: 37206,
              59332: 37208,
              59333: 37219,
              59334: 37221,
              59335: 37225,
              59336: 37235,
              59337: 37234,
              59338: 37259,
              59339: 37257,
              59340: 37250,
              59341: 37282,
              59342: 37291,
              59343: 37295,
              59344: 37290,
              59345: 37301,
              59346: 37300,
              59347: 37306,
              59348: 37312,
              59349: 37313,
              59350: 37321,
              59351: 37323,
              59352: 37328,
              59353: 37334,
              59354: 37343,
              59355: 37345,
              59356: 37339,
              59357: 37372,
              59358: 37365,
              59359: 37366,
              59360: 37406,
              59361: 37375,
              59362: 37396,
              59363: 37420,
              59364: 37397,
              59365: 37393,
              59366: 37470,
              59367: 37463,
              59368: 37445,
              59369: 37449,
              59370: 37476,
              59371: 37448,
              59372: 37525,
              59373: 37439,
              59374: 37451,
              59375: 37456,
              59376: 37532,
              59377: 37526,
              59378: 37523,
              59379: 37531,
              59380: 37466,
              59381: 37583,
              59382: 37561,
              59383: 37559,
              59384: 37609,
              59385: 37647,
              59386: 37626,
              59387: 37700,
              59388: 37678,
              59456: 37657,
              59457: 37666,
              59458: 37658,
              59459: 37667,
              59460: 37690,
              59461: 37685,
              59462: 37691,
              59463: 37724,
              59464: 37728,
              59465: 37756,
              59466: 37742,
              59467: 37718,
              59468: 37808,
              59469: 37804,
              59470: 37805,
              59471: 37780,
              59472: 37817,
              59473: 37846,
              59474: 37847,
              59475: 37864,
              59476: 37861,
              59477: 37848,
              59478: 37827,
              59479: 37853,
              59480: 37840,
              59481: 37832,
              59482: 37860,
              59483: 37914,
              59484: 37908,
              59485: 37907,
              59486: 37891,
              59487: 37895,
              59488: 37904,
              59489: 37942,
              59490: 37931,
              59491: 37941,
              59492: 37921,
              59493: 37946,
              59494: 37953,
              59495: 37970,
              59496: 37956,
              59497: 37979,
              59498: 37984,
              59499: 37986,
              59500: 37982,
              59501: 37994,
              59502: 37417,
              59503: 38e3,
              59504: 38005,
              59505: 38007,
              59506: 38013,
              59507: 37978,
              59508: 38012,
              59509: 38014,
              59510: 38017,
              59511: 38015,
              59512: 38274,
              59513: 38279,
              59514: 38282,
              59515: 38292,
              59516: 38294,
              59517: 38296,
              59518: 38297,
              59520: 38304,
              59521: 38312,
              59522: 38311,
              59523: 38317,
              59524: 38332,
              59525: 38331,
              59526: 38329,
              59527: 38334,
              59528: 38346,
              59529: 28662,
              59530: 38339,
              59531: 38349,
              59532: 38348,
              59533: 38357,
              59534: 38356,
              59535: 38358,
              59536: 38364,
              59537: 38369,
              59538: 38373,
              59539: 38370,
              59540: 38433,
              59541: 38440,
              59542: 38446,
              59543: 38447,
              59544: 38466,
              59545: 38476,
              59546: 38479,
              59547: 38475,
              59548: 38519,
              59549: 38492,
              59550: 38494,
              59551: 38493,
              59552: 38495,
              59553: 38502,
              59554: 38514,
              59555: 38508,
              59556: 38541,
              59557: 38552,
              59558: 38549,
              59559: 38551,
              59560: 38570,
              59561: 38567,
              59562: 38577,
              59563: 38578,
              59564: 38576,
              59565: 38580,
              59566: 38582,
              59567: 38584,
              59568: 38585,
              59569: 38606,
              59570: 38603,
              59571: 38601,
              59572: 38605,
              59573: 35149,
              59574: 38620,
              59575: 38669,
              59576: 38613,
              59577: 38649,
              59578: 38660,
              59579: 38662,
              59580: 38664,
              59581: 38675,
              59582: 38670,
              59583: 38673,
              59584: 38671,
              59585: 38678,
              59586: 38681,
              59587: 38692,
              59588: 38698,
              59589: 38704,
              59590: 38713,
              59591: 38717,
              59592: 38718,
              59593: 38724,
              59594: 38726,
              59595: 38728,
              59596: 38722,
              59597: 38729,
              59598: 38748,
              59599: 38752,
              59600: 38756,
              59601: 38758,
              59602: 38760,
              59603: 21202,
              59604: 38763,
              59605: 38769,
              59606: 38777,
              59607: 38789,
              59608: 38780,
              59609: 38785,
              59610: 38778,
              59611: 38790,
              59612: 38795,
              59613: 38799,
              59614: 38800,
              59615: 38812,
              59616: 38824,
              59617: 38822,
              59618: 38819,
              59619: 38835,
              59620: 38836,
              59621: 38851,
              59622: 38854,
              59623: 38856,
              59624: 38859,
              59625: 38876,
              59626: 38893,
              59627: 40783,
              59628: 38898,
              59629: 31455,
              59630: 38902,
              59631: 38901,
              59632: 38927,
              59633: 38924,
              59634: 38968,
              59635: 38948,
              59636: 38945,
              59637: 38967,
              59638: 38973,
              59639: 38982,
              59640: 38991,
              59641: 38987,
              59642: 39019,
              59643: 39023,
              59644: 39024,
              59712: 39025,
              59713: 39028,
              59714: 39027,
              59715: 39082,
              59716: 39087,
              59717: 39089,
              59718: 39094,
              59719: 39108,
              59720: 39107,
              59721: 39110,
              59722: 39145,
              59723: 39147,
              59724: 39171,
              59725: 39177,
              59726: 39186,
              59727: 39188,
              59728: 39192,
              59729: 39201,
              59730: 39197,
              59731: 39198,
              59732: 39204,
              59733: 39200,
              59734: 39212,
              59735: 39214,
              59736: 39229,
              59737: 39230,
              59738: 39234,
              59739: 39241,
              59740: 39237,
              59741: 39248,
              59742: 39243,
              59743: 39249,
              59744: 39250,
              59745: 39244,
              59746: 39253,
              59747: 39319,
              59748: 39320,
              59749: 39333,
              59750: 39341,
              59751: 39342,
              59752: 39356,
              59753: 39391,
              59754: 39387,
              59755: 39389,
              59756: 39384,
              59757: 39377,
              59758: 39405,
              59759: 39406,
              59760: 39409,
              59761: 39410,
              59762: 39419,
              59763: 39416,
              59764: 39425,
              59765: 39439,
              59766: 39429,
              59767: 39394,
              59768: 39449,
              59769: 39467,
              59770: 39479,
              59771: 39493,
              59772: 39490,
              59773: 39488,
              59774: 39491,
              59776: 39486,
              59777: 39509,
              59778: 39501,
              59779: 39515,
              59780: 39511,
              59781: 39519,
              59782: 39522,
              59783: 39525,
              59784: 39524,
              59785: 39529,
              59786: 39531,
              59787: 39530,
              59788: 39597,
              59789: 39600,
              59790: 39612,
              59791: 39616,
              59792: 39631,
              59793: 39633,
              59794: 39635,
              59795: 39636,
              59796: 39646,
              59797: 39647,
              59798: 39650,
              59799: 39651,
              59800: 39654,
              59801: 39663,
              59802: 39659,
              59803: 39662,
              59804: 39668,
              59805: 39665,
              59806: 39671,
              59807: 39675,
              59808: 39686,
              59809: 39704,
              59810: 39706,
              59811: 39711,
              59812: 39714,
              59813: 39715,
              59814: 39717,
              59815: 39719,
              59816: 39720,
              59817: 39721,
              59818: 39722,
              59819: 39726,
              59820: 39727,
              59821: 39730,
              59822: 39748,
              59823: 39747,
              59824: 39759,
              59825: 39757,
              59826: 39758,
              59827: 39761,
              59828: 39768,
              59829: 39796,
              59830: 39827,
              59831: 39811,
              59832: 39825,
              59833: 39830,
              59834: 39831,
              59835: 39839,
              59836: 39840,
              59837: 39848,
              59838: 39860,
              59839: 39872,
              59840: 39882,
              59841: 39865,
              59842: 39878,
              59843: 39887,
              59844: 39889,
              59845: 39890,
              59846: 39907,
              59847: 39906,
              59848: 39908,
              59849: 39892,
              59850: 39905,
              59851: 39994,
              59852: 39922,
              59853: 39921,
              59854: 39920,
              59855: 39957,
              59856: 39956,
              59857: 39945,
              59858: 39955,
              59859: 39948,
              59860: 39942,
              59861: 39944,
              59862: 39954,
              59863: 39946,
              59864: 39940,
              59865: 39982,
              59866: 39963,
              59867: 39973,
              59868: 39972,
              59869: 39969,
              59870: 39984,
              59871: 40007,
              59872: 39986,
              59873: 40006,
              59874: 39998,
              59875: 40026,
              59876: 40032,
              59877: 40039,
              59878: 40054,
              59879: 40056,
              59880: 40167,
              59881: 40172,
              59882: 40176,
              59883: 40201,
              59884: 40200,
              59885: 40171,
              59886: 40195,
              59887: 40198,
              59888: 40234,
              59889: 40230,
              59890: 40367,
              59891: 40227,
              59892: 40223,
              59893: 40260,
              59894: 40213,
              59895: 40210,
              59896: 40257,
              59897: 40255,
              59898: 40254,
              59899: 40262,
              59900: 40264,
              59968: 40285,
              59969: 40286,
              59970: 40292,
              59971: 40273,
              59972: 40272,
              59973: 40281,
              59974: 40306,
              59975: 40329,
              59976: 40327,
              59977: 40363,
              59978: 40303,
              59979: 40314,
              59980: 40346,
              59981: 40356,
              59982: 40361,
              59983: 40370,
              59984: 40388,
              59985: 40385,
              59986: 40379,
              59987: 40376,
              59988: 40378,
              59989: 40390,
              59990: 40399,
              59991: 40386,
              59992: 40409,
              59993: 40403,
              59994: 40440,
              59995: 40422,
              59996: 40429,
              59997: 40431,
              59998: 40445,
              59999: 40474,
              6e4: 40475,
              60001: 40478,
              60002: 40565,
              60003: 40569,
              60004: 40573,
              60005: 40577,
              60006: 40584,
              60007: 40587,
              60008: 40588,
              60009: 40594,
              60010: 40597,
              60011: 40593,
              60012: 40605,
              60013: 40613,
              60014: 40617,
              60015: 40632,
              60016: 40618,
              60017: 40621,
              60018: 38753,
              60019: 40652,
              60020: 40654,
              60021: 40655,
              60022: 40656,
              60023: 40660,
              60024: 40668,
              60025: 40670,
              60026: 40669,
              60027: 40672,
              60028: 40677,
              60029: 40680,
              60030: 40687,
              60032: 40692,
              60033: 40694,
              60034: 40695,
              60035: 40697,
              60036: 40699,
              60037: 40700,
              60038: 40701,
              60039: 40711,
              60040: 40712,
              60041: 30391,
              60042: 40725,
              60043: 40737,
              60044: 40748,
              60045: 40766,
              60046: 40778,
              60047: 40786,
              60048: 40788,
              60049: 40803,
              60050: 40799,
              60051: 40800,
              60052: 40801,
              60053: 40806,
              60054: 40807,
              60055: 40812,
              60056: 40810,
              60057: 40823,
              60058: 40818,
              60059: 40822,
              60060: 40853,
              60061: 40860,
              60062: 40864,
              60063: 22575,
              60064: 27079,
              60065: 36953,
              60066: 29796,
              60067: 20956,
              60068: 29081
            };
          }),
          /* 9 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var GenericGF_1 = __webpack_require__(1);
            var GenericGFPoly_1 = __webpack_require__(2);
            function runEuclideanAlgorithm(field, a, b, R) {
              var _a;
              if (a.degree() < b.degree()) {
                _a = [b, a], a = _a[0], b = _a[1];
              }
              var rLast = a;
              var r = b;
              var tLast = field.zero;
              var t = field.one;
              while (r.degree() >= R / 2) {
                var rLastLast = rLast;
                var tLastLast = tLast;
                rLast = r;
                tLast = t;
                if (rLast.isZero()) {
                  return null;
                }
                r = rLastLast;
                var q = field.zero;
                var denominatorLeadingTerm = rLast.getCoefficient(rLast.degree());
                var dltInverse = field.inverse(denominatorLeadingTerm);
                while (r.degree() >= rLast.degree() && !r.isZero()) {
                  var degreeDiff = r.degree() - rLast.degree();
                  var scale = field.multiply(r.getCoefficient(r.degree()), dltInverse);
                  q = q.addOrSubtract(field.buildMonomial(degreeDiff, scale));
                  r = r.addOrSubtract(rLast.multiplyByMonomial(degreeDiff, scale));
                }
                t = q.multiplyPoly(tLast).addOrSubtract(tLastLast);
                if (r.degree() >= rLast.degree()) {
                  return null;
                }
              }
              var sigmaTildeAtZero = t.getCoefficient(0);
              if (sigmaTildeAtZero === 0) {
                return null;
              }
              var inverse = field.inverse(sigmaTildeAtZero);
              return [t.multiply(inverse), r.multiply(inverse)];
            }
            function findErrorLocations(field, errorLocator) {
              var numErrors = errorLocator.degree();
              if (numErrors === 1) {
                return [errorLocator.getCoefficient(1)];
              }
              var result = new Array(numErrors);
              var errorCount = 0;
              for (var i = 1; i < field.size && errorCount < numErrors; i++) {
                if (errorLocator.evaluateAt(i) === 0) {
                  result[errorCount] = field.inverse(i);
                  errorCount++;
                }
              }
              if (errorCount !== numErrors) {
                return null;
              }
              return result;
            }
            function findErrorMagnitudes(field, errorEvaluator, errorLocations) {
              var s = errorLocations.length;
              var result = new Array(s);
              for (var i = 0; i < s; i++) {
                var xiInverse = field.inverse(errorLocations[i]);
                var denominator = 1;
                for (var j = 0; j < s; j++) {
                  if (i !== j) {
                    denominator = field.multiply(denominator, GenericGF_1.addOrSubtractGF(1, field.multiply(errorLocations[j], xiInverse)));
                  }
                }
                result[i] = field.multiply(errorEvaluator.evaluateAt(xiInverse), field.inverse(denominator));
                if (field.generatorBase !== 0) {
                  result[i] = field.multiply(result[i], xiInverse);
                }
              }
              return result;
            }
            function decode(bytes, twoS) {
              var outputBytes = new Uint8ClampedArray(bytes.length);
              outputBytes.set(bytes);
              var field = new GenericGF_1.default(285, 256, 0);
              var poly = new GenericGFPoly_1.default(field, outputBytes);
              var syndromeCoefficients = new Uint8ClampedArray(twoS);
              var error = false;
              for (var s = 0; s < twoS; s++) {
                var evaluation = poly.evaluateAt(field.exp(s + field.generatorBase));
                syndromeCoefficients[syndromeCoefficients.length - 1 - s] = evaluation;
                if (evaluation !== 0) {
                  error = true;
                }
              }
              if (!error) {
                return outputBytes;
              }
              var syndrome = new GenericGFPoly_1.default(field, syndromeCoefficients);
              var sigmaOmega = runEuclideanAlgorithm(field, field.buildMonomial(twoS, 1), syndrome, twoS);
              if (sigmaOmega === null) {
                return null;
              }
              var errorLocations = findErrorLocations(field, sigmaOmega[0]);
              if (errorLocations == null) {
                return null;
              }
              var errorMagnitudes = findErrorMagnitudes(field, sigmaOmega[1], errorLocations);
              for (var i = 0; i < errorLocations.length; i++) {
                var position = outputBytes.length - 1 - field.log(errorLocations[i]);
                if (position < 0) {
                  return null;
                }
                outputBytes[position] = GenericGF_1.addOrSubtractGF(outputBytes[position], errorMagnitudes[i]);
              }
              return outputBytes;
            }
            exports2.decode = decode;
          }),
          /* 10 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            exports2.VERSIONS = [
              {
                infoBits: null,
                versionNumber: 1,
                alignmentPatternCenters: [],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 7,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 19 }]
                  },
                  {
                    ecCodewordsPerBlock: 10,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 16 }]
                  },
                  {
                    ecCodewordsPerBlock: 13,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 13 }]
                  },
                  {
                    ecCodewordsPerBlock: 17,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 9 }]
                  }
                ]
              },
              {
                infoBits: null,
                versionNumber: 2,
                alignmentPatternCenters: [6, 18],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 10,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 34 }]
                  },
                  {
                    ecCodewordsPerBlock: 16,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 28 }]
                  },
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 22 }]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 16 }]
                  }
                ]
              },
              {
                infoBits: null,
                versionNumber: 3,
                alignmentPatternCenters: [6, 22],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 15,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 55 }]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 44 }]
                  },
                  {
                    ecCodewordsPerBlock: 18,
                    ecBlocks: [{ numBlocks: 2, dataCodewordsPerBlock: 17 }]
                  },
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [{ numBlocks: 2, dataCodewordsPerBlock: 13 }]
                  }
                ]
              },
              {
                infoBits: null,
                versionNumber: 4,
                alignmentPatternCenters: [6, 26],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 20,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 80 }]
                  },
                  {
                    ecCodewordsPerBlock: 18,
                    ecBlocks: [{ numBlocks: 2, dataCodewordsPerBlock: 32 }]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [{ numBlocks: 2, dataCodewordsPerBlock: 24 }]
                  },
                  {
                    ecCodewordsPerBlock: 16,
                    ecBlocks: [{ numBlocks: 4, dataCodewordsPerBlock: 9 }]
                  }
                ]
              },
              {
                infoBits: null,
                versionNumber: 5,
                alignmentPatternCenters: [6, 30],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 108 }]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [{ numBlocks: 2, dataCodewordsPerBlock: 43 }]
                  },
                  {
                    ecCodewordsPerBlock: 18,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 15 },
                      { numBlocks: 2, dataCodewordsPerBlock: 16 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 11 },
                      { numBlocks: 2, dataCodewordsPerBlock: 12 }
                    ]
                  }
                ]
              },
              {
                infoBits: null,
                versionNumber: 6,
                alignmentPatternCenters: [6, 34],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 18,
                    ecBlocks: [{ numBlocks: 2, dataCodewordsPerBlock: 68 }]
                  },
                  {
                    ecCodewordsPerBlock: 16,
                    ecBlocks: [{ numBlocks: 4, dataCodewordsPerBlock: 27 }]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [{ numBlocks: 4, dataCodewordsPerBlock: 19 }]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [{ numBlocks: 4, dataCodewordsPerBlock: 15 }]
                  }
                ]
              },
              {
                infoBits: 31892,
                versionNumber: 7,
                alignmentPatternCenters: [6, 22, 38],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 20,
                    ecBlocks: [{ numBlocks: 2, dataCodewordsPerBlock: 78 }]
                  },
                  {
                    ecCodewordsPerBlock: 18,
                    ecBlocks: [{ numBlocks: 4, dataCodewordsPerBlock: 31 }]
                  },
                  {
                    ecCodewordsPerBlock: 18,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 14 },
                      { numBlocks: 4, dataCodewordsPerBlock: 15 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 13 },
                      { numBlocks: 1, dataCodewordsPerBlock: 14 }
                    ]
                  }
                ]
              },
              {
                infoBits: 34236,
                versionNumber: 8,
                alignmentPatternCenters: [6, 24, 42],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [{ numBlocks: 2, dataCodewordsPerBlock: 97 }]
                  },
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 38 },
                      { numBlocks: 2, dataCodewordsPerBlock: 39 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 18 },
                      { numBlocks: 2, dataCodewordsPerBlock: 19 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 14 },
                      { numBlocks: 2, dataCodewordsPerBlock: 15 }
                    ]
                  }
                ]
              },
              {
                infoBits: 39577,
                versionNumber: 9,
                alignmentPatternCenters: [6, 26, 46],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [{ numBlocks: 2, dataCodewordsPerBlock: 116 }]
                  },
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 36 },
                      { numBlocks: 2, dataCodewordsPerBlock: 37 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 20,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 16 },
                      { numBlocks: 4, dataCodewordsPerBlock: 17 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 12 },
                      { numBlocks: 4, dataCodewordsPerBlock: 13 }
                    ]
                  }
                ]
              },
              {
                infoBits: 42195,
                versionNumber: 10,
                alignmentPatternCenters: [6, 28, 50],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 18,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 68 },
                      { numBlocks: 2, dataCodewordsPerBlock: 69 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 43 },
                      { numBlocks: 1, dataCodewordsPerBlock: 44 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 6, dataCodewordsPerBlock: 19 },
                      { numBlocks: 2, dataCodewordsPerBlock: 20 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 6, dataCodewordsPerBlock: 15 },
                      { numBlocks: 2, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 48118,
                versionNumber: 11,
                alignmentPatternCenters: [6, 30, 54],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 20,
                    ecBlocks: [{ numBlocks: 4, dataCodewordsPerBlock: 81 }]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 1, dataCodewordsPerBlock: 50 },
                      { numBlocks: 4, dataCodewordsPerBlock: 51 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 22 },
                      { numBlocks: 4, dataCodewordsPerBlock: 23 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 12 },
                      { numBlocks: 8, dataCodewordsPerBlock: 13 }
                    ]
                  }
                ]
              },
              {
                infoBits: 51042,
                versionNumber: 12,
                alignmentPatternCenters: [6, 32, 58],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 92 },
                      { numBlocks: 2, dataCodewordsPerBlock: 93 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [
                      { numBlocks: 6, dataCodewordsPerBlock: 36 },
                      { numBlocks: 2, dataCodewordsPerBlock: 37 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 20 },
                      { numBlocks: 6, dataCodewordsPerBlock: 21 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 7, dataCodewordsPerBlock: 14 },
                      { numBlocks: 4, dataCodewordsPerBlock: 15 }
                    ]
                  }
                ]
              },
              {
                infoBits: 55367,
                versionNumber: 13,
                alignmentPatternCenters: [6, 34, 62],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [{ numBlocks: 4, dataCodewordsPerBlock: 107 }]
                  },
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [
                      { numBlocks: 8, dataCodewordsPerBlock: 37 },
                      { numBlocks: 1, dataCodewordsPerBlock: 38 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 8, dataCodewordsPerBlock: 20 },
                      { numBlocks: 4, dataCodewordsPerBlock: 21 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [
                      { numBlocks: 12, dataCodewordsPerBlock: 11 },
                      { numBlocks: 4, dataCodewordsPerBlock: 12 }
                    ]
                  }
                ]
              },
              {
                infoBits: 58893,
                versionNumber: 14,
                alignmentPatternCenters: [6, 26, 46, 66],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 115 },
                      { numBlocks: 1, dataCodewordsPerBlock: 116 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 40 },
                      { numBlocks: 5, dataCodewordsPerBlock: 41 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 20,
                    ecBlocks: [
                      { numBlocks: 11, dataCodewordsPerBlock: 16 },
                      { numBlocks: 5, dataCodewordsPerBlock: 17 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 11, dataCodewordsPerBlock: 12 },
                      { numBlocks: 5, dataCodewordsPerBlock: 13 }
                    ]
                  }
                ]
              },
              {
                infoBits: 63784,
                versionNumber: 15,
                alignmentPatternCenters: [6, 26, 48, 70],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [
                      { numBlocks: 5, dataCodewordsPerBlock: 87 },
                      { numBlocks: 1, dataCodewordsPerBlock: 88 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 5, dataCodewordsPerBlock: 41 },
                      { numBlocks: 5, dataCodewordsPerBlock: 42 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 5, dataCodewordsPerBlock: 24 },
                      { numBlocks: 7, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 11, dataCodewordsPerBlock: 12 },
                      { numBlocks: 7, dataCodewordsPerBlock: 13 }
                    ]
                  }
                ]
              },
              {
                infoBits: 68472,
                versionNumber: 16,
                alignmentPatternCenters: [6, 26, 50, 74],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 5, dataCodewordsPerBlock: 98 },
                      { numBlocks: 1, dataCodewordsPerBlock: 99 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 7, dataCodewordsPerBlock: 45 },
                      { numBlocks: 3, dataCodewordsPerBlock: 46 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 15, dataCodewordsPerBlock: 19 },
                      { numBlocks: 2, dataCodewordsPerBlock: 20 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 15 },
                      { numBlocks: 13, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 70749,
                versionNumber: 17,
                alignmentPatternCenters: [6, 30, 54, 78],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 1, dataCodewordsPerBlock: 107 },
                      { numBlocks: 5, dataCodewordsPerBlock: 108 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 10, dataCodewordsPerBlock: 46 },
                      { numBlocks: 1, dataCodewordsPerBlock: 47 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 1, dataCodewordsPerBlock: 22 },
                      { numBlocks: 15, dataCodewordsPerBlock: 23 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 14 },
                      { numBlocks: 17, dataCodewordsPerBlock: 15 }
                    ]
                  }
                ]
              },
              {
                infoBits: 76311,
                versionNumber: 18,
                alignmentPatternCenters: [6, 30, 56, 82],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 5, dataCodewordsPerBlock: 120 },
                      { numBlocks: 1, dataCodewordsPerBlock: 121 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 9, dataCodewordsPerBlock: 43 },
                      { numBlocks: 4, dataCodewordsPerBlock: 44 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 17, dataCodewordsPerBlock: 22 },
                      { numBlocks: 1, dataCodewordsPerBlock: 23 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 14 },
                      { numBlocks: 19, dataCodewordsPerBlock: 15 }
                    ]
                  }
                ]
              },
              {
                infoBits: 79154,
                versionNumber: 19,
                alignmentPatternCenters: [6, 30, 58, 86],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 113 },
                      { numBlocks: 4, dataCodewordsPerBlock: 114 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 44 },
                      { numBlocks: 11, dataCodewordsPerBlock: 45 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 17, dataCodewordsPerBlock: 21 },
                      { numBlocks: 4, dataCodewordsPerBlock: 22 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 9, dataCodewordsPerBlock: 13 },
                      { numBlocks: 16, dataCodewordsPerBlock: 14 }
                    ]
                  }
                ]
              },
              {
                infoBits: 84390,
                versionNumber: 20,
                alignmentPatternCenters: [6, 34, 62, 90],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 107 },
                      { numBlocks: 5, dataCodewordsPerBlock: 108 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 41 },
                      { numBlocks: 13, dataCodewordsPerBlock: 42 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 15, dataCodewordsPerBlock: 24 },
                      { numBlocks: 5, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 15, dataCodewordsPerBlock: 15 },
                      { numBlocks: 10, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 87683,
                versionNumber: 21,
                alignmentPatternCenters: [6, 28, 50, 72, 94],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 116 },
                      { numBlocks: 4, dataCodewordsPerBlock: 117 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [{ numBlocks: 17, dataCodewordsPerBlock: 42 }]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 17, dataCodewordsPerBlock: 22 },
                      { numBlocks: 6, dataCodewordsPerBlock: 23 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 19, dataCodewordsPerBlock: 16 },
                      { numBlocks: 6, dataCodewordsPerBlock: 17 }
                    ]
                  }
                ]
              },
              {
                infoBits: 92361,
                versionNumber: 22,
                alignmentPatternCenters: [6, 26, 50, 74, 98],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 111 },
                      { numBlocks: 7, dataCodewordsPerBlock: 112 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [{ numBlocks: 17, dataCodewordsPerBlock: 46 }]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 7, dataCodewordsPerBlock: 24 },
                      { numBlocks: 16, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [{ numBlocks: 34, dataCodewordsPerBlock: 13 }]
                  }
                ]
              },
              {
                infoBits: 96236,
                versionNumber: 23,
                alignmentPatternCenters: [6, 30, 54, 74, 102],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 121 },
                      { numBlocks: 5, dataCodewordsPerBlock: 122 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 47 },
                      { numBlocks: 14, dataCodewordsPerBlock: 48 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 11, dataCodewordsPerBlock: 24 },
                      { numBlocks: 14, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 16, dataCodewordsPerBlock: 15 },
                      { numBlocks: 14, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 102084,
                versionNumber: 24,
                alignmentPatternCenters: [6, 28, 54, 80, 106],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 6, dataCodewordsPerBlock: 117 },
                      { numBlocks: 4, dataCodewordsPerBlock: 118 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 6, dataCodewordsPerBlock: 45 },
                      { numBlocks: 14, dataCodewordsPerBlock: 46 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 11, dataCodewordsPerBlock: 24 },
                      { numBlocks: 16, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 30, dataCodewordsPerBlock: 16 },
                      { numBlocks: 2, dataCodewordsPerBlock: 17 }
                    ]
                  }
                ]
              },
              {
                infoBits: 102881,
                versionNumber: 25,
                alignmentPatternCenters: [6, 32, 58, 84, 110],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 8, dataCodewordsPerBlock: 106 },
                      { numBlocks: 4, dataCodewordsPerBlock: 107 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 8, dataCodewordsPerBlock: 47 },
                      { numBlocks: 13, dataCodewordsPerBlock: 48 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 7, dataCodewordsPerBlock: 24 },
                      { numBlocks: 22, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 22, dataCodewordsPerBlock: 15 },
                      { numBlocks: 13, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 110507,
                versionNumber: 26,
                alignmentPatternCenters: [6, 30, 58, 86, 114],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 10, dataCodewordsPerBlock: 114 },
                      { numBlocks: 2, dataCodewordsPerBlock: 115 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 19, dataCodewordsPerBlock: 46 },
                      { numBlocks: 4, dataCodewordsPerBlock: 47 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 28, dataCodewordsPerBlock: 22 },
                      { numBlocks: 6, dataCodewordsPerBlock: 23 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 33, dataCodewordsPerBlock: 16 },
                      { numBlocks: 4, dataCodewordsPerBlock: 17 }
                    ]
                  }
                ]
              },
              {
                infoBits: 110734,
                versionNumber: 27,
                alignmentPatternCenters: [6, 34, 62, 90, 118],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 8, dataCodewordsPerBlock: 122 },
                      { numBlocks: 4, dataCodewordsPerBlock: 123 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 22, dataCodewordsPerBlock: 45 },
                      { numBlocks: 3, dataCodewordsPerBlock: 46 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 8, dataCodewordsPerBlock: 23 },
                      { numBlocks: 26, dataCodewordsPerBlock: 24 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 12, dataCodewordsPerBlock: 15 },
                      { numBlocks: 28, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 117786,
                versionNumber: 28,
                alignmentPatternCenters: [6, 26, 50, 74, 98, 122],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 117 },
                      { numBlocks: 10, dataCodewordsPerBlock: 118 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 45 },
                      { numBlocks: 23, dataCodewordsPerBlock: 46 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 24 },
                      { numBlocks: 31, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 11, dataCodewordsPerBlock: 15 },
                      { numBlocks: 31, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 119615,
                versionNumber: 29,
                alignmentPatternCenters: [6, 30, 54, 78, 102, 126],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 7, dataCodewordsPerBlock: 116 },
                      { numBlocks: 7, dataCodewordsPerBlock: 117 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 21, dataCodewordsPerBlock: 45 },
                      { numBlocks: 7, dataCodewordsPerBlock: 46 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 1, dataCodewordsPerBlock: 23 },
                      { numBlocks: 37, dataCodewordsPerBlock: 24 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 19, dataCodewordsPerBlock: 15 },
                      { numBlocks: 26, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 126325,
                versionNumber: 30,
                alignmentPatternCenters: [6, 26, 52, 78, 104, 130],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 5, dataCodewordsPerBlock: 115 },
                      { numBlocks: 10, dataCodewordsPerBlock: 116 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 19, dataCodewordsPerBlock: 47 },
                      { numBlocks: 10, dataCodewordsPerBlock: 48 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 15, dataCodewordsPerBlock: 24 },
                      { numBlocks: 25, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 23, dataCodewordsPerBlock: 15 },
                      { numBlocks: 25, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 127568,
                versionNumber: 31,
                alignmentPatternCenters: [6, 30, 56, 82, 108, 134],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 13, dataCodewordsPerBlock: 115 },
                      { numBlocks: 3, dataCodewordsPerBlock: 116 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 46 },
                      { numBlocks: 29, dataCodewordsPerBlock: 47 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 42, dataCodewordsPerBlock: 24 },
                      { numBlocks: 1, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 23, dataCodewordsPerBlock: 15 },
                      { numBlocks: 28, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 133589,
                versionNumber: 32,
                alignmentPatternCenters: [6, 34, 60, 86, 112, 138],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [{ numBlocks: 17, dataCodewordsPerBlock: 115 }]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 10, dataCodewordsPerBlock: 46 },
                      { numBlocks: 23, dataCodewordsPerBlock: 47 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 10, dataCodewordsPerBlock: 24 },
                      { numBlocks: 35, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 19, dataCodewordsPerBlock: 15 },
                      { numBlocks: 35, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 136944,
                versionNumber: 33,
                alignmentPatternCenters: [6, 30, 58, 86, 114, 142],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 17, dataCodewordsPerBlock: 115 },
                      { numBlocks: 1, dataCodewordsPerBlock: 116 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 14, dataCodewordsPerBlock: 46 },
                      { numBlocks: 21, dataCodewordsPerBlock: 47 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 29, dataCodewordsPerBlock: 24 },
                      { numBlocks: 19, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 11, dataCodewordsPerBlock: 15 },
                      { numBlocks: 46, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 141498,
                versionNumber: 34,
                alignmentPatternCenters: [6, 34, 62, 90, 118, 146],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 13, dataCodewordsPerBlock: 115 },
                      { numBlocks: 6, dataCodewordsPerBlock: 116 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 14, dataCodewordsPerBlock: 46 },
                      { numBlocks: 23, dataCodewordsPerBlock: 47 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 44, dataCodewordsPerBlock: 24 },
                      { numBlocks: 7, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 59, dataCodewordsPerBlock: 16 },
                      { numBlocks: 1, dataCodewordsPerBlock: 17 }
                    ]
                  }
                ]
              },
              {
                infoBits: 145311,
                versionNumber: 35,
                alignmentPatternCenters: [6, 30, 54, 78, 102, 126, 150],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 12, dataCodewordsPerBlock: 121 },
                      { numBlocks: 7, dataCodewordsPerBlock: 122 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 12, dataCodewordsPerBlock: 47 },
                      { numBlocks: 26, dataCodewordsPerBlock: 48 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 39, dataCodewordsPerBlock: 24 },
                      { numBlocks: 14, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 22, dataCodewordsPerBlock: 15 },
                      { numBlocks: 41, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 150283,
                versionNumber: 36,
                alignmentPatternCenters: [6, 24, 50, 76, 102, 128, 154],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 6, dataCodewordsPerBlock: 121 },
                      { numBlocks: 14, dataCodewordsPerBlock: 122 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 6, dataCodewordsPerBlock: 47 },
                      { numBlocks: 34, dataCodewordsPerBlock: 48 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 46, dataCodewordsPerBlock: 24 },
                      { numBlocks: 10, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 15 },
                      { numBlocks: 64, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 152622,
                versionNumber: 37,
                alignmentPatternCenters: [6, 28, 54, 80, 106, 132, 158],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 17, dataCodewordsPerBlock: 122 },
                      { numBlocks: 4, dataCodewordsPerBlock: 123 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 29, dataCodewordsPerBlock: 46 },
                      { numBlocks: 14, dataCodewordsPerBlock: 47 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 49, dataCodewordsPerBlock: 24 },
                      { numBlocks: 10, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 24, dataCodewordsPerBlock: 15 },
                      { numBlocks: 46, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 158308,
                versionNumber: 38,
                alignmentPatternCenters: [6, 32, 58, 84, 110, 136, 162],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 122 },
                      { numBlocks: 18, dataCodewordsPerBlock: 123 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 13, dataCodewordsPerBlock: 46 },
                      { numBlocks: 32, dataCodewordsPerBlock: 47 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 48, dataCodewordsPerBlock: 24 },
                      { numBlocks: 14, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 42, dataCodewordsPerBlock: 15 },
                      { numBlocks: 32, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 161089,
                versionNumber: 39,
                alignmentPatternCenters: [6, 26, 54, 82, 110, 138, 166],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 20, dataCodewordsPerBlock: 117 },
                      { numBlocks: 4, dataCodewordsPerBlock: 118 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 40, dataCodewordsPerBlock: 47 },
                      { numBlocks: 7, dataCodewordsPerBlock: 48 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 43, dataCodewordsPerBlock: 24 },
                      { numBlocks: 22, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 10, dataCodewordsPerBlock: 15 },
                      { numBlocks: 67, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 167017,
                versionNumber: 40,
                alignmentPatternCenters: [6, 30, 58, 86, 114, 142, 170],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 19, dataCodewordsPerBlock: 118 },
                      { numBlocks: 6, dataCodewordsPerBlock: 119 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 18, dataCodewordsPerBlock: 47 },
                      { numBlocks: 31, dataCodewordsPerBlock: 48 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 34, dataCodewordsPerBlock: 24 },
                      { numBlocks: 34, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 20, dataCodewordsPerBlock: 15 },
                      { numBlocks: 61, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              }
            ];
          }),
          /* 11 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var BitMatrix_1 = __webpack_require__(0);
            function squareToQuadrilateral(p1, p2, p3, p4) {
              var dx3 = p1.x - p2.x + p3.x - p4.x;
              var dy3 = p1.y - p2.y + p3.y - p4.y;
              if (dx3 === 0 && dy3 === 0) {
                return {
                  a11: p2.x - p1.x,
                  a12: p2.y - p1.y,
                  a13: 0,
                  a21: p3.x - p2.x,
                  a22: p3.y - p2.y,
                  a23: 0,
                  a31: p1.x,
                  a32: p1.y,
                  a33: 1
                };
              } else {
                var dx1 = p2.x - p3.x;
                var dx2 = p4.x - p3.x;
                var dy1 = p2.y - p3.y;
                var dy2 = p4.y - p3.y;
                var denominator = dx1 * dy2 - dx2 * dy1;
                var a13 = (dx3 * dy2 - dx2 * dy3) / denominator;
                var a23 = (dx1 * dy3 - dx3 * dy1) / denominator;
                return {
                  a11: p2.x - p1.x + a13 * p2.x,
                  a12: p2.y - p1.y + a13 * p2.y,
                  a13,
                  a21: p4.x - p1.x + a23 * p4.x,
                  a22: p4.y - p1.y + a23 * p4.y,
                  a23,
                  a31: p1.x,
                  a32: p1.y,
                  a33: 1
                };
              }
            }
            function quadrilateralToSquare(p1, p2, p3, p4) {
              var sToQ = squareToQuadrilateral(p1, p2, p3, p4);
              return {
                a11: sToQ.a22 * sToQ.a33 - sToQ.a23 * sToQ.a32,
                a12: sToQ.a13 * sToQ.a32 - sToQ.a12 * sToQ.a33,
                a13: sToQ.a12 * sToQ.a23 - sToQ.a13 * sToQ.a22,
                a21: sToQ.a23 * sToQ.a31 - sToQ.a21 * sToQ.a33,
                a22: sToQ.a11 * sToQ.a33 - sToQ.a13 * sToQ.a31,
                a23: sToQ.a13 * sToQ.a21 - sToQ.a11 * sToQ.a23,
                a31: sToQ.a21 * sToQ.a32 - sToQ.a22 * sToQ.a31,
                a32: sToQ.a12 * sToQ.a31 - sToQ.a11 * sToQ.a32,
                a33: sToQ.a11 * sToQ.a22 - sToQ.a12 * sToQ.a21
              };
            }
            function times(a, b) {
              return {
                a11: a.a11 * b.a11 + a.a21 * b.a12 + a.a31 * b.a13,
                a12: a.a12 * b.a11 + a.a22 * b.a12 + a.a32 * b.a13,
                a13: a.a13 * b.a11 + a.a23 * b.a12 + a.a33 * b.a13,
                a21: a.a11 * b.a21 + a.a21 * b.a22 + a.a31 * b.a23,
                a22: a.a12 * b.a21 + a.a22 * b.a22 + a.a32 * b.a23,
                a23: a.a13 * b.a21 + a.a23 * b.a22 + a.a33 * b.a23,
                a31: a.a11 * b.a31 + a.a21 * b.a32 + a.a31 * b.a33,
                a32: a.a12 * b.a31 + a.a22 * b.a32 + a.a32 * b.a33,
                a33: a.a13 * b.a31 + a.a23 * b.a32 + a.a33 * b.a33
              };
            }
            function extract(image, location) {
              var qToS = quadrilateralToSquare({ x: 3.5, y: 3.5 }, { x: location.dimension - 3.5, y: 3.5 }, { x: location.dimension - 6.5, y: location.dimension - 6.5 }, { x: 3.5, y: location.dimension - 3.5 });
              var sToQ = squareToQuadrilateral(location.topLeft, location.topRight, location.alignmentPattern, location.bottomLeft);
              var transform = times(sToQ, qToS);
              var matrix = BitMatrix_1.BitMatrix.createEmpty(location.dimension, location.dimension);
              var mappingFunction = function(x2, y2) {
                var denominator = transform.a13 * x2 + transform.a23 * y2 + transform.a33;
                return {
                  x: (transform.a11 * x2 + transform.a21 * y2 + transform.a31) / denominator,
                  y: (transform.a12 * x2 + transform.a22 * y2 + transform.a32) / denominator
                };
              };
              for (var y = 0; y < location.dimension; y++) {
                for (var x = 0; x < location.dimension; x++) {
                  var xValue = x + 0.5;
                  var yValue = y + 0.5;
                  var sourcePixel = mappingFunction(xValue, yValue);
                  matrix.set(x, y, image.get(Math.floor(sourcePixel.x), Math.floor(sourcePixel.y)));
                }
              }
              return {
                matrix,
                mappingFunction
              };
            }
            exports2.extract = extract;
          }),
          /* 12 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var MAX_FINDERPATTERNS_TO_SEARCH = 4;
            var MIN_QUAD_RATIO = 0.5;
            var MAX_QUAD_RATIO = 1.5;
            var distance = function(a, b) {
              return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
            };
            function sum(values) {
              return values.reduce(function(a, b) {
                return a + b;
              });
            }
            function reorderFinderPatterns(pattern1, pattern2, pattern3) {
              var _a, _b, _c, _d;
              var oneTwoDistance = distance(pattern1, pattern2);
              var twoThreeDistance = distance(pattern2, pattern3);
              var oneThreeDistance = distance(pattern1, pattern3);
              var bottomLeft;
              var topLeft;
              var topRight;
              if (twoThreeDistance >= oneTwoDistance && twoThreeDistance >= oneThreeDistance) {
                _a = [pattern2, pattern1, pattern3], bottomLeft = _a[0], topLeft = _a[1], topRight = _a[2];
              } else if (oneThreeDistance >= twoThreeDistance && oneThreeDistance >= oneTwoDistance) {
                _b = [pattern1, pattern2, pattern3], bottomLeft = _b[0], topLeft = _b[1], topRight = _b[2];
              } else {
                _c = [pattern1, pattern3, pattern2], bottomLeft = _c[0], topLeft = _c[1], topRight = _c[2];
              }
              if ((topRight.x - topLeft.x) * (bottomLeft.y - topLeft.y) - (topRight.y - topLeft.y) * (bottomLeft.x - topLeft.x) < 0) {
                _d = [topRight, bottomLeft], bottomLeft = _d[0], topRight = _d[1];
              }
              return { bottomLeft, topLeft, topRight };
            }
            function computeDimension(topLeft, topRight, bottomLeft, matrix) {
              var moduleSize = (sum(countBlackWhiteRun(topLeft, bottomLeft, matrix, 5)) / 7 + // Divide by 7 since the ratio is 1:1:3:1:1
              sum(countBlackWhiteRun(topLeft, topRight, matrix, 5)) / 7 + sum(countBlackWhiteRun(bottomLeft, topLeft, matrix, 5)) / 7 + sum(countBlackWhiteRun(topRight, topLeft, matrix, 5)) / 7) / 4;
              if (moduleSize < 1) {
                throw new Error("Invalid module size");
              }
              var topDimension = Math.round(distance(topLeft, topRight) / moduleSize);
              var sideDimension = Math.round(distance(topLeft, bottomLeft) / moduleSize);
              var dimension = Math.floor((topDimension + sideDimension) / 2) + 7;
              switch (dimension % 4) {
                case 0:
                  dimension++;
                  break;
                case 2:
                  dimension--;
                  break;
              }
              return { dimension, moduleSize };
            }
            function countBlackWhiteRunTowardsPoint(origin, end, matrix, length) {
              var switchPoints = [{ x: Math.floor(origin.x), y: Math.floor(origin.y) }];
              var steep = Math.abs(end.y - origin.y) > Math.abs(end.x - origin.x);
              var fromX;
              var fromY;
              var toX;
              var toY;
              if (steep) {
                fromX = Math.floor(origin.y);
                fromY = Math.floor(origin.x);
                toX = Math.floor(end.y);
                toY = Math.floor(end.x);
              } else {
                fromX = Math.floor(origin.x);
                fromY = Math.floor(origin.y);
                toX = Math.floor(end.x);
                toY = Math.floor(end.y);
              }
              var dx = Math.abs(toX - fromX);
              var dy = Math.abs(toY - fromY);
              var error = Math.floor(-dx / 2);
              var xStep = fromX < toX ? 1 : -1;
              var yStep = fromY < toY ? 1 : -1;
              var currentPixel = true;
              for (var x = fromX, y = fromY; x !== toX + xStep; x += xStep) {
                var realX = steep ? y : x;
                var realY = steep ? x : y;
                if (matrix.get(realX, realY) !== currentPixel) {
                  currentPixel = !currentPixel;
                  switchPoints.push({ x: realX, y: realY });
                  if (switchPoints.length === length + 1) {
                    break;
                  }
                }
                error += dy;
                if (error > 0) {
                  if (y === toY) {
                    break;
                  }
                  y += yStep;
                  error -= dx;
                }
              }
              var distances = [];
              for (var i = 0; i < length; i++) {
                if (switchPoints[i] && switchPoints[i + 1]) {
                  distances.push(distance(switchPoints[i], switchPoints[i + 1]));
                } else {
                  distances.push(0);
                }
              }
              return distances;
            }
            function countBlackWhiteRun(origin, end, matrix, length) {
              var _a;
              var rise = end.y - origin.y;
              var run = end.x - origin.x;
              var towardsEnd = countBlackWhiteRunTowardsPoint(origin, end, matrix, Math.ceil(length / 2));
              var awayFromEnd = countBlackWhiteRunTowardsPoint(origin, { x: origin.x - run, y: origin.y - rise }, matrix, Math.ceil(length / 2));
              var middleValue = towardsEnd.shift() + awayFromEnd.shift() - 1;
              return (_a = awayFromEnd.concat(middleValue)).concat.apply(_a, towardsEnd);
            }
            function scoreBlackWhiteRun(sequence, ratios) {
              var averageSize = sum(sequence) / sum(ratios);
              var error = 0;
              ratios.forEach(function(ratio, i) {
                error += Math.pow(sequence[i] - ratio * averageSize, 2);
              });
              return { averageSize, error };
            }
            function scorePattern(point, ratios, matrix) {
              try {
                var horizontalRun = countBlackWhiteRun(point, { x: -1, y: point.y }, matrix, ratios.length);
                var verticalRun = countBlackWhiteRun(point, { x: point.x, y: -1 }, matrix, ratios.length);
                var topLeftPoint = {
                  x: Math.max(0, point.x - point.y) - 1,
                  y: Math.max(0, point.y - point.x) - 1
                };
                var topLeftBottomRightRun = countBlackWhiteRun(point, topLeftPoint, matrix, ratios.length);
                var bottomLeftPoint = {
                  x: Math.min(matrix.width, point.x + point.y) + 1,
                  y: Math.min(matrix.height, point.y + point.x) + 1
                };
                var bottomLeftTopRightRun = countBlackWhiteRun(point, bottomLeftPoint, matrix, ratios.length);
                var horzError = scoreBlackWhiteRun(horizontalRun, ratios);
                var vertError = scoreBlackWhiteRun(verticalRun, ratios);
                var diagDownError = scoreBlackWhiteRun(topLeftBottomRightRun, ratios);
                var diagUpError = scoreBlackWhiteRun(bottomLeftTopRightRun, ratios);
                var ratioError = Math.sqrt(horzError.error * horzError.error + vertError.error * vertError.error + diagDownError.error * diagDownError.error + diagUpError.error * diagUpError.error);
                var avgSize = (horzError.averageSize + vertError.averageSize + diagDownError.averageSize + diagUpError.averageSize) / 4;
                var sizeError = (Math.pow(horzError.averageSize - avgSize, 2) + Math.pow(vertError.averageSize - avgSize, 2) + Math.pow(diagDownError.averageSize - avgSize, 2) + Math.pow(diagUpError.averageSize - avgSize, 2)) / avgSize;
                return ratioError + sizeError;
              } catch (_a) {
                return Infinity;
              }
            }
            function recenterLocation(matrix, p) {
              var leftX = Math.round(p.x);
              while (matrix.get(leftX, Math.round(p.y))) {
                leftX--;
              }
              var rightX = Math.round(p.x);
              while (matrix.get(rightX, Math.round(p.y))) {
                rightX++;
              }
              var x = (leftX + rightX) / 2;
              var topY = Math.round(p.y);
              while (matrix.get(Math.round(x), topY)) {
                topY--;
              }
              var bottomY = Math.round(p.y);
              while (matrix.get(Math.round(x), bottomY)) {
                bottomY++;
              }
              var y = (topY + bottomY) / 2;
              return { x, y };
            }
            function locate(matrix) {
              var finderPatternQuads = [];
              var activeFinderPatternQuads = [];
              var alignmentPatternQuads = [];
              var activeAlignmentPatternQuads = [];
              var _loop_1 = function(y2) {
                var length_1 = 0;
                var lastBit = false;
                var scans = [0, 0, 0, 0, 0];
                var _loop_2 = function(x2) {
                  var v = matrix.get(x2, y2);
                  if (v === lastBit) {
                    length_1++;
                  } else {
                    scans = [scans[1], scans[2], scans[3], scans[4], length_1];
                    length_1 = 1;
                    lastBit = v;
                    var averageFinderPatternBlocksize = sum(scans) / 7;
                    var validFinderPattern = Math.abs(scans[0] - averageFinderPatternBlocksize) < averageFinderPatternBlocksize && Math.abs(scans[1] - averageFinderPatternBlocksize) < averageFinderPatternBlocksize && Math.abs(scans[2] - 3 * averageFinderPatternBlocksize) < 3 * averageFinderPatternBlocksize && Math.abs(scans[3] - averageFinderPatternBlocksize) < averageFinderPatternBlocksize && Math.abs(scans[4] - averageFinderPatternBlocksize) < averageFinderPatternBlocksize && !v;
                    var averageAlignmentPatternBlocksize = sum(scans.slice(-3)) / 3;
                    var validAlignmentPattern = Math.abs(scans[2] - averageAlignmentPatternBlocksize) < averageAlignmentPatternBlocksize && Math.abs(scans[3] - averageAlignmentPatternBlocksize) < averageAlignmentPatternBlocksize && Math.abs(scans[4] - averageAlignmentPatternBlocksize) < averageAlignmentPatternBlocksize && v;
                    if (validFinderPattern) {
                      var endX_1 = x2 - scans[3] - scans[4];
                      var startX_1 = endX_1 - scans[2];
                      var line = { startX: startX_1, endX: endX_1, y: y2 };
                      var matchingQuads = activeFinderPatternQuads.filter(function(q) {
                        return startX_1 >= q.bottom.startX && startX_1 <= q.bottom.endX || endX_1 >= q.bottom.startX && startX_1 <= q.bottom.endX || startX_1 <= q.bottom.startX && endX_1 >= q.bottom.endX && (scans[2] / (q.bottom.endX - q.bottom.startX) < MAX_QUAD_RATIO && scans[2] / (q.bottom.endX - q.bottom.startX) > MIN_QUAD_RATIO);
                      });
                      if (matchingQuads.length > 0) {
                        matchingQuads[0].bottom = line;
                      } else {
                        activeFinderPatternQuads.push({ top: line, bottom: line });
                      }
                    }
                    if (validAlignmentPattern) {
                      var endX_2 = x2 - scans[4];
                      var startX_2 = endX_2 - scans[3];
                      var line = { startX: startX_2, y: y2, endX: endX_2 };
                      var matchingQuads = activeAlignmentPatternQuads.filter(function(q) {
                        return startX_2 >= q.bottom.startX && startX_2 <= q.bottom.endX || endX_2 >= q.bottom.startX && startX_2 <= q.bottom.endX || startX_2 <= q.bottom.startX && endX_2 >= q.bottom.endX && (scans[2] / (q.bottom.endX - q.bottom.startX) < MAX_QUAD_RATIO && scans[2] / (q.bottom.endX - q.bottom.startX) > MIN_QUAD_RATIO);
                      });
                      if (matchingQuads.length > 0) {
                        matchingQuads[0].bottom = line;
                      } else {
                        activeAlignmentPatternQuads.push({ top: line, bottom: line });
                      }
                    }
                  }
                };
                for (var x = -1; x <= matrix.width; x++) {
                  _loop_2(x);
                }
                finderPatternQuads.push.apply(finderPatternQuads, activeFinderPatternQuads.filter(function(q) {
                  return q.bottom.y !== y2 && q.bottom.y - q.top.y >= 2;
                }));
                activeFinderPatternQuads = activeFinderPatternQuads.filter(function(q) {
                  return q.bottom.y === y2;
                });
                alignmentPatternQuads.push.apply(alignmentPatternQuads, activeAlignmentPatternQuads.filter(function(q) {
                  return q.bottom.y !== y2;
                }));
                activeAlignmentPatternQuads = activeAlignmentPatternQuads.filter(function(q) {
                  return q.bottom.y === y2;
                });
              };
              for (var y = 0; y <= matrix.height; y++) {
                _loop_1(y);
              }
              finderPatternQuads.push.apply(finderPatternQuads, activeFinderPatternQuads.filter(function(q) {
                return q.bottom.y - q.top.y >= 2;
              }));
              alignmentPatternQuads.push.apply(alignmentPatternQuads, activeAlignmentPatternQuads);
              var finderPatternGroups = finderPatternQuads.filter(function(q) {
                return q.bottom.y - q.top.y >= 2;
              }).map(function(q) {
                var x = (q.top.startX + q.top.endX + q.bottom.startX + q.bottom.endX) / 4;
                var y2 = (q.top.y + q.bottom.y + 1) / 2;
                if (!matrix.get(Math.round(x), Math.round(y2))) {
                  return;
                }
                var lengths = [q.top.endX - q.top.startX, q.bottom.endX - q.bottom.startX, q.bottom.y - q.top.y + 1];
                var size = sum(lengths) / lengths.length;
                var score = scorePattern({ x: Math.round(x), y: Math.round(y2) }, [1, 1, 3, 1, 1], matrix);
                return { score, x, y: y2, size };
              }).filter(function(q) {
                return !!q;
              }).sort(function(a, b) {
                return a.score - b.score;
              }).map(function(point, i, finderPatterns) {
                if (i > MAX_FINDERPATTERNS_TO_SEARCH) {
                  return null;
                }
                var otherPoints = finderPatterns.filter(function(p, ii) {
                  return i !== ii;
                }).map(function(p) {
                  return { x: p.x, y: p.y, score: p.score + Math.pow(p.size - point.size, 2) / point.size, size: p.size };
                }).sort(function(a, b) {
                  return a.score - b.score;
                });
                if (otherPoints.length < 2) {
                  return null;
                }
                var score = point.score + otherPoints[0].score + otherPoints[1].score;
                return { points: [point].concat(otherPoints.slice(0, 2)), score };
              }).filter(function(q) {
                return !!q;
              }).sort(function(a, b) {
                return a.score - b.score;
              });
              if (finderPatternGroups.length === 0) {
                return null;
              }
              var _a = reorderFinderPatterns(finderPatternGroups[0].points[0], finderPatternGroups[0].points[1], finderPatternGroups[0].points[2]), topRight = _a.topRight, topLeft = _a.topLeft, bottomLeft = _a.bottomLeft;
              var alignment = findAlignmentPattern(matrix, alignmentPatternQuads, topRight, topLeft, bottomLeft);
              var result = [];
              if (alignment) {
                result.push({
                  alignmentPattern: { x: alignment.alignmentPattern.x, y: alignment.alignmentPattern.y },
                  bottomLeft: { x: bottomLeft.x, y: bottomLeft.y },
                  dimension: alignment.dimension,
                  topLeft: { x: topLeft.x, y: topLeft.y },
                  topRight: { x: topRight.x, y: topRight.y }
                });
              }
              var midTopRight = recenterLocation(matrix, topRight);
              var midTopLeft = recenterLocation(matrix, topLeft);
              var midBottomLeft = recenterLocation(matrix, bottomLeft);
              var centeredAlignment = findAlignmentPattern(matrix, alignmentPatternQuads, midTopRight, midTopLeft, midBottomLeft);
              if (centeredAlignment) {
                result.push({
                  alignmentPattern: { x: centeredAlignment.alignmentPattern.x, y: centeredAlignment.alignmentPattern.y },
                  bottomLeft: { x: midBottomLeft.x, y: midBottomLeft.y },
                  topLeft: { x: midTopLeft.x, y: midTopLeft.y },
                  topRight: { x: midTopRight.x, y: midTopRight.y },
                  dimension: centeredAlignment.dimension
                });
              }
              if (result.length === 0) {
                return null;
              }
              return result;
            }
            exports2.locate = locate;
            function findAlignmentPattern(matrix, alignmentPatternQuads, topRight, topLeft, bottomLeft) {
              var _a;
              var dimension;
              var moduleSize;
              try {
                _a = computeDimension(topLeft, topRight, bottomLeft, matrix), dimension = _a.dimension, moduleSize = _a.moduleSize;
              } catch (e) {
                return null;
              }
              var bottomRightFinderPattern = {
                x: topRight.x - topLeft.x + bottomLeft.x,
                y: topRight.y - topLeft.y + bottomLeft.y
              };
              var modulesBetweenFinderPatterns = (distance(topLeft, bottomLeft) + distance(topLeft, topRight)) / 2 / moduleSize;
              var correctionToTopLeft = 1 - 3 / modulesBetweenFinderPatterns;
              var expectedAlignmentPattern = {
                x: topLeft.x + correctionToTopLeft * (bottomRightFinderPattern.x - topLeft.x),
                y: topLeft.y + correctionToTopLeft * (bottomRightFinderPattern.y - topLeft.y)
              };
              var alignmentPatterns = alignmentPatternQuads.map(function(q) {
                var x = (q.top.startX + q.top.endX + q.bottom.startX + q.bottom.endX) / 4;
                var y = (q.top.y + q.bottom.y + 1) / 2;
                if (!matrix.get(Math.floor(x), Math.floor(y))) {
                  return;
                }
                var lengths = [q.top.endX - q.top.startX, q.bottom.endX - q.bottom.startX, q.bottom.y - q.top.y + 1];
                var size = sum(lengths) / lengths.length;
                var sizeScore = scorePattern({ x: Math.floor(x), y: Math.floor(y) }, [1, 1, 1], matrix);
                var score = sizeScore + distance({ x, y }, expectedAlignmentPattern);
                return { x, y, score };
              }).filter(function(v) {
                return !!v;
              }).sort(function(a, b) {
                return a.score - b.score;
              });
              var alignmentPattern = modulesBetweenFinderPatterns >= 15 && alignmentPatterns.length ? alignmentPatterns[0] : expectedAlignmentPattern;
              return { alignmentPattern, dimension };
            }
          })
          /******/
        ])["default"]
      );
    });
  }
});

// node_modules/@noble/hashes/_u64.js
var U32_MASK64 = /* @__PURE__ */ (() => BigInt(2 ** 32 - 1))();
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
var fromNumH = (n) => n / 2 ** 32 | 0;
var fromNumL = (n) => n >>> 0;
function setU64FromNum(view2, byteOffset, n, isLE) {
  const h = fromNumH(n);
  const l = fromNumL(n);
  view2.setUint32(byteOffset, isLE ? l : h, isLE);
  view2.setUint32(byteOffset + 4, isLE ? h : l, isLE);
}
var shrSH = (h, _l, s) => h >>> s;
var shrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;

// node_modules/@noble/hashes/utils.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
var atitle = (title) => title ? `"${title}" ` : "";
function anumber(n, title = "") {
  if (typeof n !== "number")
    throw new TypeError(atitle(title) + "expected number, got " + typeof n);
  if (!Number.isSafeInteger(n) || n < 0)
    throw new RangeError(atitle(title) + "expected integer >= 0, got " + n);
  return n;
}
function abytes(value, length, title = "") {
  if (isBytes(value) && (length === void 0 || value.length === length))
    return value;
  if (length !== void 0)
    anumber(length, "length");
  const bytes = isBytes(value);
  const ofLen = length !== void 0 ? ` of length ${length}` : "";
  const got = bytes ? `length=${value.length}` : `type=${typeof value}`;
  const message = atitle(title) + "expected Uint8Array" + ofLen + ", got " + got;
  if (!bytes)
    throw new TypeError(message);
  throw new RangeError(message);
}
function ahash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new TypeError("expected hash wrapped by utils.createHasher");
  anumber(h.outputLen);
  anumber(h.blockLen);
  if (h.outputLen < 1 || h.blockLen < 1)
    throw new Error("hash blockLen / outputLen must be >= 1");
}
var aobject = (value, label) => {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError((label === "object" ? "" : `"${label}" `) + "expected object, got type=" + typeof value);
};
var aopts = (value, label) => {
  aobject(value, label);
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null)
    throw new TypeError(`"${label}" expected plain object`);
  if (Object.hasOwn(value, "__proto__"))
    throw new TypeError(`"${label}.__proto__" is not allowed`);
};
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("hash was destroyed");
  if (checkFinished && instance.finished)
    throw new Error("digest() was already called");
}
function aoutput(out, instance) {
  abytes(out, void 0, "output");
  const min = instance.outputLen;
  if (!(out.length >= min)) {
    throw new RangeError('"output" expected length >= ' + min);
  }
}
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
function rotl(word, shift) {
  return word << shift | word >>> 32 - shift >>> 0;
}
var hasHexBuiltin = /* @__PURE__ */ (() => (
  // @ts-ignore
  typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
))();
var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
function bytesToHex(bytes) {
  abytes(bytes);
  if (hasHexBuiltin)
    return bytes.toHex();
  let hex2 = "";
  for (let i = 0; i < bytes.length; i++) {
    hex2 += hexes[bytes[i]];
  }
  return hex2;
}
function asciiToBase16(ch) {
  return ch >= 48 && ch <= 57 ? ch - 48 : ch >= 65 && ch <= 70 ? ch - (65 - 10) : ch >= 97 && ch <= 102 ? ch - (97 - 10) : void 0;
}
function hexToBytes(hex2) {
  if (typeof hex2 !== "string")
    throw new TypeError("hex string expected, got " + typeof hex2);
  if (hasHexBuiltin) {
    try {
      return Uint8Array.fromHex(hex2);
    } catch (error) {
      if (error instanceof SyntaxError)
        throw new RangeError(error.message);
      throw error;
    }
  }
  const hl = hex2.length;
  const al = hl / 2;
  if (hl % 2)
    throw new RangeError("hex string expected, got unpadded hex of length " + hl);
  const array2 = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex2.charCodeAt(hi));
    const n2 = asciiToBase16(hex2.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex2[hi] + hex2[hi + 1];
      throw new RangeError('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array2[ai] = n1 * 16 + n2;
  }
  return array2;
}
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    abytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
function checkOpts(defaults, opts, title = "opts") {
  aopts(defaults, "defaults");
  if (opts !== void 0)
    aopts(opts, title);
  const merged = Object.assign(/* @__PURE__ */ Object.create(null), defaults, opts);
  return merged;
}
function createHasher(hashCons, info = {}) {
  if (typeof hashCons !== "function")
    throw new TypeError('"hashCons" expected function, got type=' + typeof hashCons);
  info = checkOpts({}, info, "info");
  const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
  const tmp = hashCons(void 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.canXOF = tmp.canXOF;
  hashC.create = (opts) => hashCons(opts);
  Object.assign(hashC, info);
  return Object.freeze(hashC);
}
function randomBytes(bytesLength = 32) {
  anumber(bytesLength, "bytesLength");
  const cr = typeof globalThis === "object" ? globalThis.crypto : null;
  if (typeof cr?.getRandomValues !== "function")
    throw new Error("crypto.getRandomValues must be defined");
  if (bytesLength > 65536)
    throw new RangeError(`"bytesLength" expected <= 65536, got ${bytesLength}`);
  return cr.getRandomValues(new Uint8Array(bytesLength));
}
var oidNist = (suffix) => ({
  // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
  // Larger suffix values would need base-128 OID encoding and a different length byte.
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
});

// node_modules/@noble/hashes/_md.js
function Chi(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD = class {
  blockLen;
  outputLen;
  canXOF = false;
  padOffset;
  isLE;
  // For partial updates less than block size
  buffer;
  view;
  finished = false;
  length = 0;
  pos = 0;
  destroyed = false;
  constructor(blockLen, outputLen, padOffset, isLE) {
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    aexists(this);
    abytes(data);
    const { view: view2, buffer, blockLen } = this;
    const len = data.length;
    let processed = false;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        processed = true;
        continue;
      }
      buffer.set(pos === 0 && take === len ? data : data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view2, 0);
        this.pos = 0;
        processed = true;
      }
    }
    this.length += data.length;
    if (processed)
      this.roundClean();
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer, view: view2, blockLen, isLE } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    buffer.fill(0, pos);
    if (this.padOffset > blockLen - pos) {
      this.process(view2, 0);
      buffer.fill(0);
    }
    setU64FromNum(view2, blockLen - 8, this.length * 8, isLE);
    this.process(view2, 0);
    this.roundClean();
    const oview = out === buffer ? view2 : createView(out);
    const len = this.outputLen;
    const outLen = len / 4;
    const state = this.get();
    if (len % 4 || outLen > state.length)
      throw new Error("invalid outputLen");
    for (let i = 0; i < outLen; i++)
      oview.setUint32(4 * i, state[i], isLE);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneIntoMeta(to) {
    const { buffer, length, finished, destroyed, pos } = this;
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length;
    to.pos = pos;
    if (pos)
      to.buffer.set(buffer);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
};
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA512_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  4089235720,
  3144134277,
  2227873595,
  1013904242,
  4271175723,
  2773480762,
  1595750129,
  1359893119,
  2917565137,
  2600822924,
  725511199,
  528734635,
  4215389547,
  1541459225,
  327033209
]);

// node_modules/@noble/hashes/sha2.js
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA2_32B = class extends HashMD {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  // Numeric initializers matter: starting the fields as `undefined` changes
  // V8's field representation and makes sha256 3x slower (measured).
  A = 0;
  B = 0;
  C = 0;
  D = 0;
  E = 0;
  F = 0;
  G = 0;
  H = 0;
  constructor(outputLen, IV) {
    super(64, outputLen, 8, false);
    this.A = IV[0] | 0;
    this.B = IV[1] | 0;
    this.C = IV[2] | 0;
    this.D = IV[3] | 0;
    this.E = IV[4] | 0;
    this.F = IV[5] | 0;
    this.G = IV[6] | 0;
    this.H = IV[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  _cloneInto(to) {
    (to ||= new this.constructor()).set(...this.get());
    return this._cloneIntoMeta(to);
  }
  process(view2, offset) {
    for (let i = 0; i < 16; i++, offset += 4)
      SHA256_W[i] = view2.getUint32(offset, false);
    for (let i = 16; i < 64; i++) {
      const W15 = SHA256_W[i - 15];
      const W2 = SHA256_W[i - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i = 0; i < 64; i++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    clean(SHA256_W);
  }
  destroy() {
    this.destroyed = true;
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    clean(this.buffer);
  }
};
var _SHA256 = class extends SHA2_32B {
  constructor() {
    super(32, SHA256_IV);
  }
};
var K512 = /* @__PURE__ */ (() => split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((n) => BigInt(n))))();
var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
var SHA2_64B = class extends HashMD {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  // h -- high 32 bits, l -- low 32 bits
  // Numeric initializers matter: starting the fields as `undefined` changes
  // V8's field representation and slows hashing down (measured on sha256).
  Ah = 0;
  Al = 0;
  Bh = 0;
  Bl = 0;
  Ch = 0;
  Cl = 0;
  Dh = 0;
  Dl = 0;
  Eh = 0;
  El = 0;
  Fh = 0;
  Fl = 0;
  Gh = 0;
  Gl = 0;
  Hh = 0;
  Hl = 0;
  constructor(outputLen, IV) {
    super(128, outputLen, 16, false);
    this.Ah = IV[0] | 0;
    this.Al = IV[1] | 0;
    this.Bh = IV[2] | 0;
    this.Bl = IV[3] | 0;
    this.Ch = IV[4] | 0;
    this.Cl = IV[5] | 0;
    this.Dh = IV[6] | 0;
    this.Dl = IV[7] | 0;
    this.Eh = IV[8] | 0;
    this.El = IV[9] | 0;
    this.Fh = IV[10] | 0;
    this.Fl = IV[11] | 0;
    this.Gh = IV[12] | 0;
    this.Gl = IV[13] | 0;
    this.Hh = IV[14] | 0;
    this.Hl = IV[15] | 0;
  }
  // prettier-ignore
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
  }
  // prettier-ignore
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  _cloneInto(to) {
    (to ||= new this.constructor()).set(...this.get());
    return this._cloneIntoMeta(to);
  }
  process(view2, offset) {
    for (let i = 0; i < 16; i++, offset += 4) {
      SHA512_W_H[i] = view2.getUint32(offset);
      SHA512_W_L[i] = view2.getUint32(offset += 4);
    }
    for (let i = 16; i < 80; i++) {
      const W15h = SHA512_W_H[i - 15] | 0;
      const W15l = SHA512_W_L[i - 15] | 0;
      const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
      const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H[i - 2] | 0;
      const W2l = SHA512_W_L[i - 2] | 0;
      const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
      const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
      const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
      const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
      SHA512_W_H[i] = SUMh | 0;
      SHA512_W_L[i] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i = 0; i < 80; i++) {
      const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
      const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
      const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
      const T1l = T1ll | 0;
      const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
      const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = add3L(T1l, sigma0l, MAJl);
      Ah = add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    clean(SHA512_W_H, SHA512_W_L);
  }
  destroy() {
    this.destroyed = true;
    clean(this.buffer);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var _SHA512 = class extends SHA2_64B {
  constructor() {
    super(64, SHA512_IV);
  }
};
var sha256 = /* @__PURE__ */ createHasher(
  () => new _SHA256(),
  /* @__PURE__ */ oidNist(1)
);
var sha512 = /* @__PURE__ */ createHasher(
  () => new _SHA512(),
  /* @__PURE__ */ oidNist(3)
);

// node_modules/@noble/curves/utils.js
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function aarray(item, title, inner = () => {
}) {
  if (!Array.isArray(item))
    throw new TypeError(`"${title}" expected array, got type=${typeof item}`);
  for (let i = 0; i < item.length; i++)
    inner(item[i], `${title}[${i}]`);
  return item;
}
var abytes2 = (value, length, title) => abytes(value, length, title);
var anumber2 = anumber;
function astring(value, title = "") {
  if (typeof value !== "string") {
    const prefix2 = title && `"${title}" `;
    throw new TypeError(prefix2 + "expected string, got type=" + typeof value);
  }
  return value;
}
function aobject2(value, title = "object") {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError(title === "object" ? "expected valid options object" : `"${title}" expected object, got type=${typeof value}`);
  return value;
}
function afunction(value, title) {
  if (typeof value !== "function")
    throw new TypeError(`"${title}" is invalid: expected function, got ${typeof value}`);
  return value;
}
var bytesToHex2 = bytesToHex;
var concatBytes2 = (...arrays) => concatBytes(...arrays);
var hexToBytes2 = (hex2) => hexToBytes(hex2);
var isBytes2 = isBytes;
var randomBytes2 = (bytesLength) => randomBytes(bytesLength);
var _0n = /* @__PURE__ */ BigInt(0);
var _1n = /* @__PURE__ */ BigInt(1);
var atitle2 = (title) => title ? `"${title}" ` : "";
function abool(value, title = "") {
  if (typeof value !== "boolean")
    throw new TypeError(atitle2(title) + "expected boolean, got type=" + typeof value);
  return value;
}
function abignumber(n) {
  if (typeof n === "bigint") {
    if (!isPosBig(n))
      throw new RangeError("positive bigint expected, got " + n);
  } else
    anumber2(n);
  return n;
}
function asafenumber(value, title = "") {
  if (typeof value !== "number") {
    const prefix2 = title && `"${title}" `;
    throw new TypeError(prefix2 + "expected number, got type=" + typeof value);
  }
  if (!Number.isSafeInteger(value)) {
    const prefix2 = title && `"${title}" `;
    throw new RangeError(prefix2 + "expected safe integer, got " + value);
  }
}
function numberToHexUnpadded(num2) {
  const hex2 = abignumber(num2).toString(16);
  return hex2.length & 1 ? "0" + hex2 : hex2;
}
function hexToNumber(hex2) {
  if (typeof hex2 !== "string")
    throw new TypeError("hex string expected, got " + typeof hex2);
  return hex2 === "" ? _0n : BigInt("0x" + hex2);
}
function bytesToNumberBE(bytes) {
  return hexToNumber(bytesToHex(bytes));
}
function bytesToNumberLE(bytes) {
  return hexToNumber(bytesToHex(copyBytes(abytes(bytes)).reverse()));
}
function numberToBytesBE(n, len) {
  anumber(len);
  if (len === 0)
    throw new Error("zero output length is invalid");
  n = abignumber(n);
  const expectedLen = len * 2;
  const hex2 = n.toString(16);
  if (hex2.length > expectedLen)
    throw new RangeError("number is too large");
  return hexToBytes(hex2.padStart(expectedLen, "0"));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function copyBytes(bytes) {
  return Uint8Array.from(abytes2(bytes));
}
function asciiToBytes(ascii) {
  if (typeof ascii !== "string")
    throw new TypeError("ascii string expected, got " + typeof ascii);
  return Uint8Array.from(ascii, (c, i) => {
    const charCode = c.charCodeAt(0);
    if (c.length !== 1 || charCode > 127) {
      throw new RangeError(`string contains non-ASCII character "${ascii[i]}" with code ${charCode} at position ${i}`);
    }
    return charCode;
  });
}
function isPosBig(n) {
  return typeof n === "bigint" && _0n <= n;
}
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
function aInRange(title, n, min, max) {
  if (!inRange(n, min, max))
    throw new RangeError("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
function bitLen(n) {
  if (n < _0n)
    throw new Error("expected non-negative bigint, got " + n);
  return n === _0n ? 0 : n.toString(2).length;
}
var bitMask = (n) => {
  asafenumber(n, "n");
  return (_1n << BigInt(n)) - _1n;
};
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  anumber(hashLen, "hashLen");
  anumber(qByteLen, "qByteLen");
  if (typeof hmacFn !== "function")
    throw new TypeError("hmacFn must be a function");
  const u8n = (len) => new Uint8Array(len);
  const NULL2 = Uint8Array.of();
  const byte0 = Uint8Array.of(0);
  const byte1 = Uint8Array.of(1);
  const _maxDrbgIters = 1e3;
  let v = u8n(hashLen);
  let k = u8n(hashLen);
  let i = 0;
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i = 0;
  };
  const h = (...msgs) => hmacFn(k, concatBytes2(v, ...msgs));
  const reseed = (seed = NULL2) => {
    k = h(byte0, seed);
    v = h();
    if (seed.length === 0)
      return;
    k = h(byte1, seed);
    v = h();
  };
  const gen = () => {
    if (i++ >= _maxDrbgIters)
      throw new Error("drbg: tried max amount of iterations");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes2(...out);
  };
  const genUntil = (seed, pred) => {
    reset();
    reseed(seed);
    let res = void 0;
    while ((res = pred(gen())) === void 0)
      reseed();
    reset();
    return res;
  };
  return genUntil;
}
function validateObject(object, fields = {}, optFields = {}, title = "object") {
  aobject2(object, title);
  aobject2(fields, "fields");
  aobject2(optFields, "optFields");
  function checkField(fieldName, expectedType, isOpt) {
    const label = title === "object" ? `param "${String(fieldName)}"` : `"${title}.${String(fieldName)}"`;
    const val = object[fieldName];
    if (!Object.hasOwn(object, fieldName) && (isOpt ? val !== void 0 : expectedType !== "function")) {
      throw new TypeError(`${label} is invalid: expected own property`);
    }
    if (isOpt && val === void 0)
      return;
    const current = typeof val;
    if (current !== expectedType || val === null)
      throw new TypeError(`${label} is invalid: expected ${expectedType}, got ${current}`);
  }
  const iter = (f, isOpt) => Object.entries(f).forEach(([k, v]) => checkField(k, v, isOpt));
  iter(fields, false);
  iter(optFields, true);
}

// node_modules/@noble/curves/abstract/modular.js
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n2 = /* @__PURE__ */ BigInt(0);
var _1n2 = /* @__PURE__ */ BigInt(1);
var _2n = /* @__PURE__ */ BigInt(2);
var _3n = /* @__PURE__ */ BigInt(3);
var _4n = /* @__PURE__ */ BigInt(4);
var _5n = /* @__PURE__ */ BigInt(5);
var _7n = /* @__PURE__ */ BigInt(7);
var _8n = /* @__PURE__ */ BigInt(8);
var _9n = /* @__PURE__ */ BigInt(9);
var _15n = /* @__PURE__ */ BigInt(15);
var _16n = /* @__PURE__ */ BigInt(16);
var POW_WINDOWED_MIN = /* @__PURE__ */ BigInt("0x10000000000000000");
function mod(a, b) {
  if (b <= _0n2)
    throw new Error("mod: expected positive modulus, got " + b);
  const result = a % b;
  return result >= _0n2 ? result : b + result;
}
function pow(num2, power, modulo) {
  if (modulo <= _1n2)
    throw new Error("pow: expected modulus > 1, got " + modulo);
  if (typeof power !== "bigint")
    throw new TypeError("invalid exponent: expected bigint, got " + typeof power);
  if (power < _0n2)
    throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n2)
    return _1n2;
  if (power === _1n2)
    return num2;
  let d = num2 % modulo;
  if (d < _0n2)
    d += modulo;
  if (power < POW_WINDOWED_MIN) {
    let p2 = _1n2;
    while (power > _0n2) {
      if (power & _1n2)
        p2 = p2 * d % modulo;
      d = d * d % modulo;
      power >>= _1n2;
    }
    return p2;
  }
  const digits = [];
  while (power > _0n2) {
    digits.push(Number(power & _15n));
    power >>= _4n;
  }
  const table = new Array(16);
  table[0] = _1n2;
  table[1] = d;
  for (let i = 2; i < 16; i++)
    table[i] = table[i - 1] * d % modulo;
  let p = table[digits[digits.length - 1]];
  for (let w = digits.length - 2; w >= 0; w--) {
    p = p * p % modulo;
    p = p * p % modulo;
    p = p * p % modulo;
    p = p * p % modulo;
    const digit = digits[w];
    if (digit !== 0)
      p = p * table[digit] % modulo;
  }
  return p;
}
function pow2(x, power, modulo) {
  if (modulo <= _1n2)
    throw new Error("pow2: expected modulus > 1, got " + modulo);
  if (power < _0n2)
    throw new Error("pow2: expected non-negative exponent, got " + power);
  let res = x;
  while (power-- > _0n2) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number, modulo) {
  if (number === _0n2)
    throw new Error("invert: expected non-zero number");
  if (modulo <= _1n2)
    throw new Error("invert: expected modulus > 1, got " + modulo);
  let a = mod(number, modulo);
  let b = modulo;
  let x = _0n2, u = _1n2;
  while (a !== _0n2) {
    const q = b / a;
    const r = b - a * q;
    const m = x - u * q;
    b = a, a = r, x = u, u = m;
  }
  const gcd = b;
  if (gcd !== _1n2)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function invertCt(a, prime) {
  if (prime <= _1n2)
    throw new Error("invertCt: expected prime modulus > 1, got " + prime);
  const an = mod(a, prime);
  if (an === _0n2)
    throw new Error("invertCt: expected non-zero number");
  const inverse = pow(an, prime - _2n, prime);
  if (mod(an * inverse, prime) !== _1n2)
    throw new Error("invertCt: does not exist");
  return inverse;
}
function assertIsSquare(Fp, root, n) {
  const F = Fp;
  if (!F.eql(F.sqr(root), n))
    throw new Error("Cannot find square root");
}
function aoddModulus(order, fnName) {
  if ((order & _1n2) === _0n2)
    throw new Error(fnName + ": expected odd modulus, got " + order);
}
function sqrt3mod4(Fp, n) {
  const F = Fp;
  const p1div4 = (F.ORDER + _1n2) / _4n;
  const root = F.pow(n, p1div4);
  assertIsSquare(F, root, n);
  return root;
}
function sqrt5mod8(Fp, n) {
  const F = Fp;
  const p5div8 = (F.ORDER - _5n) / _8n;
  const n2 = F.mul(n, _2n);
  const v = F.pow(n2, p5div8);
  const nv = F.mul(n, v);
  const i = F.mul(F.mul(nv, _2n), v);
  const root = F.mul(nv, F.sub(i, F.ONE));
  assertIsSquare(F, root, n);
  return root;
}
function sqrt9mod16(P) {
  const Fp_ = Field(P);
  const tn = tonelliShanks(P);
  const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
  const c2 = tn(Fp_, c1);
  const c3 = tn(Fp_, Fp_.neg(c1));
  const c4 = (P + _7n) / _16n;
  return ((Fp, n) => {
    const F = Fp;
    let tv1 = F.pow(n, c4);
    let tv2 = F.mul(tv1, c1);
    const tv3 = F.mul(tv1, c2);
    const tv4 = F.mul(tv1, c3);
    const e1 = F.eql(F.sqr(tv2), n);
    const e2 = F.eql(F.sqr(tv3), n);
    tv1 = F.cmov(tv1, tv2, e1);
    tv2 = F.cmov(tv4, tv3, e2);
    const e3 = F.eql(F.sqr(tv2), n);
    const root = F.cmov(tv1, tv2, e3);
    assertIsSquare(F, root, n);
    return root;
  });
}
function tonelliShanks(P) {
  if (P < _3n)
    throw new Error("sqrt is not defined for small field");
  aoddModulus(P, "tonelliShanks");
  let Q = P - _1n2;
  let S = 0;
  while (Q % _2n === _0n2) {
    Q /= _2n;
    S++;
  }
  let Z = _2n;
  const _Fp = Field(P);
  while (FpLegendre(_Fp, Z) === 1) {
    if (Z++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  }
  if (S === 1)
    return sqrt3mod4;
  let cc = _Fp.pow(Z, Q);
  const Q1div2 = (Q + _1n2) / _2n;
  return function tonelliSlow(Fp, n) {
    const F = Fp;
    if (F.is0(n))
      return n;
    if (FpLegendre(F, n) !== 1)
      throw new Error("Cannot find square root");
    let M = S;
    let c = F.mul(F.ONE, cc);
    let t = F.pow(n, Q);
    let R = F.pow(n, Q1div2);
    while (!F.eql(t, F.ONE)) {
      if (F.is0(t))
        throw new Error("Cannot find square root: probably non-prime P");
      let i = 1;
      let t_tmp = F.sqr(t);
      while (!F.eql(t_tmp, F.ONE)) {
        i++;
        t_tmp = F.sqr(t_tmp);
        if (i === M)
          throw new Error("Cannot find square root");
      }
      const exponent = _1n2 << BigInt(M - i - 1);
      const b = F.pow(c, exponent);
      M = i;
      c = F.sqr(b);
      t = F.mul(t, c);
      R = F.mul(R, b);
    }
    return R;
  };
}
function FpSqrt(P) {
  aoddModulus(P, "Fp.sqrt");
  if (P % _4n === _3n)
    return sqrt3mod4;
  if (P % _8n === _5n)
    return sqrt5mod8;
  if (P % _16n === _9n)
    return sqrt9mod16(P);
  return tonelliShanks(P);
}
var FIELD_FIELDS = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function validateField(field) {
  aobject2(field, "field");
  if (typeof field.ORDER !== "bigint")
    throw new TypeError('param "ORDER" is invalid: expected bigint, got ' + typeof field.ORDER);
  asafenumber(field.BYTES, "BYTES");
  asafenumber(field.BITS, "BITS");
  for (const name of FIELD_FIELDS)
    afunction(field[name], "field." + name);
  if (field.BYTES < 1 || field.BITS < 1)
    throw new Error("invalid field: expected BYTES/BITS > 0");
  if (field.ORDER <= _1n2)
    throw new Error("invalid field: expected ORDER > 1, got " + field.ORDER);
  return field;
}
function FpInvertBatch(Fp, nums, passZero = false) {
  validateField(Fp);
  aarray(nums, "nums");
  abool(passZero, "passZero");
  const F = Fp;
  const inverted = new Array(nums.length).fill(passZero ? F.ZERO : void 0);
  const multipliedAcc = nums.reduce((acc, num2, i) => {
    if (F.is0(num2))
      return acc;
    inverted[i] = acc;
    return F.mul(acc, num2);
  }, F.ONE);
  const invertedAcc = F.inv(multipliedAcc);
  nums.reduceRight((acc, num2, i) => {
    if (F.is0(num2))
      return acc;
    inverted[i] = F.mul(acc, inverted[i]);
    return F.mul(acc, num2);
  }, invertedAcc);
  return inverted;
}
function FpLegendre(Fp, n) {
  validateField(Fp);
  const F = Fp;
  aoddModulus(F.ORDER, "FpLegendre");
  const p1mod2 = (F.ORDER - _1n2) / _2n;
  const powered = F.pow(n, p1mod2);
  const yes = F.eql(powered, F.ONE);
  const zero = F.eql(powered, F.ZERO);
  const no = F.eql(powered, F.neg(F.ONE));
  if (!yes && !zero && !no)
    throw new Error("invalid Legendre symbol result");
  return yes ? 1 : zero ? 0 : -1;
}
function nLength(n, nBitLength) {
  if (nBitLength !== void 0)
    anumber2(nBitLength);
  if (n <= _0n2)
    throw new Error("invalid n length: expected positive n, got " + n);
  if (nBitLength !== void 0 && nBitLength < 1)
    throw new Error("invalid n length: expected positive bit length, got " + nBitLength);
  const bits = bitLen(n);
  if (nBitLength !== void 0 && nBitLength < bits)
    throw new Error(`invalid n length: expected nBitLength (${nBitLength}) >= bitLen(n) (${bits})`);
  const _nBitLength = nBitLength !== void 0 ? nBitLength : bits;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
var FIELD_SQRT = /* @__PURE__ */ new WeakMap();
var _Field = class {
  ORDER;
  BITS;
  BYTES;
  isLE;
  ZERO = _0n2;
  ONE = _1n2;
  _lengths;
  _mod;
  constructor(ORDER, opts = {}) {
    if (ORDER <= _1n2)
      throw new Error("invalid field: expected ORDER > 1, got " + ORDER);
    let _nbitLength = void 0;
    this.isLE = false;
    if (opts != null && typeof opts === "object") {
      if (typeof opts.BITS === "number")
        _nbitLength = opts.BITS;
      if (typeof opts.sqrt === "function")
        Object.defineProperty(this, "sqrt", { value: opts.sqrt, enumerable: true });
      if (typeof opts.isLE === "boolean")
        this.isLE = opts.isLE;
      if (opts.allowedLengths)
        this._lengths = Object.freeze(opts.allowedLengths.slice());
      if (typeof opts.modFromBytes === "boolean")
        this._mod = opts.modFromBytes;
    }
    const { nBitLength, nByteLength } = nLength(ORDER, _nbitLength);
    if (nByteLength > 2048)
      throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    this.ORDER = ORDER;
    this.BITS = nBitLength;
    this.BYTES = nByteLength;
    Object.freeze(this);
  }
  create(num2) {
    return mod(num2, this.ORDER);
  }
  isValid(num2) {
    if (typeof num2 !== "bigint")
      throw new TypeError("invalid field element: expected bigint, got " + typeof num2);
    return _0n2 <= num2 && num2 < this.ORDER;
  }
  is0(num2) {
    return num2 === _0n2;
  }
  // is valid and invertible
  isValidNot0(num2) {
    return !this.is0(num2) && this.isValid(num2);
  }
  isOdd(num2) {
    return (num2 & _1n2) === _1n2;
  }
  neg(num2) {
    return mod(-num2, this.ORDER);
  }
  eql(lhs, rhs) {
    return lhs === rhs;
  }
  sqr(num2) {
    return mod(num2 * num2, this.ORDER);
  }
  add(lhs, rhs) {
    return mod(lhs + rhs, this.ORDER);
  }
  sub(lhs, rhs) {
    return mod(lhs - rhs, this.ORDER);
  }
  mul(lhs, rhs) {
    return mod(lhs * rhs, this.ORDER);
  }
  pow(num2, power) {
    return pow(num2, power, this.ORDER);
  }
  div(lhs, rhs) {
    return mod(lhs * invert(rhs, this.ORDER), this.ORDER);
  }
  // Same as above, but doesn't normalize
  sqrN(num2) {
    return num2 * num2;
  }
  addN(lhs, rhs) {
    return lhs + rhs;
  }
  subN(lhs, rhs) {
    return lhs - rhs;
  }
  mulN(lhs, rhs) {
    return lhs * rhs;
  }
  inv(num2) {
    return invert(num2, this.ORDER);
  }
  sqrt(num2) {
    let sqrt = FIELD_SQRT.get(this);
    if (!sqrt)
      FIELD_SQRT.set(this, sqrt = FpSqrt(this.ORDER));
    return sqrt(this, num2);
  }
  toBytes(num2) {
    return this.isLE ? numberToBytesLE(num2, this.BYTES) : numberToBytesBE(num2, this.BYTES);
  }
  fromBytes(bytes, skipValidation = false) {
    abytes2(bytes);
    const { _lengths: allowedLengths, BYTES, isLE, ORDER, _mod: modFromBytes } = this;
    if (allowedLengths) {
      if (bytes.length < 1 || !allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
        throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
      }
      const padded = new Uint8Array(BYTES);
      padded.set(bytes, isLE ? 0 : padded.length - bytes.length);
      bytes = padded;
    }
    if (bytes.length !== BYTES)
      throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
    let scalar = isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
    if (modFromBytes)
      scalar = mod(scalar, ORDER);
    if (!skipValidation) {
      if (!this.isValid(scalar))
        throw new Error("invalid field element: outside of range 0..ORDER");
    }
    return scalar;
  }
  // TODO: we don't need it here, move out to separate fn
  invertBatch(lst) {
    return FpInvertBatch(this, lst, true);
  }
  // We can't move this out because Fp6, Fp12 implement it
  // and it's unclear what to return in there.
  cmov(a, b, condition) {
    abool(condition, "condition");
    return condition ? b : a;
  }
};
function Field(ORDER, opts = {}) {
  Object.freeze(_Field.prototype);
  return new _Field(ORDER, opts);
}
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== "bigint")
    throw new Error("field order must be bigint");
  if (fieldOrder <= _1n2)
    throw new Error("field order must be greater than 1");
  const bitLength = bitLen(fieldOrder - _1n2);
  return Math.ceil(bitLength / 8);
}
function getMinHashLength(fieldOrder) {
  const length = getFieldBytesLength(fieldOrder);
  return length + Math.ceil(length / 2);
}
function mapHashToField(key, fieldOrder, isLE = false) {
  abytes2(key);
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = Math.max(getMinHashLength(fieldOrder), 16);
  if (len < minLen || len > 1024)
    throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
  const num2 = isLE ? bytesToNumberLE(key) : bytesToNumberBE(key);
  const reduced = mod(num2, fieldOrder - _1n2) + _1n2;
  return isLE ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}

// node_modules/@noble/curves/abstract/curve.js
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n3 = /* @__PURE__ */ BigInt(0);
var _1n3 = /* @__PURE__ */ BigInt(1);
var _4n2 = /* @__PURE__ */ BigInt(4);
var BLIND_BYTES = 16;
var BLIND_BITS = 128;
var FW_WINDOW = 5;
var TABLE_BYTES_MAX = /* @__PURE__ */ (() => 2 ** 31)();
function validatePointCons(Point3) {
  const pc = Point3;
  if (typeof pc !== "function")
    throw new TypeError('"Point" expected constructor, got type=' + typeof Point3);
  afunction(pc.fromAffine, "Point.fromAffine");
  afunction(pc.fromBytes, "Point.fromBytes");
  afunction(pc.fromHex, "Point.fromHex");
  aobject2(pc.BASE, "Point.BASE");
  aobject2(pc.ZERO, "Point.ZERO");
  validateField(pc.Fp);
  validateField(pc.Fn);
}
function normalizeZ(c, points) {
  validatePointCons(c);
  validateMSMPoints(points, c);
  const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
  return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
}
function validateW(W, bits, min = 1) {
  if (!Number.isSafeInteger(W) || W < min || W > bits)
    throw new Error("invalid window size, expected [" + min + ".." + bits + "], got W=" + W);
}
function validateTableBytes(numPoints, fpBytes) {
  const bytes = numPoints * (4 * fpBytes + 128);
  if (bytes > TABLE_BYTES_MAX)
    throw new Error("invalid window size: table would need ~" + Math.ceil(bytes / 2 ** 20) + " MiB, max " + TABLE_BYTES_MAX / 2 ** 20 + " MiB");
}
function probeRandomBytes(randomBytes3, length) {
  if (randomBytes3 === void 0)
    return void 0;
  afunction(randomBytes3, "randomBytes");
  try {
    const probe = randomBytes3(length);
    if (!isBytes2(probe) || probe.length !== length)
      return void 0;
  } catch {
    return void 0;
  }
  return randomBytes3;
}
function validateMSMPoints(points, c) {
  aarray(points, "points");
  points.forEach((p, i) => {
    if (!(p instanceof c))
      throw new Error("invalid point at index " + i);
  });
}
function validateMSMScalars(scalars, field, maxScalar) {
  if (!Array.isArray(scalars))
    throw new Error("array of scalars expected");
  scalars.forEach((s, i) => {
    const ok = maxScalar === void 0 ? field.isValid(s) : isPosBig(s) && s < maxScalar;
    if (!ok)
      throw new Error("invalid scalar at index " + i);
  });
}
var pointWindowSizes = /* @__PURE__ */ new WeakMap();
function getWindowSize(P) {
  return pointWindowSizes.get(P) || 1;
}
function oddMultiples(p, size) {
  const dbl = p.double();
  const t = [p];
  for (let j = 1; j < size; j++)
    t.push(t[j - 1].add(dbl));
  return t;
}
function wnafDigits(n, W) {
  const size = 2 ** W;
  const half = size / 2;
  const mask = BigInt(size - 1);
  const d = [];
  while (n > _0n3) {
    let w = 0;
    if (n & _1n3) {
      w = Number(n & mask);
      if (w >= half)
        w -= size;
      n -= BigInt(w);
    }
    d.push(w);
    n >>= _1n3;
  }
  return d;
}
function signedWindowDigits(n, W, windows) {
  const size = 2 ** W;
  const half = size / 2;
  const mask = BigInt(size - 1);
  const shiftBy = BigInt(W);
  const d = [];
  for (let w = 0; w < windows; w++) {
    let v = Number(n & mask);
    n >>= shiftBy;
    if (v > half) {
      v -= size;
      n += _1n3;
    }
    d.push(v);
  }
  if (n !== _0n3)
    throw new Error("invalid wnaf");
  return d;
}
function wnafWalk(zero, tables, digits) {
  let max = 0;
  for (const d of digits)
    max = Math.max(max, d.length);
  let acc = zero;
  for (let bit = max - 1; bit >= 0; bit--) {
    if (bit !== max - 1)
      acc = acc.double();
    for (let i = 0; i < digits.length; i++) {
      const w = digits[i][bit];
      if (w) {
        const item = tables[i][Math.abs(w) - 1 >> 1];
        acc = acc.add(w < 0 ? item.negate() : item);
      }
    }
  }
  return acc;
}
var ScalarMultiplier = class {
  Point;
  BASE;
  ZERO;
  randomBytes;
  wnafPrecomputes = /* @__PURE__ */ new WeakMap();
  baseCanBeBlinded;
  bits;
  // Parametrized with a given Point class (not individual point)
  constructor(Point3, randomBytes3) {
    validatePointCons(Point3);
    this.randomBytes = probeRandomBytes(randomBytes3, BLIND_BYTES);
    this.Point = Point3;
    this.BASE = Point3.BASE;
    this.ZERO = Point3.ZERO;
    this.bits = Point3.Fn.BITS;
  }
  /**
   * Creates a signed fixed-window wNAF precomputation table: for every window w, the
   * multiples `[1..2^(W−1)]⋅2^(w⋅W)⋅P`, flattened. All doublings are baked into the table,
   * so cached multiplication is additions-only. `windows = ceil(bits/W) + 1`: the extra
   * window absorbs the final carry of signed-digit recoding.
   * For a 256-bit curve and W=6, the table is 44⋅32 = 1408 points.
   * @param point - Point instance
   * @param W - window size
   * @param bits - scalar bitlength the table must cover
   */
  buildWnafTable(point, W, bits) {
    const windows = Math.ceil(bits / W) + 1;
    const half = 2 ** (W - 1);
    const comp = [];
    let base = point;
    for (let w = 0; w < windows; w++) {
      let acc = base;
      for (let i = 0; i < half; i++) {
        comp.push(acc);
        acc = acc.add(base);
      }
      base = comp[comp.length - 1].double();
    }
    return { W, bits, windows, comp };
  }
  /**
   * Implements ec multiplication using precomputed signed fixed-window wNAF tables.
   * Constant-time: fixed window count with one table addition per window — zero digits feed
   * the fake accumulator — and no doublings; the lookup scans the whole window slice.
   * Scalar bounds are validated by the public entry points ({@link ScalarMultiplier.mulCT},
   * {@link ScalarMultiplier.mulCTBlinded}, {@link ScalarMultiplier.mulUnsafe});
   * signedWindowDigits throws if `n` exceeds the table.
   * @returns real and fake (for const-time) points
   */
  wnafCachedCT(precomputes, n) {
    const { W, windows, comp } = precomputes;
    const half = 2 ** (W - 1);
    const digits = signedWindowDigits(n, W, windows);
    let p = this.ZERO;
    let f = this.BASE;
    for (let w = 0; w < windows; w++) {
      const digit = digits[w];
      const start = w * half;
      const idx = Math.abs(digit) - 1;
      let sel = comp[start];
      for (let i = 1; i < half; i++)
        sel = i === idx ? comp[start + i] : sel;
      const neg = sel.negate();
      if (digit === 0)
        f = f.add(comp[start]);
      else
        p = p.add(digit < 0 ? neg : sel);
    }
    return { p, f };
  }
  // Cache key is point identity plus (W, bits); at most two entries exist per point (public-width
  // `Fn.BITS` and blinded `Fn.BITS + BLIND_BITS`). Callers must not reuse the same point with
  // incompatible `transform(...)` layouts and expect a separate cache entry.
  getWnafPrecomputes(W, point, bits, transform) {
    let entries = this.wnafPrecomputes.get(point);
    let comp = entries?.find((entry) => entry.W === W && entry.bits === bits);
    if (!comp) {
      comp = this.buildWnafTable(point, W, bits);
      if (typeof transform === "function")
        comp = { ...comp, comp: transform(comp.comp) };
      if (!entries) {
        entries = [];
        this.wnafPrecomputes.set(point, entries);
      }
      entries.push(comp);
    }
    return comp;
  }
  assertPoint(point) {
    if (!(point instanceof this.Point))
      throw new TypeError('"point" expected Point instance, got type=' + typeof point);
  }
  // Shared prologue of the constant-time entry points. Rejects scalar 0: in key/signature-style
  // callers a zero scalar means broken upstream plumbing, and concrete Points already reject it.
  // Uses inRange instead of Fn.isValidNot0: validateField() only certifies the arithmetic subset.
  validateMulInput(point, scalar) {
    this.assertPoint(point);
    if (!inRange(scalar, _1n3, this.Point.Fn.ORDER))
      throw new Error("invalid scalar");
  }
  // Constant-time dispatch shared by mulCT / mulCTBlinded. Un-precomputed points (W===1, e.g.
  // ECDH peer keys) skip building a throwaway cached table in favor of a small fixed-window
  // multiply. `n` must be < 2^bits.
  runCT(point, n, bits, transform) {
    const W = getWindowSize(point);
    if (W === 1)
      return this.fixedWindowCT(point, n, bits);
    return this.wnafCachedCT(this.getWnafPrecomputes(W, point, bits, transform), n);
  }
  mulCT(point, scalar, transform) {
    this.validateMulInput(point, scalar);
    return this.runCT(point, scalar, this.bits, transform);
  }
  mulCTBlinded(point, scalar, transform) {
    this.validateMulInput(point, scalar);
    if (this.randomBytes === void 0)
      throw new Error("randomBytes is required for scalar blinding");
    const bits = this.Point.Fn.BITS + BLIND_BITS;
    const blind = this.randomBytes(BLIND_BYTES);
    if (!isBytes2(blind) || blind.length !== BLIND_BYTES)
      throw new Error("randomBytes returned invalid byte array");
    blind[0] = blind[0] & 63 | 128;
    const n = scalar + bytesToNumberBE(blind) * this.Point.Fn.ORDER;
    return this.runCT(point, n, bits, transform);
  }
  /**
   * Constant-time multiplication `n*point` for an un-precomputed point, via a small fixed window.
   * A cached wNAF table only pays off when reused; a flat 2^FW_WINDOW table (`size-1` adds) is
   * far cheaper to build for a single use. The point-operation sequence is independent of `n`:
   * build the table, then per window exactly FW_WINDOW doublings, a data-oblivious scan over
   * every table entry, and one addition (adds the identity when the window digit is 0 — never
   * skipped).
   *
   * `n` must be `< 2^bits`. Assumes complete addition (adding the identity costs the same as any
   * add), which holds for the Weierstrass/Edwards point types used here. The table is left in
   * projective form (no normalizeZ): normalizing this small a table costs more than the
   * mixed-add savings it would buy for a single multiply.
   * @returns real point `p`; `f` duplicates it only to match {@link wnafCachedCT}'s return shape
   * (this path needs no fake accumulator — its op-count is already scalar-independent).
   */
  fixedWindowCT(point, n, bits) {
    const W = FW_WINDOW;
    const size = 1 << W;
    const mask = bitMask(W);
    const table = new Array(size);
    table[0] = this.ZERO;
    for (let i = 1; i < size; i++)
      table[i] = table[i - 1].add(point);
    const windows = Math.ceil(bits / W);
    let acc = this.ZERO;
    for (let window = windows - 1; window >= 0; window--) {
      if (window !== windows - 1)
        for (let d = 0; d < W; d++)
          acc = acc.double();
      const digit = Number(n >> BigInt(window * W) & mask);
      let sel = table[0];
      for (let i = 1; i < size; i++)
        sel = i === digit ? table[i] : sel;
      acc = acc.add(sel);
    }
    return { p: acc, f: acc };
  }
  shouldBlind(point, cofactor) {
    if (this.randomBytes === void 0)
      return false;
    if (cofactor === _1n3)
      return true;
    if (point !== this.BASE)
      return false;
    if (this.baseCanBeBlinded === void 0)
      this.baseCanBeBlinded = this.mulUnsafe(this.BASE, this.Point.Fn.ORDER).is0();
    return this.baseCanBeBlinded;
  }
  mulSecret(point, scalar, cofactor, transform) {
    return this.shouldBlind(point, cofactor) ? this.mulCTBlinded(point, scalar, transform) : this.mulCT(point, scalar, transform);
  }
  mulUnsafe(point, scalar, transform) {
    this.assertPoint(point);
    if (!isPosBig(scalar))
      throw new Error("invalid scalar");
    const W = getWindowSize(point);
    if (W === 1 || scalar >= this.Point.Fn.ORDER)
      return mulAddUnsafe(this.Point, [point], [scalar], true);
    const precomputes = this.getWnafPrecomputes(W, point, this.bits, transform);
    return this.wnafCachedCT(precomputes, scalar).p;
  }
  // Remembers the window size used for precomputed wNAF multiplication of the given point
  // and drops any previously built tables. Usually only the base point is precomputed.
  // W=1 resets the point to the un-precomputed (table-less) paths.
  // W is additionally capped so tables stay under ~2 GiB ({@link TABLE_BYTES_MAX}).
  setWindowSize(point, W) {
    this.assertPoint(point);
    validateW(W, this.bits);
    const windows = Math.ceil((this.bits + BLIND_BITS) / W) + 1;
    validateTableBytes(windows * 2 ** (W - 1), this.Point.Fp.BYTES);
    pointWindowSizes.set(point, W);
    this.wnafPrecomputes.delete(point);
  }
  // True when a window size is set: tables themselves are built lazily on first multiply.
  hasWindowSize(point) {
    return getWindowSize(point) !== 1;
  }
};
function mulAddUnsafe(c, points, scalars, allowOversized = false) {
  validatePointCons(c);
  validateMSMPoints(points, c);
  abool(allowOversized, "allowOversized");
  validateMSMScalars(scalars, c.Fn, allowOversized ? c.Fn.ORDER ** _4n2 : void 0);
  if (points.length !== scalars.length)
    throw new Error("arrays of points and scalars must have equal length");
  const tables = points.map((p) => oddMultiples(p, 4));
  const digits = scalars.map((n) => wnafDigits(n, 4));
  return wnafWalk(c.ZERO, tables, digits);
}
function createField(order, field, isLE) {
  if (field) {
    if (field.ORDER !== order)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    validateField(field);
    return field;
  } else {
    return Field(order, { isLE });
  }
}
function createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
  if (type !== "weierstrass" && type !== "edwards")
    throw new Error('expected curve type "weierstrass" or "edwards"');
  if (FpFnLE === void 0)
    FpFnLE = type === "edwards";
  if (!CURVE || typeof CURVE !== "object")
    throw new Error(`expected valid ${type} CURVE object`);
  validateObject(curveOpts);
  for (const p of ["p", "n", "h"]) {
    const val = CURVE[p];
    if (!(isPosBig(val) && val !== _0n3))
      throw new Error(`CURVE.${p} must be positive bigint`);
  }
  const Fp = createField(CURVE.p, curveOpts.Fp, FpFnLE);
  const Fn3 = createField(CURVE.n, curveOpts.Fn, FpFnLE);
  const _b = type === "weierstrass" ? "b" : "d";
  const params = ["Gx", "Gy", "a", _b];
  for (const p of params) {
    if (!Fp.isValid(CURVE[p]))
      throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
  }
  CURVE = Object.freeze(Object.assign({}, CURVE));
  return { CURVE, Fp, Fn: Fn3 };
}
function createKeygen(randomSecretKey, getPublicKey) {
  return function keygen(seed) {
    const secretKey = randomSecretKey(seed);
    return { secretKey, publicKey: getPublicKey(secretKey) };
  };
}

// node_modules/@noble/hashes/hmac.js
var _HMAC = class {
  oHash;
  iHash;
  blockLen;
  outputLen;
  canXOF = false;
  finished = false;
  destroyed = false;
  constructor(hash, key) {
    ahash(hash);
    abytes(key, void 0, "key");
    this.iHash = hash.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("expected Hash instance");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad = new Uint8Array(blockLen);
    pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54;
    this.iHash.update(pad);
    this.oHash = hash.create();
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54 ^ 92;
    this.oHash.update(pad);
    clean(pad);
  }
  update(buf) {
    aexists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const buf = out.subarray(0, this.outputLen);
    this.iHash.digestInto(buf);
    this.oHash.update(buf);
    this.oHash.digestInto(buf);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to ||= Object.create(Object.getPrototypeOf(this), {});
    const { oHash, iHash, finished, destroyed, blockLen, outputLen, canXOF } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.canXOF = canXOF;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac = /* @__PURE__ */ (() => {
  const hmac_ = ((hash, key, message) => new _HMAC(hash, key).update(message).digest());
  hmac_.create = (hash, key) => new _HMAC(hash, key);
  return hmac_;
})();

// node_modules/@noble/curves/abstract/der.js
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n4 = /* @__PURE__ */ BigInt(0);
var DERErr = class extends Error {
  constructor(m = "") {
    super(m);
  }
};
var _DER = {
  // asn.1 DER encoding utils
  Err: DERErr,
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: (tag, data) => {
      const { Err: E } = _DER;
      asafenumber(tag, "tag");
      if (tag < 0 || tag > 255)
        throw new E("tlv.encode: wrong tag");
      astring(data, "data");
      if (data.length & 1)
        throw new E("tlv.encode: unpadded data");
      const dataLen = data.length / 2;
      const len = numberToHexUnpadded(dataLen);
      if (len.length / 2 & 128)
        throw new E("tlv.encode: long form length too big");
      const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
      const t = numberToHexUnpadded(tag);
      return t + lenLen + len + data;
    },
    // v - value, l - left bytes (unparsed)
    decode(tag, data) {
      const { Err: E } = _DER;
      data = abytes2(data, void 0, "DER data");
      let pos = 0;
      if (tag < 0 || tag > 255)
        throw new E("tlv.decode: wrong tag");
      if (data.length < 2 || data[pos++] !== tag)
        throw new E("tlv.decode: wrong tlv");
      const first = data[pos++];
      const isLong = !!(first & 128);
      let length = 0;
      if (!isLong)
        length = first;
      else {
        const lenLen = first & 127;
        if (!lenLen)
          throw new E("tlv.decode(long): indefinite length not supported");
        if (lenLen > 4)
          throw new E("tlv.decode(long): byte length is too big");
        const lengthBytes = data.subarray(pos, pos + lenLen);
        if (lengthBytes.length !== lenLen)
          throw new E("tlv.decode: length bytes not complete");
        if (lengthBytes[0] === 0)
          throw new E("tlv.decode(long): zero leftmost byte");
        for (const b of lengthBytes)
          length = length << 8 | b;
        pos += lenLen;
        if (length < 128)
          throw new E("tlv.decode(long): not minimal encoding");
      }
      const v = data.subarray(pos, pos + length);
      if (v.length !== length)
        throw new E("tlv.decode: wrong value length");
      return { v, l: data.subarray(pos + length) };
    }
  },
  // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
  // since we always use positive integers here. It must always be empty:
  // - add zero byte if exists
  // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
  _int: {
    encode(num2) {
      const { Err: E } = _DER;
      abignumber(num2);
      if (num2 < _0n4)
        throw new E("integer: negative integers are not allowed");
      let hex2 = numberToHexUnpadded(num2);
      if (Number.parseInt(hex2[0], 16) & 8)
        hex2 = "00" + hex2;
      if (hex2.length & 1)
        throw new E("unexpected DER parsing assertion: unpadded hex");
      return hex2;
    },
    decode(data) {
      const { Err: E } = _DER;
      if (data.length < 1)
        throw new E("invalid signature integer: empty");
      if (data[0] & 128)
        throw new E("invalid signature integer: negative");
      if (data.length > 1 && data[0] === 0 && !(data[1] & 128))
        throw new E("invalid signature integer: unnecessary leading zero");
      return bytesToNumberBE(data);
    }
  },
  toSig(bytes, maxScalarBytes) {
    const { Err: E, _int: int, _tlv: tlv } = _DER;
    if (maxScalarBytes !== void 0) {
      asafenumber(maxScalarBytes, "maxScalarBytes");
      if (maxScalarBytes < 1)
        throw new E("invalid signature: maxScalarBytes must be positive");
    }
    const data = abytes2(bytes, void 0, "signature");
    const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
    if (seqLeftBytes.length)
      throw new E("invalid signature: left bytes after parsing");
    const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
    const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
    if (sLeftBytes.length)
      throw new E("invalid signature: left bytes after parsing");
    if (maxScalarBytes !== void 0 && (rBytes.length > maxScalarBytes || sBytes.length > maxScalarBytes))
      throw new E("invalid signature: integer too large");
    return { r: int.decode(rBytes), s: int.decode(sBytes) };
  },
  hexFromSig(sig) {
    const { _tlv: tlv, _int: int } = _DER;
    validateObject(sig, { r: "bigint", s: "bigint" }, {}, "sig");
    const rs = tlv.encode(2, int.encode(sig.r));
    const ss = tlv.encode(2, int.encode(sig.s));
    const seq = rs + ss;
    return tlv.encode(48, seq);
  }
};
var DER = /* @__PURE__ */ (() => {
  Object.freeze(_DER._tlv);
  Object.freeze(_DER._int);
  return Object.freeze(_DER);
})();

// node_modules/@noble/curves/abstract/weierstrass.js
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var divNearest = (num2, den) => (num2 + (num2 >= 0 ? den : -den) / _2n2) / den;
function _splitEndoScalar(k, basis, n) {
  aInRange("scalar", k, _0n5, n);
  const [[a1, b1], [a2, b2]] = basis;
  const c1 = divNearest(b2 * k, n);
  const c2 = divNearest(-b1 * k, n);
  let k1 = k - c1 * a1 - c2 * a2;
  let k2 = -c1 * b1 - c2 * b2;
  const k1neg = k1 < _0n5;
  const k2neg = k2 < _0n5;
  if (k1neg)
    k1 = -k1;
  if (k2neg)
    k2 = -k2;
  const MAX_NUM = bitMask(Math.ceil(bitLen(n) / 2)) + _1n4;
  if (k1 < _0n5 || k1 >= MAX_NUM || k2 < _0n5 || k2 >= MAX_NUM) {
    throw new Error("splitScalar (endomorphism): failed for k");
  }
  return { k1neg, k1, k2neg, k2 };
}
function validateSigFormat(format) {
  if (!["compact", "recovered", "der"].includes(format))
    throw new Error('Signature format must be "compact", "recovered", or "der"');
  return format;
}
function validateSigOpts(opts, def2) {
  validateObject(opts);
  const optsn = {};
  for (let optName of Object.keys(def2)) {
    optsn[optName] = opts[optName] === void 0 ? def2[optName] : opts[optName];
  }
  abool(optsn.lowS, "lowS");
  abool(optsn.prehash, "prehash");
  if (optsn.format !== void 0)
    validateSigFormat(optsn.format);
  return optsn;
}
var _0n5 = /* @__PURE__ */ BigInt(0);
var _1n4 = /* @__PURE__ */ BigInt(1);
var _2n2 = /* @__PURE__ */ BigInt(2);
var _3n2 = /* @__PURE__ */ BigInt(3);
var _4n3 = /* @__PURE__ */ BigInt(4);
function weierstrass(params, extraOpts = {}) {
  const validated = createCurveFields("weierstrass", params, extraOpts);
  const Fp = validated.Fp;
  const Fn3 = validated.Fn;
  let CURVE = validated.CURVE;
  const { h: cofactor, n: CURVE_ORDER2 } = CURVE;
  validateObject(extraOpts, {}, {
    allowInfinityPoint: "boolean",
    clearCofactor: "function",
    isTorsionFree: "function",
    fromBytes: "function",
    toBytes: "function",
    endo: "object",
    randomBytes: "function"
  });
  const { endo: endoOpts, allowInfinityPoint, clearCofactor, isTorsionFree, fromBytes, toBytes } = extraOpts;
  const randomBytes3 = extraOpts.randomBytes === void 0 ? randomBytes2 : extraOpts.randomBytes;
  if (endoOpts) {
    if (!Fp.is0(CURVE.a) || typeof endoOpts.beta !== "bigint" || !Array.isArray(endoOpts.basises)) {
      throw new Error('invalid endo: expected "beta": bigint and "basises": array');
    }
  }
  const endo = endoOpts ? {
    beta: endoOpts.beta,
    basises: endoOpts.basises.map((basis) => [...basis])
  } : void 0;
  const lengths = getWLengths(Fp, Fn3);
  function assertCompressionIsSupported() {
    if (!Fp.isOdd)
      throw new Error("compression is not supported: Field does not have .isOdd()");
  }
  function pointToBytes2(_c, point, isCompressed) {
    if (point.is0()) {
      if (!allowInfinityPoint)
        throw new Error("bad point: ZERO");
      return Uint8Array.of(0);
    }
    const { x, y } = point.toAffine();
    const bx = Fp.toBytes(x);
    abool(isCompressed, "isCompressed");
    if (isCompressed) {
      assertCompressionIsSupported();
      const hasEvenY = !Fp.isOdd(y);
      return concatBytes2(pprefix(hasEvenY), bx);
    } else {
      return concatBytes2(Uint8Array.of(4), bx, Fp.toBytes(y));
    }
  }
  function pointFromBytes(bytes) {
    abytes2(bytes, void 0, "Point");
    const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
    const length = bytes.length;
    const head = bytes[0];
    const tail = bytes.subarray(1);
    if (allowInfinityPoint && length === 1 && head === 0)
      return { x: Fp.ZERO, y: Fp.ZERO };
    if (length === comp && (head === 2 || head === 3)) {
      const x = Fp.fromBytes(tail);
      if (!Fp.isValid(x))
        throw new Error("bad point: is not on curve, wrong x");
      const y2 = weierstrassEquation(x);
      let y;
      try {
        y = Fp.sqrt(y2);
      } catch (sqrtError) {
        const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
        throw new Error("bad point: is not on curve, sqrt error" + err);
      }
      assertCompressionIsSupported();
      const evenY = Fp.isOdd(y);
      const evenH = (head & 1) === 1;
      if (evenH !== evenY)
        y = Fp.neg(y);
      return { x, y };
    } else if (length === uncomp && head === 4) {
      const L = Fp.BYTES;
      const x = Fp.fromBytes(tail.subarray(0, L));
      const y = Fp.fromBytes(tail.subarray(L, L * 2));
      if (!isValidXY(x, y))
        throw new Error("bad point: is not on curve");
      return { x, y };
    } else {
      throw new Error(`bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`);
    }
  }
  const encodePoint = toBytes === void 0 ? pointToBytes2 : toBytes;
  const decodePoint = fromBytes === void 0 ? pointFromBytes : fromBytes;
  const b3 = Fp.mul(CURVE.b, _3n2);
  const mulA = Fp.is0(CURVE.a) ? (_) => Fp.ZERO : (x) => Fp.mul(CURVE.a, x);
  function weierstrassEquation(x) {
    const x2 = Fp.sqr(x);
    const x3 = Fp.mul(x2, x);
    return Fp.add(Fp.add(x3, Fp.mul(x, CURVE.a)), CURVE.b);
  }
  function isValidXY(x, y) {
    const left = Fp.sqr(y);
    const right = weierstrassEquation(x);
    return Fp.eql(left, right);
  }
  if (!isValidXY(CURVE.Gx, CURVE.Gy))
    throw new Error("bad curve params: generator point");
  const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n2), _4n3);
  const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
  if (Fp.is0(Fp.add(_4a3, _27b2)))
    throw new Error("bad curve params: a or b");
  function acoord(title, n, banZero = false) {
    if (!Fp.isValid(n) || banZero && Fp.is0(n))
      throw new Error(`bad point coordinate ${title}`);
    return typeof n === "object" && n !== null ? Fp.create(n) : n;
  }
  function aprjpoint(other) {
    if (!(other instanceof Point3))
      throw new Error("Weierstrass Point expected");
  }
  function splitEndoScalarN(k) {
    if (!endo || !endo.basises)
      throw new Error("no endo");
    return _splitEndoScalar(k, endo.basises, Fn3.ORDER);
  }
  function pushWnafPair(points, scalars, p, k) {
    if (!Fn3.isValid(k))
      throw new RangeError("invalid scalar: out of range");
    if (endo) {
      const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(k);
      const psi = new Point3(Fp.mul(p.X, endo.beta), p.Y, p.Z);
      points.push(k1neg ? p.negate() : p, k2neg ? psi.negate() : psi);
      scalars.push(k1, k2);
    } else {
      points.push(p);
      scalars.push(k);
    }
  }
  const validityCache = /* @__PURE__ */ new WeakSet();
  class Point3 {
    static BASE = new Point3(CURVE.Gx, CURVE.Gy, Fp.ONE);
    static ZERO = new Point3(Fp.ZERO, Fp.ONE, Fp.ZERO);
    static Fp = Fp;
    static Fn = Fn3;
    X;
    Y;
    Z;
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    constructor(X, Y, Z) {
      this.X = acoord("x", X);
      this.Y = acoord("y", Y, true);
      this.Z = acoord("z", Z);
      Object.freeze(this);
    }
    static CURVE() {
      return CURVE;
    }
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("invalid affine point");
      if (p instanceof Point3)
        throw new Error("projective point not allowed");
      if (Fp.is0(x) && Fp.is0(y))
        return Point3.ZERO;
      return new Point3(x, y, Fp.ONE);
    }
    static fromBytes(bytes) {
      const P = Point3.fromAffine(decodePoint(abytes2(bytes, void 0, "point")));
      P.assertValidity();
      return P;
    }
    static fromHex(hex2) {
      return Point3.fromBytes(hexToBytes2(hex2));
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     * @param isLazy - true will defer table computation until the first multiplication
     */
    precompute(windowSize = 6, isLazy = true) {
      wnaf.setWindowSize(this, windowSize);
      if (!isLazy)
        this.multiply(_3n2);
      return this;
    }
    // TODO: return `this`
    /** A point on curve is valid if it conforms to equation. */
    assertValidity() {
      const p = this;
      if (p.is0()) {
        if (allowInfinityPoint && Fp.is0(p.X) && Fp.eql(p.Y, Fp.ONE) && Fp.is0(p.Z))
          return;
        throw new Error("bad point: ZERO");
      }
      if (validityCache.has(p))
        return;
      const { x, y } = p.toAffine();
      if (!Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("bad point: x or y not field elements");
      if (!isValidXY(x, y))
        throw new Error("bad point: equation left != right");
      if (!p.isTorsionFree())
        throw new Error("bad point: not in prime-order subgroup");
      validityCache.add(p);
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (!Fp.isOdd)
        throw new Error("Field doesn't support isOdd");
      return !Fp.isOdd(y);
    }
    /** Compare one point to another. */
    equals(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
      const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
      return U1 && U2;
    }
    /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
    negate() {
      return new Point3(this.X, Fp.neg(this.Y), this.Z);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { X: X1, Y: Y1, Z: Z1 } = this;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      let t0 = Fp.mul(X1, X1);
      let t1 = Fp.mul(Y1, Y1);
      let t2 = Fp.mul(Z1, Z1);
      let t3 = Fp.mul(X1, Y1);
      t3 = Fp.add(t3, t3);
      Z3 = Fp.mul(X1, Z1);
      Z3 = Fp.add(Z3, Z3);
      X3 = mulA(Z3);
      Y3 = Fp.mul(b3, t2);
      Y3 = Fp.add(X3, Y3);
      X3 = Fp.sub(t1, Y3);
      Y3 = Fp.add(t1, Y3);
      Y3 = Fp.mul(X3, Y3);
      X3 = Fp.mul(t3, X3);
      Z3 = Fp.mul(b3, Z3);
      t2 = mulA(t2);
      t3 = Fp.sub(t0, t2);
      t3 = mulA(t3);
      t3 = Fp.add(t3, Z3);
      Z3 = Fp.add(t0, t0);
      t0 = Fp.add(Z3, t0);
      t0 = Fp.add(t0, t2);
      t0 = Fp.mul(t0, t3);
      Y3 = Fp.add(Y3, t0);
      t2 = Fp.mul(Y1, Z1);
      t2 = Fp.add(t2, t2);
      t0 = Fp.mul(t2, t3);
      X3 = Fp.sub(X3, t0);
      Z3 = Fp.mul(t2, t1);
      Z3 = Fp.add(Z3, Z3);
      Z3 = Fp.add(Z3, Z3);
      return new Point3(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      let t0 = Fp.mul(X1, X2);
      let t1 = Fp.mul(Y1, Y2);
      let t2 = Fp.mul(Z1, Z2);
      let t3 = Fp.add(X1, Y1);
      let t4 = Fp.add(X2, Y2);
      t3 = Fp.mul(t3, t4);
      t4 = Fp.add(t0, t1);
      t3 = Fp.sub(t3, t4);
      t4 = Fp.add(X1, Z1);
      let t5 = Fp.add(X2, Z2);
      t4 = Fp.mul(t4, t5);
      t5 = Fp.add(t0, t2);
      t4 = Fp.sub(t4, t5);
      t5 = Fp.add(Y1, Z1);
      X3 = Fp.add(Y2, Z2);
      t5 = Fp.mul(t5, X3);
      X3 = Fp.add(t1, t2);
      t5 = Fp.sub(t5, X3);
      Z3 = mulA(t4);
      X3 = Fp.mul(b3, t2);
      Z3 = Fp.add(X3, Z3);
      X3 = Fp.sub(t1, Z3);
      Z3 = Fp.add(t1, Z3);
      Y3 = Fp.mul(X3, Z3);
      t1 = Fp.add(t0, t0);
      t1 = Fp.add(t1, t0);
      t2 = mulA(t2);
      t4 = Fp.mul(b3, t4);
      t1 = Fp.add(t1, t2);
      t2 = Fp.sub(t0, t2);
      t2 = mulA(t2);
      t4 = Fp.add(t4, t2);
      t0 = Fp.mul(t1, t4);
      Y3 = Fp.add(Y3, t0);
      t0 = Fp.mul(t5, t4);
      X3 = Fp.mul(t3, X3);
      X3 = Fp.sub(X3, t0);
      t0 = Fp.mul(t3, t1);
      Z3 = Fp.mul(t5, Z3);
      Z3 = Fp.add(Z3, t0);
      return new Point3(X3, Y3, Z3);
    }
    subtract(other) {
      aprjpoint(other);
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point3.ZERO);
    }
    /**
     * Constant time multiplication.
     * Uses precomputed tables (signed fixed-window wNAF) when available.
     * Uses scalar blinding and avoids endomorphism splitting in the secret-scalar path.
     * @param scalar - by which the point would be multiplied
     * @returns New point
     */
    multiply(scalar) {
      if (!Fn3.isValidNot0(scalar))
        throw new RangeError("invalid scalar: out of range");
      const { p, f } = wnaf.mulSecret(this, scalar, cofactor, normalize2);
      return normalize2([p, f])[0];
    }
    /**
     * Non-constant-time multiplication. Uses width-4 wNAF with GLV endomorphism splitting
     * when available (two half-width scalars sharing one halved doubling chain).
     * It's faster, but should only be used when you don't care about
     * an exposed secret key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(scalar) {
      const p = this;
      const sc = scalar;
      if (!Fn3.isValid(sc))
        throw new RangeError("invalid scalar: out of range");
      if (sc === _0n5 || p.is0())
        return Point3.ZERO;
      if (sc === _1n4)
        return p;
      if (wnaf.hasWindowSize(this))
        return wnaf.mulUnsafe(p, sc, normalize2);
      const points = [];
      const scalars = [];
      pushWnafPair(points, scalars, p, sc);
      return mulAddUnsafe(Point3, points, scalars);
    }
    /**
     * Non-constant-time double-scalar multiplication `a⋅this + b⋅other` (Strauss–Shamir).
     * Both walks share one doubling chain via {@link mulAddUnsafe}, and GLV endomorphism
     * (when available) halves the chain again by splitting each scalar into two half-width
     * parts. Used by ECDSA verification and public-key recovery for `R = u1⋅G + u2⋅P`.
     * Only for public scalars.
     */
    mulAddUnsafe(a, other, b) {
      aprjpoint(other);
      const points = [];
      const scalars = [];
      pushWnafPair(points, scalars, this, a);
      pushWnafPair(points, scalars, other, b);
      return mulAddUnsafe(Point3, points, scalars);
    }
    /**
     * Converts Projective point to affine (x, y) coordinates.
     * (X, Y, Z) ∋ (x=X/Z, y=Y/Z).
     * @param invertedZ - Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
     */
    toAffine(invertedZ) {
      const p = this;
      let iz = invertedZ;
      if (iz != null && !Fp.isValid(iz))
        throw new RangeError('"invertedZ" expected valid field element');
      const { X, Y, Z } = p;
      if (Fp.eql(Z, Fp.ONE))
        return { x: X, y: Y };
      const is0 = p.is0();
      if (iz == null)
        iz = is0 ? Fp.ONE : Fp.inv(Z);
      const x = Fp.mul(X, iz);
      const y = Fp.mul(Y, iz);
      const zz = Fp.mul(Z, iz);
      if (is0)
        return { x: Fp.ZERO, y: Fp.ZERO };
      if (!Fp.eql(zz, Fp.ONE))
        throw new Error("invZ was invalid");
      return { x, y };
    }
    /**
     * Checks whether Point is free of torsion elements (is in prime subgroup).
     * Always torsion-free for cofactor=1 curves.
     */
    isTorsionFree() {
      if (cofactor === _1n4)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point3, this);
      return wnaf.mulUnsafe(this, CURVE_ORDER2).is0();
    }
    clearCofactor() {
      if (cofactor === _1n4)
        return this;
      if (clearCofactor)
        return clearCofactor(Point3, this);
      return this.multiplyUnsafe(cofactor);
    }
    isSmallOrder() {
      if (cofactor === _1n4)
        return this.is0();
      return this.clearCofactor().is0();
    }
    toBytes(isCompressed = true) {
      abool(isCompressed, "isCompressed");
      this.assertValidity();
      return encodePoint(Point3, this, isCompressed);
    }
    toHex(isCompressed = true) {
      return bytesToHex2(this.toBytes(isCompressed));
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const normalize2 = (points) => normalizeZ(Point3, points);
  const wnaf = new ScalarMultiplier(Point3, randomBytes3);
  if (wnaf.bits >= 6)
    Point3.BASE.precompute(6);
  Object.freeze(Point3.prototype);
  Object.freeze(Point3);
  return Point3;
}
function pprefix(hasEvenY) {
  return Uint8Array.of(hasEvenY ? 2 : 3);
}
function getWLengths(Fp, Fn3) {
  return {
    secretKey: Fn3.BYTES,
    publicKey: 1 + Fp.BYTES,
    publicKeyUncompressed: 1 + 2 * Fp.BYTES,
    publicKeyHasPrefix: true,
    // Raw compact `(r || s)` signature width; DER and recovered signatures use
    // different lengths outside this helper.
    signature: 2 * Fn3.BYTES
  };
}
function ecdh(Point3, ecdhOpts = {}) {
  validatePointCons(Point3);
  const { Fn: Fn3 } = Point3;
  const randomBytes_ = ecdhOpts.randomBytes === void 0 ? randomBytes2 : ecdhOpts.randomBytes;
  const lengths = Object.assign(getWLengths(Point3.Fp, Fn3), {
    seed: Math.max(getMinHashLength(Fn3.ORDER), 16)
  });
  function isValidSecretKey(secretKey) {
    try {
      const num2 = Fn3.fromBytes(secretKey);
      return Fn3.isValidNot0(num2);
    } catch (error) {
      return false;
    }
  }
  function isValidPublicKey(publicKey, isCompressed) {
    const { publicKey: comp, publicKeyUncompressed } = lengths;
    try {
      const l = publicKey.length;
      if (isCompressed === true && l !== comp)
        return false;
      if (isCompressed === false && l !== publicKeyUncompressed)
        return false;
      return !Point3.fromBytes(publicKey).is0();
    } catch (error) {
      return false;
    }
  }
  function randomSecretKey(seed) {
    seed = seed === void 0 ? randomBytes_(lengths.seed) : seed;
    return mapHashToField(abytes2(seed, lengths.seed, "seed"), Fn3.ORDER);
  }
  function getPublicKey(secretKey, isCompressed = true) {
    return Point3.BASE.multiply(Fn3.fromBytes(secretKey)).toBytes(isCompressed);
  }
  function isProbPub(item) {
    const { secretKey, publicKey, publicKeyUncompressed } = lengths;
    const allowedLengths = Fn3._lengths;
    if (!isBytes2(item))
      return void 0;
    const l = abytes2(item, void 0, "key").length;
    const isPub = l === publicKey || l === publicKeyUncompressed;
    const isSec = l === secretKey || !!allowedLengths?.includes(l);
    if (isPub && isSec)
      return void 0;
    return isPub;
  }
  function getSharedSecret(secretKeyA, publicKeyB, isCompressed = true) {
    if (isProbPub(secretKeyA) === true)
      throw new Error("first arg must be private key");
    if (isProbPub(publicKeyB) === false)
      throw new Error("second arg must be public key");
    const s = Fn3.fromBytes(secretKeyA);
    const b = Point3.fromBytes(publicKeyB);
    if (b.is0())
      throw new Error("invalid public key: point at infinity");
    return b.multiply(s).toBytes(isCompressed);
  }
  const utils2 = {
    isValidSecretKey,
    isValidPublicKey,
    randomSecretKey
  };
  const keygen = createKeygen(randomSecretKey, getPublicKey);
  Object.freeze(utils2);
  Object.freeze(lengths);
  return Object.freeze({ getPublicKey, getSharedSecret, keygen, Point: Point3, utils: utils2, lengths });
}
function ecdsa(Point3, hash, ecdsaOpts = {}) {
  validatePointCons(Point3);
  const hash_ = hash;
  ahash(hash_);
  validateObject(ecdsaOpts, {}, {
    hmac: "function",
    lowS: "boolean",
    randomBytes: "function",
    bits2int: "function",
    bits2int_modN: "function"
  });
  const opts = Object.assign({}, ecdsaOpts);
  const randomBytes3 = opts.randomBytes === void 0 ? randomBytes2 : opts.randomBytes;
  const hmac2 = opts.hmac === void 0 ? (key, msg) => hmac(hash_, key, msg) : opts.hmac;
  const { Fp, Fn: Fn3 } = Point3;
  const { ORDER: CURVE_ORDER2, BITS: fnBits } = Fn3;
  const blindLength = getMinHashLength(CURVE_ORDER2);
  const csprng = probeRandomBytes(randomBytes3, blindLength);
  const { keygen, getPublicKey, getSharedSecret, utils: utils2, lengths } = ecdh(Point3, opts);
  const defaultSigOpts = {
    prehash: true,
    lowS: typeof opts.lowS === "boolean" ? opts.lowS : true,
    format: "compact",
    extraEntropy: false
  };
  const hasLargeRecoveryLifts = CURVE_ORDER2 * _2n2 + _1n4 < Fp.ORDER;
  function isBiggerThanHalfOrder(number) {
    const HALF = CURVE_ORDER2 >> _1n4;
    return number > HALF;
  }
  function validateRS(title, num2) {
    if (!Fn3.isValidNot0(num2))
      throw new Error(`invalid signature ${title}: out of range 1..Point.Fn.ORDER`);
    return num2;
  }
  function assertFieldSignIsSupported() {
    if (!Fp.isOdd)
      throw new Error("Field doesn't support isOdd");
  }
  function getRecoveryBit(x, y, r) {
    assertFieldSignIsSupported();
    return (x === r ? 0 : 2) | Number(Fp.isOdd(y));
  }
  function assertRecoverableCurve() {
    if (hasLargeRecoveryLifts)
      throw new Error('"recovered" sig type is not supported for cofactor >2 curves');
  }
  function validateSigLength(bytes, format) {
    validateSigFormat(format);
    const size = lengths.signature;
    const sizer = format === "compact" ? size : format === "recovered" ? size + 1 : void 0;
    return abytes2(bytes, sizer);
  }
  class Signature {
    r;
    s;
    recovery;
    constructor(r, s, recovery) {
      this.r = validateRS("r", r);
      this.s = validateRS("s", s);
      if (recovery != null) {
        assertRecoverableCurve();
        if (![0, 1, 2, 3].includes(recovery))
          throw new Error("invalid recovery id");
        this.recovery = recovery;
      }
      Object.freeze(this);
    }
    static fromBytes(bytes, format = defaultSigOpts.format) {
      validateSigLength(bytes, format);
      let recid;
      if (format === "der") {
        if (bytes.length > 2 * Fn3.BYTES + 16)
          throw new DER.Err("invalid signature: DER signature too long");
        const { r: r2, s: s2 } = DER.toSig(abytes2(bytes), Fn3.BYTES + 1);
        return new Signature(r2, s2);
      }
      if (format === "recovered") {
        recid = bytes[0];
        format = "compact";
        bytes = bytes.subarray(1);
      }
      const L = lengths.signature / 2;
      const r = bytes.subarray(0, L);
      const s = bytes.subarray(L, L * 2);
      return new Signature(Fn3.fromBytes(r), Fn3.fromBytes(s), recid);
    }
    static fromHex(hex2, format) {
      return this.fromBytes(hexToBytes2(hex2), format);
    }
    assertRecovery() {
      const { recovery } = this;
      if (recovery == null)
        throw new Error("invalid recovery id: must be present");
      return recovery;
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    // Unlike the top-level helper below, this method expects a digest that has
    // already been hashed to the curve's message representative.
    recoverPublicKey(messageHash) {
      const { r, s } = this;
      const recovery = this.assertRecovery();
      const radj = recovery === 2 || recovery === 3 ? r + CURVE_ORDER2 : r;
      if (!Fp.isValid(radj))
        throw new Error("invalid recovery id: sig.r+curve.n != R.x");
      const x = Fp.toBytes(radj);
      const R = Point3.fromBytes(concatBytes2(pprefix((recovery & 1) === 0), x));
      const ir = Fn3.inv(radj);
      const h = bits2int_modN(abytes2(messageHash, void 0, "msgHash"));
      const u1 = Fn3.create(-h * ir);
      const u2 = Fn3.create(s * ir);
      const Q = Point3.BASE.mulAddUnsafe(u1, R, u2);
      if (Q.is0())
        throw new Error("invalid recovery: point at infinify");
      Q.assertValidity();
      return Q;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    toBytes(format = defaultSigOpts.format) {
      validateSigFormat(format);
      if (format === "der")
        return hexToBytes2(DER.hexFromSig(this));
      const { r, s } = this;
      const rb = Fn3.toBytes(r);
      const sb = Fn3.toBytes(s);
      if (format === "recovered") {
        assertRecoverableCurve();
        return concatBytes2(Uint8Array.of(this.assertRecovery()), rb, sb);
      }
      return concatBytes2(rb, sb);
    }
    toHex(format) {
      return bytesToHex2(this.toBytes(format));
    }
  }
  Object.freeze(Signature.prototype);
  Object.freeze(Signature);
  const bits2int = opts.bits2int === void 0 ? function bits2int_def(bytes) {
    if (bytes.length > 8192)
      throw new Error("input is too large");
    const num2 = bytesToNumberBE(bytes);
    const delta = bytes.length * 8 - fnBits;
    return delta > 0 ? num2 >> BigInt(delta) : num2;
  } : opts.bits2int;
  const bits2int_modN = opts.bits2int_modN === void 0 ? function bits2int_modN_def(bytes) {
    return Fn3.create(bits2int(bytes));
  } : opts.bits2int_modN;
  const ORDER_MASK = bitMask(fnBits);
  function int2octets(num2) {
    aInRange("num < 2^" + fnBits, num2, _0n5, ORDER_MASK);
    return Fn3.toBytes(num2);
  }
  function validateMsgAndHash(message, prehash) {
    abytes2(message, void 0, "message");
    return prehash ? abytes2(hash_(message), void 0, "prehashed message") : message;
  }
  function prepSig(message, secretKey, opts2) {
    const { lowS, prehash, extraEntropy } = validateSigOpts(opts2, defaultSigOpts);
    message = validateMsgAndHash(message, prehash);
    const h1int = bits2int_modN(message);
    const d = Fn3.fromBytes(secretKey);
    if (!Fn3.isValidNot0(d))
      throw new Error("invalid private key");
    const seedArgs = [int2octets(d), int2octets(h1int)];
    if (extraEntropy != null && extraEntropy !== false) {
      const e = extraEntropy === true ? randomBytes3(lengths.secretKey) : extraEntropy;
      seedArgs.push(abytes2(e, void 0, "extraEntropy"));
    }
    const seed = concatBytes2(...seedArgs);
    const m = h1int;
    function k2sig(kBytes) {
      const k = bits2int(kBytes);
      if (!Fn3.isValidNot0(k))
        return;
      const q = Point3.BASE.multiply(k).toAffine();
      const r = Fn3.create(q.x);
      if (r === _0n5)
        return;
      let s;
      if (csprng !== void 0) {
        const b = bytesToNumberBE(mapHashToField(csprng(blindLength), CURVE_ORDER2));
        const ibk = Fn3.inv(Fn3.mul(b, k));
        const bm = Fn3.mul(b, m);
        const bd = Fn3.mul(b, d);
        s = Fn3.create(ibk * Fn3.create(bm + bd * r));
      } else {
        const ik = invertCt(k, CURVE_ORDER2);
        s = Fn3.create(ik * Fn3.create(m + r * d));
      }
      if (s === _0n5)
        return;
      let recovery = getRecoveryBit(q.x, q.y, r);
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = Fn3.neg(s);
        recovery ^= 1;
      }
      return new Signature(r, normS, hasLargeRecoveryLifts ? void 0 : recovery);
    }
    return { seed, k2sig };
  }
  function sign(message, secretKey, opts2 = {}) {
    const { seed, k2sig } = prepSig(message, secretKey, opts2);
    const drbg = createHmacDrbg(hash_.outputLen, Fn3.BYTES, hmac2);
    const sig = drbg(seed, k2sig);
    return sig.toBytes(opts2.format);
  }
  function verify(signature, message, publicKey, opts2 = {}) {
    const { lowS, prehash, format } = validateSigOpts(opts2, defaultSigOpts);
    publicKey = abytes2(publicKey, void 0, "publicKey");
    message = validateMsgAndHash(message, prehash);
    if (!isBytes2(signature)) {
      const end = signature instanceof Signature ? ", use sig.toBytes()" : "";
      throw new Error("verify expects Uint8Array signature" + end);
    }
    validateSigLength(signature, format);
    try {
      const sig = Signature.fromBytes(signature, format);
      const P = Point3.fromBytes(publicKey);
      if (P.is0())
        return false;
      if (lowS && sig.hasHighS())
        return false;
      const { r, s } = sig;
      const h = bits2int_modN(message);
      const is = Fn3.inv(s);
      const u1 = Fn3.create(h * is);
      const u2 = Fn3.create(r * is);
      const R = Point3.BASE.mulAddUnsafe(u1, P, u2);
      if (R.is0())
        return false;
      const q = R.toAffine();
      const v = Fn3.create(q.x);
      if (v !== r)
        return false;
      if (format === "recovered" && sig.recovery !== getRecoveryBit(q.x, q.y, r))
        return false;
      return true;
    } catch (e) {
      return false;
    }
  }
  function recoverPublicKey(signature, message, opts2 = {}) {
    const { prehash } = validateSigOpts(opts2, defaultSigOpts);
    message = validateMsgAndHash(message, prehash);
    return Signature.fromBytes(signature, "recovered").recoverPublicKey(message).toBytes();
  }
  return Object.freeze({
    keygen,
    getPublicKey,
    getSharedSecret,
    utils: utils2,
    lengths,
    Point: Point3,
    sign,
    verify,
    recoverPublicKey,
    Signature,
    hash: hash_
  });
}

// node_modules/@noble/curves/secp256k1.js
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var secp256k1_CURVE = {
  p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: BigInt(1),
  a: BigInt(0),
  b: BigInt(7),
  Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
  Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
};
var secp256k1_ENDO = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  basises: [
    [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
    [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]
  ]
};
var _0n6 = /* @__PURE__ */ BigInt(0);
var _2n3 = /* @__PURE__ */ BigInt(2);
function sqrtMod(y) {
  const P = secp256k1_CURVE.p;
  const _3n3 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b2 = y * y * y % P;
  const b3 = b2 * b2 * y % P;
  const b6 = pow2(b3, _3n3, P) * b3 % P;
  const b9 = pow2(b6, _3n3, P) * b3 % P;
  const b11 = pow2(b9, _2n3, P) * b2 % P;
  const b22 = pow2(b11, _11n, P) * b11 % P;
  const b44 = pow2(b22, _22n, P) * b22 % P;
  const b88 = pow2(b44, _44n, P) * b44 % P;
  const b176 = pow2(b88, _88n, P) * b88 % P;
  const b220 = pow2(b176, _44n, P) * b44 % P;
  const b223 = pow2(b220, _3n3, P) * b3 % P;
  const t1 = pow2(b223, _23n, P) * b22 % P;
  const t2 = pow2(t1, _6n, P) * b2 % P;
  const root = pow2(t2, _2n3, P);
  if (!Fpk1.eql(Fpk1.sqr(root), y))
    throw new Error("Cannot find square root");
  return root;
}
var Fpk1 = /* @__PURE__ */ Field(secp256k1_CURVE.p, { sqrt: sqrtMod });
var Pointk1 = /* @__PURE__ */ weierstrass(secp256k1_CURVE, {
  Fp: Fpk1,
  endo: secp256k1_ENDO
});
var secp256k1 = /* @__PURE__ */ ecdsa(Pointk1, sha256);
var TAGGED_HASH_PREFIXES = /* @__PURE__ */ Object.create(null);
function taggedHash(tag, ...messages) {
  let tagP = TAGGED_HASH_PREFIXES[tag];
  if (tagP === void 0) {
    const tagH = sha256(asciiToBytes(tag));
    tagP = concatBytes2(tagH, tagH);
    TAGGED_HASH_PREFIXES[tag] = tagP;
  }
  return sha256(concatBytes2(tagP, ...messages));
}
var pointToBytes = (point) => point.toBytes(true).slice(1);
var affineXToBytes = ({ x }) => Fpk1.toBytes(x);
var hasEven = (y) => !Fpk1.isOdd(y);
function schnorrGetExtPubKey(priv) {
  const { Fn: Fn3, BASE } = Pointk1;
  const d_ = Fn3.fromBytes(abytes2(priv, 32, "secretKey"));
  const p = BASE.multiply(d_);
  const affine = p.toAffine();
  const scalar = hasEven(affine.y) ? d_ : Fn3.neg(d_);
  return { scalar, bytes: affineXToBytes(affine) };
}
function lift_x(x) {
  const Fp = Fpk1;
  if (!Fp.isValidNot0(x))
    throw new Error("invalid x: Fail if x \u2265 p");
  const xx = Fp.sqr(x);
  const c = Fp.add(Fp.mulN(xx, x), BigInt(7));
  let y = Fp.sqrt(c);
  if (!hasEven(y))
    y = Fp.neg(y);
  const p = Pointk1.fromAffine({ x, y });
  p.assertValidity();
  return p;
}
var num = bytesToNumberBE;
function challenge(...args) {
  return Pointk1.Fn.create(num(taggedHash("BIP0340/challenge", ...args)));
}
function schnorrGetPublicKey(secretKey) {
  return schnorrGetExtPubKey(secretKey).bytes;
}
function schnorrSign(message, secretKey, auxRand = randomBytes(32)) {
  const { Fn: Fn3, BASE } = Pointk1;
  const m = copyBytes(abytes2(message, void 0, "message"));
  const { bytes: px, scalar: d } = schnorrGetExtPubKey(secretKey);
  const a = abytes2(auxRand, 32, "auxRand");
  const t = Fn3.toBytes(d ^ num(taggedHash("BIP0340/aux", a)));
  const rand = taggedHash("BIP0340/nonce", t, px, m);
  const k_ = Fn3.create(num(rand));
  if (k_ === _0n6)
    throw new Error("sign failed: k is zero");
  const p = BASE.multiply(k_);
  const affine = p.toAffine();
  const k = hasEven(affine.y) ? k_ : Fn3.neg(k_);
  const rx = affineXToBytes(affine);
  const e = challenge(rx, px, m);
  const sig = new Uint8Array(64);
  sig.set(rx, 0);
  sig.set(Fn3.toBytes(Fn3.create(k + e * d)), 32);
  if (!schnorrVerify(sig, m, px))
    throw new Error("sign: Invalid signature produced");
  return sig;
}
function schnorrVerify(signature, message, publicKey) {
  const { Fp, Fn: Fn3, BASE } = Pointk1;
  const sig = abytes2(signature, 64, "signature");
  const m = abytes2(message, void 0, "message");
  const pub = abytes2(publicKey, 32, "publicKey");
  try {
    const P = lift_x(num(pub));
    const rBytes = sig.subarray(0, 32);
    const r = num(rBytes);
    if (!Fp.isValidNot0(r))
      return false;
    const s = num(sig.subarray(32, 64));
    if (!Fn3.isValidNot0(s))
      return false;
    const e = challenge(rBytes, pointToBytes(P), m);
    const R = BASE.mulAddUnsafe(s, P, Fn3.neg(e));
    const { x, y } = R.toAffine();
    if (R.is0() || !hasEven(y) || !Fp.eql(x, r))
      return false;
    return true;
  } catch (error) {
    return false;
  }
}
var schnorr = /* @__PURE__ */ (() => {
  const size = 32;
  const seedLength = 48;
  const randomSecretKey = (seed) => {
    seed = seed === void 0 ? randomBytes(seedLength) : seed;
    return mapHashToField(abytes2(seed, seedLength, "seed"), secp256k1_CURVE.n);
  };
  return Object.freeze({
    keygen: createKeygen(randomSecretKey, schnorrGetPublicKey),
    getPublicKey: schnorrGetPublicKey,
    sign: schnorrSign,
    verify: schnorrVerify,
    Point: Pointk1,
    utils: Object.freeze({
      randomSecretKey,
      taggedHash,
      lift_x,
      pointToBytes
    }),
    lengths: Object.freeze({
      secretKey: size,
      publicKey: size,
      publicKeyHasPrefix: false,
      signature: size * 2,
      seed: seedLength
    })
  });
})();

// node_modules/@noble/hashes/legacy.js
var Rho160 = /* @__PURE__ */ Uint8Array.from([
  7,
  4,
  13,
  1,
  10,
  6,
  15,
  3,
  12,
  0,
  9,
  5,
  2,
  14,
  11,
  8
]);
var Id160 = /* @__PURE__ */ (() => Uint8Array.from(new Array(16).fill(0).map((_, i) => i)))();
var Pi160 = /* @__PURE__ */ (() => Id160.map((i) => (9 * i + 5) % 16))();
var idxLR = /* @__PURE__ */ (() => {
  const L = [Id160];
  const R = [Pi160];
  const res = [L, R];
  for (let i = 0; i < 4; i++)
    for (let j of res)
      j.push(j[i].map((k) => Rho160[k]));
  return res;
})();
var idxL = /* @__PURE__ */ (() => idxLR[0])();
var idxR = /* @__PURE__ */ (() => idxLR[1])();
var shifts160 = /* @__PURE__ */ [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((i) => Uint8Array.from(i));
var shiftsL160 = /* @__PURE__ */ idxL.map((idx, i) => idx.map((j) => shifts160[i][j]));
var shiftsR160 = /* @__PURE__ */ idxR.map((idx, i) => idx.map((j) => shifts160[i][j]));
var Kl160 = /* @__PURE__ */ Uint32Array.from([
  0,
  1518500249,
  1859775393,
  2400959708,
  2840853838
]);
var Kr160 = /* @__PURE__ */ Uint32Array.from([
  1352829926,
  1548603684,
  1836072691,
  2053994217,
  0
]);
function ripemd_f(group, x, y, z) {
  if (group === 0)
    return x ^ y ^ z;
  if (group === 1)
    return x & y | ~x & z;
  if (group === 2)
    return (x | ~y) ^ z;
  if (group === 3)
    return x & z | y & ~z;
  return x ^ (y | ~z);
}
var BUF_160 = /* @__PURE__ */ new Uint32Array(16);
var _RIPEMD160 = class extends HashMD {
  h0 = 1732584193 | 0;
  h1 = 4023233417 | 0;
  h2 = 2562383102 | 0;
  h3 = 271733878 | 0;
  h4 = 3285377520 | 0;
  constructor() {
    super(64, 20, 8, true);
  }
  get() {
    const { h0, h1, h2, h3, h4 } = this;
    return [h0, h1, h2, h3, h4];
  }
  set(h0, h1, h2, h3, h4) {
    this.h0 = h0 | 0;
    this.h1 = h1 | 0;
    this.h2 = h2 | 0;
    this.h3 = h3 | 0;
    this.h4 = h4 | 0;
  }
  _cloneInto(to) {
    (to ||= new this.constructor()).set(...this.get());
    return this._cloneIntoMeta(to);
  }
  process(view2, offset) {
    for (let i = 0; i < 16; i++, offset += 4)
      BUF_160[i] = view2.getUint32(offset, true);
    let al = this.h0 | 0, ar = al, bl = this.h1 | 0, br = bl, cl = this.h2 | 0, cr = cl, dl = this.h3 | 0, dr = dl, el = this.h4 | 0, er = el;
    for (let group = 0; group < 5; group++) {
      const rGroup = 4 - group;
      const hbl = Kl160[group], hbr = Kr160[group];
      const rl = idxL[group], rr = idxR[group];
      const sl = shiftsL160[group], sr = shiftsR160[group];
      for (let i = 0; i < 16; i++) {
        const tl = rotl(al + ripemd_f(group, bl, cl, dl) + BUF_160[rl[i]] + hbl, sl[i]) + el | 0;
        al = el, el = dl, dl = rotl(cl, 10) | 0, cl = bl, bl = tl;
      }
      for (let i = 0; i < 16; i++) {
        const tr = rotl(ar + ripemd_f(rGroup, br, cr, dr) + BUF_160[rr[i]] + hbr, sr[i]) + er | 0;
        ar = er, er = dr, dr = rotl(cr, 10) | 0, cr = br, br = tr;
      }
    }
    this.set(this.h1 + cl + dr | 0, this.h2 + dl + er | 0, this.h3 + el + ar | 0, this.h4 + al + br | 0, this.h0 + bl + cr | 0);
  }
  roundClean() {
    clean(BUF_160);
  }
  destroy() {
    this.destroyed = true;
    clean(this.buffer);
    this.set(0, 0, 0, 0, 0);
  }
};
var ripemd160 = /* @__PURE__ */ createHasher(() => new _RIPEMD160());

// node_modules/@scure/base/index.js
/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var freeze = (fn) => Object.freeze(fn());
function isBytes3(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
function abytes3(b) {
  if (!isBytes3(b))
    throw new TypeError("Uint8Array expected");
}
function isArrayOf(isString, arr) {
  if (!Array.isArray(arr))
    return false;
  if (arr.length === 0)
    return true;
  if (isString) {
    return arr.every((item) => typeof item === "string");
  } else {
    return arr.every((item) => Number.isSafeInteger(item));
  }
}
function afn(input) {
  if (typeof input !== "function")
    throw new TypeError("function expected");
  return true;
}
function astr(label, input) {
  if (typeof input !== "string")
    throw new TypeError(`${label}: string expected`);
  return true;
}
function anumber3(n, title = "number") {
  if (typeof n !== "number")
    throw new TypeError(`${title}: expected number, got ${typeof n}`);
  if (!Number.isSafeInteger(n))
    throw new RangeError(`${title}: expected safe integer, got ${n}`);
}
function anumArr(label, input) {
  if (!isArrayOf(false, input))
    throw new TypeError(`${label}: array of numbers expected`);
}
function chain(...args) {
  const id = (a) => a;
  const wrap2 = (a, b) => (c) => a(b(c));
  const encode = args.map((x) => x.encode).reduceRight(wrap2, id);
  const decode = args.map((x) => x.decode).reduce(wrap2, id);
  return { encode, decode };
}
function normalize(fn) {
  afn(fn);
  return { encode: (from) => from, decode: (to) => fn(to) };
}
var powers = /* @__PURE__ */ (() => {
  let res = [];
  for (let i = 0; i < 40; i++)
    res.push(2 ** i);
  return res;
})();
function u8ToNumArr(u8, len = u8.length) {
  const res = new Array(len);
  for (let i = 0; i < len; i++)
    res[i] = u8[i];
  return res;
}
var asciiDecoder = /* @__PURE__ */ (() => {
  try {
    const decoder = new TextDecoder();
    return decoder.decode(Uint8Array.of(65, 48, 43, 127)) === "A0+\x7F" ? decoder : void 0;
  } catch (e) {
    return void 0;
  }
})();
var B2S_CHUNK = 8192;
function charcodesToString(codes) {
  const len = codes.length;
  if (asciiDecoder !== void 0 && len >= 12)
    return asciiDecoder.decode(codes);
  if (len <= B2S_CHUNK)
    return String.fromCharCode.apply(null, codes);
  let res = "";
  for (let i = 0; i < len; i += B2S_CHUNK)
    res += String.fromCharCode.apply(null, codes.subarray(i, i + B2S_CHUNK));
  return res;
}
function radix2(bits) {
  anumber3(bits);
  if (bits <= 0 || bits > 8)
    throw new RangeError("radix2: bits should be in (0..8]");
  const mask = powers[bits] - 1;
  return {
    encode: (bytes) => {
      abytes3(bytes);
      const len = bytes.length;
      const res = new Uint8Array(Math.ceil(len * 8 / bits));
      let carry = 0;
      let pos = 0;
      let j = 0;
      for (let i = 0; i < len; ) {
        if (i + 2 < len) {
          carry = carry << 24 | bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
          pos += 24;
          i += 3;
        } else {
          carry = (carry << 8 | bytes[i]) & 65535;
          pos += 8;
          i++;
        }
        for (; ; ) {
          pos -= bits;
          res[j++] = carry >> pos & mask;
          if (pos < bits)
            break;
        }
      }
      if (pos > 0)
        res[j] = carry << bits - pos & mask;
      return res;
    },
    decode: (digits) => {
      const len = digits.length;
      const res = new Uint8Array(Math.floor(len * bits / 8));
      let carry = 0;
      let pos = 0;
      let j = 0;
      for (let i = 0; i < len; i++) {
        carry = (carry << bits | digits[i]) & 65535;
        pos += bits;
        for (; pos >= 8; pos -= 8)
          res[j++] = carry >> pos - 8 & 255;
      }
      carry = carry << 8 - pos & 255;
      if (pos >= bits)
        throw new Error("Excess padding");
      if (carry > 0)
        throw new Error(`Non-zero padding: ${carry}`);
      return res;
    }
  };
}
function alphabet(letters, aliases) {
  const len = letters.length;
  if (len > 128)
    throw new Error("alphabet: max 128 letters");
  const encTable = new Uint8Array(len);
  const decTable = new Int8Array(128).fill(-1);
  for (let i = 0; i < len; i++) {
    const code = letters.charCodeAt(i);
    if (letters.codePointAt(i) !== code || code > 127)
      throw new Error("alphabet: single-char ASCII letters only");
    encTable[i] = code;
    decTable[code] = i;
  }
  if (aliases !== void 0) {
    for (const alias of Object.keys(aliases)) {
      const code = alias.charCodeAt(0);
      const target = decTable[aliases[alias].charCodeAt(0)];
      if (alias.length !== 1 || code > 127 || target === void 0 || target === -1)
        throw new Error(`alphabet: invalid alias ${alias}`);
      decTable[code] = target;
    }
  }
  return {
    encode: (digits) => {
      const codes = new Uint8Array(digits.length);
      for (let i = 0; i < digits.length; i++) {
        const d = digits[i];
        const code = encTable[d];
        if (code === void 0)
          throw new Error(`alphabet.encode: invalid digit ${d}`);
        codes[i] = code;
      }
      return charcodesToString(codes);
    },
    decode: (input) => {
      astr("decode", input);
      const slen = input.length;
      const digits = new Uint8Array(slen);
      for (let i = 0; i < slen; i++) {
        const code = input.charCodeAt(i);
        const digit = code < 128 ? decTable[code] : -1;
        if (digit === -1)
          throw new Error(`Unknown letter "${input[i]}". Allowed: ${letters}`);
        digits[i] = digit;
      }
      return digits;
    }
  };
}
function padding(bits, chr = "=") {
  anumber3(bits);
  astr("padding", chr);
  return {
    encode(data) {
      while (data.length * bits % 8)
        data += chr;
      return data;
    },
    decode(input) {
      astr("decode", input);
      let end = input.length;
      if (end * bits % 8)
        throw new Error("padding: invalid length");
      for (; end > 0 && input[end - 1] === chr; end--) {
        const byte = (end - 1) * bits;
        if (byte % 8 === 0)
          throw new Error("padding: excess padding");
      }
      return input.slice(0, end);
    }
  };
}
function unsafeWrapper(fn) {
  afn(fn);
  return function(...args) {
    try {
      return fn.apply(null, args);
    } catch (e) {
    }
  };
}
function checksum(len, fn) {
  anumber3(len);
  if (len <= 0)
    throw new RangeError(`checksum length must be positive: ${len}`);
  afn(fn);
  const _fn = fn;
  return {
    encode(data) {
      abytes3(data);
      const sum = _fn(data).slice(0, len);
      const res = new Uint8Array(data.length + len);
      res.set(data);
      res.set(sum, data.length);
      return res;
    },
    decode(data) {
      abytes3(data);
      const payload = data.slice(0, -len);
      const oldChecksum = data.slice(-len);
      const newChecksum = _fn(payload).slice(0, len);
      for (let i = 0; i < len; i++)
        if (newChecksum[i] !== oldChecksum[i])
          throw new Error("Invalid checksum");
      return payload;
    }
  };
}
var hasBase64Builtin = /* @__PURE__ */ (() => typeof Uint8Array.from([]).toBase64 === "function" && typeof Uint8Array.fromBase64 === "function")();
var ASCII_WHITESPACE = /[\t\n\f\r ]/;
var decodeBase64Builtin = (s, isUrl) => {
  astr("base64", s);
  const alphabet2 = isUrl ? "base64url" : "base64";
  if (s.length > 0 && ASCII_WHITESPACE.test(s))
    throw new Error("invalid base64");
  return Uint8Array.fromBase64(s, { alphabet: alphabet2, lastChunkHandling: "strict" });
};
var base64Fallback = /* @__PURE__ */ freeze(() => chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), padding(6)));
var base64 = /* @__PURE__ */ freeze(() => hasBase64Builtin ? {
  encode(b) {
    abytes3(b);
    return b.toBase64();
  },
  decode(s) {
    return decodeBase64Builtin(s, false);
  }
} : base64Fallback);
var B58_GROUP = 656356768;
var RADIX_BASE_N_MAX_LENGTH = 65536;
var BASE_N_MAX_BYTES = 2048;
var BASE_N_MAX_CHARS = 4096;
var radixBaseN = (BASE, GROUP) => ({
  encode: (bytes) => {
    abytes3(bytes);
    const blen = bytes.length;
    if (blen === 0)
      return new Uint8Array(0);
    if (blen >= RADIX_BASE_N_MAX_LENGTH)
      throw new Error("invalid length");
    let zeros = 0;
    while (zeros < blen - 1 && bytes[zeros] === 0)
      zeros++;
    const nlimbs = Math.ceil(blen / 2);
    const limbs = new Uint16Array(nlimbs);
    const odd = blen & 1;
    if (odd)
      limbs[0] = bytes[0];
    for (let i = odd, j2 = odd; i < blen; i += 2, j2++)
      limbs[j2] = bytes[i] << 8 | bytes[i + 1];
    const groups = [];
    let pos = 0;
    while (pos < nlimbs) {
      let carry = 0;
      for (let i = pos; i < nlimbs; i++) {
        const cur = carry * 65536 + limbs[i];
        const q = Math.floor(cur / GROUP);
        carry = cur - q * GROUP;
        limbs[i] = q;
        if (q === 0 && i === pos)
          pos++;
      }
      groups.push(carry);
    }
    const top = groups.length - 1;
    let sig = top * 5;
    for (let v = groups[top]; ; v = Math.floor(v / BASE)) {
      sig++;
      if (v < BASE)
        break;
    }
    const res = new Uint8Array(zeros + sig);
    let j = res.length - 1;
    for (let g = 0; g < top; g++) {
      let v = groups[g];
      for (let k = 0; k < 5; k++) {
        res[j--] = v % BASE;
        v = Math.floor(v / BASE);
      }
    }
    for (let v = groups[top]; j >= zeros; v = Math.floor(v / BASE))
      res[j--] = v % BASE;
    return res;
  },
  decode: (digits) => {
    abytes3(digits);
    const dlen = digits.length;
    if (dlen === 0)
      return new Uint8Array(0);
    if (dlen >= RADIX_BASE_N_MAX_LENGTH)
      throw new Error("invalid length");
    let zeros = 0;
    while (zeros < dlen - 1 && digits[zeros] === 0)
      zeros++;
    const limbs = new Uint16Array(Math.ceil(dlen * 6 / 16) + 1);
    let used = 0;
    let i = 0;
    let group = dlen % 5 || 5;
    while (i < dlen) {
      let gval = 0;
      let factor = 1;
      for (const end = i + group; i < end; i++) {
        const d = digits[i];
        if (d >= BASE)
          throw new Error(`invalid integer: ${d}`);
        gval = gval * BASE + d;
        factor *= BASE;
      }
      group = 5;
      let carry = gval;
      for (let k = 0; k < used; k++) {
        const cur = limbs[k] * factor + carry;
        carry = Math.floor(cur / 65536);
        limbs[k] = cur - carry * 65536;
      }
      for (; carry > 0; carry = Math.floor(carry / 65536))
        limbs[used++] = carry % 65536;
    }
    const valueBytes = used === 0 ? 1 : used * 2 - (limbs[used - 1] < 256 ? 1 : 0);
    const res = new Uint8Array(zeros + valueBytes);
    let j = res.length - 1;
    for (let k = 0; k < used; k++) {
      const limb = limbs[k];
      res[j--] = limb & 255;
      if (j >= zeros)
        res[j--] = limb >> 8;
    }
    return res;
  }
});
var genBaseN = (radix, abc) => {
  const letters = alphabet(abc);
  return {
    encode(bytes) {
      abytes3(bytes);
      if (bytes.length > BASE_N_MAX_BYTES)
        throw new Error("invalid length");
      return letters.encode(radix.encode(bytes));
    },
    decode(str) {
      astr("baseN.decode", str);
      if (str.length > BASE_N_MAX_CHARS)
        throw new Error("invalid length");
      return radix.decode(letters.decode(str));
    }
  };
};
var radix58 = /* @__PURE__ */ radixBaseN(58, B58_GROUP);
var genBase58 = (abc) => genBaseN(radix58, abc);
var base58 = /* @__PURE__ */ freeze(() => genBase58("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"));
var createBase58check = (sha2563) => {
  afn(sha2563);
  const _sha256 = sha2563;
  return chain(checksum(4, (data) => _sha256(_sha256(data))), base58);
};
var BECH_ALPHABET = /* @__PURE__ */ alphabet("qpzry9x8gf2tvdw0s3jn54khce6mua7l");
var BECH_UPPERCASE_PRINTABLE = /^[\x21-\x60\x7b-\x7e]+$/;
function assertBech32Printable(label, value) {
  for (let i = 0; i < value.length; i++) {
    const c = value.charCodeAt(i);
    if (c < 33 || c > 126)
      throw new Error(`${label}: printable ASCII expected`);
  }
}
function wordsToU8(words) {
  const len = words.length;
  const res = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    const w = words[i];
    if (w < 0 || w >= 32)
      throw new Error(`alphabet.encode: invalid digit ${w}`);
    res[i] = w;
  }
  return res;
}
var POLYMOD_GENERATORS = [996825010, 642813549, 513874426, 1027748829, 705979059];
function bech32Polymod(pre) {
  const b = pre >> 25;
  let chk = (pre & 33554431) << 5;
  for (let i = 0; i < POLYMOD_GENERATORS.length; i++) {
    if ((b >> i & 1) === 1)
      chk ^= POLYMOD_GENERATORS[i];
  }
  return chk;
}
function bechChecksum(prefix2, words, encodingConst = 1) {
  const len = prefix2.length;
  let chk = 1;
  for (let i = 0; i < len; i++) {
    const c = prefix2.charCodeAt(i);
    if (c < 33 || c > 126)
      throw new Error(`Invalid prefix (${prefix2})`);
    chk = bech32Polymod(chk) ^ c >> 5;
  }
  chk = bech32Polymod(chk);
  for (let i = 0; i < len; i++)
    chk = bech32Polymod(chk) ^ prefix2.charCodeAt(i) & 31;
  for (let v of words)
    chk = bech32Polymod(chk) ^ v;
  for (let i = 0; i < 6; i++)
    chk = bech32Polymod(chk);
  chk ^= encodingConst;
  const sum = new Uint8Array(6);
  for (let i = 0; i < 6; i++)
    sum[i] = chk >>> 5 * (5 - i) & 31;
  return BECH_ALPHABET.encode(sum);
}
function genBech32(encoding) {
  const ENCODING_CONST = encoding === "bech32" ? 1 : 734539939;
  const _words = radix2(5);
  const toWords = (from) => {
    abytes3(from);
    const len = from.length;
    const res = new Array(Math.ceil(len * 8 / 5));
    let carry = 0;
    let pos = 0;
    let j = 0;
    for (let i = 0; i < len; i++) {
      carry = carry << 8 | from[i];
      pos += 8;
      for (; pos >= 5; pos -= 5)
        res[j++] = carry >> pos - 5 & 31;
    }
    if (pos > 0)
      res[j] = carry << 5 - pos & 31;
    return res;
  };
  const fromWords = (to) => {
    anumArr("radix2.decode", to);
    const len = to.length;
    const digits = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      const w = to[i];
      if (w < 0 || w >= 32)
        throw new Error(`convertRadix2: invalid word=${w}`);
      digits[i] = w;
    }
    return _words.decode(digits);
  };
  const fromWordsUnsafe = unsafeWrapper(fromWords);
  function encode(prefix2, words, limit = 90) {
    astr("bech32.encode prefix", prefix2);
    if (limit !== false)
      anumber3(limit, "limit");
    if (isBytes3(words))
      words = u8ToNumArr(words);
    anumArr("bech32.encode", words);
    const plen = prefix2.length;
    if (plen === 0)
      throw new TypeError(`Invalid prefix length ${plen}`);
    const actualLength = plen + 7 + words.length;
    if (limit !== false && actualLength > limit)
      throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
    assertBech32Printable("bech32.encode prefix", prefix2);
    const lowered = prefix2.toLowerCase();
    const sum = bechChecksum(lowered, words, ENCODING_CONST);
    return `${lowered}1${BECH_ALPHABET.encode(wordsToU8(words))}${sum}`;
  }
  function decode(str, limit = 90) {
    astr("bech32.decode input", str);
    if (limit !== false)
      anumber3(limit, "limit");
    const slen = str.length;
    if (slen < 8 || limit !== false && slen > limit)
      throw new TypeError(`invalid string length ${slen}, expected (8..${limit})`);
    const lowered = str.toLowerCase();
    if (str !== lowered) {
      if (!BECH_UPPERCASE_PRINTABLE.test(str)) {
        assertBech32Printable("bech32.decode input", str);
        throw new Error(`mixed-case string not allowed`);
      }
    }
    const sepIndex = lowered.lastIndexOf("1");
    if (sepIndex === 0 || sepIndex === -1)
      throw new Error(`invalid separator "1"`);
    const prefix2 = lowered.slice(0, sepIndex);
    const data = lowered.slice(sepIndex + 1);
    if (data.length < 6)
      throw new Error("invalid data length");
    const digits = BECH_ALPHABET.decode(data);
    const words = u8ToNumArr(digits, digits.length - 6);
    const sum = bechChecksum(prefix2, words, ENCODING_CONST);
    if (!data.endsWith(sum))
      throw new Error(`Invalid checksum in ${str}`);
    return { prefix: prefix2, words };
  }
  const decodeUnsafe = unsafeWrapper(decode);
  function decodeToBytes(str, limit = 90) {
    const { prefix: prefix2, words } = decode(str, limit);
    return {
      prefix: prefix2,
      words,
      bytes: fromWords(words)
    };
  }
  function encodeFromBytes(prefix2, bytes) {
    return encode(prefix2, toWords(bytes));
  }
  return {
    encode,
    decode,
    encodeFromBytes,
    decodeToBytes,
    decodeUnsafe,
    fromWords,
    fromWordsUnsafe,
    toWords
  };
}
var bech32 = /* @__PURE__ */ freeze(() => genBech32("bech32"));
var bech32m = /* @__PURE__ */ freeze(() => genBech32("bech32m"));
var _isWellFormedShim = (str) => {
  try {
    return encodeURI(str) !== null;
  } catch {
    return false;
  }
};
var _isWellFormed = /* @__PURE__ */ (() => (
  // Pick the native check once so utf8.decode doesn't re-probe String.prototype on every call.
  typeof "".isWellFormed === "function" ? (str) => str.isWellFormed() : _isWellFormedShim
))();
var utf8err = (i) => new TypeError(`invalid utf8 at byte ${i}`);
var utf8Fallback = /* @__PURE__ */ freeze(() => ({
  encode(data) {
    abytes3(data);
    let res = "";
    for (let i = 0; i < data.length; ) {
      const a = data[i++];
      if (a < 128) {
        res += String.fromCharCode(a);
        continue;
      }
      if (a < 194 || i >= data.length)
        throw utf8err(i - 1);
      const b = data[i++];
      if ((b & 192) !== 128)
        throw utf8err(i - 1);
      let cp = (a & 31) << 6 | b & 63;
      if (a >= 224) {
        if (i >= data.length)
          throw utf8err(i - 1);
        const c = data[i++];
        if ((c & 192) !== 128 || a === 224 && b < 160 || a === 237 && b >= 160)
          throw utf8err(i - 1);
        cp = (a & 15) << 12 | (b & 63) << 6 | c & 63;
        if (a >= 240) {
          if (i >= data.length)
            throw utf8err(i - 1);
          const d = data[i++];
          if (a > 244 || (d & 192) !== 128 || a === 240 && b < 144 || a === 244 && b >= 144)
            throw utf8err(i - 1);
          cp = (a & 7) << 18 | (b & 63) << 12 | (c & 63) << 6 | d & 63;
        }
      }
      if (cp < 65536)
        res += String.fromCharCode(cp);
      else {
        cp -= 65536;
        res += String.fromCharCode((cp >> 10) + 55296, (cp & 1023) + 56320);
      }
    }
    return res;
  },
  decode(str) {
    astr("utf8", str);
    if (!_isWellFormed(str))
      throw new TypeError("utf8 expected well-formed string");
    const res = new Uint8Array(str.length * 3);
    let pos = 0;
    for (let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);
      if (c < 128) {
        res[pos++] = c;
        continue;
      }
      if (c >= 55296 && c <= 57343) {
        const d = str.charCodeAt(++i);
        c = 65536 + (c - 55296 << 10) + d - 56320;
      }
      if (c >= 65536) {
        res[pos++] = c >> 18 | 240;
        res[pos++] = c >> 12 & 63 | 128;
      } else if (c >= 2048)
        res[pos++] = c >> 12 | 224;
      else
        res[pos++] = c >> 6 | 192;
      if (c >= 2048)
        res[pos++] = c >> 6 & 63 | 128;
      res[pos++] = c & 63 | 128;
    }
    return res.subarray(0, pos);
  }
}));
var utf8 = /* @__PURE__ */ freeze(() => {
  let _utf8Encoder;
  let _utf8Decoder;
  const utf8Builtin = {
    // ignoreBOM preserves an explicit leading U+FEFF;
    // fatal rejects invalid UTF-8 bytes instead of replacing them.
    encode(data) {
      abytes3(data);
      return (_utf8Decoder || (_utf8Decoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }))).decode(data);
    },
    decode(str) {
      astr("utf8", str);
      if (!_isWellFormed(str))
        throw new TypeError("utf8 expected well-formed string");
      return (_utf8Encoder || (_utf8Encoder = new TextEncoder())).encode(str);
    }
  };
  return {
    // Select each direction once at module init, since
    // TextEncoder and TextDecoder can exist independently.
    encode: typeof TextDecoder === "function" ? utf8Builtin.encode : utf8Fallback.encode,
    decode: typeof TextEncoder === "function" ? utf8Builtin.decode : utf8Fallback.decode
  };
});
var hexFallback = /* @__PURE__ */ freeze(() => chain(
  radix2(4),
  // Case-insensitive decode via table aliases instead of a toLowerCase pass.
  alphabet("0123456789abcdef", { A: "a", B: "b", C: "c", D: "d", E: "e", F: "f" }),
  normalize((s) => {
    astr("hex", s);
    if (s.length % 2 !== 0)
      throw new TypeError(`hex.decode: odd-length string (${s.length})`);
    return s;
  })
));
var hasHexBuiltin2 = /* @__PURE__ */ (() => (
  // Require both directions before enabling the native hex path so encode/decode stay symmetric.
  typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
))();
var hexBuiltin = {
  // Keep local type guards so the native path preserves library-level input errors.
  // Native toHex emits lowercase hex, matching the fallback alphabet and Node's hex strings.
  encode(data) {
    abytes3(data);
    return data.toHex();
  },
  // Native fromHex accepts either hex case and rejects odd-length / non-hex syntax.
  decode(s) {
    astr("hex", s);
    return Uint8Array.fromHex(s);
  }
};
var hex = /* @__PURE__ */ freeze(() => hasHexBuiltin2 ? hexBuiltin : hexFallback);

// node_modules/micro-packed/index.js
var EMPTY = /* @__PURE__ */ Uint8Array.of();
var NULL = /* @__PURE__ */ Uint8Array.of(0);
var restrictedKeys = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
var validateFieldName = (name, label) => {
  if (typeof name !== "string")
    throw new Error(`${label} should be string, got ${typeof name}`);
  if (name.includes(".."))
    throw new TypeError(`${label} ${name} cannot contain path parent ..`);
  if (name.includes("/"))
    throw new TypeError(`${label} ${name} cannot contain path separator /`);
  if (restrictedKeys.has(name))
    throw new Error(`${label} ${name} is reserved`);
};
function equalBytes(a, b) {
  if (a.length !== b.length)
    return false;
  for (let i = 0; i < a.length; i++)
    if (a[i] !== b[i])
      return false;
  return true;
}
function createFindBytes(needle) {
  if (needle.length === 1) {
    const byte = needle[0];
    return (data, pos = 0) => {
      const idx = data.indexOf(byte, pos);
      return idx === -1 ? void 0 : idx;
    };
  }
  const back = new Uint32Array(needle.length);
  for (let i = 1, j = 0; i < needle.length; i++) {
    while (j && needle[i] !== needle[j])
      j = back[j - 1];
    if (needle[i] === needle[j])
      back[i] = ++j;
  }
  return (data, pos = 0) => {
    for (let i = pos, j = 0; i < data.length; i++) {
      while (j && data[i] !== needle[j])
        j = back[j - 1];
      if (data[i] !== needle[j])
        continue;
      if (++j === needle.length)
        return i - needle.length + 1;
    }
    return void 0;
  };
}
var findBytes = (needle, data, pos = 0) => createFindBytes(needle)(data, pos);
function equal(a, b) {
  const aBytes = isBytes4(a);
  const bBytes = isBytes4(b);
  if (aBytes || bBytes)
    return aBytes && bBytes && equalBytes(a, b);
  return a === b;
}
function isBytes4(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
function concatBytes3(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    if (!isBytes4(a))
      throw new Error("Uint8Array expected");
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
var createView2 = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
var _0n7 = /* @__PURE__ */ BigInt(0);
var _1n5 = /* @__PURE__ */ BigInt(1);
var _2n4 = /* @__PURE__ */ BigInt(2);
var _8n2 = /* @__PURE__ */ BigInt(8);
var _10n = /* @__PURE__ */ BigInt(10);
var _255n = /* @__PURE__ */ BigInt(255);
function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
function isNum(num2) {
  return Number.isSafeInteger(num2);
}
var hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
var utils = /* @__PURE__ */ Object.freeze({
  equalBytes,
  isBytes: isBytes4,
  isCoder,
  checkBounds,
  concatBytes: concatBytes3,
  createView: createView2,
  isPlainObject
});
var lengthCoder = (len) => {
  if (len !== null && typeof len !== "string" && !isCoder(len) && !isBytes4(len) && !isNum(len)) {
    throw new TypeError(`lengthCoder: expected null | number | Uint8Array | CoderType, got ${len} (${typeof len})`);
  }
  if (typeof len === "number" && len < 0)
    throw new Error(`lengthCoder: wrong length=${len}`);
  if (isBytes4(len) && !len.length)
    throw new Error("lengthCoder: empty terminator");
  return {
    encodeStream(w, value) {
      if (len === null)
        return;
      if (isCoder(len))
        return len.encodeStream(w, value);
      let byteLen;
      if (typeof len === "number")
        byteLen = len;
      else if (typeof len === "string")
        byteLen = Path.resolve(w.stack, len);
      if (typeof byteLen === "bigint")
        byteLen = Number(byteLen);
      if (!isNum(byteLen) || byteLen < 0 || byteLen !== value)
        throw w.err(`Wrong length: ${byteLen} len=${len} exp=${value} (${typeof value})`);
    },
    decodeStream(r) {
      let byteLen;
      if (isCoder(len))
        byteLen = len.decodeStream(r);
      else if (typeof len === "number")
        byteLen = len;
      else if (typeof len === "string")
        byteLen = Path.resolve(r.stack, len);
      if (typeof byteLen === "bigint")
        byteLen = Number(byteLen);
      else if (typeof byteLen !== "number")
        throw r.err(`Wrong length: ${byteLen}`);
      if (!isNum(byteLen) || byteLen < 0)
        throw r.err(`Wrong length: ${byteLen}`);
      return byteLen;
    }
  };
};
var Bitset = /* @__PURE__ */ Object.freeze({
  BITS: 32,
  FULL_MASK: -1 >>> 0,
  // 1<<32 will overflow
  len: (len) => {
    if (!isNum(len) || len < 0)
      throw new Error(`wrong len=${len}`);
    return Math.ceil(len / 32);
  },
  create: (len) => new Uint32Array(Bitset.len(len)),
  clean: (bs) => bs.fill(0),
  debug: (bs) => Array.from(bs).map((i) => (i >>> 0).toString(2).padStart(32, "0")),
  checkLen: (bs, len) => {
    if (Bitset.len(len) === bs.length)
      return;
    throw new Error(`wrong length=${bs.length}. Expected: ${Bitset.len(len)}`);
  },
  chunkLen: (bsLen, pos, len) => {
    if (!isNum(bsLen) || bsLen < 0)
      throw new Error(`wrong bsLen=${bsLen}`);
    if (!isNum(pos) || pos < 0)
      throw new Error(`wrong pos=${pos}`);
    if (!isNum(len) || len < 0)
      throw new Error(`wrong len=${len}`);
    if (pos > bsLen - len)
      throw new Error(`wrong range=${pos}/${len} of ${bsLen}`);
  },
  set: (bs, chunk, value, allowRewrite = true) => {
    if (!isNum(chunk) || chunk < 0 || chunk >= bs.length)
      return false;
    if (!allowRewrite && (bs[chunk] & value) !== 0)
      return false;
    bs[chunk] |= value;
    return true;
  },
  pos: (pos, i) => ({
    chunk: Math.floor((pos + i) / 32),
    mask: 1 << 32 - (pos + i) % 32 - 1
  }),
  indices: (bs, len, invert2 = false) => {
    Bitset.checkLen(bs, len);
    const { FULL_MASK, BITS } = Bitset;
    const left = BITS - len % BITS;
    const lastMask = left ? FULL_MASK >>> left << left : FULL_MASK;
    const res = [];
    for (let i = 0; i < bs.length; i++) {
      let c = bs[i];
      if (invert2)
        c = ~c;
      if (i === bs.length - 1)
        c &= lastMask;
      if (c === 0)
        continue;
      for (let j = 0; j < BITS; j++) {
        const m = 1 << BITS - j - 1;
        if (c & m)
          res.push(i * BITS + j);
      }
    }
    return res;
  },
  range: (arr) => {
    const res = [];
    let cur;
    for (const i of arr) {
      if (cur === void 0 || i !== cur.pos + cur.length)
        res.push(cur = { pos: i, length: 1 });
      else
        cur.length += 1;
    }
    return res;
  },
  rangeDebug: (bs, len, invert2 = false) => `[${Bitset.range(Bitset.indices(bs, len, invert2)).map((i) => `(${i.pos}/${i.length})`).join(", ")}]`,
  setRange: (bs, bsLen, pos, len, allowRewrite = true) => {
    Bitset.chunkLen(bsLen, pos, len);
    if (len === 0)
      return true;
    const { FULL_MASK, BITS } = Bitset;
    const first = pos % BITS ? Math.floor(pos / BITS) : void 0;
    const lastPos = pos + len;
    const last = lastPos % BITS ? Math.floor(lastPos / BITS) : void 0;
    const canSet = (chunk, value) => chunk >= 0 && chunk < bs.length && (bs[chunk] & value) === 0;
    if (!allowRewrite) {
      if (first !== void 0 && first === last) {
        if (!canSet(first, FULL_MASK >>> BITS - len << BITS - len - pos))
          return false;
      } else {
        if (first !== void 0 && !canSet(first, FULL_MASK >>> pos % BITS))
          return false;
        const start2 = first !== void 0 ? first + 1 : pos / BITS;
        const end2 = last !== void 0 ? last : lastPos / BITS;
        for (let i = start2; i < end2; i++)
          if (!canSet(i, FULL_MASK))
            return false;
        if (last !== void 0 && first !== last) {
          if (!canSet(last, FULL_MASK << BITS - lastPos % BITS))
            return false;
        }
      }
    }
    if (first !== void 0 && first === last)
      return Bitset.set(bs, first, FULL_MASK >>> BITS - len << BITS - len - pos, allowRewrite);
    if (first !== void 0) {
      if (!Bitset.set(bs, first, FULL_MASK >>> pos % BITS, allowRewrite))
        return false;
    }
    const start = first !== void 0 ? first + 1 : pos / BITS;
    const end = last !== void 0 ? last : lastPos / BITS;
    for (let i = start; i < end; i++)
      if (!Bitset.set(bs, i, FULL_MASK, allowRewrite))
        return false;
    if (last !== void 0 && first !== last) {
      if (!Bitset.set(bs, last, FULL_MASK << BITS - lastPos % BITS, allowRewrite))
        return false;
    }
    return true;
  }
});
var Path = /* @__PURE__ */ Object.freeze({
  /**
   * Internal method for handling stack of paths (debug, errors, dynamic fields via path)
   * `.pop()` always happens after the wrapped function.
   * Fields inside the object are tracked via Reader/Writer enterField()/exitField(),
   * which the debugger overrides to observe per-field byte ranges.
   * NOTE: we don't want to do '.pop' on error!
   */
  pushObj: (stack, obj, objFn) => {
    stack.push({ obj });
    objFn();
    stack.pop();
  },
  path: (stack) => {
    const res = [];
    for (const i of stack)
      if (i.field !== void 0)
        res.push(i.field === "" ? '""' : `${i.field}`);
    return res.join("/");
  },
  err: (name, stack, msg) => {
    const text = `${name}(${Path.path(stack)}): ${typeof msg === "string" ? msg : msg.message}`;
    const err = msg instanceof TypeError ? new TypeError(text) : msg instanceof RangeError ? new RangeError(text) : new Error(text);
    if (msg instanceof Error && msg.stack) {
      const from = `${msg.name}: ${msg.message}`;
      const to = `${err.name}: ${err.message}`;
      err.stack = msg.stack.startsWith(from) ? `${to}${msg.stack.slice(from.length)}` : msg.stack;
    }
    return err;
  },
  resolve: (stack, path) => {
    const parts = path.split("/");
    const objPath = stack.map((i2) => i2.obj);
    let i = 0;
    for (; i < parts.length; i++) {
      if (parts[i] === "..")
        objPath.pop();
      else
        break;
    }
    let cur = objPath.pop();
    for (; i < parts.length; i++) {
      if (!cur || cur[parts[i]] === void 0)
        return void 0;
      cur = cur[parts[i]];
    }
    return cur;
  }
});
var _Reader = class __Reader {
  pos = 0;
  data;
  opts;
  stack;
  parent;
  parentOffset;
  bitBuf = 0;
  bitPos = 0;
  bs;
  // bitset
  view;
  constructor(data, opts = {}, stack = [], parent = void 0, parentOffset = 0) {
    if (!isBytes4(data))
      throw new TypeError(`Reader: expected Uint8Array, got ${typeof data}`);
    if (!isPlainObject(opts))
      throw new TypeError(`ReaderOpts: expected plain object, got ${opts}`);
    if (opts.allowUnreadBytes !== void 0 && typeof opts.allowUnreadBytes !== "boolean")
      throw new TypeError(`ReaderOpts.allowUnreadBytes: expected boolean, got ${typeof opts.allowUnreadBytes}`);
    if (opts.allowMultipleReads !== void 0 && typeof opts.allowMultipleReads !== "boolean")
      throw new TypeError(`ReaderOpts.allowMultipleReads: expected boolean, got ${typeof opts.allowMultipleReads}`);
    this.data = data;
    this.opts = opts;
    this.stack = stack;
    this.parent = parent;
    this.parentOffset = parentOffset;
    this.view = createView2(data);
  }
  /** Internal method for pointers. */
  _enablePointers() {
    if (this.parent)
      return this.parent._enablePointers();
    if (this.bs)
      return;
    this.bs = Bitset.create(this.data.length);
    Bitset.setRange(this.bs, this.data.length, 0, this.pos, this.opts.allowMultipleReads);
  }
  markBytesBS(pos, len) {
    if (this.parent)
      return this.parent.markBytesBS(this.parentOffset + pos, len);
    if (!len)
      return true;
    if (!this.bs)
      return true;
    return Bitset.setRange(this.bs, this.data.length, pos, len, false);
  }
  markBytes(len) {
    const pos = this.pos;
    const res = this.markBytesBS(pos, len);
    if (!this.opts.allowMultipleReads && !res)
      throw this.err(`multiple read pos=${pos} len=${len}`);
    this.pos += len;
    return res;
  }
  pushObj(obj, objFn) {
    return Path.pushObj(this.stack, obj, objFn);
  }
  enterField(field) {
    const last = this.stack[this.stack.length - 1];
    if (last === void 0 || last.field !== void 0)
      throw this.err(`enterField: invalid stack state, field=${field}`);
    last.field = field;
  }
  // Intentionally not called on throw, so Path.err() can report the failing leaf.
  exitField() {
    this.stack[this.stack.length - 1].field = void 0;
  }
  readView(n, fn) {
    if (!isNum(n) || n < 0)
      throw this.err(`readView: wrong length=${n}`);
    if (this.pos + n > this.data.length)
      throw this.err("readView: Unexpected end of buffer");
    const res = fn(this.view, this.pos);
    this.markBytes(n);
    return res;
  }
  // read bytes by absolute offset
  absBytes(n) {
    if (!isNum(n) || n < 0 || n > this.data.length)
      throw new Error("Unexpected end of buffer");
    return this.data.subarray(n);
  }
  finish() {
    if (this.opts.allowUnreadBytes)
      return;
    if (this.bitPos) {
      throw this.err(`${this.bitPos} bits left after unpack: ${hex.encode(this.data.subarray(this.pos))}`);
    }
    if (this.bs && !this.parent) {
      const notRead = Bitset.indices(this.bs, this.data.length, true);
      if (notRead.length) {
        const formatted = Bitset.range(notRead).map(({ pos, length }) => `(${pos}/${length})[${hex.encode(this.data.subarray(pos, pos + length))}]`).join(", ");
        throw this.err(`unread byte ranges: ${formatted} (total=${this.data.length})`);
      } else
        return;
    }
    if (!this.isEnd()) {
      throw this.err(`${this.leftBytes} bytes ${this.bitPos} bits left after unpack: ${hex.encode(this.data.subarray(this.pos))}`);
    }
  }
  // User methods
  err(msg) {
    return Path.err("Reader", this.stack, msg);
  }
  offsetReader(n) {
    if (!isNum(n) || n < 0 || n > this.data.length)
      throw this.err("offsetReader: Unexpected end of buffer");
    return new __Reader(this.absBytes(n), this.opts, this.stack, this, n);
  }
  bytes(n, peek = false) {
    if (this.bitPos)
      throw this.err("readBytes: bitPos not empty");
    if (!isNum(n) || n < 0)
      throw this.err(`readBytes: wrong length=${n}`);
    if (this.pos + n > this.data.length)
      throw this.err("readBytes: Unexpected end of buffer");
    const slice = this.data.subarray(this.pos, this.pos + n);
    if (!peek)
      this.markBytes(n);
    return slice;
  }
  byte(peek = false) {
    if (this.bitPos)
      throw this.err("readByte: bitPos not empty");
    if (this.pos + 1 > this.data.length)
      throw this.err("readByte: Unexpected end of buffer");
    const data = this.data[this.pos];
    if (!peek)
      this.markBytes(1);
    return data;
  }
  get leftBytes() {
    return this.data.length - this.pos;
  }
  get totalBytes() {
    return this.data.length;
  }
  isEnd() {
    return this.pos >= this.data.length && !this.bitPos;
  }
  progress() {
    return this.pos * 8 - this.bitPos;
  }
  // bits are read in BE mode (left to right): (0b1000_0000).readBits(1) == 1
  bits(bits) {
    if (!isNum(bits) || bits < 0)
      throw this.err(`BitReader: wrong length=${bits}`);
    if (bits > 32)
      throw this.err("BitReader: cannot read more than 32 bits in single call");
    let out = 0;
    while (bits) {
      if (!this.bitPos) {
        this.bitBuf = this.byte();
        this.bitPos = 8;
      }
      const take = Math.min(bits, this.bitPos);
      this.bitPos -= take;
      out = out << take | this.bitBuf >> this.bitPos & 2 ** take - 1;
      this.bitBuf &= 2 ** this.bitPos - 1;
      bits -= take;
    }
    return out >>> 0;
  }
  find(needle, pos = this.pos) {
    if (!isBytes4(needle))
      throw this.err(`find: needle is not bytes! ${needle}`);
    if (this.bitPos)
      throw this.err("find: bitPos not empty");
    if (!needle.length)
      throw this.err(`find: needle is empty`);
    if (!isNum(pos) || pos < 0)
      throw this.err(`find: wrong pos=${pos}`);
    return findBytes(needle, this.data, pos);
  }
};
var _Writer = class {
  pos = 0;
  stack;
  // Small writes are carved out of writer-owned chunks; caller-provided bytes() buffers are kept
  // by reference between them. A single realloc'd buffer was measured slower for tiny encodes
  // (basic/encode bench: 395ns -> 560ns), copy-on-grow is what chunking avoids.
  buffers = [];
  // Every chunk ever allocated by this writer, so finish(clean) can zeroize them whole.
  chunks = [];
  chunk;
  chunkView;
  // lazy: only writeView() needs it
  chunkPos = 0;
  run;
  nextChunkSize = 0;
  // 0 = size the first chunk to the first write
  ptrs = [];
  bitBuf = 0;
  bitPos = 0;
  finished = false;
  constructor(stack = []) {
    this.stack = stack;
  }
  // Reserves `len` contiguous writer-owned bytes and returns their offset inside `this.chunk`.
  carve(len) {
    if (this.chunk === void 0 || this.chunk.length - this.chunkPos < len) {
      const size = Math.max(len, this.nextChunkSize, 64);
      this.nextChunkSize = Math.min(size * 8, 4096);
      this.chunk = new Uint8Array(size);
      this.chunkView = void 0;
      this.chunkPos = 0;
      this.run = void 0;
      this.chunks.push(this.chunk);
    }
    const pos = this.chunkPos;
    if (this.run === void 0) {
      this.run = { chunk: this.chunk, start: pos, end: pos + len };
      this.buffers.push(this.run);
    } else
      this.run.end += len;
    this.chunkPos = pos + len;
    this.pos += len;
    return pos;
  }
  pushObj(obj, objFn) {
    return Path.pushObj(this.stack, obj, objFn);
  }
  enterField(field) {
    const last = this.stack[this.stack.length - 1];
    if (last === void 0 || last.field !== void 0)
      throw this.err(`enterField: invalid stack state, field=${field}`);
    last.field = field;
  }
  // Intentionally not called on throw, so Path.err() can report the failing leaf.
  exitField() {
    this.stack[this.stack.length - 1].field = void 0;
  }
  writeView(len, fn) {
    if (this.finished)
      throw this.err("buffer: finished");
    if (!isNum(len) || len < 0 || len > 8)
      throw new Error(`wrong writeView length=${len}`);
    if (this.bitPos)
      throw this.err("writeBytes: ends with non-empty bit buffer");
    const pos = this.carve(len);
    if (this.chunkView === void 0)
      this.chunkView = createView2(this.chunk);
    fn(this.chunkView, pos);
  }
  // User methods
  err(msg) {
    return Path.err("Writer", this.stack, msg);
  }
  bytes(b) {
    if (this.finished)
      throw this.err("buffer: finished");
    if (this.bitPos)
      throw this.err("writeBytes: ends with non-empty bit buffer");
    if (!isBytes4(b))
      throw this.err(`writeBytes: expected Uint8Array, got ${typeof b}`);
    this.buffers.push(b);
    this.run = void 0;
    this.pos += b.length;
  }
  byte(b) {
    if (this.finished)
      throw this.err("buffer: finished");
    if (this.bitPos)
      throw this.err("writeByte: ends with non-empty bit buffer");
    if (!isNum(b) || b < 0 || b > 255)
      throw this.err(`writeByte: wrong value=${b}`);
    const pos = this.carve(1);
    this.chunk[pos] = b;
  }
  finish(clean2 = true) {
    if (this.finished)
      throw this.err("buffer: finished");
    if (this.bitPos)
      throw this.err("buffer: ends with non-empty bit buffer");
    const buffers = this.buffers;
    let sum = 0;
    for (let i = 0; i < buffers.length; i++) {
      const b = buffers[i];
      sum += isBytes4(b) ? b.length : b.end - b.start;
    }
    for (let i = 0; i < this.ptrs.length; i++)
      sum += this.ptrs[i].buffer.length;
    const buf = new Uint8Array(sum);
    let pad = 0;
    for (let i = 0; i < buffers.length; i++) {
      const b = buffers[i];
      if (isBytes4(b)) {
        buf.set(b, pad);
        pad += b.length;
      } else {
        buf.set(b.chunk.subarray(b.start, b.end), pad);
        pad += b.end - b.start;
      }
    }
    for (let i = 0; i < this.ptrs.length; i++) {
      buf.set(this.ptrs[i].buffer, pad);
      pad += this.ptrs[i].buffer.length;
    }
    for (let pos = this.pos, i = 0; i < this.ptrs.length; i++) {
      const ptr = this.ptrs[i];
      buf.set(ptr.ptr.encode(pos), ptr.pos);
      pos += ptr.buffer.length;
    }
    if (clean2) {
      for (const c of this.chunks)
        c.fill(0);
      this.chunks = [];
      this.chunk = void 0;
      this.chunkView = void 0;
      this.chunkPos = 0;
      this.run = void 0;
      this.buffers = [];
      for (const p of this.ptrs)
        p.buffer.fill(0);
      this.ptrs = [];
      this.finished = true;
      this.bitBuf = 0;
    }
    return buf;
  }
  bits(value, bits) {
    if (this.finished)
      throw this.err("buffer: finished");
    if (!isNum(bits) || bits < 0)
      throw this.err(`writeBits: wrong length=${bits}`);
    if (bits > 32)
      throw this.err("writeBits: cannot write more than 32 bits in single call");
    if (!isNum(value) || value < 0)
      throw this.err(`writeBits: wrong value=${value}`);
    if (value >= 2 ** bits)
      throw this.err(`writeBits: value (${value}) >= 2**bits (${bits})`);
    while (bits) {
      const take = Math.min(bits, 8 - this.bitPos);
      this.bitBuf = this.bitBuf << take | value >> bits - take;
      this.bitPos += take;
      bits -= take;
      value &= 2 ** bits - 1;
      if (this.bitPos === 8) {
        this.bitPos = 0;
        const pos = this.carve(1);
        this.chunk[pos] = this.bitBuf;
      }
    }
  }
};
var swapEndianness = (b) => Uint8Array.from(b).reverse();
function checkMinimalBigintBytes(value, le, signed, err) {
  if (!value.length)
    return;
  const b = le ? swapEndianness(value) : value;
  const fail = () => {
    throw err("bigint: non-minimal encoding");
  };
  if (!signed) {
    if (b[0] === 0)
      fail();
    return;
  }
  if (b[0] === 0 && (b.length === 1 || (b[1] & 128) === 0))
    fail();
  if (b.length > 1 && b[0] === 255 && (b[1] & 128) !== 0)
    fail();
}
function checkBounds(value, bits, signed) {
  if (signed) {
    if (bits <= _0n7)
      throw new Error(`checkBounds: signed bits must be positive, got ${bits}`);
    const signBit = _2n4 ** (bits - _1n5);
    if (value < -signBit || value >= signBit)
      throw new Error(`value out of signed bounds. Expected ${-signBit} <= ${value} < ${signBit}`);
  } else {
    const max = _2n4 ** bits;
    if (_0n7 > value || value >= max)
      throw new Error(`value out of unsigned bounds. Expected 0 <= ${value} < ${max}`);
  }
}
function _wrap(inner) {
  const _inner = inner;
  return {
    // NOTE: we cannot export validate here, since it is likely mistake.
    // Raw inner throws propagate unchanged; path-aware errors must use w.err/r.err or validate().
    encodeStream: _inner.encodeStream,
    decodeStream: _inner.decodeStream,
    size: _inner.size,
    encode: (value) => {
      const w = new _Writer();
      _inner.encodeStream(w, value);
      return w.finish();
    },
    decode: (data, opts = {}) => {
      if (!isBytes4(data))
        throw new TypeError(`decode: expected Uint8Array, got ${typeof data}`);
      const r = new _Reader(data, opts);
      const res = _inner.decodeStream(r);
      r.finish();
      return res;
    }
  };
}
function validate(inner, fn) {
  if (!isCoder(inner))
    throw new TypeError(`validate: invalid inner value ${inner}`);
  if (typeof fn !== "function")
    throw new TypeError("validate: fn should be function");
  return _wrap({
    size: inner.size,
    encodeStream: (w, value) => {
      let res;
      try {
        res = fn(value);
      } catch (e) {
        throw w.err(e);
      }
      inner.encodeStream(w, res);
    },
    decodeStream: (r) => {
      const res = inner.decodeStream(r);
      try {
        return fn(res);
      } catch (e) {
        throw r.err(e);
      }
    }
  });
}
var wrap = (inner) => {
  const _inner = inner;
  if (!isPlainObject(_inner))
    throw new TypeError(`wrap: invalid inner value ${_inner}`);
  if (typeof _inner.encodeStream !== "function")
    throw new TypeError("wrap: encodeStream should be function");
  if (typeof _inner.decodeStream !== "function")
    throw new TypeError("wrap: decodeStream should be function");
  if (_inner.size !== void 0 && (!isNum(_inner.size) || _inner.size < 0))
    throw new TypeError(`wrap: invalid size ${_inner.size}`);
  if (_inner.validate !== void 0 && typeof _inner.validate !== "function")
    throw new TypeError("wrap: validate should be function");
  const res = _wrap(_inner);
  return _inner.validate !== void 0 ? validate(res, _inner.validate) : res;
};
var isBaseCoder = (elm) => isPlainObject(elm) && typeof elm.decode === "function" && typeof elm.encode === "function";
function isCoder(elm) {
  return isPlainObject(elm) && isBaseCoder(elm) && typeof elm.encodeStream === "function" && typeof elm.decodeStream === "function" && (elm.size === void 0 || isNum(elm.size) && elm.size >= 0);
}
function dict() {
  return {
    encode: (from) => {
      if (!Array.isArray(from))
        throw new Error("array expected");
      const to = {};
      const seen = /* @__PURE__ */ new Set();
      for (const item of from) {
        if (!Array.isArray(item) || item.length !== 2)
          throw new Error(`array of two elements expected`);
        const name = item[0];
        const value = item[1];
        validateFieldName(name, "dict: key");
        if (seen.has(name))
          throw new Error(`key(${name}) appears twice in struct`);
        seen.add(name);
        to[name] = value;
      }
      return to;
    },
    decode: (to) => {
      if (!isPlainObject(to))
        throw new Error(`expected plain object, got ${to}`);
      for (const name in to)
        validateFieldName(name, "dict: key");
      return Object.entries(to);
    }
  };
}
var numberBigint = /* @__PURE__ */ Object.freeze({
  encode: (from) => {
    if (typeof from !== "bigint")
      throw new Error(`expected bigint, got ${typeof from}`);
    if (from > BigInt(Number.MAX_SAFE_INTEGER))
      throw new Error(`element bigger than MAX_SAFE_INTEGER=${from}`);
    if (from < BigInt(Number.MIN_SAFE_INTEGER))
      throw new Error(`element smaller than MIN_SAFE_INTEGER=${from}`);
    return Number(from);
  },
  decode: (to) => {
    if (!isNum(to))
      throw new Error("element is not a safe integer");
    return BigInt(to);
  }
});
function tsEnum(e) {
  if (!isPlainObject(e))
    throw new Error("plain object expected");
  return {
    encode: (from) => {
      if (!isNum(from) || !(from in e))
        throw new Error(`wrong value ${from}`);
      return e[from];
    },
    decode: (to) => {
      if (typeof to !== "string")
        throw new Error(`wrong value ${typeof to}`);
      const value = e[to];
      if (!hasOwn(e, to) || !isNum(value))
        throw new Error(`wrong value ${to}`);
      return value;
    }
  };
}
function decimal(precision, round = false) {
  if (!isNum(precision) || precision < 0)
    throw new Error(`decimal/precision: wrong value ${precision}`);
  if (typeof round !== "boolean")
    throw new Error(`decimal/round: expected boolean, got ${typeof round}`);
  const decimalMask = _10n ** BigInt(precision);
  return {
    encode: (from) => {
      if (typeof from !== "bigint")
        throw new Error(`expected bigint, got ${typeof from}`);
      let s = (from < _0n7 ? -from : from).toString(10);
      let sep = s.length - precision;
      if (sep < 0) {
        s = s.padStart(s.length - sep, "0");
        sep = 0;
      }
      let i = s.length - 1;
      for (; i >= sep && s[i] === "0"; i--)
        ;
      let int = s.slice(0, sep);
      let frac = s.slice(sep, i + 1);
      if (!int)
        int = "0";
      if (from < _0n7)
        int = "-" + int;
      if (!frac)
        return int;
      return `${int}.${frac}`;
    },
    decode: (to) => {
      if (typeof to !== "string")
        throw new Error(`expected string, got ${typeof to}`);
      let neg = false;
      if (to.startsWith("-")) {
        neg = true;
        to = to.slice(1);
      }
      if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(to))
        throw new Error(`wrong string value=${to}`);
      let sep = to.indexOf(".");
      sep = sep === -1 ? to.length : sep;
      const intS = to.slice(0, sep);
      const fracS = to.slice(sep + 1).replace(/0+$/, "");
      const int = BigInt(intS) * decimalMask;
      if (!round && fracS.length > precision) {
        throw new Error(`fractional part cannot be represented with this precision (num=${to}, prec=${precision})`);
      }
      const fracLen = Math.min(fracS.length, precision);
      const frac = BigInt(fracS.slice(0, fracLen)) * _10n ** BigInt(precision - fracLen);
      const value = int + frac;
      if (neg && value === _0n7)
        throw new Error(`negative zero is not allowed`);
      return neg ? -value : value;
    }
  };
}
function match(lst) {
  if (!Array.isArray(lst))
    throw new Error(`expected array, got ${typeof lst}`);
  for (const i of lst)
    if (!isBaseCoder(i))
      throw new Error(`wrong base coder ${i}`);
  return {
    encode: (from) => {
      for (const c of lst) {
        let elm;
        try {
          elm = c.encode(from);
        } catch {
          continue;
        }
        if (elm !== void 0)
          return elm;
      }
      throw new Error(`match/encode: cannot find match in ${from}`);
    },
    decode: (to) => {
      for (const c of lst) {
        let elm;
        try {
          elm = c.decode(to);
        } catch {
          continue;
        }
        if (elm !== void 0)
          return elm;
      }
      throw new Error(`match/decode: cannot find match in ${to}`);
    }
  };
}
var reverse = (coder) => {
  if (!isBaseCoder(coder))
    throw new Error("BaseCoder expected");
  return { encode: (to) => coder.decode(to), decode: (from) => coder.encode(from) };
};
var coders = /* @__PURE__ */ Object.freeze({ dict, numberBigint, tsEnum, decimal, match, reverse });
var bigint = (size, le = false, signed = false, sized = true, minimal = false) => {
  if (!isNum(size) || size <= 0)
    throw new Error(`bigint/size: wrong value ${size}`);
  if (typeof le !== "boolean")
    throw new Error(`bigint/le: expected boolean, got ${typeof le}`);
  if (typeof signed !== "boolean")
    throw new Error(`bigint/signed: expected boolean, got ${typeof signed}`);
  if (typeof sized !== "boolean")
    throw new Error(`bigint/sized: expected boolean, got ${typeof sized}`);
  if (typeof minimal !== "boolean")
    throw new Error(`bigint/minimal: expected boolean, got ${typeof minimal}`);
  const bLen = BigInt(size);
  const signBit = _2n4 ** (_8n2 * bLen - _1n5);
  return wrap({
    size: sized ? size : void 0,
    encodeStream: (w, value) => {
      const zero = value === _0n7;
      if (signed && value < 0)
        value = value | signBit;
      let res = new Uint8Array(size);
      for (let i = size - 1; i >= 0; i--) {
        res[i] = Number(value & _255n);
        value >>= _8n2;
      }
      if (!sized) {
        let pos = 0;
        if (signed) {
          for (; pos < res.length - 1; pos++) {
            const next = res[pos + 1];
            if (res[pos] === 0 && (next & 128) === 0)
              continue;
            if (res[pos] === 255 && (next & 128) !== 0)
              continue;
            break;
          }
          res = zero ? res.subarray(res.length) : res.subarray(pos);
        } else {
          for (; pos < res.length; pos++)
            if (res[pos] !== 0)
              break;
          res = res.subarray(pos);
        }
      }
      w.bytes(le ? res.reverse() : res);
    },
    decodeStream: (r) => {
      const value = r.bytes(sized ? size : Math.min(size, r.leftBytes));
      if (!sized && minimal)
        checkMinimalBigintBytes(value, le, signed, (msg) => r.err(msg));
      let res = _0n7;
      if (le)
        for (let i = value.length - 1; i >= 0; i--)
          res = res << _8n2 | BigInt(value[i]);
      else
        for (let i = 0; i < value.length; i++)
          res = res << _8n2 | BigInt(value[i]);
      const sBit = sized || !value.length ? signBit : _2n4 ** (_8n2 * BigInt(value.length) - _1n5);
      if (signed && res & sBit)
        res = (res ^ sBit) - sBit;
      return res;
    },
    validate: (value) => {
      if (typeof value !== "bigint")
        throw new Error(`bigint: invalid value: ${value}`);
      checkBounds(value, _8n2 * bLen, !!signed);
      return value;
    }
  });
};
var U256LE = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ bigint(32, true)
);
var U64LE = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ bigint(8, true)
);
var I64LE = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ bigint(8, true, true)
);
var view = (len, opts) => wrap({
  size: len,
  encodeStream: (w, value) => w.writeView(len, (view2, pos) => opts.write(view2, pos, value)),
  decodeStream: (r) => r.readView(len, opts.read),
  validate: (value) => {
    if (typeof value !== "number")
      throw new TypeError(`viewCoder: expected number, got ${typeof value}`);
    if (opts.validate)
      opts.validate(value);
    return value;
  }
});
var intView = (len, signed, opts) => {
  const bits = len * 8;
  const signBit = 2 ** (bits - 1);
  const validateSigned = (value) => {
    if (!isNum(value))
      throw new TypeError(`sintView: value is not safe integer: ${value}`);
    if (value < -signBit || value >= signBit) {
      throw new RangeError(`sintView: value out of bounds. Expected ${-signBit} <= ${value} < ${signBit}`);
    }
  };
  const maxVal = 2 ** bits;
  const validateUnsigned = (value) => {
    if (!isNum(value))
      throw new TypeError(`uintView: value is not safe integer: ${value}`);
    if (0 > value || value >= maxVal) {
      throw new RangeError(`uintView: value out of bounds. Expected 0 <= ${value} < ${maxVal}`);
    }
  };
  return view(len, {
    write: opts.write,
    read: opts.read,
    validate: signed ? validateSigned : validateUnsigned
  });
};
var U32LE = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ intView(4, false, {
    read: (view2, pos) => view2.getUint32(pos, true),
    write: (view2, pos, value) => view2.setUint32(pos, value, true)
  })
);
var U32BE = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ intView(4, false, {
    read: (view2, pos) => view2.getUint32(pos, false),
    write: (view2, pos, value) => view2.setUint32(pos, value, false)
  })
);
var I32LE = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ intView(4, true, {
    read: (view2, pos) => view2.getInt32(pos, true),
    write: (view2, pos, value) => view2.setInt32(pos, value, true)
  })
);
var U16LE = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ intView(2, false, {
    read: (view2, pos) => view2.getUint16(pos, true),
    write: (view2, pos, value) => view2.setUint16(pos, value, true)
  })
);
var U8 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ intView(1, false, {
    read: (view2, pos) => view2.getUint8(pos),
    write: (view2, pos, value) => view2.setUint8(pos, value)
  })
);
var createBytes = (len, le = false) => {
  if (typeof le !== "boolean")
    throw new TypeError(`bytes/le: expected boolean, got ${typeof le}`);
  const _length = lengthCoder(len);
  const _isb = isBytes4(len);
  const terminator = _isb ? Uint8Array.from(len) : void 0;
  const findTerminator = terminator && terminator.length ? createFindBytes(terminator) : void 0;
  return wrap({
    size: typeof len === "number" ? len : void 0,
    encodeStream: (w, value) => {
      if (!_isb)
        _length.encodeStream(w, value.length);
      w.bytes(le ? swapEndianness(value) : value);
      if (terminator)
        w.bytes(terminator);
    },
    decodeStream: (r) => {
      let bytes;
      if (terminator) {
        const tPos = r.find(terminator);
        if (tPos === void 0)
          throw r.err(`bytes: cannot find terminator`);
        bytes = r.bytes(tPos - r.pos);
        r.bytes(terminator.length);
      } else {
        bytes = r.bytes(len === null ? r.leftBytes : _length.decodeStream(r));
      }
      return le ? swapEndianness(bytes) : bytes;
    },
    validate: (value) => {
      if (!isBytes4(value))
        throw new TypeError(`bytes: invalid value ${value}`);
      if (findTerminator) {
        const data = le ? swapEndianness(value) : value;
        if (findTerminator(data) !== void 0)
          throw new Error("bytes: value contains terminator");
      }
      return value;
    }
  });
};
function prefix(len, inner) {
  if (!isCoder(inner))
    throw new TypeError(`prefix: invalid inner value ${inner}`);
  return apply(createBytes(len), reverse(inner));
}
var string = (len, le = false) => validate(apply(createBytes(len, le), utf8), (value) => {
  if (typeof value !== "string")
    throw new Error(`expected string, got ${typeof value}`);
  return value;
});
function apply(inner, base) {
  if (!isCoder(inner))
    throw new TypeError(`apply: invalid inner value ${inner}`);
  if (!isBaseCoder(base))
    throw new TypeError(`apply: invalid base value ${base}`);
  return wrap({
    size: inner.size,
    encodeStream: (w, value) => {
      let innerValue;
      try {
        innerValue = base.decode(value);
      } catch (e) {
        throw w.err("" + e);
      }
      return inner.encodeStream(w, innerValue);
    },
    decodeStream: (r) => {
      const innerValue = inner.decodeStream(r);
      try {
        return base.encode(innerValue);
      } catch (e) {
        throw r.err("" + e);
      }
    }
  });
}
var flag = (flagValue, xor = false) => {
  if (!isBytes4(flagValue))
    throw new TypeError(`flag/flagValue: expected Uint8Array, got ${typeof flagValue}`);
  if (flagValue.length === 0)
    throw new Error("flag/flagValue: empty marker");
  if (typeof xor !== "boolean")
    throw new TypeError(`flag/xor: expected boolean, got ${typeof xor}`);
  const marker = Uint8Array.from(flagValue);
  return wrap({
    // Marker flags encode one state as empty, so encoded length depends on the boolean value.
    size: void 0,
    encodeStream: (w, value) => {
      if (!!value !== xor)
        w.bytes(marker);
    },
    decodeStream: (r) => {
      let hasFlag = r.leftBytes >= marker.length;
      if (hasFlag) {
        hasFlag = equalBytes(r.bytes(marker.length, true), marker);
        if (hasFlag)
          r.bytes(marker.length);
      }
      return hasFlag !== xor;
    },
    validate: (value) => {
      if (value !== void 0 && typeof value !== "boolean")
        throw new Error(`flag: expected boolean value or undefined, got ${typeof value}`);
      return value;
    }
  });
};
function validateDefaultSlot(r, value, def2) {
  const valueObj = value !== null && typeof value === "object" && !isBytes4(value);
  const defObj = def2 !== null && typeof def2 === "object" && !isBytes4(def2);
  const nan = typeof value === "number" && typeof def2 === "number" && Number.isNaN(value) && Number.isNaN(def2);
  if ((!valueObj || !defObj) && !equal(value, def2) && !nan)
    throw r.err(`default: invalid value ${value} !== ${def2}`);
}
function flagged(path, inner, def2) {
  if (typeof path !== "string" && !isCoder(path))
    throw new TypeError(`flagged: wrong path=${path}`);
  if (!isCoder(inner))
    throw new TypeError(`flagged: invalid inner value ${inner}`);
  const hasDef = def2 !== void 0;
  return wrap({
    encodeStream: (w, value) => {
      if (typeof path === "string") {
        if (Path.resolve(w.stack, path))
          inner.encodeStream(w, value);
        else if (hasDef)
          inner.encodeStream(w, def2);
      } else {
        const present = value !== void 0;
        path.encodeStream(w, present);
        if (present)
          inner.encodeStream(w, value);
        else if (hasDef)
          inner.encodeStream(w, def2);
      }
    },
    decodeStream: (r) => {
      let hasFlag = false;
      if (typeof path === "string")
        hasFlag = !!Path.resolve(r.stack, path);
      else
        hasFlag = path.decodeStream(r);
      if (hasFlag)
        return inner.decodeStream(r);
      else if (hasDef)
        validateDefaultSlot(r, inner.decodeStream(r), def2);
      return;
    }
  });
}
function magic(inner, constant, check = true) {
  if (!isCoder(inner))
    throw new TypeError(`magic: invalid inner value ${inner}`);
  if (typeof check !== "boolean")
    throw new TypeError(`magic: expected boolean, got ${typeof check}`);
  return wrap({
    size: inner.size,
    encodeStream: (w, _value) => inner.encodeStream(w, constant),
    decodeStream: (r) => {
      const value = inner.decodeStream(r);
      const valueObj = value !== null && typeof value === "object" && !isBytes4(value);
      const constantObj = constant !== null && typeof constant === "object" && !isBytes4(constant);
      const canCompare = !valueObj || !constantObj;
      if (check && canCompare && !equal(value, constant)) {
        throw r.err(`magic: invalid value: ${value} !== ${constant}`);
      }
      return;
    },
    validate: (value) => {
      if (value !== void 0)
        throw new Error(`magic: wrong value=${typeof value}`);
      return value;
    }
  });
}
function sizeof(fields) {
  let size = 0;
  for (const f of fields) {
    if (f.size === void 0)
      return;
    if (!isNum(f.size))
      throw new Error(`sizeof: wrong element size=${f.size}`);
    size += f.size;
  }
  return size;
}
function struct(fields) {
  if (!isPlainObject(fields))
    throw new TypeError(`struct: expected plain object, got ${fields}`);
  const coders2 = [];
  for (const name in fields) {
    validateFieldName(name, "struct: field");
    if (!isCoder(fields[name]))
      throw new TypeError(`struct: field ${name} is not CoderType`);
    coders2.push(fields[name]);
  }
  return wrap({
    size: sizeof(coders2),
    encodeStream: (w, value) => {
      const _w = w;
      _w.pushObj(value, () => {
        for (const name in fields) {
          _w.enterField(name);
          fields[name].encodeStream(w, value[name]);
          _w.exitField();
        }
      });
    },
    decodeStream: (r) => {
      const res = {};
      const _r = r;
      _r.pushObj(res, () => {
        for (const name in fields) {
          _r.enterField(name);
          res[name] = fields[name].decodeStream(r);
          _r.exitField();
        }
      });
      return res;
    },
    validate: (value) => {
      if (typeof value !== "object" || value === null)
        throw new Error(`struct: invalid value ${value}`);
      return value;
    }
  });
}
function array(len, inner) {
  if (!isCoder(inner))
    throw new TypeError(`array: invalid inner value ${inner}`);
  const terminator = isBytes4(len) ? Uint8Array.from(len) : void 0;
  const _length = lengthCoder(typeof len === "string" ? `../${len}` : terminator || len);
  if (len === null && inner.size === 0)
    throw new Error("array: null length cannot use zero-size inner");
  if ((isCoder(len) || typeof len === "string") && inner.size === 0)
    throw new Error("array: dynamic length cannot use zero-size inner");
  return wrap({
    // `size: 0` is a valid fixed-size hint and must compose through arrays/tuples/structs.
    size: typeof len === "number" && inner.size !== void 0 ? len * inner.size : void 0,
    encodeStream: (w, value) => {
      const _w = w;
      _w.pushObj(value, () => {
        if (!terminator)
          _length.encodeStream(w, value.length);
        for (let i = 0; i < value.length; i++) {
          _w.enterField(i);
          const elm = value[i];
          const startPos = _w.pos;
          inner.encodeStream(w, elm);
          if (terminator && terminator.length <= _w.pos - startPos) {
            const data = _w.finish(false).subarray(startPos, _w.pos);
            if (equalBytes(data.subarray(0, terminator.length), terminator))
              throw _w.err(`array: inner element encoding same as separator. elm=${elm} data=${data}`);
          }
          _w.exitField();
        }
      });
      if (terminator)
        w.bytes(terminator);
    },
    decodeStream: (r) => {
      const res = [];
      const _r = r;
      _r.pushObj(res, () => {
        if (len === null) {
          for (let i = 0; !r.isEnd(); i++) {
            _r.enterField(i);
            const progress = _r.progress();
            res.push(inner.decodeStream(r));
            if (_r.progress() === progress)
              throw r.err("array: inner decoder did not consume input");
            _r.exitField();
            if (inner.size && r.leftBytes < inner.size)
              break;
          }
        } else if (terminator) {
          for (let i = 0; ; i++) {
            if (equalBytes(r.bytes(terminator.length, true), terminator)) {
              r.bytes(terminator.length);
              break;
            }
            _r.enterField(i);
            const progress = _r.progress();
            res.push(inner.decodeStream(r));
            if (_r.progress() === progress)
              throw r.err("array: inner decoder did not consume input");
            _r.exitField();
          }
        } else {
          _r.enterField("arrayLen");
          const length = _length.decodeStream(r);
          _r.exitField();
          if (inner.size && length * inner.size > r.leftBytes)
            throw r.err(`array: length=${length} elements of size=${inner.size} exceed ${r.leftBytes} bytes left`);
          for (let i = 0; i < length; i++) {
            _r.enterField(i);
            res.push(inner.decodeStream(r));
            _r.exitField();
          }
        }
      });
      return res;
    },
    validate: (value) => {
      if (!Array.isArray(value))
        throw new Error(`array: invalid value ${value}`);
      return value;
    }
  });
}

// node_modules/@scure/btc-signer/utils.js
function abigint(n, title = "value") {
  if (typeof n !== "bigint")
    throw new TypeError(`"${title}" expected bigint, got type=${typeof n}`);
  if (n < _0n8)
    throw new RangeError(`"${title}" expected non-negative bigint, got ${n}`);
  return n;
}
function aarray2(item, title, inner = () => {
}) {
  if (!Array.isArray(item))
    throw new TypeError(`"${title}" expected array, got type=${typeof item}`);
  for (let i = 0; i < item.length; i++)
    inner(item[i], `${title}[${i}]`);
  return item;
}
function astring2(value, title = "") {
  if (typeof value !== "string") {
    const prefix2 = title && `"${title}" `;
    throw new TypeError(prefix2 + "expected string, got type=" + typeof value);
  }
  return value;
}
function validateObject2(object, fields = {}, optFields = {}, _title = "object") {
  return validateObject(object, fields, optFields);
}
var Point = /* @__PURE__ */ (() => secp256k1.Point)();
var Fn = /* @__PURE__ */ (() => Point.Fn)();
var CURVE_ORDER = /* @__PURE__ */ (() => Point.Fn.ORDER)();
var _0n8 = /* @__PURE__ */ BigInt(0);
var _2n5 = /* @__PURE__ */ BigInt(2);
var hasEven2 = (y) => y % _2n5 === _0n8;
var isBytes5 = /* @__PURE__ */ (() => utils.isBytes)();
var concatBytes4 = /* @__PURE__ */ (() => utils.concatBytes)();
var equalBytes2 = /* @__PURE__ */ (() => utils.equalBytes)();
var sha2562 = /* @__PURE__ */ (() => sha256)();
var hash160 = (msg) => ripemd160(sha2562(msg));
var sha256x2 = (...msgs) => sha2562(sha2562(concatBytes4(...msgs)));
var pubSchnorr = (priv) => schnorr.getPublicKey(priv);
var pubECDSA = (privateKey, isCompressed) => secp256k1.getPublicKey(privateKey, isCompressed);
var LOW_R_BOUND = /* @__PURE__ */ (() => CURVE_ORDER / _2n5)();
var hasLowR = (sig) => sig.r < LOW_R_BOUND;
function signECDSA(hash, privateKey, lowR = false) {
  abytes2(hash, 32, "hash");
  let sig = secp256k1.Signature.fromBytes(secp256k1.sign(hash, privateKey, { prehash: false }));
  if (lowR && !hasLowR(sig)) {
    const extraEntropy = new Uint8Array(32);
    let counter = 0;
    while (!hasLowR(sig)) {
      extraEntropy.set(U32LE.encode(counter++));
      sig = secp256k1.Signature.fromBytes(secp256k1.sign(hash, privateKey, { prehash: false, extraEntropy }));
      if (counter > 4294967295)
        throw new Error("lowR counter overflow: report the error");
    }
  }
  return sig.toBytes("der");
}
var signSchnorr = (message, secretKey, auxRand) => schnorr.sign(message, secretKey, auxRand);
var tagSchnorr = (tag, ...messages) => schnorr.utils.taggedHash(tag, ...messages);
var PubT = /* @__PURE__ */ (() => Object.freeze({
  ecdsa: 0,
  schnorr: 1
}))();
function validatePubkey(pub, type) {
  const len = pub.length;
  if (type === PubT.ecdsa) {
    if (len === 32)
      throw new RangeError("Expected non-Schnorr key");
    Point.fromBytes(pub);
    return pub;
  } else if (type === PubT.schnorr) {
    if (len !== 32)
      throw new RangeError("Expected 32-byte Schnorr key");
    schnorr.utils.lift_x(bytesToNumberBE(pub));
    return pub;
  } else {
    throw new TypeError("Unknown key type");
  }
}
function tapTweak(a, b) {
  const u = schnorr.utils;
  const t = u.taggedHash("TapTweak", a, b);
  const tn = bytesToNumberBE(t);
  if (tn >= CURVE_ORDER)
    throw new Error("tweak higher than curve order");
  return tn;
}
function taprootTweakPrivKey(privKey, merkleRoot = Uint8Array.of()) {
  const u = schnorr.utils;
  abytes2(privKey, 32, "privKey");
  const seckey0 = bytesToNumberBE(privKey);
  const P = Point.BASE.multiply(seckey0);
  const seckey = hasEven2(P.y) ? seckey0 : Fn.neg(seckey0);
  const xP = u.pointToBytes(P);
  const t = tapTweak(xP, merkleRoot);
  return numberToBytesBE(Fn.add(seckey, t), 32);
}
function taprootTweakPubkey(pubKey, h) {
  const u = schnorr.utils;
  abytes2(pubKey, 32, "pubKey");
  const t = tapTweak(pubKey, h);
  const P = u.lift_x(bytesToNumberBE(pubKey));
  const Q = P.add(Point.BASE.multiply(t));
  const parity = hasEven2(Q.y) ? 0 : 1;
  return [u.pointToBytes(Q), parity];
}
var NETWORK = /* @__PURE__ */ Object.freeze({
  bech32: "bc",
  pubKeyHash: 0,
  scriptHash: 5,
  wif: 128
});
var TEST_NETWORK = /* @__PURE__ */ Object.freeze({
  bech32: "tb",
  pubKeyHash: 111,
  scriptHash: 196,
  wif: 239
});
function compareBytes(a, b) {
  if (!isBytes5(a) || !isBytes5(b))
    throw new TypeError(`cmp: wrong type a=${typeof a} b=${typeof b}`);
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++)
    if (a[i] != b[i])
      return Math.sign(a[i] - b[i]);
  return Math.sign(a.length - b.length);
}
function reverseObject(obj) {
  const res = /* @__PURE__ */ Object.create(null);
  for (const k in obj) {
    if (res[obj[k]] !== void 0)
      throw new Error("duplicate key");
    res[obj[k]] = k;
  }
  return res;
}

// node_modules/@scure/btc-signer/script.js
var _0n9 = /* @__PURE__ */ BigInt(0);
var _1n6 = /* @__PURE__ */ BigInt(1);
var _2n6 = /* @__PURE__ */ BigInt(2);
var _8n3 = /* @__PURE__ */ BigInt(8);
var U8_MAX = /* @__PURE__ */ BigInt(255);
var COMPACT_DIRECT_MAX = /* @__PURE__ */ BigInt(252);
var OP = /* @__PURE__ */ Object.freeze({
  OP_0: 0,
  PUSHDATA1: 76,
  PUSHDATA2: 77,
  PUSHDATA4: 78,
  "1NEGATE": 79,
  RESERVED: 80,
  OP_1: 81,
  OP_2: 82,
  OP_3: 83,
  OP_4: 84,
  OP_5: 85,
  OP_6: 86,
  OP_7: 87,
  OP_8: 88,
  OP_9: 89,
  OP_10: 90,
  OP_11: 91,
  OP_12: 92,
  OP_13: 93,
  OP_14: 94,
  OP_15: 95,
  OP_16: 96,
  // Control
  NOP: 97,
  VER: 98,
  IF: 99,
  NOTIF: 100,
  VERIF: 101,
  VERNOTIF: 102,
  ELSE: 103,
  ENDIF: 104,
  VERIFY: 105,
  RETURN: 106,
  // Stack
  TOALTSTACK: 107,
  FROMALTSTACK: 108,
  "2DROP": 109,
  "2DUP": 110,
  "3DUP": 111,
  "2OVER": 112,
  "2ROT": 113,
  "2SWAP": 114,
  IFDUP: 115,
  DEPTH: 116,
  DROP: 117,
  DUP: 118,
  NIP: 119,
  OVER: 120,
  PICK: 121,
  ROLL: 122,
  ROT: 123,
  SWAP: 124,
  TUCK: 125,
  // Splice
  CAT: 126,
  SUBSTR: 127,
  LEFT: 128,
  RIGHT: 129,
  SIZE: 130,
  // Boolean logic
  INVERT: 131,
  AND: 132,
  OR: 133,
  XOR: 134,
  EQUAL: 135,
  EQUALVERIFY: 136,
  RESERVED1: 137,
  RESERVED2: 138,
  // Numbers
  "1ADD": 139,
  "1SUB": 140,
  "2MUL": 141,
  "2DIV": 142,
  NEGATE: 143,
  ABS: 144,
  NOT: 145,
  "0NOTEQUAL": 146,
  ADD: 147,
  SUB: 148,
  MUL: 149,
  DIV: 150,
  MOD: 151,
  LSHIFT: 152,
  RSHIFT: 153,
  BOOLAND: 154,
  BOOLOR: 155,
  NUMEQUAL: 156,
  NUMEQUALVERIFY: 157,
  NUMNOTEQUAL: 158,
  LESSTHAN: 159,
  GREATERTHAN: 160,
  LESSTHANOREQUAL: 161,
  GREATERTHANOREQUAL: 162,
  MIN: 163,
  MAX: 164,
  WITHIN: 165,
  // Crypto
  RIPEMD160: 166,
  SHA1: 167,
  SHA256: 168,
  HASH160: 169,
  HASH256: 170,
  CODESEPARATOR: 171,
  CHECKSIG: 172,
  CHECKSIGVERIFY: 173,
  CHECKMULTISIG: 174,
  CHECKMULTISIGVERIFY: 175,
  // Expansion
  NOP1: 176,
  CHECKLOCKTIMEVERIFY: 177,
  CHECKSEQUENCEVERIFY: 178,
  NOP4: 179,
  NOP5: 180,
  NOP6: 181,
  NOP7: 182,
  NOP8: 183,
  NOP9: 184,
  NOP10: 185,
  // BIP 342
  CHECKSIGADD: 186,
  // Invalid
  INVALID: 255
});
var OPNames = /* @__PURE__ */ (() => Object.freeze(reverseObject(OP)))();
function ScriptNum(bytesLimit = 6, forceMinimal = false) {
  return wrap({
    encodeStream: (w, value) => {
      if (value === _0n9)
        return;
      const neg = value < 0;
      const val = BigInt(value);
      const nums = [];
      for (let abs = neg ? -val : val; abs; abs >>= _8n3)
        nums.push(Number(abs & U8_MAX));
      if (nums[nums.length - 1] >= 128)
        nums.push(neg ? 128 : 0);
      else if (neg)
        nums[nums.length - 1] |= 128;
      w.bytes(new Uint8Array(nums));
    },
    decodeStream: (r) => {
      const len = r.leftBytes;
      if (len > bytesLimit)
        throw new Error(`ScriptNum: number (${len}) bigger than limit=${bytesLimit}`);
      if (len === 0)
        return _0n9;
      const data = r.bytes(len);
      if (forceMinimal) {
        if ((data[len - 1] & 127) === 0) {
          if (len <= 1 || (data[len - 2] & 128) === 0)
            throw new Error("Non-minimally encoded ScriptNum");
        }
      }
      let res = _0n9;
      for (let i = 0; i < len; ++i)
        res |= BigInt(data[i]) << _8n3 * BigInt(i);
      if (data[len - 1] >= 128) {
        res &= _2n6 ** BigInt(len * 8) - _1n6 >> _1n6;
        res = -res;
      }
      return res;
    }
  });
}
function OpToNum(op, bytesLimit = 4, forceMinimal = true) {
  if (typeof op === "number")
    return op;
  if (isBytes5(op)) {
    try {
      const val = ScriptNum(bytesLimit, forceMinimal).decode(op);
      if (val > Number.MAX_SAFE_INTEGER || val < -Number.MAX_SAFE_INTEGER)
        return;
      return Number(val);
    } catch (e) {
      return;
    }
  }
  return;
}
var scriptPushLen = (op, read) => {
  if (!(OP.OP_0 < op && op <= OP.PUSHDATA4))
    return;
  if (op < OP.PUSHDATA1)
    return op;
  if (op === OP.PUSHDATA1)
    return read(1);
  if (op === OP.PUSHDATA2)
    return read(2);
  if (op === OP.PUSHDATA4)
    return read(4);
  throw new Error("Should be not possible");
};
var Script = /* @__PURE__ */ (() => Object.freeze(wrap({
  encodeStream: (w, value) => {
    aarray2(value, "value");
    for (let o of value) {
      if (typeof o === "string") {
        const op = OP[o];
        if (typeof op !== "number")
          throw new Error(`Unknown opcode=${o}`);
        w.byte(op);
        continue;
      } else if (typeof o === "number") {
        if (o === 0) {
          w.byte(0);
          continue;
        } else if (o === -1) {
          w.byte(OP["1NEGATE"]);
          continue;
        } else if (1 <= o && o <= 16) {
          w.byte(OP.OP_1 - 1 + o);
          continue;
        }
      }
      if (typeof o === "number")
        o = ScriptNum().encode(BigInt(o));
      abytes2(o, void 0, "value");
      const len = o.length;
      if (len < OP.PUSHDATA1)
        w.byte(len);
      else if (len <= 255) {
        w.byte(OP.PUSHDATA1);
        w.byte(len);
      } else if (len <= 65535) {
        w.byte(OP.PUSHDATA2);
        w.bytes(U16LE.encode(len));
      } else {
        w.byte(OP.PUSHDATA4);
        w.bytes(U32LE.encode(len));
      }
      w.bytes(o);
    }
  },
  decodeStream: (r) => {
    const out = [];
    while (!r.isEnd()) {
      const cur = r.byte();
      const len = scriptPushLen(cur, (bytes) => {
        if (bytes === 1)
          return U8.decodeStream(r);
        if (bytes === 2)
          return U16LE.decodeStream(r);
        return U32LE.decodeStream(r);
      });
      if (len !== void 0) {
        out.push(r.bytes(len));
      } else if (cur === 0) {
        out.push(0);
      } else if (OP.OP_1 <= cur && cur <= OP.OP_16) {
        out.push(cur - (OP.OP_1 - 1));
      } else {
        const op = OPNames[cur];
        if (op === void 0)
          throw new Error(`Unknown opcode=${cur.toString(16)}`);
        out.push(op);
      }
    }
    return out;
  }
})))();
var CompactSize = /* @__PURE__ */ (() => {
  const limits = {
    253: [253, 2, BigInt(253), BigInt(65535)],
    254: [254, 4, BigInt(65536), BigInt(4294967295)],
    255: [255, 8, BigInt(4294967296), BigInt("0xffffffffffffffff")]
  };
  const limitsList = Object.values(limits);
  return Object.freeze(wrap({
    encodeStream: (w, value) => {
      if (typeof value === "number")
        value = BigInt(value);
      if (_0n9 <= value && value <= COMPACT_DIRECT_MAX)
        return w.byte(Number(value));
      for (const [flag2, bytes, start, stop] of limitsList) {
        if (start > value || value > stop)
          continue;
        w.byte(flag2);
        for (let i = 0; i < bytes; i++)
          w.byte(Number(value >> _8n3 * BigInt(i) & U8_MAX));
        return;
      }
      throw w.err(`VarInt too big: ${value}`);
    },
    decodeStream: (r) => {
      const b0 = r.byte();
      if (b0 <= 252)
        return BigInt(b0);
      const [_, bytes, start] = limits[b0];
      let num2 = _0n9;
      for (let i = 0; i < bytes; i++)
        num2 |= BigInt(r.byte()) << _8n3 * BigInt(i);
      if (num2 < start)
        throw r.err(`Wrong CompactSize(${8 * bytes})`);
      return num2;
    }
  }));
})();
var CompactSizeLen = /* @__PURE__ */ (() => Object.freeze(apply(CompactSize, coders.numberBigint)))();
var _VarBytes = /* @__PURE__ */ (() => Object.freeze(createBytes(CompactSize)))();
var VarBytes = _VarBytes;
var _RawWitness = /* @__PURE__ */ (() => Object.freeze(array(CompactSizeLen, _VarBytes)))();
var RawWitness = _RawWitness;
var BTCArray = (t) => array(CompactSize, t);
var RawInput = /* @__PURE__ */ (() => Object.freeze(struct({
  txid: createBytes(32, true),
  // hash(prev_tx),
  index: U32LE,
  // output number of previous tx
  finalScriptSig: _VarBytes,
  // btc merges input and output script, executes it. If ok = tx passes
  sequence: U32LE
  // ?
})))();
var RawOutput = /* @__PURE__ */ (() => Object.freeze(struct({ amount: U64LE, script: _VarBytes })))();
var _RawTx = /* @__PURE__ */ (() => struct({
  version: I32LE,
  segwitFlag: flag(new Uint8Array([0, 1])),
  inputs: BTCArray(RawInput),
  outputs: BTCArray(RawOutput),
  // BIP144 does not encode a witness-count field; one RawWitness entry is
  // implied for each txin and follows the same order as inputs.
  witnesses: flagged("segwitFlag", array("inputs/length", _RawWitness)),
  // < 500000000	Block number at which this transaction is unlocked
  // >= 500000000	UNIX timestamp at which this transaction is unlocked
  // Handled as part of PSBTv2
  lockTime: U32LE
}))();
function validateRawTx(tx) {
  if (tx.segwitFlag && tx.witnesses && tx.witnesses.every((w) => !w.length))
    throw new Error("Segwit flag with only empty witness fields");
  return tx;
}
var RawTx = /* @__PURE__ */ (() => Object.freeze(validate(_RawTx, validateRawTx)))();
var RawOldTx = /* @__PURE__ */ (() => Object.freeze(struct({
  version: I32LE,
  inputs: BTCArray(RawInput),
  outputs: BTCArray(RawOutput),
  lockTime: U32LE
})))();

// node_modules/@scure/btc-signer/psbt.js
var unknowns = (mode, name) => {
  if (mode === true)
    return "ignore";
  if (mode === false)
    return "strip";
  if (mode === "ignore" || mode === "strip" || mode === "strict")
    return mode;
  throw new Error(`PSBT: invalid ${name} policy=${mode}`);
};
var _0n10 = /* @__PURE__ */ BigInt(0);
var _1n7 = /* @__PURE__ */ BigInt(1);
var PubKeyECDSA = /* @__PURE__ */ (() => validate(createBytes(null), (pub) => validatePubkey(pub, PubT.ecdsa)))();
var PubKeyECDSACompressed = /* @__PURE__ */ (() => validate(createBytes(33), (pub) => validatePubkey(pub, PubT.ecdsa)))();
var PubKeySchnorr = /* @__PURE__ */ (() => validate(createBytes(32), (pub) => validatePubkey(pub, PubT.schnorr)))();
var SignatureSchnorr = /* @__PURE__ */ (() => validate(createBytes(null), (sig) => {
  if (sig.length !== 64 && sig.length !== 65)
    throw new Error("Schnorr signature should be 64 or 65 bytes long");
  return sig;
}))();
var RawWitnessWire = RawWitness;
var BIP32Der = /* @__PURE__ */ (() => struct({
  fingerprint: U32BE,
  path: array(null, U32LE)
}))();
var TaprootBIP32Der = /* @__PURE__ */ (() => struct({
  hashes: array(CompactSizeLen, createBytes(32)),
  der: BIP32Der
}))();
var GlobalXPUB = /* @__PURE__ */ (() => validate(struct({
  version: U32BE,
  depth: U8,
  parentFingerprint: U32BE,
  childNumber: U32BE,
  chainCode: createBytes(32),
  // BIP32 serialization stores the public key as the final 33-byte `ser_P(K)` field and says
  // importing an extended public key must verify that point data corresponds to the curve.
  publicKey: PubKeyECDSACompressed
}), (xpub) => {
  if (xpub.depth === 0 && xpub.parentFingerprint !== 0)
    throw new Error("GlobalXPUB: depth=0 requires parentFingerprint=0");
  if (xpub.depth === 0 && xpub.childNumber !== 0)
    throw new Error("GlobalXPUB: depth=0 requires childNumber=0");
  return xpub;
}))();
var tapScriptSigKey = /* @__PURE__ */ (() => struct({ pubKey: PubKeySchnorr, leafHash: createBytes(32) }))();
var _TaprootControlBlock = /* @__PURE__ */ (() => struct({
  version: U8,
  // With parity :(
  internalKey: createBytes(32),
  merklePath: array(null, createBytes(32))
}))();
var TaprootControlBlock = /* @__PURE__ */ (() => Object.freeze(validate(_TaprootControlBlock, (cb) => {
  if (cb.merklePath.length > 128)
    throw new Error("TaprootControlBlock: merklePath should be of length 0..128 (inclusive)");
  return cb;
})))();
var tapTree = /* @__PURE__ */ (() => validate(array(null, struct({
  depth: U8,
  version: U8,
  script: VarBytes
})), (tree) => {
  if (tree.length < 1)
    throw new Error("tapTree: expected at least one tuple");
  let path = Array(tree[0].depth).fill(0);
  let maxDepth = tree[0].depth;
  for (let i = 1; i < tree.length; i++) {
    const { depth } = tree[i];
    if (depth > maxDepth)
      maxDepth = depth;
    let j = path.length - 1;
    while (j >= 0 && path[j] === 1)
      j--;
    if (j < 0)
      throw new Error("tapTree: tuples must be in DFS order");
    const next = path.slice(0, j);
    next.push(1);
    if (depth < next.length)
      throw new Error("tapTree: tuples must be in DFS order");
    while (next.length < depth)
      next.push(0);
    path = next;
  }
  let leaves = _0n10;
  for (let i = 0; i < tree.length; i++)
    leaves += _1n7 << BigInt(maxDepth - tree[i].depth);
  if (leaves !== _1n7 << BigInt(maxDepth))
    throw new Error("tapTree: tuples must describe a complete binary tree");
  return tree;
}))();
var BytesInf = /* @__PURE__ */ createBytes(null);
var ProprietaryKey = /* @__PURE__ */ (() => {
  const suffix = struct({
    identifier: createBytes(CompactSizeLen),
    subtype: CompactSizeLen,
    data: BytesInf
  });
  return validate(BytesInf, (key) => {
    try {
      suffix.decode(key);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Proprietary key: expected BIP174 identifier and subtype, got ${message}`);
    }
    return key;
  });
})();
var Bytes20 = /* @__PURE__ */ createBytes(20);
var Bytes32 = /* @__PURE__ */ createBytes(32);
var Bytes64 = /* @__PURE__ */ createBytes(64);
var Bytes66 = /* @__PURE__ */ createBytes(66);
var MuSig2Participants = /* @__PURE__ */ (() => array(null, PubKeyECDSACompressed))();
var MuSig2Key = /* @__PURE__ */ (() => apply(BytesInf, {
  decode: (key) => {
    const _key = key;
    return concatBytes(PubKeyECDSACompressed.encode(_key.participantPubkey), PubKeyECDSACompressed.encode(_key.aggregatePubkey), _key.leafHash === void 0 ? EMPTY : Bytes32.encode(_key.leafHash));
  },
  encode: (raw) => {
    const _raw = raw;
    if (_raw.length !== 66 && _raw.length !== 98)
      throw new Error(`MuSig2 key: expected 66 or 98 bytes, got ${_raw.length}`);
    const key = {
      participantPubkey: PubKeyECDSACompressed.decode(_raw.subarray(0, 33)),
      aggregatePubkey: PubKeyECDSACompressed.decode(_raw.subarray(33, 66))
    };
    if (_raw.length === 98)
      key.leafHash = Bytes32.decode(_raw.subarray(66));
    return key;
  }
}))();
var SilentPaymentInfo = /* @__PURE__ */ (() => struct({ scanKey: PubKeyECDSACompressed, spendKey: PubKeyECDSACompressed }))();
var DNSSECProof = /* @__PURE__ */ (() => struct({ name: createBytes(U8), proof: BytesInf }))();
var PSBTInfo = (type, kc, vc, reqInc, allowInc, silentIgnore) => /* @__PURE__ */ Object.freeze([
  type,
  kc && typeof kc === "object" ? Object.freeze(kc) : kc,
  vc && typeof vc === "object" ? Object.freeze(vc) : vc,
  Object.freeze([...reqInc]),
  Object.freeze([...allowInc]),
  silentIgnore
]);
var PSBTGlobal = /* @__PURE__ */ (() => Object.freeze({
  unsignedTx: PSBTInfo(0, false, RawOldTx, [0], [0], false),
  // BIP174 also requires the serialized xpub depth to match the number of path elements in the
  // paired derivation value, so callers still need that cross-field check above this raw table.
  xpub: PSBTInfo(1, GlobalXPUB, BIP32Der, [], [0, 2], false),
  txVersion: PSBTInfo(2, false, U32LE, [2], [2], false),
  fallbackLocktime: PSBTInfo(3, false, U32LE, [], [2], false),
  inputCount: PSBTInfo(4, false, CompactSizeLen, [2], [2], false),
  outputCount: PSBTInfo(5, false, CompactSizeLen, [2], [2], false),
  // TODO: bitfield
  txModifiable: PSBTInfo(6, false, U8, [], [2], false),
  // These assigned extension fields must not fall through the unknown-field policy.
  spEcdhShare: PSBTInfo(7, PubKeyECDSACompressed, PubKeyECDSACompressed, [], [2], false),
  spDleq: PSBTInfo(8, PubKeyECDSACompressed, Bytes64, [], [2], false),
  genericSignedMessage: PSBTInfo(9, false, BytesInf, [], [0, 2], false),
  version: PSBTInfo(251, false, U32LE, [], [0, 2], false),
  proprietary: PSBTInfo(252, ProprietaryKey, BytesInf, [], [0, 2], false)
}))();
var PSBTInput = /* @__PURE__ */ (() => Object.freeze({
  nonWitnessUtxo: PSBTInfo(0, false, RawTx, [], [0, 2], false),
  witnessUtxo: PSBTInfo(1, false, RawOutput, [], [0, 2], false),
  partialSig: PSBTInfo(2, PubKeyECDSA, BytesInf, [], [0, 2], false),
  sighashType: PSBTInfo(3, false, U32LE, [], [0, 2], false),
  redeemScript: PSBTInfo(4, false, BytesInf, [], [0, 2], false),
  witnessScript: PSBTInfo(5, false, BytesInf, [], [0, 2], false),
  bip32Derivation: PSBTInfo(6, PubKeyECDSA, BIP32Der, [], [0, 2], false),
  finalScriptSig: PSBTInfo(7, false, BytesInf, [], [0, 2], false),
  finalScriptWitness: PSBTInfo(8, false, RawWitnessWire, [], [0, 2], false),
  porCommitment: PSBTInfo(9, false, BytesInf, [], [0, 2], false),
  ripemd160: PSBTInfo(10, Bytes20, BytesInf, [], [0, 2], false),
  sha256: PSBTInfo(11, Bytes32, BytesInf, [], [0, 2], false),
  hash160: PSBTInfo(12, Bytes20, BytesInf, [], [0, 2], false),
  hash256: PSBTInfo(13, Bytes32, BytesInf, [], [0, 2], false),
  // BIP174/BIP370 serialize PREVIOUS_TXID in standard byte order, while the rest of this repo
  // historically keeps TransactionInput.txid in display-order bytes matching `Transaction.id`.
  // Reverse at this PSBTv2 boundary so internal txid semantics stay aligned with the raw-tx path.
  txid: PSBTInfo(14, false, createBytes(32, true), [2], [2], true),
  index: PSBTInfo(15, false, U32LE, [2], [2], true),
  sequence: PSBTInfo(16, false, U32LE, [], [2], true),
  requiredTimeLocktime: PSBTInfo(17, false, U32LE, [], [2], false),
  requiredHeightLocktime: PSBTInfo(18, false, U32LE, [], [2], false),
  tapKeySig: PSBTInfo(19, false, SignatureSchnorr, [], [0, 2], false),
  tapScriptSig: PSBTInfo(20, tapScriptSigKey, SignatureSchnorr, [], [0, 2], false),
  tapLeafScript: PSBTInfo(21, TaprootControlBlock, BytesInf, [], [0, 2], false),
  // BIP371 key data here is a 32-byte x-only pubkey, so reuse the shared Schnorr pubkey coder
  // instead of accepting arbitrary 32-byte blobs that only fail much later in taproot flows.
  tapBip32Derivation: PSBTInfo(22, PubKeySchnorr, TaprootBIP32Der, [], [0, 2], false),
  tapInternalKey: PSBTInfo(23, false, PubKeySchnorr, [], [0, 2], false),
  tapMerkleRoot: PSBTInfo(24, false, Bytes32, [], [0, 2], false),
  p2cKeyTweak: PSBTInfo(25, PubKeyECDSACompressed, Bytes32, [], [0, 2], false),
  musig2ParticipantPubkeys: PSBTInfo(26, PubKeyECDSACompressed, MuSig2Participants, [], [0, 2], false),
  musig2PubNonce: PSBTInfo(27, MuSig2Key, Bytes66, [], [0, 2], false),
  musig2PartialSig: PSBTInfo(28, MuSig2Key, Bytes32, [], [0, 2], false),
  spEcdhShare: PSBTInfo(29, PubKeyECDSACompressed, PubKeyECDSACompressed, [], [2], false),
  spDleq: PSBTInfo(30, PubKeyECDSACompressed, Bytes64, [], [2], false),
  spSpendBip32Derivation: PSBTInfo(31, PubKeyECDSACompressed, BIP32Der, [], [2], false),
  spTweak: PSBTInfo(32, false, Bytes32, [], [2], false),
  proprietary: PSBTInfo(252, ProprietaryKey, BytesInf, [], [0, 2], false)
}))();
var PSBTInputFinalKeys = /* @__PURE__ */ Object.freeze([
  // PSBTv2 extractors rebuild the final transaction from per-input fields, so
  // finalized inputs still need txid/index, any non-default sequence, and locktime requirements
  // even though BIP174's generic cleanup is stricter.
  "txid",
  "sequence",
  "index",
  "witnessUtxo",
  "nonWitnessUtxo",
  "requiredTimeLocktime",
  "requiredHeightLocktime",
  "finalScriptSig",
  "finalScriptWitness",
  "unknown"
]);
var PSBTInputSignatureKeys = /* @__PURE__ */ Object.freeze([
  "partialSig",
  "finalScriptSig",
  "finalScriptWitness",
  "tapKeySig",
  "tapScriptSig"
]);
var PSBTOutput = /* @__PURE__ */ (() => Object.freeze({
  redeemScript: PSBTInfo(0, false, BytesInf, [], [0, 2], false),
  witnessScript: PSBTInfo(1, false, BytesInf, [], [0, 2], false),
  bip32Derivation: PSBTInfo(2, PubKeyECDSA, BIP32Der, [], [0, 2], false),
  // BIP174/BIP370 serialize PSBT_OUT_AMOUNT as a signed int64 on the wire; semantic output
  // validity still rejects negative transaction amounts in `PSBTOutputCoder` below.
  amount: PSBTInfo(3, false, I64LE, [2], [2], true),
  script: PSBTInfo(4, false, BytesInf, [2], [2], true),
  tapInternalKey: PSBTInfo(5, false, PubKeySchnorr, [], [0, 2], false),
  // BIP371 expects a non-empty DFS-ordered list of tapleaf tuples here so wallets can
  // reconstruct the same Taproot tree, not just an arbitrary list of serialized leaves.
  tapTree: PSBTInfo(6, false, tapTree, [], [0, 2], false),
  tapBip32Derivation: PSBTInfo(7, PubKeySchnorr, TaprootBIP32Der, [], [0, 2], false),
  musig2ParticipantPubkeys: PSBTInfo(8, PubKeyECDSACompressed, MuSig2Participants, [], [0, 2], false),
  spV0Info: PSBTInfo(9, false, SilentPaymentInfo, [], [2], false),
  spV0Label: PSBTInfo(10, false, U32LE, [], [2], false),
  dnssecProof: PSBTInfo(53, false, DNSSECProof, [], [0, 2], false),
  proprietary: PSBTInfo(252, ProprietaryKey, BytesInf, [], [0, 2], false)
}))();
var PSBTOutputUnsignedKeys = /* @__PURE__ */ Object.freeze([]);
var PSBTKeyPair = /* @__PURE__ */ (() => array(NULL, struct({
  //  <key> := <keylen> <keytype> <keydata> WHERE keylen = len(keytype)+len(keydata)
  key: prefix(CompactSizeLen, struct({ type: CompactSizeLen, key: createBytes(null) })),
  //  <value> := <valuelen> <valuedata>
  value: createBytes(CompactSizeLen)
})))();
function PSBTKeyInfo(info) {
  const [type, kc, vc, reqInc, allowInc, silentIgnore] = info;
  return { type, kc, vc, reqInc, allowInc, silentIgnore };
}
var PSBTUnknownKey = /* @__PURE__ */ (() => (
  // Raw unknown/proprietary field key: compact-size keytype plus opaque keydata for pass-through.
  struct({ type: CompactSizeLen, key: createBytes(null) })
))();
function PSBTKeyMap(psbtEnum) {
  const byType = {};
  for (const k in psbtEnum) {
    const [num2, kc, vc] = psbtEnum[k];
    byType[num2] = [k, kc, vc];
  }
  return wrap({
    encodeStream: (w, value) => {
      const _value = value;
      let out = [];
      const seen = {};
      const add2 = (key, value2) => {
        const _value2 = value2;
        const kStr = hex.encode(PSBTUnknownKey.encode(key));
        if (seen[kStr])
          throw new Error(`PSBT: duplicate key=${kStr}`);
        seen[kStr] = true;
        out.push({ key, value: _value2 });
      };
      for (const name in psbtEnum) {
        const val = _value[name];
        if (val === void 0)
          continue;
        const [type, kc, vc] = psbtEnum[name];
        if (!kc) {
          add2({ type, key: EMPTY }, vc.encode(val));
        } else {
          const kv = val.map(([k, v]) => [
            kc.encode(k),
            vc.encode(v)
          ]);
          kv.sort((a, b) => compareBytes(a[0], b[0]));
          for (const [key, value2] of kv)
            add2({ key, type }, value2);
        }
      }
      if (_value.unknown) {
        _value.unknown.sort((a, b) => compareBytes(a[0].key, b[0].key));
        for (const [k, v] of _value.unknown)
          add2(k, v);
      }
      PSBTKeyPair.encodeStream(w, out);
    },
    decodeStream: (r) => {
      const raw = PSBTKeyPair.decodeStream(r);
      const out = {};
      const noKey = {};
      const seen = {};
      for (const elm of raw) {
        const kStr = hex.encode(PSBTUnknownKey.encode(elm.key));
        if (seen[kStr])
          throw new Error(`PSBT: duplicate key=${kStr}`);
        seen[kStr] = true;
        let name = "unknown";
        let key = elm.key.key;
        let value = elm.value;
        if (byType[elm.key.type]) {
          const [_name, kc, vc] = byType[elm.key.type];
          name = _name;
          if (!kc && key.length) {
            throw new Error(`PSBT: Non-empty key for ${name} (key=${hex.encode(key)} value=${hex.encode(value)}`);
          }
          key = kc ? kc.decode(key) : void 0;
          value = vc.decode(value);
          if (!kc) {
            if (out[name])
              throw new Error(`PSBT: Same keys: ${name} (key=${key} value=${value})`);
            out[name] = value;
            noKey[name] = true;
            continue;
          }
        } else {
          key = { type: elm.key.type, key: elm.key.key };
        }
        if (noKey[name])
          throw new Error(`PSBT: Key type with empty key and no key=${name} val=${value}`);
        if (!out[name])
          out[name] = [];
        out[name].push([key, value]);
      }
      return out;
    }
  });
}
var PSBTInputCoder = /* @__PURE__ */ (() => Object.freeze(validate(PSBTKeyMap(PSBTInput), (i) => {
  if (i.finalScriptWitness && !i.finalScriptWitness.length)
    throw new Error("validateInput: empty finalScriptWitness");
  if (i.partialSig && !i.partialSig.length)
    throw new Error("Empty partialSig");
  if (i.partialSig)
    for (const [k] of i.partialSig)
      validatePubkey(k, PubT.ecdsa);
  if (i.bip32Derivation)
    for (const [k] of i.bip32Derivation)
      validatePubkey(k, PubT.ecdsa);
  if (i.requiredTimeLocktime !== void 0 && i.requiredTimeLocktime < 5e8)
    throw new Error(`validateInput: wrong timeLocktime=${i.requiredTimeLocktime}`);
  if (i.requiredHeightLocktime !== void 0 && (i.requiredHeightLocktime <= 0 || i.requiredHeightLocktime >= 5e8))
    throw new Error(`validateInput: wrong heighLocktime=${i.requiredHeightLocktime}`);
  if (i.tapLeafScript) {
    for (const [k, v] of i.tapLeafScript) {
      if ((k.version & 254) !== v[v.length - 1])
        throw new Error("validateInput: tapLeafScript version mimatch");
      if (v[v.length - 1] & 1)
        throw new Error("validateInput: tapLeafScript version has parity bit!");
    }
  }
  return i;
})))();
var PSBTOutputCoder = /* @__PURE__ */ (() => Object.freeze(validate(PSBTKeyMap(PSBTOutput), (o) => {
  if (o.amount !== void 0 && o.amount < _0n10)
    throw new Error(`validateOutput: wrong amount=${o.amount}`);
  if (o.bip32Derivation)
    for (const [k] of o.bip32Derivation)
      validatePubkey(k, PubT.ecdsa);
  return o;
})))();
var PSBTGlobalCoder = /* @__PURE__ */ (() => validate(PSBTKeyMap(PSBTGlobal), (g) => {
  const version = g.version || 0;
  if (version === 0) {
    if (!g.unsignedTx)
      throw new Error("PSBTv0: missing unsignedTx");
    for (const inp of g.unsignedTx.inputs)
      if (inp.finalScriptSig && inp.finalScriptSig.length)
        throw new Error("PSBTv0: input scriptSig found in unsignedTx");
  }
  for (const [xpub, der] of g.xpub || []) {
    if (xpub.depth !== der.path.length)
      throw new Error(`PSBT_GLOBAL_XPUB: xpub depth=${xpub.depth} must match derivation path length=${der.path.length}`);
  }
  return g;
}))();
var _RawPSBTV0 = /* @__PURE__ */ (() => Object.freeze(struct({
  magic: magic(string(new Uint8Array([255])), "psbt"),
  global: PSBTGlobalCoder,
  // Raw v0 framing follows the unsigned transaction for input-map count; the stricter
  // one-map-per-input/output reconciliation happens in `RawPSBTV0` / `validatePSBT`.
  inputs: array("global/unsignedTx/inputs/length", PSBTInputCoder),
  outputs: array(null, PSBTOutputCoder)
})))();
var _RawPSBTV2 = /* @__PURE__ */ (() => Object.freeze(struct({
  magic: magic(string(new Uint8Array([255])), "psbt"),
  global: PSBTGlobalCoder,
  // Raw v2 framing takes map counts from the global PSBTv2 count fields; deeper version
  // and per-field validation still happens in `RawPSBTV2` / `validatePSBT`.
  inputs: array("global/inputCount", PSBTInputCoder),
  outputs: array("global/outputCount", PSBTOutputCoder)
})))();
function validatePSBTFields(version, info, lst) {
  const _lst = lst;
  for (const k in _lst) {
    if (k === "unknown")
      continue;
    if (!info[k])
      continue;
    const { allowInc } = PSBTKeyInfo(info[k]);
    if (!allowInc.includes(version))
      throw new Error(`PSBTv${version}: field ${k} is not allowed`);
  }
  for (const k in info) {
    const { reqInc } = PSBTKeyInfo(info[k]);
    if (reqInc.includes(version) && _lst[k] === void 0)
      throw new Error(`PSBTv${version}: missing required field ${k}`);
  }
}
function cleanPSBTFields(version, info, lst) {
  anumber(version, "version");
  validateObject2(info, {}, {}, "info");
  validateObject2(lst, {}, {}, "lst");
  const _lst = lst;
  const out = {};
  for (const _k in _lst) {
    const k = _k;
    if (k !== "unknown") {
      if (!info[k])
        continue;
      const { allowInc, silentIgnore } = PSBTKeyInfo(info[k]);
      if (!allowInc.includes(version)) {
        if (silentIgnore)
          continue;
        throw new Error(`Failed to serialize in PSBTv${version}: ${k} but versions allows inclusion=${allowInc}`);
      }
    }
    out[k] = _lst[k];
  }
  return out;
}
function validatePSBT(tx) {
  const version = tx && tx.global && tx.global.version || 0;
  validatePSBTFields(version, PSBTGlobal, tx.global);
  for (const i of tx.inputs)
    validatePSBTFields(version, PSBTInput, i);
  for (const o of tx.outputs)
    validatePSBTFields(version, PSBTOutput, o);
  const inputCount = !version ? tx.global.unsignedTx.inputs.length : tx.global.inputCount;
  if (tx.inputs.length !== inputCount)
    throw new Error(`Wrong number of input maps=${tx.inputs.length}, expected=${inputCount}`);
  const outputCount = !version ? tx.global.unsignedTx.outputs.length : tx.global.outputCount;
  if (tx.outputs.length < outputCount)
    throw new Error("Not outputs inputs");
  const hasBip174InputMap = version === 0 && inputCount === 0 && Object.keys(tx.outputs[0] || {}).length === 0 && (outputCount > 0 && tx.outputs.length === outputCount + 1 || outputCount === 0 && tx.outputs.length === 2 && Object.keys(tx.outputs[1]).length === 0);
  if (hasBip174InputMap)
    return tx;
  const outputsLeft = tx.outputs.slice(outputCount);
  if (outputsLeft.length > 1 || outputsLeft.length && (version !== 0 || Object.keys(outputsLeft[0]).length))
    throw new Error(`Unexpected outputs left in tx=${outputsLeft}`);
  return tx;
}
function mergeKeyMap(psbtEnum, val, cur, allowedFields, unknown = "strip", proprietary = "strip") {
  validateObject2(psbtEnum, {}, {}, "psbtEnum");
  validateObject2(val, {}, {}, "val");
  if (cur !== void 0)
    validateObject2(cur, {}, {}, "cur");
  if (allowedFields !== void 0)
    aarray2(allowedFields, "allowedFields");
  const _val = val;
  const _cur = cur;
  const _allowedFields = allowedFields;
  const unknownMode = unknowns(unknown, "unknown");
  const proprietaryMode = unknowns(proprietary, "proprietary");
  for (const [name, mode] of [
    ["unknown", unknownMode],
    ["proprietary", proprietaryMode]
  ]) {
    if (mode !== "strict")
      continue;
    if (_val[name]?.length || _cur?.[name]?.length)
      throw new Error(`PSBT: ${name} PSBT field is not allowed in strict mode`);
  }
  const res = { ..._cur, ..._val };
  for (const k in psbtEnum) {
    const key = k;
    if (k === "proprietary" && proprietaryMode !== "ignore")
      continue;
    const [_, kC, vC] = psbtEnum[key];
    const cannotChange = _allowedFields && !_allowedFields.includes(k);
    if (_val[k] === void 0 && k in _val) {
      if (cannotChange)
        throw new Error(`Cannot remove signed field=${k}`);
      delete res[k];
    } else if (kC) {
      const oldKV = _cur && _cur[k] ? _cur[k] : [];
      let newKV = _val[key];
      if (newKV) {
        if (!Array.isArray(newKV))
          throw new Error(`keyMap(${k}): KV pairs should be [k, v][]`);
        newKV = newKV.map((val2) => {
          if (val2.length !== 2)
            throw new Error(`keyMap(${k}): KV pairs should be [k, v][]`);
          return [
            typeof val2[0] === "string" ? kC.decode(hex.decode(val2[0])) : val2[0],
            typeof val2[1] === "string" ? vC.decode(hex.decode(val2[1])) : val2[1]
          ];
        });
        const map = {};
        const add2 = (kStr, k2, v) => {
          if (map[kStr] === void 0) {
            map[kStr] = [k2, v];
            return;
          }
          const oldVal = hex.encode(vC.encode(map[kStr][1]));
          const newVal = hex.encode(vC.encode(v));
          if (oldVal !== newVal)
            throw new Error(`keyMap(${key}): same key=${kStr} oldVal=${oldVal} newVal=${newVal}`);
        };
        for (const [k2, v] of oldKV) {
          const kStr = hex.encode(kC.encode(k2));
          add2(kStr, k2, v);
        }
        for (const [k2, v] of newKV) {
          const kStr = hex.encode(kC.encode(k2));
          if (v === void 0) {
            if (cannotChange)
              throw new Error(`Cannot remove signed field=${key}/${k2}`);
            delete map[kStr];
          } else {
            if (cannotChange && map[kStr] === void 0)
              throw new Error(`Cannot add signed field=${key}/${kStr}`);
            add2(kStr, k2, v);
          }
        }
        res[key] = Object.values(map);
      }
    } else {
      if (typeof res[k] === "string")
        res[k] = vC.decode(hex.decode(res[k]));
      if (cannotChange && k in _val) {
        if (!_cur || _cur[k] === void 0)
          throw new Error(`Cannot add signed field=${k}`);
        let current = _cur[k];
        if (typeof current === "string")
          current = vC.decode(hex.decode(current));
        if (!equalBytes2(vC.encode(res[k]), vC.encode(current)))
          throw new Error(`Cannot change signed field=${k}`);
      }
    }
  }
  if (unknownMode === "ignore" && _val.unknown) {
    const map = {};
    for (const [k, v] of _cur?.unknown || [])
      map[hex.encode(PSBTUnknownKey.encode(k))] = [k, v];
    for (const [k, v] of _val.unknown) {
      const kStr = hex.encode(PSBTUnknownKey.encode(k));
      if (map[kStr] === void 0) {
        map[kStr] = [k, v];
        continue;
      }
      const oldVal = hex.encode(BytesInf.encode(map[kStr][1]));
      const newVal = hex.encode(BytesInf.encode(v));
      if (oldVal !== newVal)
        throw new Error(`keyMap(unknown): same key=${kStr} oldVal=${oldVal} newVal=${newVal}`);
    }
    res.unknown = Object.values(map);
  }
  for (const k in res) {
    if (!psbtEnum[k]) {
      if (unknownMode === "ignore" && k === "unknown")
        continue;
      delete res[k];
    }
  }
  if (unknownMode !== "ignore")
    delete res.unknown;
  if (proprietaryMode !== "ignore")
    delete res.proprietary;
  return res;
}
function combineKeyMap(psbtEnum, current, other, unknown = "strip", proprietary = "strip") {
  validateObject2(psbtEnum, {}, {}, "psbtEnum");
  validateObject2(current, {}, {}, "current");
  validateObject2(other, {}, {}, "other");
  const _current = current;
  const _other = other;
  for (const k in psbtEnum) {
    const key = k;
    const [_, keyCoder, valueCoder] = psbtEnum[key];
    if (keyCoder || _current[key] === void 0 || _other[key] === void 0)
      continue;
    let a = _current[key];
    let b = _other[key];
    if (typeof a === "string")
      a = valueCoder.decode(hex.decode(a));
    if (typeof b === "string")
      b = valueCoder.decode(hex.decode(b));
    if (!equalBytes2(valueCoder.encode(a), valueCoder.encode(b)))
      throw new Error(`Cannot combine conflicting field=${k}`);
  }
  return mergeKeyMap(psbtEnum, _other, _current, void 0, unknown, proprietary);
}
var RawPSBTV0 = /* @__PURE__ */ (() => Object.freeze(validate(_RawPSBTV0, validatePSBT)))();
var RawPSBTV2 = /* @__PURE__ */ (() => Object.freeze(validate(_RawPSBTV2, validatePSBT)))();

// node_modules/@scure/btc-signer/payment.js
var P2A_PROGRAM = /* @__PURE__ */ Uint8Array.from([78, 115]);
var OutP2A = {
  encode(from) {
    if (from.length !== 2 || from[0] !== 1 || !isBytes5(from[1]) || !equalBytes2(from[1], P2A_PROGRAM))
      return;
    return { type: "p2a", script: Script.encode(from) };
  },
  decode: (to) => {
    if (to.type !== "p2a")
      return;
    return [1, Uint8Array.from(P2A_PROGRAM)];
  }
};
function isValidPubkey(pub, type) {
  try {
    validatePubkey(pub, type);
    return true;
  } catch (e) {
    return false;
  }
}
var OutPK = {
  encode(from) {
    if (from.length !== 2 || !isBytes5(from[0]) || !isValidPubkey(from[0], PubT.ecdsa) || from[1] !== "CHECKSIG")
      return;
    return { type: "pk", pubkey: from[0] };
  },
  decode: (to) => {
    if (to.type !== "pk")
      return;
    return [to.pubkey, "CHECKSIG"];
  }
};
var OutPKH = {
  encode(from) {
    if (from.length !== 5 || from[0] !== "DUP" || from[1] !== "HASH160" || !isBytes5(from[2]))
      return;
    if (from[2].length !== 20)
      return;
    if (from[3] !== "EQUALVERIFY" || from[4] !== "CHECKSIG")
      return;
    return { type: "pkh", hash: from[2] };
  },
  // OutScript validates `pkh.hash` before this branch emits the canonical
  // `DUP HASH160 <hash> EQUALVERIFY CHECKSIG` script.
  decode: (to) => to.type === "pkh" ? ["DUP", "HASH160", to.hash, "EQUALVERIFY", "CHECKSIG"] : void 0
};
var OutSH = {
  encode(from) {
    if (from.length !== 3 || from[0] !== "HASH160" || !isBytes5(from[1]) || from[2] !== "EQUAL")
      return;
    if (from[1].length !== 20)
      return;
    return { type: "sh", hash: from[1] };
  },
  // OutScript validates `sh.hash` before this branch emits the canonical
  // `HASH160 <hash> EQUAL` script.
  decode: (to) => to.type === "sh" ? ["HASH160", to.hash, "EQUAL"] : void 0
};
var OutWSH = {
  encode(from) {
    if (from.length !== 2 || from[0] !== 0 || !isBytes5(from[1]))
      return;
    if (from[1].length !== 32)
      return;
    return { type: "wsh", hash: from[1] };
  },
  // OutScript validates `wsh.hash` before this branch emits the canonical
  // version-0 32-byte witness program.
  decode: (to) => to.type === "wsh" ? [0, to.hash] : void 0
};
var OutWPKH = {
  encode(from) {
    if (from.length !== 2 || from[0] !== 0 || !isBytes5(from[1]))
      return;
    if (from[1].length !== 20)
      return;
    return { type: "wpkh", hash: from[1] };
  },
  // OutScript validates `wpkh.hash` before this branch emits the canonical
  // version-0 20-byte witness program.
  decode: (to) => to.type === "wpkh" ? [0, to.hash] : void 0
};
var OutMS = {
  encode(from) {
    const last = from.length - 1;
    if (from[last] !== "CHECKMULTISIG")
      return;
    const m = from[0];
    const n = from[last - 1];
    if (typeof m !== "number" || typeof n !== "number")
      return;
    const pubkeys = from.slice(1, -2);
    if (n !== pubkeys.length)
      return;
    for (const pub of pubkeys)
      if (!isBytes5(pub) || !isValidPubkey(pub, PubT.ecdsa))
        return;
    if (!Number.isSafeInteger(m) || m < 1 || m > n)
      return;
    return { type: "ms", m, pubkeys };
  },
  // checkmultisig(n, ..pubkeys, m)
  decode: (to) => (
    // OutScript validates multisig pubkeys and `0 < m <= n <= 16`.
    // This branch only emits the canonical `m <pubkeys...> n CHECKMULTISIG`
    // script.
    to.type === "ms" ? [to.m, ...to.pubkeys, to.pubkeys.length, "CHECKMULTISIG"] : void 0
  )
};
var OutTR = {
  encode(from) {
    if (from.length !== 2 || from[0] !== 1 || !isBytes5(from[1]) || from[1].length !== 32)
      return;
    if (!isValidPubkey(from[1], PubT.schnorr))
      return;
    return { type: "tr", pubkey: from[1] };
  },
  // OutScript validates `tr.pubkey` before this branch emits the canonical
  // version-1 32-byte witness program.
  decode: (to) => to.type === "tr" ? [1, to.pubkey] : void 0
};
var OutTRNS = {
  encode(from) {
    const last = from.length - 1;
    if (from[last] !== "CHECKSIG")
      return;
    const pubkeys = [];
    for (let i = 0; i < last; i++) {
      const elm = from[i];
      if (i & 1) {
        if (elm !== "CHECKSIGVERIFY" || i === last - 1)
          return;
        continue;
      }
      if (!isBytes5(elm) || !isValidPubkey(elm, PubT.schnorr))
        return;
      pubkeys.push(elm);
    }
    if (!pubkeys.length || pubkeys.length > 999)
      return;
    return { type: "tr_ns", pubkeys };
  },
  decode: (to) => {
    if (to.type !== "tr_ns")
      return;
    const out = [];
    for (let i = 0; i < to.pubkeys.length - 1; i++)
      out.push(to.pubkeys[i], "CHECKSIGVERIFY");
    out.push(to.pubkeys[to.pubkeys.length - 1], "CHECKSIG");
    return out;
  }
};
var OutTRMS = {
  encode(from) {
    const last = from.length - 1;
    if (from[last] !== "NUMEQUAL" || from[1] !== "CHECKSIG")
      return;
    const pubkeys = [];
    const m = OpToNum(from[last - 1]);
    if (typeof m !== "number")
      return;
    for (let i = 0; i < last - 1; i++) {
      const elm = from[i];
      if (i & 1) {
        if (elm !== (i === 1 ? "CHECKSIG" : "CHECKSIGADD"))
          return;
        continue;
      }
      if (!isBytes5(elm) || !isValidPubkey(elm, PubT.schnorr))
        return;
      pubkeys.push(elm);
    }
    if (!Number.isSafeInteger(m) || m < 1 || m > pubkeys.length || pubkeys.length > 999)
      return;
    return { type: "tr_ms", pubkeys, m };
  },
  decode: (to) => {
    if (to.type !== "tr_ms")
      return;
    const out = [to.pubkeys[0], "CHECKSIG"];
    for (let i = 1; i < to.pubkeys.length; i++)
      out.push(to.pubkeys[i], "CHECKSIGADD");
    out.push(to.m, "NUMEQUAL");
    return out;
  }
};
var OutUnknown = {
  encode(from) {
    return { type: "unknown", script: Script.encode(from) };
  },
  decode: (to) => (
    // This reparses `unknown.script` through the semantic Script codec, so raw
    // bytes must still be syntactically parseable and may canonicalize on re-encode.
    to.type === "unknown" ? Script.decode(to.script) : void 0
  )
};
var OutScripts = /* @__PURE__ */ (() => [
  // Order is semantic: specific structured coders run first and the catch-all
  // unknown fallback must stay last.
  OutP2A,
  OutPK,
  OutPKH,
  OutSH,
  OutWSH,
  OutWPKH,
  OutMS,
  OutTR,
  OutTRNS,
  OutTRMS,
  OutUnknown
])();
var _OutScript = /* @__PURE__ */ (() => apply(Script, coders.match(OutScripts)))();
var OutScript = /* @__PURE__ */ (() => Object.freeze(validate(_OutScript, (i) => {
  if (i.type === "pk" && !isValidPubkey(i.pubkey, PubT.ecdsa))
    throw new Error("OutScript/pk: wrong key");
  if ((i.type === "pkh" || i.type === "sh" || i.type === "wpkh") && (!isBytes5(i.hash) || i.hash.length !== 20))
    throw new Error(`OutScript/${i.type}: wrong hash`);
  if (i.type === "wsh" && (!isBytes5(i.hash) || i.hash.length !== 32))
    throw new Error(`OutScript/wsh: wrong hash`);
  if (i.type === "tr" && (!isBytes5(i.pubkey) || !isValidPubkey(i.pubkey, PubT.schnorr)))
    throw new Error("OutScript/tr: wrong taproot public key");
  if (i.type === "ms" || i.type === "tr_ns" || i.type === "tr_ms") {
    if (!Array.isArray(i.pubkeys))
      throw new Error("OutScript/multisig: wrong pubkeys array");
  }
  if (i.type === "ms") {
    const n = i.pubkeys.length;
    for (const p of i.pubkeys)
      if (!isValidPubkey(p, PubT.ecdsa))
        throw new Error("OutScript/multisig: wrong pubkey");
    anumber(i.m, "m");
    if (i.m <= 0 || n > 16 || i.m > n)
      throw new Error("OutScript/multisig: invalid params");
  }
  if (i.type === "tr_ns" || i.type === "tr_ms") {
    const n = i.pubkeys.length;
    if (n > 999)
      throw new Error(`OutScript/${i.type}: invalid params`);
    for (const p of i.pubkeys)
      if (!isValidPubkey(p, PubT.schnorr))
        throw new Error(`OutScript/${i.type}: wrong pubkey`);
  }
  if (i.type === "tr_ms") {
    const n = i.pubkeys.length;
    anumber(i.m, "m");
    if (i.m <= 0 || i.m > n)
      throw new Error("OutScript/tr_ms: invalid params");
  }
  return i;
})))();
var _WitnessOutScript = /* @__PURE__ */ (() => Object.freeze(wrap({
  encodeStream: (w, value) => OutScript.encodeStream(w, value),
  decodeStream: (r) => {
    const raw = r.bytes(r.leftBytes);
    const out = OutScript.decode(raw);
    if (out && (out.type === "p2a" || out.type === "wpkh" || out.type === "wsh" || out.type === "tr") && !equalBytes2(raw, OutScript.encode(out)))
      throw new Error("OutScript: non-canonical witness program");
    return out;
  }
})))();
function checkWSH(s, witnessScript) {
  if (!equalBytes2(s.hash, sha2562(witnessScript)))
    throw new Error("checkScript: wsh wrong witnessScript hash");
  const w = OutScript.decode(witnessScript);
  if (w.type === "tr" || w.type === "tr_ns" || w.type === "tr_ms")
    throw new Error(`checkScript: P2${w.type} cannot be wrapped in P2SH`);
  if (w.type === "wpkh" || w.type === "wsh" || w.type === "sh")
    throw new Error(`checkScript: P2${w.type} cannot be wrapped in P2WSH`);
}
function checkScript(script, redeemScript, witnessScript) {
  let hasWsh = false;
  let r = void 0;
  if (script) {
    const s = _WitnessOutScript.decode(script);
    if (s.type === "tr_ns" || s.type === "tr_ms" || s.type === "ms" || s.type == "pk")
      throw new Error(`checkScript: non-wrapped ${s.type}`);
    if (redeemScript) {
      if (s.type !== "sh")
        throw new Error("checkScript: redeemScript without P2SH");
      if (!equalBytes2(s.hash, hash160(redeemScript)))
        throw new Error("checkScript: sh wrong redeemScript hash");
      r = _WitnessOutScript.decode(redeemScript);
      if (r?.type === "tr" || r?.type === "tr_ns" || r?.type === "tr_ms")
        throw new Error(`checkScript: P2${r.type} cannot be wrapped in P2SH`);
      if (r?.type === "sh")
        throw new Error("checkScript: P2SH cannot be wrapped in P2SH");
    }
    if (s.type === "wsh") {
      hasWsh = true;
      if (witnessScript)
        checkWSH(s, witnessScript);
    }
  }
  if (redeemScript) {
    if (r === void 0)
      r = _WitnessOutScript.decode(redeemScript);
    if (r?.type === "wsh") {
      hasWsh = true;
      if (witnessScript)
        checkWSH(r, witnessScript);
    }
  }
  if (witnessScript && !hasWsh)
    throw new Error("checkScript: witnessScript without P2WSH");
}
function uniqPubkey(pubkeys, type) {
  const map = {};
  for (const pub of pubkeys) {
    validatePubkey(pub, type);
    let normalized = pub;
    if (type === PubT.ecdsa && pub.length === 65) {
      normalized = new Uint8Array(33);
      normalized[0] = 2 | pub[64] & 1;
      normalized.set(pub.subarray(1, 33), 1);
    }
    const key = hex.encode(normalized);
    if (map[key])
      throw new Error(`Multisig: non-uniq pubkey: ${pubkeys.map(hex.encode)}`);
    map[key] = true;
  }
}
var checkCanonicalScript = (script, name, allowNonCanonicalScript) => {
  if (allowNonCanonicalScript)
    return;
  const decoded = Script.decode(script);
  const nonMinimalNumber = decoded.some((op) => isBytes5(op) && op.length === 1 && (1 <= op[0] && op[0] <= 16 || op[0] === 129));
  if (nonMinimalNumber || !equalBytes2(script, Script.encode(decoded))) {
    const wrapper = name === "redeemScript" ? "P2SH" : "P2WSH";
    throw new Error(`${wrapper}: non-canonical ${name}`);
  }
};
var p2wsh = (child, network = NETWORK, allowNonCanonicalScript = false) => {
  validateObject2(child, {}, {}, "child");
  const cs = child.script;
  if (!isBytes5(cs))
    throw new Error(`Wrong script: ${typeof cs}, expected Uint8Array`);
  if (cs.length > 1e4)
    throw new Error("P2WSH: witnessScript exceeds 10,000 bytes");
  checkCanonicalScript(cs, "witnessScript", allowNonCanonicalScript);
  const hash = sha2562(cs);
  const script = OutScript.encode({ type: "wsh", hash });
  checkScript(script, void 0, cs);
  return {
    type: "wsh",
    witnessScript: cs,
    script,
    address: Address(network).encode({ type: "wsh", hash }),
    hash
  };
};
var p2ms = (m, pubkeys, allowSamePubkeys = false) => {
  if (!allowSamePubkeys)
    uniqPubkey(pubkeys, PubT.ecdsa);
  return {
    type: "ms",
    script: OutScript.encode({ type: "ms", pubkeys, m })
  };
};
var TAP_LEAF_VERSION = 192;
var tapLeafVersion = (version) => {
  if (version === void 0)
    return TAP_LEAF_VERSION;
  anumber(version, "leafVersion");
  if (version > 254 || version === 80 || !!(version & 1))
    throw new Error(`P2TR: invalid leafVersion=${version}`);
  return version;
};
var tapLeafHash = (script, version = TAP_LEAF_VERSION) => tagSchnorr("TapLeaf", new Uint8Array([tapLeafVersion(version)]), VarBytes.encode(script));
var base58check = /* @__PURE__ */ createBase58check(sha2562);
function validateWitness(version, data) {
  if (data.length < 2 || data.length > 40)
    throw new Error("Witness: invalid length");
  if (version > 16)
    throw new Error("Witness: invalid version");
  if (version === 0 && !(data.length === 20 || data.length === 32))
    throw new Error("Witness: invalid length for version");
}
function programToWitness(version, data, network = NETWORK) {
  validateWitness(version, data);
  const coder = version === 0 ? bech32 : bech32m;
  return coder.encode(network.bech32, [version].concat(coder.toWords(data)));
}
function formatKey(hashed, prefix2) {
  return base58check.encode(concatBytes4(Uint8Array.from(prefix2), hashed));
}
function Address(network = NETWORK) {
  validateObject2(network, {}, {}, "network");
  return {
    encode(from) {
      validateObject2(from, {}, {}, "from");
      const { type } = from;
      astring2(type, "from.type");
      if (type === "wpkh")
        return programToWitness(0, from.hash, network);
      else if (type === "wsh")
        return programToWitness(0, from.hash, network);
      else if (type === "tr")
        return programToWitness(1, from.pubkey, network);
      else if (type === "p2a")
        return programToWitness(1, P2A_PROGRAM, network);
      else if (type === "pkh")
        return formatKey(from.hash, [network.pubKeyHash]);
      else if (type === "sh")
        return formatKey(from.hash, [network.scriptHash]);
      throw new Error(`Unknown address type=${type}`);
    },
    decode(address) {
      astring2(address, "address");
      if (address.length < 14 || address.length > 74)
        throw new Error("Invalid address length");
      if (network.bech32 && address.toLowerCase().startsWith(`${network.bech32}1`)) {
        let res;
        try {
          res = bech32.decode(address);
          if (res.words[0] !== 0)
            throw new Error(`bech32: wrong version=${res.words[0]}`);
        } catch (_) {
          res = bech32m.decode(address);
          if (res.words[0] === 0)
            throw new Error(`bech32m: wrong version=${res.words[0]}`);
        }
        if (res.prefix !== network.bech32)
          throw new Error(`wrong bech32 prefix=${res.prefix}`);
        const [version, ...program] = res.words;
        const data2 = bech32.fromWords(program);
        validateWitness(version, data2);
        if (version === 0 && data2.length === 32)
          return { type: "wsh", hash: data2 };
        else if (version === 0 && data2.length === 20)
          return { type: "wpkh", hash: data2 };
        else if (version === 1 && data2.length === 32)
          return { type: "tr", pubkey: data2 };
        else if (version === 1 && equalBytes2(data2, P2A_PROGRAM))
          return { type: "p2a", script: Script.encode([1, data2]) };
        else
          throw new Error("Unknown witness program");
      }
      const data = base58check.decode(address);
      if (data.length !== 21)
        throw new Error("Invalid base58 address");
      if (data[0] === network.pubKeyHash) {
        return { type: "pkh", hash: data.slice(1) };
      } else if (data[0] === network.scriptHash) {
        return {
          type: "sh",
          hash: data.slice(1)
        };
      }
      throw new Error(`Invalid address prefix=${data[0]}`);
    }
  };
}

// node_modules/@scure/btc-signer/transaction.js
var _0n11 = /* @__PURE__ */ BigInt(0);
var _1n8 = /* @__PURE__ */ BigInt(1);
var U64_MAX = /* @__PURE__ */ BigInt("0xffffffffffffffff");
var EMPTY32 = /* @__PURE__ */ new Uint8Array(32);
var EMPTY_OUTPUT = {
  amount: U64_MAX,
  script: EMPTY
};
var toVsize = (weight) => Math.ceil(weight / 4);
var stripCodeSeparator = (script) => {
  let start = 0;
  const out = [];
  for (let i = 0; i < script.length; ) {
    const pos = i;
    const op = script[i++];
    if (op === OP.CODESEPARATOR) {
      if (start < pos)
        out.push(script.subarray(start, pos));
      start = i;
      continue;
    }
    const len = scriptPushLen(op, (bytes) => {
      if (i + bytes > script.length)
        throw new Error("Unexpected end of script");
      let len2 = 0;
      for (let j = 0; j < bytes; j++)
        len2 |= script[i + j] << 8 * j;
      i += bytes;
      return len2;
    });
    if (len === void 0)
      continue;
    i += len;
    if (i > script.length)
      throw new Error("Unexpected end of script");
  }
  if (start === 0)
    return script;
  if (start < script.length)
    out.push(script.subarray(start));
  return out.length ? concatBytes4(...out) : EMPTY;
};
var PRECISION = 8;
var DEFAULT_VERSION = 2;
var DEFAULT_LOCKTIME = 0;
var DEFAULT_SEQUENCE = 4294967295;
var Decimal = /* @__PURE__ */ (() => Object.freeze(coders.decimal(PRECISION)))();
var def = (value, def2) => value === void 0 ? def2 : value;
function cloneDeep(obj) {
  if (Array.isArray(obj))
    return obj.map((i) => cloneDeep(i));
  else if (isBytes5(obj))
    return Uint8Array.from(obj);
  else if (["number", "bigint", "boolean", "string", "undefined"].includes(typeof obj))
    return obj;
  else if (obj === null)
    return obj;
  else if (typeof obj === "object") {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, cloneDeep(v)]));
  }
  throw new Error(`cloneDeep: unknown type=${typeof obj}`);
}
var SignatureHash = /* @__PURE__ */ (() => Object.freeze({
  DEFAULT: 0,
  ALL: 1,
  NONE: 2,
  SINGLE: 3,
  ANYONECANPAY: 128
}))();
var SigHash = /* @__PURE__ */ (() => Object.freeze({
  DEFAULT: SignatureHash.DEFAULT,
  ALL: SignatureHash.ALL,
  NONE: SignatureHash.NONE,
  SINGLE: SignatureHash.SINGLE,
  // BIP341 only permits 0x00, 0x01, 0x02, 0x03, 0x81, 0x82, and 0x83 for taproot, so
  // the mechanical `DEFAULT | ANYONECANPAY` combination (0x80) is invalid and not exported.
  // DEFAULT_ANYONECANPAY: SignatureHash.DEFAULT | SignatureHash.ANYONECANPAY,
  ALL_ANYONECANPAY: SignatureHash.ALL | SignatureHash.ANYONECANPAY,
  NONE_ANYONECANPAY: SignatureHash.NONE | SignatureHash.ANYONECANPAY,
  SINGLE_ANYONECANPAY: SignatureHash.SINGLE | SignatureHash.ANYONECANPAY
}))();
var SigHashNames = /* @__PURE__ */ (() => Object.freeze(reverseObject(SigHash)))();
function getTaprootKeys(privKey, pubKey, internalKey, merkleRoot = EMPTY) {
  if (equalBytes2(internalKey, pubKey)) {
    privKey = taprootTweakPrivKey(privKey, merkleRoot);
    pubKey = pubSchnorr(privKey);
  }
  return { privKey, pubKey };
}
function outputBeforeSign(i) {
  if (i.script === void 0 || i.amount === void 0)
    throw new Error("Transaction/output: script and amount required");
  return { script: i.script, amount: i.amount };
}
function inputBeforeSign(i) {
  validateObject2(i, {}, {}, "i");
  if (i.txid === void 0 || i.index === void 0)
    throw new Error("Transaction/input: txid and index required");
  const res = {
    txid: i.txid,
    index: i.index,
    sequence: def(i.sequence, DEFAULT_SEQUENCE),
    finalScriptSig: def(i.finalScriptSig, EMPTY)
  };
  RawInput.encode(res);
  return res;
}
var cleanExtensions = (map, unknownMode, proprietaryMode, rejectStrip = false) => {
  const out = { ...map };
  for (const [name, mode] of [
    ["unknown", unknownMode],
    ["proprietary", proprietaryMode]
  ]) {
    const value = out[name];
    if (value !== void 0)
      aarray2(value, `${name} PSBT field`);
    const rows = value;
    if (!rows?.length) {
      delete out[name];
      continue;
    }
    if (mode === "strict")
      throw new Error(`PSBT: ${name} PSBT field is not allowed in strict mode`);
    if (mode === "strip") {
      if (rejectStrip)
        throw new Error(`PSBT: ${name} PSBT field cannot be supplied when policy is strip`);
      delete out[name];
    }
  }
  return out;
};
var cleanTxModifiable = (value, mode) => {
  if (value === void 0 || !(value & ~7))
    return value;
  if (mode === "strict")
    throw new Error("PSBT: unknown txModifiable bits in strict mode");
  return mode === "strip" ? value & 7 : value;
};
function cleanFinalInput(i, unknownMode = "strip", proprietaryMode = "strip") {
  const _i = i;
  const extensions = cleanExtensions(_i, unknownMode, proprietaryMode);
  if (extensions.unknown)
    _i.unknown = extensions.unknown;
  else
    delete _i.unknown;
  if (extensions.proprietary)
    _i.proprietary = extensions.proprietary;
  else
    delete _i.proprietary;
  for (const _k in _i) {
    const k = _k;
    if (proprietaryMode === "ignore" && k === "proprietary" && _i.proprietary?.length)
      continue;
    if (!PSBTInputFinalKeys.includes(k))
      delete _i[k];
  }
}
var TxHashIdx = /* @__PURE__ */ (() => struct({ txid: createBytes(32, true), index: U32LE }))();
function validateSigHash(s) {
  if (typeof s !== "number" || typeof SigHashNames[s] !== "string")
    throw new Error(`Invalid SigHash=${s}`);
  return s;
}
function unpackSighash(hashType) {
  const masked = hashType & 31;
  return {
    isAny: !!(hashType & SignatureHash.ANYONECANPAY),
    isNone: masked === SignatureHash.NONE,
    isSingle: masked === SignatureHash.SINGLE
  };
}
var sighashScope = (sighash) => ({
  sigInputs: sighash & SignatureHash.ANYONECANPAY,
  sigOutputs: sighash === SignatureHash.DEFAULT ? SignatureHash.ALL : sighash & 3
});
var normalizeUnknowns = (name, mode, legacy, fallback = "strip") => {
  const alias = legacy === void 0 ? void 0 : legacy ? "ignore" : "strip";
  if (mode !== void 0 && mode !== "ignore" && mode !== "strip" && mode !== "strict")
    throw new Error(`Transaction options wrong value: ${name}=${mode}`);
  if (mode !== void 0 && alias !== void 0 && mode !== alias)
    throw new Error(`Transaction options: conflicting ${name} options`);
  return mode || alias || fallback;
};
function validateOpts(opts) {
  if (opts !== void 0)
    validateObject2(opts, {}, {}, "opts");
  const _opts = {
    ...opts,
    // Defaults
    version: def(opts.version, DEFAULT_VERSION),
    lockTime: def(opts.lockTime, 0),
    PSBTVersion: def(opts.PSBTVersion, 0)
  };
  if (typeof _opts.allowUnknowInput !== "undefined")
    _opts.allowUnknownInputs = _opts.allowUnknowInput;
  if (typeof _opts.allowUnknowOutput !== "undefined")
    _opts.allowUnknownOutputs = _opts.allowUnknowOutput;
  if (_opts.allowMissingTxModifiable === void 0)
    _opts.allowMissingTxModifiable = true;
  if (typeof _opts.lockTime !== "number")
    throw new Error("Transaction lock time should be number");
  U32LE.encode(_opts.lockTime);
  if (_opts.PSBTVersion !== 0 && _opts.PSBTVersion !== 2)
    throw new Error(`Unknown PSBT version ${_opts.PSBTVersion}`);
  for (const k of [
    "allowUnknownVersion",
    "allowUnknownOutputs",
    "allowUnknownInputs",
    "disableScriptCheck",
    "bip174jsCompat",
    "allowLegacyWitnessUtxo",
    "strictPrevoutValidation",
    "lowR",
    "allowUnknown",
    "allowMissingTxModifiable"
  ]) {
    const v = _opts[k];
    if (v === void 0)
      continue;
    if (typeof v !== "boolean")
      throw new Error(`Transation options wrong type: ${k}=${v} (${typeof v})`);
  }
  _opts.unknown = normalizeUnknowns("unknown", _opts.unknown, _opts.allowUnknown);
  _opts.proprietary = normalizeUnknowns("proprietary", _opts.proprietary, void 0, _opts.unknown);
  if (_opts.allowUnknownVersion ? typeof _opts.version !== "number" : ![-1, 0, 1, 2, 3].includes(_opts.version))
    throw new Error(`Unknown version: ${_opts.version}`);
  I32LE.encode(_opts.version);
  if (_opts.customScripts !== void 0) {
    const cs = _opts.customScripts;
    if (!Array.isArray(cs)) {
      throw new Error(`wrong custom scripts type (expected array): customScripts=${cs} (${typeof cs})`);
    }
    for (const s of cs) {
      if (typeof s.encode !== "function" || typeof s.decode !== "function")
        throw new Error(`wrong script=${s} (${typeof s})`);
      if (s.finalizeTaproot !== void 0 && typeof s.finalizeTaproot !== "function")
        throw new Error(`wrong script=${s} (${typeof s})`);
    }
  }
  return Object.freeze(_opts);
}
function checkTaprootInputCommitments(input, prevScript) {
  const output = _WitnessOutScript.decode(prevScript);
  const hasTaprootCommitments = input.tapInternalKey !== void 0 || input.tapMerkleRoot !== void 0 || // Repeated keyed fields only exist on the PSBT wire when at least one entry is encoded.
  !!input.tapLeafScript?.length;
  if (output.type !== "tr") {
    if (hasTaprootCommitments)
      throw new Error("validateInput: Taproot metadata without P2TR previous output");
    return;
  }
  const checkOutputKey = (internalKey, merkleRoot, parity) => {
    const [outputKey, outputParity] = taprootTweakPubkey(internalKey, merkleRoot);
    if (!equalBytes2(outputKey, output.pubkey))
      throw new Error("validateInput: Taproot commitment does not match previous output");
    if (parity !== void 0 && outputParity !== parity)
      throw new Error("validateInput: Taproot control-block parity does not match previous output");
  };
  if (input.tapLeafScript) {
    for (const [controlBlock, scriptWithVersion] of input.tapLeafScript) {
      const leafVersion = scriptWithVersion[scriptWithVersion.length - 1];
      const script = scriptWithVersion.subarray(0, -1);
      let merkleRoot = tapLeafHash(script, leafVersion);
      for (const sibling of controlBlock.merklePath) {
        merkleRoot = compareBytes(sibling, merkleRoot) === -1 ? tagSchnorr("TapBranch", sibling, merkleRoot) : tagSchnorr("TapBranch", merkleRoot, sibling);
      }
      checkOutputKey(controlBlock.internalKey, merkleRoot, controlBlock.version & 1);
      if (input.tapInternalKey && !equalBytes2(input.tapInternalKey, controlBlock.internalKey))
        throw new Error("validateInput: tapInternalKey does not match Taproot control block");
      if (input.tapMerkleRoot && !equalBytes2(input.tapMerkleRoot, merkleRoot))
        throw new Error("validateInput: tapMerkleRoot does not match Taproot control block");
    }
  }
  if (input.tapInternalKey && (input.tapMerkleRoot || !input.tapLeafScript?.length))
    checkOutputKey(input.tapInternalKey, input.tapMerkleRoot || EMPTY);
}
var LOCKTIME_THRESHOLD = 5e8;
function validateRequiredLocktimes(input) {
  const height = input.requiredHeightLocktime;
  if (height !== void 0) {
    anumber(height, "requiredHeightLocktime");
    if (height === 0 || height >= LOCKTIME_THRESHOLD)
      throw new RangeError(`requiredHeightLocktime must be between 1 and ${LOCKTIME_THRESHOLD - 1}, got ${height}`);
  }
  const time = input.requiredTimeLocktime;
  if (time !== void 0) {
    anumber(time, "requiredTimeLocktime");
    if (time < LOCKTIME_THRESHOLD || time > 4294967295)
      throw new RangeError(`requiredTimeLocktime must be between ${LOCKTIME_THRESHOLD} and 4294967295, got ${time}`);
  }
}
function resolvePSBTLocktime(inputs, fallback = DEFAULT_LOCKTIME) {
  let height = DEFAULT_LOCKTIME;
  let time = DEFAULT_LOCKTIME;
  let hasRequirements = false;
  let heightSupported = true;
  let timeSupported = true;
  for (const input of inputs) {
    validateRequiredLocktimes(input);
    const hasHeight = input.requiredHeightLocktime !== void 0;
    const hasTime = input.requiredTimeLocktime !== void 0;
    if (!hasHeight && !hasTime)
      continue;
    hasRequirements = true;
    if (hasHeight)
      height = Math.max(height, input.requiredHeightLocktime);
    else
      heightSupported = false;
    if (hasTime)
      time = Math.max(time, input.requiredTimeLocktime);
    else
      timeSupported = false;
  }
  if (!hasRequirements)
    return fallback;
  if (heightSupported)
    return height;
  if (timeSupported)
    return time;
  throw new Error("PSBTv2: incompatible height-based and time-based locktime requirements");
}
function validateInput(i, disableScriptCheck = false) {
  validateObject2(i, {}, {}, "i");
  const _i = i;
  validateRequiredLocktimes(_i);
  let prevOut;
  if (_i.nonWitnessUtxo && _i.index !== void 0) {
    const last = _i.nonWitnessUtxo.outputs.length - 1;
    if (_i.index > last)
      throw new Error(`validateInput: index(${_i.index}) not in nonWitnessUtxo`);
    prevOut = _i.nonWitnessUtxo.outputs[_i.index];
    if (_i.witnessUtxo && (!equalBytes2(_i.witnessUtxo.script, prevOut.script) || _i.witnessUtxo.amount !== prevOut.amount))
      throw new Error("validateInput: witnessUtxo different from nonWitnessUtxo");
    if (_i.txid) {
      const outputs = _i.nonWitnessUtxo.outputs;
      if (outputs.length - 1 < _i.index)
        throw new Error("nonWitnessUtxo: incorect output index");
      const tx = Transaction.fromRaw(RawTx.encode(_i.nonWitnessUtxo), {
        allowUnknownOutputs: true,
        disableScriptCheck: true,
        allowUnknownInputs: true,
        // Consensus does not restrict nVersion; a previous tx with a non-standard
        // version is still spendable and its txid must still be verifiable.
        allowUnknownVersion: true
      });
      const txid = hex.encode(_i.txid);
      if (tx.id !== txid)
        throw new Error(`nonWitnessUtxo: wrong txid, exp=${txid} got=${tx.id}`);
    }
  } else if (_i.witnessUtxo)
    prevOut = _i.witnessUtxo;
  if (prevOut && !disableScriptCheck) {
    checkScript(prevOut.script, _i.redeemScript, _i.witnessScript);
    checkTaprootInputCommitments(_i, prevOut.script);
  }
  return _i;
}
var inputSignatures = (input) => {
  const _input = input;
  const res = [];
  const add2 = (signature, taproot, scriptPath = false) => {
    const sig = signature;
    if (!sig.length)
      return;
    const sighash = taproot && sig.length === 64 ? SignatureHash.DEFAULT : sig[sig.length - 1];
    res.push({ sighash, taproot, scriptPath });
  };
  for (const [, signature] of _input.partialSig || [])
    add2(signature, false);
  if (_input.tapKeySig)
    add2(_input.tapKeySig, true);
  for (const [, signature] of _input.tapScriptSig || [])
    add2(signature, true, true);
  return res;
};
var inputSignedKeys = {
  // sighashType is signer policy rather than a digest byte, but changing it after one signature
  // exists would make later signers interpret the same input under a different policy.
  self: ["txid", "index", "sequence", "nonWitnessUtxo", "witnessUtxo", "sighashType"],
  ecdsa: ["redeemScript", "witnessScript"],
  tapscript: ["tapLeafScript"],
  cross: ["txid", "index"],
  prevout: ["nonWitnessUtxo", "witnessUtxo"]
};
function getPrevOut(input) {
  validateObject2(input, {}, {}, "input");
  const _input = input;
  if (_input.nonWitnessUtxo) {
    if (_input.index === void 0)
      throw new Error("Unknown input index");
    if (!Number.isSafeInteger(_input.index) || _input.index < 0 || _input.index >= _input.nonWitnessUtxo.outputs.length)
      throw new Error(`Wrong input index=${_input.index}`);
    return _input.nonWitnessUtxo.outputs[_input.index];
  } else if ("witnessUtxo" in _input) {
    const prev = _input.witnessUtxo;
    validateObject2(prev, {}, {}, "input.witnessUtxo");
    abigint(prev.amount, "input.witnessUtxo.amount");
    if (!isBytes5(prev.script))
      throw new TypeError('"input.witnessUtxo.script" expected Uint8Array, got type=' + typeof prev.script);
    return prev;
  } else
    throw new Error("Cannot find previous output info");
}
function normalizeInput(i, cur, allowedFields, disableScriptCheck = false, unknown = "strip", proprietary = "strip") {
  validateObject2(i, {}, {}, "i");
  if (cur !== void 0)
    validateObject2(cur, {}, {}, "cur");
  if (allowedFields !== void 0)
    aarray2(allowedFields, "allowedFields");
  const _i = i;
  const _cur = cur;
  const _allowedFields = allowedFields;
  let { nonWitnessUtxo, txid } = _i;
  if (typeof nonWitnessUtxo === "string")
    nonWitnessUtxo = hex.decode(nonWitnessUtxo);
  if (isBytes5(nonWitnessUtxo))
    nonWitnessUtxo = RawTx.decode(nonWitnessUtxo);
  if (!("nonWitnessUtxo" in _i) && nonWitnessUtxo === void 0)
    nonWitnessUtxo = _cur?.nonWitnessUtxo;
  if (typeof txid === "string")
    txid = hex.decode(txid);
  if (txid === void 0)
    txid = _cur?.txid;
  let res = { ..._cur, ..._i, nonWitnessUtxo, txid };
  if (!("nonWitnessUtxo" in _i) && res.nonWitnessUtxo === void 0)
    delete res.nonWitnessUtxo;
  if (res.sequence === void 0)
    res.sequence = DEFAULT_SEQUENCE;
  if (res.tapMerkleRoot === null)
    delete res.tapMerkleRoot;
  res = mergeKeyMap(PSBTInput, res, _cur, _allowedFields, unknown, proprietary);
  if (Array.isArray(res.tapLeafScript) && !res.tapLeafScript.length)
    delete res.tapLeafScript;
  validateRequiredLocktimes(res);
  PSBTInputCoder.encode(res);
  return validateInput(res, disableScriptCheck);
}
function getInputType(input, allowLegacyWitnessUtxo = false) {
  const _input = input;
  let txType = "legacy";
  let defaultSighash = SignatureHash.ALL;
  const prevOut = getPrevOut(_input);
  const first = _WitnessOutScript.decode(prevOut.script);
  let type = first.type;
  let cur = first;
  const stack = [first];
  let lastScript = prevOut.script;
  if (first.type === "tr") {
    defaultSighash = SignatureHash.DEFAULT;
    return {
      txType: "taproot",
      type: "tr",
      last: first,
      lastScript: prevOut.script,
      defaultSighash,
      sighash: _input.sighashType || defaultSighash
    };
  } else {
    if (first.type === "wpkh" || first.type === "wsh")
      txType = "segwit";
    if (first.type === "sh") {
      if (!_input.redeemScript)
        throw new Error("inputType: sh without redeemScript");
      let child = _WitnessOutScript.decode(_input.redeemScript);
      if (child.type === "wpkh" || child.type === "wsh")
        txType = "segwit";
      stack.push(child);
      cur = child;
      lastScript = _input.redeemScript;
      type += `-${child.type}`;
    }
    if (cur.type === "wsh") {
      if (!_input.witnessScript)
        throw new Error("inputType: wsh without witnessScript");
      let child = OutScript.decode(_input.witnessScript);
      if (child.type === "wsh")
        txType = "segwit";
      stack.push(child);
      cur = child;
      lastScript = _input.witnessScript;
      type += `-${child.type}`;
    }
    const last = stack[stack.length - 1];
    if (last.type === "sh" || last.type === "wsh")
      throw new Error("inputType: sh/wsh cannot be terminal type");
    const res = {
      type,
      txType,
      last,
      lastScript,
      defaultSighash,
      sighash: _input.sighashType || defaultSighash
    };
    if (txType === "legacy" && !allowLegacyWitnessUtxo && !_input.nonWitnessUtxo) {
      throw new Error(`Transaction/sign: legacy input without nonWitnessUtxo, can result in attack that forces paying higher fees. Pass allowLegacyWitnessUtxo=true, if you sure`);
    }
    return res;
  }
}
var Transaction = class _Transaction {
  global = {};
  inputs = [];
  // use getInput()
  outputs = [];
  // use getOutput()
  opts;
  constructor(opts = {}) {
    const _opts = this.opts = validateOpts(opts);
    this.global.fallbackLocktime = _opts.lockTime;
    this.global.txVersion = _opts.version;
    if (_opts.PSBTVersion === 2)
      this.global.txModifiable = 3;
  }
  isPSBTv2() {
    return (this.global.version ?? this.opts.PSBTVersion) === 2;
  }
  requireTxModifiable(bit, kind) {
    if (!this.isPSBTv2())
      return;
    if (!(this.txModifiablePolicy() & bit))
      throw new Error(`PSBTv2: ${kind} are not modifiable`);
  }
  txModifiablePolicy(allowMissing = this.opts.allowMissingTxModifiable, unknownMode = this.opts.unknown) {
    if (!this.isPSBTv2())
      return 3;
    if (this.global.txModifiable !== void 0)
      return cleanTxModifiable(this.global.txModifiable, unknownMode);
    return allowMissing ? 3 : 0;
  }
  modifiable(allowMissing = this.opts.allowMissingTxModifiable, unknownMode = this.opts.unknown) {
    let flags = this.txModifiablePolicy(allowMissing, unknownMode);
    let hasOpaqueFinal = false;
    let hasSingle = false;
    for (let idx = 0; idx < this.inputs.length; idx++) {
      const signatures = inputSignatures(this.inputs[idx]);
      if (!signatures.length && this.inputStatus(idx) === "finalized")
        hasOpaqueFinal = true;
      for (const { sighash } of signatures) {
        const { isAny, isNone, isSingle } = unpackSighash(sighash);
        if (!isAny)
          flags &= ~1;
        if (!isNone)
          flags &= ~2;
        if (isSingle)
          hasSingle = true;
      }
    }
    if (hasSingle)
      flags |= 4;
    if (hasOpaqueFinal && this.global.txModifiable === void 0)
      flags &= ~3;
    return flags;
  }
  get txModifiable() {
    return this.modifiable();
  }
  // Import
  static fromRaw(raw, opts = {}) {
    const parsed = RawTx.decode(raw);
    const tx = new _Transaction({ ...opts, version: parsed.version, lockTime: parsed.lockTime });
    for (const o of parsed.outputs)
      tx.addOutput(o);
    tx.outputs = parsed.outputs;
    tx.inputs = parsed.inputs;
    if (parsed.witnesses) {
      for (let i = 0; i < parsed.witnesses.length; i++)
        tx.inputs[i].finalScriptWitness = parsed.witnesses[i];
    }
    return tx;
  }
  // PSBT
  static fromPSBT(psbt_, opts = {}) {
    let parsed;
    try {
      parsed = RawPSBTV0.decode(psbt_);
    } catch (e0) {
      try {
        parsed = RawPSBTV2.decode(psbt_);
      } catch (e2) {
        throw e0;
      }
    }
    const PSBTVersion = parsed.global.version || 0;
    if (PSBTVersion !== 0 && PSBTVersion !== 2)
      throw new Error(`Wrong PSBT version=${PSBTVersion}`);
    const unsigned = parsed.global.unsignedTx;
    const version = PSBTVersion === 0 ? unsigned?.version : parsed.global.txVersion;
    const lockTime = PSBTVersion === 0 ? unsigned?.lockTime : parsed.global.fallbackLocktime;
    const tx = new _Transaction({ ...opts, version, lockTime, PSBTVersion });
    const inputCount = PSBTVersion === 0 ? unsigned?.inputs.length : parsed.global.inputCount;
    tx.inputs = parsed.inputs.slice(0, inputCount).map((i, j) => {
      const input = {
        ...parsed.global.unsignedTx?.inputs[j],
        ...i
      };
      if (!i.finalScriptSig?.length)
        delete input.finalScriptSig;
      return validateInput(input, tx.opts.disableScriptCheck);
    });
    const outputCount = PSBTVersion === 0 ? unsigned?.outputs.length : parsed.global.outputCount;
    const hasBip174InputMap = PSBTVersion === 0 && inputCount === 0 && Object.keys(parsed.outputs[0] || {}).length === 0 && (outputCount > 0 && parsed.outputs.length === outputCount + 1 || outputCount === 0 && parsed.outputs.length === 2 && Object.keys(parsed.outputs[1]).length === 0);
    const outputStart = hasBip174InputMap ? 1 : 0;
    tx.outputs = parsed.outputs.slice(outputStart, outputStart + outputCount).map((i, j) => ({
      ...i,
      ...parsed.global.unsignedTx?.outputs[j]
    }));
    const unknownMode = tx.opts.unknown;
    const proprietaryMode = tx.opts.proprietary;
    tx.global = cleanExtensions({ ...parsed.global, txVersion: version }, unknownMode, proprietaryMode);
    tx.inputs = tx.inputs.map((input) => cleanExtensions(input, unknownMode, proprietaryMode));
    tx.outputs = tx.outputs.map((output) => cleanExtensions(output, unknownMode, proprietaryMode));
    if (tx.global.txModifiable !== void 0)
      tx.global.txModifiable = cleanTxModifiable(tx.global.txModifiable, unknownMode);
    resolvePSBTLocktime(tx.inputs, tx.global.fallbackLocktime ?? DEFAULT_LOCKTIME);
    if (PSBTVersion === 0)
      tx.global.fallbackLocktime = def(lockTime, DEFAULT_LOCKTIME);
    return tx;
  }
  // Prefer `global.version` when present so cross-version combiners can serialize at the highest
  // required PSBT version without mutating the frozen transaction options object.
  toPSBT(PSBTVersion = this.global.version || this.opts.PSBTVersion) {
    if (PSBTVersion !== void 0)
      anumber(PSBTVersion, "PSBTVersion");
    if (PSBTVersion !== 0 && PSBTVersion !== 2)
      throw new Error(`Wrong PSBT version=${PSBTVersion}`);
    const inputs = this.inputs.map((i) => cleanExtensions(
      // For PSBTv0 the prevout txid/index live in global.unsignedTx rather than the input map, so
      // validate the full transaction input before version filtering drops those fields.
      cleanPSBTFields(PSBTVersion, PSBTInput, validateInput(i, this.opts.disableScriptCheck)),
      this.opts.unknown,
      this.opts.proprietary
    ));
    for (const inp of inputs) {
      if (inp.partialSig && !inp.partialSig.length)
        delete inp.partialSig;
      if (inp.finalScriptSig && !inp.finalScriptSig.length)
        delete inp.finalScriptSig;
      if (inp.finalScriptWitness && !inp.finalScriptWitness.length)
        delete inp.finalScriptWitness;
    }
    const outputs = this.outputs.map((i) => cleanExtensions(cleanPSBTFields(PSBTVersion, PSBTOutput, i), this.opts.unknown, this.opts.proprietary));
    const global = cleanExtensions({ ...this.global }, this.opts.unknown, this.opts.proprietary);
    if (global.txModifiable !== void 0)
      global.txModifiable = cleanTxModifiable(global.txModifiable, this.opts.unknown);
    if (PSBTVersion === 0) {
      global.unsignedTx = RawOldTx.decode(RawOldTx.encode({
        version: this.version,
        lockTime: this.lockTime,
        inputs: this.inputs.map((i) => inputBeforeSign(i)).map((i) => ({
          ...i,
          finalScriptSig: EMPTY
        })),
        outputs: this.outputs.map((o) => outputBeforeSign(o))
      }));
      delete global.fallbackLocktime;
      delete global.txVersion;
      delete global.inputCount;
      delete global.outputCount;
      delete global.version;
      delete global.txModifiable;
    } else {
      delete global.unsignedTx;
      global.version = PSBTVersion;
      global.txVersion = this.version;
      global.inputCount = this.inputs.length;
      global.outputCount = this.outputs.length;
      if (!this.isPSBTv2() || global.txModifiable === void 0 && this.opts.allowMissingTxModifiable)
        global.txModifiable = this.txModifiable;
    }
    if (this.opts.bip174jsCompat && PSBTVersion === 0 && !outputs.length)
      outputs.push({});
    const raw = { global, inputs, outputs };
    return PSBTVersion === 0 ? RawPSBTV0.encode(raw) : RawPSBTV2.encode(raw);
  }
  // BIP370 lockTime (https://github.com/bitcoin/bips/blob/master/bip-0370.mediawiki#determining-lock-time)
  get lockTime() {
    return resolvePSBTLocktime(this.inputs, this.global.fallbackLocktime ?? DEFAULT_LOCKTIME);
  }
  get version() {
    if (this.global.txVersion === void 0)
      throw new Error("No global.txVersion");
    return this.global.txVersion;
  }
  inputStatus(idx) {
    this.checkInputIdx(idx);
    const input = this.inputs[idx];
    if (input.finalScriptSig && input.finalScriptSig.length)
      return "finalized";
    if (input.finalScriptWitness && input.finalScriptWitness.length)
      return "finalized";
    if (input.tapKeySig)
      return "signed";
    if (input.tapScriptSig && input.tapScriptSig.length)
      return "signed";
    if (input.partialSig && input.partialSig.length)
      return "signed";
    return "unsigned";
  }
  cleanFinalInput(input) {
    cleanFinalInput(input, this.opts.unknown, this.opts.proprietary);
    if (this.global.txModifiable !== void 0)
      this.global.txModifiable = cleanTxModifiable(this.global.txModifiable, this.opts.unknown);
  }
  // Cannot replace unpackSighash, tests rely on very generic implemenetation with signing inputs outside of range
  // We will lose some vectors -> smaller test coverage of preimages (very important!)
  inputSighash(idx) {
    this.checkInputIdx(idx);
    const inputSighash = this.inputs[idx].sighashType;
    const sighash = inputSighash === void 0 ? SignatureHash.DEFAULT : inputSighash;
    return sighashScope(sighash);
  }
  // Very nice for debug purposes, but slow. If there is too much inputs/outputs to add, will be quadratic.
  // Some cache will be nice, but there chance to have bugs with cache invalidation
  signatures() {
    const res = [];
    for (let idx = 0; idx < this.inputs.length; idx++) {
      const actual = inputSignatures(this.inputs[idx]);
      for (const signature of actual)
        res.push({ idx, ...signature });
      if (actual.length || this.inputStatus(idx) !== "finalized")
        continue;
      let taproot = true;
      try {
        taproot = _WitnessOutScript.decode(getPrevOut(this.inputs[idx]).script).type === "tr";
      } catch {
      }
      const declared = this.inputs[idx].sighashType;
      const sighash = declared === void 0 ? SignatureHash.DEFAULT : declared;
      res.push({ idx, sighash, taproot, scriptPath: taproot });
    }
    return res;
  }
  signedInputKeys(idx, signatures = this.signatures()) {
    const res = /* @__PURE__ */ new Set();
    const add2 = (keys) => {
      for (const key of keys)
        res.add(key);
    };
    for (const signature of signatures) {
      const { isAny, isNone, isSingle } = unpackSighash(signature.sighash);
      if (signature.idx === idx) {
        add2(inputSignedKeys.self);
        if (signature.taproot) {
          if (signature.scriptPath)
            add2(inputSignedKeys.tapscript);
        } else
          add2(inputSignedKeys.ecdsa);
      } else if (!isAny) {
        add2(inputSignedKeys.cross);
        if (signature.taproot || !isNone && !isSingle)
          res.add("sequence");
        if (signature.taproot)
          add2(inputSignedKeys.prevout);
      }
    }
    return [...res];
  }
  signStatus(signatures = this.signatures()) {
    let addInput = true, addOutput = true;
    let inputs = [], outputs = [];
    for (const { idx, sighash } of signatures) {
      const { sigInputs, sigOutputs } = sighashScope(sighash);
      if (sigInputs === SignatureHash.ANYONECANPAY) {
        if (!inputs.includes(idx))
          inputs.push(idx);
      } else
        addInput = false;
      if (sigOutputs === SignatureHash.ALL)
        addOutput = false;
      else if (sigOutputs === SignatureHash.SINGLE) {
        if (!outputs.includes(idx))
          outputs.push(idx);
      } else if (sigOutputs === SignatureHash.NONE) {
      } else
        throw new Error(`Wrong signature hash output type: ${sigOutputs}`);
    }
    return { addInput, addOutput, inputs, outputs };
  }
  get isFinal() {
    for (let idx = 0; idx < this.inputs.length; idx++)
      if (this.inputStatus(idx) !== "finalized")
        return false;
    return true;
  }
  // Info utils
  get hasWitnesses() {
    for (const i of this.inputs)
      if (i.finalScriptWitness && i.finalScriptWitness.length)
        return true;
    return false;
  }
  // https://en.bitcoin.it/wiki/Weight_units
  get weight() {
    if (!this.isFinal)
      throw new Error("Transaction is not finalized");
    const varLen = (dataLen) => CompactSizeLen.encode(dataLen).length + dataLen;
    const hasWitnesses = this.hasWitnesses;
    let out = 32;
    const outputs = this.outputs.map(outputBeforeSign);
    out += 4 * CompactSizeLen.encode(this.outputs.length).length;
    for (const o of outputs)
      out += 32 + 4 * varLen(o.script.length);
    if (hasWitnesses)
      out += 2;
    out += 4 * CompactSizeLen.encode(this.inputs.length).length;
    for (const i of this.inputs) {
      out += 160 + 4 * varLen((i.finalScriptSig || EMPTY).length);
      if (hasWitnesses) {
        const witness = i.finalScriptWitness || [];
        out += CompactSizeLen.encode(witness.length).length;
        for (const w of witness)
          out += varLen(w.length);
      }
    }
    return out;
  }
  get vsize() {
    return toVsize(this.weight);
  }
  toBytes(withScriptSig = false, withWitness = false) {
    return RawTx.encode({
      version: this.version,
      lockTime: this.lockTime,
      inputs: this.inputs.map(inputBeforeSign).map((i) => ({
        ...i,
        finalScriptSig: withScriptSig && i.finalScriptSig || EMPTY
      })),
      outputs: this.outputs.map(outputBeforeSign),
      witnesses: this.inputs.map((i) => i.finalScriptWitness || []),
      segwitFlag: withWitness && this.hasWitnesses
    });
  }
  get unsignedTx() {
    return this.toBytes(false, false);
  }
  get hex() {
    return hex.encode(this.toBytes(true, this.hasWitnesses));
  }
  get hash() {
    return hex.encode(sha256x2(this.toBytes(true)));
  }
  get id() {
    return hex.encode(sha256x2(this.toBytes(true)).reverse());
  }
  // Input stuff
  checkInputIdx(idx) {
    anumber(idx, "idx");
    if (idx >= this.inputs.length)
      throw new Error(`Wrong input index=${idx}`);
  }
  validatePrevoutsForSigning() {
    if (!this.opts.strictPrevoutValidation)
      return;
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      if (!input.nonWitnessUtxo) {
        throw new Error(`Transaction/sign: strictPrevoutValidation requires nonWitnessUtxo for input=${i}`);
      }
      if (input.txid === void 0 || input.index === void 0) {
        throw new Error(`Transaction/sign: strictPrevoutValidation requires an outpoint for input=${i}`);
      }
      validateInput(input, this.opts.disableScriptCheck);
    }
  }
  getInput(idx) {
    this.checkInputIdx(idx);
    return cloneDeep(this.inputs[idx]);
  }
  get inputsLength() {
    return this.inputs.length;
  }
  // Modification
  addInput(input, _ignoreSignStatus = false) {
    validateObject2(input, {}, {}, "input");
    cleanExtensions(input, this.opts.unknown, this.opts.proprietary, true);
    this.requireTxModifiable(1, "inputs");
    const signatures = _ignoreSignStatus ? void 0 : this.signatures();
    const status = signatures && this.signStatus(signatures);
    if (status && !status.addInput)
      throw new Error("Tx has signed inputs, cannot add new one");
    const normalized = cloneDeep(normalizeInput(input, void 0, void 0, this.opts.disableScriptCheck, this.opts.unknown, this.opts.proprietary));
    const nextLockTime = resolvePSBTLocktime([...this.inputs, normalized], this.global.fallbackLocktime ?? DEFAULT_LOCKTIME);
    if (signatures?.length && nextLockTime !== this.lockTime)
      throw new Error("Tx has signed inputs, cannot change lockTime");
    this.inputs.push(normalized);
    return this.inputs.length - 1;
  }
  updateInput(idx, input, _ignoreSignStatus = false) {
    this.checkInputIdx(idx);
    cleanExtensions(input, this.opts.unknown, this.opts.proprietary, true);
    let allowedFields;
    const signatures = _ignoreSignStatus ? void 0 : this.signatures();
    if (signatures?.length) {
      if (this.inputStatus(idx) === "finalized") {
        allowedFields = PSBTInputSignatureKeys.filter((key) => this.inputs[idx][key] !== void 0);
      } else {
        const signed = new Set(this.signedInputKeys(idx, signatures));
        if (signed.size)
          allowedFields = Object.keys(PSBTInput).filter((key) => !signed.has(key));
      }
    }
    const normalized = cloneDeep(normalizeInput(input, this.inputs[idx], allowedFields, this.opts.disableScriptCheck, this.opts.unknown, this.opts.proprietary));
    const inputs = this.inputs.slice();
    inputs[idx] = normalized;
    const nextLockTime = resolvePSBTLocktime(inputs, this.global.fallbackLocktime ?? DEFAULT_LOCKTIME);
    if (signatures?.length && nextLockTime !== this.lockTime)
      throw new Error("Tx has signed inputs, cannot change lockTime");
    const current = this.inputs[idx];
    const transactionChanged = current.index !== normalized.index || def(current.sequence, DEFAULT_SEQUENCE) !== def(normalized.sequence, DEFAULT_SEQUENCE) || (current.txid === void 0 ? normalized.txid !== void 0 : normalized.txid === void 0 || !equalBytes2(current.txid, normalized.txid)) || nextLockTime !== this.lockTime;
    if (transactionChanged)
      this.requireTxModifiable(1, "inputs");
    this.inputs[idx] = normalized;
  }
  // Output stuff
  checkOutputIdx(idx) {
    anumber(idx, "idx");
    if (idx >= this.outputs.length)
      throw new Error(`Wrong output index=${idx}`);
  }
  getOutput(idx) {
    this.checkOutputIdx(idx);
    return cloneDeep(this.outputs[idx]);
  }
  getOutputAddress(idx, network = NETWORK) {
    const out = this.getOutput(idx);
    if (!out.script)
      return;
    return Address(network).encode(_WitnessOutScript.decode(out.script));
  }
  get outputsLength() {
    return this.outputs.length;
  }
  normalizeOutput(o, cur, allowedFields) {
    validateObject2(o, {}, {}, "o");
    let { amount, script } = o;
    if (amount === void 0)
      amount = cur?.amount;
    amount = abigint(amount, "o.amount");
    if (typeof script === "string")
      script = hex.decode(script);
    if (script === void 0)
      script = cur?.script;
    let res = { ...cur, ...o, amount, script };
    if (res.amount === void 0)
      delete res.amount;
    res = mergeKeyMap(PSBTOutput, res, cur, allowedFields, this.opts.unknown, this.opts.proprietary);
    PSBTOutputCoder.encode(res);
    if (res.script && !this.opts.allowUnknownOutputs && _WitnessOutScript.decode(res.script).type === "unknown") {
      throw new Error("Transaction/output: unknown output script type, there is a chance that input is unspendable. Pass allowUnknownOutputs=true, if you sure");
    }
    if (!this.opts.disableScriptCheck)
      checkScript(res.script, res.redeemScript, res.witnessScript);
    return res;
  }
  addOutput(o, _ignoreSignStatus = false) {
    cleanExtensions(o, this.opts.unknown, this.opts.proprietary, true);
    this.requireTxModifiable(2, "outputs");
    const status = _ignoreSignStatus ? void 0 : this.signStatus();
    if (status && (!status.addOutput || status.outputs.includes(this.outputs.length)))
      throw new Error("Tx has signed outputs, cannot add new one");
    this.outputs.push(cloneDeep(this.normalizeOutput(o)));
    return this.outputs.length - 1;
  }
  updateOutput(idx, output, _ignoreSignStatus = false) {
    this.checkOutputIdx(idx);
    cleanExtensions(output, this.opts.unknown, this.opts.proprietary, true);
    let allowedFields = void 0;
    if (!_ignoreSignStatus) {
      const status = this.signStatus();
      if (!status.addOutput || status.outputs.includes(idx))
        allowedFields = PSBTOutputUnsignedKeys;
    }
    const current = this.outputs[idx];
    const normalized = cloneDeep(this.normalizeOutput(output, current, allowedFields));
    const transactionChanged = current.amount !== normalized.amount || (current.script === void 0 ? normalized.script !== void 0 : normalized.script === void 0 || !equalBytes2(current.script, normalized.script));
    if (transactionChanged)
      this.requireTxModifiable(2, "outputs");
    this.outputs[idx] = normalized;
  }
  addOutputAddress(address, amount, network = NETWORK) {
    return this.addOutput({
      // Address.decode() only returns recognized descriptors here, but its wrapped output type
      // still carries `undefined` for coder parity, so narrow before feeding OutScript.encode().
      script: OutScript.encode(Address(network).decode(address)),
      amount
    });
  }
  // Utils
  get fee() {
    let res = _0n11;
    for (const i of this.inputs) {
      const prevOut = getPrevOut(i);
      if (!prevOut)
        throw new Error("Empty input amount");
      res += prevOut.amount;
    }
    const outputs = this.outputs.map(outputBeforeSign);
    for (const o of outputs)
      res -= o.amount;
    return res;
  }
  // Signing
  // Based on https://github.com/bitcoin/bitcoin/blob/5871b5b5ab57a0caf9b7514eb162c491c83281d5/test/functional/test_framework/script.py#L624
  // There is optimization opportunity to re-use hashes for multiple inputs for witness v0/v1,
  // but we are trying to be less complicated for audit purpose for now.
  preimageLegacy(idx, prevOutScript, hashType) {
    const { isAny, isNone, isSingle } = unpackSighash(hashType);
    if (idx < 0 || !Number.isSafeInteger(idx))
      throw new Error(`Invalid input idx=${idx}`);
    if (isSingle && idx >= this.outputs.length || idx >= this.inputs.length)
      return U256LE.encode(_1n8);
    prevOutScript = stripCodeSeparator(prevOutScript);
    let inputs = this.inputs.map(inputBeforeSign).map((input, inputIdx) => ({
      ...input,
      finalScriptSig: inputIdx === idx ? prevOutScript : EMPTY
    }));
    if (isAny)
      inputs = [inputs[idx]];
    else if (isNone || isSingle) {
      inputs = inputs.map((input, inputIdx) => ({
        ...input,
        sequence: inputIdx === idx ? input.sequence : 0
      }));
    }
    let outputs = this.outputs.map(outputBeforeSign);
    if (isNone)
      outputs = [];
    else if (isSingle) {
      outputs = outputs.slice(0, idx).fill(EMPTY_OUTPUT).concat([outputs[idx]]);
    }
    const tmpTx = RawTx.encode({
      lockTime: this.lockTime,
      version: this.version,
      segwitFlag: false,
      inputs,
      outputs
    });
    return sha256x2(tmpTx, I32LE.encode(hashType));
  }
  preimageWitnessV0(idx, prevOutScript, hashType, amount) {
    anumber(idx, "idx");
    if (idx >= this.inputs.length)
      throw new Error(`Invalid input idx=${idx}`);
    const { isAny, isNone, isSingle } = unpackSighash(hashType);
    let inputHash = EMPTY32;
    let sequenceHash = EMPTY32;
    let outputHash = EMPTY32;
    const inputs = this.inputs.map(inputBeforeSign);
    const outputs = this.outputs.map(outputBeforeSign);
    if (!isAny)
      inputHash = sha256x2(...inputs.map(TxHashIdx.encode));
    if (!isAny && !isSingle && !isNone)
      sequenceHash = sha256x2(...inputs.map((i) => U32LE.encode(i.sequence)));
    if (!isSingle && !isNone) {
      outputHash = sha256x2(...outputs.map(RawOutput.encode));
    } else if (isSingle && idx < outputs.length)
      outputHash = sha256x2(RawOutput.encode(outputs[idx]));
    const input = inputs[idx];
    return sha256x2(I32LE.encode(this.version), inputHash, sequenceHash, createBytes(32, true).encode(input.txid), U32LE.encode(input.index), VarBytes.encode(prevOutScript), U64LE.encode(amount), U32LE.encode(input.sequence), outputHash, U32LE.encode(this.lockTime), U32LE.encode(hashType));
  }
  preimageWitnessV1(idx, prevOutScript, hashType, amount, codeSeparator = -1, leafScript, leafVer = 192, annex) {
    anumber(idx, "idx");
    if (idx >= this.inputs.length)
      throw new Error(`Invalid input idx=${idx}`);
    aarray2(amount, "amount");
    aarray2(prevOutScript, "prevOutScript");
    if (this.inputs.length !== amount.length)
      throw new Error(`Invalid amounts array=${amount}`);
    if (this.inputs.length !== prevOutScript.length)
      throw new Error(`Invalid prevOutScript array=${prevOutScript}`);
    const out = [
      U8.encode(0),
      U8.encode(hashType),
      // U8 sigHash
      I32LE.encode(this.version),
      U32LE.encode(this.lockTime)
    ];
    const outType = hashType === SignatureHash.DEFAULT ? SignatureHash.ALL : hashType & 3;
    const inType = hashType & SignatureHash.ANYONECANPAY;
    const inputs = this.inputs.map(inputBeforeSign);
    const outputs = this.outputs.map(outputBeforeSign);
    if (outType === SignatureHash.SINGLE && idx >= outputs.length) {
      throw new Error(`Input with sighash SINGLE, but there is no output with corresponding index=${idx}`);
    }
    if (inType !== SignatureHash.ANYONECANPAY) {
      out.push(...[
        inputs.map(TxHashIdx.encode),
        amount.map(U64LE.encode),
        prevOutScript.map(VarBytes.encode),
        inputs.map((i) => U32LE.encode(i.sequence))
      ].map((i) => sha2562(concatBytes4(...i))));
    }
    if (outType === SignatureHash.ALL) {
      out.push(sha2562(concatBytes4(...outputs.map(RawOutput.encode))));
    }
    const spendType = (annex ? 1 : 0) | (leafScript ? 2 : 0);
    out.push(new Uint8Array([spendType]));
    if (inType === SignatureHash.ANYONECANPAY) {
      const inp = inputs[idx];
      out.push(TxHashIdx.encode(inp), U64LE.encode(amount[idx]), VarBytes.encode(prevOutScript[idx]), U32LE.encode(inp.sequence));
    } else
      out.push(U32LE.encode(idx));
    if (spendType & 1)
      out.push(sha2562(VarBytes.encode(annex || EMPTY)));
    if (outType === SignatureHash.SINGLE)
      out.push(sha2562(RawOutput.encode(outputs[idx])));
    if (leafScript)
      out.push(tapLeafHash(leafScript, leafVer), U8.encode(0), I32LE.encode(codeSeparator));
    return tagSchnorr("TapSighash", ...out);
  }
  // Signer can be privateKey OR instance of bip32 HD stuff
  signIdx(privateKey, idx, allowedSighash, _auxRand) {
    if (!isBytes5(privateKey)) {
      if (!privateKey || typeof privateKey !== "object" || typeof privateKey.deriveChild !== "function")
        throw new TypeError('"privateKey" expected Uint8Array or HDKey, got type=' + typeof privateKey);
    }
    this.checkInputIdx(idx);
    this.validatePrevoutsForSigning();
    const input = validateInput(this.inputs[idx], this.opts.disableScriptCheck);
    const inputType = getInputType(input, this.opts.allowLegacyWitnessUtxo);
    const canSign = (privateKey2) => {
      if (inputType.txType === "taproot") {
        const pubKey2 = pubSchnorr(privateKey2);
        if (input.tapInternalKey && equalBytes2(pubKey2, input.tapInternalKey))
          return true;
        if (!input.tapLeafScript)
          return false;
        for (const [_, leaf] of input.tapLeafScript) {
          for (const op of Script.decode(leaf.subarray(0, -1))) {
            if (isBytes5(op) && equalBytes2(op, pubKey2))
              return true;
          }
        }
        return false;
      }
      const pubKey = pubECDSA(privateKey2);
      const pubKeyHash = hash160(pubKey);
      for (const op of Script.decode(inputType.lastScript)) {
        if (isBytes5(op) && (equalBytes2(op, pubKey) || equalBytes2(op, pubKeyHash)))
          return true;
      }
      return false;
    };
    if (!isBytes5(privateKey)) {
      const root = privateKey;
      const deriveSigners = (label, rows, pubKey) => {
        if (!rows || !rows.length)
          throw new Error(`${label}: empty`);
        const signers2 = rows.filter((row) => row.fingerprint == root.fingerprint).map((row) => {
          let s = root;
          for (const i of row.path)
            s = s.deriveChild(i);
          if (!equalBytes2(pubKey(s), row.pubKey))
            throw new Error(`${label}: wrong pubKey`);
          if (!s.privateKey)
            throw new Error(`${label}: no privateKey`);
          return s;
        });
        if (!signers2.length)
          throw new Error(`${label}: no items with fingerprint=${root.fingerprint}`);
        return signers2;
      };
      const signers = inputType.txType === "taproot" ? (
        // BIP371 PSBT_IN_TAP_BIP32_DERIVATION stores x-only pubkeys plus `der`, so taproot HD
        // signing must derive against that map instead of legacy bip32Derivation.
        deriveSigners("tapBip32Derivation", input.tapBip32Derivation?.map(([pubKey, { der }]) => ({
          pubKey,
          fingerprint: der.fingerprint,
          path: der.path
        })), (s) => s.publicKey.slice(1))
      ) : deriveSigners("bip32Derivation", input.bip32Derivation?.map(([pubKey, der]) => ({
        pubKey,
        fingerprint: der.fingerprint,
        path: der.path
      })), (s) => s.publicKey);
      let signed = false;
      for (const s of signers) {
        if (!canSign(s.privateKey))
          continue;
        if (this.signIdx(s.privateKey, idx, allowedSighash, _auxRand))
          signed = true;
      }
      if (signed)
        return true;
      if (inputType.txType === "taproot")
        throw new Error("No taproot scripts signed");
      throw new Error(`Input script doesn't have pubKey: ${inputType.lastScript}`);
    }
    if (!allowedSighash)
      allowedSighash = [inputType.defaultSighash];
    else
      allowedSighash.forEach(validateSigHash);
    const sighash = inputType.sighash;
    if (!allowedSighash.includes(sighash)) {
      throw new Error(`Input with not allowed sigHash=${sighash}. Allowed: ${allowedSighash.join(", ")}`);
    }
    const { sigOutputs } = this.inputSighash(idx);
    if (sigOutputs === SignatureHash.SINGLE && idx >= this.outputs.length) {
      throw new Error(`Input with sighash SINGLE, but there is no output with corresponding index=${idx}`);
    }
    const prevOut = getPrevOut(input);
    if (inputType.txType === "taproot") {
      const prevOuts = this.inputs.map(getPrevOut);
      const prevOutScript = prevOuts.map((i) => i.script);
      const amount = prevOuts.map((i) => i.amount);
      let signed = false;
      let schnorrPub = pubSchnorr(privateKey);
      let merkleRoot = input.tapMerkleRoot || EMPTY;
      if (input.tapInternalKey) {
        const { pubKey, privKey } = getTaprootKeys(privateKey, schnorrPub, input.tapInternalKey, merkleRoot);
        const [taprootPubKey, _] = taprootTweakPubkey(input.tapInternalKey, merkleRoot);
        if (equalBytes2(taprootPubKey, pubKey)) {
          const hash = this.preimageWitnessV1(idx, prevOutScript, sighash, amount);
          const sig = concatBytes4(signSchnorr(hash, privKey, _auxRand), sighash !== SignatureHash.DEFAULT ? new Uint8Array([sighash]) : EMPTY);
          this.updateInput(idx, { tapKeySig: sig }, true);
          signed = true;
        }
      }
      if (input.tapLeafScript) {
        input.tapScriptSig = input.tapScriptSig || [];
        for (const [_, _script] of input.tapLeafScript) {
          const script = _script.subarray(0, -1);
          const scriptDecoded = Script.decode(script);
          const ver = _script[_script.length - 1];
          const hash = tapLeafHash(script, ver);
          const pos = scriptDecoded.findIndex((i) => isBytes5(i) && equalBytes2(i, schnorrPub));
          if (pos === -1)
            continue;
          const msg = this.preimageWitnessV1(idx, prevOutScript, sighash, amount, void 0, script, ver);
          const sig = concatBytes4(signSchnorr(msg, privateKey, _auxRand), sighash !== SignatureHash.DEFAULT ? new Uint8Array([sighash]) : EMPTY);
          this.updateInput(idx, { tapScriptSig: [[{ pubKey: schnorrPub, leafHash: hash }, sig]] }, true);
          signed = true;
        }
      }
      if (!signed)
        throw new Error("No taproot scripts signed");
      return true;
    } else {
      const pubKey = pubECDSA(privateKey);
      let hasPubkey = false;
      const pubKeyHash = hash160(pubKey);
      for (const i of Script.decode(inputType.lastScript)) {
        if (isBytes5(i) && (equalBytes2(i, pubKey) || equalBytes2(i, pubKeyHash)))
          hasPubkey = true;
      }
      if (!hasPubkey)
        throw new Error(`Input script doesn't have pubKey: ${inputType.lastScript}`);
      let hash;
      if (inputType.txType === "legacy") {
        hash = this.preimageLegacy(idx, inputType.lastScript, sighash);
      } else if (inputType.txType === "segwit") {
        let script = inputType.lastScript;
        if (inputType.last.type === "wpkh")
          script = OutScript.encode({ type: "pkh", hash: inputType.last.hash });
        hash = this.preimageWitnessV0(idx, script, sighash, prevOut.amount);
      } else
        throw new Error(`Transaction/sign: unknown tx type: ${inputType.txType}`);
      const sig = signECDSA(hash, privateKey, this.opts.lowR);
      this.updateInput(idx, {
        partialSig: [[pubKey, concatBytes4(sig, new Uint8Array([sighash]))]]
      }, true);
    }
    return true;
  }
  // This is bad API. Will work if user creates and signs tx, but if
  // there is some complex workflow with exchanging PSBT and signing them,
  // then it is better to validate which output user signs. How could a better API look like?
  // Example: user adds input, sends to another party, then signs received input (mixer etc),
  // another user can add different input for same key and user will sign it.
  // Even worse: another user can add bip32 derivation, and spend money from different address.
  // Better api: signIdx
  sign(privateKey, allowedSighash, _auxRand) {
    this.validatePrevoutsForSigning();
    let num2 = 0;
    for (let i = 0; i < this.inputs.length; i++) {
      try {
        if (this.signIdx(privateKey, i, allowedSighash, _auxRand))
          num2++;
      } catch (e) {
      }
    }
    if (!num2)
      throw new Error("No inputs signed");
    return num2;
  }
  finalizeIdx(idx) {
    this.checkInputIdx(idx);
    if (this.fee < _0n11)
      throw new Error("Outputs spends more than inputs amount");
    const input = this.inputs[idx];
    cleanExtensions(input, this.opts.unknown, this.opts.proprietary);
    cleanTxModifiable(this.global.txModifiable, this.opts.unknown);
    const inputType = getInputType(input, this.opts.allowLegacyWitnessUtxo);
    if (inputType.txType === "taproot") {
      if (input.tapKeySig)
        input.finalScriptWitness = [input.tapKeySig];
      else if (input.tapLeafScript && input.tapScriptSig) {
        const leafs = input.tapLeafScript.slice().sort((a, b) => TaprootControlBlock.encode(a[0]).length - TaprootControlBlock.encode(b[0]).length);
        let smallest;
        let smallestSize = Number.POSITIVE_INFINITY;
        let unsupported = false;
        for (const [cb, _script] of leafs) {
          const script = _script.slice(0, -1);
          const ver = _script[_script.length - 1];
          const outScript = OutScript.decode(script);
          const hash = tapLeafHash(script, ver);
          const scriptSig = input.tapScriptSig.filter((i) => equalBytes2(i[0].leafHash, hash));
          let signatures = [];
          let witness2;
          if (outScript.type === "tr_ms") {
            const m = outScript.m;
            const pubkeys = outScript.pubkeys;
            let added = 0;
            for (const pub of pubkeys) {
              const sigIdx = scriptSig.findIndex((i) => equalBytes2(i[0].pubKey, pub));
              if (added === m || sigIdx === -1) {
                signatures.push(EMPTY);
                continue;
              }
              signatures.push(scriptSig[sigIdx][1]);
              added++;
            }
            if (added !== m)
              continue;
          } else if (outScript.type === "tr_ns") {
            for (const pub of outScript.pubkeys) {
              const sigIdx = scriptSig.findIndex((i) => equalBytes2(i[0].pubKey, pub));
              if (sigIdx === -1)
                continue;
              signatures.push(scriptSig[sigIdx][1]);
            }
            if (signatures.length !== outScript.pubkeys.length)
              continue;
          } else if (outScript.type === "unknown" && this.opts.allowUnknownInputs) {
            const scriptDecoded = Script.decode(script);
            signatures = scriptSig.map(([{ pubKey }, signature]) => {
              const pos = scriptDecoded.findIndex((i) => isBytes5(i) && equalBytes2(i, pubKey));
              if (pos === -1)
                throw new Error("finalize/taproot: cannot find position of pubkey in script");
              return { signature, pos };
            }).sort((a, b) => a.pos - b.pos).map((i) => i.signature);
            if (!signatures.length)
              continue;
          } else {
            const custom = this.opts.customScripts;
            let recognized = false;
            if (custom) {
              for (const c of custom) {
                if (!c.finalizeTaproot)
                  continue;
                const scriptDecoded = Script.decode(script);
                const csEncoded = c.encode(scriptDecoded);
                if (csEncoded === void 0)
                  continue;
                recognized = true;
                const finalized = c.finalizeTaproot(script, csEncoded, scriptSig);
                if (!finalized)
                  continue;
                witness2 = finalized.concat(TaprootControlBlock.encode(cb));
                break;
              }
            }
            if (!witness2 && !recognized && scriptSig.length)
              unsupported = true;
            if (!witness2)
              continue;
          }
          witness2 ||= signatures.reverse().concat([script, TaprootControlBlock.encode(cb)]);
          const size = RawWitness.encode(witness2).length;
          if (size >= smallestSize)
            continue;
          smallest = witness2;
          smallestSize = size;
        }
        if (!smallest && unsupported)
          throw new Error("Finalize: Unknown tapLeafScript");
        if (!smallest)
          throw new Error("finalize/taproot: empty witness");
        input.finalScriptWitness = smallest;
      } else
        throw new Error("finalize/taproot: unknown input");
      delete input.finalScriptSig;
      this.cleanFinalInput(input);
      return;
    }
    if (!input.partialSig || !input.partialSig.length)
      throw new Error("Not enough partial sign");
    let inputScript = EMPTY;
    let witness = [];
    if (inputType.last.type === "ms") {
      const m = inputType.last.m;
      const pubkeys = inputType.last.pubkeys;
      let signatures = [];
      for (const pub of pubkeys) {
        const sign = input.partialSig.find((s) => equalBytes2(pub, s[0]));
        if (!sign)
          continue;
        signatures.push(sign[1]);
      }
      signatures = signatures.slice(0, m);
      if (signatures.length !== m) {
        throw new Error(`Multisig: wrong signatures count, m=${m} n=${pubkeys.length} signatures=${signatures.length}`);
      }
      inputScript = Script.encode([0, ...signatures]);
    } else if (inputType.last.type === "pk") {
      inputScript = Script.encode([input.partialSig[0][1]]);
    } else if (inputType.last.type === "pkh") {
      inputScript = Script.encode([input.partialSig[0][1], input.partialSig[0][0]]);
    } else if (inputType.last.type === "wpkh") {
      inputScript = EMPTY;
      witness = [input.partialSig[0][1], input.partialSig[0][0]];
    } else if (inputType.last.type === "unknown" && !this.opts.allowUnknownInputs)
      throw new Error("Unknown inputs not allowed");
    let finalScriptSig, finalScriptWitness;
    if (inputType.type.includes("wsh-")) {
      if (inputScript.length && inputType.lastScript.length) {
        witness = Script.decode(inputScript).map((i) => {
          if (i === 0)
            return EMPTY;
          if (isBytes5(i))
            return i;
          throw new Error(`Wrong witness op=${i}`);
        });
      }
      witness = witness.concat(inputType.lastScript);
    }
    if (inputType.txType === "segwit")
      finalScriptWitness = witness;
    if (inputType.type.startsWith("sh-wsh-")) {
      finalScriptSig = Script.encode([Script.encode([0, sha2562(inputType.lastScript)])]);
    } else if (inputType.type.startsWith("sh-")) {
      finalScriptSig = Script.encode([...Script.decode(inputScript), inputType.lastScript]);
    } else if (inputType.type.startsWith("wsh-")) {
    } else if (inputType.txType !== "segwit")
      finalScriptSig = inputScript;
    if (!finalScriptSig && !finalScriptWitness)
      throw new Error("Unknown error finalizing input");
    if (finalScriptSig)
      input.finalScriptSig = finalScriptSig;
    if (finalScriptWitness)
      input.finalScriptWitness = finalScriptWitness;
    this.cleanFinalInput(input);
  }
  finalize() {
    for (let i = 0; i < this.inputs.length; i++)
      this.finalizeIdx(i);
  }
  extract() {
    if (!this.isFinal)
      throw new Error("Transaction has unfinalized inputs");
    if (!this.outputs.length)
      throw new Error("Transaction has no outputs");
    if (this.fee < _0n11)
      throw new Error("Outputs spends more than inputs amount");
    return this.toBytes(true, true);
  }
  combine(other) {
    if (!(other instanceof _Transaction))
      throw new TypeError('"other" expected Transaction, got type=' + typeof other);
    const opts = this.opts;
    const PSBTVersion = Math.max(this.opts.PSBTVersion || 0, other.opts.PSBTVersion || 0);
    if (this.opts.version !== other.opts.version)
      throw new Error(`Transaction/combine: different version this=${this.opts.version} other=${other.opts.version}`);
    const thisV2 = this.isPSBTv2();
    const otherV2 = other.isPSBTv2();
    if (!thisV2 || !otherV2) {
      const thisLockTime = this.lockTime;
      const otherLockTime = other.lockTime;
      if (thisLockTime !== otherLockTime)
        throw new Error(`Transaction/combine: different lockTime this=${thisLockTime} other=${otherLockTime}`);
    }
    for (const k of ["inputs", "outputs"]) {
      if (this[k].length !== other[k].length) {
        throw new Error(`Transaction/combine: different ${k} length this=${this[k].length} other=${other[k].length}`);
      }
    }
    const unsignedTx = this.unsignedTx;
    if (!equalBytes2(unsignedTx, other.unsignedTx))
      throw new Error(`Transaction/combine: different unsigned tx`);
    let txModifiable;
    if (thisV2 && otherV2) {
      const policy = (tx) => {
        if (tx.global.txModifiable !== void 0)
          return cleanTxModifiable(tx.global.txModifiable, opts.unknown);
        return opts.allowMissingTxModifiable ? tx.modifiable(true, opts.unknown) : 0;
      };
      const a = policy(this);
      const b = policy(other);
      if ((a & ~7) !== (b & ~7))
        throw new Error("Transaction/combine: conflicting unknown txModifiable flags");
      txModifiable = a & ~7 | a & b & 3 | (a | b) & 4;
      if (txModifiable === 0 && this.global.txModifiable === void 0 && other.global.txModifiable === void 0 && !opts.allowMissingTxModifiable)
        txModifiable = void 0;
    } else if (thisV2)
      txModifiable = this.modifiable(opts.allowMissingTxModifiable, opts.unknown);
    else if (otherV2)
      txModifiable = other.modifiable(opts.allowMissingTxModifiable, opts.unknown);
    const thisGlobal = { ...this.global };
    const otherGlobal = { ...other.global };
    if (thisV2 !== otherV2) {
      if (!thisV2)
        delete thisGlobal.fallbackLocktime;
      if (!otherV2)
        delete otherGlobal.fallbackLocktime;
      if (!thisV2)
        delete thisGlobal.version;
      if (!otherV2)
        delete otherGlobal.version;
    }
    const fallbackLocktime = thisGlobal.fallbackLocktime !== void 0 ? thisGlobal.fallbackLocktime : otherGlobal.fallbackLocktime;
    delete thisGlobal.txModifiable;
    delete otherGlobal.txModifiable;
    delete thisGlobal.fallbackLocktime;
    delete otherGlobal.fallbackLocktime;
    const global = combineKeyMap(PSBTGlobal, thisGlobal, otherGlobal, opts.unknown, opts.proprietary);
    if (fallbackLocktime !== void 0)
      global.fallbackLocktime = fallbackLocktime;
    if (PSBTVersion)
      global.version = PSBTVersion;
    if (txModifiable === void 0)
      delete global.txModifiable;
    else
      global.txModifiable = txModifiable;
    let hasOpaqueFinalizedV0 = false;
    const inputs = this.inputs.map((current, i) => {
      const currentFinal = this.inputStatus(i) === "finalized";
      const otherFinal = other.inputStatus(i) === "finalized";
      if (!thisV2 && currentFinal || !otherV2 && otherFinal)
        hasOpaqueFinalizedV0 = true;
      if (currentFinal && otherFinal) {
        for (const k of ["finalScriptSig", "finalScriptWitness"]) {
          const currentHas = !!this.inputs[i][k]?.length;
          const otherHas = !!other.inputs[i][k]?.length;
          if (currentHas !== otherHas)
            throw new Error(`Transaction/combine: different finalized field=${k} input=${i}`);
        }
      }
      const combined = combineKeyMap(PSBTInput, current, other.inputs[i], opts.unknown, opts.proprietary);
      if (currentFinal || otherFinal)
        cleanFinalInput(combined, opts.unknown, opts.proprietary);
      return cloneDeep(normalizeInput(combined, void 0, void 0, opts.disableScriptCheck, opts.unknown, opts.proprietary));
    });
    if (hasOpaqueFinalizedV0 && global.txModifiable !== void 0)
      global.txModifiable &= ~3;
    const candidate = new _Transaction({ ...opts, PSBTVersion });
    const outputs = this.outputs.map((current, i) => {
      const combined = combineKeyMap(PSBTOutput, current, other.outputs[i], opts.unknown, opts.proprietary);
      return cloneDeep(candidate.normalizeOutput(combined));
    });
    candidate.global = global;
    candidate.inputs = inputs;
    candidate.outputs = outputs;
    if ((!thisV2 || !otherV2) && candidate.isPSBTv2())
      candidate.global.txModifiable = candidate.txModifiable;
    if (!equalBytes2(candidate.unsignedTx, unsignedTx))
      throw new Error("Transaction/combine: combined unsigned tx differs");
    this.global = candidate.global;
    this.inputs = candidate.inputs;
    this.outputs = candidate.outputs;
    return this;
  }
  clone() {
    return _Transaction.fromPSBT(this.toPSBT(), this.opts);
  }
};

// node_modules/@scure/bip32/index.js
/*! scure-bip32 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) */
var Point2 = /* @__PURE__ */ (() => secp256k1.Point)();
var Fn2 = /* @__PURE__ */ (() => Point2.Fn)();
var base58check2 = /* @__PURE__ */ createBase58check(sha256);
var MASTER_SECRET = /* @__PURE__ */ (() => {
  return Uint8Array.from("Bitcoin seed".split(""), (char) => char.charCodeAt(0));
})();
var BITCOIN_VERSIONS = { private: 76066276, public: 76067358 };
var HARDENED_OFFSET = 2147483648;
var MAX_DEPTH = 255;
var hash1602 = (data) => ripemd160(sha256(data));
var fromU32 = (data) => createView(data).getUint32(0, false);
var toU32 = (n, title = "number") => {
  if (typeof n !== "number")
    throw new TypeError(`"${title}" expected number, got type=${typeof n}`);
  if (!Number.isSafeInteger(n) || n < 0 || n > 2 ** 32 - 1)
    throw new RangeError(`"${title}" expected integer in range 0..2**32-1, got ${n}`);
  const buf = new Uint8Array(4);
  createView(buf).setUint32(0, n, false);
  return buf;
};
var validateVersions = (versions, title = "versions") => {
  if (!(typeof versions === "object" && versions !== null))
    throw new Error("versions must be an object");
  toU32(versions.private, `${title}.private`);
  toU32(versions.public, `${title}.public`);
  return versions;
};
var HDKey = class _HDKey {
  get fingerprint() {
    if (!this._pubHash) {
      throw new Error("No publicKey set!");
    }
    return fromU32(this._pubHash);
  }
  get identifier() {
    return this._pubHash ? Uint8Array.from(this._pubHash) : void 0;
  }
  get pubKeyHash() {
    return this._pubHash ? Uint8Array.from(this._pubHash) : void 0;
  }
  get privateKey() {
    return this._privateKey ? Uint8Array.from(this._privateKey) : null;
  }
  get publicKey() {
    return this._publicKey ? Uint8Array.from(this._publicKey) : null;
  }
  get chainCode() {
    return this._chainCode ? Uint8Array.from(this._chainCode) : null;
  }
  get privateExtendedKey() {
    const priv = this._privateKey;
    if (!priv) {
      throw new Error("No private key");
    }
    return base58check2.encode(this.serialize(this.versions.private, concatBytes(Uint8Array.of(0), priv)));
  }
  get publicExtendedKey() {
    if (!this._publicKey) {
      throw new Error("No public key");
    }
    return base58check2.encode(this.serialize(this.versions.public, this._publicKey));
  }
  static fromMasterSeed(seed, versions = BITCOIN_VERSIONS) {
    abytes(seed);
    versions = validateVersions(versions);
    if (8 * seed.length < 128 || 8 * seed.length > 512) {
      throw new RangeError("HDKey: seed length must be between 128 and 512 bits; 256 bits is advised, got " + seed.length);
    }
    const I = hmac(sha512, MASTER_SECRET, seed);
    const privateKey = I.slice(0, 32);
    const chainCode = I.slice(32);
    return new _HDKey({ versions, chainCode, privateKey });
  }
  static fromExtendedKey(base58key, versions = BITCOIN_VERSIONS) {
    versions = validateVersions(versions);
    const keyBuffer = base58check2.decode(base58key);
    if (keyBuffer.length !== 78) {
      throw new Error(`HDKey: invalid extended key length: expected 78 bytes, got ${keyBuffer.length}`);
    }
    const keyView = createView(keyBuffer);
    const version = keyView.getUint32(0, false);
    const opt = {
      versions,
      depth: keyBuffer[4],
      parentFingerprint: keyView.getUint32(5, false),
      index: keyView.getUint32(9, false),
      chainCode: keyBuffer.slice(13, 45)
    };
    const key = keyBuffer.slice(45);
    const isPriv = key[0] === 0;
    if (version !== versions[isPriv ? "private" : "public"]) {
      throw new Error("Version mismatch");
    }
    if (isPriv) {
      return new _HDKey({ ...opt, privateKey: key.slice(1) });
    } else {
      return new _HDKey({ ...opt, publicKey: key });
    }
  }
  static fromJSON(json) {
    return _HDKey.fromExtendedKey("xpriv" in json ? json.xpriv : json.xpub);
  }
  versions;
  depth = 0;
  index = 0;
  parentFingerprint = 0;
  _chainCode = null;
  _privateKey;
  _publicKey;
  _pubHash;
  constructor(opt) {
    if (!opt || typeof opt !== "object") {
      throw new Error("HDKey.constructor must not be called directly");
    }
    const depth = opt.depth ?? 0;
    const index = opt.index ?? 0;
    const parentFingerprint = opt.parentFingerprint ?? 0;
    if (!Number.isSafeInteger(depth) || depth < 0 || depth > MAX_DEPTH) {
      throw new RangeError("HDKey: depth must be an integer in range 0..255");
    }
    toU32(index, "index");
    toU32(parentFingerprint, "parentFingerprint");
    if (depth === 0 && (index !== 0 || parentFingerprint !== 0)) {
      throw new Error("HDKey: zero depth with non-zero index/parent fingerprint");
    }
    this.versions = opt.versions ? validateVersions(opt.versions) : BITCOIN_VERSIONS;
    this.depth = depth;
    if (opt.chainCode)
      abytes(opt.chainCode, 32);
    this._chainCode = opt.chainCode ? Uint8Array.from(opt.chainCode) : null;
    this.index = index;
    this.parentFingerprint = parentFingerprint;
    if (opt.publicKey && opt.privateKey) {
      throw new Error("HDKey: publicKey and privateKey at same time.");
    }
    if (opt.privateKey) {
      if (!secp256k1.utils.isValidSecretKey(opt.privateKey))
        throw new Error("Invalid private key");
      this._privateKey = Uint8Array.from(opt.privateKey);
      this._publicKey = secp256k1.getPublicKey(this._privateKey, true);
    } else if (opt.publicKey) {
      this._publicKey = Point2.fromBytes(opt.publicKey).toBytes(true);
    } else {
      throw new Error("HDKey: no public or private key provided");
    }
    this._pubHash = hash1602(this._publicKey);
  }
  derive(path) {
    if (!/^[mM]'?/.test(path)) {
      throw new Error('Path must start with "m" or "M"');
    }
    if (/^[mM]'?$/.test(path)) {
      return this;
    }
    const parts = path.replace(/^[mM]'?\//, "").split("/");
    if (parts.length > MAX_DEPTH - this.depth) {
      throw new Error("HDKey: path exceeds the serializable depth 255");
    }
    let child = this;
    for (const c of parts) {
      const m = /^(\d+)('?)$/.exec(c);
      const m1 = m && m[1];
      if (!m || m.length !== 3 || typeof m1 !== "string")
        throw new Error("invalid child index: " + c);
      let idx = +m1;
      if (!Number.isSafeInteger(idx) || idx >= HARDENED_OFFSET) {
        throw new Error("Invalid index");
      }
      if (m[2] === "'") {
        idx += HARDENED_OFFSET;
      }
      child = child.deriveChild(idx);
    }
    return child;
  }
  deriveChild(index) {
    return this._deriveChild(index);
  }
  /** Test-only implementation seam. Production callers must use deriveChild(). */
  _deriveChild(index, _I) {
    if (!this._publicKey || !this._chainCode) {
      throw new Error("No publicKey or chainCode set");
    }
    let data = toU32(index, "index");
    if (index >= HARDENED_OFFSET) {
      const priv = this._privateKey;
      if (!priv) {
        throw new Error("Could not derive hardened child key");
      }
      data = concatBytes(Uint8Array.of(0), priv, data);
    } else {
      data = concatBytes(this._publicKey, data);
    }
    const out = _I || hmac(sha512, this._chainCode, data);
    abytes(out, 64);
    const childTweak = out.slice(0, 32);
    const chainCode = out.slice(32);
    const opt = {
      versions: this.versions,
      chainCode,
      depth: this.depth + 1,
      parentFingerprint: this.fingerprint,
      index
    };
    if (opt.depth > MAX_DEPTH) {
      throw new Error("HDKey: depth exceeds the serializable value 255");
    }
    const retry = () => {
      const maxIndex = this._privateKey ? 2 ** 32 - 1 : HARDENED_OFFSET - 1;
      if (index >= maxIndex) {
        throw new Error(`HDKey: cannot retry child derivation at index ${index}`);
      }
      return this.deriveChild(index + 1);
    };
    const ctweak = Fn2.fromBytes(childTweak, true);
    if (!Fn2.isValid(ctweak))
      return retry();
    if (this._privateKey) {
      const added = Fn2.create(Fn2.fromBytes(this._privateKey) + ctweak);
      if (!Fn2.isValidNot0(added))
        return retry();
      opt.privateKey = Fn2.toBytes(added);
    } else {
      const point = Point2.fromBytes(this._publicKey);
      const added = ctweak === 0n ? point : point.add(Point2.BASE.multiply(ctweak));
      if (added.equals(Point2.ZERO))
        return retry();
      opt.publicKey = added.toBytes(true);
    }
    return new _HDKey(opt);
  }
  sign(hash) {
    if (!this._privateKey) {
      throw new Error("No privateKey set!");
    }
    abytes(hash, 32);
    return secp256k1.sign(hash, this._privateKey, { prehash: false });
  }
  verify(hash, signature) {
    abytes(hash, 32);
    abytes(signature, 64);
    if (!this._publicKey) {
      throw new Error("No publicKey set!");
    }
    return secp256k1.verify(signature, hash, this._publicKey, { prehash: false });
  }
  wipePrivateData() {
    if (this._privateKey) {
      this._privateKey.fill(0);
      this._privateKey = void 0;
    }
    return this;
  }
  // TODO(v3): Make automatic JSON serialization public-only so JSON.stringify cannot expose xpriv.
  toJSON() {
    return this.toPrivateJSON();
  }
  /**
   * Explicitly exports private key material. Treat the returned value as a secret.
   */
  toPrivateJSON() {
    return {
      xpriv: this.privateExtendedKey,
      xpub: this.publicExtendedKey
    };
  }
  serialize(version, key) {
    if (!this._chainCode) {
      throw new Error("No chainCode set");
    }
    abytes(key, 33);
    return concatBytes(toU32(version, "version"), new Uint8Array([this.depth]), toU32(this.parentFingerprint, "parentFingerprint"), toU32(this.index, "index"), this._chainCode, key);
  }
};

// node_modules/qrcode-generator/dist/qrcode.mjs
var qrcode = function(typeNumber, errorCorrectionLevel) {
  const PAD0 = 236;
  const PAD1 = 17;
  let _typeNumber = typeNumber;
  const _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
  let _modules = null;
  let _moduleCount = 0;
  let _dataCache = null;
  const _dataList = [];
  const _this = {};
  const makeImpl = function(test, maskPattern) {
    _moduleCount = _typeNumber * 4 + 17;
    _modules = (function(moduleCount) {
      const modules = new Array(moduleCount);
      for (let row = 0; row < moduleCount; row += 1) {
        modules[row] = new Array(moduleCount);
        for (let col = 0; col < moduleCount; col += 1) {
          modules[row][col] = null;
        }
      }
      return modules;
    })(_moduleCount);
    setupPositionProbePattern(0, 0);
    setupPositionProbePattern(_moduleCount - 7, 0);
    setupPositionProbePattern(0, _moduleCount - 7);
    setupPositionAdjustPattern();
    setupTimingPattern();
    setupTypeInfo(test, maskPattern);
    if (_typeNumber >= 7) {
      setupTypeNumber(test);
    }
    if (_dataCache == null) {
      _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
    }
    mapData(_dataCache, maskPattern);
  };
  const setupPositionProbePattern = function(row, col) {
    for (let r = -1; r <= 7; r += 1) {
      if (row + r <= -1 || _moduleCount <= row + r) continue;
      for (let c = -1; c <= 7; c += 1) {
        if (col + c <= -1 || _moduleCount <= col + c) continue;
        if (0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
          _modules[row + r][col + c] = true;
        } else {
          _modules[row + r][col + c] = false;
        }
      }
    }
  };
  const getBestMaskPattern = function() {
    let minLostPoint = 0;
    let pattern = 0;
    for (let i = 0; i < 8; i += 1) {
      makeImpl(true, i);
      const lostPoint = QRUtil.getLostPoint(_this);
      if (i == 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint;
        pattern = i;
      }
    }
    return pattern;
  };
  const setupTimingPattern = function() {
    for (let r = 8; r < _moduleCount - 8; r += 1) {
      if (_modules[r][6] != null) {
        continue;
      }
      _modules[r][6] = r % 2 == 0;
    }
    for (let c = 8; c < _moduleCount - 8; c += 1) {
      if (_modules[6][c] != null) {
        continue;
      }
      _modules[6][c] = c % 2 == 0;
    }
  };
  const setupPositionAdjustPattern = function() {
    const pos = QRUtil.getPatternPosition(_typeNumber);
    for (let i = 0; i < pos.length; i += 1) {
      for (let j = 0; j < pos.length; j += 1) {
        const row = pos[i];
        const col = pos[j];
        if (_modules[row][col] != null) {
          continue;
        }
        for (let r = -2; r <= 2; r += 1) {
          for (let c = -2; c <= 2; c += 1) {
            if (r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0) {
              _modules[row + r][col + c] = true;
            } else {
              _modules[row + r][col + c] = false;
            }
          }
        }
      }
    }
  };
  const setupTypeNumber = function(test) {
    const bits = QRUtil.getBCHTypeNumber(_typeNumber);
    for (let i = 0; i < 18; i += 1) {
      const mod2 = !test && (bits >> i & 1) == 1;
      _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod2;
    }
    for (let i = 0; i < 18; i += 1) {
      const mod2 = !test && (bits >> i & 1) == 1;
      _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod2;
    }
  };
  const setupTypeInfo = function(test, maskPattern) {
    const data = _errorCorrectionLevel << 3 | maskPattern;
    const bits = QRUtil.getBCHTypeInfo(data);
    for (let i = 0; i < 15; i += 1) {
      const mod2 = !test && (bits >> i & 1) == 1;
      if (i < 6) {
        _modules[i][8] = mod2;
      } else if (i < 8) {
        _modules[i + 1][8] = mod2;
      } else {
        _modules[_moduleCount - 15 + i][8] = mod2;
      }
    }
    for (let i = 0; i < 15; i += 1) {
      const mod2 = !test && (bits >> i & 1) == 1;
      if (i < 8) {
        _modules[8][_moduleCount - i - 1] = mod2;
      } else if (i < 9) {
        _modules[8][15 - i - 1 + 1] = mod2;
      } else {
        _modules[8][15 - i - 1] = mod2;
      }
    }
    _modules[_moduleCount - 8][8] = !test;
  };
  const mapData = function(data, maskPattern) {
    let inc = -1;
    let row = _moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;
    const maskFunc = QRUtil.getMaskFunction(maskPattern);
    for (let col = _moduleCount - 1; col > 0; col -= 2) {
      if (col == 6) col -= 1;
      while (true) {
        for (let c = 0; c < 2; c += 1) {
          if (_modules[row][col - c] == null) {
            let dark = false;
            if (byteIndex < data.length) {
              dark = (data[byteIndex] >>> bitIndex & 1) == 1;
            }
            const mask = maskFunc(row, col - c);
            if (mask) {
              dark = !dark;
            }
            _modules[row][col - c] = dark;
            bitIndex -= 1;
            if (bitIndex == -1) {
              byteIndex += 1;
              bitIndex = 7;
            }
          }
        }
        row += inc;
        if (row < 0 || _moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  };
  const createBytes2 = function(buffer, rsBlocks) {
    let offset = 0;
    let maxDcCount = 0;
    let maxEcCount = 0;
    const dcdata = new Array(rsBlocks.length);
    const ecdata = new Array(rsBlocks.length);
    for (let r = 0; r < rsBlocks.length; r += 1) {
      const dcCount = rsBlocks[r].dataCount;
      const ecCount = rsBlocks[r].totalCount - dcCount;
      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);
      dcdata[r] = new Array(dcCount);
      for (let i = 0; i < dcdata[r].length; i += 1) {
        dcdata[r][i] = 255 & buffer.getBuffer()[i + offset];
      }
      offset += dcCount;
      const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
      const rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);
      const modPoly = rawPoly.mod(rsPoly);
      ecdata[r] = new Array(rsPoly.getLength() - 1);
      for (let i = 0; i < ecdata[r].length; i += 1) {
        const modIndex = i + modPoly.getLength() - ecdata[r].length;
        ecdata[r][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
      }
    }
    let totalCodeCount = 0;
    for (let i = 0; i < rsBlocks.length; i += 1) {
      totalCodeCount += rsBlocks[i].totalCount;
    }
    const data = new Array(totalCodeCount);
    let index = 0;
    for (let i = 0; i < maxDcCount; i += 1) {
      for (let r = 0; r < rsBlocks.length; r += 1) {
        if (i < dcdata[r].length) {
          data[index] = dcdata[r][i];
          index += 1;
        }
      }
    }
    for (let i = 0; i < maxEcCount; i += 1) {
      for (let r = 0; r < rsBlocks.length; r += 1) {
        if (i < ecdata[r].length) {
          data[index] = ecdata[r][i];
          index += 1;
        }
      }
    }
    return data;
  };
  const createData = function(typeNumber2, errorCorrectionLevel2, dataList) {
    const rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, errorCorrectionLevel2);
    const buffer = qrBitBuffer();
    for (let i = 0; i < dataList.length; i += 1) {
      const data = dataList[i];
      buffer.put(data.getMode(), 4);
      buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
      data.write(buffer);
    }
    let totalDataCount = 0;
    for (let i = 0; i < rsBlocks.length; i += 1) {
      totalDataCount += rsBlocks[i].dataCount;
    }
    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw "code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")";
    }
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }
    while (buffer.getLengthInBits() % 8 != 0) {
      buffer.putBit(false);
    }
    while (true) {
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD0, 8);
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD1, 8);
    }
    return createBytes2(buffer, rsBlocks);
  };
  _this.addData = function(data, mode) {
    mode = mode || "Byte";
    let newData = null;
    switch (mode) {
      case "Numeric":
        newData = qrNumber(data);
        break;
      case "Alphanumeric":
        newData = qrAlphaNum(data);
        break;
      case "Byte":
        newData = qr8BitByte(data);
        break;
      case "Kanji":
        newData = qrKanji(data);
        break;
      default:
        throw "mode:" + mode;
    }
    _dataList.push(newData);
    _dataCache = null;
  };
  _this.isDark = function(row, col) {
    if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
      throw row + "," + col;
    }
    return _modules[row][col];
  };
  _this.getModuleCount = function() {
    return _moduleCount;
  };
  _this.make = function() {
    if (_typeNumber < 1) {
      let typeNumber2 = 1;
      for (; typeNumber2 < 40; typeNumber2++) {
        const rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, _errorCorrectionLevel);
        const buffer = qrBitBuffer();
        for (let i = 0; i < _dataList.length; i++) {
          const data = _dataList[i];
          buffer.put(data.getMode(), 4);
          buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
          data.write(buffer);
        }
        let totalDataCount = 0;
        for (let i = 0; i < rsBlocks.length; i++) {
          totalDataCount += rsBlocks[i].dataCount;
        }
        if (buffer.getLengthInBits() <= totalDataCount * 8) {
          break;
        }
      }
      _typeNumber = typeNumber2;
    }
    makeImpl(false, getBestMaskPattern());
  };
  _this.createTableTag = function(cellSize, margin) {
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    let qrHtml = "";
    qrHtml += '<table style="';
    qrHtml += " border-width: 0px; border-style: none;";
    qrHtml += " border-collapse: collapse;";
    qrHtml += " padding: 0px; margin: " + margin + "px;";
    qrHtml += '">';
    qrHtml += "<tbody>";
    for (let r = 0; r < _this.getModuleCount(); r += 1) {
      qrHtml += "<tr>";
      for (let c = 0; c < _this.getModuleCount(); c += 1) {
        qrHtml += '<td style="';
        qrHtml += " border-width: 0px; border-style: none;";
        qrHtml += " border-collapse: collapse;";
        qrHtml += " padding: 0px; margin: 0px;";
        qrHtml += " width: " + cellSize + "px;";
        qrHtml += " height: " + cellSize + "px;";
        qrHtml += " background-color: ";
        qrHtml += _this.isDark(r, c) ? "#000000" : "#ffffff";
        qrHtml += ";";
        qrHtml += '"/>';
      }
      qrHtml += "</tr>";
    }
    qrHtml += "</tbody>";
    qrHtml += "</table>";
    return qrHtml;
  };
  _this.createSvgTag = function(cellSize, margin, alt, title) {
    let opts = {};
    if (typeof arguments[0] == "object") {
      opts = arguments[0];
      cellSize = opts.cellSize;
      margin = opts.margin;
      alt = opts.alt;
      title = opts.title;
    }
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    alt = typeof alt === "string" ? { text: alt } : alt || {};
    alt.text = alt.text || null;
    alt.id = alt.text ? alt.id || "qrcode-description" : null;
    title = typeof title === "string" ? { text: title } : title || {};
    title.text = title.text || null;
    title.id = title.text ? title.id || "qrcode-title" : null;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    let c, mc, r, mr, qrSvg = "", rect;
    rect = "l" + cellSize + ",0 0," + cellSize + " -" + cellSize + ",0 0,-" + cellSize + "z ";
    qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
    qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : "";
    qrSvg += ' viewBox="0 0 ' + size + " " + size + '" ';
    qrSvg += ' preserveAspectRatio="xMinYMin meet"';
    qrSvg += title.text || alt.text ? ' role="img" aria-labelledby="' + escapeXml([title.id, alt.id].join(" ").trim()) + '"' : "";
    qrSvg += ">";
    qrSvg += title.text ? '<title id="' + escapeXml(title.id) + '">' + escapeXml(title.text) + "</title>" : "";
    qrSvg += alt.text ? '<description id="' + escapeXml(alt.id) + '">' + escapeXml(alt.text) + "</description>" : "";
    qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
    qrSvg += '<path d="';
    for (r = 0; r < _this.getModuleCount(); r += 1) {
      mr = r * cellSize + margin;
      for (c = 0; c < _this.getModuleCount(); c += 1) {
        if (_this.isDark(r, c)) {
          mc = c * cellSize + margin;
          qrSvg += "M" + mc + "," + mr + rect;
        }
      }
    }
    qrSvg += '" stroke="transparent" fill="black"/>';
    qrSvg += "</svg>";
    return qrSvg;
  };
  _this.createDataURL = function(cellSize, margin) {
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;
    return createDataURL(size, size, function(x, y) {
      if (min <= x && x < max && min <= y && y < max) {
        const c = Math.floor((x - min) / cellSize);
        const r = Math.floor((y - min) / cellSize);
        return _this.isDark(r, c) ? 0 : 1;
      } else {
        return 1;
      }
    });
  };
  _this.createImgTag = function(cellSize, margin, alt) {
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    let img = "";
    img += "<img";
    img += ' src="';
    img += _this.createDataURL(cellSize, margin);
    img += '"';
    img += ' width="';
    img += size;
    img += '"';
    img += ' height="';
    img += size;
    img += '"';
    if (alt) {
      img += ' alt="';
      img += escapeXml(alt);
      img += '"';
    }
    img += "/>";
    return img;
  };
  const escapeXml = function(s) {
    let escaped = "";
    for (let i = 0; i < s.length; i += 1) {
      const c = s.charAt(i);
      switch (c) {
        case "<":
          escaped += "&lt;";
          break;
        case ">":
          escaped += "&gt;";
          break;
        case "&":
          escaped += "&amp;";
          break;
        case '"':
          escaped += "&quot;";
          break;
        default:
          escaped += c;
          break;
      }
    }
    return escaped;
  };
  const _createHalfASCII = function(margin) {
    const cellSize = 1;
    margin = typeof margin == "undefined" ? cellSize * 2 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;
    let y, x, r1, r2, p;
    const blocks = {
      "\u2588\u2588": "\u2588",
      "\u2588 ": "\u2580",
      " \u2588": "\u2584",
      "  ": " "
    };
    const blocksLastLineNoMargin = {
      "\u2588\u2588": "\u2580",
      "\u2588 ": "\u2580",
      " \u2588": " ",
      "  ": " "
    };
    let ascii = "";
    for (y = 0; y < size; y += 2) {
      r1 = Math.floor((y - min) / cellSize);
      r2 = Math.floor((y + 1 - min) / cellSize);
      for (x = 0; x < size; x += 1) {
        p = "\u2588";
        if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
          p = " ";
        }
        if (min <= x && x < max && min <= y + 1 && y + 1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
          p += " ";
        } else {
          p += "\u2588";
        }
        ascii += margin < 1 && y + 1 >= max ? blocksLastLineNoMargin[p] : blocks[p];
      }
      ascii += "\n";
    }
    if (size % 2 && margin > 0) {
      return ascii.substring(0, ascii.length - size - 1) + Array(size + 1).join("\u2580");
    }
    return ascii.substring(0, ascii.length - 1);
  };
  _this.createASCII = function(cellSize, margin) {
    cellSize = cellSize || 1;
    if (cellSize < 2) {
      return _createHalfASCII(margin);
    }
    cellSize -= 1;
    margin = typeof margin == "undefined" ? cellSize * 2 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;
    let y, x, r, p;
    const white = Array(cellSize + 1).join("\u2588\u2588");
    const black = Array(cellSize + 1).join("  ");
    let ascii = "";
    let line = "";
    for (y = 0; y < size; y += 1) {
      r = Math.floor((y - min) / cellSize);
      line = "";
      for (x = 0; x < size; x += 1) {
        p = 1;
        if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
          p = 0;
        }
        line += p ? white : black;
      }
      for (r = 0; r < cellSize; r += 1) {
        ascii += line + "\n";
      }
    }
    return ascii.substring(0, ascii.length - 1);
  };
  _this.renderTo2dContext = function(context, cellSize) {
    cellSize = cellSize || 2;
    const length = _this.getModuleCount();
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length; col++) {
        context.fillStyle = _this.isDark(row, col) ? "black" : "white";
        context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  };
  return _this;
};
qrcode.stringToBytes = function(s) {
  const bytes = [];
  for (let i = 0; i < s.length; i += 1) {
    const c = s.charCodeAt(i);
    bytes.push(c & 255);
  }
  return bytes;
};
qrcode.createStringToBytes = function(unicodeData, numChars) {
  const unicodeMap = (function() {
    const bin = base64DecodeInputStream(unicodeData);
    const read = function() {
      const b = bin.read();
      if (b == -1) throw "eof";
      return b;
    };
    let count = 0;
    const unicodeMap2 = {};
    while (true) {
      const b0 = bin.read();
      if (b0 == -1) break;
      const b1 = read();
      const b2 = read();
      const b3 = read();
      const k = String.fromCharCode(b0 << 8 | b1);
      const v = b2 << 8 | b3;
      unicodeMap2[k] = v;
      count += 1;
    }
    if (count != numChars) {
      throw count + " != " + numChars;
    }
    return unicodeMap2;
  })();
  const unknownChar = "?".charCodeAt(0);
  return function(s) {
    const bytes = [];
    for (let i = 0; i < s.length; i += 1) {
      const c = s.charCodeAt(i);
      if (c < 128) {
        bytes.push(c);
      } else {
        const b = unicodeMap[s.charAt(i)];
        if (typeof b == "number") {
          if ((b & 255) == b) {
            bytes.push(b);
          } else {
            bytes.push(b >>> 8);
            bytes.push(b & 255);
          }
        } else {
          bytes.push(unknownChar);
        }
      }
    }
    return bytes;
  };
};
var QRMode = {
  MODE_NUMBER: 1 << 0,
  MODE_ALPHA_NUM: 1 << 1,
  MODE_8BIT_BYTE: 1 << 2,
  MODE_KANJI: 1 << 3
};
var QRErrorCorrectionLevel = {
  L: 1,
  M: 0,
  Q: 3,
  H: 2
};
var QRMaskPattern = {
  PATTERN000: 0,
  PATTERN001: 1,
  PATTERN010: 2,
  PATTERN011: 3,
  PATTERN100: 4,
  PATTERN101: 5,
  PATTERN110: 6,
  PATTERN111: 7
};
var QRUtil = (function() {
  const PATTERN_POSITION_TABLE = [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170]
  ];
  const G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
  const G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
  const G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
  const _this = {};
  const getBCHDigit = function(data) {
    let digit = 0;
    while (data != 0) {
      digit += 1;
      data >>>= 1;
    }
    return digit;
  };
  _this.getBCHTypeInfo = function(data) {
    let d = data << 10;
    while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
      d ^= G15 << getBCHDigit(d) - getBCHDigit(G15);
    }
    return (data << 10 | d) ^ G15_MASK;
  };
  _this.getBCHTypeNumber = function(data) {
    let d = data << 12;
    while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
      d ^= G18 << getBCHDigit(d) - getBCHDigit(G18);
    }
    return data << 12 | d;
  };
  _this.getPatternPosition = function(typeNumber) {
    return PATTERN_POSITION_TABLE[typeNumber - 1];
  };
  _this.getMaskFunction = function(maskPattern) {
    switch (maskPattern) {
      case QRMaskPattern.PATTERN000:
        return function(i, j) {
          return (i + j) % 2 == 0;
        };
      case QRMaskPattern.PATTERN001:
        return function(i, j) {
          return i % 2 == 0;
        };
      case QRMaskPattern.PATTERN010:
        return function(i, j) {
          return j % 3 == 0;
        };
      case QRMaskPattern.PATTERN011:
        return function(i, j) {
          return (i + j) % 3 == 0;
        };
      case QRMaskPattern.PATTERN100:
        return function(i, j) {
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
        };
      case QRMaskPattern.PATTERN101:
        return function(i, j) {
          return i * j % 2 + i * j % 3 == 0;
        };
      case QRMaskPattern.PATTERN110:
        return function(i, j) {
          return (i * j % 2 + i * j % 3) % 2 == 0;
        };
      case QRMaskPattern.PATTERN111:
        return function(i, j) {
          return (i * j % 3 + (i + j) % 2) % 2 == 0;
        };
      default:
        throw "bad maskPattern:" + maskPattern;
    }
  };
  _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
    let a = qrPolynomial([1], 0);
    for (let i = 0; i < errorCorrectLength; i += 1) {
      a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0));
    }
    return a;
  };
  _this.getLengthInBits = function(mode, type) {
    if (1 <= type && type < 10) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 10;
        case QRMode.MODE_ALPHA_NUM:
          return 9;
        case QRMode.MODE_8BIT_BYTE:
          return 8;
        case QRMode.MODE_KANJI:
          return 8;
        default:
          throw "mode:" + mode;
      }
    } else if (type < 27) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 12;
        case QRMode.MODE_ALPHA_NUM:
          return 11;
        case QRMode.MODE_8BIT_BYTE:
          return 16;
        case QRMode.MODE_KANJI:
          return 10;
        default:
          throw "mode:" + mode;
      }
    } else if (type < 41) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 14;
        case QRMode.MODE_ALPHA_NUM:
          return 13;
        case QRMode.MODE_8BIT_BYTE:
          return 16;
        case QRMode.MODE_KANJI:
          return 12;
        default:
          throw "mode:" + mode;
      }
    } else {
      throw "type:" + type;
    }
  };
  _this.getLostPoint = function(qrcode2) {
    const moduleCount = qrcode2.getModuleCount();
    let lostPoint = 0;
    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount; col += 1) {
        let sameCount = 0;
        const dark = qrcode2.isDark(row, col);
        for (let r = -1; r <= 1; r += 1) {
          if (row + r < 0 || moduleCount <= row + r) {
            continue;
          }
          for (let c = -1; c <= 1; c += 1) {
            if (col + c < 0 || moduleCount <= col + c) {
              continue;
            }
            if (r == 0 && c == 0) {
              continue;
            }
            if (dark == qrcode2.isDark(row + r, col + c)) {
              sameCount += 1;
            }
          }
        }
        if (sameCount > 5) {
          lostPoint += 3 + sameCount - 5;
        }
      }
    }
    ;
    for (let row = 0; row < moduleCount - 1; row += 1) {
      for (let col = 0; col < moduleCount - 1; col += 1) {
        let count = 0;
        if (qrcode2.isDark(row, col)) count += 1;
        if (qrcode2.isDark(row + 1, col)) count += 1;
        if (qrcode2.isDark(row, col + 1)) count += 1;
        if (qrcode2.isDark(row + 1, col + 1)) count += 1;
        if (count == 0 || count == 4) {
          lostPoint += 3;
        }
      }
    }
    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount - 6; col += 1) {
        if (qrcode2.isDark(row, col) && !qrcode2.isDark(row, col + 1) && qrcode2.isDark(row, col + 2) && qrcode2.isDark(row, col + 3) && qrcode2.isDark(row, col + 4) && !qrcode2.isDark(row, col + 5) && qrcode2.isDark(row, col + 6)) {
          lostPoint += 40;
        }
      }
    }
    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount - 6; row += 1) {
        if (qrcode2.isDark(row, col) && !qrcode2.isDark(row + 1, col) && qrcode2.isDark(row + 2, col) && qrcode2.isDark(row + 3, col) && qrcode2.isDark(row + 4, col) && !qrcode2.isDark(row + 5, col) && qrcode2.isDark(row + 6, col)) {
          lostPoint += 40;
        }
      }
    }
    let darkCount = 0;
    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount; row += 1) {
        if (qrcode2.isDark(row, col)) {
          darkCount += 1;
        }
      }
    }
    const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
    lostPoint += ratio * 10;
    return lostPoint;
  };
  return _this;
})();
var QRMath = (function() {
  const EXP_TABLE = new Array(256);
  const LOG_TABLE = new Array(256);
  for (let i = 0; i < 8; i += 1) {
    EXP_TABLE[i] = 1 << i;
  }
  for (let i = 8; i < 256; i += 1) {
    EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
  }
  for (let i = 0; i < 255; i += 1) {
    LOG_TABLE[EXP_TABLE[i]] = i;
  }
  const _this = {};
  _this.glog = function(n) {
    if (n < 1) {
      throw "glog(" + n + ")";
    }
    return LOG_TABLE[n];
  };
  _this.gexp = function(n) {
    while (n < 0) {
      n += 255;
    }
    while (n >= 256) {
      n -= 255;
    }
    return EXP_TABLE[n];
  };
  return _this;
})();
var qrPolynomial = function(num2, shift) {
  if (typeof num2.length == "undefined") {
    throw num2.length + "/" + shift;
  }
  const _num = (function() {
    let offset = 0;
    while (offset < num2.length && num2[offset] == 0) {
      offset += 1;
    }
    const _num2 = new Array(num2.length - offset + shift);
    for (let i = 0; i < num2.length - offset; i += 1) {
      _num2[i] = num2[i + offset];
    }
    return _num2;
  })();
  const _this = {};
  _this.getAt = function(index) {
    return _num[index];
  };
  _this.getLength = function() {
    return _num.length;
  };
  _this.multiply = function(e) {
    const num3 = new Array(_this.getLength() + e.getLength() - 1);
    for (let i = 0; i < _this.getLength(); i += 1) {
      for (let j = 0; j < e.getLength(); j += 1) {
        num3[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i)) + QRMath.glog(e.getAt(j)));
      }
    }
    return qrPolynomial(num3, 0);
  };
  _this.mod = function(e) {
    if (_this.getLength() - e.getLength() < 0) {
      return _this;
    }
    const ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e.getAt(0));
    const num3 = new Array(_this.getLength());
    for (let i = 0; i < _this.getLength(); i += 1) {
      num3[i] = _this.getAt(i);
    }
    for (let i = 0; i < e.getLength(); i += 1) {
      num3[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i)) + ratio);
    }
    return qrPolynomial(num3, 0).mod(e);
  };
  return _this;
};
var QRRSBlock = (function() {
  const RS_BLOCK_TABLE = [
    // L
    // M
    // Q
    // H
    // 1
    [1, 26, 19],
    [1, 26, 16],
    [1, 26, 13],
    [1, 26, 9],
    // 2
    [1, 44, 34],
    [1, 44, 28],
    [1, 44, 22],
    [1, 44, 16],
    // 3
    [1, 70, 55],
    [1, 70, 44],
    [2, 35, 17],
    [2, 35, 13],
    // 4
    [1, 100, 80],
    [2, 50, 32],
    [2, 50, 24],
    [4, 25, 9],
    // 5
    [1, 134, 108],
    [2, 67, 43],
    [2, 33, 15, 2, 34, 16],
    [2, 33, 11, 2, 34, 12],
    // 6
    [2, 86, 68],
    [4, 43, 27],
    [4, 43, 19],
    [4, 43, 15],
    // 7
    [2, 98, 78],
    [4, 49, 31],
    [2, 32, 14, 4, 33, 15],
    [4, 39, 13, 1, 40, 14],
    // 8
    [2, 121, 97],
    [2, 60, 38, 2, 61, 39],
    [4, 40, 18, 2, 41, 19],
    [4, 40, 14, 2, 41, 15],
    // 9
    [2, 146, 116],
    [3, 58, 36, 2, 59, 37],
    [4, 36, 16, 4, 37, 17],
    [4, 36, 12, 4, 37, 13],
    // 10
    [2, 86, 68, 2, 87, 69],
    [4, 69, 43, 1, 70, 44],
    [6, 43, 19, 2, 44, 20],
    [6, 43, 15, 2, 44, 16],
    // 11
    [4, 101, 81],
    [1, 80, 50, 4, 81, 51],
    [4, 50, 22, 4, 51, 23],
    [3, 36, 12, 8, 37, 13],
    // 12
    [2, 116, 92, 2, 117, 93],
    [6, 58, 36, 2, 59, 37],
    [4, 46, 20, 6, 47, 21],
    [7, 42, 14, 4, 43, 15],
    // 13
    [4, 133, 107],
    [8, 59, 37, 1, 60, 38],
    [8, 44, 20, 4, 45, 21],
    [12, 33, 11, 4, 34, 12],
    // 14
    [3, 145, 115, 1, 146, 116],
    [4, 64, 40, 5, 65, 41],
    [11, 36, 16, 5, 37, 17],
    [11, 36, 12, 5, 37, 13],
    // 15
    [5, 109, 87, 1, 110, 88],
    [5, 65, 41, 5, 66, 42],
    [5, 54, 24, 7, 55, 25],
    [11, 36, 12, 7, 37, 13],
    // 16
    [5, 122, 98, 1, 123, 99],
    [7, 73, 45, 3, 74, 46],
    [15, 43, 19, 2, 44, 20],
    [3, 45, 15, 13, 46, 16],
    // 17
    [1, 135, 107, 5, 136, 108],
    [10, 74, 46, 1, 75, 47],
    [1, 50, 22, 15, 51, 23],
    [2, 42, 14, 17, 43, 15],
    // 18
    [5, 150, 120, 1, 151, 121],
    [9, 69, 43, 4, 70, 44],
    [17, 50, 22, 1, 51, 23],
    [2, 42, 14, 19, 43, 15],
    // 19
    [3, 141, 113, 4, 142, 114],
    [3, 70, 44, 11, 71, 45],
    [17, 47, 21, 4, 48, 22],
    [9, 39, 13, 16, 40, 14],
    // 20
    [3, 135, 107, 5, 136, 108],
    [3, 67, 41, 13, 68, 42],
    [15, 54, 24, 5, 55, 25],
    [15, 43, 15, 10, 44, 16],
    // 21
    [4, 144, 116, 4, 145, 117],
    [17, 68, 42],
    [17, 50, 22, 6, 51, 23],
    [19, 46, 16, 6, 47, 17],
    // 22
    [2, 139, 111, 7, 140, 112],
    [17, 74, 46],
    [7, 54, 24, 16, 55, 25],
    [34, 37, 13],
    // 23
    [4, 151, 121, 5, 152, 122],
    [4, 75, 47, 14, 76, 48],
    [11, 54, 24, 14, 55, 25],
    [16, 45, 15, 14, 46, 16],
    // 24
    [6, 147, 117, 4, 148, 118],
    [6, 73, 45, 14, 74, 46],
    [11, 54, 24, 16, 55, 25],
    [30, 46, 16, 2, 47, 17],
    // 25
    [8, 132, 106, 4, 133, 107],
    [8, 75, 47, 13, 76, 48],
    [7, 54, 24, 22, 55, 25],
    [22, 45, 15, 13, 46, 16],
    // 26
    [10, 142, 114, 2, 143, 115],
    [19, 74, 46, 4, 75, 47],
    [28, 50, 22, 6, 51, 23],
    [33, 46, 16, 4, 47, 17],
    // 27
    [8, 152, 122, 4, 153, 123],
    [22, 73, 45, 3, 74, 46],
    [8, 53, 23, 26, 54, 24],
    [12, 45, 15, 28, 46, 16],
    // 28
    [3, 147, 117, 10, 148, 118],
    [3, 73, 45, 23, 74, 46],
    [4, 54, 24, 31, 55, 25],
    [11, 45, 15, 31, 46, 16],
    // 29
    [7, 146, 116, 7, 147, 117],
    [21, 73, 45, 7, 74, 46],
    [1, 53, 23, 37, 54, 24],
    [19, 45, 15, 26, 46, 16],
    // 30
    [5, 145, 115, 10, 146, 116],
    [19, 75, 47, 10, 76, 48],
    [15, 54, 24, 25, 55, 25],
    [23, 45, 15, 25, 46, 16],
    // 31
    [13, 145, 115, 3, 146, 116],
    [2, 74, 46, 29, 75, 47],
    [42, 54, 24, 1, 55, 25],
    [23, 45, 15, 28, 46, 16],
    // 32
    [17, 145, 115],
    [10, 74, 46, 23, 75, 47],
    [10, 54, 24, 35, 55, 25],
    [19, 45, 15, 35, 46, 16],
    // 33
    [17, 145, 115, 1, 146, 116],
    [14, 74, 46, 21, 75, 47],
    [29, 54, 24, 19, 55, 25],
    [11, 45, 15, 46, 46, 16],
    // 34
    [13, 145, 115, 6, 146, 116],
    [14, 74, 46, 23, 75, 47],
    [44, 54, 24, 7, 55, 25],
    [59, 46, 16, 1, 47, 17],
    // 35
    [12, 151, 121, 7, 152, 122],
    [12, 75, 47, 26, 76, 48],
    [39, 54, 24, 14, 55, 25],
    [22, 45, 15, 41, 46, 16],
    // 36
    [6, 151, 121, 14, 152, 122],
    [6, 75, 47, 34, 76, 48],
    [46, 54, 24, 10, 55, 25],
    [2, 45, 15, 64, 46, 16],
    // 37
    [17, 152, 122, 4, 153, 123],
    [29, 74, 46, 14, 75, 47],
    [49, 54, 24, 10, 55, 25],
    [24, 45, 15, 46, 46, 16],
    // 38
    [4, 152, 122, 18, 153, 123],
    [13, 74, 46, 32, 75, 47],
    [48, 54, 24, 14, 55, 25],
    [42, 45, 15, 32, 46, 16],
    // 39
    [20, 147, 117, 4, 148, 118],
    [40, 75, 47, 7, 76, 48],
    [43, 54, 24, 22, 55, 25],
    [10, 45, 15, 67, 46, 16],
    // 40
    [19, 148, 118, 6, 149, 119],
    [18, 75, 47, 31, 76, 48],
    [34, 54, 24, 34, 55, 25],
    [20, 45, 15, 61, 46, 16]
  ];
  const qrRSBlock = function(totalCount, dataCount) {
    const _this2 = {};
    _this2.totalCount = totalCount;
    _this2.dataCount = dataCount;
    return _this2;
  };
  const _this = {};
  const getRsBlockTable = function(typeNumber, errorCorrectionLevel) {
    switch (errorCorrectionLevel) {
      case QRErrorCorrectionLevel.L:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectionLevel.M:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectionLevel.Q:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectionLevel.H:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default:
        return void 0;
    }
  };
  _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {
    const rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);
    if (typeof rsBlock == "undefined") {
      throw "bad rs block @ typeNumber:" + typeNumber + "/errorCorrectionLevel:" + errorCorrectionLevel;
    }
    const length = rsBlock.length / 3;
    const list = [];
    for (let i = 0; i < length; i += 1) {
      const count = rsBlock[i * 3 + 0];
      const totalCount = rsBlock[i * 3 + 1];
      const dataCount = rsBlock[i * 3 + 2];
      for (let j = 0; j < count; j += 1) {
        list.push(qrRSBlock(totalCount, dataCount));
      }
    }
    return list;
  };
  return _this;
})();
var qrBitBuffer = function() {
  const _buffer = [];
  let _length = 0;
  const _this = {};
  _this.getBuffer = function() {
    return _buffer;
  };
  _this.getAt = function(index) {
    const bufIndex = Math.floor(index / 8);
    return (_buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
  };
  _this.put = function(num2, length) {
    for (let i = 0; i < length; i += 1) {
      _this.putBit((num2 >>> length - i - 1 & 1) == 1);
    }
  };
  _this.getLengthInBits = function() {
    return _length;
  };
  _this.putBit = function(bit) {
    const bufIndex = Math.floor(_length / 8);
    if (_buffer.length <= bufIndex) {
      _buffer.push(0);
    }
    if (bit) {
      _buffer[bufIndex] |= 128 >>> _length % 8;
    }
    _length += 1;
  };
  return _this;
};
var qrNumber = function(data) {
  const _mode = QRMode.MODE_NUMBER;
  const _data = data;
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer) {
    return _data.length;
  };
  _this.write = function(buffer) {
    const data2 = _data;
    let i = 0;
    while (i + 2 < data2.length) {
      buffer.put(strToNum(data2.substring(i, i + 3)), 10);
      i += 3;
    }
    if (i < data2.length) {
      if (data2.length - i == 1) {
        buffer.put(strToNum(data2.substring(i, i + 1)), 4);
      } else if (data2.length - i == 2) {
        buffer.put(strToNum(data2.substring(i, i + 2)), 7);
      }
    }
  };
  const strToNum = function(s) {
    let num2 = 0;
    for (let i = 0; i < s.length; i += 1) {
      num2 = num2 * 10 + chatToNum(s.charAt(i));
    }
    return num2;
  };
  const chatToNum = function(c) {
    if ("0" <= c && c <= "9") {
      return c.charCodeAt(0) - "0".charCodeAt(0);
    }
    throw "illegal char :" + c;
  };
  return _this;
};
var qrAlphaNum = function(data) {
  const _mode = QRMode.MODE_ALPHA_NUM;
  const _data = data;
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer) {
    return _data.length;
  };
  _this.write = function(buffer) {
    const s = _data;
    let i = 0;
    while (i + 1 < s.length) {
      buffer.put(
        getCode(s.charAt(i)) * 45 + getCode(s.charAt(i + 1)),
        11
      );
      i += 2;
    }
    if (i < s.length) {
      buffer.put(getCode(s.charAt(i)), 6);
    }
  };
  const getCode = function(c) {
    if ("0" <= c && c <= "9") {
      return c.charCodeAt(0) - "0".charCodeAt(0);
    } else if ("A" <= c && c <= "Z") {
      return c.charCodeAt(0) - "A".charCodeAt(0) + 10;
    } else {
      switch (c) {
        case " ":
          return 36;
        case "$":
          return 37;
        case "%":
          return 38;
        case "*":
          return 39;
        case "+":
          return 40;
        case "-":
          return 41;
        case ".":
          return 42;
        case "/":
          return 43;
        case ":":
          return 44;
        default:
          throw "illegal char :" + c;
      }
    }
  };
  return _this;
};
var qr8BitByte = function(data) {
  const _mode = QRMode.MODE_8BIT_BYTE;
  const _data = data;
  const _bytes = qrcode.stringToBytes(data);
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer) {
    return _bytes.length;
  };
  _this.write = function(buffer) {
    for (let i = 0; i < _bytes.length; i += 1) {
      buffer.put(_bytes[i], 8);
    }
  };
  return _this;
};
var qrKanji = function(data) {
  const _mode = QRMode.MODE_KANJI;
  const _data = data;
  const stringToBytes2 = qrcode.stringToBytes;
  !(function(c, code) {
    const test = stringToBytes2(c);
    if (test.length != 2 || (test[0] << 8 | test[1]) != code) {
      throw "sjis not supported.";
    }
  })("\u53CB", 38726);
  const _bytes = stringToBytes2(data);
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer) {
    return ~~(_bytes.length / 2);
  };
  _this.write = function(buffer) {
    const data2 = _bytes;
    let i = 0;
    while (i + 1 < data2.length) {
      let c = (255 & data2[i]) << 8 | 255 & data2[i + 1];
      if (33088 <= c && c <= 40956) {
        c -= 33088;
      } else if (57408 <= c && c <= 60351) {
        c -= 49472;
      } else {
        throw "illegal char at " + (i + 1) + "/" + c;
      }
      c = (c >>> 8 & 255) * 192 + (c & 255);
      buffer.put(c, 13);
      i += 2;
    }
    if (i < data2.length) {
      throw "illegal char at " + (i + 1);
    }
  };
  return _this;
};
var byteArrayOutputStream = function() {
  const _bytes = [];
  const _this = {};
  _this.writeByte = function(b) {
    _bytes.push(b & 255);
  };
  _this.writeShort = function(i) {
    _this.writeByte(i);
    _this.writeByte(i >>> 8);
  };
  _this.writeBytes = function(b, off, len) {
    off = off || 0;
    len = len || b.length;
    for (let i = 0; i < len; i += 1) {
      _this.writeByte(b[i + off]);
    }
  };
  _this.writeString = function(s) {
    for (let i = 0; i < s.length; i += 1) {
      _this.writeByte(s.charCodeAt(i));
    }
  };
  _this.toByteArray = function() {
    return _bytes;
  };
  _this.toString = function() {
    let s = "";
    s += "[";
    for (let i = 0; i < _bytes.length; i += 1) {
      if (i > 0) {
        s += ",";
      }
      s += _bytes[i];
    }
    s += "]";
    return s;
  };
  return _this;
};
var base64EncodeOutputStream = function() {
  let _buffer = 0;
  let _buflen = 0;
  let _length = 0;
  let _base64 = "";
  const _this = {};
  const writeEncoded = function(b) {
    _base64 += String.fromCharCode(encode(b & 63));
  };
  const encode = function(n) {
    if (n < 0) {
      throw "n:" + n;
    } else if (n < 26) {
      return 65 + n;
    } else if (n < 52) {
      return 97 + (n - 26);
    } else if (n < 62) {
      return 48 + (n - 52);
    } else if (n == 62) {
      return 43;
    } else if (n == 63) {
      return 47;
    } else {
      throw "n:" + n;
    }
  };
  _this.writeByte = function(n) {
    _buffer = _buffer << 8 | n & 255;
    _buflen += 8;
    _length += 1;
    while (_buflen >= 6) {
      writeEncoded(_buffer >>> _buflen - 6);
      _buflen -= 6;
    }
  };
  _this.flush = function() {
    if (_buflen > 0) {
      writeEncoded(_buffer << 6 - _buflen);
      _buffer = 0;
      _buflen = 0;
    }
    if (_length % 3 != 0) {
      const padlen = 3 - _length % 3;
      for (let i = 0; i < padlen; i += 1) {
        _base64 += "=";
      }
    }
  };
  _this.toString = function() {
    return _base64;
  };
  return _this;
};
var base64DecodeInputStream = function(str) {
  const _str = str;
  let _pos = 0;
  let _buffer = 0;
  let _buflen = 0;
  const _this = {};
  _this.read = function() {
    while (_buflen < 8) {
      if (_pos >= _str.length) {
        if (_buflen == 0) {
          return -1;
        }
        throw "unexpected end of file./" + _buflen;
      }
      const c = _str.charAt(_pos);
      _pos += 1;
      if (c == "=") {
        _buflen = 0;
        return -1;
      } else if (c.match(/^\s$/)) {
        continue;
      }
      _buffer = _buffer << 6 | decode(c.charCodeAt(0));
      _buflen += 6;
    }
    const n = _buffer >>> _buflen - 8 & 255;
    _buflen -= 8;
    return n;
  };
  const decode = function(c) {
    if (65 <= c && c <= 90) {
      return c - 65;
    } else if (97 <= c && c <= 122) {
      return c - 97 + 26;
    } else if (48 <= c && c <= 57) {
      return c - 48 + 52;
    } else if (c == 43) {
      return 62;
    } else if (c == 47) {
      return 63;
    } else {
      throw "c:" + c;
    }
  };
  return _this;
};
var gifImage = function(width, height) {
  const _width = width;
  const _height = height;
  const _data = new Array(width * height);
  const _this = {};
  _this.setPixel = function(x, y, pixel) {
    _data[y * _width + x] = pixel;
  };
  _this.write = function(out) {
    out.writeString("GIF87a");
    out.writeShort(_width);
    out.writeShort(_height);
    out.writeByte(128);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(255);
    out.writeByte(255);
    out.writeByte(255);
    out.writeString(",");
    out.writeShort(0);
    out.writeShort(0);
    out.writeShort(_width);
    out.writeShort(_height);
    out.writeByte(0);
    const lzwMinCodeSize = 2;
    const raster = getLZWRaster(lzwMinCodeSize);
    out.writeByte(lzwMinCodeSize);
    let offset = 0;
    while (raster.length - offset > 255) {
      out.writeByte(255);
      out.writeBytes(raster, offset, 255);
      offset += 255;
    }
    out.writeByte(raster.length - offset);
    out.writeBytes(raster, offset, raster.length - offset);
    out.writeByte(0);
    out.writeString(";");
  };
  const bitOutputStream = function(out) {
    const _out = out;
    let _bitLength = 0;
    let _bitBuffer = 0;
    const _this2 = {};
    _this2.write = function(data, length) {
      if (data >>> length != 0) {
        throw "length over";
      }
      while (_bitLength + length >= 8) {
        _out.writeByte(255 & (data << _bitLength | _bitBuffer));
        length -= 8 - _bitLength;
        data >>>= 8 - _bitLength;
        _bitBuffer = 0;
        _bitLength = 0;
      }
      _bitBuffer = data << _bitLength | _bitBuffer;
      _bitLength = _bitLength + length;
    };
    _this2.flush = function() {
      if (_bitLength > 0) {
        _out.writeByte(_bitBuffer);
      }
    };
    return _this2;
  };
  const getLZWRaster = function(lzwMinCodeSize) {
    const clearCode = 1 << lzwMinCodeSize;
    const endCode = (1 << lzwMinCodeSize) + 1;
    let bitLength = lzwMinCodeSize + 1;
    const table = lzwTable();
    for (let i = 0; i < clearCode; i += 1) {
      table.add(String.fromCharCode(i));
    }
    table.add(String.fromCharCode(clearCode));
    table.add(String.fromCharCode(endCode));
    const byteOut = byteArrayOutputStream();
    const bitOut = bitOutputStream(byteOut);
    bitOut.write(clearCode, bitLength);
    let dataIndex = 0;
    let s = String.fromCharCode(_data[dataIndex]);
    dataIndex += 1;
    while (dataIndex < _data.length) {
      const c = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;
      if (table.contains(s + c)) {
        s = s + c;
      } else {
        bitOut.write(table.indexOf(s), bitLength);
        if (table.size() < 4095) {
          if (table.size() == 1 << bitLength) {
            bitLength += 1;
          }
          table.add(s + c);
        }
        s = c;
      }
    }
    bitOut.write(table.indexOf(s), bitLength);
    bitOut.write(endCode, bitLength);
    bitOut.flush();
    return byteOut.toByteArray();
  };
  const lzwTable = function() {
    const _map = {};
    let _size = 0;
    const _this2 = {};
    _this2.add = function(key) {
      if (_this2.contains(key)) {
        throw "dup key:" + key;
      }
      _map[key] = _size;
      _size += 1;
    };
    _this2.size = function() {
      return _size;
    };
    _this2.indexOf = function(key) {
      return _map[key];
    };
    _this2.contains = function(key) {
      return typeof _map[key] != "undefined";
    };
    return _this2;
  };
  return _this;
};
var createDataURL = function(width, height, getPixel) {
  const gif = gifImage(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      gif.setPixel(x, y, getPixel(x, y));
    }
  }
  const b = byteArrayOutputStream();
  gif.write(b);
  const base642 = base64EncodeOutputStream();
  const bytes = b.toByteArray();
  for (let i = 0; i < bytes.length; i += 1) {
    base642.writeByte(bytes[i]);
  }
  base642.flush();
  return "data:image/gif;base64," + base642;
};
var qrcode_default = qrcode;
var stringToBytes = qrcode.stringToBytes;

// entry.js
var import_jsqr = __toESM(require_jsQR(), 1);
var export_jsQR = import_jsqr.default;
export {
  Address,
  Decimal,
  HDKey,
  NETWORK,
  OutScript,
  RawTx,
  SigHash,
  TEST_NETWORK,
  Transaction,
  base64,
  createBase58check,
  hex,
  export_jsQR as jsQR,
  p2ms,
  p2wsh,
  qrcode_default as qrcode,
  secp256k1,
  sha256
};
