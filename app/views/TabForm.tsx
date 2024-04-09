 
import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
const TABS = [
        { title: 'Tab 1', component: <View><Text>Content of Tab 1</Text></View> },
        { title: 'Tab 2', component: <View><Text>Content of Tab 2</Text></View> },
        { title: 'Tab 3', component: <View><Text>Content of Tab 3</Text></View> },
    ];

const TabForm = () => {
    // define tab configurations
    
    
    // define the navigation bar component
 
    // define state for the active tab
    const [activeTab, setActiveTab] = useState(0);

    // define function to handle tab presses
    const handleTabPress = (index) => {
        setActiveTab(index);
        Alert.alert(`Changed${index}`)
    }; 

    // render the navigation bar
    return (
        <View style={styles.container}>
        {/* render the header */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>My App</Text>
        </View>
        {/* render the tabs */}
        <View style={styles.tabs}>
            {TABS.map((tab, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                    styles.tab,
                    activeTab === index && styles.activeTab,
                    ]}
                    onPress={() => handleTabPress(index)}
                >
                    <Text
                    style={[
                        styles.tabTitle,
                        activeTab === index && styles.activeTabTitle,
                    ]}
                    >
                    {tab.title}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
        {/* render the active tab content */}
        <View style={[styles.contentContainer, {backgroundColor: 'red'}]}>
            {TABS[activeTab].component}
            <Text>{activeTab}</Text>
        </View>
        </View>
    );
}

export default TabForm

// define styles for the navigation bar
const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
    },
    header: {
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#333',
    },
    headerTitle: {
      fontWeight: 'bold',
      fontSize: 24,
      color: '#fff',
    },
    tabs: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: '#e0e0e0',
      borderBottomWidth: 1,
    },
    tab: {
      padding: 16,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: '#333',
    },
    tabTitle: {
      fontWeight: 'bold',
      color: '#333',
    },
    activeTabTitle: {
      color: '#333',
    },
    contentContainer: {
      flex: 1,
      marginTop: 16,
    },
});