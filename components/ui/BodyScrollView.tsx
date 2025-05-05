import { View, Text, ScrollView, ScrollViewProps } from 'react-native';
import React, { forwardRef } from 'react';

export const BodyScrollView = forwardRef<any, ScrollViewProps>((props, ref) => {
    return (
        <ScrollView
            automaticallyAdjustsScrollIndicatorInsets
            contentInsetAdjustmentBehavior="automatic"
            contentInset={{ bottom: 100 }}
            scrollIndicatorInsets={{ bottom: 200 }}
            {...props}
            ref={ref}
            style={{
                padding: 10,
                marginBottom: 100,
            }}
        />
    );
});
