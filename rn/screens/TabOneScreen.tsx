import * as React from 'react';
import { Button, StyleSheet, ToastAndroid } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function TabOneScreen() {
  const [fileLoaded, setFileLoaded] = React.useState<string>();

  const display = async () => {
    console.log('pressing')
    let res = await DocumentPicker.getDocumentAsync({type: 'text/plain', copyToCacheDirectory: true})
    
    if(res.type === 'success') {
      console.log('res', res.uri)
      setFileLoaded(res.name)
      let content = await FileSystem.readAsStringAsync(res?.uri)
      //console.log('content', content)
    }
    else {
      console.log('cancelled!')
      ToastAndroid.show('File selection cancelled!', ToastAndroid.SHORT)
    }

  }

  return (
    <View style={styles.container}>
      {fileLoaded && fileLoaded.length > 0 ? 
        <Text style={styles.title}>{fileLoaded}</Text> : 
        <Text style={styles.title}>No file loaded yet!</Text>
      }
      <Button title="Choose chat file" onPress={() => display()}></Button>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.js" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
