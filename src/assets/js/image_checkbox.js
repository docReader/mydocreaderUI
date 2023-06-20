// init the state from the input
//$(".image-checkbox").each(function () {
//	if ($(this).find('input[type="checkbox"]').first().attr("checked")) {
//		$(this).addClass('image-checkbox-checked');
		
//	} else {
//		$(this).removeClass('image-checkbox-checked');
		
//	}
//});

// sync the state to the input
$(".image-checkbox").on("click", function (e) {
	
	$('.image-checkbox').not(this).removeClass('image-checkbox-checked');
	$('input[type=checkbox]:checked').not(this).prop("checked", false);
	$('input[type=checkbox]').not(this).attr("checked", false);
	
	//$(this).toggleClass('image-checkbox-checked');	
	$(this).addClass('image-checkbox-checked');	
	var $checkbox = $(this).find('input[type="checkbox"]');
	$checkbox.prop("checked", true);
	$checkbox.attr("checked","checked");

	e.preventDefault();
	
	var val = $checkbox.val();
	
});

$(document).ready(function () {
    $('input[type=submit]').click(function() {
      checked = $("input[type=checkbox]:checked").length;

      if(!checked) {
        alert("You must check at least one image.");
        return false;
      }

    });
});

