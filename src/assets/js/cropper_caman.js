$(function () {
  
var url = document.getElementById("ocr_image").src;
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