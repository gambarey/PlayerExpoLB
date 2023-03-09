import React, { useState, useContext } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  View,
  Dimensions
} from 'react-native';
import color from '../misc/color';
import { AudioContext } from '../context/AudioProvider';
import { MaterialIcons } from '@expo/vector-icons';
import data from '../context/data';
import WebView from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width, height } = Dimensions.get('window');

const Albums = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const context = useContext(AudioContext);
  let albums = data.albums;

  const openModal = album => {
    setSelectedAlbum(album);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedAlbum(null);
    setModalVisible(false);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}
      >
        {albums.map((album, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                navigation.navigate('AudioList', { albumId: album.id });
                // console.log(context)
              }}
              style={styles.albumContainer}
            >
              <Image style={album.width === "16" ? [styles.albumImage, { width: "100%", resizeMode: 'contain' }] : styles.albumImage}
                source={{ uri: album.artwork }} />
              <Text style={styles.albumTitle}>{album.title}</Text>
              <Text style={styles.albumAudioCount}>{album.songs} </Text>
              <MaterialIcons
                name="info"
                size={34}
                color="black"
                style={styles.infoButton}
                onPress={() => openModal(album)}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {selectedAlbum && (
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <MaterialIcons name="close" size={28} color="black" />
            </TouchableOpacity>
            <ScrollView>
              {selectedAlbum.photo1 &&
                <Image
                  // if selectedAlbum.width === 16, add resizeMode="contain" to styles.descriptionImage
                  style={styles.descriptionImage}
                  source={{ uri: selectedAlbum.photo1 }} />
              }
              <Text style={styles.creditsText}>
                {selectedAlbum.credits}
              </Text>
              <Text style={styles.descriptionText}>
                {selectedAlbum.description1}
              </Text>
              {selectedAlbum.photo2 &&
                <Image style={styles.descriptionImage} source={{ uri: selectedAlbum.photo2 }} />
              }
              <Text style={styles.descriptionText}>
                {selectedAlbum.description2}
              </Text>
              {selectedAlbum.video1 &&
                <YoutubePlayer
                  height={200}
                  play={false}
                  videoId={selectedAlbum.video1}
                  webViewStyle={{ opacity: 0.99 }}
                />
              }
              <Text style={styles.descriptionText}>
                {selectedAlbum.description3}
              </Text>
              {selectedAlbum.photo3 &&
                <Image style={styles.descriptionImage} source={{ uri: selectedAlbum.photo3 }} />
              }
            </ScrollView>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    // flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  albumContainer: {
    backgroundColor: 'rgba(204,204,204,0.3)',
    padding: 5,
    borderRadius: 5,
    marginBottom: 15,
    width: '48%',
  },
  albumAudioCount: {
    // move element to bottom overlay
    marginTop: 'auto',
    padding: 5,
    opacity: 0.5,
    fontSize: 14,
  },
  albumTitle: {
    color: color.ACTIVE_BG,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.2,
    padding: 5,
    textAlign: 'center',
    marginBottom: 10,
  },
  albumImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: width - 15,
    height: height - 250,
    backgroundColor: 'gray',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 100,
    padding: 10,
    margin: "2%",
  },
  closeButton: {
    alignSelf: 'flex-end',
    margin: 5,
    padding: 5,
  },
  infoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 10,
  },
  descriptionImage: {
    width: '100%',
    height: 250,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    margin: 20,
  },
  creditsText: {
    fontSize: 14,
    margin: 10,
    fontWeight: 'bold',
  }

});

export default Albums;


