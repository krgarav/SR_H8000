import React, { useEffect, useState } from "react";
import classes from "./Jobcard.module.css";
const Jobcard = (props) => {
  const [stateValue , setStateValue] = useState();
  // useEffect(() => {
  //   props.handleJob(props.text);
  // }, [props]);

  const handleClick = () => {
    // setStateValue(props.text);
    props.handleJob(props.text);
  };
  return <div className={classes.card} onClick={handleClick}>{props.text}</div>;
};

export default Jobcard;
