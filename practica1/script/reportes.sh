#!/usr/bin/env bash

# creamos el archivo donde guardaremos los logs
touch /tmp/reportes.json
# Nos conectamos a la bd y creamos un archivo log de la consulta
curl http://backend:5000/log > /tmp/reportes.json
# primero ejecutamos la cantidad de logs registrados
echo "Total de registros: "
cat /tmp/reportes.json | jq '. | length'

echo "Cantidad de operaciones con error: "
cat /tmp/reportes.json | jq -r '.[] | .esError' | sort | uniq -c

echo "Cantidad de operaciones con: "
cat /tmp/reportes.json | jq -r '.[] | .operacion' | sort | uniq -c

fecha_actual=$(date +%Y.%m.%d)
resultado=$(jq '. | map(select(.fecha | startswith("'"$fecha_actual"'"))) | length' /tmp/reportes.json)
echo "La cantidad de elementos con la fecha actual es: $resultado"