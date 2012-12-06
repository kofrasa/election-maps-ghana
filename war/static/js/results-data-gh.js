var candidatesInfo = {
	NDC: { color: '#20FF1F', firstName: 'John Dramani', lastName: 'Mahama', fullName: 'John Dramani Mahama'},
	NPP: { color: '#FFFA00', firstName: 'Nana Addo Dankwa', lastName: 'Akufo-Addo', fullName: 'Nana Addo Dankwa Akufo-Addo'},
	PPP: { color: '#E4Af95', firstName: 'Papa Kwesi', lastName: 'Nduom', fullName: 'Papa Kwesi Nduom'},
	PNC: { color: '#FF1300', firstName: 'Hassan', lastName: 'Ayariga', fullName: 'Hassan Ayariga'},
	CPP: { color: '#8A5C2E', firstName: 'Abu Sakara', lastName: 'Foster', fullName: 'Abu Sakara Foster'},
	INDP: { color: '#EE00B5', firstName: 'Jacob Osei', lastName: 'Yeboah', fullName: 'Jacob Osei Yeboah'},
	GCPP: { color: '#1700E8', firstName: 'Herbert', lastName: 'Lartey', fullName: 'Herbert Lartey'},
	UFP: { color: '#336633', firstName: 'Akwasi Addai', lastName: 'Odike', fullName: 'Akwasi Addai Odike'}	
}

function Candidate(party, constituency, votes ) {
    this.party = party || '';
    this.constituency = constituency || 'Ghana';
    this.votes = votes || 0;    
    this.vsAll = null;
    this.vsTop = null;
    
    
    if(candidatesInfo[party] == null){
    	this.color = '#336633';
    }else{
    	this.color = candidatesInfo[party].color;
    }
}

function convertToCandidates(json){
	var candidates = [];
	for(var k in json){
		candidates.push(new Candidate(k, null, json[k]));
		
	}	
	return candidates;	
}


function getTopCandidates( candidates, sortBy, max ) {
		max = max || Infinity;
		if( ! candidates ) return [];

		// Clone the candidate list
		var top = [];
		// TODO(mg): It's possible at this point that result.candidates is either
		// an object, or an array.  This next bit is a total kludge.
		// Note: experimenting with clone vs. shallow reference
		if (candidates.length) {
			for( var i = 0; i < candidates.length; i++ ) {
				top.push( _.clone( candidates[i] ) );
			}
		} else {
			// It's a map, treat it as such:
			for( var name in candidates ) {
				top.push( _.clone( candidates[name] ) );
			}
		}
		var total = { votes: 0, electoralVotes: 0 };
		
		// Use trends data if applicable, and calculate total votes
		_.each( top, function( candidate ) {
			//if( params.contest == 'president' )
				//setCandidateTrendsVotes( result.id, candidate, sortBy );
			total.votes += candidate.votes;
		});
		
		// Calculate the relative fractions now that the total is available
		_.each( top, function( candidate ) {
			
			candidate.vsAll = candidate.votes / total.votes;
		});
		
		
		// Sort by a specified property and then by votes, or just by votes
		var sorter = sortBy;
		if( sortBy != 'votes' ) {
			sorter = function( candidate ) {
				var ev = candidate[sortBy] || 0;
				if( isNaN(ev) ) ev = 0;  // temp workaround it should not be NaN
				return ( ev * 1000000000 ) + candidate.votes ;
			};
		}
		top = sortArrayBy( top, sorter, { numeric:true } );
		
		// Sort in descending order and trim
		top = top.reverse().slice( 0, max );
		while( top.length  &&  ! top[top.length-1].votes && top.length >= 5 && params.contest !== 'president')
			top.pop();
		
		// Finally can compare each candidate with the topmost
		if( top.length ) {
			var most = top[0].votes;
			_.each( top, function( candidate ) {
				candidate.vsTop = candidate.votes / most;
			});
		}
		
		return top;
}