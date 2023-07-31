class Axis {
    constructor() {
        this.axisCol = "";
        this.axisRow = "";
        this.xCoordinate = 0.0;
        this.yCoordinate = 0.0;
        this.systemName = "";
    }

    get AxisCol() {
        return this.axisCol;
    }

    set AxisCol(value) {
        this.axisCol = value;
    }

    get AxisRow() {
        return this.axisRow;
    }

    set AxisRow(value) {
        this.axisRow = value;
    }

    get XCoordinate() {
        return this.xCoordinate;
    }

    set XCoordinate(value) {
        this.xCoordinate = value;
    }

    get YCoordinate() {
        return this.yCoordinate;
    }

    set YCoordinate(value) {
        this.yCoordinate = value;
    }

    get SystemName() {
        return this.systemName;
    }

    set SystemName(value) {
        this.systemName = value;
    }
}

class SettingsData {
    constructor() {
        this.grade = "";
        this.diameter = 0.0;
        this.wallThickness = 0.0;
        this.length = 0.0;
        this.yieldStrength = 0.0;
        this.tensileStrength = 0.0;
        this.modulusOfElasticity = 0.0;
        this.corrosionResistance = 0.0;
        this.coatingLength = 0.0;
        this.manufacturingStandards = "";
    }

    get Grade() {
        return this.grade;
    }

    set Grade(value) {
        this.grade = value;
    }

    get Diameter() {
        return this.diameter;
    }

    set Diameter(value) {
        this.diameter = value;
    }

    get WallThickness() {
        return this.wallThickness;
    }

    set WallThickness(value) {
        this.wallThickness = value;
    }

    get Length() {
        return this.length;
    }

    set Length(value) {
        this.length = value;
    }

    get YieldStrength() {
        return this.yieldStrength;
    }

    set YieldStrength(value) {
        this.yieldStrength = value;
    }

    get TensileStrength() {
        return this.tensileStrength;
    }

    set TensileStrength(value) {
        this.tensileStrength = value;
    }

    get ModulusOfElasticity() {
        return this.modulusOfElasticity;
    }

    set ModulusOfElasticity(value) {
        this.modulusOfElasticity = value;
    }

    get CorrosionResistance() {
        return this.corrosionResistance;
    }

    set CorrosionResistance(value) {
        this.corrosionResistance = value;
    }

    get CoatingLength() {
        return this.coatingLength;
    }

    set CoatingLength(value) {
        this.coatingLength = value;
    }

    get ManufacturingStandards() {
        return this.manufacturingStandards;
    }

    set ManufacturingStandards(value) {
        this.manufacturingStandards = value;
    }
}

export default class PileIO {
    constructor() {
        this.factoryId = "";
        this.pileType = "";
        this.range = "";
        this.positions = [new Axis(), new Axis()];
        this.internalConfigurations = new SettingsData();
    }

    updateAxisRange(col, row) {
        for (let position of this.positions) {
            position.AxisCol = col;
            position.AxisRow = row;
        }
        this.range = col + row;
    }

    updatePosition(index, coordinates, system) {
        if (coordinates.length >= 2) {
            const position = this.positions[index];
            position.XCoordinate = coordinates[0];
            position.YCoordinate = coordinates[1];
            position.SystemName = system;
        } else {
            throw new Error("Invalid arguments for updatePosition");
        }
    }

    updatePileProperties(inputs) {
        for (let key in inputs) {
            let value = inputs[key];
            switch (key) {
                case "grade":
                    this.internalConfigurations.Grade = value;
                    break;
                case "diameter":
                    this.internalConfigurations.Diameter = value;
                    this.pileType = "pipe";
                    break;
                case "thickness":
                    this.internalConfigurations.Diameter = value;
                    this.pileType = "sheet";
                    break;
                case "wallthickness":
                    this.internalConfigurations.WallThickness = value;
                    break;
                case "width":
                    this.internalConfigurations.WallThickness = value;
                    break;
                case "length":
                    this.internalConfigurations.Length = value;
                    break;
                case "ystrength":
                    this.internalConfigurations.YieldStrength = value;
                    break;
                case "tstrength":
                    this.internalConfigurations.TensileStrength = value;
                    break;
                case "elasticity":
                    this.internalConfigurations.ModulusOfElasticity = value;
                    break;
                case "corrosionresistance":
                    this.internalConfigurations.CorrosionResistance = value;
                    break;
                case "coatinglen":
                    this.internalConfigurations.CoatingLength = value;
                    break;
                case "manufstandards":
                    this.internalConfigurations.ManufacturingStandards = value;
                    break;
                default:
                    // Handle any unrecognized keys if needed
                    break;
            }
        }
    }

    getPositions() {
        return [...this.positions];
    }

    getInternalConfigurations() {
        return this.internalConfigurations;
    }
}
