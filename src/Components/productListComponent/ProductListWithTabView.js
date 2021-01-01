import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import ProductListItem from './ProductListItem';
import { Body, Header, Left, Right } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomHeader from '../CustomHeader'
import { COLORS } from '../../Utils/colors';

export default class ProductListWithTabView extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        index: 0,
        routes: [
            { key: '1', title: 'Chicken', image: require('../../Assets/category_chicken.png') },
            { key: '2', title: 'Beef', image: require('../../Assets/category_beef.png') },
            { key: '3', title: 'Mutton', image: require('../../Assets/category_mutton.png') },
            { key: '4', title: 'All', image: require('../../Assets/category_others.png') },
        ],
    };

    _handleIndexChange = index => this.setState({ index });

    _renderTabBar = props => {
        const inputRange = props.navigationState.routes.map((x, i) => i);

        return (
            <SafeAreaView>
                <CustomHeader title="Product List" navigation={this.props.navigation} />
                <View style={styles.tabBar}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start'}}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        {props.navigationState.routes.map((route, i) => {
                            return (
                                <TouchableOpacity style={styles.tabItem}
                                    key={i}
                                    onPress={() => this.setState({ index: i })}>
                                    <Image source={route.image} style={styles.categoryImage} />
                                    <Text style={styles.categoryText}>{route.title}</Text>
                                    {this.state.index == i ? <View style={{ height: 2, width: '50%', backgroundColor: 'black' }} /> : null}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    };

    _renderScene = SceneMap({
        1: () => <ProductListItem navigation={this.props.navigation} type={1} />,
        2: () => <ProductListItem navigation={this.props.navigation} type={2} />,
        3: () => <ProductListItem navigation={this.props.navigation} type={3} />,
        4: () => <ProductListItem navigation={this.props.navigation} type={4} />,
    });

    render() {
        return (
            <TabView
                navigationState={this.state}
                renderScene={this._renderScene}
                renderTabBar={this._renderTabBar}
                onIndexChange={this._handleIndexChange}
                tabBarPosition={'top'}
                swipeEnabled={true}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabBar: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    tabItem: {
        alignItems: 'center',
        paddingRight: 0,
        paddingLeft: 10,
    },
    categoryImage: {
        height: 64,
        width: 64,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginVertical: 2
    }
});
