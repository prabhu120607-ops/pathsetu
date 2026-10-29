@echo off
echo Starting PathSetu on http://127.0.0.1:8000 ...
python -m uvicorn main:app --port 8000
pause

