export interface User {
    token: string;
    id: number,
    firstname: string,
    lastname: string,
    phoneNumber: string,
    email: string,
    birthDate: string
};

export interface Login {
    email: string,
    password: string,
};

export interface Register {
    
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    confirmPassword: string,
};