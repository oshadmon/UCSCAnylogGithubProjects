# Use official Python image as base
FROM python:3.11-slim AS base

# Set environment variables
ENV PYTHONPATH=/app/CLI/Local-CLI/local-cli-backend \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    VIRTUAL_ENV=/opt/venv \
    PATH="$VIRTUAL_ENV/bin:$PATH" \
#     NODE_OPTIONS=--openssl-legacy-provider \
    CLI_IP=0.0.0.0 \
    CLI_PORT=8000

# Set working directory + copy files
WORKDIR /app
COPY requirements.txt .
COPY CLI/ CLI
COPY templates/ templates

# Install system dependencies
RUN apt-get update && \
    apt-get install -y curl gnupg build-essential git python3-venv build-essential python3-dev && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    python3 -m venv $VIRTUAL_ENV && \
    $VIRTUAL_ENV/bin/pip install --upgrade pip setuptools wheel  && \
    $VIRTUAL_ENV/bin/pip install -r ./requirements.txt && \
    git clone https://github.com/AnyLog-co/AnyLog-API

# Install AnyLog-API
WORKDIR /app/AnyLog-API
RUN $VIRTUAL_ENV/bin/python setup.py sdist bdist_wheel
RUN $VIRTUAL_ENV/bin/pip install --upgrade dist/*.whl

# # Install frontend dependencies
WORKDIR /app/CLI/Local-CLI/local-cli-fe-full
RUN npm install && npm run build

FROM base AS deployment

# cleanup
WORKDIR /app
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* AnyLog-API build/ anylog_api.egg-info/ && \
    mkdir -p CLI/Local-CLI/local-cli-fe-full/public/static

EXPOSE ${CLI_PORT}
# CMD bash -c "$VIRTUAL_ENV/bin/uvicorn CLI.Local-CLI.local-cli-backend.main:app --host ${CLI_IP} --port ${CLI_PORT} & cd /app/CLI/Local-CLI/local-cli-fe-full && npm start"
CMD bash -c "$VIRTUAL_ENV/bin/uvicorn CLI.Local-CLI.local-cli-backend.main:app --host ${CLI_IP} --port ${CLI_PORT} & cd /app/CLI/Local-CLI/local-cli-fe-full && HOST=0.0.0.0 PORT=3001 npm start"


# Default command (can be overridden)
# ENTRYPOINT ["bash"]
