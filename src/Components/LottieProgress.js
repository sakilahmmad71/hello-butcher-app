import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

const CustomLottieView = ({ path, message ,size}) => {

    return (
        <View style={{flex: 1, alignItems: 'center',justifyContent: 'center'}}>
            <LottieView source={path} autoPlay loop 
            style={{ height: size, width: size}}/>
            <Text style={{alignSelf: 'center', marginTop: 5, fontSize: 12, textTransform : 'uppercase', color : 'gray'}}>{message}</Text>
        </View>
    );
}

export default CustomLottieView;