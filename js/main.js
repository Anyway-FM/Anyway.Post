//~Init
var input_username = getUrlParam('n');
if (input_username) {
	var username = input_username;
}
else {
	username = '';
}

// Plese replace thie token if you want to build your own website, it can be easily acquired at https://dribbble.com/account/applications/new
$.jribbble.setToken('100400edb732244793f860de54501028f367ef1387feecf4553bef0f1b014dee');

//~Profile & Diligence & Influence
$.jribbble.users(username).then(function(user) {
	
	//~Avatar
	var html_avatar = [];	
	html_avatar.push('<img src="' + user.avatar_url + '" alt="' + user.name + '">');
	$('.profile-avatar').html(html_avatar.join(''));
	
	//~Name
	var html_name = [];
	user_alias = user.name;
	html_name.push('<a href="' + user.html_url + '">' + user.name + '</a>');
	$('.user-name').html(html_name.join(''));
	
	//~Total Shots
	var html_total_shots = [];
	html_total_shots.push(user.shots_count);
	$('.user-shots').html(html_total_shots.join(''));
	
	//~Total Comments
	var html_total_comments = [];
	var crs = toThousands(user.comments_received_count);
	html_total_comments.push(crs);
	$('.user-total-comments').html(html_total_comments.join(''));
	
	//~Total Faves
	var html_total_favs = [];
	var lrc = toThousands(user.likes_received_count);
	html_total_favs.push(lrc);
	$('.user-total-favs').html(html_total_favs.join(''));
	
	var x = new Date(user.created_at).getTime() / 31536000000;
	var y = new Date().getTime() / 31536000000;
	z = y - x;
	
	//~Total Years
	var html_total_years = [];
	html_total_years.push( z.toFixed(1) );
	$('.user-years').html(html_total_years.join(''));
	
	diligence = user.shots_count / z / 12 / 48;
	diligence = distribute(diligence,0.2);
		
	influence = user.followers_count / (y - x) / 20000;
	influence = distribute(influence,0.15);
	
	//~Diligence
	var html_diligence = [];
	html_diligence.push(diligence);
	$('.diligence-score').html(html_diligence.join(''));
	
	//Influence
	var html_influence = [];
	html_influence.push(influence);
	$('.influence-score').html(html_influence.join(''));
	
	summary();
	
});

//~Appreciation and Engagement
var total_views = 0;
var total_favs = 0;
var total_buckets = 0;
var total_comments = 0;
var total_rebounds = 0;

$.jribbble.users(username).shots({per_page: 20}).then(function(shots) {

	shots.forEach(function(shot) {
		total_views += shot.views_count;
		total_favs += shot.likes_count;
		total_comments += shot.comments_count;
		total_buckets += shot.buckets_count;
		total_rebounds += shot.rebounds_count;
	});
	
	//~Appreciation

	if ( total_views == 0) {
		appreciation = 0;
	}
	else {
		appreciation = ( total_favs + total_buckets * 20) / total_views;
	}
	appreciation = distribute(appreciation, 0.28);
	
	
	var html_appreciation = [];
	html_appreciation.push(appreciation);
	$('.appreciation-score').html(html_appreciation.join(''));
	
	//~Engagement
	if ( total_favs == 0) {
		engagement = 0;
	}
	else {
		engagement = ( total_comments + total_rebounds * 10) / total_favs;
	}
	engagement = distribute(engagement, 0.2);
	
	
	var html_engagement =[];
	html_engagement.push(engagement);
	$('.engagement-score').html(html_engagement.join(''));

	
	summary();
	
});

//~Attractions
var total_followers = 0;
var total_star_followers = 0;
$.jribbble.users(username).followers({per_page: 100}).then(function(res) {
	
	res.forEach(function(follower) {
		var user = follower.follower;
		total_followers += 1;
		if ( user.followers_count > 100 ) {
			total_star_followers += 1;
		}
	});
	if (total_followers == 0) {
		attractions = 0;
	}
	else {
		attractions = total_star_followers / total_followers;
	}
	attractions = distribute(attractions, 0.1);
	
	var html_attractions = [];
	html_attractions.push(attractions);
	$('.attractions-score').html(html_attractions.join(''));

	
	summary();

});

