#!/bin/bash
# Télécharge les 4 photos de la page Origine et génère les .webp.
# Double-clic depuis le Finder, OU : bash fetch-photos.command
# (curl + sips sont déjà inclus dans macOS — rien à installer.)

cd "$(dirname "$0")" || exit 1

declare -a NAMES=("hero-lin-fenetre" "pa-paolo" "isa-isabelle" "lisa")
declare -a URLS=(
  "https://images.unsplash.com/photo-1593030019566-d681b01e877f?fm=jpg&q=85&w=1600&h=900&fit=crop&auto=format"
  "https://images.unsplash.com/photo-1454875392665-2ac2c85e8d3e?fm=jpg&q=85&w=1000&h=1250&fit=crop&auto=format"
  "https://images.unsplash.com/photo-1560521166-117ca72366bd?fm=jpg&q=85&w=1000&h=1250&fit=crop&auto=format"
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?fm=jpg&q=85&w=1000&h=1250&fit=crop&auto=format"
)

for i in "${!NAMES[@]}"; do
  n="${NAMES[$i]}"
  echo "→ ${n}.jpg"
  curl -fsSL -o "${n}.jpg" "${URLS[$i]}" || { echo "  échec téléchargement"; continue; }
  echo "→ ${n}.webp"
  sips -s format webp "${n}.jpg" --out "${n}.webp" >/dev/null 2>&1 || echo "  (webp non généré — sips trop ancien, le .jpg suffit)"
done

echo ""
echo "Terminé. Fichiers dans : $(pwd)"
echo "Tu peux relancer 'npm run build' / redéployer."
