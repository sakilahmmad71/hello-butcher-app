import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    Keyboard,
} from 'react-native';
import { COLORS } from '../Utils/colors';
import BackgroundImage from '../Assets/login_bg.png';
import { Icon } from 'react-native-elements';
import CustomButton from '../Components/CustomButton';

export default function NewLoginScreen({ navigation }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <Image
                        style={{ height: '50%', width: '100%', marginTop: -40 }}
                        source={BackgroundImage}
                    />
                </View>

                <TouchableOpacity style={styles.backButton} onPress={() => { navigation.goBack(null); }}>
                    <Icon name='arrow-left' color='#000' size={20} />
                </TouchableOpacity>

                <View style={styles.bottomView}>
                    <Text style={styles.loginText}>Login</Text>
                    <View style={styles.inputView}>
                        <Icon
                            style={styles.inputIcon}
                            name='person'
                            type='ionicons'
                            color={COLORS.darkGray}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Email'
                            autoCapitalize='none'
                            keyboardType='email-address'
                            textContentType='emailAddress'
                            onChange={e => setEmail(e.target.value)}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <Icon
                            style={styles.inputIcon}
                            name='lock'
                            type='ionicons'
                            color={COLORS.darkGray}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Password'
                            secureTextEntry={true}
                            autoCapitalize='none'
                            onChange={e => setPassword(e.target.value)}
                        />
                    </View>
                    <TouchableOpacity onPress={() => { navigation.navigate("ForgotPassword") }}>
                        <Text style={styles.fpText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <View style={styles.loginButton}>
                        <CustomButton
                            text='LOGIN'
                            buttonWidthPercentage="80%"
                            marginTop={0}
                            onPress={() => { 
                                
                            }} />
                    </View>


                    <TouchableOpacity onPress={() => { navigation.navigate("Registration") }}>
                        <Text style={styles.registerText}>
                            Don't have an account?
                        <Text
                                style={{ color: COLORS.theme }}>
                                {' Register'}
                            </Text>
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleText: {
        position: 'absolute',
        top: Dimensions.get('screen').height * 0.1,
        alignSelf: 'center',
        color: '#fff',
        fontSize: 60,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
    },
    bottomView: {
        backgroundColor: '#fff',
        opacity: 0.95,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    loginText: {
        fontSize: 24,
        marginTop: 12,
        marginBottom: 4,
    },
    inputView: {
        height: 40,
        borderRadius: 10,
        backgroundColor: '#f1f3f6',
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputIcon: {
        paddingHorizontal: 8,
    },
    input: {
        height: 40,
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    loginButton: {
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center'
    },
    loginButtonText: {
        color: '#fff',
        alignSelf: 'center',
        fontSize: 18,
    },
    registerText: {
        alignSelf: 'center',
        marginTop: 12,
        fontSize: 16,
    },
    fpText: {
        marginTop: 10,
        alignSelf: 'flex-end',
        fontSize: 16,
        color: COLORS.theme,
    },
    backButton: {
        backgroundColor: 'transparent',
        width: 32,
        height: 32,
        marginTop: 60,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
});