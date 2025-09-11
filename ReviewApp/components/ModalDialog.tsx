import { FC } from "react";
import Dialog from "react-native-dialog";
import { useTheme } from "../providers/ThemeContext";
import { View } from "react-native";

type ModalDialogProps = {
  visible: boolean;
  dialogTitle?: string;
  onCancel: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
  showDescription: boolean;
};

const ModalDialog: FC<ModalDialogProps> = ({ dialogTitle, visible, onCancel, onDelete, children, showDescription = false }) => {
  const { colors, fonts } = useTheme();
  return (

    <Dialog.Container contentStyle={{ backgroundColor: colors.modalDialog.bg, borderRadius: 16 }} visible={visible}>
      {dialogTitle && <Dialog.Title style={{ fontFamily: fonts.bold, color: colors.textColorPrimary }}>{dialogTitle}</Dialog.Title>}
      {children}
      {showDescription && (<Dialog.Description style={{ color: colors.textColorSecondary }}>
        Do you want to delete this review? You cannot undo this action.
      </Dialog.Description>)}
      <Dialog.Button style={{ fontFamily: fonts.regular }} color={colors.textColorSecondary} label="Cancel" onPress={onCancel} />
      {onDelete && <Dialog.Button style={{ fontFamily: fonts.regular }} color={colors.alerts.danger} label="Delete" onPress={onDelete} />}
    </Dialog.Container>
  );
};

export default ModalDialog;

