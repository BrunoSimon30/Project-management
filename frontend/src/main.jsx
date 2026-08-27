import { createRoot } from 'react-dom/client'
import './assets/css/style.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
    <Toaster position="bottom-right" richColors />
  </Provider>,
)
