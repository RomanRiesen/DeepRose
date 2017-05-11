#!/usr/bin/python2.4
#usage python closureCompiler.py URL >> toFile#usage python closureCompiler.py URL >> toFile#usage
import httplib, urllib, sys

params = urllib.urlencode([
    ('code_url', sys.argv[1]),
    ('compilation_level', 'WHITESPACE_ONLY'),##'ADVANCED_OPTIMIZATIONS'
    ('output_format', 'text'),
    ('output_info', 'compiled_code'),
  ])

headers = { "Content-type": "application/x-www-form-urlencoded" }
conn = httplib.HTTPConnection('closure-compiler.appspot.com')
conn.request('POST', '/compile', params, headers)
response = conn.getresponse()
data = response.read()
print data
conn.close()
