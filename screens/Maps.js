import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { MapOverlay, MapContainer,UploadTextInput } from '../styles/styles';

export default function MapScreen() {
  const [locations, setLocations] = useState([]);
  const [selectedGreenLocation, setSelectedGreenLocation] = useState('');
  const [selectedRedLocation, setSelectedRedLocation] = useState({ description: '', image: '' });
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    fetch('http://localhost/test/get_locations.php')
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
    setSelectedGreenLocation('');
    setSelectedRedLocation({ description: '', image: '' });
  };

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setCurrentPosition(coordinate);
    setSelectedLocation({ type: 'undefined', latitude: coordinate.latitude, longitude: coordinate.longitude });
    setShowOverlay(false);
  };

  return (
    <MapContainer>
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
        {locations.map(location => (
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
        ))}
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
              <Image style={{ height: 100, width: 100 }} source={require('../assets/9333871.png')} />
            </View>
          )}
          {selectedLocation.type === 'undefined' && (
            <View>
              <UploadTextInput editable={false} >{selectedLocation.latitude}</UploadTextInput>
              <UploadTextInput editable={false} >{selectedLocation.longitude}</UploadTextInput>
            </View>
          )}
        </MapOverlay>
      )}
    </MapContainer>
  )
}