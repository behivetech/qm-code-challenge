import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism';

import Button from '../core/Button';
import Headline from '../core/Headline';
import Modal from '../core/Modal';
import SessionsFieldGroup from './SessionsFieldGroup';

import getClassName from '../../tools/getClassName';
import queryBuilder from '../../tools/queryBuilder';

import './SessionsForm.scss';

export default function SessionsForm() {
    const {
        errors: fieldErrors,
        handleSubmit,
        register,
        setValue,
        unregister,
        watch,
    } = useForm();
    const [modalOpen, setModalOpen] = useState(false);
    const [groupIndex, setGroupIndex] = useState(1);
    const [fieldGroups, setFieldGroups] = useState([getGroupName(0)]);
    const [disableAnd, setDisableAnd] = useState(false);
    const [rootClassName, getChildClass] = getClassName({
        rootClass: 'sessions-form',
    });

    function getGroupName(index) {
        return `group${index}`;
    }

    function handleFieldGroupClose(groupName) {
        if (fieldGroups.length > 1) {
            setFieldGroups(fieldGroups.filter((groupId) => groupId !== groupName));
        } else {
            resetFieldGroups();
        }
    }

    function renderQuery() {
        return modalOpen ? (
            <section>
                <Headline level={1}>Generated SQL Query</Headline>
                <SyntaxHighlighter language="sql" style={dark}>
                    {queryBuilder(watch({nest: true}))}
                </SyntaxHighlighter>
            </section>
        ) : null;
    }

    function renderFieldGroup(groupName) {
        return (
            <SessionsFieldGroup
                className={getChildClass('field-group')}
                fieldErrors={fieldErrors}
                groupName={groupName}
                key={groupName}
                onClose={handleFieldGroupClose}
                register={register}
                setDisableAnd={setDisableAnd}
                setValue={setValue}
                unregister={unregister}
                watch={watch}
            />
        );
    }

    function addFieldGroup() {
        setFieldGroups([...fieldGroups, getGroupName(groupIndex)]);
        setGroupIndex(groupIndex + 1);
    }

    function handleOnSubmit(data) {
        setModalOpen(true);
    }

    function resetFieldGroups() {
        setFieldGroups([getGroupName(groupIndex)]);
        setGroupIndex(groupIndex + 1);
    }

    function handleAddClick(event) {
        event.preventDefault();
        addFieldGroup();
    }

    function handleResetClick(event) {
        event.preventDefault();
        resetFieldGroups();
    }

    return (
        <section className={rootClassName}>
            <Headline level={1}>Search for Sessions</Headline>
            <form className={rootClassName} onSubmit={handleSubmit(handleOnSubmit)}>
                <div className={getChildClass('form-area')}>
                    {fieldGroups.map((groupName) => renderFieldGroup(groupName))}
                    <Button
                        className={getChildClass('button')}
                        disabled={disableAnd}
                        onClick={handleAddClick}
                        small
                    >
                        And
                    </Button>
                </div>
                <hr className={getChildClass('hr')} />
                <Button
                    className={getChildClass('form-button')}
                    icon="search"
                    type="submit"
                >
                    Search
                </Button>
                <Button
                    className={getChildClass('form-button')}
                    onClick={handleResetClick}
                    secondary
                    type="reset"
                >
                    Reset
                </Button>
            </form>
            <Modal open={modalOpen} onClose={setModalOpen}>
                {renderQuery()}
            </Modal>
        </section>
    );
}
