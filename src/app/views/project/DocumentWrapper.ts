export interface IDocumentWrapper {
    documentId: string;
    documentName: string;
    documentType: string;
    fileName: string;
    filePath: string;
    projectId: string;
}

export class DocumentWrapper implements IDocumentWrapper {
    constructor(public documentId: string, 
        public documentName: string, 
        public documentType: string, 
        public fileName: string, 
        public filePath: string,
        public projectId: string) {}
}
