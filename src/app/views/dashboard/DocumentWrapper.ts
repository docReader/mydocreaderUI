export interface IDocumentWrapper {
    documentId: string;
    documentName: string;
    documentType: string;
    fileName: string;
    filePath: string;
}

export class DocumentWrapper implements IDocumentWrapper {
    constructor(public documentId: string, 
        public documentName: string, 
        public documentType: string, 
        public fileName: string, 
        public filePath: string) {}
}
