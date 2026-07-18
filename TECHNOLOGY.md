# Andromeda - AI Development Context

## Project Overview

Andromeda, TanStack Start (SSR) üzerine kurulmuş modern bir bankacılık web uygulamasıdır. TypeScript-first geliştirme yaklaşımı, Mantine UI bileşen kütüphanesi ve yeşil/beyaz renk paletiyle tasarlanmıştır. Tüm arayüz metinleri Türkçe'dir.

Giriş bilgileri: `admin / admin123`

## Technology Stack

### Core Framework

- **React 19** - Concurrent features ile UI library
- **TypeScript 6** - Strongly typed JavaScript superset
- **Vite 8** - Lightning-fast build tool and dev server

### Routing & Navigation

- **TanStack Router** - File-based routing ile type-safe navigasyon
- **TanStack Start** - Full-stack React framework (SSR desteği)
- **beforeLoad** - Route guard (auth kontrolü)
- **useNavigate** - SPA navigasyonu (window.location.href yerine)

### State Management & Data Fetching

- **TanStack Query** - Server state yönetimi, caching, optimistic updates
- **TanStack React Form** - Form state management
- **TanStack React Table** - Headless table library (data grids)
- **@tanstack/react-virtual** - Virtualization (büyük tablolarda performans)

### Styling

- **TailwindCSS 4** - Utility-first CSS framework
- **@tailwindcss/typography** - Typography plugin

### Validation

- **Zod 4** - TypeScript-first schema validation

### UI Components

- **Mantine UI v9** - Full-featured React component library
  - `@mantine/core` - Core UI (Button, Modal, Table, Tabs, Switch, Badge vb.)
  - `@mantine/hooks` - Custom React hooks
  - `@mantine/form` - Form state management with validation
  - `@mantine/modals` - Modal management
  - `@mantine/notifications` - Toast notifications
  - `@mantine/charts` - Chart components (AreaChart, BarChart, DonutChart)
  - `@mantine/dates` - DatePicker components
- **Lucide React** - Icon library

### Testing

- **Vitest** - Vite-native testing framework
- **@testing-library/react** - React component testing
- **jsdom** - JavaScript DOM implementation

### Code Quality

- **ESLint 9** - Code linting
- **Prettier** - Code formatting
- **@tanstack/eslint-config** - TanStack-specific lint rules

### Utilities

- **@faker-js/faker** - Mock data generation
- **@tanstack/match-sorter-utils** - Fuzzy sorting/filtering
- **dayjs** - Date manipulation

## Project Structure

```
src/
├── routes/                    # File-based routing (TanStack Router)
│   ├── __root.tsx             # Root layout, MantineProvider, QueryProvider
│   ├── routeTree.gen.ts       # Auto-generated route tree
│   ├── index.tsx              # Ana sayfa (landing)
│   ├── login.tsx              # Giriş sayfası
│   ├── dashboard.tsx          # Genel bankacılık dashboard
│   ├── dijital-bankacilik-dashboard.tsx  # Giriş denemeleri ve hata analizi
│   ├── islemler.tsx           # İşlem geçmişi (tablo + filtre)
│   ├── duyurular.tsx          # Duyurular (tablo + satır içi düzenleme)
│   ├── kullanicilar.tsx       # Kullanıcı işlemleri (hesap no arama + 3 tab)
│   ├── bankacilik-loglari.tsx # Dijital bankacılık logları
│   ├── kartlar.tsx            # Kredi/banka kartları yönetimi
│   ├── musteri-telefon-bilgileri.tsx  # Müşteri telefon modelleri + grafik
│   ├── ayarlar.tsx            # Hesap ve bildirim ayarları
│   ├── raporlar.tsx           # Rapor oluşturma ve dışa aktarma
│   └── kisayollar.tsx         # Kısayollar ve teknoloji bağlantıları
├── components/                # Reusable UI components
│   ├── Header.tsx             # Header (saat, profil menüsü, tema toggle)
│   ├── Footer.tsx             # Footer
│   ├── ThemeToggle.tsx        # Light/Dark theme toggle (profilde)
│   ├── NavigationDrawer.tsx   # Sol sidebar menü
│   ├── DataTable.tsx          # TanStack Table + Virtualization wrapper
│   ├── Skeleton.tsx           # Loading skeleton components (memo'd)
│   └── ErrorBoundary.tsx      # Route & root error boundaries
├── data/
│   └── mock-data.ts           # Faker-based mock data + TypeScript interfaces
├── hooks/
│   └── use-banking.ts         # TanStack Query hooks (CRUD operations)
├── lib/
│   ├── api.ts                 # Mock API service (async fonksiyonlar)
│   └── auth-guard.ts          # beforeLoad auth guard
├── integrations/
│   └── tanstack-query/        # TanStack Query provider setup
└── styles.css                 # Global styles
```

