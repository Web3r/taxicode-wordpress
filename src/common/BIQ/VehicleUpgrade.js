/**
 * The max passengers for a single standard car
 * @type Number
 */
export const MAX_CAR_PASSENGERS = 4;

 /**
  * The available quote vehicle class upgrade tier options
  * @type Array
  */
export const CLASS_UPGRADE_TIERS = [
     'standard', 
     'executive', 
     'vip', 
     'chauffeur'
];
 
 /**
  * The available quote vehicle type upgrade tier options
  * @type Array
  */
export const TYPE_UPGRADE_TIERS = [
     'minicab', 
     'mpv', 
     'minibus', 
     'coach'
];

// define the object structure for quote vehicle
export const emptyVehicleProps = {
    VehicleClass : null,
    VehicleType : null,
    image : null,
    name : null
};
// define the object structure returned by the recommended upgrade.props()
export const emptyUpgradeProps = {
    selectedQuoteId : null,
    selectedVehicleIndex : null,
    upgradeQuoteId : null,
    upgradeVehicleIndex : null,
    priceDifference : 9999,
    selectedVehicle : emptyVehicleProps,
    upgradeVehicle : emptyVehicleProps,
    title : 'No Upgrade',
    description : 'No Upgrade',
    gaEventData : {
        category : 'Quotes',
        action : 'Quote Upgrade'
    },
    bulletPoints : []
}
 
/**
 * Determine the upgrade criteria for a category type
 * @param {string} tierType the upgrade category tier type
 * @param {Object} journey the quoted journey details
 * @param {Object} selectedVehicle the selected vehicle to check upgrade posibilities of
 * @returns {Boolean} TRUE If the category type requirment criteria is met
 * @throws error if the category type has no upgrade criteria defined
 */
export const upgradeCriteria = (tierType, journey, selectedVehicle) => {
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
export const upgradeOptionProps = upgradeRecommendation => {
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
export const typeUpgradeProps = upgradeRecommendation => {
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
export const classUpgradeProps = upgradeRecommendation => {
    const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);
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

// create a default exportable object container
const VehicleUpgrade = {
    MAX_CAR_PASSENGERS,
    CLASS_UPGRADE_TIERS,
    TYPE_UPGRADE_TIERS,
    emptyVehicleProps,
    emptyUpgradeProps,
    upgradeCriteria,
    upgradeOptionProps,
    typeUpgradeProps,
    classUpgradeProps
};
// export the default object container
export default VehicleUpgrade;
