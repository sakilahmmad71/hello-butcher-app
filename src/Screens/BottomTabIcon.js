import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Badge } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { USER_CART } from '../Utils/Constants';
import { connect } from 'react-redux';

class BottomTabIcon extends Component {

    constructor(props) {
        super(props);

        this.state = {
            len: "0",
        }
    }

    componentDidMount() {

        AsyncStorage.getItem(USER_CART).then((value) => {
            if (value != null) {
                this.setState({ len: value.toString() })
            }
        });
    }


    render() {
        // const cart = this.props.cart
        console.log("The cart value is : " + this.props.cart)
        return (
            <View>
                <View><Icon size={22} name="heart" style={{ color: 'tomato' }} /><Badge
                    status="error"
                    value={this.props.cart} //Cart added
                    containerStyle={{ position: 'absolute', top: -10, right: -10 }}
                /></View>
            </View>
        )
    }
}

const styles = StyleSheet.create({})

const mapStateToProps = (state) => ({
    cart: state.cart
})

export default connect(mapStateToProps)(BottomTabIcon)
