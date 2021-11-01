import { csvParse } from "d3-dsv";
import { get } from 'svelte/store';

export default function LocalDataService() {

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
    let geoCodes = get(geographicCodesStore)
    return await csvParse(string, (d, index) => {
        return {
          code: geoCodes[index],
          value: +d[indicatorCode],
          count: +d["0"],
          perc: (+d[indicatorCode] / +d["0"]) * 100,
        };
      });
  }