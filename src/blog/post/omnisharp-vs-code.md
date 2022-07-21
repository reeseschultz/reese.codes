---
url: /blog/post/the-real-ultimate-guide-to-fixing-omnisharp-in-vs-code/ # for backward compatibility with old blog
title: The Real Ultimate Guide to Fixing OmniSharp in VS Code
excerpt: If OmniSharp/IntelliSense isn't working for your C#/Unity projects, this may be the tutorial for you.
date: 2021-08-28
updatedDate: 2021-08-28
tags:
  - misc
---

Getting OmniSharp working on a fresh OS install can be frustrating. Worse,
sometimes it just breaks. In this tutorial, I'll go over some common steps one
can take to fix it. I address some specific things Linux and Unity game engine
users can do to get that sweet code completion working.

### .NET SDK

For OmniSharp/IntelliSense to work, you must install the
[.NET SDK](https://dotnet.microsoft.com/download/dotnet/sdk-for-vs-code) if you
don't already have it.

To check that the .NET SDK works, open a terminal (PowerShell in the case of
Windows) and enter the following:

```bash
dotnet --version
```

If that results in an error, you may need to restart the terminal or manually
update your `PATH` variable.

### Mono

Non-Windows users need [Mono](https://www.mono-project.com/download/stable/).
Windows users can install and use it too, which isn't a bad idea if .NET isn't
working correctly for them.

To check that Mono has been correctly installed, run:

```bash
mono --version
```

That should not result in an error, unless something still isn't quite right.
Consider restarting the terminal or updating your `PATH` variable if that
command results in an error.

### Visual Studio Code Configuration

Super important: open up your extensions by using the `Ctrl+Shift+X` keybinding.
Verify that you even have Microsoft's official C# extension, which includes
OmniSharp/IntelliSense. Without this, things definitely won't work. It's worth
noting that the extension should be kept up-to-date as well.

In addition to the above, you probably need to configure VS Code. Go to _File »
Preferences » Settings_. Then type "mono" into the search bar. Be sure to set
_OmniSharp: Use Global Mono_ to _always_. The _auto_ option may sound good, but
it often doesn't work as one would expect.

There's another setting that should be changed if you installed Mono. Open a
terminal and enter this:

```bash
which mono
```

Copy the resulting path and paste it as the _Mono Path_.

### Unity Configuration

If in the Unity editor, you'll want to go to _Window » Package Manager_. Ensure
the _Visual Studio Code Editor_ package is installed. Sometimes new versions
break code completion, and sometimes old ones do too. Generally speaking, you
want to try to use the latest version. If you try everything in this guide, and
code completion is still broken, then downgrading this package may be worth a
try.

And, of course, there are other caveats to using Unity with VS Code.

While still in the Unity editor, go to _Edit » Preferences » External Tools_.
Note that these are preferences that aren't specific to any given Unity project.

Make sure VS Code is set in the _External Script Editor_.

Furthermore, check the following:

- Embedded packages
- Local packages
- Registry packages
- Git packages
- Built-in packages
- Local tarball

For good measure, click on _Regenerate project files_.

Finally, it's recommended that, after adding new packages, you simply open your
Unity project by clicking on _Assets » Open C# Project_, which regenerates all
checked types of project files _and_ opens the project in VS Code.

### Conclusion

If you're still having issues in spite of following this guide, I feel for you.
Try restarting stuff. Also, remember that you have to be patient with OmniSharp
when it starts up. If it has a lot of project files to analyze, it could take
several minutes before IntelliSense starts working.

There are times when OmniSharp does not start up at all, in which case you can
run a command to restart it. In VS Code, you can use the `Ctrl+Shift+P`
keybinding to enter commands. After using that keybinding, type in "restart
omnisharp" and press enter.

I hope that helps!
