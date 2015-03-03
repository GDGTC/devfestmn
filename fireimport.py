#!/usr/bin/python

import sys, os, getopt, re, json

"""
Script that parses every JSON file in a directory and converts it into one
BIG, Firebase-import-ready JSON file.

To execute: python fireimport.py -p <path/to/folder> -o <outputfile>

Courtesy: Mike McDonald: https://gist.github.com/mcdonamp/e3d1be2e75624a14209f
"""

def main(argv):
	inputpath = ''
	outputfile = ''
	verbose = False;
	outputDictionary = {}
	try:
		opts, args = getopt.getopt(argv, "vhp:o:")
	except getopt.GetoptError:
		print 'fireimport.py'
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			print 'fireimport.py -p <path/to/folder> -o <outputfile>'
			sys.exit()
		elif opt in ("-v"):
			verbose = True;
		elif opt in ("-p"):
			inputpath = arg
		elif opt in ("-o"):
			outputfile = arg
	if verbose:
		print "Input path is:", inputpath
		print "Output file is:", outputfile
	roomNamingPattern = re.compile("[a-zA-Z0-9%][a-zA-Z0-9%\.@_:\-]{0,127}\.json")
	for currentFileName in os.listdir(inputpath):
		# Check that the file is valid
		if roomNamingPattern.match(currentFileName):
			if verbose:
				print currentFileName, " is a match"
		else :
			if verbose:
				print currentFileName, " is not a match"
		if verbose:
			print "Opening file", currentFileName
		currentFile = open(inputpath + "/" + currentFileName)	#*NIX only solution right now...
		fileContents = json.loads(currentFile.read())
		if verbose:
			print "Sanitizing objects in file", currentFileName
		fileContents = sanitizeObject(fileContents)
		outputDictionary[currentFileName.split(".")[0]] = fileContents
		if verbose:
			print "Sanitization complete, closing file", currentFileName
		currentFile.close()
	if verbose:
		print "Printing to file", outputfile
	json.dump(outputDictionary, open(outputfile, "w"))

# Sanitize JSON objects
def sanitizeObject(object):
	if type(object) is dict:
		for key in object.keys():
			firebaseKeyRegex = re.compile("[\.\#\$\[\]\/]")	#Regex to check keys against Firebase
			if firebaseKeyRegex.match(key):
				keyBeforeSanitization = key
				key = sanitizeKey(keyBeforeSanitization)
				object[key] = object[keyBeforeSanitization]
				del object[keyBeforeSanitization]
			object[key] = sanitizeObject(object[key])
	elif type(object) is list:
		for item in object:
			object[object.index(item)] = sanitizeObject(item)
	return object

# Get rid of disallowed values for keys in Firebase
def sanitizeKey(key):
	key = key.replace(".","-dot-")
	key = key.replace("#","-hash-")
	key = key.replace("$","-dollar-")
	key = key.replace("/","-slash-")
	key = key.replace("[","-leftsquare-")
	key = key.replace("]","-rightsquare-")
	return key

# Main program
if __name__ == "__main__":
	main(sys.argv[1:])
