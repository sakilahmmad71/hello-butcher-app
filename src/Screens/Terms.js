import React, {Component} from 'react'
import {Text, View, StyleSheet} from 'react-native'
import {WebView} from 'react-native-webview';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome'

export class Terms extends Component {

    handleBack = (text) => {
        this.props.navigation.goBack(null);
      }

    render() {
        return (
            <View style={
                styles.container
            }>
                <TouchableOpacity style={
                        styles.backButton
                    }
                    onPress={
                        this.handleBack
                }>
                    <Icon name='arrow-left' color='#000'
                        size={20}/>
                </TouchableOpacity>

                <WebView source={
                        {uri: 'http://198.13.36.60:8000/'}
                    }
                    style={
                        {marginTop: 20}
                    }/>
            </View>
        )
    }
}

export default Terms

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    backButton: {
        backgroundColor: 'transparent',
        width: 32,
        height: 32,
        marginTop: 20,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
