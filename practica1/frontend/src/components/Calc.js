import React from "react";
// import { useState, useEffect } from "react";

const Calc = () => {
//   const [res, setRes] = useState([]);

//   useEffect(() => {
//     let isMounted = true;
//     const getRes = () => {
//       const url = "http://localhost:5000/resultado";
//       fetch(url, {
//         method: "GET", // or 'PUT'
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => console.error("Error:", error))
//         .then((res) => {
//           if (isMounted) setRes(res.res);
//         });
//     };
//     getRes();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

  return (
    <div className="main">
        <div className="d-flex justify-content-around">
            <h1>CALCULADORA</h1>
        </div>
        <div class="d-flex justify-content-center base-top">
            <div class="form-group">
                <textarea class="form-control" id="exampleTextarea" rows="3"></textarea>
            </div>
        </div>
        <div class="d-flex justify-content-center base-def">
            <button type="button" class="btn btn-outline-info">7</button>
            <button type="button" class="btn btn-outline-info">8</button>
            <button type="button" class="btn btn-outline-info">9</button>
        </div>
        <div class="d-flex justify-content-center base-def">
            <button type="button" class="btn btn-outline-info">4</button>
            <button type="button" class="btn btn-outline-info">5</button>
            <button type="button" class="btn btn-outline-info">6</button>
        </div>
        <div class="d-flex justify-content-center base-def">
            <button type="button" class="btn btn-outline-info">1</button>
            <button type="button" class="btn btn-outline-info">2</button>
            <button type="button" class="btn btn-outline-info">3</button>
        </div>
        <div class="d-flex justify-content-center base-bott">
            <button type="button" class="btn btn-outline-info">0</button>
            <button type="button" class="btn btn-outline-info">+</button>
            <button type="button" class="btn btn-outline-info">-</button>
        </div>
    </div>
  );
};

export default Calc;