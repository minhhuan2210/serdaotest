import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTransactions} from './TransactionContext';
import { _isValidIBAN } from './Utils';

const BeneficiaryScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [IBAN, setIBAN] = useState('');
  const [isEnable, setIsEnable] = useState(false);

  const {addBeneficiary} = useTransactions();

  const onFirstNameChange = (text: string) => {
    setFirstName(prev => prev = text);
  };

  const onLastNameChange = (text: string) => {
    setLastName(prev => prev = text);
  };

  const onIBANChange = (text: string) => {
    setIBAN(prev => prev = text);
  };

  const clearData = () => {
    setFirstName('');
    setLastName('');
    setIBAN('');
  };

  const onSubmit = () => {
    addBeneficiary({firstName, lastName, IBAN});
    clearData();
  };

  useEffect(() => {
    if (!!firstName && !!lastName && _isValidIBAN(IBAN)) {
      setIsEnable(true);
    } else {
      setIsEnable(false);
    }
  }, [lastName, firstName, IBAN]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.block}>
        <Text style={styles.title}>First name:</Text>
        <TextInput
          key={`firstName`}
          style={styles.input}
          placeholder="ex: Alex, Will...etc"
          onChangeText={onFirstNameChange}
          value={firstName}
        />
      </View>
      <View style={styles.block}>
        <Text style={styles.title}>Last name:</Text>
        <TextInput
          key={`lastName`}
          style={styles.input}
          placeholder="ex: William, Johnson...etc"
          onChangeText={onLastNameChange}
          value={lastName}
        />
      </View>
      <View style={styles.block}>
        <Text style={styles.title}>IBAN:</Text>
        <TextInput
          key={`IBAN`}
          style={styles.input}
          maxLength={34}
          placeholder="ex: XX-XX-XXXX-XXXXX-XXXXXXXXXXXXXX"
          onChangeText={onIBANChange}
          value={IBAN}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.submitButton,
          {backgroundColor: isEnable ? 'blue' : 'gray'},
        ]}
        onPress={onSubmit}
        disabled={!isEnable}>
        <Text style={styles.text}>Create</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default BeneficiaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    gap: 10,
  },
  block: {
    alignItems: 'flex-start',
    gap: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    borderColor: 'gray',
    width: '100%',
    height: 40,
    fontSize: 20,
    paddingHorizontal: 15,
    color: 'orange',
  },
  submitButton: {
    borderRadius: 32,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
