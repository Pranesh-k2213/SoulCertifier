import "./App.css"
import { useMoralis } from "react-moralis"
import Home from "./components/Home"
import Create from "./components/Create"
import Search from "./components/Search"
import { Routes, Route } from "react-router-dom"

function App() {
  const { isWeb3Enabled } = useMoralis()

  return isWeb3Enabled ? (
    <div className="container">
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="create" element={<Create />} />
          <Route path="search" element={<Search />} />
        </Routes>
      </div>
    </div>
  ) : (
    <div>Connect your wallet</div>
  )
}

export default App
