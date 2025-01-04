"use client";

import { useDisclosure } from "@mantine/hooks";
import { Button, Modal } from "@mantine/core";

const ModalGens = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal opened={opened} onClose={close} title="Authentication" centered>
        {/* Modal content */}
      </Modal>
      <Button variant="default" onClick={open}>
        Open centered Modal
      </Button>
    </>
  );
};
export default ModalGens;
