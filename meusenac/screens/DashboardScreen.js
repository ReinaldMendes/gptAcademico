import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Avatar e título */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://encurtador.com.br/huMos' }} // Substitua pela URL da imagem do avatar ou uma imagem local
          style={styles.avatar}
        />
        <Text style={styles.username}>Olá, Estudante!</Text>
      </View>

      {/* Título do painel */}
      <Text style={styles.title}>Painel Acadêmico</Text>

      {/* Botões principais */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UserList')}
      >
        <Text style={styles.buttonText}>Listar Usuários</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Chat')}
      >
        <Text style={styles.buttonText}>Chat com Tutor</Text>
      </TouchableOpacity>

      {/* Adicione mais botões ou links conforme necessário */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6f9', // Cor suave para o fundo
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40, // Formato circular
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2C3E50', // Cor acadêmica, mais sóbria
  },
  button: {
    backgroundColor: '#2980b9', // Cor azul para destaque
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#2C3E50',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default DashboardScreen;
