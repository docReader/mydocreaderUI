window.onload = function () {
	
  var Cropper = window.Cropper;
  var URL = window.URL || window.webkitURL;
  var container = document.querySelector('.img-container');
  var actions = document.getElementById('actions');
  var increaseBrightness = document.getElementById('ib');
  var decreaseBrightness = document.getElementById('db');

  var options = {
    aspectRatio: 16 / 9,
    preview: '.img-preview',
	autoCrop: false,
	dragCrop: false,
	setDragMode: 'move',
    ready: function (e) {
	  var cropper = this.cropper;
	  //cropper.zoomTo(1);
	  cropper.setDragMode('move');
      console.log(e.type);
    },
    cropstart: function (e) {
      console.log(e.type, e.detail.action);
    },
    cropmove: function (e) {
      console.log(e.type, e.detail.action);
    },
    cropend: function (e) {
      console.log(e.type, e.detail.action);
    },
    crop: function (e) {
      var data = e.detail;
      console.log(e.type);
    },
    zoom: function (e) {
      console.log(e.type, e.detail.ratio);
    }
  };
  //var cropper = new Cropper(image, options);
  
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  //image = new Image();
  var image = document.getElementById('ocr_image');
  
  //image.onload = function () {
	  
   var width = image.offsetWidth;
   var height = image.offsetHeight;

   canvas.width = width;
   canvas.height = height;
   context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, width, height);
   var cropper = new Cropper(canvas, options);
   
   document.getElementById("ocr_image").style.visibility = "hidden";
  //};
  
  //image.src = document.getElementById("ocr_image").src;

  var originalImageURL = image.src;
  var uploadedImageType = 'image/jpeg';
  var uploadedImageType = 'image/jpeg';
  var uploadedImageName = 'cropped.jpg';
  var uploadedImageURL;
  
  // Tooltip
  $('[data-toggle="tooltip"]').tooltip();

  // Buttons
  if (!document.createElement('canvas').getContext) {
    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  }

  if (typeof document.createElement('cropper').style.transition === 'undefined') {
    $('button[data-method="rotate"]').prop('disabled', true);
    $('button[data-method="scale"]').prop('disabled', true);
  }

  // Download
  //if (typeof download.download === 'undefined') {
  //  download.className += ' disabled';
  //  download.title = 'Your browser does not support download';
  //}

  // Methods
  actions.querySelector('.docs-buttons').onclick = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var cropped;
    var result;
    var input;
    var data;

    if (!cropper) {
      return;
    }

    while (target !== this) {
      if (target.getAttribute('data-method')) {
        break;
      }

      target = target.parentNode;
    }

    if (target === this || target.disabled || target.className.indexOf('disabled') > -1) {
      return;
    }

    data = {
      method: target.getAttribute('data-method'),
      target: target.getAttribute('data-target'),
      option: target.getAttribute('data-option') || undefined,
      secondOption: target.getAttribute('data-second-option') || undefined
    };

    cropped = cropper.cropped;

    if (data.method) {
      if (typeof data.target !== 'undefined') {
        input = document.querySelector(data.target);

        if (!target.hasAttribute('data-option') && data.target && input) {
          try {
            data.option = JSON.parse(input.value);
          } catch (e) {
            console.log(e.message);
          }
        }
      }

      switch (data.method) {
        case 'rotate':
          if (cropped && options.viewMode > 0) {
            cropper.clear();
          }

          break;

        case 'getCroppedCanvas':
          try {
            data.option = JSON.parse(data.option);
          } catch (e) {
            console.log(e.message);
          }

          if (uploadedImageType === 'image/jpeg') {
            if (!data.option) {
              data.option = {};
            }

            data.option.fillColor = '#fff';
          }

          break;
      }

      result = cropper[data.method](data.option, data.secondOption);

      switch (data.method) {
        case 'rotate':
          if (cropped && options.viewMode > 0) {
            cropper.crop();
          }

          break;

        case 'scaleX':
        case 'scaleY':
          target.setAttribute('data-option', -data.option);
          break;

        case 'getCroppedCanvas':
          if (result) {
            // Bootstrap's Modal
            $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

            //if (!download.disabled) {
             // download.download = uploadedImageName;
             // download.href = result.toDataURL(uploadedImageType);
            //}
			
          }

          break;

        case 'destroy':
          cropper = null;

          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
            uploadedImageURL = '';
            image.src = originalImageURL;
          }

          break;
      }

      if (typeof result === 'object' && result !== cropper && input) {
        try {
          input.value = JSON.stringify(result);
        } catch (e) {
          console.log(e.message);
        }
      }
    }
  };

  document.body.onkeydown = function (event) {
    var e = event || window.event;

    if (e.target !== this || !cropper || this.scrollTop > 300) {
      return;
    }

    switch (e.keyCode) {
      case 37:
        e.preventDefault();
        cropper.move(-1, 0);
        break;

      case 38:
        e.preventDefault();
        cropper.move(0, -1);
        break;

      case 39:
        e.preventDefault();
        cropper.move(1, 0);
        break;

      case 40:
        e.preventDefault();
        cropper.move(0, 1);
        break;
    }
  };
  
    document.getElementById('downloadfile').addEventListener('click', function () {
		
		var path = getParam( 'p' );	
		var fullpath = path.replace(/%2F/gi, '/')
		var filename = fullpath.split("/").pop();
		var extension = filename.split('.').pop();
		var file = filename.substring(0, filename.lastIndexOf('.'));
		var cropped_filename = file + '_edited.' + extension;
		var lastfolder = fullpath.substring(0, fullpath.lastIndexOf("/"));
		
		console.log(lastfolder);
        
		var cropvalue = cropper.getCroppedCanvas();
		
		// Upload cropped image to server if the browser supports `HTMLCanvasElement.toBlob`.
		// The default value for the second parameter of `toBlob` is 'image/png', change it if necessary.
		cropper.getCroppedCanvas().toBlob((blob) => {
		  const formData = new FormData();
		  
		  console.log(formData);

		  // Pass the image file name as the third parameter if necessary.
		  formData.append('croppedImage', blob , cropped_filename );
		  formData.append('path', lastfolder);

		  // Use `jQuery.ajax` method for example
		  $.ajax('upload.php', {
			method: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: function(data) {
			  console.log(data);
			  console.log('Upload success');
			  $('#getCroppedCanvasModal').modal('hide');
			  window.location.reload();
			},
			error() {
			  console.log('Upload error');
			},
		  });
		}, '' );
		
		
		
    });
	
	var tempCanvas = document.createElement('canvas'),
	tempCanvasContext = tempCanvas.getContext('2d');
	
	tempCanvas.setAttribute('width', width);
	tempCanvas.setAttribute('height', height),
	editorHistory = {};
	
	document.getElementById('db').onclick = function () {
        
		  var step = parseInt(decreaseBrightness.getAttribute('data-step'));
		  var currentvalue = parseInt(decreaseBrightness.getAttribute('data-currentvalue'));
		  var delta = step + currentvalue;
		  var minVal = parseInt(decreaseBrightness.getAttribute('data-min'));

		  if(delta > minVal){
			tempCanvasContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
			//tempCanvasContext.drawImage(image, 0, 0, image.width, image.height, centerShiftX, centerShiftY, image.width * ratio, image.height * ratio);
			tempCanvasContext.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, width, height);
			var pixels = tempCanvasContext.getImageData(0, 0, tempCanvas.width,tempCanvas.height);
			var pixelDataArray = pixels.data;
			increaseBrightness.setAttribute('data-currentvalue',delta);
			decreaseBrightness.setAttribute('data-currentvalue',delta);
			editorHistory['brightness'] = delta;
			console.log('Beginning decreaseBrightness...');
			delta = Math.floor(255 * (delta / 100));
			for (var i = 0; i < pixelDataArray.length; i += 4) {
			  pixelDataArray[i] = pixelDataArray[i] + delta; // red
			  pixelDataArray[i + 1] += delta; // green
			  pixelDataArray[i + 2] += delta; // blue
			}
			context.putImageData(pixels, 0, 0);
			console.log('complete decreaseBrightness...');
			cropper = new Cropper(canvas, options);
		  }
		
    };
  
  
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

 
  

  // Import image
  /* var inputImage = document.getElementById('inputImage');

  if (URL) {
    inputImage.onchange = function () {
      var files = this.files;
      var file;

      if (cropper && files && files.length) {
        file = files[0];

        if (/^image\/\w+/.test(file.type)) {
          uploadedImageType = file.type;
          uploadedImageName = file.name;

          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
          }

          image.src = uploadedImageURL = URL.createObjectURL(file);
          cropper.destroy();
          cropper = new Cropper(image, options);
          inputImage.value = null;
        } else {
          window.alert('Please choose an image file.');
        }
      }
    };
  } else {
    inputImage.disabled = true;
    inputImage.parentNode.className += ' disabled';
  } */
  
};
//});
