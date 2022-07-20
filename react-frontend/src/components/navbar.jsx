import { ConnectButton } from "web3uikit"
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <div className="nav-container">
      <div className="nav-bar">
        <div className="nav-left">
          <h1>SoulCertifier</h1>
        </div>

        <ul className="nav-right">
          <Link to="/">Home</Link>
          <Link to="create">Create</Link>
          <Link to="search">Search</Link>
          <ConnectButton moralisAuth={false} />
        </ul>
      </div>
    </div>
  )
}

export default Navbar
