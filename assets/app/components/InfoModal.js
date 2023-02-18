import { Modal, StyleSheet, ScrollView, TouchableOpacity, View, Text } from "react-native";

const InfoModal = ({
    visible,
    onClose,
    currentItem,
}) => {
const [modalVisible, setModalVisible] = useState(false);

return (
    <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text>Close</Text>
            </TouchableOpacity>

            <ScrollView>
                {/* Your modal content goes here */}
            </ScrollView>
        </View>
    </Modal>
);
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
      },
      closeButton: {
        alignSelf: 'flex-end',
        margin: 10,
        padding: 5,
        backgroundColor: '#ddd',
      },
});      

export default InfoModal;