async function getImageFromAPI() {
    try {
        // Preluam o poza de la API
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();
        displayJSONComponents(data);
        return data.message; 
        
    } catch (error) {
        console.error('Error fetching image URL:', error);
        return null;
        // Returnam NULL in cazul unei erori
    }
}

async function loadImage() {
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const img = document.getElementById('sourceImage');

    try {
        // Preluam URL-ul imaginii de la API
        const imageURL = await getImageFromAPI();

        if (imageURL) {
            // Permitem folosirea resurselor de la mai multe origini si inacram imaginea
            img.crossOrigin = 'anonymous';
            img.onload = async function () {

                // Desenam imaginea in canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                // Masuram timpul pentru functia de oglindire
                const mirrorStartTime = performance.now();
                await mirrorImage(ctx, canvas);
                const mirrorEndTime = performance.now();
                // Masuram timpul pentru functia de sharpening + intervalul de asteptare intre cele 2 functii
                const sharpeningStartTime = performance.now();
                await new Promise(resolve => setTimeout(resolve, 5000)); // Simulam intarzierea intre cele 2 functii
                await sharpenImage(ctx, canvas);
                const sharpeningEndTime = performance.now();

                const mirrorExecutionTime = mirrorEndTime - mirrorStartTime;
                const sharpeningExecutionTime = sharpeningEndTime - sharpeningStartTime;
                // Afisam timpii de executie
                alert(`Timpul de executie pentru mirror este de ${mirrorExecutionTime} milisecunde si timpul de executie pentru sharpening este de ${sharpeningExecutionTime} milisecunde`);
            };
            img.src = imageURL; // Setam sursa imaginii
        } else {
            console.log('Failed to get image URL');
        }
    } catch (error) {
        console.error('Error loading image:', error);
    }
}

// Apelul functiei de procesare a imaginii
loadImage();

function displayJSONComponents(data){ // Functie ce afiseaza datele JSON-ului in browser
    const jsonComponentsDiv = document.getElementById('jsonComponents');
    jsonComponentsDiv.innerHTML = ''; // Curatam continutul anterior

    if(!data){
        jsonComponentsDiv.textContent = 'Nu e nimic aici.';
        return;
    }
    // Creem o lista de elemente (unordered list)
    const list = document.createElement('ul');
    // Iteram prin dontinutul JSON-ului
    for(const key in data){
        const listItem = document.createElement('li');
        listItem.textContent = `${key} : ${JSON.stringify(data[key])}`;
        list.appendChild(listItem);
    }
    jsonComponentsDiv.appendChild(list);
}

function mirrorImage(ctx, canvas) { // Functia de oglindire
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const pixelsPerSection = width * height / 4;
    const sectionWidth = width ;
    const sectionHeight = height / 4;

    let currentSection = 0;
    // Impartim canvasul in 4 fasii pe care le oglindim conform cerintei 
    function processSection() {
        
        const sectionStartX = currentSection * sectionWidth * sectionHeight;

        for (let y = 0; y < sectionHeight; y++) {
            for (let x = 0; x < sectionWidth / 2; x++) {
                
                const leftIndex = (y * sectionWidth + (sectionStartX + x)) * 4;
                const rightIndex = (y * sectionWidth + (sectionStartX + sectionWidth - x - 1)) * 4;

                for (let i = 0; i < 4; i++) {
                    const temp = data[leftIndex + i];
                    data[leftIndex + i] = data[rightIndex + i];
                    data[rightIndex + i] = temp;
                }
            }
        }

        ctx.putImageData(imageData, 0, 0); 
        currentSection++;

        if (currentSection < 4) {
            setTimeout(processSection, 1000); 
        }
    }

    processSection();
}

function sharpenImage(ctx, canvas) { // Functia pentru a pune efectul de sharpening 
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    const kernel = [ // Masca de convolutie
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
    ];
    const kernelSize = 3;
    const halfKernel = Math.floor(kernelSize / 2);
    const newData = new Uint8ClampedArray(data.length);

    function isInside(x, y) { // Functie ce verifica daca am depasit dimensiunea canvasului
        return x >= 0 && x < width && y >= 0 && y < height;
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            for (let c = 0; c < 4; c++) { 
                if (c === 3) { // nu implementam convolutia pentru indexul de transparenta al unui pixel
                    const centerPixelIndex = (y * width + x) * 4 + c;
                    newData[centerPixelIndex] = data[centerPixelIndex];
                    continue;
                }

                let sum = 0;
                for (let ky = 0; ky < kernelSize; ky++) {
                    for (let kx = 0; kx < kernelSize; kx++) {
                        const imgX = x + kx - halfKernel;
                        const imgY = y + ky - halfKernel;
                        if (isInside(imgX, imgY)) {
                            const pixelIndex = (imgY * width + imgX) * 4 + c;
                            const kernelValue = kernel[ky][kx];
                            sum += data[pixelIndex] * kernelValue;
                        }
                    }
                }
                const centerPixelIndex = (y * width + x) * 4 + c;
                // "Normam" rezultatul convolutiei
                newData[centerPixelIndex] = Math.min(255, Math.max(0, sum));
            }
        }
    }
    
    for (let i = 0; i < data.length; i++) {
        data[i] = newData[i];
    }

    ctx.putImageData(imageData, 0, 0);
}


