# Quick Start Guide - Deploy first-calc to Server

## Шаг 1: Подготовка сервера

```bash
# Подключитесь к серверу
ssh root@165.227.171.143

# Установите необходимые модули Apache
a2enmod proxy proxy_http proxy_wstunnel rewrite headers
systemctl restart apache2
```

## Шаг 2: Настройка Apache

```bash
# Скопируйте конфигурацию Apache
cp apache-config/test.first-calc.com.conf /etc/apache2/sites-available/

# Включите сайт
a2ensite test.first-calc.com.conf

# Проверьте конфигурацию
apache2ctl configtest

# Перезагрузите Apache
systemctl reload apache2
```

## Шаг 3: Первоначальный деплой

```bash
# Создайте директорию проекта
mkdir -p /var/www/first-calc
cd /var/www/first-calc

# Клонируйте репозиторий
git clone https://github.com/alex1c/first-calc.git .

# Запустите контейнер
docker-compose up -d --build

# Проверьте статус
docker ps
docker logs first-calc
```

## Шаг 4: Настройка автоматического деплоя (GitHub Actions)

### 4.1. Создайте SSH ключ на локальной машине

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github-deploy
```

### 4.2. Добавьте публичный ключ на сервер

```bash
# Скопируйте публичный ключ на сервер
ssh-copy-id -i ~/.ssh/github-deploy.pub root@165.227.171.143

# Или вручную добавьте в ~/.ssh/authorized_keys на сервере
cat ~/.ssh/github-deploy.pub | ssh root@165.227.171.143 "cat >> ~/.ssh/authorized_keys"
```

### 4.3. Настройте GitHub Secrets

1. Перейдите в репозиторий: https://github.com/alex1c/first-calc
2. Settings → Secrets and variables → Actions
3. Добавьте секреты:
   - `SSH_PRIVATE_KEY`: содержимое файла `~/.ssh/github-deploy` (приватный ключ)
   - `SERVER_HOST`: `165.227.171.143`

### 4.4. Проверьте деплой

Сделайте коммит и пуш в main ветку, или запустите workflow вручную через GitHub Actions.

## Полезные команды

### Просмотр логов
```bash
docker logs first-calc
docker logs -f first-calc  # Следить за логами в реальном времени
```

### Перезапуск контейнера
```bash
cd /var/www/first-calc
docker-compose restart
```

### Обновление вручную
```bash
cd /var/www/first-calc
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Проверка работы
```bash
# Проверьте, что контейнер работает
curl http://localhost:3003

# Проверьте через домен
curl http://test.first-calc.com
```

## Проблемы и решения

### Порт 3003 занят
Измените порт в `docker-compose.yml`:
```yaml
ports:
  - '3004:3000'  # Используйте другой порт
```

### Контейнер не запускается
```bash
# Проверьте логи
docker logs first-calc

# Проверьте, что порт свободен
netstat -tulpn | grep 3003
```

### Apache не проксирует запросы
```bash
# Проверьте логи Apache
tail -f /var/log/apache2/test.first-calc.com_error.log

# Убедитесь, что модули включены
apache2ctl -M | grep proxy
```

## Структура файлов

- `Dockerfile` - конфигурация Docker образа
- `docker-compose.yml` - конфигурация контейнера
- `.dockerignore` - файлы, исключаемые из образа
- `.github/workflows/deploy.yml` - автоматический деплой через GitHub Actions
- `deploy.sh` - скрипт для ручного деплоя
- `apache-config/test.first-calc.com.conf` - конфигурация Apache
- `DEPLOYMENT.md` - подробная документация по деплою

