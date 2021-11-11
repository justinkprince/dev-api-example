// Storing all available HTTP methods in an enum is a good practice.
const Methods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

class Api {
  // The constructor takes a config object with two optional properties.
  constructor({ baseUrl = null, defaultOptions = {} }) {
    // Base URL is prepended to all requests to save typing out the full URL each time.
    this.baseUrl = baseUrl;

    // Default options set a few sane defaults and then allow the user to override them.
    // All future requests will use these defaults unless further overridden.
    this.defaultOptions = Object.assign(
      {
        mode: "cors",
        cache: "no-cache",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
      defaultOptions
    );
  }

  // Reconcile the default options, the options passed in as call-time args,
  // and merge the HTTP method and body data as well.
  buildOptions(method, options, data = {}) {
    // Object.assign used like this allows us to create a new object
    // from the union of two other objects.
    const headers = Object.assign(
      {},
      this.defaultOptions?.headers,
      options?.headers
    );

    // Merging everything down.
    options = {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...headers,
      },
      method,
    };

    // Serialize and add the body data if it exists.
    if (Object.keys(data).length) {
      options.body = JSON.stringify(data);
    }

    return options;
  }

  // Base request used by all other helper methods.
  async request(resource, method = Methods.GET, data = {}, options = {}) {
    const url = this.baseUrl + resource;
    options = this.buildOptions(method, options, data);

    return await fetch(url, options).then((response) => response.json());
  }

  get(resource, options = {}) {
    return this.request(resource, Methods.GET, options);
  }

  post(resource, data = {}, options = {}) {
    return this.request(resource, Methods.POST, data, options);
  }

  put(resource, data = {}, options = {}) {
    return this.request(resource, Methods.PUT, data, options);
  }

  delete(resource, options = {}) {
    return this.request(resource, Methods.DELETE, options);
  }
}
