/*
input: A-Z

Voyelles: A E I O U.

voyelle peut être changé que par des consonnes.
consonne peut être changé que par des voyelles.

input -> output: tps
BANANA -> AAAAAA: 3s

input:
SUFIANE -> _______: ?s


parse la string, pour recup une lettre
on garde que le U
on recup la taille de la chaine
init un time a 1 (parceque on a deja un U)
init un tableau XXX vide

on prend l'index de la lettre qu'on veut utiliser pour changer

parcourir la chaine,
    verifier qu'on tombe pas sur la letter choisi -> on fait rien on continue
    verifie si c'est une consonne -> on change en U (la lettre choisi) + increment du time de 1seconde
    verifie si c'est une voyelle -> on change en consonne et on ajoute la consonne dns le tableau XXX
*/

function getTime(){
  const v = ['A','E','I','O','U']
  let string = process.argv[2] ? process.argv[2].toUpperCase() : 'SUFIANE'
  const char = process.argv[3] ? process.argv[3].toUpperCase() :'U'
  const charIsVoyelle = v.includes(char)
  let time = 0
  let newStr = ''
  for(let i = 0; i< string.length; i++){
    var eleIsVoyelle = v.includes(string[i]) 

    if((charIsVoyelle && !eleIsVoyelle) || (!charIsVoyelle && eleIsVoyelle)){
     time ++
    }
    else if(
      ((!charIsVoyelle && !eleIsVoyelle) || (charIsVoyelle && eleIsVoyelle)) && char !== string[i]) {
      time = time +2
    }
    newStr = newStr.concat(char)
    }
    return newStr +'   '+time+'s' 
}
console.log(getTime())
