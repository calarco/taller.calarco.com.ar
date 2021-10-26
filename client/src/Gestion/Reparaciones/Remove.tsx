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
            .service("reparaciones")
            .remove(id)
            .then(() => {})
            .catch((error: FeathersErrorJSON) => {
                console.error(error.message);
            });
    };

    return (
        <RemoveComponent
            remove={remove}
            unRemove={unRemove}
            handleDelete={handleDelete}
        >
            ¿Borrar reparación?
        </RemoveComponent>
    );
};

export default Remove;
