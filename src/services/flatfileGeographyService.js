import {autoType, csvParse} from "d3-dsv";
import {feature} from "topojson-client";

export default function FlatfileGeographyService() {

}

FlatfileGeographyService.prototype.getLadBoundaries = async function() {
    let response = await fetch(url);
    let topojson = await response.json();
    let geojson = await feature(topojson, layer);
    return geojson;
}

FlatfileGeographyService.prototype.getLsoaData = async function() {
    let response = await fetch(url);
    let string = await response.text();
    let data = await csvParse(string, autoType);
    return data;
}


