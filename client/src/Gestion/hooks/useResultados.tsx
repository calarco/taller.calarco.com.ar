import { useState, useEffect } from "react";
import feathersClient from "feathersClient";

type ComponentProps = {
    busqueda: string;
};

type Resultados = {
    id: number;
    createdAt: string;
    updatedAt: string;
    nombre?: string;
    apellido?: string;
    email?: string;
    dni?: string;
    telefono?: string;
    empresa?: string;
    patente?: string;
    modeloId?: number;
    clienteId?: number;
    year?: string;
    combustible?: string;
    cilindrada?: string;
    vin?: string;
    km?: string;
    motivo?: string;
    labor?: string;
    repuestos?: { cantidad: string; repuesto: string; precio: string }[];
}[];

const useResultados = ({ busqueda }: ComponentProps) => {
    const [error, setError] = useState("");
    const [resultados, setResultados] = useState<Resultados>([
        {
            id: 0,
            patente: "",
            createdAt: "",
            updatedAt: "",
            modeloId: 0,
            km: "",
            motivo: "",
            labor: "",
            repuestos: [{ cantidad: "", repuesto: "", precio: "" }],
            year: "",
            combustible: "",
            cilindrada: "",
            vin: "",
            clienteId: 0,
        },
    ]);

    function mergeSortedArray(listA: Resultados, listB: Resultados) {
        let listC = listA.concat(listB);
        listC.sort((a, b) => {
            return b.updatedAt.localeCompare(a.updatedAt);
        });
        return listC;
    }

    useEffect(() => {
        busqueda === ""
            ? feathersClient
                  .service("vehiculos")
                  .find({
                      query: {
                          $limit: 50,
                          $sort: {
                              updatedAt: -1,
                          },
                      },
                  })
                  .then((vehiculos: Vehiculos) => {
                      feathersClient
                          .service("presupuestos")
                          .find({
                              query: {
                                  $limit: 50,
                                  $sort: {
                                      updatedAt: -1,
                                  },
                              },
                          })
                          .then((presupuestos: Presupuestos) => {
                              setResultados(
                                  mergeSortedArray(
                                      vehiculos.data,
                                      presupuestos.data
                                  )
                              );
                          })
                          .catch((error: FeathersErrorJSON) => {
                              setError(error.message);
                          });
                  })
                  .catch((error: FeathersErrorJSON) => {
                      setError(error.message);
                  })
            : feathersClient
                  .service("clientes")
                  .find({
                      query: {
                          $or: [
                              { nombre: { $iLike: `${busqueda}%` } },
                              { apellido: { $iLike: `${busqueda}%` } },
                          ],
                          $limit: 10,
                          $sort: {
                              updatedAt: -1,
                          },
                      },
                  })
                  .then((clientes: Clientes) => {
                      feathersClient
                          .service("vehiculos")
                          .find({
                              query: {
                                  patente: { $iLike: `${busqueda}%` },
                                  $limit: 10,
                                  $sort: {
                                      updatedAt: -1,
                                  },
                              },
                          })
                          .then((vehiculos: Vehiculos) => {
                              setResultados(
                                  mergeSortedArray(
                                      clientes.data,
                                      vehiculos.data
                                  )
                              );
                          })
                          .catch((error: FeathersErrorJSON) => {
                              setError(error.message);
                          });
                  })
                  .catch((error: FeathersErrorJSON) => {
                      setError(error.message);
                  });
    }, [busqueda]);

    return { resultados, error };
};

export default useResultados;
