var debugMode = false;

var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

function printDayShort(date) {
	return months[date.getMonth()] + " " + date.getDate();
}

function printNumberShort(number) {
	var thousand = 1000;
	var million = thousand * 1000;
	var billion = million * 10000;
	var numberToCheck = number < 0 ? (number * -1) : number;
	if (numberToCheck > billion) {
		number = ((number * 1.0) / (billion * 1.0)) 
		return number.toFixed(2) + "b";
	} else if (numberToCheck > million) {
		number = ((number * 1.0) / (million * 1.0)) 
		return number.toFixed(2) + "m";
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
	d.setDate(d.getDate() + dayCountInt);
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
	text += " [" + slider.valueAsNumber.toLocaleString() 
	if (slider.getAttribute("format") == "percentage") {
		text += "%";
	}
	text += "]";
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
			totalDeathsInt: 0,
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
		var rowDate = incrementDate(new Date(), tableEntry.dayInt);
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