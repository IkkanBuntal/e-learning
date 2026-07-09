#!/bin/bash

echo "=== Memulai Push ke GitHub ==="
cd /home/ikkanbuntal/Documents/e-learning

# Cek apakah ada remote origin
echo "1. Mengecek remote..."
git remote -v

# Tambah remote jika belum ada
if ! git remote | grep -q "origin"; then
    echo "2. Menambahkan remote origin..."
    git remote add origin https://github.com/IkkanBuntal/e-learning.git
else
    echo "2. Remote origin sudah ada"
    # Update URL jika berbeda
    git remote set-url origin https://github.com/IkkanBuntal/e-learning.git
fi

# Cek status
echo "3. Mengecek status git..."
git status

# Tambahkan semua file
echo "4. Menambahkan semua perubahan..."
git add .

# Cek apakah ada yang perlu di-commit
if git diff --staged --quiet; then
    echo "5. Tidak ada perubahan untuk di-commit"
else
    echo "5. Membuat commit..."
    git commit -m "Update e-learning project - $(date +'%Y-%m-%d %H:%M:%S')"
fi

# Cek branch saat ini
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
echo "6. Branch saat ini: $CURRENT_BRANCH"

# Push ke GitHub
echo "7. Melakukan push ke GitHub..."
git push -u origin $CURRENT_BRANCH

echo ""
echo "=== Selesai! ==="
echo "Repository Anda: https://github.com/IkkanBuntal/e-learning"
