import Engine from "./Engines/EngineIO";
export default class PiDriverIO extends Engine {
  constructor() {
    super();
    this.canPlayState = true;
    this.onOperationStateChanged = undefined;
    this.onOperationInitialized = undefined;
    this.onOperationStopped = undefined;
    this.onOperationPaused = undefined;
    this.onOperationPlayed = undefined;
    this.onOperationResumed = undefined;
    this.eventEmitter = new EventTarget();
  }
  // Methods for Piling operations
  tap() {
    if (this.canPlayState) {
      this.incrementCounter();
      this.promptExtendPause();
    } else {
      let message =
        "Important: The counter is inactive when the operation is either on pause or has been stopped.";
      alert(message);
    }
  }
  lap() {
    if (this.canPlayState) {
      this.queueCounter();
    }
    this.tap();
  }

  reset() {
    const handleSuccessfulSave = ({ saved }) => {
      if (saved) {
        this.resetCounter();
        this.operationInitialize();
      }
    };

    const handleFailedSave = ({ saved, userCanceled, error }) => {
      if (!saved) {
        if (userCanceled) {
          alert("You've chosen not to save. Your changes may be lost.");
        } else if (error) {
          alert(
            `Something went wrong with the server and we couldn't save your data. Please try again. ${error.message}`
          );
        } else {
          // Action if failure still persist
          alert("Datas saved successfully!");
        }
      }
    };

    if (this.stateManager.isStopped()) {
      this.checkUnsavedBeforeClose().then(
        handleSuccessfulSave,
        handleFailedSave
      );
    } else {
      alert(
        "Important: You can't reset this operation during an active pile process. Please stop the data collection first!"
      );
    }
  }

  checkUnsavedBeforeClose() {
    const dataString = JSON.stringify(this.dataCapture);
    let confirmPromise = new Promise(async (resolve, reject) => {
      let message =
        "Important: Resetting will discard all your gathered data. Don't you want to save it first?";
      if (confirm(message)) {
        try {
          let saveInfo = await this.operationSave({
            options: { url: "", resource: "", data: dataString },
          });
          if (saveInfo) {
            resolve({ saved: true, userCanceled: false, error: null });
          } else {
            reject({
              saved: false,
              userCanceled: false,
              error:
                "Sorry, there seems to be an issue with our data servers. We're working on resolving this as quickly as possible.",
            });
          }
        } catch (error) {
          reject({
            saved: false,
            error: "Warning: App crash on save",
            userCanceled: false,
          });
        }
      } else {
        // Reject or resolve in case user chooses not to save
        resolve({ saved: false, userCanceled: true, error: null });
      }
    });
    return confirmPromise;
  }

  operationInitialize() {
    this.stateManager.shiftState(0);
    this.canPlayState = this.stateManager.isInitialized();
    if (typeof this.onOperationInitialized === "function") {
      this.onOperationInitialized();
    }
    if (typeof this.onOperationStateChanged === "function") {
      this.onOperationStateChanged(
        this.stateManager.getKeyByValue(
          this.stateManager.states,
          this.stateManager.currentStateEnum
        )
      );
    }
  }
  operationStop() {
    if (this.stateManager.canStop()) {
      this.stateManager.shiftState(4);
      this.canPlayState = !this.stateManager.isStopped();
      if (typeof this.onOperationStopped === "function") {
        this.onOperationStopped();
      }
      if (typeof this.onOperationStateChanged === "function") {
        this.onOperationStateChanged(
          this.stateManager.getKeyByValue(
            this.stateManager.states,
            this.stateManager.currentStateEnum
          )
        );
      }
    }
  }
  operationPause() {
    if (this.stateManager.canPause()) {
      this.stateManager.shiftState(2);
      this.canPlayState = !this.stateManager.isPaused();
      if (typeof this.onOperationPaused === "function") {
        this.onOperationPaused();
      }
      if (typeof this.onOperationStateChanged === "function") {
        this.onOperationStateChanged(
          this.stateManager.getKeyByValue(
            this.stateManager.states,
            this.stateManager.currentStateEnum
          )
        );
      }
    }
  }
  operationPlay() {
    if (this.stateManager.isInitialized()) {
      this.stateManager.shiftState(1);
      this.canPlayState = this.stateManager.isStarted();
      if (typeof this.onOperationPlayed === "function") {
        this.onOperationPlayed();
      }
      if (typeof this.onOperationStateChanged === "function") {
        this.onOperationStateChanged(
          this.stateManager.getKeyByValue(
            this.stateManager.states,
            this.stateManager.currentStateEnum
          )
        );
      }
    }
  }
  operationResume() {
    if (this.stateManager.canResume()) {
      this.stateManager.shiftState(3);
      this.canPlayState = this.stateManager.isResumed();
      if (typeof this.onOperationResumed === "function") {
        this.onOperationResumed();
      }
      if (typeof this.onOperationStateChanged === "function") {
        this.onOperationStateChanged(
          this.stateManager.getKeyByValue(
            this.stateManager.states,
            this.stateManager.currentStateEnum
          )
        );
      }
    }
  }
  async operationSave(payloads) {
    let success;
    if (payloads !== null && typeof payloads == "object") {
      try {
        if ("options" in payloads) {
          this.syncData(
            payloads["options"],
            "listener" in payloads ? payloads["listener"] : undefined
          );
          success = true;
        }
      } catch (error) {
        console.error(error);
        success = false;
      }
    } else {
      const message =
        "The server failed to save datas. Please check your internet connection and try again!";
      alert(message);
      success = false;
    }
    return success;
  }
  operationQuery(requests) {
    if (requests !== null && typeof requests == "object") {
      try {
        if ("options" in requests) {
          this.getServerData(
            requests["options"],
            "listener" in requests ? requests["listener"] : undefined
          );
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      const message =
        "The server failed to save datas. Please check your internet connection and try again!";
      alert(message);
    }
  }
}
