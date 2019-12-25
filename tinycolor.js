// TinyColor v2.0.1
// https://github.com/chingcm/TinyColor
// Dem Ching, MIT License

// Original from TinyColor v1.4.1
// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License

(function(Math) {

var trimLeft = /^\s+/,
    trimRight = /\s+$/,
    tinyCounter = 0,
    mathRound = Math.round,
    mathMin = Math.min,
    mathMax = Math.max,
    mathRandom = Math.random;

function tinycolor (color, opts) {

    color = (color) ? color : '';
    opts = opts || { };

    // If input is already a tinycolor, return itself
    if (color instanceof tinycolor) {
       return color;
    }
    // If we are called as a function, call using new instead
    if (!(this instanceof tinycolor)) {
        return new tinycolor(color, opts);
    }

    var rgb = inputToRGB(color);
    this._originalInput = color;
    this._r = rgb.r;
    this._g = rgb.g;
    this._b = rgb.b;
    this._a = rgb.a;
    this._roundA = mathRound(100*this._a) / 100;
    this._format = opts.format || rgb.format;
    this._gradientType = opts.gradientType;

    // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
    if (this._r < 1) { this._r = mathRound(this._r); }
    if (this._g < 1) { this._g = mathRound(this._g); }
    if (this._b < 1) { this._b = mathRound(this._b); }

    this._ok = rgb.ok;
    this._tc_id = tinyCounter++;
}

tinycolor.prototype = {
    isDark: function() {
        return this.getBrightness() < 128;
    },
    isLight: function() {
        return !this.isDark();
    },
    isValid: function() {
        return this._ok;
    },
    getOriginalInput: function() {
      return this._originalInput;
    },
    getFormat: function() {
        return this._format;
    },
    getAlpha: function() {
        return this._a;
    },
    getBrightness: function() {
        //http://www.w3.org/TR/AERT#color-contrast
        var rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    },
    getLuminance: function() {
        //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        var rgb = this.toRgb();
        var RsRGB, GsRGB, BsRGB, R, G, B;
        RsRGB = rgb.r/255;
        GsRGB = rgb.g/255;
        BsRGB = rgb.b/255;

        if (RsRGB <= 0.03928) {R = RsRGB / 12.92;} else {R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);}
        if (GsRGB <= 0.03928) {G = GsRGB / 12.92;} else {G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);}
        if (BsRGB <= 0.03928) {B = BsRGB / 12.92;} else {B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);}
        return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
    },
    setAlpha: function(value) {
        this._a = boundAlpha(value);
        this._roundA = mathRound(100*this._a) / 100;
        return this;
    },
    toHsv: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
    },
    toHsvString: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
        return (this._a == 1) ?
          "hsv("  + h + ", " + s + "%, " + v + "%)" :
          "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
    },
    toHsl: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
    },
    toHslString: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
        return (this._a == 1) ?
          "hsl("  + h + ", " + s + "%, " + l + "%)" :
          "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
    },
    toHex: function(allow3Char) {
        return rgbToHex(this._r, this._g, this._b, allow3Char);
    },
    toHexString: function(allow3Char) {
        return '#' + this.toHex(allow3Char);
    },
    toHex8: function(allow4Char) {
        return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
    },
    toHex8String: function(allow4Char) {
        return '#' + this.toHex8(allow4Char);
    },
    toRgb: function() {
        return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
    },
    toRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
          "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
    },
    toPercentageRgb: function() {
        return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
    },
    toPercentageRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
          "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
    },
    toCmy: function() {
        var cmy = rgbToCmy(this._r, this._g, this._b);
        return { c: cmy.c * 100, m: cmy.m * 100, y: cmy.y * 100 };
    },
    toCmyString: function() {
        var cmy = rgbToCmy(this._r, this._g, this._b),
            c = mathRound(cmy.c * 100), m = mathRound(cmy.m * 100), y = mathRound(cmy.y * 100);
        return "cmy("  + c + "%, " + m + "%, " + y + "%)";
    },
    toCmyk: function() {
        var cmyk = rgbToCmyk(this._r, this._g, this._b);
        return { c: cmyk.c * 100, m: cmyk.m * 100, y: cmyk.y * 100, k: cmyk.k * 100 };
    },
    toCmykString: function() {
        var cmyk = rgbToCmyk(this._r, this._g, this._b),
            c = mathRound(cmyk.c * 100), m = mathRound(cmyk.m * 100), y = mathRound(cmyk.y * 100), k = mathRound(cmyk.k * 100);
        return "cmyk("  + c + "%, " + m + "%, " + y + "%, " + k + "%)";
    },
    toHwb: function() {
        var hwb = rgbToHwb(this._r, this._g, this._b);
        return { h: hwb.h * 360, w: hwb.w, b: hwb.b, a: this._a };
    },
    toHwbString: function() {
        var hwb = rgbToHwb(this._r, this._g, this._b);
        var h = mathRound(hwb.h * 360), w = mathRound(hwb.w * 100), b = mathRound(hwb.b * 100);
        return (this._a == 1) ?
            "hwb("  + h + ", " + w + "%, " + b + "%)" :
            "hwba(" + h + ", " + w + "%, " + b + "%, "+ this._roundA + ")";
    },
    toNcol: function() {
        var ncol = rgbToNcol(this._r, this._g, this._b);
        return { n: ncol.n, w: ncol.w, b: ncol.b, a: this._a };
    },
    toNcolString: function() {
        var ncol = rgbToNcol(this._r, this._g, this._b);
        var n = ncol.n, w = mathRound(ncol.w * 100), b = mathRound(ncol.b * 100);
        return (this._a == 1) ?
            n + ", " + w + "%, " + b + "%" :
            n + ", " + w + "%, " + b + "%, "+ this._roundA;
    },
    toNcs: function() {
        var ncs = rgbToNcs(this._r, this._g, this._b);
        return { s: ncs.s, c: ncs.c, n: ncs.n.toUpperCase() };
    },
    toNcsString: function() {
        var ncs = rgbToNcs(this._r, this._g, this._b);
        return ncsToString(ncs.s, ncs.c, ncs.n);
    },
    toXyz: function() {
        var xyz = rgbToXyz(this._r, this._g, this._b);
        return { x: xyz.x * 100, y: xyz.y * 100, z: xyz.z * 100 };
    },
    toXyzString: function() {
        var xyz = rgbToXyz(this._r, this._g, this._b),
            x = (xyz.x * 100).toFixed(2), y = (xyz.y * 100).toFixed(2), z = (xyz.z * 100).toFixed(2);
        return "xyz(" + x + ", " + y + ", " + z + ")";
    },
    toLab: function() {
        var lab = rgbToLab(this._r, this._g, this._b);
        return { l: lab.l, a: lab.a, b: lab.b };
    },
    toLabString: function() {
        var lab = rgbToLab(this._r, this._g, this._b),
            l = lab.l.toFixed(2), a = lab.a.toFixed(2), b = lab.b.toFixed(2);
        return "lab(" + l + ", " + a + ", " + b + ")";
    },
    toName: function() {
        if (this._a === 0) {
            return "transparent";
        }

        if (this._a < 1) {
            return false;
        }

        return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
    },
    toFilter: function(secondColor) {
        var hex8String = '#' + rgbaToArgbHex(this._r, this._g, this._b, this._a);
        var secondHex8String = hex8String;
        var gradientType = this._gradientType ? "GradientType = 1, " : "";

        if (secondColor) {
            var s = tinycolor(secondColor);
            secondHex8String = '#' + rgbaToArgbHex(s._r, s._g, s._b, s._a);
        }

        return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
    },
    toString: function(format) {
        var formatSet = !!format;
        format = format || this._format;

        var formattedString = false;
        var hasAlpha = this._a < 1 && this._a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");

        if (needsAlphaFormat) {
            // Special case for "transparent", all other non-alpha formats
            // will return rgba when there is transparency.
            if (format === "name" && this._a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === "rgb") {
            formattedString = this.toRgbString();
        }
        if (format === "prgb") {
            formattedString = this.toPercentageRgbString();
        }
        if (format === "hex" || format === "hex6") {
            formattedString = this.toHexString();
        }
        if (format === "hex3") {
            formattedString = this.toHexString(true);
        }
        if (format === "hex4") {
            formattedString = this.toHex8String(true);
        }
        if (format === "hex8") {
            formattedString = this.toHex8String();
        }
        if (format === "name") {
            formattedString = this.toName();
        }
        if (format === "hsl") {
            formattedString = this.toHslString();
        }
        if (format === "hsv") {
            formattedString = this.toHsvString();
        }
        if (format === "hwb") {
            formattedString = this.toHwbString();
        }
        if (format === "ncol") {
            formattedString = this.toNcolString();
        }
        if (format === "ncs") {
            formattedString = this.toNcsString();
        }
        if (format === "cmyk") {
            formattedString = this.toCmykString();
        }
        if (format === "cmy") {
            formattedString = this.toCmyString();
        }
        if (format === "xyz") {
            formattedString = this.toXyzString();
        }
        if (format === "lab") {
            formattedString = this.toLabString();
        }

        return formattedString || this.toHexString();
    },
    clone: function() {
        return tinycolor(this.toString());
    },

    _applyModification: function(fn, args) {
        var color = fn.apply(null, [this].concat([].slice.call(args)));
        this._r = color._r;
        this._g = color._g;
        this._b = color._b;
        this.setAlpha(color._a);
        return this;
    },
    lighten: function() {
        return this._applyModification(lighten, arguments);
    },
    brighten: function() {
        return this._applyModification(brighten, arguments);
    },
    darken: function() {
        return this._applyModification(darken, arguments);
    },
    desaturate: function() {
        return this._applyModification(desaturate, arguments);
    },
    saturate: function() {
        return this._applyModification(saturate, arguments);
    },
    greyscale: function() {
        return this._applyModification(greyscale, arguments);
    },
    spin: function() {
        return this._applyModification(spin, arguments);
    },

    _applyCombination: function(fn, args) {
        return fn.apply(null, [this].concat([].slice.call(args)));
    },
    analogous: function() {
        return this._applyCombination(analogous, arguments);
    },
    complement: function() {
        return this._applyCombination(complement, arguments);
    },
    monochromatic: function() {
        return this._applyCombination(monochromatic, arguments);
    },
    splitcomplement: function() {
        return this._applyCombination(splitcomplement, arguments);
    },
    triad: function() {
        return this._applyCombination(triad, arguments);
    },
    tetrad: function() {
        return this._applyCombination(tetrad, arguments);
    },
    tetradRect: function() {
        return this._applyCombination(tetradRect, arguments);
    },
    pentad: function() {
        return this._applyCombination(pentad, arguments);
    },
    hexad: function() {
        return this._applyCombination(hexad, arguments);
    },
    distance: function(color, relative) {
        var rgb;
        if (typeof color === "object" && color.hasOwnProperty("_r") && color.hasOwnProperty("_g") && color.hasOwnProperty("_b")) {
            rgb = color.toRgb();
        } else if (typeof color === "object" && color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
            rgb = color;
        } else {
            rgb = tinycolor(color).toRgb();
        }
        return colorDistance(this.toRgb(), rgb, relative);
    },
    isCloseTo: function (color) {
        var rgb;
        if (typeof color === "object" && color.hasOwnProperty("_r") && color.hasOwnProperty("_g") && color.hasOwnProperty("_b")) {
            rgb = color.toRgb();
        } else if (typeof color === "object" && color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
            rgb = color;
        } else {
            rgb = tinycolor(color).toRgb();
        }
        return colorSimilarity(this.toRgb(), rgb);
    }
};

