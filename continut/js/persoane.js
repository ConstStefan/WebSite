function verificaUtilizator(nume,parola){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           const log = JSON.parse(this.response);
           if(nume == log[0].utilizator){
                if(parola == log[0].parola)
                {
                    document.getElementById("result").innerHTML="Logare cu succes";
                }
                else
                {
                    document.getElementById("result").innerHTML="Parola introdusa nu este valida";
                }
           }
           else
           {
                document.getElementById("result").innerHTML="Numele de utilizator introdus nu este valid";
           }
        }
    };
    xhttp.open("GET", "resurse/utilizatori.json", true);
    xhttp.send();
  }