import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import getStarfield from '../Data/src/getStarfield.js';


import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'jsm/geometries/TextGeometry.js';

import { CSS3DRenderer, CSS3DObject } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/renderers/CSS3DRenderer.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

const video = document.createElement('video');

const aFrame = document.getElementById('cena');
const back = document.getElementById('hideScene');

const compass = document.getElementById('compass');
const main = document.getElementById('main');
const data_scene = document.getElementById('cenarioinfo');


const MAIN = document.getElementById("main");
const INTRO = document.getElementById("Intro");

const cena = document.querySelector('a-scene');
const backButton = document.querySelector('#backButton');
const backVR = document.querySelector('#backVR');
const textVR = document.querySelector('#locationName');

cena.addEventListener('enter-vr', () => {

  console.log("VR entrou");
  backButton.setAttribute('visible', true); 
  textVR.setAttribute('visible', true); 
});

cena.addEventListener('exit-vr', () => {
  console.log("VR saiu");
  backButton.setAttribute('visible', false);
  textVR.setAttribute('visible', false); 
});

backButton.addEventListener('click', () => {

  if (cena && cena.exitVR) {
    cena.exitVR();  
  }
});

document.getElementById('enterBtn').addEventListener('click', () => {
    console.log("Enter");


        MAIN.style.transition = "0.5s ease-in-out";
        INTRO.style.transition = "1s ease-in-out";

      
        MAIN.style.opacity = 0;
        INTRO.style.opacity = 0;
        

        setTimeout( () => {
            MAIN.style.display = "block";
            MAIN.style.opacity = 1;
        }, 500)
        
        setTimeout( () => {
            INTRO.style.display = "none";
        }, 1000)
});





renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.domElement.classList.add('universe');

//---------------------------------------------------------//


const lightGroup = new THREE.Group();
scene.add(lightGroup);

///------------------------------------------------------------------------ THREE.JS
const light = new THREE.DirectionalLight(0xffffff, 3.5);
light.position.set(0, 1, 0.5).normalize();
lightGroup.add(light);

let sphereT1;
let sphereT2;

let sphereT3;
let sphereT4;

let sphereT5;
let sphereT6;

let sphereT7;

let sphere2;// camada1
let sphere3;// camada2

let sphere4;// camada1
let sphere6;// camada2

let sphere7;// camada1
let sphere8;// camada2

let sphere9;// camada1
let sphere10;// camada2

let sphere11;// camada1
let sphere12;// camada2



let sphere20; // Nuvem
let sphere5; // camada azul



let continente_detetado; 


function createAtmosphere(diameter, color, opacity) {
    const geometry = new THREE.SphereGeometry(diameter / 2, 64, 64);
    const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: opacity,
        depthWrite: false, // Evita que a camada interfira na profundidade
        side: THREE.DoubleSide // Renderiza os dois lados
    });

    return new THREE.Mesh(geometry, material);
}


function createCustomSphereColor(diameter, color, divisor) {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const normals = [];

    const radius = diameter / 2;

    for (let n = 0; n < divisor; n++) {
        for (let v = 0; v < divisor; v++) {
            const theta1 = n * Math.PI / divisor;
            const theta2 = (n + 1) * Math.PI / divisor;
            const phi1 = v * 2 * Math.PI / divisor;
            const phi2 = (v + 1) * 2 * Math.PI / divisor;

            // Pontos da malha
            const points = [
                esfToCarte(radius, theta1, phi1),
                esfToCarte(radius, theta1, phi2),
                esfToCarte(radius, theta2, phi2),
                esfToCarte(radius, theta2, phi1)
            ];

            const indices = [0, 1, 2, 0, 2, 3];

            for (let idx of indices) {
                positions.push(...points[idx]);
                normals.push(...normalize(points[idx])); // Normal para iluminação
            }
        }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

    // Criar material apenas com cor
    const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(color),
        colorE: new THREE.Color(0xff0000), // Remove .setStyle()
        //shininess: 10, 
        transparent: true,
        opacity: 0.125,
       
    });

    return new THREE.Mesh(geometry, material);
}



function createCustomSphereText(diameter, textureURL, divisor) {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const normals = [];
    const uvs = [];

    const radius = diameter / 2;

    for (let n = 0; n < divisor; n++) {
        for (let v = 0; v < divisor; v++) {
            const theta1 = n * Math.PI / divisor;
            const theta2 = (n + 1) * Math.PI / divisor;
            const phi1 = v * 2 * Math.PI / divisor;
            const phi2 = (v + 1) * 2 * Math.PI / divisor;

            // Pontos da malha
            const points = [
                esfToCarte(radius, theta1, phi1),
                esfToCarte(radius, theta1, phi2),
                esfToCarte(radius, theta2, phi2),
                esfToCarte(radius, theta2, phi1)
            ];

            const uvPoints = [
                [1 - (v / divisor), 1 - (n / divisor)],
                [1 - ((v + 1) / divisor), 1 - (n / divisor)],
                [1 - ((v + 1) / divisor), 1 - ((n + 1) / divisor)],
                [1 - (v / divisor), 1 - ((n + 1) / divisor)]
            ];

            const indices = [0, 1, 2, 0, 2, 3];

            for (let idx of indices) {
                positions.push(...points[idx]);
                normals.push(...normalize(points[idx])); // Normal para iluminação
                uvs.push(...uvPoints[idx]);
            }
        }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    // Carregar textura
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(textureURL, (tex) => {
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Melhora qualidade em ângulos
        tex.minFilter = THREE.LinearMipMapLinearFilter; // Padrão que pode causar desfoque
        tex.magFilter = THREE.LinearFilter; // Usa linear para ampliar
        tex.minFilter = THREE.LinearFilter; // Remove mipmaps
        tex.generateMipmaps = false;
    });

    texture.encoding = THREE.sRGBEncoding;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshPhongMaterial({
        map: texture,
        // metalness: 0.5,  // Para realçar o brilho
        // roughness: 0.8,
        shininess: 10, 
        transparent: true,
    });

    return new THREE.Mesh(geometry, material);
}

// serve para converter coordenadas esféricas em cartesianas
function esfToCarte(r, theta, phi) {
    return [
        r * Math.sin(theta) * Math.cos(phi),
        r * Math.cos(theta),
        r * Math.sin(theta) * Math.sin(phi)
    ];
}

// Normaliza um vetor
function normalize(vec) {
    const len = Math.hypot(...vec);
    return vec.map(v => v / len);
}

// Adicionar à cena as esferas que constroiem o planeta
// Agrupar as esferas numa variável
const group = new THREE.Group();

// Terra
sphereT1 = createCustomSphereText(9, "Data/Final/Earth/Camada1950.jpg", 42);
group.add(sphereT1);

sphereT2 = createCustomSphereText(9, "Data/Final/Earth/Camada1975.jpg", 42);
group.add(sphereT2);

sphereT3 = createCustomSphereText(9, "Data/Final/Earth/Camada2000.jpg", 42);
group.add(sphereT3);

sphereT4 = createCustomSphereText(9, "Data/Final/Earth/Camada2025.jpg", 42);
group.add(sphereT4);

sphereT5 = createCustomSphereText(9, "Data/Final/Earth/Camada2050.jpg", 42);
group.add(sphereT5);

sphereT6 = createCustomSphereText(9, "Data/Final/Earth/Camada2075.jpg", 42);
group.add(sphereT6);

sphereT7 = createCustomSphereText(9, "Data/Final/Earth/Camada2100.jpg", 42);
group.add(sphereT7);

// Camada1 Base 2040
sphere2 = createCustomSphereText(9.01, "Data/Final/Base/2040.png", 42);
group.add(sphere2);

// Camada2 Base 2055
sphere3 = createCustomSphereText(9.0125, "Data/Final/Base/2055.png", 42);
group.add(sphere3);



// 2065-------------------------------


// Camada3 Red 2065 - Red
sphere4 = createCustomSphereText(9.015, "Data/Final/Red/red2065.png", 42);
group.add(sphere4);

// Camada3 yellow 2065 - Yellow
sphere6 = createCustomSphereText(9.0175, "Data/Final/Yellow/Yellow_2065.png", 42);
group.add(sphere6);


// 2075-------------------------------


// Camada3 Red 2075 - Red
sphere7 = createCustomSphereText(9.02, "Data/Final/Red/red2075.png", 42);
group.add(sphere7);

// Camada3 yellow 2075 - Yellow
sphere8 = createCustomSphereText(9.0225, "Data/Final/Yellow/Yellow_2075.png", 42);
group.add(sphere8);


// 2085-------------------------------

// Camada3 Red 2085 - Red
sphere9 = createCustomSphereText(9.0250, "Data/Final/Red/red2085.png", 42);
group.add(sphere9);

// Camada3 yellow 2085 - Yellow
sphere10 = createCustomSphereText(9.0275, "Data/Final/Yellow/Yellow_2085.png", 42);
group.add(sphere10);


// 2095-------------------------------

// Camada3 Red 2095 - Red
sphere11 = createCustomSphereText(9.03, "Data/Final/Red/red2085.png", 42);
group.add(sphere11);

// Camada3 yellow 2095 - Yellow
sphere12 = createCustomSphereText(9.0325, "Data/Final/Yellow/Yellow_2085.png", 42);
group.add(sphere12);


//Nuvem
sphere20 = createCustomSphereText(9.13, "Data/clouds_test1.png", 42);
group.add(sphere20);

//Nuvem
sphere5 = createCustomSphereColor(9.2, 0x005499, 42);
group.add(sphere5);

const atmosphere = createAtmosphere(9.25, 0x66ccff, 0.15);
group.add(atmosphere);

// Adicionar o grupo à cena
scene.add(group);
group.position.set(0, 0, 0); //cheguei-o um bocado para baixo


camera.position.z = 8.90;

let opac1 = true;
let opac2 = true;

//Adicionar estrelas
const estrelas = getStarfield({numStars: 600});
scene.add(estrelas);




//------------------------------------- Atualizar bússula
const cameraB = document.querySelector('[camera]');

function updateCompass() {
  const rotation = cameraB.getAttribute('rotation');
  const heading = -rotation.y; 
  document.getElementById('compass-pointer').style.transform = `rotate(${heading}deg)`;
}

setInterval(updateCompass, 50);

function setOpacity(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.style.opacity = value;
    }
}



// CONTROLLS e CCamera e elementos

let elementosG = document.querySelectorAll('.layP');
let elementosC = document.querySelectorAll('.layP2');


let handControlsEnabled = false;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.enableZoom = false; // Desativar o zoom normal para controlá-lo manualmente
controls.enableRotate = true; 
controls.target.set(0, 0, 0); // Alvo group

const MIN_DISTANCE = 6.5;
const MAX_DISTANCE = 8.65;
const ZOOM_SMOOTHNESS = 0.2; 

let etapa = 0;



// Gestos



// Código para os botões abrirem e fecharem as respectivas caixas

// Caixa - Pollution and Emissions e redondo Air Quality
let visivel = true;

document.getElementById('botao_PollutionandEmissions').addEventListener('click', function() {
    const elemento_caixa = document.getElementById('Elemento1');
    const elemento_bola = document.getElementById('Elemento7');

    if (visivel) {
        elemento_caixa.style.transform = 'scale(0)';
        elemento_bola.style.transform = 'scale(0)';
        document.getElementById('botao_PollutionandEmissions').style.opacity='0.5';
    } else {
        elemento_caixa.style.transform = 'scale(1)';
        elemento_bola.style.transform = 'scale(1)';
        document.getElementById('botao_PollutionandEmissions').style.opacity='1';
    }
    visivel = !visivel; 
});



// Caixa - Population and Resources e redondo Population
let visivel2 = true;

document.getElementById('botao_PopulationandResources').addEventListener('click', function() {
    const elemento_caixa = document.getElementById('Elemento3');
    const elemento_bola = document.getElementById('Elemento10');

    if (visivel2) {
        elemento_caixa.style.transform = 'scale(0)';
        elemento_bola.style.transform = 'scale(0)';
        document.getElementById('botao_PopulationandResources').style.opacity='0.5';
    } else {
        elemento_caixa.style.transform = 'scale(1)';
        elemento_bola.style.transform = 'scale(1)';
        document.getElementById('botao_PopulationandResources').style.opacity='1';
    }

    visivel2 = !visivel2; 
});

// Caixa - Climate and Atmosphere e redondo Hummidity
let visivel3 = true;

document.getElementById('botao_ClimateandAtmosphere').addEventListener('click', function() {
    const elemento_caixa = document.getElementById('Elemento2');
    const elemento_bola = document.getElementById('Elemento8');

    if (visivel3) {
        elemento_caixa.style.transform = 'scale(0)';
        elemento_bola.style.transform = 'scale(0)';
        document.getElementById('botao_ClimateandAtmosphere').style.opacity='0.5';
    } else {
        elemento_caixa.style.transform = 'scale(1)';
        elemento_bola.style.transform = 'scale(1)';
        document.getElementById('botao_ClimateandAtmosphere').style.opacity='1';
    }

    visivel3 = !visivel3; 
});

// Caixa - NaturalChanges and Disasters e redondo Undefined?
let visivel4 = true;

document.getElementById('botao_NaturalChanges').addEventListener('click', function() {
    const elemento_caixa = document.getElementById('Elemento6');

    if (visivel4) {
        elemento_caixa.style.transform = 'scale(0)';
        document.getElementById('botao_NaturalChanges').style.opacity='0.5';
    } else {
        elemento_caixa.style.transform = 'scale(1)';
        document.getElementById('botao_NaturalChanges').style.opacity='1';
    }

    visivel4 = !visivel4; 
});


// Caixa - Continentes

let visivel5 = true;

document.getElementById('botao_Continentes').addEventListener('click', function() {
    const elemento_caixa = document.getElementById('Elemento4');

    if (visivel5) {
        elemento_caixa.style.transform = 'scale(0)';
        document.getElementById('botao_Continentes').style.opacity='0.5';
    } else {
        elemento_caixa.style.transform = 'scale(1)';
        document.getElementById('botao_Continentes').style.opacity='1';
    }

    visivel5 = !visivel5; 
});



let currentDistance = camera.position.distanceTo(controls.target);

//--------------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------------//
renderer.domElement.addEventListener('wheel', (event) => { //Assim as caixas começam noutra posição, porque isto só começa a 
// atualizar quando fazemos scroll
    event.preventDefault();
    
    const delta = -event.deltaY * 0.01; // Sensibilidade
    const direction = new THREE.Vector3()
        .subVectors(camera.position, controls.target)
        .normalize();
    
        currentDistance = camera.position.distanceTo(controls.target);
        
    let targetDistance = currentDistance * (1 + delta);

    if (currentDistance > 7.5) {
        etapa = 0;
        
            
        /*elementosC.forEach(element => {
            element.style.transform = 'scale(0)';
        });

    setOpacity('botao_PollutionandEmissions', '1');
    setOpacity('botao_PopulationandResources', '1');
    setOpacity('botao_ClimateandAtmosphere', '1');
    setOpacity('botao_NaturalChanges', '1');*/


        /*elementosG.forEach(element => {
            element.style.transform = 'scale(1)';
        });*/
       
    } else {
        etapa = 1;

        if (visivel){document.getElementById('botao_PollutionandEmissions').click();}
        if (visivel2){document.getElementById('botao_PopulationandResources').click();}
        if (visivel3){document.getElementById('botao_ClimateandAtmosphere').click();}
        if (visivel4){document.getElementById('botao_NaturalChanges').click();}

        /*elementosG.forEach(element => {
            element.style.transform = 'scale(0)';
        });
        

    setOpacity('botao_PollutionandEmissions', '0.5');
    setOpacity('botao_PopulationandResources', '0.5');
    setOpacity('botao_ClimateandAtmosphere', '0.5');
    setOpacity('botao_NaturalChanges', '0.5');


        elementosC.forEach(element => {
            element.style.transform = 'scale(1)';
        });*/
    }
    
    console.log(currentDistance);

    targetDistance = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, targetDistance));
    
    
    const smoothedDistance = THREE.MathUtils.lerp(
        currentDistance,
        targetDistance,
        ZOOM_SMOOTHNESS
    );
    
    camera.position.copy(controls.target)
        .add(direction.multiplyScalar(smoothedDistance));
}, { passive: false });




const controlHand = document.getElementById('controlHand');
const zoomHand = document.getElementById('zoomHand');

controlHand.style.opacity = 0.4;
zoomHand.style.opacity = 0.4;


let handposeModel;
var distPlan;

function map(value, start1, stop1, start2, stop2) {
    const denominator = stop1 - start1;

    // Evitar divisão por zero
    if (Math.abs(denominator) < 0.0001) {
        return start2; 
    }

    // Mapeamento seguro
    return ((value - start1) * (stop2 - start2)) / denominator + start2;
}

let handDetect = false;
let moment = 0;

let moment1 = 0;

const selectMov = 0; // 1 é para dar zoom, 2 é para mover o mundo

let thumbIni4 = 0;
let thumbIni3 = 0;
let thumbIni2 = 0;

let indexIni8 = 0;
let indexIni7 = 0;
let indexIni6 = 0;

let thumbTip4 = 0;
let thumbTip3 = 0;
let thumbTip2 = 0;

let indexTip8 = 0;
let indexTip7 = 0;
let indexTip6 = 0;

let distanceIni1 = 0;
let distanceIni2 = 0;

let distanceIni = 0;


let distmap = 0;

let iniP = 0;
let iniPx = 0;
let iniPy = 0;

let angY = 0;
let angX = 0;


let handStartX = 0;
let handStartY = 0;
let firstHandDetection = false; // Para evitar reset constante


// Iniciar webcam
async function setupMediaPipe() {
    const video = document.getElementById('video');

    const hands = new Hands({ locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(handleResults);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();

            const camera = new Camera(video, {
                onFrame: async () => {
                    await hands.send({ image: video });
                },
                width: video.videoWidth,
                height: video.videoHeight
            });
            camera.start();
        };
    } catch (err) {
        console.error("Erro ao acessar a webcam:", err);
    }
}

let previousZoom = 1;         
let previousRotation = 0;    

let initialPinchDistance = null;
let handReferenceScale = null;
let baseZoom = 1;


function handleResults(results) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];

        const p5 = landmarks[5];
        const p17 = landmarks[17];
        const p4 = landmarks[4];  
        const p8 = landmarks[8];  
        
        const isHandOpen = landmarks[8].y < landmarks[5].y && landmarks[12].y < landmarks[9].y;

        const isPinchGesture =
            landmarks[8].y < landmarks[6].y && 
            landmarks[12].y > landmarks[10].y && 
            landmarks[16].y > landmarks[14].y && 
            landmarks[20].y > landmarks[18].y;  

        if (isPinchGesture) {
            controlHand.style.opacity = 0.4;
            zoomHand.style.opacity = 1;

            const thumb = landmarks[4];
            const index = landmarks[8];
            const base5 = landmarks[5];
            const base17 = landmarks[17];

            const pinchDistance = Math.hypot(thumb.x - index.x, thumb.y - index.y);

            // Escala
            const currentHandScale = Math.hypot(base5.x - base17.x, base5.y - base17.y);

            if (!initialPinchDistance || !handReferenceScale) {
                initialPinchDistance = pinchDistance;
                handReferenceScale = currentHandScale;
                baseZoom = camera.zoom;
            }

            const relativePinch = (pinchDistance / currentHandScale);
            const initialRelativePinch = (initialPinchDistance / handReferenceScale);

            let zoomChange = (relativePinch - initialRelativePinch) / 2; // ajusta a sensibilidade
            const deadZone = 0.02;


            if (Math.abs(zoomChange) < deadZone) zoomChange = 0;
            zoomChange *= 2; // diminui a intensidade do zoom

            const targetZoom = baseZoom + zoomChange;
            const smoothZoom = camera.zoom + (targetZoom - camera.zoom) * 0.1; // suavizar

           camera.zoom = Math.max(1, Math.min(7.5, smoothZoom));
           camera.updateProjectionMatrix();

            const virtualDistance = 10 / camera.zoom;

            if (virtualDistance > 7.5) {
                etapa = 0;
                elementosC.forEach(element => element.style.transform = 'scale(0)');
                elementosG.forEach(element => element.style.transform = 'scale(1)');
            } else {
                etapa = 1;
                elementosG.forEach(element => element.style.transform = 'scale(0)');
                elementosC.forEach(element => element.style.transform = 'scale(1)');
            }

        } else if (isHandOpen) {

            console.log('Mão esticada detectada');
            controlHand.style.opacity = 1;
            zoomHand.style.opacity = 0.4;

            const xP = landmarks[9].x;
            const yP = landmarks[9].y;

            if (!firstHandDetection) {
                handStartX = xP;
                handStartY = yP;
                firstHandDetection = true;
            }

            handControlsEnabled = true;
            controls.enableRotate = false;

           const lineLength = calcDistance(p5, p17);  // Calcula a distância entre os pontos de referência (ajustável)
            console.log(lineLength);

            const scaleX = map(lineLength, 0.05, 0.5, 10, 2); 
            const scaleY = map(lineLength, 0.05, 0.5, 10, 2); 

            let mapX = map(xP - handStartX, -1000, 1000, 5.55 * scaleX, -5.55 * scaleX);
            let mapY = map(yP - handStartY, -600, 600, 5.55 * scaleY, -5.55 * scaleY);

            const eixoX = new THREE.Vector3(0, 1, 0);
            const eixoY = new THREE.Vector3(1, 0, 0);

            camera.position.applyAxisAngle(eixoX, mapX);
            camera.position.applyAxisAngle(eixoY, mapY);

            //light.position.copy(camera.position).normalize().multiplyScalar(10);

            controls.target.set(0, 0, 0);
            controls.update();
            updateClosestMarker();

        } else {
            // Nenhum gesto reconhecido
            controlHand.style.opacity = 0.4;
            zoomHand.style.opacity = 0.4;

            initialPinchDistance = null;
            handReferenceScale = null;
            baseZoom = camera.zoom;

            controlHand.style.opacity = 0.4;
            zoomHand.style.opacity = 0.4;
        }

    } else {
        controlHand.style.opacity = 0.4;
        zoomHand.style.opacity = 0.4;
    }
}

// Calcular distância (adaptada para objetos com propriedades x,y,z)
function calcDistance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.hypot(dx, dy);
}

// Inicializar
setupMediaPipe();



// ---- CONTENT TEXT/...




// Variável do ano

const anoActual = 2025; //Vou usar para começar em 2025, a outra não muda de inicio
const year = anoActual.toString();

const textGroup = new THREE.Group();
scene.add(textGroup);


let textMesh = null; 

// Carregar fonte
/*
const loader = new FontLoader();

loader.load('Font/Inter_Regular.json', function(font) {
    const textGeometry = new TextGeometry(year, {
        font: font,
        size: 2.5,       // Tamanho do texto
        height: 0,       // Altura da extrusão (0 = texto plano)
        curveSegments: 2 // Suavidade das curvas
    });

    // Material "2D" (sem luz, cor sólida)
    const textMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x9E6631, // Cor branca
        side: THREE.DoubleSide // Renderiza ambos os lados
    });

    textMesh = new THREE.Mesh(textGeometry, textMaterial);

    textGeometry.computeBoundingBox(); // Calcula as dimensões do texto
    const boundingBox = textGeometry.boundingBox;
    const textWidth = boundingBox.max.x - boundingBox.min.x; // Largura total
    const textHeight = boundingBox.max.y - boundingBox.min.y; // Altura total

    //textMesh.position.set(-textWidth / 2, 4, 0);

    textMesh.position.set(-4, 4, 0);

    textGroup.add(textMesh);

});

*/

// Circulo para mudar de ano
const geometry = new THREE.RingGeometry(5.5, 6, 64);  
const material = new THREE.MeshPhongMaterial({ color: 0xbb6b36, side: THREE.DoubleSide }); 

const ringMesh = new THREE.Mesh(geometry, material);

geometry.computeBoundingBox();
geometry.center();

ringMesh.position.set(0, -0.3, -0.1); // Posiciona a circunferência na cena

//scene.add(ringMesh);

///continentes


// Variável global para armazenar os dados JSON
let climateData = {};

function sphericalToCartesian(r, theta, phi) {
    return new THREE.Vector3(
        r * Math.sin(theta) * Math.cos(phi),
        r * Math.cos(theta),
        r * Math.sin(theta) * Math.sin(phi)
    );
}


const spriteMap = new THREE.TextureLoader().load('Data/seta.png');
const spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap });


const markers = [
    { name: "Asia", position: sphericalToCartesian(4.67, Math.PI / 2 - Math.PI / 7.5, Math.PI / 2), continent: "Asia" },
    { name: "America", position: sphericalToCartesian(4.67, Math.PI / 2 + 0.26, -2.05), continent: "America" },
    { name: "Europe", position: sphericalToCartesian(4.67, Math.PI / 4.5, Math.PI / 1.05), continent: "Europe" },
    { name: "Oceania", position: sphericalToCartesian(4.67, Math.PI /  1.3 - Math.PI / 6.25, Math.PI / 4), continent: "Oceania" },
    { name: "Africa", position: sphericalToCartesian(4.67, Math.PI / 2.5, Math.PI / 1.1), continent: "Africa" },
    { name: "America", position: sphericalToCartesian(4.67, Math.PI / 2 - Math.PI / 5, -Math.PI / 3), continent: "America2" },
    { name: "Arctic", position: sphericalToCartesian(4.67, Math.PI / 24, -Math.PI / 0.6), continent: "Arctic" },

];


const markerObjects = markers.map(markerData => { 
    const marker = new THREE.Sprite(spriteMaterial);
    marker.scale.set(0.2, 0.3, 0.3);
    marker.position.copy(markerData.position);
    marker.position.y -= 0; // Adicionei isto porque baixei o planeta

    if (markerData.continent === "Africa") {
    marker.visible = false;
    }
    if (markerData.continent === "Oceania") {
    marker.visible = false;
    }
    if (markerData.continent === "America2") {
    marker.visible = false;
    }

    scene.add(marker);
    return { object: marker, ...markerData };
});

const mTela = new THREE.Vector3(0, 0, -10); // Centro da tela normalizado


// INFORMAÇÃO GLOBAIS NAS CAIXAS - ASSOCIADAS AO JSON 
const regiao = "Global";
const regiao2 = "Europe";
let ano = 2025;



/*
const aumentar = document.getElementById("aumentaAno");
aumentar.addEventListener("click", () => {
    if (ano < 2100) {
        ano++;
        document.getElementById("Ano").textContent = String(ano);
        atualizarDados();
      
    }
});

const diminuir = document.getElementById("diminuiAno");
diminuir.addEventListener("click", () => {
    if (ano > 1950) {
        ano--;
        document.getElementById("Ano").textContent = String(ano);
        atualizarDados();
    
    }
});
*/

//------Variáveis para mudar as cores das caixas--------------------------------------------//
let population_value, Elemento3Value, continenteValue, PolutionsValue, climateValue, NaturalChangesValue,
FossilValue, NuclearValue, RenewablesValue, AirValue,  HumidityValue, dados_pictogramas;

function atualizarDados() {
    fetch("JSON/dadosfinais.json")
    .then(response => response.json())
    .then(data => {
        const ano_alterado = String(ano);
        const dados = data[regiao][ano_alterado];
        const dados2 = data[continente_detetado][ano_alterado];

        /**/
        // Variáveis - Pollution and Emissions
        document.getElementById("Greenhousegasemissions").textContent = 
        `${(dados.Greenhousegasemissions / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 })} Mt`;
        document.getElementById("CO2emissions").textContent = 
        `${(dados.CO2emissions / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 })} Mt`;


        document.getElementById("Mercury").textContent = `${dados.Mercury.toLocaleString()} t`;
        document.getElementById("Airquality").textContent = dados.Airquality;

        AirValue = dados.CO2emissions;
        HumidityValue = dados.Humidity;
        
        // Variáveis - Climate and Atmosphere
        document.getElementById("humidity").textContent = `${dados.Humidity.toLocaleString()} g/kg`;
        document.getElementById("Radiative").textContent = `${dados.Radiativeforcing.toLocaleString()}  W/m2`;
        document.getElementById("ozone").textContent = `${dados.Ozone.toLocaleString()} DU`;
        document.getElementById("temp").textContent = `${dados.Temperature} ºC`;
        
         
        // Variáveis - Population and Resources
        
        const croplandMilHa = dados.cropland / 1000;
        document.getElementById("Cropland").textContent =
        `${croplandMilHa.toFixed(1).replace('.', ',')} mil ha`;
        let minerals = dados.minerals;
        let displayValue = (minerals / 1_000_000).toFixed(2); // converte para milhões
        document.getElementById("Minerals").textContent = `${Number(displayValue).toLocaleString()} Mt`;
        document.getElementById("Renewable water").textContent = `${dados.Renewablewaterpc.toLocaleString()} m³`;

        /*
        document.getElementById("Fossil").textContent = `${dados.Fossilfconsumptionpc.toLocaleString()} kWh`;
        document.getElementById("Nuclear").textContent = `${dados.Nuclearpc.toLocaleString()} kWh`;
        document.getElementById("Renewables").textContent = `${dados.Renewablespc.toLocaleString()} kWh`;
        */

        FossilValue = dados.Fossilfconsumptionpc;
        NuclearValue = dados.Nuclearpc;
        RenewablesValue = dados.Renewablespc;


        
        // Variáveis - Natural changes and disasters
        document.getElementById("SeaLevel").textContent = `${dados.sealevelrise.toLocaleString()} mm`;
        document.getElementById("IceArtic").textContent = `${dados.Articice.toLocaleString()} km2`;        
        document.getElementById("Forestarea").textContent = `${dados.Forestarea.toLocaleString()} %`;
        
        // Variáveis - Por continente
        console.log("Continente detetado:", continente_detetado);

        document.getElementById("Population_2").textContent = `${dados2.populacao.toLocaleString()}`;
        

        // Variáveis - Bolas
        document.getElementById("population_bola").textContent = `${dados.populacao.toLocaleString()}`;
        
        Elemento3Value = dados.minerals;
        population_value = dados.populacao;
        continenteValue = dados2.populacao;
        PolutionsValue = dados.CO2emissions;
        climateValue = dados.Temperature;
        NaturalChangesValue = dados.sealevelrise;

        dados_pictogramas = dados2.pegada;
        atualizarPictogramas(dados_pictogramas);

        SVGPorContinente(continente_detetado);
    })
    .catch(error => {
        console.error('Erro ao carregar os dados:', error);
       });
    
}
atualizarDados();

let regiao_cenarios;
const vrText = document.getElementById('vrText');

function atualizarDadosCenarios() {
    fetch("JSON/data_scenarios.json")
    .then(response => response.json())
    .then(data => {
        const ano_alterado = String(ano);
        const regiao_local = regiao_cenarios;
        const dados = data[regiao_local][ano_alterado];

        document.getElementById("nome_cenarios").textContent = regiao_cenarios;
        vrText.setAttribute('value', regiao_cenarios);

        // Variáveis - Pollution and Emissions
        document.getElementById("temperatura_cenarios").textContent = `${dados.Temperature.toLocaleString()}`;
        document.getElementById("wind_cenarios").textContent = `${dados.Wind.toLocaleString()}`;
        document.getElementById("uv_cenarios").textContent = `${dados.UV_Index.toLocaleString()}`;
        document.getElementById("humidity_cenarios").textContent = `${dados.Humidity.toLocaleString()}`;
        document.getElementById("visibility_cenarios").textContent = `${dados.Visibility.toLocaleString()}`;
        document.getElementById("airquality_cenarios").textContent = `${dados.Air_Quality.toLocaleString()}`;
    })
    .catch(error => {
        console.error('Erro ao carregar os dados:', error);
      });
}






//---------------------------------------- Slider para mudar de ano

/*function YearSlider(){
  const slider = document.getElementById('slider');
  const handle = document.getElementById('handle');

  const minAno = 1950;
  const maxAno = 2100;

  const sliderWidth = slider.offsetWidth;
  const handleWidth = handle.offsetWidth;
  
  const maxPosition = sliderWidth - handleWidth;

  let dragging = false;

  handle.onmousedown = (e) => {
    dragging = true;
    document.onmousemove = (e) => {
      if (!dragging) return;

      const rect = slider.getBoundingClientRect();
      let x = e.clientX - rect.left - handleWidth / 2;

      x = Math.max(0, Math.min(x, maxPosition));

      handle.style.left = x + 'px';

      const percent = x / maxPosition;
      ano = Math.round(minAno + percent * (maxAno - minAno));
      document.getElementById("Ano").textContent = String(ano);
      atualizarDados();
      boxColor();

    };

    document.onmouseup = () => {
      dragging = false;
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
} */

  let slider;
  let spans;
  
  function updateActiveYear() {
      const containerRect = slider.getBoundingClientRect();
      const centerY = containerRect.top + containerRect.height / 2;
      const infoAno = document.getElementById("infoAno");
  
      let closestSpan = null;
      let closestDistance = Infinity;
  
      spans.forEach((span) => {
          const rect = span.getBoundingClientRect();
          const spanCenter = rect.top + rect.height / 2;
          const distance = Math.abs(centerY - spanCenter);

          
  
          if (distance < closestDistance) {
              closestDistance = distance;
              closestSpan = span;
          }

          const maxDistance = containerRect.height / 2;
          let opacity = 1 - (distance * 3) / (maxDistance * 0.7);
          opacity = Math.max(0.2, Math.min(1, opacity));
          const scale = 1 + (1 - distance / maxDistance) * 0.2;
  
          span.style.opacity = opacity;
          span.style.transform = `scale(${scale})`;
      });
  
      spans.forEach((s) => s.classList.remove("active"));
      if (closestSpan) {
          closestSpan.classList.add("active");
          ano = parseInt(closestSpan.dataset.year);
          atualizarDados(); 
          atualizarDadosCenarios();

      }
      document.getElementById("infoAno").textContent = String(ano);  
  }
  
  function YearSlider() {
      const minAno = 1950;
      const maxAno = 2100;
      const yearList = document.getElementById("year-list");
      slider = document.getElementById("slider");
  
      for (let year = minAno; year <= maxAno; year++) {
          const span = document.createElement("span");
          span.textContent = year;
          span.dataset.year = year;
          yearList.appendChild(span);
      }
  
      spans = yearList.querySelectorAll("span");


      slider.addEventListener("scroll", () => {
          updateActiveYear();
      });
  
      updateActiveYear();
  
      let isDragging = false;
      let startPos = 0;
  
      const handleMouseMove = (e) => {
          if (!isDragging) return;
          const diff = e.clientY - startPos;
          slider.scrollTop -= diff;
          startPos = e.clientY;
          updateActiveYear();
      };
  
      const handleMouseUp = () => {
          isDragging = false;
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
      };
  
      const handleMouseDown = (e) => {
          isDragging = true;
          startPos = e.clientY;
          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
      };
  
      slider.addEventListener("mousedown", handleMouseDown);
  }
  
  YearSlider();

  function scrollToYear(anoDesejado) {
    const targetSpan = Array.from(spans).find(
        (span) => parseInt(span.dataset.year) === anoDesejado
    );

    if (targetSpan) {
        const sliderRect = slider.getBoundingClientRect();
        const targetRect = targetSpan.getBoundingClientRect();

        // Distância do centro do span até o centro do slider
        const offset = (targetRect.top + targetRect.height / 2) - (sliderRect.top + sliderRect.height / 2);

        // Ajusta a rolagem do slider para centralizar o span
        slider.scrollTop += offset;

        updateActiveYear();
    }
}



function boxColor(){
    //--------------------------------------------------------------- Atualizar rodas de dados - População
     //teve que ser :(
    
    const population = document.getElementById("roda_population");
    const populationBorder = document.getElementById("roda_populationBorder");

    const EL10 =  document.getElementById("Elemento10");
    const populationText = EL10.querySelectorAll("span");

    const max = 12000000000;  


    const popPercent = Math.min(100, Math.max(0, (population_value / max) * 100));
    const percent_realValue = (100 - popPercent); //Para não ter os valores invertidos a mudar a roda

    const normalizedPop = Math.min(1, Math.max(0, population_value / max));

    const r = Math.round(255 * normalizedPop);
    const g = Math.round(255 * (1 - normalizedPop));
    const b = 50;

    const color1 = `rgb(${r * 0.8}, ${g * 0.8}, ${b})`;              
    const color2 = `rgb(${r * 0.2}, ${g * 0.2}, ${b * 0.2})`; 


    const lightColor2Pop = mixWithWhite(r, g, b * 2, 0.6 );
    
    
    population.style.background = `conic-gradient(
    ${color2} 0% ${percent_realValue}%,
    ${lightColor2Pop} ${percent_realValue}% 100%)`;

    //para os tracinhos em volta das rodas
    let borderGradient = "";
    for (let i = 0; i < 100; i += 5) {
    const darkStart = i;
    const darkEnd = i + 0.425;
    const lightStart = darkEnd;
    const lightEnd = i + 5;

    borderGradient += `
        ${color2} ${darkStart}% ${darkEnd}%,
        ${color1} ${lightStart}% ${lightEnd}%,`;
    }

    borderGradient = borderGradient.slice(0, -1);

    populationBorder.style.background = `conic-gradient(${borderGradient})`;

    populationText.forEach(span => {
        span.style.color = lightColor2Pop;
    });
    
    //--------------------------------------------------------------------------//

    //----------------------------------------------------------------- Roda Air Quality //
    
    const El7 = document.getElementById("Elemento7");
    const RodaAir = document.getElementById("roda_Air");
    const RodaAirBorder = document.getElementById("roda_AirBorder");

    const AirText = El7.querySelectorAll("span");
    const AirTitle = El7.querySelector(".title");

    const minCO2 = 0.031; 
    const maxCO2 = 0.1;   
    const AirMaxTon = 92351805405; 

    const normalizedAir = Math.min(1, Math.max(0, AirValue / AirMaxTon));
    const AirPercentValue = minCO2 + (maxCO2 - minCO2) * normalizedAir;

    const AirPercentText = `${AirPercentValue.toFixed(3)}%`;
    AirTitle.textContent = AirPercentText;

  
    const Airpercent_realValue = 100 - ((AirPercentValue - minCO2) / (maxCO2 - minCO2)) * 100;

    const rAir = Math.round(255 * normalizedAir);
    const gAir = Math.round(255 * (1 - normalizedAir));
    const bAir = 50;

    const color1Air = `rgb(${rAir * 0.8}, ${gAir * 0.8}, ${bAir})`;
    const color2Air = `rgb(${rAir * 0.2}, ${gAir * 0.2}, ${bAir * 0.2})`;

    const lightColor2Air = mixWithWhite(rAir, gAir, bAir * 2, 0.6 );

    RodaAir.style.background = `conic-gradient(
    ${color2Air} 0% ${Airpercent_realValue}%,
    ${lightColor2Air} ${Airpercent_realValue}% 100%)`;

    let borderGradientAir = "";
    for (let i = 0; i < 100; i += 5) {
    const darkStart = i;
    const darkEnd = i + 0.425;
    const lightStart = darkEnd;
    const lightEnd = i + 5;

    borderGradientAir += `
        ${color2Air} ${darkStart}% ${darkEnd}%,
        ${color1Air} ${lightStart}% ${lightEnd}%,`;
    }

    borderGradientAir = borderGradientAir.slice(0, -1);
    RodaAirBorder.style.background = `conic-gradient(${borderGradientAir})`;

    AirText.forEach(span => {
    span.style.color = lightColor2Air;
    });
    //-------------------------------------------------------------------------//


    
    //----------------------------------------------------------------- Roda Humidity //
    
    const El8 = document.getElementById("Elemento8");
    const RodaHumidity = document.getElementById("roda_Humidity");
    const RodaHumidityBorder = document.getElementById("roda_HumidityBorder");

    const HumidityText = El8.querySelectorAll("span");
    const HumidityTitle = El8.querySelector(".title");

    const HumidityMin = 4;
    const HumidityMax = 15;  

    const clampedHumidity = Math.max(HumidityMin, Math.min(HumidityValue, HumidityMax));

    const HumidityPercentValue = ((clampedHumidity - HumidityMin) / (HumidityMax - HumidityMin)) * 100;
    const HumidityPercentText = `${HumidityPercentValue.toFixed(1)}%`;
    HumidityTitle.textContent = HumidityPercentText;

    HumidityTitle.textContent = HumidityPercentText;
 
    const normalizedHumidity = (clampedHumidity - HumidityMin) / (HumidityMax - HumidityMin);
    const Humiditypercent_realValue = 100 - HumidityPercentValue;

    const rHum = Math.round(255 * normalizedHumidity);
    const gHum = Math.round(255 * (1 - normalizedHumidity));
    const bHum = 50;

    const color1Hum = `rgb(${rHum * 0.8}, ${gHum * 0.8}, ${bHum})`;              
    const color2Hum = `rgb(${rHum * 0.2}, ${gHum * 0.2}, ${bHum * 0.2})`; 


    const lightColor2Hum = mixWithWhite(rHum, gHum, bHum * 2, 0.6 );
    
    
    RodaHumidity.style.background = `conic-gradient(
    ${color2Hum} 0% ${Humiditypercent_realValue}%,
    ${lightColor2Hum} ${Humiditypercent_realValue}% 100%)`;

    //para os tracinhos em volta das rodas
    let borderGradientHum = "";
    for (let i = 0; i < 100; i += 5) {
    const darkStart = i;
    const darkEnd = i + 0.425;
    const lightStart = darkEnd;
    const lightEnd = i + 5;

    borderGradientHum += `
        ${color2Hum} ${darkStart}% ${darkEnd}%,
        ${color1Hum} ${lightStart}% ${lightEnd}%,`;
    }

    borderGradientHum = borderGradientHum.slice(0, -1);

    RodaHumidityBorder.style.background = `conic-gradient(${borderGradientHum})`;

    HumidityText.forEach(span => {
        span.style.color = lightColor2Hum;
    });

    


    //-------------------------------------------------------------------------//

    //--------------------------------------------------------------- Cor das caixas - Resources
    
    
    const elementoColor = document.getElementById("Elemento3"); //Population and Resources
    const elementoBarra = document.querySelector(".divG");
    const barras = elementoColor.querySelectorAll(".barra:not(#whiteBar)");

    const fundoGrafico = elementoColor.querySelector(".divG");

    const elementoText = elementoColor.querySelectorAll("span:not(.REN)");


    elementoColor

    //---------------------- Barras //
    const Fossil = document.getElementById("Fossil");
    const Nuclear = document.getElementById("Nuclear");
    const Renewables = document.getElementById("Renewables");


    /*FossilValue
    NuclearValue
    RenewablesValue Variáveis para aumentar as barras*/ 


    const FossilMax = 30000;
    const Fossilpercent = Math.min(1, Math.max(0, FossilValue / FossilMax));
    const NuclearMax = 3000;
    const Nuclearpercent = Math.min(1, Math.max(0, NuclearValue / NuclearMax));
    const RenewablesMax = 6000;
    const Renewablespercent = Math.min(1, Math.max(0, RenewablesValue / RenewablesMax));

    //Fossil
    const rF = Math.round(100 * Fossilpercent);
    const gF = Math.round(100 * (1 - Fossilpercent));
    const bF = 0; 
    //Nuclear
    const rN = Math.round(100 * Nuclearpercent);
    const gN = Math.round(100 * (1 - Nuclearpercent));
    const bN = 0; 
    //Renewables
    const rR = Math.round(100 * Renewablespercent);
    const gR = Math.round(100 * (1 - Renewablespercent));
    const bR = 0; 

    const CorFossil = mixWithWhite(rF * 2, gF * 1.8, bF + 30, (0.2 - 0.002 * rF));
    const CorNuclear = mixWithWhite(rN * 2, gN * 1.8, bN + 30, (0.2 - 0.002 * rN));
    const CorRenewables = mixWithWhite(rR * 2, gR * 1.8, bR + 30, (0.2 - 0.002 * rR));


    Fossil.style.backgroundColor = CorFossil;
    Nuclear.style.backgroundColor = CorNuclear;
    Renewables.style.backgroundColor = CorRenewables;



    Fossil.style.height = Math.round(100 * Fossilpercent) + "%";
    Nuclear.style.height = Math.round(100 * Nuclearpercent) + "%";
    Renewables.style.height = Math.round(100 * Renewablespercent) + "%";

    //---------------------- Fim das Barras //

    elementoColor.style.transition = "0.2s ease-in-out";

    const Elemento3Max = 30000000000;
    const Elemento3percent = Math.min(1, Math.max(0, Elemento3Value / Elemento3Max));

    const red = Math.round(100 * Elemento3percent);
    const green = Math.round(100 * (1 - Elemento3percent));
    const blue = 0; 

    const corFundo = mixWithWhite(red * 0.2, green * 0.2, blue, 0.05);

    fundoGrafico.style.backgroundColor = corFundo;

    
    barras.forEach(barra => {
        barra.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
        barra.style.transition = "0.2s ease-in-out";
    });

    elementoText.forEach(span => {
        span.style.transition = "0.2s ease-in-out";
        span.style.color = `rgb(${red * 2.2}, ${green * 2}, ${blue})`;
    });

    //--------------------------------------------------------------------------//

    //--------------------------------------------------------------- Cor das caixas
    
        //CONTINENTESSSSSS
    
    const continenteColor = document.getElementById("Elemento4"); //Continente
    const continenteBarra = continenteColor.querySelectorAll(".barra5 .bColor");

    const continenteText = continenteColor.querySelectorAll("span");

    continenteColor.style.transition = "0.2s ease-in-out";

    let continenteMax;

    if (continente_detetado == "Asia") {
         continenteMax = 8000000000;
    } else if (continente_detetado == "Oceania") {
        continenteMax = 100000000;
    } else if (continente_detetado == "America") {
        continenteMax = 1900000000;
    } else if (continente_detetado == "Europe") {
        continenteMax = 1000000000;
    } else if (continente_detetado == "Africa") {
        continenteMax = 4000000000;
    } else if (continente_detetado == "Arctic") {
        continenteMax = 200000;
    }

    const continentepercent = Math.min(1, Math.max(0, continenteValue / continenteMax));

    const red4 = Math.round(100 * continentepercent);
    const green4 = Math.round(100 * (1 - continentepercent));
    const blue4 = 0; 

    continenteBarra.forEach(div => {
        div.style.backgroundColor  = `rgb(${red4}, ${green4}, ${blue4})`;
        div.style.transition = "0.2s ease-in-out";
        });

    continenteText.forEach(span => {
        span.style.transition = "0.2s ease-in-out";
        span.style.color = `rgb(${red4 * 2.2}, ${green4 * 2}, ${blue4})`;
    });
    //--------------------------------------------------------------------------//


    //--------------------------------------------------------------- Cor das caixas
    
    
    const Element1Color = document.getElementById("Elemento1"); //Polutions and emissions
    const Element1Bar = Element1Color.querySelector(".barraT2");
    const Element1ColorText = Element1Color.querySelectorAll("span");

    Element1Color.style.transition = "0.2s ease-in-out";

    const Element1Max = 80000000000;
    const Element1percent = Math.min(1, Math.max(0, PolutionsValue / Element1Max));

    const red1 = Math.round(100 * Element1percent);
    const green1 = Math.round(100 * (1 - Element1percent));
    const blue1 = 0; 

    Element1Bar.style.backgroundColor = `rgb(${red1 * 2.2}, ${green1 * 2}, ${blue1})`;


    Element1ColorText.forEach(span => {
        span.style.transition = "0.2s ease-in-out";
        span.style.color = `rgb(${red1 * 2.2}, ${green1 * 2}, ${blue1})`;
    });
    //--------------------------------------------------------------------------//
    
    //--------------------------------------------------------------- Cor das caixas
    
    
    const Element2Color = document.getElementById("Elemento2"); //Climate and Atmosphere

    const Element2ColorText = Element2Color.querySelectorAll("span");

    Element2Color.style.transition = "0.2s ease-in-out";

    const minTemp = 13;
    const maxTemp = 17;

    const range = maxTemp - minTemp;
    const climateClamped = Math.min(maxTemp, Math.max(minTemp, climateValue));
    const Element2percent = (climateClamped - minTemp) / range;

    const red2 = Math.round(100 * Element2percent);
    const green2 = Math.round(100 * (1 - Element2percent));
    const blue2 = 0; 

    Element2ColorText.forEach(span => {
        span.style.transition = "0.2s ease-in-out";
        span.style.color = `rgb(${red2 * 2.2}, ${green2 * 2}, ${blue2})`;
    });

    
    //--------------------------------------------------------------------------//


    
    //--------------------------------------------------------------- Cor das caixas
    const Element6Color = document.getElementById("Elemento6"); //Natural changes and disasters 

    const Element6ColorText = Element6Color.querySelectorAll("span");

    Element1Color.style.transition = "0.2s ease-in-out";

    const minSeaLevel = -100;
    const maxSeaLevel = 250;

    const SeaLevelrange = maxSeaLevel - minSeaLevel;
    const SeaLevelClamped = Math.min(maxSeaLevel, Math.max(minSeaLevel, NaturalChangesValue));
    const Element6percent = (SeaLevelClamped - minSeaLevel) / SeaLevelrange;

    const red6 = Math.round(100 * Element6percent);
    const green6 = Math.round(100 * (1 - Element6percent));
    const blue6 = 0; 


    Element6ColorText.forEach(span => {
        span.style.transition = "0.2s ease-in-out";
        span.style.color = `rgb(${red6 * 2.2}, ${green6 * 2}, ${blue6})`;
    });
    //--------------------------------------------------------------------------// 
    //--------------------------------------------------------------- Cor do slider//
    const SliderColor = document.getElementById("giraAno");  
    const allSpans = SliderColor.querySelectorAll("span"); 

    const centerstick = SliderColor.querySelector(".center-stick"); 
    const centerBlock = SliderColor.querySelector(".center-marker"); 
    const blur = SliderColor.querySelector(".center-glow"); 

    SliderColor.style.transition = "0.2s ease-in-out";

    const minAno = 1950;
    const maxAno = 2100;

    const Anorange = maxAno - minAno;
    const AnoClamped = Math.min(maxAno, Math.max(minAno, ano));
    const Anopercent = (AnoClamped - minAno) / Anorange;

    const redAno = Math.round(100 * Anopercent);
    const greenAno = Math.round(100 * (1 - Anopercent));
    const blueAno = 0; 

    function mixWithWhite(r, g, b, percentWhite) {
        const mix = (val) => Math.round(val * (1 - percentWhite) + 255 * percentWhite);
        return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
    }

    const lightColor = mixWithWhite(redAno * 2, greenAno * 2, blueAno, 0.5);

    const lightColor2 = mixWithWhite(redAno * 2, greenAno * 2, blueAno, (0.4 - 0.005 * redAno) );

    centerstick.style.backgroundColor = lightColor;
    centerBlock.style.backgroundColor = lightColor;
    blur.style.backgroundImage = `linear-gradient(to bottom, rgb(${redAno}, ${greenAno}, ${blueAno}), #00ff6611)`;


    allSpans.forEach(span => {
        span.style.transition = "0.2s ease-in-out";
        if (span.classList.contains("active")) {
          span.style.color = lightColor2;
        } else {
          span.style.color = "white";
        }
    });

    


    //-------------------------------------------------------------------------//

    //------------------------------------------------------------------------- Cor dos bonecos//
    const pictogramas = document.querySelector(".pictogramas");
    const pictogramaElements = pictogramas.querySelectorAll(".pictograma svg");

    const maxPic = 80;
    const Picpercent = Math.min(1, Math.max(0, dados_pictogramas / maxPic));
    const redPic = Math.round(100 * Picpercent);
    const greenPic = Math.round(100 * (1 - Picpercent));
    const bluePic = 0;

    pictogramaElements.forEach(pic => {
    const parent = pic.closest(".pictograma");

    pic.style.transition = "0.2s ease-in-out";

    if (
        parent.classList.contains("pintado") ||
        parent.classList.contains("dez") ||
        parent.classList.contains("quarto") ||
        parent.classList.contains("metade") ||
        parent.classList.contains("tresquartos")
    ) {
        
        pic.style.color = `rgb(${redPic * 2.2}, ${greenPic * 2}, ${bluePic})`;
    } else {
        // Volta para branco
        pic.style.color = "#FFFFFF";
    }
    });

    //dados_pictogramas -> Value 


    //-------------------------------------------------------------------------//

    //----------------------------------------------------- Cor dos mapas -------------------//
    const mapColor = document.getElementById("mapa_svg");

    mapColor.style.color = `rgb(${red4 * 2.2}, ${green4 * 2}, ${blue4})`;

    //-------------------------------------------------------------------------//


    //----------------------------------------------------- Cor dos ICONS -------------------//

    //POLUIÇÃO
    const iconPollution = document.getElementById("botao_PollutionandEmissions");
    const iconPollutionStroke = iconPollution.querySelector("svg");
    const iconText = iconPollution.parentElement.querySelector("p");

    const lightColorICON = mixWithWhite(red1 * 2, green1 * 2.3, blue1 + 20, (0.4 - 0.005 * red1) );

    iconPollutionStroke.style.color = lightColorICON;

    iconPollution.style.backgroundColor = `rgba(${red1}, ${green1}, ${blue1}, 0.6)`;
    iconText.style.color = lightColorICON;

    //RECURSOS
    const iconRecursos = document.getElementById("botao_PopulationandResources");
    const iconRecursosStroke = iconRecursos.querySelector("svg");
    const iconRecursosText = iconRecursos.parentElement.querySelector("p");

    const lightColorICONRecursos = mixWithWhite(red * 2, green * 2.3, blue + 20, (0.4 - 0.005 * red) );

    iconRecursosStroke.style.color = lightColorICONRecursos;

    iconRecursos.style.backgroundColor = `rgba(${red}, ${green}, ${blue}, 0.6)`;
    iconRecursosText.style.color = lightColorICONRecursos;

    //CLIMATE
    const iconCLIMATE = document.getElementById("botao_ClimateandAtmosphere");
    const iconCLIMATEStroke = iconCLIMATE.querySelector("svg");
    const iconCLIMATEText = iconCLIMATE.parentElement.querySelector("p");

    const lightColorICONCLIMATE = mixWithWhite(red2 * 2, green2 * 2.3, blue2 + 20, (0.4 - 0.005 * red2) );

    iconCLIMATEStroke.style.color = lightColorICONCLIMATE;

    iconCLIMATE.style.backgroundColor = `rgba(${red2}, ${green2}, ${blue2}, 0.6)`;
    iconCLIMATEText.style.color = lightColorICONCLIMATE;

    //CHANGES
    const iconCHANGES = document.getElementById("botao_NaturalChanges");
    const iconCHANGESStroke = iconCHANGES.querySelector("svg");
    const iconCHANGESText = iconCHANGES.parentElement.querySelector("p");

    const lightColorICONCHANGES = mixWithWhite(red6 * 2, green6 * 2.3, blue6 + 20, (0.4 - 0.005 * red6) );

    iconCHANGESStroke.style.color = lightColorICONCHANGES;

    iconCHANGES.style.backgroundColor = `rgba(${red6}, ${green6}, ${blue6}, 0.6)`;
    iconCHANGESText.style.color = lightColorICONCHANGES;

    //CONTINENTE
    const iconCONTINENTE = document.getElementById("botao_Continentes");
    const iconCONTINENTEStroke = iconCONTINENTE.querySelector("svg");
    const iconCONTINENTEText = iconCONTINENTE.parentElement.querySelector("p");

    const lightColorICONCONTINENTE = mixWithWhite(red4 * 2, green4 * 2.3, blue4 + 20, (0.4 - 0.005 * red4) );

    iconCONTINENTEStroke.style.color = lightColorICONCONTINENTE;

    iconCONTINENTE.style.backgroundColor = `rgba(${red4}, ${green4}, ${blue4}, 0.6)`;
    iconCONTINENTEText.style.color = lightColorICONCONTINENTE;

    //-------------------------------------------------------------------------//

}

function loopBoxColor() {
  boxColor();
  requestAnimationFrame(loopBoxColor);
}

window.onload = () => {
  boxColor();
  loopBoxColor(); // inicia o loop
};


light.position.set(0, 1, 0.5).multiplyScalar(200);

function getBlinkOpacity(speed = 2) {
    return Math.abs(Math.sin(performance.now() * 0.001 * speed)); // entre 0 e 1
}

function animate() {
    let cena = map(currentDistance, 8.64, 6.5, 1, 0);
    sphere20.material.opacity = cena;

    requestAnimationFrame(animate);

    lightGroup.position.copy(camera.position);
    lightGroup.quaternion.copy(camera.quaternion);

    light.target.position.set(0, 0, 0);
    
const blinkOpacity = getBlinkOpacity(); // você pode passar a velocidade: getBlinkOpacity(3)

if(ano >= 1975 && ano < 2000){
    sphereT1.material.opacity = 0;
    sphereT2.material.opacity = 1;
    sphereT3.material.opacity = 0;
    sphereT4.material.opacity = 0;
    sphereT5.material.opacity = 0;
    sphereT6.material.opacity = 0;
    sphereT7.material.opacity = 0;
}else if(ano >= 2000 && ano < 2025){
    sphereT1.material.opacity = 0;
    sphereT2.material.opacity = 0;
    sphereT3.material.opacity = 1;
    sphereT4.material.opacity = 0;
    sphereT5.material.opacity = 0;
    sphereT6.material.opacity = 0;
    sphereT7.material.opacity = 0;
}else if(ano >= 2025 && ano < 2050){
    sphereT1.material.opacity = 0;
    sphereT2.material.opacity = 0;
    sphereT3.material.opacity = 0;
    sphereT4.material.opacity = 1;
    sphereT5.material.opacity = 0;
    sphereT6.material.opacity = 0;
    sphereT7.material.opacity = 0;
}else if(ano >= 2050 && ano < 2075){
    sphereT1.material.opacity = 0;
    sphereT2.material.opacity = 0;
    sphereT3.material.opacity = 0;
    sphereT4.material.opacity = 0;
    sphereT5.material.opacity = 1;
    sphereT6.material.opacity = 0;
    sphereT7.material.opacity = 0;
}else if(ano >= 2075 && ano < 2085){
    sphereT1.material.opacity = 0;
    sphereT2.material.opacity = 0;
    sphereT3.material.opacity = 0;
    sphereT4.material.opacity = 0;
    sphereT5.material.opacity = 0;
    sphereT6.material.opacity = 1;
    sphereT7.material.opacity = 0;
}else if(ano >= 2085){
    sphereT1.material.opacity = 0;
    sphereT2.material.opacity = 0;
    sphereT3.material.opacity = 0;
    sphereT4.material.opacity = 0;
    sphereT5.material.opacity = 0;
    sphereT6.material.opacity = 0;
    sphereT7.material.opacity = 1;
}else{
    sphereT1.material.opacity = 1;
    sphereT2.material.opacity = 0;
    sphereT3.material.opacity = 0;
    sphereT4.material.opacity = 0;
    sphereT5.material.opacity = 0;
    sphereT6.material.opacity = 0;
    sphereT7.material.opacity = 0;
}



// Exemplo com sphere2
if (ano > 2040) {
    sphere2.material.transparent = true;
    sphere2.material.opacity = blinkOpacity;
} else {
    sphere2.material.opacity = 0;
}

// sphere3
if (ano > 2055) {
    sphere3.material.transparent = true;
    sphere3.material.opacity = blinkOpacity;
} else {
    sphere3.material.opacity = 0;
}

// sphere4 & sphere6
if (ano > 2065) {
    sphere4.material.transparent = true;
    sphere6.material.transparent = true;
    sphere4.material.opacity = blinkOpacity;
    sphere6.material.opacity = blinkOpacity;
} else {
    sphere4.material.opacity = 0;
    sphere6.material.opacity = 0;
}

// sphere7 & sphere8
if (ano > 2075) {
    sphere7.material.transparent = true;
    sphere8.material.transparent = true;
    sphere7.material.opacity = blinkOpacity;
    sphere8.material.opacity = blinkOpacity;
} else {
    sphere7.material.opacity = 0;
    sphere8.material.opacity = 0;
}

// sphere9 & sphere10
if (ano > 2085) {
    sphere9.material.transparent = true;
    sphere10.material.transparent = true;
    sphere9.material.opacity = blinkOpacity;
    sphere10.material.opacity = blinkOpacity;
} else {
    sphere9.material.opacity = 0;
    sphere10.material.opacity = 0;
}

// sphere11 & sphere12
if (ano > 2095) {
    sphere11.material.transparent = true;
    sphere12.material.transparent = true;
    sphere11.material.opacity = blinkOpacity;
    sphere12.material.opacity = blinkOpacity;
} else {
    sphere11.material.opacity = 0;
    sphere12.material.opacity = 0;
}

    /*
    if (sphere2) {
        if (opac1) {
            sphere2.material.opacity += 0.05;
            if (sphere2.material.opacity >= 1) opac1 = false;
        } else {
            sphere2.material.opacity -= 0.05;
            if (sphere2.material.opacity <= 0) opac1 = true;
        }
    }

    if (sphere3) {
        if (opac2) {
            sphere3.material.opacity += 0.05;
            if (sphere3.material.opacity >= 1) opac2 = false;
        } else {
            sphere3.material.opacity -= 0.05;
            if (sphere3.material.opacity <= 0) opac2 = true;
        }
    }

    */
    // Continua a rotação
    [sphereT1, sphere2, sphere3].forEach(sphere => {
        if (sphere) {
            sphere.rotation.x = angY
            sphere.rotation.y = angX
        };
    });
    if (handControlsEnabled) {
        controls.update();
    }

    /*
    sphere4.rotation.x = angY;
    sphere4.rotation.y += 0.00015;
    */

    sphere20.rotation.y += 0.00015;

    estrelas.rotation.y += 0.00015;


    updateClosestMarker();
    renderer.render(scene, camera);
    //textGroup.quaternion.copy(camera.quaternion).invert();

    //textMesh.quaternion.copy(camera.quaternion);

    controls.update();

    //anoActual++;
    //year = anoActual.toString();
}

function cameraposition(vec){
    if((camera.position.z < 8.65 && vec > 0) || (camera.position.z > 6.5 && vec < 0)){
        camera.position.z += vec;
        //console.log(camera.position.z);
    }
}

const dist = 0;

scene.position.x = dist;
light.position.x = -(dist);

[sphereT1, sphere2, sphere3].forEach(sphere => {
        if (sphere) sphere.rotation.x += 0.5;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


animate();

///// alterar conteudo -------------------------------------------------------------------------------------------------------------------------------------------------------------------------


function Update(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }
  

  function updateBar(id, percent, quantidade) {
    const bar = document.getElementById(id);
    if (bar) bar.style.width = percent + '%';

    if (id == "barra1") { // Oxigénio (O2)
        if (quantidade > 20.93) { 
            bar.style.backgroundColor = "rgb(50,200,50)"; // Normal
        } else if (quantidade > 20.90) {
            bar.style.backgroundColor = "rgb(200,200,50)"; // Pouco Grave
        } else {
            bar.style.backgroundColor = "rgb(200,50,50)"; // Grave
        }
    } else if (id == "barra2") { // Dióxido de Carbono (CO2)
        if (quantidade < 450) {
            bar.style.backgroundColor = "rgb(50,200,50)"; // Normal
        } else if (quantidade < 550) {
            bar.style.backgroundColor = "rgb(200,200,50)"; // Grave
        } else {
            bar.style.backgroundColor = "rgb(200,50,50)"; // Muito Grave
        }
    } else if (id == "barra3") { // Metano (CH4)
        if (quantidade < 2.5) {
            bar.style.backgroundColor = "rgb(50,200,50)"; // Normal
        } else if (quantidade < 3) { 
            bar.style.backgroundColor = "rgb(200,200,50)"; // Grave
        } else {
            bar.style.backgroundColor = "rgb(200,50,50)"; // Muito Grave
        }
    }
}
  
  // Função principal simplificada
  function atualiza(region) {
    fetch('JSON/data.json')
      .then(response => response.json())
      .then(data => {
        const regionData = data[region]?.["2100"];
        if (!regionData) return;
  
        Update('population', (regionData.populacao / 1000000000).toFixed(1) + ' B');
        Update('temperature', regionData.temperatura + '°C');
        Update('lostLand', '~ ' + regionData.lost_land.toLocaleString() + ' km²');
        Update('plostLand', (regionData.percent_lost_land * 100).toFixed(1) + '%');
        Update('o2', regionData.oxigenio + '%');
        Update('co2', regionData.dioxido_carbono + ' ppm');
        Update('ch4', regionData.metano + ' ppm');
  
        updateBar('barra1', (regionData.oxigenio / 21) * 60, regionData.oxigenio);
        updateBar('barra2', (regionData.dioxido_carbono / 500) * 60, regionData.dioxido_carbono);
        updateBar('barra3', (regionData.metano / 4) * 60, regionData.metano);
  
        const bloco1 = document.querySelector('#bloco1');
        if (bloco1) {
          bloco1.innerHTML = `
            <span>${region}</span>
            <span>in the year 2100</span>
          `;
        }
      })
      .catch(error => console.log('Erro ao carregar dados:', error));
  }
  

  function updateClosestMarker() {
    let closestMarker = null;
    let minDistance = Infinity;
  
    markerObjects.forEach(markerData => {
      const screenPosition = markerData.object.position.clone().project(camera);
      const screenDist = Math.hypot(
        screenPosition.x - mTela.x, 
        screenPosition.y - mTela.y, 
        screenPosition.z - mTela.z
      );
  
      if (screenDist < minDistance) {
        minDistance = screenDist;
        closestMarker = markerData;
      }
    });
  
    if (closestMarker) {
      atualiza(closestMarker.name);
      //console.log(closestMarker.name);

    continente_detetado = closestMarker.name;
    document.getElementById("Continente_detetado").textContent = continente_detetado;
    atualizarDados();
    }
  }


  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();  

  window.addEventListener('click', (event) => {
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

   
    let intersected = false;

    markerObjects.forEach(markerData => {
        const intersects = raycaster.intersectObject(markerData.object);
        
        if (intersects.length > 0) {
            console.log("Clicou em:", markerData.name);

            //------------------------------- Associar cenários aos anos e regiões
            var sky = document.getElementById("sky");
            const popUp = document.getElementById("TextPopUp");
            const circlePopUp = document.getElementById("trigger");

            const popUp2 = document.getElementById("TextPopUp2");
            const circlePopUp2 = document.getElementById("trigger2");

            const circlePopUp3 = document.getElementById("trigger3");


            if (markerData.name == "Asia") {
                popUp.setAttribute('scale', '0 0 0');
                regiao_cenarios ="South Asia";
                if (ano < 1970) {
                    sky.setAttribute('src','#1950_asia');

                    circlePopUp.setAttribute('position','1 1.5 -4');
                    circlePopUp.setAttribute('rotation', '0 0 0');
                    circlePopUp.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAsia1');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    
                    circlePopUp2.setAttribute('position', '14 4 10');
                    circlePopUp2.setAttribute('rotation', '0 240 0');
                    circlePopUp2.setAttribute('scale', '3.5 3.5 3.5');
                    circlePopUp2.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAsia2');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                                        
                    circlePopUp3.setAttribute('position', '14 8.885 -2.5');
                    circlePopUp3.setAttribute('rotation', '0 280 0');
                    circlePopUp3.setAttribute('scale', '3.5 3.5 3.5');
                    circlePopUp3.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAsia13');
                    popUp.setAttribute('scale', '1 1 1');
                    });

    
                }
                
                if (ano > 1970 && ano < 1990) {
                    sky.setAttribute('src','#1990_asia');
                    circlePopUp.setAttribute('position','-4.4 0.6 -0.3');
                    circlePopUp.setAttribute('rotation', '0 100 0');
                    circlePopUp.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAsia3');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp2.setAttribute('position', '15.5 -2.5 9.2');
                    circlePopUp2.setAttribute('rotation', '0 240 0');
                    circlePopUp2.setAttribute('scale', '3.5 3.5 3.5');
                    circlePopUp2.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAsia4');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp3.setAttribute('position', '14 8.885 -2.5');  //repetido
                    circlePopUp3.setAttribute('rotation', '0 280 0');
                    circlePopUp3.setAttribute('scale', '3.5 3.5 3.5');
                    circlePopUp3.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAsia13');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                }
                
                if (ano > 1990 && ano < 2020) {
                    sky.setAttribute('src','#2030_asia');
                    circlePopUp.setAttribute('position', '-6 -1 -3');
                    circlePopUp.setAttribute('rotation', '0 70 0');
                    circlePopUp.setAttribute('scale', '2 2 2');
                    circlePopUp.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAsia6');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp2.setAttribute('position', '27 3 -4');
                    circlePopUp2.setAttribute('rotation', '0 270 0');
                    circlePopUp2.setAttribute('scale', '5 5 5');
                    circlePopUp2.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAsia5');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    
                    circlePopUp3.setAttribute('position', '-0.4 1.8 -5.5'); //repetido
                    circlePopUp3.setAttribute('rotation', '0 0 0');
                    circlePopUp3.setAttribute('scale', '2 2 2');
                    circlePopUp3.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAsia7');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                }

                    if (ano > 2020 && ano < 2070) {
                    sky.setAttribute('src','#2030_asia');
                    circlePopUp.setAttribute('position', '-0.4 1.8 -5.5');
                    circlePopUp.setAttribute('rotation', '0 0 0');
                    circlePopUp.setAttribute('scale', '2 2 2');
                    circlePopUp.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAsia7');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp2.setAttribute('position', '8 -26 20');
                    circlePopUp2.setAttribute('rotation', '-60 240 -40');
                    circlePopUp2.setAttribute('scale', '8 8 8');
                    circlePopUp2.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAsia8');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp3.setAttribute('position', '-22 -9 -3');
                    circlePopUp3.setAttribute('rotation', '0 100 0');
                    circlePopUp3.setAttribute('scale', '8 8 8');
                    circlePopUp3.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAsia9');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                }

                 if (ano > 2070)  {
                    sky.setAttribute('src','#2100_asia');
                    circlePopUp.setAttribute('position', '13.5 -0.9 -15');
                    circlePopUp.setAttribute('rotation', '0 -40 0');
                    circlePopUp.setAttribute('scale', '4 4 4');
                    circlePopUp.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAsia10');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp2.setAttribute('position', '-21 -16 22');
                    circlePopUp2.setAttribute('rotation', '0 140 0');
                    circlePopUp2.setAttribute('scale', '9 9 9');
                    circlePopUp2.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAsia11');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp3.setAttribute('position', '-2.3 -23 -30');
                    circlePopUp3.setAttribute('rotation', '-20 10 0');
                    circlePopUp3.setAttribute('scale', '8 8 8');
                    circlePopUp3.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAsia12');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                }
            }

            if (markerData.name == "America") {
                popUp.setAttribute('scale', '0 0 0');
                regiao_cenarios ="Rainforests";
                if (ano < 1970) {
                    sky.setAttribute('src','#1950_amazonia');
                    circlePopUp.setAttribute('position', '-3.7 4 -1.5');
                    circlePopUp.setAttribute('rotation', '20 80 0');
                    circlePopUp.setAttribute('scale', '2 2 2');
                    circlePopUp.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAmerica1');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                    
                    circlePopUp2.setAttribute('position', '4.6 -1.5 0.2');
                    circlePopUp2.setAttribute('rotation', '0 270 0');
                    circlePopUp2.setAttribute('scale', '2 2 2');
                    circlePopUp2.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAmerica2');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                    
                    circlePopUp3.setAttribute('position', '-5 -1.5 -7');
                    circlePopUp3.setAttribute('rotation', '0 30 0');
                    circlePopUp3.setAttribute('scale', '3 3 3');
                    circlePopUp3.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAmerica12');
                    popUp.setAttribute('scale', '1 1 1');
                    });  
                }

                if (ano > 1970 && ano < 1990) {
                    sky.setAttribute('src','#1970_amazonia');
                    circlePopUp.setAttribute('position', '-3.3 6.5 -4');
                    circlePopUp.setAttribute('rotation', '20 40 5');
                    circlePopUp.setAttribute('scale', '4 4 4');
                    circlePopUp.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAmerica3');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp2.setAttribute('position', '3 -1.3 -1.7');
                    circlePopUp2.setAttribute('rotation', '0 -60 0');
                    circlePopUp2.setAttribute('scale', '2 2 2');
                    circlePopUp2.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAmerica4');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp3.setAttribute('position', '5 4.4 0.5');
                    circlePopUp3.setAttribute('rotation', '15 -100 -10');
                    circlePopUp3.setAttribute('scale', '2 2 2');
                    circlePopUp3.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAmerica15');
                    popUp.setAttribute('scale', '1 1 1');
                    });                    
                }

                if (ano > 1990 && ano < 2015) {
                    sky.setAttribute('src','#1990_amazonia'); 
                    circlePopUp.setAttribute('position', '-0.9 -1.5 -3.2');
                    circlePopUp.setAttribute('rotation', '-20 40 5');
                    circlePopUp.setAttribute('scale', '4 4 4');
                    circlePopUp.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAmerica5');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp2.setAttribute('position', '3 0.1 -1.1');
                    circlePopUp2.setAttribute('rotation', '0 -60 0');
                    circlePopUp2.setAttribute('scale', '1.5 1.5 1.5');
                    circlePopUp2.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAmerica6');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp3.setAttribute('position', '-0.9 5 -2.0');
                    circlePopUp3.setAttribute('rotation', '30 30 0');
                    circlePopUp3.setAttribute('scale', '2 2 2');
                    circlePopUp3.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAmerica13');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                }

                if (ano > 2015 && ano < 2060) {
                sky.setAttribute('src','#2015_amazonia'); 
                    circlePopUp.setAttribute('position', '-3.9 -1.3 -3.5');
                    circlePopUp.setAttribute('rotation', '0 60 0');
                    circlePopUp.setAttribute('scale', '4 4 4');
                    circlePopUp.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAmerica7');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp2.setAttribute('position', '-9.5 16 -6');
                    circlePopUp2.setAttribute('rotation', '40 40 -15');
                    circlePopUp2.setAttribute('scale', '4 4 4');
                    circlePopUp2.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAmerica8');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp3.setAttribute('position', '0 0.4 -1.1');
                    circlePopUp3.setAttribute('rotation', '0 -10 0');
                    circlePopUp3.setAttribute('scale', '0.2 0.2 0.2');
                    circlePopUp3.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAmerica14');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                }


                if (ano > 2060) {
                sky.setAttribute('src','#2060_amazonia');

                    circlePopUp.setAttribute('position', '-10 -3 3.5');
                    circlePopUp.setAttribute('rotation', '-20 100 0');
                    circlePopUp.setAttribute('scale', '4 4 4');
                    circlePopUp.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAmerica10');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp2.setAttribute('position', '3 0.5 -1.1');
                    circlePopUp2.setAttribute('rotation', '0 -60 0');
                    circlePopUp2.setAttribute('scale', '1.5 1.5 1.5');
                    circlePopUp2.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAmerica9');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    
                    circlePopUp3.setAttribute('position', '3 1.4 1.7');
                    circlePopUp3.setAttribute('rotation', '0 -120 0');
                    circlePopUp3.setAttribute('scale', '1.2 1.2 1.2');
                    circlePopUp3.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpAmerica11');
                    popUp.setAttribute('scale', '1 1 1');
                    });
            }
            }

            if (markerData.name == "Europe") {
                popUp.setAttribute('scale', '0 0 0');
                regiao_cenarios ="North Europe";
                if (ano < 1990) {
                    sky.setAttribute('src','#1950_europa');
                    circlePopUp.setAttribute('position', '-3.9 -1.3 -3.5');
                    circlePopUp.setAttribute('rotation', '0 60 0');
                    circlePopUp.setAttribute('scale', '4 4 4');
                    circlePopUp.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpEuropa1');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                    
                    circlePopUp2.setAttribute('position', '4.2 2.5 1.2');
                    circlePopUp2.setAttribute('rotation', '10 250 0');
                    circlePopUp2.setAttribute('scale', '2 2 2');
                    circlePopUp2.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpEuropa2');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp3.setAttribute('position', '4.7 0.2 -2.8');
                    circlePopUp3.setAttribute('rotation', '10 -50 0');
                    circlePopUp3.setAttribute('scale', '1 1 1');
                    circlePopUp3.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpEuropa10');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                }

                if (ano > 1990 && ano < 2040) {
                    sky.setAttribute('src','#2020_europa');
                    circlePopUp.setAttribute('position', '0.3 1 -15.5');
                    circlePopUp.setAttribute('rotation', '0 -20 0');
                    circlePopUp.setAttribute('scale', '4 4 4');
                    circlePopUp.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpEuropa4');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                    
                    circlePopUp2.setAttribute('position', '3 0.2 -3');
                    circlePopUp2.setAttribute('rotation', '10 -50 0');
                    circlePopUp2.setAttribute('scale', '2 2 2');
                    circlePopUp2.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpEuropa3');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp3.setAttribute('position', '-20 -2 11.7');
                    circlePopUp3.setAttribute('rotation', '0 150 0');
                    circlePopUp3.setAttribute('scale', '8 8 8');
                    circlePopUp3.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpEuropa5');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                }
                
                if (ano > 2040 && ano < 2070)  {
                    sky.setAttribute('src','#2050_europa');
                    circlePopUp.setAttribute('position', '0.3 12 -15.5');
                    circlePopUp.setAttribute('rotation', '20 0 0');
                    circlePopUp.setAttribute('scale', '4 4 4');
                    circlePopUp.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpEuropa6');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                    
                    circlePopUp2.setAttribute('position', '3.5 1 -3');
                    circlePopUp2.setAttribute('rotation', '10 -50 0');
                    circlePopUp2.setAttribute('scale', '1.4 1.4 1.4');
                    circlePopUp2.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpEuropa7');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp3.setAttribute('position', '12 20 -15.5'); //repetido heat
                    circlePopUp3.setAttribute('rotation', '20 -40 0');
                    circlePopUp3.setAttribute('scale', '4 4 4');
                    circlePopUp3.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpEuropa8');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                }

                 if (ano > 2070)  {
                    sky.setAttribute('src','#2100_europa');

                    circlePopUp.setAttribute('position', '12 20 -15.5');
                    circlePopUp.setAttribute('rotation', '20 -40 0');
                    circlePopUp.setAttribute('scale', '4 4 4');
                    circlePopUp.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpEuropa8');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                    
                    circlePopUp2.setAttribute('position', '1.6 -0.3 2.3');
                    circlePopUp2.setAttribute('rotation', '10 -150 0');
                    circlePopUp2.setAttribute('scale', '1.4 1.4 1.4');
                    circlePopUp2.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpEuropa9');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp3.setAttribute('position', '-3 -1.7 -3.5');
                    circlePopUp3.setAttribute('rotation', '0 60 0');
                    circlePopUp3.setAttribute('scale', '2 2 2');
                    circlePopUp3.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpEuropa11');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                }
                
            }

            if (markerData.name == "Arctic") {
                popUp.setAttribute('scale', '0 0 0');
                regiao_cenarios ="Arctic"; //Trocar pelos dados do artico 
                if (ano < 2000) {
                    sky.setAttribute('src','#1950_artico');
                    circlePopUp.setAttribute('position', '-0.2 -15 -15.5');
                    circlePopUp.setAttribute('rotation', '-30 0 0');
                    circlePopUp.setAttribute('scale', '4 4 4');
                    circlePopUp.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpArtico1');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                    
                    circlePopUp2.setAttribute('position', '-6 4 7');
                    circlePopUp2.setAttribute('rotation', '10 140 0');
                    circlePopUp2.setAttribute('scale', '3 3 3');
                    circlePopUp2.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpArtico2');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp3.setAttribute('position', '8 -5 5');
                    circlePopUp3.setAttribute('rotation', '-30 -120 0');
                    circlePopUp3.setAttribute('scale', '2 2 2');
                    circlePopUp3.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpArtico9');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                }
                if (ano > 2000 && ano < 2040) {
                    sky.setAttribute('src','#2020_artico');
                    circlePopUp.setAttribute('position', '-18 -5.5 -13');
                    circlePopUp.setAttribute('rotation', '10 50 0');
                    circlePopUp.setAttribute('scale', '4 4 4');
                    circlePopUp.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpArtico3');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                    
                    circlePopUp2.setAttribute('position', '3.4 4 3.8');
                    circlePopUp2.setAttribute('rotation', '0 -140 0');
                    circlePopUp2.setAttribute('scale', '2 2 2');
                    circlePopUp2.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpArtico4');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp3.setAttribute('position', '0 -4 3.4');
                    circlePopUp3.setAttribute('rotation', '-90 -90 0');
                    circlePopUp3.setAttribute('scale', '2 2 2');
                    circlePopUp3.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpArtico6');
                    popUp.setAttribute('scale', '1 1 1');
                    }); 
                }

                if (ano > 2040 && ano < 2070)  {
                    sky.setAttribute('src','#2050_artico');
                    circlePopUp.setAttribute('position', '0.3 10 -15.5');
                    circlePopUp.setAttribute('rotation', '20 0 0');
                    circlePopUp.setAttribute('scale', '4 4 4');
                    circlePopUp.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpArtico5');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                    
                    circlePopUp2.setAttribute('position', '0 -4 3.4');
                    circlePopUp2.setAttribute('rotation', '-90 -90 0');
                    circlePopUp2.setAttribute('scale', '2 2 2');
                    circlePopUp2.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpArtico6');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp3.setAttribute('position', '-21 -8 -13');
                    circlePopUp3.setAttribute('rotation', '10 50 0');
                    circlePopUp3.setAttribute('scale', '4 4 4');
                    circlePopUp3.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpArtico11');
                    popUp.setAttribute('scale', '1 1 1');
                    });        
                }
                 if (ano > 2070)  {
                    sky.setAttribute('src','#2100_artico');
                    popUp.setAttribute('src','');
                    circlePopUp.setAttribute('position', '5 -15 -15.5');
                    circlePopUp.setAttribute('rotation', '-30 -10 0');
                    circlePopUp.setAttribute('scale', '5 5 5');
                    circlePopUp.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpArtico7');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp2.setAttribute('position', '4.9 -6 3.4');
                    circlePopUp2.setAttribute('rotation', '-30 -120 0');
                    circlePopUp2.setAttribute('scale', '2 2 2');
                    circlePopUp2.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpArtico8');
                    popUp.setAttribute('scale', '1 1 1');
                    });

                    circlePopUp3.setAttribute('position', '-19 -11 -13');
                    circlePopUp3.setAttribute('rotation', '10 50 0');
                    circlePopUp3.setAttribute('scale', '4 4 4');
                    circlePopUp3.addEventListener("mouseenter", () => {
                    popUp.setAttribute('src','#PopUpArtico10');
                    popUp.setAttribute('scale', '1 1 1');
                    });
                }
            }
            //------------------------------------------------------------------------------//
            intersected = true;
            


            renderer.domElement.style.transition = "opacity 1s ease";
            renderer.domElement.style.opacity = 0;

            back.style.display = "block";
            compass.style.display = "block";
            data_scene.style.display = "block";
            main.style.opacity = 0;

            setTimeout(() => {
            compass.style.opacity = 1;
            main.style.display = "none";
            }, 1000);

            setTimeout(() => {
                data_scene.style.opacity = 1;
                main.style.display = "none";
                }, 1000);

            back.addEventListener("click", function handleClick() {
                intersected = false;
                renderer.domElement.style.display = "block";        
                back.style.display = "none";
                compass.style.opacity = 0;
                data_scene.style.opacity = 0;
                main.style.display = "block";

                aFrame.style.opacity = 0;
                setTimeout(() => {
                    renderer.domElement.style.opacity = 1;
                    aFrame.style.display = "none";
                    main.style.opacity = 1;
                    compass.style.display = "none";
                    data_scene.style.display = "none";
                }, 1000);

                back.removeEventListener("click", handleClick);
            });
            
            
            setTimeout(() => {
                renderer.domElement.style.display = "none";
                aFrame.style.display = "block";
                aFrame.style.opacity = 1;
            }, 1000);
        }
        atualizarDadosCenarios();
    });

    if (!intersected) {
        console.log("Clicou fora dos marcadores");
    }
});


let recognition;
let isRecognizing = false;

if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "pt-PT";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = function () {
        isRecognizing = true;
    };

    recognition.onend = function () {
        isRecognizing = false;
        startRecognition();
    };

    recognition.onerror = function (event) {
        console.error("Erro no reconhecimento de voz:", event.error);
    };
}

function startRecognition() {
    if (recognition && !isRecognizing) {
        recognition.start();
    }
}

function rolarAno(speakedYear, amount) {
    const passo = ano < speakedYear ? 1 : -1;
    const totalPassos = Math.abs(speakedYear - ano);

    for (let i = 0; i <= totalPassos - 1; i++) {
        setTimeout(() => {
            ano += passo;
            atualizarDados();
            scrollToYear(ano);
        }, i * amount); 
    }
}


document.getElementById('enterBtn').addEventListener('click', () => {
    setTimeout(() => {
        rolarAno(2025, 15);
    }, 1300); 

    if (visivel) document.getElementById('botao_PollutionandEmissions').click();
    if (visivel2) document.getElementById('botao_PopulationandResources').click();
    if (visivel3) document.getElementById('botao_ClimateandAtmosphere').click();
    if (visivel4) document.getElementById('botao_NaturalChanges').click();
    if (visivel5) document.getElementById('botao_Continentes').click();

});












const continentRotations = {
    america: { azimuth: -2.6679, polar: 1.9450},
    africa: { azimuth: -1.2767, polar: 1.6827},
    europe: { azimuth: -1.3513, polar: 0.8011 },
    asia:   { azimuth: 0.0513, polar: 1.1717 },
    oceania: { azimuth: 0.7412, polar: 1.9928 },
    artico: { azimuth: -1.3513, polar: 0.3011 },
    americanorte: { azimuth: -3.0679, polar: 0.9450}
};

function rodaPlaneta(name, duration = 1500) {
    const target = continentRotations[name.toLowerCase()];

    // Conversor para poder rodar
    const spherical = new THREE.Spherical();
    spherical.setFromVector3(camera.position.clone().sub(controls.target));

    const startTheta = spherical.theta;
    const startPhi = spherical.phi;

    const endTheta = target.azimuth;
    const endPhi = target.polar;

    //const radius = spherical.radius;
    const startTime = performance.now();

    function animate(time) {
        
        const elapsed = time - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = t * (2 - t); // ease-out

        spherical.theta = startTheta + (endTheta - startTheta) * eased;
        spherical.phi = startPhi + (endPhi - startPhi) * eased;
        spherical.makeSafe();

        camera.position.setFromSpherical(spherical).add(controls.target);
        camera.lookAt(controls.target);
        controls.update();

        if (t < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}



















function processarComandos(palavra) { 
    const regex = /\b(19\d{2}|20\d{2}|2100)\b/;
    const resultado = palavra.match(regex); 

    if (resultado) {  // Se encontrar um ano
        const anoEncontrado = parseInt(resultado[0], 10);  
        if (anoEncontrado >= 1950 && anoEncontrado <= 2100) { 
            //rolarAno(anoEncontrado, 75);
             setTimeout(() => {
                rolarAno(anoEncontrado, 60);
            }, 300); 

        }
    }

    //alterar visibilidade caixas 
    const palavrasChave_caixapollution = ["poluição","poluir" ,"gases", "efeito de estufa", "emissões", "qualidade do ar", "ar", 
        "mercúrio", "produção de mercúrio", "CO2", "Dióxido de carbono", "poluição do ar"];

    if (palavrasChave_caixapollution.some(palavrasChave_caixapollution => palavra.includes(palavrasChave_caixapollution))) {
        document.getElementById('botao_PollutionandEmissions').click();
    }

    const palavrasChave_caixaclimate = ["clima", "atmosfera", "umidade", "ozono", "estratosfera", "aquecimento global", "temperatura" ,
        "atmosfera", "Força radiativa" , "aquecimento global"];

    if (palavrasChave_caixaclimate.some(palavrasChave_caixaclimate => palavra.includes(palavrasChave_caixaclimate))) {
        document.getElementById('botao_ClimateandAtmosphere').click();
    }

    const palavrasChave_caixaresources = ["população", "pessoas", "recursos", "minerais", "mineral", "água", "cropland", "energia", "consumos", 
        "nuclear", "renovável", "fossil", "consumo de energia", "energia solar", "petróleo", "gás natural", "agricultura", "custo energético",
    "terra" , "energético", "carbono", "carvão", "eólica", "Hidrelétrica"];

    if (palavrasChave_caixaresources.some(palavrasChave_caixaresources => palavra.includes(palavrasChave_caixaresources))) {
        document.getElementById('botao_PopulationandResources').click();
    }

    const palavrasChave_caixanaturalchanges = ["Alterações", "climáticas", "mudanças", "catástrofe", "floresta", "desflorestação", "desmatamento", 
        "gelo", "subida das aguas", "mar", "nível de água", "gelo", "degelo", "Perda de biodiversidade", "incendios", "riscos", "perigo", "extinção", "subida de águas do mar"];

    if (palavrasChave_caixanaturalchanges.some(palavrasChave_caixanaturalchanges => palavra.includes(palavrasChave_caixanaturalchanges))) {
        document.getElementById('botao_NaturalChanges').click();
    }

    const palavrasChave_caixaContinentes = ["continentes", "continente"];

    if (palavrasChave_caixaContinentes.some(palavrasChave_caixaContinentes => palavra.includes(palavrasChave_caixaContinentes))) {
        document.getElementById('botao_Continentes').click();
    }

    const palavrasChave_esconder = ["esconder tudo", "ocultar tudo", "fechar tudo", "desaparecer", "fecha tudo", "esconde tudo"];

    if (palavrasChave_esconder.some(palavraChave => palavra.includes(palavraChave))) {
        if (visivel) document.getElementById('botao_PollutionandEmissions').click();
        if (visivel2) document.getElementById('botao_PopulationandResources').click();
        if (visivel3) document.getElementById('botao_ClimateandAtmosphere').click();
        if (visivel4) document.getElementById('botao_NaturalChanges').click();
        if (visivel5) document.getElementById('botao_Continentes').click();

    }

    const palavrasChave_mostrar = ["mostrar tudo", "ver tudo", "abrir tudo", "mostra tudo", "abre tudo", "nada", "aparecer tudo", "aparece tudo"];

    if (palavrasChave_mostrar.some(palavraChave => palavra.includes(palavraChave))) {
        if (!visivel) document.getElementById('botao_PollutionandEmissions').click();
        if (!visivel2) document.getElementById('botao_PopulationandResources').click();
        if (!visivel3) document.getElementById('botao_ClimateandAtmosphere').click();
        if (!visivel4) document.getElementById('botao_NaturalChanges').click();
        if (!visivel5) document.getElementById('botao_Continentes').click();

    }


    const palavrasChave_entrar = ["entrar", "abrir", "ir", "viajar", "entra", "abre", "conhecer"];
    
    if (palavrasChave_entrar.some(palavraChave => palavra.includes(palavraChave))) {

        if(currentDistance<=7.277847395674775){
            console.log("Distancia check");
         var sky = document.getElementById("sky");

            if (continente_detetado == "Asia") {
                regiao_cenarios ="South Asia";
                if (ano < 1970) {
                    sky.setAttribute('src','#1950_asia');
                }
                if (ano > 1970 && ano < 1990) {
                    sky.setAttribute('src','#1990_asia');
                }
                if (ano > 1990 && ano < 2040) {
                    sky.setAttribute('src','#2030_asia');
                }
                if (ano > 2040 && ano < 2070)  {
                    sky.setAttribute('src','#2050_asia');
                }
                 if (ano > 2070)  {
                    sky.setAttribute('src','#2100_asia');
                }
            }

            if (continente_detetado == "America") {
                regiao_cenarios ="Rainforests";
                if (ano < 1970) {
                    sky.setAttribute('src','#1950_amazonia');
                }
                if (ano > 1970 && ano < 1990) {
                sky.setAttribute('src','#1970_amazonia');
                }

                if (ano > 1990 && ano < 2015) {
                sky.setAttribute('src','#1990_amazonia'); 
                }

                if (ano > 2015 && ano < 2060) {
                sky.setAttribute('src','#2015_amazonia'); 
                }
                if (ano > 2060) {
                    sky.setAttribute('src','#2060_amazonia');
                }
            }

            if (continente_detetado == "Europe") {
                regiao_cenarios ="North Europe";
                if (ano < 2000) {
                    sky.setAttribute('src','#1950_europa');
                }
                if (ano > 2000 && ano < 2040) {
                    sky.setAttribute('src','#2020_europa');
                }
                if (ano > 2040 && ano < 2070)  {
                    sky.setAttribute('src','#2050_europa');
                }
                 if (ano > 2070)  {
                    sky.setAttribute('src','#2100_europa');
                }
            }

            if (continente_detetado == "Arctic") {
                regiao_cenarios ="Arctic";
                if (ano < 2000) {
                    sky.setAttribute('src','#1950_artico');
                }
                if (ano > 2000 && ano < 2040) {
                    sky.setAttribute('src','#2020_artico');
                }
                if (ano > 2040 && ano < 2070)  {
                    sky.setAttribute('src','#2050_artico');
                }
                 if (ano > 2070)  {
                    sky.setAttribute('src','#2100_artico');
                }
            }

                renderer.domElement.style.transition = "opacity 1s ease";
                renderer.domElement.style.opacity = 0;

                back.style.display = "flex";
                compass.style.display = "block";
                data_scene.style.display = "block";
                main.style.opacity = 0;

                setTimeout(() => {
                compass.style.opacity = 1;
                main.style.display = "none";
                }, 1000);

                setTimeout(() => {
                    data_scene.style.opacity = 1;
                    main.style.display = "none";
                    }, 1000);

                back.addEventListener("click", function handleClick() {
                    //intersected = false;
                    renderer.domElement.style.display = "block";        
                    back.style.display = "none";
                    compass.style.opacity = 0;
                    data_scene.style.opacity = 0;
                    main.style.display = "block";

                    aFrame.style.opacity = 0;
                    setTimeout(() => {
                        renderer.domElement.style.opacity = 1;
                        aFrame.style.display = "none";
                        main.style.opacity = 1;
                        compass.style.display = "none";
                        data_scene.style.display = "none";
                    }, 1000);

                    back.removeEventListener("click", handleClick);
                });
                
                
                setTimeout(() => {
                    renderer.domElement.style.display = "none";
                    aFrame.style.display = "block";
                    aFrame.style.opacity = 1;
                }, 1000);
            }
            atualizarDadosCenarios();

            }
        
    const palavrasChave_continente_Europa = [
    "europa","albânia","alemanha","andorra","áustria","bélgica","bielorrússia",
    "bósnia e herzegovina","bulgária","chipre","croácia","dinamarca",
    "eslováquia","eslovênia","espanha","estônia","finlândia","frança",
    "geórgia","grécia","hungria","irlanda","islândia","itália","kosovo",
    "letônia","liechtenstein","lituânia","luxemburgo","malta","moldávia",
    "mônaco","montenegro","noruega","países baixos","polônia","portugal",
    "reino unido","república tcheca","romênia","rússia","san marino",
    "sérvia","suécia","suíça","turquia","ucrânia","vaticano"
    ];


    if (palavrasChave_continente_Europa.some(palavraChave => palavra.includes(palavraChave))) {
    rodaPlaneta("europe", 1500);
    }

    const palavrasChave_continente_Asia = [
    "ásia","afeganistão","arábia saudita","armênia","azerbaijão","bahrein","bangladesh","butão","brunei","camboja","catar","cazaquistão",
    "china","chipre","coreia do norte","coreia do sul","emirados árabes unidos","filipinas","geórgia","índia","indonésia","irã","iraque",
    "israel","japão","jordânia","kuwait","laos","líbano","malásia","maldivas","mongólia","myanmar","nepal","omã","paquistão","palestina",
    "quirguistão","rússia","singapura","síria","sri lanka","tajiquistão","tailândia","timor-leste","turcomenistão","turquia","uzbequistão","vietnã","iémen"
    ];

    
    if (palavrasChave_continente_Asia.some(palavraChave => palavra.includes(palavraChave))) {
    rodaPlaneta("asia", 1500);
    }

    const palavrasChave_continente_AmericaSul = [
  "américa do sul","argentina","bolívia","brasil","chile","colômbia","equador","guiana","paraguai","peru","suriname","uruguai","venezuela"];


    if (palavrasChave_continente_AmericaSul.some(palavraChave => palavra.includes(palavraChave))) {
    rodaPlaneta("america", 1500);
    }

const palavrasChave_continente_Americanorte = [
  "america", "américa do norte", "américa central", "canadá","estados unidos","méxico","antígua e barbuda","bahamas","barbados","cuba","dominica",
  "granada","haiti","jamaica","são cristóvão e neves","santa lúcia","são vicente e granadinas","república dominicana","belize","costa rica",
  "el salvador","guatemala","honduras","nicarágua","panamá","porto rico","guiana francesa","bermudas","ilhas cayman","ilhas virgens","aruba",
  "curaçao", "montserrat","são bartolomeu","saint martin","ilhas turks e caicos"
];


    if (palavrasChave_continente_Americanorte.some(palavraChave => palavra.includes(palavraChave))) {
    rodaPlaneta("americanorte", 1500);
    }


    const palavrasChave_continente_Oceania = [
    "oceania","austrália","fiji","kiribati","ilhas marshall","micronésia",
    "nauru","nova zelândia","palau","papua-nova guiné","samoa",
    "ilhas salomão","tonga","tuvalu","vanuatu",
    "guam","nova caledônia","polinésia francesa","ilhas cook",
    "niue","tokelau","wallis e futuna","ilhas marianas do norte",
    "ilhas pitcairn","samoa americana","ilha norfolk"
    ];

    if (palavrasChave_continente_Oceania.some(palavraChave => palavra.includes(palavraChave))) {
    rodaPlaneta("oceania", 1500);
    }
    
    const palavrasChave_continente_Africa = [
    "áfrica","argélia","egito","líbia","marrocos","sudão","tunísia","saara ocidental",
    "benim","burkina faso","cabo verde","costa do marfim","gâmbia",
    "gana","guiné","guiné-bissau","libéria","mali","níger","nigéria",
    "senegal","serra leoa","togo",
    "angola","camarões","chade","congo","república centro-africana",
    "república democrática do congo","guiné equatorial","gabão","são tomé e príncipe",
    "burundi","comores","djibuti","eritreia","etiópia","quênia",
    "madagáscar","malawi","maurício","moçambique","ruanda","seicheles",
    "somália","sudão do sul","tanzânia","uganda","zâmbia","zimbábue",
    "botsuana","lesoto","namíbia","áfrica do sul","eswatini"
    ];

    if (palavrasChave_continente_Africa.some(palavraChave => palavra.includes(palavraChave))) {
    rodaPlaneta("africa", 1500);
    }

    const palavrasChave_continente_Artico = [
    "gronelândia ", "canadá ártico", "alasca", "rússia ártica", "ilhas svalbard", "ilhas frans josef", "ilha wrangel", "ilha nova sibéria",
  "ilha de severnaia zemlia", "ilhas canadenses do ártico", "ilhas do mar de barents", "ilha de banaan", "ilha ellef ringnes", "ilha melville",
  "ilha prins carl", "ilhas diomedes", "ártico", "polo norte", "círculo polar ártico"
    ];

    if (palavrasChave_continente_Artico.some(palavraChave => palavra.includes(palavraChave))) {
    rodaPlaneta("artico", 1500);
    }
       
       
}



document.addEventListener('DOMContentLoaded', function () {
    if (recognition) {
        recognition.onresult = function (event) {
            const speechResult = event.results[event.results.length - 1][0].transcript.toLowerCase();
            console.log("-", speechResult); 
            processarComandos(speechResult);
        };

        startRecognition();
    }
    
});



function atualizarPictogramas(percentagem) {
  const pictogramas = document.querySelectorAll(".pictograma");

  const totalPintados = (percentagem / 100) * pictogramas.length;
  const figurasCompletas = Math.floor(totalPintados);
  const resto = totalPintados - figurasCompletas;

  pictogramas.forEach((pictograma, index) => {
    // Limpa todas as classes de pintura
    pictograma.classList.remove("pintado", "metade", "quarto", "dez", "tresquartos");

    if (index < figurasCompletas) {
      pictograma.classList.add("pintado");
    } 
    else if (index === figurasCompletas) {
      if (resto >= 0.75) {
        pictograma.classList.add("tresquartos");
      } else if (resto >= 0.50) {
        pictograma.classList.add("metade");
      } else if (resto >= 0.25) {
        pictograma.classList.add("quarto");
      } else if (resto >= 0.10) {
        pictograma.classList.add("dez");
      }
    }
  });
}

function SVGPorContinente(continente_detetado) {
  const svgContainer = document.getElementById('mapa_svg');

  let novoConteudoSVG = '';

  if (continente_detetado === "America") {
    novoConteudoSVG = `<svg width="100%" viewBox="0 0 1024 642" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M482.813 222.944C485.102 220.777 488.716 219.091 489.439 216.441C491.367 209.577 496.909 208.975 500.885 208.132C501.849 203.676 502.571 200.183 503.415 195.968C503.174 195.968 502.09 195.246 500.764 195.246C497.27 195.005 495.584 193.439 496.065 189.826C496.668 184.407 491.969 178.747 496.186 173.689C499.559 169.715 503.776 166.463 507.391 162.609C509.439 160.442 511.607 158.154 512.451 155.504C515.222 147.315 522.692 144.063 528.595 139.126C530.764 137.319 533.896 136.597 536.306 134.911C542.33 130.575 549.438 131.779 554.86 136.717C558.836 140.21 564.137 142.498 569.197 144.425C574.619 146.472 579.438 148.278 579.317 155.384C585.944 154.42 584.137 148.88 585.582 145.027H591.486C591.727 147.194 592.088 149.121 592.45 152.493C600.763 143.822 610.763 142.739 621.365 143.461C621.606 142.859 621.726 142.257 621.967 141.655C619.919 141.053 617.871 140.33 615.702 139.728C616.425 138.764 617.028 137.801 617.751 136.838C619.919 137.199 622.329 137.078 624.377 137.921C629.196 139.848 632.931 139.005 635.943 134.79C636.907 133.466 638.112 132.382 639.196 131.177C643.292 126.44 647.268 126.44 651.124 131.177C652.569 129.973 653.895 128.648 655.822 127.083C656.545 129.612 657.148 131.539 657.75 133.466C658.232 133.466 658.593 133.586 659.075 133.706C659.557 131.9 659.919 129.973 660.401 127.805C661.967 127.805 663.654 127.564 665.461 127.444C665.702 125.878 666.063 124.433 666.304 122.988C666.666 123.47 667.027 124.072 667.389 124.554C676.304 117.569 685.942 112.029 698.231 109.621C698.352 109.621 699.677 110.945 701.966 112.993C704.617 109.5 706.665 106.008 709.436 103.117C710.641 101.913 714.617 101.19 715.099 101.793C718.352 106.369 722.93 105.887 727.026 104.924C732.448 103.479 735.098 107.091 737.147 110.343C738.351 112.27 737.388 115.522 737.388 119.255C745.58 120.7 755.821 120.459 763.893 124.433C776.062 130.455 787.989 125.517 799.917 127.444C801.122 122.627 803.531 121.302 808.591 122.386C819.314 124.674 827.989 131.418 838.35 135.031C841.362 130.936 845.94 129.973 848.47 134.309C853.41 142.739 860.518 139.005 867.024 139.126C867.627 139.126 868.109 138.644 868.711 138.524C869.073 138.524 869.434 138.524 870.036 138.524C871.241 140.089 872.566 141.655 874.976 144.545C874.615 141.053 874.494 139.126 874.133 135.272C881.362 137.319 887.627 139.126 893.892 140.932C896.301 141.655 898.831 142.136 901 143.22C906.542 145.99 911.964 149.001 917.385 151.891C917.988 152.252 918.349 152.975 918.951 153.216C924.654 155.464 927.024 160.361 926.06 167.908C923.409 166.584 920.879 165.861 919.072 164.295C913.771 160.08 913.048 160.08 908.711 166.102C910.518 168.27 912.325 170.558 914.614 173.328C910.879 174.532 907.867 175.616 904.614 176.338C900.759 177.302 896.663 177.543 895.699 182.721C895.578 183.444 892.687 183.805 891.12 184.046C887.988 184.407 884.494 183.805 881.723 184.889C877.024 186.936 877.506 192.596 882.687 196.57C879.072 204.157 875.338 211.865 871.603 219.572C870.88 219.572 870.157 219.332 869.314 219.332C868.229 217.405 867.145 215.478 866.181 213.431C864.976 210.781 863.53 208.132 862.808 205.362C862.085 202.833 861.241 199.822 862.085 197.534C864.494 191.031 867.627 184.889 870.398 178.626C869.916 178.145 869.434 177.663 868.952 177.302C868.109 178.867 867.145 180.433 866.542 181.517C864.374 180.794 861.241 179.59 861.121 179.951C859.555 182.962 858.47 186.214 857.145 189.345C857.506 190.067 857.747 190.79 858.109 191.512C851.121 190.429 844.013 189.465 837.025 188.14C828.23 186.334 825.097 188.14 822.447 196.57C821.844 198.497 819.917 200.063 818.953 201.99C818.35 203.074 817.868 205.241 818.35 205.603C819.435 206.446 821.121 206.687 822.567 206.687C825.097 206.446 827.627 205.844 830.157 205.482C830.278 205.964 830.398 206.446 830.519 207.048C831.362 205.844 832.206 204.639 834.133 201.749C835.218 205.603 835.579 207.891 836.422 210.059C837.989 213.792 839.796 217.405 841.483 221.138C842.687 223.547 844.374 225.835 845.097 228.364C845.338 229.086 843.049 230.532 841.242 232.579C841.242 232.94 841.362 234.867 841.603 237.276C836.422 234.987 836.061 230.893 835.579 226.678C835.097 222.944 834.013 219.332 833.169 215.719C832.567 215.719 832.085 215.96 831.483 216.08C831.483 217.043 831.242 218.007 831.483 218.729C835.579 230.532 828.712 239.443 823.652 248.837C823.17 249.8 821.844 250.402 820.88 250.884C813.17 254.979 812.447 256.424 813.29 265.576C813.772 270.875 815.579 276.295 809.917 282.437C805.82 275.813 801.965 269.791 798.11 263.65C795.941 268.467 793.893 272.32 792.688 276.295C792.086 278.101 792.327 281.112 793.411 282.196C800.158 288.699 799.314 301.946 792.929 310.135C790.278 313.507 788.592 317.722 786.423 321.576C784.495 325.068 782.086 327.477 777.387 326.995C775.339 326.755 773.05 328.2 769.074 329.404C775.7 332.174 774.134 335.064 772.206 338.677C770.881 341.206 770.761 344.698 770.64 347.709C770.158 357.825 766.785 363.004 761.845 364.088C756.062 359.993 751.604 356.741 747.267 353.61C744.014 358.066 744.978 363.124 750.038 368.062C755.219 372.999 757.146 379.503 758.472 386.367C749.918 381.068 741.725 375.649 739.797 364.69C739.556 363.606 739.315 361.92 739.918 361.197C742.809 357.584 741.002 355.296 738.713 352.406C737.147 350.359 737.026 347.107 735.942 343.374C734.858 343.374 732.93 343.012 731.002 342.892C727.388 342.651 726.424 341.326 726.303 337.232C726.183 333.017 722.809 328.922 720.641 324.225C717.749 325.55 714.617 326.032 712.81 327.838C708.111 332.656 704.617 339.038 699.436 343.012C692.93 348.07 695.099 355.537 692.689 361.559C690.641 366.496 688.714 368.423 684.979 367.339C680.28 357.103 675.943 347.589 671.605 338.195C670.882 336.63 670.401 334.823 669.919 333.137C669.557 331.933 669.678 330.247 668.955 329.765C662.69 325.791 661.124 316.398 651.244 315.916C646.184 315.675 641.485 314.109 637.268 318.324C635.582 315.795 634.256 313.869 633.052 311.942C632.57 312.183 632.088 312.423 631.606 312.544C632.57 314.832 633.172 317.481 634.738 319.408C639.196 324.707 638.594 330.849 632.811 334.944C624.016 341.086 615.1 346.866 605.221 351.202C598.715 354.092 596.787 353.851 594.859 346.625C592.45 337.954 587.269 331.331 581.847 324.707C579.799 320.01 577.751 315.193 575.583 310.497C575.101 316.518 574.378 322.66 581.245 325.309C581.607 333.378 585.462 339.761 590.402 345.782C592.932 348.793 594.98 352.165 598.353 356.982C601.727 356.26 606.666 355.537 611.365 353.972C614.98 352.767 617.389 353.731 617.269 357.223C617.269 361.077 616.425 365.292 614.618 368.664C611.245 375.047 607.028 380.948 603.173 386.969C602.329 388.294 601.606 390.1 600.281 390.702C594.257 393.954 591.365 399.132 590.161 405.395C589.197 409.971 588.594 414.668 588.353 419.244C588.112 423.58 588.594 428.035 588.594 432.491C588.474 438.633 587.39 443.812 581.968 448.749C577.751 452.603 576.667 459.949 574.257 465.73C573.655 467.175 573.655 469.945 573.052 470.065C566.185 471.39 567.631 477.411 565.824 481.627C564.619 484.517 561.245 486.564 560.041 489.575C555.583 500.895 544.378 501.979 535.342 506.194C531.005 508.241 527.872 506.435 526.788 501.859C524.619 492.826 519.921 484.637 519.559 474.882C519.318 469.222 514.86 463.683 512.571 457.902C511.607 455.493 510.162 452.483 510.885 450.435C515.222 437.309 512.089 424.543 509.439 411.778C509.198 410.814 508.957 409.73 508.354 409.008C501.728 401.902 502.933 393.713 505.102 385.404C505.583 383.597 505.102 381.55 505.102 379.021C497.15 381.55 490.162 381.67 484.258 374.565C484.258 374.565 483.415 374.444 483.295 374.685C478.355 383.236 469.439 380.466 462.331 380.827C457.994 381.068 452.934 376.853 449.199 373.481C446.307 370.832 445.464 366.014 442.813 363.004C437.753 357.344 438.235 350.84 437.512 343.976C436.307 332.174 440.042 321.576 443.536 310.858C444.259 308.811 446.428 307.125 448.355 305.679C452.813 302.548 455.584 298.574 455.343 293.155C454.861 284.966 461.367 281.594 466.066 277.017C466.668 276.415 468.716 276.174 469.319 276.776C473.295 280.028 476.186 277.258 479.319 275.452C490.041 274.247 500.764 272.923 511.607 271.718C510.644 282.918 513.294 286.049 521.366 288.819C525.222 290.144 528.957 292.312 533.294 294.359C534.74 286.772 540.161 287.495 545.824 288.338C553.294 289.542 560.763 290.746 569.077 292.071C570.281 287.013 571.727 281.473 573.052 275.933C572.45 275.813 571.968 275.692 571.366 275.452C569.799 277.499 568.354 279.546 566.787 281.594C566.306 281.232 565.824 280.991 565.221 280.63C565.221 279.064 565.101 277.499 565.101 277.378C559.318 276.656 554.378 275.933 549.318 275.211C548.233 270.634 547.149 266.058 546.065 261.121C541.125 264.252 544.378 268.708 544.378 272.32C544.378 273.404 547.39 274.488 549.077 275.452V280.028C545.583 278.221 542.932 275.933 540.041 275.572C536.185 275.09 535.583 273.284 535.704 270.032C535.945 265.817 534.981 262.084 530.282 260.398C529.92 258.953 530.041 256.906 529.198 256.063C525.704 252.69 521.969 249.8 518.354 246.669C517.872 247.151 517.391 247.632 516.909 248.114C518.836 250.161 520.764 252.45 522.812 254.256C525.222 256.424 527.872 258.351 530.402 260.398C530.523 260.518 530.643 260.639 530.764 260.88C530.764 261 530.764 261.241 530.764 261.482C529.439 261.482 528.113 261.482 528.234 261.482C525.824 265.336 523.776 268.587 521.366 272.561C519.68 271.237 517.872 269.791 516.427 268.708C518.595 266.901 520.041 265.697 521.487 264.493C519.8 262.686 518.475 260.398 516.427 258.953C514.258 257.387 511.607 256.544 509.077 255.46C507.752 258.712 512.089 264.131 504.499 266.419C504.017 260.278 503.535 254.858 503.053 249.439C501.246 249.8 498.716 251.125 496.668 250.523C492.09 249.318 489.68 251.245 488.114 254.858C485.102 261.723 482.331 268.708 479.439 275.572C472.813 274.609 466.186 273.645 458.476 272.441V249.68C464.138 249.318 469.198 248.716 474.259 248.837C478.837 248.957 479.921 245.344 478.837 243.177C477.271 240.166 475.945 235.71 470.885 235.59C469.68 235.59 468.475 234.265 467.271 233.422C468.235 232.338 469.078 230.893 470.283 230.17C474.379 227.4 478.716 224.992 482.933 222.342L482.813 222.463V222.944ZM540.161 160.442C539.559 160.08 538.956 159.84 538.354 159.478C535.222 163.332 531.848 166.945 529.198 171.16C527.39 174.05 525.222 178.506 526.186 181.035C529.198 188.622 524.981 194.162 522.451 200.304C521.728 201.99 519.318 204.157 517.993 204.037C516.065 203.796 514.017 201.869 512.812 200.063C511.246 197.895 510.523 195.246 509.318 192.837C508.836 192.958 508.354 193.198 507.873 193.319C509.077 197.413 510.282 201.388 511.848 206.807C515.463 205.964 519.68 203.796 523.415 204.398C532.21 205.723 533.414 201.026 534.137 194.282C534.378 191.994 536.788 190.067 538.113 187.9C538.836 187.9 539.679 188.02 540.402 188.14C539.438 185.973 539.077 182.962 537.511 181.999C529.318 176.94 528.836 174.291 535.463 167.186C537.27 165.138 538.595 162.609 540.161 160.321V160.442ZM563.534 154.179C564.378 159.358 563.896 164.055 571.125 164.898C567.751 157.07 577.39 161.044 577.992 155.263C573.414 154.902 568.836 154.541 563.534 154.179ZM627.871 312.544C625.702 309.172 624.016 306.161 621.967 303.271C620.16 300.742 619.919 295.202 614.377 298.694C617.51 303.993 620.401 309.051 623.293 313.989C624.979 313.507 626.546 313.026 627.871 312.544ZM767.628 339.038C768.592 338.436 769.556 337.714 770.64 337.111C768.592 334.101 766.544 331.21 764.375 328.2C763.532 328.802 762.688 329.404 761.725 330.006C763.652 333.017 765.58 336.148 767.628 339.159V339.038Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M284.869 119.738C285.471 121.183 286.194 122.629 286.917 124.194C290.411 123.472 294.628 120.461 296.796 126.362C304.628 123.833 309.688 131.059 316.314 132.143C322.7 133.226 326.555 139.248 323.302 144.426C327.158 146.955 332.459 148.641 334.266 152.134C335.591 154.783 332.579 159.721 331.374 164.056C328.121 162.129 325.832 160.684 323.423 159.36C328.724 165.742 324.507 171.884 323.182 179.592C319.567 177.304 315.832 175.618 312.941 173.089C309.085 169.716 305.471 166.706 299.688 167.308C298.001 167.428 296.074 165.622 294.146 164.658C295.351 162.972 296.435 161.046 298.001 159.6C298.965 158.637 300.772 158.637 301.736 157.674C304.146 155.506 308.483 152.134 308.001 150.93C306.676 147.678 303.664 144.426 300.531 142.981C297.037 141.295 292.58 141.416 290.17 141.054C289.688 146.233 291.013 152.616 288.483 155.626C285.592 158.998 279.086 159.119 275.833 160.203C267.52 169.837 260.05 178.387 252.58 186.817C259.086 195.368 265.351 202.714 277.279 201.871C278.483 205.725 279.688 209.94 281.375 215.48C283.182 210.301 284.507 206.568 285.833 202.714C284.869 201.871 283.905 201.028 281.857 199.222H288.724C289.568 191.755 290.652 184.409 291.013 177.063C291.254 172.005 294.266 171.402 297.76 172.366C301.254 173.209 304.387 175.256 307.76 176.581C308.965 177.063 310.411 177.183 312.097 177.544C312.338 181.157 312.459 184.891 312.7 188.985H320.411C320.772 187.42 321.133 185.734 321.495 184.048C322.218 184.048 323.182 184.048 323.302 184.288C325.471 188.985 328.483 193.561 329.447 198.62C330.41 203.678 334.266 209.338 340.531 210.181C340.531 213.553 340.772 217.166 340.531 220.658C340.169 225.114 341.495 228.486 344.748 231.978C346.555 233.905 346.314 237.639 347.398 242.456C342.458 240.408 339.206 239.084 335.953 237.759C336.073 237.277 336.314 236.796 336.435 236.193C334.145 236.555 331.856 237.036 327.88 237.639C331.856 231.497 335.109 226.559 339.206 220.297C333.302 222.585 328.965 224.391 324.868 225.957C324.146 227.643 323.543 229.57 322.459 231.256C321.254 233.062 319.567 234.507 318.001 236.073C319.688 237.277 321.495 238.482 323.182 239.565C323.664 239.927 324.266 240.047 326.435 240.77C322.097 243.299 318.603 245.346 314.146 247.875C314.507 245.828 314.748 244.985 315.109 242.937C309.447 245.346 304.387 247.514 298.965 249.922C300.411 252.692 301.254 254.378 302.58 256.907C292.339 258.593 288.845 265.578 286.917 273.888C285.833 275.694 284.989 277.742 283.785 279.428C282.7 280.873 281.375 282.197 280.05 283.402C276.797 286.412 272.821 289.062 270.17 292.554C268.966 294.12 270.17 297.612 270.17 300.141C270.17 300.503 270.893 300.744 270.893 301.105C270.893 307.006 270.291 313.268 278.483 316.158C277.881 316.64 277.158 317.242 276.556 317.724C275.23 317.122 273.905 316.761 272.7 316.038C271.616 315.436 270.652 314.713 269.929 313.75C267.761 311.221 265.592 308.692 263.664 305.922C262.46 304.356 261.978 300.984 260.773 300.864C257.158 300.382 253.424 300.864 249.809 301.225C248.002 301.466 245.713 303.273 244.749 302.55C237.761 297.974 232.219 301.346 226.075 305.44C226.075 310.98 225.954 316.761 226.075 322.541C226.075 325.07 226.315 327.961 227.52 330.008C228.605 331.694 231.255 333.139 233.303 333.259C234.508 333.259 236.074 330.73 237.159 329.044C237.882 327.961 238.123 326.395 238.604 324.829H250.893C249.93 329.647 248.966 334.223 247.881 339.522C249.327 339.883 251.134 340.485 252.942 340.726C260.532 341.93 261.616 343.496 260.532 351.203C260.17 353.612 259.929 356.021 259.809 358.429C259.809 359.633 260.05 360.717 260.291 361.801C264.387 364.21 270.05 351.083 272.941 363.246C272.459 363.848 271.857 364.451 271.375 365.053C269.206 366.859 266.917 368.666 263.544 371.556C258.484 366.859 253.062 361.681 247.641 356.623C246.556 355.539 245.351 354.214 244.026 353.853C239.327 352.649 234.749 351.806 233.183 346.145C232.942 345.543 231.255 345.182 230.171 344.941C222.942 343.014 215.231 342.051 208.605 338.799C205.472 337.354 203.063 331.694 202.822 327.84C202.46 321.578 199.93 317.363 195.473 313.509C194.027 312.305 193.183 310.498 191.256 308.09C192.099 312.184 192.822 315.075 193.545 318.567C188.967 318.567 186.798 317.001 184.629 313.629C179.69 306.042 177.16 297.853 174.629 289.423C174.148 287.978 173.184 286.292 171.979 285.449C165.834 281.234 164.027 275.333 164.63 268.348C165.352 259.316 166.316 250.284 167.039 241.251C167.28 238 167.16 234.748 166.798 231.497C165.714 223.428 164.389 215.359 163.304 207.772C162.943 208.856 162.22 210.422 161.618 212.108C161.136 212.348 160.533 212.589 160.051 212.83C161.377 198.138 146.558 197.897 140.654 189.587C139.57 188.142 134.028 189.949 131.016 190.31C130.534 195.368 131.618 201.269 129.329 202.955C124.871 206.447 118.606 207.772 113.064 210.06C112.823 209.579 112.582 208.976 112.341 208.495L116.196 200.908C115.594 200.426 115.112 199.944 114.51 199.583C107.401 206.688 101.016 214.516 93.0643 220.417C87.1607 224.873 79.9319 228.366 71.8597 227.402C71.4983 226.92 71.1368 226.318 70.7754 225.837C74.6308 222.946 78.6066 220.176 82.3415 217.166C88.0041 212.348 93.4257 207.17 99.3292 201.992C93.6667 198.499 93.5462 198.499 88.3655 203.075C86.1969 200.306 84.0282 197.536 81.9801 194.766C81.7391 195.007 81.3777 195.368 81.1367 195.609C80.5343 193.441 80.4138 190.912 79.209 189.106C75.4741 183.445 76.438 178.267 82.7029 175.738C86.9198 174.052 91.6185 173.45 95.9558 172.005C98.1244 171.282 100.052 170.078 101.859 167.91H89.4498C85.8354 163.815 82.9439 160.684 79.5705 156.951C86.5583 155.265 93.1847 150.207 102.341 152.736C103.064 152.134 104.751 150.689 106.317 149.364C103.426 147.798 100.414 146.594 97.763 144.788C96.6787 144.065 95.8353 141.897 96.0763 140.693C96.3172 139.73 98.3654 138.887 99.6907 138.525C105.956 136.96 112.1 135.635 118.365 134.19C119.329 133.949 120.413 133.467 121.257 133.588C132.823 135.876 144.268 138.284 155.834 140.573C159.449 141.295 163.184 141.777 166.678 141.416C173.184 140.813 179.569 139.489 186.798 138.405C186.918 138.766 187.521 140.332 188.244 142.74C190.653 141.175 192.822 139.85 195.111 138.405C194.991 138.887 194.87 139.248 194.629 139.73C204.629 142.74 214.749 145.751 224.749 149.003C226.797 149.605 228.605 151.05 230.412 152.134C232.701 147.678 228.966 143.945 222.46 143.463C218.002 143.102 213.665 140.693 209.328 139.127C209.93 137.562 210.533 135.996 211.255 134.069C206.798 131.179 200.894 131.42 194.629 134.19C193.545 130.938 191.376 128.048 192.099 125.88C193.424 121.665 196.075 117.691 198.725 114.078C200.292 111.79 212.099 113.837 216.436 116.487C218.123 115.282 219.81 114.319 221.135 113.115C222.34 111.91 223.303 110.465 224.508 108.9C228.123 109.381 232.099 109.863 234.508 110.104C236.918 107.093 238.604 104.926 240.291 102.758C241.376 104.805 242.58 106.852 244.147 109.743C248.363 108.057 253.424 106.13 259.93 103.601V113.837C256.797 113.596 253.544 113.476 250.412 113.235C249.327 113.235 248.243 112.392 247.279 112.753C239.809 115.162 232.339 117.811 224.629 120.461C226.918 121.545 229.448 122.629 232.58 124.194C239.207 116.728 248.363 117.932 257.761 118.534C258.363 121.665 258.966 124.435 259.568 127.566C255.11 130.577 250.653 133.588 246.074 136.719V142.981C242.58 142.62 239.327 142.259 235.713 141.897C240.291 147.919 241.135 148.039 254.749 143.824C255.472 145.51 256.315 147.196 257.038 148.882C257.64 148.882 258.122 148.882 258.725 148.882C258.725 145.269 258.725 141.777 258.725 138.164C258.725 135.996 259.086 133.829 259.207 131.781C261.014 132.022 263.062 131.781 264.628 132.504C266.435 133.467 268.002 135.153 269.447 136.598C270.773 137.923 271.857 139.489 273.544 140.813C271.255 133.347 273.423 127.085 278.483 121.906C279.809 120.581 282.58 120.581 284.628 119.859H284.387L284.869 119.738Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M821.853 427.917C829.804 430.446 837.876 426.713 844.744 431.891C840.647 435.665 842.535 439.88 850.406 444.536C856.189 439.117 851.009 431.289 854.382 425.268C861.25 424.424 857.997 430.807 859.804 433.457C861.972 436.588 863.418 440.08 865.105 443.452C866.792 446.945 868.84 450.437 869.924 454.05C871.008 457.663 871.008 461.517 871.611 465.852C876.069 463.925 877.273 466.093 878.117 470.067C879.804 477.895 882.093 485.723 877.996 493.43C875.105 498.85 871.972 504.269 868.599 509.448C861.852 519.925 856.069 521.972 844.141 519.202C836.19 517.396 835.828 516.914 836.19 508.484C830.768 508.243 827.395 505.353 824.744 500.295C822.334 495.598 812.094 495.719 804.865 499.091C798.479 502.101 791.853 504.51 785.347 506.798C781.733 508.123 777.154 504.39 777.998 500.897C780.287 491.383 776.19 482.471 775.347 473.198C774.986 468.863 775.106 466.575 779.564 466.213C784.504 465.732 786.431 462.721 787.154 458.386C787.877 454.411 789.202 451.16 794.624 454.411C793.66 447.427 797.997 446.222 802.696 446.824C806.551 447.306 808.118 445.981 808.118 442.609C808.118 437.551 811.25 435.624 815.467 434.781C819.081 434.059 823.057 433.818 821.732 427.676L821.853 427.917Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M824.98 399.858C827.028 397.329 828.233 396.004 829.438 394.439C827.269 393.596 825.1 392.873 822.932 392.151C825.944 386.37 828.715 385.768 835.462 389.14C834.859 390.103 834.257 391.067 833.534 391.91C832.932 392.512 832.088 392.994 831.365 393.475C831.365 394.198 831.486 394.8 831.606 395.523C833.775 395.523 836.425 396.366 837.992 395.402C843.895 391.91 847.63 392.03 853.654 396.245C857.148 398.774 860.883 400.942 865.461 403.832C869.076 408.89 873.533 414.912 877.991 421.054C877.509 421.656 877.027 422.378 876.545 422.981C874.618 421.897 872.329 421.295 870.883 419.729C868.112 416.598 865.943 415.393 862.811 419.488C861.967 420.451 858.714 420.09 856.787 419.488C854.136 418.765 851.606 417.2 848.233 415.634C846.425 407.686 834.859 398.413 825.1 399.738L824.98 399.858Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M538.839 108.539C534.14 106.371 530.405 104.685 526.309 102.878C525.827 104.564 525.104 106.973 524.502 109.382C524.14 110.586 523.899 111.67 523.538 112.874C519.562 111.67 515.345 110.706 511.61 109.02C510.767 108.659 510.767 105.287 511.369 103.721C512.092 101.794 513.899 100.349 514.622 97.459C511.61 99.0246 508.598 100.711 506.911 101.554C504.381 97.8203 502.092 95.0504 500.526 91.9193C499.803 90.3537 499.803 87.8247 500.647 86.3795C501.49 85.0548 504.02 83.8505 505.466 84.2118C507.996 84.8139 510.285 86.6204 512.092 87.4634C513.417 86.0182 514.863 84.5731 516.309 83.1279C517.755 84.8139 519.2 86.4999 520.767 88.0655C521.971 89.2698 523.297 90.8354 524.743 91.1967C534.02 93.8461 539.08 99.0246 538.839 108.418V108.539Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M788.968 371.313C796.076 372.036 796.558 373.963 795.112 382.152C793.907 389.137 793.425 396.242 790.293 402.746C789.449 404.552 786.799 407.563 786.196 407.322C781.98 405.395 776.558 403.709 774.389 400.216C767.522 388.535 768.124 388.414 779.57 380.827C782.823 378.66 785.233 375.167 788.847 371.313H788.968Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M612.457 428.281C612.698 433.941 613.662 439.721 612.818 445.261C611.493 454.052 608.722 462.603 607.156 471.274C606.071 477.295 601.252 476.573 597.517 476.814C596.313 476.814 594.023 472.478 593.903 470.19C593.782 465.975 594.987 461.76 595.469 457.545C595.71 456.22 596.192 454.534 595.71 453.45C593.662 448.994 595.59 445.622 598.963 443.575C603.903 440.564 606.312 436.108 608.12 431.05C608.481 429.967 609.324 429.124 609.927 428.16C610.77 428.16 611.614 428.16 612.457 428.281Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M482.936 222.836C477.032 223.317 471.129 223.679 465.346 224.16C465.346 223.799 465.105 223.438 464.984 223.197C466.43 222.233 467.996 221.39 469.924 220.066C465.105 214.044 469.683 210.552 474.141 207.18C467.876 203.085 466.551 198.268 469.804 189.718C470.647 187.429 474.743 186.466 477.273 184.9C477.635 185.503 478.117 185.984 478.478 186.586C477.755 188.032 476.912 189.597 476.43 190.681C479.683 197.786 482.815 204.892 486.068 212.238C485.225 215.249 484.02 219.223 482.936 223.076L483.056 222.956L482.936 222.836Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M842.934 252.698C843.778 259.201 844.501 265.824 845.464 272.328C845.946 275.94 845.103 278.59 841.489 280.035C836.79 281.841 831.971 283.407 827.513 285.695C824.862 287.02 822.814 289.549 819.561 292.319C818.718 290.874 816.549 288.826 816.79 287.02C817.272 283.768 817.272 280.035 821.73 278.349C827.031 276.302 831.971 273.291 836.79 270.28C838.115 269.437 839.199 267.029 839.199 265.343C839.32 261.248 838.838 257.033 838.477 252.818C839.922 252.818 841.489 252.698 842.934 252.577V252.698Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M637.394 108.061C635.105 109.867 632.936 112.035 630.527 113.359C626.43 115.648 622.093 117.334 617.876 119.26C617.153 119.622 616.551 120.224 615.828 120.585C609.965 124.037 608.961 128.774 612.816 134.796C613.298 135.518 613.539 136.241 613.9 136.843C609.683 140.938 606.912 140.215 599.684 132.749C602.696 126.848 605.105 120.465 608.961 115.166C610.888 112.516 615.467 111.433 618.96 110.228C624.623 108.301 630.406 106.736 636.069 105.05C636.43 106.013 636.912 106.977 637.273 107.94L637.394 108.061Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M733.537 375.169C739.199 373.363 742.814 375.049 745.344 380.468C746.789 383.599 749.56 386.49 752.452 388.417C757.994 392.15 758.115 398.171 759.681 403.591C760.042 404.674 757.874 406.36 756.91 407.806C753.536 404.915 748.115 402.507 747.151 399.014C745.705 393.836 743.536 389.982 739.681 386.61C736.187 383.599 732.452 380.709 733.537 375.29V375.169Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M923.174 523.294C928.234 526.546 928.234 529.797 921.849 534.855C918.235 537.745 914.741 541.117 912.331 545.092C908.958 550.511 904.259 546.296 900.524 547.982L899.078 546.778C901.729 543.406 903.897 539.672 906.909 536.782C911.849 532.085 917.391 528.111 923.174 523.414V523.294Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M524.266 80.6006C534.145 81.4436 543.904 82.1662 554.265 83.0092C552.578 89.1511 548.844 90.7166 543.904 90.7166C533.181 90.7166 525.229 86.8629 524.266 80.6006Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M808.238 406.246C806.31 405.042 804.383 403.717 801.973 402.272C801.371 404.199 800.768 406.006 800.286 407.812C793.419 403.477 793.78 395.167 801.491 386.496C804.624 388.182 807.997 389.868 811.25 391.554C811.13 392.156 811.009 392.638 810.768 393.24C809.202 393.842 807.756 394.444 805.829 395.167C807.033 398.419 808.359 401.67 809.684 405.042C809.202 405.403 808.72 405.765 808.238 406.126V406.246Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M928.838 519.927C927.393 519.324 926.308 518.843 925.465 518.602C927.393 512.942 929.2 507.522 931.368 501.501C932.332 503.307 933.296 505.114 934.139 506.92C937.031 507.161 940.043 507.402 943.296 507.643C938.236 514.748 933.898 520.89 929.561 527.032C928.959 526.671 928.356 526.309 927.874 526.069C928.236 524.021 928.597 522.094 928.838 520.047V519.927Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M787.152 421.296C778.116 419.249 769.2 417.202 760.164 415.275C760.526 408.531 761.369 408.17 767.152 409.735C771.489 410.94 776.067 412.505 780.525 412.746C785.344 412.987 786.549 416.118 788.116 419.249C787.875 419.972 787.513 420.694 787.272 421.296H787.152Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M682.213 94.81C680.044 88.7885 682.936 86.7412 687.996 86.7412C691.128 86.7412 694.381 87.1025 697.273 88.1864C698.96 88.7885 700.044 90.9562 701.369 92.5218C699.442 93.6057 697.514 95.5325 695.586 95.653C691.249 95.8938 686.912 95.1713 682.092 94.9304L682.213 94.81Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M842.937 252.689C841.491 252.689 839.925 252.809 838.479 252.93C837.516 251.846 835.588 250.642 835.588 249.558C835.588 246.427 836.431 243.295 837.034 239.321C841.732 240.887 846.07 242.212 851.612 244.018C846.793 245.824 849.925 253.532 842.937 252.689Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M806.189 356.269C808.117 354.824 810.045 353.379 812.575 351.452C812.695 350.489 813.057 348.321 813.659 343.985C817.997 348.923 821.37 352.777 824.864 356.751C820.527 358.798 816.912 360.484 812.575 362.411C812.334 361.207 812.093 359.641 811.732 357.714H806.912C806.671 357.233 806.43 356.63 806.189 356.149V356.269Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M790.289 107.699C796.434 108.662 803.06 102.159 807.879 111.673C805.711 112.998 802.578 116.49 800.409 116.009C796.554 115.166 790.048 115.888 790.41 107.699H790.289Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M465.716 203.674V214.272C462.825 214.874 459.813 215.476 456.921 216.078C454.27 206.685 456.439 203.674 465.716 203.674Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M844.615 524.387C848.471 524.628 852.326 524.989 856.543 525.35C857.386 529.926 856.784 534.262 851.965 534.864C845.7 535.707 846.543 529.204 843.893 526.073C844.134 525.591 844.374 524.989 844.615 524.507V524.387Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M803.778 343.498C800.525 340.126 794.862 338.199 798.477 332.9C799.681 331.214 805.826 330.371 807.031 331.695C811.368 336.151 806.067 339.162 803.778 343.498Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M796.064 324.474C796.305 319.777 789.558 317.369 795.221 313.274C796.426 312.431 799.679 312.311 799.92 312.792C801.606 316.767 801.004 320.38 796.185 324.474H796.064Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M619.32 88.5489C615.344 88.9102 612.091 89.1511 608.959 89.3919C609.682 87.7059 609.923 85.5382 611.128 84.5747C614.14 82.407 617.031 82.7683 619.32 88.5489Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M695.83 360.966C698.119 364.338 702.577 366.144 698.721 370.239C697.757 371.202 696.191 371.443 694.866 372.045C694.504 370.721 693.782 369.275 693.902 367.951C694.143 365.903 694.986 363.977 695.83 360.966Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M284.933 119.943C285.535 121.389 286.258 122.834 286.98 124.399C290.471 123.677 294.685 120.666 296.852 126.567C304.677 124.038 309.734 131.264 316.355 132.348C322.736 133.431 326.588 139.453 323.338 144.631C327.19 147.16 332.487 148.846 334.293 152.339C335.617 154.988 332.608 159.926 331.404 164.261C328.153 162.335 325.866 160.889 323.458 159.565C328.755 165.947 324.542 172.089 323.217 179.797C319.606 177.509 315.873 175.823 312.984 173.294C309.132 169.922 305.52 166.911 299.741 167.513C298.056 167.633 296.13 165.827 294.203 164.864C295.407 163.178 296.491 161.251 298.056 159.806C299.019 158.842 300.825 158.842 301.788 157.879C304.196 155.711 308.53 152.339 308.048 151.135C306.724 147.883 303.714 144.631 300.584 143.186C297.093 141.5 292.638 141.621 290.23 141.259C289.749 146.438 291.073 152.821 288.545 155.831C285.656 159.203 279.155 159.324 275.904 160.408C267.597 170.042 260.133 178.592 252.669 187.023C259.17 195.573 265.43 202.919 277.349 202.076C278.553 205.93 279.756 210.145 281.442 215.685C283.248 210.506 284.572 206.773 285.896 202.919C284.933 202.076 283.97 201.233 281.923 199.427H288.786C289.628 191.96 290.712 184.614 291.073 177.268C291.314 172.21 294.324 171.608 297.815 172.571C301.306 173.414 304.436 175.461 307.807 176.786C309.011 177.268 310.456 177.388 312.141 177.749C312.382 181.362 312.503 185.096 312.743 189.19H320.448C320.809 187.625 321.171 185.939 321.532 184.253C322.254 184.253 323.217 184.253 323.338 184.493C325.505 189.19 328.514 193.767 329.478 198.825C330.441 203.883 334.293 209.543 340.553 210.386C340.553 213.758 340.794 217.371 340.553 220.863C340.192 225.319 341.517 228.691 344.767 232.183C346.573 234.11 346.332 237.844 347.416 242.661C342.48 240.614 339.229 239.289 335.979 237.964C336.099 237.482 336.34 237.001 336.46 236.399C334.173 236.76 331.885 237.242 327.913 237.844C331.885 231.702 335.136 226.764 339.229 220.502C333.33 222.79 328.996 224.596 324.903 226.162C324.18 227.848 323.578 229.775 322.495 231.461C321.291 233.267 319.606 234.713 318.041 236.278C319.726 237.482 321.532 238.687 323.217 239.771C323.699 240.132 324.301 240.252 326.468 240.975C322.134 243.504 318.642 245.551 314.188 248.08C314.549 246.033 314.79 245.19 315.151 243.143C309.493 245.551 304.436 247.719 299.019 250.127C300.464 252.897 301.306 254.583 302.631 257.112C292.397 258.798 288.906 265.783 286.98 274.093C285.896 275.899 285.054 277.947 283.85 279.633C282.766 281.078 281.442 282.402 280.118 283.607C276.867 286.618 272.894 289.267 270.246 292.759C269.042 294.325 270.246 297.817 270.246 300.346C270.246 300.708 270.968 300.949 270.968 301.31C270.968 307.211 270.366 313.473 278.553 316.364C277.951 316.845 277.228 317.447 276.626 317.929C275.302 317.327 273.978 316.966 272.774 316.243C271.69 315.641 270.727 314.918 270.005 313.955C267.838 311.426 265.671 308.897 263.745 306.127C262.541 304.561 262.059 301.189 260.855 301.069C257.244 300.587 253.511 301.069 249.9 301.43C248.094 301.671 245.806 303.478 244.843 302.755C237.861 298.179 232.323 301.551 226.183 305.645C226.183 311.185 226.062 316.966 226.183 322.746C226.183 325.275 226.424 328.166 227.628 330.213C228.711 331.899 231.36 333.344 233.406 333.464C234.61 333.464 236.175 330.935 237.259 329.249C237.981 328.166 238.222 326.6 238.703 325.034H250.983C250.02 329.852 249.057 334.428 247.973 339.727C249.418 340.088 251.224 340.69 253.03 340.931C260.614 342.135 261.698 343.701 260.614 351.408C260.253 353.817 260.012 356.226 259.892 358.634C259.892 359.839 260.133 360.922 260.374 362.006C264.467 364.415 270.125 351.288 273.015 363.451C272.533 364.054 271.931 364.656 271.45 365.258C269.283 367.064 266.995 368.871 263.624 371.761C258.568 367.064 253.15 361.886 247.733 356.828C246.649 355.744 245.445 354.419 244.121 354.058C239.426 352.854 234.851 352.011 233.286 346.35C233.045 345.748 231.36 345.387 230.276 345.146C223.053 343.219 215.348 342.256 208.726 339.004C205.596 337.559 203.188 331.899 202.948 328.045C202.586 321.783 200.058 317.568 195.604 313.714C194.159 312.51 193.316 310.703 191.39 308.295C192.233 312.389 192.955 315.28 193.678 318.772C189.103 318.772 186.936 317.207 184.769 313.835C179.833 306.247 177.304 298.058 174.776 289.628C174.295 288.183 173.332 286.497 172.128 285.654C165.988 281.439 164.182 275.538 164.784 268.553C165.506 259.521 166.469 250.489 167.192 241.457C167.432 238.205 167.312 234.953 166.951 231.702C165.867 223.633 164.543 215.564 163.46 207.977C163.098 209.061 162.376 210.627 161.774 212.313C161.293 212.554 160.691 212.794 160.209 213.035C161.533 198.343 146.725 198.102 140.826 189.792C139.743 188.347 134.205 190.154 131.195 190.515C130.713 195.573 131.797 201.474 129.51 203.16C125.055 206.652 118.795 207.977 113.257 210.265C113.016 209.784 112.775 209.182 112.535 208.7L116.387 201.113C115.785 200.631 115.304 200.149 114.702 199.788C107.599 206.893 101.218 214.721 93.2722 220.622C87.3731 225.078 80.1496 228.571 72.0835 227.607C71.7223 227.125 71.3612 226.523 71 226.042C74.8525 223.151 78.8254 220.381 82.5575 217.371C88.2158 212.554 93.6333 207.375 99.5325 202.197C93.8741 198.704 93.7537 198.704 88.577 203.28C86.4099 200.511 84.2429 197.741 82.1963 194.971C81.9555 195.212 81.5943 195.573 81.3535 195.814C80.7516 193.646 80.6312 191.117 79.4273 189.311C75.6952 183.65 76.6583 178.472 82.9186 175.943C87.1323 174.257 91.8275 173.655 96.1615 172.21C98.3286 171.487 100.255 170.283 102.061 168.115H89.6605C86.0488 164.021 83.1594 160.889 79.7885 157.156C86.7711 155.47 93.3926 150.412 102.542 152.941C103.265 152.339 104.95 150.894 106.515 149.569C103.626 148.003 100.616 146.799 97.9674 144.993C96.8839 144.27 96.0411 142.102 96.2819 140.898C96.5227 139.935 98.5693 139.092 99.8936 138.73C106.154 137.165 112.294 135.84 118.554 134.395C119.517 134.154 120.601 133.672 121.443 133.793C133.001 136.081 144.438 138.49 155.995 140.778C159.607 141.5 163.339 141.982 166.831 141.621C173.332 141.019 179.712 139.694 186.936 138.61C187.056 138.971 187.658 140.537 188.38 142.945C190.788 141.38 192.955 140.055 195.243 138.61C195.122 139.092 195.002 139.453 194.761 139.935C204.753 142.945 214.866 145.956 224.859 149.208C226.905 149.81 228.711 151.255 230.517 152.339C232.804 147.883 229.072 144.15 222.571 143.668C218.117 143.307 213.783 140.898 209.449 139.333C210.051 137.767 210.653 136.201 211.375 134.274C206.92 131.384 201.021 131.625 194.761 134.395C193.678 131.143 191.511 128.253 192.233 126.085C193.557 121.87 196.206 117.896 198.854 114.283C200.419 111.995 212.218 114.042 216.552 116.692C218.237 115.488 219.923 114.524 221.247 113.32C222.451 112.116 223.414 110.67 224.618 109.105C228.229 109.586 232.202 110.068 234.61 110.309C237.018 107.298 238.703 105.131 240.389 102.963C241.472 105.01 242.676 107.057 244.241 109.948C248.455 108.262 253.511 106.335 260.012 103.806V114.042C256.882 113.802 253.632 113.681 250.502 113.44C249.418 113.44 248.335 112.597 247.372 112.959C239.907 115.367 232.443 118.017 224.738 120.666C227.026 121.75 229.554 122.834 232.684 124.399C239.305 116.933 248.455 118.137 257.845 118.739C258.447 121.87 259.049 124.64 259.651 127.771C255.197 130.782 250.742 133.793 246.168 136.924V143.186C242.676 142.825 239.426 142.464 235.814 142.102C240.389 148.124 241.232 148.244 254.836 144.029C255.558 145.715 256.401 147.401 257.123 149.087C257.725 149.087 258.207 149.087 258.809 149.087C258.809 145.474 258.809 141.982 258.809 138.369C258.809 136.201 259.17 134.034 259.29 131.986C261.096 132.227 263.143 131.986 264.708 132.709C266.514 133.672 268.079 135.358 269.523 136.804C270.848 138.128 271.931 139.694 273.617 141.019C271.329 133.552 273.496 127.29 278.553 122.111C279.877 120.786 282.646 120.786 284.692 120.064H284.452L284.933 119.943Z" fill="currentColor"/>
<path d="M272.414 365.178C272.896 364.576 273.498 363.973 273.979 363.371C278.795 359.036 283.61 354.7 288.667 350.124C290.473 351.69 292.038 352.894 293.843 354.459C295.047 353.496 296.251 352.412 297.696 351.208C299.261 352.894 300.465 354.58 302.03 355.664C304.438 357.35 306.725 358.554 310.217 359.156C316.356 360.24 323.941 361.806 327.071 369.513C328.516 373.246 330.683 375.775 335.739 374.932C341.398 374.089 346.213 379.268 346.815 385.892C346.935 387.818 346.815 389.866 346.815 393.117C354.761 395.165 363.068 397.091 371.254 399.38C373.903 400.102 376.19 402.029 378.718 403.113C380.284 403.835 382.089 403.835 383.534 404.558C384.979 405.281 386.905 406.365 387.507 407.689C390.757 416.119 387.146 423.706 383.414 431.053C381.969 433.943 379.08 436.231 377.394 439.121C376.07 441.289 375.348 443.818 374.866 446.347C374.023 451.405 373.542 456.463 372.94 461.642C372.458 465.857 370.291 468.024 365.957 469.229C359.336 471.035 356.446 475.491 356.085 482.355C356.085 483.198 356.326 484.162 355.965 484.764C353.196 489.22 349.704 493.314 347.537 498.011C344.768 503.792 340.434 505.357 334.776 504.394C334.535 505.357 334.174 505.719 334.295 506.08C337.064 516.557 336.341 516.678 325.867 521.013C322.496 522.458 320.45 527.878 318.523 531.852C317.44 534.02 318.283 537.03 317.56 539.439C316.356 543.172 312.865 546.544 317.56 550.398C318.162 550.88 317.56 554.252 316.597 555.215C306.484 564.609 309.253 570.51 319.727 577.976C313.828 582.432 303.595 579.783 299.983 573.641C293.001 561.959 292.158 548.953 291.315 535.826C291.195 533.056 290.713 530.286 290.473 527.276C292.158 525.228 293.964 522.699 296.853 519.086H289.148C290.713 510.777 292.278 502.828 293.843 494.88C294.325 492.592 295.288 490.424 295.288 488.136C295.288 479.947 295.649 471.637 295.047 463.448C294.566 457.065 292.76 451.285 286.861 447.19C282.286 444.059 276.628 440.687 278.072 433.22C278.193 432.498 276.266 431.534 275.303 430.571C273.377 428.644 270.969 426.958 269.645 424.549C267.598 420.575 266.876 416.481 273.859 414.915C271.21 413.229 269.163 412.025 267.96 411.182C262.06 394.803 274.099 380.833 272.534 365.298L272.414 365.178Z" fill="currentColor"/>
<path d="M382.571 79.1561C382.21 68.5583 382.21 68.6788 391.962 68.197C402.676 67.7153 413.271 66.511 423.985 66.6315C430.848 66.6315 437.71 68.7992 444.572 69.8831C444.572 70.8465 444.692 71.6895 444.813 72.6529C441.081 74.5798 437.469 76.5067 433.737 78.554C433.978 79.0357 434.219 79.5174 434.339 79.9991C435.784 79.6378 437.228 79.397 438.553 78.9152C442.887 77.3497 446.98 76.1454 450.471 80.6013C451.073 81.3238 452.277 81.4443 452.999 82.0464C454.324 83.0098 455.528 84.2141 456.852 85.298C455.407 85.9001 453.963 86.7431 452.397 87.2249C448.665 88.3087 444.813 89.2722 440.84 90.356C441.562 93.3668 442.044 95.1732 442.405 96.6183C440.599 97.8226 439.034 98.7861 437.349 99.9904C440.118 102.038 442.285 103.603 445.535 106.132C441.081 106.975 438.191 107.577 434.941 108.3C435.422 111.311 436.265 114.081 436.265 116.85C436.265 119.379 436.386 123.113 434.941 124.197C431.57 126.726 431.209 129.375 432.653 133.47C430.727 132.988 429.403 132.627 427.477 132.145C428.801 134.072 429.884 135.517 430.968 136.962C430.727 137.564 430.486 138.287 430.246 138.889C425.31 137.323 420.253 135.758 415.317 134.192C415.076 134.915 414.836 135.517 414.715 136.24C417.605 137.444 420.494 138.648 424.347 140.214C421.457 142.863 418.688 145.994 415.438 148.162C410.02 151.895 404.362 155.267 398.583 158.399C396.416 159.603 393.647 160.085 391.239 159.964C386.062 159.603 385.34 163.216 384.016 166.708C381.247 173.693 378.357 180.678 376.07 186.218C370.893 184.773 367.041 184.05 363.549 182.725C361.984 182.123 360.058 180.558 359.697 179.112C358.734 175.861 358.975 172.368 358.252 169.117C357.289 164.3 355.965 159.723 354.4 153.1C356.206 151.052 359.456 147.44 363.068 143.345C360.179 141.659 356.928 139.732 352.233 136.962C355.243 136.36 356.928 136.36 358.012 135.637C358.975 135.035 359.577 133.711 359.215 131.904C357.289 132.747 355.243 133.59 353.196 134.554C352.474 128.05 351.751 122.27 351.149 116.73C346.695 115.164 342.602 113.719 338.508 112.395C337.666 112.154 336.582 112.395 335.739 112.635C330.081 114.562 326.229 112.756 323.46 106.253C328.155 105.771 332.609 105.41 337.064 105.048C337.064 104.567 337.064 104.205 337.064 103.724C331.165 103.483 325.386 103.122 319.487 102.881C319.246 102.038 319.005 101.195 318.885 100.352C325.506 98.0635 332.248 95.7753 340.073 93.0055C337.425 91.3195 335.98 90.4765 334.535 89.513C349.825 81.3238 365.115 74.5798 382.812 79.2765L382.571 79.1561ZM415.197 76.5067C424.748 78.6744 430.165 78.3532 431.45 75.5432C425.912 75.9045 420.494 76.2658 415.197 76.5067Z" fill="currentColor"/>
<path d="M286.251 119.86C282.278 118.294 278.305 116.969 274.332 115.163C273.129 114.681 272.406 113.236 271.443 112.273C271.684 111.671 272.045 111.189 272.286 110.587C275.175 111.189 278.185 111.791 281.074 112.393C284.084 112.995 287.094 113.597 290.224 114.079C290.465 113.357 290.585 112.634 290.826 111.911C288.659 111.189 286.492 110.105 284.204 109.744C281.917 109.382 279.509 109.744 276.861 109.744C277.824 103.843 280.713 101.795 286.371 102.879C285.408 102.036 284.445 101.193 282.88 99.8684C285.529 97.8211 288.298 95.6534 291.669 93.1244C285.168 91.9201 282.88 96.376 280.352 100.591C276.138 100.591 272.888 99.6276 273.61 94.2083C273.61 93.4857 273.369 92.4018 272.888 92.0405C266.387 86.7417 275.175 84.9352 275.296 81.2019C277.824 82.2858 280.352 83.2492 282.639 84.6944C284.084 85.5374 285.288 86.9825 287.455 87.4642C286.973 86.6212 286.612 85.6578 285.89 84.9352C280.593 79.6363 280.954 76.6256 288.538 75.7826C302.143 74.3374 315.987 74.0966 329.712 73.6149C335.972 73.374 342.232 73.6149 349.215 73.6149C347.409 82.5266 340.186 79.0342 335.731 81.6836V86.3804C329.11 89.7524 322.488 92.4018 316.83 96.376C313.58 98.6642 311.894 103.24 309.366 106.612C307.199 109.503 304.912 112.393 302.744 115.163C298.29 120.703 291.789 119.378 285.89 119.98H286.131L286.251 119.86Z" fill="currentColor"/>
<path d="M430.967 152.62C436.264 153.584 441.441 154.668 448.062 155.872C447.22 154.908 447.701 155.149 447.701 155.511C448.544 159.244 452.878 163.218 448.544 166.831C446.497 168.517 442.645 168.035 439.515 168.517C436.384 168.999 433.375 169.842 431.448 165.988C430.967 164.904 428.8 164.784 426.994 164.061C427.596 162.495 428.198 161.171 428.92 159.485C427.957 159.244 426.753 158.883 425.309 158.521C427.476 155.751 429.281 153.463 431.087 151.055C431.087 151.536 430.967 152.139 430.847 152.62H430.967Z" fill="currentColor"/>
<path d="M300.83 335.791C285.661 337.838 283.975 337.236 285.059 332.54C280.364 330.011 276.27 327.241 271.695 325.796C267.843 324.471 263.509 324.712 258.693 324.11C259.295 323.266 260.379 320.497 261.703 320.256C270.251 319.292 278.678 319.172 285.42 326.157C286.985 327.722 289.513 328.686 291.801 329.168C295.774 330.011 299.746 330.492 300.83 335.912V335.791Z" fill="currentColor"/>
<path d="M290.113 172.011C287.946 171.529 285.659 170.927 283.131 170.325C280.482 175.262 277.472 173.817 273.74 169.843C276.87 167.434 279.639 163.34 282.649 163.34C285.538 163.34 288.428 167.314 291.317 169.482C290.956 170.325 290.595 171.168 290.113 172.011Z" fill="currentColor"/>
<path d="M288.06 317.365C291.07 319.532 293.477 321.218 295.885 323.025C296.246 323.386 296.246 324.59 295.885 325.072C295.524 325.554 294.2 326.156 293.959 325.915C291.672 323.506 285.652 323.988 287.939 317.244L288.06 317.365Z" fill="currentColor"/>
<path d="M280.839 337.357C278.431 337.839 275.903 338.2 271.689 339.043C273.134 336.394 273.616 334.105 274.458 333.985C276.625 333.865 278.792 334.587 280.959 334.948V337.357H280.839Z" fill="currentColor"/>
</svg>`;
  } else if (continente_detetado === "Africa") {
    novoConteudoSVG = `<svg width="100%" viewBox="0 0 1024 642" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="1024" height="642" fill="none"/>
<path d="M484.813 222.944C487.102 220.777 490.716 219.091 491.439 216.441C493.367 209.577 498.909 208.975 502.885 208.132C503.849 203.676 504.571 200.183 505.415 195.968C505.174 195.968 504.09 195.246 502.764 195.246C499.27 195.005 497.584 193.439 498.065 189.826C498.668 184.407 493.969 178.747 498.186 173.689C501.559 169.715 505.776 166.463 509.391 162.609C511.439 160.442 513.607 158.154 514.451 155.504C517.222 147.315 524.692 144.063 530.595 139.126C532.764 137.319 535.896 136.597 538.306 134.911C544.33 130.575 551.438 131.779 556.86 136.717C560.836 140.21 566.137 142.498 571.197 144.425C576.619 146.472 581.438 148.278 581.317 155.384C587.944 154.42 586.137 148.88 587.582 145.027H593.486C593.727 147.194 594.088 149.121 594.45 152.493C602.763 143.822 612.763 142.739 623.365 143.461C623.606 142.859 623.726 142.257 623.967 141.655C621.919 141.053 619.871 140.33 617.702 139.728C618.425 138.764 619.028 137.801 619.751 136.838C621.919 137.199 624.329 137.078 626.377 137.921C631.196 139.848 634.931 139.005 637.943 134.79C638.907 133.466 640.112 132.382 641.196 131.177C645.292 126.44 649.268 126.44 653.124 131.177C654.569 129.973 655.895 128.648 657.822 127.083C658.545 129.612 659.148 131.539 659.75 133.466C660.232 133.466 660.593 133.586 661.075 133.706C661.557 131.9 661.919 129.973 662.401 127.805C663.967 127.805 665.654 127.564 667.461 127.444C667.702 125.878 668.063 124.433 668.304 122.988C668.666 123.47 669.027 124.072 669.389 124.554C678.304 117.569 687.942 112.029 700.231 109.621C700.352 109.621 701.677 110.945 703.966 112.993C706.617 109.5 708.665 106.008 711.436 103.117C712.641 101.913 716.617 101.19 717.099 101.793C720.352 106.369 724.93 105.887 729.026 104.924C734.448 103.479 737.098 107.091 739.147 110.343C740.351 112.27 739.388 115.522 739.388 119.255C747.58 120.7 757.821 120.459 765.893 124.433C778.062 130.455 789.989 125.517 801.917 127.444C803.122 122.627 805.531 121.302 810.591 122.386C821.314 124.674 829.989 131.418 840.35 135.031C843.362 130.936 847.94 129.973 850.47 134.309C855.41 142.739 862.518 139.005 869.024 139.126C869.627 139.126 870.109 138.644 870.711 138.524C871.073 138.524 871.434 138.524 872.036 138.524C873.241 140.089 874.566 141.655 876.976 144.545C876.615 141.053 876.494 139.126 876.133 135.272C883.362 137.319 889.627 139.126 895.892 140.932C898.301 141.655 900.831 142.136 903 143.22C908.542 145.99 913.964 149.001 919.385 151.891C919.988 152.252 920.349 152.975 920.951 153.216C926.654 155.464 929.024 160.361 928.06 167.908C925.409 166.584 922.879 165.861 921.072 164.295C915.771 160.08 915.048 160.08 910.711 166.102C912.518 168.27 914.325 170.558 916.614 173.328C912.879 174.532 909.867 175.616 906.614 176.338C902.759 177.302 898.663 177.543 897.699 182.721C897.578 183.444 894.687 183.805 893.12 184.046C889.988 184.407 886.494 183.805 883.723 184.889C879.024 186.936 879.506 192.596 884.687 196.57C881.072 204.157 877.338 211.865 873.603 219.572C872.88 219.572 872.157 219.332 871.314 219.332C870.229 217.405 869.145 215.478 868.181 213.431C866.976 210.781 865.53 208.132 864.808 205.362C864.085 202.833 863.241 199.822 864.085 197.534C866.494 191.031 869.627 184.889 872.398 178.626C871.916 178.145 871.434 177.663 870.952 177.302C870.109 178.867 869.145 180.433 868.542 181.517C866.374 180.794 863.241 179.59 863.121 179.951C861.555 182.962 860.47 186.214 859.145 189.345C859.506 190.067 859.747 190.79 860.109 191.512C853.121 190.429 846.013 189.465 839.025 188.14C830.23 186.334 827.097 188.14 824.447 196.57C823.844 198.497 821.917 200.063 820.953 201.99C820.35 203.074 819.868 205.241 820.35 205.603C821.435 206.446 823.121 206.687 824.567 206.687C827.097 206.446 829.627 205.844 832.157 205.482C832.278 205.964 832.398 206.446 832.519 207.048C833.362 205.844 834.206 204.639 836.133 201.749C837.218 205.603 837.579 207.891 838.422 210.059C839.989 213.792 841.796 217.405 843.483 221.138C844.687 223.547 846.374 225.835 847.097 228.364C847.338 229.086 845.049 230.532 843.242 232.579C843.242 232.94 843.362 234.867 843.603 237.276C838.422 234.987 838.061 230.893 837.579 226.678C837.097 222.944 836.013 219.332 835.169 215.719C834.567 215.719 834.085 215.96 833.483 216.08C833.483 217.043 833.242 218.007 833.483 218.729C837.579 230.532 830.712 239.443 825.652 248.837C825.17 249.8 823.844 250.402 822.88 250.884C815.17 254.979 814.447 256.424 815.29 265.576C815.772 270.875 817.579 276.295 811.917 282.437C807.82 275.813 803.965 269.791 800.11 263.65C797.941 268.467 795.893 272.32 794.688 276.295C794.086 278.101 794.327 281.112 795.411 282.196C802.158 288.699 801.314 301.946 794.929 310.135C792.278 313.507 790.592 317.722 788.423 321.576C786.495 325.068 784.086 327.477 779.387 326.995C777.339 326.754 775.05 328.2 771.074 329.404C777.7 332.174 776.134 335.064 774.206 338.677C772.881 341.206 772.761 344.698 772.64 347.709C772.158 357.825 768.785 363.004 763.845 364.088C758.062 359.993 753.604 356.741 749.267 353.61C746.014 358.066 746.978 363.124 752.038 368.062C757.219 372.999 759.146 379.503 760.472 386.367C751.918 381.068 743.725 375.649 741.797 364.69C741.556 363.606 741.315 361.92 741.918 361.197C744.809 357.584 743.002 355.296 740.713 352.406C739.147 350.359 739.026 347.107 737.942 343.374C736.858 343.374 734.93 343.012 733.002 342.892C729.388 342.651 728.424 341.326 728.303 337.232C728.183 333.017 724.809 328.922 722.641 324.225C719.749 325.55 716.617 326.032 714.81 327.838C710.111 332.656 706.617 339.038 701.436 343.012C694.93 348.07 697.099 355.537 694.689 361.559C692.641 366.496 690.714 368.423 686.979 367.339C682.28 357.103 677.943 347.589 673.605 338.195C672.882 336.63 672.401 334.823 671.919 333.137C671.557 331.933 671.678 330.247 670.955 329.765C664.69 325.791 663.124 316.398 653.244 315.916C648.184 315.675 643.485 314.109 639.268 318.324C637.582 315.795 636.256 313.869 635.052 311.942C634.57 312.183 634.088 312.423 633.606 312.544C634.57 314.832 635.172 317.481 636.738 319.408C641.196 324.707 640.594 330.849 634.811 334.944C626.016 341.086 617.1 346.866 607.221 351.202C600.715 354.092 598.787 353.851 596.859 346.625C594.45 337.954 589.269 331.331 583.847 324.707C581.799 320.01 579.751 315.193 577.582 310.497C577.101 316.518 576.378 322.66 583.245 325.309C583.607 333.378 587.462 339.761 592.402 345.782C594.932 348.793 596.98 352.165 600.353 356.982C603.727 356.26 608.666 355.537 613.365 353.972C616.98 352.767 619.389 353.731 619.269 357.223C619.269 361.077 618.425 365.292 616.618 368.664C613.245 375.047 609.028 380.948 605.173 386.969C604.329 388.294 603.606 390.1 602.281 390.702C596.257 393.954 593.365 399.132 592.161 405.395C591.197 409.971 590.594 414.668 590.353 419.244C590.112 423.58 590.594 428.035 590.594 432.491C590.474 438.633 589.39 443.812 583.968 448.749C579.751 452.603 578.667 459.949 576.257 465.73C575.655 467.175 575.655 469.945 575.052 470.065C568.185 471.39 569.631 477.412 567.824 481.627C566.619 484.517 563.245 486.564 562.041 489.575C557.583 500.895 546.378 501.979 537.342 506.194C533.005 508.241 529.872 506.435 528.788 501.859C526.619 492.826 521.921 484.637 521.559 474.882C521.318 469.222 516.86 463.683 514.571 457.902C513.607 455.493 512.162 452.483 512.885 450.435C517.222 437.309 514.089 424.543 511.439 411.778C511.198 410.814 510.957 409.73 510.354 409.008C503.728 401.902 504.933 393.713 507.102 385.404C507.583 383.597 507.102 381.55 507.102 379.021C499.15 381.55 492.162 381.67 486.258 374.565C486.258 374.565 485.415 374.444 485.295 374.685C480.355 383.236 471.439 380.466 464.331 380.827C459.994 381.068 454.934 376.853 451.199 373.481C448.307 370.832 447.464 366.014 444.813 363.004C439.753 357.344 440.235 350.84 439.512 343.976C438.307 332.174 442.042 321.576 445.536 310.858C446.259 308.811 448.428 307.125 450.355 305.679C454.813 302.548 457.584 298.574 457.343 293.155C456.861 284.966 463.367 281.594 468.066 277.017C468.668 276.415 470.716 276.174 471.319 276.776C475.295 280.028 478.186 277.258 481.319 275.452C492.041 274.247 502.764 272.923 513.607 271.718C512.644 282.918 515.294 286.049 523.366 288.819C527.222 290.144 530.957 292.312 535.294 294.359C536.74 286.772 542.161 287.495 547.824 288.338C555.294 289.542 562.763 290.746 571.077 292.071C572.281 287.013 573.727 281.473 575.052 275.933C574.45 275.813 573.968 275.692 573.366 275.452C571.799 277.499 570.354 279.546 568.787 281.594C568.306 281.232 567.824 280.991 567.221 280.63C567.221 279.065 567.101 277.499 567.101 277.378C561.318 276.656 556.378 275.933 551.318 275.211C550.233 270.634 549.149 266.058 548.065 261.121C543.125 264.252 546.378 268.708 546.378 272.32C546.378 273.404 549.39 274.488 551.077 275.452V280.028C547.583 278.221 544.932 275.933 542.041 275.572C538.185 275.09 537.583 273.284 537.704 270.032C537.945 265.817 536.981 262.084 532.282 260.398C531.92 258.953 532.041 256.906 531.198 256.063C527.704 252.69 523.969 249.8 520.354 246.669C519.872 247.151 519.391 247.632 518.909 248.114C520.836 250.161 522.764 252.45 524.812 254.256C527.222 256.424 529.872 258.351 532.402 260.398C532.523 260.518 532.643 260.639 532.764 260.88C532.764 261 532.764 261.241 532.764 261.482C531.439 261.482 530.113 261.482 530.234 261.482C527.824 265.336 525.776 268.587 523.366 272.561C521.68 271.237 519.872 269.791 518.427 268.708C520.595 266.901 522.041 265.697 523.487 264.493C521.8 262.686 520.475 260.398 518.427 258.953C516.258 257.387 513.607 256.544 511.077 255.46C509.752 258.712 514.089 264.131 506.499 266.419C506.017 260.278 505.535 254.858 505.053 249.439C503.246 249.8 500.716 251.125 498.668 250.523C494.09 249.318 491.68 251.245 490.114 254.858C487.102 261.723 484.331 268.708 481.439 275.572C474.813 274.609 468.186 273.645 460.476 272.441V249.68C466.138 249.318 471.198 248.716 476.259 248.837C480.837 248.957 481.921 245.344 480.837 243.177C479.271 240.166 477.945 235.71 472.885 235.59C471.68 235.59 470.475 234.265 469.271 233.422C470.235 232.338 471.078 230.893 472.283 230.17C476.379 227.4 480.716 224.992 484.933 222.342L484.813 222.463V222.944ZM542.161 160.442C541.559 160.08 540.956 159.84 540.354 159.478C537.222 163.332 533.848 166.945 531.198 171.16C529.39 174.05 527.222 178.506 528.186 181.035C531.198 188.622 526.981 194.162 524.451 200.304C523.728 201.99 521.318 204.157 519.993 204.037C518.065 203.796 516.017 201.869 514.812 200.063C513.246 197.895 512.523 195.246 511.318 192.837C510.836 192.958 510.354 193.198 509.873 193.319C511.077 197.413 512.282 201.388 513.848 206.807C517.463 205.964 521.68 203.796 525.415 204.398C534.21 205.723 535.414 201.026 536.137 194.282C536.378 191.994 538.788 190.067 540.113 187.9C540.836 187.9 541.679 188.02 542.402 188.14C541.438 185.973 541.077 182.962 539.511 181.999C531.318 176.94 530.836 174.291 537.463 167.186C539.27 165.138 540.595 162.609 542.161 160.321V160.442ZM565.534 154.179C566.378 159.358 565.896 164.055 573.125 164.898C569.751 157.07 579.39 161.044 579.992 155.263C575.414 154.902 570.836 154.541 565.534 154.179ZM629.871 312.544C627.702 309.172 626.016 306.161 623.967 303.271C622.16 300.742 621.919 295.202 616.377 298.694C619.51 303.993 622.401 309.051 625.293 313.989C626.979 313.507 628.546 313.026 629.871 312.544ZM769.628 339.038C770.592 338.436 771.556 337.714 772.64 337.111C770.592 334.101 768.544 331.21 766.375 328.2C765.532 328.802 764.688 329.404 763.725 330.006C765.652 333.017 767.58 336.148 769.628 339.159V339.038Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M286.869 119.738C287.471 121.183 288.194 122.629 288.917 124.194C292.411 123.472 296.628 120.461 298.796 126.362C306.628 123.833 311.688 131.059 318.314 132.143C324.7 133.226 328.555 139.248 325.302 144.426C329.158 146.955 334.459 148.641 336.266 152.134C337.591 154.783 334.579 159.721 333.374 164.056C330.121 162.129 327.832 160.684 325.423 159.36C330.724 165.742 326.507 171.884 325.182 179.592C321.567 177.304 317.832 175.618 314.941 173.089C311.085 169.716 307.471 166.706 301.688 167.308C300.001 167.428 298.074 165.622 296.146 164.658C297.351 162.972 298.435 161.046 300.001 159.6C300.965 158.637 302.772 158.637 303.736 157.674C306.146 155.506 310.483 152.134 310.001 150.93C308.676 147.678 305.664 144.426 302.531 142.981C299.037 141.295 294.58 141.416 292.17 141.054C291.688 146.233 293.013 152.616 290.483 155.626C287.592 158.998 281.086 159.119 277.833 160.203C269.52 169.837 262.05 178.387 254.58 186.817C261.086 195.368 267.351 202.714 279.279 201.871C280.483 205.725 281.688 209.94 283.375 215.48C285.182 210.301 286.507 206.568 287.833 202.714C286.869 201.871 285.905 201.028 283.857 199.222H290.724C291.568 191.755 292.652 184.409 293.013 177.063C293.254 172.005 296.266 171.402 299.76 172.366C303.254 173.209 306.387 175.256 309.76 176.581C310.965 177.063 312.411 177.183 314.097 177.544C314.338 181.157 314.459 184.891 314.7 188.985H322.411C322.772 187.42 323.133 185.734 323.495 184.048C324.218 184.048 325.182 184.048 325.302 184.288C327.471 188.985 330.483 193.561 331.447 198.62C332.41 203.678 336.266 209.338 342.531 210.181C342.531 213.553 342.772 217.166 342.531 220.658C342.169 225.114 343.495 228.486 346.748 231.978C348.555 233.905 348.314 237.639 349.398 242.456C344.459 240.408 341.206 239.084 337.953 237.759C338.073 237.277 338.314 236.796 338.435 236.193C336.145 236.555 333.856 237.036 329.88 237.639C333.856 231.497 337.109 226.559 341.206 220.297C335.302 222.585 330.965 224.391 326.868 225.957C326.146 227.643 325.543 229.57 324.459 231.256C323.254 233.062 321.567 234.507 320.001 236.073C321.688 237.277 323.495 238.482 325.182 239.565C325.664 239.927 326.266 240.047 328.435 240.77C324.097 243.299 320.603 245.346 316.146 247.875C316.507 245.828 316.748 244.985 317.109 242.937C311.447 245.346 306.387 247.514 300.965 249.922C302.411 252.692 303.254 254.378 304.58 256.907C294.339 258.593 290.845 265.578 288.917 273.888C287.833 275.694 286.989 277.742 285.785 279.428C284.7 280.873 283.375 282.197 282.05 283.402C278.797 286.412 274.821 289.062 272.17 292.554C270.966 294.12 272.17 297.612 272.17 300.141C272.17 300.503 272.893 300.744 272.893 301.105C272.893 307.006 272.291 313.268 280.483 316.158C279.881 316.64 279.158 317.242 278.556 317.724C277.231 317.122 275.905 316.761 274.7 316.038C273.616 315.436 272.652 314.713 271.929 313.75C269.761 311.221 267.592 308.692 265.664 305.922C264.46 304.356 263.978 300.984 262.773 300.864C259.158 300.382 255.424 300.864 251.809 301.225C250.002 301.466 247.713 303.273 246.749 302.55C239.761 297.974 234.219 301.346 228.075 305.44C228.075 310.98 227.954 316.761 228.075 322.541C228.075 325.07 228.315 327.961 229.52 330.008C230.605 331.694 233.255 333.139 235.303 333.259C236.508 333.259 238.074 330.73 239.159 329.044C239.882 327.961 240.123 326.395 240.604 324.829H252.893C251.93 329.647 250.966 334.223 249.881 339.522C251.327 339.883 253.134 340.485 254.942 340.726C262.532 341.93 263.616 343.496 262.532 351.203C262.17 353.612 261.929 356.021 261.809 358.429C261.809 359.633 262.05 360.717 262.291 361.801C266.387 364.21 272.05 351.083 274.941 363.246C274.459 363.848 273.857 364.451 273.375 365.053C271.206 366.859 268.917 368.666 265.544 371.556C260.484 366.859 255.062 361.681 249.641 356.623C248.556 355.539 247.351 354.214 246.026 353.853C241.327 352.649 236.749 351.806 235.183 346.145C234.942 345.543 233.255 345.182 232.171 344.941C224.942 343.014 217.231 342.051 210.605 338.799C207.472 337.354 205.063 331.694 204.822 327.84C204.46 321.578 201.93 317.363 197.473 313.509C196.027 312.305 195.183 310.498 193.256 308.09C194.099 312.184 194.822 315.075 195.545 318.567C190.967 318.567 188.798 317.001 186.629 313.629C181.69 306.042 179.16 297.853 176.629 289.423C176.148 287.978 175.184 286.292 173.979 285.449C167.834 281.234 166.027 275.333 166.63 268.348C167.352 259.316 168.316 250.284 169.039 241.251C169.28 238 169.16 234.748 168.798 231.497C167.714 223.428 166.389 215.359 165.304 207.772C164.943 208.856 164.22 210.422 163.618 212.108C163.136 212.348 162.533 212.589 162.051 212.83C163.377 198.138 148.558 197.897 142.654 189.587C141.57 188.142 136.028 189.949 133.016 190.31C132.534 195.368 133.618 201.269 131.329 202.955C126.871 206.447 120.606 207.772 115.064 210.06C114.823 209.579 114.582 208.976 114.341 208.495L118.196 200.908C117.594 200.426 117.112 199.944 116.51 199.583C109.401 206.688 103.016 214.516 95.0643 220.417C89.1607 224.873 81.9319 228.366 73.8597 227.402C73.4983 226.92 73.1368 226.318 72.7754 225.837C76.6308 222.946 80.6066 220.176 84.3415 217.166C90.0041 212.348 95.4257 207.17 101.329 201.992C95.6667 198.499 95.5462 198.499 90.3655 203.075C88.1969 200.306 86.0282 197.536 83.9801 194.766C83.7391 195.007 83.3777 195.368 83.1367 195.609C82.5343 193.441 82.4138 190.912 81.209 189.106C77.4741 183.445 78.438 178.267 84.7029 175.738C88.9198 174.052 93.6185 173.45 97.9558 172.005C100.124 171.282 102.052 170.078 103.859 167.91H91.4498C87.8354 163.815 84.9439 160.684 81.5705 156.951C88.5583 155.265 95.1847 150.207 104.341 152.736C105.064 152.134 106.751 150.689 108.317 149.364C105.426 147.798 102.414 146.594 99.763 144.788C98.6787 144.065 97.8353 141.897 98.0763 140.693C98.3172 139.73 100.365 138.887 101.691 138.525C107.956 136.96 114.1 135.635 120.365 134.19C121.329 133.949 122.413 133.467 123.257 133.588C134.823 135.876 146.268 138.284 157.834 140.573C161.449 141.295 165.184 141.777 168.678 141.416C175.184 140.813 181.569 139.489 188.798 138.405C188.918 138.766 189.521 140.332 190.244 142.74C192.653 141.175 194.822 139.85 197.111 138.405C196.991 138.887 196.87 139.248 196.629 139.73C206.629 142.74 216.749 145.751 226.749 149.003C228.797 149.605 230.605 151.05 232.412 152.134C234.701 147.678 230.966 143.945 224.46 143.463C220.002 143.102 215.665 140.693 211.328 139.127C211.93 137.562 212.533 135.996 213.255 134.069C208.798 131.179 202.894 131.42 196.629 134.19C195.545 130.938 193.376 128.048 194.099 125.88C195.424 121.665 198.075 117.691 200.725 114.078C202.292 111.79 214.099 113.837 218.436 116.487C220.123 115.282 221.81 114.319 223.135 113.115C224.34 111.91 225.303 110.465 226.508 108.9C230.123 109.381 234.099 109.863 236.508 110.104C238.918 107.093 240.604 104.926 242.291 102.758C243.376 104.805 244.58 106.852 246.147 109.743C250.363 108.057 255.424 106.13 261.929 103.601V113.837C258.797 113.596 255.544 113.476 252.412 113.235C251.327 113.235 250.243 112.392 249.279 112.753C241.809 115.162 234.339 117.811 226.629 120.461C228.918 121.545 231.448 122.629 234.58 124.194C241.207 116.728 250.363 117.932 259.761 118.534C260.363 121.665 260.966 124.435 261.568 127.566C257.11 130.577 252.653 133.588 248.074 136.719V142.981C244.58 142.62 241.327 142.259 237.713 141.897C242.291 147.919 243.135 148.039 256.749 143.824C257.472 145.51 258.315 147.196 259.038 148.882C259.64 148.882 260.122 148.882 260.725 148.882C260.725 145.269 260.725 141.777 260.725 138.164C260.725 135.996 261.086 133.829 261.207 131.781C263.014 132.022 265.062 131.781 266.628 132.504C268.435 133.467 270.002 135.153 271.447 136.598C272.773 137.923 273.857 139.489 275.544 140.813C273.255 133.347 275.423 127.085 280.483 121.906C281.809 120.581 284.58 120.581 286.628 119.859H286.387L286.869 119.738Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M273.256 365.179C273.738 364.577 274.341 363.974 274.823 363.372C279.642 359.037 284.461 354.701 289.521 350.125C291.328 351.691 292.895 352.895 294.702 354.46C295.907 353.497 297.112 352.413 298.557 351.209C300.124 352.895 301.328 354.581 302.895 355.665C305.304 357.351 307.593 358.555 311.087 359.157C317.232 360.241 324.822 361.807 327.955 369.514C329.4 373.247 331.569 375.776 336.629 374.933C342.292 374.09 347.111 379.269 347.713 385.893C347.834 387.819 347.713 389.867 347.713 393.118C355.665 395.166 363.978 397.092 372.171 399.381C374.821 400.103 377.11 402.03 379.641 403.114C381.207 403.836 383.014 403.836 384.46 404.559C385.906 405.282 387.833 406.365 388.436 407.69C391.689 416.12 388.074 423.707 384.339 431.053C382.894 433.944 380.002 436.232 378.315 439.122C376.99 441.29 376.267 443.819 375.785 446.348C374.942 451.406 374.46 456.464 373.858 461.643C373.376 465.858 371.207 468.025 366.87 469.23C360.243 471.036 357.352 475.492 356.99 482.356C356.99 483.199 357.231 484.163 356.87 484.765C354.099 489.221 350.605 493.315 348.436 498.012C345.665 503.793 341.328 505.358 335.665 504.395C335.424 505.358 335.063 505.72 335.183 506.081C337.954 516.558 337.232 516.679 326.75 521.014C323.376 522.459 321.328 527.879 319.4 531.853C318.316 534.02 319.159 537.031 318.437 539.44C317.232 543.173 313.738 546.545 318.437 550.399C319.039 550.881 318.437 554.253 317.473 555.216C307.352 564.61 310.123 570.511 320.605 577.977C314.702 582.433 304.461 579.784 300.846 573.642C293.859 561.96 293.015 548.954 292.172 535.827C292.051 533.057 291.569 530.287 291.328 527.276C293.015 525.229 294.822 522.7 297.714 519.087H290.003C291.569 510.778 293.136 502.829 294.702 494.881C295.184 492.593 296.148 490.425 296.148 488.137C296.148 479.948 296.509 471.638 295.907 463.449C295.425 457.066 293.618 451.286 287.714 447.191C283.136 444.06 277.473 440.688 278.919 433.221C279.039 432.499 277.112 431.535 276.148 430.572C274.22 428.645 271.811 426.959 270.485 424.55C268.437 420.576 267.714 416.482 274.702 414.916C272.052 413.23 270.003 412.026 268.799 411.183C262.895 394.804 274.943 380.834 273.377 365.299L273.256 365.179Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M383.5 79.1561C383.138 68.5583 383.138 68.6788 392.897 68.197C403.62 67.7153 414.222 66.511 424.945 66.6315C431.812 66.6315 438.68 68.7992 445.547 69.8831C445.547 70.8465 445.668 71.6895 445.788 72.6529C442.053 74.5798 438.439 76.5067 434.704 78.554C434.945 79.0357 435.186 79.5174 435.306 79.9991C436.752 79.6378 438.198 79.397 439.523 78.9152C443.86 77.3497 447.957 76.1454 451.451 80.6013C452.053 81.3238 453.258 81.4443 453.981 82.0464C455.306 83.0098 456.511 84.2141 457.836 85.298C456.39 85.9001 454.945 86.7431 453.378 87.2249C449.643 88.3087 445.788 89.2722 441.812 90.356C442.535 93.3668 443.017 95.1732 443.378 96.6183C441.571 97.8226 440.005 98.7861 438.318 99.9904C441.089 102.038 443.258 103.603 446.511 106.132C442.053 106.975 439.162 107.577 435.909 108.3C436.391 111.311 437.234 114.081 437.234 116.85C437.234 119.379 437.354 123.113 435.909 124.197C432.535 126.726 432.174 129.375 433.62 133.47C431.692 132.988 430.367 132.627 428.439 132.145C429.764 134.072 430.848 135.517 431.933 136.962C431.692 137.564 431.451 138.287 431.21 138.889C426.27 137.323 421.21 135.758 416.27 134.192C416.029 134.915 415.788 135.517 415.668 136.24C418.559 137.444 421.451 138.648 425.306 140.214C422.415 142.863 419.644 145.994 416.391 148.162C410.969 151.895 405.307 155.267 399.524 158.399C397.355 159.603 394.584 160.085 392.174 159.964C386.994 159.603 386.271 163.216 384.945 166.708C382.174 173.693 379.283 180.678 376.994 186.218C371.813 184.773 367.958 184.05 364.464 182.725C362.898 182.123 360.97 180.558 360.608 179.112C359.645 175.861 359.886 172.368 359.163 169.117C358.199 164.3 356.874 159.723 355.307 153.1C357.115 151.052 360.367 147.44 363.982 143.345C361.09 141.659 357.837 139.732 353.139 136.962C356.151 136.36 357.837 136.36 358.922 135.637C359.886 135.035 360.488 133.711 360.127 131.904C358.199 132.747 356.151 133.59 354.103 134.554C353.38 128.05 352.657 122.27 352.054 116.73C347.597 115.164 343.5 113.719 339.404 112.395C338.561 112.154 337.476 112.395 336.633 112.635C330.97 114.562 327.115 112.756 324.344 106.253C329.043 105.771 333.5 105.41 337.958 105.048C337.958 104.567 337.958 104.205 337.958 103.724C332.055 103.483 326.272 103.122 320.368 102.881C320.127 102.038 319.886 101.195 319.766 100.352C326.392 98.0635 333.139 95.7753 340.97 93.0055C338.32 91.3195 336.874 90.4765 335.428 89.513C350.729 81.3238 366.03 74.5798 383.741 79.2765L383.5 79.1561ZM416.15 76.5067C425.708 78.6744 431.13 78.3532 432.415 75.5432C426.873 75.9045 421.451 76.2658 416.15 76.5067Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M823.853 427.917C831.804 430.446 839.876 426.713 846.744 431.891C842.647 435.665 844.535 439.88 852.406 444.536C858.189 439.117 853.009 431.289 856.382 425.268C863.25 424.424 859.997 430.807 861.804 433.457C863.972 436.588 865.418 440.08 867.105 443.452C868.792 446.945 870.84 450.437 871.924 454.05C873.008 457.663 873.008 461.517 873.611 465.852C878.069 463.925 879.273 466.093 880.117 470.067C881.804 477.895 884.093 485.723 879.996 493.43C877.105 498.85 873.972 504.269 870.599 509.448C863.852 519.925 858.069 521.972 846.141 519.202C838.19 517.396 837.828 516.914 838.19 508.484C832.768 508.243 829.395 505.353 826.744 500.295C824.334 495.598 814.094 495.719 806.865 499.091C800.479 502.101 793.853 504.51 787.347 506.798C783.733 508.123 779.154 504.39 779.998 500.897C782.287 491.383 778.19 482.471 777.347 473.198C776.986 468.863 777.106 466.575 781.564 466.213C786.504 465.732 788.431 462.721 789.154 458.386C789.877 454.411 791.202 451.16 796.624 454.411C795.66 447.427 799.997 446.222 804.696 446.824C808.551 447.306 810.118 445.981 810.118 442.609C810.118 437.551 813.25 435.624 817.467 434.781C821.081 434.059 825.057 433.818 823.732 427.676L823.853 427.917Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M287.109 119.861C283.133 118.295 279.157 116.97 275.181 115.164C273.976 114.682 273.253 113.237 272.289 112.274C272.53 111.671 272.892 111.19 273.133 110.588C276.024 111.19 279.036 111.792 281.928 112.394C284.94 112.996 287.952 113.598 291.084 114.08C291.325 113.357 291.446 112.635 291.687 111.912C289.518 111.19 287.35 110.106 285.06 109.745C282.771 109.383 280.362 109.745 277.711 109.745C278.675 103.844 281.566 101.796 287.229 102.88C286.265 102.037 285.301 101.194 283.735 99.8694C286.386 97.8221 289.157 95.6544 292.53 93.1254C286.024 91.9211 283.735 96.377 281.205 100.592C276.988 100.592 273.735 99.6286 274.458 94.2092C274.458 93.4867 274.217 92.4028 273.735 92.0415C267.229 86.7426 276.024 84.9362 276.145 81.2029C278.675 82.2867 281.205 83.2502 283.494 84.6953C284.94 85.5383 286.145 86.9835 288.313 87.4652C287.831 86.6222 287.47 85.6588 286.747 84.9362C281.446 79.6373 281.807 76.6266 289.398 75.7836C303.012 74.3384 316.867 74.0976 330.602 73.6158C336.867 73.375 343.132 73.6158 350.12 73.6158C348.313 82.5276 341.084 79.0352 336.626 81.6846V86.3813C330 89.7534 323.373 92.4028 317.711 96.377C314.458 98.6651 312.771 103.241 310.241 106.613C308.072 109.504 305.783 112.394 303.614 115.164C299.157 120.704 292.651 119.379 286.747 119.981H286.988L287.109 119.861Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M826.98 399.858C829.028 397.329 830.233 396.004 831.438 394.439C829.269 393.596 827.1 392.873 824.932 392.151C827.944 386.37 830.715 385.768 837.462 389.14C836.859 390.103 836.257 391.067 835.534 391.91C834.932 392.512 834.088 392.994 833.365 393.475C833.365 394.198 833.486 394.8 833.606 395.523C835.775 395.523 838.425 396.366 839.992 395.402C845.895 391.91 849.63 392.03 855.654 396.245C859.148 398.774 862.883 400.942 867.461 403.832C871.076 408.89 875.533 414.912 879.991 421.054C879.509 421.656 879.027 422.378 878.545 422.981C876.618 421.897 874.329 421.295 872.883 419.729C870.112 416.598 867.943 415.393 864.811 419.488C863.967 420.451 860.714 420.09 858.787 419.488C856.136 418.765 853.606 417.2 850.233 415.634C848.425 407.686 836.859 398.413 827.1 399.738L826.98 399.858Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M540.839 108.539C536.14 106.371 532.405 104.685 528.309 102.878C527.827 104.564 527.104 106.973 526.502 109.382C526.14 110.586 525.899 111.67 525.538 112.874C521.562 111.67 517.345 110.706 513.61 109.02C512.767 108.659 512.767 105.287 513.369 103.721C514.092 101.794 515.899 100.349 516.622 97.459C513.61 99.0246 510.598 100.711 508.911 101.554C506.381 97.8203 504.092 95.0504 502.526 91.9193C501.803 90.3537 501.803 87.8247 502.647 86.3795C503.49 85.0548 506.02 83.8505 507.466 84.2118C509.996 84.8139 512.285 86.6204 514.092 87.4634C515.417 86.0182 516.863 84.5731 518.309 83.1279C519.755 84.8139 521.2 86.4999 522.767 88.0655C523.971 89.2698 525.297 90.8354 526.743 91.1967C536.02 93.8461 541.08 99.0246 540.839 108.418V108.539Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M790.968 371.313C798.076 372.036 798.558 373.963 797.112 382.152C795.907 389.137 795.425 396.242 792.293 402.746C791.449 404.552 788.799 407.563 788.196 407.322C783.98 405.395 778.558 403.709 776.389 400.216C769.522 388.535 770.124 388.414 781.57 380.827C784.823 378.66 787.233 375.167 790.847 371.313H790.968Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M614.457 428.281C614.698 433.941 615.662 439.721 614.818 445.261C613.493 454.052 610.722 462.603 609.156 471.274C608.071 477.295 603.252 476.573 599.517 476.814C598.313 476.814 596.023 472.478 595.903 470.19C595.782 465.975 596.987 461.76 597.469 457.545C597.71 456.22 598.192 454.534 597.71 453.45C595.662 448.994 597.59 445.622 600.963 443.575C605.903 440.564 608.312 436.108 610.12 431.05C610.481 429.967 611.324 429.124 611.927 428.16C612.77 428.16 613.614 428.16 614.457 428.281Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M484.936 222.836C479.032 223.317 473.129 223.679 467.346 224.16C467.346 223.799 467.105 223.438 466.984 223.197C468.43 222.233 469.996 221.39 471.924 220.066C467.105 214.044 471.683 210.552 476.141 207.18C469.876 203.085 468.551 198.268 471.804 189.718C472.647 187.429 476.743 186.466 479.273 184.9C479.635 185.503 480.117 185.984 480.478 186.586C479.755 188.032 478.912 189.597 478.43 190.681C481.683 197.786 484.815 204.892 488.068 212.238C487.225 215.249 486.02 219.223 484.936 223.076L485.056 222.956L484.936 222.836Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M844.934 252.698C845.778 259.201 846.501 265.824 847.464 272.328C847.946 275.94 847.103 278.59 843.489 280.035C838.79 281.841 833.971 283.407 829.513 285.695C826.862 287.02 824.814 289.549 821.561 292.319C820.718 290.874 818.549 288.826 818.79 287.02C819.272 283.768 819.272 280.035 823.73 278.349C829.031 276.302 833.971 273.291 838.79 270.28C840.115 269.437 841.199 267.029 841.199 265.343C841.32 261.248 840.838 257.033 840.477 252.818C841.922 252.818 843.489 252.698 844.934 252.577V252.698Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M639.394 108.061C637.105 109.867 634.936 112.035 632.527 113.359C628.43 115.648 624.093 117.334 619.876 119.26C619.153 119.622 618.551 120.224 617.828 120.585C611.965 124.037 610.961 128.774 614.816 134.796C615.298 135.518 615.539 136.241 615.9 136.843C611.683 140.938 608.912 140.215 601.684 132.749C604.696 126.848 607.105 120.465 610.961 115.166C612.888 112.516 617.467 111.433 620.96 110.228C626.623 108.301 632.406 106.736 638.069 105.05C638.43 106.013 638.912 106.977 639.273 107.94L639.394 108.061Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M735.537 375.169C741.199 373.363 744.814 375.049 747.344 380.468C748.789 383.599 751.56 386.49 754.452 388.417C759.994 392.15 760.115 398.171 761.681 403.591C762.042 404.674 759.874 406.36 758.91 407.806C755.536 404.915 750.115 402.507 749.151 399.014C747.705 393.836 745.536 389.982 741.681 386.61C738.187 383.599 734.452 380.709 735.537 375.29V375.169Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M431.928 152.622C437.229 153.586 442.41 154.67 449.036 155.874C448.193 154.91 448.675 155.151 448.675 155.513C449.518 159.246 453.856 163.22 449.518 166.833C447.47 168.519 443.615 168.037 440.482 168.519C437.35 169.001 434.338 169.844 432.41 165.99C431.928 164.906 429.76 164.786 427.952 164.063C428.555 162.497 429.157 161.173 429.88 159.487C428.916 159.246 427.711 158.885 426.266 158.523C428.434 155.753 430.241 153.465 432.049 151.057C432.049 151.538 431.928 152.141 431.808 152.622H431.928Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M925.174 523.294C930.234 526.546 930.234 529.797 923.849 534.855C920.235 537.745 916.741 541.117 914.331 545.092C910.958 550.511 906.259 546.296 902.524 547.982L901.078 546.778C903.729 543.406 905.897 539.672 908.909 536.782C913.849 532.085 919.391 528.111 925.174 523.414V523.294Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M301.694 335.792C286.513 337.839 284.826 337.237 285.911 332.541C281.212 330.012 277.116 327.242 272.537 325.796C268.682 324.472 264.345 324.713 259.525 324.11C260.128 323.267 261.212 320.498 262.537 320.257C271.092 319.293 279.525 319.173 286.272 326.158C287.838 327.723 290.368 328.687 292.657 329.169C296.633 330.012 300.609 330.493 301.694 335.913V335.792Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M526.266 80.6006C536.145 81.4436 545.904 82.1662 556.265 83.0092C554.578 89.1511 550.844 90.7166 545.904 90.7166C535.181 90.7166 527.229 86.8629 526.266 80.6006Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M810.238 406.246C808.31 405.042 806.383 403.717 803.973 402.272C803.371 404.199 802.768 406.006 802.286 407.812C795.419 403.477 795.78 395.167 803.491 386.496C806.624 388.182 809.997 389.868 813.25 391.554C813.13 392.156 813.009 392.638 812.768 393.24C811.202 393.842 809.756 394.444 807.829 395.167C809.033 398.419 810.359 401.67 811.684 405.042C811.202 405.403 810.72 405.765 810.238 406.126V406.246Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M930.838 519.927C929.393 519.324 928.308 518.843 927.465 518.602C929.393 512.942 931.2 507.522 933.368 501.501C934.332 503.307 935.296 505.114 936.139 506.92C939.031 507.161 942.043 507.402 945.296 507.643C940.236 514.748 935.898 520.89 931.561 527.032C930.959 526.671 930.356 526.309 929.874 526.069C930.236 524.021 930.597 522.094 930.838 520.047V519.927Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M789.152 421.296C780.116 419.249 771.2 417.202 762.164 415.275C762.526 408.531 763.369 408.17 769.152 409.735C773.489 410.94 778.067 412.505 782.525 412.746C787.344 412.987 788.549 416.118 790.116 419.249C789.875 419.972 789.513 420.694 789.272 421.296H789.152Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M684.213 94.81C682.044 88.7885 684.936 86.7412 689.996 86.7412C693.128 86.7412 696.381 87.1025 699.273 88.1864C700.96 88.7885 702.044 90.9562 703.369 92.5218C701.442 93.6057 699.514 95.5325 697.586 95.653C693.249 95.8938 688.912 95.1713 684.092 94.9304L684.213 94.81Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M844.937 252.689C843.491 252.689 841.925 252.809 840.479 252.93C839.516 251.846 837.588 250.642 837.588 249.558C837.588 246.427 838.431 243.295 839.034 239.321C843.732 240.887 848.07 242.212 853.612 244.018C848.793 245.824 851.925 253.532 844.937 252.689Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M808.189 356.269C810.117 354.824 812.045 353.379 814.575 351.452C814.695 350.489 815.057 348.321 815.659 343.985C819.997 348.923 823.37 352.777 826.864 356.751C822.527 358.798 818.912 360.484 814.575 362.411C814.334 361.207 814.093 359.641 813.732 357.714H808.912C808.671 357.233 808.43 356.63 808.189 356.149V356.269Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M792.289 107.699C798.434 108.662 805.06 102.159 809.879 111.673C807.711 112.998 804.578 116.49 802.409 116.009C798.554 115.166 792.048 115.888 792.41 107.699H792.289Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M467.716 203.674V214.272C464.825 214.874 461.813 215.476 458.921 216.078C456.27 206.685 458.439 203.674 467.716 203.674Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M846.615 524.387C850.471 524.628 854.326 524.989 858.543 525.35C859.386 529.926 858.784 534.262 853.965 534.864C847.7 535.707 848.543 529.204 845.893 526.073C846.134 525.591 846.374 524.989 846.615 524.507V524.387Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M805.778 343.498C802.525 340.126 796.862 338.199 800.477 332.9C801.681 331.214 807.826 330.371 809.031 331.695C813.368 336.151 808.067 339.162 805.778 343.498Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M290.971 172.008C288.803 171.526 286.513 170.924 283.983 170.322C281.333 175.259 278.321 173.814 274.586 169.84C277.718 167.432 280.489 163.337 283.501 163.337C286.393 163.337 289.285 167.311 292.176 169.479C291.815 170.322 291.453 171.165 290.971 172.008Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M798.064 324.474C798.305 319.777 791.558 317.369 797.221 313.274C798.426 312.431 801.679 312.311 801.92 312.792C803.606 316.767 803.004 320.38 798.185 324.474H798.064Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M621.32 88.5489C617.344 88.9102 614.091 89.1511 610.959 89.3919C611.682 87.7059 611.923 85.5382 613.128 84.5747C616.14 82.407 619.031 82.7683 621.32 88.5489Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M697.83 360.966C700.119 364.338 704.577 366.144 700.721 370.239C699.757 371.202 698.191 371.443 696.866 372.045C696.504 370.721 695.782 369.275 695.902 367.951C696.143 365.903 696.986 363.977 697.83 360.966Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M288.914 317.366C291.926 319.533 294.335 321.219 296.745 323.026C297.106 323.387 297.106 324.591 296.745 325.073C296.384 325.555 295.058 326.157 294.817 325.916C292.528 323.507 286.504 323.989 288.793 317.245L288.914 317.366Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M281.69 337.359C279.28 337.841 276.75 338.202 272.533 339.045C273.979 336.396 274.461 334.107 275.304 333.987C277.473 333.867 279.642 334.589 281.81 334.95V337.359H281.69Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M617.154 424.098C617.457 430.439 618.669 436.916 617.608 443.122C615.941 452.972 612.454 462.551 610.484 472.266C609.12 479.012 603.056 478.202 598.357 478.472C596.841 478.472 593.961 473.615 593.809 471.051C593.658 466.329 595.174 461.607 595.78 456.884C596.083 455.4 596.69 453.511 596.083 452.297C593.506 447.305 595.932 443.527 600.176 441.233C606.391 437.86 609.423 432.868 611.696 427.201C612.151 425.987 613.212 425.042 613.97 423.963C615.031 423.963 616.092 423.963 617.154 424.098Z" fill="currentColor"/>
<mask id="mask0_841_2" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="436" y="273" width="217" height="236">
<path d="M629.211 311.026C627.016 307.603 625.308 304.547 623.234 301.614C621.405 299.047 621.161 293.425 615.55 296.969C618.721 302.347 621.649 307.481 624.576 312.492C626.284 312.003 627.869 311.514 629.211 311.026Z" fill="currentColor"/>
</mask>
<g mask="url(#mask0_841_2)">
</g>
<g clip-path="url(#clip0_841_2)">
<path d="M438 339.663C438.222 332.208 439.908 325.411 441.949 318.702C442.171 318 442.392 317.298 442.526 316.597C443.546 311.247 446.652 307.432 451.044 304.318C454.461 301.906 456.324 298.486 456.235 294.232C456.102 289.409 457.744 285.374 461.427 282.173C463.157 280.682 464.799 279.148 466.529 277.657C467.949 276.429 469.457 276.078 471.143 277.306C473.14 278.753 475.447 278.753 477.399 277.393C480.106 275.464 483.123 275.201 486.184 274.85C494.526 273.929 502.867 273.096 511.208 272.044C512.939 271.824 513.072 272.438 513.027 273.754C513.027 275.552 513.072 277.393 513.338 279.191C513.959 283.489 516.311 286.295 520.259 287.786C524.741 289.496 529.089 291.47 533.437 293.531C534.324 293.969 535.123 294.496 535.655 292.961C537.386 287.742 541.29 287.567 545.239 288.093C553.758 289.233 562.276 290.637 570.795 291.864C572.038 292.04 572.57 292.522 572.925 293.662C574.478 298.618 575.986 303.573 577.672 308.484C578.338 310.414 577.761 312.255 577.717 314.097C577.584 318.745 578.205 322.867 583.085 325.148C583.662 325.411 583.884 325.981 583.928 326.595C584.461 333.392 587.522 339.136 591.782 344.311C594.71 347.863 597.372 351.634 599.901 355.493C600.655 356.633 601.498 356.984 602.874 356.677C606.778 355.888 610.683 355.23 614.498 354.002C618.625 352.686 620.044 354.265 620 358.475C619.911 367.377 614.276 373.735 610.017 380.751C609.396 381.76 608.686 382.681 608.065 383.689C605.846 387.417 603.229 390.618 599.546 393.205C594.932 396.406 593.423 401.712 592.358 407.062C590.672 415.306 590.894 423.638 591.116 431.926C591.294 438.591 589.474 444.248 584.372 448.809C582.553 450.431 581.399 452.624 580.556 454.904C578.87 459.333 577.14 463.762 576.075 468.41C575.853 469.331 575.543 470.077 574.567 470.34C571.638 471.085 570.085 473.19 569.686 475.953C569.065 480.25 567.379 483.846 564.184 486.828C562.853 488.1 562.232 489.854 561.433 491.52C558.683 497.309 553.314 499.983 547.724 502.22C544.041 503.711 540.314 505.07 536.587 506.474C533.126 507.745 530.065 506.649 529.177 503.185C527.27 495.774 523.853 488.801 522.3 481.259C522.034 480.031 521.59 478.803 521.635 477.619C521.857 472.226 519.416 467.709 517.02 463.192C516.577 462.359 516.177 461.482 515.734 460.649C512.939 455.913 512.096 451.177 513.826 445.608C515.956 438.898 514.935 431.882 513.826 424.997C513.116 420.525 512.14 416.139 511.253 411.71C511.031 410.57 510.676 409.43 509.833 408.553C505.307 403.861 504.642 398.16 505.44 392.065C505.884 388.557 507.259 385.18 507.038 381.497C506.904 379.567 506.505 379.173 504.642 379.655C500.693 380.708 496.655 381.058 492.662 379.655C490.399 378.822 488.447 377.506 486.85 375.752C485.696 374.481 484.853 374.656 483.877 376.015C481.481 379.348 478.109 380.927 474.027 380.927C470.389 380.927 466.795 380.927 463.157 380.927C462.58 380.927 461.915 380.927 461.427 380.751C455.215 378.208 449.891 374.656 446.962 368.298C446.075 366.368 445.099 364.482 443.679 362.86C440.884 359.746 439.642 355.931 439.198 351.897C438.71 347.687 438.488 343.478 438.177 339.663H438Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_841_2">
<rect width="182" height="235" fill="white" transform="translate(438 272)"/>
</clipPath>
</defs>
</svg>`;
  } else if (continente_detetado === "Asia") {
    novoConteudoSVG = `<svg width="100%" viewBox="0 0 1024 642" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="1024" height="642" fill="none"/>
<path d="M484.813 222.944C487.102 220.777 490.716 219.091 491.439 216.441C493.367 209.577 498.909 208.975 502.885 208.132C503.849 203.676 504.571 200.183 505.415 195.968C505.174 195.968 504.09 195.246 502.764 195.246C499.27 195.005 497.584 193.439 498.065 189.826C498.668 184.407 493.969 178.747 498.186 173.689C501.559 169.715 505.776 166.463 509.391 162.609C511.439 160.442 513.607 158.154 514.451 155.504C517.222 147.315 524.692 144.063 530.595 139.126C532.764 137.319 535.896 136.597 538.306 134.911C544.33 130.575 551.438 131.779 556.86 136.717C560.836 140.21 566.137 142.498 571.197 144.425C576.619 146.472 581.438 148.278 581.317 155.384C587.944 154.42 586.137 148.88 587.582 145.027H593.486C593.727 147.194 594.088 149.121 594.45 152.493C602.763 143.822 612.763 142.739 623.365 143.461C623.606 142.859 623.726 142.257 623.967 141.655C621.919 141.053 619.871 140.33 617.702 139.728C618.425 138.764 619.028 137.801 619.751 136.838C621.919 137.199 624.329 137.078 626.377 137.921C631.196 139.848 634.931 139.005 637.943 134.79C638.907 133.466 640.112 132.382 641.196 131.177C645.292 126.44 649.268 126.44 653.124 131.177C654.569 129.973 655.895 128.648 657.822 127.083C658.545 129.612 659.148 131.539 659.75 133.466C660.232 133.466 660.593 133.586 661.075 133.706C661.557 131.9 661.919 129.973 662.401 127.805C663.967 127.805 665.654 127.564 667.461 127.444C667.702 125.878 668.063 124.433 668.304 122.988C668.666 123.47 669.027 124.072 669.389 124.554C678.304 117.569 687.942 112.029 700.231 109.621C700.352 109.621 701.677 110.945 703.966 112.993C706.617 109.5 708.665 106.008 711.436 103.117C712.641 101.913 716.617 101.19 717.099 101.793C720.352 106.369 724.93 105.887 729.026 104.924C734.448 103.479 737.098 107.091 739.147 110.343C740.351 112.27 739.388 115.522 739.388 119.255C747.58 120.7 757.821 120.459 765.893 124.433C778.062 130.455 789.989 125.517 801.917 127.444C803.122 122.627 805.531 121.302 810.591 122.386C821.314 124.674 829.989 131.418 840.35 135.031C843.362 130.936 847.94 129.973 850.47 134.309C855.41 142.739 862.518 139.005 869.024 139.126C869.627 139.126 870.109 138.644 870.711 138.524C871.073 138.524 871.434 138.524 872.036 138.524C873.241 140.089 874.566 141.655 876.976 144.545C876.615 141.053 876.494 139.126 876.133 135.272C883.362 137.319 889.627 139.126 895.892 140.932C898.301 141.655 900.831 142.136 903 143.22C908.542 145.99 913.964 149.001 919.385 151.891C919.988 152.252 920.349 152.975 920.951 153.216C926.654 155.464 929.024 160.361 928.06 167.908C925.409 166.584 922.879 165.861 921.072 164.295C915.771 160.08 915.048 160.08 910.711 166.102C912.518 168.27 914.325 170.558 916.614 173.328C912.879 174.532 909.867 175.616 906.614 176.338C902.759 177.302 898.663 177.543 897.699 182.721C897.578 183.444 894.687 183.805 893.12 184.046C889.988 184.407 886.494 183.805 883.723 184.889C879.024 186.936 879.506 192.596 884.687 196.57C881.072 204.157 877.338 211.865 873.603 219.572C872.88 219.572 872.157 219.332 871.314 219.332C870.229 217.405 869.145 215.478 868.181 213.431C866.976 210.781 865.53 208.132 864.808 205.362C864.085 202.833 863.241 199.822 864.085 197.534C866.494 191.031 869.627 184.889 872.398 178.626C871.916 178.145 871.434 177.663 870.952 177.302C870.109 178.867 869.145 180.433 868.542 181.517C866.374 180.794 863.241 179.59 863.121 179.951C861.555 182.962 860.47 186.214 859.145 189.345C859.506 190.067 859.747 190.79 860.109 191.512C853.121 190.429 846.013 189.465 839.025 188.14C830.23 186.334 827.097 188.14 824.447 196.57C823.844 198.497 821.917 200.063 820.953 201.99C820.35 203.074 819.868 205.241 820.35 205.603C821.435 206.446 823.121 206.687 824.567 206.687C827.097 206.446 829.627 205.844 832.157 205.482C832.278 205.964 832.398 206.446 832.519 207.048C833.362 205.844 834.206 204.639 836.133 201.749C837.218 205.603 837.579 207.891 838.422 210.059C839.989 213.792 841.796 217.405 843.483 221.138C844.687 223.547 846.374 225.835 847.097 228.364C847.338 229.086 845.049 230.532 843.242 232.579C843.242 232.94 843.362 234.867 843.603 237.276C838.422 234.987 838.061 230.893 837.579 226.678C837.097 222.944 836.013 219.332 835.169 215.719C834.567 215.719 834.085 215.96 833.483 216.08C833.483 217.043 833.242 218.007 833.483 218.729C837.579 230.532 830.712 239.443 825.652 248.837C825.17 249.8 823.844 250.402 822.88 250.884C815.17 254.979 814.447 256.424 815.29 265.576C815.772 270.875 817.579 276.295 811.917 282.437C807.82 275.813 803.965 269.791 800.11 263.65C797.941 268.467 795.893 272.32 794.688 276.295C794.086 278.101 794.327 281.112 795.411 282.196C802.158 288.699 801.314 301.946 794.929 310.135C792.278 313.507 790.592 317.722 788.423 321.576C786.495 325.068 784.086 327.477 779.387 326.995C777.339 326.755 775.05 328.2 771.074 329.404C777.7 332.174 776.134 335.064 774.206 338.677C772.881 341.206 772.761 344.698 772.64 347.709C772.158 357.825 768.785 363.004 763.845 364.088C758.062 359.993 753.604 356.741 749.267 353.61C746.014 358.066 746.978 363.124 752.038 368.062C757.219 372.999 759.146 379.503 760.472 386.367C751.918 381.068 743.725 375.649 741.797 364.69C741.556 363.606 741.315 361.92 741.918 361.197C744.809 357.584 743.002 355.296 740.713 352.406C739.147 350.359 739.026 347.107 737.942 343.374C736.858 343.374 734.93 343.012 733.002 342.892C729.388 342.651 728.424 341.326 728.303 337.232C728.183 333.017 724.809 328.922 722.641 324.225C719.749 325.55 716.617 326.032 714.81 327.838C710.111 332.656 706.617 339.038 701.436 343.012C694.93 348.07 697.099 355.537 694.689 361.559C692.641 366.496 690.714 368.423 686.979 367.339C682.28 357.103 677.943 347.589 673.605 338.195C672.882 336.63 672.401 334.823 671.919 333.137C671.557 331.933 671.678 330.247 670.955 329.765C664.69 325.791 663.124 316.398 653.244 315.916C648.184 315.675 643.485 314.109 639.268 318.324C637.582 315.795 636.256 313.869 635.052 311.942C634.57 312.183 634.088 312.423 633.606 312.544C634.57 314.832 635.172 317.481 636.738 319.408C641.196 324.707 640.594 330.849 634.811 334.944C626.016 341.086 617.1 346.866 607.221 351.202C600.715 354.092 598.787 353.851 596.859 346.625C594.45 337.954 589.269 331.331 583.847 324.707C581.799 320.01 579.751 315.193 577.583 310.497C577.101 316.518 576.378 322.66 583.245 325.309C583.607 333.378 587.462 339.761 592.402 345.782C594.932 348.793 596.98 352.165 600.353 356.982C603.727 356.26 608.666 355.537 613.365 353.972C616.98 352.767 619.389 353.731 619.269 357.223C619.269 361.077 618.425 365.292 616.618 368.664C613.245 375.047 609.028 380.948 605.173 386.969C604.329 388.294 603.606 390.1 602.281 390.702C596.257 393.954 593.365 399.132 592.161 405.395C591.197 409.971 590.594 414.668 590.353 419.244C590.112 423.58 590.594 428.035 590.594 432.491C590.474 438.633 589.39 443.812 583.968 448.749C579.751 452.603 578.667 459.949 576.257 465.73C575.655 467.175 575.655 469.945 575.052 470.065C568.185 471.39 569.631 477.411 567.824 481.627C566.619 484.517 563.245 486.564 562.041 489.575C557.583 500.895 546.378 501.979 537.342 506.194C533.005 508.241 529.872 506.435 528.788 501.859C526.619 492.826 521.921 484.637 521.559 474.882C521.318 469.222 516.86 463.683 514.571 457.902C513.607 455.493 512.162 452.483 512.885 450.435C517.222 437.309 514.089 424.543 511.439 411.778C511.198 410.814 510.957 409.73 510.354 409.008C503.728 401.902 504.933 393.713 507.102 385.404C507.583 383.597 507.102 381.55 507.102 379.021C499.15 381.55 492.162 381.67 486.258 374.565C486.258 374.565 485.415 374.444 485.295 374.685C480.355 383.236 471.439 380.466 464.331 380.827C459.994 381.068 454.934 376.853 451.199 373.481C448.307 370.832 447.464 366.014 444.813 363.004C439.753 357.344 440.235 350.84 439.512 343.976C438.307 332.174 442.042 321.576 445.536 310.858C446.259 308.811 448.428 307.125 450.355 305.679C454.813 302.548 457.584 298.574 457.343 293.155C456.861 284.966 463.367 281.594 468.066 277.017C468.668 276.415 470.716 276.174 471.319 276.776C475.295 280.028 478.186 277.258 481.319 275.452C492.041 274.247 502.764 272.923 513.607 271.718C512.644 282.918 515.294 286.049 523.366 288.819C527.222 290.144 530.957 292.312 535.294 294.359C536.74 286.772 542.161 287.495 547.824 288.338C555.294 289.542 562.763 290.746 571.077 292.071C572.281 287.013 573.727 281.473 575.052 275.933C574.45 275.813 573.968 275.692 573.366 275.452C571.799 277.499 570.354 279.546 568.787 281.594C568.306 281.232 567.824 280.991 567.221 280.63C567.221 279.064 567.101 277.499 567.101 277.378C561.318 276.656 556.378 275.933 551.318 275.211C550.233 270.634 549.149 266.058 548.065 261.121C543.125 264.252 546.378 268.708 546.378 272.32C546.378 273.404 549.39 274.488 551.077 275.452V280.028C547.583 278.221 544.932 275.933 542.041 275.572C538.185 275.09 537.583 273.284 537.704 270.032C537.945 265.817 536.981 262.084 532.282 260.398C531.92 258.953 532.041 256.906 531.198 256.063C527.704 252.69 523.969 249.8 520.354 246.669C519.872 247.151 519.391 247.632 518.909 248.114C520.836 250.161 522.764 252.45 524.812 254.256C527.222 256.424 529.872 258.351 532.402 260.398C532.523 260.518 532.643 260.639 532.764 260.88C532.764 261 532.764 261.241 532.764 261.482C531.439 261.482 530.113 261.482 530.234 261.482C527.824 265.336 525.776 268.587 523.366 272.561C521.68 271.237 519.872 269.791 518.427 268.708C520.595 266.901 522.041 265.697 523.487 264.493C521.8 262.686 520.475 260.398 518.427 258.953C516.258 257.387 513.607 256.544 511.077 255.46C509.752 258.712 514.089 264.131 506.499 266.419C506.017 260.278 505.535 254.858 505.053 249.439C503.246 249.8 500.716 251.125 498.668 250.523C494.09 249.318 491.68 251.245 490.114 254.858C487.102 261.723 484.331 268.708 481.439 275.572C474.813 274.609 468.186 273.645 460.476 272.441V249.68C466.138 249.318 471.198 248.716 476.259 248.837C480.837 248.957 481.921 245.344 480.837 243.177C479.271 240.166 477.945 235.71 472.885 235.59C471.68 235.59 470.475 234.265 469.271 233.422C470.235 232.338 471.078 230.893 472.283 230.17C476.379 227.4 480.716 224.992 484.933 222.342L484.813 222.463V222.944ZM542.161 160.442C541.559 160.08 540.956 159.84 540.354 159.478C537.222 163.332 533.848 166.945 531.198 171.16C529.39 174.05 527.222 178.506 528.186 181.035C531.198 188.622 526.981 194.162 524.451 200.304C523.728 201.99 521.318 204.157 519.993 204.037C518.065 203.796 516.017 201.869 514.812 200.063C513.246 197.895 512.523 195.246 511.318 192.837C510.836 192.958 510.354 193.198 509.873 193.319C511.077 197.413 512.282 201.388 513.848 206.807C517.463 205.964 521.68 203.796 525.415 204.398C534.21 205.723 535.414 201.026 536.137 194.282C536.378 191.994 538.788 190.067 540.113 187.9C540.836 187.9 541.679 188.02 542.402 188.14C541.438 185.973 541.077 182.962 539.511 181.999C531.318 176.94 530.836 174.291 537.463 167.186C539.27 165.138 540.595 162.609 542.161 160.321V160.442ZM565.534 154.179C566.378 159.358 565.896 164.055 573.125 164.898C569.751 157.07 579.39 161.044 579.992 155.263C575.414 154.902 570.836 154.541 565.534 154.179ZM629.871 312.544C627.702 309.172 626.016 306.161 623.967 303.271C622.16 300.742 621.919 295.202 616.377 298.694C619.51 303.993 622.401 309.051 625.293 313.989C626.979 313.507 628.546 313.026 629.871 312.544ZM769.628 339.038C770.592 338.436 771.556 337.714 772.64 337.111C770.592 334.101 768.544 331.21 766.375 328.2C765.532 328.802 764.688 329.404 763.725 330.006C765.652 333.017 767.58 336.148 769.628 339.159V339.038Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M286.869 119.738C287.471 121.183 288.194 122.629 288.917 124.194C292.411 123.472 296.628 120.461 298.796 126.362C306.628 123.833 311.688 131.059 318.314 132.143C324.7 133.226 328.555 139.248 325.302 144.426C329.158 146.955 334.459 148.641 336.266 152.134C337.591 154.783 334.579 159.721 333.374 164.056C330.121 162.129 327.832 160.684 325.423 159.36C330.724 165.742 326.507 171.884 325.182 179.592C321.567 177.304 317.832 175.618 314.941 173.089C311.085 169.716 307.471 166.706 301.688 167.308C300.001 167.428 298.074 165.622 296.146 164.658C297.351 162.972 298.435 161.046 300.001 159.6C300.965 158.637 302.772 158.637 303.736 157.674C306.146 155.506 310.483 152.134 310.001 150.93C308.676 147.678 305.664 144.426 302.531 142.981C299.037 141.295 294.58 141.416 292.17 141.054C291.688 146.233 293.013 152.616 290.483 155.626C287.592 158.998 281.086 159.119 277.833 160.203C269.52 169.837 262.05 178.387 254.58 186.817C261.086 195.368 267.351 202.714 279.279 201.871C280.483 205.725 281.688 209.94 283.375 215.48C285.182 210.301 286.507 206.568 287.833 202.714C286.869 201.871 285.905 201.028 283.857 199.222H290.724C291.568 191.755 292.652 184.409 293.013 177.063C293.254 172.005 296.266 171.402 299.76 172.366C303.254 173.209 306.387 175.256 309.76 176.581C310.965 177.063 312.411 177.183 314.097 177.544C314.338 181.157 314.459 184.891 314.7 188.985H322.411C322.772 187.42 323.133 185.734 323.495 184.048C324.218 184.048 325.182 184.048 325.302 184.288C327.471 188.985 330.483 193.561 331.447 198.62C332.41 203.678 336.266 209.338 342.531 210.181C342.531 213.553 342.772 217.166 342.531 220.658C342.169 225.114 343.495 228.486 346.748 231.978C348.555 233.905 348.314 237.639 349.398 242.456C344.458 240.408 341.206 239.084 337.953 237.759C338.073 237.277 338.314 236.796 338.435 236.193C336.145 236.555 333.856 237.036 329.88 237.639C333.856 231.497 337.109 226.559 341.206 220.297C335.302 222.585 330.965 224.391 326.868 225.957C326.146 227.643 325.543 229.57 324.459 231.256C323.254 233.062 321.567 234.507 320.001 236.073C321.688 237.277 323.495 238.482 325.182 239.565C325.664 239.927 326.266 240.047 328.435 240.77C324.097 243.299 320.603 245.346 316.146 247.875C316.507 245.828 316.748 244.985 317.109 242.937C311.447 245.346 306.387 247.514 300.965 249.922C302.411 252.692 303.254 254.378 304.58 256.907C294.339 258.593 290.845 265.578 288.917 273.888C287.833 275.694 286.989 277.742 285.785 279.428C284.7 280.873 283.375 282.197 282.05 283.402C278.797 286.412 274.821 289.062 272.17 292.554C270.966 294.12 272.17 297.612 272.17 300.141C272.17 300.503 272.893 300.744 272.893 301.105C272.893 307.006 272.291 313.268 280.483 316.158C279.881 316.64 279.158 317.242 278.556 317.724C277.23 317.122 275.905 316.761 274.7 316.038C273.616 315.436 272.652 314.713 271.929 313.75C269.761 311.221 267.592 308.692 265.664 305.922C264.46 304.356 263.978 300.984 262.773 300.864C259.158 300.382 255.424 300.864 251.809 301.225C250.002 301.466 247.713 303.273 246.749 302.55C239.761 297.974 234.219 301.346 228.075 305.44C228.075 310.98 227.954 316.761 228.075 322.541C228.075 325.07 228.315 327.961 229.52 330.008C230.605 331.694 233.255 333.139 235.303 333.259C236.508 333.259 238.074 330.73 239.159 329.044C239.882 327.961 240.123 326.395 240.604 324.829H252.893C251.93 329.647 250.966 334.223 249.881 339.522C251.327 339.883 253.134 340.485 254.942 340.726C262.532 341.93 263.616 343.496 262.532 351.203C262.17 353.612 261.929 356.021 261.809 358.429C261.809 359.633 262.05 360.717 262.291 361.801C266.387 364.21 272.05 351.083 274.941 363.246C274.459 363.848 273.857 364.451 273.375 365.053C271.206 366.859 268.917 368.666 265.544 371.556C260.484 366.859 255.062 361.681 249.641 356.623C248.556 355.539 247.351 354.214 246.026 353.853C241.327 352.649 236.749 351.806 235.183 346.145C234.942 345.543 233.255 345.182 232.171 344.941C224.942 343.014 217.231 342.051 210.605 338.799C207.472 337.354 205.063 331.694 204.822 327.84C204.46 321.578 201.93 317.363 197.473 313.509C196.027 312.305 195.183 310.498 193.256 308.09C194.099 312.184 194.822 315.075 195.545 318.567C190.967 318.567 188.798 317.001 186.629 313.629C181.69 306.042 179.16 297.853 176.629 289.423C176.148 287.978 175.184 286.292 173.979 285.449C167.834 281.234 166.027 275.333 166.63 268.348C167.352 259.316 168.316 250.284 169.039 241.251C169.28 238 169.16 234.748 168.798 231.497C167.714 223.428 166.389 215.359 165.304 207.772C164.943 208.856 164.22 210.422 163.618 212.108C163.136 212.348 162.533 212.589 162.051 212.83C163.377 198.138 148.558 197.897 142.654 189.587C141.57 188.142 136.028 189.949 133.016 190.31C132.534 195.368 133.618 201.269 131.329 202.955C126.871 206.447 120.606 207.772 115.064 210.06C114.823 209.579 114.582 208.976 114.341 208.495L118.196 200.908C117.594 200.426 117.112 199.944 116.51 199.583C109.401 206.688 103.016 214.516 95.0643 220.417C89.1607 224.873 81.9319 228.366 73.8597 227.402C73.4983 226.92 73.1368 226.318 72.7754 225.837C76.6308 222.946 80.6066 220.176 84.3415 217.166C90.0041 212.348 95.4257 207.17 101.329 201.992C95.6667 198.499 95.5462 198.499 90.3655 203.075C88.1969 200.306 86.0282 197.536 83.9801 194.766C83.7391 195.007 83.3777 195.368 83.1367 195.609C82.5343 193.441 82.4138 190.912 81.209 189.106C77.4741 183.445 78.438 178.267 84.7029 175.738C88.9198 174.052 93.6185 173.45 97.9558 172.005C100.124 171.282 102.052 170.078 103.859 167.91H91.4498C87.8354 163.815 84.9439 160.684 81.5705 156.951C88.5583 155.265 95.1847 150.207 104.341 152.736C105.064 152.134 106.751 150.689 108.317 149.364C105.426 147.798 102.414 146.594 99.763 144.788C98.6787 144.065 97.8353 141.897 98.0763 140.693C98.3172 139.73 100.365 138.887 101.691 138.525C107.956 136.96 114.1 135.635 120.365 134.19C121.329 133.949 122.413 133.467 123.257 133.588C134.823 135.876 146.268 138.284 157.834 140.573C161.449 141.295 165.184 141.777 168.678 141.416C175.184 140.813 181.569 139.489 188.798 138.405C188.918 138.766 189.521 140.332 190.244 142.74C192.653 141.175 194.822 139.85 197.111 138.405C196.991 138.887 196.87 139.248 196.629 139.73C206.629 142.74 216.749 145.751 226.749 149.003C228.797 149.605 230.605 151.05 232.412 152.134C234.701 147.678 230.966 143.945 224.46 143.463C220.002 143.102 215.665 140.693 211.328 139.127C211.93 137.562 212.533 135.996 213.255 134.069C208.798 131.179 202.894 131.42 196.629 134.19C195.545 130.938 193.376 128.048 194.099 125.88C195.424 121.665 198.075 117.691 200.725 114.078C202.292 111.79 214.099 113.837 218.436 116.487C220.123 115.282 221.81 114.319 223.135 113.115C224.34 111.91 225.303 110.465 226.508 108.9C230.123 109.381 234.099 109.863 236.508 110.104C238.918 107.093 240.604 104.926 242.291 102.758C243.376 104.805 244.58 106.852 246.147 109.743C250.363 108.057 255.424 106.13 261.93 103.601V113.837C258.797 113.596 255.544 113.476 252.412 113.235C251.327 113.235 250.243 112.392 249.279 112.753C241.809 115.162 234.339 117.811 226.629 120.461C228.918 121.545 231.448 122.629 234.58 124.194C241.207 116.728 250.363 117.932 259.761 118.534C260.363 121.665 260.966 124.435 261.568 127.566C257.11 130.577 252.653 133.588 248.074 136.719V142.981C244.58 142.62 241.327 142.259 237.713 141.897C242.291 147.919 243.135 148.039 256.749 143.824C257.472 145.51 258.315 147.196 259.038 148.882C259.64 148.882 260.122 148.882 260.725 148.882C260.725 145.269 260.725 141.777 260.725 138.164C260.725 135.996 261.086 133.829 261.207 131.781C263.014 132.022 265.062 131.781 266.628 132.504C268.435 133.467 270.002 135.153 271.447 136.598C272.773 137.923 273.857 139.489 275.544 140.813C273.255 133.347 275.423 127.085 280.483 121.906C281.809 120.581 284.58 120.581 286.628 119.859H286.387L286.869 119.738Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M273.256 365.179C273.738 364.577 274.341 363.974 274.823 363.372C279.642 359.037 284.461 354.701 289.521 350.125C291.328 351.691 292.895 352.895 294.702 354.46C295.907 353.497 297.112 352.413 298.557 351.209C300.124 352.895 301.328 354.581 302.895 355.665C305.304 357.351 307.593 358.555 311.087 359.157C317.232 360.241 324.822 361.807 327.955 369.514C329.4 373.247 331.569 375.776 336.629 374.933C342.292 374.09 347.111 379.269 347.713 385.893C347.834 387.819 347.713 389.867 347.713 393.118C355.665 395.166 363.978 397.092 372.171 399.381C374.821 400.103 377.11 402.03 379.641 403.114C381.207 403.836 383.014 403.836 384.46 404.559C385.906 405.282 387.833 406.365 388.436 407.69C391.689 416.12 388.074 423.707 384.339 431.053C382.894 433.944 380.002 436.232 378.315 439.122C376.99 441.29 376.267 443.819 375.785 446.348C374.942 451.406 374.46 456.464 373.858 461.643C373.376 465.858 371.207 468.025 366.87 469.23C360.243 471.036 357.352 475.492 356.99 482.356C356.99 483.199 357.231 484.163 356.87 484.765C354.099 489.221 350.605 493.315 348.436 498.012C345.665 503.793 341.328 505.358 335.665 504.395C335.424 505.358 335.063 505.72 335.183 506.081C337.954 516.558 337.232 516.679 326.75 521.014C323.376 522.459 321.328 527.879 319.4 531.853C318.316 534.02 319.159 537.031 318.437 539.44C317.232 543.173 313.738 546.545 318.437 550.399C319.039 550.881 318.437 554.253 317.473 555.216C307.352 564.61 310.123 570.511 320.605 577.977C314.702 582.433 304.461 579.784 300.846 573.642C293.859 561.96 293.015 548.954 292.172 535.827C292.051 533.057 291.569 530.287 291.328 527.276C293.015 525.229 294.822 522.7 297.714 519.087H290.003C291.569 510.778 293.136 502.829 294.702 494.881C295.184 492.593 296.148 490.425 296.148 488.137C296.148 479.948 296.509 471.638 295.907 463.449C295.425 457.066 293.618 451.286 287.714 447.191C283.136 444.06 277.473 440.688 278.919 433.221C279.039 432.499 277.112 431.535 276.148 430.572C274.22 428.645 271.811 426.959 270.485 424.55C268.437 420.576 267.714 416.482 274.702 414.916C272.052 413.23 270.003 412.026 268.799 411.183C262.895 394.804 274.943 380.834 273.377 365.299L273.256 365.179Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M383.5 79.1561C383.138 68.5583 383.138 68.6788 392.897 68.197C403.62 67.7153 414.222 66.511 424.945 66.6315C431.812 66.6315 438.68 68.7992 445.547 69.8831C445.547 70.8465 445.668 71.6895 445.788 72.6529C442.053 74.5798 438.439 76.5067 434.704 78.554C434.945 79.0357 435.186 79.5174 435.306 79.9991C436.752 79.6378 438.198 79.397 439.523 78.9152C443.86 77.3497 447.957 76.1454 451.451 80.6013C452.053 81.3238 453.258 81.4443 453.981 82.0464C455.306 83.0098 456.511 84.2141 457.836 85.298C456.39 85.9001 454.945 86.7431 453.378 87.2249C449.643 88.3087 445.788 89.2722 441.812 90.356C442.535 93.3668 443.017 95.1732 443.378 96.6183C441.571 97.8226 440.005 98.7861 438.318 99.9904C441.089 102.038 443.258 103.603 446.511 106.132C442.053 106.975 439.162 107.577 435.909 108.3C436.391 111.311 437.234 114.081 437.234 116.85C437.234 119.379 437.354 123.113 435.909 124.197C432.535 126.726 432.174 129.375 433.62 133.47C431.692 132.988 430.367 132.627 428.439 132.145C429.764 134.072 430.848 135.517 431.933 136.962C431.692 137.564 431.451 138.287 431.21 138.889C426.27 137.323 421.21 135.758 416.27 134.192C416.029 134.915 415.788 135.517 415.668 136.24C418.559 137.444 421.451 138.648 425.306 140.214C422.415 142.863 419.644 145.994 416.391 148.162C410.969 151.895 405.307 155.267 399.524 158.399C397.355 159.603 394.584 160.085 392.174 159.964C386.994 159.603 386.271 163.216 384.945 166.708C382.174 173.693 379.283 180.678 376.994 186.218C371.813 184.773 367.958 184.05 364.464 182.725C362.898 182.123 360.97 180.558 360.608 179.112C359.645 175.861 359.886 172.368 359.163 169.117C358.199 164.3 356.874 159.723 355.307 153.1C357.115 151.052 360.367 147.439 363.982 143.345C361.09 141.659 357.837 139.732 353.139 136.962C356.151 136.36 357.837 136.36 358.922 135.637C359.886 135.035 360.488 133.711 360.127 131.904C358.199 132.747 356.151 133.59 354.103 134.554C353.38 128.05 352.657 122.27 352.054 116.73C347.597 115.164 343.5 113.719 339.404 112.395C338.561 112.154 337.476 112.395 336.633 112.635C330.97 114.562 327.115 112.756 324.344 106.253C329.043 105.771 333.5 105.41 337.958 105.048C337.958 104.567 337.958 104.205 337.958 103.724C332.055 103.483 326.272 103.122 320.368 102.881C320.127 102.038 319.886 101.195 319.766 100.352C326.392 98.0635 333.139 95.7753 340.97 93.0055C338.32 91.3195 336.874 90.4765 335.428 89.513C350.729 81.3238 366.03 74.5798 383.741 79.2765L383.5 79.1561ZM416.15 76.5067C425.708 78.6744 431.13 78.3532 432.415 75.5432C426.873 75.9045 421.451 76.2658 416.15 76.5067Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M823.853 427.917C831.804 430.446 839.876 426.713 846.744 431.891C842.647 435.665 844.535 439.88 852.406 444.536C858.189 439.117 853.009 431.289 856.382 425.268C863.25 424.424 859.997 430.807 861.804 433.457C863.972 436.588 865.418 440.08 867.105 443.452C868.792 446.945 870.84 450.437 871.924 454.05C873.008 457.663 873.008 461.517 873.611 465.852C878.069 463.925 879.273 466.093 880.117 470.067C881.804 477.895 884.093 485.723 879.996 493.43C877.105 498.85 873.972 504.269 870.599 509.448C863.852 519.925 858.069 521.972 846.141 519.202C838.19 517.396 837.828 516.914 838.19 508.484C832.768 508.243 829.395 505.353 826.744 500.295C824.334 495.598 814.094 495.719 806.865 499.091C800.479 502.101 793.853 504.51 787.347 506.798C783.733 508.123 779.154 504.39 779.998 500.897C782.287 491.383 778.19 482.471 777.347 473.198C776.986 468.863 777.106 466.575 781.564 466.213C786.504 465.732 788.431 462.721 789.154 458.386C789.877 454.411 791.202 451.16 796.624 454.411C795.66 447.427 799.997 446.222 804.696 446.824C808.551 447.306 810.118 445.981 810.118 442.609C810.118 437.551 813.25 435.624 817.467 434.781C821.081 434.059 825.057 433.818 823.732 427.676L823.853 427.917Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M287.109 119.861C283.133 118.295 279.157 116.97 275.181 115.164C273.976 114.682 273.253 113.237 272.289 112.274C272.53 111.671 272.892 111.19 273.133 110.588C276.024 111.19 279.036 111.792 281.928 112.394C284.94 112.996 287.952 113.598 291.084 114.08C291.325 113.357 291.446 112.635 291.687 111.912C289.518 111.19 287.35 110.106 285.06 109.745C282.771 109.383 280.362 109.745 277.711 109.745C278.675 103.844 281.566 101.796 287.229 102.88C286.265 102.037 285.301 101.194 283.735 99.8694C286.386 97.8221 289.157 95.6544 292.53 93.1254C286.024 91.9211 283.735 96.377 281.205 100.592C276.988 100.592 273.735 99.6286 274.458 94.2092C274.458 93.4867 274.217 92.4028 273.735 92.0415C267.229 86.7426 276.024 84.9362 276.145 81.2029C278.675 82.2867 281.205 83.2502 283.494 84.6953C284.94 85.5383 286.145 86.9835 288.313 87.4652C287.831 86.6222 287.47 85.6588 286.747 84.9362C281.446 79.6373 281.807 76.6266 289.398 75.7836C303.012 74.3384 316.867 74.0976 330.602 73.6158C336.867 73.375 343.132 73.6158 350.12 73.6158C348.313 82.5276 341.084 79.0352 336.626 81.6846V86.3813C330 89.7534 323.373 92.4028 317.711 96.377C314.458 98.6651 312.771 103.241 310.241 106.613C308.072 109.504 305.783 112.394 303.614 115.164C299.157 120.704 292.651 119.379 286.747 119.981H286.988L287.109 119.861Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M826.98 399.858C829.028 397.329 830.233 396.004 831.438 394.439C829.269 393.596 827.1 392.873 824.932 392.151C827.944 386.37 830.715 385.768 837.462 389.14C836.859 390.103 836.257 391.067 835.534 391.91C834.932 392.512 834.088 392.994 833.365 393.475C833.365 394.198 833.486 394.8 833.606 395.523C835.775 395.523 838.425 396.366 839.992 395.402C845.895 391.91 849.63 392.03 855.654 396.245C859.148 398.774 862.883 400.942 867.461 403.832C871.076 408.89 875.533 414.912 879.991 421.054C879.509 421.656 879.027 422.378 878.545 422.981C876.618 421.897 874.329 421.295 872.883 419.729C870.112 416.598 867.943 415.393 864.811 419.488C863.967 420.451 860.714 420.09 858.787 419.488C856.136 418.765 853.606 417.2 850.233 415.634C848.425 407.686 836.859 398.413 827.1 399.738L826.98 399.858Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M540.839 108.539C536.14 106.371 532.405 104.685 528.309 102.878C527.827 104.564 527.104 106.973 526.502 109.382C526.14 110.586 525.899 111.67 525.538 112.874C521.562 111.67 517.345 110.706 513.61 109.02C512.767 108.659 512.767 105.287 513.369 103.721C514.092 101.794 515.899 100.349 516.622 97.459C513.61 99.0246 510.598 100.711 508.911 101.554C506.381 97.8203 504.092 95.0504 502.526 91.9193C501.803 90.3537 501.803 87.8247 502.647 86.3795C503.49 85.0548 506.02 83.8505 507.466 84.2118C509.996 84.8139 512.285 86.6204 514.092 87.4634C515.417 86.0182 516.863 84.5731 518.309 83.1279C519.755 84.8139 521.2 86.4999 522.767 88.0655C523.971 89.2698 525.297 90.8354 526.743 91.1967C536.02 93.8461 541.08 99.0246 540.839 108.418V108.539Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M790.968 371.313C798.076 372.036 798.558 373.963 797.112 382.152C795.907 389.137 795.425 396.242 792.293 402.746C791.449 404.552 788.799 407.563 788.196 407.322C783.98 405.395 778.558 403.709 776.389 400.216C769.522 388.535 770.124 388.414 781.57 380.827C784.823 378.66 787.233 375.167 790.847 371.313H790.968Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M614.457 428.281C614.698 433.941 615.662 439.721 614.818 445.261C613.493 454.052 610.722 462.603 609.156 471.274C608.071 477.295 603.252 476.573 599.517 476.814C598.313 476.814 596.023 472.478 595.903 470.19C595.782 465.975 596.987 461.76 597.469 457.545C597.71 456.22 598.192 454.534 597.71 453.45C595.662 448.994 597.59 445.622 600.963 443.575C605.903 440.564 608.312 436.108 610.12 431.05C610.481 429.967 611.324 429.124 611.927 428.16C612.77 428.16 613.614 428.16 614.457 428.281Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M484.936 222.836C479.032 223.317 473.129 223.679 467.346 224.16C467.346 223.799 467.105 223.438 466.984 223.197C468.43 222.233 469.996 221.39 471.924 220.066C467.105 214.044 471.683 210.552 476.141 207.18C469.876 203.085 468.551 198.268 471.804 189.718C472.647 187.429 476.743 186.466 479.273 184.9C479.635 185.503 480.117 185.984 480.478 186.586C479.755 188.032 478.912 189.597 478.43 190.681C481.683 197.786 484.815 204.892 488.068 212.238C487.225 215.249 486.02 219.223 484.936 223.076L485.056 222.956L484.936 222.836Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M844.934 252.698C845.778 259.201 846.501 265.824 847.464 272.328C847.946 275.94 847.103 278.59 843.489 280.035C838.79 281.841 833.971 283.407 829.513 285.695C826.862 287.02 824.814 289.549 821.561 292.319C820.718 290.874 818.549 288.826 818.79 287.02C819.272 283.768 819.272 280.035 823.73 278.349C829.031 276.302 833.971 273.291 838.79 270.28C840.115 269.437 841.199 267.029 841.199 265.343C841.32 261.248 840.838 257.033 840.477 252.818C841.922 252.818 843.489 252.698 844.934 252.577V252.698Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M639.394 108.061C637.105 109.867 634.936 112.035 632.527 113.359C628.43 115.648 624.093 117.334 619.876 119.26C619.153 119.622 618.551 120.224 617.828 120.585C611.965 124.037 610.961 128.774 614.816 134.796C615.298 135.518 615.539 136.241 615.9 136.843C611.683 140.938 608.912 140.215 601.684 132.749C604.696 126.848 607.105 120.465 610.961 115.166C612.888 112.516 617.467 111.433 620.96 110.228C626.623 108.301 632.406 106.736 638.069 105.05C638.43 106.013 638.912 106.977 639.273 107.94L639.394 108.061Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M735.537 375.169C741.199 373.363 744.814 375.049 747.344 380.468C748.789 383.599 751.56 386.49 754.452 388.417C759.994 392.15 760.115 398.171 761.681 403.591C762.042 404.674 759.874 406.36 758.91 407.806C755.536 404.915 750.115 402.507 749.151 399.014C747.705 393.836 745.536 389.982 741.681 386.61C738.187 383.599 734.452 380.709 735.537 375.29V375.169Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M431.928 152.622C437.229 153.586 442.41 154.67 449.036 155.874C448.193 154.91 448.675 155.151 448.675 155.513C449.518 159.246 453.856 163.22 449.518 166.833C447.47 168.519 443.615 168.037 440.482 168.519C437.35 169.001 434.338 169.844 432.41 165.99C431.928 164.906 429.76 164.786 427.952 164.063C428.555 162.497 429.157 161.173 429.88 159.487C428.916 159.246 427.711 158.885 426.266 158.523C428.434 155.753 430.241 153.465 432.049 151.057C432.049 151.538 431.928 152.141 431.808 152.622H431.928Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M925.174 523.294C930.234 526.546 930.234 529.797 923.849 534.855C920.235 537.745 916.741 541.117 914.331 545.092C910.958 550.511 906.259 546.296 902.524 547.982L901.078 546.778C903.729 543.406 905.897 539.672 908.909 536.782C913.849 532.085 919.391 528.111 925.174 523.414V523.294Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M301.694 335.792C286.513 337.839 284.826 337.237 285.911 332.541C281.212 330.012 277.116 327.242 272.537 325.796C268.682 324.472 264.345 324.713 259.525 324.11C260.128 323.267 261.212 320.498 262.537 320.257C271.092 319.293 279.525 319.173 286.272 326.158C287.838 327.723 290.368 328.687 292.657 329.169C296.633 330.012 300.609 330.493 301.694 335.913V335.792Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M526.266 80.6006C536.145 81.4436 545.904 82.1662 556.265 83.0092C554.578 89.1511 550.844 90.7166 545.904 90.7166C535.181 90.7166 527.229 86.8629 526.266 80.6006Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M810.238 406.246C808.31 405.042 806.383 403.717 803.973 402.272C803.371 404.199 802.768 406.006 802.286 407.812C795.419 403.477 795.78 395.167 803.491 386.496C806.624 388.182 809.997 389.868 813.25 391.554C813.13 392.156 813.009 392.638 812.768 393.24C811.202 393.842 809.756 394.444 807.829 395.167C809.033 398.419 810.359 401.67 811.684 405.042C811.202 405.403 810.72 405.765 810.238 406.126V406.246Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M930.838 519.927C929.393 519.324 928.308 518.843 927.465 518.602C929.393 512.942 931.2 507.522 933.368 501.501C934.332 503.307 935.296 505.114 936.139 506.92C939.031 507.161 942.043 507.402 945.296 507.643C940.236 514.748 935.898 520.89 931.561 527.032C930.959 526.671 930.356 526.309 929.874 526.069C930.236 524.021 930.597 522.094 930.838 520.047V519.927Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M789.152 421.296C780.116 419.249 771.2 417.202 762.164 415.275C762.526 408.531 763.369 408.17 769.152 409.735C773.489 410.94 778.067 412.505 782.525 412.746C787.344 412.987 788.549 416.118 790.116 419.249C789.875 419.972 789.513 420.694 789.272 421.296H789.152Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M684.213 94.81C682.044 88.7885 684.936 86.7412 689.996 86.7412C693.128 86.7412 696.381 87.1025 699.273 88.1864C700.96 88.7885 702.044 90.9562 703.369 92.5218C701.442 93.6057 699.514 95.5325 697.586 95.653C693.249 95.8938 688.912 95.1713 684.092 94.9304L684.213 94.81Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M844.937 252.689C843.491 252.689 841.925 252.809 840.479 252.93C839.516 251.846 837.588 250.642 837.588 249.558C837.588 246.427 838.431 243.295 839.034 239.321C843.732 240.887 848.07 242.212 853.612 244.018C848.793 245.824 851.925 253.532 844.937 252.689Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M808.189 356.269C810.117 354.824 812.045 353.379 814.575 351.452C814.695 350.489 815.057 348.321 815.659 343.985C819.997 348.923 823.37 352.777 826.864 356.751C822.527 358.798 818.912 360.484 814.575 362.411C814.334 361.207 814.093 359.641 813.732 357.714H808.912C808.671 357.233 808.43 356.63 808.189 356.149V356.269Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M792.289 107.699C798.434 108.662 805.06 102.159 809.879 111.673C807.711 112.998 804.578 116.49 802.409 116.009C798.554 115.166 792.048 115.888 792.41 107.699H792.289Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M467.716 203.674V214.272C464.825 214.874 461.813 215.476 458.921 216.078C456.27 206.685 458.439 203.674 467.716 203.674Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M846.615 524.387C850.471 524.628 854.326 524.989 858.543 525.35C859.386 529.926 858.784 534.262 853.965 534.864C847.7 535.707 848.543 529.204 845.893 526.073C846.134 525.591 846.374 524.989 846.615 524.507V524.387Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M805.778 343.498C802.525 340.126 796.862 338.199 800.477 332.9C801.681 331.214 807.826 330.371 809.031 331.695C813.368 336.151 808.067 339.162 805.778 343.498Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M290.971 172.008C288.803 171.526 286.513 170.924 283.983 170.322C281.333 175.259 278.321 173.814 274.586 169.84C277.718 167.432 280.489 163.337 283.501 163.337C286.393 163.337 289.285 167.311 292.176 169.479C291.815 170.322 291.453 171.165 290.971 172.008Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M798.064 324.474C798.305 319.777 791.558 317.369 797.221 313.274C798.426 312.431 801.679 312.311 801.92 312.792C803.606 316.767 803.004 320.38 798.185 324.474H798.064Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M621.32 88.5489C617.344 88.9102 614.091 89.1511 610.959 89.3919C611.682 87.7059 611.923 85.5382 613.128 84.5747C616.14 82.407 619.031 82.7683 621.32 88.5489Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M697.83 360.966C700.119 364.338 704.577 366.144 700.721 370.239C699.757 371.202 698.191 371.443 696.866 372.045C696.504 370.721 695.782 369.275 695.902 367.951C696.143 365.903 696.986 363.977 697.83 360.966Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M288.914 317.366C291.926 319.533 294.335 321.219 296.745 323.026C297.106 323.387 297.106 324.591 296.745 325.073C296.384 325.555 295.058 326.157 294.817 325.916C292.528 323.507 286.504 323.989 288.793 317.245L288.914 317.366Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M281.69 337.359C279.28 337.841 276.75 338.202 272.533 339.045C273.979 336.396 274.461 334.107 275.304 333.987C277.473 333.867 279.642 334.589 281.81 334.95V337.359H281.69Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M828.126 398.84C830.166 396.341 831.366 395.033 832.566 393.486C830.406 392.653 828.246 391.939 826.086 391.225C829.086 385.514 831.846 384.919 838.566 388.251C837.966 389.203 837.366 390.154 836.646 390.987C836.046 391.582 835.206 392.058 834.486 392.534C834.486 393.248 834.606 393.843 834.726 394.557C836.886 394.557 839.526 395.39 841.086 394.438C846.966 390.987 850.686 391.106 856.686 395.271C860.166 397.769 863.886 399.911 868.446 402.766C872.046 407.763 876.486 413.712 880.926 419.78C880.446 420.375 879.966 421.089 879.486 421.684C877.566 420.613 875.286 420.018 873.846 418.471C871.086 415.378 868.926 414.188 865.806 418.233C864.966 419.185 861.726 418.828 859.806 418.233C857.166 417.52 854.646 415.973 851.286 414.426C849.486 406.574 837.966 397.412 828.246 398.721L828.126 398.84Z" fill="currentColor"/>
<path d="M792.255 370.641C799.335 371.354 799.815 373.258 798.375 381.349C797.175 388.249 796.695 395.269 793.575 401.694C792.735 403.479 790.095 406.453 789.495 406.215C785.295 404.312 779.895 402.646 777.735 399.196C770.895 387.655 771.495 387.536 782.895 380.04C786.135 377.898 788.535 374.448 792.135 370.641H792.255Z" fill="currentColor"/>
<path d="M846.015 253.454C846.855 259.879 847.575 266.423 848.535 272.847C849.015 276.417 848.175 279.034 844.575 280.462C839.895 282.247 835.096 283.794 830.656 286.054C828.016 287.363 825.976 289.861 822.736 292.598C821.896 291.17 819.736 289.148 819.976 287.363C820.456 284.15 820.455 280.462 824.895 278.796C830.175 276.774 835.095 273.799 839.895 270.825C841.215 269.992 842.295 267.612 842.295 265.947C842.415 261.901 841.935 257.737 841.575 253.573C843.015 253.573 844.576 253.454 846.015 253.335V253.454Z" fill="currentColor"/>
<path d="M737.048 374.451C742.688 372.666 746.288 374.332 748.808 379.686C750.248 382.779 753.007 385.635 755.887 387.539C761.407 391.227 761.527 397.176 763.087 402.53C763.447 403.601 761.287 405.266 760.327 406.694C756.967 403.839 751.568 401.459 750.608 398.009C749.168 392.893 747.008 389.085 743.168 385.754C739.688 382.779 735.968 379.924 737.048 374.57V374.451Z" fill="currentColor"/>
<path d="M811.449 405.148C809.529 403.958 807.609 402.65 805.209 401.222C804.609 403.126 804.009 404.91 803.529 406.695C796.689 402.412 797.049 394.202 804.729 385.636C807.849 387.301 811.209 388.967 814.449 390.633C814.329 391.228 814.209 391.704 813.969 392.299C812.409 392.893 810.969 393.488 809.049 394.202C810.249 397.415 811.569 400.627 812.889 403.958C812.409 404.315 811.929 404.672 811.449 405.029V405.148Z" fill="currentColor"/>
<path d="M790.446 420.023C781.446 418 772.566 415.978 763.566 414.074C763.926 407.411 764.766 407.054 770.526 408.601C774.846 409.791 779.406 411.338 783.846 411.575C788.646 411.813 789.846 414.907 791.406 418C791.166 418.714 790.806 419.428 790.566 420.023H790.446Z" fill="currentColor"/>
<path d="M846.006 253.44C844.566 253.44 843.006 253.559 841.566 253.678C840.606 252.607 838.686 251.417 838.686 250.347C838.686 247.253 839.526 244.16 840.126 240.233C844.806 241.78 849.126 243.089 854.646 244.874C849.846 246.658 852.966 254.273 846.006 253.44Z" fill="currentColor"/>
<path d="M809.408 355.775C811.328 354.348 813.248 352.92 815.768 351.016C815.888 350.064 816.248 347.923 816.848 343.64C821.168 348.518 824.528 352.325 828.008 356.251C823.688 358.274 820.088 359.94 815.768 361.843C815.528 360.654 815.288 359.107 814.928 357.203H810.128C809.888 356.727 809.648 356.132 809.408 355.656V355.775Z" fill="currentColor"/>
<path d="M793.578 110.199C799.698 111.151 806.298 104.726 811.098 114.126C808.938 115.434 805.818 118.885 803.658 118.409C799.818 117.576 793.338 118.29 793.698 110.199H793.578Z" fill="currentColor"/>
<path d="M807.006 343.157C803.766 339.826 798.126 337.922 801.726 332.687C802.926 331.021 809.046 330.188 810.246 331.497C814.566 335.899 809.286 338.874 807.006 343.157Z" fill="currentColor"/>
<path d="M799.329 324.365C799.569 319.725 792.849 317.345 798.489 313.3C799.689 312.467 802.929 312.348 803.169 312.824C804.849 316.751 804.249 320.32 799.449 324.365H799.329Z" fill="currentColor"/>
<mask id="mask0_505_543" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="428" y="82" width="500" height="422">
<path d="M486.313 222.627C488.593 220.486 492.193 218.82 492.913 216.202C494.833 209.421 500.353 208.826 504.313 207.993C505.273 203.591 505.993 200.14 506.833 195.976C506.593 195.976 505.513 195.262 504.193 195.262C500.713 195.024 499.033 193.477 499.513 189.908C500.113 184.554 495.433 178.962 499.633 173.965C502.993 170.039 507.193 166.826 510.793 163.019C512.833 160.877 514.993 158.617 515.833 155.999C518.593 147.909 526.033 144.696 531.913 139.818C534.073 138.033 537.193 137.319 539.593 135.654C545.593 131.37 552.673 132.56 558.073 137.438C562.033 140.889 567.313 143.149 572.353 145.053C577.753 147.076 582.553 148.86 582.433 155.88C589.033 154.928 587.233 149.455 588.673 145.648H594.553C594.793 147.79 595.153 149.693 595.513 153.025C603.793 144.458 613.753 143.387 624.312 144.101C624.552 143.506 624.672 142.911 624.912 142.317C622.872 141.722 620.833 141.008 618.673 140.413C619.393 139.461 619.992 138.509 620.712 137.557C622.872 137.914 625.272 137.795 627.312 138.628C632.112 140.532 635.832 139.699 638.832 135.535C639.792 134.226 640.992 133.155 642.072 131.965C646.152 127.286 650.112 127.286 653.952 131.965C655.392 130.776 656.712 129.467 658.632 127.92C659.352 130.419 659.952 132.322 660.552 134.226C661.032 134.226 661.392 134.345 661.872 134.464C662.352 132.679 662.712 130.776 663.192 128.634C664.752 128.634 666.432 128.396 668.232 128.277C668.472 126.73 668.832 125.303 669.072 123.875C669.432 124.351 669.792 124.946 670.152 125.422C679.032 118.521 688.632 113.048 700.872 110.668C700.992 110.668 702.312 111.977 704.592 114C707.232 110.549 709.272 107.099 712.032 104.243C713.232 103.054 717.192 102.34 717.672 102.935C720.912 107.456 725.472 106.98 729.552 106.028C734.952 104.6 737.592 108.17 739.632 111.382C740.832 113.286 739.872 116.498 739.872 120.186C748.032 121.614 758.232 121.376 766.272 125.303C778.392 131.251 790.272 126.373 802.152 128.277C803.352 123.518 805.752 122.209 810.792 123.28C821.472 125.541 830.112 132.203 840.432 135.773C843.432 131.727 847.992 130.776 850.512 135.059C855.432 143.387 862.512 139.699 868.992 139.818C869.592 139.818 870.072 139.342 870.672 139.223C871.032 139.223 871.392 139.223 871.992 139.223C873.192 140.77 874.512 142.317 876.912 145.172C876.552 141.722 876.432 139.818 876.072 136.011C883.272 138.033 889.512 139.818 895.752 141.603C898.152 142.317 900.672 142.792 902.832 143.863C908.352 146.6 913.752 149.574 919.152 152.43C919.752 152.787 920.112 153.501 920.712 153.738C926.392 155.959 928.752 160.798 927.792 168.254C925.152 166.945 922.632 166.231 920.832 164.685C915.552 160.52 914.832 160.52 910.512 166.469C912.312 168.611 914.112 170.871 916.392 173.608C912.672 174.798 909.672 175.869 906.432 176.582C902.592 177.534 898.512 177.772 897.552 182.888C897.432 183.602 894.552 183.959 892.992 184.197C889.872 184.554 886.392 183.959 883.632 185.03C878.952 187.053 879.432 192.645 884.592 196.571C880.992 204.067 877.272 211.681 873.552 219.296C872.832 219.296 872.112 219.058 871.272 219.058C870.192 217.154 869.112 215.251 868.152 213.228C866.952 210.61 865.512 207.993 864.792 205.256C864.072 202.758 863.232 199.783 864.072 197.523C866.472 191.098 869.592 185.03 872.352 178.843C871.872 178.367 871.392 177.891 870.912 177.534C870.072 179.081 869.112 180.628 868.512 181.699C866.352 180.985 863.232 179.795 863.112 180.152C861.552 183.126 860.472 186.339 859.152 189.432C859.512 190.146 859.752 190.86 860.112 191.574C853.152 190.503 846.072 189.551 839.112 188.242C830.352 186.458 827.232 188.242 824.592 196.571C823.992 198.475 822.072 200.021 821.112 201.925C820.512 202.996 820.032 205.137 820.512 205.494C821.592 206.327 823.272 206.565 824.712 206.565C827.232 206.327 829.752 205.732 832.272 205.375C832.392 205.851 832.512 206.327 832.632 206.922C833.472 205.732 834.312 204.542 836.232 201.687C837.312 205.494 837.672 207.755 838.512 209.896C840.072 213.585 841.872 217.154 843.552 220.843C844.752 223.222 846.432 225.483 847.152 227.981C847.392 228.695 845.112 230.123 843.312 232.146C843.312 232.502 843.432 234.406 843.672 236.786C838.512 234.525 838.152 230.48 837.672 226.316C837.192 222.627 836.112 219.058 835.272 215.489C834.672 215.489 834.192 215.726 833.592 215.845C833.592 216.797 833.352 217.749 833.592 218.463C837.672 230.123 830.832 238.927 825.792 248.208C825.312 249.16 823.992 249.754 823.032 250.23C815.352 254.276 814.632 255.703 815.472 264.746C815.952 269.981 817.752 275.335 812.112 281.403C808.032 274.859 804.192 268.91 800.352 262.842C798.192 267.601 796.152 271.409 794.952 275.335C794.352 277.12 794.592 280.094 795.672 281.165C802.392 287.59 801.552 300.677 795.192 308.768C792.552 312.099 790.872 316.264 788.712 320.071C786.792 323.521 784.392 325.901 779.712 325.425C777.672 325.187 775.392 326.615 771.432 327.805C778.032 330.541 776.472 333.397 774.552 336.966C773.232 339.464 773.112 342.915 772.992 345.889C772.512 355.884 769.152 361 764.232 362.07C758.472 358.025 754.032 354.813 749.712 351.719C746.472 356.121 747.432 361.119 752.472 365.997C757.632 370.875 759.552 377.3 760.872 384.081C752.352 378.846 744.192 373.492 742.272 362.665C742.032 361.594 741.792 359.929 742.392 359.215C745.272 355.646 743.472 353.385 741.192 350.529C739.632 348.507 739.512 345.294 738.432 341.606C737.352 341.606 735.432 341.249 733.512 341.13C729.912 340.892 728.952 339.583 728.832 335.538C728.712 331.374 725.352 327.329 723.192 322.688C720.312 323.997 717.192 324.473 715.392 326.258C710.712 331.017 707.232 337.323 702.072 341.249C695.592 346.246 697.752 353.623 695.352 359.572C693.312 364.45 691.392 366.354 687.672 365.283C682.992 355.17 678.672 345.77 674.352 336.49C673.632 334.943 673.152 333.159 672.672 331.493C672.312 330.303 672.432 328.637 671.712 328.161C665.472 324.235 663.912 314.955 654.072 314.479C649.032 314.241 644.352 312.694 640.152 316.858C638.472 314.36 637.152 312.456 635.952 310.553C635.472 310.791 634.992 311.028 634.512 311.147C635.472 313.408 636.072 316.026 637.632 317.929C642.072 323.164 641.472 329.232 635.712 333.278C626.952 339.345 618.073 345.056 608.233 349.34C601.753 352.195 599.833 351.957 597.913 344.818C595.513 336.252 590.353 329.708 584.953 323.164C582.913 318.524 580.873 313.765 578.713 309.125C578.233 315.074 577.513 321.142 584.353 323.759C584.713 331.731 588.553 338.037 593.473 343.986C595.993 346.96 598.033 350.292 601.393 355.051C604.753 354.337 609.673 353.623 614.353 352.076C617.953 350.886 620.352 351.838 620.232 355.289C620.232 359.096 619.393 363.26 617.593 366.592C614.233 372.897 610.033 378.727 606.193 384.676C605.353 385.985 604.633 387.77 603.313 388.365C597.313 391.577 594.433 396.693 593.233 402.88C592.273 407.401 591.673 412.041 591.433 416.563C591.193 420.846 591.673 425.248 591.673 429.65C591.553 435.718 590.473 440.834 585.073 445.712C580.873 449.52 579.793 456.778 577.393 462.489C576.793 463.916 576.793 466.653 576.193 466.772C569.353 468.081 570.793 474.029 568.993 478.194C567.793 481.049 564.433 483.072 563.233 486.046C558.793 497.23 547.633 498.301 538.633 502.465C534.313 504.488 531.193 502.703 530.113 498.182C527.953 489.259 523.273 481.168 522.913 471.531C522.673 465.939 518.233 460.466 515.953 454.755C514.993 452.375 513.553 449.401 514.273 447.378C518.593 434.41 515.473 421.798 512.833 409.186C512.593 408.234 512.353 407.163 511.753 406.449C505.153 399.43 506.353 391.339 508.513 383.13C508.993 381.345 508.513 379.322 508.513 376.824C500.593 379.322 493.633 379.441 487.753 372.422C487.753 372.422 486.913 372.303 486.793 372.541C481.873 380.988 472.993 378.252 465.913 378.608C461.593 378.846 456.553 374.682 452.833 371.351C449.953 368.733 449.113 363.974 446.473 361C441.433 355.408 441.913 348.983 441.193 342.201C439.993 330.541 443.713 320.071 447.193 309.482C447.913 307.459 450.073 305.793 451.993 304.366C456.433 301.272 459.193 297.346 458.953 291.992C458.473 283.901 464.953 280.57 469.633 276.049C470.233 275.454 472.273 275.216 472.873 275.811C476.833 279.023 479.713 276.287 482.833 274.502C493.513 273.312 504.193 272.003 514.993 270.814C514.033 281.879 516.673 284.972 524.713 287.709C528.553 289.017 532.273 291.159 536.593 293.182C538.033 285.686 543.433 286.4 549.073 287.233C556.513 288.423 563.953 289.612 572.233 290.921C573.433 285.924 574.873 280.451 576.193 274.978C575.593 274.859 575.113 274.74 574.513 274.502C572.953 276.525 571.513 278.547 569.953 280.57C569.473 280.213 568.993 279.975 568.393 279.618C568.393 278.071 568.273 276.525 568.273 276.406C562.513 275.692 557.593 274.978 552.553 274.264C551.473 269.743 550.393 265.222 549.313 260.344C544.393 263.437 547.633 267.839 547.633 271.409C547.633 272.479 550.633 273.55 552.313 274.502V279.023C548.833 277.239 546.193 274.978 543.313 274.621C539.473 274.145 538.873 272.36 538.993 269.148C539.233 264.984 538.273 261.295 533.593 259.63C533.233 258.202 533.353 256.179 532.513 255.346C529.033 252.015 525.313 249.16 521.713 246.066C521.233 246.542 520.753 247.018 520.273 247.494C522.193 249.516 524.113 251.777 526.153 253.562C528.553 255.703 531.193 257.607 533.713 259.63C533.833 259.749 533.953 259.868 534.073 260.106C534.073 260.225 534.073 260.462 534.073 260.7C532.753 260.7 531.433 260.7 531.553 260.7C529.153 264.508 527.113 267.72 524.713 271.647C523.033 270.338 521.233 268.91 519.793 267.839C521.953 266.055 523.393 264.865 524.833 263.675C523.153 261.89 521.833 259.63 519.793 258.202C517.633 256.655 514.993 255.822 512.473 254.752C511.153 257.964 515.473 263.318 507.913 265.579C507.433 259.511 506.953 254.157 506.473 248.803C504.673 249.16 502.153 250.468 500.113 249.873C495.553 248.684 493.153 250.587 491.593 254.157C488.593 260.938 485.833 267.839 482.953 274.621C476.353 273.669 469.753 272.717 462.073 271.528V249.041C467.713 248.684 472.753 248.089 477.793 248.208C482.353 248.327 483.433 244.757 482.353 242.616C480.793 239.641 479.473 235.239 474.433 235.12C473.233 235.12 472.033 233.811 470.833 232.978C471.793 231.908 472.633 230.48 473.833 229.766C477.913 227.029 482.233 224.65 486.433 222.032L486.313 222.151V222.627ZM543.433 160.877C542.833 160.52 542.233 160.282 541.633 159.925C538.513 163.733 535.153 167.302 532.513 171.466C530.713 174.322 528.553 178.724 529.513 181.223C532.513 188.718 528.313 194.191 525.793 200.259C525.073 201.925 522.673 204.067 521.353 203.948C519.433 203.71 517.393 201.806 516.193 200.021C514.633 197.88 513.913 195.262 512.713 192.883C512.233 193.002 511.753 193.239 511.273 193.358C512.473 197.404 513.673 201.33 515.233 206.684C518.833 205.851 523.033 203.71 526.753 204.304C535.513 205.613 536.713 200.973 537.433 194.31C537.673 192.05 540.073 190.146 541.393 188.004C542.113 188.004 542.953 188.123 543.673 188.242C542.713 186.101 542.353 183.126 540.793 182.174C532.633 177.177 532.153 174.56 538.753 167.54C540.553 165.517 541.873 163.019 543.433 160.758V160.877ZM566.713 154.69C567.553 159.806 567.073 164.447 574.273 165.279C570.913 157.546 580.513 161.472 581.113 155.761C576.553 155.404 571.993 155.047 566.713 154.69ZM630.793 311.147C628.633 307.816 626.952 304.842 624.912 301.986C623.112 299.488 622.873 294.015 617.353 297.465C620.473 302.7 623.352 307.697 626.232 312.575C627.912 312.099 629.473 311.623 630.793 311.147ZM769.992 337.323C770.952 336.728 771.912 336.014 772.992 335.419C770.952 332.445 768.912 329.589 766.752 326.615C765.912 327.21 765.072 327.805 764.112 328.399C766.032 331.374 767.952 334.467 769.992 337.442V337.323Z" fill="#C08C5C"/>
<path d="M542.112 109.6C537.432 107.458 533.712 105.792 529.632 104.008C529.152 105.673 528.432 108.053 527.832 110.432C527.472 111.622 527.232 112.693 526.872 113.883C522.912 112.693 518.712 111.741 514.992 110.076C514.152 109.719 514.152 106.387 514.752 104.84C515.472 102.937 517.272 101.509 517.992 98.6536C514.992 100.2 511.992 101.866 510.312 102.699C507.792 99.0105 505.512 96.274 503.952 93.1806C503.232 91.6338 503.232 89.1353 504.072 87.7075C504.912 86.3988 507.432 85.209 508.872 85.5659C511.392 86.1608 513.672 87.9455 515.472 88.7784C516.792 87.3506 518.232 85.9229 519.672 84.4951C521.112 86.1608 522.552 87.8265 524.112 89.3732C525.312 90.563 526.632 92.1098 528.072 92.4667C537.312 95.0842 542.352 100.2 542.112 109.481V109.6Z" fill="currentColor"/>
<path d="M486.441 222.521C480.561 222.997 474.681 223.354 468.921 223.83C468.921 223.473 468.681 223.116 468.561 222.878C470.001 221.926 471.561 221.094 473.481 219.785C468.681 213.836 473.241 210.385 477.681 207.054C471.441 203.009 470.121 198.25 473.361 189.802C474.201 187.542 478.281 186.59 480.801 185.043C481.161 185.638 481.641 186.114 482.001 186.709C481.281 188.136 480.441 189.683 479.961 190.754C483.201 197.774 486.321 204.793 489.561 212.051C488.721 215.026 487.521 218.952 486.441 222.759L486.561 222.64L486.441 222.521Z" fill="currentColor"/>
<path d="M640.281 109.132C638.001 110.916 635.841 113.058 633.441 114.367C629.361 116.627 625.041 118.293 620.841 120.197C620.121 120.554 619.521 121.149 618.801 121.505C612.961 124.916 611.961 129.596 615.801 135.545C616.281 136.259 616.521 136.973 616.881 137.568C612.681 141.613 609.921 140.899 602.721 133.522C605.721 127.692 608.121 121.387 611.961 116.151C613.881 113.534 618.441 112.463 621.921 111.273C627.561 109.37 633.321 107.823 638.961 106.157C639.321 107.109 639.801 108.061 640.161 109.013L640.281 109.132Z" fill="currentColor"/>
<path d="M433.64 153.154C438.92 154.106 444.08 155.177 450.68 156.367C449.84 155.415 450.32 155.653 450.32 156.01C451.16 159.698 455.48 163.624 451.16 167.194C449.12 168.859 445.28 168.383 442.16 168.859C439.04 169.335 436.04 170.168 434.12 166.361C433.64 165.29 431.48 165.171 429.68 164.457C430.28 162.91 430.88 161.602 431.6 159.936C430.64 159.698 429.44 159.341 428 158.984C430.16 156.248 431.96 153.987 433.76 151.607C433.76 152.083 433.64 152.678 433.52 153.154H433.64Z" fill="currentColor"/>
<path d="M527.602 82C537.442 82.8329 547.162 83.5467 557.482 84.3796C555.802 90.4475 552.082 91.9942 547.162 91.9942C536.482 91.9942 528.562 88.1869 527.602 82Z" fill="currentColor"/>
<path d="M684.919 96.037C682.759 90.0881 685.639 88.0654 690.679 88.0654C693.799 88.0654 697.039 88.4224 699.919 89.4932C701.599 90.0881 702.679 92.2297 703.999 93.7764C702.079 94.8472 700.159 96.7509 698.239 96.8699C693.919 97.1078 689.599 96.3939 684.799 96.156L684.919 96.037Z" fill="currentColor"/>
<path d="M792.564 108.773C798.684 109.725 805.284 103.3 810.084 112.7C807.924 114.009 804.804 117.459 802.644 116.983C798.804 116.15 792.324 116.864 792.684 108.773H792.564Z" fill="currentColor"/>
<path d="M469.29 203.59V214.06C466.41 214.655 463.41 215.25 460.53 215.845C457.89 206.564 460.05 203.59 469.29 203.59Z" fill="currentColor"/>
<path d="M622.283 89.8515C618.323 90.2085 615.083 90.4464 611.963 90.6844C612.683 89.0187 612.923 86.8771 614.123 85.9252C617.123 83.7836 620.003 84.1406 622.283 89.8515Z" fill="currentColor"/>
<path d="M698.48 358.989C700.76 362.321 705.2 364.105 701.36 368.151C700.4 369.102 698.84 369.34 697.52 369.935C697.16 368.627 696.44 367.199 696.56 365.89C696.8 363.867 697.64 361.964 698.48 358.989Z" fill="currentColor"/>
</mask>
<g mask="url(#mask0_505_543)">
<path d="M646.156 89.134L818.154 83.1504L941.872 157.946L806.084 316.513L763.839 385.325H751.769L721.594 331.472L700.471 370.366L691.419 376.35L649.174 319.505L637.104 343.439L600.894 352.415L588.824 331.472L579.771 310.529L573.736 292.578V277.619H628.051L667.279 256.676L655.209 250.693L658.226 235.734L652.191 217.783V193.848L640.121 148.971L646.156 89.134Z" fill="currentColor"/>
</g>
</svg>`;
  } else if (continente_detetado === "Europe") {
    novoConteudoSVG = `<svg width="100%" viewBox="0 0 1024 642" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="1024" height="642" fill=""/>
<path d="M482.813 222.944C485.102 220.777 488.716 219.091 489.439 216.441C491.367 209.577 496.909 208.975 500.885 208.132C501.849 203.676 502.571 200.183 503.415 195.968C503.174 195.968 502.09 195.246 500.764 195.246C497.27 195.005 495.584 193.439 496.065 189.826C496.668 184.407 491.969 178.747 496.186 173.689C499.559 169.715 503.776 166.463 507.391 162.609C509.439 160.442 511.607 158.154 512.451 155.504C515.222 147.315 522.692 144.063 528.595 139.126C530.764 137.319 533.896 136.597 536.306 134.911C542.33 130.575 549.438 131.78 554.86 136.717C558.836 140.21 564.137 142.498 569.197 144.425C574.619 146.472 579.438 148.278 579.317 155.384C585.944 154.42 584.137 148.88 585.582 145.027H591.486C591.727 147.194 592.088 149.121 592.45 152.493C600.763 143.822 610.763 142.739 621.365 143.461C621.606 142.859 621.726 142.257 621.967 141.655C619.919 141.053 617.871 140.33 615.702 139.728C616.425 138.764 617.028 137.801 617.751 136.838C619.919 137.199 622.329 137.078 624.377 137.921C629.196 139.848 632.931 139.005 635.943 134.79C636.907 133.466 638.112 132.382 639.196 131.177C643.292 126.44 647.268 126.44 651.124 131.177C652.569 129.973 653.895 128.648 655.822 127.083C656.545 129.612 657.148 131.539 657.75 133.466C658.232 133.466 658.593 133.586 659.075 133.706C659.557 131.9 659.919 129.973 660.401 127.805C661.967 127.805 663.654 127.564 665.461 127.444C665.702 125.878 666.063 124.433 666.304 122.988C666.666 123.47 667.027 124.072 667.389 124.554C676.304 117.569 685.942 112.029 698.231 109.621C698.352 109.621 699.677 110.945 701.966 112.993C704.617 109.5 706.665 106.008 709.436 103.117C710.641 101.913 714.617 101.19 715.099 101.793C718.352 106.369 722.93 105.887 727.026 104.924C732.448 103.479 735.099 107.091 737.147 110.343C738.352 112.27 737.388 115.522 737.388 119.255C745.58 120.7 755.821 120.459 763.893 124.433C776.062 130.455 787.989 125.517 799.917 127.444C801.122 122.627 803.531 121.302 808.592 122.386C819.314 124.674 827.989 131.418 838.35 135.031C841.362 130.936 845.94 129.973 848.47 134.309C853.41 142.739 860.519 139.005 867.024 139.126C867.627 139.126 868.109 138.644 868.711 138.524C869.073 138.524 869.434 138.524 870.036 138.524C871.241 140.089 872.567 141.655 874.976 144.545C874.615 141.053 874.494 139.126 874.133 135.272C881.362 137.319 887.627 139.126 893.892 140.932C896.301 141.655 898.831 142.136 901 143.22C906.542 145.99 911.964 149.001 917.385 151.891C917.988 152.252 918.349 152.975 918.951 153.216C924.654 155.464 927.024 160.361 926.06 167.908C923.409 166.584 920.879 165.861 919.072 164.295C913.771 160.08 913.048 160.08 908.711 166.102C910.518 168.27 912.325 170.558 914.614 173.328C910.879 174.532 907.867 175.616 904.614 176.338C900.759 177.302 896.663 177.543 895.699 182.721C895.578 183.444 892.687 183.805 891.121 184.046C887.988 184.407 884.494 183.805 881.723 184.889C877.024 186.936 877.506 192.596 882.687 196.57C879.073 204.158 875.338 211.865 871.603 219.572C870.88 219.572 870.157 219.332 869.314 219.332C868.229 217.405 867.145 215.478 866.181 213.431C864.976 210.781 863.531 208.132 862.808 205.362C862.085 202.833 861.241 199.822 862.085 197.534C864.494 191.031 867.627 184.889 870.398 178.626C869.916 178.145 869.434 177.663 868.952 177.302C868.109 178.867 867.145 180.433 866.543 181.517C864.374 180.794 861.241 179.59 861.121 179.951C859.555 182.962 858.47 186.214 857.145 189.345C857.507 190.067 857.747 190.79 858.109 191.512C851.121 190.429 844.013 189.465 837.025 188.14C828.23 186.334 825.097 188.14 822.447 196.57C821.844 198.497 819.917 200.063 818.953 201.99C818.35 203.074 817.868 205.241 818.35 205.603C819.435 206.446 821.121 206.687 822.567 206.687C825.097 206.446 827.627 205.844 830.157 205.482C830.278 205.964 830.398 206.446 830.519 207.048C831.362 205.844 832.206 204.639 834.133 201.749C835.218 205.603 835.579 207.891 836.422 210.059C837.989 213.792 839.796 217.405 841.483 221.138C842.687 223.547 844.374 225.835 845.097 228.364C845.338 229.086 843.049 230.532 841.242 232.579C841.242 232.94 841.362 234.867 841.603 237.276C836.422 234.987 836.061 230.893 835.579 226.678C835.097 222.944 834.013 219.332 833.169 215.719C832.567 215.719 832.085 215.96 831.483 216.08C831.483 217.043 831.242 218.007 831.483 218.729C835.579 230.532 828.712 239.443 823.652 248.837C823.17 249.8 821.844 250.402 820.881 250.884C813.17 254.979 812.447 256.424 813.29 265.576C813.772 270.875 815.579 276.295 809.917 282.437C805.82 275.813 801.965 269.791 798.11 263.65C795.941 268.467 793.893 272.32 792.688 276.295C792.086 278.101 792.327 281.112 793.411 282.196C800.158 288.699 799.315 301.946 792.929 310.135C790.278 313.507 788.592 317.722 786.423 321.576C784.495 325.069 782.086 327.477 777.387 326.995C775.339 326.755 773.05 328.2 769.074 329.404C775.7 332.174 774.134 335.064 772.206 338.677C770.881 341.206 770.761 344.698 770.64 347.709C770.158 357.825 766.785 363.004 761.845 364.088C756.062 359.993 751.604 356.741 747.267 353.61C744.014 358.066 744.978 363.124 750.038 368.062C755.219 372.999 757.146 379.503 758.472 386.367C749.918 381.068 741.725 375.649 739.797 364.69C739.556 363.606 739.315 361.92 739.918 361.197C742.809 357.584 741.002 355.296 738.713 352.406C737.147 350.359 737.026 347.107 735.942 343.374C734.858 343.374 732.93 343.012 731.002 342.892C727.388 342.651 726.424 341.326 726.303 337.232C726.183 333.017 722.81 328.922 720.641 324.226C717.749 325.55 714.617 326.032 712.81 327.838C708.111 332.656 704.617 339.038 699.436 343.012C692.93 348.071 695.099 355.537 692.689 361.559C690.641 366.496 688.714 368.423 684.979 367.339C680.28 357.103 675.943 347.589 671.605 338.195C670.882 336.63 670.401 334.823 669.919 333.137C669.557 331.933 669.678 330.247 668.955 329.765C662.69 325.791 661.124 316.398 651.244 315.916C646.184 315.675 641.485 314.109 637.268 318.324C635.582 315.795 634.256 313.869 633.052 311.942C632.57 312.183 632.088 312.423 631.606 312.544C632.57 314.832 633.172 317.481 634.738 319.408C639.196 324.707 638.594 330.849 632.811 334.944C624.016 341.086 615.1 346.866 605.221 351.202C598.715 354.092 596.787 353.851 594.859 346.625C592.45 337.954 587.269 331.331 581.848 324.707C579.799 320.01 577.751 315.193 575.583 310.497C575.101 316.518 574.378 322.66 581.245 325.309C581.607 333.378 585.462 339.761 590.402 345.782C592.932 348.793 594.98 352.165 598.353 356.982C601.727 356.26 606.666 355.537 611.365 353.972C614.98 352.767 617.389 353.731 617.269 357.223C617.269 361.077 616.425 365.292 614.618 368.664C611.245 375.047 607.028 380.948 603.173 386.969C602.329 388.294 601.606 390.1 600.281 390.702C594.257 393.954 591.365 399.133 590.161 405.395C589.197 409.971 588.594 414.668 588.353 419.244C588.112 423.58 588.594 428.036 588.594 432.491C588.474 438.633 587.39 443.812 581.968 448.749C577.751 452.603 576.667 459.949 574.257 465.73C573.655 467.175 573.655 469.945 573.052 470.065C566.185 471.39 567.631 477.412 565.824 481.627C564.619 484.517 561.245 486.564 560.041 489.575C555.583 500.895 544.378 501.979 535.342 506.194C531.005 508.241 527.872 506.435 526.788 501.859C524.619 492.826 519.921 484.637 519.559 474.883C519.318 469.222 514.86 463.683 512.571 457.902C511.607 455.493 510.162 452.483 510.885 450.435C515.222 437.309 512.089 424.543 509.439 411.778C509.198 410.814 508.957 409.73 508.354 409.008C501.728 401.902 502.933 393.713 505.102 385.404C505.583 383.597 505.102 381.55 505.102 379.021C497.15 381.55 490.162 381.67 484.258 374.565C484.258 374.565 483.415 374.445 483.295 374.685C478.355 383.236 469.439 380.466 462.331 380.827C457.994 381.068 452.934 376.853 449.199 373.481C446.307 370.832 445.464 366.014 442.813 363.004C437.753 357.344 438.235 350.84 437.512 343.976C436.307 332.174 440.042 321.576 443.536 310.858C444.259 308.811 446.428 307.125 448.355 305.679C452.813 302.548 455.584 298.574 455.343 293.155C454.861 284.966 461.367 281.594 466.066 277.017C466.668 276.415 468.716 276.174 469.319 276.776C473.295 280.028 476.307 278.824 479.439 277.017C490.162 275.813 500.764 272.923 511.607 271.718C510.644 282.918 513.294 286.049 521.366 288.819C525.222 290.144 528.957 292.312 533.294 294.359C534.74 286.772 540.161 287.495 545.824 288.338C553.294 289.542 560.763 290.746 569.077 292.071C570.281 287.013 571.727 281.473 573.052 275.933C572.45 275.813 571.968 275.692 571.366 275.452C569.799 277.499 568.354 279.546 566.787 281.594C566.306 281.232 565.824 280.991 565.221 280.63C565.221 279.065 565.101 277.499 565.101 277.379C559.318 276.656 554.378 275.933 549.318 275.211C548.233 270.634 547.149 266.058 546.065 261.121C541.125 264.252 544.378 268.708 544.378 272.32C544.378 273.404 547.39 274.488 549.077 275.452V280.028C545.583 278.222 542.932 275.933 540.041 275.572C536.185 275.09 535.583 273.284 535.704 270.032C535.945 265.817 534.981 262.084 530.282 260.398C529.92 258.953 530.041 256.906 529.198 256.063C525.704 252.691 521.969 249.8 518.354 246.669C517.872 247.151 517.391 247.632 516.909 248.114C518.836 250.161 520.764 252.45 522.812 254.256C525.222 256.424 527.872 258.351 530.402 260.398C530.523 260.518 530.643 260.639 530.764 260.88C530.764 261 530.764 261.241 530.764 261.482C529.439 261.482 528.113 261.482 528.234 261.482C525.824 265.336 523.776 268.587 521.366 272.561C519.68 271.237 517.872 269.791 516.427 268.708C518.595 266.901 520.041 265.697 521.487 264.493C519.8 262.686 518.475 260.398 516.427 258.953C514.258 257.387 511.607 256.544 509.077 255.46C507.752 258.712 512.089 264.131 504.499 266.419C504.017 260.278 503.535 254.858 503.053 249.439C501.246 249.8 498.716 251.125 496.668 250.523C492.09 249.318 487.566 250.643 486 254.256C482.988 261.121 481.728 268.346 478.837 275.211C472.21 274.247 466.186 273.645 458.476 272.441V249.68C464.138 249.318 469.198 248.716 474.259 248.837C478.837 248.957 479.921 245.344 478.837 243.177C477.271 240.166 475.945 235.71 470.885 235.59C469.68 235.59 468.475 234.265 467.271 233.422C468.235 232.338 469.078 230.893 470.283 230.17C474.379 227.4 478.716 224.992 482.933 222.342L482.813 222.463V222.944ZM540.161 160.442C539.559 160.08 538.113 157.861 537.511 157.5C534.378 161.354 527.151 164.785 524.5 169C522.693 171.89 520.036 177.471 521 180C524.012 187.587 523.03 192.358 520.5 198.5C519.777 200.186 519.318 204.158 517.993 204.037C516.065 203.796 514.017 201.869 512.812 200.063C511.246 197.895 510.523 195.246 509.318 192.837C508.836 192.958 508.355 193.198 507.873 193.319C507.391 198 507.752 202.712 509.318 208.132C512.933 207.289 519.68 203.796 523.415 204.398C532.21 205.723 533.414 201.026 534.137 194.282C534.378 191.994 536.788 190.067 538.113 187.9C538.836 187.9 539.679 188.02 540.402 188.14C539.438 185.973 539.077 182.962 537.511 181.999C529.318 176.94 528.836 174.291 535.463 167.186C537.27 165.138 538.595 162.609 540.161 160.321V160.442ZM563.534 154.179C564.378 159.358 563.896 164.055 571.125 164.898C567.751 157.07 577.39 161.044 577.992 155.263C573.414 154.902 568.836 154.541 563.534 154.179ZM627.871 312.544C625.702 309.172 624.016 306.161 621.967 303.271C620.16 300.742 619.919 295.202 614.377 298.694C617.51 303.993 620.401 309.051 623.293 313.989C624.979 313.507 626.546 313.026 627.871 312.544ZM767.628 339.038C768.592 338.436 769.556 337.714 770.64 337.111C768.592 334.101 766.544 331.21 764.375 328.2C763.532 328.802 762.688 329.404 761.725 330.006C763.652 333.017 765.58 336.148 767.628 339.159V339.038Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M284.869 119.738C285.471 121.183 286.194 122.629 286.917 124.194C290.411 123.472 294.628 120.461 296.796 126.362C304.628 123.833 309.688 131.059 316.314 132.143C322.7 133.226 326.555 139.248 323.302 144.426C327.158 146.955 332.459 148.641 334.266 152.134C335.591 154.783 332.579 159.721 331.374 164.056C328.121 162.129 325.832 160.684 323.423 159.36C328.724 165.742 324.507 171.884 323.182 179.592C319.567 177.304 315.832 175.618 312.941 173.089C309.085 169.716 305.471 166.706 299.688 167.308C298.001 167.428 296.074 165.622 294.146 164.658C295.351 162.972 296.435 161.046 298.001 159.6C298.965 158.637 300.772 158.637 301.736 157.674C304.146 155.506 308.483 152.134 308.001 150.93C306.676 147.678 303.664 144.426 300.531 142.981C297.037 141.295 292.58 141.416 290.17 141.054C289.688 146.233 291.013 152.616 288.483 155.626C285.592 158.998 279.086 159.119 275.833 160.203C267.52 169.837 260.05 178.387 252.58 186.817C259.086 195.368 265.351 202.714 277.279 201.871C278.483 205.725 279.688 209.94 281.375 215.48C283.182 210.301 284.507 206.568 285.833 202.714C284.869 201.871 283.905 201.028 281.857 199.222H288.724C289.568 191.755 290.652 184.409 291.013 177.063C291.254 172.005 294.266 171.402 297.76 172.366C301.254 173.209 304.387 175.256 307.76 176.581C308.965 177.063 310.411 177.183 312.097 177.544C312.338 181.157 312.459 184.891 312.7 188.985H320.411C320.772 187.42 321.133 185.734 321.495 184.048C322.218 184.048 323.182 184.048 323.302 184.288C325.471 188.985 328.483 193.561 329.447 198.62C330.41 203.678 334.266 209.338 340.531 210.181C340.531 213.553 340.772 217.166 340.531 220.658C340.169 225.114 341.495 228.486 344.748 231.978C346.555 233.905 346.314 237.639 347.398 242.456C342.458 240.408 339.206 239.084 335.953 237.759C336.073 237.277 336.314 236.796 336.435 236.193C334.145 236.555 331.856 237.036 327.88 237.639C331.856 231.497 335.109 226.559 339.206 220.297C333.302 222.585 328.965 224.391 324.868 225.957C324.146 227.643 323.543 229.57 322.459 231.256C321.254 233.062 319.567 234.507 318.001 236.073C319.688 237.277 321.495 238.482 323.182 239.565C323.664 239.927 324.266 240.047 326.435 240.77C322.097 243.299 318.603 245.346 314.146 247.875C314.507 245.828 314.748 244.985 315.109 242.937C309.447 245.346 304.387 247.514 298.965 249.922C300.411 252.692 301.254 254.378 302.58 256.907C292.339 258.593 288.845 265.578 286.917 273.888C285.833 275.694 284.989 277.742 283.785 279.428C282.7 280.873 281.375 282.197 280.05 283.402C276.797 286.412 272.821 289.062 270.17 292.554C268.966 294.12 270.17 297.612 270.17 300.141C270.17 300.503 270.893 300.744 270.893 301.105C270.893 307.006 270.291 313.268 278.483 316.158C277.881 316.64 277.158 317.242 276.556 317.724C275.23 317.122 273.905 316.761 272.7 316.038C271.616 315.436 270.652 314.713 269.929 313.75C267.761 311.221 265.592 308.692 263.664 305.922C262.46 304.356 261.978 300.984 260.773 300.864C257.158 300.382 253.424 300.864 249.809 301.225C248.002 301.466 245.713 303.273 244.749 302.55C237.761 297.974 232.219 301.346 226.075 305.44C226.075 310.98 225.954 316.761 226.075 322.541C226.075 325.07 226.315 327.961 227.52 330.008C228.605 331.694 231.255 333.139 233.303 333.259C234.508 333.259 236.074 330.73 237.159 329.044C237.882 327.961 238.123 326.395 238.604 324.829H250.893C249.93 329.647 248.966 334.223 247.881 339.522C249.327 339.883 251.134 340.485 252.942 340.726C260.532 341.93 261.616 343.496 260.532 351.203C260.17 353.612 259.929 356.021 259.809 358.429C259.809 359.633 260.05 360.717 260.291 361.801C264.387 364.21 270.05 351.083 272.941 363.246C272.459 363.848 271.857 364.451 271.375 365.053C269.206 366.859 266.917 368.666 263.544 371.556C258.484 366.859 253.062 361.681 247.641 356.623C246.556 355.539 245.351 354.214 244.026 353.853C239.327 352.649 234.749 351.806 233.183 346.145C232.942 345.543 231.255 345.182 230.171 344.941C222.942 343.014 215.231 342.051 208.605 338.799C205.472 337.354 203.063 331.694 202.822 327.84C202.46 321.578 199.93 317.363 195.473 313.509C194.027 312.305 193.183 310.498 191.256 308.09C192.099 312.184 192.822 315.075 193.545 318.567C188.967 318.567 186.798 317.001 184.629 313.629C179.69 306.042 177.16 297.853 174.629 289.423C174.148 287.978 173.184 286.292 171.979 285.449C165.834 281.234 164.027 275.333 164.63 268.348C165.352 259.316 166.316 250.284 167.039 241.251C167.28 238 167.16 234.748 166.798 231.497C165.714 223.428 164.389 215.359 163.304 207.772C162.943 208.856 162.22 210.422 161.618 212.108C161.136 212.348 160.533 212.589 160.051 212.83C161.377 198.138 146.558 197.897 140.654 189.587C139.57 188.142 134.028 189.949 131.016 190.31C130.534 195.368 131.618 201.269 129.329 202.955C124.871 206.447 118.606 207.772 113.064 210.06C112.823 209.579 112.582 208.976 112.341 208.495L116.196 200.908C115.594 200.426 115.112 199.944 114.51 199.583C107.401 206.688 101.016 214.516 93.0643 220.417C87.1607 224.873 79.9319 228.366 71.8597 227.402C71.4983 226.92 71.1368 226.318 70.7754 225.837C74.6308 222.946 78.6066 220.176 82.3415 217.166C88.0041 212.348 93.4257 207.17 99.3292 201.992C93.6667 198.499 93.5462 198.499 88.3655 203.075C86.1969 200.306 84.0282 197.536 81.9801 194.766C81.7391 195.007 81.3777 195.368 81.1367 195.609C80.5343 193.441 80.4138 190.912 79.209 189.106C75.4741 183.445 76.438 178.267 82.7029 175.738C86.9198 174.052 91.6185 173.45 95.9558 172.005C98.1244 171.282 100.052 170.078 101.859 167.91H89.4498C85.8354 163.815 82.9439 160.684 79.5705 156.951C86.5583 155.265 93.1847 150.207 102.341 152.736C103.064 152.134 104.751 150.689 106.317 149.364C103.426 147.798 100.414 146.594 97.763 144.788C96.6787 144.065 95.8353 141.897 96.0763 140.693C96.3172 139.73 98.3654 138.887 99.6907 138.525C105.956 136.96 112.1 135.635 118.365 134.19C119.329 133.949 120.413 133.467 121.257 133.588C132.823 135.876 144.268 138.284 155.834 140.573C159.449 141.295 163.184 141.777 166.678 141.416C173.184 140.813 179.569 139.489 186.798 138.405C186.918 138.766 187.521 140.332 188.244 142.74C190.653 141.175 192.822 139.85 195.111 138.405C194.991 138.887 194.87 139.248 194.629 139.73C204.629 142.74 214.749 145.751 224.749 149.003C226.797 149.605 228.605 151.05 230.412 152.134C232.701 147.678 228.966 143.945 222.46 143.463C218.002 143.102 213.665 140.693 209.328 139.127C209.93 137.562 210.533 135.996 211.255 134.069C206.798 131.179 200.894 131.42 194.629 134.19C193.545 130.938 191.376 128.048 192.099 125.88C193.424 121.665 196.075 117.691 198.725 114.078C200.292 111.79 212.099 113.837 216.436 116.487C218.123 115.282 219.81 114.319 221.135 113.115C222.34 111.91 223.303 110.465 224.508 108.9C228.123 109.381 232.099 109.863 234.508 110.104C236.918 107.093 238.604 104.926 240.291 102.758C241.376 104.805 242.58 106.852 244.147 109.743C248.363 108.057 253.424 106.13 259.93 103.601V113.837C256.797 113.596 253.544 113.476 250.412 113.235C249.327 113.235 248.243 112.392 247.279 112.753C239.809 115.162 232.339 117.811 224.629 120.461C226.918 121.545 229.448 122.629 232.58 124.194C239.207 116.728 248.363 117.932 257.761 118.534C258.363 121.665 258.966 124.435 259.568 127.566C255.11 130.577 250.653 133.588 246.074 136.719V142.981C242.58 142.62 239.327 142.259 235.713 141.897C240.291 147.919 241.135 148.039 254.749 143.824C255.472 145.51 256.315 147.196 257.038 148.882C257.64 148.882 258.122 148.882 258.725 148.882C258.725 145.269 258.725 141.777 258.725 138.164C258.725 135.996 259.086 133.829 259.207 131.781C261.014 132.022 263.062 131.781 264.628 132.504C266.435 133.467 268.002 135.153 269.447 136.598C270.773 137.923 271.857 139.489 273.544 140.813C271.255 133.347 273.423 127.085 278.483 121.906C279.809 120.581 282.58 120.581 284.628 119.859H284.387L284.869 119.738Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M271.256 365.179C271.738 364.577 272.341 363.974 272.823 363.372C277.642 359.037 282.461 354.701 287.521 350.125C289.328 351.691 290.895 352.895 292.702 354.46C293.907 353.497 295.112 352.413 296.557 351.209C298.124 352.895 299.328 354.581 300.895 355.665C303.304 357.351 305.593 358.555 309.087 359.157C315.232 360.241 322.822 361.807 325.955 369.514C327.4 373.247 329.569 375.776 334.629 374.933C340.292 374.09 345.111 379.269 345.713 385.893C345.834 387.819 345.713 389.867 345.713 393.118C353.665 395.166 361.978 397.092 370.171 399.381C372.821 400.103 375.11 402.03 377.641 403.114C379.207 403.836 381.014 403.836 382.46 404.559C383.906 405.282 385.833 406.365 386.436 407.69C389.689 416.12 386.074 423.707 382.339 431.053C380.894 433.944 378.002 436.232 376.315 439.122C374.99 441.29 374.267 443.819 373.785 446.348C372.942 451.406 372.46 456.464 371.858 461.643C371.376 465.858 369.207 468.025 364.87 469.23C358.243 471.036 355.352 475.492 354.99 482.356C354.99 483.199 355.231 484.163 354.87 484.765C352.099 489.221 348.605 493.315 346.436 498.012C343.665 503.793 339.328 505.358 333.665 504.395C333.424 505.358 333.063 505.72 333.183 506.081C335.954 516.558 335.232 516.679 324.75 521.014C321.376 522.459 319.328 527.879 317.4 531.853C316.316 534.02 317.159 537.031 316.437 539.44C315.232 543.173 311.738 546.545 316.437 550.399C317.039 550.881 316.437 554.253 315.473 555.216C305.352 564.61 308.123 570.511 318.605 577.977C312.702 582.433 302.461 579.784 298.846 573.642C291.859 561.96 291.015 548.954 290.172 535.827C290.051 533.057 289.569 530.287 289.328 527.276C291.015 525.229 292.822 522.7 295.714 519.087H288.003C289.569 510.778 291.136 502.829 292.702 494.881C293.184 492.593 294.148 490.425 294.148 488.137C294.148 479.948 294.509 471.638 293.907 463.449C293.425 457.066 291.618 451.286 285.714 447.191C281.136 444.06 275.473 440.688 276.919 433.221C277.039 432.499 275.112 431.535 274.148 430.572C272.22 428.645 269.811 426.959 268.485 424.55C266.437 420.576 265.714 416.482 272.702 414.916C270.052 413.23 268.003 412.026 266.799 411.183C260.895 394.804 272.943 380.834 271.377 365.299L271.256 365.179Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M381.5 79.1561C381.138 68.5583 381.138 68.6788 390.897 68.197C401.62 67.7153 412.222 66.511 422.945 66.6315C429.812 66.6315 436.68 68.7992 443.547 69.8831C443.547 70.8465 443.668 71.6895 443.788 72.6529C440.053 74.5798 436.439 76.5067 432.704 78.554C432.945 79.0357 433.186 79.5174 433.306 79.9991C434.752 79.6378 436.198 79.397 437.523 78.9152C441.86 77.3497 445.957 76.1454 449.451 80.6013C450.053 81.3238 451.258 81.4443 451.981 82.0464C453.306 83.0098 454.511 84.2141 455.836 85.298C454.39 85.9001 452.945 86.7431 451.378 87.2249C447.643 88.3087 443.788 89.2722 439.812 90.356C440.535 93.3668 441.017 95.1732 441.378 96.6183C439.571 97.8226 438.005 98.7861 436.318 99.9904C439.089 102.038 441.258 103.603 444.511 106.132C440.053 106.975 437.162 107.577 433.909 108.3C434.391 111.311 435.234 114.081 435.234 116.85C435.234 119.379 435.354 123.113 433.909 124.197C430.535 126.726 430.174 129.375 431.62 133.47C429.692 132.988 428.367 132.627 426.439 132.145C427.764 134.072 428.848 135.517 429.933 136.962C429.692 137.564 429.451 138.287 429.21 138.889C424.27 137.323 419.21 135.758 414.27 134.192C414.029 134.915 413.788 135.517 413.668 136.24C416.559 137.444 419.451 138.648 423.306 140.214C420.415 142.863 417.644 145.994 414.391 148.162C408.969 151.895 403.307 155.267 397.524 158.399C395.355 159.603 392.584 160.085 390.174 159.964C384.994 159.603 384.271 163.216 382.945 166.708C380.174 173.693 377.283 180.678 374.994 186.218C369.813 184.773 365.958 184.05 362.464 182.725C360.898 182.123 358.97 180.558 358.608 179.112C357.645 175.861 357.886 172.368 357.163 169.117C356.199 164.3 354.874 159.723 353.307 153.1C355.115 151.052 358.367 147.439 361.982 143.345C359.09 141.659 355.837 139.732 351.139 136.962C354.151 136.36 355.837 136.36 356.922 135.637C357.886 135.035 358.488 133.711 358.127 131.904C356.199 132.747 354.151 133.59 352.103 134.554C351.38 128.05 350.657 122.27 350.054 116.73C345.597 115.164 341.5 113.719 337.404 112.395C336.561 112.154 335.476 112.395 334.633 112.635C328.97 114.562 325.115 112.756 322.344 106.253C327.043 105.771 331.5 105.41 335.958 105.048C335.958 104.567 335.958 104.205 335.958 103.724C330.055 103.483 324.272 103.122 318.368 102.881C318.127 102.038 317.886 101.195 317.766 100.352C324.392 98.0635 331.139 95.7753 338.97 93.0055C336.32 91.3195 334.874 90.4765 333.428 89.513C348.729 81.3238 364.03 74.5798 381.741 79.2765L381.5 79.1561ZM414.15 76.5067C423.708 78.6744 429.13 78.3532 430.415 75.5432C424.873 75.9045 419.451 76.2658 414.15 76.5067Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M821.853 427.917C829.804 430.446 837.876 426.713 844.744 431.891C840.647 435.665 842.535 439.88 850.406 444.536C856.189 439.117 851.009 431.289 854.382 425.268C861.25 424.424 857.997 430.807 859.804 433.457C861.972 436.588 863.418 440.08 865.105 443.452C866.792 446.945 868.84 450.437 869.924 454.05C871.008 457.663 871.008 461.517 871.611 465.852C876.069 463.925 877.273 466.093 878.117 470.067C879.804 477.895 882.093 485.723 877.996 493.43C875.105 498.85 871.972 504.269 868.599 509.448C861.852 519.925 856.069 521.972 844.141 519.202C836.19 517.396 835.828 516.914 836.19 508.484C830.768 508.243 827.395 505.353 824.744 500.295C822.334 495.598 812.094 495.719 804.865 499.091C798.479 502.101 791.853 504.51 785.347 506.798C781.733 508.123 777.154 504.39 777.998 500.897C780.287 491.383 776.19 482.471 775.347 473.198C774.986 468.863 775.106 466.575 779.564 466.213C784.504 465.732 786.431 462.721 787.154 458.386C787.877 454.411 789.202 451.16 794.624 454.411C793.66 447.427 797.997 446.222 802.696 446.824C806.551 447.306 808.118 445.981 808.118 442.609C808.118 437.551 811.25 435.624 815.467 434.781C819.081 434.059 823.057 433.818 821.732 427.676L821.853 427.917Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M285.109 119.861C281.133 118.295 277.157 116.97 273.181 115.164C271.976 114.682 271.253 113.237 270.289 112.274C270.53 111.671 270.892 111.19 271.133 110.588C274.024 111.19 277.036 111.792 279.928 112.394C282.94 112.996 285.952 113.598 289.084 114.08C289.325 113.357 289.446 112.635 289.687 111.912C287.518 111.19 285.35 110.106 283.06 109.745C280.771 109.383 278.362 109.745 275.711 109.745C276.675 103.844 279.566 101.796 285.229 102.88C284.265 102.037 283.301 101.194 281.735 99.8694C284.386 97.8221 287.157 95.6544 290.53 93.1254C284.024 91.9211 281.735 96.377 279.205 100.592C274.988 100.592 271.735 99.6286 272.458 94.2092C272.458 93.4867 272.217 92.4028 271.735 92.0415C265.229 86.7426 274.024 84.9362 274.145 81.2029C276.675 82.2867 279.205 83.2502 281.494 84.6953C282.94 85.5383 284.145 86.9835 286.313 87.4652C285.831 86.6222 285.47 85.6588 284.747 84.9362C279.446 79.6373 279.807 76.6266 287.398 75.7836C301.012 74.3384 314.867 74.0976 328.602 73.6158C334.867 73.375 341.132 73.6158 348.12 73.6158C346.313 82.5276 339.084 79.0352 334.626 81.6846V86.3813C328 89.7534 321.373 92.4028 315.711 96.377C312.458 98.6651 310.771 103.241 308.241 106.613C306.072 109.504 303.783 112.394 301.614 115.164C297.157 120.704 290.651 119.379 284.747 119.981H284.988L285.109 119.861Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M824.98 399.858C827.028 397.329 828.233 396.004 829.438 394.439C827.269 393.596 825.1 392.873 822.932 392.151C825.944 386.37 828.715 385.768 835.462 389.14C834.859 390.103 834.257 391.067 833.534 391.91C832.932 392.512 832.088 392.994 831.365 393.475C831.365 394.198 831.486 394.8 831.606 395.523C833.775 395.523 836.425 396.366 837.992 395.402C843.895 391.91 847.63 392.03 853.654 396.245C857.148 398.774 860.883 400.942 865.461 403.832C869.076 408.89 873.533 414.912 877.991 421.054C877.509 421.656 877.027 422.378 876.545 422.981C874.618 421.897 872.329 421.295 870.883 419.729C868.112 416.598 865.943 415.393 862.811 419.488C861.967 420.451 858.714 420.09 856.787 419.488C854.136 418.765 851.606 417.2 848.233 415.634C846.425 407.686 834.859 398.413 825.1 399.738L824.98 399.858Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M538.839 108.539C534.14 106.371 530.405 104.685 526.309 102.878C525.827 104.564 525.104 106.973 524.502 109.382C524.14 110.586 523.899 111.67 523.538 112.874C519.562 111.67 515.345 110.706 511.61 109.02C510.767 108.659 510.767 105.287 511.369 103.721C512.092 101.794 513.899 100.349 514.622 97.459C511.61 99.0246 508.598 100.711 506.911 101.554C504.381 97.8203 502.092 95.0504 500.526 91.9193C499.803 90.3537 499.803 87.8247 500.647 86.3795C501.49 85.0548 504.02 83.8505 505.466 84.2118C507.996 84.8139 510.285 86.6204 512.092 87.4634C513.417 86.0182 514.863 84.5731 516.309 83.1279C517.755 84.8139 519.2 86.4999 520.767 88.0655C521.971 89.2698 523.297 90.8354 524.743 91.1967C534.02 93.8461 539.08 99.0246 538.839 108.418V108.539Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M788.968 371.313C796.076 372.036 796.558 373.963 795.112 382.152C793.907 389.137 793.425 396.242 790.293 402.746C789.449 404.552 786.799 407.563 786.196 407.322C781.98 405.395 776.558 403.709 774.389 400.216C767.522 388.535 768.124 388.414 779.57 380.827C782.823 378.66 785.233 375.167 788.847 371.313H788.968Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M612.457 428.281C612.698 433.941 613.662 439.721 612.818 445.261C611.493 454.052 608.722 462.603 607.156 471.274C606.071 477.295 601.252 476.573 597.517 476.814C596.313 476.814 594.023 472.478 593.903 470.19C593.782 465.975 594.987 461.76 595.469 457.545C595.71 456.22 596.192 454.534 595.71 453.45C593.662 448.994 595.59 445.622 598.963 443.575C603.903 440.564 606.312 436.108 608.12 431.05C608.481 429.967 609.324 429.124 609.927 428.16C610.77 428.16 611.614 428.16 612.457 428.281Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M842.934 252.698C843.778 259.201 844.501 265.824 845.464 272.328C845.946 275.94 845.103 278.59 841.489 280.035C836.79 281.841 831.971 283.407 827.513 285.695C824.862 287.02 822.814 289.549 819.561 292.319C818.718 290.874 816.549 288.826 816.79 287.02C817.272 283.768 817.272 280.035 821.73 278.349C827.031 276.302 831.971 273.291 836.79 270.28C838.115 269.437 839.199 267.029 839.199 265.343C839.32 261.248 838.838 257.033 838.477 252.818C839.922 252.818 841.489 252.698 842.934 252.577V252.698Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M637.394 108.061C635.105 109.867 632.936 112.035 630.527 113.359C626.43 115.648 622.093 117.334 617.876 119.26C617.153 119.622 616.551 120.224 615.828 120.585C609.965 124.037 608.961 128.774 612.816 134.796C613.298 135.518 613.539 136.241 613.9 136.843C609.683 140.938 606.912 140.215 599.684 132.749C602.696 126.848 605.105 120.465 608.961 115.166C610.888 112.516 615.467 111.433 618.96 110.228C624.623 108.301 630.406 106.736 636.069 105.05C636.43 106.013 636.912 106.977 637.273 107.94L637.394 108.061Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M733.537 375.169C739.199 373.363 742.814 375.049 745.344 380.468C746.789 383.599 749.56 386.49 752.452 388.417C757.994 392.15 758.115 398.171 759.681 403.591C760.042 404.674 757.874 406.36 756.91 407.806C753.536 404.915 748.115 402.507 747.151 399.014C745.705 393.836 743.536 389.982 739.681 386.61C736.187 383.599 732.452 380.709 733.537 375.29V375.169Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M923.174 523.294C928.234 526.546 928.234 529.797 921.849 534.855C918.235 537.745 914.741 541.117 912.331 545.092C908.958 550.511 904.259 546.296 900.524 547.982L899.078 546.778C901.729 543.406 903.897 539.672 906.909 536.782C911.849 532.085 917.391 528.111 923.174 523.414V523.294Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M299.694 335.792C284.513 337.839 282.826 337.237 283.911 332.541C279.212 330.012 275.116 327.242 270.537 325.796C266.682 324.472 262.345 324.713 257.525 324.11C258.128 323.267 259.212 320.498 260.537 320.257C269.092 319.293 277.525 319.173 284.272 326.158C285.838 327.723 288.368 328.687 290.657 329.169C294.633 330.012 298.609 330.493 299.694 335.913V335.792Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M524.266 80.6006C534.145 81.4436 543.904 82.1662 554.265 83.0092C552.578 89.1511 548.844 90.7166 543.904 90.7166C533.181 90.7166 525.229 86.8629 524.266 80.6006Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M808.238 406.246C806.31 405.042 804.383 403.717 801.973 402.272C801.371 404.199 800.768 406.006 800.286 407.812C793.419 403.477 793.78 395.167 801.491 386.496C804.624 388.182 807.997 389.868 811.25 391.554C811.13 392.156 811.009 392.638 810.768 393.24C809.202 393.842 807.756 394.444 805.829 395.167C807.033 398.419 808.359 401.67 809.684 405.042C809.202 405.403 808.72 405.765 808.238 406.126V406.246Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M928.838 519.927C927.393 519.324 926.308 518.843 925.465 518.602C927.393 512.942 929.2 507.522 931.368 501.501C932.332 503.307 933.296 505.114 934.139 506.92C937.031 507.161 940.043 507.402 943.296 507.643C938.236 514.748 933.898 520.89 929.561 527.032C928.959 526.671 928.356 526.309 927.874 526.069C928.236 524.021 928.597 522.094 928.838 520.047V519.927Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M787.152 421.296C778.116 419.249 769.2 417.202 760.164 415.275C760.526 408.531 761.369 408.17 767.152 409.735C771.489 410.94 776.067 412.505 780.525 412.746C785.344 412.987 786.549 416.118 788.116 419.249C787.875 419.972 787.513 420.694 787.272 421.296H787.152Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M682.213 94.81C680.044 88.7885 682.936 86.7412 687.996 86.7412C691.128 86.7412 694.381 87.1025 697.273 88.1864C698.96 88.7885 700.044 90.9562 701.369 92.5218C699.442 93.6057 697.514 95.5325 695.586 95.653C691.249 95.8938 686.912 95.1713 682.092 94.9304L682.213 94.81Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M842.937 252.689C841.491 252.689 839.925 252.809 838.479 252.93C837.516 251.846 835.588 250.642 835.588 249.558C835.588 246.427 836.431 243.295 837.034 239.321C841.732 240.887 846.07 242.212 851.612 244.018C846.793 245.824 849.925 253.532 842.937 252.689Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M806.189 356.269C808.117 354.824 810.045 353.379 812.575 351.452C812.695 350.489 813.057 348.321 813.659 343.985C817.997 348.923 821.37 352.777 824.864 356.751C820.527 358.798 816.912 360.484 812.575 362.411C812.334 361.207 812.093 359.641 811.732 357.714H806.912C806.671 357.233 806.43 356.63 806.189 356.149V356.269Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M790.289 107.699C796.434 108.662 803.06 102.159 807.879 111.673C805.711 112.998 802.578 116.49 800.409 116.009C796.554 115.166 790.048 115.888 790.41 107.699H790.289Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M844.615 524.387C848.471 524.628 852.326 524.989 856.543 525.35C857.386 529.926 856.784 534.262 851.965 534.864C845.7 535.707 846.543 529.204 843.893 526.073C844.134 525.591 844.374 524.989 844.615 524.507V524.387Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M803.778 343.498C800.525 340.126 794.862 338.199 798.477 332.9C799.681 331.214 805.826 330.371 807.031 331.695C811.368 336.151 806.067 339.162 803.778 343.498Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M288.971 172.008C286.803 171.526 284.513 170.924 281.983 170.322C279.333 175.259 276.321 173.814 272.586 169.84C275.718 167.432 278.489 163.337 281.501 163.337C284.393 163.337 287.285 167.311 290.176 169.479C289.815 170.322 289.453 171.165 288.971 172.008Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M796.064 324.474C796.305 319.777 789.558 317.369 795.221 313.274C796.426 312.431 799.679 312.311 799.92 312.792C801.606 316.767 801.004 320.38 796.185 324.474H796.064Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M619.32 88.5489C615.344 88.9102 612.091 89.1511 608.959 89.3919C609.682 87.7059 609.923 85.5382 611.128 84.5747C614.14 82.407 617.031 82.7683 619.32 88.5489Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M695.83 360.966C698.119 364.338 702.577 366.144 698.721 370.239C697.757 371.202 696.191 371.443 694.866 372.045C694.504 370.721 693.782 369.275 693.902 367.951C694.143 365.903 694.986 363.977 695.83 360.966Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M286.914 317.366C289.926 319.533 292.335 321.219 294.745 323.026C295.106 323.387 295.106 324.591 294.745 325.073C294.384 325.555 293.058 326.157 292.817 325.916C290.528 323.507 284.504 323.989 286.793 317.245L286.914 317.366Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M279.69 337.359C277.28 337.841 274.75 338.202 270.533 339.045C271.979 336.396 272.461 334.107 273.304 333.987C275.473 333.867 277.642 334.589 279.81 334.95V337.359H279.69Z" fill="#FFFFFF" fill-opacity="1"/>
<mask id="mask0_505_506" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="423" y="80" width="507" height="428">
<path d="M482.131 222.866C484.443 220.691 488.093 218.998 488.823 216.339C490.77 209.449 496.367 208.845 500.383 207.999C501.356 203.527 502.086 200.021 502.938 195.791C502.695 195.791 501.6 195.065 500.261 195.065C496.732 194.824 495.029 193.252 495.516 189.626C496.124 184.187 491.379 178.506 495.637 173.429C499.044 169.44 503.303 166.177 506.954 162.309C509.022 160.133 511.212 157.837 512.064 155.177C514.863 146.958 522.407 143.694 528.369 138.739C530.559 136.926 533.723 136.2 536.157 134.508C542.24 130.157 549.42 131.365 554.895 136.321C558.911 139.827 564.264 142.123 569.375 144.057C574.85 146.112 579.718 147.925 579.596 155.057C586.288 154.09 584.463 148.529 585.923 144.661H591.886C592.129 146.837 592.494 148.771 592.859 152.156C601.255 143.453 611.354 142.365 622.062 143.09C622.305 142.486 622.427 141.881 622.67 141.277C620.602 140.673 618.533 139.947 616.343 139.343C617.073 138.376 617.682 137.409 618.412 136.442C620.602 136.805 623.035 136.684 625.104 137.53C629.971 139.464 633.743 138.618 636.785 134.387C637.759 133.058 638.975 131.97 640.071 130.761C644.208 126.007 648.223 126.007 652.117 130.761C653.577 129.552 654.915 128.223 656.862 126.651C657.592 129.19 658.201 131.124 658.809 133.058C659.296 133.058 659.661 133.178 660.148 133.299C660.634 131.486 660.999 129.552 661.486 127.377C663.068 127.377 664.771 127.135 666.597 127.014C666.84 125.443 667.205 123.992 667.448 122.542C667.813 123.025 668.178 123.63 668.543 124.113C677.548 117.102 687.282 111.542 699.693 109.125C699.815 109.125 701.153 110.454 703.465 112.509C706.142 109.004 708.211 105.499 711.009 102.598C712.226 101.389 716.242 100.664 716.728 101.268C720.014 105.861 724.638 105.378 728.775 104.411C734.25 102.96 736.927 106.586 738.996 109.85C740.212 111.784 739.239 115.048 739.239 118.795C747.513 120.245 757.856 120.003 766.008 123.992C778.298 130.036 790.344 125.08 802.39 127.014C803.607 122.179 806.041 120.849 811.151 121.937C821.981 124.234 830.742 131.003 841.206 134.629C844.248 130.519 848.872 129.552 851.427 133.904C856.416 142.365 863.595 138.618 870.166 138.739C870.774 138.739 871.261 138.255 871.869 138.134C872.234 138.134 872.599 138.134 873.208 138.134C874.425 139.706 875.763 141.277 878.197 144.178C877.832 140.673 877.71 138.739 877.345 134.871C884.646 136.926 890.973 138.739 897.3 140.552C899.734 141.277 902.289 141.76 904.479 142.848C910.077 145.628 915.552 148.65 921.028 151.551C921.636 151.914 922.001 152.639 922.609 152.881C928.369 155.137 930.762 160.053 929.789 167.627C927.112 166.298 924.556 165.572 922.731 164.001C917.377 159.771 916.647 159.771 912.267 165.814C914.092 167.99 915.917 170.287 918.229 173.067C914.457 174.275 911.415 175.363 908.13 176.088C904.236 177.055 900.099 177.297 899.125 182.495C899.004 183.22 896.083 183.583 894.502 183.824C891.338 184.187 887.809 183.583 885.011 184.67C880.265 186.725 880.752 192.406 885.984 196.395C882.334 204.01 878.562 211.746 874.79 219.482C874.06 219.482 873.329 219.24 872.478 219.24C871.383 217.306 870.287 215.372 869.314 213.317C868.097 210.658 866.637 207.999 865.907 205.219C865.177 202.68 864.325 199.659 865.177 197.362C867.61 190.835 870.774 184.67 873.573 178.385C873.086 177.902 872.599 177.418 872.113 177.055C871.261 178.627 870.287 180.198 869.679 181.286C867.489 180.561 864.325 179.352 864.203 179.715C862.622 182.736 861.527 186 860.188 189.143C860.553 189.868 860.796 190.593 861.161 191.318C854.104 190.231 846.925 189.264 839.868 187.934C830.985 186.121 827.821 187.934 825.144 196.395C824.536 198.329 822.589 199.9 821.616 201.834C821.007 202.922 820.521 205.098 821.007 205.461C822.102 206.307 823.806 206.548 825.266 206.548C827.821 206.307 830.377 205.702 832.932 205.34C833.054 205.823 833.175 206.307 833.297 206.911C834.149 205.702 835.001 204.494 836.947 201.593C838.043 205.461 838.407 207.757 839.259 209.933C840.841 213.68 842.666 217.306 844.37 221.053C845.587 223.471 847.29 225.767 848.02 228.306C848.264 229.031 845.952 230.481 844.126 232.536C844.126 232.899 844.248 234.833 844.491 237.25C839.259 234.954 838.894 230.844 838.407 226.613C837.921 222.866 836.826 219.24 835.974 215.614C835.366 215.614 834.879 215.856 834.27 215.977C834.27 216.944 834.027 217.91 834.27 218.636C838.408 230.481 831.472 239.426 826.361 248.854C825.875 249.821 824.536 250.425 823.563 250.909C815.775 255.019 815.045 256.469 815.897 265.655C816.384 270.974 818.209 276.413 812.49 282.578C808.353 275.93 804.459 269.886 800.565 263.721C798.375 268.556 796.307 272.424 795.09 276.413C794.481 278.226 794.725 281.248 795.82 282.336C802.634 288.863 801.782 302.159 795.333 310.378C792.656 313.763 790.953 317.993 788.762 321.861C786.816 325.367 784.382 327.784 779.636 327.301C777.568 327.059 775.256 328.509 771.241 329.718C777.933 332.498 776.351 335.399 774.404 339.025C773.066 341.564 772.944 345.069 772.822 348.091C772.336 358.244 768.929 363.442 763.94 364.529C758.099 360.42 753.597 357.156 749.217 354.014C745.931 358.486 746.905 363.563 752.015 368.518C757.247 373.474 759.194 380.001 760.533 386.891C751.894 381.573 743.619 376.133 741.673 365.134C741.429 364.046 741.186 362.354 741.794 361.629C744.715 358.002 742.889 355.706 740.577 352.805C738.996 350.75 738.874 347.486 737.779 343.739C736.684 343.739 734.737 343.377 732.79 343.256C729.14 343.014 728.166 341.684 728.045 337.575C727.923 333.344 724.516 329.235 722.326 324.521C719.405 325.85 716.242 326.334 714.416 328.147C709.671 332.982 706.142 339.388 700.91 343.377C694.339 348.453 696.53 355.947 694.096 361.991C692.027 366.947 690.081 368.881 686.309 367.793C681.563 357.519 677.183 347.97 672.802 338.542C672.072 336.97 671.585 335.157 671.099 333.465C670.734 332.256 670.855 330.564 670.125 330.081C663.798 326.092 662.216 316.664 652.238 316.18C647.128 315.939 642.382 314.367 638.124 318.598C636.42 316.059 635.082 314.125 633.865 312.191C633.378 312.433 632.891 312.675 632.405 312.796C633.378 315.092 633.987 317.752 635.568 319.686C640.07 325.004 639.462 331.169 633.621 335.278C624.739 341.443 615.735 347.245 605.757 351.596C599.186 354.497 597.239 354.255 595.293 347.003C592.859 338.3 587.627 331.652 582.151 325.004C580.083 320.29 578.014 315.455 575.824 310.741C575.337 316.785 574.607 322.949 581.543 325.608C581.908 333.707 585.802 340.113 590.79 346.157C593.346 349.179 595.414 352.563 598.821 357.398C602.228 356.673 607.217 355.948 611.963 354.376C615.613 353.167 618.047 354.134 617.925 357.64C617.925 361.508 617.073 365.738 615.248 369.123C611.841 375.529 607.582 381.452 603.688 387.495C602.837 388.825 602.107 390.638 600.768 391.242C594.684 394.506 591.764 399.704 590.547 405.989C589.574 410.582 588.965 415.296 588.722 419.889C588.479 424.241 588.965 428.713 588.965 433.185C588.844 439.35 587.748 444.547 582.273 449.503C578.014 453.371 576.919 460.744 574.485 466.546C573.877 467.997 573.877 470.777 573.269 470.898C566.333 472.227 567.793 478.271 565.968 482.502C564.751 485.403 561.344 487.457 560.127 490.479C555.625 501.841 544.309 502.929 535.183 507.16C530.803 509.214 527.639 507.401 526.544 502.808C524.354 493.743 519.608 485.523 519.243 475.733C519 470.052 514.498 464.491 512.186 458.69C511.212 456.272 509.752 453.25 510.482 451.195C514.863 438.02 511.699 425.208 509.022 412.395C508.779 411.428 508.535 410.34 507.927 409.615C501.235 402.484 502.451 394.264 504.642 385.924C505.128 384.111 504.642 382.056 504.642 379.518C496.611 382.056 489.553 382.177 483.591 375.045C483.591 375.045 482.739 374.925 482.618 375.166C477.629 383.748 468.625 380.968 461.445 381.331C457.065 381.573 451.955 377.342 448.182 373.958C445.262 371.298 444.41 366.463 441.733 363.442C436.623 357.761 437.11 351.233 436.38 344.344C435.163 332.498 438.935 321.861 442.464 311.104C443.194 309.049 445.384 307.357 447.331 305.906C451.833 302.763 454.631 298.775 454.388 293.335C453.901 285.116 460.472 281.731 465.218 277.138C465.826 276.534 467.894 276.292 468.503 276.897C472.518 280.16 475.439 277.38 478.602 275.567C489.432 274.358 500.261 273.029 511.212 271.82C510.239 283.061 512.916 286.204 521.068 288.984C524.962 290.313 528.734 292.489 533.115 294.544C534.575 286.929 540.05 287.654 545.769 288.5C553.313 289.709 560.857 290.918 569.253 292.247C570.47 287.171 571.93 281.611 573.269 276.05C572.66 275.93 572.174 275.809 571.565 275.567C569.983 277.622 568.523 279.677 566.941 281.731C566.455 281.369 565.968 281.127 565.36 280.764C565.36 279.193 565.238 277.622 565.238 277.501C559.397 276.776 554.408 276.05 549.298 275.325C548.203 270.732 547.108 266.139 546.012 261.183C541.024 264.326 544.309 268.798 544.309 272.424C544.309 273.512 547.351 274.6 549.054 275.567V280.16C545.526 278.347 542.849 276.05 539.929 275.688C536.035 275.204 535.426 273.391 535.548 270.128C535.791 265.897 534.818 262.15 530.073 260.458C529.708 259.007 529.829 256.952 528.977 256.106C525.449 252.722 521.677 249.821 518.026 246.678C517.54 247.162 517.053 247.645 516.566 248.129C518.513 250.184 520.46 252.48 522.528 254.293C524.962 256.469 527.639 258.403 530.194 260.458C530.316 260.579 530.438 260.7 530.559 260.941C530.559 261.062 530.559 261.304 530.559 261.546C529.221 261.546 527.882 261.546 528.004 261.546C525.57 265.414 523.502 268.677 521.068 272.666C519.365 271.336 517.54 269.886 516.079 268.798C518.27 266.985 519.73 265.776 521.19 264.567C519.486 262.754 518.148 260.458 516.079 259.007C513.889 257.436 511.212 256.59 508.657 255.502C507.319 258.766 511.699 264.205 504.033 266.501C503.546 260.337 503.06 254.898 502.573 249.458C500.748 249.821 498.193 251.151 496.124 250.546C491.5 249.337 489.067 251.271 487.485 254.898C484.443 261.787 481.644 268.798 478.724 275.688C472.032 274.721 465.339 273.754 457.552 272.545V249.7C463.271 249.337 468.381 248.733 473.492 248.854C478.116 248.975 479.211 245.349 478.116 243.173C476.534 240.151 475.195 235.679 470.085 235.558C468.868 235.558 467.651 234.228 466.434 233.382C467.408 232.294 468.26 230.844 469.476 230.119C473.613 227.339 477.994 224.921 482.253 222.262L482.131 222.383V222.866ZM540.05 160.133C539.442 159.771 538.833 159.529 538.225 159.166C535.061 163.034 531.654 166.66 528.977 170.891C527.152 173.792 524.962 178.264 525.935 180.802C528.977 188.417 524.719 193.978 522.163 200.142C521.433 201.834 519 204.01 517.661 203.889C515.714 203.647 513.646 201.714 512.429 199.9C510.847 197.725 510.117 195.065 508.9 192.648C508.414 192.769 507.927 193.011 507.44 193.132C508.657 197.241 509.874 201.23 511.456 206.669C515.106 205.823 519.365 203.647 523.137 204.252C532.019 205.581 533.236 200.867 533.966 194.099C534.21 191.802 536.643 189.868 537.982 187.692C538.712 187.692 539.564 187.813 540.294 187.934C539.32 185.758 538.955 182.736 537.373 181.769C529.099 176.693 528.612 174.034 535.305 166.902C537.13 164.847 538.468 162.309 540.05 160.012V160.133ZM563.656 153.848C564.508 159.045 564.021 163.759 571.322 164.605C567.915 156.749 577.649 160.738 578.257 154.936C573.634 154.573 569.01 154.21 563.656 153.848ZM628.633 312.796C626.442 309.411 624.739 306.39 622.67 303.489C620.845 300.95 620.602 295.39 615.005 298.895C618.168 304.214 621.089 309.29 624.009 314.246C625.712 313.763 627.294 313.279 628.633 312.796ZM769.78 339.388C770.754 338.784 771.727 338.058 772.822 337.454C770.754 334.432 768.685 331.531 766.495 328.509C765.643 329.114 764.792 329.718 763.818 330.322C765.765 333.344 767.712 336.487 769.78 339.509V339.388Z" fill="#C08C5C"/>
<path d="M538.708 108.039C533.962 105.864 530.19 104.171 526.053 102.358C525.566 104.051 524.836 106.468 524.228 108.885C523.863 110.094 523.619 111.182 523.254 112.391C519.239 111.182 514.98 110.215 511.208 108.523C510.356 108.16 510.356 104.776 510.965 103.204C511.695 101.27 513.52 99.82 514.25 96.919C511.208 98.4904 508.166 100.183 506.463 101.029C503.907 97.2817 501.596 94.5016 500.014 91.3589C499.284 89.7875 499.284 87.2492 500.135 85.7987C500.987 84.4691 503.542 83.2604 505.003 83.623C507.558 84.2274 509.87 86.0405 511.695 86.8866C513.033 85.4361 514.494 83.9856 515.954 82.5352C517.414 84.2274 518.874 85.9196 520.456 87.4909C521.673 88.6997 523.011 90.271 524.471 90.6336C533.841 93.2929 538.951 98.4904 538.708 107.918V108.039Z" fill="currentColor"/>
<path d="M482.257 222.759C476.295 223.242 470.333 223.605 464.492 224.088C464.492 223.726 464.249 223.363 464.127 223.121C465.587 222.154 467.169 221.308 469.116 219.979C464.249 213.935 468.872 210.43 473.375 207.045C467.047 202.935 465.709 198.1 468.994 189.519C469.846 187.222 473.983 186.255 476.538 184.684C476.903 185.288 477.39 185.771 477.755 186.376C477.025 187.826 476.173 189.398 475.686 190.486C478.972 197.617 482.135 204.749 485.421 212.122C484.569 215.144 483.352 219.132 482.257 223L482.379 222.879L482.257 222.759Z" fill="currentColor"/>
<path d="M638.252 107.563C635.94 109.376 633.749 111.552 631.316 112.881C627.179 115.178 622.798 116.87 618.54 118.804C617.809 119.167 617.201 119.771 616.471 120.134C610.549 123.599 609.535 128.353 613.429 134.397C613.916 135.122 614.159 135.847 614.524 136.451C610.265 140.561 607.467 139.836 600.166 132.342C603.208 126.419 605.642 120.013 609.535 114.694C611.482 112.035 616.106 110.947 619.635 109.739C625.354 107.805 631.194 106.233 636.913 104.541C637.278 105.508 637.765 106.475 638.13 107.442L638.252 107.563Z" fill="currentColor"/>
<path d="M428.719 152.286C434.073 153.253 439.305 154.341 445.997 155.55C445.146 154.583 445.632 154.825 445.632 155.187C446.484 158.934 450.865 162.923 446.484 166.549C444.416 168.241 440.522 167.758 437.358 168.241C434.194 168.725 431.152 169.571 429.206 165.703C428.719 164.615 426.529 164.494 424.704 163.769C425.312 162.198 425.92 160.868 426.65 159.176C425.677 158.934 424.46 158.572 423 158.209C425.19 155.429 427.015 153.132 428.841 150.715C428.841 151.198 428.719 151.803 428.597 152.286H428.719Z" fill="currentColor"/>
<path d="M523.994 80C533.972 80.8461 543.828 81.5713 554.292 82.4175C552.589 88.582 548.817 90.1533 543.828 90.1533C532.998 90.1533 524.968 86.2854 523.994 80Z" fill="currentColor"/>
<path d="M683.515 94.2616C681.325 88.2179 684.245 86.1631 689.356 86.1631C692.519 86.1631 695.805 86.5257 698.725 87.6136C700.428 88.2179 701.524 90.3936 702.862 91.965C700.915 93.0528 698.968 94.9868 697.021 95.1077C692.641 95.3494 688.261 94.6242 683.393 94.3825L683.515 94.2616Z" fill="currentColor"/>
<path d="M792.666 107.199C798.872 108.166 805.564 101.639 810.431 111.188C808.241 112.517 805.077 116.023 802.887 115.539C798.993 114.693 792.423 115.418 792.788 107.199H792.666Z" fill="currentColor"/>
<path d="M464.867 203.526V214.163C461.946 214.768 458.904 215.372 455.984 215.976C453.307 206.548 455.497 203.526 464.867 203.526Z" fill="currentColor"/>
<path d="M620 87.9763C615.984 88.3389 612.699 88.5806 609.535 88.8224C610.265 87.1301 610.509 84.9544 611.725 83.9874C614.767 81.8117 617.688 82.1744 620 87.9763Z" fill="currentColor"/>
<path d="M697.265 361.398C699.577 364.783 704.079 366.596 700.185 370.706C699.212 371.673 697.63 371.914 696.292 372.519C695.927 371.189 695.197 369.739 695.318 368.409C695.562 366.354 696.413 364.42 697.265 361.398Z" fill="currentColor"/>
</mask>
<g mask="url(#mask0_505_506)">
<path d="M432.98 144.999L472.756 166.275L515.593 138.92L494.175 78.1309H567.608L564.548 135.881L647.161 87.2492L641.042 148.038L653.281 193.63V214.907L659.4 236.183L656.34 251.38L670.109 257.459L628.803 278.735L577.5 272.656L567.608 281.775H549.25L533.951 272.656L520 275.5L509 267.5L494.175 272.656L475.816 275.696L454.398 278.735L423.801 
154.117L432.98 144.999Z" fill="currentColor"/>
</g>
</svg>`;
  } else if (continente_detetado === "Arctic") {
    novoConteudoSVG = `<svg width="100%" viewBox="0 0 1024 642" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M484.813 222.944C487.102 220.777 490.716 219.091 491.439 216.441C493.367 209.577 498.909 208.975 502.885 208.132C503.849 203.676 504.571 200.183 505.415 195.968C505.174 195.968 504.09 195.246 502.764 195.246C499.27 195.005 497.584 193.439 498.065 189.826C498.668 184.407 493.969 178.747 498.186 173.689C501.559 169.715 505.776 166.463 509.391 162.609C511.439 160.442 513.607 158.154 514.451 155.504C517.222 147.315 524.692 144.063 530.595 139.126C532.764 137.319 535.896 136.597 538.306 134.911C544.33 130.575 551.438 131.779 556.86 136.717C560.836 140.21 566.137 142.498 571.197 144.425C576.619 146.472 581.438 148.278 581.317 155.384C587.944 154.42 586.137 148.88 587.582 145.027H593.486C593.727 147.194 594.088 149.121 594.45 152.493C602.763 143.822 612.763 142.739 623.365 143.461C623.606 142.859 623.726 142.257 623.967 141.655C621.919 141.053 619.871 140.33 617.702 139.728C618.425 138.764 619.028 137.801 619.751 136.838C621.919 137.199 624.329 137.078 626.377 137.921C631.196 139.848 634.931 139.005 637.943 134.79C638.907 133.466 640.112 132.382 641.196 131.177C645.292 126.44 649.268 126.44 653.124 131.177C654.569 129.973 655.895 128.648 657.822 127.083C658.545 129.612 659.148 131.539 659.75 133.466C660.232 133.466 660.593 133.586 661.075 133.706C661.557 131.9 661.919 129.973 662.401 127.805C663.967 127.805 665.654 127.564 667.461 127.444C667.702 125.878 668.063 124.433 668.304 122.988C668.666 123.47 669.027 124.072 669.389 124.554C678.304 117.569 687.942 112.029 700.231 109.621C700.352 109.621 701.677 110.945 703.966 112.993C706.617 109.5 708.665 106.008 711.436 103.117C712.641 101.913 716.617 101.19 717.099 101.793C720.352 106.369 724.93 105.887 729.026 104.924C734.448 103.479 737.098 107.091 739.147 110.343C740.351 112.27 739.388 115.522 739.388 119.255C747.58 120.7 757.821 120.459 765.893 124.433C778.062 130.455 789.989 125.517 801.917 127.444C803.122 122.627 805.531 121.302 810.591 122.386C821.314 124.674 829.989 131.418 840.35 135.031C843.362 130.936 847.94 129.973 850.47 134.309C855.41 142.739 862.518 139.005 869.024 139.126C869.627 139.126 870.109 138.644 870.711 138.524C871.073 138.524 871.434 138.524 872.036 138.524C873.241 140.089 874.566 141.655 876.976 144.545C876.615 141.053 876.494 139.126 876.133 135.272C883.362 137.319 889.627 139.126 895.892 140.932C898.301 141.655 900.831 142.136 903 143.22C908.542 145.99 913.964 149.001 919.385 151.891C919.988 152.252 920.349 152.975 920.951 153.216C926.654 155.464 929.024 160.361 928.06 167.908C925.409 166.584 922.879 165.861 921.072 164.295C915.771 160.08 915.048 160.08 910.711 166.102C912.518 168.27 914.325 170.558 916.614 173.328C912.879 174.532 909.867 175.616 906.614 176.338C902.759 177.302 898.663 177.543 897.699 182.721C897.578 183.444 894.687 183.805 893.12 184.046C889.988 184.407 886.494 183.805 883.723 184.889C879.024 186.936 879.506 192.596 884.687 196.57C881.072 204.157 877.338 211.865 873.603 219.572C872.88 219.572 872.157 219.332 871.314 219.332C870.229 217.405 869.145 215.478 868.181 213.431C866.976 210.781 865.53 208.132 864.808 205.362C864.085 202.833 863.241 199.822 864.085 197.534C866.494 191.031 869.627 184.889 872.398 178.626C871.916 178.145 871.434 177.663 870.952 177.302C870.109 178.867 869.145 180.433 868.542 181.517C866.374 180.794 863.241 179.59 863.121 179.951C861.555 182.962 860.47 186.214 859.145 189.345C859.506 190.067 859.747 190.79 860.109 191.512C853.121 190.429 846.013 189.465 839.025 188.14C830.23 186.334 827.097 188.14 824.447 196.57C823.844 198.497 821.917 200.063 820.953 201.99C820.35 203.074 819.868 205.241 820.35 205.603C821.435 206.446 823.121 206.687 824.567 206.687C827.097 206.446 829.627 205.844 832.157 205.482C832.278 205.964 832.398 206.446 832.519 207.048C833.362 205.844 834.206 204.639 836.133 201.749C837.218 205.603 837.579 207.891 838.422 210.059C839.989 213.792 841.796 217.405 843.483 221.138C844.687 223.547 846.374 225.835 847.097 228.364C847.338 229.086 845.049 230.532 843.242 232.579C843.242 232.94 843.362 234.867 843.603 237.276C838.422 234.987 838.061 230.893 837.579 226.678C837.097 222.944 836.013 219.332 835.169 215.719C834.567 215.719 834.085 215.96 833.483 216.08C833.483 217.043 833.242 218.007 833.483 218.729C837.579 230.532 830.712 239.443 825.652 248.837C825.17 249.8 823.844 250.402 822.88 250.884C815.17 254.979 814.447 256.424 815.29 265.576C815.772 270.875 817.579 276.295 811.917 282.437C807.82 275.813 803.965 269.791 800.11 263.65C797.941 268.467 795.893 272.32 794.688 276.295C794.086 278.101 794.327 281.112 795.411 282.196C802.158 288.699 801.314 301.946 794.929 310.135C792.278 313.507 790.592 317.722 788.423 321.576C786.495 325.068 784.086 327.477 779.387 326.995C777.339 326.754 775.05 328.2 771.074 329.404C777.7 332.174 776.134 335.064 774.206 338.677C772.881 341.206 772.761 344.698 772.64 347.709C772.158 357.825 768.785 363.004 763.845 364.088C758.062 359.993 753.604 356.741 749.267 353.61C746.014 358.066 746.978 363.124 752.038 368.062C757.219 372.999 759.146 379.503 760.472 386.367C751.918 381.068 743.725 375.649 741.797 364.69C741.556 363.606 741.315 361.92 741.918 361.197C744.809 357.584 743.002 355.296 740.713 352.406C739.147 350.359 739.026 347.107 737.942 343.374C736.858 343.374 734.93 343.012 733.002 342.892C729.388 342.651 728.424 341.326 728.303 337.232C728.183 333.017 724.809 328.922 722.641 324.225C719.749 325.55 716.617 326.032 714.81 327.838C710.111 332.656 706.617 339.038 701.436 343.012C694.93 348.07 697.099 355.537 694.689 361.559C692.641 366.496 690.714 368.423 686.979 367.339C682.28 357.103 677.943 347.589 673.605 338.195C672.882 336.63 672.401 334.823 671.919 333.137C671.557 331.933 671.678 330.247 670.955 329.765C664.69 325.791 663.124 316.398 653.244 315.916C648.184 315.675 643.485 314.109 639.268 318.324C637.582 315.795 636.256 313.869 635.052 311.942C634.57 312.183 634.088 312.423 633.606 312.544C634.57 314.832 635.172 317.481 636.738 319.408C641.196 324.707 640.594 330.849 634.811 334.944C626.016 341.086 617.1 346.866 607.221 351.202C600.715 354.092 598.787 353.851 596.859 346.625C594.45 337.954 589.269 331.331 583.847 324.707C581.799 320.01 579.751 315.193 577.582 310.497C577.101 316.518 576.378 322.66 583.245 325.309C583.607 333.378 587.462 339.761 592.402 345.782C594.932 348.793 596.98 352.165 600.353 356.982C603.727 356.26 608.666 355.537 613.365 353.972C616.98 352.767 619.389 353.731 619.269 357.223C619.269 361.077 618.425 365.292 616.618 368.664C613.245 375.047 609.028 380.948 605.173 386.969C604.329 388.294 603.606 390.1 602.281 390.702C596.257 393.954 593.365 399.132 592.161 405.395C591.197 409.971 590.594 414.668 590.353 419.244C590.112 423.58 590.594 428.035 590.594 432.491C590.474 438.633 589.39 443.812 583.968 448.749C579.751 452.603 578.667 459.949 576.257 465.73C575.655 467.175 575.655 469.945 575.052 470.065C568.185 471.39 569.631 477.412 567.824 481.627C566.619 484.517 563.245 486.564 562.041 489.575C557.583 500.895 546.378 501.979 537.342 506.194C533.005 508.241 529.872 506.435 528.788 501.859C526.619 492.826 521.921 484.637 521.559 474.882C521.318 469.222 516.86 463.683 514.571 457.902C513.607 455.493 512.162 452.483 512.885 450.435C517.222 437.309 514.089 424.543 511.439 411.778C511.198 410.814 510.957 409.73 510.354 409.008C503.728 401.902 504.933 393.713 507.102 385.404C507.583 383.597 507.102 381.55 507.102 379.021C499.15 381.55 492.162 381.67 486.258 374.565C486.258 374.565 485.415 374.444 485.295 374.685C480.355 383.236 471.439 380.466 464.331 380.827C459.994 381.068 454.934 376.853 451.199 373.481C448.307 370.832 447.464 366.014 444.813 363.004C439.753 357.344 440.235 350.84 439.512 343.976C438.307 332.174 442.042 321.576 445.536 310.858C446.259 308.811 448.428 307.125 450.355 305.679C454.813 302.548 457.584 298.574 457.343 293.155C456.861 284.966 463.367 281.594 468.066 277.017C468.668 276.415 470.716 276.174 471.319 276.776C475.295 280.028 478.186 277.258 481.319 275.452C492.041 274.247 502.764 272.923 513.607 271.718C512.644 282.918 515.294 286.049 523.366 288.819C527.222 290.144 530.957 292.312 535.294 294.359C536.74 286.772 542.161 287.495 547.824 288.338C555.294 289.542 562.763 290.746 571.077 292.071C572.281 287.013 573.727 281.473 575.052 275.933C574.45 275.813 573.968 275.692 573.366 275.452C571.799 277.499 570.354 279.546 568.787 281.594C568.306 281.232 567.824 280.991 567.221 280.63C567.221 279.065 567.101 277.499 567.101 277.378C561.318 276.656 556.378 275.933 551.318 275.211C550.233 270.634 549.149 266.058 548.065 261.121C543.125 264.252 546.378 268.708 546.378 272.32C546.378 273.404 549.39 274.488 551.077 275.452V280.028C547.583 278.221 544.932 275.933 542.041 275.572C538.185 275.09 537.583 273.284 537.704 270.032C537.945 265.817 536.981 262.084 532.282 260.398C531.92 258.953 532.041 256.906 531.198 256.063C527.704 252.69 523.969 249.8 520.354 246.669C519.872 247.151 519.391 247.632 518.909 248.114C520.836 250.161 522.764 252.45 524.812 254.256C527.222 256.424 529.872 258.351 532.402 260.398C532.523 260.518 532.643 260.639 532.764 260.88C532.764 261 532.764 261.241 532.764 261.482C531.439 261.482 530.113 261.482 530.234 261.482C527.824 265.336 525.776 268.587 523.366 272.561C521.68 271.237 519.872 269.791 518.427 268.708C520.595 266.901 522.041 265.697 523.487 264.493C521.8 262.686 520.475 260.398 518.427 258.953C516.258 257.387 513.607 256.544 511.077 255.46C509.752 258.712 514.089 264.131 506.499 266.419C506.017 260.278 505.535 254.858 505.053 249.439C503.246 249.8 500.716 251.125 498.668 250.523C494.09 249.318 491.68 251.245 490.114 254.858C487.102 261.723 484.331 268.708 481.439 275.572C474.813 274.609 468.186 273.645 460.476 272.441V249.68C466.138 249.318 471.198 248.716 476.259 248.837C480.837 248.957 481.921 245.344 480.837 243.177C479.271 240.166 477.945 235.71 472.885 235.59C471.68 235.59 470.475 234.265 469.271 233.422C470.235 232.338 471.078 230.893 472.283 230.17C476.379 227.4 480.716 224.992 484.933 222.342L484.813 222.463V222.944ZM542.161 160.442C541.559 160.08 540.956 159.84 540.354 159.478C537.222 163.332 533.848 166.945 531.198 171.16C529.39 174.05 527.222 178.506 528.186 181.035C531.198 188.622 526.981 194.162 524.451 200.304C523.728 201.99 521.318 204.157 519.993 204.037C518.065 203.796 516.017 201.869 514.812 200.063C513.246 197.895 512.523 195.246 511.318 192.837C510.836 192.958 510.354 193.198 509.873 193.319C511.077 197.413 512.282 201.388 513.848 206.807C517.463 205.964 521.68 203.796 525.415 204.398C534.21 205.723 535.414 201.026 536.137 194.282C536.378 191.994 538.788 190.067 540.113 187.9C540.836 187.9 541.679 188.02 542.402 188.14C541.438 185.973 541.077 182.962 539.511 181.999C531.318 176.94 530.836 174.291 537.463 167.186C539.27 165.138 540.595 162.609 542.161 160.321V160.442ZM565.534 154.179C566.378 159.358 565.896 164.055 573.125 164.898C569.751 157.07 579.39 161.044 579.992 155.263C575.414 154.902 570.836 154.541 565.534 154.179ZM629.871 312.544C627.702 309.172 626.016 306.161 623.967 303.271C622.16 300.742 621.919 295.202 616.377 298.694C619.51 303.993 622.401 309.051 625.293 313.989C626.979 313.507 628.546 313.026 629.871 312.544ZM769.628 339.038C770.592 338.436 771.556 337.714 772.64 337.111C770.592 334.101 768.544 331.21 766.375 328.2C765.532 328.802 764.688 329.404 763.725 330.006C765.652 333.017 767.58 336.148 769.628 339.159V339.038Z" fill="white"/>
<path d="M286.869 119.738C287.471 121.183 288.194 122.629 288.917 124.194C292.411 123.472 296.628 120.461 298.796 126.362C306.628 123.833 311.688 131.059 318.314 132.143C324.7 133.226 328.555 139.248 325.302 144.426C329.158 146.955 334.459 148.641 336.266 152.134C337.591 154.783 334.579 159.721 333.374 164.056C330.121 162.129 327.832 160.684 325.423 159.36C330.724 165.742 326.507 171.884 325.182 179.592C321.567 177.304 317.832 175.618 314.941 173.089C311.085 169.716 307.471 166.706 301.688 167.308C300.001 167.428 298.074 165.622 296.146 164.658C297.351 162.972 298.435 161.046 300.001 159.6C300.965 158.637 302.772 158.637 303.736 157.674C306.146 155.506 310.483 152.134 310.001 150.93C308.676 147.678 305.664 144.426 302.531 142.981C299.037 141.295 294.58 141.416 292.17 141.054C291.688 146.233 293.013 152.616 290.483 155.626C287.592 158.998 281.086 159.119 277.833 160.203C269.52 169.837 262.05 178.387 254.58 186.817C261.086 195.368 267.351 202.714 279.279 201.871C280.483 205.725 281.688 209.94 283.375 215.48C285.182 210.301 286.507 206.568 287.833 202.714C286.869 201.871 285.905 201.028 283.857 199.222H290.724C291.568 191.755 292.652 184.409 293.013 177.063C293.254 172.005 296.266 171.402 299.76 172.366C303.254 173.209 306.387 175.256 309.76 176.581C310.965 177.063 312.411 177.183 314.097 177.544C314.338 181.157 314.459 184.891 314.7 188.985H322.411C322.772 187.42 323.133 185.734 323.495 184.048C324.218 184.048 325.182 184.048 325.302 184.288C327.471 188.985 330.483 193.561 331.447 198.62C332.41 203.678 336.266 209.338 342.531 210.181C342.531 213.553 342.772 217.166 342.531 220.658C342.169 225.114 343.495 228.486 346.748 231.978C348.555 233.905 348.314 237.639 349.398 242.456C344.459 240.408 341.206 239.084 337.953 237.759C338.073 237.277 338.314 236.796 338.435 236.193C336.145 236.555 333.856 237.036 329.88 237.639C333.856 231.497 337.109 226.559 341.206 220.297C335.302 222.585 330.965 224.391 326.868 225.957C326.146 227.643 325.543 229.57 324.459 231.256C323.254 233.062 321.567 234.507 320.001 236.073C321.688 237.277 323.495 238.482 325.182 239.565C325.664 239.927 326.266 240.047 328.435 240.77C324.097 243.299 320.603 245.346 316.146 247.875C316.507 245.828 316.748 244.985 317.109 242.937C311.447 245.346 306.387 247.514 300.965 249.922C302.411 252.692 303.254 254.378 304.58 256.907C294.339 258.593 290.845 265.578 288.917 273.888C287.833 275.694 286.989 277.742 285.785 279.428C284.7 280.873 283.375 282.197 282.05 283.402C278.797 286.412 274.821 289.062 272.17 292.554C270.966 294.12 272.17 297.612 272.17 300.141C272.17 300.503 272.893 300.744 272.893 301.105C272.893 307.006 272.291 313.268 280.483 316.158C279.881 316.64 279.158 317.242 278.556 317.724C277.231 317.122 275.905 316.761 274.7 316.038C273.616 315.436 272.652 314.713 271.929 313.75C269.761 311.221 267.592 308.692 265.664 305.922C264.46 304.356 263.978 300.984 262.773 300.864C259.158 300.382 255.424 300.864 251.809 301.225C250.002 301.466 247.713 303.273 246.749 302.55C239.761 297.974 234.219 301.346 228.075 305.44C228.075 310.98 227.954 316.761 228.075 322.541C228.075 325.07 228.315 327.961 229.52 330.008C230.605 331.694 233.255 333.139 235.303 333.259C236.508 333.259 238.074 330.73 239.159 329.044C239.882 327.961 240.123 326.395 240.604 324.829H252.893C251.93 329.647 250.966 334.223 249.881 339.522C251.327 339.883 253.134 340.485 254.942 340.726C262.532 341.93 263.616 343.496 262.532 351.203C262.17 353.612 261.929 356.021 261.809 358.429C261.809 359.633 262.05 360.717 262.291 361.801C266.387 364.21 272.05 351.083 274.941 363.246C274.459 363.848 273.857 364.451 273.375 365.053C271.206 366.859 268.917 368.666 265.544 371.556C260.484 366.859 255.062 361.681 249.641 356.623C248.556 355.539 247.351 354.214 246.026 353.853C241.327 352.649 236.749 351.806 235.183 346.145C234.942 345.543 233.255 345.182 232.171 344.941C224.942 343.014 217.231 342.051 210.605 338.799C207.472 337.354 205.063 331.694 204.822 327.84C204.46 321.578 201.93 317.363 197.473 313.509C196.027 312.305 195.183 310.498 193.256 308.09C194.099 312.184 194.822 315.075 195.545 318.567C190.967 318.567 188.798 317.001 186.629 313.629C181.69 306.042 179.16 297.853 176.629 289.423C176.148 287.978 175.184 286.292 173.979 285.449C167.834 281.234 166.027 275.333 166.63 268.348C167.352 259.316 168.316 250.284 169.039 241.251C169.28 238 169.16 234.748 168.798 231.497C167.714 223.428 166.389 215.359 165.304 207.772C164.943 208.856 164.22 210.422 163.618 212.108C163.136 212.348 162.533 212.589 162.051 212.83C163.377 198.138 148.558 197.897 142.654 189.587C141.57 188.142 136.028 189.949 133.016 190.31C132.534 195.368 133.618 201.269 131.329 202.955C126.871 206.447 120.606 207.772 115.064 210.06C114.823 209.579 114.582 208.976 114.341 208.495L118.196 200.908C117.594 200.426 117.112 199.944 116.51 199.583C109.401 206.688 103.016 214.516 95.0643 220.417C89.1607 224.873 81.9319 228.366 73.8597 227.402C73.4983 226.92 73.1368 226.318 72.7754 225.837C76.6308 222.946 80.6066 220.176 84.3415 217.166C90.0041 212.348 95.4257 207.17 101.329 201.992C95.6667 198.499 95.5462 198.499 90.3655 203.075C88.1969 200.306 86.0282 197.536 83.9801 194.766C83.7391 195.007 83.3777 195.368 83.1367 195.609C82.5343 193.441 82.4138 190.912 81.209 189.106C77.4741 183.445 78.438 178.267 84.7029 175.738C88.9198 174.052 93.6185 173.45 97.9558 172.005C100.124 171.282 102.052 170.078 103.859 167.91H91.4498C87.8354 163.815 84.9439 160.684 81.5705 156.951C88.5583 155.265 95.1847 150.207 104.341 152.736C105.064 152.134 106.751 150.689 108.317 149.364C105.426 147.798 102.414 146.594 99.763 144.788C98.6787 144.065 97.8353 141.897 98.0763 140.693C98.3172 139.73 100.365 138.887 101.691 138.525C107.956 136.96 114.1 135.635 120.365 134.19C121.329 133.949 122.413 133.467 123.257 133.588C134.823 135.876 146.268 138.284 157.834 140.573C161.449 141.295 165.184 141.777 168.678 141.416C175.184 140.813 181.569 139.489 188.798 138.405C188.918 138.766 189.521 140.332 190.244 142.74C192.653 141.175 194.822 139.85 197.111 138.405C196.991 138.887 196.87 139.248 196.629 139.73C206.629 142.74 216.749 145.751 226.749 149.003C228.797 149.605 230.605 151.05 232.412 152.134C234.701 147.678 230.966 143.945 224.46 143.463C220.002 143.102 215.665 140.693 211.328 139.127C211.93 137.562 212.533 135.996 213.255 134.069C208.798 131.179 202.894 131.42 196.629 134.19C195.545 130.938 193.376 128.048 194.099 125.88C195.424 121.665 198.075 117.691 200.725 114.078C202.292 111.79 214.099 113.837 218.436 116.487C220.123 115.282 221.81 114.319 223.135 113.115C224.34 111.91 225.303 110.465 226.508 108.9C230.123 109.381 234.099 109.863 236.508 110.104C238.918 107.093 240.604 104.926 242.291 102.758C243.376 104.805 244.58 106.852 246.147 109.743C250.363 108.057 255.424 106.13 261.929 103.601V113.837C258.797 113.596 255.544 113.476 252.412 113.235C251.327 113.235 250.243 112.392 249.279 112.753C241.809 115.162 234.339 117.811 226.629 120.461C228.918 121.545 231.448 122.629 234.58 124.194C241.207 116.728 250.363 117.932 259.761 118.534C260.363 121.665 260.966 124.435 261.568 127.566C257.11 130.577 252.653 133.588 248.074 136.719V142.981C244.58 142.62 241.327 142.259 237.713 141.897C242.291 147.919 243.135 148.039 256.749 143.824C257.472 145.51 258.315 147.196 259.038 148.882C259.64 148.882 260.122 148.882 260.725 148.882C260.725 145.269 260.725 141.777 260.725 138.164C260.725 135.996 261.086 133.829 261.207 131.781C263.014 132.022 265.062 131.781 266.628 132.504C268.435 133.467 270.002 135.153 271.447 136.598C272.773 137.923 273.857 139.489 275.544 140.813C273.255 133.347 275.423 127.085 280.483 121.906C281.809 120.581 284.58 120.581 286.628 119.859H286.387L286.869 119.738Z" fill="white"/>
<path d="M273.256 365.179C273.738 364.577 274.341 363.974 274.823 363.372C279.642 359.037 284.461 354.701 289.521 350.125C291.328 351.691 292.895 352.895 294.702 354.46C295.907 353.497 297.112 352.413 298.557 351.209C300.124 352.895 301.328 354.581 302.895 355.665C305.304 357.351 307.593 358.555 311.087 359.157C317.232 360.241 324.822 361.807 327.955 369.514C329.4 373.247 331.569 375.776 336.629 374.933C342.292 374.09 347.111 379.269 347.713 385.893C347.834 387.819 347.713 389.867 347.713 393.118C355.665 395.166 363.978 397.092 372.171 399.381C374.821 400.103 377.11 402.03 379.641 403.114C381.207 403.836 383.014 403.836 384.46 404.559C385.906 405.282 387.833 406.365 388.436 407.69C391.689 416.12 388.074 423.707 384.339 431.053C382.894 433.944 380.002 436.232 378.315 439.122C376.99 441.29 376.267 443.819 375.785 446.348C374.942 451.406 374.46 456.464 373.858 461.643C373.376 465.858 371.207 468.025 366.87 469.23C360.243 471.036 357.352 475.492 356.99 482.356C356.99 483.199 357.231 484.163 356.87 484.765C354.099 489.221 350.605 493.315 348.436 498.012C345.665 503.793 341.328 505.358 335.665 504.395C335.424 505.358 335.063 505.72 335.183 506.081C337.954 516.558 337.232 516.679 326.75 521.014C323.376 522.459 321.328 527.879 319.4 531.853C318.316 534.02 319.159 537.031 318.437 539.44C317.232 543.173 313.738 546.545 318.437 550.399C319.039 550.881 318.437 554.253 317.473 555.216C307.352 564.61 310.123 570.511 320.605 577.977C314.702 582.433 304.461 579.784 300.846 573.642C293.859 561.96 293.015 548.954 292.172 535.827C292.051 533.057 291.569 530.287 291.328 527.276C293.015 525.229 294.822 522.7 297.714 519.087H290.003C291.569 510.778 293.136 502.829 294.702 494.881C295.184 492.593 296.148 490.425 296.148 488.137C296.148 479.948 296.509 471.638 295.907 463.449C295.425 457.066 293.618 451.286 287.714 447.191C283.136 444.06 277.473 440.688 278.919 433.221C279.039 432.499 277.112 431.535 276.148 430.572C274.22 428.645 271.811 426.959 270.485 424.55C268.437 420.576 267.714 416.482 274.702 414.916C272.052 413.23 270.003 412.026 268.799 411.183C262.895 394.804 274.943 380.834 273.377 365.299L273.256 365.179Z" fill="white"/>
<path d="M383.5 79.1561C383.138 68.5583 383.138 68.6788 392.897 68.197C403.62 67.7153 414.222 66.511 424.945 66.6315C431.812 66.6315 438.68 68.7992 445.547 69.8831C445.547 70.8465 445.668 71.6895 445.788 72.6529C442.053 74.5798 438.439 76.5067 434.704 78.554C434.945 79.0357 435.186 79.5174 435.306 79.9991C436.752 79.6378 438.198 79.397 439.523 78.9152C443.86 77.3497 447.957 76.1454 451.451 80.6013C452.053 81.3238 453.258 81.4443 453.981 82.0464C455.306 83.0098 456.511 84.2141 457.836 85.298C456.39 85.9001 454.945 86.7431 453.378 87.2249C449.643 88.3087 445.788 89.2722 441.812 90.356C442.535 93.3668 443.017 95.1732 443.378 96.6183C441.571 97.8226 440.005 98.7861 438.318 99.9904C441.089 102.038 443.258 103.603 446.511 106.132C442.053 106.975 439.162 107.577 435.909 108.3C436.391 111.311 437.234 114.081 437.234 116.85C437.234 119.379 437.354 123.113 435.909 124.197C432.535 126.726 432.174 129.375 433.62 133.47C431.692 132.988 430.367 132.627 428.439 132.145C429.764 134.072 430.848 135.517 431.933 136.962C431.692 137.564 431.451 138.287 431.21 138.889C426.27 137.323 421.21 135.758 416.27 134.192C416.029 134.915 415.788 135.517 415.668 136.24C418.559 137.444 421.451 138.648 425.306 140.214C422.415 142.863 419.644 145.994 416.391 148.162C410.969 151.895 405.307 155.267 399.524 158.399C397.355 159.603 394.584 160.085 392.174 159.964C386.994 159.603 386.271 163.216 384.945 166.708C382.174 173.693 379.283 180.678 376.994 186.218C371.813 184.773 367.958 184.05 364.464 182.725C362.898 182.123 360.97 180.558 360.608 179.112C359.645 175.861 359.886 172.368 359.163 169.117C358.199 164.3 356.874 159.723 355.307 153.1C357.115 151.052 360.367 147.44 363.982 143.345C361.09 141.659 357.837 139.732 353.139 136.962C356.151 136.36 357.837 136.36 358.922 135.637C359.886 135.035 360.488 133.711 360.127 131.904C358.199 132.747 356.151 133.59 354.103 134.554C353.38 128.05 352.657 122.27 352.054 116.73C347.597 115.164 343.5 113.719 339.404 112.395C338.561 112.154 337.476 112.395 336.633 112.635C330.97 114.562 327.115 112.756 324.344 106.253C329.043 105.771 333.5 105.41 337.958 105.048C337.958 104.567 337.958 104.205 337.958 103.724C332.055 103.483 326.272 103.122 320.368 102.881C320.127 102.038 319.886 101.195 319.766 100.352C326.392 98.0635 333.139 95.7753 340.97 93.0055C338.32 91.3195 336.874 90.4765 335.428 89.513C350.729 81.3238 366.03 74.5798 383.741 79.2765L383.5 79.1561ZM416.15 76.5067C425.708 78.6744 431.13 78.3532 432.415 75.5432C426.873 75.9045 421.451 76.2658 416.15 76.5067Z" fill="white"/>
<path d="M823.853 427.917C831.804 430.446 839.876 426.713 846.744 431.891C842.647 435.665 844.535 439.88 852.406 444.536C858.189 439.117 853.009 431.289 856.382 425.268C863.25 424.424 859.997 430.807 861.804 433.457C863.972 436.588 865.418 440.08 867.105 443.452C868.792 446.945 870.84 450.437 871.924 454.05C873.008 457.663 873.008 461.517 873.611 465.852C878.069 463.925 879.273 466.093 880.117 470.067C881.804 477.895 884.093 485.723 879.996 493.43C877.105 498.85 873.972 504.269 870.599 509.448C863.852 519.925 858.069 521.972 846.141 519.202C838.19 517.396 837.828 516.914 838.19 508.484C832.768 508.243 829.395 505.353 826.744 500.295C824.334 495.598 814.094 495.719 806.865 499.091C800.479 502.101 793.853 504.51 787.347 506.798C783.733 508.123 779.154 504.39 779.998 500.897C782.287 491.383 778.19 482.471 777.347 473.198C776.986 468.863 777.106 466.575 781.564 466.213C786.504 465.732 788.431 462.721 789.154 458.386C789.877 454.411 791.202 451.16 796.624 454.411C795.66 447.427 799.997 446.222 804.696 446.824C808.551 447.306 810.118 445.981 810.118 442.609C810.118 437.551 813.25 435.624 817.467 434.781C821.081 434.059 825.057 433.818 823.732 427.676L823.853 427.917Z" fill="white"/>
<path d="M287.109 119.861C283.133 118.295 279.157 116.97 275.181 115.164C273.976 114.682 273.253 113.237 272.289 112.274C272.53 111.671 272.892 111.19 273.133 110.588C276.024 111.19 279.036 111.792 281.928 112.394C284.94 112.996 287.952 113.598 291.084 114.08C291.325 113.357 291.446 112.635 291.687 111.912C289.518 111.19 287.35 110.106 285.06 109.745C282.771 109.383 280.362 109.745 277.711 109.745C278.675 103.844 281.566 101.796 287.229 102.88C286.265 102.037 285.301 101.194 283.735 99.8694C286.386 97.8221 289.157 95.6544 292.53 93.1254C286.024 91.9211 283.735 96.377 281.205 100.592C276.988 100.592 273.735 99.6286 274.458 94.2092C274.458 93.4867 274.217 92.4028 273.735 92.0415C267.229 86.7426 276.024 84.9362 276.145 81.2029C278.675 82.2867 281.205 83.2502 283.494 84.6953C284.94 85.5383 286.145 86.9835 288.313 87.4652C287.831 86.6222 287.47 85.6588 286.747 84.9362C281.446 79.6373 281.807 76.6266 289.398 75.7836C303.012 74.3384 316.867 74.0976 330.602 73.6158C336.867 73.375 343.132 73.6158 350.12 73.6158C348.313 82.5276 341.084 79.0352 336.626 81.6846V86.3813C330 89.7534 323.373 92.4028 317.711 96.377C314.458 98.6651 312.771 103.241 310.241 106.613C308.072 109.504 305.783 112.394 303.614 115.164C299.157 120.704 292.651 119.379 286.747 119.981H286.988L287.109 119.861Z" fill="white"/>
<path d="M826.98 399.858C829.028 397.329 830.233 396.004 831.438 394.439C829.269 393.596 827.1 392.873 824.932 392.151C827.944 386.37 830.715 385.768 837.462 389.14C836.859 390.103 836.257 391.067 835.534 391.91C834.932 392.512 834.088 392.994 833.365 393.475C833.365 394.198 833.486 394.8 833.606 395.523C835.775 395.523 838.425 396.366 839.992 395.402C845.895 391.91 849.63 392.03 855.654 396.245C859.148 398.774 862.883 400.942 867.461 403.832C871.076 408.89 875.533 414.912 879.991 421.054C879.509 421.656 879.027 422.378 878.545 422.981C876.618 421.897 874.329 421.295 872.883 419.729C870.112 416.598 867.943 415.393 864.811 419.488C863.967 420.451 860.714 420.09 858.787 419.488C856.136 418.765 853.606 417.2 850.233 415.634C848.425 407.686 836.859 398.413 827.1 399.738L826.98 399.858Z" fill="white"/>
<path d="M540.839 108.539C536.14 106.371 532.405 104.685 528.309 102.878C527.827 104.564 527.104 106.973 526.502 109.382C526.14 110.586 525.899 111.67 525.538 112.874C521.562 111.67 517.345 110.706 513.61 109.02C512.767 108.659 512.767 105.287 513.369 103.721C514.092 101.794 515.899 100.349 516.622 97.459C513.61 99.0246 510.598 100.711 508.911 101.554C506.381 97.8203 504.092 95.0504 502.526 91.9193C501.803 90.3537 501.803 87.8247 502.647 86.3795C503.49 85.0548 506.02 83.8505 507.466 84.2118C509.996 84.8139 512.285 86.6204 514.092 87.4634C515.417 86.0182 516.863 84.5731 518.309 83.1279C519.755 84.8139 521.2 86.4999 522.767 88.0655C523.971 89.2698 525.297 90.8354 526.743 91.1967C536.02 93.8461 541.08 99.0246 540.839 108.418V108.539Z" fill="white"/>
<path d="M790.968 371.313C798.076 372.036 798.558 373.963 797.112 382.152C795.907 389.137 795.425 396.242 792.293 402.746C791.449 404.552 788.799 407.563 788.196 407.322C783.98 405.395 778.558 403.709 776.389 400.216C769.522 388.535 770.124 388.414 781.57 380.827C784.823 378.66 787.233 375.167 790.847 371.313H790.968Z" fill="white"/>
<path d="M614.457 428.281C614.698 433.941 615.662 439.721 614.818 445.261C613.493 454.052 610.722 462.603 609.156 471.274C608.071 477.295 603.252 476.573 599.517 476.814C598.313 476.814 596.023 472.478 595.903 470.19C595.782 465.975 596.987 461.76 597.469 457.545C597.71 456.22 598.192 454.534 597.71 453.45C595.662 448.994 597.59 445.622 600.963 443.575C605.903 440.564 608.312 436.108 610.12 431.05C610.481 429.967 611.324 429.124 611.927 428.16C612.77 428.16 613.614 428.16 614.457 428.281Z" fill="white"/>
<path d="M484.936 222.836C479.032 223.317 473.129 223.679 467.346 224.16C467.346 223.799 467.105 223.438 466.984 223.197C468.43 222.233 469.996 221.39 471.924 220.066C467.105 214.044 471.683 210.552 476.141 207.18C469.876 203.085 468.551 198.268 471.804 189.718C472.647 187.429 476.743 186.466 479.273 184.9C479.635 185.503 480.117 185.984 480.478 186.586C479.755 188.032 478.912 189.597 478.43 190.681C481.683 197.786 484.815 204.892 488.068 212.238C487.225 215.249 486.02 219.223 484.936 223.076L485.056 222.956L484.936 222.836Z" fill="white"/>
<path d="M844.934 252.698C845.778 259.201 846.501 265.824 847.464 272.328C847.946 275.94 847.103 278.59 843.489 280.035C838.79 281.841 833.971 283.407 829.513 285.695C826.862 287.02 824.814 289.549 821.561 292.319C820.718 290.874 818.549 288.826 818.79 287.02C819.272 283.768 819.272 280.035 823.73 278.349C829.031 276.302 833.971 273.291 838.79 270.28C840.115 269.437 841.199 267.029 841.199 265.343C841.32 261.248 840.838 257.033 840.477 252.818C841.922 252.818 843.489 252.698 844.934 252.577V252.698Z" fill="white"/>
<path d="M639.394 108.061C637.105 109.867 634.936 112.035 632.527 113.359C628.43 115.648 624.093 117.334 619.876 119.26C619.153 119.622 618.551 120.224 617.828 120.585C611.965 124.037 610.961 128.774 614.816 134.796C615.298 135.518 615.539 136.241 615.9 136.843C611.683 140.938 608.912 140.215 601.684 132.749C604.696 126.848 607.105 120.465 610.961 115.166C612.888 112.516 617.467 111.433 620.96 110.228C626.623 108.301 632.406 106.736 638.069 105.05C638.43 106.013 638.912 106.977 639.273 107.94L639.394 108.061Z" fill="white"/>
<path d="M735.537 375.169C741.199 373.363 744.814 375.049 747.344 380.468C748.789 383.599 751.56 386.49 754.452 388.417C759.994 392.15 760.115 398.171 761.681 403.591C762.042 404.674 759.874 406.36 758.91 407.806C755.536 404.915 750.115 402.507 749.151 399.014C747.705 393.836 745.536 389.982 741.681 386.61C738.187 383.599 734.452 380.709 735.537 375.29V375.169Z" fill="white"/>
<path d="M431.928 152.622C437.229 153.586 442.41 154.67 449.036 155.874C448.193 154.91 448.675 155.151 448.675 155.513C449.518 159.246 453.856 163.22 449.518 166.833C447.47 168.519 443.615 168.037 440.482 168.519C437.35 169.001 434.338 169.844 432.41 165.99C431.928 164.906 429.76 164.786 427.952 164.063C428.555 162.497 429.157 161.173 429.88 159.487C428.916 159.246 427.711 158.885 426.266 158.523C428.434 155.753 430.241 153.465 432.049 151.057C432.049 151.538 431.928 152.141 431.808 152.622H431.928Z" fill="white"/>
<path d="M925.174 523.294C930.234 526.546 930.234 529.797 923.849 534.855C920.235 537.745 916.741 541.117 914.331 545.092C910.958 550.511 906.259 546.296 902.524 547.982L901.078 546.778C903.729 543.406 905.897 539.672 908.909 536.782C913.849 532.085 919.391 528.111 925.174 523.414V523.294Z" fill="white"/>
<path d="M301.694 335.792C286.513 337.839 284.826 337.237 285.911 332.541C281.212 330.012 277.116 327.242 272.537 325.796C268.682 324.472 264.345 324.713 259.525 324.11C260.128 323.267 261.212 320.498 262.537 320.257C271.092 319.293 279.525 319.173 286.272 326.158C287.838 327.723 290.368 328.687 292.657 329.169C296.633 330.012 300.609 330.493 301.694 335.913V335.792Z" fill="white"/>
<path d="M526.266 80.6006C536.145 81.4436 545.904 82.1662 556.265 83.0092C554.578 89.1511 550.844 90.7166 545.904 90.7166C535.181 90.7166 527.229 86.8629 526.266 80.6006Z" fill="white"/>
<path d="M810.238 406.246C808.31 405.042 806.383 403.717 803.973 402.272C803.371 404.199 802.768 406.006 802.286 407.812C795.419 403.477 795.78 395.167 803.491 386.496C806.624 388.182 809.997 389.868 813.25 391.554C813.13 392.156 813.009 392.638 812.768 393.24C811.202 393.842 809.756 394.444 807.829 395.167C809.033 398.419 810.359 401.67 811.684 405.042C811.202 405.403 810.72 405.765 810.238 406.126V406.246Z" fill="white"/>
<path d="M930.838 519.927C929.393 519.324 928.308 518.843 927.465 518.602C929.393 512.942 931.2 507.522 933.368 501.501C934.332 503.307 935.296 505.114 936.139 506.92C939.031 507.161 942.043 507.402 945.296 507.643C940.236 514.748 935.898 520.89 931.561 527.032C930.959 526.671 930.356 526.309 929.874 526.069C930.236 524.021 930.597 522.094 930.838 520.047V519.927Z" fill="white"/>
<path d="M789.152 421.296C780.116 419.249 771.2 417.202 762.164 415.275C762.526 408.531 763.369 408.17 769.152 409.735C773.489 410.94 778.067 412.505 782.525 412.746C787.344 412.987 788.549 416.118 790.116 419.249C789.875 419.972 789.513 420.694 789.272 421.296H789.152Z" fill="white"/>
<path d="M684.213 94.81C682.044 88.7885 684.936 86.7412 689.996 86.7412C693.128 86.7412 696.381 87.1025 699.273 88.1864C700.96 88.7885 702.044 90.9562 703.369 92.5218C701.442 93.6057 699.514 95.5325 697.586 95.653C693.249 95.8938 688.912 95.1713 684.092 94.9304L684.213 94.81Z" fill="white"/>
<path d="M844.937 252.689C843.491 252.689 841.925 252.809 840.479 252.93C839.516 251.846 837.588 250.642 837.588 249.558C837.588 246.427 838.431 243.295 839.034 239.321C843.732 240.887 848.07 242.212 853.612 244.018C848.793 245.824 851.925 253.532 844.937 252.689Z" fill="white"/>
<path d="M808.189 356.269C810.117 354.824 812.045 353.379 814.575 351.452C814.695 350.489 815.057 348.321 815.659 343.985C819.997 348.923 823.37 352.777 826.864 356.751C822.527 358.798 818.912 360.484 814.575 362.411C814.334 361.207 814.093 359.641 813.732 357.714H808.912C808.671 357.233 808.43 356.63 808.189 356.149V356.269Z" fill="white"/>
<path d="M792.289 107.699C798.434 108.662 805.06 102.159 809.879 111.673C807.711 112.998 804.578 116.49 802.409 116.009C798.554 115.166 792.048 115.888 792.41 107.699H792.289Z" fill="white"/>
<path d="M467.716 203.674V214.272C464.825 214.874 461.813 215.476 458.921 216.078C456.27 206.685 458.439 203.674 467.716 203.674Z" fill="white"/>
<path d="M846.615 524.387C850.471 524.628 854.326 524.989 858.543 525.35C859.386 529.926 858.784 534.262 853.965 534.864C847.7 535.707 848.543 529.204 845.893 526.073C846.134 525.591 846.374 524.989 846.615 524.507V524.387Z" fill="white"/>
<path d="M805.778 343.498C802.525 340.126 796.862 338.199 800.477 332.9C801.681 331.214 807.826 330.371 809.031 331.695C813.368 336.151 808.067 339.162 805.778 343.498Z" fill="white"/>
<path d="M290.971 172.008C288.803 171.526 286.513 170.924 283.983 170.322C281.333 175.259 278.321 173.814 274.586 169.84C277.718 167.432 280.489 163.337 283.501 163.337C286.393 163.337 289.285 167.311 292.176 169.479C291.815 170.322 291.453 171.165 290.971 172.008Z" fill="white"/>
<path d="M798.064 324.474C798.305 319.777 791.558 317.369 797.221 313.274C798.426 312.431 801.679 312.311 801.92 312.792C803.606 316.767 803.004 320.38 798.185 324.474H798.064Z" fill="white"/>
<path d="M621.32 88.5489C617.344 88.9102 614.091 89.1511 610.959 89.3919C611.682 87.7059 611.923 85.5382 613.128 84.5747C616.14 82.407 619.031 82.7683 621.32 88.5489Z" fill="white"/>
<path d="M697.83 360.966C700.119 364.338 704.577 366.144 700.721 370.239C699.757 371.202 698.191 371.443 696.866 372.045C696.504 370.721 695.782 369.275 695.902 367.951C696.143 365.903 696.986 363.977 697.83 360.966Z" fill="white"/>
<path d="M288.914 317.366C291.926 319.533 294.335 321.219 296.745 323.026C297.106 323.387 297.106 324.591 296.745 325.073C296.384 325.555 295.058 326.157 294.817 325.916C292.528 323.507 286.504 323.989 288.793 317.245L288.914 317.366Z" fill="white"/>
<path d="M281.69 337.359C279.28 337.841 276.75 338.202 272.533 339.045C273.979 336.396 274.461 334.107 275.304 333.987C277.473 333.867 279.642 334.589 281.81 334.95V337.359H281.69Z" fill="white"/>
<path d="M383.5 79.5331C383.138 68.9353 383.138 69.0557 392.897 68.574C403.62 68.0923 414.222 66.888 424.945 67.0084C431.812 67.0084 438.68 69.1761 445.547 70.26C445.547 71.2234 445.668 72.0664 445.788 73.0299C442.053 74.9567 438.439 76.8836 434.704 78.9309C434.945 79.4126 435.186 79.8943 435.306 80.3761C436.752 80.0148 438.198 79.7739 439.523 79.2922C443.86 77.7266 447.957 76.5223 451.451 80.9782C452.053 81.7008 453.258 81.8212 453.981 82.4234C455.306 83.3868 456.511 84.5911 457.836 85.6749C456.39 86.2771 454.945 87.1201 453.378 87.6018C449.643 88.6857 445.788 89.6491 441.812 90.733C442.535 93.7437 443.017 95.5501 443.378 96.9953C441.571 98.1996 440.005 99.163 438.318 100.367C441.089 102.415 443.258 103.98 446.511 106.509C442.053 107.352 439.162 107.954 435.909 108.677C436.391 111.688 437.234 114.458 437.234 117.227C437.234 119.756 437.354 123.49 435.909 124.574C432.535 127.103 432.174 129.752 433.62 133.847C431.692 133.365 430.367 133.004 428.439 132.522C429.764 134.449 430.848 135.894 431.933 137.339C431.692 137.941 431.451 138.664 431.21 139.266C426.27 137.7 421.21 136.135 416.27 134.569C416.029 135.292 415.788 135.894 415.668 136.617C418.559 137.821 421.451 139.025 425.306 140.591C422.415 143.24 419.644 146.371 416.391 148.539C410.969 152.272 405.307 155.644 399.524 158.776C397.355 159.98 394.584 160.462 392.174 160.341C386.994 159.98 386.271 163.593 384.945 167.085C382.174 174.07 379.283 181.055 376.994 186.595C371.813 185.15 367.958 184.427 364.464 183.102C362.898 182.5 360.97 180.935 360.608 179.489C359.645 176.238 359.886 172.745 359.163 169.494C358.199 164.677 356.874 160.1 355.307 153.477C357.115 151.429 360.367 147.816 363.982 143.722C361.09 142.036 357.837 140.109 353.139 137.339C356.151 136.737 357.837 136.737 358.922 136.014C359.886 135.412 360.488 134.088 360.127 132.281C358.199 133.124 356.151 133.967 354.103 134.931C353.38 128.427 352.657 122.647 352.054 117.107C347.597 115.541 343.5 114.096 339.404 112.772C338.561 112.531 337.476 112.772 336.633 113.012C330.97 114.939 327.115 113.133 324.344 106.63C329.043 106.148 333.5 105.787 337.958 105.425C337.958 104.944 337.958 104.582 337.958 104.101C332.055 103.86 326.272 103.498 320.368 103.258C320.127 102.415 319.886 101.572 319.766 100.729C326.392 98.4405 333.139 96.1523 340.97 93.3824C338.32 91.6964 336.874 90.8534 335.428 89.89C350.729 81.7008 366.03 74.9567 383.741 79.6535L383.5 79.5331ZM416.15 76.8836C425.708 79.0513 431.13 78.7302 432.415 75.9202C426.873 76.2815 421.451 76.6428 416.15 76.8836Z" fill="currentcolor"/>
<path d="M286.769 119.729C282.793 118.163 278.817 116.839 274.841 115.032C273.636 114.55 272.913 113.105 271.95 112.142C272.191 111.54 272.552 111.058 272.793 110.456C275.685 111.058 278.697 111.66 281.588 112.262C284.6 112.864 287.612 113.467 290.745 113.948C290.986 113.226 291.106 112.503 291.347 111.781C289.178 111.058 287.01 109.974 284.721 109.613C282.431 109.251 280.022 109.613 277.371 109.613C278.335 103.712 281.227 101.664 286.889 102.748C285.925 101.905 284.961 101.062 283.395 99.7376C286.046 97.6903 288.817 95.5226 292.19 92.9935C285.684 91.7893 283.395 96.2451 280.865 100.46C276.648 100.46 273.395 99.4967 274.118 94.0774C274.118 93.3548 273.877 92.271 273.395 91.9097C266.889 86.6108 275.685 84.8044 275.805 81.071C278.335 82.1549 280.865 83.1183 283.154 84.5635C284.6 85.4065 285.805 86.8517 287.974 87.3334C287.492 86.4904 287.13 85.5269 286.407 84.8044C281.106 79.5055 281.468 76.4947 289.058 75.6517C302.672 74.2066 316.527 73.9657 330.262 73.484C336.527 73.2431 342.792 73.484 349.78 73.484C347.973 82.3958 340.744 78.9033 336.286 81.5528V86.2495C329.66 89.6215 323.033 92.271 317.371 96.2451C314.118 98.5333 312.431 103.11 309.901 106.482C307.732 109.372 305.443 112.262 303.275 115.032C298.817 120.572 292.311 119.247 286.407 119.849H286.648L286.769 119.729Z" fill="currentcolor"/>
<path d="M540.839 108.915C536.14 106.748 532.405 105.062 528.309 103.255C527.827 104.941 527.104 107.35 526.502 109.758C526.14 110.963 525.899 112.047 525.538 113.251C521.562 112.047 517.345 111.083 513.61 109.397C512.767 109.036 512.767 105.664 513.369 104.098C514.092 102.171 515.899 100.726 516.622 97.836C513.61 99.4015 510.598 101.088 508.911 101.931C506.381 98.1973 504.092 95.4274 502.526 92.2962C501.803 90.7306 501.803 88.2016 502.647 86.7565C503.49 85.4318 506.02 84.2275 507.466 84.5887C509.996 85.1909 512.285 86.9973 514.092 87.8403C515.417 86.3952 516.863 84.95 518.309 83.5049C519.755 85.1909 521.2 86.8769 522.767 88.4425C523.972 89.6468 525.297 91.2124 526.743 91.5736C536.02 94.2231 541.08 99.4015 540.839 108.795V108.915Z" fill="currentcolor"/>
<path d="M526.266 80.9775C536.145 81.8205 545.904 82.5431 556.265 83.3861C554.578 89.528 550.844 91.0936 545.904 91.0936C535.181 91.0936 527.229 87.2399 526.266 80.9775Z" fill="currentcolor"/>
<path d="M684.213 95.1869C682.044 89.1655 684.936 87.1182 689.996 87.1182C693.128 87.1182 696.381 87.4795 699.273 88.5633C700.96 89.1655 702.044 91.3332 703.369 92.8988C701.442 93.9826 699.514 95.9095 697.586 96.0299C693.249 96.2708 688.912 95.5482 684.092 95.3074L684.213 95.1869Z" fill="currentcolor"/>
<path d="M792.289 108.076C798.434 109.039 805.06 102.536 809.879 112.05C807.711 113.375 804.578 116.867 802.409 116.386C798.554 115.543 792.048 116.265 792.41 108.076H792.289Z" fill="currentcolor"/>
<path d="M621.32 88.9259C617.344 89.2871 614.091 89.528 610.959 89.7689C611.682 88.0829 611.923 85.9151 613.128 84.9517C616.14 82.784 619.031 83.1453 621.32 88.9259Z" fill="currentcolor"/>
</svg>`;
  } else if (continente_detetado === "Oceania") {
    novoConteudoSVG = `<svg width="100%" viewBox="0 0 1024 642" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="1024" height="642" fill="none"/>
<path d="M484.813 222.944C487.102 220.777 490.716 219.091 491.439 216.441C493.367 209.577 498.909 208.975 502.885 208.132C503.849 203.676 504.571 200.183 505.415 195.968C505.174 195.968 504.09 195.246 502.764 195.246C499.27 195.005 497.584 193.439 498.065 189.826C498.668 184.407 493.969 178.747 498.186 173.689C501.559 169.715 505.776 166.463 509.391 162.609C511.439 160.442 513.607 158.154 514.451 155.504C517.222 147.315 524.692 144.063 530.595 139.126C532.764 137.319 535.896 136.597 538.306 134.911C544.33 130.575 551.438 131.78 556.86 136.717C560.836 140.21 566.137 142.498 571.197 144.425C576.619 146.472 581.438 148.278 581.317 155.384C587.944 154.42 586.137 148.88 587.582 145.027H593.486C593.727 147.194 594.088 149.121 594.45 152.493C602.763 143.822 612.763 142.739 623.365 143.461C623.606 142.859 623.726 142.257 623.967 141.655C621.919 141.053 619.871 140.33 617.702 139.728C618.425 138.764 619.028 137.801 619.751 136.838C621.919 137.199 624.329 137.078 626.377 137.921C631.196 139.848 634.931 139.005 637.943 134.79C638.907 133.466 640.112 132.382 641.196 131.177C645.292 126.44 649.268 126.44 653.124 131.177C654.569 129.973 655.895 128.648 657.822 127.083C658.545 129.612 659.148 131.539 659.75 133.466C660.232 133.466 660.593 133.586 661.075 133.706C661.557 131.9 661.919 129.973 662.401 127.805C663.967 127.805 665.654 127.564 667.461 127.444C667.702 125.878 668.063 124.433 668.304 122.988C668.666 123.47 669.027 124.072 669.389 124.554C678.304 117.569 687.942 112.029 700.231 109.621C700.352 109.621 701.677 110.945 703.966 112.993C706.617 109.5 708.665 106.008 711.436 103.117C712.641 101.913 716.617 101.19 717.099 101.793C720.352 106.369 724.93 105.887 729.026 104.924C734.448 103.479 737.099 107.091 739.147 110.343C740.351 112.27 739.388 115.522 739.388 119.255C747.58 120.7 757.821 120.459 765.893 124.433C778.062 130.455 789.989 125.517 801.917 127.444C803.122 122.627 805.531 121.302 810.591 122.386C821.314 124.674 829.989 131.418 840.35 135.031C843.362 130.936 847.94 129.973 850.47 134.309C855.41 142.739 862.518 139.005 869.024 139.126C869.627 139.126 870.109 138.644 870.711 138.524C871.073 138.524 871.434 138.524 872.036 138.524C873.241 140.089 874.566 141.655 876.976 144.545C876.615 141.053 876.494 139.126 876.133 135.272C883.362 137.319 889.627 139.126 895.892 140.932C898.301 141.655 900.831 142.136 903 143.22C908.542 145.99 913.964 149.001 919.385 151.891C919.988 152.252 920.349 152.975 920.951 153.216C926.654 155.464 929.024 160.361 928.06 167.908C925.409 166.584 922.879 165.861 921.072 164.295C915.771 160.08 915.048 160.08 910.711 166.102C912.518 168.27 914.325 170.558 916.614 173.328C912.879 174.532 909.867 175.616 906.614 176.338C902.759 177.302 898.663 177.543 897.699 182.721C897.578 183.444 894.687 183.805 893.12 184.046C889.988 184.407 886.494 183.805 883.723 184.889C879.024 186.936 879.506 192.596 884.687 196.57C881.072 204.158 877.338 211.865 873.603 219.572C872.88 219.572 872.157 219.332 871.314 219.332C870.229 217.405 869.145 215.478 868.181 213.431C866.976 210.781 865.53 208.132 864.808 205.362C864.085 202.833 863.241 199.822 864.085 197.534C866.494 191.031 869.627 184.889 872.398 178.626C871.916 178.145 871.434 177.663 870.952 177.302C870.109 178.867 869.145 180.433 868.542 181.517C866.374 180.794 863.241 179.59 863.121 179.951C861.555 182.962 860.47 186.214 859.145 189.345C859.506 190.067 859.747 190.79 860.109 191.512C853.121 190.429 846.013 189.465 839.025 188.14C830.23 186.334 827.097 188.14 824.447 196.57C823.844 198.497 821.917 200.063 820.953 201.99C820.35 203.074 819.868 205.241 820.35 205.603C821.435 206.446 823.121 206.687 824.567 206.687C827.097 206.446 829.627 205.844 832.157 205.482C832.278 205.964 832.398 206.446 832.519 207.048C833.362 205.844 834.206 204.639 836.133 201.749C837.218 205.603 837.579 207.891 838.422 210.059C839.989 213.792 841.796 217.405 843.483 221.138C844.687 223.547 846.374 225.835 847.097 228.364C847.338 229.086 845.049 230.532 843.242 232.579C843.242 232.94 843.362 234.867 843.603 237.276C838.422 234.987 838.061 230.893 837.579 226.678C837.097 222.944 836.013 219.332 835.169 215.719C834.567 215.719 834.085 215.96 833.483 216.08C833.483 217.043 833.242 218.007 833.483 218.729C837.579 230.532 830.712 239.443 825.652 248.837C825.17 249.8 823.844 250.402 822.88 250.884C815.17 254.979 814.447 256.424 815.29 265.576C815.772 270.875 817.579 276.295 811.917 282.437C807.82 275.813 803.965 269.791 800.11 263.65C797.941 268.467 795.893 272.32 794.688 276.295C794.086 278.101 794.327 281.112 795.411 282.196C802.158 288.699 801.314 301.946 794.929 310.135C792.278 313.507 790.592 317.722 788.423 321.576C786.495 325.069 784.086 327.477 779.387 326.995C777.339 326.755 775.05 328.2 771.074 329.404C777.7 332.174 776.134 335.064 774.206 338.677C772.881 341.206 772.761 344.698 772.64 347.709C772.158 357.825 768.785 363.004 763.845 364.088C758.062 359.993 753.604 356.741 749.267 353.61C746.014 358.066 746.978 363.124 752.038 368.062C757.219 372.999 759.146 379.503 760.472 386.367C751.918 381.068 743.725 375.649 741.797 364.69C741.556 363.606 741.315 361.92 741.918 361.197C744.809 357.584 743.002 355.296 740.713 352.406C739.147 350.359 739.026 347.107 737.942 343.374C736.858 343.374 734.93 343.012 733.002 342.892C729.388 342.651 728.424 341.326 728.303 337.232C728.183 333.017 724.809 328.922 722.641 324.226C719.749 325.55 716.617 326.032 714.81 327.838C710.111 332.656 706.617 339.038 701.436 343.012C694.93 348.071 697.099 355.537 694.689 361.559C692.641 366.496 690.714 368.423 686.979 367.339C682.28 357.103 677.943 347.589 673.605 338.195C672.882 336.63 672.401 334.823 671.919 333.137C671.557 331.933 671.678 330.247 670.955 329.765C664.69 325.791 663.124 316.398 653.244 315.916C648.184 315.675 643.485 314.109 639.268 318.324C637.582 315.795 636.256 313.869 635.052 311.942C634.57 312.183 634.088 312.423 633.606 312.544C634.57 314.832 635.172 317.481 636.738 319.408C641.196 324.707 640.594 330.849 634.811 334.944C626.016 341.086 617.1 346.866 607.221 351.202C600.715 354.092 598.787 353.851 596.859 346.625C594.45 337.954 589.269 331.331 583.847 324.707C581.799 320.01 579.751 315.193 577.582 310.497C577.101 316.518 576.378 322.66 583.245 325.309C583.607 333.378 587.462 339.761 592.402 345.782C594.932 348.793 596.98 352.165 600.353 356.982C603.727 356.26 608.666 355.537 613.365 353.972C616.98 352.767 619.389 353.731 619.269 357.223C619.269 361.077 618.425 365.292 616.618 368.664C613.245 375.047 609.028 380.948 605.173 386.969C604.329 388.294 603.606 390.1 602.281 390.702C596.257 393.954 593.365 399.133 592.161 405.395C591.197 409.971 590.594 414.668 590.353 419.244C590.112 423.58 590.594 428.036 590.594 432.491C590.474 438.633 589.39 443.812 583.968 448.749C579.751 452.603 578.667 459.949 576.257 465.73C575.655 467.175 575.655 469.945 575.052 470.065C568.185 471.39 569.631 477.412 567.824 481.627C566.619 484.517 563.245 486.564 562.041 489.575C557.583 500.895 546.378 501.979 537.342 506.194C533.005 508.241 529.872 506.435 528.788 501.859C526.619 492.827 521.921 484.637 521.559 474.883C521.318 469.222 516.86 463.683 514.571 457.902C513.607 455.493 512.162 452.483 512.885 450.435C517.222 437.309 514.089 424.543 511.439 411.778C511.198 410.814 510.957 409.73 510.354 409.008C503.728 401.902 504.933 393.713 507.102 385.404C507.583 383.597 507.102 381.55 507.102 379.021C499.15 381.55 492.162 381.67 486.258 374.565C486.258 374.565 485.415 374.445 485.295 374.685C480.355 383.236 471.439 380.466 464.331 380.827C459.994 381.068 454.934 376.853 451.199 373.481C448.307 370.832 447.464 366.014 444.813 363.004C439.753 357.344 440.235 350.84 439.512 343.976C438.307 332.174 442.042 321.576 445.536 310.858C446.259 308.811 448.428 307.125 450.355 305.679C454.813 302.548 457.584 298.574 457.343 293.155C456.861 284.966 463.367 281.594 468.066 277.017C468.668 276.415 470.716 276.174 471.319 276.776C475.295 280.028 478.186 277.258 481.319 275.452C492.041 274.247 502.764 272.923 513.607 271.718C512.644 282.918 515.294 286.049 523.366 288.819C527.222 290.144 530.957 292.312 535.294 294.359C536.74 286.772 542.161 287.495 547.824 288.338C555.294 289.542 562.763 290.746 571.077 292.071C572.281 287.013 573.727 281.473 575.052 275.933C574.45 275.813 573.968 275.693 573.366 275.452C571.799 277.499 570.354 279.546 568.787 281.594C568.306 281.232 567.824 280.991 567.221 280.63C567.221 279.065 567.101 277.499 567.101 277.379C561.318 276.656 556.378 275.933 551.318 275.211C550.233 270.634 549.149 266.058 548.065 261.121C543.125 264.252 546.378 268.708 546.378 272.32C546.378 273.404 549.39 274.488 551.077 275.452V280.028C547.583 278.222 544.932 275.933 542.041 275.572C538.185 275.09 537.583 273.284 537.704 270.032C537.945 265.817 536.981 262.084 532.282 260.398C531.92 258.953 532.041 256.906 531.198 256.063C527.704 252.691 523.969 249.8 520.354 246.669C519.872 247.151 519.391 247.632 518.909 248.114C520.836 250.161 522.764 252.45 524.812 254.256C527.222 256.424 529.872 258.351 532.402 260.398C532.523 260.518 532.643 260.639 532.764 260.88C532.764 261 532.764 261.241 532.764 261.482C531.439 261.482 530.113 261.482 530.234 261.482C527.824 265.336 525.776 268.587 523.366 272.561C521.68 271.237 519.872 269.791 518.427 268.708C520.595 266.901 522.041 265.697 523.487 264.493C521.8 262.686 520.475 260.398 518.427 258.953C516.258 257.387 513.607 256.544 511.077 255.46C509.752 258.712 514.089 264.131 506.499 266.419C506.017 260.278 505.535 254.858 505.053 249.439C503.246 249.8 500.716 251.125 498.668 250.523C494.09 249.318 491.68 251.245 490.114 254.858C487.102 261.723 484.331 268.708 481.439 275.572C474.813 274.609 468.186 273.645 460.476 272.441V249.68C466.138 249.318 471.198 248.716 476.259 248.837C480.837 248.957 481.921 245.344 480.837 243.177C479.271 240.166 477.945 235.71 472.885 235.59C471.68 235.59 470.475 234.265 469.271 233.422C470.235 232.338 471.078 230.893 472.283 230.17C476.379 227.4 480.716 224.992 484.933 222.342L484.813 222.463V222.944ZM542.161 160.442C541.559 160.08 540.956 159.84 540.354 159.478C537.222 163.332 533.848 166.945 531.198 171.16C529.39 174.05 527.222 178.506 528.186 181.035C531.198 188.622 526.981 194.162 524.451 200.304C523.728 201.99 521.318 204.158 519.993 204.037C518.065 203.796 516.017 201.869 514.812 200.063C513.246 197.895 512.523 195.246 511.318 192.837C510.836 192.958 510.354 193.198 509.873 193.319C511.077 197.413 512.282 201.388 513.848 206.807C517.463 205.964 521.68 203.796 525.415 204.398C534.21 205.723 535.414 201.026 536.137 194.282C536.378 191.994 538.788 190.067 540.113 187.9C540.836 187.9 541.679 188.02 542.402 188.14C541.438 185.973 541.077 182.962 539.511 181.999C531.318 176.94 530.836 174.291 537.463 167.186C539.27 165.138 540.595 162.609 542.161 160.321V160.442ZM565.534 154.179C566.378 159.358 565.896 164.055 573.125 164.898C569.751 157.07 579.39 161.044 579.992 155.263C575.414 154.902 570.836 154.541 565.534 154.179ZM629.871 312.544C627.702 309.172 626.016 306.161 623.967 303.271C622.16 300.742 621.919 295.202 616.377 298.695C619.51 303.993 622.401 309.051 625.293 313.989C626.979 313.507 628.546 313.026 629.871 312.544ZM769.628 339.038C770.592 338.436 771.556 337.714 772.64 337.111C770.592 334.101 768.544 331.21 766.375 328.2C765.532 328.802 764.688 329.404 763.725 330.006C765.652 333.017 767.58 336.148 769.628 339.159V339.038Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M286.869 119.738C287.471 121.183 288.194 122.629 288.917 124.194C292.411 123.472 296.628 120.461 298.796 126.362C306.628 123.833 311.688 131.059 318.314 132.143C324.7 133.226 328.555 139.248 325.302 144.426C329.158 146.955 334.459 148.641 336.266 152.134C337.591 154.783 334.579 159.721 333.374 164.056C330.121 162.129 327.832 160.684 325.423 159.36C330.724 165.742 326.507 171.884 325.182 179.592C321.567 177.304 317.832 175.618 314.941 173.089C311.085 169.716 307.471 166.706 301.688 167.308C300.001 167.428 298.074 165.622 296.146 164.658C297.351 162.972 298.435 161.046 300.001 159.6C300.965 158.637 302.772 158.637 303.736 157.674C306.146 155.506 310.483 152.134 310.001 150.93C308.676 147.678 305.664 144.426 302.531 142.981C299.037 141.295 294.58 141.416 292.17 141.054C291.688 146.233 293.013 152.616 290.483 155.626C287.592 158.998 281.086 159.119 277.833 160.203C269.52 169.837 262.05 178.387 254.58 186.817C261.086 195.368 267.351 202.714 279.279 201.871C280.483 205.725 281.688 209.94 283.375 215.48C285.182 210.301 286.507 206.568 287.833 202.714C286.869 201.871 285.905 201.028 283.857 199.222H290.724C291.568 191.755 292.652 184.409 293.013 177.063C293.254 172.005 296.266 171.402 299.76 172.366C303.254 173.209 306.387 175.256 309.76 176.581C310.965 177.063 312.411 177.183 314.097 177.544C314.338 181.157 314.459 184.891 314.7 188.985H322.411C322.772 187.42 323.133 185.734 323.495 184.048C324.218 184.048 325.182 184.048 325.302 184.288C327.471 188.985 330.483 193.561 331.447 198.62C332.41 203.678 336.266 209.338 342.531 210.181C342.531 213.553 342.772 217.166 342.531 220.658C342.169 225.114 343.495 228.486 346.748 231.978C348.555 233.905 348.314 237.639 349.398 242.456C344.458 240.408 341.206 239.084 337.953 237.759C338.073 237.277 338.314 236.796 338.435 236.193C336.145 236.555 333.856 237.036 329.88 237.639C333.856 231.497 337.109 226.559 341.206 220.297C335.302 222.585 330.965 224.391 326.868 225.957C326.146 227.643 325.543 229.57 324.459 231.256C323.254 233.062 321.567 234.507 320.001 236.073C321.688 237.277 323.495 238.482 325.182 239.565C325.664 239.927 326.266 240.047 328.435 240.77C324.097 243.299 320.603 245.346 316.146 247.875C316.507 245.828 316.748 244.985 317.109 242.937C311.447 245.346 306.387 247.514 300.965 249.922C302.411 252.692 303.254 254.378 304.58 256.907C294.339 258.593 290.845 265.578 288.917 273.888C287.833 275.694 286.989 277.742 285.785 279.428C284.7 280.873 283.375 282.197 282.05 283.402C278.797 286.412 274.821 289.062 272.17 292.554C270.966 294.12 272.17 297.612 272.17 300.141C272.17 300.503 272.893 300.744 272.893 301.105C272.893 307.006 272.291 313.268 280.483 316.158C279.881 316.64 279.158 317.242 278.556 317.724C277.23 317.122 275.905 316.761 274.7 316.038C273.616 315.436 272.652 314.713 271.929 313.75C269.761 311.221 267.592 308.692 265.664 305.922C264.46 304.356 263.978 300.984 262.773 300.864C259.158 300.382 255.424 300.864 251.809 301.225C250.002 301.466 247.713 303.273 246.749 302.55C239.761 297.974 234.219 301.346 228.075 305.44C228.075 310.98 227.954 316.761 228.075 322.541C228.075 325.07 228.315 327.961 229.52 330.008C230.605 331.694 233.255 333.139 235.303 333.259C236.508 333.259 238.074 330.73 239.159 329.044C239.882 327.961 240.123 326.395 240.604 324.829H252.893C251.93 329.647 250.966 334.223 249.881 339.522C251.327 339.883 253.134 340.485 254.942 340.726C262.532 341.93 263.616 343.496 262.532 351.203C262.17 353.612 261.929 356.021 261.809 358.429C261.809 359.633 262.05 360.717 262.291 361.801C266.387 364.21 272.05 351.083 274.941 363.246C274.459 363.848 273.857 364.451 273.375 365.053C271.206 366.859 268.917 368.666 265.544 371.556C260.484 366.859 255.062 361.681 249.641 356.623C248.556 355.539 247.351 354.214 246.026 353.853C241.327 352.649 236.749 351.806 235.183 346.145C234.942 345.543 233.255 345.182 232.171 344.941C224.942 343.014 217.231 342.051 210.605 338.799C207.472 337.354 205.063 331.694 204.822 327.84C204.46 321.578 201.93 317.363 197.473 313.509C196.027 312.305 195.183 310.498 193.256 308.09C194.099 312.184 194.822 315.075 195.545 318.567C190.967 318.567 188.798 317.001 186.629 313.629C181.69 306.042 179.16 297.853 176.629 289.423C176.148 287.978 175.184 286.292 173.979 285.449C167.834 281.234 166.027 275.333 166.63 268.348C167.352 259.316 168.316 250.284 169.039 241.251C169.28 238 169.16 234.748 168.798 231.497C167.714 223.428 166.389 215.359 165.304 207.772C164.943 208.856 164.22 210.422 163.618 212.108C163.136 212.348 162.533 212.589 162.051 212.83C163.377 198.138 148.558 197.897 142.654 189.587C141.57 188.142 136.028 189.949 133.016 190.31C132.534 195.368 133.618 201.269 131.329 202.955C126.871 206.447 120.606 207.772 115.064 210.06C114.823 209.579 114.582 208.976 114.341 208.495L118.196 200.908C117.594 200.426 117.112 199.944 116.51 199.583C109.401 206.688 103.016 214.516 95.0643 220.417C89.1607 224.873 81.9319 228.366 73.8597 227.402C73.4983 226.92 73.1368 226.318 72.7754 225.837C76.6308 222.946 80.6066 220.176 84.3415 217.166C90.0041 212.348 95.4257 207.17 101.329 201.992C95.6667 198.499 95.5462 198.499 90.3655 203.075C88.1969 200.306 86.0282 197.536 83.9801 194.766C83.7391 195.007 83.3777 195.368 83.1367 195.609C82.5343 193.441 82.4138 190.912 81.209 189.106C77.4741 183.445 78.438 178.267 84.7029 175.738C88.9198 174.052 93.6185 173.45 97.9558 172.005C100.124 171.282 102.052 170.078 103.859 167.91H91.4498C87.8354 163.815 84.9439 160.684 81.5705 156.951C88.5583 155.265 95.1847 150.207 104.341 152.736C105.064 152.134 106.751 150.689 108.317 149.364C105.426 147.798 102.414 146.594 99.763 144.788C98.6787 144.065 97.8353 141.897 98.0763 140.693C98.3172 139.73 100.365 138.887 101.691 138.525C107.956 136.96 114.1 135.635 120.365 134.19C121.329 133.949 122.413 133.467 123.257 133.588C134.823 135.876 146.268 138.284 157.834 140.573C161.449 141.295 165.184 141.777 168.678 141.416C175.184 140.813 181.569 139.489 188.798 138.405C188.918 138.766 189.521 140.332 190.244 142.74C192.653 141.175 194.822 139.85 197.111 138.405C196.991 138.887 196.87 139.248 196.629 139.73C206.629 142.74 216.749 145.751 226.749 149.003C228.797 149.605 230.605 151.05 232.412 152.134C234.701 147.678 230.966 143.945 224.46 143.463C220.002 143.102 215.665 140.693 211.328 139.127C211.93 137.562 212.533 135.996 213.255 134.069C208.798 131.179 202.894 131.42 196.629 134.19C195.545 130.938 193.376 128.048 194.099 125.88C195.424 121.665 198.075 117.691 200.725 114.078C202.292 111.79 214.099 113.837 218.436 116.487C220.123 115.282 221.81 114.319 223.135 113.115C224.34 111.91 225.303 110.465 226.508 108.9C230.123 109.381 234.099 109.863 236.508 110.104C238.918 107.093 240.604 104.926 242.291 102.758C243.376 104.805 244.58 106.852 246.147 109.743C250.363 108.057 255.424 106.13 261.93 103.601V113.837C258.797 113.596 255.544 113.476 252.412 113.235C251.327 113.235 250.243 112.392 249.279 112.753C241.809 115.162 234.339 117.811 226.629 120.461C228.918 121.545 231.448 122.629 234.58 124.194C241.207 116.728 250.363 117.932 259.761 118.534C260.363 121.665 260.966 124.435 261.568 127.566C257.11 130.577 252.653 133.588 248.074 136.719V142.981C244.58 142.62 241.327 142.259 237.713 141.897C242.291 147.919 243.135 148.039 256.749 143.824C257.472 145.51 258.315 147.196 259.038 148.882C259.64 148.882 260.122 148.882 260.725 148.882C260.725 145.269 260.725 141.777 260.725 138.164C260.725 135.996 261.086 133.829 261.207 131.781C263.014 132.022 265.062 131.781 266.628 132.504C268.435 133.467 270.002 135.153 271.447 136.598C272.773 137.923 273.857 139.489 275.544 140.813C273.255 133.347 275.423 127.085 280.483 121.906C281.809 120.581 284.58 120.581 286.628 119.859H286.387L286.869 119.738Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M273.256 365.179C273.738 364.577 274.341 363.974 274.823 363.372C279.642 359.037 284.461 354.701 289.521 350.125C291.328 351.691 292.895 352.895 294.702 354.46C295.907 353.497 297.112 352.413 298.557 351.209C300.124 352.895 301.328 354.581 302.895 355.665C305.304 357.351 307.593 358.555 311.087 359.157C317.232 360.241 324.822 361.807 327.955 369.514C329.4 373.247 331.569 375.776 336.629 374.933C342.292 374.09 347.111 379.269 347.713 385.893C347.834 387.819 347.713 389.867 347.713 393.118C355.665 395.166 363.978 397.092 372.171 399.381C374.821 400.103 377.11 402.03 379.641 403.114C381.207 403.836 383.014 403.836 384.46 404.559C385.906 405.282 387.833 406.365 388.436 407.69C391.689 416.12 388.074 423.707 384.339 431.053C382.894 433.944 380.002 436.232 378.315 439.122C376.99 441.29 376.267 443.819 375.785 446.348C374.942 451.406 374.46 456.464 373.858 461.643C373.376 465.858 371.207 468.025 366.87 469.23C360.243 471.036 357.352 475.492 356.99 482.356C356.99 483.199 357.231 484.163 356.87 484.765C354.099 489.221 350.605 493.315 348.436 498.012C345.665 503.793 341.328 505.358 335.665 504.395C335.424 505.358 335.063 505.72 335.183 506.081C337.954 516.558 337.232 516.679 326.75 521.014C323.376 522.459 321.328 527.879 319.4 531.853C318.316 534.02 319.159 537.031 318.437 539.44C317.232 543.173 313.738 546.545 318.437 550.399C319.039 550.881 318.437 554.253 317.473 555.216C307.352 564.61 310.123 570.511 320.605 577.977C314.702 582.433 304.461 579.784 300.846 573.642C293.859 561.96 293.015 548.954 292.172 535.827C292.051 533.057 291.569 530.287 291.328 527.276C293.015 525.229 294.822 522.7 297.714 519.087H290.003C291.569 510.778 293.136 502.829 294.702 494.881C295.184 492.593 296.148 490.425 296.148 488.137C296.148 479.948 296.509 471.638 295.907 463.449C295.425 457.066 293.618 451.286 287.714 447.191C283.136 444.06 277.473 440.688 278.919 433.221C279.039 432.499 277.112 431.535 276.148 430.572C274.22 428.645 271.811 426.959 270.485 424.55C268.437 420.576 267.714 416.482 274.702 414.916C272.052 413.23 270.003 412.026 268.799 411.183C262.895 394.804 274.943 380.834 273.377 365.299L273.256 365.179Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M383.5 79.1561C383.138 68.5583 383.138 68.6788 392.897 68.197C403.62 67.7153 414.222 66.511 424.945 66.6315C431.812 66.6315 438.68 68.7992 445.547 69.8831C445.547 70.8465 445.668 71.6895 445.788 72.6529C442.053 74.5798 438.439 76.5067 434.704 78.554C434.945 79.0357 435.186 79.5174 435.306 79.9991C436.752 79.6378 438.198 79.397 439.523 78.9152C443.86 77.3497 447.957 76.1454 451.451 80.6013C452.053 81.3238 453.258 81.4443 453.981 82.0464C455.306 83.0098 456.511 84.2141 457.836 85.298C456.39 85.9001 454.945 86.7431 453.378 87.2249C449.643 88.3087 445.788 89.2722 441.812 90.356C442.535 93.3668 443.017 95.1732 443.378 96.6183C441.571 97.8226 440.005 98.7861 438.318 99.9904C441.089 102.038 443.258 103.603 446.511 106.132C442.053 106.975 439.162 107.577 435.909 108.3C436.391 111.311 437.234 114.081 437.234 116.85C437.234 119.379 437.354 123.113 435.909 124.197C432.535 126.726 432.174 129.375 433.62 133.47C431.692 132.988 430.367 132.627 428.439 132.145C429.764 134.072 430.848 135.517 431.933 136.962C431.692 137.564 431.451 138.287 431.21 138.889C426.27 137.323 421.21 135.758 416.27 134.192C416.029 134.915 415.788 135.517 415.668 136.24C418.559 137.444 421.451 138.648 425.306 140.214C422.415 142.863 419.644 145.994 416.391 148.162C410.969 151.895 405.307 155.267 399.524 158.399C397.355 159.603 394.584 160.085 392.174 159.964C386.994 159.603 386.271 163.216 384.945 166.708C382.174 173.693 379.283 180.678 376.994 186.218C371.813 184.773 367.958 184.05 364.464 182.725C362.898 182.123 360.97 180.558 360.608 179.112C359.645 175.861 359.886 172.368 359.163 169.117C358.199 164.3 356.874 159.723 355.307 153.1C357.115 151.052 360.367 147.439 363.982 143.345C361.09 141.659 357.837 139.732 353.139 136.962C356.151 136.36 357.837 136.36 358.922 135.637C359.886 135.035 360.488 133.711 360.127 131.904C358.199 132.747 356.151 133.59 354.103 134.554C353.38 128.05 352.657 122.27 352.054 116.73C347.597 115.164 343.5 113.719 339.404 112.395C338.561 112.154 337.476 112.395 336.633 112.635C330.97 114.562 327.115 112.756 324.344 106.253C329.043 105.771 333.5 105.41 337.958 105.048C337.958 104.567 337.958 104.205 337.958 103.724C332.055 103.483 326.272 103.122 320.368 102.881C320.127 102.038 319.886 101.195 319.766 100.352C326.392 98.0635 333.139 95.7753 340.97 93.0055C338.32 91.3195 336.874 90.4765 335.428 89.513C350.729 81.3238 366.03 74.5798 383.741 79.2765L383.5 79.1561ZM416.15 76.5067C425.708 78.6744 431.13 78.3532 432.415 75.5432C426.873 75.9045 421.451 76.2658 416.15 76.5067Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M823.853 427.917C831.804 430.446 839.876 426.713 846.744 431.891C842.647 435.665 844.535 439.88 852.406 444.536C858.189 439.117 853.009 431.289 856.382 425.268C863.25 424.424 859.997 430.807 861.804 433.457C863.972 436.588 865.418 440.08 867.105 443.452C868.792 446.945 870.84 450.437 871.924 454.05C873.008 457.663 873.008 461.517 873.611 465.852C878.069 463.925 879.273 466.093 880.117 470.067C881.804 477.895 884.093 485.723 879.996 493.43C877.105 498.85 873.972 504.269 870.599 509.448C863.852 519.925 858.069 521.972 846.141 519.202C838.19 517.396 837.828 516.914 838.19 508.484C832.768 508.243 829.395 505.353 826.744 500.295C824.334 495.598 814.094 495.719 806.865 499.091C800.479 502.101 793.853 504.51 787.347 506.798C783.733 508.123 779.154 504.39 779.998 500.897C782.287 491.383 778.19 482.471 777.347 473.198C776.986 468.863 777.106 466.575 781.564 466.213C786.504 465.732 788.431 462.721 789.154 458.386C789.877 454.411 791.202 451.16 796.624 454.411C795.66 447.427 799.997 446.222 804.696 446.824C808.551 447.306 810.118 445.981 810.118 442.609C810.118 437.551 813.25 435.624 817.467 434.781C821.081 434.059 825.057 433.818 823.732 427.676L823.853 427.917Z" fill="currentColor"/>
<path d="M287.109 119.861C283.133 118.295 279.157 116.97 275.181 115.164C273.976 114.682 273.253 113.237 272.289 112.274C272.53 111.671 272.892 111.19 273.133 110.588C276.024 111.19 279.036 111.792 281.928 112.394C284.94 112.996 287.952 113.598 291.084 114.08C291.325 113.357 291.446 112.635 291.687 111.912C289.518 111.19 287.35 110.106 285.06 109.745C282.771 109.383 280.362 109.745 277.711 109.745C278.675 103.844 281.566 101.796 287.229 102.88C286.265 102.037 285.301 101.194 283.735 99.8694C286.386 97.8221 289.157 95.6544 292.53 93.1254C286.024 91.9211 283.735 96.377 281.205 100.592C276.988 100.592 273.735 99.6286 274.458 94.2092C274.458 93.4867 274.217 92.4028 273.735 92.0415C267.229 86.7426 276.024 84.9362 276.145 81.2029C278.675 82.2867 281.205 83.2502 283.494 84.6953C284.94 85.5383 286.145 86.9835 288.313 87.4652C287.831 86.6222 287.47 85.6588 286.747 84.9362C281.446 79.6373 281.807 76.6266 289.398 75.7836C303.012 74.3384 316.867 74.0976 330.602 73.6158C336.867 73.375 343.132 73.6158 350.12 73.6158C348.313 82.5276 341.084 79.0352 336.626 81.6846V86.3813C330 89.7534 323.373 92.4028 317.711 96.377C314.458 98.6651 312.771 103.241 310.241 106.613C308.072 109.504 305.783 112.394 303.614 115.164C299.157 120.704 292.651 119.379 286.747 119.981H286.988L287.109 119.861Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M826.98 399.858C829.028 397.329 830.233 396.004 831.438 394.439C829.269 393.596 827.1 392.873 824.932 392.151C827.944 386.37 830.715 385.768 837.462 389.14C836.859 390.103 836.257 391.067 835.534 391.91C834.932 392.512 834.088 392.994 833.365 393.475C833.365 394.198 833.486 394.8 833.606 395.523C835.775 395.523 838.425 396.366 839.992 395.402C845.895 391.91 849.63 392.03 855.654 396.245C859.148 398.774 862.883 400.942 867.461 403.832C871.076 408.89 875.533 414.912 879.991 421.054C879.509 421.656 879.027 422.378 878.545 422.981C876.618 421.897 874.329 421.295 872.883 419.729C870.112 416.598 867.943 415.393 864.811 419.488C863.967 420.451 860.714 420.09 858.787 419.488C856.136 418.765 853.606 417.2 850.233 415.634C848.425 407.686 836.859 398.413 827.1 399.738L826.98 399.858Z" fill="currentColor"/>
<path d="M540.839 108.539C536.14 106.371 532.405 104.685 528.309 102.878C527.827 104.564 527.104 106.973 526.502 109.382C526.14 110.586 525.899 111.67 525.538 112.874C521.562 111.67 517.345 110.706 513.61 109.02C512.767 108.659 512.767 105.287 513.369 103.721C514.092 101.794 515.899 100.349 516.622 97.459C513.61 99.0246 510.598 100.711 508.911 101.554C506.381 97.8203 504.092 95.0504 502.526 91.9193C501.803 90.3537 501.803 87.8247 502.647 86.3795C503.49 85.0548 506.02 83.8505 507.466 84.2118C509.996 84.8139 512.285 86.6204 514.092 87.4634C515.417 86.0182 516.863 84.5731 518.309 83.1279C519.755 84.8139 521.2 86.4999 522.767 88.0655C523.971 89.2698 525.297 90.8354 526.743 91.1967C536.02 93.8461 541.08 99.0246 540.839 108.418V108.539Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M790.968 371.313C798.076 372.036 798.558 373.963 797.112 382.152C795.907 389.137 795.425 396.242 792.293 402.746C791.449 404.552 788.799 407.563 788.196 407.322C783.98 405.395 778.558 403.709 776.389 400.216C769.522 388.535 770.124 388.414 781.57 380.827C784.823 378.66 787.233 375.167 790.847 371.313H790.968Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M614.457 428.281C614.698 433.941 615.662 439.721 614.818 445.261C613.493 454.052 610.722 462.603 609.156 471.274C608.071 477.295 603.252 476.573 599.517 476.814C598.313 476.814 596.023 472.478 595.903 470.19C595.782 465.975 596.987 461.76 597.469 457.545C597.71 456.22 598.192 454.534 597.71 453.45C595.662 448.994 597.59 445.622 600.963 443.575C605.903 440.564 608.312 436.108 610.12 431.05C610.481 429.967 611.324 429.124 611.927 428.16C612.77 428.16 613.614 428.16 614.457 428.281Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M484.936 222.836C479.032 223.317 473.129 223.679 467.346 224.16C467.346 223.799 467.105 223.438 466.984 223.197C468.43 222.233 469.996 221.39 471.924 220.066C467.105 214.044 471.683 210.552 476.141 207.18C469.876 203.085 468.551 198.268 471.804 189.718C472.647 187.429 476.743 186.466 479.273 184.9C479.635 185.503 480.117 185.984 480.478 186.586C479.755 188.032 478.912 189.597 478.43 190.681C481.683 197.786 484.815 204.892 488.068 212.238C487.225 215.249 486.02 219.223 484.936 223.076L485.056 222.956L484.936 222.836Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M844.934 252.698C845.778 259.201 846.501 265.824 847.464 272.328C847.946 275.94 847.103 278.59 843.489 280.035C838.79 281.841 833.971 283.407 829.513 285.695C826.862 287.02 824.814 289.549 821.561 292.319C820.718 290.874 818.549 288.826 818.79 287.02C819.272 283.768 819.272 280.035 823.73 278.349C829.031 276.302 833.971 273.291 838.79 270.28C840.115 269.437 841.199 267.029 841.199 265.343C841.32 261.248 840.838 257.033 840.477 252.818C841.922 252.818 843.489 252.698 844.934 252.577V252.698Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M639.394 108.061C637.105 109.867 634.936 112.035 632.527 113.359C628.43 115.648 624.093 117.334 619.876 119.26C619.153 119.622 618.551 120.224 617.828 120.585C611.965 124.037 610.961 128.774 614.816 134.796C615.298 135.518 615.539 136.241 615.9 136.843C611.683 140.938 608.912 140.215 601.684 132.749C604.696 126.848 607.105 120.465 610.961 115.166C612.888 112.516 617.467 111.433 620.96 110.228C626.623 108.301 632.406 106.736 638.069 105.05C638.43 106.013 638.912 106.977 639.273 107.94L639.394 108.061Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M735.537 375.169C741.199 373.363 744.814 375.049 747.344 380.468C748.789 383.599 751.56 386.49 754.452 388.417C759.994 392.15 760.115 398.171 761.681 403.591C762.042 404.674 759.874 406.36 758.91 407.806C755.536 404.915 750.115 402.507 749.151 399.014C747.705 393.836 745.536 389.982 741.681 386.61C738.187 383.599 734.452 380.709 735.537 375.29V375.169Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M431.928 152.622C437.229 153.586 442.41 154.67 449.036 155.874C448.193 154.91 448.675 155.151 448.675 155.513C449.518 159.246 453.856 163.22 449.518 166.833C447.47 168.519 443.615 168.037 440.482 168.519C437.35 169.001 434.338 169.844 432.41 165.99C431.928 164.906 429.76 164.786 427.952 164.063C428.555 162.497 429.157 161.173 429.88 159.487C428.916 159.246 427.711 158.885 426.266 158.523C428.434 155.753 430.241 153.465 432.049 151.057C432.049 151.538 431.928 152.141 431.808 152.622H431.928Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M925.174 523.294C930.234 526.546 930.234 529.797 923.849 534.855C920.235 537.745 916.741 541.117 914.331 545.092C910.958 550.511 906.259 546.296 902.524 547.982L901.078 546.778C903.729 543.406 905.897 539.672 908.909 536.782C913.849 532.085 919.391 528.111 925.174 523.414V523.294Z" fill="currentColor"/>
<path d="M301.694 335.792C286.513 337.839 284.826 337.237 285.911 332.541C281.212 330.012 277.116 327.242 272.537 325.796C268.682 324.472 264.345 324.713 259.525 324.11C260.128 323.267 261.212 320.498 262.537 320.257C271.092 319.293 279.525 319.173 286.272 326.158C287.838 327.723 290.368 328.687 292.657 329.169C296.633 330.012 300.609 330.493 301.694 335.913V335.792Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M526.266 80.6006C536.145 81.4436 545.904 82.1662 556.265 83.0092C554.578 89.1511 550.844 90.7166 545.904 90.7166C535.181 90.7166 527.229 86.8629 526.266 80.6006Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M810.238 406.246C808.31 405.042 806.383 403.717 803.973 402.272C803.371 404.199 802.768 406.006 802.286 407.812C795.419 403.477 795.78 395.167 803.491 386.496C806.624 388.182 809.997 389.868 813.25 391.554C813.13 392.156 813.009 392.638 812.768 393.24C811.202 393.842 809.756 394.444 807.829 395.167C809.033 398.419 810.359 401.67 811.684 405.042C811.202 405.403 810.72 405.765 810.238 406.126V406.246Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M930.838 519.927C929.393 519.324 928.308 518.843 927.465 518.602C929.393 512.942 931.2 507.522 933.368 501.501C934.332 503.307 935.296 505.114 936.139 506.92C939.031 507.161 942.043 507.402 945.296 507.643C940.236 514.748 935.898 520.89 931.561 527.032C930.959 526.671 930.356 526.309 929.874 526.069C930.236 524.021 930.597 522.094 930.838 520.047V519.927Z" fill="currentColor"/>
<path d="M789.152 421.296C780.116 419.249 771.2 417.202 762.164 415.275C762.526 408.531 763.369 408.17 769.152 409.735C773.489 410.94 778.067 412.505 782.525 412.746C787.344 412.987 788.549 416.118 790.116 419.249C789.875 419.972 789.513 420.694 789.272 421.296H789.152Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M684.213 94.81C682.044 88.7885 684.936 86.7412 689.996 86.7412C693.128 86.7412 696.381 87.1025 699.273 88.1864C700.96 88.7885 702.044 90.9562 703.369 92.5218C701.442 93.6057 699.514 95.5325 697.586 95.653C693.249 95.8938 688.912 95.1713 684.092 94.9304L684.213 94.81Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M844.937 252.689C843.491 252.689 841.925 252.809 840.479 252.93C839.516 251.846 837.588 250.642 837.588 249.558C837.588 246.427 838.431 243.295 839.034 239.321C843.732 240.887 848.07 242.212 853.612 244.018C848.793 245.824 851.925 253.532 844.937 252.689Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M808.189 356.269C810.117 354.824 812.045 353.379 814.575 351.452C814.695 350.489 815.057 348.321 815.659 343.985C819.997 348.923 823.37 352.777 826.864 356.751C822.527 358.798 818.912 360.484 814.575 362.411C814.334 361.207 814.093 359.641 813.732 357.714H808.912C808.671 357.233 808.43 356.63 808.189 356.149V356.269Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M792.289 107.699C798.434 108.662 805.06 102.159 809.879 111.673C807.711 112.998 804.578 116.49 802.409 116.009C798.554 115.166 792.048 115.888 792.41 107.699H792.289Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M467.716 203.674V214.272C464.825 214.874 461.813 215.476 458.921 216.078C456.27 206.685 458.439 203.674 467.716 203.674Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M846.615 524.387C850.471 524.628 854.326 524.989 858.543 525.35C859.386 529.926 858.784 534.262 853.965 534.864C847.7 535.707 848.543 529.204 845.893 526.073C846.134 525.591 846.374 524.989 846.615 524.507V524.387Z" fill="currentColor"/>
<path d="M805.778 343.498C802.525 340.126 796.862 338.199 800.477 332.9C801.681 331.214 807.826 330.371 809.031 331.695C813.368 336.151 808.067 339.162 805.778 343.498Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M290.971 172.008C288.803 171.526 286.513 170.924 283.983 170.322C281.333 175.259 278.321 173.814 274.586 169.84C277.718 167.432 280.489 163.337 283.501 163.337C286.393 163.337 289.285 167.311 292.176 169.479C291.815 170.322 291.453 171.165 290.971 172.008Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M798.064 324.474C798.305 319.777 791.558 317.369 797.221 313.274C798.426 312.431 801.679 312.311 801.92 312.792C803.606 316.767 803.004 320.38 798.185 324.474H798.064Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M621.32 88.5489C617.344 88.9102 614.091 89.1511 610.959 89.3919C611.682 87.7059 611.923 85.5382 613.128 84.5747C616.14 82.407 619.031 82.7683 621.32 88.5489Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M697.83 360.966C700.119 364.338 704.577 366.144 700.721 370.239C699.757 371.202 698.191 371.443 696.866 372.045C696.504 370.721 695.782 369.275 695.902 367.951C696.143 365.903 696.986 363.977 697.83 360.966Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M288.914 317.366C291.926 319.533 294.335 321.219 296.745 323.026C297.106 323.387 297.106 324.591 296.745 325.073C296.384 325.555 295.058 326.157 294.817 325.916C292.528 323.507 286.504 323.989 288.793 317.245L288.914 317.366Z" fill="#FFFFFF" fill-opacity="1"/>
<path d="M281.69 337.359C279.28 337.841 276.75 338.202 272.533 339.045C273.979 336.396 274.461 334.107 275.304 333.987C277.473 333.867 279.642 334.589 281.81 334.95V337.359H281.69Z" fill="#FFFFFF" fill-opacity="1"/>
</svg>`;
  }
  

  svgContainer.innerHTML = novoConteudoSVG;
}

const globeGroup = new THREE.Group();
globeGroup.add(group); // a sua esfera da Terra
markers.forEach(marker => globeGroup.add(marker.object)); // se aplicável
scene.add(globeGroup);

function rotateGlobeToContinent(continentName, duration = 1500) {
    const marker = markers.find(m => m.continent === continentName);
    if (!marker) {
        //onsole.warn(Continent "${continenName}" not found.);
        return;
    }

    const targetDirection = marker.position.clone().normalize();
    const desiredForward = new THREE.Vector3(0, 0, 1); // ajuste para sua cena

    const endQuat = new THREE.Quaternion().setFromUnitVectors(targetDirection, desiredForward);
    const startQuat = globeGroup.quaternion.clone();
    const startTime = performance.now();

    function animate(time) {
        const elapsed = time - startTime;
        const t = Math.min(elapsed / duration, 1);

        globeGroup.quaternion.copy(startQuat.clone().slerp(endQuat, t));

        if (t < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

//const testcontinente = document.getElementById('testeContinente');
document.getElementById('testeContinente').addEventListener('click', () => {
   //rotateGlobeToContinent("Europe", 1500);
});




