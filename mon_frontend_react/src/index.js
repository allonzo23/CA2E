import React from 'react';
import ReactDOM from 'react-dom/client';
//import './index.css';
import "./styles.css";
import "@fontsource/inter";
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DashboardProvider } from "./context/DashboardContext";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <DashboardProvider>   {/* ✅ Très important */}
      <App />
    </DashboardProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
