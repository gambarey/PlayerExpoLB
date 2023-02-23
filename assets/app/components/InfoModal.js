import { Modal, StyleSheet, ScrollView, TouchableOpacity, View, Text } from "react-native";
import color from "../misc/color";
import React, { useState } from "react";
const InfoModal = ({
    isVisible,
    onClose,
    currentItem,
}) => {
// const [modalVisible, setModalVisible] = useState(false);

return (
    <Modal visible={isVisible} animationType="slide" transparent>
    <View style={styles.modalContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text>Close</Text>
      </TouchableOpacity>
      <ScrollView>
        <Text>
          <Text>{currentItem.description}</Text>
        </Text>
      </ScrollView>
    </View>
  </Modal>
);
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        position: 'absolute',
        height: '100%',
        width: '100%',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: color.APP_BG,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        zIndex: 1000
      },
      closeButton: {
        alignSelf: 'flex-end',
        margin: 10,
        padding: 5,
        backgroundColor: '#ddd',
      },
});      

export default InfoModal;