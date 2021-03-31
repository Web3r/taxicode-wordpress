// import the BIQ state management modules
import BIQSearchStateStore from 'BIQ/store/modules/SearchStateStore';
import BIQQuotesStateStore from 'BIQ/store/modules/QuotesStateStore';
import BIQCheckoutStateStore from 'BIQ/store/modules/CheckoutStateStore';

// define the related state management modules for the BIQ app
const BIQStateStore = {
    search : BIQSearchStateStore,
    quotes : BIQQuotesStateStore,
    checkout : BIQCheckoutStateStore
};
// export the default object container
export default BIQStateStore