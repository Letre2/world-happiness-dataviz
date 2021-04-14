const paper = Snap("#svgContainer");
let dataHappy = [];
let paperWidth = window.innerWidth;
let paperHeight = window.innerHeight;
let dataBase = window.dataBase;
let bgColor = "#FFFAEA";
const paperX = document.getElementById("svgContainer").getBoundingClientRect().left;
const backgorundColor = document.getElementById("svgContainer").style.backgroundColor = bgColor;
let flowerSizeMax = 120;
let flowerSizeMin = 3;
let zoomScaler = 1.5;
let flowerStorage = [];
let flowerParts = [];
let flowerPartsLine = [];
let data2020in2015order = [];
let dataFlower2020 = [];
let dataFlower2015 = [];
let myPoints, myLine, myBox, myFlower;
let firstDblClick = false;
let secondDblClick = false;
let category = "GDP";
const colors = [rgba(243, 170, 141, 1), rgba(132, 53, 74, 1), rgba(104, 141, 163, 1), rgba(226, 218, 217, 1), rgba(106, 88, 121, 1), rgba(191, 104, 129, 1), rgba(236, 110, 122, 1)];
const colorsSkatter = [rgba(243, 170, 141, 0.8), rgba(132, 53, 74, 0.8), rgba(104, 141, 163, 0.5), rgba(226, 218, 217, 0.5), rgba(106, 88, 121, 0.8), rgba(191, 104, 129, 0.8), rgba(236, 110, 122, 0.5)];
const categories = ["GDP", "socialSupport", "healthyLifeExpectancy", "freedom", "generosity", "perceptionsOfCorruption", "dystopiaResidual"];

window.data2015 = [];
window.data2016 = [];
window.data2017 = [];
window.data2018 = [];
window.data2019 = [];
window.data2020 = [];

init();
function init() {
  mergeData();
  //flowerPartsPush();
  createFlower(data2020);
  //initScatter(data2020);
  handleEvents(data2020);
}
//MERGE DATA ALLER JAHRE MIT COUNTRYCODE UND LONGITUDE UND LATITUDE
function mergeData() {
  for (var k = 15; k <= 20; k++) {
    let happy = "happy20" + k.toString();
    let dataHappy = "data20" + k.toString();
    for (let i = 0; i < window[happy].length; i++) {
      for (let j = 0; j < countrycode.length; j++) {
        if (window[happy][i].country == countrycode[j].Country) {
          let newCountry = {
            "country": window[happy][i].country,
            "longitude": countrycode[j].longitude,
            "latitude": countrycode[j].latitude,
            "rank": window[happy][i].rank,
            "ladderScore": window[happy][i].ladderScore,
            "GDP": window[happy][i].GDP,
            "socialSupport": window[happy][i].socialSupport,
            "healthyLifeExpectancy": window[happy][i].healthyLifeExpectancy,
            "freedom": window[happy][i].freedom,
            "generosity": window[happy][i].generosity,
            "perceptionsOfCorruption": window[happy][i].perceptionsOfCorruption,
            "dystopiaResidual": window[happy][i].dystopiaResidual
          };
          window[dataHappy].push(newCountry);
        }
      }
    }
  }
}




  var panZoomFlower = svgPanZoom('#svgContainer', {
    viewportSelector: '.svgContainer',
    panEnabled: true,
    controlIconsEnabled: false,
    zoomEnabled: true,
    dblClickZoomEnabled: false,
    mouseWheelZoomEnabled: true,
    preventMouseEventsDefault: true,
    zoomScaleSensitivity: 1,
    minZoom: 1,
    maxZoom: 14,
    fit: false,
    contain: false,
    center: true,
    refreshRate: 'auto',
    beforeZoom: function() {},
    onZoom: function() {},
    beforePan: function() {},
    onPan: function() {},
    onUpdatedCTM: function() {},
    eventsListenerElement: null
  });


