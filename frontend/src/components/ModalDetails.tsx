import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { FaEye } from "react-icons/fa";

interface ModalDetailsProps {
  title: string; // Заголовок модального окна
  children: React.ReactNode; // Содержимое окна
}

const ModalDetails: React.FC<ModalDetailsProps> = ({ title, children }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Tooltip content="View Details">
        <Button
          isIconOnly
          size="sm"
          color="primary"
          onPress={onOpen}
        >
          <FaEye />
        </Button>
      </Tooltip>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onclose) => (
            <>
              <ModalHeader>{title}</ModalHeader>
              <ModalBody>{children}</ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onclose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalDetails;
