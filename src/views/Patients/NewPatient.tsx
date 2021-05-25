import React, { useState } from "react";
import { SwitchTransition, Transition } from "react-transition-group";
import styled, { css } from "styled-components";
import { Button, FormItem } from "components/components";

const TopBar = styled.div`
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-right: 12px;

    span {
        flex-grow: 1;
        font-size: 20px;
        font-size: 2rem;
        line-height: 28px;
        line-height: 2.8rem;
        letter-spacing: 0.05px;
        letter-spacing: 0.005rem;
        font-weight: 400;
        text-transform: inherit;
    }
`;

const Container = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    padding: 0 12px;
`;

const Items = styled.div`
    padding: 0;
`;

type CheckboxProps = {
    readonly checked?: boolean;
    readonly state?: string;
};

const CheckboxContainer = styled.label<CheckboxProps>`
    display: inline-block;
    user-select: none;
    vertical-align: middle;
    width: 50%;
    padding: 2px 0 3px 4px;
    transition: 0.1s ease-in-out;

    span {
        margin-left: 12px;
        font-size: 13px;
        font-size: 1.3rem;
        line-height: 24px;
        line-height: 2.4rem;
        letter-spacing: 0.1px;
        letter-spacing: 0.01rem;
        font-weight: 400;
        text-transform: inherit;
    }

    &:hover {
        cursor: pointer;
    }
`;

const CheckboxIcon = styled.i<CheckboxProps>`
    color: var(--on-background-variant);
    padding: 8px;
    border-radius: 100%;
    transition: 0.05s ease-in;
    opacity: 0;
    transform: rotate(90deg);

    ${(props) =>
        props.state === "entered" &&
        css`
            color: var(--secondary);
            opacity: 1;
            transform: rotate(0deg);
            transition: 0.05s ease-out;
        `};

    ${CheckboxContainer}:hover & {
        background: var(--on-background-disabled);
    }
`;

const ChipContainer = styled(CheckboxContainer)`
    text-align: center;
    width: 100%;
    max-width: calc(100% / 3 - 6px);
    padding: 5px 4px;
    margin: 6px 8px 6px 0;
    border-radius: 100px;
    background: rgba(0, 0, 0, 0);
    color: var(--on-background);
    border: 1px solid var(--on-background-variant);
    transition: 0.1s ease-in;

    &:last-child {
        margin-right: 0;
    }

    ${(props) =>
        props.checked &&
        css`
            background: var(--on-background-disabled);
            color: var(--secondary);
            border: 1px solid var(--secondary);
        `};

    span {
        margin-left: 0;
    }
