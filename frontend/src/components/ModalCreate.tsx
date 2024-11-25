import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { IoCreateOutline } from "react-icons/io5";
import React from "react";

interface ModalCreateProps {
	header?: string;
	btnText: string;
	children?: React.ReactNode;
	handleSubmit: () => void;
	isSuccess?: boolean;
}

export default function ModalCreate({ header, children, handleSubmit, isSuccess, btnText }: ModalCreateProps) {
	const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <Button
        color="primary"
        startContent={<MdOutlineLibraryAdd />}
        size="sm"
        className="w-max"
        onPress={onOpen}
      >
        {btnText}
      </Button>
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
							<form onSubmit={(ev: React.FormEvent) => {
								ev.preventDefault();
								handleSubmit();
								// onClose();
							}}>
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
