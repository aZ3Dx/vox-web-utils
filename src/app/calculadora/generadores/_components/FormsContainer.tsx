"use client";

import {
  Button,
  Card,
  Fieldset,
  Flex,
  NumberFormatter,
  NumberInput,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import FormGens from "./FormGens";
import { useState } from "react";

const FormsContainer = () => {
  const [cantidadUsuarios, setCantidadUsuarios] = useState(1);
  const eliminarUltimoUsuario = () => {
    if (cantidadUsuarios > 1) {
      setCantidadUsuarios(cantidadUsuarios - 1);
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleanedData: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      // De las key como "1-1-cantidad_generadores" extrae solo el "1-1"
      if (key.includes("-")) {
        const [idUsuario, idFieldset] = key.split("-");
        const userKey = `Usuario ${idUsuario}`;
        const fieldsetKey = `Generador ${idFieldset}`;
        const cleanedKeyName = key.replace(`${idUsuario}-${idFieldset}-`, "");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cleanedValue: any = value;
        if (cleanedKeyName === "cantidad_generadores") {
          cleanedValue = parseInt(String(value).replace(/\D/g, ""));
        }
        cleanedData[userKey] = {
          ...cleanedData[userKey],
          [fieldsetKey]: {
            ...cleanedData[userKey]?.[fieldsetKey],
            // [key.replace(`${idUsuario}-${idFieldset}-`, "")]: value,
            // [key]: value,
            [cleanedKeyName]: cleanedValue,
          },
        };
      }
    });
    cleanedData.tiempo = parseInt(
      String(formData.get("tiempo")).replace(/\D/g, "")
    );
    cleanedData.multiplicador = parseFloat(
      String(formData.get("multiplicador")).replace(/[^0-9.]/g, "")
    );
    cleanedData.varita = parseFloat(
      String(formData.get("varita")).replace(/[^0-9.]/g, "")
    );
    cleanedData.evento = formData.get("evento") ? true : false;
    console.log(cleanedData);
    // Enviamos la data a la API /api/calcs
    setIsSubmitting(true);
    fetch("/api/calcs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanedData),
    })
      .then((response) => response.json())
      .then((data) => {
        setResponseData(data);
        setIsSubmitting(false);
        // console.log("Success:", data);
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.error("Error:", error);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Flex justify="flex-start" wrap="wrap" align="start" gap={16}>
          {[...Array(cantidadUsuarios).keys()].map((i) => (
            <FormGens
              key={i}
              idUsuario={i + 1}
              total={cantidadUsuarios}
              eliminar={eliminarUltimoUsuario}
            />
          ))}
          <div
            style={{
              minWidth: "22rem",
              minHeight: "4rem",
              alignSelf: "stretch",
            }}
          >
            <Button
              styles={{ root: { height: "100%" } }}
              variant="outline"
              fullWidth
              radius="md"
              onClick={() => setCantidadUsuarios(cantidadUsuarios + 1)}
            >
              Agregar otro usuario
            </Button>
          </div>
        </Flex>
        <Fieldset mt="md" radius="md" legend="Variables Generales">
          <Flex wrap="wrap" align="center" gap={16}>
            <NumberInput
              name="tiempo"
              label="Tiempo"
              placeholder="Ingrese el tiempo en horas"
              min={1}
              clampBehavior="strict"
              allowNegative={false}
              allowDecimal={false}
              suffix=" horas"
            />
            <NumberInput
              name="multiplicador"
              label="Multiplicador"
              placeholder="Ingrese el multiplicador"
              min={1}
              clampBehavior="strict"
              allowNegative={false}
              decimalScale={2}
              fixedDecimalScale
              prefix="x "
              step={0.01}
              stepHoldDelay={500}
              stepHoldInterval={50}
            />
            <NumberInput
              name="varita"
              label="Varita"
              placeholder="Multiplicador de la varita"
              min={1}
              clampBehavior="strict"
              allowNegative={false}
              decimalScale={2}
              fixedDecimalScale
              prefix="x "
              step={0.5}
            />
            <Switch
              name="evento"
              mt="lg"
              label="Evento venta x2"
              radius="md"
              color="green"
            />
          </Flex>
        </Fieldset>
        <Button
          mt="md"
          size="lg"
          radius="md"
          type="submit"
          fullWidth
          loading={isSubmitting}
        >
          Calcular
        </Button>
      </form>
      {responseData && (
        // Iterar sobre los resultados y mostrarlos
        <>
          <Title order={2} mt={"md"} mb={"md"}>
            Resultados
          </Title>
          <Flex justify="flex-start" wrap="wrap" align="start" gap={16}>
            {Object.keys(responseData).map((userKey) => (
              <Card
                key={userKey}
                withBorder
                radius="md"
                p="md"
                styles={{ root: { minWidth: "22rem" } }}
              >
                <Card.Section withBorder inheritPadding py={8}>
                  <Text size="xl" fw={700}>
                    {userKey}
                  </Text>
                </Card.Section>
                {Object.keys(responseData[userKey]).map((fieldsetKey) => (
                  // <li key={fieldsetKey}>
                  //   <h4>{fieldsetKey}</h4>
                  //   <p>{responseData[userKey][fieldsetKey]}</p>
                  // </li>
                  <Card.Section
                    key={fieldsetKey}
                    inheritPadding
                    withBorder
                    py={8}
                  >
                    <Text size="md">{fieldsetKey}</Text>
                    <NumberFormatter
                      value={responseData[userKey][fieldsetKey]}
                      prefix="$ "
                      thousandSeparator="."
                      decimalSeparator=","
                    />
                  </Card.Section>
                ))}
              </Card>
            ))}
          </Flex>
        </>
      )}
    </>
  );
};
export default FormsContainer;
