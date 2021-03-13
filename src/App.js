import {
  Card,
  CardContent,
  FormControl,
  makeStyles,
  MenuItem,
  Select
} from "@material-ui/core";
import { useEffect, useState } from "react";
import InfoBox from "./InfoBox";
import Table from "./Table";
import MyMap from "./MyMap";
import "./styles.css";
import { sortData, prettyPrintStat } from "./util";
import { Switch, Button } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import PublishIcon from "@material-ui/icons/Publish";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import "./app.css";

const useStyle = makeStyles((theme) => ({
  app: {
    display: "flex",
    justifyContent: "space-evenly",
    padding: "20px",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column"
    }
  },
  app__header: {
    color: "#fc3c3c",
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px"
  },
  app__left: { flexGrow: 0.9 },
  app__right: {
    border: "1px solid black",
    display: "flex",
    flexDirection: "column"
  },
  app__stats: { display: "flex", justifyContent: "space-between" }
}));

export default function App() {
  const classes = useStyle();
  const [coutries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfos, setCountryInfos] = useState({});
  const [tableData, setTableData] = useState();
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 33.8869, lng: 11.5375 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCoutries, setMapCountries] = useState([]);
  const [myColor, setMyColor] = useState("");
  ////Switch
  const [checkedA, setCheckedA] = useState(true);

  const handleChange = (event) => {
    setCheckedA(!checkedA);
  };
  useEffect(() => {
    const getCountires = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));
          let cof = checkedA ? 1 : -1;
          const sortedData = sortData(data, cof);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };
    getCountires();
  }, [checkedA]);
  useEffect(() => {
    const infoCountry = async () => {
      await fetch("https://disease.sh/v3/covid-19/all")
        .then((res) => res.json())
        .then((data) => setCountryInfos(data));
    };
    infoCountry();
  }, [casesType]);
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    //https://disease.sh/v3/covid-19/countries/TUN
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfos(data);
        data.countryInfo&&setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4);
      });
  };
  return (
    <div className={classes.app}>
      <div className={classes.app__left}>
        <div className={classes.app__header}>
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app__drompdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">worldwide</MenuItem>
              {coutries.map((country) => (
                <MenuItem value={country.value} key={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className={classes.app__stats}>
          <InfoBox
            isRed
            active={casesType === "cases"}
            color="#CC1034"
            onClick={(e) => {
              setCasesType("cases");
              setMyColor("#CC1034");
            }}
            title="Coronavirus Cases"
            total={prettyPrintStat(countryInfos.cases)}
            cases={prettyPrintStat(countryInfos.todayCases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            color="#7dd71d"
            onClick={(e) => {
              setCasesType("recovered");
              setMyColor("#7dd71d");
            }}
            title="Recovered"
            total={prettyPrintStat(countryInfos.recovered)}
            cases={prettyPrintStat(countryInfos.todayRecovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            color="#fb4443"
            onClick={(e) => {
              setCasesType("deaths");
              setMyColor("#fb4443");
            }}
            title="Deaths"
            total={prettyPrintStat(countryInfos.deaths)}
            cases={prettyPrintStat(countryInfos.todayDeaths)}
          />
        </div>
        <MyMap
          color={myColor}
          casesType={casesType}
          countries={mapCoutries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <div className="app__right">
        <Card>
          <CardContent>
            <h3> live cases by coutry </h3>
            <Button
              onClick={handleChange}
              endIcon={checkedA ? <PublishIcon /> : <GetAppIcon />}
            >
              <Switch
                checked={checkedA}
                onChange={handleChange}
                name="checkedA"
                inputProps={{ "aria-label": "secondary checkbox" }}
              />
            </Button>
            <Table countries={tableData} />
            <h3 style={{ paddingTop: "20px" }}>Worldwide new cases </h3>
            <LineGraph casesType={casesType} />{" "}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
