# React Native CI/CD with RevoPush & GitHub Actions

A complete CI/CD automation setup for React Native applications using RevoPush for OTA updates and GitHub Actions for automated builds and deployments.

## Features

- Automated OTA updates with RevoPush
- Automated version management
- Play Store deployment automation
- TestFlight deployment automation
- Branch-based environment management (Production/Staging)
- Discord notifications for all deployments
- Cross-platform version synchronization

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [RevoPush Setup](#revopush-setup)
- [GitHub Actions Setup](#github-actions-setup)
- [Workflow Configuration](#workflow-configuration)
- [Version Management](#version-management)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:

- Node.js 20 or higher
- Bun (optional, or use npm/yarn)
- React Native development environment set up
- GitHub repository
- RevoPush account
- Google Play Console account (for Android)
- Apple Developer account (for iOS)

## Project Setup

### 1. Clone or Create Your React Native Project

```bash
npx @react-native-community/cli@latest init YourAppName
cd YourAppName
```

### 2. Install Required Dependencies

```bash
# Install RevoPush React Native SDK
npm install @revopush/react-native-code-push

# OR using yarn
yarn add @revopush/react-native-code-push

# OR using bun
bun add @revopush/react-native-code-push
```

### 3. Install Fastlane (for iOS automation)

```bash
# macOS only
sudo gem install fastlane -NV
```

## RevoPush Setup

### Step 1: Create RevoPush Account

1. Go to [RevoPush Dashboard](https://revopush.io)
2. Sign up for a free account
3. Create a new application

### Step 2: Get Your Access Keys

1. Navigate to your app settings in RevoPush dashboard
2. Copy your **Access Key**
3. Get your deployment keys for:
   - **Staging** environment
   - **Production** environment

### Step 3: Configure RevoPush in Your App

#### Android Configuration

Add to `android/app/build.gradle`:

```gradle
// At the bottom of the file
apply from: "../../node_modules/@revopush/react-native-code-push/android/codepush.gradle"
```

#### iOS Configuration

1. Open your iOS project in Xcode
2. Follow RevoPush iOS setup guide to configure the SDK

### Step 4: Initialize RevoPush in Your App

Update your main app file (e.g., `App.tsx` or `index.js`):

```javascript
import codePush from "@revopush/react-native-code-push";

const App = () => {
  // Your app code
};

export default codePush(App);
```

## GitHub Actions Setup

### Step 1: Copy Workflow Files

Copy the `.github/workflows/` directory from this repository to your project:

```
.github/
└── workflows/
    ├── versioning.yml           # Version management
    ├── android-build.yml        # Android OTA releases
    ├── ios-build.yml           # iOS OTA releases
    ├── playstore-release.yml   # Play Store deployment
    └── appstore-release.yml    # TestFlight deployment
```

### Step 2: Copy Version Management Files

Copy these files to your project:

```
android/
└── version.properties          # Version tracking file

ios/
└── Fastfile                   # iOS build automation

scripts/
├── bump_version.sh            # Version increment script
└── bump_build_number.sh       # Build number increment script
```

Make scripts executable:

```bash
chmod +x scripts/*.sh
```

### Step 3: Update Android Build Configuration

Add to `android/app/build.gradle` (before the `android` block):

```gradle
def versionPropsFile = file('../version.properties')
def Properties versionProps = new Properties()
def versionCodeValue = 1
def versionNameValue = "1.0"

if (versionPropsFile.canRead()) {
    versionProps.load(new FileInputStream(versionPropsFile))
    versionCodeValue = versionProps['VERSION_CODE'].toInteger()
    versionNameValue = versionProps['VERSION_NAME']
}

android {
    // ... existing config
    defaultConfig {
        // ... existing config
        versionCode versionCodeValue
        versionName versionNameValue
    }
}
```

### Step 4: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

#### Required for All Workflows:
- `DISCORD_WEBHOOK_URL` - Your Discord webhook URL for notifications (optional)

#### For RevoPush (OTA Updates):
- `APP_NAME` - Your RevoPush app name
- `REVOPUSH_ACCESS_KEY` - Your RevoPush access key

#### For Play Store Deployment:
- `PACKAGE_NAME` - Your Android package name (e.g., com.yourapp)
- `PLAY_STORE_SERVICE_ACCOUNT_JSON` - Google Play service account JSON

#### For TestFlight Deployment:
- `APP_STORE_CONNECT_API_KEY_ID` - App Store Connect API Key ID
- `APP_STORE_CONNECT_API_ISSUER_ID` - App Store Connect Issuer ID
- `APP_STORE_CONNECT_API_PRIVATE_KEY` - App Store Connect Private Key (base64 encoded)

### Step 5: Customize Workflows

Update the following in workflow files to match your project:

#### In `ios/Fastfile`:
```ruby
build_app(
  scheme: "YourAppName",  # Change to your app name
  export_method: "app-store",
  configuration: "Release"
)
```

## Workflow Configuration

### How the Workflows Work

```
Push to main/dev branch
    ↓
1. Versioning Workflow runs
    ├─ Bumps version (main) or build number (dev)
    ├─ Commits version.properties
    └─ Sends Discord notification
    ↓
2. Version commit triggers builds (based on changed files)
    ├─ android-build.yml (Android OTA via RevoPush)
    ├─ ios-build.yml (iOS OTA via RevoPush)
    ├─ playstore-release.yml (Play Store deployment)
    └─ appstore-release.yml (TestFlight deployment)
```

### Branch Strategy

- **main** branch:
  - Increments version number (1.0.0 → 1.0.1)
  - Deploys to Production environment
  - Uploads to production tracks

- **dev** branch:
  - Increments build number only (100 → 101)
  - Deploys to Staging environment
  - Uploads to internal/beta tracks

### Manual Triggers

All workflows support manual execution via GitHub Actions UI:

1. Go to Actions tab
2. Select workflow
3. Click "Run workflow"
4. Choose branch and run

## Version Management

### Initial Version Setup

Create `android/version.properties`:

```properties
VERSION_CODE=100
VERSION_NAME=1.0.0
```

### Version Bump Behavior

**Production (main branch):**
- Bumps patch version: `1.0.0` → `1.0.1`
- Increments build code: `100` → `101`

**Staging (dev branch):**
- Keeps version name: `1.0.0`
- Increments build code: `100` → `101`

### Manual Version Management

Run scripts locally:

```bash
# Bump version (production)
./scripts/bump_version.sh

# Bump build number only (staging)
./scripts/bump_build_number.sh
```

## Usage

### Deploying OTA Updates

**Method 1: Automatic (recommended)**
```bash
# Push to dev for staging
git push origin dev

# Push to main for production
git push origin main
```

**Method 2: Manual trigger**
1. Go to GitHub Actions
2. Select "RevoPush OTA Android" or "RevoPush OTA iOS"
3. Click "Run workflow"

### Deploying to App Stores

**Play Store:**
- Automatic: Push to main/dev with Android changes
- Manual: Run "Play Store Deploy" workflow

**TestFlight:**
- Automatic: Push to main/dev with iOS changes
- Manual: Run "TestFlight Deploy" workflow

## Workflow Details

### 1. Versioning Workflow

**File:** `.github/workflows/versioning.yml`

**Triggers:**
- Push to main/dev branches (excluding version.properties changes)

**What it does:**
- Detects environment based on branch
- Bumps version or build number
- Commits changes with `[skip ci]`
- Sends Discord notification

### 2. Android OTA Workflow

**File:** `.github/workflows/android-build.yml`

**Triggers:**
- Push to main/dev/feature branches
- Changes in: `android/**`, `src/**`, `package.json`, `android/version.properties`
- Manual dispatch

**What it does:**
- Validates secrets
- Installs dependencies
- Determines environment (Production/Staging)
- Releases to RevoPush
- Sends Discord notification

### 3. iOS OTA Workflow

**File:** `.github/workflows/ios-build.yml`

**Triggers:**
- Push to main/dev branches
- Changes in: `ios/**`, `src/**`, `package.json`, `android/version.properties`
- Manual dispatch

**What it does:**
- Validates secrets
- Installs dependencies
- Determines environment (Production/Staging)
- Releases to RevoPush
- Sends Discord notification

### 4. Play Store Workflow

**File:** `.github/workflows/playstore-release.yml`

**Triggers:**
- Push to main/dev branches
- Changes in: `android/**`, `android/version.properties`
- Manual dispatch

**What it does:**
- Validates secrets
- Builds Android AAB
- Uploads to Play Store (production/internal track)
- Sends Discord notification

### 5. TestFlight Workflow

**File:** `.github/workflows/appstore-release.yml`

**Triggers:**
- Push to main/dev branches
- Changes in: `ios/**`, `android/version.properties`
- Manual dispatch

**What it does:**
- Validates secrets
- Builds iOS app via Fastlane
- Uploads to TestFlight
- Sends Discord notification

## Troubleshooting

### Common Issues

**1. Workflows not triggering**
- Check that secrets are configured
- Verify branch names match (main/dev)
- Check workflow path filters

**2. Version not updating**
- Ensure `version.properties` exists
- Check script permissions: `chmod +x scripts/*.sh`
- Verify gradle configuration in `android/app/build.gradle`

**3. RevoPush deployment fails**
- Verify `REVOPUSH_ACCESS_KEY` is correct
- Check `APP_NAME` matches RevoPush dashboard
- Ensure RevoPush SDK is properly installed

**4. Play Store upload fails**
- Verify service account JSON is valid
- Check package name matches
- Ensure first version is uploaded manually

**5. TestFlight upload fails**
- Verify App Store Connect API credentials
- Check signing certificates
- Ensure app exists in App Store Connect

**6. Build errors**
- Clear build cache: `cd android && ./gradlew clean`
- For iOS: `cd ios && pod install`
- Check Node version: `node --version` (should be 20+)

### Debug Mode

To debug workflows locally:

```bash
# Test version bump scripts
./scripts/bump_build_number.sh
./scripts/bump_version.sh

# Check gradle configuration
cd android && ./gradlew app:dependencies

# Test Fastlane
cd ios && fastlane build
```

### Getting Help

- Check GitHub Actions logs for detailed error messages
- Review RevoPush documentation: https://docs.revopush.io
- Review Fastlane documentation: https://docs.fastlane.tools

## Discord Notifications

All workflows send notifications to Discord. Configure webhook:

1. Create Discord webhook in your server
2. Add `DISCORD_WEBHOOK_URL` to GitHub secrets
3. Notifications include:
   - App name
   - Environment
   - Branch
   - Version and build number
   - Deployment status

## Contributing

This is an open-source template. Feel free to:
- Fork and customize
- Submit issues
- Create pull requests
- Share improvements

## License

MIT License - feel free to use in your projects

## Acknowledgments

- [RevoPush](https://revopush.io) - OTA update platform
- [GitHub Actions](https://github.com/features/actions) - CI/CD platform
- [Fastlane](https://fastlane.tools) - iOS automation tool

---

## Quick Start Checklist

- [ ] Install dependencies (`npm install` or `bun install`)
- [ ] Set up RevoPush account and get access keys
- [ ] Copy workflow files to `.github/workflows/`
- [ ] Copy `android/version.properties` and set initial version
- [ ] Update `android/app/build.gradle` with version configuration
- [ ] Copy `ios/Fastfile` and customize with your app name
- [ ] Copy version bump scripts to `scripts/` directory
- [ ] Configure all GitHub secrets
- [ ] Test locally: `./scripts/bump_build_number.sh`
- [ ] Push to dev branch and verify workflows run
- [ ] Check Discord notifications (if configured)
- [ ] Verify OTA update in RevoPush dashboard

Happy deploying!
