# Aplicație de Procesare a Imaginilor

Acest proiect are ca scop preluarea unei imagini de la o API specificată, afișarea informațiilor JSON pe pagina web și aplicarea efectelor de procesare a imaginilor, cum ar fi oglindirea și accentuarea, folosind HTML, CSS și JavaScript.

## Caracteristici:

Afișarea Informațiilor JSON:
Folosește JavaScript pentru a prelua datele de la API și pentru a afișa componentele JSON pe pagina web.
Informațiile JSON sunt prezentate sub elementul canvas, oferind detalii despre imaginea preluată.
Procesarea Imaginilor:

Folosește elementul HTML canvas pentru a desena și procesa imaginea preluată.
Aplică funcții de procesare a imaginilor (oglindire și accentuare) folosind JavaScript.
Măsoară timpul de execuție pentru fiecare pas de procesare.

## Componente:

- Fișier HTML (index.html):
Conține structura paginii web, inclusiv canvas-ul pentru afisșarea imaginii și locațiile pentru informațiile JSON.
Conectează fișierele CSS și JavaScript pentru stilizare și funcționalitate.

- Fișier CSS (styles.css):
Definește stiluri de bază pentru elemente precum fonturi, aspectul paginii și canvas-ul.

- Fișier JavaScript (script.js):
Preia o imagine de la un endpoint specificat al API-ului și afișează informațiile sale JSON pe pagină.
Implementează funcțiile de procesare a imaginilor: oglindire și accentuare.
Măsoară timpul de execuție pentru fiecare pas de procesare și informează utilizatorul cu timpii corespunzători.

## Utilizare:
Deschide index.html într-un browser web.
Aplicația preia automat o imagine de la API-ul specificat.
Informațiile JSON despre imaginea preluată sunt afișate sub canvas.
Efectele de procesare a imaginilor (oglindire și accentuare) sunt aplicate succesiv, iar utilizatorul este informat cu privire la timpii de execuție.

##Instrucțiuni pentru Execuție:
Asigură-te că ai o conexiune la internet activă.
Modifică endpoint-ul API-ului din fișierul JavaScript (script.js) pentru a prelua imagini din alte surse.

## Bibliografie:
https://en.wikipedia.org/wiki/Unsharp_masking
JavaScript Mastery : canal de youtube
cursul TW
