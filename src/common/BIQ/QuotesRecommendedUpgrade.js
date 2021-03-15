/**
 * The max passengers for a single standard car
 * @type Number
 */
const MAX_CAR_PASSENGERS = 4;

/**
 * The available quote vehicle class upgrade tier options
 * @type Array
 */
const CLASS_UPGRADE_TIERS = [
    'standard', 
    'executive', 
    'vip', 
    'chauffeur'
];

/**
 * The available quote vehicle type upgrade tier options
 * @type Array
 */
const TYPE_UPGRADE_TIERS = [
    'minicab', 
    'mpv', 
    'minibus', 
    'coach'
];

/**
 * Capitilize the first character of a string
 * @param string
 * @returns {string}
 */
const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

/**
 * Determine the upgrade criteria for a category type
 * @param {string} tierType the upgrade category tier type
 * @param {Object} journey the quoted journey details
 * @param {Object} selectedVehicle the selected vehicle to check upgrade posibilities of
 * @returns {Boolean} TRUE If the category type requirment criteria is met
 * @throws error if the category type has no upgrade criteria defined
 */
const upgradeCriteria = (tierType, journey, selectedVehicle) => {
    switch(tierType) {
        case 'class' :
            return journey.people <= MAX_CAR_PASSENGERS;
        case 'type' :
            return journey.people <= MAX_CAR_PASSENGERS && journey.people === selectedVehicle.passengers;
        default:
            throw `Unknown category upgrade type [${tierType}]!"`;
    }
};
    
/**
 * Get the upgrade props for the recommended quote upgrade
 * @param {Object} upgradeRecommendation the upgrade recommendation for the selected quote
 * @return {Object} 
 */
const upgradeOptionProps = upgradeRecommendation => {
    // get the recommended upgrade props
    let props = upgradeRecommendation.props;
    // add the additional upgrade option props specific to the category type tier upgrade recommended
    switch(upgradeRecommendation.categoryType) {
        case 'class' : 
            props = () => classUpgradeProps(upgradeRecommendation);
        break;
        case 'type' : 
            props = () => typeUpgradeProps(upgradeRecommendation);
        break;
    }
    return props;
};
    
/**
 * Get the upgrade props for the compnonet for a vehicle type upgrade recommendation
 * @param {Object} upgradeRecommendation the upgrade recommendation for the selected quote
 * @return {Object} 
 */
const typeUpgradeProps = upgradeRecommendation => {
    return ({
        ...upgradeRecommendation.props(),
        title : 'It looks a little tight!',
        description : 'We recommend you upgrade to a bigger vehicle, you might be a bit squashed.',
        gaEventData : {
            category : 'Quotes',
            action : `upgrade type to ${upgradeRecommendation.data.vehicle.type}`
        },
        bulletPoints : [
            'More space for passengers',
            'More storage space for your luggage',
            'Peace of mind, everything will fit!'
        ]
    });
};

/**
 * Get the upgrade props for the compnonet for a vehicle class upgrade recommendation
 * @param {Object} upgradeRecommendation the upgrade recommendation for the selected quote
 * @return {Object} 
 */
const classUpgradeProps = upgradeRecommendation => {
    let vehicleClass = upgradeRecommendation.data.vehicle.class;
    if(vehicleClass === 'vip') {
        vehicleClass = 'luxury';
    }
    return ({
        ...upgradeRecommendation.props(),
        title : `Upgrade To ${vehicleClass}`,
        description : `We recommend you upgrade, For just £${upgradeRecommendation.priceDifference.toFixed(2)} more you can ride in an ${vehicleClass} vehicle.`,
        gaEventData : {
            category : 'Quotes',
            action : `upgrade class to ${vehicleClass}`
        },
        bulletPoints : [
            'More comfortable and spacious ride.',
            `${capitalizeFirstLetter(vehicleClass)} class driver.`,
            'Recommended for business travels and airport transfers.'
        ]
    });
};

/**
 * Create a mapped object of available tier type category upgrades
 * @param {string} type the upgrade category tier type
 * @returns {Object} An object defining the tier type, the upgrade criteria needed & if it exists
 */
const mapAvailableCategoryUpgrades = type => {
    return ({
        type,
        exists : false,
        // use a callback to defer value until needed
        upgradeCriteria
    });
};

/**
 * Create no upgrade available object 
 * @param {string} categoryType the upgrade category tier type
 * @returns {Object} An object defining the structure for continued processing
 */
 const noUpgradeAvailable = categoryType => {
    return ({
        categoryType,
        exists : false,
        props :  () => ({})
    });
};

export default class QuotesRecommendedUpgrade {
         
