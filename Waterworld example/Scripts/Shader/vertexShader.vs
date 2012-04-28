varying vec3 vNormal;
varying vec3 vPosition;
varying float vNoise;
varying vec3 vTangent;
varying vec3 vBinormal;

varying vec3 tsPosition;
varying vec3 tsCameraPosition;
varying vec3 tsLightSource;

//attribute vec3 normal;
attribute vec4 tangent;
attribute vec2 texCoord;

varying vec2 vUv;
varying float time1;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D texture4;
uniform float uscale;
uniform float time;


const float persist = 0.0565;
float persistence = 1.0;
const int oktave = 4;
float h = 0.0;

vec4 gpuGetCell3D(float x, const float y, float z)
{
   float u = (x + y * 31.0) / 256.0;
   float v = (z - x * 31.0) / 256.0;
   
    return (texture2D(texture0, vec2(u,v)));
}

void main()
{
   vNormal = normal;
   vUv = uv * 8000.0;
   vPosition = position;
   time1 = time;

   float noise = -1.0, temp=3000.0;

   vNoise = noise;
   vec3 noisefaktor = vec3(noise * 0.0515);

   if(noise < 0.0)
   {
       noisefaktor = vec3(0.0);
   }

   vec3 newPosition = position + normal * noisefaktor;
   gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition,1.0 );
}