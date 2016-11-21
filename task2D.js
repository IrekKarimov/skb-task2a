import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

const errColor = "Invalid color";

// Удаление пробелов
function clearQueryStr(str){  
  str = str.replace(/\s+/g,"");
  str = str.replace(/\%20+/g,"");
 return str.toLowerCase();
}

// Определяем формат
function parseColor(str){
  let color;
  let colorType;

  str = clearQueryStr(str);
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
  let color, r, g, b, q, h, l, s, p, hk, tr, tg, tb;
  str = str.substring(1);
  str = str.slice(0, -1);
  let colorArr = str.split(",");

  if((colorArr.length < 3) || (colorArr.length > 3)){
    return errColor;
  }

  h = colorArr[0];
  s = colorArr[1];
  l = colorArr[2];

  if((h > 360) || (h < 0) || (isNaN(h))){
    return errColor;
  }
  if(s.substr(s.length-1,1) == "%"){
    s = s.substr(0,s.length-1)
  }else{
    return errColor;
  }
  if(l.substr(l.length-1,1) == "%"){
    l = l.substr(0,l.length-1)
  }else{
    return errColor;
  }

  if((s > 100) || (s < 0) || (isNaN(s))){
    return errColor;
  }
  if((s > 100) || (s < 0) || (isNaN(s))){
    return errColor;
  }

  if(l < 0.5){ q = l * (1.0 + s);}
  if(l > 0.5){ q = l + s - (l * s);}
  p = 2.0 * l - q;
  hk = h / 360;

  tr = hk + 1/3;
  if(tr < 0){ tr += 1.0}
  if(tr > 0){ tr -= 1.0}

  tg = hk;
  if(tg < 0){ tg += 1.0}
  if(tg > 0){ tg -= 1.0}

  tb = hk - 1/3;
  if(tb < 0){ tb += 1.0}
  if(tb > 0){ tb -= 1.0}

  if(tr < 1/6){ tr = p + ((q-p) * 6.0 * tr);}
  if(tr >= 1/6 && tr < 1/2 ){ tr = q; }
  if(tr >= 1/2 && tr < 2/3){
    tr = p + ((q-p) * (2/3 - tr) * 6.0)
  }else{
    tr = p;
  }

  str = hsl2Rgb(h,s,l);
  return parseRgb("("+str[0]+","+str[1]+","+str[2]+")");
}





function hsl2Rgb(h, s, l) {
  let r, g, b, m, c, x;
  if (!isFinite(h)) h = 0;
  if (!isFinite(s)) s = 0;
  if (!isFinite(l)) l = 0;
  h /= 60;
  if (h < 0) h = 6 - (-h % 6);
  h %= 6;
  s = Math.max(0, Math.min(1, s / 100));
  l = Math.max(0, Math.min(1, l / 100));
  c = (1 - Math.abs((2 * l) - 1)) * s;
  x = c * (1 - Math.abs((h % 2) - 1));
  if (h < 1) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 2) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 3) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 4) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 5) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  m = l - c / 2;
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return [r, g, b];
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
