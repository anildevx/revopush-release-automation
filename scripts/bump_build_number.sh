#!/bin/bash
set -e

VERSION_FILE="android/version.properties"

# Check if file exists
if [ ! -f "$VERSION_FILE" ]; then
  echo "Error: $VERSION_FILE not found"
  exit 1
fi

BUILD_NUMBER=$(grep VERSION_CODE $VERSION_FILE | cut -d'=' -f2)
NEW_BUILD_NUMBER=$((BUILD_NUMBER + 1))

# Update version.properties (OS-agnostic)
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s/VERSION_CODE=.*/VERSION_CODE=$NEW_BUILD_NUMBER/" $VERSION_FILE
else
  # Linux
  sed -i "s/VERSION_CODE=.*/VERSION_CODE=$NEW_BUILD_NUMBER/" $VERSION_FILE
fi

echo "✅ Android build number incremented to $NEW_BUILD_NUMBER"
