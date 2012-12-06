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
		'tr.candidate-row:hover { background-color: #eeeeee; }',
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

function renderConstituencyStyles() {
	var styles = S(
		'<style>'
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
	document.write(styles);
}
renderConstituencyStyles();

var presidentialResult = {
	"GREATER ACCRA":{"NDC":8,"CPP":1,"GCPP":0,"UFP":10,"PNC":0,"PPP":0,"NPP":7,"INDP":1},
	"NORTHERN REGION":{"NDC":2,"CPP":2,"GCPP":1,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":12},
	"ASHANTI REGION":{"NDC":12,"CPP":3,"GCPP":0,"UFP":0,"PNC":0,"PPP":0,"NPP":0,"INDP":0},
	"BRONG AHAFO REGION":{"NDC":34,"CPP":4,"GCPP":67,"UFP":23,"PNC":77,"PPP":67,"NPP":0,"INDP":0},
	"CENTRAL REGION":{"NDC":9,"CPP":5,"GCPP":6,"UFP":2,"PNC":9,"PPP":5,"NPP":8,"INDP":6},
	"EASTERN REGION":{"NDC":4,"CPP":6,"GCPP":1,"UFP":4,"PNC":3,"PPP":6,"NPP":4,"INDP":8},
	"VOLTA REGION":{"NDC":13,"CPP":7,"GCPP":32,"UFP":52,"PNC":5,"PPP":33,"NPP":55,"INDP":19},
	"WESTERN REGION":{"NDC":5,"CPP":8,"GCPP":7,"UFP":4,"PNC":2,"PPP":5,"NPP":2,"INDP":5},
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

presidentialConstituency = {
	
};
var results;
function loadResult(){
	var value;
	if(params.contest === 'president'){
		value = 'presidential-overview';
		results = presidentialResult;
	}else{
		value = 'paliamentary-overview';
		results = paliamentaryResult;
	}
	
	$.getJSON("http://election-map-gh.appspot.com/vote-data?action=get&value="+value, function(data){
		results = data;
	});
}
loadResult();

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
	if(params.contest === 'president'){
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


function formatCandidatesConstituency(resultsJson) {
	// aggregate results for each constituency
	
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

var feature_map = {};
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
	if(params.contest === 'president'){
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
	}else{
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
	contentString = S(contentString, '</tbody></table></div><div class="click-for-local faint-text">Click for detailed results</div></div>');
	    
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

function formatTip() {
	if( ! currentFeature ) {
		candidates = null;
		return null;
	}
	if (currentFeature != prevFeature) {
		candidates = getTopCandidates(convertToCandidates(getRegionJSON(currentFeature.geojsonProperties.ID)), 'votes', 24);
	}
	return createInfoContent(currentFeature.geojsonProperties.ID, candidates);
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
	tipHtml = formatTip();
	if( tipHtml ) {
		$maptip.html( tipHtml ).show();
		return true;
	}
	else {
		$maptip.hide();	
		return false;
	}
}

function loadFeature( feature, color ) {

	// on click			
	google.maps.event.addListener(feature, 'click', function (e) {

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
 		//this.set('fillColor', default_style.fillColor);
 		currentFeature = null; 		
 	});	
 	
 	$body.bind( 'click mousemove', moveTip );
 	feature.set('fillColor', color || default_style.fillColor);
 	feature.setMap(map);
}

function loadRegion( region, style ) {	
	clearFeatures();
	var feature;
	var cand;
	var color;
	region = region || "";
	region = region.toUpperCase();
	style = style || default_style;
	
	// load once
	$("#sidebar-results-header").html(formatCandidatesTotal(results));
	
	if(!feature_collection){
		feature_collection = new GeoJSON( geojson, style );
	}
	for (var i=0; i < feature_collection.length; i++) {
		feature = feature_collection[i]
		cand = getTopCandidates(convertToCandidates(getRegionJSON(feature.geojsonProperties.ID)), 'votes', 24);
		color = (cand[0].votes && cand[0].votes > 0) ? cand[0].color : null;
		loadFeature(feature, color);		
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
	loadResult();
	loadRegion();
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
             
$window
.bind( 'load', loadView )
.bind( 'resize', resizeViewOnly );

