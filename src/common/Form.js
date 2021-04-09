export class Errors {
    /**
     * Create a new Errors instance.
     */
    constructor() {
        this.errors = {};
    }


    /**
     * Determine if an errors exists for the given field.
     *
     * @param {string} field
     */
    has(field) {
        return this.errors.hasOwnProperty(field);
    }


    /**
     * Determine if we have any errors.
     */
    any() {
        return Object.keys(this.errors).length > 0;
    }


    /**
     * Retrieve the error message for a field.
     *
     * @param {string} field
     */
    get(field) {
        if (this.errors[field]) {
            return this.errors[field][0];
        }
    }


    /**
     * Record the new errors.
     *
     * @param {object} errors
     */
    record(errors) {
        this.errors = errors;
    }


    /**
     * Clear one or all error fields.
     *
     * @param {string|null} field
     */
    clear(field) {
        if (field) {
            delete this.errors[field];

            return;
        }

        this.errors = {};
    }
}


export default class Form {
    /**
     * Create a new Form instance.
     *
     * @param {object} data
     */
    constructor(data) {
        this.originalData = data;

        for (let field in data) {
            this[field] = data[field];
        }

        this.errors = new Errors();
    }


    /**
     * Fetch all relevant data for the form.
     */
    data() {
        let data = {};

        for (let property in this.originalData) {
            data[property] = this[property];
        }

        return data;
    }


    /**
     * Reset the form fields.
     */
    reset() {
        for (let field in this.originalData) {
            this[field] = '';
        }

        this.errors.clear();
    }


    /**
     * Send a POST request to the given URL.
     * .
     * @param {string} url
     * @param {object} config
     */
    post(url, config) {
        return this.submit('post', url, config);
    }


    /**
     * Send a PUT request to the given URL.
     * .
     * @param {string} url
     * @param {object} config
     */
    put(url) {
        return this.submit('put', url, config);
    }


    /**
     * Send a PATCH request to the given URL.
     * .
     * @param {string} url
     * @param {object} config
     */
    patch(url) {
        return this.submit('patch', url, config);
    }


    /**
     * Send a DELETE request to the given URL.
     * .
     * @param {string} url
     * @param {object} config
     */
    delete(url) {
        return this.submit('delete', url, config);
    }


    /**
     * Submit the form.
     *
     * @param {string} requestType
     * @param {string} url
     * @param {object} config
     */
    submit(requestType, url, config) {
        return new Promise((resolve, reject) => {
            axios[requestType](url, this.data(), config)
                .then(response => {
                    this.onSuccess(response.data);

                    resolve(response.data);
                })
                .catch(error => {
                    this.onFail(error.response.data);

                    reject(error.response.data);
                });
        });
    }


    /**
     * Handle a successful form submission.
     *
     * @param {object} data
     */
    onSuccess(data) {
        if(typeof(this.originalData.preserve_on_submit)!=undefined && this.originalData.preserve_on_submit==true)
        {
            return data;
        }
        this.reset();
        return data;
    }


    /**
     * Handle a failed form submission.
     *
     * @param {object} errors
     */
    onFail(errors) {
        this.errors.record(errors);
    }
}
