// App.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC50_RSSR1DH3Cbc92PQgKJnJBfVJvTSPs",
  authDomain: "actividad-firebase-6c66f.firebaseapp.com",
  projectId: "actividad-firebase-6c66f",
  storageBucket: "actividad-firebase-6c66f.appspot.com",
  messagingSenderId: "131659714810",
  appId: "1:131659714810:web:eb36930b2ed5048ea17943",
  measurementId: "G-W8F1DBP005"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [seccion, setSeccion] = useState('inicio');
  const [personajes, setPersonajes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCasa, setFiltroCasa] = useState('');
  const [registro, setRegistro] = useState({
    nombre: '',
    email: '',
    usuario: '',
    contraseña: '',
    casa: '',
    varita: '',
    nacimiento: ''
  });

  // Obtener personajes desde API
  useEffect(() => {
    fetch('https://hp-api.onrender.com/api/characters')
      .then(res => res.json())
      .then(data => setPersonajes(data))
      .catch(err => console.error(err));
  }, []);

  // Función para registrar mago en Firestore
  const agregarMago = async () => {
    try {
      await addDoc(collection(db, 'magos'), registro);
      Alert.alert('¡Mago registrado exitosamente!');
      setRegistro({
        nombre: '', email: '', usuario: '', contraseña: '',
        casa: '', varita: '', nacimiento: ''
      });
      setSeccion('inicio');
    } catch (error) {
      console.error('Error al agregar mago:', error);
    }
  };

  // Filtrar personajes por búsqueda y casa
  const personajesFiltrados = personajes.filter(p => 
    p.name.toLowerCase().includes(busqueda.toLowerCase()) &&
    (filtroCasa === '' || p.house === filtroCasa)
  );

  return (
    <View style={styles.container}>
      {/* Header / Navegación */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Ciudadela de Harry Potter</Text>
        <View style={styles.nav}>
          <Button title="Home" onPress={() => setSeccion('inicio')} />
          <Button title="Registro" onPress={() => setSeccion('registro')} />
          <Button title="Personajes" onPress={() => setSeccion('personajes')} />
          <Button title="Perfil" onPress={() => setSeccion('contacto')} />
        </View>
      </View>

      {/* Contenido */}
      <ScrollView style={styles.main}>
        {seccion === 'inicio' && (
          <View style={styles.seccion}>
            <Text style={styles.subtitulo}>Bienvenido a la Ciudadela</Text>
            <Text>Explora los pasillos de Hogwarts, descubre secretos y misterios ancestrales.</Text>
            <Image source={{uri: 'https://img.unocero.com/2023/10/foto-con-movimiento-harry.gif'}} 
                   style={styles.imagen}/>
          </View>
        )}

        {seccion === 'registro' && (
          <View style={styles.seccion}>
            <Text style={styles.subtitulo}>Registro de Magos</Text>
            {Object.keys(registro).map((key) => (
              <TextInput
                key={key}
                style={styles.input}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={registro[key]}
                onChangeText={(text) => setRegistro({...registro, [key]: text})}
              />
            ))}
            <Button title="Registrar" onPress={agregarMago} />
          </View>
        )}

        {seccion === 'personajes' && (
          <View style={styles.seccion}>
            <Text style={styles.subtitulo}>Personajes</Text>
            <TextInput
              style={styles.input}
              placeholder="Buscar personaje..."
              value={busqueda}
              onChangeText={setBusqueda}
            />
            <Text>Filtrar por casa:</Text>
            <View style={styles.nav}>
              {['', 'Gryffindor','Slytherin','Hufflepuff','Ravenclaw'].map(casa => (
                <Button key={casa} title={casa || 'Todas'} onPress={() => setFiltroCasa(casa)} />
              ))}
            </View>
            {personajesFiltrados.map(p => (
              <View key={p.name} style={styles.card}>
                <Image source={{uri: p.image || 'https://via.placeholder.com/150'}} style={styles.cardImg}/>
                <Text style={styles.cardTitulo}>{p.name}</Text>
                <Text>Casa: {p.house || 'Desconocido'}</Text>
                <Text>Actor: {p.actor || 'Desconocido'}</Text>
              </View>
            ))}
          </View>
        )}

        {seccion === 'contacto' && (
          <View style={styles.seccion}>
            <Text style={styles.subtitulo}>Contacto</Text>
            <Text>📧 Correo: oscar.villamarinw@uniagustiniana.edu.co</Text>
            <Text>💻 Github: https://github.com/Julianv2903</Text>
            <Text>📜 Tecnología en desarrollo de software</Text>
            <Text>🧙‍♂️ Tecnologías avanzadas de programación para móviles</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#1a1a1a', paddingTop:40 },
  header: { padding:10, backgroundColor:'#222', alignItems:'center' },
  titulo: { fontSize:24, fontWeight:'bold', color:'#f5f5f5', marginBottom:10 },
  nav: { flexDirection:'row', marginBottom:10 },
  pestana: { backgroundColor:'#333', paddingHorizontal:15, paddingVertical:8, borderRadius:20, marginHorizontal:5 },
  pestanaText: { color:'#ffd700', fontWeight:'bold' },
  main: { flex:1, padding:10 },
  seccionInicio: {
    backgroundColor:'#1a1a1a',
    borderRadius:20,
    padding:20,
    marginBottom:20,
    alignItems:'center',
    shadowColor:'#ffd700',
    shadowOffset:{width:0,height:0},
    shadowOpacity:0.5,
    shadowRadius:15,
  },
  seccionRegistro: {
    backgroundColor:'#111',
    borderRadius:20,
    padding:20,
    marginBottom:20,
    shadowColor:'#add8e6',
    shadowOffset:{width:0,height:0},
    shadowOpacity:0.3,
    shadowRadius:15,
  },
  seccion:{ marginBottom:20 },
  subtitulo:{ fontSize:22, fontWeight:'bold', color:'#ffd700', marginBottom:10 },
  parrafo:{ color:'#ddd', fontSize:16, marginBottom:10, textAlign:'center' },
  input:{ backgroundColor:'#2a2a2a', color:'#f5f5f5', padding:10, marginVertical:5, borderRadius:10 },
  btnRegistrar:{ backgroundColor:'#5c3aff', padding:12, borderRadius:10, alignItems:'center', marginTop:10 },
  btnText:{ color:'white', fontWeight:'bold', fontSize:16 },
  imagen:{ width:200, height:200, marginVertical:10, borderRadius:10 },
  grid:{ flexDirection:'row', flexWrap:'wrap', justifyContent:'center' },
  card:{ backgroundColor:'#1e1e1e', borderRadius:16, padding:10, margin:10, width:160, alignItems:'center', shadowColor:'#ffd700', shadowOffset:{width:0,height:4}, shadowOpacity:0.5, shadowRadius:10 },
  cardImg:{ width:140, height:180, borderRadius:15, marginBottom:10 },
  cardTitulo:{ color:'#ffd700', fontWeight:'bold', fontSize:16, textAlign:'center' },
  cardTexto:{ color:'#ddd', fontSize:14, textAlign:'center' },
});
