#!/bin/bash
set -e

VERSION_FILE="android/version.properties"

# Check if file exists
if [ ! -f "$VERSION_FILE" ]; then
  echo "Error: $VERSION_FILE not found"
  exit 1
fi

VERSION_NAME=$(grep VERSION_NAME $VERSION_FILE | cut -d'=' -f2)

IFS='.' read -r MAJOR MINOR PATCH <<<"$VERSION_NAME"
NEW_VERSION_NAME="$MAJOR.$MINOR.$((PATCH + 1))"

# Increment version name (OS-agnostic)
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s/VERSION_NAME=.*/VERSION_NAME=$NEW_VERSION_NAME/" $VERSION_FILE
else
  # Linux
  sed -i "s/VERSION_NAME=.*/VERSION_NAME=$NEW_VERSION_NAME/" $VERSION_FILE
fi

# Increment build number too
bash scripts/bump_build_number.sh

echo "✅ Android version bumped to $NEW_VERSION_NAME"
