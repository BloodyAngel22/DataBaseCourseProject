import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { BiDetail } from "react-icons/bi";

interface ModalDetailsProps<T extends { [key: string]: any }> {
	id: string;
	id2?: string;
  header: string;
	fetchData?: (id: string) => Promise<T>;
	fetchData2?: (id1: string, id2: string) => Promise<T>;
}

export default function ModalDetail<T extends { [key: string]: any }>({
	id,
	id2,
  header,
	fetchData,
	fetchData2
}: ModalDetailsProps<T>) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
		const fetch = async () => {
			if (fetchData) {
				const data = await fetchData(id);
				setData(data);
			}
			if (fetchData2 && id2) {
				const data = await fetchData2(id, id2);
				setData(data);
			}
    };
    fetch();
  }, [id, fetchData, fetchData2]);

  const renderDetails = (data: T) => {
    const renderValue = (value: any): JSX.Element | string => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return (
          <ul className="pl-4">
            {Object.entries(value).filter(([key]) => key !== "$id" && key !== "id" && !key.includes("Id")).map(([nestedKey, nestedValue]) => (
              <li key={nestedKey}>
                <span className="font-bold">{nestedKey}:</span> {renderValue(nestedValue)}
              </li>
            ))}
          </ul>
        );
      }
      return String(value);
    };

    return (
      <ul>
        {Object.entries(data)
          .filter(([key]) => key !== "$id" && key !== "id" && !key.includes("Id"))
          .map(([key, value]) => (
            <li key={key}>
              <div>
                <span className="font-bold">{key}:</span> {renderValue(value)}
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
        scrollBehavior="outside"
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
