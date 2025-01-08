"use client";

import { Button, CloseButton, Fieldset } from "@mantine/core";
import FieldGen from "./FieldGen";
import { useState } from "react";

interface FormGensProps {
  idUsuario: number;
  eliminar: () => void;
  total: number;
  cantidadGensDefault: number;
  infoGensPerGen?: string[];
}

const FormGens = ({
  idUsuario,
  eliminar,
  total,
  cantidadGensDefault,
  infoGensPerGen,
}: FormGensProps) => {
  // TODO: infoGensPerUser
  // const info = infoGensPerUser.split("-");
  // const userId = info[0];
  // const fieldId= info[1];
  // const fieldValue = info[2];
  // const [userId, fieldId, fieldValue] = infoGensPerGen.split("-");
  const [cantidadGens, setCantidadGens] = useState(cantidadGensDefault ?? 1);
  return (
    <div style={{ minWidth: "22rem", position: "relative" }}>
      <Fieldset legend={`Usuario ${idUsuario}`} radius="md">
        {idUsuario === total && total > 1 && (
          <CloseButton
            styles={{ root: { position: "absolute", top: 14, right: 4 } }}
            onClick={eliminar}
          />
        )}
        {[...Array(cantidadGens)].map((_, i) => (
          <FieldGen
            key={i}
            idFieldset={i + 1}
            idUsuario={idUsuario}
            defaultValues={infoGensPerGen?.[i] ?? ""}
          />
        ))}
        {cantidadGens > 1 && (
          <Button
            variant="outline"
            color="red"
            fullWidth
            mt="md"
            radius={"md"}
            onClick={() => setCantidadGens(cantidadGens - 1)}
          >
            Quitar último tipo de Gen
          </Button>
        )}
        <Button
          variant="outline"
          fullWidth
          mt="md"
          radius={"md"}
          onClick={() => setCantidadGens(cantidadGens + 1)}
        >
          Agregar otro tipo de Gen
        </Button>
      </Fieldset>
    </div>
  );
};
export default FormGens;
