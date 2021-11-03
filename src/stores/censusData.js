import {writable} from "svelte/store";

export const censusDataLoading = writable(false)

export async function initialiseCensusData(censusDataService) {
    censusDataLoading.set(true)

    censusDataLoading.set(false)
}

export async function fetchIndicator(indicatorCode) {
    censusDataLoading.set(true)

    censusDataLoading.set(false)
}