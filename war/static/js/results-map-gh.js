var times = {
	gadgetLoaded: now(),
	offset: 0
};

var DEBUG = true;

params.year = params.year || '2012';
params.contest = params.contest || 'president';

function cacheUrl( url ) {
	return opt.nocache ? S( url, '?q=', times.gadgetLoaded ) : url;
}

function imgUrl( name ) {
	return cacheUrl( 'static/images/' + name );
}

document.write(
	'<style type="text/css">',
		'html, body { margin:0; padding:0; border:0 none; }',
	'</style>'
);

var $body = $('body');
var $window = $(window), ww = $window.width(), wh = $window.height();
var mapPixBounds;
var sidebarWidth = 340;
opt.fontsize = '15px';

document.write(
	'<style type="text/css">',
		'html, body { width:', ww, 'px; height:', wh, 'px; margin:0; padding:0; overflow:hidden; color:#222; background-color:white; }',
		'#sidebar, #maptip, #testlabel, a.button { font-family: Arial,sans-serif; font-size: ', opt.fontsize, '; }',
		'a { font-size:13px; text-decoration:none; color:#1155CC; }',
		'a:hover { text-decoration:underline; }',
		//'a:visited { color:#6611CC; }',
		'a.button { display:inline-block; cursor:default; background-color:whiteSmoke; background-image:linear-gradient(top,#F5F5F5,#F1F1F1); border:1px solid #DCDCDC; border:1px solid rgba(0,0,0,0.1); border-radius:2px; box-shadow:none; color:#444; font-weight:bold; font-size:12px; height:27px; line-height:27px; padding:0 8px; -webkit-transition: all .218s; -moz-transition: all .218s; transition: all .218s;}',
		'a.button.hover, a.button:hover { background-color: #F6F6F6; background-image:linear-gradient(top,#F8F8F8,#F1F1F1); border:1px solid #C6C6C6; box-shadow:0px 1px 1px rgba(0,0,0,0.1); color:#222; z-index: 2; text-decoration: none !important; }',
		'a.button.selected { background-color: #EEE; background-image:linear-gradient(top,#EEE,#E0E0E0); border:1px solid #CCC; box-shadow:inset 0px 1px 2px rgba(0,0,0,0.1); color:#333; z-index: 2; }',
	        'a.segmented.button { border-radius: 0; text-align: center; padding: 0 8px; width: 80px; }',
	        'a.segmented.button.left { border-radius: 2px 0 0 2px; }',
	        'a.segmented.button.right { border-radius: 0 2px 2px 0; }',
	        'a.segmented.button.left + a.segmented.button, a.segmented.button + a.segmented.button, a.segmented.button.right { margin-left: -1px; }',
		'#outer {}',
		'.barvote { font-weight:bold; color:white; }',
		'div.topbar-header, div.sidebar-header { padding:3px; }',
		'div.title-text { font-size:16px; }',
		'div.subtitle-text { font-size:11px; color:#777; }',
		'div.body-text, div.body-text label { font-size:13px; }',
		'div.faint-text { font-size:12px; color:#777; }',
		'div.small-text, a.small-text { font-size:11px; }',
		'div.topbar-delegates { font-size:21px; line-height:21px; font-weight:bold; }',
		'body.narrow #topbar div.candidate-name { display:none; }',
		'#auto-update, #percent-reporting { margin: 0px 0px 8px 2px; }',
		'.content table { xwidth:100%; }',
		'.content .contentboxtd { width:7%; }',
		'.content .contentnametd { xfont-size:24px; xwidth:18%; }',
		'.content .contentbox { height:24px; width:24px; xfloat:left; margin-right:4px; }',
		'.content .contentname { white-space:pre; }',
		'.content .contentvotestd { text-align:right; width:5em; }',
		'.content .contentpercenttd { text-align:right; width:2em; }',
		'.content .contentvotes, .content .contentpercent { xfont-size:', opt.fontsize, '; margin-right:4px; }',
		'.content .contentclear { clear:left; }',
		'.content .contentreporting { margin-bottom:8px; }',
		'.content .contentreporting * { xfont-size:20px; }',
		'.content {}',
		'div.scroller { overflow:scroll; overflow-x:hidden; }',
		'div.scroller::-webkit-scrollbar-track:vertical { background-color:#f5f5f5; margin-top:2px; }',
		'div.scroller::-webkit-scrollbar { height:16px; width:16px; }',
		'div.scroller::-webkit-scrollbar-button { height:0; width:0; }',
		'div.scroller::-webkit-scrollbar-button:start:decrement, div.scroller::-webkit-scrollbar-button:end:increment { display:block; }',
		'div.scroller::-webkit-scrollbar-button:vertical:start:increment, div.scroller::-webkit-scrollbar-button:vertical:end:decrement { display:none; }',
		'div.scroller::-webkit-scrollbar-track:vertical, div.scroller::-webkit-scrollbar-track:horizontal, div.scroller::-webkit-scrollbar-thumb:vertical, div.scroller::-webkit-scrollbar-thumb:horizontal { border-style:solid; border-color:transparent; }',
		'div.scroller::-webkit-scrollbar-track:vertical { background-clip:padding-box; background-color:#fff; border-left-width:5px; border-right-width:0; }',
		'div.scroller::-webkit-scrollbar-track:horizontal { background-clip:padding-box; background-color:#fff; border-bottom-width:0; border-top-width:5px; }',
		'div.scroller::-webkit-scrollbar-thumb { -webkit-box-shadow:inset 1px 1px 0 rgba(0,0,0,.1),inset 0 -1px 0 rgba(0,0,0,.07); background-clip:padding-box; background-color:rgba(0,0,0,.2); min-height:28px; padding-top:100px; }',
		'div.scroller::-webkit-scrollbar-thumb:hover { -webkit-box-shadow:inset 1px 1px 1px rgba(0,0,0,.25); background-color:rgba(0,0,0,.4); }',
		'div.scroller::-webkit-scrollbar-thumb:active { -webkit-box-shadow:inset 1px 1px 3px rgba(0,0,0,.35); background-color:rgba(0,0,0,.5); }',
		'div.scroller::-webkit-scrollbar-thumb:vertical { border-width:0; border-left-width:5px; }',
		'div.scroller::-webkit-scrollbar-thumb:horizontal { border-width:0; border-top-width:5px; }',
		'div.scroller::-webkit-scrollbar-track:vertical { border-left-width:6px; border-right-width:1px; }',
		'div.scroller::-webkit-scrollbar-track:horizontal { border-bottom:1px; border-top:6px; }',
		'div.scroller::-webkit-scrollbar-thumb:vertical { border-width:0; border-left-width:6px; border-right-width:1px; }',
		'div.scroller::-webkit-scrollbar-thumb:horizontal { border-width:0; border-bottom:1px; border-top:6px; }',
		'div.scroller::-webkit-scrollbar-track:hover { -webkit-box-shadow:inset 1px 0 0 rgba(0,0,0,.1); background-color:rgba(0,0,0,.05); }',
		'div.scroller::-webkit-scrollbar-track:active { -webkit-box-shadow:inset 1px 0 0 rgba(0,0,0,.14),inset -1px -1px 0 rgba(0,0,0,.07); background-color:rgba(0,0,0,.05); }',
		'#maptip { position:absolute; z-index:10; border:1px solid #333; background:white; color:#222; white-space: nowrap; display:none; width:300px; }',
		'div.candidate-name { line-height:1em; }',
		'div.first-name { font-size:85%; }',
		'div.first-namep { font-size:100%; }',
		'#election-title { padding-left:3px; }',
		'body.tv #election-title { font-size:24px; font-weight:bold; }',
		'body.tv #election-date { font-size:16px; color:#222; }',
		'body.tv #percent-reporting { font-size:20px; }',
		'body.tv div.candidate-name { margin-right:20px; }',
		'body.tv div.candidate-name div { line-height:1.1em; }',
		'body.tv div.first-name { font-size:20px; }',
		'body.tv div.last-name { font-size:24px; font-weight:bold; }',
		'body.tv #maptip { border:none; }',
		'body.tv #map { border-left:1px solid #333; }',
		'body.tv span.tiptitletext { font-size:28px; }',
		'body.tv div.tipreporting { font-size:20px; }',
		'body.tv table.candidates td { padding:4px 0; }',
		'.tiptitlebar { padding:4px 8px; border-bottom:1px solid #AAA; }',
		'.tiptitletext { font-weight:bold; font-size:120%; }',
		'.tipcontent { padding:4px 8px 8px 8px; border-bottom:1px solid #AAA; }',
		'.tipreporting { font-size:80%; padding:2px 0; }',
			//'#selectors { background-color:#D0E3F8; }',
			// '#selectors, #selectors * { font-size:14px; }',
		'#selectors label { font-weight:bold; }',
		'#selectors, #legend { width:100%; }',
		'#selectors option.disabled { color:#BBB; }',
		'body.sidebar { background-color:white; }',
		'body.tv #legend { margin-top:8px; }',
		'body.sidebar #selectors, body.sidebar #legend { width:', sidebarWidth, 'px; }',
		'#sidebar table.candidates { width:100%; }',
	         '#sidebar td.right { width: 30%; }',
		'table.candidates td { border-top:1px solid #E7E7E7; }',
		'table.candidates tr.zero { display:none; }',
		'#maptip table.candidates { width:100%; }',
		'#maptip table.candidates tr.first td { border-top:none; }',
		'#maptip div.candidate-delegates { font-size:120%; }',
		'#maptip div.candidate-percent { font-weight:bold; }',
		'#maptip div.candidate-votes { font-size:80%; }',
		'#maptip div.click-for-local { padding:4px; }',
		'body.tv #maptip div.candidate-percent { font-size:20px; font-weight:bold; }',
		'#sidebar-scroll { padding:0 4px; }',
	        '#sidebar #legend-candidate-top div.legend-candidate { color: #777; font-size: 11px; }',
		'tr.legend-candidate td, tr.legend-filler td { border:1px solid white; }',
		'div.legend-candidate, div.legend-filler { font-size:13px; padding:6px 4px; }',
			//'body.tv div.legend-candidate, body.tv div.legend-filler { font-size:22px; }',
		'body.web div.legend-candidate { color:#333; }',
		'body.tv div.legend-candidate, body.tv div.legend-filler { font-size:21px; font-weight:bold; }',
		'td.legend-filler { border-color:transparent; }',
		//'tr.legend-candidate td { width:20%; }',	
		'tr.legend-candidate td { cursor:pointer; }',
		'tr.legend-candidate.hover td, tr.legend-candidate:hover td { background-color:#F6F6F6; border: 1px solid #F6F6F6; border-top:1px solid #D9D9D9; border-bottom: 1px solid #D9D9D9; -webkit-transition: all 0.218s; -moz-transition: all 0.218s; transition: all 0.218s; }',
		'tr.legend-candidate.hover td.left, tr.legend-candidate:hover td.left { border-left: 1px solid #D9D9D9; -webkit-transition: all 0.218s; -moz-transition: all 0.218s; transition: all 0.218s; }',
		'tr.legend-candidate.hover td.right, tr.legend-candidate:hover td.right { border-right: 1px solid #D9D9D9; -webkit-transition: all 0.218s; -moz-transition: all 0.218s; transition: all 0.218s; }',
		'tr.legend-candidate.selected td { background-color: #EEE; border: 1px solid #EEE; border-top: 1px solid #CCC; border-bottom: 1px solid #CCC; -webkit-transition: all 0.218s; -moz-transition: all 0.218s; transition: all 0.218s; }',
		'tr.legend-candidate.selected td.left { border-left: 1px solid #CCC; }',
		'tr.legend-candidate.selected td.right { border-right: 1px solid #CCC; }',
	        'div.legend-candidate-bar { margin-top: -1px; }',
	        'div.legend-candidate-bar-outline { border: 1px solid #D4D4D4; background-color: #fff; }',
	        'div.legend-candidate-bar-fill { height: 7px; }',
	        'div.legend-candidate-primary { font-size: 15px; color: #777; }',
	        'tr.legend-candidate.selected div.legend-candidate-primary { color: #444; }',
	        'div.legend-candidate-secondary { font-size: 11px; color: #777; }',
	        'tr.legend-candidate.selected div.legend-candidate-secondary { color: #444; }',
	        'div.legend-candidate-primary + div.legend-candidate-secondary { margin-top: -2px; }',
	        'div.legend-candidate-secondary + div.legend-candidate-primary { margin-top: -2px; }',
	        '#sidebar td.right div.legend-candidate-primary { margin-top: -1px; padding-bottom: 2px; }',
	        '#sidebar td.winner div { padding: 0 };',
		'span.legend-candidate-color { font-size:15px; }',
		'#sidebar span.legend-candidate-color { font-size:16px; }',
		'body.tv span.legend-candidate-color { font-size:18px; }',
		'#centerlabel, #centerlabel * { font-size:12px; xfont-weight:bold; }',
		'#spinner { z-index:999999; position:absolute; left:', Math.floor( ww/2 - 64 ), 'px; top:', Math.floor( wh/2 - 20 ), 'px; }',
		'#error { z-index:999999; position:absolute; left:4px; bottom:4px; border:1px solid #888; background-color:#FFCCCC; font-weight:bold; padding:6px; }',
		'a.logo { position:absolute; bottom:24px; width:48px; height:48px;}',
		'#gop-logo { right:64px; width:48px; background: url(', imgUrl('gop-nv-48.png'), ') no-repeat; }',
		'body.source-ap #gop-logo { display:none; }',
		'#ap-logo { right:64px; width:41px; background: url(', imgUrl('ap-logo-48x41.png'), ') no-repeat; }',
		'body.source-gop #ap-logo { display:none; }',
		'#google-logo { right:4px; background: url(', imgUrl('google-politics-48.png'), ') no-repeat; }',
		'#gop-logo { right:64px; width:48px; background: url(', imgUrl('gop-nv-48.png'), ') no-repeat; }',
		'body.hidelogo #gop-logo, body.hidelogo #ap-logo { right:4px; }',
		'body.hidelogo #google-logo { display:none; }',
		'body.ie7 #gop-logo, body.ie7 #ap-logo { right:4px; }',
		'body.ie7 #google-logo, body.ie7 #linkToMap { display:none; }',
		'#testlabel { position:absolute; left: ', sidebarWidth + 32, 'px; top: 2px; font-size: 24px; font-weight:bold; color:red; text-shadow: 0 0 4px white, 0 0 8px white, 0 0 12px white, 0 0 12px white; }',
		 // custom layouts
		'tr.candidate-row:hover { background-color: #eeeeee; }',
		'#subregion_div { width:815px; font-family:Helvetica; font-size:14px; display: none;',
		'position:absolute; background:#fff; z-index:1001; }',
		'#subregion_title { padding: 10px; padding-left:15px; }',
		'#subregion_title a { text-decoration:none; color:#111;}',
		'#subregion_title a:hover { text-decoration:underline; }',
		'#subregion ul { list-style: none; float: left; padding:0px 15px;',
			'border-right: solid #eeeeee thin; width:240px;}',
		'#subregion li { list-style: none; word-wrap:break-word; color: #08C; padding:5px 5px;}',
		'#subregion li:hover { background-color:#eee; cursor: pointer;}',
		'#subregion li.selected-region:hover,',
		'#subregion li.selected-region { background-color:#08C; font-weight:bold; color:#fff; cursor: auto;}',
		'#lightbox { display: none; position:absolute; left:0; top:0; z-index: 1000;',
		'min-width:100%; min-height: 100%; background-color: #000;opacity: 0.8;filter:alpha(opacity=90);}',
	'</style>'
);

