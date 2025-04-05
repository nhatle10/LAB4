"use strict";

function main() {
    /** @type {HTMLCanvasElement} */
    var canvas = document.getElementById("webglCanvas");
    var gl = canvas.getContext("webgl", { preserveDrawingBuffer: false }); 
    if (!gl) {
        console.error("WebGL not supported or unavailable.");
        return;
    }

    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-fractal", "fragment-shader-fractal"]);


    var positionLocation = gl.getAttribLocation(program, "a_position");
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var centerLocation = gl.getUniformLocation(program, "u_center");
    var scaleLocation = gl.getUniformLocation(program, "u_scale");
    var maxIterationsLocation = gl.getUniformLocation(program, "u_maxIterations");
    var isJuliaLocation = gl.getUniformLocation(program, "u_isJulia"); 
    var juliaCLocation = gl.getUniformLocation(program, "u_julia_c");

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = [ 
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1
        ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const defaultViewState = { centerX: -0.5, centerY: 0.0, scale: 3.0 }; 
    const defaultJuliaViewState = { centerX: 0.0, centerY: 0.0, scale: 3.0 };

    var currentMode = 'mandelbrot';
    var viewState = { ...defaultViewState }; 

    var fractalParams = {
        juliaReal: -0.7,
        juliaImag: 0.27015,
        maxIterations: 150
    };

    var bodyElement = document.body;
    var modeMandelbrotRadio = document.getElementById('modeMandelbrot');
    var modeJuliaRadio = document.getElementById('modeJulia');
    var juliaRealSlider = document.getElementById('juliaReal');
    var juliaImagSlider = document.getElementById('juliaImag');
    var iterationsSlider = document.getElementById('iterations');
    var juliaRealValueSpan = document.getElementById('juliaRealValue');
    var juliaImagValueSpan = document.getElementById('juliaImagValue');
    var iterationsValueSpan = document.getElementById('iterationsValue');
    var resetButton = document.getElementById('resetViewButton');


    function updateFractalParamsUI() {
        juliaRealSlider.value = fractalParams.juliaReal;
        juliaImagSlider.value = fractalParams.juliaImag;
        iterationsSlider.value = fractalParams.maxIterations;
        juliaRealValueSpan.textContent = fractalParams.juliaReal.toFixed(3);
        juliaImagValueSpan.textContent = fractalParams.juliaImag.toFixed(3);
        iterationsValueSpan.textContent = fractalParams.maxIterations;
    }

    function setMode(newMode) {
        currentMode = newMode;
        if (currentMode === 'julia') {
            bodyElement.classList.remove('mandelbrot-mode');
            bodyElement.classList.add('julia-mode');
            modeJuliaRadio.checked = true;
            viewState = { ...defaultJuliaViewState };
        } else {
            bodyElement.classList.remove('julia-mode');
            bodyElement.classList.add('mandelbrot-mode');
            modeMandelbrotRadio.checked = true;
            viewState = { ...defaultViewState };
        }
        requestAnimationFrame(drawScene);
    }

    function resetView() {
         if (currentMode === 'julia') {
            viewState = { ...defaultJuliaViewState };
         } else {
             viewState = { ...defaultViewState };
         }
         requestAnimationFrame(drawScene);
    }

    modeMandelbrotRadio.addEventListener('change', () => setMode('mandelbrot'));
    modeJuliaRadio.addEventListener('change', () => setMode('julia'));
    resetButton.addEventListener('click', resetView);

    juliaRealSlider.addEventListener('input', function() {
        fractalParams.juliaReal = parseFloat(this.value);
        juliaRealValueSpan.textContent = fractalParams.juliaReal.toFixed(3);
        if (currentMode === 'julia') requestAnimationFrame(drawScene);
    });

    juliaImagSlider.addEventListener('input', function() {
        fractalParams.juliaImag = parseFloat(this.value);
        juliaImagValueSpan.textContent = fractalParams.juliaImag.toFixed(3);
        if (currentMode === 'julia') requestAnimationFrame(drawScene); 
    });

    iterationsSlider.addEventListener('input', function() {
        fractalParams.maxIterations = parseInt(this.value);
        iterationsValueSpan.textContent = fractalParams.maxIterations;
        requestAnimationFrame(drawScene);
    });


    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.useProgram(program);

        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
        gl.uniform2f(centerLocation, viewState.centerX, viewState.centerY);
        gl.uniform1f(scaleLocation, viewState.scale);
        gl.uniform1i(maxIterationsLocation, fractalParams.maxIterations);
        gl.uniform1i(isJuliaLocation, currentMode === 'julia' ? 1 : 0); 
        gl.uniform2f(juliaCLocation, fractalParams.juliaReal, fractalParams.juliaImag);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    var isDragging = false;
    var lastMouseX = -1;
    var lastMouseY = -1;

    canvas.addEventListener('mousedown', function(e) {
        if (e.target === canvas) {
            isDragging = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            canvas.style.cursor = 'grabbing';
        }
    });

    canvas.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        var dx = e.clientX - lastMouseX;
        var dy = e.clientY - lastMouseY;
        viewState.centerX -= (dx / gl.canvas.height) * viewState.scale;
        viewState.centerY -= (-dy / gl.canvas.height) * viewState.scale;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        requestAnimationFrame(drawScene);
    });

     function stopDragging() {
         if (isDragging) {
            isDragging = false;
            canvas.style.cursor = 'grab';
        }
    }
    canvas.addEventListener('mouseup', stopDragging);
    canvas.addEventListener('mouseout', stopDragging);


    canvas.addEventListener('wheel', function(e) {
        if (e.target !== canvas) return; 
        e.preventDefault();
        var scaleFactor = e.deltaY < 0 ? 0.9 : 1.1;
        var mouseX = e.clientX;
        var mouseY = e.clientY;

         var uv_before = [(mouseX - 0.5 * gl.canvas.width) / gl.canvas.height,
                          (mouseY - 0.5 * gl.canvas.height) / gl.canvas.height];
         uv_before[1] *= -1;
         var complex_before_zoom = [viewState.centerX + uv_before[0] * viewState.scale,
                                    viewState.centerY + uv_before[1] * viewState.scale];
         viewState.scale *= scaleFactor;
         var complex_after_zoom = [viewState.centerX + uv_before[0] * viewState.scale,
                                   viewState.centerY + uv_before[1] * viewState.scale];
         viewState.centerX += complex_before_zoom[0] - complex_after_zoom[0];
         viewState.centerY += complex_before_zoom[1] - complex_after_zoom[1];
        requestAnimationFrame(drawScene);
    });

    updateFractalParamsUI();
    setMode(currentMode);  
    canvas.style.cursor = 'grab';
    drawScene();           

    window.addEventListener('resize', () => requestAnimationFrame(drawScene));
}

main();