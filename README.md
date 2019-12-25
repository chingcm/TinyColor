# TinyColor 2.0

## JavaScript color tooling

TinyColor is a small, fast library for color manipulation and conversion in JavaScript.  It allows many forms of input, while providing color conversions and other color utility functions.  It has no dependencies.

TinyColor 2.0 is able to convert more types of color models such as HWB, CMYK and LAB. Some feature is added like calculate the distance between two colors.

## Including in a browser

Download [tinycolor.js](https://raw.githubusercontent.com/chingcm/TinyColor/master/tinycolor.js).
```html
<script type='text/javascript' src='tinycolor.js'></script>
```

## Usage

Call `tinycolor(input)` or `new tinycolor(input)`, and you will have an object with the following properties.  See Accepted String Input and Accepted Object Input below for more information about what is accepted.

For detailed usage, please check the original [repository](https://github.com/bgrins/TinyColor#usage)

## Accepted String Input

TinyColor accepts the following input: Hex, RGB, HSL, HSV and named color.
For detailed, please check the original [repository](https://github.com/bgrins/TinyColor#accepted-string-input)

This edited repository accepts extra color models to make it more powerful.
Here are some examples:

### HWB, HWBA
HWB (Hue, Whiteness, Blackness) is a suggested standard for CSS4.
HWB accepts `0% - 100%` or `0 - 1` for property `W` and `B`, accepts `0% - 100%` or `0 - 360` for property `H`.
```js
tinycolor("hwb (90, 35%, 9%)");
tinycolor("hwb (90, 0.35, 0.09)");
tinycolor("hwba (90, 35%, 9%, .5)");
tinycolor("hwb 90 0.35 0.09");
tinycolor({ h: 90, w: 0.35, b: 0.09 });
tinycolor.fromRatio({ h: 0.25, w: 0.35, b: 0.09, a: 0.5 });
```

### CMYK
CMYK (Cyan, Magenta, Yellow, Black) is a suggested standard for CSS4. Mostly used in printing.
CMYK accepts `0% - 100%` or `0 - 1` for all properties (`C`, `M`, `Y`, `K`).
```js
tinycolor("cmyk (29%, 24%, 0%, 19%)");
tinycolor("cmyk 0.29 0.24 0 0.19");
tinycolor({ c: 0.29, m: 0.24, y: 0, k: 0.19 });
```

### CMY
CMY (Cyan, Magenta, Yellow) accepts `0% - 100%` or `0 - 1` for all properties (`C`, `M`, `Y`).
```js
tinycolor("cmy (40%, 35%, 15%)");
tinycolor("cmy 0.4 0.35 .15");
```

### XYZ
XYZ accepts `0 - 1`00 or `0 - 1` for all properties (`X`, `Y`, `Z`).
```js
tinycolor("xyz (39.22, 38.95, 70.91)");
tinycolor("xyz 0.3922 0.3895 0.7091");
```

### CIELAB
CIELAB accepts `0 - 100` or `0 - 1` for property `L`, accepts `-110 - 110` for property `A` and `B`.
```js
tinycolor("lab (68.72, 7.09, -27.30)");
tinycolor("lab 68.72 7.09 -27.30");
tinycolor({ l: 68.72, A: 7.09, b: -27.30 });  // In CIELAB, use "A" instead of "a" to distinguish with Opacity "a" in other models
```

### NCol
NCol (Natural Color) is an initiative from W3Schools. Check [here](https://www.w3schools.com/colors/colors_ncol.asp) for more detail.
NCol accepts `0% - 100%` or `0 - 1` for property `W` and `B`, accepts string `R/Y/G/C/B/M` follow by number `0-99` for property `N`.
```js
tinycolor("C80, 60%, 15%");
tinycolor({ n: "C80", w: 0.6, b: 0.15 });
```

### NCS
NCS (Natural Color System)  is the color standard in Sweden, Spain, Norway and South Africa. 1950 colors contained in this standard.
**Warning**
*Since there is no conversion formula, it is not possible to return the exact and valid color code. The function is programmed based on w3color.js which try to return a similar color.*
NCS accepts `0 - 100` or `0 - 1` for property `S` and `C`, accepts single character `R/Y/G/B/N` or character `R/Y/G/B` follow by number `0-99` then by character `R/Y/G/B`.
```js
tinycolor("S 2050-R60B");
tinycolor("2050-r60b");
tinycolor({ s: 0.2, c: 0.5, n: "r60b" });
tinycolor("S 5000-n");
tinycolor({ s: 0.5, c: 0, n: "N" });
```

## Methods
Supported methods:
`getFormat` - get the input format of the TinyColor instance
`isValid` - validate the input
`getBrightness` - get brightness of a color
`isLight` or `isDark` - check if the color is perceived as bright
`getLuminance` - get perceived luminance of a color
More methods and usage can be found [here](https://github.com/bgrins/TinyColor#methods)

## String Representations
For conversion between `HSL`, `HSV`, `HEX` and `RGB`, details can be found [here](https://github.com/bgrins/TinyColor#string-representations)

### toHwb
```js
var color = tinycolor("red");
color.toHwb(); // { h: 0, w: 0, b: 0, a: 1 }
```

### toHwbString
```js
var color = tinycolor("red");
color.toHwbString(); // hwb(0, 0%, 0%)
color.setAlpha(0.5);
color.toHsvString(); // hsva(0, 100%, 100%, 0.5)
```

### toCmyk
```js
var color = tinycolor("red");
color.toCmyk(); // { c: 0, m: 100, y: 100, k: 0 }
```

### toCmykString
```js
var color = tinycolor("red");
color.toCmykString(); // cmyk(0%, 100%, 100%, 0%)
```

### toCmy
```js
var color = tinycolor("red");
color.toCmy(); // { c: 0, m: 100, y: 100 }
```

### toCmyString
```js
var color = tinycolor("red");
color.toCmyString(); // cmyk(0%, 100%, 100%)
```

### toXyz
```js
var color = tinycolor("red");
color.toXyz(); // { x: 41.24564, y: 21.26729, z: 1.9333900000000002 }
```

### toXyzString
```js
var color = tinycolor("red");
color.toXyzString(); // xyz(41.25, 21.27, 1.93)
```

### toLab
```js
var color = tinycolor("red");
color.toLab(); // { l: 53.24079183328088, a: 80.09246954480042, b: 67.20319253649727 }
```

### toLabString
```js
var color = tinycolor("red");
color.toLabString(); // lab(53.24, 80.09, 67.20)
```

### toNcol
```js
var color = tinycolor("red");
color.toNcol(); // {n: "R0", w: 0, b: 0, a: 1}
```

### toNcolString
```js
var color = tinycolor("red");
color.toNcolString(); // R0, 0%, 0%
```

### toNcs
**Warning**
*As mentioned above, this function tries to return a similar color. The color could be very DIFFERENT to the input or even CANNOT return a valid color.*
Colors with large difference in R,G,B value or dark color is less likely to find a similar color.
If no color found, the function return the darkest color (S 9000-N) 
```js
var color = tinycolor("grey");
color.toNcs(); // {s: 50, c: 5, n: "N"}
tinycolor("yellow").toNcs(); // {s: 90, c: 0, n: "N"} (no color found)
```

### toNcsString
```js
var color = tinycolor("grey");
color.toNcsString(); // S 5005-N
tinycolor("yellow").toNcsString(); // S 9000-N (no color found)
```

## Color Modification
These methods manipulate the current color, and return it for chaining.  For instance:
```js
tinycolor("red").lighten().desaturate().toHexString() // "#f53d3d"
```

### tetradRect
`tetradRect: function() -> array<TinyColor>`.
```js
var colors = tinycolor("#f00").tetradRect();

colors.map(function(t) { return t.toHexString(); }); // [ #ff0000", "#ffff00", "#00ffff", "#0000ff" ]
```

### pentad
`pentad: function() -> array<TinyColor>`.
```js
var colors = tinycolor("#f00").pentad();

colors.map(function(t) { return t.toHexString(); }); // [ "#ff0000", "#ccff00", "#00ff66", "#0066ff", "#cc00ff" ]
```

### hexad
`hexad: function() -> array<TinyColor>`.
```js
var colors = tinycolor("#f00").hexad();

colors.map(function(t) { return t.toHexString(); }); // [ "#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff" ]
```

## Plugin
There is a [plugin](https://raw.githubusercontent.com/chingcm/TinyColor/master/tinycolor.plugin.js) that stored some common color used in modern HTML framework (e.g. Flat UI, Material, Metro UI). A color list of Natural Color System (NCS) are included too. You may include the plugin after the main script to use it.
```html
<script type='text/javascript' src='tinycolor.js'></script>
<script type='text/javascript' src='tinycolor.plugin.js'></script>
```

### Colors in Library
Without the plugin, you can get the hex list of Web Colors by names.
```js
tinycolor.names.red; // "f00"
tinycolor.names.black; // "000"
```

With the plugin, you can get extra colors of `Bootstrap 3`, `Bootstrap 4`, `Flat UI`, `Material`, `Metro UI`, `Windows`, `W3` and `Natural Color System`. Every color in `Material` or `Flat UI` contains a list of that color in different shades.

Color can be accessed in two ways. Use `tinycolor.library` to directly get the hex code of the color.
```js
tinycolor.library.bootstrap4.danger; // "dc3545"
tinycolor.library.material.pink["500"]; // "e91e63"
```
Use `tinycolor.plugins.getLibraryColor` to return the TinyColor object of that color. To simplify, stating `bootstrap` without its version will always means `bootstrap4`. Colors of `material` or `flatui` will means the color with shade `500` by default.
```js
// Get by function
tinycolor.plugins.getLibraryColor("bootstrap4-danger"); // tinycolor("dc3545")
tinycolor.plugins.getLibraryColor("material-pink-500"); // tinycolor("e91e63")
tinycolor.plugins.getLibraryColor("material-pink"); // tinycolor("e91e63")
```

### Natural Color System
If using this plugin, `toNcs` and `toNcsString` will first search the NCS color list in the library. Since the colors in library is much closer to the color displayed in NCS official website, it could return a more accurate result compare to without using the plugin.

## Credit
This repository is modified from [TinyColor](https://github.com/bgrins/TinyColor) by Brian Grinstead.