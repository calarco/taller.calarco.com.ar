type Cliente = {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    dni: string;
    telefono: string;
    empresa: string;
    createdAt: string;
    updatedAt: string;
};

type Clientes = {
    total: number;
    limit: number;
    skip: number;
    data: Cliente[];
};

type Vehiculo = {
    id: number;
    patente: string;
    year: string;
    combustible: string;
    cilindrada: string;
    vin: string;
    createdAt: string;
    updatedAt: string;
    clienteId: number;
    modeloId: number;
};

type Vehiculos = {
    total: number;
    limit: number;
    skip: number;
    data: Vehiculo[];
};

type Reparacion = {
    id: number;
    vehiculoId: number;
    reparacion: string;
    repuestos: string;
    labor: string;
    costo: string;
    km: string;
    createdAt: string;
    updatedAt: string;
};

type Reparaciones = {
    total: number;
    limit: number;
    skip: number;
    data: Reparacion[];
};

type Presupuesto = {
    id: number;
    patente: string;
    km: string;
    motivo: string;
    labor: string;
    repuestos: { cantidad: string; repuesto: string; precio: string }[];
    createdAt: string;
    updatedAt: string;
    modeloId: number;
};

type Presupuestos = {
    total: number;
    limit: number;
    skip: number;
    data: Presupuesto[];
};

type Turno = {
    id: number;
    fecha: string;
    motivo: string;
    createdAt: string;
    updatedAt: string;
    modeloId: number;
};

type Turnos = {
    total: number;
    limit: number;
    skip: number;
    data: Turno[];
};

type Fabricante = {
    id: number;
    nombre: string;
    createdAt: string;
    updatedAt: string;
};

type Modelo = {
    id: number;
    nombre: string;
    createdAt: string;
    updatedAt: string;
    fabricanteId: number;
};

type Fabricantes = {
    total: number;
    limit: number;
    skip: number;
    data: Fabricante[];
};

type Modelos = {
    total: number;
    limit: number;
    skip: number;
    data: Modelo[];
};

type FeathersErrorJSON = {
    name: string;
    message: string;
    code: number;
    className: string;
    data?: any;
    errors?: any;
};
