#!/bin/bash
if [ ! -d ".git" ]; then
	#not running in git repo, so can't use git commands :-)
	echo "No .git repo found - skipping sanity checks"
	exit 0
fi

WARNING='\033[93m'
WARNING='\033[93m'
ENDC='\033[0m'

myprint() {
	while read data; do
		echo -n -e "[$1]$WARNING"
		echo "$data"
	done
}

GREP="git grep -n --color"
# $GREP "<<print .<<" -- 'game/*.twee' | myprint "<<print>>ingBullshit"
# Check, e.g.  <<<
$GREP "<<<[^\\\"']" -- 'game/*.twee' | myprint "tripleOpen"
# Check, e.g.  >>>
$GREP "[^\\\"']>>>" -- 'game/*.twee' | myprint "tripleClose"
# Check, e.g.  <<print "abc" $d, some false positives in complex constructs because git-grep cannot do most (? constructs
# Note: " *" is on purpose, "\s*" doesn't work here in git-grep
    # $GREP -E "^[^']*<<(print|set)[^'\\\">]+('[^']*')([^'>]+'[^']*')* *[_'\\\$]" -- 'game/*' | myprint "RunInConcat"
    # $GREP -E '^[^"]*<<(print|set)[^\\"'"'"'>]+("[^"]*")([^">]+"[^"]*")* *[_"\\\$]' -- 'game/*' | myprint "RunInConcat2"
    # $GREP -E "^[^']*<<(print|set)[^'\\\">]+('[^']*')([^'>]+'[^']*')*[^'>]*([a-np-ru-zA-Z)]|[^t]o|[^i]s|[^o]t) *'" -- 'game/*' | myprint "RunInConcat3"
    # $GREP -E '^[^"]*<<(print|set)[^\\"'"'"'>]+("[^"]*")([^">]+"[^"]*")*[^">]*([a-np-ru-zA-Z)]|[^t]o|[^i]s|[^o]t) *"' -- 'game/*' | myprint "RunInConcat4"
#commented this out because it just seems like a total nightmare to try to understand
$GREP -E "<<print ['\`\"][^'\`\"]+['\`\"][^+]+['\`\"][^'\`\"]['\`\"]" | myprint "RunInConcat"

