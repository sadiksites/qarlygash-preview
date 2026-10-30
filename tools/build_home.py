"""Rebuild js/i18n.js and image/team blocks of index.html from data/home.json (run by GitHub Action)."""
import json,re,html,os
os.chdir(os.path.dirname(os.path.abspath(__file__))+'/..')
d=json.load(open('data/home.json'));h=open('index.html').read()
e=lambda s:html.escape(str(s or ''),quote=True)
p=lambda s:str(s or '').lstrip('/')
L=('kk','ru');i18n={l:{} for l in L}
for t in d['texts']:
  for l in L:i18n[l][t['key']]=t.get(l) or t.get('kk') or ''
lis=[]
for i,t in enumerate(d['team']):
  for l in L:
    for f,s in(('name','n'),('role','r'),('exp','e')):i18n[l][f'tm{i}{s}']=(t.get(f) or {}).get(l) or (t.get(f) or {}).get('kk','')
  n=(t.get('name') or {}).get('kk','')
  lis.append(f'<li><img class="tm-photo" src="{e(p(t["photo"]))}" alt="{e(n)}" loading="lazy"><strong data-i18n="tm{i}n">{e(n)}</strong><span data-i18n="tm{i}r">{e(i18n["kk"][f"tm{i}r"])}</span><span data-i18n="tm{i}e">{e(i18n["kk"][f"tm{i}e"])}</span></li>')
h=re.sub(r'(<ul class="soft-cards team-list" role="list">).*?(</ul>)',lambda m:m.group(1)+''.join(lis)+m.group(2),h,flags=re.S)
h=re.sub(r'(hero-photo"><img src=")[^"]*',lambda m:m.group(1)+e(p(d['hero'])),h)
h=re.sub(r'(head-card"><img src=")[^"]*',lambda m:m.group(1)+e(p(d['head_photo'])),h)
def portrait(f):
  try:
    from PIL import Image
    w,hh=Image.open(f).size;return hh>w
  except Exception:return False
def gal(name,cls,alt):
  items=''.join(f'<button type="button" class="gallery-item{" portrait" if (cls or portrait(p(x["image"]))) else ""}" data-full="{e(p(x["image"]))}"><img src="{e(p(x["image"]))}" loading="lazy" alt=""{alt}></button>' for x in d[name] if x.get('image'))
  global h;h=re.sub(r'(data-gallery="%s">).*?(</div>)'%name,lambda m:m.group(1)+items+m.group(2),h,flags=re.S)
gal('awards',True,' data-i18n-alt="awardAlt"');gal('events',False,'')
# fill static KZ text for data-i18n keys so the page reads the same before JS runs
def fill(m):
  k=m.group(2);return m.group(1)+(e(i18n['kk'][k]) if k in i18n['kk'] and '<' not in i18n['kk'][k] else m.group(3))+m.group(4)
h=re.sub(r'(<(?:strong|span|p|h[1-6]|a|li|b|em|small|div)[^>]*data-i18n="([^"]+)"[^>]*>)([^<]*)(<)',fill,h)
open('index.html','w').write(h)
open('js/i18n.js','w').write('window.NURSILA_I18N = '+json.dumps(i18n,ensure_ascii=False,indent=1)+';\n')
