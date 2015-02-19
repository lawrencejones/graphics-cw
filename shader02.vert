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

out vertexData
{
  vec3 pos;
  vec3 normal;
  vec4 color;
} vertex;

/////////////

void main()
{
  vertex.pos = vec3(gl_ModelViewMatrix * gl_Vertex);
  vertex.normal = normalize(gl_NormalMatrix * gl_Normal);
  gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;

  if (shader == 1)
  {
    ///////////////////////////////////////////////////
    // TODO add code for exercise 2.1 Gouraud shading here
    ///////////////////////////////////////////////////

    float d = distance(vertex.pos, gl_LightSource[0].position.xyz);
    float attenuation = 1.0 / (
        gl_LightSource[0].constantAttenuation
      + gl_LightSource[0].linearAttenuation * d
      + gl_LightSource[0].quadraticAttenuation * d * d
    );

    vec3 l = normalize(gl_LightSource[0].position.xyz - vertex.pos);
    vec3 r = reflect(-l, vertex.normal);
    vec3 e = normalize(-vertex.pos);

    vec4 illumDiffuse = attenuation * diffuseColor * max(dot(vertex.normal, l), 0);
    vec4 illumSpecular = attenuation * specularColor * max(pow(dot(r, e), MEW * specularExponent), 0);

    vertex.color = ambientColor + illumDiffuse + illumSpecular;

    ///////////////////////////////////////////////////
  }
}
