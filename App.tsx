import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  DatadogProvider,
  DatadogProviderConfiguration,
  LogsConfiguration,
  RumConfiguration,
  SdkVerbosity,
  TraceConfiguration,
} from '@datadog/mobile-react-native';
import MainScreen from './src/MainScreen';

const credentials = require('./credentials.json');

const rumConfig = new RumConfiguration(
  credentials.applicationId,
  true, // trackInteractions
  true, // trackResources
  true, // trackErrors
);
rumConfig.nativeCrashReportEnabled = true;
rumConfig.sessionSampleRate = 100;
rumConfig.resourceTraceSampleRate = 100;

const datadogConfig = new DatadogProviderConfiguration(
  credentials.clientToken,
  credentials.environment,
);
datadogConfig.rumConfiguration = rumConfig;
datadogConfig.logsConfiguration = new LogsConfiguration();
datadogConfig.traceConfiguration = new TraceConfiguration();
datadogConfig.site = 'US1';
datadogConfig.verbosity = SdkVerbosity.DEBUG;

function App() {
  return (
    <DatadogProvider configuration={datadogConfig}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <MainScreen />
      </SafeAreaProvider>
    </DatadogProvider>
  );
}

export default App;
