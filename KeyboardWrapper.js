import React from 'react'
import {KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard} from 'react-native'

export default function KeyboardWrapper({children}) {
  return (
    <KeyboardAvoidingView style={{flex:1, backgroundColor: '#fff'}}>
        <ScrollView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                {children}
            </TouchableWithoutFeedback>
        </ScrollView>
    </KeyboardAvoidingView>
  )
}
