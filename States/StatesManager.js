export default class StateManagers {
  constructor() {
    this.states = {
      Initialize: 0,
      Start: 1,
      Pause: 2,
      Resume: 3,
      Stop: 4,
    };
    this.stateObjects = {
      IsInitialize: false,
      IsStart: false,
      IsPause: false,
      IsResume: false,
      IsStop: false,
    };
    this.currentStateEnum = this.states.Initialize;
    this.stateChanged = null;
    this.shiftState(this.states.Initialize);
  }

  shiftState(newState) {
    this.currentStateEnum = newState;
    for (let key in this.states) {
      this.stateObjects[`Is${key}`] = newState === this.states[key];
    }
    if (typeof this.stateChanged === "function") {
      this.stateChanged(this.getKeyByValue(this.states, newState));
    }
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }

  isCurrentState(state) {
    return this.currentStateEnum === this.states[state];
  }

  isInitialized() {
    return this.isCurrentState("Initialize");
  }

  isStarted() {
    return this.isCurrentState("Start");
  }

  isPaused() {
    return this.isCurrentState("Pause");
  }

  isResumed() {
    return this.isCurrentState("Resume");
  }

  isStopped() {
    return this.isCurrentState("Stop");
  }

  canResume() {
    return this.isPaused();
  }

  canPause() {
    return this.isStarted() || this.isResumed();
  }

  canStop() {
    return this.isStarted() || this.isPaused() || this.isResumed();
  }
}
