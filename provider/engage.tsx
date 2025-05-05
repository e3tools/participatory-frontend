import { View, Text } from 'react-native';
import React, { Children, createContext, useEffect, useState } from 'react';
import { ENGAGEMENT_TYPE } from '@/stores/types';
import { generateRandomString } from '@/utils/common';

// see https://www.youtube.com/watch?v=PPU29dyKoMA

interface EngageContextType {
    submission: any;
    initializeStructuredSubmission: (
        engagement: string,
        engagement_form: string,
        childDocname?: any
    ) => void;
    setSubmissionValue: (
        field: string,
        value: any,
        isChild?: boolean,
        childDocname?: any,
        // parentDocname?: any,
        // parentDoctype?: any,
        parentField?: any
    ) => void;
}

const EngageContext = createContext<EngageContextType | null>(null);

export const EngageProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [submission, setSubmission] = useState({});

    const initializeStructuredSubmission = (engagement, engagement_form) => {
        setSubmission({
            engagement,
            engagement_form,
            engagement_type: ENGAGEMENT_TYPE.Structured,
        });
    };

    const setSubmissionValue = (
        field: string,
        value: any,
        isChild: boolean = false,
        childDocname?: any,
        // parentDocname?: any,
        // parentDoctype?: any,
        parentField?: any
    ) => {
        console.log('Field: ', field, 'Value: ', value);
        console.log('BEFORE Updated submission: ', submission);
        if (isChild) {
            if (!submission[parentField]) {
                submission[parentField] = [];
            }
            if (childDocname) {
                // get the index of the childDocname in the array
                const index = submission[parentField].findIndex(
                    (item: any) => item.id === childDocname
                );
                if (index !== -1) {
                    // if it exists, update the value. This value is an object of a child table
                    submission[parentField][index][field] = value;
                } else {
                    // if it doesn't exist, create and push a new object. Child table records are stored as an array of objects
                    submission[parentField].push({
                        [field]: value,
                        id: childDocname,
                    });
                }
            } else {
                // if childDocname is not provided, push a new object
                console.log(
                    'Pushing new child object: ',
                    field,
                    value,
                    submission[field]
                );
                submission[field].push({
                    [field]: value,
                    id: generateRandomString(10),
                });
            }
        } else {
            if (field) {
                // set value for the main submission object
                if (!submission[field]) {
                    submission[field] = {};
                }
                submission[field] = value;
            }
        }
        setSubmission(submission);
        console.log('Updated submission: ', submission);
    };

    useEffect(() => {
        console.log('Submission changed: ', submission);
    }, [submission]);

    return (
        <EngageContext.Provider
            value={{
                submission,
                initializeStructuredSubmission,
                setSubmissionValue,
            }}
        >
            {children}
        </EngageContext.Provider>
    );
};

export const useEngage = () => {
    const context = React.useContext(EngageContext);
    if (!context) {
        throw new Error('useLocale must be used within a EngageProvider');
    }
    const { submission, initializeStructuredSubmission, setSubmissionValue } =
        context;
    return {
        submission,
        initializeStructuredSubmission,
        setSubmissionValue,
    };
};
