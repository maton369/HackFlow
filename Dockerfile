# Laravel + Node.js開発環境
FROM php:8.2-fpm

# 作業ディレクトリを設定
WORKDIR /var/www/html

# システムの依存関係をインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    nodejs \
    npm \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && pecl install redis \
    && docker-php-ext-enable redis

# Composerをインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# アプリケーションファイルをコピー
COPY . /var/www/html

# 権限を設定
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# PHP依存関係をインストール
RUN composer install --no-dev --optimize-autoloader

# Node.js依存関係をインストールとビルド
RUN npm install && npm run build

# ポート9000を公開
EXPOSE 9000

# PHP-FPMを起動
CMD ["php-fpm"]