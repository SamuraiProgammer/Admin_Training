import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import {store,persistor } from './store/store.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import { applyPersistedAdminAuth } from './utils/adminSession.js'

applyPersistedAdminAuth();

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
      <Toaster
        style={{
          boxShadow: "0 2px 10px rgba(0,0,0,.1)",
          width: "400px",
        }}
      />
    <PersistGate loading={null} persistor={persistor}>
  
      <App />
    </PersistGate>
</Provider>
)
