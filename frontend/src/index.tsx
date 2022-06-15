import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import LayoutDefault from './components/layout';
import Explore from './components/explore';
import Profile from './components/profile';
import TokenDetails from './components/token-details';
import Error from './components/error';
import { Provider } from 'react-redux';
import { store } from './store/store';
import CreateNFT from './components/create-nft';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <LayoutDefault>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/create-nft" element={<CreateNFT />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/token/:assetQuery" element={<TokenDetails />} />
            <Route path="/error" element={<Error />} />
            <Route path="*" element={<Navigate to="/error" replace />} />
          </Routes>
        </LayoutDefault>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
