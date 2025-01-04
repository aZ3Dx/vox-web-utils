import {
  Button,
  Fieldset,
  Flex,
  Modal,
  NumberInput,
  SimpleGrid,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ScanSearch } from "lucide-react";
import generadores from "@/constants/gens";
import { useState } from "react";
import { Generador } from "@/types/types";
import Image from "next/image";

interface FieldGenProps {
  idFieldset: number;
  idUsuario: number;
}

const FieldGen = ({ idFieldset, idUsuario }: FieldGenProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [modalPage, setModalPage] = useState(1);

  const [genSelected, setGenSelected] = useState<Generador>();

  return (
    <>
      <Fieldset legend={`Generador ${idFieldset}`}>
        <NumberInput
          // name="cantidad_generadores"
          name={`${idUsuario}-${idFieldset}-cantidad_generadores`}
          label="Cantidad de Generadores"
          placeholder="Ingrese la cantidad de generadores"
          min={1}
          clampBehavior="strict"
          suffix=" gens"
          allowNegative={false}
          allowDecimal={false}
          autoComplete="off"
        />
        <TextInput
          label="Tipo de Generador"
          placeholder="Seleccione el tipo de generador"
          readOnly
          value={genSelected?.name ?? ""}
          {...(genSelected
            ? {
                leftSection: (
                  <Image
                    src={genSelected.image}
                    alt={genSelected.name}
                    width={20}
                    height={20}
                    loading="eager"
                    // styles={{ root: { width: "1.5rem", height: "1.5rem" } }}
                  />
                ),
              }
            : {})}
          rightSection={
            <ScanSearch
              size={16}
              color="dodgerblue"
              onClick={open}
              style={{ cursor: "pointer" }}
            />
          }
          autoComplete="off"
        />
        <TextInput
          name={`${idUsuario}-${idFieldset}-generador_id`}
          type="hidden"
          value={genSelected?.id ?? ""}
          readOnly
        />
      </Fieldset>
      <Modal
        opened={opened}
        onClose={close}
        centered
        title="Generadores"
        radius="md"
      >
        {opened && (
          <>
            <SimpleGrid cols={7} spacing="xs">
              {generadores
                .slice((modalPage - 1) * 7 * 4, modalPage * 7 * 4)
                .map((gen) => (
                  <Tooltip.Floating key={gen.id} label={gen.name} radius="md">
                    <Image
                      src={gen.image}
                      alt={gen.name}
                      width={50}
                      height={50}
                      onClick={() => {
                        setGenSelected(gen);
                        close();
                      }}
                      loading="lazy"
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip.Floating>
                ))}
            </SimpleGrid>
            <Flex justify="center" mt="md" gap="md">
              <Button
                variant="outline"
                onClick={() => setModalPage(modalPage - 1)}
                disabled={modalPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                onClick={() => setModalPage(modalPage + 1)}
                disabled={modalPage === 4}
              >
                Siguiente
              </Button>
            </Flex>
          </>
        )}
      </Modal>
    </>
  );
};
export default FieldGen;
