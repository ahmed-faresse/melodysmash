window.onload = function() 
{
    var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });

    
    function preload() 
    {
	game.load.image('map', 'img/icon/menu/map.png');
	game.load.spritesheet('buttonjouer', 'img/icon/menu/sprite-jouer.png', 270, 63);
    }

    function create() 
    {
	
    }
    
    function update()
    {
    }
}