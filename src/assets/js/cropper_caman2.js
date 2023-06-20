$(function () {
      
var url = document.getElementById("ocr_image").src;
var $canvas = $('#canvas');
var $img = $('#ocr_image');
var caman;

startCaman(url);

var options = {
autoCrop: false,
dragCrop: false,
dragMode: 'move',

ready: function (e) {
  //var cropper = this.cropper;
  console.log(e.type);
  
},
crop: function(e) {
    // Output the result data for cropping image.
    console.log(e.x);
    console.log(e.y);
    console.log(e.width);
    console.log(e.height);
    //console.log(e.rotate);
    //console.log(e.scaleX);
    //console.log(e.scaleY);
  }
};

function startCropper() {

// Destroy if already initialized
if ($canvas.data('cropper')) {
//  console.log('destroy');
  $canvas.cropper('destroy');
}

// Initialize a new cropper
$canvas.cropper(options);
//$canvas.cropper('clear');

//$canvas.cropper({
//  crop: function (e) {
//	console.log(e);
//  }
//});

}

function startCaman(url) {
caman = Caman('#canvas', url, function () {
  startCropper();
});
} 


$('#db').on('click', function () {
if (caman) {
  caman.brightness(-10).render(startCropper);
}

});

$('#ib').on('click', function () {
if (caman) {
  caman.brightness(20).render(startCropper);
}

});

$('#dc').on('click', function () {
if (caman) {
  caman.contrast(-20).render(startCropper);
}
});

$('#ic').on('click', function () {
if (caman) {
  caman.contrast(20).render(startCropper);
}
});

$('#resetButton').on('click', function () {
if (caman) {
  caman.reloadCanvasData();
  caman.revert(false);
  caman.render(startCropper);
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
	
 //$('#canvas').cropper('setCropBoxData', {width: 200, height: 300});
 $('#canvas').cropper('crop');
 
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
	
	//var contData = $canvas.cropper('getContainerData'); //Get container data
	//$canvas.cropper('setCropBoxData', contData); //set data
	
	//var xwidth = parseInt(539.7);
	//var xheight = parseInt(815);

	
	//var data = {width: 539.7, height: 815};
	//$canvas.cropper('setCropBoxData', {width: xwidth, height: xheight}); //set data  
		
	//var cropbox = $canvas.cropper('getCropBoxData');
	//$canvas.cropper('setCropBoxData', cropbox); //set data  
	
	//console.log(contData.height);
	//console.log(contData.width);
	
	//$('#canvas').cropper('crop');
	//$canvas.cropper('crop');
	
	//var cropbox = $canvas.cropper('getCropBoxData');
	
	//console.log(cropbox);

	var croppedcanvas = $canvas.cropper('getCroppedCanvas', {maxWidth: 4096, maxHeight: 4096, fillColor: "#ffffff"});
	
	
	var imageData = croppedcanvas.toDataURL('image/png');
	
	$('#getCroppedCanvasModal').modal().find('.showPic').attr('src', imageData);
	$('#getCroppedCanvasModal').modal('show');
	
	//$canvas.cropper('clear');
        
});

});