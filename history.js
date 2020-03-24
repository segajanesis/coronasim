var stateNames = [{"name":"Alaska","state":"AK"},{"name":"Alabama","state":"AL"},{"name":"Arkansas","state":"AR"}, {"name":"American Samoa","state":"AS"},{"name":"Arizona","state":"AZ"},{"name":"California","state":"CA"}, {"name":"Colorado","state":"CO"},{"name":"Connecticut","state":"CT"},{"name":"District Of Columbia","state":"DC"}, {"name":"Delaware","state":"DE"},{"name":"Florida","state":"FL"},{"name":"Georgia","state":"GA"},{"name":"Guam","state":"GU"}, {"name":"Hawaii","state":"HI"},{"name":"Iowa","state":"IA"},{"name":"Idaho","state":"ID"},{"name":"Illinois","state":"IL"}, {"name":"Indiana","state":"IN"},{"name":"Kansas","state":"KS"},{"name":"Kentucky","state":"KY"},{"name":"Louisiana","state":"LA"}, {"name":"Massachusetts","state":"MA"},{"name":"Maryland","state":"MD"},{"name":"Maine","state":"ME"},{"name":"Michigan","state":"MI"}, {"name":"Minnesota","state":"MN"},{"name":"Missouri","state":"MO"},{"name":"Northern Mariana Islands","state":"MP"}, {"name":"Mississippi","state":"MS"},{"name":"Montana","state":"MT"},{"name":"North Carolina","state":"NC"},{"name":"North Dakota","state":"ND"}, {"name":"Nebraska","state":"NE"},{"name":"New Hampshire","state":"NH"},{"name":"New Jersey","state":"NJ"},{"name":"New Mexico","state":"NM"}, {"name":"Nevada","state":"NV"},{"name":"New York","state":"NY"},{"name":"Ohio","state":"OH"},{"name":"Oklahoma","state":"OK"}, {"name":"Oregon","state":"OR"},{"name":"Pennsylvania","state":"PA"},{"name":"Puerto Rico","state":"PR"},{"name":"Rhode Island","state":"RI"}, {"name":"South Carolina","state":"SC"},{"name":"South Dakota","state":"SD"},{"name":"Tennessee","state":"TN"},{"name":"Texas","state":"TX"}, {"name":"Utah","state":"UT"},{"name":"Virginia","state":"VA"},{"name":"Virgin Islands","state":"VI"},{"name":"Vermont","state":"VT"}, {"name":"Washington","state":"WA"},{"name":"Wisconsin","state":"WI"},{"name":"West Virginia","state":"WV"},{"name":"Wyoming","state":"WY"}];

class CovidDataManager {

	constructor(dataLoadedHandler) {		
		var self = this;
		var url = "https://covidtracking.com/api/us/daily";
		debug("Loading U.S. data from: " + url);
		loadWebResource(url, function(results) {
			debug("Parsing U.S. data.");
			self.unitedStatesDailyDataArray = self.parseData(JSON.parse(results), "usData");
			debug("Finished parsing U.S. data.");
			dataLoadedHandler(self);
		});
		loadWebResource("https://covidtracking.com/api/states/daily", function(results) {
			debug("Parsing State data.");
			self.statesDailyDataMap = self.parseStateData(JSON.parse(results));
			debug("Finished parsing State data.");
		});
	}

	parseStateData(results) {
		var recordsByStateMap = [];
		for (var record of results) {
			var state = record.state;
			if (recordsByStateMap[state] == null) {
				recordsByStateMap[state] = [];
			}
			recordsByStateMap[state].push(record);
		}
		var result = [];
		for (var stateName of stateNames ) {
			var state = stateName.state;
			var records = recordsByStateMap[state];
			result[state] = this.parseData(records, state + "Data");
		}
		return result;
	}

	parseData(results, dataDesc) {
		var recordArray = [];
		var idCounter = 0;

		var lastRecordCopy = null;

		for (var i = results.length - 1; i >= 0; i--) {

			// original record from api: {"date":20200323,"states":56,"positive":42164,"negative":237321,"posNeg":279485,"pending":14571,"hospitalized":3325,"death":471,"total":294056}
			var record = results[i];

			//console.log("converting record for " + dataDesc, record);

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
			recordCopy.testResultsPositiveInt = this.denull(record.positive);
			recordCopy.testResultsNegativeInt = this.denull(record.negative);
			recordCopy.testResultsTotalInt = this.denull(record.positive) + this.denull(record.negative);
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
		return recordArray;		
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

	stateDailyDataArray(stateName) {
		for (var stateData of stateNames ) {
			console.log("" + stateName, stateData);
			if (stateData.name == stateName) {
				return this.statesDailyDataMap[stateData.state];
			}
		}
		return null;
	}

	get stateNames() {
		var result = [];
		for (var stateName of stateNames ) {
			result.push(stateName.name);
		}
		result.sort();
		return result;
	}

	get unitedStatesDailyDataArray() { return this._unitedStatesDailyDataArray; }
	set unitedStatesDailyDataArray(x) { this._unitedStatesDailyDataArray = x; }
	get statesDailyDataMap() { return this._statesDailyDataMap; }
	set statesDailyDataMap(x) { this._statesDailyDataMap = x; }
}
