if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    document.getElementById("pozitie").innerHTML =
    "Geolocation is not supported by this browser.";
  }
  function showPosition(position) {
    document.getElementById("pozitie").innerHTML =
    "Latitude: " + position.coords.latitude + "<br>" +
    "Longitude: " + position.coords.longitude;
  }


  function realtimeClock(){
    
    
   



    const d=new Date();
    document.getElementById("date").innerHTML=d;


    document.getElementById("url").innerHTML=window.location.href;


    var v = "Version: " + navigator.userAgent;
    document.getElementById("browser").innerHTML = v;
    
   


    var rtClock=new Date();
    var hours=rtClock.getHours();
    var minutes=rtClock.getMinutes();
    var seconds=rtClock.getSeconds();

    var amPm=(hours<12) ? "AM" : "PM"
    hours=(hours>12) ? hours-12:hours;

    hours=("0"+hours).slice(-2);
    minutes=("0"+minutes).slice(-2);
    seconds=("0"+seconds).slice(-2);

    document.getElementById('clock').innerHTML=hours+":"+minutes+":"+seconds+" "+amPm;
    var t = setTimeout(realtimeClock,500);

  }
 
 
  function addLinie(){
    var table = document.getElementById("tabelInvat");
    var position=document.getElementById("position"); 
    var tr= table.insertRow(position.value);
    var color = document.getElementById("culoareTabel");
    tr.style.backgroundColor = color.value;
    var colNr=table.rows[0].cells.length;
    var nume=document.getElementById('nume');
    var pren=document.getElementById('prenume');
    var tara=document.getElementById('tara');
    var gs=document.getElementById('gs');
   
    
  
    
    for(let i =0;i<colNr;i++){
        var cell=tr.insertCell(i);
        if(i==0)
        {
            cell.innerHTML=nume.value;
        }
        
        else if(i==1)
        {
            cell.innerHTML=pren.value;
        }
        else if(i==2)
        {
            cell.innerHTML=tara.value;
        }
        else if(i==3)
        {
            cell.innerHTML=gs.value;
        }

        
    }
  
    
}

function schimbaContinut(resursa,jsFisier,jsFunctie){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          document.getElementById("continut").innerHTML = this.responseText;
          if (jsFisier) {
              var elementScript = document.createElement('script');
              elementScript.onload = function () {
                  console.log("hello");
                  if (jsFunctie) {
                      window[jsFunctie]();
                  }
              };
              elementScript.src = jsFisier;
              document.body.appendChild(elementScript);
          } else {
              if (jsFunctie) {
                  window[jsFunctie]();
              }
          }
      }
  };
xhttp.open("GET", resursa+".html", true);
xhttp.send();
}

    

var clicks=0
var x1,y1,x2,y2
function draw() {
    var e=window.event
    var rect= e.target.getBoundingClientRect()


    if(clicks==0)
    {
        x1=e.clientX-rect.left
        y1=e.clientY-rect.top
        clicks=1
    }
    else
    {
        clicks=0
        x2=e.clientX-rect.left
        y2=e.clientY-rect.top
        if(x2>x1)
        {
            var temp=x1
            x1=x2
            x2=temp
        }
        if(y2>y1)
        {
            var temp=y1
            y1=y2
            y2=temp
        }
        var c=document.getElementById("canvas")
        var ctx=c.getContext("2d")
        ctx.fillStyle=document.getElementById("fill").value
        ctx.strokeStyle=document.getElementById("stroke").value

        ctx.fillRect(x1,y1,x2-x1,y2-y1)
        ctx.strokeRect(x1,y1,x2-x1,y2-y1)
    }
    pozitii()
}

function pozitii()
{
    document.getElementById("poz").innerHTML="x1=" + x1 + " y1=" + y1 + " x2=" + x2 + " y2=" + y2
}