////////////////------Blumen werden in flowerStorage ausgelagert------//////////////
function createFlower(year) {
  flowerPartsPush();
  flowerStorage.push([])
  const rankMin2020 = getExtreme(data2020, "rank", false);
  const rankMax2020 = getExtreme(data2020, "rank", true);
  for (let b = 0; b < flowerParts.length; b++) {
    // Start und End Angle der einzelnen Blütenblätter werden berechnet
    flowerStorage.push([]);
    startAngle = [],
      endAngle = [];
    for (let t = 0, offset = 0; t < flowerParts[b].length; t++) {
      let totalFlowerSum = flowerParts[b].reduce((pv, cv) => pv + cv, 0);
      startAngle.push(offset);
      offset += ((360 / totalFlowerSum) * flowerParts[b][t]);
      endAngle.push(offset);
    //Offset Koordinaten - von dort Startet die Animation
      let xPos = paperWidth / 2;
      let yPos = paperHeight/ 2;
    //Flower Druchmesser
      let flowerArea = map(data2020[b].rank, rankMax2020, rankMin2020, flowerSizeMin, flowerSizeMax);
      let diagramRadius = (Math.sqrt(flowerArea / Math.PI)) * zoomScaler;
    //Parameter werden an die getPathString funktion übergeben und ein pathString wird returned
      let pathString = getPathString(startAngle[t], endAngle[t], diagramRadius, diagramRadius, xPos, yPos);
    //alles wird in ein flowerStorage gespeichert. Diese Flower wird in der Animate funktion wiederverwendet. So wird in dem gesamten Programm immer die selben Flower verwendet.
      flowerStorage[b].push(paper.path(pathString).attr({
        fill: colors[t],
        stroke: "#FFFFF5",
        strokeWidth: 0.2,
        id: data2020[b].country,
        "fill-opacity": 1,
      }));
    }
  }
  drawMap(year);
}
////////////////------First Screen DRAW FLOWER MAP------//////////////

function drawMap(year) {

  //rankMin und rankMax werden berechnet um später damit den Radius der Blume zu bestimmen
  const rankMin2020 = getExtreme(data2020, "rank", false);
  const rankMax2020 = getExtreme(data2020, "rank", true);
  //flowerParts --> Blumen werden hier generiert
  for (let x = 0; x < flowerParts.length; x++) {
    startAngle = [],
      endAngle = [];
      //flowerParts[x] --> Blütenblätter werden hier generiert
    for (let a = 0, offset = 0; a < flowerParts[x].length; a++) {
      // hier wird die Summe einer einzelnen Blume berechnet
      let totalFlowerSum = flowerParts[x].reduce((pv, cv) => pv + cv, 0);
      // Start und Ende einer blütenblatts werden berechnet. Offset = ende des letzten Blütenblatts
      startAngle.push(offset);
      offset += ((360 / totalFlowerSum) * flowerParts[x][a]);
      endAngle.push(offset);
      //x-Pos und y-Pos werden anhand von Koordinaten berechnet
      let xPos = map(data2020[x].longitude, 0 - 180, 180, 0, paperWidth) - 180;
      let yPos = paperHeight - map(data2020[x].latitude, 0 - 90, 90, 0, paperHeight) + 50;
      // flowerArea = Boundingborder
      let flowerArea = map(data2020[x].rank, rankMax2020, rankMin2020, flowerSizeMin, flowerSizeMax);
      //Radius wird unter einsatz von flowerArea berechnet
      let diagramRadius = (Math.sqrt(flowerArea / Math.PI)) * zoomScaler;
      // berechnete Werte werden an getPathString weiter gegeben
      let pathString = getPathString(startAngle[a], endAngle[a], diagramRadius, diagramRadius/2, xPos, yPos);
      //der berechnet pathString wird mit animateFlower animiert.
      animateFlower(flowerStorage[x][a], pathString);
    }
  }
}

////////////////------secondScreen------////////////////

