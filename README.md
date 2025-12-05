# E-Commerce Platformu (React + Vite + Spring Boot)

Modern, ölçeklenebilir ve tamamen responsive bir **E-Commerce** platformu.  
Frontend tarafında **Vite + React + TailwindCSS + Redux & Thunk + React Router v5**,  
backend tarafında **Spring Boot + JPA/Hibernate + PostgreSQL** kullanıyor.

Bu repo; güçlü bir frontend tasarım yapısı ile, ileride kolayca entegre edilebilecek
kurumsal seviyede bir backend mimarisini aynı çatı altında toplamak için tasarlanmıştır.

---

## İçindekiler

- [Özellikler](#özellikler)
- [Teknoloji Stack](#teknoloji-stack)
- [Proje Yapısı](#proje-yapısı)
- [Frontend](#frontend)
  - [Başlıca Sayfalar & Bileşenler](#başlıca-sayfalar--bileşenler)
  - [Veri Katmanı (data.js)](#veri-katmanı-datajs)
  - [Durum Yönetimi & HTTP Katmanı](#durum-yönetimi--http-katmanı)
  - [Kurulum & Çalıştırma](#kurulum--çalıştırma)
- [Backend](#backend)
  - [Domain Tasarımı](#domain-tasarımı)
  - [DTO ve API Tasarımı](#dto-ve-api-tasarımı)
  - [Kurulum & Çalıştırma-backend](#kurulum--çalıştırma-backend)
- [Geliştirme Prensipleri](#geliştirme-prensipleri)
- [Gelecek Geliştirmeler](#gelecek-geliştirmeler)
- [Lisans](#lisans)

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
  - Editor’s pick bölümülü kategori kartları
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
- BackEnd github Link: https://github.com/gokhan-kocaoglu/e-commerce-backend

---
