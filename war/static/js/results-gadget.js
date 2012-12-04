function parseQuery( query ) {
	if( query == null ) return {};
	if( typeof query != 'string' ) return query;

	var params = {};
	if( query ) {
		var array = query.replace( /^[#?]/, '' ).split( '&' );
		for( var i = 0, n = array.length;  i < n;  ++i ) {
			var p = array[i].split( '=' ),
				key = decodeURIComponent( p[0] ),
				value = decodeURIComponent( p[1] );
			if( key ) params[key] = value;
		}
	}
	return params;
}

var params = parseQuery(location.search);

var opt = opt || {};

opt.writeScript = function( url, nocache ) {
	document.write(
		'<script src="',
			url,
			nocache ? '?' + (+new Date) : '',
			'">',
		'<\/script>' );
};

function loadStrings( strings ) {
	// There are more strings than templates, so copy templates to strings
	// but let strings override templates
	_.defaults( strings, templates );
	templates = strings;
	_.templateSettings.variable = 'v';
}

function setLanguage() {
	var defaultLanguage = 'en';
	var supportedLanguages = {
		en: true,
		es: true
	};
	var hl = ( params.hl || '' ).toLowerCase();
	if( ! hl  &&  acceptLanguageHeader != '{{acceptLanguageHeader}}' ) {
		var langs = acceptLanguageHeader.split(';')[0].split(',');
		for( var lang, i = -1;  lang = langs[++i]; ) {
			hl = lang.split('-')[0].toLowerCase();
			if( hl in supportedLanguages )
				break;
		}
	}
	if( !( hl in supportedLanguages ) )
		hl = defaultLanguage;
	params.hl = hl;
}
setLanguage();

function compileTemplate( template ) {
	var text = $.trim( template.replace( /\t/g, '' ) )
		.replace( /\{\{\{/g, '<%=v.' )
		.replace( /\{\{@/g, '<%' )
		.replace( /\{\{/g, '<%-v.' )
		.replace( /\}\}\}/g, '%>' )
		.replace( /\}\}/g, '%>' )
	return _.template( text );
}

function T( name, args ) {
	if( ! T.templates[name] ) {
		T.templates[name] = compileTemplate( templates[name] );
	}
	return T.templates[name]( args, { variable: 'v' } );
}
T.templates = {};

//opt.writeScript( 'static/js/jquery-1.8.3.min.js', opt.nocache );
opt.writeScript( '//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery' + ( opt.debug ? '.js' : '.min.js' ) );

opt.writeScript(
	'//maps.google.com/maps/api/js?v=3&sensor=false&language=' + params.hl + (
	/(^|\.)election-maps-ghana.appspot.com/.test(location.hostname) ?
		'&key=AIzaSyALGGJ7hXLfRs0Qer5nsteomzk5b212fqM' :
		''
	)
);

opt.writeScript( 'static/js/underscore.js', opt.nocache );
opt.writeScript( 'static/js/polygonzo.js', opt.nocache );
opt.writeScript( 'static/js/scriptino.js', opt.nocache );
opt.writeScript( 'static/js/GeoJSON.js', opt.nocache );
opt.writeScript( 'static/js/maps/gha.min.js', opt.nocache );
opt.writeScript( 'static/js/results-templates-gh.js', opt.nocache );
opt.writeScript( 'static/locale/lang-' + params.hl + '.js', opt.nocache );
opt.writeScript( 'static/js/results-data-gh.js', opt.nocache );
opt.writeScript( 'static/js/results-map-gh.js', opt.nocache );



