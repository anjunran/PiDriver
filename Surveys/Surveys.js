export default class PileSurvey {
  constructor(surveys = null) {
    this.PileElevation = {
      T: 0,
      AnchoringDesign: 0,
      ElevationOffset: 0, //in mm
    };
    this.PileLength = 0;
    this.Verticality = {
      N: 0,
      E: 0,
      Limit: 0,
    };
    this.AnchoringErrorFlag = false;
    if (surveys) {
      this.processSurveys(surveys);
    }
  }

  updatePileSurveys(surveys) {
    this.processSurveys(surveys);
  }

  setTopElevation(TL) {
    this.PileElevation.T = TL;
  }

  setAnchoringLevel(UAL) {
    this.PileElevation.AnchoringDesign = UAL;
  }

  setVerticalityNorth(vN) {
    this.Verticality.N = vN;
  }

  setVerticalityEast(vE) {
    this.Verticality.E = vE;
  }

  setVerticalityLimit(lim) {
    this.Verticality.Limit = lim;
  }

  setPileLength(len) {
    this.PileLength = len;
  }

  processSurveys(surveys) {
    for (let key in surveys) {
      switch (key) {
        case "elevation":
          this.processElevationParameters(surveys[key]);
          break;
        case "verticality":
          this.processVerticalityParameters(surveys[key]);
          break;
        default:
          // Handle any unrecognized survey types if needed
          break;
      }
    }
    this.calculateElevationOffset();
  }

  processElevationParameters(parameters) {
    if (parameters.hasOwnProperty("top")) {
      this.PileElevation.T = parameters.top;
    }

    if (parameters.hasOwnProperty("anchor")) {
      this.PileElevation.AnchoringDesign = parameters.anchor;
    }
  }

  processVerticalityParameters(parameters) {
    if (parameters.hasOwnProperty("N")) {
      this.Verticality.N = parameters.N;
    }

    if (parameters.hasOwnProperty("E")) {
      this.Verticality.E = parameters.E;
    }

    if (parameters.hasOwnProperty("limit")) {
      this.Verticality.Limit = parameters.limit;
    }
  }

  calculateElevationOffset() {
    this.PileElevation.ElevationOffset =
      this.PileElevation.T -
      this.PileLength -
      this.PileElevation.AnchoringDesign;
    this.AnchoringErrorFlag =
      this.PileElevation.ElevationOffset < this.PileElevation.AnchoringDesign;
  }

  getElevationOffset() {
    return this.PileElevation.ElevationOffset;
  }
}
