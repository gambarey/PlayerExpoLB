import { Modal, StyleSheet, ScrollView, TouchableOpacity, View, Text } from "react-native";
import color from "../misc/color";
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
        position: 'absolute',
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