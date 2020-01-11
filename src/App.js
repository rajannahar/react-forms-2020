import React from 'react';
import './App.css';

import VanillaForm from './components/VanillaForm'
import FormikForm from './components/FormikForm'

function App() {
  return (
    <>
      <VanillaForm />
      <hr />
      <FormikForm />
    </>
  );
}

export default App;
