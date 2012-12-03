var times = {
	gadgetLoaded: now(),
	offset: 0
};

params.year = params.year || '2012';
params.contest = params.contest || 'president';

var $body = $('body');

var $window = $(window), ww = $window.width(), wh = $window.height();
var mapPixBounds;

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

var $window = $(window), ww = $window.width(), wh = $window.height();
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
	'</style>'
);

document.write(
	'<div id="outer">',
	'</div>',
	'<div id="maptip">',
	'</div>',
	'<a id="google-logo" class="logo" target="_blank" href="http://www.google.com/elections/ed/us/home" title="', T('googlePoliticsTitle'), '">',
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

var presidentialResult = {"presidentialoverview" : [{"NDC":"8","CPP":"0","GCPP":"0","UFP":"0","PNC":"0","PPP":"0","NPP":"0","REGION":"GREATER ACCRA","INDP":"0"},{"NDC":"0","CPP":"0","GCPP":"0","UFP":"0","PNC":"0","PPP":"0","NPP":"0","REGION":"NORTHERN REGION","INDP":"0"},{"NDC":"0","CPP":"0","GCPP":"0","UFP":"0","PNC":"0","PPP":"0","NPP":"0","REGION":"ASHANTI REGION","INDP":"0"},{"NDC":"0","CPP":"0","GCPP":"0","UFP":"0","PNC":"0","PPP":"0","NPP":"0","REGION":"BRONG AHAFO REGION","INDP":"0"},{"NDC":"0","CPP":"0","GCPP":"0","UFP":"0","PNC":"0","PPP":"0","NPP":"0","REGION":"CENTRAL REGION","INDP":"0"},{"NDC":"0","CPP":"0","GCPP":"0","UFP":"0","PNC":"0","PPP":"0","NPP":"0","REGION":"EASTERN REGION","INDP":"0"},{"NDC":"0","CPP":"0","GCPP":"0","UFP":"0","PNC":"0","PPP":"0","NPP":"0","REGION":"VOLTA REGION","INDP":"0"},{"NDC":"0","CPP":"0","GCPP":"0","UFP":"0","PNC":"0","PPP":"0","NPP":"0","REGION":"WESTERN REGION","INDP":"0"},{"NDC":"0","CPP":"0","GCPP":"0","UFP":"0","PNC":"0","PPP":"0","NPP":"0","REGION":"UPPER EAST","INDP":"0"},{"NDC":"0","CPP":"0","GCPP":"0","UFP":"0","PNC":"0","PPP":"0","NPP":"0","REGION":"UPPER WEST","INDP":"0"}]};
//$.getJSON("http://election-map-gh.appspot.com/vote-data?action=get", function(data){
//	presidentialResult = data;
//});

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
					_.map( [ 'president', 'paliamentary' ], button )
						.join(''),
				'</div>',
				
			'</div>',
			'<div id="legend">',
			'<div id="sidebar">',
			'<div class="sidebar-header">',
				'<div id="election-title" class="title-text">',
					
				'</div>',
				'<div id="auto-update" class="subtitle-text">',
					
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

function getAbbr(feature) {
	return abbr[feature.geojsonProperties.ID];
}

var candidatesNames = {
	'NDC': 'John Dramani Mahama',
	'NPP': 'Nana Addo Dankwa Akufo-Addo',	
	'PPP': 'Papa Kwesi Nduom',	
	'PNC': 'Hassan Ayariga',
	'CPP': 'Abu Sakara Foster',
	'INDP': 'John Dramani Mahama',
	'GCPP': 'John Dramani Mahama',
	'UFP': 'John Dramani Mahama',
};

var regions = {
	'GA': 'Greater Accra',
	'CR': 'Central',
	'WR': 'Western',
	'VR': 'Volta',
	'ER': 'Eastern',
	'AS': 'Ashanti',
	'BA': 'Brong Ahafo',
	'NR': 'Northern',
	'UW': 'Upper West',
	'UE': 'Upper East'
};

var abbr = abbr || {};
for ( j in regions) {
	abbr[regions[j]] = j;
}

var default_style = {
	strokeColor: "#333333",
	strokeOpacity: 1,
	strokeWeight: 2,
	fillColor: "#333333",
	fillOpacity: 0.25
};

var feature_map = {};
var feature_collection;

var contentString = '<div id="content">'+
'<div id="siteNotice">'+
'</div>'+
'<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
'<div id="bodyContent">'+
'<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
'sandstone rock formation in the southern part of the '+
'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
'south west of the nearest large town, Alice Springs; 450&#160;km '+
'(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
'features of the Uluru - Kata Tjuta National Park. Uluru is '+
'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
'Aboriginal people of the area. It has many springs, waterholes, '+
'rock caves and ancient paintings. Uluru is listed as a World '+
'Heritage Site.</p>'+
'<p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
'http://en.wikipedia.org/w/index.php?title=Uluru</a> '+
'(last visited June 22, 2009).</p>'+
'</div>'+
'</div>';



function createInfoContent1(region){
	var contentString = '<div class="tiptitlebar">'
	    +'<div style="float:left;">'
	    +'<span class="tiptitletext">'+region+'</span>'
	    +'</div><div style="clear:left;">'
	    +'</div><div class="tipreporting">100% reporting (481/481)</div></div>'
	    +'<div class="tipcontent"><table class="candidates" cellpadding="0" cellspacing="0">'
    +'<tbody><tr><th colspan="3" style="text-align:left; padding-bottom:4px;">Candidate</th>'
    +'<th style="text-align:right; padding-bottom:4px;">Votes</th><th style="text-align:right; padding-bottom:4px;"></th>'
    +'</tr><tr class="legend-candidate first" id="legend-candidate-Cynthia Lummis"><td class="left"></td>'
    +'<td><div class="candidate-name" style="margin-top:4px; margin-bottom:4px;"><div class="first-name">Cynthia</div>'
    +'<div class="last-name" style="font-weight:bold;">Lummis</div></div></td>'
    +'<td style="text-align:center;"><div style="margin:0px 0px 0px 0px;">'
    +'<div style="background:#EE0000; width:24px; height:24px; border:1px solid #C2C2C2"></div></div>'
    +'</td><td style="text-align:right; padding-left:6px;"><div class="candidate-percent">69.1%</div>'
    +'<div class="candidate-votes">165,773</div></td><td class="right" style="text-align:right; padding-left:6px;">'
    +'<div class="candidate-delegates"></div></td></tr><tr class="legend-candidate" id="legend-candidate-Chris Henrichsen">'
    +'<td class="left"></td><td><div class="candidate-name" style="margin-top:4px; margin-bottom:4px;">'
    +'<div class="first-name">Chris</div><div class="last-name" style="font-weight:bold;">Henrichsen</div>'
    +'</div></td><td style="text-align:center;"><div style="margin:5px 5px 5px 5px;">'
    +'<div style="background:#0000EE; width:14px; height:14px; border:1px solid #C2C2C2"></div></div>'
    +'</td> <td style="text-align:right; padding-left:6px;"><div class="candidate-percent">23.8%</div>'
    +'<div class="candidate-votes">57,148</div></td><td class="right" style="text-align:right; padding-left:6px;">'
    +'<div class="candidate-delegates"></div></td></tr><tr class="legend-candidate" id="legend-candidate-Richard Brubaker">'
    +'<td class="left"></td><td><div class="candidate-name" style="margin-top:4px; margin-bottom:4px;">'
    +'<div class="first-name">Richard</div><div class="last-name" style="font-weight:bold;">Brubaker</div>'
    +'</div></td><td style="text-align:center;"><div style="margin:9px 10px 10px 9px;">' 
    +'<div style="background:#592B02; width:5px; height:5px; border:1px solid #C2C2C2"></div></div></td>'
    +'<td style="text-align:right; padding-left:6px;"> <div class="candidate-percent">3.5%</div>'
    +'<div class="candidate-votes">8,398</div></td><td class="right" style="text-align:right; padding-left:6px;">'
    +'<div class="candidate-delegates"></div></td></tr></tbody></table></div>'
    +'<div class="click-for-local faint-text">Click for detailed results</div>';
	return contentString;
}

function sortCandidates(candidates){
	var cand = [];
	for(var k in candidates){
		if(k.toString() === "REGION"){
			continue;
		}
		cand.push([k.toString(), candidates[k]])
	}
	return cand;
}

function createInfoContent(region){
	var candidates = sortCandidates(region);
	
	var contentString = '<div class="tiptitlebar">'
	    +'<div style="float:left;">'
	    +'<span class="tiptitletext">'+region.REGION+'</span>'
	    +'</div><div style="clear:left;">'
	    +'</div><div class="tipreporting">100% reporting (481/481)</div>'
	    +'<table class="candidates" cellpadding="0" cellspacing="0">'
	    +'<tbody><tr><th colspan="3" style="text-align:left; padding-bottom:4px;">Candidate</th>'
	    +'<th style="text-align:right; padding-bottom:4px;">Votes</th>'
	    +'<th style="text-align:right; padding-bottom:4px;"></th></tr>'   
		
	    for(var c in candidates){
	    	var candidateName = candidatesNames[candidates[c][0]];	    	
	    	contentString = contentString + '<tr class="legend-candidate first" id="legend-candidate-"'+candidateName+'><td class="left"></td>';	    	
	    	contentString = contentString + '<td><div class="candidate-name" style="margin-top:4px; margin-bottom:4px;"><div class="first-name">'+candidateName.split(' ')[0]+'</div>';
	    	contentString = contentString + '<div class="last-name" style="font-weight:bold;">'+candidateName.split(' ')[1]+'</div></div></td>';
	    	contentString = contentString + '<td style="text-align:center;"><div style="margin:0px 0px 0px 0px;">'
	    	+'<div style="background:#EE0000; width:24px; height:24px; border:1px solid #C2C2C2"></div></div>'
	    	+'</td><td style="text-align:right; padding-left:6px;"><div class="candidate-percent">69.1%</div>'
	    	+'<div class="candidate-votes">165,773</div></td><td class="right" style="text-align:right; padding-left:6px;">'
    +'<div class="candidate-delegates"></div></td></tr>'		
	    }
	contentString = contentString + '</tbody></table></div>'
    +'<div class="click-for-local faint-text">Click for detailed results</div></div>';
	    
	return contentString;
}

var infowindow = new google.maps.InfoWindow();

function getRegionJSON(region){
	for(var i = 0; i< presidentialResult.presidentialoverview.length; i++){
		if(presidentialResult.presidentialoverview[i].REGION.toString().toLowerCase().indexOf(region.toLowerCase()) !== -1){
			return presidentialResult.presidentialoverview[i];
		}
	}
}

var tipOffset = { x:10, y:20 };
var $maptip = $('#maptip'), tipHtml;

function formatTip( feature ) {
	if( ! feature ) 
		return null;
	
	return createInfoContent(getRegionJSON(feature.geojsonProperties.ID));
	/*var contentString = '<div class="tiptitlebar">'
	    +'<div style="float:left;">'
	    +'<span class="tiptitletext"></span>'
	    +'</div><div style="clear:left;">'
	    +'</div><div class="tipreporting">100% reporting (481/481)</div></div>'
	    +'<div class="tipcontent"><table class="candidates" cellpadding="0" cellspacing="0">'
    +'<tbody><tr><th colspan="3" style="text-align:left; padding-bottom:4px;">Candidate</th>'
    +'<th style="text-align:right; padding-bottom:4px;">Votes</th><th style="text-align:right; padding-bottom:4px;"></th>'
    +'</tr><tr class="legend-candidate first" id="legend-candidate-Cynthia Lummis"><td class="left"></td>'
    +'<td><div class="candidate-name" style="margin-top:4px; margin-bottom:4px;"><div class="first-name">Cynthia</div>'
    +'<div class="last-name" style="font-weight:bold;">Lummis</div></div></td>'
    +'<td style="text-align:center;"><div style="margin:0px 0px 0px 0px;">'
    +'<div style="background:#EE0000; width:24px; height:24px; border:1px solid #C2C2C2"></div></div>'
    +'</td><td style="text-align:right; padding-left:6px;"><div class="candidate-percent">69.1%</div>'
    +'<div class="candidate-votes">165,773</div></td><td class="right" style="text-align:right; padding-left:6px;">'
    +'<div class="candidate-delegates"></div></td></tr><tr class="legend-candidate" id="legend-candidate-Chris Henrichsen">'
    +'<td class="left"></td><td><div class="candidate-name" style="margin-top:4px; margin-bottom:4px;">'
    +'<div class="first-name">Chris</div><div class="last-name" style="font-weight:bold;">Henrichsen</div>'
    +'</div></td><td style="text-align:center;"><div style="margin:5px 5px 5px 5px;">'
    +'<div style="background:#0000EE; width:14px; height:14px; border:1px solid #C2C2C2"></div></div>'
    +'</td> <td style="text-align:right; padding-left:6px;"><div class="candidate-percent">23.8%</div>'
    +'<div class="candidate-votes">57,148</div></td><td class="right" style="text-align:right; padding-left:6px;">'
    +'<div class="candidate-delegates"></div></td></tr><tr class="legend-candidate" id="legend-candidate-Richard Brubaker">'
    +'<td class="left"></td><td><div class="candidate-name" style="margin-top:4px; margin-bottom:4px;">'
    +'<div class="first-name">Richard</div><div class="last-name" style="font-weight:bold;">Brubaker</div>'
    +'</div></td><td style="text-align:center;"><div style="margin:9px 10px 10px 9px;">' 
    +'<div style="background:#592B02; width:5px; height:5px; border:1px solid #C2C2C2"></div></div></td>'
    +'<td style="text-align:right; padding-left:6px;"> <div class="candidate-percent">3.5%</div>'
    +'<div class="candidate-votes">8,398</div></td><td class="right" style="text-align:right; padding-left:6px;">'
    +'<div class="candidate-delegates"></div></td></tr></tbody></table></div>'
    +'<div class="click-for-local faint-text">Click for detailed results</div>';
	return contentString;*/
	
}

function moveTip( event ) {	
	if(!currentFeature){
		showTip( false );
	}
	if( ! tipHtml ) return;
	/*if( touch ) {
		if( ! touch.moveTip ) return;
		delete touch.moveTip;
	}*/
	var x = event.pageX, y = event.pageY;
	if(
		x < mapPixBounds.left  ||
		x >= mapPixBounds.right  ||
		y < mapPixBounds.top  ||
		y >= mapPixBounds.bottom
	) {
		showTip( false );
	}
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

function showTip( feature ) {
	tipHtml = formatTip( feature );
	if( tipHtml ) {
		$maptip.html( tipHtml ).show();
	}
	else {
		$maptip.hide();		
	}
}

var currentRegion = "";
var currentFeature = null;
function loadFeature( feature ) {	
	$body.bind( 'click mousemove', moveTip );
	// on click			
	google.maps.event.addListener(feature, 'click', function (e) {
		alert("TODO: Must show results summary for region - " + getAbbr(this));
 	});
	

	// on mouseover
 	google.maps.event.addListener(feature, 'mouseover', function (e) {
 		// use 'this' to access regions
		this.set('fillColor', "#e809a1");	
		currentFeature = this;
		showTip(this);
		moveTip(e);
		
		
		/*if(currentRegion === this.geojsonProperties.ID){
			infowindow.position = e.latLng;
			infowindow.open(map);
		}else{
			infowindow.content = createInfoContent(getRegionJSON(this.geojsonProperties.ID));
			infowindow.position = e.latLng;
			infowindow.open(map);
			currentRegion = this.geojsonProperties.ID;
		}*/

 	});

	// on mouseout
 	google.maps.event.addListener(feature, 'mouseout', function (e) {
 		// use 'this' to access regions
 		this.set('fillColor', default_style.fillColor);
 		currentFeature = null;
 		
 	});	

 	feature.setMap(map);
	feature_map[getAbbr(feature)] = feature;
}

function loadRegion( region, style ) {
	var feature;
	region = region || "";
	region = region.toUpperCase();
	style = style || default_style;

	if (!feature_map[region]) {
		// load once
		if (!feature_collection) {
			feature_collection = new GeoJSON( geojson, style );
		}	

		if (region) {
			for (var i = 0; i < feature_collection.length; i++) {
				if (abbr[feature_collection[i].geojsonProperties.ID] === region) {
					feature = feature_collection[i];
					break;
				}
			}
			if (!feature) {
				console.log("Region ", region , " was not found.");
				return;
			}
		} else {
			feature = feature_collection;
		}
	}	

	if (feature.length) {
		for (var i=0; i < feature.length; i++) {
			loadFeature(feature[i]);
		}		
	} else {
		loadFeature(feature);
	}
	//reloadTimer.set( loadView, opt.reloadTime );
}

function clearRegion( region ){
	if (!region) {
		for (var key in feature_map) {
			feature = feature_map[key];
			feature.setMap(null);
		}
	} else {
		feature = feature_map[region.toUpperCase()];
		feature.setMap(null);
	}
	//if (infowindow.getMap()){
	//	infowindow.close();
	//}
}

function loadView() {
	resizeViewOnly();
	initSelectors();
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
	
	// load ghana
	loadRegion();
}

initMap();
resizeViewOnly();

function initSelectors() {        		
	var $selectors = $('#selectors');
	$selectors.delegate( 'a.button', {
		click: function( event ) {
			params.contest = this.id.split('-')[1];
			$selectors.find('a.button').removeClass( 'selected' );
			$(this).addClass( 'selected' );			
			loadView();        				
		}
	});
}
             
$window
.bind( 'load', loadView )
.bind( 'resize', resizeViewOnly );

