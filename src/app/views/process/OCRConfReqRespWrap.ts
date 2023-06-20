import { UserWrapper } from "../login/UserWrapper";

export class OCRConfReqRespWrapper {
    public id: number;
    public ocrModelType: string;
    public charSegmentationType: string;
    public charSegType: string;
    public outputType: string;
    public documentType: string;
    public spellChecker: string;
    public keepEnglish: string;
    public keepLayout: string;
    public applyFormatting: string;
    public projectID: string;
    public fileName: string;
    
    public user: UserWrapper;

    /*constructor( id   : number,
            ocrModelType: string,
            charSegmentationType: string,
            outputType: string,
            spellChecker: string,
            applyFormatting: string,
            user: UserWrapper
    ){
    }*/
}
  