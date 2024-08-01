# Chatster

Simple chat app with React.js and Express.js

## Get Started

Build the image and start the containers:

### Development

```bash
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up --build -d
```

### Production

```bash
docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up --build -d
```

On first use, prepare database by setting up prisma migrations:

```bash
docker exec -it chatster-server npx prisma migrate dev --name init
```
