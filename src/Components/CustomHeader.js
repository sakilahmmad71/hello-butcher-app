import React from 'react';
import {Text} from 'react-native';
import { Body, Header, Left, Right } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomHeader = ({ navigation, title }) => {
    const openMenu = () => {
        navigation.openDrawer();
    };

    return (
        <Header style={{ backgroundColor: 'transparent', elevation: 0, marginHorizontal: 10 }}>
            <Left>
                <Icon name="bars" size={24} color="#2b2b2b" onPress={() => navigation.openDrawer()} />
            </Left>
            <Body>
                <Text style={{ color: '#2b2b2b', fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
            </Body>
            <Right>
            </Right>
        </Header>
    );
}

export default CustomHeader;