;(function() {

"use strict";

var root = this

var has_require = typeof require !== 'undefined'

var THREE = root.THREE || has_require && require('three')
if( !THREE )
	throw new Error( 'MeshLine requires three.js' )

function MeshLine() {

	this.positions = [];

	this.previous = [];
	this.next = [];
	this.side = [];
	this.width = [];
	this.indices_array = [];
	this.uvs = [];
	this.counters = [];
	this.geometry = new THREE.BufferGeometry();

	this.widthCallback = null;

}

MeshLine.prototype.setGeometry = function( g, c ) {

	this.widthCallback = c;

	this.positions = [];
	this.counters = [];

	if( g instanceof THREE.Geometry ) {
		for( var j = 0; j < g.vertices.length; j++ ) {
			var v = g.vertices[ j ];
			var c = j/g.vertices.length;
			this.positions.push( v.x, v.y, v.z );
			this.positions.push( v.x, v.y, v.z );
			this.counters.push(c);
			this.counters.push(c);
		}
	}

	if( g instanceof THREE.BufferGeometry ) {
		// read attribute positions ?
	}

	if( g instanceof Float32Array || g instanceof Array ) {
		for( var j = 0; j < g.length; j += 3 ) {
			var c = j/g.length;
			this.positions.push( g[ j ], g[ j + 1 ], g[ j + 2 ] );
			this.positions.push( g[ j ], g[ j + 1 ], g[ j + 2 ] );
			this.counters.push(c);
			this.counters.push(c);
		}
	}

	this.process();

}

MeshLine.prototype.compareV3 = function( a, b ) {

	var aa = a * 6;
	var ab = b * 6;
	return ( this.positions[ aa ] === this.positions[ ab ] ) && ( this.positions[ aa + 1 ] === this.positions[ ab + 1 ] ) && ( this.positions[ aa + 2 ] === this.positions[ ab + 2 ] );

}

MeshLine.prototype.copyV3 = function( a ) {

	var aa = a * 6;
	return [ this.positions[ aa ], this.positions[ aa + 1 ], this.positions[ aa + 2 ] ];

}

MeshLine.prototype.process = function() {

	var l = this.positions.length / 6;

	this.previous = [];
	this.next = [];
	this.side = [];
	this.width = [];
	this.indices_array = [];
	this.uvs = [];

	for( var j = 0; j < l; j++ ) {
		this.side.push( 1 );
		this.side.push( -1 );
	}

	var w;
	for( var j = 0; j < l; j++ ) {
		if( this.widthCallback ) w = this.widthCallback( j / ( l -1 ) );
		else w = 1;
		this.width.push( w );
		this.width.push( w );
	}

	for( var j = 0; j < l; j++ ) {
		this.uvs.push( j / ( l - 1 ), 0 );
		this.uvs.push( j / ( l - 1 ), 1 );
	}

	var v;

	if( this.compareV3( 0, l - 1 ) ){
		v = this.copyV3( l - 2 );
	} else {
		v = this.copyV3( 0 );
	}
	this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );
	this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );
	for( var j = 0; j < l - 1; j++ ) {
		v = this.copyV3( j );
		this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );
		this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );
	}

	for( var j = 1; j < l; j++ ) {
		v = this.copyV3( j );
		this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );
		this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );
	}

	if( this.compareV3( l - 1, 0 ) ){
		v = this.copyV3( 1 );
	} else {
		v = this.copyV3( l - 1 );
	}
	this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );
	this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );

	for( var j = 0; j < l - 1; j++ ) {
		var n = j * 2;
		this.indices_array.push( n, n + 1, n + 2 );
		this.indices_array.push( n + 2, n + 1, n + 3 );
	}

	if (!this.attributes) {
		this.attributes = {
			position: new THREE.BufferAttribute( new Float32Array( this.positions ), 3 ),
			previous: new THREE.BufferAttribute( new Float32Array( this.previous ), 3 ),
			next: new THREE.BufferAttribute( new Float32Array( this.next ), 3 ),
			side: new THREE.BufferAttribute( new Float32Array( this.side ), 1 ),
			width: new THREE.BufferAttribute( new Float32Array( this.width ), 1 ),
			uv: new THREE.BufferAttribute( new Float32Array( this.uvs ), 2 ),
			index: new THREE.BufferAttribute( new Uint16Array( this.indices_array ), 1 ),
			counters: new THREE.BufferAttribute( new Float32Array( this.counters ), 1 )
		}
	} else {
		this.attributes.position.copyArray(new Float32Array(this.positions));
		this.attributes.position.needsUpdate = true;
		this.attributes.previous.copyArray(new Float32Array(this.previous));
		this.attributes.previous.needsUpdate = true;
		this.attributes.next.copyArray(new Float32Array(this.next));
		this.attributes.next.needsUpdate = true;
		this.attributes.side.copyArray(new Float32Array(this.side));
		this.attributes.side.needsUpdate = true;
		this.attributes.width.copyArray(new Float32Array(this.width));
		this.attributes.width.needsUpdate = true;
		this.attributes.uv.copyArray(new Float32Array(this.uvs));
		this.attributes.uv.needsUpdate = true;
		this.attributes.index.copyArray(new Uint16Array(this.indices_array));
		this.attributes.index.needsUpdate = true;
    }

	this.geometry.addAttribute( 'position', this.attributes.position );
	this.geometry.addAttribute( 'previous', this.attributes.previous );
	this.geometry.addAttribute( 'next', this.attributes.next );
	this.geometry.addAttribute( 'side', this.attributes.side );
	this.geometry.addAttribute( 'width', this.attributes.width );
	this.geometry.addAttribute( 'uv', this.attributes.uv );
	this.geometry.addAttribute( 'counters', this.attributes.counters );

	this.geometry.setIndex( this.attributes.index );

}

