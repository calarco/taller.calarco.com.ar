const Forms = (callback, validate, inputs, setInputs, errors, setErrors) => {

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
        errors,
        handleInputChange,
        handleSubmit
    };
};

export default Forms;
