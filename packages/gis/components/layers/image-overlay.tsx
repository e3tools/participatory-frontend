import React from 'react'
import { Overlay } from 'react-native-maps'
import { IImageOverlayProps } from '../../interfaces';

export default function ImageOverlay(props: IImageOverlayProps) { 
  const { overlay } = props;
  return (
    <Overlay 
      image={overlay.image}
      bounds={overlay.bounds}
    />
  )
} 