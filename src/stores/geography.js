export var ladBoundaries = []
export var ladList = []
export var ladLookup = {}
export var lsoaLookup = {}

const LAD_AREA_CODE = "AREACD"
const LAD_AREA_NAME = "AREANM"

export async function initialiseGeography(geographyService) {
    ladBoundaries = await geographyService.getLadBoundaries()
    let lsoaData = await geographyService.getLsoaData();

    ladLookup = buildLadLookup(ladBoundaries, lsoaData)
    lsoaLookup = buildLsoaLookup(lsoaData);
    ladList = buildLadList(ladBoundaries, ladLookup)

    return { ladBoundaries, ladLookup, lsoaLookup, ladList }
}

export function reset() {
    ladBoundaries = []
    ladList = []
    ladLookup = {}
    lsoaLookup = {}
}

function buildLadList(ladBounds, ladLookup) {
    return ladBounds.features.map((f) => {
        let code = f.properties[LAD_AREA_CODE]
        return {
            code: ladLookup[code].code,
            name: ladLookup[code].name
        }
    })
}

function buildLadLookup(ladBounds, lsoaData) {
    let lookup = {};
    ladBounds.features.forEach((f) => {
        lookup[f.properties[LAD_AREA_CODE]] = {
            code: f.properties[LAD_AREA_CODE],
            name: f.properties[LAD_AREA_NAME]
        };
    });

    lsoaData.forEach((d) => {
        if (!lookup[d.parent].children) {
            lookup[d.parent].children = [d.code];
        } else {
            lookup[d.parent].children.push(d.code);
        }
    });
}


function buildLsoaLookup(lsoaData){
    lsoaLookup = {};
    lsoaData.forEach((d) => {
        lsoaLookup[d.code] = {
            name: d.name,
            parent: d.parent,
        };
    });
    return lsoaLookup;
}

