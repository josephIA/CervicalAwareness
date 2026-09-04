import os
import shutil

base_path = r'c:\Users\HomePC\Desktop\Awareness System'
dirs = [
    'middleware',
    'models',
    'controllers',
    'routes',
    'config',
    'public/css',
    'public/js',
    'admin',
    'database'
]

for dir_path in dirs:
    full_path = os.path.join(base_path, dir_path)
    os.makedirs(full_path, exist_ok=True)
    print(f"Created: {full_path}")

print("All directories created successfully!")