function memcpy (src, srcOffset, dst, dstOffset, length) {
	var i

	src = src.subarray || src.slice ? src : src.buffer
	dst = dst.subarray || dst.slice ? dst : dst.buffer

	src = srcOffset ? src.subarray ?
	src.subarray(srcOffset, length && srcOffset + length) :
	src.slice(srcOffset, length && srcOffset + length) : src

	if (dst.set) {
		dst.set(src, dstOffset)
	} else {
		for (i=0; i<src.length; i++) {
			dst[i + dstOffset] = src[i]
		}
	}

	return dst
}

/**
 * Fast method to advance the line by one position.  The oldest position is removed.
 * @param position
 */
MeshLine.prototype.advance = function(position) {

	var positions = this.attributes.position.array;
	var previous = this.attributes.previous.array;
	var next = this.attributes.next.array;
	var l = positions.length;

	// PREVIOUS
	memcpy( positions, 0, previous, 0, l );

	// POSITIONS
	memcpy( positions, 6, positions, 0, l - 6 );

	positions[l - 6] = position.x;
	positions[l - 5] = position.y;
	positions[l - 4] = position.z;
	positions[l - 3] = position.x;
	positions[l - 2] = position.y;
	positions[l - 1] = position.z;

    // NEXT
	memcpy( positions, 6, next, 0, l - 6 );

	next[l - 6]  = position.x;
	next[l - 5]  = position.y;
	next[l - 4]  = position.z;
	next[l - 3]  = position.x;
	next[l - 2]  = position.y;
	next[l - 1]  = position.z;

	this.attributes.position.needsUpdate = true;
	this.attributes.previous.needsUpdate = true;
	this.attributes.next.needsUpdate = true;

};

