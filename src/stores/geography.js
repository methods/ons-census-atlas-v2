import {writable} from "svelte/store";

export const ladBoundaries = writable([]);
export const ladList = writable([])
export const ladLookup = writable({})
export const lsoaLookup = writable({})
export const geographyLoading = writable(false)

const LAD_AREA_CODE = "AREACD"
const LAD_AREA_NAME = "AREANM"

export async function initialiseGeography(geographyService) {
    geographyLoading.set(true)

    ladBoundaries.set(await geographyService.fetchLadBoundaries())
    let lsoaData = await geographyService.fetchLsoaData();

    ladLookup.set(buildLadLookup(ladBoundaries, lsoaData))
    lsoaLookup.set(buildLsoaLookup(lsoaData));

    ladList.set(buildLadList(ladBoundaries, ladLookup))

    geographyLoading.set(false)
}

export function reset() {
    ladBoundaries.set([])
    ladList.set([])
    ladLookup.set({})
    lsoaLookup.set({})
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
    let lookup = {};
    lsoaData.forEach((d) => {
        lookup[d.code] = {
            name: d.name,
            parent: d.parent,
        };
    });
    return lsoaLookup;
}

