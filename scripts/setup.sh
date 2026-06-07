#!/bin/bash
# =============================================================
# setup.sh — MelhorSabor
# Configura o ambiente de desenvolvimento local do zero
# =============================================================

set -e

echo "🍽️  MelhorSabor — Setup inicial"
echo "================================"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale via https://nodejs.org"
    exit 1
fi

echo "✅ Node.js: $(node --version)"

# Criar .env.local se não existir
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "✅ .env.local criado (preencha com suas credenciais)"
else
    echo "ℹ️  .env.local já existe"
fi

# Instalar dependências do frontend
echo ""
echo "📦 Instalando dependências do frontend..."
cd apps/frontend && npm install
cd ../..

echo ""
echo "✅ Setup concluído!"
echo ""
echo "Para rodar em modo dev:"
echo "  cd apps/frontend && npm run dev"
echo ""
echo "Acesse: http://localhost:3000"
