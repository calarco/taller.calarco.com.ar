import { useState, useEffect, useCallback } from "react";
import feathersClient from "feathersClient";

const useTurnos = () => {
    const [error, setError] = useState("");
    const [turnos, setTurnos] = useState<Turnos>({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                fecha: "",
                motivo: "",
                createdAt: "",
                updatedAt: "",
                modeloId: 0,
            },
        ],
    });

    const loadTurnos = useCallback(() => {
        feathersClient
            .service("turnos")
            .find({
                query: {
                    fecha: {
                        $gt: new Date().getTime() - 24 * 60 * 60 * 1000,
                    },
                    $limit: 50,
                    $sort: {
                        fecha: 1,
                    },
                },
            })
            .then((data: Turnos) => {
                setTurnos(data);
            })
            .catch((error: FeathersErrorJSON) => {
                setError(error.message);
            });
    }, []);

    useEffect(() => {
        loadTurnos();
        feathersClient.service("turnos").on("created", () => loadTurnos());
        feathersClient.service("turnos").on("removed", () => loadTurnos());
    }, [loadTurnos]);

    return { turnos, error };
};

export default useTurnos;
