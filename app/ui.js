import document from 'document';

const radiansPerMinute = 2 * Math.PI / 60;
const radiansPerHour = 2 * Math.PI / 12;

export function CryptoUI() {
  const root = document.getElementById("root");
  
  this.height = root.height;
  this.width = root.width;
  this.center = {
    x: this.width / 2,
    y: this.height / 2
  }
  
  
  this.hourHand = document.getElementById("hours");
  this.minHand = document.getElementById("mins");
  
  this.lineSegments = [];
  for (let i = 0; i < 59; i++) {
    let lineSegment = document.getElementById(`line-${i}`);
    if (lineSegment) {
      this.lineSegments.push(lineSegment);
    }
  }
}

// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes) {
  return (360 / 60) * minutes;
}

CryptoUI.prototype.updateClock = function() {
  let today = new Date();
  let hours = today.getHours() % 12;
  let mins = today.getMinutes();

  this.hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins);
  this.minHand.groupTransform.rotate.angle = minutesToAngle(mins);
  
  const hourMarkCoords = calculateHourMarks(this.center, this.height * 0.4, 4)
  for (let i = 0; i < 12; i++) {
    let coord = hourMarkCoords[i];
    let hourMark = document.getElementById(`hour-${i}`);
    if (hourMark) {
      hourMark.x1 = coord.x1;
      hourMark.y1 = coord.y1;
      hourMark.x2 = coord.x2;
      hourMark.y2 = coord.y2;
    }
  }
    
}

CryptoUI.prototype.updateChart = function(data) {
  
  const center = {
    x: this.width / 2,
    y: this.height / 2
  };
  
  // fix functions -> clearer arguments
  // slice array beforehand
  // coordinates method should only take active minutes
  
  const minutes = new Date().getMinutes();
  const minutePrices = data.minute;
  const minutePricesThisHour = minutePrices.slice(60 - minutes)
  const hourHigh = data.hour.high;
  const hourLow = data.hour.low;
  
  const innerRadius = this.height * 0.30;
  const outerRadius = this.height * 0.50;
  
  let coords = mapDataToCoordinates(minutePricesThisHour, center, hourLow, hourHigh, innerRadius, outerRadius);
  
  const newPrice = minutePrices[minutePrices.length - 1];
  const oldPrice = minutePrices[0];
  
  const percentChange = calculatePercentChange(oldPrice, newPrice);
  
  console.log(percentChange);
  
  for (let i = 0; i < this.lineSegments.length; i++) {
    let line = this.lineSegments[i]; 
    
    if (i >= coords.length - 1) {
      line.style.visibility = 'hidden';
      continue;
    }
    
    if (percentChange >= 0) {
      line.style.fill = 'green';
    } else {
      line.style.fill = 'red';
    }
    
    
    line.style.visibility = 'visible';
    
    line.x1 = coords[i].x;
    line.y1 = coords[i].y;
    
    line.x2 = coords[i+1].x;
    line.y2 = coords[i+1].y;
  
  }
}

// scale data using linear interpolation
function scaleData(data, oldMin, oldMax, newMin, newMax) {
  const dataMin = Math.min.apply(null, data);
  const dataMax = Math.max.apply(null, data);
  
  console.log(dataMin);
  
  if (dataMin < oldMin) {
    oldMin = dataMin;
  }
  
  if (dataMax > oldMax) {
    oldMax = dataMax;
  }
  
  return data.map(function(d) {
    return (d - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin;
  });
}

function calculatePercentChange(oldValue, newValue) {
  return (newValue - oldValue) / oldValue * 100;
}


function mapDataToCoordinates(data, center, hourLow, hourHigh, innerRadius, outerRadius) {
  
  const r = scaleData(data, hourLow, hourHigh, innerRadius, outerRadius);
  
  const coordinates = [];
  for (let i = 0; i < r.length; i++) {
    coordinates.push({
      x: Math.round(r[i] * Math.sin(radiansPerMinute * i) + center.x),
      y: Math.round(-1 * r[i] * Math.cos(radiansPerMinute * i) + center.y)
    });
  }
  
  return coordinates;
}

function calculateHourMarks(center, radius, length) {
  const coordinates = [];
  for (let i = 0; i < 12; i++) {
    coordinates.push({
      x1: (radius - length) * Math.cos(radiansPerHour * i) + center.x,
      y1: (radius - length) * Math.sin(radiansPerHour * i) + center.y,
      x2: (radius + length) * Math.cos(radiansPerHour * i) + center.x,
      y2: (radius + length) * Math.sin(radiansPerHour * i) + center.y 
    });
  }
  return coordinates;
}