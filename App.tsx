/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  Button,
  StatusBar,
  Text,
  useColorScheme,
  View,
  Alert,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import CodePush from '@revopush/react-native-code-push';
import { useState } from 'react';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppView />
    </SafeAreaProvider>
  );
}

function AppView() {
  const safeAreaInsets = useSafeAreaInsets();
  const [syncMessage, setSyncMessage] = useState('');

  const syncCodePush = () => {
    setSyncMessage('Checking for updates...');

    CodePush.sync(
      {
        updateDialog: {
          title: 'Update Available',
          optionalUpdateMessage: 'An update is available. Would you like to install it?',
          optionalIgnoreButtonLabel: 'Later',
          optionalInstallButtonLabel: 'Install',
        },
        installMode: CodePush.InstallMode.IMMEDIATE,
      },
      (status) => {
        switch (status) {
          case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
            setSyncMessage('Checking for update...');
            break;
          case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
            setSyncMessage('Downloading update...');
            break;
          case CodePush.SyncStatus.INSTALLING_UPDATE:
            setSyncMessage('Installing update...');
            break;
          case CodePush.SyncStatus.UP_TO_DATE:
            setSyncMessage('App is up to date!');
            Alert.alert('Success', 'Your app is up to date!');
            break;
          case CodePush.SyncStatus.UPDATE_INSTALLED:
            setSyncMessage('Update installed!');
            Alert.alert('Success', 'Update has been installed!');
            break;
          case CodePush.SyncStatus.UPDATE_IGNORED:
            setSyncMessage('Update ignored');
            break;
          case CodePush.SyncStatus.UNKNOWN_ERROR:
            setSyncMessage('An error occurred');
            Alert.alert('Error', 'Failed to check for updates. Please check your network connection and server configuration.');
            break;
        }
      },
      ({ receivedBytes, totalBytes }) => {
        setSyncMessage(`Downloading: ${Math.round((receivedBytes / totalBytes) * 100)}%`);
      }
    ).catch((error) => {
      console.error('CodePush sync error:', error);
      setSyncMessage('Sync failed');
      Alert.alert('Error', `Failed to sync: ${error.message || 'Unknown error'}`);
    });
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        paddingTop: safeAreaInsets.top,
      }}
    >
      <Text style={{ fontSize: 32, color: 'teal', fontWeight: 'bold' }}>
        Revopush React Native CodePush Demo
      </Text>
      <View style={{marginTop: 20, flex: 1, width: '80%', }}>
        {syncMessage ? (
          <Text style={{ marginBottom: 10, textAlign: 'center', color: '#666' }}>
            {syncMessage}
          </Text>
        ) : null}
        <Button color={"green"} title="Sync Updates" onPress={syncCodePush} />
      </View>

      <View style={{marginTop: 20, flex: 1, width: '80%', }}>
        <Text style={{ marginBottom: 10, textAlign: 'center', color: '#666' }}>
          Sync with CodePush!
        </Text>
      </View>
      <View style={{marginTop: 20, flex: 1, width: '80%', }}>
        <Text style={{ marginBottom: 10, textAlign: 'center', color: '#666' }}>
          This is a sample app to demonstrate how to use RevoPush with CodePush.
        </Text>
      </View>
    </View>
  );
}

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
  installMode: CodePush.InstallMode.IMMEDIATE,
};

export default CodePush(codePushOptions)(App);
