#!/bin/bash

echo "🧹 Removing all city-intelligence / dynamic system references..."

# 1. Show affected files first
echo "📌 Files referencing old system:"
grep -R "city-intelligence\|cityPageContent\|generators\|dynamic generators" src || true

# 2. Remove broken imports (safe replace)
echo "🔧 Removing imports..."

find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' \
  -e "s|from '@/lib/city-intelligence'|from '@/lib/city-page-data'|g" \
  -e "s|from '../lib/city-intelligence'|from '../lib/city-page-data'|g" \
  -e "s|city-intelligence||g" \
  -e "s|dynamic generators||g" \
  {} +

# 3. Remove unused references in code
echo "🧼 Cleaning references..."

grep -R "city-intelligence" -l src | xargs sed -i '' '/city-intelligence/d' || true
grep -R "generators" -l src | xargs sed -i '' '/generators/d' || true

# 4. Clean build cache
echo "🧽 Cleaning Next cache..."
rm -rf .next

echo "✅ Done. Now run:"
echo "npm install && npm run dev"