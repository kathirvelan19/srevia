@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------

@if "%DEBUG%" == "" @echo off
@classworlds.conf.location=%CLASSWORLDS_CONF%

set ERROR_CODE=0
set MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%
if "%MAVEN_PROJECTBASEDIR%"=="" set MAVEN_PROJECTBASEDIR=%CD%

mvn %*
if ERRORLEVEL 1 exit /B 1
