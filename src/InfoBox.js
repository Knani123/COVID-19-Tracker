import {
    Card,
    CardActionArea,
    CardContent,
    Typography
  } from "@material-ui/core";
  import React from "react";
  import "./InfoBox.css";
  function InfoBox({ color, title, cases, total, active, isRed, ...props }) {
    return (
      <Card
        onClick={props.onClick}
        className={`infoBox ${active && "infoBox--selected"} ${
          isRed && "infoBox--red"
        }`}
      >
        <CardActionArea>
          <CardContent>
            <Typography className="infoBox__title" color="textSecondary">
              {title}
            </Typography>
            <h2 className="infoBox__cases" style={{ color: color }}>
              {cases}
            </h2>
            <Typography className="infoBox__totale" color="textSecondary">
              Total: {total}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
  
  export default InfoBox;
  