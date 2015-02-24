/************************************************************************/
/*    Graphics 317 coursework exercise 03                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 compatibility
#define MEW 0.3

uniform vec4 ambientColor;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform float specularExponent;

uniform sampler2D textureImage;

in fragmentData
{
  vec3 vpos;
  vec3 normal;
  vec4 color;
  //Exercise 4:
  vec4 texCoords;
} frag;

///////////////

void main()
{

  //////////////////////////////////////////////////////////
  //TODO Exercise 04a: integrate the texture information
  // into a Phong shader (e.g. into the one from Exercise 2)
  //////////////////////////////////////////////////////////

  float d = distance(frag.vpos, gl_LightSource[0].position.xyz);
  float attenuation = 1.0 / (
      gl_LightSource[0].constantAttenuation
    + gl_LightSource[0].linearAttenuation * d
    + gl_LightSource[0].quadraticAttenuation * d * d
  );

  vec3 l = normalize(gl_LightSource[0].position.xyz - frag.vpos);
  vec3 r = reflect(-l, frag.normal);
  vec3 e = normalize(-frag.vpos);

  vec4 illumDiffuse = attenuation * diffuseColor * max(dot(frag.normal, l), 0);
  vec4 illumSpecular = attenuation * specularColor * max(pow(dot(r, e), MEW * specularExponent), 0);

  gl_FragColor = texture2D(textureImage, frag.texCoords.st) + illumDiffuse + illumSpecular;

  //////////////////////////////////////////////////////////


}
