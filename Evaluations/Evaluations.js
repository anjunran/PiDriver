export default class Evaluations {
    constructor(blow, penetration) {
        if (blow < 0 || penetration < 0) {
            throw new Error("Blow and penetration values must be non-negative.");
        }

        this._blowValue = blow;
        this._penetrationValue = penetration;
        this.SystemAlerts = null;

        this.NormalPenetration = 2.3;
        this.PracticalRefusal = 1.25;
        this.SoilResistanceScale = {
            VeryLow: "VeryLow",
            Low: "Low",
            Medium: "Medium",
            High: "High",
            VeryHigh: "VeryHigh",
            PileAtRisk: "PileAtRisk",
            PracticalPileRefusal: "PracticalPileRefusal"
        };

        this.calculateSoilResistance();
    }

    calculateSoilResistance() {
        if (this._penetrationValue >= this.NormalPenetration) {
            this.SystemAlerts = this.calculateSRAboveNormalPenetration();
        } else {
            this.SystemAlerts = this.calculateSRBelowNormalPenetration();
        }
    }

    calculateSRAboveNormalPenetration() {
        if (this._blowValue <= 4) {
            return this.SoilResistanceScale.VeryLow;
        } else if (this._blowValue <= 10) {
            return this.SoilResistanceScale.Low;
        } else if (this._blowValue <= 30) {
            return this.SoilResistanceScale.Medium;
        } else if (this._blowValue <= 63) {
            return this.SoilResistanceScale.High;
        } else {
            return this.SoilResistanceScale.VeryHigh;
        }
    }

    calculateSRBelowNormalPenetration() {
        if (this._penetrationValue > this.PracticalRefusal) {
            return this.SoilResistanceScale.PileAtRisk;
        } else {
            return this.SoilResistanceScale.PracticalPileRefusal;
        }
    }

    getBlowValue() {
        return this._blowValue;
    }

    // Set blow value and re-calculate soil resistance
    setBlowValue(blow) {
        if (blow < 0) {
            throw new Error("Blow value must be non-negative.");
        }
        this._blowValue = blow;
        this.calculateSoilResistance();
    }

    // Get penetration value
    getPenetrationValue() {
        return this._penetrationValue;
    }

    // Set penetration value and re-calculate soil resistance
    setPenetrationValue(penetration) {
        if (penetration < 0) {
            throw new Error("Penetration value must be non-negative.");
        }
        this._penetrationValue = penetration;
        this.calculateSoilResistance();
    }

    // Get system alerts
    getSystemAlerts() {
        return this.SystemAlerts;
    }

    // Method to reset evaluation
    resetEvaluations(blow, penetration) {
        if (blow < 0 || penetration < 0) {
            throw new Error("Blow and penetration values must be non-negative.");
        }

        this._blowValue = blow;
        this._penetrationValue = penetration;
        this.SystemAlerts = null;
        this.calculateSoilResistance();
    }

    // Method to update evaluation
    updateEvaluations(blow, penetration) {
        this.setBlowValue(blow);
        this.setPenetrationValue(penetration);
    }
}
