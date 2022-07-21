---
url: /blog/post/setting-shadows-recursively-in-unity-gameobjects/ # for backward compatibility with old blog
title: Setting Shadows Recursively in Unity GameObjects
excerpt: Want to turn shadows on and off for a GameObject and all its children? I'll show you how.
date: 2021-08-28
updatedDate: 2021-08-31
tags:
  - unity
  - csharp
---

I wrote an extension method for recursively toggling shadows. You're free to use
it! It's relatively straightforward:

```csharp
public static void SetShadowsRecursively(this GameObject gameObject, ShadowCastingMode mode, bool includeInactive = false)
{
    if (gameObject == null) return;

    var renderers = gameObject.GetComponentsInChildren<Renderer>(includeInactive);

    if (renderers == null) return;

    foreach (var renderer in renderers) renderer.shadowCastingMode = mode;
}
```

### Usage

Copy and paste that code in some utility class. To use it, you can do something
like the following:

```csharp
var parentGameObject = GameObject.CreatePrimitive(PrimitiveType.Sphere);

var childGameObject = GameObject.CreatePrimitive(PrimitiveType.Cube);
childGameObject.transform.parent = parentGameObject.transform;
childGameObject.transform.localPosition = new Vector3(3, 0, 3);

parentGameObject.SetShadowsRecursively(ShadowCastingMode.Off); // No more shadows!
```

### Explanation

Recall that `SetShadowsRecursively` is an _extension method_. This is a special
type of method that extends an existing class. If you find its first parameter
confusing, check out my
[tutorial on extension methods](/blog/post/how-extension-methods-work-in-csharp).

The second parameter is of the type `ShadowCastingMode`, which comes from
`UnityEngine.Rendering` (make sure you import it!). Remember that this is the
parameter:

```csharp
ShadowCastingMode mode
```

It's an `enum` that can be one of four possible values:

- `Off` - Disables shadows.
- `On` - Enables shadows projected outside the object's normals.
- `TwoSided` - Enables shadows projected inside and outside the object's normals
  (you should normally prefer `On` instead).
- `ShadowsOnly` - Makes the object invisible, but its shadows are visible.

The third and final parameter, `includeInactive`, is _optional_. It's false by
default, indicated by the equals sign followed by `false` like so:

```csharp
bool includeInactive = false
```

`includeInactive` means to include inactive GameObjects. For example, if you
have an object pool of inactive GameObjects whose shadow modes you want to
recursively set, this is a necessary parameter. There are other use cases as
well.

Moving on, we need to check if the GameObject is null like so:

```csharp
if (gameObject == null) return;
```

Returning from a void function in this way is called an _early out_. I love
early outs, and so should you. Using them whenever possible to exit a function
keeps your code readable and maintainable.

Next, we get all the renderers recursively with this line:

```csharp
var renderers = gameObject.GetComponentsInChildren<Renderer>(includeInactive);
```

The `var` keyword is a convenience of compile-time type inference. We know
`renderers` is of the type `Renderer[]`, as in an array of renderers, because
that is what `GetComponentsInChildren` is guaranteed to return.

You should know that the name `GetComponentsInChildren` may be a bit of a
misdirect, because it includes components in the parent(!) as well as immediate
children, and their children(!), and so on.

You may also be wondering why I chose to get components of type `Renderer`
instead of `MeshRenderer`. This way it works generically—in addition to
GameObjects with the `MeshRenderer`, the method will apply for those with
`LineRenderer`, and other inheritors of `Renderer`. (Feel free to modify the
method to only affect only specific types.)

Moving on, there is a null check for `renderers`:

```csharp
if (renderers == null) return;
```

Null `renderers` is possible in an exceptional case. Again, an early out is an
acceptable way to deal with this.

Finally, we opt for a single-line `foreach` block to set each `Renderer` to the
specified `mode`:

```csharp
foreach (var renderer in renderers) renderer.shadowCastingMode = mode;
```

Many people detest single-line expressions, but I find them terse and elegant.
Still, change the function to match your sensibilities at your leisure.

### Conclusion

Programmers new to C# may find extension methods and optional parameters jarring
at first, as did I, but I find them to be fantastically useful language
features. Also, Unity's APIs and naming conventions can understandably throw one
for a loop (no pun intended). I hope the extension method and/or tutorial helped
you!
