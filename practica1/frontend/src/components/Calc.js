import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

let outPut = '';
let operacion = { num1: '', num2: '', signo: '' }

const Calc = () => {
    const [res, setRes] = useState("");
    let navigate = useNavigate();

    const escribirNum = (num) => {
        if (operacion.num1 === '') {
            outPut = num;    
        } else {
            outPut += num;
        }
        setRes(outPut);
        if (operacion.signo === '') {
            operacion.num1 += num;
        } else {
            operacion.num2 += num;
        }
    }

    const escribirSig = (sig) => {
        outPut += sig;
        setRes(outPut);
        operacion.signo = sig;
    }

    const resultado = () => {
        console.log(operacion.num1)
        console.log(operacion.signo)
        console.log(operacion.num2)

        const url = "http://localhost:5000/resultado";
        fetch(url, {
            method: "POST", // or 'PUT'
            body: JSON.stringify(operacion), // data can be `string` or {object}!
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .catch((error) => console.error("Error:", error))
            .then((res) => setRes(res.res));
        // reseteamos valores
        operacion.num1 = ''
        operacion.num2 = ''
        operacion.signo = ''
    }

    return (
        <div className="main">
            <div className="d-flex justify-content-around">
                <h1>CALCULADORA</h1>
            </div>
            <div className="d-flex justify-content-center base-top">
                <div className="form-group">
                    <textarea className="form-control" disabled id="exampleTextarea" rows="3" cols="50" value={res}></textarea>
                </div>
            </div>
            <div className="d-flex justify-content-center base-def">
                <button type="button" className="btn btn-outline-info" onClick={() => escribirNum('7')}>7</button>
                <button type="button" className="btn btn-outline-info" onClick={() => escribirNum('8')}>8</button>
                <button type="button" className="btn btn-outline-info" onClick={() => escribirNum('9')}>9</button>
                <button type="button" className="btn btn-outline-info" onClick={() => escribirSig('x')}>x</button>
            </div>
            <div className="d-flex justify-content-center base-def">
                <button type="button" className="btn btn-outline-info" onClick={() => escribirNum('4')}>4</button>
                <button type="button" className="btn btn-outline-info" onClick={() => escribirNum('5')}>5</button>
                <button type="button" className="btn btn-outline-info" onClick={() => escribirNum('6')}>6</button>
                <button type="button" className="btn btn-outline-info" onClick={() => escribirSig('/')}>/</button>
            </div>
            <div className="d-flex justify-content-center base-def">
                <button type="button" className="btn btn-outline-info" onClick={() => escribirNum('1')}>1</button>
                <button type="button" className="btn btn-outline-info" onClick={() => escribirNum('2')}>2</button>
                <button type="button" className="btn btn-outline-info" onClick={() => escribirNum('3')}>3</button>
                <button type="button" className="btn btn-outline-info" onClick={() => resultado()}>=</button>
            </div>
            <div className="d-flex justify-content-center base-bott">
                <button type="button" className="btn btn-outline-info" onClick={() => escribirNum('0')}>0</button>
                <button type="button" className="btn btn-outline-info" onClick={() => escribirSig('+')}>+</button>
                <button type="button" className="btn btn-outline-info" onClick={() => escribirSig('-')}>-</button>
                <button type="button" className="btn btn-outline-info" onClick={() => navigate('/log')}>Log</button>
            </div>
        </div>
    );
};

export default Calc;