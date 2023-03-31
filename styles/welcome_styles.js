import styled from 'styled-components';
import {View, Text, TouchableOpacity} from 'react-native'
import  Constants from 'expo-constants';

export const Colors = {
    primary: '#ffffff',
    secondary: '#E5E7EB',
    tertiary: '#1F2937',
    darkLight: '#9CA3AF',
    brand: '#6D28D9',
    green: '#10B981',
    red: '#EF4444'
};

const {primary, secondary, tertiary, darkLight, brand, green, red} = Colors;

export const WelcomeContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-horizontal: 20px;
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  margin-bottom: 10px;
  text-align: center;
`;

export const InfoContainer = styled.View`
  margin-bottom: 20px;
`;

export const InfoTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const InfoText = styled.Text`
  font-size: 16px;
`;

export const LogoutButton = styled.TouchableOpacity`
  margin-top: 20px;
  width: 100%;
  background-color: ${green};
`;
