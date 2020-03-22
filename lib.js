var debugMode = false;

var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
var thousand = 1000;
var million = thousand * 1000;
var billion = million * 1000;
var trillion = billion * 1000;

function printDayShort(date) {
	var result = months[date.getUTCMonth()] + " " + date.getUTCDate() + " '" + (date.getUTCFullYear() % 100);
	debug("printDayShort: " + date + " -> " + result, null);
	return result;
}

function el(elementId) {
	return document.getElementById(elementId);
}

function printNumberShort(number) {
	
	var numberToCheck = number < 0 ? (number * -1) : number;
	if (numberToCheck >= trillion) {
		number = ((number * 1.0) / (trillion * 1.0)) 
		return number.toFixed(2) + "t";
	} else if (numberToCheck >= billion) {
		number = ((number * 1.0) / (billion * 1.0)) 
		return number.toFixed(2) + "b";
	} else if (numberToCheck >= million) {
		number = ((number * 1.0) / (million * 1.0)) 
		return number.toFixed(2) + "m";
	} else if (numberToCheck < 10000) {
		return number.toLocaleString();
	} else if (numberToCheck >= thousand) {
		number = ((number * 1.0) / (thousand * 1.0)) 
		return number.toFixed(0) + "k";
	}
	return number.toLocaleString();
}

function debug(message, details) {
	if (debugMode) {
		if (details == null) {
			console.log(message);
		} else {
			console.log(message, details);
		}
	}
}

//from: https://stackoverflow.com/questions/3885817/how-do-i-check-that-a-number-is-Int-or-integer
function isInteger(x) { 
	return typeof x === "number" && isFinite(x) && Math.floor(x) === x; 
}
//from: https://stackoverflow.com/questions/3885817/how-do-i-check-that-a-number-is-Int-or-integer
function isInt(x) { 
	return !!(x % 1); 
}

/* numberInt = 100, percentInt = 25 (ie 25%), answer = 25 */
function multiplyAndRound(numberInt, percentInt) {
	if (!isInteger(numberInt)) {
		console.log("multiplyAndRound error, numberInt is not an integer:" + numberInt);
		return null;
	}
	if (!isInteger(percentInt)) {
		console.log("multiplyAndRound error, percentInt is not an integer:" + percentInt);
		return null;
	}
	var result = (numberInt * 1.0) * (percentInt / 100.0);
	debug("Result of multiply, numberInt: " + numberInt + ", percentInt: " + percentInt + ", result: " + result);
	return Math.round(result);
}

function getPercentage(currentValueInt, maxValueInt) {
	if (!isInteger(currentValueInt)) {
		console.log("multiplyAndRound error, numberInt is not an integer:" + currentValueInt);
		return null;
	}
	if (!isInteger(maxValueInt)) {
		console.log("multiplyAndRound error, percentInt is not an integer:" + maxValueInt);
		return null;
	}
	var result = ((currentValueInt * 1.0) / (maxValueInt * 1.0) * 100.0);
	debug("Result of percentage, currentValueInt: " + currentValueInt + ", maxValueInt: " + maxValueInt + ", result: " + result);
	return Math.round(result);
}

function incrementDate(date, dayCountInt) {
	var d = new Date(date.getTime());
	d.setUTCDate(d.getUTCDate() + dayCountInt);
	debug("Incremented date: " + date + " by " + dayCountInt + ": " + d);
	return d;
}

function getSliderValue(sliderId) {
	return document.getElementById(sliderId).valueAsNumber;
}

function updateSliderLabel(slider) {
	var valueAsNumber = slider.valueAsNumber;
	var text = slider.previousElementSibling.innerText;
	if (text.indexOf(" [") != -1) {
		text = text.substr(0, text.indexOf(" ["));
	}
	
	if (slider.getAttribute("format") == "percentage") {
		text += " [" + slider.valueAsNumber.toLocaleString() + "%]";
	} else {
		text += " [" + printNumberShort(slider.valueAsNumber) + "]";
	}
	slider.previousElementSibling.innerText = text;
}

function generateSimulationTable(numberOfDaysToSimulate, coronaSimSettings) {
	var simulator = new CoronaSimulator(coronaSimSettings);
	
	var tableDataArray = [];

	//first day
	tableDataArray.push({
			dayInt: 0,
			newCasesInt: 0,
			totalCasesInt: coronaSimSettings.initialCaseCountInt,
			totalDeathsInt: simulator.initialDeathCount,
			currentHospitalizedInt: 0,
			bedsFreeInt: coronaSimSettings.numberOfHospitalBedsInt
	});

	for (i = 0; i < numberOfDaysToSimulate; i++) {
		simulator.moveForwardOneDay();				
		tableDataArray.push({
			dayInt: simulator.currentDayInt,
			newCasesInt: simulator.currentDayStats.numberOfNewCasesInt,
			totalCasesInt: simulator.totalStats.totalCasesInt,
			totalDeathsInt: simulator.totalStats.totalDeathsInt,
			currentHospitalizedInt: simulator.hospitalizationCountIntForDay(simulator.currentDayInt),
			bedsFreeInt: simulator.hospitalBedsAvailableIntForDay(simulator.currentDayInt)
		});
		var totalCases = simulator.totalStats.totalCasesInt;
		if (totalCases > coronaSimSettings.populationCapInt) {
			console.log("stopping simulation, hit population limit: " + totalCases.toLocaleString());
			break;
		}
	}

	var html = "<table class='table'>\n";
	html += "<thead>";
	html += "<th>Day</th>";
	html += "<th>New Cases<br/>Today</th>";
	html += "<th>Total<br/>Cases</th>";
	html += "<th>Total<br/>Deaths</th>";
	html += "<th>Beds Used</th>";
	html += "<th>Beds Free</th>";
	html += "</thead>\n";
	html += "<tbody>\n";

	for (var tableEntry of tableDataArray) {
		html += "<tr>";
		var rowDate = incrementDate(coronaSimSettings.initialDate, tableEntry.dayInt);
		html += "<td>" + printDayShort(rowDate) + "</td>";
		html += "<td>" + printNumberShort(tableEntry.newCasesInt) + "</td>";
		html += "<td>" + printNumberShort(tableEntry.totalCasesInt) + "</td>";
		html += "<td>" + printNumberShort(tableEntry.totalDeathsInt) + "</td>";
		html += "<td>" + printNumberShort(tableEntry.currentHospitalizedInt) + "</td>";
		html += "<td>" + printNumberShort(tableEntry.bedsFreeInt) + "</td>";
		html += "</tr>\n";
	}

	html += "</tbody>\n</table>";
	return html;
}