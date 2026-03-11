FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose port (Render sets PORT env automatically, typically we use host 0.0.0.0 and dynamic port)
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
