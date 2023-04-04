import React, { useEffect, useState,useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Modal, Button } from 'react-native';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import { CredentialsContext } from '../CredentialsContext';
import {SERVER_HOST} from '@env'

export default function CalendarScreen() {
  const [items, setItems] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [buttonText, setButtonText] = useState("I'm Interested");
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
  const {userID, name, email} = storedCredentials;

  useEffect(() => {
    const getData = async () => {
      const response = await fetch(
        `http://${SERVER_HOST}/test/get_events.php`,
      );
      const data = await response.json();
      const formattedData = {};
      data.forEach(item => {
        formattedData[item.start] = [{ title: item.title, description: item.description, participants: item.participants, id: item.id }];
      });
      setItems(formattedData);
    };
    getData();
  }, []);

  const renderItem = (item) => {    
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => openModal(item)}>
        <Text>{item.title}</Text>
      </TouchableOpacity>
    );
  };
  const renderEmptyData = () => {
    return (
      <View style={styles.itemContainer}>
        <Text>No event today</Text>
      </View>
    );
  };
  const openModal = (item) => {
    const APIURL = `http://${SERVER_HOST}/test/update_participants.php`;
    const data = {
      user_id: userID,
      drasi_id: item.id,
    };
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    fetch(APIURL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === 1) {
          setButtonText("I'm Not Interested");
        } else if (response.status === 2) {
          setButtonText("I'm Interested");
        }
      })
      .catch((error) => {
        console.error("Error updating participants:", error);
      });

    setSelectedItem(item);
  };
  const closeModal = () => {
    setSelectedItem(null);
  };

  const toggleInterested = () => {
    const APIURL = `http://${SERVER_HOST}/test/update_participants.php`;
    const data = {
      user_id: userID,
      drasi_id: selectedItem.id,
      button: 'Pressed'
    };
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  
    fetch(APIURL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === 1) {
          setButtonText("I'm Interested");
          setSelectedItem({
            ...selectedItem,
            participants: parseInt(selectedItem.participants) - 1
          });
  
          // Find the correct date key in items and update the corresponding item
          const dateKey = Object.keys(items).find(key => {
            return items[key][0].id === selectedItem.id;
          });
          const updatedItems = {
            ...items,
            [dateKey]: [{
              ...items[dateKey][0],
              participants: parseInt(selectedItem.participants) - 1
            }]
          };
          setItems(updatedItems);
  
        } else if (response.status === 2) {
          setButtonText("I'm Not Interested");
          setSelectedItem({
            ...selectedItem,
            participants: parseInt(selectedItem.participants) + 1
          });
  
          // Find the correct date key in items and update the corresponding item
          const dateKey = Object.keys(items).find(key => {
            return items[key][0].id === selectedItem.id;
          });
          const updatedItems = {
            ...items,
            [dateKey]: [{
              ...items[dateKey][0],
              participants: parseInt(selectedItem.participants) + 1
            }]
          };
          setItems(updatedItems);
        }
      })
      .catch((error) => {
        console.error("Error updating participants:", error);
      });
  };
  const modal = (
    <Modal
      visible={selectedItem !== null}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <View style={styles.modalContent}>
        <Text>{selectedItem?.title}</Text>
        <Text>{selectedItem?.description}</Text>
        <Text>{selectedItem?.participants}</Text>
        <Button title={buttonText} onPress={toggleInterested}/>
        <Button title="Close" onPress={closeModal} />
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Agenda items={items} renderItem={renderItem}  renderEmptyData={renderEmptyData}/>
      {modal}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    marginTop: 25,
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  modalContent: {
    padding: 10,
    flex: 1,
    marginHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});