## V2 Roadmap

The goal is to have something more clean and readable.

TODO ask to be contributor or the repo at TheSpite !!!!
TODO parse the issues, close the finished issues and at feature on the v2 roadmap
TODO Ask to increase the roadmap

### General

- Have a `dist/` repo with the compiled and minimfied code
- Segment the sources `src/` in modules, use es6.
- Follow the Three.js standart style (add the linter)
- Update and define the latest version of THREE.js supported

### Geometry

 TODO

### Material

- ~~Remove unused attributes/uniforms~~
- ~~Use commons `THREE.UniformsLib` and `THREE.ShaderChunk` into the shader and clean attributes~~.
- Fix the depth line issue (lines sometime in the top of the others)
- Invert the dashRatio value  (0 - dash more visible, 1 - dash more invisible)
- ...
- Check the `visibility` usage (The same is doable with the dash ratio)
- Check the `resolution` usage
- Check the `sizeAttenuation` usage.

### Demos

- Add a dashed demo
- Texture alpha map power of two
- Do not rebuild each time the lines
- ...