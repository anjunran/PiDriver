// This class represents an API service that interacts with a specified base URL
class ApiService extends EventTarget {
  constructor(baseUrl) {
    this.baseUrl = baseUrl; // The base URL for API requests
    this.success = false; // A flag to indicate the success of the last API request
  }
   // Fetches JSON data from the specified URL with the given options
  async fetchJson(url, options) {
    try {
      const response = await fetch(url, { mode: "cors", ...options });
       if (!response.ok) {
        this.success = false; // Set success flag to false if response is not OK
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        this.success = true; // Set success flag to true if response is OK
      }
       // Emit 'statusChanged' event with success and error information
      const successOK = this.success;
      this.dispatchEvent(
        new CustomEvent("statusChanged", {
          success: successOK,
          error: null,
        })
      );
       return response.json(); // Return the JSON data from the response
    } catch (error) {
      this.success = false; // Set success flag to false in case of an error
      // Emit 'statusChanged' event with success and error information
      const successFail = this.success;
      this.dispatchEvent(
        new CustomEvent("statusChanged", {
          success: successFail,
          error: error,
        })
      );
      console.error(error); // Log the error to the console
    }
  }
   // Reads data from the specified resource
  async read(resource) {
    return this.fetchJson(`${this.baseUrl}/${resource}`, { method: "GET" });
  }
   // Creates data in the specified resource with the given data
  async create(resource, data) {
    return this.fetchJson(`${this.baseUrl}/${resource}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
   // Updates data in the specified resource with the given ID and data
  async update(resource, id, data) {
    return this.fetchJson(`${this.baseUrl}/${resource}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
   // Deletes data from the specified resource with the given ID
  async delete(resource, id) {
    return this.fetchJson(`${this.baseUrl}/${resource}/${id}`, {
      method: "DELETE",
    });
  }
}

// Usage
// const apiService = new ApiService('http://example.com/api');
// apiService.eventEmitter.on('statusChanged', (status) => {
//   console.log('Request success status has changed: ', status);
// });