import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';

interface SelectDropdownProps {
    options: string[];
    selectedValue: string | null;
    onValueChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    bgColor?: string;
    textColor?: string;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
    options,
    selectedValue,
    onValueChange,
    placeholder = 'Select...',
    label,
    bgColor = '#fff',
    textColor = '#000',
}) => {
    const [open, setOpen] = useState(false);

    return (
        <View style={{ marginBottom: 16 }}>
            {label && <Text style={[styles.label, { color: textColor }]}>{label}</Text>}
            <Pressable
                style={[styles.dropdown, { backgroundColor: bgColor }]}
                onPress={() => setOpen(true)}
            >
                <Text style={{ color: selectedValue ? textColor : '#888' }}>
                    {selectedValue || placeholder}
                </Text>
            </Pressable>

            <Modal
                transparent
                visible={open}
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.option}
                                    onPress={() => {
                                        onValueChange(item);
                                        setOpen(false);
                                    }}
                                >
                                    <Text style={styles.optionText}>{item}</Text>
                                </Pressable>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    label: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
    dropdown: { height: 48, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingHorizontal: 14, justifyContent: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#fff', borderRadius: 10, maxHeight: '50%' },
    option: { paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
    optionText: { fontSize: 16 },
});

export default SelectDropdown;
