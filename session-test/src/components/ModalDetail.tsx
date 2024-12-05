import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { BiDetail } from "react-icons/bi";

interface ModalDetailsProps<T extends { [key: string]: any}> {
	id: string;
	header: string;
	fetchData: (id: string) => Promise<T>;
}

export default function ModalDetail<T extends { [key: string]: any }>({
  id,
  header,
  fetchData,
}: ModalDetailsProps<T>) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchData(id);
      setData(data);
    };
    fetch();
  }, [id, fetchData]);

  const renderDetails = (data: T) => {
    return (
      <ul>
        {Object.entries(data)
          .filter(([key]) => key !== "$id" && key !== "id")
          .map(([key, value]) => (
            <li key={key}>
              <div>
                <span className="font-bold">{key}:</span> {String(value)}
              </div>
            </li>
          ))}
      </ul>
    );
  };

  return (
    <>
      <Tooltip content="View Details">
        <Button
          isIconOnly
          size="sm"
          onPress={onOpen}
          color="primary"
          className="scale-85"
          variant="shadow"
          startContent={<BiDetail className="text-lg" />}
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
              <ModalHeader className="flex flex-col gap-1">
                {header}
              </ModalHeader>
              <ModalBody>
                {data ? renderDetails(data) : <div>Loading...</div>}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  onPress={onClose}
                  variant="shadow"
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}