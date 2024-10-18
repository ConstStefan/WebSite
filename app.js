const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const fs = require('fs');
const session = require('express-session');
const mysql = require('mysql2');
const app = express();


const connection = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	port: '3306',
	password: 'tigru',
	database: 'cumparaturi'
	

  });

const port = 6777;

// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(express.static('public'))
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
	secret:'unknown',
	resave:false,
	saveUninitialized:false,
	cookie:{
		maxAge:10000000//timp maxim de
	}
}));

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

// la accesarea din browser adresei http://localhost:6789/ se va returna textul 'Hello World'
// proprietățile obiectului Request - req - https://expressjs.com/en/api.html#req
// proprietățile obiectului Response - res - https://expressjs.com/en/api.html#res



const listaIntrebari = [
	{
		intrebare: 'Rosia este o leguma?',
		variante: ['Adevarat','Fals'],
		corect: 1
	},
	{
		intrebare: 'Care dintre urmatoarele tipuri de carnuri contine cele mai multe proteine?',
		variante: ['pui','curcan','gasca'],
		corect: 2
	},
	{
		intrebare: 'Ce macronutrient predomina in paine?',
		variante: ['Carbohidrati','Proteina','Grasimi'],
		corect: 0
	},
	{
		intrebare: 'Care fruct contine cea mai multa vitamina C?',
		variante: ['Portocale','Capsuni','Patrunjel','Mar'],
		corect: 0
	},

	{
		intrebare: 'Pastele fainoase sunt produse pe baza de faina alba, integrala sau din diferite cereale',
		variante: ['Fals','Adevarat'],
		corect: 1
	}

];

app.get('/', async (req, res) => {
	  // Conectați-vă la serverul de baze de date
	  connection.connect((err) => {
		if (err) {
		  console.error('Eroare la conectarea la baza de date:', err);
		  res.redirect('/');
		  return;
		}
		connection.query('USE cumparaturi', (err) => {
			if (err) {
				console.error('Eroare la utilizarea bazei de date:', err);
				res.redirect('/');
				return;
			}
	  
		// Obțineți produsele din tabela "produse"
		const selectQuery = 'SELECT * FROM produse';
		connection.query(selectQuery, (err, results) => {
		  if (err) {
			console.error('Eroare la obținerea produselor:', err);
		  }
	  
		  // Deconectați-vă de la baza de date
		// connection.end();
		  
	res.render('index',{produse:results,name:req.session.fullname});
});
	  });
	});
});
	

	



app.get('/chestionar', (req, res) => {

	// în fișierul views/chestionar.ejs este accesibilă variabila 'intrebari' care conține vectorul de întrebări
	data = JSON.stringify(listaIntrebari);
	fs.writeFileSync('intrebari.json',data);
	res.render('chestionar', {intrebari: listaIntrebari});
});

app.post('/rezultat-chestionar', (req, res) => {
	console.log(req.body);
	let Corect=0;
	console.log(listaIntrebari);
	for(let i=0 ; i<listaIntrebari.length ; i++)
	{
		if(listaIntrebari[i].variante[listaIntrebari[i].corect] == req.body['question ' + (i+1)]){
			Corect++;
		}
	}
	res.render('rezultat-chestionar',{number:Corect, total:listaIntrebari.length})
});

app.post('/verificare-autentificare', (req, res) => {
	const data = fs.readFileSync('utilizatori.json');
	const log = JSON.parse(data);
	console.log(req.body);
	let ok = false;
	for(let i = 0 ; i < log.length ; i++)
	{
		if(req.body['username'] == log[i].utilizator && req.body['pass'] == log[i].parola)
		{
			req.session.username = req.body['username'];
			req.session.fullname = log[i].nume +" "+ log[i].prenume;
			req.session.loggedin = true;
			res.cookie("username",req.body['username']);
			ok = true;
			res.redirect('/');
		}
	}
	if(!ok)
	{
		res.cookie("mesajEroare","Utilizatorul sau parola greșite!");
		res.redirect('/autentificare');
	}
})

