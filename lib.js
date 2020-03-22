var debugMode = false;

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
			newCasesInt: coronaSimSettings.initialCaseCountInt,
			totalCasesInt: coronaSimSettings.initialCaseCountInt,
			totalHospitalizationsInt: 0,
			totalDeathsInt: 0,
			totalSurvivalsInt: 0,
			bedsFree: coronaSimSettings.numberOfHospitalBedsInt
	});

	for (i = 0; i < numberOfDaysToSimulate; i++) {
		simulator.moveForwardOneDay();				
		tableDataArray.push({
			dayInt: simulator.currentDayInt,
			newCasesInt: simulator.currentDayStats.numberOfNewCasesInt,
			totalCasesInt: simulator.totalStats.totalCasesInt,
			totalHospitalizationsInt: simulator.totalStats.totalHospitalizationsInt,
			totalDeathsInt: simulator.totalStats.totalDeathsInt,
			totalSurvivalsInt: simulator.totalStats.totalSurvivalsInt,
			bedsFree: simulator.hospitalBedsAvailableIntForDay(simulator.currentDayInt)
		});
	}

	var html = "<table class='table'>\n<thead>";
	html += "<th>Day</th>";
	html += "<th>New Cases</th>";
	html += "<th>Total<br/>Cases</th>";
	html += "<th>Total<br/>Deaths</th>";
	html += "<th>Total<br/>Survivals</th>";
	html += "<th>Total<br/>Hospitalizations</th>";
	html += "<th>Beds Free</th>";
	html += "</thead>\n<tbody>\n";

	for (var tableEntry of tableDataArray) {
		html += "<tr>";
		html += "<td>" + tableEntry.dayInt + "</td>";
		//new cases (% of total)

		html += "<td>" + tableEntry.newCasesInt.toLocaleString() + "</td>";
		html += "<td>" + tableEntry.totalCasesInt.toLocaleString() + "</td>";
		html += "<td>" + tableEntry.totalDeathsInt.toLocaleString() + "</td>";
		html += "<td>" + tableEntry.totalSurvivalsInt.toLocaleString() + "</td>";
		html += "<td>" + tableEntry.totalHospitalizationsInt.toLocaleString() + "</td>";
		html += "<td>" + tableEntry.bedsFree.toLocaleString() + "</td>";
		html += "</tr>\n";
	}


	html += "</tbody>\n</table>";
	return html;
}