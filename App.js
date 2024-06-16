import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Voice from '@react-native-community/voice';

const App = () => {
  const [recording, setRecording] = useState(false);
  const [message, setMessage] = useState('');
  const text = 'hello world';
  

  const speechStartHandler = e => {
    console.log('Speech started');
  };

  const speechEndHandler = e => {
    setRecording(false);
    console.log('Speech ended');
  };

  const speechResultsHandler = e => {
    console.log('voice event', e);
    let a = e.value[0];
    let trimmedmsg = a.toString().replaceAll(' ', '').toLowerCase()
    setMessage(trimmedmsg);
  };

  const speechErrorHandler = e => {
    console.log('Speech error', e.error);
  };

  const startRecording = async () => {
    setRecording(true);
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // Function to compare message with text
  const compareText = () => {
    // Trim and convert text to lowercase to normalize
    const trimmedtext = text.replaceAll(' ','').toLowerCase()
    console.log('trimmed text', trimmedtext)
    
    console.log('message', message)
    let result = message.localeCompare(trimmedtext);
    if (result === 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <View style={{ height:90, borderRadius: 30, borderWidth:2, marginTop:300, marginHorizontal:20, marginBottom:20, justifyContent:'center'}}>
        <Text style={{ textAlign: 'center', fontSize: 20, color: compareText() ? 'green' : 'red' }}>
          {message}
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 100,
        }}>
        {recording ? (
          <TouchableOpacity onPress={stopRecording}>
            <Image
              source={require('./assest/micstop.webp')}
              style={{ width: 40, height: 50 }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={startRecording}>
            <Image
              source={require('./assest/mic.png')}
              style={{ width: 60, height: 60 }}
            />
          </TouchableOpacity>
        )}
        {recording ? (
          <Text style={{ fontSize: 20, color: 'red' }}>Recording...</Text>
        ) : (
          <Text style={{ fontSize: 20, color: 'green' }}>Press mic to record</Text>
        )
        }
      </View>
    </View>
  );
};

export default App;
