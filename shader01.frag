/************************************************************************/
/*    Graphics 317 coursework exercise 01                               */
/*    Author: Bernhard Kainz                                            */
/*    Nothing to be done in this file for this exercise                 */
/************************************************************************/

#version 150 compatibility

in vertexData
{
	vec3 vpos;
	vec3 normal;
	vec4 color;
}frag;


void main()
{
	//pass-trough shaders
	gl_FragColor = frag.color;
}