function drawScatter(year, category, categories, color) {
  setBackgroundColor(color);
  const rankMin2020 = getExtreme(data2020, "rank", false);
  const rankMax2020 = getExtreme(data2020, "rank", true);
  let categoryMin = getExtreme(year, category, false);
  let categoryMax = getExtreme(year, category, true);
  const ladderScoreMin = getExtreme(year, "ladderScore", false);
  const ladderScoreMax = getExtreme(year, "ladderScore", true);
  for (let x = 0; x < flowerParts.length; x++) {
    startAngle = [],
      endAngle = [];
    let flowerArea = map(data2020[x].rank, rankMax2020, rankMin2020, flowerSizeMin, flowerSizeMax);
    let diagramRadius = (Math.sqrt(flowerArea / Math.PI)) * zoomScaler;
    for (let a = 0, offset = 0; a < flowerParts[x].length; a++) {
      let totalFlowerSum = flowerParts[x].reduce((pv, cv) => pv + cv, 0);
      startAngle.push(offset);
      offset += ((360 / totalFlowerSum) * flowerParts[x][a]);
      endAngle.push(offset);
      let xPos = map(year[x][category], categoryMin, categoryMax, 0, paperWidth);
      let yPos = paperHeight - map(year[x].ladderScore, ladderScoreMin, ladderScoreMax, 0, paperHeight);
      let pathString = getPathString(startAngle[a], endAngle[a], diagramRadius, diagramRadius, xPos, yPos);
      animateFlower(flowerStorage[x][a], pathString);

    }
  }
}
function animateFlower(flower, pathString) {
  flower.animate({
    d: pathString,
    "fill-opacity": 1,
  }, 1200, mina.easeout)
}

function setBackgroundColor(color) {
  document.getElementById("svgContainer").style.backgroundColor = color
  paper.animate({
    fill: color
  }, 200)
}

function handleEvents(year) {
  paper.dblclick(function() {
    if (firstDblClick == false) {
      firstDblClick = true;
      let index = 0;
      if (secondDblClick == false) {
        panZoomFlower.resetZoom();
        panZoomFlower.resetPan();
        panZoomFlower.disableZoom();
        panZoomFlower.disablePan();
        drawScatter(year, categories[index], categories, colorsSkatter[index]);
        paper.click(function() {
          index++;
          if (index > categories.length - 1) {
            panZoomFlower.resetZoom();
            panZoomFlower.resetPan();
            panZoomFlower.disableZoom();
            panZoomFlower.disablePan();
            drawLine();
            return false;
          }
          panZoomFlower.resetZoom();
          panZoomFlower.resetPan();
          panZoomFlower.disableZoom();
          panZoomFlower.disablePan();
          drawScatter(year, categories[index], categories, colorsSkatter[index]);
        })
      }
    } else {
      panZoomFlower.resetZoom();
      panZoomFlower.resetPan();
      panZoomFlower.disableZoom();
      panZoomFlower.disablePan();
      drawLine();
    }
  })
}

function drawLine() {
  if (secondDblClick == false) {
    paper.unclick();
    firstDblClick = true;
    secondDblClick = true;
    setBackgroundColor(bgColor);
    initLine();
  } else {
    paper.undblclick();
    window.location.reload()
  }
}

////////////////------thirdScreen------////////////////

//RUFT DAS GESAMTE PROGRAMM AUF (ALLES WIRD INIZIALISIERT)
function initLine() {
  initData();
  createDataFlower();
  flowerPartsLinePush();
  drawFlowerLine();

  mypoints = getPoints(dataFlower2015);
  createLine();
  paper.mousemove(updateDisplay);
}

//Daten werden in die Reihenfolge von data2015 gebracht. So bleiben die Länder immer an der gleichen Position
function initData() {
  for (var i = 0; i < data2015.length; i++) {
    let country = data2015[i].country;
    let row = data2020.find(el => el.country == country);
      data2020in2015order.push(row);
      dataFlower2015.push(data2015[i].ladderScore)
  }
}


//arry dataFlower2020 wird befüllt
function createDataFlower() {
  for (var i = 0; i < data2020in2015order.length; i++) {
    dataFlower2020.push(data2020in2015order[i].ladderScore)
  }
}

// LINIE WELCHE AM ANFANG ANGEZEIGT WIRD, WIRD GEMALT
function createLine() {
  myLine = paper.polyline(mypoints).attr({
    stroke: "red",
    strokeWidth: 1,
    fill: "none",
    opacity: 0.2,
  });
}

