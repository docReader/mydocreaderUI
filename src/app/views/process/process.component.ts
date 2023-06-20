import { Component, OnInit,OnDestroy, AfterViewInit,ViewChild, ElementRef, HostListener, ChangeDetectionStrategy,ChangeDetectorRef} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Router, ActivatedRoute } from '@angular/router'
import { ProjectService } from '../project/project.service';
import { Observable,Observer } from 'rxjs';
import { ProcessService } from './process.service';
import { HttpErrorResponse } from '@angular/common/http';
import { OCRConfReqRespWrapper } from './OCRConfReqRespWrap';
import { NgForm } from '@angular/forms';
import { UserWrapper } from '../login/UserWrapper';
import { FormBuilder, FormGroup } from "@angular/forms";
import { navItems } from '../../_nav';

declare var $: any;  
declare var Caman: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'process.component.html'
})
export class ProcessComponent implements OnInit,OnDestroy,AfterViewInit {

  form: FormGroup;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  SelectedDownloadUrlFileType: string;
  downloadFileUrl: string;
  public navItems = navItems;


  private ctx: CanvasRenderingContext2D;

  public documentType = 'user';
  public projectId: string;
  public userId: number;
  public fileName: string;
  public documentId: string;
  public documentName: string;
  public documentPath: string;
  public documentDir: string;
  public enableCkEditor: boolean;
  public enableIFrame : boolean;
  public canvasWidth: number;
  public canvasHeight: number;
  public remoteApiImageUrl: string;
  public hasError: boolean;
  public runOCRButtonActive: boolean;
  public errorMessage: string;
  imageToShow: any;
  imageToBlob: Blob;
  base64Image: any;
  public layoutData: any;
  selectedFile: File;
  public applyTemplate: string;
  public spellChecker: string;
  public ocrConfData: OCRConfReqRespWrapper;
  public keepEnglish: string;
  public ocrOutputData: string;
  public showLoading: boolean;
  public keepEngActiveCss: string;
  public keepEngRemoveActiveCss: string;
  public ocrNoiseType: string;
  public loadOcrOutputFlag: boolean;
  public imageWidth:number;
  public imageHeight:number;
  public msgtex : string;
  fullName:any = localStorage.getItem('fullnamelog');
  userId_user:any  = localStorage.getItem('userId');
  userName:any  = localStorage.getItem('userName');

