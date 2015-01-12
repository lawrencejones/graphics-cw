/************************************************************************/
/*    Graphics 317 coursework exercise 01                               */
/*    Author: Bernhard Kainz                                            */
/*    Nothing to be done in this file for this exercise                 */
/************************************************************************/

#version 150 compatibility
#extension GL_ARB_geometry_shader4 : enable

#define WINDOWS 1

#if WINDOWS
layout(triangles) in;
layout (triangle_strip, max_vertices=3) out;
#endif

in vertexData
{
	vec3 pos;
	vec3 normal;
	vec4 color;
}VertexIn[3];

out vertexData
{
	vec3 vpos;
	vec3 normal;
	vec4 color;
}vertex;

void main()
{
	for(int i = 0; i < gl_in.length(); i++)
	{
		// copy attributes
		gl_Position = gl_in[i].gl_Position;
		vertex.color = VertexIn[i].color;
		vertex.vpos =  VertexIn[i].pos;
		vertex.normal = VertexIn[i].normal;

		// done with the vertex
		EmitVertex();
	}

}
