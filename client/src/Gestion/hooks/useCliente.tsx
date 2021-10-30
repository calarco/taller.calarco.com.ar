import { useState, useEffect, useCallback } from "react";
import feathersClient from "feathersClient";

import { useActive } from "Gestion/context/activeContext";

const useCliente = () => {
    const { clienteId, setClienteId, setVehiculoId, setActiveCard } =
        useActive();

    const [error, setError] = useState("");
    const [cliente, setCliente] = useState<Cliente>({
        id: 0,
        nombre: "",
        apellido: "",
        email: "",
        dni: "",
        telefono: " ",
        empresa: "",
        createdAt: "",
        updatedAt: "",
    });

    const loadCliente = useCallback(
        (last?: boolean) => {
            last
                ? feathersClient
                      .service("clientes")
                      .find({
                          query: {
                              $limit: 1,
                              $sort: {
                                  updatedAt: -1,
                              },
                          },
                      })
                      .then((found: Clientes) => {
                          setCliente(found.data[0]);
                          setClienteId(found.data[0].id);
                          setVehiculoId(0);
                          setActiveCard("");
                      })
                      .catch((error: FeathersErrorJSON) => {
                          setError(error.message);
                      })
                : feathersClient
                      .service("clientes")
                      .get(clienteId)
                      .then((found: Cliente) => {
                          setCliente(found);
                          setActiveCard("");
                      })
                      .catch((error: FeathersErrorJSON) => {
                          setError(error.message);
                      });
        },
        [clienteId, setClienteId, setVehiculoId, setActiveCard]
    );

    useEffect(() => {
        feathersClient
            .service("clientes")
            .on("created", () => loadCliente(true));
        feathersClient.service("clientes").on("patched", () => loadCliente());
        feathersClient.service("clientes").on("removed", () => setClienteId(0));
    }, [loadCliente, setClienteId]);

    useEffect(() => {
        clienteId !== 0
            ? loadCliente()
            : setCliente({
                  id: 0,
                  nombre: "",
                  apellido: "",
                  email: "",
                  dni: "",
                  telefono: " ",
                  empresa: "",
                  createdAt: "",
                  updatedAt: "",
              });
    }, [clienteId, loadCliente]);

    return { cliente, error };
};

export default useCliente;
