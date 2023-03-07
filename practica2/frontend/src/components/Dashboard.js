import React from "react";
//import { useState } from "react";
//import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    // const [res, setRes] = useState("");
    // let navigate = useNavigate();

    return (
        <div className="main">
            <div className="d-flex justify-content-around">
                <h1>DASHBOARD</h1>
            </div>
            <div class="d-flex justify-content-evenly">
                <div>CPU</div>
                <div>RAM</div>
            </div>
            <div class="d-flex justify-content-evenly">
                <div>PROCESOS</div>
            </div>
        </div>
    );
};

export default Dashboard;