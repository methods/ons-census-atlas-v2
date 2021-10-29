function LocalDataService() {

  }
  
  LocalDataService.prototype.getGeographicCodes = async function(url) {
    let response = await fetch(url);
    let string = await response.text();
    return await csvParse(string, (d) => {
        return d["GEOGRAPHY_CODE"]
    })
  }
  
  LocalDataService.prototype.getNomisData = async function(url, geographicCodesStore, indicatorCode) {
    let response = await fetch(url);
    let string = await response.text();
    return await csvParse(string, (d, index) => {
        return {
          code: geographicCodesStore[index],
          value: +d[indicatorCode],
          count: +d["0"],
          perc: (+d[indicatorCode] / +d["0"]) * 100,
        };
      });
  }