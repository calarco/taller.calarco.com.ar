import React, {
    ReactNode,
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
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

const ActiveContext = createContext<ContextType>({
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

function ActiveProvider({ children }: ComponentProps) {
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

    const value = useMemo(
        () => ({
            clienteId,
            vehiculoId,
            presupuestoId,
            activeCard,
            setClienteId,
            setVehiculoId,
            setPresupuestoId,
            setActiveCard,
        }),
        [clienteId, vehiculoId, presupuestoId, activeCard]
    );

    return (
        <ActiveContext.Provider value={value}>
            {children}
        </ActiveContext.Provider>
    );
}

function useActive() {
    const context = useContext(ActiveContext);
    if (context === undefined) {
        throw new Error("useActive must be used within a ActiveProvider");
    }
    return context;
}

export { ActiveProvider, useActive };
