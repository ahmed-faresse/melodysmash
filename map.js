window.onload = function() 
{
    var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });
       

    var level = function(name, x, y, pos, url, score) 
    {
	this.name = name;
	this.x = x;
	this.y = y;
	this.pos = pos;
	this.url = url;
	this.score = 0;
    };
    var beginmap = false;
    var marge = 0;
    var begin = { x:44, y:54 };
    var texture_group;
    var marge = { x:20, y:20};
    var target = { x:100, y:100};
    var mummy;
    speed = 200;
    iter = 0;
    start = false;
    var all_target = [p1, p2, p3, p4];
    var begin = { x:44, y:54 };
    pos = 1;
    var logo;
    var buttonjouer;
    var buttonoptions;
    var background;
    var music;
    var p1 = new level("p1", 44, 54, 1, "game01.html");
    var p2 = new level("p2", 269, 286, 2, "game01.html");
    var p3 = new level("p3", 449, 286, 3, "game01.html");
    var p4 = new level("p4", 635, 158, 4, "game01.html");

    function return_elem(pos)
    {
	for (var i = 0; i < all_target.length; i++) 
	{
	    if (all_target[i].pos == pos)
		return all_target[i];
	}
	return null;
    }
    
    function relation_match(target_pos)
    {
	if (target_pos == 0 || pos == 0)
	    return false;
	if ((pos + 1 == target_pos) || (pos - 1 == target_pos))
	    return true;
	return false;
    }
    
    function return_pos(pos_x, pos_y)
    {
	for (var i = 0; i < all_target.length; i++) 
	{
	    if (match_one_target(all_target[i].x, all_target[i].y, pos_x, pos_y) == true)
		return all_target[i].pos;
	}
	return 0;
    }
    
    function move_pos()
    {
	distance_x = ((target.x - mummy.x) / speed);
	distance_y = ((target.y - mummy.y) / speed);
    }
     
    function match_all_target(pos_x, pos_y)
    {
	for (var i = 0; i < all_target.length; i++) 
	{
	    if (match_one_target(all_target[i].x, all_target[i].y, pos_x, pos_y) == true)
		return true;
	}
	return false;
    }
    
    function match_one_target(target_x, target_y, pos_x, pos_y)
    {
	var xmin = target_x - marge.x;
	var xmax = target_x + marge.x;
	var ymin = target_y - marge.y;
	var ymax = target_y + marge.y;
	if (pos_x > xmin && pos_x < xmax && pos_y > ymin && pos_y < ymax)
	    return true;
	return false;						   
    }
     
    function update()
    {
	if (iter == speed)
	{
	    pos = return_pos(mummy.x, mummy.y);
	    if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER))
	    {
		temp = return_elem(pos).url + "?ts=";
		alert("Bienvenue dans le niveau " + pos);
		window.location.href = temp + new Date().getMilliseconds();
	    }
	}
	if (iter < speed && start == true)
	{
	    //alert("update");
	    mummy.x += distance_x;
	    mummy.y += distance_y;
            iter++;
	}
    }

    function render() 
    {
    }
    
    function detect()
    {
	var i = parseInt(game.input.x);
	var j = parseInt(game.input.y);
	if ((iter == speed || iter == 0) && match_all_target(i, j) == true)
	{
	    if (return_pos(mummy.x, mummy.y) != 0 && relation_match(return_pos(i, j)) == true)
	    {
		start = true;
		target.x = i;
		target.y = j;
		move_pos();
		iter = 0;
	    }
	}
    }

    function create() 
    {
	texture_group = game.add.group();
	texture_group.create(0, 0, 'map');
	mummy = game.add.sprite((begin.x), (begin.y), 'mummy');
	mummy.animations.add('play');
	mummy.animations.play('play', 30, true);
	game.input.onDown.add(detect, this);
	move_pos();
    }
    
    function preload() 
    {
	game.load.image('map', 'assets/map.png');
	game.load.spritesheet('mummy', 'sprites/metalslug_mummy37x45_right.png', 37, 45, 18);
	this.game.stage.scale.pageAlignHorizontally = true;
	this.game.stage.scale.pageAlignVertically = true;
	this.game.stage.scale.refresh();
    }

    function is_moving()
    {
	if (iter != 0 && start == true && iter < speed)
	{
	    mummy.animations.play('play', 30, true);
	    return true;					 
	}
	else
	{
	    mummy.animations.add('stop');
	    return false;					 
	}
    }
};