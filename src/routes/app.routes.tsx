import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dashboard } from '../screens/Dashboard';
import { Register } from '../screens/Register';
import { useTheme } from 'styled-components';
import { MaterialIcons } from '@expo/vector-icons'
import { Platform } from 'react-native';
import { Resume } from '../screens/Resume';

const { Navigator, Screen } = createBottomTabNavigator();


export function AppRoutes() {
const theme = useTheme();

  return (
    <Navigator
    screenOptions={{
        headerShown: false
    }}
    tabBarOptions={{
        activeTintColor: theme.colors.secondary,
        inactiveTintColor: theme.colors.text,   
        labelPosition: 'beside-icon',
        style:{
            paddingVertical: Platform.OS == 'ios' ? 20 : 0,
            height: Platform.OS == 'ios' ? 88 : 80,
        }
    }}>
        <Screen 
            name="Listagem" 
            component={Dashboard} 
            options={{tabBarIcon: (({ size, color }) => (<MaterialIcons name='format-list-bulleted' size={size} color={color} />))}}
        />
        <Screen 
            name="Cadastrar" 
            component={Register} 
            options={{tabBarIcon: (({ size, color }) => (<MaterialIcons name='attach-money' size={size} color={color} />))}}
        />
        <Screen 
            name="Resumo" 
            component={Resume} 
            options={{tabBarIcon: (({ size, color }) => (<MaterialIcons name='pie-chart' size={size} color={color} />))}}
        />   
    </Navigator>
  );
}