document.write(
	'<div id="outer">',
	'</div>',
	'<div id="maptip">',
	'</div>',
	'<a id="google-logo" class="logo" target="_blank" href="http://www.google.com.gh/elections/ed/gh" title="', T('googlePoliticsTitle'), '">',
	'</a>',
	'<div id="error" style="display:none;">',
	'</div>',
	'<div id="testlabel" style="display:none;">',
		T('testData'),
	'</div>',
	'<div id="spinner">',
		'<img border="0" style="width:128px; height:128px;" src="', imgUrl('spinner-124.gif'), '" />',
	'</div>'
);

function renderConstituencies(region, results) {	
	
	var names = [];
	for (var k in results) {
		names.push(k);
	}
	
	names.sort(function(a, b){
	    /* 
	       We avoid reuse of arguments variables in a sort
	       comparison function because of a bug in IE <= 8.
	       See http://www.zachleat.com/web/array-sort/
	    */
	    var va = (a === null) ? "" : "" + a;
	    var vb = (b === null) ? "" : "" + b;
	    return va > vb ? 1 : ( va === vb ? 0 : -1 );
	});

	var contentString = S(
		'<div id="lightbox"></div>',
		'<div id="subregion_div" style="outline:thin black solid">',
			'<div id="subregion_title">',
				'<div style="display:inline-block;font-weight:bold;border-bottom:solid thin #ccc;">',
					'Constituencies for ',region.toUpperCase(), ' REGION',
				'</div>',
				'<div style="float:right; padding-right:20px;">',
					'<a href="#">Click to Close</a>',
				'</div>',
			'</div>',
			'<div id="subregion">'
	);

	// generate list of constituencies
	for (var i=0; i < names.length; i++) {
		if ((i % 12) === 0) {	
			if (i !== 0) {
				contentString = S(contentString, '</ul>');
			}
			contentString = S(contentString,'<ul class="sublist">');
		}
		contentString = S(contentString, '<li>',names[i],'</li>');
	}
	contentString = S(contentString, '</ul></div>');
	$body.append( contentString );	
	initConstituencyEvents( results );
}