//X-KOORDINATEN VON MAUS WERDEN IN INIT ABGEHÖRT UND AN DIE updateDisplay funcition weitergegeben
function updateDisplay(event) {
  //ES WERDEN DIE MOUSEX KOORDINATEN BERECHNET DA MOUSEMOVE DIE KOORDINATEN IM BEZUG AUF DIE GANZE SEITE LIEFERT UND BENÖTIGT WERDEN KOORDINATEN FÜR DEN SVG-CONTAINER
  const mouseX = Math.floor(event.pageX - paperX);
  //Welchen Werten zwischen dataLeft und dataRight entspricht die aktuelle Mausposition?
  const virtualValues = getValues(mouseX / paperWidth);
  //MYPOINTS WERDEN DURCH getValues funktion BRECHENET. MOUSE-X / paperWidth = Prozent. Rechter rand = 1, linker Rand = 0
  myPoints = getPoints(virtualValues);
  updateFlowerLine(virtualValues);
  changeLine(myPoints);
}

// wird in updateFlowerLine aufgerufen.
function changeFlowerLine(flower, pathString) {
  flower.attr({
    d: pathString
  })
}

function changeLine(points) {
  myLine.attr({
    points: points
  });
}

//INPUT-WERTE (virtualValues oder dataFlower2015) WERDEN ZU KOORDINATEN BERECHNET UND IN POINTS ARRY GESPEICHERT
function getPoints(input) {
  let points = [];
  const maxValue = Math.max(...dataFlower2015, ...dataFlower2020);
  const minValue = Math.min(...dataFlower2015, ...dataFlower2020);
  for (let i = 0; i < dataFlower2015.length; i++) {
    let xPos = i * paperWidth / (dataFlower2015.length - 1);
    let yPos = map(input[i], minValue, maxValue, 0, paperHeight);
    points.push(xPos, paperHeight - yPos);
  }
  return points;
}

//Malt zum Start Screen die Blumen Animation (OnDBClick)
function drawFlowerLine() {
  const rankMinFilter = getExtreme(data2020in2015order, "rank", false);
  const rankMaxFilter = getExtreme(data2020in2015order, "rank", true);
  const maxValue = Math.max(...dataFlower2015, ...dataFlower2020);
  const minValue = Math.min(...dataFlower2015, ...dataFlower2020);
  for (let x = 0; x < dataFlower2015.length; x++) {
    startAngle = [],
      endAngle = [];
    for (let a = 0, offset = 0; a < flowerPartsLine[x].length; a++) {
      let totalFlowerSum = flowerPartsLine[x].reduce((pv, cv) => pv + cv, 0);
      startAngle.push(offset);
      offset += ((360 / totalFlowerSum) * flowerPartsLine[x][a]);
      endAngle.push(offset);
      let xPos = x * paperWidth / (dataFlower2015.length - 1);
      let yPos = map(data2015[x].ladderScore, maxValue, minValue, 0, paperHeight);
      let flowerArea = map(data2020[x].rank, rankMaxFilter, rankMinFilter, flowerSizeMin, 80);
      let diagramRadius = (Math.sqrt(flowerArea / Math.PI)) * zoomScaler;
      let pathString = getPathString(startAngle[a], endAngle[a], diagramRadius, diagramRadius, xPos, yPos);
      animateFlower(flowerStorage[x][a], pathString);
    }
  }
}

//Updatet die Blumen wenn Mousemove-X. Input wird in getValues berechnet
function updateFlowerLine(input) {
  const rankMinFilter = getExtreme(data2020in2015order, "rank", false);
  const rankMaxFilter = getExtreme(data2020in2015order, "rank", true);
  const maxValue = Math.max(...dataFlower2015, ...dataFlower2020);
  const minValue = Math.min(...dataFlower2015, ...dataFlower2020);
  for (let x = 0; x < dataFlower2015.length; x++) {
    startAngle = [],
      endAngle = [];
    for (let a = 0, offset = 0; a < flowerPartsLine[x].length; a++) {
      let totalFlowerSum = flowerPartsLine[x].reduce((pv, cv) => pv + cv, 0);
      startAngle.push(offset);
      offset += ((360 / totalFlowerSum) * flowerPartsLine[x][a]);
      endAngle.push(offset);
      let xPos = x * paperWidth / (dataFlower2015.length - 1);
      let yPos = map(input[x], maxValue, minValue, 0, paperHeight);
      let flowerArea = map(data2020[x].rank, rankMaxFilter, rankMinFilter, flowerSizeMin, 80);
      let diagramRadius = (Math.sqrt(flowerArea / Math.PI)) * zoomScaler;
      let pathString = getPathString(startAngle[a], endAngle[a], diagramRadius, diagramRadius, xPos, yPos);
      changeFlowerLine(flowerStorage[x][a], pathString);
    }
  }
}