// If input is an object, force 1 into "1.0" to handle ratios properly
// String input requires "1.0" as input, so 1 will be treated as 1
tinycolor.fromRatio = function(color, opts) {
    if (typeof color == "object") {
        var newColor = {};
        for (var i in color) {
            if (color.hasOwnProperty(i)) {
                if (i === "a") {
                    newColor[i] = color[i];
                }
                else {
                    newColor[i] = convertToPercentage(color[i]);
                }
            }
        }
        color = newColor;
    }

    return tinycolor(color, opts);
};

// Given a string or object, convert that input to RGB
// Possible string inputs:
//
//     "red"
//     "#f00" or "f00"
//     "#ff0000" or "ff0000"
//     "#ff000000" or "ff000000"
//     "rgb 255 0 0" or "rgb (255, 0, 0)"
//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
//
function inputToRGB(color) {

    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format = false;

    if (typeof color == "string") {
        color = stringInputToObject(color);
    }

    if (typeof color == "object") {
        if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format = "hsv";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format = "hsl";
        }
        else if (isValidCSSUnit(color.c) && isValidCSSUnit(color.m) && isValidCSSUnit(color.y) && isValidCSSUnit(color.k)) {
            c = convertToPercentage(color.c);
            m = convertToPercentage(color.m);
            y = convertToPercentage(color.y);
            k = convertToPercentage(color.k);
            rgb = cmykToRgb(c, m, y, k);
            ok = true;
            format = "cmyk";
        }
        else if (isValidCSSUnit(color.c) && isValidCSSUnit(color.m) && isValidCSSUnit(color.y)) {
            c = convertToPercentage(color.c);
            m = convertToPercentage(color.m);
            y = convertToPercentage(color.y);
            rgb = cmyToRgb(c, m, y);
            ok = true;
            format = "cmy";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.w) && isValidCSSUnit(color.b))
        {
            w = convertToPercentage(color.w);
            b = convertToPercentage(color.b);
            rgb = hwbToRgb(color.h, w, b);
            ok = true;
            format = "hwb";
        }
        else if (isValidNcolHue(color.n) && isValidCSSUnit(color.w) && isValidCSSUnit(color.b)) {
            w = convertToPercentage(color.w);
            b = convertToPercentage(color.b);
            rgb = ncolToRgb(color.n, w, b);
            ok = true;
            format = "ncol";
        }
        else if (isValidNcsHue(color.n) && isValidCSSUnit(color.s) && isValidCSSUnit(color.c)) {
            rgb = ncsToRgb(color.s, color.c, color.n);
            ok = true;
            format = "ncs";
        }
        else if (isValidCSSUnit(color.x) && isValidCSSUnit(color.y) && isValidCSSUnit(color.z)) {
            x = convertToPercentage(color.x);
            y = convertToPercentage(color.y);
            z = convertToPercentage(color.z);
            rgb = xyzToRgb(x, y, z);
            ok = true;
            format = "xyz";
        }
        else if (isValidCSSUnit(color.l) && isValidCSSUnit(color.A) && isValidCSSUnit(color.b)) {
            rgb = labToRgb(color.l, color.A, color.b);
            ok = true;
            format = "lab";
        }
        if (color.hasOwnProperty("a")) {
            a = color.a;
        }
    }

    a = boundAlpha(a);

    return {
        ok: ok,
        format: color.format || format,
        r: mathMin(255, mathMax(rgb.r, 0)),
        g: mathMin(255, mathMax(rgb.g, 0)),
        b: mathMin(255, mathMax(rgb.b, 0)),
        a: a
    };
}


