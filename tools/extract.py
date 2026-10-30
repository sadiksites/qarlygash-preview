import json,re
h=open('index.html').read();s=open('js/i18n.js').read();d=json.loads(s[s.index('{'):s.rindex('}')+1])
team=[];i=0
for m in re.finditer(r'<li><img class="tm-photo" src="([^"?]+)[^"]*"',h):
    k=f'tm{i}';team.append({'photo':'/'+m.group(1),'name':{L:d[L][k+'n'] for L in d},'role':{L:d[L][k+'r'] for L in d},'exp':{L:d[L][k+'e'] for L in d}});i+=1
texts={k:{'kk':d['kk'][k],'ru':d['ru'][k]} for k in d['kk'] if not re.match(r'tm\d+[nre]$',k)}
g=lambda n:['/'+x for x in re.findall(r'data-full="([^"]+)"',re.search(r'data-gallery="%s">(.*?)</div>'%n,h).group(1))]
out={'hero':'/'+re.search(r'hero-photo"><img src="([^"?]+)',h).group(1),'head_photo':'/'+re.search(r'head-card"><img src="([^"?]+)',h).group(1),
 'team':team,'awards':g('awards'),'events':g('events'),'texts':texts}
json.dump(out,open('data/home.json','w'),ensure_ascii=False,indent=1)
print(len(team),len(out['awards']),len(out['events']),len(texts))
