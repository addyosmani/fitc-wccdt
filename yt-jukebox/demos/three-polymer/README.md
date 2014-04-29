THREE.js Polymer
===============================
I got inspired by https://github.com/kaosat-dev/polymer-threejs after a game jam of creating https://github.com/SuicidalRobot/SuicidalRobot.

Thus THREE POLYMER was born.

Features
--------
* Define your scene in HTML
* Use your browser's debugger to see the current scene state
* Modify attributes on the fly

Example
-------

    <three-scene width="100%" height="100%">
        <three-camera x="1" y="12" z="1" lookAt="sphereMesh"></three-camera>
        
        <three-meshmaterial type="basic" color="0xCC0000" id="sphereMaterial" wireframe="true"></three-meshmaterial>
        <three-sphere radius="5" segments="16" rings="16" id="sphereGeom"></three-sphere>
        <three-mesh id="sphereMesh" geometry="sphereGeom" material="sphereMaterial"></three-mesh>
        
        <three-mesh x="1" y="0" z="5">
            <three-sphere radius="5" segments="16" rings="16"></three-sphere>
            <three-meshmaterial type="basic" color="0x00CC00"></three-meshmaterial>
        </three-mesh>
    </three-scene>
    
Demo
----
 * http://joshgalvin.github.io/three-polymer/examples/spinner.html

Release
-------
... soon