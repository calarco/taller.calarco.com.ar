import React, {
    ReactNode,
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";

type ContextType = {
    clienteId: number;
    vehiculoId: number;
    presupuestoId: number;
    activeCard: string;
    setClienteId: (clienteId: number) => void;
    setVehiculoId: (vehiculoId: number) => void;
    setPresupuestoId: (presupuestoId: number) => void;
    setActiveCard: (activeCard: string) => void;
};

const GestionContext = createContext<ContextType>({
    clienteId: 0,
    vehiculoId: 0,
    presupuestoId: 0,
    activeCard: "",
    setClienteId: () => {},
    setVehiculoId: () => {},
    setPresupuestoId: () => {},
    setActiveCard: () => {},
});

type ComponentProps = {
    children: ReactNode;
};

function GestionProvider({ children }: ComponentProps) {
    const [clienteId, setClienteId] = useState(0);
    const [vehiculoId, setVehiculoId] = useState(0);
    const [presupuestoId, setPresupuestoId] = useState(0);
    const [activeCard, setActiveCard] = useState("");

    useEffect(() => {
        vehiculoId !== 0 && setPresupuestoId(0);
    }, [vehiculoId]);

    useEffect(() => {
        presupuestoId !== 0 && setVehiculoId(0);
    }, [presupuestoId]);

    return (
        <GestionContext.Provider
            value={{
                clienteId,
                vehiculoId,
                presupuestoId,
                activeCard,
                setClienteId,
                setVehiculoId,
                setPresupuestoId,
                setActiveCard,
            }}
        >
            {children}
        </GestionContext.Provider>
    );
}

function useGestion() {
    const context = useContext(GestionContext);
    if (context === undefined) {
        throw new Error("useGestion must be used within a GestionProvider");
    }
    return context;
}

export { GestionProvider, useGestion };
