import { Title } from "@mantine/core";
import FormsContainer from "./_components/FormsContainer";
import { Suspense } from "react";

const GeneradoresPage = () => {
  return (
    <>
      <Title order={1} mb={"md"}>
        Calculadora de Generadores
      </Title>
      <Suspense fallback={<div>Loading...</div>}>
        <FormsContainer />
      </Suspense>
    </>
  );
};
export default GeneradoresPage;
