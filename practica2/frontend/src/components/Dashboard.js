import React from "react";
import Stats from "./Stats";

const Dashboard = () => {
  return (
    <div className="main">
      <br /><br />
      <div className="d-flex justify-content-around">
      <img alt="" className="logo" src="https://i.pinimg.com/originals/0b/92/c1/0b92c1ba5ae239c314ba2ec1dab936ec.png"/>
      </div>
      <div className="d-flex justify-content-around">
        <h1>DASHBOARD</h1>
      </div>
      <br /><br /><br /><br />
        <Stats />
    </div>
  );
};

export default Dashboard;