//clear border of last list
function initConstituencyEvents( results ) {
	
	$('#subregion ul:last').css('border','none');
	$("#subregion li").on('click', function () {
		var $currentItem  = $(this);				
		var $sidebar = $('<ul></ul>');
		var items = $("#subregion li");	

		$.each(items, function (key,value) {
			$(value).off('click').on('click', function () {		
				$("#subregion li").removeClass('selected-region');
				$(value).addClass('selected-region');								
				var $result_div = $('#constituency_result_div').empty();
				var candidates = getTopCandidates(convertToCandidates(results[$(this).text()]), 'votes', 24);
				$result_div.hide();
				$result_div.html(createInfoContent($(this).text(), candidates));
				$result_div.find('.click-for-local').remove();	
				$result_div.find('.tiptitletext').text($(this).text());
				$result_div.find('table').css('width','100%');
				$result_div.css({
					'width': '400px',
					'margin-left': '40px',
					'margin-top': '10px',
					'font-size': '14px'
				});
				$result_div.show();
			});
			$sidebar.append(value);
		});

		$('ul.sublist').remove();
		$sidebar.css({'height': '400px','width':'250px', 'overflow': 'auto',
			'border':'thin outset #ccc', 'margin-left':'10px','float':'left'});		
		
		$('#subregion').html($sidebar)
			.append('<div id="constituency_result_div" style="float:left"></div>')
			.append('<div style="clear:both"></div>');
		
		var padding = 200; // total padding
		$sidebar.animate({scrollTop: $currentItem.offset().top-padding},'slow');
		$currentItem.trigger('click');
	});	

	// setup light box
	$('#lightbox, #subregion_title a').click( function() {
		$("#lightbox, #subregion_div").fadeOut(300, function () {		
			$("#subregion li").unbind();
			$('#lightbox, #subregion_title a, #subregion_div').unbind().remove();
		});
	});

	// load and show
	var $subregion_div = $('#subregion_div');
	var top = ($(window).height() - $subregion_div.height()) / 3;
	var left = ($(window).width() - $subregion_div.width()) / 2;
	top = top + "px";
	left = left + "px";
	$subregion_div.css({'top':top, 'left':left});
	$("#subregion_div, #lightbox").fadeIn(300);
}


