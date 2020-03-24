class CovidDataManager {

	_unitedStatesDailyDataArray = null;

	constructor(dataLoadedHandler) {
		var self = this;
		var url = "https://covidtracking.com/api/us/daily";
		// url = "usstats.json";
		debug("Loading us data from: " + url);
		loadWebResource(url, function(results) {
			self.parseData(JSON.parse(results), "usData");
			dataLoadedHandler(self);
		});
	}

	parseData(results, dataDesc) {
		var recordArray = [];
		var idCounter = 0;

		var lastRecordCopy = null;

		for (var i = results.length - 1; i >= 0; i--) {

			// original record from api: {"date":20200323,"states":56,"positive":42164,"negative":237321,"posNeg":279485,"pending":14571,"hospitalized":3325,"death":471,"total":294056}
			var record = results[i];

			var d = "" + record.date;
			var year = parseInt(d.substr(0,4));
			var month = parseInt(d.substr(4,2));
			var day = parseInt(d.substr(6,2));			
			var date = new Date(year, month - 1, day, 0, 0, 0, 0);

			// debug("Parsed from api date '" + record.date + " y:" + year + ", m: " + month + ", d: " + day + ", date:" + date);
			
			var recordCopy = new Object();
			recordCopy.original = record;
			recordCopy.date = date;
			recordCopy.datePretty = printDayShort(date);
			recordCopy.id = dataDesc + "-" + idCounter;
			recordCopy.index = idCounter;
			recordCopy.apiDate = record.date;
			recordCopy.testResultsPositiveInt = record.positive;
			recordCopy.testResultsNegativeInt = record.negative;
			recordCopy.testResultsTotalInt = record.positive + record.negative;			
			recordCopy.hospitalizedInt = this.denull(record.hospitalized);
			recordCopy.deathsInt = this.denull(record.death);			

			//percentages on original api data
			recordCopy.testResultsPositivePercentFloat = getPercentageFloat(recordCopy.testResultsPositiveInt, recordCopy.testResultsTotalInt);
			recordCopy.testResultsNegativePercentFloat = getPercentageFloat(recordCopy.testResultsNegativeInt, recordCopy.testResultsTotalInt);
			recordCopy.hospitalizedOfTotalPercentFloat = getPercentageFloat(recordCopy.hospitalizedInt, recordCopy.testResultsTotalInt);
			recordCopy.hospitalizedOfPositivePercentFloat = getPercentageFloat(recordCopy.hospitalizedInt, recordCopy.testResultsPositiveInt);
			recordCopy.deathsOfTotalPercentFloat = getPercentageFloat(recordCopy.deathsInt, recordCopy.testResultsTotalInt);
			recordCopy.deathsOfPositivePercentFloat = getPercentageFloat(recordCopy.deathsInt, recordCopy.testResultsPositiveInt);

			//new stats compared to previous day
			var newStats = new Object();
			newStats.testResultsPositiveInt = lastRecordCopy == null ? recordCopy.testResultsPositiveInt
				: recordCopy.testResultsPositiveInt - lastRecordCopy.testResultsPositiveInt;

			newStats.testResultsNegativeInt = lastRecordCopy == null ? recordCopy.testResultsNegativeInt
				: recordCopy.testResultsNegativeInt - lastRecordCopy.testResultsNegativeInt;

			newStats.testResultsTotalInt = lastRecordCopy == null ? recordCopy.testResultsTotalInt
				: recordCopy.testResultsTotalInt - lastRecordCopy.testResultsTotalInt; 

			newStats.hospitalizedInt = lastRecordCopy == null ? recordCopy.hospitalizedInt
				: recordCopy.hospitalizedInt - lastRecordCopy.hospitalizedInt; 

			newStats.deathsInt = lastRecordCopy == null ? recordCopy.deathsInt
				: recordCopy.deathsInt - lastRecordCopy.deathsInt; 

			newStats.testResultsPositivePercentFloat = getPercentageFloat(newStats.testResultsPositiveInt, newStats.testResultsTotalInt);
			newStats.testResultsNegativePercentFloat = getPercentageFloat(newStats.testResultsNegativeInt, newStats.testResultsTotalInt);
			newStats.hospitalizedOfTotalPercentFloat = getPercentageFloat(newStats.hospitalizedInt, newStats.testResultsTotalInt);
			newStats.hospitalizedOfPositivePercentFloat = getPercentageFloat(newStats.hospitalizedInt, newStats.testResultsPositiveInt);
			newStats.deathsOfTotalPercentFloat = getPercentageFloat(newStats.deathsInt, newStats.testResultsTotalInt);
			newStats.deathsOfPositivePercentFloat = getPercentageFloat(newStats.deathsInt, newStats.testResultsPositiveInt);

			newStats.testResultsPositiveGrowthPercentFloat = getPercentageFloat(newStats.testResultsPositiveInt, recordCopy.testResultsPositiveInt);
			newStats.testResultsNegativeGrowthPercentFloat = getPercentageFloat(newStats.testResultsNegativeInt, recordCopy.testResultsNegativeInt);
			newStats.testResultsTotalGrowthPercentFloat = getPercentageFloat(newStats.testResultsTotalInt, recordCopy.testResultsTotalInt);
			newStats.hospitalizedGrowthPercentFloat = getPercentageFloat(newStats.hospitalizedInt, recordCopy.hospitalizedInt);
			newStats.deathGrowthPercentFloat = getPercentageFloat(newStats.deathsInt, recordCopy.deathsInt);

			recordCopy.newStats = newStats;
			recordArray.push(recordCopy);

			idCounter += 1;
			lastRecordCopy = recordCopy;
		}
		this.unitedStatesDailyDataArray = recordArray;
		// console.log("data converted from api.", this.unitedStatesDailyDataArray);
	}

	denull(x) {
		return x == null ? 0 : x;
	}

	getUnitedStatesDataForIndex(index) {
		for (var item of this.unitedStatesDailyDataArray) {
			if (item.index == index) {
				return item;
			}
		}
		return null;
	}

	getUnitedStatesDataForId(id) {
		for (var item of this.unitedStatesDailyDataArray) {
			if (item.id == id) {
				return item;
			}
		}
		return null;
	}

	get unitedStatesDailyDataArray() { return this._unitedStatesDailyDataArray; }
	set unitedStatesDailyDataArray(x) { this._unitedStatesDailyDataArray = x; }
}
