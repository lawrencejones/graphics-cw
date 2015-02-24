/************************************************************************/
/*    Graphics 317 coursework exercise 04b                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 core

// Simplified IO structures, no geometry shader any more
in vec2 textureUV;
out vec3 color;

// This is the texture of the framebuffer object
uniform sampler2D renderedTexture;

#define D_MAX 0.3
#define N 12

float s[N] =
  float[]( -0.10568,   -0.07568,     -0.042158,
           -0.02458,   -0.01987456,  -0.0112458,
            0.0112458,  0.01987456,   0.02458,
            0.042158,   0.07568,      0.10568  );


void main(){

  ////////////////////////////////////////////////////////////////////
  // TODO Exercise 04b: implement a simple image based blur in following
  ////////////////////////////////////////////////////////////////////

  vec3 rgbBlur = vec3(0.0, 0.0, 0.0);

  for (int i = 0; i < N; i++) {
    float di = s[i] * D_MAX;
    vec2 textureLookup = textureUV + di * normalize(vec2(0.5, 0.5) - textureUV);
    rgbBlur += texture(renderedTexture, textureLookup).xyz;
  }

  color = rgbBlur / N;

  ////////////////////////////////////////////////////////////////////

}
