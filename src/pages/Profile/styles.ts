import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
    flex:1;
    justify-content:center;
    padding: 0 30px ${Platform.OS === 'android' ? 150 : 40}px;
    position: relative;
`;

export const Title = styled.Text`
    font-size:20px;
    color:#f4ede8;
    font-family: 'RobotoSlab-Medium';
    margin: 24px 0;
    text-align: left;
`;

export const UserAvatarButton = styled.TouchableOpacity`

  margin-top: 32px;

`;

export const UserAvatar = styled.Image`
  width: 98px;
  height: 98px;
  border-radius: 46px;
  align-self: center;
`;

export const BackButton = styled.TouchableOpacity`

  margin-top: 40px;

`;
