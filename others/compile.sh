#!/usr/bin/env bash

output=/dev/stdout

#display an error message
function echoError() {
	echo -e "\033[0;31m$*\033[0m"
}

#display message
function echoMessage() {
	echo "$1" >"${output}"
}

function compile() {
	export TWEEGO_PATH=devTools/tweego/storyFormats
	if [ -z ${FORCE_VERSION+true} ]; then
		VERSION="$(git describe --tags --always --dirty)"
	else
		VERSION="$FORCE_VERSION"
	fi
	if [ -z "${VERSION}" ]; then
		TARGET="Degrees of Lewdity.html"
	else
		TARGET="Degrees of Lewdity $VERSION.html"
	fi

	TWEEGO_EXE="tweego"
	if [ ! -f "$(command -v tweego)" ]; then
		case "$(uname -m)" in
			x86_64 | amd64)
				echoMessage "x64 arch"
				if [ "$(uname -s)" = "Darwin" ]; then
					TWEEGO_EXE="./devTools/tweego/tweego_osx64"
				elif [ "$OSTYPE" = "msys" ]; then
					TWEEGO_EXE="./devTools/tweego/tweego_win64"
				else
					TWEEGO_EXE="./devTools/tweego/tweego_linux64"
				fi
				;;
			x86 | i[3-6]86)
				echoMessage "x86 arch"
				if [ "$(uname -s)" = "Darwin" ]; then
					TWEEGO_EXE="./devTools/tweego/tweego_osx86"
				elif [ "$OSTYPE" = "msys" ]; then
					TWEEGO_EXE="./devTools/tweego/tweego_win86"
				else
					TWEEGO_EXE="./devTools/tweego/tweego_linux86"
				fi
				;;
			*)
				echoError "No system tweego binary found, and no precompiled binary for your platform available."
				echoError "Please compile tweego and put the executable in PATH."
				exit 2
				;;
		esac
	fi

	$TWEEGO_EXE "$@" -o  "$TARGET" --head "devTools/head.html" --module "modules" game/ || build_failed="true"

	if [ "$build_failed" = "true" ]; then
		echoError "Build failed."
		exit 1
	else
		if [ "$TARGET" != "Degrees of Lewdity.html" ]; then
			# android builder expects to find a file by this name, and it has to be full copy, not just symlink
			cp "$TARGET" "Degrees of Lewdity.html";
		fi
		echo "Done: \"$TARGET\""
		exit 0
	fi
}

compile "$@"