// Conversion Functions
// --------------------

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToRgb`
// Handle bounds / percentage checking to conform to CSS color spec
// <http://www.w3.org/TR/css3-color/>
// *Assumes:* r, g, b in [0, 255] or [0, 1]
// *Returns:* { r, g, b } in [0, 255]
function rgbToRgb(r, g, b){
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255
    };
}

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
function rgbToHsl(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h: h, s: s, l: l };
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hslToRgb(h, s, l) {
    var r, g, b;

    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    if(s === 0) {
        r = g = b = l; // achromatic
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgbToHsv(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
 function hsvToRgb(h, s, v) {

    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);

    var i = Math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
function rgbToHex(r, g, b, allow3Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    // Return a 3 character hex if possible
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

    return hex.join("");
}

// `rgbaToHex`
// Converts an RGBA color plus alpha transparency to hex
// Assumes r, g, b are contained in the set [0, 255] and
// a in [0, 1]. Returns a 4 or 8 character rgba hex
function rgbaToHex(r, g, b, a, allow4Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16)),
        pad2(convertDecimalToHex(a))
    ];

    // Return a 4 character hex if possible
    if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }

    return hex.join("");
}

// `rgbaToArgbHex`
// Converts an RGBA color to an ARGB Hex8 string
// Rarely used, but required for "toFilter()"
function rgbaToArgbHex(r, g, b, a) {

    var hex = [
        pad2(convertDecimalToHex(a)),
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    return hex.join("");
}

// `rgbToCmy`
// Convert an RGB color to CMY
// *Assumes* r, g, and b are contained in the set [0, 255]
// *Returns:* { c, m, y, k } in [0, 1]
function rgbToCmy(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    return { c: 1 - r, m: 1 - g, y: 1 - b };
}

// `cmyToRgb`
// Convert an CMY color to RGB
// *Assumes:* c, m, y are contained in the set [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function cmyToRgb(c, m, y) {

    c = bound01(c, 100);
    m = bound01(m, 100);
    y = bound01(y, 100);

    return { r: (1 - c) * 255, g: (1 - m) * 255, b: (1 - y) * 255 };
}

// `rgbToCmyk`
// Convert an RGB color to CMYK
// *Assumes* r, g, and b are contained in the set [0, 255]
// *Returns:* { c, m, y, k } in [0, 1]
function rgbToCmyk(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b);
    var c, m, y, k = 1 - max;

    if(k == 1) {
        c = 0;
        m = 0;
        y = 0;
    }
    else {
        c = (1 - r - k) / (1 - k);
        m = (1 - g - k) / (1 - k);
        y = (1 - b - k) / (1 - k);
    }
    return { c: c, m: m, y: y, k: k };
}

// `cmykToRgb`
// Convert an CMYK color to RGB
// *Assumes:* c, m, y, k are contained in the set [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function cmykToRgb(c, m, y, k) {

    c = bound01(c, 100);
    m = bound01(m, 100);
    y = bound01(y, 100);
    k = bound01(k, 100);

    return { r: (1 - c) * (1 - k) * 255, g: (1 - m) * (1 - k) * 255, b: (1 - y) * (1 - k) * 255 };
}

// `rgbToHwb`
// Convert an RGB color to HWB
// *Assumes* r, g, and b are contained in the set [0, 255]
// *Returns:* { h, w, b } in [0, 1]
function rgbToHwb(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, w = min, B = 1 - max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        var d = max - min;
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, w: w, b: B };
}

// `hwbToRgb`
// Converts an HWB color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and w and b are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hwbToRgb(h, w, B) {

    w = bound01(w, 100);
    B = bound01(B, 100);

    var v = 1 - B,
        s = v === 0 ? 0 : (1 - w / v);

    return hsvToRgb(h, convertToPercentage(s), convertToPercentage(v));
}

// `rgbToXyz`
// Convert an RGB color to XYZ
// *Assumes* r, g, and b are contained in the set [0, 255]
// *Returns:* { x, y, z } in [0, 1]
function rgbToXyz(r, g, b) {

    var x, y, z,
        M = matrix.rgbxyz,
        handleRgb = function (v) {
            v = bound01(v, 255);
            return (v > 0.04045) ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92;
        };

    r = handleRgb(r);
    g = handleRgb(g);
    b = handleRgb(b);

    x = (r * M.x[0] + g * M.x[1] + b * M.x[2]);
    y = (r * M.y[0] + g * M.y[1] + b * M.y[2]);
    z = (r * M.z[0] + g * M.z[1] + b * M.z[2]);

    return { x: x, y: y, z: z };
}

// `xyzToRgb`
// Converts an XYZ color value to RGB.
// *Assumes:* x, y and z are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function xyzToRgb(x, y, z) {

    x = bound01(x, 100);
    y = bound01(y, 100);
    z = bound01(z, 100);

    var M = matrix.rgbxyz,
        r = x * M.r[0] + y * M.r[1] + z * M.r[2],
        g = x * M.g[0] + y * M.g[1] + z * M.g[2],
        b = x * M.b[0] + y * M.b[1] + z * M.b[2],
        handleRgb = function (v) {
            v = v > 0.0031308 ? 1.055 * Math.pow(v, 1 / 2.4) - 0.055 : 12.92 * v;
            return v > 1 ? 1 : v < 0 ? 0 : v;
        };

    return {
        r: handleRgb(r) * 255,
        g: handleRgb(g) * 255,
        b: handleRgb(b) * 255
    };
}

// `rgbToLab`
// Convert an RGB color to LAB
// *Assumes* r, g, and b are contained in the set [0, 255]
// *Returns:* { l } in [0, 100] and { a, b } in [-110, 110]
function rgbToLab(r, g, b) {

    var M = matrix.rgbxyz,
        handleXyz = function (v, arr) {
            v = v / arr.reduce(function (p, c) { return p + c; }, 0);
            return (v > 0.008856) ? Math.pow(v, 1 / 3) : v * 7.787037 + 16 / 116;
        },
        xyz = rgbToXyz(r, g, b),
        x = handleXyz(xyz.x, M.x),
        y = handleXyz(xyz.y, M.y),
        z = handleXyz(xyz.z, M.z);

    return { l: y * 116 - 16, a: 500 * (x - y), b: 200 * (y - z) };
}

// `labToRgb`
// Converts an LAB color value to RGB.
// *Assumes:* l is contained in [0, 100], a and b are contained in [-110, 110]
// *Returns:* { r, g, b } in the set [0, 255]
function labToRgb(l, a, b) {

    l = parseFloat(l);
    a = parseFloat(a);
    b = parseFloat(b);

    var M = matrix.rgbxyz,
        y = (l + 16) / 116,
        x = a / 500 + y,
        z = y - b / 200,
        handleXyz = function (v, arr) {
            return (Math.pow(v, 3) > 0.008856 ? Math.pow(v, 3) : (v - 16 / 116) / 7.787037) * arr.reduce(function (p, c) { return p + c; }, 0);
        };

    return xyzToRgb(handleXyz(x, M.x) * 100, handleXyz(y, M.y) * 100, handleXyz(z, M.z) * 100);
}

// `rgbToNcol`
// Convert an RGB color to NCol (initiative from W3Schools)
// *Assumes* r, g, and b are contained in the set [0, 255]
// *Returns:* { n } in [RYGCBM][0, 99] { w, b } in [0, 1]
function rgbToNcol(r, g, b) {

    var hwb = rgbToHwb(r, g, b),
        ncol = ["r", "y", "g", "c", "b", "m"];
    var h = mathRound(hwb.h * 600),
        w = hwb.w,
        B = hwb.b,
        R = h % 100,
        n = ncol[(h - R) / 100] + R;

    return { n: n.toUpperCase(), w: w, b: B };
}

// `ncolToRgb`
// Converts an NCol color value to RGB.
// *Assumes:* n is contained in [RYGCBM][0, 99] and w and b are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function ncolToRgb(n, w, B) {

    n = n.toLowerCase();

    var h = ((["r", "y", "g", "c", "b", "m"].indexOf(n[0]) * 100 + parseFloat(n.slice(1))) * 0.6) % 360;

    return hwbToRgb(h, w, B);
}

// Natural Color System.

// Thanks to w3color.js for some of the basics here.
// <https://www.w3schools.com/lib/w3color.js>

// *CAUTION:*       NCS has no offical conversion formula at this moment.
//                  Values returned are NOT accurate and may not even exist in the system.
//                  Functions below only try to find the nearest and possible value.
//                  Check the official website to learn more about NCS.
//                  <https://ncscolour.com/>

// `ncsToString`
// Format NCS string.
// *Assumes:* s and c are contained in [0, 100] and n is contained in [RYGBN]([0, 99][RYGB])
// *Returns:* NCS standard value
function ncsToString(s, c, n) {

    s = bound01(convertToPercentage(s), 100);
    c = bound01(convertToPercentage(c), 100);

    return "S " + ("00" + mathRound(s * 100)).slice(-2) + ("00" + mathRound(c * 100)).slice(-2) + "-" + n.toUpperCase();
}

// `ncsToRgb`
// *CAUTION:* The function below might not return expected value. For detail, please check [here](#section-36).
// Converts an NCS color value to RGB.
// *Assumes:* s and c are contained in [0, 1] or [0, 100] and n is contained in [RYGBN]([0, 99][RYGB])
// *Returns:* { r, g, b } in the set [0, 255]
function ncsToRgb(s, c, n) {

    if (tinycolor.hasOwnProperty("library")) {
        var code = ncsToString(s, c, n);
        if (code in tinycolor.library.ncs) {
            return tinycolor(tinycolor.library.ncs[code]).toRgb();
        }
    }

    n = n.toLowerCase();
    s = bound01(s, 100);
    c = bound01(c, 100);

    function processValue(value, factor, black) {
        var final = value * factor * (1 - black);
        return final > 1 ? 1 : final < 0 ? 0 : final;
    }
    var match = matchers.NCS_HUE_MATCH.exec(n).filter(function (v) { return typeof v !== "undefined"; }),
        n1 = match[1], p = 0,
        r = 0,
        g = 0,
        b = 0,
        s1, c1 = c,
        r1, g1, b1, r2, g2, b2, f1, f2;

    if (match.length >= 4) {
        p = bound01(match[2], 100);
    }

    if (n1 == "n") {
        r = g = b = 1 - s;
    } else {
        s1 = 1.05 * (s - 0.05);
        if (n1 == "y") {
            r1 = p <= 0.6 ? 1 : (Math.sqrt((1.82 - p) * (0.62 + p)) - 0.22);
            g1 = 0.85 * (1 - p);
            b1 = p <= 0.8 ? 0 : (1.04 - Math.sqrt((1.655 - p) * (0.465 + p)));
        } else if (n1 == "r") {
            r1 = p > 0.8 ? 0 : (Math.sqrt((0.82 - p) * (1.62 + p)) - 0.22);
            g1 = p <= 0.6 ? 0 : (0.675 - Math.sqrt((1.01 - p) * (0.51 + p)));
            b1 = p > 0.6 ? (Math.sqrt((2.2 - p) * (-0.2 + p)) - 0.1) : (1.04 - Math.sqrt((0.655 - p) * (1.465 + p)));
        } else if (n1 == "b") {
            r1 = 0;
            g1 = p > 0.6 ? 0.9 : (0.065 + Math.sqrt((1.524 - p) * (0.151 + p)));
            b1 = p <= 0.8 ? (Math.sqrt((1.2 - p) * (0.8 + p)) - 0.1) : (1.22 - Math.sqrt((3.52 - p) * (-0.7 + p)));
        } else if (n1 == "g") {
            r1 = Math.sqrt((3.5384 - p) * (0.1384 + p)) - 0.7;
            g1 = p <= 0.6 ? 0.9 : (0.975 - 0.125 * p);
            b1 = p > 0.4 ? 0 : (1.22 - Math.sqrt((2.52 - p) * (0.3 + p)));
        }
        f1 = (r1 + g1 + b1) / 3;
        r2 = (f1 - r1) * (1 - c1) + r1;
        g2 = (f1 - g1) * (1 - c1) + g1;
        b2 = (f1 - b1) * (1 - c1) + b1;
        f2 = 1 / ((r2 == g2 || g2 == b2 || r2 == b2) ? (r2 + g2 + b2) / 3 : mathMax(r2, g2, b2));
        r = processValue(r2, f2, s1);
        g = processValue(g2, f2, s1);
        b = processValue(b2, f2, s1);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToNcs`
