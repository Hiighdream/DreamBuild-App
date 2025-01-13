//import React, { Suspense, useRef, useState } from 'react';
//import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
//import { Canvas } from '@react-three/fiber';
//import { OrbitControls, useGLTF } from '@react-three/drei';
//import 'expo-gl'; // Ensure WebGL support is enabled


//const FordRangerModel = () => {
  //const { nodes, materials } = useGLTF('../../assets/models/ford_ranger_2023/ford_ranger_2023.gltf');
  //return (
    //<group dispose={null}>
      //<mesh
        //castShadow
        //receiveShadow
        //geometry={nodes.Object_2.geometry}
        //material={materials['767c8b7b_1260_4325_b83f_f635800d9059_Standard00E280']}
        //rotation={[-Math.PI / 2, 0, 0]}
     // />
    //</group>
  //);
//};

//const PartPicker = () => {
  //const [view, setView] = useState('exterior'); // State to track active view
  //const modelRef = useRef();

  //const renderModel = () => {
    //switch (view) {
      //case 'interior':
        //return <Text style={styles.infoText}>Interior View Coming Soon...</Text>;
      //case 'chassis':
        //return <Text style={styles.infoText}>Chassis View Coming Soon...</Text>;
      //default:
        //return <FordRangerModel/>;
    //}
  //};

  //return (
    //<View style={styles.container}>
      //{/* 3D Canvas */}
      //<Canvas style={styles.canvas}>
        //<Suspense fallback={<Text>Loading Model...</Text>}>
          //<ambientLight intensity={0.5} />
          //<directionalLight position={[10, 10, 5]} />
          //{renderModel()}
          //<OrbitControls ref={modelRef} enableZoom={true} />
        //</Suspense>
      //</Canvas>

      //{/* View Selector */}
      //<View style={styles.buttonContainer}>
        //<TouchableOpacity style={styles.button} onPress={() => setView('interior')}>
          //<Text style={styles.buttonText}>Interior View</Text>
        //</TouchableOpacity>
        //<TouchableOpacity style={styles.button} onPress={() => setView('chassis')}>
          //<Text style={styles.buttonText}>Chassis View</Text>
        //</TouchableOpacity>
      //</View>
    //</View>
  //);
//};

//export default PartPicker;

//const styles = StyleSheet.create({
  //container: {
    //flex: 1,
    //backgroundColor: '#fff',
  //},
  //canvas: {
    //flex: 1,
  //},
  //buttonContainer: {
    //flexDirection: 'row',
    //justifyContent: 'space-around',
    //paddingVertical: 20,
    //backgroundColor: '#f9f9f9',
  //},
  //button: {
    //padding: 15,
    //backgroundColor: '#007bff',
    //borderRadius: 8,
  //},
  //buttonText: {
    //color: '#fff',
    //fontWeight: 'bold',
  //},
  //infoText: {
    //fontSize: 18,
    //textAlign: 'center',
    //color: '#333',
  //},
//});
// PartPickerPlaceholder.js (or .tsx)
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

// Single placeholder images (not changing with color)
const EXTERIOR_PLACEHOLDER = require('../../assets/dodgeram_Exterior.jpg');
const INTERIOR_PLACEHOLDER = require('../../assets/dodgeram_Interior.jpg');
const CHASSIS_PLACEHOLDER = require('../../assets/dodgeram_Chassis.jpg');

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function PartPickerScreen() {
  // "exterior", "interior", or "chassis"
  const [activeView, setActiveView] = useState('exterior');
  // Only used for highlighting the color circle
  const [selectedColor, setSelectedColor] = useState('Red');

  // We always display the same image for each color, just for demonstration
  const getMainImageSource = () => {
    if (activeView === 'exterior') {
      return EXTERIOR_PLACEHOLDER;
    } else if (activeView === 'interior') {
      return INTERIOR_PLACEHOLDER;
    } else {
      return CHASSIS_PLACEHOLDER;
    }
  };

  // The bottom row displays whichever two views are NOT active
  const allViews = ['exterior', 'interior', 'chassis'];
  const bottomViews = allViews.filter((v) => v !== activeView);

  const getThumbnailSource = (view) => {
    switch (view) {
      case 'exterior':
        return EXTERIOR_PLACEHOLDER;
      case 'interior':
        return INTERIOR_PLACEHOLDER;
      case 'chassis':
      default:
        return CHASSIS_PLACEHOLDER;
    }
  };

  return (
    <View style={styles.container}>
      {/* Background image */}
      <Image
        source={require('../../assets/membership-bg.png')}
        style={styles.backgroundImage}
      />

      {/* Top: just an example of year/make/model */}
      <View style={styles.header}>
        <Text style={styles.headerText}>2022 Toyota Camry</Text>
      </View>

      {/* Main large view */}
      <View style={styles.mainView}>
        <Image
          source={getMainImageSource()}
          style={styles.mainImage}
          resizeMode="contain"
        />
      </View>

      {/* Color selection row (only when exterior is active) */}
      {activeView === 'exterior' && (
        <View style={styles.colorRow}>
          <Text style={styles.colorRowText}>Select Color:</Text>

          {/* Just a simple array of color names */}
          {['Red', 'Blue', 'Silver'].map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle,
                { backgroundColor: color.toLowerCase() },
                selectedColor === color && styles.colorCircleSelected,
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>
      )}

      {/* Bottom row with the other 2 views */}
      <View style={styles.bottomRow}>
        {bottomViews.map((view) => (
          <TouchableOpacity
            key={view}
            style={styles.thumbnailContainer}
            onPress={() => setActiveView(view)}
          >
            <Image
              source={getThumbnailSource(view)}
              style={styles.thumbnailImage}
              resizeMode="contain"
            />
            <Text style={styles.thumbnailLabel}>{view.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ---------- STYLES -----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    zIndex: -10,
    width: screenWidth,
    height: screenHeight,
    resizeMode: 'cover',
  },
  header: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  mainImage: {
    width: '80%',
    height: '80%',
  },
  colorRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  colorRowText: {
    color: '#fff',
    fontSize: 18,
    marginRight: 10,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#ffffff88',
  },
  colorCircleSelected: {
    borderColor: '#fff',
    borderWidth: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  thumbnailContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  thumbnailImage: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  thumbnailLabel: {
    color: '#fff',
    fontWeight: '600',
  },
});

