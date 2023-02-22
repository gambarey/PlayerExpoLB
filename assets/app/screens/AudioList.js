import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import { AudioContext } from '../context/AudioProvider';
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from '../components/OptionModal';
import { Audio } from 'expo-av';
import { play, pause, resume, playNext, selectAudio } from '../misc/AudioController';
import { storeAudioForNextOpening } from '../misc/helper';

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
    };
    this.currentItem = [];
  }

  layoutProvider = new LayoutProvider((i) => "audio", (type, dim) => {
    dim.width = Dimensions.get("window").width;
    dim.height = 70;
  })

  handleAudioPress = async audio => {
    await selectAudio(audio, this.context);
    this.props.navigation.navigate("Player");
  }

  componentDidMount() {
    this.context.loadPreviousAudio();
  }

  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.filename}
        isPlaying={extendedState.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
        duration={item.duration}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true })
        }}
      />
    );
  }

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying }) => {
          if (!dataProvider._data.length) {
            return null;
          }
          return (
            <Screen>
              <RecyclerListView
              // get albumId from props and filter dataProvider
                // dataProvider={dataProvider}
                // console.log this.props.route.params.albumId            
                 dataProvider={dataProvider.cloneWithRows(dataProvider._data.filter(item => item.albumId === (this.props.route.params.albumId === undefined ? "1" : this.props.route.params.albumId)))} 
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }}
              />
            </Screen>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default AudioList


