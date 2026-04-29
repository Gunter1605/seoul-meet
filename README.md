# Seoul Meet — Digital Menu

Цифровое меню с Node.js сервером. Все данные хранятся прямо на сервере в файле `data/menu.json`. Никаких внешних сервисов — всё в одном месте.

## Структура

```
seoul-meet/
├── server.js           ← Node.js сервер + API
├── package.json
├── data/
│   └── menu.json       ← база данных меню (создаётся автоматически)
├── uploads/            ← загруженные фото блюд
└── public/             ← фронтенд (HTML, CSS, JS)
    ├── index.html
    ├── css/
    └── js/
```

---

## Запуск локально (для тестирования)

**Шаг 1.** Установите Node.js если нет: https://nodejs.org (версия 18+)

**Шаг 2.** Откройте папку `seoul-meet` в терминале:
```bash
# Windows PowerShell / cmd:
cd C:\Users\...\seoul-meet

# macOS / Linux:
cd ~/Downloads/seoul-meet
```

**Шаг 3.** Установите зависимости (один раз):
```bash
npm install
```

**Шаг 4.** Запустите сервер:
```bash
npm start
```

**Шаг 5.** Откройте в браузере:
- Меню: http://localhost:3000
- Admin: http://localhost:3000/#admin-seoulm33t

**Пароль по умолчанию:** `SM2025`

---

## Деплой на VPS (продакшн)

### Требования к серверу
- Ubuntu 20.04 / 22.04
- Node.js 18+
- Минимум 512 MB RAM

### Установка

```bash
# 1. Установить Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Загрузить файлы проекта на сервер
# (через FileZilla / scp / git)

# 3. Перейти в папку проекта
cd /var/www/seoul-meet

# 4. Установить зависимости
npm install

# 5. Установить PM2 (держит сервер запущенным)
sudo npm install -g pm2

# 6. Запустить через PM2
pm2 start server.js --name "seoul-meet"
pm2 save
pm2 startup   # автозапуск при перезагрузке VPS
```

### Nginx (проксирование на домен)

```nginx
server {
    listen 80;
    server_name seoulm33t.kz www.seoulm33t.kz;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        client_max_body_size 10M;
    }
}
```

```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/seoul-meet
# вставить конфиг выше
sudo ln -s /etc/nginx/sites-available/seoul-meet /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### SSL (HTTPS) через Certbot — бесплатно

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seoulm33t.kz -d www.seoulm33t.kz
```

---

## API сервера

| Метод | URL | Доступ | Описание |
|-------|-----|--------|----------|
| GET | /api/menu | Публичный | Получить всё меню |
| PUT | /api/menu | Admin | Сохранить меню |
| POST | /api/upload | Admin | Загрузить фото |
| DELETE | /api/upload/:file | Admin | Удалить фото |

Admin-запросы требуют заголовок `X-Admin-Password`.

---

## Admin Panel

URL: `https://ваш-домен.kz/#admin-seoulm33t`

Пароль по умолчанию: `SM2025` — сменить в Admin → Настройки.
