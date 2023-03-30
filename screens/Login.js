import React, { useState, useContext } from 'react';
import {ActivityIndicator, View} from 'react-native';


import { StatusBar } from 'expo-status-bar';
import {Formik} from 'formik';
import {Octicons, Ionicons} from '@expo/vector-icons'

import {
  InnerContainer,
  StyledContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  StyledButton,
  ButtonText,
  Colors,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
} from '../styles/styles'

import KeyboardWrapper from '../KeyboardWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../CredentialsContext';

export default function Login({navigation})  {

  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)

  const handleLogin = (credentials, setSubmitting) => {
    handleMessage(null);
    const APIURL = "http://localhost/test/login.php";

    credentials.login = 'true' ;

    const headers = {
      'Accept' : 'application/json',
      'Content-Type' : 'application/json'
    };
          
    fetch(APIURL,{
      method: 'POST',
      headers: headers,
      body: JSON.stringify(credentials)
    })
    .then((response) => response.json())
    .then((res) => {
      try {
        console.log(res[0].Message);
        if (res[0].Message !== 'Success'){
          handleMessage(res[0].Message)
        } else if (res[0].Message == 'Success' && res[0].status == 'verified'){
          //navigation.navigate('Welcome')
          persistLogin({...res[0]})

        } else if (res[0].status !== 'verified'){
          navigation.navigate('CodeVerification')
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

  const persistLogin = (credentials, message, status) =>{
    AsyncStorage.setItem('projectKapaCredentials', JSON.stringify(credentials))
    .then(()=> {
      handleMessage(message,status)
      setStoredCredentials(credentials);
    })
    .catch((error)=>{
      console.log(error)
      handleMessage('Persisting login failed');
    })
  }

  return (
    <KeyboardWrapper>
    <StyledContainer>
      <StatusBar style='dark' />
      <InnerContainer>
        <PageLogo resizeMode="cover" source={require('../assets/logo.png')}/>
        <PageTitle>Project kAPPa</PageTitle>
        <SubTitle>Σύνδεση</SubTitle>
        <Formik
        initialValues={{email:'', password:''}}
        onSubmit={(values, {setSubmitting}) => { 
          if (values.email== '' || values.password==''){
            handleMessage('Please fill all the fields');
            setSubmitting(false);
          }else{
            handleLogin(values, setSubmitting);
          }
         
        }}
        >
        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
          <StyledFormArea>
            <MyTextInput 
            label="Email Address" 
            icon="mail" 
            placeholder="youremail@mail.com" 
            placeholderTextColor = {Colors.darkLight}
            onChangeText= {handleChange('email')}
            onBlur = {handleBlur('email')}
            value={values.email}
            keyboardType='email-address'
            />
            <MyTextInput 
            label="Password" 
            icon="lock" 
            placeholder="* * * * * * * " 
            placeholderTextColor = {Colors.darkLight}
            onChangeText= {handleChange('password')}
            onBlur = {handleBlur('password')}
            value={values.password}
            secureTextEntry={hidePassword}
            isPassword = {true}
            hidePassword = {hidePassword}
            setHidePassword = {setHidePassword}
            />
            <MsgBox type={messageType}>{message}</MsgBox>
            {!isSubmitting && <StyledButton name='login' onPress={handleSubmit}>
              <ButtonText>
                Login
              </ButtonText>
            </StyledButton>}

            {isSubmitting && <StyledButton disabled={true}>
              <ActivityIndicator size='large' color={Colors.primary} />
            </StyledButton>}

            <Line/>
            <ExtraView>
              <ExtraText>Δεν έχετε λογαριασμό;</ExtraText>
              <TextLink onPress={() => navigation.navigate('Signup')}>
                <TextLinkContent >Εγγραφή</TextLinkContent>
              </TextLink>
            </ExtraView>
          </StyledFormArea>
        )}
        </Formik>
      </InnerContainer>
    </StyledContainer>
    </KeyboardWrapper>
  );
};

const MyTextInput = ({label,icon, isPassword, hidePassword, setHidePassword, ...props}) =>{
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={Colors.brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
      { isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)} >
          <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={Colors.darkLight} />
        </RightIcon>
      )}
    </View>
  )
}