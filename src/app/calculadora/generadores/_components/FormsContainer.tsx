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
import { useSearchParams } from "next/navigation";

const FormsContainer = () => {
  const searchParams = useSearchParams();
  const [cantidadUsuarios, setCantidadUsuarios] = useState(
    searchParams.get("cu") ? parseInt(searchParams.get("cu")!) : 1
  );
  // const defaultTiempo = searchParams.get("t");
  const infoGensPerGen = searchParams.get("igpg") ?? "";
  const info_gens_per_gen =
    infoGensPerGen !== "" &&
    infoGensPerGen
      .split(".") // Dividir por puntos para separar los registros
      .reduce((acc: Record<string, string[]>, group) => {
        const [user, rest] = group.split(","); // Separar usuario y resto
        // Asegurarse de que el índice del usuario exista en el array
        acc[user] = acc[user] || [];

        // Añadir el resto del usuario al grupo correspondiente
        acc[user].push(rest.split("-").slice(1).join("-"));

        return acc;
      }, {});
  const compactData = Object.values(info_gens_per_gen);
  const defaultValues = {
    tiempo: searchParams.get("t") ? parseInt(searchParams.get("t")!) : "",
    multiplicador: searchParams.get("m")
      ? parseInt(searchParams.get("m")!)
      : "",
    varita: searchParams.get("v") ? parseInt(searchParams.get("v")!) : "",
    evento: searchParams.get("e") ? searchParams.get("e") === "true" : false,
    gens_per_user: searchParams.get("gpu")
      ? (searchParams.get("gpu") ?? "1").split("-").map(Number)
      : [1],
    info_gens_per_gen: compactData,
  };
  console.log(defaultValues);
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
    cleanedData.venta = formData.get("cantidad_obtenida_venta")
      ? parseInt(
          String(formData.get("cantidad_obtenida_venta")).replace(/\D/g, "")
        )
      : 0;
    console.log(cleanedData);
    // Actualizamos los searchParams
    const generalParams = `?t=${cleanedData.tiempo}&m=${cleanedData.multiplicador}&v=${cleanedData.varita}&e=${cleanedData.evento}`;
    const usersQuantityParams = `&cu=${cantidadUsuarios}`;
    let gensQuantityPerUserParams = "&gpu=";
    // &gu=x-y-z.etc...
    let infoGensPerGen = "&igpg=";
    // &igpg=1,1-x-y.1,2-x-y.2,1-x-y.3,1-x-y.etc...
    for (let i = 1; i <= cantidadUsuarios; i++) {
      const quantity = Object.keys(cleanedData[`Usuario ${i}`]).length;
      if (i === 1) {
        gensQuantityPerUserParams += quantity;
      } else gensQuantityPerUserParams += `-${quantity}`;
      for (let j = 1; j <= quantity; j++) {
        const quantityGen =
          cleanedData[`Usuario ${i}`][`Generador ${j}`].cantidad_generadores;
        const idGen =
          cleanedData[`Usuario ${i}`][`Generador ${j}`].generador_id;
        if (j === 1 && i === 1) {
          infoGensPerGen += `${i},${j}-${quantityGen}-${idGen}`;
        } else infoGensPerGen += `.${i},${j}-${quantityGen}-${idGen}`;
      }
    }
    const params = `${generalParams}${usersQuantityParams}${gensQuantityPerUserParams}${infoGensPerGen}`;
    window.history.replaceState(null, "", `/calculadora/generadores${params}`);
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
        <Fieldset mt="md" radius="md" legend="Variables Generales">
          <Flex wrap="wrap" align="center" gap={16}>
            <NumberInput
              name="tiempo"
              defaultValue={defaultValues.tiempo}
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
              defaultValue={defaultValues.multiplicador}
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
              defaultValue={defaultValues.varita}
              label="Varita"
              placeholder="Multiplicador de la varita"
              min={1}
              max={5}
              clampBehavior="strict"
              allowNegative={false}
              decimalScale={2}
              fixedDecimalScale
              prefix="x "
              step={0.5}
            />
            <Switch
              name="evento"
              defaultChecked={defaultValues.evento}
              mt="lg"
              label="Evento venta x2"
              radius="md"
              color="green"
            />
          </Flex>
        </Fieldset>
        <Flex justify="flex-start" wrap="wrap" align="start" gap={16} mt="md">
          {[...Array(cantidadUsuarios).keys()].map((i) => (
            <FormGens
              key={i}
              idUsuario={i + 1}
              total={cantidadUsuarios}
              eliminar={eliminarUltimoUsuario}
              cantidadGensDefault={defaultValues.gens_per_user[i]}
              infoGensPerGen={defaultValues.info_gens_per_gen[i]}
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
        <Fieldset mt="md" radius="md" legend="Opcional">
          <Flex wrap="wrap" align="center" gap={16}>
            <NumberInput
              name="cantidad_obtenida_venta"
              label="Cantidad Obtenida en Venta"
              placeholder="Ingrese la cantidad obtenida en venta"
              description="Usado para calcular la ganancia de cada uno de los generadores independientemente del rendimiento del gen"
              min={1}
              clampBehavior="strict"
              allowNegative={false}
              allowDecimal={true}
              decimalScale={2}
              prefix="$ "
              thousandSeparator=" "
              decimalSeparator=","
              step={0.01}
              stepHoldDelay={500}
              stepHoldInterval={50}
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
          <Title order={3}>
            Valor ideal a un ritmo de 2.45 drops por minuto
          </Title>
          <Title order={3} mt={"md"} mb={"md"}>
            Y Valor real en base a la cantidad obtenida en venta y proporcional
            al valor ideal
          </Title>
          <Flex justify="flex-start" wrap="wrap" align="start" gap={16} mt="md">
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
                {/* Recorrer todo menos el ultimo */}
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
                      thousandSeparator=" "
                      decimalSeparator=","
                      decimalScale={2}
                      fixedDecimalScale
                    />
                  </Card.Section>
                ))}
              </Card>
            ))}
          </Flex>
          {/* Mostrar suma total */}
          {/* <Card withBorder radius="md" p="md" mt="md">
            <Card.Section withBorder inheritPadding py={8}>
              <Text size="xl" fw={700}>
                Total
              </Text>
            </Card.Section>
            <Card.Section inheritPadding withBorder py={8}>
              <NumberFormatter
                value="1234"
                prefix="$ "
                thousandSeparator=" "
                decimalSeparator=","
                decimalScale={2}
              />
            </Card.Section>
          </Card> */}
        </>
      )}
    </>
  );
};
export default FormsContainer;
