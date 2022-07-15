import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { MoralisProvider } from "react-moralis"

const SERVER_URL = process.env.REACT_APP_SERVER_URL
const APP_ID = process.env.REACT_APP_APPLICATION_ID

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <MoralisProvider serverUrl={SERVER_URL} appId={APP_ID}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </MoralisProvider>
)
