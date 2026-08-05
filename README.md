```markdown
<div align="center">

# 🚀 GearUp
### Equipment Rental Marketplace Platform

<p align="center">
  <strong>Rent. Share. Explore.</strong><br/>
  A modern full-stack equipment rental marketplace built with Next.js, Express.js, Prisma, PostgreSQL, and Stripe.
</p>

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwind-css)

</p>

---

## 📖 About

**GearUp** is a modern **Equipment Rental Marketplace** where people can rent cameras, camping gear, photography equipment, drones, audio devices, and many other items.

The platform connects **Customers** with **Providers**, while **Administrators** manage the entire marketplace.

It provides secure authentication, online payments, booking management, inventory management, reviews, analytics, and moderation.

---

# ✨ Features

## 👤 Customer

- Browse rental equipment
- Advanced Search & Filtering
- Category browsing
- Booking System
- Stripe Checkout
- Rental History
- Leave Reviews
- Update Profile
- Payment History

---

## 📦 Provider

- Dashboard
- Add New Equipment
- Update Equipment
- Delete Equipment
- Inventory Management
- Incoming Rental Requests
- Confirm Rentals
- Mark Picked Up
- Complete Rentals
- Earnings Overview

---

## 👑 Admin

- Dashboard Analytics
- User Management
- Suspend / Activate Users
- Category Management
- View All Gear
- Content Moderation
- View All Rental Orders
- Platform Statistics
- Manage Providers
- Manage Customers

---

# 🛠 Tech Stack

## Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Hook Form
- Zod
- Sonner
- Lucide Icons

---

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Bcrypt
- Multer
- Cloudinary
- Stripe

---

## Database

- PostgreSQL
- Prisma ORM

---

# 🔐 Authentication

- Register
- Login
- JWT Access Token
- Refresh Token
- Role Based Authorization
- Protected Routes

Roles

- Customer
- Provider
- Admin

---

# 📦 Core Modules

## Equipment

- Create Gear
- Update Gear
- Delete Gear
- Upload Multiple Images
- Categories
- Brands
- Availability
- Inventory

---

## Rental

- Place Rental Order
- Stripe Payment
- Confirm Order
- Pick Up
- Complete Rental
- Rental History

---

## Review

- One Review Per Rental Item
- Star Rating
- Comments
- Average Rating
- Review Count

---

## Payment

- Stripe Checkout
- Payment Verification
- Payment Status
- Payment History

---

# 🔎 Search & Filtering

Supports

- Search
- Category Filter
- Brand Filter
- Availability
- Price Range
- Pagination
- Sorting

---

# 📊 Dashboard

### Customer Dashboard

- My Rentals
- My Payments
- Leave Reviews
- Profile

---

### Provider Dashboard

- Inventory
- Incoming Rentals
- Earnings
- Reviews

---

### Admin Dashboard

- Analytics
- Users
- Rentals
- Categories
- Gear Listings

---

# 📁 Folder Structure

```

gearup
│
├── client
│   ├── app
│   ├── components
│   ├── actions
│   ├── hooks
│   ├── lib
│   └── providers
│
├── server
│   ├── modules
│   ├── middleware
│   ├── routes
│   ├── prisma
│   ├── utils
│   └── config
│
└── README.md

````

---

# ⚙️ Environment Variables

Backend

```env
DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
````

Frontend

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

# 🚀 Installation

Clone Repository

```bash
git clone https://github.com/yeasin-riyad/GearUp-Frontend.git
```

Backend

```bash
cd server

npm install

npx prisma migrate dev

npm run dev
```

Frontend

```bash
cd client

npm install

npm run dev
```

---

# 📡 REST API

Authentication

```
POST /auth/register

POST /auth/login

POST /auth/logout

POST /auth/refresh-token
```

Equipment

```
GET /gear

GET /gear/:id

POST /gear

PATCH /gear/:id

DELETE /gear/:id
```

Rentals

```
GET /rentals

POST /rentals

PATCH /rentals/:id/confirm

PATCH /rentals/:id/pick-up

PATCH /rentals/:id/complete
```

Reviews

```
POST /reviews

GET /reviews

PATCH /reviews/:id

DELETE /reviews/:id
```

Admin

```
GET /admin/users

PATCH /admin/users/:id/status

GET /admin/rentals

GET /admin/gears
```

---

# 💳 Stripe Payment Flow

Customer

↓

Checkout

↓

Stripe

↓

Webhook

↓

Payment Success

↓

Rental Confirmed

---

# 🌍 Deployment

Frontend

* Vercel

Backend

* Render

Database

* PostgreSQL

Image Storage

* Cloudinary

Payments

* Stripe

---

# 🎯 Future Improvements

* Wishlist
* Notifications
* Email Verification
* Chat System
* Coupons
* GPS Pickup
* AI Recommendations
* Multi-language Support
* Progressive Web App

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create a new branch

3. Commit your changes

4. Push the branch

5. Open a Pull Request

---


---

# 👨‍💻 Author

**Md. Yeasin Mazumder**

Backend Developer

LinkedIn:
https://www.linkedin.com/in/mdyeasinmazumder

Portfolio:
https://riyad-dev-i3aj.vercel.app/

Email:
[mazumderyeasin98@gmail.com](mailto:mazumderyeasin98@gmail.com)

---

<div align="center">

### ⭐ If you like this project, don't forget to star the repository!

Made with ❤️ using Next.js, Express.js & Prisma.

</div>
```
