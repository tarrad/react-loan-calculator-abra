import React from 'react';
import { LoanProvider } from './context/LoanContext';
import LoanForm from './components/LoanForm';
import './App.css';

function App() {
  return (
    <LoanProvider>
      <div  dir="rtl">
       
        <main>
          <LoanForm />
        </main>
      </div>
    </LoanProvider>
  );
}

export default App;
