import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import DashBoard from '../pages/Dashboard';

const AppAuth = createStackNavigator();

const AppAuthRoutes: React.FC = () => (
    <AppAuth.Navigator
    screenOptions={{
        headerShown: false,
        cardStyle:{backgroundColor:'#312e38'}
    }}
    >
        <AppAuth.Screen name="Dashboard" component={DashBoard} />
    </AppAuth.Navigator>
);

export default AppAuthRoutes;
