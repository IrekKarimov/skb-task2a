import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

const errColor = "Invalid color";

// Удаление пробелов
function clearQueryStr(str){
  const RegEx=/\s+/g;
  str = str.replace(RegEx,"");
 return str;
}

// Определяем формат
function parseColor(str){
  let color;
  let colorType;

  str = clearQueryStr(str.toLowerCase());
  if(str.length < 3){
    return errColor;
  }
  let regexp = new RegExp("[-]");
  if(regexp.test(str.substr(0,1))){
    return errColor;
  }

  colorType = str.substr(0,3);

  switch (colorType) {
    case "rgb":
      color = parseRgb(str.substring(3));
      break;
    case "hsl":
      color = parseHsl(str.substring(3));
      break;
    case "hwb":
      color = parseHwb(str.substring(3));
      break;
    default:
      colorType = str.substr(0,4);
      switch (colorType) {
        case "cmyk":
          color = parseCmyk(str.substring(4));
          break;
        default:
          color = parseHex(str);
      }
  }

  return color;
}

// Разбор RGB
function parseRgb(str){
  let color = "#";
  let color1;
  str = str.substring(1);
  str = str.slice(0, -1);
  let colorArr = str.split(",");
  if((colorArr.length < 3) || (colorArr.length > 3)){
    return errColor;
  }
  for(var i = 0; i < colorArr.length; i++) {
    if(!isNaN(colorArr[i])){
      if((colorArr[i] > 255) || (colorArr[i] < 0)){
        return errColor;
      }
      color1 =  Number(colorArr[i]).toString(16);
      if(color1.length < 2){
        color1 = "0"+color1;
      }
      color += color1;
    }else{
      return errColor;
    }
  }

  return color;
}

// Разбор HSL
function parseHsl(str){
  let color;
  str = str.substring(1);
  str = str.slice(0, -1);
  let colorArr = str.split(",");
  color = hsl2Rgb(colorArr[0],colorArr[1],colorArr[2]);
  return color;
}

function hsl2Rgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Разбор HWB
function parseHwb(str){
  return "hwb:"+str;
}

// Разбор CMYK
function parseCmyk(str){
  return "cmyk:"+str;
}

// Разбор HEX
function parseHex(str){
  let color;

  let regexp = new RegExp("[g-z]");
  if(regexp.test(str)){
    return errColor;
  }

  regexp = new RegExp("[#]");
  //str.replace(/^\s+|\s+$/g, "");
  if(regexp.test(str.substr(0,1))){
    str = str.substring(1);
  }

  let strLen = str.length;
  if((strLen > 6) || (strLen == 4) || (strLen == 5)){
    return errColor;
  }
  //console.log("______________"+ str);
  if((strLen == 3) && (str.substr(2,1) != str.substr(1,1))){
    str = str.substr(0,1) + str.substr(0,1) + str.substr(1,1) + str.substr(1,1) + str.substr(2,1) + str.substr(2,1);
  }else{
    if(strLen > 6){
      return errColor;
    }else{
      let strFiller = str.substr(strLen-1,1);
      for (var i = 0; i < (6 - strLen); i++) {
        str += strFiller;
      }
    }
  }
  //console.log("_________________" + str);

  color = "#"+str;
  return color;
}


// Task2D #colors
app.get("/", (req, res) => {
  if(req.query.color){
    res.send(parseColor(req.query.color));
  }else {
    res.send(errColor);
  }
});

app.listen(3000, () => {
  console.log('Task2D listening on port 3000!');
});
