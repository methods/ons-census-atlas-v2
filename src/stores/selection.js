export const activeLsoa = writable({
    selected: null,
    geometry: null,
    hovered: null,
})

export const activeLad = writable({
    selected: null,
    selectedPrev: null,
    hovered: null,
    highlighted: null,
})

export const selectedIndicator = writable({
    code: null,
    data: {},
    metadata: {}
});


function selectLsoa(lsoaCode) {

}

function hoverLsoa(lsoaCode) {

}

function selectLad(ladCode) {

}

function hoverLad(ladCode) {

}

function selectIndicator(indicatorCode) {

}