FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy dependencies
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app ./app
COPY alembic.ini .
COPY alembic ./alembic

# Expose port
EXPOSE 8000

# Run FastAPI using Uvicorn (production-style)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
