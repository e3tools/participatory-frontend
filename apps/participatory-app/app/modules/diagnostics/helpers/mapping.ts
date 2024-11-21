import { View, Text } from 'react-native'
import React from 'react'

/**
 * Get the name of a place given a point
 */
const find_place = (lat: number, lon: number) => {
    const link = `http://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=YOUR_API_KEY`; 
}

export { find_place }