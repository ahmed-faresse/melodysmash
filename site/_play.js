window.onload = function() 
{
    var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload });

    function getXMLHttpRequest() 
    {
	var xhr = null;
	
	if (window.XMLHttpRequest || window.ActiveXObject) 
	{
            if (window.ActiveXObject) 
	    {
		try 
		{
                    xhr = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch(e) 
		{
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
            } 
	    else 
		xhr = new XMLHttpRequest(); 
	} 
	else 
	{
            alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
            return null;
	}
	return xhr;
    }

    var xhr = getXMLHttpRequest(); // Voyez la fonction getXMLHttpRequest() définie dans la partie précédente
    
    if (xhr == null)
    {
	alert("prob");
	return 0;
    }
    
    try
    {
	alert("poil1");
	var sVar1 = encodeURIComponent("contenu 1");
	var sVar2 = encodeURIComponent("et contenu 2");
	//xhr.open("GET", "getdata.php?variable1=" + sVar1 + "&variable2= " + sVar2, true);
	xhr.open("GET", "getdata.php");
	xhr.send();
	//xhr.open("GET", "https://anthonyonfray.fr/melodysmash/getdata.php?variable1=" + sVar1 + "&variable2= " + sVar2, true);
	alert("poil2");
	//xhr.send(null);
	//alert("done");
    }
    catch(e)
    {
	alert("ok pas cool");
    }


    function preload() 
    {
    }
}