`;

const Checkbox = ({ name, checked, onChange, nodeRef }) => (
    <CheckboxContainer checked={checked}>
        <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
        />
        <SwitchTransition mode="out-in">
            <Transition
                nodeRef={nodeRef}
                key={checked ? "bar" : "foo"}
                addEndListener={(nodeRef, done) => {
                    nodeRef.addEventListener("transitionend", done, false);
                }}
                unmountOnExit
                mountOnEnter
            >
                {(state) => (
                    <>
                        {checked ? (
                            <CheckboxIcon
                                state={state}
                                className="material-icons md-24"
                            >
                                check_box
                            </CheckboxIcon>
                        ) : (
                            <CheckboxIcon
                                state={state}
                                className="material-icons md-24"
                            >
                                check_box_outline_blank
                            </CheckboxIcon>
                        )}
                    </>
                )}
            </Transition>
        </SwitchTransition>
        <span>{name}</span>
    </CheckboxContainer>
);

const Chip = ({ name, checked, onChange }) => (
    <ChipContainer checked={checked}>
        <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
        />
        <span>{name}</span>
    </ChipContainer>
);

const NewPatient = function ({ setDialog, setSnackbar }) {
    const nodeRef = React.useRef(null);
    const [inputs, setInputs] = useState({
        Diabetes: false,
        Hemofilia: false,
        Hipertensión: false,
        Sinusitis: false,
        Alergia: false,
        SIDA: false,
        Hipotensión: false,
        Marcapasos: false,
        Anemia: false,
        Chagas: false,
        Reuma: false,
        Antitetanica: false,
        Cardíacos: false,
        Respiratorios: false,
        Neurológicos: false,
    });

    const submit = (event) => {
        event.preventDefault();
        setSnackbar("Reparacion creada");
    };

    const handleInputChange = (event) => {
        event.persist();
        setInputs((inputs) => ({
            ...inputs,
            [event.target.name]: event.target.checked,
        }));
    };

    return (
        <>
            <form onSubmit={submit} noValidate>
                <TopBar>
                    <Button
                        icon
                        type="button"
                        onClick={() => {
                            setDialog({});
                        }}
                    >
                        <i className="material-icons md-24">close</i>
                    </Button>
                    <span>Nuevo paciente</span>
                    <Button solid type="submit">
                        Guardar
                    </Button>
                </TopBar>
                <Container>
                    <Items>
                        <FormItem>
                            <p>Nombre y apellido</p>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="-"
                                autoComplete="off"
                                required
                            />
                        </FormItem>
                        <FormItem>
                            <p>Telefono</p>
                            <input
                                type="tel"
                                name="telefono2"
                                placeholder="-"
                                autoComplete="off"
                            />
                        </FormItem>
                        <FormItem half>
                            <p>Provincia</p>
                            <select name="fabricanteId">
                                <option value="Buenos Aires">
                                    Buenos Aires
                                </option>
                                <option value="Catamarca">Catamarca</option>
                                <option value="Chaco">Chaco</option>
                                <option value="Chubut">Chubut</option>
                                <option value="Cordoba">Cordoba</option>
                                <option value="Corrientes">Corrientes</option>
                                <option value="Entre Rios">Entre Rios</option>
                                <option value="Formosa">Formosa</option>
                                <option value="Jujuy">Jujuy</option>
                                <option value="La Pampa">La Pampa</option>
                                <option value="La Rioja">La Rioja</option>
                                <option value="Mendoza">Mendoza</option>
                                <option value="Misiones">Misiones</option>
                                <option value="Neuquen">Neuquen</option>
                                <option value="Rio Negro">Rio Negro</option>
                                <option value="Salta">Salta</option>
                                <option value="San Juan">San Juan</option>
                                <option value="San Luis">San Luis</option>
                                <option value="Santa Cruz">Santa Cruz</option>
                                <option value="Santa Fe">Santa Fe</option>
                                <option value="Sgo. del Estero">
                                    Sgo. del Estero
                                </option>
                                <option value="Tierra del Fuego">
                                    Tierra del Fuego
                                </option>
                                <option value="Tucuman">Tucuman</option>
                            </select>
                        </FormItem>
                        <FormItem half>
                            <p>Ciudad</p>
                            <input
                                type="text"
                                name="ciudad"
                                placeholder="-"
                                autoComplete="off"
                            />
                        </FormItem>
                        <FormItem>
                            <p>Direccion</p>
                            <input
                                type="text"
                                name="direccion"
                                placeholder="-"
                                autoComplete="off"
                            />
                        </FormItem>
                        <FormItem twice>
                            <p>Fecha de nacimiento</p>
                            <input
                                type="date"
                                pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                                name="fecha"
                                placeholder="-"
                                required
                            />
                        </FormItem>
                        <FormItem third>
                            <p>Edad</p>
                            <b>26</b>
                        </FormItem>
                        <FormItem half>
                            <p>Sexo</p>
                            <select name="fabricanteId">
                                <option>Masculino</option>
                                <option>Femenino</option>
                            </select>
                        </FormItem>
                        <FormItem half>
                            <p>Nacionalidad</p>
                            <input
                                type="text"
                                name="nacionalidad"
                                placeholder="-"
                            />
                        </FormItem>
                        <FormItem half>
                            <p>Estado Civil</p>
                            <select name="fabricanteId">
                                <option>Soltero</option>
                                <option>Casado</option>
                                <option>Viudo</option>
                                <option>Divorciado</option>
                            </select>
                        </FormItem>
                        <FormItem half>
                            <p>Documento</p>
                            <input
                                type="number"
                                min="0000000"
                                max="9999999"
                                name="documento"
                                placeholder="-"
                            />
                        </FormItem>
                    </Items>
                    <Items>
                        <FormItem>
                            <p>Problemas</p>
                            <Chip
                                name="Cardíacos"
                                checked={inputs.Cardíacos}
                                onChange={handleInputChange}
                            />
                            <Chip
                                name="Respiratorios"
                                checked={inputs.Respiratorios}
                                onChange={handleInputChange}
                            />
                            <Chip
                                name="Neurológicos"
                                checked={inputs.Neurológicos}
                                onChange={handleInputChange}
                            />
                        </FormItem>
                        <FormItem>
                            <p>Ficha médica</p>
                            <Checkbox
                                nodeRef={nodeRef}
                                name="Diabetes"
                                checked={inputs.Diabetes}
                                onChange={handleInputChange}
                            />
                            <Checkbox
                                nodeRef={nodeRef}
                                name="Hemofilia"
                                checked={inputs.Hemofilia}
                                onChange={handleInputChange}
                            />
                            <Checkbox
                                nodeRef={nodeRef}
                                name="Hipertensión"
                                checked={inputs.Hipertensión}
                                onChange={handleInputChange}
                            />
                            <Checkbox
                                nodeRef={nodeRef}
                                name="Sinusitis"
                                checked={inputs.Sinusitis}
                                onChange={handleInputChange}
                            />
                            <Checkbox
                                nodeRef={nodeRef}
                                name="Alergia"
                                checked={inputs.Alergia}
                                onChange={handleInputChange}
                            />
                            <Checkbox
                                nodeRef={nodeRef}
                                name="SIDA"
                                checked={inputs.SIDA}
                                onChange={handleInputChange}
                            />
                            <Checkbox
                                nodeRef={nodeRef}
                                name="Hipotensión"
                                checked={inputs.Hipotensión}
                                onChange={handleInputChange}
                            />
                            <Checkbox
                                nodeRef={nodeRef}
                                name="Marcapasos"
                                checked={inputs.Marcapasos}
                                onChange={handleInputChange}
                            />
                            <Checkbox
                                nodeRef={nodeRef}
                                name="Anemia"
                                checked={inputs.Anemia}
                                onChange={handleInputChange}
                            />
                            <Checkbox
                                nodeRef={nodeRef}
                                name="Chagas"
                                checked={inputs.Chagas}
                                onChange={handleInputChange}
                            />
                            <Checkbox
                                nodeRef={nodeRef}
                                name="Reuma"
                                checked={inputs.Reuma}
                                onChange={handleInputChange}
                            />
                            <Checkbox
                                nodeRef={nodeRef}
                                name="Antitetanica"
                                checked={inputs.Antitetanica}
                                onChange={handleInputChange}
                            />
                        </FormItem>
                        <FormItem half>
                            <p>Grupo sanguineo</p>
                            <select name="fabricanteId">
                                <option>O</option>
                                <option>A</option>
                                <option>B</option>
                                <option>AB</option>
                            </select>
                        </FormItem>
                        <FormItem half>
                            <p>Factor RH</p>
                            <select name="fabricanteId">
                                <option>+</option>
                                <option>-</option>
                            </select>
                        </FormItem>
                        <FormItem>
                            <p>Observaciones</p>
                            <textarea rows={7} />
                        </FormItem>
                    </Items>
                    <Items>
                        <FormItem>
                            <p>Institucion</p>
                            <input type="text" name="empresa" placeholder="-" />
                        </FormItem>
                        <FormItem>
                            <p>Numero de afiliado</p>
                            <input
                                type="number"
                                min="0000000"
                                max="9999999"
                                name="km"
                                placeholder="0"
                            />
                        </FormItem>
                        <FormItem>
                            <p>Profesional</p>
                            <select name="fabricanteId">
                                <option>1</option>
                                <option>2</option>
                            </select>
                        </FormItem>
                    </Items>
                </Container>
            </form>
        </>
    );
};

export default NewPatient;