//~Summary function
function summary() {
	var summary_score = (appreciation * 0.3 + attractions * 0.2 + influence * 0.3 + diligence * 0.1 + engagement * 0.1) / 100;
	summary_score = norm(summary_score) * 100;
	summary_score = summary_score.toFixed(1);
	
	var html_total_score = [];
	html_total_score.push(summary_score);
	$('.total-score').html(html_total_score.join(''));
	
	document.title = user_alias + " - " + document.title;

	//~Chart

	var w = 500,
	h = 500;


	//Data
	var attractions_title = $(".attractions-title").text();
	var influence_title = $(".influence-title").text();
	var diligence_title = $(".diligence-title").text();
	var engagement_title = $(".engagement-title").text();
	var appreciation_title = $(".appreciation-title").text();
					
	var d = [
		[
			{axis:attractions_title,value:attractions/100},
			{axis:influence_title,value:influence/100},
			{axis:diligence_title,value:diligence/100},
			{axis:engagement_title,value:engagement/100},
			{axis:appreciation_title,value:appreciation/100}
		]
	];

	//Options for the Radar chart, other than default
	var mycfg = {
		w: w,
		h: h,
		maxValue: 1.1,
		levels: 6,
	}

	//Call function to draw the Radar chart
	RadarChart.draw("#chart", d, mycfg);
	
	var svg = d3.select('#body')
		.selectAll('svg')
		.append('svg')
		.attr("width", w+300)
		.attr("height", h)

}

//~Distribute function
function distribute(number,power) {
	var x = Math.pow(Math.sin(3.1415926 * number / 2),power)*100;
	//x = Math.pow(number,power) * 100;
	return x.toFixed(1);
}

//~Normalize function
function norm(number) {
	x = (0.5 + 0.5 * Math.cos(3.1415926 * ( number - 1)));
	return x;
}

//~ Aquire Username
function getUrlParam(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r!=null) return unescape(r[2]);
	return null; 
}

//~Process Numbers
function toThousands(num) {
    var num = (num || 0).toString(), result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
}


//http://nbremer.blogspot.nl/2013/09/making-d3-radar-chart-look-bit-better.html

var RadarChart = {
  draw: function(id, d, options){
  var cfg = {
	 radius: 5,
	 w: 600,
	 h: 600,
	 factor: 1,
	 factorLegend: .85,
	 levels: 3,
	 maxValue: 1,
	 radians: 2 * Math.PI,
	 opacityArea: 0.2,
	 ToRight: 5,
	 TranslateX: 80,
	 TranslateY: 30,
	 ExtraWidthX: 100,
	 ExtraWidthY: 100,
	 color: d3.scale.category10()
	};
	
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){
		  cfg[i] = options[i];
		}
	  }
	}
	cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}))}));
	var allAxis = (d[0].map(function(i, j){return i.axis}));
	var total = allAxis.length;
	var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
	var Format = d3.format('%');
	d3.select(id).select("svg").remove();
	
	var g = d3.select(id)
			.append("svg")
			.attr("viewBox", "0 0 660 524")
			.append("g")
			.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
			;

	var tooltip;
	
	//Circular segments
	for(var j=0; j<cfg.levels-1; j++){
	  var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
	  g.selectAll(".levels")
	   .data(allAxis)
	   .enter()
	   .append("svg:line")
	   .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
	   .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
	   .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
	   .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
	   .attr("class", "line")
	   .style("stroke", "grey")
	   .style("stroke-opacity", "0.75")
	   .style("stroke-width", "0.3px")
	   .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
	}
	
	series = 0;

	var axis = g.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
			.attr("class", "axis");

	// Axis
	axis.append("line")
		.attr("x1", cfg.w/2)
		.attr("y1", cfg.h/2)
		.attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
		.attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
		.attr("class", "line")
		.style("stroke", "grey")
		.style("stroke-width", "1px");

	axis.append("text")
		.attr("class", "legend")
		.text(function(d){return d})
		.attr("text-anchor", "middle")
		.attr("dy", "1em")
		.attr("transform", function(d, i){return "translate(0, -10)"})
		.attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
		.attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

 
	d.forEach(function(y, x){
	  dataValues = [];
	  g.selectAll(".nodes")
		.data(y, function(j, i){
		  dataValues.push([
			cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
			cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
		  ]);
		});
	  dataValues.push(dataValues[0]);
	  g.selectAll(".area")
					 .data([dataValues])
					 .enter()
					 .append("polygon")
					 .attr("class", "radar-chart-serie"+series)
					 .attr("points",function(d) {
						 var str="";
						 for(var pti=0;pti<d.length;pti++){
							 str=str+d[pti][0]+","+d[pti][1]+" ";
						 }
						 return str;
					  }) 
					 .on('mouseover', function (d){
										z = "polygon."+d3.select(this).attr("class");
										g.selectAll("polygon")
										 .transition(200)
										 .style("fill-opacity", 0.1); 
										g.selectAll(z)
										 .transition(200)
										 .style("fill-opacity", .7);
									  })
					 .on('mouseout', function(){
										g.selectAll("polygon")
										 .transition(200)
										 .style("fill-opacity", cfg.opacityArea);
					 });
	  series++;
	});
	series=0;

	//Tooltip
	tooltip = g.append('text')
			   .style('opacity', 0)
			   .style('font-size', '13px');
  }
};