// *CAUTION:* The function below might not return expected value. For detail, please check [here](#section-36).
// *Assumes* r, g, and b are contained in the set [0, 255]
// *Returns:* { s, c } in the set of [0, 100] and n in [RYGBN]([0, 99][RYGB]) or false if cannot found a valid color\
function rgbToNcs(r, g, b) {
    var hwb, B = 0,
        sum = r + g + b,
        avg = sum / 3,
        max = mathMax(r, g, b),
        isMax = [],
        data = {}, result = false;
    if (r / sum > 0.5 || g / sum > 0.5 || b / sum > 0.5) {
        // Modify color
        r += (avg - r) / 3 / (r == 128 ? 1.5 : Math.abs(r - 128) / Math.abs(r - avg)); 
        g += (avg - g) / 3 / (g == 128 ? 1.5 : Math.abs(g - 128) / Math.abs(g - avg)); 
        b += (avg - b) / 3 / (b == 128 ? 1.5 : Math.abs(b - 128) / Math.abs(b - avg));
        sum = r + g + b;
        avg = sum / 3;
        max = mathMax(r, g, b);
        B = -5;
    }
    hwb = rgbToHwb(r, g, b);
    B += mathRound(hwb.b * 100);
    data = {
        blackness: mathMin(40, B),
        original: { r: r, g: g, b: b},
        diff: sum,
        avg: avg
    };
    if (Math.abs(r - max) < 6 || r / avg > 1) isMax.push("r");
    if (Math.abs(g - max) < 6 || g / avg > 1) isMax.push("g");
    if (Math.abs(b - max) < 6 || b / avg > 1) isMax.push("b");

    if (isMax.length == 3) {
        data.start = "n";
    } else if (isMax.indexOf("b") != -1 && isMax.indexOf("g") != -1) {
        data.start = "b";
        data.end = "g";
    } else if (isMax.indexOf("r") != -1 && isMax.indexOf("g") != -1) {
        data.start = "g";
        data.end = "y";
    } else if (isMax.indexOf("r") != -1 && isMax.indexOf("b") != -1) {
        data.start = "r";
        data.end = "b";
    } else if (isMax.indexOf("b") != -1) {
        data.start = "r60b";
        data.end = "b40g";
    } else if (isMax.indexOf("g") != -1) {
        data.start = "b50g";
        data.end = "g70y";
    } else if (isMax.indexOf("r") != -1) {
        data.start = "g80y";
        data.end = "r50b";
    }

    if (tinycolor.hasOwnProperty("plugins")) {
        result = tinycolor.plugins.toClosestNcs(data);
    }
    if (!result) {
        result = toClosestNcs(data);
    }

    if (!(result.hasOwnProperty("best"))) return { s: 90, c: 0, n: "n"};

    return result.best;
}

