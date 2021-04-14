var paper = Snap("#svgContainer");
var paperWidth = window.innerWidth;
var paperHeight = window.innerHeight;
const backgorundColor = document.getElementById("svgContainer").style.backgroundColor = "#FEFAEB";

var data = [5, 5, 5, 5, 5, 5, 5];
var donutParts = [];
const colors = ["#F3AA8D", "#84354A", "#688DA3", "#E2DAD9", "#6A5879", "#BF6881", "#EC6E7A"];

init();
let dataBase = window.dataBase;

 window.data2015 = []; window.data2016 = []; window.data2017 = []; window.data2018 = []; window.data2019 = []; window.data2020 = [];

 mergeData();


function mergeData() {
  for (var k = 15; k <= 20; k++) {

  let happy = "happy20" + k.toString();
  let data = "data20" + k.toString();

   for (let i = 0; i < window[happy].length; i++) {
    for (let j = 0; j < countrycode.length; j++) {

      if (window[happy][i].country == countrycode[j].Country) {
        let newCountry = {

          "country": window[happy][i].country,
          "longitude": countrycode[j].longitude,
          "latitude": countrycode[j].latitude,
          "rank": window[happy][i].rank,
          "ladderScore":window[happy][i].ladderScore,
          "GDP": window[happy][i].GDP,
          "socialSupport": window[happy][i].socialSupport,
          "healthyLifeExpectancy": window[happy][i].healthyLifeExpectancy,
          "freedom": window[happy][i].freedom,
          "generosity": window[happy][i].generosity,
          "perceptionsOfCorruption": window[happy][i].perceptionsOfCorruption,
          "dystopiaResidual": window[happy][i].dystopiaResidual

        };
        //console.log(newCountry);
        window[data].push(newCountry);


       }

      }
    }
  }
}


function init() {
    var totalAmount = 0;
    for (var i = 0; i < data.length; i++) {
        totalAmount += data[i];
        donutParts.push({
            val: data[i],
            opacity: (1 / (data.length + 1)) * (i + 1)
        });
    }
    var startAngle = 0;
    for (i = 0; i < donutParts.length; i++) {
        donutParts[i].angle = donutParts[i].val / totalAmount * 360;
        donutParts[i].startAngle = startAngle;
        startAngle += donutParts[i].angle;
        donutParts[i].endAngle = startAngle;
    }
    drawDiagram();
}
console.log(paperWidth);

function drawDiagram() {
    var cubic = (0.5 * paperWidth / 2);
    var diagramRadius = (paperWidth/5);
    var donutWidth = (0.38 * paperWidth / 2);
    for (var i = 0; i < donutParts.length; i++) {
    var xPos = paperWidth / 2
    var yPos = paperHeight / 2
        var pathString = getPathString(donutParts[i].startAngle, donutParts[i].endAngle, diagramRadius, diagramRadius, xPos, yPos);
        donutParts[i].form = paper.path(pathString,).attr({
            fill: colors[i],
            //opacity: donutParts[i].opacity,
            stroke:"#FFFFFF",
            strokeWidth: 8,

        });
    }
}

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
