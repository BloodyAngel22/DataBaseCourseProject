"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect } from "react";
import { MdOutlineLibraryAdd } from "react-icons/md";

interface ModalCreateProps<T> {
  name: string;
  onSubmit: () => void;
  children?: React.ReactNode;
  loading: boolean;
  error: string | null;
  isCreatedSuccess: boolean;
  setIsCreatedSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  reset: () => void;
}

export default function ModalCreate<T>({
  name,
  onSubmit,
  children,
  loading,
  error,
  isCreatedSuccess,
  setIsCreatedSuccess,
  reset,
}: ModalCreateProps<T>) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleClose = () => {
    setIsCreatedSuccess(false);
    reset();
    onOpenChange();
  };

  useEffect(() => {
    if (isCreatedSuccess) {
      setIsCreatedSuccess(false);
      onOpenChange();
    }
  }, [isCreatedSuccess, setIsCreatedSuccess, onOpenChange]);

  return (
    <>
      <Tooltip content="Create">
        <Button
          isIconOnly
          size="sm"
          color='secondary'
          variant="shadow"
          onPress={onOpen}
          startContent={<MdOutlineLibraryAdd className="text-lg"/>}
        ></Button>
      </Tooltip>

      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="outside"
      >
        <ModalContent>
          <>
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                Create new {name}
              </ModalHeader>
              <ModalBody>
                {children}
                {error && <p className="text-red-500">{error}</p>}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="shadow"
                  onPress={handleClose}
                  isDisabled={loading}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  variant="shadow"
                  type="submit"
                  isDisabled={loading}
                >
                  {loading ? "Creating..." : "Create"}
                </Button>
              </ModalFooter>
            </form>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
