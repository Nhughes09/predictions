import json
from fastapi import FastAPI
from fastapi.responses import JSONResponse, HTMLResponse
import os

app = FastAPI()

@app.get("/api/master.json")
def master():
    with open("api/master.json") as f:
        return JSONResponse(json.load(f), headers={"Cache-Control": "no-store"})

@app.get("/api/current/{filename}")
def current(filename: str):
    path = f"api/current/{filename}"
    if os.path.exists(path):
        with open(path) as f:
            return JSONResponse(json.load(f), headers={"Cache-Control": "no-store"})
    return JSONResponse({"error": "not found"}, status_code=404)

@app.get("/")
def root():
    with open("index.html") as f:
        return HTMLResponse(f.read())
