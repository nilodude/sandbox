https://nilodude.github.io/sandbox/

Sandbox for 3D & Physics PA LOS CHAVALE
=======================================

How this project was setup
--------------------------
El código que convierte el sketch en una aplicación frontend lo he _sacado_ de un curso de udemy que con codigo de descuento sale por 12 pavo pero yo lo he hecho sin ver los videos y logicamente sin pagarlo:

[Curso TypeScript & Three.js (INSTALACION DEL TINGLAO)](https://sbcode.net/threejs/introduction/)

[Curso TypeScript & Three.js (EMPEZAR A ENTENDER THREE.JS)](https://sbcode.net/threejs/scene-camera-renderer/)

Ahí está el guión del curso, y lo he seguido pa poder tener el _boilerplate_ o "la estructura básica de una aplicación typescript con su servidor web" y ya poder concentrarse en el 3D y la fisica. El nota del curso se mete en cosas de three.js también, el curso tambien merece la pena acabarlo.

Dentro de ese guión explica cómo instalar Three.js, **AL PRINCIPIO** no hace falta irse a la docu de Three.js. Una vez el proyecto ya arranca, **SÍ** se trata de preocuparse solo por el [3D (THREE.JS)](https://threejs.org/manual/#en/fundamentals) y la [física (CANNON-ES.JS)](https://pmndrs.github.io/cannon-es/docs/) y lo que viene siendo el la lógica del juego, sea en el propio frontend o comunicándose con un backend.

Digamos que ésta aplicación es _la GPU de esta "consola"_

La combinacion entre Three.js y Cannon-es.js ya hay gente que la ha usado (hay algo de soporte en internet) y he estao investigando y está bastante intuitivo

[Three.js + Cannon.js Tutorial (part 1/2) | Intro to Physics with JavaScript](https://www.youtube.com/watch?v=Ht1JzJ6kB7g)

La pagina oficial de Three.js tiene muchos apartados, por un lado está el [manual](https://threejs.org/manual/#en/fundamentals), en el que se explican de forma mas o menos lenta y segura los conceptos y la manera de entender el rollito. 
Por otro lado está la [documentación](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene) con todas las clases y objetos que trae la librería y ejemplos de cómo se usa.

La clave para ubicarse es fijarse en el menú de navegación:

Manual (izquierda)   Documentacion (derecha)

![image](https://user-images.githubusercontent.com/22574140/205631557-a2b08afd-2d81-415a-9088-0adb1e65cffb.png)  ![image](https://user-images.githubusercontent.com/22574140/205631646-82912ee0-932b-4239-a34e-c03eba7091f7.png)

En el mundo ideal, el manual se supone que está pensado para leerse un número _finito_ de veces, sin embargo la documentación se debe estar consultando constantemente. 
Ambos incluyen ejemplos 100% copiables y pegables y que funcionan. 
Lógicamente hay algunos pasos del "Setup" o "Getting Started" que con este proyecto ya están hechas.

Instalation
-----------
Make sure you have [Node](https://nodejs.org/en/download/) installed/updated on your system.

Download this project's zip and in your **FAVORITE** code editor:
<pre>
cd /sandbox
npm install
</pre>
Once installed run:
<pre>npm run start</pre> 

![npm_run_start](https://user-images.githubusercontent.com/22574140/205627698-06f78ec1-4d09-40b3-9c91-2b1bafb17aea.png)

Visit http://localhost:8080/ and you will be up and running! 
Enhorabuena, sigues sin tener ni puta idea.
