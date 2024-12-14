import { Tooltip, Button, useDisclosure, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { MdDelete } from "react-icons/md";

interface ModalDeleteProps {
	title: string;
  content: string;
	id?: string;
	id2?: string;
	handleDelete?: (id: string) => void;
	handleDelete2?: (id1: string, id2: string) => void;
}

export default function ModalDelete({
	title,
  content,
	id,
	id2,
	handleDelete,
	handleDelete2
}: ModalDeleteProps) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	
	const handleDeleteBtn = () => {
		if (handleDelete && id) {
			handleDelete(id);
		}
		if (handleDelete2 && id && id2) {
			handleDelete2(id, id2);
		}
		onOpenChange();
	}

  return (
    <>
      <Tooltip content={content}>
        <Button
          className="scale-85"
          variant="shadow"
          isIconOnly
          size="sm"
          color="danger"
          onPress={onOpen}
          startContent={<MdDelete className="text-lg" />}
        ></Button>
      </Tooltip>

			<Modal
				isDismissable={false}
				isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>
                <p>Are you sure? You can't undo this action afterwards.</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="shadow" onPress={onClose}>
                  Close
                </Button>
                <Button
									color="danger"
									variant="shadow"
                  onPress={() => {
                    handleDeleteBtn();
                  }}
								>
									Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
