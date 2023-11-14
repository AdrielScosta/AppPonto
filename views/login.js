import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
    const [password, setPassword] = useState('');
    const [user, setUser] = useState('');
    const [displayPassword, setDisplayPassword] = useState('');

    const handleLogin = () => {

        const data = {
            username: user,
            senha: password,
        };

        axios.post('http://backend:3000/api', data)
            .then(response => {
                console.log('Resposta da API:', response.data.data);
                if (response.data.data == 'Authorizado!') {
                    setDisplayPassword('Acesso autorizado!');
                    setPassword('')
                    setUser('')
                    setDisplayPassword('')
                    navigation.navigate('Welcome')
                } else if (response.data.data == 'Negado!') {
                    setDisplayPassword('Usuário inválida');
                }
            })
            .catch(error => {
                // A solicitação POST falhou
                console.error('Erro na solicitação POST:', error);
            });
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={{ backgroundColor: 'orange', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 90 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black', marginTop: '7%' }}>Pontos YOUNG</Text>
            </View>
            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '93%' }}>
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', width: '90%', height: '30', borderRadius: 20 }}>
                    <Text style={{ marginBottom: 20, fontSize: 20 }}>
                        LOGIN
                    </Text>
                    <TextInput
                        style={{ width: '90%', backgroundColor: 'azure', borderRadius: 10, padding: 10, marginBottom: 10, fontSize: 20 }}
                        placeholder="Digite seu nome de usuário"
                        value={user}
                        onChangeText={(text) => setUser(text)}
                    />
                    <TextInput
                        style={{ width: '90%', backgroundColor: 'azure', borderRadius: 10, padding: 10, marginBottom: 20, fontSize: 20 }}
                        placeholder="Digite a senha de usuário"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                    />
                    <TouchableOpacity style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '70%', height: '15%', borderRadius: 10, backgroundColor: 'rgb(74, 164, 243)' }} onPress={handleLogin}>
                        <Text style={{ fontSize: 20 }}>Entrar</Text>
                    </TouchableOpacity>
                </View>
                {displayPassword ? <Text style={styles.passwordText}>Senha: {displayPassword}</Text> : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
        alignItems: 'center',
    },
});
