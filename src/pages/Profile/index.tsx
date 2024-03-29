import React, { useRef, useCallback } from 'react';
import { Image, KeyboardAvoidingView, Platform, View, ScrollView, TextInput, Alert, PermissionsAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import ImagePicker from 'react-native-image-picker';
import * as Yup from 'yup';

import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Title, UserAvatar, UserAvatarButton, BackButton } from './styles';
import { useAuth } from '../../hooks/auth';


interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {

  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);

  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const { user, updateUser } = useAuth();

  const handleUpdateAvatar = useCallback(async () => {

    ImagePicker.showImagePicker({
      title: 'Selecione um avatar',
      cancelButtonTitle: 'Cancelar',
      takePhotoButtonTitle: 'Usar câmera',
      chooseWhichLibraryTitle: 'Escolha da galeria'
    }, response => {

      if (response.didCancel) {
        return;
      }
      if (response.error) {
        console.log(response.error);
        Alert.alert('Erro ao atualizar seu avatar');
        return;
      }

      const data = new FormData();

      data.append('avatar', {
        type: 'image/jpeg',
        name: `${user.id}.jpg`,
        url: response.uri
      });

      api.patch('users/avatar', data)
      .then(response => {
        console.log('patch avatar', response.data);
        updateUser(response.data);
      })
    }
    );

  }, [updateUser, user.id]);

  const handleGoBack = useCallback(() => {

    navigation.goBack();

  }, [navigation]);

  const handleProfile = useCallback(async (data: ProfileFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite ume e-mail válido'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: val => !!val.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string(),
        }),
        password_confirmation: Yup.string()
          .when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          })
          .oneOf([Yup.ref('password')], 'Deve-se confirmar a senha'),
      });

      await schema.validate(data, { abortEarly: false });

      const {
        name,
        email,
        old_password,
        password,
        password_confirmation,
      } = data;

      const formData = {
        name,
        email,
        ...(old_password
          ? {
            old_password,
            password,
            password_confirmation,
          }
          : {}),
      };

      const response = await api.put('/profile', formData);

      updateUser(response.data);

      Alert.alert('Perfil atualizado com sucesso!');

      navigation.goBack();

    } catch (err) {
      const errors = getValidationErrors(err);
      formRef.current?.setErrors(errors);
      console.log(errors);
      Alert.alert(
        'Erro na atualização',
        'Ocorreu um erro ao atualizar seu perfil, tente novamente.'
      );

    }
  }, [navigation, updateUser]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled>
        <ScrollView
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <BackButton onPress={() => { }}>
              <Icon name="chevron-left" size={24} color='#999591'></Icon>
            </BackButton>
            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatar_url }}></UserAvatar>
            </UserAvatarButton>

            <View>
              <Title>Meu perfil</Title>
            </View>
            <Form
              initialData={user}
              ref={formRef}
              onSubmit={handleProfile}>

              <Input
                autoCapitalize="words"
                name="name" icon="user" placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />


              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email" icon="mail" placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  oldPasswordInputRef.current?.focus();
                }}
              />

              <Input
                ref={oldPasswordInputRef}
                secureTextEntry
                name="old_password" icon="lock" placeholder="Senha atual"
                textContentType="newPassword"
                returnKeyType="next"
                containerStyle={{ marginTop: 16 }}
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />

              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password" icon="lock" placeholder="Nova Senha"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmPasswordInputRef.current?.focus();
                }}
              />

              <Input
                ref={confirmPasswordInputRef}
                secureTextEntry
                name="password_confirmation" icon="lock" placeholder="Confimar senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button onPress={() => {
                formRef.current?.submitForm();
              }} >Confirmar mudanças
                            </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

    </>
  );
};

export default Profile;
