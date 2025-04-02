# Local-CLI Project

## Overview

The Local-CLI project is a command-line interface tool designed to simplify and automate tasks for local development. This guide will help you set up and run the project on your machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A terminal or command-line interface

<!-- ## Installation -->

## Backend

1. Inside the Local-CLI directory, cd into the local-cli-backend directory and run the following command:
    ```bash
    python -m venv .
    ```
2. Activate the virtual environment:
    - On Windows (i think):
        ```bash
        .\venv\Scripts\activate
        ```
    - On macOS/Linux:
        ```bash
        source ./venv/bin/activate
        ```
3. Install the required packages:
    ```bash
    pip install -r reqs.txt
    ```
    Mainly uses the fastapi and requests libraries from python.

4. Run the backend server:
    ```bash
    fastapi dev main.py
    ```

5. The backend server should now be running at `http://127.0.0.1:8000`.

## Frontend

1. Inside the Local-CLI directory, cd into the local-cli-frontend directory and run the following command:
    ```bash
    npm install
    ```

2. Start the frontend server:
    ```bash
    npm start
    ```

3. Open your browser and navigate to `http://localhost:3000` to access the Local-CLI web interface.

## Usage

Set up a node using the docker-compose and use the IP and port from the docker container (usually `127.0.0.1:32049`).

OR 

Use `23.239.12.151:32349` as the IP and port to connect to a hosted node.
