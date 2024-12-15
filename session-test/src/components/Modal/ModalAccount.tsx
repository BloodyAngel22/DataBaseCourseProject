"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { MdOutlineAccountCircle } from "react-icons/md";
import FormLogin from "../Form/FormLogin";
import FormRegister from "../Form/FormRegister";

export default function AccountModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedTab, setSelectedTab] = useState<React.Key>("login");

  return (
    <>
      <Button isIconOnly variant="light" onPress={onOpen}>
        <MdOutlineAccountCircle className="text-3xl text-white" />
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
              </ModalHeader>
              <ModalBody className="">
                <Tabs
                  fullWidth
                  aria-label="Tabs"
									onSelectionChange={setSelectedTab}
									placement='top'
                >
                  <Tab key={"login"} title="Login" className="w-full">
										<FormLogin />
                  </Tab>
                  <Tab key={"register"} title="Register" className="w-full">
										<FormRegister />
                  </Tab>
                </Tabs>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose} className="w-full">
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
