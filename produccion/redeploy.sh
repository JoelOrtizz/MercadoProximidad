#!/usr/bin/env bash
set -euo pipefail

# Script rápido (modo DAW) para:
# 1) Traer últimos cambios (git pull)
# 2) Reconstruir y levantar contenedores de producción
#
# Uso:
#   ./redeploy.sh
#
# Requisitos:
# - Estar dentro del repo (o tenerlo clonado)
# - Tener Traefik ya levantado por separado
# - Haber creado `produccion/.env` (no se commitea)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> Entrando al repo: ${ROOT_DIR}"
cd "${ROOT_DIR}"

echo "==> Git pull (rama actual)"
git pull

echo "==> Entrando en produccion/"
cd "${ROOT_DIR}/produccion"

if [[ ! -f ".env" ]]; then
  echo "ERROR: Falta produccion/.env"
  echo "Crea el fichero con: cp .env.example .env"
  exit 1
fi

echo "==> Rebuild + up (docker-compose)"
docker-compose up -d --build

echo "==> Estado contenedores"
docker-compose ps

echo "==> OK redeploy terminado"

