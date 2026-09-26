#!/usr/bin/env bash

set -Eeuo pipefail

echo "===================================="
echo " ISP Billing Deployment"
echo "===================================="

echo
echo "Stopping existing containers..."
docker compose -f docker.compose.prod.yml down

echo
echo "Building latest images..."
docker compose -f docker.compose.prod.yml build --pull

echo
echo "Starting infrastructure..."
docker compose -f docker.compose.prod.yml up -d postgres_main mysql_main redis

echo
echo "Waiting for databases..."

until docker compose -f docker.compose.prod.yml exec postgres_main pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"
do
    sleep 2
done

until docker compose -f docker.compose.prod.yml exec mysql_main mysqladmin ping \
-u"$MYSQL_USER" \
-p"$MYSQL_PASSWORD" \
--silent
do
    sleep 2
done

echo
echo "Running migrations..."

docker compose -f docker.compose.prod.yml run --rm web \
python manage.py migrate

echo
echo "Collecting static..."

docker compose -f docker.compose.prod.yml run --rm web \
python manage.py collectstatic --noinput

echo
echo "Starting services..."

docker compose -f docker.compose.prod.yml up -d

echo
echo "Deployment complete."

echo
docker compose -f docker.compose.prod.yml ps

echo
echo "Health:"
echo "--------------------------------"

curl http://localhost/api/live/

echo
echo "Ready:"
echo "--------------------------------"