# Check for missing right angle bracket: <</if>
$GREP "<</[^>]*>[^>]" -- 'game/*'  | myprint "MissingClosingAngleBracket"
$GREP "<<[^>()]*>[^()<>"$'\r]*\r'"\?$" -- 'game/*' | myprint "MissingClosingAngleBracket2"
# Check for missing left angle bracket: </if>>
$GREP "\([^<]\|^\)</\?\(if\|else\|case\|set\|print\|elseif\)" -- 'game/*' | myprint "MissingOpeningAngleBracket2"
# Check for accidental assignment.  e.g.:   <<if $foo = "hello">>
$GREP "<<[ ]*if[^>=]*[^><\!=]=[^=>][^>]*>>" -- 'game/*' | myprint "AccidentalAssignmentInIf"
# Check for accidental assignment.  e.g.:   <<elseif $foo = "hello">>
$GREP "<<[ ]*elseif[^>=]*[^><\!=]=[^=>]*>>" -- 'game/*' | myprint "AccidentalAssignmentInElseIf"
# Check for missing ".  e.g.:   <<if $foo == "hello>>
# $GREP -e "<<[^\"<>]*\"[^\"<>]*>>" -- 'game/*' | myprint "MissingSpeechMark"
# Check for missing ".  e.g.:   <<if $foo = "hello)
# $GREP -e "<<[^\"<>]*\([^\"<>]*\"[^><\"]*\"\| [<>] \)*\"\([^\"<>]*\"[^><\"]*\"\| [<>] \)*\([^\"<>]\| [<>] \)*>>" --and --not -e "*[^']*" -- 'game/*' | myprint "MissingSpeechMark2"
# Check for colours like: @@color:red   - should be @@.red
$GREP -e "@@color:" --and --not -e  "@@color:rgb([0-9 ]\+,[0-9 ]\+,[0-9 ]\+)" -- "game/*" | myprint "UseCssColors"
# Check for missing $ in activeSlave or PC
$GREP "<<[ ]*[^\$><_\[]*\(activeSlave\|PC\)[.]"  -- "game/*" | myprint "MissingDollar"
# Check for closing bracket without opening bracket.  e.g.:  <<if foo)>>	  (but  <<case "foo")>>   is valid, so ignore those
$GREP -e "<<[ a-zA-Z]\+\([^()<>]\|[^()<>][<>][^()<>]\)*)" --and --not -e "<< *case"  -- 'game/*.twee' | myprint "MissingOpeningBracket"
# Check for opening bracket without closing bracket.  e.g.:  <<if (foo>>
$GREP -e "<<[ a-zA-Z]\([^<>]\|[^<>][<>][^<>]\)\+(\([^()<>]\|[^<>()][<>][^<>()]\|([^<>()]*])\)*>>" -- 'game/*.twee' | myprint "MissingClosingBracket"
# Check for two closing brackets but one opening bracket.  e.g.:  <<if (foo))>>
$GREP -e "<<[ a-zA-Z]\+[^()<>]*([^()]*)[^()]*)[^()<>]*>>"  -- "game/*" | myprint "MissingOpeningBracket2"
# Check for one closing bracket but two opening brackets.  e.g.:  <<if ((foo)>>
$GREP -e "<<[ a-zA-Z]\+[^()<>]*([^()]*([^()]*)[^()<>]*>>"  -- "game/*" | myprint "MissingClosingBracket2"
$GREP -e "<<.*[(][^<>)]*[(][^<>)]*)\?[^<>)]*>>" -- "game/*" | myprint "MissingClosingBracket3"
# Check for missing >>.  e.g.:   <<if $foo
# doesn't play well with multiple lines, should be moved to check.py
#$GREP "<<[^<>]*[^,\"\[{"$'\r]\r'"\?$" -- 'game/*' | myprint "MissingClosingAngleBrackets"
#$GREP "<<[^<>]*[^,\"\[{]\?$" -- 'game/*' | myprint "MissingClosingAngleBrackets"
# Check for too many >>>.  e.g.: <</if>>>
$GREP "<<[^<>\"]*[<>]\?[^<>\"]*>>>" -- 'game/*.twee' | myprint "TooManyAngleBrackets"
# Check for too many <<<.  e.g.: <<</if>>
$GREP "<<<[^<>\"]*[<>]\?[^<>\"]*>>" -- 'game/*.twee' | myprint "TooManyAngleBrackets2"
# Check for wrong capitalisation on 'activeslave' and other common typos
$GREP  "\(csae\|[a-z] She \|attepmts\|youreslf\|advnaces\|canAcheive\|setBellySize\|SetbellySize\|gendre\|apperance\|setbellySize\|bellypreg\|pregBelly\|bellyimplant\|bellyfluid\|pronounCaps\|carress\)" -- 'game/*' | myprint "SpellCheck"
$GREP "recieve" -- 'game/*' | myprint "PregmodderCannotSpellReceive"
$GREP "\$slave\[" -- 'game/*' | myprint "ShouldBeSlaves"
# Check for strange spaces e.g.  $slaves[$i]. lips
$GREP "\$slaves\[\$i\]\. " -- 'game/*' | myprint "MissingPropertyAfterSlaves"
# Check, e.g., <<//if>>
$GREP "<</[a-zA-Z]*[^a-zA-Z<>]\+[a-zA-Z]*>>" -- 'game/*' | myprint "DoubleSlash"
# Check, e.g.  <<else $foo==4
$GREP "<<else >\?[^>]" -- 'game/*' | myprint "ShouldBeElseIf"
# Check, e.g.  <</else
$GREP "<</else" -- 'game/*' | myprint "ElseForAnIf"
# Check, e.g., =to
$GREP "=to" -- 'game/*' | myprint "EqualAndTo"
# Check, e.g.  <<set foo == 4>>
$GREP -E "<<set [^{>=]*==" -- 'game/*' | myprint "DoubleEqualsInSet"
# Check for, e.g   <<if slaves[foo]>>
$GREP "<<\([^>]\|[^>]>[^>]\)*[^$]slaves\[" -- 'game/*' | myprint "MissingDollar"
# Check for missing $ or _ in variable name:
$GREP -e "<<[a-zA-Z]\([^>\"]\|[^>]>[^>]\|\"[^\"]*\"\)* [a-zA-Z]\+ * =(?!>)" -- game/* | myprint "MissingDollar2"
# Check for missing command, e.g.  <<foo =
$GREP -e "<<[a-zA-Z]* = *" -- game/* | myprint "BadCommand"
# Check for duplicate words, e.g. with with
$GREP -e  " \(\b[a-zA-Z][a-zA-Z]\+\) \1\b " --and --not -e " her her " --and --not -e " you you " --and --not -e " New New " --and --not -e "true true" --and --not -e "No No" --and --not -e "Slave Slave " --and --not -e " that that " --and --not -e " in in " --and --not -e " is is " -- 'game/*' | myprint "Duplicate words"
# Check for obsolete SugarCube macros
$GREP -E "<<display |<<click|<<.*\.contains" -- game/* | myprint "ObsoleteMacro"
# Check for double articles
$GREP -E "\Wa an\W" -- game/* | myprint "DoubleArticle"
# Check for incorrect articles
$GREP -i -E "\Wa (a|e|i|o|u)." -- game/* | grep -a -i -vE "\Wa (eu|in|on|un|us|ut|ur)." | grep -a -i -vE "(&|<)." | myprint "IncorrectArticle"
$GREP -i -E "\Wan (b|c|d|f|g|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z)\w." -- game/* | grep -a -vE "\W[aA]n ([A-Z]{3,4}|npc)" | myprint "IncorrectArticle2"
# Check for $ sign mid-word
$GREP -i "\w$\w" -- 'game/*.twee' | myprint "VarSignMidWord"
# check for $ sign at beginning of macro
$GREP '<<\s*\$' -- 'game/*'  | myprint "VarSignAtMacroStart"
# check for missing ; before statement
$GREP 'if $ ' -- 'game/*'  | myprint "missing ; before statement"
$GREP 'elseif $ ' -- 'game/*'  | myprint "missing ; before statement"
$GREP '^::[^ ]' -- 'game/*' | myprint "MissingSpaceInMacro"
$GREP '^: ' -- 'game/*' | myprint "MissingColonInMacro"
$GREP -P '[(]0:0(.)[)].*<pass (?!\1)' -- 'game/*' | myprint "MismatchedPassTimes"
$GREP -P '[(]0:([^0].)[)].*<pass (?!\1)' -- 'game/*' | myprint "MismatchedPassTimes2"
# check for the typeof operator NOT being compared to a string; if you write `typeof undefined is undefined`, you'll get false. the return value is a STRING.
$GREP -E "typeof \S+ (===?|is|eq) [^\"']" -- 'game/*' | myprint "TypeofNotComparedToString"
# Look for variables like $foo.bar  where it occurs only once.
# There's a lot of false-positives, but it also catches a lot of
# mistakes, so use grep to filter out the false-positives.
# Feel free to add to the list to filter out false-positives as they occur
git grep -h -o "[$][a-zA-Z0-9_-]\+[.][a-zA-Z0-9_]\+[^a-zA-Z0-9_(]"  -- game | sed -e 's/.$//' | grep -v '[.]\(replace\|deleteAt\|push\|delete\|length\|indexOf\)' | grep -v "[$]\(attitudesControl\|debug\|carried\|dateCount\|newVersionData\|skul_dock\|store\|wardrobe\|shopClothingFilter\|replayScene\|per_npc\|featsBoosts\|_item\|map\|swarm\|NPCList\)" | sort | uniq -u | xargs -I '{}' $GREP '{}' -- 'game/*' | myprint "VariableUsedOnlyOnce"
# Check that we do not have any variables that we use only once.   e.g.	 $onlyUsedOnce
# Ignore  *Nationalities
(
cd game/
find . -name "*.twee" -not -path "./special-templates/*" -exec cat '{}' ';' | tr -c '$a-zA-Z' '\n'  | sed -n '/^[$]/p' | sort | uniq -u | sed 's/^[$]/-e[$]/' | sed 's/$/\\\\W/' | xargs -r  git grep -n --color | myprint "OnlyUsedOnce"

#Find all the variables listed in init.twee
VARIABLELIST=$(cat base-*/init.twee | tr -c '$a-zA-Z' '\n'  | sed -n '/^[$]/p' | sort | uniq)
# Find all variables anywhere.  Commented out because the output is too noisy currently
#VARIABLELIST=$(find . -name "*.twee" -exec cat '{}' ';' | tr -c '$a-zA-Z' '\n'  | sed -n '/^[$]/p' | sort | uniq)
MISSINGFROMVERSIONUPDATE=$(for variable in $VARIABLELIST; do grep -q "$variable" 04-Variables/variables-versionUpdate.twee || echo "$variable"; done)
echo -e "game/04-Variables/variables-versionUpdate.twee$ENDC: $(echo $MISSINGFROMVERSIONUPDATE)" | myprint "MissingFromVersionUpdate"
)

git ls-files "game/*.twee" | xargs -d '\n'  ./devTools/check.py

read -p 'Press [Enter] key to continue...'