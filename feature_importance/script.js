////////////////////////////////////////////////////////////
//////////////////////// Set-Up ////////////////////////////
////////////////////////////////////////////////////////////

var margin = {left:90, top:90, right:50, bottom:90},
width = Math.min(window.innerWidth, 700) - margin.left - margin.right,
height = Math.min(window.innerWidth, 700) - margin.top - margin.bottom,
innerRadius = Math.min(width, height) * .39,
outerRadius = innerRadius * 1.1;

var Names = ['perimeter_worst',
 'radius_worst',
 'area_worst',
 'concave points_worst',
 'concave points_mean']
colors = ["#301E1E", "#083E77", "#342350", "#567235", "#8B161C"]
opacityDefault = 0.8;

var matrix = [


[0.000000,2.410758,2.284801,0.573336,0.617765],
[2.410407,0.000000,3.448015,0.510688,0.512774],
[2.283864,3.449586,0.000000,0.505781,0.481223],
[0.573271,0.508855,0.506148,0.000000,1.158727],
[0.616976,0.511754,0.481505,1.162123,0.000000]
];

////////////////////////////////////////////////////////////
/////////// Create scale and layout functions //////////////
////////////////////////////////////////////////////////////

var colors = d3.scale.ordinal()
.domain(d3.range(Names.length))
.range(colors);

var chord = d3.layout.chord()
.padding(.15)
.sortChords(d3.descending)
.matrix(matrix);

var arc = d3.svg.arc()
.innerRadius(innerRadius*1.01)
.outerRadius(outerRadius);

var path = d3.svg.chord()
.radius(innerRadius);

////////////////////////////////////////////////////////////
////////////////////// Create SVG //////////////////////////
////////////////////////////////////////////////////////////

var svg = d3.select("#chart").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")");

////////////////////////////////////////////////////////////
////////////////// Draw outer Arcs /////////////////////////
////////////////////////////////////////////////////////////

var outerArcs = svg.selectAll("g.group")
.data(chord.groups)
.enter().append("g")
.attr("class", "group")
.on("mouseover", fade(.1))
.on("fade_event",function (e) {
	
})
.on("mouseout", fade(opacityDefault));

outerArcs.append("path")
.style("fill", function(d) { return colors(d.index); })
.attr("d", arc)
.each(function(d,i) {
		//Search pattern for everything between the start and the first capital L
		var firstArcSection = /(^.+?)L/; 	

		//Grab everything up to the first Line statement
		var newArc = firstArcSection.exec( d3.select(this).attr("d") )[1];
		//Replace all the comma's so that IE can handle it
		newArc = newArc.replace(/,/g , " ");
		
		//If the end angle lies beyond a quarter of a circle (90 degrees or pi/2) 
		//flip the end and start position
		if (d.endAngle > 90*Math.PI/180 & d.startAngle < 270*Math.PI/180) {
			var startLoc 	= /M(.*?)A/,		//Everything between the first capital M and first capital A
				middleLoc 	= /A(.*?)0 0 1/,	//Everything between the first capital A and 0 0 1
				endLoc 		= /0 0 1 (.*?)$/;	//Everything between the first 0 0 1 and the end of the string (denoted by $)
			//Flip the direction of the arc by switching the start en end point (and sweep flag)
			//of those elements that are below the horizontal line
			var newStart = endLoc.exec( newArc )[1];
			var newEnd = startLoc.exec( newArc )[1];
			var middleSec = middleLoc.exec( newArc )[1];
			
			//Build up the new arc notation, set the sweep-flag to 0
			newArc = "M" + newStart + "A" + middleSec + "0 0 0 " + newEnd;
		}//if
		
		//Create a new invisible arc that the text can flow along
		svg.append("path")
		.attr("class", "hiddenArcs")
		.attr("id", "arc"+i)
		.attr("d", newArc)
		.style("fill", "none");
	});

