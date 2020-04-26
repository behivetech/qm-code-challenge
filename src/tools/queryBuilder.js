import {map} from 'lodash';

function convertInValue(value, isString) {
    const wrapper = isString ? "'" : '';

    return `${wrapper}${value
        .split(' ')
        .join('')
        .split(',')
        .join(`${wrapper}, ${wrapper}`)}${wrapper}`;
}

export default function queryBuilder(formValues) {
    const sqlFieldFunctions = {
        betweenNumber: (field, value) => `${field} BETWEEN ${value}`,
        containsString: (field, value) =>
            `LOWER(${field}) LIKE '%${value.toLowerCase()}%'`,
        equalsNumber: (field, value) => `${field} = ${value}`,
        equalsString: (field, value) => `LOWER(${field}) = '${value.toLowerCase()}'`,
        gtNumber: (field, value) => `${field} > ${value}`,
        inNumber: (field, value) => `${field} IN (${convertInValue(value)})`,
        inString: (field, value) =>
            `LOWER(${field}) IN (${convertInValue(value.toLowerCase(), true)})`,
        ltNumber: (field, value) => `${field} < ${value}`,
        startsWithString: (field, value) =>
            `LOWER(${field}) LIKE '${value.toLowerCase()}%'`,
    };

    const whereStatements = map(formValues, ({operator, tableField, searchValue}) => {
        return sqlFieldFunctions[operator](tableField, searchValue);
    });

    return `SELECT * FROM session WHERE\n\t${whereStatements.join(' AND\n\t')}`;
}
