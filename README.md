# Import and Export Goods Entrusted System (Backend) 🚢

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Code Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)

### Technologies
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)


A robust backend system for managing import and export goods entrusted operations, developed by the ASE-UIT team 5. This system provides a comprehensive API for handling logistics, inventory tracking, and customs documentation.

## 🌟 Features

- **Secure Authentication & Authorization**
  - Role-based access control
  - Secure password hashing

- **Core Functionalities**
  - Import/Export documentation management
  - Customs declaration processing
  - Partner management
  - Billing and invoicing

- **Technical Highlights**
  - RESTful API architecture
  - Prisma ORM for type-safe database operations
  - Automated backup system
  - Comprehensive logging
  - Rate limiting and request throttling

## 📋 Prerequisites

- Node.js (v14.0.0 or higher)
- PostgreSQL (v12.0 or higher)
- Redis (v6.0 or higher)
- Docker (optional)


1. **Clone the repository**
```bash
git clone https://github.com/ASE-UIT/05.-Import-and-Export-Goods-Entrusted-System-BackEnd.git
cd 05.-Import-and-Export-Goods-Entrusted-System-BackEnd
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up Prisma**
```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

## 🐳 Docker Setup (make sure you already have Docker)

```bash
# Build and run with Docker Compose
npm run docker:dev
```

## 📊 Database Schema

We use Prisma as our ORM. The database schema is defined in `prisma/schema.prisma`.

## 📚 API Documentation

API documentation is available at `/api/documents` after starting the server. We use Swagger UI for API documentation.

## 🔒 Environment Variables

Required environment variables: Follow the .env.example file

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run Prisma-specific tests
npm run test:prisma
```

## 📈 Performance Monitoring

The system includes built-in performance monitoring with:
- Response time tracking
- Request rate monitoring
- Error rate tracking
- Resource usage statistics
- Prisma query performance metrics

## 🛠 Database Management

```bash
# Generate Prisma Client
npx prisma generate

# Create a migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma reset

# View database in Prisma Studio
npx prisma studio
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Project Supervisor**: TS. Nguyen Trinh Dong [Trinh-Dong](https://github.com/Trinh-Dong-Nguyen)
- **Lead Developer**: Ngo Duc Loc [@VaderNgo](https://github.com/VaderNgo)
- **Contributors**: 

| Name | GitHub |
|------|--------|
| Nguyen Thai Dang Khoa | [@NTDKhoa04](https://github.com/NTDKhoa04) |
| Truong Tuan Huy | [@trapper268](https://github.com/trapper268) |
| Truong Minh Khoi | [@Khoinese204](https://github.com/Khoinese204) |
| Pham Le Khoa | [@khoaphamlee](https://github.com/khoaphamlee) |


