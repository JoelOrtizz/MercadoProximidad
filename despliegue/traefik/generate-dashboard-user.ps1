$ErrorActionPreference = "Stop"

Write-Host "Generando usuario para dashboard de Traefik..."

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Host "ERROR: No encuentro 'docker' en PATH."
  exit 1
}

# Contraseña aleatoria simple (modo DAW)
$chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"
$password = ""
for ($i = 0; $i -lt 18; $i++) {
  $password = $password + $chars[(Get-Random -Minimum 0 -Maximum $chars.Length)]
}

$user = "terretashopuser"

# Usamos un contenedor httpd para generar htpasswd bcrypt (-B)
Write-Host "Generando users.htpasswd con bcrypt..."
$line = docker run --rm httpd:2.4-alpine htpasswd -nbB $user $password

if (-not $line) {
  Write-Host "ERROR: No se ha podido generar htpasswd. ¿Docker Engine está arrancado?"
  exit 1
}

$outFile = Join-Path $PSScriptRoot "users.htpasswd"
Set-Content -Path $outFile -Value $line -NoNewline

Write-Host ""
Write-Host "OK. Archivo creado: $outFile"
Write-Host "Dashboard URL: https://terreta.shop/traefik/dashboard/"
Write-Host "Usuario: $user"
Write-Host "Contraseña: $password"
Write-Host ""
Write-Host "Guarda esta contraseña en un sitio seguro."

