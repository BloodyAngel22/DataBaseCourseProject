import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from "@nextui-org/drawer";
import { Button, Tooltip, useDisclosure } from "@nextui-org/react";
import { GrFilter } from "react-icons/gr";

interface FilterSectionProps {
	onSubmit: () => void;
	resetFilter: () => void;
	children: React.ReactNode;
}

export default function FilterSection({ onSubmit, resetFilter, children }: FilterSectionProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Tooltip content="Filter">
        <Button size="sm" isIconOnly color="secondary" onPress={onOpen}>
          <GrFilter className="text-lg" />
        </Button>
      </Tooltip>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose: () => void) => (
            <>
              <form onSubmit={onSubmit}>
                <DrawerHeader className="flex flex-col gap-1">
                  Filter
                </DrawerHeader>
                <DrawerBody>{children}</DrawerBody>
                <DrawerFooter>
                  <Button color="danger" variant="shadow" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    variant="shadow"
                    onPress={resetFilter}
                  >
                    Reset
                  </Button>
                  <Button color="primary" variant="shadow" type="submit">
                    Action
                  </Button>
                </DrawerFooter>
              </form>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
