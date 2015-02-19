/************************************************************************/
/*    Graphics 317 coursework exercise 02                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 compatibility
#define MEW 0.3

uniform vec4 ambientColor;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform float specularExponent;
uniform int shader;

in fragmentData
{
  vec3 pos;
  vec3 normal;
  vec4 color;
} frag;

///////////////

void main()
{
  vec4 outcol = frag.color;

  if (shader == 2)
  {
    ///////////////////////////////////////////////////
    //TODO add code for exercise 2.2 Phong shading here
    ///////////////////////////////////////////////////

    float d = distance(frag.pos, gl_LightSource[0].position.xyz);
    float attenuation = 1.0 / (
        gl_LightSource[0].constantAttenuation
      + gl_LightSource[0].linearAttenuation * d
      + gl_LightSource[0].quadraticAttenuation * d * d
    );

    vec3 l = normalize(gl_LightSource[0].position.xyz - frag.pos);
    vec3 r = reflect(-l, frag.normal);
    vec3 e = normalize(-frag.pos);

    vec4 illumDiffuse = attenuation * diffuseColor * max(dot(frag.normal, l), 0);
    vec4 illumSpecular = attenuation * specularColor * max(pow(dot(r, e), MEW * specularExponent), 0);

    outcol = ambientColor + illumDiffuse + illumSpecular;

    ///////////////////////////////////////////////////
  }

  if (shader == 3)
  {
    ///////////////////////////////////////////////////
    //TODO add code for exercise 2.3 toon shading here
    ///////////////////////////////////////////////////


    ///////////////////////////////////////////////////
  }

  gl_FragColor = outcol;
}
