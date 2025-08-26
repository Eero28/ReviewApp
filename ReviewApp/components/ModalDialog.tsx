import { FC } from "react";
import Dialog from "react-native-dialog";

type ModalDialogProps = {
  visible: boolean;
  dialogTitle: string;
  onCancel: () => void;
  onDelete?: () => void;
};

const ModalDialog: FC<ModalDialogProps> = ({ dialogTitle, visible, onCancel, onDelete }) => {
  return (
    <Dialog.Container visible={visible}>
      <Dialog.Title>{dialogTitle}</Dialog.Title>
      <Dialog.Description>
        Do you want to delete this review? You cannot undo this action.
      </Dialog.Description>
      <Dialog.Button label="Cancel" onPress={onCancel} />
      <Dialog.Button label="Delete" onPress={onDelete ? onDelete : () => console.log("deleted")} />
    </Dialog.Container>
  );
};

export default ModalDialog;

