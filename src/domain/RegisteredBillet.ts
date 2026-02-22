 /**
 * Represents a registered billet in agnostic way to our external provider
 */
     export interface RegisteredBillet {
        id: string;
        url: string;
        barcode: string;
        customerEmail: string;
    }
