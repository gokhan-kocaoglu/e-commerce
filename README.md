# E-Commerce Platformu (React + Vite + Spring Boot)

Modern, ölçeklenebilir ve tamamen responsive bir **E-Commerce** platformu.  
Frontend tarafında **Vite + React + TailwindCSS + Redux & Thunk + React Router v5**,  
backend tarafında **Spring Boot + JPA/Hibernate + PostgreSQL** kullanıyor.

Bu repo; güçlü bir frontend tasarım yapısı ile, ileride kolayca entegre edilebilecek
kurumsal seviyede bir backend mimarisini aynı çatı altında toplamak için tasarlanmıştır.

---

## Özellikler

**Frontend / UI**

- 🎨 **Pixel-perfect** tasarımlar (Montserrat tipografi, sabit renk paleti, Figma benzeri layout’lar)
- 💡 Tamamen **data-driven** yapıda sayfa bileşenleri:
  - `siteConfig`, `cta`, `aboutData`, `team`, `pricing`, `editors` gibi data modülleri
- 📱 **Mobile-first & Responsive** tasarım (Tailwind breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`)
- 🧭 Çok seviyeli navigasyon, **header + announcement bar + social links** yapısı
- 🛍️ **Home** sayfasında:
  - Hero slider
  - Editor’s pick bölümlü kategori kartları
  - Best sellers vitrinleri
  - Kampanya slider’ı
  - CTA (Call to Action) bölümü
  - Featured blog / içerik kartları
- 👥 **About / Team / Pricing / Contact** gibi statik ama ileride backend’e bağlanabilir sayfalar
- 🔔 Kullanıcı aksiyonları için **React Toastify** ile bildirim yapısı

**Backend / İş Kuralları**

- 🔐 **JWT + Refresh Token** tabanlı authentication
- 👤 Kullanıcı / Rol / Yetki yönetimi (Role-based authorization)
- 🧾 Gelişmiş ürün & sipariş modeli:
  - Ürün, kategori, marka, varyant, stok, sepet, sipariş, kupon vb.
- ⭐ **Product Rating & Bestseller Mimarisi**
  - Kullanıcı başına tek oy
  - `ProductRating` ve `ProductMetrics` ile rating ortalaması, satış adedi, bestseller skoru
- 📣 İçerik & marketing modülleri:
  - Duyurular (announcement)
  - Campaign / Collections
  - Editor’s pick & home slider verileri
- 🧹 **Soft delete**, audit alanları, indeksler ve benzersizlik kısıtları

---

## Teknoloji Stack

**Frontend**

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [React Router v5](https://v5.reactrouter.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/) + **Redux Thunk**
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)
- [lucide-react](https://lucide.dev/guide/packages/lucide-react) (icon kütüphanesi)
- **Cypress** (E2E testler için altyapı)

**Backend**

- Java 17+
- Spring Boot
- Spring Security + JWT
- Spring Data JPA (Hibernate)
- PostgreSQL
- MapStruct
- Bean Validation (Jakarta Validation)
- Maven
- Backend GitHub Link: https://github.com/gokhan-kocaoglu/e-commerce-backend

---

## English Version

### E-Commerce Platform (React + Vite + Spring Boot)

A modern, scalable and fully responsive **E-Commerce** platform.  
The frontend is built with **Vite + React + TailwindCSS + Redux & Thunk + React Router v5**,  
and the backend uses **Spring Boot + JPA/Hibernate + PostgreSQL**.

This repository combines a strong frontend design system with a backend architecture
that can easily evolve into a production-grade solution.

---

### Features

**Frontend / UI**

- 🎨 **Pixel-perfect** layouts (Montserrat typography, fixed color palette, Figma-like layouts)
- 💡 Fully **data-driven** page components:
  - Data modules such as `siteConfig`, `cta`, `aboutData`, `team`, `pricing`, `editors`
- 📱 **Mobile-first & Responsive** design (Tailwind breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`)
- 🧭 Multi-level navigation with **header + announcement bar + social links**
- 🛍️ On the **Home** page:
  - Hero slider
  - Editor’s pick category cards
  - Best sellers section
  - Campaign / promo slider
  - CTA (Call to Action) section
  - Featured blog / content cards
- 👥 **About / Team / Pricing / Contact** pages are currently static but designed
  to be easily connected to the backend later
- 🔔 User interactions and feedback via **React Toastify**

**Backend / Business Logic**

- 🔐 **JWT + Refresh Token** based authentication
- 👤 User / Role / Permission management (role-based authorization)
- 🧾 Advanced product & order model:
  - Product, category, brand, variant, inventory, cart, order, coupon, etc.
- ⭐ **Product Rating & Bestseller Architecture**
  - One rating per user per product
  - `ProductRating` and `ProductMetrics` aggregate rating average, rating count,
    total sold quantity and bestseller score
- 📣 Content & marketing modules:
  - Announcements
  - Campaigns / Collections
  - Editor’s pick & home slider data
- 🧹 **Soft delete**, audit fields, indexes and uniqueness constraints

---

### Technology Stack

**Frontend**

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [React Router v5](https://v5.reactrouter.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/) + **Redux Thunk**
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)
- [lucide-react](https://lucide.dev/guide/packages/lucide-react) (icon library)
- **Cypress** (E2E testing infrastructure)

**Backend**

- Java 17+
- Spring Boot
- Spring Security + JWT
- Spring Data JPA (Hibernate)
- PostgreSQL
- MapStruct
- Bean Validation (Jakarta Validation)
- Maven
- Backend GitHub Repository: https://github.com/gokhan-kocaoglu/e-commerce-backend
