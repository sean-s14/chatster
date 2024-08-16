# Chatster

Simple chat app with React.js and Express.js

## Get Started

Build the image and start the containers:

### Development

The following command will start the client, server, and postgres services in development mode.

```bash
./start-local-docker.sh
```

This uses the following files:

- `docker-compose.yaml` providing the base services for client, server, and database.
- `docker-compose.dev.yaml` providing the development environment variables for client and server
- `docker-compose.dev.local` providing the volumes, both named and unnamed, for client, server, and database

You can stop the docker services with the below command.

```bash
./stop-local-docker.sh
```

### Production

The following command will start the client, server, and postgres services in production mode.

```bash
docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up --build -d
```

> [!NOTE] On first use, either in development or production, prepare the database by applying prisma migrations
>
> ```bash
> docker exec -it chatster-server npx prisma migrate dev --name init
> ```
