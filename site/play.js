window.onload = function() 
{
    var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });
       
    var p1 = 
	{ 
	    name:"p1",
	    x:44,
	    y:54,
	    pos:1,
	    url:"game01.html"
	}
    
    var p2 = 
	{ 
	    name:"p2",
	    x:269,
	    y:286,
	    pos:2,
	    url:"game01.html"
	}

    var p3 = 
	{ 
	    name:"p3",
	    x:449,
	    y:286,
	    pos:3,
	    url:"game01.html"
	}
    
    var p4 = 
	{ 
	    name:"p4",
	    x:635,
	    y:158,
	    pos:4,
	    url:"game01.html"
	}

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
    var buttoncredits;
    var background;
    var music;

    /* Var button level*/
    var button1;
    /**/

    function preload() 
    {
	game.load.image('map', 'img/icon/menu/map.png');
	game.load.image('back', 'img/icon/menu/backhome.png');
	game.load.image('credits', 'img/icon/menu/credits.png');
	game.load.spritesheet('melodysmash', 'img/icon/menu/logo.png', 60.72,66);
	game.load.spritesheet('buttonjouer', 'img/icon/menu/sprite-jouer.png', 270, 63);
	game.load.spritesheet('buttoncredits', 'img/icon/menu/sprite-credits1.png', 270, 63);
	game.load.image('background','img/icon/menu/menu1.png');
	game.load.spritesheet('mummy', 'sprites/metalslug_mummy37x45_right.png', 37, 45, 18);

	/**Sprites button level**/
	game.load.spritesheet('button1', 'img/icon/menu/sprite-button1.png', 60, 55);
	game.load.spritesheet('button2', 'img/icon/menu/sprite-button2.png', 60, 55);
	game.load.spritesheet('button3', 'img/icon/menu/sprite-button3.png', 60, 55);
	game.load.spritesheet('button4', 'img/icon/menu/sprite-button4.png', 60, 55);
	game.load.spritesheet('button5', 'img/icon/menu/sprite-button5.png', 60, 55);
	game.load.spritesheet('button6', 'img/icon/menu/sprite-button6.png', 60, 55);
	game.load.spritesheet('button7', 'img/icon/menu/sprite-button7.png', 60, 55);
	game.load.spritesheet('button8', 'img/icon/menu/sprite-button8.png', 60, 55);
	game.load.spritesheet('button9', 'img/icon/menu/sprite-button9.png', 60, 55);
	game.load.spritesheet('button10', 'img/icon/menu/sprite-button10.png', 60, 55);

	/**/
	/*Animations world*/
	game.load.spritesheet('balls', 'img/notes/sprites-notebubbles.png', 13,17);

    }

    
    function create() 
    {
	game.stage.backgroundColor = 'red';
	background = game.add.tileSprite(0, 0, 800, 600, 'background');
	for (var i = 0; i < 11; i++)
	{ 
	    logo = game.add.sprite(50 + 59 * i, -100, 'melodysmash', i);
	    logo.anchor.setTo(-0.2,0.5);
	    game.add.tween(logo).to({y: 100}, 1500, Phaser.Easing.Bounce.Out, true, 1000 + 400 * i, false);
	}
	buttonjouer = game.add.button(game.world.centerX -130, 250, 'buttonjouer', actionOnClickJouer, this, 2, 1, 0);
	buttoncredits = game.add.button(game.world.centerX -130, 350, 'buttoncredits', actionOnClickCredits, this, 2, 1, 0);
    
    }
    
   

    function actionOnClickJouer () 
    {

	texture_group = game.add.group();
	texture_group.create(0, 0, 'map');
	mummy = game.add.sprite((begin.x), (begin.y), 'mummy');
	mummy.animations.add('play');
	mummy.animations.play('play', 30, true);
	game.input.onDown.add(detect, this);
	move_pos();

	/*level button*/
    button1 = game.add.button(20, 300, 'button1', actionOnClicklevel1, this, 2,1,0);
    button2 = game.add.button(80, 340, 'button2', actionOnClicklevel2, this, 2,1,0);
    button3 = game.add.button(155, 365, 'button3', actionOnClicklevel3, this, 2,1,0);
    button4 = game.add.button(230, 385, 'button4', actionOnClicklevel4, this, 2,1,0);
    button5 = game.add.button(305, 400, 'button5', actionOnClicklevel5, this, 2,1,0);
  	button6 = game.add.button(380, 410, 'button6', actionOnClicklevel6, this, 2,1,0);
    button7 = game.add.button(460, 420, 'button7', actionOnClicklevel7, this, 2,1,0);
    button8 = game.add.button(535, 420, 'button8', actionOnClicklevel8, this, 2,1,0);
    button9 = game.add.button(610, 400, 'button9', actionOnClicklevel9, this, 2,1,0);
	button10 = game.add.button(680, 370, 'button10', actionOnClicklevel10, this, 2,1,0);
	/*/
    
    /*animation notes*/
	var emitter = game.add.emitter(120, 500, 0);
    emitter.makeParticles('balls', [0, 1, 2, 3, 4, 5, 6]);
    emitter.minParticleSpeed.setTo(-100, -100);
    emitter.maxParticleSpeed.setTo(100, 100);
    emitter.gravity = 0;
    emitter.start(false, 4000, 0);
    /**/

	buttonjouer.kill();
   	buttoncredits.kill();
   	}
    
    function actionOnClickCredits () 
    {
	  
	  texture_group = game.add.group();
	  texture_group.create(0, 0, 'credits');
	  buttonjouer.kill();
   	  buttoncredits.kill();
   	  var back = game.add.button(40, 500, 'back', backmenu, this, 2, 1, 0);
    }

    function backmenu(){
    	window.location.reload();
    }
    
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

    /*Function level*/
     function actionOnClicklevel1() {

    }
     function actionOnClicklevel2() {

    }
     function actionOnClicklevel3() {

    }
     function actionOnClicklevel4() {

    }
     function actionOnClicklevel5() {

    }
     function actionOnClicklevel6() {

    }
     function actionOnClicklevel7() {

    }
     function actionOnClicklevel8() {

    }
     function actionOnClicklevel9() {

    }
     function actionOnClicklevel10() {

    }

}
