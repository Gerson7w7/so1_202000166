import React from "react";
import Stats from "./Stats";

const Dashboard = () => {
  return (
    <div className="main">
    <div className="d-flex justify-content-end">
        <h6>fecha</h6>
    </div>
      <div className="d-flex justify-content-around">
      <img alt="" className="logo" src="https://virgendelcerro.es/wp-content/uploads/2018/02/007-vote.png"/>
      </div>
      <div className="d-flex justify-content-around">
        <h1>DASHBOARD</h1>
      </div>
      <br /><br />
        <Stats />
    </div>
  );
};

export default Dashboard;