THREE.ShaderChunk[ 'meshline_vert' ] = [
	'',
	'#include <uv_pars_vertex>',
	'#include <color_pars_vertex>',
	'#include <logdepthbuf_pars_vertex>',
	THREE.ShaderChunk.fog_pars_vertex,
	'',
	'attribute vec3 previous;',
	'attribute vec3 next;',
	'attribute float side;',
	'attribute float width;',
	'attribute float counters;',
	'',
	'uniform vec2 resolution;',
	'uniform float lineWidth;',
	'uniform vec3 color;',
	'uniform float opacity;',
	'uniform float sizeAttenuation;',
	'',
	'varying float vCounters;',
	'',
	'vec2 fix( vec4 i, float aspect ) {',
	'',
	'    vec2 res = i.xy / i.w;',
	'    res.x *= aspect;',
	'	   vCounters = counters;',
	'    return res;',
	'',
	'}',
	'',
	'void main() {',
	'',
	'    float aspect = resolution.x / resolution.y;',
	'    float pixelWidthRatio = 1. / (resolution.x * projectionMatrix[0][0]);',
	'',
	'    #include <color_vertex>',
	'    #include <uv_vertex>',
	'',
	'    mat4 m = projectionMatrix * modelViewMatrix;',
	'    vec4 finalPosition = m * vec4( position, 1.0 );',
	'    vec4 prevPos = m * vec4( previous, 1.0 );',
	'    vec4 nextPos = m * vec4( next, 1.0 );',
	'',
	'    vec2 currentP = fix( finalPosition, aspect );',
	'    vec2 prevP = fix( prevPos, aspect );',
	'    vec2 nextP = fix( nextPos, aspect );',
	'',
	'    float pixelWidth = finalPosition.w * pixelWidthRatio;',
	'    float w = 1.8 * pixelWidth * lineWidth * width;',
	'',
	'    if( sizeAttenuation == 1. ) {',
	'        w = 1.8 * lineWidth * width;',
	'    }',
	'',
	'    vec2 dir;',
	'    if( nextP == currentP ) dir = normalize( currentP - prevP );',
	'    else if( prevP == currentP ) dir = normalize( nextP - currentP );',
	'    else {',
	'        vec2 dir1 = normalize( currentP - prevP );',
	'        vec2 dir2 = normalize( nextP - currentP );',
	'        dir = normalize( dir1 + dir2 );',
	'',
	'        vec2 perp = vec2( -dir1.y, dir1.x );',
	'        vec2 miter = vec2( -dir.y, dir.x );',
	'        //w = clamp( w / dot( miter, perp ), 0., 4. * lineWidth * width );',
	'',
	'    }',
	'',
	'    //vec2 normal = ( cross( vec3( dir, 0. ), vec3( 0., 0., 1. ) ) ).xy;',
	'    vec2 normal = vec2( -dir.y, dir.x );',
	'    normal.x /= aspect;',
	'    normal *= .5 * w;',
	'',
	'    vec4 offset = vec4( normal * side, 0.0, 1.0 );',
	'    finalPosition.xy += offset.xy;',
	'',
	'    gl_Position = finalPosition;',
	'',
	'    #include <logdepthbuf_vertex>',
  THREE.ShaderChunk.fog_vertex && '    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
  THREE.ShaderChunk.fog_vertex,
	'}'
].join( '\r\n' );

THREE.ShaderChunk[ 'meshline_frag' ] = [
	'',
	'uniform vec3 diffuse;',
	'uniform float opacity;',
	'',
	'#include <uv_pars_fragment>',
	'#include <color_pars_fragment>',
	'#include <map_pars_fragment>',
	'#include <alphamap_pars_fragment>',
	'#include <fog_pars_fragment>',
	'#include <logdepthbuf_pars_fragment>',
	'',
	'uniform float dashArray;',
	'uniform float dashOffset;',
	'uniform float dashRatio;',
	'uniform float visibility;',
	'',
	'varying float vCounters;',
	'',
	'void main() {',
	'',
	'    vec4 diffuseColor = vec4( diffuse, opacity );',
	'',
	'    #include <alphatest_fragment>',
	'    #include <logdepthbuf_fragment>',
	'    #include <color_fragment>',
	'    #include <map_fragment>',
	'    #include <alphamap_fragment>',
	'',
	'    if( dashArray != 0. ){',
	'        diffuseColor.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));',
	'    }',
	'',
	'    gl_FragColor = diffuseColor;',
	'    gl_FragColor.a *= step(vCounters, visibility);',
	'',
	'    #include <fog_fragment>',
	'',
	'}'
].join( '\r\n' );

