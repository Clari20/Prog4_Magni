import urllib.request, urllib.error, json
req = urllib.request.Request('http://localhost:8000/api/pagos/create-preference', data=json.dumps({'titulo': 'Test', 'precio': 1000}).encode(), headers={'Content-Type': 'application/json'})
try:
    print(urllib.request.urlopen(req).read().decode()) 
except urllib.error.HTTPError as e:
    print(e.read().decode())
