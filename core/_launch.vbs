Set WshShell = CreateObject("WScript.Shell")
dir = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\"))
If Right(dir, 1) <> "\" Then dir = dir & "\"
WshShell.CurrentDirectory = dir
electron = dir & "node_modules\.bin\electron.cmd"
WshShell.Run "cmd /c """ & electron & """ .", 0, False
