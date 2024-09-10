export interface IBankBilletData {
    bank_billet_account_id?: string | null;
    bank_billet_layout_id?: string | null;
    amount: number;
    expire_at: string;
    customer_id?: string | null;
    customer_person_name: string;
    customer_cnpj_cpf: string;
    customer_state: string;
    customer_city_name: string;
    customer_zipcode: string;
    customer_address: string;
    customer_address_complement?: string | null;
    customer_address_number?: string | null;
    customer_email?: string | null;
    customer_email_cc?: string | null;
    customer_neighborhood: string;
    customer_phone_number?: string | null;
    customer_ignore_email?: boolean | null;
    customer_ignore_sms?: boolean | null;
    customer_mobile_local_code?: string | null;
    customer_mobile_number?: string | null;
    customer_nickname?: string | null;
    customer_notes?: string | null;
    customer_contact_person?: string | null;
    interest_type: number;
    days_for_interest?: number | null;
    interest_percentage?: number | null;
    interest_value?: number | null;
    interest_days_type: number;
    fine_type: number;
    days_for_fine?: number | null;
    fine_percentage?: number | null;
    fine_value?: number | null;
    discount_type: number;
    days_for_discount?: number | null;
    discount_percentage?: number | null;
    discount_value?: number | null;
    days_for_second_discount?: number | null;
    second_discount_percentage?: number | null;
    second_discount_value?: number | null;
    days_for_third_discount?: number | null;
    third_discount_percentage?: number | null;
    third_discount_value?: number | null;
    tags?: string | null;
    charge_type: number;
    dispatch_type: number;
    guarantor_name?: string | null;
    guarantor_cnpj_cpf?: string | null;
    guarantor_address_number?: string | null;
    guarantor_neighborhood?: string | null;
    guarantor_phone_number?: string | null;
    guarantor_city_name?: string | null;
    guarantor_state?: string | null;
    guarantor_zipcode?: string | null;
    guarantor_address?: string | null;
    guarantor_address_complement?: string | null;
    description?: string | null;
    instructions?: string | null;
    document_date?: string | null;
    document_type: string;
    document_number?: string | null;
    acceptance: string;
    our_number?: string | null;
    paid_amount?: number | null;
    paid_at?: string | null;
    days_for_revoke?: number | null;
    days_for_negativation?: number | null;
    days_for_sue?: number | null;
    sue_code?: string | null;
    revoke_code?: string | null;
    first_instruction?: string | null;
    second_instruction?: string | null;
    watermark?: string | null;
    payment_count: number;
    divergent_payment_type?: number | null;
    divergent_payment_value_type?: number | null;
    divergent_payment_maximum_value?: number | null;
    divergent_payment_minimum_value?: number | null;
    divergent_payment_maximum_percentage?: number | null;
    divergent_payment_minimum_percentage?: number | null;
    divergent_payment_limit?: number | null;
    prevent_registration?: boolean | null;
    control_number?: string | null;
    ignore_email?: boolean | null;
    ignore_sms?: boolean | null;
    ignore_whatsapp?: boolean | null;
    addons?: string | null;
    custom_data?: string | null;
    meta?: string | null;
    notes?: string | null;
    custom_attachment_name?: string | null;
    split_payment?: boolean | null;
    split_payment_type?: number | null;
    split_accounts?: string | null;
    payment_place?: string | null;
    cancellation_reason?: string | null;
    pix_txid?: string;
    prevent_pix?: boolean;
    recipient_account?: string;
    reduction_amount?: number | null;
    instructions_mode?: number | null;
    virtual_bank_billet_id?: string | null;
  }  