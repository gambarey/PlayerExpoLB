import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import color from '../misc/color';
import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { AudioContext } from '../context/AudioProvider';
import { play, pause, resume, playNext, selectAudio, changeAudio, moveAudio } from '../misc/AudioController';
import { convertTime, storeAudioForNextOpening } from '../misc/helper';
import Screen from '../components/Screen';
import { MaterialIcons } from '@expo/vector-icons';
import InfoModal from '../components/InfoModal';

const { width, height } = Dimensions.get('window');

const Player = () => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration, currentAudio } = context;

  const calculateSeekBar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }

    if (currentAudio.lastPosition) {
      return currentAudio.lastPosition / (currentAudio.duration * 1000);
    }

    return 0;
  }

  useEffect(() => {
    context.loadPreviousAudio();
  }, []);

  const handlePlayPause = async () => {
    // play audio
    await selectAudio(context.currentAudio, context);
  }

  const handleNext = async () => {
    if (!context.currentAudio.lastTrack) {
      await changeAudio(context, 'next');
    }
  }

  const handlePrevious = async () => {
    if (!context.currentAudio.firstTrack) {
      await changeAudio(context, "previous");
    }
  }

  if (!context.currentAudio) {
    return null;
  }

  const renderCurrentTime = () => {
    if (!context.soundObj && currentAudio.lastPosition) {
      return convertTime(currentAudio.lastPosition / 1000);
    }
    return convertTime(context.playbackPosition / 1000);
  }

  const [modalVisible, setModalVisible] = useState(false);
  let song = context.currentAudio;

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // console.log(context.currentAudio);

  return (
    <Screen>
      <View style={styles.container}>
        {/* <View style={styles.audioCountContainer}>
          <View style={{ flexDirection: "row" }}>
            {context.isPlayListRunning && (
              <>
                <Text style={{ fontWeight: "bold" }}>From Playlist: </Text>
                <Text>{context.activePlayList.title}</Text>
              </>
            )}
          </View>
          <Text style={styles.audioIndex}>
            {`${context.currentAudioIndex + 1} / ${context.totalAudioCount}`}
          </Text>
        </View> */}
        <View style={styles.midBannerContainer}>
          <Image
            source={{ uri: song.artwork }}
            style={{ width: 350, height: 350 }}
          />
          {/* <MaterialCommunityIcons
            name="music-circle"
            size={300}
            color={context.isPlaying ? color.ACTIVE_BG : color.FONT_LIGHT} /> */}
        </View>
        <MaterialIcons
          name="info"
          size={34}
          color="black"
          style={{ marginLeft: "83%", marginTop: 20 }}
          onPress={openModal}
        />
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={3}
            style={[styles.audioTitle
              , {
                fontSize: song.filename.length > 20 ? 20 : 28
            }
            ]} >
            {song.filename}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 15
            }}
          >
            <Text>{currentPosition ? currentPosition : renderCurrentTime()}</Text>
            <Text>{convertTime(song.duration)}</Text>
          </View>
          <Slider
            style={{ width: width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeekBar()}
            minimumTrackTintColor={color.FONT_MEDIUM}
            maximumTrackTintColor={color.ACTIVE_BG}
            onValueChange={value => {
              setCurrentPosition(
                convertTime(value * song.duration));
            }}
            onSlidingStart={async () => {
              if (!context.isPlaying)
                return;
              try {
                await pause(context.playbackObj);
              } catch (error) {
                console.log("error inside onSlidingStart callback", error.message)
              }
            }}
            onSlidingComplete={async value => {
              await moveAudio(context, value);
              setCurrentPosition(0);
            }}
          />
          <View style={styles.audioControllers}>
            <PlayerButton
              onPress={handlePrevious}
              iconType="backward" />
            <PlayerButton
              onPress={handlePlayPause}
              iconType={context.isPlaying ? "pause" : "play"} />
            <PlayerButton
              onPress={handleNext}
              iconType="forward" />
          </View>
        </View>
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text>Close</Text>
          </TouchableOpacity>
          <ScrollView>
            <Text>
              {song.description}
            </Text>
          </ScrollView>
        </View>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBg} />
        </TouchableWithoutFeedback>
      </Modal>

    </Screen>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  audioCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  audioControllers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
    marginHorizontal: 40,
    marginVertical: 20
  },
  audioCount: {
    color: color.FONT_LIGHT,
    textAlign: 'right',
    fontSize: 14
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  audioTitle: {
    textAlign: "center",
    textTransform: "capitalize",
    marginVertical: 20,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: width - 15,
    height: height - 350,
    backgroundColor: 'gray',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 100,
    padding: 10,
    margin: "2%",
  },
  closeButton: {
    // alignSelf: 'flex-end',
    margin: 10,
    padding: 5,
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  modalBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: color.MODAL_BG
  }
});

//make this component available to the app
export default Player;
