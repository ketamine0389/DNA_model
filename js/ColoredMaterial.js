export default class ColoredMaterial {
    clearcoat = 1.0;
    clearcoatRoughness = 0.0;
    metalness = 1.0;
    reflectivity = 1.0;
    color;
    envMap = new THREE.TextureLoader().load('./images/envmap.png', function(texture) {
        return texture;
    });

    constructor(color) {
        this.color = color;
    }
}
