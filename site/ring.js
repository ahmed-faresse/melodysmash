/* roue de la fortune - Bonus 2 */

window.onload = function() 
{
    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });
    var ring;
    var fleche;
    var number = 400;
    var is_launch = false;
    var soundring;

    function preload () 
    {
	game.load.spritesheet('bot', 'assets/ring_final.png', 287, 286, 3);
	game.load.audio('voiceoff', ['assets/music/voiceoff.mp3', 'assets/music/voiceoff.ogg']);
	game.load.audio('soundring', ['assets/music/soundring.mp3', 'assets/music/soundring.ogg']);
	game.load.image('background','img/icon/menu/map.png');
	game.load.image('ring1','assets/ring1.png');
	game.load.image('ring2','assets/ring2.png');
	game.load.image('ring3','assets/ring3.png');
	game.load.image('rewardlose','assets/rewardlose.png');
	game.load.image('rewardbomb','assets/rewardbomb.png');
	game.load.image('rewardpoint','assets/rewardpoint.png');
	game.load.image('fleche','assets/fleche.png');

        this.game.stage.scale.pageAlignHorizontally = true;
        this.game.stage.scale.pageAlignVertically = true;
        this.game.stage.scale.refresh();

	game.load.spritesheet('start_ring', 'assets/start_ring.png', 200, 150);
    }

    function create () 
    {
	clicked = 0;
	background = game.add.sprite(0, 0, 'background');
	ring = game.add.sprite(400, 250, 'bot');
	fleche = game.add.sprite(490, 90, 'fleche');
	
	start_ring = game.add.button(200, 100, 'start_ring', actionOnClickRing, this, 2,1,0);
        texture_group = game.add.group();
    }

    function actionOnClickRing()
    {
	if (is_launch == false)
	{
	    soundring = game.add.audio('soundring');
	    soundring.play();
	    ring.animations.add('walk');
	    ring.animations.play('walk', 5, true);
	    is_launch = true;
	}
    }

    function ring_red()
    {
	ring1 = game.add.sprite(400, 250, 'ring1');
	reward = game.add.sprite(0, 250, 'rewardlose');
    }

    function ring_yellow()
    {
	ring2 = game.add.sprite(400, 250, 'ring2');
	reward = game.add.sprite(0, 250, 'rewardbomb');
    }

    function ring_green()
    {
	ring3 = game.add.sprite(400, 250, 'ring3');
	reward = game.add.sprite(0, 250, 'rewardpoint');
    }
    
    function update()
    {
	if (is_launch == true && number > 0)
	    number--;
	if (number == 0)
	{
	    var randomnumber = Math.floor(Math.random() * 50);
	    ring.animations.add('stop');
	    if ((randomnumber % 2) == 0)
		ring_red();
	    else if ((randomnumber % 3) == 1)
		ring_yellow();
	    else
		ring_green();
            texture_group = game.add.group();
	    soundring.stop();
	    number = -1;
	}
    }
};