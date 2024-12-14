import {
  Tooltip,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
	Input,
} from "@nextui-org/react";
import { useEffect } from "react";
import { FiEdit3 } from "react-icons/fi";
import FormInput from "./Form/FormInput";
import { UseFormRegister } from "react-hook-form";

interface ModalUpdateProps {
  name: string;
  onSubmit: () => void;
  children?: React.ReactNode;
  isUpdatedSuccess?: boolean;
	setIsUpdatedSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
	reset: () => void;
	isOpen: boolean;
	onClose: () => void;
}

export default function ModalUpdate({
  name,
  onSubmit,
  children,
  isUpdatedSuccess,
	setIsUpdatedSuccess,
	reset,
	isOpen,
	onClose
}: ModalUpdateProps) {
	const { onOpenChange } = useDisclosure({
		isOpen
	});

  return (
    <>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
				scrollBehavior="outside"
				onClose={onClose}
      >
        <ModalContent>
            <>
              <form onSubmit={onSubmit}>
                <ModalHeader className="flex flex-col gap-1">
                  Update {name}
                </ModalHeader>
                <ModalBody>
								{children}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="shadow"
                    onPress={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    color="primary"
                    variant="shadow"
                    type="submit"
									>
										Update
                  </Button>
                </ModalFooter>
              </form>
            </>
        </ModalContent>
      </Modal>
    </>
  );
}
