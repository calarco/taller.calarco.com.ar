import React, {
    ReactNode,
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";
import feathersClient from "feathersClient";

type ContextType = {
    getCarName: (modeloId: number) => string;
};

const CarNameContext = createContext<ContextType>({
    getCarName: () => "",
});

type ComponentProps = {
    children: ReactNode;
};

function CarNameProvider({ children }: ComponentProps) {
    const [fabricantes, setFabricantes] = useState({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                nombre: "",
                createdAt: "",
                updatedAt: "",
            },
        ],
    });
    const [modelos, setModelos] = useState({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                nombre: "",
                createdAt: "",
                updatedAt: "",
                fabricanteId: 0,
            },
        ],
    });

    function loadCars() {
        feathersClient
            .service("fabricantes")
            .find({
                query: {
                    $limit: 100,
                    $sort: {
                        nombre: 1,
                    },
                },
            })
            .then((found: Fabricantes) => {
                found.data[0] && setFabricantes(found);
            })
            .catch((error: FeathersErrorJSON) => {
                console.error(error);
            });
        feathersClient
            .service("modelos")
            .find({
                query: {
                    $limit: 200,
                    $sort: {
                        nombre: 1,
                    },
                },
            })
            .then((found: Modelos) => {
                found.data[0] && setModelos(found);
            })
            .catch((error: FeathersErrorJSON) => {
                console.error(error);
            });
    }

    const getCarName = (modeloId: number) => {
        try {
            return (
                fabricantes.data.find(
                    ({ id }) =>
                        id ===
                        modelos.data.find(({ id }) => id === modeloId)!
                            .fabricanteId
                )!.nombre +
                " " +
                modelos.data.find(({ id }) => id === modeloId)!.nombre
            );
        } catch {
            return "error";
        }
    };

    useEffect(() => {
        loadCars();
        feathersClient.service("fabricantes").on("created", () => loadCars());
        feathersClient.service("modelos").on("created", () => loadCars());
    }, []);

    return (
        <CarNameContext.Provider
            value={{
                getCarName,
            }}
        >
            {children}
        </CarNameContext.Provider>
    );
}

function useCarName() {
    const context = useContext(CarNameContext);
    if (context === undefined) {
        throw new Error("useCarName must be used within a CarNameProvider");
    }
    return context;
}

export { CarNameProvider, useCarName };
