---
url: /blog/post/the-real-ultimate-guide-to-fixing-omnisharp-in-vs-code/ # for backward compatibility with old blog
title: The Real Ultimate Guide to Fixing OmniSharp in VS Code
excerpt: If OmniSharp/IntelliSense isn't working for your C#/Unity projects, this may be the tutorial for you.
date: 2021-08-28
updatedDate: 2022-08-06
tags:
  - csharp
  - unity
---

**Update**: Believe it or not, in the year since this post was originally
written, it's become even more difficult to get OmniSharp working in VS Code.
Fortunately for you, I've updated the information here accordingly. Hopefully
this minimizes or fully eliminates troubleshooting on your part.

---

Getting OmniSharp working on a fresh OS install can be frustrating. Worse,
sometimes it just breaks. In this tutorial, I'll go over some common steps one
can take to fix it. I also address some specific things Linux and Unity game
engine users can do to get that sweet code completion working.

### Everyone Needs the .NET SDK and C# Extension

No matter what operating system you use, for OmniSharp/IntelliSense to work, you
must install the
[.NET SDK](https://dotnet.microsoft.com/download/dotnet/sdk-for-vs-code) if you
don't already have it.

To check that the .NET SDK works, open a terminal (PowerShell in the case of
Windows) and enter the following:

```bash
dotnet --version
```

If that results in an error, you may need to restart the terminal or manually
update your `PATH` variable.

---

The other thing everyone needs is the
[OmniSharp C# extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp).
Don't forget to install this VS Code extension! It doesn't ship with VS Code by
default.

### Non-Windows Users Need Mono

If you're on Linux or macOS, you need to install
[Mono](https://www.mono-project.com/download/stable/). After doing so, check
that it installed correctly with:

```bash
mono --version
```

That should not result in an error, unless something still isn't quite right. If
that's the case, consider restarting the terminal or updating your `PATH`
variable.

#### Mono Path

Non-Windows users must also go to _File » Preferences » Settings_ in VS Code.
Then type "mono path" into the search bar. Be sure to set _OmniSharp: Mono Path_
to the output of `which mono`, which should _not_ be an empty string—otherwise,
there's a fun problem for you to investigate.

#### Additional Setup for Unity

For autocompletion in Unity projects, within VS Code you must ensure _OmniSharp:
Use Modern Net_ is disabled via _File » Preferences » Settings_. This is
necessary. Uncheck that box.

On top of that, non-Windows users must
[install MSBuild](https://launchpad.net/~eofla/+archive/ubuntu/msbuild), because
it's
[no longer included with OmniSharp](https://github.com/OmniSharp/omnisharp-vscode/issues/5120).
How convenient.

### Unity Editor Configuration

#### UPM

While in the Unity editor, go to _Window » Package Manager_. Ensure the _Visual
Studio Code Editor_ package is installed (it probably is).

In the past, versions of this package have ironically broken code completion,
and needed to be patched as a result. Generally speaking, you want to try to use
the latest version. If you try everything in this guide, and code completion is
still broken, then downgrading this package may be worth a try.

#### Project Preferences

Still in the Unity editor, go to _Edit » Preferences » External Tools_. Note
that these are preferences that aren't specific to any given Unity project. Then
make sure VS Code is set in the _External Script Editor_. If you have multiple
binaries of VS Code, select the one with the right permissions.

Furthermore, check the following:

- Embedded packages
- Local packages
- Registry packages
- Git packages
- Built-in packages
- Local tarball

For good measure, click on _Regenerate project files_, and save your project.

It's recommended that, after adding new packages, you simply open your Unity
project by clicking on _Assets » Open C# Project_, which regenerates all checked
types of project files _and_ opens the project in VS Code.

### Conclusion

If you're still having issues in spite of following this guide, I feel for you.
Try restarting things, before trying anything else. Also, remember that you have
to be patient with OmniSharp when it starts up. If it has a lot of project files
to analyze, it could take minutes before IntelliSense starts working.

There are times when OmniSharp does not start up at all, in which case you can
run a command to restart it. In VS Code, you can use the `Ctrl+Shift+P`
keybinding to enter commands. After using that keybinding, type in "restart
omnisharp" and press enter.

I hope this saves you some time.
