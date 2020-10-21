import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import DashBoard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import CreateAppointment from '../pages/CreateAppointment';
import AppointmentCreated from '../pages/AppointmentCreated';

const AppAuth = createStackNavigator();

const AppAuthRoutes: React.FC = () => (
    <AppAuth.Navigator
    screenOptions={{
        headerShown: false,
        cardStyle:{backgroundColor:'#312e38'}
    }}
    >
        <AppAuth.Screen name="Dashboard" component={DashBoard} />
        <AppAuth.Screen name="CreateAppointment" component={CreateAppointment} />
        <AppAuth.Screen name="AppointmentCreated" component={AppointmentCreated} />

        <AppAuth.Screen name="Profile" component={Profile} />
    </AppAuth.Navigator>
);

export default AppAuthRoutes;