// `toClosestNcs`
// *CAUTION:* The function below might not return expected value. For detail, please check [here](#section-36).

// Find the closest NCS value from given data.
// *Returns:* data contains possible NCS value
function toClosestNcs(DATA) {
    var data = JSON.parse(JSON.stringify(DATA)),
        n1 = data.start, n2,
        s = data.blackness - data.blackness % 5,
        maxS = s + 10, c = 0, p = 0,
        maxP = 90, maxC = 85, distance;
    if (n1[0] == "n") {
        maxP = 0;
        data.end = "n";
    } else if (n1[0] == "y") {
        n2 = "r";
    } else if (n1[0] == "r") {
        n2 = "b";
        maxC = 70;
    } else if (n1[0] == "b") {
        n2 = "g";
        maxC = 65;
    } else if (n1[0] == "g") {
        n2 = "y";
        maxC = 75;
    }

    if (data.hasOwnProperty("end") && data.end.length > 1 && n1[0] == data.end[0]) {
        maxP = parseInt(data.end.slice(1, 3), 10);
    }

    if (maxS > 85 && n1[0] != "n") maxS = 85;
    else if (maxS > 90 && n1[0] == "n") maxS = 90;
    if (maxP > 90) maxP = 90;

    while (s <= maxS) {
        c = 0;
        while (c <= maxC) {
            p = n1.length > 1 ? parseInt(n1.slice(1, 3), 10) : 0;
            while (p <= maxP) {
                tempN = n1[0];
                if (tempN != "n") tempN += ("00" + p).slice(-2) + n2;
                var color = ncsToRgb(s, c, tempN);
                distance = colorDistance(data.original, color);
                if (distance < data.diff && colorSimilarity(data.original, color)) {
                    data.best = {
                        s: s,
                        c: c,
                        n: tempN
                    };
                    data.diff = distance;
                }
                p += 10;
            }
            c += 5;
        }
        s += 5;
    }
    if (data.start[0] != "n" && data.hasOwnProperty("end") && data.start[0] != data.end[0]) {
        data.start = n2;
        return toClosestNcs(data);
    }
    return data;
}

