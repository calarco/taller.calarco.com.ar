import React from "react";
import feathersClient from "feathersClient";

import RemoveComponent from "components/Remove";

const Remove = function ({ id, remove, unRemove }) {
    const handleDelete = (event) => {
        event.preventDefault();
        feathersClient
            .service("clientes")
            .remove(id)
            .then(() => {})
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <RemoveComponent
            remove={remove}
            unRemove={unRemove}
            handleDelete={handleDelete}
        >
            ¿Borrar cliente?
        </RemoveComponent>
    );
};

export default Remove;
