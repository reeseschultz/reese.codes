---
title: Activating the Unity Editor's Play Button via Gamepad
excerpt: How to use the start button on your controller to play games in the Unity editor.
date: 2022-08-09
updatedDate: 2022-08-09
tags:
  - unity
  - csharp
---

If you're like me, you are pathologically eager to test changes to the games you
work on. You might be so excited to validate correctness and usability that you
naturally grab your controller, forgetting to first initiate play mode. Then, a
hail of self-resentment buffets your very soul. You gaze upon the Unity editor,
taking a moment to process what you have done. You are holding the controller in
both hands, and yet play mode is inactive. Now you must put the controller back
down.

But no more.

### A Solution

It is high time to put an end to the tyranny of keyboard- and mouse-based
initialization of play mode. With a simple editor script, we shall reclaim our
dignity by starting play mode with the start button on any standard gamepad,
including DualSense and Joy-Con controllers.

Here's the script:

```csharp
#if UNITY_EDITOR

using UnityEditor;
using UnityEngine.InputSystem;

[InitializeOnLoad]
public class PlayWithGamepad
{
    static PlayWithGamepad()
        => EditorApplication.update += Update;

    static void Update()
    {
        var gamepad = Gamepad.current;

        if (gamepad == null) return;

        if (!EditorApplication.isPlaying && gamepad.startButton.isPressed)
        {
            EditorApplication.EnterPlaymode();
        }
    }
}

#endif
```

You are free to use this script to make your life less bad. One caveat is that
said script uses the
[new input system](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.0),
which, honestly, you should be using if you're making games with Unity. The new
input system takes getting used to, but, among other things, it normalizes input
across the spectrum of input devices. It handles deadzones. Perhaps more
importantly, it conventionalizes input mapping, allowing for programmatic
control of bindings from an in-game menu.

### How the Code Works

Unsolicited advice aside, if you're wondering how the script works, it leverages
directives to prevent itself from ending up in builds. A single instance of the
script is loaded during the runtime of the editor with the `InitializeOnLoad`
attribute. The reason the `PlayWithGamepad` class itself is _not_ static is so
that it can have a constructor. We use a parameterless constructor to hook into
the editor's update loop by way of a delegate.

Thus, `Update` becomes a callback beholden to the editor's update loop.

For each time the editor updates, our `Update` method checks for the current
gamepad. No, it's not inefficient to do it that way. Plus, you do **not** want
to do that in the constructor, because what happens if you unplug one controller
and plug in another while the Unity editor is open? You need to know the
_current_ available gamepad not just for this script, but as a general rule for
your games.

Of course, we pass control to the caller early if there is no gamepad. Then, if
play mode isn't already active and the start button is pressed, we enter play
mode.

### Conclusion

Now when you grab your gamepad before entering play mode, no worries. With this
script, you can just press the start button. With the explanation provided, you
should know enough to modify this script to suit your specific needs. For
example, if you do not yet have a pause menu to exit a game, you could,
temporarily, modify the script to turn off play mode. I'll leave that to you.

Hope this helps.