    /**
     * Form the base for transaction payment handlers
     * @param {function} getQuotesCB A callback that will provide the list of quotes to get recommendations from
     * @param {function} getJourneyCB A callback that will provide the quoted journey details
	 * @param {Boolean} debugging flag to indicate if debugging is enabled
     * @returns {QuotesRecommendedUpgrade}
     */
    constructor(getQuotesCB, getJourneyCB, debugging) {
        // because of safai we can't have nice things & have to bind these anyway
        this._resetRecommendation = this._resetRecommendation.bind(this);
        this._setCategories = this._setCategories.bind(this);
        this._upgradeTierRecommendation = this._upgradeTierRecommendation.bind(this);
        this._recommendForSelected = this._recommendForSelected.bind(this);
        this._mapCategoryUpgradesForSelected = this._mapCategoryUpgradesForSelected.bind(this);
        this._mapQuoteUpgradesForSelected = this._mapQuoteUpgradesForSelected.bind(this);
        this._commonUpgradeProps = this._commonUpgradeProps.bind(this);
        this.getRecommendationFor = this.getRecommendationFor.bind(this);
        // map the callback to get the quotes & journey details when they're needed
        this.getQuotes = getQuotesCB;
        this.getJourney = getJourneyCB;
        // set the immutable properties
        this.debugging = debugging;
        // set the available quote vehicle upgrade tiers
        this.upgradeTiers = {
            class : CLASS_UPGRADE_TIERS,
            type : TYPE_UPGRADE_TIERS
        }
        // the quotes are keyed by quote ID
        this.quotes = {};
        // set the available category type tier upgrade categories
        this._setCategories();
        // reset / initialise the recommendation data
        this._resetRecommendation();
    }

    /**
     * Reset the quote upgrade recommendation
     */
    _resetRecommendation() {
        // if no upgrade recomendation is found, the following is used
        this.priceDifference = 9999;
        // reset the recommendation
        this.upgradeRecommendation = {
            categoryType : null,
            exists : false,
            tierUpgrade : null,
            data : {
                key : null,
                quoteId : null,
                vehicleIndex : null,
                vehicle : {
                    price : this.priceDifference
                },
                priceDifference : this.priceDifference
            }
        }
    }

    /**
     * Set the available category upgrade types for the upgrade tiers
     */
    _setCategories() {
        // map the vehicle upgrade categories with the available upgrade default data set
        this.availableCategoryUpgrades = Object.keys(this.upgradeTiers).map(mapAvailableCategoryUpgrades);
    }
    
    /**
     * Get a vehicle upgrade option for the quote
     * @param {Object} quote the quote to recommend an upgrade for
     * @param {Number} vehicle the the selected vehicle index for the selected quote
     * @returns {object}
     */
    getRecommendationFor(quote, vehicle) {
        // reset / initialise the recommendation data
        this._resetRecommendation();
        // check the quote exists & the vehicle
        this.selectedQuote = quote;
        this.selectedVehicle = quote.vehicles[vehicle];
        // set the selected quote & vehicle now the checks have passed
        this.selectedQuoteId = quote.quote_id;
        this.selectedVehicleIndex = vehicle;
        if(this.debugging) {
            console.group('-- Getting recommended upgrade for selected quote --');
            console.log('selectedQuoteId', this.selectedQuoteId);
            console.log('selectedVehicleIndex', this.selectedVehicleIndex);
            console.log('selectedQuote', this.selectedQuote);
            console.log('selectedVehicle', this.selectedVehicle);
            console.log('priceDifference', this.priceDifference);
            console.log('upgradeRecommendation', this.upgradeRecommendation);
            console.log('availableCategoryUpgrades', this.availableCategoryUpgrades);
        }
        // get the upgrade recommendation if there is one
        const upgradeOption = this._recommendForSelected();
        if(this.debugging) {
            console.log('upgradeOption', upgradeOption);
            console.groupEnd();
        }
        // return the upgrade option with the added upgrade specific props
        return {
            ...upgradeOption,
            // override the original common props method with the specifc props if the upgrade exists
            props : (upgradeOption.exists) 
                ? upgradeOptionProps(upgradeOption)
                : upgradeOption.props(),
            selectedQuoteId : this.selectedQuoteId,
            selectedQuote : this.selectedQuote,
            selectedVehicleIndex : this.selectedVehicleIndex,
            selectedVehicle : this.selectedVehicle
        };
    }
    
