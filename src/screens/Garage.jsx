import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  TextInput,
  Modal
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import bayServices from '../database/BayService';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Garage = () => {
  const [openBay, setOpenBay] = useState(false);
  const [bayDetail, setBayDetail] = useState({});
  const [bayModal, setBayModal] = useState(false);
  const [image, setImage] = useState(null);
  const [bayName, setBayName] = useState('');
  const [vin, setVin] = useState('');
  const [bayDbData, setBayDbData] = useState([]);

  // For manual entry if VIN is not provided
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [trim, setTrim] = useState('');

  // Toggle between Wishlist or Previous Purchases
  const [toggleView, setToggleView] = useState('wishlist'); // "wishlist" or "purchases"

  useEffect(() => {
    bayServices.GetAll([]).then((res) => {
      console.log(res);
      setBayDbData(res.documents);
    });
  }, [bayModal]);

  const handleBayOpening = (id) => {
    if (id === 'new') {
      setBayModal(true);
    } else {
      const selectedBay = bayDbData.find((bay) => bay.mid === id);
      if (selectedBay) {
        setBayDetail(selectedBay);
        setOpenBay(true);
      }
    }
  };

  // Decode a VIN if provided
  const decodeVin = async (vinToDecode) => {
    const BASE_URL = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vinToDecode}?format=json`;
    try {
      const response = await axios.get(BASE_URL);
      return response.data.Results;
    } catch (error) {
      console.error('Error decoding VIN: ', error);
      throw error;
    }
  };

  // Pick an image from the device library
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Close the "Create Bay" modal and reset fields
  const handleCloseModal = () => {
    setBayName('');
    setVin('');
    setImage(null);
    setYear('');
    setMake('');
    setModel('');
    setTrim('');
    setBayModal(false);
  };

  // --- ADD NEW BAY, VIN OR MANUAL ---
  const addBayToDB = async () => {
    // 1) If user provides a valid VIN, decode it
    if (vin && vin.length === 17) {
      try {
        const decodedVin = await decodeVin(vin);
        const vehicleDetails = decodedVin.reduce((details, item) => {
          if (item.Variable && item.Value) {
            details[item.Variable] = item.Value;
          }
          return details;
        }, {});

        console.log('Decoded VIN Details:', vehicleDetails);
        saveBay({
          vin,
          bay_name: bayName,
          img: image,
          vehicleDetails,
        });
      } catch (error) {
        console.error('Failed to decode VIN:', error);
        alert('Failed to decode the VIN. Please try again.');
      }

    } else {
      // 2) If no VIN -> require Year/Make/Model
      if (!year || !make || !model) {
        alert('Please provide either a valid 17-char VIN OR fill out Year, Make, and Model.');
        return;
      }

      const vehicleDetails = { Year: year, Make: make, Model: model, Trim: trim };
      saveBay({
        vin: '',  // no VIN in this scenario
        bay_name: bayName,
        img: image,
        vehicleDetails,
      });
    }
  };

  // Helper to actually create the bay in the DB, then refresh the list
  const saveBay = (bayData) => {
    bayServices.GetAll([]).then((res) => {
      const mid = res.total + 1;
      const newData = { ...bayData, mid };

      bayServices.CreateBayDetails(newData).then(() => {
        bayServices.GetAll([]).then((updatedRes) => {
          setBayDbData(updatedRes.documents);
          handleCloseModal();
        });
      });
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {/* ------ Modal for creating a new bay ------ */}
      <Modal
        visible={bayModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create My Bay</Text>

            <TextInput
              style={styles.input}
              placeholder="Bay Nickname (optional)"
              value={bayName}
              onChangeText={setBayName}
            />

            <TextInput
              style={styles.input}
              placeholder="VIN (17 chars) or leave blank"
              value={vin}
              onChangeText={setVin}
            />

            <Text style={{ textAlign: 'center', marginVertical: 8 }}>— OR —</Text>

            {/* Manual Entry Fields */}
            <TextInput
              style={styles.input}
              placeholder="Year"
              keyboardType="numeric"
              value={year}
              onChangeText={setYear}
            />
            <TextInput
              style={styles.input}
              placeholder="Make"
              value={make}
              onChangeText={setMake}
            />
            <TextInput
              style={styles.input}
              placeholder="Model"
              value={model}
              onChangeText={setModel}
            />
            <TextInput
              style={styles.input}
              placeholder="Trim (optional)"
              value={trim}
              onChangeText={setTrim}
            />

            {/* Add Image */}
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Text style={styles.imageButtonText}>+ Add Image</Text>
            </TouchableOpacity>

            {/* Show image preview if selected */}
            {image ? (
              <Image source={{ uri: image }} style={styles.selectedImage} />
            ) : null}

            {/* Save button */}
            <TouchableOpacity style={styles.saveButton} onPress={addBayToDB}>
              <Text style={styles.saveButtonText}>Park My Car</Text>
            </TouchableOpacity>

            {/* Cancel button */}
            <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ----------------------------------------- */}

      {/* Background image */}
      <Image
        source={require('../../assets/membership-bg.png')}
        style={{
          position: 'absolute',
          zIndex: -10,
          width: screenWidth,
          height: screenHeight,
        }}
      />

      {/* ---------- Main Content ---------- */}
      {!openBay ? (
        // "My Garage" listing
        <View style={{ alignItems: 'center', paddingVertical: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: '600' }}>My Garage</Text>
          <View
            style={{
              marginTop: 10,
              width: '100%',
              height: screenHeight - 53.8,
              zIndex: 1,
            }}
          >
            <ScrollView>
              <View
                style={{
                  height: screenHeight - 53.8,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 10,
                  paddingBottom: 80,
                }}
              >
                {/* + Add Bay Button */}
                <TouchableOpacity
                  onPress={() => handleBayOpening('new')}
                  style={{
                    width: 150,
                    height: 150,
                    marginBottom: 30,
                    borderRadius: 10,
                    borderWidth: 1,
                    alignItems: 'center',
                  }}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={50}
                    style={{ marginHorizontal: 40, marginTop: 25 }}
                  />
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: '#000', fontSize: 20, fontWeight: '700', textAlign: 'center' }}>
                      Add
                    </Text>
                    <Text style={{ color: '#000', fontSize: 20, fontWeight: '700', textAlign: 'center' }}>
                      {' '}Bay
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Existing Bays */}
                {bayDbData.map(({ mid, vin, bay_name, img }) => (
                  <TouchableOpacity
                    onPress={() => handleBayOpening(mid)}
                    key={`${mid}-${vin}`}
                    style={{
                      width: 150,
                      height: 150,
                      marginLeft: mid % 2 === 0 ? 0 : 30,
                      marginBottom: 30,
                      borderRadius: 10,
                    }}
                  >
                    <Image
                      source={{ uri: img }}
                      style={{
                        width: 150,
                        height: 150,
                        position: 'absolute',
                        zIndex: -1,
                        borderRadius: 10,
                        opacity: 0.2,
                      }}
                    />
                    <View style={{ opacity: 1, padding: 10 }}>
                      <Text style={{ color: '#000' }}>{bay_name}</Text>
                      <Text style={{ color: '#000', marginTop: 90, fontSize: 10 }}>{vin}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      ) : (
        // ----- OPENED BAY CONTENT -----
        <View style={{ flex: 1, zIndex: 1, padding: 20 }}>
          {/* Header */}
          <View style={styles.openBayHeader}>
            <TouchableOpacity onPress={() => setOpenBay(false)}>
              <MaterialCommunityIcons name="arrow-left" size={26} color="#000" />
            </TouchableOpacity>
            <Text style={styles.openBayTitle}>{bayDetail.bay_name}</Text>
          </View>

          {/* Bay Image */}
          <Image
            source={{ uri: bayDetail.img }}
            style={{ width: '100%', height: 250, borderRadius: 10, marginVertical: 20 }}
          />

          {/* Vehicle Details */}
          <View style={styles.vehicleDetailsContainer}>
            <Text style={styles.vehicleDetailsText}>VIN: {bayDetail.vin || 'N/A'}</Text>

            {bayDetail.vehicleDetails ? (
              <>
                <Text style={styles.vehicleDetailsText}>
                  Year:{' '}
                  {bayDetail.vehicleDetails.Year ||
                    bayDetail.vehicleDetails.ModelYear ||
                    'N/A'}
                </Text>
                <Text style={styles.vehicleDetailsText}>
                  Make: {bayDetail.vehicleDetails.Make || 'N/A'}
                </Text>
                <Text style={styles.vehicleDetailsText}>
                  Model: {bayDetail.vehicleDetails.Model || 'N/A'}
                </Text>
                <Text style={styles.vehicleDetailsText}>
                  Trim: {bayDetail.vehicleDetails.Trim || 'N/A'}
                </Text>
              </>
            ) : (
              <Text style={styles.vehicleDetailsText}>No additional details.</Text>
            )}
          </View>

          {/* Toggle: Wishlist vs. Previous Purchases */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                toggleView === 'wishlist' && styles.toggleButtonActive,
              ]}
              onPress={() => setToggleView('wishlist')}
            >
              <Text style={styles.toggleButtonText}>Wishlist</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                toggleView === 'purchases' && styles.toggleButtonActive,
              ]}
              onPress={() => setToggleView('purchases')}
            >
              <Text style={styles.toggleButtonText}>Previous Purchases</Text>
            </TouchableOpacity>
          </View>

          {toggleView === 'wishlist' ? (
            <View style={styles.wishlistContainer}>
              <Text>Here are the wishlist items...</Text>
            </View>
          ) : (
            <View style={styles.purchasesContainer}>
              <Text>Here are previous purchases...</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default Garage;

const styles = StyleSheet.create({
  // Modal
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 5,
  },
  imageButton: {
    backgroundColor: '#ddd',
    padding: 10,
    marginVertical: 8,
    alignItems: 'center',
    borderRadius: 5,
  },
  imageButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  selectedImage: {
    width: 80,
    height: 80,
    marginVertical: 8,
    alignSelf: 'center',
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },

  // Opened Bay Header
  openBayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  openBayTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 20,
  },

  // Vehicle details
  vehicleDetailsContainer: {
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  vehicleDetailsText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },

  // Toggle
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 10,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#ccc',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Wishlists / purchases
  wishlistContainer: {
    marginTop: 10,
  },
  purchasesContainer: {
    marginTop: 10,
  },
});
