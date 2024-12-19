# مدیریت تسک

### یک api ساده برای مدیریت تسک ها

[لینک گیت‌هاب پروژه](https://github.com/reza-zanganeh/task-management)

## فهرست مطالب

- [مدیریت تسک](#مدیریت-تسک)
  - [یک api ساده برای مدیریت تسک ها](#یک-api-ساده-برای-مدیریت-تسک-ها)
  - [فهرست مطالب](#فهرست-مطالب)
  - [پیش‌نیازها](#پیشنیازها)
  - [راه‌اندازی محیط](#راهاندازی-محیط)
  - [نصب](#نصب)
  - [راه‌اندازی پایگاه داده](#راهاندازی-پایگاه-داده)
  - [اجرای سرور](#اجرای-سرور)
    - [تنظیمات برای ویندوز](#تنظیمات-برای-ویندوز)
    - [اجرای سرور](#اجرای-سرور-1)
  - [استفاده از Swagger](#استفاده-از-swagger)
  - [مسیرهای API](#مسیرهای-api)
    - [مسیرهای کاربر](#مسیرهای-کاربر)
    - [مسیرهای تسک](#مسیرهای-تسک)
    - [مستندات](#مستندات)
  - [نکات](#نکات)

---

## پیش‌نیازها

اطمینان حاصل کنید که موارد زیر روی سیستم شما نصب شده است:

- [Node.js](https://nodejs.org/) (نسخه v16.x یا جدیدتر پیشنهاد می‌شود) ([آموزش نصب Node.js](https://nodejs.org/en/download/))
- [npm](https://www.npmjs.com/) ([آموزش نصب npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))
- [PostgreSQL](https://www.postgresql.org/) ([آموزش نصب PostgreSQL](https://www.postgresql.org/download/))
- [Redis](https://redis.io/) ([آموزش نصب Redis](https://redis.io/docs/getting-started/))

---

## راه‌اندازی محیط

1. مخزن پروژه را کلون کنید:

   ```bash
   git clone https://github.com/reza-zanganeh/task-management.git
   cd task-management
   ```

2. یک فایل `.env` در دایرکتوری اصلی ایجاد کنید و مقادیر زیر را وارد کنید:

   ```env
   DATABASE_URL="postgresql://postgres:root@localhost:5432/mydb?schema=public"
   REDIS_HOST="127.0.0.1"
   REDIS_PORT="6379"
   PORT=3000
   ```

---

## نصب

وابستگی‌های مورد نیاز را نصب کنید:

```bash
npm install
```

---

## راه‌اندازی پایگاه داده

1. طرح‌واره Prisma را آماده کنید:

   ```bash
   npx prisma generate
   ```

2. مهاجرت‌ها را اجرا کنید تا ساختار پایگاه داده تنظیم شود:

   ```bash
   npx prisma migrate dev
   ```

---

## اجرای سرور

### تنظیمات برای ویندوز

1. اطمینان حاصل کنید که PostgreSQL و Redis روی ویندوز نصب و در حال اجرا هستند:

   - [آموزش نصب PostgreSQL روی ویندوز](https://www.postgresql.org/download/windows/)
   - [آموزش نصب Redis روی ویندوز](https://redis.io/docs/getting-started/installation/install-redis-on-windows/)

2. برای اجرای PostgreSQL، می‌توانید از ابزار **pgAdmin** استفاده کنید و یک پایگاه داده جدید با نام `mydb` ایجاد کنید.

3. Redis را با استفاده از کامند زیر اجرا کنید:

   ```cmd
   redis-server
   ```

4. اطمینان حاصل کنید که متغیرهای محیطی در فایل `.env` درست تنظیم شده باشند.

### اجرای سرور

سرور را در حالت توسعه اجرا کنید:

```bash
npm run dev
```

سرور روی پورتی که در فایل `.env` مشخص شده (پیش‌فرض: `http://localhost:3000`) اجرا خواهد شد.

---

## استفاده از Swagger

مستندات Swagger برای این پروژه موجود است.

1. سرور را همانطور که در بالا توضیح داده شد، اجرا کنید.
2. به صفحه مستندات Swagger در مرورگر خود بروید:

   ```
   http://localhost:3000/api-docs
   ```

---

## مسیرهای API

### مسیرهای کاربر

- **`POST /api/user/login-or-register`**

  - توضیحات: درخواست برای ورود یا ثبت نام.

- **`POST /api/user/login`**

  - توضیحات: ورود به سامانه.

- **`POST /api/user/register`**

  - توضیحات: ثبت نام در سامانه.

- **`POST /api/user/forget-password`**

  - توضیحات: فراموشی رمز عبور.

- **`POST /api/user/change-password`**
  - توضیحات: تغییر رمز عبور.

### مسیرهای تسک

- **`POST /api/task`**

  - توضیحات: ایجاد تسک جدید.

- **`GET /api/task/:id`**

  - توضیحات: مشاهده یک تسک.

- **`GET /api/task`**

  - توضیحات: مشاهده لیست تسک‌ها.

- **`PATCH /api/task/:id`**

  - توضیحات: آپدیت تسک.

- **`DELETE /api/task/:id`**
  - توضیحات: حذف تسک.

### مستندات

- **`GET /api-docs`**
  - توضیحات: مشاهده صفحه Swagger پروژه.

---

## نکات

- فایل کالکشن Postman در مخزن موجود است برای تست API‌ها. آن را در Postman ایمپورت کنید تا به‌سرعت تمامی مسیرها را تست کنید.
- اگر روی ویندوز هستید و با مشکلی مواجه شدید، اطمینان حاصل کنید که Redis و PostgreSQL به درستی اجرا شده باشند و از ابزارهایی مانند **pgAdmin** و **Redis Desktop Manager** برای مدیریت استفاده کنید.