// `colorDistance`
// Calculate the distance between two colors
// *Assumes:* color1 and color2 contain a RGB object { r: r, g: g, b: b }
// *Returns:* distance
function colorDistance(color1, color2, relative) {
    var ratioR = 1, ratioG = 1, ratioB = 1, meanR;
    if (typeof color2 === "undefined") {
        color2 = { r: 0, g: 0, b: 0 };
    }
    if (typeof relative !== "undefined" && relative) {
        meanR = (color1.r + color2.r) / 2;
        ratioR = 2 + meanR / 256;
        ratioB = 2 + (255 - meanR) / 256;
        ratioG = 4;
    }
    return Math.sqrt(ratioR * Math.pow(color1.r - color2.r, 2) + ratioG * Math.pow(color1.g - color2.g, 2) + ratioB * Math.pow(color1.b - color2.b, 2));
}

// `colorSimilarity`
// Evaluate the simialarity between two colors.
// *Assumes:* color1 and color2 contain a RGB object { r: r, g: g, b: b }
// *Returns:* true / false
function colorSimilarity(color1, color2) {
    var distance = colorDistance(color1, color2),
        diffR = Math.abs(color1.r - color2.r),
        diffG = Math.abs(color1.g - color2.g),
        diffB = Math.abs(color1.b - color2.b),
        smallAngle = function (x1, x2, y1, y2) {
            return (Math.atan(x1 / y1) - Math.atan(x2 / y2)) * 180 / Math.PI < 15;
        },
        isSmallAngle = smallAngle(color1.r, color2.r, color1.g, color2.g) &&
                       smallAngle(color1.g, color2.g, color1.b, color2.b) &&
                       smallAngle(color1.b, color2.b, color1.r, color2.r);
    return diffR / distance < 0.666 && diffG / distance < 0.666 && diffB / distance < 0.666 && isSmallAngle;
}

// `equals`
// Can be called with any tinycolor input
tinycolor.equals = function (color1, color2, format) {
    if (!color1 || !color2) { return false; }
    if (format) {
        return tinycolor(color1).toString(format) == tinycolor(color2).toString(format);
    }
    return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
};

tinycolor.random = function() {
    return tinycolor.fromRatio({
        r: mathRandom(),
        g: mathRandom(),
        b: mathRandom()
    });
};


// Modification Functions
// ----------------------
// Thanks to less.js for some of the basics here
// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

function desaturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s -= amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function saturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s += amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function greyscale(color) {
    return tinycolor(color).desaturate(100);
}

