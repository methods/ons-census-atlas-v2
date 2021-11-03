
export default function MockGeographyService(ladBoundaryData, lsoaData) {
    this.ladBoundaryData = ladBoundaryData
    this.lsoaData = lsoaData
    this.getLadBoundariesCalled = 0
    this.getLsoaDataCalled = 0
}
MockGeographyService.prototype.getLadBoundaries = async function() {
    this.getLadBoundariesCalled  += 1
    return this.ladBoundaryData
}
MockGeographyService.prototype.getLsoaData = async function() {
    this.getLsoaDataCalled += 1
    return this.lsoaData
}


