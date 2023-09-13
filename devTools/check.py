#!/usr/bin/env python3
import fileinput
import re
import sys

WARNING = '\033[93m'
ENDC = '\033[0m'

def myprint(*args):
	global filename
	print(WARNING, filename + ":", ENDC,*args)

def yield_line_and_islastline(f):
	global filename
	global linenumber
	try:
		prevline = next(f)
		filename = fileinput.filename()
		linenumber = fileinput.filelineno()
	except StopIteration:
		return
	for line in f:
		yield (prevline, f.isfirstline())
		filename = fileinput.filename()
		linenumber = fileinput.filelineno()
		prevline = line
	yield prevline, True

pattern = re.compile(r'(<<(\/?) *(if|for|else|switch|case|replace|link)[^a-zA-Z][^<>]*)')

tagfound = []
try:
	for line, isLastLine in yield_line_and_islastline(fileinput.input()):
		for (whole,end,tag) in re.findall(pattern,line):
			if tag == "else" or tag == 'case':
				if len(tagfound) == 0:
					myprint("Found", tag, "but with no opening tag:")
					myprint("  ", linenumber,":", whole)
					fileinput.nextfile()
				lasttag = tagfound[-1]
				if (tag == "else" and lasttag["tag"] != "if") or (tag == "case" and lasttag["tag"] != "switch"):
					myprint("Mismatched else: Opening tag was:")
					myprint("  ",lasttag["linenumber"],":", lasttag["whole"])
					myprint("But this tag was:")
					myprint("  ",linenumber,":", whole)
					fileinput.nextfile()
					break
			elif end != '/':
				tagfound.append({"whole": whole, "linenumber":linenumber,"tag":tag})
			else:
				if len(tagfound) == 0:
					myprint("Found closing tag but with no opening tag:")
					myprint("  ", linenumber,":", whole)
					fileinput.nextfile()
					break
				lasttag = tagfound.pop()
				if lasttag["tag"] != tag:
					myprint("Mismatched tag: Opening tag was:")
					myprint("  ",lasttag["linenumber"],":", lasttag["whole"])
					myprint("Closing tag was:")
					myprint("  ",linenumber,":", whole)
					fileinput.nextfile()
					break

		if isLastLine:
			if len(tagfound) != 0:
				myprint("End of file found but", len(tagfound), ("tag hasn't" if len(tagfound)==1 else "tags haven't"), "been closed:")
			for tag in tagfound:
				myprint("  ", tag["linenumber"],":", tag["whole"])
			tagfound = []
except UnicodeDecodeError as e:
	myprint(e)
	print("   Hint: In Linux, you can get more details about Unicode errors by running:")
	print("	 isutf8", fileinput.filename())
	print("   :Note it might be caused by ", filename)
