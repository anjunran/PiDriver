// Importing required modules
import Evaluation from "../Evaluations/Evaluations";
import Gear from "../Gears/Gears";
import Counter from "../IO/Counter";
import BlowsQueue from "../IO/BlowsQueue";
import Pile from "../Piles/Piles";
import StatesManager from "../States/StatesManager";
import Survey from "../Surveys/Surveys";
import Timer from "../Timers/Timers";
import APIServices from "../ApiServices/ApiServices";
import { Operation, Estimation } from "../Datas/DatasCapture";
 // Engine class
export default class Engine {
  // Constructor
  constructor() {
    // Initializing properties
    this.dataCapture = [];
    this.dataEstimations = [];
    this.serverResponseData = null;
    this._isDataSaved = false;
    this._isDataModified = false;
    this.dataIndex = 0;
    this.pauseTimeout;
    this.timeoutValue = 30000;
    this.allowCache = false;
    this.eventEmitter = new EventEmitter();
    this.soilEvaluation = new Evaluation();
    this.driverCounter = new Counter();
    this.queue = new BlowsQueue();
    this.configurations = new Pile();
    this.stateManager = new StatesManager();
    this.surveys = new Survey();
    this.timer = new Timer();
    this.gearSettings = new Gear();
    this.onSnapshot = null;
  }
  // Method to generate ID
  static generateId(...ids) {
    return ids.every((id) => typeof id === "string") ? ids.join("-") : "";
  }
  // Method to add data capture
  addCaptureData(data) {
    this.dataCapture.push(data);
    if (this.onSnapshot) this.onSnapshot(this.dataCapture);
  }
  // Method to clear data captures
  clearDataCaptures() {
    this.dataCapture = [];
    this.dataIndex = 0;
  }
  // Method to get latest data capture
  getLatestDataCapture() {
    return this.dataCapture[this.dataCapture.length - 1];
  }
  // Method to get data capture by index
  getDataCapture(index) {
    return this.dataCapture[index];
  }
  // Method to remove data capture by index
  removeDataCapture(index) {
    this.dataCapture.splice(index, 1);
  }
  // Method to get total data captures
  getTotalDataCaptures() {
    return this.dataCapture.length;
  }
  // Method to register snapshot listener
  registerSnapshotListener(listener) {
    this.onSnapshot = listener;
  }
  // Method to unregister snapshot listener
  unregisterSnapshotListener() {
    this.onSnapshot = null;
  }
  // Method to update gear settings
  updateGearSettings(newSettings) {
    this.gearSettings = { ...this.gearSettings, ...newSettings };
  }
  // Method to reset state manager
  resetStateManager() {
    this.stateManager = new StatesManager();
  }
  // Method to update configurations
  updateConfigurations(newConfigurations) {
    this.configurations = { ...this.configurations, ...newConfigurations };
  }
  // Method to check for alerts
  hasAlerts() {
    return this.soilEvaluation.SystemAlerts.length > 0;
  }
  // Method to add survey data
  addSurveyData(newSurvey) {
    this.surveys = { ...this.surveys, ...newSurvey };
  }
  // Method to get current gear
  currentGear() {
    return this.gearSettings.gear;
  }
  // Method to increment counter
  incrementCounter() {
    this.driverCounter.increment();
    this.cacheCounterData("counter", this.driverCounter.counterValue);
  }
  // Method to queue counter
  queueCounter() {
    this.driverCounter.queue();
    this.cacheQueueData("penetration", this.queue.Value);
    this.cacheQueueData("blowperdepth", this.queue.BlowLen);
  }
  // Method to cache queue data
  cacheQueueData(key, data) {
    try {
      if (data) {
        this.cacheData(key, data);
      }
    } catch (error) {
      console.error(`[Penetration datas] ${error.message}`);
    }
  }
  // Method to cache counter data
  cacheCounterData(key, data) {
    try {
      if (data) {
        this.cacheData(key, data);
      }
    } catch (error) {
      console.error(`[Counter datas] ${error.message}`);
    }
  }
  // Method to reset counter
  resetCounter() {
    this.driverCounter.reset();
  }
  // Method to enable cache settings
  enableCacheSettings() {
    this.allowCache = true;
  }
  // Method to disable cache settings
  disableCacheSettings() {
    this.allowCache = false;
  }
  // Method to check if cache is enabled
  isCacheEnabled() {
    return this.allowCache;
  }
  // Method to cache data
  cacheData(key, data) {
    if (!this.isCacheEnabled()) {
      throw new Error(
        "Application error: Cache settings are currently turned off."
      );
    }
    if (typeof window !== "undefined") {
      if (data !== null && typeof data === "object" && !Array.isArray(data)) {
        const parsedData = JSON.stringify(data);
        localStorage.setItem(key, parsedData);
      } else {
        localStorage.setItem(key, data);
      }
    }
  }
  // Method to get cached data
  getCachedData(key) {
    const data = localStorage.getItem(key);
    let cache;
    if (data) {
      try {
        cache = JSON.parse(data);
      } catch (e) {
        // If the data isn't JSON format, use it as is
        cache = data;
      }
    }
    return cache;
  }
  // Method to clear cached data
  clearCacheDatas() {
    localStorage.clear();
  }
  // Method to sync data
  syncData(options, callback) {
    if (canSaveData()) {
      // Ensure options is provided and it's an object
      if (!options || typeof options !== "object") {
        return this.throwServerError("Invalid options");
      }

      // Ensure resource is provided and it's a string
      if (!options.resource || typeof options.resource !== "string") {
        return this.throwServerError(
          "Options must contain a 'resource' property of type string"
        );
      }

      // Ensure data is provided and it's an object or a string
      if (
        !options.data ||
        (typeof options.data !== "object" && typeof options.data !== "string")
      ) {
        return this.throwServerError(
          "Options must contain a 'data' property of type object or string"
        );
      }

      // Ensure url is provided
      if (!("url" in options)) {
        return this.throwServerError(
          "Error: The specified API URL does not exist."
        );
      }

      const apiService = new APIServices(options.url);
      apiService.addEventListener("statusChanged", (event) => {
        if (typeof callback === "function") {
          callback(event);
          if (event.success) {
            dataIsSaved();
          } else {
            dataNotSaved();
          }
        }
      });

      const resource = options?.resource || "";
      const data = options?.data || {};
      this.serverResponseData = apiService.create(resource, data);
    }
  }
  getServerData(options, callback) {
    const apiService = this.createAPIService(options, callback);
    if (apiService) {
      const resource = options?.resource || "";
      this.serverResponseData = apiService.read(resource);
    }
  }
  createAPIService(options, callback) {
    if (this.canSaveData()) {
      if (!options || typeof options !== "object") {
        throw new Error("Invalid options");
      }
      if (!options.resource || typeof options.resource !== "string") {
        throw new Error(
          "Options must contain a 'resource' property of type string"
        );
      }
      if (
        !options.data ||
        (typeof options.data !== "object" && typeof options.data !== "string")
      ) {
        throw new Error(
          "Options must contain a 'data' property of type object or string"
        );
      }
      if (!("url" in options)) {
        throw new Error("Error: The specified API URL does not exist.");
      }
      const apiService = new APIServices(options.url);
      apiService.addEventListener("statusChanged", (event) => {
        if (typeof callback === "function") {
          callback(event);
          if (event.success) {
            this.dataIsSaved();
          } else {
            this.dataNotSaved();
          }
        }
      });
      return apiService;
    }
    return null;
  }
  get isDataSaved() {
    return this._isDataSaved;
  }
  set isDataSaved(val) {
    this._isDataSaved = val;
  }
  // Getter and setter for isDataModified
  get isDataModified() {
    return this._isDataModified;
  }
  set isDataModified(val) {
    this._isDataModified = val;
  }
  canSaveData() {
    if (!this.isDataSaved) {
      console.info(
        this.dataCapture.length == 0
          ? "There's no need to save yet, your data is still empty."
          : "No need to save again, your data is up-to-date."
      );
    }
    return !this.isDataSaved;
  }
  dataIsModified() {
    this.isDataModified = true;
    this.dataNotSaved();
  }
  // Method to mark data as saved
  dataIsSaved() {
    this.isDataSaved = true;
    this.dataNotModified();
  }
  // Method to mark data as not modified
  dataNotModified() {
    this.isDataModified = false;
  }
  // Method to mark data as not saved
  dataNotSaved() {
    this.isDataSaved = false;
  }
  // Method to update data capture
  updateDataCapture() {
    this.dataIsModified();
    // Destructure variables for easier access
    const {
      Configurations,
      DataCaptures,
      driverCounter,
      gearSettings,
      queue,
      stateManager,
      soilEvaluation,
      surveys,
      timer,
    } = this;
    // Time difference calculation
    const timeStamp = timer.DateTimeTimestamp;
    const firstDataCaptureTimeStamp = DataCaptures[0]
      ? new Date(DataCaptures[0].TimeStamp).getTime()
      : new Date().getTime();
    const operationElapsedTimeCalculation = DataCaptures[0]
      ? new Date(timeStamp).getTime() - firstDataCaptureTimeStamp
      : 0;
    // Put data in memory
    const dataId = this.generateId(
      Configurations.Range,
      Configurations.PileType,
      this.dataIndex
    );
    const pileId = surveys.Range;
    const operationElapsedTime = operationElapsedTimeCalculation;
    const cumulativeBlowCount = driverCounter.counterValue;
    const blowDepth = queue.Value;
    const gear = gearSettings.gear;
    const impactEnergy = gearSettings.EnergykNm;
    const straightnessSurveyData = surveys.Verticality;
    const elevationSurveyData = surveys.PileElevation;
    const captureState = stateManager.getKeyByValue(
      stateManager.states,
      stateManager.currentStateEnum
    );
    const warningInfo = soilEvaluation.SystemAlerts;
    const vLimitation = surveys.Verticality.Limit;
    const isStraightnessSurveyAlert =
      vLimitation < surveys.Verticality.N ||
      vLimitation < surveys.Verticality.E;
    const isAnchoringSurveyAlert = surveys.AnchoringErrorFlag;
    // Create Operation object with the captured data
    const data = Operation.fromObject({
      dataId,
      pileId,
      timeStamp,
      operationElapsedTime,
      cumulativeBlowCount,
      blowDepth,
      gear,
      impactEnergy,
      straightnessSurveyData,
      elevationSurveyData,
      captureState,
      warningInfo,
      isStraightnessSurveyAlert,
      isAnchoringSurveyAlert,
    });
    // Add the captured data to the capture data list
    this.addCaptureData(data);
    // Increment the dataIndex
    this.dataIndex++;
  }

