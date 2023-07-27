import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Markerposition from "./components/Markerposition.jsx";
import Loader from "./components/Loader.jsx";

const API_KEY = "at_Shul1TKT6sv35KQHqEvDlUs51mbS2";

//https://geo.ipify.org/api/v2/country?apiKey=at_Shul1TKT6sv35KQHqEvDlUs51mbS2&ipAddress=8.8.8.8

function App() {
  const [address, setaddress] = useState("");
  // const [location, setLocation] = useState("");
  // const [timezone, setTimezone] = useState("");
  // const [isp, setIsp] = useState("");

  const [searchIp, setSearchIp] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;

  const fetchIPDetails = async () => {
    setIsLoading(true);
    try {
      await fetch(
        `https://geo.ipify.org/api/v1?apiKey=${API_KEY}&ipAddress=${searchIp}`
      )
        .then((res) => res.json())
        .then((data) => {
          setaddress(data);
          // console.log(address);
        });
    } catch (error) {
      console.log(error);
      setaddress("");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchIP = async () => {
      await fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => setSearchIp(data.ip));
    };

    fetchIP();

    fetchIPDetails();
    // console.log(ip)
  }, []);

  function handlSubmit(e) {
    e.preventDefault();

    if (checkIpAddress.test(searchIp)) fetchIPDetails();
    else alert("Invalid IP Address");
    // setSearchIp("");
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {address !== "" ? (
            <>
              <div className="info">
                <form onSubmit={handlSubmit}>
                  <input
                    type="text"
                    placeholder="Enter IP Address"
                    onChange={(e) => setSearchIp(e.target.value)}
                  />
                  <button type="submit">Submit</button>
                </form>
                <article className="details">
                  <h1>IP Address : {address.ip}</h1>
                  <h2>
                    Location : {address.location.country},{" "}
                    {address.location.region}
                  </h2>
                  <h2>TimeZone : {address.location.timezone}</h2>
                  <h2>ISP : {address.isp} </h2>
                  <h2>Latitude: {address.location.lat}</h2>
                  <h2>Longitude: {address.location.lng}</h2>
                </article>
              </div>
              <div className="map">
                <MapContainer
                  center={[address.location.lat, address.location.lng]}
                  zoom={13}
                  scrollWheelZoom={true}
                  style={{ height: "100vh", width: "100vw" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Markerposition address={address} />
                </MapContainer>
              </div>
            </>
          ) : (
            <h1>IP Address Not Found</h1>
          )}
        </>
      )}
    </>
  );
}

export default App;
