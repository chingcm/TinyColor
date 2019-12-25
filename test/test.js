
test("TinyColor initialization", function() {
    ok(typeof tinycolor != "undefined", "tinycolor is initialized on the page");
    ok(typeof tinycolor("red") == "object", "tinycolor is able to be instantiated");
  
    var r = tinycolor("red");
    ok(tinycolor(r) === r, "when given a tinycolor instance, tinycolor() returns it");
    ok(new tinycolor(r) === r, "when given a tinycolor instance, new tinycolor() returns it");
    equal(tinycolor("red", { format: "hex" }).toString(), "#ff0000", "tinycolor options are being parsed");
    equal(tinycolor.fromRatio({r: 1, g: 0, b: 0 }, { format: "hex" }).toString(), "#ff0000", "tinycolor options are being parsed");
  
    var obj = {h: 180, s: 0.5, l: 0.5};
    var color = tinycolor(obj);
    ok(obj.s === 0.5, "when given an object, the original object is not modified");
  });

  // Testing for other format (HWB, NCol, CMYK)
  var conversions = [
    {"hex":"#FFFFFF","rgb":{"r":"100.0%","g":"100.0%","b":"100.0%"},"hwb":{"h":"0","w":"100.0%","b":"000.0%"},"ncol":{"n":"R0","w":"100.0%","b":"000.0%"},"cmyk":{"c":"000.0%","m":"000.0%","y":"000.0%","k":"000.0%"}},
    {"hex":"#808080","rgb":{"r":"050.0%","g":"050.0%","b":"050.0%"},"hwb":{"h":"0","w":"050.0%","b":"050.0%"},"ncol":{"n":"R0","w":"050.0%","b":"050.0%"},"cmyk":{"c":"000.0%","m":"000.0%","y":"000.0%","k":"050.0%"}},
    {"hex":"#000000","rgb":{"r":"000.0%","g":"000.0%","b":"000.0%"},"hwb":{"h":"0","w":"000.0%","b":"100.0%"},"ncol":{"n":"R0","w":"000.0%","b":"100.0%"},"cmyk":{"c":"000.0%","m":"000.0%","y":"000.0%","k":"100.0%"}},
    {"hex":"#FF0000","rgb":{"r":"100.0%","g":"000.0%","b":"000.0%"},"hwb":{"h":"0","w":"000.0%","b":"000.0%"},"ncol":{"n":"R0","w":"000.0%","b":"000.0%"},"cmyk":{"c":"000.0%","m":"100.0%","y":"100.0%","k":"000.0%"}},
    {"hex":"#BFBF00","rgb":{"r":"075.0%","g":"075.0%","b":"000.0%"},"hwb":{"h":"60","w":"000.0%","b":"025.0%"},"ncol":{"n":"Y0","w":"000.0%","b":"025.0%"},"cmyk":{"c":"000.0%","m":"000.0%","y":"100.0%","k":"025.0%"}},
    {"hex":"#008000","rgb":{"r":"000.0%","g":"050.0%","b":"000.0%"},"hwb":{"h":"120","w":"000.0%","b":"050.0%"},"ncol":{"n":"G0","w":"000.0%","b":"050.0%"},"cmyk":{"c":"100.0%","m":"000.0%","y":"100.0%","k":"050.0%"}},
    {"hex":"#80FFFF","rgb":{"r":"050.0%","g":"100.0%","b":"100.0%"},"hwb":{"h":"180","w":"050.0%","b":"000.0%"},"ncol":{"n":"C0","w":"050.0%","b":"000.0%"},"cmyk":{"c":"050.0%","m":"000.0%","y":"000.0%","k":"000.0%"}},
    {"hex":"#8080FF","rgb":{"r":"050.0%","g":"050.0%","b":"100.0%"},"hwb":{"h":"240","w":"050.0%","b":"000.0%"},"ncol":{"n":"B0","w":"050.0%","b":"000.0%"},"cmyk":{"c":"050.0%","m":"050.0%","y":"000.0%","k":"000.0%"}},
    {"hex":"#BF40BF","rgb":{"r":"075.0%","g":"025.0%","b":"075.0%"},"hwb":{"h":"300","w":"025.0%","b":"025.0%"},"ncol":{"n":"M0","w":"025.0%","b":"025.0%"},"cmyk":{"c":"000.0%","m":"066.6%","y":"000.0%","k":"025.0%"}},
    {"hex":"#A0A424","rgb":{"r":"062.8%","g":"064.3%","b":"014.2%"},"hwb":{"h":"62","w":"014.0%","b":"036.0%"},"ncol":{"n":"Y3","w":"014.0%","b":"036.0%"},"cmyk":{"c":"002.0%","m":"000.0%","y":"078.0%","k":"036.0%"}},
    {"hex":"#1EAC41","rgb":{"r":"011.6%","g":"067.5%","b":"025.5%"},"hwb":{"h":"135","w":"012.0%","b":"033.0%"},"ncol":{"n":"G25","w":"012.0%","b":"033.0%"},"cmyk":{"c":"083.0%","m":"000.0%","y":"062.0%","k":"033.0%"}},
    {"hex":"#B430E5","rgb":{"r":"070.4%","g":"018.7%","b":"089.7%"},"hwb":{"h":"284","w":"019.0%","b":"010.0%"},"ncol":{"n":"B73","w":"019.0%","b":"010.0%"},"cmyk":{"c":"021.5%","m":"079.0%","y":"000.0%","k":"010.0%"}},
    {"hex":"#FEF888","rgb":{"r":"099.8%","g":"097.4%","b":"053.2%"},"hwb":{"h":"57","w":"053.0%","b":"000.0%"},"ncol":{"n":"R95","w":"053.0%","b":"000.0%"},"cmyk":{"c":"000.0%","m":"002.0%","y":"046.7%","k":"000.0%"}},
    {"hex":"#19CB97","rgb":{"r":"009.9%","g":"079.5%","b":"059.1%"},"hwb":{"h":"162","w":"010.0%","b":"021.0%"},"ncol":{"n":"G71","w":"010.0%","b":"021.0%"},"cmyk":{"c":"088.0%","m":"000.0%","y":"025.6%","k":"020.6%"}},
    {"hex":"#362698","rgb":{"r":"021.1%","g":"014.9%","b":"059.7%"},"hwb":{"h":"248","w":"015.0%","b":"040.0%"},"ncol":{"n":"B14","w":"015.0%","b":"040.0%"},"cmyk":{"c":"064.7%","m":"075.0%","y":"000.0%","k":"040.0%"}},
    {"hex":"#7E7EB8","rgb":{"r":"049.5%","g":"049.3%","b":"072.1%"},"hwb":{"h":"241","w":"049.0%","b":"028.0%"},"ncol":{"n":"B1","w":"049.0%","b":"028.0%"},"cmyk":{"c":"031.3%","m":"031.6%","y":"000.0%","k":"028.0%"}}
  ];
  
  module("Color translations");
  
  test("Color Equality", function() {
    for (var i = 0; i < conversions.length; i++) {
      var c =  conversions[i];
      var tiny =  tinycolor(c.hex);
      
      if ([].indexOf(c.hex)!=-1){
        console.log(c.rgb)
        console.log(tinycolor(c.rgb).toCmyk())
        console.log(tinycolor(c.cmyk).toCmyk())
        console.log(tinycolor(c.rgb).toCmykString())
        console.log(tinycolor(c.cmyk).toCmykString())
      }
      ok(true, tiny.isValid());
      ok(true,
        "Testing " + c.hex + ": " + tiny.toHwbString() + " " + tiny.toNcolString() + " " + tiny.toCmykString() +
        "Original: " + JSON.stringify(c.hwb) + " " + JSON.stringify(c.ncol) + " " + JSON.stringify(c.cmyk)
      );
      ok(tinycolor.equals(c.rgb, c.hwb) || tinycolor.equals(c.rgb, c.hwb, "hwb"), "RGB equals HWB " + c.hex);
      ok(tinycolor.equals(c.rgb, c.ncol) || tinycolor.equals(c.rgb, c.ncol, "ncol"), "RGB equals NCol " + c.hex);
      ok(tinycolor.equals(c.rgb, c.cmyk) || tinycolor.equals(c.rgb, c.cmyk, "cmyk"), "RGB equals CMYK " + c.hex);
    }
  });
  
  module("String Parsing");
  
  test("HWB Parsing", function() {
    equal(tinycolor("hwb 251.1 0.234 .678").toHwbString(), "hwb(251, 23%, 68%)");
    equal(tinycolor("hwb 251.1 0.234 0.678").toHwbString(), "hwb(251, 23%, 68%)");
    equal(tinycolor("hwba 251.1 0.234 0.678 0.5").toHwbString(), "hwba(251, 23%, 68%, 0.5)");
  });

  test("NCol Parsing", function() {
    equal(tinycolor("R52 0.234 .678").toNcolString(), "R52, 23%, 68%");
    equal(tinycolor("r52 0.234 0.678").toNcolString(), "R52, 23%, 68%");
    equal(tinycolor("r52 0.234 0.678 0.5").toNcolString(), "R52, 23%, 68%, 0.5");
    equal(tinycolor("m152 0.234 0.678").toNcolString(), "R52, 23%, 68%");
    equal(tinycolor("r152 0.234 0.678").toNcolString(), "Y52, 23%, 68%");
  });
  
  test("CMYK Parsing", function() {
    equal(tinycolor("cmyk 0 0.2 .3 .4").toCmykString(), "cmyk(0%, 20%, 30%, 40%)");
    equal(tinycolor("cmyk 0.0 0.2 0.3 0.4").toCmykString(), "cmyk(0%, 20%, 30%, 40%)");
  });
  
  test("CMY Parsing", function() {
    equal(tinycolor("cmy 0 0.2 .3").toCmyString(), "cmy(0%, 20%, 30%)");
    equal(tinycolor("cmy 0.0 0.2 0.3").toCmyString(), "cmy(0%, 20%, 30%)");
  });

  test("XYZ Parsing", function() {
    equal(tinycolor("xyz 33.95 67.9 11.32").toXyzString(), "xyz(33.95, 67.90, 11.32)");
    equal(tinycolor("xyz 33.95% 67.9% 11.32%").toXyzString(), "xyz(33.95, 67.90, 11.32)");
  });

  test("LAB Parsing", function() {
    equal(tinycolor("lab 33.95 67.9 11.32").toLabString(), tinycolor("lab(33.95, 67.90, 11.32)").toLabString());
    equal(tinycolor("lab 33.95 -67.9 -11.32").toLabString(), tinycolor("lab(33.95, -67.90, -11.32)").toLabString());
  });
  
  test("Invalid Parsing", function() {
    var invalidColor = tinycolor({h: 'invalid', w: 'invalid', b: 'invalid' });
    equal(invalidColor.toHexString(), "#000000");
    equal(false, invalidColor.isValid());
  
    invalidColor = tinycolor({n: 'invalid', w: 'invalid', b: 'invalid' });
    equal(invalidColor.toHexString(), "#000000");
    equal(false, invalidColor.isValid());
  
    invalidColor = tinycolor({n: 'Q4', w: 0.2, b: 0.3 });
    equal(invalidColor.toHexString(), "#000000");
    equal(false, invalidColor.isValid());
  
    invalidColor = tinycolor({c: 'invalid', m: 'invalid', y: 'invalid', k: 'invalid' });
    equal(invalidColor.toHexString(), "#000000");
    equal(false, invalidColor.isValid());

    invalidColor = tinycolor({c: 'invalid', m: 'invalid', y: 'invalid' });
    equal(invalidColor.toHexString(), "#000000");
    equal(false, invalidColor.isValid());

    invalidColor = tinycolor({x: 'invalid', y: 'invalid', z: 'invalid' });
    equal(invalidColor.toHexString(), "#000000");
    equal(false, invalidColor.isValid());

    invalidColor = tinycolor({l: 'invalid', A: 'invalid', b: 'invalid' });
    equal(invalidColor.toHexString(), "#000000");
    equal(false, invalidColor.isValid());
  });
  
  module("Alpha handling");
  
  test("toString() with alpha set", function() {
    var redCmyk = tinycolor.fromRatio({ r: 255, g: 0, b: 0, a: .6}, {format: "cmyk"});
    var transparentCmyk = tinycolor.fromRatio({ r: 255, g: 0, b: 0, a: 0 }, {format: "cmyk"});
  
    equal(redCmyk.getFormat(), "cmyk", "getFormat() is correct");
  
    equal(redCmyk.toString(), "cmyk(0%, 100%, 100%, 0%)", "CMYK should not be returned with alpha set");
    equal(redCmyk.toString("cmyk"), "cmyk(0%, 100%, 100%, 0%)", "CMYK should not be returned with alpha set");
  
    equal(transparentCmyk.toString(), "cmyk(0%, 100%, 100%, 0%)", "Transparent is not a valid CMYK color");
    equal(transparentCmyk.toString("cmyk"), "cmyk(0%, 100%, 100%, 0%)", "Transparent is not a valid CMYK color");
  });
  
  module("Initialization from tinycolor output");
  
  test("HWB Object", function() {
    for (var i = 0; i < conversions.length; i++) {
      var c =  conversions[i];
      var tiny =  tinycolor(c.hex);
      equal(tiny.toHexString(), tinycolor(tiny.toHwb()).toHexString(), "HWB Object");
    }
  });
  
  test("HWB String", function() {
    for (var i = 0; i < conversions.length; i++) {
      var c =  conversions[i];
      var tiny =  tinycolor(c.hex);
      var input = tiny.toRgb();
      var output = tinycolor(tiny.toHwbString()).toRgb();
      var maxDiff = 2;
  
      equal(Math.abs(input.r - output.r) <= maxDiff, true, "toHwbString red value difference <= " + maxDiff);
      equal(Math.abs(input.g - output.g) <= maxDiff, true, "toHwbString green value difference <= " + maxDiff);
      equal(Math.abs(input.b - output.b) <= maxDiff, true, "toHwbString blue value difference <= " + maxDiff);
    }
  });
  
  test("NCol Object", function() {
    for (var i = 0; i < conversions.length; i++) {
      var c =  conversions[i];
      var tiny =  tinycolor(c.hex);
      var input = tiny.toRgb();
      var output = tinycolor(tiny.toNcolString()).toRgb();
      var maxDiff = 2;
      var pass = Math.abs(input.r - output.r) <= maxDiff && Math.abs(input.g - output.g) <= maxDiff && Math.abs(input.b - output.b) <= maxDiff;
      equal(pass, true, "NCol Object value difference <= " + maxDiff);
    }
  });
  
  test("NCol String", function() {
    for (var i = 0; i < conversions.length; i++) {
      var c =  conversions[i];
      var tiny =  tinycolor(c.hex);
      var input = tiny.toRgb();
      var output = tinycolor(tiny.toNcolString()).toRgb();
      var maxDiff = 2;
  
      equal(Math.abs(input.r - output.r) <= maxDiff, true, "toNcolString red value difference <= " + maxDiff);
      equal(Math.abs(input.g - output.g) <= maxDiff, true, "toNcolString green value difference <= " + maxDiff);
      equal(Math.abs(input.b - output.b) <= maxDiff, true, "toNcolString blue value difference <= " + maxDiff);
    }
  });
  
  module("Utilities");
  
  test("Color equality", function() {
    ok(tinycolor.equals("hwb(0, 10%, 10%)", "hwb(0, .1, 0.1)"), "Same hwb");
    ok(tinycolor.equals("hwb(0, 10%, 10%)", "hwba(0, .1, 0.1, 1)"), "Same hwb");

    ok(tinycolor.equals("R0, 10%, 10%", "R, 10%, 10%"), "Same ncol");
    ok(tinycolor.equals("R0, 10%, 10%", "R0, .1, 0.1"), "Same ncol");
    ok(tinycolor.equals("R0, 10%, 10%", "M100, .1, 0.1"), "Same ncol");
    ok(tinycolor.equals("R0, 10%, 10%", "Y-100, .1, 0.1"), "Same ncol");
    ok(tinycolor.equals("R0, 100%, 0%", "Y50, 1, 0"), "Same ncol");
    ok(tinycolor.equals("R0, 0%, 100%", "M50, 0, 1"), "Same ncol");

    ok(tinycolor.equals("cmyk(20%, 20%, 20%, 20%)", "cmyk(0.2, .2, .2, 0.2)"), "Same cmyk")
    ok(tinycolor.equals("cmy(20%, 20%, 20%)", "cmy(0.2, .2, .2)"), "Same cmy")
    ok(tinycolor.equals("xyz(20%, 20%, 20%)", "xyz(0.2, .2, .2)"), "Same xyz")
  });

  module("Combinations");

  function colorsToHexString(colors) {
    return colors.map(function(c) {
      return c.toHex();
    }).join(",");
  }

  test("tetradRect", function() {
    var combination = tinycolor("red").tetradRect();
    equal(colorsToHexString(combination), "ff0000,ffff00,00ffff,0000ff", "Correct Combination");
  });

  test("pentad", function() {
    var combination = tinycolor("red").pentad();
    equal(colorsToHexString(combination), "ff0000,ccff00,00ff66,0066ff,cc00ff", "Correct Combination");
  });

  test("hexad", function() {
    var combination = tinycolor("red").hexad();
    equal(colorsToHexString(combination), "ff0000,ffff00,00ff00,00ffff,0000ff,ff00ff", "Correct Combination");
  });