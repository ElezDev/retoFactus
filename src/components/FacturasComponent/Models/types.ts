  export interface Product {
    id: number;
    code_reference: string;
    name: string;
    price: number;
    tax_rate: string;
    discount_rate: number;
    unit_measure_id: number;
    standard_code_id: number;
    is_excluded: number;
    tribute_id: number;
    withholding_taxes: { code: string; withholding_tax_rate: string }[];
    image: string;
  }

   export interface Customer {
    identification: string;
    dv: string;
    company: string;
    trade_name: string;
    names: string;
    address: string;
    email: string;
    phone: string;
    legal_organization_id: string;
    tribute_id: string;
    identification_document_id: string;
    municipality_id: string;
  }

   export interface Municipality {
    id: number;
    name: string;
    department: string;
  }