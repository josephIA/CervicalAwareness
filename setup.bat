@echo off
REM Setup script for Cervical Cancer Awareness System

REM Create directories
mkdir middleware
mkdir models
mkdir controllers
mkdir routes
mkdir config
mkdir public
mkdir public\css
mkdir public\js
mkdir admin
mkdir database

REM Create placeholder files
type nul > middleware\.gitkeep
type nul > models\.gitkeep
type nul > controllers\.gitkeep
type nul > routes\.gitkeep
type nul > config\.gitkeep
type nul > public\css\.gitkeep
type nul > public\js\.gitkeep
type nul > admin\.gitkeep
type nul > database\.gitkeep

echo Directories created successfully!
