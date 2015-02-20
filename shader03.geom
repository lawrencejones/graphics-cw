/************************************************************************/
/*    Graphics 317 coursework exercise 03                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 compatibility
#extension GL_ARB_geometry_shader4 : enable

layout (max_vertices = 72) out;

const float pi = 3.14159265359;

uniform vec4 ambientColor;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform float specularExponent;

uniform int level;
uniform float time;

in vertexData
{
	vec3 pos;
	vec3 normal;
	vec4 color;
} vertices[];

out fragmentData
{
	vec3 vpos;
	vec3 normal;
	vec4 color;
} frag;

#define BARY(elems, prop) \
  s * elems[0].prop + \
  t * elems[1].prop + \
  c * elems[2].prop

/* Use Barycentric co-ordinates to create a vertex of interpolated
   properties at s & t along the triangle. Use property that point
   should be within initial triangle to calculate c. */
void createBarycentricVertex(float s, float t)
{

  float c = 1 - s - t;

  frag.vpos = BARY(vertices, pos);
  frag.normal = BARY(vertices, normal);
  frag.color = BARY(vertices, color);

  gl_Position = BARY(gl_in, gl_Position);

  EmitVertex();

}

void main()
{
	///////////////////////////////////////////////////////
	// TODO replace pass through shader with solution
	///////////////////////////////////////////////////////

  float step = 1.0 / pow(2, level);

  for (float s = 0; s < 1; s += step)
  {
    // Create three bordering triangle vertices
    for (float t = 0; t < 1 - s; t += step)
    {
      createBarycentricVertex(s, t);
      createBarycentricVertex(s + step, t);
      createBarycentricVertex(s, t + step);
      EndPrimitive();
    }
  }

}

