import React from "react";
import { useState, useEffect } from "react";

const Log = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const getLogs = () => {
        const url = "http://localhost:5000/log";
        fetch(url, {
            method: "GET", // or 'PUT'
            headers: {
            "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .catch((error) => console.error("Error:", error))
            .then((res) => {
            if (isMounted) setLogs(res);
            });
        };
        getLogs();
        return () => {
        isMounted = false;
        };
    }, []);

    return (
        <div className="main">
            <div className="d-flex justify-content-around">
                <h1>Log de operaciones</h1>
            </div>
            <div className="d-flex justify-content-around">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th className="table-dark" scope="col">
                                No.
                            </th>
                            <th className="table-active" scope="col">
                                Numero 1
                            </th>
                            <th className="table-dark" scope="col">
                                Numero 2
                            </th>
                            <th className="table-active" scope="col">
                                Operacion 
                            </th>
                            <th className="table-dark" scope="col">
                                Resultado 
                            </th>
                            <th className="table-active" scope="col">
                                Fecha y hora
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, index) => (
                        <tr key={index}>
                            <th className="table-primary" scope="row">
                            {index + 1}
                            </th>
                            <td className="table-success">{log.num1}</td>
                            <td className="table-warning">{log.num2}</td>
                            <td className="table-success">{log.operacion}</td>
                            <td className="table-warning">{log.resultado}</td>
                            <td className="table-success">{log.fecha}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Log;