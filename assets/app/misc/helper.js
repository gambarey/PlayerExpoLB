import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeAudioForNextOpening = async (audio, index, lastPosition) => {
  try {
    await AsyncStorage.setItem('previousAudio',
      JSON.stringify({ audio: { ...audio, lastPosition }, index }));
  } catch (error) {
    console.log("error storeAudioForNextOpening method", error.message);
  }
};

export const convertTime = seconds => {
  let min = Math.floor(seconds / 60);
  let sec = Math.floor(seconds % 60);
  if (sec < 10) {
    sec = `0${sec}`;
  }
  return `${min}:${sec}`;

};