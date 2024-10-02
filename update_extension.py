import os
import shutil
import json
import platform
import argparse
from pathlib import Path

def get_brave_extension_dir():
    system = platform.system()
    home = Path.home()
    
    if system == "Windows":
        return home / "AppData/Local/BraveSoftware/Brave-Browser/User Data/Default/Extensions"
    elif system == "Darwin":  # macOS
        return home / "Library/Application Support/BraveSoftware/Brave-Browser/Default/Extensions"
    elif system == "Linux":
        return home / ".config/BraveSoftware/Brave-Browser/Default/Extensions"
    else:
        raise OSError(f"Unsupported operating system: {system}")

def find_extension_folder(extensions_dir, extension_id):
    for folder in extensions_dir.iterdir():
        if folder.is_dir() and folder.name == extension_id:
            return max(folder.iterdir(), key=os.path.getmtime)
    return None

def update_extension(source_dir, extension_id):
    brave_extensions_dir = get_brave_extension_dir()
    extension_folder = find_extension_folder(brave_extensions_dir, extension_id)
    
    if not extension_folder:
        print(f"Extension with ID {extension_id} not found in Brave.")
        return

    # Backup existing extension
    backup_folder = extension_folder.with_name(f"{extension_folder.name}_backup")
    shutil.copytree(extension_folder, backup_folder)
    
    # Update extension files
    for item in os.listdir(source_dir):
        s = os.path.join(source_dir, item)
        d = os.path.join(extension_folder, item)
        if os.path.isdir(s):
            shutil.copytree(s, d, dirs_exist_ok=True)
        else:
            shutil.copy2(s, d)
    
    print(f"Extension updated successfully. Backup created at {backup_folder}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Update Brave extension files")
    parser.add_argument("source_dir", help="Path to the directory containing the updated extension files")
    parser.add_argument("extension_id", help="ID of the extension to update")
    args = parser.parse_args()

    update_extension(args.source_dir, args.extension_id)
