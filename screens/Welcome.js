import React, {useContext} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../CredentialsContext';

import {
  WelcomeContainer ,
  Title ,
  Subtitle ,
  InfoContainer  ,
  InfoTitle  ,
  InfoText  ,
} from '../styles/welcome_styles'

import {StyledButton, ButtonText} from '../styles/styles'



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
    <WelcomeContainer>
      <Title>Welcome {name}!</Title>
      <Subtitle>Thank you for joining our platform.</Subtitle>
      <InfoContainer>
        <InfoTitle>Calendar</InfoTitle>
        <InfoText>
          In the Calendar section, you can view upcoming events posted by our team. If you're interested in participating, simply click on the event to declare your interest.
        </InfoText>
      </InfoContainer>
      <InfoContainer>
        <InfoTitle>Maps</InfoTitle>
        <InfoText>
          In the Maps section, you can view areas where our team has completed clean-ups (marked with green markers). You can also report a polluted area by clicking on the map and selecting the "Report" option.
        </InfoText>
      </InfoContainer>
   
      <StyledButton onPress={clearLogin}>
        <ButtonText>
        Logout
        </ButtonText>
      </StyledButton>
    </WelcomeContainer>
  )

}