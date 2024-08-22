function isValidName(value: string) {
    return (
        value.length > 0 &&
        value.length <= 25 &&
        typeof value === "string" &&
        /^[A-Za-z\s'-]+$/.test(value)
    );
}

function isValidPassword(value: string) {
    return value.length > 0 && value.length <= 25 && typeof value === "string";
}

function isValidUsername(value: string) {
    return (
        value.length > 0 &&
        value.length <= 25 &&
        typeof value === "string" &&
        /^[a-zA-Z0-9._-]+$/.test(value)
    );
}

function isValidEmail(value: string) {
    return /^[^@]+@[^@]+\.[^@]+$/.test(value);
}

function isValidPhone(value: string) {
    return /^[6-9]\d{9}$/.test(value);
}

function isValidCabType(value: string) {
    return value === "car";
}

function isValidRegNo(value: string) {
    return /^[A-Za-z]{2}[0-9]{1,2}[A-Za-z]{1,2}[0-9]{4}$/.test(value);
}

export interface Error {
    nameError?: string;
    passwordError?: string;
    usernameError?: string;
    emailError?: string; // corrected typo from `emailEror` to `emailError`
    phoneError?: string;
    cabTypeError?: string;
    regNoError?: string;
}

export function isValidDriver(value): Error {
    const errors: Error = {};

    if (!isValidName(value.name)) {
        errors.nameError = "Name is not valid";
    }

    if (!isValidUsername(value.username)) {
        errors.usernameError = "Username is not valid";
    }

    if (!isValidEmail(value.email)) {
        errors.emailError = "Email is not valid";
    }

    if (!isValidPassword(value.password)) {
        errors.passwordError = "Password is not valid";
    }

    if (!isValidPhone(value.phone)) {
        errors.phoneError = "Phone number is not valid";
    }

    if (!isValidCabType(value.cabType)) {
        errors.cabTypeError = "Cab type is not valid";
    }

    if (!isValidRegNo(value.regNo)) {
        errors.regNoError = "Registration number is not valid";
    }

    return errors;
}

export function isValidUser(value): Error {
    const errors: Error = {};

    if (!isValidName(value.name)) {
        errors.nameError = "Name is not valid";
    }

    if (!isValidUsername(value.username)) {
        errors.usernameError = "Username is not valid";
    }

    if (!isValidEmail(value.email)) {
        errors.emailError = "Email is not valid";
    }

    if (!isValidPassword(value.password)) {
        errors.passwordError = "Password is not valid";
    }

    if (!isValidPhone(value.phone)) {
        errors.phoneError = "Phone number is not valid";
    }

    return errors;
}
