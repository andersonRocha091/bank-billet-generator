import { IBankBilletData } from "../interfaces/IBankBilletData";

// This can be extend later to validate expiration, fine calculation etc
export class BankBillet {
    private constructor(public readonly data: IBankBilletData){
        // private constructor to ensure object is always created in a valid state
    }

    static create(data: IBankBilletData): BankBillet {
        BankBillet.validate(data);
        return new BankBillet(data)
    }

    getData(): IBankBilletData {
        return {...this.data}
    }

    /**
     * Valida os dados para garantir que o BankBillet esteja em um estado consistente.
     * Este método é interno e chamado apenas no momento da criação.
     */
    private static validate(data: IBankBilletData): void {
        // Validando campos obrigatórios
        if (!data.amount || data.amount <= 0) {
            throw new Error('Amount is required and must be greater than zero');
        }
        if (!data.expire_at) {
            throw new Error('Due date is required');
        }
        if (!data.customer_person_name) {
            throw new Error('Customer name is required');
        }
        if (!data.customer_cnpj_cpf) {
            throw new Error('Customer CNPJ or CPF is required');
        }
        if (!data.customer_state) {
            throw new Error('Customer state is required');
        }
        if (!data.customer_city_name) {
            throw new Error('Customer city name is required');
        }
        if (!data.customer_email) {
            throw new Error('Customer email is required');
        }
        if (!data.customer_zipcode) {
            throw new Error('Customer zipcode is required');
        }
        if (!data.customer_address) {
            throw new Error('Customer address is required');
        }
        if (!data.document_type) {
            throw new Error('Document type is required');
        }
        if (data.acceptance === undefined || data.acceptance === null) { // Aceitação pode ser false
            throw new Error('Acceptance is required');
        }
        if (!data.recipient_account) {
            throw new Error('Recipient account is required');
        }
        if (data.prevent_pix === undefined || data.prevent_pix === null) {
            throw new Error('Prevent PIX flag is required');
        }
        if (data.reduction_amount === undefined || data.reduction_amount === null) {
            throw new Error('Reduction amount is required');
        }
        if (data.instructions_mode === undefined || data.instructions_mode === null) {
            throw new Error('Instructions mode is required');
        }
        }

}