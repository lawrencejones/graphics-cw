/************************************************************************/
/*    Graphics 317 coursework exercise 05                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 compatibility

#define MEW 0.3
#define SPECULAR_EXPONENT 100

#define VEC3_I vec3(1,1,1)
#define XYZ_AND_H(v,h) vec4(v.x, v.y, v.z, h)

void initScene();

in vec3 origin, dir, point;
out vec4 outcolour;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

const int raytraceDepth = 42;
const int numSpheres = 6;

struct Ray
{
  vec3 origin;
  vec3 dir;
};
struct Sphere
{
  vec3 centre;
  float radius;
  vec3 colour;
};
struct Plane
{
  vec3 point;
  vec3 normal;
  vec3 colour;
};

struct Intersection
{
  float t;
  vec3 point;     // hit point
  vec3 normal;     // normal
  int hit;
  vec3 colour;
};

////////////////////////////////////////////////////////////////////
// TODO Exercise 5: implement a simple geometry based ray tracing
// implement the functions in the following.
// In order to reach all points you need to implement at least one
// feature more than shown in the coursework description
// effects like refraction, scattering, caustics, soft hadows, etc.
// are possible.
////////////////////////////////////////////////////////////////////

/* If the given sphere and ray intersect in a position that is closer than the
   given intersect, then will replace the intersection metrics with those
   calculated for the sphere and ray. */
void sphere_intersect(Sphere sph, Ray ray, inout Intersection intersect)
{

  /* Once simplified, the solution to the intersection formula becomes
     as below. The a parameter is 1, and a common factor of 4 can be
     taken from the discriminant out of the root, allowing for a to
     cancel entirely.

     µ = -(d . ∂p) ± √{ (d . ∂p)^2 - (|∂p|^2 - r^2) }

  */

  vec3 dp = ray.origin - sph.centre;

  float b = dot(ray.dir, dp),  // (d . ∂p)
        c = pow(length(dp), 2) - pow(sph.radius, 2),  // |∂p|^2 - r^2
        discriminant = pow(b, 2) - /* a=1 */c;

  if (discriminant > 0) {

    float mew = max(-b - sqrt(discriminant), 0);  // ray entry

    if (mew > 0 && (mew < intersect.t || intersect.hit == 0)) {

      intersect.hit = 1;
      intersect.t = mew;

      intersect.point = ray.origin + (mew * ray.dir);
      intersect.normal = normalize(intersect.point - sph.centre);
      intersect.colour = sph.colour;

    }

  }

}

void plane_intersect(Plane pl, Ray ray, inout Intersection intersect)
{

  float a = dot(ray.origin - pl.point, pl.normal),  // (p0 - p1) . n
        b = dot(ray.dir, pl.normal);  // (d . n)

  // No intersection
  if (b == 0) { return; }

  float mew = - (a / b);

  if (mew > 0 && (mew < intersect.t || intersect.hit == 0)) {

    intersect.hit = 1;
    intersect.t = mew;

    intersect.point = ray.origin + (mew * ray.dir);
    intersect.normal = pl.normal;

    bool isBlack = mod(floor(intersect.point.x), 2) == mod(floor(intersect.point.z), 2);
    intersect.colour = isBlack ? vec3(0.5, 0.5, 0.5) : pl.colour;

  }

}

Sphere sphere[numSpheres];
Plane plane;

/* Given a ray and an intersection, will find the nearest intersection
   with either the plane or any of the spheres in the scene. */
Intersection Intersect(Ray r, inout Intersection i)
{

  i.hit = 0;
  plane_intersect(plane, r, i);

  for (int j = 0; j < numSpheres; j++) {
    sphere_intersect(sphere[j], r, i);
  }

  return i;

}

int seed = 0;
float rnd()
{
  seed = int(mod(float(seed)*1364.0+626.0, 509.0));
  return float(seed)/509.0;
}

vec3 computeShadow(in Intersection intersect)
{
  ////////////////////////////////////////////////////////////////////
  // TODO
  ////////////////////////////////////////////////////////////////////

  return vec3(0,0,0);
}

vec4 shadeByPhong(Intersection intersection, vec3 lightSource)
{

  float d = distance(intersection.point, lightSource.xyz);
  float attenuation = 1.0 / (
      gl_LightSource[0].constantAttenuation
    + gl_LightSource[0].linearAttenuation * d
    + gl_LightSource[0].quadraticAttenuation * d * d
  );

  vec3 l = normalize(lightSource - intersection.point);
  vec3 r = reflect(-l, intersection.normal);
  vec3 e = normalize(-intersection.point);

  vec4 illumAmbient = XYZ_AND_H((0.1 * intersection.colour * vec3(1, 1, 1)), 1);
  vec4 illumDiffuse = XYZ_AND_H((0.5 * attenuation * intersection.colour * max(dot(intersection.normal, l), 0)), 1);
  vec4 illumSpecular = XYZ_AND_H((attenuation * intersection.colour * max(pow(dot(r, e), MEW * SPECULAR_EXPONENT), 0)), 1);

  return illumAmbient + illumDiffuse + illumSpecular;

}

vec3 getRayOrigin(vec3 origin, vec3 displacement)
{
  return (XYZ_AND_H(origin, 1.0) * modelViewMatrix).xyz + displacement;
}

vec3 getRayDirection(vec3 direction)
{
  return normalize((modelViewMatrix * XYZ_AND_H(direction, 1.0)).xyz);
}

void main()
{

  initScene();

  // Initialise intersection and original ray //////////////////////////

  Ray ray;
  ray.origin = getRayOrigin(origin, vec3(-0.5, 0.25, 6));
  ray.dir = getRayDirection(dir);

  Intersection i;

  // int totalLength = 0;
  int depth = 1;
  // int reflectivity = 0.5;

  do
  {
    if (Intersect(ray, i).hit == 1)
    {
      outcolour.xyz = i.colour;
    }
  }
  while (i.hit == 1 && ++depth < raytraceDepth);

}

void initScene() {

  sphere[0].centre   = vec3(-2.0, 1.5, -3.5);
  sphere[0].radius   = 1.5;
  sphere[0].colour = vec3(0.8,0.8,0.8);

  sphere[1].centre   = vec3(-0.5, 0.0, -2.0);
  sphere[1].radius   = 0.6;
  sphere[1].colour = vec3(0.3,0.8,0.3);

  sphere[2].centre   = vec3(1.0, 0.7, -2.2);
  sphere[2].radius   = 0.8;
  sphere[2].colour = vec3(0.3,0.8,0.8);

  sphere[3].centre   = vec3(0.7, -0.3, -1.2);
  sphere[3].radius   = 0.2;
  sphere[3].colour = vec3(0.8,0.8,0.3);

  sphere[4].centre   = vec3(-0.7, -0.3, -1.2);
  sphere[4].radius   = 0.2;
  sphere[4].colour = vec3(0.8,0.3,0.3);

  sphere[5].centre   = vec3(0.2, -0.2, -1.2);
  sphere[5].radius   = 0.3;
  sphere[5].colour = vec3(0.8,0.3,0.8);

  plane.point = vec3(0,-0.5, 0);
  plane.normal = vec3(0, 1.0, 0);
  plane.colour = vec3(1, 1, 1);

  seed = int(mod(dir.x * dir.y * 39786038.0, 65536.0));

}
