Set WshShell = CreateObject("WScript.Shell")
dir = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\"))
WshShell.CurrentDirectory = dir
WshShell.Run "cmd /c npx electron """ & dir & """", 0, False
