import json
from random import randrange
from locust import HttpUser, task, between

class ReadFile():
    def __init__(self):
        self.data = []

    def getData(self):
        size = len(self.data)
        if size > 0:
            index = randrange(0, size - 1) if size > 1 else 0
            return self.data.pop(index)
        else:
            print("size = 0")
            return None
        
    def loadFile(self):
        print("LOADING...")
        try:
            with open("traffic.json", "r", encoding="utf-8") as file:
                self.data = json.loads(file.read())
        except Exception:
            print(f'Error: {Exception}')

class CargaTrafico(HttpUser):
    wait_time = between(0.1, 0.9)
    reader = ReadFile()
    reader.loadFile()

    def on_start(self):
        print("On Start")

    @task
    def sendData(self):
        data = self.reader.getData()
        if data is not None:
            #Pendiente ruta definitiva
            res = self.client.post("/add-voto", json=data)
            print(res.json())
        else:
            print("Empty")
            self.stop(True)