function lighten (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

function brighten(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var rgb = tinycolor(color).toRgb();
    rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
    rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
    rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
    return tinycolor(rgb);
}

function darken (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

// Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
// Values outside of this range will be wrapped into this range.
function spin(color, amount) {
    var hsl = tinycolor(color).toHsl();
    var hue = (hsl.h + amount) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return tinycolor(hsl);
}

// Combination Functions
// ---------------------
// Thanks to jQuery xColor for some of the ideas behind these
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

function complement(color) {
    var hsl = tinycolor(color).toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return tinycolor(hsl);
}

function triad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
    ];
}

function tetrad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
    ];
}

function tetradRect(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 60) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
    ];
}

function pentad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 144) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 288) % 360, s: hsl.s, l: hsl.l })
    ];
}

function hexad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 60) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 300) % 360, s: hsl.s, l: hsl.l })
    ];
}

function splitcomplement(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
        tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
    ];
}

function analogous(color, results, slices) {
    results = results || 6;
    slices = slices || 30;

    var hsl = tinycolor(color).toHsl();
    var part = 360 / slices;
    var ret = [tinycolor(color)];

    for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(tinycolor(hsl));
    }
    return ret;
}

function monochromatic(color, results) {
    results = results || 6;
    var hsv = tinycolor(color).toHsv();
    var h = hsv.h, s = hsv.s, v = hsv.v;
    var ret = [];
    var modification = 1 / results;

    while (results--) {
        ret.push(tinycolor({ h: h, s: s, v: v}));
        v = (v + modification) % 1;
    }

    return ret;
}

// Utility Functions
// ---------------------

tinycolor.mix = function(color1, color2, amount) {
    amount = (amount === 0) ? 0 : (amount || 50);

    var rgb1 = tinycolor(color1).toRgb();
    var rgb2 = tinycolor(color2).toRgb();

    var p = amount / 100;

    var rgba = {
        r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
        g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
        b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
        a: ((rgb2.a - rgb1.a) * p) + rgb1.a
    };

    return tinycolor(rgba);
};


// Readability Functions
// ---------------------
// <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

// `contrast`
// Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
tinycolor.readability = function(color1, color2) {
    var c1 = tinycolor(color1);
    var c2 = tinycolor(color2);
    return (Math.max(c1.getLuminance(),c2.getLuminance())+0.05) / (Math.min(c1.getLuminance(),c2.getLuminance())+0.05);
};

// `isReadable`
// Ensure that foreground and background color combinations meet WCAG2 guidelines.
// The third argument is an optional Object.
//      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
//      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
// If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.

// *Example*
//    tinycolor.isReadable("#000", "#111") => false
//    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
tinycolor.isReadable = function(color1, color2, wcag2) {
    var readability = tinycolor.readability(color1, color2);
    var wcag2Parms, out;

    out = false;

    wcag2Parms = validateWCAG2Parms(wcag2);
    switch (wcag2Parms.level + wcag2Parms.size) {
        case "AAsmall":
        case "AAAlarge":
            out = readability >= 4.5;
            break;
        case "AAlarge":
            out = readability >= 3;
            break;
        case "AAAsmall":
            out = readability >= 7;
            break;
    }
    return out;

};

// `mostReadable`
// Given a base color and a list of possible foreground or background
// colors for that base, returns the most readable color.
// Optionally returns Black or White if the most readable color is unreadable.
// *Example*
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
tinycolor.mostReadable = function(baseColor, colorList, args) {
    var bestColor = null;
    var bestScore = 0;
    var readability;
    var includeFallbackColors, level, size ;
    args = args || {};
    includeFallbackColors = args.includeFallbackColors ;
    level = args.level;
    size = args.size;

    for (var i= 0; i < colorList.length ; i++) {
        readability = tinycolor.readability(baseColor, colorList[i]);
        if (readability > bestScore) {
            bestScore = readability;
            bestColor = tinycolor(colorList[i]);
        }
    }

    if (tinycolor.isReadable(baseColor, bestColor, {"level":level,"size":size}) || !includeFallbackColors) {
        return bestColor;
    }
    else {
        args.includeFallbackColors=false;
        return tinycolor.mostReadable(baseColor,["#fff", "#000"],args);
    }
};


// Big List of Colors
// ------------------
// <http://www.w3.org/TR/css3-color/#svg-color>
var names = tinycolor.names = {
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    rebeccapurple: "663399",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32"
};

// Make it easy to access colors via `hexNames[hex]`
var hexNames = tinycolor.hexNames = flip(names);

var matrix = tinycolor.matrix = {
    rgbxyz: {
        x: [ 0.4124564,  0.3575761,  0.1804375],
        y: [ 0.2126729,  0.7151522,  0.0721750],
        z: [ 0.0193339,  0.1191920,  0.9503041],
        r: [ 3.2404542, -1.5371385, -0.4985314],
        g: [-0.9692660,  1.8760108,  0.0415560],
        b: [ 0.0556434, -0.2040259,  1.0572252]
    }
};

// Utilities
// ---------

// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
function flip(o) {
    var flipped = { };
    for (var i in o) {
        if (o.hasOwnProperty(i)) {
            flipped[o[i]] = i;
        }
    }
    return flipped;
}

// Return a valid alpha value [0,1] with all invalid values being set to 1
function boundAlpha(a) {
    a = parseFloat(a);

    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }

    return a;
}

// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
    if (isOnePointZero(n)) { n = "100%"; }

    var processPercent = isPercentage(n);
    n = mathMin(max, mathMax(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if ((Math.abs(n - max) < 0.000001)) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
}

// Force a number between 0 and 1
function clamp01(val) {
    return mathMin(1, mathMax(0, val));
}

// Parse a base-16 hex value into a base-10 integer
function parseIntFromHex(val) {
    return parseInt(val, 16);
}

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
function isOnePointZero(n) {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
}

// Check to see if string passed in is a percentage
function isPercentage(n) {
    return typeof n === "string" && n.indexOf('%') != -1;
}

// Force a hex value to have 2 characters
function pad2(c) {
    return c.length == 1 ? '0' + c : '' + c;
}

// Replace a decimal with it's percentage value
function convertToPercentage(n) {
    if (n <= 1) {
        n = (n * 100) + "%";
    }

    return n;
}

// Converts a decimal to a hex value
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
// Converts a hex value to a decimal
function convertHexToDecimal(h) {
    return (parseIntFromHex(h) / 255);
}

var matchers = (function() {

    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = "[-\\+]?\\d+%?";

    // <http://www.w3.org/TR/css3-values/#number-value>
    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

    // Repeat this value for CSS value with more than 2 parameters.
    var CSS_UNIT_REPEATING = "[,|\\s]+(" + CSS_UNIT + ")";

    // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren
    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")" + CSS_UNIT_REPEATING.repeat(2) + "\\s*\\)?";
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")" + CSS_UNIT_REPEATING.repeat(3) + "\\s*\\)?";
    var NCOL_HUE_MATCH = "\\s*[rygcbm](" + CSS_UNIT + ")?";
    var NCOL_MATCH3 = "\\s*(" + NCOL_HUE_MATCH + ")" + CSS_UNIT_REPEATING.repeat(2) + "\\s*";
    var NCOL_MATCH4 = "\\s*(" + NCOL_HUE_MATCH + ")" + CSS_UNIT_REPEATING.repeat(3) + "\\s*";
    var NCS_HUE_MATCH = "(?:([rygb])(\\d{2})([rygb]))|(?:([rygbn]))";
    var NCS_MATCH = "(\\d{2})(\\d{2})-(" + NCS_HUE_MATCH + ")";

    return {
        CSS_UNIT: new RegExp(CSS_UNIT),
        NCOL_HUE_MATCH: new RegExp(NCOL_HUE_MATCH, "i"),
        NCS_HUE_MATCH: new RegExp(NCS_HUE_MATCH, "i"),
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
        hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
        cmyk: new RegExp("cmyk" + PERMISSIVE_MATCH4),
        cmy: new RegExp("cmy" + PERMISSIVE_MATCH3),
        hwb: new RegExp("hwb" + PERMISSIVE_MATCH3),
        hwba: new RegExp("hwba" + PERMISSIVE_MATCH4),
        ncol: new RegExp(NCOL_MATCH3, "i"),
        ncola: new RegExp(NCOL_MATCH4, "i"),
        ncs: new RegExp(NCS_MATCH, "i"),
        xyz: new RegExp("xyz" + PERMISSIVE_MATCH3),
        lab: new RegExp("lab" + PERMISSIVE_MATCH3),
        hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
})();

// `isValidCSSUnit`
// Take in a single string / number and check to see if it looks like a CSS unit
// (see `matchers` above for definition).
function isValidCSSUnit(color) {
    return !!matchers.CSS_UNIT.exec(color);
}

// `isValidNcolHue`
// Take in a single string / number and check to see if it looks like a NCol hue
// (see `matchers` above for definition).
function isValidNcolHue(color) {
    return !!matchers.NCOL_HUE_MATCH.exec(color);
}

// `isValidNcsHue`
// Take in a single string / number and check to see if it looks like a NCS hue
// (see `matchers` above for definition).
function isValidNcsHue(color) {
    return !!matchers.NCS_HUE_MATCH.exec(color);
}

// `stringInputToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
function stringInputToObject(color) {

    color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
    var named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color == 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }

    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    var match;
    if ((match = matchers.rgb.exec(color))) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    if ((match = matchers.rgba.exec(color))) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    if ((match = matchers.hsl.exec(color))) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    if ((match = matchers.hsla.exec(color))) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    if ((match = matchers.hsv.exec(color))) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    if ((match = matchers.hsva.exec(color))) {
        return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    if ((match = matchers.cmyk.exec(color))) {
        return { c: match[1], m: match[2], y: match[3], k: match[4] };
    }
    if ((match = matchers.cmy.exec(color))) {
        return { c: match[1], m: match[2], y: match[3] };
    }
    if ((match = matchers.hwb.exec(color))) {
        return { h: match[1], w: match[2], b: match[3] };
    }
    if ((match = matchers.hwba.exec(color))) {
        return { h: match[1], w: match[2], b: match[3], a: match[4] };
    }
    if ((match = matchers.hex8.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex6.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
        };
    }
    if ((match = matchers.hex4.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            a: convertHexToDecimal(match[4] + '' + match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex3.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            format: named ? "name" : "hex"
        };
    }
    if ((match = matchers.xyz.exec(color))) {
        return { x: match[1], y: match[2], z: match[3] };
    }
    if ((match = matchers.lab.exec(color))) {
        return { l: match[1], A: match[2], b: match[3] };
    }
    if ((match = matchers.ncola.exec(color))) {
        return { n: match[1] + (typeof match[2] === "undefined" ? 0 : ""), w: match[3], b: match[4], a: match[5] };
    }
    if ((match = matchers.ncol.exec(color))) {
        return { n: match[1] + (typeof match[2] === "undefined" ? 0 : ""), w: match[3], b: match[4] };
    }
    if ((match = matchers.ncs.exec(color))) {
        return { s: match[1], c: match[2], n: match[3] };
    }

    return false;
}

function validateWCAG2Parms(parms) {
    // return valid WCAG2 parms for isReadable.
    // If input parms are invalid, return {"level":"AA", "size":"small"}
    var level, size;
    parms = parms || {"level":"AA", "size":"small"};
    level = (parms.level || "AA").toUpperCase();
    size = (parms.size || "small").toLowerCase();
    if (level !== "AA" && level !== "AAA") {
        level = "AA";
    }
    if (size !== "small" && size !== "large") {
        size = "small";
    }
    return {"level":level, "size":size};
}

// Node: Export function
if (typeof module !== "undefined" && module.exports) {
    module.exports = tinycolor;
}
// AMD/requirejs: Define the module
else if (typeof define === 'function' && define.amd) {
    define(function () {return tinycolor;});
}
// Browser: Expose to window
else {
    window.tinycolor = tinycolor;
}

})(Math);
