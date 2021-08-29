import React from "react";
import styled from "styled-components";

const Box = styled.div`
    grid-column-start: 2;
    margin-left: 5rem;
    padding: 8px 0;
    border-bottom: var(--border-variant);
`;

const Turno = function ({ turno, matchModelo }) {
    return (
        <>
            <Box>
                <div>
                    <h6>
                        {turno.motivo}
                        <p>{matchModelo(turno.modeloId)}</p>
                    </h6>
                </div>
            </Box>
        </>
    );
};

export default Turno;
