import { FC } from "react";
import Dialog from "react-native-dialog";

type ModalDialogProps = {
  visible: boolean;
  dialogTitle?: string;
  onCancel: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
  showDescription: boolean;
};

const ModalDialog: FC<ModalDialogProps> = ({ dialogTitle, visible, onCancel, onDelete, children, showDescription = false }) => {
  return (
    <Dialog.Container visible={visible}>
      {dialogTitle && <Dialog.Title>{dialogTitle}</Dialog.Title>}
      {children}
      {showDescription && (<Dialog.Description>
        Do you want to delete this review? You cannot undo this action.
      </Dialog.Description>)}
      <Dialog.Button label="Cancel" onPress={onCancel} />
      {onDelete && <Dialog.Button label="Delete" onPress={onDelete} />}
    </Dialog.Container>
  );
};

export default ModalDialog;

