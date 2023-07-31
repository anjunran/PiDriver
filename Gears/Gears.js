export default class Gears {
  constructor() {
    this.Gear = "";
    this.PowerRate = 0.0;
    this.EnergykNm = 0.0;
  }

  // Set gear type
  setGearType(gearType) {
    this.Gear = gearType;
  }

  // Get gear type
  getGearType() {
    return this.Gear;
  }

  // Set power rate
  setPowerRate(rate) {
    if (rate < 0) {
      throw new Error("Power rate must be non-negative.");
    }
    this.PowerRate = rate;
  }

  // Get power rate
  getPowerRate() {
    return this.PowerRate;
  }

  // Set energy in kNm
  setEnergyKnm(energy) {
    if (energy < 0) {
      throw new Error("Energy must be non-negative.");
    }
    this.EnergykNm = energy;
  }

  // Get energy in kNm
  getEnergyKnm() {
    return this.EnergykNm;
  }

  // Reset gear settings
  reset() {
    this.Gear = "";
    this.PowerRate = 0.0;
    this.EnergykNm = 0.0;
  }

  // Update gear settings
  update(gearType, powerRate, energykNm) {
    this.setGearType(gearType);
    this.setPowerRate(powerRate);
    this.setEnergyKnm(energykNm);
  }
}
