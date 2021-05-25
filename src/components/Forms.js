import { useState, useEffect } from "react";

const Forms = (callback, validate, dialog) => {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (dialog.id) {
            setInputs(dialog);
        }
    }, [dialog]);

    const handleSubmit = event => {
        if (event) event.preventDefault();
        setErrors(validate(inputs));
        if (Object.keys(validate(inputs)).length === 0) {
            callback();
        }
    };

    const handleInputChange = event => {
        event.persist();
        setInputs(inputs => ({
            ...inputs,
            [event.target.name]: event.target.value
        }));
    };

    return {
        inputs,
        setInputs,
        errors,
        handleInputChange,
        handleSubmit
    };
};

export default Forms;
