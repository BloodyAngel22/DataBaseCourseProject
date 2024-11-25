import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from "@nextui-org/react";
import { IoClose } from "react-icons/io5";
import { IoCreateOutline } from "react-icons/io5";
import React from "react";
import { FiEdit3 } from "react-icons/fi";

interface ModalUpdateProps {
	header?: string;
	btnText: string;
	children?: React.ReactNode;
	handleSubmit: () => void;
	isSuccess?: boolean;
	onClick?: () => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ModalUpdate({ header, children, handleSubmit, isSuccess, btnText, onClick }: ModalUpdateProps) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	
	const onClickBtn = () => {
		onClick?.();	
		onOpen();
	}

  return (
    <>
      <Tooltip content="Edit">
        <Button
          isIconOnly
          size="sm"
          color="secondary"
					className="w-max"
					onClick={onClickBtn}
        >
          <FiEdit3 />
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
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {header}
              </ModalHeader>
              <form
                onSubmit={(ev: React.FormEvent) => {
                  ev.preventDefault();
                  handleSubmit();
                  onClose();
                }}
              >
                <ModalBody>{children}</ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    size="sm"
                    onPress={onClose}
                    startContent={<IoClose />}
                  >
                    Close
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    type="submit"
                    startContent={<IoCreateOutline />}
                  >
                    {btnText}
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
