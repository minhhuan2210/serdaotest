import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Beneficiary, useTransactions} from './TransactionContext';
import { _isValidIBAN } from './Utils';

const beneficiaryIcon = require('./assets/ic-beneficiary.png');
const personIcon = require('./assets/ic-person.jpg');

const TransactionScreen = ({navigation}) => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [iban, setIban] = useState('');
  const [isShowModal, setIsShowModal] = useState(false);
  const [isValidForm, setIsValidForm] = useState(false);
  const {addTransaction, beneficiaries, selectAccount, selectedAccount} =
    useTransactions();

  const handleTransaction = () => {
    const accountDetails = {name, iban};
    addTransaction(amount, accountDetails);
    selectAccount(undefined);
    navigation.goBack();
  };

  const onPress = () => {
    setIsShowModal(true);
  };

  const onCloseModal = () => {
    setIsShowModal(false);
  };

  const onSelectBeneficiary = (item: Beneficiary) => {
    selectAccount(item);
    setIsShowModal(false);
  };

  useEffect(() => {
    if (selectedAccount) {
      setName(`${selectedAccount?.firstName} ${selectedAccount?.lastName}`);
      setIban(selectedAccount.IBAN);
    }
  }, [selectedAccount]);

  useEffect(() => {
    if (+amount > 0 && !!name && _isValidIBAN(iban)) {
      setIsValidForm(true);
    } else {
      setIsValidForm(false);
    }
  }, [amount, name, iban]);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.tile}
        onPress={() => onSelectBeneficiary(item)}>
        <Image style={{width: 40, height: 40}} source={personIcon} />
        <View style={styles.info}>
          <Text style={styles.title}>
            {item.firstName} {item.lastName}
          </Text>
          <Text>{item.IBAN}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Modal
        visible={isShowModal}
        onRequestClose={onCloseModal}
        animationType="slide"
        presentationStyle="formSheet"
        style={styles.modalContainer}>
        <Text style={styles.headerText}>Beneficiaries</Text>
        <FlatList data={beneficiaries} renderItem={renderItem}></FlatList>
      </Modal>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}>
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            width: '80%',
          }}
          onChangeText={setAmount}
          value={amount}
          keyboardType="numeric"
          placeholder="Enter amount"
        />
        <View style={styles.section}>
          <TextInput
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              flex: 1,
              marginRight: 8,
            }}
            onChangeText={setName}
            value={name}
            placeholder="Select a Beneficiary"
          />
          <Pressable onPress={onPress}>
            <Image style={{width: 40, height: 40}} source={beneficiaryIcon} />
          </Pressable>
        </View>
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            width: '80%',
          }}
          onChangeText={setIban}
          value={iban}
          placeholder="Recipient IBAN"
        />
        <Button
          disabled={!isValidForm}
          title="Submit Transaction"
          onPress={handleTransaction}
        />
      </View>
    </>
  );
};

export default TransactionScreen;

const styles = StyleSheet.create({
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '80%',
  },
  image: {
    width: 40,
    height: 40,
  },
  modalContainer: {
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'lightblue',
    marginTop: 20,
    marginLeft: 10,
  },
  tile: {
    flexDirection: 'row',
    gap: 10,
    borderBottomWidth: 0.5,
    borderColor: 'gray',
    paddingHorizontal: 10,
    borderRadius: 16,
    padding: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'orange',
  },
  info: {
    flex: 1,
    gap: 5,
  },
});
