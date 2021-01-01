import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import CustomHeader from '../Components/CustomHeader';
import { COLORS } from '../Utils/colors';
import ApiHandler from '../Utils/ApiHandler';
import LoadingPlaceholderScreen from '../Screens/LoadingPlaceholderScreen';
import CustomLottieView from '../Components/LottieProgress'

export default class NotificationListScreen extends React.Component {

  state = {
    data: [],
    bodyType: 2,
    message: "",
  }

  onFocusFunction = () => {

    this.setState({ bodyType: 2 })

    setTimeout(() => {
      ApiHandler.getAllNotificationsApi()
        .then((response) => {
          if (response.code == 200) {
            console.log(response.code + "\n" + JSON.stringify(response));
            this.setState({ bodyType: 1, data: response.notifications })
          } else {
            console.log(response.errors);
            this.setState({ bodyType: 0, message: response.errors.message })
          }
        })
        .catch((error) => {
          console.error("Response Error : " + error);
          this.setState({ bodyType: 0, message: 'unknown error !!!' })
        });
    }, 200)

  }

  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    })
  }

  componentWillUnmount() {
    this.focusListener.remove()
  }

  render() {
    return (
      <View style={styles.container}>
        <CustomHeader title="Notifications" navigation={this.props.navigation} />
        {
          (() => {

            switch (this.state.bodyType) {
              case 0:
                return (<CustomLottieView path={require('../Assets/lottie_no_notification.json')} message={this.state.message}  size={56}/>)

              case 1:
                return (<FlatList
                  style={{ flex: 1, marginTop: 3, marginBottom: 3, backgroundColor : COLORS.background }}
                  data={this.state.data}
                  renderItem={({ item }) =>
                    <View style={styles.listItem}>
                      <View style={{ alignItems: "flex-start", justifyContent: "center", flex: 1, marginLeft: 10, margin: 10 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.title}</Text>
                        <Text>{item.details}</Text>
                      </View>
                      <TouchableOpacity style={{ width: 72, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: COLORS.price, fontSize: 11, textAlign : 'right' }}>{item.createdAt}</Text>
                      </TouchableOpacity>
                    </View>
                  }
                  keyExtractor={item => item.createdAt}
                />)

              case 2:
                return (<LoadingPlaceholderScreen />)
              default:
                break
            }

          })()
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor : COLORS.white
  },
  listItem: {
    margin: 3,
    padding: 10,
    backgroundColor: "#FFF",
    width: "97%",
    flex: 1,
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 8
  }
});