function MeshLineMaterial( parameters ) {

	THREE.ShaderMaterial.call( this, {
		uniforms: THREE.UniformsUtils.merge([
			THREE.UniformsLib.common,
			THREE.UniformsLib.fog,
			{
				lineWidth: { value: 1 },
				resolution: { value: new THREE.Vector2( 1, 1 ) },
				sizeAttenuation: { value: 1 },
				dashArray: { value: 0 },
				dashOffset: { value: 0 },
				dashRatio: { value: 0.5 },
				visibility: {value: 1 },
			}
		]),

		vertexShader: THREE.ShaderChunk.meshline_vert,

		fragmentShader: THREE.ShaderChunk.meshline_frag,

	} );

	this.type = 'MeshLineMaterial';

	Object.defineProperties( this, {
		lineWidth: {
			enumerable: true,
			get: function () {
				return this.uniforms.lineWidth.value;
			},
			set: function ( value ) {
				this.uniforms.lineWidth.value = value;
			}
		},
		map: {
			enumerable: true,
			get: function () {
				return this.uniforms.map.value;
			},
			set: function ( value ) {
				this.uniforms.map.value = value;
			}
		},
		alphaMap: {
			enumerable: true,
			get: function () {
				return this.uniforms.alphaMap.value;
			},
			set: function ( value ) {
				this.uniforms.alphaMap.value = value;
			}
		},
		color: {
			enumerable: true,
			get: function () {
				return this.uniforms.diffuse.value;
			},
			set: function ( value ) {
				this.uniforms.diffuse.value = value;
			}
		},
		opacity: {
			enumerable: true,
			get: function () {
				return this.uniforms.opacity.value;
			},
			set: function ( value ) {
				this.uniforms.opacity.value = value;
			}
		},
		resolution: {
			enumerable: true,
			get: function () {
				return this.uniforms.resolution.value;
			},
			set: function ( value ) {
				this.uniforms.resolution.value.copy( value );
			}
		},
		sizeAttenuation: {
			enumerable: true,
			get: function () {
				return this.uniforms.sizeAttenuation.value;
			},
			set: function ( value ) {
				this.uniforms.sizeAttenuation.value = value;
			}
		},
		dashArray: {
			enumerable: true,
			get: function () {
				return this.uniforms.dashArray.value;
			},
			set: function ( value ) {
				this.uniforms.dashArray.value = value;
			}
		},
		dashOffset: {
			enumerable: true,
			get: function () {
				return this.uniforms.dashOffset.value;
			},
			set: function ( value ) {
				this.uniforms.dashOffset.value = value;
			}
		},
		dashRatio: {
			enumerable: true,
			get: function () {
				return this.uniforms.dashRatio.value;
			},
			set: function ( value ) {
				this.uniforms.dashRatio.value = value;
			}
		},
		visibility: {
			enumerable: true,
			get: function () {
				return this.uniforms.visibility.value;
			},
			set: function ( value ) {
				this.uniforms.visibility.value = value;
			}
		},
	});

	this.setValues( parameters );
}

MeshLineMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );
MeshLineMaterial.prototype.constructor = MeshLineMaterial;

MeshLineMaterial.prototype.isMeshLineMaterial = true;

MeshLineMaterial.prototype.copy = function ( source ) {

	THREE.ShaderMaterial.prototype.copy.call( this, source );

	this.lineWidth = source.lineWidth;
	this.map = source.map;
	this.alphaMap = source.alphaMap;
	this.color.copy( source.color );
	this.resolution.copy( source.resolution );
	this.sizeAttenuation = source.sizeAttenuation;
	this.dashArray.copy( source.dashArray );
	this.dashOffset.copy( source.dashOffset );
	this.dashRatio.copy( source.dashRatio );
	this.visibility = source.visibility;
	this.repeat.copy( source.repeat );

	return this;

};

if( typeof exports !== 'undefined' ) {
	if( typeof module !== 'undefined' && module.exports ) {
		exports = module.exports = { MeshLine: MeshLine, MeshLineMaterial: MeshLineMaterial };
	}
	exports.MeshLine = MeshLine;
	exports.MeshLineMaterial = MeshLineMaterial;
}
else {
	root.MeshLine = MeshLine;
	root.MeshLineMaterial = MeshLineMaterial;
}

}).call(this);
