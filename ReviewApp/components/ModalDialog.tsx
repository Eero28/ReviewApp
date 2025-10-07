import React, { FC } from "react";
import { Dialog, Portal, Button, Text } from "react-native-paper";
import { useTheme } from "../providers/ThemeContext";

type ModalDialogProps = {
  visible: boolean;
  dialogTitle?: string;
  onCancel: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
  showDescription?: boolean;
};

const ModalDialog: FC<ModalDialogProps> = ({
  dialogTitle,
  visible,
  onCancel,
  onDelete,
  children,
  showDescription = false,
}) => {
  const { colors, fonts } = useTheme();

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onCancel}
        style={{
          backgroundColor: colors.modalDialog.bg,
          borderRadius: 16,
        }}
      >
        {dialogTitle && (
          <Dialog.Title style={{ fontFamily: fonts.bold, color: colors.textColorPrimary }}>
            {dialogTitle}
          </Dialog.Title>
        )}

        <Dialog.Content>
          {children}
          {showDescription && (
            <Text variant="bodyMedium" style={{ color: colors.textColorSecondary }}>
              Do you want to delete this review? You cannot undo this action.
            </Text>
          )}
        </Dialog.Content>

        <Dialog.Actions>
          <Button
            onPress={onCancel}
            textColor={colors.textColorSecondary}
            labelStyle={{ fontFamily: fonts.regular }}
          >
            Cancel
          </Button>
          {onDelete && (
            <Button
              onPress={onDelete}
              textColor={colors.alerts.danger}
              labelStyle={{ fontFamily: fonts.regular }}
            >
              Delete
            </Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ModalDialog;
