import React from 'react'
import { View, TextInput, Text } from 'react-native'
import { COLORS } from '../Utils/colors';
import Icon from 'react-native-vector-icons/FontAwesome'

const CustomTextInput = ({ title, placeholder ,iconName ,widthPercentage = "80%" , onChangeText, bottomMargin = 0, passwordType = false, value = '', editable = true }) => {
  
const container = {
    width : widthPercentage,
    backgroundColor:'transparent',    
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: 1,
    marginBottom : bottomMargin
}

const section = {
  backgroundColor:'transparent',    
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderBottomColor: COLORS.darkGray,
  borderBottomWidth: .5   
}

const icon = {
    padding: 0,
}

const input = {
    flex: 1,
    paddingTop: 8,
    paddingRight: 5,
    paddingBottom: 8,
    paddingLeft: 10,
    backgroundColor: '#fff',
    color: COLORS.black,
}

  return (
    <View style={container}>
      <Text style={{width:'100%', color:COLORS.darkGray,marginBottom:0, textAlign: "left",}}>{title}</Text>
      <View style={section}>
      <Icon style={icon} name={iconName} size={18} color={COLORS.darkGray}/>
      <TextInput
        secureTextEntry={passwordType}
        style={input}
        placeholder = {placeholder}
        underlineColorAndroid = 'transparent'
        onChangeText={onChangeText}
        value = {value}
        editable = {editable}
        />
        </View>
    </View>
  )
}

export default CustomTextInput