/************************************************************************/
/*    Graphics 317 coursework exercise 05                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 compatibility

#define MEW 0.3
#define SPECULAR_EXPONENT 10
#define EPSILON 0.00001

#define VEC3_I vec3(1,1,1)
#define XYZ_AND_H(v,h) vec4(v.x, v.y, v.z, h)

void initScene();

in vec3 origin, dir, point;
out vec4 outcolour;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

const int raytraceDepth = 42;
const int numSpheres = 6;

const vec3 lightPos = vec3(6,4,3);

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

#define CONSTANT_ATTENUTAION 1.0
#define LINEAR_ATTENUTAION 0.22
#define QUADRATIC_ATTENUATION 0.20

vec3 computeShadow(in Intersection intersect, vec3 direction)
{

  Intersection i;
  i.hit = 0;

  Ray toLight;
  toLight.origin = intersect.point + EPSILON * intersect.normal;
  toLight.dir = normalize(lightPos - toLight.origin);

  if (Intersect(toLight, i).hit == 1)
  {
    float lightIntensity = 20;
    float d = distance(lightPos, toLight.origin);

    float attenuation = 1.0 / (
        CONSTANT_ATTENUTAION
      + LINEAR_ATTENUTAION * d
      + QUADRATIC_ATTENUATION * d * d
    );

    vec3 r = reflect(toLight.dir, intersect.normal);
    vec3 e = normalize(direction);

    vec3 illumDiffuse = attenuation * lightIntensity * intersect.colour * dot(intersect.normal, toLight.dir);
    vec3 illumSpecular = attenuation * lightIntensity * intersect.colour * pow(max(dot(r, e), 0), SPECULAR_EXPONENT);

    return illumDiffuse + illumSpecular;

  }

  return vec3(0,0,0);
}

vec3 _computeShadow(in Intersection intersect, vec3 viewdir)
{
  //////////////////////////////////////
  //TODO Exercise 5
  //compute the shadow of the objects 
  //using additional rays
  float epsilon = 0.00001;
  Intersection i;
  i.hit = 0;
  Ray toLight;
  toLight.origin = intersect.point + epsilon * intersect.normal;
  toLight.dir = normalize(lightPos - toLight.origin);
  Intersect(toLight, i);
  if(i.hit == 0)
  {
    float lightIntensity = 20;

    float d = distance(lightPos, toLight.origin);
    float con =1.0;
    float lin =0.22;
    float quad=0.20; 
    float attenuation = 1.0 / (con + lin*d + quad*d*d);
    vec3 diffuseColour = intersect.colour;
    vec3 diffuse = lightIntensity * attenuation * diffuseColour * dot(intersect.normal, toLight.dir);

    vec3 specularColour = intersect.colour;
    vec3 r = reflect(toLight.dir, intersect.normal);
    vec3 e = normalize(viewdir);
    float specularExponent = 10;
    vec3 specular = lightIntensity * attenuation * specularColour * pow(max(dot(r, e), 0), specularExponent);
    return diffuse + specular;
  }
  else return vec3(0,0,0);
  //////////////////////////////////////

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
  outcolour = vec4(0,0,0,0);

  // int totalLength = 0;
  int depth = 1;
  float reflectivity = 0.5;
  float totalLength = 0;
  float ambiance = 0.1;

  do
  {

    Intersect(ray, i);

    vec3 colour = ambiance * i.colour + _computeShadow(i, ray.dir);
    outcolour.xyz = outcolour.xyz + colour * pow(reflectivity, depth);

    ray.origin = i.point + EPSILON * i.normal;
    ray.dir = reflect(ray.dir, i.normal);

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
