import React from 'react'
import { Text, View, TouchableOpacity, Dimensions } from 'react-native'
import { COLORS } from '../Utils/colors';

const Button = ({ text, onPress, buttonWidthPercentage = "50%" ,marginTop = 10,marginBottom = 10}) => {
  
  const buttonCommonStyle = {
    width:buttonWidthPercentage,
  }

  const containerCommonStyle = {
    backgroundColor: COLORS.black,
    paddingVertical: 14,
    height : 48,
    borderRadius:16,
    marginTop:marginTop,
    marginBottom:marginBottom,
  }

  const textCommonStyle = {
    fontWeight:'bold',
    color: COLORS.white,
    fontSize: 16,
    textTransform: 'uppercase',
    textAlign: 'center',
    // fontFamily: 'Poppins-SemiBold'
  }

  return (
    <TouchableOpacity onPress={onPress} style={[buttonCommonStyle]} activeOpacity={0.7}>
      <View style={containerCommonStyle}>
        <Text style={[textCommonStyle]}> {text} </Text>
      </View>
    </TouchableOpacity>
  )
}

export default Button