    /**
     * Determine the upgrade recommendations for the selected quote & vehicle
     * @returns {Object}
     */
    _recommendForSelected() {
        // get the list of quotes to get a recommended upgrade from inside the upgrade mapping
        this.quotes = this.getQuotes();
        const upgradeOptions = this.availableCategoryUpgrades
            .map(this._mapCategoryUpgradesForSelected)
            // we only want the upgrades that exist
            .filter((upgrade) => upgrade.exists);
        if(this.debugging) {
            console.log('upgradeOptions', upgradeOptions);
        }
        // clear out the quotes, don't need to keep them anymore
        this.quotes = {};
        if(upgradeOptions.length) {
        // set the recommended vehicle upgrade option for the selected quote
            this.priceDifference = upgradeOptions[0].data.priceDifference;
            this.upgradeRecommendation = upgradeOptions[0];
        }
        // return the recommendation for the selected quote & common props
        return {
            upgradeQuoteId : this.upgradeRecommendation.data.quoteId,
            upgradeVehicleIndex : this.upgradeRecommendation.data.vehicleIndex,
            priceDifference : this.priceDifference,
            ...this.upgradeRecommendation
        };
    }
    
    /**
     * Determine if a specific tier category is eligible for an upgrade
     * @param {Object} category The mapped category upgrade 
     * @param {boolean} extraConditions Any extra conditions the category might need to determine if upgrade is available
     * @return {Object}
     * @throws error on upgrade tier not being set for the category type
     * @throws error if the category type has no upgrade criteria defined
     */
    _upgradeTierRecommendation(category, extraConditions) {
        // check the tier category exists first
        if(!this.upgradeTiers.hasOwnProperty(category.type)) {
            throw new ErrorEvent('WARNING', {
                error : new Error('BIQ Recommended Quote Upgrade Tier Error'),
                message : `No tier found with category value of ${category.type}.`
            });
        }
        // get index of the upgrade tier type category option for the vehicle category type if it exists
        const tiersIndex = this.upgradeTiers[category.type].indexOf(this.selectedVehicle.type[category.type]);
        // get the category type upgrade condition for the quote
        const conditions = category.upgradeCriteria(category.type, this.getJourney(), this.selectedVehicle);
        // return the outcome
        return {
            currentTier : tiersIndex,
            nextTier : tiersIndex + 1,
            available : tiersIndex < (this.upgradeTiers[category.type].length - 1) && conditions && extraConditions
        };
    }
    
    /**
     * Map upgrade recommendation for an upgrade category
     * @param {Object} category the upgrade category to map data for
     * @returns {Object}
     */
    _mapCategoryUpgradesForSelected(category) {
        // check if the category has a tier upgrade available
        const upgradeTierRecommendation = this._upgradeTierRecommendation(category, true);
        if(!upgradeTierRecommendation.available) {
        // no upgrade recommendation available, just return the default
            return noUpgradeAvailable(category.type);
        }
        // get the next tier as the upgrade category type option
        const nextTierIndex = parseInt(upgradeTierRecommendation.nextTier, 10);
        const tierUpgrade = this.upgradeTiers[category.type][nextTierIndex];
        if(this.debugging) {
            console.log('upgradeTierRecommendation', upgradeTierRecommendation);
            console.log('tierUpgrade', tierUpgrade);
            console.group('-- quote upgrade map --');
        }
        // map the quotes for active & matching upgrade vehicles
        const quoteUpgrades = Object.keys(this.quotes)
            .map((quoteId) => {
                return this._mapQuoteUpgradesForSelected(quoteId, category.type, tierUpgrade);
            })
            // filter out the inactive quotes & the ones with no matching vehicles
            // quote has to be active & have upgrade vehicle option(s)
            .filter((upgrade) => (upgrade.active && upgrade.upgradeVehicles.length));
        if(this.debugging) {
            console.log('quoteUpgrades', quoteUpgrades);
            console.groupEnd();
        }
        if(!quoteUpgrades.length) {
        // no upgrade recommendation available, just return the default
            return noUpgradeAvailable(category.type);
        }
        // check for available quote vehicle upgrades for the category
        const cheapestUpgradeQuote = quoteUpgrades.reduce((upgrade, upgradeOption) => {
            // reduce the quotes eligable vehicles to the cheapest upgrade vehicle option
            // return the cheapest upgrade option
            return (upgrade.priceDifference < upgradeOption.priceDifference) ? upgrade : upgradeOption;
        }, { quoteId : this.selectedQuoteId, priceDifference : this.priceDifference });
        if(this.debugging) {
            console.log('cheapestUpgradeQuote', cheapestUpgradeQuote);
            console.log('cheapestUpgradeQuote.vehicleIndex', cheapestUpgradeQuote.vehicleIndex);
        }
        // make sure there is an upgrade option to use & that it is not the same as the selected quote
        return ((typeof(cheapestUpgradeQuote.vehicleIndex) === 'undefined' || cheapestUpgradeQuote.vehicleIndex < 0) 
                || (cheapestUpgradeQuote.quoteId === this.selectedQuoteId && cheapestUpgradeQuote.vehicleIndex === this.selectedVehicleIndex)
                ) 
                    // no upgrade recommendation available, just return the default
                    ? noUpgradeAvailable(category.type) 
                    // return the recommended upgrade data
                    : {
                        categoryType : category.type,
                        exists : true,
                        tierUpgrade,
                        // pass a reference to the common props function
                        props : this._commonUpgradeProps,
                        data : {
                            key : cheapestUpgradeQuote.quoteId,
                            quoteId : cheapestUpgradeQuote.quoteId,
                            vehicleIndex : cheapestUpgradeQuote.vehicleIndex,
                            vehicle : this.quotes[cheapestUpgradeQuote.quoteId].vehicles[cheapestUpgradeQuote.vehicleIndex],
                            priceDifference : cheapestUpgradeQuote.priceDifference
                        }
                    };
    }
    
