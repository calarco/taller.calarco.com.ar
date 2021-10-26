import React, { MouseEvent } from "react";
import feathersClient from "feathersClient";

import RemoveComponent from "components/Remove";

type ComponentProps = {
    id: number;
    remove: boolean;
    unRemove: (e: MouseEvent<HTMLButtonElement>) => void;
};

const Remove = function ({ id, remove, unRemove }: ComponentProps) {
    const handleDelete = () => {
        feathersClient
            .service("clientes")
            .remove(id)
            .then(() => {})
            .catch((error: FeathersErrorJSON) => {
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
