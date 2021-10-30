import { useState, useEffect, useCallback } from "react";
import feathersClient from "feathersClient";

import { useActive } from "Gestion/context/activeContext";

const usePresupuesto = () => {
    const { presupuestoId, setPresupuestoId, setActiveCard } = useActive();

    const [error, setError] = useState("");

    const [presupuesto, setPresupuesto] = useState<Presupuesto>({
        id: 0,
        patente: "",
        km: "",
        motivo: "",
        labor: "",
        repuestos: [{ cantidad: "", repuesto: "", precio: "" }],
        createdAt: "",
        updatedAt: "",
        modeloId: 0,
    });

    const loadPresupuesto = useCallback(
        (last?: boolean) => {
            last
                ? feathersClient
                      .service("presupuestos")
                      .find({
                          query: {
                              $limit: 1,
                              $sort: {
                                  updatedAt: -1,
                              },
                          },
                      })
                      .then((found: Presupuestos) => {
                          setPresupuesto(found.data[0]);
                          setPresupuestoId(found.data[0].id);
                          setActiveCard("");
                      })
                      .catch((error: FeathersErrorJSON) => {
                          setError(error.message);
                      })
                : feathersClient
                      .service("presupuestos")
                      .get(presupuestoId)
                      .then((found: Presupuesto) => {
                          setPresupuesto(found);
                      })
                      .catch((error: FeathersErrorJSON) => {
                          setError(error.message);
                      });
        },
        [presupuestoId, setPresupuestoId, setActiveCard]
    );

    useEffect(() => {
        feathersClient
            .service("presupuestos")
            .on("created", () => loadPresupuesto(true));
        feathersClient
            .service("presupuestos")
            .on("removed", () => setPresupuestoId(0));
    }, [loadPresupuesto, setPresupuestoId]);

    useEffect(() => {
        presupuestoId !== 0
            ? loadPresupuesto()
            : setPresupuesto({
                  id: 0,
                  patente: "",
                  km: "",
                  motivo: "",
                  labor: "",
                  repuestos: [{ cantidad: "", repuesto: "", precio: "" }],
                  createdAt: "",
                  updatedAt: "",
                  modeloId: 0,
              });
    }, [presupuestoId, loadPresupuesto]);

    return { presupuesto, error };
};

export default usePresupuesto;
