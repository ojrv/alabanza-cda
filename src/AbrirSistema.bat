@echo off
echo 🚀 Ejecutando sistema desde Git Bash...

:: Ruta al script .sh
set SCRIPT=abrirSistema.sh

:: Verificar si Git Bash está instalado
where bash >nul 2>nul
if errorlevel 1 (
    echo ❌ Git Bash no está instalado o no está en el PATH.
    pause
    exit /b
)

:: Ejecutar el script en Git Bash
bash "%SCRIPT%"