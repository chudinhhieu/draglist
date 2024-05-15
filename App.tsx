import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
  TextInput,
  Vibration,
  FlatList,
} from 'react-native';
import DragList, { DragListRenderItemInfo } from 'react-native-draglist';
const list1 = ['Form Name', 'Category', 'Patients’s First Name', 'Label'];
const list2 = ['Form Name', 'Category', 'Patients’s First Name', 'Label', "Item 1", 'Item 2', 'Item 3'];
function App(): React.JSX.Element {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [data, setData] = useState(list1);
  const [difference, setDifference] = useState(list2.filter(item => !list1.includes(item)));
  const [modalVisible2, setModalVisible2] = useState(false);
  const [editedItemIndex, setEditedItemIndex] = useState(0);
  const [editedItemContent, setEditedItemContent] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  function keyExtractor(str: string) {
    return str;
  }
  const onModalConfirm = () => {
    const newData: string[] = [...data];
    newData[editedItemIndex] = editedItemContent;
    setData(newData);
    setModalVisible(false);
  }
  const onItemPress = (item: string) => {
    setSelectedItems(prevSelectedItems => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter(selectedItem => selectedItem !== item);
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };
  const onSaveSelectedItems = () => {
    const newData = [...data, ...selectedItems];
    setData(newData);
    setDifference(list2.filter(item => !newData.includes(item)));
    setModalVisible2(false);
    setSelectedItems([]);
  };

  function renderItem(info: DragListRenderItemInfo<string>) {
    const { item, onDragStart, onDragEnd, isActive } = info;

    const onDeleteItem = () => {
      const newData = data.filter((i) => i !== item);
      setData(newData);
    };
    
    const onEditItem = (index: number) => {
      setEditedItemIndex(index);
      setEditedItemContent(data[index]);
      setModalVisible(true);
    };
    
    return (
      <TouchableOpacity
        key={item}
        onLongPress={() => {
          onDragStart();
          Vibration.vibrate([10, 10], false);
        }}
        onPressOut={onDragEnd}
        style={isActive ? {
          backgroundColor: 'white',
          paddingVertical: 8,
          paddingHorizontal: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 5,
        } : { backgroundColor: "white", marginBottom: 17 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: '#828282', fontSize: 14, marginEnd: 24 }}>{item}</Text>
          <TouchableOpacity onPress={() => onEditItem(data.indexOf(item))}>
            <Image source={require('./assets/edit.png')} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 17 }}>
          <TextInput style={{ borderWidth: 1, borderColor: '#D4DFE3', flex: 1, height: 31, marginEnd: 20 }} />
          <TouchableOpacity onPress={onDeleteItem}>
            <Image source={require('./assets/delete.png')} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  async function onReordered(fromIndex: number, toIndex: number) {
    const copy = [...data];
    const removed = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, removed[0]);
    setData(copy);
  }
  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'white'}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ alignSelf: 'center', backgroundColor: 'green', padding: 15, borderRadius: 5 }}><Text style={{ color: 'white', fontWeight: 'bold' }}>Show Modal</Text></TouchableOpacity>
      </View>
      
      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible1}
          onRequestClose={() => {
            setModalVisible1(false);
          }}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5 }}>
              <Text style={{ color: 'black', fontWeight: '600', fontSize: 18, marginBottom: 10, alignSelf: 'center' }} >Edit Title</Text>
              <TextInput
                value={editedItemContent}
                onChangeText={(text) => setEditedItemContent(text)}
                style={{ borderWidth: 1, borderColor: '#D4DFE3', marginBottom: 20, width: 200, height: 45, color: 'black' }}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ backgroundColor: 'green', padding: 10, borderRadius: 5 }} onPress={onModalConfirm}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: 'red', padding: 10, borderRadius: 5 }} onPress={() => setModalVisible1(false)} >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible2}
          onRequestClose={() => {
            setModalVisible2(false);
          }}
        >
          <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 16, paddingStart: 16, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: 'white', borderRadius: 5, borderColor: '#D4DFE3', borderWidth: 1, width: 266, padding: 16 }}>
              <Text style={{ color: 'black', fontWeight: '600', fontSize: 14, marginTop: 5, marginBottom: 15 }}>Form Fields</Text>
              <FlatList
                data={difference}
                keyExtractor={keyExtractor}
                renderItem={({ item }) => {
                  const isSelected = selectedItems.includes(item);
                  return (
                    <TouchableOpacity
                      style={{
                        borderRadius: 5,
                        borderColor: isSelected ? 'red' : '#D4DFE3',
                        borderWidth: 1,
                        padding: 8,
                        marginBottom: 5
                      }}
                      onPress={() => onItemPress(item)}
                    >
                      <Text style={{ color: '#828282', fontSize: 12, textAlign: 'center' }}>{item}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
              <TouchableOpacity
                style={{ marginTop: 15, backgroundColor: '#007BFF', borderRadius: 5, borderWidth: 1, borderColor: '#D4DFE3', padding: 10, height: 37 }}
                onPress={onSaveSelectedItems}
              >
                <Text style={{ color: 'white', fontWeight: '500', fontSize: 12, alignSelf: 'center' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          flex: 1,
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: '#ffffff',
            maxHeight: '80%',
            minHeight: '50%',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 15,
            paddingVertical: 20
          }}>
            <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Image style={{ width: 25, height: 25 }} source={require('./assets/menu.png')} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Image style={{ width: 25, height: 25 }} source={require('./assets/close-button.png')} />
              </TouchableOpacity>
            </View>
            <Text style={{ color: 'black', fontWeight: '600', fontSize: 17, marginTop: 5 }}>New Form</Text>
            <Text style={{ color: 'black', fontWeight: '500', fontSize: 14, marginTop: 5, marginBottom: 15 }}>Basic Information</Text>
            <DragList
              data={data}
              keyExtractor={keyExtractor}
              onReordered={onReordered}
              renderItem={renderItem}
            />
            <TouchableOpacity style={{ marginTop: 45, backgroundColor: '#007BFF', borderRadius: 5, borderWidth: 1, alignSelf: 'flex-end', width: 115, borderColor: '#D4DFE3', padding: 10, height: 37 }}>
              <Text style={{ color: 'white', fontWeight: '500', fontSize: 12, alignSelf: 'center' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

});

export default App;
