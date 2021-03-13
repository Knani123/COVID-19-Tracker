import React, { useEffect, useState } from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 200
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 300
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 500
  }
};
export const sortData = (data, cof) => {
  const sorteddata = [...data];
  sorteddata.sort((a, b) => cof * (b.cases - a.cases));
  return sorteddata;
};
//draw circle o the map
export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const showDataOnMap = (data, casesType, myColor) =>{
  const [col, setCol] = useState("");
  useEffect(() => {
    casesType=="recovered"?setCol("green"):setCol("red")
  }, [casesType]);
  console.log("col",col)
  return data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      // color={casesTypeColors[casesType].hex}
      color="red"
      // fillColor={casesTypeColors[casesType].hex}
      fillColor="yellow"
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />

          <div className="info-name">{country.country}</div>
          <div
            className="info-confirmed"
            style={{ color: casesTypeColors.cases.hex }}
          >
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div
            className="info-recovered"
            style={{ color: casesTypeColors.recovered.hex }}
          >
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div
            className="info-deaths"
            style={{ color: casesTypeColors.deaths.hex }}
          >
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
}