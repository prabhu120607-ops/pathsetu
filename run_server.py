"""
PathSetu Server Runner
Starts the FastAPI application server on http://127.0.0.1:8000
"""

import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import uvicorn

if __name__ == "__main__":
    print("=======================================================")
    print("PathSetu - Career Decision Intelligence Server")
    print("Opening at: http://127.0.0.1:8000")
    print("=======================================================")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)

