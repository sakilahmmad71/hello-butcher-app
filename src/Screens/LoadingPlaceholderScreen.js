import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';

// npm i rn-placeholder
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade,
    Shine
} from 'rn-placeholder';

// npm i native-base
import { Card, CardItem } from 'native-base';

const LoadingCard = () => (
    <Placeholder Animation={Shine}>
        <View style={{ flexDirection: 'row' }}>
            <View>
                <PlaceholderMedia style={{ borderRadius: 100 }} size={90} />
            </View>
            <View style={{ flex: 1, marginLeft: 10, justifyContent: 'center' }}>
                <PlaceholderLine width={80} />
                <PlaceholderLine width={40} />
                <PlaceholderLine width={60} />
            </View>
        </View>
    </Placeholder>
);

export default function LoadingPlaceholderScreen({ navigation }) {

    const [users] = useState([
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' },
        { id: '6' },
        { id: '7' },
        { id: '8' },
        { id: '9' },
        { id: '10' },
    ]);

    return (
        <ScrollView
            style={{ paddingHorizontal: 10 }}
            showsVerticalScrollIndicator={false}
        >
            {users.map((user) => (
                <Card key={user.id} style={{ marginTop: 10 }}>
                    <CardItem>
                        <LoadingCard />
                    </CardItem>
                </Card>
            ))}
            <View style={{ height: 20 }}></View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    nameText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    phoneText: {
        fontSize: 16,
        marginTop: 4,
    },
    emailText: {
        fontSize: 16,
        marginTop: 2,
    },
});