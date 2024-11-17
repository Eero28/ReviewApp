import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import Dialog from "react-native-dialog";

type ModalDialogProps = {
  visible: boolean;
  dialogTitle: string;
  onCancel: () => void;
  onDelete: () => void;
};

const ModalDialog: FC<ModalDialogProps> = ({dialogTitle, visible, onCancel, onDelete }) => {
  return (
    <Dialog.Container visible={visible}>
      <Dialog.Title>{dialogTitle}</Dialog.Title>
      <Dialog.Description>
        Do you want to delete this review? You cannot undo this action.
      </Dialog.Description>
      <Dialog.Button label="Cancel" onPress={onCancel} />
      <Dialog.Button label="Delete" onPress={onDelete} />
    </Dialog.Container>
  );
};

export default ModalDialog;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "red", 
    },
});