export interface CustomerDTO {
  number: number;
  name: string;
  dateOfBirth: string;
  gender: string;
}

export interface CreateCustomerDTO {
  name: string;
  dateOfBirth: string;
  gender: string;
}

export interface UpdateCustomerDTO {
  name?: string;
  dateOfBirth?: string;
  gender?: string;
}
