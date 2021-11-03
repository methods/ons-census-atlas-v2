import { feature } from "topojson-client";
import { csvParse, autoType } from "d3-dsv";
import { get } from 'svelte/store';
import { bbox } from "@turf/turf";

export async function getLsoaData(url) {
  let response = await fetch(url);
  let string = await response.text();
  let data = await csvParse(string, autoType);
  return data;
}

export async function getTopo(url, layer) {
  let response = await fetch(url);
  let topojson = await response.json();
  let geojson = await feature(topojson, layer);
  return geojson;
}

export function setSelectedIndicator(indicators, code, selectItem) {
	indicators.forEach(indicator => {
		if (indicator.code && indicator.code == code) {
			selectItem = indicator;
		} else if (indicator.children) {
			setSelectedIndicator(indicator.children, code);
		}
	});
}

export async function ladList(ladbounds, ladtopo, ladlist) {
    let ladList = {};
    let list = [];
    ladbounds.features.forEach((f) => {
        ladList[f.properties[ladtopo.code]] = {
            code: f.properties[ladtopo.code],
            name: f.properties[ladtopo.name]
        };
        list.push(ladList[f.properties[ladtopo.code]]);
    });

    list.sort((a, b) => a.name.localeCompare(b.name));
    ladlist = list;
    return ladList
}

export async function setsMapLocation(ladbounds){
				let location = ladbounds.features[Math.floor(Math.random() * ladbounds.features.length)];
				let bounds = bbox(location);
			let	mapLocation = {
					zoom: 11,
					lon: +((bounds[0] + bounds[2]) / 2).toFixed(5),
					lat: +((bounds[1] + bounds[3]) / 2).toFixed(5)
				};
				return mapLocation;
}

export async function assignsLsoasToLads(lsoasAndLads,ladlookup){
	let lookup = {};
	lsoasAndLads.forEach((d) => {
		lookup[d.code] = {
			name: d.name,
			parent: d.parent,
		};

		if (!ladlookup[d.parent].children) {
			ladlookup[d.parent].children = [d.code];
		} else {
			ladlookup[d.parent].children.push(d.code);
		}
	});
	return lookup;


}

export async function getIndicators(tableDataUrl){
	let response = await fetch(tableDataUrl);
	let indicators = await response.json();
	return indicators
}

export async function getTableData(indicators,selectCode,selectItem){
	setSelectedIndicator(indicators, selectCode,selectItem);
	if (!selectItem) {
		selectItem = indicators[0].children[0].children[0];
	}
	return selectItem
}

export async function getNomis(url, dataService, geographicCodesStore, selectedCategoryTotals, indicatorCode) {
	let geoCodesStore = get(geographicCodesStore)
	if (geoCodesStore.length == 0) {
		let geoCodes = await dataService.getGeographicCodes(url)
		geographicCodesStore.set(geoCodes)
	}
	return await dataService.getNomisData(url, geographicCodesStore, selectedCategoryTotals, indicatorCode)
  }


export function processData(data, lookup) {
  let lsoa = {
    index: {},
  };
  let lad = {
    data: [],
    index: {},
  };
  let ew = {
    data: {
      value: 0,
      count: 0,
    },
  };
  let lad_temp = {};

  data.forEach((d) => {
    lsoa.index[d.code] = d;

    let parent = lookup[d.code].parent;
    if (!lad.index[parent]) {
      lad.index[parent] = {
        code: parent,
        value: d.value,
        count: d.count,
      };
      lad_temp[parent] = [d];
    } else {
      lad.index[parent].value += d.value;
      lad.index[parent].count += d.count;
      lad_temp[parent].push(d);
    }
  });

  let keys = Object.keys(lad.index);
  keys.forEach((key) => {
    lad.index[key].perc = (lad.index[key].value / lad.index[key].count) * 100;
    lad.index[key].median = lad_temp[key][Math.floor(lad_temp[key].length / 2)];
    lad.data.push(lad.index[key]);

    ew.data.value += lad.index[key].value;
    ew.data.count += lad.index[key].count;
  });
  lad.data.sort((a, b) => a.perc - b.perc);

  ew.data.perc = (ew.data.value / ew.data.count) * 100;

  return {
    lsoa: lsoa,
    lad: lad,
    ew: ew,
  };
}

export function getBreaks(chunks) {
  let breaks = [];

  chunks.forEach((chunk) => {
    breaks.push(chunk[0]);
  });

  breaks.push(chunks[chunks.length - 1][chunks[chunks.length - 1].length - 1]);

  return breaks;
}

export function getThresholds(domain, exp, count = 32) {
  const offset = exp == 1 ? domain[0] : 0;
  const scale = domain[1] - offset;
  const breaks = [offset];
  const brek = 1 / count;
  for (let i = 1; i <= count; i++) {
    let node = Math.pow(i * brek, 1 / exp) * scale + offset;
    if (node > domain[0]) {
      breaks.push(node);
    }
  }
  return breaks;
}

export function testFunction() {
    return true
}