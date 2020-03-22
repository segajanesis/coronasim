/* js class reference: https://www.w3schools.com/js/js_classes.asp */
class CoronaSimSettings {

	/*
		fields: 

		coronaSimSettings.initialCaseCountInt
		coronaSimSettings.initialDate
		coronaSimSettings.percentNewCasesPerDayInt
		coronaSimSettings.percentCasesResultingInHospitalizationInt
		coronaSimSettings.percentCasesResultingInDeathInt
		coronaSimSettings.percentCasesResultingInSurvivalInt
		coronaSimSettings.numberOfHospitalBedsInt
		coronaSimSettings.numberOfDaysHospitalizedInt
		coronaSimSettings.populationCapInt
	*/

	get initialCaseCountInt() {
		return this._initialCaseCountInt;
	}

	set initialCaseCountInt(x) {
		this._initialCaseCountInt = x;
	}

	get initialDate() {
		return this._initialDate;
	}

	set initialDate(x) {
		this._initialDate = x;
	}

	/* 
		This is the number we use to multiple and determine the new cases per day.

		For example, if this number is 0.10f (10%) and the number of cases on day 1
		is 100 cases, then the new cases on day two would be 100 cases multiplied by 
		this percentage: 100 * 0.10f = 10. 
	*/
	get percentNewCasesPerDayInt() {
		return this._percentageNewCasesPerDayInt;
	}

	set percentNewCasesPerDayInt(x) {
		this._percentageNewCasesPerDayInt = x;
	}

	get percentCasesResultingInHospitalizationInt() {
		return this._percentCasesResultingInHospitalizationInt;
	}

	set percentCasesResultingInHospitalizationInt(x) {
		this._percentCasesResultingInHospitalizationInt = x;
	}

	get percentCasesResultingInDeathInt() {
		return this._percentCasesResultingInDeathInt;
	}

	set percentCasesResultingInDeathInt(x) {
		return this._percentCasesResultingInDeathInt = x;
	}

	get percentCasesResultingInSurvivalInt() {
		return this._percentCasesResultingInSurvivalInt;
	}

	set percentCasesResultingInSurvivalInt(x) {
		this._percentCasesResultingInSurvivalInt = x;
	}

	get numberOfHospitalBedsInt() {
		return this._numberOfHospitalBedsInt;
	}

	set numberOfHospitalBedsInt(x) {
		this._numberOfHospitalBedsInt = x;
	}			

	get numberOfDaysHospitalizedInt() {
		return this._numberOfDaysHospitalizedInt;
	}

	set numberOfDaysHospitalizedInt(x) {
		this._numberOfDaysHospitalizedInt = x;
	}

	get populationCapInt() {
		return this._populationCapInt;
	}

	set populationCapInt(x) {
		this._populationCapInt = x;
	}
}

class DayStats {

	/*
		fields: 

		dayStats.dayNumberInt
		dayStats.finalHospitalDayNumberInt
		dayStats.numberOfCasesInt
		dayStats.numberOfNewCasesInt
		dayStats.numberOfCasesInHospitalInt
		dayStats.numberOfCasesResultingInDeathInt
		dayStats.numberOfCasesResultingInSurvivalInt
	*/

	constructor(dayNumberInt, dayBeforeCaseCount, coronaSimSettings) {
		this._dayNumberInt = dayNumberInt;
		this._dayNumberDate = incrementDate(coronaSimSettings.initialDate, dayNumberInt);
		this._finalHospitalDayNumberInt = this._dayNumberInt + coronaSimSettings.numberOfDaysHospitalizedInt;
		this._numberOfNewCasesInt = multiplyAndRound(dayBeforeCaseCount, coronaSimSettings.percentNewCasesPerDayInt);
		this._numberOfCasesInt = dayBeforeCaseCount + this._numberOfNewCasesInt;
		this._numberOfCasesInHospitalInt = multiplyAndRound(this._numberOfNewCasesInt, coronaSimSettings.percentCasesResultingInHospitalizationInt);
		this._numberOfCasesResultingInDeathInt = multiplyAndRound(this._numberOfNewCasesInt, coronaSimSettings.percentCasesResultingInDeathInt);
		this._numberOfCasesResultingInSurvivalInt = multiplyAndRound(this._numberOfNewCasesInt, coronaSimSettings.percentCasesResultingInSurvivalInt);
		debug("DayStats created. dayNumberInt: " + dayNumberInt + ", dayBeforeCaseCount: " 
			+ dayBeforeCaseCount + ", coronaSimSettings: ", this);
	}

	get dayNumberDate() {
		return this._dayNumberDate;
	}

	get dayNumberInt() {
		return this._dayNumberInt;
	}

	get finalHospitalDayNumberInt() {
		return this._finalHospitalDayNumberInt;
	}

	get numberOfCasesInt() {
		return this._numberOfCasesInt;
	}

	get numberOfNewCasesInt() {
		return this._numberOfNewCasesInt;
	}

	get numberOfCasesInHospitalInt() {
		return this._numberOfCasesInHospitalInt;			
	}

	get numberOfCasesResultingInDeathInt() {
		return this._numberOfCasesResultingInDeathInt;
	}

	get numberOfCasesResultingInSurvivalInt() {
		return this._numberOfCasesResultingInSurvivalInt;
	}
}

class TotalStats {

	/*
		fields: 

		totalStats.totalCasesInt
		totalStats.totalHospitalizationsInt
		totalStats.totalDeathsInt
		totalStats.totalSurvivalsInt
	*/

	constructor(initialTotalCaseCount) {
		this._totalCasesInt = initialTotalCaseCount;
		this._totalHospitalizationsInt = 0;
		this._totalDeathsInt = 0;
		this._totalSurvivalsInt = 0;
	}

	addDayStats(dayStats) {
		debug("Total stats adding daystats:", dayStats);
		debug("Total stats state before adding daystats:", this);
		this._totalCasesInt += dayStats.numberOfNewCasesInt;
		this._totalHospitalizationsInt += dayStats.numberOfCasesInHospitalInt;
		this._totalDeathsInt += dayStats.numberOfCasesResultingInDeathInt;
		this._totalSurvivalsInt += dayStats.numberOfCasesResultingInSurvivalInt;
		debug("Total stats state after adding daystats:", this);
	}

	get totalCasesInt() {
		return this._totalCasesInt;
	}

	get totalHospitalizationsInt() {
		return this._totalHospitalizationsInt;
	}

	get totalDeathsInt() {
		return this._totalDeathsInt;
	}

	get totalSurvivalsInt() {
		return this._totalSurvivalsInt;
	}
}