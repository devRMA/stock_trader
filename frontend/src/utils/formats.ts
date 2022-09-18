import numbro from 'numbro';

/**
 *  Function to format the money.
 *
 * @param value The value to format.
 * @returns The money formatted.
 */
export const formatMoney = (value: number | string) => {
    return numbro(value).format({
        totalLength: 3,
        prefix: 'Rŋ ',
    });
};
