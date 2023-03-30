import React, {useContext} from 'react'
import { Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../CredentialsContext';
import {
  StyledButton,
  ButtonText,
} from '../styles/styles'


export default function Welcome() {

  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
  const {name, email} = storedCredentials;

  console.log(name, email);

  const clearLogin = () =>{
    AsyncStorage
    .removeItem('projectKapaCredentials')
    .then(()=>{
      setStoredCredentials("");
    })
    .catch(error => console.log(error))
  }

  return (
    <View>
      <Text>{name}</Text>
      <Text>{email}</Text>
      <StyledButton onPress={clearLogin}>
        <ButtonText>Logout</ButtonText>
      </StyledButton>

    </View>
  )

}
