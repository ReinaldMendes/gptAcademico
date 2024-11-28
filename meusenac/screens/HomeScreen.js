import React from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://www.senac.br/image/rebranding-logo.svg' }} // logo do Senac
        style={styles.logo}
      />
      <Text style={styles.title}>Bem-vindo ao Portal Acadêmico</Text>
      <Text style={styles.subtitle}>Acesse sua conta ou cadastre-se para explorar recursos educacionais</Text>
      
      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.signupButton} 
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.buttonText}>Cadastrar-se</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#4285F4', // azul acadêmico
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginBottom: 15,
    width: '80%',
  },
  signupButton: {
    backgroundColor: '#34A853', // verde acadêmico
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
