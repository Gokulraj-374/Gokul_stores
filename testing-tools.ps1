# Gokul Stores - Android Testing Helper Script
# This script provides utilities for testing the APK on Android

param(
    [string]$Command = "menu"
)

function Show-Menu {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "  GOKUL STORES - Android Testing Tools" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan

    Write-Host "1. Install APK" -ForegroundColor Yellow
    Write-Host "2. View Connected Devices" -ForegroundColor Yellow
    Write-Host "3. Launch App" -ForegroundColor Yellow
    Write-Host "4. View Live Logs" -ForegroundColor Yellow
    Write-Host "5. Clear App Data" -ForegroundColor Yellow
    Write-Host "6. Uninstall App" -ForegroundColor Yellow
    Write-Host "7. Check Device Storage" -ForegroundColor Yellow
    Write-Host "8. Get App Info" -ForegroundColor Yellow
    Write-Host "9. Force Stop App" -ForegroundColor Yellow
    Write-Host "0. Exit" -ForegroundColor Yellow
    Write-Host "`n"
}

function Check-ADB {
    $adbPath = Get-Command adb -ErrorAction SilentlyContinue
    if (-not $adbPath) {
        Write-Host "`n[ERROR] ADB not found in PATH" -ForegroundColor Red
        Write-Host "Please install Android SDK Platform Tools" -ForegroundColor Red
        Write-Host "Download from: https://developer.android.com/studio/releases/platform-tools`n" -ForegroundColor Red
        return $false
    }
    return $true
}

function Install-APK {
    if (-not (Check-ADB)) { return }

    Write-Host "`n[INFO] Checking for connected devices..." -ForegroundColor Cyan
    adb devices

    $choice = Read-Host "`nIs your device listed above? (y/n)"
    if ($choice -ne 'y') {
        Write-Host "[INFO] Please enable USB Debugging and reconnect your device" -ForegroundColor Yellow
        return
    }

    $apkPath = "dist-apk/gokul-stores-debug.apk"
    if (-not (Test-Path $apkPath)) {
        Write-Host "[ERROR] APK not found: $apkPath" -ForegroundColor Red
        return
    }

    Write-Host "`n[INFO] Installing APK..." -ForegroundColor Cyan
    adb install -r $apkPath

    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n[SUCCESS] APK installed successfully!" -ForegroundColor Green
        $launch = Read-Host "Launch app now? (y/n)"
        if ($launch -eq 'y') {
            adb shell am start -n com.ionicframework.gokul_stores_app/com.ionicframework.gokul_stores_app.MainActivity
            Write-Host "[INFO] App launched on your device!" -ForegroundColor Green
        }
    } else {
        Write-Host "`n[ERROR] Installation failed!" -ForegroundColor Red
    }
}

function View-Devices {
    if (-not (Check-ADB)) { return }

    Write-Host "`n[INFO] Connected devices:" -ForegroundColor Cyan
    adb devices -l
}

function Launch-App {
    if (-not (Check-ADB)) { return }

    Write-Host "`n[INFO] Launching Gokul Stores..." -ForegroundColor Cyan
    adb shell am start -n com.ionicframework.gokul_stores_app/com.ionicframework.gokul_stores_app.MainActivity
    Write-Host "[SUCCESS] App launched!" -ForegroundColor Green
}

function View-Logs {
    if (-not (Check-ADB)) { return }

    Write-Host "`n[INFO] Starting live logs (Press Ctrl+C to stop)..." -ForegroundColor Cyan
    Write-Host "Filter: gokul, ERROR, Exception, Warning`n" -ForegroundColor Yellow

    adb logcat | Select-String -Pattern "gokul|ERROR|Exception|Warning"
}

function Clear-AppData {
    if (-not (Check-ADB)) { return }

    Write-Host "`n[WARNING] This will clear all app data!" -ForegroundColor Yellow
    $confirm = Read-Host "Are you sure? (y/n)"
    if ($confirm -ne 'y') {
        Write-Host "[INFO] Cancelled" -ForegroundColor Yellow
        return
    }

    Write-Host "[INFO] Clearing app data..." -ForegroundColor Cyan
    adb shell pm clear com.ionicframework.gokul_stores_app
    Write-Host "[SUCCESS] App data cleared!" -ForegroundColor Green
}

function Uninstall-App {
    if (-not (Check-ADB)) { return }

    Write-Host "`n[WARNING] This will uninstall the app!" -ForegroundColor Yellow
    $confirm = Read-Host "Are you sure? (y/n)"
    if ($confirm -ne 'y') {
        Write-Host "[INFO] Cancelled" -ForegroundColor Yellow
        return
    }

    Write-Host "[INFO] Uninstalling app..." -ForegroundColor Cyan
    adb uninstall com.ionicframework.gokul_stores_app
    Write-Host "[SUCCESS] App uninstalled!" -ForegroundColor Green
}

function Check-Storage {
    if (-not (Check-ADB)) { return }

    Write-Host "`n[INFO] Device storage:" -ForegroundColor Cyan
    adb shell "df -h"
}

function Get-AppInfo {
    if (-not (Check-ADB)) { return }

    Write-Host "`n[INFO] App information:" -ForegroundColor Cyan
    adb shell dumpsys package com.ionicframework.gokul_stores_app | Select-Object -First 50
}

function Force-StopApp {
    if (-not (Check-ADB)) { return }

    Write-Host "`n[INFO] Force stopping app..." -ForegroundColor Cyan
    adb shell am force-stop com.ionicframework.gokul_stores_app
    Write-Host "[SUCCESS] App force stopped!" -ForegroundColor Green
}

# Main execution
if ($Command -eq "menu") {
    while ($true) {
        Show-Menu
        $choice = Read-Host "Enter your choice (0-9)"

        switch ($choice) {
            "1" { Install-APK }
            "2" { View-Devices }
            "3" { Launch-App }
            "4" { View-Logs }
            "5" { Clear-AppData }
            "6" { Uninstall-App }
            "7" { Check-Storage }
            "8" { Get-AppInfo }
            "9" { Force-StopApp }
            "0" {
                Write-Host "`nGoodbye! Happy testing! 🎉`n" -ForegroundColor Green
                exit
            }
            default {
                Write-Host "Invalid choice. Please try again." -ForegroundColor Red
            }
        }

        Write-Host "`nPress Enter to continue..." -ForegroundColor Gray
        Read-Host | Out-Null
    }
} else {
    # Execute specific command
    switch ($Command.ToLower()) {
        "install" { Install-APK }
        "devices" { View-Devices }
        "launch" { Launch-App }
        "logs" { View-Logs }
        "clear" { Clear-AppData }
        "uninstall" { Uninstall-App }
        "storage" { Check-Storage }
        "info" { Get-AppInfo }
        "stop" { Force-StopApp }
        default {
            Write-Host "Unknown command: $Command" -ForegroundColor Red
            Write-Host "Available commands: install, devices, launch, logs, clear, uninstall, storage, info, stop, menu" -ForegroundColor Yellow
        }
    }
}

