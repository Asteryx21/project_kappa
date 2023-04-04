import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Text, View, Image, TouchableOpacity, ActivityIndicator,PermissionsAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {SERVER_HOST} from '@env';
import {Formik} from 'formik';

import {
  UploadTextInput,
  MapOverlay,
  MapContainer,
  DescriptionTextInput,
  InnerContainer,
  SubTitle,
  StyledFormArea,
  StyledButton,
  ButtonText,
  Colors,
  MsgBox,
  ToggleButtons,
  ToggleButton,
} from '../styles/styles'

import KeyboardWrapper from '../KeyboardWrapper';

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message:
          'This app needs access to your location ' +
          'so we can show your current location on the map.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location permission granted');
    } else {
      console.log('Location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}
requestLocationPermission();
export default function Maps() {
  
  const [locations, setLocations] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [showRedMarkers, setShowRedMarkers] = useState(true);
  const [showGreenMarkers, setShowGreenMarkers] = useState(true);
  const [selectedImage, setSelectedImage] = useState();

  const handleRedMarkersToggle = () => {
    setShowRedMarkers(!showRedMarkers);
  };

  const handleGreenMarkersToggle = () => {
    setShowGreenMarkers(!showGreenMarkers);
  };

  useEffect(() => {
    fetch(`http://${SERVER_HOST}/test/get_locations.php`)
      .then(response => response.json())
      .then(data => setLocations(data))
      .catch(error => console.error(error));
  }, []);

  const handleMarkerPress = (location) => {
    setSelectedLocation(location);
    setShowOverlay(true);
  };

  const handleOverlayClose = () => {
    setShowOverlay(false);

  };

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setCurrentPosition(coordinate);
    setSelectedLocation({ type: 'undefined', latitude: coordinate.latitude, longitude: coordinate.longitude });
    setShowOverlay(false);
  };

  const handleUpload = async(values, selectedImage, setSubmitting) => {
    handleMessage(null);
    const APIURL = `http://${SERVER_HOST}/test/report.php`;
   const data = {
      uri: selectedImage.uri,
      base64: selectedImage.base64,
      latitude:values.latitude, 
      longitude: values.longitude, 
      description:values.description
    }

    const headers = {
      'Accept':'application/json',
      'Content-Type': 'application/json',
    };
    
    fetch(APIURL,{
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((res) => {
      try {
        if (res.status !== 1){
          handleMessage(res.message)
        } else {
          const newLocation = {
            id: res.id, 
            type: 'Red',
            latitude: values.latitude,
            longtitude: values.longitude,
            description: values.description,
          };
          setLocations((prevLocations) => [...prevLocations, newLocation]);
          handleMessage(res.message, 'Success');
        }
        setSubmitting(false);
      } catch (error) {
        console.error('JSON parsing error:', error);
        console.log('Response text:', res);
      }
    })
    .catch((error)=>{
      console.error("ERROR FOUND" + error);
      setSubmitting(false);
      handleMessage("An error occured. Check your network and try again");
    });
  

  }
  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  }

  const handleSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      type: 'image',
      base64: true
    });
  
    if (!result.canceled) {
  
      setSelectedImage(result.assets[0]);
    }
  };



  return (
      <MapContainer>
      <ToggleButtons>
        <ToggleButton onPress={handleRedMarkersToggle}>
          <Image source={{ uri: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png' }} style={{width: 15, height: 25, alignSelf: 'center' }} />
          <Text  style={{textAlign: 'center'}}>{showRedMarkers ? 'Hide' : 'Show'}</Text>
        </ToggleButton>
        <ToggleButton onPress={handleGreenMarkersToggle}>
          <Image source={{ uri: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png' }} style={{ width: 15, height: 25, alignSelf: 'center'}} />
          <Text  style={{textAlign: 'center'}}>{showGreenMarkers ? 'Hide' : 'Show '}</Text>
        </ToggleButton>
      </ToggleButtons>
      <MapView
        style={{ height: '100%', width: '100%' }}
        initialRegion={{
          latitude: 38.246639,
          longitude: 21.734573,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
        onPress={handleMapPress}
      >
        {locations.map((location) => {
          if ((location.type === 'Red' && showRedMarkers) || (location.type === 'Green' && showGreenMarkers)) {
            return (
              <Marker
                key={location.type === 'Green' ? 'green' + location.id : 'red' + location.id}
                coordinate={{
                  latitude: parseFloat(location.latitude),
                  longitude: parseFloat(location.longtitude),
                }}
                onPress={() => handleMarkerPress(location)}
                icon={
                  location.type === 'Green'
                    ? { uri: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png' }
                    : { uri: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png' }
                }
              />
            );
          } else {
            return null;
          }
        })}
        {currentPosition && (
          <Marker
            coordinate={currentPosition}
            onPress={() => handleMarkerPress({ type: 'undefined', latitude: currentPosition.latitude, longitude: currentPosition.longitude })}
            icon={{ uri: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'}}
          />
        )}
      </MapView>
      {showOverlay && selectedLocation && (
        <MapOverlay>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity onPress={handleOverlayClose}>
              <Text>X</Text>
            </TouchableOpacity>
          </View>
          {selectedLocation.type === 'Green' && (
            <View>
              <Text>{selectedLocation.description}</Text>
            </View>
          )}
          {selectedLocation.type === 'Red' && (
            <View>
              <Text>{selectedLocation.description}</Text>
              <Image style={{ height: 100, width: 100 }} source={require('../assets/trash.jpeg')} />
            </View>
          )}
          {selectedLocation.type === 'undefined' && (
            <KeyboardWrapper>
              <InnerContainer>
                <SubTitle>Αναφορά περιοχής</SubTitle>
                <Formik
                  initialValues={{latitude: `${selectedLocation.latitude}`,  longitude: `${selectedLocation.longitude}` ,description:''}}
                  onSubmit={(values, {setSubmitting}) => { 
                    if (values.description== ''){
                      handleMessage('Please fill the description');
                      setSubmitting(false);
                    }else{
                      handleUpload(values,selectedImage, setSubmitting);
                    }

                  }}
                  >
                  {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                    <StyledFormArea>
                      <UploadTextInput
                      editable={false}               
                      onBlur = {handleBlur('latitude')}   
                      value={values.latitude}  
                      />
                      <UploadTextInput 
                      editable={false}
                      onBlur = {handleBlur('longitude')}  
                      value={values.longitude}  
                      />
                      <DescriptionTextInput 
                      multiline={true}
                      placeholder="Γράψτε μια περιγραφή (πχ διεύθηνση, τύπος σκουπιδιών)" 
                      placeholderTextColor = {Colors.darkLight}
                      onChangeText= {handleChange('description')}
                      onBlur = {handleBlur('description')}
                      value={values.description}
                      />
                      <StyledButton name='selectImage' onPress={handleSelectImage}>
                        <ButtonText>
                          Επιλέξτε μια φωτογραφία
                        </ButtonText>
                      </StyledButton>
                       <MsgBox type={messageType}>{message}</MsgBox>

                      {!isSubmitting && <StyledButton name='upload' onPress={handleSubmit}>
                        <ButtonText>
                          Αναφορά
                        </ButtonText>
                      </StyledButton>}

                      {isSubmitting && <StyledButton disabled={true}>
                        <ActivityIndicator size='large' color={Colors.primary} />
                      </StyledButton>}

                    </StyledFormArea>
                  )}
                </Formik>
              </InnerContainer>    
              </KeyboardWrapper>   
          )}
        </MapOverlay>
       
      )}
      </MapContainer>
  );
};