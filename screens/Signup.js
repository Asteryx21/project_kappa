import React, { useState, useContext } from 'react';
import {View, ActivityIndicator} from 'react-native';
import {SERVER_HOST} from '@env'
import { StatusBar } from 'expo-status-bar';
import {Formik} from 'formik';
import {Octicons, Ionicons} from '@expo/vector-icons'

import {
  InnerContainer,
  StyledContainer,
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


export default function Signup({navigation})  {

  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();


  const handleSignup = (credentials, setSubmitting) => {
    handleMessage(null);
    const APIURL = `http://${SERVER_HOST}/test/signup.php`;

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
        } else {
          handleMessage(res[0].info, 'Success')
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


  return (
    <KeyboardWrapper>
    <StyledContainer>
      <StatusBar style='dark' />
      <InnerContainer>
        <SubTitle>Εγγραφή</SubTitle>
        <Formik
        initialValues={{username: '',  email:'',password:'', confirmPassword:''}}
        onSubmit={(values, {setSubmitting}) => { 
          if (values.username== '' || values.email== '' || values.password=='' || values.confirmPassword==''){
            handleMessage('Please fill all the fields');
            setSubmitting(false);
          }else{
            handleSignup(values, setSubmitting);
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
            label="Username" 
            icon="person" 
            placeholder="Enter your username..." 
            placeholderTextColor = {Colors.darkLight}
            onChangeText= {handleChange('username')}
            onBlur = {handleBlur('username')}
            value={values.username}
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
            <MyTextInput 
            label="Confirm Password" 
            icon="lock" 
            placeholder="* * * * * * * " 
            placeholderTextColor = {Colors.darkLight}
            onChangeText= {handleChange('confirmPassword')}
            onBlur = {handleBlur('confirmPassword')}
            value={values.confirmPassword}
            secureTextEntry={hidePassword}
            isPassword = {true}
            hidePassword = {hidePassword}
            setHidePassword = {setHidePassword}
            />
            <MsgBox type={messageType}>{message}</MsgBox>

            {!isSubmitting && <StyledButton name='signup' onPress={handleSubmit}>
              <ButtonText>
                Εγγραφή
              </ButtonText>
            </StyledButton>}

            {isSubmitting && <StyledButton disabled={true}>
              <ActivityIndicator size='large' color={Colors.primary} />
            </StyledButton>}

            <Line/>
            <ExtraView>
              <ExtraText>Έχετε λογαριασμό;</ExtraText>
              <TextLink onPress={() => navigation.navigate('Login')}>
                <TextLinkContent>Σύνδεση</TextLinkContent>
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