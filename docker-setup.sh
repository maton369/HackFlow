#!/bin/bash

echo "🐳 HackFlow Docker開発環境セットアップ"

# .env.dockerを.envにコピー
if [ ! -f .env ]; then
    echo "📝 .env.dockerを.envにコピーしています..."
    cp .env.docker .env
else
    echo "⚠️  .envファイルが既に存在します。手動で確認してください。"
fi

# Dockerコンテナを起動
echo "🚀 Dockerコンテナを起動しています..."
docker-compose up -d

# アプリケーションキーを生成
echo "🔑 アプリケーションキーを生成しています..."
docker-compose exec app php artisan key:generate

# マイグレーションを実行
echo "🗄️  データベースマイグレーションを実行しています..."
docker-compose exec app php artisan migrate

# シーダーを実行（オプション）
echo "🌱 シーダーを実行しますか？ (y/N)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    docker-compose exec app php artisan db:seed
fi

# ストレージリンクを作成
echo "🔗 ストレージリンクを作成しています..."
docker-compose exec app php artisan storage:link

echo "✅ セットアップ完了！"
echo "🌐 アプリケーション: http://localhost:8080"
echo "🗄️  phpMyAdmin: http://localhost:8081"
echo ""
echo "📝 使用コマンド:"
echo "  docker-compose up -d      # コンテナ起動"
echo "  docker-compose down       # コンテナ停止"
echo "  docker-compose logs app   # アプリログ確認"