import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { LoginService } from '../views/login/login.service';
import { UserWrapper } from '../views/login/UserWrapper';
import { OCRConfReqRespWrapper } from '../views/process/OCRConfReqRespWrap';
import { ProcessService } from '../views/process/process.service';
import { ProjectService } from '../views/project/project.service';
import { environment } from '../../environments/environment';
declare var $: any;  
declare var Caman: any;

@Component({
  selector: 'app-g-home',
  templateUrl: './g-home.component.html',
  styleUrls: ['./g-home.component.scss']
})
export class GHomeComponent implements OnInit {
  public documentType = 'user';
  public enableCkEditor:boolean;
  public enableIFrame:boolean;
  public ocrConfData: OCRConfReqRespWrapper;
  uploadedFileName: string;
  fileName:any;
  projectId:any
  msgtex:any;
  errorMessage: string;
  selectedFile: any;
  hasError: boolean;
  showLoading: boolean;
  isUserLoggedIn: any;
  imageWidth: any;
  imageHeight: any;
  documentPath:any;
  remoteApiImageUrl:any;
  documentId:any;
  runOCRButtonActive: boolean;
  ocrOutputData: any="";
  keepEnglish: string;
  form: any;
 
 
  public userId: number;
  public documentName: string;
  public documentDir: string;
  public canvasWidth: number;
  public canvasHeight: number;
  imageToShow: any;
  imageToBlob: Blob;
  base64Image: any;
  public layoutData: any;
  public applyTemplate: string;
  public spellChecker: string;
 
  public keepEngActiveCss: string;
  public keepEngRemoveActiveCss: string;
  public ocrNoiseType: string;
  public loadOcrOutputFlag: boolean;


  constructor(private route: ActivatedRoute, protected router: Router, private processService: ProcessService,  private projectService: ProjectService, private sanitizer: DomSanitizer,private loginService: LoginService) {
    this.enableCkEditor = true;
    this.enableIFrame = false;
   }

  ngOnInit(): void {
   this.buttonActive_home();
   
   this.remoteApiImageUrl = this.projectService.remoteApiImageUrl;
    //this.documentPath ="assets/img/2.png";
    let strUsrId = localStorage.getItem("userId");
    let docType = 'user';
    this.documentType = docType;
    this.ocrConfData = new OCRConfReqRespWrapper();
    this.ocrConfData.outputType = 'text';
    this.ocrConfData.ocrModelType = 'hybrid';
    this.ocrConfData.charSegmentationType = 'pixel';
    this.ocrConfData.documentType = 'user';

    this.projectId = this.route.snapshot.paramMap.get('id');
    console.log("project Id:"+this.projectId)
    console.log('on Login Service');
    this.showLoading = false;
    this.isUserLoggedIn = this.loginService.isUserLoggedIn();
    if(this.isUserLoggedIn){
      this.router.navigateByUrl('/dashboard');
    } else {
      this.router.navigateByUrl('/g-home');
    }
  }

  onFileChanged(event) {    
    this.selectedFile = event.target.files[0];
    this.uploadedFileName = this.selectedFile.name;
    console.log('image selected');
    this.cleanCanvas();
    this.handleImageUpload();    
  }
 cleanCanvas(){
  var canvas = <HTMLCanvasElement> document.getElementById("canvas");
  var context = canvas.getContext("2d");

  // do some drawing
  //context.restore();

  // do some more drawing
  context.save();
  context.globalCompositeOperation = 'copy';
  context.strokeStyle = 'transparent';
  context.beginPath();
  context.lineTo(0, 0);
  context.stroke();
  context.restore();
  // draw more, still using the preserved transform
 }
  changeDocType(docType: string) {
    this.documentType = docType;
    localStorage.setItem('docType', docType);
    console.log('change to: '+docType);
  }

  usersHelps(){
    $('#UsersHelps').modal('show');
  }
  runToExtact(){
    console.log("Doctype:"+this.documentType)
    $('#runToExtact').modal('show');
  }
  modalClose(){
    $('#runToExtact').modal('hide');
  }
  buttonActive_home(){
    // $('#textContent_button').css()
      console.log("button Active Home");
     (<HTMLInputElement>document.getElementById("home_button")).style.setProperty("background-color", "black", "important");
     (<HTMLInputElement>document.getElementById("login_button")).style.setProperty("background-color", "", "important");
  }
  buttonActive_login(){
    // $('#textContent_button').css()
     console.log("button Active login");
    (<HTMLInputElement>document.getElementById("home_button")).style.setProperty("background-color", "", "important");
    (<HTMLInputElement>document.getElementById("login_button")).style.setProperty("background-color", "black", "important");
  }



