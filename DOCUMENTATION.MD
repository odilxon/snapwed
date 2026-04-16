# 📸 SnapWed — Инструкция для Claude Code CLI

> Свадебное PWA-приложение для сбора фото от гостей

---

## 🗺️ ОБЗОР ПРОЕКТА

**Что строим:** Full-stack веб-приложение с тремя зонами:

1. **Лендинг** — продающая страница с ценниками (публичная)
2. **Десктоп-админка** — панель владельца свадьбы (веб-приложение)
3. **PWA для гостей** — мобильная страница по QR-ссылке

**Технологический стек:**

- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Backend: Supabase (PostgreSQL + Auth + Storage + Realtime)
- Хостинг: Vercel
- QR-генерация: qrcode библиотека
- Изображения: Supabase Storage + next/image

---

## 📁 СТРУКТУРА ПРОЕКТА

```
snapwed/
├── app/
│   ├── (landing)/
│   │   └── page.tsx              # Лендинг (главная страница)
│   ├── (auth)/
│   │   ├── login/page.tsx        # Вход для владельцев
│   │   └── register/page.tsx     # Регистрация
│   ├── dashboard/
│   │   ├── layout.tsx            # Десктоп-лейаут с сайдбаром
│   │   ├── page.tsx              # Главная дашборда
│   │   ├── weddings/
│   │   │   ├── page.tsx          # Список свадеб
│   │   │   ├── new/page.tsx      # Создать свадьбу
│   │   │   └── [id]/
│   │   │       ├── page.tsx      # Детали свадьбы
│   │   │       ├── invite/page.tsx    # QR и настройки приглашения
│   │   │       └── gallery/page.tsx   # Галерея фото
│   │   └── settings/page.tsx     # Настройки аккаунта
│   ├── w/
│   │   └── [weddingSlug]/
│   │       ├── page.tsx          # Страница гостя (PWA)
│   │       ├── tasks/page.tsx    # Задания для фото
│   │       └── upload/page.tsx   # Загрузка фото
│   └── api/
│       ├── weddings/route.ts
│       ├── photos/route.ts
│       └── qr/route.ts
├── components/
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Features.tsx
│   │   ├── Pricing.tsx
│   │   ├── Testimonials.tsx
│   │   └── Footer.tsx
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   ├── WeddingCard.tsx
│   │   ├── PhotoGrid.tsx
│   │   ├── QRDisplay.tsx
│   │   └── StatsBar.tsx
│   └── guest/
│       ├── TaskList.tsx
│       ├── CameraCapture.tsx
│       ├── UploadProgress.tsx
│       └── LiveGallery.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts
│   └── utils.ts
├── public/
│   ├── manifest.json             # PWA манифест
│   └── sw.js                     # Service Worker
└── supabase/
    └── migrations/
        └── 001_initial.sql
```

---

## 🗄️ ШАГ 1: БАЗА ДАННЫХ (Supabase)

### Создай проект в Supabase и выполни SQL:

```sql
-- Владельцы свадеб (расширяем auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  plan TEXT DEFAULT 'free', -- free | starter | premium
  weddings_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Свадьбы
CREATE TABLE weddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,                        -- "Свадьба Алии и Тимура"
  slug TEXT UNIQUE NOT NULL,                  -- "aliya-timur-2025" (для URL)
  date DATE NOT NULL,
  venue TEXT,                                 -- Место проведения
  greeting_text TEXT,                         -- Текст приглашения для гостей
  tasks JSONB DEFAULT '[]',                   -- Список заданий для фото
  cover_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  max_photos_per_guest INTEGER DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Сессии гостей
CREATE TABLE guest_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
  guest_name TEXT,
  photos_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Фотографии
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
  guest_session_id UUID REFERENCES guest_sessions(id),
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,
  task_id TEXT,                               -- ID выполненного задания
  is_approved BOOLEAN DEFAULT true,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для скорости
CREATE INDEX idx_photos_wedding_id ON photos(wedding_id);
CREATE INDEX idx_weddings_slug ON weddings(slug);
CREATE INDEX idx_weddings_owner ON weddings(owner_id);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_sessions ENABLE ROW LEVEL SECURITY;

-- Политики доступа
CREATE POLICY "Users own their profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users manage their weddings" ON weddings
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Anyone can view active wedding" ON weddings
  FOR SELECT USING (is_active = true);

CREATE POLICY "Guests can add photos" ON photos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Owners view their photos" ON photos
  FOR SELECT USING (
    wedding_id IN (SELECT id FROM weddings WHERE owner_id = auth.uid())
  );

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true);
```

