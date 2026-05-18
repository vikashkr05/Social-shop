# Social Shop

A social commerce platform where users share and discover shoppable product links. Users follow each other, post product links with captions, and get a personalized feed — built with a Spring Boot backend and Next.js frontend.

## Tech Stack

**Backend**
- Java 21 + Spring Boot 3.3
- PostgreSQL 16 — primary database (Flyway migrations)
- Redis 7 — feed cache (sorted sets)
- Apache Kafka — async feed fan-out on post creation
- Spring Security + JWT — stateless authentication
- Jsoup — product link metadata extraction

**Frontend**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Zustand — auth & UI state

**Infrastructure**
- Docker + Docker Compose — single-command local setup

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Run with Docker

```bash
git clone https://github.com/vikashkr05/Social-shop.git
cd Social-shop
docker compose up --build
```

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:3000  |
| Backend  | http://localhost:8080  |
| Postgres | localhost:5432         |
| Redis    | localhost:6379         |
| Kafka    | localhost:9092         |

The first build takes a few minutes (Maven downloads dependencies, Docker pulls base images). Subsequent starts are fast:

```bash
docker compose up
```

### Run Locally (without Docker)

**Backend** — requires Java 21, Maven, PostgreSQL, Redis, Kafka running locally:

```bash
cd backend
mvn spring-boot:run
```

**Frontend** — requires Node.js 22+:

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

## Environment Variables

### Backend (`docker-compose.yml` or `application.yml`)

| Variable | Default | Description |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/socialcommerce` | PostgreSQL connection URL |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | DB username |
| `SPRING_DATASOURCE_PASSWORD` | `postgres` | DB password |
| `SPRING_DATA_REDIS_HOST` | `localhost` | Redis host |
| `SPRING_DATA_REDIS_PORT` | `6379` | Redis port |
| `SPRING_KAFKA_BOOTSTRAP_SERVERS` | `localhost:9092` | Kafka brokers |
| `JWT_SECRET` | dev default | Must be 32+ chars — **change in production** |
| `APP_AFFILIATE_TAG` | `projectcart-20` | Amazon affiliate tag appended to product URLs |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | Allowed CORS origins |

### Frontend (`.env.local`)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Backend API base URL |
| `NEXT_PUBLIC_AFFILIATE_TAG` | `projectcart-20` | Affiliate tag for display |

## API Reference

### Auth — `/api/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Create account |
| POST | `/login` | Login, returns JWT |
| GET | `/me` | Get current user |

### Posts — `/api/posts`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create a post with a product URL |
| DELETE | `/{postId}` | Delete a post |
| POST | `/{postId}/like` | Like a post |
| DELETE | `/{postId}/like` | Unlike a post |
| POST | `/{postId}/save` | Save a post |
| DELETE | `/{postId}/save` | Unsave a post |

### Feed — `/api/feed`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get personalized feed (cursor-paginated) |

### Users — `/api/users`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/{username}` | Get user profile |
| GET | `/{username}/posts` | Get user's posts |
| GET | `/{username}/followers` | List followers |
| GET | `/{username}/following` | List following |

### Social Graph — `/api/social`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/follow/{userId}` | Follow a user |
| DELETE | `/unfollow/{userId}` | Unfollow a user |
| GET | `/is-following/{userId}` | Check follow status |

### Links — `/api/links`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/extract` | Extract metadata from a product URL |

## Architecture

```
Browser
  └── Next.js (port 3000)
        └── Spring Boot API (port 8080)
              ├── PostgreSQL  — users, posts, products, likes, saves, follows
              ├── Redis       — per-user feed (sorted set, max 800 entries)
              └── Kafka       — post-created events → async feed fan-out
```

When a user creates a post:
1. Post is saved to PostgreSQL
2. A `PostCreatedEvent` is published to Kafka
3. `FeedEventConsumer` fans the post out to all followers' Redis feed keys

## Database Schema

```
users       — id, username, email, password_hash, bio, avatar_url
products    — id, original_url, title, image_url, price_snapshot, site_name
posts       — id, user_id, product_id, caption, like_count, save_count
follows     — follower_id, following_id  (composite PK)
likes       — user_id, post_id           (composite PK)
saves       — user_id, post_id           (composite PK)
```

## Stopping the Stack

```bash
docker compose down          # stop containers
docker compose down -v       # stop and delete volumes (wipes DB data)
```
