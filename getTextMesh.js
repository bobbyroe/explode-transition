import * as THREE from "three";
import { TextGeometry } from "jsm/geometries/TextGeometry.js";
import { FontLoader } from "jsm/loaders/FontLoader.js";

export async function getTextMesh({hex = 0x000000, text = 'CLICK'} = {}) {
    const fontLoader = new FontLoader();
    const optimer = './assets/optimer_regular.typeface.json';
    const font = await fontLoader.loadAsync(optimer);
    const textGeo = new TextGeometry(text, {
        font,
        size: 0.15,
        height: 0.01
    });
    textGeo.center();
    const textMat = new THREE.MeshBasicMaterial({
        color: hex
    });
    return new THREE.Mesh(textGeo, textMat);
}