---

## 🚀 ШАГ 2: ИНИЦИАЛИЗАЦИЯ ПРОЕКТА

```bash
# Создай проект
npx create-next-app@latest snapwed \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir false \
  --import-alias "@/*"

cd snapwed

# Установи зависимости
npm install \
  @supabase/supabase-js \
  @supabase/ssr \
  qrcode \
  qrcode.react \
  @types/qrcode \
  lucide-react \
  date-fns \
  react-dropzone \
  framer-motion \
  clsx \
  tailwind-merge

# Dev зависимости
npm install -D \
  @supabase/supabase-js \
  prettier \
  prettier-plugin-tailwindcss
```

---

## 🎨 ШАГ 3: ДИЗАЙН И СТИЛИ

### Цветовая палитра

**Для лендинга:** Элегантный, романтичный стиль

- Цвет фона: `#0D0A0B` (глубокий чёрный)
- Акцент 1: `#D4A853` (золотой)
- Акцент 2: `#C7816A` (пыльная роза)
- Текст: `#F5F0EB` (тёплый белый)
- Карточки: `#1A1518` (тёмно-серый с розовым)

**Для гостевой PWA:** Лёгкий, воздушный, мобильный

- Фон: `#FFFBF8` (тёплый белый)
- Акцент: `#D4875A` (персиковый)
- CTA кнопки: `#2D1B1B` (тёмно-коричневый)
- Прогресс: градиент золото → роза

**Для админки:** Чистый, профессиональный, десктопный

- Сайдбар: `#1C1917` (тёмный)
- Основной фон: `#F8F7F4` (светло-серый)
- Акцент: `#D4A853` (золото)

### tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                gold: {
                    50: "#FDF8EC",
                    100: "#F9EDCA",
                    400: "#D4A853",
                    600: "#A07C2E",
                    900: "#3D2F0F",
                },
                rose: {
                    warm: "#C7816A",
                    pale: "#F5E8E4",
                },
                dark: {
                    bg: "#0D0A0B",
                    card: "#1A1518",
                    sidebar: "#1C1917",
                },
            },
            fontFamily: {
                serif: ["Cormorant Garamond", "serif"], // Заголовки (элегантность)
                sans: ["DM Sans", "sans-serif"], // Основной текст
                display: ["Playfair Display", "serif"], // Большие заголовки лендинга
            },
            animation: {
                "fade-up": "fadeUp 0.6s ease-out forwards",
                shimmer: "shimmer 2s linear infinite",
            },
            keyframes: {
                fadeUp: {
                    "0%": { opacity: "0", transform: "translateY(24px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
```

---

## 🌐 ШАГ 4: ЛЕНДИНГ (`app/(landing)/page.tsx`)

### Структура лендинга (секции сверху вниз):

#### HERO-СЕКЦИЯ

```
Фон: Тёмный (#0D0A0B) с золотым зернистым оверлеем
Шрифт заголовка: Playfair Display, 72-96px
Заголовок: "Каждый гость — ваш фотограф"
Подзаголовок: "QR-код → гости фотографируют → вы получаете сотни живых моментов"
CTA кнопки:
  - "Начать бесплатно" (золотой)
  - "Смотреть демо" (аутлайн)
Справа/внизу: Мокап телефона с интерфейсом гостя + живые фото
```

#### КАК ЭТО РАБОТАЕТ (3 шага)

```
Шаг 1: Создайте свадьбу → иконка кольца
Шаг 2: Поделитесь QR → иконка QR-кода
Шаг 3: Получайте фото в реальном времени → иконка фотографии

Дизайн: Горизонтальные карточки с номерами в золотом круге
Анимация: Появление с задержкой (animation-delay)
```

#### ФУНКЦИИ И ПРЕИМУЩЕСТВА

```
Сетка 2x3 карточек:
1. 📱 Без установки — просто QR
2. 🎯 Задания для гостей — не просто "сделай фото"
3. ⚡ Realtime галерея — видите фото мгновенно
4. 🔍 Умная фильтрация — убираем смазанные
5. 📚 Фотокнига — автоматически создаём слайдшоу
6. 🔒 Ваши данные — только вы видите фото
```

#### ЦЕННИКИ (3 плана)

|               | Free   | Starter     | Premium       |
| ------------- | ------ | ----------- | ------------- |
| **Цена**      | $0     | $19/свадьба | $49/свадьба   |
| Гостей        | до 20  | до 100      | до 500        |
| Фото          | до 100 | до 1000     | до 5000       |
| Задания       | 3      | 15          | неограниченно |
| Живая галерея | ❌     | ✅          | ✅            |
| Слайдшоу      | ❌     | ❌          | ✅            |
| Поддержка     | ❌     | email       | приоритет     |

```tsx
// Дизайн ценников:
// - Средний план "Starter" — выделен золотой рамкой + бейдж "Популярный"
// - Hover-эффект: лёгкий подъём карточки (transform translateY)
// - Кнопка CTA в каждом плане
```

#### ОТЗЫВЫ (3-4 карточки)

```
Фото + имя + город + звёзды + текст отзыва
Имена: Азиатские/Центральноазиатские для релевантности рынку
```

#### FOOTER

```
Логотип + слоган
Колонки: Продукт / Компания / Поддержка
Соцсети
Copyright
```

### Компоненты лендинга которые нужно создать:

```tsx
// components/landing/Hero.tsx
// - Анимированный текст появляется
// - Мокап телефона справа с CSS-анимацией плавания
// - Google Fonts: Playfair Display

// components/landing/HowItWorks.tsx
// - 3 шага с иконками из lucide-react
// - Линия-соединитель между шагами

// components/landing/Pricing.tsx
// - 3 плана, средний выделен
// - Переключатель месяц/год (скидка 20%)
// - Список фич с галочками

// components/landing/Features.tsx
// - 6 карточек в сетке
// - Иконки + заголовок + описание
```

---

## 🖥️ ШАГ 5: ДЕСКТОП-АДМИНКА

### Лейаут (`app/dashboard/layout.tsx`)

```
┌──────────────────────────────────────────────────────┐
│  SIDEBAR (260px)        │  MAIN CONTENT              │
│  ─────────────────────  │  ──────────────────────    │
│  🎊 SnapWed             │                            │
│                         │                            │
│  Navigation:            │   [Контент страницы]       │
│  • Дашборд              │                            │
│  • Мои свадьбы          │                            │
│  • Настройки            │                            │
│                         │                            │
│  ─────────────────────  │                            │
│  [Аватар] Имя           │                            │
│  Free план → Upgrade    │                            │
└──────────────────────────────────────────────────────┘
```

```tsx
// components/dashboard/Sidebar.tsx
// Тёмный сайдбар (#1C1917)
// Активный пункт: золотая полоска слева + золотой текст
// Нижняя секция: план пользователя + кнопка апгрейда
```

### Страница создания свадьбы (`app/dashboard/weddings/new/page.tsx`)

```
Форма в 2 шага:

ШАГ 1: Основная информация
  - Названия свадьбы (пр: "Свадьба Азиза и Малики")
  - Дата свадьбы (DatePicker)
  - Место проведения
  - Обложка (загрузка фото или выбор из шаблонов)

ШАГ 2: Задания для гостей
  - Готовые задания (можно включить/выключить):
    ☑ Первый танец
    ☑ Момент со слезами
    ☑ Фото с тортом
    ☑ Гости на танцполе
    ☑ Молодожёны крупным планом
    ☑ Декор и детали
    ☐ За кулисами подготовки
    ☐ Смешной момент
  - Добавить своё задание (текстовое поле)
  - Максимум фото от одного гостя (слайдер 5-30)
  - Текст приветствия для гостей

После создания → показать QR-код и ссылку
```

### Страница детей свадьбы (`app/dashboard/weddings/[id]/page.tsx`)

```
ШАПКА: название + дата + статус (активна/завершена) + кнопки

СТАТИСТИКА (4 карточки):
  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
  │  👥 47      │ │  📸 312     │ │  ✅ 8/10    │ │  ⏱️ 2ч 34м  │
  │  Гостей     │ │  Фото       │ │  Заданий    │ │  Активность │
  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘

ВКЛАДКИ: [Галерея фото] [Задания] [Приглашение] [Настройки]

ГАЛЕРЕЯ:
  - Masonry/grid сетка из фото
  - Фильтр по: все / задания / без задания
  - Сортировка: по времени / по гостю
  - Клик → полноэкранный просмотр
  - Кнопка: Скачать все (.zip)
```

### QR и приглашение (`app/dashboard/weddings/[id]/invite/page.tsx`)

```
СЛЕВА: Большой QR-код
  - Размер 256x256
  - С логотипом в центре
  - Кнопки: Скачать PNG / Скачать PDF / Копировать ссылку

СПРАВА: Превью того, что увидит гость
  - Мобильный мокап с вашим приглашением
  - Редактируемый текст приглашения

ВНИЗУ: Инструкция
  "Распечатайте QR и поставьте на столы /
   Отправьте ссылку гостям в WhatsApp"
```

---

## 📱 ШАГ 6: PWA ДЛЯ ГОСТЕЙ

### Основная страница гостя (`app/w/[weddingSlug]/page.tsx`)

```
Мобильный экран (max-width: 430px, центрирован):

┌────────────────────────┐
│                        │
│   [Обложка свадьбы]    │
│   красивое фото или    │
│   градиентный фон      │
│                        │
│  💍 Свадьба Азиза     │
│     и Малики           │
│  📅 14 сентября 2025  │
│  📍 Ташкент, Узбекистан│
│                        │
│ "Дорогие гости!        │
│  Помогите нам          │
│  сохранить воспоминания│
│  этого дня..."         │
│                        │
│  ┌──────────────────┐  │
│  │  📸 Начать съёмку│  │
│  │  (большая кнопка)│  │
│  └──────────────────┘  │
│                        │
│  👁️ Смотреть галерею   │
│                        │
└────────────────────────┘
```

### Страница заданий (`app/w/[weddingSlug]/tasks/page.tsx`)

```
┌────────────────────────┐
│  ← Назад              │
│                        │
│  Ваши задания          │
│  ▓▓▓▓▓▓░░░░ 6 из 10   │
│  (прогресс-бар золотой)│
│                        │
│  ┌──────────────────┐  │
│  │ ✅ Первый танец  │  │
│  │ Выполнено!       │  │
│  └──────────────────┘  │
│                        │
│  ┌──────────────────┐  │
│  │ 📸 Фото с тортом │  │  ← активное задание
│  │ Нажмите чтобы    │  │
│  │ сфотографировать │  │
│  └──────────────────┘  │
│                        │
│  ┌──────────────────┐  │
│  │ 🔒 Гости на      │  │
│  │    танцполе      │  │
│  │ (заблокировано)  │  │
│  └──────────────────┘  │
│                        │
│  [Сделать своё фото]   │
└────────────────────────┘
```

### Компонент камеры (`components/guest/CameraCapture.tsx`)

```tsx
// Использовать: navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }})
// - Открывать камеру прямо в браузере (не файловый диалог)
// - Превью в реальном времени (video элемент)
// - Кнопка захвата → canvas → blob → upload
// - Или fallback: <input type="file" accept="image/*" capture="environment">
// - После снимка: показать превью + кнопки "Хорошо" / "Переснять"
// - Прогресс загрузки
```

### Живая галерея (`components/guest/LiveGallery.tsx`)

```tsx
// Подключиться к Supabase Realtime:
// supabase.channel('photos').on('postgres_changes', ...)
// - Masonry сетка из фото
// - Новые фото появляются с анимацией
// - Счётчик: "312 фото от 47 гостей"
// - Кнопка поделиться (Web Share API)
```

---

## 🔧 ШАГ 7: PWA КОНФИГУРАЦИЯ

### `public/manifest.json`

```json
{
    "name": "SnapWed — Свадебные фото",
    "short_name": "SnapWed",
    "description": "Фотографируйте на свадьбе и делитесь с молодожёнами",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#FFFBF8",
    "theme_color": "#D4A853",
    "orientation": "portrait",
    "icons": [
        { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
        { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
        {
            "src": "/icon-512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
        }
    ]
}
```

### `app/layout.tsx` — добавить мета-теги

```tsx
export const metadata = {
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "SnapWed",
    },
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1, // Запрет зума для мобильного UI
    },
};
```

---

## 🔐 ШАГ 8: АУТЕНТИФИКАЦИЯ

```tsx
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { ... } }
  )
}

// Middleware: app/middleware.ts
// Защита роутов /dashboard/*
// Редирект на /login если не авторизован
// Публичные роуты: /, /w/*, /login, /register
```

---

## 📸 ШАГ 9: ЗАГРУЗКА ФОТО

```tsx
// Логика загрузки в Supabase Storage:

async function uploadPhoto(file: File, weddingId: string, sessionId: string) {
    const supabase = createClient();

    // 1. Сжать изображение перед загрузкой (canvas API)
    const compressed = await compressImage(file, {
        maxWidth: 2048,
        quality: 0.85,
    });

    // 2. Создать путь: weddings/{weddingId}/{sessionId}/{timestamp}.jpg
    const path = `weddings/${weddingId}/${sessionId}/${Date.now()}.jpg`;

    // 3. Загрузить в Storage
    const { data, error } = await supabase.storage
        .from("photos")
        .upload(path, compressed);

    // 4. Сохранить запись в БД
    await supabase.from("photos").insert({
        wedding_id: weddingId,
        guest_session_id: sessionId,
        storage_path: path,
    });

    return data;
}

// Функция сжатия изображений (важно для мобильных!)
async function compressImage(
    file: File,
    options: CompressOptions,
): Promise<Blob> {
    // Использовать Canvas API для ресайза
    // Вернуть Blob
}
```

---

## 🌍 ШАГ 10: ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEXT_PUBLIC_APP_URL=http://localhost:3000

# В production: https://your-domain.com
```

---

## 🚀 ШАГ 11: ДЕПЛОЙ НА VERCEL

```bash
# Установи Vercel CLI
npm i -g vercel

# Задеплой
vercel

# Добавь переменные окружения в Vercel Dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
# NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Кастомный домен (опционально)
# snapwed.com или snapwed.uz
```

---

## 📋 ЧЕКЛИСТ РАЗРАБОТКИ

### Неделя 1 — Основа

- [ ] Supabase проект + SQL схема
- [ ] Next.js проект + зависимости
- [ ] Tailwind конфиг + шрифты
- [ ] Supabase auth (login/register)
- [ ] Dashboard лейаут + сайдбар
- [ ] Форма создания свадьбы

### Неделя 2 — Ядро функций

- [ ] Генерация QR-кода
- [ ] Гостевая PWA страница
- [ ] Система заданий
- [ ] Загрузка фото с камеры
- [ ] Сохранение в Supabase Storage

### Неделя 3 — Галерея и Realtime

- [ ] Галерея в дашборде
- [ ] Realtime обновления
- [ ] Живая галерея для гостей
- [ ] Скачивание фото (zip)
- [ ] Фильтрация и сортировка

### Неделя 4 — Лендинг и монетизация

- [ ] Лендинг со всеми секциями
- [ ] Ценники и планы
- [ ] PWA манифест и иконки
- [ ] Мобильная адаптация
- [ ] Деплой на Vercel

---

## 💡 ПОДСКАЗКИ ДЛЯ CLAUDE CODE

### Начни с этих команд:

```bash
# Первый запрос к Claude Code:
"Создай Next.js 14 проект SnapWed с TypeScript и Tailwind.
Настрой структуру папок согласно инструкции.
Подключи Supabase. Начни с базы данных и аутентификации."

# Второй запрос:
"Создай десктопный дашборд: сайдбар + форма создания свадьбы.
Цвет сайдбара #1C1917, акцент золотой #D4A853"

# Третий запрос:
"Создай гостевую PWA страницу для /w/[weddingSlug]
с системой заданий и загрузкой фото через камеру браузера"

# Четвёртый запрос:
"Создай продающий лендинг с Hero, Как работает,
Функции, Ценники (3 плана) и Footer.
Тёмный фон #0D0A0B, золотой акцент #D4A853,
шрифт Playfair Display для заголовков"
```

### Важные уточнения при запросах:

1. **Всегда указывай:** "мобильно-адаптированный" для гостевых страниц
2. **Всегда указывай:** "десктопный layout с фиксированным сайдбаром" для дашборда
3. **При ошибках Supabase:** попроси проверить RLS политики
4. **При проблемах с камерой:** попроси добавить fallback через `<input type="file" capture>`

---

## 🎯 ПРИОРИТЕТ MVP (первая версия)

Если хочешь быстро запустить — сделай только это:

1. ✅ Регистрация/вход
2. ✅ Создание свадьбы + генерация QR
3. ✅ Гостевая страница + загрузка фото
4. ✅ Галерея в дашборде
5. ✅ Лендинг с ценниками

Остальное (задания, realtime, слайдшоу) — версия 2.0

---

_SnapWed — превращаем каждого гостя в фотографа_