    /**
     * Map the quotes to identify matching upgrade vehicles
     * @param {string} quoteId the quote id being mapped for upgrade potential
     * @param {string} categoryType the upgrade category for the vehicle type
     * @param {string} tierUpgrade the upgrade tier for the vehicles to match
     * @returns {Object}
     */
    _mapQuoteUpgradesForSelected(quoteId, categoryType, tierUpgrade) {
        if(this.debugging) {
            console.group("-- _mapQuoteUpgradesForSelected --");
            console.log('Potential upgrade quote ID', quoteId);
            console.log('Upgrade category vehicle type', categoryType);
            console.log('Upgrade tier', tierUpgrade);
            console.log('Potential upgrade quote', this.quotes[quoteId]);
        }
        const quote = this.quotes[quoteId];
        const active = quote.active;
        if(!active) {
            // don't bother checking if the quote isn't active, just return enough of an object 
            // structure to fail correctly
            return {
                quoteId,
                active
            };
        }
        // get the vehicles for the quote
        const vehicles = quote.vehicles;
        // filter the quote vehicles to matching the upgrade teir category type
        const upgradeVehicles = vehicles.filter((vehicle) => vehicle.type[categoryType] === tierUpgrade);
        // pick the first vehicle to be the default selected
        const vehicleIndex = vehicles.indexOf(upgradeVehicles[0]);
        // calculate the price different between the selected quote & this upgrade quote option
        const priceDifference = (upgradeVehicles.length) ? upgradeVehicles[0].price - this.selectedVehicle.price : this.priceDifference;
        if(priceDifference < this.priceDifference && priceDifference > 0) {
        // there is a price difference less than the current price different
            // set the current price difference to the original quote price + the difference
            // which should be the same as the upgrad vehicle quote price ;)
            this.priceDifference = this.selectedVehicle.price + priceDifference;
        }
        if(this.debugging && upgradeVehicles.length) {
            console.log('All vehicles', quote.vehicles);
            console.log('Only available upgrade vehicles', upgradeVehicles);
            console.log('Upgrade Quote Price', this.priceDifference);
            console.log('Price difference between quotes', priceDifference);
            console.groupEnd();
        }
        // return enough data to determine the quote eligability for vehicle category type upgrade
        return {
            active,
            categoryType,
            tierUpgrade,
            quoteId,
            vehicleIndex,
            priceDifference,
            upgradeVehicles
        };
    }
    
    /**
     * Get the common upgrade recommendation props for the component for the 
     * selected quote vehicle & the upgrade option
     * @return {Object} 
     */
    _commonUpgradeProps() {
        return {
            selectedQuoteId : this.selectedQuoteId,
            selectedVehicleIndex : this.selectedVehicleIndex,
            upgradeQuoteId : this.upgradeRecommendation.data.quoteId,
            upgradeVehicleIndex : this.upgradeRecommendation.data.vehicleIndex,
            priceDifference : this.priceDifference,
            selectedVehicle : {
                VehicleClass : this.selectedVehicle.class,
                VehicleType : this.selectedVehicle.type,
                image : this.selectedVehicle.image,
                name : this.selectedVehicle.name
            },
            upgradeVehicle : {
                VehicleClass : this.upgradeRecommendation.data.vehicle.class,
                VehicleType : this.upgradeRecommendation.data.vehicle.type,
                image : this.upgradeRecommendation.data.vehicle.image,
                name : this.upgradeRecommendation.data.vehicle.name
            }
        };
    }
};
