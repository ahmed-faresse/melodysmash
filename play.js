window.onload = function() 
{

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });
    var map;
    var clicked;
    var savei = -1;
    var savej = -1;
    var timer = 0;
    var width = 50;
    var height = 60;
    var col = 10;
    var line = 10;
    var texture_group;
    var music;
    var bombUse = false;
    var lineUse = false;
    var columnUse = false;

    /* Load assets for the game */
    function preload () 
	{
	    game.load.audio('theme', ['assets/music/theme.mp3', 'assets/music/theme.ogg']);

            this.game.stage.scale.pageAlignHorizontally = true;
            this.game.stage.scale.pageAlignVertically = true;
            this.game.stage.scale.refresh();
	    
            //game.load.image('fond_jeu', 'assets/partition.png');
	    
	    game.load.spritesheet('bonus_bomb', 'assets/bonus/bomb_.png', 100, 66);
	    game.load.spritesheet('bonus_line', 'assets/bonus/line_.png', 100, 66);
	    game.load.spritesheet('bonus_column', 'assets/bonus/column_.png', 100, 66);

            //game.load.image('bonus_bomb', 'assets/bonus/bomb.png');
            //game.load.image('bonus_line', 'assets/bonus/line.png');
            //game.load.image('bonus_column', 'assets/bonus/column.png');

	    /*notes*/
            game.load.image('note', 'assets/instruments/tambour.png');
            game.load.image('notered', 'assets/instruments/saxophone.png');
            game.load.image('notegold', 'assets/instruments/violon.png');
            game.load.image('notegreen', 'assets/instruments/guitare.png');
            game.load.image('notepink', 'assets/instruments/piano.png');
            game.load.image('noteorange', 'assets/instruments/trompette.png');
            game.load.image('noteorange', 'assets/partition.png');
	}

    /* Main initialisation for the game */
    function create () 
    {

	music = game.add.audio('theme');
	music.play();
        
        clicked = 0;
	//game.add.sprite(0, 0, 'fond_jeu');
	
	bonusBomb = game.add.button(550, 300, 'bonus_bomb', actionOnClickBomb, this, 2,1,0);
	bonusLine = game.add.button(550, 400, 'bonus_line', actionOnClickLine, this, 2,1,0);
	bonusColumn = game.add.button(550, 500, 'bonus_column', actionOnClickColumn, this, 2,1,0);
	
	//game.add.sprite(550, 300, 'bonus_line');
	//game.add.sprite(550, 400, 'bonus_column');
	//game.add.sprite(550, 500, 'bonus_bomb');
        texture_group = game.add.group();
	
        texture_group.create(0, 0, 'note');
        texture_group.create(0, 0, 'notered');
        texture_group.create(0, 0, 'notegold');
        texture_group.create(0, 0, 'notegreen');
        texture_group.create(0, 0, 'notepink');
        texture_group.create(0, 0, 'noteorange');
        texture_group.setAll('scale.x', 0.1);
        texture_group.setAll('scale.y', 0.1);
        texture_group.setAll('visible', false);
        map = new Array(line);
        for (i = 0; i < line; i++)
        {
            map[i] = new Array(col);
            for (j = 0; j < col; j++)
            {
                sprite = texture_group.getRandom();
                console.log(sprite);
                map[i][j] = game.add.sprite(i * width, j * height, sprite.key);
                map[i][j].scale.setTo(0.1, 0.1);
                map[i][j].inputEnabled = true;
            }
        }
        game.input.onDown.add(detect, this);
    }

    function actionOnClickBomb()
    {
	if (bombUse == false)
	{
	    alert("bomb");
	    bombUse = true;
	}
    }

    function actionOnClickLine()
    {
	if (lineUse == false)
	{
	    alert("line");
	    lineUse = true;
	}
    }

    function actionOnClickColumn()
    {
	if (columnUse == false)
	{
	    alert("column");
	    columnUse = true;
	}
    }
    
    /* Check if there is more than two identical piece on a line */
    function checkThreeOrMore(i, j, dir)
    {
        var nbOnLine;

        piece = map[i][j].key;
        if (dir == "horizontal")
        {
            for (nbOnLine = 1, copy = i + 1; copy < line && map[copy][j].key == piece; nbOnLine++, copy++); 
            for (copy = i - 1; copy >= 0 && map[copy][j].key == piece; nbOnLine++, copy--);
            if (nbOnLine >= 3)
                return (1);
        }
        else if (dir == "vertical")
        {
            for (nbOnLine = 1, copy = j + 1; copy < line && map[i][copy].key == piece; nbOnLine++, copy++); 
            for (copy = j - 1; copy >= 0 && map[i][copy].key == piece; nbOnLine++, copy--);
            if (nbOnLine >= 3)
                return (1);
        }
        return (0);
    }

    /* Inverse two elements in the map */
    function inverse_elem(i, j, oldi, oldj)
    {
        var tmp;

        tmp = map[oldi][oldj];
        map[oldi][oldj] = map[i][j];
        map[i][j] = tmp;
    }

    /* Move a column down when line blocks are destroyed */
    function move_down_line(i, j)
    {
        var piece = map[i][j].key;
        var cp_j;

        while (i >= 0 && map[i][j] != "undefined" && map[i][j].key == piece)
            i--;
        i++;
        while (i < line && map[i][j] != "undefined" && map[i][j].key == piece)
        {
            cp_j = j;
            map[i][cp_j].kill();
            while (cp_j > 0 && map[i][cp_j - 1] != "undefined")
            {
                map[i][cp_j - 1].x = i * width;
                map[i][cp_j - 1].y = cp_j * height;
                map[i][cp_j] = map[i][cp_j - 1];
                cp_j--;
            }
            if (cp_j == 0 || map[i][cp_j - 1] == 'undefined')
                map[i][cp_j] = "undefined";
            i++;
        }
    }
    
    /* Move a column down when column blocks are destroyed */
    function move_down_col(i, j){
        var piece = map[i][j].key;
        var nbAligned = 0;
        var cp_j = j + 1;

        while (cp_j < col && map[i][cp_j] != "undefined" && map[i][cp_j].key == piece)
        {
            map[i][cp_j].kill();
            nbAligned++;
            cp_j++;
        }
        while (j >= 0 && map[i][j] != "undefined" && map[i][j].key == piece)
        {
            map[i][j].kill();
            nbAligned++;
            j--;
        }
        while (j >= 0 && map[i][j] != "undefined")
        {
            map[i][j].x = i * width;
            map[i][j].y = (j + nbAligned) * height;
            map[i][j + nbAligned] = map[i][j];
            map[i][j] = "undefined";
            j--;
        }
        while (j >= 0 && map[i][j] != "undefined")
        {
            map[i][j] = "undefined";
            j--;
        }

    }

    /* Destroy combination of three or more identical icons */
    function destroy_combination(i, j, oldi, oldj){
        if (checkThreeOrMore(i, j, "horizontal") == 1)
            move_down_line(i, j);
        
        if (checkThreeOrMore(i, j, "vertical") == 1)
            move_down_col(i, j);

        if (checkThreeOrMore(oldi, oldj, "horizontal") == 1)
            move_down_line(oldi, oldj);
        
        if (checkThreeOrMore(oldi, oldj, "vertical") == 1)
            move_down_col(oldi, oldj);
    }

    /* Swap two elements if it's possible */
    function swap(i, j, oldi, oldj){
        var tmp;
        var piece;
        var copy;
        var nbOnLine;

        if (Math.abs(oldi - i) > 1 || Math.abs(oldj - j) > 1 ||
            (Math.abs(oldi - i) == 1 && Math.abs(oldj - j)) == 1 ||
            map[oldi][oldj].key == map[i][j].key)
            return (-1);
        
        inverse_elem(i, j, oldi, oldj);
        
        if (checkThreeOrMore(i, j, "horizontal") == 0 &&
            checkThreeOrMore(i, j, "vertical") == 0 &&
            checkThreeOrMore(oldi, oldj, "horizontal") == 0 &&
            checkThreeOrMore(oldi, oldj, "vertical") == 0)
        {
            inverse_elem(i, j, oldi, oldj);
            return (-1);
        }

        inverse_elem(i, j, oldi, oldj);
        tmp = map[oldi][oldj];
        map[oldi][oldj].x = map[i][j].x;
        map[oldi][oldj].y = map[i][j].y;
        map[i][j].x = oldi * width;
        map[i][j].y = oldj * height;
        map[oldi][oldj] = map[i][j];
        map[i][j] = tmp;
        map[oldi][oldj].alpha = 1;
        map[i][j].alpha = 1;

        destroy_combination(i, j, oldi, oldj);
        return (0);
    }

    /* Mouse callback */
    function detect(){
        var i = parseInt(game.input.x / width);
        var j = parseInt(game.input.y / height);
        if (game.input.x < 0 || game.input.y < 0 || i >= line || j >= col)
            return;
        if (clicked == 0)
        {
            savei = i;
            savej = j;
            map[i][j].alpha = 0.1;
            clicked = 1;
        }
        else if (clicked == 1)
        {
            if (swap(i, j, savei, savej) == -1)
            {
                map[savei][savej].alpha = 1;
                map[i][j].alpha = 1;
            }
            clicked = 0;
        }
    }

    function update(){
    }

    function render(){
        game.debug.renderInputInfo(510, 32);
        if (game.input.x > 0 && game.input.y > 0)
        {
            var i = parseInt(game.input.x / width);
            var j = parseInt(game.input.y / height);
            if (i >= 0 && i < line && j >= 0 && j < col)
            {
                game.debug.renderText("casex", 510, 132);
                game.debug.renderText(j, 590, 132);
                game.debug.renderText("casey", 510, 150);
                game.debug.renderText(i, 590, 150);
                game.debug.renderText("sprite", 510, 168); 
                game.debug.renderText(map[i][j].key, 590, 168);

                game.debug.renderText("map[i][j].x", 510, 190);
                game.debug.renderText(map[i][j].x, 630, 190);
                game.debug.renderText("map[i][j].y", 510, 210);
                game.debug.renderText(map[i][j].y, 630, 210);

                if (savei >= 0 && savei < line && savej >= 0 && savej < col)
                {
                    game.debug.renderText("map[savei][savej].x", 510, 230);
                    game.debug.renderText(map[savei][savej].x, 710, 230);
                    game.debug.renderText("map[savei][savej].y", 510, 250);
                    game.debug.renderText(map[savei][savej].y, 710, 250);    
                }
            }
        }
    }
};
