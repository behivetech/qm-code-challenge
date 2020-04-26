export const tableFields = [
    {
        displayValue: 'User Email',
        value: 'user_email',
        operatorType: 'text',
        placeholder: 'john.doe@website.com',
        validation: {
            pattern: {
                // eslint-disable-next-line no-useless-escape
                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                message: 'Please enter a valid email address.',
            },
        },
    },
    {
        displayValue: 'Screen Width',
        value: 'screen_width',
        operatorType: 'number',
    },
    {
        displayValue: 'Screen Height',
        value: 'screen_height',
        operatorType: 'number',
    },
    {
        displayValue: '# of Visits',
        value: 'visits',
        operatorType: 'number',
    },
    {
        displayValue: 'First Name',
        value: 'user_first_name',
        operatorType: 'text',
        placeholder: 'John',
    },
    {
        displayValue: 'Last Name',
        value: 'user_last_name',
        operatorType: 'text',
        placeholder: 'Doe',
    },
    {
        displayValue: 'Page Response time (ms)',
        value: 'page_response',
        operatorType: 'number',
        placeholder: 'Enter value in milliseconds',
    },
    {
        displayValue: 'Domain',
        value: 'domain',
        operatorType: 'text',
        placeholder: 'www.website.com',
    },
    {
        displayValue: 'Page Path',
        value: 'path',
        operatorType: 'text',
        placeholder: '/example/path',
    },
];

const inListSettings = {
    displayValue: 'in list',
    validation: {
        pattern: {
            // eslint-disable-next-line no-useless-escape
            value: /^\w+(,(| )\w+)*$/,
            message: 'Value must be separated by commas.',
        },
        // validate: (value) => {
        //     const result = (value.split(' ').length > 1 && value.split(',').length < 2)
        //         ? undefined
        //         : 'Values must be separated by commas';

        //     console.log(result, value.split(' ').length, value.split(',').length)
        //     return result;
        // },
    },
};

export const stringOperators = [
    {
        displayValue: 'equals',
        value: 'equalsString',
    },
    {
        displayValue: 'contains',
        value: 'containsString',
    },
    {
        displayValue: 'starts with',
        value: 'startsWithString',
    },
    {
        ...inListSettings,
        placeholder: 'a, b, c, d',
        value: 'inString',
    },
];

export const numberOperators = [
    {
        displayValue: 'equals',
        value: 'equalsNumber',
    },
    {
        displayValue: 'between',
        component: 'BetweenField',
        value: 'betweenNumber',
        validation: {
            pattern: {
                value: /\d AND \d/,
                message: 'Both fields are required',
            },
        },
    },
    {
        displayValue: 'greater than',
        value: 'gtNumber',
    },
    {
        displayValue: 'less than',
        value: 'ltNumber',
    },
    {
        ...inListSettings,
        placeholder: '1, 2, 3, 4',
        value: 'inNumber',
    },
];