function getValues(coefficient) {
  let values = [];
  for (let i = 0; i < dataFlower2015.length; i++) {
    values.push(coefficient * dataFlower2015[i] + (1 - coefficient) * dataFlower2020[i]);
  }
  return values;
}

////////////////------HELPER FUNCTIONS------////////////////

function flowerPartsPush() {
  for (let i = 0; i < window.data2020.length; i++) {
    flowerParts.push([
      window.data2020[i].GDP,
      window.data2020[i].healthyLifeExpectancy,
      window.data2020[i].socialSupport,
      window.data2020[i].freedom,
      window.data2020[i].generosity,
      window.data2020[i].perceptionsOfCorruption * 2,
      window.data2020[i].dystopiaResidual / 2
    ]);
  }
}

function flowerPartsLinePush() {
  for (let i = 0; i < data2020in2015order.length; i++) {
    flowerPartsLine.push([
      data2020in2015order[i].GDP,
      data2020in2015order[i].healthyLifeExpectancy,
      data2020in2015order[i].socialSupport,
      data2020in2015order[i].freedom,
      data2020in2015order[i].generosity,
      data2020in2015order[i].perceptionsOfCorruption * 2,
      data2020in2015order[i].dystopiaResidual / 2
    ]);
  }
}

//BERECHNET DEN GRÖ?TEN UND KLEINSTEN WERT
function getExtreme(year, property, getMax = true) {
  //data2019[0][property] same as data2019[0].property
  let extreme = year[0][property];
  for (var i = 0; i < year.length; i++) {
    if (getMax) {
      if (year[i][property] > extreme) {
        extreme = year[i][property];
      }
    } else {
      if (year[i][property] < extreme)
        extreme = year[i][property];
    }
  }
  return extreme;
}

//PATH WIRD BERECHNET
function getPathString(startAngle, endAngle, radiusOutside, width, xPos, yPos, ) {
  let radiusInside = (radiusOutside - width);
  const diagramCenter = {
    x: xPos,
    y: yPos,
  };
  //an welcher Koordinate fängt der innere Bogen des Blütenblatts an?
  let arcInsideStart = {
    x: diagramCenter.x + (radiusInside * Math.cos(radians(startAngle))),
    y: diagramCenter.y + (radiusInside * Math.sin(radians(startAngle)))
  };
  // an welcher Koordinate hört der Bogen des Blütenblatts auf?
  let arcInsideEnd = {
    x: diagramCenter.x + (radiusInside * Math.cos(radians(endAngle))),
    y: diagramCenter.y + (radiusInside * Math.sin(radians(endAngle)))
  };
  // Wo beginnt der Bogen an der Äußeren Blume? Wo hört er auf?
  let arcOutsideEnd = {
    x: diagramCenter.x + (radiusOutside * Math.cos(radians(endAngle))),
    y: diagramCenter.y + (radiusOutside * Math.sin(radians(endAngle)))
  };
  let arcOutsideStart = {
    x: diagramCenter.x + (radiusOutside * Math.cos(radians(startAngle))),
    y: diagramCenter.y + (radiusOutside * Math.sin(radians(startAngle)))
  };
  let over180Degrees = "0";
  if (endAngle - startAngle > 180) over180Degrees = "1";
  //SVG PATH WIRD GESCHRIEBEN
  return "M" + arcOutsideStart.x + "," + arcOutsideStart.y +
    " L" + diagramCenter.x + "," + diagramCenter.y +
    " L" + arcOutsideEnd.x + "," + arcOutsideEnd.y +
    " A" + radiusOutside / 10 + "," + radiusOutside / 10 + " 1 " + over180Degrees + ",0 " + arcOutsideStart.x + "," + arcOutsideStart.y +
    " Z";
};