app.get('/autentificare',(req, res) => {
	if(req.cookies["mesajEroare"])
		res.clearCookie("mesajEroare");
	res.render('autentificare',{error:req.cookies['mesajEroare']});
})

app.get('/logout',(req,res) => {
	req.session.loggedin=false;
	req.session.username=null;
	req.session.fullname=null;
	res.clearCookie('username');
    req.session.destroy();
    res.redirect('/');
});

app.post('/creare-bd', (req, res) => {
	connection.connect((err) => {
		if (err) {
		  console.error('Eroare la conectarea la baza de date:', err);
		  res.redirect('/');
		  return;
		}
		
			const createTableQuery = `CREATE TABLE IF NOT EXISTS produse (
				id INT PRIMARY KEY AUTO_INCREMENT,
				nume VARCHAR(255),
				pret DECIMAL(10, 2)
			  )`;
			connection.query(createTableQuery, (err) => {
				if (err) {
				  console.error('Eroare la crearea tabelei produse:', err);
				}
				
				res.redirect('/');
				});
			});
		});


  app.post('/inserarebd', (req, res) => {
	connection.connect((err) => {
		if (err) {
		  console.error('Eroare la conectarea la baza de date:', err);
		  res.redirect('/');
		  return;
		}
	  
		// Inserează produsele în tabela "produse"
		const insertQuery = `INSERT INTO produse (nume, pret) VALUES
		  ('Mere', 10.99),
		  ('Pere', 15.99),
		  ('Gutui', 20.99)`;
		connection.query(insertQuery, (err) => {
		  if (err) {
			console.error('Eroare la inserarea produselor:', err);
		  }
	  
		  // Deconectați-vă de la baza de date
		  //connection.end();
	  
		  // Redirecționați către resursa principală
		  res.redirect('/');
		});
	  });
});
app.post('/adaugare_cos', (req, res) => {
	// Verificăm dacă utilizatorul este autentificat
	if (req.session.loggedin) {
	  // Obțineți ID-ul produsului din corpul mesajului
	  const idProdus = req.body.produsId;
  
	  // Adăugați ID-ul produsului în vectorul din variabila de sesiune
	  req.session.cos = req.session.cos || [];
	  req.session.cos.push(idProdus);
  

	
	res.redirect('/'); // Redirecționați utilizatorul către vizualizarea coșului
 } else {
    res.status(401).send('Trebuie să vă autentificați pentru a adăuga produse în coș.');
  }
	});

	
	app.get('/vizualizare-cos', (req, res) => {
	if (req.session.loggedin) {
		// Obțineți lista de produse din variabila de sesiune
		const produseCos = req.session.cos || [];
	
		// Creați o funcție auxiliară pentru a obține informațiile complete despre produs
		const getProdusInfo = (idProdus) => {
		  return new Promise((resolve, reject) => {
			// Căutați produsul în baza de date sau în altă sursă de stocare a produselor
			const selectQuery = 'SELECT * FROM produse WHERE id = ?';
			connection.query(selectQuery, [idProdus], (err, results) => {
			  if (err) {
				reject(err);
			  } else {
				resolve(results[0]);
			  }
			});
		  });
		};
	
		// Obțineți informațiile complete despre fiecare produs din lista de produse din coș
		Promise.all(produseCos.map((idProdus) => getProdusInfo(idProdus)))
		  .then((produseDetaliate) => {
			// Răspundeți cu șablonul 'vizualizare-cos.ejs' și trimiteți produsele detaliate către șablon
			res.render('vizualizare-cos', { produse: produseDetaliate });
		  })
		  .catch((err) => {
			console.error('Eroare la obținerea informațiilor despre produse:', err);
			res.redirect('/');
		  });
	  } else {
		// Utilizatorul nu este autentificat, redirecționați-l către pagina de autentificare sau afișați un mesaj de eroare
		res.redirect('/autentificare');
	  }
	});
app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:` + port));