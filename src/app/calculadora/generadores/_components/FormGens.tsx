"use client";

import { Button, CloseButton, Fieldset } from "@mantine/core";
import FieldGen from "./FieldGen";
import { useState } from "react";

interface FormGensProps {
  idUsuario: number;
  eliminar: () => void;
  total: number;
}

const FormGens = ({ idUsuario, eliminar, total }: FormGensProps) => {
  const [cantidadGens, setCantidadGens] = useState(1);
  return (
    <div style={{ minWidth: "22rem", position: "relative" }}>
      <Fieldset legend={`Usuario ${idUsuario}`} radius="md">
        {idUsuario === total && total > 1 && (
          <CloseButton
            styles={{ root: { position: "absolute", top: 14, right: 4 } }}
            onClick={eliminar}
          />
        )}
        {[...Array(cantidadGens).keys()].map((i) => (
          <FieldGen key={i} idFieldset={i + 1} idUsuario={idUsuario} />
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
