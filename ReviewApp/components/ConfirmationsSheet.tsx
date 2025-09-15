import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import BottomSheetScrollView from "./BottomSheetScrollView";
import { useTheme } from "../providers/ThemeContext";

interface ConfirmationSheetProps {
  title: string;
  message: string;
  isOpen: boolean;
  snapPoints?: string[];
  onClose: () => void;
  onConfirm?: () => void;
  onCancel: () => void;
}

const ConfirmationSheet: React.FC<ConfirmationSheetProps> = ({
  title,
  message,
  isOpen,
  snapPoints,
  onClose,
  onConfirm,
  onCancel,
}) => {

  const { colors, fonts } = useTheme()
  return (
    <BottomSheetScrollView
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={snapPoints || ['50%', '30%']}
    >
      <View style={styles.sheetContent}>
        <Text style={[styles.sheetTitle, { color: colors.textColorPrimary, fontFamily: fonts.bold }]}>{title}</Text>
        <Text style={[styles.sheetText, { color: colors.textColorSecondary }]}>{message}</Text>
        <View style={styles.sheetActions}>
          <TouchableOpacity
            style={[styles.sheetButton, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sheetButton, styles.confirmButton]}
            onPress={onConfirm}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  sheetContent: {
    padding: 20,
    alignItems: "center",
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  sheetText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  sheetActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  sheetButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "40%",
  },
  cancelButton: {
    backgroundColor: "#ddd",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#333",
    textAlign: 'center'
  },
  confirmButton: {
    backgroundColor: "#ff4c4c",
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: 'center'
  },
});

export default ConfirmationSheet;