  constructor(private router: Router, private route: ActivatedRoute, 
      private projectService: ProjectService, 
      private processService: ProcessService, 
      private sanitizer: DomSanitizer,
      public fb: FormBuilder,private cdref: ChangeDetectorRef){
    this.enableCkEditor = true;
    this.enableIFrame = false;
    this.documentDir = '/assets/documents/';
    console.log('In Process Constructor');
    this.showLoading = false;

    this.form = this.fb.group({
      img: [null]
    })

    this.masterSelected = false;
    this.checklist = [
      {id:1,value:'background',isSelected:false},
      {id:2,value:'border',isSelected:false},
      {id:3,value:'skew',isSelected:false},
      {id:4,value:'cycleGanNR',isSelected:false}
    ];
    //this.getCheckedItemList();
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = this.masterSelected;
    }
    //this.getCheckedItemList();
  }

  changeDocType(docType: string) {
    this.documentType = docType;
    /*if(docType ==='card') {
      docType = 'license';
    }*/
    localStorage.setItem('docType', docType);
    console.log('change to: '+docType);
  }
  usersDetails(){
    $('#Usersdetail').modal('show');
  }

  usersHelps(){
    $('#UsersHelps').modal('show');
  }
  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.isSelected == true;
      })
    this.getCheckedItemList();
  }

  /*editPartyRolesSubmit() {
    console.log(this.checklist);
  }*/

  ngOnInit(): void {
    let strUsrId = localStorage.getItem("userId");
    let docType = localStorage.getItem('docType');
    this.documentType = docType;

    this.userId = parseInt(strUsrId);
    console.log('Process COmponent Init StrUser: '+strUsrId+', user: '+this.userId);

    this.ocrConfData = new OCRConfReqRespWrapper();
    this.ocrConfData.outputType = 'text';
    this.ocrConfData.ocrModelType = 'hybrid';
    this.ocrConfData.charSegmentationType = 'pixel';
    this.ocrConfData.documentType = 'user';
    
    //this.runOCRButtonActive = true;

    this.remoteApiImageUrl = this.projectService.remoteApiImageUrl;
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.documentId = this.route.snapshot.paramMap.get('file');
    this.fileName = this.route.snapshot.paramMap.get('file');
    //imagePath = this.remoteApiImageUrl+this.projectId+'/'+fileName;
    this.documentPath = this.remoteApiImageUrl +this.projectId+'/'+ this.documentId + '?width=600&height=900';
    this.applyTemplate = '0';
    this.spellChecker = '1';
    this.keepEnglish = '1';
    this.hasError = false;
    this.errorMessage = '';
    this.keepEngActiveCss = 'active';
    this.keepEngRemoveActiveCss = '';
    this.runOCRButtonActive = true;
    this.ocrOutputData = '';
    this.SelectedDownloadUrlFileType = '';
    this.downloadFileUrl = '';
    this.loadOcrOutputFlag = true;
    this.imageHeight;
    this.imageWidth;
    this.msgtex = "";

    console.log('ProjId: '+this.projectId+' File: '+this.documentId+', Path: '+this.documentPath);
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  public ngAfterViewInit() {
    this.loadAndUseImage();
  }

  loadAndUseImage(){
    this.showLoading = true;
	  this.runOCRButtonActive = false;
		console.log('filePath: '+this.documentPath);
    this.getBase64ImageFromURL(this.documentPath).subscribe(base64data => {
      //this.base64Image = 'data:image/jpg;base64,' + base64data;
      this.initWholeScript();
      this.showLoading = false;
	    this.runOCRButtonActive = true;
      // Load Related data in the background
      // this.loadProjectFileLayoutDataInit();      
    });
  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      var img = <HTMLImageElement> document.getElementById("ocr_image");
      //let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }


  
  getBase64Image(img: HTMLImageElement) {
    //var canvas = document.createElement("canvas");
    var canvas = <HTMLCanvasElement> document.getElementById("canvas");
    const canvasW = Math.floor( canvas.getBoundingClientRect().width);
    const canvasH = Math.floor( canvas.getBoundingClientRect().height);
    console.log('Image resolution in canvas width : ' + img.width + ', height : ' + img.height);
    this.imageWidth=img.width;
    this.imageHeight=img.height;
    canvas.width = Math.floor( img.width);
    canvas.height = Math.floor( img.height);
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0,img.width,img.height);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  handleReloadOriginalImage() {
    this.showLoading = true;
    this.hasError = false;
	  this.runOCRButtonActive = false;
		console.log('reload original file: '+this.documentPath);

    this.projectService.getImageAsBlob(this.documentPath).subscribe(
      (responeObj: Blob) => {
        console.log('Reload Image as BLOB');

        $(".cropper-canvas").find('img').attr('src', window.URL.createObjectURL(responeObj));

        this.showLoading = false;
        this.hasError = false;
        this.runOCRButtonActive = true;
        $('#revertoriginal_modal').modal('hide');
      },
      (error: HttpErrorResponse) => {
        //alert(error);
        console.log('Error on get output');
        console.log(error);
        this.hasError = true;
        this.showLoading = false;
        this.runOCRButtonActive = true;        
      }
    );


  }
  
  sideToggleMenu(){
      document.getElementById('side-menu').classList.toggle('active');
  }

  updateImageSource(){
    console.log('updateImageSource: '+this.documentPath);
    var canvas = <HTMLCanvasElement> document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var imageObj = <HTMLImageElement> document.getElementById("ocr_image");

    let imgWid = imageObj.width; 
    let imgHgt = imageObj.height; 

    let width = canvas.width;
    let height = canvas.height;
    const canvasW = Math.floor( canvas.getBoundingClientRect().width);
    //var intvalue = Math.floor( floatvalue );
    const canvasH = Math.floor( canvas.getBoundingClientRect().height);

    console.log('Canvas: Start width: '+width+' height: '+height+', End width: '+canvasW+', height: '+canvasH);
    //console.log('imgWid: '+imgWid+' imgHgt: '+imgHgt);

    imageObj.src = this.documentPath;
    imageObj.onload = function () {
      ctx.drawImage(imageObj,0,0, canvasW,canvasH);
    }

    //this.initiazeActionsTools();
    this.initWholeScript();
  } 

  sanitize(url: string) {
    //return url;
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
 
  @HostListener('unloaded')
  ngOnDestroy() {
    console.log('Items destroyed');
    //this.canvas = null;
  }

  return_original_modal () {
    $('#revertoriginal_modal').modal('show');
  }

  share_modal () {
    $('#share_modal').modal('show');
  }

  public mceEditorConfig: any = {
    height: '800',
    statusbar: false,
    selector: 'textarea',
    plugins:
      ' print preview paste searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons Paragraph toc HangingText toc_r ',
    toolbar:
      ' undo redo | bold italic underline | fontselect fontsizeselect styleselect |Paragraph|HangingText| alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | ltr rtl|toc|toc_r|',
       font_formats: "SutonnyMJ=sutonnymj, Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
  };

  loadProjectFileLayoutDataInit() {
    this.showLoading = true;
    this.hasError = false;
	  this.runOCRButtonActive = false;
    console.log('Default Layout Initiate');
    this.processService.getProjectFileLayoutDataInit(this.projectId, this.fileName).subscribe(
      (responeObj: any) => {
        console.log('Default Layout Initiate -> success');
        console.log(responeObj);
        this.layoutData = responeObj;
        this.showLoading = false;
        this.hasError = false;
		    this.runOCRButtonActive = true;
        this.loadOcrOutputFlag = true;
        //this.loadOCRConfigurationUserData();
        this.loadOCROutputDataData(this.ocrConfData.outputType, true);
      },
      (error: HttpErrorResponse) => {
        console.log('Default Layout Initiate -> error');
        //alert(error.message);
        console.log(error.message);
        //this.hasError = true;
        //this.errorMessage = 'No Default Layout Available. Processing for default Layout.';//+error.message;
        //this.loadOcrOutputFlag = false;
        //this.loadProjectFileLayoutData();
        //this.showLoading = false;
		    //this.runOCRButtonActive = true;

        this.showLoading = false;
        this.hasError = false;
		    this.runOCRButtonActive = true;
        this.loadOcrOutputFlag = true;
      }
    );
  }

  loadProjectFileLayoutData() {
    this.showLoading = true;
	  this.runOCRButtonActive = false;
    this.hasError = false;
    console.log('Default Layout Generate Process');
    this.processService.getProjectFileLayoutData(this.projectId, this.fileName).subscribe(
      (responeObj: any) => {
        console.log('Default Layout Generate Process -> success');
        console.log(responeObj);
        this.layoutData = responeObj;
        this.showLoading = false;
        this.hasError = false;
		    this.runOCRButtonActive = true;
        this.loadOCRConfigurationUserData();
      },
      (error: HttpErrorResponse) => {
        console.log('Default Layout Generate Process -> error');
        //alert(error.message);
        console.log(error.message);
        this.showLoading = false;
        this.hasError = true;
        this.errorMessage = error.message;
		    this.runOCRButtonActive = true;
      }
    );
  }

  loadOCRConfigurationUserData() {
    this.showLoading = true;
    this.hasError = false;
	  this.runOCRButtonActive = false;
    console.log('Load OCR Configuration Data');
    this.processService.getOCRConfigurationData(this.userId).subscribe(
      (responeObj: any) => {
        //console.log(responeObj);
        this.ocrConfData = responeObj.body;
        this.showLoading = false;
        this.hasError = false;
		    this.runOCRButtonActive = true;
        console.log(this.ocrConfData);
        if(this.loadOcrOutputFlag) {
          this.loadOCROutputDataData(this.ocrConfData.outputType, true);
        }
      },
      (error: HttpErrorResponse) => {
        //alert(error.message);
        console.log(error.message);
        this.showLoading = false;
        this.hasError = true;
		    this.runOCRButtonActive = true;
        this.errorMessage = error.message;
      }
    );
  }

  public handleOcrConfigurationUpdate(ocrConfForm: NgForm): void {
    console.log('Update OCR Configuration');
    let ocrConfWrap = ocrConfForm.value;
    this.showLoading = true;
    this.hasError = false;
    let usr = new UserWrapper();
    usr.id = this.userId;
    ocrConfWrap.user = usr;
    ocrConfWrap.outputType = this.ocrConfData.outputType;
    console.log(ocrConfWrap);
    this.processService.updateOCRConfigurationData(this.ocrConfData.id, ocrConfWrap).subscribe(
      (response) => {
        console.log(response);
        this.showLoading = false;
        this.hasError = false;
        $('#ocroption_modal').modal('hide');

        this.applyTemplate = ocrConfWrap.applyFormatting;
        this.spellChecker = ocrConfWrap.spellChecker;

        // reload server data
        this.loadOCRConfigurationUserData();
      },
      (error: HttpErrorResponse) => {
        //alert(error.message);
        this.showLoading = false;
        this.hasError = true;
        this.errorMessage = error.message;
      }
    );
  }
  
  keepEnglishChangeHandle(evt) {
    //console.log('keep eng: ');
    //console.log(evt.target.value);
    this.keepEnglish = evt.target.value
    if(evt.target.value==='1') {
      this.keepEngActiveCss = 'active';
      this.keepEngRemoveActiveCss = '';
    } else {
      this.keepEngActiveCss = '';
      this.keepEngRemoveActiveCss = 'active';
    }
  }

  public handleVerifyTemplateText(): void {
    this.showLoading = true;
    this.hasError = false;
    console.log("Doctype:"+this.documentType);
    if(this.documentType == 'user' || this.documentType == 'business' || this.documentType == 'education' || this.documentType == 'land' || this.documentType == 'nothi') {
      this.processService.handleVerifyTemplateText(this.projectId, this.fileName,this.documentType).subscribe(
        (response: any) => {
          console.log(response);
          if(this.documentType == 'user') {
            this.msgtex = response.body.template_name;
            this.showLoading = false;
            this.hasError = false;  
            this.runOCRButtonActive = true;
            this.ocrOutputData = response.body.extracted_texts;
          } else if(this.documentType == 'business') {
            this.msgtex = response.body.template_name;
            this.showLoading = false;
            this.hasError = false;  
            this.runOCRButtonActive = true;
            this.ocrOutputData = response.body.extracted_texts;
          } else if(this.documentType == 'education') {
            this.msgtex = response.body.template_name + " " + response.body.education_type;
            this.showLoading = false;
            this.hasError = false;  
            this.runOCRButtonActive = true;
            this.ocrOutputData = response.body.extracted_texts;
          } else if(this.documentType == 'land') {
            this.msgtex = response.body.template_name;
            this.showLoading = false;
            this.hasError = false;  
            this.runOCRButtonActive = true;
            this.ocrOutputData = response.body.extracted_texts;
          } else if(this.documentType == 'nothi') {
            this.msgtex = response.body.template_name;
            this.showLoading = false;
            this.hasError = false;  
            this.runOCRButtonActive = true;
            this.ocrOutputData = response.body.extracted_texts;
          } else {
            //alert(error.message);
            this.msgtex = "";
            this.showLoading = false;
            this.hasError = true;
            this.errorMessage = "Please select the type of your document.";
            this.runOCRButtonActive = true;
          }
        },
        (error: HttpErrorResponse) => {
          //alert(error.message);
          this.msgtex = "";
          this.showLoading = false;
          this.hasError = true;
          this.errorMessage = error.message;
          this.runOCRButtonActive = true;
        }
      );
    } else {
      alert('This template is not supported yet.');
    }
    

  }

  public handleVerifyTemplate(): void {
    this.showLoading = true;
    this.hasError = false;
    console.log("Doctype:"+this.documentType);
    if(this.documentType == 'user' || this.documentType == 'business' || this.documentType == 'education' || this.documentType == 'land' || this.documentType == 'nothi') {
      this.processService.handleVerifyTemplate(this.projectId, this.fileName,this.documentType).subscribe(
        (response: any) => {
          console.log(response);
          //console.log(response.body.template_name);
          this.msgtex = response.body.template_name;
          this.showLoading = false;
          this.hasError = false;        
        },
        (error: HttpErrorResponse) => {
          //alert(error.message);
          this.msgtex = "";
          this.showLoading = false;
          this.hasError = true;
        }
      );
    } else {
      alert('This template is not supported yet.');
    }
    

  }

  public handleExtractText(): void {
    this.showLoading = true;
    this.hasError = false;
    //this.runOCRButtonActive = false;
    this.processService.handleExtractText(this.projectId, this.fileName,this.documentType).subscribe(
      (response: any) => {
        console.log(response);        
        this.showLoading = false;
        this.hasError = false;
        this.runOCRButtonActive = true;

        this.ocrOutputData = response.body.extracted_texts;
        
      },
      (error: HttpErrorResponse) => {
        //alert(error.message);
        this.showLoading = false;
        this.hasError = true;
        this.errorMessage = error.message;
        this.runOCRButtonActive = true;
      }
    );
  }

  public handleCoreOCRPipelineUpdate(): void {

    //this.loadOCROutputDataData('text');
    console.log('RUN OCR Started');
    let ocrConfWrap  = new OCRConfReqRespWrapper();
    this.showLoading = true;
    this.hasError = false;
    ocrConfWrap.ocrModelType = this.ocrConfData.ocrModelType;
    ocrConfWrap.charSegType = this.ocrConfData.charSegmentationType;

    let docType = localStorage.getItem('docType');
    
    ocrConfWrap.documentType = 'user';
    ocrConfWrap.keepEnglish = this.keepEnglish;
    ocrConfWrap.keepLayout = "0";
    // if(this.ocrConfData.outputType == 'text') {
    //  ocrConfWrap.keepLayout = "0";
    // }
    ocrConfWrap.projectID =  this.projectId;
    ocrConfWrap.fileName =  this.fileName;

    console.log(ocrConfWrap);
    this.runOCRButtonActive = false;
    this.processService.updateOCRCorePipelineData(ocrConfWrap).subscribe(
      (response: any) => {
        console.log(response);        
        this.showLoading = false;
        this.hasError = false;
        //$('#ocroption_modal').modal('hide');
        // reload server data
        this.loadOCROutputDataData(this.ocrConfData.outputType, false);
      },
      (error: HttpErrorResponse) => {
        //alert(error.message);
        this.showLoading = false;
        this.hasError = true;
        this.errorMessage = error.message;
        this.runOCRButtonActive = true;
      }
    );
  }

  loadOCROutputDataData(outputType: string, initLoad: boolean) {
    this.showLoading = true;
    this.hasError = false;
    console.log('Load OCR Output Data');
    this.runOCRButtonActive = false;
    this.processService.getOCROutputData(this.projectId, this.fileName, outputType).subscribe(
      (responeObj) => {
        console.log('responeObj');
        //console.log(responeObj);
        this.ocrOutputData = responeObj;
        this.showLoading = false;
        this.hasError = false;
        this.runOCRButtonActive = true;
        //console.log(this.ocrOutputData);
      },
      (error: HttpErrorResponse) => {
        //alert(error);
        console.log('Error on get output');
        console.log(error);
        this.showLoading = false;
        this.runOCRButtonActive = true;
        if(!initLoad){
          this.hasError = true;
          this.errorMessage = 'No OCR Output Found. ';//+error.message;
        }
      }
    );
  }

  generateOCROutputPathData(outputType: string) {
    this.showLoading = true;
    this.hasError = false;
    console.log('Generate OCR Output Docx Data');
    this.runOCRButtonActive = false;
    this.processService.getOCROutputPath(this.projectId, this.fileName, outputType).subscribe(
      (responeObj) => {
        this.showLoading = false;
        this.hasError = false;
        this.runOCRButtonActive = true;
        this.SelectedDownloadUrlFileType = 'Download ' + outputType;
        this.downloadFileUrl = responeObj;
        console.log(responeObj);
      },
      (error: HttpErrorResponse) => {
        //alert(error);
        console.log('Error on get output');
        console.log(error);
        this.showLoading = false;
        this.runOCRButtonActive = true;        
      }
    );
  }
  
  selectDownloadUrlChangeHandler (event: any) {
    console.log(event.target.value);
    const selectedValue: string = event.target.value;
    this.SelectedDownloadUrlFileType = '';
    if(selectedValue !== ''){
      this.generateOCROutputPathData(selectedValue);
    }
  }

  getCheckedItemList(){
    this.ocrNoiseType = '';
    this.checkedList = [];
    let noOfCheckList = 0;
    let noOfSelected = 0;
    for (var i = 0; i < this.checklist.length; i++) {
      noOfCheckList++;
      if(this.checklist[i].isSelected) {
        this.checkedList.push(this.checklist[i]);
        noOfSelected++;
        this.ocrNoiseType += this.checklist[i].value+'/';
      }
    }
    if(noOfSelected==noOfCheckList){
      this.ocrNoiseType =  'all';
    } else {
      if(this.ocrNoiseType!=null && this.ocrNoiseType.length>0) {
        const editedText = this.ocrNoiseType.slice(0, -1);
        this.ocrNoiseType = editedText;
      }
    }
    this.checkedList = JSON.stringify(this.checkedList);
  }

  //public imageToShow2 = '';
  handleAutoNoiseAndUpdateImageData() {

    console.log('Auto Noise Update Data');
    this.getCheckedItemList();
    console.log('NoiseType: '+this.ocrNoiseType);

    if(this.ocrNoiseType!=null && this.ocrNoiseType.length>0) {
      this.showLoading = true;
      this.hasError = false;
      this.runOCRButtonActive = false;
      this.processService.handleAutoNoiseCoreOCRData(this.projectId, this.fileName, this.ocrNoiseType).subscribe(
        (responeObj: Blob) => {
          console.log('Auto Noise Response with BLOB');
          //console.log(responeObj);

          $(".cropper-canvas").find('img').attr('src', window.URL.createObjectURL(responeObj));

          this.showLoading = false;
          this.hasError = false;
          this.runOCRButtonActive = true;
          $('#ocroption_Nose_Remove').modal('hide');
        },
        (error: HttpErrorResponse) => {
          //alert(error);
          console.log('Error on get output');
          console.log(error);
          this.hasError = true;
          this.showLoading = false;
          this.runOCRButtonActive = true;        
        }
      );
    } else {
      alert('please select ocr noise removal type');
    }
  }

  copyToEditorText(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  shareText(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    var text=selBox.value = val;
    document.getElementById("share")[text];
    //alert(text)
   
  }

  handleImageUpdate(){
    console.log('image update process');
    
    $("#canvas").cropper('crop');
    var contData = $("#canvas").cropper('getContainerData'); //Get container data
    var h = contData.height;
    var w = contData.width;
    $("#canvas").cropper('setCropBoxData', {
      height: h,
      left: 0,
      top: 0,
      width: w
    });
    var cropbox = $("#canvas").cropper('getCropBoxData');
    //console.log(cropbox);
            
    var croppedcanvas = $("#canvas").cropper('getCroppedCanvas', {maxWidth: 4096, maxHeight: 4096, fillColor: "#ffffff"});
    //console.log(croppedcanvas);

    var imageData = croppedcanvas.toDataURL('image/png');
    //imageData = imageData.replace(/^data:image\/(png|jpg);base64,/, "")
    imageData = croppedcanvas.toDataURL().split(';base64,')[1];

    console.log(imageData);
    console.log('image data =========');
      
    var imageObj = <HTMLImageElement> document.getElementById("ocr_preview_image");
    //imageObj.src = imageData;
    

    //console.log(imageObj);
    let base64Data = this.getBase64Image(imageObj);
    var blob = new Blob([base64Data], { type: "image/png"});
    console.log('blob data =========');
    console.log(blob);
    //const myFile = new File([imageData], this.fileName+'.png');
    let myFile = new File([blob], this.fileName+'.png', {type: "image/png"});
    
    console.log(myFile);
    //this.selectedFile = myFile;

    this.form.patchValue({
      img: myFile
    });
    this.form.get('img').updateValueAndValidity();

    console.log(this.form);
    //var formData: any = new FormData();
    //formData.append('file', this.form.get('img').value);

    let formData = new FormData();
    formData.append('file', myFile);

    //$("#canvas").cropper('clear');
    $("#canvas").cropper("destroy");
    this.hasError = false;
    this.showLoading = true;

    //updateImageFileToServer updateImageToServer
    this.projectService.updateImageFileToServer(this.projectId, this.fileName, myFile).subscribe(
      (responseArray: string[]) => {
        let fileNameReturned:Boolean = false;
        for (var fileName of responseArray) {
          this.fileName = fileName;
          this.documentId = fileName;
          fileNameReturned = true;
          //after updating an image only one file name will be returned
          break;
        }
        console.log('responseArray: '+responseArray);
        this.showLoading = false;
        this.hasError = false;
        $('#getCroppedCanvasModal').modal('hide');
        if(fileNameReturned){
          this.ocrOutputData = "";
          //this.loadProjectFileLayoutData();
        }        
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
        this.showLoading = false;
        this.hasError = true;
        this.errorMessage = error.message;
      }
    );  

  }

  loadProcessRegionComponent() {
    console.log("Image Loading...");
    var canvas = <HTMLCanvasElement> document.getElementById("canvas");
    canvas.remove();
    this.router.navigate(['/process-region/',this.projectId, this.documentId]);
    // ['/process-region/',this.projectId, this.documentId]
  }

  

  initWholeScript() {

    $(function () {
  
      //var url = document.getElementById("ocr_image").src;

      var url = this.documentPath;

      var $canvas = $('#canvas');
      var $img = $('#ocr_image');
      var cropper;
      var caman;
      var cropped = false;
      var croppedcanvas;
      
      var options = {
      autoCrop: false,
      dragCrop: false,
      dragMode: 'move',
      viewMode: 1,
      ready: function (e) {
        console.log(e.type);
        
      },
      crop: function(e) {
        console.log(e);
        //var data = e.detail;
        //console.log("data-" + data);
        var dataHeight = Math.round(e.height);
          var dataWidth = Math.round(e.width);
        console.log("width-" + dataWidth);
        console.log("height-" + dataHeight);
        
        }
      };
      
      caman = Caman("#canvas", url, function() {
                     
      //cropper = $("#canvas").cropper().data("cropper");
      cropper = $("#canvas").cropper(options).data("cropper");
      });
      
      
      $('#db').on('click', function () {
      if (caman) {
        caman.brightness(-20);
        caman.render(function() {
        cropper.replace(this.toBase64(), true);
        });
      }
      
      });
      
      $('#ib').on('click', function () {
      if (caman) {
        caman.brightness(20);
        caman.render(function() {
        cropper.replace(this.toBase64(), true);
        });
      }
      
      });
      
      $('#dc').on('click', function () {
      if (caman) {
       caman.contrast(-20);
        caman.render(function() {
        cropper.replace(this.toBase64(), true);
        });
      }
      });
      
      $('#ic').on('click', function () {
      if (caman) {
       caman.contrast(220);
        caman.render(function() {
        cropper.replace(this.toBase64(), true);
        });
      }
      });
      
      $('#resetButton').on('click', function () {
      if (caman) {
        caman.reloadCanvasData();
        caman.revert(false);
        caman.render(function() {
        cropper.replace(this.toBase64(), true);
        });
      }
      });
      
      $('#rl').on('click', function () {
      
       $('#canvas').cropper('rotate', -1);
      });
      
      $('#rr').on('click', function () {
      
       $('#canvas').cropper('rotate', 1);
      });
       //90 degree 
      $('#left').on('click', function () {
      
        $('#canvas').cropper('rotate', -90);
       });
       
       $('#right').on('click', function () {
       
        $('#canvas').cropper('rotate', 90);
       });
      //end
      
      $('#zo').on('click', function () {
      
       $('#canvas').cropper('zoom', -0.1);
      });
      
      $('#zi').on('click', function () {
      
       $('#canvas').cropper('zoom', 0.1);
      });
      
      $('#crop').on('click', function () {
        
       $('#canvas').cropper('crop');
       cropped = true;
       //var data = $canvas.cropper('getCropBoxData');
       //console.log(data);
      
      });
      
      $('#clear').on('click', function () {
      
       $('#canvas').cropper('clear');
      });
      
      $('#expand').on('click', function () {
      
       $('#canvas').cropper('reset');
      });
      
      $('#eraser').on('click', function () {
        
      });
      
      $("#getCroppedCanvas").click(function () {
        
        console.log(cropped);
        
        if (cropped == false){
          
        $("#canvas").cropper('crop');
        
        var contData = $("#canvas").cropper('getContainerData'); //Get container data
        var h = contData.height;
        var w = contData.width;
        
        $("#canvas").cropper('setCropBoxData', {
          height: h,
          left: 0,
          top: 0,
          width: w
        });
        } else{
        cropped = false;			
        }
        
        var cropbox = $("#canvas").cropper('getCropBoxData');
        console.log(cropbox);
        
        croppedcanvas = $("#canvas").cropper('getCroppedCanvas', {maxWidth: 4096, maxHeight: 4096, fillColor: "#ffffff"});
        console.log(croppedcanvas);
        
        var imageData = croppedcanvas.toDataURL('image/png');
        
        $('#getCroppedCanvasModal').modal().find('.showPic').attr('src', imageData);
        $('#getCroppedCanvasModal').modal('show');
        $("#canvas").cropper('clear');
      });
        
      $("#downloadfile").click(function () {
          
        var fileid = getParam( 'id' );	
        var cropped_filename = fileid + '_edited.png';
        var file = cropped_filename.substr(0, cropped_filename.lastIndexOf('.'));
        
        //console.log(lastfolder);
        
        //var cropvalue = $("#canvas").cropper('getCroppedCanvas');
        
        console.log(croppedcanvas);
         
        // Upload cropped image to server if the browser supports `HTMLCanvasElement.toBlob`.
        // The default value for the second parameter of `toBlob` is 'image/png', change it if necessary.
        croppedcanvas.toBlob((blob) => {
          const formData = new FormData();
          
          //console.log(formData);
      
          // Pass the image file name as the third parameter if necessary.
          formData.append('croppedImage', blob , cropped_filename );
          formData.append('fileid', fileid);
      
          // Use `jQuery.ajax` method for example
          $('#loading-image').show();
          $.ajax('upload_edited_image.php', {
          method: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success: function(data) {
            console.log(data);
            //console.log('Upload success');
            $('#getCroppedCanvasModal').modal('hide');
            //window.location.reload();
            location.href='process.php?id='+fileid+'';	
          },
          error() {
            console.log('Upload error');
          },
          }); 
        }, '' );
      });


      $(document).ready(function(){
        $("#leftpanel").click(function(){
          $("#div1").removeClass("col-xl-6");
          $("#div2").removeClass("col-xl-6");
          $("#div1").removeClass("col-xl-8");
          $("#div2").removeClass("col-xl-4");
          
          $("#div1").addClass("col-xl-4");
          $("#div2").addClass("col-xl-8");
          caman.render(function() {
            cropper.replace(this.toBase64(), true);
            });
        });
      });
      $(document).ready(function(){
        $("#rightpanel").click(function(){
          $("#div1").removeClass("col-xl-6");
          $("#div2").removeClass("col-xl-6");
          $("#div1").removeClass("col-xl-4");
          $("#div2").removeClass("col-xl-8");

          $("#div1").addClass("col-xl-8");
          $("#div2").addClass("col-xl-4");
          caman.render(function() {
            cropper.replace(this.toBase64(), true);
            });
        });
      });

        $(document).ready(function(){
          $("#Equal").click(function(){
            $("#div1").addClass("col-xl-6");
            $("#div2").addClass("col-xl-6");
            
            $("#div1").removeClass("col-xl-4");
            $("#div2").removeClass("col-xl-8");
            $("#div1").removeClass("col-xl-8");
            $("#div2").removeClass("col-xl-4");
            
              caman.render(function() {
              cropper.replace(this.toBase64(), true);
              });
            
          });
      });

      $(document).ready(function(){
        $("#ImageResize").click(function(){
            caman.render(function() {
            cropper.replace(this.toBase64(), true);
            });
        });
    });
    
      function getParam( name )
      {
       name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
       var regexS = "[\\?&]"+name+"=([^&#]*)";
       var regex = new RegExp( regexS );
       var results = regex.exec( window.location.href );
       if( results == null )
        return "";
      else
       return results[1];
      }
      });
  }

}
