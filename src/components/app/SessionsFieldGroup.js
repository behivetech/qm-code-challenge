import React, {useCallback, useEffect, useMemo, useReducer} from 'react';
import PropTypes from 'prop-types';
import {get, map, omit} from 'lodash';

import BetweenField from '../core/BetweenField';
import ButtonClose from '../core/ButtonClose';
import Card from '../core/Card';
import Select from '../core/Select';
import TextField from '../core/TextField';

import getClassName from '../../tools/getClassName';
import {
    numberOperators,
    tableFields,
    stringOperators,
} from '../../configs/sessionFormValues';

import './SessionsFieldGroup.scss';

const INITIAL_STATE = {
    operatorType: null,
    selectedOperator: undefined,
    selectedPredicate: undefined,
};

function reducer(state, payload) {
    return {...state, ...payload};
}

export default function SessionsFieldGroup({
    className,
    fieldErrors,
    groupName,
    onClose,
    register,
    setDisableAnd,
    setValue,
    unregister,
    watch,
}) {
    const [
        {operatorType, selectedPredicate, selectedOperator},
        dispatchState,
    ] = useReducer(reducer, INITIAL_STATE);

    const {tableFieldName, operatorName, searchValueName} = useMemo(
        () => ({
            tableFieldName: `${groupName}.tableField`,
            operatorName: `${groupName}.operator`,
            searchValueName: `${groupName}.searchValue`,
        }),
        [groupName]
    );

    const getOperatorOptions = useCallback(
        (currentOperatorType = operatorType) => {
            return currentOperatorType === 'number' ? numberOperators : stringOperators;
        },
        [operatorType]
    );

    // Since SQL code uses AND, limiting the pridicates to what isn't selected.
    const getPredicateOptions = useCallback(() => {
        const usedPredicates = map(watch({nest: true}), ({tableField}) => {
            return tableField;
        });

        return tableFields.filter(({value}) => !usedPredicates.includes(value));
    }, [watch]);

    const setPredicate = useCallback(
        (selectedItem) => {
            const newOperatorType = selectedItem.operatorType;
            const payload = {
                operatorType: newOperatorType,
                selectedPredicate: selectedItem,
            };

            setDisableAnd(Object.keys(watch({nest: true})).length === tableFields.length);

            if (newOperatorType !== operatorType) {
                setValue([{[searchValueName]: ''}]);
                payload.selectedOperator = getOperatorOptions(newOperatorType)[0];
            }

            dispatchState(payload);
        },
        [
            getOperatorOptions,
            operatorType,
            searchValueName,
            setDisableAnd,
            setValue,
            watch,
        ]
    );

    const getSearchValueProps = useCallback(() => {
        const propResults = {
            error: get(fieldErrors, searchValueName),
            key: searchValueName,
            name: searchValueName,
            rightAligned: true,
            type: operatorType,
        };
        // Making all search fields required fields
        let registerOptions = {
            required: 'This field is required.',
        };

        if (selectedPredicate) {
            const {placeholder, validation} = selectedPredicate;

            if (placeholder) {
                propResults.placeholder = placeholder;
            }

            if (validation) {
                registerOptions = {...registerOptions, ...validation};
            }
        }

        // This section could probably be better, but going with this for now
        if (selectedOperator) {
            const {placeholder, validation} = selectedOperator;

            if (placeholder) {
                propResults.placeholder = placeholder;
            }

            if (['inNumber', 'inString'].includes(selectedOperator.value)) {
                // Remove any validation if operator is in list
                registerOptions = omit(registerOptions, ['pattern', 'validate']);
                // Change operatorType to text
                propResults.type = 'text';

                if (selectedPredicate.value === 'user_email') {
                    propResults.placeholder = 'jane@email.com, john@eamil.com';
                }
            }

            if (['containsString', 'startsWithString'].includes(selectedOperator.value)) {
                // Remove extra validation when contains or starts with.
                registerOptions = omit(registerOptions, ['pattern', 'validate']);
            }

            if (validation) {
                registerOptions = {...registerOptions, ...validation};
            }
        }

        return {...propResults, inputRef: register(registerOptions)};
    }, [
        fieldErrors,
        operatorType,
        register,
        searchValueName,
        selectedOperator,
        selectedPredicate,
    ]);

    useEffect(() => {
        if (!selectedPredicate) {
            setPredicate(getPredicateOptions()[0]);
        }
    }, [setPredicate, getPredicateOptions, selectedPredicate]);

    const [rootClassName, getChildClass] = getClassName({
        className,
        rootClass: 'sessions-field-group',
    });

    function handleCloseButtonClick(event) {
        event.preventDefault();
        [tableFieldName, operatorName, searchValueName].map((name) => unregister(name));
        onClose(groupName);
    }

    function handlePredicatesChange(selectedItem) {
        unregister(searchValueName);
        setPredicate(selectedItem);
    }

    function handleOperatorsChange(selectedItem) {
        unregister(searchValueName);
        dispatchState({selectedOperator: selectedItem});
    }

    const SearchComponent =
        selectedOperator && selectedOperator.component ? BetweenField : TextField;

    return (
        <Card className={rootClassName}>
            <ButtonClose
                className={getChildClass('remove')}
                onClick={handleCloseButtonClick}
            />
            <div className={getChildClass('group')}>
                <Select
                    className={getChildClass('field')}
                    inputRef={register}
                    name={tableFieldName}
                    onChange={handlePredicatesChange}
                    getOptions={getPredicateOptions}
                    selected={selectedPredicate}
                />
                <Select
                    className={getChildClass('field')}
                    inputRef={register}
                    name={operatorName}
                    onChange={handleOperatorsChange}
                    getOptions={getOperatorOptions}
                    selected={selectedOperator}
                />
                <SearchComponent
                    {...getSearchValueProps()}
                    className={getChildClass('field')}
                />
            </div>
        </Card>
    );
}

SessionsFieldGroup.propTypes = {
    fieldErrors: PropTypes.object,
    groupName: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    setDisableAnd: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    unregister: PropTypes.func.isRequired,
    watch: PropTypes.func.isRequired,
};