  //Data Estimations update
  async ELeftBlowsToDesign() {
    if (this.stateManager.isPaused())
      return new Promise((resolve, reject) => {
        if (this.isDataModified) {
          const leftBlows =
            this.dataCapture.length > 0
              ? this.dataCapture[this.dataCapture.length - 1]
                  .elevationSurveyData.ElevationOffset /
                this.dataCapture[this.dataCapture.length - 1].blowDepth
              : 0;
          resolve(leftBlows);
        } else {
          reject(null);
        }
      });
    else return null;
  }
  async ELeftElevationToDesign() {
    if (this.stateManager.isPaused())
      return new Promise((resolve, reject) => {
        if (this.isDataModified) {
          resolve(
            this.dataCapture.length > 0
              ? this.dataCapture[this.dataCapture.length - 1]
                  .elevationSurveyData.ElevationOffset
              : 0
          );
        } else {
          reject(null);
        }
      });
    else return null;
  }
  async EOperationPausedDepth() {
    if (this.stateManager.isPaused())
      return new Promise((resolve, reject) => {
        if (this.isDataModified) {
          const dataLen = this.dataCapture.length;
          const currentQueue = this.queue._countUpdates.Current;
          const currentCounter = this.driverCounter.counterValue;
          const currentPenetration = this.dataCapture[dataLen - 1].blowDepth;
          resolve((currentCounter - currentQueue + 1) * currentPenetration);
        } else {
          reject(null);
        }
      });
    else return null;
  }
  async EHammerPistonPerformance() {
    if (this.stateManager.isPaused())
      return new Promise((resolve, reject) => {
        if (this.isDataModified) {
          const dataLen = this.dataCapture.length;
          const elapsedTime =
            new Date(this.dataCapture[dataLen - 1].timeStamp).getTime() -
            new Date(this.dataCapture[0]).getTime();
          const elapsedTimeToMinute = elapsedTime / 6e3;
          resolve(
            this.dataCapture[dataLen - 1].cumulativeBlowCount /
              elapsedTimeToMinute
          );
        } else {
          reject(null);
        }
      });
    else return null;
  }
  async updateEstimations() {
    // Function to handle successful calculation results
    const ifCalculationSuccess = ([
      estimatedLeftBlowsToDesign,
      estimatedLeftElevationToDesign,
      estimatedOperationPausedDepth,
      estimatedHammerPistonPerformance,
    ]) => {
      // Create an Estimation object using the calculation results
      const data = Estimation.fromObject({
        estimatedLeftBlowsToDesign,
        estimatedLeftElevationToDesign,
        estimatedOperationPausedDepth,
        estimatedHammerPistonPerformance,
      });
      // Push the Estimation object to the dataEstimations array
      this.dataEstimations.push(data);
    };
    // Function to handle calculation failure
    const ifCalculationFail = (error) => {
      console.error(error); // Or handle the error in any way you see fit
    };
    try {
      // Execute all the calculation functions concurrently using Promise.all
      const results = await Promise.all([
        this.ELeftBlowsToDesign(),
        this.ELeftElevationToDesign(),
        this.EOperationPausedDepth(),
        this.EHammerPistonPerformance(),
      ]);
      // Call the success function with the calculation results
      ifCalculationSuccess(results);
    } catch (error) {
      // Call the failure function with the error
      ifCalculationFail(error);
    }
  }

  // Method to prompt for extending pause
  promptExtendPause() {
    const inactiveDuration = this.timeoutValue;
    const message = `The counter has been inactive for ${
      inactiveDuration / 1e3
    } seconds. Do you need more time?`;
    this.pauseTimeout = setTimeout(() => {
      let userResponse = confirm(message);
      if (userResponse) {
        this.promptExtendPause();
      } else {
        let message =
          "Please press OK if you want to temporarily pause the current activity. If you wish to terminate and save data, enter 'stop' into this prompt.";
        let appAction = prompt(message, "Pause");
        switch (appAction.toUpperCase()) {
          case "STOP":
            this.operationStop();
            break;
          default:
            this.operationPause();
            break;
        }
      }
    }, inactiveDuration);
    this.cancelPauseTimeout();
  }
  // Method to cancel pause timeout
  cancelPauseTimeout() {
    clearTimeout(this.pauseTimeout);
  }
  // Method to set operation timeout value
  setOperationTimeOutValue(value) {
    if (typeof value !== "number" || value < 0) {
      throw new Error("Invalid timeout value");
    }
    this.timeoutValue = value;
  }
}
