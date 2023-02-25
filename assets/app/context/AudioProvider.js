import React, { Component, createContext } from 'react';
import { Alert } from 'react-native';
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from 'recyclerlistview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { storeAudioForNextOpening } from '../misc/helper';
import { playNext } from '../misc/AudioController';
// import {songs} from "./data.js"

export const AudioContext = createContext();
export class AudioProvider extends Component {

  constructor(props) {
    super(props)
    this.state = {
      audioFiles: [],
      playList: [],
      addToPlayList: null,
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      playbackObj: null,
      soundObj: null,
      currentAudio: {},
      isPlaying: false,
      isPlayListRunning: false,
      activePlayList: [],
      currentAudioIndex: null,
      playbackPosition: null,
      playbackDuration: null,
    };
    this.totalAudioCount = 0;
  }

  // permissionAlert = () => {
  //   Alert.alert("Permission Required", "This app needs permission to read audio files",
  //     [{
  //       text: "Ok",
  //       onPress: () => this.getPermission()
  //     }, {
  //       text: "Cancel",
  //       onPress: () => this.permissionAlert()
  //     },
  //     ]);
  // };

  getAudioFiles = async () => {
    const { dataProvider, audioFiles } = this.state;
const media = require("./data.js");
    this.totalAudioCount = media.totalCount;
    // console.log(media)
    

    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows([...audioFiles, ...media.assets,]),
      audioFiles: [...audioFiles, ...media.assets],
    });
  };
  

  loadPreviousAudio = async () => {
    let previousAudio = await AsyncStorage.getItem("previousAudio");
    let currentAudio;
    let currentAudioIndex;

    if (previousAudio === null) {
      currentAudio = this.state.audioFiles[0];
      currentAudioIndex = 0;
    } else {
      previousAudio = JSON.parse(previousAudio);
      currentAudio = previousAudio.audio;
      currentAudioIndex = previousAudio.index;
    }

    this.setState({
      ...this.state,
      currentAudio,
      currentAudioIndex,
    });

  };

  getPermission = async () => {
    // { 
    // "canAskAgain": true, 
    // "expires": "never", 
    // "granted": false, 
    // "status": "undetermined" 
    // }
    /////////////////////////////////////////////
    const permission = await MediaLibrary.getPermissionsAsync()
    if (permission.granted) {
      this.getAudioFiles();
    }

    if (!permission.canAskAgain && !permission.granted) {
      this.setState({ ...this.state, permissionError: true });
    }
    if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();
      if (status === "denied" && canAskAgain) {
        this.permissionAlert();
      }
      if (status === "granted") {
        this.getAudioFiles();
      }
      if (status === "denied" && !canAskAgain) {
        this.setState({ ...this.state, permissionError: true });
      }
    }
  };

  onPlaybackStatusUpdate = async playbackStatus => {
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      this.updateState(this, {
        playbackPosition: playbackStatus.positionMillis,
        playbackDuration: playbackStatus.durationMillis
      });
    }

    if (playbackStatus.isLoaded && !playbackStatus.isPlaying) {
      storeAudioForNextOpening(
        this.state.currentAudio,
        this.state.currentAudioIndex,
        playbackStatus.positionMillis
      );
    }

    if (playbackStatus.didJustFinish) {
      if (this.state.isPlayListRunning) {
        let audio;
        const indexOnPlayList = this.state.activePlayList.audios.findIndex(
          ({ id }) => id === this.state.currentAudio.id
        );
        const nextIndex = indexOnPlayList + 1;
        audio = this.state.activePlayList.audios[nextIndex];

        if (!audio) audio = this.state.activePlayList.audios[0];

        const indexOnAllList = this.state.audioFiles.findIndex(
          ({ id }) => id === audio.id
        );

        const status = await playNext(this.state.playbackObj, audio.uri);
        return this.updateState(this, {
          soundObj: status,
          isPlaying: true,
          currentAudio: audio,
          currentAudioIndex: indexOnAllList,
        });
      }

      const nextAudioIndex = this.state.currentAudioIndex + 1;
      // last audio in the list (no next audio)
      if (nextAudioIndex >= this.totalAudioCount) {
        this.state.playbackObj.unloadAsync();
        this.updateState(this, {
          soundObj: null,
          currentAudio: this.state.audioFiles[0],
          isPlaying: false,
          currentAudioIndex: 0,
          playbackPosition: null,
          playbackDuration: null,
        });
        return await storeAudioForNextOpening(this.state.audioFiles[0], 0);
      }
      // play next audio
      const audio = this.state.audioFiles[nextAudioIndex];
      const status = await playNext(this.state.playbackObj, audio.uri);
      this.updateState(this, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex
      });
      await storeAudioForNextOpening(audio, nextAudioIndex);
    }
  };

  componentDidMount() {
    this.getPermission();
    if (this.state.playbackObj === null) {
      this.setState({ ...this.state, playbackObj: new Audio.Sound() });
    }
  }

  updateState = (prevState, newState) => {
    this.setState({ ...prevState, ...newState })
  }

  

  render() {
    const {
      audioFiles,
      playList,
      addToPlayList,
      dataProvider,
      permissionError,
      playbackObj,
      soundObj,
      currentAudio,
      isPlaying,
      isPlayListRunning,
      activePlayList,
      currentAudioIndex,
      playbackPosition,
      playbackDuration,
    } = this.state;
    // if (permissionError)
    //     return (
    // <View style={{
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center'
    // }}>
    //     <Text style={{ fontSize: 24, textAlign: 'center' }}>
    //         You haven´t allowed the app to access files on your device
    //     </Text>
    //     <TouchableOpacity style={{marginTop: 20, backgroundColor: "green", borderRadius: 5, padding: 10}} onPress={this.permissionAlert}>
    //         <Text style={{ fontSize: 18, textAlign: 'center' }}>Grant permissions</Text>
    //     </TouchableOpacity>
    // </View>
    // );
    return (
      <AudioContext.Provider
        value={{
          audioFiles,
          playList,
          addToPlayList,
          dataProvider,
          playbackObj,
          soundObj,
          currentAudio,
          isPlaying,
          isPlayListRunning,
          activePlayList,
          currentAudioIndex,
          totalAudioCount: this.totalAudioCount,
          playbackPosition,
          playbackDuration,
          updateState: this.updateState,
          loadPreviousAudio: this.loadPreviousAudio,
          onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
        }}
      >
        {this.props.children}
      </AudioContext.Provider >
    );
  }
}

export default AudioProvider;
