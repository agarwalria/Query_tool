# Data Query Tool – README

This repository contains a **full‑stack data querying tool** with:
- **Backend (Spring Boot)** – runs on port **9090**; connects to **MySQL** (and optionally MongoDB).
- **Kafka helper service (Spring Boot)** – simple REST facade to publish messages to Kafka; runs on port **8080**.
- **Frontend (React)** – UI to manage DB connections, templates, and execute queries.

> Repo layout:
```
Query_tool/
├─ data-query-tool/       # Spring Boot backend (port 9090)
├─ kafka/                 # Spring Boot Kafka helper service (port 8080)
└─ frontend/              # React app (port 3000 in dev; static build for prod)
```

---

## 1) Backend (Spring Boot) – `data-query-tool`

**Key endpoints** (selected):
- `POST /api/db_connection/connect` – connect to a DB (MySQL or MongoDB)
- `POST /api/execute-query` – execute SQL query (supports SELECT/INSERT/UPDATE/DELETE/CREATE)
- `POST /api/login`, `POST /api/signup`
- `GET /api/sql-queries`, etc.

**Default config** (see `src/main/resources/application.properties`):
- `server.port=9090`
- MySQL defaults to `jdbc:mysql://localhost:3306/project`, user `root`, password `root`

**Environment overrides** (recommended for Docker):
- `SPRING_DATASOURCE_URL` (e.g., `jdbc:mysql://mysql:3306/project`)
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- Optionally: `SPRING_DATA_MONGODB_URI` if you wire MongoDB in code

> ⚠️ **CORS**: Controllers use `@CrossOrigin(origins = "http://localhost:3000")` in places. If you serve the frontend from a different host/port, update allowed origins or use a reverse proxy.

### Build & Run locally
```bash
cd data-query-tool
./mvnw spring-boot:run
# or
./mvnw -DskipTests package && java -jar target/*.jar
```

### Docker (backend)
Use the Dockerfile below (provided separately as `data-query-tool.Dockerfile`).

Build:
```bash
docker build -f data-query-tool.Dockerfile -t query-tool-backend:latest .
```

Run (example against a containerized MySQL named `mysql`):
```bash
docker run --rm -p 9090:9090   -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/project   -e SPRING_DATASOURCE_USERNAME=root   -e SPRING_DATASOURCE_PASSWORD=root   --network your-net   query-tool-backend:latest
```

---

## 2) Kafka helper service – `kafka`

**Purpose**: Accepts REST requests and publishes messages to Kafka topics (see `KafkaController`, `KafkaService`).

**Defaults**:
- Server port: **8080** (Spring default)
- The service expects a reachable Kafka cluster via the `bootstrapServers` you pass in request payloads.

### Build & Run locally
```bash
cd kafka
./mvnw spring-boot:run
# or
./mvnw -DskipTests package && java -jar target/*.jar
```

### Docker (kafka helper)
Use `kafka-service.Dockerfile` provided here.

Build:
```bash
docker build -f kafka-service.Dockerfile -t query-tool-kafka:latest .
```

Run:
```bash
docker run --rm -p 8080:8080 query-tool-kafka:latest
```

> Note: You still need a Kafka cluster (e.g., Confluent Platform or `bitnami/kafka`) reachable at the `bootstrap.servers` you send in your API call.

---

## 3) Frontend (React) – `frontend`

The UI points to hardcoded API URLs like `http://localhost:9090/...` and `http://localhost:8080/...` inside multiple components.

### Development mode
```bash
cd frontend
npm install
npm start
# Dev server runs on http://localhost:3000
```

### Production build
```bash
cd frontend
npm ci
npm run build
# serves static files from build/
```

> ⚠️ **Important for Docker**: Because the code uses **absolute URLs** (`http://localhost:9090`, `http://localhost:8080`), running the frontend **inside Docker** will not work unless you:
> 1) Update those URLs to be **relative** (e.g., `/api/...`) and place a reverse proxy in front, **or**
> 2) Replace hardcoded URLs with `process.env.REACT_APP_API_BASE` style config and pass it at build time, **or**
> 3) Use `host.docker.internal` (macOS/Windows) with care, and ensure backends are bound appropriately.
>
> For this reason, I’ve provided a frontend Dockerfile (for static serving via Nginx), but you may need to refactor URLs to use environment variables or a proxy for a seamless containerized setup.

---

## Optional: docker‑compose (sketch)
Below is a **starting point** if you want to orchestrate MySQL and the two backend services. You’ll still need a Kafka broker if you intend to test Kafka flows.

```yaml
version: "3.9"
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: project
      MYSQL_ROOT_PASSWORD: root
    ports: ["3306:3306"]
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -proot || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10

  backend:
    build:
      context: .
      dockerfile: data-query-tool.Dockerfile
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/project
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root
    depends_on:
      - mysql
    ports: ["9090:9090"]

  kafka-helper:
    build:
      context: .
      dockerfile: kafka-service.Dockerfile
    ports: ["8080:8080"]
    # You still need to run/provide a Kafka broker the service can reach.
```

---

## Troubleshooting
- **CORS errors**: Serve frontend & backend from same origin via a reverse proxy, or widen `@CrossOrigin` origins for your deployment.
- **SQL permissions**: Ensure the MySQL user has rights on the `project` DB.
- **Kafka connectivity**: Verify `bootstrap.servers` is reachable from the container.
- **Frontend calls failing from a container**: Replace hardcoded `http://localhost:...` with environment‑driven base URLs.

---

## Security Notes
- SQL execution endpoint allows `SELECT/INSERT/UPDATE/DELETE/CREATE`. Ensure this is guarded with proper authentication/authorization before exposing publicly.
- Prefer **parameterized queries** or stored procedures for user inputs to mitigate SQL injection.
- Manage secrets via environment variables or secret stores; do **not** commit credentials.

---

## License
Internal / private project. Add a license if required.
