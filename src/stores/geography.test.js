import MockGeographyService from "../services/mockGeographyService";
import {initialiseGeography} from "./geography";


it('it calls functions from the geography service', async () => {
    // given
    // a mock for the geography service
    const mockGeographyService = new MockGeographyService({features:[]}, [])

    // when
    // we call initialise geography
    await initialiseGeography(mockGeographyService)

    // then
    // it calls functions on the geography service
    expect(mockGeographyService.getLadBoundariesCalled).toBe(1)
    expect(mockGeographyService.getLsoaDataCalled).toBe(1)
})