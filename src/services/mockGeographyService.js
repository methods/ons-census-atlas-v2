
export default function MockGeographyService(ladBoundaryData, lsoaData) {
    this.ladBoundaryData = ladBoundaryData
    this.lsoaData = lsoaData
    this.fetchLadBoundariesCalled = 0
    this.fetchLsoaDataCalled = 0
}
MockGeographyService.prototype.fetchLadBoundaries = async function() {
    this.fetchLadBoundariesCalled  += 1
    return this.ladBoundaryData
}
MockGeographyService.prototype.fetchLsoaData = async function() {
    this.fetchLsoaDataCalled += 1
    return this.lsoaData
}


