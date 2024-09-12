import { IBankBilletData } from '../interfaces/IBankBilletData';


export class BankBilletData {

    public data: IBankBilletData;
    constructor(data: IBankBilletData) { 
        
        this.data = data;

    }


    getData(): IBankBilletData {
        return this.data;
    }


    validate(): void {

        // Validating required fields

        if(!this.data.amount || this.data.amount <= 0) {
            throw new Error('Amount is required and must be greater than zero');
        }

        if(!this.data.expire_at) {
            throw new Error('Due date is required');
        }

        if(!this.data.customer_person_name){
            throw new Error('Customer name is required');
        }

        if(!this.data.customer_cnpj_cpf){
            throw new Error('Customer CNPJ or CPF is required');
        }

        if(!this.data.customer_state) {
            throw new Error('Customer state is required');
        }

        if(!this.data.customer_city_name) {
            throw new Error('Customer city name is required');
        }

        if(!this.data.customer_email) {
            throw new Error('Customer email is required');
        }

        if(!this.data.customer_zipcode) {
            throw new Error('Customer zipcode is required');
        }

        if(!this.data.customer_address) {
            throw new Error('Customer address is required');
        }

        if(!this.data.document_type) {
            throw new Error('Document type is required');
        }

        if(!this.data.acceptance) {
            throw new Error('Acceptance is required');
        }

        if(!this.data.recipient_account) {
            throw new Error('Recipient account is required');
        }

        if(this.data.prevent_pix === undefined) {
            throw new Error('Prevent PIX flag is required');
        }

        if(this.data.reduction_amount === undefined) {
            throw new Error('Reduction amount is required');
        }

        if(this.data.instructions_mode === undefined) {
            throw new Error('Instructions mode is required');
        }
    }
}