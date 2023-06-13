
export interface EmailSender {
    emailAddress: string;
    domainPart?: string;
    deleteByDomain: boolean;
    dateAdded: string;
}