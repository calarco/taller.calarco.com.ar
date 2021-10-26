import { useState, useEffect, useCallback } from "react";
import feathersClient from "feathersClient";

import { useGestion } from "Gestion/gestionContext";

type HookProps = {
    setSelected: (selected: number) => void;
};

const useReparaciones = ({ setSelected }: HookProps) => {
    const { vehiculoId, setActiveCard } = useGestion();

    const [reparaciones, setReparaciones] = useState<Reparaciones>({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                vehiculoId: 0,
                reparacion: "",
                repuestos: "",
                labor: "",
                costo: "",
                km: "0",
                createdAt: "",
                updatedAt: "",
            },
        ],
    });
    const [error, setError] = useState("");

    const loadReparaciones = useCallback(
        (setId?: boolean) => {
            feathersClient
                .service("reparaciones")
                .find({
                    query: {
                        vehiculoId: vehiculoId,
                        $limit: 100,
                        $sort: {
                            createdAt: -1,
                        },
                    },
                })
                .then((found: Reparaciones) => {
                    setReparaciones(found);
                    setActiveCard("");
                    setId && setSelected(found.data[0].id);
                })
                .catch((error: FeathersErrorJSON) => {
                    setError(error.message);
                });
        },
        [vehiculoId, setActiveCard, setSelected]
    );

    useEffect(() => {
        feathersClient
            .service("reparaciones")
            .on("created", () => loadReparaciones(true));
        feathersClient
            .service("reparaciones")
            .on("patched", () => loadReparaciones());
        feathersClient.service("reparaciones").on("removed", () => {
            loadReparaciones();
            setSelected(0);
        });
    }, [loadReparaciones, setSelected]);

    useEffect(() => {
        vehiculoId !== 0
            ? loadReparaciones()
            : setReparaciones({
                  total: 0,
                  limit: 0,
                  skip: 0,
                  data: [
                      {
                          id: 0,
                          vehiculoId: 0,
                          reparacion: "",
                          repuestos: "",
                          labor: "",
                          costo: "",
                          km: "0",
                          createdAt: "",
                          updatedAt: "",
                      },
                  ],
              });
        setSelected(0);
    }, [vehiculoId, loadReparaciones, setSelected]);

    return { reparaciones, error };
};

export default useReparaciones;
