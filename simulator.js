class CoronaSimulator {
	/*
		fields:

		simulator.currentDayStats
		simulator.currentDayInt
		simulator.currentDayDate
		simulator.coronaSimSettings
		simulator.dayStatsArray
		simulator.totalStats

	*/
	constructor(coronaSimSettings) {
		this._coronaSimSettings = coronaSimSettings;	
		this._currentDayInt = 0;
		this._currentDayStats = null;
		this._dayStatsArray = []; //all day stats so far		
		this._initialDeathCount = multiplyAndRound(coronaSimSettings.initialCaseCountInt, coronaSimSettings.percentCasesResultingInDeathInt);
		this._totalStats = new TotalStats(coronaSimSettings.initialCaseCountInt, this._initialDeathCount);
		debug("CoronaSimulator created:", this);			
	}

	moveForwardOneDay() {
		this._currentDayStats = new DayStats(this._currentDayInt, this._totalStats.totalCasesInt, this._coronaSimSettings);
		this._dayStatsArray.push(this._currentDayStats);
		this._totalStats.addDayStats(this._currentDayStats);
		this._currentDayInt += 1;
		if (debugMode) {
			var message = "Sim moved one day forward. Current day: " + this._currentDayInt + " (" + this.currentDayDate + ")\n";
			var totalStats = this._totalStats;
			message += "\tTotal totalCasesInt: " + totalStats.totalCasesInt.toLocaleString() + "\n";
			message += "\tTotal totalHospitalizationsInt: " + totalStats.totalHospitalizationsInt.toLocaleString() + "\n";
			message += "\tTotal totalDeathsInt: " + totalStats.totalDeathsInt.toLocaleString() + "\n";
			var dayStats = this._currentDayStats;
			message += "\tLatest Day dayNumberInt: " + dayStats.dayNumberInt + "\n";
			message += "\tLatest Day finalHospitalDayNumberInt: " + dayStats.finalHospitalDayNumberInt + "\n";
			message += "\tLatest Day numberOfCasesInt: " + dayStats.numberOfCasesInt.toLocaleString() + "\n";
			message += "\tLatest Day numberOfNewCasesInt: " + dayStats.numberOfNewCasesInt.toLocaleString() + "\n";
			message += "\tLatest Day numberOfCasesInHospitalInt: " + dayStats.numberOfCasesInHospitalInt.toLocaleString() + "\n";
			message += "\tLatest Day numberOfCasesResultingInDeathInt: " + dayStats.numberOfCasesResultingInDeathInt.toLocaleString() + "\n";
			message += "\tTotal Number of hospital beds: " + this._coronaSimSettings.numberOfHospitalBedsInt.toLocaleString() + "\n";
			message += "\tCurrent hospital cases: " + this.hospitalizationCountIntForDay(this._currentDayInt).toLocaleString() + "\n";
			message += "\tCurrent beds free: " + this.hospitalBedsAvailableIntForDay(this._currentDayInt).toLocaleString() + "\n";
			debug(message, this);
		}
	}		

	get initialDeathCount() {
		return this._initialDeathCount;
	}	

	get currentDayStats() {
		return this._currentDayStats;
	}

	get currentDayInt() {
		return this._currentDayInt;	
	}

	get currentDayDate() {
		return incrementDate(this._coronaSimSettings.initialDate, (this._currentDayInt - 1));
	}

	get coronaSimSettings() {
		return this._coronaSimSettings;	
	}

	get dayStatsArray() {
		return this._dayStatsArray;	
	}

	get totalStats() {
		return this._totalStats;	
	}	

	hospitalizationCountIntForDay(dayNumberInt) {
		var hospitalizationCountInt = 0;
		for (var dayStats of this._dayStatsArray) {
			if (dayStats.dayNumberInt <= dayNumberInt && dayStats.finalHospitalDayNumberInt >= dayNumberInt) {
				hospitalizationCountInt += dayStats.numberOfCasesInHospitalInt;
			}
		}
		return hospitalizationCountInt;
	}

	hospitalBedsAvailableIntForDay(dayNumberInt) {
		return this._coronaSimSettings.numberOfHospitalBedsInt - this.hospitalizationCountIntForDay(dayNumberInt);
	}					
}