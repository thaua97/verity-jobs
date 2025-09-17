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

export interface ResponsePaginated {
	data: DataStepForm[];
	first: number;
	prev: number | null;
	next: number | null;
	last: number;
	pages: number;
	items: number;
}
