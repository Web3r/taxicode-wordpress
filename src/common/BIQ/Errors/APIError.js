
export default class APIError extends Error {
        
    /**
     * Create a new BIQ API Error
     * @param {String} URL BIQ API URL
     * @param {String} k BIQ API public affiliate key
     * @param {String} m Displayable Error message
     * @param {Error} e Error to encapsulate
     * @returns {APIError}
     */
    constructor(URL, k, e, m) {
        super(m);
        Error.captureStackTrace(this, APIError);
        // because of safai we can't have nice things & have to bind these anyway
        // override get handler to allow for additional properties to be injected
        this.getURL = this.getURL.bind(this);
        this.getKey = this.getKey.bind(this);
        this.getCulprit = this.getCulprit.bind(this);
        this.getDesc = this.getDesc.bind(this);
        this.setDesc = this.setDesc.bind(this);
        this.toString = this.toString.bind(this);
        this.toJSON = this.toJSON.bind(this);
        // override / set the error specific name
        this.name = 'BIQAPIERR';
        this.data = { };
        // set the API specifics
        this.URL = URL;
        this.k = k;
        // set the cause / culprit of the Error
        this.e = e;
        this.setDesc(`${this.name} - ${this.message}`);
    }

    /**
     * Check if the error has additional data
     * @returns {Boolean}
     */
    hasData() {
        return (Object.keys(this.data).length > 0);
    }
    
    /**
     * Get the additional data
     * @returns {Object}
     */
    getData() {
        return this.data;
    }
    
    /**
     * Add additional data
     * @param {Object} ad The additional data
     */
    addData(ad) {
        const d = {
            ...this.data,
            ...ad
        }
        this.data = d;
    }

    /**
     * Get the BIQ API URL used
     * @returns {String}
     */
     getURL() {
        return this.URL;
    }
    
    /**
     * Get the BIQ API public affiliate key used
     * @returns {String}
     */
     getKey() {
        return this.k;
    }
    
    /**
     * Get the encapsulated Error
     * @returns {Error}
     */
     getCulprit() {
        return this.e;
    }

    /**
     * Get the Error description
     * @returns {String}
     */
     getDesc() {
        return this.desc;
    }

    /**
     * Set the Error description
     * @param {String} desc Error description
     */
     setDesc(desc) {
        this.desc = desc;
    }

    /**
     * Get the Error description string
     * @returns {String}
     */
     toString() {
        return this.getDesc();
    }
    
    /**
     * Get the Error as JSON
     * @returns {Object}
     */
     toJSON() {
        return {
            name : this.name,
            message : this.message,
            desc : this.getDesc(),
            error : this.getCulprit(),
            stack : this.stack,
            URL : this.getURL(),
            key : this.getKey(),
            data : this.getData()
        };
    }

}