function formatCandidatesConstituency() {
	// TODO: perform calculations and get results in correct format
	var region = currentFeature.geojsonProperties.ID.toLowerCase();
	loadResult('constituency', region, function (result) {				
		// aggregate results for each constituency	
		renderConstituencies(region, result);
	});	
}


var presidentialResult = {
	"GREATER ACCRA":{"NDC":8,"CPP":1,"GCPP":0,"UFP":10,"PNC":0,"PPP":0,"NPP":7,"INDP":1},
	"NORTHERN":{"NDC":2,"CPP":2,"GCPP":1,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":12},
	"ASHANTI":{"NDC":12,"CPP":3,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},
	"BRONG AHAFO":{"NDC":34,"CPP":4,"GCPP":67,"UFP":23,"PNC":77,"PPP":67,"NPP":0,"INDP":0},
	"CENTRAL":{"NDC":9,"CPP":5,"GCPP":6,"UFP":2,"PNC":9,"PPP":5,"NPP":8,"INDP":6},
	"EASTERN":{"NDC":4,"CPP":6,"GCPP":1,"UFP":4,"PNC":3,"PPP":6,"NPP":4,"INDP":8},
	"VOLTA":{"NDC":13,"CPP":7,"GCPP":32,"UFP":52,"PNC":5,"PPP":33,"NPP":55,"INDP":19},
	"WESTERN":{"NDC":5,"CPP":8,"GCPP":7,"UFP":4,"PNC":2,"PPP":5,"NPP":2,"INDP":5},
	"UPPER EAST":{"NDC":7,"CPP":9,"GCPP":6,"UFP":7,"PNC":3,"PPP":4,"NPP":3,"INDP":8},
	"UPPER WEST":{"NDC":2,"CPP":10,"GCPP":3,"UFP":7,"PNC":8,"PPP":4,"NPP":9,"INDP":6}
};
var paliamentaryResult = {
	"VOLTA":{"NDC":0,"URP":0,"CPP":0,"GFP":0,"NDP":0,"PNC":0,"PPP":0,"YPP":0,"NVP":0,"NPP":0,"INDP":0},
	"GREATER ACCRA":{"NDC":0,"IPP":0,"URP":0,"CPP":0,"DPP":0,"NDP":0,"PNC":0,"PPP":0,"NVP":0,"NPP":1,"INDP":0},
	"WESTERN":{"NDC":0,"CPP":0,"NDP":0,"PPP":0,"PNC":0,"NPP":0,"INDP":0},
	"UPPER WEST":{"NDC":0,"URP":0,"CPP":0,"DPP":0,"NDP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},
	"UPPER EAST":{"NDC":0,"CPP":0,"NDP":0,"PPP":0,"PNC":0,"NPP":0,"INDP":0},
	"ASHANTI":{"NDC":0,"CPP":0,"IPP":0,"DPP":0,"GCPP":0,"NDP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},
	"CENTRAL":{"NDC":0,"URP":0,"CPP":0,"DPP":0,"NDP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},
	"BRONG AHAFO":{"NDC":0,"URP":0,"CPP":0,"MDC":0,"NDP":0,"PARTY":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},
	"NORTHERN":{"NDC":0,"IPP":0,"CPP":0,"DPP":0,"NDP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},
	"EASTERN":{"CPP":0,"IPP":0,"GCPP":0,"NDP":0,"PPP":0,"NPP":0,"INDP":0,"NDC":0,"GFP":0,"DPP":0,"PNC":0,"NVP":0}
};

var presidentialConstituency = {"KETA":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"ANLO":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"KETU SOUTH":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"KETU NORTH":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"AKATSI  SOUTH":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"AKATSI  NORTH":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"SOUTH TONGU":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"CENTRAL TONGU":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"NORTH TONGU":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"ADAKLU":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"AGOTIME -ZIOPE":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"HO CENTRAL":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"HO WEST":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"SOUTH DAYI":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"NORTH DAYI":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"KPANDO":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"HOHOE":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"AFADJATO SOUTH":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"BUEM":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"BIAKOYE":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"AKAN":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"KRACHI EAST":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"KRACHI WEST":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"KRACHI  NCHUMURU":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"NKWANTA SOUTH":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},"NKWANTA NORTH":{"NDC":0,"CPP":0,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0}}
var parliamentaryConstituency = {"ABETIFI":{"NDC":[0,"SAMUEL ASAMOAH"],"NPP":[0,"PETER WIAFE PEPERA"]},"ABIREM":{"NDC":[0,"MAVIS AMA FRIMPONG"],"NPP":[0,"ESTHER OBENG DAPAAH"],"PPP":[0,"AGYEMANG E PREMPEH"]},"ABUAKWA NORTH":{"NDC":[0,"VICTOR EMMANUEL SMITH"],"NPP":[0,"JOSPEH BOAKYE DANQUAH ADU"]},"ABUAKWA SOUTH":{"NDC":[0,"SANUSI MOHAMMED"],"NPP":[0,"SAMUEL ATTA AKYEA"],"INDP":[0,"NAN ADDO AIKINS"]},"ACHIASE":{"NDC":[0,"DR. KWASI AKYEM APEA-KUBI"],"NPP":[0,"ROBERT KWASI AMOAH"],"NDP":[0,"CHARLES KWABENA KURANKYE"]},"AFRAM PLAINS NORTH":{"NDC":[0,"EMMANUEL BOAKYE DIDIEYE"],"NPP":[0,"JEFFREY KONADU ADDO"],"PPP":[0,"KWAO LAWER ABRAHAM"]},"AFRAM PLAINS SOUTH":{"NDC":[0,"JOSEPH APPIAH BOATENG"],"NPP":[0,"ADONGO ANTHONY"],"CPP":[0,"DARFOUR JANET"],"INDP":[0,"AHALIGAH RAPHAEL KOFI"]},"AKIM ODA":{"NDC":[0,"KWABENA NKANSAH ASARE"],"NPP":[0,"WILLIAM AGYAPONG QUAITTOO"],"PPP":[0,"KOFI ASAMOAH -SIAW"],"NDP":[0,"ANINAKWAH JOSHUA KWABENA"],"INDP":[0,"AUGUSTUS ENNIN ATTAFUAH"],"INDP":[0,"BAA ABORA"],"INDP":[0,"KOFI ASARE"]},"AKIM SWEDRU":{"NDC":[0,"ROBERT SAMUEL ANSAH"],"NPP":[0,"KENNEDY OSEI NYARKO"],"PPP":[0,"AKWASI AMANKWAH MARFO"],"NDP":[0,"GODWIN BOADI"],"INDP":[0,"JOSEPH AMPOMAH BOSOMPEM"]},"AKUAPEM SOUTH":{"NDC":[0,"WILLIAM NTOW BOAHENE"],"NPP":[0,"OSEI BONSU AMOAH"],"PPP":[0,"MICHEAL ASANTE"],"CPP":[0,"ISAAC OPARE ADDO"]},"AKWAPIM NORTH":{"NDC":[0,"MRS MARGARET ANSAH"],"NPP":[0,"WILLIAM OFORI BOAFO"],"PPP":[0,"KWAKU FREDUA- AGYEMAN"],"CPP":[0,"JOSEPH AKORKOR KWASI SAKYIMANTE"],"PNC":[0,"BEATRICE ADDO"],"NDP":[0,"ALHAJI MOHAMMED MUFTAO SEIDU"],"INDP":[0,"EDWARD YEHONU AKAKPO"]},"AKWATIA":{"NDC":[0,"EBABA JAMAL AHMED"],"NPP":[0,"DR. KOFI ASARE"],"PPP":[0,"FELIX SETH LARBI"]},"ASENE/ AKROSO/ MANSO":{"NDC":[0,"RICHARD ROLAND ACQUAH"],"NPP":[0,"YAW OWUSU BOATENG"],"PPP":[0,"NYARKO OFORI DANIEL"],"NDP":[0,"SINTIM KWADWO TANOH"]},"ASUOGYAMAN":{"NDC":[0,"ASARE AKOTO JOSES"],"NPP":[0,"KOFI OSEI-AMEYAW"],"PPP":[0,"REV SOLOMON OBUOBI"],"PNC":[0,"SLANZY ATSU WORNAH"],"CPP":[0,"MENSAH ALBERT CORBLA"],"NDP":[0,"DWAMENA BEKOE"]},"ATIWA EAST":{"NDC":[0,"ASANTE FOSTER"],"NPP":[0,"ABENA OSEI ASARE"],"PPP":[0,"BOATENG OKYERE"],"NVP":[0,"GEORGE PADMORE APRAKU"]},"ATIWA WEST":{"NDC":[0,"EMMANUEL ATTA TWUM"],"NPP":[0,"KWASI AMOAKO ATTAH"]},"AYENSUANO":{"NDC":[0,"MICHAEL S.D KODUA"],"NPP":[0,"AYEH PAYE SAMUEL"],"PPP":[0,"PRINCE TK MENYEH"]},"FANTEAKWA NORTH":{"NDC":[0,"ABASS FUSEINI SBAABE"],"NPP":[0,"KWABENA AMANKWA ASIAMAH"],"PPP":[0,"NKANSAH AMOS"],"NDP":[0,"ODAME KWAME DARKWA"]},"FANTEAKWA SOUTH":{"NDC":[0,"DR KOFI AGYARKO- DANQUAH"],"NPP":[0,"KOFI OKYERE-AGYEKUM"],"PPP":[0,"GODFRED MARK DANKWAH NYARKO"],"NDP":[0,"CHAM GABRIEL"]},"KADE":{"NDC":[0,"GEORGE AGYEMANG DUAH"],"NPP":[0,"OFOSU ASAMOAH"],"PPP":[0,"TURKSON EBENEZER"],"INDP":[0,"ERIC NTIRI MENSAH"]},"LOWER MANYA KROBO":{"NDC":[0,"EBENEZER OKLETEY"],"GCPP":[0,"ATTER JOSEPH KORLEY"],"NPP":[0,"DEDO AGYARKO KUSI"],"PPP":[0,"JOASHUA TETTEH NARH"],"PNC":[0,"PETER TEYE BATSA"],"CPP":[0,"FOSTER OKLEY"],"INDP":[0,"MICHEAL TEYE NYAUNU"]},"MPRAESO":{"NDC":[0,"JOSEPH OMARI"],"NPP":[0,"SETH KWAME ACHEAMPONG"],"PPP":[0,"BOATENG KENNETH AMPADU"],"PNC":[0,"KWAKU ASANTE"],"CPP":[0,"SEMEFAH MAWUTOR"],"NDP":[0,"ALBERT BAMFO"]},"NEW JAUBEN SOUTH":{"NDC":[0,"DR. KWAKU OWUSU- ACHEAPONG"],"NPP":[0,"DR. MARK ASSIBEY-YEBOAH"],"PPP":[0,"DR. ENOCK ANSAH"],"PNC":[0,"NANA OBOADIE BOATENG BONSU"],"CPP":[0,"COLLINS AGYEI OTENG"],"IPP":[0,"HEFASOULNIA AKYEA MENSAH BROWN"]},"OFOASE/ AYIREBI":{"NDC":[0,"TOM KENNETH BUDU"],"NPP":[0,"DAVID OPPONG KUSI"],"PPP":[0,"DENNIS TERCHI- DUKU"],"CPP":[0,"RAYNOLDS Y. AMOAKO"],"INDP":[0,"APPIAH JERRY ASIEDU"]},"UPPER MANYA KROBO":{"NDC":[0,"JEFF KAVIANU"],"NPP":[0,"MOSES TETTEH BERIMAH"],"PPP":[0,"FRED TEYE TETTEH"],"PNC":[0,"GIDEON KPABITEY"],"CPP":[0,"RUDOLF NARH YOHUNO"],"GFP":[0,"AYER THEOPHILUS"],"NDP":[0,"NICHOLAS TETTEH"],"INDP":[0,"DJEMBI JOHN"]},"LOWER WEST AKIM":{"NDC":[0,"MARTIN BRUCE OPARE"],"NPP":[0,"KLENAM GIFTY"],"PPP":[0,"ANDREWS OFORI DARKO"],"PNC":[0,"ABDUL KARIM YAHUZA MOHAMMED AWAL"],"CPP":[0,"MUHAMMED OSMAN"],"DPP":[0,"NYEDUA KOFI EVANS"],"INDP":[0,"DJENON STEPHEN JAMES"]},"NEW JUABENG NORTH":{"NDC":[0,"ISAAC LIVINGSTONE ASAMOAH"],"NPP":[0,"KWASI BOATENG ADJEI"],"PPP":[0,"AMAKYE KWAME ELVIS"],"CPP":[0,"FRANK ODURO"],"NDP":[0,"ISAAC OTCHERE AMPOFO"],"INDP":[0,"GABRIEL NORGAH"],"INDP":[0,"ADUTWUM-ADDO AUGUSTINE SEXTUS"]},"NKAWKAW":{"NDC":[0,"ALEX SOMUAH OBENG"],"NPP":[0,"ERIC KWAKYE DARFOUR"],"PPP":[0,"ADDO OLIVIA"]},"NSAWAM/ ADOAGYIRI":{"NDC":[0,"BEN OHENE AYEH"],"NPP":[0,"FRANK ANNOH DOMPREH"],"PPP":[0,"NICK EMMANUEL AFARI- ARTHUR"],"PNC":[0,"BARAHAMA IMURANA AHMED"],"CPP":[0,"ESSUMAN NANA AKOM KOFI COLLINS"]},"OKERE":{"NDC":[0,"GEORGE OPARE ADDO"],"NPP":[0,"DANIEL BOTWE"],"PPP":[0,"ASANTE SOLOMON ROGER"],"CPP":[0,"KWABENA OWUSU-DARKO"],"NDP":[0,"BERNICE AMOAH ODOI"],"INDP":[0,"VITAARSHIE YAW"]},"SUHUM":{"NDC":[0,"JULIUS DEBRAH"],"NPP":[0,"FREDERICK OPARE -ANSAH"],"PNC":[0,"JACOB KWAKU ARKOH"],"NDP":[0,"DALE NETTEY- MARBELL"],"INDP":[0,"MATILDA DOCCUVI"]}};

var resultCache = {};
var baseUrl = 'http://election-map-gh.appspot.com/vote-data?';

function loadResult( scope, region, callback ) {
	
	var value;
	var testResult;
	
	callback = callback || region || scope;
	if (scope !== 'overview' && scope !== 'constituency') {
		region = typeof scope === 'string'? scope : region;
		scope = 'overview';
	}
		
	if ( typeof callback !== "function" ) return;
	
	if ( params.contest === 'president' ){
		value = 'presidential-' + scope;
		if ( DEBUG ) {
			testResult = (scope === 'overview')? presidentialResult : presidentialConstituency;
		}
	} else {
		value = 'parliamentary-' + scope;
		if ( DEBUG ) {
			testResult = (scope === 'overview')? paliamentaryResult : parliamentaryConstituency;
		}
	}
	
	var query = "action=get&value=" + value;
	
	if (typeof region === "string") {
		if (scope === 'constituency') {
			region = region.replace(" ","+");
			query = query + "&region=" + region;
		} else if (resultCache[query]) { // scope == 'overview'
			callback(resultCache[query][region.toUpperCase()]);
			return;
		}		
	}
	
	if ( resultCache[query] ) {
		callback(resultCache[query]);
		return;
	}
	
	$.getJSON( baseUrl + query, function( data ) {
		resultCache[query] = data;
		if (scope === 'overview' && typeof region === 'string') {
			data = resultCache[query][region.toUpperCase()];
		}
		callback(data);
		console.log(status, ': reqeust completed');
		
	}).error( function( jqXHR, status ) {
		// show error message
		console.log(status, ': could not complete request');
		if (DEBUG) {			
			resultCache[query] = testResult;
			if (scope === 'overview' && typeof region === 'string') {
				data = resultCache[query][region.toUpperCase()];
			}
			callback(testResult);
		}
	});
}

function contentTable() {
	function button( contest, index, contests ) {
		return S(
			'<a class="segmented button', 
                                index == 0 ? ' left' : '',
                                index == contests.length - 1 ? ' right' : '',
				params.contest == contest ? ' selected' : '',
				'" id="btn-', contest,
				'" title="', T( 'clickFor-' + contest ),
			'">',
				T( contest + 'Button' ),
			'</a>'
		);
	}
	return S(
		'<div>',
			'<div id="selectors">',
				'<div style="margin:0; padding:4px;">',
					_.map( [ 'president', 'parliamentary' ], button )
						.join(''),
				'</div>',
				
			'</div>',
			'<div id="legend">',
			'<div id="sidebar" style="border-right:solid #dddddd 1px">',
			'<div class="sidebar-header">',
				'<div id="election-title" class="title-text">',
					T('title'),
				'</div>',
				'<div id="auto-update" class="subtitle-text">',	
					T('subtitle'),
				'</div>',
				'<div id="sidebar-results-header">',
					
				'</div>',
			'</div>',
			'<div class="scroller" id="sidebar-scroll">',
				
				'<div id="map-link" class="small-text" style="padding:8px 4px 4px 4px;">',
					
				'</div>',
			'</div>',
		'</div>',
			
			'</div>',
			'<div style="width:100%;">',
				'<div id="map" style="width:100%; height:100%;">',
				'</div>',
			'</div>',
		'</div>'
	);
}

function formatLegendTable( cells ) {
	function filler() {
		return S(
			'<td class="legend-filler">',
				'<div class="legend-filler">',
					'&nbsp;',
				'</div>',
			'</td>'
		);
	}
	function row( cells ) {
		return S(
			'<tr>',
				cells.length ? cells.join('') : filler(),
			'</tr>'
		);
	}
	return S(
		'<table cellpadding="0" cellspacing="0" style="width:100%; vertical-align:middle;">',
			row( cells.slice( 0, 5 ) ),
			row( cells.slice( 5 ) ),
		'</table>'
	);
}

function getParties(resultsJson){
	var parties = {};
	var i = 0;
	for (k in resultsJson) {
		region = resultsJson[k];
		for(p in region){
			parties[p] = 0;
			i = i+ 1;
		}
	}
	return parties;
}

function formatCandidatesTotal(resultsJson) {
	//var parties = {};	
	
	var parties = getParties(resultsJson);
	
	// aggregate votes per party
	for (k in resultsJson) {
		region = resultsJson[k];
		for (p in region) {
			parties[p] = parties[p] + region[p];
		}
	}
	
	cand = getTopCandidates(convertToCandidates(parties),'votes',0);	
	if(params.contest === 'president') {
		var contentString = S(
			'<div>',
			'<table class="candidates" cellpadding="8px" cellspacing="0">',
				'<tbody><tr><th style="text-align:left; padding-bottom:4px;">Candidate</th>',
				'<th style="text-align:right; padding-bottom:4px;"></th>',
				'<th style="text-align:center; padding-bottom:4px;">Votes</th></tr>'
		);
	
		for(var c in cand) {
			var candidateInfo = candidatesInfo[cand[c].party];	   
			contentString = S(
					contentString,
					'<tr class="left candidate-row">',
					'<td>',					
						'<div style="float:left; padding-right:10px; margin-top:8px">', formatDivColorPatch(cand[c].color, 14, 14, 1), '</div>',
						'<div style="float:left" class="candidate-name" style="margin-top:4px; margin-bottom:4px;">',
							'<div class="first-name">',candidateInfo.firstName,'</div>',
							'<div class="last-name" style="font-weight:bold;">',candidateInfo.lastName,'</div>',
							'</div>',
							'</td>',
						'<td align="left"><b>',cand[c].party,'</b></td>',
					'<td align="center">',
						'<div class="candidate-percent">',formatPercent(cand[c].vsAll),'</div>',
						'<div class="candidate-votes">',formatNumber(cand[c].votes),'</div>',
					'</td>',
					'</tr>'				
			);	
		}		
	}else{
		var contentString = S(
				'<div>',
				'<table class="candidates" cellpadding="8px" cellspacing="0">',
					'<tbody><tr><th style="text-align:left; padding-bottom:4px;">Party</th>',
					'<th style="text-align:right; padding-bottom:4px;"></th>',
					'<th style="text-align:center; padding-bottom:4px;">Seats</th></tr>'
			);
		
		for(var c in cand) {
			var candidateInfo = candidatesInfo[cand[c].party];	   
			contentString = S(
					contentString,
					'<tr class="left candidate-row">',
					'<td>',					
						'<div style="float:left; padding-right:10px; margin-top:0px">', formatDivColorPatch(cand[c].color, 14, 14, 1), '</div>',
						'<div style="float:left" class="candidate-name" style="margin-top:4px; margin-bottom:4px;">',
							'<div class="first-namep"><b>',cand[c].party,'</b></div>',
							//'<div class="last-name" style="font-weight:bold;">',candidateInfo.lastName,'</div>',
							'</div>',
							'</td>',
						'<td align="left"><b></b></td>',
					'<td align="center">',
						'<div class="candidate-percent">',formatPercent(cand[c].vsAll),'</div>',
						'<div class="candidate-votes">',formatNumber(cand[c].votes),'</div>',
					'</td>',
					'</tr>'				
			);	
		}		
	}
	contentString = S(contentString, '</tbody></table></div>');
	return contentString;
}

$('#outer').html( contentTable() );

var map;
var useSidebar;
function setSidebar() {
	//useSidebar = ( state != stateUS );
	useSidebar = true;
	$body.toggleClass( 'sidebar', useSidebar );
}

setSidebar();

function resizeViewOnly() {
	// TODO: refactor with duplicate code in geoReady()
	ww = $window.width();
	wh = $window.height();
	$body
		.css({ width: ww, height: wh })
		.toggleClass( 'hidelogo', mapWidth < 140 )
		.toggleClass( 'narrow', ww < 770 );
	
	$('#spinner').css({
		left: Math.floor( ww/2 - 64 ),
		top: Math.floor( wh/2 - 20 )
	});
	
	var mapLeft = 0, mapTop = 0, mapWidth = ww, mapHeight = wh;
	if( useSidebar ) {
		mapLeft = sidebarWidth;
		mapWidth -= mapLeft;
		var $sidebarScroll = $('#sidebar-scroll');
		$sidebarScroll.height( wh - $sidebarScroll.offset().top );
	}
	else {
		var topbarHeight = $('#topbar').height() + 1;
		mapTop = topbarHeight;
		mapHeight -= mapTop;
	}
	mapPixBounds = $('#map')
		.css({
			position: 'absolute',
			left: mapLeft,
			top: mapTop,
			width: mapWidth,
			height: mapHeight
		})
		.bounds();
}

function getScript( url ) {
	var timeout = 15 * 1000;
	$.ajax({
		url: url,
		dataType: 'script',
		cache: true,
		timeout: timeout,
		error: function( jqXHR, textStatus, errorThrown ) {
			if( textStatus == 'timeout' ) {
				getScript( url );
			}
			else {
				setTimeout( function() {
					getScript( url );
				}, timeout );
			}
		}
	});
}

function getGeoJSON( url ) {
	reloadTimer.clear();
	$('#spinner').show();
	getScript( cacheUrl( url ) );
}

var default_style = {
	strokeColor: "#333333",
	strokeOpacity: 1,
	strokeWeight: 2,
	fillColor: "#333333",
	fillOpacity: 0.5
};

var feature_collection;
var currentFeature, prevFeature, candidates;

function formatCandidateAreaPatch( candidate, max ) {
	var vsTop = candidate.vsTop;
	if(isNaN(vsTop)) vsTop = 0;
	var size = Math.round( Math.sqrt( vsTop ) * max );
	var margin1 = Math.floor( ( max - size ) / 2 );
	var margin2 = max - size - margin1;
	
	var color = candidate.color || '#FFFFFF';  // TEMP
	return S(
		'<div style="margin:', margin1, 'px ', margin2, 'px ', margin2, 'px ', margin1, 'px;">',
			formatDivColorPatch( color, size, size ),
		'</div>'
	);
}

function formatDivColorPatch( color, width, height, border ) {
	border = border || '1px solid #C2C2C2';
	return S(
		'<div style="background:', color, '; width:', width, 'px; height:', height, 'px; border:', border, '">',
		'</div>'
	);
}

function formatPercent( n ) {
	if(isNaN(n)) n = 0;
	return percent1( n, T('decimalSep') );
}

function formatNumber( nStr ) {
	var dsep = T('decimalSep'), tsep = T('thousandsSep');
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? dsep + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while( rgx.test(x1) ) {
		x1 = x1.replace( rgx, '$1' + tsep + '$2' );
	}
	return x1 + x2;
}

function createInfoContent(region, candidates){
	if ( params.contest === 'president' ){
		var contentString = S(
			'<div class="tiptitlebar">',
			'<div style="float:left;">',
			'<span class="tiptitletext">'+region+' Region</span>',
			'</div><div style="clear:left;">',
			'</div><div class="tipreporting">100% reporting (481/481)</div>',
			'<table class="candidates" cellpadding="0" cellspacing="0">',
			'<tbody><tr><th colspan="3" style="text-align:left; padding-bottom:4px;">Candidate</th>',
			'<th style="text-align:right; padding-bottom:4px;">Votes</th>',
			'<th style="text-align:right; padding-bottom:4px;"></th></tr>'
		);
		
		for(var c in candidates) {
			var candidateInfo = candidatesInfo[candidates[c].party];	    	
			contentString = S(
				contentString,
				'<tr class="legend-candidate first" id="legend-candidate-"', candidateInfo.fullName, '><td class="left"></td>',	    	
				'<td><div class="candidate-name" style="margin-top:4px; margin-bottom:4px;"><div class="first-name">',candidateInfo.firstName+'</div>',
				'<div class="last-name" style="font-weight:bold;">', candidateInfo.lastName, '</div></div></td>',
				'<td style="text-align:center;">', formatCandidateAreaPatch(candidates[c], 24),
				'</td><td style="text-align:right; padding-left:6px;"><div class="candidate-percent">',formatPercent(candidates[c].vsAll),'</div>',
				'<div class="candidate-votes">',formatNumber(candidates[c].votes),'</div></td><td class="right" style="text-align:right; padding-left:6px;">',
				'<div class="candidate-delegates"></div></td></tr>'	
			);
		}
	} else {
		var contentString = S(
				'<div class="tiptitlebar">',
				'<div style="float:left;">',
				'<span class="tiptitletext">'+region+' Region</span>',
				'</div><div style="clear:left;">',
				'</div><div class="tipreporting">100% reporting (481/481)</div>',
				'<table class="candidates" cellpadding="0" cellspacing="0">',
				'<tbody><tr><th colspan="3" style="text-align:left; padding-bottom:4px;">Party</th>',
				'<th style="text-align:right; padding-bottom:4px;">Seats</th>',
				'<th style="text-align:right; padding-bottom:4px;"></th></tr>'
			);
			
			for(var c in candidates) {				    	
				contentString = S(
					contentString,
					'<tr class="legend-candidate first" id="legend-candidate-"', candidates[c].party, '><td class="left"></td>',	    	
					'<td><div class="candidate-name" style="margin-top:4px; margin-bottom:4px; font-size:100%"><div class="first-name"><b>',candidates[c].party+'</b></div>',
					//'<div class="last-name" style="font-weight:bold;">', candidates[c].party, '</div></div></td>',
					'<td style="text-align:center;">', formatCandidateAreaPatch(candidates[c], 24),
					'</td><td style="text-align:right; padding-left:6px;"><div class="candidate-percent">',formatPercent(candidates[c].vsAll),'</div>',
					'<div class="candidate-votes">',formatNumber(candidates[c].votes),'</div></td><td class="right" style="text-align:right; padding-left:6px;">',
					'<div class="candidate-delegates"></div></td></tr>'	
				);
			}
	}
	contentString = S(contentString, '</tbody></table></div><div class="click-for-local faint-text">Click for detailed results</div>');	    
	return contentString;
}

function getRegionJSON(region){
	for(var k in results){
		if(k.toString().toLowerCase().indexOf(region.toLowerCase()) !== -1){
			return results[k];			
		}
	}
}

var tipOffset = { x:10, y:20 };
var $maptip = $('#maptip'), tipHtml;

function formatTip( region ) {
	loadResult(region, function (result) {
		if (currentFeature != prevFeature) {
			candidates = getTopCandidates(convertToCandidates(result), 'votes', 24);
		}
	});	
	return createInfoContent(region, candidates);
}

function moveTip( event ) {	
	
	if( ! showTip() ) return;
	
	var x = event.pageX, y = event.pageY;
	x += tipOffset.x;
	y += tipOffset.y;
	var pad = 2;
	var width = $maptip.width(), height = $maptip.height();
	var offsetLeft = width + tipOffset.x * 2;
	var offsetTop = height + tipOffset.y * 2;
	
	if( x + width > ww - pad ) {
		x -= width + pad + tipOffset.x * 2;
	}
	if( x < pad ) {
		x = pad;
	}
	
	if( y + height > wh - pad )
		y -= height + pad + tipOffset.y * 2;
	if( y < pad )
		y = wh - pad - height - tipOffset.y * 2;
	
	$maptip.css({ left:x, top:y });
}

function showTip() {
	
	if( currentFeature ) {
		candidates = null;
		tipHtml = formatTip( currentFeature.geojsonProperties.ID );
		$maptip.html( tipHtml ).show();
		return true;
	}
	else {
		$maptip.hide();	
		return false;
	}
}

function loadFeatures( result ) {
	clearFeatures();
	// load once
	$("#sidebar-results-header").html(formatCandidatesTotal( result ));
	
	if(!feature_collection){
		feature_collection = new GeoJSON( geojson, default_style );
	}
	
	var feature, cand, color, region;

	for (var i=0; i < feature_collection.length; i++) {
		feature = feature_collection[i]
		region = feature.geojsonProperties.ID.toUpperCase();
		cand = getTopCandidates(convertToCandidates(result[region]), 'votes', 24);
		color = (cand[0].votes && cand[0].votes > 0) ? cand[0].color : null;
		
		// on click			
		google.maps.event.addListener(feature, 'click', function (e) {		
			formatCandidatesConstituency();
	 	});
		
		// on mouseover
	 	google.maps.event.addListener(feature, 'mouseover', function (e) {
	 		// use 'this' to access regions	
	 		prevFeature = currentFeature;
			currentFeature = this;
			moveTip(e);
	 	});

		// on mouseout
	 	google.maps.event.addListener(feature, 'mouseout', function (e) {
	 		// use 'this' to access regions
	 		currentFeature = null; 		
	 	});	
	 	
	 	$body.bind( 'mousemove', moveTip );
	 	feature.set('fillColor', color || default_style.fillColor);
	 	feature.setMap(map);	
	}
	
	initSelectors();
	//reloadTimer.set( loadView, opt.reloadTime );
}

function clearFeatures(){
	if(feature_collection) {
		var feature;
		for(var i = 0; i< feature_collection.length; i++){
			feature = feature_collection[i];
			google.maps.event.clearInstanceListeners(feature);
			feature.setMap(null);			
		}
	}
}

function loadView() {
	loadResult('overview', loadFeatures);
	$('#spinner').hide();
}

var mapStyles = [
 {
     stylers: [ { saturation: -25 } ]
 },{
     featureType: "road",
     elementType: "labels",
     stylers: [ { visibility: "off" } ]
 },{
      featureType: "road",
      elementType: "geometry",
      stylers: [ { lightness: 50 }, { saturation: 10 }, { visibility: "simplified" } ]
 },{
      featureType: "transit",
      stylers: [ { visibility: "off" } ]
  },{
      featureType: "landscape",
      stylers: [ { lightness: 100 }, { saturation: -100 } ]
  },{
      featureType: "administrative",
      elementType: "geometry",
      stylers: [ { visibility: "off" } ]
  },{
      featureType: "administrative.country",
      elementType: "labels",
      stylers: [ { visibility: "off" } ]    
  },{
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ lightness: 60 }]
  }
];

gm = google.maps;  gme = gm.event;

function initMap() {
	$('#map').show();
	mapPixBounds = $('#map').bounds();
	var myOptions = {
		mapTypeControl: false,
		mapTypeId: 'simple',
		streetViewControl: false,
		panControl: false,
		rotateControl: false,	
		zoomControl: false,
		draggable:true,
		scrollWheel: true,
		disableDoubleClickZoom: false,
		zoom: 7,
		center: new google.maps.LatLng(8,-1),
    };
   
    map = new gm.Map($('#map')[0], myOptions);    
    var mapType = new gm.StyledMapType( mapStyles );
	map.mapTypes.set( 'simple', mapType );		
}

loadView();
initMap();
resizeViewOnly();


var $selectors;
function initSelectors() {	
	if (!$selectors) {
		$selectors = $('#selectors a.button');
		$selectors.bind('click', function( event ) {
			$body.unbind();		
			$selectors.removeClass( 'selected' );
			$(this).addClass( 'selected' );
			params.contest = this.id.split('-')[1];
			loadView();
		});
	}
}

$window.bind( 'load', loadView ).bind( 'resize', resizeViewOnly );

