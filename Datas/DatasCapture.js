export class OperationData {
    constructor() {
        this._DataId = null;
        this._PileId = null;
        this._TimeStamp = null;
        this._OperationElapsedTime = null;
        this._CumulativeBlowCount = 0;
        this._BlowDepth = 0.0;
        this._Gear = null;
        this._ImpactEnergy = 0.0;
        this._StraightnessSurveyData = [];
        this._ElevationSurveyData = 0.0;
        this._CaptureState = null;
        this._WarningInfo = null;
        this._IsStraightnessSurveyAlert = false;
        this._IsAnchoringSurveyAlert = false;
    }

    get DataId() {
        return this._DataId;
    }

    set DataId(value) {
        this._DataId = value;
    }

    get PileId() {
        return this._PileId;
    }

    set PileId(value) {
        this._PileId = value;
    }

    get TimeStamp() {
        return this._TimeStamp;
    }

    set TimeStamp(value) {
        this._TimeStamp = value;
    }

    get OperationElapsedTime() {
        return this._OperationElapsedTime;
    }

    set OperationElapsedTime(value) {
        this._OperationElapsedTime = value;
    }

    get CumulativeBlowCount() {
        return this._CumulativeBlowCount;
    }

    set CumulativeBlowCount(value) {
        this._CumulativeBlowCount = value;
    }

    get BlowDepth() {
        return this._BlowDepth;
    }

    set BlowDepth(value) {
        this._BlowDepth = value;
    }

    get Gear() {
        return this._Gear;
    }

    set Gear(value) {
        this._Gear = value;
    }

    get ImpactEnergy() {
        return this._ImpactEnergy;
    }

    set ImpactEnergy(value) {
        this._ImpactEnergy = value;
    }

    get StraightnessSurveyData() {
        return this._StraightnessSurveyData;
    }

    set StraightnessSurveyData(value) {
        this._StraightnessSurveyData = value;
    }

    get ElevationSurveyData() {
        return this._ElevationSurveyData;
    }

    set ElevationSurveyData(value) {
        this._ElevationSurveyData = value;
    }

    get CaptureState() {
        return this._CaptureState;
    }

    set CaptureState(value) {
        this._CaptureState = value;
    }

    get WarningInfo() {
        return this._WarningInfo;
    }

    set WarningInfo(value) {
        this._WarningInfo = value;
    }

    get IsStraightnessSurveyAlert() {
        return this._IsStraightnessSurveyAlert;
    }

    set IsStraightnessSurveyAlert(value) {
        this._IsStraightnessSurveyAlert = value;
    }

    get IsAnchoringSurveyAlert() {
        return this._IsAnchoringSurveyAlert;
    }

    set IsAnchoringSurveyAlert(value) {
        this._IsAnchoringSurveyAlert = value;
    }

    static fromObject(object) {
        let opData = new OperationData();
    
        if (object) {
            for (let property in object) {
                if (object.hasOwnProperty(property) && opData.hasOwnProperty(property)) {
                    opData[property] = object[property];
                }
            }
        }
    
        return opData;
    }
    
}

export class OperationEstimations {
    constructor() {
        this.estimatedLeftBlowsToDesign = 0;
        this.estimatedLeftElevationToDesign = 0;
        this.estimatedOperationPausedDepth = 0;
        this.estimatedHammerPistonPerformance = 0;
    }

    setEstimatedLeftBlowsToDesign(value) {
        this.estimatedLeftBlowsToDesign = value;
    }

    setEstimatedLeftElevationToDesign(value) {
        this.estimatedLeftElevationToDesign = value;
    }

    setEstimatedOperationPausedDepth(value) {
        this.estimatedOperationPausedDepth = value;
    }

    setEstimatedHammerPistonPerformance(value) {
        this.estimatedHammerPistonPerformance = value;
    }

    getEstimatedLeftBlowsToDesign() {
        return this.estimatedLeftBlowsToDesign;
    }

    getEstimatedLeftElevationToDesign() {
        return this.estimatedLeftElevationToDesign;
    }

    getEstimatedOperationPausedDepth() {
        return this.estimatedOperationPausedDepth;
    }

    getEstimatedHammerPistonPerformance() {
        return this.estimatedHammerPistonPerformance;
    }

    static fromObject(object) {
        let opData = new OperationEstimations();
    
        if (object) {
            for (let property in object) {
                if (object.hasOwnProperty(property) && opData.hasOwnProperty(property)) {
                    opData[property] = object[property];
                }
            }
        }
    
        return opData;
    }
}