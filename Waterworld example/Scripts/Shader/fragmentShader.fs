varying vec3 vNormal;
varying vec3 vPosition;
varying float vNoise;
varying vec2 vUv;
uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D texture4;
uniform sampler2D grass1;

varying vec3 tsPosition;
varying vec3 tsCameraPosition;
varying vec3 tsLightSource;
varying float time1;

uniform vec3 ambientColor; // color of ambient light
uniform vec3 diffuseColor; // color of diffuse lighting
uniform vec3 specularColor; // color of specular highlights
uniform float shininess; // how shiny the surface is
uniform vec2 scaleBias; // x = scale, y = bias

void main()
{
   vec4 mycolor,
   mc0 = texture2D(texture0,vUv), // Wasser.
   mc1 = texture2D(texture1,vUv), // Sand.
   mc2 = texture2D(texture2,vUv), // Gras.
   mc3 = texture2D(texture3,vUv), // Fels.
   mc4 = texture2D(texture4,vUv); // Schnee.
   float wasserc = 1.0,
   sandc = 1.0,
   grasc = 1.0,
   felsc = 1.0,
   schneec = 1.0;
    
   // Wasser.
   if(vNoise < -0.1)
   {
      mycolor = mix(mc0, mc1, vNoise);
   }
   // Wasser-Sand.
   if(vNoise < 0.0)
   {
      mycolor = mix(mc0,mc1,vNoise);
   }
   // Sand.
   if(vNoise >= 0.0){}
   // Sand-Gras.
   if(vNoise > 0.05)
   {
      mycolor = mix(mc1,mc2,vNoise);
   }
   // Gras.
   if(vNoise > 0.08){}
   // Fels.
   if(vNoise > 0.28){}
   // Fels Schnee.
   if(vNoise > 0.65)
   {
      mycolor = mix(mc3, mc4, vNoise);
   }
   // Schnee.
   if(vNoise > 0.7){}

   mycolor = mix(mc0, mc1, vNoise);// + mc2 + mc3 + mc4; 	
   gl_FragColor = mycolor;
}