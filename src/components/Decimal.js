
const Decimal = ({decimal = 18, number = 0 , currency = "", fixed = 2}) => {

    return(
        (parseFloat(number) /10**decimal).toFixed(fixed) + " " + currency
    );
};
export default Decimal;