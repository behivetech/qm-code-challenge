import React from 'react';

import SessionsForm from './components/app/SessionsForm';

import getClassName from './tools/getClassName';

import './App.scss';

export default function App() {
    const [rootClassName] = getClassName({rootClass: 'app'});

    return (
        <main className={rootClassName}>
            <SessionsForm />
        </main>
    );
}
