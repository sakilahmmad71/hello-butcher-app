import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import {Body, Header, Left, Right} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../Utils/colors';
import Utils from '../Utils/Utils';

export default class MyOrdersProductsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      orderCode : 'aaa',
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    const productInfo = navigation.getParam('productInfo');
    const code = navigation.getParam('code');
    console.log('\n\n')
    console.log(code)
    const productList = JSON.parse(productInfo);
    this.setState({products: productList})
    this.setState({orderCode: code})
  }

  handleBack = (text) => {
    this.props.navigation.goBack(null);
  };

  render() {
    return (
      // <SafeAreaView>
      <View style={styles.container}>
        <Header
          style={{
            backgroundColor: 'transparent',
            elevation: 0,
            marginHorizontal: 10,
          }}>
          <Left>
            <TouchableOpacity onPress={this.handleBack}>
              <Icon name="arrow-left" color="#000" size={20} />
            </TouchableOpacity>
          </Left>
          <Body>
            <Text style={{color: '#2b2b2b', fontSize: 18, fontWeight: 'bold'}}>
              {this.state.orderCode}
            </Text>
          </Body>
          <Right></Right>
        </Header>

        <FlatList
          style={{
            flex: 1,
            marginTop: 3,
            marginBottom: 3,
            backgroundColor: COLORS.background,
          }}
          data={this.state.products}
          renderItem={({item}) => (
            <TouchableWithoutFeedback>
              <View style={styles.listItem}>
                <Image
                  source={{
                    uri: item.product.file
                      .toString()
                      .replace('localhost', '198.13.36.60'),
                  }}
                  style={{width: 60, height: 60, borderRadius: 30}}
                />
                <View
                  style={{
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    flex: 1,
                    marginLeft: 20,
                  }}>
                  <Text style={{fontWeight: 'normal', fontSize: 16}}>
                    {item.product.title}
                  </Text>
                  <Text style={{color: COLORS.darkGray, fontSize: 12}}>
                    {Utils.convertWeight(item.product.weight)}
                  </Text>
                  <Text style={{fontWeight: 'bold', color: COLORS.price}}>
                    £{item.product.price}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
          keyExtractor={(item) => item._id.toString()}
        />
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  listItem: {
    margin: 5,
    padding: 10,
    backgroundColor: COLORS.white,
    width: '95%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 5,
  },
  tag: {
    width: 80,
    height: 16,
    textAlign: 'center',
    backgroundColor: COLORS.themeLight,
    marginTop: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.price,
    textAlign: 'center',
  },
});