  handleImageUpload(){
    this.projectId = environment.nonmemberDefaultProjectId;
    console.log('image upload process');
    console.log(this.selectedFile);
    this.hasError = false;
    this.errorMessage = '';
    if(this.selectedFile != null){
      this.showLoading = true;
      if(this.selectedFile.type == 'application/pdf'){
        this.showLoading = false;
        this.hasError = true;
        this.errorMessage = 'Please login to upload a pdf file.';
      } else if(this.selectedFile.type == 'image/png' || this.selectedFile.type == 'image/jpg' || this.selectedFile.type == 'image/jpeg') {
        console.log('Uploading png or jpg or jpeg');        
        this.projectService.uploadImageToServer(this.projectId, this.selectedFile).subscribe(
          (responseArray: string[]) => {
            console.log(responseArray);
            this.documentPath = this.remoteApiImageUrl +this.projectId+'/'+ responseArray[0]+'?width=600&height=900';
            this.fileName = responseArray[0];
            console.log(this.documentPath);
            this.loadAndUseImage();
            this.msgtex = "";
            this.ocrOutputData = "";
          },
          (error: HttpErrorResponse) => {
            console.log(error);
            this.showLoading = false;    
            //If there is a CORS policy error then comment the error mesage to test the workflow
            this.uploadedFileName = '';
            this.hasError = true;
            this.errorMessage = error.error[0];
          }
        );
      } else {
        this.hasError = true;
        this.errorMessage = 'Please upload png/jpg/jpeg file.';
        this.showLoading = false;
      }
    } else {
      this.hasError = true;
      this.errorMessage = 'Please select a file';
    }
  }


  // public ngAfterViewInit() {
  //   this.loadAndUseImage();
  // }

  loadAndUseImage(){
    this.showLoading = true;
	  this.runOCRButtonActive = false;
		console.log('filePath: '+this.documentPath);
    this.getBase64ImageFromURL(this.documentPath).subscribe(base64data => {
      this.base64Image = 'data:image/jpg;base64,' + base64data;
     // this.initWholeScript();
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


  public handleExtractText(): void {
    this.showLoading = true;
    this.hasError = false;
    this.runOCRButtonActive = false;
    console.log("Project Id"+this.projectId+"fileName:"+this.fileName+"Document Name"+this.documentType)
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

  public handleVerifyTemplateText(): void {
    this.showLoading = true;
    this.hasError = false;
    console.log("Doctype:"+this.documentType);
    if(this.documentType == 'user' || this.documentType == 'business' || this.documentType == 'education' || this.documentType == 'land' || this.documentType == 'nothi') {
      this.processService.handleVerifyTemplateText(this.projectId, this.fileName,this.documentType).subscribe(
        (response: any) => {
          console.log(response);
          if(this.documentType == 'user') {
            this.showLoading = false;
            this.hasError = false;  
            this.runOCRButtonActive = true;
            this.msgtex = response.body.template_name;            
            this.ocrOutputData = response.body.extracted_texts;
          } else if(this.documentType == 'business') {
            this.showLoading = false;
            this.hasError = false;  
            this.runOCRButtonActive = true;
            this.msgtex = response.body.template_name;            
            this.ocrOutputData = response.body.extracted_texts;
          } else if(this.documentType == 'education') {
            this.showLoading = false;
            this.hasError = false;  
            this.runOCRButtonActive = true;
            this.msgtex = response.body.template_name + " " + response.body.education_type;            
            this.ocrOutputData = response.body.extracted_texts;
          } else if(this.documentType == 'land') {
            this.showLoading = false;
            this.hasError = false;  
            this.runOCRButtonActive = true;
            this.msgtex = response.body.template_name;            
            this.ocrOutputData = response.body.extracted_texts;
          } else if(this.documentType == 'nothi') {
            this.showLoading = false;
            this.hasError = false;  
            this.runOCRButtonActive = true;
            this.msgtex = response.body.template_name;            
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
 
  //js code

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


      // $(document).ready(function(){
      //   $("#leftpanel").click(function(){
      //     $("#div1").removeClass("col-xl-6");
      //     $("#div2").removeClass("col-xl-6");
      //     $("#div1").removeClass("col-xl-8");
      //     $("#div2").removeClass("col-xl-4");
          
      //     $("#div1").addClass("col-xl-4");
      //     $("#div2").addClass("col-xl-8");
      //     caman.render(function() {
      //       cropper.replace(this.toBase64(), true);
      //       });
      //   });
      // });
      // $(document).ready(function(){
      //   $("#rightpanel").click(function(){
      //     $("#div1").removeClass("col-xl-6");
      //     $("#div2").removeClass("col-xl-6");
      //     $("#div1").removeClass("col-xl-4");
      //     $("#div2").removeClass("col-xl-8");

      //     $("#div1").addClass("col-xl-8");
      //     $("#div2").addClass("col-xl-4");
      //     caman.render(function() {
      //       cropper.replace(this.toBase64(), true);
      //       });
      //   });
      // });

      //   $(document).ready(function(){
      //     $("#Equal").click(function(){
      //       $("#div1").addClass("col-xl-6");
      //       $("#div2").addClass("col-xl-6");
            
      //       $("#div1").removeClass("col-xl-4");
      //       $("#div2").removeClass("col-xl-8");
      //       $("#div1").removeClass("col-xl-8");
      //       $("#div2").removeClass("col-xl-4");
            
      //         caman.render(function() {
      //         cropper.replace(this.toBase64(), true);
      //         });
            
      //     });
      // });

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


