#!/bin/bash
# Setup script for Cervical Cancer Awareness System

# Create directories
mkdir -p middleware models controllers routes config public/css public/js admin database

# Create placeholder files to ensure directories exist
touch middleware/.gitkeep
touch models/.gitkeep
touch controllers/.gitkeep
touch routes/.gitkeep
touch config/.gitkeep
touch public/css/.gitkeep
touch public/js/.gitkeep
touch admin/.gitkeep
touch database/.gitkeep

echo "Directories created successfully!"
