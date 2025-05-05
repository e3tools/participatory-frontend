import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Text,
    Image,
} from 'react-native';
// import _ from 'lodash';
import styles from './data-table.style';
import { ThemedText } from '@/components/ThemedText';
import { useLocale } from '@/provider/translation';
import { Button } from '../button';

interface DataTableProps {
    data?: any[];
    onRowClick?: (item: any) => void;
    onAddNewRow?: (item: any) => void;
    onChange?: (data: any) => void;
    readonly?: boolean;
}

function DataTable({
    data,
    onRowClick,
    onAddNewRow,
    readonly = false,
    onChange,
}: DataTableProps) {
    const scrollableColumns = useMemo(
        () => [
            'Sales',
            'Revenue',
            'Cost',
            'Profit',
            'Inventory',
            'Rating',
            'Category',
            'Supplier',
            'Margin',
        ],
        []
    );
    data = [
        {
            idx: 1,
            name: 'Product A',
            sales: 100,
            revenue: 5000,
            cost: 3000,
            profit: 2000,
            inventory: 50,
            rating: 4.5,
            category: 'Electronics',
            supplier: 'Supplier X',
            margin: 0.4,
        },
    ];

    const fixedColumn = useMemo(() => ['Name'], []);
    const [direction, setDirection] = useState(null);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const [tableData, setTableData] = useState(data);
    const { t } = useLocale();

    useEffect(() => {
        // setTableData(data);
    }, [data]);

    useEffect(() => {
        if (onChange) {
            console.log('DataTable data changed: ', tableData);
            onChange(tableData);
        }
    }, [tableData]);

    const addRow = useCallback((row) => {
        setTableData((prevData) => [...prevData, row]); // Add new row to the end of the table
    }, []);

    const removeRow = useCallback((row) => {
        setTableData((prevData) => prevData.filter((item) => item !== row)); // Remove the specified row
    }, []);

    const sortTable = useCallback(
        (column) => {
            const newDirection = direction === 'desc' ? 'asc' : 'desc';
            const sortedData = _.orderBy(
                tableData,
                [column.toLowerCase()],
                [newDirection]
            );
            setSelectedColumn(column);
            setDirection(newDirection);
            setTableData(sortedData);
        },
        [direction, tableData]
    );

    const arrowRotation = useMemo(
        () => ({
            transform: [{ rotate: direction === 'desc' ? '270deg' : '90deg' }],
        }),
        [direction]
    );

    const renderTableHeader = useCallback(
        (columns, isFixedHeader) => (
            <View style={styles.tableHeader}>
                {columns.map((column, index) => (
                    <TouchableOpacity
                        key={index}
                        style={
                            isFixedHeader
                                ? styles.columnHeaderName
                                : styles.columnHeader
                        }
                        onPress={() => sortTable(column)}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.columnHeaderTxt}>
                                {column + ' '}
                            </Text>
                            {selectedColumn === column && (
                                <Image
                                    style={[styles.arrowImage, arrowRotation]}
                                    source={require('../data-table/assets/images/arrow.png')}
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        ),
        [arrowRotation, selectedColumn, sortTable]
    );

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <FlatList
                    data={tableData}
                    ListHeaderComponent={renderTableHeader(fixedColumn, true)}
                    keyExtractor={(item, index) => index + ''}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.rowContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log('Pressed ' + item.name);
                                        onRowClick?.(item);
                                    }}
                                >
                                    <ThemedText
                                        type="link"
                                        style={styles.columnRowTxtName}
                                    >
                                        {item.name}
                                    </ThemedText>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                    ListFooterComponent={() => (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'flex-end',
                                /*styles.footerContainer*/
                            }}
                        >
                            {readonly === false && (
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log('Add new row');
                                        const newRow = {
                                            idx: tableData.length + 1,
                                            name: 'New Product',
                                            sales: 0,
                                            revenue: 0,
                                            cost: 0,
                                            profit: 0,
                                            inventory: 0,
                                            rating: 0,
                                            category: '',
                                            supplier: '',
                                            margin: 0,
                                        };
                                        addRow(newRow);
                                        onAddNewRow?.(newRow);
                                    }}
                                >
                                    <ThemedText type="link">
                                        {t('BUTTON.ADD_ROW')}
                                    </ThemedText>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                    stickyHeaderIndices={[0]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />

                <ScrollView horizontal>
                    <FlatList
                        data={tableData}
                        keyExtractor={(item, index) => index + ''}
                        ListHeaderComponent={renderTableHeader(
                            scrollableColumns,
                            false
                        )}
                        renderItem={({ item }) => {
                            return (
                                <View style={styles.rowContainer}>
                                    <Text style={styles.columnRowTxt}>
                                        {item.sales}
                                    </Text>
                                    <Text style={styles.columnRowTxt}>
                                        {item.revenue}
                                    </Text>
                                    <Text style={styles.columnRowTxt}>
                                        {item.cost}
                                    </Text>
                                    <Text style={styles.columnRowTxt}>
                                        {item.profit}
                                    </Text>
                                    <Text style={styles.columnRowTxt}>
                                        {item.inventory}
                                    </Text>
                                    <Text style={styles.columnRowTxt}>
                                        {item.rating}
                                    </Text>
                                    <Text style={styles.columnRowTxt}>
                                        {item.category}
                                    </Text>
                                    <Text style={styles.columnRowTxt}>
                                        {item.supplier}
                                    </Text>
                                    <Text style={styles.columnRowTxt}>
                                        {item.margin}
                                    </Text>
                                </View>
                            );
                        }}
                    />
                </ScrollView>
            </View>
        </View>
    );
}

export default DataTable;
