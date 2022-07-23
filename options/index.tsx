import { useStorage } from "@plasmohq/storage"

import "./options.css"

function IndexOptions() {
  const [username, setUsername] = useStorage<string>("username", "simplewriter")
  const [hostname, setHostname] = useStorage<string>(
    "hostname",
    "simplewriterr.hashnode.dev"
  )

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}
      className="app-container">
      <h1>Hashnode config</h1>

      <div className="form-field">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          placeholder="username"
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="hostname">Hostname</label>
        <input
          type="text"
          name="hostname"
          id="hostname"
          value={hostname}
          placeholder="simplewriter.hashnode.dev"
          onChange={(event) => setHostname(event.target.value)}
        />
      </div>

      <div>Your configs will be automatically saved.</div>

      <h2>Current config</h2>
      <div>Username: {username}</div>
      <div>Hostname: {hostname}</div>
    </div>
  )
}

export default IndexOptions
