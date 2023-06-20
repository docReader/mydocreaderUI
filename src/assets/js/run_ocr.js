
function run_ocr(ocr_model, char_seg, spell_checker, fileid, filename, apply_template, mode){
		
		$( "#dialog" ).dialog({
		  minWidth: 1000, modal: true
		});
		
		document.getElementById("step1").classList.add("active");
		
		var level, chars;
		
		if(ocr_model == 'word') { 
		level = '1';
		}else if(ocr_model == 'char') { 
		level = '2';
		}else{
		level = '3';
		}

		if(char_seg == 'contour') { 
		chars = '1';
		}else if(char_seg == 'pixel') { 
		chars = '2';
		}else{
		chars = '0';
		}

		var callBackFileName_docx = fileid + '_l' +  level + '_c' + chars + '_s' +spell_checker+'.docx';
		var callBackFileName_txt = fileid + '_l' +  level + '_c' + chars + '_s' +spell_checker+'.txt'; 
		
		//console.log(apply_template);
		
		document.getElementById("step2").classList.add("active");
			
		$.ajax({    //create an ajax request to call layout json
        type: "POST",
        url: "layoutapi.php",
		data: { fileid: fileid },
        //dataType: "json",   //expect json to be returned
        success: function(response1){                    
            
            console.log(response1);
			var response_layoutjson = response1;
			
			document.getElementById("step3").classList.add("active");
			
			document.getElementById("step4").classList.add("active");
			
			$.ajax({    //create an ajax request to call pipeline json
			type: "POST",
			url: "pipelineapi.php",
			data: { fileid: fileid, filename: filename, ocr_model: ocr_model, char_seg:char_seg, spell_checker:spell_checker, response_layoutjson: response_layoutjson},
			//dataType: "json",   //expect json to be returned
			success: function(response2){                    
				
				console.log(response2);
				document.getElementById("step5").classList.add("active");
				var response_pipeline = response2;
				
				if(apply_template == '1'){ //apply formatting is Yes
				
					$.ajax({    //create an ajax request to call convertdocx json
					type: "POST",
					url: "convertdocxapi.php",
					data: { fileid: fileid, response_pipeline: response_pipeline, callBackFileName: callBackFileName_docx},
					success: function(response3){                    
						
						console.log(response3);
						document.getElementById("step6").classList.add("active");
						$( "#dialog" ).dialog( "close" );
						
						if(mode == 'details'){
						location.href='process.php?id='+fileid+'';	
						}else{
						location.href='mobile.php?id='+fileid+'&s=p';	
						}
						
						
					}
					}); //convertdocxapi
				
				} else { //apply formatting is No
				
					$.ajax({    //create an ajax request to call convertrawtext
					type: "POST",
					url: "convertrawtextapi.php",
					data: { fileid: fileid, response_pipeline: response_pipeline, callBackFileName: callBackFileName_txt},
					success: function(response3){                    
						
						console.log(response3);
						document.getElementById("step6").classList.add("active");
						$( "#dialog" ).dialog( "close" );
						
						if(mode == 'details'){
						location.href='process.php?id='+fileid+'';	
						}else{
						location.href='mobile.php?id='+fileid+'&s=p';	
						}
						
					}
					}); //convertrawtext
									
				}
				
			},
			error: function(response){
                console.log('error');
			}
			
			
			}); //pipelineapi
        }
		
		}); //layoutapi
		
}