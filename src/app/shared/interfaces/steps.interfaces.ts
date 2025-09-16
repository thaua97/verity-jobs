export interface DataStepForm {
		id?: string,
    name: string;
    birthDate: string;
    phone: string;
    cpf: string;
    address: string;
    district: string;
    city: string;
    state: string;
    zipCode: string;
    ocupation: string;
    company: string;
    salary: string;
    skills: string[];
}

export interface Ocupations {
    id: string;
    title: string;
}
