import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import Navbar from "./components/navbar"
import { MoralisProvider } from "react-moralis"
import { BrowserRouter } from "react-router-dom"
import { NotificationProvider } from "web3uikit"

const SERVER_URL = process.env.REACT_APP_SERVER_URL
const APP_ID = process.env.REACT_APP_APPLICATION_ID

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <MoralisProvider serverUrl={SERVER_URL} appId={APP_ID}>
      <NotificationProvider>
        <BrowserRouter>
          <Navbar />
          <App />
        </BrowserRouter>
      </NotificationProvider>
    </MoralisProvider>
  </React.StrictMode>
)
