import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const CodeVerification = ({navigation}) => {

  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState([]);

  const handleVerification = () => {
    
    if (otp === '') {
      setErrors(['Please enter the verification code']);
    } else {
   
      const otp_code = {otp:otp};
     
      const APIURL = "http://localhost/test/otp.php";
  
      const headers = {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      };
            
      fetch(APIURL,{
        method: 'POST',
        headers: headers,
        body: JSON.stringify(otp_code)
      })
      .then((response) => response.json())
      .then((res) => {
        try {
          console.log(res[0].Message);
          if (res[0].Message !== 'Success'){
            setErrors([res[0].Message]);
          } else {
            navigation.navigate('Login')
          }
  
        } catch (error) {
          console.error('JSON parsing error:', error);
          console.log('Response text:', res);
        }
      })
      .catch((error)=>{
        console.error("ERROR FOUND" + error);
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Code Verification</Text>
        {errors.length > 0 && (
          <View style={styles.errorContainer}>
            {errors.map((error, index) => (
              <Text style={styles.errorText} key={index}>{error}</Text>
            ))}
          </View>
        )}
        <View style={styles.formGroup}>
          <TextInput
            style={styles.input}
            placeholder="Enter verification code"
            onChangeText={text => setOtp(text)}
            value={otp}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.formGroup}>
          <TouchableOpacity style={styles.button} onPress={handleVerification}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  form: {
    width: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    padding: 10,
    borderRadius: 4,
    marginBottom: 20,
  },
  errorText: {
    color: '#721c24',
    fontSize: 16,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CodeVerification;