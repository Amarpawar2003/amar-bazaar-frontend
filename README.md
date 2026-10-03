# Amar Bazaar — Multi-Vendor E-Commerce Platform

Amar Bazaar is a full-stack multi-vendor marketplace built with React, TypeScript, Spring Boot, Spring Security, JWT, MySQL and Razorpay.

## Product scope

### Customer
- OTP-based customer authentication
- Product discovery, category browsing and search
- Product details, variants and quantity selection
- Cart and checkout
- Wishlist
- Orders, addresses and account area
- Reviews and ratings
- Responsive desktop/tablet/mobile UI

### Seller
- Seller onboarding and OTP login
- Seller dashboard
- Product management
- Orders and order-status management
- Payments/transactions
- Seller profile and reporting

### Admin
- Seller management
- Coupons
- Deals
- Home-page merchandising
- Category management
- Admin account

## Tech stack

**Frontend:** React 19, TypeScript, React Router, Redux Toolkit, Material UI, Tailwind CSS, Axios

**Backend:** Java 17, Spring Boot, Spring Security, JWT, Spring Data JPA, MySQL, Java Mail

**Payments:** Razorpay (configuration required)

## Local setup

### 1. Backend

Create a MySQL database named `yt_ecommerce`.

Copy `.env.example` values into your environment. Do not commit real passwords, mail credentials or payment keys.

Then run:

```bash
mvn spring-boot:run
```

The API runs on `http://localhost:5454`.

If Maven is not installed, use the included Maven wrapper on Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

### 2. Frontend

Create `.env.local`:

```env
REACT_APP_API_URL=http://localhost:5454
```

Install dependencies and start:

```bash
npm install
npm start
```

Production build:

```bash
npm run build
```

## Deployment

Recommended production split:

- Frontend: AWS S3 + CloudFront, Vercel or Netlify
- Backend: AWS EC2/ECS/App Runner
- Database: AWS RDS MySQL
- Images: Cloudinary or S3
- Secrets: AWS Secrets Manager / environment variables
- HTTPS: required in production

Before deployment:
1. Set a production database URL and credentials.
2. Configure `APP_CORS_ALLOWED_ORIGINS` with the real frontend domain.
3. Configure Razorpay production credentials.
4. Configure SMTP/app-password credentials.
5. Never place secrets in React source code.
6. Build frontend with the production API URL.

## Security notes

The repository intentionally uses environment variables for database, mail and payment secrets. Rotate any credentials that were previously stored in source files.

## Project structure

```text
amar-bazaar/
├── ecommerce-react1/        # React frontend
└── ecommerce-multivendor/   # Spring Boot backend
```
