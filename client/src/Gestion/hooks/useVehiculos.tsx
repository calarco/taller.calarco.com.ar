import { useState, useEffect, useCallback } from "react";
import feathersClient from "feathersClient";

import { useGestion } from "Gestion/gestionContext";

const useVehiculos = () => {
    const { clienteId, setVehiculoId, setActiveCard } = useGestion();

    const [vehiculos, setVehiculos] = useState<Vehiculos>({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                patente: "",
                year: "",
                combustible: "",
                cilindrada: "",
                vin: "",
                createdAt: "",
                updatedAt: "",
                clienteId: 0,
                modeloId: 0,
            },
        ],
    });
    const [error, setError] = useState("");

    const loadVehiculos = useCallback(
        (setId?: boolean) => {
            feathersClient
                .service("vehiculos")
                .find({
                    query: {
                        $limit: 100,
                        clienteId: clienteId,
                        $sort: {
                            updatedAt: -1,
                        },
                    },
                })
                .then((found: Vehiculos) => {
                    found.data && setVehiculos(found);
                    setActiveCard("");
                    setId && setVehiculoId(found.data[0].id);
                })
                .catch((error: FeathersErrorJSON) => {
                    setError(error.message);
                });
        },
        [clienteId, setActiveCard, setVehiculoId]
    );

    useEffect(() => {
        feathersClient
            .service("vehiculos")
            .on("created", () => loadVehiculos(true));
        feathersClient
            .service("vehiculos")
            .on("patched", () => loadVehiculos());
        feathersClient.service("vehiculos").on("removed", () => {
            loadVehiculos();
            setVehiculoId(0);
        });
    }, [loadVehiculos, setVehiculoId]);

    useEffect(() => {
        clienteId !== 0
            ? loadVehiculos()
            : setVehiculos({
                  total: 0,
                  limit: 0,
                  skip: 0,
                  data: [
                      {
                          id: 0,
                          patente: "",
                          year: "",
                          combustible: "",
                          cilindrada: "",
                          vin: "",
                          createdAt: "",
                          updatedAt: "",
                          clienteId: 0,
                          modeloId: 0,
                      },
                  ],
              });
    }, [clienteId, loadVehiculos]);

    return { vehiculos, error };
};

export default useVehiculos;
