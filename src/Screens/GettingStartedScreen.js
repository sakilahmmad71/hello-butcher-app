import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Dimensions, Image } from 'react-native';
import { COLORS } from '../Utils/colors'
import { ProductManager } from '../Database/DatabaseManager'
import FlatListSlider from '../Components/customslider/FlatListSlider';
import { sliderImages, categoryImages } from '../Assets/ImageCollection'
import CustomHeader from '../Components/CustomHeader';

const productManager = new ProductManager();

const images = [
  {
    banner: sliderImages["1"],
  },
  {
    banner: sliderImages["2"],
  },
  {
    banner: sliderImages["3"],
  },
  {
    banner: sliderImages["4"],
  },
]

export default class GettingStartedScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      quantity: 1,
      sliderTargetHeight : 0
    };
    
    const IMAGE_WIDTH = 1080
    const IMAGE_HEIGHT = 450

    const win = Dimensions.get('window');

    var heightRatio = win.width / IMAGE_WIDTH
    this.state.sliderTargetHeight = IMAGE_HEIGHT * heightRatio
    console.log("Height Ratio : "+this.state.sliderTargetHeight)
    //productManager.addProduct();

  }

  async onItemSelected(index) {
    this.props.navigation.navigate("ProductListItem", { type: index })
  }

  render() {
    return (
      <View style={styles.container}>
        
        <CustomHeader title="Hello Butcher" navigation={this.props.navigation} />

        <View style={{flexDirection: 'column',flexWrap:'wrap'}}>
        
          <FlatListSlider
              data={images}
              imageKey={'banner'}
              local
              timer={3000}
              height={this.state.sliderTargetHeight}
              backgroundColor={COLORS.layoutColor3}
              onPress={item => console.debug(JSON.stringify(item))}
              indicatorContainerStyle={{ position: 'absolute', bottom: 20 }}
              indicatorActiveColor={COLORS.darkGray}
              animation
            />
        </View>

        <View style={{flex: 1, flexDirection: 'column', alignItems:'center'}}>

          <View style={{flex: 1,flexDirection: 'row',marginLeft: 20,marginRight: 20, marginTop:20 }}>
            <View style={{flex: .5 ,marginHorizontal: 15,marginVertical: 15, backgroundColor:'#a1ffa3',borderWidth:.3,borderColor:'gray'}}>
            <TouchableWithoutFeedback onPress={() => this.onItemSelected("all")}>
                  <View style = {{justifyContent:'center', alignItems:'center',flexDirection: 'column',height: '100%'}}>
                    <Image source={categoryImages["all"]} style={[styles.productImage]}/>
                  </View>
              </TouchableWithoutFeedback>
            </View>

            <View style={{flex: .5 ,marginHorizontal: 15,marginVertical: 15, backgroundColor:'#cdb9ff',borderWidth:.3,borderColor:'gray'}}>
            <TouchableWithoutFeedback onPress={() => this.onItemSelected("chicken")}>
                  <View style = {{justifyContent:'center', alignItems:'center',flexDirection: 'column',height: '100%'}}>
                    <Image source={categoryImages["chicken"]} style={[styles.productImage]}/>
                  </View>
              </TouchableWithoutFeedback>
            </View>

          </View>

          <View style={{flex: 1,flexDirection: 'row',marginLeft: 20,marginRight: 20 }}>

          <View style={{flex: .5 ,marginHorizontal: 15,marginVertical: 15, backgroundColor:'#f9c4b5',borderWidth:.3,borderColor:'gray'}}>
          <TouchableWithoutFeedback onPress={() => this.onItemSelected("beef")}>
                  <View style = {{justifyContent:'center', alignItems:'center',flexDirection: 'column',height: '100%'}}>
                    <Image source={categoryImages["beef"]} style={styles.productImage}/>
                  </View>
              </TouchableWithoutFeedback>
            </View>

            <View style={{flex: .5 ,marginHorizontal: 15,marginVertical: 15, backgroundColor:'#fbd86e',borderWidth:.3,borderColor:'gray'}}>
            <TouchableWithoutFeedback onPress={() => this.onItemSelected("sheep")}>
                  <View style = {{justifyContent:'center', alignItems:'center',flexDirection: 'column',height: '100%'}}>
                    <Image source={categoryImages["sheep"]} style={[styles.productImage]}/>
                  </View>
              </TouchableWithoutFeedback>
            </View>
          </View>

          <View style={{flex: 1,flexDirection: 'row',marginLeft: 20,marginRight: 20 ,marginBottom:20}}>
          <View style={{flex: .5 ,marginHorizontal: 15,marginVertical: 15, backgroundColor:'#ff9393',borderWidth:.3,borderColor:'gray'}}>
          <TouchableWithoutFeedback onPress={() => this.onItemSelected("lamb")}>
                <View style = {{justifyContent:'center', alignItems:'center',flexDirection: 'column',height: '100%'}}>
                    <Image source={categoryImages["lamb"]} style={styles.productImage}/>
                  </View>
              </TouchableWithoutFeedback>
            </View>

            <View style={{flex: .5 ,marginHorizontal: 15,marginVertical: 15, backgroundColor:'#b1eafd',borderWidth:.3,borderColor:'gray'}}>
            <TouchableWithoutFeedback onPress={() => this.onItemSelected("mutton")}>
                  <View style = {{justifyContent:'center', alignItems:'center',flexDirection: 'column',height: '100%'}}>
                    <Image source={categoryImages["mutton"]} style={[styles.productImage]}/>
                  </View>
              </TouchableWithoutFeedback>
            </View>

          </View>

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:COLORS.white,
    // backgroundColor: COLORS.layoutColor5,
    // flexDirection: "column",
    // flexWrap: 'wrap',
    // alignItems: 'flex-start'
  },
  body: {
    justifyContent: 'center',
    // marginVertical: 10
  },
  productImage: {
    height: 88,
    width: 88,
    marginBottom:15,
  }
});