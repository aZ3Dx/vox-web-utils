import { NextRequest, NextResponse } from "next/server";
import { default as generadoresList } from "@/constants/gens";
import Decimal from "decimal.js";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { tiempo, multiplicador, varita, evento, ...usuarios } = data;
  const multiplicadorFinal = multiplicador + varita + (evento ? 2 : 0);
  // Data received example:
  //   {
  //     "Usuario 1": {
  //       "Generador 1": {
  //         "cantidad_generadores": 1,
  //         "generador_id": "44"
  //       },
  //       "Generador 2": {
  //         "cantidad_generadores": 4,
  //         "generador_id": "12"
  //       }
  //     },
  //     "Usuario 2": {
  //       "Generador 1": {
  //         "cantidad_generadores": 12,
  //         "generador_id": "85"
  //       },
  //       "Generador 2": {
  //         "cantidad_generadores": null,
  //         "generador_id": ""
  //       }
  //     },
  //     "formData": 12,
  //     "multiplicador": 22,
  //     "varita": 5,
  //     "evento": false
  //   }
  const formula = (
    horas: number,
    numero_gens: number,
    drop_bajo: number,
    drop_alto: number,
    multiplicador: number
  ) => {
    // console.log(
    //   `${horas} x 180 x ${numero_gens} x [(24/27) x ${drop_bajo} + (3/27) x ${drop_alto}] x ${multiplicador}`
    // );
    if (!horas || !numero_gens || !drop_bajo || !drop_alto || !multiplicador) {
      return new Decimal(0);
    }
    const primerPaso = new Decimal(horas).times(180).times(numero_gens);
    const segundoPaso = new Decimal(24)
      .div(27)
      .times(drop_bajo)
      .plus(new Decimal(3).div(27).times(drop_alto));
    const tercerPaso = primerPaso.times(segundoPaso);
    const cuartoPaso = tercerPaso.times(multiplicador).toFixed(0);
    return cuartoPaso;
    // return new Decimal(horas)
    //   .times(180)
    //   .times(numero_gens)
    //   .times(
    //     new Decimal(24)
    //       .div(27)
    //       .times(drop_bajo)
    //       .plus(new Decimal(3).div(27).times(drop_alto))
    //   )
    //   .times(multiplicador);
  };

  const resultados: Record<string, Record<string, Decimal | string>> = {};

  for (const usuario in usuarios) {
    const generadores = usuarios[usuario];
    resultados[usuario] = {};

    for (const generador in generadores) {
      const { cantidad_generadores, generador_id } = generadores[generador];

      // Validar que los datos sean correctos
      if (
        cantidad_generadores &&
        generador_id &&
        !isNaN(parseInt(generador_id))
      ) {
        const generadorSeleccionado = generadoresList.find(
          (gen) => gen.id === parseInt(generador_id)
        );
        const drop_bajo = generadorSeleccionado?.low_drop;
        const drop_alto = generadorSeleccionado?.high_drop;

        const resultado = formula(
          tiempo,
          cantidad_generadores,
          drop_bajo || 0,
          drop_alto || 0,
          multiplicadorFinal
        );
        // console.log(
        //   tiempo,
        //   cantidad_generadores,
        //   drop_bajo,
        //   drop_alto,
        //   multiplicadorFinal
        // );

        resultados[usuario][generador] = resultado;
      } else {
        resultados[usuario][generador] = "Datos inválidos";
      }
    }
  }

  return NextResponse.json(resultados);
}
