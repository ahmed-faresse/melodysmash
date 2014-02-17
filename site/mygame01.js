/* geoffrey */

window.onload = function() {

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
    var is_moving = "false";
    var newi = 0;
    var newj = 0;
    var obj_to_move = new Array();
    var music;

    /* Load assets for the game */
    function preload () 
    {
	game.load.audio('theme', ['assets/music/theme.mp3', 'assets/music/theme.ogg']);

        this.game.stage.scale.pageAlignHorizontally = true;
        this.game.stage.scale.pageAlignVertically = true;
        this.game.stage.scale.refresh();
        /*game.load.image('note', 'assets/note.png');
        game.load.image('notered', 'assets/notered.png');
        game.load.image('notegold', 'assets/notegold.png');
        game.load.image('notegreen', 'assets/notegreen.png');
        game.load.image('notepink', 'assets/notepink.png');
        game.load.image('noteorange', 'assets/noteorange.png');*/

	/* bonus */
	game.load.spritesheet('bonus_bomb', 'assets/bonus/bomb_.png', 100, 66);
	game.load.spritesheet('bonus_line', 'assets/bonus/line_.png', 100, 66);
	game.load.spritesheet('bonus_column', 'assets/bonus/column_.png', 100, 66);
	
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

	bonusBomb = game.add.button(550, 300, 'bonus_bomb', actionOnClickBomb, this, 2,1,0);
	bonusLine = game.add.button(550, 400, 'bonus_line', actionOnClickLine, this, 2,1,0);
	bonusColumn = game.add.button(550, 500, 'bonus_column', actionOnClickColumn, this, 2,1,0);

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
    function checkThreeOrMore(i, j, dir){
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
    function inverse_elem(i, j, oldi, oldj){
        var tmp;

        tmp = map[oldi][oldj];
        map[oldi][oldj] = map[i][j];
        map[i][j] = tmp;
    }

    /* Move a column down when line blocks are destroyed */
    function move_down_line(i, j){
        var piece = map[i][j].key;
        var cp_i = i;

        while (i >= 0 && map[i][j] != "undefined" && map[i][j].key == piece)
            i--;
        i++;
        while (i < line && map[i][j] != "undefined" && map[i][j].key == piece)
        {
            if (cp_i != i)
                map[i][j].kill();
            //while (cp_j > 0 && map[i][cp_j - 1] != "undefined")
            //{
            //    map[i][cp_j - 1].x = i * width;
            //   map[i][cp_j - 1].y = cp_j * height;
            //   map[i][cp_j] = map[i][cp_j - 1];
            //  cp_j--;
            //}
            //   if (cp_j == 0 || map[i][cp_j - 1] == 'undefined')
            //       map[i][cp_j] = "undefined";
            obj_to_move.push(i, j - 1, 1);
            i++;
        }
    }
    
    /* Move a column down when column blocks are destroyed */
    function move_down_col(i, j){
        var piece = map[i][j].key;
        var nbAligned = 1;
        var cp_j = j + 1;

        while (cp_j < col && map[i][cp_j] != "undefined" && map[i][cp_j].key == piece)
        {
            map[i][cp_j].kill();
            nbAligned++;
            cp_j++;
        }
        j -= 1;
        while (j >= 0 && map[i][j] != "undefined" && map[i][j].key == piece)
        {
            map[i][j].kill();
            nbAligned++;
            j--;
        }
        obj_to_move.push(i, j, nbAligned);
        //while (j >= 0 && map[i][j] != "undefined")
        //{
        //    map[i][j].x = i * width;
        //    map[i][j].y = (j + nbAligned) * height;
        //    map[i][j + nbAligned] = map[i][j];
        //    map[i][j] = "undefined";
        //    j--;
        //}
        //while (j >= 0 && map[i][j] != "undefined")
        //{
        //    map[i][j] = "undefined";
        //    j--;
        //}

    }

    /* Destroy combination of three or more identical icons */
    function destroy_combination(){
        var newDestroy = 0;
        var saveDestroy = 0;

        if (checkThreeOrMore(newi, newj, "horizontal") == 1)
        {
            move_down_line(newi, newj);
            newDestroy = 1;
        }
        
        if (checkThreeOrMore(newi, newj, "vertical") == 1)
        {
            move_down_col(newi, newj);
            newDestroy = 1;
        }

        if (checkThreeOrMore(savei, savej, "horizontal") == 1)
        {
            move_down_line(savei, savej);
            saveDestroy = 1;
        }
        
        if (checkThreeOrMore(savei, savej, "vertical") == 1)
        {
            move_down_col(savei, savej);
            saveDestroy = 1;
        }
        
        if (newDestroy == 1)
            map[newi][newj].kill();
        if (saveDestroy == 1)
            map[savei][savej].kill();
    }

    function epur_tab()
    {
        var i = 0;
        while (i < obj_to_move.length)
        {
            var j = i + 3;
            while (j < obj_to_move.length)
            {
                if (obj_to_move[i] == obj_to_move[j]) 
                {
                    if (obj_to_move[i + 2] > obj_to_move[j + 2])
                        obj_to_move.splice(j, 3);
                    else
                        obj_to_move.splice(i, 3);
                }
                j += 3;
            }
            i += 3;
        }
    }
    /* Swap two elements if it's possible */
    function swap(i, j, oldi, oldj){
        var tmp;
        var piece;
        var copy;
        var nbOnLine;

        inverse_elem(i, j, oldi, oldj);
        
        if (checkThreeOrMore(i, j, "horizontal") == 0 &&
            checkThreeOrMore(i, j, "vertical") == 0 &&
            checkThreeOrMore(oldi, oldj, "horizontal") == 0 &&
            checkThreeOrMore(oldi, oldj, "vertical") == 0)
        {
            if (passed == false)
            {
                is_moving = "swap";
                passed = true;
            }
            return (-1);
        }

        map[oldi][oldj].alpha = 1;
        map[i][j].alpha = 1;

        destroy_combination(i, j, oldi, oldj);
        epur_tab();
        is_moving = "fall";
        return (0);
    }

    var passed = false;
    /* Mouse callback */
    function detect(){
        newi = parseInt(game.input.x / width);
        newj = parseInt(game.input.y / height);
        if (game.input.x < 0 || game.input.y < 0 || newi >= line || newj >= col)
            return;
        if (is_moving == "false")
        {
            if (clicked == 0)
            {
                passed = false;
                savei = newi;
                savej = newj;
                map[newi][newj].alpha = 0.1;
                clicked = 1;
            }
            else if (clicked == 1)
            {
                map[savei][savej].alpha = 1;
                map[newi][newj].alpha = 1;
                if (Math.abs(savei - newi) <= 1 && Math.abs(savej - newj) <= 1 &&
                    (Math.abs(savei - newi) != 1 || Math.abs(savej - newj) != 1) &&
                    map[savei][savej].key != map[newi][newj].key)
                    is_moving = "swap";
                clicked = 0;
            }
        }
    }

    var sens = 1;

    function update(){
        if (is_moving == "swap")
        {
            if (savei - newi == 1 || savej - newj == 1)
                sens = 1;
            else if (savei - newi == -1 || savej - newj == -1)
                sens = -1;

            if ( (sens == 1 && (parseInt(map[newi][newj].x) < savei * width 
				|| parseInt(map[newi][newj].y) < savej * height))
                 || (sens == -1 && (parseInt(map[newi][newj].x) > savei * width
				    || parseInt(map[newi][newj].y) > savej * height)) )
            {
                map[newi][newj].x += (savei - newi) * 2;
                map[newi][newj].y += (savej - newj) * 2;
                map[savei][savej].x += (newi - savei) * 2;
                map[savei][savej].y += (newj - savej) * 2;
            }
            else
            {
                map[newi][newj].body.velocity.x = 0;
                map[newi][newj].body.velocity.y = 0;
                map[savei][savej].body.velocity.x = 0;
                map[savei][savej].body.velocity.y = 0;
                is_moving = "change";
                swap(newi, newj, savei, savej);
            }
        }
        else if (is_moving == "change")
        {
            map[newi][newj].x = newi * width;
            map[newi][newj].y = newj * height;
            map[savei][savej].x = savei * width;
            map[savei][savej].y = savej * height;
            is_moving = "false";
        }
        else if (is_moving == "fall")
        {
            var i = 0;

            while (i < obj_to_move.length)
            {
                var tmp = obj_to_move[i + 1];
                if (map[obj_to_move[i]][obj_to_move[i + 1]].y <
                    map[obj_to_move[i]][obj_to_move[i + 1] + obj_to_move[i + 2]].y)
                    while (tmp >= 0 && map[obj_to_move[i]][tmp] != "undefined")
                {
                    map[obj_to_move[i]][tmp].y += 2;
                    tmp--;
                }
                else
                {
                    while (tmp >= 0 && map[obj_to_move[i]][tmp] != "undefined")
                    {
                        //map[obj_to_move[i]][tmp].body.velocity.y = 0;
                        map[obj_to_move[i]][tmp].y = (tmp + obj_to_move[i + 2]) * height;
                        map[obj_to_move[i]][tmp + obj_to_move[i + 2]] = map[obj_to_move[i]][tmp];
                        map[obj_to_move[i]][tmp] = 'undefined';
                        tmp--;
                    }
                    obj_to_move.splice(i, 3);
                    i -= 3;
                }
                if (obj_to_move.length == 0)
                {
                    is_moving = "false";
                    return ;
                }
                i += 3;
            }
        }     
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