## Application Pages

### Ana Sayfa (`/`)

- Landing page with hero section and feature cards
- Quick navigation to application pages

### Giriş (`/login`)

- Kullanıcı adı ve şifre ile giriş
- Geçersiz girişlerde hata bildirimi

### Dashboard (`/dashboard`)

- 4 özet kartı (Toplam Kullanıcı, Günlük İşlemler, Toplam Gelir, Aktif Kartlar)
- İşlem Hacmi AreaChart
- Gelir Dağılımı DonutChart
- Kullanıcı Aktivitesi BarChart (şehir bazlı)
- Son İşlemler tablosu

### Dijital Bankacılık Dashboard (`/dijital-bankacilik-dashboard`)

- Toplam/BAşarılı/Hatalı giriş denemesi kartları
- Hata Kategorileri Dağılımı DonutChart (7 kategori)
- Cihaz Bazlı Giriş Denemeleri BarChart
- Hata Kategorileri Detayı (adet + yüzde)
- Son Hatalı Girişler tablosu
- Hata türleri: Yanlış Şifre, Hatalı Kullanıcı Adı, Hesap Blokeli, OTP Başarısız, Oturum Süresi Dolmuş, IP Engelli, Çok Fazla Deneme

### İşlemler (`/islemler`)

- 100 mock bankacılık işlemi
- Arama (müşteri/referans no), filtreleme (işlem tipi, durum, tarih aralığı)
- CSV dışa aktarma
- Özet kartları (toplam işlem, tutar, başarı oranı)
- TanStack Table + virtualization

### Duyurular (`/duyurular`)

- Tablo görünümü, her satır satır içi düzenlenebilir
- Başlık, içerik, durum doğrudan tabloda düzenlenir
- Yeni duyuru ekleme (satır içi)
- Silme işlemi
- TanStack Query ile CRUD (API üzerinden)

### Kullanıcı İşlemleri (`/kullanicilar`)

- Müşteri numarasına göre arama (hesap no)
- Bulunan müşteri 3 tab'lı detay görünümü:
  - **Kullanıcı Bilgileri**: Ad soyad, email, telefon, hesap no, bakiye, kayıt tarihi
  - **Güvenlik Bilgileri**: Son giriş tarihi/IP/cihaz, 2FA durumu, şifre güncelleme
  - **Güvenlik Ayarları**: 2FA aç/kapat, şifre sıfırla, hesap dondur, oturum kapat
- Arama yapılmazsa tüm müşteriler kart grid'i olarak gösterilir

### Dijital Bankacılık Logları (`/bankacilik-loglari`)

- 50 mock banking transaction log
- 9 sütun: Müşteri Adı, İşlem Tipi, Tutar, Tarih, Durum, IP Adresi, Cihaz, Konum, Referans No
- Arama, sayfalama (10 kayıt/sayfa)
- TanStack Table + virtualization

### Kartlarım (`/kartlar`)

- Kredi/banka kartları görsel tasarım (Visa/MC/Troy)
- Kullanım progress bar'ları
- Kart blokajı aç/kapat
- Detay modal'ı

### Müşteri Telefon Bilgileri (`/musteri-telefon-bilgileri`)

