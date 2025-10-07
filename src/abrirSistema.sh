#!/bin/bash

echo "🚀 Iniciando sistema local con http-server..."

# Iniciar el servidor en segundo plano
nohup http-server . -p 3000 > /dev/null 2>&1 &

# Esperar unos segundos para que el servidor arranque
sleep 2

# Obtener IP local
IP=$(ipconfig | grep -i "IPv4" | head -n 1 | awk -F: '{print $2}' | sed 's/^[ \t]*//')

echo
echo "📱 Abrí esta URL en tu teléfono o tablet (misma red Wi-Fi):"
echo "http://$IP:3000"
echo

# Abrir en navegador por defecto
start "http://$IP:3000"