
/* js class reference: https://www.w3schools.com/js/js_classes.asp */
class CoronaSimSettings {

	/*
		fields: 
		
		coronaSimSettings.initialDate
		coronaSimSettings.simulatonDaysInt
		coronaSimSettings.initialInfectionsInt
		coronaSimSettings.infectionDailyIncreasePercentFloat
		coronaSimSettings.testPercentFloat
		coronaSimSettings.positiveTestResultPercentFloat
		coronaSimSettings.positiveCaseDeathPercentFloat
		coronaSimSettings.positiveCaseHospitalizedPercentFloat
		coronaSimSettings.daysHospitalizedInt
		coronaSimSettings.hospitalBedsInt
		coronaSimSettings.populationInt
	*/

	get initialDate() { return this._initialDate; }
	get simulatonDaysInt() { return this._simulatonDaysInt; }
	get initialInfectionsInt() { return this._initialInfectionsInt; }
	get infectionDailyIncreasePercentFloat() { return this._infectionDailyIncreasePercentFloat; }
	get testPercentFloat() { return this._testPercentFloat; }
	get positiveTestResultPercentFloat() { return this._positiveTestResultPercentFloat; }
	get positiveCaseDeathPercentFloat() { return this._positiveCaseDeathPercentFloat; }
	get positiveCaseHospitalizedPercentFloat() { return this._positiveCaseHospitalizedPercentFloat; }
	get daysHospitalizedInt() { return this._daysHospitalizedInt; }
	get hospitalBedsInt() { return this._hospitalBedsInt; }
	get populationInt() { return this._populationInt; }

	set initialDate(x) { this._initialDate = x; }
	set simulatonDaysInt(x) { this._simulatonDaysInt = x; }
	set initialInfectionsInt(x) { this._initialInfectionsInt = x; }
	set infectionDailyIncreasePercentFloat(x) { this._infectionDailyIncreasePercentFloat = x; }
	set testPercentFloat(x) { this._testPercentFloat = x; }
	set positiveTestResultPercentFloat(x) { this._positiveTestResultPercentFloat = x; }
	set positiveCaseDeathPercentFloat(x) { this._positiveCaseDeathPercentFloat = x; }
	set positiveCaseHospitalizedPercentFloat(x) { this._positiveCaseHospitalizedPercentFloat = x; }
	set daysHospitalizedInt(x) { this._daysHospitalizedInt = x; }
	set hospitalBedsInt(x) { this._hospitalBedsInt = x; }
	set populationInt(x) { this._populationInt = x; }
}

class DayStats {

	/*
		fields: 

		dayStats.dayNumberInt
		dayStats.finalHospitalDayNumberInt
		dayStats.infectionsInt
		dayStats.testedInt
		dayStats.positiveTestsInt
		dayStats.hospitalizationsInt
		dayStats.deathsInt		
	*/

	constructor(dayNumberInt, totalInfectionCountSoFarInt, coronaSimSettings) {
		this._dayNumberInt = dayNumberInt;
		this._finalHospitalDayNumberInt = this._dayNumberInt + coronaSimSettings.daysHospitalizedInt;
		this._infectionsInt = multiplyAndRound(totalInfectionCountSoFarInt, coronaSimSettings.infectionDailyIncreasePercentFloat);
		this._testedInt = multiplyAndRound(this._infectionsInt, coronaSimSettings.testPercentFloat);
		this._positiveTestsInt = multiplyAndRound(this._testedInt, coronaSimSettings.positiveTestResultPercentFloat);
		this._hospitalizationsInt = multiplyAndRound(this._positiveTestsInt, coronaSimSettings.positiveCaseHospitalizedPercentFloat);
		this._deathsInt = multiplyAndRound(this._positiveTestsInt, coronaSimSettings.positiveCaseDeathPercentFloat);
		debug("DayStats created.", { this:this, dayNumberInt:dayNumberInt, totalInfectionCountSoFarInt:totalInfectionCountSoFarInt,
			coronaSimSettings:coronaSimSettings });
	}

	get dayNumberInt() { return this._dayNumberInt; }
	get finalHospitalDayNumberInt() { return this._finalHospitalDayNumberInt; }
	get infectionsInt() { return this._infectionsInt; }
	get testedInt() { return this._testedInt; }
	get positiveTestsInt() { return this._positiveTestsInt; }
	get hospitalizationsInt() { return this._hospitalizationsInt; }
	get deathsInt() { return this._deathsInt; }
}

class TotalStats {

	/*
		fields: 

		totalStats.totalDays
		totalStats.totalInfectionsInt
		totalStats.totalTestedInt
		totalStats.totalPositiveTestsInt
		totalStats.totalHospitalizationsInt
		totalStats.totalDeathsInt
	*/	

	constructor() {
		this._totalDays = 0;
		this._totalInfectionsInt = 0;
		this._totalTestedInt = 0;
		this._totalPositiveTestsInt = 0;
		this._totalHospitalizationsInt = 0;
		this._totalDeathsInt = 0;
	}

	addDayStats(dayStats) {
		debug("Total stats adding daystats.", { this:this, dayStats:dayStats });
		this._totalDays += 1;
		this._totalInfectionsInt += dayStats.infectionsInt;
		this._totalTestedInt += dayStats.testedInt;
		this._totalPositiveTestsInt += dayStats.positiveTestsInt;
		this._totalHospitalizationsInt += dayStats.hospitalizationsInt;
		this._totalDeathsInt += dayStats.deathsInt;
		debug("Total stats state after adding.", { this:this, dayStats:dayStats });
	}

	copy() {
		var that = new TotalStats();
		that._totalDays = this._totalDays;
		that._totalInfectionsInt = this._totalInfectionsInt;
		that._totalTestedInt = this._totalTestedInt;
		that._totalPositiveTestsInt = this._totalPositiveTestsInt;
		that._totalHospitalizationsInt = this._totalHospitalizationsInt;
		that._totalDeathsInt = this._totalDeathsInt;
		return that;
	}

	get totalDays() { return this._totalDays; }
	get totalInfectionsInt() { return this._totalInfectionsInt; }
	get totalTestedInt() { return this._totalTestedInt; }
	get totalPositiveTestsInt() { return this._totalPositiveTestsInt; }
	get totalHospitalizationsInt() { return this._totalHospitalizationsInt; }
	get totalDeathsInt() { return this._totalDeathsInt; }
}