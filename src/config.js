// CONFIG
// const apiurl = "https://www.nomisweb.co.uk/api/v01/dataset/";
// const apikey = "0x3cfb19ead752b37bb90da0eb3a0fe78baa9fa055";
const geography = "TYPE298";
const mapstyle =
    "https://bothness.github.io/ons-basemaps/data/style-omt.json";
const tabledata =
    "https://bothness.github.io/census-atlas/data/indicators.json";
const ladtopo = {
    url: "https://bothness.github.io/census-atlas/data/lad_boundaries_2020.json",
    layer: "LA2020EW",
    code: "AREACD",
    name: "AREANM",
};
const lsoabldg = {
    url: "https://cdn.ons.gov.uk/maptiles/buildings/v1/{z}/{x}/{y}.pbf",
    layer: "buildings",
    code: "lsoa11cd",
};
const lsoabounds = {
    url: "https://cdn.ons.gov.uk/maptiles/administrative/lsoa/v2/boundaries/{z}/{x}/{y}.pbf",
    layer: "lsoa",
    code: "areacd",
};
const ladvector = {
    url: "https://cdn.ons.gov.uk/maptiles/administrative/authorities/v1/boundaries/{z}/{x}/{y}.pbf",
    layer: "authority",
    code: "areacd",
};
const lsoadata =
    "https://bothness.github.io/census-atlas/data/lsoa2011_lad2020.csv";

const colors = {
    base: ["#d5f690", "#5bc4b1", "#2e9daa", "#0079a2", "#005583", "#cccccc"],
    muted: ["#f5fce2", "#d7ede8", "#cbe2e5", "#c2d7e3", "#bdccd9", "#f0f0f0"],
};