- 20 telefon modeli (Samsung, Apple, Xiaomi, Huawei, Google, Oppo, OnePlus, Nokia)
- BarChart: En çok kullanılan 10 model
- Marka dağılımı paneli (adet + yüzde)
- Arama + sıralı tablo

### Ayarlar (`/ayarlar`)

- Profil formu, bildirim toggle'ları, güvenlik ayarları

### Raporlar (`/raporlar`)

- 4 rapor türü: İşlem, Kullanıcı, Gelir, Şube
- Tarih filtresi, durum filtresi
- CSV indirme, yazdırma
- Özet kartları + dinamik tablo

### Kısayollar (`/kisayollar`)

- Teknoloji bağlantıları ve kısayollar

## Data Layer

### Mock API (`src/lib/api.ts`)

Tüm veriler simüle edilmiş async API üzerinden yönetilir:

- `api.duyurular` - CRUD (list, create, update, delete)
- `api.kullanicilar` - CRUD (list, update, delete)
- `api.bankacilikLoglari` - List
- `api.krediKartlari` - List
- `api.loginKayitlari` - List
- `api.telefonModelleri` - List

Her endpoint 200-400ms gecikme ile çalışır.

### TanStack Query Hooks (`src/hooks/use-banking.ts`)

- `useDuyurular()`, `useDuyuruCreate()`, `useDuyuruUpdate()`, `useDuyuruDelete()`
- `useKullanicilar()`, `useKullaniciUpdate()`, `useKullaniciDelete()`
- `useBankacilikLoglari()`
- `useKrediKartlari()`
- `useLoginKayitlari()`
- `useTelefonModelleri()`

### Route Guards (`src/lib/auth-guard.ts`)

- `beforeLoad` hook ile auth kontrolü
- `checkAuth()` fonksiyonu localStorage'dan token kontrolü
- Geçersiz token → `/login` sayfasına redirect

## Development Commands

```bash
pnpm dev              # Start development server (port 3000)
pnpm build            # Production build
pnpm test             # Run tests with Vitest
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm generate-routes  # Generate route tree (yeni route eklendikten sonra)
```

## Performance Optimizations (Faz 5)

- **@tanstack/react-virtual** — 50+ satırlı tablolarda sadece görünür satırlar renderlanır
- **React.memo** — DataTable, Skeleton bileşenleri sarılı
- **useCallback** — Event handler'lar referans sabitliği için sarılı
- **useMemo** — Filtreleme, hesaplama ve transformasyonlar memoize edilmiş
- **TanStack Query cache** — API verileri otomatik cache'lenir, invalidation ile güncellenir

## AI Assistant Guidelines

### When Working With This Project:

1. **Type Safety First** — Her zaman TypeScript interface kullan
2. **Component Patterns** — Functional components + hooks, mevcut yapıyı takip et
3. **Data Fetching** — Manuel useEffect yerine TanStack Query hook'ları kullan
4. **Routing** — File-based routing, `useNavigate` ile SPA navigasyonu
5. **Performance** — `useMemo`/`useCallback`/`React.memo` kullan, büyük listelerde virtualization ekle
6. **Mantine UI** — Form için `@mantine/form`, bildirim için `@mantine/notifications`
7. **Renk Paleti** — Yeşil/beyaz tema (`primaryColor: 'green'`)
8. **Türkçe** — Tüm UI metinleri Türkçe olmalı
9. **Route Guard** — Korumalı sayfalara `protectedRouteOptions` ekle
10. **Error Handling** — Her route'a `errorComponent`, `pendingComponent` ekle

### Code Conventions:

- Interface > type (mümkün oldukça)
- Named exports tercih et
- Mevcut naming conventions'u takip et
- Form validasyonu için Mantine `useForm` kullan
- Bildirimler için Mantine `notifications` kullan
- Yeni route ekledikten sonra `pnpm generate-routes` çalıştır
- Mock data için `src/data/mock-data.ts` dosyasını güncelle
- API endpoint'i için `src/lib/api.ts` ve hook için `src/hooks/use-banking.ts` güncelle