////////////////////////////////////////////////////////////
////////////////////// Append Names ////////////////////////
////////////////////////////////////////////////////////////

//Append the label names on the outside
outerArcs.append("text")
.attr("class", "titles")
.attr("dy", function(d,i) { return (d.endAngle > 90*Math.PI/180 & d.startAngle < 270*Math.PI/180 ? 25 : -16); })
.append("textPath")
.attr("startOffset","50%")
.style("text-anchor","middle")
.style("font-size", "14px")
.attr("xlink:href",function(d,i){return "#arc"+i;})
.text(function(d,i){ return Names[i]; });

////////////////////////////////////////////////////////////
////////////////// Draw inner chords ///////////////////////
////////////////////////////////////////////////////////////

svg.selectAll("path.chord")
.data(chord.chords)
.enter().append("path")
.attr("class", "chord")
.style("fill", function(d) { return colors(d.source.index); })
.style("opacity", opacityDefault)
.attr("d", path)
.on("mouseover", mouseoverChord())
.on("mouseout", mouseoutChord(opacityDefault, opacityDefault));

////////////////////////////////////////////////////////////
////////////////// Extra Functions /////////////////////////
////////////////////////////////////////////////////////////

//Returns an event handler for fading a given chord group.
function fade(opacity) {
	return function(d,i) {
		svg.selectAll("path.chord")
		.filter(function(d) { return d.source.index != i && d.target.index != i; })
		.transition()
		.style("opacity", opacity);
	};
}

function fade_given_feat(feature_name){
	feature_index = Names.indexOf(feature_name);
	svg.selectAll("path.chord")
	.filter(function(d) { return d.source.index != feature_index && d.target.index != feature_index; })
	.transition()
	.style("opacity", 0.1);
}

function fade_given_feat(feature_name){
	feature_index = Names.indexOf(feature_name);
	svg.selectAll("path.chord")
	.filter(function(d) { return d.source.index != feature_index && d.target.index != feature_index; })
	.transition()
	.style("opacity", 0.1);
}

function fade_off(){
	svg.selectAll("path.chord")
	.transition()
	.style("opacity", opacityDefault);
}

function interaction (feat_name_up) {
	const fade_event = new CustomEvent("fade_event", {
		detail: {
			feat_name: feat_name_up
		}
	});
	document.dispatchEvent(fade_event);
	

}//fade

const b_off = document.getElementById("buttonoff");

document.addEventListener('fade_event', function(e) {
	
	fade_given_feat(e.detail.feat_name);
})


function interactionoff () {
	
	const fade_off_event = new CustomEvent("fade_off_event", {
		detail: {
			feat_name: "na"
		}
	});
	
	document.dispatchEvent(fade_off_event);

}

document.addEventListener('fade_off_event', function(e) {
	
	fade_off();
})

function mouseoverChord() {
	return function (d, i) {
		
		d3.select(this.ownerSVGElement)
		.selectAll("path.chord")
		.transition()
		.style("opacity", 0.1);
              //Show hovered over chord with full opacity
              d3.select(this).transition().style("opacity", 1);

              tippy_content = "<span style='font-weight:900'>" +
              Names[d.source.index] +
              "</span> and <span style='font-weight:900'>" +
              Names[d.target.index] +
              "</span><br> have a dependency score of <span style='font-weight:900'>" +
              d.source.value;

              if (this._tippy == null) {
              	tippy(this, {
              		allowHTML: true,
              		followCursor: true,
              		content: tippy_content,
              		size: "large",
              		arrow: true,
              	});
              }

          };

          } //fade


          //Bring all chords back to default opacity
          function mouseoutChord(opacityIn, opacityOut) {
          	return function (d, i) {
          		d3.select(this.ownerSVGElement)
          		.selectAll("path.chord")
          		.transition()
          		.style("opacity", opacityOut);
          	};
            //Set opacity back to default for all
          } //function mouseoutChord
